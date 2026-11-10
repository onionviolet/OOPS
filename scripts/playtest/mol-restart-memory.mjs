// Earn the lecture in the browser. A named clock-only fixture skips the idle month.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {validateSaveEnvelope} from '../../src/save_files.js';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';

const [buildDir, output] = process.argv.slice(2);
assert(buildDir && output, 'Usage: node scripts/playtest/mol-restart-memory.mjs <BUILD_OUT> <evidence dir>');
await mkdir(output,{recursive:true});
const server = await serve(path.resolve(buildDir));
const session = await new Session({url:server.url+'?test_hooks=1',seed:7,wall:1760000000000,opTimeout:20000}).start();
const base = 'book.mol.';
const learn = base+'zorian.s0.invocations_class';
const drill = base+'zorian.s1.skip_class_drill';
const memory = base+'invocationStudied';
const location = s => s.expansion.simulation.people.player.location;
const facts = s => s.expansion.actors.player.facts;
const runs = s => s.expansion.motherOfLearning.runs;
const reserve = s => s.expansion.simulation.energies.player[base+'zorian.reserve'].reserve;
const snapshot = () => session.page.evaluate(() => simulationTestHooks.snapshot());
const card = id => session.page.locator(`[data-action-legibility-key="action:${id}"]`);
const action = id => card(id).locator('button.action-legibility__button');
const boot = async () => {
    const page = session.page;
    await page.waitForFunction(() => window.simulationTestHooks && document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
    await page.evaluate(() => simulationTestHooks.pause());
    await page.locator('#loading_screen_play_button').click();
};
async function panel() {
    const page = session.page;
    await page.locator('#workspace_navigation select').selectOption('notebook');
    await page.locator('[data-notebook-view="here"]').click();
    const p = page.locator('#feature_expansion_panel');
    if (!await p.evaluate(n => n.open)) await p.locator(':scope > summary').click();
    const section = p.locator(':scope > div > details').filter({has:page.locator('summary').filter({hasText:/Mother of Learning/})}).first();
    if (!await section.evaluate(n => n.open)) await section.locator(':scope > summary').click();
}
async function act(id) {
    const button = action(id);
    await button.waitFor();
    assert(await button.isEnabled(),await card(id).innerText());
    await button.click();
}
async function settle(id) {
    await act(id);
    for (let i=0;i<250;i++) {
        if (!(await snapshot()).expansion.simulation.jobs.some(j => j.commandId===id)) return;
        await session.page.evaluate(() => simulationTestHooks.workTicks(100));
    }
    assert.fail('Timed action did not settle: '+id);
}
const advanceNativeDate = (time,delta) => {
    const t = time.hour*60+time.minute+delta;
    let days = Math.floor(t/1440);
    time.day_count += days;
    time.hour = Math.floor((t%1440)/60);
    time.minute = t%60;
    while (days-- > 0) {
        if (++time.day>30) {time.day=1;if (++time.month>12) {time.month=1;time.year++;}}
    }
};
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
try {
    await session.open();
    const local = session.page.locator('#location_actions_div');
    await local.getByText('Talk to someone',{exact:false}).first().click();
    await local.locator('[data-dialogue="villageElder"]').click();
    for (const key of ['hello','what happened','ask to leave 1','need to']) {
        await local.locator(`.talk-view [data-topic-id="${key}"]`).click();
    }
    await session.page.locator('#center_mode_back').click();
    await session.step(3);
    await panel();
    await settle(base+'chart');
    await act(base+'begin_zorian');
    await session.page.waitForFunction(() => {
        const c=simulationTestHooks.snapshot().continuation;
        return c?.lives[c.active]?.initial.expansion.motherOfLearning?.entryProfile==='book.mol.zorian@1';
    },null,{polling:250,timeout:10000});
    const anchored=await snapshot();
    assert.equal(anchored.continuation.lives[anchored.continuation.active].initial.expansion.motherOfLearning.entryProfile,base+'zorian@1');
    await act(base+'move.court');
    await card(drill).waitFor();
    assert(await action(drill).isDisabled(),'a fresh Zorian cannot use the remembered lecture');
    await act(base+'move.academy');
    await settle(learn);
    const earned=await session.save();
    assert.equal(facts(earned)[memory],true);
    assert.equal(earned.expansion.actors.player.completed[learn],1);
    assert.equal(earned.expansion.actors.player.completed[drill],undefined);
    const near = structuredClone(earned);
    const calendar = near.expansion.motherOfLearning;
    const target = (calendar.runStartedAt??calendar.initializedAt)+29*1440+17*60-1;
    const delta = target-near.expansion.clock;
    assert(delta>0);
    // Keep future checks at the same offsets. This fixture skips the idle
    // interval rather than claiming that any scheduled work ran through it.
    assert.equal(near.expansion.simulation.jobs.length,0);
    for (const family of ['checks','controllers']) {
        for (const scheduled of Object.values(near.expansion.simulation[family])) scheduled.due+=delta;
    }
    near.expansion.clock = target;
    advanceNativeDate(near['current time'],delta);
    validateSaveEnvelope(near,near['game version']);
    const nearPath=path.join(output,'near-month-end.earned-clock-fixture.json');
    await writeFile(nearPath,JSON.stringify(near));
    await session.open(near);
    const loaded=await snapshot();
    assert.equal(loaded.expansion.clock,target);
    assert.equal(location(loaded),location(earned));
    assert.equal(facts(loaded)[memory],true);
    await Promise.all([session.page.waitForEvent('load',{timeout:30000}),session.page.evaluate(()=>advanceTicks(2))]);
    await boot();
    let next=await session.save();
    assert.equal(runs(next),2);
    assert.equal(next.continuation.deaths.at(-1).trigger,'date');
    assert.equal(location(next),location(anchored));
    assert.equal(next.expansion.actors.player.completed[learn],undefined,'the new run has not taken this lecture');
    assert.equal(facts(next)[memory],true);
    assert.equal(reserve(next),8);
    await session.page.reload();
    await boot();
    next=await snapshot();
    assert.equal(runs(next),2);
    assert.equal(facts(next)[memory],true);
    const encoded=await session.page.evaluate(()=>save_to_file());
    await Promise.all([session.page.waitForEvent('load',{timeout:30000}),
        session.page.locator('#saved_file_input').setInputFiles({name:'zorian-restarted.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
    await boot();
    next=await snapshot();
    assert.equal(facts(next)[memory],true);
    assert.equal(next.expansion.actors.player.completed[learn],undefined);
    await panel();
    await act(base+'move.court');
    assert(await action(drill).isEnabled(),await card(drill).innerText());
    await action(drill).scrollIntoViewIfNeeded();
    await session.page.screenshot({path:path.join(output,'remembered-action-1920.png')});
    await settle(drill);
    const done=await session.save();
    assert.equal(done.expansion.actors.player.completed[drill],1);
    assert.equal(done.expansion.actors.player.completed[learn],undefined);
    assert.equal(facts(done)[base+'loop.s1.skipped_invocations'],true);
    assert.equal(reserve(done),7);
    assert.equal(done.expansion.motherOfLearning.divergence.cause,drill);
    assert.equal((await session.uiCheck()).pageOverflow,0);
    assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
    await writeFile(path.join(output,'after-drill.save.json'),JSON.stringify(done));
    const result={route:'fresh native Zorian start and earned lecture; named clock-only boundary fixture; automatic reset; Save/reload/Export/Import; earned native drill',viewport:'1920x1080',bundle:digest(await readFile(path.join(buildDir,'dist/bundle.js'))),fixture:digest(await readFile(nearPath)),checks:{blockedFresh:true,earliestDateNative:true,memoryRetained:true,currentLectureReset:true,usedAfterImport:true,reserve:[8,7],pageErrors:0}};
    await writeFile(path.join(output,'receipt.json'),JSON.stringify(result,null,2)+'\n');
    console.log(result);
} catch (error) {
    await session.page?.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});
    await writeFile(path.join(output,'failure.json'),JSON.stringify({error:error.message,errors:session.errors},null,2));
    throw error;
} finally {
    await session.close();
    await server.close();
}
