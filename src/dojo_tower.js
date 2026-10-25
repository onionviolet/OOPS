import {TOWER_INSIGHTS,validateTowerInsight} from './dojo_insight.js';
import {validateTowerRoutine,stopTowerRoutine} from './dojo_tower_routine.js';
// Original dojo wager circuit. The host's existing training opponent, native
// damage, inventory, paid travel and durable strike settlement remain owners.
import {check,natural} from './basics.js';
export const TOWER_FLOORS=12;
export const freshTower=()=>({schema:1,fund:40,best:0,wins:{},pending:null,history:[]});
export function validateTower(t){
 if(t===undefined)return;validateTowerRoutine(t.routine);validateTowerInsight(t.insight);
 check(t&&t.schema===1&&natural(t.fund)&&natural(t.best)&&t.best<=TOWER_FLOORS&&t.wins&&typeof t.wins==='object'&&!Array.isArray(t.wins)&&Array.isArray(t.history)&&t.history.length<=24,'Invalid dojo tower.');
 if(t.insight)check(t.insight.learned.every(id=>t.best>=TOWER_INSIGHTS[id].floor),'Tower insight needs its earned floor.');
 check(t.best===Math.max(0,...Object.keys(t.wins).map(Number)),'Tower best floor needs actual wins.');
 for(const [floor,n]of Object.entries(t.wins))check(/^(?:[1-9]|1[0-2])$/.test(floor)&&natural(n)&&n>0,'Invalid tower wins.');
 if(t.routine)check(t.routine.floor<=t.best,'A repeat routine needs an earned floor.');
 const receipt=r=>check(r&&natural(r.attempt)&&r.attempt>0&&natural(r.floor)&&r.floor>=1&&r.floor<=TOWER_FLOORS&&natural(r.stake)&&[0,1,5].includes(r.stake)&&natural(r.payout)&&natural(r.repeat)&&['pending','won','lost','withdrew','draw'].includes(r.outcome),'Invalid tower receipt.');
 if(t.pending){receipt(t.pending);check(t.pending.outcome==='pending','Invalid pending tower outcome.');}
 for(const r of t.history){receipt(r);check(r.outcome!=='pending','Unsettled tower history.');}
 check(new Set(t.history.map(r=>r.attempt)).size===t.history.length,'Duplicate tower settlement.');
}
export function quoteTower(value,{floor,stake=1,money,attempt}){
 const t=value||freshTower();validateTower(t);const reasons=[];
 if(t.pending)reasons.push('Settle or leave the actual pending tower attempt.');
 if(!natural(floor)||floor<1||floor>TOWER_FLOORS||floor>t.best+1)reasons.push('Enter the next earned floor or repeat an earned floor.');
 if(![0,1,5].includes(stake)||!natural(money)||money<stake)reasons.push('Bring the actual coins for this stake.');
 if(!natural(attempt)||attempt<1)reasons.push('Use the actual next native training attempt.');
 const repeat=t.wins[floor]||0,bonus=Math.floor(3*floor/(repeat+1)),payout=2*stake+bonus;
 if(t.fund+stake<payout)reasons.push('The circuit sponsor cannot fund this disclosed payout. A smaller stake or another earned repeat may be affordable.');
 return {eligible:!reasons.length,reasons,floor,stake,repeat,payout,bonus,scale:1+0.15*(floor-1)+0.1*Math.min(50,repeat),attempt};
}
export function beginTower(value,terms){
 const t=value?structuredClone(value):freshTower(),q=quoteTower(t,terms);check(q.eligible,q.reasons.join(' '));
 t.fund+=q.stake-q.payout;t.pending={attempt:q.attempt,floor:q.floor,stake:q.stake,payout:q.payout,repeat:q.repeat,outcome:'pending'};validateTower(t);return {state:t,coins:-q.stake,profile:{floor:q.floor,repeat:Math.min(50,q.repeat)}};
}
export function settleTower(value,{attempt,outcome,at=0}){
 validateTower(value);if(!value?.pending||value.pending.attempt!==attempt)return {state:value,coins:0,duplicate:true};check(['won','lost','withdrew','draw'].includes(outcome),'Choose an actual tower outcome.');
 let t=structuredClone(value);const r={...t.pending,outcome};t.pending=null;let coins=0;
 if(outcome==='won'){coins=r.payout;t.best=Math.max(t.best,r.floor);t.wins[r.floor]=(t.wins[r.floor]||0)+1;}
 else if(outcome==='draw'){coins=r.stake;t.fund+=r.payout-r.stake;}
 else t.fund+=r.payout;
 if(outcome!=='won')t=stopTowerRoutine(t,at,`The actual attempt ended ${outcome}. Deliberately resume after reviewing it.`);
 t.history=[r,...t.history].slice(0,24);validateTower(t);return {state:t,coins,duplicate:false};
}
export function towerDrawEligible(combat,profile){
 if(!combat||!profile?.pending?.tower||profile.pending.exchange<1||combat.defenders?.length!==1)return false;
 const a=combat.attackers?.[0]?.getFullStats(),b=combat.defenders[0].getFullStats();return a?.max_health>0&&b.max_health>0&&a.health>0&&b.health>0&&Math.abs(a.health/a.max_health-b.health/b.max_health)<=0.1;
}

export function planTowerInsight(value,{action,id,money,world,location,ready,clock=0}){
 let t=value?structuredClone(value):freshTower();validateTower(t);
 check(world==='reference.proto23.village'&&location==='Proto23 Dojo lobby'&&ready&&!t.pending,'Meet the dojo while free, outside an actual attempt.');
 if(t.routine?.enabled)t=stopTowerRoutine(t,clock,'Manual lesson selection pauses automatic admission.');
 const next=t.insight||={learned:[],active:null};let cost=0,minutes=0;
 if(action==='off')next.active=null;
 else{
  const d=TOWER_INSIGHTS[id];check(d,'Choose a known reed-circle lesson.');
  if(action==='learn'){
   check(!next.learned.includes(id),'This lesson has already been learned.');check(t.best>=d.floor,`Win tower floor ${d.floor} before studying this lesson.`);check(natural(money)&&money>=5,'The actual five-coin lesson fee is needed.');
   next.learned.push(id);next.active=id;cost=5;minutes=5;t.fund+=5;
  }else{check(action==='choose'&&next.learned.includes(id),'Learn this actual lesson before selecting it.');next.active=id;}
 }
 validateTower(t);return {state:t,cost,minutes};
}
