// A/B comparison of two graded shards over the same text (e.g. a protocol v2 reader vs a batch re-read): grade, row counts,
// census recall of the reference's names, names only the candidate found, option counts. Ids and counts only.
//   node scripts/lead_run/batch_compare.mjs <dir> <refPrefix> <candPrefix>
import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const jsonl = p => existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];
// Kinship words and titles point at different people by speaker; they never count as a variant match.
const RELATIONAL = new Set(['哥哥', '妹妹', '姐姐', '弟弟', '父亲', '母亲', '爸爸', '妈妈', '队长', '导师', '老师', '先生', '女士', '夫人', '小姐', '大人', '阁下', '房东']);
const norm = s => String(s || '').replace(/[.．・]/g, '·').trim();

export function compareShards(ref, cand) {
    const names = rows => new Set(rows.census.map(r => norm(r.zh)).filter(Boolean));
    const a = names(ref), b = names(cand);
    const hit = [...a].filter(n => b.has(n)).length;
    // A variant counts as found when a candidate name contains the reference name or the reverse (full name vs given name, with or without a title).
    const bl = [...b], variantHit = [...a].filter(n => b.has(n) || bl.some(m => (n.length >= 2 && m.includes(n) && !RELATIONAL.has(n)) || (m.length >= 2 && n.includes(m) && !RELATIONAL.has(m)))).length;
    const opts = rows => rows.scenes.reduce((n, s) => n + (s.options || []).length, 0);
    return {refCensus: ref.census.length, candCensus: cand.census.length, refNames: a.size, candNames: b.size,
        recall: a.size ? Number((hit / a.size).toFixed(3)) : 1, recallWithVariants: a.size ? Number((variantHit / a.size).toFixed(3)) : 1, onlyCandidate: [...b].filter(n => !a.has(n)).length,
        scenes: [ref.scenes.length, cand.scenes.length], options: [opts(ref), opts(cand)], fills: [ref.fills.length, cand.fills.length],
        headers: [ref.header?.grade, cand.header?.grade], nameAccuracy: [ref.header?.nameAccuracy, cand.header?.nameAccuracy],
        switchRule: 'grade A or B and census recall >= 0.9 (exact and with-variants both reported)'};
}

export const load = (dir, p) => ({scenes: jsonl(join(dir, `${p}_scenes.jsonl`)), census: jsonl(join(dir, `${p}_census.jsonl`)), fills: jsonl(join(dir, `${p}_fills.jsonl`)),
    header: existsSync(join(dir, `${p}_header.json`)) ? JSON.parse(readFileSync(join(dir, `${p}_header.json`), 'utf8')) : null});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [dir, ref, cand] = process.argv.slice(2);
    if (!cand) { console.error('usage: batch_compare.mjs <dir> <refPrefix> <candPrefix>'); process.exit(2); }
    console.log(JSON.stringify(compareShards(load(dir, ref), load(dir, cand)), null, 1));
}
