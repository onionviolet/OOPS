// Author-facing coverage pack (WA lint format) for Cyoria, derived read-only from
// the installed book.mol world pack through the content adapter. It changes no
// runtime behavior. Tiers are conservative: built code is implemented-unverified here.
import {MOL_BASELINE, MOL_IDS, MOL_ITEM_SPECIFICATIONS, MOL_SOURCE_SNAPSHOT, molDefinitions, molSources} from './book_world_mol_content.js';

const W = MOL_IDS.world;
const CAST_FACT = 'book.mol.fact.academy_cast';
const ORIGINAL = new Set([MOL_IDS.opponent]);
const command = id => molDefinitions.commands.find(c => c.id === id);
// WAC10: K8 records cite the command that owns the job, meal or price and read
// its label at build time; no second copy of a number is stored (AR3).
const daily = (kind, ids) => ids.map(id => ({id: `book.mol.${kind}.${id}`, kind, part: 'K8', status: 'authored', engine: `book.mol.${id}`,
    tier: 'T2', summary: command(`book.mol.${id}`).label.slice(0, 400)}));
// WAC9: laws that existing commands, powers and controllers already read through
// molFacts. A law with no such fact stays out of this list (no new gates; WA17).
const LAWS = [
    ['nora_source_anchors_formula', 'mol.noraSourceSupported', 'Nora can only anchor the lamp formula while her own attuned reserve and trained source hold.'],
    ['operator_needs_trained_faculty', 'mol.operatorFacultySupported', 'Operating the keyed lamp needs the trained manual procedure; it is not a spellcasting faculty.'],
    ['retrieval_window_closes', 'mol.retrievalWindowOpen', 'The agreed hatch retrieval is open for a bounded played interval and then elapses.'],
    ['opponent_threat_is_physical', 'mol.opponentThreatSupported', 'The hatch scavenger threatens only while armed, ready and able to act with the hook.'],
    ['burn_impairs_device_work', 'mol.needsTreatment', 'Smoke or burn exposure impairs precise device work until treated or until it clears with time.'],
    ['hatch_return_needs_calm_outcome', 'mol.hatchReturnSupported', 'Revisiting the hatch is supported only after an avoided, deterred or negotiated encounter with a recorded forecast.']
].map(([id, engine, reason]) => ({id: `book.mol.law.${id}`, kind: 'law', status: 'authored', engine, reason}));
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
        // Laws point at facts the engine already reads (WAC9); jobs, meals and prices
        // cite their owning commands (WAC10). Behavior is unchanged (WA17).
        records: [
            {id: 'book.mol.law.device_needs_local_anchor', kind: 'law', status: 'authored', engine: 'mol.deviceSupported',
                reason: 'The keyed lamp only works with its locally anchored formula and supplied charge.'},
            {id: 'book.mol.law.no_personal_mana_casting', kind: 'law', status: 'inferred', engine: 'mol.playerSupported',
                reason: 'Without a demonstrated personal mana source, you operate devices instead of casting.'},
            ...LAWS,
            ...daily('job', ['house_shift', 'catalog_shift', 'kael_shift']),
            ...daily('food', ['meal', 'bread']),
            ...daily('price', ['paper', 'ink', 'cube', 'oil', 'rope']),
            {id: 'book.mol.loop.study_build_test', kind: 'loop', part: 'K13', status: 'authored', tier: 'T4',
                summary: 'Study formula, assemble and charge the keyed lamp, drill control, test it, then compile and commission.'},
            ...people, ...techniques, ...items],
        laws: [], generators: [],
        unknowns: MOL_BASELINE.unknowns.map((question, i) => ({id: `book.mol.unknown.${i + 1}`, question})),
        tiers: {K2: 'T2', K3: 'T2', K6: 'T2', K8: 'T2', K9: 'T2', K13: 'T4'},
    };
}
