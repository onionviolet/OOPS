// Actual restored census to same-slice public rule, through normal default Atlas.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const output=join(root,'docs/representations/evidence/atlas-archive-scale-2026-11-25/census-rule');mkdirSync(output,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex'),snapshot=readFileSync(join(root,'work/atlas-snapshot/snapshot.json'));
const sample=JSON.parse(readFileSync(join(root,'docs/representations/evidence/atlas-archive-scale-2026-11-25/unindexed-sample.json')));
const before=sample.worlds.find(w=>w.world==='hp').outputs.find(o=>o.key==='hp4'&&o.prefix==='hp4c007'&&o.kind==='census');
let server,browser;try{
 const env={...process.env,ATLAS_PORT:'0'};for(const k of ['ATLAS_REBUILD','ATLAS_SNAPSHOT','ATLAS_READER_ROOT'])delete env[k];
 server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',c=>fail(Error('Atlas exited '+c)));server.stdout.setEncoding('utf8').on('data',s=>{const m=s.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 const pageData=await(await fetch(base+'/reading-output-records/hp4/hp4c007/census/census?offset=40')).json();
 assert.equal(pageData.contentHash,before.contentHash);assert.equal(pageData.counts.matchedRows,94);assert.equal(before.counts.matchedRows,93);assert.equal(pageData.counts.unindexed,0);
 const rule=pageData.records.find(r=>r.focus==='hp.law.carpet-embargo');assert.ok(rule);assert.equal(rule.sourceKind,'census');assert.equal(rule.type,'rule');assert.equal(pageData.fieldCoverage.kind,'census');
 assert.equal(rule.origin.contentHash,'sha256:21b02cdba251f4a0c94a2ffe1a8fc78f5c7f92821cf7e89078eb0a2e39012873');
 const collision=pageData.records.find(r=>r.focus==='hp.organization.ministry');assert.equal(collision.type,'entity');assert.equal(collision.origin,undefined);
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(30000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#library/outputs/hp4/hp4c007/census/census');
 await page.getByRole('button',{name:'Next',exact:true}).waitFor();await page.getByRole('button',{name:'Next',exact:true}).click();
 const link=page.locator('.source-records').getByRole('link',{name:rule.label,exact:true});await link.waitFor();await link.scrollIntoViewIfNeeded();
 await page.screenshot({path:join(output,'census-output-1920.png')});await link.click();
 await page.locator('.reader-law-record').getByRole('heading',{name:rule.label,exact:true}).waitFor();
 await page.screenshot({path:join(output,'public-rule-1920.png')});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 assert.equal(sha(readFileSync(join(root,'work/atlas-snapshot/snapshot.json'))),sha(snapshot));
 const result={scope:'normal default Atlas; actual restored HP4 census and rules; Next page then exact public rule click; no fixture or digest rebuild',viewport:'1920x1080',
  snapshotSha256:sha(snapshot),matcherSha256:sha(readFileSync(join(root,'prototypes/world-atlas/output-records.mjs'))),contentHash:pageData.contentHash,
  before:before.counts,after:pageData.counts,sourceKind:rule.sourceKind,origin:rule.origin,clickedHref:rule.href,collisionPreservedAsEntity:true,errors};
 writeFileSync(join(output,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{
 if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
 await browser?.close();
}
