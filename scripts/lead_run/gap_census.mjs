#!/usr/bin/env node
// CLR3: private-caller census for replay mappings; emit no source text or identifiers.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const readMapping = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ') || '(missing verb)';
const reasonFor = row => {
  if (!String(row.verb || '').trim()) return 'missing verb';
  if (/\b(walk\w*|stroll\w*|wander\w*|travel\w*|move\w*|go to|arrive\w*)\b/i.test(row.verb) && !row.packPlaceId) return 'missing place/person';
  if (/\b(talk\w*|speak\w*|ask\w*|tell\w*|answer\w*|discuss\w*|greet\w*|repl\w*|say\w*|said|chat\w*|convers\w*|meet\w*)\b/i.test(row.verb) && !(row.peopleResolved || []).some(person => person.packId)) return 'missing place/person';
  return 'missing UI path';
};
const increment = (record, key, amount = 1) => { record[key] = (record[key] || 0) + amount; };

export function buildGapCensus(mappings, failures = []) {
  const byClass = new Map(), byVolume = new Map(), reasons = {'missing verb':0,'missing place/person':0,'missing UI path':0};
  const seenRows = new Set();
  let totalSteps = 0, totalGaps = 0, duplicateRowsOmitted = 0;
  for (const mapping of mappings) for (const row of mapping.rows || []) {
    const identity = row.id || `${row.scene || ''}#${row.verb || ''}#${row.sourceVolume || ''}`;
    if (seenRows.has(identity)) { duplicateRowsOmitted++; continue; }
    seenRows.add(identity);
    totalSteps++;
    if (row.status !== 'gap' && row.status !== 'lossy_fold') continue;
    totalGaps++;
    const className = row.class || 'unknown', volume = row.sourceVolume ?? 'unknown';
    const classData = byClass.get(className) || {steps:0,phrases:new Map(),reasons:{'missing verb':0,'missing place/person':0,'missing UI path':0}};
    classData.steps++;
    const phrase = normalize(row.verb);
    classData.phrases.set(phrase, (classData.phrases.get(phrase) || 0) + 1);
    const reason = reasonFor(row);
    classData.reasons[reason]++;
    byClass.set(className, classData);
    const volumeData = byVolume.get(volume) || {steps:0,classes:{}};
    volumeData.steps++;
    increment(volumeData.classes, className);
    byVolume.set(volume, volumeData);
    reasons[reason]++;
  }
  const classes = [...byClass].map(([className, data]) => ({class:className,steps:data.steps,share:totalGaps ? data.steps/totalGaps : 0,
    reasons:data.reasons,topVerbPhrases:[...data.phrases].map(([phrase,count])=>({phrase,count})).sort((a,b)=>b.count-a.count||a.phrase.localeCompare(b.phrase)).slice(0,40)}))
    .sort((a,b)=>b.steps-a.steps||a.class.localeCompare(b.class));
  return {schema:'lead-gap-census/1',totalSteps,totalGaps,duplicateRowsOmitted,gapsByClass:classes,
    gapsByVolume:[...byVolume].sort((a,b)=>String(a[0]).localeCompare(String(b[0]),undefined,{numeric:true})).map(([volume,data])=>({volume,gaps:data.steps,byClass:data.classes})),
    reasonSplit:reasons,rangeFailures:failures};
}

function main(args) {
  const arg = name => { const i=args.indexOf(name); return i < 0 ? null : args[i+1]; };
  const dir=arg('--mappings'), output=arg('--out');
  if (!dir || !output) throw Error('Usage: gap_census.mjs --mappings <private-dir> --out <private-census.json> [--failures <json>]');
  const files=fs.readdirSync(dir).filter(file=>/^v\d+-ch\d+-\d+\.json$/.test(file)).sort().map(file=>path.join(dir,file));
  if (!files.length) throw Error(`No mapping JSON files found in ${dir}`);
  const mappings=files.map(readMapping);
  const failurePath=arg('--failures');
  const failures=failurePath ? JSON.parse(fs.readFileSync(failurePath,'utf8')) : [];
  const census=buildGapCensus(mappings,failures);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,JSON.stringify(census,null,2)+'\n');
  console.log(JSON.stringify({files:files.length,totalSteps:census.totalSteps,totalGaps:census.totalGaps,duplicateRowsOmitted:census.duplicateRowsOmitted,
    gapsByClass:census.gapsByClass.map(({class:className,steps,share})=>({class:className,steps,share})),
    gapsByVolume:census.gapsByVolume.map(({volume,gaps})=>({volume,gaps})),reasonSplit:census.reasonSplit,rangeFailures:failures.length},null,2));
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main(process.argv.slice(2));
