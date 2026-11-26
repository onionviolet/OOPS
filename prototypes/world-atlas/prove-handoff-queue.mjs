// Read-only normal-server proof against the actual local queue.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const output=resolve(process.argv[2]||'docs/representations/evidence/atlas-handoff-queue-2026-11-25');mkdirSync(output,{recursive:true});
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{env:{...process.env,ATLAS_PORT:'0'},stdio:['ignore','pipe','inherit'],windowsHide:true});
let browser;const errors=[];
try{
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:768}});page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.message));
 let buildChecks=0;
 page.on('request',request=>{if(new URL(request.url()).pathname==='/reading-handoffs/build-check')buildChecks++;});
 const before=await(await page.request.get(base+'/reading-handoffs')).json(),entries=before.entries;
 await page.goto(base+'/#workbench/handoffs');await page.locator('[data-handoff-id]').first().waitFor();
 assert.equal(await page.locator('[data-handoff-id]').count(),entries.length);assert.equal(await page.locator('.reading-handoffs form').count(),0);
 await page.screenshot({path:join(output,'queue-1366.png')});
 const fit=await page.locator('.handoff-queue-entry').evaluateAll(rows=>rows.filter(row=>{const b=row.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}).length);assert.ok(fit>=3,'multiple actual entries fit the laptop viewport');
 const status=page.getByRole('combobox',{name:'Handoff status'}),source=page.getByRole('combobox',{name:'Handoff source'});
 const matches=[()=>true,e=>!(e.implementationReports||[]).length,e=>(e.implementationReports||[]).length>0,e=>(e.implementationReports||[]).some(r=>[r.files?.consumer,r.files?.receipt].some(f=>['changed','unavailable'].includes(f?.status)))];
 const combinations=[];
 for(const origin of ['all','reading','backlog'])for(let index=0;index<matches.length;index++){
  await source.selectOption(origin);await status.selectOption(String(index));
  const expected=entries.filter(entry=>matches[index](entry)&&(origin==='all'||(entry.source.kind==='idea-owner'?'backlog':'reading')===origin)).map(e=>e.id).sort();
  const actual=await page.locator('[data-handoff-id]:visible').evaluateAll(rows=>rows.map(row=>row.dataset.handoffId).sort());assert.deepEqual(actual,expected);combinations.push({source:origin,status:index,count:actual.length});
 }
 await source.selectOption('all');await status.selectOption('0');
 assert.equal(buildChecks,0);
 await page.getByRole('button',{name:'Compare playtests with this build'}).click();
 await page.waitForFunction(count=>document.querySelectorAll('.queue-build-result').length===count,entries.length);
 assert.equal(buildChecks,1);
 const currentHash=createHash('sha256').update(readFileSync('dist/bundle.js')).digest('hex');
 const buildComparison=[];
 for(const entry of entries){
  const receipts=(entry.implementationReports||[]).flatMap(report=>report.playtests||[]);
  const expected=receipts.filter(proof=>proof.files.proof.status==='unchanged'&&proof.testedBundleSha256===currentHash).length;
  const label=await page.locator('[data-handoff-id="'+entry.id+'"] .queue-build-result').innerText();
  assert.equal(Number(label.match(/(\d+) on this build/)?.[1]||0),expected);
  buildComparison.push({handoff:entry.id,exactReceipts:expected,label});
 }
 await page.screenshot({path:join(output,'build-comparison-1366.png')});
 const first=entries[0],link=page.locator('[data-handoff-id="'+first.id+'"] h3 a');await link.click();
 await page.getByRole('link',{name:'All implementation handoffs',exact:true}).waitFor();await page.locator('.reading-implementation-form').waitFor({state:'attached'});assert.equal(await page.locator('[data-handoff-id]').count(),1);assert.equal(await page.locator('.reading-implementation-form').count(),1);
 await page.screenshot({path:join(output,'direct-detail-1366.png')});await page.reload();await page.locator('.reading-implementation-form').waitFor({state:'attached'});
 await page.getByRole('link',{name:'All implementation handoffs',exact:true}).click();await page.waitForFunction(count=>document.querySelectorAll('[data-handoff-id]').length===count,entries.length);
 assert.deepEqual((await(await page.request.get(base+'/reading-handoffs')).json()).entries,before.entries);assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 writeFileSync(join(output,'build-comparison.json'),JSON.stringify({bundle:currentHash,requests:buildChecks,entries:buildComparison},null,2));
 const sourceHashes=Object.fromEntries(['reading-handoffs.mjs','reading-handoffs-view.mjs','canvas.css','serve.mjs'].map(name=>[name,createHash('sha256').update(readFileSync(join('prototypes/world-atlas',name))).digest('hex')]));
 const result={viewport:'1366x768',actualQueue:entries.length,fullyVisibleEntries:fit,filterCombinations:combinations,checks:['compact queue without report/submission forms','linked immutable detail route','detail submission form retained','reload and return','no queue mutation','no page errors or horizontal overflow'],pageErrors:errors,sourceHashes};writeFileSync(join(output,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser?.close();if(server.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}}
