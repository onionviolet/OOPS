// Procedural relic bestowal (G6, GR draw identity). A relic is an item's earned quality: a tier, a
// few affixes drawn from the existing affix table, and an epithet clause. Pure: the caller injects
// `random` (a seeded cursor in the game, a list in tests). Rolls resolve once when the player names
// the item and are saved with that record, never redrawn on load.
//
// Defaults, dials and reasons: tiers unlock by how much the item has been used (`uses`), because an
// item that has done more has more story to bestow. A world can change the thresholds, or replace
// the whole table, with an in-world reason. Only armor has affix records today; other gear gets
// the name and a description clause but no stat (a known gap, not a rule).
import {createAffixes, normalizeAffixes, getAffix} from './gear_affixes.js';
import {hashStreamSeed, xorshift32} from './hash_rng.js';

export const RELIC_TIERS = Object.freeze([
    {id: 'named', label: 'Named', rarity: 'common', minUses: 0, text: 'It has a name now, and has not yet earned more.'},
    {id: 'storied', label: 'Storied', rarity: 'uncommon', minUses: 50, text: 'Enough use has left a mark on it.'},
    {id: 'relic', label: 'Relic', rarity: 'rare', minUses: 250, text: 'People would recognise it by its name.'},
    {id: 'legend', label: 'Legend', rarity: 'epic', minUses: 1000, text: 'Its name is told apart from its maker.'},
]);
export const WORLD_RELIC_TIERS = Object.freeze({'base.frontier': RELIC_TIERS});

export const tierFor = (uses, tiers = RELIC_TIERS) => [...tiers].reverse().find(t => uses >= t.minUses) || tiers[0];

// A deterministic [0,1) cursor from one saved seed. One draw per call, fixed order.
export function seededRandom(seed) {
    let n = hashStreamSeed(seed >>> 0, 'relic') || 1;
    return () => { n = xorshift32(n); return n / 0x100000000; };
}

export function generateRelic({random, uses = 0, gearClass = 'armor', parts = null, name, tiers = RELIC_TIERS}) {
    if (typeof random !== 'function') throw Error('A relic needs an injected random source.');
    const tier = tierFor(Math.max(0, uses), tiers);
    const affixes = gearClass === 'armor' && tier.id !== 'named' ? createAffixes({parts, rarity: tier.rarity, random, gearClass}) : [];
    const effects = affixes.map(a => `${getAffix(a.id).name} (${a.v})`);
    const clauses = [{kind: 'relic', source: 'bestow', text: `${name ? `${name}: ` : ''}${tier.label}. ${tier.text}${effects.length ? ` It carries ${effects.join(', ')}` : ''}`}];
    return {tier: tier.id, affixes: normalizeAffixes(affixes, gearClass), clauses};
}
