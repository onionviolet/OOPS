// Bridge: L9 harm read (harm_state.js harmView) -> rep-body view model (claude/rep-body, body_figure.js bodyViewModel; BODY_AND_CONDITIONS.md "Harm owner switch-over").
// Pure. Output is bodyViewModel's shape {title, glance[], parts[{slot, label, now[], lasting[]}], milestones[], empty} so renderBodyView needs no change.
// Only the owner's own view is built here: harm (carrier stage, overall rung, part injuries) is felt, not seen, so for another seat it returns null (nothing shown, nothing invented).
// Part injuries are the optional field from Weibao's middle path (HP plus parts only where something reads them): harmView.parts entries
// {id, label, rung, rungLabel, modifiers:[{axis, mult?, add?, cause}], recovers:{rest, treated, trained}} (L9, graded, not gated).

const RUNGS = ['shaken', 'bruised', 'wounded', 'maimed', 'dying'];
const word = s => String(s).replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());
const EMPTY = 'Nothing is troubling this body right now. Training, work and injuries will show here by body part.';

/**
 * harm: harmView(save) result {carriers[], rung, parts[], lastDeath}. options: {self (default true), partLabels: {id: label}, milestones: []}.
 * Carrier stages named 'steady' (floor) say nothing. A part's modifier axes are the felt line ("Affects accuracy, force."); the numbers stay with the quote.
 */
export function bodyViewFromHarm(harm, {self = true, partLabels = {}, milestones = []} = {}) {
    if (!self || !harm) return null;
    const groups = new Map(), add = (slot, label, row) => { if (!groups.has(slot)) groups.set(slot, {slot, label, now: [], lasting: []}); groups.get(slot).now.push(row); };
    const glance = [];
    const row = (id, label, slot, extra = {}) => ({id, label, slot, level: null, time: 'eases with rest', recovered: null, felt: null, seen: null, cures: [], waits: true, ...extra});
    if (harm.rung) {
        const r = row('harm.overall', word(harm.rung), 'whole', {level: RUNGS.indexOf(harm.rung) + 1 || null, felt: 'How badly the whole body is hurt.'});
        add('whole', 'Whole body', r); glance.push({id: r.id, label: r.label, slot: r.slot, time: r.time, level: r.level});
    }
    for (const part of harm.parts ?? []) {
        const label = partLabels[part.id] ?? part.label ?? word(part.id), slot = `part:${part.id}`, axes = [...new Set((part.modifiers ?? []).map(m => m.axis))];
        const r = row(`harm.part.${part.id}`, `${part.rungLabel ?? word(part.rung)} ${label.toLowerCase()}`, slot, {level: RUNGS.indexOf(part.rung) + 1 || null,
            time: part.recovers?.rest > 0 ? 'eases with rest' : 'does not ease by itself', felt: axes.length ? `Affects ${axes.join(', ')}.` : null});
        add(slot, label, r); glance.push({id: r.id, label: r.label, slot, time: r.time, level: r.level});
    }
    for (const c of harm.carriers ?? []) {
        if (c.blocked.length === 0 && c.stage === 'steady') continue;
        const rate = c.recovers?.rest > 0 ? 'eases with rest' : 'does not ease by itself';
        const r = row(`harm.carrier.${c.id}`, `${c.label}: ${c.stageLabel}`, `carrier:${c.id}`, {time: rate,
            felt: c.blocked.length ? `Blocks: ${c.blocked.join(', ')}.` : null});
        add(r.slot, c.label, r); glance.push({id: r.id, label: r.label, slot: r.slot, time: r.time, level: null});
    }
    const parts = [...groups.values()];
    return {title: 'Your body', glance, parts, milestones, empty: parts.length ? null : EMPTY};
}
