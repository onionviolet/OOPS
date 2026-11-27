import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {createStructuredNativeRegistration} from '../src/structured_native_registration.js';
import {planStructuredSelection,beginStructuredCampaign,adoptStructuredExtension} from '../src/structured_pack_runtime.js';
import {requireStructuredContent} from '../src/structured_pack_state.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {wormLeadLife,wormLeadId as baseId} from '../src/world_packs/book_worm_lead_life.js';
import {wormLeadBus,registerWormLeadBus,WORM_BUS,wormBusId as id,soakedBackpackKey as key} from '../src/world_packs/book_worm_lead_bus.js';
const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]}),definitions=new Map();
const register=createStructuredNativeRegistration({registry,definitions,locations:{},items:{},inventories:{},availabilities:{},
 makeLocation:l=>({...l,connected_locations:[]}),makeItem:i=>({...i}),makeInventory:()=>({})});
const definition=await register(wormLeadLife),extension=await registerWormLeadBus(register,definition);
const initial={registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,busy:false,
 nativeBody:{id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'},facts:{location:'Village'},external:{money:0},
 gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}},equipment:{player:{}}};
function begin(postCopy=false){
 const selected=planStructuredSelection(createExpansionState(717),definition,initial);
 const begun=beginStructuredCampaign(selected.plan.state,definition,initial,null,selected.selection);
 let plan=begun.plan,record=begun.record;
 if(postCopy){record={...record,contentHash:definition.identityAlternatives[0].contentHash,snapshotHash:definition.identityAlternatives[0].starts[0].snapshotHash};}
 const commandId=name=>name==='inspect'?id('inspect_'+plan.state.simulation.people.player.location.split('.').at(-1))
  :['leave','return','disperse'].includes(name)?baseId(name):id(name);
 const context=name=>{const p=plan.state.simulation.people.player;return {...initial,worldId:definition.world.id,nativeBody:p.body,
  facts:{location:p.location},external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals||initial.vitals,
  targetId:registry.simulation.commands.get(commandId(name))?.targetId,structuredNative:{...record,bound:true,bodyId:p.body.id}};};
 return {
  get state(){return plan.state;},get record(){return record;},get count(){return plan.gameplay.player.inventory[key]||0;},
  get location(){return plan.state.simulation.people.player.location;},get swarm(){return plan.state.simulation.people[baseId('insects')].location;},
  get observed(){return plan.state.simulation.knowledge.player?.[id('inspection')];},
  quote:name=>previewSimulationCommand(plan.state,registry,commandId(name),context(name)),
  admit(){const out=adoptStructuredExtension(plan.state,definition,record,{id:WORM_BUS,revision:extension.revision,contentHash:extension.contentHash},context());record=out.record;plan={...plan,...out.plan};},
  act(name){plan=commitSimulationCommand(plan.state,registry,{id:commandId(name)},context(name));},
  step(minutes=1){plan=advanceSimulation(plan.state,registry,minutes,plan.external,plan.gameplay,{player:{...context(),vitals:(plan.vitals||initial.vitals).player}});},
  finish(name,minutes=1){this.act(name);this.step(minutes);},
  cancel(){plan=cancelSimulationJob(plan.state,registry,plan.state.simulation.jobs[0].id,context());},
  reload(){plan.state=loadExpansionState(JSON.parse(JSON.stringify(plan.state)),registry);requireStructuredContent(record,definitions,plan.state);},
  dispose(){delete plan.gameplay.player.inventory[key];}
 };
}
test('admission grants nothing and old corridor must physically return to collect one source bag',()=>{
 const r=begin();r.finish('leave');r.admit();assert.equal(r.count,0);assert.equal(r.quote('collect').eligible,false);assert.equal(r.quote('inspect').eligible,false);
 r.finish('return');r.act('collect');r.cancel();assert.equal(r.count,0);r.finish('collect');assert.equal(r.count,1);assert.equal(r.observed,undefined);
 r.reload();assert.equal(r.quote('collect').eligible,false);assert.equal(r.count,1);assert.equal(r.swarm,baseId('washroom'));
});
test('set-down custody blocks remote inspection, survives reload, and returns one bag',()=>{
 const r=begin();r.admit();r.finish('collect');r.finish('put_washroom');assert.equal(r.count,0);r.finish('leave');
 assert.equal(r.quote('take_washroom').eligible,false);assert.equal(r.quote('inspect').eligible,false);r.reload();r.finish('return');r.finish('take_washroom');assert.equal(r.count,1);assert.equal(r.quote('take_washroom').eligible,false);
});
test('closed-bag journey discovers no private notebook; inspection can be deferred until arrival',()=>{
 const r=begin();r.admit();r.finish('collect');r.finish('leave');r.finish('leave_school',2);r.finish('board_home');r.finish('ride_home',10);
 assert.equal(r.location,id('home_stop'));assert.equal(r.count,1);assert.equal(r.observed,undefined);assert.equal(r.swarm,baseId('washroom'));
 r.act('inspect');r.step(1);r.reload();r.cancel();assert.equal(r.observed,undefined);r.finish('inspect',2);assert.ok(r.observed);r.reload();assert.equal(r.count,1);
});
test('inspection on bus is private and cancellable, return preserves earlier dispersal',()=>{
 const r=begin();r.finish('disperse');r.admit();r.finish('collect');r.finish('leave');r.finish('leave_school',2);r.finish('board_home');
 r.act('inspect_ride');r.step(3);r.cancel();assert.equal(r.location,id('homebound'));assert.equal(r.observed,undefined);assert.equal(r.count,1);
 r.finish('inspect_ride',10);assert.ok(r.observed);assert.equal(r.state.simulation.knowledge[baseId('insects')]?.[id('inspection')],undefined);
 r.finish('board_return');r.finish('ride_return',10);r.finish('return_school',2);r.finish('return');assert.equal(r.swarm,baseId('outside'));assert.equal(r.count,1);
});
test('an accepted post-copy receipt can admit the pinned extension without changing its identity',()=>{
 const r=begin(true),old={contentHash:r.record.contentHash,snapshotHash:r.record.snapshotHash};r.admit();r.reload();
 assert.equal(r.record.contentHash,old.contentHash);assert.equal(r.record.snapshotHash,old.snapshotHash);r.finish('collect');assert.equal(r.count,1);
});
test('disposed stock cannot be respawned, and missing access at completion yields no notebook observation',()=>{
 const r=begin();r.admit();r.finish('collect');r.act('inspect');r.dispose();r.step(2);assert.equal(r.observed,undefined);assert.equal(r.quote('collect').eligible,false);assert.equal(r.quote('inspect').eligible,false);
 assert.equal(wormLeadBus.items.some(i=>/notebook|ink|warped|crushed|purple/i.test(i.label+' '+i.description)),false);
});

test('a backpack left at school does not gate walking or buses and is the same bag on return',()=>{
 const r=begin();r.admit();r.finish('collect');r.finish('put_washroom');r.finish('leave');
 assert.equal(r.count,0);assert.equal(r.quote('leave_school').eligible,true);r.finish('leave_school',2);
 r.finish('board_home');assert.equal(r.quote('inspect_ride').eligible,false);r.finish('ride_home',10);
 assert.equal(r.location,id('home_stop'));assert.equal(r.count,0);assert.equal(r.observed,undefined);
 assert.equal(r.quote('inspect').eligible,false);assert.equal(r.quote('collect').eligible,false);
 r.finish('board_return');r.finish('ride_return',10);r.finish('return_school',2);r.finish('return');
 assert.equal(r.quote('collect').eligible,false);r.finish('take_washroom');assert.equal(r.count,1);
 assert.equal(r.quote('take_washroom').eligible,false);assert.equal(r.swarm,baseId('washroom'));
});
