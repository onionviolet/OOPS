// Combined Qud-lane journey on the integration candidate (G2, G3, G5, G7, plus G1 shelf and G6 panel).
// Headless Chrome only, fresh origin, generated saves only. Run from the candidate root after `npm run build`:
//   node docs/research/qud-systems-audit-2026-10-15/integration-evidence/combined-journey.mjs <evidence-dir>
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session} from '../../../../scripts/playtest/lib.mjs';
import {serve} from '../../../../scripts/perf/lib.mjs';
import {canonicalSave, diffSaves} from '../../../../scripts/headless/runner.mjs';
import {createChronicle} from '../../../../src/chronicle.js';
import {ensureWorldHistory} from '../../../../src/world_history_consumers.js';
import {spineFixture} from '../../../../tests/helpers/story_spine.js';

const root = resolve('.'), evidence = resolve(process.argv[2] || 'integration-evidence/combined');
await mkdir(evidence, {recursive: true});
const server = await serve(root), session = new Session({url: server.url + '?test_hooks=1', seed: 11, wall: Date.UTC(2026, 9, 23), opTimeout: 15000});
const receipt = {viewports: [], checks: []};
const key = id => JSON.stringify({id});
let page;
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
    receipt.checks.push(label + ': Save/reload/Export/literal Import exact');
}
const openPanelById = async id => {
    await page.locator('select', {has: page.locator(`option[value=${id}]`)}).first().selectOption(id);
};
const shot = async (name, locator) => {
    const file = join(evidence, name);
    if(locator) await locator.screenshot({path: file}); else await page.screenshot({path: file});
    receipt.checks.push('screenshot ' + name);
};

try {
    await session.start(); await session.open();
    const base = structuredClone(await session.save());
    // Seed: the story-spine fixture's history owner and generated people, then a chronicle with a derived world history.
    const fx = spineFixture(43).envelope;
    const seed = structuredClone(base);
    const t = seed['current time'];
    seed.expansion.chronicle = createChronicle(seed.expansion.clock, {year: t.year, month: t.month, day: t.day, hour: t.hour, minute: t.minute, day_count: t.day_count}, false);
    assert.ok(ensureWorldHistory(seed.expansion), 'world history derived');
    seed.character.reputation.Village = 60; seed.character.money = 5000;
    const bag = seed.inventories.person.main_character;
    for (const [id, n] of [['Emberseed', 3], ['Spring water', 1], ['Oil lamp', 1]]) bag[key(id)] = {count: n};
    seed.lamplight = {schema: 1, lit: true, oil: 200, noticed: {}};

    const g3seed = structuredClone(base); g3seed.expansion = fx.expansion; g3seed.generated_people = fx.generated_people;
    for (const [w, h] of [[1920, 1080], [1536, 864]]) {
        await session.open(seed); page = session.page;
        await page.setViewportSize({width: w, height: h}); receipt.viewports.push(`${w}x${h}`); await page.waitForTimeout(500);
        const tag = `${w}x${h}`;

        // A player's first talk with the elder introduces the journal routes.
        await page.getByRole('button', {name: 'Talk to someone'}).click();
        await page.locator('[data-dialogue="villageElder"]').click();
        await page.locator('[data-textline="hello"]').click();
        await page.getByRole('button', {name: '← Village'}).click();
        await page.waitForTimeout(800);
        // G2: rank and feeling text under Reputation (Data tab).
        await page.locator('[data-route-id="records:data"]').click();
        await page.locator('#journal_show_data').click();
        await page.locator('#data_tab_reputation_div').waitFor({state: 'visible'});
        const repText = await page.locator('#data_tab_reputation_div').innerText();
        assert.match(repText, /Neighbour \(60\)/); assert.match(repText, /counted among the people who live here/);
        await shot(`g2-reputation-rank-${tag}.png`, page.locator('#data_tab_reputation_div'));
        receipt.checks.push(`${tag} G2: reputation shows "Neighbour (60)" with its feeling line`);

        // G1: the Village experiments panel offers the reference shelf.
        await openPanelById('herbal-experiments');
        await page.locator('#crafting_engine_home').waitFor({state: 'visible'});
        const take1 = page.locator('[data-shelf-take]').first();
        await take1.click(); await page.waitForTimeout(200);
        await shot(`g1-reference-shelf-${tag}.png`, page.locator('#crafting_engine_home'));
        receipt.checks.push(`${tag} G1: reference shelf visible; one reference taken into the inventory`);

        // G6: naming panel.
        await openPanelById('naming');
        await page.locator('#naming_panel, [id*=naming]').first().scrollIntoViewIfNeeded();
        await shot(`g6-naming-panel-${tag}.png`);

        // G7: spill and fire from the panel.
        await openPanelById('fields');
        const panel = page.locator('#fields_panel');
        await panel.waitFor({state: 'visible'}); await panel.scrollIntoViewIfNeeded();
        await panel.locator('[data-field-pour]').click(); await panel.locator('[data-field-pour]').click();
        await panel.locator('[data-field-light]').click();
        await session.step(3);
        await shot(`g7-fields-burning-${tag}.png`, panel);
        receipt.checks.push(`${tag} G7: two packs spilled, lit, 3 minutes stepped`);

        await roundTrip(`${tag} combined state`);
        // G3: a named-keepsake request from the Travelers panel (fixture generated people and history owner).
        await session.open(g3seed); page = session.page;
        await page.setViewportSize({width: w, height: h}); await page.waitForTimeout(500);
        try {
            await openPanelById('village-travelers');
            const raise = page.locator('[data-story-request="raise_unique"]:visible').first();
            await raise.waitFor({state: 'visible', timeout: 6000});
            await raise.click(); await page.waitForTimeout(300);
            const take = page.locator('[data-story-request="take"]:visible').first();
            await take.waitFor({state: 'visible', timeout: 6000});
            await shot(`g3-unique-request-${tag}.png`, take.locator('xpath=ancestor::*[self::div or self::section or self::li][1]'));
            await take.click(); await page.waitForTimeout(300);
            const reqs = (await session.save()).generated_people.storyRequests.requests;
            assert.ok(reqs.some(r => r.kind === 'unique' && r.status === 'accepted'));
            receipt.checks.push(`${tag} G3: named keepsake offered and taken; saved as kind=unique status=accepted`);
            await roundTrip(`${tag} G3 request`);
        } catch(e) { receipt.checks.push(`${tag} G3 full-app attempt failed: ${String(e.message).split('\n')[0]}`); }
    }
    assert.deepEqual(session.errors.filter(e => !(e.kind === 'console' && /404 \(Not Found\)/.test(e.text))), []);
    receipt.status = 'passed';
} catch (error) {
    await page?.screenshot({path: join(evidence, 'failure.png')}).catch(() => {});
    receipt.status = 'failed'; receipt.failure = error.stack; receipt.errors = session.errors.slice(0, 10);
    throw error;
} finally {
    await writeFile(join(evidence, 'combined-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    await session.close(); await server.close();
}
process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
