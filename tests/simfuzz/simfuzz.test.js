// Fast smoke for the engine simulation fuzzer (scripts/simfuzz/).
//   node --test --test-concurrency=2 tests/simfuzz/*.test.js
// Three seeds, one per policy and fixture, short runs. Known open defects from
// the full report are listed in known_failures.json; anything else fails.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as H from '../../scripts/simfuzz/harness.mjs';

const known = JSON.parse(fs.readFileSync(new URL('./known_failures.json', import.meta.url), 'utf8'));
const isKnown = f => known.some(k => k.kind === f.kind && (!k.match || String(f.detail).includes(k.match)));
const STEPS = 120;
let E, catalog;

test.before(async () => { E = await H.loadEngine(); catalog = H.buildCatalog(E); });

test('catalog lists every registered command once', () => {
    assert.deepEqual(E.loadErrors, []);
    const keys = new Set(catalog.map(r => r.key));
    assert.equal(keys.size, catalog.length);
    for (const id of E.registry.simulation.commands.keys()) assert.ok(keys.has('sim:' + id), id);
    for (const id of E.registry.actions.keys()) assert.ok(keys.has('action:' + id), id);
    for (const a of E.backlog.backlogActions()) assert.ok(keys.has('backlog:' + a.id), a.id);
});

test('harness invariants catch planted defects', () => {
    const {plan} = H.fixturePlan(E, 'mid');
    assert.deepEqual(H.checkInvariants(E, plan, plan), []);
    const bad = structuredClone(plan);
    bad.external.money = -1;
    bad.state.simulation.owners.player = {'{"id":"Rough wood log"}': NaN};
    bad.state.clock = plan.state.clock - 1;
    const kinds = H.checkInvariants(E, plan, bad).map(([k]) => k);
    for (const k of ['finite', 'nonnegative', 'clock']) assert.ok(kinds.includes(k), k + ' in ' + kinds);
});

for (const seed of [0, 4, 8]) {
    test(`seed ${seed} (${H.policyForSeed(seed)} on ${H.fixtureForSeed(seed)}) holds every invariant`, () => {
        const r = H.runSeed(E, catalog, {seed, steps: STEPS, sweep: 'none', roundTripEvery: 20, splitEvery: 5});
        assert.equal(r.steps, STEPS);
        const unknown = r.failures.filter(f => !isKnown(f));
        assert.deepEqual(unknown.map(f => `step ${f.step} ${f.kind} [${f.action}] ${f.detail}`), []);
        assert.ok(r.roundTrips > 0, 'ran at least one save round-trip');
    });
}

test('same seed reproduces the same final hash', () => {
    const a = H.runSeed(E, catalog, {seed: 1, steps: 60, sweep: 'none'});
    const b = H.runSeed(E, catalog, {seed: 1, steps: 60, sweep: 'none'});
    assert.equal(a.finalHash, b.finalHash);
    assert.ok(a.commits > 0);
});
