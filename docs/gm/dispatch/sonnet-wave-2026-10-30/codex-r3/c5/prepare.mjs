// C5 adapter: source summaries -> existing family_pass prep; no semantic labels.
import {readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';
const here = 'docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5';
const lead = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27';
const source = `${lead}/m4-whole-book-2026-10-29/merged/extras.jsonl`;
const home = `${lead}/wb-families-texture`;
const hash = data => createHash('sha256').update(data).digest('hex');
const raw = readFileSync(source, 'utf8');
const sourceHash = hash(raw);
// Regeneration must not invalidate readers' already-written answers.
if (existsSync(home) && readdirSync(home).some(f => /^out_/.test(f))) throw Error('Answers exist; do not regenerate a live dispatch');
mkdirSync(`${home}/normalized`, {recursive: true});
const originals = [], normalized = [], seen = new Map(), counts = {}, skipped = {};
for (const [i, line] of raw.split('\n').entries()) {
    if (!line.trim()) continue;
    const row = JSON.parse(line);
    if (!['texture_other', 'rules_other'].includes(row.extra)) {
        skipped[row.extra] = (skipped[row.extra] || 0) + 1;
        continue;
    }
    if (typeof row.what !== 'string' || !row.what.trim()) throw Error(`Missing summary: source line ${i + 1}`);
    const volume = Number(/^lotm([2-8])c/.exec(row.shard)?.[1] || 1);
    const digest = hash(line), occurrence = (seen.get(digest) || 0) + 1;
    seen.set(digest, occurrence);
    const id = `c5.v${volume}.${digest}.${occurrence}`;
    originals.push({id, volume, sourceLine: i + 1, row});
    // Keep only the actual summary in the display field, never guess from its slug.
    normalized.push({id, extra: 'rules', kind: row.extra, name: row.what.replace(/[\t\r\n]+/g, ' '), worldKind: '', shard: row.shard});
    counts[volume] ||= {texture_other: 0, rules_other: 0};
    counts[volume][row.extra]++;
}
writeFileSync(`${home}/source_rows.jsonl`, originals.map(r => JSON.stringify(r)).join('\n') + '\n');
writeFileSync(`${home}/normalized/extras.jsonl`, normalized.map(r => JSON.stringify(r)).join('\n') + '\n');
const prep = spawnSync(process.execPath, ['scripts/lead_run/family_pass.mjs', 'prep', '--merged', `${home}/normalized`, '--out', home, '--by', 'lotm', '--max', '3500'], {encoding: 'utf8'});
if (prep.status !== 0) throw Error(prep.stderr);
const shards = [];
for (const [i, file] of readdirSync(home).filter(f => /^in_.*\.tsv$/.test(f)).sort().entries()) {
    const group = file.slice(3, -4), bytes = readFileSync(join(home, file)), lines = bytes.toString().trimEnd().split('\n');
    const words = lines.reduce((n, l) => n + l.split('\t')[3].split(/\s+/).length, 0);
    const entry = {brief: `luna_${i + 1}.md`, group, input: `${home}/${file}`, output: `${home}/out_${group}.tsv`, rows: lines.length, summaryWords: words, inputSha256: hash(bytes)};
    shards.push(entry);
    writeFileSync(`${here}/${entry.brief}`, `# C5 Luna ${i + 1}: ${group}\n\nModel: gpt-6-luna, medium. Coordinator launches this job; do not delegate.\nRead AGENTS.md and the taxonomy at \`docs/gm/dispatch/sonnet-wave-2026-10-30/WB_TAXONOMY.md\`. Rules: WPR4, WPR6-WPR8, WPR23, AU5-AU6, AU10-AU15.\n\nInput: \`${entry.input}\` (${entry.rows} rows; SHA-256 ${entry.inputSha256}).\nOwn exactly ONE private answer file: \`${entry.output}\`. No other writes, commits, web or gameplay edits.\n\nTSV columns without header: local n, stable synthetic row id, original extra kind, summary text, empty field, occurrence count (1). Each id denotes one original row, not a canonical entity. Classify each row by its own summary into exactly one existing three-letter family code. The taxonomy is proposal vocabulary, not accepted game design. Reuse its meanings; OTH is valid. Do not infer from nearby rows, ids, keywords alone or outside canon. News rows were excluded before prep; a CAL-like summary still gets its fitting code.\n\nThis is classification of previously extracted summaries, not a new book read. The C5-specific instruction uses about 2,500-3,500 rows per brief, overriding the common 150-300-row brief default. Read only n and summary on the ordinary route (e.g. Python TSV projection); avoid printing ids and metadata into context. There are ${words} summary words. Preflight the projected payload, load at most three bounded pieces, and stop before the AU10 context limits (<60k target, 80k stop; host overhead counts). If it does not fit, return unread ids explicitly for coordinator repair; do not silently load beyond the cap or claim coverage.\n\nAmbiguous rows: consult \`${home}/source_rows.jsonl\` by exact id, then if necessary use the source locator. At most 10 ambiguous ids and at most 8 paragraphs per id; raw paragraph exposure at most 12,000 words total. Command: \`node scripts/lead_run/cite_paragraphs.mjs ${lead} --merged ${lead}/m4-whole-book-2026-10-29/merged --id <about-id> --context 3 --max 8\`. The synthetic id is not a citation-tool id; use row.about and verify its locator. If the tool cannot reach the precise locator, use OTH when supported by the summary or leave unread; invent no fact. Keep source text and any secret truth private.\n\nOutput: one line per read row, \`n<TAB>CODE\`, ordered by n. NEW:<kebab-slug> is allowed only when existing codes fail, with a concrete reason in the metadata below (at most 8 new slugs). No placeholders. Every row must come from text actually read: the summary is sufficient for an unambiguous row; paragraph reading is not claimed. Unread ids go in a final JSON line \`{"unread":["<stable-row-id>"],"new_reasons":{"NEW:<slug>":"why existing families fail"}}\`. Omit this trailer for complete output without NEW. Do not label unread rows. This metadata is stripped by the C5 fold before existing tally.\n\nDone check: every input n appears exactly once in label lines or its stable id appears exactly once in unread, never both; codes are from the taxonomy or justified NEW; no extra n. Use at most six responses including final, return at most 200 words with output path, classified/unread counts, paragraph reads and any context/usage gaps. Coordinator runs \`node ${here}/fold.mjs\` and samples 15 rows per family before integration.\n`);
}
const manifest = {schema: 'c5-texture-prep/1', source, sourceSha256: sourceHash, home, counts, skipped, rows: originals.length, shards, volume1: {rows: counts[1] || 0, status: 'No texture_other or rules_other in supplied whole-book merge; older volume-one shard extras are not silently mixed into this edition.'}};
writeFileSync(`${home}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
writeFileSync(`${here}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({rows: manifest.rows, counts, briefs: shards.length, sourceSha256: sourceHash, summaryWordRange: [Math.min(...shards.map(s => s.summaryWords)), Math.max(...shards.map(s => s.summaryWords))]}));
