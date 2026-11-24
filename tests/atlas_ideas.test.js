import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {scanIdeas, scanPanels, statusWord, statedStatus, parseRuleRegister, linkedDocs, assembleIdeas, summarize, pageIdeas, pageBoards, rowDetail, familiesOf, residueOf, readIdeas, prefixOf, baseOf, boardSlug, MAX_PAGE, DEFAULT_STATUS}
    from '../prototypes/world-atlas/ideas.mjs';

const TABLE = `# Table board

## Round 1 (TB1–TB3)

| Code | Idea | Status |
| --- | --- | --- |
| TB1 | First table idea, see TB2 and CTC3 | Built 2026-11-01 |
| TB2 · Second idea | refines nothing | Proposal |
| TB3 = TB9 | Aliased | |
| TB4, TB5 | two codes in one cell | |
`;
const BOLD = `# Bold board

## Round 6 (BD1–BD5)

**BD1 · Dotted title.** The body names TB1 on another board and WA2 in a rulebook, mentions \`deeds\` and src/deeds_ui.js,
the lotm world and gu_moves:row-1. Continuation line.

**BD2 Title without separator.** More text here.

**BD3.** A bare-code lead then text that becomes the title.

**BD4 · Stated (built).** The status sits in the bold title.

**BD4a · Refines BD4.** Suffix code.

**BD5 · A title long enough to push the status window well past its first eighty characters.** [accepted decisions](x.md) is a link label. Builds on BD1 (accepted 2026-10-27).
`;
const LIST = `# List board

## Round 2

- LB1: plain list item
  - LB2: nested under LB1
- **LB3 · Bold list item**
- LB4 and LB5 change each other
- LB6's seven shapes

### LB7 Heading item

Body under the heading.

#### LB8 Subheading item

LB9: a plain line item
LB10 custom without separator prose
`;
const WA_IDEA = `# Atlas ideaboard

## Recommended first five

**WA1 · A world wears its book.** A restatement.

## Flavour

**WA1 · Theme table per world.** The real definition.
**WA2 · Kind glyphs.** Glyphs, see WA1 and WA70.

## Built today

**WA3 · Shipped one.** Under a status heading.
`;
const WA_RULES = `# World absorption rules

| Code | Rule | Status |
| --- | --- | --- |
| WA1 | **Worlds absorb through readers.** | Accepted |
| WA2 | **Evidence before claims.** | Accepted |
| WA70 | **A late rule.** | Accepted |
`;
const REGISTER = `# Rules index

## Register of rule sets

| Set | Codes | Status | Covers | Owner |
|---|---|---|---|---|
| World absorption | WA1–WA70 | Accepted | Worlds | [WORLD_ABSORPTION_RULES](WORLD_ABSORPTION_RULES.md) |

## Reserved prefixes (2026-10-19)

The prefixes of the [register](#register-of-rule-sets) are reserved: AD, WA, UR, plus T for the tension rows and
"Rulebook". Next.
`;
const IDEA_INDEX = `# Idea index

[Table board](research/TABLE_BOARD.md) and [Bold board](research/BOLD_BOARD.md#round-6).
`;
const WRITEUP = `# Writeup register\n\n| [Atlas ideaboard](../research/ATLAS_IDEABOARD.md) | x |\n`;
const OTHER = `# Other

**BD1 · Same code on another board.** Collides with the bold board.

**BD2 · Another.** x

**BD9 · Another.** x
`;
const SMALL = `# Small\n\n**SM1 · Only one.** x\n`;
const DOCS = {
    'docs/RULES_INDEX.md': REGISTER, 'docs/IDEA_INDEX.md': IDEA_INDEX, 'docs/gm/WRITEUP_REGISTER.md': WRITEUP,
    'docs/WORLD_ABSORPTION_RULES.md': WA_RULES, 'docs/research/ATLAS_IDEABOARD.md': WA_IDEA,
    'docs/research/TABLE_BOARD.md': TABLE, 'docs/research/BOLD_BOARD.md': BOLD, 'docs/research/LIST_BOARD.md': LIST, 'docs/research/OTHER.md': OTHER, 'docs/research/SMALL.md': SMALL,
    'docs/private/HIDDEN.md': '**HD1 · hidden.** x\n**HD2 · hidden.** x\n**HD3 · hidden.** x\n',
    'docs/audits/IDEA_REGISTRY_SWEEP_2026-11-24.md': '| Code | x |\n|---|---|\n| SW1 | a |\n| SW2 | b |\n| SW3 | c |\n',
    'docs/CHEAT_CATALOGUE.md': '| ID | Type | What | Backing | Worlds | Hooks | Limits | Status | Source |\n|---|---|---|---|---|---|---|---|---|\n| CTC3 | Foresight | x | y | z | h | l | built | s |\n',
};
const SRC = [
    {file: 'src/deeds_ui.js', text: "definePanel({id: 'deeds', title: 'Deeds', role: 'records'});"},
    {file: 'src/panel_kit.js', text: 'export function definePanel(spec) {}\n// definePanel({id: "nope"})'},
    {file: 'src/two_panels.js', text: "definePanel({id:'life-events',title:'Family'}); definePanel(spec.dynamic);"},
];
const run = (extra = {}) => assembleIdeas({read: p => DOCS[p] ?? null, files: Object.keys(DOCS).sort(), srcFiles: SRC, exists: p => SRC.some(f => f.file === p),
    worlds: [{id: 'lotm', name: 'Lord of the Mysteries'}], ledgerNames: ['gu_moves'], ledgerIds: n => n === 'gu_moves' ? new Set(['row-1']) : null, ...extra});
const byId = d => Object.fromEntries(d.rows.map(r => [r.id, r]));

test('code helpers: prefix, base, board slug, status words', () => {
    assert.equal(prefixOf('MKC40a'), 'MKC'); assert.equal(prefixOf('PS-AR1'), 'PS-AR'); assert.equal(baseOf('MKC40a'), 'MKC40'); assert.equal(baseOf('AB1.2'), 'AB1');
    assert.equal(boardSlug('docs/research/WORLD_ATLAS_IDEABOARD_2026-11-22.md'), 'world-atlas-ideaboard-2026-11-22');
    assert.equal(statusWord('Proposals under AD32'), 'proposal'); assert.equal(statusWord('Built 2026-11-01'), 'built'); assert.equal(statusWord('Mixed: Accepted A'), null);
    assert.equal(statedStatus(' · Stated (built). text'), 'built');
    assert.equal(statedStatus(' · [accepted decisions](x.md) is a label'), null);
    assert.equal(statedStatus(' status: sent'), 'sent');
    assert.equal(statedStatus(' · a long title that goes past the span limit of ninety characters so the later word does not count (built)'), null);
});

test('scanIdeas reads every format and keeps residue for lines it cannot read', () => {
    const t = scanIdeas(TABLE), b = scanIdeas(BOLD), l = scanIdeas(LIST);
    assert.deepEqual(t.items.map(i => [i.code, i.format]), [['TB1', 'table'], ['TB2', 'table'], ['TB3', 'table']]);
    assert.equal(t.items[1].title, 'Second idea'); assert.equal(t.items[0].statusCell, 'Built 2026-11-01'); assert.deepEqual(t.items[2].aliases, ['TB9']);
    assert.equal(t.residue.length, 1); assert.equal(t.residue[0].reason, 'table-cell-not-single-code'); assert.equal(t.residue[0].line, 10);
    assert.deepEqual(b.items.map(i => i.code), ['BD1', 'BD2', 'BD3', 'BD4', 'BD4a', 'BD5']);
    assert.equal(b.items[0].title, 'Dotted title'); assert.equal(b.items[1].title, 'Title without separator'); assert.equal(b.items[2].title, 'A bare-code lead then text that becomes the title');
    assert.match(b.items[0].text, /Continuation line/); // body runs to the blank line
    assert.deepEqual(l.items.map(i => [i.code, i.format]), [['LB1', 'list'], ['LB2', 'list'], ['LB3', 'bold'], ['LB7', 'heading'], ['LB8', 'heading'], ['LB9', 'plain']]);
    assert.equal(l.items[1].parentLine, l.items[0].line); // nested list item
    assert.ok(l.residue.some(r => r.reason === 'code-range-or-list' && /LB4 and LB5/.test(r.text)), 'a code list is residue, not an idea');
    assert.ok(l.residue.some(r => /LB6/.test(r.text)), 'a possessive mention is residue');
    assert.ok(l.residue.some(r => /LB10/.test(r.text) && r.reason === 'plain-paragraph-code'), 'a paragraph that leads with a code and has no separator is residue');
    assert.equal(scanIdeas('```\n**FX1 · fenced.** x\n```\n').items.length, 0);
});

test('assemble: boards, composite ids, collisions across boards, discovery rules', () => {
    const d = run(), rows = byId(d);
    const slugs = d.boards.map(b => b.slug).sort();
    assert.ok(slugs.includes('atlas-ideaboard') && slugs.includes('bold-board') && slugs.includes('table-board') && slugs.includes('list-board') && slugs.includes('other'));
    assert.ok(!slugs.includes('hidden'), 'private/ is skipped'); assert.ok(!slugs.includes('idea-registry-sweep-2026-11-24'), 'the sweep report is not a board');
    assert.ok(!slugs.includes('small') && d.stats.unboarded >= 1, 'fewer than three items and not linked: not a board');
    assert.ok(rows['bold-board#BD1'] && rows['other#BD1'], 'the same code on two boards gets two composite ids');
    const bd = d.families.find(f => f.prefix === 'BD'); assert.ok(bd.flags.includes('code-collision')); assert.deepEqual(bd.collidingCodes.map(c => c.code), ['BD1', 'BD2']);
    assert.equal(d.boards.find(b => b.slug === 'table-board').tier, 'registered'); assert.equal(d.boards.find(b => b.slug === 'other').tier, 'found');
    assert.deepEqual(d.boards.find(b => b.slug === 'atlas-ideaboard').registers, ['WRITEUP_REGISTER']);
});

test('a linked doc with one item is a board; family registry flags local prefixes instead of collisions', () => {
    const docs = {...DOCS, 'docs/IDEA_INDEX.md': IDEA_INDEX + '[Small](research/SMALL.md)\n'};
    const d = run({read: p => docs[p] ?? null});
    assert.ok(d.boards.some(b => b.slug === 'small'));
    assert.deepEqual(d.families.find(f => f.prefix === 'LB').flags, []);
    const f1 = assembleIdeas({read: p => ({'docs/a.md': '**F1 · a.** x\n**F2 · b.** x\n**F3 · c.** x\n', 'docs/b.md': '**F1 · d.** x\n**F2 · e.** x\n**F3 · f.** x\n'})[p] ?? null, files: ['docs/a.md', 'docs/b.md']});
    const fam = f1.families.find(f => f.prefix === 'F');
    assert.equal(fam.local, true); assert.deepEqual(fam.flags, ['local']); assert.deepEqual(fam.collidingCodes, []); assert.ok(f1.rows.every(r => r.local));
    assert.equal(summarize(f1).counts.collisions.codes, 0);
});

test('idea versus rule: a rulebook code is not an idea row, and the family says both', () => {
    const d = run(), rows = byId(d);
    assert.ok(!Object.keys(rows).some(k => k.startsWith('world-absorption-rules#')), 'rule items do not become idea rows');
    const rb = d.boards.find(b => b.slug === 'world-absorption-rules'); assert.equal(rb.kind, 'rulebook'); assert.equal(rb.rules, 3); assert.equal(rb.ideas, 0);
    const wa = d.families.find(f => f.prefix === 'WA'); assert.equal(wa.kind, 'mixed'); assert.ok(wa.flags.includes('idea-vs-rule'));
    assert.deepEqual(wa.boards.map(b => [b.board, b.kind]).sort(), [['atlas-ideaboard', 'idea'], ['world-absorption-rules', 'rule']]);
    assert.deepEqual([...parseRuleRegister(REGISTER).prefixes.keys()], ['WA']); assert.ok(parseRuleRegister(REGISTER).reserved.has('UR'));
    assert.deepEqual([...linkedDocs(IDEA_INDEX, 'docs/IDEA_INDEX.md')].sort(), ['docs/research/BOLD_BOARD.md', 'docs/research/TABLE_BOARD.md']);
    // A bare WA code inside the idea board means the board's own idea; one it does not define links to the rule.
    const wa2 = rows['atlas-ideaboard#WA2'];
    assert.deepEqual(wa2.links.ideas.map(l => l.ids[0]), ['atlas-ideaboard#WA1']); // same-board restatement (known limit, below)
    assert.deepEqual(wa2.links.rules.map(r => [r.code, r.line != null]), [['WA70', true]]);
});

test('the same code twice inside one board: both flagged, the later one gets ~2 (known limit: links hit the first)', () => {
    const rows = byId(run());
    assert.ok(rows['atlas-ideaboard#WA1'] && rows['atlas-ideaboard#WA1~2']);
    assert.equal(rows['atlas-ideaboard#WA1'].dupInBoard, true); assert.equal(rows['atlas-ideaboard#WA1~2'].dupInBoard, true);
    assert.equal(rows['atlas-ideaboard#WA1'].title, 'A world wears its book'); assert.equal(rows['atlas-ideaboard#WA1~2'].title, 'Theme table per world');
    assert.equal(rows['atlas-ideaboard#WA2'].links.ideas[0].ids[0], 'atlas-ideaboard#WA1', 'a same-board link resolves to the first WA1, which here is the restatement');
    assert.equal(rows['atlas-ideaboard#WA1'].round, 'Recommended first five'); assert.equal(rows['atlas-ideaboard#WA1~2'].round, 'Flavour');
});

test('parents and children: suffix code, nested list, coded heading, round', () => {
    const rows = byId(run());
    assert.deepEqual(rows['bold-board#BD4a'].parent, {kind: 'idea', id: 'bold-board#BD4'}); assert.deepEqual(rows['bold-board#BD4'].children, ['bold-board#BD4a']);
    assert.deepEqual(rows['list-board#LB2'].parent, {kind: 'idea', id: 'list-board#LB1'}); assert.deepEqual(rows['list-board#LB1'].children, ['list-board#LB2']);
    assert.deepEqual(rows['list-board#LB8'].parent, {kind: 'idea', id: 'list-board#LB7'}, 'a coded subheading hangs under the coded heading');
    assert.deepEqual(rows['list-board#LB9'].parent, {kind: 'idea', id: 'list-board#LB8'});
    assert.equal(rows['bold-board#BD1'].parent.kind, 'round'); assert.equal(rows['bold-board#BD1'].parent.name, 'Round 6 (BD1–BD5)'); assert.equal(rows['bold-board#BD1'].round, 'Round 6 (BD1–BD5)');
    assert.equal(rows['list-board#LB1'].parent.name, 'Round 2');
});

test('status is only what the board states; nothing stated reads proposal (AD32); built is never inferred from prose', () => {
    const rows = byId(run());
    assert.equal(rows['table-board#TB1'].status, 'built'); assert.equal(rows['table-board#TB1'].statusSource, 'stated'); assert.equal(rows['table-board#TB1'].statusLabel, 'built');
    assert.equal(rows['table-board#TB2'].status, 'proposal'); assert.equal(rows['table-board#TB3'].statusSource, 'default'); assert.equal(rows['table-board#TB3'].statusLabel, DEFAULT_STATUS);
    assert.equal(rows['bold-board#BD4'].status, 'built'); assert.equal(rows['bold-board#BD4'].statusSource, 'stated');
    assert.equal(rows['bold-board#BD1'].status, 'proposal'); assert.equal(rows['bold-board#BD1'].statusSource, 'default');
    assert.equal(rows['bold-board#BD5'].statusSource, 'default', 'a link label or a later parenthesis does not state a status');
    assert.equal(rows['atlas-ideaboard#WA3'].status, 'built'); assert.equal(rows['atlas-ideaboard#WA3'].statusSource, 'heading');
    assert.match(rows['bold-board#BD1'].nextAction.text, /AD32/); assert.equal(rows['bold-board#BD1'].nextAction.kind, 'adopt'); assert.equal(rows['bold-board#BD1'].nextAction.owner, 'docs/research/BOLD_BOARD.md');
    assert.equal(rows['bold-board#BD4'].nextAction.kind, 'route'); assert.equal(rows['bold-board#BD4'].nextAction.register, 'docs/IDEA_INDEX.md');
});

test('links: ideas (same board, other board, doc-qualified), rules, worlds, ledger rows, cheats, src files, panels', () => {
    const d = run(), rows = byId(d), L = rows['bold-board#BD1'].links;
    assert.deepEqual(L.ideas.map(i => [i.code, i.ids, i.ambiguous]), [['TB1', ['table-board#TB1'], false]]);
    assert.deepEqual(L.rules.map(r => [r.code, r.file]), [['WA2', 'docs/WORLD_ABSORPTION_RULES.md']]);
    assert.deepEqual(L.worlds, []); // "lotm" is a bare id without a hyphen: not matched; the display name is not in the text
    assert.deepEqual(L.ledgers, ['gu_moves:row-1']); assert.deepEqual(L.src, ['src/deeds_ui.js']);
    assert.deepEqual(L.panels, ['panel#deeds']);
    assert.deepEqual(rows['table-board#TB1'].links.cheats, ['CTC3']);
    const named = run({read: p => ({...DOCS, 'docs/research/BOLD_BOARD.md': BOLD.replace('the lotm world', 'Lord of the Mysteries').replace('Continuation line.', 'See table-board#TB2.')})[p] ?? null});
    assert.deepEqual(byId(named)['bold-board#BD1'].links.worlds, ['lotm']);
    assert.ok(byId(named)['bold-board#BD1'].links.ideas.some(i => i.ids[0] === 'table-board#TB2'), 'a doc-qualified `stem#CODE` resolves to that board');
    // A multi-board code resolves to every candidate and says so; a single-letter code never resolves across boards.
    const two = assembleIdeas({read: p => ({'docs/a.md': '**AA1 · x.** AA2 BB2\n**AA2 · y.** z\n**AA3 · z.** z\n', 'docs/b.md': '**BB1 · x.** m\n**BB2 · y.** m\n**BB3 · z.** m\n', 'docs/c.md': '**BB2 · y.** m\n**CC1 · y.** m\n**CC2 · y.** m\n', 'docs/d.md': '**F1 · y.** F5 AA1\n**F2 · y.** m\n**F3 · y.** m\n', 'docs/e.md': '**F5 · y.** m\n**F6 · y.** m\n**F7 · y.** m\n'})[p] ?? null, files: ['docs/a.md', 'docs/b.md', 'docs/c.md', 'docs/d.md', 'docs/e.md']});
    const bb = two.rows.find(r => r.id === 'a#AA1').links.ideas.find(i => i.code === 'BB2'); assert.equal(bb.ambiguous, true); assert.deepEqual(bb.ids.sort(), ['b#BB2', 'c#BB2']);
    const f = two.rows.find(r => r.id === 'd#F1').links.ideas; assert.deepEqual(f.map(i => i.code), ['AA1'], 'F5 is local to another doc and stays unresolved');
});

test('panels: definePanel homes as rows, panel_kit skipped, mentionedBy filled, computed ids kept apart', () => {
    assert.deepEqual(scanPanels('src/panel_kit.js', SRC[1].text), []);
    const homes = scanPanels('src/two_panels.js', SRC[2].text);
    assert.deepEqual(homes.map(h => [h.id, h.title, h.line]), [['life-events', 'Family', 1], [null, null, 1]]);
    const d = run(); assert.deepEqual(d.panels.map(p => p.id), ['panel#deeds', 'panel#life-events', 'panel#two_panels:1']);
    assert.equal(d.panels[0].kind, 'panel'); assert.equal(d.panels[0].locator.file, 'src/deeds_ui.js'); assert.deepEqual(d.panels[0].mentionedBy, ['bold-board#BD1']); assert.equal(d.panels[2].computedId, true);
    assert.equal(pageIdeas(d, {kind: 'panel'}).total, 3); assert.equal(pageIdeas(d, {kind: 'all'}).total, d.rows.length + 3);
});

test('rows route: paging cap, filters, links= with an id that contains #', () => {
    const d = run();
    assert.equal(pageIdeas(d, {limit: 9999}).limit, MAX_PAGE); assert.equal(pageIdeas(d, {limit: 2, offset: 1}).rows.length, 2);
    assert.deepEqual(pageIdeas(d, {board: 'table-board'}).rows.map(r => r.code), ['TB1', 'TB2', 'TB3']);
    assert.deepEqual(pageIdeas(d, {family: 'LB'}).rows.map(r => r.code), ['LB1', 'LB2', 'LB3', 'LB7', 'LB8', 'LB9']);
    assert.deepEqual(pageIdeas(d, {status: 'built'}).rows.map(r => r.id).sort(), ['atlas-ideaboard#WA3', 'bold-board#BD4', 'table-board#TB1']);
    assert.deepEqual(pageIdeas(d, {q: 'GLYPHS'}).rows.map(r => r.id), ['atlas-ideaboard#WA2']);
    assert.deepEqual(pageIdeas(d, {links: 'table-board#TB1'}).rows.map(r => r.id), ['bold-board#BD1'], 'links= takes a composite id, # included');
    assert.deepEqual(pageIdeas(d, {links: 'CTC3'}).rows.map(r => r.id), ['table-board#TB1']);
    assert.deepEqual(pageIdeas(d, {links: 'gu_moves:row-1'}).rows.map(r => r.id), ['bold-board#BD1']);
    assert.deepEqual(pageIdeas(d, {links: 'panel#deeds'}).rows.map(r => r.id), ['bold-board#BD1']);
    assert.equal(pageIdeas(d, {links: 'WA2'}).rows.some(r => r.id === 'bold-board#BD1'), true);
    assert.equal(pageIdeas(d, {local: 'only'}).total, 0);
    const detail = rowDetail(d, 'table-board#TB1'); assert.deepEqual(detail.linkedFrom.map(r => r.id), ['bold-board#BD1']); assert.equal(detail.row.id, 'table-board#TB1');
    assert.deepEqual(rowDetail(d, 'bold-board#BD4a').parent, {id: 'bold-board#BD4', code: 'BD4', title: 'Stated (built)', board: 'bold-board', status: 'built'});
    assert.equal(rowDetail(d, 'nope#X1'), null);
});

test('summary, families, boards, residue projections', () => {
    const d = run(), s = summarize(d, {hash: 'h', files: 1});
    assert.equal(s.counts.ideas, d.rows.length); assert.equal(s.counts.panels, 3); assert.equal(s.counts.registeredBoards, 3); assert.equal(s.builtFrom.hash, 'h');
    assert.ok(s.counts.collisions.ideaVsRule >= 1 && s.counts.collisions.codes >= 2 && s.counts.collisions.dupInBoard >= 2);
    assert.ok(s.collisions.some(c => c.prefix === 'WA') && !s.collisions.some(c => c.local));
    assert.equal(s.counts.residueLines, d.boards.reduce((n, b) => n + b.residue.length, 0)); assert.ok(s.residue.length >= 2);
    assert.equal(familiesOf(d).total, d.families.length);
    assert.equal(pageBoards(d, {tier: 'registered'}).total, 3); assert.ok(pageBoards(d, {q: 'bold'}).boards[0].rounds.length >= 1);
    const res = residueOf(d, 'list-board'); assert.ok(res.lines.length >= 3 && res.lines[0].line > 0); assert.equal(residueOf(d, 'nope'), null);
    assert.ok(!JSON.stringify(s).includes('_text'), 'row text stays out of the summary');
});

test('readIdeas walks a real folder: private/ and novels skipped, panels read from src/', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ideas-'));
    try {
        for (const [p, t] of [['docs/A.md', '**AA1 · a.** x\n**AA2 · b.** x\n**AA3 · c.** x\n'], ['docs/private/B.md', '**BB1 · a.** x\n**BB2 · b.** x\n**BB3 · c.** x\n'], ['docs/research/novels/C.md', '**CC1 · a.** x\n**CC2 · b.** x\n**CC3 · c.** x\n'], ['src/p.js', "definePanel({id:'p-one',title:'P'})"]]) {
            mkdirSync(join(dir, p, '..'), {recursive: true}); writeFileSync(join(dir, p), t);
        }
        const d = readIdeas(dir);
        assert.deepEqual(d.rows.map(r => r.id), ['a#AA1', 'a#AA2', 'a#AA3']); assert.deepEqual(d.panels.map(p => p.id), ['panel#p-one']); assert.equal(typeof d.hash, 'string');
    } finally {rmSync(dir, {recursive: true, force: true});}
});
