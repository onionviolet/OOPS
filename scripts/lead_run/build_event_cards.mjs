#!/usr/bin/env node
// LSD167, LSD182, LSD193, LSD103, CLR6: canon-event cards by script, no model call. A gap step becomes a card built from fields the readings hold, or stays a gap
// with the reason. A card is data: the book's action with its place, time, people, assigned outcomes and knowledge, and the options the canon run locks.
// A card makes a step reachable (a record of what happened, applied as effects); it is not a playable control. Cards run nothing until a card runtime reads them.
// Public and name-free: canon scenes come in through --scenes and --mappings and the output stays private.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseLocator} from './world_profiles.mjs';
import {kindOf} from './derive_step_tags.mjs';
import {buildThreads} from './build_event_threads.mjs';

const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'his', 'her', 'its', 'lead', 'self', 'fact', 'lotm', 'person', 'item', 'place', 'null']);
const tokens = v => new Set(String(v ?? '').toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP.has(t)));
const overlaps = (a, b) => { for (const t of a) if (b.has(t)) return true; return false; };

/** First parseable evidence locator's volume (book) and chapter; Chinese volume 1 is book 0. */
export function sceneVolumeChapter(scene) {
  for (const e of scene?.evidence || []) { const p = parseLocator(e.locator); if (p) return {book: p.book, ch: p.ch}; }
  return null;
}
export const inVolumeOneChapters = (scene, maxChapter) => { const v = sceneVolumeChapter(scene); return !!v && v.book === 0 && v.ch <= maxChapter; };

/** LSD193: assign the scene's outcomes, knowledge and choices to the steps they name; leftovers go to the scene's last card-eligible step. */
export function assignScene(scene, eligibleIndexes) {
  const steps = scene.steps || [], per = steps.map(() => ({outcomes: [], knowledge: [], choices: []}));
  const stepTokens = steps.map(s => tokens(`${s.verb} ${s.object ?? ''} ${(s.outputs || []).join(' ')} ${(s.gains || []).join(' ')}`));
  const leftover = {outcomes: [], knowledge: [], choices: []};
  const place = (kind, item, text) => {
    const t = tokens(text), hit = stepTokens.findIndex((st, i) => eligibleIndexes.has(i) && overlaps(st, t));
    (hit >= 0 ? per[hit][kind] : leftover[kind]).push(item);
  };
  for (const o of scene.outcomes || []) place('outcomes', o, `${o.fact} ${o.value ?? ''}`);
  for (const k of scene.knowledge || []) place('knowledge', k, k.fact);
  for (const c of scene.choices || []) place('choices', c, c.taken);
  const last = [...eligibleIndexes].sort((a, b) => b - a)[0];
  const orphan = last === undefined ? leftover : {outcomes: [], knowledge: [], choices: []};
  if (last !== undefined) for (const k of Object.keys(leftover)) per[last][k].push(...leftover[k]);
  return {per, orphan, lastIndex: last ?? null};
}

const hasTime = scene => !!(scene.timeOfDay?.value || scene.date?.value || (scene.date?.anchor && scene.date?.offsetDays != null));

/** One scene's gap steps to cards or gaps. `rowsByStep` maps step id to its mapping row (status, lockedOptions, packPlaceId). */
export function buildSceneCards(scene, rowsByStep, threadId = null) {
  const steps = scene.steps || [], eligible = new Set();
  steps.forEach((s, i) => { const r = rowsByStep.get(`${scene.beat}#${i + 1}`); if (r && r.status !== 'clean_fold') eligible.add(i); });
  const {per, orphan} = assignScene(scene, eligible);
  const cards = [], gaps = [];
  for (const i of eligible) {
    const id = `${scene.beat}#${i + 1}`, step = steps[i], row = rowsByStep.get(id), a = per[i];
    const stepOwn = [...(step.outputs || []), ...(step.gains || [])].length > 0;
    const reasons = [];
    if (!a.outcomes.length && !a.knowledge.length && !stepOwn) reasons.push('missing outcomes');
    if (!scene.place) reasons.push('missing place');
    if (!hasTime(scene)) reasons.push('missing time');
    if (reasons.length) { gaps.push({stepId: id, scene: scene.beat, reasons}); continue; }
    const k = kindOf(step);
    cards.push({schema: 'event-card/1', id: `card:${id}`, stepId: id, scene: scene.beat, threadId, verb: step.verb, object: step.object ?? null, class: step.class ?? null,
      kind: k.kind, kindWeak: k.weak || undefined, actor: scene.pov && scene.pov !== 'lead' ? scene.pov : 'lead',
      place: scene.place, packPlaceId: row?.packPlaceId ?? null, present: scene.present || [],
      time: {date: scene.date ? {anchor: scene.date.anchor ?? null, offsetDays: scene.date.offsetDays ?? null, value: scene.date.value ?? null, label: scene.date.label ?? null} : null,
        timeOfDay: scene.timeOfDay?.value ?? null, precision: scene.timeOfDay?.precision ?? null},
      order: {sceneOrder: scene.order ?? null, step: i + 1, steps: steps.length},
      inputs: step.inputs || [], outputs: step.outputs || [], gains: step.gains || [], requires: step.requires || [],
      effects: [...a.outcomes.map(o => ({type: 'fact', key: o.fact, value: o.value ?? null, class: o.class ?? null})), ...a.knowledge.map(n => ({type: 'knowledge', fact: n.fact, change: n.change, from: n.from ?? null, locator: n.locator ?? null}))],
      choices: a.choices.map(c => ({taken: c.taken, options: c.options || []})), lockedOptions: row?.lockedOptions || [],
      evidence: (scene.evidence || []).map(e => e.locator).filter(Boolean).slice(0, 6), source: 'script'});
  }
  return {cards, gaps, orphan: !!(orphan.outcomes.length || orphan.knowledge.length || orphan.choices.length) ? {scene: scene.beat, outcomes: orphan.outcomes.length, knowledge: orphan.knowledge.length, choices: orphan.choices.length} : null};
}

export function buildEventCards(scenes, mappings, {maxChapter = 24} = {}) {
  const rows = new Map(); for (const m of mappings) for (const r of m.rows || []) if (!rows.has(r.id)) rows.set(r.id, r);
  const cards = [], gaps = [], orphans = []; let scenesSeen = 0;
  const inScope = scenes.filter(s => inVolumeOneChapters(s, maxChapter) && s.pov === 'lead');
  const {threads, threadOfScene, edges} = buildThreads(inScope);
  for (const scene of inScope) {
    const r = buildSceneCards(scene, rows, threadOfScene.get(scene.beat)); if (!r.cards.length && !r.gaps.length) continue;
    scenesSeen++; cards.push(...r.cards); gaps.push(...r.gaps); if (r.orphan) orphans.push(r.orphan);
  }
  const reasons = {}; for (const g of gaps) for (const x of g.reasons) reasons[x] = (reasons[x] || 0) + 1;
  return {cards, gaps, orphans, threads, inScope, summary: {scenes: scenesSeen, cards: cards.length, gaps: gaps.length, gapReasons: reasons, scenesWithOrphanedSceneData: orphans.length, threads: threads.length, multiBeatThreads: threads.filter(t => t.size > 1).length, threadLinks: edges}};
}

const readJsonl = f => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
function main(args) {
  const get = (k, req = true) => { const i = args.indexOf(k); if (i < 0 || !args[i + 1]) { if (req) throw Error(`Missing ${k}`); return null; } return args[i + 1]; };
  const dir = get('--mappings');
  const mappings = fs.readdirSync(dir).filter(f => /^v\d+-ch\d+-\d+\.json$/.test(f)).sort().map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  const result = buildEventCards(readJsonl(get('--scenes')), mappings, {maxChapter: Number(get('--max-chapter', false) || 24)});
  const out = get('--out'); fs.mkdirSync(path.dirname(out), {recursive: true});
  fs.writeFileSync(out, result.cards.map(c => JSON.stringify(c)).join('\n') + '\n');
  fs.writeFileSync(out.replace(/\.jsonl$/, '_threads.jsonl'), result.threads.map(t => JSON.stringify(t)).join('\n') + '\n');
  fs.writeFileSync(out.replace(/\.jsonl$/, '_gaps.jsonl'), result.gaps.map(g => JSON.stringify(g)).join('\n') + '\n');
  console.log(JSON.stringify(result.summary));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
