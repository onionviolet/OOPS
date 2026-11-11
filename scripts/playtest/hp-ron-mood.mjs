// MND5 second world, native walk (book_world_hp_lead_mood.js): fresh origin -> Harry's lead life -> household acts -> term -> Sorting
// (Ron glad) -> first Charms (Ron cross about his feather) -> practice with Ron refused with his reason -> Save, reload, literal Export
// and Import keep the refusal and the words -> a day later Ron practises and the charm's mastery rises. Headless 1920x1080; output
// holds ids, counts and lines from the public life only. Usage: node scripts/playtest/hp-ron-mood.mjs [outDir]
import assert from 'node:assert/strict';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';
import {NativeContinuation} from './native-continuation.mjs';

const out = resolve(process.argv[2] || '/tmp/hp-ron-mood');
await mkdir(out, {recursive: true});
const bundle = await buildBundle(), server = await serve(bundle.dir);
const snap = p => p.evaluate(() => window.simulationTestHooks.snapshot().expansion);
const panel = (p, id) => p.locator('#workspace_navigation select').selectOption(id);
const play = async p => {
    await p.waitForFunction(() => !!window.simulationTestHooks && (document.getElementById('loading_screen_play_button')?.checkVisibility() ||
        document.getElementById('loading_screen')?.style.visibility === 'hidden'), null, {timeout: 60000});
    await p.evaluate(() => window.simulationTestHooks.pause());
    const b = p.locator('#loading_screen_play_button'); if(await b.isVisible()) await b.click({force: true});
    await p.waitForTimeout(400);
};
const s = new Session({url: server.url, seed: 11, wall: Date.UTC(2026, 10, 10), opTimeout: 20000}), r = {checks: []};
const P = 'book.hp.lead', PRACTICE = `[data-hp-tie="${P}.tie.ron_practice"]`, LEV = `${P}.levitation`;
// HP_RON_SEED: a save written by an earlier run right after the Sorting (sorted.save.json), to resume a long walk there.
const seed = process.env.HP_RON_SEED ? JSON.parse(await readFile(process.env.HP_RON_SEED, 'utf8')) : null;
await s.start(); await s.open(seed); const p = s.page;
const nc = new NativeContinuation(s, {panel: 'hp', attrPrefix: 'hp', stepLimit: 2000});
const friends = () => p.locator('[data-hp-friends]').innerText();
const practiceRow = () => p.locator(PRACTICE).locator('xpath=..').innerText();
try {
    if(!seed) {
    await panel(p, 'beginning');
    await p.locator('[data-structured-choice="life"]').selectOption(P); await p.waitForTimeout(300);
    await p.locator('[data-structured-begin]').click(); await p.waitForTimeout(500);
    assert.equal((await snap(p)).actors.player.worldId, P + '.world');
    await nc.panel(); let acts = 0;
    while((await nc.view()).arc?.next && acts < 120) {await nc.startCurrent(); await nc.settle(); acts++;}
    for(let d = 0; d < 32; d++) await s.step(1440);
    await nc.panel();
    await p.locator(`[data-hp-school="${P}.arrive_school"]`).click(); await s.step(490); await nc.panel();
    await p.locator(`[data-hp-school="${P}.sorting"]`).click(); await s.step(20); await nc.panel();
    r.afterSorting = (await friends()).match(/Ron[^\n]*/)?.[0];
    assert.match(r.afterSorting, /good humour with you: the hat put you in Gryffindor beside him/);
    r.checks.push('Sorting by its button: Friends shows Ron in good humour with you, with the reason');
    await writeFile(join(out, 'sorted.save.json'), JSON.stringify(await s.save()));
    } else {r.fixture = 'native post-Sorting save from this walk'; await nc.panel();}
    const charms = p.locator('[data-hp-lesson]').filter({hasText: 'first Charms'});
    let waited = 0; while(await charms.isDisabled() && waited < 9 * 24) {await s.step(60); await nc.panel(); waited++;}
    await charms.click(); await s.step(35); await nc.panel();
    const st = await snap(p);
    assert.equal(st.simulation.relationships[`${P}.ron`].player.axes['tie.affection'], 2, 'regard is high enough; only mood can shut practice');
    assert.equal(st.simulation.powers.player[LEV].owned, true);
    assert.equal(await p.locator(PRACTICE).isDisabled(), true);
    r.refused = await practiceRow(); assert.match(r.refused, /Ron has had enough of that charm for today/);
    r.ronLine = (await friends()).match(/Ron[^\n]*/)?.[0]; assert.match(r.ronLine, /sour mood at the moment: his feather would not leave the desk in Charms/);
    r.checks.push(`first Charms by its button (after ${waited} h): affection 2 and the charm learned, yet practice with Ron is shut by his mood, reason shown`);
    await p.screenshot({path: join(out, 'ron-sour-1920x1080.png')});
    // Save, reload, literal Export and Import: the dated notes come back, so the mood is rebuilt and still refuses.
    await p.evaluate(() => window.saveProgress()); await p.reload(); await play(p); await nc.panel();
    assert.equal(await p.locator(PRACTICE).isDisabled(), true); assert.match(await friends(), /sour mood at the moment/);
    const literal = await p.evaluate(() => window.save_to_file());
    r.saveHasMoodKey = /moodThoughts/.test(literal);
    await Promise.all([p.waitForEvent('load', {timeout: 30000}), p.evaluate(x => load_progress(x), literal)]); await play(p); await nc.panel();
    assert.equal(await p.locator(PRACTICE).isDisabled(), true); assert.match(await practiceRow(), /had enough of that charm/);
    r.checks.push('save, reload, Export and Import: Ron is still cross and practice still shut (rebuilt from the saved dated notes)');
    // A day on, the thought has run out by itself and Ron practises.
    await s.step(24 * 60); await nc.panel();
    assert.equal(await p.locator(PRACTICE).isDisabled(), false, 'Ron has cooled off');
    const before = (await snap(p)).simulation.powers.player[LEV].mastery;
    await p.locator(PRACTICE).click(); await s.step(25); await nc.panel();
    r.mastery = [before, (await snap(p)).simulation.powers.player[LEV].mastery]; assert.equal(r.mastery[1], before + 1);
    r.checks.push(`a day later practice with Ron opens by itself and runs: levitation mastery ${r.mastery[0]} -> ${r.mastery[1]}`);
    await p.screenshot({path: join(out, 'ron-practice-1920x1080.png')});
    // Missing local font files (resources/fonts/private, not in a clean checkout) log 404s; every other console or page error fails.
    const real = s.errors.filter(e => !/Failed to load resource: the server responded with a status of 404/.test(e.text));
    r.missingResources = s.errors.length - real.length; r.errors = real.length; assert.equal(real.length, 0, JSON.stringify(real.slice(0, 3)));
    r.ok = true;
} catch(e) {r.ok = false; r.error = String(e.stack || e).slice(0, 1500); r.errors = s.errors.slice(0, 5); await p.screenshot({path: join(out, 'fail.png')}).catch(() => {});}
finally {await s.close?.(); server.close(); await bundle.dispose();}
await writeFile(join(out, 'result.json'), JSON.stringify(r, null, 1));
console.log(JSON.stringify(r, null, 1));
process.exit(r.ok ? 0 : 1);
