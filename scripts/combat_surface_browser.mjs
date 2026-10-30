// One fight surface, tempo mode (docs/representations/COMBAT.md round 3) at 1920x1080, headless, fresh origin.
// Route (named DEV SEEDED fixture, after the P4 tempo proof): field steps and the road challenge begun through
// scripts/field_fixtures.mjs, then real clicks: start the contest, play moves on the Fight card, Save and reload,
// Export and Import. Checks damage types on moves, in the log and on the opponent card, and the dev readout.
// Usage: node scripts/combat_surface_browser.mjs <out-dir>. Builds its own bundle; no user save is touched.
import {createServer} from 'node:http';
import {readFile, writeFile, mkdtemp, mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join, resolve, extname, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'scripts/x.cjs'));
const {build} = require('esbuild');
const {launchChrome} = require(join(ROOT, 'scripts/ui_helpers.cjs'));
const OUT = resolve(process.argv[2] || 'docs/representations/evidence/combat-surface');
await mkdir(OUT, {recursive: true});
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'};
const bundleDir = await mkdtemp(join(tmpdir(), 'combat-surface-'));
await build({entryPoints: [join(ROOT, 'src/main.js')], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: false, outfile: join(bundleDir, 'bundle.js'), logLevel: 'error'});
const bundleHash = createHash('sha256').update(await readFile(join(bundleDir, 'bundle.js'))).digest('hex').slice(0, 12);
const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.startsWith('/dist/bundle.js') ? join(bundleDir, 'bundle.js') : resolve(ROOT, '.' + (path === '/' ? '/index.html' : path));
    let body; try { body = await readFile(file); } catch { res.writeHead(404).end(); return; }
    res.writeHead(200, {'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'}).end(body);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/?test_hooks=1`;
const browser = await launchChrome();
const errors = [], report = {bundleHash, viewport: '1920x1080'};
let context, page;
const open = async seed => {
    await context?.close();
    context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    if (seed) await context.addInitScript(d => { if (!sessionStorage.getItem('s')) { localStorage.setItem('save data', d); sessionStorage.setItem('s', '1'); } }, seed);
    page = await context.newPage(); page.setDefaultTimeout(120000);
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
    await page.goto(url, {timeout: 240000, waitUntil: 'domcontentloaded'});
    const play = page.locator('#loading_screen_play_button');
    await play.waitFor({state: 'visible', timeout: 300000});
    await page.evaluate(() => window.simulationTestHooks?.pause());
    await play.click();
    const confirm = page.locator('#hero_creation_panel_confirmation');
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await page.waitForTimeout(500);
};
const tick = () => page.evaluate(() => window.advanceTicks?.(1));
const click = async sel => { await page.locator(sel).first().click({noWaitAfter: true}); await tick(); await page.waitForTimeout(300); };
const save = async () => { await page.evaluate(() => window.saveProgress()); return page.evaluate(() => localStorage.getItem('save data')); };
const battle = async () => JSON.parse(await save()).expansion.simulation.sessions.player?.nativeBattle ?? null;
// The road contest's start button lives in the tempo panel (Notebook, People); the fight then plays on the Fight card.
const panelOpen = async () => {
    const shown = () => page.evaluate(() => { const b = document.querySelector('#tempo_fight_panel'); return !!b && b.offsetParent !== null && b.getBoundingClientRect().height > 0; });
    if (!await shown()) { await page.locator('#workspace_navigation').getByText('Notebook', {exact: true}).first().click({timeout: 8000, noWaitAfter: true}).catch(() => {}); await page.waitForTimeout(500); }
    if (!await shown()) await page.locator('[data-notebook-view="people"]').first().click({timeout: 4000, noWaitAfter: true}).catch(() => {});
    await page.evaluate(() => { const p = document.getElementById('tempo_fight_panel'); if (p) p.open = true; }); await page.waitForTimeout(200);
};
const realClick = async sel => {
    const hit = await page.evaluate(sel => { const b = document.querySelector(sel); if (!b || b.hidden || b.disabled) return {missing: true}; let res; for (const block of ['center', 'end', 'start', 'nearest']) { b.scrollIntoView({block}); const r = b.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2, top = document.elementFromPoint(x, y); res = {x, y, ok: top === b || b.contains(top), cover: top ? (top.id || top.className || top.tagName) : null}; if (res.ok) break; } return res; }, sel);
    if (hit.missing) throw new Error('control unavailable: ' + sel);
    if (!hit.ok) (report.coverNotes ||= []).push(`${sel} under ${hit.cover}`);
    await page.mouse.click(hit.x, hit.y); await tick(); await page.waitForTimeout(500);
};
const card = () => page.evaluate(() => {
    const s = document.getElementById('fight_situation');
    if (!s || s.hidden || s.dataset.fightMode !== 'tempo') return null;
    const r = s.getBoundingClientRect();
    return {visible: s.checkVisibility(), box: [r.x, r.y, r.width, r.height].map(Math.round),
        stakes: s.querySelector('.scene-card-stakes')?.textContent, next: s.querySelector('.fight-situation-next')?.textContent,
        you: s.querySelector('.versus-side--you')?.innerText, opponents: [...s.querySelectorAll('.versus-card')].map(c => c.getAttribute('aria-label')),
        typeChips: [...s.querySelectorAll('.versus-chip--type')].map(c => ({text: c.textContent, type: c.dataset.damageType, source: c.dataset.source})),
        moves: [...s.querySelectorAll('.scene-card-option')].map(o => o.innerText.replace(/\s+/g, ' ')),
        log: [...s.querySelectorAll('.fight-situation-log li')].map(n => n.textContent), dev: [...s.querySelectorAll('.fight-situation-dev li')].map(n => n.textContent),
        aims: [...s.querySelectorAll('[data-fight-aim]')].map(b => ({aim: b.dataset.fightAim, disabled: b.disabled, pressed: b.getAttribute('aria-pressed'), top: Math.round(b.getBoundingClientRect().top)})),
        aimReason: s.querySelector('.fight-situation-aims span')?.textContent.trim() || '',
        notice: s.querySelector('.fight-situation-notice')?.textContent || '', world: document.documentElement.dataset.worldFamily || null,
        oldPanel: document.getElementById('tempo_fight_panel')?.innerText.slice(0, 160) || null};
});
// held (banked away minutes) grows across a reload by design (P5, LSD317), so it is reported, not compared.
const same = (a, b) => { const strip = x => x && {...x, held: undefined}; const diff = a && b ? Object.keys({...a, ...b}).filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k])) : ['missing'];
    return {identical: JSON.stringify(strip(a)) === JSON.stringify(strip(b)), diff, held: [a?.held, b?.held]}; };
const showCard = async () => { await page.evaluate(() => document.getElementById('fight_situation')?.scrollIntoView({block: 'start'})); await page.waitForTimeout(200); };
try {
    await open(null);
    const base = JSON.parse(await save());
    const fixtures = await import(join(ROOT, 'scripts/field_fixtures.mjs'));
    let p = fixtures.joinField(); p = fixtures.fieldAdvance(fixtures.fieldCommand(p, 'field.learn_focus'), 2);
    p = fixtures.fieldAdvance(fixtures.fieldCommand(p, 'field.teach_step', 'Village', {targetId: 'oldCraftsman'}), 2);
    p = fixtures.fieldAdvance(fixtures.fieldCommand(p, 'field.practice_step'), 2); p = fixtures.completeFieldProject(p);
    p = fixtures.fieldAdvance(fixtures.fieldCommand(p, 'rival.begin'), 3);
    const fixture = structuredClone(base); fixture.expansion = p.state; fixture.character.money = p.external.money;
    fixture.inventories.person.main_character[fixtures.wood] = {count: 30}; fixture.availabilities.person.oldCraftsman = 1; fixture.availabilities.dialogue.oldCraftsman = 1; fixture.availabilities.location.Shack |= 1;
    report.route = 'DEV SEEDED field-workshop fixture (named, as in the P4 proof): road challenge begun via fixtures; contest started and played with real clicks';
    await open(JSON.stringify(fixture));
    await panelOpen(); await realClick('[data-tempo="start"]');
    const b0 = await battle();
    report.started = {actions: b0?.actions, typed: {you: b0?.fighters.player.profile.types, mara: b0 && Object.values(b0.fighters).find(f => f.side === 'b')?.profile.types}};
    await page.waitForTimeout(600); report.open = await card();
    await showCard(); await page.screenshot({path: join(OUT, 'tempo-card-open-1920.png')});
    for (let i = 0; i < 4 && (await battle()); i++) await realClick('#fight_situation [data-fight-option="jab"]').catch(e => (report.moveNote = e.message));
    report.afterMoves = await card();
    await showCard(); await page.screenshot({path: join(OUT, 'tempo-card-typed-1920.png')});
    await page.locator('#fight_situation').screenshot({path: join(OUT, 'tempo-card.png')}).catch(() => {});
    // Dev readout: the per-hit type split, shown only with dev view on.
    await page.evaluate(() => { document.documentElement.dataset.dev = 'on'; }); await page.waitForTimeout(700); report.dev = (await card())?.dev;
    await page.locator('#fight_situation').screenshot({path: join(OUT, 'tempo-card-dev.png')}).catch(() => {});
    // Save and reload: the open typed fight comes back identical and the card redraws from it.
    const mid = await battle(), midSave = await save(); await writeFile(join(OUT, 'mid.save.json'), midSave);
    await open(midSave); await page.waitForTimeout(1500); await tick(); await page.waitForTimeout(600);
    report.reload = same(mid, await battle()); report.reloadIdentical = report.reload.identical;
    report.afterReload = await card();
    // Export, then a literal Import into a fresh origin.
    const encoded = await page.evaluate(() => window.save_to_file());
    await open(null);
    await Promise.all([page.waitForNavigation({waitUntil: 'domcontentloaded'}), page.locator('#saved_file_input').setInputFiles({name: 'tempo.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]).catch(e => (report.importNote = e.message));
    await page.waitForTimeout(1500);
    const play2 = page.locator('#loading_screen_play_button'); if (await play2.isVisible().catch(() => false)) { await page.evaluate(() => window.simulationTestHooks?.pause()); await play2.click(); await page.waitForTimeout(800); }
    await tick(); await page.waitForTimeout(600);
    report.import = same(mid, await battle()); report.importIdentical = report.import.identical;
    report.afterImport = await card();
    for (let i = 0; i < 60 && (await battle()); i++) await realClick('#fight_situation [data-fight-option="jab"]').catch(e => (report.finishNote = e.message));
    const done = JSON.parse(await save());
    report.finished = {session: done.expansion.simulation.sessions.player ?? null, tempoLast: done.expansion.actors.player.facts['tempo.lastResult'], cardHidden: !(await card())};
} catch (e) { report.failure = e.message; await page?.screenshot({path: join(OUT, 'tempo-failure.png')}).catch(() => {}); }
finally { report.errors = errors; await context?.close().catch(() => {}); await browser.close().catch(() => {}); server.close(); }
await writeFile(join(OUT, 'journey.json'), JSON.stringify(report, null, 1) + '\n');
const ok = !report.failure && report.open?.visible && report.afterMoves?.typeChips.length && report.afterMoves.log.some(l => /slashing|piercing|bludgeoning/.test(l))
    && report.dev?.length && !/Who acts next|Quick strike/.test(report.afterImport?.oldPanel || '') && report.reloadIdentical && report.importIdentical && report.afterReload && report.afterImport && !errors.length;
console.log(ok ? 'PASS' : 'FAIL', JSON.stringify({bundleHash, open: report.open?.box, chips: report.afterMoves?.typeChips, reload: report.reloadIdentical, import: report.importIdentical, failure: report.failure, errors: errors.length}));
process.exitCode = ok ? 0 : 1;
