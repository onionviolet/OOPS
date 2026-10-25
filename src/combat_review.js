import {effectiveDamageTaken,effectiveCritChance} from './gear_dimensions.js';
// Observed ordinary combat receipts. Estimates use disclosed native readouts;
// actual post-fight diagnosis uses resolved exchange damage, misses and blocks.
import {mitigateCombatDamageFromStats} from './combat_math.js';
import {check,natural} from './basics.js';
export const freshCombatReview=()=>({schema:1,current:null,recent:[]});
const finite=n=>Number.isFinite(n)&&n>=0;
export function validateCombatReview(s){
 if(s==null)return;check(Object.keys(s).sort().join(',')==='current,recent,schema'&&s.schema===1&&Array.isArray(s.recent)&&s.recent.length<=24,'Invalid combat review.');
 for(const r of [s.current,...s.recent].filter(Boolean)){
  check(Object.keys(r).filter(k=>k!=='recovered').sort().join(',')==='blocks,dealt,foeHP,foes,heroHP,hits,id,incoming,misses,outcome,outgoing,place,seen,taken'&&typeof r.id==='string'&&r.id.length<=240&&typeof r.place==='string'&&r.place.length<=160&&Array.isArray(r.foes)&&r.foes.length<=50&&r.foes.every(n=>typeof n==='string'&&n.length<=120)&&['ongoing','won','lost','withdrew'].includes(r.outcome)&&finite(r.heroHP)&&finite(r.foeHP),'Invalid combat review encounter.');
  check(['dealt','taken','outgoing','incoming','hits','misses','blocks'].every(k=>finite(r[k]))&&['outgoing','incoming','hits','misses','blocks'].every(k=>natural(r[k]))&&Array.isArray(r.seen)&&r.seen.length<=512&&r.seen.every(k=>typeof k==='string'&&k.length<=160),'Invalid observed combat totals.');check(r.recovered===undefined||finite(r.recovered),'Invalid observed recovery.');check(r.hits+r.misses+r.blocks===r.outgoing,'Inconsistent outgoing combat totals.');
 }
}
export function startReview(s,{id,place='',heroHP,foeHP,foes}){
 if(s.current?.id===id||s.recent.some(r=>r.id===id))return s;
 let next=structuredClone(s);if(next.current)next=finishReview(next,next.current.id,'withdrew');
 next.current={id,place,heroHP,foeHP,foes:[...foes],outcome:'ongoing',dealt:0,taken:0,recovered:0,outgoing:0,incoming:0,hits:0,misses:0,blocks:0,seen:[]};validateCombatReview(next);return next;
}
export function observeReview(s,id,key,event){
 if(s.current?.id!==id||s.current.seen.includes(key)||!['dealt','taken'].includes(event.direction)||!['hit','miss','block'].includes(event.outcome))return s;
 const next=structuredClone(s),r=next.current;r.seen.push(key);r.seen=r.seen.slice(-512);
 const outgoing=event.direction==='dealt';r[outgoing?'outgoing':'incoming']++;
 if(event.outcome==='hit'){check(finite(event.amount),'Invalid observed damage.');r[outgoing?'dealt':'taken']+=event.amount;if(outgoing)r.hits++;}
 else if(outgoing)r[event.outcome==='miss'?'misses':'blocks']++;
 validateCombatReview(next);return next;
}
// Records an already delivered, clamped health change, not another HP owner.
export function observeRecovery(s,key,amount){
 if(!s.current||s.current.seen.includes(key)||amount===0)return s;check(typeof key==='string'&&key.length<=160&&finite(amount),'Invalid native recovery observation.');const next=structuredClone(s);next.current.recovered=(next.current.recovered||0)+amount;next.current.seen=[...next.current.seen,key].slice(-512);validateCombatReview(next);return next;
}
export function finishReview(s,id,outcome){
 if(s.current?.id!==id)return s;check(['won','lost','withdrew'].includes(outcome),'Invalid review outcome.');const next=structuredClone(s);next.current.outcome=outcome;next.recent=[{...next.current,seen:[]},...next.recent].slice(0,24);next.current=null;validateCombatReview(next);return next;
}
export function diagnoseCombat(r){
 const dealt=r.dealt/Math.max(1,r.outgoing),taken=r.taken/Math.max(1,r.incoming),kill=dealt>0?r.foeHP/dealt:null,fall=taken>0?r.heroHP/taken:null;
 let cause='measured',advice='Compare the observed exchange costs with your available recovery and withdrawal route.';
 if(!r.outgoing){cause='tempo';advice='No player attack was observed. The opponent acted before your own recorded exchange.';}
 else if(r.misses/r.outgoing>=0.4){cause='accuracy';advice='Misses consumed at least 40% of your observed attacks. Check attack rating against this opponent’s evasion.';}
 else if(r.blocks/r.outgoing>=0.4){cause='guard';advice='Full blocks stopped at least 40% of your observed attacks. A different attack or enough force to pass the shield may help.';}
 else if(kill!==null&&fall!==null&&kill>fall){cause='endurance';advice='At the observed mean damage, defeating the group needed more exchanges than your starting health could endure. Compare protection, damage, speed and recovery.';}
 else if(r.outcome==='won'){cause='advantage';advice='Your actual exchanges defeated this group. Future rolls, equipment condition and other opponents can change the result.';}
 return {cause,advice,exchangesToKill:kill,exchangesToFall:fall,damagePerOutgoing:dealt,damagePerIncoming:taken};
}
export function ownDefenseRows(hero){
 const p=hero?.protection;if(!p)return [];
 return [
  {layer:'Flat armor',value:hero.defense,unit:'points',meaning:'Subtracted from each landed physical damage value before chip and percent terms; enemy penetration may bypass part.'},
  {layer:'Damage after armor',value:effectiveDamageTaken(p.damageTaken),unit:'×',meaning:'Multiplies landed damage after flat armor and its chip floor. Native resistance limits apply.'},
  {layer:'Physical chip share',value:100*p.minDamageShare,unit:'%',meaning:'Minimum share of an ordinary physical damage value before the damage multiplier; the native one-point floor also applies.'},
  {layer:'Critical chance remaining',value:effectiveCritChance(1,p.critResistance),unit:'×',meaning:'Multiplies an incoming attacker’s critical chance. This does not subtract from critical damage.'},
  ...(hero.shield?[{layer:'Shield check chance',value:100*Math.max(0,Math.min(1,p.blockChance)),unit:'%',meaning:'Chance of the native shield check before hit damage; this is distinct from evasion.'},{layer:'Shield strength',value:hero.block,unit:'points',meaning:'Current native block strength. Training, the incoming force and partial blocks determine the actual exchange.'}]:[]),
  {layer:'Your outgoing penetration',value:hero.armorPenetration||0,unit:'points',meaning:'Bypasses flat armor on your attacks. It does not bypass shields, the chip floor or percent resistance.'}
 ];
}
export function publicCombatForecast(hero,foes){
 if(!hero||!foes?.length)return null;
 const pairs=foes.filter(f=>!f.defeated).map(f=>{
  // Current native disclosures: base physical damage, flat defense, hit chance
  // and speed. Crits, shields, elemental modifiers and tactics need actual play.
  const hit=(f.youHitPct??100)/100,takenHit=(f.hitPct??100)/100;
  const outgoing=mitigateCombatDamageFromStats(Array(Math.min(32,hero.attack.count||1)).fill(hero.attack.power),{defense:f.defense},0,hero.armorPenetration??0)*hit;
  const incoming=mitigateCombatDamageFromStats(Array(Math.min(32,f.attack.count||1)).fill(f.attack.power),{defense:hero.defense,damage_taken:hero.protection?.damageTaken,min_damage_share:hero.protection?.minDamageShare})*takenHit;
  return {name:f.name,health:f.health.current,outgoing,incoming,secondsToKill:outgoing*hero.speed>0?f.health.current/(outgoing*hero.speed):null,incomingPerSecond:incoming*f.speed,uncertain:!!hero.shield||!!f.shield};
 });
 const secondsToKill=pairs.reduce((sum,r)=>sum+(r.secondsToKill??0),0),incoming=pairs.reduce((sum,r)=>sum+r.incomingPerSecond,0);
 return {protection:ownDefenseRows(hero),pairs,secondsToKill,secondsToFall:incoming>0?hero.health.current/incoming:null,assumptions:'Approximate base physical exchange: current disclosed power, flat defense, your armor penetration, disclosed own-body damage multiplier/chip floor, hit chance and speed; one target at a time. Crits, shields, tactics, recovery, enemy penetration, stamina changes and other damage layers can change this. This forecast grants no outcome.'};
}
