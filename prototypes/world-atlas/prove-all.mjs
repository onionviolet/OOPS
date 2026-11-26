// One headless proof for the whole atlas: starts the server on a free port with scratch request and pick files,
// walks every section at 1920x1080, saves screenshots, and exits non-zero on a failed check or a page error.
//   node prototypes/world-atlas/prove-all.mjs [--out docs/representations/evidence/world-atlas-2026-11-21] [--scratch <dir>]
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadPlaywright} from '../../scripts/perf/lib.mjs';

const arg = (k, d) => {const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d;};
const root = fileURLToPath(new URL('../../', import.meta.url));
const out = resolve(root, arg('--out', 'docs/representations/evidence/world-atlas-2026-11-21'));
const scratch = arg('--scratch', mkdtempSync(join(tmpdir(), 'atlas-prove-')));
mkdirSync(out, {recursive: true});
const port = 4300 + Math.floor(Math.random() * 500);
const server = spawn(process.execPath, [join(root, 'prototypes/world-atlas/serve.mjs')], {cwd: root, stdio: ['ignore', 'pipe', 'inherit'],
    env: {...process.env, ATLAS_PORT: String(port), ATLAS_REQUESTS: join(scratch, 'requests.json'), ATLAS_PICKS: join(scratch, 'picks.json')}});
await new Promise((ok, no) => {server.stdout.on('data', d => String(d).includes('listening') && ok()); server.on('exit', c => no(Error('server exited ' + c)));});
const base = `http://127.0.0.1:${port}`;
const results = [];
const check = (name, fn) => results.push([name, fn]);
const browser = await loadPlaywright().chromium.launch({headless: true, executablePath: process.env.YAIRPG_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--single-process', '--disable-gpu']});
let failed = 0;
try {
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
    page.setDefaultTimeout(90000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => {if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text());});
    const canvas = async (hash, kind) => {
        await page.goto(base + '/#' + hash);
        const c = page.locator(kind ? `[data-canvas-kind=${kind}]` : '.box-canvas').first();
        await c.waitFor({timeout: 90000});
        await page.evaluate(async () => {await document.fonts.ready;});
        return c;
    };
    const shot = name => page.screenshot({path: join(out, name)});
    const inspector = async c => (await c.locator('.canvas-inspector').innerText()).replace(/\n+/g, ' | ');

    check('worlds index lists the source games', async () => {
        const c = await canvas('worlds', 'worlds');
        for (const t of ['Yet Another Idle RPG', 'Proto23 (original)', 'Arkivia']) assert.ok(await c.locator('.canvas-box', {hasText: t}).count(), t);
        await shot('worlds-with-sources.png');
    });
    for (const [game, id, min] of [['yair', 'yair', 61], ['proto23', 'proto23-src', 60], ['arkivia', 'arkivia', 3]]) check(`${game} source map draws`, async () => {
        const c = await canvas(`world/${id}/source`, 'source');
        const n = await c.locator('.canvas-box').count();
        assert.ok(n >= Math.min(min, 3), `${game}: ${n} boxes`);
        const bar = await page.locator('nav.atlas-tools').innerText();
        console.log(game, n, 'boxes ·', bar.replace(/\n/g, ' ').slice(0, 200));
        await c.locator('.canvas-box').first().click();
        const insp = await inspector(c);
        assert.match(insp, /Source id/);
        const inner = c.locator('.canvas-inspector').getByRole('button', {name: /Open inside/});
        if (await inner.count()) {await inner.first().click(); await page.locator('[data-canvas-kind=source] .canvas-box').first().waitFor();}
        await shot(`source-${game}.png`);
    });
    check('LOTM scenes view and a place inspector with scenes', async () => {
        const c = await canvas('world/lotm/scenes', 'book');
        assert.ok(await c.locator('.canvas-box').count() > 10);
        await c.locator('.canvas-box').first().click();
        assert.match(await inspector(c), /Book scenes here/);
        await shot('scenes-lotm.png');
    });
    check('MOL scenes view', async () => {
        const c = await canvas('world/mol/scenes', 'book');
        assert.ok(await c.locator('.canvas-box').count() > 5);
        await shot('scenes-mol.png');
    });
    check('reading lane carries proven and delivered from the progress atlas', async () => {
        const c = await canvas('world/lotm/reading', 'library');
        assert.equal(await c.locator('.canvas-box').count(), 8);
        await c.locator('.canvas-box', {hasText: 'Proven'}).click();
        assert.match(await inspector(c), /progress atlas/);
        await shot('reading-lane-progress-lotm.png');
        const s = await canvas('world/ss/reading', 'library');
        assert.equal(await s.locator('.canvas-box[data-group=unknown]').count(), 2, 'Shadow Slave proof and delivery are unknown, not failed');
    });
    check('progress overview', async () => {
        const c = await canvas('progress/overview', 'library');
        assert.ok(await c.locator('.canvas-box[data-group=unknown]').count() >= 1);
        await c.locator('.canvas-box', {hasText: 'Klein'}).click();
        assert.match(await inspector(c), /proven/);
        await shot('progress-overview.png');
        await c.locator('.canvas-inspector').getByRole('button', {name: 'Open sub-progress'}).click();
        const sub = page.locator('[data-canvas-kind=library]').first();
        await sub.locator('.canvas-box', {hasText: 'Batch'}).waitFor();
        for (const t of ['Held', 'Read', 'Places', 'Book scenes', 'Proven']) assert.ok(await sub.locator('.canvas-box', {hasText: t}).count(), t);
        await shot('progress-sub-lotm.png');
        await page.getByRole('button', {name: 'All progress'}).click();
        const top = page.locator('[data-canvas-kind=library]').first();
        await top.locator('.canvas-box', {hasText: 'Potions'}).click();
        await top.locator('.canvas-inspector').getByRole('button', {name: 'Open sub-progress'}).click();
        const pot = page.locator('[data-canvas-kind=library]').first();
        await pot.locator('.canvas-box', {hasText: 'brew_law'}).waitFor();
        assert.ok(await pot.locator('.canvas-box', {hasText: 'Assay'}).count(), 'potion parts');
        await shot('progress-sub-potions.png');
    });
    check('mechanics, then one mechanic', async () => {
        const c = await canvas('progress/mechanics2', 'library');
        assert.ok(await c.locator('.canvas-box[data-group=law]').count() >= 5);
        await shot('mechanics.png');
        await c.locator('.canvas-box', {hasText: 'brew_law'}).first().click();
        await c.locator('.canvas-inspector').getByRole('button', {name: 'Open mechanic'}).click();
        const m = page.locator('[data-canvas-kind=library]').first();
        await m.locator('.canvas-box').first().waitFor();
        await m.locator('.canvas-box').first().click();
        const insp = await inspector(m);
        assert.match(insp, /Progress atlas/);
        console.log('brew_law:', insp.slice(0, 240));
        await shot('mechanic-brew-law.png');
    });
    check('pick a district for an unplaced place, then see it in Send to the game', async () => {
        const c = await canvas('world/lotm/places', 'book');
        await page.getByRole('searchbox').fill('Tingen outskirts');
        await page.locator('nav.atlas-tools').getByRole('button', {name: /Tingen outskirts/}).first().click();
        const sel = page.locator('.atlas-pick select');
        await sel.waitFor();
        await sel.selectOption('storm');
        await page.locator('.atlas-pick output', {hasText: 'Pick saved'}).waitFor();
        await shot('pick-tingen-outskirts.png');
        await canvas('worlds', 'worlds');
        await page.goto(base + '/#workbench/transfer');
        await page.locator('.sheet', {hasText: 'Send placements to the game'}).waitFor();
        const text = await page.locator('.sheet').innerText();
        assert.match(text, /Tingen outskirts → storm/);
        await shot('send-to-game.png');
        void c;
    });
    check('reader findings matrix: drawn, not drawn and planned-unread rows', async () => {
        await page.goto(base + '/#progress/findings');
        const t = page.locator('.findings-matrix');
        await t.waitFor({timeout: 90000});
        const read = await t.locator('tbody tr[data-state=read]').count(), none = await t.locator('tbody tr[data-state=none]').count();
        assert.ok(read >= 15 && none >= 10, `read ${read}, none ${none}`);
        const sourceScene = t.locator('a[href$="/reader-scenes"]:not([href*="/lotm/"]):not([href*="/mol/"])').first();
        assert.ok(await sourceScene.count(), 'reader scenes are accessible without a cast pack');
        console.log('findings rows', read, 'read ·', none, 'planned only');
        await shot('reader-findings.png');
        await sourceScene.click();
        const index = page.locator('.reader-scenes');
        await index.getByRole('heading', {name: /Reader scenes/}).waitFor();
        assert.match(await index.innerText(), /Source records/);
        await index.locator('tbody th a').first().click();
        const record = index.locator('.reader-scene-record');
        await record.getByRole('heading', {name: 'What happened', exact: true}).waitFor();
        await record.getByText(/In OOPS/).waitFor();
    });
    check('LOTM things: items with workings marked', async () => {
        const c = await canvas('world/lotm/things', 'library');
        assert.ok(await c.locator('.canvas-box').count() >= 40);
        await page.getByRole('searchbox').fill('Silver sheet');
        await page.locator('nav.atlas-tools').getByRole('button', {name: /^Silver sheet/}).first().click();
        const c2 = page.locator('[data-canvas-kind=library]').first();
        await c2.locator('.canvas-inspector').getByRole('button', {name: 'Open its making tree'}).waitFor();
        assert.match(await inspector(c2), /Low-grade charm crafting/);
        await shot('things-lotm-items.png');
    });
    check('LOTM Places opens a place record without losing the map', async () => {
        const c = await canvas('world/lotm/places', 'book');
        await page.getByRole('searchbox').fill('Klein');
        await page.locator('nav.atlas-tools').getByRole('button', {name: /apartment/i}).first().click();
        const place = c.locator('.reader-place-record');
        for (const heading of ['What you can do here', 'Who’s around', 'Hours and access', 'Services', 'Prices', 'Linked scenes']) {
            await place.getByRole('heading', {name: heading, exact: true}).waitFor();
        }
        await place.getByText(/In OOPS/).waitFor();
    });
    check('creatures from the readers: browse a world and open a creature', async () => {
        await page.goto(base + '/#creatures/reader-creatures');
        const link = page.locator('.reader-creature-worlds a').first();
        await link.click();
        const board = page.locator('[data-canvas-kind=library]').first();
        await board.locator('.canvas-box').first().click();
        const record = board.locator('.reader-creature-record');
        await record.getByText(/In OOPS/).waitFor();
        assert.match(await record.innerText(), /Reader reference/);
    });
    check('LOTM making tree: silver sheet into charm crafting into the charms', async () => {
        await page.goto(base + '/#world/lotm/making/' + encodeURIComponent('lotm.item.silver-sheet'));
        const c = page.locator('[data-canvas-kind=library]').first();
        await c.locator('.canvas-box', {hasText: 'Low-grade charm crafting'}).waitFor({timeout: 90000});
        assert.ok(await c.locator('.canvas-box', {hasText: 'Slumber Charm'}).count(), 'slumber charm product');
        await c.locator('.canvas-box', {hasText: 'Slumber Charm'}).first().click();
        const charm = c.locator('.making-item-record');
        for (const heading of ['What it does', 'How to make it', 'How to use it', 'People', 'Places', 'Scenes']) {
            await charm.getByRole('heading', {name: heading, exact: true}).waitFor();
        }
        assert.match(await charm.innerText(), /Old Neil.*In OOPS/s);
        await c.locator('.canvas-box', {hasText: 'Low-grade charm crafting'}).click();
        assert.match(await inspector(c), /Takes: .*Silver sheet/);
        await shot('making-lotm-silver-sheet.png');
        await c.getByRole('link', {name: 'Review charm candidates'}).click();
        const cards = page.locator('.making-candidates');
        await cards.getByRole('heading', {name: 'LOTM charm candidates'}).waitFor();
        assert.equal(await cards.locator('.making-candidate').count(), 3);
        assert.match(await cards.innerText(), /dream.*(?:recorded, no compiled steps|compiled)/i);
        assert.match(await cards.innerText(), /Give activation its own command|Walk from inscription to use/);
        await cards.getByRole('link', {name: 'Open the silver-sheet making tree'}).click();
        await c.locator('.canvas-box', {hasText: 'Low-grade charm crafting'}).waitFor();
        await page.goto(base + '/#world/lotm/making');
        await page.locator('[data-canvas-kind=library] .canvas-box').first().waitFor({timeout: 90000});
        await shot('making-lotm-overview.png');
    });
    check('LOTM making: book workings the game plays, records or lacks', async () => {
        await page.goto(base + '/#world/lotm/making');
        const c = page.locator('[data-canvas-kind=library]').first();
        await c.locator('.canvas-box').first().waitFor({timeout: 90000});
        const bar = await page.locator('nav.atlas-tools').innerText();
        const m = /In the game: (\d+) playable, (\d+) recorded/.exec(bar);
        assert.ok(m && +m[1] >= 5 && +m[2] >= 50, bar.slice(0, 200));
        console.log('lotm game state:', m[0]);
        await page.getByRole('button', {name: /^Playable · /}).click();
        await page.goto(base + '/#world/lotm/making/' + encodeURIComponent('lotm.item.moon-flower'));
        const t = page.locator('[data-canvas-kind=library]').first();
        await t.locator('.canvas-box[data-group=playable]').first().waitFor({timeout: 90000});
        await t.locator('.canvas-box[data-group=playable]').first().click();
        assert.match(await inspector(t), /Playable in the game/);
        await shot('making-lotm-game-state.png');
    });
    check('LOTM things: ties, other rows and fills', async () => {
        await canvas('world/lotm/things', 'library');
        await page.getByRole('button', {name: /^People · /}).click();
        await page.getByRole('searchbox').fill('Klein Moretti');
        await page.locator('nav.atlas-tools').getByRole('button', {name: /^Klein Moretti/}).first().click();
        const k = page.locator('[data-canvas-kind=library]').first();
        await k.locator('.canvas-inspector h3', {hasText: 'Ties'}).waitFor({timeout: 90000});
        const person = k.locator('.reader-person-record');
        for (const heading of ['Who they are', 'What they do', 'Where and when', 'Linked scenes']) {
            await person.getByRole('heading', {name: heading, exact: true}).waitFor();
        }
        await person.getByText(/In OOPS/).waitFor();
        await shot('things-lotm-klein-ties.png');
        await page.getByRole('button', {name: /^"Other" rows · /}).click();
        await page.locator('.sheet details summary', {hasText: 'rules pass'}).waitFor();
        await page.getByRole('button', {name: /^Fills \(proposals\) · /}).click();
        await page.locator('.sheet p', {hasText: 'authored proposals'}).waitFor();
        await shot('things-lotm-fills.png');
    });
    check('OOPS recipe book: iron ingot tree and upstream comparison', async () => {
        await page.goto(base + '/#world/village/making/' + encodeURIComponent('game.iron-ingot'));
        const c = page.locator('[data-canvas-kind=library]').first();
        await c.locator('.canvas-box', {hasText: 'Iron short blade'}).first().waitFor({timeout: 90000});
        assert.match(await page.locator('nav.atlas-tools').innerText(), /added by OOPS/);
        await shot('making-oops-iron-ingot.png');
        const ingot = c.locator('.reader-item-record');
        await ingot.getByRole('heading', {name: 'Iron ingot', exact: true}).waitFor();
        assert.match(await ingot.innerText(), /OOPS recipe records linked/);
        await ingot.getByRole('link', {name: 'Iron short blade', exact: true}).first().click();
        await page.locator('.making-item-sheet').getByRole('heading', {name: 'Inputs', exact: true}).waitFor();
        await page.goto(base + '/#world/yair/making');
        await page.locator('[data-canvas-kind=library] .canvas-box').first().waitFor({timeout: 90000});
    });
    check('a read-only world (Circle of Inevitability) has things and making', async () => {
        const c = await canvas('world/coi/things', 'library');
        assert.ok(await c.locator('.canvas-box').count() >= 20);
        await page.goto(base + '/#world/coi/making');
        await page.locator('[data-canvas-kind=library] .canvas-box').first().waitFor({timeout: 90000});
    });
    check('LOTM Powers opens a source-first power record', async () => {
        const board = await canvas('world/lotm/powers', 'library');
        await board.locator('.canvas-box').first().click();
        const record = board.locator('.reader-power-record');
        for (const heading of ['What it does', 'How it’s used', 'How it’s learned', 'Costs and limits']) {
            await record.getByRole('heading', {name: heading, exact: true}).waitFor();
        }
        await record.getByText(/In OOPS/).waitFor();
    });
    check('Groups opens an institution or census group from collected records', async () => {
        const snapshot = await (await page.request.get(base + '/data')).json();
        const world = snapshot.findings.worlds.find(w => w.read && w.groups);
        assert.ok(world, 'a collected world has group records');
        const board = await canvas(`world/${world.world}/groups`, 'library');
        await board.locator('.canvas-box').first().click();
        const record = board.locator('.reader-group-record');
        await record.getByRole('heading', {name: 'What it is', exact: true}).waitFor();
        await record.getByText(/In OOPS/).waitFor();
    });
    check('village region and legacy links still land', async () => {
        await canvas('world/village/places');
        await page.goto(base + '/#tingen-districts');
        await page.waitForTimeout(400);
        assert.equal(page.url().split('#')[1], 'world/lotm/districts');
    });
    for (const [name, fn] of results) {
        try {await fn(); console.log('ok  ', name);} catch (e) {failed++; console.log('FAIL', name, '·', e.message.split('\n')[0]);}
    }
    console.log('page errors', JSON.stringify(errors));
    if (errors.length) failed++;
} finally {await browser.close(); server.kill();}
console.log(`${results.length - failed} of ${results.length} checks passed · screenshots in ${out}`);
process.exit(failed ? 1 : 0);
