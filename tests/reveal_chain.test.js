import test from 'node:test';
import assert from 'node:assert/strict';
import {heldLesson,readingRate,practiceMethods,openingAllows} from '../src/reveal_chain.js';
test('herb lesson uses currently held stacks and an explicit learned fact',()=>{
 const row=n=>({item:{id:'Golmoon leaf'},count:n});
 assert.equal(heldLesson({a:row(19)},false),false);
 assert.equal(heldLesson({a:row(12),b:row(8)},false),true);
 assert.equal(heldLesson({a:row(20)},true),false);
 assert.equal(heldLesson({},false),false);
});
test('literacy speeds original work units without changing completion thresholds',()=>{
 assert.equal(readingRate(0),1);assert.equal(readingRate(10),1.5);
 assert.equal(readingRate(100),1.5);assert.equal(readingRate(NaN),1);
 assert.equal(120/readingRate(10),80);
});
test('practice names require a real native level, not incidental XP',()=>{
 assert.deepEqual(practiceMethods({Running:{total_xp:49,current_level:0}}),[]);
 assert.deepEqual(practiceMethods({Running:{current_level:1}}).map(r=>r.id),['run']);
 assert.deepEqual(practiceMethods({Perception:{current_level:1}}).map(r=>r.id),['investigate']);
});
test('opening defaults to full access and preserves recovery at every stage',()=>{
 assert.equal(openingAllows('belongings',false,0),true);
 assert.equal(openingAllows('belongings',true,1),false);
 assert.equal(openingAllows('belongings',true,2),true);
 for(let i=0;i<4;i++)for(const id of ['current-work','messages','customization'])assert.equal(openingAllows(id,true,i),true);
});
import {stageRevealKnowledge} from '../src/reveal_chain.js';
test('transaction stages recipe and wallet before publication without mutating prior stock',()=>{
 const key=JSON.stringify({id:'Golmoon leaf'}),old={[key]:19};
 const plan={state:{actors:{player:{worldId:'away',facts:{}}}},gameplay:{player:{inventory:{[key]:20}}},external:{money:99}};
 stageRevealKnowledge(plan,old,100);
 assert.equal(old[key],19);assert.equal(plan.state.actors.player.facts['reveal.herbLesson'],true);
 assert.equal(plan.state.actors.player.facts['reveal.wallet.away'],true);assert.equal(plan.unlocks.length,1);
 stageRevealKnowledge(plan,old,100);assert.equal(plan.unlocks.length,1);
 const restore={state:{actors:{player:{worldId:'away',facts:{}}}},gameplay:{player:{inventory:old}},external:{money:100}};
 stageRevealKnowledge(restore,old,100);assert.deepEqual(restore.state.actors.player.facts,{});
});
