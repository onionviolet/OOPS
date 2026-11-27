import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {slugify, scanDoc, parseCatalogue, declaredIds, runtimeEvidence, statusOf, matchScore, assembleCheats, summarize, pageCheats, listDocs, readCheats, MAX_PAGE} from '../prototypes/world-atlas/cheats.mjs';

const CAT = `# Cheat catalogue

## A. Information and foresight

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC1 | Appraisal eye | Read an object more closely | Body, system | Nine Eyes; analysis chips | Knowledge (CHT4) | Charges | built: \`true-appraisal\` | [LIB](CHEAT_LIBRARY.md#more-cheat-types) |
| CTC3 | Foresight ledger | Peek at a named future draw | Knowledge | Dinah in Worm | Seeded streams | Calls per day | built: \`ghost-id\` | [LIB](CHEAT_LIBRARY.md#nope) |
| CTC4 | Rehearsal and simulator | Simulate a branch | System | Warlock A.I. Chip | Power registry | Cost | partly: \`cheat.rehearsed_foe\` | new, agent addition |

## B. Time and loops

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC12 | Time loop | Repeat a fixed span | World law, soul | Mother of Learning | Carry ledger | Per world | not built | [LIB](CHEAT_LIBRARY.md#gameplay) |
`;
const LIB = `# Library

## More cheat types

| Cheat family | The loop it adds |
|---|---|
| Time loop | Repeat |
| Gizmo sense | Sense gizmos |

## Gameplay
`;
const CBW = `# By world

## Worm

| Holder | Cheat | Does |
| --- | --- | --- |
| Dinah | Foresight ledger of Dinah | Peeks |
| Eidolon | Rotating powers | Swaps |
`;
const BOARD = `# Board

## Reveal cheats

| Code | Cheat | Shows |
| --- | --- | --- |
| SH2 | Causality Lens | Why something happened |
| SH3 | Freshness Sense | Age of information |

- **ZZ9. Pocket weather.** a cheat that bends one cloud
`;
const SRC = [
    {file: 'src/cheat_definitions.js', text: "export const M=[{id:'true-appraisal',name:'True Appraisal',family:'x'},{id:'loaded-dice',name:'Loaded Dice'}]; const s={sources:[{kind:'k',id:'quiet-faculty'}]};"},
    {file: 'src/cheat_cards.js', text: "const c={id:'system-quests'}; if(choice==='ring-spirit'){}"},
    {file: 'src/rehearsed_foe.js', text: "register('cheat.rehearsed_foe')"},
];
const DOCS = {'docs/CHEAT_CATALOGUE.md': CAT, 'docs/CHEAT_LIBRARY.md': LIB, 'docs/CHEATS_BY_WORLD.md': CBW, 'docs/IDEABOARD_X.md': BOARD,
    'docs/CHEAT_RULES.md': '| CHT4 | **A cheat is an ability with terms.** | x |\n| CHT5 | **What backs a cheat decides.** | y |\n'};
const read = p => DOCS[p] ?? null;
const files = Object.keys(DOCS).sort();

test('slugify follows github anchors and numbers repeats', () => {
    const seen = new Map();
    assert.equal(slugify('More cheat types (2026-10-10)', seen), 'more-cheat-types-2026-10-10');
    assert.equal(slugify('A', seen), 'a'); assert.equal(slugify('A', seen), 'a-1');
});

test('scanDoc keeps tables with header and heading, skips fenced code', () => {
    const s = scanDoc('# T\n\n## H\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n```\n| X | Y |\n|---|---|\n| 3 | 4 |\n```\n');
    assert.equal(s.rows.length, 1); assert.deepEqual(s.rows[0].header, ['A', 'B']); assert.equal(s.rows[0].heading.slug, 'h'); assert.equal(s.rows[0].line, 7);
});

test('parseCatalogue reads CTC rows with their family', () => {
    const rows = parseCatalogue(CAT);
    assert.deepEqual(rows.map(r => r.id), ['CTC1', 'CTC3', 'CTC4', 'CTC12']);
    assert.equal(rows[0].family.code, 'A'); assert.equal(rows[3].family.title, 'Time and loops'); assert.deepEqual(rows[3].backing, ['World law', 'soul']);
});

test('definition ids come only from module entries, not from any id: in the file', () => {
    assert.deepEqual([...declaredIds(SRC[0].text)], ['true-appraisal', 'loaded-dice']);
});

test('implemented needs the doc to say built AND an id found in src; the doc alone is a working default', () => {
    const src = {definitions: {file: 'src/cheat_definitions.js', ids: declaredIds(SRC[0].text)}, cards: {file: 'src/cheat_cards.js', text: SRC[1].text}, other: SRC};
    const built = runtimeEvidence('built: `true-appraisal`', src);
    assert.equal(built.definition.id, 'true-appraisal'); assert.equal(statusOf('built', built), 'implemented');
    const ghost = runtimeEvidence('built: `ghost-id`', src);
    assert.deepEqual(ghost.unverifiedIds, ['ghost-id']); assert.equal(statusOf('built', ghost), 'working-default');
    const power = runtimeEvidence('partly: `cheat.rehearsed_foe`', src);
    assert.equal(power.power[0].file, 'src/rehearsed_foe.js'); assert.equal(statusOf('partly', power), 'working-default');
    assert.equal(statusOf('not-built', runtimeEvidence('not built', src)), 'proposal');
    assert.equal(runtimeEvidence('built: `system-quests`', src).cards[0].id, 'system-quests');
});

test('matchScore: exact type 1, phrase 0.9, unrelated 0', () => {
    const [ctc] = parseCatalogue(CAT);
    assert.equal(matchScore('Appraisal eye', ctc), 1);
    assert.equal(matchScore('analysis chips', ctc), 0.9);
    assert.equal(matchScore('Banana stand', ctc), 0);
});

test('assembleCheats: rows, variations with locators, candidates with inferred resemblance', () => {
    const d = assembleCheats({read, files, srcFiles: SRC});
    const byId = Object.fromEntries(d.rows.map(r => [r.id, r]));
    assert.equal(d.rows.length, 4);
    assert.equal(byId.CTC1.status, 'implemented'); assert.equal(byId.CTC1.runtime.definition.file, 'src/cheat_definitions.js');
    assert.equal(byId.CTC3.status, 'working-default'); assert.equal(byId.CTC3.runtime.definition, null); // doc says built, src has no such id
    assert.equal(byId.CTC12.status, 'proposal');
    assert.deepEqual(byId.CTC1.rules.cht.map(r => [r.code, r.how]), [['CHT4', 'named'], ['CHT5', 'backing']]);
    // Catalogue source link: anchor checked against the target doc's headings.
    const src = byId.CTC1.variations.find(v => v.kind === 'catalogue-source');
    assert.equal(src.anchorFound, true); assert.equal(src.match, 'linked'); assert.equal(src.line, 3);
    assert.equal(byId.CTC3.variations.find(v => v.kind === 'catalogue-source').anchorFound, false);
    // Library and by-world rows attach as inferred variations with doc and line.
    const lib = byId.CTC12.variations.find(v => v.kind === 'library-family');
    assert.equal(lib.doc, 'docs/CHEAT_LIBRARY.md'); assert.equal(lib.match, 'inferred'); assert.equal(lib.anchor, 'more-cheat-types'); assert.ok(lib.line > 0);
    const cbw = byId.CTC3.variations.find(v => v.kind === 'world-variant');
    assert.equal(cbw.world, 'Worm'); assert.equal(cbw.name, 'Foresight ledger of Dinah');
    // Candidates: unmatched names only, with locators; a close name resembles a row but is labelled inferred.
    const names = d.candidates.map(c => c.name);
    assert.ok(names.includes('Gizmo sense') && names.includes('Rotating powers') && names.includes('Pocket weather'));
    assert.ok(!names.includes('Time loop'));
    const lens = d.candidates.find(c => c.name === 'Causality Lens');
    assert.equal(lens.code, 'SH2'); assert.equal(lens.detector, 'coded'); assert.equal(lens.locator.file, 'docs/IDEABOARD_X.md'); assert.equal(lens.locator.heading, 'Reveal cheats');
    assert.equal(d.candidates.find(c => c.name === 'Pocket weather').code, 'ZZ9');
    for (const c of d.candidates) if (c.resembles) assert.equal(c.resembles.label, 'inferred');
    assert.ok(d.candidates.every(c => c.status === 'candidate' && /^cheat:cand:[0-9a-f]{8}$/.test(c.key)));
});

test('candidates dedupe by name across docs and rank by doc count', () => {
    const more = {...DOCS, 'docs/OTHER.md': '# O\n\n| Cheat | Does |\n|---|---|\n| Gizmo sense | again |\n'};
    const d = assembleCheats({read: p => more[p] ?? null, files: Object.keys(more).sort(), srcFiles: SRC});
    const g = d.candidates.filter(c => c.name === 'Gizmo sense');
    assert.equal(g.length, 1); assert.equal(g[0].docsCount, 2); assert.equal(g[0].alsoAt.length, 1); assert.equal(d.candidates[0].name, 'Gizmo sense');
});

test('summary counts, paging, filters and the page cap', () => {
    const d = assembleCheats({read, files, srcFiles: SRC});
    const s = summarize(d, {hash: 'h', files: 5});
    assert.equal(s.counts.cheats, 4); assert.equal(s.counts.withDefinition, 1); assert.deepEqual(s.counts.byStatus, {proposal: 1, 'working-default': 2, implemented: 1});
    assert.deepEqual(s.unlinkedDefinitions, ['loaded-dice']); assert.ok(s.counts.variations >= 4); assert.ok(s.topCandidates.length <= 25);
    assert.equal(pageCheats(d, {status: 'implemented'}).total, 1);
    assert.equal(pageCheats(d, {q: 'dinah'}).rows[0].id, 'CTC3'); // found through a by-world variation
    assert.equal(pageCheats(d, {world: 'worm'}).rows.map(r => r.id).includes('CTC3'), true);
    assert.equal(pageCheats(d, {status: 'candidate', q: 'lens'}).rows[0].name, 'Causality Lens');
    const p = pageCheats(d, {limit: 9999, offset: -4}); assert.equal(p.limit, MAX_PAGE); assert.equal(p.offset, 0);
    assert.equal(pageCheats(d, {limit: 1, offset: 1}).rows[0].id, 'CTC3');
});

test('listDocs skips private/ and research/novels, and readCheats works on a directory', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cheats-'));
    try {
        for (const [p, t] of Object.entries({'docs/CHEAT_CATALOGUE.md': CAT, 'docs/a/private/x.md': BOARD, 'docs/research/novels/y.md': BOARD, 'docs/research/z.md': BOARD})) {
            mkdirSync(join(dir, p.replace(/\/[^/]+$/, '')), {recursive: true}); writeFileSync(join(dir, p), t);
        }
        mkdirSync(join(dir, 'src'), {recursive: true}); writeFileSync(join(dir, 'src/cheat_definitions.js'), SRC[0].text);
        assert.deepEqual(listDocs(dir), ['docs/CHEAT_CATALOGUE.md', 'docs/research/z.md']);
        const d = readCheats(dir);
        assert.equal(d.rows.length, 4); assert.ok(d.candidates.some(c => c.name === 'Causality Lens' && c.locator.file === 'docs/research/z.md'));
        assert.equal(d.candidates.filter(c => c.name === 'Causality Lens')[0].docsCount, 1);
    } finally {rmSync(dir, {recursive: true, force: true});}
});
