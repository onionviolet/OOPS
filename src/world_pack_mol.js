// Proposal: the first world pack (WA20 pilot), derived read-only from the
// existing hand-coded Cyoria content. It changes no runtime behavior; it shows
// what the pack format can already describe and where Cyoria is below the core
// floor. Tiers are conservative: built code is implemented-unverified here.
import {MOL_BASELINE, MOL_IDS, MOL_ITEM_SPECIFICATIONS, MOL_SOURCE_SNAPSHOT, molDefinitions, molSources} from './book_world_mol_content.js';

const W = MOL_IDS.world;
const CAST_FACT = 'book.mol.fact.academy_cast';
const ORIGINAL = new Set([MOL_IDS.opponent]);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

export function buildMolWorldPack() {
    const people = molDefinitions.people.map(p => ({id: p.id, kind: 'person', part: 'K6',
        status: ORIGINAL.has(p.id) ? 'authored' : 'source', facts: ORIGINAL.has(p.id) ? [] : [CAST_FACT],
        tier: 'T2', summary: p.description.slice(0, 400)}));
    const items = MOL_ITEM_SPECIFICATIONS.map(i => ({id: `book.mol.item.${slug(i.id)}`, kind: 'item', part: 'K9',
        status: 'authored', tier: 'T2', summary: i.description.slice(0, 400)}));
    // The operator is both a technique source and its power; one record each ID.
    const byId = new Map([...molSources, ...molDefinitions.powers].map(t => [t.id, t]));
    const techniques = [...byId.values()].map(t => ({id: t.id, kind: 'technique', part: 'K3',
        status: 'authored', tier: 'T2', summary: (t.bioDetail || t.description || t.label).slice(0, 400)}));
    return {
        schema: 1, id: 'book.mol.pack.cyoria_visitor', revision: 1, worldId: W, namespace: 'book.mol',
        label: 'Cyoria · academy visitor (pilot pack)',
        source: {title: 'Mother of Learning', snapshot: MOL_SOURCE_SNAPSHOT, boundary: MOL_BASELINE.cutoff},
        continuity: {id: 'book.mol.independent_visitor.branch', kind: 'divergent'},
        facts: [{id: CAST_FACT, status: 'source', locator: 'chapters 1–20 (coarse; per-person locators pending)', confidence: 'shown'}],
        // Two laws the code already enforces as power execution facts. The rest of
        // Cyoria's laws still live in prose and bespoke commands (K2 below floor).
        records: [
            {id: 'book.mol.law.device_needs_local_anchor', kind: 'law', status: 'authored', engine: 'mol.deviceSupported',
                reason: 'The keyed lamp only works with its locally anchored formula and supplied charge.'},
            {id: 'book.mol.law.no_personal_mana_casting', kind: 'law', status: 'inferred', engine: 'mol.playerSupported',
                reason: 'Without a demonstrated personal mana source, you operate devices instead of casting.'},
            {id: 'book.mol.loop.study_build_test', kind: 'loop', part: 'K13', status: 'authored', tier: 'T4',
                summary: 'Study formula, assemble and charge the keyed lamp, drill control, test it, then compile and commission.'},
            ...people, ...techniques, ...items],
        laws: [], generators: [],
        unknowns: MOL_BASELINE.unknowns.map((question, i) => ({id: `book.mol.unknown.${i + 1}`, question})),
        tiers: {K2: 'T1', K3: 'T2', K6: 'T2', K8: 'T1', K9: 'T2', K13: 'T4'},
    };
}
