import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack,registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {beginStructuredCampaign,planStructuredSelection,adoptStructuredExtension,structuredCampaignView} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand,cancelSimulationJob,previewSimulationCommand} from '../src/simulation.js';
import {requireStructuredContent} from '../src/structured_pack_state.js';
import {jsonData} from '../src/simulation_contracts.js';
import {domainRegistry} from '../src/domain_registry.js';
import {stageSea} from '../src/ri_lead_sea_domain.js';
import {guLeadLife,riLeadId as id} from '../src/world_packs/book_gu_lead_life.js';
import {guLeadSelection,leadMoonlightKey} from '../src/world_packs/book_gu_lead_selection.js';
import {guLeadRefinement,guLeadRefinementStatus} from '../src/world_packs/book_gu_lead_refinement.js';
import {guLeadVital} from '../src/world_packs/book_gu_lead_vital.js';
import {guLeadFirstNightChoice,guFirstNightDrawnKey} from '../src/world_packs/book_gu_lead_first_night_choice.js';
import {guLeadEarlyRecovery,guLeadEarlyRecoveryClockRequest} from '../src/world_packs/book_gu_lead_early_recovery.js';
import {start,earned,hash,id as fixtureId,stone,drawn} from './helpers/ri_lead_fixture.mjs';
test('earned opening can rest, stop, serialize, resume and genuinely enter the next episode without a stone event',()=>{
 const l=earned(),oldPins=structuredClone(l.record.extensions);assert.throws(()=>l.admit(2),/Finish drawing/);l.admit(3);l.act('early_recovery.begin');
 assert.equal(l.quote('early_recovery.rest').duration,450);l.act('early_recovery.rest');assert.equal(l.pace(),30);assert.equal(l.view().jobs[0].duration,450);l.step(67);assert.equal(l.energy.reserve,18);l.roundTrip();l.cancel();
 assert.equal(l.quote('early_recovery.rest').duration,383);assert.equal(l.stock[stone],6);l.roundTrip();l.act('early_recovery.rest');l.step(383);
 assert.equal(l.energy.reserve,44);assert.equal(l.stock[stone],6);assert.equal(l.stock[drawn],undefined);assert.equal(l.state.actors.player.completed[id('refinement.draw_stone')],undefined);assert.equal(l.known[id('refinement.recovery')],undefined);assert.match(l.trace(),/pushed out/);l.roundTrip();
 assert.equal(l.quote('vital.leave').eligible,false);l.admit(2);assert.deepEqual(l.record.extensions.slice(0,2),oldPins);assert.equal(l.view().actions.find(a=>a.id===id('vital.leave')).eligible,true);
 const originalGu=l.stock[leadMoonlightKey];delete l.stock[leadMoonlightKey];assert.equal(l.quote('vital.leave').eligible,false);l.stock[leadMoonlightKey]=originalGu;const mobile=l.state.simulation.people.player.body.mobile;l.state.simulation.people.player.body.mobile=false;assert.equal(l.quote('vital.leave').eligible,false);l.state.simulation.people.player.body.mobile=mobile;const coins=l.stock[stone];l.stock[stone]=1;assert.equal(l.quote('vital.leave').eligible,false);l.stock[stone]=coins;
 l.act('vital.leave');l.step(7);l.roundTrip();l.cancel();l.act('vital.leave');l.step(20);assert.equal(l.stock[stone],4);l.roundTrip();
});
test('rest can be switched to a paid top-up; cancellation returns stone without rewinding natural progress',()=>{
 const l=earned();l.admit(3);l.act('early_recovery.begin');l.act('early_recovery.rest');l.step(67);l.cancel();assert.equal(l.quote('early_recovery.stone').duration,26);l.act('early_recovery.stone');l.step(16);l.roundTrip();l.cancel();assert.equal(l.stock[stone],6);assert.equal(l.energy.reserve,19);assert.equal(l.quote('early_recovery.rest').duration,367);
 l.act('early_recovery.stone');l.step(l.quote('early_recovery.stone').duration);assert.equal(l.energy.reserve,44);assert.equal(l.stock[stone],5);assert.equal(l.stock[drawn],1);assert.equal(l.state.actors.player.completed[id('refinement.draw_stone')],undefined);l.admit(2);l.roundTrip();
});
test('authentic legacy pending stone work and pins stay valid with the new method installed but unadmitted',()=>{
 const l=earned(false);l.act('refinement.draw_stone');l.step(7);const original=l.roundTrip();l.installRecovery();assert.deepEqual(l.roundTrip(),original);assert.equal(l.energy.reserve,14);l.cancel();assert.equal(l.stock[stone],6);l.act('refinement.draw_stone');l.step(30);assert.equal(l.energy.reserve,44);assert.equal(l.stock[stone],5);l.admit(2);l.act('vital.leave');l.step(5);l.roundTrip();l.cancel();l.validate();
});
test('alternate pending work requires its supporting pin and a fully recovered ready note',()=>{
 const l=earned();l.admit(3);l.act('early_recovery.begin');assert.throws(()=>l.admit(2),/Finish drawing/);l.act('early_recovery.rest');l.step(450);l.admit(2);l.act('vital.leave');const bad=structuredClone(l.record);bad.extensions=bad.extensions.filter(p=>p.id!==guLeadEarlyRecovery.id);assert.throws(()=>l.validate(bad),/supporting|Settled extension/);l.roundTrip();
});

test('time spent after stopping can finish recovery; resume neither invents a stone nor admits the later route early',()=>{
 const l=earned();l.admit(3);l.act('early_recovery.begin');l.act('early_recovery.rest');l.step(7);l.cancel();l.roundTrip();l.step(443);assert.equal(l.energy.reserve,44);assert.equal(l.quote('early_recovery.rest').eligible,false);assert.throws(()=>l.admit(2),/Rest|Finish drawing/);l.act('early_recovery.resume');l.admit(2);assert.equal(l.stock[stone],6);assert.equal(l.stock[drawn],undefined);l.roundTrip();
});
test('the original stone conclusion closes the optional early recovery window',()=>{
 const l=earned();l.act('refinement.draw_stone');l.step(30);assert.throws(()=>l.admit(3),/before you draw/);l.step(450);assert.equal(l.energy.reserve,44);l.admit(2);l.roundTrip();
});
test('alternate support rejects wrong target identity and unknown commands at registration',()=>{
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});const compiled=compileStructuredPack(guLeadLife,registry);mergeStructuredPack(compiled,registry);const d={...compiled.definition,contentHash:hash(guLeadLife)};
 for(const raw of [guLeadSelection,guLeadRefinement,guLeadVital])registerStructuredCommandExtension(raw,hash(raw),d,registry);
 const bad=structuredClone(guLeadEarlyRecovery);bad.supportAlternatives[0].target.contentHash='sha256:'+'0'.repeat(64);assert.throws(()=>registerStructuredCommandExtension(bad,hash(bad),d,registry,undefined,{bundledInstant:true}),/exact installed target/);
 const badCommand=structuredClone(guLeadEarlyRecovery);badCommand.supportAlternatives[0].commands.push(id('vital.not_a_command'));assert.throws(()=>registerStructuredCommandExtension(badCommand,hash(badCommand),d,registry,undefined,{bundledInstant:true}),/exact installed target/);
 assert.equal(hash(guLeadRefinement),'sha256:20a9c2c6d1207e36f37bf61801e37a31553e5c1d01531c8c0934b59451494413');assert.equal(hash(guLeadVital),'sha256:89c5e2f92e0baa4a354350c0d904962dc6b8e96911ac3e5770404767acb3b441');
});

test('activating recovery preserves the original stone option and closes passive early recovery afterward',()=>{
 const l=earned();l.admit(3);l.act('early_recovery.begin');assert.equal(l.quote('refinement.draw_stone').eligible,true);l.act('refinement.draw_stone');l.step(30);l.admit(2);l.act('vital.leave');l.step(20);l.roundTrip();assert.equal(l.stock[stone],3);assert.equal(l.stock[drawn],1);assert.equal(l.quote('early_recovery.rest').eligible,false);
});

test('declining recovery permits actual departure at14/44 without a full-ready or original stone receipt',()=>{
 const l=earned();l.installFirstNight();l.admit(4);l.act('first_night_choice.set_out');assert.equal(l.energy.reserve,14);assert.equal(l.known[id('early_recovery.ready')],undefined);assert.equal(l.known[id('refinement.recovery')],undefined);l.admit(2);l.act('vital.leave');l.step(20);assert.equal(l.stock[stone],4);assert.equal(l.energy.reserve,15);l.roundTrip();assert.equal(l.state.actors.player.completed[id('refinement.draw_stone')],undefined);
});
test('partial natural recovery supports measured1minute draws from the same kept stone and cancellation',()=>{
 const l=earned();l.installFirstNight();l.admit(4);l.act('first_night_choice.begin_sleep');l.step(67);assert.equal(l.energy.reserve,18);l.roundTrip();
 assert.equal(l.quote('first_night_choice.draw_part_0').duration,1);assert.equal(l.view().actions.find(a=>a.id===id('first_night_choice.draw_part_0')).queueRepeatable,false);l.act('first_night_choice.draw_part_0');l.step(1);assert.equal(l.energy.reserve,19);assert.equal(l.stock[stone],5);assert.equal(l.stock[guFirstNightDrawnKey(1)],1);l.roundTrip();
 l.act('first_night_choice.draw_part_1');l.step(1);assert.equal(l.energy.reserve,20);assert.equal(l.stock[guFirstNightDrawnKey(1)]??0,0);assert.equal(l.stock[guFirstNightDrawnKey(2)],1);l.act('first_night_choice.draw_part_2');l.roundTrip();l.cancel();assert.equal(l.energy.reserve,20);assert.equal(l.stock[guFirstNightDrawnKey(2)],1);assert.equal(l.stock[guFirstNightDrawnKey(3)]??0,0);assert.equal(l.stock[stone]+Array.from({length:30},(_,i)=>l.stock[guFirstNightDrawnKey(i+1)]??0).reduce((a,b)=>a+b,0),6);
 l.act('first_night_choice.set_out');l.admit(2);l.act('vital.leave');l.step(20);assert.equal(l.stock[stone],3);assert.equal(l.stock[guFirstNightDrawnKey(2)],1);l.roundTrip();
});
test('a measured stone can be chosen without sleeping and a full top-up remains separate',()=>{
 const l=earned();l.installFirstNight();l.admit(4);l.act('first_night_choice.ready_stone');assert.equal(l.known[id('first_night_choice.started')],undefined);l.act('first_night_choice.draw_part_0');l.step(1);assert.equal(l.energy.reserve,15);assert.equal(l.stock[guFirstNightDrawnKey(1)],1);assert.equal(l.known[id('early_recovery.ready')],undefined);l.roundTrip();
 const full=earned();full.installFirstNight();full.admit(4);full.act('first_night_choice.begin_sleep');full.step(67);assert.equal(full.energy.reserve,18);assert.equal(full.quote('first_night_choice.stone').duration,26);full.act('first_night_choice.stone');full.step(26);assert.equal(full.energy.reserve,44);assert.equal(full.stock[stone],5);assert.equal(full.stock[drawn],1);full.admit(2);full.roundTrip();
});
test('pending earlier alternate work survives installing the newer method and still rejects altered support',()=>{
 const l=earned();l.admit(3);l.act('early_recovery.begin');l.act('early_recovery.rest');l.step(450);l.admit(2);l.act('vital.leave');l.step(5);const before=l.roundTrip();l.installFirstNight();assert.deepEqual(l.roundTrip(),before);const bad=structuredClone(l.state);bad.simulation.jobs[0].completionSupport.requires={all:[]};assert.throws(()=>l.validateState(bad),/exact pending/);l.cancel();l.act('vital.leave');l.step(20);l.roundTrip();
});
