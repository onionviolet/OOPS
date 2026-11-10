// Plays the scheduled lesson from the exact after-Xvim export on a fresh origin.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {molDivinationAppointmentAt} from '../../src/mol_zorian_divination.js';
import {validateSaveEnvelope} from '../../src/save_files.js';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';

const [buildDir, seedFile, output] = process.argv.slice(2);
assert(buildDir && seedFile && output,
    'Usage: node scripts/playtest/mol-haslush-monday.mjs <BUILD_OUT> <after-xvim.save.json> <evidence dir>');
await mkdir(output,{recursive:true});
const bytes = await readFile(seedFile);
const seed = JSON.parse(bytes);
const digest = data => createHash('sha256').update(data).digest('hex');
const server = await serve(path.resolve(buildDir));
const session = await new Session({url:server.url+'?test_hooks=1',seed:7,wall:1760000000000,opTimeout:60000}).start();

const prefix = 'book.mol.zorian.s2.';
const key = id => prefix+id;
const wait = key('wait_for_haslush'), meet = key('meet_haslush'), notice = key('tell_imaya_about_lesson');
const enter = key('check_tavern'), trace = key('trace_haslush'), ask = key('ask_after_haslush');
const teach = key('study_object_analysis'), practice = key('read_practice_envelope');
const method = key('object_analysis_method'), observation = key('object_analysis_result');
const clock = save => save.expansion.clock;
const completions = save => save.expansion.actors.player.completed;
const known = save => save.expansion.simulation.knowledge.player;
const reserve = save => save.expansion.simulation.energies.player['book.mol.zorian.reserve'].reserve;
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
    const at = molDivinationAppointmentAt(seed.expansion);
    await session.open(seed);
    const page = session.page;
    const loaded = await snapshot();
    assert.equal(clock(loaded),clock(seed));
    assert.deepEqual(completions(loaded),completions(seed));
    assert.equal(completions(loaded)[key('report_uncertainty')],1);
    assert.equal(completions(loaded)['book.mol.zorian.s1.skip_class_drill'],1);
    await panel();
    await act('book.mol.move.library');
    await act(meet);
    await settle(meet);
    const introduced = await snapshot();
    assert.equal(known(introduced)[method],undefined);
    assert.match(known(introduced)[key('haslush_appointment')].value,/Monday at 3 p.m./);
    const compass = JSON.stringify({id:'Cyorian divination compass'});
    assert.equal(introduced.inventories.person.main_character[compass]?.count,1);
    await act('book.mol.move.house');
    await act(notice);
    await settle(notice);
    await act('book.mol.move.divinationTavern');
    assert(await action(enter).isDisabled());
    await act('book.mol.move.house');
    await act(wait);
    const before = await snapshot();
    assert.equal(job(before,wait).due,at);
    await page.evaluate(() => simulationTestHooks.workTicks(1));
    const waiting = await session.save();
    assert.equal(clock(waiting)-clock(before),120);
    assert.equal(job(waiting,wait).due,at);

    await page.reload();
    await boot();
    const pending = await snapshot();
    assert.equal(job(pending,wait).due,at);
    await panel();
    await act(job(pending,wait).id+'.cancel');
    const stopped = await snapshot();
    assert.equal(job(stopped,wait),undefined);
    assert.equal(clock(stopped),clock(pending));
    await act(wait);
    await settle(wait);
    assert.equal(clock(await snapshot()),at);
    await act('book.mol.move.divinationTavern');
    await act(enter);
    await settle(enter);
    assert(await action(ask).isEnabled());
    await action(trace).scrollIntoViewIfNeeded();
    const alternate = await action(ask).boundingBox();
    assert(alternate && alternate.y + alternate.height <= 1080,'both responses fit on the desktop');
    await page.screenshot({path:path.join(output,'diagnostic-1920.png')});
    await act(trace);
    await settle(trace);
    assert.equal(reserve(await snapshot()),reserve(seed)-1);
    assert.equal(known(await snapshot())[method],undefined);
    await act(teach);
    await settle(teach);
    const taught = await snapshot();
    assert.equal(known(taught)[method].stage,'understood');
    assert.equal(known(taught)[observation],undefined);
    assert(await action(practice).isEnabled());
    await act(practice);
    await settle(practice);
    const result = await session.save();
    const note = known(result)[observation];
    assert.match(note.value,/ward laid across the seal/);
    assert.equal(clock(result),at+40);
    assert.equal(reserve(result),reserve(seed)-2);
    assert.deepEqual(known(result)[key('xvim_critique')],known(seed)[key('xvim_critique')]);
    assert.equal(completions(result)[key('report_uncertainty')],1);
    assert.equal(completions(result)['book.mol.zorian.s1.skip_class_drill'],1);
    assert.equal(await action(practice).count(),0);
    await page.reload();
    await boot();
    assert.deepEqual(known(await snapshot())[observation],note);
    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(()=>saveToFile());
    const encoded = await readFile(await (await downloadPromise).path());
    await Promise.all([page.waitForEvent('load',{timeout:60000}),
        page.locator('#saved_file_input').setInputFiles({name:'haslush-monday.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
    await boot();
    const imported = await session.save();
    validateSaveEnvelope(imported,imported['game version']);
    assert.deepEqual(known(imported)[observation],note);
    assert.deepEqual(completions(imported),completions(result));
    const feedback = (await panel()).getByText(note.value,{exact:true});
    await feedback.scrollIntoViewIfNeeded();
    assert(await feedback.isVisible());
    await page.screenshot({path:path.join(output,'result-1920.png')});
    assert.equal((await session.uiCheck()).pageOverflow,0);
    assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
    await writeFile(path.join(output,'after-haslush.save.json'),JSON.stringify(imported));
    const receipt={route:'Exact earned after-Xvim seed to Haslush’s first completed supervised exercise',viewport:'1920x1080',
        bundle:digest(await readFile(path.join(buildDir,'dist/bundle.js'))),seed:digest(bytes),
        checks:{earlyRefusal:true,nativeWaitMinutes:at-clock(before),firstTick:120,pendingWaitReload:true,waitCancellation:true,stoppedAtAppointment:true,
            lessonMinutes:40,castsSpent:2,practiceObserved:true,priorCritiqueIntact:true,finalClock:clock(imported),
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
