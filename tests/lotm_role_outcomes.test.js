import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,wait,ctx,registry,I,save,at} from './lotm_helpers.js';
import {previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {LOTM_LOCATIONS as L} from '../src/book_world_lotm_ids.js';
const sv=()=>run(run(run(fresh(500,'machinery'),'report_in_machinery'),'accept_allocation_sv'),'ingest_sv');
const sa=()=>run(run(run(fresh(500,'storm'),'report_in_storm'),'accept_allocation_sa'),'ingest_sa');
const prev=(p,k)=>previewSimulationCommand(p.state,registry,`book.lotm.reflect_work_${k}`,ctx(p));
const acting=(p,k)=>p.state.actors.player.resources[`book.lotm.${k}.acting`]||0;
const checked=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));};
test('a finished Savant office outcome counts once, and a later outcome supplies its own experience',()=>{
 let p=sv();assert.equal(prev(p,'sv').eligible,false);p=run(p,'errand_machinery');p=wait(p,19);
 assert.equal(acting(p,'sv'),0);assert.equal(prev(p,'sv').eligible,false);p=wait(p,1);
 assert.equal(acting(p,'sv'),0,'employment alone does not auto-award acting');assert.equal(prev(p,'sv').eligible,true);
 p=run(p,'reflect_work_sv');assert.equal(acting(p,'sv'),1);assert.equal(prev(p,'sv').eligible,false);checked(p);
 p=wait(run(p,'errand_machinery'),20);assert.equal(prev(p,'sv').eligible,true);p=run(p,'reflect_work_sv');assert.equal(acting(p,'sv'),2);checked(p);
});
test('canceled and unrelated work, or work before the source was acquired, cannot be backfilled',()=>{
 let p=sv();p=run(p,'errand_machinery');p=wait(p,10);p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,ctx(p))};
 assert.equal(prev(p,'sv').eligible,false);assert.equal(acting(p,'sv'),0);
 p=wait(run(p,'act_study'),30);assert.equal(prev(p,'sv').eligible,false,'explicit study does not invent a completed office outcome');
 let old=run(fresh(500,'machinery'),'report_in_machinery');old=wait(run(old,'errand_machinery'),20);old=run(run(old,'accept_allocation_sv'),'ingest_sv');
 assert.equal(prev(old,'sv').eligible,false,'no retroactive pre-initiation credit');checked(old);
});
test('the same outcome seam credits Sailor underwater work, but refuses another or suppressed faculty',()=>{
 let p=sa();p=wait(run(run(p,'ab.deep_breath'),'recover_dock_manifest'),5);assert.equal(prev(p,'sa').eligible,true);assert.equal(prev(p,'sv').eligible,false);
 p.state.simulation.faculties.player[I.sailor].suppressed=true;assert.equal(prev(p,'sa').eligible,false);p.state.simulation.faculties.player[I.sailor].suppressed=false;
 p=run(p,'reflect_work_sa');assert.equal(acting(p,'sa'),1);assert.equal(prev(p,'sa').eligible,false);checked(p);
});
test('ordinary outcomes stop crediting at digestion, and the existing examiner reads the same progress',()=>{
 let p=sv();for(let i=0;i<4;i++){p=wait(run(p,'errand_machinery'),20);p=run(p,'reflect_work_sv');}
 assert.equal(acting(p,'sv'),4);p=wait(run(p,'errand_machinery'),20);assert.equal(prev(p,'sv').eligible,false);
 const assessment=previewSimulationCommand(p.state,registry,'book.lotm.request_prescreen_sv',ctx(p,I.machineryOfficer));assert.equal(assessment.eligible,true);
 const restored=JSON.parse(JSON.stringify(p));checked(restored);assert.equal(prev(restored,'sv').eligible,false);assert.equal(acting(restored,'sv'),4);
});
