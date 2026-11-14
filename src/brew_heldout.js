// Held-out scoring for Hogwarts potion mechanisms (RUN.md "Then" and "Wave order"; PC72).
// Diagnostic, not an execution test: a mechanism family (the five blocking rules the ledger
// names) predicts the effect sentence and the delivery route of a potion, and the prediction is
// compared with the evidence-labelled sentence (brew_effects_pack HP_POTION_SENTENCES, each cites
// an evidence row). Outcome and route are scored separately. Pure functions; the report script
// supplies the labelled rows so this module imports nothing from scripts/ or world packs.

/** The five Hogwarts potion mechanisms (what a dose does through a body door, a mind state, a
 * body form, a plant or creature target, a conceal or sense verb). */
export const MECHANISMS = Object.freeze(['body-door', 'mind-state', 'body-form', 'plant-or-creature-target', 'conceal-or-sense']);

/** Titles whose family comes from a title override that was set against the evidence labels
 * (scripts/b_coverage_ledgers.mjs HP_POTION_FAMILY_OVERRIDES). The rule saw these rows, so they
 * are reported on their own line and never count as held out. */
export const RULE_SAW_TITLES = Object.freeze(['Wolfsbane Potion']);

export const SPLIT_RULE = 'Among evidence-labelled rows in the five mechanisms whose family was not set by an override, '
    + 'the first row by id in each mechanism is the tuning sample; every other such row is held out.';

/** Fixed split. rows: [{id, title, family, parts}]. */
export function splitLabelled(rows) {
    const inScope = rows.filter(r => MECHANISMS.includes(r.family) && !RULE_SAW_TITLES.includes(r.title));
    const tuned = [];
    for (const family of MECHANISMS) {
        const first = inScope.filter(r => r.family === family).sort((a, b) => a.id.localeCompare(b.id))[0];
        if (first) tuned.push(first);
    }
    const tunedIds = new Set(tuned.map(r => r.id));
    return {
        tuned,
        heldOut: inScope.filter(r => !tunedIds.has(r.id)).sort((a, b) => a.id.localeCompare(b.id)),
        ruleSaw: rows.filter(r => RULE_SAW_TITLES.includes(r.title)),
        outOfScope: rows.filter(r => !MECHANISMS.includes(r.family) && !RULE_SAW_TITLES.includes(r.title)),
    };
}

const modeOf = values => {
    const n = new Map();
    for (const v of values) n.set(v, (n.get(v) ?? 0) + 1);
    return [...n].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0]?.[0];
};

/** Fit one default sentence per mechanism: the most common verb, object, target and carrier of its
 * tuning rows (ties by name). A mechanism with no tuning row has no default and predicts nothing. */
export function fitMechanisms(tuned) {
    const table = {};
    for (const family of MECHANISMS) {
        const rows = tuned.filter(r => r.family === family);
        if (!rows.length) continue;
        const slot = key => modeOf(rows.map(r => r.parts[key]));
        table[family] = {verb: slot('verb'), object: slot('object'), target: slot('target'), carrier: slot('carrier')};
    }
    return table;
}

/** Outcome: verb, object and target all agree. Object-only is kept as its own line so the earlier
 * object rule (FAMILY_PREDICTS) compares like with like. Route: the carrier agrees. */
export function judge(prediction, parts) {
    if (!prediction) return {predicted: false, outcome: false, object: false, route: false};
    return {predicted: true,
        outcome: prediction.verb === parts.verb && prediction.object === parts.object && prediction.target === parts.target,
        object: prediction.object === parts.object,
        route: prediction.carrier === parts.carrier};
}

/** Score held-out rows. before = the earlier rule (predictionHolds on the object; no route rule).
 * after = the fitted table. Every held-out row counts in the denominator, predicted or not. */
export function scoreHeldOut(heldOut, table, {beforeObject}) {
    const rows = heldOut.map(r => {
        const after = judge(table[r.family], r.parts);
        const beforeObjectHolds = beforeObject(r.family, r.parts) === true;
        return {id: r.id, family: r.family, beforeObject: beforeObjectHolds, afterObject: after.object, outcome: after.outcome, route: after.route,
            predicted: table[r.family] ? `${table[r.family].verb} ${table[r.family].object} ${table[r.family].target} via ${table[r.family].carrier}` : 'none',
            actual: `${r.parts.verb} ${r.parts.object} ${r.parts.target} via ${r.parts.carrier}`};
    });
    const n = rows.length, count = f => rows.filter(f).length;
    return {n, beforeObject: count(r => r.beforeObject), afterObject: count(r => r.afterObject), outcome: count(r => r.outcome), route: count(r => r.route),
        both: count(r => r.outcome && r.route), rows,
        misses: rows.filter(r => !r.outcome || !r.route).sort((a, b) => a.id.localeCompare(b.id))};
}
