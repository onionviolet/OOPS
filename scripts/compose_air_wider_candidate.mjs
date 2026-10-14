// Selective authoring tool for MIT YAIRPG Air snapshots. No private prose is
// embedded here. Source: wider-gameplay snapshot under the MacTransferArchive.
// Copyright (c) 2021 Miktaew; see LICENSE. Output must stay in private_packs.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {compileStructuredPack} from '../src/structured_pack_definitions.js';
const copy=v=>structuredClone(v),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const assert=(v,message)=>{if(!v)throw Error(message);};
const effectKey=e=>JSON.stringify([e.type,e.actor||'player',e.key||e.id||e.sourceId||e.energyId||e.containerId,e.operation]);
const omitFact=(r,key)=>{if(!r)return r;if(r.fact===key)return {all:[]};const out=copy(r);for(const k of ['all','any'])if(out[k])out[k]=out[k].map(x=>omitFact(x,key));if(out.not)out.not=omitFact(out.not,key);return out;};
export function composeWiderCandidate({pro,wider,id}){
 assert(pro.schema===2&&wider.schema===2&&pro.id===wider.id&&typeof id==='string'&&id!==pro.id,'Candidate requires a separate identity.');
 const d=copy(pro),origin=pro.id,added=[],variants=[];
 const roleIds=new Set(wider.expeditions.flatMap(s=>[s.prepareId,s.enterId,...s.approaches,s.retreatId,s.extractId,s.treatmentId]));
 const abilityIds=new Set(wider.abilities.map(a=>a.commandId));
 // Select the wider outing closure; lethal content remains in read-only history.
 const extra=wider.simulation.commands.filter(c=>!pro.simulation.commands.some(p=>p.id===c.id)&&!c.effects?.some(e=>e.type==='life'));
 for(const c of extra){d.simulation.commands.push(copy(c));added.push(c.id);}
 // Shared source-acquisition producers become explicit alternatives; baseline
 // rows retain all current command/start/container support and behavior.
 for(const c of wider.simulation.commands){
  if(!c.effects?.some(e=>e.type==='source'&&wider.abilities.some(a=>a.sourceId===e.sourceId))||!pro.simulation.commands.some(p=>p.id===c.id))continue;
  const v=copy(pro.simulation.commands.find(p=>p.id===c.id));
  for(const e of c.effects.filter(e=>e.type==='source'))if(!v.effects.some(x=>same(x,e)))v.effects.push(copy(e));
  v.id=c.id+'.air_variant';v.label=v.label+' (proposed method variant)';d.simulation.commands.push(v);variants.push({source:c.id,candidate:v.id});
 }
 for(const family of ['sources','items','locations','units'])for(const row of wider[family]||[])if(!d[family]?.some(r=>r.id===row.id)){(d[family]??=[]).push(copy(row));}
 for(const family of Object.keys(wider.simulation).filter(k=>k!=='commands'&&k!=='containers')){
  if(!Array.isArray(wider.simulation[family]))continue;
  for(const row of wider.simulation[family])if(!d.simulation[family]?.some(r=>r.id===row.id))(d.simulation[family]??=[]).push(copy(row));
 }
 // Extend the current container's object declarations only, preserving every
 // existing access, preparation, capacity, timer and deferred-object contract.
 for(const c of wider.simulation.containers||[]){const current=d.simulation.containers.find(x=>x.id===c.id);assert(current,'Missing current container owner.');for(const o of c.objects)if(!current.objects.some(x=>x.unitId===o.unitId))current.objects.push(copy(o));}
 const supplement=wider.starts.map(start=>{const baseline=pro.starts.find(s=>s.id===start.id);assert(baseline,'No inferred migration for unrelated starts.');return start.effects.filter(e=>!baseline.effects.some(x=>effectKey(x)===effectKey(e)));});
 assert(supplement.every(s=>same(s,supplement[0])),'Start-specific wider supplements need explicit reconciliation.');
 const permitted=new Set(['fact','resource','item','claim']);
 for(const start of d.starts){
  assert(supplement[0].every(e=>permitted.has(e.type)&&!start.effects.some(x=>effectKey(x)===effectKey(e))),'Supplement must not overwrite current body/source/energy/start state.');
  const prepareAt=start.effects.findIndex(e=>e.type==='container'&&['prepare','install'].includes(e.operation));
  start.effects.splice(prepareAt<0?start.effects.length:prepareAt,0,...copy(supplement[0]));
 }
 for(const status of wider.presentation.status)if(!d.presentation.status.some(s=>s.id===status.id))d.presentation.status.push(copy(status));
 d.abilities=copy(wider.abilities);d.expeditions=copy(wider.expeditions);for(const site of d.expeditions)delete site.lethalId;
 // Seven once tags are handled individually, rather than removed as a class.
 const decisions=[];
 for(const c of d.simulation.commands.filter(c=>added.includes(c.id))){
  if(c.id===origin+'.issue_site_case'){delete c.once;decisions.push([c.id,'actual finite stock and one current custody loan']);}
  else if(c.id===origin+'.return_site_case'){delete c.once;c.effects.push({type:'fact',scope:'actor',key:origin+'.site_cargo_issued',value:false});decisions.push([c.id,'actual custody return permits another legitimate loan']);}
  else if(c.id===origin+'.extract_site'){delete c.once;delete c.claim;decisions.push([c.id,'phase-scoped repeat settlement']);}
  else if(c.id===origin+'.report_site'){
   assert(c.costs?.some(e=>e.type==='item'&&e.amount<0&&e.key.includes(origin+'.site_receipt')),'Repeat report must consume an actual earned receipt.');delete c.once;c.requires=omitFact(c.requires,'actor.'+origin+'.site_reported');if(c.completionRequires)c.completionRequires=omitFact(c.completionRequires,'actor.'+origin+'.site_reported');decisions.push([c.id,'one settlement per consumed earned receipt']);
  }else if(c.once)decisions.push([c.id,'idempotent finite acquisition or actual custody return']);
 }
 for(const c of d.simulation.commands.filter(c=>roleIds.has(c.id))){c.requires=omitFact(c.requires,'actor.'+origin+'.site_extracted');if(c.completionRequires)c.completionRequires=omitFact(c.completionRequires,'actor.'+origin+'.site_extracted');}
 // Current source/function adapter requires native container access to be
 // immediate. Wider's stored approach already is immediate; keep this guard.
 for(const c of d.simulation.commands.filter(c=>roleIds.has(c.id)||abilityIds.has(c.id)))if(c.duration>0){c.cancellation='refund';c.completionFailure='refund';}
 const rekey=v=>typeof v==='string'?(v===origin?id:v.replaceAll(origin+'.',id+'.')):Array.isArray(v)?v.map(rekey):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[rekey(k),rekey(x)])):v;
 const candidate=rekey(d);candidate.id=id;candidate.revision=1;
 // Full compiler proves actual registered commands carry metadata gates.
 const compiled=compileStructuredPack(candidate);
 for(const a of candidate.abilities)assert(JSON.stringify(compiled.registry.simulation.commands.get(a.commandId).requires).includes(`faculty.${a.sourceId}.active`),'Missing registered held-source gate.');
 for(const site of candidate.expeditions)for(const commandId of [site.prepareId,site.enterId,...site.approaches,site.retreatId,site.extractId,site.treatmentId])assert(JSON.stringify(compiled.registry.simulation.commands.get(commandId).requires).includes(`knowledge.${site.knowledgeKey}.seen`),'Missing registered discovery gate.');
 return {candidate,decisions,variants,added,baselineCommandCount:pro.simulation.commands.length,startIds:candidate.starts.map(s=>s.id)};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const [proPath,widerPath,output,id]=process.argv.slice(2);assert(proPath&&widerPath&&output&&id,'Expected pro, wider, ignored output path, candidate ID.');
 const absolute=path.resolve(output),root=path.resolve('private_packs')+path.sep;assert(absolute.startsWith(root),'Candidate output must remain in the private pack area.');
 const result=composeWiderCandidate({pro:JSON.parse(fs.readFileSync(proPath,'utf8')),wider:JSON.parse(fs.readFileSync(widerPath,'utf8')),id});const bytes=JSON.stringify(result.candidate,null,2)+'\n';fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,bytes);
 // Safe audit output contains IDs/counts/hashes only, no prose or outcome truth.
 console.log(JSON.stringify({id,revision:result.candidate.revision,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),commands:result.candidate.simulation.commands.length,starts:result.startIds,decisions:result.decisions,variants:result.variants,baselineCommandCount:result.baselineCommandCount}));
}
