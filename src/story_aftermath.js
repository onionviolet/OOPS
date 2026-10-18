import {advanceGeneratedPeople} from './generated_people.js';
import {knownStoryOutcomes} from './lore_history_view.js';
import {queryStoryOutcomes} from './lore_history_state.js';
export const AFTERMATH_ID='village.remembered_supply';
export const storyAftermathDefinitions={events:[{id:AFTERMATH_ID,revision:1,label:'A traveler remembers a shared supply request.',group:'storylet',interval:1,public:true,actorId:'player',mode:'offer',lifetime:90,effects:[],onExpire:[],responses:[{id:'listen',label:'Hear their road advice',costs:[],effects:[{type:'xp',skill:'Perception',amount:8}]},{id:'pass',label:'Leave it for another time',costs:[],effects:[]}],storylet:{deck:'village.chances',urgency:'soft',weight:{base:80,plus:[]},cooldown:30,once:false,family:'remembered_request',fallback:'pass'}}]};
// Context-only bridge to the existing absolute-calendar visitor schedule.
// No facts or schedule copies are persisted into the expansion save.
export function generatedPeoplePresenceFacts(state,context={}) {
 const frame=context.generatedPeopleFrame;
 const at=frame?.people?.lastMinute;
 const elapsed=state.clock-(frame?.clock??state.clock);
 const people=frame?.people&&elapsed>=0?advanceGeneratedPeople(frame.people,at+Math.floor(elapsed)):null;
 return Object.fromEntries(['traveler_1','traveler_2','traveler_3'].map(id=>{
  const p=people?.people.find(p=>p.id===id);
  return [`person.${id}.present`,!!p&&p.arrivedAt<=people.lastMinute&&p.status!=='on_road'];
 }));
}
export function aftermathPersonPresent(state,historyRef,facts={}) {
 const r=knownStoryOutcomes(state).find(r=>r.id===historyRef);
 return !!r&&facts[`person.${r.personId}.present`]===true;
}
export function eligibleAftermath(state,facts={}) {
 const receipts=knownStoryOutcomes(state).filter(r=>r.action.startsWith('request.')&&state.clock>=r.at+12&&facts[`person.${r.personId}.present`]===true);
 return receipts.find(r=>!queryStoryOutcomes(state,{action:'aftermath.response'}).some(done=>done.historyCauses.includes(r.id)))||null;
}
export function bindStoryAftermath(definition,state,facts={}) {
 if(definition.id!==AFTERMATH_ID)return definition;
 const r=eligibleAftermath(state,facts);if(!r)return null;
 const delivered=r.result==='delivered';
 return {...structuredClone(definition),historyRef:r.id,
 label:delivered?`${r.person} remembers the ${r.item} you delivered. With that supply packed, they offer to share a road-reading lesson.`:`${r.person} remembers that you declined the ${r.item} request. No supplies changed hands. They offer some road advice anyway.`,
 responses:definition.responses.map(response=>response.id==='listen'?{...structuredClone(response),label:delivered?'Compare road signs together · 8 Perception XP':'Ask about road signs · 4 Perception XP',effects:[{type:'xp',skill:'Perception',amount:delivered?8:4}]}:structuredClone(response))};
}
