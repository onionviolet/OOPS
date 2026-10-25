import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,wait,at,holds,save,ctx,lotmFacts,registry,I,vit,vitals} from './lotm_helpers.js';
import {previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
import {characterBioView} from '../src/character_bio.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {sailorRow,savantRow,pathwayRows} from '../src/book_world_lotm_rows.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {lotmReveal,LOTM_HOSTILES,hostileAbilityCommands} from '../src/book_world_lotm_abilities.js';
// Further pathway as data: Sailor under the Mandated Punishers, with the exam rules read from its own row (a shorter wait than the Machinery team's),
// its abilities as descriptors, a concealed look, and the stated causes inherited through the market.
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const path=p=>lotmPathView(p.state,lotmFacts(p.state,ctx(p)));
const begin=()=>run(fresh(500,'storm'),'report_in_storm');
const ingested=()=>run(run(begin(),'accept_allocation_sa'),'ingest_sa');
test('the storm life starts at the docks under the duty officer and is offered Sailor only',()=>{
 let p=fresh(500,'storm');assert.equal(p.state.simulation.people.player.location,L.docks);
 p=run(p,'report_in_storm');for(const id of ['accept_allocation','accept_allocation_cc','accept_allocation_sv','report_in'])refuses(p,id);
 assert.equal(path(p).potion,'Sailor');ok(run(p,'accept_allocation_sa'));
});
test('Sailor plays to Sequence 8 · Folk of Rage: four acts, a pre-screen, the Storm senior deacon on merit',()=>{
 let p=ingested();assert.equal(path(p).stage,'Sequence 9 · Sailor');
 for(let i=0;i<3;i++)p=wait(run(p,'act_mooring'),20);p=wait(run(p,'act_dive'),30);assert.equal(path(p).felt,'settled');
 p=run(p,'request_prescreen_sa');assert.equal(holds(p,K.folkDose),0);ok(p);
 assert.equal(sailorRow.exam.waitMinutes,0,'no wait on the acting route');assert.ok(sailorRow.exam.ordinaryWaitMinutes<savantRow.exam.ordinaryWaitMinutes,'each church sets its own ordinary-member dial');
 p=wait(run(p,'request_exam_sa_role'),60);assert.equal(holds(p,K.folkDose),1);ok(p);
 p=run(p,'ingest_folk');ok(p);const v=path(p);assert.equal(v.stage,'Sequence 8 · Folk of Rage');assert.equal(v.capped,true);
});
test('the pathway\'s abilities are descriptor commands; its scales are a concealed look a Beyonder observer sees',()=>{
 let p=ingested();const prev=id=>previewSimulationCommand(p.state,registry,id,ctx(p));
 assert.equal(prev('book.lotm.ab.storm_balance').eligible,true);assert.equal(prev('book.lotm.ab.fury_burst').eligible,false);
 const view=args=>characterBioView({state:p.state,registry,context:{...ctx(p),worldId:I.world,actorId:'player'},...args});
 assert.equal(view({}).description.find(r=>r.id==='look.marks'),undefined);
 assert.match(view({reveal:lotmReveal(I.stormOfficer,registry,p.state)}).description.find(r=>r.id==='look.marks').detail,/pale scales/);
 assert.deepEqual(lotmReveal('civilian',registry,p.state),[]);
});
test('every pathway row has a hostile holder for the same ability records',()=>{
 for(const r of pathwayRows)assert.ok(LOTM_HOSTILES.some(h=>h.key===r.key),r.key);
 assert.ok(hostileAbilityCommands.some(c=>c.id==='book.lotm.ab.storm_balance.sa'));
});
test('a pathway added as data inherits the stated causes through the market: Savant and Sailor doses are purchasable and costly',()=>{
 for(const [row,buy] of [['sv','begin_sv'],['sa','begin_sa']]){
  let p=row==='sv'?run(fresh(40000,'machinery'),'report_in_machinery'):begin();p.external.money=40000;
  p=run(p,row==='sv'?'accept_allocation_sv':'accept_allocation_sa');p=run(p,row==='sv'?'ingest_sv':'ingest_sa');
  p=at(p,row==='sv'?L.docks:L.docks);for(const t of ['pay','verify','settle'])p=run(p,`lot_${t}_dose8_${row}`);
  p=run(p,`drink_market_${row}8`);assert.equal(p.state.actors.player.resources['book.lotm.pressure'],5,row);ok(p);
 }
});
