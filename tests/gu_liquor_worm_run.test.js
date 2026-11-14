import assert from 'node:assert/strict';
import test from 'node:test';
import {serializeEngineWorld} from '../src/engine_world.js';
import {fangLiquorWormRun as run} from '../src/world_packs/gu_liquor_worm_run.js';

test('Liquor Worm converts finite raw essence into a stronger Moonblade at equal raw cost', () => {
    let engine = run.create();
    assert.throws(() => run.act(engine, 'refine'), /Feed the Liquor Worm/);
    engine = run.act(run.act(engine, 'feed-moonlight'), 'feed-liquor-worm');
    const ordinary = run.act(engine, 'cast-basic');
    assert.match(run.view(ordinary).result, /spent 4 parts and took 30/);
    const oneBatch = run.act(engine, 'refine');
    assert.throws(() => run.act(oneBatch, 'cast-refined'), /lack middle-stage essence/);
    const twoBatches = run.act(oneBatch, 'refine');
    const refined = run.act(run.restore(JSON.parse(JSON.stringify(serializeEngineWorld(twoBatches)))), 'cast-refined');
    assert.match(run.view(refined).result, /spent 2 parts and took 45/);
    const reserve = outcome => run.view(outcome).facts.find(([label]) => label === 'Primeval essence');
    assert.deepEqual(reserve(ordinary), reserve(refined));
});

test('the same Moonblade resolves against each target without spending Fang Yuan’s live reserve', () => {
    const fed = run.act(run.create(), 'feed-moonlight');
    const compared = run.act(fed, 'compare');
    const view = run.view(compared);
    assert.deepEqual(view.facts, run.view(fed).facts);
    assert.deepEqual(view.comparison.rows.map(row => row.slice(1)), [
        ['Initial', 4, 0, 15, '30 / 45', 'Flesh cut · standing'],
        ['Middle', 2, 0, 23, '22 / 45', 'Forearm fracture · rush stopped · can flee · bleeding'],
        ['Initial', 4, 45, 0, '100 / 100', 'Blocked · no wound'],
        ['Middle', 2, 45, 0, '100 / 100', 'Blocked · no wound'],
        ['Initial', 4, 35, 0, '180 / 180', 'Blocked · no wound'],
        ['Middle', 2, 35, 5, '175 / 180', 'Flesh cut · standing'],
    ]);
    const restored = run.restore(serializeEngineWorld(compared));
    assert.deepEqual(run.view(restored).comparison, view.comparison);
    const delayed = run.act(restored, 'observe-wound');
    assert.equal(run.view(delayed).comparison.rows[1][5], '18 / 45');
    assert.throws(() => run.act(run.act(delayed, 'stabilize'), 'observe-wound'), /observed this minute/);
    const stabilized = run.act(restored, 'stabilize');
    const observed = run.act(run.restore(serializeEngineWorld(stabilized)), 'observe-wound');
    assert.equal(run.view(observed).comparison.rows[1][5], '22 / 45');
    assert.match(run.view(observed).comparison.rows[1][6], /fracture.*stabilized/);
    assert.throws(() => run.act(observed, 'observe-wound'), /observed this minute/);
});

test('every action leaves its own result line naming what it cost and what is left', () => {
    let engine = run.create();
    engine = run.act(engine, 'feed-moonlight');
    assert.match(run.view(engine).result, /fed the Moonlight Gu.*2 moon orchid petals/);
    engine = run.act(engine, 'feed-liquor-worm');
    assert.match(run.view(engine).result, /fed the Liquor Worm/);
    const first = run.act(engine, 'cast-basic'), second = run.act(first, 'cast-basic');
    const [a, b] = [first, second].map(e => run.view(e).result);
    assert.notEqual(a, b);
    assert.match(a, /8 initial-stage parts left; the partner has 70 vitality left/);
    assert.match(b, /4 initial-stage parts left; the partner has 40 vitality left/);
    const refined = run.act(run.restore(JSON.parse(JSON.stringify(serializeEngineWorld(engine)))), 'refine');
    assert.match(run.view(refined).result, /refined .* initial-stage parts into 1 middle-stage part\. You have \d+ initial-stage and 1 middle-stage/);
    assert.equal(run.view(second).history.length, 4);
});
