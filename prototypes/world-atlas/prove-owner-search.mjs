import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),evidence=process.argv[2]?resolve(process.argv[2]):join(root,'docs/representations/evidence/atlas-owner-search-2026-11-25');
const env={...process.env,ATLAS_PORT:'49269'};delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;
let server,browser;
try{
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Atlas stopped: '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];let searches=0;
    page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(new URL(request.url()).pathname==='/idea-owner-search')searches++;});
    await page.goto(base+'/#workbench/ideas');await page.getByRole('searchbox',{name:'Search across idea owners'}).waitFor();
    assert.equal(searches,0,'plain directory performs no cross-owner content scan');
    await page.getByRole('searchbox',{name:'Search across idea owners'}).fill('gear');await page.getByRole('button',{name:'Search all idea owners',exact:true}).click();
    const region=page.getByRole('region',{name:'Cross-owner search results'});await region.locator('[data-search-idea-id]').first().waitFor();assert.equal(searches,1);
    const result=await(await page.request.get(base+'/idea-owner-search?q=gear')).json();assert(result.total>25);assert.equal(result.rows.length,25);
    assert.equal(await region.locator('[data-search-idea-id]').count(),25);
    const target=result.rows.find(row=>row.code==='EI24')||result.rows.find(row=>row.ownerReference!=='docs/research/GAMEPLAY_LOOPS_AND_WORLD_IDEAS_2026-10-26.md');assert(target);
    const inFirstScreen=await region.locator('[data-search-idea-id]').evaluateAll(items=>items.filter(item=>{
        const box=item.getBoundingClientRect();return box.top>=0&&box.bottom<=innerHeight;
    }).length);
    assert(inFirstScreen>=2,'at least two complete results can be compared before scrolling');
    const preview=region.locator('[data-search-idea-id]').first().locator('details');
    await preview.locator('summary').click();
    assert(await preview.locator('code').isVisible(),'source lines remain available from the results');
    await preview.locator('summary').click();
    mkdirSync(evidence,{recursive:true});await page.screenshot({path:join(evidence,'gear-search-1366.png')});
    await region.locator('[data-search-idea-id="'+target.id+'"]').getByRole('link',{name:'Open exact entry',exact:true}).click();
    const entry=page.locator('[data-idea-id="'+target.id+'"]');await entry.waitFor();assert.equal(await page.locator('.idea-owner-ideas [data-idea-id]').count(),1);
    assert((await entry.innerText()).includes(target.entryLabel));assert((await entry.innerText()).includes(target.ownerReference));
    await page.reload();await page.locator('[data-idea-id="'+target.id+'"] .idea-handoff-form').waitFor({state:'attached'});
    await page.screenshot({path:join(evidence,'gear-exact-source-1366.png'),fullPage:true});
    await page.goto(base+'/#workbench/ideas/search?q=gear&offset=0');await page.getByRole('link',{name:'Next results',exact:true}).waitFor();await page.getByRole('link',{name:'Next results',exact:true}).click();
    await page.getByRole('region',{name:'Cross-owner search results'}).getByText(/^26–50 of /).waitFor();
    const sharedSearch=page.url().slice(base.length);await page.reload();await page.getByRole('region',{name:'Cross-owner search results'}).getByText(/^26–50 of /).waitFor();
    assert.equal(await page.getByRole('searchbox',{name:'Search across idea owners'}).inputValue(),'gear');
    await page.getByRole('searchbox',{name:'Search across idea owners'}).fill('N2');await page.getByRole('button',{name:'Search all idea owners',exact:true}).click();
    await page.getByRole('region',{name:'Cross-owner search results'}).getByText(/exact code match/).waitFor();
    const code=await(await page.request.get(base+'/idea-owner-search?q=N2')).json();assert(code.rows.length>1);assert(code.rows.every(row=>row.code==='N2'));
    assert.equal((await page.request.get(base+'/idea-owner-search?q=gear&limit=51')).status(),400);
    assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const proof={viewport:'1366x768',query:'gear',matches:result.total,ownerFilesSearched:result.ownerFilesSearched,ownerFilesRead:result.ownerFilesRead,
        initialSearchRequests:0,afterSubmitSearchRequests:1,pageSize:result.limit,sharedSecondPage:sharedSearch,
        opened:{owner:target.ownerReference,id:target.id,code:target.code,kind:target.kind,documentHash:target.documentHash},exactCodeQuery:'N2',exactCodeMatches:code.total,
        verified:['explicit submit without startup scan','25-row bounded results','source labels retained','another owner exact detail and reload','shareable second page and reload','exact duplicate codes across owners','oversized page refused','no page errors or overflow'],
        boundary:'No owner text, proposal, report or game state written. Source drift/privacy/metric regression uses removed test fixtures.',errors};
    writeFileSync(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
}finally{
    if(browser){const closing=browser.close();await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);if(process.platform==='win32'){
        const raw=execFileSync('powershell.exe',['-NoProfile','-Command',`@(Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${process.pid}' | Where-Object { $_.Name -eq 'chrome.exe' } | Select-Object -ExpandProperty ProcessId) | ConvertTo-Json -Compress`],{encoding:'utf8',windowsHide:true}).trim(),children=raw?JSON.parse(raw):[];
        for(const pid of Array.isArray(children)?children:[children]){assert(Number.isInteger(pid)&&pid>0);try{execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}catch(error){if(error.status!==128)throw error;}}
    }}
    if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
}
process.exit(0);
