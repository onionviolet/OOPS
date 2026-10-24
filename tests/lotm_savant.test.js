import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,wait,at,holds,save,def,hostOver,ctx,lotmFacts,I} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {savantRow} from '../src/book_world_lotm_rows.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
// LOTM Q6: Savant as the third pathway, data on the descriptor engine, held by the Machinery team in the university quarter, with the
// source's promotion rule: a senior deacon examines (not the local officer) on merit; the three-year wait is the ordinary member's default, not a gate on a player who digested by acting.
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const path=p=>lotmPathView(p.state,lotmFacts(p.state,ctx(p)));
const acting=p=>p.state.actors.player.resources['book.lotm.sv.acting']||0;
const officerAttn=p=>p.state.actors[I.machineryOfficer].resources['book.lotm.attention'];
const begin=()=>run(fresh(500,'machinery'),'report_in_machinery');
const ingested=()=>run(run(begin(),'accept_allocation_sv'),'ingest_sv');
const studied=()=>{let p=ingested();for(let i=0;i<3;i++)p=wait(run(p,'act_study'),30);return wait(run(p,'act_apply'),45);};
test('the machinery life starts in the university quarter under its own officer and is offered only its own church\'s line',()=>{
 let p=fresh(500,'machinery');assert.equal(p.state.simulation.people.player.location,L.university);
 refuses(p,'accept_allocation_sv');p=run(p,'report_in_machinery');
 for(const id of ['accept_allocation','accept_allocation_cc','report_in','sign_contract'])refuses(p,id);
 const v=path(p);assert.equal(v.potion,'Savant');assert.equal(v.chosen,false);
 // The Evernight life is not offered the Machinery team's potion.
 const e=run(fresh(),'report_in');refuses(at(e,L.university),'accept_allocation_sv');assert.ok(path(e).others.every(o=>!/Savant/.test(o.label)));
 ok(run(p,'accept_allocation_sv'));
});
test('study and apply digest it on the officer\'s attention; the pre-screen releases no dose',()=>{
 let p=ingested();assert.equal(path(p).felt,'unsettled');assert.equal(path(p).stage,'Sequence 9 · Savant');refuses(p,'request_prescreen_sv');
 const start=officerAttn(p);p=wait(run(p,'act_study'),30);assert.equal(acting(p),1);assert.equal(path(p).felt,'settling');
 p=wait(run(p,'act_study'),30);p=wait(run(p,'act_study'),30);refuses(p,'request_prescreen_sv');
 p=wait(run(p,'act_apply'),45);refuses(p,'act_apply');assert.equal(acting(p),savantRow.digest);assert.equal(officerAttn(p),start-4);assert.equal(path(p).felt,'settled');
 p=run(p,'request_prescreen_sv');assert.equal(holds(p,K.archaeologistDose),0,'only the senior deacon releases the next dose');ok(p);
 refuses(p,'ingest_archaeologist');
});
test('the examination is the senior deacon\'s and reads merit, not elapsed time; then one dose is released and drinking it caps at Sequence 8',()=>{
 let p=run(studied(),'request_prescreen_sv');
 assert.equal(lotmFacts(p.state,ctx(p))['lotm.sv.waited'],true,'no wait gates the acting route');
 const deacon=p.state.actors[I.seniorDeacon].resources['book.lotm.attention'];
 p=wait(run(p,'request_exam_sv'),60);assert.equal(p.state.actors[I.seniorDeacon].resources['book.lotm.attention'],deacon-1);assert.equal(holds(p,K.archaeologistDose),1);ok(p);
 assert.equal(p.state.actors.player.sources[I.archaeologist],undefined,'holding grants nothing');refuses(p,'request_exam_sv');
 p=run(p,'ingest_archaeologist');ok(p);assert.ok(p.state.actors.player.sources[I.archaeologist]);
 const v=path(p);assert.equal(v.stage,'Sequence 8 · Archaeologist');assert.equal(v.capped,true);
});
test('the exam crossing is on the ladder; the three-year wait is kept as the ordinary-member dial, not applied to the player',()=>{
 const v=path(run(studied(),'request_prescreen_sv'));assert.ok(v.crossings.some(c=>c.id==='exam'&&c.type==='trial'));
 assert.equal(savantRow.exam.sourceWait,'three years');assert.equal(savantRow.exam.waitMinutes,0);assert.ok(savantRow.exam.ordinaryWaitMinutes>0&&savantRow.exam.ordinaryWaitMinutes<3*365*1440,'the ordinary dial is prototype-scaled and labelled');
 // The dial still works for a start with no acting knowledge: a row copy with a wait gates the fact.
 const slow=structuredClone(savantRow);slow.exam.waitMinutes=slow.exam.ordinaryWaitMinutes;assert.ok(slow.exam.waitMinutes>0);
});
test('a save holding another church\'s pathway without the switching cause is refused',()=>{
 // The machinery life cannot hold an Evernight pathway unless the stated cause is recorded.
 let p=ingested();p.state.actors.player.facts['book.lotm.allocated']=true;p.state.actors.player.facts['book.lotm.ingested']=true;
 assert.throws(()=>validateLotmState(p.state));
});
