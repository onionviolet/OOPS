import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {lotmContext,lotmFacts} from '../src/book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from '../src/book_world_lotm_content.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {LOTM_IDS as I,LOTM_KEYS as K,LOTM_CC_ACTS} from '../src/book_world_lotm_ids.js';
// LOTM Q1: the Corpse Collector pathway as a second descriptor on the shared engine, one pathway per life,
// and Seer saves from before this change loading unchanged. Engine level; the browser route is in the Q1 checkpoint.
const vit={health:24,max_health:24,stamina:18,max_stamina:18};
function fresh(){
 let p={state:initializeExpedition(createExpansionState(41)),external:{money:50},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 p=enrollSimulation(p.state,registry,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit},facts:{location:'Village'}});
 enrollLotmBranch(p.state);
 p.gameplay[I.supervisor]={inventory:structuredClone(LOTM_NATIVE_STOCK[I.supervisor]),skills:{},reputation:{}};
 return p;
}
const ctx=(p,targetId)=>lotmContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit,[I.supervisor]:vit},vitalsByActor:{player:vit,[I.supervisor]:vit},nativeAlive:true,
 ...(targetId?{targetId}:{}),facts:{location:p.state.simulation.people.player.location}});
const def=id=>registry.simulation.commands.get(`book.lotm.${id}`);
function run(p,id){const d=def(id);const out=commitSimulationCommand(p.state,registry,{id:d.id},ctx(p,d.targetId));
 return {...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay};}
function wait(p,minutes){const c=ctx(p);const out=advanceSimulation(p.state,registry,minutes,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});
 return {...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay};}
const holds=(p,key,actor='player')=>p.gameplay[actor]?.inventory?.[key]||0;
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const acting=p=>p.state.actors.player.resources['book.lotm.cc.acting']||0;
const attention=p=>p.state.actors[I.supervisor].resources['book.lotm.attention'];
const path=p=>lotmPathView(p.state,lotmFacts(p.state,ctx(p)));
const save=p=>({expansion:p.state,'current location':p.state.simulation.people.player.location,inventories:{person:{
 main_character:Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,n])=>[k,{count:n}])),
 [I.supervisor]:Object.fromEntries(Object.entries(p.gameplay[I.supervisor].inventory).map(([k,n])=>[k,{count:n}]))}}});
const ingested=()=>{let p=fresh();p=run(p,'report_in');p=run(p,'accept_allocation_cc');return run(p,'ingest_cc');};
const laid=p=>wait(run(p,'act_laying_out'),25);
function digested(){let p=ingested();p=laid(laid(laid(p)));p=wait(run(p,'act_vigil'),60);return p;}

test('the dose is issued on acceptance, holds nothing, and drinking it is the irreversible crossing',()=>{
 let p=fresh();refuses(p,'accept_allocation_cc');
 p=run(p,'report_in');assert.equal(holds(p,K.corpseDose),0,'nothing is issued before acceptance');
 refuses(p,'ingest_cc');
 p=run(p,'accept_allocation_cc');assert.equal(holds(p,K.corpseDose),1);
 assert.equal(p.state.actors.player.sources[I.corpse],undefined,'holding grants nothing');
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));
 refuses(p,'act_laying_out');
 p=run(p,'ingest_cc');assert.equal(holds(p,K.corpseDose),0);assert.ok(p.state.actors.player.sources[I.corpse]);
 assert.equal(p.state.simulation.energies?.player?.[I.energy],undefined,'this pathway grants no spirituality pool');
 refuses(p,'ingest_cc');refuses(p,'decline');
 assert.equal(path(p).stage,'Sequence 9 · Corpse Collector');
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));
});
test('four acts digest it on Hale\'s finite attention; assessment releases one Gravedigger dose; promotion caps at Sequence 8',()=>{
 let p=ingested();assert.equal(path(p).felt,'unsettled');refuses(p,'request_assessment_cc');
 const start=attention(p);
 p=run(p,'act_laying_out');assert.equal(acting(p),0,'an act in progress has not counted');
 const job=p.state.simulation.jobs.find(j=>j.commandId===def('act_laying_out').id);
 const stopped=cancelSimulationJob(p.state,registry,job.id,ctx(p,I.supervisor));
 assert.equal(stopped.state.actors.player.resources['book.lotm.cc.acting']||0,0,'a stopped act counts nothing');
 assert.equal(stopped.state.actors[I.supervisor].resources['book.lotm.attention'],start-1,'and its attention is not returned');
 p=wait(p,25);assert.equal(acting(p),1);assert.equal(path(p).felt,'settling');
 p=laid(laid(p));assert.equal(acting(p),3);refuses(p,'request_assessment_cc');
 p=wait(run(p,'act_vigil'),60);refuses(p,'act_vigil');
 assert.equal(acting(p),LOTM_CC_ACTS);assert.equal(path(p).felt,'settled');assert.equal(attention(p),start-4);
 refuses(p,'act_laying_out');refuses(p,'ingest_gravedigger');
 p=run(p,'request_assessment_cc');assert.equal(holds(p,K.gravediggerDose),1);assert.equal(attention(p),start-5);
 assert.equal(p.state.actors.player.sources[I.gravedigger],undefined,'holding grants nothing');
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));
 p=run(p,'ingest_gravedigger');
 assert.ok(p.state.actors.player.sources[I.gravedigger]);assert.ok(p.state.actors.player.sources[I.corpse]);refuses(p,'ingest_gravedigger');
 const v=path(p);assert.equal(v.stage,'Sequence 8 · Gravedigger');assert.equal(v.capped,true);assert.equal(v.next,'???');
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));
});
test('one pathway per life: either dose blocks the other, in both directions, and the owner refuses a save holding both',()=>{
 let p=fresh();p=run(p,'report_in');
 const cc=run(p,'accept_allocation_cc');refuses(cc,'accept_allocation');refuses(cc,'ingest');
 assert.equal(holds(cc,K.dose,I.supervisor),1,'Hale keeps the Seer dose back');assert.equal(holds(cc,K.dose),0);
 const seer=run(p,'accept_allocation');refuses(seer,'accept_allocation_cc');refuses(seer,'ingest_cc');
 refuses(run(seer,'ingest'),'accept_allocation_cc');
 for(const x of [cc,seer])assert.ok(validateLotmState(x.state)&&validateLotmEnvelope(save(x)));
 // Forged: a Seer save that also claims the Corpse Collector allocation, or its source.
 const forged=structuredClone(run(run(p,'accept_allocation'),'ingest').state);
 forged.actors.player.facts['book.lotm.cc.allocated']=true;
 assert.throws(()=>validateLotmState(forged),/switching, a stated cause of loss of control/);
 const forged2=structuredClone(ingested().state);forged2.actors.player.facts['book.lotm.allocated']=true;
 assert.throws(()=>validateLotmState(forged2),/One pathway per life/);
 // Forged digestion or promotion on the Corpse Collector line.
 const bad=(mutate,pattern)=>{const x=structuredClone(digested().state);mutate(x);assert.throws(()=>validateLotmState(x),pattern);};
 bad(x=>{x.actors.player.resources['book.lotm.cc.acting']=3;x.actors.player.facts['book.lotm.cc.assessed']=true;},/assessment needs a digested/);
 bad(x=>{x.actors.player.resources['book.lotm.cc.acting']=9;},/digestion count/);
 bad(x=>{x.actors.player.facts['book.lotm.cc.assessed']=true;x.actors.player.facts['book.lotm.cc.promoted']=true;},/Gravedigger source exists exactly/);
 bad(x=>{delete x.actors.player.facts['book.lotm.cc.ingested'];},/needs its recorded ingestion|needs its allocation/);
 const env=save(run(digested(),'request_assessment_cc'));
 const e1=structuredClone(env);e1.inventories.person.main_character={};assert.throws(()=>validateLotmEnvelope(e1),/Gravedigger dose must be held exactly once/);
 const e2=structuredClone(save(fresh()));assert.ok(validateLotmEnvelope(e2));
 const pre=run(run(fresh(),'report_in'),'accept_allocation_cc');const e3=save(pre);e3.inventories.person.main_character={};assert.throws(()=>validateLotmEnvelope(e3),/Corpse Collector dose must be held exactly once/);
});
test('both pathways are offered before a choice; afterwards only the chosen ladder shows, with the switching law in words',()=>{
 let p=run(fresh(),'report_in');let v=path(p);
 assert.equal(v.chosen,false);assert.equal(v.others.length,1);assert.match(v.others[0].label,/Corpse Collector/);
 v=path(run(p,'accept_allocation_cc'));assert.equal(v.chosen,true);assert.equal(v.others.length,0);assert.equal(v.potion,'Corpse Collector');
 v=path(run(p,'accept_allocation'));assert.equal(v.chosen,true);assert.equal(v.potion,'Seer');
});
test('Seer saves written before this change load unchanged and read as Seer',()=>{
 const dir=new URL('../docs/gm/dispatch/lotm-q1-2026-10-23/fixtures/',import.meta.url);
 for(const name of ['seer_taught','seer_promoted']){
  const s=JSON.parse(fs.readFileSync(new URL(`${name}.json`,dir),'utf8'));
  assert.ok(validateLotmState(s.expansion),name);assert.ok(validateLotmEnvelope(s),name);
  assert.equal(s.inventories.person[I.supervisor][K.corpseDose],undefined,'the old save holds no Corpse Collector dose');
  const p={state:s.expansion,external:{money:50},gameplay:{player:{inventory:{}},[I.supervisor]:{inventory:{}}}};
  const v=path(p);assert.equal(v.potion,'Seer');assert.equal(v.stage,name==='seer_taught'?'Sequence 9 · Seer':'Sequence 8 · Clown');
 }
});
