import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {lotmContext} from '../src/book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from '../src/book_world_lotm_content.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES} from '../src/book_world_lotm_ids.js';
// LOTM Seer slice (plan LP1-LP5, engine level): decline spends nothing, one ingestion
// consumes one dose and grants a source but no method, the lesson cost is not refunded
// by cancel, two samples share one method, and sleep restores the reserve once.
// Engine-level only: no native binding, save or UI is exercised here.
const vit={health:24,max_health:24,stamina:18,max_stamina:18};
function fresh(){
 let p={state:initializeExpedition(createExpansionState(41)),external:{money:50},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 const base={actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit},facts:{location:'Village'}};
 p=enrollSimulation(p.state,registry,base);
 enrollLotmBranch(p.state);
 p.gameplay[I.supervisor]={inventory:structuredClone(LOTM_NATIVE_STOCK[I.supervisor]),skills:{},reputation:{}};
 return p;
}
const ctx=(p,targetId)=>lotmContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit,[I.supervisor]:vit},vitalsByActor:{player:vit,[I.supervisor]:vit},nativeAlive:true,
 ...(targetId?{targetId}:{}),facts:{location:p.state.simulation.people.player.location}});
const def=id=>registry.simulation.commands.get(`book.lotm.${id}`);
function run(p,id){const d=def(id);const out=commitSimulationCommand(p.state,registry,{id:d.id},ctx(p,d.targetId));
 return {...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay,commit:out};}
function wait(p,minutes){const c=ctx(p);const out=advanceSimulation(p.state,registry,minutes,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});
 return {...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay};}
const holds=(p,key,actor='player')=>p.gameplay[actor]?.inventory?.[key]||0;
const energy=p=>p.state.simulation.energies?.player?.[I.energy];
const refuses=(p,id)=>assert.throws(()=>run(p,id));
function ingested(){let p=fresh();p=run(p,'report_in');p=run(p,'accept_allocation');return run(p,'ingest');}
function taught(){let p=ingested();p=run(p,'lesson');return wait(p,5);}

test('before reporting in, nothing is offered; decline leaves everything unspent',()=>{
 let p=fresh();refuses(p,'accept_allocation');
 p=run(p,'report_in');p=run(p,'decline');
 assert.equal(holds(p,K.dose,I.supervisor),1);assert.equal(holds(p,K.dose),0);
 assert.equal(p.state.actors.player.sources[I.source],undefined,'declining grants no source');
});
test('a held dose grants nothing; ingestion consumes it once and grants a source but not the method',()=>{
 let p=fresh();p=run(p,'report_in');p=run(p,'accept_allocation');
 assert.equal(holds(p,K.dose),1);assert.equal(p.state.actors.player.sources[I.source],undefined,'allocation transfers no faculty');
 refuses(p,'lesson');
 p=run(p,'ingest');
 assert.equal(holds(p,K.dose),0);assert.ok(p.state.actors.player.sources[I.source]);
 assert.equal(p.state.simulation.powers.player?.[I.method]?.owned??false,false,'source is not method');
 assert.equal(energy(p).reserve,3);
 refuses(p,'ingest');
});
test('lesson cancel forfeits the spent unit and keeps the source; completion teaches the method once',()=>{
 let p=ingested();p=run(p,'lesson');
 assert.equal(energy(p).reserve,2,'cost commits at segment start');
 const job=p.state.simulation.jobs.find(j=>j.commandId===def('lesson').id);
 const out=cancelSimulationJob(p.state,registry,job.id,ctx(p,I.supervisor));
 assert.equal(out.state.simulation.energies.player[I.energy].reserve,2,'cancel does not refund');
 assert.ok(out.state.actors.player.sources[I.source],'ingestion survives a canceled lesson');
 assert.equal(out.state.simulation.powers.player?.[I.method]?.owned??false,false);
 p=wait(p,5);
 assert.equal(p.state.simulation.powers.player[I.method].owned,true);
});
test('the same method observes two supported samples; findings are limited and samples return',()=>{
 let p=taught();
 for(const name of ['sampleA','sampleB']){
  p=run(p,`take_${name}`);p=run(p,`observe_${name}`);p=wait(p,1);
  assert.ok(p.state.simulation.knowledge.player[`book.lotm.finding.${name}`],`${name} finding recorded`);
  assert.equal(holds(p,K[name]),1,'observed sample comes back to the holder');
  p=run(p,`return_${name}`);assert.equal(holds(p,K[name],I.supervisor),1);
 }
 assert.equal(energy(p).strain,3,'the lesson and two observations each add one strain');
});
test('an empty reserve refuses without spending; sleep unlocks the refused use, once',()=>{
 let p=taught();
 for(const name of ['sampleA','sampleB']){p=run(p,`take_${name}`);p=run(p,`observe_${name}`);p=wait(p,1);}
 assert.equal(energy(p).reserve,0);
 p=run(p,'take_comparator');
 const frozen=JSON.stringify([energy(p),holds(p,K.comparator)]);
 refuses(p,'observe_comparator');
 assert.equal(JSON.stringify([energy(p),holds(p,K.comparator)]),frozen,'a refused look spends and moves nothing');
 refuses(p,'sleep');// workroom is not a rest place
 p.state.simulation.people.player.location=L.lodging;
 p=run(p,'sleep');p=wait(p,60);assert.equal(energy(p).reserve,0,'half a sleep restores nothing');
 p=wait(p,60);assert.equal(energy(p).reserve,3);assert.equal(energy(p).strain,0);
 p=wait(p,300);assert.equal(p.state.actors.player.completed['book.lotm.sleep'],1,'extra waiting cannot award it again');assert.equal(energy(p).reserve,3);
 p.state.simulation.people.player.location=L.workroom;
 p=run(p,'observe_comparator');p=wait(p,1);
 assert.match(p.state.simulation.knowledge.player['book.lotm.finding.comparator'].value,/not proof/);
 assert.equal(energy(p).reserve,2);
});
test('cancelling a lesson forfeits its unit; an observation cannot be cancelled and never loses its sample',()=>{
 let p=taught();p=run(p,'take_sampleA');p=run(p,'observe_sampleA');
 const job=p.state.simulation.jobs.find(j=>j.commandId===def('observe_sampleA').id);
 assert.throws(()=>cancelSimulationJob(p.state,registry,job.id,ctx(p)),'an observation has no cancel route');
 p=wait(p,1);assert.equal(holds(p,K.sampleA),1);assert.equal(energy(p).reserve,1);
});
test('observation needs the learned method and a held sample, and cannot be repeated on a returned sample',()=>{
 let p=ingested();p=run(p,'take_sampleA');refuses(p,'observe_sampleA');
 p=run(p,'lesson');p=wait(p,5);
 p=run(p,'observe_sampleA');p=wait(p,1);p=run(p,'return_sampleA');
 refuses(p,'observe_sampleA');refuses(p,'return_sampleA');
});
test('the optional owner admits every honest phase and rejects presence, means or tampering without it',()=>{
 let p=fresh();assert.ok(validateLotmState(p.state));
 p=run(p,'report_in');assert.ok(validateLotmState(p.state));
 p=run(p,'accept_allocation');p=run(p,'ingest');assert.ok(validateLotmState(p.state),'after ingestion');
 p=run(p,'lesson');assert.ok(validateLotmState(p.state),'with a held lesson');
 p=wait(p,5);assert.ok(validateLotmState(p.state),'after the lesson');
 const bad=(mutate,pattern)=>{const copy=structuredClone(p.state);mutate(copy);assert.throws(()=>validateLotmState(copy),pattern);};
 bad(x=>{delete x.lotm;},/optional owner|require the matching/);
 bad(x=>{x.lotm.sourceHash='0'.repeat(64);},/Unsupported Tingen source/);
 bad(x=>{x.lotm.extra=1;},/Unsupported Tingen branch fields/);
 bad(x=>{delete x.simulation.powers.player[I.method];delete x.simulation.energies.player[I.energy];},/lesson needs its method|completed lesson|pool exists/);
 bad(x=>{x.actors.player.facts['book.lotm.ingested']=false;},/source needs its recorded ingestion/);
 bad(x=>{x.actors[I.supervisor].worldId='base.frontier';},/supervisor needs their own/);
 // An inert save with a half-built Tingen trace must be refused.
 const inert=initializeExpedition(createExpansionState(5));
 inert.actors.player.facts['book.lotm.ingested']=true;assert.throws(()=>validateLotmState(inert),/optional owner|require the matching/);
 assert.ok(validateLotmState(initializeExpedition(createExpansionState(5))),'a game that never enrolled is inert');
});
// Native envelope: one holder per sample, a sample under observation is held by its job.
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
test('the native envelope keeps one holder per sample, counts a reserved sample and refuses the wrong place',()=>{
 const inv=(p,sup)=>({main_character:p,[I.supervisor]:sup});
 const save=p=>({expansion:p.state,'current location':p.state.simulation.people.player.location,
  inventories:{person:inv(Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,n])=>[k,{count:n}])),Object.fromEntries(Object.entries(p.gameplay[I.supervisor].inventory).map(([k,n])=>[k,{count:n}])))}});
 let p=taught();assert.ok(validateLotmEnvelope(save(p)),'after the lesson');
 p=run(p,'take_sampleA');p=run(p,'observe_sampleA');assert.ok(validateLotmEnvelope(save(p)),'sample reserved by its observation job');
 const lost=save(p);lost.expansion=structuredClone(lost.expansion);lost.expansion.simulation.jobs=[];assert.throws(()=>validateLotmEnvelope(lost),/exactly one holder/);
 const away=save(p);away['current location']='Village';assert.throws(()=>validateLotmEnvelope(away),/disagree/);
 const inert=initializeExpedition(createExpansionState(5));assert.ok(validateLotmEnvelope({expansion:inert,'current location':'Village',inventories:{}}));
 assert.throws(()=>validateLotmEnvelope({expansion:inert,'current location':L.workroom,inventories:{}}),/optional Tingen/);
});
