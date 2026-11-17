import test from 'node:test';
import assert from 'node:assert/strict';
import {guCatalogue} from '../src/gu_catalogue.js';
import {splitGu, fitGu, predictGu, scoreGu, runProbe, abilityClass, EFFECT_CLASS, identityOf} from '../src/gu_heldout.js';

const entries = Object.entries(guCatalogue);
const split = splitGu(entries);
const fit = fitGu(split.tuned, guCatalogue);

test('the split is fixed and disjoint: 8 tuned, 53 held out, kinds without a function reading are out of scope', () => {
    assert.equal(split.tuned.length, 8);
    // 2026-11-16: Small, Great Thief, Heavenly Web and Heavenly Secret gained chapter functions (GKM449) and fall
    // into the held-out side of the unchanged split; the tuned eight and the fit are unchanged.
    assert.equal(split.heldOut.length, 53);
    assert.equal(split.outOfScope.length, 20);
    assert.equal(new Set([...split.tuned, ...split.heldOut]).size, 61);
    assert.deepEqual(splitGu(entries), split);
    assert.notDeepEqual(splitGu(entries, 'other-seed').tuned, split.tuned);
});

test('every effect kind in the catalogue has a class, and the class agrees with the function reading except the named one', () => {
    for (const [id, k] of entries) {
        if (!k.ability) continue;
        const cls = abilityClass(k.ability.value);
        assert.ok(cls, `${id} has an effect class`);
        if (cls !== k.parts.value.function) assert.equal(id, 'fire-discharge'); // travel effect, read as move
    }
    assert.ok(EFFECT_CLASS.lightning);
});

test('a prediction reads identity only: bending a kind\'s function, ability and recipe moves nothing', () => {
    const base = scoreGu(split.heldOut, fit, guCatalogue).rows.map(r => r.predicted);
    const bent = Object.fromEntries(entries.map(([id, k]) => [id, split.heldOut.includes(id)
        ? {...k, ability: undefined, recipe: undefined, parts: {...k.parts, value: {...k.parts.value, function: 'attack', roles: ['x']}}} : k]));
    assert.deepEqual(scoreGu(split.heldOut, fit, bent).rows.map(r => r.predicted), base);
    assert.deepEqual(Object.keys(identityOf('x-y', guCatalogue.thunderclap)).sort(), ['features', 'id', 'rank']);
});

test('the fit never reads held-out kinds', () => {
    const bent = Object.fromEntries(entries.map(([id, k]) => [id, split.heldOut.includes(id) && k.parts
        ? {...k, parts: {...k.parts, value: {...k.parts.value, function: 'heal'}}} : k]));
    assert.deepEqual(fitGu(split.tuned, bent), fit);
});

test('the probe runs through the real activation engine and refuses a class with no probe effect', () => {
    const ok = runProbe('thunderclap', guCatalogue.thunderclap, {class: 'attack', fuel: 'primeval', cost: 2});
    assert.deepEqual([ok.ran, ok.effectClass, ok.fuel, ok.cost], [true, 'attack', 'primeval', 2]);
    assert.equal(runProbe('x', guCatalogue.thunderclap, {class: 'produce', fuel: 'primeval', cost: 1}).ran, false);
    assert.equal(runProbe('x', guCatalogue.thunderclap, {class: null, fuel: 'primeval', cost: 1}).ran, false);
});

test('measured held-out score (pinned at the measured result; no rule changed after scoring)', () => {
    const s = scoreGu(split.heldOut, fit, guCatalogue);
    assert.deepEqual([s.n, s.diagOutcome, s.withAbility, s.ran, s.cannotRun, s.engineOutcome, s.engineRoute], [53, 4, 18, 6, 47, 1, 4]); // the four kinds added 2026-11-16 are four more misses, all missing data
    const cats = {};
    for (const r of s.misses) for (const m of r.misses) cats[m.category] = (cats[m.category] ?? 0) + 1;
    assert.deepEqual(cats, {'missing rule': 30, 'missing data': 31, "author's exception": 2});
    assert.equal(scoreGu(split.tuned, fit, guCatalogue).diagOutcome, 8);
});
