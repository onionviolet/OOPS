// P00 native joins. Reducers remain proposals; this adapter owns no clock or bag.
import {check, natural} from '../../basics.js';
import {validateFieldSnapshot,normalizeFieldFamiliarity} from '../field_familiarity/index.js';
import {normalizeMarketLife,quoteMarketPurchase} from '../market_life/market_life.js';
import {validateLeisureMemory,LEISURE_PERSON} from '../leisure_memory/index.js';
import {normalizeRepeatSearch} from '../repeat_search/repeat_search.js';
import {applyGameplayEffect} from '../../gameplay_transactions.js';
import {appendLifeMilestone,lifeCalendarMinute} from '../../life_record.js';
import {relationshipChange} from '../../chronicle.js';
import {calendarMinutes} from '../../world_rhythm.js';
const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
export const P23_BED_FACT='p23.field.moonBedKnown';
export const P23_LEISURE_RESERVATION='p23.leisure.pendingRound';
export const EDA_KNOWLEDGE='person.p23.leisure.eda.occupation';
export const trancheFourDefinitions={
 people:[{id:LEISURE_PERSON,revision:1,label:'Eda, adult Village cup maker',worldId:'base.frontier',location:'Village',inventory:'simulation',provision:false,resources:{coins:0}}],
 commands:[{id:'p23.leisure.introduce',revision:1,label:'Speak with Eda, the Village cup maker',group:'p23_leisure',worldId:'base.frontier',location:'Village',once:true,
  requires:{all:[{fact:'native.alive',op:'eq',value:true},{fact:'native.ready',op:'eq',value:true}]},effects:[
   {type:'spawn',personId:LEISURE_PERSON,definitionId:LEISURE_PERSON},
   {type:'knowledge',actor:'player',key:EDA_KNOWLEDGE,stage:'seen',value:'Eda is an adult Village cup maker.'}]}]
};

export function validateTrancheFourEnvelope(save) {
 const state=save.expansion,clock=state?.clock;
 const present=['field_familiarity_p07','p23_market_life','p23_leisure_memory','absorb_repeat_search'].some(k=>Object.hasOwn(save,k));
 if(!present&&!state?.actors?.[LEISURE_PERSON]){check(!state?.actors?.player?.facts?.[P23_LEISURE_RESERVATION],'Missing native paid-round owner.');return save;}
 check(natural(clock),'Tranche four requires the native played clock.');
 if(Object.hasOwn(save,'field_familiarity_p07')){
  const raw=save.field_familiarity_p07;
  check(exact(raw,['schema','minutes','lastClock','lastHarvestOccurrence','pending']),'Invalid complete field record.');
  if(raw.pending)check(exact(raw.pending,['occurrence','startedClock','progress','requiredMinutes']),'Invalid complete field pending record.');
  validateFieldSnapshot(raw,{clock,calendar:save['current time']});
  const lunar=save.current_activity?.activity_id==='lunar_gathering';
  check(!!raw.pending===lunar,'Native lunar activity and its pending owner disagree.');
  if(lunar)check(state.actors.player.worldId==='base.frontier'&&save['current location']==='Village'&&state.actors.player.facts[P23_BED_FACT]===true&&!save.is_sleeping&&!save.is_reading&&!save.native_encounter&&state.chronicle?.life.endedAt==null,'Invalid native bed eligibility.');
 } else check(save.current_activity?.activity_id!=='lunar_gathering','Missing lunar activity owner.');
 if(Object.hasOwn(save,'p23_market_life')){
  const raw=save.p23_market_life;
  check(exact(raw,['schema','tradeIndex','deliveryIndex','purchasedUnits','couponsIssued','couponsUsed','supplyDay','supplyClock']),'Invalid complete market record.');
  normalizeMarketLife(raw);
  check(raw.tradeIndex<=state.sequence&&raw.deliveryIndex<=(save.absorb_local_life?.parcelRuns||0),'Market occurrence exceeds its native receipt.');
  check(raw.supplyClock===null||raw.supplyClock<=clock&&raw.supplyDay<=Math.floor(calendarMinutes(save['current time'])/1440),'Market supply exceeds the saved calendar.');
 }
 if(Object.hasOwn(save,'absorb_repeat_search')){
  const raw=save.absorb_repeat_search;
  check(exact(raw,['schema','departure','remaining','claims','looking','progress','lastClock']),'Invalid complete runner-offcut record.');
  normalizeRepeatSearch(raw);
  const total=(save.absorb_local_life?.helped||0)+(save.absorb_local_life?.declined||0);
  check(natural(total)&&raw.departure<=total&&(raw.lastClock===null||raw.lastClock<=clock),'Runner occurrence exceeds its native departure.');
  if(raw.looking)check(state.actors.player.worldId==='base.frontier'&&save['current location']==='Village'&&!save.current_activity&&!save.is_sleeping&&!save.is_reading&&!save.native_encounter&&!state.actors.player.facts[P23_LEISURE_RESERVATION],'Invalid pending runner-offcut eligibility.');
 }
 if(Object.hasOwn(save,'p23_leisure_memory')){
  const raw=save.p23_leisure_memory;validateLeisureMemory(raw,clock);
  check((state.actors.player.facts[P23_LEISURE_RESERVATION]||null)===(raw?.pending?.id||null),'Paid round and native reservation disagree.');
  if(raw?.pending)check(!save.current_activity&&!save.is_sleeping&&!save.is_reading&&!save.native_encounter&&!state.pending.some(j=>j.context.actorId==='player')&&!state.simulation?.jobs.some(j=>(j.participants||[j.actorId]).includes('player'))&&!state.simulation?.sessions.player,'A paid leisure round cannot overlap native work.');
  if(raw)check(natural(save.total_deaths??0)&&raw.defeatCount<=(save.total_deaths??0),'Leisure defeat exceeds the native counter.');
 } else check(!state.actors.player.facts[P23_LEISURE_RESERVATION],'Missing paid-round owner.');
 const eda=state.simulation?.people?.[LEISURE_PERSON],actor=state.actors?.[LEISURE_PERSON];
 if(eda||actor){check(eda&&actor&&eda.definitionId===LEISURE_PERSON&&eda.inventory==='simulation'&&actor.worldId==='base.frontier'&&natural(actor.resources.coins),'Invalid Eda actor and actual purse.');}
 if(save.p23_leisure_memory?.response!==null&&save.p23_leisure_memory?.response!==undefined)
  check(eda&&state.simulation.knowledge.player?.[EDA_KNOWLEDGE],'A remembered Eda response needs the known actual actor.');
 return save;
}

export function stageTrancheFourReward(plan,result,{keyFor}) {
 plan.nativePatch ||= {};plan.gameplay ||= {};plan.acquisitions ||= [];
 check(result.native.money===0&&Object.keys(result.native.skillXp).length===0,'Unexpected tranche-four passive resource reward.');
 for(const row of result.native.items){check(natural(row.count)&&row.count>0,'Invalid native field reward.');const key=keyFor(row.item_id);
  applyGameplayEffect(plan.gameplay,{type:'item',key,amount:row.count},'player');plan.acquisitions.push({owner:'player',key,count:row.count});}
 (plan.p00TrancheFourNotices ||= []).push(...result.messages);
 return plan;
}

export function stageLeisureMemory(plan,result,{calendar,worldId,maxStamina,stamina,lifeRecord}) {
 check(result.minutes===0,'Leisure reducers cannot advance the native clock.');
 const pending=result.state.pending;plan.state.actors.player.facts[P23_LEISURE_RESERVATION]=pending?.id||0;
 plan.nativePatch={...plan.nativePatch,p23_leisure_memory:result.state};
 let biography=plan.nativePatch.life_record||lifeRecord;
 for(const effect of result.effects){
  if(effect.type==='nativeMoney'){const money=plan.external.money+effect.amount;check(Number.isFinite(money)&&money>=0&&money<=Number.MAX_SAFE_INTEGER,'Invalid native leisure payment.');plan.external.money=money;}
  else if(effect.type==='nativeStamina'){const before=maxStamina-(plan.native?.staminaToFull??maxStamina-stamina);const after=Math.max(0,Math.min(maxStamina,before+effect.amount));
   check(effect.amount>=0||before>=-effect.amount,'Insufficient actual leisure stamina.');plan.native={...plan.native,staminaToFull:maxStamina-after};}
  else if(effect.type==='personMoney'){check(effect.personId===LEISURE_PERSON&&plan.state.simulation?.people[LEISURE_PERSON],'Missing actual leisure donor.');
   const actor=plan.state.actors[LEISURE_PERSON],coins=actor.resources.coins+effect.amount;check(natural(coins),'Invalid Eda purse transfer.');actor.resources.coins=coins;}
  else if(effect.type==='relationshipMemory'){
   check(effect.personId===LEISURE_PERSON&&plan.state.simulation?.people[LEISURE_PERSON],'Missing actual relationship participant.');
   if(plan.state.chronicle){const c=plan.state.chronicle;if(!c.relationships[LEISURE_PERSON]?.memories.some(m=>m.id===effect.id))relationshipChange(c,LEISURE_PERSON,{id:effect.id,text:effect.text},plan.state.clock);}
   else {const s=plan.state.simulation,relations=s.relationships.player ||= {},r=relations[LEISURE_PERSON] ||= {axes:{},memories:[]};
    if(!s.causes[effect.id]){r.memories.push({cause:effect.id,at:plan.state.clock,text:effect.text});r.memories=r.memories.slice(-32);s.causes[effect.id]=plan.state.clock;}}
  } else if(effect.type==='biography')biography=appendLifeMilestone(biography,{year:calendar.year,at:lifeCalendarMinute(calendar),worldId,kind:'memory',text:effect.text});
  else throw Error('Unknown native leisure effect.');
 }
 if(biography!==lifeRecord){plan.nativePatch.life_record=biography;plan.p00LifeRecord=biography;}
 plan.p00Leisure=result.state;return plan;
}

export function nativeMarketPreview(raw,context,basket) {
 const state=normalizeMarketLife(raw),quote=quoteMarketPurchase(state,context,basket);
 return {state,context:{worldId:context.worldId,location:context.location,alive:context.alive,calendarDay:Math.floor(context.calendarMinute/1440),traderId:context.traderId},basket:{...basket},quote};
}
