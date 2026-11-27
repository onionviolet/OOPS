import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
import {registeredBooks,readerDirectory} from '../../../../prototypes/world-atlas/library-reading.mjs';
import {createBookOutputReader} from '../../../../prototypes/world-atlas/output-records.mjs';
import {lintScenes,lintCensus,summarize} from '../../../../scripts/lead_run/lint_lead_run.mjs';
import {legacyReaderSlices} from '../../../../prototypes/world-atlas/reader-slices.mjs';
const registry=registeredBooks(),entries=[],groups={},stageChecks=[];
const manifestHashes=new Map();for(const name of fs.readdirSync('docs/research/novels/archive-restore-2026-11-25/private').filter(n=>/^DIRECTORY_.*\.jsonl$/.test(n))){for(const line of fs.readFileSync('docs/research/novels/archive-restore-2026-11-25/private/'+name,'utf8').split(/\r?\n/).filter(Boolean)){const row=JSON.parse(line);for(const dest of row.destinations||[])manifestHashes.set(path.resolve(dest.path).toLowerCase(),{sha256:dest.sha256,remoteSha256:row.sha256});}}
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const world of [...new Set(registry.map(b=>b.world))]){
 const report=JSON.parse(fs.readFileSync('work/atlas-snapshot/readiness/'+world+'.json'));
 const wanted=report.followups.files.filter(f=>f.counts.unattested>0);if(!wanted.length)continue;
 const digest=JSON.parse(fs.readFileSync('work/atlas-snapshot/readers/'+world+'.json'));
 for(const key of [...new Set(wanted.map(row=>row.key))]){
  const book=registry.find(b=>b.key===key),directory=readerDirectory(book),names=fs.readdirSync(directory),reader=createBookOutputReader(book,{registry,digest}),legacy=legacyReaderSlices(book,registry,names);
  for(const prefix of [...new Set(wanted.filter(r=>r.key===key).map(r=>r.prefix))])if(legacy.slices.some(s=>s.prefix===prefix)){const read=(stem,kind)=>{const file=path.join(directory,stem+'_'+kind+'.jsonl');return fs.existsSync(file)?fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse):[];};const census=read(prefix+'m','census'),scenes=read(prefix+'m','scenes');stageChecks.push({world,key,prefix,censusRows:census.length,sceneRows:scenes.length,lintWithoutSource:{census:summarize(lintCensus(census,null)),scenes:summarize(lintScenes(scenes))},originalVsMigratedCensusSame:hash(Buffer.from(JSON.stringify(read(prefix,'census'))))===hash(Buffer.from(JSON.stringify(census)))});}
  for(const row of wanted.filter(r=>r.key===key)){
   const selected=reader.selected(row.prefix,row.pass,row.kind),page=reader.read({...row,size:1}),stage=legacy.slices.find(r=>r.prefix===row.prefix);
   const inputs=(page.scope==='orphan'?digest.orphanInputs:digest.legacyInputs)||[],att=inputs.find(i=>i.key===key&&i.prefix===row.prefix&&i.pass===row.pass&&i.kind===row.kind&&i.source===selected.source);
   const bytes=fs.readFileSync(path.join(directory,selected.name));let objects=0,invalidLines=0;for(const line of bytes.toString('utf8').split(/\r?\n/).filter(l=>l.trim()))try{const v=JSON.parse(line);if(!v||typeof v!=='object'||Array.isArray(v))invalidLines++;else objects++;}catch{invalidLines++;}
   const headers=[];for(const lane of [row.prefix,row.prefix+'L'])for(const suffix of ['m_header.json','_header.json'])if(names.includes(lane+suffix)){try{const h=JSON.parse(fs.readFileSync(path.join(directory,lane+suffix),'utf8'));headers.push({lane,migrated:suffix==='m_header.json',schema:h.schema==='shard-header/1.3'?'shard-header/1.3':'other',grade:['A','B','C'].includes(h.grade)?h.grade:null,lint:['pass','fail'].includes(h.lint)?h.lint:null,sourceHashValid:/^(?:[a-f0-9]{16}|[a-f0-9]{64})$/i.test(h.sourceHash||'')});}catch{headers.push({lane,invalid:true});}}
   const reason=selected.partial?'selected-partial':stage?.admitted===false?'stage-not-admitted':!att?'no-digest-file-binding':att.contentHash!=='sha256:'+hash(bytes)?'digest-byte-mismatch':'other';
   const markers=[];for(const marker of [row.prefix+'_'+row.pass+'.partial',row.prefix+'_full.partial'])if(names.includes(marker)){let value;try{value=JSON.parse(fs.readFileSync(path.join(directory,marker),'utf8'));}catch{}markers.push({pass:marker.endsWith('_full.partial')?'full':row.pass,kept:Number.isSafeInteger(value?.kept)?value.kept:null,dropped:Number.isSafeInteger(value?.dropped)?value.dropped:null});}
   const restored=manifestHashes.get(path.resolve(directory,selected.name).toLowerCase());
   const entry={markers,restoredHashMatches:restored?restored.sha256===hash(bytes)&&restored.remoteSha256===hash(bytes):false,world,key,prefix:row.prefix,pass:row.pass,kind:row.kind,scope:page.scope,source:selected.source,partial:selected.partial,reason,stage:stage?{family:stage.family,grade:stage.grade,gradingStatus:stage.gradingStatus,admitted:stage.admitted,chapters:stage.chapters}:null,headers,bytes:bytes.length,sha256:hash(bytes),objects,invalidLines,digestFileBinding:Boolean(att),digestHashMatches:att?att.contentHash==='sha256:'+hash(bytes):null,inspected:page.inspected,readErrors:page.counts.readFailures};entries.push(entry);const group=world+'/'+row.pass+'/'+reason;groups[group]=(groups[group]||0)+1;
  }
 }
}
const result={schema:'atlas-unattested-count-audit/1',snapshotSha256:hash(fs.readFileSync('work/atlas-snapshot/snapshot.json')),measurementProofSha256:hash(fs.readFileSync('docs/representations/evidence/atlas-reader-visual-2026-11-25/all-world-readiness-followups-result.json')),total:entries.length,groups,stageChecks,entries,note:'Metadata/byte validation only; no source prose, fresh chapter reading, method attestation or gate change.'};
if(entries.some(e=>!e.restoredHashMatches))throw Error('Restore manifest identity mismatch');
if(entries.length!==75||entries.some(e=>e.inspected||e.readErrors))throw Error('Baseline mismatch');
fs.writeFileSync('docs/representations/evidence/atlas-reader-visual-2026-11-25/reading-unattested-audit.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({total:entries.length,groups,stages:[...new Set(entries.filter(e=>e.stage).map(e=>JSON.stringify(e.stage)))],invalidFiles:entries.filter(e=>e.invalidLines).map(({world,key,prefix,pass,kind,invalidLines})=>({world,key,prefix,pass,kind,invalidLines}))}));

