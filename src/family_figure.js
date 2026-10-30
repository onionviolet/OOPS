// RPX21 family tree (docs/representations/FAMILY_TREE.md, proposal). Pure: a family projection
// in, an MDL2 figure spec out; no DOM, no storage, no seat branching. Generations are rows (the
// pedigree default), the played line is a track, and the household and heir are edges and notes.
//
// Projection: {selfName, line, lives, kin, succession, heirlooms}
//   line        the inherited_traits slice {selfId, members[{id, name, sex, sire, dam}]} or null
//   lives       chronicle lineage {ancestors[{name, age, generation, via}]} or null; generation is this life's
//   kin         living kin from relationships [{id, name, relation, age}]
//   succession  {law, reason, heirId?, heirName?, lifeEstate?} what a life end would do now, or null
//   heirlooms   [{name}] unique named objects this life holds
// options.knows(key) is the seat's knowledge read (observer_view.js). A key `family.<role>` holding
// 'known' | 'guessed' | 'unknown' overrides the default grade for that person; `family.raised`
// false lowers parents to guessed (a seat in a body it did not grow up in). Guessed and unknown
// people never carry the stored name into the spec, because the text form is read aloud (AD6-AD8).
export const FAMILY_GRADES = Object.freeze(['known', 'guessed', 'unknown']);
export const MAX_PER_ROW = 6;
const UNTRACKED = 'Their partner';
const PLACEHOLDER = /^(You|Your father|Your mother|Their partner|Heir \d+)$/;
const words = {m: {1: 'Father', 2: 'father', 0: 'Brother', child: 'Son'}, f: {1: 'Mother', 2: 'mother', 0: 'Sister', child: 'Daughter'}};

// Relational label from the path up (e.g. ['m','f'] = father's mother).
function ancestorWord(path) {
    if (path.length === 1) return words[path[0]][1];
    if (path.length === 2) return `${words[path[0]][1]}'s ${words[path[1]][2]}`;
    return `Great-grand${path[path.length - 1] === 'm' ? 'father' : 'mother'}`;
}
const gradeOf = (knows, role, fallback) => {
    const v = knows(`family.${role}`);
    return FAMILY_GRADES.includes(v) ? v : fallback;
};

export function familyPeople(projection, {knows = () => undefined} = {}) {
    const line = projection?.line, members = line?.members || [], byId = new Map(members.map(m => [m.id, m]));
    const self = byId.get(line?.selfId);
    const people = [{id: 'self', role: 'self', gen: 0, word: 'You', name: projection?.selfName || 'You', grade: 'known', self: true}];
    const edges = [];
    const raised = knows('family.raised') !== false;
    // Ancestors by sire and dam, with unknown placeholders up to grandparents.
    const up = (m, path, childId) => {
        for (const [key, sex] of [['sire', 'm'], ['dam', 'f']]) {
            const p = [...path, sex], role = p.join('.'), gen = -p.length;
            if (p.length > 3) continue;
            const parent = m ? byId.get(m[key]) : null;
            if (!parent && p.length > 2) continue;
            // An untracked partner (lineage_traits heirLine) is a guess by the game's own record.
            const fallback = !parent ? 'unknown' : (p.length === 1 && !raised) || parent.name === UNTRACKED ? 'guessed' : 'known';
            const grade = gradeOf(knows, role, fallback);
            const id = parent ? `m:${parent.id}` : `u:${role}`;
            people.push({id, role, gen, word: ancestorWord(p), name: parent && !PLACEHOLDER.test(parent.name) ? parent.name : null, grade});
            edges.push({from: childId, to: id, kind: 'parent'});
            if (parent || p.length < 2) up(parent, p, id);
        }
    };
    up(self, [], 'self');
    // Siblings share both parents; children have self as a parent; a partner is the other parent of a child.
    for (const m of members) {
        if (!self || m.id === self.id) continue;
        if (m.sire && m.sire === self.sire && m.dam === self.dam) {
            people.push({id: `m:${m.id}`, role: 'sibling', gen: 0, word: words[m.sex][0], name: PLACEHOLDER.test(m.name) ? null : m.name, grade: gradeOf(knows, `sibling.${m.id}`, 'known')});
            edges.push({from: `m:${m.id}`, to: 'self', kind: 'sibling'});
        } else if (m.sire === self.id || m.dam === self.id) {
            people.push({id: `m:${m.id}`, role: 'child', gen: 1, word: words[m.sex].child, name: PLACEHOLDER.test(m.name) ? null : m.name, grade: 'known'});
            edges.push({from: `m:${m.id}`, to: 'self', kind: 'parent'});
            const other = byId.get(m.sire === self.id ? m.dam : m.sire);
            if (other && !people.some(p => p.id === `m:${other.id}`)) {
                people.push({id: `m:${other.id}`, role: 'partner', gen: 0, word: 'Partner', name: PLACEHOLDER.test(other.name) ? null : other.name, grade: other.name === UNTRACKED ? 'guessed' : 'known'});
                edges.push({from: 'self', to: `m:${other.id}`, kind: 'partner'});
            }
            if (other) edges.push({from: `m:${m.id}`, to: `m:${other.id}`, kind: 'parent'});
        }
    }
    // Living kin recorded as relationships hang off this life.
    for (const k of projection?.kin || []) {
        const gen = k.relation === 'child' ? 1 : 0, word = {spouse: 'Spouse', child: 'Child', sibling: 'Sibling', kin: 'Kin'}[k.relation] || 'Kin';
        people.push({id: k.id, role: k.relation, gen, word, name: k.name, age: k.age, grade: gradeOf(knows, `kin.${k.id}`, 'known')});
        edges.push(k.relation === 'spouse' ? {from: 'self', to: k.id, kind: 'partner'} : k.relation === 'child' ? {from: k.id, to: 'self', kind: 'parent'} : {from: k.id, to: 'self', kind: 'sibling'});
    }
    // Grade gates the name: only a known person shows what the record calls them.
    for (const p of people) if (p.grade !== 'known') p.name = null;
    return {people, edges};
}

export function personLabel(p) {
    if (p.self) return p.name === 'You' ? 'You' : `You · ${p.name}`;
    // Guessed and unknown are figure states: the mark and the text form's "(guessed)" come from the primitive.
    return p.name ? `${p.word} · ${p.name}` : p.word;
}
// Known people draw plain with their initial; a guess takes the figure's guessed (~) state, unknown its ? state.
// `role` names what a mark means (self, ancestor, kin, heir), so a later motif pack restyles it without
// touching this adapter (round 2, item 20).
const markOf = p => p.self ? {state: 'active', effect: 'glow', glyph: 'Y'}
    : p.grade === 'unknown' ? {state: 'unknown'} : p.grade === 'guessed' ? {state: 'guessed'} : {glyph: (p.name || p.word).charAt(0).toUpperCase()};
const roleOf = (p, heirId) => p.self ? 'self' : p.id === heirId ? 'heir' : p.gen < 0 ? 'ancestor' : 'kin';
// Ranked succession rows for a list: [{id, name, why, rank}]. The first is who would inherit now.
export function successionRows(succession) {
    return (succession?.order || []).map((r, i) => ({...r, rank: i + 1}));
}

export function familyFigureSpec(projection, options = {}) {
    const {people, edges} = familyPeople(projection, options);
    const rows = new Map();
    for (const p of people) rows.set(p.gen, [...(rows.get(p.gen) || []), p]);
    const shown = new Set(), notes = [];
    const gens = [...rows.keys()].sort((a, b) => a - b);
    // Generations share the full height, oldest at the top.
    const rowY = gen => gens.length === 1 ? 0 : round(-0.85 + 1.7 * gens.indexOf(gen) / (gens.length - 1));
    for (const [gen, row] of [...rows.entries()].sort((a, b) => a[0] - b[0])) {
        // Parents' sides stay apart: father's line left, mother's right; self in the middle of its row.
        // Each person takes the middle of an equal share, so a parent sits between its own two parents.
        row.sort((a, b) => order(a) - order(b));
        const kept = row.slice(0, MAX_PER_ROW), extra = row.length - kept.length;
        if (extra > 0) notes.push({text: `${extra} more in generation ${gen > 0 ? '+' : ''}${gen}; the list below names them.`});
        kept.forEach((p, i) => { p.at = [round(-0.85 + 1.7 * (i + 0.5) / kept.length), rowY(gen)]; shown.add(p.id); });
    }
    const s = projection?.succession;
    const nodes = people.filter(p => shown.has(p.id)).map(p => ({id: p.id, label: personLabel(p), at: p.at, role: roleOf(p, s?.heirId), ...markOf(p)}));
    const figureEdges = edges.filter(e => shown.has(e.from) && shown.has(e.to)).map(e => ({...e}));
    if (s?.heirId && shown.has(s.heirId)) figureEdges.push({from: 'self', to: s.heirId, kind: 'heir', label: 'would inherit'});
    const lives = projection?.lives, tracks = [];
    if (lives?.ancestors?.length) {
        tracks.push({id: 'lives', label: 'Lives in this line', steps: [
            ...[...lives.ancestors].reverse().map(a => ({label: `${a.name}, died ${a.age}`, state: 'done'})),
            {label: 'This life', state: 'current'}]});
        // Step labels stay two lines under the track; how each estate passed is said in a note.
        for (const a of lives.ancestors) if (a.via === 'apprentice') notes.push({text: `${a.name}'s estate passed to a taught apprentice, not to blood kin.`});
    }
    if (s) {
        const next = successionRows(s).slice(1).map(r => r.name);
        const who = s.heirName ? `${s.heirName} would inherit${next.length ? `, then ${next.join(', then ')}` : ''}. ` : '';
        notes.unshift({text: `If this life ended now (${s.law}): ${who}${s.lifeEstate ? `${s.lifeEstate} keeps the house for life. ` : ''}${s.reason}`});
    }
    for (const h of projection?.heirlooms || []) notes.push({text: `Heirloom: ${h.name}, passes with the estate.`});
    const counts = FAMILY_GRADES.map(g => [g, people.filter(p => !p.self && p.grade === g).length]).filter(([, n]) => n);
    return {
        id: 'family-tree', size: 760, title: 'Your family',
        summary: `Only what you know: ${counts.map(([g, n]) => `${n} ${g}`).join(', ') || 'nobody else recorded'}. ? marks someone nobody recorded; ≈ marks a guess.`,
        nodes, edges: figureEdges, tracks, notes,
        legend: [{state: 'active', label: 'you'}, {state: 'unknown', label: 'nobody recorded them'},
            {kind: 'parent', label: 'child to parent'}, ...(figureEdges.some(e => e.kind === 'partner') ? [{kind: 'partner', label: 'partner'}] : []),
            ...(figureEdges.some(e => e.kind === 'sibling') ? [{kind: 'sibling', label: 'sibling'}] : []),
            ...(figureEdges.some(e => e.kind === 'heir') ? [{kind: 'heir', label: 'would inherit'}] : [])],
    };
}
const round = n => Math.round(n * 100) / 100;
// Row order: father's side, siblings, self, partner and spouse, other kin, mother's side; children by record order.
function order(p) {
    if (p.self) return 50;
    const side = p.role.startsWith('m') ? 0 : p.role.startsWith('f') ? 100 : null;
    if (side !== null && p.role.includes('.')) return side + (p.role.split('.')[1] === 'm' ? 1 : 2);
    if (side !== null && p.role.length === 1) return side;
    return {sibling: 40, partner: 60, spouse: 61, kin: 70, child: 50}[p.role] ?? 80;
}

// Alternative form (round 2, item 7/18): the same people as an ancestor fan, you at the centre and one
// ring per generation back, each person in a fixed slot so a gap is a visible empty place. Suits a long
// line of ancestors; descendants and the household have no place in it, so it is never the only view.
export function familyFanSpec(projection, options = {}) {
    const {people} = familyPeople(projection, options);
    const back = people.filter(p => p.gen < 0 && /^[mf](\.[mf])*$/.test(p.role));
    const depth = Math.max(1, ...back.map(p => -p.gen));
    const rings = Array.from({length: depth}, (_, i) => ({id: `g${i + 1}`, label: i === 0 ? 'Parents' : i === 1 ? 'Grandparents' : 'Great-grandparents', radius: round((i + 1) / depth), slots: 2 ** (i + 1), rotate: 180 + 180 / 2 ** (i + 1)}));
    // Slot index from the path: father's side fills the left half, mother's the right; each step halves the arc.
    const slot = role => role.split('.').reduce((n, sex) => n * 2 + (sex === 'f' ? 1 : 0), 0);
    const slots = back.map(p => ({id: p.id, ring: `g${-p.gen}`, index: slot(p.role), label: personLabel(p), ...(p.grade === 'unknown' ? {state: 'empty'} : p.grade === 'known' ? {state: 'filled'} : {})}));
    return {id: 'family-fan', size: 720, title: 'Your ancestors, as a fan',
        summary: 'Each ring is one generation back; every place is drawn, so a gap shows as an empty slot.',
        rings, slots, nodes: [{id: 'self', label: 'You', glyph: 'Y', at: 'center', state: 'active'}],
        legend: [{state: 'filled', label: 'known'}, {state: 'empty', label: 'nobody recorded them'}]};
}
