// RPX1/RPX2 adapter: one brewing-bench formula (the bench detail the place panel already reads) becomes an MDL2 figure spec.
// Rite conditions sit as slots on a ring with the stated odds at the centre; the formula's materials and the brew are tracks
// below. Pure data in, pure data out: no DOM, no world imports, no truth beyond the detail
// (MR31). No heat band: a track step exists only where the world's law reads it (MR16, MR17), and this bench reads time only.
// Broken is not used yet: nothing here is attempted, so nothing has failed; a graded attempt at the moment of drinking would
// mark its failing condition broken (docs/representations/RITUALS_AND_MAKING.md, next slice).
const CONDITION_STATE = {met: 'filled', substituted: 'strained', absent: 'empty'};
const GRADE_STATE = {met: 'filled', substituted: 'strained', partial: 'strained', absent: 'empty'};
const LEGEND = [
    ['filled', 'met or held'], ['strained', 'a stand-in, raises the odds'], ['empty', 'still needed'],
    ['done', 'done or held'], ['current', 'step now'], ['pending', 'step to come']];

function brewTrack(d) {
    const held = d.slots.every(s => s.held >= s.need), dosed = d.doses > 0;
    const now = !d.formulaKnown ? 0 : d.brewing ? (d.ready ? 3 : 2) : dosed ? 4 : held ? 2 : 1;
    const labels = ['Formula', 'Materials', d.brewing && !d.ready ? `Brew · ${d.left} min left` : `Brew · ${d.minutes} min`, 'Bottle', d.rite || d.ritual?.needed ? 'Drink with the rite' : 'Drink'];
    return {id: 'brew', label: 'Brew', steps: labels.map((label, i) => ({label, state: i < now ? 'done' : i === now ? 'current' : 'pending',
        ...(i === now && i === 2 && d.brewing ? {effect: 'pulse'} : {})}))};
}

/** Figure spec for one bench formula; `d` is the bench's selected detail. Returns null when there is nothing to draw. */
export function riteFigureSpec(d) {
    if(!d) return null;
    const brewable = d.status === 'brewable', rite = d.rite || null;
    const rings = [], slots = [], nodes = [], tracks = [], notes = [];
    if(rite) {
        // Two conditions sit left and right so their labels clear the odds at the centre.
        rings.push({id: 'rite', label: rite.label, radius: 1, slots: rite.conditions.length, rotate: rite.conditions.length === 2 ? 90 : 0});
        rite.conditions.forEach((c, index) => slots.push({id: `rite-${c.id}`, ring: 'rite', index, label: c.label, state: CONDITION_STATE[c.status],
            ...(c.status === 'met' ? {effect: 'glow'} : {})}));
        nodes.push({id: 'drink', at: 'center', label: `Drink now · ${rite.odds}% odds`, state: GRADE_STATE[rite.grade]});
    }
    // Materials are a list to gather, not components laid in the circle, so they get their own row; six labels inside a ring collide.
    if(d.slots.length) tracks.push({id: 'materials', label: 'Materials', steps: d.slots.map(s => brewable && !d.via
        ? {label: `${s.name} ${s.held}/${s.need}`, state: s.held >= s.need ? 'done' : 'empty'} : {label: s.name})});
    if(brewable && !d.via) tracks.push(brewTrack(d));
    if(rite) {
        notes.push({state: rite.grade === 'met' ? undefined : 'strained', text: `Rite ${rite.grade}: stated loss-of-control odds ${rite.odds} percent if drunk now. Pre-signs stay reversible about ${rite.recoveryDays} days.`});
        for(const c of rite.conditions) {
            if(c.status === 'substituted') notes.push({state: 'strained', text: `${c.label}: stand-in ${c.via}, fit ${c.fit}.`});
            if(c.status === 'absent') notes.push({state: 'empty', text: `${c.label}: still needed. Wanted: ${c.wanted}.`});
        }
    } else if(d.ritual) notes.push({text: d.ritual.needed ? `Rite (${d.ritual.scale}): ${d.ritual.text}` : d.ritual.text});
    if(d.via) notes.push({text: d.via});
    if(!rings.length && !tracks.length) return null;
    const used = new Set([...slots, ...nodes, ...tracks.flatMap(t => t.steps)].map(x => x.state).filter(Boolean));
    return {id: `bench-${d.id}`, size: Math.max(rite ? 480 : 520, 112 + 100 * Math.max(0, ...tracks.map(t => t.steps.length - 1))), title: `${d.name} · Sequence ${d.seq}`,
        summary: rite ? `${rite.label}: ${rite.conditions.length} conditions, graded ${rite.grade}.` : brewable ? 'Materials and brew steps.' : 'Inspect only: the notes do not name every material.',
        rings, slots, nodes, tracks, notes: notes.map(n => n.state ? n : {text: n.text}),
        legend: LEGEND.filter(([state]) => used.has(state)).map(([state, label]) => ({state, label}))};
}
