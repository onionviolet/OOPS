import test from 'node:test';
import assert from 'node:assert/strict';
import {hasStatedAbilityCost, abilityMechanismHint, inferAbilityCost} from '../src/ability_cost_infer.js';

test('stated costs win even without an amount, including explicit zero', () => {
    for (const row of [{costs: [{label: 'effort', value: null}]}, {cost: [{amount: -1}]},
        {costs: [{value: 0}]}, {costStated: 'stated'}, {costStated: true}, {stated: [{kind: 'cost'}]}]) {
        assert.equal(hasStatedAbilityCost(row), true);
        assert.equal(inferAbilityCost(row), null);
    }
    assert.equal(hasStatedAbilityCost({costs: [], costStated: 'not-mentioned'}), false);
});

test('rung changes demand adjectives without inventing numbers or resource transactions', () => {
    const row = {name: 'Air bullet', costs: []};
    const low = inferAbilityCost(row, {sequence: 9}), high = inferAbilityCost(row, {sequence: 1});
    assert.equal(low.basis.mechanism, 'projection');
    assert.equal(low.intensity, 'modest');
    assert.equal(high.intensity, 'extreme');
    for (const result of [low, high]) {
        assert.equal(result.inferred, true);
        assert.equal(result.basis.status, 'proposal');
        for (const k of ['cost', 'cooldown', 'risk']) assert.equal(typeof result[k], 'string');
        assert.equal('amount' in result, false);
    }
});

test('mechanisms differ and a per-world override is pure and deterministic', () => {
    const row = {name: 'Vision', costs: []};
    const options = {sequence: 6, worldId: 'test.world', profile: {perception: {cost: 'negligible attention', risk: 'low strain'}}};
    const before = structuredClone({row, options});
    const result = inferAbilityCost(row, options);
    assert.equal(result.cost, 'negligible attention');
    assert.equal(result.risk, 'low strain');
    assert.equal(result.basis.worldId, 'test.world');
    assert.deepEqual(result, inferAbilityCost(row, options));
    assert.deepEqual({row, options}, before);
    assert.notEqual(inferAbilityCost(row).cost, inferAbilityCost({name: 'Teleport'}).cost);
    assert.throws(() => inferAbilityCost(row, {profile: {perception: {cost: 3}}}), /adjective/);
});

test('missing rung stays unknown and a target Sequence in a name is not used', () => {
    const r = inferAbilityCost({name: 'Vision against Sequence 2 targets'});
    assert.equal(r.basis.sequence, null);
    assert.equal(r.intensity, 'unresolved');
    assert.match(r.basis.rankBasis, /unstated/);
    for (const sequence of [-1, 10, 3.5, '7', NaN]) {
        assert.match(inferAbilityCost({name: 'Vision'}, {sequence}).reason, /Invalid Sequence/);
    }
});

test('unrecognized mechanisms get an actionable reason; explicit mechanism works', () => {
    const row = {name: 'Synthetic unnamed ability'};
    assert.equal(abilityMechanismHint(row), null);
    assert.match(inferAbilityCost(row).reason, /Mechanism unresolved/);
    assert.equal(inferAbilityCost(row, {mechanism: 'mental'}).cost, 'moderate concentration');
    assert.match(inferAbilityCost(row, {mechanism: 'unknown'}).reason, /Mechanism unresolved/);
});

test('prepared supplies and passive upkeep stay distinct from active casting', () => {
    assert.equal(inferAbilityCost({name: 'Paper-doll substitute'}).cost, 'prepared supply');
    const passive = inferAbilityCost({name: 'Passive spiritual vision'});
    assert.equal(passive.basis.mechanism, 'passive');
    assert.match(passive.cost, /uncertain/);
});
