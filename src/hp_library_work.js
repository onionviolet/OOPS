// N2: a learned charm does useful library work; the same assignment can also be written without these notes.
import {extensionFact} from './structured_pack_extensions.js';
import {HP_SET_ITEM, HP_MARKED_ITEM} from './book_world_hp_day.js';
import {HP_FEATHER_CAST, hpLeadChanceFact} from './hp_lead_spells.js';
import {HP_LIBRARY_OPEN, HP_LIBRARY_BOOK_DOWN} from './hp_study_rules.js';

export const HP_LIBRARY_WORK = 'book.hp.lead.library_work';
export const HP_LIBRARY_NOTE = `${HP_LIBRARY_WORK}.astronomy_notes`;
export const HP_LIBRARY_LAST = `${HP_LIBRARY_WORK}.last`;
export {HP_LIBRARY_BOOK_DOWN} from './hp_study_rules.js';
const P = 'book.hp.lead', WORLD = `${P}.world`, HALL = `${P}.school_hall`, POWER = `${P}.levitation`;
const id = name => `${HP_LIBRARY_WORK}.${name}`;
export const HP_LIBRARY_ACTIONS = Object.freeze({ladder: id('move_ladder'), cast: id('levitate_book'), copy: id('copy_chart'), homework: id('write_astronomy')});
const key = id => JSON.stringify({id});
const eq = (fact, value, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const held = (item, reason) => ({fact: `item.${key(item)}`, op: 'gte', value: 1, ...(reason ? {reason} : {})});
const note = value => ({type: 'knowledge', actor: 'player', key: HP_LIBRARY_LAST, stage: 'understood', value});
const item = item => ({type: 'item', actor: 'player', key: key(item), amount: 1});
const position = value => ({type: 'fact', scope: 'world', key: HP_LIBRARY_BOOK_DOWN, value});
const admitted = eq(extensionFact(HP_LIBRARY_WORK), true);
const school = eq('actor.hp.lead.atSchool', true, 'Return to Hogwarts for the school library.');
const open = eq(HP_LIBRARY_OPEN, true, 'The school library is shut for the holidays.');
const bookDown = eq(`world.${HP_LIBRARY_BOOK_DOWN}`, true, 'Bring the chart-book down from the high shelf first.');
const onShelf = {not: bookDown, reason: 'The chart-book is on the desk; copy your notes and put it back.'};
const reference = held(HP_LIBRARY_NOTE, 'Copy your Astronomy reference notes from the high-shelf chart-book first.');
const support = {all: [eq('actor.life', 'alive'), admitted, school]};
function work(name, label, duration, description, requires, effects, costs = []) {
    return {id: HP_LIBRARY_ACTIONS[name], revision: 1, label, description, group: 'structured_local', worldId: WORLD,
        actorId: 'player', location: HALL, audience: ['$actor'], once: false, duration, costs,
        visibleWhen: admitted, requires: {all: [support, open, ...requires]},
        ...(duration > 0 ? {completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
            cancellation: 'refund', reservationReturns: 1} : {}), effects};
}
const ladder = work('ladder', 'Move the library ladder · 10 min', 10,
    'Roll the ladder over and bring the high-shelf Astronomy chart-book down to the desk. You can copy it before returning it.',
    [onShelf], [position(true), note('You moved the ladder and brought the chart-book down to the desk. You can copy your reference notes now.')]);
const castBase = work('cast', 'Bring the chart-book down with Levitation', 0,
    'Guide the library chart-book off its shelf and down to the desk. A try costs 1 stamina and improves your Levitation practice, even when it slips.',
    [onShelf, eq(`power.${POWER}.owned`, true, 'Learn the Levitation Charm in Charms first.'),
        {any: [held(`${P}.w4_wand`), held(`${P}.spell_practice.class_wand`)], reason: 'Bring your wand, or take a class wand at the Charms practice bench.'}], [],
    [{type: 'vital', key: 'stamina', amount: -1}]);
const practice = {type: 'power', powerId: POWER, operation: 'refine', amount: 1};
const {effects: _unused, ...cast} = castBase;
cast.powerId = POWER;
cast.outcomes = [
    {id: 'lowered', weight: {fact: hpLeadChanceFact(HP_FEATHER_CAST), scale: -1, add: 1}, effects: [position(true), practice,
        note('The chart-book floated down to the desk. You can copy your reference notes now.')]},
    {id: 'fizzled', weight: {fact: hpLeadChanceFact(HP_FEATHER_CAST)}, effects: [practice,
        note('The chart-book shifted, then settled back on its shelf. You noticed where your motion slipped.')]},
];
const copy = work('copy', 'Copy Astronomy notes and return the book · 5 min', 5,
    'Read the worked star-chart example, make your own reference notes, and put the library book back. Your notes shorten assigned Astronomy homework from an hour to half an hour.',
    [bookDown], [item(HP_LIBRARY_NOTE), position(false), note('You copied the worked chart in your own notes and put the library book back. Your reference notes help with Astronomy homework.')]);
const homework = work('homework', 'Use reference notes for Astronomy homework · 30 min', 30,
    'Work through the assigned star chart with your own reference notes beside it. This uses one waiting assignment and returns the same marked work as an hour without the reference.',
    [held(HP_SET_ITEM('astronomy'), 'No Astronomy homework is waiting; it is set at the next class.'), reference],
    [item(HP_MARKED_ITEM('astronomy')), {type: 'knowledge', actor: 'player', key: `${P}.day.last_homework`, stage: 'understood',
        value: 'Astronomy: You drew the assigned star chart with your reference notes beside it, in half an hour.'}],
    [{type: 'item', actor: 'player', key: key(HP_SET_ITEM('astronomy')), amount: -1}]);
homework.completionRequires = {all: [support, reference]};
export const HP_LIBRARY_COMMANDS = Object.freeze([ladder, cast, copy, homework]);
export const HP_LIBRARY_ITEMS = Object.freeze([{id: HP_LIBRARY_NOTE, label: 'Astronomy reference notes',
    description: 'Your own notes from the library chart-book. They help you write assigned Astronomy charts in half an hour.', value: 0}]);
export function hpLeadLibraryExtension(base) {
    return {schema: 1, id: HP_LIBRARY_WORK, revision: 1, base: {id: base.id, revision: base.revision, contentHash: base.contentHash},
        label: 'Use the high-shelf library chart-book', description: 'Bring down an Astronomy chart-book by ladder or charm, copy your own notes, and put it back. The notes help with your assigned work.',
        requires: {all: [school, eq('completed.book.hp.lead.sorting', true)]}, reason: 'Arrive at Hogwarts and be sorted first.',
        items: HP_LIBRARY_ITEMS, status: [{id: id('last'), label: 'Library work', knowledgeKey: HP_LIBRARY_LAST}], commands: HP_LIBRARY_COMMANDS};
}
