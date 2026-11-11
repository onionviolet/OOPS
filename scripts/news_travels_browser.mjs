// FRC news, Tingen (proposal, AD56) at 1920x1080, headless, fresh origin, rebuilt bundle (built here from src).
// Route: named fixture, Klein's earned ch70 checkpoint (kj3af; Dunn and Old Neil share the Blackthorn office there). Real clicks: hand in
// the week's expense application, let a native day pass so Dunn can tell Neil, walk to the office, read what Neil heard, ask him.
// Shows: the workroom's "what they have heard" row (only beside Neil) and Neil's question; Save and reload; Export and Import.
// Needs private_packs/lotm-cast (gitignored; symlink it from the primary checkout in a worktree). Output names cast members only.
// Usage: node scripts/news_travels_browser.mjs [out-dir]
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
const OUT = resolve(process.argv[2] || 'docs/representations/evidence/news');
await mkdir(OUT, {recursive: true});
const DUNN = 'lotm.person.cast-618f4df49af02c7da45e', NEIL = 'lotm.person.cast-6aaa65265bb46e581535', OFFICE_ID = 'lotm.place.cast-0785d86b800a41be64ed';
const OFFICE = 'Blackthorn Security Company';
const CHECKPOINT = resolve('/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/lord-of-mysteries/private/kj3af-ch70-2026-11-08/completed-checkpoint.json');
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'};
const bundleDir = await mkdtemp(join(tmpdir(), 'news-travels-'));
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
const errors = [], report = {bundleHash, viewport: '1920x1080', route: 'named fixture: earned Klein ch70 checkpoint (kj3af); real clicks: hand in, wait, walk to the office, ask', steps: []};
const note = (step, data = {}) => { report.steps.push({step, ...data}); console.log(step, JSON.stringify(data).slice(0, 400)); };
let context, page;
const open = async seed => {
    await context?.close();
    context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    if (seed) await context.addInitScript(d => { if (!sessionStorage.getItem('s')) { localStorage.setItem('save data', d); sessionStorage.setItem('s', '1'); } }, seed);
    page = await context.newPage(); page.setDefaultTimeout(120000);
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
    await page.goto(url, {timeout: 240000, waitUntil: 'domcontentloaded'});
    const play = page.locator('#loading_screen_play_button');
    await play.waitFor({state: 'visible', timeout: 300000});
    await page.evaluate(() => window.simulationTestHooks?.pause());
    await play.click();
    const confirm = page.locator('#hero_creation_panel_confirmation');
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await page.waitForTimeout(500);
};
const save = async () => { await page.evaluate(() => window.saveProgress()); return page.evaluate(() => localStorage.getItem('save data')); };
const advance = minutes => page.evaluate(m => { for (let left = m; left > 0; left -= 60) window.advanceTicks(Math.min(60, left)); }, minutes);
const workroom = () => page.locator('[data-panel-kit], section').filter({hasText: 'Tingen workroom'}).first();
const openWorkroom = async () => {
    const sel = page.locator('#workspace_navigation select[aria-label="Other known panels"]');
    if (await sel.count()) await sel.selectOption('lotm').catch(() => {});
    await page.waitForTimeout(400);
};
const heard = () => page.evaluate(() => [...document.querySelectorAll('[data-reputation-heard]')].map(p => ({text: p.textContent, audience: p.dataset.reputationAudience, visible: p.checkVisibility()})));
const neilButton = () => page.getByRole('button', {name: 'Ask Old Neil which costs the team will cover', exact: true});
const tab = async label => { const b = page.locator('[data-workroom-tabs] button, [role="tab"]').filter({hasText: label}).first(); if (await b.count()) { await b.click(); await page.waitForTimeout(300); } };
const atOffice = async () => JSON.parse(await save()).expansion.simulation.people.player.location === OFFICE_ID;
const memoryOf = async () => { const s = JSON.parse(await save()); return JSON.stringify(s.memory || {}); };
const shot = async name => { await page.screenshot({path: join(OUT, `${name}-1920.png`)}); };
const view = async () => {
    const rows = await heard(), b = neilButton(), reasons = await page.locator('[data-tie-offer-reason], .tie-offer-reason').allTextContents().catch(() => []);
    return {heard: rows, neilButton: await b.count() ? {enabled: await b.first().isEnabled(), visible: await b.first().isVisible(), title: await b.first().getAttribute('title')} : null, reasons,
        said: await page.evaluate(() => [...document.querySelectorAll('[data-tie-said]')].map(n => n.textContent))};
};
try {
    // Named fixture: Klein's earned ch70 checkpoint (kj3af, reached through native story actions; private, gitignored).
    await open(await readFile(CHECKPOINT, 'utf8'));
    note('loaded earned checkpoint', {checkpoint: 'kj3af-ch70'});
    await openWorkroom(); await tab('Work & merit');
    await page.getByRole('button', {name: 'Hand it in', exact: true}).first().click();
    await page.waitForTimeout(500);
    note('handed in the application', {dunnHolds: (await memoryOf()).includes(DUNN)});
    await shot('filed');
    // The checkpoint's engine already spent today's telling for Dunn, so the news moves on a later day, when they are together.
    let hours = 0;
    for (; hours < 24 * 6; hours += 3) {
        await advance(180);
        if ((await memoryOf()).includes(NEIL)) break;
    }
    note('news reached Neil', {hoursAfterFiling: hours});
    await openWorkroom(); await tab('Work & merit');
    report.away = await view(); note('away from the office', report.away);
    await tab('Here');
    const more = page.locator('details[data-lotm-more-walks]');
    if (await more.count()) await more.first().evaluate(d => { d.open = true; });
    const walk = page.locator('button').filter({hasText: OFFICE}).first();
    note('walk to the office', {found: await walk.count(), enabled: await walk.count() ? await walk.isEnabled() : null});
    await walk.click(); await page.waitForTimeout(400);
    for (let i = 0; i < 12 && !(await atOffice()); i++) await advance(10);
    note('at the office', {here: await atOffice()});
    await tab('Work & merit'); await page.waitForTimeout(300);
    report.after = await view();
    note('what Neil heard', report.after);
    const row = page.locator('[data-reputation-heard]').first();
    if (await row.count()) await row.scrollIntoViewIfNeeded();
    await shot('heard');
    if (report.after.neilButton?.enabled) { await neilButton().first().click(); await page.waitForTimeout(500); report.asked = await view(); note('asked Neil', report.asked); await shot('asked'); }
    const midSave = await save(); await writeFile(join(OUT, 'after.save.json'), midSave);
    await open(midSave); await page.waitForTimeout(1500); await openWorkroom(); await tab('Work & merit'); await page.waitForTimeout(400);
    report.reload = await view(); note('reload', report.reload);
    const encoded = await page.evaluate(() => window.save_to_file());
    await open(null);
    await Promise.all([page.waitForNavigation({waitUntil: 'domcontentloaded'}), page.locator('#saved_file_input').setInputFiles({name: 'news.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]).catch(e => (report.importNote = e.message));
    await page.waitForTimeout(1500);
    const play2 = page.locator('#loading_screen_play_button'); if (await play2.isVisible().catch(() => false)) { await page.evaluate(() => window.simulationTestHooks?.pause()); await play2.click(); await page.waitForTimeout(800); }
    await openWorkroom(); await tab('Work & merit'); await page.waitForTimeout(400);
    report.import = await view(); note('import', report.import);
    await shot('imported');
} catch (e) { report.failure = e.message; await page?.screenshot({path: join(OUT, 'failure-1920.png')}).catch(() => {}); }
finally { report.errors = errors; await context?.close().catch(() => {}); await browser.close().catch(() => {}); server.close(); }
const shown = r => JSON.stringify([r?.heard?.map(h => [h.text, h.visible]), r?.said, r?.neilButton?.enabled]);
const ok = !report.failure && report.after?.heard?.length > 0 && shown(report.reload) === shown(report.asked || report.after) && shown(report.import) === shown(report.asked || report.after) && !errors.length;
report.result = ok ? 'PASS' : 'FAIL';
await writeFile(join(OUT, 'journey.json'), JSON.stringify(report, null, 1) + '\n');
console.log(report.result, JSON.stringify({bundleHash, failure: report.failure, errors: errors.slice(0, 3)}));
process.exit(ok ? 0 : 1);
