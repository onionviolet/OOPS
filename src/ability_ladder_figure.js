// RPX5 advancement ladder as a figure spec (docs/representations/ABILITIES.md). Reads a pathView
// (ascension_paths.js), so every world's ladder (pathway sequences, cultivation realms, method
// tracks) draws through one adapter and the figure primitive. Holds no state and saves nothing.
//
// Rungs climb a vertical track: reached rungs are done, the current rung carries its fill
// (digestion, practice toward the next crossing), named rungs ahead are pending, rumoured ones are
// guessed and unnamed ones unknown (UIV6). The next crossing is a second, horizontal track.
// A witness (another seat looking at someone else's ladder) gets only the rungs it saw used: no
// fill, no crossings, no grants, and nothing above what it saw (ABR19).
//
// Input contract ("ladder view"), so the source can change without touching the views: today it is
// pathView() from ascension_paths.js; the sonnet wave's L10 typed ability record and ladder replaces it
// through one mapper into this same shape (docs/representations/ABILITIES.md, "Source switch").
//   {path, label, stage, position, next, grants[], nextGrants[], capped, ready, failure?{signs,outcome},
//    crossings[{id, type, label, need: true|n, have, met, irreversible}], ladder[{label ('???' if unnamed), reached}]}
// L10 fills it through ladderViewFromRecord (read_models/ability_ladder_bridge.js); a rung's typed ability records
// (ability_records.js cards) add per-ability lines through abilityLines(), with costs the source does not state marked inferred.
const FILLED_BY = new Set(['digest', 'quota']);
const slug = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The fill of the current rung: progress on the next stage's counted crossing, if it has one. */
export function rungFill(view) {
    const counted = view.crossings.find(c => FILLED_BY.has(c.type) && typeof c.need === 'number' && c.need > 0);
    return counted ? {fill: Math.min(1, counted.have / counted.need), have: counted.have, need: counted.need, label: counted.label} : null;
}

/** What a planned act adds to the counted crossing: {have, need, ghost, words}, or null. planned: {label, adds = 1}. */
export function plannedFill(view, planned) {
    const fill = rungFill(view);
    if (!fill || !planned || fill.have >= fill.need) return null;
    const after = Math.min(fill.need, fill.have + (planned.adds ?? 1));
    return {have: after, need: fill.need, ghost: after / fill.need, words: `after ${planned.label}: ${after} of ${fill.need}`};
}

const INFERRED_COST = /cost|amount/i, INFERRED_LIMIT = /cooldown|charge|recharge/i;
const limitWords = limit => limit.kind === 'cooldown' ? `recovers in ${limit.minutes} min` : limit.kind === 'charges' ? `${limit.max} uses, then recharges` : null;
/**
 * One line per typed ability record (L10 cards): label, cost and limit. A cost or limit the source does not
 * state but the record proposes (costBasis amounts 'proposal', or named in `unstated`) is marked inferred;
 * an ability with no cost row reads "cost not stated". Never prints predicates or the failure hook.
 */
export function abilityLines(cards = []) {
    return cards.map(card => {
        const costInferred = card.costBasis?.amounts === 'proposal' || (card.unstated ?? []).some(u => INFERRED_COST.test(u));
        const limitInferred = (card.unstated ?? []).some(u => INFERRED_LIMIT.test(u));
        const cost = card.cost.length ? `${card.cost.map(c => `${-c.amount} ${String(c.key ?? c.type).replace(/_/g, ' ')}`).join(' and ')}${costInferred ? ' (inferred)' : ''}` : 'cost not stated';
        const limit = limitWords(card.limit ?? {kind: 'none'});
        return `${card.label}: ${cost}${limit ? `; ${limit}${limitInferred ? ' (inferred)' : ''}` : ''}`;
    });
}

/**
 * view: a pathView result. options:
 *   felt       words for how the current rung feels (canon digestion is felt, not counted)
 *   rumours    {stageIndex: label} for rungs the character has only heard of
 *   perspective 'self' (default) | 'witness'
 *   seen       witness only: the highest rung index the witness saw used
 *   subject    witness only: whose ladder this is, in the witness's words
 *   id         figure id (defaults from the path id)
 *   crossings  false when the home already lists the next crossing and its risk (the Tingen plan does)
 *   layout     'compact' draws the rungs horizontally (character sheets)
 *   insight    {stages: [label per rung index], thresholds: bool}: a cheat or continuing insight names
 *              rungs the character has not learned; they show as guessed. Never applies to a witness.
 *   planned    {label, adds = 1}: a planned or running act that counts toward the next crossing; the current rung
 *              and that crossing gain a ghost fill and the words "after <label>: n of m" (RS15). Never for a witness.
 *   abilities  {here: cards[], next: cards[]}: L10 typed ability records for the current and next rung; their
 *              lines replace the plain grant words. Next-rung records show only when the next rung is named.
 */
export function ladderFigureSpec(view, options = {}) {
    const witness = options.perspective === 'witness';
    const rumours = options.rumours || {};
    const fill = witness ? null : rungFill(view);
    const ghost = witness ? null : plannedFill(view, options.planned);
    const insight = !witness && options.insight ? options.insight : null;
    let insightUsed = false;
    const seen = witness ? Math.min(Number.isInteger(options.seen) ? options.seen : -1, view.position) : view.position;
    const steps = view.ladder.map((rung, i) => {
        const named = rung.label !== '???';
        if (witness) {
            if (i > seen) return {label: 'Not seen', state: 'unknown'};
            return i === seen ? {label: rung.label, state: 'current', note: 'seen in use'} : {label: rung.label, state: 'done'};
        }
        if (i < view.position) return {label: rung.label, state: 'done'};
        if (i === view.position) {
            const step = {label: rung.label, state: 'current'};
            const words = [options.felt ? `feels ${options.felt}` : null, fill ? `${fill.have} of ${fill.need} toward the next rung` : null, ghost?.words].filter(Boolean);
            if (fill) step.fill = fill.fill;
            if (ghost) step.ghost = ghost.ghost;
            if (words.length) step.note = words.join(', ');
            return step;
        }
        if (named) return {label: rung.label, state: 'pending'};
        if (insight?.stages?.[i]) return insightUsed = true, {label: insight.stages[i], state: 'guessed', note: 'shown by insight'};
        if (rumours[i]) return {label: rumours[i], state: 'guessed', note: 'rumoured'};
        return {label: 'Not yet known', state: 'unknown'};
    });
    if (!witness && view.ladder.length > 7 && view.position >= 3) { // fold old rungs, keep the one just below
        const k = view.position - 1;
        steps.splice(0, k, {label: `${k} rungs crossed`, state: 'done', note: `${view.ladder[0].label} to ${view.ladder[k - 1].label}`});
    }
    const shown = steps.filter((step, i, all) => !(step.state === 'unknown' && all[i - 1]?.state === 'unknown')); // one unknown rung, never a count
    const standing = (shown.find(s => s.state === 'current') || shown[0]).label;
    const spec = {
        id: options.id || `ladder-${slug(view.path)}${witness ? '-seen' : ''}`,
        size: 560,
        title: witness ? `${view.label}: what you have seen${options.subject ? ` of ${options.subject}` : ''}` : view.label,
        summary: witness ? 'Only rungs you have seen used. How far they have digested or trained is not visible from outside.'
            : `Now: ${view.stage}.${view.next ? ` Next: ${view.next}.` : ' No further rung is known.'}`,
        tracks: [{id: 'rungs', label: 'Rungs', progress: witness ? `highest seen ${standing}` : `standing on ${standing}`, orient: options.layout === 'compact' ? 'horizontal' : 'vertical', steps: shown}],
        notes: [],
        legend: [
            {state: 'done', label: 'crossed'}, {state: 'current', label: witness ? 'highest seen' : 'where you stand'},
            ...(witness ? [] : [{state: 'pending', label: 'known, ahead'}]),
            ...(shown.some(s => s.state === 'guessed') ? [{state: 'guessed', label: 'heard of, unconfirmed'}] : []),
            {state: 'unknown', label: witness ? 'not seen' : 'not yet known'},
        ],
    };
    if (witness) return spec;
    if (options.crossings !== false && view.next && !view.capped && view.crossings.length) {
        let current = false;
        spec.tracks.push({id: 'next', label: `To reach ${view.next}`, steps: view.crossings.map(c => {
            const counted = typeof c.need === 'number';
            const state = c.met ? 'done' : current ? 'pending' : (current = true, 'current');
            const planned = ghost && counted && !c.met && c.label === fill.label;
            const words = [counted ? `${c.have} of ${c.need}` : null, planned ? ghost.words : null, c.irreversible ? 'irreversible' : null].filter(Boolean);
            return {label: c.label, state, ...(counted && !c.met ? {fill: Math.min(1, c.have / c.need)} : {}), ...(planned ? {ghost: ghost.ghost} : {}), ...(words.length ? {note: words.join(', ')} : {})};
        })});
    }
    if (view.capped) spec.notes.push({text: `${view.next || 'The next rung'} is not open to you here yet.`});
    const here = abilityLines(options.abilities?.here), ahead = view.next && view.next !== '???' && !view.capped ? abilityLines(options.abilities?.next) : [];
    if (here.length || view.grants.length) spec.notes.push({text: `What this rung gives: ${(here.length ? here : view.grants).join('; ')}.`});
    if ((ahead.length || view.nextGrants?.length) && !view.capped) spec.notes.push({text: `What the next rung gives: ${(ahead.length ? ahead : view.nextGrants).join('; ')}.`});
    if (insightUsed) spec.notes.push({text: 'Some rungs here are shown by insight, not by what you have learned.'});
    if (options.crossings !== false && view.failure) spec.notes.push({state: 'strained', text: `Risk: ${view.failure.signs}. ${view.failure.outcome}.`});
    return spec;
}

/** One plain line for a compact header or sheet. */
export function ladderGlance(view, {felt, planned} = {}) {
    const fill = rungFill(view), ghost = plannedFill(view, planned);
    return [view.stage, felt ? `feels ${felt}` : null, fill ? `${fill.have} of ${fill.need} toward ${view.next}` : null, ghost?.words, view.ready ? `ready for ${view.next}` : null].filter(Boolean).join(' · ');
}
