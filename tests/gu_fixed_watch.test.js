import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceFixedWatch, beginFixedRival, fixedClaimOriginal, fixedClaimRival, fixedClaimSteward, fixedClaimWorld, fixedForgeMaterial,
    nextFixedWatchBoundary, readKeeperFixedClaim, writeKeeperFixedClaim} from '../src/gu_keeper_fixed_claim.js';
import {fixedImmortalTravel} from '../src/gu_fixed_immortal_travel.js';
import {armGuDestruction, stabilizeGuDestruction} from '../src/gu_restoration.js';

function watched() {
    const state = {clock: 0, worlds: {[fixedClaimWorld]: {facts: {}}}};
    const world = {attempts: [], stocks: {}, gu: [{id: fixedClaimOriginal, kind: fixedImmortalTravel,
        uniqueKey: fixedImmortalTravel, rank: 6, holder: 'player', alive: true}]};
    writeKeeperFixedClaim(state, {...armGuDestruction(world, {specimen: fixedClaimOriginal, now: 0, delay: 20}),
        rivalWatch: {status: 'waiting', checkAt: 25, stock: 1}});
    return state;
}

test('watched vacancy starts and settles a rival from their own material once', () => {
    const state = watched();
    assert.equal(nextFixedWatchBoundary(state), 20);
    state.clock = 20;
    assert.equal(advanceFixedWatch(state), 1);
    assert.equal(readKeeperFixedClaim(state).gu.some(gu => gu.alive), false);
    assert.equal(nextFixedWatchBoundary(state), 25);
    state.clock = 25;
    assert.equal(advanceFixedWatch(state), 1);
    const working = readKeeperFixedClaim(state);
    assert.equal(working.stocks[fixedClaimRival][fixedForgeMaterial], 0);
    assert.equal(working.rivalWatch.stock, 0);
    assert.equal(working.attempts[0].initiative, true);
    assert.equal(nextFixedWatchBoundary(state), 55);
    state.clock = 55;
    assert.equal(advanceFixedWatch(state), 1);
    const finished = readKeeperFixedClaim(state);
    assert.equal(finished.stocks[fixedClaimRival][fixedForgeMaterial], 0);
    assert.deepEqual(finished.gu.filter(gu => gu.alive).map(gu => [gu.id, gu.holder]), [['fixed-rival-1', fixedClaimSteward]]);
    assert.equal(advanceFixedWatch(state), 0);
});

test('a preserved claim keeps the rival from committing their material', () => {
    const state = watched();
    writeKeeperFixedClaim(state, stabilizeGuDestruction(readKeeperFixedClaim(state), {specimen: fixedClaimOriginal, now: 5}));
    assert.equal(nextFixedWatchBoundary(state), 25);
    state.clock = 25;
    assert.equal(advanceFixedWatch(state), 1);
    const world = readKeeperFixedClaim(state);
    assert.equal(world.rivalWatch.status, 'occupied');
    assert.equal(world.rivalWatch.stock, 1);
    assert.deepEqual(world.attempts, []);
    assert.equal(world.gu[0].alive, true);
});

test('a commissioned attempt already at work takes precedence over rival initiative', () => {
    const state = watched();
    const initial = readKeeperFixedClaim(state);
    writeKeeperFixedClaim(state, beginFixedRival({...initial, stocks: {[fixedClaimRival]: {[fixedForgeMaterial]: 1}}}, 0));
    for (const time of [20, 25, 30]) {
        state.clock = time;
        assert.equal(advanceFixedWatch(state), 1);
    }
    const world = readKeeperFixedClaim(state);
    assert.equal(world.rivalWatch.status, 'busy');
    assert.equal(world.rivalWatch.stock, 1);
    assert.equal(world.attempts.length, 1);
    assert.equal(world.attempts[0].status, 'complete');
    assert.equal(world.gu.filter(gu => gu.alive).length, 1);
    assert.equal(nextFixedWatchBoundary(state), Infinity);
});
