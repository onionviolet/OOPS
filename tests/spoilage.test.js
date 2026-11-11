import test from 'node:test';
import assert from 'node:assert/strict';
import {readSpoilage,wordsFor,lifeOf,qualityLifeFactor,oldestFirst,resultOf,isPerishable,inheritedSpent} from '../src/spoilage.js';
import {configurePlaceClock,quotePlaceClock,executePlaceClock,projectPlaceClock,placeClockState,settlePlace,madeKey,readShelfHistory} from '../src/owned_place_clock.js';
import {domainRegistry} from '../src/domain_registry.js';
const DAY=1440,potato=JSON.stringify({id:'Cooked potato'}),fine=JSON.stringify({id:'Cooked potato',quality:200});
test('ITM8: only perishables spoil; life depends on quality; result is declared',()=>{
    assert.equal(isPerishable(JSON.stringify({id:'Iron sword'})),false);assert.equal(readSpoilage(JSON.stringify({id:'Iron sword'}),9e9),null);
    assert.equal(lifeOf(potato),DAY);assert.equal(lifeOf(fine),2*DAY);assert.equal(qualityLifeFactor(10),.5);assert.equal(resultOf(potato),'Spoiled food');
});
test('state and words: fresh, turning, spoiled; storage rate slows it',()=>{
    assert.equal(wordsFor(readSpoilage(potato,DAY*.1)),'fresh, good for about 1 day');
    assert.equal(wordsFor(readSpoilage(fine,DAY*.1)),'fresh, good for about 2 days');
    assert.equal(readSpoilage(potato,DAY*.6).state,'turning');
    assert.equal(readSpoilage(potato,DAY+1).state,'spoiled');
    assert.equal(readSpoilage(potato,DAY+1,{rate:.25}).state,'fresh','a slowing storage keeps it');
    assert.equal(wordsFor(readSpoilage(potato,DAY*.95)),'turning, good for about 1 hour');
});
test('reading is pure and partition-free: same spent age, same answer; oldest first',()=>{
    const a=readSpoilage(potato,700),b=readSpoilage(potato,700);assert.deepEqual(a,b);
    assert.deepEqual(oldestFirst([{s:1},{s:9},{s:4}],r=>r.s).map(r=>r.s),[9,4,1]);
});
function setup(){
    const c={clock:0,money:50,location:'Hearthside cottage',owned:['cottage'],inventory:{[potato]:2},observerMeans:[]};
    configurePlaceClock({read:()=>c,log:()=>{},settle:({money,items})=>{c.money+=money;for(const i of items)c.inventory[i.key]=(c.inventory[i.key]||0)+i.delta;}});
    domainRegistry.load({});return c;
}
const run=r=>executePlaceClock(quotePlaceClock(r));
test('the stilled hearth shelf shows the state, slows spoilage, and rot is returned as spoiled food; reload is the same',()=>{
    const c=setup();run({type:'still',place:'cottage',days:3});run({type:'store',place:'cottage',key:potato});
    c.clock=DAY; // 6 hours of the place's own time
    assert.match(projectPlaceClock('cottage','present').lines.join('|'),/1 Cooked potato stored, fresh, good for about 1 day/);
    const env=domainRegistry.save({});domainRegistry.validate(env);domainRegistry.load(structuredClone(env));
    assert.match(projectPlaceClock('cottage','present').lines.join('|'),/fresh, good for about 1 day/,'reload does not change it');
    run({type:'release',place:'cottage'});c.clock=DAY+Math.ceil(DAY*1.1);
    const out=run({type:'take',place:'cottage',key:potato});assert.equal(out.spoiled,true);
    assert.equal(c.inventory[JSON.stringify({id:'Spoiled food'})],1);assert.equal(c.inventory[potato],1);
});
test('a stack on the shelf: the older portion is taken first',()=>{
    const c=setup();run({type:'store',place:'cottage',key:potato});c.clock=600;run({type:'store',place:'cottage',key:potato});
    const rows=placeClockState().places.cottage.larder;assert.equal(rows.length,2);
    c.clock=DAY+100; // first portion past a day, second not
    const out=run({type:'take',place:'cottage',key:potato});assert.equal(out.spoiled,true,'oldest first');
});
const clam=JSON.stringify({id:'Cooked clam'}),flour=JSON.stringify({id:'Flour'}),fritters=JSON.stringify({id:'Clam fritters'});
test('BDT35: a product inherits the weighted spent share of perishable inputs; nonperishables do not dilute',()=>{
    const half=lifeOf(clam);
    assert.equal(inheritedSpent([{key:clam,count:3,spent:.8*half}],fritters),.8*DAY);
    assert.equal(inheritedSpent([{key:clam,count:3,spent:.8*half},{key:flour,count:50,spent:0}],fritters),.8*DAY,'flour does not freshen');
    assert.equal(inheritedSpent([{key:clam,count:1,spent:half*5},{key:clam,count:1,spent:0}],fritters),.5*DAY,'each input caps at 1, weighted by count');
    assert.equal(inheritedSpent([{key:flour,count:1,spent:0}],fritters),0,'no perishable input, fresh product');
    assert.equal(inheritedSpent([{key:clam,count:3,spent:half}],flour),0,'nonperishable product has no age');
    assert.equal(inheritedSpent([{key:clam,count:3,spent:.8*half}],fritters,{freshStart:{reason:'boiled and sealed'}}),0);
    assert.throws(()=>inheritedSpent([],fritters,{freshStart:{}}),/reason/);
});
test('BDT35 done check: fritters from 80%-spent clams have less life left than from fresh clams; receipt survives save',()=>{
    const c=setup();c.clock=5000;
    const old=JSON.stringify({id:'Cooked clam',hearthShelf:{schema:1,spent:.5*lifeOf(clam),at:4000}}); // well past a clam's life once held 1000 more minutes
    const aged=JSON.stringify({id:'Cooked clam',hearthShelf:{schema:1,spent:.8*lifeOf(clam)-100,at:4900}}); // 80% spent now
    const fromAged=madeKey(fritters,[{item_key:aged,count:3},{item_key:flour,count:1}],{clock:c.clock});
    const fromFresh=madeKey(fritters,[{item_key:clam,count:3},{item_key:flour,count:1}],{clock:c.clock});
    assert.equal(fromFresh,fritters,'fresh inputs leave a plain key (no held timer)');
    assert.equal(readShelfHistory(fromAged).spent,.8*DAY);
    assert.ok(readSpoilage(fromAged,readShelfHistory(fromAged).spent).left<readSpoilage(fromFresh,0).left);
    assert.ok(readShelfHistory(madeKey(fritters,[{item_key:old,count:3}],{clock:c.clock})).spent<=DAY,'capped at the product life');
    assert.equal(madeKey(flour,[{item_key:aged,count:3}],{clock:c.clock}),flour);
    // both go on the shelf and read differently, and the receipt passes the save validator
    c.inventory={[fromAged]:1,[fromFresh]:1};run({type:'store',place:'cottage',key:fromAged});run({type:'store',place:'cottage',key:fromFresh});
    const lines=projectPlaceClock('cottage','present').lines.join('|');
    assert.match(lines,/Clam fritters stored, fresh, good for about 1 day/);assert.match(lines,/Clam fritters stored, turning, good for about 5 hours/);
    const env=domainRegistry.save({});env.inventories={person:{p:{[fromAged]:{count:1}}}};env.expansion={clock:c.clock};domainRegistry.validate(env);
});
