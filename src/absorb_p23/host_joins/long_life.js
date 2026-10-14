import {normalizeTitles,grantEarnedTitles,titleCalendarMinute} from '../../titles.js';
import {validateWornTitle} from '../long_life/worn.js';

export function validateLongLifeEnvelope(save) {
    if(Object.hasOwn(save.character || {},'long_life_worn'))validateWornTitle(save.character.long_life_worn,normalizeTitles(save.character.titles));
}
// Counter owners remain native. Recognition shares their durable boundary.
export function stageTitleRecognition(plan,{titles,counters,calendar,anthologyFinished=false}) {
    const next=normalizeTitles(structuredClone(titles));
    const local=plan.localLifeResult?.state;
    const earned=grantEarnedTitles(next,{...counters,...(local?{home_minutes:local.homeMinutes,items_bought:local.itemsBought}:{}),money:plan.external.money,
        ...(plan.nativePatch?.total_crafting_successes!==undefined?{crafts:plan.nativePatch.total_crafting_successes}:{}),
        ...(plan.p00FinishedAnthology && !anthologyFinished?{books:counters.books+1}:{})},titleCalendarMinute(plan.calendar || calendar));
    if(earned.length){plan.nativePatch={...plan.nativePatch,'character/titles':next};plan.p00EarnedTitles=earned;}
    return plan;
}
