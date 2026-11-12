#!/usr/bin/env node
// Coverage ledgers (plan CV1-CV4, PFP25; tooling by chat P for MS1).
//   node scripts/coverage_report.mjs           rewrite docs/coverage/README.md
//   node scripts/coverage_report.mjs --check   validate rows only; exit 1 on malformed rows
// A ledger is docs/coverage/<corpus>.jsonl, one JSON object per line:
//   {"id": "...", "source": "...", "state": "...", "mechanisms": ["G", ...], "test": "tests/x.test.js" | null, "note": "..."}
// Coverage percent is a report, never a gate (CV4): only malformed rows fail.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

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
const STATE = /^(runs-canon|runs-authored|unclassified|blocked:[a-z0-9][\w.:-]*|not-a-thing:[a-z0-9][\w.:-]*)$/i;
const FIELDS = new Set(['id', 'source', 'state', 'mechanisms', 'test', 'note']);

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
        if (typeof row.state !== 'string' || !STATE.test(row.state)) problems.push(`${at}: state must be runs-canon, runs-authored, blocked:<rule>, not-a-thing:<reason> or unclassified`);
        if (!Array.isArray(row.mechanisms) || row.mechanisms.some(m => typeof m !== 'string' || !m)) problems.push(`${at}: mechanisms must be an array of owner names`);
        if (row.test !== undefined && row.test !== null && typeof row.test !== 'string') problems.push(`${at}: test must be a string or null`);
        if (/^runs-/.test(row.state ?? '')) {
            const file = typeof row.test === 'string' ? row.test.split('#')[0] : '';
            if (!file) problems.push(`${at}: a runs-* row names the test that runs it`);
            else if (!exists(file)) problems.push(`${at}: test file ${file} does not exist`);
        }
        if (row.note !== undefined && typeof row.note !== 'string') problems.push(`${at}: note must be a string`);
        rows.push(row);
    });
    return {rows, problems};
}

// Counts per ledger: states, the runs share (runs over things, excluding not-a-thing) and top blocking rules.
export function countLedger(rows) {
    const c = {total: rows.length, 'runs-canon': 0, 'runs-authored': 0, blocked: 0, 'not-a-thing': 0, unclassified: 0, rules: {}};
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

export function readLedgers(dir = path.join(root, COVERAGE_DIR)) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort().map(f => {
        const name = f.replace(/\.jsonl$/, '');
        return {name, file: `${COVERAGE_DIR}/${f}`, ...parseLedger(fs.readFileSync(path.join(dir, f), 'utf8'), {name: f})};
    });
}

export function renderReadme(ledgers) {
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
    const blocked = ledgers.flatMap(l => Object.entries(countLedger(l.rows).rules).map(([rule, n]) => ({ledger: l.name, rule, n})))
        .sort((a, b) => b.n - a.n || a.rule.localeCompare(b.rule));
    lines.push('', '## Blocking rules', '', blocked.length ? '| Ledger | Missing rule | Rows |' : 'None yet.');
    if (blocked.length) lines.push('| --- | --- | ---: |', ...blocked.map(b => `| ${b.ledger} | ${b.rule} | ${b.n} |`));
    lines.push('', '## Row format', '', '```json',
        '{"id": "stealth-scales", "source": "gu-identity-evidence.json#stealth-scales; ch. 127", "state": "runs-canon", "mechanisms": ["G", "L"], "test": "tests/gu_catalogue.test.js", "note": ""}',
        '```', '',
        '- `state`: `runs-canon`, `runs-authored`, `blocked:<rule>`, `not-a-thing:<reason>` or `unclassified` (CV2). Rules and reasons are short slugs, such as `blocked:PGB2` or `not-a-thing:alias`.',
        '- A `runs-*` row names an existing test file in `test` (optionally `#test name`).',
        '- `mechanisms`: the owners the thing appears on (SC4), by chat letter or owner name.', '');
    return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const ledgers = readLedgers();
    const problems = ledgers.flatMap(l => l.problems);
    for (const l of ledgers) {
        const c = countLedger(l.rows);
        console.log(`${l.name}: ${c.total} rows, ${c.unclassified} unclassified, runs ${c.runsShare}%`);
    }
    if (problems.length) { console.error(problems.join('\n')); console.error(`FAIL: ${problems.length} malformed rows`); process.exit(1); }
    if (!process.argv.includes('--check')) {
        fs.mkdirSync(path.join(root, COVERAGE_DIR), {recursive: true});
        fs.writeFileSync(path.join(root, COVERAGE_DIR, 'README.md'), renderReadme(ledgers));
        console.log(`wrote ${COVERAGE_DIR}/README.md (${ledgers.length} ledgers)`);
    } else console.log(`coverage rows: PASS (${ledgers.length} ledgers)`);
}
