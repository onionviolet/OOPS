import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {lotmContext} from '../src/book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from '../src/book_world_lotm_content.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES} from '../src/book_world_lotm_ids.js';
// LOTM digestion and Sequence 8 promotion (LTS11-LTS14, ASC19), engine level.
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

import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {lotmFacts} from '../src/book_world_lotm_actions.js';
const acting=p=>p.state.actors.player.resources['book.lotm.acting']||0;
const path=p=>lotmPathView(p.state,lotmFacts(p.state,ctx(p)));
function sleep(p){p.state.simulation.people.player.location=L.lodging;p=run(p,'sleep');p=wait(p,120);p.state.simulation.people.player.location=L.workroom;return p;}
const read=p=>wait(run(p,'act_reading'),10);
// Two readings, sleep, three readings and one refusal: six completed acts in role.
function digested(){let p=taught();p=read(read(p));p=sleep(p);p=read(read(read(p)));return run(p,'act_refusal');}
const save=p=>({expansion:p.state,'current location':p.state.simulation.people.player.location,inventories:{person:{
 main_character:Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,n])=>[k,{count:n}])),
 [I.supervisor]:Object.fromEntries(Object.entries(p.gameplay[I.supervisor].inventory).map(([k,n])=>[k,{count:n}]))}}});

test('acting needs the taught method, spends spirituality and counts only a completed act',()=>{
 let p=ingested();refuses(p,'act_reading');
 p=taught();p=run(p,'act_reading');
 assert.equal(acting(p),0,'an act in progress has not counted yet');
 const job=p.state.simulation.jobs.find(j=>j.commandId===def('act_reading').id);
 const stopped=cancelSimulationJob(p.state,registry,job.id,ctx(p));
 assert.equal(stopped.state.actors.player.resources['book.lotm.acting']||0,0,'a stopped reading counts nothing');
 assert.equal(stopped.state.simulation.energies.player[I.energy].reserve,1,'and its cost is not returned');
 p=wait(p,10);assert.equal(acting(p),1);assert.equal(energy(p).reserve,1);
 assert.equal(path(p).felt,'settling');
});
test('six acts digest the Seer potion; acting then stops and the assessment releases one Clown dose',()=>{
 let p=taught();assert.equal(path(p).felt,'unsettled');refuses(p,'request_assessment');
 p=digested();assert.equal(acting(p),6);assert.equal(path(p).felt,'settled');
 refuses(p,'act_reading');refuses(p,'act_refusal');refuses(p,'ingest_clown');
 const before=p.state.actors[I.supervisor].resources['book.lotm.attention'];
 p=run(p,'request_assessment');p=wait(run(p,'request_exam_seer'),60);
 assert.equal(holds(p,K.clownDose),1);assert.equal(p.state.actors[I.supervisor].resources['book.lotm.attention'],before-1);
 assert.equal(p.state.actors.player.sources[I.clown],undefined,'holding the dose grants nothing');
 refuses(p,'request_assessment');
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));
});
test('drinking the Clown dose is atomic and irreversible; the ladder moves to Sequence 8 and caps there',()=>{
 let p=wait(run(run(digested(),'request_assessment'),'request_exam_seer'),60);
 const v=path(p);assert.equal(v.stage,'Sequence 9 · Seer');assert.equal(v.ready,true);
 assert.deepEqual(v.crossings.map(c=>c.met),[true,true,true,true]);
 p=run(p,'ingest_clown');
 assert.equal(holds(p,K.clownDose),0);assert.ok(p.state.actors.player.sources[I.clown]);assert.ok(p.state.actors.player.sources[I.source],'the Seer source stays');
 refuses(p,'ingest_clown');
 const after=path(p);assert.equal(after.stage,'Sequence 8 · Clown');assert.equal(after.capped,true);assert.equal(after.ready,false);assert.equal(after.next,'???','later Sequences stay unnamed in the slice');
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));
});
test('the owners refuse forged digestion, promotion or a missing or duplicated Clown dose',()=>{
 let p=wait(run(run(digested(),'request_assessment'),'request_exam_seer'),60);
 const bad=(mutate,pattern,check=validateLotmState,target=()=>structuredClone(p.state))=>{const x=target();mutate(x);assert.throws(()=>check(x),pattern);};
 bad(x=>{x.actors.player.resources['book.lotm.acting']=7;},/digestion count/);
 bad(x=>{x.actors.player.resources['book.lotm.acting']=5;},/assessment needs a digested/);
 bad(x=>{x.actors.player.facts['book.lotm.promoted']=true;},/Clown source exists exactly/);
 const env=save(p);
 bad(x=>{x.inventories.person.main_character={};},/held exactly once/,validateLotmEnvelope,()=>structuredClone(env));
 bad(x=>{x.inventories.person[I.supervisor][K.clownDose]={count:1};},/held exactly once/,validateLotmEnvelope,()=>structuredClone(env));
 // A save from before this change, mid-slice with no acting record, still validates.
 const old=taught();assert.equal(old.state.actors.player.resources['book.lotm.acting'],undefined);assert.ok(validateLotmState(old.state));assert.ok(validateLotmEnvelope(save(old)));
});
