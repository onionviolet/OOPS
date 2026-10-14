// Loads each fixture in a fresh context twice and runs the crafting routes. Prints PASS/FAIL lines.
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const R = require('./routes.cjs');
let fail = 0; const rec = (id, ok, d) => { if (!ok) fail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${JSON.stringify(d)}`); };
const makeable = p => p.evaluate(() => [...document.querySelectorAll('.crafting_recipe_list')].filter(e => e.offsetParent).flatMap(l => [...l.querySelectorAll('.recipe_div')].filter(r => r.offsetParent).map(r => r.dataset.recipe_id)));

(async () => {
  const b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  for (let run = 1; run <= 2; run++) {
    for (const fx of ['craft_ready.save.txt', 'craft_none.save.txt']) {
      const ctx = await b.newContext({viewport: {width: 1366, height: 768}}); const p = await ctx.newPage();
      p.setDefaultTimeout(15000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
      try {
        await R.loadSave(p, R.readFixture(fx));
        const place = (await p.locator('#location_name_span').innerText()).trim();
        await R.openCrafting(p, 'woodworking');
        const ready = await R.selectRecipe(p, 'Processed rough wood');
        const readyCls = await ready.getAttribute('class');
        const missingCls = await (await R.selectRecipe(p, 'Processed wood')).getAttribute('class');
        await p.locator('#crafting_makeable_filter').check();
        const m = await makeable(p); const empty = await p.locator('#crafting_filter_empty').isVisible();
        await p.locator('#crafting_makeable_filter').uncheck();
        await R.closeCrafting(p); await R.openCrafting(p); // reopen works
        const d = {place, readyCls, missingCls, makeableWoodworking: m, emptyMsg: empty, errs: p.errs};
        const ok = place.startsWith('Village') && !p.errs.length && (fx === 'craft_ready.save.txt'
          ? !readyCls.includes('recipe_unavailable') && missingCls.includes('recipe_unavailable') && m.length === 1 && m[0] === 'Processed rough wood'
          : readyCls.includes('recipe_unavailable') && m.length === 0 && empty);
        rec(`run${run} ${fx}`, ok, d);
      } catch (e) { rec(`run${run} ${fx}`, false, e.message.slice(0, 200)); }
      await ctx.close();
    }
  }
  await b.close(); process.exit(fail ? 1 : 0);
})();
