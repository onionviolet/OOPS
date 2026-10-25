// Remembered qualification and actual conditioning are distinct. One Pledges
// owner keeps the earned physical stages of each supported owned embodiment.
import {check,natural} from './basics.js';
export function validateTrialBodies(b){
 if(b===undefined)return;check(b&&Object.keys(b).sort().join(',')==='active,copies'&&typeof b.active==='string'&&b.active.length<=300&&b.copies&&Object.keys(b.copies).length<=256,'Invalid trial body ledger.');
 for(const [key,v] of Object.entries(b.copies))check(key.length>0&&key.length<=300&&v&&Object.keys(v).sort().join(',')==='quality,stage'&&natural(v.stage)&&v.stage<=3&&natural(v.quality)&&v.quality<=27,'Invalid conditioned body.');
 check(!!b.copies[b.active],'Missing active trial body.');
}
export function syncTrialBody(state,binding){
 if(!state.bodyTrials&&!state.ordeal&&!state.trial.stage&&!state.trial.quality)return state;
 const b=state.bodyTrials,current={stage:state.trial.stage,quality:state.trial.quality||0};
 if(b?.active===binding&&b.copies[binding]?.stage===current.stage&&b.copies[binding]?.quality===current.quality)return state;
 const next=structuredClone(state),ledger=next.bodyTrials||={active:binding,copies:{}};
 if(b)ledger.copies[b.active]=current;
 const active=b&&b.active!==binding?(ledger.copies[binding]||{stage:0,quality:0}):current;
 if(b&&b.active!==binding)next.ordeal=null; // Committed supplies stay spent.
 ledger.active=binding;ledger.copies[binding]=active;
 next.trial={...next.trial,bestStage:Math.max(next.trial.bestStage||0,current.stage,active.stage),stage:active.stage,quality:active.quality};validateTrialBodies(ledger);return next;
}
