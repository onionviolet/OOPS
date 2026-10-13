// P3: an old save with no courtyard state. (a) A new game played briefly on the pre-integration build
// (base 4becff87, served on 19162) and exported; (b) the committed D1 fixture file. Each is imported on a fresh
// profile of the pre-integration build and of the rebuilt candidate; compare what loads.
const launch = async (tag) => {const c = await chromium.launchPersistentContext('/private/tmp/r15-g6-profile-p3-' + tag + '-' + Date.now(), {channel: 'chrome', headless: true, viewport: {width: 1600, height: 1100}, acceptDownloads: true});
    const p = c.pages()[0] || await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept()); return {c, p, errs};};
const playP = async p => {const b = p.locator('#loading_screen_play_button'); if (await b.isVisible().catch(() => false)) await b.click({noWaitAfter: true}); await p.waitForTimeout(800);};
const saveP = async p => {await p.locator('#save_button').click({noWaitAfter: true}); await p.waitForTimeout(300); return p.evaluate(() => JSON.parse(localStorage.getItem('save data')));};
const bundleOf = p => p.evaluate(() => [...document.scripts].map(s => s.src).find(s => s.includes('bundle')));
// (a) produce an old save on the pre-integration build by ordinary play.
const base = await launch('base-new');
await base.p.goto('http://127.0.0.1:19162/', {waitUntil: 'domcontentloaded'}); await base.p.waitForTimeout(2500);
await playP(base.p);
await base.p.locator('input').filter({visible: true}).first().fill('R15 G6 old save');
await base.p.getByText('Confirm', {exact: true}).click(); await base.p.waitForTimeout(6000);
const baseBundle = await bundleOf(base.p);
const old = await saveP(base.p);
const down = base.p.waitForEvent('download'); await base.p.locator('#save_to_file_button').click({noWaitAfter: true}); const d = await down;
const oldFile = path.join(h.evidence, 'P3-old-save-pre-integration.txt'); await d.saveAs(oldFile);
await base.c.close();
const files = {natural: oldFile, d1: path.join(h.root, 'docs/gm/d1-alloy-equipment-2026-10-07/fixture/TEST-FIXTURE-D1-smelting-9.txt')};
const strip = s => {const x = structuredClone(s); for (const k of ['saved_at', 'current time', 'total_playtime']) delete x[k]; if (x.expansion) {x.expansion.clock = 0; delete x.expansion.simulation;} delete x.life_record; delete x.npc_lives; return x;};
const out = {baseBundle};
for (const [name, file] of Object.entries(files)) {
    const results = {};
    for (const [build, url] of [['base', 'http://127.0.0.1:19162/'], ['candidate', 'http://127.0.0.1:19160/']]) {
        const t = await launch(name + '-' + build);
        await t.p.goto(url, {waitUntil: 'domcontentloaded'}); await t.p.waitForTimeout(2500);
        await t.p.locator('#saved_file_input').setInputFiles(file); await t.p.waitForTimeout(4000);
        const stored = await t.p.evaluate(() => JSON.parse(localStorage.getItem('save data') || 'null'));
        await playP(t.p);
        const loaded = await saveP(t.p);
        const panel = await t.p.evaluate(() => {const el = document.getElementById('management_panel'); return el ? {visible: !el.hidden && !!el.offsetParent, rows: [...el.querySelectorAll('section button')].filter(b => b.offsetParent).map(b => b.textContent)} : null;});
        results[build] = {stored: !!stored, loaded, panel, errors: t.errs, bundle: await bundleOf(t.p), location: loaded?.['current location']};
        await t.c.close();
    }
    const a = results.base.loaded, b = results.candidate.loaded;
    const keys = [...new Set([...Object.keys(strip(a)), ...Object.keys(strip(b))])];
    const differing = keys.filter(k => JSON.stringify(strip(a)[k]) !== JSON.stringify(strip(b)[k]));
    const mgKeys = JSON.stringify(b).match(/"mg\.[a-z]/g) || [];
    out[name] = {differing, mgKeysInCandidate: mgKeys.length, candidatePanel: results.candidate.panel, base: {errors: results.base.errors, bundle: results.base.bundle, money: a?.character?.money, location: results.base.location},
        candidate: {errors: results.candidate.errors, bundle: results.candidate.bundle, money: b?.character?.money, location: results.candidate.location},
        expansionSimulationEqual: JSON.stringify(a?.expansion?.simulation?.people) === JSON.stringify(b?.expansion?.simulation?.people)};
}
h.write('P3-old-save.json', out);
return out;
