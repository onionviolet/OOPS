// Browser check of the atlas pages: loads each page in headless Chrome, reports console errors, failed requests and
// horizontal overflow, and saves one screenshot per page. Read-only.
// Usage: start the server (ATLAS_PORT=47930 node prototypes/world-atlas/serve.mjs), then
//   node prototypes/world-atlas/bench/browser-check.cjs <out-dir> [port] [width] [height]
// The passage check quotes book text, so its screenshot must never go into a tracked folder; it is skipped unless
// ATLAS_CHECK_PASSAGE=1, and then written as passage-check.PRIVATE.png.
const {join, resolve} = require('node:path');
const {mkdirSync} = require('node:fs');
const {launchChrome} = require('../../../scripts/ui_helpers.cjs');

const [out = '.', port = '47930', w = '1920', h = '1080'] = process.argv.slice(2);
const OUT = resolve(out), B = `http://127.0.0.1:${port}/`;
mkdirSync(OUT, {recursive: true});
const PAGES = [['codex', 'codex/gu_kinds'], ['codex-moves', 'codex/gu_moves'], ['cheats', 'cheats/list'], ['candidates', 'cheats/candidates'],
    ['ideas', 'ideas'], ['changes', 'changes'], ['worlds', 'worlds'], ['codex-map', 'codex-map'], ['drafts', 'workbench/drafts']];

(async () => {
    const br = await launchChrome();
    const p = await (await br.newContext({viewport: {width: +w, height: +h}})).newPage();
    let errs = [];
    p.on('pageerror', e => errs.push('pageerror ' + e.message));
    // "Failed to load resource" repeats a failed response, which the response handler already reports (minus the favicon).
    p.on('console', m => {if (m.type() === 'error' && !/^Failed to load resource/.test(m.text())) errs.push('console ' + m.text());});
    p.on('response', r => {if (r.status() >= 400 && !r.url().endsWith('/favicon.ico')) errs.push(r.status() + ' ' + r.url());});
    let bad = 0;
    for (const [name, hash] of PAGES) {
        errs = [];
        const t = Date.now();
        await p.goto(B + '#' + hash);
        const ok = await p.waitForFunction(() => {const m = document.querySelector('main'); return m && m.innerText.trim().length > 40 && !/Loading|Reading every/.test(m.innerText);}, null, {timeout: 60000}).then(() => true, () => false);
        await p.waitForTimeout(400);
        const o = await p.evaluate(() => ({overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth}));
        await p.screenshot({path: join(OUT, name + '.png')});
        const problems = [...(ok ? [] : ['did not finish rendering']), ...(o.overflow ? ['horizontal overflow'] : []), ...errs];
        if (problems.length) bad++;
        console.log(`${problems.length ? 'FAIL' : 'ok  '} ${name} ${Date.now() - t}ms${problems.length ? ' · ' + problems.join(' · ') : ''}`);
    }
    if (process.env.ATLAS_CHECK_PASSAGE === '1') {
        await p.goto(B + '#codex/gu_kinds');
        await p.locator('.codex-rows button').first().click();
        await p.locator('button', {hasText: 'Check this passage'}).first().click();
        await p.waitForTimeout(5000);
        await p.screenshot({path: join(OUT, 'passage-check.PRIVATE.png')});
        console.log('passage check screenshot written (private: contains book text)');
    }
    await br.close();
    process.exit(bad ? 1 : 0);
})();
