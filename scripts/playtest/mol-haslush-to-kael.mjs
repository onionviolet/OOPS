// Exact predecessor checkpoints for the household, tunnel and cloud lesson slices.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {molScheduledMonthEnd, MOL_STUDY_IDS} from '../../src/mol_zorian_study_months.js';
import {validateSaveEnvelope} from '../../src/save_files.js';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';

const [buildDir, seedFile, output, mode] = process.argv.slice(2);
const aranea = mode === 'aranea';
const cloud = mode === 'cloud';
assert(buildDir && seedFile && output && (!mode || aranea || cloud),
    'Usage: node scripts/playtest/mol-haslush-to-kael.mjs <BUILD_OUT> <exact predecessor> <evidence dir> [aranea|cloud]');
await mkdir(output, {recursive: true});
const bytes = await readFile(seedFile);
const digest = data => createHash('sha256').update(data).digest('hex');
assert.equal(digest(bytes), cloud
    ? 'db58b23701b828930c672cdb69d5c60c052221d7bd6ea3aef3b5c0141f46d022' : aranea
    ? '94bec448542662101dce5ea6593e4b401d7fa89f1aca0b76ad72bac179c43f28'
    : '981a25a3df2de95ef4cd40b2398ef85e0111f07354a9ae74f51468b4af19d577');
const seed = JSON.parse(bytes);
const server = await serve(path.resolve(buildDir));
const session = await new Session({url: server.url + '?test_hooks=1', seed: 7, wall: 1760000000000, opTimeout: 60000}).start();

const key = id => 'book.mol.zorian.s2.' + id;
const clock = save => save.expansion.clock;
const completions = save => save.expansion.actors.player.completed;
const known = save => save.expansion.simulation.knowledge.player;
const reserve = save => save.expansion.simulation.energies.player['book.mol.zorian.reserve'].reserve;
const job = (save, id) => save.expansion.simulation.jobs.find(j => j.commandId === id && j.actorId === 'player');
const snapshot = () => session.page.evaluate(() => simulationTestHooks.snapshot());
const card = id => session.page.locator(`[data-action-legibility-key="action:${id}"]`);
const action = id => card(id).locator('button.action-legibility__button');
let currentStep = 'load predecessor';

async function boot() {
    const page = session.page;
    await page.waitForFunction(() => window.simulationTestHooks &&
        (document.getElementById('loading_screen_play_button')?.checkVisibility() ||
        document.getElementById('loading_screen')?.style.visibility === 'hidden'), null, {timeout: 60000});
    await page.evaluate(() => simulationTestHooks.pause());
    const play = page.locator('#loading_screen_play_button');
    if (await play.isVisible()) await play.click({force: true});
}

async function panel() {
    const page = session.page;
    await page.locator('#workspace_navigation select').selectOption('notebook');
    await page.locator('[data-notebook-view="here"]').click();
    const p = page.locator('#feature_expansion_panel');
    if (!await p.evaluate(n => n.open)) await p.locator(':scope > summary').click();
    const section = p.locator(':scope > div > details').filter({has: page.locator('summary').filter({hasText: /Mother of Learning/})}).first();
    if (!await section.evaluate(n => n.open)) await section.locator(':scope > summary').click();
    return section;
}

async function act(id, settle = true) {
    currentStep = id;
    const button = action(id);
    await button.waitFor();
    assert(await button.isEnabled(), await card(id).innerText());
    await button.click();
    if (!settle) return;
    for (let i = 0; i < 10; i++) {
        if (!job(await snapshot(), id)) return;
        await session.page.evaluate(() => simulationTestHooks.workTicks(20));
    }
    assert.fail('Timed action did not settle: ' + id);
}

async function playCloudLesson() {
    const page = session.page;
    const run = save => save.expansion.motherOfLearning.runs;
    const routeStarts = [];
    async function rideToRestart(id) {
        const start = await snapshot();
        const end = molScheduledMonthEnd(start.expansion);
        await act(id, false);
        assert.equal(job(await snapshot(), id).due, end);
        // Keep the boundary tick separate so Playwright can join the ensuing reload.
        const minute = () => page.evaluate(() => simulationTestHooks.clock());
        for (let current = await minute(); end - current > 1440; current = await minute()) {
            const ticks = Math.min(5, Math.floor((end - current - 1) / 1440));
            await page.evaluate(ticks => simulationTestHooks.workTicks(ticks), ticks);
            assert(await minute() > current, 'The accepted month job stopped advancing the clock');
        }
        await Promise.all([page.waitForEvent('load', {timeout: 60000}),
            page.evaluate(() => simulationTestHooks.workTicks(1))]);
        await boot();
        const restarted = await snapshot();
        assert.equal(run(restarted), run(start) + 1);
        assert.equal(clock(restarted), end);
        assert.equal(restarted.continuation.deaths.at(-1).trigger, 'date');
        assert.equal(completions(restarted)[id], undefined);
        assert.equal(reserve(restarted), 8);
        assert.deepEqual(known(restarted)[key('aranea_memory_packet')], known(seed)[key('aranea_memory_packet')]);
        routeStarts.push({run: run(restarted), elapsed: end - clock(start)});
        await panel();
        console.log('Earned month reset', routeStarts.at(-1));
        return restarted;
    }
    await act('book.mol.move.house');
    await act(key('plan_festival_departure'));
    await act('book.mol.move.station');
    const departure = await rideToRestart(key('take_festival_train'));
    assert(known(departure)[key('festival_train_departure')]);
    for (const [index, id] of MOL_STUDY_IDS.entries()) {
        await act('book.mol.move.' + (index % 2 ? 'workshop' : 'divinationTavern'));
        const restarted = await rideToRestart(id);
        assert(known(restarted)[id]);
    }
    await act('book.mol.move.academy');
    await act(key('ask_ilsa_for_combat_instruction'));
    await act('book.mol.move.sewer');
    await act(key('meet_taiven_for_tunnels'));
    await act(key('ask_the_matriarch_to_check_the_packet'));
    await act(key('agree_to_practice_with_taiven'));
    await act('book.mol.move.court');
    await act(key('trade_practice_casts_with_taiven'));
    await act(key('ask_taiven_how_she_located_the_cast'));
    assert(known(await snapshot())[key('taiven_cloud_method')]);
    await act(key('shape_a_small_mana_cloud'));
    const wait = key('wait_for_xvim_cloud_drill');
    assert.equal(await action(key('track_marble_by_touch')).count(), 0);
    await act(wait);
    await act(key('track_marble_by_touch'));
    const final = await session.save();
    const result = known(final)[key('cloud_drill_result')];
    assert.match(result.value, /cannot rank them by charge yet/);
    assert.equal(reserve(final), 4);
    for (const id of MOL_STUDY_IDS) assert(known(final)[id]);
    for (const id of ['object_analysis_method', 'object_analysis_result', 'xvim_critique', 'kael_examination_result']) {
        assert.deepEqual(known(final)[key(id)], known(seed)[key(id)]);
    }
    await page.reload();
    await boot();
    assert.deepEqual(known(await snapshot()), known(final));
    const download = page.waitForEvent('download');
    await page.evaluate(() => saveToFile());
    const encoded = await readFile(await (await download).path());
    await Promise.all([page.waitForEvent('load', {timeout: 60000}),
        page.locator('#saved_file_input').setInputFiles({name: 'xvim-cloud.txt', mimeType: 'text/plain', buffer: encoded})]);
    await boot();
    const imported = await session.save();
    validateSaveEnvelope(imported, imported['game version']);
    assert.deepEqual(known(imported), known(final));
    assert.deepEqual(completions(imported), completions(final));
    assert.equal(reserve(imported), reserve(final));
    const feedback = (await panel()).getByText(result.value, {exact: true});
    await feedback.scrollIntoViewIfNeeded();
    assert(await feedback.isVisible());
    await page.screenshot({path: path.join(output, 'cloud-drill-1920.png')});
    assert.equal((await session.uiCheck()).pageOverflow, 0);
    assert.deepEqual(session.errors.filter(error => error.kind === 'pageerror'), []);
    const checkpoint = JSON.stringify(imported);
    await writeFile(path.join(output, 'after-xvim-cloud.save.json'), checkpoint);
    const receipt = {route: 'Exact earned packet save through the Chapter 19 cloud drill', viewport: '1920x1080',
        bundle: digest(await readFile(path.join(buildDir, 'dist/bundle.js'))), seed: digest(bytes), checkpoint: digest(checkpoint),
        checks: {routeStarts, teacherMonths: 6, learnerCasts: 4, supportedFriday: true, priorMemories: true,
            actualExportAndImport: true, finalClock: clock(imported), pageErrors: 0, pageOverflow: 0}};
    await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(receipt);
}

async function playAranea() {
    const page = session.page;
    const cube = JSON.stringify({id: 'Cyorian prepared barrier cubes'});
    const owned = save => save.inventories.person.main_character[cube]?.count ?? 0;
    const kaelAt = save => save.expansion.simulation.people['book.mol.kael'].location;
    assert.equal(owned(seed), 0);
    await act(key('answer_unseen_visitor'));
    await act('book.mol.move.library');
    await act(key('read_about_aranea'));
    await act('book.mol.move.house');
    await act(key('ask_imaya_about_crowds'));
    await act(key('make_barrier_cubes'));
    const prepared = await snapshot();
    assert.equal(owned(prepared), 1);
    assert.equal(reserve(prepared), reserve(seed) - 1);
    await act(key('ask_kael_to_go_ahead'));
    assert.equal(kaelAt(await snapshot()), 'Cyoria sewer service hatch');
    await act('book.mol.move.sewer');
    await act(key('hear_matriarchs_terms'));
    assert.equal(owned(await snapshot()), 1);
    await act(key('trigger_barrier_cubes'));
    const retreated = await snapshot();
    assert.equal(owned(retreated), 0);
    assert.equal(reserve(retreated), reserve(seed) - 2);
    const accept = key('accept_memory_packet'), decline = key('decline_memory_packet');
    await action(accept).scrollIntoViewIfNeeded();
    for (const id of [accept, decline]) {
        assert(await action(id).isEnabled());
        const box = await action(id).boundingBox();
        assert(box && box.y >= 0 && box.y + box.height <= 1080);
    }
    await page.screenshot({path: path.join(output, 'packet-choices-1920.png')});
    await act(accept);
    const final = await session.save();
    assert.equal(kaelAt(final), 'Cyoria Imaya household');
    assert.equal(await action(decline).count(), 0);
    const result = known(final)[key('aranea_memory_packet')];
    assert.match(result.value, /cannot read it yourself/);
    assert.deepEqual(Object.fromEntries(Object.keys(known(seed)).map(id => [id, known(final)[id]])), known(seed));
    assert.deepEqual(Object.fromEntries(Object.keys(completions(seed)).map(id => [id, completions(final)[id]])), completions(seed));
    await page.reload();
    await boot();
    assert.deepEqual(known(await snapshot()), known(final));
    const download = page.waitForEvent('download');
    await page.evaluate(() => saveToFile());
    const encoded = await readFile(await (await download).path());
    await Promise.all([page.waitForEvent('load', {timeout: 60000}),
        page.locator('#saved_file_input').setInputFiles({name: 'aranea-packet.txt', mimeType: 'text/plain', buffer: encoded})]);
    await boot();
    const imported = await session.save();
    validateSaveEnvelope(imported, imported['game version']);
    assert.deepEqual(known(imported), known(final));
    assert.deepEqual(completions(imported), completions(final));
    assert.equal(reserve(imported), reserve(final));
    assert.equal(owned(imported), 0);
    assert.equal(kaelAt(imported), kaelAt(final));
    const feedback = (await panel()).getByText(result.value, {exact: true});
    await feedback.scrollIntoViewIfNeeded();
    assert(await feedback.isVisible());
    await page.screenshot({path: path.join(output, 'packet-result-1920.png')});
    assert.equal((await session.uiCheck()).pageOverflow, 0);
    assert.deepEqual(session.errors.filter(error => error.kind === 'pageerror'), []);
    const checkpoint = JSON.stringify(imported);
    await writeFile(path.join(output, 'after-aranea-packet.save.json'), checkpoint);
    const receipt = {route: 'Exact earned Kael save through the Chapter 18 offer', viewport: '1920x1080',
        bundle: digest(await readFile(path.join(buildDir, 'dist/bundle.js'))), seed: digest(bytes), checkpoint: digest(checkpoint),
        checks: {packetChoices: true, cubeCraftedAndSpent: true, casts: 2, kaelMoves: true, priorMemories: true,
            actualExportAndImport: true, finalClock: clock(imported), pageErrors: 0, pageOverflow: 0}};
    await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(receipt);
}

async function playHousehold() {
    const page = session.page;
    const tip = key('warn_haslush_privately'), keep = key('keep_festival_warning_private');
    await action(tip).scrollIntoViewIfNeeded();
    for (const id of [tip, keep]) {
        assert(await action(id).isEnabled());
        const box = await action(id).boundingBox();
        assert(box && box.y >= 0 && box.y + box.height <= 1080);
    }
    await page.screenshot({path: path.join(output, 'tavern-choices-1920.png')});
    await act(tip);
    assert.match(known(await snapshot())[key('haslush_festival_tip')].value, /quiet inquiries/);
    assert.equal(await action(keep).count(), 0);
    await act('book.mol.move.house');
    await act(key('steady_the_snail'));
    assert.equal(reserve(await snapshot()), reserve(seed) - 1);
    await act(key('tutor_kael'));
    await act(key('read_taivens_paper'));
    await act(key('confide_in_kael_and_kirielle'));
    const disclosed = await snapshot();
    const due = clock(disclosed) + 3 * 1440;
    assert.equal(await action(key('hear_kaels_theory')).count(), 0);
    const wait = key('wait_for_kael_research');
    await act(wait, false);
    await page.evaluate(() => simulationTestHooks.workTicks(1));
    const waiting = await session.save();
    assert.equal(clock(waiting) - clock(disclosed), 120);
    assert.equal(job(waiting, wait).due, due);

    await page.reload();
    await boot();
    const resumed = await snapshot();
    assert.equal(job(resumed, wait).due, due);
    await panel();
    await act(job(resumed, wait).id + '.cancel');
    assert.equal(clock(await snapshot()), clock(waiting));
    await act(wait);
    assert.equal(clock(await snapshot()), due);
    await act(key('hear_kaels_theory'));
    const exam = key('accept_kaels_examination');
    const deferred = key('defer_kaels_examination');
    assert(await action(deferred).isEnabled());
    await act(exam);
    const final = await session.save();
    const result = known(final)[key('kael_examination_result')];
    assert.match(result.value, /cannot tell you what it is/);
    assert.equal(clock(final), due + 20);
    assert.equal(reserve(final), reserve(seed) - 1);
    assert.deepEqual(Object.fromEntries(Object.keys(known(seed)).map(id => [id, known(final)[id]])), known(seed));
    assert.deepEqual(Object.fromEntries(Object.keys(completions(seed)).map(id => [id, completions(final)[id]])), completions(seed));
    assert.equal(await action(deferred).count(), 0);

    await page.reload();
    await boot();
    assert.deepEqual(known(await snapshot()), known(final));
    const download = page.waitForEvent('download');
    await page.evaluate(() => saveToFile());
    const encoded = await readFile(await (await download).path());
    await Promise.all([page.waitForEvent('load', {timeout: 60000}),
        page.locator('#saved_file_input').setInputFiles({name: 'haslush-to-kael.txt', mimeType: 'text/plain', buffer: encoded})]);
    await boot();
    const imported = await session.save();
    validateSaveEnvelope(imported, imported['game version']);
    assert.deepEqual(known(imported), known(final));
    assert.deepEqual(completions(imported), completions(final));
    assert.equal(imported.expansion.actors['book.mol.kael'].facts[key('heard_zorian_loop')], true);
    assert.equal(reserve(imported), reserve(final));
    const feedback = (await panel()).getByText(result.value, {exact: true});
    await feedback.scrollIntoViewIfNeeded();
    assert(await feedback.isVisible());
    await page.screenshot({path: path.join(output, 'kael-result-1920.png')});
    assert.equal((await session.uiCheck()).pageOverflow, 0);
    assert.deepEqual(session.errors.filter(error => error.kind === 'pageerror'), []);
    const checkpoint = JSON.stringify(imported);
    await writeFile(path.join(output, 'after-kael-examination.save.json'), checkpoint);
    const receipt = {route: 'Exact earned Haslush save through Kael’s Chapter 16 examination', viewport: '1920x1080',
        bundle: digest(await readFile(path.join(buildDir, 'dist/bundle.js'))), seed: digest(bytes), checkpoint: digest(checkpoint),
        checks: {tipChoices: true, shapingCasts: 1, tutoring: true, lateResearchMinutes: 4320, firstWaitTick: 120,
            pendingReload: true, cancellationPreservedClock: true, result: true, priorMemories: true, priorCompletions: true,
            actualExportAndImport: true, finalClock: clock(imported), pageErrors: 0, pageOverflow: 0}};
    await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(receipt);
}

try {
    validateSaveEnvelope(seed, seed['game version']);
    await session.open(seed);
    const page = session.page;
    assert.deepEqual(page.viewportSize(), {width: 1920, height: 1080});
    const loaded = await snapshot();
    assert.equal(clock(loaded), clock(seed));
    assert.deepEqual(completions(loaded), completions(seed));
    assert.deepEqual(known(loaded), known(seed));
    await panel();
    if (cloud) await playCloudLesson();
    else if (aranea) await playAranea();
    else await playHousehold();
} catch (error) {
    await session.page?.screenshot({path: path.join(output, 'failure.png')}).catch(() => {});
    await writeFile(path.join(output, 'failure.json'), JSON.stringify({step: currentStep, error: error.message, errors: session.errors}, null, 2));
    throw error;
} finally {
    await session.close();
    await server.close();
}
