import test from "node:test";
import assert from "node:assert/strict";
import {evaluateRule, chooseOutcome, resolveOnce} from "../src/rules.js";

const rescue = {all: [
    {fact: "knowsTreatment", op: "eq", value: true, reason: "Identify the injury."},
    {any: [
        {fact: "medicine", op: "gte", value: 1, reason: "Bring medicine."},
        {fact: "rescueAvailable", op: "eq", value: true, reason: "Secure assistance."},
    ]},
]};
const outcomes = [{id: "recovered", chance: .6}, {id: "complication", chance: .3}, {id: "evacuate", chance: .1}];

test("knowledge and alternative preparations explain blocked actions without consuming inputs", () => {
    const facts = {knowsTreatment: false, medicine: 0, rescueAvailable: false};
    const before = structuredClone(facts);
    assert.deepEqual(evaluateRule(rescue, facts).reasons, ["Identify the injury.", "Bring medicine.", "Secure assistance."]);
    assert.deepEqual(facts, before);
    assert.equal(evaluateRule(rescue, {...facts, knowsTreatment: true, rescueAvailable: true}).met, true);
    assert.equal(evaluateRule(rescue, {...facts, knowsTreatment: true, medicine: 1}).met, true);
});

test("unknown is distinct from false, including negation and compound conditions", () => {
    const dead = {fact: "dead", op: "eq", value: true};
    assert.equal(evaluateRule({not: dead}, {}).met, false);
    assert.equal(evaluateRule({not: dead}, {}).known, false);
    assert.equal(evaluateRule({not: dead}, {dead: false}).met, true);
    assert.equal(evaluateRule({not: {all: [dead, {fact: "medicine", op: "gte", value: 1}]}}, {medicine: 0}).met, true);
    assert.equal(evaluateRule({fact: "medicine", op: "gte", value: 1}, {medicine: NaN}).known, false);
    assert.throws(() => evaluateRule({fact: "medicine", op: "gte", value: Infinity}, {}), /finite/);
});

test("graded outcomes respect interval boundaries, zero chances and invalid distributions", () => {
    assert.equal(chooseOutcome(outcomes, 0), "recovered");
    assert.equal(chooseOutcome(outcomes, .6), "complication");
    assert.equal(chooseOutcome(outcomes, .95), "evacuate");
    assert.equal(chooseOutcome([{id: "never", chance: 0}, {id: "certain", chance: 1}], 0), "certain");
    assert.throws(() => chooseOutcome([{id: "bad", chance: .5}], .2), /sum/);
    assert.throws(() => chooseOutcome([{id: "same", chance: .5}, {id: "same", chance: .5}], .2), /unique/);
    for(const draw of [-1, 1, NaN]) assert.throws(() => chooseOutcome(outcomes, draw), /Draw/);
});

test("a serialized resolution receipt cannot reroll and leaves unresolved input untouched", () => {
    const pending = {id: "watchpost-rescue:journey-1"};
    const resolved = resolveOnce(pending, outcomes, .7);
    assert.deepEqual(pending, {id: "watchpost-rescue:journey-1"});
    const reloaded = JSON.parse(JSON.stringify(resolved));
    assert.deepEqual(resolveOnce(reloaded, outcomes, .01), resolved);
    assert.equal(resolved.outcome, "complication");
});

