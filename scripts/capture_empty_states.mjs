// Headless 1920x1080 sweep of empty-state text on a fresh-day3 seed 7 game (COPY_STYLE_SHEET empty states slice).
// Rebuilt bundle, fresh origin. Clicks every top-nav route and prints lines that read as empty states.
// Usage: node scripts/capture_empty_states.mjs [outDir] [--grep text ...]
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, extname, join} from 'node:path';
import {tmpdir} from 'node:os';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {scenarioSave} from './headless/scenarios.mjs';
const require = createRequire(import.meta.url);
const {launchChrome} = require('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname);
const args = process.argv.slice(2);
const out = resolve(args[0] && !args[0].startsWith('--') ? args[0] : join(tmpdir(), 'yairpg-empty-states'));
const gi = args.indexOf('--grep'), wanted = gi >= 0 ? args.slice(gi + 1) : [];
await mkdir(out, {recursive: true});
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    try { const data = await readFile(path); res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const save = await scenarioSave('fresh-day3', {seed: 7});
const bundle = createHash('sha256').update(await readFile(resolve(root, 'dist/bundle.js'))).digest('hex').slice(0, 12);
const browser = await launchChrome();
const EMPTY = /^(no |nothing|none|empty|not yet|pick |choose |select )|\b(yet|first|here|right now)\.?$|\bno one\b|appears? here|will show here/i;
const found = new Map(), errors = [];
try {
    const context = await browser.newContext({viewport: {width: 1920, height: 1080}}), page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/?test_hooks=1`);
    await page.evaluate(s => localStorage.setItem('save data', s), save);
    await page.reload();
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});
    await page.locator('#loading_screen_play_button').click();
    await page.waitForTimeout(1000);
    const seen = [];
    // A panel opened from the directory sits in .expanded-panel-view; read that view, else the page.
    const collect = async where => {
        const text = await page.evaluate(() => ([...document.querySelectorAll('.expanded-panel-view')].filter(n => n.offsetParent).pop() || document.body).innerText);
        seen.push(text);
        for (const raw of text.split('\n')) { const line = raw.trim(); if (line && line.length < 200 && EMPTY.test(line)) { if (!found.has(line)) found.set(line, new Set()); found.get(line).add(where); } }
        return text;
    };
    await collect('start');
    await page.screenshot({path: resolve(out, 'start.png')});
    const routes = await page.$$eval('button[data-route-id]', bs => [...new Set(bs.map(b => b.dataset.routeId))]);
    for (const id of routes) {
        const b = page.locator(`button[data-route-id="${id}"]`).first();
        if (!(await b.isVisible().catch(() => false))) continue;
        await b.click().catch(() => {}); await page.waitForTimeout(350);
        const text = await collect(id);
        if (process.env.DUMP) await writeFile(resolve(out, `route_${id.replace(/[^a-z0-9]+/gi, '_')}.txt`), text);
        for (const w of wanted) if (text.includes(w)) await page.screenshot({path: resolve(out, `${id.replace(/[^a-z0-9]+/gi, '_')}.png`)});
    }
    // Every other known panel, opened through the nav's own "All panels…" list.
    const more = page.locator('select[aria-label="Other known panels"]').first();
    const panels = await more.evaluate(sel => [...sel.options].filter(o => o.value).map(o => [o.value, o.textContent, o.disabled]));
    if (process.env.DUMP) await writeFile(resolve(out, 'panel_options.tsv'), panels.map(p => p.join('\t')).join('\n') + '\n');
    for (const [id] of panels) {
        await more.evaluate((sel, v) => { sel.value = v; sel.dispatchEvent(new Event('change')); }, id).catch(() => {});
        await page.waitForTimeout(300);
        await page.evaluate(() => { const v = [...document.querySelectorAll('.expanded-panel-view')].filter(n => n.offsetParent).pop(); v?.querySelectorAll('details:not([open])').forEach(d => { d.open = true; }); });
        await page.waitForTimeout(200);
        const text = await collect(`panel:${id}`);
        if (process.env.DUMP) await writeFile(resolve(out, `panel_${id.replace(/[^a-z0-9]+/gi, '_')}.txt`), text);
        for (const w of wanted) if (text.includes(w)) await page.screenshot({path: resolve(out, `panel_${id.replace(/[^a-z0-9]+/gi, '_')}.png`)});
    }
    const lines = [...found].map(([l, w]) => `${l}\t${[...w].join(',')}`).sort();
    await writeFile(resolve(out, 'empty_lines.tsv'), lines.join('\n') + '\n');
    const options = panels.map(p => p[1]).join('\n');
    const hits = wanted.map(w => ({text: w, onScreen: seen.some(t => t.includes(w)) || options.includes(w)}));
    console.log(JSON.stringify({bundle, viewport: '1920x1080', scenario: 'fresh-day3', seed: 7, routes: routes.length, lines: lines.length, errors, hits}, null, 1));
    console.log(lines.join('\n'));
} finally { await browser.close(); server.close(); }
