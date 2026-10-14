import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {address, compareCodePoints, hash64, drawU32, drawFraction, indexFromU32,
    pickWeighted, pickStratified, shuffleBag, next, pity, sampleAndScore, withRetries, peek, commit} from '../src/gen_kit.js';

const RANGE = 0x100000000;
const clone = value => JSON.parse(JSON.stringify(value));
const table = [{id: 'a', weight: 2}, {id: 'b', weight: 3}, {id: 'c', weight: 5}];
const weight = item => item.weight;
const key = address('storylet', {world: 'base.frontier', life: 2, day: 12, slot: 'offer'});
const band = (actual, expected, width) => assert.ok(Math.abs(actual - expected) <= width, `${actual} outside ${expected} +/- ${width}`);

test('addressed draws repeat across calls without mutating inputs', () => {
    const input = {subject: 'npc:oren', day: 12, nested: {b: 2, a: 1}}, before = clone(input);
    const first = drawU32(1234, address('stock', input));
    for (let i = 0; i < 100; i++) {
        assert.equal(drawU32(1234, address('stock', input)), first);
        assert.equal(drawFraction(1234, address('stock', input)), first / RANGE);
        assert.ok(Number.isInteger(first) && first >= 0 && first < RANGE);
    }
    assert.deepEqual(input, before);
});

test('adding or reordering draws in one address never shifts another', () => {
    const baseline = Array.from({length: 40}, (_, day) => drawU32(98, address('combat', {day, world: 'village', life: 1})));
    for (let i = 0; i < 500; i++) drawU32(98, address('market', {extra: i}));
    for (let day = 39; day >= 0; day--) assert.equal(drawU32(98, address('combat', {life: 1, world: 'village', day})), baseline[day]);
});

test('world, life, revision, slot, attempt and root participate in draw addresses', () => {
    const base = {world: 'village', life: 1, table: 'offers@1', slot: 'card', attempt: 0};
    const results = [drawU32(0, address(base)), drawU32(1, address(base)), drawU32('0', address(base))];
    for (const [field, value] of [['world', 'other'], ['life', 2], ['table', 'offers@2'], ['slot', 'quality'], ['attempt', 1]]) {
        results.push(drawU32(0, address({...base, [field]: value})));
    }
    assert.equal(new Set(results).size, results.length);
});

test('recursive key insertion order and integer-like key enumeration do not matter', () => {
    const a = {z: {b: 2, a: 1}, '2': 2, '10': 10, a: true};
    const b = {a: true, '10': 10, '2': 2, z: {a: 1, b: 2}};
    const c = Object.assign(Object.create(null), b);
    assert.equal(address(a), address(b));
    assert.equal(address(a), address(c));
    assert.equal(drawU32('world', address(a)), drawU32('world', address(b)));
    assert.ok(address(a).indexOf('"10"') < address(a).indexOf('"2"'));
    assert.notEqual(address({a: 1}), address([['a', 1]]));
    assert.notEqual(address('a/b', 'c'), address('a', 'b/c'));
    assert.notEqual(address(1), address('1'));
    assert.notEqual(address(['a', 'b']), address(['b', 'a']));
});

test('string ordering is code point based and independent of table order or locale', () => {
    const old = String.prototype.localeCompare;
    try {
        String.prototype.localeCompare = () => { throw Error('Locale sort is forbidden'); };
        assert.deepEqual(['\u{10000}', '\uffff', 'é', 'Z', 'a'].sort(compareCodePoints), ['Z', 'a', 'é', '\uffff', '\u{10000}']);
        const items = [{id: '\u{10000}', weight: 1}, {id: '\uffff', weight: 1}];
        assert.equal(pickWeighted(items, weight, 0).value.id, '\uffff');
        assert.deepEqual(pickWeighted(items, weight, 123), pickWeighted([...items].reverse(), weight, 123));
        assert.equal(address({'\u{10000}': 2, '\uffff': 1}), address({'\uffff': 1, '\u{10000}': 2}));
    } finally { String.prototype.localeCompare = old; }
});

test('address/root validation rejects lossy, non-JSON and cyclic data', () => {
    const cyclic = {}; cyclic.self = cyclic;
    for (const bad of [undefined, NaN, Infinity, 0.2, 1n, () => 1, new Set(), cyclic, [1, , 2], {[Symbol('x')]: 1}]) {
        assert.throws(() => address(bad));
    }
    for (const root of [-1, RANGE, NaN, {}, '']) assert.throws(() => drawU32(root, key));
    assert.throws(() => drawU32(1, ''));
    assert.equal(address(-0), address(0));
});

test('hash lanes match P1 ASCII arithmetic while keeping low surrogates distinct', () => {
    // Read-only P1 reference convention, deliberately local to avoid a dependency
    // on an unmerged branch. P1 seeded_streams.js:14-21,47-50.
    const p1Hash = (seed, text) => {
        let n = seed; for (const ch of text) n = Math.imul(n ^ ch.charCodeAt(0), 16777619) >>> 0;
        return n || 1;
    };
    const p1Mix = n => {
        n = Math.imul(n ^ (n >>> 16), 0x85ebca6b);
        n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
        return (n ^ (n >>> 16)) >>> 0;
    };
    assert.equal(hash64(1234, key).lo, p1Mix(p1Hash(1234, JSON.stringify([1234, key]))));
    assert.equal(p1Hash(1, '😀'), p1Hash(1, '😁'));
    assert.notDeepEqual(hash64(1, '😀'), hash64(1, '😁'));
    assert.notEqual(drawU32(1, '😀'), drawU32(1, '😁'));
});

test('multiply-high has a one-input bias bound over the full uint32 domain for n=1..31', () => {
    const range = BigInt(RANGE), ceilDiv = (a, b) => (a + b - 1n) / b;
    for (let size = 1; size <= 31; size++) {
        const populations = [];
        for (let bucket = 0; bucket < size; bucket++) {
            const lo = ceilDiv(BigInt(bucket) * range, BigInt(size));
            const hi = ceilDiv(BigInt(bucket + 1) * range, BigInt(size));
            populations.push(Number(hi - lo));
            assert.equal(indexFromU32(Number(lo), size), bucket);
            assert.equal(indexFromU32(Number(hi - 1n), size), bucket);
        }
        assert.ok(Math.max(...populations) - Math.min(...populations) <= 1);
        assert.equal(populations.reduce((a, b) => a + b, 0), RANGE);
    }
    assert.equal(indexFromU32(2, 3), 0); // Would be 2 with modulo.
    assert.equal(indexFromU32(RANGE - 1, RANGE), RANGE - 1);
    for (const [draw, size] of [[-1, 3], [RANGE, 3], [0.1, 3], [0, 0], [0, RANGE + 1]]) assert.throws(() => indexFromU32(draw, size));
});

test('integer weighted boundaries skip zeros and return reasons and top contributors', () => {
    const items = [{id: 'zero', weight: 0}, ...table];
    const explained = item => ({weight: item.weight, reason: `base:${item.id}`});
    const first = pickWeighted(items, explained, 0), last = pickWeighted(items, explained, RANGE - 1);
    assert.equal(first.value.id, 'a'); assert.equal(last.value.id, 'c');
    assert.equal(first.receipt.total, 10); assert.equal(first.receipt.reason, 'base:a');
    assert.deepEqual(first.receipt.top, [{id: 'c', weight: 5, reason: 'base:c'}, {id: 'b', weight: 3, reason: 'base:b'}, {id: 'a', weight: 2, reason: 'base:a'}]);
    assert.equal(pickWeighted(table, weight, Math.ceil(RANGE * 2 / 10)).value.id, 'b');
    assert.equal(pickWeighted(table, weight, Math.ceil(RANGE * 5 / 10)).value.id, 'c');
    assert.equal(pickWeighted([{id: 'a', weight: RANGE - 1}, {id: 'b', weight: 1}], weight, RANGE - 1).value.id, 'b');
});

test('empty and zero tables return explicit null picks without requiring a draw', () => {
    assert.deepEqual(pickWeighted([], weight), {value: null, receipt: {total: 0, roll: null, selected: null, top: [], reason: 'empty'}});
    assert.equal(pickWeighted([{id: 'a', weight: 0}], weight).receipt.reason, 'zero-weight');
});

test('weights reject fractions, negatives, duplicates and totals beyond resolution', () => {
    for (const bad of [-1, 0.2, NaN, RANGE + 1]) assert.throws(() => pickWeighted([{id: 'a', weight: bad}], weight, 0));
    assert.throws(() => pickWeighted([{id: 'a'}, {id: 'a'}], () => 1, 0));
    assert.throws(() => pickWeighted([{id: 'a'}], () => ({weight: 1}), 0));
    assert.throws(() => pickWeighted([{id: 'a'}, {id: 'b'}], () => RANGE, 0));
    assert.throws(() => pickWeighted([{weight: 1}], weight, 0));
    assert.throws(() => pickWeighted(table, weight, .5));
});

test('20000-root sweep keeps weighted and small-table distributions inside declared bands', () => {
    const counts = {a: 0, b: 0, c: 0}, buckets = Array(7).fill(0);
    for (let root = 0; root < 20000; root++) {
        const draw = drawU32(root, key), pick = pickWeighted(table, weight, draw);
        counts[pick.value.id]++;
        buckets[indexFromU32(drawU32(root, address('small-table')), 7)]++;
        assert.ok(pick.receipt.roll >= 0 && pick.receipt.roll < 10);
    }
    for (const item of table) band(counts[item.id] / 20000, item.weight / 10, .015);
    for (const count of buckets) band(count / 20000, 1 / 7, .012);
});

test('stratified category choices hold exactly as fifty items are added', () => {
    const categories = [{id: 'daily', weight: 3, items: [{id: 'd', weight: 1}]}, {id: 'rare', weight: 1, items: [{id: 'r', weight: 1}]}];
    const expanded = clone(categories);
    expanded[0].items.push(...Array.from({length: 50}, (_, i) => ({id: `d:${i}`, weight: 1})));
    let rare = 0;
    for (let root = 0; root < 6000; root++) {
        const draw = slot => drawU32(root, address('strata', slot));
        const a = pickStratified(categories, weight, weight, draw), b = pickStratified(expanded, weight, weight, draw);
        assert.deepEqual(a.receipt.category, b.receipt.category);
        assert.ok(b.value && b.receipt.item.total >= 1);
        if (a.receipt.category.selected === 'rare') rare++;
    }
    band(rare / 6000, .25, .025);
});

test('stratified empty/zero categories renormalize eligible shares and use distinct slots', () => {
    const calls = [], categories = [{id: 'empty', weight: 99, items: []}, {id: 'zero', weight: 99, items: [{id: 'z', weight: 0}]}, {id: 'live', weight: 1, items: table}];
    const pick = pickStratified(categories, weight, weight, slot => { calls.push(slot); return 0; });
    assert.equal(pick.receipt.category.selected, 'live'); assert.equal(pick.receipt.category.total, 1);
    assert.deepEqual(calls, [address('category'), address('item', 'live')]);
    assert.equal(pickStratified([], weight, weight, () => { throw Error('Empty pick drew'); }).value, null);
    assert.equal(pickStratified(categories.slice(0, 2), weight, weight, () => { throw Error('Zero pick drew'); }).value, null);
});

test('bags visit each stable ID once per cycle and leave original state untouched', () => {
    let bag = shuffleBag(55, 'offers', ['c', 'a', 'b']), first = clone(bag);
    for (let cycle = 0; cycle < 30; cycle++) {
        const values = [];
        for (let i = 0; i < 3; i++) { const result = next(bag); bag = result.state; values.push(result.value); }
        assert.deepEqual(values.sort(compareCodePoints), ['a', 'b', 'c']);
        assert.equal(bag.cycle, cycle + 1);
    }
    const original = shuffleBag(55, 'offers', ['c', 'a', 'b']); next(original);
    assert.deepEqual(original, first);
    assert.deepEqual(shuffleBag(55, 'offers', ['a', 'b', 'c']), original);
});

test('bag save/reload/import JSON roundtrips retain the same next value across refills', () => {
    let live = shuffleBag('world', key, ['a', 'b', 'c', 'd']);
    for (let i = 0; i < 32; i++) {
        const saved = clone(live), imported = JSON.parse(JSON.stringify(saved));
        assert.deepEqual(next(live), next(imported));
        live = next(live).state;
    }
});

test('bags handle empty sets and reject incompatible or corrupted JSON state', () => {
    assert.equal(next(shuffleBag(0, 'empty', [])).value, null);
    for (const change of [s => s.schema = 2, s => s.cycle = -1, s => s.ids.reverse(), s => s.remaining = ['unknown'], s => s.remaining = ['a', 'a'], s => s.remaining = ['a']]) {
        const bad = shuffleBag(1, 'bag', ['a', 'b']); change(bad); assert.throws(() => next(bad));
    }
    assert.throws(() => shuffleBag(1, 'bag', ['a', 'a']));
    assert.throws(() => shuffleBag(1, 'bag', ['a', , 'b']));
    const exhausted = shuffleBag(1, 'bag', ['a']); exhausted.cycle = Number.MAX_SAFE_INTEGER;
    assert.throws(() => next(exhausted));
});

test('pity resets on natural hits and guarantees the world-supplied eligible interval', () => {
    let misses = 0;
    for (let i = 0; i < 9; i++) {
        const result = pity(misses, false, {every: 3});
        assert.equal(result.hit, i % 3 === 2); assert.equal(result.forced, result.hit); misses = result.misses;
    }
    assert.deepEqual(pity(2, true, {every: 3}), {hit: true, forced: false, misses: 0});
    assert.deepEqual(pity(0, false, {every: 1}), {hit: true, forced: true, misses: 0});
    for (const args of [[-1, false, {every: 3}], [0, false, {every: 0}], [0, 1, {every: 3}]]) assert.throws(() => pity(...args));
});

test('sample and score uses integer ranks and deterministic code point tie keys', () => {
    const candidates = [{id: 'z', rank: -2}, {id: '\u{10000}', rank: 7}, {id: '\uffff', rank: 7}];
    const result = sampleAndScore(3, i => candidates[i], value => value.rank);
    assert.equal(result.value.id, '\uffff'); assert.equal(result.receipt.selected, 2);
    assert.equal(sampleAndScore(3, i => [...candidates].reverse()[i], value => value.rank).value.id, result.value.id);
    assert.equal(sampleAndScore(2, i => ({id: 'same', i}), () => 0).value.i, 0);
    assert.equal(sampleAndScore(2, i => ({id: String(i)}), (_, i) => i ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER).value.id, '1');
    assert.throws(() => sampleAndScore(0, () => 1, () => 1));
    assert.throws(() => sampleAndScore(1, () => ({id: 'a'}), () => .2));
    assert.throws(() => sampleAndScore(1, () => 1, () => 1, () => 1));
});

test('retries address each attempt and success reports rejected count without a fallback', () => {
    const keys = [], options = {max: 4, fallback: {id: 'quiet', value: null}, address: key};
    const result = withRetries((at, attempt) => { keys.push(at); return {attempt, roll: drawU32(12, at)}; }, value => value.attempt === 2, options);
    assert.equal(result.value.attempt, 2); assert.equal(result.receipt.attempts, 3); assert.equal(result.receipt.rejected, 2);
    assert.equal(result.receipt.fallbackCount, 0); assert.equal(result.receipt.fallbackUsed, false);
    assert.deepEqual(keys, [0, 1, 2].map(attempt => address(key, {attempt})));
    assert.equal(new Set(keys).size, 3);
    const untouched = drawU32(12, address('other-subject'));
    withRetries(at => drawU32(12, at), () => false, options);
    assert.equal(drawU32(12, address('other-subject')), untouched);
});

test('retry caps and named fallback receipts expose exact aggregate fallback count', () => {
    let attempts = 0, fallbacks = 0;
    for (let i = 0; i < 10; i++) {
        const result = withRetries((_, n) => { attempts++; return n; }, n => i < 4 && n === 1,
            {max: 3, fallback: {id: 'authored.quiet', value: null}, address: address('subject', i)});
        fallbacks += result.receipt.fallbackCount;
        assert.equal(result.receipt.fallbackUsed, i >= 4);
        assert.equal(result.receipt.fallbackId, i >= 4 ? 'authored.quiet' : null);
    }
    assert.equal(fallbacks, 6); assert.equal(attempts, 26);
    const immediate = withRetries(() => { throw Error('Zero cap generated'); }, () => false, {max: 0, fallback: {id: 'quiet', value: 0}, address: key});
    assert.equal(immediate.value, 0); assert.equal(immediate.receipt.attempts, 0); assert.equal(immediate.receipt.fallbackCount, 1);
});

test('retry programmer errors propagate rather than silently becoming authored fallbacks', () => {
    const options = {max: 1, fallback: {id: 'quiet', value: null}, address: key};
    assert.throws(() => withRetries(() => { throw Error('bug'); }, () => false, options), /bug/);
    assert.throws(() => withRetries(() => 1, () => 1, options), /boolean/);
    assert.throws(() => withRetries(() => 1, () => false, {...options, max: -1}));
    assert.throws(() => withRetries(() => 1, () => false, {...options, fallback: {value: null}}));
});

test('peek/cancel never consume; commit returns the quoted value and a pure replacement cursor', () => {
    const cursor = {root: 1234, key, n: 0}, before = clone(cursor);
    const gen = at => pickWeighted(table, weight, drawU32(cursor.root, at));
    const quoted = peek(cursor, gen);
    for (let i = 0; i < 50; i++) assert.deepEqual(peek(cursor, gen), quoted);
    assert.deepEqual(cursor, before);
    const settled = commit(cursor, gen);
    assert.deepEqual(settled.value, quoted.value); assert.deepEqual(settled.receipt, quoted.receipt);
    assert.equal(settled.state.n, 1); assert.deepEqual(cursor, before);
    assert.deepEqual(peek(settled.state, gen), peek(clone(settled.state), gen));
    assert.deepEqual(commit(settled.state, gen), commit(clone(settled.state), gen));
    const other = {root: 1234, key: address('other-quote'), n: 0}, otherBefore = peek(other);
    commit(cursor); assert.deepEqual(peek(other), otherBefore);
    assert.throws(() => commit({...cursor, n: Number.MAX_SAFE_INTEGER}));
    assert.throws(() => peek({...cursor, n: -1}));
});

test('kit imports no runtime owner and uses no entropy, clock or locale APIs', () => {
    const source = readFileSync(new URL('../src/gen_kit.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\bimport\b|Math\.random|\bDate\b|localeCompare/);
    const oldRandom = Math.random;
    try {
        Math.random = () => { throw Error('Unseeded draw'); };
        assert.equal(typeof drawU32(1, key), 'number');
        assert.ok(pickWeighted(table, weight, drawU32(1, key)).value);
        assert.ok(next(shuffleBag(1, key, ['a', 'b'])).value);
    } finally { Math.random = oldRandom; }
});

function snapshot(root) {
    let bag = shuffleBag(root, address('deck', {world: 'base.frontier', life: 2}), ['a', 'b', 'c']);
    const bagValues = [];
    for (let i = 0; i < 5; i++) { const result = next(bag); bag = result.state; bagValues.push(result.value); }
    return {hash: hash64(root, key), draw: drawU32(root, key), fraction: drawFraction(root, key),
        pick: pickWeighted(table, weight, drawU32(root, key)).receipt, bagValues, cycle: bag.cycle, remaining: bag.remaining};
}
const top = [{id: 'c', weight: 5, reason: 'weightFn'}, {id: 'b', weight: 3, reason: 'weightFn'}, {id: 'a', weight: 2, reason: 'weightFn'}];
for (const [root, expected] of [
    [0, {hash: {lo: 339989609, hi: 930929483}, draw: 921751945, fraction: 0.21461209864355624,
        pick: {total: 10, roll: 2, selected: 'b', weight: 3, reason: 'weightFn', top}, bagValues: ['c', 'a', 'b', 'a', 'b'], cycle: 2, remaining: ['c']}],
    [1234, {hash: {lo: 363281478, hi: 2683084401}, draw: 716516231, fraction: 0.16682693525217474,
        pick: {total: 10, roll: 1, selected: 'a', weight: 2, reason: 'weightFn', top}, bagValues: ['c', 'a', 'b', 'b', 'c'], cycle: 2, remaining: ['a']}],
    ['village/world:7/life:2', {hash: {lo: 463267661, hi: 1460967525}, draw: 653325814, fraction: 0.1521142697893083,
        pick: {total: 10, roll: 1, selected: 'a', weight: 2, reason: 'weightFn', top}, bagValues: ['c', 'a', 'b', 'b', 'a'], cycle: 2, remaining: ['c']}],
]) test(`golden snapshot for root ${JSON.stringify(root)}`, () => assert.deepEqual(snapshot(root), expected));
