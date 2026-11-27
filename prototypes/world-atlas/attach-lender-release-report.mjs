// Authorized operator receipt: normal form, genuine persistent reading queue.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const proposalId='4d1614c2ed8e24b134ba0e637d417faac6a01bd8f9875aa061af46501479cc03';
const attachment={consumerName:'Old Neil’s response-charm choices and voluntary release',consumerPath:'src/lotm_charm_response.js',
    playerRoute:'Native Klein entry with genuine restored LOTM cast; late response and Seer prerequisites are a disclosed setup fixture. Follow Swain → borrow from actual Neil → return unused or consume during the response → meet awake Neil after the emergency → keep the replacement promise or receive his voluntary release. Future Swain compensation stays intention without agreement or collection. The full earned journey is not claimed.',
    receiptPath:'docs/gm/dispatch/procedural-crafting-2026-11-11/LOTM_LENDER_RELEASE_2026-11-25.md'};
const proofPath='docs/representations/evidence/lotm-lender-release-reviewed-2026-11-25/proof.json';
const output=join(root,'docs/representations/evidence/lotm-lender-release-reviewed-2026-11-25');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
let server,browser;const errors=[];
try{
    const env={...process.env,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;delete env.ATLAS_HANDOFFS;
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,stdio:['ignore','pipe','inherit'],windowsHide:true});
    const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.message));
    const before=await(await page.request.get(base+'/reading-handoffs')).json(),original=before.entries.find(entry=>entry.id===proposalId);assert(original);
    const originalReportIds=(original.implementationReports||[]).map(report=>report.id);
    await page.goto(base+'/#workbench/handoffs/'+proposalId);
    const entry=page.locator(`[data-handoff-id="${proposalId}"]`);await entry.getByText('Attach an implementation report',{exact:true}).click();
    for(const [label,value]of [['Runtime consumer name',attachment.consumerName],['Runtime consumer path',attachment.consumerPath],['Player entry or route',attachment.playerRoute],['Implementation receipt path',attachment.receiptPath]])await entry.getByLabel(label,{exact:true}).fill(value);
    await entry.getByRole('button',{name:'Attach report',exact:true}).click();
    const section=page.locator('.reading-implementation-report').filter({has:page.getByText(attachment.consumerName,{exact:true})});
    await section.getByText('Registered file bytes match the attachment.',{exact:true}).waitFor();
    await page.reload();await section.getByText('Registered file bytes match the attachment.',{exact:true}).waitFor();
    const after=await(await page.request.get(base+'/reading-handoffs')).json(),saved=after.entries.find(entry=>entry.id===proposalId),report=saved.implementationReports.find(report=>report.consumer.path===attachment.consumerPath);
    assert(report);assert.equal(saved.stage,original.stage);assert.deepEqual(saved.proposal,original.proposal);
    assert.ok(originalReportIds.every(id=>saved.implementationReports.some(report=>report.id===id)));
    assert.equal(report.consumer.sha256,sha(await readFile(join(root,attachment.consumerPath))));assert.equal(report.receipt.sha256,sha(await readFile(join(root,attachment.receiptPath))));
    const proof=JSON.parse(await readFile(join(root,proofPath),'utf8')),checkoutBuild=sha(await readFile(join(root,'dist/bundle.js')));assert.equal(checkoutBuild,proof.bundleHash);
    const reportFile=join(root,'work/atlas-reading-handoffs/implementation-reports',report.id+'.json'),reportBytes=sha(await readFile(reportFile));
    await section.getByText('Attach native playtest receipt',{exact:true}).click();
    await section.getByLabel('Public proof JSON path',{exact:true}).fill(proofPath);
    const attachedResponse=page.waitForResponse(response=>response.request().method()==='POST'&&response.url().endsWith(`/implementation-reports/${report.id}/playtests`));
    await section.getByRole('button',{name:'Attach playtest',exact:true}).click();const attached=await(await attachedResponse).json();assert.match(attached.id,/^[a-f0-9]{64}$/);
    const native=page.locator(`[data-playtest-id="${attached.id}"]`);
    const compare=async()=>{await native.getByRole('button',{name:'Compare checkout build',exact:true}).click();await native.getByText('Tested on this exact checkout build.',{exact:true}).waitFor();};
    await compare();await page.reload();await compare();
    const compareUrl=`${base}/reading-handoffs/${proposalId}/implementation-reports/${report.id}/playtests/${attached.id}/build-check`;
    const comparison=await(await page.request.get(compareUrl)).json();assert.equal(comparison.status,'exact-match');
    const retry=await page.request.post(`${base}/reading-handoffs/${proposalId}/implementation-reports/${report.id}/playtests`,{data:{proofPath}});assert.equal((await retry.json()).id,attached.id);
    assert.equal(sha(await readFile(reportFile)),reportBytes);assert.equal(sha(await readFile(join(root,'dist/bundle.js'))),checkoutBuild);
    await native.scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'workbench-native-exact-1920.png')});
    await section.scrollIntoViewIfNeeded();await mkdir(output,{recursive:true});await page.screenshot({path:join(output,'workbench-implementation-report.png')});
    assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const result={proposalId,reportId:report.id,consumer:report.consumer,receipt:report.receipt,playerRoute:report.playerRoute,priorReportIds:originalReportIds,
        preservedProposal:true,preservedPriorReports:true,reloaded:true,viewport:'1920x1080',currentFilesMatch:true,proofPath,checkoutBuildSha256:checkoutBuild,
        route:'#workbench/handoffs/'+proposalId,state:'actual persistent queue, normal form, agent-verified'};
    const refreshed=await(await page.request.get(base+'/reading-handoffs')).json();const nativeReceipt=refreshed.entries.find(entry=>entry.id===proposalId).implementationReports.find(entry=>entry.id===report.id).playtests.find(entry=>entry.id===attached.id);
    assert.equal(nativeReceipt.proof.sha256,sha(await readFile(join(root,proofPath))));
    const nativeResult={...result,nativePlaytest:{attachmentId:attached.id,proofSha256:nativeReceipt.proof.sha256,status:comparison.status,reloaded:true,idempotent:true,reportBytesUnchanged:true,testedBundleSha256:proof.bundleHash}};
    await writeFile(join(output,'workbench-playtest.json'),JSON.stringify(nativeResult,null,2)+'\n');console.log(JSON.stringify(nativeResult));
}finally{
    await browser?.close();if(server&&!server.killed){server.kill();await once(server,'exit').catch(()=>{});}
}
