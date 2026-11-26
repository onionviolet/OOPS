// Standalone shared-view proof with a freshly measured real four-chapter subset.
// Historical readiness artifacts are immutable. Optional URL also proves normal multi-book UI.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdtempSync,rmSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {registeredBooks} from '../prototypes/world-atlas/library-reading.mjs';
import {measureReadingReadiness,readMeasuredReadiness} from '../prototypes/world-atlas/reading-readiness.mjs';
const {launchChrome}=createRequire(import.meta.url)('../scripts/ui_helpers.cjs');
const root=resolve('.'),evidence=resolve('docs/representations/evidence/reading-readiness-detail-2026-11-25'),scratch=mkdtempSync(join(tmpdir(),'readiness-browser-'));
const historical=resolve('docs/representations/evidence/reading-readiness-2026-11-25/recent-four.json'),sha=path=>createHash('sha256').update(readFileSync(path)).digest('hex'),historicalSha=sha(historical);
mkdirSync(evidence,{recursive:true});
const snapshot=join(scratch,'snapshot.json'),digestFile=join(scratch,'lotm.json'),file=join(scratch,'live-recent-four.json');
writeFileSync(snapshot,readFileSync('work/atlas-snapshot/snapshot.json'));writeFileSync(digestFile,readFileSync('work/atlas-snapshot/readers/lotm.json'));
const registry=registeredBooks(),live=measureReadingReadiness({world:'lotm',registry,digest:JSON.parse(readFileSync(digestFile)),snapshotBytes:readFileSync(snapshot),digestBytes:readFileSync(digestFile),keys:['lotm1'],prefixes:['lotm1c127','lotm1c128','lotm1c129','lotm1c130']});
assert.equal(live.books[0].prefixes,4);writeFileSync(file,JSON.stringify(live,null,2)+'\n');writeFileSync(join(evidence,'live-recent-four.json'),readFileSync(file));
let mode='measured';
const server=createServer((req,res)=>{
 if(req.url.startsWith('/reading-readiness?'))return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(readMeasuredReadiness({world:'lotm',registry,snapshot:mode==='stale'?join(scratch,'absent'):snapshot,digestFile,file:mode==='missing'?join(scratch,'missing'):file})));
 if(req.url==='/reading-readiness-view.mjs')return res.writeHead(200,{'Content-Type':'text/javascript'}).end(readFileSync(join(root,'prototypes/world-atlas/reading-readiness-view.mjs')));
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(`<!doctype html><meta charset="utf-8"><title>Readiness standalone proof</title><style>body{font:16px system-ui;margin:30px;max-width:1300px;background:#f6f3e9;color:#25312f}td,th{padding:8px;text-align:left;border-bottom:1px solid #aaa}button,select{font:inherit;padding:8px}details{margin:12px 0}summary{cursor:pointer}</style><h1>World → Reading</h1><p>Standalone fixture · freshly measured actual four-chapter LOTM subset, matching snapshot and reader calculation.</p><main></main><script type="module">import{appendReadingReadiness}from'/reading-readiness-view.mjs';appendReadingReadiness(document.querySelector('main'),'lotm',(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e});</script>`);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const errors=[],normalBooks=[];
const cells=row=>[`${row.pass} / ${row.kind}`,`${row.selected} / ${row.expected}`,String(row.inspected),`${row.missing} / ${row.partial} / ${row.unattested}`,`${row.parsedRows} / ${row.matchedRows}`,`${row.withheldRows} / ${row.ambiguousRows} / ${row.unindexedRows}`,`${row.parseErrors} / ${row.readErrors}`];
const assertRows=async(table,outputs)=>assert.deepEqual(await table.locator('tr').evaluateAll(rows=>rows.slice(1).map(r=>[...r.querySelectorAll('td')].map(td=>td.textContent))),outputs.map(cells));
try{
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:900}});page.on('pageerror',e=>errors.push(String(e)));
 if(process.argv[2]){
  let requests=0;page.on('request',r=>{if(r.url().includes('/reading-readiness?'))requests++;});
  await page.goto(process.argv[2]+'/#world/hp/reading');await page.locator('button[data-id="read"]').click();const region=page.getByRole('region',{name:'Measured output readiness'});await region.getByRole('button',{name:'Show measured output readiness'}).waitFor();assert.equal(requests,0);
  await region.getByRole('button',{name:'Show measured output readiness'}).click();await region.getByRole('heading',{name:'Measured output readiness',exact:true}).waitFor();
  const payload=await(await page.request.get(process.argv[2]+'/reading-readiness?world=hp')).json();assert.ok(payload.report?.books.length>=2);assert.equal(payload.status,'measured');
  assert.equal(await region.locator('[data-readiness-details]').evaluate(n=>n.open),false);assert.equal(await region.locator('select').count(),0);await assertRows(region.locator('[data-readiness-table="world"]'),payload.report.outputs);
  await page.screenshot({path:join(evidence,'normal-hp-compact-1366.png')});
  await region.getByText('Books and field counts',{exact:true}).click();const select=region.getByRole('combobox',{name:'Readiness book or world'});
  for(const book of payload.report.books.slice(0,2)){
   await select.selectOption(book.key);const detail=region.locator('[data-readiness-table="detail"]');await assertRows(detail,book.outputs);
   const row=book.outputs.find(r=>r.fields?.length);assert.ok(row);const fields=region.getByText(`${row.label||row.kind} · ${row.pass} / ${row.kind}`,{exact:true});await fields.click();
   const table=fields.locator('..').locator('[data-readiness-table="fields"]');assert.equal(await table.locator('caption').textContent(),`Book ${book.key} · ${row.label||row.kind}: ${row.fieldRows} evaluated rows`);
   assert.deepEqual(await table.locator('tr').evaluateAll(rows=>rows.slice(1).map(r=>[...r.querySelectorAll('td')].map(td=>td.textContent))),row.fields.map(f=>[f.label,`${f.rows} / ${row.fieldRows}`]));
   assert.doesNotMatch(await region.innerText(),/[A-Z]:[\\/]|\.epub|\.jsonl|OEBPS|\.dir[\\/]/);normalBooks.push({key:book.key,prefixes:book.prefixes,selected:book.outputs.reduce((n,r)=>n+r.selected,0),fieldRows:row.fieldRows});
   await table.scrollIntoViewIfNeeded();await page.screenshot({path:join(evidence,`normal-${book.key}-fields-1366.png`)});
  }
  assert.equal(requests,1,'details reuse the first GET, without another inspection');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 await page.goto('http://127.0.0.1:'+server.address().port);const button=page.getByRole('button',{name:'Show measured output readiness'});
 assert.equal(await page.locator('table').count(),0,'no inspection before demand');
 await button.click();await page.getByRole('heading',{name:'Measured output readiness'}).waitFor();assert.equal(await page.locator('[data-readiness-table="world"] tr').count(),13);await assertRows(page.locator('[data-readiness-table="world"]'),live.outputs);
 assert.match(await page.locator('main').innerText(),/Measured snapshot · subset/);assert.equal(await page.locator('[data-readiness-details]').evaluate(n=>n.open),false);
 await page.getByText('Books and field counts',{exact:true}).click();await page.getByRole('combobox',{name:'Readiness book or world'}).selectOption('lotm1');await assertRows(page.locator('[data-readiness-table="detail"]'),live.books[0].outputs);await page.screenshot({path:join(evidence,'live-subset-detail-1366.png')});
 mode='stale';await button.click();await page.getByText(/Stale measurement/).waitFor();await page.screenshot({path:join(evidence,'stale-1366.png')});
 mode='missing';await button.click();await page.getByText(/No measured aggregate/).waitFor();assert.equal(await page.locator('table').count(),0);await page.screenshot({path:join(evidence,'missing-1366.png')});
 assert.equal(sha(historical),historicalSha);assert.deepEqual(errors,[]);writeFileSync(join(evidence,'browser-result.json'),JSON.stringify({fixture:'standalone shared view and GET projection; newly measured actual four-chapter counts',viewport:'1366x900',normalBooks,historicalRecentFourSha256:historicalSha,liveBinding:live.binding,checks:['on-demand','scoped twelve-kind world table','optional book comparison','approved field counts','stale snapshot','missing measurement'],pageErrors:errors},null,2));
 console.log(JSON.stringify({ok:true,normalBooks,historicalRecentFourSha256:historicalSha,errors}));
}finally{await browser?.close();await new Promise(r=>server.close(r));rmSync(scratch,{recursive:true,force:true});}
