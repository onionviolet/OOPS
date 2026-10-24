import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,wait,at,save,def,ctx,registry,I,vit,vitals} from './lotm_helpers.js';
import {previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
import {characterBioView} from '../src/character_bio.js';
import {LOTM_LOCATIONS as L} from '../src/book_world_lotm_ids.js';
import {lotmCommands} from '../src/book_world_lotm_actions.js';
import {LOTM_HOSTILES,lotmReveal,abilityIds,abilityRows,hostileAbilityCommands} from '../src/book_world_lotm_abilities.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
// Sequence 9 and 8 abilities as descriptors: acquired, a cost, a drawback, concealed looks that only an observer sees, and the same rows used by a hostile Beyonder.
const cc9=()=>{let p=run(fresh(),'report_in');p=run(p,'accept_allocation_cc');return run(p,'ingest_cc');};
const cc8=()=>{let p=cc9();for(const m of [25,25,25])p=wait(run(p,'act_laying_out'),m);p=wait(run(p,'act_vigil'),60);p=run(p,'request_assessment_cc');return run(p,'ingest_gravedigger');};
const prev=(p,id,actor='player')=>previewSimulationCommand(p.state,registry,id,{...ctx(p),actorId:actor,facts:{...ctx(p).facts,location:p.state.simulation.people[actor].location}});
const stamina=p=>p.vitals?.player?.stamina;
test('every Sequence 9 and 8 ability is a compiled descriptor row: acquired, costed and with a drawback',()=>{
 for(const [pk,rows] of Object.entries(abilityRows))for(const a of rows){
  assert.ok(a.costs.length>0,`${pk}.${a.key} has a cost`);assert.ok(a.drawback.price.length>0,`${pk}.${a.key} has a drawback`);
  const c=lotmCommands.find(x=>x.id===`book.lotm.ab.${a.key}`);assert.ok(c,a.key);
  assert.ok(c.requires.all.length,'the compiled support rule is attached');
  assert.ok(JSON.stringify(c.requires).includes(a.stage==='base'?'faculty.':'faculty.'),'a held source is required');
 }
});
test('the Sequence 9 ability needs the source, applies its effect and carries its drawback; the Sequence 8 one needs the second source',()=>{
 const none=run(fresh(),'report_in');assert.equal(prev(none,'book.lotm.ab.cold_ward').eligible,false,'no source, no ability');
 let p=cc9();assert.equal(prev(p,'book.lotm.ab.cold_ward').eligible,true);assert.equal(prev(p,'book.lotm.ab.grave_strength').eligible,false,'the Sequence 8 ability needs the Gravedigger source');
 const out=commitSimulationCommand(p.state,registry,{id:'book.lotm.ab.cold_ward'},ctx(p),p.state.sequence);
 const conds=out.state.simulation.conditions.player;assert.ok(conds['book.lotm.cold_ward'],'the effect');assert.ok(conds['book.lotm.pallor'],'the drawback lands with the use');
 const q=cc8();assert.equal(prev(q,'book.lotm.ab.grave_strength').eligible,true);assert.equal(prev(q,'book.lotm.ab.spirit_sight').eligible,true);
 // Another pathway's source never satisfies it.
 let s=run(run(run(fresh(),'report_in'),'accept_allocation'),'ingest');assert.equal(prev(s,'book.lotm.ab.cold_ward').eligible,false);
});
test('looks are concealed by default: the owner does not see them, a Beyonder observer does, and the dead see the undead look',()=>{
 let p=cc9();const view=args=>characterBioView({state:p.state,registry,context:{...ctx(p),worldId:I.world,actorId:'player'},...args});
 const own=view({}).description.find(r=>r.id==='look.skin');assert.equal(own,undefined,'unobserved: nothing shown');
 const halesEyes=lotmReveal(I.supervisor,registry,p.state);assert.ok(halesEyes.includes(I.corpse));
 const seen=view({reveal:halesEyes}).description.find(r=>r.id==='look.skin');assert.match(seen.detail,/pale and cold/);
 assert.ok(lotmReveal('book.lotm.dead',registry,p.state).includes(I.corpse));assert.deepEqual(lotmReveal('civilian',registry,p.state),[],'an ordinary observer sees nothing');
 // A drawback condition's look follows the same rule.
 const out=commitSimulationCommand(p.state,registry,{id:'book.lotm.ab.cold_ward'},ctx(p),p.state.sequence);p={...p,state:out.state};
 assert.equal(view({}).description.find(r=>r.id==='look.skin'),undefined);
 const after=view({reveal:lotmReveal(I.supervisor,registry,p.state)}).description.find(r=>r.id==='look.skin');assert.match(after.detail,/too pale and too cold/,'the higher-ranked pallor look wins the slot');
});
test('a hostile Beyonder uses the same records: the same costs and effects, bound to their own source and body',()=>{
 const rogue=LOTM_HOSTILES.find(h=>h.key==='cc');
 let p=cc9();const id=rogue.id,hk={...p.state};
 // Enrol the rogue as a person who holds the Corpse Collector source (cloned from the player's own grant).
 p.state.actors[id]={facts:{},resources:{},completed:{},sources:{[I.corpse]:structuredClone(p.state.actors.player.sources[I.corpse])},techniques:{},worldId:I.world};
 p.state.simulation.people[id]={life:'alive',inventory:'native',location:L.docks,bornAt:0,definitionId:id,definitionRevision:1,vitals:{...vit},body:{id:`native.person.${id}.body`,form:'human',hands:2,mobile:true,ownerId:id,controllerId:id}};
 p.state.simulation.faculties[id]={[I.corpse]:structuredClone(p.state.simulation.faculties.player[I.corpse])};
 p.state.simulation.conditions[id]={};
 const c={...ctx(p),actorId:id,facts:{location:L.docks},vitals:{...vitals(),[id]:vit}};
 const pv=previewSimulationCommand(p.state,registry,`book.lotm.ab.cold_ward.cc`,c);assert.equal(pv.eligible,true,pv.reasons?.join());
 const out=commitSimulationCommand(p.state,registry,{id:'book.lotm.ab.cold_ward.cc'},c,p.state.sequence);
 assert.ok(out.state.simulation.conditions[id]['book.lotm.cold_ward']);assert.ok(out.state.simulation.conditions[id]['book.lotm.pallor']);
 assert.equal(out.state.simulation.conditions.player?.['book.lotm.cold_ward'],undefined,'it acted on the rogue, not the player');
 const mine=lotmCommands.find(x=>x.id==='book.lotm.ab.cold_ward'),theirs=hostileAbilityCommands.find(x=>x.id==='book.lotm.ab.cold_ward.cc');
 assert.equal(JSON.stringify(theirs.costs),JSON.stringify(mine.costs));assert.equal(theirs.actorId,id);
 // The rogue without the source cannot.
 delete p.state.simulation.faculties[id][I.corpse];delete p.state.actors[id].sources[I.corpse];
 assert.equal(previewSimulationCommand(p.state,registry,'book.lotm.ab.cold_ward.cc',c).eligible,false);
});
test('the new conditions leave a valid Tingen state',()=>{
 let p=cc9();const out=commitSimulationCommand(p.state,registry,{id:'book.lotm.ab.cold_ward'},ctx(p),p.state.sequence);assert.ok(validateLotmState(out.state));
});
test('every pathway\'s hostile Beyonder runs the same base ability records through the engine (Savant and Sailor too)',()=>{
 const cases=[['sv',()=>run(run(run(fresh(500,'machinery'),'report_in_machinery'),'accept_allocation_sv'),'ingest_sv'),I.savant,'full_recall'],
  ['sa',()=>run(run(run(fresh(500,'storm'),'report_in_storm'),'accept_allocation_sa'),'ingest_sa'),I.sailor,'storm_balance']];
 for(const [key,make,source,ability] of cases){
  const p=make(),id=`book.lotm.rogue.${key}`;
  p.state.actors[id]={facts:{},resources:{},completed:{},sources:{[source]:structuredClone(p.state.actors.player.sources[source])},techniques:{},worldId:I.world};
  p.state.simulation.people[id]={life:'alive',inventory:'native',location:L.docks,bornAt:0,definitionId:id,definitionRevision:1,vitals:{...vit},body:{id:`native.person.${id}.body`,form:'human',hands:2,mobile:true,ownerId:id,controllerId:id}};
  p.state.simulation.faculties[id]={[source]:structuredClone(p.state.simulation.faculties.player[source])};
  const c={...ctx(p),actorId:id,facts:{location:L.docks},vitals:{...vitals(),[id]:vit}};
  const hostile=`book.lotm.ab.${ability}.${key}`;
  assert.equal(previewSimulationCommand(p.state,registry,hostile,c).eligible,true,key);
  commitSimulationCommand(p.state,registry,{id:hostile},c,p.state.sequence);
  const mine=lotmCommands.find(x=>x.id===`book.lotm.ab.${ability}`);assert.equal(JSON.stringify(hostileAbilityCommands.find(x=>x.id===hostile).costs),JSON.stringify(mine.costs));
 }
});
test('an ability is repeatable: using it twice works, and the drawback keeps landing',()=>{
 let p=cc9();let out=commitSimulationCommand(p.state,registry,{id:'book.lotm.ab.cold_ward'},ctx(p),p.state.sequence);
 p={...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay};
 assert.equal(previewSimulationCommand(p.state,registry,'book.lotm.ab.cold_ward',ctx(p)).eligible,true,'no once-claim blocks a second use');
 out=commitSimulationCommand(p.state,registry,{id:'book.lotm.ab.cold_ward'},ctx(p),p.state.sequence);
 assert.ok(out.state.simulation.conditions.player['book.lotm.pallor']);assert.ok(validateLotmState(out.state));
});
