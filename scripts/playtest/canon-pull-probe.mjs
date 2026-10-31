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
    report.waited = await click('^Wait until the day of your interview'); await p.waitForTimeout(8000); report.day1 = await day(); report.btnsInterview = await buttons();
    report.walks = report.btnsInterview.filter(t => /Walk|Travel|workroom|Report|Decline/.test(t));
    report.errors = s.errors;
} catch (e) { report.fail = String(e.stack || e).slice(0, 800); }
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
await s.close(); server.close?.(); process.exit(0);
