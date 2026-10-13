import {createHeirChronicle,validateChronicle} from './chronicle.js';
import {createExpansionState} from './expansion_engine.js';
import {initializeExpedition} from './expedition_content.js';
import {appendLifeMilestone,lifeCalendarMinute,createLifeRecord} from './life_record.js';
import {applyHeirLeftovers,deriveHeirLeftovers,validateHeirLeftovers} from './heir_inheritance.js';

// The host supplies a pristine new-game envelope, never an existing player's body.
// No storage mutation here: caller validates and durably writes before reload.
// leftovers: counted from the ended life (deriveHeirLeftovers); without them the
// saved envelope is counted with no worn gear.
export function buildLifeHeirSave(previous, fresh, leftovers = deriveHeirLeftovers(previous)) {
    const c=previous.expansion?.chronicle;
    if(!c||c.life.endedAt===null)throw new Error('This life has not ended.');
    validateChronicle(c,previous.expansion.clock);
    validateHeirLeftovers(leftovers);
    if(!fresh?.character||!fresh.levels||fresh.expansion?.chronicle)throw new Error('A fresh beginning is needed.');
    const next=structuredClone(fresh),calendar=structuredClone(previous['current time']);
    delete next.life_successor_requested;
    next['current time']=calendar;
    next.expansion=initializeExpedition(createExpansionState(previous.expansion.rng));
    next.expansion.chronicle=createHeirChronicle(c,0,calendar,previous.character.name,leftovers);
    next.character.name='The heir';
    applyHeirLeftovers(next,leftovers);
    if(previous.npc_lives != null)next.npc_lives=structuredClone(previous.npc_lives);
    if(previous.options != null)next.options=structuredClone(previous.options);
    next.life_record=structuredClone(previous.life_record ?? createLifeRecord());
    const grave=next.expansion.chronicle.life.experience.inheritedFrom;
    if(next.life_record)next.life_record=appendLifeMilestone(next.life_record,{year:calendar.year,at:lifeCalendarMinute(calendar),worldId:'base.frontier',kind:'legacy',text:`${grave.name} rests beneath a quiet stone. ${grave.epitaph}`.slice(0,240)});
    return next;
}
