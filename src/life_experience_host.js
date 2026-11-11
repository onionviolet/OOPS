import {createHeirChronicle,validateChronicle} from './chronicle.js';
import {createExpansionState} from './expansion_engine.js';
import {initializeExpedition} from './expedition_content.js';
import {appendLifeMilestone,lifeCalendarMinute,createLifeRecord} from './life_record.js';
import {applyHeirLeftovers,deriveHeirLeftovers,validateHeirLeftovers} from './heir_inheritance.js';
import {carryCheats} from './cheat_cards.js';
import {lifeGrave} from './life_experience.js';

// Save slices that cross whole to the next seat; every other slice of the ended life stays with it,
// and the carry list names them (PX73: loss you can see). One list for the copy and the preview.
export const CARRIED_SAVE_KEYS = Object.freeze(['npc_lives', 'options', 'inheritance_law', 'discovery_codex', 'cheats', 'life_record']);
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
    next.character.name=leftovers.recipient==='ward'&&leftovers.ward?.name?leftovers.ward.name:leftovers.recipient==='stranger'?'The newcomer':'The heir';
    applyHeirLeftovers(next,leftovers);
    for(const key of ['npc_lives','options','inheritance_law','discovery_codex'])if(previous[key] != null)next[key]=structuredClone(previous[key]);
    next.cheats=carryCheats(previous.cheats, fresh.cheats, {heir:true});
    if(next.cheats.held['heirloom-compact']&&leftovers.compact)next.cheats.held['heirloom-compact'].card.state.receipt=structuredClone(leftovers.compact);
    next.life_record=structuredClone(previous.life_record ?? createLifeRecord());
    const grave=next.expansion.chronicle.life.experience.inheritedFrom??lifeGrave(c,previous.character.name);
    const ending=grave.ended==='retired'?`${grave.name} stepped aside from the road`:`${grave.name} rests beneath a quiet stone`;
    const seat=({apprentice:'The apprentice takes up the road.',ward:`${leftovers.ward?.name||'The ward'} takes up the road.`,stranger:'A newcomer with no claim takes up the road.'})[leftovers.recipient]||'Their next of kin takes up the road.';
    if(next.life_record)next.life_record=appendLifeMilestone(next.life_record,{year:calendar.year,at:lifeCalendarMinute(calendar),worldId:'base.frontier',kind:'legacy',text:`${ending}. ${grave.epitaph} ${seat}`.slice(0,240)});
    return next;
}
