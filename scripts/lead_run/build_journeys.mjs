#!/usr/bin/env node
// CLR1-CLR3: compile source-located travel steps into private pack rows.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildPackJoin} from './build_crosswalk.mjs';
import {shardIndex} from './cite_paragraphs.mjs';
import {parseLocator} from './world_profiles.mjs';
import {compareLocators} from './merge_shards.mjs';
import {FAMILY_RULES} from './gap_census.mjs';

const readJsonl = p => fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const words = s => String(s || '').trim();
const safe = s => String(s).replace(/[^a-zA-Z0-9_.-]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
const locatorKey = locator => {
  const p = parseLocator(locator || '');
  return p ? `${p.book}:${p.ch}:${p.p}` : null;
};
const locate = scene => (scene.evidence || []).map(e=>e.locator).filter(locatorKey).sort(compareLocators)[0] || null;
const integer = n => Number.isSafeInteger(n) && n > 0;
function travelFamily(step) {
  const verb=String(step.verb || '').trim();
  const stripped=FAMILY_RULES.some(rule=>rule.head.test(verb)) ? verb : verb.replace(/^(?:[A-Z][a-z'-]+\s+){1,3}(?=[a-z])/,'');
  const text=`${stripped} ${step.object || ''}`;
  return FAMILY_RULES.find(rule=>rule.head.test(stripped)&&(!rule.object||rule.object.test(text)))?.family || null;
}
const placeRef = (value, join, pack) => {
  if (typeof value !== 'string') return null;
  const resolved = join.resolvePlace(value);
  if (resolved.id) return resolved.id;
  return (pack.places || []).some(p => p.id === value && !p.anchorOnly) ? value : null;
};
function meansFor(step) {
  const text = `${step.verb || ''} ${step.object || ''}`.toLowerCase();
  if (/\b(carriage|cab|taxi|coach|bus|train|tram|trolleybus|subway)\b/.test(text)) return 'land_transport';
  if (/\b(ship|boat|sail|vessel)\b/.test(text)) return 'water_transport';
  if (/\b(teleport|transmit|graft|gate|portal)\b/.test(text)) return 'supernatural_crossing';
  if (/\b(fly|flight)\b/.test(text)) return 'flight';
  if (/\b(walk|stroll|wander|on foot|step|run|climb|descend)\b/.test(text)) return 'on_foot';
  return 'unspecified';
}
function explicitFare(step) {
  if (Number.isSafeInteger(step.fare) && step.fare >= 0) return step.fare;
  for (const input of step.inputs || []) {
    const match=/\b(\d+)\s+(?:copper\s+)?penn(?:y|ies)\s+fare\b/i.exec(String(input));
    if (match) return Number(match[1]);
  }
  return undefined;
}
const placeName = (id, pack) => (pack.places || []).find(p=>p.id===id)?.name || id;
function explicitDestination(step, join, pack) {
  for (const value of [...(step.outputs || []), ...(step.destinations || []), step.to, step.destination]) {
    const id = placeRef(value, join, pack); if (id) return id;
  }
  for (const text of [step.verb || '',step.object || '']) {
    const match = /\b(?:to|into|toward|towards|through|across)\s+(.+?)(?:[,.;]|\s+(?:by|with|while|and)\b|$)/i.exec(text);
    if (match) { const id = placeRef(match[1].trim(), join, pack); if (id) return id; }
  }
  return null;
}
function explicitOrigin(step, join, pack) {
  for (const value of [step.from,step.origin]) { const id=placeRef(value,join,pack); if(id)return id; }
  const match=/\bfrom\s+(.+?)\s+to\b/i.exec(String(step.verb||''));
  return match ? placeRef(match[1].trim(),join,pack) : null;
}
function sourceFor(scene, step, index) {
  const locator = locate(scene), key = locator && locatorKey(locator);
  return locator && key && index.has(key) ? {label:step.label || scene.evidence.find(e=>e.locator===locator)?.label || 'S', locator} : null;
}
export function buildJourneys({scenes, crosswalk, registry, pack, paragraphIndex = new Map()}) {
  const join = buildPackJoin({crosswalk, registry, pack});
  const rows = [], rejectedRows = [], rejected = {notTravel:0, unresolvedSource:0, unclearOrigin:0, unresolvedOrigin:0, unclearDestination:0, unresolvedDestination:0, sameEndpoint:0, duplicate:0};
  const perVolume = {}, familyByVolume = {}, travelSteps = new Set(), stepRows = new Map();
  const ordered = scenes.filter(s => s.pov === 'lead').sort((a,b)=>compareLocators(locate(a),locate(b)) || (a.order||0)-(b.order||0) || String(a.beat).localeCompare(String(b.beat)));
  let previousPlace = null;
  for (const scene of ordered) {
    const scenePlace = placeRef(scene.place, join, pack);
    for (const [i, step] of (scene.steps || []).entries()) {
      const family=travelFamily(step);
      if (!['travel or move','paid transport'].includes(family)) { rejected.notTravel++; continue; }
      const stepId = `${scene.beat}#${i+1}`;
      const reject=(reason,missing=[],otherBlockers=[])=>{rejected[reason]++;rejectedRows.push({stepId,reason,missing,otherBlockers});};
      const vol = Number(/\bb(\d+)\b/.exec(locate(scene) || '')?.[1] || 1);
      familyByVolume[vol] = (familyByVolume[vol] || 0) + 1; travelSteps.add(stepId);
      const source = sourceFor(scene, step, paragraphIndex);
      if (!source) { reject('unresolvedSource',[],['source paragraph']); continue; }
      const to = explicitDestination(step, join, pack) || scenePlace;
      const statedOrigin = explicitOrigin(step,join,pack);
      const from = statedOrigin || previousPlace || scenePlace;
      if (!from) { reject('unclearOrigin',[{kind:'place',value:scene.place||null}],!to?['destination also unresolved']:[]); continue; }
      if (!placeRef(from, join, pack)) { reject('unresolvedOrigin',[{kind:'place',value:from}]); continue; }
      if (!to) { reject('unclearDestination',[{kind:'place',value:scene.place||null}]); continue; }
      if (!placeRef(to, join, pack)) { reject('unresolvedDestination',[{kind:'place',value:to}]); continue; }
      if (from === to) { reject('sameEndpoint',[],['distinct endpoints']); previousPlace = scenePlace || previousPlace; continue; }
      const means = meansFor(step), duration = [step.minutes, step.durationMinutes, step.duration?.minutes].find(integer);
      const fare = explicitFare(step), hours = Array.isArray(step.hours) && step.hours.length === 2 && step.hours.every(Number.isInteger) ? step.hours : null;
      const originBasis=statedOrigin?'step origin':previousPlace?'inference: prior scene place':'inference: current scene place';
      const key = JSON.stringify([from,to,means,duration||1,fare??null,hours]);
      const id = `journey.${safe(stepId)}`;
      if (stepRows.has(stepId)) { rejected.duplicate++; previousPlace = to; continue; }
      const existing=rows.find(r=>r._key===key);
      if (existing) { existing.sourceStepIds.push(stepId); existing.sourceStepOrigins[stepId]=originBasis; stepRows.set(stepId,existing); rejected.duplicate++; previousPlace = to; continue; }
      const fromName=placeName(from,pack), toName=placeName(to,pack), meansLabel=means.replaceAll('_',' ');
      const row = {id, sourceStepId:stepId, sourceStepIds:[stepId], sourceStepOrigins:{[stepId]:originBasis}, from, to, means, originBasis, label:`Travel from ${fromName} to ${toName} by ${meansLabel}`,
        description:`Travel by ${meansLabel} to ${toName}.`, minutes:duration || 1,
        minutesBasis:duration ? 'step duration' : 'fill: one minute because the source gives no duration',
        report:`You arrive at ${toName} by ${meansLabel}.`, source, _key:key};
      if (fare !== undefined) row.fare = fare;
      if (hours) row.hours = hours;
      rows.push(row); stepRows.set(stepId, row); perVolume[vol] = (perVolume[vol] || 0) + 1; previousPlace = to;
    }
    if (scenePlace) previousPlace = scenePlace;
  }
  for (const row of rows) delete row._key;
  return {rows, rejected, rejectedRows, perVolume, familyByVolume, travelSteps:travelSteps.size, mappedSteps:stepRows.size};
}

function main(args) {
  const get = key => { const i=args.indexOf(key); if(i<0||!args[i+1]) throw Error(`Missing ${key}`); return args[i+1]; };
  const scenes=readJsonl(get('--scenes')), registry=readJsonl(get('--registry'));
  const crosswalk=JSON.parse(fs.readFileSync(get('--crosswalk'),'utf8'));
  const input=JSON.parse(fs.readFileSync(get('--pack'),'utf8'));
  const sourceDir=get('--source-dir');
  const result=buildJourneys({scenes,crosswalk,registry,pack:input,paragraphIndex:shardIndex(sourceDir)});
  const pack=structuredClone(input); pack.journeys={journeys:result.rows};
  const out=get('--out'), report=get('--report'); fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(pack,null,2)+'\n');
  fs.writeFileSync(report,JSON.stringify({schema:'journey-build-report/1',...result},null,2)+'\n');
  console.log(JSON.stringify({rows:result.rows.length,perVolume:result.perVolume,familyByVolume:result.familyByVolume,rejected:result.rejected,travelSteps:result.travelSteps,mappedSteps:result.mappedSteps}));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
