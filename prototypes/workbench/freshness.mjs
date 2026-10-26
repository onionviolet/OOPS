import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname,sep} from 'node:path';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
// Source currency and visual fidelity are independent. Matching bytes cannot
// turn an archived study or a simplified shell into the current interface.
export async function studyFreshness(study,{workbench,repository}) {
 const fidelity=study.fidelity||'unverified';
 if(fidelity==='archived')return {id:study.id,fidelity,status:'archived',message:'Archived pinned study · not the current game UI'};
 try {
  const manifest=JSON.parse(await readFile(resolve(workbench,dirname(study.entry),'INPUTS.json'),'utf8'));
  const sources=Object.entries(manifest.sourceHashes||{}),outputs=Object.entries(manifest.outputHashes||{});
  if(!sources.length||!outputs.length)return {id:study.id,fidelity,status:'unverified',message:'Input/output identity missing · freshness unverified'};
  const changed=[];
  for(const [base,entries,kind]of [[repository,sources,'source'],[resolve(workbench,dirname(study.entry)),outputs,'build']])for(const [file,expected]of entries){
   const path=resolve(base,file);
   if(!path.startsWith(resolve(base)+sep))throw Error('Manifest path escapes its root');
   try{if(hash(await readFile(path))!==expected)changed.push(`${kind}: ${file}`);}catch{changed.push(`${kind} missing: ${file}`);}
  }
  return {id:study.id,fidelity,status:changed.length?'stale':'matching',changed,message:changed.length?'Sources/build changed · rebuild and recheck before comparison':fidelity==='sketch'?'Inputs match · simplified sketch, not current-shell UI proof':'Inputs match · native-shell study; see its route and limits'};
 }catch{return {id:study.id,fidelity,status:'unverified',message:'Build manifest unavailable · freshness unverified'};}
}
export async function workbenchFreshness(workbench,repository) {
 const studies=JSON.parse(await readFile(resolve(workbench,'experiments.json'),'utf8'));
 return {checkedAt:new Date().toISOString(),studies:await Promise.all(studies.map(study=>studyFreshness(study,{workbench,repository})))};
}
