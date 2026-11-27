// One sourced breakfast encounter. Calendar bands are authored presentation
// defaults, not a recurring schedule for Fang Zheng.
import {registerDomain,domainRegistry} from './domain_registry.js';
export const RI_BREAKFAST='book.ri.lead.breakfast';
export const RI_FANG_ZHENG=RI_BREAKFAST+'.fang_zheng';
const WORLD='book.ri.lead.world',HOME='book.ri.lead.home',V='book.ri.lead.vital';
let ports=null,stay=null;
const identity=state=>{
 const body=state?.simulation?.people?.player?.body,instance=state?.worlds?.[WORLD]?.facts?.['book.ri.lead.instance'];
 return state?.actors?.player?.worldId===WORLD&&body?.ownerId==='player'&&body.controllerId==='player'&&typeof instance==='string'?{bodyId:body.id,instanceId:instance}:null;
};
const inRoom=state=>state?.simulation?.people?.player?.location===HOME&&state?.actors?.player?.completed?.[V+'.leave']>0&&state.actors.player.facts?.[V+'.scene']==='inn';
const nightBefore=minute=>{const phase=minute%1440;return Math.floor(minute/1440)*720+Math.min(phase,360)+Math.max(0,phase-1080);};
export function observeRiPaidStay(plan){
 const id=identity(plan?.state),now=ports?.calendarMinute?.();
 if(!Number.isSafeInteger(now)||now<0){if(stay)stay.wasInRoom=false;return;}
 const room=!!id&&inRoom(plan.state);
 if(!id||!room){if(stay){stay.wasInRoom=false;stay.lastNativeMinute=now;}return;}
 if(!stay||stay.bodyId!==id.bodyId||stay.instanceId!==id.instanceId||now<stay.lastNativeMinute){
  stay={schema:1,...id,lastNativeMinute:now,wasInRoom:true,nightMinutes:0};return;
 }
 if(stay.wasInRoom)stay.nightMinutes+=Math.max(0,nightBefore(now)-nightBefore(stay.lastNativeMinute));
 stay.lastNativeMinute=now;stay.wasInRoom=true;
}
export function riBreakfastFacts(state,context={}){
 if(state?.actors?.player?.worldId!==WORLD)return {};
 const a=state.actors.player,known=state.simulation?.knowledge?.player||{},id=identity(state),minute=context.facts?.calendarMinute;
 const morning=Number.isSafeInteger(minute)&&minute%1440>=360&&minute%1440<660;
 const paidNight=!!(id&&stay&&id.bodyId===stay.bodyId&&id.instanceId===stay.instanceId&&stay.nightMinutes>0);
 const closed=!!(a.completed?.[V+'.brother']||known[RI_BREAKFAST+'.accepted']||known[RI_BREAKFAST+'.refused']);
 const met=!!known[RI_BREAKFAST+'.visit'];
 return {[RI_BREAKFAST+'.available']:inRoom(state)&&morning&&!closed&&!met&&(paidNight||!!a.completed?.[V+'.first_night']),
  [RI_BREAKFAST+'.open']:inRoom(state)&&!closed&&met,
  [RI_BREAKFAST+'.unintroduced']:!state.simulation?.people?.[RI_FANG_ZHENG],
  [RI_BREAKFAST+'.morning']:morning};
}
export function riBreakfastLegacyGuard(state){
 const known=state?.simulation?.knowledge?.player||{};
 if(state?.actors?.player?.worldId!==WORLD||!known[RI_BREAKFAST+'.visit'])return [];
 return [known[RI_BREAKFAST+'.accepted']?'You have already taken the stones Fang Zheng offered.':known[RI_BREAKFAST+'.refused']?'You already pushed his pouch back.':'His pouch is on the table. Answer him before leaving it.'];
}
export function configureRiBreakfast(next){
 ports=next;stay=null;
 if(domainRegistry.list().some(d=>d.id==='ri_breakfast'))return;
 registerDomain({id:'ri_breakfast',initialState:()=>null,load:value=>{stay=value?{...value,wasInRoom:false}:null;},save:()=>stay||undefined,
  validate:value=>{if(value==null)return;if(value.schema!==1||typeof value.bodyId!=='string'||typeof value.instanceId!=='string'||!Number.isSafeInteger(value.lastNativeMinute)||value.lastNativeMinute<0||!Number.isSafeInteger(value.nightMinutes)||value.nightMinutes<0||typeof value.wasInRoom!=='boolean')throw Error('Invalid paid-room breakfast history.');},
  stage:observeRiPaidStay,commandGuards:{[V+'.brother']:riBreakfastLegacyGuard}});
}
