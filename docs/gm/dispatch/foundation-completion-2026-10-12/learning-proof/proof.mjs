import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {WORLD_COMPLETION_LEARNING_IDS as I,worldCompletionLearningDefinitions as D} from '../../../../../src/world_completion_learning_content.js';
import {worldCompletionLearningBodyId,exactWorldCompletionLearningJob,worldCompletionLearningEnrolled} from '../../../../../src/world_completion_learning_facts.js';
import {freezeWorldCompletionLearningJob,completeWorldCompletionLearningJob,installWorldCompletionLearningControllers,retainWorldCompletionLearningWindow,frozenWorldCompletionLearningRegistry,worldCompletionLearningStripEvidence} from '../../../../../src/world_completion_learning_runtime.js';
import {preserveWorldCompletionNativeItem,validateWorldCompletionNativeEnvelope} from '../../../../../src/world_completion_native.js';
import {worldCompletionStripKey,worldCompletionStripStamp} from '../../../../../src/world_completion_strip.js';
const P=I.prefix, copy=structuredClone;
const state=()=>({schema:11,clock:10,sequence:10,auditRemainder:{schema:1},referenceGameplay:{schema:1},pending:[],worlds:{[I.world]:{facts:{}}},actors:{
 player:{worldId:I.world,facts:{'world.completion.enrolled':true,[P+'enrolled']:true},completed:{'world.completion.begin':1,[P+'begin']:1,[P+'sponsor']:1},sources:{},techniques:{}},
 [I.eda]:{worldId:I.world,facts:{},completed:{},sources:{[I.teacherMethod]:{receiptId:'simulation:3'}},techniques:{}},
 [I.neri]:{worldId:I.world,facts:{},completed:{},sources:{},techniques:{},resources:{}}},
 simulation:{schema:5,situations:{[I.situation]:{}},people:{player:{life:'alive',inventory:'native',body:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true}},[I.neri]:{definitionId:I.neri,inventory:'simulation',life:'alive',body:{hands:2,form:'human'},location:'Village'}},sites:{[I.bench]:{reservations:{}}},jobs:[],controllers:{},knowledge:{},owners:{},custody:{},equipment:{},conditions:{},powers:{}}});
const context={actorId:I.neri,nativeAlive:true,facts:{'worldCompletion.sampleCause':'simulation:1','worldCompletion.measuredCause':'simulation:2'}};
const makeJob=(s,id='make_neri')=>{
 const d=D.commands.find(d=>d.id===P+id),j={id:'simulation:4',sequence:4,commandId:d.id,revision:d.revision,actorId:d.actorId,targetId:d.targetId||null,due:s.clock+d.duration,cancellation:d.cancellation,reservationReturns:d.reservationReturns,siteId:d.siteId||null,claim:null,participants:[...new Set([d.actorId,...(d.participants||[]).map(id=>id==='$target'?d.targetId:id)])],costs:copy(d.costs),effects:copy(d.effects),context:{actorId:d.actorId,targetId:d.targetId||null,partyIds:[]},completionSupport:{schema:1,requires:copy(d.completionRequires),coLocated:!!d.completionCoLocated,location:d.location,failure:'refund'}};
 if(d.siteId)s.simulation.sites[d.siteId].reservations[j.id]=d.actorId;
 freezeWorldCompletionLearningJob(s,j,{...context,actorId:d.actorId});return j;
};
const groups=[];
{
 const s=state(),j=makeJob(s);assert(worldCompletionLearningEnrolled(s));assert(exactWorldCompletionLearningJob(s,j));
 assert.equal(j.worldCompletionLearningClock.bodyId,I.neri+'.original_human_body');assert.equal(j.worldCompletionLearning.teacherSourceCause,null);
 const lesson=makeJob(state(),'learn_neri');assert.equal(lesson.worldCompletionLearning.teacherSourceCause,'simulation:3');
 const bad=state(),unchanged=JSON.stringify(bad);freezeWorldCompletionLearningJob(bad,{},{});assert.equal(JSON.stringify(bad),unchanged);
 const badCause=state();const d=D.commands.find(d=>d.id===P+'make_neri');assert.throws(()=>freezeWorldCompletionLearningJob(badCause,{commandId:d.id,actorId:I.neri},{...context,facts:{...context.facts,'worldCompletion.measuredCause':'simulation:1'}}));
 groups.push('exact body/sample/teacher-source job freeze and malformed cause rejection');
}
{
 const s=state(),before=JSON.stringify(s);assert.equal(worldCompletionLearningBodyId(s,{nativeAlive:true},'player'),'native.player.body');
 s.simulation.people[I.neri].body.form='clay';assert.equal(worldCompletionLearningBodyId(s,context,I.neri),null);
 const good=state(),j=makeJob(good);good.simulation.jobs=[j];const invalid=copy(j);invalid.due++;assert.equal(exactWorldCompletionLearningJob(good,invalid),false);
 assert.notEqual(before,JSON.stringify(s));groups.push('unsupported form and tampered due reject exact native-body/job identity');
}
{
 const s=state(),j=makeJob(s);s.simulation.jobs=[j];
 const registry={simulation:{controllers:new Map([[I.controller,D.controllers[0]]])}};
 installWorldCompletionLearningControllers(s,registry);installWorldCompletionLearningControllers(s,registry);
 assert.equal(Object.keys(s.simulation.controllers).length,1);assert.equal(s.simulation.controllers[I.neri+':'+I.controller].due,11);
 const absent=state();delete absent.actors.player.completed[P+'sponsor'];installWorldCompletionLearningControllers(absent,registry);assert.deepEqual(absent.simulation.controllers,{});
 assert(retainWorldCompletionLearningWindow(s,10,14,{...context,nativeAlive:false}));
 assert.equal(j.due,16);assert.equal(j.worldCompletionLearningClock.pausedMinutes,4);assert.equal(s.simulation.controllers[I.neri+':'+I.controller].due,15);
 s.clock=14;assert(exactWorldCompletionLearningJob(s,j));groups.push('actual sponsorship alone installs one controller; unsupported interval retains due and paused minutes');
}
{
 const s=state(),j=makeJob(s);s.clock=12;s.actors[I.neri].completed[j.commandId]=1;
 s.simulation.knowledge[I.neri]={[P+'made']:{cause:j.id,at:12,stage:'seen'}};
 const out={state:s},calls=[];
 completeWorldCompletionLearningJob(out,j,{},(out,effects,ctx,registry,cause)=>{
  calls.push({effects:copy(effects),cause});
  for(const e of effects)if(e.type==='item')((out.state.simulation.owners[e.actor]??={})[e.key]=e.amount);else if(e.type==='knowledge')((out.state.simulation.knowledge[e.actor]??={})[e.key]={...e,cause,at:out.state.clock});
 });
 assert.equal(calls.length,1);const e=JSON.parse(s.actors[I.neri].facts[P+'madeEvidence']);
 const key=worldCompletionStripKey({sampleCause:e.sampleCause,measuredCause:e.measuredCause,productionCause:e.cause,makerId:I.neri});
 assert.equal(s.simulation.owners[I.neri][key],1);assert.equal(s.simulation.owners.player,undefined);assert.equal(worldCompletionStripStamp(key).makerId,I.neri);
 const item=preserveWorldCompletionNativeItem(key,{id:'Measured drain strip'});assert.equal(item.inventory_key,key);assert.deepEqual(item.datum,worldCompletionStripStamp(key));
 const envelope={expansion:s,inventories:{person:{main_character:{}}},character:{equipment:{}}};assert.doesNotThrow(()=>validateWorldCompletionNativeEnvelope(envelope));
 const duplicate=copy(envelope);duplicate.inventories.person.main_character[key]={count:1};assert.throws(()=>validateWorldCompletionNativeEnvelope(duplicate),/duplicate pieces/);
 groups.push('native item identity survives reconstitution and envelope rejects duplicate stamped stock across owners');
 const registry={simulation:{commands:new Map(D.commands.map(d=>[d.id,d]))}};
 const frozen=frozenWorldCompletionLearningRegistry(s,registry);assert.equal(frozen.simulation.commands.get(P+'collect').costs[0].key,key);
 assert.equal(worldCompletionLearningStripEvidence(s,{facts:context.facts},I.neri).cause,j.id);
 assert.throws(()=>completeWorldCompletionLearningJob(out,j,{},()=>{}));
 groups.push('one stamped Neri-owned output, exact collect transfer key, matching carrier evidence and duplicate-completion rejection');
}
const files=['src/world_completion_native.js','src/world_completion_learning_content.js','src/world_completion_learning_facts.js','src/world_completion_learning_runtime.js','src/world_completion_learning_host.js','src/world_completion_content.js','src/world_completion_host.js','src/world_completion_runtime.js','src/world_completion_facts.js','src/simulation_content.js','src/expedition_content.js','src/feature_expansion_wave_host.js'];
const root=new URL('../../../../../',import.meta.url),inputs=files.map(path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')}));
const result={status:'PASS',scope:'Five focused module-fixture groups, not native scheduler/publication/browser/save proof',groups,inputs};
fs.writeFileSync(new URL('./RESULT.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,groups:groups.length,scope:result.scope}));
