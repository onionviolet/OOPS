// G4 full-app journey: brass lung (implant) via 'Optional lives and local experiments'. Run from the worktree root.
import {startJourney, meetElder, assert, key} from './common.mjs';
const ctx = await startJourney('g4');
const {receipt, session} = ctx;
const act = async (page, id) => {
    const panel = page.locator('#backlog_expansion_panel');
    const btn = panel.locator(`[data-backlog-action="${id}"]`);
    await btn.scrollIntoViewIfNeeded();
    const state = await btn.evaluate(b => ({disabled: b.disabled, why: b.closest('.expedition_card').innerText}));
    if(state.disabled) throw new Error(`action ${id} disabled: ${state.why}`);
    await btn.click(); await ctx.page.waitForTimeout(300);
};
const openBacklog = async () => {
    const page = ctx.page, panel = page.locator('#backlog_expansion_panel');
    await ctx.openPanelById('notebook'); await ctx.refresh(1);
    await panel.waitFor({state: 'visible'});
    if(!(await panel.evaluate(e => e.open))) await panel.locator('> summary').click();
    const dev = panel.locator('details', {has: page.locator('summary', {hasText: /^device$/})}).first();
    if(!(await dev.evaluate(e => e.open))) await dev.locator('> summary').click();
    await panel.scrollIntoViewIfNeeded(); return panel;
};
let failed = null;
try {
    const seed = structuredClone(ctx.base);
    seed.character.money = 5000;
    seed.inventories.person.main_character[key('Rough wood log')] = {count: 8};
    // Soundblank for press not needed here. Install/remove path only.
    for(const [w, h] of [[1920, 1080], [1536, 864]]) {
        const tag = `${w}x${h}`; receipt.viewports.push(tag);
        await session.open(seed); ctx.page = session.page; const page = ctx.page;
        await page.setViewportSize({width: w, height: h}); await page.waitForTimeout(400);
        await meetElder(ctx);
        const panel = await openBacklog();
        await ctx.shot(`g4-01-panel-open-${tag}.png`, panel);
        await act(page, 'backlog.body.meet_brasswright'); await ctx.refresh(1);
        await act(page, 'backlog.body.buy_brass_lung'); await ctx.refresh(1);
        await ctx.shot(`g4-02-lung-bought-${tag}.png`, panel);
        let rec = await panel.innerText(); assert.match(rec, /BL-01: loose with you/);
        receipt.checks.push(`PASS ${tag} G4 BL-01 bought (records: loose with you)`);
        await ctx.roundTrip(`${tag} G4 bought`);
        await openBacklog();
        await act(ctx.page, 'backlog.body.install_brass_lung'); await ctx.refresh(1);
        rec = await panel.innerText();
        assert.match(rec, /BL-01: installed in your human body/);
        assert.match(rec, /Implant backlog\.brass_lung\.bl01 in your intake: supports backlog\.installed_brass_lung/);
        const saved = await session.save();
        const src = saved.expansion.actors.player.sources['backlog.installed_brass_lung'];
        assert.deepEqual(Object.keys(src.suppliers), ['implant:backlog.brass_lung.bl01']);
        await panel.scrollIntoViewIfNeeded(); await ctx.shot(`g4-03-implant-installed-${tag}.png`, panel);
        receipt.checks.push(`PASS ${tag} G4 implant installed; suppliers=${JSON.stringify(Object.keys(src.suppliers))}`);
        await ctx.roundTrip(`${tag} G4 installed`);
        await openBacklog();
        await act(ctx.page, 'backlog.body.remove_brass_lung'); await ctx.refresh(1);
        rec = await panel.innerText(); assert.match(rec, /BL-01: loose with you/); assert.doesNotMatch(rec, /Implant backlog\.brass_lung/);
        const after = await session.save();
        assert.equal(after.expansion.actors.player.sources['backlog.installed_brass_lung'], undefined);
        await panel.scrollIntoViewIfNeeded(); await ctx.shot(`g4-04-implant-removed-${tag}.png`, panel);
        receipt.checks.push(`PASS ${tag} G4 implant removed; source gone, specimen back in bag`);
        await ctx.roundTrip(`${tag} G4 removed`);
    }
} catch (e) { failed = e; ctx.receipt.failure = e.stack; await ctx.page?.screenshot({path: ctx.evidence + '/g4-failure.png'}).catch(() => {}); }
await ctx.finish(failed ? 'failed' : 'passed');
if(failed) process.exitCode = 1;
