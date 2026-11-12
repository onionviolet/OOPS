import assert from 'node:assert/strict';
import test from 'node:test';
import {guColonyView, openGuColony, restoreGuColony, settleGuColonyAction, starFireflyFarm} from '../src/gu_colony.js';

const advance = {kind: 'advance'};
const step = (colony, clock, action = advance) => settleGuColonyAction(colony, starFireflyFarm, clock, action);
const restore = colony => restoreGuColony(JSON.parse(JSON.stringify(colony)), starFireflyFarm);

test('a late shade change settles the previous exposed windows across save restore', () => {
    const initial = openGuColony(starFireflyFarm, {clock: 100, interval: 15, site: 'keeper-farm'});
    const exposed = step(initial, 100, {kind: 'light', light: 'exposed'}).colony;
    const daily = [115, 130, 145].reduce((colony, clock) => step(colony, clock).colony, exposed);
    const shaded = step(restore(exposed), 145, {kind: 'light', light: 'shaded'}).colony;
    assert.deepEqual(shaded, {...daily, light: 'shaded'});
    const view = guColonyView(shaded, starFireflyFarm);
    assert.deepEqual([view.starGrass, view.ordinary, view.emerged, view.nextCheck], [1, 2, 0, 160]);
    const observed = step(shaded, 152).colony;
    assert.throws(() => step(restore(observed), 151, {kind: 'plant'}), /Invalid colony clock/);
});

test('collection consumes each emerged Gu once and long catch-up retains a pending boundary', () => {
    const initial = openGuColony(starFireflyFarm, {clock: 0, interval: 10});
    const collected = step(initial, 10, {kind: 'collect'});
    assert.equal(collected.collected, 'starlight-firefly');
    assert.throws(() => step(restore(collected.colony), 10, {kind: 'collect'}), /No Gu has emerged/);
    const pending = step(initial, 700, {kind: 'collect'});
    assert.equal(pending.pending, true);
    assert.equal(pending.collected, undefined);
    const settled = step(restore(pending.colony), 700, {kind: 'collect'});
    assert.equal(settled.pending, false);
    assert.equal(settled.collected, 'starlight-firefly');
    assert.equal(guColonyView(settled.colony, starFireflyFarm).nextCheck, 710);
});
