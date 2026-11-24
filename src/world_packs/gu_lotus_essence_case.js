// Heavenly Essence Treasure Monarch Lotus: one coverage case for a Gu the chapters state does one thing, produce
// primeval essence (atlas pilot B3, AD32 proposal). The case reuses the Gu effect grammar and the shared W law; it adds no rule.
//
// Sources (local text, locators only): ri:ch463:p2 states the effect for the Lotus series ("could produce primeval essence,
// giving an enormous help in a Gu Master's primeval essence recovery"); ri:ch308:p82, ri:ch558:p9 and ri:ch2235:p2 state rank four.
// Open, so authored calibration: the amount produced and which of the user's essence pools it refills. The chapters name the
// account (primeval essence) and nothing finer; the case refills the user's own pool, keyed like the aperture pack's
// (`primeval.rank<N>.<stage>`, src/gu_aperture.js aperturePool), the way the Liquor Worm scenes key theirs.
// The wiki-tier label guessed `heal`; the sentence is essence, not vitality, so the guess is not used (see the test's near miss).
import {WORLD_QUANTITIES} from '../world_quantities.js';

export const LOTUS_CASE_ID = 'fandom:Heavenly_Essence_Treasure_Monarch_Lotus';
export const LOTUS_CASE_MODULE = 'src/world_packs/gu_lotus_essence_case.js';
export const LOTUS_SOURCES = Object.freeze({effect: 'ri:ch463:p2', rank: Object.freeze(['ri:ch308:p82', 'ri:ch558:p9', 'ri:ch2235:p2'])});
export const LOTUS_RANK = 4;
export const LOTUS_AMOUNT = 40; // game units; the chapters give no number (authored calibration)

// The sentence in the Gu grammar: add essence to the user, paid in primeval essence (rank under six).
export const LOTUS_SENTENCE = Object.freeze({verb: 'add', object: 'essence', target: 'self', time: 'instant',
    carrier: 'gu', cost: 'essence-primeval', limits: Object.freeze([])});

/** What landing the Lotus asks of the world for one user: the sentence, the details and the pool key it refills. */
export const lotusLanding = (holder, pool) => ({sentence: structuredClone(LOTUS_SENTENCE),
    details: {target: {shape: 'holder', id: holder}, amount: LOTUS_AMOUNT}, keys: {essence: pool.replace(/^energy:/, '')}});

const POOL = 'energy:primeval.rank4.initial';
const ENGINE = {packs: ['w.sky'], shared: {quantities: [WORLD_QUANTITIES.energy]}};

export function coverageCase(id) {
    if (id !== LOTUS_CASE_ID) throw Error(`gu_lotus_essence_case: ${id} has no coverage scene`);
    return {basis: 'authored',
        world: {clock: 0, holders: [{id: 'seat', kind: 'place'}, {id: 'gu-master', kind: 'body', place: 'seat', quantities: {[POOL]: 10}}]},
        ...lotusLanding('gu-master', POOL),
        expect: [{holder: 'gu-master', quantity: POOL, direction: 'up', amount: LOTUS_AMOUNT}],
        engine: structuredClone(ENGINE)};
}
