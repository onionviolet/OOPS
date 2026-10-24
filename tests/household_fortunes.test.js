import test from 'node:test';
import assert from 'node:assert/strict';
import {settleAwakening,settleGroup,watchList,awakeningChance,recordDeath,easeHousehold,emptyHousehold,recordCompletion,unlockedRoutines,routineMayRun,emptyCompletions} from '../src/household_fortunes.js';
const count=(base)=>{let n=0;for(let i=0;i<400;i++)if(settleAwakening({id:'s'+i,...base,talent:(i%10)/9},15,'seed').awakened)n++;return n;};
test('IM9: a housed, fed servant awakens more often than a neglected one',()=>{
 const well=count({bed:1,fed:1,tended:1}),poor=count({bed:0,fed:0.1,tended:0});
 assert.ok(well>poor*2,`${well} vs ${poor}`);
 assert.ok(awakeningChance({bed:1,fed:1,tended:1,talent:0})>awakeningChance({bed:0,fed:0,tended:0,talent:1}));
});
test('IM9: watch list ranks on observables and never exposes the hidden value',()=>{
 const rows=[{id:'a',name:'A',bed:0,fed:0,tended:0,talent:1},{id:'b',name:'B',bed:1,fed:1,tended:1,talent:0},{id:'c',name:'C',bed:0.5,fed:1,tended:0,talent:1,signs:2}];
 const list=watchList(rows);
 assert.deepEqual(list.map(r=>r.id),['c','b','a']);
 assert.ok(list.every(r=>!('talent' in r)));
 assert.equal(JSON.stringify(list).includes('talent'),false);
});
test('AD33: a group awakens as an aggregate count',()=>{
 const g=settleGroup({id:'hands',group:true,count:50,bed:1,fed:1,tended:1},120,'s');
 assert.ok(g.sparks>0&&g.sparks<=50&&!g.awakened);
});
test('IM10: neglect death leaves consequences, old age does not',()=>{
 const neglected={id:'n',fed:0,bed:0,tended:0,age:30,lifespan:70},old={id:'o',fed:1,bed:1,tended:1,age:80,lifespan:70};
 const a=recordDeath(emptyHousehold(),neglected),b=recordDeath(emptyHousehold(),old);
 assert.equal(a.ledger[0].cause,'neglect');assert.equal(b.ledger[0].cause,'old_age');
 assert.ok(a.standing<0&&a.resentment>0);assert.equal(b.standing,0);assert.equal(b.resentment,0);
 const healed=easeHousehold(a,10);assert.deepEqual([healed.resentment,healed.standing],[0,0]);
});
test('OG16: completions unlock a standing routine that still stops at choices and lethal cost',()=>{
 let c=emptyCompletions();for(let i=0;i<4;i++)c=recordCompletion(c,'cook');
 assert.deepEqual(unlockedRoutines(c),[]);c=recordCompletion(c,'cook');
 const [r]=unlockedRoutines(c);assert.equal(r.id,'daily_meals');
 assert.equal(routineMayRun(r).run,true);assert.equal(routineMayRun(r,{choicePending:true}).run,false);assert.equal(routineMayRun(r,{lethal:true}).run,false);
});
