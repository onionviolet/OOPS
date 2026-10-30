// RPX21 family tree fixtures (invented names). Both go through the real adapter, so the gallery
// shows what the Family panel draws from the same projection shape.
import {familyFigureSpec, familyFanSpec} from '../../../family_figure.js';

const m = (id, name, sex, sire = null, dam = null) => ({id, name, sex, sire, dam});
// A third life in a household line: two lives behind it, a living spouse and child, a named heir.
export const HOUSEHOLD_PROJECTION = {
    selfName: 'Wren Ashdown',
    line: {selfId: 'h4', members: [m('father', 'Your father', 'm'), m('mother', 'Your mother', 'f'), m('self', 'Corla Ashdown', 'f', 'father', 'mother'),
        m('p3', 'Dov Ashdown', 'm'), m('h4', 'Heir 4', 'm', 'p3', 'self'), m('h5', 'Tamsin Ashdown', 'f', 'p3', 'self')]},
    lives: {ancestors: [{name: 'Corla Ashdown', age: 58, generation: 2, via: 'kin'}, {name: 'Ebb Marrow', age: 71, generation: 1, via: 'apprentice'}]},
    kin: [{id: 'kin:0', name: 'Isa Fenwright', relation: 'spouse', age: 44}, {id: 'kin:1', name: 'Pip', relation: 'child', age: 19}],
    succession: {law: 'Town custom', reason: 'The eldest adult child takes the house; a taught apprentice still takes the craft.', heirId: 'kin:1', heirName: 'Pip', order: [{id: 'kin:1', name: 'Pip', why: 'eldest child'}]},
    heirlooms: [{name: 'Ashdown pewter lamp'}],
};
// A seat that woke in a body it did not grow up in: parents are body memory, grandparents unknown,
// one grandmother rumoured by the village.
export const STRANGER_PROJECTION = {
    selfName: 'You',
    line: {selfId: 'self', members: [m('father', 'Your father', 'm'), m('mother', 'Your mother', 'f'), m('self', 'You', 'm', 'father', 'mother')]},
    lives: null, kin: [],
    succession: {law: 'Single successor', reason: 'One successor, the apprentice when one was taught, else next of kin.'},
};
const strangerKnows = key => ({'family.raised': false, 'family.f.f': 'guessed'})[key];

export const FAMILY_HOUSEHOLD_FIXTURE = {...familyFigureSpec(HOUSEHOLD_PROJECTION), id: 'family-household', title: 'The Ashdown household'};
export const FAMILY_STRANGER_FIXTURE = {...familyFigureSpec(STRANGER_PROJECTION, {knows: strangerKnows}), id: 'family-stranger', title: 'A family you half remember'};
// Alternative form beside the default (round 2): the stranger's ancestors as a fan of fixed slots.
export const FAMILY_FAN_FIXTURE = {...familyFanSpec(STRANGER_PROJECTION, {knows: strangerKnows}), id: 'family-fan-stranger'};
export const FAMILY_FIXTURES = [FAMILY_HOUSEHOLD_FIXTURE, FAMILY_STRANGER_FIXTURE, FAMILY_FAN_FIXTURE];
