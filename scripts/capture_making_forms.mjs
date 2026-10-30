// Headless 1920x1080 captures of the making-forms fixtures in the figure gallery (run `npm run build:figures` first).
import {createServer} from 'node:http';
import {readFile, mkdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
const {launchChrome} = createRequire(import.meta.url)('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname), out = resolve(root, process.argv[2] || 'docs/representations/evidence/making-forms');
await mkdir(out, {recursive: true});
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    try { const data = await readFile(path); res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const browser = await launchChrome();
try {
    for (const effects of ['full', 'off']) {
        const page = await (await browser.newContext({viewport: {width: 1920, height: 1080}})).newPage(), errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(`http://127.0.0.1:${server.address().port}/figure-gallery.html?effects=${effects}`);
        await page.waitForSelector('[data-fixture]');
        for (const id of ["making-rune-strip","making-tonic-hands-on","making-tonic-folded","making-feeding-board","making-artifact-risk"]) {
            const section = page.locator(`[data-fixture="${id}"]`);
            await section.scrollIntoViewIfNeeded();
            await section.screenshot({path: `${out}/${id}-${effects}.png`});
        }
        console.log(effects, 'page errors:', errors.length, errors.join('; '));
    }
} finally { await browser.close(); server.close(); }
