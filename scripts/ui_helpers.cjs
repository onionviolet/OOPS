const fs = require('node:fs');

const openNotebook = async page => {
    await page.locator('#journal_show_notebook').waitFor({state:'visible'});
    if(!await page.locator('#notebook_box_div').isVisible()) await page.locator('#journal_show_notebook').click();
};

// One browser choice for every check: YAIRPG_CHROME, then system Chrome, then Playwright's bundled Chromium.
const SYSTEM_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CODEX_PLAYWRIGHT = '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
const loadPlaywright = () => {
    for(const id of [process.env.YAIRPG_PLAYWRIGHT, 'playwright', CODEX_PLAYWRIGHT].filter(Boolean)) {
        try {return require(id);} catch(e) {if(e.code !== 'MODULE_NOT_FOUND') throw e;}
    }
    throw new Error('Playwright not found. Set YAIRPG_PLAYWRIGHT to its module path.');
};
const chromeExecutable = () => process.env.YAIRPG_CHROME || (fs.existsSync(SYSTEM_CHROME) ? SYSTEM_CHROME : undefined);
const launchChrome = (options = {}) => loadPlaywright().chromium.launch({headless:true, executablePath:chromeExecutable(), ...options});

/** Launch, run, and always close the browser, even when an assertion throws. */
async function runBrowser(fn, options) {
    const browser = await launchChrome(options);
    try {return await fn(browser);}
    finally {await browser.close().catch(() => {});}
}

// waitForFunction defaults to every animation frame; 250 ms matches the cost of an idle page.
const POLL_MS = 250;
const waitForPage = (page, predicate, arg, options = {}) => page.waitForFunction(predicate, arg, {polling:POLL_MS, ...options});

/** Wait until predicate(save, arg) holds. The save is parsed once per poll. */
const waitForSave = (page, predicate, arg, options = {}) => page.waitForFunction(({source, arg}) => {
    const cache = window.__yairpgSavePredicates ||= new Map();
    if(!cache.has(source)) cache.set(source, (0, eval)(`(${source})`));
    const raw = localStorage.getItem('save data');
    return !!raw && !!cache.get(source)(JSON.parse(raw), arg);
}, {source:predicate.toString(), arg}, {polling:POLL_MS, ...options});

// Dev-stepped time: the ?test_hooks=1 engine stepper (src/simulation_clock.js, advanceTicks).
// YAIRPG_REAL_TIMERS=1 keeps natural-pace evidence: real waits, same predicates.
const realTimers = () => process.env.YAIRPG_REAL_TIMERS === '1';
const timeMode = () => realTimers() ? 'natural-pace' : 'dev-stepped';
const withTestHooks = url => {
    if(realTimers() || /[?&]test_hooks=1\b/.test(url)) return url;
    return url + (url.includes('?') ? '&' : '?') + 'test_hooks=1';
};

/** Advance at least n game minutes. Asleep, one tick can cover several minutes. */
async function advanceGameMinutes(page, minutes) {
    if(realTimers()) {
        const tickrate = await page.evaluate(() => window.simulationTestHooks?.tickrate() || 1);
        return page.waitForTimeout(minutes * 1000 / tickrate + 100);
    }
    return page.evaluate(minutes => {
        if(typeof advanceTicks !== 'function') throw new Error('Dev stepping needs a localhost ?test_hooks=1 URL.');
        // Awake, one tick is one minute. A save-blocked page has no snapshot, so plain ticks are all we can count.
        const now = () => {try {const t = simulationTestHooks.snapshot()['current time']; return t.day_count * 1440 + t.hour * 60 + t.minute;} catch {return null;}};
        const start = now();
        if(start === null) return void advanceTicks(minutes);
        const target = start + minutes;
        for(let left = minutes, i = 0; left > 0; left = target - now()) {
            if(++i > 1000) throw new Error('Game clock did not advance '+minutes+' minutes.');
            advanceTicks(left);
        }
    }, minutes);
}

/** Drop-in for page.waitForTimeout(ms) where the sleep only waits for game time (render ticks included).
 * dev-stepped: runs the ticks that ms would have produced at the current tickrate. natural-pace: really sleeps. */
async function waitGameTime(page, ms) {
    if(realTimers()) return page.waitForTimeout(ms);
    return page.evaluate(ms => {
        if(typeof advanceTicks !== 'function') throw new Error('Dev stepping needs a localhost ?test_hooks=1 URL.');
        advanceTicks(Math.max(1, Math.round(ms / 1000 * simulationTestHooks.tickrate())), {render:true});
    }, ms);
}

/** Step the engine one tick at a time until predicate(arg) holds in the page. */
async function stepUntil(page, predicate, arg, {maxMinutes = 3600, timeout} = {}) {
    if(realTimers()) return waitForPage(page, predicate, arg, timeout ? {timeout} : {});
    const passed = await page.evaluate(({source, arg, maxMinutes}) => {
        if(typeof advanceTicks !== 'function') throw new Error('Dev stepping needs a localhost ?test_hooks=1 URL.');
        const predicate = (0, eval)(`(${source})`);
        for(let i = 0; i < maxMinutes; i++) {if(predicate(arg)) return true; advanceTicks(1);}
        return !!predicate(arg);
    }, {source:predicate.toString(), arg, maxMinutes});
    if(!passed) throw new Error(`Predicate did not pass within ${maxMinutes} dev-stepped ticks: ${predicate}`);
}

module.exports = {openNotebook, SYSTEM_CHROME, loadPlaywright, chromeExecutable, launchChrome, runBrowser,
    waitForPage, waitForSave, timeMode, withTestHooks, advanceGameMinutes, stepUntil, waitGameTime};
