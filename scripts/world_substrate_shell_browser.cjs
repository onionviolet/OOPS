// W phase 2b receipt: the Village shell chamber's air, shell and inlet live on the
// world substrate. Fresh origin, 1920x1080, headless. Plays the meadow pen route,
// then checks the substrate slice through save, reload, Export and Import.
// Run after `npm run build` with the repo served on PROOF_URL (static server).
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const {launchChrome} = require('./ui_helpers.cjs');
const {startFresh} = require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = process.env.PROOF_URL || 'http://127.0.0.1:19471/?test_hooks=1';
const out = process.env.PROOF_OUT || path.join(__dirname, '../docs/gm/dispatch/foundation-w-2026-11-12/proof');
fs.mkdirSync(out, {recursive: true});
const lines = [];
const line = (name, ok, extra = '') => { lines.push({name, ok, extra}); console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`); };

(async () => {
    const browser = await launchChrome(), errors = [], missing = new Set();
    const cloth = '{"id":"Wool cloth"}';
    async function open() {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}});
        await context.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
        await context.addInitScript(() => {Date.now = () => 1792108800000; let n = 41; Math.random = () => ((n = Math.imul(n, 1664525) + 1013904223 >>> 0) / 4294967296);});
        const page = await context.newPage(); page.setDefaultTimeout(15000);
        page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
        page.on('response', r => { if (r.status() >= 400 && !/favicon|private_packs|fonts\/private\//.test(r.url())) errors.push(`${r.status()} ${r.url()}`); if (r.status() >= 400) missing.add(r.url()); });
        return {context, page};
    }
    const boot = async page => { await page.waitForFunction(() => window.simulationTestHooks); await page.evaluate(() => window.simulationTestHooks.pause()); await startFresh(page); };
    const snapshot = page => page.evaluate(() => window.simulationTestHooks.snapshot());
    const chamberOf = save => save.meadow_pen?.shellAnimal?.chamber;
    const terrapin = page => page.locator('[data-habitat-fact="terrapin"]').innerText();
    async function meadow(page) {
        await page.keyboard.press('Alt+r');
        if (!await page.locator('#projects_drawer').evaluate(n => n.open)) await page.locator('#projects_drawer > summary').click();
        if (!await page.locator('#meadow_pen_panel').evaluate(n => n.open)) await page.locator('#meadow_pen_panel > summary').click();
    }
    const humidityText = text => Number(/Humidity (\d+)%/.exec(text)?.[1]);
    try {
        let {context, page} = await open();
        await page.goto(url); await boot(page);
        // Fixture (named, SPR34): one Wool cloth and an enrolled simulation, as the existing PROOF_SHELL route seeds them.
        const seed = await snapshot(page);
        seed.inventories.person.main_character[cloth] = {count: 1};
        if (!seed.expansion.simulation) {
            const {enrollSimulation} = await import('../src/simulation.js');
            const {expeditionRegistry} = await import('../src/expedition_content.js');
            const {fieldContext} = await import('./field_fixtures.mjs');
            seed.expansion = enrollSimulation(seed.expansion, expeditionRegistry,
                fieldContext({state: seed.expansion, external: {money: seed.character.money}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}})).state;
        }
        await page.evaluate(save => localStorage.setItem('save data', JSON.stringify(save)), seed);
        await page.reload(); await boot(page);
        await meadow(page);
        const act = id => page.locator(`[data-habitat="${id}"]`).click();
        for (const id of ['build', 'rescue_shell', 'buy_feed', 'feed_shell', 'fit_inlet']) await act(id);
        await page.evaluate(n => window.advanceTicks(n, {render: true}), 2);
        await page.waitForFunction(() => document.querySelector('[data-habitat-fact="terrapin"]')?.textContent.includes('tucked'));
        const shown = await terrapin(page);
        await page.screenshot({path: path.join(out, '01-chamber-linked.png')});
        let s = await snapshot(page);
        const c0 = chamberOf(s);
        line('the chamber is a substrate world in the meadow_pen slice', c0?.schema === 'oops.world-substrate' && c0.revision === 1 && !s.meadow_pen.shellAnimal.regulator,
            JSON.stringify({schema: c0?.schema, revision: c0?.revision}));
        line('the panel shows the substrate humidity', Number.isFinite(humidityText(shown)), shown.replace(/\s+/g, ' ').slice(0, 200));
        // A shell action settles the chamber to now and stores it (the panel itself only projects, TMR7).
        await page.evaluate(n => window.advanceTicks(n, {render: true}), 3);
        await act('close_inlet');
        await page.evaluate(() => window.saveProgress());
        const stored = JSON.parse(await page.evaluate(() => localStorage.getItem('save data')));
        const saved = chamberOf(stored);
        const inlet = saved.holders['village.shell_chamber.inlet'].state['l.shell_regulator'];
        line('save writes the settled inlet and fitting on the substrate', inlet.mode === 'closed' && inlet.position === 'closed' && stored.meadow_pen.shellAnimal.fitting === cloth && saved.clock > c0.clock, JSON.stringify({clock: [c0.clock, saved.clock], inlet}));
        line('humidity has its sources on record', Object.keys(saved.holders['village.shell_chamber'].ledger.humidity ?? {}).length > 0,
            JSON.stringify(saved.holders['village.shell_chamber'].ledger.humidity));
        // Reload.
        await page.reload(); await boot(page); await meadow(page);
        s = await snapshot(page);
        line('reload restores the same chamber', JSON.stringify(chamberOf(s)) === JSON.stringify(saved), `clock ${chamberOf(s)?.clock}`);
        await page.screenshot({path: path.join(out, '02-reloaded.png')});
        // Export, then Import into a fresh origin.
        const encoded = await page.evaluate(() => window.save_to_file());
        await context.close();
        ({context, page} = await open());
        await page.goto(url);
        await page.locator('#saved_file_input').setInputFiles({name: 'w-chamber.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)});
        await page.waitForTimeout(4000);
        await boot(page); await meadow(page);
        s = await snapshot(page);
        line('import restores the same chamber', JSON.stringify(chamberOf(s)) === JSON.stringify(saved), `clock ${chamberOf(s)?.clock}`);
        // Time keeps working on the imported chamber.
        const before = humidityText(await terrapin(page));
        await page.evaluate(n => window.advanceTicks(n, {render: true}), 4);
        await act('link_inlet');
        s = await snapshot(page);
        const after = chamberOf(s), shownAfter = await terrapin(page);
        line('the imported chamber keeps settling and takes new hands on the inlet', after.clock > saved.clock && humidityText(shownAfter) > before &&
            after.holders['village.shell_chamber.inlet'].state['l.shell_regulator'].mode === 'linked',
            `clock ${saved.clock} -> ${after.clock}, humidity ${before} -> ${humidityText(shownAfter)}`);
        await page.screenshot({path: path.join(out, '03-imported-continued.png')});
        line('no page errors', errors.length === 0, errors[0] || `ignored 404s: ${[...missing].join(', ')}`);
        await context.close();
    } finally { await browser.close(); }
    const bundle = crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, '../dist/bundle.js'))).digest('hex').slice(0, 16);
    fs.writeFileSync(path.join(out, 'receipt.json'), JSON.stringify({route: 'Village meadow pen: shell chamber (fixture: one Wool cloth, enrolled simulation)',
        viewport: '1920x1080', headless: true, bundleSha256: bundle, lines}, null, 1) + '\n');
    if (lines.some(l => !l.ok)) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
