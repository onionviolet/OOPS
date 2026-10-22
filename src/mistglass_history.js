import {applySituationEffect} from './causal_situations.js';
// W3: one original instance history, retained by the incumbent causal owner.
// The realm's compact legacy selector now points at that same pinned receipt.
import {appendStoryOutcome,queryStoryOutcomes} from './lore_history_state.js';
import {check} from './basics.js';
const WORLD='p23.mistglass',PLACE='p23.mistglass.conservatory',KEEPER='p23.mistglass.keeper';
export const MISTGLASS_HISTORY_SITUATION=Object.freeze({id:'p23.mistglass.outflow',revision:1,label:'Conservatory outflow evidence',context:{worldId:WORLD,instanceId:'mistglass.main',continuityId:'frontier.mistglass.proposal',eraId:'frontier.present',regionId:'p23.mistglass.room'},initialPhase:'open',phases:['open'],privateTruth:{outflowExists:true},participants:['player']});
export const MISTGLASS_ORIGINS=Object.freeze({
 'keeper-built':{owner:KEEPER,consequence:'Older stonework follows the keeper’s family mark; its gate remains a private fitting.',terms:'The keeper permits repair of her own outflow and pays for clearing it.'},
 'mill-race':{owner:'village.mill',consequence:'Flood-cut masonry joins the Village mill race; the surviving public easement is still legible.',terms:'The public easement permits restoration, with the conservatory retaining its clearing duty to Village.'},
});
export function retainMistglassOrigin(state,h){
 const origin=MISTGLASS_ORIGINS[h.id];check(origin,'Unknown original Mistglass history.');
 const receipt=appendStoryOutcome(state,{operation:'mistglass.origin:mistglass.main',worldId:WORLD,actor:'world',issuer:origin.owner,
  targetPerson:KEEPER,targetObject:'p23.mistglass.outflow',targetPlace:PLACE,action:'world.initialize',result:h.id,at:state.clock,
  producer:'mistglass.origin',causeRefs:['instance:mistglass.main','continuity:frontier.mistglass.proposal'],historyCauses:[],audience:[],known:{},applied:[]});
 (state.loreHistory.consumerPins||={}).mistglass=[receipt.id];
 state.worlds[WORLD].facts['p23.mistglass.sluiceOwner']=origin.owner;
 return {...h,receiptId:receipt.id};
}
export function validateMistglassOrigin(state,h){
 if(!h?.receiptId)return; // Earlier E5 records retain their original meaning.
 const r=queryStoryOutcomes(state,{id:h.receiptId})[0],o=MISTGLASS_ORIGINS[h.id];
 check(o&&r?.action==='world.initialize'&&r.worldId===WORLD&&r.result===h.id&&r.at===h.drawnAt&&r.issuer===o.owner&&
  state.worlds[WORLD].facts['p23.mistglass.sluiceOwner']===o.owner&&state.loreHistory.consumerPins?.mistglass?.includes(r.id),'Mistglass origin differs from its retained cause or present owner.');
}
export function observeMistglassHistory(state,observer,kind,account){
 const h=state.mistglassRealm?.history;check(h&&MISTGLASS_ORIGINS[h.id]&&['account','inspect'].includes(kind),'No supported Mistglass history observation.');
 if(!state.simulation.situations?.[MISTGLASS_HISTORY_SITUATION.id])applySituationEffect(state,{operation:'begin',situationId:MISTGLASS_HISTORY_SITUATION.id,definition:MISTGLASS_HISTORY_SITUATION},null,'mistglass.history.observe');
 const records=(state.simulation.knowledge[observer]||={});
 if(kind==='inspect')check(records['p23.mistglass.history']?.stage==='seen','Hear the keeper’s account before comparing the surviving masonry.');
 const key=kind==='account'?'p23.mistglass.history':'p23.mistglass.masonry';
 records[key]={stage:'seen',value:kind==='account'?account:MISTGLASS_ORIGINS[h.id].consequence,at:state.clock,cause:h.receiptId||'mistglass.legacy.origin',
  basis:{kind:'observation',attributedTo:observer,situationId:'p23.mistglass.outflow'}};
}
export function mistglassHistoryView(state,observer='player'){
 const h=state.mistglassRealm?.history,records=state.simulation?.knowledge?.[observer]||{},o=MISTGLASS_ORIGINS[h?.id];
 if(!o)return null;
 const heard=records['p23.mistglass.history']?.stage==='seen',inspected=records['p23.mistglass.masonry']?.stage==='seen';
 return {heard,inspected,account:heard?records['p23.mistglass.history'].value:null,consequence:inspected?records['p23.mistglass.masonry'].value:null,
  terms:inspected?o.terms:null,restored:state.worlds[WORLD].facts['p23.mistglass.outflowRestored']===true};
}
