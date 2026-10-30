// Validate prep/reader coverage before using the unmodified L7 tally.
import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parseAnswer} from '../../../../../../scripts/lead_run/family_pass.mjs';
const here = 'docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5';
const m = JSON.parse(readFileSync(`${here}/manifest.json`));
const hash = data => createHash('sha256').update(data).digest('hex');
const dry = process.argv.includes('--dry-run');
const outputHome = `${m.home}/${dry ? 'dry-run' : 'folded'}`;
const source = readFileSync(m.source, 'utf8');
assert.equal(hash(source), m.sourceSha256, 'Source changed; coordinator must reconcile inputs');
const sourceLines = source.split('\n');
const expected = new Map(sourceLines.flatMap((line, i) => {
    if (!line.trim()) return [];
    const row = JSON.parse(line);
    return ['texture_other', 'rules_other'].includes(row.extra) ? [[i + 1, row]] : [];
}));
const originals = readFileSync(`${m.home}/source_rows.jsonl`, 'utf8').trimEnd().split('\n').map(JSON.parse);
const byId = new Map(), seenLines = new Set(), occurrence = new Map();
const actualCounts = {};
for (const entry of originals) {
    assert(!byId.has(entry.id), 'Duplicate stable id');
    assert(!seenLines.has(entry.sourceLine), 'Source line represented twice');
    assert.deepEqual(entry.row, expected.get(entry.sourceLine), 'Original source row changed');
    const digest = hash(sourceLines[entry.sourceLine - 1]);
    const n = (occurrence.get(digest) || 0) + 1;
    occurrence.set(digest, n);
    const volume = Number(/^lotm([2-8])c/.exec(entry.row.shard)?.[1] || 1);
    assert.equal(entry.volume, volume);
    assert.equal(entry.id, `c5.v${volume}.${digest}.${n}`, 'Unstable synthetic id');
    actualCounts[volume] ||= {texture_other: 0, rules_other: 0};
    actualCounts[volume][entry.row.extra]++;
    byId.set(entry.id, entry); seenLines.add(entry.sourceLine);
}
assert.equal(seenLines.size, expected.size, 'Selected source row omitted');
assert.equal(byId.size, m.rows);
assert.deepEqual(actualCounts, m.counts);
const taxonomy = readFileSync('docs/gm/dispatch/sonnet-wave-2026-10-30/WB_TAXONOMY.md', 'utf8');
const allowed = new Set([...taxonomy.matchAll(/^\| ([A-Z]{3}) \|/gm)].map(x => x[1]));
const assigned = new Set(), outputs = [], reviews = new Map();
let labelled = 0, unread = 0;
for (const shard of m.shards) {
    const bytes = readFileSync(shard.input);
    assert.equal(hash(bytes), shard.inputSha256, 'Reader input changed');
    const lines = bytes.toString().trimEnd().split('\n').map(l => l.split('\t'));
    const entries = JSON.parse(readFileSync(`${m.home}/ids_${shard.group}.json`));
    assert.equal(lines.length, shard.rows); assert.equal(entries.length, shard.rows);
    const brief = readFileSync(`${here}/${shard.brief}`, 'utf8');
    assert(brief.includes(shard.input) && brief.includes(shard.output), 'Brief ownership mismatch');
    for (const [i, fields] of lines.entries()) {
        assert.equal(fields.length, 6); assert.equal(+fields[0], i + 1);
        const row = byId.get(fields[1]); assert(row, 'Foreign id');
        assert(!assigned.has(row.id), 'Id in more than one brief'); assigned.add(row.id);
        assert.equal(fields[2], row.row.extra);
        assert.equal(fields[3], row.row.what.replace(/[\t\r\n]+/g, ' '));
        assert.equal(fields[4], ''); assert.equal(fields[5], '1');
        assert.equal(row.volume, +/^v(\d)/.exec(shard.group)[1]);
        assert.equal(entries[i].id, row.id); assert.equal(entries[i].rows, 1);
        assert.equal(entries[i].name, fields[3]); assert.equal(entries[i].kind, fields[2]);
    }
    if (dry) { outputs.push({shard, entries}); continue; }
    assert(existsSync(shard.output), `Missing reader output: ${shard.output}`);
    const raw = readFileSync(shard.output, 'utf8').trimEnd().split('\n');
    let meta = {unread: [], new_reasons: {}};
    if (raw.at(-1)?.startsWith('{')) meta = {...meta, ...JSON.parse(raw.pop())};
    assert(Array.isArray(meta.unread));
    const {answers, duplicates, malformed} = parseAnswer(raw.join('\n'));
    assert.equal(duplicates, 0, 'Duplicate answer'); assert.equal(malformed, 0, 'Malformed answer');
    const skipped = new Set(meta.unread);
    assert.equal(skipped.size, meta.unread.length, 'Duplicate unread id');
    for (const id of skipped) assert(entries.some(e => e.id === id), 'Foreign unread id');
    for (const [n, code] of answers) {
        assert(n >= 1 && n <= entries.length, 'Out-of-range n');
        assert(allowed.has(code) || /^NEW:[a-z0-9-]+$/.test(code), 'Unknown code');
        if (code.startsWith('NEW:')) assert(typeof meta.new_reasons?.[code] === 'string' && meta.new_reasons[code].trim().length >= 12, 'NEW needs reason');
        assert(!skipped.has(entries[n - 1].id), 'Unread row labelled');
        const review = reviews.get(code) || [];
        review.push({group: shard.group, n, code, ...byId.get(entries[n - 1].id)});
        reviews.set(code, review);
    }
    assert(new Set([...answers.values()].filter(c => c.startsWith('NEW:'))).size <= 8);
    entries.forEach((e, i) => assert(answers.has(i + 1) || skipped.has(e.id), `Unaccounted row ${e.id}`));
    labelled += answers.size; unread += skipped.size;
    outputs.push({shard, entries, text: [...answers].sort((a, b) => a[0] - b[0]).map(([n, c]) => `${n}\t${c}`).join('\n') + '\n'});
}
assert.equal(assigned.size, byId.size, 'Row not assigned to a brief');
mkdirSync(outputHome, {recursive: true});
for (const {shard, entries, text} of outputs) {
    writeFileSync(`${outputHome}/ids_${shard.group}.json`, JSON.stringify(entries));
    if (text) writeFileSync(`${outputHome}/out_${shard.group}.tsv`, text);
}
const result = spawnSync(process.execPath, ['scripts/lead_run/family_pass.mjs', 'tally', '--in', outputHome], {encoding: 'utf8'});
assert.equal(result.status, 0, result.stderr);
writeFileSync(`${outputHome}/tally.log`, result.stdout);
if (!dry) {
    // Hash ordering gives reproducible samples spread across files, without model labels.
    const sample = [...reviews].flatMap(([, rows]) => rows.sort((a, b) => hash(a.id).localeCompare(hash(b.id))).slice(0, 15));
    writeFileSync(`${outputHome}/review_sample.jsonl`, sample.map(x => JSON.stringify(x)).join('\n') + '\n');
}
const receipt = {mode: dry ? 'prep-dry-run' : 'fold', sourceSha256: m.sourceSha256, rows: byId.size, texture: originals.filter(e => e.row.extra === 'texture_other').length, rulesOther: originals.filter(e => e.row.extra === 'rules_other').length, news: 0, briefs: m.shards.length, labelled, unread, tallyExit: result.status, semanticClassificationVerified: false};
writeFileSync(`${outputHome}/receipt.json`, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt));
if (!dry && unread) { console.error('Incomplete: repair explicit unread ids before integration'); process.exitCode = 1; }
