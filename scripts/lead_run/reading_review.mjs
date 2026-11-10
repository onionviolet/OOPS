// Free local inventory and targeted-review queue. Never submits, grades source truth,
// or upgrades old extraction coverage merely because a newer schema exists.
// node scripts/lead_run/reading_review.mjs --keys coi,ttks1 --out <private folder>
import {readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bookShards} from './make_book_plans.mjs';
import {passDone, EXTRA_PASSES, extraFile} from './batch_lib.mjs';

export const READING_LEVELS = Object.freeze({
    L1: 'Broad source index: declared edition/range, passes, gaps and sampled quality',
    L2: 'System synthesis: cross-arc mechanism, exceptions, contradictions and engine demands',
    L3: 'Build qualification: contextual primary evidence mapped to a specific playable slice',
    L4: 'Expanded life: selected other seats, institutions, regions, voice and alternative uses',
});
export const RELEVANCE = Object.freeze(['lead-trajectory', 'next-slice', 'other-life', 'reference']);
export const ASPECTS = Object.freeze({
    procedures: /procedur|steps|ritual|craft|brew|interrupt|cancel|recover|checkpoint|工序|仪式|儀式|流程|炼|煉/i,
    generation: /generat|random|probab|distribut|seed|simulat|reset|loop|roll|随机|隨機|模拟|模擬|重置|轮回|輪迴/i,
    progression: /learn|practi|train|advanc|master|acquir|teacher|skill|学|學|修炼|修煉|提升/i,
    institutions: /law|authorit|enforce|custom|institut|reput|oblig|debt|guild|法律|组织|組織|规|規/i,
    economy: /price|cost|wage|rent|trade|custody|fee|purchas|金钱|金錢|费用|費用|价格|價格/i,
    knowledge: /know|belie|observ|witness|perce|dece|reveal|记忆|記憶|观察|觀察|秘密/i,
    life: /routine|relation|house|habit|travel|route|ecolog|weather|season|daily|日常|关系|關係|家庭|路线|路線/i,
    conflict: /harm|injur|combat|hazard|heal|disease|surviv|伤|傷|战斗|戰鬥|治疗|治療/i,
});
const PASSES = ['census', 'scenes', 'rules', 'people', 'texture'];
const FIELDS = {rules: ['costStated', 'acquire', 'reset', 'enforcement'], people: ['routine.recurrence', 'relations.since', 'reacts.class'],
    services: ['priceStated', 'kind', 'amount', 'unit'], scenes: ['steps.actor', 'steps.locator', 'steps.kind', 'steps.using', 'steps.witnesses']};
const present = v => v !== undefined && v !== null && v !== '' && (!Array.isArray(v) || v.length > 0);
function hasPath(row, field) {
    const [a, b] = field.split('.');
    return b ? Array.isArray(row[a]) && row[a].some(r => present(r[b])) : present(row[a]);
}

export function rowMetrics(rows, kind) {
    return {rows: rows.length, labelled: rows.filter(r => ['T', 'S', 'I', 'U'].includes(r.label)).length,
        located: rows.filter(r => present(r.locator) || present(r.firstMention) || present(r.evidence)).length,
        fields: Object.fromEntries((FIELDS[kind] || []).map(f => [f, rows.filter(r => hasPath(r, f)).length]))};
}

function chosenFile(files, prefix, pass, key) {
    for (const p of [prefix, `${prefix}L`]) {
        if (files.has(`${p}_${pass}.partial`)) continue;
        const file = ['census', 'scenes'].includes(pass) ? `${p}m_${pass}.jsonl` : `${p}_${extraFile(pass, key)}.jsonl`;
        if (files.has(file)) return file;
    }
    return null;
}

export function inspectBook(book) {
    const names = existsSync(book.dir) ? readdirSync(book.dir) : [], files = new Set(names), shards = bookShards(book, names);
    const report = {key: book.key, world: book.world, source: book.source, privateDir: book.dir, shards: shards.length,
        levels: {L1: 'extraction inventory only', L2: 'not established by this inventory', L3: 'not established by this inventory', L4: 'not established by this inventory'},
        passes: {}, rows: {}, parseErrors: [], candidates: Object.fromEntries(Object.keys(ASPECTS).map(k => [k, []]))};
    for (const pass of PASSES) {
        const have = shards.filter(s => passDone(pass, s.prefix, files)).length;
        report.passes[pass] = {present: have, missing: shards.length - have};
        const keys = EXTRA_PASSES[pass] || [pass];
        for (const s of shards) for (const key of keys) {
            const file = chosenFile(files, s.prefix, pass, key);
            if (!file) continue;
            const rows = [];
            for (const [i, line] of readFileSync(join(book.dir, file), 'utf8').split('\n').entries()) {
                if (!line.trim()) continue;
                try { rows.push(JSON.parse(line)); } catch { report.parseErrors.push({file, line: i + 1}); }
            }
            const m = rowMetrics(rows, key), total = report.rows[key] ||= {rows: 0, labelled: 0, located: 0, fields: {}};
            for (const k of ['rows', 'labelled', 'located']) total[k] += m[k];
            for (const [k, n] of Object.entries(m.fields)) total.fields[k] = (total.fields[k] || 0) + n;
            // Pointers only: matched words nominate contextual review, never prove a mechanism.
            if (!['rules', 'other', 'people', 'services'].includes(key)) continue;
            for (const row of rows) for (const [aspect, re] of Object.entries(ASPECTS)) {
                const candidates = report.candidates[aspect];
                if (candidates.length >= 3 || !re.test(JSON.stringify(row))) continue;
                candidates.push({file, shard: s.file, prefix: s.prefix, rowId: row.id || null, locator: row.locator || null, pass, key});
            }
        }
    }
    report.warning = 'Field absence is a review candidate, not a source omission. File presence is neither source truth nor L2/L3 completion. Keyword candidates are not semantic findings. Existing dossiers may exist elsewhere and need explicit evidence linking.';
    return report;
}

export function dossierTemplate({world, topic, level = 'L2', relevance = ['lead-trajectory']}) {
    if (!READING_LEVELS[level] || relevance.some(r => !RELEVANCE.includes(r))) throw Error('unknown reading level or relevance');
    return {world, topic, level, relevance, state: 'not-reviewed', edition: null, sourceRanges: [], evidence: [],
        mechanism: {acquire: [], operate: [], inputs: [], outputs: [], time: [], branches: [], interrupt: [], recover: [],
            progression: [], constraints: [], exceptions: [], interactions: [], observers: []},
        procedural: {fixedVsVariable: [], identity: [], dependencies: [], commitTime: [], distribution: [], resetKeeps: [], budgets: []},
        contradictions: [], unknowns: [], proposals: [],
        consumers: [], successScenario: null, failureScenario: null,
        review: {supported: [], partial: [], wrong: [], missed: [], sampleLimits: null}};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2), flag = k => args[args.indexOf(k) + 1];
    if (!args.includes('--out')) throw Error('usage: reading_review.mjs [--keys coi,ttks1] --out <private folder>');
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
    const registry = JSON.parse(readFileSync(join(root, 'docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json'), 'utf8'));
    const keys = args.includes('--keys') ? new Set(flag('--keys').split(',')) : null;
    const reports = registry.books.filter(b => !keys || keys.has(b.key)).map(inspectBook);
    const out = resolve(flag('--out')); mkdirSync(out, {recursive: true});
    writeFileSync(join(out, 'inventory.json'), JSON.stringify({createdAt: new Date().toISOString(), levels: READING_LEVELS, reports}, null, 1) + '\n');
    if (args.includes('--topic')) for (const world of new Set(reports.map(r => r.world))) {
        const file = join(out, `dossier-${world}.json`);
        if (!existsSync(file)) writeFileSync(file, JSON.stringify(dossierTemplate({world, topic: flag('--topic'), level: args.includes('--level') ? flag('--level') : 'L2'}), null, 1) + '\n');
    }
    for (const r of reports) console.log(JSON.stringify({key: r.key, shards: r.shards, passes: r.passes, parseErrors: r.parseErrors.length, rows: Object.fromEntries(Object.entries(r.rows).map(([k, m]) => [k, m.rows]))}));
}
