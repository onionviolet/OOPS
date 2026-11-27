// Rebuilt desktop UI proof from a fresh Zorian entry, without setup grants.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Session} from '../scripts/playtest/lib.mjs';
import {serve} from '../scripts/perf/lib.mjs';
const [buildDir,output]=process.argv.slice(2);
assert(buildDir&&output,'Usage: node tests/mol_light_correction_browser.mjs BUILD_OUT EVIDENCE_DIR');
await mkdir(output,{recursive:true});
const server=await serve(path.resolve(buildDir));
const networkFailures=[];
// Absent private dependencies are disclosed, never replaced by fabricated packs
// or fonts. Unknown resource failures still fail this proof.
const absentPrivate=new Set(['/private_packs/manifest.json','/resources/fonts/private/gothic-bitmap-12.woff2','/resources/fonts/private/gothic-bitmap-14.woff2']);
const session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:1760000000000,opTimeout:20000,
    hooks:{beforeOpen:context=>context.on('response',response=>{
        if(response.status()>=400)networkFailures.push({status:response.status(),path:new URL(response.url()).pathname});
    })}}).start();
const P='book.mol.zorian.light.',command=P+'correct_formula',key=P+'formula_correction',resource='book.mol.loop.exam.rev.formulas';
const snapshot=()=>session.page.evaluate(()=>simulationTestHooks.snapshot());
const card=id=>session.page.locator(`[data-action-legibility-key="action:${id}"]`);
const button=id=>card(id).locator('button.action-legibility__button');
const completed=(s,id)=>s.expansion.actors.player.completed[id]??0;
const sessions=s=>s.expansion.actors.player.resources[resource]??0;
const reserve=s=>s.expansion.simulation.energies.player['book.mol.zorian.reserve'].reserve;
async function panel() {
    const p=session.page;
    await p.locator('#workspace_navigation select').selectOption('notebook');
    await p.locator('[data-notebook-view="here"]').click();
    const root=p.locator('#feature_expansion_panel');
    await root.evaluate(n=>{n.open=true;n.querySelectorAll('details').forEach(d=>{d.open=true;});});
    return root;
}
async function tick(minutes) {
    for(let i=0;i<minutes;i++)await session.page.evaluate(()=>simulationTestHooks.workTicks(1));
}
async function act(id,{finish=true}={}) {
    console.log('Action:',id);
    const b=button(id);await b.waitFor();
    await b.evaluate(n=>{for(let a=n.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;});
    assert(await b.isEnabled(),await card(id).innerText());await b.click();
    if(finish) {
        for(let i=0;i<50;i++) {
            if(!(await snapshot()).expansion.simulation.jobs.some(j=>j.actorId==='player'&&j.commandId===id))return;
            await tick(1);
        }
        assert.fail('Unsettled work: '+id);
    }
}
async function boot() {
    const p=session.page;await p.waitForFunction(()=>!!window.simulationTestHooks);
    await p.evaluate(()=>simulationTestHooks.pause());
    await p.waitForFunction(()=>document.getElementById('loading_screen_play_button')?.checkVisibility()||document.getElementById('loading_screen')?.style.visibility==='hidden');
    const play=p.locator('#loading_screen_play_button');if(await play.isVisible())await play.click({force:true});
}
try {
    console.log('Opening fresh life');
    await session.open();
    console.log('Taking Village doorway');
    const local=session.page.locator('#location_actions_div');
    await session.page.locator('[data-nearby-verb="talk:villageElder"]').click();
    for(const id of ['hello','what happened','ask to leave 1','need to'])await local.locator(`.talk-view [data-topic-id="${id}"]`).click();
    await session.page.locator('#center_mode_back').click();await session.step(3);await panel();
    await act('book.mol.chart');await act('book.mol.begin_zorian');
    await session.page.waitForFunction(()=>simulationTestHooks.snapshot().continuation?.lives[simulationTestHooks.snapshot().continuation.active]?.initial.expansion.motherOfLearning?.entryProfile==='book.mol.zorian@1');
    await panel();await act('book.mol.move.court');await act(P+'study_torch');
    assert.equal(await button(command).isEnabled(),false);
    assert.match(await card(command).innerText(),/Light the slate/);
    // An actual older cast is enough to start but expires before completion.
    await act(P+'torch');const cast=await snapshot();await session.step(2);const short=await snapshot();
    assert.equal(short.expansion.clock,cast.expansion.clock+2,'idle time ages the light');
    await act(command,{finish:false});await tick(5);
    const failed=await snapshot();assert.equal(sessions(failed),0);assert.equal(failed.expansion.simulation.knowledge.player[key],undefined);
    assert.equal(reserve(failed),reserve(short));assert.equal(await button(command).isEnabled(),false);
    await card(command).scrollIntoViewIfNeeded();
    await session.page.screenshot({path:path.join(output,'expired-light-1920.png')});
    // Torch's existing longer duration supports the same exercise.
    await act(P+'torch');const before=await snapshot();
    assert.match(await card(command).innerText(),/5 min|5 minutes/);
    await card(command).scrollIntoViewIfNeeded();
    await session.page.screenshot({path:path.join(output,'lit-exercise-1920.png')});
    await act(command);const done=await snapshot();
    assert.equal(sessions(done),1);assert.equal(completed(done,command),1);
    assert.equal(done.expansion.simulation.knowledge.player[key].stage,'understood');
    assert.equal(reserve(done),reserve(before));assert.equal(await card(command).count(),0);
    assert.match(await (await panel()).innerText(),/Formulas.*Revision 1 of 8/s);
    await session.page.getByText(/Revision 1 of 8/).first().scrollIntoViewIfNeeded();
    await session.page.screenshot({path:path.join(output,'corrected-formula-1920.png')});
    // Later use outside the paper: the same remembered work can replace the
    // longer empirical comparison, but costs real stamina instead of teaching shaping.
    await act(P+'read_heading');await panel();
    const adaptation=P+'adapt_correction';
    assert.equal(await button(adaptation).isEnabled(),true);
    assert.match(await card(adaptation).innerText(),/8 min|eight minutes/);
    assert.match(await card(adaptation).innerText(),/3 stamina|three stamina/);
    assert.equal(await button(P+'draft_oblique').count(),1,'the ordinary comparison remains reachable');
    await card(adaptation).scrollIntoViewIfNeeded();
    await session.page.screenshot({path:path.join(output,'later-choice-1920.png')});
    const laterBefore=await snapshot();await act(adaptation,{finish:false});const paid=await snapshot();
    assert.equal(paid.character.stamina_to_full,laterBefore.character.stamina_to_full+3);
    await tick(8);const laterDone=await snapshot();
    assert.equal(laterDone.expansion.clock,laterBefore.expansion.clock+8);
    assert.equal(sessions(laterDone),1);
    assert.equal(laterDone.expansion.simulation.knowledge.player[P+'shaping_control'],undefined);
    await act(P+'oblique');await act(P+'read_cut');
    const used=await snapshot();assert.equal(used.expansion.simulation.knowledge.player[P+'incisions'].stage,'understood');
    assert.equal(await card(adaptation).count(),0);
    await session.page.screenshot({path:path.join(output,'later-use-1920.png')});
    // Native durable save, reload, Export and literal Import.
    await session.page.locator('#save_button').click();
    await session.page.reload();await boot();let kept=await snapshot();
    assert.equal(sessions(kept),1);assert.equal(kept.expansion.simulation.knowledge.player[key].stage,'understood');
    const download=session.page.waitForEvent('download');await session.page.locator('#save_to_file_button').click();
    const savePath=path.join(output,'corrected-formula.save.txt');await (await download).saveAs(savePath);
    await Promise.all([session.page.waitForEvent('load',{timeout:30000}),session.page.locator('#saved_file_input').setInputFiles(savePath)]);
    await boot();kept=await snapshot();assert.equal(sessions(kept),1);assert.equal(completed(kept,command),1);
    assert.deepEqual(kept.expansion.simulation.knowledge.player[key],done.expansion.simulation.knowledge.player[key]);
    assert.equal(kept.expansion.simulation.knowledge.player[P+'oblique_formula'].stage,'understood');
    assert.equal(kept.expansion.simulation.knowledge.player[P+'incisions'].stage,'understood');
    await panel();assert.equal(await card(command).count(),0);
    const overflow=await session.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    assert.equal(overflow,false);
    const missing=[...new Map(networkFailures.map(item=>[item.path,item])).values()];
    assert.deepEqual(missing.filter(item=>item.status!==404||!absentPrivate.has(item.path)),[]);
    const applicationErrors=session.errors.filter(error=>error.kind==='pageerror'||!/^Failed to load resource:.*404/.test(error.text));
    assert.deepEqual(applicationErrors,[]);
    const bundleSha256=createHash('sha256').update(await readFile(path.join(buildDir,'dist/bundle.js'))).digest('hex');
    const receipt={bundleSha256,viewport:{width:1920,height:1080},route:'fresh native Zorian; earned Torch lesson, failed expiring-light exercise, successful fresh-Torch exercise; no setup grants',
        revision:sessions(kept),reserveBefore:reserve(before),reserveAfter:reserve(done),reload:true,exportImport:true,
        laterChoice:{minutes:8,stamina:3,ordinaryMinutes:15,obliqueInvocation:true,incisionsRead:true,shapingNotGranted:true},
        applicationErrors,missingPrivateResources:missing,consoleResource404s:session.errors.length,overflow};
    await writeFile(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
    console.log(JSON.stringify(receipt));
} catch(error) {
    console.error(error);
    await session.page?.screenshot({path:path.join(output,'failure-1920.png'),timeout:10000}).catch(()=>{});
    throw error;
} finally {
    console.log('Closing proof browser');
    let closed=false;
    const closing=session.browser.close().then(()=>{closed=true;});
    await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);
    if(!closed&&process.platform==='win32') {
        // The Windows browser can leave its pipe shutdown unresolved. Stop only
        // Chrome children of this disposable proof process, never other sessions.
        const query=`@(Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${process.pid}' | Where-Object { $_.Name -eq 'chrome.exe' } | Select-Object -ExpandProperty ProcessId) | ConvertTo-Json -Compress`;
        const raw=execFileSync('powershell.exe',['-NoProfile','-Command',query],{encoding:'utf8',windowsHide:true}).trim();
        const children=raw?JSON.parse(raw):[];
        for(const pid of Array.isArray(children)?children:[children]) {
            assert(Number.isInteger(pid)&&pid>0);
            try {execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}
            catch(error) {if(error.status!==128)throw error;}
        }
        await Promise.race([closing,new Promise(resolve=>setTimeout(resolve,5000))]);
    }
    console.log('Closing proof server');await server.close();
    console.log('Closed proof');
}
