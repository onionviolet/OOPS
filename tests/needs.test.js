import test from 'node:test';
import assert from 'node:assert/strict';
import {readNeed, needRate, rationMinutes, settleRest, isSelfFed, BODIES} from '../src/needs.js';
import {harmState, setHarmState, healPart, restBacklash, actionModifiers, restReading, validateHarm, HARM_WORLDS} from '../src/harm_state.js';
import {domainRegistry} from '../src/domain_registry.js';
import {startRest, restHarm, lotmRestMeter} from '../src/book_world_lotm_harm.js';
import {restedSpeed} from '../src/tempo_fight_domain.js';
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

// FRC52: rest is the second need kind on the food interval shape; recovery reads the body heal multiplier through harm_state.
const T = 'book.lotm.tingen', lead = clock => ({clock, actors: {player: {worldId: T}}});
test.afterEach(() => setHarmState(null));

test('rest drains while awake and sleep repays it; low rest slows and weakens, never kills (BHR16)', () => {
    const rest = since => readNeed({body: 'human', kind: 'rest', since});
    assert.deepEqual([rest(0).stage, rest(600).stage, rest(1000).stage, rest(960 * 3).stage], ['rested', 'drowsy', 'tired', 'exhausted']);
    assert.equal(rest(1000).stageLabel, 'Tired');
    assert.ok(rest(1000).effect.work < 1 && rest(1000).effect.heal < 1); assert.equal(rest(1e6).effect.kills, false);
    assert.equal(settleRest({body: 'human', debt: 960, asleep: 480}), 0, 'eight hours repays sixteen');
    assert.equal(settleRest({body: 'human', debt: 100, awake: 50, asleep: 10}), 130);
    assert.equal(settleRest({body: 'human', awake: 1e9}), 960 * 4, 'debt is bounded');
    assert.equal(readNeed({body: 'human', baseMinutes: 100, sinceMeal: 500}).stage, 'starved', 'food words unchanged');
});

test('a construct never tires and mends twice as fast; Gu has no rest; sheep and cat rest on their own (Kenshi B4)', () => {
    assert.equal(needRate('construct', 'rest'), 0);
    assert.equal(settleRest({body: 'construct', awake: 1e6}), 0);
    assert.equal(readNeed({body: 'construct', kind: 'rest', since: 1e6}).needed, false);
    assert.equal(BODIES.construct.heal, 2);
    assert.equal(needRate('gu', 'rest'), 0);
    assert.ok(isSelfFed('house_cat', 'rest') && isSelfFed('sheep', 'rest') && !isSelfFed('human', 'rest'));
});

test('harm recovery reads a heal multiplier: 2 counts each rest minute twice, 0.5 half, 0 none', () => {
    const rules = HARM_WORLDS[T], hurt = {schema: 1, backlash: {power: 4}, parts: {hands: {rung: 'wounded'}}};
    const part = heal => healPart(hurt, rules, 'hands', {minutes: 240, heal}).record.after;
    assert.deepEqual([part(1), part(2), part(0.5), part(0)], ['bruised', 'shaken', 'wounded', 'wounded']);
    const power = heal => restBacklash(hurt, rules, 'power', {minutes: 240, heal}).state.backlash.power;
    assert.deepEqual([power(1), power(2), power(0)], [3, 2, 4]);
    assert.throws(() => healPart(hurt, rules, 'hands', {minutes: 1, heal: -1}), /heal multiplier/);
});

test('the lead tires through the harm slice: tired slows commands and fights, sleep repays and heals slower', () => {
    assert.equal(restReading({expansion: lead(5000), harm: harmState()}), null, 'a life that has not slept yet does not tire');
    assert.equal(restHarm(lead(10), 10).rest.before, 0, 'the first sleep starts the clock');
    setHarmState(null); startRest(lead(0));
    assert.deepEqual(harmState().rest, {debt: 0, at: 0, world: T});
    assert.equal(domainRegistry.list().find(d => d.id === 'harm').save().rest.world, T, 'a fresh rest record saves');
    const tired = {expansion: lead(1100), harm: harmState()};
    assert.equal(restReading(tired).stage, 'tired');
    const mods = actionModifiers(tired, 'work').modifiers;
    assert.deepEqual(mods.map(m => [m.axis, m.mult, m.cause]), [['speed', 0.85, 'Rest: Tired'], ['force', 0.85, 'Rest: Tired']]);
    assert.equal(actionModifiers(tired, 'rest').modifiers.length, 0, 'sleeping is not slowed');
    assert.equal(restReading({expansion: {clock: 1100, actors: {player: {worldId: 'base.frontier'}}}, harm: harmState()}), null, 'no carry into another world');
    assert.equal(restedSpeed(lead(1100), 100), 85);
    assert.equal(restedSpeed({clock: 1100, actors: {player: {worldId: 'base.frontier'}}}, 100), 100);
    assert.match(lotmRestMeter(lead(1100)).label, /Rest: Tired/);
    // A wounded lead sleeps 240 minutes from minute 1100: tired heal 0.75 leaves 180 counted minutes, short of one rung (240).
    setHarmState({...harmState(), parts: {legs: {rung: 'wounded'}}});
    const r = restHarm(lead(1340), 240);
    assert.equal(r.rest.before, 0); assert.equal(harmState().rest.debt, 1100 - 480);
    assert.equal(harmState().parts.legs.rung, 'wounded'); assert.equal(harmState().parts.legs.care, 180);
    restHarm(lead(1580), 240);
    assert.equal(harmState().rest.debt, 140); assert.equal(harmState().parts.legs.rung, 'bruised', 'rested sleep mends at full rate');
    assert.equal(restReading({expansion: lead(1580), harm: harmState()}).stage, 'rested');
    assert.throws(() => validateHarm({schema: 1, backlash: {}, rest: {debt: -1, at: 0, world: T}}), /rest record/);
});
