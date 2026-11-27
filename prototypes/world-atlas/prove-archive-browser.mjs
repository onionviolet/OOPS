// Read-only normal Atlas UI over the immutable staged archive/snapshot.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
import {findingsMatrix} from './reader-findings.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),stage=join(root,'work/atlas-archive-scale-20261125');
const measured=JSON.parse(readFileSync(join(stage,'result.json'),'utf8'));
const findings={columns:[],worlds:[]};
for(const world of measured.worlds){const digest=JSON.parse(readFileSync(join(stage,'readers',world.world+'.json'),'utf8'));
 const one=findingsMatrix([digest]);findings.columns=one.columns;findings.worlds.push(...one.worlds);}
const baseline=JSON.parse(readFileSync(join(root,'work/atlas-snapshot/snapshot.json'),'utf8'));
const snapshot=join(stage,'snapshot.json');writeFileSync(snapshot,JSON.stringify({...baseline,findings}));
const output=join(root,'docs/representations/evidence/atlas-archive-scale-2026-11-25');mkdirSync(output,{recursive:true});
let server,browser;const errors=[],checks=[];
try{
 const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_READER_ROOT:join(stage,'reader-root'),ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;
 const start=performance.now();server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));
  server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
 const readyMs=performance.now()-start;
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));
 const data=await(await page.request.get(base+'/data')).json();
 assert.doesNotMatch(JSON.stringify(data.reading),/\/Users\/|docs\/research\/novels|\.epub|shard_.+\.txt/);
 for(const world of measured.worlds){
  const sample=world.samples[0],key=data.reading.keys.find(k=>k.key===sample.key);assert.equal(key.shards,0);assert.equal(key.complete,false);assert.ok(key.observedOutputFiles>0);
  await page.goto(base+'/#library/outputs/'+sample.key);
  await page.getByLabel('Coverage',{exact:true}).waitFor();
  assert.match(await page.locator('.reading-outputs').innerText(),/0 registry chapter ranges/);
  const route=[sample.key,sample.prefix,sample.pass,sample.kind].map(encodeURIComponent).join('/');
  const before=performance.now(),response=await page.request.get(base+'/reading-output-records/'+route),records=await response.json();
  assert.equal(records.contentHash,sample.contentHash);assert.equal(records.inspected,true);assert.ok(records.total>0);
  await page.goto(base+'/#library/outputs/'+route);
  await page.getByRole('link',{name:records.records[0].label,exact:true}).first().waitFor();
  await page.screenshot({path:join(output,world.world+'-records-1920.png')});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  checks.push({world:world.world,key:sample.key,scope:records.scope,prepared:0,complete:false,observedOutputFiles:key.observedOutputFiles,
   records:records.total,contentHash:records.contentHash,recordRoute:records.records[0].href,requestMs:performance.now()-before});
 }
 assert.deepEqual(errors,[]);const result={viewport:'1920x1080',readyMs,checks,errors,
  scope:'normal read-only Atlas routes over staged verified output-only restore; no fake prepared/source files, no canonical snapshot write'};
 writeFileSync(join(output,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{
 if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
 await browser?.close();
}
