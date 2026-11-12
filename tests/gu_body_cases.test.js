import assert from 'node:assert/strict';
import test from 'node:test';
import {guCatalogue} from '../src/gu_catalogue.js';
import {guBodyCase} from '../src/world_packs/gu_body_cases.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld} from '../src/engine_world.js';
import {readQuantity} from '../src/world_substrate.js';

const stated = Object.keys(guCatalogue).filter(id => guCatalogue[id].body.diet);
assert.equal(stated.length, 17);

for (const id of stated) {
    test(`${id}: stated food sustains the body and wrong food does not`, () => {
        const scene = guBodyCase(id);
        const {fed, unfed, wrong} = scene.ids;
        let engine = createEngineWorld(scene.engine);
        for (let i = 1; i <= 4; i++) {
            const advanced = advanceEngineWorld(engine, i * (scene.ration - 1));
            assert.equal(advanced.pending, false);
            engine = advanced.engine;
            assert.equal(readQuantity(engine.world, fed, 'satiety'), 1);
            engine = applyEngineOps(engine, scene.mealOps(engine.world, fed, 'matching-supply'), 'fixture:offer');
            engine = applyEngineOps(engine, scene.mealOps(engine.world, wrong, 'wrong-supply'), 'fixture:offer');
            assert.equal(readQuantity(engine.world, fed, 'satiety'), scene.ration);
        }
        assert.equal(scene.read(engine.world, fed).hunger.stage, 'fed');
        for (const body of [unfed, wrong]) {
            assert.equal(readQuantity(engine.world, body, 'satiety'), 0);
            assert.equal(engine.world.holders[body].state['l.living_body'].emptySince, scene.ration);
            assert.equal(scene.read(engine.world, body).hunger.stage, 'starved');
            assert.ok(scene.read(engine.world, body).vitality.value < scene.read(engine.world, fed).vitality.value);
        }
        for (const stock of scene.knownStock) assert.equal(readQuantity(engine.world, 'matching-supply', stock), 0);
        assert.equal(readQuantity(engine.world, 'wrong-supply', scene.wrongStock), scene.mealAmount * 4);
    });
}

test('a conjunction needs both inputs and an alternative can feed alone', () => {
    const grass = guBodyCase('vitality-grass');
    const worm = guBodyCase('four-flavors-liquor-worm');
    for (const [scene, stock, expected] of [
        [grass, 'stock:water', 1],
        [worm, 'stock:monkey-wine', worm.ration],
    ]) {
        const setup = createEngineWorld({...scene.engine, holders: [...scene.engine.holders,
            {id: 'extra', kind: 'thing', place: 'feeding-site', quantities: {[stock]: 1}}]});
        const {engine} = advanceEngineWorld(setup, scene.ration - 1);
        const next = applyEngineOps(engine, scene.mealOps(engine.world, scene.ids.fed, 'extra'), 'fixture:offer');
        assert.equal(readQuantity(next.world, scene.ids.fed, 'satiety'), expected);
    }
});
