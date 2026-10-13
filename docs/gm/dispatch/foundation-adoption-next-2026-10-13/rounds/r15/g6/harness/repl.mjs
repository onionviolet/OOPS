// R15 G6 browser driver (test harness only). Serves this worktree's rebuilt
// bytes on 127.0.0.1:19160, opens headless Chrome at 1600x1100 on a fresh
// profile under /private/tmp, and evaluates POSTed step bodies on 19161 with
// `page`, `ctx`, `h`, `fs`, `path` in scope. Usage:
//   node repl.mjs /private/tmp/r15-g6-profile-<n>
//   curl -s --data-binary @step.js http://127.0.0.1:19161/
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, '../../../../../../../..');
const evidence = path.resolve(here, '../evidence');
const profile = process.argv[2] || '/private/tmp/r15-g6-profile';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.ico':'image/x-icon','.jpg':'image/jpeg','.gif':'image/gif','.mp3':'audio/mpeg','.ogg':'audio/ogg'};
const hash = b => crypto.createHash('sha256').update(b).digest('hex');

const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {res.writeHead(404); res.end(); return;}
    res.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'});
    fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(19160, '127.0.0.1', r));

const ctx = await chromium.launchPersistentContext(profile, {channel: 'chrome', headless: true, viewport: {width: 1600, height: 1100}, acceptDownloads: true});
const page = ctx.pages()[0] || await ctx.newPage();
page.setDefaultTimeout(15000);
const errors = [], loaded = [];
page.on('pageerror', e => errors.push(e.message));
page.on('dialog', d => d.accept());
page.on('response', async r => {if (r.url().includes('/dist/bundle.js')) {try {loaded.push({url: r.url(), loaded: hash(await r.body()), disk: hash(fs.readFileSync(path.join(root, 'dist/bundle.js')))});} catch {}}});

const h = {
    hash, evidence, errors, loaded, root,
    saved: () => page.evaluate(() => JSON.parse(localStorage.getItem('save data') || localStorage.getItem('dev save data') || 'null')),
    async play() {const b = page.locator('#loading_screen_play_button'); if (await b.isVisible().catch(() => false)) await b.click(); await page.waitForTimeout(500);},
    async reload() {await page.reload({waitUntil: 'domcontentloaded'}); await page.waitForTimeout(2500);},
    async save() {await page.locator('#save_button').click({noWaitAfter: true}); await page.waitForTimeout(300); return h.saved();},
    async exportFile(name) {const down = page.waitForEvent('download'); await page.locator('#save_to_file_button').click(); const d = await down; const file = path.join(evidence, name); await d.saveAs(file); return {file, sha256: hash(fs.readFileSync(file))};},
    async importFile(file) {await page.locator('#saved_file_input').setInputFiles(file); await page.waitForTimeout(3000);},
    groups: s => ({character: s.character, inventories: s.inventories, expansion: s.expansion, location: s['current location'], time: s['current time']}),
    diff(a, b) {const ga = h.groups(a), gb = h.groups(b); return Object.keys(ga).filter(k => JSON.stringify(ga[k]) !== JSON.stringify(gb[k]));},
    // Visible courtyard buttons (enabled state and reason text).
    courtyard: () => page.evaluate(() => {const el = document.getElementById('management_panel'); if (!el) return null;
        return {hidden: el.hidden || !el.offsetParent, open: el.open, notice: el.querySelector('[role=status]')?.textContent || '',
            rows: [...el.querySelectorAll('section')].filter(s => !s.hidden && s.offsetParent).map(s => {const b = s.querySelector('button'), r = s.querySelectorAll('p'); return (b.disabled ? '[x] ' : '') + b.textContent + (r[1]?.textContent ? ' | ' + r[1].textContent.slice(0, 160) : '');})};}),
    // Opens the panel and every family group, then clicks the visible courtyard button whose label contains `text`.
    async openAll() {await page.evaluate(() => {const el = document.getElementById('management_panel'); if (el) {el.open = true; el.querySelectorAll('details').forEach(d => d.open = true);}});},
    async mg(text) {await h.openAll(); const b = page.locator('#management_panel section button', {hasText: text}).filter({visible: true}); const n = await b.count(); if (!n) throw Error(`No visible courtyard button "${text}"`); if (await b.first().isDisabled()) throw Error(`Courtyard button disabled: "${text}"`); await b.first().click({noWaitAfter: true}); await page.waitForTimeout(250); return page.evaluate(() => document.querySelector('#management_panel [role=status]')?.textContent);},
    async click(text, {exact = false} = {}) {const b = page.getByRole('button', {name: text, exact}).filter({visible: true}); if (!await b.count()) throw Error(`No visible button "${text}"`); await b.first().click(); await page.waitForTimeout(250);},
    buttons: async (filter = '') => page.evaluate(f => [...document.querySelectorAll('button')].filter(b => b.offsetParent && b.innerText.toLowerCase().includes(f.toLowerCase())).map(b => (b.disabled ? '[x] ' : '') + b.innerText.replace(/\s+/g, ' ').trim()), filter),
    money: () => page.evaluate(() => JSON.parse(localStorage.getItem('save data') || 'null')?.character?.money),
    mgState: s => {const e = s.expansion, sim = e.simulation; return {money: s.character.money, clock: e.clock,
        facts: Object.fromEntries(Object.entries(e.actors.player.facts).filter(([k]) => k.startsWith('mg.'))),
        npc: Object.fromEntries(['mg.mira', 'mg.orin', 'mg.sela', 'mg.bram'].filter(id => e.actors[id]).map(id => [id, {coins: e.actors[id].resources.coins, stock: sim.owners[id], stamina: sim.people[id].vitals?.stamina}])),
        jobs: sim?.jobs.filter(j => j.commandId.startsWith('mg.')).map(j => ({actor: j.actorId, command: j.commandId, due: j.due})) || [],
        program: sim?.programs.player || null,
        completed: Object.fromEntries(Object.entries(e.actors.player.completed).filter(([k]) => k.startsWith('mg.')))};},
    write: (name, data) => fs.writeFileSync(path.join(evidence, name), typeof data === 'string' ? data : JSON.stringify(data, null, 1)),
    shot: name => page.screenshot({path: path.join(evidence, name)}),
};

await page.goto('http://127.0.0.1:19160/', {waitUntil: 'domcontentloaded'});
const control = http.createServer(async (req, res) => {
    let body = '';
    for await (const c of req) body += c;
    let out;
    try {out = {ok: true, value: (await eval('(async()=>{' + body + '})()')) ?? null};}
    catch (e) {out = {ok: false, error: String(e.stack || e).slice(0, 2500)};}
    res.end(JSON.stringify(out, null, 1));
    if (body.trim() === 'SHUTDOWN') {await ctx.close(); server.close(); control.close(); process.exit(0);}
});
await new Promise(r => control.listen(19161, '127.0.0.1', r));
console.log('READY', profile, root);
