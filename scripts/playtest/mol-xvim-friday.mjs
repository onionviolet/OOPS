// Plays the scheduled lesson from the exact after-drill export on a fresh origin.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {molSensingAppointmentAt} from '../../src/mol_zorian_sensing.js';
import {validateSaveEnvelope} from '../../src/save_files.js';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';

const [buildDir, seedFile, output] = process.argv.slice(2);
assert(buildDir && seedFile && output,
    'Usage: node scripts/playtest/mol-xvim-friday.mjs <BUILD_OUT> <after-drill.save.json> <evidence dir>');
await mkdir(output,{recursive:true});
const bytes = await readFile(seedFile);
const seed = JSON.parse(bytes);
const digest = data => createHash('sha256').update(data).digest('hex');
const server = await serve(path.resolve(buildDir));
const session = await new Session({url:server.url+'?test_hooks=1',seed:7,wall:1760000000000,opTimeout:60000}).start();

const prefix = 'book.mol.zorian.s2.';
const wait = prefix+'wait_for_xvim', open = prefix+'start_sensing', respond = prefix+'report_uncertainty';
const guess = prefix+'guess_left';
const critique = prefix+'xvim_critique', drill = 'book.mol.zorian.s1.skip_class_drill';
const lecture = 'book.mol.zorian.s0.invocations_class', xvim = 'book.mol.xvim';
const clock = save => save.expansion.clock;
const completions = save => save.expansion.actors.player.completed;
const attention = save => save.expansion.actors[xvim].resources['book.mol.attention'];
const job = (save, id) => save.expansion.simulation.jobs.find(j=>j.commandId===id && j.actorId==='player');
const snapshot = () => session.page.evaluate(() => simulationTestHooks.snapshot());
const card = id => session.page.locator(`[data-action-legibility-key="action:${id}"]`);
const action = id => card(id).locator('button.action-legibility__button');

async function boot() {
    const page = session.page;
    await page.waitForFunction(() => window.simulationTestHooks &&
        (document.getElementById('loading_screen_play_button')?.checkVisibility() ||
        document.getElementById('loading_screen')?.style.visibility === 'hidden'),null,{timeout:60000});
    await page.evaluate(() => simulationTestHooks.pause());
    const play = page.locator('#loading_screen_play_button');
    if (await play.isVisible()) await play.click({force:true});
}
async function panel() {
    const page = session.page;
    await page.locator('#workspace_navigation select').selectOption('notebook');
    await page.locator('[data-notebook-view="here"]').click();
    const p = page.locator('#feature_expansion_panel');
    if (!await p.evaluate(n => n.open)) await p.locator(':scope > summary').click();
    const section = p.locator(':scope > div > details').filter({has:page.locator('summary').filter({hasText:/Mother of Learning/})}).first();
    if (!await section.evaluate(n => n.open)) await section.locator(':scope > summary').click();
    return section;
}
async function act(id) {
    const button = action(id);
    await button.waitFor();
    assert(await button.isEnabled(),await card(id).innerText());
    await button.click();
}
async function settle(id) {
    for (let i=0; i<12; i++) {
        if (!job(await snapshot(),id)) return;
        await session.page.evaluate(() => simulationTestHooks.workTicks(20));
    }
    assert.fail('Timed action did not settle: '+id);
}

try {
    validateSaveEnvelope(seed,seed['game version']);
    const at = molSensingAppointmentAt(seed.expansion);
    await session.open(seed);
    const page = session.page;
    const loaded = await snapshot();
    assert.equal(clock(loaded),clock(seed));
    assert.equal(completions(loaded)[drill],1);
    assert.equal(completions(loaded)[lecture],undefined);
    assert.equal(loaded.expansion.motherOfLearning.runs,2);
    await panel();
    assert(await action(open).isDisabled());
    assert.match(await card(open).innerText(),/Friday/);
    await act(wait);
    const before = await snapshot();
    assert.equal(job(before,wait).due,at);
    await page.evaluate(() => simulationTestHooks.workTicks(1));
    const waiting = await session.save();
    assert.equal(clock(waiting)-clock(before),120,'a native tick advances bounded local waiting');
    assert.equal(job(waiting,wait).due,at);

    await page.reload();
    await boot();
    const pending = await snapshot();
    assert.equal(job(pending,wait).due,at,'reload restores the pending wait');
    assert(clock(pending)>=clock(waiting));
    await panel();
    await act(job(pending,wait).id+'.cancel');
    const stopped = await snapshot();
    assert.equal(job(stopped,wait),undefined);
    assert.equal(clock(stopped),clock(pending),'stopping keeps the time already spent');
    await act(wait);
    await settle(wait);
    const ready = await snapshot();
    assert.equal(clock(ready),at,'the pending wait stops at Friday’s exact opening');
    assert.equal(attention(ready),attention(seed),'waiting uses no teacher attention');
    assert.equal(completions(ready)[wait],1);
    await panel();
    await act(open);
    assert.equal(job(await snapshot(),open).due,at+15);
    await settle(open);
    const practice = await snapshot();
    assert.equal(clock(practice),at+15);
    assert.equal(attention(practice),attention(seed)-1);
    assert.equal(completions(practice)[open],1);
    assert.equal(practice.expansion.simulation.knowledge.player[critique],undefined);
    await action(respond).waitFor();
    await action(respond).scrollIntoViewIfNeeded();
    assert(await action(guess).isEnabled());
    const otherChoice = await action(guess).boundingBox();
    assert(otherChoice && otherChoice.y + otherChoice.height <= 1080,'both responses fit on the desktop');
    await page.screenshot({path:path.join(output,'response-1920.png')});
    await act(respond);
    await settle(respond);
    const result = await session.save();
    const note = result.expansion.simulation.knowledge.player[critique];
    assert.equal(note.basis.attributedTo,xvim);
    assert.match(note.value,/tell me where you lost it/);
    assert.equal(clock(result),at+30);
    assert.equal(completions(result)[respond],1);
    assert.equal(completions(result)[drill],1);
    assert.equal(completions(result)[lecture],undefined);
    assert.equal(result.expansion.actors.player.facts['book.mol.invocationStudied'],true);
    assert.deepEqual(result.expansion.motherOfLearning.divergence,seed.expansion.motherOfLearning.divergence);
    assert.deepEqual(result.expansion.simulation.energies.player,seed.expansion.simulation.energies.player);
    assert.equal(await action(respond).count(),0);

    await page.reload();
    await boot();
    assert.deepEqual((await snapshot()).expansion.simulation.knowledge.player[critique],note);
    const encoded = await page.evaluate(()=>save_to_file());
    await Promise.all([page.waitForEvent('load',{timeout:60000}),
        page.locator('#saved_file_input').setInputFiles({name:'xvim-friday.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
    await boot();
    const imported = await session.save();
    validateSaveEnvelope(imported,imported['game version']);
    assert.deepEqual(imported.expansion.simulation.knowledge.player[critique],note);
    assert.deepEqual(completions(imported),completions(result));
    const feedback = (await panel()).getByText(note.value,{exact:true});
    await feedback.scrollIntoViewIfNeeded();
    assert(await feedback.isVisible());
    await page.screenshot({path:path.join(output,'critique-1920.png')});
    assert.equal((await session.uiCheck()).pageOverflow,0);
    assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
    await writeFile(path.join(output,'after-xvim.save.json'),JSON.stringify(imported));
    const receipt={route:'Exact earned after-drill seed, native Friday wait and coached exercise',viewport:'1920x1080',
        bundle:digest(await readFile(path.join(buildDir,'dist/bundle.js'))),seed:digest(bytes),
        checks:{earlyRefusal:true,nativeWaitMinutes:at-clock(before),firstTick:120,pendingWaitReload:true,waitCancellation:true,stoppedAtAppointment:true,
            practiceMinutes:30,attentionSpent:1,critiqueObserved:true,rememberedLectureIntact:true,reserveIntact:true,
            saveReloadExportImport:true,pageOverflow:0,pageErrors:0}};
    await writeFile(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
    console.log(receipt);
} catch (error) {
    await session.page?.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});
    await writeFile(path.join(output,'failure.json'),JSON.stringify({error:error.message,errors:session.errors},null,2));
    throw error;
} finally {
    await session.close();
    await server.close();
}
