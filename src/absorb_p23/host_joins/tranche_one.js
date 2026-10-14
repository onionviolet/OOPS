// P00 joins only: native clock, inventory, XP and save publisher remain owners.
import {validateExposure,stageExposure} from '../exposure/exposure.js';
import {planHousehold} from '../household/model.js';
import {preflightHouseholdImport} from '../household/host.js';
import {applyGameplayEffect} from '../../gameplay_transactions.js';

export function validateTrancheOneEnvelope(save) {
    const clock=save.expansion?.clock??0, sequence=save.expansion?.sequence??0;
    const exposure=validateExposure(save.p23_exposure);
    if(exposure && exposure.cursor!==clock) throw Error('Exposure must match the saved played clock.');
    preflightHouseholdImport(save.household,clock,sequence);
    return save;
}

export function stageExposureJoin(plan, raw, previousClock, context) {
    const end=plan.state.clock;
    if(end<=previousClock || (!raw && !(context.homeWorld&&context.needsFood&&context.pacing.hungerEnabled)))return;
    const result=stageExposure(raw,{start:previousClock,end},context);
    for(const [id,amount] of Object.entries(result.skillXp)) {
        // The feature already quantizes passive XP. Native publication computes
        // skill milestones once; never multiply this through the action caller.
        const skill=plan.gameplay.player.skills[id];
        if(!skill?.enabled)throw Error('Passive adaptation skill is unavailable.');
        skill.xp=Math.round((skill.xp+amount)*100)/100;
    }
    if(result.staminaCost)plan.native={...plan.native,
        staminaToFull:Math.min(context.maxStamina,(plan.native?.staminaToFull??context.staminaToFull)+result.staminaCost)};
    plan.nativePatch={...plan.nativePatch,p23_exposure:result.state};
    plan.p00Exposure=result.state;
}

export function stageHouseholdJoin(plan, raw, context, type='tick') {
    if(!raw&&type==='tick')return;
    const result=planHousehold(raw,{type,clock:context.clock,sequence:context.sequence+1,
        ...(type==='tick'?{elapsed:context.clock-raw.lastClock}:{})},context);
    for(const effect of result.effects)if(effect.type==='item') {
        context.assertDisposition(effect.key);
        applyGameplayEffect(plan.gameplay,{type:'item',key:effect.key,amount:Math.abs(effect.amount)},'player',effect.amount<0);
        if(effect.amount>0)(plan.acquisitions ||= []).push({owner:'player',key:effect.key,count:effect.amount});
    }
    plan.nativePatch={...plan.nativePatch,household:result.state};
    plan.p00Household=result;
    return result;
}
