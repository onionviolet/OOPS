import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,wait,ctx,def,registry,I,save} from './lotm_helpers.js';
import {previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
const id='recover_dock_manifest';
const sailor=()=>run(run(run(fresh(500,'storm'),'report_in_storm'),'accept_allocation_sa'),'ingest_sa');
const preview=p=>previewSimulationCommand(p.state,registry,`book.lotm.${id}`,ctx(p,I.stormOfficer));
const checked=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));};
test('a paid underwater recovery needs the active Sailor faculty and a prepared breath',()=>{
 assert.ok(def(id),'the submerged manifest has a real command');
 let p=sailor();assert.equal(preview(p).eligible,false);
 p=run(p,'ab.deep_breath');assert.equal(preview(p).eligible,true);
 assert.ok(p.state.simulation.conditions.player['book.lotm.slick_scales'],'the ability drawback remains');
 p.state.simulation.faculties.player[I.sailor].suppressed=true;
 assert.equal(preview(p).eligible,false,'a lingering breath cannot replace a suppressed source');
 const plain=run(fresh(500,'storm'),'report_in_storm');assert.equal(preview(plain).eligible,false);
});
test('work pays only on completion, then cannot replay the same recovered manifest',()=>{
 let p=run(sailor(),'ab.deep_breath');const money=p.external.money;
 p=run(p,id);checked(p);assert.equal(p.external.money,money);
 p=wait(p,4);assert.equal(p.external.money,money);
 p=wait(p,1);assert.equal(p.external.money,money+24);checked(p);
 assert.equal(p.state.actors.player.completed[`book.lotm.${id}`],1);
 assert.equal(preview(p).eligible,false);p=wait(p,10);assert.equal(p.external.money,money+24);
});
test('cancelled recovery does not pay or claim the manifest',()=>{
 let p=run(sailor(),'ab.deep_breath');const attention=p.state.actors[I.stormOfficer].resources['book.lotm.attention'];p=run(p,id);const money=p.external.money;
 assert.equal(p.state.actors[I.stormOfficer].resources['book.lotm.attention'],attention-1);
 const out=cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,ctx(p));p={...p,...out};
 p=wait(p,5);assert.equal(p.external.money,money);assert.equal(p.state.actors.player.completed[`book.lotm.${id}`],undefined);
 assert.equal(preview(p).eligible,true);assert.equal(p.state.actors[I.stormOfficer].resources['book.lotm.attention'],attention);checked(p);
});
test('lost breath, source or officer support stops settlement without payment and permits retry',()=>{
 for(const lose of [p=>p.state.simulation.conditions.player['book.lotm.long_breath'].expiresAt=p.state.clock+2,
  p=>{p.state.simulation.faculties.player[I.sailor].active=false;},p=>{p.state.simulation.people[I.stormOfficer].life='dead';}]){
  let p=run(run(sailor(),'ab.deep_breath'),id);const money=p.external.money;lose(p);p=wait(p,5);
  assert.equal(p.external.money,money);assert.equal(p.state.simulation.jobs.length,0);
  assert.equal(p.state.actors.player.completed[`book.lotm.${id}`],undefined);
  assert.equal(p.state.simulation.claims['book.lotm.receipt.'+id],undefined);checked(p);
 }
});
