// R15 G3 browser harness: headless Chrome via Playwright on the rebuilt worktree bundle
// (static server on 127.0.0.1:19130). Exposes a local REPL on 127.0.0.1:19131 so steps can be
// driven one at a time and retried. Usage: node harness.cjs <profile-dir>
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises'), crypto = require('node:crypto'), http = require('node:http'), path = require('node:path');
const dir = __dirname, root = path.resolve(dir, '../../../../../../..');
const profile = process.argv[2] || '/private/tmp/r15-g3-profile';
let ctx, page, loaded = [], errors = [], log = [];
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
// Exactly one stored game save (the expansion-bearing localStorage entry).
const stored = async () => {
    const all = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([, v]) => {try {return !!JSON.parse(v).expansion;} catch {return false;}})));
    const entries = Object.values(all); if (entries.length !== 1) throw Error('Expected exactly one save, got ' + entries.length); return JSON.parse(entries[0]);
};
const groups = s => [s.character, s.inventories, s.expansion, s['current time'], s['current location'], s.npcs, s.npc_equipment];
const same = (a, b) => JSON.stringify(groups(a)) === JSON.stringify(groups(b));
const inv = s => Object.fromEntries(Object.entries(s.inventories.person.main_character).map(([k, v]) => [JSON.parse(k).id, v.count]));
const brief = s => ({clock: s.expansion.clock, money: s.character.money, staminaToFull: s.character.stamina_to_full, location: s['current location'],
    inv: inv(s), jobs: s.expansion.simulation.jobs.map(j => [j.commandId, j.due]), conditions: s.expansion.simulation.conditions?.player});
const save = async () => {await page.locator('#save_button').click(); await page.waitForTimeout(300); return stored();};
const bundleBinding = async label => {
    const built = hash(await fs.readFile(path.join(root, 'dist/bundle.js')));
    const actual = loaded.at(-1);
    return {label, built, loaded: actual?.hash, match: actual?.hash === built};
};
const waitPlay = async () => {await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});};
const play = async () => {await waitPlay(); await page.locator('#loading_screen_play_button').click(); await page.waitForTimeout(500);};
const reload = async () => {await page.reload({waitUntil: 'domcontentloaded'}); await waitPlay();};
const importFile = async file => {await page.locator('#saved_file_input').setInputFiles(file); await waitPlay();};
const exportFile = async name => {
    const down = page.waitForEvent('download'); await page.locator('#save_to_file_button').click(); const d = await down;
    const file = path.join(dir, 'evidence', name + '-export.txt'); await d.saveAs(file); return {file, hash: hash(await fs.readFile(file))};
};
// Save, reload, genuine Export, literal-file Import: compares seven state groups each way.
// The game clock runs while playing, so Export and Import happen on the reloaded page before
// PLAY (clock stopped). The exported literal file is also decoded and compared.
const decodeFile = async file => JSON.parse(Buffer.from((await fs.readFile(file, 'utf8')).trim().slice('YAIR-UTF8-1:'.length), 'base64').toString('utf8'));
const checkpoint = async name => {
    const before = await save();
    await reload(); const reloaded = await stored();
    const ex = await exportFile(name); const exported = await decodeFile(ex.file);
    await importFile(ex.file); const imported = await stored();
    await fs.writeFile(path.join(dir, 'evidence', name + '.json'), JSON.stringify(brief(before), null, 1));
    const row = {name, clock: before.expansion.clock, exportHash: ex.hash, reloadExact: same(before, reloaded), exportExact: same(before, exported),
        importExact: same(before, imported), bundle: await bundleBinding(name)};
    log.push({checkpoint: row}); await fs.writeFile(path.join(dir, 'evidence', 'persistence-' + (globalThis.runName || 'run') + '.json'), JSON.stringify(log, null, 1));
    await play(); return row;
};
const button = label => page.getByRole('button', {name: label});
const text = async sel => page.locator(sel).innerText();
(async () => {
    ctx = await chromium.launchPersistentContext(profile, {channel: 'chrome', headless: true, viewport: {width: 1600, height: 1100}, acceptDownloads: true});
    page = ctx.pages()[0] || await ctx.newPage();
    await (await ctx.newCDPSession(page)).send('Network.setCacheDisabled', {cacheDisabled: true});
    page.on('response', async r => {if (r.status() === 200 && r.url().includes('/dist/bundle.js') && !r.url().includes('.map')) loaded.push({url: r.url(), hash: hash(await r.body())});});
    page.on('pageerror', e => errors.push(e.message));
    page.on('dialog', d => d.accept());
    await page.goto('http://127.0.0.1:19130/', {waitUntil: 'domcontentloaded'});
    http.createServer(async (req, res) => {
        let body = ''; for await (const c of req) body += c;
        try {const value = await eval('(async()=>{' + body + '})()'); res.end(JSON.stringify({ok: true, value: value ?? null}, null, 1));}
        catch (e) {res.end(JSON.stringify({ok: false, error: e.stack}));}
    }).listen(19131, '127.0.0.1');
    console.log('READY');
})();
