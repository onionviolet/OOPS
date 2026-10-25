import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/pledges.js';
import {describeTrialChoice} from '../src/trial_history.js';
const skills={combat:1};
const begin=load=>P.beginOrdeal(P.fresh(),{kind:'precision',units:0,skills,at:1,load});
test('raised frame load changes the same actual costs and grade-to-body consumer',()=>{
 const normal=begin(0),heavy=begin(2),before=JSON.stringify(heavy);const n=P.ordealView(normal,skills),h=P.ordealView(heavy,skills);assert.equal(h.steadyCost,n.steadyCost+4);assert.equal(h.pressCost,n.pressCost+4);assert.equal(h.failurePressure,4);assert.equal(JSON.stringify(heavy),before,'read-only quote has no effect');
 const a=P.settleOrdeal(P.stepOrdeal(normal,'steady',skills,2),3),b=P.settleOrdeal(P.stepOrdeal(heavy,'steady',skills,2),3);assert.equal(a.grade,1);assert.equal(b.grade,2);assert.ok(Math.abs(P.buckets(b.state,3).tempering.strength-P.buckets(a.state,3).tempering.strength-.005)<1e-12);assert.equal(b.state.trial.decisions[0].load,2);assert.match(describeTrialChoice(b.state.trial.decisions[0]),/heavy load/);assert.deepEqual(P.migrate(JSON.parse(JSON.stringify(b.state))),b.state);
});
test('heavy collapse carries its extra fear but no performance grant; abandonment adds none',()=>{
 let heavy=begin(2);for(let n=2;heavy.ordeal&&n<14;n++)heavy=P.stepOrdeal(heavy,'press',skills,n);assert.equal(heavy.trial.stage,0);assert.equal(heavy.trial.quality,0);assert.equal(heavy.trial.pressure,4);assert.equal(heavy.trial.learning,1);assert.equal(heavy.trial.decisions[0].load,2);
 const left=P.abandonOrdeal(P.stepOrdeal(begin(1),'steady',skills,2),3);assert.equal(left.trial.stage,0);assert.equal(left.trial.pressure,0);assert.equal(left.trial.decisions[0].load,1);assert.equal(left.trial.decisions[0].passed,null);
});
test('old unfinished ordeals and histories retain standard load, and invalid new loads reject',()=>{
 const old=begin(0);delete old.ordeal.load;delete old.ordeal.actions;P.validate(old);const v=P.ordealView(old,skills);const standard=P.ordealView(begin(0),skills);for(const k of ['pressure','steadyCost','pressCost','failurePressure'])assert.equal(v[k],standard[k]);assert.equal(v.loadTerms.pressure,0);const result=P.settleOrdeal(P.stepOrdeal(old,'steady',skills,2),3).state;delete result.trial.decisions[0].load;P.validate(result);assert.equal(result.trial.quality,1);
 for(const load of [-1,3,.5,'2'])assert.throws(()=>begin(load),/supported load/);const bad=begin(0);bad.ordeal.load=3;assert.throws(()=>P.validate(bad),/frame load/);
});
