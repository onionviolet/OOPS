// Native host for the early-Tingen Seer slice (LIP3/LIP4). One authority per fact (AR3):
// state.lotm and the simulation own the branch, the supervisor's native inventory owns the
// finite stock, native sleep is joined to book.lotm.sleep (D4). The caller supplies ports;
// this file imports no main.js and publishes only through the one expansion publisher.
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {lotmCommands,lotmContext} from './book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from './book_world_lotm_content.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES} from './book_world_lotm_ids.js';
const copy=x=>structuredClone(x),assert=(ok,text)=>{if(!ok)throw Error(text);};
const SLEEP='book.lotm.sleep',MOVES={'lotm.move.workroom':L.workroom,'lotm.move.lodging':L.lodging};
export const LOTM_MOVE_LABELS={'lotm.move.workroom':'Walk to the supervised workroom','lotm.move.lodging':'Walk to your probationer lodging'};
export function lotmSimulationContexts(state,contexts){
 if(!state.lotm)return contexts;
 return Object.fromEntries(Object.entries(contexts).map(([id,c])=>[id,lotmContext(state,{...c,actorId:id})]));
}
export function createLotmHost(ports){
 const state=()=>ports.state(),registry=ports.registry;
 const sleepJob=s=>s.simulation?.jobs?.find(j=>j.commandId===SLEEP&&j.actorId==='player');
 function ctx(s,def){const c=ports.context(),vitals=c.vitals||{};
  return lotmContext(s,{...c,actorId:'player',vitalsByActor:c.vitalsByActor||vitals,busy:!!ports.busy(),targetId:def?.targetId||null});}
 const base=(s,c)=>({state:copy(s),external:copy(c.external||{}),gameplay:copy(c.gameplay||{}),gameplayBefore:copy(c.gameplay||{}),vitals:copy(c.vitals||{}),equipment:copy(c.equipment||{}),acquisitions:[],unlocks:[]});
 function writable(){assert(ports.writable(),'Saving is paused, so the branch cannot change now.');}
 function startable(){const s=state();return ports.startEnabled()&&!s.lotm&&s.actors.player.worldId==='base.frontier'&&ports.location()==='Village'&&ports.writable()&&!ports.busy();}
 function enroll(){
  assert(startable(),'Begin the Tingen branch only from the Village on a disposable test save, with nothing else under way.');
  const s=state(),c=ports.context();let cur=s,external=c.external,gameplay=c.gameplay,vitals=c.vitals,equipment=c.equipment,enrolled=null;
  if(!s.simulation){enrolled=enrollSimulation(s,registry,{...c,busy:false,facts:{...c.facts,location:'Village'}},s.sequence);cur=enrolled.state;external=enrolled.external;gameplay=enrolled.gameplay;vitals=enrolled.vitals||vitals;equipment=enrolled.equipment||equipment;}
  const plan=base(cur,{external,gameplay,vitals,equipment});
  if(enrolled){plan.acquisitions=[...enrolled.acquisitions];plan.unlocks=[...enrolled.unlocks];}
  plan.state.sequence++;plan.state.schema=11;enrollLotmBranch(plan.state);
  plan.gameplay[I.supervisor]={inventory:copy(LOTM_NATIVE_STOCK[I.supervisor]),skills:{},reputation:{}};
  plan.nativeLocation=L.workroom;plan.nativePatch={'current location':L.workroom};
  ports.persist(plan);return plan;
 }
 function act(id){
  writable();const s=state(),def=registry.simulation.commands.get(id);
  assert(s.lotm&&def?.group==='book_lotm','Choose an action from the Tingen branch.');
  assert(!ports.sleeping(),'Wake first: you are asleep.');
  const plan=commitSimulationCommand(s,registry,{id},ctx(s,def),s.sequence);
  ports.persist(plan);
  if(id===SLEEP)ports.beginSleep();
  return plan;
 }
 function cancel(jobId){
  writable();const s=state(),job=s.simulation?.jobs.find(j=>j.id===jobId&&j.actorId==='player'&&lotmCommands.some(d=>d.id===j.commandId));
  assert(job&&job.cancellation==='forfeit','Only a lesson or sleep can be stopped, and what it cost is not returned.');
  ports.persist(cancelSimulationJob(s,registry,job.id,ctx(s),s.sequence));
  if(job.commandId===SLEEP&&ports.sleeping())ports.endSleep();
 }
 function move(id){
  writable();const s=state(),to=MOVES[id];assert(s.lotm&&to,'No such walk.');
  assert(!s.simulation.jobs.length&&!ports.sleeping()&&!ports.busy(),'Finish or stop your current work first.');
  assert(s.simulation.people.player.location!==to,'You are already there.');
  const plan=base(s,ports.context());plan.state.sequence++;plan.state.simulation.people.player.location=to;plan.nativeLocation=to;plan.nativePatch={'current location':to};
  ports.persist(plan);return plan;
 }
 // Native sleep ended by any cause before the job finished: the job is forfeited, nothing is restored (D4).
 function wake(){const s=state(),job=s.lotm&&sleepJob(s);if(job&&!ports.restoring()&&ports.writable())cancel(job.id);}
 // The job finished (or was cancelled) while native sleep was still on: end native sleep once.
 function tick(){const s=state();if(s.lotm&&ports.sleeping()&&!sleepJob(s))ports.endSleep();}
 function view(){
  const s=state(),d=s.lotm;
  if(!d)return {enrolled:false,startable:startable(),startEnabled:ports.startEnabled()};
  const c=ctx(s),f=c.facts,at=s.simulation.people.player.location,e=s.simulation.energies?.player?.[I.energy],know=s.simulation.knowledge?.player||{};
  const actions=[];
  for(const def of lotmCommands){const p=previewSimulationCommand(s,registry,def.id,{...c,targetId:def.targetId||null});
   if(p.visible)actions.push({id:def.id,label:def.label,eligible:p.eligible&&!ports.sleeping(),reasons:p.eligible&&ports.sleeping()?['You are asleep.']:p.reasons,duration:def.duration||0,cancellation:def.cancellation||'none'});}
  const moves=Object.entries(MOVES).filter(([,to])=>to!==at).map(([id])=>({id,label:LOTM_MOVE_LABELS[id],eligible:!s.simulation.jobs.length&&!ports.sleeping(),reasons:s.simulation.jobs.length||ports.sleeping()?['Finish or stop your current work first.']:[]}));
  const jobs=s.simulation.jobs.filter(j=>lotmCommands.some(d=>d.id===j.commandId)).map(j=>({id:j.id,label:registry.simulation.commands.get(j.commandId).label,due:j.due,left:Math.max(0,j.due-s.clock),cancellable:j.cancellation==='forfeit'}));
  const holds=Object.fromEntries(['dose',...LOTM_SAMPLES].map(n=>[n,f[`lotm.holds.${n}`]||0]));
  const records=Object.entries(know).filter(([k])=>k.startsWith('book.lotm.')).map(([k,r])=>({id:k,text:r.value,stage:r.stage,at:r.at})).sort((a,b)=>(b.at??0)-(a.at??0));
  return {enrolled:true,at,supervisorHere:f['lotm.supervisorHere'],attention:f['lotm.supervisorAttention'],source:f['lotm.sourceSupported'],method:f['lotm.methodSupported'],sleeping:ports.sleeping(),energy:e?{reserve:e.reserve,capacity:e.policy.capacity,strain:e.strain,limit:e.policy.strainLimit}:null,holds,actions,moves,jobs,records};
 }
 return {enroll,act,cancel,move,wake,tick,view,startable};
}
