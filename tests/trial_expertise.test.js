import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/pledges.js';
import {trialRules} from '../src/pledges_content.js';
import {trialExpertise,validateTrialExpertise} from '../src/trial_expertise.js';
import {syncTrialBody} from '../src/trial_bodies.js';
const skills={combat:1},begin=(s,kind='precision')=>P.beginOrdeal(s,{kind,units:0,load:2,skills,at:1});
function collapse(){let s=begin(P.fresh());for(let n=2;s.ordeal&&n<14;n++)s=P.stepOrdeal(s,'press',skills,n);return s;}
const calmed=s=>{while(s.trial.pressure)s=P.calm(s);return s;};
test('a failed quick task retains its own mental lesson and the shared quote still equals execution',()=>{
 const old=P.fresh();assert.equal(P.migrate(old).trial.routeLessons,undefined);const failed=P.attempt(old,{roll:0,units:0,skills,at:1}).state;assert.equal(failed.trial.routeLessons['quick.1'],1);assert.deepEqual(failed.trial.decisions.at(-1).task,{before:0,after:1});const s=calmed(failed),common=structuredClone(s);delete common.trial.routeLessons;const q=P.trialView(s,skills),base=P.trialView(common,skills);assert.equal(q.stability,base.stability+1);assert.equal(base.risk-q.risk,trialRules.perStability);assert.equal(P.attempt(s,{roll:999,units:0,skills,at:2}).risk,q.risk);assert.equal(s.trial.stage,0);assert.deepEqual(P.migrate(JSON.parse(JSON.stringify(s))),s);
});
test('particular ordeal expertise saves actual measured-step effort without crossing route, stage or physical body',()=>{
 const s=calmed(collapse()),common=structuredClone(s);delete common.trial.routeLessons;assert.equal(trialExpertise(s,'precision'),1);assert.equal(trialExpertise(s,'endurance'),0);assert.equal(trialExpertise(s,'precision',2),0);const own=begin(s),plain=begin(common),q=P.ordealView(own,skills),baseline=P.ordealView(plain,skills);assert.equal(q.steadyCost,baseline.steadyCost-1);assert.equal(P.ordealView(begin(s,'endurance'),skills).steadyCost,baseline.steadyCost);const step=P.stepOrdeal(own,'steady',skills,2);assert.equal(own.ordeal.integrity-step.ordeal.integrity,q.steadyCost);
 const grown=syncTrialBody(P.guardedTempering(s,{combat:99},10),'body-A'),fresh=syncTrialBody(grown,'body-B');assert.equal(fresh.trial.stage,0);assert.equal(fresh.trial.quality,0);assert.equal(trialExpertise(fresh,'precision',1),1,'knowledge stays with the person without granting new-body conditioning');
});
test('acceptance and leaving do not mint failed-task experience, and malformed task keys reject',()=>{
 const left=P.abandonOrdeal(begin(P.fresh()),2);assert.equal(left.trial.routeLessons,undefined);assert.deepEqual(left.trial.decisions.at(-1).task,{before:0,after:0});const held=P.settleOrdeal(P.stepOrdeal(begin(P.fresh()),'steady',skills,2),3).state;assert.equal(held.trial.routeLessons,undefined);assert.deepEqual(held.trial.decisions.at(-1).task,{before:0,after:0});for(const value of [{'precision.4':1},{'foreign.1':1},{'quick.1':0},{'quick.1':-1}])assert.throws(()=>validateTrialExpertise(value),/task-specific/);
});
import {configurePledges,commands,pledgesState} from '../src/pledges_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
test('failed publication of the actual collapse step restores both kinds of lesson and the active attempt',()=>{
 let s=begin(P.fresh());for(let n=2;P.ordealView(s,skills).integrity>P.ordealView(s,skills).pressCost;n++)s=P.stepOrdeal(s,'press',skills,n);
 let fail=true;configurePledges({actor:()=>({is_alive:true,getFullStats:()=>({health:10,max_health:20,stamina:10,max_stamina:20})}),idle:()=>true,clock:()=>50,skillLevel:()=>1,itemOwners:()=>[],persist:cb=>{if(fail)throw Error('quota');cb();}});const d=domainRegistry.list().find(d=>d.id==='pledges');d.load(s);const before=pledgesState();assert.throws(()=>commands.stepOrdeal('press'),/quota/);assert.deepEqual(pledgesState(),before);fail=false;commands.stepOrdeal('press');const after=pledgesState();assert.equal(after.ordeal,null);assert.equal(after.trial.learning,1);assert.equal(after.trial.routeLessons['precision.1'],1);assert.deepEqual(after.trial.decisions.at(-1).task,{before:0,after:1});
});
