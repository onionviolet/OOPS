import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, advanceSimulation, MAX_SIMULATION_CLOCK} from "../src/expansion_engine.js";
import {expeditionRegistry as registry, initializeExpedition} from "../src/expedition_content.js";

// Simfuzz F2: an unbounded advance on a fresh save moved the clock to
// Number.MAX_SAFE_INTEGER, after which no advance could ever succeed.
test('an advance past the clock horizon is rejected and leaves the save advanceable', () => {
    const state = initializeExpedition(createExpansionState(7));
    assert.throws(() => advanceSimulation(state, registry, Number.MAX_SAFE_INTEGER), /Invalid simulation duration/);
    assert.throws(() => advanceSimulation(state, registry, MAX_SIMULATION_CLOCK - state.clock + 1), /Invalid simulation duration/);
    assert.equal(state.clock, 0);
    const next = advanceSimulation(state, registry, 5).state;
    assert.equal(next.clock, 5);
    assert.equal(advanceSimulation(next, registry, 1).state.clock, 6);
});
