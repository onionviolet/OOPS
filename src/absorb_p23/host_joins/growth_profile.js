import {check, natural, object} from '../../basics.js';
import {PROFILE,validateGrowthState,growthBonuses,beginAward} from '../growth_profile/profile.js';

export const GROWTH_COUNTER_ID = 'p23.study.tonic_counter';
export const GROWTH_COUNTER_TEMPLATE = 'P23 study tonics';
export const GROWTH_TONIC_KEY = JSON.stringify({id:PROFILE.tonicId});
export const GROWTH_LESSON_ID = 'proto23.instruction_study_conditioning';
export const GROWTH_KNOWLEDGE_ID = 'proto23.study_conditioning';
export function growthLearned(state) {
    const record=state.simulation?.knowledge?.player?.[GROWTH_KNOWLEDGE_ID];
    return state.actors?.player?.completed?.[GROWTH_LESSON_ID]===1 &&
        record?.stage==='understood'&&record.basis?.kind==='instruction'&&record.basis.attributedTo==='proto23.handling_tutor';
}
// Proposal balance. Only observed positive native XP grants after enrollment
// contribute. Integer hundredths preserve the native XP precision without any
// backfill from restored totals. This is independent of strict profile schema 1.
export const GROWTH_EARNED_DOMAIN='p23_growth_earned';
export const GROWTH_EARNED_THRESHOLD=150000;
const THRESHOLD_UNITS=GROWTH_EARNED_THRESHOLD*100;
export function validateGrowthEarned(counter) {
    if(counter===undefined)return undefined;
    check(object(counter)&&Object.keys(counter).length===7&&['schema','profileId','bodyId','earnedUnits','awardedUnits','lastSequence','awardSequence'].every(k=>Object.hasOwn(counter,k)),'Invalid earned skill XP counter fields.');
    check(counter.schema===1&&counter.profileId===PROFILE.id&&counter.bodyId==='native.player.body','Unsupported earned skill XP identity.');
    check(natural(counter.earnedUnits)&&natural(counter.awardedUnits)&&counter.awardedUnits<=counter.earnedUnits&&counter.awardedUnits%THRESHOLD_UNITS===0&&natural(counter.lastSequence)&&
        (counter.awardSequence===null||natural(counter.awardSequence)&&counter.awardSequence>0&&counter.awardSequence<=counter.lastSequence&&counter.earnedUnits>=THRESHOLD_UNITS),'Invalid earned skill XP receipt.');
    return counter;
}
export function readNativeSkillXP(progress) {
    return Object.fromEntries(Object.entries(progress).map(([id,p])=>[id,p.total_xp||0]));
}
// Both native direct grants and prepared transaction publication supply actual
// native before/after totals. No requested amount, fixture or rendered total is
// an earned receipt. Parent skill grants are counted once in the same snapshot.
export function earnedNativeSkillDelta(before,after) {
    let units=0;
    for(const [id,total] of Object.entries(after)) {
        const old=before[id]||0;
        check(Number.isFinite(total)&&total>=0&&Number.isFinite(old)&&old>=0,'Invalid native skill XP totals.');
        const delta=Math.round((total-old)*100);
        if(delta>0){units+=delta;check(natural(units),'Earned skill XP exceeds finite storage.');}
    }
    return units;
}
export function observeGrowthEarned(counter,profile,context,{before,after,sequence}) {
    validateGrowthEarned(counter);validateGrowthState(profile);
    const units=earnedNativeSkillDelta(before,after);
    if(!profile||!units||context.worldId!==PROFILE.worldId||context.profileId!==PROFILE.id||context.bodyId!==profile.bodyId||!context.bodySupported||!context.nativeAlive||!context.ownsSave||context.saveBlocked||!context.nativeEligible||!context.known)return {counter,profile,counted:false};
    check(natural(sequence)&&sequence>0,'Earned skill XP needs its native saved event sequence.');
    if(counter&&sequence<=counter.lastSequence)return {counter,profile,counted:false};
    const next=counter?structuredClone(counter):{schema:1,profileId:PROFILE.id,bodyId:profile.bodyId,earnedUnits:0,awardedUnits:0,lastSequence:0,awardSequence:null};
    next.earnedUnits+=units;check(natural(next.earnedUnits),'Earned skill XP exceeds finite storage.');next.lastSequence=sequence;
    let nextProfile=profile;
    if(next.earnedUnits-next.awardedUnits>=THRESHOLD_UNITS&&!profile.award?.remaining) {
        nextProfile=beginAward(profile,context,{sequence,amount:GROWTH_EARNED_THRESHOLD}).next;
        next.awardSequence=sequence;next.awardedUnits+=THRESHOLD_UNITS;
    }
    validateGrowthEarned(next);
    return {counter:next,profile:nextProfile,counted:true};
}
// If the threshold coincided with another pending award, its earned receipt is
// retained; after that award settles, this explicit step freezes the reward.
export function freezeEarnedGrowth(counter,profile,context,sequence) {
    validateGrowthEarned(counter);
    if(!counter||counter.earnedUnits-counter.awardedUnits<THRESHOLD_UNITS||profile.award?.remaining)return {counter,profile};
    const next=structuredClone(counter);
    next.lastSequence=sequence;next.awardSequence=sequence;next.awardedUnits+=THRESHOLD_UNITS;
    return {counter:validateGrowthEarned(next),profile:beginAward(profile,context,{sequence,amount:GROWTH_EARNED_THRESHOLD}).next};
}
// No initializer: absent old envelopes remain absent. The new counter has its
// own native owner, never another SKU in the exact conserved Proto23 shop bag.
export function validateGrowthEnvelope(save) {
    const profile=validateGrowthState(save.p23_growth_profile),counter=validateGrowthEarned(save.p23_growth_earned),state=save.expansion;
    if(counter){check(profile&&counter.bodyId===profile.bodyId&&natural(state?.sequence)&&counter.lastSequence<=state.sequence,'Earned skill XP exceeds its enrolled native save.');
        if(counter.awardSequence!==null)check(profile.award&&profile.award.sequence>=counter.awardSequence,'Earned skill XP award receipt is missing.');
        if(profile.award?.amount===GROWTH_EARNED_THRESHOLD)check(counter.awardSequence===profile.award.sequence,'Large study award needs its genuinely earned native counter receipt.');}
    if(profile?.award?.amount===GROWTH_EARNED_THRESHOLD)check(counter?.awardSequence===profile.award.sequence,'Large study award needs its genuinely earned native counter receipt.');
    const stock=save.inventories?.trader?.[GROWTH_COUNTER_ID];
    if(stock!==undefined) {
        check(object(stock)&&Object.keys(stock).every(k=>k===GROWTH_TONIC_KEY),'Unsupported study counter stock.');
        for(const entry of Object.values(stock))check(object(entry)&&Object.keys(entry).length===1&&Object.hasOwn(entry,'count')&&natural(entry.count)&&entry.count>0&&entry.count<=4,'Invalid study counter stock count.');
    }
    const refresh=save.npcs?.[GROWTH_COUNTER_ID]?.trader?.last_refresh;
    if(refresh!==undefined)check(Number.isSafeInteger(refresh)&&refresh>=-1,'Invalid study counter native refresh.');
    if(profile===undefined){check(!stock||Object.keys(stock).length===0,'An absent profile cannot have study counter stock.');return;}
    check(state?.proto23Village?.schema===1&&growthLearned(state),'Study conditioning needs its actually completed distinct tutor lesson.');
    check(profile.bodyId==='native.player.body','Study conditioning needs its actual enrolled native player body.');
    check(natural(state.clock)&&profile.background.lastClock<=state.clock,'Study conditioning exceeds its played clock.');
    check(natural(state.sequence)&&(!profile.award||profile.award.sequence<=state.sequence)&&(!profile.tonicEvent||profile.tonicEvent.sequence<=state.sequence),'Study receipt exceeds its native sequence.');
    check(object(stock)&&Number.isSafeInteger(refresh),'Enrolled study counter needs its registered native inventory and refresh owner.');
}
export function growthFlatSource(profile,context) {
    return Object.fromEntries(Object.entries(growthBonuses(profile,context).stats).map(([key,value])=>[key,value.flat]));
}
// Native recomputation ordinarily preserves missing vitals and thus fills a
// max-vital increase. Preserve absolute amounts for this source transition.
export function noHealGrowthVitals(previous,next,stats,native={}) {
    const out={...native};
    for(const [vital,offset] of [['health','hpToFull'],['stamina','staminaToFull']]) {
        const maximum=`max_${vital}`,delta=((next[maximum]||0)-(previous[maximum]||0))*(stats.total_multiplier[maximum]||1);
        if(!delta)continue;
        const oldMaximum=stats.full[maximum],nextMaximum=oldMaximum+delta;
        const current=oldMaximum-(native[offset]??oldMaximum-stats.full[vital]);
        check([oldMaximum,nextMaximum,current].every(Number.isFinite)&&nextMaximum>=0,'Invalid projected growth vitals.');
        out[offset]=nextMaximum-Math.max(0,Math.min(nextMaximum,current));
    }
    // The native publisher requires this field whenever any vital is staged.
    if(Object.keys(out).length)out.staminaToFull??=Math.max(0,stats.full.max_stamina-stats.full.stamina);
    return out;
}
