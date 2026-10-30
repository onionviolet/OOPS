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
        placement: 'anchored', scope: 'public', evidence: 'T', spread: [{route: 'newspaper', delayDays: 1}], chapter: 1,
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
