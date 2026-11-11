// Zorian's class tests in headless Chrome at 1920x1080 from a fresh origin (mol_exam_model.js, mol_zorian_exams.js).
// Route: fresh native start, the Village elder and chart, begin Zorian (as mol-restart-memory.mjs), then panel buttons only:
// revise, Nora's placement test, three papers, the month's end, run 2. Between days a clock-only fixture moves the save forward
// (the same named technique as mol-restart-memory.mjs: no job running, scheduled checks and controllers shifted by the same delta);
// it claims no scheduled work ran through the skipped hours. Dev/test only, no new save field.
// Usage: node scripts/playtest/mol-exams.mjs <BUILD_OUT> <evidence dir>
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {validateSaveEnvelope} from '../../src/save_files.js';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';

const [buildDir, output] = process.argv.slice(2);
assert(buildDir && output, 'Usage: node scripts/playtest/mol-exams.mjs <BUILD_OUT> <evidence dir>');
await mkdir(output, {recursive: true});
const server = await serve(path.resolve(buildDir));
const session = await new Session({url: server.url + '?test_hooks=1', seed: 7, wall: 1760000000000, opTimeout: 20000}).start();
const base = 'book.mol.', X = base + 'zorian.exam.', SUBJECTS = ['formulas', 'mathematics', 'warding'];
const facts = s => s.expansion.actors.player.facts, res = s => s.expansion.actors.player.resources;
const snapshot = () => session.page.evaluate(() => simulationTestHooks.snapshot());
const card = id => session.page.locator(`[data-action-legibility-key="action:${id}"]`);
const action = id => card(id).locator('button.action-legibility__button');
const log = [], digest = bytes => createHash('sha256').update(bytes).digest('hex');
const boot = async () => {
    const page = session.page;
    await page.waitForFunction(() => window.simulationTestHooks && document.getElementById('loading_screen_play_button')?.checkVisibility(), null, {timeout: 60000});
    await page.evaluate(() => simulationTestHooks.pause());
    await page.locator('#loading_screen_play_button').click();
};
const open = async summary => {
    const p = session.page.locator('#feature_expansion_panel');
    const section = p.locator(':scope > div > details').filter({has: session.page.locator('summary').filter({hasText: summary})}).first();
    await section.waitFor();
    if (!await section.evaluate(n => n.open)) await section.locator(':scope > summary').click();
    return section;
};
async function panel() {
    const page = session.page;
    await page.locator('#workspace_navigation select').selectOption('notebook');
    await page.locator('[data-notebook-view="here"]').click();
    const p = page.locator('#feature_expansion_panel');
    if (!await p.evaluate(n => n.open)) await p.locator(':scope > summary').click();
    await open(/Mother of Learning/);
    if (await p.locator(':scope > div > details').filter({has: page.locator('summary').filter({hasText: /Class tests this month/})}).count()) await open(/Class tests this month/);
}
const tests = async () => { await panel(); return (await open(/Class tests this month/)).innerText(); };
const campaignText = async () => { await panel(); return (await open(/Mother of Learning/)).innerText(); };
async function act(id) {
    const button = action(id);
    await button.waitFor();
    assert(await button.isEnabled(), await card(id).innerText());
    await button.click();
}
async function settle(id) {
    await act(id);
    for (let i = 0; i < 250; i++) {
        if (!(await snapshot()).expansion.simulation.jobs.some(j => j.commandId === id)) return;
        await session.page.evaluate(() => simulationTestHooks.workTicks(100));
    }
    assert.fail('Timed action did not settle: ' + id);
}
const shot = async name => { const t = session.page.locator('#feature_expansion_panel details').filter({hasText: /Class tests this month/}).first(); await t.scrollIntoViewIfNeeded().catch(() => {}); await session.page.screenshot({path: path.join(output, name + '.png')}); };
const advanceNativeDate = (time, delta) => {
    const t = time.hour * 60 + time.minute + delta;
    let days = Math.floor(t / 1440);
    time.day_count += days; time.hour = Math.floor((t % 1440) / 60); time.minute = t % 60;
    while (days-- > 0) if (++time.day > 30) { time.day = 1; if (++time.month > 12) { time.month = 1; time.year++; } }
};
// Clock-only fixture: the run's day `day` at `minute` past the run's start hour (day 1 06:00), or the month's last minute.
async function jumpTo(day, minute = 180, name = `day-${day}`) {
    const now = await session.save(), near = structuredClone(now), d = near.expansion.motherOfLearning;
    const target = (d.runStartedAt ?? d.initializedAt) + (day - 1) * 1440 + minute, delta = target - near.expansion.clock;
    assert(delta > 0, `jump to day ${day}`); assert.equal(near.expansion.simulation.jobs.length, 0);
    for (const family of ['checks', 'controllers']) for (const scheduled of Object.values(near.expansion.simulation[family])) scheduled.due += delta;
    near.expansion.clock = target; advanceNativeDate(near['current time'], delta);
    validateSaveEnvelope(near, near['game version']);
    const file = path.join(output, `${name}.clock-fixture.json`); await writeFile(file, JSON.stringify(near));
    await session.open(near);
    return file;
}
const reloadKeeps = async (check, what) => { await session.page.reload(); await boot(); check(await snapshot(), what); };
try {
    await session.open();
    const local = session.page.locator('#location_actions_div');
    await local.getByText('Talk to someone', {exact: false}).first().click();
    await local.locator('[data-dialogue="villageElder"]').click();
    for (const key of ['hello', 'what happened', 'ask to leave 1', 'need to']) await local.locator(`.talk-view [data-topic-id="${key}"]`).click();
    await session.page.locator('#center_mode_back').click();
    await session.step(3);
    await panel();
    await settle(base + 'chart');
    await act(base + 'begin_zorian');
    await session.page.waitForFunction(() => { const c = simulationTestHooks.snapshot().continuation; return c?.lives[c.active]?.initial.expansion.motherOfLearning?.entryProfile === 'book.mol.zorian@1'; }, null, {polling: 250, timeout: 10000});
    let t = await tests();
    assert.match(t, /Run 1, day 1\. Spell Formulas is next \(day 3\)/); assert.match(t, /you have not sat this paper before/);
    await shot('1-run1-day1'); log.push({step: 'run 1 day 1', text: t});
    // Revise each subject once in the library, then Nora's placement test in the workshop.
    await panel(); await act(base + 'move.library');
    for (const s of SUBJECTS) await settle(X + 'revise_' + s);
    let s1 = await session.save();
    for (const s of SUBJECTS) assert.equal(res(s1)['book.mol.loop.exam.rev.' + s], 1, s);
    await reloadKeeps(s => SUBJECTS.forEach(x => assert.equal(res(s)['book.mol.loop.exam.rev.' + x], 1)), 'revision after reload');
    t = await tests(); assert.match(t, /Revision 1 of 8/); log.push({step: 'revised', text: t});
    await act(base + 'move.workshop'); await settle(base + 'zorian.s0.placement_test');
    // Day 4: Nora returns the placement test and sets the mathematics test.
    const f4 = await jumpTo(4);
    await panel(); await settle(X + 'exam_formulas'); await settle(X + 'exam_mathematics');
    t = await tests(); assert.match(t, /Spell Formulas \(day 3\): [^\n]* this run/); assert.match(t, /Warding is next \(day 18\)/);
    await shot('2-run1-nora-tests'); log.push({step: 'Nora’s tests', text: t});
    // Day 18: the Warding paper at the academy.
    const f18 = await jumpTo(18);
    await panel(); await act(base + 'move.academy'); await settle(X + 'exam_warding');
    t = await tests(); assert.match(t, /All three tests marked this run: [^\n]* overall/); assert.match(t, /Zach aced it/);
    const run1 = await session.save(), bands1 = Object.fromEntries(SUBJECTS.map(s => [s, facts(run1)['book.mol.zorian.exam.band.' + s]]));
    SUBJECTS.forEach(s => assert.ok(bands1[s], s));
    await shot('3-run1-results'); log.push({step: 'run 1 results', bands: bands1, text: t});
    await reloadKeeps(s => assert.deepEqual(Object.fromEntries(SUBJECTS.map(x => [x, facts(s)['book.mol.zorian.exam.band.' + x]])), bands1), 'bands after reload');
    // The month ends: a clock-only fixture to the last minute, then the host's own tick restarts the run.
    const fEnd = await jumpTo(30, 17 * 60 - 1, 'month-end');
    await Promise.all([session.page.waitForEvent('load', {timeout: 30000}), session.page.evaluate(() => advanceTicks(2))]);
    await boot();
    let next = await session.save();
    assert.equal(next.expansion.motherOfLearning.runs, 2);
    for (const s of SUBJECTS) {
        assert.equal(facts(next)['book.mol.zorian.exam.band.' + s], undefined, 'the class forgets the mark: ' + s);
        assert.equal(facts(next)['book.mol.loop.exam.last.' + s], bands1[s], 'Zorian remembers it: ' + s);
        assert.equal(res(next)['book.mol.loop.exam.sat.' + s], 1); assert.equal(res(next)['book.mol.loop.exam.rev.' + s], 1);
    }
    // Export and import the restarted save.
    const encoded = await session.page.evaluate(() => save_to_file());
    await Promise.all([session.page.waitForEvent('load', {timeout: 30000}),
        session.page.locator('#saved_file_input').setInputFiles({name: 'zorian-run2.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]);
    await boot();
    next = await snapshot();
    for (const s of SUBJECTS) assert.equal(res(next)['book.mol.loop.exam.sat.' + s], 1, 'import keeps the memory: ' + s);
    t = await tests(); assert.match(t, /Run 2, day 1/); assert.match(t, /sat this paper 1 time before, last time/);
    await shot('4-run2-day1'); log.push({step: 'run 2 day 1 after import', text: t});
    // Run 2: revise again, sit the placement test again and get it back; the paper is open again and the counters rise.
    await panel(); await act(base + 'move.library'); await settle(X + 'revise_formulas');
    await act(base + 'move.workshop'); await settle(base + 'zorian.s0.placement_test');
    await jumpTo(3, 180, 'run2-day-3');
    await panel(); await settle(X + 'exam_formulas');
    const run2 = await session.save();
    assert.equal(res(run2)['book.mol.loop.exam.sat.formulas'], 2); assert.equal(res(run2)['book.mol.loop.exam.rev.formulas'], 2);
    t = await tests(); assert.match(t, /Spell Formulas \(day 3\): [^\n]* this run/);
    await shot('5-run2-formulas'); log.push({step: 'run 2 formulas', band: facts(run2)['book.mol.zorian.exam.band.formulas'], text: t});
    await reloadKeeps(s => assert.equal(facts(s)['book.mol.zorian.exam.band.formulas'], facts(run2)['book.mol.zorian.exam.band.formulas']), 'run 2 band after reload');
    assert.equal((await session.uiCheck()).pageOverflow, 0);
    assert.deepEqual(session.errors.filter(e => e.kind === 'pageerror'), []);
    const result = {route: 'fresh native Zorian start; panel buttons; named clock-only day fixtures (day 4, 18, month end, run 2 day 3); automatic month restart; Save/reload/Export/Import',
        viewport: '1920x1080', bundle: digest(await readFile(path.join(buildDir, 'dist/bundle.js'))),
        fixtures: Object.fromEntries(await Promise.all([f4, f18, fEnd].map(async f => [path.basename(f), digest(await readFile(f))]))),
        errors: session.errors, log};
    await writeFile(path.join(output, 'receipt.json'), JSON.stringify(result, null, 1) + '\n');
    console.log(JSON.stringify({bands1, run2: facts(run2)['book.mol.zorian.exam.band.formulas']}));
} catch (error) {
    await session.page?.screenshot({path: path.join(output, 'failure.png')}).catch(() => {});
    await writeFile(path.join(output, 'failure.json'), JSON.stringify({error: error.message, stack: error.stack, errors: session.errors, log}, null, 2));
    throw error;
} finally {
    await session.close();
    await server.close();
}
