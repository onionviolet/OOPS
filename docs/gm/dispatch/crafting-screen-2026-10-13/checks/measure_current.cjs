// Measures the CURRENT crafting view at 1366x768 (Workspace + Vivid default) from craft_ready.save.txt.
// Read-only probe for the research map; writes JSON to stdout and screenshots to ../research/.
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const R = require('./routes.cjs');
const SHOT = n => path.join(__dirname, '..', 'research', n);

const rect = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), h: Math.round(r.height), w: Math.round(r.width), display: getComputedStyle(e).display}; }, sel);
const pageScroll = p => p.evaluate(() => ({docH: document.documentElement.scrollHeight, winH: innerHeight, vscroll: document.documentElement.scrollHeight > innerHeight, scrollY, hscroll: document.documentElement.scrollWidth > innerWidth}));

(async () => {
  const b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const ctx = await b.newContext({viewport: {width: 1366, height: 768}}); const p = await ctx.newPage();
  p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  await R.loadSave(p, R.readFixture('craft_ready.save.txt'));
  const out = {env: await p.evaluate(() => ({layout: document.getElementById('main_content').className, scheme: document.documentElement.dataset.colorScheme}))};
  await R.openCrafting(p, 'woodworking');
  out.window = await rect(p, '#crafting_window');
  out.list = await p.evaluate(() => { const l = [...document.querySelectorAll('.crafting_recipe_list')].find(e => e.offsetParent); const r = l.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width), scrollH: l.scrollHeight, clientH: l.clientHeight, rows: l.querySelectorAll('.recipe_div').length, overflowY: getComputedStyle(l).overflowY}; });
  out.exit = await rect(p, '#exit_crafting_button');
  out.module = await p.evaluate(() => { const m = document.getElementById('crafting_window').closest('.customization-module, [data-module]'); if (!m) return null; const r = m.getBoundingClientRect(); return {id: m.id, cls: m.className.slice(0, 80), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), scrollH: m.scrollHeight, clientH: m.clientHeight, overflowY: getComputedStyle(m).overflowY}; });
  out.pageOpen = await pageScroll(p);
  out.tabbable = await p.evaluate(() => [...document.querySelectorAll('#crafting_window *')].filter(e => e.tabIndex >= 0 && e.offsetParent).map(e => e.tagName + (e.id ? '#' + e.id : '') + '.' + (e.className || '').toString().split(' ')[0]));
  out.rowRoles = await p.evaluate(() => { const r = document.querySelector('.crafting_recipe_list:not([style*="none"]) .recipe_div'); return r ? {tag: r.tagName, role: r.getAttribute('role'), tabIndex: r.tabIndex, ariaDisabled: r.getAttribute('aria-disabled')} : null; });
  await p.screenshot({path: SHOT('current_open_woodworking.png')});

  // Craftable row: hover shows the tooltip (only "detail" today).
  const ready = await R.selectRecipe(p, 'Processed rough wood');
  out.readyRow = await ready.evaluate(r => ({cls: r.className, text: r.innerText.split('\n')[0]}));
  out.readyTooltip = await ready.evaluate(r => { const t = r.querySelector('.recipe_tooltip'); const b = t.getBoundingClientRect(); return {display: getComputedStyle(t).display, top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right), inViewport: b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth, text: t.innerText.replace(/\s+/g, ' ').slice(0, 260)}; });
  await p.screenshot({path: SHOT('current_hover_ready.png')});
  const missing = await R.selectRecipe(p, 'Processed wood');
  out.missingRow = await missing.evaluate(r => ({cls: r.className, text: r.innerText.split('\n')[0]}));
  out.missingTooltip = await missing.evaluate(r => { const t = r.querySelector('.recipe_tooltip'); const b = t.getBoundingClientRect(); return {display: getComputedStyle(t).display, top: Math.round(b.top), bottom: Math.round(b.bottom), inViewport: b.top >= 0 && b.bottom <= innerHeight, text: t.innerText.replace(/\s+/g, ' ').slice(0, 260)}; });
  await p.screenshot({path: SHOT('current_hover_missing.png')});
  // Click a not-craftable name: what feedback?
  const logBefore = await p.evaluate(() => document.getElementById('message_log_div')?.innerText.length || 0);
  await missing.locator('.recipe_item_name').click();
  out.missingClickLogDelta = await p.evaluate(n => (document.getElementById('message_log_div')?.innerText || '').slice(0, Math.max(0, (document.getElementById('message_log_div')?.innerText.length || 0) - n)).slice(0, 200), logBefore);

  // Craft once, record list scroll, focus, row state, receipt and log.
  await p.evaluate(() => { const l = [...document.querySelectorAll('.crafting_recipe_list')].find(e => e.offsetParent); l.scrollTop = 1; });
  const before = await p.evaluate(() => { const l = [...document.querySelectorAll('.crafting_recipe_list')].find(e => e.offsetParent); return {scrollTop: l.scrollTop, focus: document.activeElement?.tagName + '#' + document.activeElement?.id}; });
  await R.craftOnce(p, 'Processed rough wood');
  await p.waitForTimeout(800);
  out.afterCraft = await p.evaluate(() => {
    const l = [...document.querySelectorAll('.crafting_recipe_list')].find(e => e.offsetParent);
    const row = l.querySelector('[data-recipe_id="Processed rough wood"]');
    const fx = document.querySelector('#crafting_window .work-ledger-effect');
    const fr = fx?.getBoundingClientRect();
    const log = document.getElementById('message_log_div') || document.getElementById('message_box_div');
    return {scrollTop: l.scrollTop, focus: document.activeElement?.tagName + '#' + document.activeElement?.id, rowCls: row.className, windowVisible: !!document.getElementById('crafting_window').offsetParent,
      receipt: fx ? {text: fx.innerText.replace(/\s+/g, ' ').slice(0, 200), top: Math.round(fr.top), bottom: Math.round(fr.bottom), cls: fx.className} : null,
      cancelBtn: !!document.getElementById('cancel_craft_visual_effect')?.offsetParent,
      logHead: (log?.innerText || '').split('\n').filter(Boolean).slice(0, 4)};
  });
  out.before = before;
  out.pageAfter = await pageScroll(p);
  await p.screenshot({path: SHOT('current_after_craft.png')});
  out.errs = p.errs;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(2); });
