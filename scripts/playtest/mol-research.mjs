// Zorian's spell research in the rebuilt browser at 1920x1080 on a fresh origin (KNW13, KNW19, WKR13). Route: a fresh native Zorian
// start (the Village exit and chart steps of mol-restart-memory.mjs), then a NAMED FIXTURE: Haslush's lesson entry is written into the
// save (the lesson itself is proven by mol-haslush-monday.mjs; its earned private checkpoints no longer load under the current
// content-pack registration, a defect already on master). Then earned: the library shelf, three sealed-box trials, the write-up,
// Save/reload/Export/Import, a named clock-only jump to the month's end, the automatic reset, and the refined research still in the
// notebook with the sessions gone from the cards.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {validateSaveEnvelope} from '../../src/save_files.js';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';

const [buildDir, output] = process.argv.slice(2);
assert(buildDir && output, 'Usage: node scripts/playtest/mol-research.mjs <BUILD_OUT> <evidence dir>');
await mkdir(output, {recursive: true});
const server = await serve(path.resolve(buildDir));
const session = await new Session({url: server.url + '?test_hooks=1', seed: 7, wall: 1760000000000, opTimeout: 30000}).start();
const base = 'book.mol.', R = base + 'zorian.research.', W = R + 'ward.';
const notes = s => s.expansion.simulation.knowledge.player;
const reserve = s => s.expansion.simulation.energies.player[base + 'zorian.reserve'].reserve;
const snapshot = () => session.page.evaluate(() => simulationTestHooks.snapshot());
const card = id => session.page.locator(`[data-action-legibility-key="action:${id}"]`);
const button = id => card(id).locator('button.action-legibility__button');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const boot = async () => {
    const page = session.page;
    await page.waitForFunction(() => window.simulationTestHooks &&
        (document.getElementById('loading_screen_play_button')?.checkVisibility() || document.getElementById('loading_screen')?.style.visibility === 'hidden'), null, {timeout: 60000});
    await page.evaluate(() => simulationTestHooks.pause());
    const play = page.locator('#loading_screen_play_button');
    if (await play.isVisible()) await play.click({force: true});
};
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
async function act(id) {
    const b = button(id);
    await b.waitFor();
    assert(await b.isEnabled(), await card(id).innerText());
    await b.click();
    for (let i = 0; i < 40; i++) {
        if (!(await snapshot()).expansion.simulation.jobs.some(j => j.actorId === 'player' && j.commandId === id)) return;
        await session.page.evaluate(() => simulationTestHooks.workTicks(8));
    }
    assert.fail('Did not settle: ' + id);
}
const advanceNativeDate = (time, delta) => {
    const t = time.hour * 60 + time.minute + delta;
    let days = Math.floor(t / 1440);
    time.day_count += days; time.hour = Math.floor((t % 1440) / 60); time.minute = t % 60;
    while (days-- > 0) if (++time.day > 30) { time.day = 1; if (++time.month > 12) { time.month = 1; time.year++; } }
};
try {
    await session.open();
    const local = session.page.locator('#location_actions_div');
    await local.getByText('Talk to someone', {exact: false}).first().click();
    await local.locator('[data-dialogue="villageElder"]').click();
    for (const key of ['hello', 'what happened', 'ask to leave 1', 'need to']) await local.locator(`.talk-view [data-topic-id="${key}"]`).click();
    await session.page.locator('#center_mode_back').click();
    await session.step(3);
    await panel();
    await act(base + 'chart');
    await act(base + 'begin_zorian');
    await session.page.waitForFunction(() => {
        const c = simulationTestHooks.snapshot().continuation;
        return c?.lives[c.active]?.initial.expansion.motherOfLearning?.entryProfile === 'book.mol.zorian@1';
    }, null, {polling: 250, timeout: 10000});
    const fresh = await snapshot();
    assert.equal(notes(fresh)[base + 'zorian.s2.object_analysis_method'], undefined, 'a fresh life has not had the lesson');
    // Named fixture: the lesson's entry, as Haslush's Monday writes it.
    const lesson = structuredClone(fresh);
    notes(lesson)[base + 'zorian.s2.object_analysis_method'] = {stage: 'understood', value: 'Haslush taught you to ask the spell one narrow question.', at: lesson.expansion.clock, cause: 'fixture.haslush_lesson',
        basis: {kind: 'recollection', attributedTo: 'player', situationId: 'book.mol.visitor_branch'}};
    validateSaveEnvelope(lesson, lesson['game version']);
    await writeFile(path.join(output, 'lesson.named-fixture.json'), JSON.stringify(lesson));
    await session.open(lesson);
    let s = await snapshot();
    assert(notes(s)[base + 'zorian.s2.object_analysis_method'], 'fixture holds the lesson');
    const run1 = s.expansion.motherOfLearning.runs ?? 1;
    await panel();
    // The route card leads with the next piece of work.
    const library = base + 'move.library';
    await act(library);
    await act(R + 'compare_library_notes');
    await act(base + 'move.house');
    const r0 = reserve(await snapshot());
    for (const id of ['trial_empty_box', 'trial_warded_box']) await act(R + id);
    s = await snapshot();
    assert.equal(reserve(s), r0 - 2);
    assert(notes(s)[W + 'trial_2'] && !notes(s)[W + 'refined']);
    await session.page.screenshot({path: path.join(output, 'mid-research-1920.png')});
    // Save, reload, Export, Import: the entries stay.
    await session.page.reload(); await boot();
    assert.deepEqual(notes(await snapshot()), notes(s));
    const encoded = await session.page.evaluate(() => save_to_file());
    await Promise.all([session.page.waitForEvent('load', {timeout: 30000}),
        session.page.locator('#saved_file_input').setInputFiles({name: 'research.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]);
    await boot();
    assert.deepEqual(notes(await snapshot()), notes(s));
    await panel();
    await act(R + 'trial_purpose_question');
    await act(R + 'write_up_the_method');
    const done = await snapshot();
    assert.equal(notes(done)[W + 'refined'].stage, 'understood');
    const text = await (await panel()).innerText();
    assert.match(text, /carries across every restart/);
    await session.page.screenshot({path: path.join(output, 'refined-1920.png')});
    // Loop reset: a named clock-only jump to the month's last night, then the automatic restart.
    const near = structuredClone(done), cal = near.expansion.motherOfLearning;
    const target = (cal.runStartedAt ?? cal.initializedAt) + 29 * 1440 + 17 * 60 - 1, delta = target - near.expansion.clock;
    assert(delta > 0 && near.expansion.simulation.jobs.length === 0);
    for (const family of ['checks', 'controllers']) for (const sc of Object.values(near.expansion.simulation[family])) sc.due += delta;
    near.expansion.clock = target; advanceNativeDate(near['current time'], delta);
    validateSaveEnvelope(near, near['game version']);
    const nearPath = path.join(output, 'near-month-end.earned-clock-fixture.json');
    await writeFile(nearPath, JSON.stringify(near));
    await session.open(near);
    await Promise.all([session.page.waitForEvent('load', {timeout: 30000}), session.page.evaluate(() => advanceTicks(2))]);
    await boot();
    const next = await session.save();
    assert.equal(next.expansion.motherOfLearning.runs, run1 + 1);
    for (const k of ['shelf', 'trial_1', 'trial_2', 'trial_3', 'refined']) assert(notes(next)[W + k], k + ' crossed');
    assert.equal(reserve(next), 8, 'the reserve reset');
    assert.equal(next.expansion.actors.player.completed[R + 'compare_library_notes'], undefined, 'the receipt reset');
    const sec = await panel();
    assert.match(await sec.innerText(), /carries across every restart/);
    assert.equal(await card(R + 'compare_library_notes').count(), 0, 'no sessions left to redo');
    await session.page.screenshot({path: path.join(output, 'after-reset-1920.png')});
    assert.equal((await session.uiCheck()).pageOverflow, 0);
    assert.deepEqual(session.errors.filter(e => e.kind === 'pageerror'), []);
    await writeFile(path.join(output, 'after-reset.save.json'), JSON.stringify(next));
    const receipt = {route: 'fresh native Zorian start; named fixture (lesson entry); earned research sessions; named clock-only month-end jump; automatic reset',
        viewport: '1920x1080', bundle: digest(await readFile(path.join(buildDir, 'dist/bundle.js'))), 
        fixture: digest(await readFile(nearPath)), checks: {sessions: 5, saveReloadExportImport: true, entriesCrossedReset: true, reserveReset: 8, pageErrors: 0}};
    await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(receipt);
} catch (error) {
    await session.page?.screenshot({path: path.join(output, 'failure.png')}).catch(() => {});
    console.error(error);
    process.exitCode = 1;
} finally {
    await session.close(); server.close?.();
}
