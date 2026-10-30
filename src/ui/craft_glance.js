// Crafting glance (proposal CF1): the facts a player weighs before pressing Craft, as data.
// Pure function over the crafting detail model: needs, time, cost, result, chance and the one blocked reason.
// Every optional field falls back to an honest word, never an invented number (MR4, UR63): a surface
// that does not pass `time` says "not stated", an ungraded result says so, an unassessed chance says so.
// Marks pair a glyph with a word (UR37); the renderer draws them, this file only decides what is said.

export const GLANCE_MARKS = {ok: '✓', blocked: '✕', info: '·'};

/** Chance words for a success percentage. Per-world dial candidates; these are the default bands. */
export const CHANCE_BANDS = [[90, 'reliable'], [60, 'likely'], [30, 'uncertain'], [10, 'unlikely'], [0, 'very unlikely']];
export function chanceWord(percent) {
    if (!Number.isFinite(percent)) return 'unassessed';
    return CHANCE_BANDS.find(([floor]) => percent >= floor)[1];
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Chips for the inputs: have/need per attempt, ok or blocked. Known stock uses the unblocked count. */
export function needChips(requirements = []) {
    return requirements.map(req => {
        const have = req.stockKnown ? req.usable : req.have;
        const short = Math.max(0, req.need - have);
        const state = short || req.held_back || req.heat_reason ? 'blocked' : 'ok';
        const note = short ? `short ${short}` : req.held_back ? 'reserved' : req.heat_reason ? 'wrong heat' : 'enough';
        return {state, text: `${req.label} ${have}/${req.need}`, note};
    });
}

/**
 * @param {Object} model the crafting detail model (title, requirements, output, chance, station, available,
 *   blocked_reason, attempts, optional time, spendsOnFailure, quality {range:[low, high], note})
 * @returns {{status: {state, text}, rows: Array<{key, label, value, state?, chips?}>}}
 */
export function craftGlance(model) {
    const reqs = model.requirements || [];
    const chips = needChips(reqs);
    const out = model.output || {};
    const attempts = Number.isFinite(model.attempts) ? model.attempts : null;
    const status = model.available
        ? {state: 'ok', text: attempts == null ? 'Ready to craft' : `Ready: ${plural(attempts, 'attempt')} possible now`}
        : {state: 'blocked', text: model.blocked_reason || "Can't craft right now."};
    const totals = new Map();
    for (const r of reqs) totals.set(r.label, (totals.get(r.label) || 0) + r.need);
    const spend = totals.size ? [...totals].map(([label, n]) => `${n} ${label}`).join(', ') : 'nothing listed';
    const cost = `Spends ${spend} per attempt${model.spendsOnFailure ? ', even when the attempt fails' : ''}`;
    const q = model.quality?.range;
    const result = `${out.name} ×${out.count}${out.scaled ? ' (partial results possible)' : ''}`;
    const quality = q
        ? `Quality ${q[0]}–${q[1]}${model.quality.note ? ` · ${model.quality.note}` : ''}`
        : 'Not graded: it works or it does not';
    const chance = Number.isFinite(model.chance)
        ? `${model.chance}% · ${chanceWord(model.chance)}`
        : 'Unassessed';
    return {status, rows: [
        {key: 'needs', label: 'Needs', value: chips.map(c => `${c.text} (${c.note})`).join('; ') || 'Nothing', chips, state: chips.some(c => c.state === 'blocked') ? 'blocked' : 'ok'},
        {key: 'time', label: 'Time', value: model.time || 'Not stated'},
        {key: 'cost', label: 'Cost', value: cost},
        {key: 'result', label: out.uncertain ? 'Possible result' : 'Makes', value: result},
        {key: 'quality', label: 'Quality', value: quality},
        {key: 'chance', label: model.chance_label || 'Success', value: chance,
            number: Number.isFinite(model.chance) ? `${model.chance}%` : chance, word: Number.isFinite(model.chance) ? chanceWord(model.chance) : ''},
        {key: 'station', label: 'At', value: model.station || 'Not stated'},
    ]};
}

/** One-line text form of the glance for logs, tooltips and tests (UR37). */
export function glanceText(glance) {
    return [`${GLANCE_MARKS[glance.status.state]} ${glance.status.text}`, ...glance.rows.map(r => `${r.label}: ${r.value}`)].join('\n');
}
