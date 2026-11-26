// Exercise the adopted snapshot, never a synthetic or regenerated map.
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
const evidence=join(root,'docs/representations/evidence/atlas-place-activities-2026-11-25');
const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;
let server,browser;
try{
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Atlas stopped: '+code)));
        server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});});
    browser=await launchChrome();
    mkdirSync(evidence,{recursive:true});const errors=[];
    for(const width of [1366,1920]){
        const page=await browser.newPage({viewport:{width,height:width===1366?768:1080}});page.on('pageerror',error=>errors.push(error.message));
        const data=await(await page.request.get(base+'/data')).json();
        assert.deepEqual(data.snapshot.failures,[]);
        assert.equal(data.placeActivities.lotm.length,2);
        assert(data.placeActivities.lotm.every(row=>row.location==='lotm.place.night-watch-reception'));
        assert(!data.others.some(row=>row.id==='lotm.place.night-watch-reception'),'a command location is not promoted to a registered snapshot location');
        await page.goto(base+'/#world/lotm/places');
        const search=page.getByRole('searchbox',{name:'Find a place or local action'});await search.waitFor();
        await search.fill('Request a Slumber practice packet');
        await page.locator('.atlas-tools').getByRole('button',{name:'Blackthorn reception · native fixture',exact:true}).click();
        const record=page.locator('.reader-place-record');await record.waitFor();
        await record.getByRole('heading',{name:'What you can do here',exact:true}).waitFor();
        const text=await record.innerText();
        assert(text.includes('Request a Slumber practice packet'));assert(text.includes('Collect office-funded Slumber materials'));
        assert(text.includes('authored'));assert(text.includes('does not reset the monthly allocation'));
        assert(text.includes('named eligible-maker native fixture'));assert(text.includes('earned Klein route remains unverified'));
        assert(text.includes('no verified placement'));assert.doesNotMatch(text,/In OOPS · Registered location/);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
        await record.scrollIntoViewIfNeeded();await page.screenshot({path:join(evidence,'office-activities-'+width+'.png'),fullPage:true});
        await record.getByRole('link',{name:/Open source context:/}).first().click();
        await page.getByRole('heading',{name:'Nighthawk practice-material quota',exact:true}).waitFor();
        await page.reload();await page.getByRole('heading',{name:'Nighthawk practice-material quota',exact:true}).waitFor();
        await page.goto(base+'/#world/lotm/places/lotm.place.night-watch-reception');await page.locator('.reader-place-record').waitFor();
        await page.getByRole('link',{name:'Open Slumber making and use',exact:true}).scrollIntoViewIfNeeded();
        await page.screenshot({path:join(evidence,'office-activity-qualification-'+width+'.png')});
        assert.equal(await page.getByRole('link',{name:'Open office-materials handoff and reports',exact:true}).getAttribute('href'),'#workbench/handoffs/221e0889c81cd9655cfd425fb1688bd1d853032c8d1e1e4e2ea5a5ba6af05715');
        await page.getByRole('link',{name:'Open Slumber making and use',exact:true}).click();
        await page.locator('.making-item-record').getByRole('heading',{name:'Slumber charm',exact:true}).waitFor();
        await page.goto(base+'/#world/lotm/places/lotm.place.reception-area');await page.locator('.reader-place-record').waitFor();
        assert.doesNotMatch(await page.locator('.reader-place-record').innerText(),/Request a Slumber practice packet|named eligible-maker/);
        await page.getByRole('searchbox',{name:'Find a place or local action'}).fill('no-such-office-activity-20261125');
        await page.getByText('No matching places or linked actions.',{exact:true}).waitFor();
        await page.close();
    }
    assert.equal(hash(),snapshotSha256,'adopted snapshot stays unchanged');assert.deepEqual(errors,[]);
    const proof={snapshot:'work/atlas-snapshot/snapshot.json',snapshotSha256,viewports:['1366x768','1920x1080'],
        source:'adopted snapshot plus current exact native command projection; no cast mount, synthetic rows or game-state setup',
        activityIds:['lotm.craft.slumber-practice-approval.approve','lotm.craft.slumber-office-materials.collect'],
        verified:['activity search finds reception','source context route and reload','Slumber making route','authored/fixture/access boundaries','unplaced workshop retained','other source place not promoted','empty search','no page errors or overflow'],errors};
    writeFileSync(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
}finally{
    if(browser){const closing=browser.close();await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);
        if(process.platform==='win32'){
            const raw=execFileSync('powershell.exe',['-NoProfile','-Command',`@(Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${process.pid}' | Where-Object { $_.Name -eq 'chrome.exe' } | Select-Object -ExpandProperty ProcessId) | ConvertTo-Json -Compress`],{encoding:'utf8',windowsHide:true}).trim(),children=raw?JSON.parse(raw):[];
            for(const pid of Array.isArray(children)?children:[children]){assert(Number.isInteger(pid)&&pid>0);try{execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}catch(error){if(error.status!==128)throw error;}}
        }}
    if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
}
process.exit(0);
