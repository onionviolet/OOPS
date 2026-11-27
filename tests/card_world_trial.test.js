import test from 'node:test';
import assert from 'node:assert/strict';
import {newTrial,moveQuote,takeMove,targetWard,newOrder,stepOrder,stopOrder} from '../prototypes/world-atlas/card-world-trial.mjs';
const manual=(state,moves)=>moves.reduce((s,m)=>{const r=takeMove(s,m);assert.equal(r.ok,true,m+': '+r.reason);return r.state;},state);
const ordered=(state,options)=>{let order=newOrder(options);for(let n=0;order.running&&n<12;n++)({state,order}=stepOrder(state,order));assert.equal(order.running,false);return{state,order};};
test('+1 changes the first affordable move; opening energy differs from renewable land',()=>{
 const ordinary=newTrial(),land=newTrial(1),energy=newTrial(1,'energy');
 assert.equal(moveQuote(ordinary,'spillway').ok,false);assert.equal(takeMove(ordinary,'spillway').state,ordinary);
 for(const start of [land,energy])assert.equal(takeMove(start,'spillway').state.progress,1);
 assert.equal(takeMove(land,'spillway').state.energy,2);assert.equal(takeMove(energy,'spillway').state.energy,1);
 assert.deepEqual([ordinary.warden,ordinary.guard,ordinary.keeper],[land.warden,land.guard,land.keeper]);
});
test('actual target pays its ward plus base cost; source removal ends maintained ally grants',()=>{
 const insufficient={...newTrial(),energy:999,land:999},saved=JSON.stringify(insufficient);
 assert.equal(moveQuote(insufficient,'warden').cost,1000);assert.equal(takeMove(insufficient,'warden').ok,false);assert.equal(JSON.stringify(insufficient),saved);
 const source=takeMove({...insufficient,energy:1000,land:1000},'warden');assert.equal(source.ok,true);assert.equal(source.cost,1000);assert.equal(source.state.spent,1000);assert.equal(source.state.warden,false);
 assert.equal(targetWard(source.state,'guard'),0);assert.equal(moveQuote(source.state,'guard').cost,1);
 assert.equal(moveQuote(newTrial(),'guard').cost,4);const ally=takeMove({...newTrial(),land:4,energy:4},'guard');assert.equal(ally.cost,4);assert.equal(ally.state.warden,true);assert.equal(moveQuote(ally.state,'keeper').cost,4);assert.equal(moveQuote(ally.state,'warden').cost,1000);
});
test('earned key opens two consequential methods; no repeat find or double spend',()=>{
 const found=takeMove(newTrial(),'search').state;assert.equal(found.key,'carried');assert.equal(takeMove(found,'search').ok,false);
 const keyRoute=manual(found,['survey','gate','spillway']);assert.equal(keyRoute.status,'won');assert.equal(keyRoute.key,'used');assert.equal(keyRoute.warden,true);assert.equal(keyRoute.guard,true);assert.equal(keyRoute.spent,6);
 assert.equal(takeMove(keyRoute,'trade').ok,false);
 const tradeRoute=manual(newTrial(),['search','trade','survey','guard','keeper','road']);assert.equal(tradeRoute.status,'won');assert.equal(tradeRoute.key,'traded');assert.equal(tradeRoute.warden,true);assert.equal(tradeRoute.guard,false);assert.equal(tradeRoute.spent,10);assert.equal(takeMove(tradeRoute,'gate').ok,false);
});
test('explicit key and trade orders agree with manual resolution and stop at the objective',()=>{
 for(const [mode,moves]of [['key',['search','survey','gate','spillway']],['trade',['search','trade','survey','guard','keeper','road']]]){
  const run=ordered(newTrial(),{mode,budget:12});assert.deepEqual(run.state,manual(newTrial(),moves));assert.equal(run.order.reason,'Caravan crossed. Order complete.');assert.equal(run.order.completed,moves.length);
 }
 assert.equal(ordered(newTrial(1),{mode:'key'}).order.completed,3);
});
test('orders stop on unaffordable targets, expense ceilings, empty finds and deliberate Stop',()=>{
 const start=newTrial(1);let blocked=ordered(start,{mode:'repeat',move:'warden',budget:1000});assert.equal(blocked.state,start);assert.match(blocked.order.reason,/1000 energy; 2 ready/);assert.equal(blocked.order.spent,0);
 const capped=ordered(newTrial(),{mode:'trade',budget:9});assert.equal(capped.state.guard,false);assert.equal(capped.state.keeper,true);assert.equal(capped.order.spent,6);assert.match(capped.order.reason,/ceiling 9/);
 const empty=ordered(newTrial(),{mode:'repeat',move:'search',repeats:3});assert.equal(empty.order.completed,1);assert.match(empty.order.reason,/cache is empty/);
 const once=stepOrder(newTrial(),newOrder());const stopped=stopOrder(once.order);assert.deepEqual(stepOrder(once.state,stopped).state,once.state);assert.equal(stopped.spent,1);assert.match(stopped.reason,/Stopped by you/);
 const mismatch=ordered(manual(newTrial(),['search','trade']),{mode:'key'});assert.match(mismatch.order.reason,/key was traded/);
});
test('bounded repeats settle nightfall; dialogue follows witnessed outcomes and present speakers',()=>{
 const run=ordered(newTrial(),{mode:'repeat',move:'survey',repeats:8,budget:8});assert.equal(run.state.status,'lost');assert.equal(run.order.completed,8);assert.match(run.order.reason,/Nightfall/);
 const outcome=manual(newTrial(1),['spillway']);assert.match(outcome.log[0].dialogue,/wheel/);assert.equal(outcome.progress,1);
 const absent={...newTrial(1),keeper:false,guard:false,warden:false};assert.doesNotMatch(takeMove(absent,'survey').state.log[0].dialogue,/Keeper:/);assert.doesNotMatch(takeMove(absent,'spillway').state.log[0].dialogue,/Guard:/);
});
