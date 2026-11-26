// Real local backlog-first Harry work item. This does not create a reading row or run the game.
import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),snapshot=join(root,'work/atlas-snapshot/snapshot.json');
const owner='docs/research/GAMEPLAY_LOOPS_AND_WORLD_IDEAS_2026-10-26.md',consumer='src/hp_library_work.js';
const receipt='docs/gm/dispatch/play-surface-2026-11-14/HARRY_LIBRARY_WORK_2026-11-25.md';
const digest=path=>createHash('sha256').update(readFileSync(join(root,path))).digest('hex');
const consumerHash=digest(consumer),receiptHash=digest(receipt);
const evidence=join(root,'docs/representations/evidence/atlas-harry-idea-handoff-2026-11-25');
const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'49267'};delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;delete env.ATLAS_HANDOFFS;
const change='Use Harry’s already learned Levitation to retrieve the high-shelf Astronomy chart-book, copy and return it, then use his own notes for assigned homework. Keep the ladder alternative and paid failed attempts.';
const check='Prepared school-day native fixture: real Charms/wand and Astronomy actions; ladder or paid Levitation fizzle/success, copy/return and aided homework; Save/reload/Export/Import. Normal fresh entry is proven only through dressing/day-32 refusal, not the chart payoff.';
const route='At Hogwarts (book.hp.lead.school_hall), use the prepared school-day route after real Charms/wand actions: retrieve the chart-book by ladder or Levitation, copy/return it and use notes for Astronomy homework. Fixture persistence passed; normal fresh entry stops at the day-32 gate and missing private supplement, so an earned opening-to-library route remains unverified.';
let server,browser;
try{
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Atlas stopped: '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/#workbench/ideas');await page.locator('.idea-owner-search input').waitFor();await page.locator('.idea-owner-search input').fill('Gameplay loops and world ideas');
    const selected=page.locator('[data-owner-reference="'+owner+'"]');await selected.getByText('Browse ideas and checks in this owner',{exact:true}).click();
    const search=selected.getByRole('searchbox',{name:'Search entries in this owner'});await search.waitFor();await search.fill('N2');
    const row=selected.locator('[data-idea-code="N2"]'),ideaId=await row.getAttribute('data-idea-id');
    await row.getByText('Prepare a handoff from this entry',{exact:true}).click();const form=row.locator('.idea-handoff-form');
    await form.getByRole('textbox',{name:'What should the player be able to do?',exact:true}).fill(change);
    await form.getByRole('textbox',{name:'How would a playthrough prove it?',exact:true}).fill(check);
    mkdirSync(evidence,{recursive:true});await form.scrollIntoViewIfNeeded();await page.screenshot({path:join(evidence,'backlog-first-form-1366.png')});
    await form.getByRole('button',{name:'Save backlog-first handoff',exact:true}).click();
    const link=form.getByRole('link',{name:'Open this backlog-first handoff',exact:true});await link.waitFor();const hash=await link.getAttribute('href'),id=hash.split('/').at(-1);await link.click();
    const work=page.locator('[data-handoff-id="'+id+'"]');await work.waitFor();
    assert((await work.innerText()).includes('Backlog-first proposal'));assert.equal(await work.getByRole('link',{name:'Open batch output',exact:true}).count(),0);
    const queue=await(await page.request.get(base+'/reading-handoffs')).json(),packet=queue.entries.find(entry=>entry.id===id);
    assert.equal(packet.schema,'atlas-idea-handoff/1');assert.equal(packet.source.kind,'idea-owner');assert.equal(packet.source.ideaId,ideaId);
    assert.equal(packet.source.book,undefined);assert.equal(packet.source.prefix,undefined);assert.equal(packet.proposal.change,change);
    const name='Harry’s chart-book and Levitation school work';
    if(!packet.implementationReports?.some(report=>report.consumer.path===consumer&&report.receipt.path===receipt)){
        await work.getByText('Attach an implementation report',{exact:true}).click();
        await work.getByRole('textbox',{name:'Runtime consumer name',exact:true}).fill(name);
        await work.getByRole('textbox',{name:'Runtime consumer path',exact:true}).fill(consumer);
        await work.getByRole('textbox',{name:'Player entry or route',exact:true}).fill(route);
        await work.getByRole('textbox',{name:'Implementation receipt path',exact:true}).fill(receipt);
        await work.getByRole('button',{name:'Attach report',exact:true}).click();
    }
    await work.getByRole('heading',{name:'Implementation report attached',exact:true}).waitFor();
    await work.getByRole('button',{name:'Check owner version',exact:true}).click();
    await work.getByText('The current owner fingerprint and exact entry match this saved proposal.',{exact:true}).waitFor();
    assert((await work.innerText()).includes('Original backlog proposal'));assert((await work.innerText()).includes('prepared school-day route'));
    assert.equal(await work.getByRole('button',{name:'Check source version',exact:true}).count(),0);
    await page.reload();await work.getByRole('heading',{name:'Implementation report attached',exact:true}).waitFor();
    await page.screenshot({path:join(evidence,'harry-work-item-report-1366.png'),fullPage:true});
    await work.getByRole('link',{name:'Open this backlog entry',exact:true}).click();
    const focused=page.locator('[data-idea-id="'+ideaId+'"]');await focused.waitFor();assert.equal(await page.locator('.idea-owner-ideas [data-idea-id]').count(),1);
    await page.reload();await page.locator('[data-idea-id="'+ideaId+'"] .idea-handoff-form').waitFor({state:'attached'});
    const finalQueue=await(await page.request.get(base+'/reading-handoffs')).json(),saved=finalQueue.entries.find(entry=>entry.id===id);
    const report=saved.implementationReports.find(report=>report.consumer.path===consumer&&report.receipt.path===receipt);
    assert.equal(report.consumer.sha256,consumerHash);assert.equal(report.receipt.sha256,receiptHash);
    assert.equal(report.files.consumer.status,'unchanged');assert.equal(report.files.receipt.status,'unchanged');
    assert.equal(digest(receipt),receiptHash);assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const proof={viewport:'1366x768',proposalId:id,reportId:report.id,schema:saved.schema,source:saved.source,
        consumer:{path:consumer,sha256:consumerHash},receipt:{path:receipt,sha256:receiptHash},
        scope:'Existing composed school-day native proof; normal fresh entry reached dressing/day-32 refusal only, not chart payoff',
        verified:['backlog-first form without reading fields','real immutable local work item','existing native report attached','current file fingerprints match','owner-version comparison','deep exact-entry backlink and reload','legacy reading reports retained by backend regression','no game mutation or reading claim','no page errors or overflow'],errors};
    writeFileSync(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
}finally{
    if(browser){const closing=browser.close();await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);if(process.platform==='win32'){
        const raw=execFileSync('powershell.exe',['-NoProfile','-Command',`@(Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${process.pid}' | Where-Object { $_.Name -eq 'chrome.exe' } | Select-Object -ExpandProperty ProcessId) | ConvertTo-Json -Compress`],{encoding:'utf8',windowsHide:true}).trim(),children=raw?JSON.parse(raw):[];
        for(const pid of Array.isArray(children)?children:[children]){assert(Number.isInteger(pid)&&pid>0);try{execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}catch(error){if(error.status!==128)throw error;}}
    }}
    if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
}
process.exit(0);
