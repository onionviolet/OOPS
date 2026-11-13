// DEV/TEST ONLY: open a named world fixture (scripts/headless/world_fixtures.mjs) in headless Chrome at 1920x1080 from a fresh origin.
// The fixture is built (or read from the cache) through scenarios.mjs, stored as the origin's only save, and the page boots it through
// the normal load path. Lanes import `openFixture` and play their changed behaviour from there; the fixture is setup, not proof.
//   npm run build && node scripts/fixture_browser.cjs <name|all> [--out dir]
// Prints one JSON line per fixture: build (or cache) seconds, browser load seconds, the check it made, page errors.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const {launchChrome} = require('./ui_helpers.cjs');
const ROOT = path.resolve(__dirname, '..');
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
    '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json', '.ink': 'text/plain', '.txt': 'text/plain'};

/** A static server over the checkout (index.html, dist/, private_packs/ when linked). Resolves to {base, close}. */
function serveCheckout(root = ROOT) {
    const server = http.createServer((req, res) => {
        const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        let file = path.join(root, rel);
        if(!file.startsWith(root)) {res.statusCode = 403; return res.end();}
        if(fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        fs.readFile(file, (e, d) => {
            if(e) {res.statusCode = 404; return res.end();}
            res.setHeader('content-type', TYPES[path.extname(file)] || 'application/octet-stream'); res.end(d);
        });
    });
    return new Promise(r => server.listen(0, '127.0.0.1', () => r({base: `http://127.0.0.1:${server.address().port}`, close: () => server.close()})));
}

/** Save text for a fixture through the scenario library (built and verified once per source stamp). */
async function fixtureSave(name, {seed = 1} = {}) {
    const {scenarioSave, SCENARIOS} = await import('./headless/scenarios.mjs');
    if(!SCENARIOS[name]?.fixture) throw new Error(`${name} is not a world fixture.`);
    return scenarioSave(name, {seed});
}

/** On a fresh page: store the fixture as the origin's only save, boot it, press PLAY with the engine paused. */
async function openFixture(page, {base, name, text, seed = 1}) {
    text ??= await fixtureSave(name, {seed});
    await page.goto(`${base}/robots.txt`);                           // same origin, no game yet
    // The headless build stamps saved_at with its frozen wall clock; restamp it to the page's now (the format main.js get_date writes)
    // so the away-time bank sees no absence. Wall metadata only: the game state is untouched.
    await page.evaluate(v => {
        const s = JSON.parse(v), d = new Date(), p = n => String(n).padStart(2, '0');
        s.saved_at = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}_${p(d.getMinutes())}_${p(d.getSeconds())}`;
        localStorage.clear(); localStorage.setItem('save data', JSON.stringify(s));
    }, text);
    await page.goto(`${base}/?test_hooks=1`);
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 120000});
    await page.evaluate(() => window.simulationTestHooks.pause());
    await page.locator('#loading_screen_play_button').click();
    await page.waitForTimeout(600);
    return text;
}

/** Open a panel through the More panels select (the one the headless fixtures use), then any other navigation select. */
async function openPanel(page, id) {
    for(const sel of ['#workspace_navigation select[aria-label="Other known panels"]', '#workspace_navigation select']) {
        const s = page.locator(sel).first();
        if(await s.count() && await s.locator(`option[value="${id}"]`).count()) return s.selectOption(id);
    }
    throw new Error(`No navigation select offers the ${id} panel.`);
}

module.exports = {serveCheckout, fixtureSave, openFixture, openPanel};

if(require.main === module) (async () => {
    const args = process.argv.slice(2), outAt = args.indexOf('--out');
    const out = outAt >= 0 ? args[outAt + 1] : 'docs/gm/dispatch/world-fixtures-2026-11-10';
    const {WORLD_FIXTURES} = await import('./headless/world_fixtures.mjs');
    const names = args[0] === 'all' ? Object.keys(WORLD_FIXTURES) : [args[0]];
    if(!names[0] || !names.every(n => WORLD_FIXTURES[n])) throw new Error(`Name a fixture or "all": ${Object.keys(WORLD_FIXTURES).join(', ')}`);
    fs.mkdirSync(out, {recursive: true});
    const server = await serveCheckout(), browser = await launchChrome(), results = [];
    let failed = false;
    try {
        for(const name of names) {
            const def = WORLD_FIXTURES[name], errors = [], t0 = performance.now();
            const text = await fixtureSave(name);
            const buildS = (performance.now() - t0) / 1000;
            const context = await browser.newContext({viewport: {width: 1920, height: 1080}});   // fresh origin storage per fixture
            const page = await context.newPage(); page.setDefaultTimeout(30000);
            page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.dismiss());
            const t1 = performance.now();
            let check = 'not reached', ok = false;
            try {
                await openFixture(page, {base: server.base, name, text});
                const day = await page.evaluate(() => window.simulationTestHooks.snapshot()['current time'].day_count);
                const want = JSON.parse(text)['current time'].day_count;
                if(def.view.panel) await openPanel(page, def.view.panel);
                await page.waitForTimeout(400);
                if(def.view.tab) await page.locator(def.view.tab).first().click();
                if(def.view.open) { // a closed disclosure the state sits in (true: the panel's own): click its summary as a player would
                    const sum = def.view.open === true ? page.locator(`${def.view.sel} > summary`).first()
                        : page.locator(`${def.view.sel} summary`, {hasText: def.view.open}).first();
                    if(!await sum.evaluate(el => el.parentElement.open)) await sum.click();
                    await page.waitForTimeout(300);
                }
                const shown = await page.locator(def.view.sel).first().innerText().catch(() => '');
                ok = day === want && def.view.text.test(shown) && !errors.length;
                check = `day ${day} (fixture ${want}); ${def.view.sel} ${def.view.text.test(shown) ? 'shows' : 'LACKS'} ${def.view.text}`;
                await page.locator(def.view.sel).first().scrollIntoViewIfNeeded().catch(() => {});
                await page.screenshot({path: path.join(out, `${name}.png`)});
            } catch(e) {check += `; ${e.message.split('\n')[0]}`;}
            const row = {name, route: def.route, ok, fixtureS: +buildS.toFixed(1), browserLoadS: +((performance.now() - t1) / 1000).toFixed(1), check, errors};
            results.push(row); failed ||= !ok;
            process.stdout.write(JSON.stringify(row) + '\n');
            await context.close();
        }
    } finally {await browser.close(); server.close();}
    if(names.length > 1 || args.includes('--log')) fs.writeFileSync(path.join(out, 'browser-run.json'), JSON.stringify(results, null, 1));
    process.exitCode = failed ? 1 : 0;
})().catch(e => {console.error('FAIL', e.message); process.exit(1);});
