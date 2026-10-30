import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEventBook, happenedOn, endedBy, curfewsOn, knownTo, learnedBetween, newsOn, whoKnows} from '../src/world_events.js';

const rec = (id, extra) => ({id, key: `k.${id}`, kind: 'public_event', placement: 'dated', scope: 'public', evidence: 'S', when: {day: 10}, ...extra});
const book = buildEventBook([
    rec('fire', {place: 'dock', when: {day: 10, endDay: 11}, spread: [{route: 'newspaper', delayDays: 1}, {route: 'word', delayDays: 3, via: 'sailor', audience: 'bob'}],
        present: ['sailor'], effects: [{kind: 'curfew', place: 'dock', fromDay: 11, toDay: 13}]}),
    rec('inquest', {kind: 'institution_notice', placement: 'anchored', anchor: {eventId: 'fire', offsetDays: 2}, when: undefined, spread: [{route: 'newspaper', delayDays: 0}]}),
    rec('secret', {scope: 'private', when: {day: 12}, place: 'cellar', evidence: 'I'}),
    rec('later', {placement: 'ordinal', ordinal: {beat: 'lr.1'}, when: undefined, spread: [{route: 'newspaper', delayDays: 0}]}),
    rec('lost', {placement: 'unplaced', evidence: 'U', when: undefined}),
]);
const reader = {presence: () => null, channels: () => new Set(['newspaper'])};
const nobody = {presence: () => null, channels: () => new Set()};

test('anchored events resolve from the anchor window end; ordinal and unplaced stay dormant', () => {
    assert.deepEqual(book.byId.get('inquest').window, {day: 13, endDay: 13});
    assert.equal(book.byId.get('later').window, null);
    assert.equal(book.byId.get('lost').window, null);
    assert.deepEqual(happenedOn(book, 11).map(e => e.id), ['fire']);
    assert.deepEqual(endedBy(book, 12).map(e => e.id).sort(), ['fire', 'secret']);
    assert.deepEqual(curfewsOn(book, 12), [{eventId: 'fire', place: 'dock'}]);
    assert.deepEqual(curfewsOn(book, 14), []);
});

test('a bound ordinal beat runs on its bound day only', () => {
    const b = buildEventBook([rec('later', {placement: 'ordinal', ordinal: {beat: 'lr.1'}, when: undefined})], {bindings: {'lr.1': 20}});
    assert.deepEqual(happenedOn(b, 20).map(e => e.id), ['later']);
    assert.deepEqual(happenedOn(b, 19), []);
});

test('news appears on its day and not before', () => {
    assert.deepEqual(knownTo(book, 'ann', 11, reader), []);
    assert.deepEqual(newsOn(book, 'ann', 12, reader).map(k => k.eventId), ['fire']);
    assert.deepEqual(newsOn(book, 'ann', 13, reader).map(k => k.eventId), ['inquest']);
    assert.deepEqual(knownTo(book, 'ann', 13, reader).map(k => k.eventId), ['fire', 'inquest']);
});

test('a witness learns during the window; a missed event reaches the lead only through a stated route', () => {
    const atDock = {presence: (p, d) => p === 'cara' && d === 11 ? 'dock' : null, channels: () => new Set()};
    assert.deepEqual(knownTo(book, 'cara', 11, atDock), [{eventId: 'fire', learnedDay: 11, route: 'present', level: 'present'}]);
    assert.deepEqual(knownTo(book, 'ann', 99, nobody), []);
    assert.deepEqual(knownTo(book, 'bob', 13, nobody), []);
    assert.deepEqual(knownTo(book, 'bob', 14, nobody), [{eventId: 'fire', learnedDay: 14, route: 'word', level: 'heard'}]);
    assert.deepEqual(knownTo(book, 'bob', 99, {...nobody, channels: () => new Set(['newspaper'])}).filter(k => k.eventId === 'fire'),
        [{eventId: 'fire', learnedDay: 12, route: 'newspaper', level: 'heard'}]);
});

test('a private event with no route is never learned; the sailor is present from the start', () => {
    assert.deepEqual(knownTo(book, 'ann', 99, reader).map(k => k.eventId), ['fire', 'inquest']);
    assert.equal(knownTo(book, 'sailor', 10, nobody)[0].level, 'present');
});

test('digest covers only the span and replays identically', () => {
    const a = learnedBetween(book, 'ann', 11, 13, reader), b = learnedBetween(book, 'ann', 11, 13, reader);
    assert.deepEqual(a, b);
    assert.deepEqual(a.map(k => k.eventId), ['fire', 'inquest']);
    assert.deepEqual(learnedBetween(book, 'ann', 12, 13, reader).map(k => k.eventId), ['inquest']);
});

test('invalid records, duplicates and anchor cycles fail closed', () => {
    assert.throws(() => buildEventBook([rec('a'), rec('a')]), /Duplicate/);
    assert.throws(() => buildEventBook([rec('a', {kind: 'rumour'})]), /Invalid/);
    assert.throws(() => buildEventBook([rec('a', {placement: 'anchored', anchor: {eventId: 'b', offsetDays: 1}, when: undefined}),
        rec('b', {placement: 'anchored', anchor: {eventId: 'a', offsetDays: 1}, when: undefined})]), /cycle/);
    assert.throws(() => buildEventBook([rec('a', {placement: 'anchored', anchor: {eventId: 'zz', offsetDays: 1}, when: undefined})]), /Unknown anchor/);
});

test('a private event is not delivered by an open channel, only by a named carrier', () => {
    const b = buildEventBook([rec('pv', {scope: 'private', place: 'den', present: ['spy'], spread: [{route: 'newspaper', delayDays: 0}, {route: 'word', delayDays: 1, via: 'spy', audience: 'bob'}]})]);
    assert.deepEqual(knownTo(b, 'ann', 99, reader), []);
    assert.deepEqual(knownTo(b, 'bob', 99, nobody).map(k => [k.route, k.learnedDay]), [['word', 11]]);
});

test('a curfew-kind event is a curfew over its window', () => {
    const b = buildEventBook([rec('c', {kind: 'curfew', place: 'ward', when: {day: 4, endDay: 5}})]);
    assert.deepEqual(curfewsOn(b, 5), [{eventId: 'c', place: 'ward'}]);
    assert.deepEqual(curfewsOn(b, 6), []);
});

test('second-hand news travels a delay behind its carrier, through chains, without loops', () => {
    const b = buildEventBook([rec('chain', {scope: 'private', present: ['a'], when: {day: 10},
        spread: [{route: 'word', delayDays: 1, via: 'a', audience: 'b'}, {route: 'word', delayDays: 2, via: 'b', audience: 'c'}, {route: 'word', delayDays: 1, via: 'c', audience: 'b'}]})]);
    assert.deepEqual(knownTo(b, 'b', 99, nobody).map(k => k.learnedDay), [11]);
    assert.deepEqual(knownTo(b, 'c', 99, nobody).map(k => k.learnedDay), [13]);
    assert.deepEqual(whoKnows(b, 'chain', 12, ['a', 'b', 'c', 'd'], nobody).map(k => k.person), ['a', 'b']);
    assert.deepEqual(whoKnows(b, 'chain', 13, ['a', 'b', 'c', 'd'], nobody).map(k => k.person), ['a', 'b', 'c']);
});
