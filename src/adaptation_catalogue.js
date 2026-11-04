// Calibration adapters for the adaptation seam (src/adaptation_ledger.js). Each states
// where its numbers come from; numbers the source does not give are listed in `unstated`
// and set as proposal dials (AD49: the lore's stated numbers are fixed points).
// Keys are generic phenomenon families, not canon technique names.
import {defineAdapter} from './adaptation_ledger.js';

// The adaptive wheel, calibrated to the JJK fan wiki page on the Ten Shadows' divine general
// (revision 79200, 2026-02-15, secondary source; paraphrase in docs/emergent/E8E_ADAPTATION.md).
// Stated: analysis begins on the first hit and a wheel turn completes it; a repeat hit speeds
// the analysis; a simple cut is countered after one turn while an infinity barrier took five;
// a turn heals earlier wounds; after adapting it can see a hidden attack; analysis continues
// past adaptation and one further turn gave it a cut that bypassed the barrier; a tamer can wear
// the wheel and bear the exposure; the wheel paused while its bearer amplified; adapting to a
// pull left it unable to use that pull. Counter stated: a different attack.
// Battle pages from the held dump (Sukuna vs. Mahoraga r76453, Satoru Gojo vs. Sukuna r78092,
// Ten Shadows Technique r79547) add: adaptation is gradual, not binary (a hit landed mid-process
// did reduced damage); the barrier and the pull finished on the same fifth turn (two slots);
// the five turns are stated twice against one character's in-fight estimate of four.
// Not modelled yet: while bearing the wheel the bearer could use no other technique.
export const ADAPTIVE_WHEEL = defineAdapter({
    id: 'adaptive_wheel', revision: 1, trigger: 'clock', depth: 2, spill: 250,
    turnTime: 60, speedup: 250, slots: 2, defaultNeeded: 1, needed: {'space.infinity': 5},
    ceiling: 1000, heal: true, sees: true, answerTurns: 1, indiscriminate: true, decay: null,
    source: 'jjk-wiki:r79200,r76453,r78092,r79547',
    unstated: ['turnTime (seconds of analysis per turn)', 'speedup per repeat hit', 'spill to related phenomena (a character believed it would cover all slashing; dial)', 'decay after the fight'],
    reason: 'Summoned general that learns any phenomenon at the family-and-method grain; burst, novelty, a different attack or breaking the wheel answer it.',
});

// Body tolerance (mithridatism): a non-JJK second case (AD51) from the E8E body row. No source
// numbers; every value is a proposal. Steps on rest, stops at resistant, fades without dosing,
// and the same tolerance blunts a drug's helpful use.
export const BODY_TOLERANCE = defineAdapter({
    id: 'body_tolerance', revision: 1, trigger: 'rest', depth: 2, spill: 0,
    defaultNeeded: 4, ceiling: 600, heal: false, sees: false, answerTurns: null, indiscriminate: true,
    decay: {every: 7 * 1440, amount: 1000},
    source: 'design:E8E body row',
    unstated: ['rests per step', 'resistance ceiling', 'weekly fade'],
    reason: 'A body dosed and rested grows resistant to that substance, loses it without dosing, and finds the same substance weaker as medicine.',
});

export const ADAPTERS = Object.freeze({[ADAPTIVE_WHEEL.id]: ADAPTIVE_WHEEL, [BODY_TOLERANCE.id]: BODY_TOLERANCE});
