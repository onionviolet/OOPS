import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../../scripts/headless/runner.mjs';

// RC2 (BHR17, CBR2), 2026-10-19: a hero who drops to 0 HP outside combat collapses once. The 0-HP
// check runs every tick; staying at 0 HP is one collapse with one record and one log line, not one
// per tick (a rest heal lifts HP above 0 mid-tick, so only a tick that ends above 0 ends the
// collapse), it survives a reload at 0 HP, and it does not count as a combat defeat.
test('collapse: harm outside combat publishes one record per collapse', async t => {
    const game = await boot(null, {seed:5, heroName:null});
    t.after(() => game.close());
    assert.ok(!('parent_location' in game.internals.current_location), 'starts in a town, outside combat');
    game.module.add_active_effect('Dragonfly queen venom', 600);
    await game.step(30, {chunk:1});
    const save = await game.save();
    const lines = [...game.document.querySelectorAll('#message_log_div > *')].filter(n => n.textContent.includes('has collapsed'));
    assert.equal(lines.length, 1, 'one log line while the hero stays down');
    assert.deepEqual(save.defeat.counts, {unconscious: 1});
    assert.equal(save.defeat.last.cause.kind, 'harm');
    assert.equal(save.defeat.last.cause.place, game.internals.current_location.id);
    assert.equal(save.total_deaths, 0, 'the combat counter is untouched');
    await game.load(save);
    await game.step(10, {chunk:1});
    assert.deepEqual((await game.save()).defeat.counts, {unconscious: 1}, 'a reload mid-collapse is the same collapse');
    assert.deepEqual(game.errors, []);
});
