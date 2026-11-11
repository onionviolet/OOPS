// Flow walk (UI audit round 46, UR139-UR143, UR33): play the built game in headless Chrome at 1920x1080,
// open every top-bar route, and report what a player would trip on. Runs on request, like
// check:pacing; it is not part of npm test. Usage: npm run check:flow [-- --json out.json]
//
// Checks, each a finding line when it fails:
//   response   a route click changes nothing on screen (UR139)
//   back       an opened view has no visible way back, or Esc does not return home (UR22, UR53)
//   placeholder visible text shows placeholder marks such as "???" (UR142)
//   zoom       at 125% and 150% browser zoom the page scrolls sideways or a region clips its text (UR33)
import {readFile, writeFile, mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareTree, build, serve} from './perf/lib.mjs';
import {Session} from './playtest/lib.mjs';
import {defaultCustomizationState} from '../src/customization_profiles.js';

const root = new URL('..', import.meta.url).pathname;
const jsonOut = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const tree = await mkdtemp(join(tmpdir(), 'yairpg-flow-'));
prepareTree('WORKTREE', tree);
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
await p.waitForTimeout(600);

const findings = [];
const add = (check, where, detail) => findings.push({check, where, detail});
// What the player sees: which regions show, what the centre shows first, and where focus sits.
// Visible text alone drifts as the clock ticks, so views are compared by this signature.
const screen = () => p.evaluate(() => {
    const vis = e => !!e.offsetParent;
    const modules = [...document.querySelectorAll('#main_content .workspace-module:not([hidden])')].filter(vis);
    const center = document.getElementById('center_mode_content');
    const view = (center && vis(center) ? center.innerText : modules.filter(m => m.dataset.region === 'center' || m.closest('[data-region="center"]')).map(m => m.innerText).join('\n')).slice(0, 160);
    const focused = document.activeElement?.closest?.('.workspace-module')?.dataset.module || '';
    const expanded = modules.filter(m => m.dataset.expanded === 'true' || m.classList.contains('expanded')).map(m => m.dataset.module).join(',');
    return {sig: [modules.map(m => m.dataset.module).join(','), view, expanded].join('|'), focused, text: modules.map(m => m.innerText).join('\n')};
});
// Placeholder marks the player sees with no stated reason. A locked tab that says why it is
// shut (data-disabled-reason) may keep its mystery name.
const placeholders = () => p.evaluate(() => {
    const out = new Set(), walker = document.createTreeWalker(document.getElementById('main_content'), NodeFilter.SHOW_TEXT);
    for(let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement;
        if(!/\?{3,}/.test(n.textContent) || !el?.offsetParent || el.closest('[data-disabled-reason]')) continue;
        out.add((el.closest('.workspace-module')?.dataset.module || '') + ': ' + n.textContent.trim().slice(0, 40));
    }
    return [...out];
});

const home = await screen();
for(const line of await placeholders()) add('placeholder', 'home', line);
const routes = await p.evaluate(() => [...document.querySelectorAll('#workspace_navigation button')]
    .filter(b => b.offsetParent && b.getAttribute('aria-disabled') !== 'true' && !b.disabled && b.dataset.routeId)
    .map(b => ({name: b.textContent.trim(), id: b.dataset.routeId})));
for(const route of routes) {
    await p.locator(`#workspace_navigation button[data-route-id="${route.id}"]`).click();
    await p.waitForTimeout(350);
    const now = await screen();
    const target = await p.evaluate(id => document.querySelector(`[data-module="${id}"]`)?.dataset.module || id, route.id);
    if(now.sig === home.sig && now.focused !== target) add('response', route.name, 'the click changed nothing visible and left focus where it was');
    for(const line of await placeholders()) add('placeholder', route.name, line);
    const back = await p.evaluate(() => [...document.querySelectorAll('#main_content button, #main_content a')]
        .some(b => b.offsetParent && /^←/.test(b.textContent.trim())));
    if(now.sig !== home.sig && !back) add('back', route.name, 'no visible ← back control');
    await p.keyboard.press('Escape'); await p.waitForTimeout(250);
    const after = await screen();
    if(after.sig !== home.sig) {
        add('back', route.name, 'Esc did not return to the home view');
        await p.locator('#main_content button', {hasText: '←'}).first().click().catch(() => {});
        await p.waitForTimeout(250);
    }
}
for(const [w, h, zoom] of [[1536, 864, '125%'], [1280, 720, '150%']]) {
    await p.setViewportSize({width: w, height: h});
    await p.mouse.move(2, h - 2);
    await p.waitForTimeout(500);
    const z = await p.evaluate(() => {
        const sideways = document.documentElement.scrollWidth > innerWidth + 2;
        const clipped = [...document.querySelectorAll('#main_content .workspace-module:not([hidden])')].filter(m => m.offsetParent).flatMap(m =>
            [...m.querySelectorAll('*')].filter(e => {
                if(!e.offsetParent || e.children.length > 40) return false;
                const c = getComputedStyle(e);
                return /hidden|clip/.test(c.overflowY) && e.scrollHeight > e.clientHeight + 6 && e.clientHeight > 0 && !/ellipsis/.test(c.textOverflow);
            }).slice(0, 2).map(e => `${m.dataset.module}: ${(e.id || e.className || e.tagName).toString().slice(0, 40)} shows ${e.clientHeight} of ${e.scrollHeight}px`));
        return {sideways, clipped, text: [...document.querySelectorAll('#main_content .workspace-module:not([hidden])')].filter(m => m.offsetParent).map(m => m.innerText).join('\n')};
    });
    if(z.sideways) add('zoom', zoom, 'the page scrolls sideways');
    for(const c of z.clipped) add('zoom', zoom, c);
    for(const line of await placeholders()) add('placeholder', zoom, line);
}
await session.close?.();
const errors = session.errors.filter(e => e.kind === 'pageerror');
for(const e of errors) add('error', 'page', e.text.split('\n')[0]);
const unique = [...new Map(findings.map(f => [JSON.stringify(f), f])).values()];
for(const f of unique) console.log(`${f.check.padEnd(11)} ${f.where.padEnd(14)} ${f.detail}`);
console.log(`check:flow: ${routes.length} routes walked at 1920x1080, zoom at 125% and 150%; ${unique.length} finding${unique.length === 1 ? '' : 's'}.`);
if(jsonOut) await writeFile(jsonOut, JSON.stringify({routes, findings: unique}, null, 1));
process.exit(unique.length ? 1 : 0);
