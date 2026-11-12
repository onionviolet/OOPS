#!/usr/bin/env node
// Coverage ledgers (plan CV1-CV4, PFP25; tooling by chat P for MS1).
//   node scripts/coverage_report.mjs           rewrite docs/coverage/README.md
//   node scripts/coverage_report.mjs --check   validate rows only; exit 1 on malformed rows
// A ledger is docs/coverage/<corpus>.jsonl, one JSON object per line:
//   {"id": "...", "source": "...", "state": "...", "mechanisms": ["G", ...], "test": "tests/x.test.js" | null, "note": "..."}
// Coverage percent is a report, never a gate (CV4): only malformed rows and the three case
// checks below fail (PC10): a typed state that disagrees with the computed one, a case module that
// is missing or lacks `coverageCase`, and a case that throws.
//
// Cases (PC5, PC9, PC10, PC51 P1.1). A row may carry `"case": {"module": "<repo-relative js>", "id": "<case id>"}`.
// The module exports `coverageCase(id)`, returning plain data:
//   {basis?: 'canon'|'authored',            // else taken from the typed state, else 'authored'
//    world: {clock?, holders: [...], lawFields?},   // createWorld input; W's default vocabulary pack
//    sentence: {verb, object, target?, time?, carrier?, cost?, limits?},   // run through applySentence
//    working?: {...},                       // TODO: needs the effect host (another lane); computes blocked:runner-working-case
//    details?: {target, amount, minutes, place, ...},  keys?: {light: 'moon', ...},  by?: string,
//    expect: [{holder, quantity | property | position: true, direction, amount?, to?}]}
// `expect` is in world terms only. direction is up|down|changed|unchanged for a quantity and
// changed|unchanged for a property or position. `amount` is the exact size of a quantity change;
// `to` is the final value of a property or place. Unknown keys are rejected, so a verb or object
// word cannot stand in for an outcome, and at least one entry must expect a change.
// Computed states: expressed-<basis> when the world changed as `expect` says; runs-<basis> when the
// case module is also reachable from src/main.js (scripts/reachable.mjs). A case under tests/ is never reachable.
// Otherwise blocked:runner-expect-mismatch, blocked:runner-needs (the sentence needs a world key) or
// blocked:runner-working-case.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {reachableFrom, walkFrom, srcFiles} from './reachable.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const COVERAGE_DIR = 'docs/coverage';
// CV3 denominators, for the expected column. A ledger not listed still reports.
export const DENOMINATORS = {
    gu_kinds: {expected: 1466, owner: 'G', what: 'Gu kinds, held review index records'},
    gu_moves: {expected: 776, owner: 'G', what: 'killer moves: 23 records plus 753 leads'},
    hp_potions: {expected: 316, owner: 'B', what: 'potion-related catalogue entries'},
    hp_ingredients: {expected: 409, owner: 'B', what: 'ingredient-related catalogue entries'},
    lotm_potions: {expected: null, owner: 'B', what: 'pathway sequence and named potions, built first'},
    hp_spells: {expected: 117, owner: 'S', what: 'spellbook records'},
    creatures: {expected: null, owner: 'L', what: "G's catalogue plus L's inventory"},
};
const STATE = /^(runs-canon|runs-authored|expressed-canon|expressed-authored|catalogued|unclassified|blocked:[a-z0-9][\w.:-]*|not-a-thing:[a-z0-9][\w.:-]*)$/i;
const FIELDS = new Set(['id', 'source', 'state', 'mechanisms', 'test', 'note', 'case']);

// Validate one ledger's text. Returns {rows, problems}; a problem names its line.
export function parseLedger(text, {name = 'ledger', exists = file => fs.existsSync(path.join(root, file))} = {}) {
    const rows = [], problems = [], ids = new Set();
    text.split('\n').forEach((line, i) => {
        if (!line.trim()) return;
        const at = `${name}:${i + 1}`;
        let row;
        try { row = JSON.parse(line); } catch { problems.push(`${at}: not JSON`); return; }
        if (!row || typeof row !== 'object' || Array.isArray(row)) { problems.push(`${at}: not an object`); return; }
        for (const k of Object.keys(row)) if (!FIELDS.has(k)) problems.push(`${at}: unknown field ${k}`);
        if (typeof row.id !== 'string' || !row.id) problems.push(`${at}: id must be a nonempty string`);
        else if (ids.has(row.id)) problems.push(`${at}: duplicate id ${row.id}`);
        else ids.add(row.id);
        if (typeof row.source !== 'string' || !row.source) problems.push(`${at}: source must be a nonempty locator`);
        if (typeof row.state !== 'string' || !STATE.test(row.state)) problems.push(`${at}: state must be runs-canon, runs-authored, expressed-canon, expressed-authored, catalogued, blocked:<rule>, not-a-thing:<reason> or unclassified`);
        if (!Array.isArray(row.mechanisms) || row.mechanisms.some(m => typeof m !== 'string' || !m)) problems.push(`${at}: mechanisms must be an array of owner names`);
        if (row.test !== undefined && row.test !== null && typeof row.test !== 'string') problems.push(`${at}: test must be a string or null`);
        if (/^runs-/.test(row.state ?? '')) {
            const file = typeof row.test === 'string' ? row.test.split('#')[0] : '';
            if (!file) problems.push(`${at}: a runs-* row names the test that runs it`);
            else if (!exists(file)) problems.push(`${at}: test file ${file} does not exist`);
        }
        if (row.case !== undefined) {
            const k = row.case;
            if (!k || typeof k !== 'object' || Array.isArray(k) || typeof k.module !== 'string' || !k.module || typeof k.id !== 'string' || !k.id
                || Object.keys(k).some(x => x !== 'module' && x !== 'id')) problems.push(`${at}: case must be {"module": "<repo path>", "id": "<case id>"}`);
        }
        if (/^expressed-/.test(row.state ?? '') && row.case === undefined) problems.push(`${at}: an expressed-* row names its case; the runner computes expressed`);
        if (row.note !== undefined && typeof row.note !== 'string') problems.push(`${at}: note must be a string`);
        rows.push(row);
    });
    return {rows, problems};
}

// Counts per ledger: states, the runs share (runs over things, excluding not-a-thing) and top blocking rules.
export function countLedger(rows) {
    const c = {total: rows.length, 'runs-canon': 0, 'runs-authored': 0, blocked: 0, 'not-a-thing': 0, unclassified: 0, catalogued: 0, 'expressed-canon': 0, 'expressed-authored': 0, rules: {}};
    for (const r of rows) {
        const [head, detail] = [r.state.split(':')[0], r.state.split(':').slice(1).join(':')];
        if (head in c) c[head]++;
        if (head === 'blocked') c.rules[detail] = (c.rules[detail] ?? 0) + 1;
    }
    const things = c.total - c['not-a-thing'];
    c.runsShare = things ? Math.round((c['runs-canon'] + c['runs-authored']) / things * 1000) / 10 : 0;
    c.classifiedShare = c.total ? Math.round((c.total - c.unclassified) / c.total * 1000) / 10 : 0;
    return c;
}

// ---- The generic case runner (PC9, PC10) ----
const DIRECTIONS = {quantity: ['up', 'down', 'changed', 'unchanged'], property: ['changed', 'unchanged'], position: ['changed', 'unchanged']};
const EXPECT_KEYS = new Set(['holder', 'quantity', 'property', 'position', 'direction', 'amount', 'to']);

function checkExpect(world, expect, id) {
    const bad = m => { throw new Error(`case ${id}: ${m}`); };
    if (!Array.isArray(expect) || !expect.length) bad('expect must be a nonempty array of world outcomes');
    for (const e of expect) {
        if (!e || typeof e !== 'object') bad('an expect entry must be an object');
        for (const k of Object.keys(e)) if (!EXPECT_KEYS.has(k)) bad(`expect key ${k} is not a world term`);
        if (!(world.holders ?? []).some(h => h.id === e.holder)) bad(`expect names holder ${e.holder}, which the case world does not define`);
        const kinds = ['quantity', 'property', 'position'].filter(k => e[k] !== undefined);
        if (kinds.length !== 1) bad('an expect entry names exactly one of quantity, property or position');
        if (!DIRECTIONS[kinds[0]].includes(e.direction)) bad(`direction for a ${kinds[0]} is one of ${DIRECTIONS[kinds[0]].join(', ')}`);
    }
    if (!expect.some(e => e.direction !== 'unchanged')) bad('expect must name at least one change');
}

const readTerm = (world, e) => {
    const h = world.holders[e.holder];
    if (e.quantity !== undefined) return h?.quantities?.[e.quantity] ?? 0;
    if (e.property !== undefined) return h?.properties?.[e.property] ?? null;
    return h?.place ?? null;
};

// Does the world, before to after, change as `expect` says?
export function expectHolds(before, after, expect) {
    return expect.every(e => {
        const a = readTerm(before, e), b = readTerm(after, e);
        const same = JSON.stringify(a) === JSON.stringify(b);
        if (e.direction === 'unchanged') return same;
        if (same) return false;
        if (e.direction === 'up' && !(b > a)) return false;
        if (e.direction === 'down' && !(b < a)) return false;
        if (e.amount !== undefined && Math.abs(b - a) !== e.amount) return false;
        if (e.to !== undefined && JSON.stringify(b) !== JSON.stringify(e.to)) return false;
        return true;
    });
}

/** Run one case's plain data. Returns {state, detail}; hard failures throw. */
export async function runCaseData(data, {id = 'case', typedState = '', moduleReachable = false} = {}) {
    if (!data || typeof data !== 'object') throw new Error(`case ${id}: coverageCase must return an object`);
    const suffix = data.basis ?? (/-(canon|authored)$/.exec(typedState)?.[1]) ?? 'authored';
    if (data.working !== undefined) {
        // TODO (another lane's packet): run a K working through the effect host, then compare as below.
        return {state: 'blocked:runner-working-case', detail: 'working cases wait for the effect host'};
    }
    if (!data.sentence || typeof data.sentence !== 'object') throw new Error(`case ${id}: a case carries a sentence or a working`);
    const {composeSubstrate, createWorld} = await import('../src/world_substrate.js');
    const {WORLD_QUANTITIES, WORLD_PROPERTIES} = await import('../src/world_quantities.js');
    const {applySentence} = await import('../src/effect_grammar.js');
    const rules = composeSubstrate({packs: [{id: 'w.vocabulary', quantities: Object.values(WORLD_QUANTITIES), properties: Object.values(WORLD_PROPERTIES)}]});
    const spec = data.world ?? {};
    checkExpect(spec, data.expect, id);
    const before = createWorld(rules, spec);
    const run = applySentence(rules, before, data.sentence, data.details ?? {}, {keys: data.keys ?? {}, cause: data.cause ?? `coverage:${id}`, by: data.by});
    if (run.needs.length) return {state: 'blocked:runner-needs', detail: `needs ${run.needs.join(', ')}`};
    if (!expectHolds(before, run.world, data.expect)) return {state: 'blocked:runner-expect-mismatch', detail: 'the world did not change as expect says'};
    return {state: `${moduleReachable ? 'runs' : 'expressed'}-${suffix}`, detail: moduleReachable ? 'case module reachable from src/main.js' : 'case module is library or test only'};
}

/** Load a row's case module and run it. Throws on a missing module, a missing export or a throwing case. */
export async function runCase(row, {reachable = null, rootDir = root} = {}) {
    const {module: mod, id} = row.case;
    const file = path.resolve(rootDir, mod);
    if (!fs.existsSync(file)) throw new Error(`case module ${mod} does not exist`);
    let m;
    try { m = await import(pathToFileURL(file).href); } catch (e) { throw new Error(`case module ${mod} failed to load: ${e.message}`); }
    if (typeof m.coverageCase !== 'function') throw new Error(`case module ${mod} does not export coverageCase`);
    let out;
    try {
        out = await runCaseData(m.coverageCase(id), {id, typedState: row.state, moduleReachable: (reachable ?? reachableFrom()).has(file)});
    } catch (e) { throw new Error(`case ${mod}#${id} threw: ${e.message}`); }
    return out;
}

/** Compute every case row of every ledger. Returns {computed: Map ledger -> Map row id -> {state, detail}, problems}. */
export async function computeLedgers(ledgers, {reachable = null, rootDir = root} = {}) {
    const computed = new Map(), problems = [];
    let reach = reachable;
    for (const l of ledgers) {
        const rows = new Map();
        computed.set(l.name, rows);
        for (const [i, row] of l.rows.entries()) {
            if (!row.case || typeof row.case !== 'object' || typeof row.case.module !== 'string') continue;
            reach ??= reachableFrom();
            const at = `${l.file ?? l.name}:${row.id ?? i + 1}`;
            try {
                const out = await runCase(row, {reachable: reach, rootDir});
                rows.set(row.id, out);
                if (out.state !== row.state) problems.push(`${at}: typed state ${row.state} disagrees with computed ${out.state} (${out.detail})`);
            } catch (e) { problems.push(`${at}: ${e.message}`); }
        }
    }
    return {computed, problems};
}

// Per ledger: typed runs, computed expressed (expressed or runs), computed runs, typed runs-* rows with no case.
export function computedCounts(rows, computed = new Map()) {
    let typedRuns = 0, expressed = 0, runs = 0, noCase = 0;
    for (const r of rows) {
        if (/^runs-/.test(r.state)) { typedRuns++; if (!r.case) noCase++; }
        const c = computed.get(r.id);
        if (c && /^(expressed|runs)-/.test(c.state)) expressed++;
        if (c && /^runs-/.test(c.state)) runs++;
    }
    return {typedRuns, expressed, runs, noCase};
}

export function readLedgers(dir = path.join(root, COVERAGE_DIR)) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort().map(f => {
        const name = f.replace(/\.jsonl$/, '');
        return {name, file: `${COVERAGE_DIR}/${f}`, ...parseLedger(fs.readFileSync(path.join(dir, f), 'utf8'), {name: f})};
    });
}

export function renderReadme(ledgers, {computed = new Map(), reach = null} = {}) {
    const lines = ['# Coverage ledgers', '',
        '*Generated by `node scripts/coverage_report.mjs`; do not edit by hand. Format and states: [plan CV1-CV4](../PROCEDURAL_FOUNDATION_PLAN.md#coverage-ledgers-cv). Each corpus owner writes its own `<corpus>.jsonl`. `npm run check:coverage` fails only on malformed rows; the percentages are a report, not a gate.*', '',
        '## Counts', '',
        '| Ledger | Owner | Expected | Rows | runs-canon | runs-authored | blocked | not-a-thing | unclassified | Classified | Runs share |',
        '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'];
    const names = [...new Set([...Object.keys(DENOMINATORS), ...ledgers.map(l => l.name)])];
    for (const name of names) {
        const l = ledgers.find(x => x.name === name), d = DENOMINATORS[name] ?? {};
        if (!l) { lines.push(`| ${name} | ${d.owner ?? ''} | ${d.expected ?? 'to build'} | not started | | | | | | | |`); continue; }
        const c = countLedger(l.rows);
        lines.push(`| [${name}](${name}.jsonl) | ${d.owner ?? ''} | ${d.expected ?? 'to build'} | ${c.total} | ${c['runs-canon']} | ${c['runs-authored']} | ${c.blocked} | ${c['not-a-thing']} | ${c.unclassified} | ${c.classifiedShare}% | ${c.runsShare}% |`);
    }
    lines.push('', '## Typed and computed, side by side (PC9, PC10)', '',
        '*Typed states are the owners\' hand-typed values and are unchanged. Computed states come from the generic case runner (`case` field) and count only rows that carry a case. "Computed expressed" counts rows whose world changed as `expect` says, including those that run; "computed runs" are the part whose case module is reachable from `src/main.js`. "Typed runs, no case" counts `runs-*` rows that nothing computed. Whether headline numbers may fall is Weibao\'s call, so nothing is rewritten.*', '',
        '| Ledger | Typed runs | Computed expressed | Computed runs | Typed runs, no case |', '| --- | ---: | ---: | ---: | ---: |');
    for (const l of ledgers) {
        const k = computedCounts(l.rows, computed.get(l.name));
        lines.push(`| ${l.name} | ${k.typedRuns} | ${k.expressed} | ${k.runs} | ${k.noCase} |`);
    }
    if (reach) {
        lines.push('', '## Reachability from `src/main.js` (PC14)', '', `\`node scripts/reachable.mjs\`: ${reach.reachable} of ${reach.total} src files reachable. Imports with a computed path cannot be followed, so any pack loaded through one is a gap in this number, not a verdict:`, '');
        lines.push(...(reach.computedImports.length ? reach.computedImports.map(c => `- \`${c.file}\`: \`\` ${c.snippet} \`\``) : ['- none']));
    }
    const blocked = ledgers.flatMap(l => Object.entries(countLedger(l.rows).rules).map(([rule, n]) => ({ledger: l.name, rule, n})))
        .sort((a, b) => b.n - a.n || a.rule.localeCompare(b.rule));
    lines.push('', '## Blocking rules', '', blocked.length ? '| Ledger | Missing rule | Rows |' : 'None yet.');
    if (blocked.length) lines.push('| --- | --- | ---: |', ...blocked.map(b => `| ${b.ledger} | ${b.rule} | ${b.n} |`));
    lines.push('', '## Row format', '', '```json',
        '{"id": "stealth-scales", "source": "gu-identity-evidence.json#stealth-scales; ch. 127", "state": "runs-canon", "mechanisms": ["G", "L"], "test": "tests/gu_catalogue.test.js", "note": ""}',
        '```', '',
        '- `state`: `runs-canon`, `runs-authored`, `blocked:<rule>`, `not-a-thing:<reason>` or `unclassified` (CV2). Rules and reasons are short slugs, such as `blocked:PGB2` or `not-a-thing:alias`.',
        '- A `runs-*` row names an existing test file in `test` (optionally `#test name`).',
        '- `catalogued` is a typed state for identity parts with a source and no executed effect. `expressed-*` is computed by the runner; a row carrying `case` is the one place it is typed, because the runner checks it there.',
        '- `case`: optional `{"module": "<repo-relative js>", "id": "<case id>"}`; the module exports `coverageCase(id)` (shape in the header of `scripts/coverage_report.mjs`). `check:coverage` fails when a typed state disagrees with the computed one, a case module is missing or lacks the export, or a case throws.',
        '- `mechanisms`: the owners the thing appears on (SC4), by chat letter or owner name.', '');
    return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2);
    const dirAt = argv.indexOf('--dir');
    const ledgers = dirAt >= 0 ? readLedgers(path.resolve(argv[dirAt + 1])) : readLedgers();
    const walk = walkFrom();
    const {computed, problems: caseProblems} = await computeLedgers(ledgers, {reachable: walk.reachable});
    const problems = [...ledgers.flatMap(l => l.problems), ...caseProblems];
    for (const l of ledgers) {
        const c = countLedger(l.rows), k = computedCounts(l.rows, computed.get(l.name));
        console.log(`${l.name}: ${c.total} rows, ${c.unclassified} unclassified, runs ${c.runsShare}%; computed expressed ${k.expressed}, runs ${k.runs}, typed runs without case ${k.noCase}`);
    }
    if (problems.length) { console.error(problems.join('\n')); console.error(`FAIL: ${problems.length} problems`); process.exit(1); }
    if (!argv.includes('--check')) {
        const files = srcFiles();
        const reach = {reachable: files.filter(f => walk.reachable.has(f)).length, total: files.length,
            computedImports: walk.computedImports.map(c => ({file: path.relative(root, c.file), snippet: c.snippet}))};
        fs.mkdirSync(path.join(root, COVERAGE_DIR), {recursive: true});
        fs.writeFileSync(path.join(root, COVERAGE_DIR, 'README.md'), renderReadme(ledgers, {computed, reach}));
        console.log(`wrote ${COVERAGE_DIR}/README.md (${ledgers.length} ledgers)`);
    } else console.log(`coverage rows: PASS (${ledgers.length} ledgers)`);
}
