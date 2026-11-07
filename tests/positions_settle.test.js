import test from 'node:test';
import assert from 'node:assert/strict';
import {freshPositions, loadPositions, savePositions, positionsOf, registerPositionSource, settlePositions, endPositionsOnDeath, exitPosition, exitAt, migratePositions, withExit} from '../src/positions.js';

const DAY = 1440;
const state = {};
const row = (id, startedAt, endsAt) => ({id, institution: 'a yard', role: 'Hand', term: {type: 'contracted', startedAt, ...(endsAt != null ? {endsAt} : {})}, exit: {kinds: ['resign'], cost: 'none'}, source: 'test'});
registerPositionSource('settle-test', () => [row('t.fixed', 0, 14 * DAY), row('t.open', 5 * DAY)]);
const rows = () => positionsOf(state);
const byId = id => rows().find(r => r.id === id);

test('a two-week contract crossed by one 30-day step ends at day 14, not day 30', () => {
    loadPositions(freshPositions());
    assert.deepEqual(settlePositions(rows(), 30 * DAY), ['t.fixed']);
    assert.equal(byId('t.fixed').ended.kind, 'term_end');
    assert.equal(byId('t.fixed').ended.at, 14 * DAY);
    assert.equal(exitAt('t.fixed', 0), 14 * DAY);
    assert.equal(byId('t.open').ended, undefined, 'a post with no fixed end stays open');
});

test('a term not yet run out is left alone', () => {
    loadPositions(freshPositions());
    assert.deepEqual(settlePositions(rows(), 13 * DAY), []);
    assert.equal(savePositions(), undefined, 'nothing settled writes no key');
});

test('settling twice is a no-op', () => {
    loadPositions(freshPositions());
    settlePositions(rows(), 30 * DAY);
    const once = JSON.stringify(savePositions());
    assert.deepEqual(settlePositions(rows(), 30 * DAY), []);
    assert.deepEqual(settlePositions(rows(), 90 * DAY), []);
    assert.equal(JSON.stringify(savePositions()), once);
});

test('death ends open posts as died, keeps the record, and round-trips save and load', () => {
    loadPositions(freshPositions());
    assert.deepEqual(endPositionsOnDeath(rows(), 20 * DAY).sort(), ['t.fixed', 't.open']);
    assert.equal(byId('t.fixed').ended.kind, 'term_end', 'a term that ran out before the death keeps its true end');
    assert.equal(byId('t.open').ended.kind, 'died');
    assert.equal(byId('t.open').ended.at, 20 * DAY);
    const saved = JSON.parse(JSON.stringify(savePositions()));
    loadPositions(freshPositions());
    assert.equal(byId('t.open').ended, undefined);
    loadPositions(saved);
    assert.equal(byId('t.open').ended.kind, 'died');
    assert.deepEqual(JSON.parse(JSON.stringify(savePositions())), saved);
    assert.deepEqual(endPositionsOnDeath(rows(), 25 * DAY), [], 'a second death call changes nothing');
});

test('a post that ends by death before its term keeps the record for history', () => {
    loadPositions(freshPositions());
    endPositionsOnDeath(rows(), 3 * DAY);
    assert.equal(byId('t.fixed').ended.kind, 'died');
    assert.equal(byId('t.fixed').term.endsAt, 14 * DAY, 'the planned end stays on the record');
});

test('settled kinds are not offered as a choice, and a save without them loads as before', () => {
    loadPositions(freshPositions());
    assert.throws(() => exitPosition({...row('t.x', 0), exit: {kinds: ['died'], cost: ''}}, {kind: 'died', at: 1, reason: 'x'}), /no died exit/);
    const old = {family: 'positions@1', records: {a: {startedAt: 4, exit: {kind: 'resign', at: 9, reason: 'r'}}}};
    assert.deepEqual(migratePositions(old), old);
    loadPositions(old);
    assert.deepEqual(savePositions(), old);
    assert.equal(withExit(row('a', 4)).ended.kind, 'resign');
});
