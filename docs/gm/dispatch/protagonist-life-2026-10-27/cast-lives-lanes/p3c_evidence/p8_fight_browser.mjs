// MR2 browser floor: fresh origin, 1920x1080, real clicks, Save and reload.
import {createServer} from 'node:http';
import {readFile, mkdtemp, mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join, resolve, extname} from 'node:path';
import {createHash} from 'node:crypto';
const ROOT = '/Users/weiwei/code/yet-another-idle-rpg';
const require = createRequire(join(ROOT, 'scripts/x.cjs'));
const {build} = require('esbuild');
const {launchChrome, openNotebook} = require(join(ROOT, 'scripts/ui_helpers.cjs'));
const OUT = process.argv[2];
await mkdir(OUT, {recursive: true});
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'};
const bundleDir = process.env.KEEP_BUNDLE || await mkdtemp(join(tmpdir(), 'p4-bundle-')); await mkdir(bundleDir, {recursive: true});
await build({entryPoints: [join(ROOT, 'src/main.js')], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: false, outfile: join(bundleDir, 'bundle.js'), logLevel: 'error'});
const bundleHash = createHash('sha256').update(await readFile(join(bundleDir, 'bundle.js'))).digest('hex');
const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.startsWith('/dist/bundle.js') ? join(bundleDir, 'bundle.js') : resolve(ROOT, '.' + (path === '/' ? '/index.html' : path));
    try { res.writeHead(200, {'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'}).end(await readFile(file)); }
    catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/?test_hooks=1`;
const browser = await launchChrome();
const errors = [], report = {bundleHash, viewport: '1920x1080'};
let context, page;
const open = async seed => {
    await context?.close();
    context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.addInitScript(() => {
        const Native = window.MutationObserver; const stats = window.__mo = [];
        window.MutationObserver = class extends Native { constructor(cb) { const rec = {site: (new Error().stack || '').split('\n').slice(2, 4).join(' | ').replace(/https?:[^ )]*\//g, ''), calls: 0, sample: []}; stats.push(rec);
            super((list, o) => { rec.calls++; if (rec.sample.length < 12 && window.__moOn) rec.sample.push(list.slice(0, 8).map(m => m.type + ':' + (m.attributeName || '') + ':' + (m.target.id || m.target.className || m.target.localName) + (m.addedNodes.length ? ' +' + [...m.addedNodes].map(n => n.className || n.localName).join(',') : '') + (m.removedNodes.length ? ' -' + [...m.removedNodes].map(n => n.className || n.localName).join(',') : '')).join(' ; ')); return cb(list, o); }); } };
    });
    if (seed) await context.addInitScript(d => { if (!sessionStorage.getItem('s')) { localStorage.setItem('save data', d); sessionStorage.setItem('s', '1'); } }, seed);
    page = await context.newPage(); page.setDefaultTimeout(60000);
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });
    await page.goto(url, {timeout: 120000, waitUntil: 'domcontentloaded'});
    const play = page.locator('#loading_screen_play_button');
    await play.waitFor({state: 'visible', timeout: 180000});
    await page.evaluate(() => window.simulationTestHooks?.pause());
    await play.click();
    const confirm = page.locator('#hero_creation_panel_confirmation');
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await page.waitForTimeout(500);
};
const tick = () => page.evaluate(() => window.advanceTicks?.(1));
const click = async sel => { await page.locator(sel).first().click({noWaitAfter: true, timeout: 8000}).catch(() => page.evaluate(sel => document.querySelector(sel)?.click(), sel)); await tick(); await page.waitForTimeout(300); };
const save = async () => { await page.evaluate(() => window.saveProgress()); return page.evaluate(() => localStorage.getItem('save data')); };
const workshop = async () => {
    if (!await page.locator('#notebook_box_div').isVisible().catch(() => false))
        await page.locator(':is(button,a,[role=tab],[role=button]):visible', {hasText: /^Notebook$/}).first().click();
    await page.waitForTimeout(400);
    await page.locator('[data-notebook-view="people"]').first().click();
    await page.evaluate(() => { const p = document.getElementById('simulation_panel'); if (p) p.open = true; });
    await tick(); await page.waitForTimeout(300);
};
const fixtures = await import(join(ROOT, 'scripts/field_fixtures.mjs'));
const panelOpen = async () => {
    const shown = () => page.evaluate(() => { const b = document.querySelector('#tempo_fight_panel'); return !!b && b.offsetParent !== null && b.getBoundingClientRect().height > 0; });
    if (!await shown()) { await page.locator('#workspace_navigation').getByText('Notebook', {exact: true}).first().click({timeout: 8000, noWaitAfter: true}).catch(() => {}); await page.waitForTimeout(500); }
    if (!await shown()) { await page.locator('[data-notebook-view="people"]').first().click({timeout: 4000, noWaitAfter: true}).catch(() => {}); }
    await page.evaluate(() => { const p = document.getElementById('tempo_fight_panel'); if (p) p.open = true; }); await page.waitForTimeout(200);
};
const clickBox = async sel => { await panelOpen();
    const hit = await page.evaluate(sel => { const b = document.querySelector(sel); if (!b || b.hidden || b.disabled) return {missing: true}; let res; for (const block of ['center', 'end', 'start', 'nearest']) { b.scrollIntoView({block}); const r = b.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2, top = document.elementFromPoint(x, y); res = {x, y, ok: top === b || b.contains(top), cover: top ? (top.id || top.className || top.tagName) : null}; if (res.ok) break; } return res; }, sel);
    if (hit.missing) throw new Error('control unavailable: ' + sel);
    if (!hit.ok) { report.coverNote = hit.cover; }
    await page.mouse.click(hit.x, hit.y); await tick(); await page.waitForTimeout(500); };
const battle = async () => JSON.parse(await save()).expansion.simulation.sessions.player?.nativeBattle ?? null;
const panelText = async () => { await panelOpen(); return page.locator('#tempo_fight_panel').innerText(); };
try {
    await open(null);
    for (const s of ['.choice_dialogue', '[data-dialogue="villageElder"]', '[data-textline="hello"]', '#center_mode_back']) await click(s);
    const base = JSON.parse(await save());
    let p = fixtures.joinField(); p = fixtures.fieldAdvance(fixtures.fieldCommand(p, 'field.learn_focus'), 2);
    p = fixtures.fieldAdvance(fixtures.fieldCommand(p, 'field.teach_step', 'Village', {targetId: 'oldCraftsman'}), 2);
    p = fixtures.fieldAdvance(fixtures.fieldCommand(p, 'field.practice_step'), 2); p = fixtures.completeFieldProject(p);
    p = fixtures.fieldAdvance(fixtures.fieldCommand(p, 'rival.begin'), 3);
    const fixture = structuredClone(base); fixture.expansion = p.state; fixture.character.money = p.external.money;
    fixture.inventories.person.main_character[fixtures.wood] = {count: 30}; fixture.availabilities.person.oldCraftsman = 1; fixture.availabilities.dialogue.oldCraftsman = 1; fixture.availabilities.location.Shack |= 1;
    report.route = 'DEV SEEDED field-workshop fixture (named): field steps and road challenge begun via fixtures, tempo contest started with a real click';
    await open(JSON.stringify(fixture));
    await panelOpen();
    report.panelBefore = await page.evaluate(() => { const n = document.getElementById('tempo_fight_panel'); return n ? {visible: !!n.offsetParent, text: n.innerText.slice(0, 300)} : null; });
    await page.screenshot({path: join(OUT, 'tempo-before-1920.png')});
    await clickBox('[data-tempo="start"]');
    const b0 = await battle(); await panelOpen(); report.afterStart = {actions: b0?.actions, now: b0?.now, next: await page.locator('[data-tempo-next]').innerText(), log: await page.locator('[data-tempo-log]').innerText()};
    await page.screenshot({path: join(OUT, 'tempo-open-1920.png')});
    // The fight waits: ticks change nothing.
    const clockBefore = JSON.parse(await save()).expansion.clock; await page.evaluate(() => window.advanceTicks?.(30)); const clockAfter = JSON.parse(await save()).expansion.clock;
    report.waitingClock = {clockBefore, clockAfter};
    for (const id of ['jab', 'guard', 'swing']) { if (!(await battle())) break; await clickBox(`[data-tempo="${id}"]`).catch(e => (report.moveNote = e.message)); }
    const mid = await battle(); report.mid = mid && {actions: mid.actions, now: mid.now, seconds: mid.seconds, held: mid.held, log: mid.log};
    const midSave = await save();
    { const m = JSON.parse(midSave).memory ?? null; report.memoryAfterStrikes = m && {schema: m.schema, holders: Object.fromEntries(Object.entries(m.holders).map(([h, r]) => [h, r.length])), ids: m.ids.filter(i => i.startsWith('crowd.') || i.startsWith('fx1|respect')).slice(0, 8)}; } (await import('node:fs/promises')).writeFile(join(OUT, 'mid.save.txt'), midSave);
    await open(midSave);
    await page.waitForTimeout(1600); await tick(); await tick(); await page.waitForTimeout(300);
    const afterReload = await battle();
    report.reloadIdentical = JSON.stringify(afterReload) === JSON.stringify(mid);
    report.panelAfterReload = (await panelText()).slice(0, 80);
    report.geometry = await page.evaluate(() => { const rect = n => { if (!n) return null; const r = n.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
        const b = document.querySelector('[data-tempo="jab"]'), nav = document.getElementById('workspace_navigation'); const chain = []; for (let n = b; n && n !== document.body; n = n.parentElement) { const cs = getComputedStyle(n); if (/(auto|scroll)/.test(cs.overflowY)) chain.push([n.id || n.className, n.scrollTop, n.scrollHeight, n.clientHeight]); }
        const x = b.getBoundingClientRect(); const top = document.elementFromPoint(x.x + x.width / 2, x.y + x.height / 2); return {button: rect(b), nav: rect(nav), navPos: nav && getComputedStyle(nav).position, scrollers: chain, topEl: top && (top.id || top.className), winScroll: [scrollX, scrollY], panel: rect(document.getElementById('tempo_fight_panel')), visibleNotebook: rect(document.getElementById('notebook_box_div'))}; });
    await page.screenshot({path: join(OUT, 'tempo-reload-natural-1920.png')});

    await page.screenshot({path: join(OUT, 'tempo-reload-1920.png')});
    await clickBox('[data-tempo="jab"]'); const moved = await battle(); report.afterReloadMove = {actions: moved?.actions, notice: await page.evaluate(() => document.querySelector('#tempo_fight_panel [role=status]')?.textContent), disabled: await page.evaluate(() => document.querySelector('[data-tempo="jab"]')?.disabled)};
    report.afterPointer = (await panelText()).slice(-260);
    
    const viaDom = await battle(); report.afterDomClick = {actions: viaDom?.actions, panel: (await panelText()).slice(-260), notice: await page.evaluate(() => document.querySelector('#tempo_fight_panel [role=status]')?.textContent)};
    // Export then literal Import into a fresh origin.
    const encoded = await page.evaluate(() => window.save_to_file());
    await open(null);
    await Promise.all([page.waitForNavigation({waitUntil: 'domcontentloaded'}), page.locator('#saved_file_input').setInputFiles({name: 'tempo.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]).catch(e => (report.importNote = e.message));
    await page.waitForTimeout(1500);
    const play2 = page.locator('#loading_screen_play_button'); if (await play2.isVisible().catch(() => false)) { await page.evaluate(() => window.simulationTestHooks?.pause()); await play2.click(); await page.waitForTimeout(500); }
    await panelOpen(); const importedText = await panelText();
    report.importLive = {hasMidLog: mid.log.every(l => importedText.includes(l)), hasMoves: importedText.includes('Quick strike')};
    for (let i = 0; i < 60; i++) { await panelOpen(); if (!(await page.locator('[data-tempo="jab"]').count())) break; await clickBox('[data-tempo="jab"]'); }
    report.finalPanel = await panelText();
    { const m = JSON.parse(await save()).memory ?? null; report.memoryAfterImport = m && Object.fromEntries(Object.entries(m.holders).map(([h, r]) => [h, r.length])); report.memoryMidEqualsImportedStart = JSON.stringify(m?.ids?.filter(i => i.startsWith('crowd.'))) ; }
    const done = JSON.parse(await save());
    report.finished = {session: done.expansion.simulation.sessions.player ?? null, tempoLast: done.expansion.actors.player.facts['tempo.lastResult'], rivalLast: done.expansion.actors.player.facts['rival.lastResult'], pursuit: done.expansion.simulation.pursuits['frontier.road_rival']?.status, held: done.expansion.actors.player.facts['tempo.held_minutes'] ?? 0};
    await page.screenshot({path: join(OUT, 'tempo-finished-1920.png')});
} catch (e) { report.failure = e.message; await page.screenshot({path: join(OUT, 'tempo-failure.png')}).catch(() => {}); report.panel = await page.evaluate(() => document.getElementById('tempo_fight_panel')?.innerText ?? null).catch(() => null); }
finally { report.errors = errors; await context?.close().catch(() => {}); await browser.close().catch(() => {}); server.close(); }
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
