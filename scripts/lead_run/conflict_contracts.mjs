// CL18: derive sourced conflict contracts from the merged LOTM scene rows.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseLocator} from './world_profiles.mjs';

const read = p => readFileSync(p, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const firstChapter = s => {
  for (const e of s.evidence || []) { const p = parseLocator(e.locator); if (p?.lang === 'zh') return p.ch; }
  return null;
};
export function contractsFor(scenes) {
  const danger = /\b(danger\w*|attack\w*|threat\w*|chase\w*|flight|flee\w*|hid\w*|hide\w*|escap\w*|injur\w*|wound\w*|captur\w*|question\w*|police)\b/i;
  const notConflicts = new Map([
    ['lr.lotm.main.001', 'The scene records discovery and healing of an existing wound; no opposing actor or conflict action occurs.'],
    ['lr.lotm.main.005', 'The hiding verb is concealment of a revolver during an ordinary morning; no confrontation or evasion occurs.'],
    ['lr.lotm.main.306', 'The lead hides a revolver and waits for police who do not arrive; the cited passage records no encounter or pursuit.'],
  ]);
  const paragraphOutcomes = new Map([
    ['lr.lotm.main.306', {fact:'No police enter during the wait', value:'shown', locator:'zh 第11章 p23'}],
    ['lr.lotm.main.402', {fact:'Lead wakes abruptly after the frightening dream', value:'shown', locator:'zh 第12章 p81'}],
  ]);
  return scenes.filter(s => {
    const ch = firstChapter(s);
    return s.pov === 'lead' && ch >= 1 && ch <= 24 &&
      (s.steps?.some(x => x.class === 'fight') ||
        (s.steps || []).some(x => danger.test(x.verb || '')) ||
        (s.outcomes || []).some(x => danger.test(x.verb || '') || danger.test(x.fact || '')) ||
        (s.footprint?.hazards || []).some(x => danger.test(x)));
  }).map(s => {
    const steps=(s.steps || []).map(x=>x.verb).filter(Boolean);
    const people=[...new Set([...(s.present || []),...(s.touched || []).filter(x=>x.kind==='person'&&x.status==='present').map(x=>x.id)])].filter(x=>/\.person\./.test(x));
    const motives=(s.motives || []).map(x=>x.tag).filter(Boolean);
    const hazards=s.footprint?.hazards || [];
    const outcomes=(s.outcomes || []).map(o => ({fact:o.fact,value:o.value,locator:o.locator || null}));
    if(!outcomes.length && paragraphOutcomes.has(s.beat)) outcomes.push(paragraphOutcomes.get(s.beat));
    const unseen=[];
    if(!people.length) unseen.push('sides');
    if(!motives.length) unseen.push('stakes');
    if(!steps.length) unseen.push('means');
    if(!s.place && !(s.footprint?.places || []).length) unseen.push('terrain');
    if(!outcomes.length) unseen.push('outcome');
    const contract={beat:s.beat, sides:people.length?people:null,
    stakes:motives.length?motives:null, means:steps.length?steps:null,
    terrain:s.place || (s.footprint?.places?.length?s.footprint.places:null), outcome:outcomes.length?outcomes:null,
    unseen,
    locators:[...new Set([...(s.evidence || []).map(x=>x.locator),...(s.outcomes || []).map(x=>x.locator),...(paragraphOutcomes.has(s.beat)?[paragraphOutcomes.get(s.beat).locator]:[])].filter(Boolean))]};
    if(notConflicts.has(s.beat)) { contract.notConflict=true; contract.reason=notConflicts.get(s.beat); }
    return contract;
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [dir, out = join(dir, 'conflict_contracts.jsonl')] = process.argv.slice(2);
  if (!dir) throw new Error('usage: conflict_contracts.mjs <mergedDir> [out.jsonl]');
  const rows=contractsFor(read(join(dir,'scenes.jsonl'))); mkdirSync(dirname(out),{recursive:true});
  writeFileSync(out, rows.map(x=>JSON.stringify(x)).join('\n')+(rows.length?'\n':''));
  console.log(`contracts=${rows.length} output=${out}`);
}
