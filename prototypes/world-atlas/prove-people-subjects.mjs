// One actual restored people file, normal default Atlas and desktop click-through.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=join(root,'docs/representations/evidence/atlas-archive-scale-2026-11-25/people-subjects');mkdirSync(out,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const snapshot=readFileSync(join(root,'work/atlas-snapshot/snapshot.json'));
const baseline=JSON.parse(readFileSync(join(root,'docs/representations/evidence/atlas-archive-scale-2026-11-25/unindexed-sample.json')));
const prior=baseline.worlds.find(w=>w.world==='hp').outputs.find(o=>o.key==='hp4'&&o.prefix==='hp4c007'&&o.kind==='people');
let server,browser;try{
 const env={...process.env,ATLAS_PORT:'0'};for(const key of ['ATLAS_REBUILD','ATLAS_SNAPSHOT','ATLAS_READER_ROOT'])delete env[key];
 server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',c=>fail(Error('Atlas exited '+c)));server.stdout.setEncoding('utf8').on('data',s=>{const m=s.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 const pageData=await(await fetch(base+'/reading-output-records/hp4/hp4c007/people/people?size=100')).json();
 assert.equal(pageData.contentHash,prior.contentHash);assert.equal(pageData.counts.matchedRows,41);assert.equal(prior.counts.matchedRows,37);assert.equal(pageData.counts.unindexed,1);
 const group=pageData.records.find(r=>r.focus==='hp.organization.dursleys');assert.ok(group);assert.ok(!pageData.records.some(r=>r.focus==='hp.organization.ministry'));
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(30000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#library/outputs/hp4/hp4c007/people/people');
 await page.getByRole('link',{name:group.label,exact:true}).waitFor();
 await page.screenshot({path:join(out,'people-output-1920.png')});
 await page.getByRole('link',{name:group.label,exact:true}).click();
 await page.waitForURL(base+'/'+group.href);await page.locator('.reader-group-record').getByRole('heading',{name:group.label,exact:true}).waitFor();
 await page.screenshot({path:join(out,'public-group-1920.png')});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 const result={scope:'normal default Atlas; real restored HP4 people output; exact same-slice census join; no fixtures or digest rebuild',viewport:'1920x1080',
  snapshotSha256:sha(snapshot),matcherSha256:sha(readFileSync(join(root,'prototypes/world-atlas/output-records.mjs'))),contentHash:pageData.contentHash,
  before:prior.counts,after:pageData.counts,clickedHref:group.href,collisionStillUnindexed:true,errors};
 writeFileSync(join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{
 if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
 await browser?.close();
}
