import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEventBook} from '../src/world_events.js';
import {digestRowsFromEvents} from '../src/read_models/time_digest_bridge.js';

const rec = (id, extra) => ({id, key: id, kind: 'public_event', placement: 'dated', scope: 'public', evidence: 'S', lineKey: `line.${id}`, ...extra});
const book = buildEventBook([
    rec('fair', {when: {day: 5}, place: 'square'}),
    rec('fire', {when: {day: 6}, spread: [{route: 'gossip', delayDays: 1}]}),
    rec('secret', {when: {day: 6}, scope: 'private', lineKey: 'line.secret'}),
    rec('nolines', {when: {day: 6}, lineKey: undefined, present: ['me']})]);
const ctx = {presence: (p, d) => (d === 5 ? 'square' : null), channels: () => new Set(['gossip'])};
const text = k => ({'line.fair': 'There was a fair.', 'line.fire': 'A fire took a street.', 'line.secret': 'LEAK'})[k] ?? null;

test('witnessed events go to Around, heard-after-close to Missed; private, unworded and out-of-span events stay out', () => {
    const r = digestRowsFromEvents(book, 'me', {fromDay: 4, toDay: 8}, ctx, text);
    assert.deepEqual(r.around.map(x => x.text), ['There was a fair.']);
    assert.deepEqual(r.missed.map(x => x.text), ['A fire took a street.']);
    assert.equal(r.around[0].at, 5 * 1440 + 480);
    assert.ok(!JSON.stringify(r).includes('LEAK') && !JSON.stringify(r).includes('public_event'));
    const later = digestRowsFromEvents(book, 'me', {fromDay: 6, toDay: 8}, ctx, text);
    assert.deepEqual([later.around.length, later.missed.length], [0, 1]);
});
