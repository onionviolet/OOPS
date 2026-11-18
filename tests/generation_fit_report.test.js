// PSA30: the arithmetic behind scripts/generation_fit_report.mjs, on tiny synthetic inputs (the full report is not run here).
import test from 'node:test';
import assert from 'node:assert/strict';
import {foldOf, splitFold, uniformHit, totalVariation, pairSupport, rediscovery, shareShift, tupleKey, DIALS} from '../scripts/generation_fit_report.mjs';

const row = (id, verb, object, target, time) => ({id, parts: {verb, object, target, time}});

test('folds are deterministic, cover every row once and keep the canonTest hash', () => {
    const rows = Array.from({length: 40}, (_, i) => row(`r${i}`, 'a', 'b', 'c', 'd'));
    const a = splitFold(rows, 0), b = splitFold(rows, 0);
    assert.deepEqual(a.held.map(r => r.id), b.held.map(r => r.id));
    assert.equal(a.train.length + a.held.length, rows.length);
    const seen = new Set();
    for (let f = 0; f < DIALS.folds; f++) for (const r of splitFold(rows, f).held) { assert.ok(!seen.has(r.id)); seen.add(r.id); }
    assert.equal(seen.size, rows.length);
    assert.equal(foldOf('r7'), foldOf('r7'));
});

test('uniform baseline is 1-(1-1/S)^N and total variation is half the L1 distance', () => {
    assert.equal(uniformHit(1, 200), 1);
    assert.ok(Math.abs(uniformHit(100, 100) - (1 - 0.99 ** 100)) < 1e-12);
    assert.equal(uniformHit(0, 5), 0);
    assert.equal(totalVariation({x: 1, y: 1}, {x: 1, y: 1}), 0);
    assert.equal(totalVariation({x: 1}, {y: 1}), 1);
    assert.equal(totalVariation({x: 3, y: 1}, {x: 1, y: 1}), 0.25);
    assert.equal(totalVariation({}, {x: 1}), null);
});

test('pair support needs every conditioned pair in a train row, and counts copies of train sentences', () => {
    const train = [row('t1', 'add', 'vitality', 'self', 'instant'), row('t2', 'block', 'mind', 'area', 'lasting')];
    const gen = [train[0].parts,                                                  // copy, supported
        {verb: 'move', object: 'vitality', target: 'self', time: 'instant'},       // supported, not a copy
        {verb: 'add', object: 'vitality', target: 'area', time: 'instant'},        // object+target unseen
        {verb: 'add', object: 'mind', target: 'area', time: 'instant'}];           // object+time unseen
    const s = pairSupport(gen, train);
    assert.deepEqual([s.items, s.supported, s.rate, s.copiesOfTrain, s.copyRate], [4, 2, 0.5, 1, 0.25]);
});

test('rediscovery headline counts only held-out tuples absent from train, against the uniform baseline', () => {
    const train = [row('t1', 'add', 'vitality', 'self', 'instant')];
    const held = [row('h1', 'add', 'vitality', 'self', 'instant'), row('h2', 'block', 'mind', 'area', 'lasting'), row('h3', 'move', 'position', 'bound', 'instant')];
    const gen = [train[0].parts, held[1].parts];
    const r = rediscovery(gen, held, train, 100, 100);
    assert.deepEqual([r.held, r.hits, r.novel, r.novelHits, r.novelRate], [3, 2, 2, 1, 0.5]);
    assert.equal(r.baseline, Math.round(uniformHit(100, 100) * 1000) / 1000);
    assert.equal(r.ratio, Math.round(0.5 / r.baseline * 1000) / 1000);
    assert.equal(tupleKey(held[1].parts), 'block|mind|area|lasting');
});

test('share shift reports the worst closed slot', () => {
    const train = [row('a', 'add', 'x', 'self', 'instant'), row('b', 'add', 'x', 'self', 'instant')];
    const gen = [{verb: 'add', object: 'x', target: 'self', time: 'instant'}, {verb: 'add', object: 'y', target: 'self', time: 'instant'}];
    const s = shareShift(gen, train, ['verb', 'object', 'target']);
    assert.deepEqual([s.perSlot.verb, s.perSlot.object, s.worst, s.worstValue], [0, 0.5, 'object', 0.5]);
});
