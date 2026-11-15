// Slow tier: plays Harry's school week on his own Halloween save (hp-w7-halloween, earned, private; Sunday evening in term). Adopt the
// week, find Herbology shut on Sunday night, go to Tuesday's 09:00 class, write its homework that evening, and find the counts kept
// across a save and reload, where the June Herbology paper reads them. Skips on a checkout without the private checkpoint.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {boot, ROOT} from '../scripts/headless/runner.mjs';
import {SCENARIOS, scenarioSave} from '../scripts/headless/scenarios.mjs';

const NAME = 'hp-w7-halloween', DAY = 'book.hp.lead.day';
const held = (save, id) => save.inventories.person.main_character[JSON.stringify({id})]?.count ?? 0;

test('Harry keeps his school week: a class on its hour, its homework after, both counted for June across a reload', async t => {
    if(!existsSync(join(ROOT, SCENARIOS[NAME]?.file ?? '-')) || !existsSync(join(ROOT, 'private_packs/manifest.json'))) return t.skip('local private checkpoint not present');
    const g = await boot(JSON.parse(await scenarioSave(NAME)), {seed: 1});
    t.after(() => g.close());
    const action = id => g.document.querySelector(`[data-structured-action="${DAY}.${id}"]`);
    const open = async () => {if(action('attend_herbology') && !g.hiddenReason(action('attend_herbology'))) return;
        const b = [...g.document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Beginning' && !g.hiddenReason(x)); if(b) {await g.click(b); await g.settle();}};
    await open();
    await g.click(`[data-structured-extension="${DAY}"]`); await g.settle();
    await open();
    assert.equal(action('attend_herbology').disabled, true, 'Sunday evening: Herbology is a Tuesday class');
    assert.equal(action('homework_herbology').disabled, true, 'no homework before a class');
    const minutes = save => {const s = save.expansion; return s.clock - s.simulation.knowledge.player['book.hp.lead.opening'].at + 480;};
    let save = await g.save();
    const now = minutes(save), tuesday9 = 94 * 1440 + 9 * 60;
    assert.ok(now < tuesday9, `the save sits before Tuesday 09:00 (${now})`);
    await g.step(tuesday9 + 2 - now);
    await open();
    assert.equal(action('attend_herbology').disabled, false, 'Tuesday 09:02: the greenhouse class takes pupils');
    await g.click(action('attend_herbology')); await g.step(60);
    await open();
    assert.equal(action('attend_herbology').disabled, true, 'the class is over and the next is Thursday');
    assert.equal(action('homework_herbology').disabled, false, 'a piece of homework is set');
    await g.click(action('homework_herbology')); await g.step(60);
    save = await g.save();
    assert.deepEqual([held(save, `${DAY}.notes.herbology`), held(save, `${DAY}.marked.herbology`)], [1, 1]);
    assert.match(save.expansion.simulation.knowledge.player[`${DAY}.last_lesson`].value, /^Herbology: /);
    await g.reload(); await g.settle();
    save = await g.save();
    assert.deepEqual([held(save, `${DAY}.notes.herbology`), held(save, `${DAY}.marked.herbology`)], [1, 1], 'the week survives a reload');
    assert.ok(save.content_packs.structured.extensions.some(e => e.id === DAY), 'the adopted week is pinned in the save');
    await open();
    assert.equal(action('homework_herbology').disabled, true, 'written once per class');
    assert.deepEqual(g.errors, []);
});
