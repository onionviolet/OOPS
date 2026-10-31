// Canon pull floor (G1 proposal): fresh origin, 1920x1080, headless. Enrol as the lead, report in, decline the dose,
// run past day 2, read the pull panel, then save, reload and import. Usage: node scripts/playtest/canon-pull-probe.mjs <out-dir>
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildBundle, serve, Session} from './lib.mjs';
const out = path.resolve(process.argv[2] || '.'); await fs.mkdir(out, {recursive: true});
const bundle = await buildBundle(), server = await serve(bundle.dir);
const s = await new Session({url: server.url, opTimeout: 240000, seed: Number(process.env.SEED ?? 7), wall: Date.UTC(2026, 9, 30)}).start();
const report = {viewport: '1920x1080', seed: Number(process.env.SEED ?? 7), steps: []};
const mark = m => { report.steps.push(m); return fs.appendFile(path.join(out, 'progress.log'), new Date().toISOString() + ' ' + m + '\n'); };
const openPanel = async () => { const r = await s.page.evaluate(() => { const sels = [...document.querySelectorAll('select')].map(e => ({label: e.getAttribute('aria-label'), opts: [...e.options].map(o => o.value + '|' + o.text).slice(0, 60)})); const sel = [...document.querySelectorAll('select')].find(e => [...e.options].some(o => /canon-pull|^The story$/i.test(o.value + o.text))); if (sel) { const o = [...sel.options].find(o => /canon-pull|^The story$/i.test(o.value + o.text)); sel.value = o.value; sel.dispatchEvent(new Event('change', {bubbles: true})); } return {found: !!sel, sels: sel ? [] : sels}; }); await s.page.waitForTimeout(2500); return r; };
const nav = async id => { await s.page.keyboard.press('Escape'); await s.page.evaluate(v => { const e = document.querySelector('select[aria-label="Other known panels"]'); e.value = v; e.dispatchEvent(new Event('change', {bubbles: true})); }, id); await s.page.waitForTimeout(600); };
const buttons = () => s.page.evaluate(() => [...document.querySelectorAll('#lotm_panel button')].map(b => (b.disabled ? '[disabled] ' : '') + b.textContent.trim().slice(0, 100)));
const click = re => s.page.evaluate(src => { const b = [...document.querySelectorAll('#lotm_panel button')].find(b => !b.disabled && new RegExp(src).test(b.textContent)); if (!b) return null; const t = b.textContent; b.click(); return t.slice(0, 80); }, re);
const sliceOf = async () => { const save = await s.save(); return save?.canonPull ?? save?.expansion?.canonPull ?? null; };
try {
    await s.open(); const p = s.page; await nav('lotm');
    await p.locator('#lotm_panel [data-lotm="pick_be"]').click(); await p.waitForTimeout(350); await p.locator('#lotm_panel [data-lotm="enroll_be"]').click();
    for (let i = 0; i < 80; i++) { try { if (await p.locator('#loading_screen_play_button').isVisible()) { await p.locator('#loading_screen_play_button').click({timeout: 3000}); await p.waitForTimeout(2000); }
        if (await p.evaluate(() => window.simulationTestHooks.snapshot().expansion.lotm?.entryProfile)) break; } catch {} await p.waitForTimeout(1500); }
    await mark('enrolled'); await nav('lotm'); report.btnsStart = await buttons();
    const day = () => p.evaluate(() => { const t = window.simulationTestHooks.snapshot()['current time']; return t.day_count; });
    report.day0 = await day();
    report.away = await click('^Travel from .* to Tingen street market'); await p.waitForTimeout(3000); report.where = await p.evaluate(() => document.getElementById('location_name_span')?.innerText);
    for (let i = 0; i < 16 && (await day()) < 3; i++) { const w = await click('^Wait until'); report.waits = [...(report.waits ?? []), w]; if (!w) break; await p.waitForTimeout(6000); }
    for (let i = 0; i < 6 && !(await sliceOf())?.beats?.done?.['lotm.v1.pull.b1']; i++) { const w = await click('^Wait until'); report.waits.push(w); await p.waitForTimeout(6000); }   // persists inside the lead's day-3 slots
    report.day1 = await day(); report.sliceDay2 = await sliceOf(); await mark('past day 3');
    report.reports = await p.evaluate(() => (document.body.innerText.split('Reports')[1] ?? '').slice(0, 700));
    report.open1 = await openPanel(); report.panelText = await p.evaluate(() => document.getElementById('canon_pull_panel')?.innerText ?? null);
    await p.screenshot({path: path.join(out, 'canon-pull-panel.png'), timeout: 20000}).catch(() => {});
    const text = await p.evaluate(() => window.save_to_file()); report.exportLen = String(text).length; await fs.writeFile(path.join(out, 'export.txt'), String(text));
    await p.evaluate(t => { window.load_progress(t); return 1; }, text).catch(() => {});
    for (let i = 0; i < 40; i++) { try { if (await p.locator('#loading_screen_play_button').isVisible()) await p.locator('#loading_screen_play_button').click({timeout: 3000}); } catch {} await p.waitForTimeout(1000); if (await p.evaluate(() => !!window.simulationTestHooks)) break; }
    report.sliceAfterImport = await sliceOf(); await nav('lotm'); report.open2 = await openPanel();
    report.panelAfterImport = await p.evaluate(() => document.getElementById('canon_pull_panel')?.innerText ?? null);
    report.errors = s.errors;
} catch (e) { report.fail = String(e.stack || e).slice(0, 800); }
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
await s.close(); server.close?.(); process.exit(0);
