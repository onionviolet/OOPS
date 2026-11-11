// Law by observation (FRC45) at 1920x1080, headless Chromium, fresh origin per step.
// Route: pre-fight Klein save (scenario lotm-klein-wanted, seed 7) imported through the file input, then real clicks:
// the constable fight and a yield, the watch block opening a case, talk / walk away, the changed-outfit case left unproven,
// save + reload, export + import, each checked for the case state.
// Usage: node scripts/law_by_observation_browser.mjs <pre-fight-save.txt> <out-dir>. Builds its own bundle; no user save is touched.
import {createServer} from 'node:http';
import {readFile, writeFile, mkdtemp, mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join, resolve, extname, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'scripts/x.cjs'));
const {build} = require('esbuild');
const {launchChrome} = require(join(ROOT, 'scripts/ui_helpers.cjs'));
const PRE = await readFile(resolve(process.argv[2]), 'utf8');
const OUT = resolve(process.argv[3] || 'docs/gm/dispatch/law_by_observation_2026-11-10');
await mkdir(OUT, {recursive: true});
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'};
const bundleDir = await mkdtemp(join(tmpdir(), 'law-obs-'));
await build({entryPoints: [join(ROOT, 'src/main.js')], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: false, outfile: join(bundleDir, 'bundle.js'), logLevel: 'error'});
const bundleHash = createHash('sha256').update(await readFile(join(bundleDir, 'bundle.js'))).digest('hex').slice(0, 12);
const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.startsWith('/dist/bundle.js') ? join(bundleDir, 'bundle.js') : resolve(ROOT, '.' + (path === '/' ? '/index.html' : path));
    let body; try { body = await readFile(file); } catch { res.writeHead(404).end(); return; }
    res.writeHead(200, {'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'}).end(body);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/?test_hooks=1`;
const browser = await launchChrome();
const errors = [], log = [], report = {bundleHash, viewport: '1920x1080', steps: log};
let context, page;
const note = (step, data) => { log.push({step, ...data}); console.log(step, JSON.stringify(data).slice(0, 400)); };
const play = async () => {
    const p = page.locator('#loading_screen_play_button');
    await p.waitFor({state: 'visible', timeout: 300000});
    await page.evaluate(() => window.simulationTestHooks?.pause());
    await p.click();
    const confirm = page.locator('#hero_creation_panel_confirmation');
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await page.waitForTimeout(600);
};
const fresh = async () => {
    await context?.close();
    context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    page = await context.newPage(); page.setDefaultTimeout(120000);
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
    await page.goto(url, {timeout: 240000, waitUntil: 'domcontentloaded'});
    await play();
};
const importText = async text => {
    await Promise.all([page.waitForNavigation({waitUntil: 'domcontentloaded'}), page.locator('#saved_file_input').setInputFiles({name: 'law.txt', mimeType: 'text/plain', buffer: Buffer.from(text)})]).catch(e => errors.push('import: ' + e.message));
    await page.waitForTimeout(1500); await play().catch(() => {});
};
const tick = () => page.evaluate(() => window.advanceTicks?.(1));
const settle = async ms => { await tick(); await page.waitForTimeout(ms || 400); };
const openLotm = async () => { await page.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption('lotm', {timeout: 20000}); await settle(500); };
const watch = () => page.evaluate(() => { const n = document.querySelector('[data-lotm-law]'); return n ? {text: n.innerText.replace(/\s+/g, ' ').trim(), buttons: [...n.querySelectorAll('button')].map(b => ({id: b.dataset.lotm, label: b.innerText.trim(), disabled: b.disabled}))} : null; });
const click = async sel => { await page.locator(sel).first().click({noWaitAfter: true}); await settle(500); };
const clickText = async t => { await page.getByRole('button', {name: t, exact: true}).first().click({noWaitAfter: true}); await settle(600); };
const shot = async (name, scrollSel) => { if (scrollSel) await page.evaluate(s => document.querySelector(s)?.scrollIntoView({block: 'center'}), scrollSel); await page.waitForTimeout(200); await page.screenshot({path: join(OUT, name)}); };
const exportText = () => page.evaluate(() => window.save_to_file());
const saveRaw = async () => { await page.evaluate(() => window.saveProgress()); return page.evaluate(() => localStorage.getItem('save data')); };
const lawSlice = raw => { const find = o => { for (const k of Object.keys(o || {})) { if (/^lotm_law/.test(k)) return o[k]; if (o[k] && typeof o[k] === 'object') { const r = find(o[k]); if (r) return r; } } return null; }; return find(JSON.parse(raw)); };
const reload = async () => { await page.evaluate(() => window.saveProgress()); await page.reload({waitUntil: 'domcontentloaded'}); await play(); };
const seedOpen = async raw => { await context?.close(); context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.addInitScript(d => { if (!sessionStorage.getItem('s')) { localStorage.setItem('save data', d); sessionStorage.setItem('s', '1'); } }, raw);
    page = await context.newPage(); page.setDefaultTimeout(120000);
    page.on('pageerror', e => errors.push(e.message)); await page.goto(url, {timeout: 240000, waitUntil: 'domcontentloaded'}); await play(); };
try {
    // A. Witnessed fight -> case opens.
    await fresh(); await importText(PRE); await openLotm();
    note('A0 pre-fight, no watch block', {watch: await watch()});
    await clickText('Constables at the door');
    for (let i = 0; i < 6; i++) { const y = page.getByRole('button', {name: 'Yield', exact: true}); if (!await y.count()) break; await y.first().click({noWaitAfter: true}); await settle(700); if (await page.locator('[data-lotm-law]').count()) break; }
    await openLotm();
    const opened = await watch(); note('A1 after the fight, case open', {watch: opened});
    await shot('01_case_open_1920x1080.png', '[data-lotm-law]');
    const caseSave = await saveRaw(); const caseExport = await exportText();
    await writeFile(join(OUT, 'case_open.save.txt'), caseExport);
    note('A2 saved slice', {slice: lawSlice(caseSave)});

    // B. Changed outfit: unproven, no case shown. DEV SEEDED: the Klein life has nothing wearable, so the constables' remembered look in the save is changed
    // instead (the reader compares remembered look with the look in front of it, so remembered != worn is the same state as worn != remembered).
    let swapped = 0; const swap = o => { for (const k of Object.keys(o || {})) { if (o[k] === 'plain clothes') { o[k] = 'bowler_hat|dark_coat'; swapped++; } else if (o[k] && typeof o[k] === 'object') swap(o[k]); } };
    const seeded = JSON.parse(caseSave); swap(seeded);
    note('B0 seeded remembered look swaps', {swapped});
    await seedOpen(JSON.stringify(seeded)); await openLotm();
    note('B changed outfit: watch block', {watch: await watch()});
    await shot('02_changed_outfit_unproven_1920x1080.png');

    // C. Talk, then save + reload, export + import.
    await fresh(); await importText(caseExport); await openLotm();
    note('C0 case survives import', {watch: await watch()});
    await click('[data-lotm="law_talk"]');
    note('C1 after Talk', {watch: await watch()});
    await shot('03_after_talk_1920x1080.png');
    const talkSave = await saveRaw(); note('C2 slice after Talk', {slice: lawSlice(talkSave)});
    await reload(); await openLotm();
    note('C3 after save + reload', {watch: await watch(), slice: lawSlice(await saveRaw())});
    const talkExport = await exportText();
    await fresh(); await importText(talkExport); await openLotm();
    note('C4 after export + import', {watch: await watch(), slice: lawSlice(await saveRaw())});

    // D. Walk away from the same case, then reload.
    await fresh(); await importText(caseExport); await openLotm();
    await click('[data-lotm="law_flee"]');
    note('D1 after Walk away', {watch: await watch()});
    await shot('04_after_walk_away_1920x1080.png');
    const fleeSave = await saveRaw(); note('D2 slice after Walk away', {slice: lawSlice(fleeSave)});
    await reload(); await openLotm();
    note('D3 after save + reload', {watch: await watch(), slice: lawSlice(await saveRaw())});
} catch (e) { report.failure = e.message; await page?.screenshot({path: join(OUT, 'failure.png')}).catch(() => {}); }
finally { report.errors = errors; await context?.close().catch(() => {}); await browser.close().catch(() => {}); server.close(); }
await writeFile(join(OUT, 'journey.json'), JSON.stringify(report, null, 1) + '\n');
console.log(report.failure ? 'FAIL ' + report.failure : errors.length ? 'ERRORS ' + errors.length : 'DONE', bundleHash);
process.exitCode = report.failure || errors.length ? 1 : 0;
