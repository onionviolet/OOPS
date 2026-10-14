import {queryStoryOutcomes} from './lore_history_state.js';
export const AFTERMATH_ID='village.remembered_supply';
export const storyAftermathDefinitions={events:[{id:AFTERMATH_ID,revision:1,label:'A traveler remembers a shared supply request.',group:'storylet',interval:1,public:true,actorId:'player',mode:'offer',lifetime:90,effects:[],onExpire:[],responses:[{id:'listen',label:'Hear their road advice',costs:[],effects:[{type:'xp',skill:'Perception',amount:8}]},{id:'pass',label:'Leave it for another time',costs:[],effects:[]}],storylet:{deck:'village.chances',urgency:'soft',weight:{base:80,plus:[]},cooldown:30,once:false,family:'remembered_request',fallback:'pass'}}]};
export function eligibleAftermath(state) {
 const receipts=queryStoryOutcomes(state).filter(r=>r.action.startsWith('request.')&&r.audience.includes('player')&&state.clock>=r.at+12);
 return receipts.find(r=>!queryStoryOutcomes(state,{action:'aftermath.response'}).some(done=>done.historyCauses.includes(r.id)))||null;
}
export function bindStoryAftermath(definition,state) {
 if(definition.id!==AFTERMATH_ID)return definition;
 const r=eligibleAftermath(state);if(!r)return null;
 const delivered=r.result==='delivered';
 return {...structuredClone(definition),historyRef:r.id,
 label:delivered?`${r.known.person} remembers the ${r.known.item} you delivered. With that supply packed, they offer to share a road-reading lesson.`:`${r.known.person} remembers that you declined the ${r.known.item} request. No supplies changed hands. They offer some road advice anyway.`,
 responses:definition.responses.map(response=>response.id==='listen'?{...structuredClone(response),label:delivered?'Compare road signs together · 8 Perception XP':'Ask about road signs · 4 Perception XP',effects:[{type:'xp',skill:'Perception',amount:delivered?8:4}]}:structuredClone(response))};
}
