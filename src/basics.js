// Shared leaf helpers (AR3, AR5). This module imports nothing, so any module may
// import it without creating a cycle. Each export is the one body that many files
// used to re-declare byte for byte; a file whose copy differed (other error text,
// other depth limit, truthy-returning predicate, different argument order) keeps
// its own and is listed in docs/reviews/DEDUP_AUDIT_2026-10-18/L1_REPORT.md.
// Do not change a body here without reading every importer: they all share it.

// Validation primitives.
export const check = (ok, message) => {if(!ok) throw new Error(message);};
export const natural = n => Number.isSafeInteger(n) && n >= 0;
export const positive = n => Number.isSafeInteger(n) && n > 0;
export const finite = v => Number.isFinite(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER;
// Strict boolean: a non-null, non-array object. Never returns the operand.
export const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);

// Copies and freezing.
export const copy = v => structuredClone(v);
// JSON round trip: drops undefined, turns NaN/Infinity into null. Not interchangeable with copy.
export const copyJson = v => JSON.parse(JSON.stringify(v));
export const deepFreeze = v => {if(v && typeof v === 'object') {Object.values(v).forEach(deepFreeze); Object.freeze(v);} return v;};
// Skips the whole subtree of an already-frozen value, so a frozen parent with a mutable child stays mutable.
export const deepFreezeUnlessFrozen = v => {
    if(v && typeof v === 'object' && !Object.isFrozen(v)) {Object.values(v).forEach(deepFreezeUnlessFrozen); Object.freeze(v);}
    return v;
};

// Equality. The two meanings differ and must not be swapped:
// sameJson is key-order sensitive and treats undefined-valued keys as absent.
export const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// sameStructural ignores key order and compares own enumerable string keys recursively.
export const sameStructural = (a, b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => sameStructural(v, b[i]));
    return object(a) && object(b) && Object.keys(a).length === Object.keys(b).length &&
        Object.keys(a).every(k => Object.hasOwn(b, k) && sameStructural(a[k], b[k]));
};

// Rule predicate builders. Parameter names are the emitted keys, so they must not be renamed.
export const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
// No reason argument; a third argument is ignored.
export const eqNoReason = (fact, value = true) => ({fact, op: 'eq', value});
// No default value: an omitted value stays undefined and fails predicate validation.
export const eqRaw = (fact, value) => ({fact, op: 'eq', value});
export const eqRawReason = (fact, value, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
export const gte = (fact, value) => ({fact, op: 'gte', value});
export const all = (...rules) => ({all: rules});
// Drops falsy rules before combining.
export const allTruthy = (...rules) => ({all: rules.filter(Boolean)});
export const any = (...rules) => ({any: rules});
export const not = rule => ({not: rule});
