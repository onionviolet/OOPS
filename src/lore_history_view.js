import {queryStoryOutcomes} from './lore_history_state.js';
// Observer-safe semantic frame. No person traits, plans, private stock or purse.
export function knownStoryOutcomes(state,observer='player') {
 return queryStoryOutcomes(state).filter(r=>r.audience.includes(observer)).map(r=>({id:r.id,at:r.at,action:r.action,result:r.result,personId:r.targetPerson,person:r.known.person||null,item:r.known.item||null,label:r.known.label||null,
  fee:r.action==='request.deliver'?r.applied.find(d=>d.kind==='coin'&&d.owner==='player')?.delta||0:null,basis:[r.id,...r.historyCauses]}));
}
export function storyRecap(state,personId,observer='player') {
 const rows=knownStoryOutcomes(state,observer).filter(r=>r.personId===personId);
 const deed=[...rows].reverse().find(r=>r.action.startsWith('request.'));
 if(!deed)return null;
 const later=rows.find(r=>r.action==='aftermath.response'&&r.basis.includes(deed.id));
 const line=deed.result==='delivered'?`Story so far: you delivered one ${deed.item} to ${deed.person} and received ${deed.fee} wood coins at played minute ${deed.at}.`:`Story so far: you declined ${deed.person}'s ${deed.item} request at played minute ${deed.at}; no supplies changed hands.`;
 return {line:line+(later?.result==='listen'?' Later, you compared road signs together.':''),basis:later?.result==='listen'?[deed.id,later.id]:[deed.id],coverage:'Remembered requests since enrollment; earlier life is not reconstructed.'};
}
