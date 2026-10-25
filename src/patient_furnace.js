// OD4/TBANK: bank eligible unused time, spend it forward through a native plan.
// Default cadence matches the ordinary awake native tick. Batch size is a UI
// workload dial, not a time cap: the unused balance has no expiry here.
import {config} from './config.js';
import {advanceHarvest} from './harvest.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
export const FURNACE_DEFAULTS=Object.freeze({realMsPerMinute:1000/config.tickrate,batchMinutes:30});
export const emptyFurnace=()=>({assigned:false,world:null,anchor:null,bank:0,remainder:0,spent:0,stop:'Assign a finite processing routine.'});
const natural=n=>Number.isSafeInteger(n)&&n>=0;
export function validateFurnace(a){
    if(!a||typeof a.assigned!=='boolean'||!(a.world===null||typeof a.world==='string')||!(a.anchor===null||natural(a.anchor))||!natural(a.bank)||!natural(a.spent)||!natural(a.remainder)||a.remainder>=FURNACE_DEFAULTS.realMsPerMinute||typeof a.stop!=='string'||(a.assigned&&(!a.world||a.anchor===null)))throw Error('Invalid Patient Furnace time record.');
    return a;
}
export function accrueFurnace(cheats,now){
    const next=structuredClone(cheats),a=next?.held?.['patient-furnace']?.card.state.away;
    if(!a)return next;validateFurnace(a);
    if(a.assigned&&now>=a.anchor){const elapsed=now-a.anchor+a.remainder;a.bank+=Math.floor(elapsed/FURNACE_DEFAULTS.realMsPerMinute);a.remainder=elapsed%FURNACE_DEFAULTS.realMsPerMinute;a.anchor=now;}
    validateFurnace(a);return next;
}
// Called inside the existing writer, before durability; no live mutation. Online
// native commits rebase the anchor, so reload cannot credit already played time.
export function rebaseFurnaceSave(save,now){
    const a=save.cheats?.held?.['patient-furnace']?.card.state.away;
    if(a?.assigned){validateFurnace(a);a.anchor=Math.max(a.anchor,now);}return save;
}
export function furnaceReason({harvest,world,reason,cheats}){
    const a=cheats?.held?.['patient-furnace']?.card.state.away;
    if(!a?.assigned)return 'Assign the current finite processing routine first.';
    if(a.world!==world)return 'The assigned routine remains in its original world. Assign a supported routine here to use retained time.';
    if(reason)return reason;
    if(!harvest?.auto||harvest.routine?.status!=='active')return 'The finite routine is paused or complete.';
    if(!harvest.job&&!Object.values(harvest.lots).some(rows=>rows.length))return 'The carcass stock ran out.';
    return a.bank<1?'No unused time is banked yet.':'';
}
export function stageFurnaceStep(plan,snapshot){
    const reason=furnaceReason(snapshot);if(reason)throw Error(reason);
    const consumed=plan.state.clock-snapshot.clock;
    if(consumed<=0||consumed>1)throw Error('The native clock stopped at a waiting choice or boundary.');
    const harvest=structuredClone(snapshot.harvest),cheats=structuredClone(snapshot.cheats),a=cheats.held['patient-furnace'].card.state.away;
    for(const result of advanceHarvest(harvest,consumed,{...snapshot.context,clock:snapshot.context.clock+consumed},{ready:true})){
        for(const o of result.outputs){applyGameplayEffect(plan.gameplay,{type:'item',key:o.item_key,amount:o.count},'player');(plan.acquisitions??=[]).push({owner:'player',key:o.item_key,count:o.count});}
        plan.gameplay.player.skills.Butchering.enabled=true;plan.unlocks=[...(plan.unlocks??[]),{kind:'skill',id:'Butchering'}];
        applyGameplayEffect(plan.gameplay,{type:'xp',skill:'Butchering',amount:snapshot.quoteXP?snapshot.quoteXP(result.xp):result.xp},'player');
    }
    a.bank-=consumed;a.spent+=consumed;a.stop=harvest.routine.status==='complete'?'The finite routine finished.':!harvest.job&&!Object.values(harvest.lots).some(r=>r.length)?'The carcass stock ran out.':a.bank?'Ready to spend retained time.':'The banked time was spent.';
    plan.nativePatch={...plan.nativePatch,harvest,cheats};return plan;
}
export function runPatientFurnace({read,advance,commit,note}){
    let spent=0;
    for(let i=0;i<FURNACE_DEFAULTS.batchMinutes;i++){
        const s=read(),reason=furnaceReason(s);if(reason){note(reason);break;}
        const plan=advance();if(plan.state.clock<=s.clock){note('The native clock stopped at a waiting choice or boundary.');break;}
        commit(stageFurnaceStep(plan,s));spent++;
    }
    return spent;
}
