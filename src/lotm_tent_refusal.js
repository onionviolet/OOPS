// A completed authored choice resolves skipped stages without performing them.
// Source: English v1 ch4 P077–100/ch5 P002–043. Refusal before drawing is I.
import {sequencePrerequisites,placeActSequenceView} from './place_act_sequence.js';
import {compileCastSchedule} from './cast_schedule.js';
import {castCalendar} from './lotm_cast_calendar.js';
import {BE_PROFILE_ID} from './seat_profiles.js';
export const TENT_REFUSAL='book.lotm.excursion.decline_free';
export const TENT_READING='book.lotm.excursion.reading';
export const TENT_DECLINE='book.lotm.excursion.decline';
export const DIRECT_GROCERIES='book.lotm.excursion.market_direct';
const market='book.lotm.excursion.market';
const readingBeats=new Set(['lotm.cast.klein-moretti.105','lotm.cast.klein-moretti.106']);
const shoppingCache=new WeakMap(),approachCache=new WeakMap();
export const directGroceriesDone=state=>state?.lotm?.entryProfile===BE_PROFILE_ID&&!!state.actors?.player?.completed?.[DIRECT_GROCERIES];
// An alternative stage-resolution receipt is not evidence that cards were drawn.
export function tentReadingObserved(state,knowledgeKey=TENT_READING+'.seen'){
 const done=state?.actors?.player?.completed||{},known=state?.simulation?.knowledge?.player||{};
 return !!(done[TENT_READING]||known[knowledgeKey]||known['cast.learned.1766b665ffe50890ed9c']);
}
export function directGroceriesAvailable(state){
 const done=state.actors?.player?.completed||{},known=state.simulation?.knowledge?.player||{};
 return state?.lotm?.entryProfile===BE_PROFILE_ID&&!directGroceriesDone(state)&&!tentReadingRefused(state)&&
  !done[TENT_READING]&&!done[market]&&!known['book.lotm.excursion.reading.seen']&&!known['cast.learned.1766b665ffe50890ed9c'];
}
export function directGroceriesData(data){
 if(!data)return null;
 if(shoppingCache.has(data))return shoppingCache.get(data);
 const row=data.acts?.find(r=>r.id===market);
 const direct=row?{acts:[{...row,id:DIRECT_GROCERIES,knowledgeKey:DIRECT_GROCERIES+'.seen',
  requires:{all:[...(row.requires?[row.requires]:[]),...sequencePrerequisites(data,TENT_READING),
   {fact:'tent.canShopDirect',op:'eq',value:true,reason:'This shopping errand has already been settled.'}]},
  source:{locator:'Authored direct route; grocery purchase and total qualified in English v1 ch4 P035–ch5 P048',timing:'fill'}}]}:null;
 shoppingCache.set(data,direct);return direct;
}
export function tentSequenceView(state,data,moves=[]){
 const view=placeActSequenceView(state,tentSequenceData(data));
 const row=directGroceriesData(data)?.acts[0];
 if(view?.next?.id!==TENT_READING||!row||!directGroceriesAvailable(state))return view;
 if(state.simulation?.people?.player?.location===row.place){
  return {...view,next:{id:DIRECT_GROCERIES,label:row.label,place:row.place,readyAt:null}};
 }
 const walk=moves.find(m=>m.to===row.place&&m.eligible);
 if(!walk)return view;
 return {...view,alternatives:[{walkId:walk.id,label:'Or go straight to the market',
  actionLabel:row.label}]};
}
const dataCache=new WeakMap();
export function tentReadingRefused(state){
 return state?.lotm?.entryProfile===BE_PROFILE_ID&&!!state.actors?.player?.completed?.[TENT_REFUSAL];
}
export function tentSequenceData(data){
 if(!data)return data;
 if(dataCache.has(data))return dataCache.get(data);
 const patch=arc=>({...arc,stages:arc.stages.map(s=>[TENT_READING,TENT_DECLINE,market].includes(s.commandId)?
  {...s,resolvedBy:[...(s.resolvedBy||[]),...([TENT_READING,TENT_DECLINE].includes(s.commandId)?[TENT_REFUSAL]:[]),DIRECT_GROCERIES]}:s)});
 const next={...data,resolutionKnowledge:{...data.resolutionKnowledge,[TENT_REFUSAL]:TENT_REFUSAL+'.seen',[DIRECT_GROCERIES]:DIRECT_GROCERIES+'.seen'},...(data.sequences?{sequences:data.sequences.map(patch)}:{}),
  ...(data.sequence?{sequence:patch(data.sequence)}:{})};
 dataCache.set(data,next);
 return next;
}
export function tentReadingBeatReady(state,beat,pack){
 if(state?.lotm?.entryProfile!==BE_PROFILE_ID||!readingBeats.has(beat.id))return true;
 const done=state.actors?.player?.completed||{},known=state.simulation?.knowledge?.player||{};
 if(beat.id==='lotm.cast.klein-moretti.105'){
  const at=state.simulation?.people?.player?.location,elapsed=state.clock-state.lotm.initializedAt;
  const tent=pack?.places?.find(p=>p.indexId==='lotm.place.fortune-tent')?.id;
  if(!approachCache.has(pack)&&pack){
   const staff=(pack.people||[]).filter(p=>['lotm.person.animal-trainer-fortune-teller','lotm.person.circus-fortune-teller'].includes(p.indexId)).map(p=>p.id);
   const schedule=compileCastSchedule((pack.bindings?.schedule||[]).filter(r=>staff.includes(r.actor)));
   approachCache.set(pack,{staff,schedule});
  }
  const support=approachCache.get(pack);
  const staffed=at===tent&&support?.staff.some(id=>state.simulation?.people?.[id]?.location===tent&&support.schedule.whereabouts(id,castCalendar(state)).place===tent);
  if(tentReadingRefused(state)||(elapsed>=500&&elapsed<540&&(at===beat.place||staffed)))return true;
 }else if(tentReadingRefused(state))return false;
 // Preserve old earned observations and older saves already beyond this stage.
 // Fresh lives must actually draw before the scheduled actor knowledge is due.
 return !!(done[TENT_READING]||(!directGroceriesDone(state)&&done[market])||
  known['book.lotm.excursion.reading.seen']||known['cast.learned.1766b665ffe50890ed9c']);
}
