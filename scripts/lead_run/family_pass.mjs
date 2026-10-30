// Whole-book mechanism-family pass helper (WB3). Free: reads merged rows, calls no model.
//   node scripts/lead_run/family_pass.mjs prep  --merged <dir> --out <dir> [--by lotm|book] [--max 900]
//   node scripts/lead_run/family_pass.mjs tally --in <dir>
// prep writes <out>/in_<group>.tsv: n, rule id, kind, name, worldKind, row count (one line per unique rules id in the group).
// A Luna lane answers <in>/out_<group>.tsv: n<TAB>CODE (codes: docs/gm/dispatch/sonnet-wave-2026-10-30/WB_TAXONOMY.md; NEW:<slug> allowed).
// tally joins answers to the inputs and prints counts per group and code; ids missing from an answer are reported, not guessed.
// Groups: --by lotm splits the shard prefix lotm2c.. into volumes 1-8; --by book is one group.
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const readJsonl = path => readFileSync(path, 'utf8').split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
const groupOf = (shard, by) => by === 'lotm' ? `v${/^lotm([2-8])c/.exec(shard)?.[1] ?? 1}` : 'all';

/** Unique rules ids per group with their kind, name and row count. */
export function ruleInputs(extras, by = 'book') {
    const groups = {};
    for (const row of extras) {
        if (row.extra !== 'rules' || !row.id) continue;
        const group = (groups[groupOf(row.shard, by)] ||= new Map());
        const entry = group.get(row.id) ?? {id: row.id, kind: row.kind ?? '', name: row.name ?? '', worldKind: row.worldKind ?? '', rows: 0};
        entry.rows++;
        group.set(row.id, entry);
    }
    return Object.fromEntries(Object.entries(groups).map(([g, m]) => [g, [...m.values()].sort((a, b) => a.id < b.id ? -1 : 1)]));
}

/** Parse an answer file; returns Map(n -> code). Later duplicates are ignored and counted. */
export function parseAnswer(text) {
    const answers = new Map();
    let duplicates = 0, malformed = 0;
    for (const line of text.split('\n')) {
        if (!line.trim()) continue;
        const match = /^(\d+)\t(NEW:[a-z0-9-]+|[A-Z]{3})\s*$/.exec(line);
        if (!match) { malformed++; continue; }
        if (answers.has(+match[1])) duplicates++; else answers.set(+match[1], match[2]);
    }
    return {answers, duplicates, malformed};
}

export function tally(entries, answers) {
    const counts = {}, rows = {}, missing = [];
    entries.forEach((entry, i) => {
        const code = answers.get(i + 1);
        if (!code) { missing.push(entry.id); return; }
        counts[code] = (counts[code] || 0) + 1;
        rows[code] = (rows[code] || 0) + entry.rows;
    });
    return {counts, rows, missing};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [command, ...args] = process.argv.slice(2), opt = {by: 'book', max: 900};
    for (let i = 0; i < args.length; i += 2) opt[args[i].slice(2)] = args[i + 1];
    if (command === 'prep') {
        const groups = ruleInputs(readJsonl(join(opt.merged, 'extras.jsonl')), opt.by);
        mkdirSync(opt.out, {recursive: true});
        for (const [group, entries] of Object.entries(groups)) {
            const parts = Math.ceil(entries.length / Number(opt.max));
            const size = Math.ceil(entries.length / parts);
            for (let p = 0; p < parts; p++) {
                const name = parts > 1 ? `${group}${'abcdefghij'[p]}` : group;
                const slice = entries.slice(p * size, (p + 1) * size);
                writeFileSync(join(opt.out, `in_${name}.tsv`), slice.map((e, i) => [i + 1, e.id, e.kind, e.name, e.worldKind, e.rows].join('\t')).join('\n') + '\n');
                writeFileSync(join(opt.out, `ids_${name}.json`), JSON.stringify(slice));
                console.log(`${name}: ${slice.length} ids`);
            }
        }
    } else if (command === 'tally') {
        const total = {};
        for (const file of (await import('node:fs')).readdirSync(opt.in).filter(f => /^ids_.*\.json$/.test(f)).sort()) {
            const name = file.slice(4, -5), outFile = join(opt.in, `out_${name}.tsv`);
            if (!existsSync(outFile)) { console.log(`${name}: no answer yet`); continue; }
            const entries = JSON.parse(readFileSync(join(opt.in, file), 'utf8'));
            const {answers, duplicates, malformed} = parseAnswer(readFileSync(outFile, 'utf8'));
            const result = tally(entries, answers);
            console.log(`${name}: ${entries.length - result.missing.length}/${entries.length} classified, ${result.missing.length} missing, ${malformed} malformed, ${duplicates} duplicate`);
            const group = name.replace(/^(v\d|all)[a-z]$/, '$1');
            total[group] ||= {counts: {}, rows: {}};
            for (const [code, n] of Object.entries(result.counts)) {
                total[group].counts[code] = (total[group].counts[code] || 0) + n;
                total[group].rows[code] = (total[group].rows[code] || 0) + result.rows[code];
            }
        }
        writeFileSync(join(opt.in, 'tally.json'), JSON.stringify(total, null, 2) + '\n');
        for (const [group, t] of Object.entries(total)) console.log(group, Object.entries(t.counts).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ${n}`).join(', '));
    } else {
        console.error('usage: family_pass.mjs prep|tally ...');
        process.exitCode = 2;
    }
}
