// Full-app closure proof for G3 (named-keepsake request) and G5 (chronicle mural). Headless, generated saves only, fresh origin per journey.
//   node docs/research/qud-systems-audit-2026-10-15/integration-evidence/closure-g3g5/closure-g3g5.mjs
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session} from '../../../../../scripts/playtest/lib.mjs';
import {serve} from '../../../../../scripts/perf/lib.mjs';
import {canonicalSave, diffSaves} from '../../../../../scripts/headless/runner.mjs';
import {createChronicle} from '../../../../../src/chronicle.js';
import {ensureWorldHistory} from '../../../../../src/world_history_consumers.js';
import {spineFixture} from '../../../../../tests/helpers/story_spine.js';

const ONLY_G5 = process.argv.includes('--g5'); const root = resolve('.'), evidence = resolve('docs/research/qud-systems-audit-2026-10-15/integration-evidence/closure-g3g5');
await mkdir(evidence, {recursive: true});
const server = await serve(root);
const receipt = {viewports: [], steps: []};
const log = (ok, msg) => { receipt.steps.push({ok, msg}); console.log(ok ? 'PASS' : 'FAIL', msg); };
let session, page;
const playReload = async () => {
    await page.waitForFunction(() => typeof simulationTestHooks === 'object');
    await page.evaluate(() => simulationTestHooks.pause());
    await page.locator('#loading_screen_play_button').click();
    await page.waitForTimeout(450);
};
async function roundTrip(label) {
    const saved = await session.save();
    await page.reload(); await playReload();
    assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(saved)), []);
    const literal = await page.evaluate(() => save_to_file());
    const exported = await session.save();
    await Promise.all([page.waitForEvent('load'), page.evaluate(encoded => load_progress(encoded), literal)]);
    await playReload();
    assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(exported)), []);
    log(true, label + ': Save/reload/Export/literal Import canonical-equal');
}
const openPanelById = async id => { await page.locator('select', {has: page.locator(`option[value=${id}]`)}).first().selectOption(id); await page.waitForTimeout(400); await page.evaluate(id => { if(id === 'village-travelers') document.querySelectorAll('details').forEach(d => { if(/^Village travelers/.test(d.querySelector(':scope > summary')?.textContent || '')) d.open = true; }); }, id); await page.waitForTimeout(200); };
const shot = async (name, loc) => { const f = join(evidence, name); if(loc) await loc.screenshot({path: f}); else await page.screenshot({path: f}); log(true, 'screenshot ' + name); };
const newSession = async seed => { await session?.close().catch(() => {}); session = new Session({url: server.url + '?test_hooks=1', seed: 11, wall: Date.UTC(2026, 9, 23), opTimeout: 15000}); await session.start(); await session.open(seed); page = session.page; };
const reqRow = () => page.locator('[data-story-request-row]').first();
const click = async (sel) => { const b = page.locator(`${sel}:visible`).first(); await b.waitFor({state: 'visible', timeout: 6000}); assert.ok(!(await b.isDisabled()), sel + ' enabled'); await b.click(); await page.waitForTimeout(350); };
const rowText = async () => (await reqRow().innerText()).replace(/\s+/g, ' ');
const status = async () => (await page.locator('#village_travelers_panel, [data-story-request-row]').first().evaluate(e => e.closest('details,section,div')?.innerText.slice(0, 0))) ;

try {
    const probe = new Session({url: server.url + '?test_hooks=1', seed: 11, wall: Date.UTC(2026, 9, 23), opTimeout: 15000});
    await probe.start(); await probe.open(); const base = structuredClone(await probe.save()); await probe.close();
    const fx = spineFixture(43).envelope;
    const g3 = structuredClone(base); g3.expansion = fx.expansion; g3.generated_people = fx.generated_people; g3.character.money = 500;
    const reqs = async () => (await session.save()).generated_people.storyRequests.requests;
    const inv = async () => (await session.save()).inventories.person.main_character || {};

    for(const [w, h] of [[1920, 1080], [1536, 864]]) {
        const tag = `${w}x${h}`; receipt.viewports.push(tag);
        if(!ONLY_G5) {
        // ---- Journey A1: raise, accept, lose, reclaim, deliver
        await newSession(g3); await page.setViewportSize({width: w, height: h}); await page.waitForTimeout(500);
        await openPanelById('village-travelers');
        await click('[data-story-request="raise_unique"]');
        let r = (await reqs())[0]; assert.equal(r.kind, 'unique'); assert.equal(r.status, 'offered');
        await shot(`g3-A1-offered-${tag}.png`, page.locator('[data-story-request-row]').first());
        log(true, `${tag} A1 raise_unique -> kind=unique offered, "${await rowText()}"`);
        await click('[data-story-request="take"]');
        r = (await reqs())[0]; assert.equal(r.status, 'accepted'); assert.equal(r.unique.credit, null);
        log(true, `${tag} A1 take -> accepted`);
        await click('[data-story-request="lose"][data-cause="lost"]');
        r = (await reqs())[0]; assert.equal(r.unique.state, 'lost'); assert.equal(r.unique.cause, 'lost');
        assert.match(await rowText(), /lost/); await shot(`g3-A1-reported-lost-${tag}.png`, reqRow());
        log(true, `${tag} A1 Report lost -> state=lost`);
        await roundTrip(`${tag} A1 lost`);
        await openPanelById('village-travelers');
        const money0 = (await session.save()).character.money;
        await click('[data-story-request="reclaim"]');
        const s1 = await session.save(); r = s1.generated_people.storyRequests.requests[0];
        assert.equal(r.unique.state, 'extant'); assert.equal(r.unique.reclaims, 1);
        const cost = Math.max(1, Math.ceil(r.reward / 4)); assert.equal(s1.character.money, money0 - cost);
        assert.equal(s1.inventories.person.main_character[r.unique.key]?.count, 1);
        await shot(`g3-A1-reclaimed-${tag}.png`, reqRow());
        log(true, `${tag} A1 Reclaim cost ${cost} coins (${money0} -> ${s1.character.money}); keepsake in inventory`);
        await roundTrip(`${tag} A1 reclaimed`);
        await openPanelById('village-travelers');
        const m2 = (await session.save()).character.money;
        await click('[data-story-request="deliver"]');
        const s2 = await session.save(); r = s2.generated_people.storyRequests.requests[0];
        assert.equal(r.status, 'delivered'); assert.equal(s2.character.money, m2 + r.reward); assert.equal(s2.inventories.person.main_character?.[r.unique.key], undefined);
        await shot(`g3-A1-delivered-${tag}.png`, reqRow());
        log(true, `${tag} A1 Deliver -> delivered, +${r.reward} coins, keepsake removed, row: "${await rowText()}"`);
        await roundTrip(`${tag} A1 delivered`);

        // ---- Journey A2: early acquire (fresh origin): raise on one origin, inject keepsake, take on fresh origin
        await newSession(g3); await page.setViewportSize({width: w, height: h}); await page.waitForTimeout(500);
        await openPanelById('village-travelers'); await click('[data-story-request="raise_unique"]');
        const offered = structuredClone(await session.save()); const key = offered.generated_people.storyRequests.requests[0].unique.key;
        offered.inventories.person.main_character ||= {}; offered.inventories.person.main_character[key] = {count: 1};
        await newSession(offered); await page.setViewportSize({width: w, height: h}); await page.waitForTimeout(500);
        await openPanelById('village-travelers');
        await click('[data-story-request="take"]');
        r = (await reqs())[0]; assert.equal(r.status, 'accepted'); assert.equal(r.unique.credit, 'early');
        assert.match(await rowText(), /you already had it when you took the request/);
        assert.equal((await inv())[key].count, 1);
        await shot(`g3-A2-early-credit-${tag}.png`, reqRow());
        log(true, `${tag} A2 early acquire: credit=early, row says already had it; stack untouched`);
        await roundTrip(`${tag} A2 early`);
        await openPanelById('village-travelers');
        await click('[data-story-request="deliver"]');
        r = (await reqs())[0]; assert.equal(r.status, 'delivered');
        await shot(`g3-A2-early-delivered-${tag}.png`, reqRow());
        log(true, `${tag} A2 early then Deliver -> delivered`);
        await roundTrip(`${tag} A2 delivered`);

        }
        // ---- Journey B: G5 mural
        const b = structuredClone(base); const t = b['current time'];
        b.expansion.chronicle = createChronicle(b.expansion.clock, {year: t.year, month: t.month, day: t.day, hour: t.hour, minute: t.minute, day_count: t.day_count}, false);
        assert.ok(ensureWorldHistory(b.expansion), 'world history derived');
        await newSession(b); await page.setViewportSize({width: w, height: h}); await page.waitForTimeout(500);
        await page.getByRole('button', {name: 'Talk to someone'}).click();
        await page.locator('[data-dialogue="villageElder"]').click();
        // At 1536x864 a workspace role=separator overlaps the textline; dispatch the click on the element itself.
        await page.locator('[data-textline="hello"]').dispatchEvent('click');
        await page.getByRole('button', {name: '← Village'}).click();
        await page.waitForTimeout(800); await session.step(2); await page.waitForTimeout(500);
        await openPanelById('notebook');
        await page.locator('[data-notebook-view="people"]').click(); await page.waitForTimeout(500);
        await page.evaluate(() => { const c = document.getElementById('chronicle_panel'); if(c) c.open = true; }); await page.waitForTimeout(300);
        const mural = page.locator('#chronicle_panel button').filter({hasText: /Read the village mural/}).first();
        const vis = await mural.isVisible().catch(() => false), en = vis && await mural.isEnabled();
        log(vis && en, `${tag} B mural button reachable via More panels > notebook > People (visible=${vis}, enabled=${en})`);
        await shot(`g5-mural-button-real-ui-${tag}.png`);
        if(vis && en) {
            await mural.click(); await page.waitForTimeout(600);
            const after = (await session.save()).expansion.chronicle;
            const k = Object.keys(after.knowledge).filter(x => x.startsWith('mural.')); assert.equal(k.length, 1);
            const logLine = after.log.map(l => l.text).find(t => /wall shows/.test(t)); assert.ok(logLine);
            receipt['muralText_' + tag] = logLine;
            // Show the text: scroll the chronicle log/notes into view if the panel renders it, and screenshot the panel.
            const shown = await page.evaluate(t => { const els = [...document.querySelectorAll('#chronicle_panel *')].filter(e => e.children.length === 0 && e.textContent.includes(t.slice(0, 30))); els[0]?.scrollIntoView({block: 'center'}); return els.length; }, logLine);
            receipt['muralTextInPanel_' + tag] = shown;
            await shot(`g5-mural-read-real-ui-${tag}.png`, page.locator('#chronicle_panel'));
            log(true, `${tag} B mural clicked via real UI; knowledge ${k}; text in panel DOM nodes=${shown}: ${logLine}`);
            await roundTrip(`${tag} B mural`);
        }
    }
    const errs = session.errors.filter(e => !(e.kind === 'console' && /404 \(Not Found\)/.test(e.text)));
    receipt.pageErrors = errs; log(errs.length === 0, 'no page errors (last session)');
    receipt.status = receipt.steps.every(s => s.ok) ? 'passed' : 'failed';
} catch (error) {
    await page?.screenshot({path: join(evidence, 'failure.png')}).catch(() => {});
    receipt.status = 'failed'; receipt.failure = error.stack; log(false, String(error.message).split('\n')[0]);
} finally {
    await writeFile(join(evidence, 'closure-g3g5-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    await session?.close().catch(() => {}); await server.close();
}
