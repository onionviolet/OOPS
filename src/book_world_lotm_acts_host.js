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
import {silverCharmActs} from './lotm_silver_charms.js';
import {bellActs,bellActDescription} from './lotm_soothing_bell.js';
import {tingenSilverWorkshop} from './lotm_amulet_crafting.js';
import {charmUpkeepDescription} from './lotm_charm_upkeep.js';
import {charmMaterialActs,charmMaterialFacts} from './lotm_charm_materials.js';
import {charmLoanActs,charmLoanFacts} from './lotm_charm_loan.js';
import {charmLenderStockActs,withLenderStockParticipants} from './lotm_charm_lender_stock.js';
import {responseChoiceActs,responseLoanFacts,withResponseChoiceParticipants} from './lotm_charm_response.js';
export const LOTM_ACT_ROWS=[...LOTM_RITE_ROWS.rows,...LOTM_CRAFT_ROWS.rows,...LOTM_AID_PREPARATIONS.rows];
const materialActs=charmMaterialActs(tingenSilverWorkshop);
const loanActs=charmLoanActs();
const lenderStockActs=charmLenderStockActs();
const responseActs=responseChoiceActs();
const bindings={...LOTM_ACT_BINDINGS,...bellActs.bindings,...materialActs.bindings,...loanActs.bindings,...lenderStockActs.bindings,...responseActs.bindings};
const runtimeRows=[...LOTM_ACT_ROWS.flatMap(row=>{
 const charm=silverCharmActs(row,tingenSilverWorkshop);
 if(!charm)return [row];
 Object.assign(bindings,charm.bindings);
 return charm.rows;
}),...bellActs.rows,...materialActs.rows,...loanActs.rows,...lenderStockActs.rows,...responseActs.rows];
export const defineActs=(opts={})=>withResponseChoiceParticipants(withLenderStockParticipants(defineLotmActs(runtimeRows,bindings,{worldId:I.world,group:'book_lotm',situationId:I.situation,...opts})));
const factNames=rule=>!rule?[]:rule.fact?[rule.fact]:[...(rule.all||rule.any||[]),...(rule.not?[rule.not]:[])].flatMap(factNames);
let shape=null;
const rowsShape=()=>shape||=(()=>{const {commands}=defineActs(),bound=new Set(commands.map(c=>c.lotmAct.rowId));
 return {commands,means:runtimeRows.filter(r=>bound.has(r.id)&&bindings[r.id].means).map(r=>({id:r.id,flags:[...new Set([...factNames(r.eligibility),...factNames(r.condition)])].filter(f=>f.startsWith('actor.')),
  kit:bindings[r.id].means.kit,phaseKey:`lotm.act.${r.id}.phase`}))};})();
// Default: the lead holds the whole kit (dial: a knowledge grant could stand in); a run under way keeps its means
// because the kit is spent as the steps go. Not enrolled in the Tingen world: nothing is held.
export function lotmActFacts(state,ctx={}){
 const enrolled=state.actors?.player?.worldId===I.world&&!!state.lotm,inv=ctx.gameplay?.player?.inventory||{},actor=state.actors?.player?.facts||{},{commands,means}=rowsShape(),out={},idleNow=lotmActIdleFacts(commands,actor);
 for(const m of means){
  const active=actor[m.phaseKey]!==undefined&&!idleNow[`actor.lotm.act.${m.id}.idle`]; // under way: the kit is spent as steps go
  const ok=enrolled&&(active||m.kit.every(k=>(inv[k.key]||0)>=k.qty));
  for(const f of m.flags)out[f]=ok;
 }
 return Object.assign(out,enrolled?lotmActIdleFacts(commands,actor):{},enrolled?charmMaterialFacts(state):{},enrolled?charmLoanFacts(state,ctx):{},enrolled?responseLoanFacts(state,ctx):{});
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
 const shown=commands.filter(c=>c.location===null||c.location===here||!idle[`actor.${c.lotmAct.idleKey}`]);
 return quoteLotmActs(shown,preview,{...options,actorFacts:actor}).map(offer=>{
  const description=offer.id==='lotm.craft.slumber-charm-upkeep.renew'
   ? charmUpkeepDescription(state,options.stock||{},JSON.stringify({id:'book.lotm.slumber_charm'}),'slumber')
   : bellActDescription(offer.id,state);
  if(offer.id==='lotm.craft.slumber-charm-upkeep.renew'&&!offer.eligible) {
   const why=!(options.stock?.[JSON.stringify({id:'book.lotm.slumber_charm'})]>0)?'You need a finished Slumber charm.'
    :options.facts?.['charm.slumber.needsUpkeep']===false?'Your held charm still has a fresh charge. Use it or keep it for later.'
     :options.facts?.['charm.slumber.mentorAvailable']===false?'Old Neil must be here and awake to tend the charm.':null;
   return {...offer,description,...(why?{reasons:[why]}:{})};
  }
  return description?{...offer,description}:offer;
 });
}
