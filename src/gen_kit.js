// Proposal: pure generation helpers. E1/P1 own live roots, storage and saves.
// Pass the existing stream root, not the legacy seed; include world/life/table
// revision in addresses. No runtime owner is imported or changed here.
const RANGE = 0x100000000;
const natural = n => Number.isSafeInteger(n) && n >= 0;
const uint = n => Number.isInteger(n) && n >= 0 && n < RANGE;
const plain = v => v !== null && typeof v === 'object' &&
    (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
const requireKey = key => {
    if (typeof key !== 'string' || !key.length) throw TypeError('Expected a nonempty address or ID.');
};
const requireRoot = root => {
    if (!uint(root) && (typeof root !== 'string' || !root.length)) throw TypeError('Expected a uint32 or string root.');
};

// True Unicode code point order, including supplementary characters. No locale.
export function compareCodePoints(a, b) {
    const left = [...a], right = [...b];
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
        const delta = left[i].codePointAt(0) - right[i].codePointAt(0);
        if (delta) return delta;
    }
    return left.length - right.length;
}
function canonical(value, parents = new Set()) {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
    if (Number.isSafeInteger(value)) return value === 0 ? 0 : value;
    if (!Array.isArray(value) && !plain(value)) throw TypeError('Address parts must be integer JSON data.');
    if (parents.has(value)) throw TypeError('Cyclic address.');
    if (Object.getOwnPropertySymbols(value).length) throw TypeError('Symbol address keys are unsupported.');
    parents.add(value);
    let result;
    if (Array.isArray(value)) {
        if (Object.keys(value).length !== value.length) throw TypeError('Expected a dense address array.');
        result = ['array', Array.from(value, part => canonical(part, parents))];
    } else {
        result = ['object', Object.keys(value).sort(compareCodePoints).map(key => [key, canonical(value[key], parents)])];
    }
    parents.delete(value);
    return result;
}
// Positional parts and arrays retain order; named fields sort recursively.
// Tagged containers prevent an array from impersonating a sorted object.
export function address(...parts) {
    return JSON.stringify(parts.map(part => canonical(part)));
}
function mix32(n) {
    n = Math.imul(n ^ (n >>> 16), 0x85ebca6b);
    n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
    return (n ^ (n >>> 16)) >>> 0;
}
function hashLane(seed, text) {
    let n = seed;
    // P1's multiplier, but every UTF-16 unit: its for-of/charCodeAt(0) drops
    // low surrogates, making some distinct supplementary characters collide.
    for (let i = 0; i < text.length; i++) n = Math.imul(n ^ text.charCodeAt(i), 16777619) >>> 0;
    return n || 1;
}
export function hash64(root, key) {
    requireRoot(root); requireKey(key);
    const seed = uint(root) ? root : hashLane(2166136261, root);
    const text = JSON.stringify([root, key]);
    return {lo: mix32(hashLane(seed, text)), hi: mix32(hashLane((seed ^ 0x9e3779b9) >>> 0, text))};
}
export function drawU32(root, key) {
    const {lo, hi} = hash64(root, key);
    return mix32(lo ^ hi);
}
// The sole fractional API. All picks and state calculations use integers.
export function drawFraction(root, key) {
    return drawU32(root, key) / RANGE;
}
// Multiply-high, not modulo: at most one of 2^32 inputs separates bucket
// populations. BigInt keeps the product exact even at the largest table size.
export function indexFromU32(draw, size) {
    if (!uint(draw) || !natural(size) || size < 1 || size > RANGE) throw RangeError('Invalid draw or size.');
    return Number((BigInt(draw) * BigInt(size)) >> 32n);
}
function sortedIds(ids) {
    if (!Array.isArray(ids)) throw TypeError('Expected an ID array.');
    Array.from(ids).forEach(requireKey);
    const sorted = [...ids].sort(compareCodePoints);
    if (new Set(sorted).size !== sorted.length) throw TypeError('Duplicate ID.');
    return sorted;
}
function rows(items, weightFn) {
    if (!Array.isArray(items) || typeof weightFn !== 'function') throw TypeError('Expected items and weight function.');
    sortedIds(items.map(item => item?.id));
    return [...items].sort((a, b) => compareCodePoints(a.id, b.id)).map(item => {
        const raw = weightFn(item), weight = typeof raw === 'number' ? raw : raw?.weight;
        const reason = typeof raw === 'number' ? 'weightFn' : raw?.reason;
        if (!natural(weight) || weight > RANGE || typeof reason !== 'string') throw RangeError('Expected an integer weight and reason.');
        return {item, id: item.id, weight, reason};
    });
}
export function pickWeighted(items, weightFn, draw) {
    const entries = rows(items, weightFn), total = entries.reduce((n, row) => n + row.weight, 0);
    if (!natural(total) || total > RANGE) throw RangeError('Total weight exceeds the uint32 resolution.');
    if (!total) return {value: null, receipt: {total: 0, roll: null, selected: null, top: [], reason: entries.length ? 'zero-weight' : 'empty'}};
    const roll = indexFromU32(draw, total);
    let cursor = roll;
    const selected = entries.find(row => { cursor -= row.weight; return cursor < 0; });
    const top = entries.filter(row => row.weight > 0).sort((a, b) => b.weight - a.weight || compareCodePoints(a.id, b.id))
        .slice(0, 5).map(({id, weight, reason}) => ({id, weight, reason}));
    return {value: selected.item, receipt: {total, roll, selected: selected.id, weight: selected.weight, reason: selected.reason, top}};
}
// draw(slot) must return an addressed uint32. Category and item slots differ;
// only categories with positive item weight participate in category shares.
export function pickStratified(categories, categoryWeightFn, itemWeightFn, draw) {
    const eligible = rows(categories, categoryWeightFn).map(row => {
        const items = rows(row.item.items, item => itemWeightFn(item, row.item));
        const total = items.reduce((n, item) => n + item.weight, 0);
        if (!natural(total) || total > RANGE) throw RangeError('Item weight exceeds the uint32 resolution.');
        return {...row, items, weight: total ? row.weight : 0};
    });
    const byId = new Map(eligible.map(row => [row.id, row]));
    const categoryDraw = eligible.some(row => row.weight > 0) ? draw(address('category')) : 0;
    const category = pickWeighted(categories, item => byId.get(item.id), categoryDraw);
    if (!category.value) return {value: null, receipt: {category: category.receipt, item: null}};
    const itemRows = new Map(byId.get(category.value.id).items.map(row => [row.id, row]));
    const item = pickWeighted(category.value.items, value => itemRows.get(value.id), draw(address('item', category.value.id)));
    return {value: item.value, receipt: {category: category.receipt, item: item.receipt}};
}
// New opt-in JSON state, not a replacement for any existing saved RNG.
export function shuffleBag(root, key, ids) {
    requireRoot(root); requireKey(key);
    return {schema: 1, root, key, ids: sortedIds(ids), cycle: 0, remaining: []};
}
function validateBag(state) {
    if (!plain(state) || state.schema !== 1 || !natural(state.cycle)) throw TypeError('Invalid bag schema or cycle.');
    requireRoot(state.root); requireKey(state.key);
    const ids = sortedIds(state.ids), remaining = sortedIds(state.remaining);
    if (ids.some((id, i) => id !== state.ids[i]) || remaining.some(id => !ids.includes(id)) ||
        (state.cycle === 0 && remaining.length)) throw TypeError('Invalid bag contents.');
}
export function next(state) {
    validateBag(state);
    const updated = {...state, ids: [...state.ids], remaining: [...state.remaining]};
    if (!updated.ids.length) return {value: null, state: updated, receipt: {cycle: updated.cycle, empty: true}};
    if (!updated.remaining.length) {
        if (updated.cycle === Number.MAX_SAFE_INTEGER) throw RangeError('Bag cycle exhausted.');
        updated.remaining = [...updated.ids];
        for (let i = updated.remaining.length - 1; i > 0; i--) {
            const j = indexFromU32(drawU32(updated.root, address(updated.key, 'bag', {cycle: updated.cycle, slot: i})), i + 1);
            [updated.remaining[i], updated.remaining[j]] = [updated.remaining[j], updated.remaining[i]];
        }
        updated.cycle++;
    }
    return {value: updated.remaining.shift(), state: updated, receipt: {cycle: updated.cycle, empty: false}};
}
// Call only on eligible windows. The world supplies its own guarantee interval.
export function pity(misses, hit, {every}) {
    if (!natural(misses) || !natural(every) || every < 1 || typeof hit !== 'boolean') throw RangeError('Invalid pity inputs.');
    const forced = !hit && misses >= every - 1;
    return {hit: hit || forced, forced, misses: hit || forced ? 0 : misses + 1};
}
export function sampleAndScore(k, gen, score, tieBreak = value => value.id) {
    if (!natural(k) || k < 1) throw RangeError('Expected a positive sample count.');
    const samples = Array.from({length: k}, (_, index) => {
        const value = gen(index), rank = score(value, index), tie = tieBreak(value, index);
        if (!Number.isSafeInteger(rank) || typeof tie !== 'string') throw TypeError('Expected integer scores and string tie keys.');
        return {value, index, score: rank, tie};
    });
    samples.sort((a, b) => (a.score === b.score ? 0 : a.score > b.score ? -1 : 1) || compareCodePoints(a.tie, b.tie) || a.index - b.index);
    return {value: samples[0].value, receipt: {selected: samples[0].index, samples: samples.map(({index, score, tie}) => ({index, score, tie}))}};
}
// gen(attemptAddress, attempt), validate(value, attempt). Exceptions propagate;
// false validations retry. Authored fallback is explicit and bypasses validation.
export function withRetries(gen, validate, {max, fallback, address: base}) {
    requireKey(base);
    if (!natural(max) || !plain(fallback) || !Object.hasOwn(fallback, 'value')) throw TypeError('Expected a retry cap and named fallback value.');
    requireKey(fallback.id);
    for (let attempt = 0; attempt < max; attempt++) {
        const key = address(base, {attempt}), value = gen(key, attempt);
        const valid = validate(value, attempt);
        if (typeof valid !== 'boolean') throw TypeError('Validation must return a boolean.');
        if (valid) return {value, receipt: {address: key, attempts: attempt + 1, rejected: attempt, fallbackUsed: false, fallbackId: null, fallbackCount: 0}};
    }
    return {value: fallback.value, receipt: {address: address(base, {fallback: fallback.id}), attempts: max, rejected: max,
        fallbackUsed: true, fallbackId: fallback.id, fallbackCount: 1}};
}
// A caller-owned cursor view {root,key,n}, not another stream storage owner.
// gen(key) must be pure. Discard a quote to cancel; commit returns the same
// value plus replacement state. Only the caller installs that state atomically.
export function peek(cursor, gen = key => drawU32(cursor.root, key)) {
    requireRoot(cursor.root); requireKey(cursor.key);
    if (!natural(cursor.n)) throw RangeError('Invalid quote ordinal.');
    const key = address(cursor.key, {ordinal: cursor.n});
    return {value: gen(key), receipt: {address: key, ordinal: cursor.n}};
}
export function commit(cursor, gen) {
    if (cursor.n === Number.MAX_SAFE_INTEGER) throw RangeError('Quote ordinal exhausted.');
    return {...peek(cursor, gen), state: {...cursor, n: cursor.n + 1}};
}
