// Component-level render of two real panels with real engine state and the app's own stylesheets (headless Chrome).
// G5: Elder & chronicle panel with the village mural button. G2: Methods & practice lesson row at Stranger vs Neighbour.
// This is NOT the full app: see combined-journey.mjs for the real-app pass. Run from the candidate root:
//   node docs/research/qud-systems-audit-2026-10-15/integration-evidence/component-harness.mjs <evidence-dir>
import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve, join, extname} from 'node:path';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {launchChrome} = require('../../../../scripts/ui_helpers.cjs');

const root = resolve('.'), evidence = resolve(process.argv[2] || 'integration-evidence/component');
await mkdir(evidence, {recursive: true});
const entry = `
import {createChroniclePanel} from './src/chronicle_ui.js';
import {createChronicle, commandChronicle} from './src/chronicle.js';
import {ensureWorldHistory} from './src/world_history_consumers.js';
import {createStreams} from './src/seeded_streams.js';
import {createSkillExpansionPanel} from './src/skill_expansion_ui.js';
import {rankFacts} from './src/faction_rank.js';
import {skillExpansionContext} from './src/skill_expansion_host.js';
import {createExpansionState, advanceSimulation} from './src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from './src/expedition_content.js';
import {enrollSimulation, commitSimulationCommand} from './src/simulation.js';
const clock = {year: 999, month: 4, day: 1, hour: 8, minute: 0, day_count: 1};
window.mountChronicle = () => {
    const state = createExpansionState(43); state.streams = createStreams(43);
    state.chronicle = createChronicle(state.clock, clock, false);
    if(!ensureWorldHistory(state)) throw new Error('no world history');
    let notice = '';
    const ctx = {location: 'Village', calendar: clock, money: 20, stamina: 40, heroName: 'Test', ratStep: false, witness: false};
    const ui = createChroniclePanel({read: () => ({structuredLife: null, state, context: ctx, canWrite: true, enabled: true, occupied: false, dutyJob: null, error: '', pauseReason: ''}),
        command: c => {const r = commandChronicle(state, c, ctx); Object.assign(state, r.state ?? r);}, duty() {}, cancelDuty() {}, exportSave() {}, reset() {}});
    const panel = ui.panel; document.getElementById('location_actions_div').append(panel); panel.open = true; ui.render(true); window.chronicleState = state;
    return Object.keys(state.loreHistory.worldHistories);
};
const facts = {location: 'Village', 'village.craftsmanMet': true, 'village.craftsmanPresent': true, 'village.teacherHours': true,
    'village.craftsmanBusy': false, 'village.craftsmanIrritated': false, 'body.handsTender': false, 'campaign.anchor': true};
window.mountLesson = (rep, money, host) => {
    const external = {money}, gameplay = {player: {inventory: {}, skills: {}, reputation: {Village: rep}}};
    const mk = () => ({actorId: 'player', external, gameplay, vitals: {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}}, facts: {...facts, ...rankFacts({Village: rep})}});
    let p = enrollSimulation(initializeExpedition(createExpansionState(23)), registry, mk());
    const adv = (q, n) => {const c = skillExpansionContext(q.state, mk()); const o = advanceSimulation(q.state, registry, n, external, gameplay, {player: {...c, vitals: c.vitals.player}}); return {...q, ...o};};
    p = adv(commitSimulationCommand(p.state, registry, {id: 'skills.inquiry.observe'}, {...skillExpansionContext(p.state, mk()), targetId: 'oldCraftsman'}), 2);
    const panel = createSkillExpansionPanel({registry, read: () => ({state: p.state, context: skillExpansionContext(p.state, mk()), error: '', enabled: true, inDialogue: false, inCombat: false}), command: () => {}});
    host.append(panel); panel.open = true; panel.hidden = false;
    return panel;
};`;
const out = await build({stdin: {contents: entry, resolveDir: root, loader: 'js'}, bundle: true, format: 'iife', platform: 'browser', write: false, logLevel: 'error'});
const bundle = out.outputFiles[0].text;
const index = await readFile(join(root, 'index.html'), 'utf8');
const links = [...index.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => `<link rel="stylesheet" href="/${m[1]}">`).join('\n');
const html = `<!doctype html><meta charset=utf-8>${links}<body><div id="main_content"><div id="location_actions_div"></div><div id="lessons" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"></div></div><script src="/__bundle.js"></script></body>`;
const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if(path === '/') return res.writeHead(200, {'content-type': 'text/html'}).end(html);
    if(path === '/__bundle.js') return res.writeHead(200, {'content-type': 'text/javascript'}).end(bundle);
    try {const body = await readFile(join(root, path)); res.writeHead(200, {'content-type': extname(path) === '.css' ? 'text/css' : 'application/octet-stream'}).end(body);} catch {res.writeHead(404).end();}
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await launchChrome(), receipt = {viewports: [], checks: []}, errors = [];
try {
    for(const [w, h] of [[1920, 1080], [1536, 864]]) {
        const ctx = await browser.newContext({viewport: {width: w, height: h}}), page = await ctx.newPage(), tag = `${w}x${h}`;
        page.on('pageerror', e => errors.push(e.message)); page.on('console', m => {if(m.type() === 'error' && !/404/.test(m.text())) errors.push(m.text());});
        await page.goto(url); receipt.viewports.push(tag);
        const histories = await page.evaluate(() => window.mountChronicle());
        assert.deepEqual(histories, ['base.frontier']);
        await page.waitForTimeout(300);
        const mural = page.locator('[data-chronicle^="mural."]:visible').first();
        await mural.waitFor({state: 'visible'});
        const label = await mural.innerText();
        await page.locator('#chronicle_panel').screenshot({path: join(evidence, `g5-chronicle-mural-${tag}.png`)});
        await mural.click(); await page.waitForTimeout(200);
        const read = await page.evaluate(() => Object.keys(window.chronicleState.chronicle.knowledge).filter(k => k.startsWith('mural.')));
        assert.ok(read.length === 1, 'mural read recorded');
        const text = await page.locator('#chronicle_panel').innerText();
        receipt.checks.push(`${tag} G5: mural button "${label}" visible, click recorded ${read[0]}`);
        const lesson = await ctx.newPage(); lesson.on('pageerror', e => errors.push(e.message));
        await lesson.goto(url);
        const rows = [];
        for(const [rep, name] of [[0, 'stranger'], [60, 'neighbour']]) {
            await lesson.evaluate(([rep]) => {document.querySelectorAll('#skills_panel').forEach(n => n.remove()); const h = document.getElementById('lessons'); h.replaceChildren(); const box = document.createElement('div'); box.id = 'box'; h.append(box); window.mountLesson(rep, 1, box);}, [rep]);
            await lesson.waitForTimeout(200);
            await lesson.evaluate(() => document.querySelectorAll('#skills_panel, #skills_panel details').forEach(d => {d.open = true;}));
            await lesson.waitForTimeout(200);
            const panel = lesson.locator('#skills_panel');
            const txt = await panel.innerText();
            rows.push({name, learn: [...txt.matchAll(/Learn [^\n]*/gi)].map(m => m[0])});
            await panel.screenshot({path: join(evidence, `g2-lesson-row-${name}-${tag}.png`)});
        }
        receipt.checks.push(`${tag} G2 lesson rows: ` + JSON.stringify(rows));
        await ctx.close();
    }
    assert.deepEqual(errors, []);
    receipt.status = 'passed';
} catch(e) {receipt.status = 'failed'; receipt.failure = e.stack; receipt.errors = errors.slice(0, 8); throw e;}
finally {await writeFile(join(evidence, 'component-receipt.json'), JSON.stringify(receipt, null, 2) + '\n'); await browser.close(); server.close();}
process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
