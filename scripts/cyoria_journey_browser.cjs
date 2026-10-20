// Cyoria (Mother of Learning) journey on a rebuilt bundle, fresh origin, 1920x1080 (WA17, AR9).
// Usage: YAIRPG_PROOF_URL=http://127.0.0.1:PORT/ node scripts/cyoria_journey_browser.cjs [digest.json]
// Drives the real feature panel rows (chart, enroll, enter, work, buy, study, assemble, calibrate, return),
// then saves, reloads and writes a normalized digest so before and after bundles can be diffed.
// Known gap: the panel's host section is hidden in the current layout, so the script unhides it (see TASK_RECORD).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {launchChrome} = require('./ui_helpers.cjs');
const url = (process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18802/').replace(/\/?$/, '/') + 'index.html?test_hooks=1';
const SECTION = 'feature-book.mol.campaign';
const STEPS = [
    ['book.mol.chart'], ['book.mol.enroll'], ['book.mol.enter'], ['book.mol.arrival'], ['book.mol.move.house'], ['book.mol.house_meet'],
    ['book.mol.house_shift', 5], ['book.mol.meal', 2], ['book.mol.move.academy'], ['book.mol.ilsa_meet'],
    ['book.mol.guest_pass', 2], ['book.mol.mana_assessment', 3], ['book.mol.paper'], ['book.mol.ink'],
    ['book.mol.move.library'], ['book.mol.library_meet'], ['book.mol.study_invocation', 3], ['book.mol.catalog_shift', 6], ['book.mol.move.academy'], ['book.mol.cube'],
    ['book.mol.move.workshop'], ['book.mol.study_formula', 4], ['book.mol.assemble_lamp', 6], ['book.mol.charge_1', 3],
    ['book.mol.move.court'], ['book.mol.control_drill', 4], ['book.mol.move.workshop'], ['book.mol.lamp_test'],
    ['book.mol.move.station'], ['book.mol.return']];
(async () => {
    const browser = await launchChrome();
    const errors = [], log = [];
    try {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}});
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        page.on('pageerror', e => errors.push(e.message));
        page.on('console', m => { if(['warning', 'error'].includes(m.type()) && !/404/.test(m.text())) log.push('console: ' + m.text().slice(0, 200)); });
        await page.goto(url);
        await page.getByText('PLAY', {exact: true}).click();
        await page.getByRole('button', {name: 'Talk to someone'}).click();
        await page.locator('[data-dialogue="villageElder"]').click();
        await page.locator('[data-textline="hello"]').click();
        await page.locator('#center_mode_back').click();
        const unhide = () => page.evaluate(() => {for(let n = document.getElementById('adventure_notebook'); n && n !== document.body; n = n.parentElement) n.hidden = false;});
        const rows = () => page.evaluate(sec => [...document.querySelectorAll(`[data-action-legibility="${sec}"] [data-action-legibility-key]`)].map(r => {
            const b = r.matches('button') ? r : r.querySelector('button');
            return {id: r.dataset.actionLegibilityKey.replace(/^action:/, ''), disabled: !b || b.disabled || b.getAttribute('aria-disabled') === 'true', text: r.textContent.trim().slice(0, 90)};
        }), SECTION);
        await unhide();
        // In-page click: the card's own handler runs; the panel notice is read in the same turn, before any re-render.
        const click = id => page.evaluate(({sec, id}) => {
            const b = document.querySelector(`[data-action-legibility="${sec}"] [data-action-legibility-key="action:${id}"] button`);
            if(!b) return null;
            b.click();
            const n = document.querySelector('#feature_expansion_panel .expedition_notice');
            return n && !n.hidden && n.textContent !== 'Progress saved.' ? n.textContent : '';
        }, {sec: SECTION, id});
        const advance = minutes => page.evaluate(m => advanceTicks(m), minutes);
        let done = 0;
        for(const [id, minutes] of STEPS) {
            let row;
            for(let i = 0; i < 20 && !(row = (await rows()).find(r => r.id === id && !r.disabled)); i++) { await unhide(); await advance(1); await page.waitForTimeout(700); }
            if(!row) { log.push('loc=' + await page.evaluate(() => simulationTestHooks.snapshot().expansion.simulation.people.player.location) + ' notice=' + await page.evaluate(() => document.querySelector('#feature_expansion_panel .expedition_notice')?.textContent)); log.push('why: ' + await page.evaluate(({sec, id}) => document.querySelector(`[data-action-legibility="${sec}"] [data-action-legibility-key="action:${id}"] .action-legibility__blockers`)?.textContent, {sec: SECTION, id})); log.push(`STOP at ${id}: ` + JSON.stringify((await rows()).map(r => r.id + (r.disabled ? '(off)' : '')))); break; }
            // A click counts once the player's own state moved (the first click after a state change can be dropped,
            // and a click while earlier work runs is refused): unhide, let a minute pass, then click again.
            const state = () => page.evaluate(() => { const e = simulationTestHooks.snapshot().expansion, p = e.actors.player;
                return JSON.stringify([p.completed, p.resources, p.facts, e.simulation?.people?.player?.location, e.simulation?.jobs?.length, !!e.motherOfLearning, e.motherOfLearning?.activeVisitId]); });
            const before = await state();
            for(let attempt = 0; attempt < 8 && (await state()) === before; attempt++) {
                await unhide(); await advance(1); await page.waitForTimeout(300);
                const immediate = await click(id);
                assert.notEqual(immediate, null, id);
                if(immediate) log.push(`${id}: ${immediate}`);
                await page.waitForTimeout(500);
            }
            assert.notEqual(await state(), before, `${id} did not commit`);
            await advance((minutes || 1) + 1);
            await page.waitForTimeout(700);
            const notice = await page.evaluate(() => document.querySelector('#feature_expansion_panel .expedition_notice')?.textContent || '');
            if(notice && notice !== 'Progress saved.') log.push(`${id}: ${notice}`);
            done++;
        }
        const digest = async () => page.evaluate(() => {
            const s = simulationTestHooks.snapshot(), e = s.expansion, sim = e.simulation || {};
            const strip = o => JSON.parse(JSON.stringify(o, (k, v) => ['at', 'bornAt', 'rng', 'seed', 'streams', 'saved_at', 'journeyId',
                // retries pass a varying number of game minutes, so absolute time is not part of the comparison
                'clock', 'acquiredAt', 'nativeRevision', 'revision', 'elapsed', 'observedAt', 'exitedAt', 'enteredAt', 'initializedAt'].includes(k) ? undefined : v));
            return strip({done: null, clock: e.clock, worlds: e.worlds, player: e.actors?.player, mol: e.motherOfLearning,
                people: sim.people, knowledgeKeys: Object.keys(sim.knowledge?.player || {}).filter(k => k.startsWith('book.mol.')).sort(),
                inv: s.inventories?.book_world_mol, character: s.character?.name, loc: s['current location'], quests: s.quests && Object.keys(s.quests).filter(k => /mol/i.test(k))});
        });
        const d1 = await digest();
        d1.done = done;
        await page.evaluate(() => window.saveProgress());
        await page.reload();
        await page.getByText('PLAY', {exact: true}).click();
        await page.waitForTimeout(1000);
        const d2 = await digest();
        d2.done = done;
        const reloadSame = JSON.stringify(d1) === JSON.stringify(d2);
        if(!reloadSame) { const paths = []; (function walk(x, y, p) { if(JSON.stringify(x) === JSON.stringify(y)) return;
            if(x && y && typeof x === 'object' && typeof y === 'object') for(const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], p + '.' + k);
            else paths.push(`${p}: ${JSON.stringify(x)?.slice(0, 50)} | ${JSON.stringify(y)?.slice(0, 50)}`); })(d1, d2, ''); log.push('reload diff: ' + paths.slice(0, 8).join('; ')); }
        // Export encodes the save exactly as the Export button does; Import feeds those bytes back through the file input.
        const encoded = await page.evaluate(() => window.save_to_file());
        assert.ok(encoded, 'export produced a file');
        await Promise.all([page.waitForNavigation(), page.locator('#saved_file_input').setInputFiles({name: 'cyoria-journey.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]);
        await page.getByText('PLAY', {exact: true}).click();
        await page.waitForTimeout(1500);
        const d3 = await digest();
        d3.done = done;
        const importSame = JSON.stringify(d1) === JSON.stringify(d3);
        if(!importSame) log.push('import mismatch: ' + JSON.stringify(d3).slice(0, 200));
        const out = {url, importSame, stepsDone: done, stepsTotal: STEPS.length, log, errors: errors.filter(m => !/404/.test(m)), reloadSame, digest: d1};
        fs.writeFileSync(process.argv[2] || '/dev/stdout', JSON.stringify(out, null, 1));
        console.error(`steps ${done}/${STEPS.length}; reloadSame=${reloadSame}; importSame=${importSame}; errors=${out.errors.length}; ${log.join(' ')}`);
    } finally { await browser.close(); }
})();
