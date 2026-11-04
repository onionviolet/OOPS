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

export const AFFLICTIONS = Object.freeze([TETANUS, FESTERING_WOUND, RESISTANT_FESTERING_WOUND]);

// Rusting, Pathfinder 1e weapon special ability (OGL): +1 equivalent, the
// wielder may trade a confirmed critical's extra damage for a rust touch on
// the target or its armor; the weapon itself is rust-immune and cannot be
// used on unattended objects.
export const RUSTING = defineCorrodingProperty({id: 'rusting', agent: 'rust', label: 'Rusting',
    description: 'Permanently tarnished, shedding flakes. On a confirmed critical you may rust the target or its iron gear instead of dealing extra damage.'});
