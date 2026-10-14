// Start-records gate. READ-ONLY for workers (see ../GOAL.md).
// Prints "PASS|FAIL <item> <detail>". Exit 0 all pass, 1 any fail, 3 broken tooling.
let chromium;
try { ({chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
catch { console.log('BROKEN playwright'); process.exit(3); }
const fs = require('fs'), path = require('path');
const URL = process.env.URL || 'http://127.0.0.1:18341/';
const EVID = path.join(__dirname, '..', 'evidence'); fs.mkdirSync(EVID, {recursive: true});
const only = process.argv[2]; const results = [];
const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const SIZES = [[1366, 768], [1440, 900], [1920, 1080]];

async function open(b, {probe = false, size = [1366, 768]} = {}) {
  const ctx = await b.newContext({viewport: {width: size[0], height: size[1]}});
  const p = await ctx.newPage(); p.setDefaultTimeout(15000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  await p.goto(URL + 'style.css'); await p.evaluate(() => localStorage.clear());
  await p.goto(URL + (probe ? '?start_probe=1' : ''), {waitUntil: 'domcontentloaded'});
  await p.locator('#loading_screen_play_button:not(.none_display)').click({timeout: 20000});
  await p.locator('#hero_creation_panel_confirmation').waitFor({state: 'visible'});
  return {ctx, p};
}
async function confirmAndEnter(p) {
  await p.locator('#hero_creation_panel_confirmation').click();
  await p.locator('#location_actions_div .location_choice_dropdown').first().waitFor({state: 'visible', timeout: 20000});
}
async function save(p) {
  await p.evaluate(() => localStorage.removeItem('save data'));
  await p.locator('#save_button').click();
  await p.waitForFunction(() => !!localStorage.getItem('save data'), null, {timeout: 10000});
  return p.evaluate(() => localStorage.getItem('save data'));
}
const parse = raw => { try { return JSON.parse(raw); } catch { try { return JSON.parse(Buffer.from(raw, 'base64').toString()); } catch { return null; } } };
const invCount = (s, name) => { const inv = s?.inventories?.person?.main_character || {}; let n = 0; for (const [k, v] of Object.entries(inv)) if (k.includes(name)) n += (v?.count ?? 1); return n; };
const card = async p => JSON.parse(await p.locator('[data-start-card]').getAttribute('data-start-resolved'));
async function roll(p, seed, modes = {}) {
  for (const [axis, mode] of Object.entries(modes)) await p.locator(`[data-start-axis="${axis}"] select[data-start-mode]`).selectOption(mode);
  await p.locator('input[data-start-seed]').fill(seed);
  await p.locator('button[data-start-roll-button]').click(); await p.waitForTimeout(200);
  return {resolved: await card(p), text: (await p.locator('[data-start-card]').innerText()).trim()};
}

const checks = {
  async G1_no_probe_unchanged(b) {
    const {ctx, p} = await open(b);
    const n = await p.locator('[data-start-roll]').count();
    await confirmAndEnter(p); const s = parse(await save(p));
    const ok = n === 0 && s?.character?.money === 102 && invCount(s, 'Stale bread') === 5 && p.errs.length === 0;
    rec('G1_no_probe_unchanged', ok, {rollPanels: n, money: s?.character?.money, bread: invCount(s, 'Stale bread'), errs: p.errs.slice(0, 2)}); await ctx.close();
  },
  async G2_panel_visible_wide(b) {
    const bad = [];
    for (const size of SIZES) {
      const {ctx, p} = await open(b, {probe: true, size});
      const panel = p.locator('[data-start-roll]');
      if (!(await panel.count())) { bad.push(`${size} missing`); await ctx.close(); continue; }
      const axes = await p.locator('[data-start-axis]').count();
      await p.locator('button[data-start-roll-button]').scrollIntoViewIfNeeded();
      const btn = await p.locator('button[data-start-roll-button]').boundingBox();
      const cardBox = await p.locator('[data-start-card]').boundingBox();
      const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (axes < 3) bad.push(`${size} axes=${axes}`);
      if (!btn || !cardBox) bad.push(`${size} roll/card not rendered`);
      if (over) bad.push(`${size} horizontal overflow`);
      await p.screenshot({path: path.join(EVID, `start_probe_${size[0]}x${size[1]}.png`)});
      await ctx.close();
    }
    rec('G2_panel_visible_wide', bad.length === 0, bad.join('; ') || '3 sizes');
  },
  async G3_seed_deterministic(b) {
    const {ctx, p} = await open(b, {probe: true});
    const a = await roll(p, 'alpha'), a2 = await roll(p, 'alpha');
    const seen = new Set(); for (const s of ['s1', 's2', 's3', 's4', 's5', 's6']) seen.add(JSON.stringify((await roll(p, s)).resolved.provenance?.layers));
    rec('G3_seed_deterministic', a.text === a2.text && seen.size >= 2, {same: a.text === a2.text, distinct: seen.size}); await ctx.close();
  },
  async G4_lock_and_unknown(b) {
    const {ctx, p} = await open(b, {probe: true});
    const axis = await p.locator('[data-start-axis]').nth(1).getAttribute('data-start-axis');
    const layerSel = p.locator(`[data-start-axis="${axis}"] select[data-start-layer]`);
    const opts = await layerSel.locator('option').evaluateAll(os => os.map(o => o.value).filter(Boolean));
    const target = opts[opts.length - 1];
    await layerSel.selectOption(target);
    const lockedIds = new Set(); for (const s of ['a', 'b', 'c', 'd']) { const r = await roll(p, s, {[axis]: 'lock'}); lockedIds.add((r.resolved.provenance.layers.find(l => l.axis === axis) || {}).id); }
    const u = await roll(p, 'u1', {[axis]: 'unknown'});
    const hiddenShown = /not yet known/i.test(u.text);
    const stillResolved = !!u.resolved.provenance.layers.find(l => l.axis === axis);
    rec('G4_lock_and_unknown', lockedIds.size === 1 && lockedIds.has(target) && hiddenShown && stillResolved, {axis, target, locked: [...lockedIds], hiddenShown, stillResolved}); await ctx.close();
  },
  async G5_begin_applies(b) {
    const {ctx, p} = await open(b, {probe: true});
    let r, seed;
    for (const s of ['g5a', 'g5b', 'g5c', 'g5d', 'g5e', 'g5f', 'g5g', 'g5h']) { r = await roll(p, s); seed = s; if (r.resolved.money !== 102) break; }
    await p.locator('input[data-start-use]').check(); await confirmAndEnter(p);
    const raw = await save(p); const s = parse(raw);
    const ok = s?.character?.money === r.resolved.money && raw.includes(seed) && p.errs.length === 0;
    rec('G5_begin_applies', ok, {expected: r.resolved.money, money: s?.character?.money, seedInSave: raw.includes(seed), errs: p.errs.slice(0, 2)});
    fs.writeFileSync(path.join(EVID, 'g5_save.txt'), raw); fs.writeFileSync(path.join(EVID, 'g5_expected.json'), JSON.stringify({seed, ...r.resolved}));
    await ctx.close();
  },
  async G6_reload_and_import(b) {
    const f = path.join(EVID, 'g5_save.txt'), e = path.join(EVID, 'g5_expected.json');
    if (!fs.existsSync(f)) return rec('G6_reload_and_import', false, 'needs G5 first');
    const raw = fs.readFileSync(f, 'utf8'), exp = JSON.parse(fs.readFileSync(e, 'utf8'));
    const name = it => it.item_id || it.id || it.name;
    const want = {}; for (const it of exp.items || []) want[name(it)] = (want[name(it)] || 0) + (it.count ?? 1);
    const matches = s => s?.character?.money === exp.money && Object.entries(want).every(([n, c]) => invCount(s, n) === c);
    const page = async () => { const ctx = await b.newContext({viewport: {width: 1366, height: 768}, acceptDownloads: true}); const p = await ctx.newPage(); p.setDefaultTimeout(20000); p.errs = []; p.on('pageerror', x => p.errs.push(x.message)); return {ctx, p}; };
    const enter = async p => { await p.locator('#loading_screen_play_button:not(.none_display)').click({timeout: 20000}); await p.locator('#location_actions_div .location_choice_dropdown').first().waitFor({state: 'visible', timeout: 20000}); };
    // reload: the saved composed start survives a reload
    const A = await page();
    await A.p.goto(URL + 'style.css'); await A.p.evaluate(r => { localStorage.clear(); localStorage.setItem('save data', r); }, raw);
    await A.p.goto(URL, {waitUntil: 'domcontentloaded'}); await enter(A.p);
    const s1raw = await save(A.p), s1 = parse(s1raw);
    const reloadOk = matches(s1) && s1raw.includes(exp.seed);
    // export through the real Export button
    const dl = A.p.waitForEvent('download', {timeout: 15000});
    await A.p.locator('#save_to_file_button').click();
    const file = path.join(EVID, 'g6_export.txt'); await (await dl).saveAs(file);
    const errsA = A.p.errs.slice(); await A.ctx.close();
    // import on a fresh origin through the real file input
    const B = await page();
    await B.p.goto(URL + 'style.css'); await B.p.evaluate(() => localStorage.clear());
    await B.p.goto(URL, {waitUntil: 'domcontentloaded'});
    await B.p.locator('#loading_screen_play_button:not(.none_display)').click({timeout: 20000});
    await B.p.locator('#hero_creation_panel_confirmation').click();
    await B.p.locator('#location_actions_div .location_choice_dropdown').first().waitFor({state: 'visible', timeout: 20000});
    const nav = B.p.waitForNavigation({timeout: 20000}).catch(() => null);
    await B.p.locator('#saved_file_input').setInputFiles(file); await nav;
    await enter(B.p);
    const s2raw = await save(B.p), s2 = parse(s2raw);
    const importOk = matches(s2) && s2raw.includes(exp.seed);
    rec('G6_reload_and_import', reloadOk && importOk && errsA.length === 0 && B.p.errs.length === 0,
      {reloadOk, importOk, want, money: [s1?.character?.money, s2?.character?.money], errs: [...errsA, ...B.p.errs].slice(0, 2)});
    await B.ctx.close();
  },
  async G7_vanilla_parity_with_probe(b) {
    const {ctx, p} = await open(b, {probe: true});
    await roll(p, 'any');
    await confirmAndEnter(p); const s = parse(await save(p));
    const ok = s?.character?.money === 102 && invCount(s, 'Stale bread') === 5 && invCount(s, 'Cheap leather pants') >= 1;
    rec('G7_vanilla_parity_with_probe', ok, {money: s?.character?.money, bread: invCount(s, 'Stale bread')}); await ctx.close();
  },
};

(async () => {
  let b; try { b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}); } catch (e) { console.log('BROKEN chromium ' + e.message); process.exit(3); }
  for (const [id, fn] of Object.entries(checks)) { if (only && !id.startsWith(only)) continue; try { await fn(b); } catch (e) { rec(id, false, 'threw ' + String(e.message).slice(0, 180)); } }
  await b.close(); process.exit(results.every(Boolean) ? 0 : 1);
})();
