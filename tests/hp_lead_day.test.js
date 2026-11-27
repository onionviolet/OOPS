// Harry's school week (book_world_hp_day.js, world_packs/book_hp_lead_day.js; loop H1 on the shared day shape PS5): the timetable opens each
// class on its own hours in term with a quarter hour's grace, homework is owed only after a class, and both counts feed that subject's June paper.
import test from 'node:test';
import assert from 'node:assert/strict';
import {HP_TIMETABLE, HP_NOTES_ITEM, HP_MARKED_ITEM, HP_SET_ITEM, hpClassAgenda, hpDayFacts, hpDayFact, hpTimetableWords, hpNextClassLine, hpSchoolDayRecap} from '../src/book_world_hp_day.js';
import {hpLeadLibraryExtension} from '../src/hp_library_work.js';
import {requireStructuredExtensions} from '../src/structured_pack_extensions.js';
import {describePlace} from '../src/place_descriptions.js';
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

test('homework is owed while a set piece is held; a class sets it and writing uses it up (PS225: the Done line points at writing it)', () => {
    const owed = n => hpDayFacts(life(94, '20:00'), {gameplay: {player: {inventory: n ? {[JSON.stringify({id: HP_SET_ITEM('history')})]: n} : {}}}})[hpDayFact('history', 'owed')];
    assert.deepEqual([owed(0), owed(1)], [false, true]);
    const cmd = id => HP_LEAD_DAY_COMMANDS.find(c => c.id === `book.hp.lead.day.${id}`);
    const setKey = JSON.stringify({id: HP_SET_ITEM('history')});
    assert.ok(cmd('attend_history').effects.some(e => e.type === 'item' && e.key === setKey && e.amount === 1), 'a class sets one piece');
    assert.match(cmd('attend_history').effects.find(e => e.type === 'knowledge').value, /History of Magic homework is set\.$/);
    assert.deepEqual(cmd('homework_history').costs, [{type: 'item', actor: 'player', key: setKey, amount: -1}], 'writing it uses the set piece up');
    const ext = hpLeadDayExtension({id: 'book.hp.lead', revision: 1, contentHash: 'sha256:x'});
    assert.equal(ext.items.find(i => i.id === HP_SET_ITEM('history')).label, 'History of Magic homework', 'the item name the Done line matches');
});

test('ordinary and reference homework each require their own pin for the shared recap', () => {
    const base = {id: 'book.hp.lead', revision: 1, contentHash: 'sha256:' + '0'.repeat(64)};
    const day = {...hpLeadDayExtension(base), contentHash: 'sha256:' + '1'.repeat(64)};
    const library = {...hpLeadLibraryExtension(base), contentHash: 'sha256:' + '2'.repeat(64)};
    base.extensions = [day, library];
    const selection = ({id, revision, contentHash}) => ({packId: base.id, extensions: [{id, revision, contentHash}]});
    for (const [writer, other] of [[day, library], [library, day]]) {
        const receipt = writer.commands.flatMap(command => command.effects || [])
            .find(effect => effect.key === 'book.hp.lead.day.last_homework');
        const state = {simulation: {knowledge: {player: {[receipt.key]: {stage: receipt.stage, value: receipt.value}}}}};
        assert.doesNotThrow(() => requireStructuredExtensions(selection(writer), base, state));
        assert.throws(() => requireStructuredExtensions(selection(other), base, state), /saved content pin/);
        assert.throws(() => requireStructuredExtensions({packId: base.id}, base, state), /saved content pin/);
    }
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

test('the school hall names the next class: Monday\'s Charms and Potions and the week\'s timetable, today, tomorrow or by day, and nothing out of term', () => {
    assert.equal(hpNextClassLine(life(92, '18:21')), 'Next class: Charms, tomorrow at 09:00 in the Charms classroom, in 14 h 39 min.', 'Sunday evening');
    assert.equal(hpNextClassLine(life(93, '09:20')), 'Charms has started in the Charms classroom; you can still go in until 09:59.');
    assert.deepEqual(hpClassAgenda(life(93, '09:20')).slice(0, 3).map(row => [row.id, row.wait]), [['charms', -20], ['potions', 40], ['history', 280]]);
    assert.equal(hpClassAgenda(life(94, '09:16'))[0].id, 'transfiguration', 'the shorter Herbology window has shut');
    assert.match(hpNextClassLine(life(95, '23:30')), /^Next class: Herbology, Thursday at 09:00|^Next class: Herbology, tomorrow at 09:00/);
    assert.equal(hpNextClassLine(life(145, '09:00')), '', 'the Christmas holidays');
    assert.equal(hpNextClassLine(life(94, '09:00', {'hp.lead.house': undefined})), '', 'not before the Sorting');
    assert.match(describePlace('book.hp.lead.school_hall', 'The Great Hall.', life(92, '18:21')), /^The Great Hall\. Next class: Charms/);
});

test('the school recap keeps the latest saved outcome for class, homework and practice', () => {
    const state = life(93, '15:00');
    Object.assign(state.simulation.knowledge.player, {
        'book.hp.lead.charms_last': {at: 1, value: 'Learned the charm'},
        'book.hp.lead.day.last_lesson': {at: 30, value: 'Attended History'},
        'book.hp.lead.day.last_homework': {at: 45, value: 'Wrote the essay'},
        'book.hp.lead.spell.levitation.last': {at: 45, value: 'Lifted a feather'},
    });
    assert.deepEqual(hpSchoolDayRecap(state), ['Lifted a feather', 'Wrote the essay', 'Attended History']);
    state.simulation.knowledge.player['study.hp.charms.writeup'] = {at: 60, stage: 'understood', value: 'The wrist motion makes sense now'};
    assert.equal(hpSchoolDayRecap(state)[0], 'The wrist motion makes sense now', 'a completed study is a return result too');
});

