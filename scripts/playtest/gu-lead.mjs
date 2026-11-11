// Earned protagonist route on a fresh localhost origin. No personal save is read.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {GU_LEAD, riLeadId as id} from '../../src/world_packs/book_gu_lead_life.js';

const {runBrowser, advanceGameMinutes} = createRequire(import.meta.url)('../ui_helpers.cjs');
const [buildRoot, evidenceDir] = process.argv.slice(2);
if (!buildRoot || !evidenceDir) throw Error('Pass an isolated BUILD_OUT and an evidence directory.');
const build = path.resolve(buildRoot);
const out = path.resolve(evidenceDir);
await mkdir(out, {recursive: true});
const types = {'.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2'};
const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url, 'http://localhost');
        const file = path.resolve(build, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
        if (!file.startsWith(build + path.sep)) throw Error('Outside build');
        const bytes = await readFile(file);
        res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
        res.end(bytes);
    } catch {
        res.writeHead(404).end();
    }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const result = {
    route: 'Fresh Village → returned clan youth → morning roll → Awakening Ceremony → first academy exercise',
    bundleSha256: createHash('sha256').update(await readFile(path.join(build, 'dist/bundle.js'))).digest('hex'),
    viewport: {width: 1920, height: 1080}, checks: [], pageErrors: []
};
const progress = save => {
    const {expansion, content_packs} = save;
    const {simulation, actors} = expansion;
    return {
        beginning: content_packs?.structured, clock: expansion.clock, place: save['current location'],
        body: simulation.people.player.body, elder: simulation.people[id('academy_elder')],
        source: actors.player.sources[id('aperture')], faculty: simulation.faculties.player?.[id('aperture')],
        energy: simulation.energies?.player?.[id('primeval')], roll: simulation.claims[id('academy_roll')],
        knowledge: simulation.knowledge.player, completed: actors.player.completed,
        jobs: simulation.jobs.filter(job => job.commandId.startsWith(GU_LEAD + '.'))
    };
};
const checkUnawakened = save => {
    assert.equal(save.source, undefined);
    assert.equal(save.faculty, undefined);
    assert.equal(save.energy, undefined);
    assert.equal(save.roll, undefined);
    assert.equal(save.knowledge?.[id('awakening')], undefined);
};

try {
    await runBrowser(async browser => {
        const context = await browser.newContext({viewport: result.viewport, acceptDownloads: true});
        const p = await context.newPage();
        p.setDefaultTimeout(20000);
        p.on('pageerror', error => result.pageErrors.push(error.message));
        const panel = p.locator('#structured_pack_panel');
        const action = name => p.locator(`[data-structured-action="${id(name)}"]`);
        const play = async () => {
            const start = p.locator('#loading_screen_play_button');
            await start.waitFor({state: 'visible', timeout: 60000});
            await p.evaluate(() => window.simulationTestHooks.pause());
            await start.click();
            await p.waitForFunction(() => document.documentElement.dataset.startScreen === 'closed');
        };
        const open = () => p.locator('#workspace_navigation select').first().selectOption('beginning');
        const save = () => p.evaluate(() => window.simulationTestHooks.snapshot());
        const state = async () => progress(await save());
        const step = minutes => advanceGameMinutes(p, minutes);
        const roundTrip = async (name) => {
            await p.locator('#save_button').click();
            const expected = await state();
            await p.reload();
            await play();
            assert.deepEqual(await state(), expected, name + ' reload');
            const downloading = p.waitForEvent('download');
            await p.locator('#save_to_file_button').click();
            const file = path.join(out, name + '.txt');
            await (await downloading).saveAs(file);
            await Promise.all([p.waitForEvent('load'), p.locator('#saved_file_input').setInputFiles(file)]);
            await play();
            assert.deepEqual(await state(), expected, name + ' file Import');
            assert.equal((await p.evaluate(() => window.simulationTestHooks.saveStatus())).ownsSave, true);
            await open();
            result.checks.push(name + ' preserved by Save, reload, Export download and file Import');
        };
        await p.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`);
        await play();
        await open();
        const choice = p.locator('[data-structured-choice="life"]');
        const available = await choice.locator('option').evaluateAll(options => options.map(option => option.value));
        for (const pack of ['book.ri.academy', 'book.ri.keeper', GU_LEAD]) assert(available.includes(pack));
        assert.equal((await save()).content_packs?.structured, undefined);
        await choice.selectOption(GU_LEAD);
        await p.locator('[data-structured-begin]').click();
        assert.equal((await state()).place, id('home'));
        checkUnawakened(await state());
        assert.equal(await action('circulate').count(), 0);
        await p.screenshot({path: path.join(out, 'arrival.png')});
        await action('muster').click();
        await step(2);
        assert.equal((await state()).place, id('spring'));
        await open();
        await action('cross').click();
        await step(2);
        checkUnawakened(await state());
        await roundTrip('pending-ceremony');
        await panel.locator('[data-structured-cancel]').click();
        await step(5);
        checkUnawakened(await state());
        assert.equal((await state()).place, id('spring'));
        result.checks.push('No early awakening and cancelling the crossing grants nothing');
        await action('cross').click();
        await step(5);
        await open();
        const awakened = await state();
        assert.equal(awakened.place, id('academy'));
        assert.equal(awakened.elder.location, id('academy'));
        assert.equal(awakened.completed[id('cross')], 1);
        assert(awakened.source);
        assert(awakened.faculty);
        assert.equal(awakened.energy.reserve, 44);
        assert.equal(awakened.energy.policy.capacity, 44);
        assert.equal(awakened.roll.owner, 'player');
        assert.match(awakened.knowledge[id('awakening')].value, /27.*44%.*C-grade/);
        assert.match(await panel.innerText(), /The elder calls C grade and puts you on the academy roll/);
        await panel.locator('.structured-status-details summary').click();
        assert.match(await panel.innerText(), /44%.*C-grade/);
        // AGT14: the shared acting-power record shows Heaven's Will as a derived status row once the awakening is known (no saved key).
        assert.match(await panel.innerText(), /Heaven’s Will[\s\S]*Not looking your way/);
        assert.equal(JSON.stringify(await save()).includes('ri.heavens_will'), false);
        await action('circulate').locator('..').locator('summary').click();
        assert.match(await panel.innerText(), /1 Green-copper primeval essence/);
        await action('circulate').scrollIntoViewIfNeeded();
        await p.screenshot({path: path.join(out, 'awakening.png')});
        await action('circulate').click();
        assert.equal((await state()).energy.reserve, 43);
        await step(5);
        await open();
        const lesson = await state();
        assert.equal(lesson.completed[id('circulate')], 1);
        assert.equal(lesson.energy.reserve, 44);
        assert.match(lesson.knowledge[id('first_lesson')].value, /moved its essence/);
        assert.equal(await action('circulate').isDisabled(), true);
        await roundTrip('earned-first-exercise');
        assert.equal(await action('circulate').isDisabled(), true);
        await panel.locator('.structured-status-details summary').click();
        assert.match(await panel.innerText(), /The elder marks your first exercise complete/);
        assert.match(await panel.innerText(), /Heaven’s Will[\s\S]*Not looking your way/);   // still read after reload and Import
        await p.screenshot({path: path.join(out, 'first-exercise.png')});
        assert.deepEqual(result.pageErrors, []);
        await p.locator('#save_button').click();
        const checkpoint = await p.evaluate(() => localStorage.getItem('save data'));
        assert.deepEqual(progress(JSON.parse(checkpoint)), lesson, 'saved checkpoint');
        await writeFile(path.join(out, 'completed-checkpoint.json'), checkpoint);
    });
    console.log(JSON.stringify(result, null, 2));
} finally {
    await writeFile(path.join(out, 'receipt.json'), JSON.stringify(result, null, 2) + '\n');
    await new Promise(resolve => server.close(resolve));
}
