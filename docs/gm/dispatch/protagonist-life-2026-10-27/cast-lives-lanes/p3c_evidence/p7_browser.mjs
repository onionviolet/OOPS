// MR2 browser floor: fresh origin, 1920x1080, real clicks, Save and reload.
import {createServer} from 'node:http';
import {readFile, mkdtemp, mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join, resolve, extname} from 'node:path';
import {createHash} from 'node:crypto';
const ROOT = '/Users/weiwei/code/yet-another-idle-rpg';
const require = createRequire(join(ROOT, 'scripts/x.cjs'));
const {build} = require('esbuild');
const {launchChrome, openNotebook} = require(join(ROOT, 'scripts/ui_helpers.cjs'));
const OUT = process.argv[2];
await mkdir(OUT, {recursive: true});
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'};
const bundleDir = process.env.KEEP_BUNDLE || await mkdtemp(join(tmpdir(), 'p3c-bundle-')); await mkdir(bundleDir, {recursive: true});
await build({entryPoints: [join(ROOT, 'src/main.js')], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: false, outfile: join(bundleDir, 'bundle.js'), logLevel: 'error'});
const bundleHash = createHash('sha256').update(await readFile(join(bundleDir, 'bundle.js'))).digest('hex');
const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.startsWith('/dist/bundle.js') ? join(bundleDir, 'bundle.js') : resolve(ROOT, '.' + (path === '/' ? '/index.html' : path));
    try { res.writeHead(200, {'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'}).end(await readFile(file)); }
    catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/?test_hooks=1`;
const browser = await launchChrome();
const errors = [], report = {bundleHash, viewport: '1920x1080'};
let context, page;
const open = async seed => {
    await context?.close();
    context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.addInitScript(() => {
        const Native = window.MutationObserver; const stats = window.__mo = [];
        window.MutationObserver = class extends Native { constructor(cb) { const rec = {site: (new Error().stack || '').split('\n').slice(2, 4).join(' | ').replace(/https?:[^ )]*\//g, ''), calls: 0, sample: []}; stats.push(rec);
            super((list, o) => { rec.calls++; if (rec.sample.length < 12 && window.__moOn) rec.sample.push(list.slice(0, 8).map(m => m.type + ':' + (m.attributeName || '') + ':' + (m.target.id || m.target.className || m.target.localName) + (m.addedNodes.length ? ' +' + [...m.addedNodes].map(n => n.className || n.localName).join(',') : '') + (m.removedNodes.length ? ' -' + [...m.removedNodes].map(n => n.className || n.localName).join(',') : '')).join(' ; ')); return cb(list, o); }); } };
    });
    if (seed) await context.addInitScript(d => { if (!sessionStorage.getItem('s')) { localStorage.setItem('save data', d); sessionStorage.setItem('s', '1'); } }, seed);
    page = await context.newPage(); page.setDefaultTimeout(60000);
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url, {timeout: 120000, waitUntil: 'domcontentloaded'});
    const play = page.locator('#loading_screen_play_button');
    await play.waitFor({state: 'visible', timeout: 180000});
    await page.evaluate(() => window.simulationTestHooks?.pause());
    await play.click();
    const confirm = page.locator('#hero_creation_panel_confirmation');
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await page.waitForTimeout(500);
};
const tick = () => page.evaluate(() => window.advanceTicks?.(1));
const click = async sel => { await page.locator(sel).first().click({noWaitAfter: true, timeout: 8000}).catch(() => page.evaluate(sel => document.querySelector(sel)?.click(), sel)); await tick(); await page.waitForTimeout(300); };
const save = async () => { await page.evaluate(() => window.saveProgress()); return page.evaluate(() => localStorage.getItem('save data')); };
const workshop = async () => {
    if (!await page.locator('#notebook_box_div').isVisible().catch(() => false))
        await page.locator(':is(button,a,[role=tab],[role=button]):visible', {hasText: /^Notebook$/}).first().click();
    await page.waitForTimeout(400);
    await page.locator('[data-notebook-view="people"]').first().click();
    await page.evaluate(() => { const p = document.getElementById('simulation_panel'); if (p) p.open = true; });
    await tick(); await page.waitForTimeout(300);
};

const SCENARIO = process.env.SCENARIO || 'full';
const press = async (id, attr='data-simulation') => { const box = await page.evaluate(([id,attr]) => { const b = document.querySelector(`[${attr}="${id}"]`); if (!b || b.hidden || b.disabled) return null; b.scrollIntoView({block: 'center'}); const r = b.getBoundingClientRect(); return {x: r.x + r.width / 2, y: r.y + r.height / 2}; }, [id,attr]);
    if (!box) throw new Error('control unavailable: ' + id); await page.mouse.click(box.x, box.y); await tick(); await page.waitForTimeout(800); };
const note = () => page.evaluate(() => document.getElementById('promise_quiet_note')?.textContent ?? null);
const crowdNote = () => page.evaluate(() => document.getElementById('promise_crowd_note')?.textContent ?? null);
const standingNote = () => page.evaluate(() => document.getElementById('promise_standing_note')?.textContent ?? null);
const mem = async () => JSON.parse(await save()).memory ?? null;
try {
    await open(null);
    for (const s of ['.choice_dialogue', '[data-dialogue="villageElder"]', '[data-textline="hello"]', '#center_mode_back']) await click(s);
    const talked = JSON.parse(await save());
    talked.availabilities.dialogue.oldCraftsman = 1;
    talked.inventories.person.main_character[JSON.stringify({id: 'Rough wood log'})] = {count: 3}; talked.character.money = (talked.character.money || 0) + 1;
    await open(JSON.stringify(talked));
    for (const s of ['.choice_dialogue', '[data-dialogue="oldCraftsman"]', '[data-textline="hello"]', '#center_mode_back']) await click(s);
    await workshop();
    await click('[data-simulation="enroll"]');
    await press('village.working_habits');
    await press('village.commission');
    const beforeInterrupt = await save();
    await press('village.interrupt_work');
    if (process.env.REPLAY) {
        await page.evaluate(() => { const p = document.getElementById('promise_panel'); if (p) p.open = true; });
        report.replayFirst = await crowdNote();
        await open(beforeInterrupt); await workshop();
        await press('village.interrupt_work');
        await page.evaluate(() => { const p = document.getElementById('promise_panel'); if (p) p.open = true; });
        report.replaySecond = await crowdNote();
    }
    if (SCENARIO === 'full') { await press('village.ask_promise'); await press('village.pay_quiet'); }
    else if (SCENARIO === 'ask') await press('village.ask_quiet');
    else if (SCENARIO === 'threat') await press('village.threaten_quiet');
    else if (SCENARIO === 'oath') { await press('village.ask_quiet'); await press('village.swear_quiet'); }
    report.silenceControls = await page.evaluate(() => [...document.querySelectorAll('[data-simulation^="village.ask_"],[data-simulation="village.pay_quiet"]')].map(b => b.dataset.simulation + (b.hidden ? ':hidden' : '')));
    await page.evaluate(() => { const p = document.getElementById('promise_panel'); if (p) p.open = true; });
    await press('promise.begin', 'data-promise-command');
    if (process.env.COVER) { await press('promise.cover_story', 'data-promise-command'); }
    report.standing0 = await standingNote();
    report.noteAfterBegin = await note(); report.crowdAfterBegin = await crowdNote();
    report.time0 = (await mem(), JSON.parse(await save())['current time']);
    // Let days pass. Telling is weighed at the next played-time boundary of each day.
    const days = +(process.env.DAYS || 2);
    for (let d = 0; d < days; d++) { await page.evaluate(([n, ff]) => ff ? window.fastForward(n) : window.advanceTicks(n), [+(process.env.TICKS || 4000), !!process.env.FF]); const ok = await press('village.word_after_work').then(() => 'word', e => e.message); (report.pressLog ||= []).push(ok); await page.evaluate(() => window.advanceTicks(1)); }
    report.time1 = JSON.parse(await save())['current time'];
    report.note = await note(); report.standing = await standingNote();
    const m = await mem(); report.memoryHolders = m && Object.fromEntries(Object.entries(m.holders).map(([h, rows]) => [h, rows.length])); report.memorySchema = m?.schema;
    await page.evaluate(() => { document.getElementById('promise_panel').open = true; document.getElementById('promise_panel').scrollIntoView({block: 'center'}); });
    await page.screenshot({path: join(OUT, `p7-${SCENARIO}-1920.png`)});
    const saved = await save(); report.savedMemory = JSON.parse(saved).memory;
    await open(saved); await workshop(); await page.evaluate(() => { const p = document.getElementById('promise_panel'); if (p) p.open = true; });
    report.noteAfterReload = await note(); report.crowdAfterReload = await crowdNote();
    const exported = await page.evaluate(() => window.save_to_file());
    report.exportPrefix = exported.slice(0, 12);
    await Promise.all([page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 120000}).catch(() => {}), page.evaluate(s => window.load_progress(s), exported).catch(() => {})]);
    await page.locator('#loading_screen_play_button').waitFor({state:'visible', timeout: 180000});
    await page.evaluate(() => window.simulationTestHooks?.pause()); await page.locator('#loading_screen_play_button').click(); await page.waitForTimeout(800);
    await workshop(); await page.evaluate(() => { const p = document.getElementById('promise_panel'); if (p) p.open = true; });
    report.noteAfterImport = await note(); report.standingAfterImport = await standingNote(); report.crowdAfterImport = await crowdNote();
    report.memoryAfterImportEqual = JSON.stringify(JSON.parse(await save()).memory) === JSON.stringify(JSON.parse(saved).memory);
} catch (e) { report.failure = e.message; await page.screenshot({path: join(OUT, 'p3c-failure.png')}).catch(()=>{}); report.controls = await page.evaluate(()=>[...document.querySelectorAll('[data-simulation],[data-promise-command]')].map(n=>(n.dataset.simulation||n.dataset.promiseCommand)+':'+(n.hidden?'h':'')+(n.disabled?'d':'')+(n.offsetParent!==null?'v':''))).catch(()=>null); }
finally { report.errors = errors; await context?.close().catch(() => {}); await browser.close().catch(() => {}); server.close(); }
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
