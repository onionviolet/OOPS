import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {mkdirSync,mkdtempSync,readFileSync,writeFileSync,realpathSync,rmSync} from 'node:fs';
import {join,dirname,basename} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
import {readHandoffs} from './reading-handoffs.mjs';
import {CITED_REFERENCE_LIMIT} from './cited-reference-contract.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),snapshot=join(root,'work/atlas-snapshot/snapshot.json');
const snapshotSha256=createHash('sha256').update(readFileSync(snapshot)).digest('hex');
const tempRoot=realpathSync(tmpdir()),scratch=mkdtempSync(join(tempRoot,'atlas-structured-backlog-'));
const owner='docs/gm/artifact-collection/ACCEPTANCE_BACKLOG.md',evidence=join(root,'docs/representations/evidence/atlas-structured-backlogs-2026-11-25');
const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'49265',ATLAS_HANDOFFS:join(scratch,'fixture-queue')};delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;
const actual=await readHandoffs(join(root,'work/atlas-reading-handoffs')),source=actual.entries.find(entry=>entry.source.prefix==='lotm1c127')?.source;
assert(source,'actual local source route required; saves go to the isolated fixture queue');
let server,browser;
try{
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Atlas stopped: '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];let contentRequests=0;
    page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(new URL(request.url()).pathname==='/idea-owner-ideas')contentRequests++;});
    async function openOwner(){await page.goto(base+'/#workbench/ideas');await page.locator('.idea-owner-search input').waitFor();await page.locator('.idea-owner-search input').fill('gm/artifact-collection/ACCEPTANCE_BACKLOG.md');const selected=page.locator('[data-owner-reference="'+owner+'"]');await selected.waitFor();await selected.getByText('Browse ideas and checks in this owner',{exact:true}).click();await selected.getByRole('searchbox',{name:'Search entries in this owner'}).waitFor();return selected;}
    await page.goto(base+'/#workbench/ideas');await page.locator('.idea-owner-search input').waitFor();assert.equal(contentRequests,0);
    const selected=await openOwner();assert.equal(contentRequests,1);
    const response=await(await page.request.get(base+'/idea-owner-ideas?'+new URLSearchParams({owner}))).json();
    assert.equal(response.rows.length,5);assert(response.rows.every(row=>row.code===null&&row.kind==='acceptance-check'));
    const entry=response.rows[0],row=selected.locator('[data-idea-id="'+entry.id+'"]');assert.equal(await row.getAttribute('data-idea-code'),null);
    assert(entry.lineEnd>entry.lineStart);assert((await row.innerText()).includes('Acceptance check from source backlog'));
    assert((await row.innerText()).includes('seller/native bag/money/stock'));
    mkdirSync(evidence,{recursive:true});await row.scrollIntoViewIfNeeded();await page.screenshot({path:join(evidence,'uncoded-acceptance-1366.png'),fullPage:true});
    await row.getByRole('button',{name:'Cite this exact entry in a handoff'}).click();
    await page.goto(base+'/#library/outputs/'+[source.book,source.prefix,source.pass,source.kind].map(encodeURIComponent).join('/'));
    await page.getByText('Prepare a gameplay handoff',{exact:true}).click();
    const input=page.getByRole('textbox',{name:'Backlog reference (optional)',exact:true});assert.equal(await input.inputValue(),entry.reference);assert.equal(await input.getAttribute('maxlength'),String(CITED_REFERENCE_LIMIT));
    await page.getByRole('textbox',{name:'What should the player be able to do?',exact:true}).fill('Fixture-only acceptance-link check; no implementation or task is assigned.');
    await page.getByRole('textbox',{name:'How would a playthrough prove it?',exact:true}).fill('Fixture-only: preserve the uncoded source entry and its exact reference.');
    await page.getByRole('button',{name:'Save to Workbench',exact:true}).click();await page.getByRole('link',{name:'Open implementation handoffs',exact:true}).click();
    await page.getByRole('heading',{name:'Implementation handoffs',exact:true}).waitFor();
    const queue=await(await page.request.get(base+'/reading-handoffs')).json();assert.equal(queue.entries.length,1);assert.equal(queue.entries[0].proposal.backlog,entry.reference);
    const again=await openOwner(),saved=again.locator('[data-idea-id="'+entry.id+'"]');await saved.getByText('1 saved handoff cite this exact entry. This is not its implementation status.',{exact:false}).waitFor();
    await saved.scrollIntoViewIfNeeded();await page.screenshot({path:join(evidence,'fixture-citation-1366.png'),fullPage:true});
    const resolved=await(await page.request.get(base+'/idea-owner-ideas?'+new URLSearchParams({owner:queue.entries[0].proposal.backlog}))).json();assert.equal(resolved.rows[0].id,entry.id);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
    const proof={viewport:'1366x768',owner,documentHash:response.documentHash,entry:{id:entry.id,code:entry.code,kind:entry.kind,reference:entry.reference,lineStart:entry.lineStart,lineEnd:entry.lineEnd},
        fixturePacket:queue.entries[0].id,savedOnlyIn:'isolated temporary ATLAS_HANDOFFS queue; removed after proof',referenceLimit:CITED_REFERENCE_LIMIT,
        initialContentRequests:0,afterBrowseContentRequests:1,snapshotSha256,
        verified:['five real uncoded multiline acceptance checks','no invented code','source-kind label not status inference','actual browser fixture save','immutable reference resolves','owner and exact-entry reverse citation','shared UI/server/parser bound','no page errors or overflow'],errors};
    writeFileSync(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
}finally{
    if(browser){const closing=browser.close();await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);if(process.platform==='win32'){
        const raw=execFileSync('powershell.exe',['-NoProfile','-Command',`@(Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${process.pid}' | Where-Object { $_.Name -eq 'chrome.exe' } | Select-Object -ExpandProperty ProcessId) | ConvertTo-Json -Compress`],{encoding:'utf8',windowsHide:true}).trim(),children=raw?JSON.parse(raw):[];
        for(const pid of Array.isArray(children)?children:[children]){assert(Number.isInteger(pid)&&pid>0);try{execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}catch(error){if(error.status!==128)throw error;}}
    }}
    if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
    if(dirname(scratch)===tempRoot&&basename(scratch).startsWith('atlas-structured-backlog-'))rmSync(scratch,{recursive:true,force:true});
}
process.exit(0);
