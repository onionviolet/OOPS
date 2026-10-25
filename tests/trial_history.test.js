import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/pledges.js';
import {riskFor} from '../src/breakthrough_trial.js';
import {trialRules} from '../src/pledges_content.js';
import {validateTrialHistory,describeTrialChoice} from '../src/trial_history.js';
const skills={combat:99,equilibrium:99,persistence:99};
test('quick-choice history uses the execution risk and exact before/after outcomes without rewriting old attempts',()=>{
 const s=P.fresh();s.trial.attempts=17;s.trial.pressure=2;s.trial.learning=1;
 assert.equal(P.migrate(s).trial.decisions,undefined);
 const view=P.trialView(s,skills),expected=riskFor(trialRules,1,{pressure:view.pressure,stability:view.stability,scar:view.scar,units:1});
 const fail=P.attempt(s,{roll:0,units:1,skills,at:30});let row=fail.state.trial.decisions[0];assert.equal(row.risk,expected);assert.equal(row.risk,fail.risk);assert.equal(row.units,1);assert.deepEqual(row.before,{stage:0,quality:0,pressure:2,learning:1});assert.deepEqual(row.after,{stage:0,quality:0,pressure:fail.state.trial.pressure,learning:2});assert.equal(row.at,30);assert.match(describeTrialChoice(row),/failed/);
 const win=P.attempt(fail.state,{roll:999,units:5,skills,at:60});assert.equal(win.state.trial.decisions.length,2);assert.equal(win.state.trial.decisions[1].after.stage,1);assert.equal(win.state.trial.decisions[1].risk,win.risk);assert.deepEqual(P.migrate(JSON.parse(JSON.stringify(win.state))),win.state);assert.equal(s.trial.decisions,undefined);
});
test('graded, collapsed and left ordeals retain the actual choices, cost and learning',()=>{
 let s=P.beginOrdeal(P.fresh(),{kind:'precision',units:1,skills,at:10});s=P.stepOrdeal(s,'steady',skills,11);s=P.settleOrdeal(s,12).state;const r=s.trial.decisions[0];assert.equal(r.passed,true);assert.deepEqual(r.steps,['steady']);assert.equal(r.units,1);assert.equal(r.grade,1);assert.equal(r.after.quality,1);
 let left=P.beginOrdeal(P.fresh(),{kind:'endurance',units:1,skills,at:1});left=P.stepOrdeal(left,'press',skills,2);left=P.abandonOrdeal(left,3);assert.equal(left.trial.decisions[0].passed,null);assert.deepEqual(left.trial.decisions[0].before,left.trial.decisions[0].after);assert.equal(P.isFresh(left),false,'a paid abandoned choice must remain save-worthy');
 let collapse=P.beginOrdeal(P.fresh(),{kind:'precision',units:0,skills,at:1});for(let n=0;collapse.ordeal&&n<12;n++)collapse=P.stepOrdeal(collapse,'press',skills,n+2);const failed=collapse.trial.decisions[0];assert.equal(failed.passed,false);assert.equal(failed.after.learning,1);assert.ok(failed.steps.every(s=>s==='press'));
 const old=P.beginOrdeal(P.fresh(),{kind:'endurance',units:0,skills,at:1});delete old.ordeal.actions;P.validate(old);const result=P.settleOrdeal(P.stepOrdeal(old,'steady',skills,2),3);assert.deepEqual(result.state.trial.decisions[0].steps,[],'unknown historical steps are not fabricated');
});
test('guarded attempts and bounded history do not become progression authority',()=>{
 const result=P.guardedTempering(P.fresh(),skills,99);const r=result.trial.decisions[0];assert.equal(r.risk,0);assert.equal(r.units,5);assert.equal(r.after.stage,1);assert.equal(r.after.quality,0);
 let s=P.fresh();for(let n=0;n<40;n++)s=P.attempt(s,{roll:0,units:0,skills,at:n}).state;assert.equal(s.trial.decisions.length,32);assert.equal(s.trial.decisions[0].at,8);assert.equal(s.trial.learning,40);
 const bad=structuredClone(s.trial.decisions);bad[0].after.stage=3;assert.throws(()=>validateTrialHistory(bad),/differs/);bad[0].after.stage=0;bad[0].risk=1001;assert.throws(()=>validateTrialHistory(bad),/choice record/);
 const invalid=P.beginOrdeal(P.fresh(),{kind:'endurance',units:0,skills,at:1});invalid.ordeal.actions=['press'];assert.throws(()=>P.validate(invalid),/active ordeal choices/);
});
