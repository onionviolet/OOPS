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

// The panel previews a copied draft through the actual domain quote, without
// replacing its saved configuration or stop receipt and without writable ports.
import {commands,configurePledges,pledgesState} from '../src/pledges_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
test('live routine draft reuses executor means and leaves saved state, time and stock untouched',()=>{
 let stock=6,blocked='',idle=true;
 const domain=domainRegistry.list().find(d=>d.id==='pledges');
 let state=P.settleOrdeal(P.stepOrdeal(P.beginOrdeal(P.fresh(),{kind:'precision',units:0,skills:{combat:1},at:0}),'steady',{combat:1},1),1).state;
 state={...configureTrialRoutine(state,{enabled:false,maxRisk:50,maxUnits:2,reserve:3}),routine:{enabled:false,maxRisk:50,maxUnits:2,reserve:3,last:{at:7,reason:'Earlier real stop.'}}};
 configurePledges({world:()=>c.world,location:()=>c.location,clock:()=>8,count:()=>stock,blocked:()=>blocked,idle:()=>idle,skillLevel:()=>3});domain.load(structuredClone(state));
 try{
  const before=pledgesState(),options={maxRisk:0,maxUnits:5,reserve:1};
  assert.deepEqual(commands.previewRoutine(options),{eligible:true,guarded:true,units:5,risk:0,cost:5,stock:6,next:P.trialView(state,{combat:3}).next});
  stock=5;assert.equal(commands.previewRoutine(options).eligible,false);
  stock=6;blocked='An actual world choice waits.';assert.equal(commands.previewRoutine(options).reason,blocked);
  blocked='';idle=false;assert.match(commands.previewRoutine(options).reason,/current work or decision/);
  assert.deepEqual(pledgesState(),before,'Preview must preserve the actual saved limits and prior stop receipt.');
  const armed={...state,routine:{...state.routine,enabled:true}};domain.load(armed);assert.equal(domain.projection().routine.reason,commands.previewRoutine(options).reason);
  assert.deepEqual(pledgesState(),armed,'Preview of a different draft must not replace armed terms.');
  domain.load(before);assert.deepEqual(pledgesState(),before);assert.equal(stock,6);assert.equal(domain.projection().now,8);
  assert.throws(()=>commands.previewRoutine({...options,reserve:-1}),/Invalid/);assert.deepEqual(pledgesState(),before);
 }finally{configurePledges(null);domain.load(null);}
});
