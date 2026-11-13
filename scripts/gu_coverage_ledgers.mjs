#!/usr/bin/env node
// Builds docs/coverage/gu_kinds.jsonl and docs/coverage/gu_moves.jsonl (plan CV1-CV4, MS1) from the private
// Gu review index, the chapter-checked evidence and the Gu working law. Deterministic: the same inputs give
// byte-identical ledgers. Labels come from data first (GL7): catalogue fields, wiki rank and type
// categories, then a short name-keyword table marked as an inference.
// Usage: node scripts/gu_coverage_ledgers.mjs [path/to/gu-identities.json]
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {GU_CASE_GAPS, GU_CASE_MODULE, guCaseNote} from '../src/world_packs/gu_effect_pack.js';
import {GU_MOVE_CASE_MODULE, MOONBLADE_COVERAGE_ID, PLATE_SHELTER_COVERAGE_ID,
    TELEPORT_ARRAY_COVERAGE_ID, CLEANSING_ARRAY_COVERAGE_ID, THREE_HEADS_COVERAGE_ID,
    FUTURE_TRAVEL_COVERAGE_ID} from '../src/world_packs/gu_move_coverage_cases.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {derivedAbilityFrom, guMethods, guRunnableCoverage} from '../src/gu_working_law.js';

const root = new URL('..', import.meta.url).pathname;
const privatePath = 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json';
const candidates = [process.argv[2], join(root, privatePath), join('/Users/weiwei/code/yet-another-idle-rpg', privatePath)];
const indexPath = candidates.find(path => path && existsSync(path));
if (!indexPath) throw Error('The private Gu review index is needed (gitignored); pass its path.');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const test = 'tests/gu_coverage.test.js';

// Wiki type categories that name an effect family (GG2). Support, Consumable, Grass, Storage and House name a
// role or a form, not an effect, so they supply none.
const typeFunction = {'Offensive Type Gu': 'attack', 'Defensive Type Gu': 'guard', 'Movement Type Gu': 'move',
    'Flying Type Gu': 'fly', 'Steed Type Gu': 'move', 'Investigative Type Gu': 'sense', 'Concealment Type Gu': 'conceal',
    'Healing Type Gu': 'heal', 'Amplification Type Gu': 'amplify'};
// Name keywords, checked in order, whole words only. An inference, labelled as one in the row.
const nameFunction = [
    [/\b(strength|power|might)\b/i, 'strength'],
    [/\b(shield|armou?r|skin|guard|shell|barrier)\b/i, 'guard'], [/\b(wings?|flight|fly|flying)\b/i, 'fly'],
    [/\b(eye|eyes|ear|ears|sight|investigat\w*|probe|scout)\b/i, 'sense'], [/\b(stealth|hide|hidden|conceal\w*|invisib\w*)\b/i, 'conceal'],
    [/\b(heal\w*|recover\w*|restor\w*|cure|vitality)\b/i, 'heal'], [/\b(blade|sword|spear|arrow|fist|claw|strike|cut|kill\w*)\b/i, 'attack'],
[/\b(step|steps|dash|charge|travel|escape|leap|run)\b/i, 'move'],
    [/\b(light|glow|shine|bright\w*)\b/i, 'illuminate'], [/\b(steal|theft|plunder|rob)\b/i, 'steal'],
];
// Mechanism owners by chat letter (SC4): every Gu row sits on G; each running method adds its owner.
const mechanismOf = {activate: 'K', convert: 'W', refine: 'F', grow: 'L', treat: 'L', move: 'K'};
const owners = methods => ['G', ...new Set(methods.map(m => mechanismOf[m]))];

const coverage = new Map(guRunnableCoverage().rows.map(row => [row.kind, row]));
const ranksOf = record => [...new Set([...(record.metadata?.fandom_category_ranks ?? []),
    ...(record.metadata?.saga_rank ? [record.metadata.saga_rank] : [])])].sort((a, b) => a - b);
const pathOf = record => {
    const path = (record.fandom?.categories ?? []).find(c => c.endsWith(' Path') && c !== 'Unknown Path');
    return path ? path.slice(0, -5).toLowerCase() : record.metadata?.saga_path ?? null;
};
const sourceOf = record => [record.saga?.url, record.fandom?.revision_url ?? record.fandom?.url].filter(Boolean);
const nameOf = record => record.saga?.name ?? record.fandom?.name ?? record.id;

function kindRow(record) {
    const base = {id: record.id, name: nameOf(record), source: sourceOf(record), test};
    if (record.status === 'reference-page') return {...base, layer: 'wiki', state: 'not-a-thing:wiki-reference-page', mechanisms: ['G'], note: 'A wiki list or overview page.'};
    if (record.status === 'novel-checked') {
        const entry = guCatalogue[record.id];
        const row = coverage.get(record.id);
        const chapters = record.observation?.chapters ?? [];
        const checked = {...base, source: [...base.source, ...chapters.map(ch => `ch${ch}`)], layer: 'chapter'};
        if (record.id === 'yaksha-octopus-king-wild-immortal') {
            return {...checked, state: 'not-a-thing:provisional-sighting', mechanisms: ['G'],
                note: 'A sighting of an unnamed wild Immortal; no kind to run until a chapter names it.'};
        }
        const rule = !entry?.parts?.value.function ? 'effect-unknown' : 'rank-unknown';
        const former = row?.methods.length
            ? {state: 'runs-authored', mechanisms: owners(row.methods),
                note: row.derived ? 'Chapter rank and function; ability derived by gu.working dials (labelled derived).'
                    : 'Chapter-checked identity; numbers that the chapters leave open are authored in the catalogue binding.'}
            : {state: `blocked:${rule}`, mechanisms: ['G'], note: row?.gap ?? 'not catalogued'};
        const seen = guCaseNote(record.id);
        const gap = GU_CASE_GAPS[record.id];
        if (!seen && !gap) return {...checked, ...former};
        const history = `Former state: ${former.state}. ${former.note}`;
        if (seen) return {...checked, state: 'expressed-authored', mechanisms: ['G', 'P', 'W'],
            case: {module: GU_CASE_MODULE, id: record.id}, test: 'tests/gu_effect_pack.test.js',
            note: `${seen} Resolved effect scene; inputs and any open amounts are authored calibration. ${history}`};
        return {...checked, ...former, note: `${gap} ${history}`};
    }
    const ranks = ranksOf(record);
    const types = (record.fandom?.categories ?? []).filter(c => typeFunction[c]);
    const byType = types.length ? typeFunction[types[0]] : null;
    const byName = byType ? null : nameFunction.find(([pattern]) => pattern.test(nameOf(record)))?.[1] ?? null;
    const fn = byType ?? byName;
    const rank = ranks.length ? ranks[0] : null;
    const wiki = {...base, layer: 'wiki', status: record.status, rank, function: fn, path: pathOf(record),
        labelBasis: byType ? 'wiki-type' : byName ? 'name-keyword-inference' : null};
    if (rank === null) return {...wiki, state: 'blocked:rank-unknown', mechanisms: ['G'], note: 'No wiki rank label; needs a chapter pass or an authored-rank dial.'};
    if (!fn) return {...wiki, state: 'blocked:effect-unknown', mechanisms: ['G'], note: 'No effect label from type or name; needs a chapter pass (GL2).'};
    if (!derivedAbilityFrom({rank, function: fn})) throw Error(`cannot derive ${record.id}`);
    return {...wiki, state: 'runs-authored', mechanisms: owners(['activate']),
        note: `Unchecked wiki identity (tentative, SKR3); lowest wiki rank ${rank}; ${byType ? 'function from wiki type' : 'function inferred from the name'}; ability derived.`};
}

function moveRow(move) {
    const base = {id: move.id, name: move.family, source: [move.source, ...(move.chapters ?? []).map(ch => `ch${ch}`)],
        layer: 'chapter', status: move.status, roles: move.roles.map(role => ({id: role.id, kind: role.kind ?? null})), test};
    if (move.id === 'iceblade-storm') return {...base, state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'],
        case: {module: GU_MOVE_CASE_MODULE, id: move.id}, test: 'tests/gu_coupled_working.test.js',
        note: 'Coupled world beat verifies living Gu, payment, movement, freezing, harm and timed protection. Timing, quantities and local geometry are authored.'};
    if (move.id === 'giant-hand-condensed-core') return {...base, state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'],
        case: {module: GU_MOVE_CASE_MODULE, id: move.id}, test: 'tests/gu_giant_hand_working.test.js',
        note: 'Timed Myriad Self and Group Strength activations spend live reserves and move a slab after restore. The support pair, force, cost and load are authored.'};
    if (move.id === 'giant-hand-stored-phantoms') return {...base, state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'],
        case: {module: GU_MOVE_CASE_MODULE, id: move.id}, test: 'tests/gu_giant_hand_working.test.js',
        note: 'Prepared phantoms survive restore, move a live slab on release, and expire before another release can charge the supports. The compressed preparation roles and timing are authored.'};
    if (move.id === TELEPORT_ARRAY_COVERAGE_ID) return {...base, state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'],
        case: {module: GU_MOVE_CASE_MODULE, id: move.id},
        note: 'A six-hour setup survives restore. The installed route carries travellers and their living keys both ways after the plate is rewritten and removed. Key identity, costs, crossing time and severance are authored.'};
    if (move.id === CLEANSING_ARRAY_COVERAGE_ID) return {...base, state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'],
        case: {module: GU_MOVE_CASE_MODULE, id: move.id},
        note: 'The chapter proposes the rewrite. An authored array wears down a compatible personal restraint over paid pulses after the plate is removed. The pulse, compatible effects, cost and duration are authored.'};
    if (move.id === THREE_HEADS_COVERAGE_ID) return {...base, state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'],
        case: {module: GU_MOVE_CASE_MODULE, id: move.id}, test: 'tests/gu_three_heads_working.test.js',
        note: 'Three operators fund eighteen live Gu to form a body that lifts a heavy gate after restore. A committed Gu prevents formation and separation stops a later lift. Constituent identities, costs and load are authored.'};
    if (move.id === FUTURE_TRAVEL_COVERAGE_ID) return {...base, state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'],
        case: {module: GU_MOVE_CASE_MODULE, id: move.id},
        note: 'Paid attunement funds a blank River anchor for projected travel. A live River change refuses a pending cast after restore and leaves past arrivals in place. The attunement and course checks are authored.'};
    const unnamed = move.roles.filter(role => !role.kind);
    if (unnamed.length) return {...base, state: 'blocked:unnamed-role', mechanisms: ['G'],
        note: `Roles with no named Gu: ${unnamed.map(role => role.id).join(', ')}.`};
    const stuck = move.roles.filter(role => !guMethods(role.kind).activate);
    if (stuck.length) return {...base, state: `blocked:role-cannot-run`, mechanisms: ['G'],
        note: `Role kinds that cannot activate yet: ${stuck.map(role => role.kind).join(', ')}.`};
    return {...base, state: 'runs-authored', mechanisms: owners(['move']),
        note: 'Composed working, one activate step per role; supports before cores (GG9), otherwise record order; order and costs authored where the chapters leave them open.'};
}
function leadRow(lead) {
    const name = lead.saga?.name ?? lead.fandom?.name;
    const slug = (lead.saga?.url ?? lead.fandom?.url).replace(/[?#].*$/, '').replace(/\/$/, '').split('/').pop().toLowerCase();
    return {id: `lead:${slug}`, name, source: [lead.saga?.url, lead.fandom?.url].filter(Boolean), layer: 'wiki', status: lead.status,
        tier: lead.saga?.tier ?? null, chapterHint: lead.saga?.chapter_hint ?? null, test,
        state: 'blocked:roles-unknown', mechanisms: ['G'], note: 'A wiki move lead; its component Gu and order need a chapter pass before it can run.'};
}

const kinds = index.records.map(kindRow);
const moves = [...index.moves.map(moveRow), ...index.move_candidates.records.map(leadRow)];
moves.push({id: MOONBLADE_COVERAGE_ID, name: 'Little Light Moonblade',
    source: ['docs/research/RI_MOONBLADE_DAMAGE_CALIBRATION_2026-11-12.md', 'ch70'], layer: 'authored',
    roles: [{id: 'blade', kind: 'moonlight'}, {id: 'light', kind: 'little-light'}],
    state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'], test: 'tests/gu_moonblade_contact.test.js',
    note: 'A plain Moonblade falls short. Little Light extends the paid cast to the same target after mid-flight restore. Range, damage and costs use authored units.',
    case: {module: GU_MOVE_CASE_MODULE, id: MOONBLADE_COVERAGE_ID}});
moves.push({id: PLATE_SHELTER_COVERAGE_ID, name: 'Formation Plate Shelter',
    source: ['docs/GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#gu-capability-coverage-before-ui-2026-11-12', 'GKM268'],
    layer: 'authored', roles: [{id: 'plate', kind: 'formation-plate'}],
    state: 'expressed-authored', mechanisms: ['G', 'K', 'W', 'L'], test: 'tests/gu_coupled_working.test.js',
    note: 'The paid rewrite survives restore and the installed shelter stops a strike until expiry. Shelter is an authored layout.',
    case: {module: GU_MOVE_CASE_MODULE, id: PLATE_SHELTER_COVERAGE_ID}});
for (const rows of [kinds, moves]) {
    const seen = new Set();
    for (const row of rows) {
        while (seen.has(row.id)) row.id += '~';
        seen.add(row.id);
    }
}
// P's ledger format has six base fields and the optional case link. G's labels (layer, rank, function, roles and
// their basis) go to a sidecar keyed by ledger and id, which the coverage test reads to run each row.
const FIELDS = ['id', 'source', 'state', 'mechanisms', 'test', 'note', 'case'];
const ledgerRow = row => ({...Object.fromEntries(FIELDS.map(f => [f, row[f]])), source: row.source.join('; ')});
const labelsOf = rows => Object.fromEntries(rows.map(row => [row.id, Object.fromEntries(Object.entries(row)
    .filter(([key, value]) => !FIELDS.includes(key) && value !== null && value !== undefined))]));
const out = join(root, 'docs/coverage');
mkdirSync(out, {recursive: true});
const write = (name, rows) => writeFileSync(join(out, name), rows.map(row => JSON.stringify(ledgerRow(row))).join('\n') + '\n');
write('gu_kinds.jsonl', kinds);
write('gu_moves.jsonl', moves);
writeFileSync(join(out, 'gu_labels.json'), JSON.stringify({kinds: labelsOf(kinds), moves: labelsOf(moves)}) + '\n');
const tally = rows => rows.reduce((acc, row) => ({...acc, [row.state.split(':')[0] === 'blocked' || row.state.startsWith('not-a-thing')
    ? row.state : row.state]: (acc[row.state] ?? 0) + 1}), {});
console.log(JSON.stringify({kinds: kinds.length, moves: moves.length, kindStates: tally(kinds), moveStates: tally(moves)}));
