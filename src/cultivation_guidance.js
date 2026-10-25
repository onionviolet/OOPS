// Derived from this already public frame. Advice neither reveals a catalogue nor
// owns progression, clocks, stock or a separate execution quote.
export function cultivationGuidance(frame){
 const v=frame.view;if(!frame.inside||!v)return null;
 const t=v.technique,d=t.vessel,s=d?.state,reserve=Math.round(v.reserve*1000);
 if(frame.disabled||!v.supported)return {text:'Finish the current activity or restore this body’s supported visit before practice.',target:null};
 if(v.pending)return {text:`This purification needs ${v.pending.remainingMinutes} more played minutes. Its starting terms are already committed.`,target:null};
 if(frame.rawRemaining)return {text:`Rawness needs ${frame.rawRemaining} more played minutes before absorption resumes.`,target:null};
 if(v.pathWork?.prepared)return {text:'Your prepared charge already spent its reserve. Finish the compatible work with an owned pelt, or abandon it before changing methods.',target:'method:path:'+(v.pathWork.prepared.path==='breath'?'cut':'set')};
 if(s?.impurity>0&&reserve>=(v.purgeCost||500))return {text:`Vessel impurity slows intake. Purging one point currently costs ${(v.purgeCost||500)/1000} condensate.`,target:'method:vessel:purge'};
 if(!d){const missing=Math.max(0,1000-reserve);return missing?{text:`Shaping a vessel needs ${(missing/1000).toFixed(3)} more condensate. Current practice supplies ${v.ratePerMinute} per played minute${v.ratePerMinute>0?`; about ${Math.ceil(missing/(v.ratePerMinute*1000))} minutes at this rate`:''}.`,target:null}:{text:'Your held condensate can shape a vessel. This spends one condensate; nodes and law study have their own later costs.',target:'method:vessel:open'};}
 if(s.nodes.flow>0&&s.nodes.still>0)return {text:`You have ${Math.min(s.nodes.flow,s.nodes.still)} matched node pairs. Review the existing fusion preview before committing their conversion and residue.`,target:'method:vessel:fuse:all'};
 if(s.depth?.[s.law]!==40&&s.comprehension>=d.nextComprehension&&reserve>=d.nextLawCost)return {text:`Your selected law has enough actual comprehension and reserve for its next depth: ${d.nextLawCost/1000} condensate.`,target:'method:vessel:deepen'};
 const inquiry=v.inquiry?.find(q=>!q.known&&q.eligible&&reserve>=q.cost);if(inquiry)return {text:'Your observed evidence supports a new investigation step. Its existing action shows the actual cost and result.',target:'method:inquiry:'+inquiry.id};
 if(t.nextAt!==null)return {text:`${t.label} needs ${Math.max(0,t.nextAt-t.minutes)} more actual practice minutes for its next stage. Keep the current method selected to earn them.`,target:null};
 const other=['breath','settling'].find(id=>(t.drills[id]||0)<48);if(other)return {text:'This drill is Integrated. The other known drill still has its own unearned practice and offers different intake and control terms.',target:'method:'+other};
 if(s.depth?.[s.law]===40)return {text:'This vessel has reached its current resolution of the selected law. Other known practice and applications keep their own costs and conditions.',target:null};
 return {text:`Next selected-law depth needs ${Math.max(0,d.nextComprehension-s.comprehension)} more comprehension minutes and ${Math.max(0,(d.nextLawCost-reserve)/1000).toFixed(3)} more condensate. Existing practice supplies both under the chosen allocation.`,target:null};
}
