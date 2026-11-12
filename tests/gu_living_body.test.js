import assert from 'node:assert/strict';
import test from 'node:test';
import {guCatalogue} from '../src/gu_catalogue.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {guBodyRow} from '../src/world_packs/gu_body_cases.js';
import {advanceEngineWorld, createEngineWorld} from '../src/engine_world.js';
import {livingKindRegistry} from '../src/living_kinds.js';

test('chapter fields and explicit unknowns survive the join for all 78 kinds', () => {
    const rows = Object.keys(guCatalogue).map(guBodyRow);
    assert.equal(rows.length, 78);
    assert.equal(Object.keys(livingKindRegistry({rows: rows.map(({row}) => row)}).kinds).length, 78);
    for (const {row} of rows) {
        const body = guCatalogue[row.id].body;
        assert.deepEqual(row.bodyFields.diet, body.diet
            ? {basis: 'chapter', value: body.diet.food, chapters: body.diet.chapters} : {basis: 'unknown'});
        assert.deepEqual(row.bodyFields.stageMinutes, {basis: 'unknown'});
        assert.deepEqual(row.bodyFields.lifespan, {basis: 'unknown'});
    }
    assert.deepEqual(guBodyRow('liquor-worm').durationMinutes, {basis: 'chapter', value: 5760, chapters: [23]});
    assert.deepEqual(guBodyRow('moonlight').durationMinutes, {basis: 'chapter', value: 720, chapters: [23]});
    const travel = guBodyRow('fixed-immortal-travel');
    assert.equal(travel.row.bodyFields.interval.value.years, 6);
    assert.deepEqual(travel.durationMinutes, {basis: 'unknown'});
    assert.deepEqual(guBodyRow('attitude').durationMinutes, {basis: 'unknown'});
});

test('appetite advances without inventing a diet', () => {
    const {row} = guBodyRow('thunderclap');
    const engine = createEngineWorld({packs: ['l.living_body'], holders: [
        {id: 'field', kind: 'place'},
        guBodyHolder(row, {id: 'specimen', place: 'field', satiety: 2}),
    ]});
    const result = advanceEngineWorld(engine, 2).engine.world;
    assert.equal(result.holders.specimen.quantities.satiety, 0);
    assert.equal(result.holders.specimen.state['l.living_body'].emptySince, 2);
    assert.deepEqual(row.diet, {});
});
