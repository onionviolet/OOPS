import {registerDomain} from './domain_registry.js';
// Defeat publisher (CBL1, CBR2/CBR5, 2026-10-19). Every way a fight ends for the hero is published
// here once, as a typed outcome plus a separate cause. Native combat has one outcome today
// (unconscious), so behavior is unchanged; later outcomes (yielded, escaped, captured ...) and the
// saved battles (CBL3) publish through the same function. The legacy `total_deaths` counter stays
// where it is for save compatibility and titles (CBX5); it is not a death count.
export const DEFEAT_OUTCOMES = Object.freeze(['unconscious', 'knocked_out', 'yielded', 'routed', 'captured', 'withdrew', 'escaped', 'killed']);
const CAUSE_KINDS = new Set(['combat', 'harm']);
// Death causes (G25, 2026-10-23): what ended a life, kept apart from the hero's unconscious outcomes (AD19, native
// defeat is not death). `age` is the ordinary case; `illness` and `mishap` come from a world's hardship dial. The slice
// keeps a capped tally and the last cause; who died and at what age belongs to the lessons that read it.
export const DEATH_CAUSES = Object.freeze(['age', 'illness', 'mishap', 'combat', 'harm']);
let state = null;
const fresh = () => ({schema: 1, counts: {}, last: null});
export function defeatState() { return state; }
export function setDefeatState(value) { state = value ?? fresh(); }
// Native transactions bind this so a rolled-back strike also rolls back its publication.
export const defeatBinding = Object.freeze({get: () => state, set: setDefeatState});

const text = v => typeof v === 'string' && v.length > 0 && v.length <= 200;
function checkCause(cause, kinds = CAUSE_KINDS) {
    if (cause === null || typeof cause !== 'object' || Array.isArray(cause) || !(kinds instanceof Set ? kinds.has(cause.kind) : kinds.includes(cause.kind))) throw Error('Invalid defeat cause.');
    if (Object.keys(cause).some(k => !['kind', 'place', 'by'].includes(k))) throw Error('Invalid defeat cause.');
    if (cause.place != null && !text(cause.place)) throw Error('Invalid defeat place.');
    if (!Array.isArray(cause.by) || cause.by.length > 50 || !cause.by.every(text)) throw Error('Invalid defeat opponents.');
}
export function validateDefeat(slice) {
    if (slice == null) return;
    if (slice.schema !== 1 || slice.counts === null || typeof slice.counts !== 'object' || Array.isArray(slice.counts)) throw Error('Invalid defeat slice.');
    for (const [outcome, n] of Object.entries(slice.counts))
        if (!DEFEAT_OUTCOMES.includes(outcome) || !Number.isSafeInteger(n) || n < 1) throw Error('Invalid defeat count.');
    if (slice.deathCauses != null) {
        if (typeof slice.deathCauses !== 'object' || Array.isArray(slice.deathCauses)) throw Error('Invalid death causes.');
        for (const [kind, n] of Object.entries(slice.deathCauses)) if (!DEATH_CAUSES.includes(kind) || !Number.isSafeInteger(n) || n < 1) throw Error('Invalid death cause tally.');
        if (slice.lastDeath != null) checkCause(slice.lastDeath, DEATH_CAUSES);
    }
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

// A saved battle's player loss (CBL3): the pure step stages `plan.defeat`; persistExpansionPlan publishes it
// inside the same durable write, so a rolled-back write also undoes the record. `place` stays null: a saved
// battle sits in its own session, not in a map location.
export function savedBattleLoss(by) { return {outcome: 'unconscious', cause: {kind: 'combat', place: null, by: [...new Set(by.filter(text))]}}; }

// One publication per actual outcome. With `commit`, the record is part of that durable write:
// it is in place while the save is built and undone if the write throws.
export function publishDefeat({outcome = 'unconscious', cause}, commit = null) {
    if (!DEFEAT_OUTCOMES.includes(outcome)) throw Error(`Unknown defeat outcome: ${outcome}`);
    checkCause(cause);
    const before = state ?? fresh(), record = {outcome, cause: structuredClone(cause)};
    state = {...before, counts: {...before.counts, [outcome]: (before.counts[outcome] ?? 0) + 1}, last: record};
    if (commit) try { commit(); } catch (error) { state = before; throw error; }
    down = true;
    return record;
}

// One death, as a cause. Tally only: a rolled-back durable write undoes it like a defeat. The caller (the life-events
// domain) guards "once per death" with its own seen list, so a replayed scan cannot count a death twice.
export function publishDeathCause(cause, commit = null) {
    checkCause(cause, DEATH_CAUSES);
    const before = state ?? fresh(), tally = {...(before.deathCauses ?? {})};
    tally[cause.kind] = (tally[cause.kind] ?? 0) + 1;
    state = {...before, deathCauses: tally, lastDeath: structuredClone(cause)};
    if (commit) try { commit(); } catch (error) { state = before; throw error; }
    return cause;
}
export const deathCauseTally = () => ({...(state?.deathCauses ?? {})});

// Once per collapse (RC2, BHR17, 2026-10-19). The 0-HP check runs every tick, and a rest heal can
// lift HP above 0 in the middle of a tick, so the guard clears only when a whole tick ends above
// 0 HP (main's per-tick effect update calls heroStanding). Any publication arms it, so a combat
// defeat that leaves the hero at 0 HP in town is not counted again as harm. It starts armed: a
// hero loaded at 0 HP is already down, and the first tick that ends above 0 clears it. Not saved.
let down = true;
export function heroStanding(health) { if (health > 0) down = false; }
export function harmCollapse(location) {
    if (down) return null;
    return publishDefeat({outcome: 'unconscious', cause: {kind: 'harm', place: text(location?.id) ? location.id : null, by: []}});
}

registerDomain({id: 'defeat', deps: [], initialState: () => null,
    save: () => state && (state.last || state.deathCauses) ? structuredClone(state) : undefined,
    validate: slice => validateDefeat(slice),
    // Old saves have no slice: the record starts empty. `total_deaths` keeps the old history.
    migrate: slice => slice == null ? fresh() : structuredClone(slice),
    load: setDefeatState,
    projection: () => structuredClone(state ?? fresh()),
});
