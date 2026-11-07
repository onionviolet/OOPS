import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FACETS, OWNER_SKILL, facetDivisor, resistanceCoefficient, exposureGain, facetForTags, facetRow} from '../src/hazard_resistance.js';
import {advanceLocalLife} from '../src/absorb_c2/local_life.js';
import {skill_consumable_tags} from '../src/misc.js';

test('coefficient is 1 at level 0 and rises monotonically, floored at 1', () => {
    assert.equal(resistanceCoefficient(0, 'cold'), 1);
    let prev = 1;
    for (let lv = 1; lv <= 30; lv++) { const c = resistanceCoefficient(lv, 'cold'); assert.ok(c > prev); prev = c; }
    assert.equal(facetDivisor(.2, 'cold'), 1); assert.equal(facetDivisor(NaN, 'cold'), 1);
    assert.equal(resistanceCoefficient(5, 'nope'), 1); assert.equal(resistanceCoefficient(5, 'cold', {off: true}), 1);
    assert.ok(resistanceCoefficient(30, 'cold') < 10, 'facet weight keeps it below the poison coefficient');
});
test('constants mirror the owner skill', () => {
    const src = readFileSync(new URL('../src/data/skills.js', import.meta.url), 'utf8');
    const block = src.slice(src.indexOf('skills["Poison resistance"]'), src.indexOf('skills["Poison resistance"]') + 600);
    assert.match(block, /max_level: 30/); assert.match(block, /max_level_coefficient: 10/);
    assert.equal(OWNER_SKILL, 'Poison resistance'); assert.equal(skill_consumable_tags[OWNER_SKILL], 'poison');
});
test('growth has diminishing returns and a dial cap', () => {
    const g = lv => exposureGain('cold', 10, lv);
    assert.ok(g(0) > g(4) && g(4) > g(8) && g(8) > g(11) && g(11) > 0);
    assert.equal(g(FACETS.cold.levelCap), 0); assert.equal(g(30), 0);
    assert.ok(exposureGain('cold', 10, 20, {levelCap: 25}) > 0);
    assert.equal(exposureGain('cold', 0, 0), 0); assert.equal(exposureGain('cold', -5, 0), 0); assert.equal(exposureGain('cold', NaN, 0), 0);
    assert.equal(exposureGain('cold', 10, 0, {off: true}), 0); assert.equal(exposureGain('nope', 10, 0), 0);
    assert.equal(facetRow('cold', {weight: 5}).weight, .99);
});
test('failure scenario: a high-level facet never reduces a hazard below zero or heals', () => {
    for (let lv = 0; lv <= 30; lv++) {
        const d = resistanceCoefficient(lv, 'cold'); assert.ok(d >= 1 && Number.isFinite(d));
        const wet = -5 / d; assert.ok(wet < 0 && wet >= -5);
        const cold = 1 + (0.8 - 1) / d; assert.ok(cold >= .8 && cold <= 1);
    }
});
test('weather effects carry the facet tag; poison tag mapping untouched', async () => {
    const {effect_templates} = await import('../src/active_effects.js');
    for (const id of FACETS.cold.hazards) assert.equal(facetForTags(effect_templates[id].tags)?.facet, 'cold', id);
    assert.equal(facetForTags(effect_templates.Bleeding.tags), null);
    assert.equal(facetForTags(effect_templates['Slight food poisoning']?.tags), null);
});
const R = () => .999;
const frame = o => ({worldId: 'base.frontier', location: 'Village', alive: true, idle: true, clock: 0, calendarMinute: 720, perception: 0, money: 20, foodPoisonRemaining: 0, ...o});
test('local life: played cold exposure trains Poison resistance only; no new key; replay and untouched life write nothing', () => {
    const s = advanceLocalLife(undefined, frame({coldHazardRemaining: 30, poisonResistanceLevel: 0}), R).state;
    const p = advanceLocalLife(s, frame({clock: 10, coldHazardRemaining: 30, poisonResistanceLevel: 0}), R);
    assert.deepEqual(Object.keys(p.native.skillXp), [OWNER_SKILL]);
    assert.equal(p.native.skillXp[OWNER_SKILL], exposureGain('cold', 10, 0));
    assert.deepEqual(Object.keys(p.state).sort(), Object.keys(s).sort(), 'no new saved key');
    assert.deepEqual(advanceLocalLife(p.state, frame({clock: 10, coldHazardRemaining: 30}), R).native.skillXp, {});
    const capped = advanceLocalLife(p.state, frame({clock: 20, coldHazardRemaining: 30, poisonResistanceLevel: 12}), R);
    assert.deepEqual(capped.native.skillXp, {});
    const q = advanceLocalLife(p.state, frame({clock: 20, coldHazardRemaining: 3, poisonResistanceLevel: 0}), R);
    assert.equal(q.native.skillXp[OWNER_SKILL], exposureGain('cold', 3, 0), 'bounded by remaining duration');
    const none = advanceLocalLife(p.state, frame({clock: 30}), R);
    assert.deepEqual(none.native.skillXp, {}); assert.deepEqual(none.state.poisonMinutes, p.state.poisonMinutes);
    assert.deepEqual(advanceLocalLife(p.state, frame({clock: 40, worldId: 'elsewhere', coldHazardRemaining: 30}), R).native.skillXp, {});
});

test('Hero effect consumer divides tagged weather by the facet, leaves poison and untagged effects on the old path', async () => {
    const {effect_templates, ActiveEffect} = await import('../src/active_effects.js');
    const src = readFileSync(new URL('../src/models/hero.js', import.meta.url), 'utf8');
    const body = src.match(/    getEffectWithBonuses\(active_effect\) \{([\s\S]*?)\n    \}\n/)[1];
    const consume = new Function('active_effect', 'skill_consumable_tags', 'facetForTags', 'facetDivisor', 'OWNER_SKILL', body);
    const run = (effect, coef) => consume.call({getTotalSkillCoefficient: ({skill_id}) => skill_id === OWNER_SKILL ? coef : 1}, effect, skill_consumable_tags, facetForTags, facetDivisor, OWNER_SKILL);
    const wet = run(effect_templates.Wet, 10), d = facetDivisor(10, 'cold');
    assert.equal(wet.stats.cold_tolerance.flat, -5 / d); assert.ok(wet.stats.cold_tolerance.flat < 0);
    assert.equal(run(effect_templates.Wet, 1).stats.cold_tolerance.flat, -5, 'level 0 is byte-identical');
    const cold = run(effect_templates.Cold, 10).stats.strength.multiplier;
    assert.equal(cold, 1 + (0.9 - 1) / d); assert.ok(cold > .9 && cold < 1);
    const free = new ActiveEffect({name: 'Plain', effects: {stats: {cold_tolerance: {flat: -5}}}, tags: {debuff: true}});
    assert.equal(run(free, 10).stats.cold_tolerance.flat, -5, 'untagged effect unchanged');
    const poison = new ActiveEffect({name: 'Tox', effects: {stats: {health_loss_flat: {flat: -2}}}, tags: {poison: true}});
    assert.equal(run(poison, 10).stats.health_loss_flat.flat, -2 / 10, 'poison still divides by the full coefficient');
});
