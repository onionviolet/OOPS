import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPack} from '../scripts/world_events_build.mjs';
import {frameBindings, loadEventPack} from '../src/world_events_pack.js';
import {happenedOn, knownTo} from '../src/world_events.js';

// Invented fixtures: no source text or book identities.
const scenes = [
    {beat: 'a', frame: 'a', frameDay: null, label: 'S'},
    {beat: 'b', frame: 'a', frameDay: 2, label: 'T'},
    {beat: 'c', frame: 'a', frameDay: null, label: 'U'},
    {beat: 'z', frame: 'z', frameDay: null, label: 'I'},
];
const news = (id, extra = {}) => ({id, chapter: 1, kind: 'public_event', placement: 'anchored', frame: 'a',
    offsetDays: 2, durationDays: null, scope: 'public', route: 'newspaper', delayDays: 1,
    via: null, audience: null, evidence: 'T', ...extra});
const rows = [news('n1'), news('n2', {placement: 'ordinal', frame: 'z', route: 'none'}),
    news('n3', {placement: 'unplaced', evidence: 'U'}),
    news('n4', {kind: 'private_fact', scope: 'private', route: 'none', what: 'Do not copy this prose.'}),
    news('n5', {durationDays: 2, route: 'word', delayDays: 3, via: 'witness', audience: 'friend'})];

test('builder preserves independent frames and timing metadata, separating facts and dropping unknown offsets', () => {
    const {pack, privateFacts, counts} = buildPack(scenes, rows);
    assert.deepEqual(pack.events.map(e => e.id), ['ev.a', 'ev.b', 'ev.z', 'n1', 'n2', 'n3', 'n5']);
    assert.deepEqual(pack.events[0], {id: 'ev.a', key: 'lotm.v1.a', kind: 'canon_beat', placement: 'ordinal',
        scope: 'private', evidence: 'S', spread: [], ordinal: {beat: 'a'}});
    assert.deepEqual(pack.events[1].anchor, {eventId: 'ev.a', offsetDays: 2});
    assert.deepEqual(pack.events[3], {id: 'n1', key: 'lotm.v1.n1', lineKey: 'news.n1', kind: 'public_event',
        placement: 'anchored', scope: 'public', evidence: 'T', spread: [{route: 'newspaper', delayDays: 1}],
        anchor: {eventId: 'ev.a', offsetDays: 2}});
    assert.deepEqual(pack.events[4].ordinal, {beat: 'z'});
    assert.deepEqual(pack.events[4].spread, []);
    assert.deepEqual(pack.events[6].anchor, {eventId: 'ev.a', offsetDays: 2, durationDays: 2});
    assert.deepEqual(pack.events[6].spread, [{route: 'word', delayDays: 3, via: 'witness', audience: 'friend'}]);
    assert.deepEqual(privateFacts.map(f => f.id), ['n4']);
    assert.equal(privateFacts[0].frame, 'a');
    assert.equal(privateFacts[0].offsetDays, 2);
    assert.equal(JSON.stringify({pack, privateFacts}).includes('Do not copy'), false);
    assert.equal(counts.leftOut, 1);
    assert.deepEqual(counts.kind, {canon_beat: 3, public_event: 4, private_fact: 1});
    assert.deepEqual(counts.placement, {ordinal: 3, anchored: 3, unplaced: 1});
    assert.deepEqual(counts.route, {newspaper: 2, none: 2, word: 1});
});

test('loader and reached-frame bindings deliver a missed event on its news day through its stated route', () => {
    const {pack} = buildPack(scenes, rows);
    const called = [];
    const bindings = frameBindings(pack, ['a', 'b', 'absent'], beat => {called.push(beat); return 10;});
    assert.deepEqual(bindings, {a: 10});
    assert.deepEqual(called, ['a']);
    const book = loadEventPack(pack, {bindings});
    assert.deepEqual(happenedOn(book, 12).map(e => e.id), ['ev.b', 'n1', 'n5']);
    assert.equal(book.byId.get('n2').window, null);
    assert.equal(book.byId.get('n3').window, null);
    assert.equal(loadEventPack(pack).byId.get('n1').window, null);
    const reader = {presence: () => null, channels: () => new Set(['newspaper'])};
    assert.deepEqual(knownTo(book, 'lead', 12, reader), []);
    assert.deepEqual(knownTo(book, 'lead', 13, reader), [{eventId: 'n1', learnedDay: 13, route: 'newspaper', level: 'heard'}]);
    assert.deepEqual(knownTo(book, 'lead', 100, {presence: () => null, channels: () => new Set(['telegram'])}), []);
    assert.deepEqual(frameBindings(pack, new Set(['z']), () => 0), {z: 0});
});

test('loader rejects malformed envelopes and delegates invalid records and anchor checks to the reader', () => {
    const {pack} = buildPack(scenes, rows);
    for (const invalid of [null, {...pack, schema: 2}, {...pack, world: ''}, {...pack, events: {}}]) {
        assert.throws(() => loadEventPack(invalid), /Invalid world event pack/);
    }
    const change = patch => ({...pack, events: [{...pack.events[0], ...patch}]});
    assert.throws(() => loadEventPack(change({lineKey: 12})), /lineKey/);
    assert.throws(() => loadEventPack(change({kind: 'private_fact'})), /Invalid world event/);
    assert.throws(() => loadEventPack({...pack, events: [...pack.events, pack.events[0]]}), /Duplicate/);
    assert.throws(() => loadEventPack(change({placement: 'anchored', anchor: {eventId: 'missing', offsetDays: 0}})), /Unknown anchor/);
    assert.throws(() => frameBindings(pack, ['a'], () => -1), /binding day/);
    assert.throws(() => buildPack(scenes, [news('bad', {placement: 'ordinal', frame: 'missing'})]), /Unknown news frame/);
});

test('later volumes place a row at its chapter beat and keep private facts off the calendar', async () => {
    const {buildLaterPack} = await import('../scripts/world_events_build.mjs');
    const row = (id, extra) => ({id, kind: 'public_event', placement: 'ordinal', chapter: 7, scope: 'public', evidence: 'S', route: 'newspaper', delayDays: 1, ...extra});
    const {pack, privateFacts} = buildLaterPack(3, [row('a'), row('b', {kind: 'private_fact', route: 'none'}), row('c', {chapter: null}), row('d', {placement: 'unplaced'})]);
    assert.deepEqual(pack.events.map(e => [e.id, e.placement]), [['a', 'ordinal'], ['c', 'unplaced'], ['d', 'unplaced']]);
    assert.equal(pack.events[0].ordinal.beat, 'lotm.v3.ch7');
    assert.deepEqual(privateFacts.map(f => f.id), ['b']);
});

test('later-volume rules: witnessed rows are seen by the lead, named audiences need a carrier, empty reads drop', async () => {
    const {buildLaterPack} = await import('../scripts/world_events_build.mjs');
    const {knownTo} = await import('../src/world_events.js');
    const row = (id, extra) => ({id, kind: 'public_event', placement: 'ordinal', chapter: 4, scope: 'public', evidence: 'S', route: 'witness', delayDays: 0, what: 'x', ...extra});
    const {pack} = buildLaterPack(2, [row('w'), row('n', {route: 'word', audience: 'named'}), row('r', {what: 'paper read; content not stated'}), row('p', {route: 'letter', delayDays: 2, audience: 'public'})]);
    assert.deepEqual(pack.events.map(e => e.id), ['w', 'n', 'p']);
    assert.equal(pack.events[0].witnessedByLead, true);
    assert.deepEqual(pack.events[1].spread, []);
    const beat = 'lotm.v2.ch4', bindings = frameBindings(pack, [beat], () => 30);
    assert.deepEqual(bindings, {[beat]: 30});
    const book = loadEventPack(pack, {bindings, leadId: 'lead'});
    const ctx = {presence: () => null, channels: () => new Set(['letter'])};
    assert.deepEqual(knownTo(book, 'lead', 30, {...ctx, channels: () => new Set()}).map(k => k.eventId), ['w']);
    assert.deepEqual(knownTo(book, 'stranger', 99, {...ctx, channels: () => new Set()}), []);
    assert.deepEqual(knownTo(book, 'stranger', 31, ctx).map(k => k.eventId), []);
    assert.deepEqual(knownTo(book, 'stranger', 32, ctx).map(k => k.eventId), ['p']);
});

test('scenes the lead is not in happen anyway and are known only to those present', () => {
    const scene = (beat, extra) => ({beat, frame: 'r', frameDay: beat === 'r' ? null : 1, place: 'p', label: 'I', present: [], leadPresent: true, ...extra});
    const {pack} = buildPack([scene('r'), scene('s', {present: ['aly'], leadPresent: false})], []);
    const s = pack.events.find(e => e.id === 'ev.s');
    assert.deepEqual(s.present, ['aly']);
    assert.equal(s.witnessedByLead, undefined);
    const book = loadEventPack(pack, {bindings: {r: 5}, leadId: 'lead'});
    const ctx = {presence: () => null, channels: () => new Set()};
    assert.deepEqual(knownTo(book, 'aly', 99, ctx).map(k => k.eventId), ['ev.s']);
    assert.deepEqual(knownTo(book, 'lead', 99, ctx).map(k => k.eventId), ['ev.r']);
});
