// Zorian's month loop (G7/G8/G11/G13 of the stage record, proposal under AD32). The loop row, the restart machinery, the calendar
// event feed and the knowledge store already exist; this module only wires them for the Zorian start. No clock of its own: the run
// clock is the expansion clock minus the run's start marker, read through the one calendar profile.
import {MOL_START_ZORIAN} from './book_world_mol_starts.js';
import {loopRule} from './harm_loops.js';
import {WORLD_CALENDAR_PROFILES,WORLD_DAY_EVENTS} from './world_calendar_content.js';
import {resolveWorldCalendar,dayEventsDue} from './world_calendar.js';
import {carriedKnowledgeView} from './people_knowledge.js';
import {registerKnowledgeLens} from './observer_view.js';

export const MOL_WORLD='book.mol.cyoria';
export const ZORIAN_LOOP_START='zorian';
// Same situation the seat's other knowledge rows use (the knowledge store needs a real situation context).
export const ZORIAN_RUN_SITUATION='book.mol.visitor_branch';
// G13: commands whose choice differs from the earlier run's day. Committing one sets the run's divergence day (once).
export const DIVERGING_COMMANDS=new Set(['book.mol.zorian.s1.skip_class_drill']);
// The row names carriers in prose; the knowledge view names them as codes. One map, tested against the row.
export const CARRIER_CODE=Object.freeze({'the self':'self','notebook':'notebook','code phrase':'code_phrase','memory packet':'memory_packet'});
// The Zorian start's loop-row start id for a save or expansion state, else null (the visitor and every other world have no loop here).
export function loopStartOf(saveOrState){
 const state=saveOrState?.expansion??saveOrState;
 return state?.actors?.player?.worldId===MOL_WORLD&&state.motherOfLearning?.entryProfile===MOL_START_ZORIAN?ZORIAN_LOOP_START:null;
}
export const runStartOf=d=>d.runStartedAt??d.initializedAt;
const dayEvents=state=>{
 const view=resolveWorldCalendar(state,null);
 return view?{view,due:dayEventsDue(WORLD_CALENDAR_PROFILES[MOL_WORLD],view,WORLD_DAY_EVENTS[MOL_WORLD])}:null;
};
// The run's own day, as `carriedKnowledgeView` reads it: day of the month, and the day this run first left the earlier timeline.
export function todayFor(state){
 const e=loopStartOf(state)&&dayEvents(state);
 return e?{day:e.view.day,hour:e.view.hour,divergedOnDay:state.motherOfLearning.divergence?.day??null}:null;
}
// Convert the calendar's due event back to the expansion clock used by harm.
// A missing or future calendar event cannot end the run.
export function monthEndAt(state){
 const e=loopStartOf(state)&&dayEvents(state);
 const end=e?.due.find(x=>x.id==='mol.month_end');
 return end ? state.clock-end.ageMinutes : null;
}
export const monthEnded=state=>monthEndAt(state)!==null;
// G13: the first thing in a run that differs from the earlier timeline sets the divergence day once; routine repeats do not.
export function markDivergence(state,cause){
 const d=state.motherOfLearning,t=todayFor(state);
 if(!t||d.divergence)return false;
 d.divergence={day:t.day,cause};return true;
}
const rowOf=()=>loopRule(MOL_WORLD,ZORIAN_LOOP_START);
// Foreknowledge written at a restart: each dated event that fell due in the ended run becomes a day-stamped prediction the seat can check.
// The record sits in the existing knowledge store (no new store); an older stamp is never replaced by a later copy.
function writeForeknowledge(ended,next){
 const e=dayEvents(ended),row=rowOf(),known=next.simulation?.knowledge;
 if(!e||!known)return [];
 const bag=known.player??={},carrier=CARRIER_CODE['the self'],written=[];
 for(const ev of e.due){
  if(ev.dateBasis==='unknown'||ev.day==null||ev.day<=1)continue; // day 1 is where every run starts; nothing to foresee
  const id=`book.mol.foreknowledge.${ev.id.replace(/^mol\./,'')}`;
  if(bag[id])continue;
  bag[id]={value:`${ev.label}: ${ev.text}`,at:next.clock,stage:'interpreted',cause:'book.mol.zorian.restart',basis:{kind:'recollection',attributedTo:'player',situationId:ZORIAN_RUN_SITUATION,
   carried:{stampDay:ev.day,carrier,sourceKind:'foreknowledge',decaysAfterDays:row.staleness.reliableDays,
    prediction:{day:ev.day,hour:ev.hour??null,text:ev.text}}}};
  written.push(id);
 }
 return written;
}
// Applied to the restored save after scopedRestart: a new run starts undiverged on day 1, and the earlier run's events become foreknowledge.
export function afterRunRestart(endedExpansion,nextExpansion){
 const d=nextExpansion.motherOfLearning;
 d.runStartedAt=nextExpansion.clock;
 d.runs=(endedExpansion.motherOfLearning?.runs??1)+1;
 delete d.divergence;
 const foreknowledge=writeForeknowledge(endedExpansion,nextExpansion);
 reconcileForeknowledge(nextExpansion);
 return {foreknowledge};
}
// Certainty of carried foreknowledge, on the shared view's own stages (knowledge_view certaintyOf): a prediction from an earlier run is
// 'interpreted' (guessed) until this run has reached its date, then 'understood' (known). Once this run has diverged past the row's reliable
// days it also carries the existing stale note as basis.uncertainty. Idempotent and derived from the run clock, so older saves
// (written 'understood') are corrected the next time it runs. The divergence signal is motherOfLearning.divergence (G13).
// The derived stage (and stale note) of each carried foreknowledge row, from the run clock alone. Pure: the write path below and the
// read lens registered with observer_view both use it, so a save written before this rule, or a month left idle, reads right at once.
export function foreknowledgeCertainty(state){
 const e=dayEvents(state),bag=state?.simulation?.knowledge?.player,t=todayFor(state),out=new Map();
 if(!e||!bag||!t)return out;
 const seen=new Set(e.due.map(x=>x.id.replace(/^mol\./,''))),view=new Map(carriedKnowledgeView(state,t).map(r=>[r.id,r]));
 for(const [id,r] of Object.entries(bag)){
  if(!id.startsWith('book.mol.foreknowledge.')||r.basis?.carried?.sourceKind!=='foreknowledge')continue;
  const confirmed=seen.has(id.slice('book.mol.foreknowledge.'.length));
  const stale=!confirmed&&view.get(id)?.status==='stale';
  out.set(id,{stage:confirmed?'understood':'interpreted',uncertainty:stale?view.get(id).note:''});
 }
 return out;
}
export function reconcileForeknowledge(state){
 const bag=state.simulation?.knowledge?.player;
 for(const [id,d] of foreknowledgeCertainty(state)){
  const r=bag[id];r.stage=d.stage;
  if(d.uncertainty)r.basis.uncertainty=d.uncertainty;else if(r.basis.uncertainty)delete r.basis.uncertainty;
 }
}
// Read lens: the seat's knowledge as the run clock says it stands now, without writing state. Rows that already agree are returned as is.
registerKnowledgeLens((state,knowledge)=>{
 if(!state?.motherOfLearning)return knowledge;
 const d=foreknowledgeCertainty(state);let out=knowledge;
 for(const [id,x] of d){
  const r=knowledge[id];if(r.stage===x.stage&&(r.basis?.uncertainty||'')===x.uncertainty)continue;
  if(out===knowledge)out={...knowledge};
  const basis={...r.basis};if(x.uncertainty)basis.uncertainty=x.uncertainty;else delete basis.uncertainty;
  out[id]={...r,stage:x.stage,basis};
 }
 return out;
});
// Player-facing run line for the campaign section: where the seat is in the month, and what a restart keeps.
export function runText(state){
 const t=todayFor(state),d=state.motherOfLearning;
 return t?`Run ${d.runs??1}, day ${t.day} of 30${d.divergence?`; this run left the timeline you remember on day ${d.divergence.day}`:''}. The month ends on day 30 and so does your body: money, items and other people reset, what you remember and can do stays.`:'';
}
