// A local crop uses the retained room's existing played clock. Its mature
// harvest is held until collected, and priced by actual collection-time control.
import {check,natural} from './basics.js';
import {cultivationView} from './absorb_p23/world_adaptation/techniques.js';
import {mistglassProfile as P} from './absorb_p23/world_adaptation/profile.js';
import {assertNativeItemDisposition} from './native_gameplay_adapter.js';
import {applyEnergyEffect} from './energy_resources.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
const shape=(x,keys)=>x&&Object.keys(x).sort().join(',')===keys.split(',').sort().join(',');
export function validateSeedbed(b,elapsed){
 if(b===undefined)return;check(shape(b,'builtAt,crop,harvests,last')&&natural(b.builtAt)&&b.builtAt<=elapsed&&natural(b.harvests),'Invalid conservatory bed.');
 if(b.crop)check(shape(b.crop,'sownAt,readyAt')&&natural(b.crop.sownAt)&&b.crop.sownAt>=b.builtAt&&b.crop.sownAt<=elapsed&&b.crop.readyAt===b.crop.sownAt+120,'Invalid growing crop.');
 if(b.last)check(shape(b.last,'at,rate,amount,method')&&natural(b.last.at)&&b.last.at<=elapsed&&natural(b.last.rate)&&b.last.amount===Math.min(2500,8*b.last.rate)&&['mist','breath','settling'].includes(b.last.method)&&b.harvests>0,'Invalid collected crop.');else check(b.harvests===0,'Missing collected crop receipt.');
}
export function seedbedView(state,context){
 const r=state.mistglassRealm;if(!r)return null;const elapsed=r.instance.clock.elapsed,b=r.seedbed,t=cultivationView(state.worldAdaptation?.techniques,false,context.rootAffinity),reserve=state.simulation?.energies?.player?.[P.resourceId]?.reserve||0,amount=Math.min(2500,8*t.rate);
 validateSeedbed(b,elapsed);return {built:!!b,crop:b?.crop?{remaining:Math.max(0,b.crop.readyAt-elapsed),ready:b.crop.readyAt<=elapsed}:null,elapsed,harvests:b?.harvests||0,last:b?.last||null,rate:t.rate,amount,room:Math.max(0,P.capacity-reserve),method:t.id};
}
export function quoteSeedbed(state,c,action){
 try{
  const v=seedbedView(state,c);check(v,'Enter the actual retained conservatory first.');const inv=c.inventory||{},spend=[];
  const take=(id,n)=>{const key=Object.keys(inv).find(k=>JSON.parse(k).id===id&&inv[k]>=n);check(key,`Carry ${n} actual owned ${id}.`);assertNativeItemDisposition(state,key);spend.push({key,count:n});};
  if(action==='build'){check(!v.built,'The room already holds this fitted seedbed.');take('Rough wood log',2);}
  else {check(v.built,'Fit the wooden seedbed first.');if(action==='plant'){check(!v.crop,'Collect or deliberately clear the existing crop first.');take(P.doseItemId,1);}
   else if(action==='harvest'){check(v.crop?.ready,'The crop needs 120 actual visited-room minutes before collection.');check(v.room>=v.amount,`Keep room for the whole ${v.amount/1000}-condensate harvest; a full reserve leaves it safely growing.`);}
   else if(action==='clear')check(v.crop,'There is no crop to clear.');else check(false,'Unknown seedbed action.');}
  return {eligible:true,action,spend,...v};
 }catch(e){return {eligible:false,action,reason:e.message};}
}
export function stageSeedbed(plan,c,registry,action){
 const q=quoteSeedbed(plan.state,c,action);check(q.eligible,q.reason);const r=plan.state.mistglassRealm;
 for(const row of q.spend)applyGameplayEffect(plan.gameplay,{type:'item',key:row.key,amount:row.count},'player',true);
 if(action==='build')r.seedbed={builtAt:q.elapsed,crop:null,harvests:0,last:null};
 else if(action==='plant')r.seedbed.crop={sownAt:q.elapsed,readyAt:q.elapsed+120};
 else if(action==='clear')r.seedbed.crop=null;
 else{applyEnergyEffect(plan.state,'player',{energyId:P.resourceId,operation:'recover',amount:q.amount},registry.simulation);r.seedbed.crop=null;r.seedbed.harvests++;r.seedbed.last={at:q.elapsed,rate:q.rate,amount:q.amount,method:q.method};}
 validateSeedbed(r.seedbed,q.elapsed);return plan;
}
