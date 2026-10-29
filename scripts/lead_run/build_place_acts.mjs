#!/usr/bin/env node
// CLR1-CLR3: compile source-located, fixed place acts into private pack rows.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildPackJoin} from './build_crosswalk.mjs';
import {FAMILY_RULES} from './gap_census.mjs';

const readJsonl = p => fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const safe = s => String(s).replace(/[^a-zA-Z0-9_.-]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
const human = s => typeof s === 'string' && s.trim() && !/^(unknown|unstated|unspecified|none|null|u|\?)$/i.test(s.trim());
const TARGET_FAMILIES = new Set(['observe or listen','inspect or investigate','handle or move an item','read a text','rest or personal care','make or write an item','change or maintain state','reason or plan','agree or refuse a proposal']);
const KNOWLEDGE_ONLY = new Set(['observe or listen','inspect or investigate','reason or plan','agree or refuse a proposal']);
const operationFor = (family, text) => {
 if (family === 'handle or move an item') return /\b(put|place|store|hide|pack|close|lock|wear)\w*\b/i.test(text) ? 'store' : 'take';
 if (family === 'rest or personal care') return /\b(wash|bathe|clean)\w*\b/i.test(text) ? 'wash' : 'use';
 if (family === 'make or write an item') return 'use';
 return family === 'observe or listen' || family === 'inspect or investigate' || family === 'read a text' ? 'inspect'
  : family === 'change or maintain state' ? 'use' : null;
};
const objectText = step => {
 const explicit=String(step.object||'').trim(); if(explicit)return explicit;
 const verb=String(step.verb||'').trim();
 const extracted=verb.replace(/^(?:look over|look at|listen to|read|reread|browse|peruse|inspect|investigate|examine|check|search|observe|watch|handle|take|pick up|put away|store|place|hold|carry|rest|sleep|wash|bathe|dress|make|write|prepare|draw|compose|copy|light|clean|repair|open|close|turn on|turn off|extinguish)\s+/i,'').trim();
 return extracted&&extracted!==verb?extracted:null;
};
const placeRef = (value, join, pack) => {
 if (!human(value)) return null;
 const found=join.resolvePlace(value); if(found.id) return found.id;
 return (pack.places||[]).some(p=>p.id===value&&!p.anchorOnly) ? value : null;
};
const volumeOf = scene => Number(/(?:^|\s)b(\d+)\s/.exec(scene.evidence?.find(e=>e.locator)?.locator||'')?.[1]||1);
const duration = step => {
 for(const n of [step.minutes,step.durationMinutes,step.duration?.minutes]) if(Number.isSafeInteger(n)&&n>0) return {minutes:n,basis:'step duration'};
 return {minutes:1,basis:'fill: one minute because the step gives no duration'};
};
function classify(step) {
 const verb=String(step.verb||'').trim();
 const stripped=FAMILY_RULES.some(rule=>rule.head.test(verb))?verb:verb.replace(/^(?:[A-Z][a-z'-]+\s+){1,3}(?=[a-z])/,'');
 const text=`${stripped} ${step.object||''}`;
 const matched=FAMILY_RULES.find(rule=>rule.head.test(stripped)&&(!rule.object||rule.object.test(text)))?.family;
 return TARGET_FAMILIES.has(matched)?matched:null;
}
export function buildPlaceActs({scenes,crosswalk,registry,pack,knowledgeEvidence={}}) {
 const join=buildPackJoin({crosswalk,registry,pack});
 const baseObjects=pack.householdActs?.objects||[], baseActs=pack.householdActs?.acts||[];
 const objects=[...baseObjects], acts=[...baseActs], objectIds=new Map(), actByStep={}, rejectedRows=[],
   rejected={notFamily:0,unresolvedPlace:0,missingObject:0,ambiguousObject:0,unsupportedOperation:0}, familyStepsByVolume={}, rowsByFamily={}, rowsByVolume={}, rowsByFamilyAndVolume={};
 const ordered=scenes.filter(s=>s.pov==='lead').sort((a,b)=>(a.order||0)-(b.order||0));
 for(const scene of ordered) for(const [i,step] of (scene.steps||[]).entries()) {
  const family=classify(step); if(!family){rejected.notFamily++;continue;}
  const volume=volumeOf(scene); familyStepsByVolume[family]=(familyStepsByVolume[family]||0)+1;
  familyStepsByVolume[`${family} · volume ${volume}`]=(familyStepsByVolume[`${family} · volume ${volume}`]||0)+1;
  const stepId=`${scene.beat}#${i+1}`, place=placeRef(scene.place,join,pack), raw=objectText(step);
  const review=knowledgeEvidence[stepId];
  if(KNOWLEDGE_ONLY.has(family) && review && place && typeof review.report==='string' && review.report.trim() &&
    scene.evidence?.some(e=>e.locator===review.locator) && !acts.some(a=>a.sourceStepId===stepId)) {
   const d=duration(step), label=String(step.verb||family).trim().replace(/\s+/g,' ');
   const row={id:`place.act.${safe(stepId)}`,sourceStepId:stepId,operation:'inspect',place,minutes:d.minutes,minutesBasis:d.basis,
    label,description:'Consider what is known here.',report:review.report.trim(),knowledgeKey:`place.act.${safe(stepId)}.result`,
    source:{label:'S',locator:review.locator}};
   acts.push(row);actByStep[stepId]=row.id;
   rowsByFamily[family]=(rowsByFamily[family]||0)+1;rowsByVolume[volume]=(rowsByVolume[volume]||0)+1;
   rowsByFamilyAndVolume[family]||={};rowsByFamilyAndVolume[family][volume]=(rowsByFamilyAndVolume[family][volume]||0)+1;
   continue;
  }
  if(family==='reason or plan'||family==='agree or refuse a proposal'){rejected.notFamily++;continue;}
  const ambiguous=raw && /\b(or|and|various|several|things|something|items)\b/i.test(raw);
  if(!place){rejected.unresolvedPlace++;rejectedRows.push({stepId,reason:'unresolvedPlace',missing:[{kind:'place',value:scene.place||null},...(!raw?[{kind:'object',value:null}]:[])],otherBlockers:ambiguous?['multiple or ambiguous objects']:[]});continue;}
  if(!raw){rejected.missingObject++;rejectedRows.push({stepId,reason:'missingObject',missing:[{kind:'object',value:null}]});continue;}
  // A step must name one concrete object; alternatives and broad collections stay gaps.
  if(ambiguous){rejected.ambiguousObject++;rejectedRows.push({stepId,reason:'ambiguousObject',missing:[{kind:'object',value:raw}],otherBlockers:['multiple or ambiguous objects']});continue;}
  const operation=operationFor(family,`${step.verb||''} ${raw}`); if(!operation){rejected.unsupportedOperation++;continue;}
  const objectKey=`${place}\0${raw.toLowerCase()}`;
  let objectId=objectIds.get(objectKey);
  if(!objectId){
   objectId=`place.object.${safe(place)}.${safe(raw)}`;
   let row=objects.find(o=>o.id===objectId);
   if(!row){row={id:objectId,place,label:raw,facts:{[`place.object.${safe(objectId)}.present`]:true}};objects.push(row);}
   objectIds.set(objectKey,objectId);
  }
  const id=`place.act.${safe(stepId)}`;
  if(acts.some(a=>a.id===id)){rejected.ambiguousObject++;continue;}
  const d=duration(step), label=String(step.verb||family).trim().replace(/\s+/g,' ');
  const source=scene.evidence?.[0]||{};
  const report=`You ${label.toLowerCase()} ${raw}.`;
  const row={id,sourceStepId:stepId,objectId,operation,place,minutes:d.minutes,minutesBasis:d.basis,label,
   description:`${label} ${raw} at this place.`,report,knowledgeKey:`place.act.${safe(stepId)}.result`};
  acts.push(row); actByStep[stepId]=id;
  rowsByFamily[family]=(rowsByFamily[family]||0)+1; rowsByVolume[volume]=(rowsByVolume[volume]||0)+1;
  rowsByFamilyAndVolume[family]||={}; rowsByFamilyAndVolume[family][volume]=(rowsByFamilyAndVolume[family][volume]||0)+1;
 }
 return {data:{objects,acts},actByStep,rejected,rejectedRows,familyStepsByVolume,rowsByFamily,rowsByVolume,rowsByFamilyAndVolume};
}
function main(args){
 const get=k=>{const i=args.indexOf(k);if(i<0||!args[i+1])throw Error(`Missing ${k}`);return args[i+1];};
 const scenes=readJsonl(get('--scenes')),registry=readJsonl(get('--registry'));
 const crosswalk=JSON.parse(fs.readFileSync(get('--crosswalk'),'utf8'));
 const input=JSON.parse(fs.readFileSync(get('--pack'),'utf8'));
 const knowledgeEvidence=args.includes('--knowledge-evidence')?JSON.parse(fs.readFileSync(get('--knowledge-evidence'),'utf8')):{};
 const result=buildPlaceActs({scenes,crosswalk,registry,pack:input,knowledgeEvidence});
 const candidate=structuredClone(input); candidate.householdActs=result.data;
 const out=get('--out'),report=get('--report');fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify(candidate,null,2)+'\n');
 fs.writeFileSync(report,JSON.stringify({schema:'place-act-build-report/2',rowsByFamily:result.rowsByFamily,rowsByVolume:result.rowsByVolume,rowsByFamilyAndVolume:result.rowsByFamilyAndVolume,familyStepsByVolume:result.familyStepsByVolume,rejected:result.rejected,rejectedRows:result.rejectedRows},null,2)+'\n');
 console.log(JSON.stringify({rowsByFamily:result.rowsByFamily,rowsByVolume:result.rowsByVolume,rejected:result.rejected}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main(process.argv.slice(2));
