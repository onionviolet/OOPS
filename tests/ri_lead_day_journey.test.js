// Slow tier: plays Fang Yuan's ordinary day on his own ch140 save (ri-fang-yuan-ice-crystal, earned, private). Adopt the day, feed the
// Moonglow, draw a stone, walk a patrol and report it (a seeded encounter with a result line), rest a wound if the night gave one, let
// the sea refill on its own, then skip meals until the hungry Moonglow blocks the patrol. The day, the encounter's merit and the sea's
// settlement survive a save and reload. Skips on a checkout without the private checkpoint.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {boot, ROOT} from '../scripts/headless/runner.mjs';
import {SCENARIOS, scenarioSave} from '../scripts/headless/scenarios.mjs';
import {RI_PATROL_ENCOUNTERS} from '../src/ri_lead_day_facts.js';

const NAME = 'ri-fang-yuan-ice-crystal', DAY = 'book.ri.lead.day', ESS = 'book.ri.lead.primeval';
const count = (save, id) => save.inventories.person.main_character[JSON.stringify({id})]?.count ?? 0;
const sea = save => save.expansion.simulation.energies.player[ESS].reserve;

test('Fang Yuan keeps his own day: meals, a stone, a reported patrol, a sea that refills, and a skipped meal that stops the patrol', async t => {
    if(!existsSync(join(ROOT, SCENARIOS[NAME]?.file ?? '-')) || !existsSync(join(ROOT, 'private_packs/manifest.json'))) return t.skip('local private checkpoint not present');
    const g = await boot(JSON.parse(await scenarioSave(NAME)), {seed: 1});
    t.after(() => g.close());
    const action = id => g.document.querySelector(`[data-structured-action="${DAY}.${id}"]`);
    const open = async () => {if(action('buy_petals') && !g.hiddenReason(action('buy_petals'))) return;
        const b = [...g.document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Beginning' && !g.hiddenReason(x)); if(b) {await g.click(b); await g.settle();}};
    const run = async (id, minutes = 0) => {await open(); await g.click(action(id)); if(minutes) await g.step(minutes); else await g.settle();};
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
    await open();
    assert.equal(action('patrol').disabled, true, 'one watch at a time until it is reported');
    await run('report');
    save = await g.save();
    const line = save.expansion.simulation.knowledge.player[`${DAY}.patrol`].value, row = RI_PATROL_ENCOUNTERS.find(r => line.startsWith(r.line));
    assert.ok(row, 'the report leaves one of the encounter lines');
    assert.equal(count(save, 'book.ri.lead.ear_grass.merit'), merit, 'the night pays no merit on its own');
    const eyes = count(save, 'book.ri.lead.ear_grass.cached_wolf_eyes');
    if(eyes) {await run('hand_in_eye', 15); save = await g.save();
        assert.equal(count(save, 'book.ri.lead.ear_grass.merit'), merit + 10, 'an eye handed in at the board is ten merit');}
    if(row.fight) await run('drive_off');   // a wolf left at the wall: the compressed fallback settles it (the live hunt is the combat lane's)
    if(row.injured || row.fight) await run('rest_wound', 370);
    save = await g.save();
    const before = sea(save);
    await g.reload(); await g.settle();
    await g.step(120);
    save = await g.save();
    assert.ok(save.ri_lead_sea?.schema === 1, 'the sea settlement is saved');
    assert.ok(sea(save) >= Math.min(44, before + 7), `the sea refills on its own across a reload (${before} to ${sea(save)})`);
    await g.step(900);
    await open();
    assert.equal(action('patrol').disabled, true, 'a missed meal leaves the Moonglow hungry');
    await run('feed_moonglow', 10);
    await open();
    assert.equal(action('patrol').disabled, false);
    save = await g.save();
    assert.ok(save.content_packs.structured.extensions.some(e => e.id === DAY), 'the adopted day is pinned in the save');
    assert.deepEqual(g.errors, []);
});
