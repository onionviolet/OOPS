import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createHpLifeContent} from '../src/book_world_hp_content.js';
import {hpSchoolAssessmentExtension as rawExtension} from '../src/world_packs/book_hp_school_extension.js';
import {createContentRegistry,createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack,registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {createStructuredNativeRegistration} from '../src/structured_native_registration.js';
import {beginStructuredCampaign,planStructuredSelection,structuredCampaignView,adoptStructuredExtension} from '../src/structured_pack_runtime.js';
import {requireStructuredContent,validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {commitSimulationCommand,cancelSimulationJob,previewSimulationCommand} from '../src/simulation.js';
import {packSaveState} from '../src/content_packs.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {createStructuredPackPanel} from '../src/structured_pack_ui.js';
import {withPanelDom} from './helpers/mini_dom.mjs';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';
const P='book.hp.school',E=rawExtension.id,K=n=>JSON.stringify({id:P+'.'+n});
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
function setup(){
 const raw=createHpLifeContent('school'),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]}),compiled=compileStructuredPack(raw,registry);mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:hash(raw),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
 const extension=registerStructuredCommandExtension(rawExtension,hash(rawExtension),d,registry);
 const context={registry,actorId:'player',worldId:'base.frontier',external:{money:42},gameplay:{player:{inventory:{},skills:{Literacy:{enabled:true,xp:0}},reputation:{}}},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},nativeAlive:true,nativeReady:true,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult'},facts:{location:'Village'},busy:false};
 const state=createExpansionState(123),selection=planStructuredSelection(state,d,context),begun=beginStructuredCampaign(selection.plan.state,d,context,null,selection.selection);
 const f={registry,d,extension,context,record:begun.record,plan:begun.plan};
 f.ctx=plan=>({...context,worldId:d.world.id,external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals,structuredNative:{...f.record,bound:true},facts:{location:plan.state.simulation.people.player.location}});
 return f;
}
const request=f=>({id:f.extension.id,revision:f.extension.revision,contentHash:f.extension.contentHash});
const act=(f,p,id)=>commitSimulationCommand(p.state,f.registry,{id},{...f.ctx(p),targetId:f.registry.simulation.commands.get(id)?.targetId});
const step=(f,p,n)=>{const c=f.ctx(p),out=advanceSimulation(p.state,f.registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});out.vitals=structuredClone(p.vitals);if(out.native?.staminaToFull!=null)out.vitals.player.stamina=out.vitals.player.max_stamina-out.native.staminaToFull;return out;};
function taught(f){return step(f,act(f,f.plan,P+'.lesson_repair'),30);}
function prepared(f){const p=taught(f);return step(f,act(f,p,P+'.practice_repair_glass'),3);}
function adopt(f,p){const result=adoptStructuredExtension(p.state,f.d,f.record,request(f),f.ctx(p));f.record=result.record;return {...p,...result.plan};}
function envelope(f,p){
 const save={character:{money:42},expansion:p.state,content_packs:packSaveState({schema:1,packs:{},structured:f.record},new Map([[f.d.id,f.d]])),'current location':p.state.simulation.people.player.location,inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}};
 writeGameplayToEnvelope(save,p.gameplay,{player:{category:'person',id:'main_character'}});return save;
}

test('installed commands remain inert until known-method opt-in; admission grants no stock, elapsed time or mastery',()=>{
 const f=setup(),before=structuredClone(f.plan);
 assert.throws(()=>adoptStructuredExtension(f.plan.state,f.d,f.record,request(f),f.ctx(f.plan)),/instruction/);
 let p=prepared(f);assert.throws(()=>act(f,p,E+'.assessment'),/means|circumstances/);
 assert.equal(structuredCampaignView(p.state,f.d,f.record,f.ctx(p)).actions.some(a=>a.id.startsWith(E)),false);
 assert.equal(previewSimulationCommand(p.state,f.registry,E+'.assessment',{...f.ctx(p),targetId:P+'.tutor'}).visible,false);
 const view=structuredCampaignView(p.state,f.d,f.record,f.ctx(p));assert.equal(view.extensions[0].eligible,true);
 const original=structuredClone(p),record=structuredClone(f.record);p=adopt(f,p);
 assert.deepEqual(p.state,original.state);assert.deepEqual(p.gameplay,original.gameplay);assert.deepEqual(p.external,original.external);
 assert.equal(record.extensions,undefined);assert.equal(f.record.extensions[0].contentHash,hash(rawExtension));
 assert.deepEqual(f.plan,before);assert.equal(structuredCampaignView(p.state,f.d,f.record,f.ctx(p)).actions.filter(a=>a.id.startsWith(E)).length,2);
 assert.throws(()=>adopt(f,p),/already admitted/);
});

test('stale, busy, body-unready, base mismatch, unknown and duplicate extension admission refuse without mutation',()=>{
 const f=setup(),p=prepared(f),snapshot=structuredClone(p),old=structuredClone(f.record);
 for(const req of [{...request(f),contentHash:'sha256:'+'0'.repeat(64)},{...request(f),revision:2},{...request(f),id:E+'.unknown'}])assert.throws(()=>adoptStructuredExtension(p.state,f.d,f.record,req,f.ctx(p)),/stale/);
 for(const context of [{...f.ctx(p),busy:true},{...f.ctx(p),nativeReady:false}])assert.throws(()=>adoptStructuredExtension(p.state,f.d,f.record,request(f),context),/current work|ready living/);
 const pending=act(f,p,P+'.practice_repair_glass');assert.throws(()=>adopt(f,pending),/current work/);
 assert.throws(()=>adoptStructuredExtension(p.state,{...f.d,contentHash:'sha256:'+'0'.repeat(64)},f.record,request(f),f.ctx(p)),/base|exact beginning/);
 assert.deepEqual(p,snapshot);assert.deepEqual(f.record,old);
});

test('extension preflight rejects base mismatch, command collision and content outside command-only contract atomically',()=>{
 const f=setup();
 for(const edit of [e=>e.base.revision++,e=>e.commands[0].id=P+'.lesson_charms',e=>e.items=[],e=>e.commands.push(e.commands[0])]){
  const raw=structuredClone(rawExtension);raw.id=E+'.other';raw.commands=raw.commands.map(c=>({...c,id:c.id.replace(E,raw.id)}));edit(raw);
  const before=[...f.registry.simulation.commands];assert.throws(()=>registerStructuredCommandExtension(raw,hash(raw),f.d,f.registry));assert.deepEqual([...f.registry.simulation.commands],before);
 }
 const before=[...f.registry.simulation.commands];assert.throws(()=>registerStructuredCommandExtension(rawExtension,hash(rawExtension),f.d,f.registry),/Duplicate/);assert.deepEqual([...f.registry.simulation.commands],before);
});

test('assessment requires practiced method and real means at admission; attendance and role give no pass',()=>{
 const f=setup();let p=adopt(f,taught(f));
 assert.throws(()=>act(f,p,E+'.assessment'));
 p=step(f,act(f,p,P+'.practice_repair_glass'),3);
 for(const change of [q=>delete q.gameplay.player.inventory[K('wand')],q=>q.state.simulation.people.player.body.hands=0,q=>q.state.simulation.faculties.player[P+'.magic'].suppressed=true,q=>q.state.simulation.powers.player[P+'.repair_glass'].owned=false,q=>delete q.gameplay.player.inventory[K('glass_shards')],q=>q.state.simulation.people[P+'.tutor'].location=P+'.away',q=>q.state.clock=120]){
  const q=structuredClone(p);change(q);const before=structuredClone(q);assert.throws(()=>act(f,q,E+'.assessment'));assert.deepEqual(q,before);
 }
 assert.equal(p.state.simulation.knowledge.player[E+'.passed'],undefined);
 assert.throws(()=>act(f,p,E+'.contribution'));
});

test('assessment reserves actual material and stamina, cancels/refunds once and settles a real pane once',()=>{
 const f=setup();let p=adopt(f,prepared(f));const before=structuredClone(p);
 const job=act(f,p,E+'.assessment');assert.equal(job.gameplay.player.inventory[K('glass_shards')],2);assert.equal(job.gameplay.player.inventory[K('paper')],4);
 const cancelled=cancelSimulationJob(job.state,f.registry,job.commitment.id,f.ctx(job));assert.deepEqual(cancelled.gameplay.player.inventory,before.gameplay.player.inventory);assert.equal(cancelled.vitals.player.stamina,before.vitals.player.stamina);assert.equal(cancelled.state.simulation.knowledge.player[E+'.passed'],undefined);
 assert.throws(()=>cancelSimulationJob(cancelled.state,f.registry,job.commitment.id,f.ctx(cancelled)));
 p=step(f,act(f,cancelled,E+'.assessment'),10);assert.equal(p.gameplay.player.inventory[K('glass_pane')],1);assert.equal(p.state.actors.player.completed[E+'.assessment'],1);assert.ok(p.state.simulation.knowledge.player[E+'.passed']);
 assert.equal(p.state.simulation.powers.player[P+'.repair_glass'].mastery,1);assert.throws(()=>act(f,p,E+'.assessment'));
 const again=step(f,p,10);assert.equal(again.gameplay.player.inventory[K('glass_pane')],1);
});

test('lost means, tutor presence or lesson window at completion refunds without assessment',()=>{
 for(const change of [q=>delete q.gameplay.player.inventory[K('wand')],q=>q.state.simulation.people.player.body.hands=0,q=>q.state.simulation.faculties.player[P+'.magic'].suppressed=true,q=>q.state.simulation.people[P+'.tutor'].location=P+'.away']){
  const f=setup(),p=adopt(f,prepared(f)),job=act(f,p,E+'.assessment');change(job);const out=step(f,job,10);
  assert.equal(out.state.simulation.knowledge.player[E+'.passed'],undefined);assert.equal(out.gameplay.player.inventory[K('glass_shards')],3);assert.equal(out.gameplay.player.inventory[K('paper')],5);
 }
 const f=setup(),p=adopt(f,prepared(f));p.state.clock=105;const quote=previewSimulationCommand(p.state,f.registry,E+'.assessment',{...f.ctx(p),targetId:P+'.tutor'});assert.equal(quote.eligible,true);
 p.state.clock=110;assert.throws(()=>act(f,p,E+'.assessment'));
});

test('earned assessment changes optional application; pupil material becomes tutor stock, including outside class',()=>{
 const f=setup();let p=adopt(f,prepared(f));p=step(f,act(f,p,E+'.assessment'),10);p.state.clock=70*1440;
 const beforeXp=p.gameplay.player.skills.Literacy.xp,beforeStock=p.gameplay.player.inventory[K('glass_shards')];
 const job=act(f,p,E+'.contribution'),cancelled=cancelSimulationJob(job.state,f.registry,job.commitment.id,f.ctx(job));assert.equal(cancelled.gameplay.player.inventory[K('glass_shards')],beforeStock);assert.equal(cancelled.state.simulation.owners[P+'.tutor'][K('glass_pane')]||0,0);
 p=step(f,act(f,cancelled,E+'.contribution'),10);assert.equal(p.gameplay.player.inventory[K('glass_shards')],beforeStock-1);assert.equal(p.state.simulation.owners[P+'.tutor'][K('glass_pane')],1);assert.equal(p.gameplay.player.inventory[K('glass_pane')],1);assert.equal(p.gameplay.player.skills.Literacy.xp,beforeXp+2);assert.equal(p.external.money,42);
 assert.throws(()=>act(f,p,E+'.contribution'));assert.equal(step(f,p,100).state.simulation.owners[P+'.tutor'][K('glass_pane')],1);
});

test('pending and settled extension work roundtrip through the existing envelope with exact pins and frozen jobs',()=>{
 const f=setup();let p=adopt(f,prepared(f));
 for(const stage of ['assessment','contribution']){
  const job=act(f,p,E+'.'+stage),save=JSON.parse(JSON.stringify(envelope(f,job)));validateStructuredEnvelope(save);requireStructuredContent(save.content_packs.structured,new Map([[f.d.id,f.d]]),save.expansion);
  const restored=loadExpansionState(save.expansion,f.registry);assert.deepEqual(restored,job.state);
  const broken=structuredClone(save);broken.expansion.simulation.jobs[0].effects[0].amount=2;assert.throws(()=>requireStructuredContent(broken.content_packs.structured,new Map([[f.d.id,f.d]]),broken.expansion),/pending school/);
  const noPin=structuredClone(save.content_packs.structured);delete noPin.extensions;assert.throws(()=>requireStructuredContent(noPin,new Map([[f.d.id,f.d]]),save.expansion),/pin/);
  p=step(f,{...job,state:restored},10);const settled=JSON.parse(JSON.stringify(envelope(f,p)));validateStructuredEnvelope(settled);requireStructuredContent(settled.content_packs.structured,new Map([[f.d.id,f.d]]),settled.expansion);assert.deepEqual(loadExpansionState(settled.expansion,f.registry),p.state);
  const unpinned=structuredClone(settled);delete unpinned.content_packs.structured.extensions;
  const savedBefore=structuredClone(unpinned);
  assert.throws(()=>requireStructuredContent(unpinned.content_packs.structured,new Map([[f.d.id,f.d]]),unpinned.expansion),/saved content pin/);
  assert.deepEqual(unpinned,savedBefore,'settled pin refusal never mutates the save');
  // The concrete extension produces both completion counters and actor knowledge.
  // Either must retain its content identity even when the other is absent.
  for(const family of ['completion','knowledge']){
   const isolated=structuredClone(unpinned);
   if(family==='completion'){for(const key of Object.keys(isolated.expansion.simulation.knowledge.player))if(key.startsWith(E+'.'))delete isolated.expansion.simulation.knowledge.player[key];}
   else {for(const key of Object.keys(isolated.expansion.actors.player.completed))if(key.startsWith(E+'.'))delete isolated.expansion.actors.player.completed[key];}
   assert.throws(()=>requireStructuredContent(isolated.content_packs.structured,new Map([[f.d.id,f.d]]),isolated.expansion),/saved content pin/,family+' independently requires its pin');
  }
 }
 const save=envelope(f,p),before=structuredClone(save);
 for(const d of [{...f.d,extensions:[]},{...f.d,extensions:[{...f.extension,contentHash:'sha256:'+'0'.repeat(64)}]}])assert.throws(()=>requireStructuredContent(save.content_packs.structured,new Map([[d.id,d]]),save.expansion),/exact school extension/);
 assert.deepEqual(save,before);
});

test('extracted native registration preserves both D7 identities and installs no adopted state',async()=>{
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]}),definitions=new Map(),locations={},items={};
 const register=createStructuredNativeRegistration({registry,definitions,locations,items,inventories:{},availabilities:{},makeLocation:l=>({...l,connected_locations:[]}),makeItem:i=>({...i}),makeInventory:()=>({})});
 for(const profile of ['school','trade']){const raw=createHpLifeContent(profile),d=await register(raw);assert.equal(d.contentHash,hash(raw));assert.equal(d.starts[0].snapshotHash,hash(raw.starts[0]));if(profile==='school'){await register.extension(rawExtension,d);assert.equal(d.extensions.length,1);assert.deepEqual(d.simulation.commands.map(c=>c.id),raw.simulation.commands.map(c=>c.id));}}
 assert.equal(definitions.size,2);
});


test('failed durable validation or storage never publishes adoption; successful nativePatch uses the existing envelope',()=>{
 const f=setup(),p=prepared(f),before=structuredClone(f.record),saved=envelope(f,p);
 const result=adoptStructuredExtension(p.state,f.d,f.record,request(f),f.ctx(p));
 result.plan.nativePatch={content_packs:packSaveState({...saved.content_packs,structured:result.record},new Map([[f.d.id,f.d]]))};
 const options={createSave:()=>JSON.stringify(saved),key:'test-save',bindings:{player:{category:'person',id:'main_character'}},validateEnvelope:validateStructuredEnvelope};
 for(const failure of ['validation','storage']){
  let wrote=false;const storage={setItem(){wrote=true;throw Error('storage refused');}};
  assert.throws(()=>persistExpansionPlan(result.plan,{...options,storage,validateEnvelope:failure==='validation'?()=>{throw Error('validation refused');}:options.validateEnvelope}),/refused/);
  assert.equal(wrote,failure==='storage');assert.deepEqual(f.record,before);assert.equal(structuredCampaignView(p.state,f.d,f.record,f.ctx(p)).actions.some(a=>a.id.startsWith(E)),false);
 }
 let durable;const committed=persistExpansionPlan(result.plan,{...options,storage:{setItem(key,value){durable=JSON.parse(value);}}});
 assert.deepEqual(JSON.parse(committed),durable);assert.deepEqual(durable.content_packs.structured,result.record);assert.deepEqual(saved.content_packs.structured,before);
 requireStructuredContent(durable.content_packs.structured,new Map([[f.d.id,f.d]]),durable.expansion);
});

test('existing local-life UI quotes opt-in and dispatches its exact pin only when writable and eligible',()=>withPanelDom(({host,tick})=>{
 const f=setup(),p=prepared(f),v={...structuredCampaignView(p.state,f.d,f.record,f.ctx(p)),canWrite:true},calls=[];
 const panel=createStructuredPackPanel({read:()=>v,command:r=>calls.push(r)});
 const find=(n,key,value)=>n.dataset?.[key]===value?n:[...n.children].map(c=>find(c,key,value)).find(Boolean);
 let button=find(host,'structuredExtension',E);assert.ok(button);assert.equal(button.disabled,false);button.click();assert.deepEqual(calls,[{type:'adopt-extension',...request(f)}]);
 v.canWrite=false;tick();button=find(host,'structuredExtension',E);assert.equal(button.disabled,true);button.click();assert.equal(calls.length,1);
 v.canWrite=true;v.extensions[0].eligible=false;v.extensions[0].reasons=['Finish your current work.'];tick();assert.equal(find(host,'structuredExtension',E).disabled,true);
 panel.destroy();
}));
