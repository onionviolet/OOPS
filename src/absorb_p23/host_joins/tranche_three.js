import {validateReadingState} from '../reading/runtime.js';
import {ANTHOLOGY,ANTHOLOGY_KEY} from '../reading/content.js';
import {loadSalvage} from '../salvage/salvage.js';
import {applyGameplayEffect} from '../../gameplay_transactions.js';
import {validateTrancheTwoEnvelope} from './tranche_two.js';

export function validateTrancheThreeEnvelope(save) {
    if(save.expansion?.p23Reading!==undefined) validateReadingState(save.expansion.p23Reading,save.expansion.clock);
    if(Object.hasOwn(save,'p23_salvage')) {
        const state=loadSalvage(save.p23_salvage);
        if(Object.values(state.receipts).some(r=>r.at>save.expansion?.clock||r.sequence>save.expansion?.sequence))throw Error('Salvage receipt exceeds its native clock or sequence.');
        // Reuse the native physical-copy check without enrolling living gear.
        validateTrancheTwoEnvelope({...save,p23_living_gear:save.p23_living_gear??{schema:1,lastKill:0,copies:{}}});
    }
    const read=save.expansion?.p23Reading;
    if(read?.receipts.some(r=>r.kind==='read') && save.books?.[ANTHOLOGY]?.accumulated_time!==12)throw Error('Settled anthology needs its finished native book.');
}

export function stageReadingResult(plan,result,{books,requiredTime=12,quoteXP=(_skill,amount)=>amount}) {
    if(result.state===undefined)return plan;
    plan.state.p23Reading=result.state;
    for(const effect of result.effects) {
        if(effect.type==='consume')applyGameplayEffect(plan.gameplay,{type:'item',key:effect.key,amount:effect.count},'player',true);
        else if(effect.type==='skillXp'){
            const amount=quoteXP(effect.skill,effect.amount);
            if(!Number.isFinite(amount)||amount<0)throw Error('Invalid native reading XP quote.');
            if(amount)applyGameplayEffect(plan.gameplay,{type:'xp',skill:effect.skill,amount},'player');
        }
        else if(effect.type==='finishOwnedBook') {
            if(effect.key!==ANTHOLOGY_KEY)throw Error('Unknown reading settlement book.');
            plan.nativePatch={...plan.nativePatch,books:{...structuredClone(books),[ANTHOLOGY]:{accumulated_time:requiredTime}}};
            plan.p00FinishedAnthology=true;
        } else if(effect.type==='story') (plan.p00ReadingNotices ||= []).push(effect.text);
        else throw Error('Unsupported reading settlement.');
    }
    return plan;
}
