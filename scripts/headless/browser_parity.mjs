// Run scripts/headless/village_route.mjs in Chrome and headlessly, then compare
// the durable saves in det.cjs canonical form (saved_at and playtime dropped).
//   node scripts/headless/browser_parity.mjs [--out dir] [--browser-only|--headless-only]
// Chrome gets the same seeded Math.random/crypto and frozen Date through an init
// script, and its engine is paused before PLAY so only advanceTicks moves time.
// The page bundle is built into a temp dir and served from a private port;
// tracked dist/ and index.html are never written.
import {createServer} from 'node:http';
import {readFile, mkdtemp, writeFile, mkdir, rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join, resolve, extname} from 'node:path';
import {build} from 'esbuild';
import {ROOT, canonicalSave, diffSaves} from './runner.mjs';
import {ROUTE, PATCHES, SEED, WALL_START, runHeadless} from './village_route.mjs';

const require = createRequire(import.meta.url);
const {launchChrome} = require('../ui_helpers.cjs');
const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const OUT = outAt >= 0 ? args[outAt + 1] : join(tmpdir(), 'yairpg-headless-parity');
const TYPES = {'.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff2':'font/woff2', '.map':'application/json'};

async function serve(bundleDir) {
    const server = createServer(async (req, res) => {
        const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        const file = path.startsWith('/dist/bundle.js') ? join(bundleDir, 'bundle.js' + (path.endsWith('.map') ? '.map' : '')) : resolve(ROOT, '.' + (path === '/' ? '/index.html' : path));
        if(!file.startsWith(ROOT) && !file.startsWith(bundleDir)) {res.writeHead(403).end(); return;}
        let body;
        try {body = await readFile(file);} catch {res.writeHead(404).end(); return;}
        res.writeHead(200, {'content-type':TYPES[extname(file)] || 'application/octet-stream', 'cache-control':'no-store'}).end(body);
    });
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    return server;
}

// Same generator as runner.mjs (mulberry32) and the same frozen wall clock.
function initScript({seed, wall}) {
    let a = seed >>> 0;
    const random = () => {a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296;};
    Math.random = random;
    crypto.getRandomValues = arr => {for(let i = 0; i < arr.length; i++) arr[i] = Math.floor(random() * 2 ** (8 * (arr.BYTES_PER_ELEMENT || 1))); return arr;};
    crypto.randomUUID = () => {const h = [...Array(32)].map(() => Math.floor(random() * 16).toString(16)); h[12] = '4'; h[16] = (8 + Math.floor(random() * 4)).toString(16); const s = h.join(''); return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;};
    const RealDate = Date;
    class FrozenDate extends RealDate {constructor(...x) {if(x.length) super(...x); else super(wall);} static now() {return wall;}}
    globalThis.Date = FrozenDate;
}

export async function runBrowser({seed = SEED, wallStart = WALL_START, trace} = {}) {
    const bundleDir = await mkdtemp(join(tmpdir(), 'yairpg-parity-bundle-'));
    await build({entryPoints:[join(ROOT, 'src/main.js')], bundle:true, format:'esm', platform:'browser', target:'es2022', minify:true, sourcemap:true, outfile:join(bundleDir, 'bundle.js'), logLevel:'error'});
    const server = await serve(bundleDir), url = `http://127.0.0.1:${server.address().port}/?test_hooks=1`;
    const browser = await launchChrome();
    const errors = [], saves = {}, t0 = performance.now();
    let context, page;
    const open = async seedSave => {
        await context?.close();
        context = await browser.newContext({viewport:{width:1366, height:768}});
        await context.addInitScript(initScript, {seed, wall:wallStart});
        if(seedSave) await context.addInitScript(data => {if(!sessionStorage.getItem('seeded')) {localStorage.setItem('save data', data); sessionStorage.setItem('seeded', '1');}}, JSON.stringify(seedSave));
        page = await context.newPage(); page.setDefaultTimeout(20000);
        page.on('pageerror', e => errors.push(e.stack || e.message));
        await page.goto(url);
        const play = page.locator('#loading_screen_play_button');
        await play.waitFor({state:'visible', timeout:60000});
        await page.evaluate(() => window.simulationTestHooks.pause());
        await play.click();
        const confirm = page.locator('#hero_creation_panel_confirmation');
        if(await confirm.isVisible().catch(() => false)) await confirm.click();
        await page.waitForTimeout(300);
    };
    // Same loop as HeadlessGame.step: chunks of up to 60 ticks until the calendar target.
    const step = minutes => page.evaluate(minutes => {
        const now = () => {const t = window.simulationTestHooks.snapshot()['current time']; return t.day_count * 1440 + t.hour * 60 + t.minute;};
        const target = now() + minutes;
        for(let m = now(); m < target; m = now()) window.advanceTicks(Math.min(60, target - m));
    }, minutes);
    try {
        await open(null);
        for(const s of ROUTE) {
            trace?.(s);
            if(s.op === 'click') await page.locator(s.sel).first().click();
            else if(s.op === 'step') await step(s.minutes);
            else if(s.op === 'save') {await page.evaluate(() => window.saveProgress()); saves[s.name] = JSON.parse(await page.evaluate(() => localStorage.getItem('save data')));}
            else if(s.op === 'load') await open(PATCHES[s.patch](saves[s.from]));
            await page.waitForTimeout(300);
        }
    } finally {
        await context?.close().catch(() => {}); await browser.close().catch(() => {});
        server.close(); await rm(bundleDir, {recursive:true, force:true});
    }
    return {saves, errors, ms:performance.now() - t0};
}

if(import.meta.url === `file://${process.argv[1]}`) {
    await mkdir(OUT, {recursive:true});
    const trace = side => s => process.stderr.write(`${side} ${JSON.stringify(s)}\n`);
    const report = {seed:SEED, route:ROUTE.length, out:OUT};
    let headless, chrome;
    if(!args.includes('--browser-only')) {
        try {const r = await runHeadless({trace:trace('headless')}); headless = r.saves; report.headlessMs = Math.round(r.ms); report.headlessErrors = r.game.errors;}
        catch(e) {report.headlessFailure = e.stack;}
    }
    if(!args.includes('--headless-only')) {
        try {const r = await runBrowser({trace:trace('chrome')}); chrome = r.saves; report.chromeMs = Math.round(r.ms); report.chromeErrors = r.errors;}
        catch(e) {report.chromeFailure = e.stack;}
    }
    for(const [side, saves] of [['headless', headless], ['chrome', chrome]]) if(saves)
        for(const [name, save] of Object.entries(saves)) await writeFile(join(OUT, `${side}-${name}.json`), canonicalSave(save));
    if(headless && chrome) {
        report.compare = Object.fromEntries(Object.keys(chrome).map(name => [name, headless[name] && canonicalSave(headless[name]) === canonicalSave(chrome[name]) ? 'identical' : diffSaves(headless[name] ?? {}, chrome[name])]));
    }
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    if(report.compare && !Object.values(report.compare).every(v => v === 'identical')) process.exitCode = 1;
}
