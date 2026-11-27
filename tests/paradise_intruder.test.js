import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {createStructuredNativeRegistration} from '../src/structured_native_registration.js';
import {planStructuredSelection,beginStructuredCampaign,adoptStructuredExtension,structuredCampaignView} from '../src/structured_pack_runtime.js';
import {requireStructuredContent} from '../src/structured_pack_state.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {paradiseLeadLife,paradiseLeadId as baseId} from '../src/world_packs/book_paradise_lead_life.js';
import {registerParadiseLeadRoof,PARADISE_ROOF} from '../src/world_packs/book_paradise_lead_roof.js';
import {paradiseLeadIntruder,registerParadiseLeadIntruder,SU_INTRUDER as E,SU_VISITOR as M} from '../src/world_packs/book_paradise_lead_intruder.js';
import {paradiseIntruderStatus} from '../src/paradise_intruder.js';
const id=n=>`${E}.${n}`;

async function setup(raw=paradiseLeadLife,encounter=paradiseLeadIntruder){
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]}),definitions=new Map();
 const register=createStructuredNativeRegistration({registry,definitions,locations:{},items:{},inventories:{},availabilities:{},
  makeLocation:l=>({...l,connected_locations:[]}),makeItem:i=>({...i}),makeInventory:()=>({})});
 const d=await register(raw),roof=await registerParadiseLeadRoof(register,d);
 const extension=encounter===paradiseLeadIntruder?await registerParadiseLeadIntruder(register,d):await register.bundledInstantExtension(encounter,d);
 const initial={registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,busy:false,
  nativeBody:{id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'},facts:{location:'Village'},external:{money:0},
  gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}},equipment:{player:{}}};
 const selected=planStructuredSelection(createExpansionState(717),d,initial),begun=beginStructuredCampaign(selected.plan.state,d,initial,null,selected.selection);
 let plan=begun.plan,record=begun.record;
 const cid=n=>n.startsWith('roof.')?baseId(n):n.startsWith('intruder.')?baseId(n):baseId(n);
 const ctx=n=>{const p=plan.state.simulation.people.player,c=registry.simulation.commands.get(cid(n||''));return {...initial,
  worldId:d.world.id,nativeBody:p.body,facts:{location:p.location},targetId:c?.targetId,
  external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals||initial.vitals,structuredNative:{...record,bound:true,bodyId:p.body.id}};};
 const run={registry,d,definitions,get state(){return plan.state;},get record(){return record;},
  quote:n=>previewSimulationCommand(plan.state,registry,cid(n),ctx(n)),
  act(n){plan=commitSimulationCommand(plan.state,registry,{id:cid(n)},ctx(n));},
  step(n=1){plan=advanceSimulation(plan.state,registry,n,plan.external,plan.gameplay,{player:{...ctx(),vitals:(plan.vitals||initial.vitals).player}});},
  finish(n,t=1){this.act(n);this.step(t);},cancel(){plan=cancelSimulationJob(plan.state,registry,plan.state.simulation.jobs[0].id,ctx());},
  validate(state=plan.state,receipt=record){const restored=loadExpansionState(JSON.parse(JSON.stringify(state)),registry);requireStructuredContent(receipt,definitions,restored);return restored;},
  reload(){plan={...plan,state:this.validate()};},
  view(){return structuredCampaignView(plan.state,d,record,ctx());},
  admit(which){const e=which==='roof'?roof:extension;const next=adoptStructuredExtension(plan.state,d,record,{id:e.id,revision:e.revision,contentHash:e.contentHash},ctx());record=next.record;plan={...plan,...next.plan};}};
 for(const n of ['ask_terms','sign','treatment','awakening','transfer','read_arrival','open_brand'])run.act(n);
 run.finish('read_personal');run.finish('read_trial');run.admit('roof');
 run.finish('roof.climb');run.finish('roof.listen',2);return run;
}
async function arrived(raw){const r=await setup(raw);r.finish('roof.listen_further',3);return r;}
const known=(r,n,actor='player')=>r.state.simulation.knowledge[actor]?.[id(n)];
const current=(r,n)=>{const c=r.state.simulation.conditions[M]?.[id(n)];return !!c&&(c.expiresAt==null||c.expiresAt>r.state.clock);};

test('arrival, physical presence and learned identity are separate; waiting spends time and creates no departure',async()=>{
 const r=await arrived(),deadline=r.state.simulation.situations[baseId('trial_time')].deadline;
 assert.equal(r.state.simulation.people[M],undefined);r.admit('intruder');r.reload();
 assert.doesNotMatch(JSON.stringify(r.view()),/Mia/);r.act('intruder.face');r.reload();
 assert.equal(r.state.simulation.people[M].location,baseId('house'));
 assert.equal(known(r,'identity'),undefined);assert.doesNotMatch(JSON.stringify(r.view()),/Mia/);
 assert.equal(paradiseIntruderStatus(r.state)[0].label,'The newcomer');
 const before=r.state.clock;r.finish('intruder.pause');r.reload();
 assert.equal(r.state.clock,before+1);assert.equal(r.state.simulation.people[M].location,baseId('house'));
 assert.equal(r.state.simulation.situations[baseId('trial_time')].deadline,deadline);
 assert.equal(known(r,'identity'),undefined);assert.equal(r.state.simulation.party.includes(M),false);
 assert.equal(r.quote('intruder.face').eligible,false);
});

test('source subdue/question changes actual conditions, NPC memory and trust without changing Su’s body or deadline',async()=>{
 const r=await arrived(),body=structuredClone(r.state.simulation.people.player.body),deadline=r.state.simulation.situations[baseId('trial_time')].deadline;
 r.admit('intruder');r.act('intruder.face');r.act('intruder.drop');r.act('intruder.subdue_question');r.reload();
 assert.equal(known(r,'identity'),undefined);assert.equal(current(r,'winded'),false);
 r.step();r.reload();assert.equal(current(r,'winded'),true);assert.equal(current(r,'held'),true);assert.equal(current(r,'shaken'),true);
 assert.equal(r.state.simulation.people.player.location,baseId('house'));
 assert.equal(known(r,'claim').basis.attributedTo,M);assert.match(known(r,'identity').value,/Mia/);
 assert.match(known(r,'su_response',M).value,/subdued me/);
 assert.equal(r.state.simulation.relationships[M].player.axes['tie.trust'],-1);
 assert.deepEqual(r.state.simulation.people.player.body,body);assert.equal(r.state.simulation.situations[baseId('trial_time')].deadline,deadline);
 assert.equal(r.state.simulation.party.includes(M),false);assert.deepEqual(r.state.actors.player.resources,{});
 r.act('intruder.ease_hold');assert.equal(current(r,'held'),false);r.step(5);r.reload();
 assert.equal(current(r,'winded'),false);assert.equal(r.state.simulation.relationships[M].player.axes['tie.trust'],-1);
 assert.match(known(r,'su_response',M).value,/subdued me/);assert.equal(r.quote('intruder.subdue_question').eligible,false);
});

test('speaking from above leaves the newcomer free and uninjured, without granting trust or a mission result',async()=>{
 const r=await arrived();r.admit('intruder');r.act('intruder.face');const original=structuredClone(r.state.simulation.people[M]);
 r.act('intruder.speak_above');r.reload();r.step();r.reload();
 assert.equal(r.state.simulation.people.player.location,baseId('roof.opening'));
 assert.deepEqual(r.state.simulation.people[M],original);assert.equal(current(r,'winded'),false);assert.equal(current(r,'held'),false);
 assert.match(known(r,'su_response',M).value,/stayed at the opening/);
 assert.equal(r.state.simulation.relationships[M]?.player,undefined);assert.equal(r.state.simulation.party.includes(M),false);
 assert.equal(known(r,'claim').basis.attributedTo,M);assert.equal(r.quote('intruder.drop').eligible,false);
 assert.equal(r.state.worlds[baseId('world')].facts[baseId('roof.arrival_observed')],true);
});

test('old base and pending roof work retain their pins; no visitor appears from an unfinished or cancelled arrival',async()=>{
 const old=JSON.parse(fs.readFileSync(new URL('./fixtures/paradise_opening_before_retrospective.json',import.meta.url),'utf8'));
 const r=await setup(old),pins=structuredClone(r.record.extensions),pair=[r.record.contentHash,r.record.snapshotHash];
 r.act('roof.listen_further');r.step();r.reload();r.cancel();assert.equal(r.state.simulation.people[M],undefined);
 assert.throws(()=>r.admit('intruder'),/Observe the newcomer/);
 r.finish('roof.listen_further',3);r.reload();assert.deepEqual(r.record.extensions,pins);
 r.admit('intruder');r.act('intruder.face');r.reload();
 assert.deepEqual([r.record.contentHash,r.record.snapshotHash],pair);assert.deepEqual(r.record.extensions.slice(0,pins.length),pins);
 assert.equal(Object.keys(r.state.simulation.people).filter(person=>person===M).length,1);
 const pending=()=>{r.act('intruder.drop');r.act('intruder.subdue_question');};pending();
 const bad=structuredClone(r.state);bad.simulation.jobs[0].effects[0].duration=99;
 assert.throws(()=>r.validate(bad),/exact pending/);r.reload();r.cancel();
 assert.equal(known(r,'identity'),undefined);assert.equal(current(r,'winded'),false);
});

test('local-condition guard refuses remote, foreign and active-ticking condition grants',async()=>{
 const bad=[];
 let raw=structuredClone(paradiseLeadIntruder);raw.conditions[0].onTick=[];bad.push(raw);
 raw=structuredClone(paradiseLeadIntruder);raw.commands.find(c=>c.id===id('subdue_question')).coLocated=false;bad.push(raw);
 raw=structuredClone(paradiseLeadIntruder);raw.commands.find(c=>c.id===id('subdue_question')).effects[0].actor='player';bad.push(raw);
 raw=structuredClone(paradiseLeadIntruder);raw.commands.find(c=>c.id===id('subdue_question')).effects[0].id=baseId('foreign');bad.push(raw);
 for(const data of bad)await assert.rejects(()=>setup(paradiseLeadLife,data),/Optional conditions|Command-only extensions/);
});
