// Normal exact-entry evidence links. Counts do not certify implementation or playtests.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createRequire} from 'node:module';
import {handoffsForIdea,ideaEntryHref} from '../prototypes/world-atlas/idea-owner-references.mjs';
const {launchChrome}=createRequire(import.meta.url)('../scripts/ui_helpers.cjs');
const out='docs/representations/evidence/exact-idea-evidence-2026-11-25';mkdirSync(out,{recursive:true});
const sha=path=>createHash('sha256').update(readFileSync(path)).digest('hex'),current=sha('dist/bundle.js');
const preserve=['docs/representations/evidence/atlas-workbench-2026-11-25/ps153-native-trace.json','docs/representations/evidence/atlas-workbench-2026-11-25/ps153-native-consumer-playtest-1366.png','docs/representations/evidence/atlas-workbench-2026-11-25/harry-native-playtest-attachments.json','docs/gm/dispatch/play-surface-2026-11-14/HARRY_LIBRARY_WORK_2026-11-25.md'];const historical=Object.fromEntries(preserve.map(path=>[path,sha(path)]));
const env={...process.env,ATLAS_PORT:'0'};for(const key of ['ATLAS_REBUILD','ATLAS_SNAPSHOT','ATLAS_HANDOFFS'])delete env[key];
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{env,windowsHide:true,stdio:['ignore','pipe','inherit']});let browser;const errors=[],results=[];
try{
 const base=await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',c=>reject(Error('Server stopped '+c)));server.stdout.on('data',b=>{const m=String(b).match(/http:\/\/127\.0\.0\.1:\d+/);if(m)resolve(m[0]);});});
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:900}});page.on('pageerror',e=>errors.push(e.message));let queueRequests=0;page.on('request',r=>{if(new URL(r.url()).pathname==='/reading-handoffs'&&r.method()==='GET')queueRequests++;});
 const queue=await(await page.request.get(base+'/reading-handoffs')).json(),ps=queue.entries.find(e=>e.id==='7f5b831dd993bdc625dbfce2afb8532b13de4a797897a24ecb899a50a4989c1f'),hp=queue.entries.find(e=>e.id==='5f0c07c35f376c6433a9967abc683ba9044ea752881f5a93cf23592ae7813f9c');assert.ok(ps&&hp);
 const search=await(await page.request.get(base+'/idea-owner-search?q=N2&limit=25')).json(),other=search.rows.find(row=>row.ownerReference!==hp.source.ownerReference&&!handoffsForIdea(row,queue.entries).length);assert.ok(other);assert.equal(other.code,'N2');
 const cases=[{label:'ps153',row:{id:ps.source.ideaId,reference:ps.source.reference,ownerReference:ps.source.ownerReference},expected:ps},{label:'harry-n2',row:{id:hp.source.ideaId,reference:hp.source.reference,ownerReference:hp.source.ownerReference},expected:hp},{label:'unrelated-n2',row:other}];
 for(const test of cases){queueRequests=0;await page.goto(base+'/'+ideaEntryHref(test.row.ownerReference,test.row.id));const row=page.locator(`[data-idea-id="${test.row.id}"]`),evidence=row.locator('.idea-entry-evidence');await evidence.waitFor();assert.equal(queueRequests,1);const matches=handoffsForIdea(test.row,queue.entries),reports=matches.flatMap(e=>e.implementationReports||[]),playtests=reports.reduce((n,r)=>n+(r.playtests||[]).length,0);
  assert.match(await evidence.innerText(),new RegExp(`${reports.length} implementation reports? linked; ${playtests} native playtest receipts? attached`));assert.doesNotMatch(await row.innerText(),/This is not its implementation status/);
  const before=queueRequests;const owner=row.locator('xpath=ancestor::*[contains(@class,"idea-owner-ideas")]');await owner.getByRole('searchbox',{name:'Search entries in this owner'}).fill(test.label==='ps153'?'PS153':'N2');assert.equal(queueRequests,before,'entry rendering reuses loaded handoffs');
  if(!reports.length){await evidence.getByText('No linked implementation evidence here. This does not establish whether the game implements the idea.',{exact:true}).waitFor();assert.equal(await evidence.locator('[data-implementation-report]').count(),0);assert.equal(matches.length,0);await row.scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+test.label+'-1366.png'});results.push({case:test.label,reference:test.row.reference,handoffs:0,reports:0,playtests:0,noInheritanceFromSameCode:true});continue;}
  assert.equal(await evidence.locator('[data-implementation-report]').count(),reports.length);await evidence.getByText('Open report details to check file versions and compare tested and current builds. Attachment counts do not verify a playthrough or approve a proposal.',{exact:true}).waitFor();await evidence.scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+test.label+'-source-1366.png'});
  const report=test.expected.implementationReports[0],link=evidence.locator(`[data-implementation-report="${report.id}"]`);assert.equal(await link.getAttribute('href'),'#workbench/handoffs/'+test.expected.id);await link.click();await page.locator('.reading-implementation-report').filter({hasText:report.consumer.name}).waitFor();const statuses=[];
  for(const proof of report.playtests||[]){const receipt=page.locator(`[data-playtest-id="${proof.id}"]`);await receipt.getByRole('button',{name:'Compare checkout build',exact:true}).click();const status=proof.testedBundleSha256===current?'exact-match':'different-build';await receipt.getByText(status==='exact-match'?'Tested on this exact checkout build.':'Tested on another build.',{exact:true}).waitFor();statuses.push(status);}
  if(test.label==='ps153')assert.deepEqual(statuses,['exact-match']);else assert.ok(statuses.length>=2&&statuses.every(s=>s==='different-build'));
  await page.screenshot({path:out+'/'+test.label+'-detail-1366.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);results.push({case:test.label,reference:test.row.reference,handoffs:matches.length,reports:reports.length,playtests,statuses,loadedQueueRequests:1});
 }
 for(const [path,hash]of Object.entries(historical))assert.equal(sha(path),hash);assert.equal(sha('dist/bundle.js'),current);assert.deepEqual(errors,[]);
 const result={viewport:'1366x900',currentBundleSha256:current,viewSha256:sha('prototypes/world-atlas/idea-owners-view.mjs'),results,historicalEvidenceUnchanged:historical,pageErrors:errors};writeFileSync(out+'/proof.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser?.close();if(server.exitCode===null){const ended=once(server,'exit');server.kill();await ended;}}
