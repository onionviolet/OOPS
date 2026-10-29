#!/usr/bin/env node
// LSD200, LSD205: rank unreviewed gap steps by how likely a reviewer finds a tagging fault ("actor not the lead" or "not an action"), from scene and step shape alone.
// Naive-Bayes log-odds over a few coarse features, trained on reviewed verdicts; the printed AUC is a seeded split-half estimate, not a promise.
// Features avoid the shard or volume, which only reflect which review lane read the step. Private inputs and outputs; no model call.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const FAULT_REASONS = Object.freeze(['actor not the lead', 'not an action']);
const FEATURES = ['cls', 'pres', 'nwords', 'evdlg', 'objnull'];

export function featuresOf(scene, step) {
  const ev = (scene.evidence || []).map(e => String(e.kind || '').split(':')[0]);
  return {cls: String(step.class ?? 'none'), pres: String(Math.min((scene.present || []).length, 6)), nwords: String(Math.min(String(step.verb || '').split(/\s+/).filter(Boolean).length, 5)),
    evdlg: String(ev.includes('dialogue')), objnull: String(step.object == null)};
}
export function train(rows) {
  const pos = rows.filter(r => r.y).length, neg = rows.length - pos, model = {};
  for (const k of FEATURES) {
    const counts = new Map();
    for (const r of rows) { const c = counts.get(r.x[k]) || [0, 0]; c[r.y ? 1 : 0]++; counts.set(r.x[k], c); }
    model[k] = new Map([...counts].map(([v, c]) => [v, Math.log(((c[1] + 1) / (pos + 2)) / ((c[0] + 1) / (neg + 2)))]));
  }
  return model;
}
export const score = (model, x) => FEATURES.reduce((s, k) => s + (model[k].get(x[k]) ?? 0), 0);
export function auc(scored) {
  const p = scored.filter(r => r.y).map(r => r.s), n = scored.filter(r => !r.y).map(r => r.s);
  if (!p.length || !n.length) return null;
  let wins = 0; for (const a of p) for (const b of n) wins += a > b ? 1 : a === b ? 0.5 : 0;
  return wins / (p.length * n.length);
}
/** Seeded split-half estimate (mulberry32), mean over `reps`. */
export function splitHalfAuc(rows, {reps = 40, seed = 5} = {}) {
  let a = seed >>> 0; const rnd = () => { a = a + 0x6D2B79F5 >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const out = [];
  for (let r = 0; r < reps; r++) {
    const idx = rows.map((_, i) => i).sort(() => rnd() - 0.5), h = idx.length >> 1;
    const model = train(idx.slice(0, h).map(i => rows[i]));
    const v = auc(idx.slice(h).map(i => ({y: rows[i].y, s: score(model, rows[i].x)})));
    if (v != null) out.push(v);
  }
  return out.length ? out.reduce((s, v) => s + v, 0) / out.length : null;
}

const readJsonl = f => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
function main(args) {
  const get = (k, req = true) => { const i = args.indexOf(k); if (i < 0 || !args[i + 1]) { if (req) throw Error(`Missing ${k}`); return null; } return args[i + 1]; };
  const scenes = new Map(readJsonl(get('--scenes')).map(s => [s.beat, s]));
  const reviewed = new Map(); for (const f of args.flatMap((x, i) => x === '--reviewed' ? [args[i + 1]] : [])) for (const r of readJsonl(f)) if (r.stepId && !reviewed.has(r.stepId)) reviewed.set(r.stepId, r);
  const featOf = id => { const [b, i] = id.split('#'); const s = scenes.get(b), st = s?.steps?.[Number(i) - 1]; return s && st ? featuresOf(s, st) : null; };
  const rows = [];
  for (const [id, r] of reviewed) { const x = featOf(id); if (x && (r.verdict === 'row' || r.gapReason)) rows.push({x, y: FAULT_REASONS.includes(r.gapReason)}); }
  const model = train(rows), queue = [];
  const dir = get('--mappings');
  for (const f of fs.readdirSync(dir).filter(f => /^v\d+-ch\d+-\d+\.json$/.test(f)).sort()) for (const r of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).rows || []) {
    if (r.status !== 'gap' || reviewed.has(r.id)) continue; const x = featOf(r.id); if (x) queue.push({stepId: r.id, score: Math.round(score(model, x) * 1000) / 1000, family: r.class || null});
  }
  queue.sort((a, b) => b.score - a.score || a.stepId.localeCompare(b.stepId));
  const out = get('--out'); fs.mkdirSync(path.dirname(out), {recursive: true}); fs.writeFileSync(out, queue.map(q => JSON.stringify(q)).join('\n') + '\n');
  console.log(JSON.stringify({trainedOn: rows.length, faults: rows.filter(r => r.y).length, splitHalfAuc: splitHalfAuc(rows), queued: queue.length}));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
