// Same click sequence in each variant (dev-stepped), dump panel text/HTML after each step,
// and check that a focused control keeps focus across ticks. Usage: node interact.mjs [variants] [fixture]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {serve, launchChrome, openGame, FIXTURE_DIR} from '../../../../../../scripts/perf/lib.mjs';
// Scratch dir for trees/, ab-out/ and developed.json (copy of a systems workshop natural-final-save.json).
const S = process.env.WG_SCRATCH || path.join(os.tmpdir(), 'wave-g-render');
const VARIANTS = (process.argv[2] || 'base,head').split(',');
const FX = process.argv[3] || 'developed';
const fixture = fs.readFileSync(FX === 'developed' ? path.join(S, 'developed.json') : path.join(FIXTURE_DIR, FX + '.json'), 'utf8');
const C = {expedition: '#expedition_panel', village: '#village_panel', chronicle: '#chronicle_panel', work_ledger: '#work_ledger_panel', structured: '#structured_pack_panel', inventory: '#inventory_content_div', itemlog: '#data_tab_item_log_div'};
// Controls clicked in order: first enabled, unhidden match inside each panel.
const STEPS = [['structured', '[data-structured-begin]'], ['structured', '[data-structured-action]'], ['structured', '[data-structured-repeat]:not([data-structured-repeat="stop"])'], ['structured', '[data-structured-repeat="stop"]'], ['structured', '[data-structured-cancel]'], ['structured', '[data-structured-action]'],
  ['chronicle', '[data-chronicle]'], ['expedition', '[data-expedition-action]'], ['village', '[data-village-action]'], ['work_ledger', 'button[data-ledger-control]'], ['work_ledger', '[data-ledger-control="accept-meal"]']];
// Focus targets checked across ticks.
const FOCUS = [['expedition', '[data-expedition-action]'], ['village', '[data-village-action]'], ['structured', '[data-structured-action]'], ['work_ledger', '[data-ledger-control]'], ['inventory', '.inventory_item_control'], ['chronicle', '[data-chronicle]']];
const out = {};
const browser = await launchChrome();
try {
  for (const v of VARIANTS) {
    const srv = await serve(path.join(S, 'trees', v));
    const {context, page, errors} = await openGame(browser, srv.url + '?test_hooks=1', fixture);
    await page.waitForTimeout(3000);
    await page.evaluate(C => { simulationTestHooks.pause(); for (const s of Object.values(C)) { const el = document.querySelector(s); if (el?.tagName === 'DETAILS') el.open = true; } }, C);
    const dump = () => page.evaluate(C => Object.fromEntries(Object.entries(C).map(([k, s]) => { const el = document.querySelector(s); return [k, el ? {inner: el.innerText, html: el.outerHTML} : null]; })), C);
    const rec = {steps: [], focus: [], errors};
    for (const [panel, sel] of STEPS) {
      const clicked = await page.evaluate(([p, sel]) => {
        const root = document.querySelector(p); if (!root) return null;
        const b = [...root.querySelectorAll(sel)].find(b => !b.disabled && !b.hidden && !b.parentElement.closest('[data-structured-row][hidden], [data-structured-job][hidden]'));
        if (!b) return null; const label = b.textContent; b.click(); return label;
      }, [C[panel], sel]);
      await page.waitForTimeout(600);
      await page.evaluate(() => advanceTicks(3));
      await page.waitForTimeout(600);
      rec.steps.push({panel, clicked, dump: await dump()});
    }
    for (const [panel, sel] of FOCUS) {
      const found = await page.evaluate(([p, sel]) => {
        const root = document.querySelector(p); const b = root && [...root.querySelectorAll(sel)].find(b => !b.disabled && !b.closest('[hidden]') && b.getClientRects().length);
        if (!b) return null; b.focus(); window.__focusTarget = b; return document.activeElement === b ? (b.textContent || '').slice(0, 40) : 'not focusable';
      }, [C[panel], sel]);
      if (!found || found === 'not focusable') { rec.focus.push({panel, found}); continue; }
      let kept = true;
      for (let i = 0; i < 5; i++) { await page.evaluate(() => advanceTicks(1)); await page.waitForTimeout(400); kept &&= await page.evaluate(() => document.activeElement === window.__focusTarget && window.__focusTarget.isConnected); }
      rec.focus.push({panel, found, kept});
    }
    rec.ledgerRerender = await page.evaluate(async () => {
      const root = document.querySelector('#work_ledger_panel'); const ctl = [...root.querySelectorAll('button[data-ledger-control]')].filter(b => !b.disabled && !b.closest('[hidden]'));
      if (ctl.length < 2) return 'fewer than two enabled controls';
      const keep = ctl.find(b => b.dataset.ledgerControl === 'cancel-effect') || ctl[0]; keep.focus();
      const other = ctl.find(b => b !== keep && b.dataset.ledgerControl !== 'cancel-effect'); other.click();
      await new Promise(r => setTimeout(r, 800));
      const a = document.activeElement; return {clicked: other.dataset.ledgerControl, sameNode: a === keep, sameKey: a?.dataset?.ledgerControl === keep.dataset.ledgerControl};
    });
    out[v] = rec;
    console.log(v, JSON.stringify(rec.steps.map(s => [s.panel, s.clicked])), JSON.stringify(rec.focus), JSON.stringify(rec.ledgerRerender), 'errors', errors.length);
    await context.close(); await srv.close();
  }
} finally { await browser.close(); }
if (out.base) for (const v of VARIANTS.filter(v => v !== 'base')) {
  let diffs = 0;
  out.base.steps.forEach((s, i) => { const t = out[v].steps[i]; if (s.clicked !== t.clicked) { diffs++; console.log('step', i, 'clicked differs', s.clicked, '|', t.clicked); }
    for (const k of Object.keys(s.dump)) for (const m of ['inner', 'html']) { const a = s.dump[k]?.[m] || '', b = t.dump[k]?.[m] || ''; if (a !== b) { diffs++; let j = 0; while (a[j] === b[j]) j++; console.log(v, 'step', i, k, m, 'diff', JSON.stringify(a.slice(Math.max(0, j - 60), j + 60)), '|', JSON.stringify(b.slice(Math.max(0, j - 60), j + 60))); } } });
  console.log(v, 'vs base: text/html diffs', diffs);
}
fs.writeFileSync(path.join(S, `interact-${FX}.json`), JSON.stringify(out));
