// LT8 native walk (docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md): one person record, two worlds.
// Klein: fresh origin -> Be Klein -> hand in the weekly expense application twice (a week apart) -> Dunn's trust opens the talk.
// Harry: fresh origin -> lead life -> the household acts -> train -> Sorting -> first Charms -> Ron's regard opens the evening talk.
// Each ends with Save, reload, literal Export and Import, then rereads the tie and the note. Headless 1920x1080; private packs served
// locally; output holds ids, counts and hashes only (no cast text). Usage: node scripts/playtest/cross-world-ties.mjs [lotm|hp|both] [outDir]
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';
import {NativeContinuation} from './native-continuation.mjs';

const which = process.argv[2] || 'both', out = resolve(process.argv[3] || '/tmp/cross-world-ties');
await mkdir(out, {recursive: true});
const bundle = await buildBundle(), server = await serve(bundle.dir);
const bundleHash = createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex');
const receipt = {bundle: bundleHash, runs: {}};
const snap = p => p.evaluate(() => window.simulationTestHooks.snapshot().expansion);
const panel = (p, id) => p.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption(id);
// Same readiness rule as Session.open: hooks present and PLAY shown (or the loading screen already gone); PLAY is forced on headless.
const play = async p => {
    await p.waitForFunction(() => !!window.simulationTestHooks && (document.getElementById('loading_screen_play_button')?.checkVisibility() ||
        document.getElementById('loading_screen')?.style.visibility === 'hidden'), null, {timeout: 60000});
    await p.evaluate(() => window.simulationTestHooks.pause());
    const b = p.locator('#loading_screen_play_button'); if(await b.isVisible()) await b.click({force: true});
    await p.waitForTimeout(400);
};
// Save, reload, literal Export and Import; returns the expansion state after Import.
async function roundTrip(s, reopen) {
    const p = s.page;
    await p.evaluate(() => window.saveProgress()); await p.reload(); await play(p); await reopen();
    const afterReload = await snap(p);
    const literal = await p.evaluate(() => window.save_to_file());
    await Promise.all([p.waitForEvent('load', {timeout: 30000}), p.evaluate(x => load_progress(x), literal)]); await play(p); await reopen();
    return {afterReload, afterImport: await snap(p)};
}

async function walkLotm() {
    const s = new Session({url: server.url, seed: 7, wall: Date.UTC(2026, 10, 7), opTimeout: 20000}), r = {checks: []};
    await s.start(); await s.open(null); const p = s.page;
    try {
        await panel(p, 'lotm');
        await p.getByRole('button', {name: 'Developer playthrough: Be Klein Moretti'}).click();
        // Starting the new life reloads the page into it; PLAY again on the reloaded page.
        await Promise.all([p.waitForEvent('load', {timeout: 60000}), p.getByRole('button', {name: 'Start this new life'}).click({noWaitAfter: true})]);
        await play(p);
        assert.equal((await snap(p)).actors.player.worldId, 'book.lotm.tingen');
        const open = async () => {await panel(p, 'lotm'); await p.locator('button').filter({hasText: /^Work & merit$/}).first().click(); await p.waitForTimeout(250);};
        await open();
        const DUNN = 'lotm.person.cast-618f4df49af02c7da45e', OFFER = '[data-lotm="tie_book.lotm.tie.dunn_funding"]', DUTY = '[data-lotm="duty_lotm.expense_claim"]';
        const trust = st => st.simulation.relationships?.[DUNN]?.player?.axes?.['tie.trust'] || 0;
        assert.equal(await p.locator(OFFER).isDisabled(), true); assert.equal(trust(await snap(p)), 0);
        const shut = await p.locator('[data-tie-offer]').innerText();
        assert.match(shut, /once he has signed two/); r.checks.push('offer shown shut with its reason before any filing');
        await p.locator(DUTY).click(); await p.waitForTimeout(300);
        let st = await snap(p); assert.equal(trust(st), 1); assert.ok(st.simulation.knowledge.player['book.lotm.tie.dunn_signed']);
        assert.equal(await p.locator(OFFER).isDisabled(), true); r.checks.push('week 1 filed by the duty button: trust 1, observation note held, offer still shut');
        // A week of native time, a day per call (one 10,080-minute call exhausted the headless page).
        for(let d = 0; d < 7; d++) {await s.step(1440); await p.waitForTimeout(50);}
        await open();
        await p.locator(DUTY).click(); await p.waitForTimeout(300);
        st = await snap(p); assert.equal(trust(st), 2); r.checks.push('week 2 filed after seven native days: trust 2');
        assert.equal(await p.locator(OFFER).isDisabled(), false);
        await p.locator(OFFER).click(); await p.waitForTimeout(300);
        st = await snap(p); const note = st.simulation.knowledge.player['book.lotm.tie.dunn_funding'];
        assert.equal(note?.basis?.attributedTo, DUNN); assert.equal(await p.locator(OFFER).count(), 0);
        r.checks.push('offer taken: one note attributed to Dunn, the button is gone');
        // FLR3: what Dunn said stays readable where it was asked.
        assert.match(await p.locator('[data-tie-said="book.lotm.tie.dunn_funding"]').innerText(), /quarterly funding request/);
        r.checks.push('what Dunn said is shown in Work & merit after the talk');
        const {afterReload, afterImport} = await roundTrip(s, open);
        for(const x of [afterReload, afterImport]) {assert.equal(trust(x), 2); assert.ok(x.simulation.knowledge.player['book.lotm.tie.dunn_funding']);}
        assert.match(await p.locator('[data-tie-said="book.lotm.tie.dunn_funding"]').innerText(), /quarterly funding request/);
        r.checks.push('save, reload, Export and Import keep trust 2 and the note');
        r.errors = s.errors.length; assert.equal(s.errors.length, 0, JSON.stringify(s.errors.slice(0, 3)));
        r.ok = true;
    } catch(e) {r.ok = false; r.error = String(e.stack || e).slice(0, 1500); r.errors = s.errors.slice(0, 5); await p.screenshot({path: join(out, 'lotm-fail.png')}).catch(() => {});
        r.debug = await p.evaluate(() => ({world: simulationTestHooks.snapshot().expansion.actors.player.worldId, options: [...document.querySelectorAll('#workspace_navigation select')].map(e => e.getAttribute('aria-label') + ':' + [...e.options].map(o => o.value).join(',')), buttons: [...document.querySelectorAll('button')].filter(b => b.checkVisibility()).map(b => b.innerText.trim()).filter(Boolean).slice(0, 40)})).catch(x => String(x));}
    finally {await s.close();}
    return r;
}

async function walkHp() {
    const s = new Session({url: server.url, seed: 11, wall: Date.UTC(2026, 10, 7), opTimeout: 20000}), r = {checks: []};
    await s.start(); await s.open(null); const p = s.page, P = 'book.hp.lead', RON = P + '.ron', TALK = `[data-hp-tie="${P}.tie.ron_family"]`;
    const aff = st => st.simulation.relationships?.[RON]?.player?.axes?.['tie.affection'] || 0;
    try {
        await panel(p, 'beginning');
        await p.locator('[data-structured-choice="life"]').selectOption(P); await p.waitForTimeout(300);
        await p.locator('[data-structured-begin]').click(); await p.waitForTimeout(500);
        assert.equal((await snap(p)).actors.player.worldId, P + '.world');
        const nc = new NativeContinuation(s, {panel: 'hp', attrPrefix: 'hp', stepLimit: 2000});
        await nc.panel(); let acts = 0;
        while((await nc.view()).arc?.next && acts < 120) {await nc.startCurrent(); await nc.settle(); acts++;}
        r.householdActs = acts;
        const day = async () => p.evaluate(() => simulationTestHooks.project('hp')?.school);
        // Wait natively to the term (lead day 32), then the school route by its own buttons.
        for(let d = 0; d < 32; d++) {await s.step(1440); if(d % 4 === 3) console.error(`hp: day ${d + 1} of 32`);}
        await nc.panel();
        await p.locator(`[data-hp-school="${P}.arrive_school"]`).click(); await s.step(490); await nc.panel();
        await p.locator(`[data-hp-school="${P}.sorting"]`).click(); await s.step(20); await nc.panel();
        let st = await snap(p); assert.equal(aff(st), 1); assert.ok(st.simulation.knowledge.player[P + '.tie.ron.sorting']);
        assert.equal(await p.locator(TALK).isDisabled(), true);
        assert.match(await p.locator('[data-hp-friends]').innerText(), /few more days of school/);
        r.checks.push('Sorting by its button: Ron affection 1, observation held, the talk shown shut with its reason');
        // The first Charms lesson opens on a term Monday 09:00; wait by the hour until its button is live.
        const charms = p.locator('[data-hp-lesson]').filter({hasText: 'first Charms'});
        let waited = 0; while(await charms.isDisabled() && waited < 9 * 24) {await s.step(60); await nc.panel(); waited++;}
        r.hoursWaitedForCharms = waited;
        await charms.click(); await s.step(35); await nc.panel();
        st = await snap(p); assert.equal(aff(st), 2); r.checks.push('first Charms by its button: Ron affection 2');
        assert.equal(await p.locator(TALK).isDisabled(), false);
        await p.locator(TALK).click(); await s.step(35); await nc.panel();
        st = await snap(p); const note = st.simulation.knowledge.player[P + '.tie.ron_family'];
        assert.equal(note?.basis?.attributedTo, RON); r.checks.push('talk taken: one note attributed to Ron');
        await panel(p, 'beginning'); await p.waitForTimeout(300);
        r.peopleViewShowsRonLines = await p.evaluate(() => document.body.innerText.includes('five older brothers') && document.body.innerText.includes('moved up the bench'));
        const reopen = async () => {await panel(p, 'hp'); await p.waitForTimeout(250);};
        const {afterReload, afterImport} = await roundTrip(s, reopen);
        for(const x of [afterReload, afterImport]) {assert.equal(aff(x), 2); assert.ok(x.simulation.knowledge.player[P + '.tie.ron_family']);}
        r.checks.push('save, reload, Export and Import keep affection 2 and the note');
        r.errors = s.errors.length; assert.equal(s.errors.length, 0, JSON.stringify(s.errors.slice(0, 3)));
        r.ok = true;
    } catch(e) {r.ok = false; r.error = String(e.stack || e).slice(0, 1500); r.errors = s.errors.slice(0, 5); await p.screenshot({path: join(out, 'hp-fail.png')}).catch(() => {});}
    finally {await s.close();}
    return r;
}

try {
    if(which !== 'hp') receipt.runs.lotm = await walkLotm();
    if(which !== 'lotm') receipt.runs.hp = await walkHp();
} finally {server.close(); await bundle.dispose();}
await writeFile(join(out, 'receipt.json'), JSON.stringify(receipt, null, 1));
console.log(JSON.stringify(receipt, null, 1));
process.exit(Object.values(receipt.runs).every(r => r.ok) ? 0 : 1);
