// An admission policy over the real dojo fights. The tower escrow and native
// combat remain the only authorities for costs, injuries and outcomes.
import {WORLD_ID,AREA_ID} from './absorb_p23/encounter_profiles/profile.js';
import {check,natural} from './basics.js';
export function validateTowerRoutine(r){
 if(r===undefined)return;
 check(r&&Object.keys(r).sort().join(',')==='body,enabled,floor,last,remaining,reserve,stake'&&typeof r.enabled==='boolean'&&natural(r.floor)&&r.floor>=1&&r.floor<=12&&[0,1,5].includes(r.stake)&&natural(r.remaining)&&r.remaining<=3&&natural(r.reserve)&&r.reserve<=1000000&&typeof r.body==='string'&&r.body.length>0&&r.body.length<=240,'Invalid tower repeat routine.');
 check(!r.enabled||r.remaining>0,'An enabled tower routine needs an attempt remaining.');
 if(r.last!==null)check(r.last&&Object.keys(r.last).sort().join(',')==='at,reason'&&natural(r.last.at)&&typeof r.last.reason==='string'&&r.last.reason.length<=240,'Invalid tower routine stop receipt.');
}
export function towerRoutineBody(body,life){return `${life||1}:${body.id}:${body.ownerId}:${body.controllerId}:${body.form}`;}
export function configureTowerRoutine(t,{enabled,stake=0,count=3,reserve=5,body}){
 check(t.best>0,'Earn an actual tower floor before learning its repeat routine.');
 check(!t.pending,'Finish the actual pending fight before configuring its routine.');
 const next=structuredClone(t);next.routine={enabled,floor:t.best,stake,remaining:count,reserve,body,last:null};validateTowerRoutine(next.routine);return next;
}
export function quoteTowerRoutine(t,c){
 const r=t.routine;validateTowerRoutine(r);const stop=reason=>({eligible:false,reason});
 if(!r?.enabled)return stop('Repeat routine is off.');
 if(c.world!==WORLD_ID||!['Proto23 Dojo lobby',AREA_ID].includes(c.location))return stop('Return to the actual dojo lobby and deliberately resume the routine.');
 if(c.body!==r.body)return stop('This repeat agreement belongs to the body that set it.');
 if(t.pending)return {eligible:false,waiting:true,reason:'The actual reserved fight is still unresolved.'};
 if(c.location!=='Proto23 Dojo lobby')return stop('Return to the dojo lobby before another admission.');
 if(!c.ready)return stop('Finish other work or the current decision, then deliberately resume.');
 if(!r.remaining)return stop('The chosen attempt count is exhausted.');
 if(!(c.health>1&&c.maxHealth>0&&c.health/c.maxHealth>=.75&&c.maxStamina>0&&c.stamina/c.maxStamina>=.5))return stop('Recover to at least 75% health and 50% stamina before resuming.');
 if(!natural(c.money)||c.money-r.stake<r.reserve)return stop(`The next actual stake would breach your ${r.reserve}-coin reserve.`);
 return {eligible:true,floor:r.floor,stake:r.stake};
}
export function stopTowerRoutine(t,at,reason){
 const next=structuredClone(t);if(next.routine){next.routine.enabled=false;next.routine.last={at,reason};validateTowerRoutine(next.routine);}return next;
}
export function stageTowerRoutineEntry(t,floor,stake){
 const r=t.routine;check(r?.enabled&&r.remaining>0&&r.floor===floor&&r.stake===stake,'The frozen repeat agreement changed.');
 r.remaining--;if(!r.remaining)r.enabled=false;validateTowerRoutine(r);
}
