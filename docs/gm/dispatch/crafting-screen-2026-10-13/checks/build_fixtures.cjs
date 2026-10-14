// Rebuilds fixtures/craft_none.save.txt and fixtures/craft_ready.save.txt from the current build.
// Usage: serve repo root on 127.0.0.1:18291, then `node build_fixtures.cjs`. See fixtures/README.md.
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs'), path = require('path');
const R = require('./routes.cjs');
const VP = {viewport: {width: 1366, height: 768}};
const out = (n, t) => fs.writeFileSync(path.join(R.FX, n), t);

async function page(b) {
  const ctx = await b.newContext(VP); const p = await ctx.newPage();
  p.setDefaultTimeout(15000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  return {ctx, p};
}
const logs = s => { const inv = JSON.parse(s).inventories.person.main_character; return Object.entries(inv).filter(([k]) => JSON.parse(k).id === 'Rough wood log').reduce((n, [, v]) => n + v.count, 0); };

(async () => {
  const b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  // 1. Fresh game, elder opening (unlocks Infested field travel). No combat.
  let {ctx, p} = await page(b);
  await p.goto(R.URL); await R.startFresh(p); await R.unlockCombatRoute(p);
  const s = JSON.parse(await R.saveText(p)); await ctx.close();
  // 2. THE ONE SAVE EDIT: stand-in for clearing Infested field (15 groups; a fresh hero dies in ~30 s
  //    with 0 kills). Clearing's repeatable_reward unlocks exactly this textline (flag 1 = unlocked).
  s.availabilities.textline['villageElder:cleared field'] = 1;
  ({ctx, p} = await page(b));
  await R.loadSave(p, JSON.stringify(s));
  // 3. Elder "cleared field" -> craftsman "hello" -> "learn" (crafting + gathering flags, Old tools).
  await R.learnCrafting(p);
  out('craft_none.save.txt', await R.saveText(p));
  // 4. Equip Old axe, gather wood in the Village until 2 Rough wood logs, stop.
  await p.locator('#inventory_div [data-item_slot="axe"] .equip_item_button').first().click();
  const a = p.locator('#location_actions_div');
  await a.getByText('Gather resources', {exact: false}).first().click();
  await a.getByText('Gather wood on the outskirts', {exact: false}).first().click();
  await p.locator('#action_end_div').waitFor({state: 'visible'});
  let n = 0; const t0 = Date.now();
  while (n < 2 && Date.now() - t0 < 300000) { await p.waitForTimeout(5000); n = logs(await R.saveText(p)); }
  await p.locator('#action_end_div').click();
  await a.getByText('Talk to someone', {exact: false}).first().waitFor({state: 'visible'});
  const ready = await R.saveText(p);
  out('craft_ready.save.txt', ready);
  console.log(JSON.stringify({logs: logs(ready), gatherSeconds: Math.round((Date.now() - t0) / 1000), errs: p.errs}));
  await b.close();
  if (n < 2) process.exit(1);
})().catch(e => { console.error(e); process.exit(2); });
