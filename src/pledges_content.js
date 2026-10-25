// Original frontier content for the Pledges domain (vows, tempering trial, rune bench). Names, numbers and
// effect maps are proposals (WPR5): every dial carries its in-world reason and the cost is the rule, not a ban.
import {defineVowRules} from './vow_rules.js';
import {defineTrialRules} from './breakthrough_trial.js';
import {defineRuneGrammar} from './rune_grammar.js';
import {defineGate} from './progression_gates.js';

export const RATION = 'Stale bread', CARVING_WOOD = 'Rough wood log';
export const TALISMAN_MINUTES = 120;
export const ORDEAL_TERMS = Object.freeze({turns:12,composure:24,rationGuard:4,collapsePressure:2,gradePermille:5,
    reason:'The Village practice frame grows heavier each turn; twelve turns close its full weighted course.'});

export const ORDEAL_LOADS=Object.freeze([
    {label:'Standard frame',pressure:0,score:0,collapse:0},
    {label:'Raised load',pressure:2,score:1,collapse:1},
    {label:'Heavy load',pressure:4,score:2,collapse:2},
].map(Object.freeze));
// Tightening the rig's existing weight line makes each controlled step harder,
// and the resulting conditioning is earned only when that loaded attempt holds.
export const vowRules = defineVowRules({id: 'frontier.vows', revision: 1, maxKept: 2, vows: [
    {id: 'long-watch', text: 'Keep the dawn hour (06:00–07:00) awake each day.', track: 'body', bonus: 60, scar: 1, reason: 'Hard early hours harden the frame; sleeping through the watch breaks this vow.'},
    {id: 'plain-table', text: 'Eat only plain fare and refuse every feast.', track: 'step', bonus: 50, scar: 2, reason: 'A light belly keeps the feet quick.'},
    {id: 'open-hand', text: 'Do the work with your own hands; commission no paid help.', track: 'hand', bonus: 50, scar: 3, reason: 'Working without hired hands steadies your own.'},
]});
// Where each vow track lands on the hero. Multipliers only: they ride the shared stat buckets (aging_contact does the same).
export const TRACK_STATS = Object.freeze({body: 'strength', step: 'agility', hand: 'dexterity'});

// Tempering stages 1-3. The trial is one roll per attempt; rations laid in cut the risk but never to zero.
export const trialRules = defineTrialRules({id: 'frontier.tempering', revision: 1, baseRisk: {1: 300, 2: 450, 3: 600},
    floor: 50, perPressure: 40, perStability: 20, setback: 0, pressureOnFail: 2, pressureOnPass: -1, tribulationFrom: 2, tribulationWaves: 2,
    pay: {perUnit: 1, perUnitRisk: 60, maxUnits: 5, label: 'rations laid in'}});
export const STAGE_NAMES = Object.freeze(['Raw', 'Tempered', 'Hardened', 'Seasoned']);
export const STAGE_BONUS = 30; // permille per stage on strength and max health
export const DEMON_PENALTY = 20; // permille per pressure on strength and agility, floor 70%
export const temperingGate = defineGate({id: 'pledges.tempering', kind: 'capacity',
    reason: 'A body that has not been worked hard has nothing for the tempering to set.',
    requires: {any: [
        {fact: 'skill.combat', op: 'gte', value: {dial: 'need'}, hint: 'Your body has not been tested in fights yet.'},
        {fact: 'skill.equilibrium', op: 'gte', value: {dial: 'need'}, hint: 'Your footwork has not been drilled yet.'},
        {fact: 'skill.persistence', op: 'gte', value: {dial: 'need'}, hint: 'You have not yet kept at something hard.'}]},
    dials: {need: {default: 1}},
    routes: [{id: 'drill', reason: 'Drilling a technique or fighting trains a qualifying skill.', cost: 'Played time and risk.'}]});
export const stageNeed = tier => ({1: 1, 2: 3, 3: 6})[tier];

export const runeGrammar = defineRuneGrammar({id: 'frontier.runes', revision: 1, runes: ['ember', 'gale', 'root', 'tide'], maxLength: 4, perRuneCost: 1,
    pairs: [
        {a: 'ember', b: 'gale', effect: 'kindle', power: 6},
        {a: 'ember', b: 'root', ordered: true, effect: 'steady', power: 5},
        {a: 'root', b: 'ember', ordered: true, effect: 'fizzle', power: 3},
        {a: 'gale', b: 'tide', effect: 'swift', power: 5},
        {a: 'root', b: 'tide', effect: 'mend', power: 6},
    ],
    discord: {effect: 'fizzle', power: 2, reason: 'Runes the carver has not learned to pair pull against each other.'}});
// Effect to stat multiplier. fizzle is the price of a bad pairing: it dulls the feet while worn.
export const EFFECT_STATS = Object.freeze({kindle: ['max_stamina', 1], steady: ['strength', 1], swift: ['agility', 1], mend: ['max_health', 1], fizzle: ['agility', -1]});
export const EFFECT_TEXT = Object.freeze({kindle: 'more stamina', steady: 'more strength', swift: 'quicker feet', mend: 'more health', fizzle: 'clumsy feet'});
