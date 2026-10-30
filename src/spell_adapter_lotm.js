// LOTM adapter for the spell seam (GM40, proposal). Nothing here edits an L10 or L4 owner: it maps their output onto spell rows.
//   typed abilities (ability_typed_rows.recordFromTyped) -> origin 'sequence': held through the pathway's sequence, not taught;
//   divination queries (cast_divination_adapter data)    -> origin 'granted' with a rite: prepare step, means and contact as the formula.
// Divination keeps its own execution path (defineDivinations) and its ritual grading; this mapping gives it the shared origin, prepare, failure and
// read model. Default: failure chance null (sources state none for abilities). Dial: a query with a ritual takes the world's ritual base odds.
// Reason: LOTM states loss-of-control odds through the ritual dial (ritual_conditions), not a per-spell number. Strain is available and lands in the
// injected ledger (harm_state backlash) on failure.
import {defineSpellAdapter} from './spell_seam.js';
import {recordFromTyped} from './ability_typed_rows.js';
import {ritualDial} from './ritual_conditions.js';

export const lotmSpellAdapter = (overrides = {}) => defineSpellAdapter({
    worldId: 'lotm.world', prefix: 'lotm.sp',
    origins: {sequence: {reason: 'A Beyonder ability comes with the sequence, not from a lesson.'}, granted: {reason: 'A rite open to anyone who has the means.'},
        teacher: {reason: 'A few arts are taught by a member of an organization.'}, text: {reason: 'Some knowledge is read from a record.'}},
    failure: {chance: null, reason: 'No per-ability failure number is stated; rites carry the ritual dial.'},
    strain: {allowed: true, when: 'failure', reason: 'Backlash is the world\'s ledger (harm_state); a failed or ill-prepared act adds weight.'},
    ...overrides});

// row: one typed row (ability_typing output). opts: {sourceId, sequenceFact} where sequenceFact is the boolean the host supplies when the actor holds the sequence.
export function spellFromTyped(row, {sourceId, sequenceFact}) {
    const rec = recordFromTyped(row, {sourceId});
    return {key: rec.key, label: rec.label, sourceId, locator: rec.locator,
        origin: {kind: 'sequence', gate: {label: 'Holds the sequence', reason: 'You do not hold the sequence this ability comes from.', requires: {fact: sequenceFact, op: 'eq', value: true}}},
        formula: rec.conditions, blockedBy: rec.blockedBy, cost: rec.cost, limit: rec.limit, effects: rec.effects, stated: rec.stated, unstated: rec.unstated};
}

const slug = id => String(id).split('.').pop().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
// query: one entry of defineDivinations data. opts: {sourceId, actorId, world}. The query keeps its ids; its predicates are reused unchanged.
export function spellFromDivination(query, {sourceId, actorId = 'player', world = 'lotm.world'}) {
    const prep = query.steps.find(s => s.kind === 'prepare'), attempt = query.steps.find(s => s.kind === 'attempt');
    const dial = query.ritual ? ritualDial(world, query.dial) : null;
    const basis = {kind: 'observation', attributedTo: actorId, queryId: query.id, targetId: query.targetId, method: query.method, ...(query.locator ? {at: query.locator} : {})};
    return {key: slug(query.id), label: query.label, description: query.description, sourceId, locator: query.locator,
        origin: {kind: 'granted'}, fn: 'perception',
        formula: [{label: 'The means to hand', requires: query.means}, {label: 'The question held in mind', requires: query.contact}, ...(query.requires ? [{label: 'Other support', requires: query.requires}] : [])],
        ...(prep ? {prepare: {minutes: prep.minutes, label: prep.label}} : {}),
        cost: [], limit: {kind: 'none'},
        effects: [{type: 'knowledge', actor: actorId, key: `divination.${query.id}.signal`, stage: 'seen', value: attempt?.signal ?? 'No signal is recorded for this query.', basis}],
        ...(dial ? {failure: {chance: dial.baseOdds / 100}} : {}),
        unstated: ['cost amount']};
}
