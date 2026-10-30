// Headless 1920x1080 pass of the figure gallery in both skins (COV13, COV14). Counts circles against rects in every figure,
// and screenshots the style guide, two figures and each draft. Run `npm run build:figures` first.
import {createServer} from 'node:http';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
const {launchChrome} = createRequire(import.meta.url)('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname), out = resolve(root, process.argv[2] || 'docs/representations/evidence/skins');
await mkdir(out, {recursive: true});
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.ttf': 'font/ttf'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    try { const data = await readFile(path); res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const browser = await launchChrome(), result = {};
try {
    for (const skin of ['luminous', 'paper']) {
        const page = await (await browser.newContext({viewport: {width: 1920, height: 1080}})).newPage(), errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(`http://127.0.0.1:${server.address().port}/figure-gallery.html?skin=${skin}&effects=off`);
        await page.waitForSelector('[data-fixture^="draft-"]'); await page.waitForTimeout(800);
        const counts = await page.evaluate(() => {
            const first = s => s.querySelector('.fig-gallery-cell [data-theme-cell], [data-theme-cell]');
            const sections = [...document.querySelectorAll('[data-fixture]')].filter(s => first(s)).map(s => { const m = first(s); return {id: s.dataset.fixture, circles: m.querySelectorAll('circle, ellipse').length, rects: m.querySelectorAll('rect').length, skin: m.dataset.componentTheme}; });
            const sum = k => sections.reduce((a, s) => a + s[k], 0);
            return {sections: sections.length, circles: sum('circles'), rects: sum('rects'), skins: [...new Set(sections.map(s => s.skin))], drafts: sections.filter(s => s.id.startsWith('draft-')).map(s => ({id: s.id, circles: s.circles, rects: s.rects}))};
        });
        result[skin] = {...counts, errors};
        await page.screenshot({path: `${out}/gallery-top-${skin}.png`});
        for (const id of ['style-guide', 'owed-table-mixed', 'forms-bar-rows', 'ritual-low-lamp', 'draft-insight-view', 'draft-walks-panel', 'draft-research-feed', 'draft-due-orders', 'draft-day-threads', 'draft-route-strip', 'draft-doorstep-card', 'draft-borrowed-face']) {
            const section = page.locator(`[data-fixture="${id}"]`); await section.scrollIntoViewIfNeeded(); await section.screenshot({path: `${out}/${id}-${skin}.png`});
        }
        if (skin === 'luminous') { // switch live and confirm the same page re-skins
            await page.selectOption('#fig_skin', 'paper'); await page.waitForTimeout(300);
            result.liveSwitch = await page.evaluate(() => [...new Set([...document.querySelectorAll('[data-theme-cell]')].map(m => m.dataset.componentTheme))]);
        }
    }
} finally { await browser.close(); server.close(); }
await writeFile(`${out}/result.json`, JSON.stringify(result, null, 1) + '\n');
console.log(JSON.stringify(result));
