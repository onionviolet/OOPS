// Replay exact private checkpoints on a fresh desktop origin.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {validateSaveEnvelope} from '../../src/save_files.js';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';

const [build, input, output, mode = 'watch', expectedSeed] = process.argv.slice(2);
assert(build && input && output && (['watch', 'end', 'finale'].includes(mode)));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const bytes = await readFile(input);
const seed = JSON.parse(bytes);
assert.equal(hash(bytes), mode === 'watch' ? '4e42e710d6ae831a101c504b0f81397209d0ff7382f6f8d5c7e0651de214d427' : expectedSeed);
validateSaveEnvelope(seed, seed['game version']);
await mkdir(output, {recursive: true});
const server = await serve(path.resolve(build));
const session = await new Session({url: server.url + '?test_hooks=1', seed: 7, wall: 1760000000000, opTimeout: 30000}).start();
const key = id => 'book.mol.zorian.arc1.' + id;
const notes = save => save.expansion.simulation.knowledge.player;
const run = save => save.expansion.motherOfLearning.runs;
const owned = (save, id) => save.inventories.person.main_character[JSON.stringify({id})]?.count ?? 0;
const snapshot = () => session.page.evaluate(() => simulationTestHooks.snapshot());
const clock = () => session.page.evaluate(() => simulationTestHooks.clock());
const card = id => session.page.locator(`[data-action-legibility-key="action:${id}"]`);
const button = id => card(id).locator('button.action-legibility__button');
let step = 'load predecessor';

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
    const panel = page.locator('#feature_expansion_panel');
    if (!await panel.evaluate(node => node.open)) await panel.locator(':scope > summary').click();
    const section = panel.locator(':scope > div > details').filter({has: page.locator('summary').filter({hasText: /Mother of Learning/})}).first();
    if (!await section.evaluate(node => node.open)) await section.locator(':scope > summary').click();
    return section;
}

async function act(id, {settle = true} = {}) {
    step = id;
    const action = button(id);
    await action.waitFor();
    assert(await action.isEnabled(), await card(id).innerText());
    await action.click();
    if (!settle) return;
    for (let i = 0; i < 32; i++) {
        const save = await snapshot();
        if (!save.expansion.simulation.jobs.some(j => j.actorId === 'player' && j.commandId === id)) return;
        const before = await clock();
        await session.page.evaluate(() => simulationTestHooks.workTicks(8));
        assert(await clock() > before, 'Accepted work stopped advancing');
    }
    assert.fail('Did not settle: ' + id);
}
const go = place => act('book.mol.move.' + place);
const perform = name => act(key(name));

async function roundTrip(final, name, resultKey, checks = {}) {
    const page = session.page;
    const note = notes(final)[key(resultKey)];
    assert(note);
    await page.reload();
    await boot();
    assert.deepEqual(notes(await snapshot()), notes(final));
    const download = page.waitForEvent('download');
    await page.evaluate(() => saveToFile());
    const encoded = await readFile(await (await download).path());
    await Promise.all([page.waitForEvent('load', {timeout: 60000}),
        page.locator('#saved_file_input').setInputFiles({name: name + '.txt', mimeType: 'text/plain', buffer: encoded})]);
    await boot();
    const imported = await session.save();
    validateSaveEnvelope(imported, imported['game version']);
    assert.deepEqual(notes(imported), notes(final));
    assert.deepEqual(imported.expansion.actors.player.completed, final.expansion.actors.player.completed);
    assert.deepEqual(imported.expansion.simulation.energies.player, final.expansion.simulation.energies.player);
    const feedback = (await panel()).getByText(note.value, {exact: true});
    await feedback.scrollIntoViewIfNeeded();
    assert(await feedback.isVisible());
    await page.screenshot({path: path.join(output, name + '-1920.png')});
    assert.equal((await session.uiCheck()).pageOverflow, 0);
    assert.deepEqual(session.errors.filter(e => e.kind === 'pageerror'), []);
    const data = JSON.stringify(imported);
    await writeFile(path.join(output, name + '.save.json'), data);
    const receipt = {route: mode, seed: hash(bytes), checkpoint: hash(data), viewport: '1920x1080',
        bundle: hash(await readFile(path.join(build, 'dist/bundle.js'))), run: run(imported), clock: imported.expansion.clock,
        roundTrip: true, pageOverflow: 0, pageErrors: 0, ...checks};
    await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(receipt);
}

async function playWatch() {
    await go('sewer');
    assert(await button(key('trade_forecasts')).isDisabled());
    await perform('return_to_scout');
    await perform('trade_forecasts');
    await go('academy');
    await perform('consult_temple');
    await go('library');
    await perform('compare_forecasters');
    await go('sewer');
    await perform('wait_to_report');
    await perform('report_and_ask_about_training');
    await perform('wait_for_mind_lesson');
    await perform('practice_inward_sense');
    await perform('discuss_firing_positions');
    await go('house');
    await perform('wait_for_festival_party');
    await go('mansion');
    await perform('watch_fireworks');
    await perform('inscribe_corridor_runes');
    await perform('cross_mansion_grounds');

    const page = session.page;
    const ended = page.waitForEvent('load', {timeout: 60000});
    await act(key('carry_tinami_toward_zach'), {settle: false});
    await page.evaluate(() => simulationTestHooks.workTicks(8)).catch(error => {
        if (!/Execution context was destroyed/.test(error.message)) throw error;
    });
    await ended;
    await boot();
    await page.waitForFunction(previous => {
        try { return simulationTestHooks.snapshot().expansion.motherOfLearning.runs === previous + 1; }
        catch { return false; }
    }, run(seed), {timeout: 60000});
    await boot();
    const revived = await snapshot();
    assert(notes(revived)[key('garden_fall')]);
    assert.equal(revived.continuation.deaths.at(-2).cause, 'harm');
    assert.deepEqual(notes(revived)['book.mol.zorian.s2.cloud_drill_result'], notes(seed)['book.mol.zorian.s2.cloud_drill_result']);
    await panel();

    await perform('make_missile_rod');
    assert.equal(owned(await snapshot(), 'Cyorian missile rod'), 1);
    await go('sewer');
    await perform('follow_a_mind_below');
    await go('court');
    await perform('drill_missiles_with_taiven');
    await go('sewer');
    await perform('receive_pocket_watch');
    assert.equal(owned(await snapshot(), 'Cyorian retrieved watch'), 1);
    await perform('identify_watch_purpose');
    assert.match(notes(await snapshot())[key('ward_reader_known')].value, /ward scanner/);
    await perform('feel_watch_casing');
    await go('station');
    await perform('return_watch_to_client');
    assert.equal(owned(await snapshot(), 'Cyorian retrieved watch'), 0);
    await go('sewer');
    await perform('bring_back_ward_reader_news');
    await roundTrip(await session.save(), 'after-ward-reader', 'ward_reader_report');
}

async function rideToRestart(name) {
    const page = session.page;
    const start = await snapshot();
    await act(key(name), {settle: false});
    const booked = (await snapshot()).expansion.simulation.jobs.find(j => j.commandId === key(name));
    assert(booked);
    while (booked.due - await clock() > 1440) {
        const before = await clock();
        const ticks = Math.min(4, Math.floor((booked.due - before - 1) / 1440));
        await page.evaluate(ticks => simulationTestHooks.workTicks(ticks), ticks);
        assert(await clock() > before, 'The accepted month stopped advancing');
    }
    await Promise.all([page.waitForEvent('load', {timeout: 60000}),
        page.evaluate(() => simulationTestHooks.workTicks(1))]);
    await boot();
    const next = await session.save();
    assert.equal(run(next), run(start) + 1);
    assert.equal(next.expansion.clock, booked.due);
    assert.equal(next.continuation.deaths.at(-1).trigger, 'date');
    const data = JSON.stringify(next);
    await writeFile(path.join(output, 'run-' + run(next) + '.save.json'), data);
    console.log('Earned calendar reset', run(next), hash(data));
    await panel();
    return next;
}

async function playEnd() {
    const page = session.page;
    if (mode === 'end') {
        await go('academy');
        await perform('earn_ilsa_apprenticeship');
        for (let i = 1; i <= 5; i++) {
            if (i > 1) await go('academy');
            const month = 'apprentice_month_' + i;
            const next = await rideToRestart(month);
            assert(notes(next)[key(month)]);
        }
    } else {
        for (let i = 1; i <= 5; i++) assert(notes(seed)[key('apprentice_month_' + i)]);
    }
    await perform('make_stone_relays');
    await go('sewer');
    await perform('leave_relays_with_the_web');
    assert.equal(owned(await snapshot(), 'Cyorian stone relay'), 1);
    await go('house');
    await perform('ask_kael_in_confidence');
    await go('sewer');
    await perform('prepare_capture_trap');
    await go('house');
    await perform('prepare_silver_disc');
    await perform('wait_for_second_festival');
    await go('festivalHall');
    await perform('stop_the_attack_on_akoja');
    await perform('offer_the_silver_disc');
    assert.equal(owned(await snapshot(), 'Cyorian silver disc'), 0);
    await perform('watch_the_relay');
    await go('sewer');
    await perform('recover_fragmented_route');
    const mapped = await snapshot();
    await go('house');
    const returned = await rideToRestart('let_the_month_reset');
    assert.deepEqual(notes(returned)[key('fragmented_tunnel_map')], notes(mapped)[key('fragmented_tunnel_map')]);
    assert.deepEqual(notes(returned)[key('broken_settlement_message')], notes(mapped)[key('broken_settlement_message')]);
    assert.equal(owned(returned, 'Cyorian stone relay'), 0);
    const beforeJump = await snapshot();
    await perform('jump_to_cyoria_beacon');
    const jumped = await snapshot();
    assert.equal(jumped['current location'], 'Cyoria visitor arrival');
    assert.equal(jumped.expansion.simulation.energies.player['book.mol.zorian.reserve'].reserve,
        beforeJump.expansion.simulation.energies.player['book.mol.zorian.reserve'].reserve - 2);
    await perform('buy_beacon_supplies');
    assert.equal(owned(await snapshot(), 'Cyorian revolver cartridge'), 6);
    await perform('prepare_pocket_charges');
    await go('sewer');
    await perform('search_the_silent_settlement');
    await perform('buy_time_with_concealment');
    await perform('break_the_mind_link');
    await perform('fire_and_pull_free');
    assert.equal(owned(await snapshot(), 'Cyorian revolver cartridge'), 0);
    await perform('take_the_shaft_from_the_map');
    await perform('detonate_before_impact');
    await page.waitForTimeout(1500);
    const final = await session.save();
    assert.equal(run(final), run(seed) + (mode === 'end' ? 6 : 1));
    assert.equal(final.expansion.simulation.people.player.life, 'dead');
    assert.equal(owned(final, 'Cyorian pocket charges'), 0);
    await roundTrip(final, 'end-of-arc-one', 'arc_one_finished',
        {apprenticeResets: mode === 'end' ? 5 : 0, returnReset: true, beaconMana: 2, spentRounds: 6, terminal: true});
}

try {
    await session.open(seed);
    assert.deepEqual(session.page.viewportSize(), {width: 1920, height: 1080});
    assert.equal(await clock(), seed.expansion.clock);
    assert.deepEqual(notes(await snapshot()), notes(seed));
    await panel();
    if (mode === 'watch') await playWatch();
    else await playEnd();
} catch (error) {
    await session.page?.screenshot({path: path.join(output, 'failure.png')}).catch(() => {});
    await writeFile(path.join(output, 'failure.json'), JSON.stringify({step, error: error.message, errors: session.errors}, null, 2));
    throw error;
} finally {
    await session.close();
    await server.close();
}
