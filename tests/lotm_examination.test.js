import test from 'node:test';
import '../src/book_world_lotm_domain.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fresh,run,wait,holds,save,ctx,registry,hostOver,I} from './lotm_helpers.js';
import {LOTM_KEYS as K,LOTM_LOCATIONS as L} from '../src/book_world_lotm_ids.js';
import {allRows,savantRow} from '../src/book_world_lotm_rows.js';
import {examinationCommand} from '../src/book_world_lotm_pathways.js';
import {lotmCommands} from '../src/book_world_lotm_actions.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
const dir='docs/gm/dispatch/lotm-q6-2026-10-25/';
const checked=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const studied=()=>{let p=run(run(run(fresh(500,'machinery'),'report_in_machinery'),'accept_allocation_sv'),'ingest_sv');for(let n=0;n<3;n++)p=wait(run(p,'act_study'),30);return run(wait(run(p,'act_apply'),45),'request_prescreen_sv');};
const readyCC=()=>{let p=run(run(run(fresh(),'report_in'),'accept_allocation_cc'),'ingest_cc');for(let n=0;n<3;n++)p=wait(run(p,'act_laying_out'),25);return run(wait(run(p,'act_vigil'),60),'request_assessment_cc');};
const command=examinationCommand(savantRow),preview=p=>previewSimulationCommand(p.state,registry,command.id,ctx(p,command.targetId));
test('every historical timed LOTM definition remains byte-identical; all new exams use descriptor role data',()=>{
 const baseline=JSON.parse(fs.readFileSync(dir+'baseline-commands.json'));
 for(const {definition:c} of Object.values(baseline).filter(x=>x.definition.duration>0))assert.deepEqual(lotmCommands.find(n=>n.id===c.id),c,c.id);
 for(const row of allRows.filter(r=>r.exam)){
  const d=examinationCommand(row);assert.equal(d.targetId,row.exam.examinerId);assert.equal(d.duration,row.exam.minutes);assert.ok(d.completionRequires);assert.equal(d.completionFailure,'refund');
 }
 // A different examiner role and duration need row changes, not a pathway branch.
 const row={...savantRow,key:'fixture',exam:{...savantRow.exam,currentId:'fixture_exam',role:'bishop',minutes:17}};
 assert.equal(examinationCommand(row).duration,17);
});
test('new Nighthawk pre-screen releases nothing; examination releases once, persists and promotes',()=>{
 let p=checked(readyCC());assert.equal(holds(p,K.gravediggerDose),0);assert.throws(()=>run(p,'ingest_gravedigger'));
 p=checked(run(p,'request_exam_cc'));assert.equal(holds(p,K.gravediggerDose),0);
 p=checked(wait(JSON.parse(JSON.stringify(p)),60));assert.equal(holds(p,K.gravediggerDose),1);
 assert.throws(()=>run(p,'request_exam_cc'));p=checked(run(p,'ingest_gravedigger'));assert.equal(holds(p,K.gravediggerDose),0);
});
test('a stale examiner quote rechecks role, world, life, body and location without consuming anything',()=>{
 const p=studied();assert.equal(preview(p).eligible,true);
 for(const change of [q=>{q.state.actors[I.seniorDeacon].facts['book.lotm.role']='captain';},q=>{q.state.actors[I.seniorDeacon].worldId='base.frontier';},q=>{q.state.simulation.people[I.seniorDeacon].life='dead';},q=>{q.state.simulation.people[I.seniorDeacon].body.mobile=false;},q=>{q.state.simulation.people[I.seniorDeacon].location=L.docks;}]){
  const q=structuredClone(p);change(q);const before=structuredClone(q);assert.equal(preview(q).eligible,false);assert.match(preview(q).reasons.join(' '),/senior deacon/);assert.throws(()=>run(q,'request_exam_sv_role'));assert.deepEqual(q,before);
 }
 assert.equal(hostOver(p).host.view().actions.some(a=>a.id==='book.lotm.request_exam_sv'),false,'legacy admission hidden');
 assert.throws(()=>run(p,'request_exam_sv'),'legacy command cannot start a new exam');
});
test('role lost during admitted exam stops the result, returns reserved attention and allows a real retry',()=>{
 let p=studied(),attention=p.state.actors[I.seniorDeacon].resources['book.lotm.attention'];
 p=checked(run(p,'request_exam_sv_role'));p.state.actors[I.seniorDeacon].facts['book.lotm.role']='captain';p=checked(wait(p,60));
 assert.equal(holds(p,K.archaeologistDose),0);assert.equal(p.state.actors.player.facts['book.lotm.sv.examined'],undefined);assert.equal(p.state.actors[I.seniorDeacon].resources['book.lotm.attention'],attention);
 p.state.actors[I.seniorDeacon].facts['book.lotm.role']='senior_deacon';p=checked(wait(run(p,'request_exam_sv_role'),60));assert.equal(holds(p,K.archaeologistDose),1);
 assert.throws(()=>run(p,'request_exam_sv_role'));p=checked(run(p,'ingest_archaeologist'));assert.ok(p.state.actors.player.sources[I.archaeologist]);
});
test('explicit Stop returns attention through the existing cancellation owner',()=>{
 let p=run(studied(),'request_exam_sv_role');const job=p.state.simulation.jobs[0];const before=p.state.actors[I.seniorDeacon].resources['book.lotm.attention'];
 const out=cancelSimulationJob(p.state,registry,job.id,ctx(p));p={...p,...out};checked(p);assert.equal(p.state.actors[I.seniorDeacon].resources['book.lotm.attention'],before+1);assert.equal(holds(p,K.archaeologistDose),0);
});
test('old C1 save and pre-slice master saves load without backfill; an old admitted exam retains its frozen result',()=>{
 for(const file of [dir+'c1-save.json','docs/gm/dispatch/lotm-lives-regions-2026-10-23/fixtures/primary_pre_q2_seer_promoted.json','docs/gm/dispatch/lotm-lives-regions-2026-10-23/fixtures/primary_pre_q2_cc_promoted.json']){
  const s=JSON.parse(fs.readFileSync(file)),before=structuredClone(s);assert.ok(validateLotmState(s.expansion));assert.ok(validateLotmEnvelope(s));assert.deepEqual(s,before);assert.equal(s.expansion.actors[I.evernightDeacon],undefined);
 }
 const saved=JSON.parse(fs.readFileSync(dir+'c1-savant-exam.json'));
 let old={state:saved.expansion,external:{money:500},gameplay:Object.fromEntries(Object.entries(saved.inventories.person).map(([o,inv])=>[o==='main_character'?'player':o,{inventory:Object.fromEntries(Object.entries(inv).map(([k,v])=>[k,v.count])),skills:{},reputation:{}}]))};checked(old);
 const job=structuredClone(old.state.simulation.jobs[0]);old=JSON.parse(JSON.stringify(old));checked(old);assert.deepEqual(old.state.simulation.jobs[0],job);
 old=checked(wait(old,60));assert.equal(holds(old,K.archaeologistDose),1);
});

test('native clock completion recomputes registered role facts even when expedition facts replace the admission context',()=>{
 let p=run(studied(),'request_exam_sv_role');
 const advance=q=>{const c=ctx(q);c.facts={location:q.state.simulation.people.player.location};const out=advanceSimulation(q.state,registry,60,q.external,q.gameplay,{player:{...c,vitals:c.vitals.player}});return {...q,...out};};
 const lost=structuredClone(p);lost.state.actors[I.seniorDeacon].facts['book.lotm.role']='captain';
 const failed=checked(advance(lost));assert.equal(holds(failed,K.archaeologistDose),0);
 const completed=checked(advance(p));assert.equal(holds(completed,K.archaeologistDose),1);
});
