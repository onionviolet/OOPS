// Named authored-start journey on an isolated BUILD_OUT. No player profile/save.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {launchChrome} = createRequire(import.meta.url)('../ui_helpers.cjs');
const build = path.resolve(process.argv[2] || '/tmp/yairpg-L7-s1-build');
const out = path.resolve(process.argv[3] || 'docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/evidence/L7/S1');
await mkdir(out, {recursive: true});
const P = 'book.ss.apprentice', id = n => `${P}.${n}`, key = n => JSON.stringify({id: id(n)});
const server = createServer(async (req, res) => {
    try {
        let file = path.resolve(build, '.' + new URL(req.url, 'http://local').pathname);
        if(!file.startsWith(build + '/') && file !== build) throw Error('path');
        if((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
        res.setHeader('Content-Type', ({'.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2'})[path.extname(file)] || 'application/octet-stream');
        res.end(await readFile(file));
    } catch {res.writeHead(404).end();}
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await launchChrome(), result = {route: 'fresh Village → Beginning choice → authored divergent apprentice start → study → fit → native equip', errors: [], checks: [], matrix: []};
const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true});
const p = await context.newPage(); p.setDefaultTimeout(15000);
p.on('pageerror', e => result.errors.push(e.message));
p.on('console', message => {if(message.type() === 'error') (result.consoleErrors ||= []).push(message.text());});
const play = async () => {
    await p.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});
    await p.evaluate(() => window.simulationTestHooks.pause());
    await p.locator('#loading_screen_play_button').click();
    await p.waitForFunction(() => document.documentElement.dataset.startScreen === 'closed');
};
const open = () => p.locator('#workspace_navigation select').first().selectOption('beginning');
const save = () => p.evaluate(() => {window.saveProgress(); return JSON.parse(localStorage.getItem('save data'));});
const digest = s => JSON.stringify({record: s.content_packs.structured, actor: s.expansion.actors.player, simulation: s.expansion.simulation, inventory: s.inventories.person.main_character, equipment: s.character.equipment});
const roundTrip = async label => {
    if(process.env.L7_EQUIP_PROBE) return;
    const before = await save(), bytes = digest(before);
    await writeFile(path.join(out, label + '-before.json'), JSON.stringify(before, null, 2));
    await p.reload(); await play(); assert.equal(digest(await save()), bytes, label + ' reload');
    const literal = await p.evaluate(() => window.save_to_file());
    await Promise.all([p.waitForEvent('load'), p.evaluate(text => window.load_progress(text), literal)]);
    await play(); assert.equal(digest(await save()), bytes, label + ' literal Import');
    result.checks.push(label + ': Save/reload/Export/literal Import preserves state'); await open();
};
const act = async n => {
    await p.locator(`[data-structured-action="${id(n)}"]`).click();
    await p.waitForFunction(commandId => {
        try {return window.simulationTestHooks.snapshot().expansion.simulation.jobs.some(j => j.commandId === commandId);} catch {return false;}
    }, id(n));
};
const step = n => p.evaluate(n => window.advanceTicks(n), n);
const actualKey = async n => Object.keys((await save()).inventories.person.main_character).find(k => JSON.parse(k).id === id(n));
const defense = async () => Number((await p.locator('.shell-stat-record').filter({hasText: 'Defense'}).first().innerText()).match(/[0-9]+(?:\.[0-9]+)?/)[0]);
const waitDefense = expected => p.waitForFunction(expected => {
    const text = [...document.querySelectorAll('.shell-stat-record')].find(el => el.textContent.includes('Defense'))?.textContent;
    return text && Number(text.match(/[0-9]+(?:\.[0-9]+)?/)[0]) === expected;
}, expected);
try {
    await p.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`); await play(); await open();
    const ordinary = await save(); assert.equal(ordinary.content_packs?.structured, undefined);
    await p.locator('[data-structured-choice="life"]').selectOption(P);
    await p.locator('[data-structured-begin]').click();
    let s = await save(); assert.equal(s.expansion.actors.player.worldId, id('world')); assert.equal(s['current location'], id('workroom'));
    assert.equal(s.inventories.person.main_character[key('coat')].count, 1);
    assert.equal(s.expansion.simulation.knowledge.player[id('pattern')], undefined);
    assert.equal(await p.locator(`[data-structured-action="${id('fit_coat')}"]`).isDisabled(), true);
    result.checks.push('ordinary start grants no pack state; explicit arrival creates real native location/items and unknown-property refusal');
    await act('study'); await step(2); s = await save();
    assert.equal(s.expansion.simulation.jobs[0].due - s.expansion.clock, 3);
    assert.equal(s.expansion.simulation.knowledge.player[id('pattern')], undefined);
    await roundTrip('pending-study'); await step(3);
    s = await save(); assert.equal(s.expansion.simulation.knowledge.player[id('pattern')].stage, 'understood');
    assert.equal(s.inventories.person.main_character[key('donor')].count, 1);
    const bareDefense = await defense();
    await p.evaluate(k => window.equip_item(k), key('coat')); await waitDefense(bareDefense + 4); const unfinishedDefense = await defense();
    await p.evaluate(() => window.unequip_item('torso')); await open();
    await act('fit_coat'); await step(2); await roundTrip('pending-fit'); await step(3);
    s = await save(); assert.equal(s.expansion.actors.player.facts[id('coat_fitted')], true);
    const fittedKey = await actualKey('coat'); assert.equal(s.inventories.person.main_character[fittedKey].count, 1);
    await p.evaluate(k => window.equip_item(k), fittedKey); await waitDefense(bareDefense + 8); const fittedDefense = await defense();
    result.equipDiagnostic = {unfinishedDefense, fittedDefense, fittedKey, equipment: (await save()).character.equipment,
        bareDefense};
    assert.equal(fittedDefense - unfinishedDefense, 4);
    result.defense = {unfinishedDefense, fittedDefense, difference: 4, nativeEquipConsumer: true};
    await open(); await act('fit_gloves'); await step(5);
    s = await save(); assert.equal(s.expansion.actors.player.facts[id('gloves_fitted')], true);
    assert.equal(s.expansion.simulation.energies.player[id('essence')].reserve, 4);
    assert.equal(s.inventories.person.main_character[key('shard')], undefined);
    await p.evaluate(k => window.equip_item(k), key('gloves'));
    await roundTrip('completed-two-carriers');
    for(const [width, height] of [[1920, 1080], [1536, 864]]) for(const size of [14, 21]) {
        await p.setViewportSize({width, height});
        await p.locator('#workspace_navigation select').first().selectOption('customization');
        await p.locator('[aria-label="Font size"]').fill(String(size));
        await p.locator('[aria-label="Font size"]').dispatchEvent('change');
        await p.getByRole('button', {name: 'Apply and save', exact: true}).first().click(); await open();
        const geometry = await p.locator('#structured_pack_panel').evaluate(el => ({font: parseFloat(getComputedStyle(el).fontSize), pageOverflow: document.documentElement.scrollWidth > innerWidth + 1}));
        assert.equal(geometry.font, size); assert.equal(geometry.pageOverflow, false);
        await p.screenshot({path: path.join(out, `memory-${width}-${size}.png`)});
        result.matrix.push({width, height, size, ...geometry});
    }
    assert.deepEqual(result.errors, []);
    result.bundleSha256 = createHash('sha256').update(await readFile(path.join(build, 'dist/bundle.js'))).digest('hex');
    result.reviewState = 'agent-verified, not human-reviewed'; result.success = true;
} catch (e) {
    result.failure = e.stack;
    result.panel = await p.locator('#structured_pack_panel').innerText().catch(() => '');
    await writeFile(path.join(out, 'failure-save.json'), JSON.stringify(await save(), null, 2)).catch(() => {});
    await p.screenshot({path: path.join(out, 'failure.png')}).catch(() => {});
    throw e;
} finally {
    await writeFile(path.join(out, 'result.json'), JSON.stringify(result, null, 2));
    await context.close(); await browser.close(); server.close();
}
console.log(JSON.stringify(result));
