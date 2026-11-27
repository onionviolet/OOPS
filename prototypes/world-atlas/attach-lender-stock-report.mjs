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
const proposalId='d36ab6955de9976f57e6204e1cecd183e12acdc64f322f694b686582aecdb773';
const attachment={consumerName:'Old Neil’s lendable Slumber stock from supplied mentor making',consumerPath:'src/lotm_charm_lender_stock.js',
    playerRoute:'Klein in Tingen: finish the workshop amulet commission → order Slumber supplies at the silver workshop → awake Old Neil in the Blackthorn armory → supply him to make a lendable Slumber charm → borrow. Return unused, or later craft and return a replacement. The native proof starts with zero charms in a prerequisite actor fixture; naturally reached cast entry remains unverified.',
    receiptPath:'docs/gm/dispatch/procedural-crafting-2026-11-11/LOTM_LENDER_STOCK_2026-11-25.md'};
const proofPath='docs/representations/evidence/lotm-lender-stock-2026-11-25/proof.json';
const output=join(root,'docs/representations/evidence/lotm-lender-stock-2026-11-25');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
let server,browser;const errors=[];
try{
    const env={...process.env,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;delete env.ATLAS_HANDOFFS;
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,stdio:['ignore','pipe','inherit'],windowsHide:true});
    const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.message));
    const before=await(await page.request.get(base+'/reading-handoffs')).json(),original=before.entries.find(entry=>entry.id===proposalId);assert(original);
    const originalReportIds=original.implementationReports.map(report=>report.id);
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
    await section.scrollIntoViewIfNeeded();await mkdir(output,{recursive:true});await page.screenshot({path:join(output,'workbench-second-report.png')});
    assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const result={proposalId,reportId:report.id,consumer:report.consumer,receipt:report.receipt,playerRoute:report.playerRoute,priorReportIds:originalReportIds,
        preservedProposal:true,preservedPriorReports:true,reloaded:true,viewport:'1920x1080',currentFilesMatch:true,proofPath,checkoutBuildSha256:checkoutBuild,
        route:'#workbench/handoffs/'+proposalId,state:'actual persistent queue, normal form, agent-verified'};
    await writeFile(join(output,'workbench-attachment.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{
    await browser?.close();if(server&&!server.killed){server.kill();await once(server,'exit').catch(()=>{});}
}
