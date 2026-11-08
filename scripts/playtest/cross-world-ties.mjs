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
    const seedPath = process.env.KLEIN_MET_DUNN, seed = seedPath ? JSON.parse(await readFile(seedPath, 'utf8')) : null;
    const s = new Session({url: server.url, seed: 7, wall: Date.UTC(2026, 10, 7), opTimeout: 20000}), r = {checks: [], fixture: seedPath ? 'klein-met-dunn (scripts/playtest/klein-to-dunn.mjs, native)' : null};
    await s.start(); await s.open(seed); const p = s.page;
    try {
        if(!seed) {
        await panel(p, 'lotm');
            await p.getByRole('button', {name: 'Developer playthrough: Be Klein Moretti'}).click();
            // Starting the new life reloads the page into it; PLAY again on the reloaded page.
            await Promise.all([p.waitForEvent('load', {timeout: 60000}), p.getByRole('button', {name: 'Start this new life'}).click({noWaitAfter: true})]);
            await play(p);
            assert.equal((await snap(p)).actors.player.worldId, 'book.lotm.tingen');
        }
        const open = async () => {await panel(p, 'lotm'); await p.locator('button').filter({hasText: /^Work & merit$/}).first().click(); await p.waitForTimeout(250);};
        await open();
        const DUNN = 'lotm.person.cast-618f4df49af02c7da45e', OFFER = '[data-lotm="tie_book.lotm.tie.dunn_funding"]', DUTY = '[data-lotm="duty_lotm.expense_claim"]';
        const trust = st => st.simulation.relationships?.[DUNN]?.player?.axes?.['tie.trust'] || 0;
        const dunnKnown = st => ['known', 'met'].some(k => st.simulation.knowledge.player?.[`book.lotm.cast.${k}.${DUNN}`]);
        if(!seed) {
        // X1-G1: before Klein has met Dunn, the talk is not offered and a filing earns no regard (the duty itself still counts).
        assert.equal(dunnKnown(await snap(p)), false); assert.equal(await p.locator(OFFER).count(), 0);
        await p.locator(DUTY).click(); await p.waitForTimeout(300);
        let st = await snap(p); assert.equal(trust(st), 0); assert.ok(!st.simulation.knowledge.player['book.lotm.tie.dunn_signed']);
        r.checks.push('before meeting Dunn: no talk shown; a filing counts for the duty and earns no regard');
        // Follow Klein's own story tasks natively until he has met Dunn (the interview), as a player would.
        const nc = new NativeContinuation(s, {panel: 'lotm', attrPrefix: 'lotm', stepLimit: 4000});
        const here = async () => {await panel(p, 'lotm'); await p.locator('[data-workroom-tabs] button').filter({hasText: /^Here$/}).first().click(); await p.waitForTimeout(200);};
        await here();
        let acts = 0;
        while(!dunnKnown(await snap(p)) && acts < 300) {
            const v = await nc.view(); if(!v.arc?.next) {await s.step(60); acts++; continue;}
            await here();
            const b = p.locator(`[data-lotm="${v.arc.next.id}"]`).first();
            if(await b.count() && !(await b.isDisabled())) {await b.click(); await p.waitForTimeout(150); await nc.settle();}
            else await s.step(60);
            acts++;
            if(acts % 10 === 0) console.error(`lotm: ${acts} story tasks`);
        }
        r.storyTasksToMeetDunn = acts; assert.ok(dunnKnown(await snap(p)), 'Klein met Dunn by his own story route');
        } else {assert.ok(dunnKnown(await snap(p)), 'fixture: Klein has met Dunn'); r.checks.push('fixture loaded: Klein met Dunn by his own story route (83 tasks, day 3)');
            // W1d: the flat's Home block on the Here tab (household read side).
            await panel(p, 'lotm'); await p.locator('[data-workroom-tabs] button').filter({hasText: /^Here$/}).first().click(); await p.waitForTimeout(200);
            const home = await p.locator('[data-lotm-home]').innerText(); assert.match(home, /rent/i); r.homeLines = home.split('\n').length;
            r.homeNamesFamily = /Benson|Melissa/.test(home); r.checks.push('Home block shown on the Here tab with the rent line');}
        let st;
        if(!seed) await writeFile(join(out, 'klein-met-dunn.save.json'), JSON.stringify(await s.save())); // scratch only: carries cast text
        await open();
        assert.equal(await p.locator(OFFER).isDisabled(), true);
        assert.match(await p.locator('[data-tie-offer]').innerText(), /once he has signed two/); r.checks.push('after meeting Dunn by the story route: the talk is shown shut with its reason');
        // First regard-earning filing: the next duty week after the meeting.
        for(let q = 0; q < 28; q++) {await s.step(360); await p.waitForTimeout(50);} // six hours per call: a day per call crashed the page past day 3
        await open(); await p.locator(DUTY).click(); await p.waitForTimeout(300);
        st = await snap(p); assert.equal(trust(st), 1); assert.ok(st.simulation.knowledge.player['book.lotm.tie.dunn_signed']);
        assert.equal(await p.locator(OFFER).isDisabled(), true); r.checks.push('first filing after meeting: trust 1, observation held, talk still shut');
        // A week of native time, a day per call (one 10,080-minute call exhausted the headless page).
        for(let q = 0; q < 28; q++) {await s.step(360); await p.waitForTimeout(50);} // six hours per call: a day per call crashed the page past day 3
        await open();
        await p.locator(DUTY).click(); await p.waitForTimeout(300);
        st = await snap(p); assert.equal(trust(st), 2); r.checks.push('next week filed after seven native days: trust 2');
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
        const home = async () => p.locator('[data-hp-home]').innerText();
        assert.match(await home(), /You are at home/); assert.match(await home(), /Your uncle, your aunt and your cousin live here with you/);
        r.checks.push('W2c: the Home block shows the guardians\u2019 house through the shared world home port (at home, three residents)');
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
        assert.match(await home(), /away from the house/); r.checks.push('W2c: at school the Home block says Harry is away from the house');
        // The first Charms lesson opens on a term Monday 09:00; wait by the hour until its button is live.
        const charms = p.locator('[data-hp-lesson]').filter({hasText: 'first Charms'});
        let waited = 0; while(await charms.isDisabled() && waited < 9 * 24) {await s.step(60); await nc.panel(); waited++;}
        r.hoursWaitedForCharms = waited;
        await charms.click(); await s.step(35); await nc.panel();
        st = await snap(p); assert.equal(aff(st), 2); r.checks.push('first Charms by its button: Ron affection 2');
        // W1b: cast the learned charm on the shared spell lowering; stamina is spent either way, and each try leaves a result.
        const CAST = `[data-hp-cast="${P}.sp.use.levitation_charm"]`, results = [];
        for(let i = 0; i < 3; i++) {
            assert.equal(await p.locator(CAST).isDisabled(), false, 'the charm can be cast after the lesson');
            await p.locator(CAST).click(); await s.step(10); await nc.panel();
            results.push((await snap(p)).simulation.knowledge.player[`${P}.spell.levitation.last`]?.value || '');
        }
        assert.ok(results.every(Boolean)); r.castResults = results.map(t => /rose/.test(t) ? 'rose' : /shivered/.test(t) ? 'fizzled' : 'other');
        r.checks.push(`levitation cast three times by its button: ${r.castResults.join(', ')}`);
        // Research: library study on the shared inquiry engine, by its own buttons; reading alone cannot finish without class evidence.
        const STUDY = '[data-hp-study="study.hp.charms"]', studyLine = async () => p.locator(STUDY).locator('xpath=..').innerText();
        const before = await studyLine(); let sessions = 0;
        while(sessions < 4 && !(await p.locator('[data-hp-study-note="study.hp.charms"]').count())) {
            if(await p.locator(STUDY).isDisabled()) break;
            await p.locator(STUDY).click(); await s.step(60); await nc.panel(); sessions++;
        }
        r.studySessions = sessions; r.studyBefore = before.split('\n').at(-1); r.studyAfter = (await studyLine()).split('\n').at(-1);
        assert.ok(sessions >= 1 && r.studyAfter !== r.studyBefore, 'a study session changes the shown progress');
        if(await p.locator('[data-hp-study-note="study.hp.charms"]').count()) {
            await p.locator('[data-hp-study-note="study.hp.charms"]').click(); await nc.panel();
            assert.equal((await snap(p)).simulation.knowledge.player['study.hp.charms.writeup']?.stage, 'understood');
            r.studyDone = true; r.checks.push(`library study by its button: ${sessions} sessions finish the charms topic, written up as a note`);
        } else r.checks.push(`library study by its button: ${sessions} sessions move the charms topic (${r.studyAfter})`);
        assert.equal(await p.locator(TALK).isDisabled(), false);
        await p.locator(TALK).click(); await s.step(35); await nc.panel();
        st = await snap(p); const note = st.simulation.knowledge.player[P + '.tie.ron_family'];
        assert.equal(note?.basis?.attributedTo, RON); r.checks.push('talk taken: one note attributed to Ron');
        // W1a: the next Monday Potions class issues the ingredients; the bench brews on the shared craft engine; the flask is handed in.
        const potions = p.locator('[data-hp-lesson]').filter({hasText: 'Potions'});
        waited = 0; while(await potions.isDisabled() && waited < 9 * 24) {await s.step(60); await nc.panel(); waited++;}
        await potions.click(); await s.step(50); await nc.panel();
        const MAKE = `[data-hp-make="${P}.make.cure_boils"]`, EARLY = `[data-hp-make="${P}.make.cure_boils_quills_early"]`;
        assert.equal(await p.locator(MAKE).isDisabled(), false); assert.equal(await p.locator(EARLY).isDisabled(), false);
        r.checks.push('Potions class issues the ingredients: both bench brews open (by the steps, quills early)');
        await p.locator(MAKE).click(); await s.step(45); await nc.panel();
        const USE = `[data-hp-make="${P}.make.cure_boils.use"]`;
        assert.equal(await p.locator(USE).isDisabled(), false); await p.locator(USE).click(); await s.step(10); await nc.panel();
        st = await snap(p); assert.equal(st.actors.player.facts['hp.lead.potions.flask'], 'cure');
        assert.equal(await p.locator(EARLY).isDisabled(), true, 'one set of ingredients brews once');
        r.checks.push('brewed by the steps and handed in: the flask fact is cure; the early brew is shut (ingredients spent)');
        // Research, finished: class evidence comes from Charms classes (casting outside class does not refine the power), so attend
        // the next Mondays' Charms practice by its button, then study until the topic can be written up.
        const NOTE = '[data-hp-study-note="study.hp.charms"]', practice = p.locator('[data-hp-lesson]').filter({hasText: 'Charms'});
        for(let week = 0; week < 3 && !(await p.locator(NOTE).count()); week++) {
            let h = 0; while(await practice.isDisabled() && h < 8 * 24) {await s.step(60); await nc.panel(); h++;}
            await practice.click(); await s.step(35); await nc.panel();
            for(let k = 0; k < 2 && !(await p.locator(NOTE).count()) && !(await p.locator(STUDY).isDisabled()); k++) {await p.locator(STUDY).click(); await s.step(60); await nc.panel(); sessions++;}
        }
        if(!r.studyDone && await p.locator(NOTE).count()) {
            await p.locator(NOTE).click(); await nc.panel();
            assert.equal((await snap(p)).simulation.knowledge.player['study.hp.charms.writeup']?.stage, 'understood');
            r.studyDone = true; r.studySessions = sessions; r.checks.push(`library study finished after more Charms classes by their buttons: ${sessions} sessions, written up as a note`);
            r.charmsLine = await p.evaluate(() => document.querySelector('[data-hp-lessons]')?.innerText.match(/Levitation[^\n]*|[^\n]*feather[^\n]*/)?.[0] || null);
        }
        r.potionsBrewChance = await p.evaluate(() => document.querySelector('[data-hp-lessons]')?.innerText.match(/Potions[^\n]*/)?.[0] || null);
        await panel(p, 'beginning'); await p.waitForTimeout(300);
        r.peopleViewShowsRonLines = await p.evaluate(() => document.body.innerText.includes('five older brothers') && document.body.innerText.includes('moved up the bench'));
        const reopen = async () => {await panel(p, 'hp'); await p.waitForTimeout(250);};
        const {afterReload, afterImport} = await roundTrip(s, reopen);
        for(const x of [afterReload, afterImport]) {assert.equal(aff(x), 2); assert.ok(x.simulation.knowledge.player[P + '.tie.ron_family']); assert.equal(x.actors.player.facts['hp.lead.potions.flask'], 'cure');}
        r.checks.push('save, reload, Export and Import keep affection 2, the note and the handed-in flask');
        await reopen(); assert.match(await home(), /away from the house/); r.checks.push('W2c: the Home block reads the same after Import');
        if(r.studyDone) {for(const x of [afterReload, afterImport]) assert.equal(x.simulation.knowledge.player['study.hp.charms.writeup']?.stage, 'understood'); r.checks.push('the study write-up survives reload and Import');}
        r.errors = s.errors.length; assert.equal(s.errors.length, 0, JSON.stringify(s.errors.slice(0, 3)));
        r.ok = true;
    } catch(e) {r.ok = false; r.error = String(e.stack || e).slice(0, 1500); r.errors = s.errors.slice(0, 5); await p.screenshot({path: join(out, 'hp-fail.png')}).catch(() => {});}
    finally {await s.close();}
    return r;
}


// W2b: from the native Seer fixture (scripts/playtest/klein-to-seer.mjs), Klein opens his Spirit Vision by its button on the shared spell
// lowering: spirituality is spent, the vision opens, the button shuts while it is open, and Save, reload, Export and Import keep it.
async function walkLotmSeer() {
    const seed = JSON.parse(await readFile(process.env.KLEIN_SEER, 'utf8'));
    const s = new Session({url: server.url, seed: 7, wall: Date.UTC(2026, 10, 7), opTimeout: 20000}), r = {checks: [], fixture: 'klein-seer (scripts/playtest/klein-to-seer.mjs, native)'};
    await s.start(); await s.open(seed); const p = s.page, ID = 'book.lotm.be.sp.use.spirit_vision', BTN = `[data-lotm="${ID}"]`, POOL = 'book.lotm.be_spirituality';
    const here = async () => {await panel(p, 'lotm'); await p.locator('[data-workroom-tabs] button').filter({hasText: /^Here$/}).first().click(); await p.waitForTimeout(250);};
    const reserve = st => st.simulation.energies?.player?.[POOL]?.reserve;
    const dev = st => st.simulation.faculties?.player?.['book.lotm.be_seer']?.development ?? 0;
    try {
        await here();
        assert.equal(await p.locator(BTN).isDisabled(), false, 'the Spirit Vision power is offered after the potion');
        const st0 = await snap(p), before = reserve(st0), devBefore = dev(st0);
        await p.locator(BTN).click(); await p.waitForTimeout(300);
        for(let k = 0; k < 20 && (await p.evaluate(() => simulationTestHooks.project('lotm').jobs.length)); k++) await s.step(10);
        await here();
        const st = await snap(p), after = reserve(st);
        assert.ok(after < before, `spirituality spent (${before} -> ${after})`);
        r.checks.push(`Open your Spirit Vision by its button: spirituality ${before} -> ${after}`);
        assert.equal(dev(st), devBefore + 1); r.checks.push(`practice: the opening develops the Seer faculty ${devBefore} -> ${dev(st)}`);
        assert.equal(await p.locator(BTN).isDisabled(), true); r.shutReason = (await p.locator('[data-lotm-powers]').innerText()).length > 0;
        r.checks.push('while the vision is open the power is shown shut');
        const {afterReload, afterImport} = await roundTrip(s, here);
        for(const x of [afterReload, afterImport]) {assert.equal(reserve(x), after); assert.equal(dev(x), devBefore + 1);}
        r.checks.push('save, reload, Export and Import keep the spent spirituality');
        r.errors = s.errors.length; assert.equal(s.errors.length, 0, JSON.stringify(s.errors.slice(0, 3))); r.ok = true;
    } catch(e) {r.ok = false; r.error = String(e.stack || e).slice(0, 1200); r.errors = s.errors.slice(0, 5); await p.screenshot({path: join(out, 'seer-fail.png')}).catch(() => {});}
    finally {await s.close();}
    return r;
}

// W3a-S3: Klein takes up the flat in the shared home engine, buys a crate at the street market and fits it, by the Here tab's buttons.
async function walkLotmHome() {
    const seed = JSON.parse(await readFile(process.env.KLEIN_HOME_SAVE, 'utf8'));
    const s = new Session({url: server.url, seed: 7, wall: Date.UTC(2026, 10, 7), opTimeout: 20000}), r = {checks: [], fixture: process.env.KLEIN_HOME_SAVE.split('/').pop()};
    await s.start(); await s.open(seed); const p = s.page;
    const FLAT = 'lotm.place.cast-266d12fc010442f95bac', MARKET = 'lotm.place.cast-67769506e76820d498cc', HOME = 'book.lotm.tingen.home.moretti_flat', CRATE = 'book.lotm.tingen.home.tea_crate';
    const here = async () => {await panel(p, 'lotm'); await p.locator('[data-workroom-tabs] button').filter({hasText: /^Here$/}).first().click(); await p.waitForTimeout(250);};
    const view = () => p.evaluate(() => window.simulationTestHooks.project('lotm'));
    const flat = async () => (await p.evaluate(() => window.simulationTestHooks.snapshot().homes))?.properties?.['book.lotm.tingen.home.moretti_flat'];
    const money = () => p.evaluate(() => window.simulationTestHooks.snapshot().gameplay?.player?.money ?? window.simulationTestHooks.snapshot().money ?? null);
    const goto = async place => {
        for(let hop = 0; hop < 6; hop++) {
            const v = await view(); if(v.at?.id === place || v.home && (await p.evaluate(() => window.simulationTestHooks.snapshot().expansion.simulation.people.player.location)) === place) return;
            const mv = v.moves.find(m => m.to === place && m.eligible);
            assert.ok(mv, `a walk to ${place} from here (${v.moves.filter(m => m.eligible).map(m => m.to).slice(0, 8).join(', ')})`);
            await here(); const b = p.locator(`[data-lotm="${mv.id}"]`).first();
            if(!(await b.isVisible())) await p.locator('[data-lotm-more-walks] summary').click().catch(() => {});
            await b.click(); await p.waitForTimeout(150);
            for(let k = 0; k < 40 && (await view()).jobs.length; k++) await s.step(10);
        }
        assert.fail(`reached ${place}`);
    };
    const act = async id => {await here(); const b = p.locator(`[data-lotm-home-act="${id}"]`); assert.equal(await b.isDisabled(), false, `${id} is offered: ${JSON.stringify((await view()).home?.actions)} homes=${JSON.stringify(await p.evaluate(() => {const h = window.simulationTestHooks.project('homes'); return {visible: h?.visible, ready: h?.ready, alive: h?.context?.alive, cready: h?.context?.ready, writable: h?.context?.writable, worldReady: h?.context?.worldReady, keys: Object.keys(h?.context || {}).join(',')};}))} body=${JSON.stringify(await p.evaluate(() => window.simulationTestHooks.snapshot().expansion.simulation.people.player.body))}`); await b.click(); await p.waitForTimeout(250); r.lastNotice = (await p.locator('#lotm_panel').innerText()).split('\n').filter(l => /Home:|home|cannot|need|first/i.test(l)).slice(0, 6); await here();};
    const homeText = async () => p.locator('[data-lotm-home]').innerText();
    try {
        await here(); await goto(FLAT); await here();
        await act('settle');
        assert.match(await homeText(), /Fitted: Narrow iron bed \(the landlord’s\)/); assert.equal((await flat())?.tenure, 'rented');
        r.checks.push('at the flat: "Make the flat your home" takes it up in the shared home engine, rented, with the landlord’s bed fitted');
        await goto(MARKET); await here();
        const buy = p.locator(`[data-lotm-home-act="buy:${CRATE}"]`);
        assert.equal(await buy.count(), 1, 'the crate is offered at the market');
        if(await buy.isDisabled()) {
            r.buyShutReason = (await view()).home.actions.find(a => a.id === `buy:${CRATE}`)?.reason;
            assert.match(r.buyShutReason, /coins/); r.checks.push(`at the Lettuce and Meat market: the crate is offered and shut with the engine’s reason, read from Klein’s own purse (${r.buyShutReason})`);
        } else {
            await act(`buy:${CRATE}`); await goto(FLAT); await act(`install:${CRATE}`);
            assert.match(await homeText(), /Lidded tea crate/); assert.equal((await flat()).fixtures.box?.owner, 'player');
            r.checks.push('bought the crate at the market and fitted it at the flat'); r.bought = true;
        }
        await goto(FLAT);
        const {afterReload, afterImport} = await roundTrip(s, here);
        for(const x of [afterReload, afterImport]) assert.ok(x);
        assert.equal((await flat())?.fixtures.bed?.owner, 'book.lotm.tingen.landlord'); assert.match(await homeText(), /Narrow iron bed/);
        if(r.bought) {assert.equal((await flat()).fixtures.box?.owner, 'player'); assert.match(await homeText(), /Lidded tea crate/);}
        r.checks.push(`save, reload, Export and Import keep the flat in the home engine with the landlord’s bed${r.bought ? ' and the fitted crate' : ''}`);
        r.errors = s.errors.length; assert.equal(s.errors.length, 0, JSON.stringify(s.errors.slice(0, 3))); r.ok = true;
    } catch(e) {r.ok = false; r.error = String(e.stack || e).slice(0, 1500); r.errors = s.errors.slice(0, 5); await p.screenshot({path: join(out, 'home-fail.png')}).catch(() => {});}
    finally {await s.close();}
    return r;
}

try {
    if(which === 'home') receipt.runs.home = await walkLotmHome();
    else if(which === 'seer') receipt.runs.seer = await walkLotmSeer();
    else if(which !== 'hp') receipt.runs.lotm = await walkLotm();
    if(!['lotm', 'seer', 'home'].includes(which)) receipt.runs.hp = await walkHp();
} finally {server.close(); await bundle.dispose();}
await writeFile(join(out, 'receipt.json'), JSON.stringify(receipt, null, 1));
console.log(JSON.stringify(receipt, null, 1));
process.exit(Object.values(receipt.runs).every(r => r.ok) ? 0 : 1);
