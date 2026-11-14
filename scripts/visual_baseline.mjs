// Visual baselines (UIC122): every CSS change risks layout shifts nobody sees. This captures five screens
// of the built game in headless Chrome at 1920x1080 (mid fixture, fixed seed and wall clock, animation
// frozen) and compares them pixel by pixel with stored PNGs. Runs on request, not in npm test.
// Usage: npm run check:visual [-- --rev HEAD] [--update] [--dir <path>]   (default dir tests/fixtures/visual)
//   --update  writes the baselines. Otherwise prints per screen "identical" or the differing pixel count and
//   bounding box, writes <name>.new.png beside a differing baseline, and exits 1 on any difference or missing baseline.
// Hidden flag --nudge moves the top bar down 1px with a transform, to prove a one-pixel shift is caught.
import {readFile, writeFile, mkdtemp, mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareTree, build, serve} from './perf/lib.mjs';
import {Session} from './playtest/lib.mjs';
import {defaultCustomizationState} from '../src/customization_profiles.js';

const root = new URL('..', import.meta.url).pathname;
const arg = (n, d) => process.argv.includes(n) ? process.argv[process.argv.indexOf(n) + 1] : d;
const update = process.argv.includes('--update'), nudge = process.argv.includes('--nudge');
const dir = arg('--dir', join(root, 'tests/fixtures/visual'));
const tree = await mkdtemp(join(tmpdir(), 'yairpg-visual-'));
prepareTree(arg('--rev', 'WORKTREE'), tree);
await build(tree);
const server = await serve(tree);
const session = new Session({url: server.url + '?test_hooks=1', seed: 87, wall: Date.UTC(2026, 9, 26, 15),
    hooks: {beforeOpen: async c => c.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}))}});
const seed = JSON.parse(await readFile(join(root, 'tests/fixtures/perf/mid.json'), 'utf8'));
delete seed.availabilities.recipe.undefined; delete seed.availabilities.recipe['recipe/undefined'];
seed.customization = defaultCustomizationState();
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

// Decode both PNGs in the page (canvas) and compare RGBA; returns {count, box} or null when identical.
const diff = (a, b) => p.evaluate(async ([a, b]) => {
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
let bad = 0;
for(const [name, png] of Object.entries(shots)) {
    const file = join(dir, name + '.png');
    if(update) {await writeFile(file, png); console.log(`${name}: baseline written`); continue;}
    let base; try {base = await readFile(file);} catch {console.log(`${name}: MISSING baseline`); bad++; continue;}
    const d = await diff(base, png);
    if(!d) {console.log(`${name}: identical`); continue;}
    // The panel backgrounds are dithered gradients, and one dither pixel can land one colour level (1 of 255) off
    // between builds. That is the only difference let through: any pixel two or more levels off fails, however few.
    if(d.count >= 0 && d.max <= 1) {console.log(`${name}: identical but for ${d.count} dither pixel${d.count === 1 ? '' : 's'} one level off (${d.box})`); continue;}
    bad++; await writeFile(join(dir, name + '.new.png'), png);
    console.log(`${name}: DIFFERENT, ${d.count < 0 ? '' : `${d.count} pixels, up to ${d.max} levels off, `}${d.box}`);
}
await session.close?.(); await server.close?.();
process.exit(bad ? 1 : 0);
