#!/usr/bin/env node
// LSD210, LSD170, LSD185 and the 2026-10-29 reachability decision (LEAD_LIFE_RULES section C): report what the aim measures, from mapping files and scenes,
// with no model call and no browser. Step-order fidelity stays a diagnostic. Two measures need a replay or a pull-0 run and print as not measured.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inVolumeOneChapters} from './build_event_cards.mjs';
import {threadReport} from './build_event_threads.mjs';

const share = (n, d) => d ? Math.round(1000 * n / d) / 1000 : null;
const REACHED = new Set(['clean_fold']);

export function replayMetrics(mappings, scenes = [], {cardStepIds = null, gapStepIds = null, maxChapter = null} = {}) {
  const weight = new Map(scenes.map(s => [s.beat, s.weight || 'unknown']));
  const seen = new Set(), rows = [];
  const sceneById = new Map(scenes.map(s => [s.beat, s]));
  for (const m of mappings) for (const r of m.rows || []) { const id = r.id || `${r.scene}#${r.verb}`; if (seen.has(id)) continue; seen.add(id); if (maxChapter != null && !inVolumeOneChapters(sceneById.get(r.scene), maxChapter)) continue; rows.push(r); }
  const great = rows.filter(r => weight.get(r.scene) === 'great');
  const reached = rows.filter(r => REACHED.has(r.status));
  const sceneState = new Map();
  for (const r of rows) { const s = sceneState.get(r.scene) || {steps: 0, reached: 0}; s.steps++; if (REACHED.has(r.status)) s.reached++; sceneState.set(r.scene, s); }
  const greatScenes = [...sceneState.entries()].filter(([id]) => weight.get(id) === 'great');
  const byVolume = {};
  for (const r of rows) { const v = byVolume[r.sourceVolume ?? 'unknown'] ||= {steps: 0, reached: 0, greatSteps: 0, greatReached: 0}; v.steps++; if (REACHED.has(r.status)) v.reached++; if (weight.get(r.scene) === 'great') { v.greatSteps++; if (REACHED.has(r.status)) v.greatReached++; } }
  for (const v of Object.values(byVolume)) { v.reachableShare = share(v.reached, v.steps); v.playableShareGreat = share(v.greatReached, v.greatSteps); }
  const verbs = new Set(reached.map(r => r.canonicalControl).filter(Boolean));
  const kinds = {}; for (const r of reached) kinds[r.controlKind || 'unlabelled'] = (kinds[r.controlKind || 'unlabelled'] || 0) + 1;
  return {
    steps: rows.length,
    reachableShare: share(reached.length, rows.length),
    // Cards (LSD182) are not built, so a reachable step is a playable one today.
    playableShareGreatBeats: share(great.filter(r => REACHED.has(r.status)).length, great.length), greatSteps: great.length,
    greatBeatsFullyReached: greatScenes.filter(([, s]) => s.reached === s.steps).length, greatBeats: greatScenes.length,
    foldLossCount: rows.filter(r => r.status === 'lossy_fold').length,
    ...(cardStepIds ? cardMetrics(rows, great, cardStepIds, gapStepIds) : {}),
    distinctControlKinds: Object.keys(kinds).length, controlKinds: kinds, distinctControlIds: verbs.size,
    byVolume,
    notMeasured: {beatsReachedInOrder: 'needs the replay driver run (LSD185)', emergentCanonRate: 'needs a pull-0 run across seeds (LSD236); no pull input exists yet'},
  };
}

/** Reachable means a control or a card (LSD167); playable stays controls only. Steps the card builder left as gaps are the CLR6 fold-loss list. */
function cardMetrics(rows, great, cardStepIds, gapStepIds) {
  const viaCard = r => !REACHED.has(r.status) && cardStepIds.has(r.id);
  const cardCount = rows.filter(viaCard).length;
  return {cardSteps: cardCount, reachableWithCardsShare: share(rows.filter(r => REACHED.has(r.status) || viaCard(r)).length, rows.length),
    reachableWithCardsGreatShare: share(great.filter(r => REACHED.has(r.status) || viaCard(r)).length, great.length),
    cardGapSteps: gapStepIds ? rows.filter(r => gapStepIds.has(r.id)).length : null,
    stepsWithNeitherControlNorCard: rows.filter(r => !REACHED.has(r.status) && !viaCard(r)).length};
}

/** LSD170: family counts per volume from a gap census (all segments). */
export function familyByVolume(census) {
  const table = {};
  for (const seg of Object.values(census.segments || {})) for (const [vol, v] of Object.entries(seg.volumes || {})) for (const [family, n] of Object.entries(v.families || {})) { (table[family] ||= {})[vol] = (table[family][vol] || 0) + n; }
  return Object.entries(table).map(([family, vols]) => ({family, total: Object.values(vols).reduce((a, b) => a + b, 0), volumes: vols})).sort((a, b) => b.total - a.total);
}

function main(args) {
  const get = (k, req = true) => { const i = args.indexOf(k); if (i < 0 || !args[i + 1]) { if (req) throw Error(`Missing ${k}`); return null; } return args[i + 1]; };
  const dir = get('--mappings');
  const files = fs.readdirSync(dir).filter(f => /^v\d+-ch\d+-\d+\.json$/.test(f)).sort().map(f => path.join(dir, f));
  if (!files.length) throw Error(`No mapping files in ${dir}`);
  const scenesFile = get('--scenes', false);
  const scenes = scenesFile ? fs.readFileSync(scenesFile, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
  const censusFile = get('--census', false);
  const threadsFile = get('--threads', false), cardsFile = get('--cards', false), maxChapter = get('--max-chapter', false);
  const readIds = f => new Set(fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)).map(r => r.stepId));
  const gapsFile = cardsFile && cardsFile.replace(/\.jsonl$/, '_gaps.jsonl');
  const report = {metrics: replayMetrics(files.map(f => JSON.parse(fs.readFileSync(f, 'utf8'))), scenes, {cardStepIds: cardsFile ? readIds(cardsFile) : null, gapStepIds: gapsFile && fs.existsSync(gapsFile) ? readIds(gapsFile) : null, maxChapter: maxChapter ? Number(maxChapter) : null}), familyByVolume: censusFile ? familyByVolume(JSON.parse(fs.readFileSync(censusFile, 'utf8'))) : null};
  if (threadsFile && cardsFile) {
    const readAll = f => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
    const threads = readAll(threadsFile), cards = readAll(cardsFile), beats = new Set(threads.flatMap(t => t.beats));
    const status = new Map(); for (const f of files) for (const r of JSON.parse(fs.readFileSync(f, 'utf8')).rows || []) if (!status.has(r.id)) status.set(r.id, r.status);
    const rep = threadReport(threads, scenes.filter(s => beats.has(s.beat)), cards, id => status.get(id), new Set(cards.map(c => c.stepId)));
    report.threads = {...rep, rows: undefined, largest: rep.rows.filter(r => r.size > 1).sort((a, b) => b.size - a.size).slice(0, 5).map(r => ({size: r.size, steps: r.steps, missingSteps: r.missingSteps, homeless: r.homeless.length}))};
    report.threadRows = rep.rows;
  }
  const out = get('--out', false); if (out) { fs.mkdirSync(path.dirname(out), {recursive: true}); fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n'); }
  const m = report.metrics; if (report.threads) console.log(JSON.stringify({threads: report.threads}));
  console.log(JSON.stringify({steps: m.steps, reachableShare: m.reachableShare, playableShareGreatBeats: m.playableShareGreatBeats, greatBeatsFullyReached: `${m.greatBeatsFullyReached}/${m.greatBeats}`, foldLossCount: m.foldLossCount, distinctControlKinds: m.distinctControlKinds, controlKinds: m.controlKinds, cardSteps: m.cardSteps, reachableWithCardsShare: m.reachableWithCardsShare, reachableWithCardsGreatShare: m.reachableWithCardsGreatShare, cardGapSteps: m.cardGapSteps, stepsWithNeitherControlNorCard: m.stepsWithNeitherControlNorCard, notMeasured: m.notMeasured}));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
