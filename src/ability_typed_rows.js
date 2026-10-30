// Typed ability rows (scripts/lead_run/ability_typing.mjs output) to ability record input (ability_records.js). A typed row holds only what the
// source rows state: required states, blocking states, stated ranges, durations and counts, each with a locator. It states no effect, so the
// record gets a generic marker condition and says so in `unstated`; an author replaces the marker when the ability's effect is written.
// Facts the conditions read are `actor.lotm.<slug>` booleans the host must supply (an unsupplied one quotes ineligible, which is safe).
const slugOf = id => String(id).split('.').pop().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
const eqTrue = fact => ({fact, op: 'eq', value: true});

// row: one entry of the ingest output {id, name, conditions, blockers, stated, costs}. opts.sourceId: the held source; opts.world prefix for ids.
export function recordFromTyped(row, {sourceId, markerDuration = 10}) {
    const key = slugOf(row.id);
    const unstated = ['effect (a generic marker stands in)', ...(row.costs.some(c => c.value != null) ? [] : ['cost amount'])];
    const dedupe = list => [...new Map(list.map(x => [x.fact, x])).values()];
    return {
        key, label: row.name || key.replace(/_/g, ' '), sourceId,
        conditions: dedupe(row.conditions).map(c => ({label: c.label, requires: eqTrue(c.fact), locator: c.locator})),
        blockedBy: dedupe(row.blockers).map(b => ({label: b.label, active: eqTrue(b.fact), locator: b.locator})),
        cost: [], limit: {kind: 'none'},
        effects: [{type: 'condition', id: `${sourceId}.${key}`, operation: 'apply', duration: markerDuration}],
        stated: row.stated.map(({kind, value, unit, label, locator}) => ({kind, value, unit, label, locator})),
        unstated, locator: row.conditions[0]?.locator ?? row.blockers[0]?.locator ?? row.stated[0]?.locator ?? null
    };
}

// Rows that carry any mechanism at all (a condition, a blocker or a stated number); the rest are notes only.
export const hasMechanism = row => row.conditions.length + row.blockers.length + row.stated.length > 0;
