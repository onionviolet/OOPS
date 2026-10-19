import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as basics from '../src/basics.js';
import * as rng from '../src/hash_rng.js';
import {hashStreamSeed, xorshift32, mix32} from '../src/seeded_streams.js';
import {deriveSimulationSeed} from '../src/simulation_resolution.js';
import {seededStartRng} from '../src/start_records.js';
import {assert as contractAssert, record, natural, finite, copy} from '../src/simulation_contracts.js';

// Reference copies of the inline bodies the leaves replaced (AR9: structure moves, behavior does not).
const oldHash = (seed, id) => {let n = seed; for(const ch of id) n = Math.imul(n ^ ch.charCodeAt(0), 16777619) >>> 0; return n || 1;};
const oldXorshift = n => {n ^= n << 13; n ^= n >>> 17; n ^= n << 5; return n >>> 0;};
const oldNpcHash = s => {let n = 2166136261; for(const c of s) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return n >>> 0;};
const oldStartRng = seed => {
    let h = 2166136261;
    for(const c of String(seed)) {h ^= c.charCodeAt(0); h = Math.imul(h, 16777619);}
    return () => {h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296;};
};
const oldMix = n => {n = Math.imul(n ^ (n >>> 16), 0x85ebca6b); n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35); return (n ^ (n >>> 16)) >>> 0;};
const samples = ['', 'a', 'world.services', 'café', '\u{1F600}x', JSON.stringify([7, 'ev.id']), 'Z'.repeat(40)];
const numbers = [0, 1, 2, 7, 255, 2166136261, 0x7fffffff, 0x80000000, 0xffffffff, 123456789];

test('leaf modules import nothing', () => {
    for(const f of ['basics.js', 'hash_rng.js']) {
        const source = readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
        assert.equal(/^\s*import\b|\brequire\(|\bimport\(/m.test(source), false, f);
    }
});

test('hash and xorshift leaves reproduce the old inline bodies exactly', () => {
    for(const seed of numbers) for(const text of samples) {
        assert.equal(rng.hashStreamSeed(seed, text), oldHash(seed, text));
        assert.equal(deriveSimulationSeed(seed, text), oldHash(seed, text));
    }
    for(const n of numbers) {
        assert.equal(rng.xorshift32(n), oldXorshift(n));
        assert.equal(rng.mix32(n), oldMix(n));
    }
    for(const text of samples) assert.equal(rng.fnv1a(2166136261, text), oldNpcHash(text));
    for(const seed of [0, 1, 42, 'abc', 123456789, -5, '\u{1F600}']) {
        const a = seededStartRng(seed), b = oldStartRng(seed);
        for(let i = 0; i < 8; i++) assert.equal(a(), b());
    }
});

test('seeded_streams keeps its old exports as the leaf functions', () => {
    assert.equal(hashStreamSeed, rng.hashStreamSeed);
    assert.equal(xorshift32, rng.xorshift32);
    assert.equal(mix32, rng.mix32);
});

test('simulation_contracts still exports the primitives, now from the leaf', () => {
    assert.equal(contractAssert, basics.check);
    assert.equal(record, basics.object);
    assert.equal(natural, basics.natural);
    assert.equal(finite, basics.finite);
    assert.equal(copy, basics.copy);
});

test('validation primitives', () => {
    assert.throws(() => basics.check(false, 'boom'), /^Error: boom$/);
    assert.equal(basics.check(true, 'x'), undefined);
    assert.deepEqual([0, 3, -1, 1.5, NaN, '1', 2 ** 53].map(basics.natural), [true, true, false, false, false, false, false]);
    assert.deepEqual([0, 3, -1].map(basics.positive), [false, true, false]);
    assert.deepEqual([null, undefined, 0, '', [], {}, new Date()].map(basics.object), [false, false, false, false, false, true, true]);
    assert.equal(basics.finite(2 ** 53), false);
    assert.equal(basics.finite(5), true);
});

test('equality helpers keep their two distinct meanings', () => {
    assert.equal(basics.sameJson({a: 1, b: 2}, {b: 2, a: 1}), false);
    assert.equal(basics.sameStructural({a: 1, b: 2}, {b: 2, a: 1}), true);
    assert.equal(basics.sameJson({a: undefined}, {}), true);
    assert.equal(basics.sameStructural({a: undefined}, {}), false);
    assert.equal(basics.sameStructural([1, {x: [2]}], [1, {x: [2]}]), true);
    assert.equal(basics.sameStructural([1], {0: 1}), false);
});

test('copy helpers and freezers', () => {
    const source = {a: undefined, n: NaN, d: new Date(0)};
    assert.equal(Object.hasOwn(basics.copy(source), 'a'), true);
    assert.equal(Object.hasOwn(basics.copyJson(source), 'a'), false);
    assert.equal(basics.copyJson(source).n, null);
    const frozen = basics.deepFreeze({a: {b: [1]}});
    assert.equal(Object.isFrozen(frozen.a.b), true);
    const parent = Object.freeze({child: {x: 1}});
    basics.deepFreezeUnlessFrozen(parent);
    assert.equal(Object.isFrozen(parent.child), false);
    basics.deepFreeze(parent);
    assert.equal(Object.isFrozen(parent.child), true);
});

test('rule builders emit the exact shapes the content files used', () => {
    assert.deepEqual(basics.eq('f'), {fact: 'f', op: 'eq', value: true});
    assert.deepEqual(basics.eq('f', 3, 'why'), {fact: 'f', op: 'eq', value: 3, reason: 'why'});
    assert.deepEqual(basics.eqNoReason('f', 1, 'ignored'), {fact: 'f', op: 'eq', value: 1});
    assert.equal(Object.hasOwn(basics.eqRaw('f'), 'value'), true);
    assert.equal(basics.eqRaw('f').value, undefined);
    assert.deepEqual(basics.eqRawReason('f', 1), {fact: 'f', op: 'eq', value: 1});
    assert.deepEqual(basics.gte('f', 2), {fact: 'f', op: 'gte', value: 2});
    assert.deepEqual(basics.all(1, null), {all: [1, null]});
    assert.deepEqual(basics.allTruthy(1, null, 0, 2), {all: [1, 2]});
    assert.deepEqual(basics.any(1), {any: [1]});
    assert.deepEqual(basics.not(1), {not: 1});
});
