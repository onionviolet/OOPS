// Headless full-game runner: real src/main.js bundle, in-process DOM, no browser.
//   node --test tests/headless/*.test.js
// YAIRPG_HEADLESS_DAY=1 also steps a fresh game a full 24 game hours (speed gate).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {boot, canonicalSave, diffSaves, ROOT, SAVE_KEY} from '../../scripts/headless/runner.mjs';
import {createDom} from '../../scripts/headless/dom.mjs';
import {runHeadless} from '../../scripts/headless/village_route.mjs';

const key = id => JSON.stringify({id});
const count = (save, id) => save.inventories.person.main_character[key(id)]?.count ?? 0;

test('DOM shim parses markup, matches selectors and runs default activation', () => {
    const {document, loadHTML} = createDom();
    loadHTML('<html><body><details id="d"><summary>Open</summary><button data-x="a b" class="k">Go</button></details><input type="checkbox" id="c"></body></html>');
    const button = document.querySelector('details > [data-x~="b"].k');
    assert.equal(button.textContent, 'Go');
    assert.equal(document.querySelectorAll(':not(summary)').length > 3, true);
    let clicks = 0; document.body.addEventListener('click', e => {if(e.target === button) clicks++;});
    button.click(); assert.equal(clicks, 1);
    document.querySelector('summary').click(); assert.equal(document.getElementById('d').open, true);
    document.getElementById('c').click(); assert.equal(document.getElementById('c').checked, true);
    button.dataset.villageAction = 'x'; assert.equal(button.getAttribute('data-village-action'), 'x');
});

test('fresh game boots, plays and steps with invariants', async t => {
    const game = await boot(null, {seed:3});
    t.after(() => game.close());
    const minutes = process.env.YAIRPG_HEADLESS_DAY === '1' ? 1440 : 240;
    const before = game.minutes();
    const {ms} = await game.step(minutes);
    t.diagnostic(`fresh: ${minutes} game min in ${(ms / 1000).toFixed(1)} s = ${Math.round(minutes / ms * 1000)} game min per wall s`);
    assert.ok(game.minutes() >= before + minutes);
    assert.deepEqual(game.errors, []);
    assert.ok(game.windowEntryPoints().includes('change_location'));
});

test('developed perf fixture loads and steps', async t => {
    const save = await readFile(join(ROOT, 'tests/fixtures/perf/mid.json'), 'utf8');
    const game = await boot(save, {seed:4});
    t.after(() => game.close());
    const {ms} = await game.step(30);
    t.diagnostic(`mid.json: 30 game min in ${(ms / 1000).toFixed(1)} s`);
    assert.deepEqual(game.errors, []);
});

test('save -> load and export -> import round trips are exact', async t => {
    const game = await boot(null, {seed:5});
    t.after(() => game.close());
    await game.step(20);
    const saved = await game.save();
    assert.equal(game.storage.getItem(SAVE_KEY), JSON.stringify(saved));
    await game.load(saved);
    const reloaded = await game.save();
    // A fresh game's first save omits default zeros that load fills in (NPC skill XP,
    // one option flag). Only such additions may differ; after that the cycle is exact.
    const added = diffSaves(reloaded, saved, 100000);
    assert.ok(added.every(d => d.b === undefined && ['0', 'false'].includes(d.a)), JSON.stringify(added.filter(d => d.b !== undefined || !['0', 'false'].includes(d.a)).slice(0, 5)));
    await game.load(reloaded);
    assert.deepEqual(diffSaves(canonicalSave(await game.save()), canonicalSave(reloaded)), []);
    const encoded = await game.exportFile();
    const exported = await game.save();
    await game.importFile(encoded);
    assert.deepEqual(diffSaves(canonicalSave(await game.save()), canonicalSave(exported)), []);
});

test('scripted village route reaches the expected durable save, deterministically', async t => {
    const first = await runHeadless();
    t.diagnostic(`route: ${Math.round(first.ms)} ms`);
    const {talked, worked, bought, final} = first.saves;
    assert.ok(talked.availabilities.textline);
    assert.ok(worked.character.equipment.axe, 'axe equipped through the inventory [equip] click');
    assert.ok(count(worked, 'Rough wood log') > 0, 'an hour of woodcutting gathered logs');
    assert.equal(count(bought, 'Coal'), 1);
    assert.ok(bought.character.money < worked.character.money);
    assert.equal(count(final, 'Coal'), 0, 'the bought coal was smelted');
    assert.equal(count(final, 'Low quality iron ore'), 0);
    assert.ok(final.levels.person.main_character.skill_xp.Smelting > 0, 'smelting earned native XP');
    const second = await runHeadless();
    assert.equal(canonicalSave(second.saves.final), canonicalSave(final));
});
