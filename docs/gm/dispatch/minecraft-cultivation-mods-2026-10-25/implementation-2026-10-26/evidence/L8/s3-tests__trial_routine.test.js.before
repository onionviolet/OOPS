import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/pledges.js';
import {configureTrialRoutine,quoteTrialRoutine,validateTrialRoutine} from '../src/trial_routine.js';
const c={world:'base.frontier',location:'Village',blocked:''};
test('earned routine obeys exact reserve and risk limits and never fabricates readiness',()=>{
 assert.throws(()=>configureTrialRoutine(P.fresh(),{enabled:true,maxRisk:0,maxUnits:5,reserve:1}),/graded/);
 let s=P.settleOrdeal(P.stepOrdeal(P.beginOrdeal(P.fresh(),{kind:'precision',units:0,skills:{combat:1},at:0}),'steady',{combat:1},1),1).state;
 s=configureTrialRoutine(s,{enabled:true,maxRisk:0,maxUnits:5,reserve:1});
 assert.equal(quoteTrialRoutine(s,P.trialView(s,{combat:1}),100,c).eligible,false);
 assert.equal(quoteTrialRoutine(s,P.trialView(s,{combat:3}),5,c).eligible,false);
 assert.deepEqual(quoteTrialRoutine(s,P.trialView(s,{combat:3}),6,c),{eligible:true,guarded:true,units:5,risk:0,cost:5});
 assert.equal(quoteTrialRoutine(s,P.trialView(s,{combat:3}),100,{...c,blocked:'A world choice waits.'}).reason,'A world choice waits.');
 assert.equal(quoteTrialRoutine(s,P.trialView(s,{combat:3}),100,{...c,location:'Shack'}).eligible,false);
 assert.throws(()=>validateTrialRoutine({...s.routine,maxRisk:-1}),/Invalid/);
});
