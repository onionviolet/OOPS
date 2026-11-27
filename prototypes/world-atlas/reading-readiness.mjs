// Offline count-only inspection. Never persist source rows, identifiers or paths.
import {createHash} from 'node:crypto';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {createBookOutputReader} from './output-records.mjs';
import {OUTPUT_KINDS} from './batch-output-index.mjs';
import {readerDirectory} from './library-reading.mjs';
import {OUTPUT_FIELD_DESCRIPTORS} from './output-field-coverage.mjs';
export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
// Bind the counting, admission and selection code that produced a stored report.
// Normalize line endings so identical Windows and macOS source yields the same identity.
const calculationFiles = ['reading-readiness','output-records','output-field-coverage','output-method-attestation',
 'batch-output-index','reader-slices','reader-directory','reader-proposals','texture-life',
 '../../scripts/lead_run/batch_lib','../../scripts/lead_run/world_profiles','../../scripts/lead_run/make_book_plans'];
const calculationSha256 = sha(JSON.stringify(calculationFiles.map(name =>
 [name, sha(readFileSync(new URL(name+'.mjs',import.meta.url),'utf8').replace(/\r\n/g,'\n'))])));
const empty=()=>({expected:0,selected:0,inspected:0,missing:0,partial:0,unattested:0,parsedRows:0,matchedRows:0,withheldRows:0,ambiguousRows:0,unindexedRows:0,parseErrors:0,readErrors:0});
const row=def=>({pass:def.pass,kind:def.kind,label:def.label,...empty()});
const add=(target,source)=>{
 for(const key of Object.keys(empty()))target[key]+=source[key];
 if(source.fields){
  target.fieldRows=(target.fieldRows||0)+source.fieldRows;
  target.fields??=source.fields.map(({id,label})=>({id,label,rows:0}));
  for(const field of target.fields)field.rows+=source.fields.find(row=>row.id===field.id)?.rows||0;
 }
};
export const readinessPath=(snapshot,world)=>join(dirname(snapshot),'readiness',world+'.json');
const count=value=>Number.isSafeInteger(value)&&value>=0?value:0;
// The GET boundary projects the known schema again, including tampered local reports.
function publicReport(report,registry){
 const output=(input,def)=>{const result=row(def);for(const key of Object.keys(empty()))result[key]=count(input?.[key]);
  if(input?.fields){const descriptors=OUTPUT_FIELD_DESCRIPTORS.find(r=>r.pass===def.pass&&r.kind===def.kind);result.fieldRows=count(input.fieldRows);
   result.fields=descriptors.fields.map(f=>({id:f.id,label:f.label,rows:count(input.fields.find(r=>r.id===f.id)?.rows)}));}
  return result;};
 const outputs=rows=>OUTPUT_KINDS.map(def=>output(rows?.find(r=>r.pass===def.pass&&r.kind===def.kind),def));
 const binding=Object.fromEntries(['snapshotSha256','digestSha256','selectedBytesSha256','inputStampSha256','calculationSha256'].map(key=>[key,/^[a-f0-9]{64}$/.test(report.binding?.[key])?report.binding[key]:null]));
 return {schema:'atlas-reading-readiness/1',world:report.world,measuredAt:Number.isFinite(Date.parse(report.measuredAt))?new Date(report.measuredAt).toISOString():null,
  followups:{status:report.followups?.schema===1&&Array.isArray(report.followups.files)?'available':'remeasure'},
  scope:report.scope==='world'?'world':'subset',seconds:typeof report.seconds==='number'&&Number.isFinite(report.seconds)?report.seconds:null,binding,
  books:registry.filter(b=>b.world===report.world&&report.books?.some(r=>r.key===b.key)).map(b=>{const r=report.books.find(r=>r.key===b.key);return {key:b.key,prefixes:count(r.prefixes),outputs:outputs(r.outputs)};}),
  outputs:outputs(report.outputs),note:'Counts describe selected outputs and exact admitted matches in the measured snapshot. Field presence is not semantic completeness or proof that every source fact exists.'};
}

// Cheap metadata signature for freshness checks, never a claim about unobserved byte changes.
export function inputStamp(books,registry){
 const stamps=[];
 for(const book of books){const directory=readerDirectory(book),names=existsSync(directory)?readdirSync(directory).sort():[];
  const reader=createBookOutputReader(book,{registry,directory,names});
  for(const prefix of reader.prefixes.sort())for(const def of OUTPUT_KINDS){const selected=reader.selected(prefix,def.pass,def.kind);let stamp=null;
   if(selected.name)try{const s=statSync(join(directory,selected.name));stamp=[s.size,s.mtimeMs,s.ctimeMs];}catch{stamp='unavailable';}
   stamps.push([book.key,prefix,def.pass,def.kind,selected,stamp]);
  }
 }
 return sha(JSON.stringify(stamps));
}

export function measureReadingReadiness({world,registry,digest,snapshotBytes,digestBytes,keys,prefixes,fields=true,readerOptions={}}){
 const started=Date.now(),books=registry.filter(book=>book.world===world&&(!keys||keys.includes(book.key)));
 const outputs=OUTPUT_KINDS.map(row),results=[],bytes=[],followupFiles=[];
 for(const book of books){
  const cache=new Map(),readFile=path=>{if(!cache.has(path))cache.set(path,readFileSync(path));return cache.get(path);};
  const reader=createBookOutputReader(book,{registry,digest,readFile,...readerOptions});
  const selectedPrefixes=reader.prefixes.filter(p=>!prefixes||prefixes.includes(p)).sort();
  const counts=OUTPUT_KINDS.map(row);
  for(const prefix of selectedPrefixes)for(const def of OUTPUT_KINDS){
   const selected=reader.selected(prefix,def.pass,def.kind),page=reader.read({prefix,pass:def.pass,kind:def.kind,size:1});
   const count=counts.find(r=>r.pass===def.pass&&r.kind===def.kind),before={...count};count.expected++;
   count.selected+=Number(!!selected.name);count.inspected+=Number(page.inspected);count.missing+=Number(!selected.name);count.partial+=Number(selected.partial);
   count.unattested+=Number(!!selected.name&&!page.inspected&&!page.counts.readFailures);
   const mapping={fileRows:'parsedRows',matchedRows:'matchedRows',noPublicMatch:'withheldRows',ambiguous:'ambiguousRows',unindexed:'unindexedRows',parseFailures:'parseErrors',readFailures:'readErrors'};
   for(const [from,to]of Object.entries(mapping))count[to]+=page.counts[from]||0;
   if(fields&&page.fieldCoverage){count.fieldRows=(count.fieldRows||0)+page.fieldCoverage.rows;
    count.fields??=OUTPUT_FIELD_DESCRIPTORS.find(r=>r.pass===def.pass&&r.kind===def.kind).fields.map(f=>({id:f.id,label:f.label,rows:0}));
    for(const field of count.fields)field.rows+=page.fieldCoverage.fields.find(f=>f.id===field.id)?.rows||0;
   }
   const fileCounts=Object.fromEntries(Object.keys(empty()).map(key=>[key,count[key]-before[key]]));
   if(followupReasons(fileCounts).length)followupFiles.push({key:book.key,prefix,pass:def.pass,kind:def.kind,counts:Object.fromEntries(Object.entries(fileCounts).filter(([,value])=>value>0))});
   // Bind selected bytes even when the admission boundary refuses to inspect them.
   let hash=null;if(selected.name)try{hash=sha(readFile(join(readerOptions.directory??readerDirectory(book),selected.name)));}catch{hash='unavailable';}
   bytes.push([book.key,prefix,def.pass,def.kind,selected.source,selected.partial,hash]);
   cache.clear();
  }
  results.push({key:book.key,prefixes:selectedPrefixes.length,outputs:counts});
  for(let i=0;i<outputs.length;i++)add(outputs[i],counts[i]);
 }
 return {schema:'atlas-reading-readiness/1',world,measuredAt:new Date().toISOString(),seconds:(Date.now()-started)/1000,
  scope:keys||prefixes?'subset':'world',binding:{calculationSha256,snapshotSha256:sha(snapshotBytes),digestSha256:sha(digestBytes),selectedBytesSha256:sha(JSON.stringify(bytes)),
   inputStampSha256:readerOptions.directory?null:inputStamp(books,registry)},
  followups:{schema:1,files:followupFiles},books:results,outputs,note:'Counts describe selected outputs and exact admitted matches in the measured snapshot. Field presence is not semantic completeness or proof that every source fact exists.'};
}

export function readMeasuredReadiness({world,registry,snapshot,digestFile,file=readinessPath(snapshot,world)}){
 if(!existsSync(file))return {status:'missing',world,note:'No measured aggregate. Run the offline readiness tool for this world.'};
 let report;try{report=JSON.parse(readFileSync(file,'utf8'));}catch{return {status:'invalid',world,note:'The measured aggregate could not be read.'};}
 if(report.schema!=='atlas-reading-readiness/1'||report.world!==world||!report.binding)return {status:'invalid',world,note:'Unsupported measured aggregate.'};
 try{report=publicReport(report,registry);}catch{return {status:'invalid',world,note:'Invalid measured aggregate.'};}
 const stale=[];
 if(report.binding.calculationSha256!==calculationSha256)stale.push('reading-calculation');
 if(!existsSync(snapshot)||sha(readFileSync(snapshot))!==report.binding.snapshotSha256)stale.push('snapshot');
 if(!existsSync(digestFile)||sha(readFileSync(digestFile))!==report.binding.digestSha256)stale.push('world-digest');
 let fileState='not-checked';
 if(report.scope==='world'&&report.binding.inputStampSha256)try{
  fileState=inputStamp(registry.filter(b=>b.world===world),registry)===report.binding.inputStampSha256?'metadata-matches':'metadata-changed';
  if(fileState==='metadata-changed')stale.push('selected-file-metadata');
 }catch{fileState='unavailable';}
 return {status:stale.length?'stale':'measured',world,stale,fileState,report};
}


export const FOLLOWUP_REASONS=Object.freeze(['unindexed','missing','unattested','partial','errors']);
const followupReasons=counts=>FOLLOWUP_REASONS.filter(reason=>reason==='unindexed'?counts.unindexedRows>0:reason==='errors'?counts.parseErrors+counts.readErrors>0:counts[reason]>0);
function safeFollowup(input,world,registry){
 if(!input||typeof input!=='object')return null;
 const book=registry.find(b=>b.world===world&&b.key===input.key);
 if(!book||!/^[a-z0-9_-]+$/.test(book.key)||typeof input.prefix!=='string')return null;
 const canonical=input.prefix.startsWith(book.key+'c')&&/^\d{3,}$/.test(input.prefix.slice(book.key.length+1));
 const sharing=registry.filter(b=>readerDirectory(b)===readerDirectory(book)),owner=sharing[0]?.key===book.key;
 const wave=owner&&/^[a-z]\d+s\d+$/.test(input.prefix);
 const stage=owner&&book.world==='lotm'&&sharing.some(b=>/^lotm[2-8]$/.test(b.key))&&/^(?:s2|s[2-6]r|s[7-9]v)$/.test(input.prefix);
 if(!canonical&&!wave&&!stage||!OUTPUT_KINDS.some(def=>def.pass===input.pass&&def.kind===input.kind))return null;
 const counts=Object.fromEntries(Object.keys(empty()).map(key=>[key,count(input.counts?.[key])]));
 const reasons=followupReasons(counts);if(!reasons.length)return null;
 return {key:book.key,prefix:input.prefix,pass:input.pass,kind:input.kind,counts,reasons,
  route:'#library/outputs/'+[book.key,input.prefix,input.pass,input.kind].map(encodeURIComponent).join('/')};
}
// Read saved count-only file metadata. No source output is opened or reparsed by this query.
export function readReadinessFollowups(options,{reason='unindexed',offset=0,limit=25}={}){
 if(!FOLLOWUP_REASONS.includes(reason)||!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>50)throw Error('Choose a supported reason, nonnegative offset and limit from 1 to 50.');
 const summary=readMeasuredReadiness(options),base={world:options.world,status:summary.status,stale:summary.stale||[],fileState:summary.fileState||'not-checked',reason,offset,limit};
 if(!summary.report)return {...base,availability:summary.status,total:null,files:[],note:summary.note};
 const file=options.file??readinessPath(options.snapshot,options.world);let raw;
 try{raw=JSON.parse(readFileSync(file,'utf8'));}catch{return {...base,availability:'invalid',total:null,files:[],note:'The measured follow-ups could not be read.'};}
 if(raw.followups?.schema!==1||!Array.isArray(raw.followups.files))return {...base,availability:'remeasure',total:null,files:[],note:'This measurement has no per-file follow-ups. Run the offline readiness tool again.'};
 const unique=new Map();for(const input of raw.followups.files){const file=safeFollowup(input,options.world,options.registry);if(file)unique.set(JSON.stringify([file.key,file.prefix,file.pass,file.kind]),file);}
 const files=[...unique.values()].filter(file=>file.reasons.includes(reason));
 files.sort((a,b)=>(reason==='unindexed'?b.counts.unindexedRows-a.counts.unindexedRows:reason==='errors'?(b.counts.parseErrors+b.counts.readErrors)-(a.counts.parseErrors+a.counts.readErrors):0)||a.key.localeCompare(b.key)||a.prefix.localeCompare(b.prefix)||a.pass.localeCompare(b.pass)||a.kind.localeCompare(b.kind));
 return {...base,availability:'available',total:files.length,files:files.slice(offset,offset+limit),note:'Saved measured file counts. Reasons may overlap; withheld-only files are excluded. Counts do not establish reading quality or implemented gameplay.'};
}
