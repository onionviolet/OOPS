// Shared harness for the G4/G2 closure journeys. Headless Chrome, fresh origin per journey, generated saves only.
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session} from '../../../../../scripts/playtest/lib.mjs';
import {serve} from '../../../../../scripts/perf/lib.mjs';
import {canonicalSave, diffSaves} from '../../../../../scripts/headless/runner.mjs';
import {createChronicle} from '../../../../../src/chronicle.js';
import {ensureWorldHistory} from '../../../../../src/world_history_consumers.js';
export {assert, join, resolve, canonicalSave, diffSaves};
export const key = id => JSON.stringify({id});
export async function startJourney(name) {
    const evidence = resolve('docs/research/qud-systems-audit-2026-10-15/integration-evidence/closure-g4g2');
    await mkdir(evidence, {recursive: true});
    const server = await serve(resolve('.')), session = new Session({url: server.url + '?test_hooks=1', seed: 11, wall: Date.UTC(2026, 9, 23), opTimeout: 15000});
    const receipt = {journey: name, origin: server.url, viewports: [], checks: []};
    await session.start(); await session.open();
    const base = structuredClone(await session.save());
    const t = base['current time'];
    base.expansion.chronicle = createChronicle(base.expansion.clock, {year: t.year, month: t.month, day: t.day, hour: t.hour, minute: t.minute, day_count: t.day_count}, false);
    ensureWorldHistory(base.expansion);
    const ctx = {evidence, server, session, receipt, base, page: null};
    ctx.playReload = async () => {
        await ctx.page.waitForFunction(() => typeof simulationTestHooks === 'object');
        await ctx.page.evaluate(() => simulationTestHooks.pause());
        await ctx.page.locator('#loading_screen_play_button').click();
        await ctx.page.waitForTimeout(450);
    };
    ctx.roundTrip = async label => {
        const {session, page} = ctx;
        const saved = await session.save();
        await page.reload(); await ctx.playReload();
        assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(saved)), [], label + ' reload');
        const literal = await page.evaluate(() => save_to_file());
        const exported = await session.save();
        await Promise.all([page.waitForEvent('load'), page.evaluate(encoded => load_progress(encoded), literal)]);
        await ctx.playReload();
        assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(exported)), [], label + ' import');
        receipt.checks.push('PASS ' + label + ': Save/reload/Export/literal Import exact');
        await page.waitForTimeout(200);
    };
    ctx.openPanelById = async id => ctx.page.locator('select', {has: ctx.page.locator(`option[value=${id}]`)}).first().selectOption(id);
    ctx.shot = async (name, locator) => {
        const file = join(evidence, name);
        if(locator) await locator.screenshot({path: file}); else await ctx.page.screenshot({path: file});
        receipt.checks.push('screenshot ' + name);
    };
    // The page is paused in tests; a sim step makes the panels re-render (otherwise the Village panels stay at their first-paint state).
    ctx.refresh = async (n = 1) => {await ctx.session.step(n); await ctx.page.waitForTimeout(250);};
    ctx.finish = async status => {
        receipt.status = status; receipt.errors = session.errors.filter(e => !(e.kind === 'console' && /404 \(Not Found\)/.test(e.text))).slice(0, 10);
        await writeFile(join(evidence, name + '-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
        await session.close(); await server.close();
        process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
    };
    return ctx;
}
export async function meetElder(ctx) {
    const {page} = ctx;
    await page.getByRole('button', {name: 'Talk to someone'}).click();
    await page.locator('[data-dialogue="villageElder"]').click();
    const hello = page.locator('[data-textline="hello"]');
    // At 1536x864 right after a viewport change the shell resize divider can sit over this line; use its own keyboard activation then.
    try { await hello.click({timeout: 3000}); } catch { ctx.receipt.checks.push('NOTE hello line covered by .shell-resize-handle; activated with keyboard (Enter)'); await hello.focus(); await page.keyboard.press('Enter'); }
    await page.getByRole('button', {name: '← Village'}).click();
    await ctx.refresh(2);
}
