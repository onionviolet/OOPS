import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../scripts/headless/runner.mjs';

test('a Village patrol settles once and skill-name refresh preserves its job tooltip', async t => {
    const game = await boot(null, {seed:251035});
    t.after(() => game.close());
    const start = game.minutes();
    const money = game.internals.character.money;
    await game.click('.choice_work');
    await game.click('[data-activity="patrolling"]');
    await game.step(120);
    assert.equal(game.minutes(), start + 120);
    assert.equal(game.internals.current_activity, null);
    assert.equal(game.internals.character.money, money + 50);
    const tooltip = game.document.querySelector('[data-activity="patrolling"] .job_tooltip');
    assert.ok(tooltip, 'patrol remains available after settlement');
    assert.doesNotMatch(tooltip.textContent, /chance to find/);
    await game.step(1);
    assert.equal(game.internals.character.money, money + 50, 'next tick cannot pay twice');
    assert.deepEqual(game.errors, []);
});
