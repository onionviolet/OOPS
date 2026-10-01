import test from "node:test";
import assert from "node:assert/strict";
import {freshCultivation, trialRequirement, beginTrial} from "./cultivation.js";

test("cultivation keeps its route thresholds, message order and rejected-attempt resource safety", () => {
    const state = freshCultivation();
    assert.match(trialRequirement(state, "martial"), /60 qi/);
    state.qi = 60;
    const before = structuredClone(state);
    assert.match(beginTrial(state, "martial"), /30 body/);
    assert.deepEqual(state, before);
    state.body = 30;
    assert.equal(trialRequirement(state, "martial"), "");
    assert.match(trialRequirement(state, "artisan"), /30 preparation/);
    state.preparation = 30;
    assert.equal(trialRequirement(state, "artisan"), "");
});
