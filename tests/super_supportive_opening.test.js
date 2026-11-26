import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import pack,{supLeadLife,SUP_OPENING as S} from '../src/world_packs/book_sup_lead_life.js';
import {loadWorldPacks} from '../src/world_pack_loader.js';
import {createExpansionState,createContentRegistry,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign,structuredCampaignView,replacesStructuredReportLife} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {structuredIdentitySource,structuredIdentityAliases,createStructuredNativeRegistration} from '../src/structured_native_registration.js';
import {requireStructuredContent} from '../src/structured_pack_state.js';
const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Village'}]});
const compiled=compileStructuredPack(supLeadLife,registry);mergeStructuredPack(compiled,registry);
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
const aliases=structuredIdentityAliases(supLeadLife),identity=v=>aliases.get(hash(structuredIdentitySource(v)))??hash(structuredIdentitySource(v));
const definition={...compiled.definition,contentHash:identity(supLeadLife),starts:supLeadLife.starts.map(s=>({...s,snapshotHash:identity(s)}))};
const prefix=S.id+'.',vitals={player:{health:100,max_health:100,stamina:100,max_stamina:100}};
const context={registry,actorId:'player',worldId:'base.frontier',external:{money:0},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals,nativeReady:true,nativeAlive:true,
 nativeBody:{id:'native.player.body',form:'human',lifeStage:'adult',ownerId:'player',controllerId:'player'},facts:{location:'Village'},busy:false};
let baseline;
function setup(){if(!baseline){const selected=planStructuredSelection(createExpansionState(87),definition,context);baseline=beginStructuredCampaign(selected.plan.state,definition,context,null,selected.selection);}return structuredClone(baseline);}
const ctx=(p,id)=>({...context,worldId:S.world,external:p.plan.external,gameplay:p.plan.gameplay,targetId:registry.simulation.commands.get(id)?.targetId,
 nativeBody:p.plan.state.simulation.people.player.body,facts:{location:p.plan.state.simulation.people.player.location}});
const keep=(p,plan)=>({...p,plan});
const run=(p,id)=>keep(p,commitSimulationCommand(p.plan.state,registry,{id},ctx(p,id)));
const step=(p,n)=>keep(p,advanceSimulation(p.plan.state,registry,n,p.plan.external,p.plan.gameplay,{player:{...ctx(p),vitals:vitals.player}}));
const finish=(p,id)=>{const started=run(p,id),job=started.plan.state.simulation.jobs.find(j=>j.commandId===id);return job?step(started,job.due-started.plan.state.clock):started;};
const knows=(p,actor,key)=>p.plan.state.simulation.knowledge[actor]?.[prefix+key];
const permission=()=>finish(finish(finish(setup(),S.console),S.announce),S.who);
test('title pack loads and initializes Alden’s actual child body, possessions and bounded knowledge without powers or wages',()=>{
 const loaded=loadWorldPacks([pack]);assert.equal(loaded.dormantPacks.size,0,JSON.stringify(loaded.diagnostics));
 const p=setup(),s=p.plan.state;assert.equal(s.simulation.people.player.body.lifeStage,'child');assert.equal(s.simulation.people.player.body.id,prefix+'alden_body');
 assert.equal(p.plan.gameplay.player.inventory[JSON.stringify({id:prefix+'wummy'})],1);assert.equal(p.plan.gameplay.player.inventory[JSON.stringify({id:prefix+'console'})],1);
 assert.equal(p.plan.external.money,0);assert.equal(Object.keys(s.actors.player.sources).length,0);assert.ok(knows(p,'player','rescue_memory'));assert.equal(knows(p,'player','fragment_account'),undefined);
 const view=structuredCampaignView(s,definition,p.record,ctx(p));assert.ok(view.actions.some(a=>a.id===S.announce));
});
test('identity is learned before the source-supported visitor permission choice',()=>{
 const p=permission();assert.match(knows(p,'player','visitor_identity').value,/Hannah Elber/);assert.equal(p.plan.state.simulation.people[S.hannah].location,S.desk);
 assert.equal(previewSimulationCommand(p.plan.state,registry,S.see,ctx(p,S.see)).eligible,true);assert.equal(previewSimulationCommand(p.plan.state,registry,S.defer,ctx(p,S.defer)).eligible,true);
 assert.throws(()=>run(setup(),S.fragment));
});
test('arrival prose leaves the new visitor unidentified until Amanda answers',()=>{
 assert.doesNotMatch(supLeadLife.description,/rescuer|Hannah|chapter.two/i);assert.doesNotMatch(supLeadLife.starts[0].description,/Hannah|chapter.two|see her/i);
 let p=setup();assert.ok(knows(p,'player','rescue_memory'),'prior Hannah memories remain legitimate');assert.equal(knows(p,'player','visitor_identity'),undefined);
 p=finish(p,S.announce);assert.equal(knows(p,'player','visitor_identity'),undefined);p=finish(p,S.who);assert.match(knows(p,'player','visitor_identity').value,/Hannah Elber/);
});
test('transient report boundary follows a successful new typed life, not selection, re-entry or ordinary travel',()=>{
 const p=setup(),before=createExpansionState(87),plan={...p.plan,nativePatch:{...p.plan.nativePatch,content_packs:{structured:p.record}}};
 const savedHistory=JSON.stringify(p.plan.state.simulation.knowledge);assert.equal(replacesStructuredReportLife(before,plan),true);
 assert.equal(replacesStructuredReportLife(p.plan.state,plan),false,'same-life reload/re-entry retains report subject');
 assert.equal(replacesStructuredReportLife(before,{...plan,nativePatch:{content_packs:{pendingStructured:p.record}}}),false,'selection reservation is not replacement');
 assert.equal(replacesStructuredReportLife(before,{...plan,nativePatch:{}}),false,'an unpublished beginning has no initialization receipt');
 const travel=structuredClone(p.plan.state);travel.simulation.people.player.location=S.corridor;travel.actors.player.worldId='base.frontier';
 assert.equal(replacesStructuredReportLife(p.plan.state,{state:travel,nativePatch:{content_packs:{structured:p.record}}}),false,'location/world travel with the same native life keeps Reports');
 assert.equal(JSON.stringify(p.plan.state.simulation.knowledge),savedHistory,'the boundary reader does not change persisted history');
});
test('admission changes the real visitor’s presence; welcome is still needed before her account and request',()=>{
 let p=finish(permission(),S.see);assert.equal(p.plan.state.simulation.people[S.hannah].location,S.room);assert.equal(p.plan.state.simulation.people[S.amanda].location,S.corridor);
 assert.throws(()=>run(p,S.fragment),'admission is not permission to approach');p=finish(p,S.welcome);p=finish(p,S.fragment);
 assert.match(knows(p,'player','fragment_account').value,/thinks.*table saw/);assert.match(knows(p,S.hannah,'fragment_request').value,/whether.*kept/);
 assert.equal(p.plan.gameplay.player.inventory[JSON.stringify({id:prefix+'fragment'})],undefined,'asking does not create the missing object');
 p=JSON.parse(JSON.stringify(p));assert.ok(knows(p,S.hannah,'fragment_request'));assert.throws(()=>run(p,S.fragment),'no duplicate request');assert.equal(p.plan.external.money,0);
});
test('the offered untaken refusal leaves Hannah outside and grants no hidden conversation',()=>{
 let p=finish(permission(),S.defer);assert.equal(p.plan.state.simulation.people[S.hannah].location,S.desk);assert.equal(p.plan.state.simulation.people[S.amanda].location,S.desk);
 assert.ok(knows(p,S.amanda,'visit_deferred'));assert.equal(knows(p,S.hannah,'visit_deferred'),undefined,'a request to the nurse is not a witnessed delivery to Hannah');assert.equal(knows(p,'player','fragment_account'),undefined);assert.throws(()=>run(p,S.see));assert.throws(()=>run(p,S.welcome));
 p=JSON.parse(JSON.stringify(p));assert.equal(p.plan.state.actors.player.facts[prefix+'stage'],'deferred');
});
test('a question needs the actual recipient; stopping returns no unspoken answer or request',()=>{
 let p=finish(finish(permission(),S.see),S.welcome);const absent=structuredClone(p);absent.plan.state.simulation.people[S.hannah].location=S.corridor;assert.throws(()=>run(absent,S.fragment));
 p=run(p,S.fragment);p=step(p,1);const job=p.plan.state.simulation.jobs.find(j=>j.commandId===S.fragment);p=keep(p,cancelSimulationJob(p.plan.state,registry,job.id,ctx(p,S.fragment)));
 assert.equal(knows(p,'player','fragment_account'),undefined);assert.equal(knows(p,S.hannah,'fragment_request'),undefined);p=finish(p,S.fragment);assert.ok(knows(p,'player','fragment_account'));
});

test('acknowledged prose-only predecessor restores Alden while unrelated identities remain gated',()=>{
 const p=setup(),record=structuredClone(p.record),definitions=new Map([[definition.id,definition]]);
 assert.equal(definition.contentHash,'sha256:267ab9ab44441c403784054b5a10e122c4c2db3eb210923524b1d3a197030a7a');
 assert.equal(definition.starts[0].snapshotHash,'sha256:0298ae5d1193830d8000c173ffdaeb459b6166251762a0823f616525bf6142a5');
 assert.doesNotThrow(()=>requireStructuredContent(record,definitions,p.plan.state));
 const wrong=structuredClone(record);wrong.contentHash='sha256:'+'a'.repeat(64);assert.throws(()=>requireStructuredContent(wrong,definitions,p.plan.state),/exact beginning/);
 wrong.contentHash=record.contentHash;wrong.snapshotHash='sha256:'+'b'.repeat(64);assert.throws(()=>requireStructuredContent(wrong,definitions,p.plan.state),/exact beginning/);
 const drift=structuredClone(supLeadLife);drift.starts[0].effects.push({type:'fact',key:'unrelated',value:true});assert.notEqual(identity(drift),definition.contentHash,'unacknowledged future drift has no alias');
});

async function nativeDefinition(raw){
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]}),definitions=new Map();
 return createStructuredNativeRegistration({registry,definitions,locations:{},items:{},inventories:{},availabilities:{},makeLocation:l=>({...l,connected_locations:[]}),makeItem:i=>({...i}),makeInventory:()=>({})})(raw);
}
test('both issued corrected Alden edition pairs resume and crossed pairs remain blocked',async()=>{
 const current=await nativeDefinition(supLeadLife),p=setup(),definitions=new Map([[current.id,current]]);
 const post=structuredClone(supLeadLife);delete post.compatibility.identityAliases;const raw=await nativeDefinition(post);
 for(const edition of [current,raw]){const record={...p.record,contentHash:edition.contentHash,snapshotHash:edition.starts[0].snapshotHash};const before=JSON.stringify(record);
  assert.doesNotThrow(()=>requireStructuredContent(record,definitions,p.plan.state));assert.equal(JSON.stringify(record),before);
 }
 for(const [contentHash,snapshotHash] of [[current.contentHash,raw.starts[0].snapshotHash],[raw.contentHash,current.starts[0].snapshotHash]])assert.throws(()=>requireStructuredContent({...p.record,contentHash,snapshotHash},definitions,p.plan.state),/exact beginning/);
 for(const change of [r=>{r.simulation.commands[0].duration=2;},r=>{r.starts[0].body.hands=1;}]){const changed=structuredClone(supLeadLife);change(changed);const d=await nativeDefinition(changed);assert.throws(()=>requireStructuredContent(p.record,new Map([[d.id,d]]),p.plan.state),/exact beginning/);}
});

test('original issued pre-lint Alden edition is an exact acknowledged prose predecessor',async()=>{
 const original=structuredClone(supLeadLife);delete original.compatibility.identityAliases;
 original.description='Alden Thorn, a child in hospital two weeks after the opening incident. Wummy is beside him. A nurse has a visitor to announce. His rescuer knows things the adults have not explained.';
 original.starts[0].description='The chapter-two hospital opening. You remember Hannah’s protective bubble and her notes during the rescue. Here, two weeks later, you can choose whether to see her.';
 original.locations[2].description='Visitors wait to be admitted upstairs.';
 assert.equal(hash(original),'sha256:f36877551cdd4fe93634b0a4df4eae982fa3112340602358fdb86e6db0ed7686');
 const current=await nativeDefinition(supLeadLife),old=await nativeDefinition(original),p=setup(),definitions=new Map([[current.id,current]]);
 const record={...p.record,contentHash:old.contentHash,snapshotHash:old.starts[0].snapshotHash},before=JSON.stringify(record);
 assert.doesNotThrow(()=>requireStructuredContent(record,definitions,p.plan.state));assert.equal(JSON.stringify(record),before);
 const post=structuredClone(supLeadLife);delete post.compatibility.identityAliases;const postDefinition=await nativeDefinition(post);
 assert.throws(()=>requireStructuredContent({...record,snapshotHash:postDefinition.starts[0].snapshotHash},definitions,p.plan.state),/exact beginning/);
 const changed=structuredClone(supLeadLife);changed.starts[0].body.hands=1;const drift=await nativeDefinition(changed);assert.throws(()=>requireStructuredContent(record,new Map([[drift.id,drift]]),p.plan.state),/exact beginning/);
});
