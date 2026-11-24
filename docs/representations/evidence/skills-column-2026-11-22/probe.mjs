// The skills column (Skills & practice) in Fang Yuan's life, rebuilt bundle, Chromium, 1920 and 1280. Prints the box's
// visible lines and saves a shot of the module.
//   node docs/representations/evidence/skills-column-2026-11-22/probe.mjs <ri.json> <tag>
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Session, buildBundle, serve} from '../../../../scripts/playtest/lib.mjs';

const [fixture, tag = 'now'] = process.argv.slice(2), out = dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(await readFile(fixture, 'utf8'));
// The public mid-game fixture with a spread of practised skills, so the column has categories and long rows.
if (seed.levels?.person?.main_character?.skill_xp) Object.assign(seed.levels.person.main_character.skill_xp,
    {Sleeping: 4200, Running: 310, Weightlifting: 1250, Climbing: 60, Unarmed: 820, Combat: 2100, 'Cold resistance': 540, 'Night vision': 230, Breathing: 35, Persistence: 960, Butchering: 140});
if (seed.availabilities?.recipe) { delete seed.availabilities.recipe.undefined; delete seed.availabilities.recipe['recipe/undefined']; }
const bundle = await buildBundle(), server = await serve(bundle.dir);
try {
    const s = await new Session({url: server.url, seed: 7, wall: Date.UTC(2026, 10, 22, 12), opTimeout: 60000}).start();
    try {
        await s.open(seed);
        await s.page.waitForTimeout(1500);
        const mod = s.page.locator('[data-module="skills"]').first();
        if (!await s.page.locator('#skill_list').isVisible().catch(() => false)) {
            await s.page.getByRole('button', {name: 'Skills', exact: true}).first().click().catch(() => {});
            await s.page.waitForTimeout(800);
        }
        console.log('skill list visible', await s.page.locator('#skill_list').isVisible());
        for (const [w, h] of [[1920, 1080], [1280, 800]]) {
            await s.page.setViewportSize({width: w, height: h}); await s.page.waitForTimeout(500);
            const info = await s.page.evaluate(() => { const l = document.getElementById('skill_list'), box = l.closest('[data-module]') || l.closest('.workspace-module') || l.parentElement.parentElement;
                const r = box.getBoundingClientRect(); return {x: r.x, y: r.y, width: r.width, height: Math.min(r.height, innerHeight - r.y), module: box.dataset.module || box.className, text: box.innerText.replace(/\n{2,}/g, '\n')}; });
            await s.page.screenshot({path: join(out, `${tag}-${w}-page.png`)});
            const lr = await s.page.evaluate(() => { const r = document.getElementById('skill_list').getBoundingClientRect(); return {x: r.x, y: r.y, w: r.width, h: r.height}; }); console.log(w, 'skill_list rect', JSON.stringify(lr));
            if (w === 1920) console.log(info.module, '\n' + info.text);
        }
        const real = s.errors.filter(e => e.kind === 'pageerror' || !/Failed to load resource/.test(e.text));
        console.log('page errors', real.length);
    } finally {await s.close();}
} finally {server.close(); await bundle.dispose();}
