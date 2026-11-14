// Slow tier: plays Fang Yuan's ordinary day on his own ch140 save (ri-fang-yuan-ice-crystal, earned, private). Adopt the day,
// feed the Moonglow, draw a stone, patrol for merit; skip the next meals and the hungry Moonglow blocks the patrol until fed.
// The day's adoption and its meal clock survive a save and reload. Skips on a checkout without the private checkpoint.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {boot, ROOT} from '../scripts/headless/runner.mjs';
import {SCENARIOS, scenarioSave} from '../scripts/headless/scenarios.mjs';

const NAME = 'ri-fang-yuan-ice-crystal', DAY = 'book.ri.lead.day';
const count = (save, id) => save.inventories.person.main_character[JSON.stringify({id})]?.count ?? 0;

test('Fang Yuan keeps his own day: meals, a drawn stone and a patrol, and a skipped meal stops the patrol', async t => {
    if(!existsSync(join(ROOT, SCENARIOS[NAME]?.file ?? '-')) || !existsSync(join(ROOT, 'private_packs/manifest.json'))) return t.skip('local private checkpoint not present');
    const g = await boot(JSON.parse(await scenarioSave(NAME)), {seed: 1});
    t.after(() => g.close());
    const all = () => [...g.document.querySelectorAll('button')];
    const action = id => g.document.querySelector(`[data-structured-action="${DAY}.${id}"]`);
    const open = async () => {if(action('buy_petals') && !g.hiddenReason(action('buy_petals'))) return;
        const b = all().find(x => x.textContent.trim() === 'Beginning' && !g.hiddenReason(x)); if(b) {await g.click(b); await g.settle();}};
    const run = async (id, minutes) => {await open(); await g.click(action(id)); await g.step(minutes);};
    await open();
    await g.click(`[data-structured-extension="${DAY}"]`); await g.settle();
    await open();
    assert.equal(action('patrol').disabled, true, 'a Gu never fed by you is hungry, so the patrol waits on the first meal');
    await run('feed_moonglow', 10);
    await open();
    assert.equal(action('feed_moonglow').disabled, true, 'feeding early is refused');
    await run('draw_stone', 40);
    let save = await g.save();
    const merit = count(save, 'book.ri.lead.ear_grass.merit');
    await run('patrol', 190);
    save = await g.save();
    assert.equal(count(save, 'book.ri.lead.ear_grass.merit'), merit + 50);
    await g.reload(); await g.settle();
    await g.step(900);
    await open();
    assert.equal(action('patrol').disabled, true, 'a missed meal leaves the Moonglow hungry after a reload too');
    assert.match(action('patrol').closest('[data-structured-row]').textContent, /hungry and will not cut/);
    await run('feed_moonglow', 10);
    await open();
    assert.equal(action('patrol').disabled, false);
    save = await g.save();
    assert.ok(save.content_packs.structured.extensions.some(e => e.id === DAY), 'the adopted day is pinned in the save');
    assert.deepEqual(g.errors, []);
});
