// RPX1/RPX2 adapter: one brewing-bench formula (the bench detail the place panel already reads) becomes two MDL2 figure specs
// and a risk ledger. The rite figure answers "is the rite ready and how risky": its conditions sit as slots on a ring with the
// stated risk at the centre. The making figure answers "where is my brew": materials and the brew as tracks. The ledger ranks
// what each unmet condition adds to the risk, so the player sees what to fix first. Pure data in, pure data out: no DOM, no
// world imports, no truth beyond the detail (MR31). No heat band: a track step exists where the world's law reads it
// (MR16, MR17), and this bench reads time alone. Broken is reserved for a graded attempt that failed; nothing is attempted
// yet (docs/representations/RITUALS_AND_MAKING.md). Each mark carries a semantic `role` so a later motif pack restyles it
// without touching this file.
const CONDITION_STATE = {met: 'filled', substituted: 'strained', absent: 'empty'};
const GRADE_STATE = {met: 'filled', substituted: 'strained', partial: 'strained', absent: 'empty'};
const GRADE_WORD = {met: 'every condition met', substituted: 'met with stand-ins', partial: 'some conditions missing', absent: 'no condition met'};
const LEGEND = {
    rite: [['filled', 'met'], ['strained', 'a stand-in, raises the risk'], ['empty', 'missing']],
    making: [['done', 'done or held'], ['empty', 'still needed'], ['current', 'step now'], ['pending', 'step to come']]};
const legendFor = (kind, items) => {
    const used = new Set(items.map(x => x.state).filter(Boolean));
    return LEGEND[kind].filter(([state]) => used.has(state)).map(([state, label]) => ({state, label}));
};
export const minutesText = m => m < 120 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`;

function brewTrack(d) {
    const held = d.slots.every(s => s.held >= s.need), dosed = d.doses > 0;
    const now = !d.formulaKnown ? 0 : d.brewing ? (d.ready ? 3 : 2) : dosed ? 4 : held ? 2 : 1;
    const labels = ['Formula', 'Materials', d.brewing && !d.ready ? `Brew · ${minutesText(d.left)} left` : `Brew · ${minutesText(d.minutes)}`, 'Bottle', d.rite || d.ritual?.needed ? 'Drink with the rite' : 'Drink'];
    return {id: 'brew', label: 'Brew', role: 'sequence', steps: labels.map((label, i) => ({label, role: 'step', state: i < now ? 'done' : i === now ? 'current' : 'pending',
        ...(i === now && i === 2 && d.brewing ? {effect: 'pulse'} : {})}))};
}

/** The rite as a circle of conditions with the risk inside it; null when the formula has no graded rite. */
export function riteCircleSpec(d) {
    const rite = d?.rite;
    if(!rite) return null;
    const slots = rite.conditions.map((c, index) => ({id: `rite-${c.id}`, ring: 'rite', index, role: 'condition', label: c.label, state: CONDITION_STATE[c.status],
        ...(c.status === 'met' ? {effect: 'glow'} : {})}));
    // Below centre: slot labels point inward, and a mark at the exact centre sits under them.
    const centre = {id: 'risk', at: [0, .55], role: 'risk', label: `${rite.odds}% risk`, state: GRADE_STATE[rite.grade]};
    // Two conditions sit left and right so their labels clear the risk mark.
    return {id: `bench-${d.id}-rite`, size: 440, title: rite.label,
        summary: `${rite.conditions.length} conditions, ${GRADE_WORD[rite.grade]}: ${rite.odds}% chance of losing control if drunk now.`,
        rings: [{id: 'rite', label: rite.label, role: 'circle', radius: 1, slots: rite.conditions.length, rotate: rite.conditions.length === 2 ? 90 : 0}],
        slots, nodes: [centre], legend: legendFor('rite', [...slots, centre])};
}

// A track's progress words: how many steps are done, named for what they count (replaces the old progressWord field).
const progressOf = (steps, word) => `${steps.filter(step => step.state === 'done').length} of ${steps.length} ${word}`;

/** Materials and brew steps as tracks; null when the formula names nothing to gather. */
export function makingSpec(d) {
    if(!d) return null;
    const held = d.status === 'brewable' && !d.via, tracks = [], notes = [];
    // Materials are a list to gather, not components laid in the circle, so they get their own row.
    if(d.slots.length) tracks.push({id: 'materials', label: 'Materials', role: 'gather', ...(() => { const steps = d.slots.map(s => held
        ? {label: `${s.name} ${s.held}/${s.need}`, role: 'material', state: s.held >= s.need ? 'done' : 'empty'} : {label: s.name, role: 'material'}); return {steps, progress: held ? progressOf(steps, 'held') : undefined}; })()});
    if(held) tracks.push(brewTrack(d));
    if(!d.rite && d.ritual) notes.push({text: d.ritual.needed ? `Rite (${d.ritual.scale}): ${d.ritual.text}` : d.ritual.text});
    if(d.via) notes.push({text: d.via});
    if(!tracks.length) return null;
    return {id: `bench-${d.id}-making`, size: Math.max(520, 112 + 100 * Math.max(...tracks.map(t => t.steps.length - 1))), title: `${d.name} · Sequence ${d.seq}`,
        summary: held ? 'What to gather, then the brew from formula to drinking.' : 'Inspect only: the notes do not name every material, so nothing is counted.',
        tracks, notes, legend: legendFor('making', tracks.flatMap(t => t.steps))};
}

/**
 * Risk ledger (option O4): each condition's share of the added risk, largest first, with the words to act on.
 * Rows {id, label, status, share, text}; share is a whole percent of the risk above the rite's baseline. Equal condition
 * weights are assumed, as in every current rite; a weighted rite would pass its weights with the grade.
 */
export function riskLedger(d) {
    const rite = d?.rite;
    if(!rite) return null;
    const total = rite.conditions.reduce((n, c) => n + (c.loss ?? 0), 0);
    const rows = rite.conditions.map(c => ({id: c.id, label: c.label, status: c.status, share: total ? Math.round(100 * (c.loss ?? 0) / total) : 0,
        text: c.status === 'met' ? `Met: ${c.via}.` : c.status === 'substituted' ? `Stand-in: ${c.via} (fit ${c.fit}).` : `Missing. Wanted: ${c.wanted}.`}));
    rows.sort((a, b) => b.share - a.share);
    const first = rows.find(r => r.share > 0);
    return {odds: rite.odds, grade: rite.grade, rows,
        headline: `${rite.odds}% chance of losing control if drunk now (${GRADE_WORD[rite.grade]}). Pre-signs stay reversible about ${rite.recoveryDays} days.`,
        advice: first ? `Fix first: ${first.label}, about ${first.share}% of the added risk.` : 'Nothing left to fix: what remains is the rite\'s baseline risk.'};
}
