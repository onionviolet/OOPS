// Staged local adoption evidence. Copies verified structured artifacts, never remote/source text.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {copyFileSync,existsSync,mkdirSync,readFileSync,writeFileSync,openSync,readSync,closeSync,statSync} from 'node:fs';
import {basename,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {readLibrary,registeredBooks} from './library-reading.mjs';
import {readBatchOutputs} from './batch-output-index.mjs';
import {readOutputRecords} from './output-records.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const stage=join(root,'work/atlas-archive-scale-20261125'),stageRoot=join(stage,'reader-root');
const manifestDir=join(root,'docs/research/novels/archive-restore-2026-11-25/private');
const manifestNames=process.argv.slice(2);
assert(manifestNames.length,'Pass completed DIRECTORY_<id>.json manifest names.');
function hash(file){const fd=openSync(file,'r'),buffer=Buffer.allocUnsafe(65536),h=createHash('sha256');try{let n;while((n=readSync(fd,buffer,0,buffer.length,null)))h.update(buffer.subarray(0,n));}finally{closeSync(fd);}return h.digest('hex');}
const copied=[],keys=new Set();let bytes=0,files=0;
for(const name of manifestNames){
 assert(/^DIRECTORY_[a-f0-9]+\.json$/.test(name));
 const manifestFile=join(manifestDir,name),m=JSON.parse(readFileSync(manifestFile,'utf8'));
 assert.equal(m.status,'verified');assert.equal(m.rawPreparedSourceTransferred,false);
 const rel=m.registeredDirs[0],source=resolve(root,rel),target=resolve(stageRoot,rel);
 assert(source.startsWith(root));assert(target.startsWith(stageRoot));mkdirSync(target,{recursive:true});
 for(const f of m.files){
  assert.equal(basename(f.name),f.name);assert(!f.name.endsWith('.txt'),'no fabricated prepared source');
  const from=join(source,f.name),to=join(target,f.name);
  assert.equal(statSync(from).size,f.bytes);assert.equal(hash(from),f.sha256);
  if(existsSync(to))assert.equal(hash(to),f.sha256);else copyFileSync(from,to);
  assert.equal(hash(to),f.sha256);files++;bytes+=f.bytes;
 }
 m.keys.forEach(key=>keys.add(key));copied.push({manifest:name,manifestSha256:hash(manifestFile),files:m.files.length,bytes:m.bytes});
}
const prior=process.env.ATLAS_READER_ROOT;process.env.ATLAS_READER_ROOT=stageRoot;
const books=registeredBooks().filter(book=>keys.has(book.key));
const registry=join(stage,'registry.json');writeFileSync(registry,JSON.stringify({books}));
const start=performance.now(),library=readLibrary(books),libraryMs=performance.now()-start;
assert(library.keys.every(k=>k.shards===0&&!k.complete),'outputs do not become prepared source or complete coverage');
const outDir=join(stage,'readers'),buildStart=performance.now();
const matrix=JSON.parse(execFileSync(process.execPath,['prototypes/world-atlas/reader-findings.mjs','--out-dir',outDir,'--registry',registry],
 {cwd:root,encoding:'utf8',maxBuffer:16*1024*1024,windowsHide:true,env:{...process.env,ATLAS_READER_ROOT:stageRoot}}));
const buildMs=performance.now()-buildStart,worlds=[];
for(const world of [...new Set(books.map(book=>book.world))]){
 const digest=JSON.parse(readFileSync(join(outDir,world+'.json'),'utf8')),samples=[];
 for(const book of books.filter(book=>book.world===world)){
  const t=performance.now(),inventory=readBatchOutputs(book,{registry:books});
  const candidates=[...inventory.shards,...inventory.legacy.shards,...inventory.orphans.shards];
  for(const shard of candidates){const pass=shard.passes.find(p=>p.outputs.some(o=>o.collected&&o.status==='collected'));if(!pass)continue;
   const kind=pass.outputs.find(o=>o.collected&&o.status==='collected').kind;
   const page=readOutputRecords(book,{prefix:shard.prefix,pass:pass.pass,kind},{registry:books,digest});
   if(page.inspected&&page.total){samples.push({key:book.key,prefix:shard.prefix,pass:pass.pass,kind,scope:page.scope,contentHash:page.contentHash,matched:page.counts.matchedRows,records:page.total});break;}
  }
  if(samples.length){samples.at(-1).inventoryMs=performance.now()-t;break;}
 }
 assert(samples.length,'public admitted sample available: '+world);
 worlds.push({world,shards:digest.shards,prepared:digest.planned,orphans:digest.orphanSlices,historic:digest.extraSlices,
  entities:digest.entities.length,rules:digest.rules.length,scenes:digest.scenes.length,
  digestBytes:statSync(join(outDir,world+'.json')).size,samples});
}
if(prior===undefined)delete process.env.ATLAS_READER_ROOT;else process.env.ATLAS_READER_ROOT=prior;
const result={manifests:copied,files,bytes,books:books.length,worlds,libraryMs,buildMs,buildStats:matrix.buildStats,
 metadata:library.keys.map(k=>({key:k.key,held:k.held,prepared:k.shards,complete:k.complete,observedOutputFiles:k.observedOutputFiles})),
 scope:'staged verified output-only artifacts; no local raw shards or source-text coverage inferred'};
writeFileSync(join(stage,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
