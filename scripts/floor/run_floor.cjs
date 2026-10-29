#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const {launchChrome} = require('../ui_helpers.cjs');
const {budgetViolations} = require('./budgets.cjs');

const ROOT = path.resolve(__dirname, '../..');
const value = (args, name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
function parseArgs(args) {
    const viewport = value(args, '--viewport', '1920x1080').split('x').map(Number);
    if (viewport.length !== 2 || viewport.some(n => !Number.isInteger(n) || n < 320)) throw new Error('--viewport must be WIDTHxHEIGHT');
    return {
        book: value(args, '--book', 'lotm'), profile: value(args, '--profile', 'beside'),
        buildOut: path.resolve(value(args, '--build-out', process.env.BUILD_OUT || path.join(os.tmpdir(), 't1-floor-build'))),
        out: path.resolve(value(args, '--out', path.join(os.tmpdir(), 't1-floor'))),
        pack: path.resolve(value(args, '--pack', path.join(ROOT, 'private_packs/lotm-cast/cast.json'))),
        origin: value(args, '--origin', `http://127.0.0.1:${20000 + crypto.randomInt(30000)}`),
        viewport: {width: viewport[0], height: viewport[1]}, budget: value(args, '--budget', null),
        build: args.includes('--build'), naturalMinutes: Number(value(args, '--natural-minutes', '60')),
        waitMinutes: Number(value(args, '--wait-minutes', '349')),
    };
}
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const isWithin = (parent, child) => { const rel = path.relative(parent, child); return rel === '' || (!rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel)); };
function requirePrivateOutput(target, label) {
    const novelPrivate = path.join(ROOT, 'docs/research/novels');
    const inNovelPrivate = isWithin(novelPrivate, target) && path.relative(novelPrivate, target).split(path.sep).includes('private');
    const inTemp = [os.tmpdir(), '/tmp', '/private/tmp'].some(parent => isWithin(parent, target));
    if (!inNovelPrivate && !inTemp) throw new Error(`${label} must be under a novel private folder or a temporary directory`);
}
const gameMinute = s => s['current time'].day_count * 1440 + s['current time'].hour * 60 + s['current time'].minute;
// Compare saves by meaning: key order, the save timestamp, time-driven skill tracking and
// zero, false or empty fills that load restores are not state changes (known limit, AD45: refine when a
// real difference hides here).
const canonical = v => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object'
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])]).filter(([, x]) => !(x === 0 || x === false || x === null || (Array.isArray(x) ? !x.length : typeof x === 'object' && !Object.keys(x).length)))) : v;
const withoutNaturalClock = save => { const copy = structuredClone(save); delete copy['current time']; delete copy.saved_at; if (copy.skillRecords) delete copy.skillRecords.tracked; return canonical(copy); };

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.book !== 'lotm' || opts.profile !== 'beside') throw new Error('This floor currently supports --book lotm --profile beside');
    if (!Number.isInteger(opts.naturalMinutes) || opts.naturalMinutes <= 0 || !Number.isInteger(opts.waitMinutes) || opts.waitMinutes <= 0) throw new Error('time measurements must be positive whole minutes');
    requirePrivateOutput(opts.out, '--out');
    requirePrivateOutput(opts.buildOut, '--build-out');
    fs.mkdirSync(opts.out, {recursive:true});
    if (opts.build || !fs.existsSync(path.join(opts.buildOut, 'index.html'))) {
        fs.mkdirSync(opts.buildOut, {recursive:true});
        execFileSync(process.execPath, ['build.js'], {cwd:ROOT, env:{...process.env, BUILD_OUT:opts.buildOut}, stdio:'inherit'});
    }
    const bundle = fs.readFileSync(path.join(opts.buildOut, 'dist/bundle.js'));
    const receipt = {schema:'yairpg-floor/1.0', book:opts.book, profile:opts.profile, viewport:`${opts.viewport.width}x${opts.viewport.height}`,
        routeKind:'natural', reviewState:'agent-verified', bundleSha256:sha256(bundle), pageErrors:[], checks:[]};
    const origin = new URL(opts.origin).origin;
    let browser;
    try {
        browser = await launchChrome();
        const context = await browser.newContext({viewport:opts.viewport, acceptDownloads:true});
        await context.route(`${origin}/**`, async route => {
            const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
            const file = path.resolve(opts.buildOut, pathname === '/' ? 'index.html' : `.${pathname}`);
            if (!file.startsWith(opts.buildOut + path.sep) && file !== path.join(opts.buildOut, 'index.html')) return route.fulfill({status:403, body:''});
            try { await route.fulfill({path:file, contentType:({'.js':'text/javascript','.json':'application/json','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream'}); }
            catch { await route.fulfill({status:404, body:''}); }
        });
        const page = await context.newPage();
        page.on('pageerror', error => receipt.pageErrors.push(error.message));
        const url = `${origin}/?test_hooks=1`;
        const pause = () => page.evaluate(() => window.simulationTestHooks.pause());
        const resume = () => page.evaluate(() => window.simulationTestHooks.resume());
        const stableClick = async locator => { await pause(); try { await locator.waitFor({state:'visible', timeout:15000}); await locator.click({timeout:15000}); } finally { await resume(); } };
        const play = async () => {
            await page.locator('#loading_screen_play_button:not(.none_display)').waitFor({state:'visible', timeout:30000});
            await page.locator('#loading_screen_play_button:not(.none_display)').click();
            await page.waitForFunction(() => !!document.querySelector('#location_actions_div .location_choice_dropdown'), null, {timeout:30000});
        };
        const packLoadStart = performance.now();
        await page.goto(url, {waitUntil:'domcontentloaded'});
        await page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout:30000});
        await play();
        await page.getByRole('combobox', {name:'Other known panels'}).selectOption(opts.book);
        const panel = page.locator('#lotm_panel:visible').first();
        await stableClick(panel.locator('[data-lotm="pick_beside"]:visible').first());
        await stableClick(panel.locator('[data-lotm="enroll_beside"]:visible').first());
        await page.waitForFunction(() => !!window.simulationTestHooks.snapshot().expansion?.lotm, null, {timeout:60000});
        receipt.packLoadMs = Math.round(performance.now() - packLoadStart);
        receipt.checks.push('fresh life entered the beside-the-lead start; LOTM pack loaded');
        const naturalStart = await page.evaluate(() => window.simulationTestHooks.snapshot());
        const tickrate = await page.evaluate(() => window.simulationTestHooks.tickrate() || 1);
        const t0 = performance.now();
        await page.waitForTimeout(opts.naturalMinutes * 1000 / tickrate + 250);
        const naturalEnd = await page.evaluate(() => window.simulationTestHooks.snapshot());
        const advanced = Math.max(1, gameMinute(naturalEnd) - gameMinute(naturalStart));
        receipt.naturalMinutesMeasured = advanced;
        receipt.msPerGameMinute = Math.round((performance.now() - t0) / advanced);
        receipt.checks.push(`natural play advanced ${advanced} game minutes`);

        const pack = JSON.parse(fs.readFileSync(opts.pack, 'utf8'));
        const entry = Object.entries(pack.reports).find(([id, report]) => report.present && pack.bindings.beats.find(beat => beat.id === id)?.knows?.some(k => k.witnesses?.includes('present'))
            && pack.bindings.days.some(day => day.day === 1 && day.from === 360 && day.scene === pack.bindings.beats.find(beat => beat.id === id)?.scene));
        if (!entry) throw new Error('Private LOTM fixture has no day-one witness beat for the floor route');
        const beat = pack.bindings.beats.find(candidate => candidate.id === entry[0]);
        const person = pack.people.find(candidate => candidate.id === beat.actor);
        const place = pack.places.find(candidate => candidate.id === entry[1].present.places[0]);
        if (!person || !place) throw new Error('Private LOTM fixture cannot resolve the selected witness beat');
        await stableClick(panel.locator(`[data-lotm="lotm.move.${place.id}"]:visible`).first());
        await page.waitForFunction(id => window.simulationTestHooks.snapshot().expansion.simulation.people.player.location === id, place.id, {timeout:600000});
        await stableClick(panel.locator(`[data-lotm="book.lotm.cast_talk_${person.indexId.split('.').at(-1)}"]:visible`).first());
        const elapsed = () => page.evaluate(() => { const e=window.simulationTestHooks.snapshot().expansion; return e.clock-e.lotm.initializedAt; });
        const waitStartGame = await elapsed();
        let waitClicks = 0;
        const waitWallStart = performance.now();
        while (await elapsed() - waitStartGame < opts.waitMinutes) {
            const waitButton = panel.locator('[data-lotm^="wait.until."]:visible').first();
            await waitButton.waitFor({state:'visible', timeout:60000});
            await pause();
            try { await waitButton.evaluate(button => button.click()); }
            finally { await resume(); }
            waitClicks++;
            if (waitClicks > 20) throw new Error('wait-until route did not reach the requested game time within 20 actions');
        }
        receipt[`wait${opts.waitMinutes}Ms`] = Math.round(performance.now() - waitWallStart);
        receipt.waitGameMinutes = await elapsed() - waitStartGame;
        receipt.waitClicks = waitClicks;
        await pause();
        await page.screenshot({path:path.join(opts.out, 'floor-1920.png'), fullPage:true});
        await page.locator('#save_button').click();
        const savedState = await page.evaluate(() => window.simulationTestHooks.snapshot());
        const rawSave = await page.evaluate(() => localStorage.getItem('save data'));
        if (!rawSave) throw new Error('Save button did not write durable save data');
        receipt.saveBytes = Buffer.byteLength(rawSave);
        const exportText = await page.evaluate(() => window.save_to_file());
        if (!exportText) throw new Error('Export returned no save data');
        fs.writeFileSync(path.join(opts.out, 'floor-export.txt'), exportText);
        await page.reload({waitUntil:'domcontentloaded'});
        await page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout:30000});
        await play();
        await pause();
        const reloaded = await page.evaluate(() => window.simulationTestHooks.snapshot());
        if (JSON.stringify(withoutNaturalClock(reloaded)) !== JSON.stringify(withoutNaturalClock(savedState))) { fs.writeFileSync(path.join(opts.out, 'diff-saved.json'), JSON.stringify(withoutNaturalClock(savedState), null, 1)); fs.writeFileSync(path.join(opts.out, 'diff-reloaded.json'), JSON.stringify(withoutNaturalClock(reloaded), null, 1)); }
        if (JSON.stringify(withoutNaturalClock(reloaded)) !== JSON.stringify(withoutNaturalClock(savedState))) throw new Error('Save/reload state differs outside the natural clock');
        const chooser = page.waitForEvent('filechooser');
        await page.locator('#load_from_file_button').click();
        const fileChooser = await chooser;
        await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}), fileChooser.setFiles({name:'floor-export.txt', mimeType:'text/plain', buffer:Buffer.from(exportText)})]);
        await page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout:30000});
        await play();
        await pause();
        const imported = await page.evaluate(() => window.simulationTestHooks.snapshot());
        if (JSON.stringify(withoutNaturalClock(imported)) !== JSON.stringify(withoutNaturalClock(savedState))) throw new Error('Export/Import state differs outside the natural clock');
        receipt.checks.push('Save, reload, Export and Import preserved state outside natural clock');
        receipt.checks.push(`${opts.waitMinutes}-minute wait route advanced ${receipt.waitGameMinutes} minutes in ${receipt[`wait${opts.waitMinutes}Ms`]} ms`);
        if (receipt.pageErrors.length) throw new Error(`page errors: ${receipt.pageErrors.join(' | ')}`);
        await context.close();
    } finally { await browser?.close().catch(() => {}); }
    receipt.gaps = ['one LOTM world/profile per invocation', 'state comparison excludes the natural clock, save timestamp, time-driven skill tracking and zero or empty fills', 'no human play review'];
    fs.writeFileSync(path.join(opts.out, 'floor-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
    if (opts.budget) {
        const budgets = JSON.parse(fs.readFileSync(opts.budget, 'utf8'));
        const violations = budgetViolations(receipt, budgets.max || budgets);
        if (violations.length) throw new Error(`floor budget exceeded: ${violations.join('; ')}`);
    }
    console.log(JSON.stringify(receipt, null, 2));
}

main().catch(error => { console.error(`run_floor: ${error.message}`); process.exitCode = 1; });
