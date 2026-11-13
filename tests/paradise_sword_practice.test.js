import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, engineReceipts, serializeEngineWorld} from '../src/engine_world.js';
import {readQuantity} from '../src/world_substrate.js';
import {paradisePracticeRun as run} from '../src/world_packs/paradise_sword_practice.js';

const restore = engine => run.restore(JSON.parse(JSON.stringify(serializeEngineWorld(engine))));
const balance = engine => readQuantity(engine.world, 'su_xiao', 'stock:paradise_coin');
const vitality = (engine, fighter) => readQuantity(engine.world, fighter, 'vitality');

test('pay once, restore in flight, and finish one full hour before gaining the lesson', () => {
    const initial = run.create();
    assert.equal(balance(initial), 2000);
    const pending = run.act(initial, 'enroll');
    assert.equal(balance(pending), 1000);
    assert.equal(engineReceipts(pending)[0].truth.paid.status, 'paid');
    assert.equal(run.act(pending, 'enroll'), pending);
    assert.equal(run.act(pending, 'spar'), pending);
    const partial = advanceEngineWorld(restore(pending), 59).engine;
    assert.equal(run.view(partial).facts[2][1], 'Lesson in progress');
    assert.equal(engineReceipts(partial).length, 1);
    const learned = run.act(partial, 'finish');
    assert.equal(learned.world.clock, 60);
    assert.equal(balance(learned), 1000);
    assert.equal(run.view(learned).facts[2][1], 'Read the opening before cutting');
    assert.deepEqual(serializeEngineWorld(learned), serializeEngineWorld(run.act(pending, 'finish')));
});

test('the saved lesson flips which body takes the first cut in the same drill', () => {
    const before = run.act(run.create(), 'spar');
    assert.ok(vitality(before, 'su_xiao') < vitality(before, 'sparring_image'));
    const after = run.act(restore(run.act(run.act(before, 'enroll'), 'finish')), 'spar');
    assert.ok(vitality(after, 'sparring_image') < vitality(after, 'su_xiao'));
    assert.deepEqual(run.view(restore(after)).history, [
        'Before practice · Sparring image landed the first cut in 0.9 seconds.',
        'After practice · Su Xiao landed the first cut in 0.7 seconds.',
    ]);
});

test('short funds refuse the booking and a lost tutor prevents learning without reversing the fee', () => {
    const initial = run.create();
    const poor = applyEngineOps(initial, [{op: 'set', holder: 'su_xiao', quantity: 'stock:paradise_coin', amount: 999}], 'fixture:short_balance');
    assert.equal(run.act(poor, 'enroll'), poor);
    assert.equal(run.view(poor).actions.find(action => action.id === 'enroll').reason, 'You need 1,000 Paradise Coins.');
    const pending = run.act(initial, 'enroll');
    const noTutor = applyEngineOps(pending, [{op: 'holder_remove', holder: 'koshiro_image'}], 'fixture:tutor_leaves');
    const interrupted = run.act(restore(noTutor), 'finish');
    assert.equal(balance(interrupted), 1000);
    assert.equal(engineReceipts(interrupted).at(-1).ok, false);
    assert.equal(run.view(interrupted).facts[2][1], 'Unpracticed');
});

test('practice and observation advance the skill once and a restored level changes the next cut', () => {
    const before = run.act(run.create(), 'spar');
    const booked = run.act(before, 'enroll');
    const learned = run.act(restore(booked), 'finish');
    assert.match(run.view(learned).facts[3][1], /Level 1 · 100/);
    const sparred = run.act(learned, 'spar');
    assert.match(run.view(sparred).facts[3][1], /Level 1 · 125/);
    const legacy = serializeEngineWorld(sparred);
    delete legacy.world.holders.su_xiao.properties['paradise.sword_practice_xp'];
    assert.match(run.view(run.restore(legacy)).facts[3][1], /Level 1 · 125/);
    const observed = run.act(restore(sparred), 'study');
    assert.equal(observed.world.clock, 70);
    assert.match(run.view(observed).facts[3][1], /Level 2 · 200/);
    assert.equal(run.act(restore(observed), 'study').world.clock, 70);
    assert.match(run.view(run.act(restore(observed), 'spar')).history.at(-1), /first cut in 0\.6 seconds/);
});
