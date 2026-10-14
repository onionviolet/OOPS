// Panel-kit gate. READ-ONLY for workers (see ../GOAL.md).
// Prints "PASS|FAIL <item> <detail>". Exit 0 all pass, 1 any fail, 3 broken tooling.
const fs = require('fs'), path = require('path');
let chromium;
try { ({chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); } catch { console.log('BROKEN playwright'); process.exit(3); }
const URL = process.env.URL || 'http://127.0.0.1:18311/'; process.env.URL = URL;
const REPO = '/Users/weiwei/code/yet-another-idle-rpg';
const R = require(REPO + '/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const PRE = fs.readFileSync(REPO + '/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/fixtures/precombat.save.txt', 'utf8');
const KIT = ['known-people', 'notebook', 'known-routes', 'combat', 'stance'];
const ROLES = ['actions', 'character', 'records', 'log', 'optional'];
const only = process.argv[2]; const results = [];
const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const HELP = `window.__c={rgb(s){const m=String(s).match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const v=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}},lum(c){const f=x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b)},ratio(a,b){const A=this.lum(a),B=this.lum(b);return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05)},bg(e){for(let n=e;n&&n.nodeType===1;n=n.parentElement){const c=this.rgb(getComputedStyle(n).backgroundColor);if(c&&c.a>0.5)return c}return this.rgb(getComputedStyle(document.body).backgroundColor)}};`;
async function open(b, {save = PRE, w = 1366, h = 768, storage = {}} = {}) {
  const ctx = await b.newContext({viewport: {width: w, height: h}}); await ctx.addInitScript(HELP);
  const p = await ctx.newPage(); p.setDefaultTimeout(12000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  await p.goto(URL + 'style.css'); await p.evaluate(([s, st]) => { localStorage.clear(); if (s) localStorage.setItem('save data', s); for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v); }, [save, storage]);
  await p.goto(URL, {waitUntil: 'domcontentloaded'}); await R.startFresh(p); await p.waitForTimeout(800); return {ctx, p};
}
const shellInfo = (p, id) => p.evaluate(id => { const s = document.querySelector(`.workspace-module[data-module="${id}"]`); if (!s) return null; const icon = s.querySelector('.workspace-module-header [data-panel-role-icon]'); return {kit: s.dataset.panelKit, role: s.dataset.panelRole, region: s.getAttribute('role'), label: s.getAttribute('aria-label') || (s.getAttribute('aria-labelledby') && document.getElementById(s.getAttribute('aria-labelledby'))?.textContent), icon: icon ? {hidden: icon.getAttribute('aria-hidden'), w: icon.getBoundingClientRect().width} : null, hidden: s.hidden}; }, id);

const checks = {
  async K1_contract(b) {
    const {ctx, p} = await open(b); const bad = [];
    await R.enterCombat(p); await p.waitForTimeout(300);
    for (const id of KIT) {
      const s = await shellInfo(p, id);
      if (!s) { if (id !== 'known-routes') bad.push(`${id}: no shell`); continue; }
      if (s.kit !== '1') bad.push(`${id}: not data-panel-kit=1`);
      if (!ROLES.includes(s.role)) bad.push(`${id}: role ${s.role}`);
      if (s.region !== 'region' || !s.label) bad.push(`${id}: not a labelled region`);
      if (!s.hidden && (!s.icon || s.icon.hidden !== 'true' || s.icon.w <= 0)) bad.push(`${id}: no visible aria-hidden role icon`);
    }
    // Non-kit modules keep working unchanged (no accidental contract on everything is fine, but vitals must still render).
    if (!(await p.locator('#character_healthbar_current').isVisible())) bad.push('vitals broken');
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('K1_contract', !bad.length, bad.length ? bad : 'five panels on the kit contract with role, region label and icon');
  },
  async K2_reasons(b) {
    const {ctx, p} = await open(b); const bad = [];
    await R.enterCombat(p); await R.leaveCombat(p); await p.waitForTimeout(600);
    const r = await p.evaluate(() => [...document.querySelectorAll('[data-workspace-action=restore]')].filter(x => /Combat|Stance/.test(x.textContent)).map(x => ({t: x.textContent.trim(), disabled: x.disabled || x.getAttribute('aria-disabled') === 'true', why: (x.getAttribute('aria-description') || '') + '|' + (x.title || '') + '|' + (x.getAttribute('aria-describedby') ? document.getElementById(x.getAttribute('aria-describedby'))?.textContent : '')})));
    if (r.length < 2) bad.push('combat/stance picker entries missing: ' + JSON.stringify(r));
    for (const x of r) { if (!x.disabled) bad.push(`${x.t} should be unavailable out of combat`); if (!/fight|combat|battle|enemy|enemies/i.test(x.why)) bad.push(`${x.t}: reason not panel-specific: ${x.why}`); if (/Not available here right now/.test(x.why)) bad.push(`${x.t}: generic reason`); }
    await ctx.close(); rec('K2_reasons', !bad.length, bad.length ? bad : r);
  },
  async K3_f6_navigation(b) {
    const {ctx, p} = await open(b); const bad = [];
    await p.mouse.click(5, 5); await p.keyboard.press('F6'); await p.waitForTimeout(150);
    const a = await p.evaluate(() => document.activeElement?.closest('.workspace-module')?.dataset.module || null);
    await p.keyboard.press('F6'); await p.waitForTimeout(150);
    const c = await p.evaluate(() => document.activeElement?.closest('.workspace-module')?.dataset.module || null);
    await p.keyboard.press('Shift+F6'); await p.waitForTimeout(150);
    const d = await p.evaluate(() => document.activeElement?.closest('.workspace-module')?.dataset.module || null);
    const visible = await p.evaluate(() => [...document.querySelectorAll('.workspace-module')].filter(s => !s.hidden && s.offsetParent).map(s => s.dataset.module));
    if (!a) bad.push('F6 did not focus a panel'); if (!c || c === a) bad.push('second F6 did not move to another panel'); if (d !== a) bad.push(`Shift+F6 did not go back (${a} -> ${c} -> ${d})`);
    if (a && !visible.includes(a)) bad.push('F6 focused a hidden panel');
    const ring = await p.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2 || /\d/.test(s.boxShadow); });
    if (!ring) bad.push('focused panel has no visible focus ring');
    await ctx.close(); rec('K3_f6_navigation', !bad.length, bad.length ? bad : {a, c, d});
  },
  async K4_panel_setting(b) {
    const {ctx, p} = await open(b); const bad = [];
    await p.locator('[data-workspace-action=context]').click(); await p.waitForTimeout(500);
    const c = p.locator('#customization_effects_host [data-display-setting="panel.known-people.sort"]');
    if (!(await c.count())) bad.push('no per-panel setting panel.known-people.sort in This browser');
    else {
      const desc = await c.evaluate(e => document.getElementById(e.getAttribute('aria-describedby') || '')?.textContent || '');
      if (desc.length < 12) bad.push('setting lacks description');
      const group = await c.evaluate(e => e.closest('fieldset,[data-panel-settings]')?.textContent || '');
      if (!/People you know/.test(group)) bad.push('setting not grouped under its panel name');
      await c.selectOption('name'); await p.waitForTimeout(200);
      const stored = await p.evaluate(() => JSON.parse(localStorage.getItem('yairpg.display.v1') || '{}'));
      const v = stored['panel.known-people.sort'] ?? stored.panels?.['known-people']?.sort;
      if (v !== 'name') bad.push('not stored in yairpg.display.v1: ' + JSON.stringify(stored));
      await p.locator('[data-workspace-action=context]').click(); await p.waitForTimeout(500);
      const rows = await p.evaluate(() => [...document.querySelectorAll('.workspace-module[data-module="known-people"] [data-panel-row]')].map(r => (r.dataset.sortName || r.textContent).trim().toLowerCase()));
      if (!rows.length) bad.push('known-people rows lack data-panel-row');
      else if (rows.join('\n') !== [...rows].sort().join('\n')) bad.push('name sort not applied: ' + rows);
    }
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('K4_panel_setting', !bad.length, bad.length ? bad : 'panel registers its own setting, grouped, stored, applied');
  },
  async K5_world_frame(b) {
    const {ctx, p} = await open(b); const bad = [];
    const f = await p.evaluate(() => { const root = getComputedStyle(document.documentElement); const s = document.querySelector('.workspace-module[data-module="known-people"]'); return {world: document.documentElement.dataset.world, accent: root.getPropertyValue('--frame-accent').trim(), page: root.getPropertyValue('--frame-page').trim(), panel: s ? getComputedStyle(s).getPropertyValue('--panel-frame-accent').trim() : null}; });
    if (!f.world) bad.push('no html[data-world]'); if (!f.accent || !f.page) bad.push('no --frame-accent/--frame-page tokens');
    if (!f.panel || f.panel !== f.accent) bad.push('kit panel does not consume --frame-accent as --panel-frame-accent');
    // Player Appearance still wins: a custom palette module keeps its colors (smoke: attribute honored).
    await ctx.close(); rec('K5_world_frame', !bad.length, bad.length ? bad : f);
  },
  async K6_template(b) {
    const bad = [];
    for (const [w, h] of [[1366, 768], [1440, 900], [1920, 1080]]) {
      const {ctx, p} = await open(b, {w, h}); await R.enterCombat(p); await p.waitForTimeout(300);
      for (const id of KIT) {
        const r = await p.evaluate(id => { const s = document.querySelector(`.workspace-module[data-module="${id}"]`); if (!s || s.hidden) return {skip: true}; s.scrollIntoView({block: 'nearest'}); const hd = s.querySelector('.workspace-module-header'); const t = hd.querySelector('strong') || hd; const r = hd.getBoundingClientRect(); const ratio = __c.ratio(__c.rgb(getComputedStyle(t).color), __c.bg(t)); return {inView: r.top >= 0 && r.bottom <= innerHeight + 0.5 && r.left >= 0 && r.right <= innerWidth + 0.5, ratio: +ratio.toFixed(2), overflowX: s.scrollWidth > s.clientWidth + 1}; }, id);
        if (r.skip) continue;
        if (!r.inView) bad.push(`${w}x${h} ${id} header not reachable in view`); if (r.ratio < 4.5) bad.push(`${w}x${h} ${id} header ${r.ratio}:1`); if (r.overflowX) bad.push(`${w}x${h} ${id} overflows horizontally`);
      }
      if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)) bad.push(`${w}x${h} page h-scroll`);
      await ctx.close();
    }
    rec('K6_template', !bad.length, bad.length ? bad : 'kit panels fit, readable, no overflow at 3 desktop sizes');
  },
  async K7_docs_and_cards(b) {
    const bad = [];
    const doc = REPO + '/docs/PANEL_KIT.md';
    if (!fs.existsSync(doc)) bad.push('docs/PANEL_KIT.md missing');
    else { const t = fs.readFileSync(doc, 'utf8'); for (const h of ['## Contract', '## Add a panel', '## Cheat panels', '## Acceptance']) if (!t.includes(h)) bad.push('PANEL_KIT.md lacks ' + h); if (!/definePanel|panel_kit/.test(t)) bad.push('doc does not name the API'); }
    if (!/PANEL_KIT\.md/.test(fs.readFileSync(REPO + '/docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md', 'utf8'))) bad.push('UI owner does not link PANEL_KIT.md');
    const cards = REPO + '/docs/gm/dispatch/panel-kit-2026-10-13/CHEAT_PANEL_CARDS.json';
    let c = null; try { c = JSON.parse(fs.readFileSync(cards, 'utf8')); } catch { bad.push('CHEAT_PANEL_CARDS.json missing/invalid'); }
    if (c) { const ids = c.map(x => x.id); for (let i = 1; i <= 10; i++) if (!ids.includes('CH' + i)) bad.push('missing card CH' + i);
      for (const x of c) for (const k of ['id', 'panel', 'role', 'discoveredBy', 'holds', 'reveal', 'settings', 'sealedRule', 'needsFoundation']) if (!(k in x)) bad.push(`${x.id} lacks ${k}`);
      for (const x of c) if (x.role && !ROLES.includes(x.role) && x.role !== 'overlay') bad.push(`${x.id} role ${x.role}`); }
    rec('K7_docs_and_cards', !bad.length, bad.length ? bad.slice(0, 8) : 'contract doc, owner link, ten cheat panel cards');
  },
};
(async () => {
  let b; try { b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}); } catch { console.log('BROKEN chrome'); process.exit(3); }
  try { const r = await fetch(URL + 'index.html'); if (!r.ok) throw 0; } catch { try { await new Promise(r => setTimeout(r, 500)); const r2 = await fetch(URL + 'index.html'); if (!r2.ok) throw 0; } catch { console.log('BROKEN server ' + URL); await b.close(); process.exit(3); } }
  for (const [id, fn] of Object.entries(checks)) { if (only && !id.startsWith(only)) continue; try { await fn(b); } catch (e) { rec(id, false, 'threw: ' + String(e.message).split('\n')[0]); } }
  await b.close(); process.exit(results.every(Boolean) ? 0 : 1);
})();
