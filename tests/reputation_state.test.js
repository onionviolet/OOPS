import test from "node:test";
import assert from "node:assert/strict";
import {restoreSavedReputation, shouldReplayReputation} from "../src/reputation_state.js";

test("saved signed reputation totals replace reconstructed rewards and remain stable on repeated loads", () => {
    const reconstructed = {Village: 40, Slums: 200, Town: 50};
    const saved = {Village: 23, Slums: -5, Town: 70};
    const first = restoreSavedReputation(reconstructed, saved);
    assert.deepEqual(first, saved);
    assert.deepEqual(restoreSavedReputation(reconstructed, JSON.parse(JSON.stringify(first))), saved);
    assert.deepEqual(reconstructed, {Village: 40, Slums: 200, Town: 50});
});

test("legacy missing or partial totals retain reconstruction only where no total was saved", () => {
    assert.deepEqual(restoreSavedReputation({Village: 40}, undefined), {Village: 40});
    assert.deepEqual(restoreSavedReputation({Village: 40, Town: 50}, {Village: 0}), {Village: 0, Town: 50});
    for(const saved of [{Village: 1.5}, {Unknown: 10}, []]) {
        assert.throws(() => restoreSavedReputation({Village: 0}, saved));
    }
});

test("load rewards reconstruct only regions omitted from saved totals; live rewards still apply", () => {
    const partial = {Village: 0};
    assert.equal(shouldReplayReputation("Village", partial), false);
    assert.equal(shouldReplayReputation("Town", partial), true);
    assert.equal(shouldReplayReputation("Village", null), true);
    const replayed = restoreSavedReputation({Village: 0, Town: 0}, partial);
    for(const [region, value] of Object.entries({Village: 40, Town: 50})) {
        if(shouldReplayReputation(region, partial)) replayed[region] += value;
    }
    assert.deepEqual(replayed, {Village: 0, Town: 50});
});
