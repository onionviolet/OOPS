// Calibration content for the affliction and corrosion seams (proposals,
// 2026-11-03). Paraphrased mechanics with attribution; no world enrols these
// until a consumer chooses them. Effects are names the consumer maps.
import {defineAffliction, DAY, WEEK} from './affliction_track.js';
import {defineCorrodingProperty} from './material_corrosion.js';

// Tetanus, Pathfinder 2e GM Core (ORC): disease 1, Fortitude DC 14, onset
// 10 days; stiffness, then a locked jaw, then spasms, then death.
export const TETANUS = defineAffliction({id: 'tetanus', label: 'Tetanus', kind: 'disease', dc: 14, onset: 10 * DAY,
    routes: [{wound: {kinds: ['puncture', 'deep cut'], minDepth: 2}, carriedBy: 'soil'}],
    source: 'Pathfinder 2e GM Core, Tetanus (ORC)',
    stages: [
        {duration: WEEK, effects: [{condition: 'clumsy', value: 1}], text: 'Stiff muscles make fine work clumsy.'},
        {duration: DAY, effects: [{condition: 'clumsy', value: 2}, {condition: 'mute'}], text: 'The jaw locks; speech fails.'},
        {duration: DAY, effects: [{condition: 'paralyzed'}, {condition: 'spasms'}], text: 'Spasms strong enough to break bone.'},
        {terminal: true, effects: [{condition: 'dying'}], text: 'Death, unless something that works reaches the body first.'},
    ]});

// Original: an ordinary festering wound, and a strain that shrugs off the
// common antiseptic. The joke weapon ("one MRSA dagger") is just a filthy
// blade carrying the resistant strain; its edge is ordinary.
export const FESTERING_WOUND = defineAffliction({id: 'festering_wound', label: 'Festering wound', kind: 'infection', dc: 12, onset: DAY,
    routes: [{wound: {minDepth: 1}, carriedBy: 'filth'}], source: 'original',
    stages: [
        {duration: 2 * DAY, effects: [{condition: 'enfeebled', value: 1}], text: 'Hot, swollen and sore.'},
        {duration: 2 * DAY, effects: [{condition: 'enfeebled', value: 2}, {condition: 'fever'}], text: 'Fever and spreading redness.'},
        {duration: DAY, effects: [{condition: 'drained', value: 1}, {condition: 'fever'}], text: 'Blood poisoning sets in.'},
        {terminal: true, effects: [{condition: 'dying'}], text: 'Sepsis.'},
    ]});
export const RESISTANT_FESTERING_WOUND = defineAffliction({...FESTERING_WOUND, id: 'resistant_festering_wound',
    label: 'Resistant festering wound', dc: 15, virulent: true, resists: ['common_antiseptic'],
    routes: [{wound: {minDepth: 1}, carriedBy: 'resistant strain'}],
    stages: FESTERING_WOUND.stages.map(s => ({...s}))});

// Arsenic, Pathfinder 1e poison (OGL), on the frequency dial (PFA2) with an
// ingested route (PFA1): onset 10 minutes, then a save each minute for 4
// minutes, each failure costing Constitution; one success ends it.
export const ARSENIC = defineAffliction({id: 'arsenic', label: 'Arsenic', kind: 'poison', dc: 13, timing: 'frequency',
    onset: 10, frequency: 1, checks: 4, cure: 1, routes: [{via: 'ingested', carriedBy: 'arsenic'}],
    effects: [{ability: 'con', damage: '1d2'}], source: 'Pathfinder 1e, Arsenic (OGL)'});

// Original: spores that ride the air of a damp cellar. Inhaled, so a sealed
// mask stops it and holding a breath for the walk through does too.
export const CELLAR_SPORES = defineAffliction({id: 'cellar_spores', label: 'Cellar spores', kind: 'poison', dc: 12, timing: 'frequency',
    onset: 0, frequency: 10, checks: 3, cure: 1, routes: [{via: 'inhaled', carriedBy: 'spore cloud'}],
    effects: [{condition: 'sickened', value: 1}], source: 'original'});

// Addiction, Pathfinder 1e drugs (OGL, PFA9): a disease on the frequency dial
// that never runs out on its own. Minor: a daily save, a standing Constitution
// penalty, two consecutive saves cure it. Its DC is the drug's, raised by 2
// for each dose taken while the last one's damage still lingers.
export const MINOR_ADDICTION = defineAffliction({id: 'minor_addiction', label: 'Minor addiction', kind: 'disease', dc: 10, timing: 'frequency',
    onset: DAY, frequency: DAY, checks: Infinity, cure: 2, routes: [],
    effects: [{ability: 'con', penalty: 2}], source: 'Pathfinder 1e, Addiction (OGL)'});
export function addictionFor(drug, {base = MINOR_ADDICTION, dosesWhileDamaged = 0} = {}) {
    return defineAffliction({...base, id: `${base.id}:${drug.id}`, label: `${base.label} (${drug.label})`, dc: drug.addictionDc + 2 * Math.max(0, dosesWhileDamaged)});
}

export const AFFLICTIONS = Object.freeze([TETANUS, FESTERING_WOUND, RESISTANT_FESTERING_WOUND, ARSENIC, CELLAR_SPORES, MINOR_ADDICTION]);

// Rusting, Pathfinder 1e weapon special ability (OGL): +1 equivalent, the
// wielder may trade a confirmed critical's extra damage for a rust touch on
// the target or its armor; the weapon itself is rust-immune and cannot be
// used on unattended objects.
export const RUSTING = defineCorrodingProperty({id: 'rusting', agent: 'rust', label: 'Rusting',
    description: 'Permanently tarnished, shedding flakes. On a confirmed critical you may rust the target or its iron gear instead of dealing extra damage.'});
