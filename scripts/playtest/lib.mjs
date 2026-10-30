// Headless Chrome session for playtest bots (PT2 runner, PT4 recorder).
// serve() and initScript() are copied from scripts/headless/browser_parity.mjs
// (not exported there): a temp-dir bundle on a private port, seeded randomness
// and a frozen wall clock, so tracked dist/ and index.html are never written.
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {readFile, mkdtemp, rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join, resolve, extname} from 'node:path';
import {build} from 'esbuild';
import {ROOT, canonicalSave} from '../headless/runner.mjs';

const require = createRequire(import.meta.url);
const {launchChrome} = require('../ui_helpers.cjs');
const TYPES = {'.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff2':'font/woff2', '.map':'application/json'};

// Desktop first (standing UI priority); the perf gate measures at the same size.
export const VIEWPORT = {width:1920, height:1080};
export const sha = text => createHash('sha256').update(text).digest('hex').slice(0, 16);
/** Durable state without the clock: two saves differ here only if play changed something. */
export const stateHash = save => {const s = JSON.parse(canonicalSave(save)); delete s['current time']; return sha(JSON.stringify(s));};

export async function buildBundle() {
    const dir = await mkdtemp(join(tmpdir(), 'yairpg-playtest-bundle-'));
    await build({entryPoints:[join(ROOT, 'src/main.js')], bundle:true, format:'esm', platform:'browser', target:'es2022', minify:true, sourcemap:true, outfile:join(dir, 'bundle.js'), logLevel:'error'});
    return {dir, dispose:() => rm(dir, {recursive:true, force:true})};
}

export async function serve(bundleDir) {
    const server = createServer(async (req, res) => {
        const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        const file = path.startsWith('/dist/bundle.js') ? join(bundleDir, 'bundle.js' + (path.endsWith('.map') ? '.map' : '')) : resolve(ROOT, '.' + (path === '/' ? '/index.html' : path));
        if(!file.startsWith(ROOT) && !file.startsWith(bundleDir)) {res.writeHead(403).end(); return;}
        let body;
        try {body = await readFile(file);} catch {res.writeHead(404).end(); return;}
        res.writeHead(200, {'content-type':TYPES[extname(file)] || 'application/octet-stream', 'cache-control':'no-store'}).end(body);
    });
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    return {url:`http://127.0.0.1:${server.address().port}/?test_hooks=1`, close:() => server.close()};
}

// Same generator as runner.mjs (mulberry32) and the same frozen wall clock.
// seed null leaves Math.random and crypto ambient (the nondeterminism fault).
function initScript({seed, wall}) {
    const RealDate = Date;
    class FrozenDate extends RealDate {constructor(...x) {if(x.length) super(...x); else super(wall);} static now() {return wall;}}
    globalThis.Date = FrozenDate;
    if(seed === null) return;
    let a = seed >>> 0;
    const random = () => {a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296;};
    Math.random = random;
    crypto.getRandomValues = arr => {for(let i = 0; i < arr.length; i++) arr[i] = Math.floor(random() * 2 ** (8 * (arr.BYTES_PER_ELEMENT || 1))); return arr;};
    crypto.randomUUID = () => {const h = [...Array(32)].map(() => Math.floor(random() * 16).toString(16)); h[12] = '4'; h[16] = (8 + Math.floor(random() * 4)).toString(16); const s = h.join(''); return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;};
}

/**
 * One browser, one fresh context per open(). Every page error and console error
 * lands in `errors` with the op index that was running.
 * hooks.beforeOpen(context, seedSave) lets fault injection add init scripts.
 */
export class Session {
    constructor({url, seed, wall, hooks = {}, opTimeout = 6000}) {Object.assign(this, {url, seed, wall, hooks, opTimeout, errors:[], op:-1});}
    async start() {this.browser = await launchChrome(); return this;}
    async open(seedSave = null) {
        await this.context?.close();
        this.context = await this.browser.newContext({viewport:VIEWPORT});
        await this.context.addInitScript(initScript, {seed:this.seed, wall:this.wall});
        if(seedSave) await this.context.addInitScript(data => {if(!sessionStorage.getItem('seeded')) {localStorage.setItem('save data', data); sessionStorage.setItem('seeded', '1');}}, JSON.stringify(seedSave));
        await this.hooks.beforeOpen?.(this.context, seedSave);
        const page = this.page = await this.context.newPage();
        page.setDefaultTimeout(this.opTimeout);
        page.on('pageerror', e => this.errors.push({op:this.op, kind:'pageerror', text:(e.stack || e.message).slice(0, 600)}));
        page.on('console', m => {if(m.type() === 'error') this.errors.push({op:this.op, kind:'console', text:m.text().slice(0, 600)});});
        await page.goto(this.url);
        const play = page.locator('#loading_screen_play_button');
        await play.waitFor({state:'visible', timeout:60000});
        await page.evaluate(() => window.simulationTestHooks.pause());
        await play.click();
        const confirm = page.locator('#hero_creation_panel_confirmation');
        if(await confirm.isVisible().catch(() => false)) await confirm.click();
        await page.waitForTimeout(300);
    }
    // Same loop as HeadlessGame.step: chunks of up to 60 ticks until the calendar target.
    step(minutes) {
        return this.page.evaluate(minutes => {
            const now = () => {const t = window.simulationTestHooks.snapshot()['current time']; return t.day_count * 1440 + t.hour * 60 + t.minute;};
            const target = now() + minutes;
            for(let m = now(), i = 0; m < target; m = now()) {
                if(++i > 10000) throw new Error('Game clock did not advance ' + minutes + ' minutes.');
                window.advanceTicks(Math.min(60, target - m));
            }
        }, minutes);
    }
    async save() {
        await this.page.evaluate(() => window.saveProgress());
        return JSON.parse(await this.page.evaluate(() => localStorage.getItem('save data')));
    }
    /** What a player sees plus what the game holds, as hashes and a few public facts. Raw state stays out of the trace. */
    async observe() {
        const o = await this.page.evaluate(() => {
            const snap = window.simulationTestHooks.snapshot(), t = snap['current time'];
            const text = id => document.getElementById(id)?.innerText.trim() ?? '';
            return {snap, minute:t.day_count * 1440 + t.hour * 60 + t.minute, location:text('location_name_span'), screen:document.body.innerText};
        });
        return {minute:o.minute, location:o.location, state:stateHash(o.snap), screen:sha(o.screen)};
    }
    /**
     * Cheap UI checks on the current screen (UR rules a bot can run without judgment).
     * pageOverflow: the page scrolls sideways. clipped: visible text cut by overflow
     * without an ellipsis. unlabeled: a visible control with no text, aria-label or title.
     */
    uiCheck() {
        return this.page.evaluate(() => {
            const visible = el => {const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';};
            const name = el => el.id ? '#' + el.id : el.localName + (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '');
            const doc = document.documentElement;
            const clipped = [], unlabeled = [];
            for(const el of document.body.querySelectorAll('*')) {
                if(el.children.length || !el.textContent.trim() || !visible(el)) continue;
                const cs = getComputedStyle(el);
                if(/hidden|clip/.test(cs.overflowX) && cs.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 1) clipped.push(name(el));
            }
            for(const el of document.querySelectorAll('button, [role="button"], a[href], input[type="button"], input[type="submit"]'))
                if(visible(el) && !el.disabled && !(el.innerText || el.value || '').trim() && !el.getAttribute('aria-label') && !el.title && !el.querySelector('img[alt]:not([alt=""]), svg title')) unlabeled.push(name(el));
            // COV10: a toggle that shows only an arrow or cross must say what it opens, and a disabled button must say why.
            const bareToggles = [], disabledNoReason = [];
            for(const el of document.querySelectorAll('button, summary'))
                if(visible(el) && /^[\s▾▸▼▶◂◀×✕+–-]*$/.test(el.innerText || '') && (el.innerText || '').trim() && !el.getAttribute('aria-label')) bareToggles.push(name(el));
            for(const el of document.querySelectorAll('button:disabled'))
                if(visible(el) && !el.title && !el.getAttribute('aria-describedby') && !el.getAttribute('aria-label') && !(el.nextElementSibling?.textContent || '').trim()) disabledNoReason.push((el.innerText || name(el)).trim().slice(0, 40));
            return {pageOverflow:doc.scrollWidth > innerWidth + 1 ? doc.scrollWidth - innerWidth : 0, clipped:[...new Set(clipped)], unlabeled:[...new Set(unlabeled)], bareToggles:[...new Set(bareToggles)], disabledNoReason:[...new Set(disabledNoReason)]};
        });
    }
    async close() {await this.context?.close().catch(() => {}); await this.browser?.close().catch(() => {});}
}
