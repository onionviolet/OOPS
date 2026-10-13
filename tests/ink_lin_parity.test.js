import test from 'node:test';
import assert from 'node:assert/strict';
import {Story} from 'inkjs';
import {fixture,host,ctx,registry,I,K,life,advance} from '../docs/gm/dispatch/foundation-completion-2026-10-12/lin-source-tests/fixture.mjs';
import {previewNestedLifeCommand,commitNestedLifeCommand} from '../src/feature_expansion_nested_life.js';
import {previewNestedCommand,commitNestedCommand} from '../src/feature_expansion_nested_host.js';
import {createNestedInkHost,inkObserverVariables} from '../src/ink_scene_content.js';
import {commitInkNarrativeAction,inkNarrativeRequest,getInkNarrativeRecord,validateInkNarrative,INK_CONTENT} from '../src/ink_narrative.js';
import {loadExpansionState,createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition} from '../src/expedition_content.js';
import {validateRealmTraveler} from '../src/realm_traveler_profiles.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {auditRemainderControllerAllowed,AUDIT_REMAINDER_ENROLL} from '../src/audit_remainder_state.js';
import v1 from '../docs/gm/feature-wave/ink/content/feature_wave_v1.json' with {type:'json'};
import v2 from '../docs/gm/feature-wave/ink/content/feature_wave_v2.json' with {type:'json'};
import v3 from '../docs/gm/feature-wave/ink/content/feature_wave_v3.json' with {type:'json'};
const copy=structuredClone;
const ink=(p,id)=>commitInkNarrativeAction(p.state,registry,inkNarrativeRequest(p.state,id,host(p)),ctx(p),host(p));
const opened=()=>ink(ink(fixture(),'begin'),'nested_lin_open');
const reload=p=>({...copy(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const material=p=>({player:copy(p.gameplay.player.inventory),lin:copy(p.gameplay[I.employee].inventory),playerCredits:p.state.actors.player.resources['nested.credit'],linCredits:p.state.actors[I.employee].resources['nested.credit']});

test('actual chart/enrollment leaves unapproved consequence controllers absent; Lin host equals native preview and staged plan',()=>{
 let p=fixture();assert.equal(p.state.auditRemainder,undefined);assert.equal(Object.keys(p.state.simulation.controllers).some(id=>id.startsWith('remainder_consequences.')),false);
 const before=copy(p),h=host(p),binding=h.bindings.nested_lin_open;
 const native=previewNestedLifeCommand(p.state,registry,binding.id,ctx(p)),quoted=h.preview(p.state,registry,binding,ctx(p));
 for(const key of ['visible','eligible','costs','duration','effects','reasons'])assert.deepEqual(quoted[key],native[key]);
 assert.deepEqual(h.commit(p.state,registry,binding,ctx(p)),life(p,'open'));assert.deepEqual(p,before);
 assert.equal(INK_CONTENT.storyRevision,4);
});
test('accepted Ink work reserves counted resources, survives reload, pays once and staff supply requires separate approval',()=>{
 let p=opened(),before=material(p);p=ink(p,'nested_lin_work');
 assert.equal(p.state.simulation.jobs.length,1);assert.equal(p.state.simulation.jobs[0].due,p.state.clock+4);
 assert.equal(p.gameplay.player.inventory[K.log],before.player[K.log]-1);assert.equal(p.gameplay.player.inventory[K.rope],before.player[K.rope]-1);
 assert.equal(p.state.actors[I.employee].resources['nested.credit'],before.linCredits-3);assert.equal(p.state.actors.player.resources['nested.credit'],before.playerCredits);
 assert.equal(p.gameplay[I.employee].inventory[K.kit]||0,0);assert.match(host(p).observe(p.state,ctx(p)).nested.nested_lin_report,/in progress/);
 p=advance(reload(p),3);assert.equal(p.state.simulation.jobs.length,1);p=advance(reload(p),1);
 assert.equal(p.state.simulation.jobs.length,0);assert.equal(p.gameplay[I.employee].inventory[K.kit],1);assert.equal(p.state.actors.player.resources['nested.credit'],before.playerCredits+3);
 assert.equal(previewNestedCommand(p.state,registry,'nested.staff_supply',ctx(p)).eligible,false);
 p=commitNestedCommand(p.state,registry,'nested.role_employee',ctx(p));p=ink(p,'revisit');p=ink(p,'nested_lin_supply');
 assert.equal(p.gameplay.player.inventory[K.kit],1);assert.equal(p.gameplay[I.employee].inventory[K.kit]||0,0);assert.equal(p.state.actors.player.resources['nested.credit'],before.playerCredits+2);
 p=reload(p);const settled=material(p);p=ink(p,'revisit');p=ink(p,'nested_lin_account');assert.deepEqual(material(p),settled);assert.match(host(p).observe(p.state,ctx(p)).nested.nested_lin_report,/receipt/);
 assert.equal(previewNestedLifeCommand(p.state,registry,'nested.life.lin.work',ctx(p)).eligible,false);
});
test('texture and refusal conserve material and wage; native cancellation refunds accepted work without a kit',()=>{
 let p=fixture(),before=material(p);p=ink(ink(p,'begin'),'nested_lin_texture');assert.deepEqual(material(p),before);
 p=opened();before=material(p);p=ink(p,'nested_lin_refuse');assert.deepEqual(material(p),before);assert.equal(p.state.actors.player.facts['nested.life.lin.refused'],true);
 p=opened();before=material(p);p=ink(p,'nested_lin_work');p=commitNestedLifeCommand(p.state,registry,{type:'nested_life',id:'nested.life.cancel',jobId:p.state.simulation.jobs[0].id},ctx(p));
 assert.deepEqual(material(p),before);assert.equal(p.state.simulation.jobs.length,0);p=advance(reload(p),4);assert.equal(p.gameplay[I.employee].inventory[K.kit]||0,0);
});
test('losing actual supported body at completion refunds inputs and creates no wage or kit',()=>{
 let p=opened(),before=material(p);p=ink(p,'nested_lin_work');p.state.simulation.people.player.body={form:'human',hands:1,mobile:true};p=advance(p,4);
 assert.deepEqual(material(p),before);assert.equal(p.state.simulation.jobs.length,0);assert.notEqual(p.state.actors.player.facts['nested.life.lin.done'],true);
});
test('stale/double clock, sequence, revision, session and scope tokens cannot apply a second work effect',()=>{
 const p=opened(),h=host(p),request=inkNarrativeRequest(p.state,'nested_lin_work',h),before=copy(p);
 for(const bad of [{expectedSequence:request.expectedSequence-1},{expectedClock:request.expectedClock+1},{expectedRevision:request.expectedRevision+1},{sessionId:'ink:other'},{scopeId:'wrong.scope'},{scopeBinding:{...request.scopeBinding,instanceId:'wrong.instance'}}])assert.throws(()=>commitInkNarrativeAction(p.state,registry,{...request,...bad},ctx(p),h));
 assert.deepEqual(p,before);const accepted=commitInkNarrativeAction(p.state,registry,request,ctx(p),h),snap=copy(accepted);
 assert.throws(()=>commitInkNarrativeAction(accepted.state,registry,request,ctx(accepted),host(accepted)));assert.deepEqual(accepted,snap);
});
test('wrong contact, unsupported body and native revision block bindings; adapters cannot invoke a different resident',()=>{
 const p=opened(),h=host(p);for(const mutate of [x=>x.state.simulation.people[I.employee].location='elsewhere',x=>x.state.simulation.people.player.body={form:'human',hands:0},x=>x.state.actors[I.employee].worldId=I.salt]){
  const q=copy(p);mutate(q);assert.equal(h.preview(q.state,registry,h.bindings.nested_lin_work,ctx(q)).eligible,false);
 }
 assert.equal(h.preview(p.state,registry,h.bindings.nested_lin_work,ctx(p,{nestedNative:{...ctx(p).nestedNative,revision:999}})).eligible,false);
 assert.throws(()=>h.commit(p.state,registry,{kind:'nested_life',id:'nested.life.brin.work'},ctx(p)),/different local participant/);
 const noLife=createNestedInkHost({state:p.state,registry,context:ctx(p),sceneId:'nested.hub',previewNative:previewNestedCommand,commitNative:commitNestedCommand});assert.equal(noLife.bindings.nested_lin_work,undefined);
});
test('failed durable write preserves authoritative cursor/resources/jobs; retry publishes exactly one accepted effect',()=>{
 const current=opened(),before=copy(current),plan=ink(current,'nested_lin_work'),ids=Object.keys(plan.gameplay),bindings=Object.fromEntries(ids.map(id=>[id,{category:'person',id}]));
 const envelope={character:{money:current.external.money},inventories:{person:Object.fromEntries(ids.map(id=>[id,{}]))},levels:{person:Object.fromEntries(ids.map(id=>[id,{skill_xp:{}}]))},expansion:current.state};
 let persisted=null,writes=0;const options={createSave:()=>JSON.stringify(envelope),bindings,key:'disposable.lin',storage:{setItem(){throw Error('disposable disk failure');}}};
 assert.throws(()=>persistExpansionPlan(plan,options),/disposable disk failure/);assert.deepEqual(current,before);assert.equal(persisted,null);
 persistExpansionPlan(plan,{...options,storage:{setItem(key,value){writes++;persisted=value;}}});assert.equal(writes,1);const saved=JSON.parse(persisted);
 assert.equal(saved.expansion.simulation.jobs.length,1);assert.equal(saved.expansion.inkNarrative.scopes[0].receipts.filter(r=>r.responseId==='nested_lin_work').length,1);assert.equal(saved.expansion.actors[I.employee].resources['nested.credit'],before.state.actors[I.employee].resources['nested.credit']-3);
});
test('retained v1/v2 legacy and v3 scoped opaque cursors reload without replacing paid receipt history',()=>{
 for(const artifact of [v1,v2,v3]){
  let p=ink(fixture(),'begin'),h=host(p),record=copy(getInkNarrativeRecord(p.state,h));const story=new Story(artifact);
  const vars=inkObserverVariables(h.observe(p.state,ctx(p)));if(artifact.yairpgInk.storyRevision<3)vars.host_scene='tidemark.negotiation';
  for(const [key,value] of Object.entries(vars))if(story.variablesState[key]!=null)story.variablesState[key]=value;
  const paragraphs=[];while(story.canContinue){const line=story.Continue().trim();if(line)paragraphs.push(line);}
  Object.assign(record,{contentRevision:artifact.yairpgInk.storyRevision,contentHash:artifact.yairpgInk.contentHash,cursor:story.state.ToJson(),frame:{paragraphs,choices:story.currentChoices.map(c=>({id:c.tags.find(t=>t.startsWith('response:')).slice(9).trim(),label:c.text.trim()}))}});
  if(artifact===v3)p.state.inkNarrative={schema:2,scopes:[record]};else{delete record.scope;record.sceneId='tidemark.negotiation';record.receipts=record.receipts.map(r=>{const x=copy(r);delete x.scope;delete x.sceneId;return x;});p.state.inkNarrative=record;}
  const before=copy(p.state.inkNarrative);assert.doesNotThrow(()=>validateInkNarrative(p.state));p=reload(p);assert.deepEqual(p.state.inkNarrative,before);
  const bad=copy(p.state);const r=artifact===v3?bad.inkNarrative.scopes[0]:bad.inkNarrative;r.contentHash='0'.repeat(64);assert.throws(()=>validateInkNarrative(bad),/retained compiled content/);
  const priorMaterials=material(p),priorReceipts=copy(artifact===v3?p.state.inkNarrative.scopes[0].receipts:p.state.inkNarrative.receipts);
  const continuationHost=artifact===v3?host(p):{sceneId:'tidemark.negotiation',bindings:{ask_terms:{kind:'narrative',id:'ink.nested.hub_street.terms'}},observe:()=>({sceneId:'tidemark.negotiation'}),preview:(s,r,b,c)=>host(p).preview(s,r,b,c),commit:(s,r,b,c,q)=>host(p).commit(s,r,b,c,q)};
  const response=artifact===v3?'nested_hub_terms':'ask_terms';p=commitInkNarrativeAction(p.state,registry,inkNarrativeRequest(p.state,response,continuationHost),ctx(p),continuationHost);
  const continued=getInkNarrativeRecord(p.state,continuationHost);assert.equal(continued.contentHash,artifact.yairpgInk.contentHash);assert.equal(continued.contentRevision,artifact.yairpgInk.storyRevision);assert.deepEqual(continued.receipts.slice(0,-1),priorReceipts);assert.equal(continued.receipts.at(-1).responseId,response);assert.deepEqual(material(p),priorMaterials);assert.doesNotThrow(()=>reload(p));
 }
});
test('old absent enrollment and repeated read/preview create no demand, approval or Ink cursor',()=>{
 const old=initializeExpedition(createExpansionState(19)),before=copy(old);assert.equal(previewNestedLifeCommand(old,registry,'nested.life.lin.open',{}).eligible,false);assert.equal(validateInkNarrative(old),null);assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(old)),registry),old);assert.deepEqual(old,before);
 const p=fixture(),snap=copy(p);for(let i=0;i<4;i++){const h=host(p);h.observe(p.state,ctx(p));h.preview(p.state,registry,h.bindings.nested_lin_open,ctx(p));}assert.deepEqual(p,snap);assert.equal(p.state.inkNarrative,undefined);assert.equal(p.state.actors[I.employee].resources['nested.life.lin.demand'],undefined);
});
test('missing counted materials or provider funds block work; contractor cannot gain staff approval from making Lin’s kit',()=>{
 const p=opened(),before=copy(p);for(const alter of [q=>delete q.gameplay.player.inventory[K.log],q=>delete q.gameplay.player.inventory[K.rope],q=>q.state.actors[I.employee].resources['nested.credit']=0]){
  const q=copy(p);alter(q);const h=host(q),quote=h.preview(q.state,registry,h.bindings.nested_lin_work,ctx(q));assert.equal(quote.eligible,false);assert.throws(()=>ink(q,'nested_lin_work'));
 }assert.deepEqual(p,before);
 let contractor=commitNestedCommand(fixture().state,registry,'nested.role_contractor',ctx(fixture()));contractor=ink(ink(ink(contractor,'begin'),'nested_lin_open'),'nested_lin_work');contractor=advance(contractor,4);
 assert.equal(contractor.state.actors.player.facts['nested.role'],'contractor');assert.equal(contractor.gameplay[I.employee].inventory[K.kit],1);assert.equal(previewNestedCommand(contractor.state,registry,'nested.staff_supply',ctx(contractor)).eligible,false);
});

test('the shared controller admission preserves explicit approved remainder policy and ordinary nested controllers',()=>{
 const p=fixture(),definition=registry.simulation.controllers.get('remainder_consequences.brin_collection');assert.ok(definition);assert.equal(auditRemainderControllerAllowed(p.state,definition),false);
 const approved=copy(p.state);approved.schema=11;approved.auditRemainder={schema:1,definitionRevision:1};approved.actors.player.facts['audit_remainder.enrolled']=true;approved.actors.player.completed[AUDIT_REMAINDER_ENROLL]=1;assert.equal(auditRemainderControllerAllowed(approved,definition),true);
 assert.equal(auditRemainderControllerAllowed(p.state,registry.simulation.controllers.get('nested.chain.local.foreman')),true);
});

test('actual declared hub passage retains complete owned cargo; unsafe traveler input keys stay rejected',()=>{
 const p=fixture();assert.equal(p.state.actors.player.worldId,I.hub);assert.equal(p.state.simulation.people.player.location,'Paradise service street');assert.ok(p.state.nestedCampaign.activeVisitId);assert.equal(p.gameplay.player.inventory[K.log],2);assert.equal(p.gameplay.player.inventory[K.rope],2);assert.equal(p.carrierTransitIntent.kind,'passage');assert.equal(p.carrierTransitIntent.from.worldId,'base.frontier');assert.equal(p.carrierTransitIntent.to.worldId,I.hub);
 for(const key of ['prototype','constructor','__proto__'])assert.throws(()=>validateRealmTraveler(JSON.parse(`{"${key}":{}}`)),/Unsafe traveler key/);
});
