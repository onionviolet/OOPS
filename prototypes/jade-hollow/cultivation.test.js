import test from "node:test";
import assert from "node:assert/strict";
import {freshCultivation, loadCultivation, tickCultivation, beginTrial, consumePreparation, breakthrough, rebirth, cultivationRates} from "./cultivation.js";

const tick = (s, activity, n) => {
    for(let i = 0; i < n; i++) tickCultivation(s, {inRegion: true, activity});
};

test("a fresh martial build earns a seal, breaks through, and chooses breath legacy", () => {
    const s = freshCultivation();
    tick(s, "weightlifting", 30);
    tick(s, "meditating", 30);
    assert.equal(beginTrial(s, "martial"), "");
    tick(s, null, 12);
    assert.equal(s.seal, true);
    assert.equal(breakthrough(s), false); // Trial spent qi; preparation still matters.
    tick(s, "meditating", 20);
    assert.equal(breakthrough(s), true);
    assert.equal(breakthrough(s), false); // Cannot claim rewards twice.
    const next = rebirth(s, "breath");
    assert.equal(next.rebirths, 1);
    assert.equal(next.realm, 0);
    assert.equal(next.qi, 0);
    assert.equal(cultivationRates(next).qi, 2.5);
});

test("an artisan build reaches the same milestone without body training", () => {
    const s = freshCultivation();
    consumePreparation(s, "Meridian pellet");
    for(let i = 0; i < 3; i++) consumePreparation(s, "Dewleaf tea");
    assert.equal(s.body, 0);
    assert.equal(beginTrial(s, "artisan"), "");
    assert.equal(s.preparation, 30);
    tick(s, null, 12);
    for(let i = 0; i < 2; i++) consumePreparation(s, "Dewleaf tea");
    assert.equal(breakthrough(s), true);
    const next = rebirth(s, "craft");
    consumePreparation(next, "Meridian pellet");
    assert.equal(next.preparation, 45);
    assert.equal(next.body, 0);
});

test("save roundtrip preserves in-flight trials and pauses outside the region", () => {
    const s = freshCultivation();
    tick(s, "meditating", 50);
    tick(s, "weightlifting", 30);
    beginTrial(s, "martial");
    tick(s, null, 5);
    const loaded = loadCultivation(JSON.parse(JSON.stringify(s)));
    assert.deepEqual(loaded, s);
    tickCultivation(loaded, {inRegion: false, activity: "meditating"});
    assert.equal(loaded.trial.progress, 5);
    tick(loaded, "meditating", 7);
    assert.equal(loaded.qi, 60); // Trial prevents parallel qi generation.
    assert.equal(loaded.seal, true);
});

test("upstream saves migrate additively and malformed numeric values cannot poison progress", () => {
    assert.deepEqual(loadCultivation(undefined), freshCultivation());
    assert.throws(() => loadCultivation({schema: 2}), /Unsupported/);
    const s = loadCultivation({schema: 1, qi: Infinity, body: -8, preparation: 999, legacy: "invalid"});
    assert.equal(s.qi, 0);
    assert.equal(s.body, 0);
    assert.equal(s.preparation, 100);
    assert.equal(s.legacy, null);
});

test("requirements reject premature trials and rebirth, and legacies replace rather than stack", () => {
    const s = freshCultivation();
    assert.match(beginTrial(s, "martial"), /60 qi/);
    assert.equal(rebirth(s, "breath"), null);
    assert.equal(consumePreparation(s, "unrecognized"), false);
    s.realm = 1; s.legacy = "breath"; s.rebirths = 8; s.loanClaimed = true;
    const next = rebirth(s, "craft");
    assert.equal(next.rebirths, 9);
    assert.equal(next.loanClaimed, true);
    assert.equal(cultivationRates(next).qi, 2);
    assert.equal(rebirth(s, "not-a-legacy"), null);
});
