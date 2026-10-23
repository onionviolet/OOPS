import {check, natural as integer} from './basics.js';
// Family tree over frozen references (GHS8, docs/GENETICS_AND_HERO_START_PLAN_2026-10-17.md).
// Each heir's chronicle records, once at creation, who came before: the lines
// below are copied from the ended life and never recomputed, so a later change
// to anyone cannot rewrite the tree. Names, links and caps are reversible
// proposals. 'kin' means the heir took the estate as next of kin; 'apprentice'
// is a taught, non-biological line (NK-I7) and is drawn as a mentor link.
const object = v => v && typeof v === 'object' && !Array.isArray(v);
export const MAX_ANCESTORS = 24;
export const MAX_RELATIVES = 12;
export const RELATIONS = Object.freeze(['spouse', 'child', 'sibling', 'kin']);
const text = s => String(s ?? '').slice(0, 80);

// The new lineage for an heir: the ended life becomes the nearest ancestor and
// the old lineage follows it. relatives are people the ended life left (spouse,
// children, siblings), frozen as given.
export function extendLineage(previousChronicle, grave, recipient, relatives = []) {
    const old = previousChronicle?.life?.experience?.lineage;
    const generation = previousChronicle?.life?.experience?.generation || 1;
    const ancestors = [{name: text(grave.name), age: grave.age, generation, via: recipient === 'apprentice' ? 'apprentice' : 'kin'},
        ...(old?.ancestors || [])].slice(0, MAX_ANCESTORS);
    const rel = (Array.isArray(relatives) ? relatives : []).filter(r => object(r) && typeof r.name === 'string' && RELATIONS.includes(r.relation))
        .map(r => ({name: text(r.name), relation: r.relation, age: integer(r.age) ? r.age : null, of: generation}));
    // Relatives stay attached to the generation that left them, so older branches survive.
    return {ancestors, relatives: [...rel, ...(old?.relatives || [])].slice(0, MAX_RELATIVES)};
}

export function validateLineage(l) {
    if(l == null) return;
    check(object(l) && Array.isArray(l.ancestors) && l.ancestors.length <= MAX_ANCESTORS && Array.isArray(l.relatives) && l.relatives.length <= MAX_RELATIVES, 'Invalid lineage.');
    check(l.ancestors.every(a => object(a) && typeof a.name === 'string' && a.name.length <= 80 && integer(a.age) && integer(a.generation) && a.generation > 0 && ['kin', 'apprentice'].includes(a.via)), 'Invalid lineage ancestor.');
    check(l.relatives.every(r => object(r) && typeof r.name === 'string' && r.name.length <= 80 && RELATIONS.includes(r.relation) && (r.age === null || integer(r.age)) && integer(r.of) && r.of > 0), 'Invalid lineage relative.');
}

// Pure: chronicle in, tree out. Root is the oldest recorded ancestor; the last
// node is the living or ended life that holds this chronicle. Relatives hang
// off the nearest ancestor (the life that left them).
export function projectFamilyTree(chronicle, selfName = 'You') {
    const x = chronicle?.life?.experience, l = x?.lineage;
    const generation = x?.generation || 1;
    const self = {key: 'self', name: selfName, generation, via: null, self: true, relatives: [], children: []};
    if(!l || !l.ancestors.length) return {root: self, count: 1, hasFamily: false};
    // Build from the heir upward; each ancestor's `via` is how the next life
    // down received the estate.
    let node = self;
    l.ancestors.forEach((a, i) => {
        node.via = a.via;
        node = {key: `ancestor:${i}`, name: a.name, age: a.age, generation: a.generation, via: null, self: false,
            relatives: l.relatives.map((r, j) => ({key: `relative:${j}`, ...r})).filter(r => r.of === a.generation), children: [node]};
    });
    return {root: node, count: l.ancestors.length + l.relatives.length + 1, hasFamily: true};
}

const LINK_WORDS = {kin: 'next of kin', apprentice: 'taught apprentice'};
const RELATION_WORDS = {spouse: 'spouse', child: 'child', sibling: 'sibling', kin: 'kin'};
// Flat, ordered rows for a list view: {key, depth, name, detail}.
export function familyTreeRows(tree) {
    const rows = [];
    const walk = (n, depth) => {
        const bits = [`generation ${n.generation}`];
        if(n.age != null) bits.push(`died at ${n.age}`);
        if(n.via) bits.push(`took the estate as ${LINK_WORDS[n.via]}`);
        rows.push({key: n.key, depth, name: n.self ? `${n.name} (this life)` : n.name, detail: bits.join(' · ')});
        for(const r of n.relatives || []) rows.push({key: r.key, depth: depth + 1, name: r.name, detail: `${RELATION_WORDS[r.relation]} of ${n.name}${r.age != null ? `, ${r.age}` : ''}`});
        for(const c of n.children) walk(c, depth + 1);
    };
    walk(tree.root, 0);
    return rows;
}
