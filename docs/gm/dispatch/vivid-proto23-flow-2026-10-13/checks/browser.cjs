// Gate for the Vivid + Proto23 flow goal. READ-ONLY for workers (see GOAL.md).
// Prints one "PASS|FAIL <item> <detail>" line per item. Exit 0 all pass, 1 any fail, 3 broken tooling.
const fs = require('fs'), path = require('path');
let chromium;
try { ({chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
catch (e) { console.log('BROKEN playwright missing: ' + e.message); process.exit(3); }
const R = require('./routes.cjs');
const URL = process.env.URL || 'http://127.0.0.1:18251/';
const FX = path.join(__dirname, 'fixtures');
const only = process.argv[2];
const results = [];
const rec = (id, ok, detail) => { results.push({id, ok}); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`); };

// Contrast helpers injected into pages.
const HELPERS = `
window.__c = {
  rgb(s){const m=String(s).match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const v=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1};},
  lum(c){const f=x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);},
  ratio(a,b){const A=this.lum(a),B=this.lum(b);return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05);},
  bg(e){for(let n=e;n&&n.nodeType===1;n=n.parentElement){const c=this.rgb(getComputedStyle(n).backgroundColor);if(c&&c.a>0.5)return c;}return this.rgb(getComputedStyle(document.body).backgroundColor);},
  hue(c){const r=c.r/255,g=c.g/255,b=c.b/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(!d)return null;let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;return (h*60+360)%360;}
};`;

async function ctxOpen(browser, {storage = null, save = null, reduced = false, w = 1366, h = 768} = {}) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, reducedMotion: reduced ? 'reduce' : 'no-preference'});
  await ctx.addInitScript(HELPERS);
  // Record every module that receives a reveal marker, from page start.
  await ctx.addInitScript(() => {
    window.__reveals = [];
    new MutationObserver(ms => { for (const m of ms) if (m.type === 'attributes' && m.attributeName === 'data-workspace-reveal' && m.target.getAttribute('data-workspace-reveal')) window.__reveals.push(m.target.dataset.module || '?'); })
      .observe(document, {subtree: true, attributes: true, attributeFilter: ['data-workspace-reveal']});
  });
  const p = await ctx.newPage(); p.setDefaultTimeout(12000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  if (storage || save) {
    await p.goto(URL + 'style.css'); await p.evaluate(([st, sv]) => { localStorage.clear(); for (const [k, v] of Object.entries(st || {})) localStorage.setItem(k, v); if (sv) localStorage.setItem('save data', sv); }, [storage, save]);
  }
  await p.goto(URL, {waitUntil: 'domcontentloaded'});
  return {ctx, p};
}
const pickerTexts = p => p.evaluate(() => [...document.querySelectorAll('[data-workspace-action=restore]')].map(b => b.textContent.trim() + (b.disabled ? ' [disabled]' : '')));
const scheme = p => p.evaluate(() => document.documentElement.dataset.colorScheme);
const read = f => fs.readFileSync(path.join(FX, f), 'utf8');
const UNDISCOVERED_AT_START = ['Combat', 'Stance & combatants', 'People you know', 'Known routes', 'Notes, practice & people'];
// Standard-scheme bar fills recorded from the pre-change build (2026-10-13).
const STANDARD_BARS = {xp: 'rgb(255, 165, 0)', stamina: 'rgb(0, 196, 0)', mana: 'rgb(15, 15, 255)', health: 'rgb(255, 46, 46)'};
const BAR_IDS = {xp: 'character_xp_bar_current', stamina: 'character_stamina_bar_current', mana: 'character_mana_bar_current', health: 'character_healthbar_current'};

const checks = {
  async I1_vivid_default(b) {
    const a = await ctxOpen(b); await R.startFresh(a.p);
    const fresh = {scheme: await scheme(a.p), select: await a.p.locator('select[data-workspace-action=colors]').inputValue()};
    const s = await ctxOpen(b, {storage: {'yairpg.colors.v1': 'standard'}}); await R.startFresh(s.p);
    const kept = await scheme(s.p);
    const ok = fresh.scheme === 'vivid' && fresh.select === 'vivid' && kept === 'standard' && !a.p.errs.length && !s.p.errs.length;
    await a.ctx.close(); await s.ctx.close();
    rec('I1_vivid_default', ok, {fresh, storedStandardStays: kept});
  },
  async I2_bars(b) {
    const get = p => p.evaluate(ids => Object.fromEntries(Object.entries(ids).map(([k, id]) => { const e = document.getElementById(id); const fill = __c.rgb(getComputedStyle(e).backgroundColor); const surface = __c.bg(e.parentElement.parentElement); return [k, {fill: getComputedStyle(e).backgroundColor, hue: __c.hue(fill), edge: +__c.ratio(fill, surface).toFixed(2)}]; })), BAR_IDS);
    const s = await ctxOpen(b, {storage: {'yairpg.colors.v1': 'standard'}}); await R.startFresh(s.p); const std = await get(s.p);
    const v = await ctxOpen(b, {storage: {'yairpg.colors.v1': 'vivid'}}); await R.startFresh(v.p); const viv = await get(v.p);
    const bad = [];
    for (const k of Object.keys(BAR_IDS)) {
      if (std[k].fill !== STANDARD_BARS[k]) bad.push(`${k}: standard changed to ${std[k].fill}`);
      if (viv[k].fill === std[k].fill) bad.push(`${k}: vivid fill unchanged`);
      const dh = Math.abs(((viv[k].hue ?? 0) - (std[k].hue ?? 0) + 540) % 360 - 180);
      if (dh > 35) bad.push(`${k}: hue moved ${dh.toFixed(0)}deg`);
      if (viv[k].edge < 3) bad.push(`${k}: fill vs panel ${viv[k].edge}:1 < 3:1`);
    }
    await s.ctx.close(); await v.ctx.close();
    rec('I2_bars', !bad.length, bad.length ? bad : viv);
  },
  async I3_rarity(b) {
    const v = await ctxOpen(b, {storage: {'yairpg.colors.v1': 'vivid'}}); await R.startFresh(v.p);
    const low = await v.p.evaluate(() => [...document.querySelectorAll('#inventory_div .inventory_item_name, #inventory_div .equipped_item_name, #character_div .equipped_item_name, #inventory_div [style*="color"]')]
      .filter(e => e.textContent.trim() && e.offsetParent).map(e => ({t: e.textContent.trim().slice(0, 30), r: +__c.ratio(__c.rgb(getComputedStyle(e).color), __c.bg(e)).toFixed(2)})).filter(x => x.r < 4.5));
    await v.ctx.close();
    rec('I3_rarity', !low.length, low.length ? low : 'all visible item names >= 4.5:1 on Vivid');
  },
  async I4_reveal_combat(b) {
    const bad = [], info = {};
    const a = await ctxOpen(b, {save: read('precombat.save.txt'), storage: {'yairpg.colors.v1': 'vivid'}}); await R.startFresh(a.p);
    const fresh = await ctxOpen(b); await R.startFresh(fresh.p);
    const startPicker = await pickerTexts(fresh.p);
    for (const name of UNDISCOVERED_AT_START) if (startPicker.some(t => t.replace(' [disabled]', '').endsWith(' ' + name))) bad.push(`fresh picker leaks "${name}"`);
    const leakText = await fresh.p.evaluate(() => /Open Combat|Stance & combatants|People you know|Known routes/.test(document.body.innerText + [...document.querySelectorAll('button,option,[aria-label],[title]')].map(e => e.textContent + (e.getAttribute('aria-label') || '') + (e.getAttribute('title') || '')).join('|')));
    if (leakText) bad.push('undiscovered module name present in page text/labels');
    await fresh.ctx.close();
    const pre = await pickerTexts(a.p);
    if (pre.some(t => /\bCombat\b/.test(t) && !/Stance/.test(t))) bad.push('precombat picker already lists Combat');
    await a.p.evaluate(() => { window.__reveals = []; });
    await R.enterCombat(a.p);
    await a.p.waitForTimeout(1500);
    info.revealsInCombat = await a.p.evaluate(() => window.__reveals.slice());
    if (!info.revealsInCombat.includes('combat')) bad.push('combat panel did not get a reveal marker');
    info.combatShellVisible = await a.p.evaluate(() => { const s = document.querySelector('.workspace-module[data-module=combat]'); return !!s && !s.hidden && s.getBoundingClientRect().height > 0; });
    if (!info.combatShellVisible) bad.push('combat panel not visible during fight');
    const inFight = await pickerTexts(a.p); if (!inFight.some(t => /Open Combat$|Show Combat$/.test(t))) bad.push('picker lacks enabled Combat during fight');
    await R.leaveCombat(a.p); await a.p.waitForTimeout(800);
    const after = await pickerTexts(a.p); info.afterLeave = after.filter(t => /Combat/.test(t));
    if (!after.some(t => /Combat/.test(t) && !/Stance/.test(t))) bad.push('Combat vanished from picker after leaving (discovered must persist)');
    const save = await R.saveText(a.p);
    await a.p.evaluate(() => { window.__reveals = []; });
    await a.p.reload({waitUntil: 'domcontentloaded'}); await R.startFresh(a.p); await a.p.waitForTimeout(1500);
    info.revealsAfterReload = await a.p.evaluate(() => window.__reveals.slice());
    if (info.revealsAfterReload.length) bad.push('reveal replayed after reload: ' + info.revealsAfterReload);
    if (!(await pickerTexts(a.p)).some(t => /Combat/.test(t) && !/Stance/.test(t))) bad.push('Combat missing from picker after reload');
    if (a.p.errs.length) bad.push('page errors: ' + a.p.errs.slice(0, 2));
    await a.ctx.close();
    // Import into a brand-new origin: discovery comes from save facts.
    const i = await ctxOpen(b, {save}); await R.startFresh(i.p); await i.p.waitForTimeout(1500);
    if (!(await pickerTexts(i.p)).some(t => /Combat/.test(t) && !/Stance/.test(t))) bad.push('Combat missing after import to new origin');
    if ((await i.p.evaluate(() => window.__reveals.slice())).length) bad.push('reveal replayed on import');
    await i.ctx.close();
    // A save made by the pre-change build after fighting keeps Combat known.
    const o = await ctxOpen(b, {save: read('fought.save.txt')}); await R.startFresh(o.p); await o.p.waitForTimeout(1200);
    if (!(await pickerTexts(o.p)).some(t => /Combat/.test(t) && !/Stance/.test(t))) bad.push('old fought save lost Combat');
    if (o.p.errs.length) bad.push('old save page errors: ' + o.p.errs.slice(0, 2));
    await o.ctx.close();
    // Reduced motion: marker may be set, but no running animation on the shell.
    const r = await ctxOpen(b, {save: read('precombat.save.txt'), reduced: true}); await R.startFresh(r.p);
    await R.enterCombat(r.p); await r.p.waitForTimeout(300);
    const anims = await r.p.evaluate(() => { const s = document.querySelector('.workspace-module[data-module=combat]'); return s ? s.getAnimations({subtree: true}).filter(x => x.playState === 'running').length : -1; });
    if (anims > 0) bad.push(`reduced motion still animates combat panel (${anims})`);
    await r.ctx.close();
    rec('I4_reveal_combat', !bad.length, bad.length ? bad : info);
  },
  async I5_new_marker(b) {
    const bad = [];
    const a = await ctxOpen(b, {storage: {'yairpg.colors.v1': 'vivid'}}); await R.startFresh(a.p);
    const pre = await a.p.evaluate(() => document.querySelectorAll('#inventory_div [data-item-new]').length);
    if (pre) bad.push(`starting items marked new (${pre})`);
    await a.p.locator('#location_related_div button', {hasText: 'Buy repair notes'}).first().click(); await a.p.waitForTimeout(800);
    const marked = a.p.locator('#inventory_div [data-item-new]', {hasText: 'Waypost repair notes'});
    if (await marked.count() !== 1) bad.push('bought notes not marked new exactly once');
    else {
      const others = await a.p.evaluate(() => [...document.querySelectorAll('#inventory_div [data-item-new]')].filter(e => !/Waypost repair notes/.test(e.textContent)).length);
      if (others) bad.push('other items marked new');
      await marked.first().hover(); await a.p.waitForTimeout(1500); await a.p.mouse.move(2, 2);
      if (await a.p.locator('#inventory_div [data-item-new]').count()) bad.push('marker did not clear after hover');
    }
    if (a.p.errs.length) bad.push('page errors: ' + a.p.errs.slice(0, 2));
    await a.ctx.close();
    rec('I5_new_marker', !bad.length, bad.length ? bad : 'marked on acquire, cleared when seen');
  },
  async I6_coin_float(b) {
    const run = async reduced => {
      const a = await ctxOpen(b, {storage: {'yairpg.colors.v1': 'vivid'}, reduced}); await R.startFresh(a.p);
      await a.p.evaluate(() => { window.__floats = []; new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && n.matches('.coin-float')) { const r = n.getBoundingClientRect(); const purse = [...document.querySelectorAll('#inventory_div *')].find(e => e.children.length < 6 && /Your purse contains/.test(e.textContent) && e.offsetParent); const q = purse.getBoundingClientRect(); window.__floats.push({node: n, d: Math.hypot((r.left + r.width / 2) - (q.left + q.width / 2), (r.top + r.height / 2) - (q.top + q.height / 2)), dy: Math.abs((r.top + r.height / 2) - (q.top + q.height / 2)), text: n.textContent, anim: n.getAnimations().length}); } }).observe(document.body, {subtree: true, childList: true}); });
      await a.p.locator('#location_related_div button', {hasText: 'Buy repair notes'}).first().click(); await a.p.waitForTimeout(300);
      const seen = await a.p.evaluate(() => window.__floats.map(f => ({d: Math.round(f.d), dy: Math.round(f.dy), text: f.text, anim: f.anim})));
      await a.p.waitForTimeout(4000);
      const left = await a.p.evaluate(() => window.__floats.filter(f => f.node.isConnected).length);
      const errs = a.p.errs.slice(); await a.ctx.close(); return {seen, left, errs};
    };
    const full = await run(false), red = await run(true), bad = [];
    if (full.seen.length !== 1) bad.push(`expected exactly 1 coin float, saw ${full.seen.length}`);
    else { if (full.seen[0].dy > 60 || full.seen[0].d > 260) bad.push('float not anchored at purse line: ' + JSON.stringify(full.seen[0])); if (!/-|−/.test(full.seen[0].text)) bad.push('float text does not show a spend'); }
    if (full.left) bad.push('float not removed within 4s');
    if (red.seen.some(f => f.anim)) bad.push('reduced motion float animates');
    if (red.left) bad.push('reduced float not removed');
    if (full.errs.length || red.errs.length) bad.push('page errors');
    rec('I6_coin_float', !bad.length, bad.length ? bad : {full: full.seen, reduced: red.seen});
  },
  async I7_semantic_tokens(b) {
    const bad = [], out = {};
    for (const sc of ['standard', 'vivid']) {
      const a = await ctxOpen(b, {storage: {'yairpg.colors.v1': sc}}); await R.startFresh(a.p);
      const t = await a.p.evaluate(() => { const log = document.getElementById('message_box_div'); const surface = __c.bg(log); const o = {}; for (const k of ['gain', 'loss', 'money', 'blocked']) { const v = getComputedStyle(document.documentElement).getPropertyValue('--sem-' + k).trim(); const probe = document.createElement('span'); probe.style.color = v; log.append(probe); const c = __c.rgb(getComputedStyle(probe).color); probe.remove(); o[k] = {v, ratio: v && c ? +__c.ratio(c, surface).toFixed(2) : 0}; } return o; });
      for (const [k, x] of Object.entries(t)) if (!x.v || x.ratio < 4.5) bad.push(`${sc} --sem-${k} ${x.v || 'missing'} ${x.ratio}:1`);
      await a.p.locator('#location_related_div button', {hasText: 'Buy repair notes'}).first().click(); await a.p.waitForTimeout(800);
      const used = await a.p.evaluate(() => { const toks = ['gain', 'loss', 'money'].map(k => { const s = document.createElement('span'); s.style.color = getComputedStyle(document.documentElement).getPropertyValue('--sem-' + k); document.body.append(s); const c = getComputedStyle(s).color; s.remove(); return c; }); const lines = [...document.getElementById('message_box_div').querySelectorAll('*')].filter(e => /repair notes|coin/i.test(e.textContent) && e.children.length < 4); return lines.some(e => [e, ...e.querySelectorAll('*')].some(n => toks.includes(getComputedStyle(n).color))); });
      if (!used) bad.push(`${sc}: purchase log line uses no semantic token`);
      out[sc] = t; await a.ctx.close();
    }
    rec('I7_semantic_tokens', !bad.length, bad.length ? bad : out);
  },
  async I8_log_unread(b) {
    const bad = [];
    const a = await ctxOpen(b, {storage: {'yairpg.colors.v1': 'vivid'}}); await R.startFresh(a.p);
    // Harness constrains the log so it overflows deterministically.
    await a.p.evaluate(() => { const l = document.getElementById('message_box_div'); l.style.maxHeight = '60px'; l.style.height = '60px'; l.style.overflowY = 'auto'; l.scrollTop = 0; });
    const overflow = await a.p.evaluate(() => { const l = document.getElementById('message_box_div'); return l.scrollHeight > l.clientHeight + 10; });
    if (!overflow) { rec('I8_log_unread', false, 'harness: log does not overflow at 60px'); await a.ctx.close(); return; }
    await a.p.locator('#location_related_div button', {hasText: 'Buy repair notes'}).first().click(); await a.p.waitForTimeout(800);
    const st = await a.p.evaluate(() => document.getElementById('message_box_div').scrollTop);
    if (st > 2) bad.push(`log jumped while reading (scrollTop ${st})`);
    const pill = a.p.locator('[data-log-unread]');
    if (!(await pill.count()) || !(await pill.first().isVisible())) bad.push('no visible unread indicator');
    else {
      const txt = await pill.first().innerText(); if (!/\b1\b/.test(txt) || !/new/i.test(txt)) bad.push(`unread text "${txt}" lacks count`);
      await pill.first().click(); await a.p.waitForTimeout(500);
      const atBottom = await a.p.evaluate(() => { const l = document.getElementById('message_box_div'); return l.scrollHeight - l.scrollTop - l.clientHeight < 4; });
      if (!atBottom) bad.push('clicking unread did not scroll to newest');
      if (await pill.first().isVisible().catch(() => false)) bad.push('unread indicator still visible after jump');
    }
    // At bottom, new messages still follow.
    await a.p.evaluate(() => { const l = document.getElementById('message_box_div'); l.scrollTop = l.scrollHeight; });
    await a.p.locator('#location_related_div *', {hasText: /^Talk to someone$/}).first().click().catch(() => {});
    if (a.p.errs.length) bad.push('page errors: ' + a.p.errs.slice(0, 2));
    await a.ctx.close();
    rec('I8_log_unread', !bad.length, bad.length ? bad : 'no jump while reading; count; jump clears');
  },
  async I10_vitals_aligned(b) {
    const bad = [], info = {};
    for (const sc of ['standard', 'vivid']) {
      const a = await ctxOpen(b, {storage: {'yairpg.colors.v1': sc}}); await R.startFresh(a.p);
      const m = await a.p.evaluate(() => {
        const panel = document.getElementById('basic_character_info_div');
        const rows = ['xp', 'stamina', 'mana', 'health'].map(k => { const max = document.getElementById(k === 'health' ? 'character_healthbar_max' : `character_${k}_bar_max`) || document.getElementById(k === 'health' ? 'character_healthbar_current' : `character_${k}_bar_current`).parentElement; const val = document.getElementById(k === 'health' ? 'character_health_value' : `character_${k}_value`) || max.parentElement.querySelector('[id$=_value]'); const r = max.getBoundingClientRect(), v = val.getBoundingClientRect(); const track = __c.rgb(getComputedStyle(max).backgroundColor) || __c.bg(max); return {k, left: Math.round(r.left), right: Math.round(r.right), h: Math.round(r.height), font: getComputedStyle(val).fontSize, vc: Math.round(v.top + v.height / 2 - (r.top + r.height / 2)), vInside: v.left >= r.left - 1 && v.right <= r.right + 1, track: +__c.ratio(track, __c.bg(panel)).toFixed(2), text: val.textContent.trim()}; });
        const name = document.getElementById('character_name_field').getBoundingClientRect();
        const lvl = [...panel.querySelectorAll('*')].find(e => e.children.length === 0 && /\b(Lv|Lvl|Level)\.?\s*\d+/i.test(e.textContent) && e.offsetParent);
        return {rows, nameLeft: Math.round(name.left), nameRight: Math.round(name.right), level: lvl ? lvl.textContent.trim() : null, hscroll: panel.scrollWidth > panel.clientWidth + 1};
      });
      const r0 = m.rows[0];
      for (const r of m.rows) {
        if (r.left !== r0.left || r.right !== r0.right) bad.push(`${sc} ${r.k} bar edges ${r.left}-${r.right} vs ${r0.left}-${r0.right}`);
        if (r.h !== r0.h) bad.push(`${sc} ${r.k} height ${r.h} vs ${r0.h}`);
        if (r.font !== r0.font) bad.push(`${sc} ${r.k} value font ${r.font} vs ${r0.font}`);
        if (Math.abs(r.vc) > 1) bad.push(`${sc} ${r.k} value off-centre ${r.vc}px`);
        if (!r.vInside) bad.push(`${sc} ${r.k} value spills outside bar`);
        if (r.track < 1.5) bad.push(`${sc} ${r.k} empty track ${r.track}:1 vs panel (< 1.5:1, invisible)`);
      }
      if (sc === 'vivid') for (const r of m.rows) if (r.track < 3) bad.push(`vivid ${r.k} empty track ${r.track}:1 < 3:1`);
      if (m.nameLeft < r0.left - 1 || m.nameRight > r0.right + 1) bad.push(`${sc} name field outside bar edges`);
      if (Math.abs(m.nameLeft - r0.left) > 1 && Math.abs((m.nameLeft + m.nameRight) / 2 - (r0.left + r0.right) / 2) > 1) bad.push(`${sc} name neither left-aligned nor centred with bars`);
      if (!m.level) bad.push(`${sc} no visible level in vitals`);
      if (m.hscroll) bad.push(`${sc} vitals overflow horizontally`);
      info[sc] = {rows: m.rows.map(r => `${r.k}:${r.h}px/${r.font}/${r.track}`), level: m.level};
      if (a.p.errs.length) bad.push(`${sc} page errors`);
      await a.ctx.close();
    }
    rec('I10_vitals_aligned', !bad.length, bad.length ? bad : info);
  },
  async I9_desktop_viewports(b) {
    const bad = [];
    for (const [w, h] of [[1366, 768], [1440, 900], [1920, 1080]]) {
      const a = await ctxOpen(b, {w, h}); await R.startFresh(a.p);
      const hs = await a.p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      if (hs) bad.push(`${w}x${h} horizontal scroll`);
      const talk = await a.p.locator('#location_related_div', {hasText: 'Talk to someone'}).isVisible();
      if (!talk) bad.push(`${w}x${h} local actions not visible`);
      if (a.p.errs.length) bad.push(`${w}x${h} errors ${a.p.errs[0]}`);
      await a.p.screenshot({path: path.join(__dirname, '..', 'evidence', `vivid_${w}x${h}.png`)}).catch(() => {});
      await a.ctx.close();
    }
    rec('I9_desktop_viewports', !bad.length, bad.length ? bad : 'no h-scroll, actions visible at 3 desktop sizes');
  },
};

(async () => {
  let browser;
  try { browser = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}); }
  catch (e) { console.log('BROKEN chrome launch: ' + e.message); process.exit(3); }
  try { const r = await fetch(URL + 'index.html'); if (!r.ok) throw Error(r.status); }
  catch (e) { console.log('BROKEN server not reachable at ' + URL + ': ' + e.message); await browser.close(); process.exit(3); }
  fs.mkdirSync(path.join(__dirname, '..', 'evidence'), {recursive: true});
  for (const [id, fn] of Object.entries(checks)) {
    if (only && !id.startsWith(only)) continue;
    try { await fn(browser); } catch (e) { rec(id, false, 'threw: ' + String(e.message).split('\n')[0]); }
  }
  await browser.close();
  process.exit(results.every(r => r.ok) ? 0 : 1);
})();
