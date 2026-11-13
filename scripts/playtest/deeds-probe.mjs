// Deeds floor (G6 widened): fresh origin, 1920x1080, headless. Enrol as the LOTM lead, walk away from the book's place before day 3,
// let the day come, read the Deeds panel (an Another-way deed), then save, reload, import, and start a new run: the profile deed stays.
// Route kind: earned steps from a fresh life (the canon-pull probe's walk). Usage: node scripts/playtest/deeds-probe.mjs <out-dir>
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
const PROFILE = 'yairpg.profile.v1';
const profile = () => s.page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), PROFILE);
const deeds = async () => { await nav('deeds'); await s.page.waitForTimeout(800); return s.page.evaluate(() => document.getElementById('deeds_panel')?.innerText ?? null); };
const boot = async () => { for (let i = 0; i < 60; i++) { try { if (await s.page.locator('#loading_screen_play_button').isVisible()) await s.page.locator('#loading_screen_play_button').click({timeout: 3000}); } catch {} await s.page.waitForTimeout(1000); if (await s.page.evaluate(() => !!window.simulationTestHooks?.snapshot?.()?.expansion).catch(() => false)) break; } };
try {
    await s.open(); const p = s.page; report.deedsFresh = await deeds(); report.profileFresh = await profile(); await nav('lotm');
    await p.locator('#lotm_panel [data-lotm="pick_be"]').click(); await p.waitForTimeout(350); await p.locator('#lotm_panel [data-lotm="enroll_be"]').click();
    for (let i = 0; i < 80; i++) { try { if (await p.locator('#loading_screen_play_button').isVisible()) { await p.locator('#loading_screen_play_button').click({timeout: 3000}); await p.waitForTimeout(2000); }
        if (await p.evaluate(() => window.simulationTestHooks.snapshot().expansion.lotm?.entryProfile)) break; } catch {} await p.waitForTimeout(1500); }
    await mark('enrolled'); await nav('lotm');
    const day = () => p.evaluate(() => window.simulationTestHooks.snapshot()['current time'].day_count);
    report.away = await click('^Travel from .* to Tingen street market'); await p.waitForTimeout(3000);
    for (let i = 0; i < 16 && (await day()) < 3; i++) { const w = await click('^Wait until'); report.waits = [...(report.waits ?? []), w]; if (!w) break; await p.waitForTimeout(6000); }
    for (let i = 0; i < 6 && !(await sliceOf())?.beats?.done?.['lotm.v1.pull.b1']; i++) { const w = await click('^Wait until'); report.waits.push(w); await p.waitForTimeout(6000); }
    report.pullRecords = (await sliceOf())?.records; await mark('past day 3');
    report.deedsAfter = await deeds(); report.profileAfter = await profile();
    report.log = await p.evaluate(() => [...document.body.innerText.matchAll(/Deed done:[^\n]*/g)].map(m => m[0]).slice(0, 6));
    await p.locator('#deeds_panel').scrollIntoViewIfNeeded().catch(() => {});
    await p.screenshot({path: path.join(out, 'deeds-panel.png'), timeout: 20000}).catch(() => {});
    await p.evaluate(() => window.saveProgress()); await p.reload(); await boot();
    report.deedsAfterReload = await deeds(); report.pullAfterReload = (await sliceOf())?.records?.length ?? 0;
    const text = await p.evaluate(() => window.save_to_file()); report.exportLen = String(text).length;
    report.exportHasProfile = String(text).includes('deed.');
    await p.evaluate(t => { window.load_progress(t); return 1; }, text).catch(() => {}); await boot();
    report.deedsAfterImport = await deeds(); report.pullAfterImport = (await sliceOf())?.records?.length ?? 0;
    await p.evaluate(() => localStorage.removeItem('save data')); await p.reload(); await boot();   // a new run: no save, same profile
    report.newRunWorld = await p.evaluate(() => window.simulationTestHooks.snapshot().expansion?.actors?.player?.worldId ?? null);
    report.deedsNewRun = await deeds(); report.profileNewRun = await profile();
    await p.screenshot({path: path.join(out, 'deeds-new-run.png'), timeout: 20000}).catch(() => {});
    report.errors = s.errors;
} catch (e) { report.fail = String(e.stack || e).slice(0, 800); }
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
await s.close(); server.close?.(); process.exit(0);
