import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEventBook, whoKnows} from '../src/world_events.js';
import {defineGathering} from '../src/gatherings.js';
import {upcomingStrip} from '../src/read_models/upcoming_strip_bridge.js';
import {skillsTabRows} from '../src/read_models/learn_tab_bridge.js';
import {askListFromWhoKnows} from '../src/read_models/knows_ask_bridge.js';

const rec = (id, extra) => ({id, key: id, kind: 'curfew', placement: 'dated', scope: 'public', evidence: 'S', lineKey: `line.${id}`, ...extra});
const book = buildEventBook([
    rec('curfew1', {when: {day: 11, endDay: 13}, place: 'old_town', effects: [{kind: 'curfew', hours: [22, 5]}]}),
    rec('shut', {kind: 'institution_notice', when: {day: 10, endDay: 10}, place: 'market', effects: [{kind: 'closure'}]}),
    rec('hidden', {when: {day: 10, endDay: 12}, scope: 'private', lineKey: 'line.hidden'}),
    rec('nowords', {when: {day: 10, endDay: 12}, lineKey: undefined})]);
const ctx = {presence: () => null, channels: () => new Set(['crier'])};
const withRoute = buildEventBook([...book.events.map(e => ({...e, spread: e.id === 'hidden' ? [] : [{route: 'crier', delayDays: 0}]}))]);
const text = k => ({'line.curfew1': 'A curfew is posted', 'line.shut': 'The market is shut', 'line.hidden': 'LEAK'})[k] ?? null;
const places = p => ({old_town: 'the Old Town', market: 'the market'})[p] ?? null;

test('upcoming strip: only learned, worded restrictions, phrased in days, plus a known gathering without its seats', () => {
    const g = defineGathering({id: 'club', world: 'w', label: 'The club meets', schedule: {everyDays: 7, offset: 0, hour: 20}, seats: [{id: 's1', personaId: 'p1'}]});
    const rows = upcomingStrip(withRoute, 'me', 10, ctx, text, {placeLabel: places, gatherings: [g], limit: 5, announced: new Set(['curfew1'])});
    assert.deepEqual(rows.map(r => r.id), ['restriction:shut:closure', 'restriction:curfew1:curfew', 'gathering:club']);
    assert.equal(rows[0].when, 'today only');
    assert.equal(rows[1].text, 'A curfew is posted, the Old Town (22:00 to 05:00)');
    assert.equal(rows[1].when, 'from tomorrow');
    assert.equal(rows[2].when, 'in 4 days, 20:00');
    assert.ok(!/LEAK|s1|p1|seat|persona|evidence/.test(JSON.stringify(rows)));
    assert.deepEqual(upcomingStrip(withRoute, 'me', 10, ctx, text, {placeLabel: places}).map(r => r.id), ['restriction:shut:closure'], 'an unannounced future curfew is not shown');
    assert.equal(upcomingStrip(withRoute, 'me', 10, {channels: () => new Set()}, text).length, 0, 'a seat with no route learns nothing');
});

test('skills tab: unheard-of cards have no row, unstated and thresholds stay hidden unless understood', () => {
    const view = (id, stage) => ({id, stage, canLearn: false, refusedBy: ['Needs a teacher.'], gates: [{label: 'Teacher', met: false}], mastery: 2, masteryNeeded: 5,
        practiceMinutes: 30, sign: 'A faint warmth.', nextSignAt: 3, unstated: ['secret cost']});
    const views = [view('a', 'practicing'), view('b', 'unlearned'), null];
    const rows = skillsTabRows(views, {labelOf: id => id.toUpperCase(), known: new Set(['a'])});
    assert.deepEqual(rows.map(r => r.id), ['a']);
    assert.deepEqual(rows[0].progress, {value: 2, of: 5});
    assert.ok(!('nextSignAt' in rows[0]) && !JSON.stringify(rows).includes('secret cost'));
    assert.equal(skillsTabRows(views, {labelOf: id => id, known: new Set(['a']), understood: new Set(['a'])})[0].nextSignAt, 3);
    assert.equal(skillsTabRows(views, {labelOf: id => id, known: new Set(['b'])})[0].progress, null);
});

test('ask list: known people only, once each, no route, day or witness level', () => {
    const people = ['me', 'ann', 'bo', 'stranger'];
    const known = whoKnows(withRoute, 'shut', 12, people, {presence: (p, d) => (p === 'ann' && d === 10 ? 'market' : null), channels: () => new Set(['crier'])});
    const rows = askListFromWhoKnows(known, {self: 'me', knownPeople: new Set(['ann', 'bo']), nameOf: p => ({ann: 'Ann', bo: 'Bo'})[p] ?? null, topicOf: () => 'The market is shut'});
    assert.deepEqual(rows.map(r => r.name), ['Ann', 'Bo']);
    assert.deepEqual(rows[0].action, {kind: 'ask', to: 'ann', about: 'shut'});
    assert.ok(!/route|crier|learnedDay|level|present|heard|stranger/.test(JSON.stringify(rows)));
    assert.deepEqual(askListFromWhoKnows(known, {knownPeople: new Set(['ann']), nameOf: () => 'Ann', topicOf: () => null}), []);
});

test('upcoming strip ui: sources merge soonest first, malformed rows and duplicates drop, nothing means nothing', async () => {
    globalThis.document ??= {getElementById: () => null};
    const {stripChips} = await import('../src/upcoming_strip_ui.js');
    const a = () => [{id: 'x', kind: 'curfew', text: 'A', when: 'from tomorrow', startsIn: 1}, {id: 'bad', text: '', when: 'today'}];
    const b = () => [{id: 'y', kind: 'gathering', text: 'B', when: 'today, 20:00', startsIn: 0}, {id: 'x', text: 'dup', when: 'z', startsIn: 0}];
    assert.deepEqual(stripChips([a, b]).map(r => r.id), ['y', 'x']);
    assert.deepEqual(stripChips([() => { throw new Error('mid-load'); }]), []);
    assert.deepEqual(stripChips([]), []);
});

test('lotm upcoming source: the reached beat shows as a worded row; before it, and with no pack or no life, nothing', async () => {
    const {lotmUpcoming} = await import('../src/book_world_lotm_upcoming.js');
    const pack = {schema: 1, world: 'w', lines: {'news.halt': 'Trains out of the city are halted today.'}, events: [{id: 'halt', key: 'halt', lineKey: 'news.halt', kind: 'public_event', placement: 'ordinal', scope: 'public', evidence: 'U',
        spread: [], witnessedByLead: true, ordinal: {beat: 'b1'}, effects: [{kind: 'travel_halt', means: ['rail']}]}]};
    const days = [{scene: 'b1', day: 1, from: 420, to: 440}];
    const at = clock => lotmUpcoming({state: {clock, lotm: {initializedAt: 0}}, days, pack});
    assert.deepEqual(at(100), []);
    const rows = at(436);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].text, 'Trains out of the city are halted today.');
    assert.equal(rows[0].when, 'today only');
    assert.deepEqual(lotmUpcoming({state: {clock: 436}, days, pack}), []);
    assert.deepEqual(lotmUpcoming({state: {clock: 436, lotm: {initializedAt: 0}}, days, pack: null}), []);
});
