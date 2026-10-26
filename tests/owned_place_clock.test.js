import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {hostPlaceClock} from '../src/owned_place_clock_host.js';
import {configurePlaceClock,quotePlaceClock,executePlaceClock,projectPlaceClock,placeClockState,settlePlace,readShelfHistory,validatePlaceClocks} from '../src/owned_place_clock.js';
const potato=JSON.stringify({id:'Cooked potato'}),DAY=1440;
function setup(extra={}){
    const c={clock:0,money:50,location:'Hearthside cottage',owned:['cottage'],inventory:{[potato]:3},observerMeans:[],fail:false,...extra};
    configurePlaceClock({read:()=>c,log:()=>{},settle:({money,items})=>{if(c.fail)throw Error('Storage failure');c.money+=money;for(const i of items)c.inventory[i.key]=(c.inventory[i.key]||0)+i.delta;}});
    domainRegistry.load({});return c;
}
const run=r=>executePlaceClock(quotePlaceClock(r));
test('a stilled hearth ages stored food at its own ratio and charges upkeep',()=>{
    const c=setup();run({type:'still',place:'cottage',days:2});assert.equal(c.money,46);
    run({type:'store',place:'cottage',key:potato});c.clock=DAY;
    const p=settlePlace(placeClockState().places.cottage,c.clock);assert.equal(p.age,DAY*.25);assert.equal(p.drift,DAY*.75);
    const taken=run({type:'take',place:'cottage',key:potato});assert.equal(c.inventory[taken.cost.items[0].key],1,'still fresh after a world day');assert.equal(readShelfHistory(taken.cost.items[0].key).spent,DAY*.25);assert.equal(Object.values(c.inventory).reduce((a,b)=>a+b,0),3);
});
test('lapsed upkeep closes the place, rushes the owed hours onto the shelf and refuses until reopened',()=>{
    const c=setup();run({type:'still',place:'cottage',days:1});run({type:'store',place:'cottage',key:potato});
    c.clock=3*DAY;
    assert.throws(()=>quotePlaceClock({type:'store',place:'cottage',key:potato}),/closed/);
    run({type:'take',place:'cottage',key:potato});assert.equal(c.inventory[potato],2,'spoiled by the rushed hours');
    assert.throws(()=>quotePlaceClock({type:'still',place:'cottage',days:1}),/closed/);
    run({type:'reopen',place:'cottage'});assert.equal(placeClockState().places.cottage.status,'open');run({type:'still',place:'cottage',days:1});
});
test('orderly release pays the owed days instead of a rush',()=>{
    const c=setup();run({type:'still',place:'cottage',days:3});c.clock=DAY;const before=c.money;
    run({type:'release',place:'cottage'});assert.equal(before-c.money,1);assert.equal(placeClockState().places.cottage.drift,0);
});
test('only owned eligible places; money and storage failures change nothing',()=>{
    setup({owned:[]});assert.throws(()=>quotePlaceClock({type:'still',place:'cottage',days:1}),/owned/);
    setup({money:1});assert.throws(()=>quotePlaceClock({type:'still',place:'cottage',days:1}),/coins/);
    const c=setup();const q=quotePlaceClock({type:'still',place:'cottage',days:1});c.fail=true;assert.throws(()=>executePlaceClock(q),/Storage/);assert.equal(c.money,50);assert.deepEqual(placeClockState(),{schema:1,places:{}});
    c.fail=false;c.clock++;assert.throws(()=>executePlaceClock(q),/terms changed/);
});
test('observer routes: nothing away from the place, qualitative present, numeric only with the timekeeping means',()=>{
    const c=setup();run({type:'still',place:'cottage',days:2});run({type:'store',place:'cottage',key:potato});c.clock=DAY/2;
    assert.equal(projectPlaceClock('cottage','present').lines.some(l=>/Ratio/.test(l)),false);
    assert.equal(projectPlaceClock('cottage','sandglass').visible,false);
    run({type:'sandglass',place:'cottage'});assert.equal(c.money,50-4-3);assert.throws(()=>quotePlaceClock({type:'sandglass',place:'cottage'}),/already/);
    assert.match(projectPlaceClock('cottage','sandglass').lines.join(' '),/Ratio 0.25/);
    c.location='Village';assert.equal(projectPlaceClock('cottage','present').visible,false);
});
test('save, reload and legacy save: slice round-trips and an envelope without it loads empty',()=>{
    setup();run({type:'still',place:'cottage',days:2});run({type:'store',place:'cottage',key:potato});
    const env=domainRegistry.save({});domainRegistry.validate(env);const copy=structuredClone(env);
    setup();assert.deepEqual(placeClockState(),{schema:1,places:{}});domainRegistry.load(copy);assert.deepEqual(placeClockState(),env.placeClocks);
    const legacy=structuredClone(env);delete legacy.placeClocks;domainRegistry.load(legacy);domainRegistry.validate(legacy);assert.deepEqual(placeClockState(),{schema:1,places:{}});
    assert.throws(()=>domainRegistry.validate({placeClocks:{schema:1,places:{cottage:{id:'cottage',status:'stilled',stilledUntil:null,at:0,age:0,drift:0,ratio:.25,larder:[]}}}}),/Place clocks/);
});
test('host settle stages the next slice into the same durable write and a failed commit leaves slice, money and items unchanged',()=>{
    const ch={money:50},gp={items:{}},exp={clock:0};let fail=false,seen;
    hostPlaceClock({homes:()=>({properties:{cottage:{tenure:'owned'}}}),expansion:()=>exp,character:()=>ch,locationId:()=>'Hearthside cottage',inventory:()=>({}),
        gameplaySnapshot:()=>gp,assertSpend:()=>{},log:()=>{},commit:plan=>{seen=plan;if(fail)throw Error('Storage failure');ch.money=plan.external.money;}});
    domainRegistry.load({});
    const q=quotePlaceClock({type:'still',place:'cottage',days:1});fail=true;assert.throws(()=>executePlaceClock(q),/Storage/);
    assert.deepEqual(placeClockState(),{schema:1,places:{}});assert.equal(ch.money,50);
    fail=false;executePlaceClock(q);
    assert.equal(seen.nativePatch.placeClocks.places.cottage.status,'stilled','staged for the durable envelope before publication');
    assert.deepEqual(seen.nativePatch.placeClocks,placeClockState());assert.equal(seen.state.clock,0,'no clock advance');
});

const clockFixture=()=>({id:'cottage',status:'stilled',ratio:.25,at:0,age:0,drift:0,stilledUntil:3*DAY,larder:[]});
const partition=(p,ends)=>ends.reduce((place,at)=>settlePlace(place,at),structuredClone(p));
test('quarter-speed age and debt agree across minute/uneven partitions, exact expiry and lapse',()=>{
    const initial=clockFixture();
    for(const end of [1,3,4,1920,1921,3*DAY,3*DAY+1,4*DAY]){
        const long=settlePlace(initial,end),minute=partition(initial,Array.from({length:end},(_,i)=>i+1));
        const uneven=partition(initial,[1,3,7,29,83,1921,3*DAY,3*DAY+1].filter(n=>n<end).concat(end));
        assert.deepEqual(minute,long,`minute partition at ${end}`);assert.deepEqual(uneven,long,`uneven partition at ${end}`);
        assert.equal(long.age+long.remainder+long.drift,end,'elapsed time conserved');
    }
    assert.equal(settlePlace(initial,4).age,1);
    assert.equal(settlePlace(initial,3*DAY).status,'stilled','paid endpoint remains releasable');
    assert.equal(settlePlace(initial,3*DAY+1).status,'closed');
    assert.deepEqual(initial,clockFixture(),'settlement pure');
});
test('mid-remainder reload and serialized import retain fractions; legacy missing remainder starts at saved whole age',()=>{
    setup();const p=settlePlace(clockFixture(),1);
    const env={placeClocks:{schema:1,places:{cottage:p}}};domainRegistry.validate(env);domainRegistry.load(env);
    const saved=domainRegistry.save({});domainRegistry.load(JSON.parse(JSON.stringify(saved)));
    assert.equal(placeClockState().places.cottage.remainder,.25);
    assert.deepEqual(settlePlace(placeClockState().places.cottage,4),settlePlace(clockFixture(),4));
    const legacy=clockFixture();legacy.at=1;legacy.drift=1;
    domainRegistry.validate({placeClocks:{schema:1,places:{cottage:legacy}}});
    assert.equal(settlePlace(legacy,5).age,1,'does not reconstruct discarded historical fraction');
    for(const remainder of [-.25,1,NaN,Infinity])assert.throws(()=>validatePlaceClocks({schema:1,places:{cottage:{...p,remainder}}}),/Place clocks/);
});
test('release pays exact fractional debt, retains age fraction through restart and reopening follows lapse',()=>{
    for(const end of [1920,1921])for(const split of [false,true]){
        const c=setup();run({type:'still',place:'cottage',days:3});
        if(split)for(let at=1;at<end;at++)placeClockState().places.cottage=settlePlace(placeClockState().places.cottage,at);
        c.clock=end;assert.equal(quotePlaceClock({type:'release',place:'cottage'}).cost.money,end===1920?1:2);
    }
    const c=setup();run({type:'still',place:'cottage',days:1});c.clock=1;
    run({type:'release',place:'cottage'});assert.equal(placeClockState().places.cottage.remainder,.25);
    run({type:'still',place:'cottage',days:1});c.clock=4;
    assert.equal(quotePlaceClock({type:'release',place:'cottage'}).cost.money,1);
    const p=settlePlace(placeClockState().places.cottage,c.clock);assert.equal(p.age,1);assert.equal(p.remainder,0);assert.equal(p.drift,2.25);
    c.clock=DAY+2;run({type:'reopen',place:'cottage'});assert.equal(placeClockState().places.cottage.age,DAY+1);assert.equal(placeClockState().places.cottage.remainder,.25);
});
test('partial larder withdrawal and redeposit preserve unequal food histories without nested keys or duplicate stock',()=>{
    const c=setup();run({type:'still',place:'cottage',days:3});run({type:'store',place:'cottage',key:potato});run({type:'store',place:'cottage',key:potato});
    c.clock=1;const take=run({type:'take',place:'cottage',key:potato}),key=take.cost.items[0].key;
    assert.deepEqual(readShelfHistory(key),{schema:1,spent:.25,at:1});assert.equal(placeClockState().places.cottage.larder[0].count,1);
    assert.equal(domainRegistry.ownsItemKey(key),true);
    c.clock=3;run({type:'store',place:'cottage',key});
    const rows=placeClockState().places.cottage.larder;assert.equal(rows.length,2);assert.equal(rows[1].priorAge,2.25);
    assert.equal(rows[0].born,0);assert.equal(rows[1].born,.75);
    c.clock=4;const taken=run({type:'take',place:'cottage',key}).cost.items[0].key;
    assert.deepEqual(readShelfHistory(taken),{schema:1,spent:2.5,at:4});assert.ok(taken.length<200,'flat custody receipt, no nested history');
    assert.equal(Object.values(c.inventory).reduce((a,b)=>a+b,0)+placeClockState().places.cottage.larder.reduce((n,r)=>n+r.count,0),3);
    const env=domainRegistry.save({expansion:{clock:c.clock},inventories:{person:{hero:{[taken]:{count:1}}}}});domainRegistry.validate(env);domainRegistry.load(JSON.parse(JSON.stringify(env)));assert.deepEqual(domainRegistry.save({}).placeClocks,env.placeClocks);
    const future=JSON.stringify({id:'Cooked potato',hearthShelf:{schema:1,spent:1,at:5}});
    assert.throws(()=>domainRegistry.validate({expansion:{clock:4},inventories:{person:{hero:{[future]:{count:1}}}}}),/shelf history/);
    assert.throws(()=>readShelfHistory(JSON.stringify({id:'Stale bread',hearthShelf:{schema:1,spent:1,at:0}})),/shelf history/);
});
test('preserved food expires by retained age after redeposit and projections never commit fractional time',()=>{
    const c=setup();run({type:'still',place:'cottage',days:7});run({type:'store',place:'cottage',key:potato});c.clock=4*DAY;
    const key=run({type:'take',place:'cottage',key:potato}).cost.items[0].key;assert.equal(readShelfHistory(key).spent,DAY);
    run({type:'store',place:'cottage',key});c.clock++;
    const before=structuredClone(placeClockState()),stock=structuredClone(c.inventory),money=c.money;
    for(let i=0;i<4;i++){projectPlaceClock('cottage','present');quotePlaceClock({type:'take',place:'cottage',key});}
    assert.deepEqual(placeClockState(),before);assert.deepEqual(c.inventory,stock);assert.equal(c.money,money);
    assert.match(projectPlaceClock('cottage','present').lines.join(' '),/spoiled/);assert.doesNotMatch(projectPlaceClock('cottage','present').lines.join(' '),/Ratio|min old/);
    c.fail=true;assert.throws(()=>run({type:'take',place:'cottage',key}),/Storage/);assert.deepEqual(placeClockState(),before);assert.deepEqual(c.inventory,stock);
    c.fail=false;const out=run({type:'take',place:'cottage',key});assert.equal(out.spoiled,true);assert.deepEqual(out.cost.items,[]);
});
test('actual food outcomes and release fees agree when many actions commit projected time',()=>{
    const clam=JSON.stringify({id:'Cooked clam'});
    const play=ends=>{
        const c=setup({inventory:{[clam]:1}});run({type:'still',place:'cottage',days:7});run({type:'store',place:'cottage',key:clam});let key=clam;
        for(const at of ends){c.clock=at;const out=run({type:'take',place:'cottage',key});assert.equal(out.spoiled,false);key=out.cost.items[0].key;run({type:'store',place:'cottage',key});}
        c.clock=2881;const out=run({type:'take',place:'cottage',key});
        return {spoiled:out.spoiled,remaining:Object.values(c.inventory).reduce((a,b)=>a+b,0),age:placeClockState().places.cottage.age,remainder:placeClockState().places.cottage.remainder,drift:placeClockState().places.cottage.drift,fee:quotePlaceClock({type:'release',place:'cottage'}).cost.money};
    };
    const long=play([]);assert.deepEqual(play(Array.from({length:2880},(_,i)=>i+1)),long);assert.deepEqual(play([1,3,79,333,720,1000,1919,2880]),long);assert.equal(long.spoiled,true);assert.equal(long.remaining,0);
});
