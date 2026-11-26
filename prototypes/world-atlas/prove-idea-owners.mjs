// Ordinary local proposal evidence, rebuilt Atlas, desktop 1366 x 768.
import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {mkdirSync,mkdtempSync,readFileSync,realpathSync,rmSync,writeFileSync} from 'node:fs';
import {basename,dirname,join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),tempRoot=realpathSync(tmpdir());
const scratch=mkdtempSync(join(tempRoot,'atlas-idea-owners-')),snapshot=join(scratch,'snapshot.json');
const evidence=join(root,'docs/representations/evidence/atlas-idea-owners-2026-11-25');
const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'0'};
delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;delete env.ATLAS_HANDOFFS;
let server,browser;
try {
    execFileSync(process.execPath,['prototypes/world-atlas/build.mjs','--out',snapshot],{cwd:root,env,stdio:'inherit',windowsHide:true});
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((resolve,reject)=>{
        server.once('error',reject);server.once('exit',code=>reject(Error('Atlas stopped: '+code)));
        server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});
    });
    browser=await launchChrome();
    const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const owners=await(await page.request.get(base+'/idea-owners')).json();
    const queue=await(await page.request.get(base+'/reading-handoffs')).json();
    const quota=queue.entries.find(entry=>entry.source.prefix==='lotm1c127'&&entry.record.label==='Nighthawk practice-material quota');
    const upkeep=queue.entries.find(entry=>entry.source.prefix==='lotm1c127'&&entry.implementationReports?.length);
    assert(quota&&upkeep,'actual local proposals and attached upkeep report required');
    assert.equal(quota.proposal.backlog,'MR10/MR13/MR25-MR27/MR32; docs/MAKING_RULES.md; RA21 in READ_AHEAD_USE_2026-11-08.md');
    assert(owners.some(row=>row.reference==='docs/MAKING_RULES.md'));
    assert(owners.some(row=>row.reference.endsWith('/READ_AHEAD_USE_2026-11-08.md')));
    await page.goto(base+'/#workbench/ideas');
    await page.getByRole('heading',{name:'Ideas and backlogs',exact:true}).waitFor();
    const search=page.locator('.idea-owner-search input');await search.waitFor();
    await page.getByLabel('With saved handoffs').check();
    await search.fill('MAKING_RULES');
    const owner=page.locator('[data-owner-reference="docs/MAKING_RULES.md"]');await owner.waitFor();
    await owner.locator('.idea-owner-handoffs summary').click();
    await owner.getByRole('link',{name:quota.record.label,exact:true}).waitFor();
    await owner.getByRole('link',{name:upkeep.record.label,exact:true}).waitFor();
    assert.match(await owner.innerText(),/1 implementation report attached/);
    assert.match(await owner.innerText(),/not acceptance or completion/);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    mkdirSync(evidence,{recursive:true});
    await page.screenshot({path:join(evidence,'owner-reverse-links-1366.png'),fullPage:true});
    await owner.getByRole('link',{name:quota.record.label,exact:true}).click();
    const handoff=page.locator('[data-handoff-id="'+quota.id+'"]');await handoff.waitFor();
    assert((await handoff.innerText()).includes(quota.proposal.backlog));
    await page.reload();await page.locator('[data-handoff-id="'+quota.id+'"]').waitFor();
    await page.screenshot({path:join(evidence,'actual-quota-handoff-1366.png')});
    await page.goto(base+'/#workbench/ideas');await page.locator('.idea-owner-search input').waitFor();
    await page.getByLabel('Directory section').selectOption('Owners cited by reading handoffs');
    await page.locator('.idea-owner-search input').fill('READ_AHEAD_USE');
    assert.equal(await page.locator('.idea-owner-list > li').count(),1);
    await page.locator('.idea-owner-list summary').click();
    await page.getByRole('link',{name:quota.record.label,exact:true}).waitFor();
    await page.locator('.idea-owner-search input').fill('no-such-owner-20261125');
    assert.equal(await page.locator('.idea-owner-list > li').count(),0);
    assert.match(await page.getByRole('status').innerText(),/0 of 0 directory references/);
    await page.route('**/reading-handoffs',route=>route.fulfill({status:503,body:'temporarily unavailable'}));
    await page.reload();
    await page.getByText('The Workbench queue is unavailable. Linked proposals could not be checked.',{exact:true}).waitFor();
    assert.equal(await page.getByLabel('With saved handoffs').isDisabled(),true);
    assert(await page.locator('.idea-owner-list > li').count()>0,'the directory still loads when handoffs are unavailable');
    assert.deepEqual(errors,[]);
    const proof={viewport:'1366x768',snapshotSha256:createHash('sha256').update(readFileSync(snapshot)).digest('hex'),
        source:'actual local work/atlas-reading-handoffs; no synthetic packet or POST',directoryReferences:owners.length,
        quotaProposal:quota.id,upkeepProposal:upkeep.id,upkeepReports:upkeep.implementationReports.length,
        verified:['exact owner reverse links','typed multi-reference retained','attached report distinguished','unique filename shorthand','directory section filter','empty state','direct handoff refresh','no overflow','simulated handoff unavailability leaves directory usable and disables citation filter'],errors};
    writeFileSync(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
} finally {
    if(browser){
        const closing=browser.close();await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);
        if(process.platform==='win32'){
            const query=`@(Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${process.pid}' | Where-Object { $_.Name -eq 'chrome.exe' } | Select-Object -ExpandProperty ProcessId) | ConvertTo-Json -Compress`;
            const raw=execFileSync('powershell.exe',['-NoProfile','-Command',query],{encoding:'utf8',windowsHide:true}).trim(),children=raw?JSON.parse(raw):[];
            for(const pid of Array.isArray(children)?children:[children]){
                assert(Number.isInteger(pid)&&pid>0);
                try{execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}
                catch(error){if(error.status!==128){const alive=execFileSync('powershell.exe',['-NoProfile','-Command',`[bool](Get-Process -Id ${pid} -ErrorAction SilentlyContinue)`],{encoding:'utf8',windowsHide:true}).trim();if(alive==='True')throw error;}}
            }
        }
    }
    if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
    if(dirname(scratch)===tempRoot&&basename(scratch).startsWith('atlas-idea-owners-'))rmSync(scratch,{recursive:true,force:true});
}
process.exit(0);
