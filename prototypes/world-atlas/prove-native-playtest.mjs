// Public receipt attachment and default web-bundle comparison through normal Atlas routes.
// Existing reports remain immutable; content-addressed local attachments are retained.
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {readFileSync,mkdirSync,mkdtempSync,realpathSync,rmSync} from 'node:fs';
import {writeFile} from 'node:fs/promises';
import {join,dirname,basename,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),temp=realpathSync(tmpdir());
const output=resolve(root,process.argv[3]||'docs/representations/evidence/atlas-native-playtest-2026-11-25');mkdirSync(output,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const currentBundleSha256=sha(readFileSync(join(root,'dist/bundle.js')));
if(process.argv[2])assert.equal(currentBundleSha256,process.argv[2],'expected default bundle identity');
const scratch=mkdtempSync(join(temp,'atlas-native-playtest-')),snapshot=join(scratch,'snapshot.json');
const cases=[
 ['src/lotm_charm_loan.js','docs/representations/evidence/lotm-charm-loan-2026-11-25/proof.json'],
 ['src/lotm_charm_materials.js','docs/representations/evidence/lotm-charm-materials-2026-11-25/proof.json'],
 ['src/lotm_charm_upkeep.js','docs/representations/evidence/lotm-charm-upkeep-2026-11-25/proof.json'],
 ['src/lotm_personal_earmark.js','docs/representations/evidence/lotm-personal-earmark-2026-11-25/proof.json'],
 ['src/lotm_charm_lender_stock.js','docs/representations/evidence/lotm-lender-stock-2026-11-25/proof.json'],
];
let server,browser;const errors=[],results=[];
try {
 const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;delete env.ATLAS_HANDOFFS;
 execFileSync(process.execPath,['prototypes/world-atlas/build.mjs','--out',snapshot],{cwd:root,env,windowsHide:true,stdio:'inherit'});
 server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));
  server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
 const queue=await(await page.request.get(base+'/reading-handoffs')).json();
 for(const [consumerPath,proofPath]of cases){
  const entry=queue.entries.find(e=>e.implementationReports?.some(r=>r.consumer.path===consumerPath));assert(entry,consumerPath);
  const report=entry.implementationReports.find(r=>r.consumer.path===consumerPath),reportPath=join(root,'work/atlas-reading-handoffs/implementation-reports',report.id+'.json');
  const before=sha(readFileSync(reportPath)),proof=JSON.parse(readFileSync(join(root,proofPath),'utf8'));
  await page.goto(base+'/#workbench/handoffs/'+entry.id);
  const section=page.locator('.reading-implementation-report').filter({hasText:report.consumer.name});await section.getByText(report.consumer.name,{exact:true}).waitFor();
  await section.getByText('Attach native playtest receipt',{exact:true}).click();
  await section.getByLabel('Public proof JSON path',{exact:true}).fill(proofPath);
  const attachedResponse=page.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith(`/implementation-reports/${report.id}/playtests`));
  await section.getByRole('button',{name:'Attach playtest',exact:true}).click();
  const attachedResult=await(await attachedResponse).json();
  const evidence=page.locator(`[data-playtest-id="${attachedResult.id}"]`);await evidence.getByRole('button',{name:'Compare checkout build',exact:true}).waitFor();
  await evidence.getByRole('button',{name:'Compare checkout build',exact:true}).click();
  const tested=proof.bundleSha256||proof.bundleHash,status=tested===currentBundleSha256?'exact-match':'different-build';
  await evidence.getByText(status==='exact-match'?'Tested on this exact checkout build.':'Tested on another build.',{exact:true}).waitFor();
  assert.match(await evidence.innerText(),new RegExp(proof.route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  if(['src/lotm_charm_loan.js','src/lotm_charm_lender_stock.js','src/lotm_charm_materials.js'].includes(consumerPath)){
   const image=consumerPath==='src/lotm_charm_lender_stock.js'?'current-loan-match-1920.png'
    :consumerPath==='src/lotm_charm_loan.js'?'loan-different-build-1920.png':'earlier-build-1920.png';
   await evidence.scrollIntoViewIfNeeded();await page.screenshot({path:join(output,image)});
  }
  const refreshed=await(await page.request.get(base+'/reading-handoffs')).json();
  const attached=refreshed.entries.find(e=>e.id===entry.id).implementationReports.find(r=>r.id===report.id).playtests.find(p=>p.proof.path===proofPath);
  const url=`${base}/reading-handoffs/${entry.id}/implementation-reports/${report.id}/playtests/${attached.id}/build-check`;
  const comparison=await(await page.request.get(url)).json();assert.equal(comparison.status,status);
  const retry=await page.request.post(`${base}/reading-handoffs/${entry.id}/implementation-reports/${report.id}/playtests`,{data:{proofPath}});
  assert.equal((await retry.json()).id,attached.id);assert.equal(sha(readFileSync(reportPath)),before);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  results.push({proposalId:entry.id,reportId:report.id,attachmentId:attached.id,proofPath,proofSha256:attached.proof.sha256,
   testedBundleSha256:tested,status,entry:comparison.entry,immutableReport:true,idempotent:true});
 }
 assert.equal(results.at(-1).status,'exact-match','new lender-stock proof is this default build');
 assert.ok(results.slice(0,-1).every(r=>r.status==='different-build'),'earlier evidence remains tied to its earlier builds');
 assert.equal(sha(readFileSync(join(root,'dist/bundle.js'))),currentBundleSha256,'default bundle remained unchanged during comparison');
 assert.deepEqual(errors,[]);
 const result={viewport:'1920x1080',currentBundleSha256,results,errors,
  sourceHashes:Object.fromEntries(['reading-handoffs.mjs','reading-handoffs-view.mjs','serve.mjs','prove-native-playtest.mjs'].map(file=>[file,sha(readFileSync(join(root,'prototypes/world-atlas',file)))])),
  route:'normal Atlas handoff forms and compare buttons; public existing native receipts, fixture scopes copied from receipts'};
 await writeFile(join(output,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
} finally {
 if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
 await browser?.close();
 if(dirname(scratch)===temp&&basename(scratch).startsWith('atlas-native-playtest-'))rmSync(scratch,{recursive:true,force:true});
}
