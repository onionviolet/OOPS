// Crafting-screen gate. READ-ONLY for workers (see ../GOAL.md).
// Prints "PASS|FAIL <item> <detail>" per item. Exit 0 all pass, 1 any fail, 3 broken tooling.
const fs = require('fs'), path = require('path');
let chromium;
try { ({chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
catch (e) { console.log('BROKEN playwright missing'); process.exit(3); }
const R = require('./routes.cjs');
const URL = process.env.URL || 'http://127.0.0.1:18291/';
const only = process.argv[2];
const results = [];
const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const READY = 'Processed rough wood', BLOCKED = 'Processed wood', INPUT = 'Rough wood log';
const HELP = `window.__c={rgb(s){const m=String(s).match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const v=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}},
lum(c){const f=x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b)},
ratio(a,b){const A=this.lum(a),B=this.lum(b);return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05)},
bg(e){for(let n=e;n&&n.nodeType===1;n=n.parentElement){const c=this.rgb(getComputedStyle(n).backgroundColor);if(c&&c.a>0.5)return c}return this.rgb(getComputedStyle(document.body).backgroundColor)},
vis(e){if(!e)return 'missing';const r=e.getBoundingClientRect();if(!r.width||!r.height)return 'empty';if(r.top<0||r.left<0||r.bottom>innerHeight+0.5||r.right>innerWidth+0.5)return 'outside viewport';
 for(let n=e.parentElement;n;n=n.parentElement){const s=getComputedStyle(n);if(/(auto|scroll|hidden|clip)/.test(s.overflowY+s.overflowX)){const q=n.getBoundingClientRect();if(r.top<q.top-0.5||r.bottom>q.bottom+0.5)return 'clipped by '+(n.id||n.className).toString().slice(0,30)}}
 for(const [x,y] of [[r.left+r.width/2,r.top+r.height/2],[r.left+2,r.top+2],[r.right-2,r.bottom-2]]){const t=document.elementFromPoint(x,y);if(!t||!(t===e||e.contains(t)))return 'covered by '+((t&&(t.id||t.className||t.tagName))+'').slice(0,30)}return 'ok'}};`;

async function open(b, {w = 1366, h = 768, storage = {}} = {}) {
  const ctx = await b.newContext({viewport: {width: w, height: h}});
  await ctx.addInitScript(HELP);
  const p = await ctx.newPage(); p.setDefaultTimeout(12000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  await R.loadSave(p, R.readFixture('craft_ready.save.txt'), storage);
  await R.openCrafting(p, 'woodworking');
  return {ctx, p};
}
const count = (p, name) => p.evaluate(n => { let total = 0; for (const e of document.querySelectorAll('#inventory_div .inventory_item_name')) { const m = e.textContent.replace(/\s+/g, ' ').trim().match(/^(.*?)(?: x(\d+))?$/); if (m && m[1].replace(/^star_border\s*|^star\s*/, '').replace(/^\[[^\]]*\]\s*/, '').trim() === n) total += m[2] ? +m[2] : 1; } return total; }, name);
const row = (p, name) => p.locator(`.crafting_recipe_list:visible .recipe_div[data-recipe_id="${name}"]`).first();
const detail = p => p.locator('[data-craft-detail]');
const commit = p => p.locator('[data-craft-detail] [data-craft-commit]');
async function select(p, name) { const r = row(p, name); await r.scrollIntoViewIfNeeded(); await r.click(); await p.waitForTimeout(300); return r; }

const checks = {
  async C1_detail_beside_list(b) {
    const {ctx, p} = await open(b); const bad = [];
    const before = await count(p, INPUT);
    await select(p, READY);
    if (await count(p, INPUT) !== before) bad.push('selecting a row crafted (must only select)');
    if (!(await detail(p).count())) bad.push('no [data-craft-detail]');
    else {
      const d = await p.evaluate(() => { const det = document.querySelector('[data-craft-detail]'), list = document.querySelector('.crafting_recipe_list:not([style*="display: none"])') || document.querySelector('#recipe_categories'); const a = det.getBoundingClientRect(), l = [...document.querySelectorAll('.crafting_recipe_list')].find(x => x.offsetParent)?.getBoundingClientRect(); return {title: det.querySelector('[data-craft-title]')?.textContent.trim(), reqs: [...det.querySelectorAll('[data-craft-req]')].map(e => e.textContent.replace(/\s+/g, ' ').trim()), output: det.querySelector('[data-craft-output]')?.textContent.trim(), chance: det.querySelector('[data-craft-chance]')?.textContent.trim(), station: det.querySelector('[data-craft-station]')?.textContent.trim(), xp: det.querySelector('[data-craft-xp]')?.textContent.trim(), beside: l ? (a.left >= l.right - 2 && a.top < l.bottom && a.bottom > l.top) : false, selected: document.querySelector('.recipe_div[aria-selected=true]')?.textContent.includes('Processed rough wood')}; });
      if (!d.title || !d.title.includes(READY)) bad.push('detail title missing recipe name');
      if (!d.reqs.length || !d.reqs.some(t => t.includes(INPUT) && /\d+\s*\/\s*\d+/.test(t))) bad.push('requirement rows lack "<item> have/need": ' + JSON.stringify(d.reqs));
      if (!d.output || !/Processed rough wood/.test(d.output)) bad.push('output line missing');
      if (!d.chance || !/\d+\s*%/.test(d.chance)) bad.push('success chance missing');
      if (!d.station) bad.push('station line missing');
      if (!d.xp || !/\d/.test(d.xp)) bad.push('xp line missing');
      if (!d.beside) bad.push('detail not beside the list');
      if (!d.selected) bad.push('row not marked aria-selected');
    }
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('C1_detail_beside_list', !bad.length, bad.length ? bad : 'select-only click, full detail beside list');
  },
  async C2_one_owner_blocked(b) {
    const {ctx, p} = await open(b); const bad = [];
    // Every visible row: row state == commit state.
    const n = await p.locator('.crafting_recipe_list:visible .recipe_div').count(); const mism = [];
    for (let i = 0; i < n; i++) {
      const r = p.locator('.crafting_recipe_list:visible .recipe_div').nth(i); await r.scrollIntoViewIfNeeded(); await r.click(); await p.waitForTimeout(150);
      const s = await p.evaluate(i => { const row = [...document.querySelectorAll('.crafting_recipe_list .recipe_div')].filter(x => x.offsetParent)[i]; const c = document.querySelector('[data-craft-detail] [data-craft-commit]'); return {name: row.querySelector('.recipe_item_name, .recipe_name')?.textContent.trim(), rowBlocked: row.classList.contains('recipe_unavailable'), commitBlocked: !c || c.getAttribute('aria-disabled') === 'true' || c.disabled}; }, i);
      if (s.rowBlocked !== s.commitBlocked) mism.push(s.name);
    }
    if (mism.length) bad.push('row vs commit disagree: ' + mism.slice(0, 5));
    // Makeable filter shows exactly the commit-enabled rows.
    await select(p, BLOCKED);
    const blk = await p.evaluate(() => { const c = document.querySelector('[data-craft-detail] [data-craft-commit]'); const reason = document.querySelector('[data-craft-detail] [data-craft-blocked-reason]'); const miss = [...document.querySelectorAll('[data-craft-detail] [data-craft-req][data-missing]')]; const tok = (() => { const s = document.createElement('span'); s.style.color = getComputedStyle(document.documentElement).getPropertyValue('--sem-blocked'); document.body.append(s); const c = getComputedStyle(s).color; s.remove(); return c; })(); return {aria: c?.getAttribute('aria-disabled'), disabledAttr: c?.disabled, reason: reason && reason.offsetParent ? reason.textContent.trim() : '', missing: miss.length, missingColored: miss.some(m => [m, ...m.querySelectorAll('*')].some(x => getComputedStyle(x).color === tok)), missingWord: miss.some(m => /need|missing|more/i.test(m.textContent))}; });
    if (blk.aria !== 'true') bad.push('blocked commit lacks aria-disabled=true');
    if (blk.disabledAttr) bad.push('blocked commit uses disabled attr (must stay focusable/clickable to explain)');
    if (!blk.reason) bad.push('no visible blocked reason');
    if (!blk.missing) bad.push('no requirement marked data-missing');
    if (!blk.missingColored) bad.push('missing requirement not in --sem-blocked');
    if (!blk.missingWord) bad.push('missing requirement lacks a word (need/missing/more)');
    const inv = await count(p, INPUT); const logBefore = await p.evaluate(() => document.getElementById('message_box_div').textContent.length);
    await commit(p).click({force: true}); await p.waitForTimeout(400);
    const after = await p.evaluate(() => ({focusMissing: !!document.activeElement?.closest('[data-missing]')}));
    if (!after.focusMissing) bad.push('clicking blocked commit did not focus the first missing requirement');
    if (await count(p, INPUT) !== inv) bad.push('blocked commit changed inventory');
    const filt = p.locator('#crafting_makeable_filter');
    if (await filt.count()) { await filt.click(); await p.waitForTimeout(300); const shown = await p.evaluate(() => [...document.querySelectorAll('.crafting_recipe_list .recipe_div')].filter(x => x.offsetParent).map(x => x.querySelector('.recipe_item_name, .recipe_name')?.textContent.trim())); if (!(shown.length === 1 && shown[0] === 'Processed rough wood')) bad.push('makeable filter disagrees: ' + JSON.stringify(shown)); }
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('C2_one_owner_blocked', !bad.length, bad.length ? bad : 'rows, commit, filter agree; blocked explains and focuses');
  },
  async C3_unknown_placeholder(b) {
    const {ctx, p} = await open(b); const bad = [];
    await select(p, BLOCKED); await row(p, BLOCKED).hover(); await p.waitForTimeout(300);
    const t = await p.evaluate(() => { const w = document.getElementById('crafting_window'); const labels = [...w.querySelectorAll('*')].map(e => (e.getAttribute('title') || '') + (e.getAttribute('aria-label') || '')).join('|'); const tips = [...document.querySelectorAll('.recipe_tooltip')].map(e => e.textContent).join('|'); const unk = [...document.querySelectorAll('[data-craft-detail] [data-craft-req][data-unknown]')]; return {text: w.innerText + '|' + labels + '|' + tips, unknownRows: unk.map(e => e.textContent.trim())}; });
    if (/Unknown raw wood|raw wood/i.test(t.text)) bad.push('undiscovered ingredient name/type leaks ("raw wood")');
    if (!t.unknownRows.length) bad.push('no [data-unknown] placeholder requirement row');
    else if (t.unknownRows.some(x => /wood|log|ore|herb|meat/i.test(x))) bad.push('placeholder leaks a material type: ' + t.unknownRows);
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('C3_unknown_placeholder', !bad.length, bad.length ? bad : t.unknownRows);
  },
  async C4_receipt_truth(b) {
    const {ctx, p} = await open(b); const bad = []; const info = {};
    await select(p, READY);
    const in0 = await count(p, INPUT), out0 = await count(p, READY);
    await commit(p).click(); await p.waitForTimeout(1200);
    const in1 = await count(p, INPUT), out1 = await count(p, READY); info.used = in0 - in1; info.made = out1 - out0;
    if (info.used <= 0) bad.push('commit consumed nothing (did it craft?)');
    const rc = await p.evaluate(() => { const r = document.querySelector('[data-craft-detail] [data-craft-receipt]'); const fx = [...document.querySelectorAll('.work-ledger-effect')].map(e => e.textContent).join('|'); return {receipt: r && r.offsetParent ? r.textContent.replace(/\s+/g, ' ').trim() : '', fx}; });
    info.receipt = rc.receipt;
    if (!rc.receipt) bad.push('no visible [data-craft-receipt] in detail');
    else if (info.made > 0 && !(new RegExp('\\b' + info.made + '\\b').test(rc.receipt) && /Processed rough wood/.test(rc.receipt))) bad.push(`receipt doesn't state the ${info.made} made`);
    else if (info.made === 0 && !/fail|nothing|no output|didn/i.test(rc.receipt)) bad.push('receipt hides a failed craft');
    if (info.made > 0 && /no output|0\/\d+ attempts succeeded/i.test(rc.fx)) bad.push('overlay contradicts output: ' + rc.fx.slice(0, 80));
    if (rc.receipt && !new RegExp(String(info.used)).test(rc.receipt)) bad.push('receipt omits what was used');
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('C4_receipt_truth', !bad.length, bad.length ? bad : info);
  },
  async C5_selection_persists(b) {
    const {ctx, p} = await open(b); const bad = [];
    await select(p, READY);
    const st0 = await p.evaluate(() => [...document.querySelectorAll('.crafting_recipe_list')].find(x => x.offsetParent)?.scrollTop ?? -1);
    await commit(p).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
    const s = await p.evaluate(() => ({sel: document.querySelector('.recipe_div[aria-selected=true]')?.textContent.includes('Processed rough wood'), title: document.querySelector('[data-craft-detail] [data-craft-title]')?.textContent, focusIn: !!document.activeElement?.closest('#crafting_window'), st: [...document.querySelectorAll('.crafting_recipe_list')].find(x => x.offsetParent)?.scrollTop ?? -1}));
    if (!s.sel) bad.push('selection lost after craft');
    if (!s.title || !s.title.includes('Processed rough wood')) bad.push('detail changed recipe after craft');
    if (!s.focusIn) bad.push('focus left the crafting window');
    if (Math.abs(s.st - st0) > 2) bad.push(`list scroll moved ${st0}->${s.st}`);
    await ctx.close(); rec('C5_selection_persists', !bad.length, bad.length ? bad : 'selection, detail, focus and scroll kept');
  },
  async C6_keyboard(b) {
    const {ctx, p} = await open(b); const bad = [];
    const rows = p.locator('.crafting_recipe_list:visible .recipe_div');
    const ti = await rows.first().getAttribute('tabindex');
    if (ti === null) bad.push('rows not focusable');
    await rows.first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const first = await p.evaluate(() => document.querySelector('.recipe_div[aria-selected=true]')?.dataset.recipe_id);
    await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200);
    const second = await p.evaluate(() => ({sel: document.querySelector('.recipe_div[aria-selected=true]')?.dataset.recipe_id, focus: document.activeElement?.closest('.recipe_div')?.dataset.recipe_id}));
    if (!first) bad.push('Enter on a row does not select');
    if (!second.sel || second.sel === first) bad.push('ArrowDown does not move selection');
    if (second.focus !== second.sel) bad.push('focus and selection diverge');
    // Reach the ready recipe by keyboard and craft with Enter on commit.
    await row(p, READY).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const in0 = await count(p, INPUT); await commit(p).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
    if (await count(p, INPUT) >= in0) bad.push('Enter on commit did not craft');
    await ctx.close(); rec('C6_keyboard', !bad.length, bad.length ? bad : 'focusable rows, Enter selects, arrows move, Enter crafts');
  },
  async C7_fit(b) {
    const bad = [];
    for (const [w, h] of [[1366, 768], [1440, 900], [1920, 1080]]) {
      const {ctx, p} = await open(b, {w, h}); await select(p, READY);
      const v = await p.evaluate(() => ({detail: __c.vis(document.querySelector('[data-craft-detail]')), commit: __c.vis(document.querySelector('[data-craft-detail] [data-craft-commit]')), exit: __c.vis(document.getElementById('exit_crafting_button')), hs: document.documentElement.scrollWidth > innerWidth, vs: document.documentElement.scrollHeight > innerHeight + 1}));
      for (const k of ['detail', 'commit', 'exit']) if (v[k] !== 'ok') bad.push(`${w}x${h} ${k}: ${v[k]}`);
      if (v.hs) bad.push(`${w}x${h} horizontal page scroll`); if (v.vs) bad.push(`${w}x${h} vertical page scroll`);
      await row(p, BLOCKED).hover(); await p.waitForTimeout(300);
      const cov = await p.evaluate(() => __c.vis(document.querySelector('[data-craft-detail] [data-craft-commit]')));
      if (cov !== 'ok') bad.push(`${w}x${h} hover covers commit: ${cov}`);
      await p.screenshot({path: path.join(__dirname, '..', 'evidence', `craft_${w}x${h}.png`)}).catch(() => {});
      await ctx.close();
    }
    rec('C7_fit', !bad.length, bad.length ? bad : 'detail, commit, exit fully visible at 3 desktop sizes; no page scroll');
  },
  async C8_detail_setting(b) {
    const bad = [];
    const a = await open(b); await select(a.p, READY);
    const sel = a.p.locator('select[data-workspace-action=craft-detail]');
    if (!(await sel.count())) { bad.push('no Layout select [data-workspace-action=craft-detail]'); await a.ctx.close(); rec('C8_detail_setting', false, bad); return; }
    await a.p.locator('.workspace-layout-menu > summary').click(); await sel.selectOption('below'); await a.p.locator('.workspace-layout-menu > summary').click(); await a.p.waitForTimeout(300);
    const below = await a.p.evaluate(() => { const d = document.querySelector('[data-craft-detail]').getBoundingClientRect(), l = [...document.querySelectorAll('.crafting_recipe_list')].find(x => x.offsetParent).getBoundingClientRect(); return d.top >= l.bottom - 2; });
    if (!below) bad.push('below option does not place detail under list');
    const stored = await a.p.evaluate(() => Object.entries(localStorage).filter(([k, v]) => /craft/i.test(k) && /below/.test(v)).length);
    if (!stored) bad.push('choice not stored per browser');
    const vis = await a.p.evaluate(() => __c.vis(document.querySelector('[data-craft-detail] [data-craft-commit]')));
    if (vis !== 'ok') bad.push('below layout hides commit: ' + vis);
    await a.ctx.close();
    rec('C8_detail_setting', !bad.length, bad.length ? bad : 'beside/below setting works and persists');
  },
  async C9_readable(b) {
    const {ctx, p} = await open(b); const bad = [];
    await select(p, READY); if (!(await detail(p).count())) { await ctx.close(); rec('C9_readable', false, 'no [data-craft-detail] to measure'); return; }
    for (const name of [READY, BLOCKED]) {
      await select(p, name);
      const low = await p.evaluate(() => [...document.querySelectorAll('[data-craft-detail] *')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && e.offsetParent).map(e => ({t: e.textContent.trim().slice(0, 24), r: +__c.ratio(__c.rgb(getComputedStyle(e).color), __c.bg(e)).toFixed(2)})).filter(x => x.r < 4.5));
      if (low.length) bad.push(`${name}: ` + JSON.stringify(low.slice(0, 4)));
    }
    await ctx.close(); rec('C9_readable', !bad.length, bad.length ? bad : 'all detail text >= 4.5:1 on its own background');
  },
};

(async () => {
  let b; try { b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}); } catch (e) { console.log('BROKEN chrome'); process.exit(3); }
  try { const r = await fetch(URL + 'index.html'); if (!r.ok) throw 0; } catch { console.log('BROKEN server ' + URL); await b.close(); process.exit(3); }
  fs.mkdirSync(path.join(__dirname, '..', 'evidence'), {recursive: true});
  for (const [id, fn] of Object.entries(checks)) { if (only && !id.startsWith(only)) continue; try { await fn(b); } catch (e) { rec(id, false, 'threw: ' + String(e.message).split('\n')[0]); } }
  await b.close(); process.exit(results.every(Boolean) ? 0 : 1);
})();
