import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture,context,envelope} from '../docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L2/fixture.mjs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {previewMolCommand,commitMolCommand,molPresentation,validateMolCampaignState} from '../src/book_world_mol_host.js';
import {molCommands,molFacts} from '../src/book_world_mol_actions.js';
import {validateMolEnvelope,molCalendarAt,molQuestProjection} from '../src/book_world_mol_native.js';
import {MOL_IDS as I,MOL_LOCATIONS as L} from '../src/book_world_mol_ids.js';
import {MOL_START_ZORIAN,MOL_BEGIN_ZORIAN,resolveSeatActor,molSupplier} from '../src/book_world_mol_starts.js';
import {installedWorldPack} from '../src/world_pack_registry.js';
// G1/G3/G15 (Zorian stage record). Boots the pack against the current registry with the new start (KJ3P lesson),
// proves the visitor start is unchanged, and runs the first Zorian command as the seat.
const ids=(p,c=context)=>molPresentation(p.state,registry,c(p)).sections.flatMap(s=>s.actions.map(a=>a.id));
// A pre-entry state: the visitor fixture with every Cyoria owner removed, standing in the Village.
function village(){
 const p=fixture(false),s=p.state;
 delete s.motherOfLearning;delete s.worlds[I.world];
 for(const id of Object.keys(s.actors))if(id.startsWith('book.mol.')&&id!=='player'){delete s.actors[id];delete s.simulation.people[id];delete p.gameplay[id];delete p.vitals[id];}
 for(const v of Object.values(s.simulation))if(v&&typeof v==='object'&&!Array.isArray(v))for(const id of Object.keys(v))if(id.startsWith('book.mol.')&&id!=='book.mol.visitor_branch'&&!id.includes('.lore.')&&(id.split('.').length===3))delete v[id];
 for(const bag of [s.simulation.claims,s.simulation.controllers])for(const [k,v] of Object.entries(bag))if(k.startsWith('book.mol.')||JSON.stringify(v).includes('book.mol.'))delete bag[k];
 s.simulation.log=[];
 s.actors.player.worldId='base.frontier';s.simulation.people.player.location='Village';
 for(const k of Object.keys(s.actors.player.resources))if(k.startsWith('book.mol.'))delete s.actors.player.resources[k];
 delete s.simulation.situations['book.mol.visitor_branch'];s.actors.player.facts={};s.actors.player.completed={};s.simulation.jobs=[];
 for(const k of Object.keys(s.simulation.knowledge.player||{}))if(k.startsWith('book.mol.'))delete s.simulation.knowledge.player[k];
 s.schema=10;return p;
}
const begin=p=>({...p,...commitMolCommand(p.state,registry,{type:'book_mol',id:MOL_BEGIN_ZORIAN},context0(p))});
const context0=p=>({actorId:'player',nativeAlive:true,nativeBody:p.state.simulation.people.player.body,molNative:{bound:true,revision:0,body:p.state.simulation.people.player.body},vitals:p.vitals,gameplay:p.gameplay,external:p.external,equipment:p.equipment,facts:{location:p.state.simulation.people.player.location}});
function zorian(){const p=begin(village());const d=p.state.motherOfLearning;d.nativeRevision=1;return p;}
const zctx=p=>({...context0(p),molNative:{bound:true,revision:1,body:p.state.simulation.people.player.body},facts:{location:p.state.simulation.people.player.location}});

test('the pack boots against the current registry and carries the Zorian rows in the shared command list',()=>{
 assert.ok(installedWorldPack('book.mol').pack.native.definitions.commands.some(c=>c.id==='book.mol.zorian.morning_home'));
 assert.equal(new Set(molCommands.map(c=>c.id)).size,molCommands.length);
 assert.equal(registry.simulation.commands.get('book.mol.zorian.morning_home').actorId,'player');
});
test('resolveSeatActor rewrites actor positions only and is the identity for the player seat',()=>{
 const row={actorId:'player',costs:[{actor:'player',key:'player.note'}],effects:[{type:'transfer',from:'player',to:'book.mol.imaya'}],label:'player'};
 assert.deepEqual(resolveSeatActor(row),row);
 const r=resolveSeatActor(row,'book.mol.seat');
 assert.equal(r.actorId,'book.mol.seat');assert.equal(r.costs[0].actor,'book.mol.seat');assert.equal(r.costs[0].key,'player.note');assert.equal(r.effects[0].from,'book.mol.seat');assert.equal(r.label,'player');
 assert.equal(JSON.stringify(resolveSeatActor(molCommands)).includes('"actorId":"player"'),true);
 assert.equal(JSON.stringify(resolveSeatActor(molCommands,'x')).match(/"actorId":"player"/g),null);
});
test('visitor start is unchanged: chart path, action ids and facts stay visitor-supplied',()=>{
 const p=fixture(false);
 assert.equal(molSupplier(p.state).name,'visitorSupplier');
 const f=molFacts(p.state,context(p));
 assert.equal(f['mol.playerSupported'],true);assert.equal(f['mol.zorianSeat'],undefined);assert.equal(f[`mol.support.${I.zorian}`],true);
 const list=ids(p);
 assert.ok(!list.includes(MOL_BEGIN_ZORIAN)&&!list.includes('book.mol.zorian.morning_home'));
 assert.ok(list.includes('book.mol.zorian_talk')||list.includes('book.mol.move.station'));
 const v=village();
 const c=context0(v);c.facts['village.elderMet']=true;const chart=previewMolCommand(v.state,registry,'book.mol.chart',c);
 assert.equal(chart.visible,true);assert.equal(chart.eligible,true,chart.reasons.join(' '));
 assert.equal(previewMolCommand(v.state,registry,MOL_BEGIN_ZORIAN,c).visible,true);
 assert.equal(previewMolCommand(v.state,registry,'book.mol.zorian.morning_home',context0(v)).visible,false);
});
test('Zorian start: begins in Cyoria as the seat with supplier facts, student status and no guest permit',()=>{
 const p=zorian(),d=p.state.motherOfLearning;
 assert.equal(d.entryProfile,MOL_START_ZORIAN);assert.deepEqual(d.connections,[]);assert.equal(d.visits.length,0);
 assert.equal(p.state.actors.player.worldId,I.world);assert.equal(p.state.simulation.people.player.location,L.house);
 assert.equal(p.state.actors.player.facts['book.mol.guestPermit'],undefined);
 assert.doesNotThrow(()=>validateMolCampaignState(p.state));
 const f=molFacts(p.state,zctx(p));
 assert.equal(f['mol.nativeBound'],true);assert.equal(f['mol.playerSupported'],true);assert.equal(f[`mol.local.${I.world}`],true);
 assert.equal(f['mol.zorianSeat'],true);assert.equal(f['actor.book.mol.guestPermit'],true);assert.equal(molSupplier(p.state).name,'zorianSupplier');
});
test('G15: in the Zorian start the book Zorian is not a met resident and zorian_talk is hidden',()=>{
 const p=zorian(),f=molFacts(p.state,zctx(p));
 assert.equal(f[`mol.support.${I.zorian}`],false);assert.equal(f[`mol.support.${I.imaya}`],true);
 const list=ids(p,zctx);assert.ok(list.includes('book.mol.zorian.morning_home'));assert.ok(!list.includes('book.mol.zorian_talk'));
 for(const hidden of ['book.mol.chart','book.mol.guest_pass','book.mol.enter','book.mol.return','book.mol.enroll'])assert.ok(!list.includes(hidden),hidden);
});
test('first Zorian command previews and commits as the seat',()=>{
 let p=zorian();const id='book.mol.zorian.morning_home',q=previewMolCommand(p.state,registry,id,zctx(p));
 assert.equal(q.visible,true);assert.equal(q.eligible,true,q.reasons.join(' '));
 const out=commitMolCommand(p.state,registry,{type:'book_mol',id},zctx(p));
 assert.equal(out.state.simulation.jobs.find(j=>j.commandId===id).actorId,'player');
 assert.ok(out.state.sequence>p.state.sequence);
});
test('the Zorian start passes the native envelope check (location and presence markers agree)',()=>{
 const p=zorian(),n=p.raw.book_world_mol_native;p.state.motherOfLearning.nativeRevision=n.revision;p.state.motherOfLearning.initializedAt=n.initializedAt;n.worldOwners[0].calendar=molCalendarAt(p.state.motherOfLearning.instances[0].clock.elapsed);
 p.raw.quests[I.quest]=molQuestProjection(p.state,I.world);
 assert.doesNotThrow(()=>validateMolEnvelope({...structuredClone(p.raw),expansion:structuredClone(p.state),'current location':L.house},p.state));
});

// G4/G5 (S0 content on the seat). Scene rows lr.mol.main.00101-00404; figures carry locators in the stage record.
import {advanceSimulationBoundary} from '../src/simulation.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {energyView} from '../src/energy_resources.js';
import {MOL_ZORIAN_RESERVE} from '../src/book_world_mol_starts.js';
import {MOL_LOCATIONS as LOC} from '../src/book_world_mol_ids.js';
import fs from 'node:fs';
const Z='book.mol.zorian.s0.';
const reserve=p=>energyView(p.state,'player').find(r=>r.id===MOL_ZORIAN_RESERVE);
const at=(p,where)=>{const out=commitMolCommand(p.state,registry,{type:'book_mol',id:'book.mol.move.'+where},zctx(p));return {...p,...out};};
const act=(p,id)=>({...p,...commitMolCommand(p.state,registry,{type:'book_mol',id},zctx(p))});
const finish=p=>{let n=0;while(p.state.simulation.jobs.some(j=>j.actorId==='player')&&n++<2000){p.state.clock++;advanceSimulationBoundary(p,registry,{player:zctx(p)});}return p;};
const run=(p,id)=>finish(act(p,id));
test('the visitor start keeps the exact frozen action list and fact keys (no Zorian row leaks)',()=>{
 const frozen=JSON.parse(fs.readFileSync(new URL('./fixtures/mol_visitor_start_surface.json',import.meta.url),'utf8'));
 const p=fixture(false);
 assert.deepEqual(ids(p).sort(),frozen.ids);assert.deepEqual(Object.keys(molFacts(p.state,context(p))).sort(),frozen.facts);
 assert.ok(!ids(p).some(id=>id.startsWith(Z)));
});
test('G5 ZS1: the reserve starts at the stated 8 casts, shows on the seat and falls with each cast',()=>{
 let p=zorian();const r0=reserve(p);assert.equal(r0.reserve,8);assert.equal(r0.capacity,8);
 assert.match(molPresentation(p.state,registry,zctx(p)).sections[0].description,/reserve of 8 of 8 casts/);
 p=at(p,'court');assert.ok(ids(p,zctx).includes(Z+'missile_practice'));
 p=run(p,Z+'missile_practice');assert.equal(reserve(p).reserve,7);
 assert.match(molPresentation(p.state,registry,zctx(p)).sections[0].description,/reserve of 7 of 8 casts/);
 for(let i=0;i<7;i++)p=run(p,Z+'missile_practice');
 assert.equal(reserve(p).reserve,0);
 const q=previewMolCommand(p.state,registry,Z+'missile_practice',zctx(p));assert.equal(q.eligible,false);
 p=at(p,'house');p=run(p,Z+'rest_reserve');assert.equal(reserve(p).reserve,8);
});
test('G5: the cast count survives a save, reload, export and import of the expansion state',()=>{
 let p=at(zorian(),'court');for(let i=0;i<3;i++)p=run(p,Z+'missile_practice');
 assert.equal(reserve(p).reserve,5);
 const exported=JSON.stringify(p.state),imported=loadExpansionState(JSON.parse(exported),registry);
 assert.equal(energyView(imported,'player').find(r=>r.id===MOL_ZORIAN_RESERVE).reserve,5);
 assert.doesNotThrow(()=>validateMolCampaignState(imported));
});
test('G4/G5: school-day rows commit as the seat and write the pinned s0 fact keys',()=>{
 let p=at(zorian(),'academy');
 p=run(p,Z+'invocations_class');const f=p.state.actors.player.facts;
 assert.equal(f['book.mol.invocationStudied'],true);assert.equal(f['book.mol.loop.s0.invocations_class'],true);
 p=at(p,'workshop');p=run(p,Z+'placement_test');assert.equal(p.state.actors.player.facts['book.mol.loop.s0.placement_test'],true);
 p=at(p,'court');p=run(p,Z+'shaping_practice');assert.equal(p.state.actors.player.facts['book.mol.loop.s0.basic_three_drilled'],true);
 p=run(p,Z+'watch_missile');assert.equal(p.state.actors.player.facts['book.mol.loop.s0.watched_missile'],true);
 assert.equal(reserve(p).reserve,8);
 assert.equal(previewMolCommand(p.state,registry,Z+'watch_missile',zctx(p)).eligible,false);
});
test('G4: the c1-c4 roster, places and purses are pack rows with locators, and the purse figures stay unstated',()=>{
 const pack=installedWorldPack('book.mol').pack,rows=pack.content;
 const roster=rows.people.filter(r=>r.tags?.includes('zorian_s0'));
 assert.ok(roster.length>=16&&roster.every(r=>r.locator&&r.tags.some(t=>t.startsWith('tier:'))));
 const native=new Set(pack.native.definitions.people.map(p=>p.id));assert.ok(roster.every(r=>!native.has(r.id)));
 const places=rows.catalog.filter(r=>r.kind==='place');assert.ok(places.length>=20&&places.every(r=>r.locator));
 const purses=rows.catalog.filter(r=>r.kind==='purse');assert.equal(purses.length,2);assert.ok(purses.every(r=>/not stated/.test(r.label)));
});
