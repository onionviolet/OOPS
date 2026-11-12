import assert from 'node:assert/strict';
import test from 'node:test';
import {runGuEffectChain, searchGuEffectChains} from '../src/gu_effect_chains.js';

const stage = (id, ability, chain) => ({gu: {id, kind: id, rank: 1, fedThrough: 10}, operator: 'player',
    ability: {fuel: 'primeval', cost: 1, ...ability}, chain});
const core = {...stage('core', {effect: {kind: 'damage', magnitude: 2}}), emits: 'ray'};
const stone = {...stage('stone', {effect: {kind: 'damage', magnitude: 2}}), emits: 'thrown-stone'};
const fork = stage('fork', {}, {accepts: 'ray', produces: 'double-ray', factor: 0.5, contacts: 2});
const bend = stage('bend', {}, {accepts: 'ray', produces: 'arc'});
const sweep = stage('sweep', {}, {accepts: 'arc', produces: 'swept-arc', contacts: 2});
const target = {accepts: ['double-ray', 'swept-arc'], minForce: 1, contacts: 2};
const request = {available: [sweep, core, stone, fork, bend], reserves: {player: {primeval: 3}}, day: 10, target};

test('search discovers two differently shaped routes and compares their actual output', () => {
    const {options} = searchGuEffectChains(request);
    assert.deepEqual(options.map(row => row.plan.map(pick => pick.id)), [['core', 'fork'], ['core', 'bend', 'sweep']]);
    assert.deepEqual(options.map(row => row.result.signal.magnitude), [1, 2]);
    const harder = searchGuEffectChains({...request, target: {...target, minForce: 2}});
    assert.deepEqual(harder.options.map(row => row.result.signal.kind), ['swept-arc']);
    assert.equal(searchGuEffectChains({...request, budget: 2}).truncated, true);
});

test('a saved route needs the exact specimen and charges only the beats that fire', () => {
    const {plan} = searchGuEffectChains(request).options[1];
    const unavailable = {...sweep, gu: {...sweep.gu, alive: false}};
    const interrupted = runGuEffectChain({...request, plan, available: [core, fork, bend, unavailable]});
    assert.equal(interrupted.reached, false);
    assert.equal(interrupted.id, 'sweep');
    assert.equal(interrupted.remaining.player.primeval, 1);
    assert.equal(interrupted.signal, null);
    assert.throws(() => runGuEffectChain({...request, plan: [plan[0], plan[2]]}), /cannot carry/);
});
