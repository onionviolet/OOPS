// Read-only census and source-size receipt. Not a browser/rendering benchmark.
import {readFileSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const read = path => readFileSync(root + path);
const files = readdirSync(root + 'docs/coverage').filter(f => f.endsWith('.jsonl')).sort();
const excluded = new Set(['worlds.jsonl', 'interaction_oracle.jsonl']);
const totals = {}, ledgers = [], metadata = [], ids = new Map();
const hash = createHash('sha256');
let bytes = 0;
for (const file of files) {
    const data = read('docs/coverage/' + file);
    hash.update(file).update('\0').update(data);
    const rows = data.toString().split('\n').filter(s => s.trim()).map(s => JSON.parse(s));
    if (excluded.has(file)) { metadata.push({file, rows: rows.length}); continue; }
    bytes += data.length;
    const states = {};
    for (const row of rows) {
        if (typeof row.state !== 'string') throw new Error(`${file}: missing state`);
        const family = row.state.startsWith('not-a-thing') ? 'not-a-thing' : row.state.split(/[:-]/)[0];
        totals[family] = (totals[family] || 0) + 1;
        states[row.state] = (states[row.state] || 0) + 1;
        ids.set(row.id, (ids.get(row.id) || 0) + 1);
    }
    ledgers.push({file, rows: rows.length, states});
}
const sources = ['prototypes/world-atlas/canvas.mjs', 'src/ui/figure.js', 'src/ui/figure_graph.js',
    'src/ui/walk_map.js', 'src/ui/walk_topology.js', 'src/ui/inspector.js'].map(path => {
    const b = read(path);
    return {path, bytes: b.length, gzipBytes: gzipSync(b, {level: 9}).length,
        sha256: createHash('sha256').update(b).digest('hex')};
});
console.log(JSON.stringify({at: new Date().toISOString(),
    head: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim(),
    node: process.version, ledgerFiles: ledgers.length, ledgerBytes: bytes,
    ledgerRows: ledgers.reduce((n, l) => n + l.rows, 0), metadata, totals,
    duplicateBareIds: [...ids.values()].filter(n => n > 1).length,
    coverageInputSha256: hash.digest('hex'),
    allowlistEntries: JSON.parse(read('tests/ui_contract_allowlist.json')).entries.length,
    uiJsModules: readdirSync(root + 'src/ui').filter(f => f.endsWith('.js')).length,
    sources, selected: ledgers.filter(l => /^(gu_kinds|gu_moves|lotm_powers|lotm_potions|hp_potions|hp_spells)\.jsonl$/.test(l.file))}, null, 2));
