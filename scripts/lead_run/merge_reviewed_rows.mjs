#!/usr/bin/env node
// CLR1/CLR3: ingest private, paragraph-reviewed records without publishing canon data.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineDivinations} from '../../src/cast_divination_adapter.js';
import {defineCastMaking} from '../../src/cast_making_adapter.js';
import {defineInferences} from '../../src/cast_inference_adapter.js';
import {defineTopicTalks} from '../../src/cast_topic_talk.js';
import {defineJourneys} from '../../src/cast_journeys.js';
import {definePlaceActs} from '../../src/place_acts.js';
import {createSimulationRegistry,jsonData,validatePredicate} from '../../src/simulation_contracts.js';
import {validateLotmCast} from '../../src/book_world_lotm_cast.js';

const readJsonl = file => fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const clone = value => structuredClone(value);
function assertJsonSafe(value, at='$') {
  if (value === undefined) throw Error(`Undefined value at ${at}`);
  if (typeof value === 'number' && !Number.isFinite(value)) throw Error(`Non-finite number at ${at}`);
  if (Array.isArray(value)) value.forEach((item,index)=>assertJsonSafe(item,`${at}[${index}]`));
  else if (value && typeof value === 'object') for (const [key,item] of Object.entries(value)) {
    if (key==='requires' && Array.isArray(item) && !item.length) throw Error(`Empty requires at ${at}`);
    assertJsonSafe(item,`${at}.${key}`);
  }
}
// Row evidence wins over a gap; equal verdicts use the later input file.
export function resolveReviewedRows(reviewedSets) {
  const byStep=new Map(); let conflicts=0, duplicates=0;
  for (const [shard,lines] of reviewedSets.entries()) for (const line of lines) {
    if (!line?.stepId || !['row','gap'].includes(line.verdict)) throw Error('Malformed reviewed line: verdict and stepId are required.');
    const prior=byStep.get(line.stepId);
    if (prior) {
      if (JSON.stringify(prior.line)===JSON.stringify(line)) duplicates++;
      else conflicts++;
      if (prior.line.verdict==='row' && line.verdict==='gap') continue;
    }
    byStep.set(line.stepId,{line,shard});
  }
  return {entries:[...byStep.values()],conflicts,duplicates};
}
function collection(pack,kind) {
  if (kind==='topic') return pack.topicTalks ||= {talks:[]}, pack.topicTalks.talks;
  if (kind==='journey') return Array.isArray(pack.journeys) ? pack.journeys : (pack.journeys ||= {journeys:[]}).journeys;
  if (kind==='act') return pack.householdActs ||= {objects:[],acts:[]}, pack.householdActs.acts;
  if (kind==='divination') return (pack.divinations ||= {queries:[]}).queries;
  if (kind==='making') return (pack.making ||= {schema:1,rows:[]}).rows;
  if (kind==='inference') return (pack.inferences ||= {chains:[]}).chains;
  throw Error(`Unsupported reviewed row kind: ${kind}`);
}
function validate(pack) {
  assertJsonSafe(pack,'pack'); jsonData(pack);
  const castErrors=validateLotmCast(pack); if(castErrors.length) throw Error(`Invalid cast pack: ${castErrors.slice(0,8).join('; ')}`);
  const binding={worldId:'book.lotm',group:'book_lotm',situationId:'situation.cast'};
  const talks=defineTopicTalks(pack.topicTalks,binding);
  const journeys=defineJourneys(pack.journeys,binding);
  const acts=definePlaceActs(pack.householdActs,binding);
  const divinations=defineDivinations(pack.divinations,binding),making=defineCastMaking(pack.making,binding),inferences=defineInferences(pack.inferences,binding);
  const definitions=[...talks,...journeys,...acts,...divinations,...making,...inferences];
  for(const definition of definitions){jsonData(definition);validatePredicate(definition.requires);}
  createSimulationRegistry({commands:definitions});
  return {talks:talks.length,journeys:journeys.length,acts:acts.length,divinations:divinations.length,making:making.length,inferences:inferences.length};
}
export function mergeReviewedRows(packInput, reviewedSets) {
  const pack=clone(packInput), added={topic:0,journey:0,act:0,divination:0,making:0,inference:0}, byShard=reviewedSets.map(()=>({topic:0,journey:0,act:0,divination:0,making:0,inference:0,skipped:0}));
  const resolved=resolveReviewedRows(reviewedSets);
  for (const {line,shard} of resolved.entries) {
    if (line.verdict!=='row') continue;
    const rows=collection(pack,line.kind), row=clone(line.row);
    if (!row || typeof row.id!=='string') throw Error(`Reviewed row lacks an id for step ${line.stepId}`);
    if (row.fare===undefined && line.kind==='journey') row.fare=null;
    const allRows=[...pack.topicTalks?.talks||[],...(Array.isArray(pack.journeys)?pack.journeys:pack.journeys?.journeys||[]),...pack.householdActs?.acts||[],...pack.householdActs?.objects||[],...pack.divinations?.queries||[],...pack.making?.rows||[],...pack.inferences?.chains||[]];
    const sameId=allRows.find(existing=>existing.id===row.id);
    if (sameId) {
      if (JSON.stringify(sameId)!==JSON.stringify(row)) throw Error(`ID collision with different content: ${row.id}`);
      byShard[shard].skipped++;
      continue;
    }
    // A paragraph-reviewed disposition supersedes a prior generated row for the
    // same step, including a prior row stored under another kind or ID.
    for (const priorRows of [pack.topicTalks?.talks||[],Array.isArray(pack.journeys)?pack.journeys:pack.journeys?.journeys||[],pack.householdActs?.acts||[],pack.divinations?.queries||[],pack.making?.rows||[],pack.inferences?.chains||[]]) {
      for (let i=priorRows.length-1;i>=0;i--) if (priorRows[i].sourceStepId===line.stepId) priorRows.splice(i,1);
    }
    assertJsonSafe(row,`row.${row.id}`);
    rows.push(row); added[line.kind]++; byShard[shard][line.kind]++;
  }
  return {pack,added,byShard,conflicts:resolved.conflicts,duplicates:resolved.duplicates,validated:validate(pack)};
}
function main(args) {
  const get=key=>{const i=args.indexOf(key);if(i<0||!args[i+1])throw Error(`Missing ${key}`);return args[i+1];};
  const input=JSON.parse(fs.readFileSync(get('--pack'),'utf8'));
  const output=get('--out'), files=[];
  for(let i=0;i<args.length;i++)if(args[i]==='--reviewed'){if(!args[i+1])throw Error('Missing path after --reviewed');files.push(args[++i]);}
  if(!files.length)throw Error('Provide at least one --reviewed file');
  const result=mergeReviewedRows(input,files.map(readJsonl));
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result.pack,null,2)+'\n');
  console.log(JSON.stringify({added:result.added,byShard:Object.fromEntries(files.map((file,i)=>[path.basename(file),result.byShard[i]])),conflicts:result.conflicts,duplicates:result.duplicates,validated:result.validated},null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main(process.argv.slice(2));
