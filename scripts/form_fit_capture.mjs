// bk-forms (2026-10-30): before/after evidence at 1920x1080, 14 and 21 px text, effects off, from the figure gallery.
// Usage: node scripts/slot_run.mjs --kind browser -- node scripts/form_fit_capture.mjs [outDir]
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {launchChrome} = require('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname), out = resolve(root, process.argv[2] || 'docs/audits/evidence/form-fit-2026-10-30');
await mkdir(out, {recursive: true});
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.map': 'application/json'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    let data; try { data = await readFile(path); } catch { return res.writeHead(404).end(); }
    res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const SHOTS = [
    {fx: 'relationship-web-ferry', name: 'people', hover: 'osric', pins: ['osric', 'brenna'], row: 'osric'},
    {fx: 'knows-harbor-bell', name: 'knowledge', hover: 'k6', pins: ['k6', 'k4'], row: 'k6'},
    {fx: 'research-map-frontier.lever', name: 'study-map', hover: 'return', pins: ['return', 'practice'], row: 'return'},
];
const browser = await launchChrome(), log = [], errors = [];
try {
    const page = await (await browser.newContext({viewport: {width: 1920, height: 1080}})).newPage();
    page.on('pageerror', e => errors.push(e.message));
    for (const size of [14, 21]) for (const s of SHOTS) {
        const cell = () => page.locator(`section.fig-gallery-section[data-fixture="${s.fx}"] .fig-gallery-cell`).first();
        const shot = async tag => { const path = resolve(out, `${s.name}-${size}px-${tag}.png`); await cell().screenshot({path}); log.push(path.replace(root + '/', '')); };
        const go = form => page.goto(`${base}/figure-gallery.html?only=${encodeURIComponent(s.fx)}&form=${form}&effects=off&size=${size}`).then(() => page.waitForSelector(`section.fig-gallery-section[data-fixture="${s.fx}"] .fig-gallery-cell svg, section.fig-gallery-section[data-fixture="${s.fx}"] .fig-form-stage > *`));
        await go('webplain'); await shot('1-before-figure');
        await go('web'); await shot('2-after-figure-idle');
        await cell().locator(`.fig-marker[data-id="${s.hover}"] .fig-body`).hover(); await shot('3-after-hover-card');
        for (const id of s.pins) await cell().locator(`.fig-marker[data-id="${id}"] .fig-body`).click();
        await page.mouse.move(5, 5); await shot('4-after-pinned-compare');
        await cell().locator('.fig-focus-toggle').click(); await shot('5-after-focus-mode');
        await go('table'); await cell().locator(`tbody tr[data-id="${s.row}"]`).click(); await shot('6-alt-table-inspector');
        await go('matrix'); await shot('7-alt-matrix');
    }
    await writeFile(resolve(out, 'capture.json'), JSON.stringify({viewport: '1920x1080', effects: 'off', textSizes: [14, 21], route: 'figure gallery fixtures', files: log, pageErrors: errors}, null, 1));
    console.log(log.length, 'screenshots', errors.length, 'page errors');
} finally { await browser.close(); server.close(); }
