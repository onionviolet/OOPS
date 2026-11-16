// Visual baselines (UIC122): every CSS change risks layout shifts nobody sees. This captures five screens
// of the built game in headless Chrome at 1920x1080 (mid fixture, fixed seed and wall clock, animation
// frozen) and compares them pixel by pixel with stored PNGs. Runs on request, not in npm test.
// Usage: npm run check:visual [-- --rev HEAD] [--update] [--dir <path>]   (default dir tests/fixtures/visual)
//   --update  writes the baselines. Otherwise prints per screen "identical" or the differing pixel count and
//   bounding box, writes <name>.new.png beside a differing baseline, and exits 1 on any difference or missing baseline.
//   --lives   also captures two book lives at their adopted views (PS90): Fang Yuan's day (ri-fang-yuan-ice-crystal,
//   his day opened, stopped before any patrol) and Klein at lotm-kjw42 (Here). Both are private saves, so their baselines
//   live outside git in docs/research/novels/visual-baselines/ and are skipped when the private checkpoints are absent.
// Hidden flag --nudge moves the top bar down 1px with a transform, to prove a one-pixel shift is caught.
import {readFile, writeFile, mkdtemp, mkdir, symlink, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareTree, build, serve} from './perf/lib.mjs';
import {Session} from './playtest/lib.mjs';
import {defaultCustomizationState} from '../src/customization_profiles.js';

const root = new URL('..', import.meta.url).pathname;
const arg = (n, d) => process.argv.includes(n) ? process.argv[process.argv.indexOf(n) + 1] : d;
const update = process.argv.includes('--update'), nudge = process.argv.includes('--nudge'), lives = process.argv.includes('--lives');
const dir = arg('--dir', join(root, 'tests/fixtures/visual'));
const tree = await mkdtemp(join(tmpdir(), 'yairpg-visual-'));
prepareTree(arg('--rev', 'WORKTREE'), tree);
// Book lives need the local private packs and checkpoints beside the build; the public screens never load them.
if(lives) for(const p of ['private_packs', 'docs/research/novels']) await symlink(join(root, p), join(tree, p)).catch(() => {});
await build(tree);
const server = await serve(tree);
const session = new Session({url: server.url + '?test_hooks=1', seed: 87, wall: Date.UTC(2026, 9, 26, 15),
    hooks: {beforeOpen: async c => {if(!privateOpen) await c.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));}}});
let privateOpen = false;
const seed = JSON.parse(await readFile(join(root, 'tests/fixtures/perf/mid.json'), 'utf8'));
delete seed.availabilities.recipe.undefined; delete seed.availabilities.recipe['recipe/undefined'];
seed.customization = defaultCustomizationState();
seed.customization.profiles.Default.settings.effects = 'reduced'; // steady captures: the default follows the OS (PS155)
seed.global_flags.is_crafting_unlocked = true;
await session.start();
await session.open(seed);
const p = session.page;
await p.setViewportSize({width: 1920, height: 1080});
await p.addStyleTag({content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}'
    + (nudge ? '#workspace_navigation{transform:translateY(1px)!important}' : '')});
await p.waitForTimeout(600);

const route = async id => {await p.locator(`#workspace_navigation button[data-route-id="${id}"]`).click(); await p.waitForTimeout(400);};
const shots = {};
// A view can still be settling when it is first drawn (a tab's count arrives a beat after the tab), so a screen is
// kept once two captures in a row are the same bytes.
const grab = async name => {
    let last = await p.screenshot();
    for(let i = 0; i < 8; i++) {await p.waitForTimeout(250); const next = await p.screenshot(); if(next.equals(last)) break; last = next;}
    shots[name] = last;
};
await grab('home');
await route('preparation'); await grab('stats');
await route('belongings'); await grab('inventory');
await route('records:quests'); await grab('journal');
await p.keyboard.press('Escape'); await p.waitForTimeout(400);
await p.locator('text=/^Crafting$/').locator('visible=true').first().click(); await p.waitForTimeout(400); await grab('crafting');

// Book lives (PS90). Each opens its private checkpoint in a fresh context and is kept under its own name.
const privateDir = join(root, 'docs/research/novels/visual-baselines');
const LIVES = [
    {name: 'fang-yuan-day', scenario: 'ri-fang-yuan-ice-crystal', go: async page => {
        await page.evaluate(() => {const b = document.querySelector('[data-structured-extension="book.ri.lead.day"]'); b?.closest('details')?.setAttribute('open', ''); b?.click();});
        await page.waitForTimeout(1500);
        const here = page.locator('#workspace_pane_navigation button', {hasText: 'Here'}).first();
        if(await here.count()) {await here.click(); await page.waitForTimeout(800);}
    }},
    {name: 'klein-kjw42', scenario: 'lotm-kjw42', go: async page => page.waitForTimeout(800)},
];
const privateShots = {};
if(lives) {
    const {scenarioSave} = await import(join(root, 'scripts/headless/scenarios.mjs'));
    privateOpen = true; session.opTimeout = 60000;
    for(const life of LIVES) {
        let save; try {save = JSON.parse(await scenarioSave(life.scenario, {seed: 1}));} catch(e) {console.log(`${life.name}: SKIPPED, ${e.message.split('\n')[0]}`); continue;}
        await session.open(save);
        const page = session.page;
        await page.setViewportSize({width: 1920, height: 1080});
        await page.addStyleTag({content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}'});
        await page.waitForTimeout(600);
        await life.go(page);
        let last = await page.screenshot();
        for(let i = 0; i < 8; i++) {await page.waitForTimeout(250); const next = await page.screenshot(); if(next.equals(last)) break; last = next;}
        privateShots[life.name] = last;
    }
}

// Decode both PNGs in the page (canvas) and compare RGBA; returns {count, box} or null when identical.
const diff = (a, b) => session.page.evaluate(async ([a, b]) => {
    const load = s => new Promise(r => {const i = new Image(); i.onload = () => {const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
        const x = c.getContext('2d'); x.drawImage(i, 0, 0); r({w: i.width, h: i.height, d: x.getImageData(0, 0, i.width, i.height).data});}; i.src = 'data:image/png;base64,' + s;});
    const [A, B] = [await load(a), await load(b)];
    if(A.w !== B.w || A.h !== B.h) return {count: -1, box: `size ${A.w}x${A.h} vs ${B.w}x${B.h}`};
    let count = 0, max = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for(let i = 0; i < A.d.length; i += 4) {
        if(A.d[i] === B.d[i] && A.d[i + 1] === B.d[i + 1] && A.d[i + 2] === B.d[i + 2] && A.d[i + 3] === B.d[i + 3]) continue;
        const px = (i / 4) % A.w, py = Math.floor(i / 4 / A.w);
        for(let k = 0; k < 4; k++) max = Math.max(max, Math.abs(A.d[i + k] - B.d[i + k]));
        count++; x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py);
    }
    return count ? {count, max, box: `x ${x0}-${x1}, y ${y0}-${y1}`} : null;
}, [a.toString('base64'), b.toString('base64')]);

await mkdir(dir, {recursive: true});
if(lives) await mkdir(privateDir, {recursive: true});
let bad = 0;
const all = [...Object.entries(shots).map(([n, png]) => [n, png, dir]), ...Object.entries(privateShots).map(([n, png]) => [n, png, privateDir])];
for(const [name, png, home] of all) {
    const file = join(home, name + '.png');
    if(update) {await writeFile(file, png); console.log(`${name}: baseline written`); continue;}
    let base; try {base = await readFile(file);} catch {
        // A private life's first run starts its local baseline; a missing public baseline is a failure.
        if(home === privateDir) {await writeFile(file, png); console.log(`${name}: local baseline started`); continue;}
        console.log(`${name}: MISSING baseline`); bad++; continue;
    }
    const d = await diff(base, png);
    if(!d) {console.log(`${name}: identical`); continue;}
    // The panel backgrounds are dithered gradients, and one dither pixel can land one colour level (1 of 255) off
    // between builds. That is the only difference let through: any pixel two or more levels off fails, however few.
    if(d.count >= 0 && d.max <= 1) {console.log(`${name}: identical but for ${d.count} dither pixel${d.count === 1 ? '' : 's'} one level off (${d.box})`); continue;}
    bad++; await writeFile(join(home, name + '.new.png'), png);
    console.log(`${name}: DIFFERENT, ${d.count < 0 ? '' : `${d.count} pixels, up to ${d.max} levels off, `}${d.box}`);
}
await session.close?.(); await server.close?.();
// The scratch build is not kept (finished tasks delete their extras, 2026-11-14).
await rm(tree, {recursive: true, force: true});
process.exit(bad ? 1 : 0);
