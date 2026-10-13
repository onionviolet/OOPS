// P3 follow-up: which availability entries differ between base and candidate after loading the same old save,
// and whether base itself differs between two loads (timing noise).
const launch = async tag => {const c = await chromium.launchPersistentContext('/private/tmp/r15-g6-profile-p3b-' + tag + '-' + Date.now(), {channel: 'chrome', headless: true, viewport: {width: 1600, height: 1100}}); const p = c.pages()[0] || await c.newPage(); p.on('dialog', d => d.accept()); return {c, p};};
const file = path.join(h.evidence, 'P3-old-save-pre-integration.txt');
const loads = {};
for (const [tag, url] of [['base1', 'http://127.0.0.1:19162/'], ['base2', 'http://127.0.0.1:19162/'], ['cand', 'http://127.0.0.1:19160/']]) {
    const t = await launch(tag);
    await t.p.goto(url, {waitUntil: 'domcontentloaded'}); await t.p.waitForTimeout(2500);
    await t.p.locator('#saved_file_input').setInputFiles(file); await t.p.waitForTimeout(4000);
    const stored = await t.p.evaluate(() => JSON.parse(localStorage.getItem('save data')).availabilities);
    const b = t.p.locator('#loading_screen_play_button'); if (await b.isVisible().catch(() => false)) await b.click({noWaitAfter: true}); await t.p.waitForTimeout(800);
    await t.p.locator('#save_button').click({noWaitAfter: true}); await t.p.waitForTimeout(300);
    loads[tag] = {stored, loaded: await t.p.evaluate(() => JSON.parse(localStorage.getItem('save data')).availabilities)};
    await t.c.close();
}
const flat = o => Object.fromEntries(Object.entries(o || {}).flatMap(([k, v]) => typeof v === 'object' && v ? Object.entries(v).map(([k2, v2]) => [k + '/' + k2, JSON.stringify(v2)]) : [[k, JSON.stringify(v)]]));
const diff = (x, y) => {const a = flat(x), b = flat(y); return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => a[k] !== b[k]).map(k => [k, a[k], b[k]]);};
const r = {base1VsBase2: diff(loads.base1.loaded, loads.base2.loaded), baseVsCandidate: diff(loads.base1.loaded, loads.cand.loaded), storedVsLoadedCandidate: diff(loads.cand.stored, loads.cand.loaded).length};
h.write('P3-availabilities.json', r);
return r;
