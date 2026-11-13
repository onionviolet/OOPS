// PC95. A trained response puts up a short-lived mental screen. The
// ordinary Legilimens sense act still owns whether it observes a target.
import {defineWorkingLaw} from '../kernel_working.js';
import {sentenceFromIntent} from '../spell_effects.js';
import {labelSpellRow} from '../spell_grammar.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../spell_pack_hogwarts.js';
import {WORLD_QUANTITIES, WORLD_PROPERTIES} from '../world_quantities.js';

const practice = 'occlumency-practice';
const practiceLimit = 100;
const ready = body => body.properties.mind_awake === true;
const roles = {student: 'body', tutor: 'body'};
const refusal = reason => ({ok: false, reason});

export const OCCLUMENCY_LAW = defineWorkingLaw({id: 'hp.occlumency', revision: 1, operations: {
    practice: {roles, settle({bound: {student, tutor}}) {
        if (student.id === tutor.id || !student.place || student.place !== tutor.place ||
            !ready(student) || !ready(tutor) || tutor.properties.occlumency_tutor !== true)
            return refusal('The student needs an attentive tutor here.');
        if (!(student.quantities.stamina >= 2)) return refusal('The student is too tired to practice.');
        if (!(student.quantities[practice] < practiceLimit)) return refusal('The student has finished this exercise.');
        return {ok: true, costs: [{quantity: 'stamina', amount: 2, payer: student.holder}],
            effects: [{op: 'add', holder: student.holder, quantity: practice, amount: 1}]};
    }},
    focus: {roles: {student: 'body'}, settle({bound: {student}, at, address}) {
        if (!(student.quantities[practice] >= 2)) return refusal('The student needs more practice.');
        if (!ready(student) || (student.properties.mind_confusion ?? 0) > 0)
            return refusal('The student cannot settle their thoughts.');
        if (!(student.quantities.stamina >= 1)) return refusal('The student is too tired to focus.');
        // Preserve distinct working addresses within the substrate field ID alphabet.
        const field = `occlumency.${address.replaceAll(':', '::').replaceAll('/', ':s')}`;
        return {ok: true, costs: [{quantity: 'stamina', amount: 1, payer: student.holder}],
            effects: [{op: 'law_add', field: {id: field, scope: student.holder, kind: 'conceal',
                params: {channel: 'mind'}, until: at + 3, source: student.holder}}]};
    }},
}});

export function occlumencyMethod({op, student, tutor}) {
    if (op !== 'practice' && op !== 'focus') throw Error('Unknown Occlumency exercise.');
    const bindings = {student: {kind: 'body', id: student}, ...(op === 'practice' ? {tutor: {kind: 'body', id: tutor}} : {})};
    const boundRoles = Object.fromEntries(Object.keys(bindings).map(role => [role, role]));
    return {law: OCCLUMENCY_LAW, bindings, method: {id: `hp.occlumency.${op}`, revision: 1, law: OCCLUMENCY_LAW.ref,
        roles: op === 'practice' ? roles : {student: 'body'}, steps: [{op, bindings: boundRoles, minutes: 1}]}};
}

export function coverageCase(id) {
    if (id !== 'occlumency') throw Error(`Unknown Occlumency case ${id}.`);
    const body = (id, properties, quantities) => ({id, kind: 'body', as: ['creature'], place: 'hall',
        properties: {mind_awake: true, ...properties}, quantities});
    const step = (id, op, at, expect, reason) => [
        {id: `start-${id}`, working: {id, family: 'occlumency', op, student: 'student', tutor: 'tutor', payer: 'student'}},
        {id, advanceTo: at, expect, ...(reason ? {interruption: {working: id, reason}} : {})},
    ];
    const row = HP_SPELL_ROWS.find(row => row.id === 'legilimency');
    const probe = (id, at, expect) => [
        {id: `start-${id}`, working: {id, family: 'spell', payer: 'reader', spells: [{
            sentence: sentenceFromIntent(labelSpellRow(row, HP_SPELL_WORLD).parts),
            target: {id: 'student'}, grip: {caster: 'reader', implement: 'wand'}, contact: {links: 0},
            minutes: 1, requiresSpeech: true, details: {channel: 'mind', mind: {faculty: 'memory'}, minutes: 1, cost: 1},
        }]}},
        {id, advanceTo: at, expect},
    ];
    const access = (direction, to) => ({holder: 'reader', property: 'mind_access', direction, to});
    const stamina = (holder, direction, to) => ({holder, quantity: 'stamina', direction, to});
    const progress = (direction, to) => ({holder: 'student', quantity: practice, direction, to});
    const exposed = ['["student","private-memory"]'];
    return {basis: 'authored', world: {holders: [
        {id: 'hall', kind: 'place'}, {id: 'outside', kind: 'place'},
        body('student', {mind_memory: ['private-memory']}, {[practice]: 0, stamina: 8}),
        body('tutor', {occlumency_tutor: true}, {}), body('reader', {}, {stamina: 5}),
        {id: 'wand', kind: 'thing', place: 'hall', properties: {marks: ['grip:reader']}},
    ]}, engine: {packs: ['a.mind'], shared: {
        properties: [...Object.values(WORLD_PROPERTIES), {id: 'occlumency_tutor', type: 'flag'}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: practice, unit: 'exercise', min: 0, max: practiceLimit},
            {id: 'stamina', unit: 'effort', min: 0, max: 10}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}}, timeline: [
        ...step('early-focus', 'focus', 1, [stamina('student', 'unchanged', 8)], 'The student needs more practice.'),
        ...probe('unguarded', 2, [access('changed', exposed), stamina('reader', 'down', 4)]),
        ...step('first-lesson', 'practice', 3, [progress('up', 1), stamina('student', 'down', 6)]),
        {id: 'restore-training', restore: true},
        ...step('second-lesson', 'practice', 4, [progress('up', 2), stamina('student', 'down', 4)]),
        ...step('guard', 'focus', 5, [stamina('student', 'down', 3)]),
        {id: 'restore-guard', restore: true},
        ...probe('guarded', 6, [access('unchanged', null), stamina('reader', 'down', 3)]),
        {id: 'lapse', advanceTo: 8, expect: [{lawField: 'occlumency.guard:s0', direction: 'changed', to: null}]},
        ...probe('after-lapse', 9, [access('changed', exposed), stamina('reader', 'down', 2)]),
    ], expect: [progress('up', 2), stamina('student', 'down', 3), stamina('reader', 'down', 2), access('changed', exposed),
        {holder: 'student', property: 'mind_memory', direction: 'unchanged', to: ['private-memory']}]};
}
