// What an observer can see of a person on sight: the worn slots (a coat, a weapon at the hip). Not the pack, not the facts a person holds (KNW6, KNW22).
// World-neutral leaf. A fight, a stop or a gate writes `person.<id>.look` into the observer's own knowledge (what he believes he saw);
// a law reader later compares that belief with the look in front of it, so a changed outfit is a changed look (AD38, STN19). No state, no save key.
export const LOOK_FACET = 'look', SIGHT_FACET = 'fight_seen';
export const LOOK_KEY = `person.player.${LOOK_FACET}`, SIGHT_KEY = `person.player.${SIGHT_FACET}`;
const PLAIN = 'plain clothes';
/** Slot maps ({slot: itemKey}) -> one stable signature of everything worn; empty means plain clothes. */
export const lookOf = (...slotMaps) => [...new Set(slotMaps.flatMap(m => Object.values(m || {})).filter(k => typeof k === 'string' && k))].sort().join('|') || PLAIN;
/** The worn weapon slot is visible; it is what "armed openly" means. */
export const armedOpenly = (...slotMaps) => slotMaps.some(m => typeof m?.weapon === 'string' && m.weapon);
