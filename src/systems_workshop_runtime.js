// Finite local perishability on the existing played simulation clock. Sealed
// goods use the same inputs but retain revision-1 preservation across custody.
import {SW,SWK as K,PROVIDER} from './systems_workshop_content.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
export function reconcileSystemsWorkshop(before,plan,{chest}={}){
 const a=plan.state.actors.player,f=a.facts;if(!f[SW+'.joined'])return;
 for(const kind of ['ration','parcel']){
  const id=SW+'.ordinary_'+kind;
  if((a.completed[id]||0)>(before.actors.player.completed[id]||0)){
   const at=plan.state.simulation.knowledge.player[SW+'.ordinary_'+kind]?.at;
   f[SW+'.'+kind+'Due']=(at??plan.state.clock)+4;
  }
  const due=f[SW+'.'+kind+'Due'];if(due==null||plan.state.clock<due)continue;
  const fresh=kind==='ration'?K.ordinaryFood:K.ordinaryParcel,spoiled=kind==='ration'?K.spoiledFood:K.spoiledParcel;
  const count=plan.gameplay?.player.inventory[fresh]||0;
  if(count){applyGameplayEffect(plan.gameplay,{type:'item',key:fresh,amount:count},'player',true);applyGameplayEffect(plan.gameplay,{type:'item',key:spoiled,amount:count},'player');(plan.acquisitions ||= []).push({owner:'player',key:spoiled,count});}
  if(chest?.[fresh]){const held=chest[fresh];chest=structuredClone(chest);delete chest[fresh];chest[spoiled]=(chest[spoiled]||0)+held;plan.ownership={...plan.ownership,chest};}
  // Recipient custody still obeys the original package's expiry.
  const owned=plan.state.simulation.owners[PROVIDER],held=owned[fresh]||0;
  if(held){delete owned[fresh];owned[spoiled]=(owned[spoiled]||0)+held;}
  f[SW+'.'+kind+'Spoiled']=true;
 }
}

// Eligibility is derived from current persisted carriers, never caller claims.
export function systemsWorkshopFacts(state){
 const a=state.actors.player,f=a.facts,ren=state.actors[SW+'.apprentice']?.facts||{};
 return {'sw.assistPresent':!!a.sources[SW+'.assist'],
  'sw.modelRecommended':!!f[SW+'.modeled']&&f[SW+'.modelLayout']===f[SW+'.modelBest'],
  'sw.fieldInstalled':state.actors[PROVIDER]?.facts[SW+'.irrigationInstalled']===true,
  'sw.renTaught':ren[SW+'.taught']===true,'sw.renOrder':ren[SW+'.order']===true};
}
