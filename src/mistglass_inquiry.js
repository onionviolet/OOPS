// A local evidence DAG on the existing knowledge owner. Observing the mist
// requires played practice here; outside/global time cannot supply it.
import {check} from './basics.js';
export const INQUIRY_KEYS=Object.freeze({observe:'p23.mistglass.inquiry.observe',compare:'p23.mistglass.inquiry.compare',residue:'p23.mistglass.inquiry.residue',apply:'p23.mistglass.inquiry.controlled_purge'});
const known=(state,id)=>state.simulation?.knowledge?.player?.[INQUIRY_KEYS[id]]?.stage==='understood';
export const controlledPurgeKnown=state=>known(state,'apply');
export function inquiryView(state){
 const t=state.worldAdaptation?.techniques,d=t?.discipline,practiced=(t?.minutes.breath||0)+(t?.minutes.settling||0);
 const rows=[{id:'observe',label:'Observe an entire mist circuit',cost:0,visible:true,reason:practiced>=16?'':'Practice a deliberate method in this mist for 16 actual minutes.'},
 {id:'compare',label:'Compare flow and stillness · 1 condensate',cost:1000,visible:known(state,'observe'),reason:t?.minutes.breath>=16&&t?.minutes.settling>=16?'':'Practice both circulation and settling to at least 16 minutes.'},
 {id:'residue',label:'Examine real vessel residue',cost:0,visible:known(state,'observe'),reason:d?.impurity>0?'':'A real forced circuit or node fusion must leave vessel residue to examine.'},
 {id:'apply',label:'Test controlled purging · 0.5 condensate',cost:500,visible:known(state,'compare')&&known(state,'residue'),reason:d?.impurity>0?'':'Leave one real impurity in the vessel for the test.'}];
 return rows.filter(r=>r.visible).map(r=>({...r,known:known(state,r.id),eligible:!known(state,r.id)&&!r.reason}));
}
export function stageInquiry(plan,id,{reserve,debit}){
 const q=inquiryView(plan.state).find(r=>r.id===id);check(q&&q.eligible,q?.known?'This observation is already recorded.':q?.reason||'Follow the discovered evidence before this application.');
 check(reserve>=q.cost,`This comparison requires ${q.cost/1000} owned condensate.`);if(q.cost)debit(q.cost);
 if(id==='apply')plan.state.worldAdaptation.techniques.discipline.impurity--;
 const values={observe:'A whole circuit showed that ambient reception, controlled flow and stillness act differently on this actual vessel.',compare:'Both practiced drills were compared using the same native condensate. Their control can be combined for a more precise purge.',residue:'Real residue from the owned vessel separates waste from the useful condensate. This observation is not poison tolerance.',apply:'Controlled purging removes one actual impurity for 0.25 condensate on future uses of this method; the comparison and residue test support its precision.'};
 (plan.state.simulation.knowledge.player||={})[INQUIRY_KEYS[id]]={stage:'understood',value:values[id],at:plan.state.clock,cause:`mistglass.inquiry:${plan.state.sequence}:${id}`};
 return plan;
}
