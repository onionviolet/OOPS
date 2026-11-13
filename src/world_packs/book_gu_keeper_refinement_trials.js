import {guRefinementTrial} from '../gu_refinement_trial_host.js';

export const keeperStealth = 'book.ri.keeper.stealth_fusion';
export const keeperScaleArmor = 'book.ri.keeper.scale_armor';
export const stoneHollow = `${keeperStealth}.hollow`;
export const farScreen = `${keeperStealth}.screen`;
export const farStoneRun = `${keeperScaleArmor}.far_run`;
// Authored: local settling times and the practice stone's impact.
export const cloakSettleMinutes = 15;
export const armorSettleMinutes = 20;
export const stoneImpact = 3;
const sight = {sight: {reach: 1}, scent: {reach: 0}};
const hound = {sight: {reach: 1}, scent: {reach: 1}};
const cloakProbe = {senses: sight, expect: null};
export const stealthTrial = Object.freeze({
    id: keeperStealth, world: 'book.ri.keeper.world', key: `${keeperStealth}.work`,
    place: 'book.ri.keeper.hosted_wolf.glade', attemptPrefix: 'stealth-cloak',
    initial: {testedRock: false, testedScales: false, crossed: false},
    specimens: {
        rock: {id: `${keeperStealth}.rock`, kind: 'stealth-rock', rank: 1, max: 1},
        fish: {id: `${keeperStealth}.fish`, kind: 'fish-scale', rank: 1, max: 2, repeated: true},
        cloak: {id: `${keeperStealth}.scales`, kind: 'stealth-scales', rank: 2},
        armor: {id: `${keeperScaleArmor}.armor`, kind: 'scale-armor', rank: 2},
    },
    branches: {
        cloak: {output: 'cloak', kind: 'stealth-scales', minutes: cloakSettleMinutes,
            ingredients: {scales: 'fish', rock: 'rock'}, prepare: 'prepare_cloak', finish: 'finish_cloak', cancel: 'cancel_cloak'},
        armor: {output: 'armor', kind: 'scale-armor', minutes: armorSettleMinutes,
            ingredients: {scales: 'fish'}, prepare: 'prepare_armor', finish: 'finish_armor', cancel: 'cancel_armor'},
    },
    operations: {
        take_rock: {type: 'acquire', slot: 'rock', once: true, place: stoneHollow},
        bind_rock: {type: 'record', slot: 'rock', once: true},
        buy_fish: {type: 'acquire', slot: 'fish', absent: ['fish'], unlessAll: ['cloak', 'armor']},
        trade_fish: {type: 'acquire', slot: 'fish', absent: ['fish'], unlessAll: ['cloak', 'armor']},
        test_rock: {type: 'probe', slot: 'rock', uncommitted: true, persistAfterConsumption: true, requires: {bind_rock: 1}, flag: 'testedRock', reserve: 1,
            probes: [{senses: sight, expect: {channel: 'sight', surfaces: ['clothing']}}]},
        prepare_cloak: {type: 'begin', branch: 'cloak', requires: {bind_rock: 1}},
        finish_cloak: {type: 'finish', branch: 'cloak'}, cancel_cloak: {type: 'cancel', branch: 'cloak'},
        test_scales: {type: 'probe', slot: 'cloak', flag: 'testedScales', reserve: 2,
            probes: [cloakProbe, {senses: hound, expect: {channel: 'scent'}}]},
        cross_screen: {type: 'probe', slot: 'cloak', flag: 'crossed', reserve: 2, probes: [cloakProbe]},
        prepare_armor: {type: 'begin', branch: 'armor', pack: keeperScaleArmor},
        finish_armor: {type: 'finish', branch: 'armor', pack: keeperScaleArmor},
        cancel_armor: {type: 'cancel', branch: 'armor', pack: keeperScaleArmor},
        guard_run: {type: 'guard', slot: 'armor', pack: keeperScaleArmor,
            flag: 'armorGuarded', reserve: 2, effect: 'impact-guard', minimum: stoneImpact},
    },
    supply: {pool: 'essence', rank: 1, source: 'aperture'},
    view: {held: {rock: 'rock', fish: 'fish', cloak: 'cloak', armor: 'armor'},
        counted: {controlled: 'bind_rock'}, branch: {armorJob: 'armor'},
        flags: ['testedRock', 'testedScales', 'crossed'], booleanFlags: ['armorGuarded']},
});
export const stealthOperations = Object.entries(stealthTrial.operations).filter(([, op]) => !op.pack).map(([name]) => name);
export const scaleArmorOperations = Object.entries(stealthTrial.operations).filter(([, op]) => op.pack === keeperScaleArmor).map(([name]) => name);
export const {pack: stealthEffectPack, place: stealthPlace, facts: stealthFacts, view: stealthView,
    validate: validateStealth, apply: applyStealth, specimen} = guRefinementTrial(stealthTrial);
export const controlledStealthScales = state => specimen(state, 'cloak');
export const controlledScaleArmor = state => specimen(state, 'armor');
