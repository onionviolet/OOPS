import test from 'node:test';
import assert from 'node:assert/strict';
import {projectPlaceTypes, placeTypeEffectText} from '../src/place_types_projection.js';

const stages = {open: {1: {description: 'Wide open', effects: {evasion_points: {multiplier: 0.75}}},
    2: {description: 'Very open', effects: {evasion_points: {multiplier: 0.5}, attack_power: {flat: -2}}}}};
const options = (penalty) => ({stageOf: (type, stage) => stages[type]?.[stage], penalty,
    statName: stat => ({evasion_points: 'EP', attack_power: 'AP'})[stat] ?? stat});

test('place types keep native label, description and effective effect text', () => {
    const [type] = projectPlaceTypes([{type: 'open', stage: 1}], options(() => 0.75));
    assert.equal(type.label, 'open');
    assert.equal(type.description, 'Wide open');
    assert.deepEqual(type.effects.map(placeTypeEffectText), ['EP x0.75']);
});

test('a reduced effect shows its base, a later stage shows its numeral, unknown types drop', () => {
    const view = projectPlaceTypes([{type: 'open', stage: 2}, {type: 'missing', stage: 1}],
        options((type, stage, stat, kind) => kind === 'flat' ? -1 : 0.6123456));
    assert.equal(view.length, 1);
    assert.equal(view[0].label, 'open II');
    assert.deepEqual(view[0].effects.map(placeTypeEffectText), ['EP x0.612 [base: x0.5]', 'AP: -1 [base: -2]']);
});

test('no types gives an empty list', () => {
    assert.deepEqual(projectPlaceTypes(undefined, options(() => 1)), []);
});
