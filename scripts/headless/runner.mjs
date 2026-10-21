// Headless full-game runner: boots the real src/main.js bundle (native game plus
// expansion, presentation included) in Node with an in-process DOM, in-memory
// storage, seeded randomness and a virtual wall clock. Game time advances only
// through the engine's own dev stepper (advanceTicks), as fast as the CPU allows.
//
//   const game = await boot({save, seed: 7});      // save: object, JSON string, or null for fresh
//   await game.step(60);                            // game minutes
//   await game.click('[data-village-action="village.waypost"]');
//   await game.call('change_location', {location_id: 'Shack'});
//   const saved = await game.save();                // real save_progress -> localStorage path
//
// One live game per process: each boot reinstalls the browser globals.
import {readFile, mkdir, writeFile, readdir, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {webcrypto} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {runInThisContext} from 'node:vm';
import {createDom} from './dom.mjs';
import {createVisibility} from './css.mjs';
import {LAMP_SCENARIO_BRIDGE} from './scenario.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(here, '../..');
export const SAVE_KEY = 'save data';
const realDate = Date, realRandom = Math.random;

// Main's module-scope state the harness reads. Getters keep live bindings.
const INTERNALS = ['expansionState','character','current_location','current_game_time','current_activity','current_game_action',
    'current_combat','current_dialogue','current_trader','is_sleeping','is_reading','expansionError','foundationSaveBlocked','is_loading_error',
    'ownsSave','tickrate','global_flags','game_options','skills','locations','recipes','item_templates','dialogues','traders','activities',
    'questManager','inventories','availabilities','expeditionRegistry','authorityBootError','authorityOperationBusy','lifeStorageFailure','game_version'];
const FUNCTIONS = ['create_save','load','update_timer','advanceTicks','gameplaySnapshot','campaignContext','nativeOccupationReason','feedbackClockPauseReason','is_in_trade'];
const HARNESS_TAIL = `
${LAMP_SCENARIO_BRIDGE}
export {scenarioLampOperations};
export const __headless = {
${INTERNALS.map(n => `    get ${n}() {try {return ${n};} catch {return undefined;}},`).join('\n')}
${FUNCTIONS.map(n => `    ${n}: (...args) => ${n}(...args),`).join('\n')}
};
`;

async function hashTree(dir, hash, filter) {
    for(const entry of (await readdir(dir, {withFileTypes:true})).sort((a, b) => a.name.localeCompare(b.name))) {
        const path = join(dir, entry.name);
        if(entry.isDirectory()) await hashTree(path, hash, filter);
        else if(filter(path)) {const s = await stat(path); hash.update(`${path}:${s.size}:${s.mtimeMs}\n`);}
    }
}

/** Bundle src/main.js once per source state; returns the cached .mjs path. */
export async function bundleGame({root = ROOT, force = false} = {}) {
    const hash = createHash('sha256');
    await hashTree(join(root, 'src'), hash, p => /\.(m?js|json|ink)$/.test(p));
    await hashTree(join(root, 'locales'), hash, () => true);
    hash.update(await readFile(fileURLToPath(import.meta.url)));
    hash.update(await readFile(join(root, 'scripts/headless/scenario.mjs')));
    const dir = join(tmpdir(), 'yairpg-headless'), out = join(dir, `game-${hash.digest('hex').slice(0, 16)}.mjs`);
    if(!force) try {await stat(out); return out;} catch {}
    await mkdir(dir, {recursive:true});
    const {build} = await import('esbuild');
    const tmp = out + `.${process.pid}.tmp.mjs`;
    await build({entryPoints:[join(root, 'src/main.js')], bundle:true, format:'esm', platform:'browser', target:'es2022',
        outfile:tmp, logLevel:'error', sourcemap:'inline',
        plugins:[{name:'headless-internals', setup(b) {
            b.onLoad({filter:/[\\/]src[\\/]main\.js$/}, async a => ({contents:(await readFile(a.path, 'utf8')) + HARNESS_TAIL, loader:'js'}));
        }}]});
    const {rename} = await import('node:fs/promises');
    await rename(tmp, out);
    return out;
}

function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296;};
}

// Several game instances (a page and its iframes) share one Node realm. The active
// one's globals are installed; switching snapshots and restores every global.
const Realm = {
    busy:null, booting:null, current:null,
    save(game) {
        const props = new Map();
        for(const k of Reflect.ownKeys(globalThis)) props.set(k, Object.getOwnPropertyDescriptor(globalThis, k));
        game.realm = {props, random:Math.random};
    },
    restore(game) {
        const {props, random} = game.realm;
        for(const k of Reflect.ownKeys(globalThis)) if(!props.has(k)) try {delete globalThis[k];} catch {}
        for(const [k, d] of props) {
            const cur = Object.getOwnPropertyDescriptor(globalThis, k);
            if(cur && cur.value === d.value && cur.get === d.get && cur.set === d.set) continue;
            try {Object.defineProperty(globalThis, k, d);} catch {}
        }
        Math.random = random;
        Realm.current = game;
    },
    /** Run fn with target's globals installed, then switch back. */
    run(target, fn) {
        const prev = Realm.current;
        if(!target.realm || prev === target || !prev) return fn();
        Realm.save(prev); Realm.restore(target);
        try {return fn();} finally {Realm.save(target); Realm.restore(prev);}
    },
};

/** Storage with a real prototype, so tests can inject failures the way browsers do. */
export class MemoryStorage {
    constructor(entries) {Object.defineProperty(this, '_m', {value:new Map(entries ? Object.entries(entries) : [])});}
    get length() {return this._m.size;}
    key(i) {return [...this._m.keys()][i] ?? null;}
    getItem(k) {return this._m.has(String(k)) ? this._m.get(String(k)) : null;}
    setItem(k, v) {this._m.set(String(k), String(v));}
    removeItem(k) {this._m.delete(String(k));}
    clear() {this._m.clear();}
    toJSON() {return Object.fromEntries(this._m);}
}
// `key in localStorage` must see stored keys, as in browsers.
const storageProxy = s => new Proxy(s, {
    has: (t, k) => typeof k === 'string' && (t._m.has(k) || k in t),
    get: (t, k, r) => {const v = Reflect.get(t, k, t); return typeof v === 'function' ? v.bind(t) : v !== undefined || typeof k !== 'string' ? v : t._m.get(k);},
    ownKeys: t => [...t._m.keys()],
    getOwnPropertyDescriptor: (t, k) => t._m.has(k) ? {enumerable:true, configurable:true, value:t._m.get(k)} : undefined,
});

// Globals a boot replaces; close() restores Node's originals (or deletes them).
const NODE_GLOBALS = ['crypto','Date','setTimeout','setInterval','clearTimeout','clearInterval','requestAnimationFrame','cancelAnimationFrame',
    'requestIdleCallback','cancelIdleCallback','window','self','top','parent','frames','location','document','localStorage','sessionStorage','Storage',
    'navigator','MutationObserver','ResizeObserver','IntersectionObserver','matchMedia','getComputedStyle','Audio','Image','alert','confirm','prompt',
    'scrollTo','scrollBy','scroll','focus','blur','open','postMessage','getSelection','innerWidth','innerHeight','outerWidth','outerHeight','devicePixelRatio',
    'scrollX','scrollY','pageXOffset','pageYOffset','screen','history','visualViewport','CSS','onerror','onload','fetch','event','addEventListener',
    'removeEventListener','dispatchEvent','_fire','_listeners','Event','CustomEvent','UIEvent','MouseEvent','PointerEvent','KeyboardEvent','FocusEvent',
    'InputEvent','DragEvent','EventTarget','Node','Text','Comment','Element','HTMLElement','DocumentFragment','Document',
    'advanceTicks','simulationTestHooks'];
const HTML_ELEMENT_NAMES = ['HTMLElement','HTMLDivElement','HTMLSpanElement','HTMLButtonElement','HTMLInputElement','HTMLSelectElement','HTMLOptionElement',
    'HTMLTextAreaElement','HTMLDetailsElement','HTMLAnchorElement','HTMLImageElement','HTMLCanvasElement','HTMLLabelElement','HTMLFormElement',
    'HTMLDialogElement','HTMLTableElement','HTMLTableRowElement','HTMLTableCellElement','HTMLUListElement','HTMLLIElement','HTMLParagraphElement',
    'HTMLHeadingElement','HTMLTemplateElement','HTMLAudioElement','HTMLMediaElement','HTMLSummaryElement','SVGElement'];

/**
 * Boot the full game. save: object | JSON string | null (fresh hero creation).
 * Options: seed (Math.random and crypto.getRandomValues), storage (MemoryStorage or
 * plain entries; shared across reloads), wallStart (virtual Date.now), heroName.
 */
export async function boot(save = null, options = {}) {
    const game = new HeadlessGame(options);
    if(save != null && !options.storage) game.storage.setItem(SAVE_KEY, typeof save === 'string' ? save : JSON.stringify(save));
    await game.reload();
    return game;
}

export class HeadlessGame {
    constructor({seed = 1, storage, wallStart = realDate.UTC(2026, 0, 1), invariants = [], heroName = 'Headless', url = 'http://localhost/?test_hooks=1', verbose = false} = {}) {
        this.verbose = verbose;
        this.seed = seed; this.wall = wallStart; this.invariants = [...invariants]; this.heroName = heroName; this.url = url;
        this.storage = storage instanceof MemoryStorage ? storage : new MemoryStorage(storage);
        this.errors = []; this.logs = []; this.boots = 0; this.stats = {ticks:0, stepMs:0, minutes:0};
        this.unsupportedSelectors = new Set();
        this.prompts = []; this.downloads = []; this.calls = new Map();
    }

    // ---- environment ----
    _install() {
        const game = this, dom = createDom({unsupported:this.unsupportedSelectors, onConnect:frame => this._connectFrame(frame)});
        const g = globalThis;
        Realm.current = this;
        this.dom = dom; this.document = dom.document; this.timers = new Map(); this.timerId = 1; this.timerNow = 0; this.reloadRequested = false;
        // Remember Node's own globals once, so close() can hand the process back.
        if(!HeadlessGame.nodeGlobals) {
            HeadlessGame.nodeGlobals = new Map();
            for(const k of [...NODE_GLOBALS, ...HTML_ELEMENT_NAMES]) HeadlessGame.nodeGlobals.set(k, Object.getOwnPropertyDescriptor(g, k));
            HeadlessGame.nodeURL = {create:URL.createObjectURL, revoke:URL.revokeObjectURL};
        }
        const def = (k, v) => Object.defineProperty(g, k, {value:v, writable:true, configurable:true, enumerable:false});
        const random = mulberry32(this.seed);
        Math.random = random;
        def('crypto', {subtle:webcrypto.subtle, getRandomValues(a) {for(let i = 0; i < a.length; i++) a[i] = Math.floor(random() * 2 ** (8 * (a.BYTES_PER_ELEMENT || 1))); return a;},
            randomUUID() {const h = [...Array(32)].map(() => Math.floor(random() * 16).toString(16)); h[12] = '4'; h[16] = (8 + Math.floor(random() * 4)).toString(16); const s = h.join(''); return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;}});
        class VirtualDate extends realDate {
            constructor(...a) {if(a.length) super(...a); else super(game.wall);}
            static now() {return game.wall;}
        }
        def('Date', VirtualDate);
        // Native (non-engine) timers run on their own clock, only when the harness settles.
        // Date stays frozen meanwhile, like a dev-stepped browser whose engine is paused.
        const add = (fn, delay, args, interval) => {const id = this.timerId++; this.timers.set(id, {id, fn, args, delay:Math.max(interval ? 1 : 0, +delay || 0), due:this.timerNow + Math.max(0, +delay || 0), interval}); return id;};
        def('setTimeout', (fn, delay, ...args) => add(fn, delay, args, false));
        def('setInterval', (fn, delay, ...args) => add(fn, delay, args, true));
        def('clearTimeout', id => {this.timers.delete(id);});
        def('clearInterval', id => {this.timers.delete(id);});
        def('requestAnimationFrame', fn => add(() => fn(performance.now()), 16, [], false));
        def('cancelAnimationFrame', id => {this.timers.delete(id);});
        def('requestIdleCallback', fn => add(() => fn({didTimeout:false, timeRemaining:() => 50}), 1, [], false));
        def('cancelIdleCallback', id => {this.timers.delete(id);});
        const url = new URL(this.url);
        const location = {href:url.href, origin:url.origin, protocol:url.protocol, host:url.host, hostname:url.hostname, port:url.port,
            pathname:url.pathname, search:url.search, hash:url.hash, reload() {game.reloadRequested = true;}, assign() {game.reloadRequested = true;}, replace() {game.reloadRequested = true;}, toString() {return url.href;}};
        def('window', g); def('self', g); def('frames', g);
        def('top', this.parentWindow ?? g); def('parent', this.parentWindow ?? g);
        def('location', location); def('document', dom.document);
        dom.setWindow(g);
        for(const [k, v] of Object.entries(dom.classes)) def(k, v);
        for(const n of HTML_ELEMENT_NAMES) def(n, dom.classes.Element);
        for(const k of ['addEventListener', 'removeEventListener', 'dispatchEvent', '_fire']) def(k, function(...a) {return dom.classes.EventTarget.prototype[k].apply(this, a);});
        def('_listeners', new Map());
        const storage = storageProxy(this.storage);
        def('localStorage', storage); def('sessionStorage', storageProxy(new MemoryStorage()));
        def('Storage', MemoryStorage);
        def('navigator', {userAgent:'YAIRPG-headless', platform:'MacIntel', language:'en-US', languages:['en-US'], onLine:true, hardwareConcurrency:1,
            clipboard:{writeText:() => Promise.resolve(), readText:() => Promise.resolve('')},
            locks:{request(name, opts, cb) {const fn = typeof opts === 'function' ? opts : cb; return Promise.resolve().then(() => fn({name, mode:'exclusive'}));}, query:() => Promise.resolve({held:[], pending:[]})}});
        const observer = class {constructor(cb) {this.cb = cb;} observe() {} unobserve() {} disconnect() {} takeRecords() {return [];}};
        def('MutationObserver', observer); def('ResizeObserver', observer); def('IntersectionObserver', observer);
        def('matchMedia', q => ({matches:false, media:q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}}));
        def('getComputedStyle', el => el?.style ?? {getPropertyValue:() => ''});
        def('Audio', class {play() {return Promise.resolve();} pause() {} addEventListener() {}});
        def('Image', class {constructor() {return dom.document.createElement('img');}});
        def('alert', msg => {this.prompts.push({type:'alert', msg});});
        def('confirm', msg => {this.prompts.push({type:'confirm', msg}); return this.nextConfirm ?? true;});
        def('prompt', msg => {this.prompts.push({type:'prompt', msg}); const v = this.nextPrompt ?? null; this.nextPrompt = undefined; return v;});
        def('scrollTo', () => {}); def('scrollBy', () => {}); def('scroll', () => {}); def('focus', () => {}); def('blur', () => {});
        def('open', () => null);
        // Messages to this window come from frames or from itself; delivery is a later turn.
        def('postMessage', (data, origin) => this._post(this, data, origin, this.selfWindow)); def('getSelection', () => dom.document.getSelection());
        def('innerWidth', 1366); def('innerHeight', 768); def('outerWidth', 1366); def('outerHeight', 768); def('devicePixelRatio', 1);
        def('scrollX', 0); def('scrollY', 0); def('pageXOffset', 0); def('pageYOffset', 0);
        def('screen', {width:1366, height:768, availWidth:1366, availHeight:768});
        def('history', {state:null, pushState() {}, replaceState() {}, back() {}});
        def('visualViewport', null);
        def('CSS', {supports:() => true, escape:s => String(s).replace(/[^\w-]/g, c => '\\' + c)});
        def('onerror', null);
        // Same-origin fetches read the checkout, as the static server would; missing files 404.
        def('fetch', async input => {
            const target = new URL(String(input?.url ?? input), url.href);
            if(target.origin !== url.origin) throw new TypeError(`Headless fetch blocked for ${target.href}`);
            const path = resolve(ROOT, '.' + decodeURIComponent(target.pathname));
            if(!path.startsWith(ROOT)) return new Response(null, {status:404});
            try {return new Response(await readFile(path), {status:200});} catch {return new Response(null, {status:404});}
        });
        URL.createObjectURL = blob => {const id = `blob:headless/${this.downloads.length}`; this.downloads.push({id, blob}); return id;};
        URL.revokeObjectURL = () => {};
        // Each listener runs isolated: a throw reports a page error, dispatch continues.
        dom.classes.EventTarget.prototype._fire = function(event, capture) {
            if(!this._listeners?.get(event.type)?.length && typeof this['on' + event.type] !== 'function') {
                // Inline on* attributes compile once, in global scope, with `this` bound.
                const code = this.getAttribute?.('on' + event.type);
                if(!code) return;
                this['on' + event.type] = new Function('event', code);
            }
            const list = this._listeners?.get(event.type);
            if(list) {
                event.currentTarget = this;
                // At the target, capture listeners run before bubble listeners (Chrome 89+).
                const ordered = event.eventPhase === 2 ? [...list.filter(l => l.capture), ...list.filter(l => !l.capture)] : [...list];
                for(const l of ordered) {
                    if(l.capture !== capture && event.eventPhase !== 2) continue;
                    if(l.once) this.removeEventListener(event.type, l.fn, l.capture);
                    const outer = g.event; g.event = event;
                    try {typeof l.fn === 'function' ? l.fn.call(this, event) : l.fn.handleEvent(event);} catch(e) {game._pageError(e);} finally {g.event = outer;}
                    if(event._stopNow) return;
                }
            }
            if(!capture || event.eventPhase === 2) {
                if(!this.hasOwnProperty('on' + event.type) && this.getAttribute?.('on' + event.type) && typeof this['on' + event.type] !== 'function') this['on' + event.type] = new Function('event', this.getAttribute('on' + event.type));
                const handler = this['on' + event.type];
                event.currentTarget = this;
                const outer = g.event; g.event = event;
                if(typeof handler === 'function') try {if(handler.call(this, event) === false) event.preventDefault();} catch(e) {game._pageError(e);} finally {g.event = outer;}
            }
        };
    }

    /** Restore Node's timers, Date, crypto, fetch, console and remove browser globals. */
    close() {
        const g = globalThis;
        for(const [k, d] of HeadlessGame.nodeGlobals ?? []) {if(d) Object.defineProperty(g, k, d); else delete g[k];}
        for(const id of HeadlessGame.namedIds ?? []) delete g[id];
        HeadlessGame.namedIds = [];
        Math.random = realRandom;
        if(HeadlessGame.nodeURL) {URL.createObjectURL = HeadlessGame.nodeURL.create; URL.revokeObjectURL = HeadlessGame.nodeURL.revoke;}
        if(HeadlessGame.realConsole) Object.assign(console, HeadlessGame.realConsole);
        this.timers?.clear();
        Realm.current = null; Realm.busy = null;
    }

    // ---- frames: a same-origin <iframe> is another game instance in its own swapped realm ----
    _post(target, data, origin, source) {
        if(origin && origin !== '*' && origin !== new URL(target.url).origin) return;
        const payload = structuredClone(data);
        // Deliver once no frame is booting, so the receiver's promise continuations
        // run with its own globals installed.
        setImmediate(async () => {while(Realm.busy) await Realm.busy; Realm.run(target, () => {
            const event = new target.dom.classes.Event('message');
            Object.assign(event, {data:payload, origin:new URL(this.url).origin, source, ports:[]});
            globalThis.dispatchEvent(event);
        });});
    }
    _connectFrame(frame) {
        const src = frame.getAttribute('src');
        if(!src || frame.contentWindow) return;
        const url = new URL(src, this.url);
        const child = new HeadlessGame({seed:this.seed, storage:this.storage, wallStart:this.wall, url:url.href, verbose:this.verbose});
        child.parentGame = this; child.frame = frame;
        // What each side sees as the other's window.
        child.parentWindow = {postMessage:(data, origin) => child._post(this, data, origin, frame.contentWindow), get closed() {return false;}};
        child.selfWindow = frame.contentWindow = {postMessage:(data, origin) => this._post(child, data, origin, child.parentWindow), get closed() {return !frame.isConnected;}};
        this.frames = [...(this.frames ?? []), child];
        Realm.booting = child;
        Realm.busy = (async () => {
            await new Promise(r => setImmediate(r));
            Realm.save(this);
            try {await child.reload({play:false}); frame.dispatchEvent(new this.dom.classes.Event('load'));}
            catch(e) {child._pageError(e);}
            finally {Realm.save(child); Realm.restore(this); Realm.busy = Realm.booting = null;}
        })();
    }

    _pageError(error) {
        this.errors.push(error?.stack || String(error));
        if(this.onPageError) this.onPageError(error);
    }

    async _html() {
        if(!HeadlessGame._htmlCache) HeadlessGame._htmlCache = await readFile(join(ROOT, 'index.html'), 'utf8');
        return HeadlessGame._htmlCache;
    }
    async _sheets(html) {
        if(!HeadlessGame._sheetCache) {
            const hrefs = [...html.matchAll(/<link\b[^>]*>/g)].map(m => m[0]).filter(t => /rel\s*=\s*"stylesheet"/.test(t))
                .map(t => t.match(/href\s*=\s*"([^"?]+)/)?.[1]).filter(h => h && !/^https?:/.test(h));
            const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
            HeadlessGame._sheetCache = [...await Promise.all(hrefs.map(h => readFile(join(ROOT, h), 'utf8').catch(() => ''))), ...inline];
        }
        return HeadlessGame._sheetCache;
    }

    /** Fresh module instance over the same storage, like a browser reload; then clicks PLAY. */
    async reload({play = true} = {}) {
        const bundle = await bundleGame();
        this._install();
        const html = await this._html();
        this.dom.loadHTML(html);
        this.css = createVisibility(await this._sheets(html));
        // Named access: window[id] is the element with that id (static markup only).
        for(const id of HeadlessGame.namedIds ?? []) delete globalThis[id];
        HeadlessGame.namedIds = [];
        for(const el of this.document.querySelectorAll('[id]')) {
            const id = el.id;
            if(!/^[A-Za-z_$][\w$]*$/.test(id) || id in globalThis) continue;
            Object.defineProperty(globalThis, id, {get:() => this.document.getElementById(id), set:v => Object.defineProperty(globalThis, id, {value:v, writable:true, configurable:true}), configurable:true});
            HeadlessGame.namedIds.push(id);
        }
        // Classic inline scripts run during parsing, before the module bundle.
        for(const s of this.document.querySelectorAll('script')) {
            const type = s.getAttribute('type');
            if(s.getAttribute('src') || (type && type !== 'text/javascript')) continue;
            try {runInThisContext(classicScript(s.textContent), {filename:'index.html inline script'});} catch(e) {this._pageError(e);}
        }
        this.boots++;
        // Game console output goes to game.logs for the game's lifetime (verbose: also echo).
        HeadlessGame.realConsole ??= {error:console.error, warn:console.warn, log:console.log, info:console.info, debug:console.debug};
        const capture = level => (...args) => {
            this.logs.push({level, text:args.map(a => a instanceof Error ? a.stack : typeof a === 'string' ? a : (() => {try {return JSON.stringify(a);} catch {return String(a);}})()).join(' ')});
            if(this.logs.length > 5000) this.logs.splice(0, 1000);
            if(this.verbose) HeadlessGame.realConsole[level](...args);
        };
        for(const level of ['error', 'warn', 'log', 'info', 'debug']) console[level] = capture(level);
        {
            this.module = await import(pathToFileURL(bundle).href + `?boot=${HeadlessGame.instance = (HeadlessGame.instance || 0) + 1}`);
            this.internals = this.module.__headless;
            this.document.readyState = 'interactive';
            this.document.dispatchEvent(new this.dom.classes.Event('DOMContentLoaded', {bubbles:true}));
            this.document.readyState = 'complete';
            // <body onload> is the window's load handler in browsers.
            const bodyOnload = this.document.body?.getAttribute('onload');
            globalThis.onload = bodyOnload ? new Function('event', bodyOnload) : null;
            globalThis.dispatchEvent(new this.dom.classes.Event('load'));
            await this.settle(0);
            if(typeof globalThis.advanceTicks !== 'function') throw new Error('Test hooks did not enable; boot URL must be localhost with ?test_hooks=1.');
            globalThis.simulationTestHooks.pause();
            await this.settle();
            if(this.internals.is_loading_error) throw new Error('Game reported a loading error:\n' + this.logs.filter(l => l.level === 'error').map(l => l.text).join('\n'));
            if(play) await this._play();
        }
        return this;
    }

    async _play() {
        const button = this.document.getElementById('loading_screen_play_button');
        if(!button) throw new Error('No PLAY button.');
        const fresh = !this.internals.global_flags?.is_hero_created;
        if(fresh) {
            const name = this.document.querySelector('#hero_creation_panel input[type="text"], #character_name_field');
            if(name && this.heroName) {name.value = this.heroName; name.dispatchEvent(new this.dom.classes.Event('input', {bubbles:true})); name.dispatchEvent(new this.dom.classes.Event('change', {bubbles:true}));}
        }
        await this.click(button);
        const confirm = this.document.getElementById('hero_creation_panel_confirmation');
        if(fresh && confirm) await this.click(confirm);
        if(this.errors.length) throw new Error('Boot raised page errors:\n' + this.errors.join('\n'));
    }

    // ---- time ----
    /**
     * Let microtasks and native UI timers run for `ms` of timer time (default one 300 ms
     * render round, like a short pause in a browser). Date.now does not move; use
     * advanceWall for wall-clock features (export reward timers).
     */
    async settle(ms = this.settleMs ?? 300) {
        while(Realm.busy && Realm.booting !== this) await Realm.busy;
        const end = this.timerNow + ms;
        for(let round = 0; round < 50; round++) {
            await new Promise(r => setImmediate(r));
            let ran = 0;
            for(let guard = 0; guard < 10000; guard++) {
                let next = null;
                for(const t of this.timers.values()) if(t.due <= end && (!next || t.due < next.due || (t.due === next.due && t.id < next.id))) next = t;
                if(!next) break;
                this.timerNow = Math.max(this.timerNow, next.due);
                if(next.interval) next.due += Math.max(1, next.delay); else this.timers.delete(next.id);
                try {typeof next.fn === 'function' ? next.fn(...next.args) : (0, eval)(next.fn);} catch(e) {this._pageError(e);}
                ran++;
            }
            await new Promise(r => setImmediate(r));
            if(!ran) break;
        }
        this.timerNow = end;
        if(this.reloadRequested) {this.reloadRequested = false; await this.reload();}
    }
    /** Move the virtual Date.now (export reward and other wall-clock features). */
    advanceWall(ms) {this.wall += ms;}

    /** Raw engine ticks through the real dev stepper. */
    ticks(n, {render = false} = {}) {
        const t0 = performance.now();
        const r = globalThis.advanceTicks(n, {render});
        this.stats.ticks += n; this.stats.stepMs += performance.now() - t0;
        return r;
    }

    /** Game clock in minutes, from the live calendar. */
    minutes() {const t = this.internals.current_game_time; return t ? t.day_count * 1440 + t.hour * 60 + t.minute : null;}

    /** Advance at least `minutes` game minutes (asleep, one tick can cover several). Runs invariants per chunk. */
    async step(minutes, {chunk = 60, invariants = true} = {}) {
        const start = this.minutes(), target = start + minutes;
        const t0 = performance.now();
        let guard = 0;
        for(let now = start; now < target; now = this.minutes()) {
            const before = now;
            this.ticks(Math.min(chunk, target - now));
            if(invariants) this.check({before});
            if(this.minutes() === before && ++guard > 3) throw new Error(`Game clock stopped at ${before} (paused, waiting on a choice, or save-blocked).`);
        }
        this.stats.minutes += this.minutes() - start;
        await this.settle();
        return {minutes:this.minutes() - start, ms:performance.now() - t0};
    }

    /** Step one tick at a time until predicate(game) holds. */
    async stepUntil(predicate, {maxMinutes = 3600} = {}) {
        for(let i = 0; i < maxMinutes; i++) {if(await predicate(this)) return i; this.ticks(1); if(i % 60 === 59) this.check();}
        if(await predicate(this)) return maxMinutes;
        throw new Error(`Predicate did not pass within ${maxMinutes} ticks: ${predicate}`);
    }

    // ---- invariants ----
    addInvariant(fn) {this.invariants.push(fn);}
    check(ctx = {}) {
        const failures = [];
        const i = this.internals;
        if(this.errors.length) failures.push(`page errors: ${this.errors.at(-1).split('\n')[0]}`);
        if(i.expansionError) failures.push(`expansionError: ${i.expansionError}`);
        if(i.is_loading_error) failures.push('is_loading_error');
        const money = i.character?.money;
        if(!Number.isFinite(money) || money < 0) failures.push(`money ${money}`);
        if(ctx.before != null && this.minutes() < ctx.before) failures.push(`clock went backwards ${ctx.before} -> ${this.minutes()}`);
        for(const fn of this.invariants) {try {const r = fn(this, ctx); if(r) failures.push(String(r));} catch(e) {failures.push(e.message);}}
        if(failures.length) throw new Error('Invariant failed at minute ' + this.minutes() + ': ' + failures.join('; '));
    }

    // ---- acting through UI entry points ----
    $(sel) {return typeof sel === 'string' ? this.document.querySelector(sel) : sel;}
    $$(sel) {return this.document.querySelectorAll(sel);}
    text(sel = 'body') {return this.$(sel)?.textContent ?? null;}
    /** Click an element (selector or node) the way a user does: events, default activation, then settle. */
    async click(sel) {
        const el = this.$(sel);
        if(!el) throw new Error(`No element for ${sel}`);
        // Playwright's actionability: disabled or aria-disabled (self or ancestor) is not clickable.
        if(el.disabled || el.closest('[aria-disabled="true"]')) throw new Error(`Element is disabled: ${typeof sel === 'string' ? sel : el.outerHTML.slice(0, 120)}${this._blockReason(el)}`);
        const hidden = this.hiddenReason(el);
        if(hidden) throw new Error(`Element is not visible (${hidden}): ${typeof sel === 'string' ? sel : el.outerHTML.slice(0, 120)}`);
        this._count('click:' + entryKey(el));
        const E = this.dom.classes;
        el.dispatchEvent(new E.PointerEvent('pointerdown', {bubbles:true, cancelable:true}));
        el.dispatchEvent(new E.MouseEvent('mousedown', {bubbles:true, cancelable:true}));
        el.focus?.();
        el.dispatchEvent(new E.PointerEvent('pointerup', {bubbles:true, cancelable:true}));
        el.dispatchEvent(new E.MouseEvent('mouseup', {bubbles:true, cancelable:true}));
        el.click();
        await this.settle();
        return el;
    }
    _blockReason(el) {const root = el.closest('[data-state]'); return root ? ` (${root.dataset.state}: ${root.textContent.replace(/\s+/g, ' ').trim().slice(0, 200)})` : '';}
    /** Click the first visible, enabled element whose text matches. */
    async clickText(text, scope = 'button, summary, a, [role="button"], .location_choice, .activity_choice, .dialogue_choice') {
        const el = this.$$(scope).find(e => (typeof text === 'string' ? e.textContent.trim() === text : text.test(e.textContent)) && !e.disabled && !this.hiddenReason(e));
        if(!el) throw new Error(`No clickable element with text ${text}`);
        return this.click(el);
    }
    /** Set a form control's value and fire input/change, like typing or choosing. */
    async fill(sel, value) {
        const el = this.$(sel); if(!el) throw new Error(`No element for ${sel}`);
        this._count('fill:' + entryKey(el));
        if(el.type === 'checkbox' || el.type === 'radio') el.checked = !!value; else el.value = value;
        const E = this.dom.classes;
        el.dispatchEvent(new E.InputEvent('input', {bubbles:true})); el.dispatchEvent(new E.Event('change', {bubbles:true}));
        await this.settle();
        return el;
    }
    async key(key, init = {}) {
        this._count('key:' + key);
        const E = this.dom.classes, target = this.document.activeElement ?? this.document.body;
        target.dispatchEvent(new E.KeyboardEvent('keydown', {key, bubbles:true, cancelable:true, ...init}));
        target.dispatchEvent(new E.KeyboardEvent('keyup', {key, bubbles:true, cancelable:true, ...init}));
        await this.settle();
    }
    /** Call a window-level entry point that index.html or panel markup calls (window.change_location, ...). */
    async call(name, ...args) {
        const fn = globalThis[name];
        if(typeof fn !== 'function') throw new Error(`No window entry point ${name}`);
        this._count('call:' + name);
        // Async entry points may wait on UI timers, which only run while settling.
        let state = null;
        Promise.resolve().then(() => fn(...args)).then(value => {state = {value};}, error => {state = {error};});
        for(let i = 0; i < 400 && !state; i++) await this.settle(i < 10 ? 0 : 100);
        if(!state) throw new Error(`${name} did not settle within 40 s of timer time`);
        if(state.error) {this._pageError(state.error); throw state.error;}
        await this.settle();
        return state.value;
    }
    /** Why a user could not see this element (stylesheet display/visibility, hidden, closed details), or null. */
    hiddenReason(el) {this.css.reset(); return this.css.hiddenReason(el);}
    /** Every currently actionable control: buttons, summaries, inputs, links and on* handlers that are visible and enabled. */
    clickables() {
        this.css.reset();
        return this.$$('button, summary, a[href], a[onclick], input, select, textarea, [onclick], [role="button"], [data-village-action], [data-expedition-action], [data-dialogue], [data-textline], [data-trader_item], [data-character_item], [tabindex]')
            .filter(e => !e.disabled && !e.closest('[aria-disabled="true"]') && !this.css.hiddenReason(e)).map(e => ({key:entryKey(e), text:e.textContent.trim().slice(0, 60), el:e}));
    }
    /** Window functions installed by the game and index.html (the console/markup command surface). */
    windowEntryPoints() {
        return Object.getOwnPropertyNames(globalThis).filter(k => typeof globalThis[k] === 'function' && HeadlessGame.baseGlobals && !HeadlessGame.baseGlobals.has(k) && !/^[A-Z]/.test(k));
    }
    _count(key) {this.calls.set(key, (this.calls.get(key) || 0) + 1);}

    // ---- persistence through the real code paths ----
    /** Manual save (window.saveProgress), then the stored bytes parsed. */
    async save() {await this.call('saveProgress'); return JSON.parse(this.storage.getItem(SAVE_KEY));}
    /** The save main would write now, without writing (simulationTestHooks.snapshot). */
    snapshot() {return globalThis.simulationTestHooks.snapshot();}
    /** Encoded file string from the options-menu export (window.save_to_file). */
    async exportFile() {const encoded = await this.call('save_to_file'); if(!encoded) throw new Error('Export returned nothing: ' + this.lastLog()); return encoded;}
    /** Options-menu import (window.load_progress): preflight, storage write, page reload. */
    async importFile(encoded) {
        const boots = this.boots;
        await this.call('load_progress', encoded);
        if(this.boots === boots) throw new Error('Import did not reload: ' + this.lastLog());
        return this;
    }
    /** Replace stored save bytes and reload, like a fixture init script before navigation. */
    async load(save) {this.storage.setItem(SAVE_KEY, typeof save === 'string' ? save : JSON.stringify(save)); return this.reload();}
    lastLog() {const log = this.document.getElementById('message_log_div') ?? this.document.body; return log.textContent.trim().slice(0, 300);}
}
HeadlessGame.baseGlobals = new Set(Object.getOwnPropertyNames(globalThis));

// A reload gets a fresh realm in browsers; here top-level let/const become var so a
// second boot can redeclare them in the shared Node realm.
function classicScript(code) {
    const indent = Math.min(...code.split('\n').filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length));
    return code.replace(new RegExp(`^(\\s{${indent}})(let|const)\\s`, 'gm'), '$1var ');
}

function entryKey(el) {
    const data = el.getAttributeNames().filter(a => a.startsWith('data-') && /action|dialogue|textline|location|recipe|choice|command|activity|trade|item|village|expedition/.test(a));
    if(data.length) return data.map(a => `[${a}="${el.getAttribute(a)}"]`).join('');
    if(el.id) return '#' + el.id;
    if(el.getAttribute('onclick')) return `${el.localName}[onclick=${el.getAttribute('onclick').replace(/\(.*$/s, '')}]`;
    return `${el.localName}${el.classList.length ? '.' + [...el.classList].join('.') : ''}`;
}

/** det.cjs canonical form: drop wall-clock fields, stable key order. */
export function canonicalSave(save) {
    const copy = typeof save === 'string' ? JSON.parse(save) : structuredClone(save);
    for(const k of ['saved_at', 'total_playtime']) delete copy[k];
    if(copy.game_stats) delete copy.game_stats.total_playtime;
    const sort = v => Array.isArray(v) ? v.map(sort) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sort(v[k])])) : v;
    return JSON.stringify(sort(copy));
}

/** First differing paths between two saves, for parity reports. */
export function diffSaves(a, b, limit = 20) {
    const out = [];
    const walk = (x, y, path) => {
        if(out.length >= limit) return;
        if(JSON.stringify(x) === JSON.stringify(y)) return;
        if(x && y && typeof x === 'object' && typeof y === 'object' && Array.isArray(x) === Array.isArray(y)) {
            for(const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], path + '/' + k);
        } else out.push({path, a:JSON.stringify(x)?.slice(0, 160), b:JSON.stringify(y)?.slice(0, 160)});
    };
    walk(typeof a === 'string' ? JSON.parse(a) : a, typeof b === 'string' ? JSON.parse(b) : b, '');
    return out;
}
