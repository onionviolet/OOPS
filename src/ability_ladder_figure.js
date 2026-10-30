// RPX5 advancement ladder as a figure spec (docs/representations/ABILITIES.md). Reads a pathView
// (ascension_paths.js), so every world's ladder (pathway sequences, cultivation realms, method
// tracks) draws through one adapter and the figure primitive. Holds no state and saves nothing.
//
// Rungs climb a vertical track: reached rungs are done, the current rung carries its fill
// (digestion, practice toward the next crossing), named rungs ahead are pending, rumoured ones are
// guessed and unnamed ones unknown (UIV6). The next crossing is a second, horizontal track.
// A witness (another seat looking at someone else's ladder) gets only the rungs it saw used: no
// fill, no crossings, no grants, and nothing above what it saw (ABR19).
const FILLED_BY = new Set(['digest', 'quota']);
const slug = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The fill of the current rung: progress on the next stage's counted crossing, if it has one. */
export function rungFill(view) {
    const counted = view.crossings.find(c => FILLED_BY.has(c.type) && typeof c.need === 'number' && c.need > 0);
    return counted ? {fill: Math.min(1, counted.have / counted.need), have: counted.have, need: counted.need, label: counted.label} : null;
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
 */
export function ladderFigureSpec(view, options = {}) {
    const witness = options.perspective === 'witness';
    const rumours = options.rumours || {};
    const fill = witness ? null : rungFill(view);
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
            const words = [options.felt ? `feels ${options.felt}` : null, fill ? `${fill.have} of ${fill.need}` : null].filter(Boolean);
            if (fill) step.fill = fill.fill;
            if (words.length) step.note = words.join(', ');
            return step;
        }
        if (named) return {label: rung.label, state: 'pending'};
        if (rumours[i]) return {label: rumours[i], state: 'guessed', note: 'rumoured'};
        return {label: 'Not yet known', state: 'unknown'};
    }).filter((step, i, all) => !(step.state === 'unknown' && all[i - 1]?.state === 'unknown')); // one unknown rung, never a count
    const standing = steps[witness ? seen : view.position].label;
    const spec = {
        id: options.id || `ladder-${slug(view.path)}${witness ? '-seen' : ''}`,
        size: 560,
        title: witness ? `${view.label}: what you have seen${options.subject ? ` of ${options.subject}` : ''}` : view.label,
        summary: witness ? 'Only rungs you have seen used. How far they have digested or trained is not visible from outside.'
            : `Now: ${view.stage}.${view.next ? ` Next: ${view.next}.` : ' No further rung is known.'}`,
        tracks: [{id: 'rungs', label: 'Rungs', progress: witness ? `highest seen ${standing}` : `standing on ${standing}`, orient: 'vertical', steps}],
        notes: [],
        legend: [
            {state: 'done', label: 'crossed'}, {state: 'current', label: witness ? 'highest seen' : 'where you stand'},
            ...(witness ? [] : [{state: 'pending', label: 'known, ahead'}]),
            ...(steps.some(s => s.state === 'guessed') ? [{state: 'guessed', label: 'heard of, unconfirmed'}] : []),
            {state: 'unknown', label: witness ? 'not seen' : 'not yet known'},
        ],
    };
    if (witness) return spec;
    if (options.crossings !== false && view.next && !view.capped && view.crossings.length) {
        let current = false;
        spec.tracks.push({id: 'next', label: `To reach ${view.next}`, steps: view.crossings.map(c => {
            const counted = typeof c.need === 'number';
            const state = c.met ? 'done' : current ? 'pending' : (current = true, 'current');
            const words = [counted ? `${c.have} of ${c.need}` : null, c.irreversible ? 'irreversible' : null].filter(Boolean);
            return {label: c.label, state, ...(counted && !c.met ? {fill: Math.min(1, c.have / c.need)} : {}), ...(words.length ? {note: words.join(', ')} : {})};
        })});
    }
    if (view.capped) spec.notes.push({text: `${view.next || 'The next rung'} is not open to you here yet.`});
    if (view.grants.length) spec.notes.push({text: `What this rung gives: ${view.grants.join('; ')}.`});
    if (options.crossings !== false && view.failure) spec.notes.push({state: 'strained', text: `Risk: ${view.failure.signs}. ${view.failure.outcome}.`});
    return spec;
}
