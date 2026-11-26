import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),snapshot=join(root,'work/atlas-snapshot/snapshot.json');
const hash=()=>createHash('sha256').update(readFileSync(snapshot)).digest('hex'),snapshotSha256=hash();
const owner='docs/research/GAMEPLAY_LOOPS_AND_WORLD_IDEAS_2026-10-26.md';
const evidence=join(root,'docs/representations/evidence/atlas-owner-ideas-2026-11-25');
const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'49263'};delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;
let server,browser;
try{
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Atlas stopped: '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];let contentRequests=0;
    page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(new URL(request.url()).pathname==='/idea-owner-ideas')contentRequests++;});
    await page.goto(base+'/#workbench/ideas');await page.locator('.idea-owner-search input').waitFor();
    await page.locator('.idea-owner-search input').fill('Gameplay loops and world ideas');
    const selected=page.locator('[data-owner-reference="'+owner+'"]');await selected.waitFor();
    assert.equal(contentRequests,0,'directory load and owner search do not read owner contents');
    await selected.getByText('Browse ideas and checks in this owner',{exact:true}).click();
    const panel=selected.locator('.idea-owner-ideas'),search=panel.getByRole('searchbox',{name:'Search entries in this owner'});await search.waitFor();
    assert.equal(contentRequests,1,'only the selected owner is fetched');
    await search.fill('A1');assert.equal(await panel.locator('[data-idea-code="A1"]').count(),2);
    const a1=await panel.locator('[data-idea-code="A1"]').evaluateAll(rows=>rows.map(row=>row.dataset.ideaId));assert.notEqual(a1[0],a1[1]);
    await search.fill('P2');assert.equal(await panel.locator('[data-idea-code="P2"]').count(),1);
    await search.fill('N2');const row=panel.locator('[data-idea-code="N2"]');await row.waitFor();
    assert.equal(await panel.locator('[data-idea-id]').count(),1,'a code query does not match codes cited inside other entries');
    assert((await row.innerText()).includes('LATER / DELEGATE, proposals only'));
    const id=await row.getAttribute('data-idea-id'),reference=owner+'#idea-'+id;
    const verify=await row.getByRole('link',{name:'Verify this exact entry in its owner'}).getAttribute('href');
    const checked=await(await page.request.get(base+verify)).json();assert.equal(checked.rows[0].reference,reference);assert.equal(checked.rows[0].code,'N2');
    const lookup=await page.request.get(base+'/idea-owner-ideas?'+new URLSearchParams({owner:reference}));assert.equal(lookup.status(),200);
    assert.equal((await lookup.json()).rows[0].id,id);
    await row.scrollIntoViewIfNeeded();mkdirSync(evidence,{recursive:true});await page.screenshot({path:join(evidence,'gameplay-N2-1366.png'),fullPage:true});
    await row.getByRole('button',{name:'Cite this exact entry in a handoff'}).click();
    assert.equal(await page.evaluate(()=>sessionStorage.getItem('atlas-handoff-backlog')),reference);
    const queue=await(await page.request.get(base+'/reading-handoffs')).json(),source=queue.entries.find(entry=>entry.source.prefix==='lotm1c127')?.source;assert(source,'actual local output is required for the unsubmitted handoff form');
    await page.goto(base+'/#library/outputs/'+[source.book,source.prefix,source.pass,source.kind].map(encodeURIComponent).join('/'));
    await page.getByText('Prepare a gameplay handoff',{exact:true}).click();
    assert.equal(await page.getByRole('textbox',{name:'Backlog reference (optional)',exact:true}).inputValue(),reference);
    assert.equal((await page.request.get(base+'/idea-owner-ideas?'+new URLSearchParams({owner,idea:'0'.repeat(64)}))).status(),404);
    for(const restricted of ['docs/private/BACKLOG.md','docs/%2e%2e/outside.md'])assert.equal((await page.request.get(base+'/idea-owner-ideas?'+new URLSearchParams({owner:restricted}))).status(),400);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);assert.equal(hash(),snapshotSha256);
    const proof={viewport:'1366x768',owner,documentHash:checked.documentHash,idea:{id,code:'N2',reference,sourceReference:checked.rows[0].sourceReference},
        snapshotSha256,initialContentRequests:0,afterBrowseContentRequests:1,
        verified:['one owner fetched on demand','N2 and rank-table P2','distinct section-scoped A1 identities','exact source-hash reference resolves','owner reference prefilled in actual unsubmitted handoff','unknown ID refused','private/escaped paths refused','no overflow or page errors'],
        boundary:'No source reading, saved real proposal, game state or owner text changed; immutable save/drift is tested in a throwaway fixture',errors};
    writeFileSync(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
}finally{
    if(browser){const closing=browser.close();await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);if(process.platform==='win32'){
        const raw=execFileSync('powershell.exe',['-NoProfile','-Command',`@(Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${process.pid}' | Where-Object { $_.Name -eq 'chrome.exe' } | Select-Object -ExpandProperty ProcessId) | ConvertTo-Json -Compress`],{encoding:'utf8',windowsHide:true}).trim(),children=raw?JSON.parse(raw):[];
        for(const pid of Array.isArray(children)?children:[children]){assert(Number.isInteger(pid)&&pid>0);try{execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}catch(error){if(error.status!==128)throw error;}}
    }}
    if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
}
process.exit(0);
