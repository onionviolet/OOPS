// Settings-pass gate. READ-ONLY for workers (see ../GOAL.md).
// Prints "PASS|FAIL <item> <detail>". Exit 0 all pass, 1 any fail, 3 broken tooling.
// Harness fix 2026-10-13: Node 22 fetch (undici) can crash with assert(!this.paused) against python http.server; probe with plain http and no keep-alive.
const __probe = u => new Promise(res => { const req = require('http').get(u, {agent: false}, r => { r.resume(); res({ok: r.statusCode >= 200 && r.statusCode < 400}); }); req.on('error', () => res({ok: false})); req.setTimeout(3000, () => { req.destroy(); res({ok: false}); }); });
const fs = require('fs'), path = require('path');
let chromium;
try { ({chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
catch { console.log('BROKEN playwright'); process.exit(3); }
const URL = process.env.URL || 'http://127.0.0.1:18301/';
process.env.URL = URL;
const R = require('/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const VFX = '/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/fixtures/';
const KEY = 'yairpg.display.v1';
const only = process.argv[2]; const results = [];
const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const DEFAULTS = {reveal: 'full', coinFloat: 'on', coinFloatAutomatic: 'off', newDot: 'on', logFollow: 'hold', vitalsValue: 'inside', vitalsLevel: 'show'};

async function open(b, {display = null, save = null, reduced = false, extra = {}} = {}) {
  const ctx = await b.newContext({viewport: {width: 1366, height: 768}, reducedMotion: reduced ? 'reduce' : 'no-preference'});
  await ctx.addInitScript(() => { window.__reveals = []; window.__floats = 0; new MutationObserver(ms => { for (const m of ms) { if (m.type === 'attributes' && m.target.getAttribute?.('data-workspace-reveal')) window.__reveals.push({id: m.target.dataset.module, anim: 0, node: m.target}); if (m.type === 'childList') for (const n of m.addedNodes) if (n.nodeType === 1 && n.matches?.('.coin-float')) window.__floats++; } }).observe(document, {subtree: true, childList: true, attributes: true, attributeFilter: ['data-workspace-reveal']}); });
  const p = await ctx.newPage(); p.setDefaultTimeout(12000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  if (display || save || Object.keys(extra).length) { await p.goto(URL + 'style.css'); await p.evaluate(([d, s, x]) => { localStorage.clear(); if (d) localStorage.setItem('yairpg.display.v1', JSON.stringify(d)); if (s) localStorage.setItem('save data', s); for (const [k, v] of Object.entries(x)) localStorage.setItem(k, v); }, [display, save, extra]); }
  await p.goto(URL, {waitUntil: 'domcontentloaded'}); await R.startFresh(p);
  return {ctx, p};
}
const buy = async p => { await p.locator('#location_related_div button', {hasText: 'Buy repair notes'}).first().click(); await p.waitForTimeout(700); };
const control = (p, k) => p.locator(`#customization_effects_host [data-display-setting="${k}"]`);
async function openEffects(p) {
  // Effects & sound lives in Authoring; open it the way a player would.
  await p.locator('[data-workspace-action=context]').click(); await p.waitForTimeout(500);
}

const checks = {
  async S1_controls_persist(b) {
    const {ctx, p} = await open(b); const bad = [];
    await openEffects(p);
    for (const [k, def] of Object.entries(DEFAULTS)) {
      const c = control(p, k);
      if (!(await c.count())) { bad.push(`missing control ${k}`); continue; }
      const v = await c.first().inputValue().catch(() => null);
      if (v !== def) bad.push(`${k} default ${v} != ${def}`);
      const desc = await c.first().evaluate(e => { const id = e.getAttribute('aria-describedby'); const d = id && document.getElementById(id); return d ? d.textContent.trim() : ''; });
      if (desc.length < 12) bad.push(`${k} lacks a one-line description (aria-describedby)`);
    }
    for (const k of ['semGain', 'semLoss', 'semMoney', 'semBlocked']) if (!(await control(p, k).count())) bad.push(`missing color control ${k}`);
    if (!bad.length) {
      await control(p, 'logFollow').selectOption('always'); await control(p, 'reveal').selectOption('quiet'); await p.waitForTimeout(200);
      const stored = await p.evaluate(k => JSON.parse(localStorage.getItem(k) || '{}'), KEY);
      if (stored.logFollow !== 'always' || stored.reveal !== 'quiet') bad.push('change not stored in ' + KEY + ': ' + JSON.stringify(stored));
      await p.reload({waitUntil: 'domcontentloaded'}); await R.startFresh(p); await openEffects(p);
      if (await control(p, 'logFollow').inputValue() !== 'always') bad.push('not restored after reload');
      const reset = p.locator('#customization_effects_host [data-display-reset]');
      if (!(await reset.count())) bad.push('no [data-display-reset]');
      else { await reset.first().click(); await p.waitForTimeout(200); if (await control(p, 'logFollow').inputValue() !== 'hold') bad.push('reset did not restore defaults'); }
      const saveHasDisplay = await p.evaluate(() => /yairpg\.display|coinFloat|logFollow/.test(localStorage.getItem('save data') || ''));
      if (saveHasDisplay) bad.push('display settings leaked into the game save');
    }
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('S1_controls_persist', !bad.length, bad.length ? bad : 'controls, defaults, descriptions, persist, reset; save untouched');
  },
  async S2_each_setting_works(b) {
    const bad = [];
    // coin float off
    { const {ctx, p} = await open(b, {display: {coinFloat: 'off'}}); await buy(p); if (await p.evaluate(() => window.__floats)) bad.push('coinFloat off still floats'); await ctx.close(); }
    // coin float on: user spend floats; automatic (no gesture) purse drop does not by default
    { const {ctx, p} = await open(b); await buy(p); if (await p.evaluate(() => window.__floats) !== 1) bad.push('coinFloat on: user spend did not float once');
      await p.waitForTimeout(2500); const n0 = await p.evaluate(() => window.__floats);
      await p.evaluate(() => { const m = document.getElementById('money_div'); m.textContent = m.textContent.replace(/(\d+)C/, (x, n) => (Math.max(0, n - 1)) + 'C'); }); await p.waitForTimeout(600);
      if (await p.evaluate(() => window.__floats) !== n0) bad.push('automatic purse drop floated with coinFloatAutomatic off'); await ctx.close(); }
    { const {ctx, p} = await open(b, {display: {coinFloatAutomatic: 'on'}}); await p.waitForTimeout(2500);
      await p.evaluate(() => { const m = document.getElementById('money_div'); m.textContent = m.textContent.replace(/(\d+)C/, (x, n) => (Math.max(0, n - 1)) + 'C'); }); await p.waitForTimeout(600);
      if (await p.evaluate(() => window.__floats) !== 1) bad.push('coinFloatAutomatic on: automatic drop did not float'); await ctx.close(); }
    // new dot off
    { const {ctx, p} = await open(b, {display: {newDot: 'off'}}); await buy(p); if (await p.locator('#inventory_div [data-item-new]').count()) bad.push('newDot off still marks'); await ctx.close(); }
    // log follow always
    { const {ctx, p} = await open(b, {display: {logFollow: 'always'}});
      await p.evaluate(() => { const l = document.getElementById('message_box_div'); l.style.height = '60px'; l.style.maxHeight = '60px'; l.style.overflowY = 'auto'; l.scrollTop = 0; });
      await buy(p); const atBottom = await p.evaluate(() => { const l = document.getElementById('message_box_div'); return l.scrollHeight - l.scrollTop - l.clientHeight < 4; });
      if (!atBottom) bad.push('logFollow always did not follow'); await ctx.close(); }
    // vitals beside + level hidden
    { const {ctx, p} = await open(b, {display: {vitalsValue: 'beside', vitalsLevel: 'hide'}});
      const v = await p.evaluate(() => { const bar = document.getElementById('character_stamina_bar_max').getBoundingClientRect(), val = document.getElementById('character_stamina_value').getBoundingClientRect(), lvl = document.getElementById('character_vitals_level'); return {beside: val.left >= bar.right - 2 || val.top >= bar.bottom - 2, lvlShown: !!lvl && lvl.offsetParent !== null && lvl.getBoundingClientRect().width > 0, hs: document.getElementById('basic_character_info_div').scrollWidth > document.getElementById('basic_character_info_div').clientWidth + 1}; });
      if (!v.beside) bad.push('vitalsValue beside: value still inside bar'); if (v.lvlShown) bad.push('vitalsLevel hide: level still shown'); if (v.hs) bad.push('vitals beside overflows'); await ctx.close(); }
    // semantic override
    { const {ctx, p} = await open(b, {display: {semMoney: '#00ffff'}}); const c = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--sem-money').trim().toLowerCase());
      if (c !== '#00ffff') bad.push('semMoney override not applied: ' + c); await ctx.close(); }
    // reveal off / quiet
    for (const mode of ['off', 'quiet']) { const {ctx, p} = await open(b, {display: {reveal: mode}, save: fs.readFileSync(VFX + 'precombat.save.txt', 'utf8')});
      await R.enterCombat(p); await p.waitForTimeout(200);
      // Reveal animations only: the shell's own animations (combat hit-shake on fighters is not a reveal; coordinator fix 2026-10-13).
      const a = await p.evaluate(() => { const s = document.querySelector('.workspace-module[data-module=combat]'); return {anims: s ? s.getAnimations().filter(x => x.playState === 'running').length : -1, marked: window.__reveals.some(r => r.id === 'combat'), visible: !!s && !s.hidden}; });
      if (!a.visible) bad.push(`reveal ${mode}: combat panel not shown`);
      if (mode === 'off' && a.anims) bad.push('reveal off still animates');
      if (mode === 'quiet' && !a.marked) bad.push('reveal quiet: no marker at all (quiet = brief, no movement)');
      await ctx.close(); }
    rec('S2_each_setting_works', !bad.length, bad.length ? bad : 'every display setting changes behavior');
  },
  async S3_global_effects_cap(b) {
    // The save-level Effects setting "off" turns off every motion feature regardless of display settings.
    const {ctx, p} = await open(b, {save: fs.readFileSync(VFX + 'precombat.save.txt', 'utf8')}); const bad = [];
    await openEffects(p);
    const sel = p.locator('#customization_effects_host select').filter({has: p.locator('option[value=off]')}).filter({has: p.locator('option[value=reduced]')}).first();
    if (!(await sel.count())) { bad.push('effects select not found'); }
    else {
      await sel.selectOption('off');
      const apply = p.getByRole('button', {name: /Apply and save/i}).first(); await apply.click(); await p.waitForTimeout(600);
      await p.locator('[data-workspace-action=context]').click(); await p.waitForTimeout(500);
      await buy(p);
      if (await p.evaluate(() => window.__floats)) bad.push('effects off: coin float still shown');
      await R.enterCombat(p); await p.waitForTimeout(200);
      const anims = await p.evaluate(() => { const s = document.querySelector('.workspace-module[data-module=combat]'); return s ? s.getAnimations({subtree: true}).filter(x => x.playState === 'running').length : -1; });
      if (anims > 0) bad.push('effects off: reveal still animates');
      const attr = await p.evaluate(() => document.documentElement.dataset.effects);
      if (attr !== 'off') bad.push(`no root data-effects=off for CSS (got ${attr})`);
    }
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('S3_global_effects_cap', !bad.length, bad.length ? bad : 'save-level effects off caps all motion');
  },
  async S4_export_import_all(b) {
    const bad = [];
    const a = await open(b, {display: {logFollow: 'always', coinFloat: 'off', semMoney: '#00ffff'}, extra: {'yairpg.colors.v1': 'standard'}});
    await a.p.locator('.workspace-layout-menu > summary').click(); await a.p.locator('.workspace-layout-menu summary', {hasText: 'Layout configuration'}).click();
    const exp = a.p.locator('[data-workspace-action=export]'); await exp.click(); await a.p.waitForTimeout(200);
    const json = await a.p.locator('textarea[aria-label="Layout configuration"]').first().inputValue().catch(() => '');
    let o = null; try { o = JSON.parse(json); } catch {}
    if (!o) bad.push('export is not JSON');
    else { if (!o.display || o.display.logFollow !== 'always' || o.display.coinFloat !== 'off') bad.push('export lacks display settings'); if (o.colors !== 'standard') bad.push('export lacks colors'); if (!Array.isArray(o.modules)) bad.push('export lost layout modules'); }
    await a.ctx.close();
    if (o) {
      const c = await open(b); await c.p.locator('.workspace-layout-menu > summary').click(); await c.p.locator('.workspace-layout-menu summary', {hasText: 'Layout configuration'}).click();
      const ta = c.p.locator('textarea[aria-label="Layout configuration"]').first(); await ta.fill(json);
      await c.p.locator('[data-workspace-action=import]').click(); await c.p.waitForTimeout(400);
      const got = await c.p.evaluate(k => ({d: JSON.parse(localStorage.getItem(k) || '{}'), scheme: document.documentElement.dataset.colorScheme, money: getComputedStyle(document.documentElement).getPropertyValue('--sem-money').trim().toLowerCase()}), KEY);
      if (got.d.logFollow !== 'always' || got.scheme !== 'standard' || got.money !== '#00ffff') bad.push('import did not restore all: ' + JSON.stringify(got));
      // Old layout-only JSON still imports.
      await ta.fill(JSON.stringify({version: 1, mode: 'dock', columns: [1, 1.4, 1], density: 'comfortable', modules: []})); await c.p.locator('[data-workspace-action=import]').click(); await c.p.waitForTimeout(300);
      const status = await c.p.evaluate(() => document.querySelector('.workspace-layout-menu')?.textContent || '');
      if (/Invalid layout/.test(status)) bad.push('old layout-only JSON rejected');
      await c.ctx.close();
    }
    rec('S4_export_import_all', !bad.length, bad.length ? bad : 'one export carries layout, colors and display; old JSON still imports');
  },
  async S5_keyboard_clears_dot(b) {
    const {ctx, p} = await open(b); const bad = [];
    await buy(p);
    const row = p.locator('#inventory_div [data-item-new]').first();
    if (!(await row.count())) bad.push('no new marker to clear');
    else {
      const focusable = await row.evaluate(e => { const t = e.closest('[tabindex]') || e.querySelector('[tabindex],button,a'); return !!t; });
      if (!focusable) bad.push('new item row not keyboard-focusable');
      await row.evaluate(e => (e.closest('[tabindex]') || e.querySelector('[tabindex],button,a'))?.focus()); await p.waitForTimeout(400);
      if (await p.locator('#inventory_div [data-item-new]').count()) bad.push('keyboard focus did not clear');
    }
    await ctx.close(); rec('S5_keyboard_clears_dot', !bad.length, bad.length ? bad : 'focus clears the new marker');
  },
  async S6_inplay_reveals(b) {
    const ctx = await b.newContext({viewport: {width: 1366, height: 768}});
    await ctx.addInitScript(() => { window.__r = []; new MutationObserver(ms => { for (const m of ms) if (m.target.getAttribute('data-workspace-reveal')) window.__r.push(m.target.dataset.module); }).observe(document, {subtree: true, attributes: true, attributeFilter: ['data-workspace-reveal']}); });
    const p = await ctx.newPage(); await p.goto(URL); await R.startFresh(p); await p.waitForTimeout(1500);
    await R.unlockCombatRoute(p); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => window.__r.slice()); await ctx.close();
    const ok = r.includes('notebook') && r.includes('known-people');
    rec('S6_inplay_reveals', ok, ok ? r : 'elder talk did not reveal notebook + known-people: ' + r);
  },
  async S7_settings_readable(b) {
    const {ctx, p} = await open(b); await openEffects(p);
    if (await p.locator('#customization_effects_host [data-display-setting]').count() < 7) { await ctx.close(); rec('S7_settings_readable', false, 'display controls missing'); return; }
    const low = await p.evaluate(() => { const h = document.getElementById('customization_effects_host'); const rgb = s => { const m = String(s).match(/[\d.]+/g); return m ? m.map(Number) : null; }; const lum = c => c.slice(0, 3).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }).reduce((a, x, i) => a + x * [0.2126, 0.7152, 0.0722][i], 0); const bg = e => { for (let n = e; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && (c[3] ?? 1) > 0.5) return c; } return [0, 0, 0]; };
      return [...h.querySelectorAll('[data-display-setting], [data-display-setting] ~ *, label, [id^=display-desc]')].filter(e => e.offsetParent && e.textContent.trim()).map(e => { const a = lum(rgb(getComputedStyle(e).color)), b = lum(bg(e)); return {t: e.textContent.trim().slice(0, 20), r: +((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toFixed(2)}; }).filter(x => x.r < 4.5); });
    await ctx.close(); rec('S7_settings_readable', !low.length, low.length ? low.slice(0, 5) : 'settings text >= 4.5:1');
  },
};

(async () => {
  let b; try { b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}); } catch { console.log('BROKEN chrome'); process.exit(3); }
  try { const r = await __probe(URL + 'index.html'); if (!r.ok) throw 0; } catch { console.log('BROKEN server ' + URL); await b.close(); process.exit(3); }
  for (const [id, fn] of Object.entries(checks)) { if (only && !id.startsWith(only)) continue; try { await fn(b); } catch (e) { rec(id, false, 'threw: ' + String(e.message).split('\n')[0]); } }
  await b.close(); process.exit(results.every(Boolean) ? 0 : 1);
})();
