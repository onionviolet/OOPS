// Actual chapter-127 rule qualification, through the ordinary rebuilt Atlas.
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
const scratch=mkdtempSync(join(tempRoot,'atlas-rule-qualification-')),snapshot=join(scratch,'snapshot.json');
const evidence=join(root,'docs/representations/evidence/atlas-rule-qualification-2026-11-25');
const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'0'};
delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;
let server,browser;
const normal=text=>text.replace(/\s+/g,' ').trim();
try {
    execFileSync(process.execPath,['prototypes/world-atlas/build.mjs','--out',snapshot],{cwd:root,env,stdio:'inherit',windowsHide:true});
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((resolve,reject)=>{
        server.once('error',reject);server.once('exit',code=>reject(Error('Atlas stopped: '+code)));
        server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});
    });
    browser=await launchChrome();
    const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const digest=await (await page.request.get(base+'/readers/lotm')).json();
    const craft=digest.rules.find(row=>row.id==='lotm.craft.charm-making');
    const upkeep=digest.rules.find(row=>row.id==='lotm.craft.charm-recharge');
    const shown=digest.rules.find(row=>row.id.endsWith('spirit-vision-trigger'));
    const inferred=digest.rules.find(row=>row.id.endsWith('seer-acting-hypothesis'));
    assert(craft&&upkeep&&shown&&inferred,'actual chapter-127 rules are required; no synthetic substitute');
    assert.equal(craft.label,'T');assert.equal(shown.label,'S');assert.equal(inferred.label,'I');
    assert(craft.acquisition.some(row=>row.teacher==='lotm.person.old-neil'&&row.progressSign));
    assert(craft.limits.length&&upkeep.limits.length);
    mkdirSync(evidence,{recursive:true});
    for(const rule of [craft,upkeep]) {
        await page.goto(base+'/#world/lotm/making/'+encodeURIComponent('working:'+rule.id));
        const record=page.locator('.making-item-record').filter({has:page.getByRole('heading',{name:rule.name,exact:true})});
        await record.waitFor();
        const text=normal(await record.innerText());
        for(const limit of rule.limits)assert(text.includes(normal(limit)),rule.id+' retains its qualification');
        for(const row of rule.acquisition||[]) {
            if(row.teacher)assert(text.includes(row.teacher)||await record.locator('a').evaluateAll((links,id)=>
                links.some(link=>link.getAttribute('href')==='#world/lotm/things/'+encodeURIComponent(id)),row.teacher),'teacher reference is retained');
            if(row.progressSign)assert(text.includes(normal(row.progressSign)),'learning progress is retained');
        }
        assert(text.includes('Stated'),'the source evidence remains stated');
        if(rule===upkeep) {
            assert(text.includes('Slumber charms only'));
            assert(text.includes('Agent-verified upkeep'));
            assert(text.includes('synthetic aged-charm workshop'));
            assert(text.includes('earned Klein route and other charm variants remain unverified'));
            assert(await record.getByRole('link',{name:'Open upkeep source check and gameplay qualification'}).count());
            assert.doesNotMatch(text,/In OOPS · Bound game command\./);
        }
        assert.doesNotMatch(text,/[A-Z]:[\\/]|\.epub|PRIVATE_|SEALED_/);
        await page.screenshot({path:join(evidence,rule===craft?'charm-making-1920.png':'charm-upkeep-1920.png')});
    }
    await page.goto(base+'/#world/lotm/making/lotm.item.slumber-charm');
    const slumberStatus=page.locator('.making-item-status');await slumberStatus.waitFor();
    assert.match(await slumberStatus.innerText(),/Slumber-only upkeep is agent-verified on a synthetic aged-charm workshop/);
    for(const [rule,label,other] of [[inferred,'Inferred',/Stated|Shown/],[shown,'Shown',/Stated|Inferred/]]) {
        await page.goto(base+'/#world/lotm/things/'+encodeURIComponent(rule.id));
        const record=page.locator('.making-item-record').filter({has:page.getByRole('heading',{name:rule.name,exact:true})});await record.waitFor();
        await record.getByText('Source and coverage references',{exact:true}).click();
        const source=record.getByRole('heading',{name:'Source evidence',exact:true}).locator('..');
        assert((await source.innerText()).includes(label));assert.doesNotMatch(await source.innerText(),other);
        await source.scrollIntoViewIfNeeded();
        await page.screenshot({path:join(evidence,label.toLowerCase()+'-rule-1920.png')});
    }
    await page.reload();await page.getByRole('heading',{name:shown.name,exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.deepEqual(errors,[]);
    const receipt={viewport:'1920x1080',snapshotSha256:createHash('sha256').update(readFileSync(snapshot)).digest('hex'),
        source:'actual registry and local chapter-127 reading outputs; no synthetic rows',
        rules:[craft,upkeep,shown,inferred].map(row=>({id:row.id,label:row.label,sources:row.sources})),
        visible:['making limits','teacher reference','learning progress','source evidence','inference distinction'],errors};
    writeFileSync(join(evidence,'proof.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
} catch(error) {
    console.error(error);throw error;
} finally {
    if(browser) {
        const closing=browser.close();
        await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);
        if(process.platform==='win32') {
            const query=`@(Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${process.pid}' | Where-Object { $_.Name -eq 'chrome.exe' } | Select-Object -ExpandProperty ProcessId) | ConvertTo-Json -Compress`;
            const raw=execFileSync('powershell.exe',['-NoProfile','-Command',query],{encoding:'utf8',windowsHide:true}).trim();
            const children=raw?JSON.parse(raw):[];
            for(const pid of Array.isArray(children)?children:[children]) {
                assert(Number.isInteger(pid)&&pid>0);
                try {execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}
                catch(error){
                    // Chrome can exit between the child inventory and taskkill.
                    const alive=execFileSync('powershell.exe',['-NoProfile','-Command',`[bool](Get-Process -Id ${pid} -ErrorAction SilentlyContinue)`],{encoding:'utf8',windowsHide:true}).trim();
                    if(alive==='True')throw error;
                }
            }
            await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);
        }
    }
    if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
    if(dirname(scratch)===tempRoot&&basename(scratch).startsWith('atlas-rule-qualification-'))rmSync(scratch,{recursive:true,force:true});
}
// This standalone proof has no work after its durable receipt and owned cleanup.
// Release lingering Playwright pipe handles on Windows after successful teardown.
process.exit(0);
