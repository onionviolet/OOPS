import test from 'node:test';
import assert from 'node:assert/strict';
import {HOUSEHOLD as H, planHousehold, validateHousehold, householdFirewood, stockFirewoodAction} from '../src/absorb_p23/household/model.js';
import {commitHousehold, preflightHouseholdImport} from '../src/absorb_p23/household/host.js';

const variant = JSON.stringify({id:'Rough wood log',quality:75});
function rig() {
    let state;
    const c={clock:0,sequence:0,homeId:'test.home',homeOwned:true,atHome:true,hearthOwned:true,alive:true,controlled:true,
        wet:false,animalKnown:false,ownedInventory:{[H.fuelKey]:8,[variant]:2}};
    const effects=[];
    const run=type=>{
        const result=planHousehold(state,{type,clock:c.clock,sequence:c.sequence+1,...(type==='tick'?{elapsed:c.clock-(state?.lastClock??c.clock)}:{})},c);
        for(const e of result.effects){effects.push(e);if(e.type==='item')c.ownedInventory[e.key]=(c.ownedInventory[e.key]||0)+e.amount;if(e.type==='removeCondition')c.wet=false;}
        state=result.state;c.sequence++;return result;
    };
    return {c,run,effects,state:()=>state,tick:n=>{c.clock+=n;return run('tick');},
        load:s=>{state=preflightHouseholdImport(structuredClone(s),c.clock,c.sequence);}};
}
function litReserve(r,n=2) {for(let i=0;i<n;i++)r.run(stockFirewoodAction());r.run('supply_on');r.run('light');}

test('reserve starts empty/off, holds five paid exact keys and refunds unburned exact stock',()=>{
    const r=rig();assert.deepEqual(householdFirewood(undefined,r.c).logs,[]);assert.equal(householdFirewood(undefined,r.c).enabled,false);
    r.run(stockFirewoodAction(variant));assert.equal(r.c.ownedInventory[variant],1);
    for(let i=0;i<4;i++)r.run(stockFirewoodAction());
    assert.equal(householdFirewood(r.state(),r.c).logs.length,5);
    const before=structuredClone([r.state(),r.c]);assert.throws(()=>r.run('stock_firewood'),/full/);assert.deepEqual([r.state(),r.c],before);
    r.run('withdraw_firewood');assert.equal(r.c.ownedInventory[variant],2,'the same key comes back, not a replacement base log');
    assert.equal(r.state().hearth.fuelMinutes,0);assert.equal(r.state().hearth.firewood.enabled,false);
});

test('selected local reserve refuels at exact exhaustion; whole and split elapsed intervals agree',()=>{
    for(const total of [19,20,21,39,40,41,59,60,61,500]){
        const a=rig(),b=rig();litReserve(a);litReserve(b);
        a.c.wet=b.c.wet=true;a.run('smoke_on');b.run('smoke_on');a.run('close_vent');b.run('close_vent');
        a.tick(total);for(let i=0;i<total;i++)b.tick(1);
        assert.deepEqual(a.state().hearth,b.state().hearth,`hearth at ${total}`);
        assert.deepEqual(a.c.ownedInventory,b.c.ownedInventory);
        assert.equal(a.effects.filter(e=>e.type==='removeCondition').length,1);
        assert.equal(b.effects.filter(e=>e.type==='removeCondition').length,1);
        assert.equal(a.state().lastClock,b.state().lastClock);
    }
    const r=rig();litReserve(r);r.tick(20);assert.equal(r.state().hearth.fuelMinutes,20);assert.equal(r.state().hearth.firewood.logs.length,1);
});

test('off/empty/extinguish stop supply; toggling or restocking does not ignite cold fuel',()=>{
    const r=rig();r.run('stock_firewood');r.run('supply_on');r.tick(10);assert.equal(r.state().hearth.fuelMinutes,0);
    r.run('light');r.run('supply_off');r.tick(20);assert.equal(r.state().hearth.firewood.logs.length,1);
    r.run('supply_on');r.tick(1);assert.equal(r.state().hearth.fuelMinutes,0);
    r.run('light');r.run('extinguish');const stock=structuredClone(r.state().hearth.firewood);
    r.tick(30);assert.deepEqual(r.state().hearth.firewood,stock);assert.equal(r.state().hearth.fuelMinutes,0);
    r.run('light');r.tick(41);assert.equal(r.state().hearth.fuelMinutes,0);assert.equal(r.state().hearth.firewood.logs.length,0);
    r.run('stock_firewood');r.tick(20);assert.equal(r.state().hearth.fuelMinutes,0);assert.equal(r.state().hearth.firewood.logs.length,1);
});

test('departure and lost home/body support burn paid fuel without taking reserve or carried stock',()=>{
    for(const flag of ['atHome','homeOwned','hearthOwned','alive','controlled']){
        const r=rig();litReserve(r);r.c[flag]=false;const pack=structuredClone(r.c.ownedInventory);
        r.tick(100);assert.equal(r.state().hearth.fuelMinutes,0);assert.equal(r.state().hearth.firewood.logs.length,2);
        assert.deepEqual(r.c.ownedInventory,pack);assert.throws(()=>r.run('stock_firewood'),/Household/);
    }
});

test('current-format pending and exhausted supply round trips; zero played time charges nothing',()=>{
    const r=rig();litReserve(r);r.tick(19);
    for(const elapsed of [0,41]){
        const saved=JSON.parse(JSON.stringify(r.state()));r.load(saved);assert.deepEqual(r.state(),saved);
        const pack=structuredClone(r.c.ownedInventory);r.tick(elapsed);assert.deepEqual(r.c.ownedInventory,pack);
        if(!elapsed)assert.equal(r.state().hearth.fuelMinutes,1);
    }
    assert.equal(r.state().hearth.fuelMinutes,0);assert.equal(r.state().hearth.firewood.logs.length,0);
    const saved=structuredClone(r.state());r.load(saved);r.tick(0);assert.deepEqual(r.state().hearth,saved.hearth);
    delete saved.hearth.firewood;r.load(saved);assert.deepEqual(householdFirewood(r.state(),r.c).logs,[]);
});

test('stale/changed usable stock and failed native preflight cannot move or duplicate logs',()=>{
    const r=rig();r.run('stock_firewood');const root={household:r.state(),context:structuredClone(r.c)};
    let publishes=0;
    const host={read:()=>structuredClone(root),preflight:()=>false,publish(){publishes++;}};
    assert.throws(()=>commitHousehold(host,{type:stockFirewoodAction(),sequence:root.context.sequence}),/refused/);
    assert.equal(publishes,0);assert.equal(root.household.hearth.firewood.logs.length,1);
    assert.throws(()=>commitHousehold(host,{type:'withdraw_firewood',sequence:root.context.sequence-1}),/changed terms/);
    r.c.ownedInventory[variant]=0;const before=structuredClone(r.state());assert.throws(()=>r.run(stockFirewoodAction(variant)),/usable owned/);assert.deepEqual(r.state(),before);
    const projection=householdFirewood(r.state(),r.c);projection.logs.push(variant);assert.deepEqual(r.state().hearth.firewood.logs,[H.fuelKey]);
});

test('malformed reserve and forged foreign fuel reject before import mutation',()=>{
    const r=rig();r.run('stock_firewood');
    for(const mutate of [s=>s.hearth.firewood.logs.push(...Array(5).fill(H.fuelKey)),s=>s.hearth.firewood.enabled=1,
        s=>s.hearth.firewood.logs=['not-json'],s=>s.hearth.firewood.logs=[JSON.stringify({id:'Stale bread'})],s=>s.hearth.firewood.extra=1]){
        const bad=structuredClone(r.state());mutate(bad);assert.throws(()=>validateHousehold(bad,r.c),/firewood/);
    }
    assert.throws(()=>stockFirewoodAction(JSON.stringify({id:'Stale bread'})),/Rough wood log/);
});
