import {registerDomain} from './domain_registry.js';
// Defeat publisher (CBL1, CBR2/CBR5, 2026-10-19). Every way a fight ends for the hero is published
// here once, as a typed outcome plus a separate cause. Native combat has one outcome today
// (unconscious), so behavior is unchanged; later outcomes (yielded, escaped, captured ...) and the
// saved battles (CBL3) publish through the same function. The legacy `total_deaths` counter stays
// where it is for save compatibility and titles (CBX5); it is not a death count.
export const DEFEAT_OUTCOMES = Object.freeze(['unconscious', 'knocked_out', 'yielded', 'routed', 'captured', 'withdrew', 'escaped', 'killed']);
const CAUSE_KINDS = new Set(['combat', 'harm']);
let state = null;
const fresh = () => ({schema: 1, counts: {}, last: null});
export function defeatState() { return state; }
export function setDefeatState(value) { state = value ?? fresh(); }
// Native transactions bind this so a rolled-back strike also rolls back its publication.
export const defeatBinding = Object.freeze({get: () => state, set: setDefeatState});

const text = v => typeof v === 'string' && v.length > 0 && v.length <= 200;
function checkCause(cause) {
    if (cause === null || typeof cause !== 'object' || Array.isArray(cause) || !CAUSE_KINDS.has(cause.kind)) throw Error('Invalid defeat cause.');
    if (Object.keys(cause).some(k => !['kind', 'place', 'by'].includes(k))) throw Error('Invalid defeat cause.');
    if (cause.place != null && !text(cause.place)) throw Error('Invalid defeat place.');
    if (!Array.isArray(cause.by) || cause.by.length > 50 || !cause.by.every(text)) throw Error('Invalid defeat opponents.');
}
export function validateDefeat(slice) {
    if (slice == null) return;
    if (slice.schema !== 1 || slice.counts === null || typeof slice.counts !== 'object' || Array.isArray(slice.counts)) throw Error('Invalid defeat slice.');
    for (const [outcome, n] of Object.entries(slice.counts))
        if (!DEFEAT_OUTCOMES.includes(outcome) || !Number.isSafeInteger(n) || n < 1) throw Error('Invalid defeat count.');
    if (slice.last === null) { if (Object.keys(slice.counts).length) throw Error('Defeat counts need a last record.'); return; }
    if (typeof slice.last !== 'object' || !slice.counts[slice.last.outcome] || Object.keys(slice.last).some(k => !['outcome', 'cause'].includes(k))) throw Error('Invalid last defeat.');
    checkCause(slice.last.cause);
}

// The cause as the fight shows it: where, and who was still standing. Opponents are named as the
// game names them; this records the event, it does not reveal hidden stats (AD8).
export function combatDefeat(location, combat) {
    const by = (combat?.defenders ?? []).filter(e => e?.is_alive && text(e.name)).map(e => e.name);
    return {outcome: 'unconscious', cause: {kind: 'combat', place: text(location?.id) ? location.id : null, by: [...new Set(by)]}};
}

// One publication per actual outcome. With `commit`, the record is part of that durable write:
// it is in place while the save is built and undone if the write throws.
export function publishDefeat({outcome = 'unconscious', cause}, commit = null) {
    if (!DEFEAT_OUTCOMES.includes(outcome)) throw Error(`Unknown defeat outcome: ${outcome}`);
    checkCause(cause);
    const before = state ?? fresh(), record = {outcome, cause: structuredClone(cause)};
    state = {...before, counts: {...before.counts, [outcome]: (before.counts[outcome] ?? 0) + 1}, last: record};
    if (commit) try { commit(); } catch (error) { state = before; throw error; }
    return record;
}

registerDomain({id: 'defeat', deps: [], initialState: () => null,
    save: () => state && state.last ? structuredClone(state) : undefined,
    validate: slice => validateDefeat(slice),
    // Old saves have no slice: the record starts empty. `total_deaths` keeps the old history.
    migrate: slice => slice == null ? fresh() : structuredClone(slice),
    load: setDefeatState,
    projection: () => structuredClone(state ?? fresh()),
});
