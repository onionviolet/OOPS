// The second real native consumer, with the adopted map and no HP reading rows.
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
const evidence=join(root,'docs/representations/evidence/atlas-hp-place-activities-2026-11-25');
const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_PORT:'49261'};delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;delete env.ATLAS_LOTM_CAST;
let server,browser;
try{
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Atlas stopped: '+code)));
        server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const data=await(await page.request.get(base+'/data')).json();
    assert.deepEqual(data.snapshot.failures,[]);
    assert.equal(data.placeActivities.hp.length,4);assert.equal(data.placeActivities.lotm.length,2);
    assert(data.placeActivities.hp.every(row=>row.location==='book.hp.lead.school_hall'&&!row.verification.handoffId));
    assert(data.others.some(row=>row.id==='book.hp.lead.school_hall'&&row.label==='Hogwarts, the Great Hall'));
    const reading=await page.request.get(base+'/readers/hp'),hpDigest=reading.ok()?await reading.json():null;
    assert(!hpDigest?.entities.length&&!hpDigest?.rules.length&&!hpDigest?.shards,'this actual proof exercises absent HP readings');
    await page.goto(base+'/#world/hp/places');
    const search=page.getByRole('searchbox',{name:'Find a place or local action'});await search.waitFor();await search.fill('Levitation');
    await page.locator('.atlas-tools').getByRole('button',{name:'Hogwarts, the Great Hall',exact:true}).click();
    const record=page.locator('.reader-place-record');await record.waitFor();
    const text=await record.innerText();
    for(const phrase of ['Move the library ladder','Bring the chart-book down with Levitation','Copy Astronomy notes','Use reference notes for Astronomy homework','1 stamina per try','Learn the Levitation Charm','authored working defaults','prepared school-day fixture','No admitted source-reading records','no separate library node'])assert(text.includes(phrase),phrase);
    assert.equal(await record.locator('a[href^="#workbench/handoffs/"]').count(),0);
    assert.equal(await page.locator('.canvas-box[data-id*="library"]').count(),0);
    assert(text.includes('Registered location. 4 bound local actions.'));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    mkdirSync(evidence,{recursive:true});await page.screenshot({path:join(evidence,'hogwarts-activities-1366.png')});
    const receipt=record.getByRole('link',{name:'Read Harry’s chart-book and Levitation gameplay receipt',exact:true});await receipt.scrollIntoViewIfNeeded();
    await page.screenshot({path:join(evidence,'hogwarts-evidence-1366.png')});
    await receipt.click();await page.waitForURL(base+'/activity-evidence/hp-library');assert((await page.locator('body').innerText()).includes("Harry's library chart work"));
    const lotmReceipt=await page.request.get(base+'/activity-evidence/lotm-materials');assert.equal(lotmReceipt.status(),200);
    assert((await lotmReceipt.text()).includes('First persistent reader-to-game trial'));
    assert.equal((await page.request.get(base+'/activity-evidence/not-a-public-receipt')).status(),404);
    await page.goto(base+'/#world/hp/places/book.hp.lead.school_hall');await page.getByRole('heading',{name:'Hogwarts, the Great Hall',exact:true}).waitFor();
    await page.reload();await page.getByRole('heading',{name:'Hogwarts, the Great Hall',exact:true}).waitFor();
    assert.equal(hash(),snapshotSha256);assert.deepEqual(errors,[]);
    const proof={snapshot:'work/atlas-snapshot/snapshot.json',snapshotSha256,viewport:'1366x768',hpReaderStatus:reading.status(),
        location:'book.hp.lead.school_hall',locationLabel:'Hogwarts, the Great Hall',activityIds:data.placeActivities.hp.map(row=>row.id),
        source:'adopted registered map and current native structured definitions; no source rows, game mutations or Workbench packet created',
        verified:['shared LOTM/HP projection','activity search','four native actions and real conditions/costs','registered hall without invented library node','absent-reading boundary','optional Workbench packet','exact public receipt links','unknown receipt rejected','direct route refresh','no overflow or page errors'],errors};
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
