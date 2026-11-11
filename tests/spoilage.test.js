import test from 'node:test';
import assert from 'node:assert/strict';
import {readSpoilage,wordsFor,lifeOf,qualityLifeFactor,oldestFirst,resultOf,isPerishable} from '../src/spoilage.js';
import {configurePlaceClock,quotePlaceClock,executePlaceClock,projectPlaceClock,placeClockState,settlePlace} from '../src/owned_place_clock.js';
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
test('FRC42: the Gu opening petal lot is a shared-lot perishable read by the same owner, kept as itself',()=>{
    const petals=JSON.stringify({id:'book.ri.academy.petals'});
    assert.equal(lifeOf(petals),5*DAY);assert.equal(resultOf(petals),null);assert.equal(isPerishable(petals),true);
    assert.equal(readSpoilage(petals,5*DAY+1).state,'spoiled');assert.equal(wordsFor(readSpoilage(petals,DAY)),'fresh, good for about 4 days');
});
