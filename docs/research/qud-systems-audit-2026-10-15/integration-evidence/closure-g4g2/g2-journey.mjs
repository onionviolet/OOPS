// G2 full-app journey: Data-tab rank/feeling text and the standing-priced lesson row in 'Methods & practice'. Run from the worktree root.
// Route that opens the lesson row (the previous attempt could not): the notebook is hidden until the save is "familiar"
// (chronicle/simulation/known people), its panels render only after a sim step, and skills_panel needs a discovered offer
// (campaign anchor + met craftsman present + enrollment) and then the inquiry observation to have run.
import {startJourney, meetElder, assert, key} from './common.mjs';
const ctx = await startJourney('g2');
const {receipt, session} = ctx;
const seedFor = rep => {
    const s = structuredClone(ctx.base); s.character.money = 5000; s.character.reputation.Village = rep;
    s.expansion.campaign.facts.anchor = true;                                 // inspected crossing (campaign fact the lesson offers read)
    s.availabilities.dialogue.oldCraftsman = 1; s.availabilities.textline['oldCraftsman:hello'] = 5; // craftsman met
    s.inventories.person.main_character[key('Rough wood log')] = {count: 8};
    return s;
};
const openSkills = async () => {
    const page = ctx.page, sk = page.locator('#skills_panel');
    await ctx.openPanelById('notebook'); await ctx.refresh(1);
    await page.locator('[data-notebook-view="practice"]').click();
    await sk.waitFor({state: 'visible'});
    if(!(await sk.evaluate(e => e.open))) await sk.locator('> summary').click();
    await sk.scrollIntoViewIfNeeded(); return sk;
};
let failed = null;
try {
    for(const [w, h] of [[1920, 1080], [1536, 864]]) {
        const tag = `${w}x${h}`; receipt.viewports.push(tag);
        // Part 1: Neighbour (60): rank text, discounted row.
        await session.open(seedFor(60)); ctx.page = session.page; const page = ctx.page;
        await page.setViewportSize({width: w, height: h}); await page.waitForTimeout(400);
        await meetElder(ctx);
        await page.locator('[data-route-id="records:data"]').click();
        await page.locator('#journal_show_data').click();
        await page.locator('#data_tab_reputation_div').waitFor({state: 'visible'});
        const repText = await page.locator('#data_tab_reputation_div').innerText();
        assert.match(repText, /Neighbour \(60\)/); assert.match(repText, /counted among the people who live here/);
        await ctx.shot(`g2-01-reputation-rank-${tag}.png`, page.locator('#data_tab_reputation_div'));
        receipt.checks.push(`PASS ${tag} G2 Data tab: "Neighbour (60)" and its feeling line`);
        let sk = await openSkills();
        await sk.getByRole('button', {name: 'Follow local people and work'}).click(); await ctx.refresh(1);
        const observe = sk.getByRole('button', {name: /Ask how field evidence/});
        await observe.click(); await ctx.refresh(3);
        sk = await openSkills();
        const row = sk.getByRole('button', {name: /Learn Shared inquiry at a neighbour's price/});
        await row.waitFor({state: 'visible'});
        const text = await sk.innerText();
        assert.match(text, /Costs: 1 wooden coin/); assert.equal(await sk.getByRole('button', {name: /^Learn Shared inquiry · 3 min$/}).count(), 0, 'full-price row hidden at rank');
        await ctx.shot(`g2-02-discounted-lesson-row-${tag}.png`, sk);
        receipt.checks.push(`PASS ${tag} G2 lesson row "at a neighbour's price" visible, Costs 1 wooden coin, full-price row absent`);
        await ctx.roundTrip(`${tag} G2 discounted row state`);
        sk = await openSkills();
        const before = (await session.save()).character.money;
        await sk.getByRole('button', {name: /Learn Shared inquiry at a neighbour's price/}).click(); await ctx.refresh(4);
        const afterSave = await session.save();
        assert.equal(before - afterSave.character.money, 1, 'discounted fee charged (1 coin)');
        sk = await openSkills(); await ctx.shot(`g2-03-lesson-learned-${tag}.png`, sk);
        receipt.checks.push(`PASS ${tag} G2 discounted lesson taken: money ${before} -> ${afterSave.character.money}`);
        await ctx.roundTrip(`${tag} G2 lesson learned`);
        // Part 2 (contrast): Stranger (0): full-price row, no discount row, rank text.
        await session.open(seedFor(0)); ctx.page = session.page;
        await ctx.page.setViewportSize({width: w, height: h}); await ctx.page.waitForTimeout(400);
        await meetElder(ctx);
        sk = await openSkills();
        await sk.getByRole('button', {name: 'Follow local people and work'}).click(); await ctx.refresh(1);
        await sk.getByRole('button', {name: /Ask how field evidence/}).click(); await ctx.refresh(3);
        sk = await openSkills();
        const full = sk.getByRole('button', {name: /^Learn Shared inquiry · 3 min$/});
        await full.waitFor({state: 'visible'});
        assert.equal(await sk.getByRole('button', {name: /neighbour's price/}).count(), 0);
        assert.match(await sk.innerText(), /Costs: 2 wooden coins/);
        await ctx.shot(`g2-04-full-price-contrast-${tag}.png`, sk);
        receipt.checks.push(`PASS ${tag} G2 contrast at reputation 0: full-price row (2 coins), no discount row`);
        await ctx.roundTrip(`${tag} G2 contrast`);
    }
} catch (e) { failed = e; receipt.failure = e.stack; await ctx.page?.screenshot({path: ctx.evidence + '/g2-failure.png'}).catch(() => {}); }
await ctx.finish(failed ? 'failed' : 'passed');
if(failed) process.exitCode = 1;
