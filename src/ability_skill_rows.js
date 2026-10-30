// Path-neutral feeds for the abilities views (ABILITIES.md Round 5): any world's ladder, whether a potion-style pathway, a realm
// track or a spell school, hands these functions its typed ability records (defineAbilityRecords().cards) and gets what the ladder
// figure and the Skills and techniques tab read. Nothing here names a world or a path; the host decides which ladder is the character's.
import {learnView} from './ability_records.js';
import {skillsTabRows} from './read_models/learn_tab_bridge.js';

const asList = cards => Array.isArray(cards) ? cards : Object.values(cards ?? {});

/** The ability cards of the rung at `position` and the one above it, from an advanceLadders-shaped result {path, rungs: {stageId: {abilities: {cards}}}}. */
export function rungCards(adv, position) {
    const cards = i => asList(adv?.rungs?.[adv?.path?.stages?.[i]?.id]?.abilities?.cards);
    return {here: cards(position), next: cards(position + 1)};
}

/**
 * Rows for the Skills and techniques tab from any set of ability cards. A card is heard of only when its held source is in `held`
 * (or its id is in `known`): never every card in a pack, so a later rung's techniques stay unseen (ABR19).
 * facts: the engine fact map; understood: ids whose thresholds the seat understands; labelOf: id to words (default the card's label).
 */
export function skillRows(cards, {facts = {}, held = [], known, understood, labelOf} = {}) {
    const list = asList(cards).filter(c => c.learn);
    const heard = known ?? new Set(list.filter(c => held.includes(c.sourceId)).map(c => c.id));
    return skillsTabRows(list.map(c => learnView(c, {facts})), {labelOf: labelOf ?? (id => list.find(c => c.id === id)?.label), known: heard, understood});
}
