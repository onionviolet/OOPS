// G4 construct/second-supplier journey (brass-lung copy). Three scenarios, each on its own fresh origin, at both viewports.
import {startJourney, meetElder, assert, key} from './common.mjs';
const LOG = key('Rough wood log'), SRC = 'backlog.installed_brass_lung';
const summary = [];
for(const scenario of ['remove-refused-then-dismiss', 'dismiss-early', 'expire-with-lung']) {
  const ctx = await startJourney('g4b-' + scenario); const {receipt, session} = ctx; let failed = null;
  const openBacklog = async () => {
    const page = ctx.page, panel = page.locator('#backlog_expansion_panel');
    await ctx.openPanelById('notebook'); await ctx.refresh(1);
    await panel.waitFor({state: 'visible'});
    if(!(await panel.evaluate(e => e.open))) await panel.locator('> summary').click();
    const dev = panel.locator('details', {has: page.locator('summary', {hasText: /^device$/})}).first();
    if(!(await dev.evaluate(e => e.open))) await dev.locator('> summary').click();
    await panel.scrollIntoViewIfNeeded(); return panel;
  };
  const act = async id => { const panel = await openBacklog(); const btn = panel.locator(`[data-backlog-action="${id}"]`);
    await btn.scrollIntoViewIfNeeded(); if(await btn.isDisabled()) throw new Error(`${id} disabled: ` + await btn.locator('xpath=..').innerText());
    await btn.click(); await ctx.refresh(1); return panel; };
  const sup = async () => { const s = await session.save(); const e = s.expansion.actors.player.sources[SRC]; return {suppliers: e ? Object.keys(e.suppliers || {}).sort() : null, logs: s.inventories.person.main_character[LOG]?.count ?? 0, save: s}; };
  try {
    const seed = structuredClone(ctx.base); seed.character.money = 5000; seed.inventories.person.main_character[LOG] = {count: 8};
    for(const [w, h] of [[1920, 1080], [1536, 864]]) {
      const tag = `${scenario}-${w}x${h}`; receipt.viewports.push(`${w}x${h}`);
      await session.open(seed); ctx.page = session.page; await ctx.page.setViewportSize({width: w, height: h}); await ctx.page.waitForTimeout(400);
      await meetElder(ctx);
      for(const id of ['meet_brasswright', 'buy_brass_lung', 'install_brass_lung']) await act('backlog.body.' + id);
      let s = await sup(); assert.deepEqual(s.suppliers, ['implant:backlog.brass_lung.bl01']); assert.equal(s.logs, 6);
      let panel = await act('backlog.body.copy_brass_lung'); s = await sup();
      let text = await panel.innerText();
      assert.match(text, /Temporary copy backlog\.brass_copy.*holds 1 x Rough wood log \(returned when it ends\)/s);
      assert.deepEqual(s.suppliers, ['construct:backlog.brass_copy', 'implant:backlog.brass_lung.bl01']); assert.equal(s.logs, 5);
      await ctx.shot(`g4-05-copy-made-${tag}.png`, panel);
      receipt.checks.push(`PASS ${tag} copy made: records show temporary copy; suppliers=${JSON.stringify(s.suppliers)}; logs 6->5`);
      await ctx.roundTrip(`${tag} copy made`);
      if(scenario === 'dismiss-early') {
        panel = await act('backlog.body.dismiss_brass_copy'); s = await sup(); text = await panel.innerText();
        assert.deepEqual(s.suppliers, ['implant:backlog.brass_lung.bl01']); assert.equal(s.logs, 6); assert.doesNotMatch(text, /Temporary copy backlog\.brass_copy/);
        await ctx.shot(`g4-08-copy-dismissed-${tag}.png`, panel);
        receipt.checks.push(`PASS ${tag} copy dismissed early: suppliers=${JSON.stringify(s.suppliers)}; log returned (6)`);
        await ctx.roundTrip(`${tag} dismissed`); continue;
      }
      if(scenario === 'expire-with-lung') {
        await session.step(35); await ctx.page.waitForTimeout(300); s = await sup();
        assert.deepEqual(s.suppliers, ['implant:backlog.brass_lung.bl01']); assert.equal(s.logs, 6); assert.equal(s.save.expansion.simulation.constructs?.['backlog.brass_copy'], undefined);
        panel = await openBacklog(); assert.doesNotMatch(await panel.innerText(), /Temporary copy backlog\.brass_copy/);
        await ctx.shot(`g4-09-copy-expired-lung-stays-${tag}.png`, panel);
        receipt.checks.push(`PASS ${tag} expired after 35 min with lung installed: suppliers=${JSON.stringify(s.suppliers)}; log returned`);
        await ctx.roundTrip(`${tag} expired (lung stays)`); continue;
      }
      panel = await openBacklog(); const rm = panel.locator('[data-backlog-action="backlog.body.remove_brass_lung"]');
      await rm.scrollIntoViewIfNeeded(); assert.ok(await rm.isDisabled(), 'Remove disabled while copy lives');
      assert.match(await rm.locator('xpath=..').innerText(), /Let the lung copy go before removing BL-01; the copy keeps the source alive\./);
      await ctx.shot(`g4-06-remove-refused-copy-live-${tag}.png`, panel);
      receipt.checks.push(`PASS ${tag} Remove BL-01 disabled with the copy reason while the copy lives`);
      await ctx.roundTrip(`${tag} remove refused`);
      panel = await act('backlog.body.dismiss_brass_copy'); s = await sup();
      assert.deepEqual(s.suppliers, ['implant:backlog.brass_lung.bl01']); assert.equal(s.logs, 6);
      panel = await act('backlog.body.remove_brass_lung'); s = await sup(); text = await panel.innerText();
      assert.equal(s.suppliers, null, 'source gone'); assert.match(text, /BL-01: loose with you/);
      await ctx.shot(`g4-07-dismissed-then-removed-source-gone-${tag}.png`, panel);
      receipt.checks.push(`PASS ${tag} copy dismissed then BL-01 removed: source gone, log back (${s.logs})`);
      await ctx.roundTrip(`${tag} dismissed then removed`);
    }
  } catch (e) { failed = e; receipt.failure = e.stack; await ctx.page?.screenshot({path: ctx.evidence + `/g4b-${scenario}-failure.png`}).catch(() => {}); }
  await ctx.finish(failed ? 'failed' : 'passed'); summary.push([scenario, failed ? 'FAIL ' + String(failed.message).split('\n')[0] : 'PASS']);
}
console.error(JSON.stringify(summary)); if(summary.some(x => x[1] !== 'PASS')) process.exitCode = 1;
