// Read-only startup measurement over a completed snapshot; never builds one.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {findingsMatrix} from './reader-findings.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const snapshot=resolve(root,process.argv[2]||'work/atlas-adoption-20261125/snapshot.json');
const bytes=readFileSync(snapshot),input=JSON.parse(bytes),sha=value=>createHash('sha256').update(value).digest('hex');
assert.ok(input.findings?.worlds?.length,'Completed findings snapshot required.');
assert.deepEqual(input.failures,[],'Snapshot has failed build parts.');
const expected=[...new Set(JSON.parse(readFileSync(resolve(root,'docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json'),'utf8')).books.map(b=>b.world))];
assert.deepEqual(input.findings.worlds.map(w=>w.world),expected,'Full registry world accounting required.');
const digests=[];
for(const row of input.findings.worlds){
 const file=resolve(dirname(snapshot),'readers',row.world+'.json'),body=readFileSync(file),digest=JSON.parse(body);
 assert.equal(digest.world,row.world);assert.deepEqual(findingsMatrix([digest]).worlds[0],row,'Digest differs from snapshot matrix: '+row.world);
 digests.push({world:row.world,bytes:body.length,sha256:sha(body)});
}
const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'0'};
delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;
let server;try{
 const start=performance.now();server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','pipe']});
 let stderr='';server.stderr.setEncoding('utf8').on('data',s=>stderr+=s);
 const base=await new Promise((ok,fail)=>{
  const timer=setTimeout(()=>fail(Error('Atlas startup exceeded 90s. '+stderr)),90000);
  server.once('error',e=>{clearTimeout(timer);fail(e);});server.once('exit',code=>{clearTimeout(timer);fail(Error('Atlas exited '+code+' '+stderr));});
  server.stdout.setEncoding('utf8').on('data',s=>{const match=s.match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);ok(match[0]);}});
 });
 const readyMs=performance.now()-start,requests=[];let data;
 for(let i=0;i<2;i++){
  const begin=performance.now(),response=await fetch(base+'/data');assert.equal(response.status,200);
  const body=Buffer.from(await response.arrayBuffer()),receiveMs=performance.now()-begin,parseStart=performance.now();data=JSON.parse(body);
  requests.push({bytes:body.length,sha256:sha(body),receiveMs,parseMs:performance.now()-parseStart});
 }
 assert.deepEqual(data.snapshot.failures,input.failures);
 assert.equal(sha(readFileSync(snapshot)),sha(bytes),'Read-only proof changed snapshot.');
 const result={scope:'normal HTTP server; completed full archive snapshot; actual registered local output directories; no rebuild or writes',
  snapshot:{bytes:bytes.length,sha256:sha(bytes)},digests,readyMs,requests,failures:data.snapshot.failures,
  worlds:data.findings.worlds.length,readingKeys:data.reading.keys.length,
  outputOnlyKeys:data.reading.keys.filter(k=>k.outputOnly).length,
  preparedKeys:data.reading.keys.filter(k=>k.shards>0).length,stderr};
 const out=resolve(root,'docs/representations/evidence/atlas-archive-scale-2026-11-25/full-startup.json');mkdirSync(dirname(out),{recursive:true});writeFileSync(out,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{
 if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
}
