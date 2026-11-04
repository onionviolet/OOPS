// L4 host seam for sealed-records reading (R6, ch65 P052). Rows and binding live in lotm_records_rows; lotm_records compiles them.
// This file only binds the world ids, and quotes at the armory (UR77 budget: the rows are offered where the stack is read, or while a read is under way).
import {defineLotmRecords,quoteLotmRecords} from './lotm_records.js';
import {LOTM_RECORD_ROWS,LOTM_RECORD_BINDINGS} from './lotm_records_rows.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
// resolvePerson maps the binding's index id to the pack's person id; hasPlace says whether the pack holds the place.
// A binding the pack cannot supply (a smaller or different pack) is skipped, never half-registered.
export const defineRecords=({resolvePerson=x=>x,hasPlace=()=>true,...opts}={})=>defineLotmRecords(LOTM_RECORD_ROWS,
 Object.fromEntries(Object.entries(LOTM_RECORD_BINDINGS).map(([k,b])=>[k,{...b,custodian:resolvePerson(b.custodian)}]).filter(([,b])=>b.custodian&&hasPlace(b.place))),
 {worldId:I.world,group:'book_lotm',situationId:I.situation,...opts});
export function quoteRecords(state,commands,preview,{blocked='',decide=()=>({allowed:true}),facts=null,known=true}={}){
 const here=state.simulation?.people?.player?.location,pending=new Set((state.simulation?.jobs||[]).map(j=>j.commandId));
 const shown=commands.filter(c=>c.location===here||pending.has(c.id));
 return quoteLotmRecords(shown,preview,{actorFacts:state.actors?.player?.facts||{},facts,known}).map(r=>{
  const d=commands.find(c=>c.id===r.id),decision=decide(d),reasons=[...r.reasons,...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  return {...r,eligible:r.eligible&&!blocked&&decision.allowed,reasons};
 });
}
