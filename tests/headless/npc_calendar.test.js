import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../../scripts/headless/runner.mjs';
import {scenarioSave} from '../../scripts/headless/scenarios.mjs';

// DEV SEEDED: story access from the named recipe, two commission logs and a
// near-dawn clock. Greeting, enrollment, order and work use the native path.
test('the native NPC calendar holds a night order and starts it at dawn', async t => {
    const seed = JSON.parse(await scenarioSave('village-workshop-unenrolled', {seed: 11}));
    seed.inventories.person.main_character[JSON.stringify({id:'Rough wood log'})] = {count:2};
    Object.assign(seed['current time'], {hour:5, minute:57});
    const game = await boot(seed, {seed:11});
    t.after(() => game.close());
    await game.fill('#workspace_navigation select[aria-label="Other known panels"]', 'notebook');
    await game.click('#notebook_tab_people');
    await game.click('#simulation_panel > summary');
    await game.click('[data-simulation="enroll"]');
    await game.click('[data-simulation="village.commission"]');
    const work = () => game.snapshot().expansion.simulation.jobs.filter(j => j.commandId === 'village.craftsman_work');
    await game.step(1, {chunk:1});
    assert.equal(work().length, 0, 'the craftsman waits before 06:00');
    assert.equal(game.snapshot().expansion.actors.oldCraftsman.facts['work.order'], true);
    await game.step(3, {chunk:1});
    assert.equal(work().length, 1, 'the authored controller starts work after 06:00');
    assert.equal(work()[0].actorId, 'oldCraftsman');
    await game.step(5, {chunk:1});
    assert.equal(game.snapshot().expansion.actors.oldCraftsman.facts['work.ready'], true);
    assert.deepEqual(game.errors, []);
});
