// L4 host seam for rite, craft and aid rows (R5/U3): compiles the typed rows with their authored bindings into
// commands, supplies the eligibility facts the rows name from what the lead holds, and settles backlash once per
// completed run. AR3: rows own what is needed, the engine (lotm_act_engine) compiles, harm_state owns the counter
// (the host passes its door in); this file only reads state. Proposals (WPR5): kits, minutes and weights.
import {defineLotmActs,settleLotmBacklash,pendingLotmBacklash,lotmActIdleFacts,quoteLotmActs} from './lotm_act_engine.js';
import {LOTM_ACT_BINDINGS} from './lotm_act_bindings.js';
import {LOTM_RITE_ROWS} from './lotm_rite_rows.js';
import {LOTM_CRAFT_ROWS} from './lotm_craft_rows.js';
import {LOTM_AID_PREPARATIONS} from './lotm_potion_rule_rows.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
export const LOTM_ACT_ROWS=[...LOTM_RITE_ROWS.rows,...LOTM_CRAFT_ROWS.rows,...LOTM_AID_PREPARATIONS.rows];
export const defineActs=(opts={})=>defineLotmActs(LOTM_ACT_ROWS,LOTM_ACT_BINDINGS,{worldId:I.world,group:'book_lotm',situationId:I.situation,...opts});
const factNames=rule=>!rule?[]:rule.fact?[rule.fact]:[...(rule.all||rule.any||[]),...(rule.not?[rule.not]:[])].flatMap(factNames);
let shape=null;
const rowsShape=()=>shape||=(()=>{const {commands}=defineActs(),bound=new Set(commands.map(c=>c.lotmAct.rowId));
 return {commands,means:LOTM_ACT_ROWS.filter(r=>bound.has(r.id)&&LOTM_ACT_BINDINGS[r.id].means).map(r=>({id:r.id,flags:[...new Set([...factNames(r.eligibility),...factNames(r.condition)])].filter(f=>f.startsWith('actor.')),
  kit:LOTM_ACT_BINDINGS[r.id].means.kit,phaseKey:`lotm.act.${r.id}.phase`}))};})();
// Default: the lead holds the whole kit (dial: a knowledge grant could stand in); a run under way keeps its means
// because the kit is spent as the steps go. Not enrolled in the Tingen world: nothing is held.
export function lotmActFacts(state,ctx={}){
 const enrolled=state.actors?.player?.worldId===I.world&&!!state.lotm,inv=ctx.gameplay?.player?.inventory||{},actor=state.actors?.player?.facts||{},{commands,means}=rowsShape(),out={},idleNow=lotmActIdleFacts(commands,actor);
 for(const m of means){
  const active=actor[m.phaseKey]!==undefined&&!idleNow[`actor.lotm.act.${m.id}.idle`]; // under way: the kit is spent as steps go
  const ok=enrolled&&(active||m.kit.every(k=>(inv[k.key]||0)>=k.qty));
  for(const f of m.flags)out[f]=ok;
 }
 return Object.assign(out,enrolled?lotmActIdleFacts(commands,actor):{});
}
const actorFactsFor=state=>Object.fromEntries(Object.entries(state.actors?.player?.facts||{}).map(([k,v])=>[`actor.${k}`,v]));
// Charges due backlash into plan.state's marks (once per completion) and returns the accruals to apply after the save lands.
export function collectActBacklash(state,commands){
 const adds=[];settleLotmBacklash(state,commands,I.world,actorFactsFor(state),(carrier,o)=>{adds.push([carrier,o]);return null;});return adds;
}
export const pendingActBacklash=(state,commands)=>commands.length>0&&pendingLotmBacklash(state,commands,I.world);
// Offers: a row shows where its place is, or while a run is under way (a paused rite stays reachable from anywhere to resume
// by walking back; its buttons name the place). UR77 budget: only the rows here or begun.
export function quoteActs(state,commands,preview,options={}){
 const actor=state.actors?.player?.facts||{},here=state.simulation?.people?.player?.location,idle=lotmActIdleFacts(commands,actor);
 const shown=commands.filter(c=>c.location===here||!idle[`actor.${c.lotmAct.idleKey}`]);
 return quoteLotmActs(shown,preview,{...options,actorFacts:actor});
}
