// beatLedger: the additive save slice for a beat-resolver run (src/beat_records.js), so a run
// survives Export/Import mid-window. The slice is the resolver's own state object
// {facts, done, day}; this module only validates, serializes and holds it. It resolves nothing.
//
// Compatibility (AR6): the slice is additive. A save without `beatLedger` loads as the empty
// ledger, and an empty ledger writes no key, so existing saves are neither rewritten nor grown.
// There is no migration of existing data; `schema` is 1 and any other value is rejected.
// The state is re-derivable by replaying from day 0 (beat_records.js), so a rejected slice
// costs a replay, not the save: validate runs before load and throws, load never half-applies.
import {registerDomain} from './domain_registry.js';
import {check, natural} from './basics.js';
import {BEAT_STATUSES, newBeatState} from './beat_records.js';

export const BEAT_LEDGER_SLICE = 'beatLedger';
export const BEAT_LEDGER_SCHEMA = 1;
const LIMITS = Object.freeze({facts: 5000, done: 5000, causes: 32, depth: 6, string: 2000});

const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
// A fact value or cause field must survive JSON unchanged: primitives, arrays and plain objects.
function jsonSafe(v, label, depth = 0) {
    check(depth <= LIMITS.depth, `${label} is nested too deeply.`);
    if (v === null || typeof v === 'boolean') return;
    if (typeof v === 'number') return check(Number.isFinite(v), `${label} must be a finite number.`);
    if (typeof v === 'string') return check(v.length <= LIMITS.string, `${label} is too long.`);
    if (Array.isArray(v)) return v.forEach((x, i) => jsonSafe(x, `${label}[${i}]`, depth + 1));
    check(plain(v), `${label} must be plain data.`);
    for (const [k, x] of Object.entries(v)) {
        check(k !== '__proto__', `${label} has a forbidden key.`);
        if (x !== undefined) jsonSafe(x, `${label}.${k}`, depth + 1);   // JSON drops undefined (a cause's `have`)
    }
}

export const emptyBeatLedger = () => newBeatState();
export const isEmptyBeatLedger = s => s.day === 0 && !Object.keys(s.facts).length && !Object.keys(s.done).length;

// Throws on any slice that is not a well-formed schema-1 ledger. Absent (null/undefined) is valid.
export function validateBeatLedger(slice) {
    if (slice == null) return;
    check(plain(slice), 'Beat ledger must be an object.');
    check(slice.schema === BEAT_LEDGER_SCHEMA, 'Unsupported beat ledger schema.');
    check(Object.keys(slice).every(k => ['schema', 'facts', 'done', 'day'].includes(k)), 'Beat ledger has unknown fields.');
    check(natural(slice.day), 'Beat ledger day must be a whole number.');
    check(plain(slice.facts) && Object.keys(slice.facts).length <= LIMITS.facts, 'Beat ledger facts must be a plain map.');
    for (const [k, v] of Object.entries(slice.facts)) {
        check(k && k !== '__proto__', 'Beat ledger fact key is invalid.');
        if (v !== undefined) jsonSafe(v, `Beat ledger fact ${k}`);
    }
    check(plain(slice.done) && Object.keys(slice.done).length <= LIMITS.done, 'Beat ledger done must be a plain map.');
    for (const [id, row] of Object.entries(slice.done)) {
        check(id && id !== '__proto__', 'Beat ledger beat id is invalid.');
        check(plain(row) && Object.keys(row).every(k => ['status', 'day', 'causes'].includes(k)), `Beat ${id}: malformed result.`);
        check(BEAT_STATUSES.includes(row.status), `Beat ${id}: unknown status.`);
        check(natural(row.day) && row.day > 0 && row.day <= slice.day, `Beat ${id}: result day is outside the ledger.`);
        check(Array.isArray(row.causes) && row.causes.length <= LIMITS.causes, `Beat ${id}: causes must be a short list.`);
        row.causes.forEach((c, i) => { check(plain(c), `Beat ${id}: cause ${i} must be an object.`); jsonSafe(c, `Beat ${id} cause ${i}`); });
    }
}

// Canonical stored form: JSON-normal (undefined fields dropped), so restore(serialize(s)) is stable.
export function serializeBeatLedger(state) {
    // Validate before normalizing: JSON would turn NaN into null and hide it.
    const candidate = {schema: BEAT_LEDGER_SCHEMA, facts: state.facts, done: state.done, day: state.day};
    validateBeatLedger(candidate);
    return JSON.parse(JSON.stringify(candidate));
}

// The resolver state a slice stands for; absent means the empty ledger. Validates first.
export function restoreBeatLedger(slice) {
    if (slice == null) return emptyBeatLedger();
    validateBeatLedger(slice);
    const {facts, done, day} = structuredClone(slice);
    return {facts, done, day};
}

let ledger = emptyBeatLedger();
const commit = state => { const slice = serializeBeatLedger(state); ledger = restoreBeatLedger(slice); return structuredClone(ledger); };

registerDomain({id: BEAT_LEDGER_SLICE, initialState: () => null,
    save: () => isEmptyBeatLedger(ledger) ? undefined : serializeBeatLedger(ledger),
    validate: validateBeatLedger,
    migrate: slice => slice == null ? null : structuredClone(slice),
    load: slice => { ledger = restoreBeatLedger(slice); },
    // `state` is the resolver state to keep; `commit` replaces the held ledger with it (checked first).
    commands: {state: () => structuredClone(ledger), commit},
    projection: () => structuredClone(ledger)});
