// Pocket histories gate (MZ2). READ-ONLY for workers. Exit 0 all pass, 1 fail, 3 broken.
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const WT = '/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg';
const URL = process.env.URL || 'http://127.0.0.1:18341/';
const results = []; const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
let R, W; try { R = await import(pathToFileURL(WT + '/src/start_records.js').href); W = await import(pathToFileURL(WT + '/src/data/start_layers_frontier.js').href); } catch (e) { console.log('FAIL P0_modules ' + e.message); process.exit(1); }
const world = W.frontierStartWorld; const HIDDEN = "Something from your past you can't place yet.";
// P1: data completeness, every item a layer adds has a non-empty pocket line
{ const missing = []; for (const [axis, layers] of Object.entries(world.layers)) for (const l of layers) for (const it of l.patch.items || []) { const line = l.patch.pockets?.[it.id]; if (!line || !String(line).trim()) missing.push(`${axis}/${l.id}/${it.id}`); }
  rec('P1_every_item_has_a_pocket_line', missing.length === 0, missing.length ? missing : 'all layers'); }
// P2: resolved pockets cover every (layer, item) pair and carry axis/layerId
{ const bad = []; for (let i = 0; i < 60; i++) { const r = R.resolveStart(world, {entry: {mode: 'lock', layerId: 'vanilla'}}, 's' + i); const P = r.snapshot.pockets || [];
    for (const l of r.layers) for (const it of l.patch.items || []) if (!P.find(p => p.axis === l.axis && p.layerId === l.id && p.itemId === it.id && p.line === l.patch.pockets[it.id])) bad.push(`s${i}:${l.axis}/${l.id}/${it.id}`); }
  rec('P2_resolved_pockets_complete', bad.length === 0, bad.slice(0, 5)); }
// P3: vanilla parity unchanged (money/items), pockets are data only
{ const r = R.resolveStart(world, {entry: {mode: 'lock', layerId: 'vanilla'}, background: {mode: 'lock', layerId: 'empty'}, possessions: {mode: 'lock', layerId: 'empty'}}, 'v');
  rec('P3_vanilla_parity', r.snapshot.money === 102 && JSON.stringify(r.snapshot.items.map(i => [i.id, i.count])) === JSON.stringify([['Cheap leather pants', 1], ['Stale bread', 5]]) && (r.snapshot.pockets || []).length === 2, {money: r.snapshot.money, pockets: r.snapshot.pockets}); }
// P4/P5: browser card shows pockets; hidden axis lines are masked
let chromium; try { ({chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); } catch { console.log('BROKEN playwright'); process.exit(3); }
const b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try {
  const ctx = await b.newContext({viewport: {width: 1366, height: 768}}); const p = await ctx.newPage(); p.setDefaultTimeout(15000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL + 'style.css'); await p.evaluate(() => localStorage.clear()); await p.goto(URL + '?start_probe=1', {waitUntil: 'domcontentloaded'});
  await p.locator('#loading_screen_play_button:not(.none_display)').click({timeout: 20000}); await p.locator('#hero_creation_panel_confirmation').waitFor({state: 'visible'});
  const roll = async seed => { await p.locator('input[data-start-seed]').fill(seed); await p.locator('button[data-start-roll-button]').click(); await p.waitForTimeout(150);
    return {res: JSON.parse(await p.locator('[data-start-card]').getAttribute('data-start-resolved')), text: await p.locator('[data-start-card]').innerText(), items: await p.locator('[data-start-card] [data-start-pockets] li').allInnerTexts()}; };
  const a = await roll('pocket-1'); const lines = world.layers.entry.find(l => l.id === 'vanilla').patch.pockets;
  rec('P4_card_lists_pockets', /In your pockets/i.test(a.text) && Object.values(lines).every(l => a.items.some(t => t.includes(l))) && errs.length === 0, {items: a.items, errs});
  await p.locator('[data-start-axis="possessions"] select[data-start-mode]').selectOption('unknown');
  let found = null; for (let i = 0; i < 40 && !found; i++) { const r = await roll('hide-' + i); const pl = r.res.provenance.layers.find(l => l.axis === 'possessions'); const layer = world.layers.possessions.find(l => l.id === pl?.id); if (layer?.patch.items?.length) found = {r, layer}; }
  if (!found) rec('P5_hidden_axis_masks_pockets', false, 'no seed picked an item-giving possessions layer in 40 tries');
  else { const own = Object.values(found.layer.patch.pockets || {}); rec('P5_hidden_axis_masks_pockets', own.every(l => !found.r.text.includes(l)) && found.r.items.some(t => t.includes(HIDDEN)), {layer: found.layer.id, items: found.r.items}); }
  await ctx.close();
} finally { await b.close(); }
process.exit(results.every(Boolean) ? 0 : 1);
