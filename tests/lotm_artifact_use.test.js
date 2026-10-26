import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,ctx,def,registry,I,save,hostOver} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {meritRes} from '../src/book_world_lotm_merit.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
const lesson='learn_sealed_3_protocol',work='work_sealed_3_protocol';
const member=()=>run(run(run(fresh(),'report_in'),'accept_allocation'),'ingest');
const custody=()=>run(member(),'request_sealed_3');
const context=(p,target=I.supervisor)=>{const c=ctx(p,target);return {...c,vitals:p.vitals||c.vitals,vitalsByActor:p.vitals||c.vitals};};
const act=(p,id)=>({...p,...commitSimulationCommand(p.state,registry,{id:def(id).id},context(p,def(id).targetId))});
const wait=(p,n)=>{const c=context(p),out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});const v=structuredClone(out.vitals||c.vitals);if(out.native){v.player.stamina=v.player.max_stamina-out.native.staminaToFull;v.player.health=v.player.max_health-out.native.hpToFull;}return {...p,...out,vitals:v};};
const preview=(p,id=work)=>previewSimulationCommand(p.state,registry,def(id).id,context(p));
const taught=()=>wait(act(custody(),lesson),5);
const attention=p=>p.state.actors[I.supervisor].resources['book.lotm.attention'];
const merit=p=>p.state.actors.player.resources[meritRes.earned]||0;
const checked=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));};
test('G3 instruction and work require actual cleared custody and an understood protocol',()=>{
 let p=custody();assert.equal(preview(p).visible,false);assert.equal(preview(p).eligible,false);
 const n=attention(p);p=act(p,lesson);assert.equal(attention(p),n-1);assert.equal(preview(p).eligible,false);checked(p);
 p=wait(p,5);assert.equal(attention(p),n);assert.equal(preview(p).eligible,true);checked(p);
 delete p.gameplay.player.inventory[K.sealed3];assert.equal(preview(p).eligible,false,'the custody flag cannot replace the item');
 assert.equal(preview(member(),lesson).eligible,false);assert.equal(preview(run(fresh(),'report_in'),lesson).eligible,false);
});
test('completed G3 work changes the real body and existing merit consumer; return removes support',()=>{
 let p=taught();const n=attention(p),body=p.vitals.player.stamina;
 p=act(p,work);assert.equal(merit(p),0);assert.equal(attention(p),n-1);assert.equal(p.vitals.player.stamina,body-3);checked(p);
 p=wait(p,14);assert.equal(merit(p),0);assert.equal(p.vitals.player.stamina,body-3);
 p=wait(p,1);assert.equal(merit(p),2);assert.equal(p.vitals.player.stamina,body-3);assert.equal(attention(p),n);checked(p);
 p=wait(act(p,'merit_case_file_copy'),30);assert.equal(merit(p),3);
 p=act(p,'merit_buy_sunflower_lot');assert.equal(p.state.actors.player.resources[meritRes.spent],3);checked(p);
 p=act(p,'return_sealed_3');assert.equal(preview(p).visible,false);assert.equal(preview(p).eligible,false);assert.equal(p.vitals.player.stamina,body-3);
 assert.equal(def('merit_cold_room_watch').duration,60,'ordinary route remains');checked(p);
});
test('Stop refunds the borrowed attention without instruction, merit or fatigue',()=>{
 for(const id of [lesson,work]){
  let p=id===lesson?custody():taught();const n=attention(p),body=context(p).vitals.player.stamina;p=act(p,id);
  p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,context(p))};p=wait(p,20);
  assert.equal(attention(p),n);assert.equal(merit(p),0);assert.equal(p.vitals.player.stamina,body);assert.equal(p.state.actors.player.completed[def(id).id],undefined);checked(p);
 }
});
test('live group, physical custody, body and supervisor are rechecked before settlement',()=>{
 const losses=[p=>{p.state.simulation.people[I.member].location=L.lodging;p.state.simulation.people[I.evernightDeacon].location=L.lodging;},
  p=>{delete p.gameplay.player.inventory[K.sealed3];p.gameplay[I.supervisor].inventory[K.sealed3]=1;p.state.actors.player.facts['book.lotm.sealed.held']=false;},
  p=>{p.state.simulation.people[I.supervisor].life='dead';}];
 const low=taught();low.vitals.player.stamina=2;assert.equal(preview(low).eligible,false,'need the actual body cost before admission');
 for(const lose of losses){let p=taught();const n=attention(p);p=act(p,work);lose(p);p=wait(p,15);assert.equal(merit(p),0);assert.equal(attention(p),n);assert.equal(p.state.simulation.jobs.length,0);assert.equal(p.state.actors.player.completed[def(work).id],undefined);checked(p);}
});
test('known-source host offers omit unknown powers and retain acquired suppressed powers',()=>{
 const none=hostOver(member()).host.view().actions;assert.equal(none.some(a=>a.id.startsWith('book.lotm.ab.')),false);
 let p=run(run(run(fresh(),'report_in'),'accept_allocation_cc'),'ingest_cc');
 const find=()=>hostOver(p).host.view().actions.find(a=>a.id==='book.lotm.ab.cold_ward');assert.equal(find().eligible,true);
 assert.equal(hostOver(p).host.view().actions.some(a=>a.id==='book.lotm.ab.grave_strength'),false);
 p.state.simulation.faculties.player[I.corpse].suppressed=true;assert.equal(find().eligible,false);
});
