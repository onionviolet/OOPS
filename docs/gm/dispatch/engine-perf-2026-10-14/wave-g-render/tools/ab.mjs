// Interleaved A/B for the wave-g render lane: per-tick inclusive time in owned modules,
// DOM churn per owned container, and panel text dumps at fixed dev-stepped ticks.
// Usage: node ab.mjs --base <rev> [--fixtures developed,crowded] [--reps 2] [--ticks 20] [--nobuild] [--only head|base]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {SourceMap} from 'node:module';
import {prepareTree, build, serve, launchChrome, openGame, FIXTURE_DIR} from '../../../../../../scripts/perf/lib.mjs';

// Scratch dir for trees/, ab-out/ and developed.json (copy of a systems workshop natural-final-save.json).
const S = process.env.WG_SCRATCH || path.join(os.tmpdir(), 'wave-g-render');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i < 0 ? d : (process.argv[i + 1]?.startsWith('--') || process.argv[i + 1] === undefined ? true : process.argv[i + 1]); };
const BASE = arg('base', '7504a1e4'), REPS = +arg('reps', 2), TICKS = +arg('ticks', 20), ONLY = arg('only', null);
const FIX = String(arg('fixtures', 'developed,crowded')).split(',');
const fixturePath = n => n === 'developed' ? path.join(S, 'developed.json') : path.join(FIXTURE_DIR, n + '.json');
const OUT = path.join(S, 'ab-out', String(arg('label', 'run')));
fs.mkdirSync(OUT, {recursive: true});
const trees = {base: path.join(S, 'trees/base'), head: path.join(S, 'trees/head'), headA: path.join(S, 'trees/headA')};
const VARIANTS = String(arg('variants', 'base,head')).split(',');
import {execFileSync} from 'node:child_process';
if (!arg('nobuild', false)) {
  for (const [k, rev] of [['base', BASE], ['head', 'WORKTREE'], ['headA', 'WORKTREE']]) { if (!VARIANTS.includes(k)) continue; if (k === 'base' && arg('reuse-base', false)) continue; prepareTree(rev, trees[k]); if (k === 'headA') execFileSync('patch', ['-p1', '-i', path.join(path.dirname(new URL(import.meta.url).pathname), '../lane-a-structured.patch')], {cwd: trees[k], stdio: 'inherit'}); await build(trees[k]); console.error('built', k); }
}
const OWN = ['expedition_ui.js', 'village_ui.js', 'chronicle_ui.js', 'work_ledger_ui.js', 'structured_pack_ui.js'];
// display.js function line ranges per tree (1-based, inclusive).
const ranges = dir => {
  const lines = fs.readFileSync(path.join(dir, 'src/display.js'), 'utf8').split('\n');
  const find = name => { const a = lines.findIndex(l => l.startsWith(`function ${name}(`)); let b = a + 1; while (b < lines.length && lines[b] !== '}') b++; return [a + 1, b + 1]; };
  const r = {inventory: find('update_displayed_character_inventory'), itemlog: find('update_displayed_item_log')};
  // helpers owned by this lane, if the head adds any (named display_owned_*)
  lines.forEach((l, i) => { const m = l.match(/^function (owned_\w+)\(/); if (m) { let b = i + 1; while (b < lines.length && lines[b] !== '}') b++; r[m[1]] = [i + 1, b + 1]; } });
  return r;
};
const sms = {};
const bucketOf = (variant, frame) => {
  if (!frame.url.includes('bundle.js')) return null;
  const e = sms[variant].sm.findEntry(frame.lineNumber, frame.columnNumber);
  if (!e?.originalSource) return null;
  const file = e.originalSource.split('/').pop();
  if (OWN.includes(file)) return file.replace('.js', '');
  if (file === 'display.js') { const line = e.originalLine + 1; for (const [k, [a, b]] of Object.entries(sms[variant].ranges)) if (line >= a && line <= b) return k.startsWith('owned_') ? 'display_owned' : k; }
  return null;
};
const attribute = (variant, prof) => {
  const dt = {}; prof.samples.forEach((s, i) => dt[s] = (dt[s] || 0) + (prof.timeDeltas[i] || 0));
  const parent = new Map(); for (const n of prof.nodes) for (const c of n.children || []) parent.set(c, n.id);
  const byId = new Map(prof.nodes.map(n => [n.id, n]));
  const bucketCache = new Map(); const bk = id => { if (!bucketCache.has(id)) bucketCache.set(id, bucketOf(variant, byId.get(id).callFrame)); return bucketCache.get(id); };
  const out = {}; let mine = 0, busy = 0;
  for (const n of prof.nodes) {
    const t = dt[n.id] || 0; if (!t) continue;
    const name = n.callFrame.functionName; if (name !== '(idle)' && name !== '(program)') busy += t;
    const seen = new Set(); let p = n.id; while (p !== undefined) { const b = bk(p); if (b) seen.add(b); p = parent.get(p); }
    for (const b of seen) out[b] = (out[b] || 0) + t; if (seen.size) mine += t;
  }
  return {mineMs: mine / 1000, busyMs: busy / 1000, byModule: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, +(v / 1000).toFixed(1)]))};
};
const CONTAINERS = {expedition: '#expedition_panel', village: '#village_panel', chronicle: '#chronicle_panel', work_ledger: '#work_ledger_panel', structured: '#structured_pack_panel', inventory: '#inventory_content_div', itemlog: '#data_tab_item_log_div'};
const servers = {};
for (const k of VARIANTS) { servers[k] = await serve(trees[k]); const map = JSON.parse(fs.readFileSync(path.join(trees[k], 'dist/bundle.js.map'), 'utf8')); sms[k] = {sm: new SourceMap(map), ranges: ranges(trees[k])}; }
const browser = await launchChrome();
const results = [];
try {
  for (let rep = 0; rep < REPS; rep++) for (const fx of FIX) {
    const order = rep % 2 ? [...VARIANTS].reverse() : VARIANTS;
    for (const variant of order) {
      const load0 = os.loadavg()[0];
      const {context, page, errors} = await openGame(browser, servers[variant].url + '?test_hooks=1', fs.readFileSync(fixturePath(fx), 'utf8'));
      await page.waitForTimeout(3000);
      await page.evaluate(C => {
        simulationTestHooks.pause();
        for (const sel of Object.values(C)) { const el = document.querySelector(sel); if (el?.tagName === 'DETAILS') el.open = true; }
        window.__churn = {}; const keyOf = node => { for (const [k, s] of Object.entries(C)) if (node.closest?.(s)) return k; return null; };
        new MutationObserver(recs => { for (const r of recs) { const t = r.target.nodeType === 1 ? r.target : r.target.parentElement; const k = t && keyOf(t); if (!k) continue; const c = window.__churn[k] ||= {added: 0, removed: 0, text: 0, attr: 0};
          if (r.type === 'childList') { c.added += r.addedNodes.length; c.removed += r.removedNodes.length; } else if (r.type === 'characterData') c.text++; else c.attr++; } })
          .observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true});
      }, CONTAINERS);
      const dump = () => page.evaluate(C => Object.fromEntries(Object.entries(C).map(([k, s]) => { const el = document.querySelector(s); return [k, el ? {inner: el.innerText, text: el.textContent, html: el.outerHTML} : null]; })), CONTAINERS);
      const dumps = {0: await dump()};
      const cdp = await context.newCDPSession(page);
      await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', {interval: 200}); await cdp.send('Profiler.start');
      await page.evaluate(() => { window.__churn = {}; });
      const t0 = Date.now();
      for (let t = 1; t <= TICKS; t++) {
        await page.evaluate(() => advanceTicks(1));
        await page.waitForTimeout(1000);
        if ([5, 10, TICKS].includes(t)) { await cdp.send('Profiler.stop').then(r => { (globalThis.__parts ||= []).push(r.profile); }); dumps[t] = await dump(); await cdp.send('Profiler.start'); }
      }
      const wall = Date.now() - t0;
      const churn = await page.evaluate(() => window.__churn);
      await cdp.send('Profiler.stop');
      const parts = globalThis.__parts; globalThis.__parts = []; parts.forEach((p, i) => fs.writeFileSync(path.join(OUT, `prof-${fx}-${variant}-${rep}-${i}.cpuprofile`), JSON.stringify(p)));
      const agg = {mineMs: 0, busyMs: 0, byModule: {}};
      for (const p of parts) { const a = attribute(variant, p); agg.mineMs += a.mineMs; agg.busyMs += a.busyMs; for (const [k, v] of Object.entries(a.byModule)) agg.byModule[k] = +((agg.byModule[k] || 0) + v).toFixed(1); }
      const row = {rep, fx, variant, load0: +load0.toFixed(1), load1: +os.loadavg()[0].toFixed(1), wall, perTickMineMs: +(agg.mineMs / TICKS).toFixed(2), perTickBusyMs: +(agg.busyMs / TICKS).toFixed(1), byModulePerTick: Object.fromEntries(Object.entries(agg.byModule).map(([k, v]) => [k, +(v / TICKS).toFixed(2)])), churnPerTick: Object.fromEntries(Object.entries(churn).map(([k, c]) => [k, +((c.added + c.removed) / TICKS).toFixed(1)])), errors};
      console.log(JSON.stringify(row));
      results.push(row);
      fs.writeFileSync(path.join(OUT, `dump-${fx}-${variant}-${rep}.json`), JSON.stringify(dumps));
      await context.close();
    }
  }
} finally { await browser.close(); for (const s of Object.values(servers)) await s.close(); }
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
