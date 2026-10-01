import test from "node:test";
import assert from "node:assert/strict";
import {hasEarnedClear} from "../src/clear_state.js";

test("uncleared and partial encounters do not earn first-clear unlocks", () => {
    for(const kills of [undefined, 0, 1, 49, -1, Infinity]) assert.equal(hasEarnedClear(kills, 50), false);
    assert.equal(hasEarnedClear(50, 50), true);
    assert.equal(hasEarnedClear(75, 50), true);
    assert.equal(hasEarnedClear(50, 0), false);
});

test("multiple-clear thresholds require the full earned count", () => {
    assert.equal(hasEarnedClear(59, 15, 4), false);
    assert.equal(hasEarnedClear(60, 15, 4), true);
});
