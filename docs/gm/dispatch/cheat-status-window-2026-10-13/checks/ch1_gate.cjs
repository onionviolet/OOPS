// CH1 status window + optional start gate. READ-ONLY for workers.
// Prints "PASS|FAIL <item> <detail>". Exit 0 all pass, 1 any fail, 3 broken tooling.
const __probe = u => new Promise(res => { const req = require('http').get(u, {agent: false}, r => { r.resume(); res({ok: r.statusCode >= 200 && r.statusCode < 400}); }); req.on('error', () => res({ok: false})); req.setTimeout(3000, () => { req.destroy(); res({ok: false}); }); });
const fs = require('fs'), path = require('path'), os = require('os');
let chromium;
try { ({chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); } catch { console.log('BROKEN playwright'); process.exit(3); }
const REPO = process.env.REPO || '/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-cheats-ch1';
const URL = process.env.URL || 'http://127.0.0.1:18322/';
const DORMANT = path.join(REPO, 'docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures/dormant_day3.save.txt');
const only = process.argv[2]; const results = [];
const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const parse = s => { try { return JSON.parse(s); } catch { return null; } };
const LEAK = /Status window|system-quests|Quest system/i;
const HELP = `window.__c={rgb(s){const m=String(s).match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const v=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}},lum(c){const f=x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b)},ratio(a,b){const A=this.lum(a),B=this.lum(b);return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05)},bg(e){for(let n=e;n&&n.nodeType===1;n=n.parentElement){const c=this.rgb(getComputedStyle(n).backgroundColor);if(c&&c.a>0.5)return c}return this.rgb(getComputedStyle(document.body).backgroundColor)}};
window.__reveals=[];new MutationObserver(ms=>{for(const m of ms)if(m.target.getAttribute&&m.target.getAttribute('data-workspace-reveal'))window.__reveals.push(m.target.dataset.module)}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-workspace-reveal']});`;

async function ctxPage(b, {w = 1366, h = 768, save = null} = {}) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, acceptDownloads: true}); await ctx.addInitScript(HELP);
  const p = await ctx.newPage(); p.setDefaultTimeout(15000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  await p.goto(URL + 'style.css'); await p.evaluate(s => { localStorage.clear(); if (s) localStorage.setItem('save data', s); }, save);
  await p.goto(URL, {waitUntil: 'domcontentloaded'}); return {ctx, p};
}
const play = async p => { await p.locator('#loading_screen_play_button:not(.none_display)').click({timeout: 8000}).catch(() => p.evaluate(() => document.getElementById('loading_screen_play_button').click())); await p.waitForTimeout(1200); };
const saveNow = async p => { await p.evaluate(() => localStorage.removeItem('save data')); await p.locator('#save_button').click(); for (let i = 0; i < 40; i++) { const s = await p.evaluate(() => localStorage.getItem('save data')); if (s) return parse(s); await p.waitForTimeout(100); } return null; };
const pageText = p => p.evaluate(() => document.body.innerText + '|' + [...document.querySelectorAll('[aria-label],[title],option,[aria-description]')].map(e => (e.getAttribute('aria-label') || '') + (e.getAttribute('title') || '') + (e.getAttribute('aria-description') || '') + (e.tagName === 'OPTION' ? '' : '')).join('|'));
// R21 put the Authoring toggle inside the game bar's menu box; open the box first when it is closed (as r11-lib does).
const context = async p => { const t = p.locator('[data-workspace-action=context]'); if (!(await t.isVisible()) && await p.locator('[data-control-box=game-bar-menu] > .control-box-button').count()) await p.locator('[data-control-box=game-bar-menu] > .control-box-button').click(); await t.click(); };
const pickerHas = p => p.evaluate(() => [...document.querySelectorAll('[data-workspace-action=restore]')].some(x => /Status/i.test(x.textContent)));
const statusShell = p => p.evaluate(() => { const s = document.querySelector('.workspace-module[data-module="status-window"]'); return s && !s.hidden && s.getBoundingClientRect().height > 0 ? {kit: s.dataset.panelKit, role: s.dataset.panelRole} : null; });
async function awaken(b, opts = {}) {
  if (!fs.existsSync(DORMANT)) throw Error('fixture missing ' + DORMANT);
  const a = await ctxPage(b, {...opts, save: fs.readFileSync(DORMANT, 'utf8')}); await play(a.p);
  const t0 = Date.now(); let st = null;
  while (Date.now() - t0 < 120000) { st = await statusShell(a.p); if (st) break; await a.p.waitForTimeout(1000); }
  a.awakenMs = Date.now() - t0; a.st = st; return a;
}

const checks = {
  async H1_no_cheat_default(b) {
    const {ctx, p} = await ctxPage(b); const bad = [];
    // R21b: the creation panel is retired; the Optional beginning sits on the start screen before PLAY.
    await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();
    const ctl = p.locator('#new_game_beginning [data-cheat-start]');
    if (!(await ctl.count())) bad.push('no [data-cheat-start] control in the start-screen Beginning');
    else {
      if (await ctl.first().inputValue() !== 'none') bad.push('default is not none');
      const desc = await p.locator('#new_game_beginning [data-cheat-start-desc]').first().textContent().catch(() => '');
      if (!/dormant|wakes|awaken/i.test(desc || '')) bad.push('description does not say it starts dormant');
    }
    await play(p); await p.waitForTimeout(500);
    const s = await saveNow(p);
    if (!s || Object.keys(s.cheats?.held || {}).length) bad.push('no-cheat start holds a card');
    const t = await pageText(p); if (LEAK.test(t)) bad.push('cheat name visible without a cheat'); if (await pickerHas(p)) bad.push('picker names the status window');
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('H1_no_cheat_default', !bad.length, bad.length ? bad : 'opt-in control, default none, nothing leaks');
  },
  async H2_dormant_start(b) {
    const {ctx, p} = await ctxPage(b); const bad = [];
    await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();
    await p.locator('#new_game_beginning [data-cheat-start]').first().selectOption('system-quests');
    await play(p); await p.waitForTimeout(1000);
    const s = await saveNow(p); const h = s?.cheats?.held?.['system-quests'];
    if (!h) bad.push('system-quests not held after choosing it');
    else { if (h.acquired?.route !== 'optional-start') bad.push('route ' + h.acquired?.route); if (h.card?.state?.awakened !== false && h.state?.awakened !== false && h.awakened !== false) bad.push('card not dormant at start'); if ((h.messages || []).length) bad.push('dormant card already has messages'); }
    if (await statusShell(p)) bad.push('status window visible while dormant');
    if (await pickerHas(p)) bad.push('picker names the status window while dormant');
    if (/Status window/i.test(await pageText(p))) bad.push('"Status window" text visible while dormant');
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('H2_dormant_start', !bad.length, bad.length ? bad : 'held dormant, route optional-start, nothing shown yet');
  },
  async H3_awakening(b) {
    let a; try { a = await awaken(b); } catch (e) { rec('H3_awakening', false, e.message); return; }
    const bad = [];
    if (!a.st) bad.push('status window did not appear within 120s');
    else {
      const s = await saveNow(a.p); const h = s?.cheats?.held?.['system-quests'];
      const awake = h && (h.card?.state?.awakened === true || h.state?.awakened === true || h.awakened === true);
      if (!awake) bad.push('save not marked awakened');
      const msg = h?.messages?.[0]; const text = typeof msg === 'string' ? msg : msg?.text;
      if (!text) bad.push('no first system message stored');
      else if (!(await a.p.evaluate(t => document.getElementById('message_box_div')?.innerText.includes(t), text))) bad.push('first message not in the log');
      const rv = await a.p.evaluate(() => window.__reveals.filter(x => x === 'status-window').length);
      if (rv !== 1) bad.push(`reveal fired ${rv} times (want 1)`);
    }
    if (a.p.errs.length) bad.push('page errors ' + a.p.errs[0]);
    await a.ctx.close(); rec('H3_awakening', !bad.length, bad.length ? bad : `awoke after ${Math.round(a.awakenMs / 1000)}s, message logged, revealed once`);
  },
  async H4_panel_contents(b) {
    let a; try { a = await awaken(b); } catch (e) { rec('H4_panel_contents', false, e.message); return; }
    const bad = [];
    if (!a.st) { await a.ctx.close(); rec('H4_panel_contents', false, 'not awakened'); return; }
    if (a.st.kit !== '1' || a.st.role !== 'character') bad.push('not a kit panel with role character');
    const v = await a.p.evaluate(() => { const s = document.querySelector('.workspace-module[data-module="status-window"]'); const q = x => s.querySelector(x); const num = t => (String(t || '').match(/-?\d+(\.\d+)?/) || [])[0];
      const statRow = [...document.querySelectorAll('#stats_div *, #character_stats_div *')].find(e => e.children.length === 0 && /^Strength:?$/.test(e.textContent.trim()));
      const strengthStats = statRow ? num(statRow.nextElementSibling?.textContent || statRow.parentElement.textContent) : null;
      return {level: num(q('[data-status-level]')?.textContent), vitalsLevel: num(document.getElementById('character_vitals_level')?.textContent), strength: num(q('[data-status-stat="strength"]')?.textContent), strengthStats,
        titles: !!q('[data-status-titles]'), points: !!q('[data-status-points]'), quests: !!q('[data-status-quests]'), rowH: q('[data-status-stat]')?.getBoundingClientRect().height}; });
    if (v.level == null || v.level !== v.vitalsLevel) bad.push(`level ${v.level} vs vitals ${v.vitalsLevel}`);
    if (v.strength == null || (v.strengthStats != null && Number(v.strength) !== Number(v.strengthStats))) bad.push(`strength ${v.strength} vs stats ${v.strengthStats}`);
    for (const k of ['titles', 'points', 'quests']) if (!v[k]) bad.push('missing [data-status-' + k + ']');
    // Density setting registered by the panel.
    await context(a.p); await a.p.waitForTimeout(500);
    const c = a.p.locator('#customization_effects_host [data-display-setting="panel.status-window.density"]');
    if (!(await c.count())) bad.push('no panel.status-window.density setting');
    else { await c.selectOption('compact'); await context(a.p); await a.p.waitForTimeout(400);
      const h2 = await a.p.evaluate(() => document.querySelector('.workspace-module[data-module="status-window"] [data-status-stat]')?.getBoundingClientRect().height);
      if (!(h2 < v.rowH)) bad.push(`compact did not tighten rows (${v.rowH} -> ${h2})`); }
    await a.ctx.close(); rec('H4_panel_contents', !bad.length, bad.length ? bad : v);
  },
  async H5_persistence(b) {
    let a; try { a = await awaken(b); } catch (e) { rec('H5_persistence', false, e.message); return; }
    const bad = [];
    if (!a.st) { await a.ctx.close(); rec('H5_persistence', false, 'not awakened'); return; }
    await saveNow(a.p); await a.p.evaluate(() => { window.__reveals = []; });
    await a.p.reload({waitUntil: 'domcontentloaded'}); await play(a.p); await a.p.waitForTimeout(2000);
    if (!(await statusShell(a.p))) bad.push('panel gone after reload');
    if ((await a.p.evaluate(() => window.__reveals.filter(x => x === 'status-window').length))) bad.push('reveal replayed on reload');
    const dl = a.p.waitForEvent('download', {timeout: 15000}); await a.p.locator('#save_to_file_button').click(); const d = await dl;
    const file = path.join(os.tmpdir(), 'ch1-export-' + Date.now() + '.txt'); await d.saveAs(file); await a.ctx.close();
    const c = await ctxPage(b); await c.p.setInputFiles('#saved_file_input', file); await c.p.waitForTimeout(2500); await play(c.p); await c.p.waitForTimeout(2000);
    if (!(await statusShell(c.p))) bad.push('panel gone after literal import');
    if ((await c.p.evaluate(() => window.__reveals.filter(x => x === 'status-window').length))) bad.push('reveal replayed on import');
    if (c.p.errs.length) bad.push('import page errors ' + c.p.errs[0]); await c.ctx.close();
    rec('H5_persistence', !bad.length, bad.length ? bad : 'survives reload and literal import without replaying the reveal');
  },
  async H6_template(b) {
    const bad = [];
    for (const [w, h] of [[1366, 768], [1440, 900], [1920, 1080]]) {
      let a; try { a = await awaken(b, {w, h}); } catch (e) { bad.push(e.message); break; }
      if (!a.st) { bad.push(`${w}x${h} not awakened`); await a.ctx.close(); continue; }
      const r = await a.p.evaluate(() => { const s = document.querySelector('.workspace-module[data-module="status-window"]'); s.scrollIntoView({block: 'nearest'}); const hd = s.querySelector('.workspace-module-header'); const t = hd.querySelector('strong') || hd; const rr = hd.getBoundingClientRect();
        const low = [...s.querySelectorAll('*')].filter(e => e.offsetParent && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => __c.ratio(__c.rgb(getComputedStyle(e).color), __c.bg(e))).filter(x => x < 4.5).length;
        return {inView: rr.top >= 0 && rr.bottom <= innerHeight + 0.5, low, overflow: s.scrollWidth > s.clientWidth + 1, hs: document.documentElement.scrollWidth > innerWidth}; });
      if (!r.inView) bad.push(`${w}x${h} header not reachable`); if (r.low) bad.push(`${w}x${h} ${r.low} text nodes < 4.5:1`); if (r.overflow) bad.push(`${w}x${h} panel overflows`); if (r.hs) bad.push(`${w}x${h} page h-scroll`);
      if (w === 1366) { await a.p.mouse.click(5, 5); let reached = false; for (let i = 0; i < 30 && !reached; i++) { await a.p.keyboard.press('F6'); reached = await a.p.evaluate(() => document.activeElement?.closest('.workspace-module')?.dataset.module === 'status-window'); } if (!reached) bad.push('F6 never reaches the status window'); }
      await a.ctx.close();
    }
    rec('H6_template', !bad.length, bad.length ? bad : 'fits, readable, F6-reachable at 3 desktop sizes');
  },
};
(async () => {
  let b; try { b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}); } catch { console.log('BROKEN chrome'); process.exit(3); }
  let up = false; for (let i = 0; i < 3 && !up; i++) { up = (await __probe(URL + 'index.html')).ok; if (!up) await new Promise(r => setTimeout(r, 400)); }
  if (!up) { console.log('BROKEN server ' + URL); await b.close(); process.exit(3); }
  for (const [id, fn] of Object.entries(checks)) { if (only && !id.startsWith(only)) continue; try { await fn(b); } catch (e) { rec(id, false, 'threw: ' + String(e.message).split('\n')[0]); } }
  await b.close(); process.exit(results.every(Boolean) ? 0 : 1);
})();
