// Shared fixtures for the LOTM focused tests: a fresh enrolled branch, a context, command runners, and a fake host port set.
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand} from '../src/simulation.js';
import {lotmContext,lotmFacts} from '../src/book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from '../src/book_world_lotm_content.js';
import {createLotmHost} from '../src/book_world_lotm_host.js';
import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';
export {registry,lotmFacts,I};
export const vit={health:24,max_health:24,stamina:18,max_stamina:18};
export const vitals=()=>({player:vit,[I.supervisor]:vit,[I.stormOfficer]:vit,[I.machineryOfficer]:vit,[I.member]:vit,[I.stormDeacon]:vit,[I.seniorDeacon]:vit,[I.broker]:vit});
export function fresh(money=500,profile='probationer'){
 let p={state:initializeExpedition(createExpansionState(41)),external:{money},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 p=enrollSimulation(p.state,registry,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit},facts:{location:'Village'}});
 enrollLotmBranch(p.state,profile);
 for(const [owner,stock] of Object.entries(LOTM_NATIVE_STOCK))p.gameplay[owner]={inventory:structuredClone(stock),skills:{},reputation:{}};
 return p;
}
export const ctx=(p,targetId)=>lotmContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:vitals(),vitalsByActor:vitals(),nativeAlive:true,...(targetId?{targetId}:{}),facts:{location:p.state.simulation.people.player.location}});
export const def=id=>registry.simulation.commands.get(`book.lotm.${id}`);
export function run(p,id){const d=def(id);const out=commitSimulationCommand(p.state,registry,{id:d.id},ctx(p,d.targetId));return {...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay};}
export function wait(p,minutes){const c=ctx(p);const out=advanceSimulation(p.state,registry,minutes,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay};}
export const at=(p,place)=>{p.state.simulation.people.player.location=place;return p;};
export const holds=(p,key,actor='player')=>p.gameplay[actor]?.inventory?.[key]||0;
export const save=p=>({expansion:p.state,'current location':p.state.simulation.people.player.location,inventories:{person:{
 main_character:Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,n])=>[k,{count:n}])),
 ...Object.fromEntries(Object.entries(p.gameplay).filter(([k])=>k.startsWith('book.lotm.')).map(([k,v])=>[k,Object.fromEntries(Object.entries(v.inventory||{}).map(([a,n])=>[a,{count:n}]))]))}}});
// A host over a fake port set, so view(), move() and act() run without main.js.
export function hostOver(p){
 const box={p,sleeping:false};
 const ports={registry,state:()=>box.p.state,context:()=>({external:box.p.external,gameplay:box.p.gameplay,vitals:vitals(),vitalsByActor:vitals(),equipment:{},facts:{location:box.p.state.simulation.people.player.location},nativeAlive:true}),
  persist:plan=>{box.p={...box.p,state:plan.state,external:plan.external??box.p.external,gameplay:plan.gameplay??box.p.gameplay};},
  writable:()=>true,busy:()=>false,sleeping:()=>box.sleeping,restoring:()=>false,location:()=>box.p.state.simulation.people.player.location,startEnabled:()=>true,beginSleep:()=>{box.sleeping=true;},endSleep:()=>{box.sleeping=false;}};
 return {host:createLotmHost(ports),box};
}
// The simulation enrolled but Tingen not begun: what host.enroll() starts from.
export function bare(money=50){
 let p={state:initializeExpedition(createExpansionState(41)),external:{money},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 return enrollSimulation(p.state,registry,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit},facts:{location:'Village'}});
}
