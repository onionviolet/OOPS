// Harry's school week (book_world_hp_day.js, world_packs/book_hp_lead_day.js; loop H1 on the shared day shape PS5): the timetable opens each
// class on its own hours in term with a quarter hour's grace, homework is owed only after a class, and both counts feed that subject's June paper.
import test from 'node:test';
import assert from 'node:assert/strict';
import {HP_TIMETABLE, HP_NOTES_ITEM, HP_MARKED_ITEM, hpDayFacts, hpDayFact, hpTimetableWords} from '../src/book_world_hp_day.js';
import {hpLeadDayExtension, HP_LEAD_DAY_COMMANDS} from '../src/world_packs/book_hp_lead_day.js';
import {hpExamInputs, hpExamFacts} from '../src/book_world_hp_exams.js';

const DAY = 1440;
// The lead clock: minute = clock - opening.at + 480 (book_world_hp_lessons.js). Day 93 is a Monday in term (the Halloween save's day).
const life = (day, hhmm, facts = {}) => {
    const [h, m] = hhmm.split(':').map(Number);
    return {clock: day * DAY + h * 60 + m - 480, actors: {player: {worldId: 'book.hp.lead.world', facts: {'hp.lead.atSchool': true, 'hp.lead.house': 'gryffindor', ...facts}}},
        simulation: {knowledge: {player: {'book.hp.lead.opening': {at: 0}}}}};
};
// The shell's projection: inventory keyed by item key (what hpFacts passes as context.gameplay).
const held = (notes = {}, marked = {}) => ({player: {inventory: Object.fromEntries([...Object.entries(notes).map(([s, n]) => [JSON.stringify({id: HP_NOTES_ITEM(s)}), n]),
    ...Object.entries(marked).map(([s, n]) => [JSON.stringify({id: HP_MARKED_ITEM(s)}), n])])}});
const startable = (state, s) => hpDayFacts(state)[hpDayFact(s, 'startable')];

test('a class takes pupils on its own hours, for a quarter of an hour after the start, and only in term', () => {
    assert.equal(startable(life(94, '09:05'), 'herbology'), true, 'Tuesday 09:05 is Herbology');
    assert.equal(startable(life(94, '09:15'), 'herbology'), true);
    assert.equal(startable(life(94, '09:16'), 'herbology'), false, 'too late to go in');
    assert.equal(startable(life(94, '09:05'), 'transfiguration'), false);
    assert.equal(startable(life(94, '10:00'), 'transfiguration'), true);
    assert.equal(startable(life(93, '09:05'), 'herbology'), false, 'Monday morning is Charms and Potions');
    assert.equal(startable(life(95, '23:10'), 'astronomy'), true, 'Wednesday night on the tower');
    assert.equal(startable(life(145, '09:05'), 'herbology'), false, 'no classes in the Christmas holidays');
    assert.equal(startable(life(94, '09:05', {'hp.lead.house': undefined}), 'herbology'), false, 'not before the Sorting');
});

test('homework is owed only for classes attended and not yet written up (notes held against marked pieces held)', () => {
    const facts = g => hpDayFacts(life(94, '20:00'), {gameplay: g});
    assert.equal(facts(held())[hpDayFact('history', 'owed')], false);
    assert.equal(facts(held({history: 2}, {history: 1}))[hpDayFact('history', 'owed')], true);
    assert.equal(facts(held({history: 2}, {history: 2}))[hpDayFact('history', 'owed')], false);
});

test('the week feeds the June paper: notes raise fluency, marked homework understanding, and the chance of a better band rises', () => {
    const state = life(300, '12:00'), idle = held(), worked = held({herbology: 24}, {herbology: 12});
    assert.deepEqual([hpExamInputs(state, idle).herbology.fluency, hpExamInputs(state, idle).herbology.understanding], [0, 0], 'no classes, the baseline the papers had before');
    assert.deepEqual([hpExamInputs(state, worked).herbology.fluency, hpExamInputs(state, worked).herbology.understanding], [1, 1]);
    assert.equal(hpExamInputs(state, worked).charms.fluency, 0, 'Charms still reads levitation practice, not the timetable');
    const better = f => f['hp.lead.exam.p.herbology.top'] + f['hp.lead.exam.p.herbology.high'] + f['hp.lead.exam.p.herbology.good'];
    assert.ok(better(hpExamFacts(state, {gameplay: worked})) > better(hpExamFacts(state, {gameplay: idle})));
});

test('the extension is plain data on the registered life: one class and one homework per subject, every gate with a reason', () => {
    const ext = hpLeadDayExtension({id: 'book.hp.lead', revision: 1, contentHash: 'sha256:x'});
    assert.equal(ext.base.contentHash, 'sha256:x', 'pinned to the life it is registered on, so no identity alias is needed');
    assert.deepEqual(JSON.parse(JSON.stringify(ext)), ext, 'simulation data must be JSON');
    assert.equal(HP_LEAD_DAY_COMMANDS.length, HP_TIMETABLE.length * 2);
    const facts = Object.keys(hpDayFacts(life(94, '09:05')));
    for(const c of HP_LEAD_DAY_COMMANDS) {
        const gate = c.requires.all.at(-1);
        assert.ok(gate.reason && facts.includes(gate.fact), `${c.id} reads a fact the timetable writes and says why it is shut`);
    }
    assert.match(hpTimetableWords(HP_TIMETABLE.find(r => r.id === 'herbology')), /Tuesdays, Thursdays and Fridays 09:00 to 10:00/);
    assert.match(hpTimetableWords(HP_TIMETABLE.find(r => r.id === 'astronomy')), /Wednesdays 23:00 to midnight/);
});

test('player words carry no source notes (PRS1)', () => {
    const ext = hpLeadDayExtension({id: 'book.hp.lead', revision: 1, contentHash: 'sha256:x'});
    for(const t of [ext.label, ext.description, ...ext.items.flatMap(i => [i.label, i.description]), ...ext.commands.flatMap(c => [c.label, c.description])])
        assert.doesNotMatch(t, /\bch\d|stated|proposal|Authored/, t);
});
