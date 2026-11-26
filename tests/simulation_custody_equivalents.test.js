import test from 'node:test';
import assert from 'node:assert/strict';
import {applySimulationEffects,refundCosts} from '../src/simulation_effects.js';
const original=JSON.stringify({id:'test.original'}),equivalent=JSON.stringify({id:'test.equivalent'}),other=JSON.stringify({id:'test.other'});
const loan={type:'custody',from:'lender',to:'player',key:original,count:1,loanId:'test.loan'};
const giveBack={...loan,from:'player',to:'lender',returning:true};
const makePlan=()=>({state:{clock:1,actors:{player:{worldId:'test.world'},lender:{worldId:'test.world'}},simulation:{people:{player:{inventory:'simulation'},lender:{inventory:'simulation'}},owners:{player:{},lender:{[original]:1}},equipment:{},custody:{}}},gameplay:{},acquisitions:[]});
const apply=(plan,effect)=>applySimulationEffects(plan,[effect],{actorId:'player'},{},'test.cause');
test('ordinary exact return and refunded borrowing conserve stock and cannot repeat',()=>{
 for(const contract of [loan,{...loan,equivalentKey:equivalent}]){
  const plan=makePlan();apply(plan,contract);assert.equal(plan.state.simulation.owners.player[original],1);assert.equal(plan.state.simulation.owners.lender[original]||0,0);
  for(const effect of refundCosts([contract]))apply(plan,effect);
  assert.equal(plan.state.simulation.owners.player[original]||0,0);assert.equal(plan.state.simulation.owners.lender[original],1);assert.equal(plan.state.simulation.custody['test.loan'],undefined);
  assert.throws(()=>apply(structuredClone(plan),giveBack));
 }
});
test('consumed goods leave their contract open; only its declared owned equivalent settles it once',()=>{
 const plan=makePlan();apply(plan,{...loan,equivalentKey:equivalent});
 apply(plan,{type:'item',actor:'player',key:original,amount:-1,breakCustody:true});
 assert.ok(plan.state.simulation.custody['test.loan']);assert.equal(plan.state.simulation.owners.player[original]||0,0);
 plan.state.simulation.owners.player[equivalent]=1;
 apply(plan,{...giveBack,replacementKey:equivalent});
 assert.equal(plan.state.simulation.owners.player[equivalent]||0,0);assert.equal(plan.state.simulation.owners.lender[equivalent],1);assert.equal(plan.state.simulation.owners.lender[original]||0,0);assert.equal(plan.state.simulation.custody['test.loan'],undefined);
 assert.throws(()=>apply(structuredClone(plan),{...giveBack,replacementKey:equivalent}));
});
test('return callers cannot grant equivalence to exact-only contracts or choose another substitute',()=>{
 for(const contract of [loan,{...loan,equivalentKey:other}]){
  const plan=makePlan();apply(plan,contract);plan.state.simulation.owners.player[equivalent]=1;
  assert.throws(()=>apply(plan,{...giveBack,replacementKey:equivalent}),/did not agree/);
  assert.equal(plan.state.simulation.owners.player[equivalent],1);assert.ok(plan.state.simulation.custody['test.loan']);
 }
 const plan=makePlan();apply(plan,{...loan,equivalentKey:equivalent});plan.state.simulation.owners.player[equivalent]=1;
 plan.state.simulation.custody.other={owner:'lender',holder:'player',key:equivalent,count:1,at:1,cause:'other'};
 assert.throws(()=>apply(plan,{...giveBack,replacementKey:equivalent}),/another borrowed/);
});
