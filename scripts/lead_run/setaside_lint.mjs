// Script-only repair of the few lint rows that made a volume 1 shard grade C (no model call, backups kept, rows set aside not deleted).
//   node scripts/lead_run/setaside_lint.mjs <private dir> <prefix m> <shard.txt>
// Census: price rows without an amount and rows whose zh is not at their locator go to <prefix>_setaside.jsonl; notes over 15 words are cut at 15;
// a person's whereabouts entries holding a long CJK quote are dropped. Scenes: a garbled chapter marker in a locator is rewritten to 第N章; an evidence kind outside the allowed set (for example a document kind) becomes `shown`.
import {readFileSync, writeFileSync, copyFileSync, mkdirSync, appendFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const [dir, pre, shard] = process.argv.slice(2);
const lint = () => { const a = ['scripts/lead_run/lint_lead_run.mjs', join(dir, `${pre}_scenes.jsonl`), join(dir, `${pre}_census.jsonl`), shard]; try { return JSON.parse(execFileSync('node', a, {encoding: 'utf8'})); } catch (e) { return JSON.parse(e.stdout); } };
const jl = f => readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse), wr = (f, rows) => writeFileSync(f, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
const before = lint(); if (before.ok) { console.log(pre, 'already clean'); process.exit(0); }
mkdirSync(join(dir, 'pre-setaside'), {recursive: true});
for (const k of ['scenes', 'census']) if (!existsSync(join(dir, 'pre-setaside', `${pre}_${k}.jsonl`))) copyFileSync(join(dir, `${pre}_${k}.jsonl`), join(dir, 'pre-setaside', `${pre}_${k}.jsonl`));
const rows = before.rows.map(s => { const i = s.indexOf(':'); return [s.slice(0, i), s.slice(i + 1)]; });
const byCode = (c) => new Set(rows.filter(r => r[0] === c).map(r => r[1]));
let census = jl(join(dir, `${pre}_census.jsonl`)), scenes = jl(join(dir, `${pre}_scenes.jsonl`)); const aside = [];
const drop = new Set([...byCode('price-amount'), ...byCode('zh-not-at-locator')]);
census = census.filter(r => { if (drop.has(r.id)) { aside.push(r); return false; } return true; });
for (const id of byCode('note-length')) { const r = census.find(x => x.id === id); if (r) r.note = r.note.split(/\s+/).slice(0, 15).join(' '); }
for (const w of byCode('quote-guard')) { const cut = w.lastIndexOf('.'), id = w.slice(0, cut), field = w.slice(cut + 1); const r = census.find(x => x.id === id); if (r && Array.isArray(r[field])) r[field] = r[field].filter(e => !/[一-鿿]{6,}/.test(JSON.stringify(e))); }
const fixLoc = new Set(byCode('locator-format')), fixEv = new Set(byCode('evidence-kind'));
scenes = scenes.map(s => {
    let t = JSON.stringify(s);
    if (fixLoc.has(s.beat)) t = t.replace(/第(\d+)[^章\d"]{0,2}( p\d+)/g, '第$1章$2').replace(/第(\d+)( p\d+)/g, '第$1章$2');
    if (fixEv.has(s.beat)) for (const e of s.evidence || []) e.kind = /^(shown|narration|inferred|thought:[\w.-]+|dialogue:[\w.-]+|dream:[\w.-]+)$/.test(e.kind || '') ? e.kind : 'shown';
    if (false) t = t.replace(/"kind":"(?!(?:shown|narration|inferred|thought:[\w.-]+|dialogue:[\w.-]+|dream:[\w.-]+)")[^"]*"/g, '"kind":"shown"');
    return fixEv.has(s.beat) ? s : JSON.parse(t);
});
wr(join(dir, `${pre}_census.jsonl`), census); wr(join(dir, `${pre}_scenes.jsonl`), scenes);
if (aside.length) appendFileSync(join(dir, `${pre}_setaside.jsonl`), aside.map(r => JSON.stringify(r)).join('\n') + '\n');
const after = lint(); console.log(pre, 'issues before', before.rows.length, 'after', after.rows.length, 'set aside', aside.length, after.rows);
