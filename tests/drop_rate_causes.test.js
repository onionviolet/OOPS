import test from 'node:test';
import assert from 'node:assert/strict';
import {explainDropRate, dropRateLine, perTargetFactor} from '../src/drop_rate_causes.js';

test('PS166: each factor is a part with its cause, and the current rate multiplies them', () => {
    const r = explainDropRate(0.1, {skill: {name: 'Butchering', factor: 1.2}, gear: 1.1});
    assert.deepEqual(r.parts.map(p => p.cause), ['skill', 'gear']);
    assert.ok(Math.abs(r.current - 0.132) < 1e-9);
    assert.equal(dropRateLine(0.1, {skill: {name: 'Butchering', factor: 1.2}}), '12% now (base 10%): ×1.2 from Butchering.');
    assert.equal(dropRateLine(0.25, {}), '25%, unchanged.');
    assert.equal(explainDropRate(0.9, {skill: {name: 'Butchering', factor: 2}}).current, 1, 'a chance never passes certainty');
});

test('PS166/F34: a broad fight lowers each drop but raises the fight\'s total, and says both', () => {
    assert.equal(perTargetFactor(1), 1);
    const r = explainDropRate(0.3, {targets: 3});
    assert.ok(Math.abs(r.fight.perTarget - 3 ** -0.6667) < 1e-9);
    assert.ok(r.fight.perFight > 1 && r.fight.perFight < 3, 'more than one kill, less than three');
    assert.match(dropRateLine(0.3, {targets: 3}), /×0\.48 each when fighting 3 at once\. Against 3 at once each drops less \(×0\.48\), but the fight as a whole yields ×1\.44 one kill's loot\./);
});
