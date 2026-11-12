// Where a contest's hits land (chat C, CFC7). Bodies are W substrate holders of
// kind 'body' carrying vitality and stamina; the contest writes them through
// applyWorldOps, so every hit keeps a ledger source and a cause chain (WSC10).
// After a fight, contestBodyIntents (contest.js) names what L's lifecycle
// owners should record, and applyLifecycleIntents calls L's public doors.
//
// PFP10 note: this file imports creature_lifecycle.js directly. Reason: L has
// no shared injure door yet (C's request L1); this adapter is the only place
// the contest touches L, and it goes when L publishes the door.
import {check} from './basics.js';
import {injureCreature, settleCohortStock, creatureHealth} from './creature_lifecycle.js';

// Body quantities the contest pack declares until W adopts them (request W4).
// Bounds are save-integrity budgets, not limits on any world's bodies.
export const CONTEST_QUANTITIES = Object.freeze({
    vitality: Object.freeze({id: 'vitality', unit: 'point', min: 0, max: 1_000_000}),
    stamina: Object.freeze({id: 'stamina', unit: 'point', min: 0, max: 1_000_000}),
});

/** The contest's substrate pack: it declares body quantities and reacts to nothing by default. */
export function contestPack({extra = []} = {}) {
    const quantities = [...Object.values(CONTEST_QUANTITIES), ...extra];
    return {id: 'c.contest', revision: 0, quantities, reads: quantities.map(q => q.id), writes: quantities.map(q => q.id), laws: [], reactors: []};
}

/** A body holder for an entrant. */
export const contestBody = (id, place, quantities, tags = []) => ({id, kind: 'body', place, tags, quantities});

/** Apply the fight's intents through creature_lifecycle's own doors. Returns the new lifecycle state. */
export function applyLifecycleIntents(state, intents, {clock}) {
    let next = state;
    const byCohort = {};
    for (const intent of intents) {
        if (intent.door === 'cohort') byCohort[intent.cohortId] = (byCohort[intent.cohortId] ?? 0) + intent.delta;
        else if (intent.door === 'injure') {
            if (creatureHealth(next, intent.id, clock).injury?.remaining) continue; // one injury slot today (L backlog)
            next = injureCreature(next, {revision: next.revision, id: intent.id, clock, kind: intent.kind, recoveryMinutes: intent.recoveryMinutes});
        } else check(false, `Unknown body door ${intent.door}.`);
    }
    for (const [cohortId, delta] of Object.entries(byCohort).sort(([a], [b]) => (a < b ? -1 : 1))) {
        const cohort = next.cohorts[cohortId];
        check(cohort, `Unknown cohort ${cohortId}.`);
        const take = Math.max(delta, -cohort.stock); // a fight cannot remove more than the cohort holds
        if (!take) continue;
        // A fall only lowers stock, so the habitat is named by id (no capacity check applies).
        next = settleCohortStock(next, {revision: next.revision, id: cohortId, species: cohort.species,
            habitat: {id: cohort.habitat}, delta: take});
    }
    return next;
}
