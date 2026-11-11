import test from 'node:test';
import assert from 'node:assert/strict';
import {readNeed, needRate, rationMinutes} from '../src/needs.js';
import {compileUpkeepEvents, compileStandingOrder, starvation, nextMeal, dailyFood, dietInterval} from '../src/living_upkeep.js';
import {HABITAT, habitatFacts} from '../src/habitat_care.js';
import {householdAnimalNeed} from '../src/absorb_p23/household/model.js';

const diet = {holder: 'x.gu', label: 'Test Gu', food: 'f', perMeal: 2, interval: 1440, maxCondition: 4, flag: 'x.kept'};
const ids = s => `t.${s}`;

test('needs seam: a low food need slows and weakens, and kills only by dial with a reason (BHR16, LVR15)', () => {
    const read = sinceMeal => readNeed({body: 'human', baseMinutes: 100, sinceMeal});
    assert.equal(read(10).stage, 'fed');
    assert.equal(read(70).stage, 'peckish');
    const h = read(120);
    assert.equal(h.stage, 'hungry'); assert.ok(h.effect.work < 1 && h.effect.heal < 1); assert.equal(h.effect.kills, false);
    assert.equal(read(500).stage, 'starved'); assert.equal(read(500).effect.kills, false);
    assert.throws(() => readNeed({body: 'human', baseMinutes: 100, sinceMeal: 500, kills: true}), /reason/);
    assert.equal(readNeed({body: 'human', baseMinutes: 100, sinceMeal: 500, kills: true, reason: 'famine'}).effect.kills, true);
});

test('needs seam: a body with rate 0 never hungers (Kenshi B4)', () => {
    const c = readNeed({body: 'construct', baseMinutes: 100, sinceMeal: 1e9});
    assert.deepEqual([c.needed, c.stage, c.drain], [false, 'fed', 0]);
    assert.equal(rationMinutes('construct', 'food', 100), Infinity);
    assert.equal(rationMinutes('human', 'food', 100), 100);
    assert.equal(needRate('sheep'), 1);
});

test('living_upkeep reads the seam: a construct compiles no rows and has no schedule; a Gu is unchanged', () => {
    const k = {...diet, body: 'construct'};
    assert.deepEqual(compileUpkeepEvents(k, {worldId: 'w', ids}), []);
    assert.equal(compileStandingOrder(k, {worldId: 'w', actorId: 'k', orderFlag: 'o', ids}), null);
    assert.equal(dailyFood(k), 0);
    const s = starvation(k, {stock: 0, condition: 1, now: 0});
    assert.deepEqual([s.never, s.deathAt, s.nextMeal], [true, null, Infinity]);
    assert.equal(nextMeal(k, 5), Infinity);
    assert.equal(dietInterval(diet), 1440);
    const rows = compileUpkeepEvents(diet, {worldId: 'w', ids});
    assert.ok(!rows.some(r => r.id.includes('b_death')), 'hunger death is opt-in');
    assert.ok(rows.every(r => r.interval === 1440));
});

test('habitat pen reads the sheep body: ration length and fed state come from the seam', () => {
    assert.equal(HABITAT.careMinutes, 12);
    const owner = {schema: 1, policy: 'played_care_v1', site: {id: HABITAT.site, owner: 'player', sheltered: true, capacity: 1}, builtAt: 0, lastMinute: 0,
        animal: {id: HABITAT.animal, owner: 'player', site: HABITAT.site, adoptedAt: 0, welfare: 'sheltered_safe'}, fedAt: 0, attendedAt: 0, progress: 0, feeds: 1, attentions: 1, collected: 0};
    assert.equal(habitatFacts(owner, 5).fed, true); assert.equal(habitatFacts(owner, 5).need.stage, 'fed');
    assert.equal(habitatFacts(owner, 12).fed, false); assert.equal(habitatFacts(owner, 30).need.needed, true);
});

test('household cat meets its own food need and costs the player nothing', () => {
    assert.equal(householdAnimalNeed({animal: null}), null);
    const n = householdAnimalNeed({animal: {}});
    assert.deepEqual([n.selfFed, n.effect.kills, n.stage], [true, false, 'fed']);
});
