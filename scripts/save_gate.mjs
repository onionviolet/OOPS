// Replay the retained earned save inputs through the rebuilt browser entry.
// Run after `npm run build`: node scripts/save_gate.mjs
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';

const require = createRequire(import.meta.url);
const {launchChrome} = require('./ui_helpers.cjs');
const {serveCheckout, openPanel} = require('./fixture_browser.cjs');
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUILT_ROOT = resolve(process.env.BUILD_OUT || ROOT);
const FIXTURES = join(ROOT, 'scripts/save_gate_fixtures');
const PRIVATE_FIXTURES = join(ROOT, 'private_packs/save_gate');
const manifest = JSON.parse(await readFile(join(FIXTURES, 'manifest.json'), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
assert.deepEqual(manifest.fixtures.map(row => row.id).sort(),
    ['alden-hospital', 'fang-first-night', 'klein-ch129', 'ryan-ch1'], 'Expected all four earned save fixtures');

function parseSave(bytes, file) {
    let text = bytes.toString('utf8').trim();
    if (text.startsWith('YAIR-UTF8-1:')) text = Buffer.from(text.slice('YAIR-UTF8-1:'.length), 'base64').toString('utf8');
    let save;
    try { save = JSON.parse(text); }
    catch (error) { throw new Error(`${file}: retained input is not a recognized game save: ${error.message}`); }
    assert.ok(save && typeof save === 'object' && save.expansion, `${file}: missing native expansion save state`);
    return save;
}

function identity(save) {
    return {
        character: save.character?.name,
        location: save['current location'],
        world: save.expansion?.actors?.player?.worldId,
        packId: save.content_packs?.structured?.packId,
        packInstanceId: save.content_packs?.structured?.instanceId,
        packSnapshotHash: save.content_packs?.structured?.snapshotHash,
        clock: save.expansion?.clock,
        playerFacts: save.expansion?.actors?.player?.facts ?? {},
        completed: save.expansion?.actors?.player?.completed ?? {},
        stoneCount: save.inventories?.person?.main_character?.[JSON.stringify({id: 'book.ri.lead.refinement.primeval_stone'})]?.count,
        ryanRun: save.capabilityRuns?.runs?.ryan ?? null,
    };
}

function assertCheckpoint(row, save, stage) {
    const state = identity(save);
    assert.equal(state.character, row.expected.character, `${row.id} ${stage}: wrong character`);
    assert.equal(state.location, row.expected.location, `${row.id} ${stage}: wrong location`);
    if (row.expected.world) assert.equal(state.world, row.expected.world, `${row.id} ${stage}: wrong world`);
    if (row.expected.packId) assert.equal(state.packId, row.expected.packId, `${row.id} ${stage}: wrong structured life`);
    if (row.expected.packInstanceId) assert.equal(state.packInstanceId, row.expected.packInstanceId, `${row.id} ${stage}: wrong earned life instance`);
    if (row.expected.packSnapshotHash) assert.equal(state.packSnapshotHash, row.expected.packSnapshotHash, `${row.id} ${stage}: wrong earned life checkpoint`);
    if (row.expected.stoneCount !== undefined) assert.equal(state.stoneCount, row.expected.stoneCount, `${row.id} ${stage}: primeval stone count changed on load/round-trip`);
    if (row.expected.completed) assert.equal(state.completed[row.expected.completed], 1, `${row.id} ${stage}: ch129 action progress was lost`);
    if (row.expected.fact) assert.equal(state.playerFacts[row.expected.fact.key], row.expected.fact.value, `${row.id} ${stage}: expected saved life fact is missing`);
    assert.equal(state.clock, row.expected.clock + 1, `${row.id} ${stage}: idle minute did not persist`);
    if (row.expected.capabilityRun) {
        assert.ok(state.ryanRun, `${row.id} ${stage}: Ryan capability run was lost`);
        assert.equal(state.ryanRun.world.clock, row.expected.ryanClock, `${row.id} ${stage}: Ryan action clock changed during an idle minute`);
        assert.equal(state.ryanRun.world.holders.ryan.state['perfect_run.attempt'].phase, row.expected.ryanPhase,
            `${row.id} ${stage}: Ryan continuation phase changed`);
    }
    return state;
}

async function loadGame(page, base, {navigate = false} = {}) {
    if (navigate) await page.goto(`${base}/?test_hooks=1`);
    await page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 120000});
    await page.evaluate(() => window.simulationTestHooks.pause());
    const play = page.locator('#loading_screen_play_button');
    if (await play.isVisible().catch(() => false)) await play.click();
    await page.waitForTimeout(350);
    return page.evaluate(() => window.simulationTestHooks.snapshot());
}

function gameClock(save) { return save.expansion?.clock; }

async function readFixture(row) {
    const file = join(row.private ? PRIVATE_FIXTURES : FIXTURES, row.file);
    const bytes = await readFile(file).catch(error => {
        if (error.code === 'ENOENT') throw new Error(`${row.id}: required ${row.private ? 'private ' : ''}save fixture is missing at ${file}. Restore the exact earned fixture from its manifest provenance.`);
        throw error;
    });
    const inputSha256 = hash(bytes);
    assert.equal(inputSha256, row.sha256, `${row.id}: fixture bytes changed; inspect provenance before updating the pin`);
    return {row, input: parseSave(bytes, row.file), inputSha256};
}

async function replay({row, input, inputSha256}, browser, base) {
    const pageErrors = [];
    const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true});
    const page = await context.newPage();
    page.setDefaultTimeout(90000);
    page.on('pageerror', error => pageErrors.push(error.message));
    await context.addInitScript(value => {
        if (!sessionStorage.getItem('save-gate-seeded')) {
            localStorage.clear();
            localStorage.setItem('save data', JSON.stringify(value));
            sessionStorage.setItem('save-gate-seeded', '1');
        }
    }, input);
    try {
        const loaded = await loadGame(page, base, {navigate: true});
        assert.equal(loaded.character?.name, row.expected.character, `${row.id}: wrong character after production load`);
        assert.equal(loaded['current location'], row.expected.location, `${row.id}: wrong checkpoint after production load`);
        assert.equal(gameClock(loaded), row.expected.clock, `${row.id}: wrong checkpoint clock after production load`);
        assert.equal(await page.evaluate(() => !!(window.is_loading_error || window.lifeStorageFailure)), false,
            `${row.id}: production loader reported a storage failure`);

        if (row.expected.capabilityRun) {
            const initialRun = input.capabilityRuns?.runs?.[row.expected.capabilityRun];
            assert.ok(initialRun, `${row.id}: expected embedded Ryan run is missing`);
            assert.equal(initialRun.world.clock, row.expected.ryanClock);
            assert.equal(initialRun.world.holders.ryan.state['perfect_run.attempt'].phase, row.expected.ryanPhase);
        }

        await page.evaluate(() => advanceTicks(1));
        const afterTick = await page.evaluate(() => window.simulationTestHooks.snapshot());
        assert.equal(afterTick.expansion.clock, row.expected.clock + 1, `${row.id}: host clock stalled after load`);
        if (row.expected.capabilityRun) {
            assert.ok(isDeepStrictEqual(afterTick.capabilityRuns?.runs?.ryan, input.capabilityRuns.runs.ryan),
                `${row.id}: idle host tick unexpectedly changed action-driven Ryan progress`);
        }

        await page.locator('#save_button').click();
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('save data')));
        assert.ok(isDeepStrictEqual(assertCheckpoint(row, saved, 'save'), assertCheckpoint(row, afterTick, 'tick')),
            `${row.id}: save changed checkpoint identity`);
        await page.reload({waitUntil: 'domcontentloaded'});
        const reloaded = await loadGame(page, base);
        assertCheckpoint(row, reloaded, 'reload');

        const downloadPromise = page.waitForEvent('download');
        await page.locator('#save_to_file_button').click();
        const download = await downloadPromise;
        const exportDir = await mkdtemp(join(tmpdir(), 'yairpg-save-gate-'));
        const exportPath = join(exportDir, `${row.id}.save.txt`);
        let exported;
        try {
            await download.saveAs(exportPath);
            exported = await readFile(exportPath, 'utf8');
        } finally {
            await rm(exportDir, {recursive: true, force: true});
        }
        assert.ok(exported.startsWith('YAIR-UTF8-1:'), `${row.id}: Export envelope changed`);
        await Promise.all([
            page.waitForNavigation({waitUntil: 'domcontentloaded'}),
            page.locator('#saved_file_input').setInputFiles({name: `${row.id}.save.txt`, mimeType: 'text/plain', buffer: Buffer.from(exported)}),
        ]);
        const imported = await loadGame(page, base);
        assertCheckpoint(row, imported, 'literal import');
        if (row.expected.capabilityRun) {
            await openPanel(page, 'capability-runs');
            const tab = page.locator(`[data-capability-run="${row.expected.capabilityRun}"]`);
            await tab.waitFor({state: 'visible'});
            assert.equal((await tab.innerText()).trim(), row.expected.continuationTab, `${row.id}: Ryan continuation tab is unavailable after import`);
            assert.equal(await tab.isDisabled(), false, `${row.id}: Ryan continuation tab is disabled after import`);
            await tab.click();
            const action = page.locator(`[data-capability-action="${row.expected.continuationAction}"]`);
            await action.waitFor({state: 'visible'});
            assert.equal(await action.isDisabled(), false, `${row.id}: Ryan's next chapter action is disabled after import`);
        }
        assert.deepEqual(pageErrors, [], `${row.id}: browser console page errors`);
        return {id: row.id, inputSha256, result: 'passed', startClock: loaded.expansion.clock,
            afterIdleClock: afterTick.expansion.clock, reloadClock: reloaded.expansion.clock,
            importClock: imported.expansion.clock, location: imported['current location'], character: imported.character.name,
            browserPageErrors: pageErrors.length, ...(row.expected.capabilityRun ? {ryanRunClock: row.expected.ryanClock, ryanPhase: row.expected.ryanPhase} : {})};
    } finally {
        await context.close();
    }
}

const bundle = await readFile(join(BUILT_ROOT, 'dist/bundle.js')).catch(() => null);
assert.ok(bundle, 'Build first with `npm run build`; the gate uses the rebuilt production browser bundle.');
const selected = process.argv.slice(2).filter(arg => arg.startsWith('--only=')).map(arg => arg.slice('--only='.length));
const rows = selected.length ? manifest.fixtures.filter(row => selected.includes(row.id)) : manifest.fixtures;
assert.equal(rows.length, selected.length || manifest.fixtures.length, 'Unknown --only fixture id');
const fixtures = await Promise.all(rows.map(readFixture));
const server = await serveCheckout(BUILT_ROOT);
let browser;
try {
    browser = await launchChrome();
    const results = [];
    for (const fixture of fixtures) results.push(await replay(fixture, browser, server.base));
    process.stdout.write(JSON.stringify({schema: manifest.schema, bundleSha256: hash(bundle), loader: 'rebuilt normal browser entry', results}, null, 2) + '\n');
} finally {
    try { await browser?.close(); }
    finally { server.close(); }
}
