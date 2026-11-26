// PS284: skill rows wrap correctly in a narrow column. Measures the Skills box at the widest column and at the narrowest the layout
// allows (14 body-size characters): a row's name and percent each stay on one line, no word breaks mid-word, nothing scrolls sideways.
// check:flow calls skillRowWrap(page) once a skill is learned; run alone with `node scripts/check_skill_rows.mjs` (builds a scratch tree).
import {fileURLToPath, pathToFileURL} from 'node:url';

export const NARROW_EM = 14;

/** Returns finding lines for the Skills box on `page`, at its own width and at NARROW_EM wide. */
export async function skillRowWrap(page) {
    const found = [];
    const measure = (label) => page.evaluate(label => {
        const list = document.getElementById('skill_list'), out = [];
        if (!list || !list.offsetParent) return [`${label}: the Skills box is not on screen`];
        const line = e => parseFloat(getComputedStyle(e).lineHeight) || parseFloat(getComputedStyle(e).fontSize) * 1.4;
        const rows = list.querySelectorAll('.skill_div');
        if (!rows.length) out.push(`${label}: no skill row to measure`);
        for (const row of rows) {
            for (const part of row.querySelectorAll('.skill_bar_name, .skill_bar_xp')) {
                if (part.getBoundingClientRect().height > line(part) * 1.6) out.push(`${label}: ${part.className} wraps in "${row.dataset.skill}"`);
            }
        }
        for (const e of (list.closest('[data-module="skills"]') || list).querySelectorAll('*')) { // the box, so "Learning now" above the list is read too
            if (e.children.length || !e.offsetParent || !/\S/.test(e.textContent) || /\s/.test(e.textContent.trim())) continue;
            if (e.getBoundingClientRect().height > line(e) * 1.6) out.push(`${label}: the word "${e.textContent.trim().slice(0, 20)}" breaks across lines`);
        }
        if (list.scrollWidth > list.clientWidth + 2) out.push(`${label}: the list scrolls sideways (${list.scrollWidth} of ${list.clientWidth}px)`);
        return out;
    }, label);
    found.push(...await measure('at its own width'));
    const wide = await page.evaluate(() => document.getElementById('skill_list')?.dataset.skillWide);
    const mod = page.locator('[data-module="skills"]').first();
    const before = await mod.evaluate((m, em) => { const was = m.getAttribute('style'); const size = parseFloat(getComputedStyle(m).fontSize) || 14; m.style.width = m.style.maxWidth = `${em * size}px`; return was; }, NARROW_EM);
    await page.waitForTimeout(300);
    found.push(...await measure(`at ${NARROW_EM}em`));
    const narrow = await page.evaluate(() => document.getElementById('skill_list')?.dataset.skillWide);
    if (narrow !== 'false') found.push(`at ${NARROW_EM}em: the list still reads as wide (data-skill-wide=${narrow}); it was ${wide} before`);
    await mod.evaluate((m, was) => was === null ? m.removeAttribute('style') : m.setAttribute('style', was), before);
    return found;
}

/** Learn one skill by play (a run around the village) so the box has a row. */
export async function learnOneSkill(page, session) {
    const training = page.locator('[data-choice-key="Train"]:visible').first();
    const run = training.locator('.start_activity[data-activity="running"]');
    if (!await run.isVisible()) await training.click();
    await run.click(); await session.step(120); await page.waitForTimeout(400);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const {mkdtemp, readFile, rm} = await import('node:fs/promises');
    const {tmpdir} = await import('node:os'), {join} = await import('node:path');
    const {prepareTree, build, serve} = await import('./perf/lib.mjs'), {Session} = await import('./playtest/lib.mjs');
    const root = fileURLToPath(new URL('..', import.meta.url)), tree = await mkdtemp(join(tmpdir(), 'yairpg-skills-'));
    prepareTree('WORKTREE', tree);
    const {existsSync} = await import('node:fs'); // PS293: measure with local fonts when held.
    const {linkFixtureInputSync} = await import('../tests/helpers/fixture_fs.mjs');
    if (existsSync(join(root, 'resources/fonts/private')) && !existsSync(join(tree, 'resources/fonts/private'))) {
        linkFixtureInputSync(join(root, 'resources/fonts/private'), join(tree, 'resources/fonts/private'), 'dir');
    }
    await build(tree);
    const server = await serve(tree);
    const session = new Session({url: server.url + '?test_hooks=1', seed: 87, wall: Date.UTC(2026, 9, 26, 15), hooks: {beforeOpen: async c => c.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}))}});
    let found = [];
    try {
        const seed = JSON.parse(await readFile(join(root, 'tests/fixtures/perf/mid.json'), 'utf8'));
        delete seed.availabilities.recipe.undefined; delete seed.availabilities.recipe['recipe/undefined'];
        await session.start(); await session.open(seed); await session.page.waitForTimeout(600);
        await learnOneSkill(session.page, session);
        found = await skillRowWrap(session.page);
    } finally { await session.close(); await server.close(); await rm(tree, {recursive: true, force: true}); }
    for (const f of found) console.log(`skillrows   ${f}`);
    console.log(`check:skill-rows: ${found.length} finding${found.length === 1 ? '' : 's'}`);
    process.exit(found.length ? 1 : 0);
}
