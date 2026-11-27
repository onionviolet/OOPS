import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
assert(existsSync(join(root,'work/atlas-snapshot/snapshot.json')),'use existing adopted snapshot; no rebuild');
const output=resolve(root,'docs/representations/evidence/atlas-route-export-2026-11-25');mkdirSync(output,{recursive:true});
let server,browser;const errors=[],requests=[];
try {
    const env={...process.env,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exit '+code)));server.stdout.setEncoding('utf8').on('data',data=>{const match=data.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:768},acceptDownloads:true});page.setDefaultTimeout(20000);page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>requests.push({method:request.method(),url:request.url().slice(base.length)}));
    await page.goto(base+'/#workbench/handoffs');
    const compare=page.getByRole('button',{name:'Compare playtests with this build',exact:true});await compare.waitFor();
    assert.equal(await page.getByRole('link',{name:'Export manual routes (JSON)',exact:true}).count(),0);
    const initialRows=await page.locator('.handoff-queue-entry').evaluateAll(nodes=>nodes.slice(0,3).map(node=>{const box=node.getBoundingClientRect();return {top:box.top,bottom:box.bottom};}));
    await page.screenshot({path:join(output,'queue-before-compare-1366.png')});
    const result=page.waitForResponse(response=>response.url()===base+'/reading-handoffs/build-check');await compare.click();const comparison=await(await result).json();
    const downloadLink=page.getByRole('link',{name:'Export manual routes (JSON)',exact:true});await downloadLink.waitFor({state:'visible'});
    const rows=page.locator('.handoff-queue-entry');const rectangles=await rows.evaluateAll(nodes=>nodes.slice(0,3).map(node=>{const box=node.getBoundingClientRect();return {top:box.top,bottom:box.bottom};}));
    await page.screenshot({path:join(output,'queue-after-compare-1366.png')});
    assert.equal(rectangles.length,3);
    await downloadLink.evaluate(node=>node.style.display='none');
    const withoutExport=await rows.evaluateAll(nodes=>nodes.slice(0,3).map(node=>{const box=node.getBoundingClientRect();return {top:box.top,bottom:box.bottom};}));
    await page.locator('a').filter({hasText:/^Export manual routes \(JSON\)$/}).evaluate(node=>node.style.removeProperty('display'));assert.deepEqual(rectangles,withoutExport,'export does not reduce existing comparison fit');
    const downloaded=page.waitForEvent('download');await downloadLink.click();
    const download=await downloaded;assert.equal(download.suggestedFilename(),'atlas-manual-routes.json');await download.saveAs(join(output,'atlas-manual-routes.json'));
    const exported=JSON.parse(readFileSync(join(output,'atlas-manual-routes.json'),'utf8'));
    assert.equal(exported.bundleSha256,comparison.bundleSha256);assert.equal(exported.counts.handoffsCompared,comparison.entries.length);
    const reports=exported.handoffs.flatMap(entry=>entry.reports);
    const examples=['src/hp_library_work.js','src/lotm_charm_materials.js','src/ui/feel_finish.js'].map(path=>{const report=reports.find(report=>report.consumer?.path===path);assert(report,'actual report '+path);assert(report.playerRoute);return {id:report.id,consumer:path,playerRoute:report.playerRoute,sourceStatus:report.sourceStatus,playtests:report.playtests};});
    await page.screenshot({path:join(output,'manual-routes-export-1366.png')});
    assert.deepEqual(errors,[]);assert(!requests.some(request=>request.method!=='GET'),'read-only browser requests');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const sha=file=>createHash('sha256').update(readFileSync(join(root,file))).digest('hex');
    const proof={schema:'atlas-route-export-proof/1',viewport:{width:1366,height:768},route:'/#workbench/handoffs',bundleSha256:comparison.bundleSha256,
        moduleSha256:sha('prototypes/world-atlas/handoff-route-export.mjs'),counts:exported.counts,examples,initialRows,firstThreeRows:rectangles,
        initialFullyVisible:initialRows.filter(row=>row.bottom<=768).length,comparedFullyVisible:rectangles.filter(row=>row.bottom<=768).length,comparisonWithoutExport:withoutExport,
        comparisonRequests:requests.filter(request=>request.url==='/reading-handoffs/build-check').length,mutatingRequests:0,errors,
        verified:['hidden before comparison','actual GET comparison exported','user download parsed','three existing manual gameplay routes retained','export preserves comparison row positions','no overflow','no mutation requests'],
        boundary:'Existing adopted Atlas snapshot and public local queue. This is navigation/export proof, not a new game playthrough or verification of reported prerequisites.'};
    writeFileSync(join(output,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
} finally {
    if(browser)await browser.close();
    if(server&&server.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
}
