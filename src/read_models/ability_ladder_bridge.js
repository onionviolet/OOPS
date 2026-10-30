// Bridge: L10 advancement (lotm_advancement.js, ability_records.js) -> rep-abilities "ladder view" (claude/rep-abilities, ability_ladder_figure.js header).
// Pure: no host state, no save slice. The ladder view is pathView's shape plus `nextGrants`; this adds what the rep doc asks L10 for.
// Observer rule (ABR19): a rung the observer cannot name is '???', and nothing about it (grants, crossings, failure) is passed along.
import {pathView} from '../ascension_paths.js';

/**
 * adv: advanceLadder() result ({path, ...}) or a bare definePath descriptor.
 * options: {position (stage index), facts, known (stages the observer can name), ceiling}.
 * Returns the rep "ladder view": {path, world, label, stage, position, previous, next, grants[], nextGrants[], capped, ready, failure, crossings[], ladder[]}.
 */
export function ladderViewFromRecord(adv, {position, facts = {}, known, ceiling} = {}) {
    const path = adv?.path ?? adv;
    const opts = {};
    if (known !== undefined) opts.known = known;
    if (ceiling !== undefined) opts.ceiling = ceiling;
    const view = pathView(path, position, facts, opts);
    const nextIndex = position + 1 < path.stages.length ? position + 1 : null;
    if (nextIndex !== null && view.next === '???') {
        // Unnamed next rung: the observer learns neither what it gives nor what crossing it needs (ABR19).
        return {...view, nextGrants: [], crossings: [], failure: null, ready: false};
    }
    return {...view, nextGrants: nextIndex === null ? [] : [...path.stages[nextIndex].grants]};
}

/**
 * Held abilities as plain rows for a ladder home or a sheet glance: label, readiness and the reasons by label.
 * views: abilityViews() output. Drops the opaque failure hook and the unstated list (another owner's, and not an observer's business).
 */
export function abilityGlanceRows(views = []) {
    return views.map(v => ({id: v.id, label: v.label, ready: v.ready, refusedBy: [...v.refusedBy],
        limit: v.limit.kind === 'none' ? null : {...v.limit}, cost: v.cost.map(c => ({what: c.what, amount: c.amount})), hasPrice: v.price}));
}
