// FRC56 produce from care: headless 1920x1080, fresh origin, rebuilt bundle. Two fresh lives in the Village keep the meadow
// pen sheep through real panel clicks: one fed and brushed on time, one fed only. Their fleeces differ in grade (and the
// panel says why). Then Save, reload, Export and Import of the kept life: wool stacks, mood rows and tie survive.
// Route: fresh life, then a named DEV SEEDED purse only if the fresh purse cannot pay for the pen (30 coins + hay).
// Usage: node scripts/fleece_care_browser.mjs [out-dir]. Builds its own bundle; no user save is touched.
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
const OUT = resolve(process.argv[2] || 'docs/representations/evidence/fleece_from_care');
await mkdir(OUT, {recursive: true});
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'};
const bundleDir = await mkdtemp(join(tmpdir(), 'fleece-care-'));
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
const errors = [], report = {bundleHash, viewport: '1920x1080', lives: {}};
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
const tick = (n = 1) => page.evaluate(n => window.advanceTicks?.(n), n);
const save = async () => { await page.evaluate(() => window.saveProgress()); return page.evaluate(() => localStorage.getItem('save data')); };
const pen = async () => {
    await page.selectOption('#workspace_navigation select[aria-label="Other known panels"]', 'projects').catch(() => {});
    await page.waitForTimeout(300);
    await page.evaluate(() => { const p = document.getElementById('meadow_pen_panel'); if (p) { p.open = true; p.closest('details:not(#meadow_pen_panel)')?.setAttribute('open', ''); p.scrollIntoView({block: 'center'}); } });
    await page.waitForTimeout(700); // the panel redraws on its own half-second timer
};
const facts = () => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('#meadow_pen_panel [data-habitat-fact]')].map(n => [n.dataset.habitatFact, n.textContent])));
const act = async action => {
    const b = page.locator(`#meadow_pen_panel [data-habitat="${action}"]`);
    if (await b.isDisabled()) throw new Error(`${action} disabled: ${await b.getAttribute('title')}`);
    await b.click(); await page.waitForTimeout(250);
};
const wool = async () => Object.entries(JSON.parse(await save()).inventories.person.main_character).filter(([k]) => JSON.parse(k).id === 'Wool').map(([k, v]) => [k, v.count]);
async function life(name, {brush, cycles, wait}) {
    await open(null);
    let s = JSON.parse(await save());
    if (s.character.money < 30 + 2 * cycles) {
        s.character.money = 200; report.route = 'fresh life with a DEV SEEDED purse of 200 coins (the fresh purse cannot pay for pen, sheep and hay)';
        await open(JSON.stringify(s));
    } else report.route = 'fresh life, own purse';
    await pen(); await act('build'); await act('adopt');
        for(let i = 0; i < cycles; i++) {
        await act('buy_feed'); await act('feed'); if(brush) await act('attend');
        await tick(wait); await pen(); await act('collect');
    }
    await act('buy_feed'); await act('feed'); if(brush) await act('attend'); await pen();
    await page.locator('#meadow_pen_panel').screenshot({path: join(OUT, `${name}-pen.png`)});
    await page.screenshot({path: join(OUT, `${name}-1920.png`)});
    // What a trader pays per lock: the inventory rows carry the native value (getValue) the sell screen uses.
    const values = await page.evaluate(() => [...document.querySelectorAll('[data-character_item]')].filter(n => JSON.parse(n.dataset.character_item).id === 'Wool').map(n => ({key: n.dataset.character_item, value: Number(n.dataset.item_value)})));
    report.lives[name] = {brush, cycles, wait, facts: await facts(), wool: await wool(), values};
    return report.lives[name];
}
try {
    // Neglected: never brushed, and hay comes 40 played minutes after the last (three missed rations each time).
    const neglected = await life('neglected', {brush: false, cycles: 4, wait: 40});
    const kept = await life('kept', {brush: true, cycles: 4, wait: 6});
    report.differ = JSON.stringify(kept.wool) !== JSON.stringify(neglected.wool) && kept.facts.fleece !== neglected.facts.fleece;
    const midSave = await save();
    await open(midSave); await pen(); report.reload = {facts: await facts(), wool: await wool()};
    const encoded = await page.evaluate(() => window.save_to_file());
    await open(null);
    await Promise.all([page.waitForNavigation({waitUntil: 'domcontentloaded'}), page.locator('#saved_file_input').setInputFiles({name: 'fleece.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]).catch(e => (report.importNote = e.message));
    await page.waitForTimeout(1500);
    const play2 = page.locator('#loading_screen_play_button'); if (await play2.isVisible().catch(() => false)) { await page.evaluate(() => window.simulationTestHooks?.pause()); await play2.click(); await page.waitForTimeout(800); }
    await pen(); report.import = {facts: await facts(), wool: await wool()};
    const same = x => JSON.stringify({wool: x.wool, tie: x.facts.tie, mood: x.facts.mood, fleece: x.facts.fleece});
    report.reloadSame = same(report.reload) === same(kept); report.importSame = same(report.import) === same(kept);
} catch (e) { report.failure = e.message; await page?.screenshot({path: join(OUT, 'failure.png')}).catch(() => {}); }
finally { report.errors = errors; await context?.close().catch(() => {}); await browser.close().catch(() => {}); server.close(); }
await writeFile(join(OUT, 'journey.json'), JSON.stringify(report, null, 1) + '\n');
const ok = report.differ && report.reloadSame && report.importSame && !report.failure && !errors.length;
console.log(ok ? 'PASS' : 'FAIL', JSON.stringify({bundleHash, route: report.route, differ: report.differ, reloadSame: report.reloadSame, importSame: report.importSame, failure: report.failure, errors: errors.length}));
