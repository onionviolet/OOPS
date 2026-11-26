// Local-only proof: normal Atlas server/view, isolated synthetic proposal queue,
// and existing public runtime/receipt files. No public upload or release.
import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {mkdirSync,mkdtempSync,readFileSync,realpathSync,rmSync,writeFileSync} from 'node:fs';
import {basename,dirname,join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
import {prepareHandoff,saveHandoff} from './reading-handoffs.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const temp=realpathSync(tmpdir()),scratch=mkdtempSync(join(temp,'atlas-implementation-proof-'));
const output=resolve(root,process.argv[2]||'docs/representations/evidence/atlas-handoff-return-2026-11-25');
mkdirSync(output,{recursive:true});
const queue=join(scratch,'handoffs'),snapshot=join(scratch,'snapshot','snapshot.json'),readerRoot=join(scratch,'empty-readers');
mkdirSync(readerRoot,{recursive:true});
const record={key:'fixture',label:'Synthetic proposal · keyboard focus',type:'rule',href:'#world/fixture/things/focus',fileLines:[[1,1]],fileLocators:['Synthetic fixture']};
const pageData={key:'fixture',world:'fixture',prefix:'fixturec001',pass:'rules',kind:'rules',offset:0,records:[record],inspected:true,contentHash:'synthetic-proof-version'};
const packet=prepareHandoff({recordKey:record.key,recordRoute:record.href,fileLines:record.fileLines,contentHash:pageData.contentHash,
 change:'Keep the selected connection action focused while time advances.',check:'Start, wait and pause investigation using the keyboard.'},pageData);
const id=await saveHandoff(queue,packet);
await saveHandoff(queue,{...packet,record:{...packet.record,label:'Second synthetic proposal'},proposal:{...packet.proposal,change:'Another fixture only.'}});
const proposalBytes=readFileSync(join(queue,id+'.json'));
const attachment={consumerName:'Connection action focus',consumerPath:'src/continuation_ui.js',
 playerRoute:'PLAY → Connection → establish the connection → investigate; keep keyboard focus while time advances.',
 receiptPath:'docs/gm/dispatch/play-surface-2026-11-14/CONNECTION_FOCUS_2026-11-25.md'};
let server,browser;const errors=[],checks=[];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
try {
 console.log('Building a normal isolated Atlas snapshot for the handoff proof.');
 const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_READER_ROOT:readerRoot,ATLAS_HANDOFFS:queue,ATLAS_PORT:'0'};
 delete env.ATLAS_REBUILD;delete env.ATLAS_LOTM_CAST;
 execFileSync(process.execPath,['prototypes/world-atlas/build.mjs','--out',snapshot],{cwd:root,env,stdio:'inherit',windowsHide:true});
 server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,stdio:['ignore','pipe','inherit'],windowsHide:true});
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));server.stdout.setEncoding('utf8').on('data',s=>{const match=s.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(10000);page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base+'/#workbench/handoffs/'+id);
 const entry=page.locator('[data-handoff-id="'+id+'"]');await entry.getByRole('heading',{name:record.label,exact:true}).waitFor();
 assert.equal(await page.locator('[data-handoff-id]').count(),1);await page.getByRole('link',{name:'All implementation handoffs',exact:true}).waitFor();checks.push('Direct immutable proposal route filters the queue and links back');
 await entry.getByText('Attach an implementation report',{exact:true}).click();
 for(const [label,value]of [['Runtime consumer name',attachment.consumerName],['Runtime consumer path',attachment.consumerPath],['Player entry or route',attachment.playerRoute],['Implementation receipt path',attachment.receiptPath]])await entry.getByLabel(label,{exact:true}).fill(value);
 await page.screenshot({path:join(output,'attach-form.png')});
 await entry.getByRole('button',{name:'Attach report',exact:true}).click();
 await page.getByRole('heading',{name:'Implementation report attached',exact:true}).waitFor();
 await page.getByText('Registered file bytes match the attachment.',{exact:true}).waitFor();
 assert.equal(page.url(),base+'/#workbench/handoffs/'+id);assert.equal(await page.locator('[data-handoff-id]').count(),1);
 await page.screenshot({path:join(output,'report-attached.png')});
 let response=await page.request.get(base+'/reading-handoffs'),data=await response.json();
 let saved=data.entries.find(e=>e.id===id),report=saved.implementationReports[0];
 assert.equal(saved.stage,'proposed');assert.deepEqual(saved.proposal,packet.proposal);assert.deepEqual(readFileSync(join(queue,id+'.json')),proposalBytes);
 assert.equal(report.consumer.sha256,sha(readFileSync(join(root,attachment.consumerPath))));assert.equal(report.receipt.sha256,sha(readFileSync(join(root,attachment.receiptPath))));checks.push('Normal form attaches fingerprinted public files without mutating or promoting proposal');
 response=await page.request.post(base+'/reading-handoffs/'+id+'/implementation-reports',{data:attachment});assert.equal(response.status(),200);assert.equal((await response.json()).id,report.id);
 data=await(await page.request.get(base+'/reading-handoffs')).json();assert.equal(data.entries.find(e=>e.id===id).implementationReports.length,1);checks.push('Duplicate API submission is idempotent');
 response=await page.request.post(base+'/reading-handoffs/'+id+'/implementation-reports',{data:{...attachment,consumerPath:'src/../docs/GROUND_RULES.md'}});assert.equal(response.status(),400);
 response=await page.request.post(base+'/reading-handoffs/'+id+'/implementation-reports',{headers:{origin:'http://other.invalid'},data:attachment});assert.equal(response.status(),403);checks.push('Scoped endpoint rejects traversal and cross-origin writes');
 await page.reload();await page.getByRole('heading',{name:'Implementation report attached',exact:true}).waitFor();checks.push('Attachment survives normal reload');
 // A historical fingerprint fixture exercises the actual GET drift projection
 // without editing a runtime file in this shared checkout. Unit tests change real
 // file bytes, remove receipts and retarget links in an isolated workspace.
 const {id:reportId,status,files,...historical}=report;
 await saveHandoff(join(queue,'implementation-reports'),{...historical,consumer:{...historical.consumer,sha256:'0'.repeat(64)}});
 await page.reload();await page.getByText('Files changed since attachment.',{exact:true}).waitFor();assert.equal(await page.getByRole('heading',{name:'Implementation report attached',exact:true}).count(),2);
 await page.screenshot({path:join(output,'file-drift.png')});checks.push('Historical fingerprint fixture labels file drift without changing proposal stage');
 await page.getByRole('link',{name:'All implementation handoffs',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('[data-handoff-id]').length===2);checks.push('All-handoffs link restores other immutable proposals');
 const filter=page.getByRole('combobox',{name:'Handoff status'});
 const visibleIds=()=>page.locator('[data-handoff-id]:visible').evaluateAll(rows=>rows.map(row=>row.dataset.handoffId));
 await filter.selectOption({label:'Changed or missing files (1)'});assert.deepEqual(await visibleIds(),[id]);
 await filter.selectOption({label:'Awaiting a report (1)'});const waiting=await visibleIds();assert.equal(waiting.length,1);assert.notEqual(waiting[0],id);
 await filter.selectOption({label:'Report attached (1)'});assert.deepEqual(await visibleIds(),[id]);
 await filter.selectOption({label:'All handoffs (2)'});assert.equal((await visibleIds()).length,2);
 checks.push('Queue filters distinguish outstanding work, implementation reports and changed files');
 // Check the actual source form's accessible name without submitting a synthetic reading.
 await page.evaluate(async data=>{const {handoffForm}=await import('/reading-handoffs-view.mjs');const form=handoffForm(data);form.id='label-proof';form.open=true;document.querySelector('main').append(form);},pageData);
 await page.getByLabel('Reading record',{exact:true}).waitFor();await page.locator('#label-proof').evaluate(el=>el.remove());checks.push('Reading-record select has an explicit exact accessible name');
 assert.deepEqual(errors,[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const reportData={viewport:'1920x1080',fixture:'Synthetic isolated proposals; existing public consumer/receipt files; no actual reading coverage claim',
 proposalId:id,reportId:report.id,checks,pageErrors:errors,driftProof:'Browser uses a historical fingerprint fixture; unit tests mutate actual isolated files',
 sourceHashes:Object.fromEntries(['reading-handoffs.mjs','reading-handoffs-view.mjs','serve.mjs'].map(name=>[name,sha(readFileSync(join(root,'prototypes/world-atlas',name)))]))};
 writeFileSync(join(output,'result.json'),JSON.stringify(reportData,null,2));console.log(JSON.stringify(reportData,null,2));
} catch(error) {console.error('Handoff implementation proof failed:',error);throw error;}
finally {
 if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
 if(dirname(scratch)===temp&&basename(scratch).startsWith('atlas-implementation-proof-'))rmSync(scratch,{recursive:true,force:true});
 await browser?.close();
}
