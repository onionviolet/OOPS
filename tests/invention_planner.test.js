import test from "node:test";
import assert from "node:assert/strict";
import {expandTarget, checkFeasibility, roadmapView, estimate, composeTargets} from "../src/invention_planner.js";
import {inventionPackHome as pack, homeWorld as home, magicWorld} from "../src/data/invention_pack_home.js";

const node = (graph, id) => graph.nodes.find(value => value.id === id);
const knowledgeOf = graph => Object.fromEntries(graph.nodes.map(value => [value.id, 5]));
const choicesOf = witness => Object.fromEntries(witness.steps.map(step => [step.id, step.method]));
function freeze(value) {
    if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
}
function loopPack(exit = false) {
    return {
        functions: [{id: "a", label: "Product A"}, {id: "b", label: "Product B"}],
        methods: [
            {id: "a.loop", label: "Build A from B", produces: "a", requires: ["b"]},
            {id: "b.loop", label: "Build B from A", produces: "b", requires: ["a"]},
            ...(exit ? [{id: "b.exit", label: "Independent route", produces: "b", requires: ["seed"]}] : []),
        ],
        primitives: [{id: "seed", label: "Seed"}],
    };
}
function assertWitness(graph, world, result) {
    assert.equal(result.solvable, true);
    const reached = new Set(result.witness.primitives);
    for (const id of reached) assert.equal(world.available[id] === true || world.available[id]?.available === true, true);
    for (const step of result.witness.steps) {
        assert.ok(node(graph, step.id).alternatives.includes(step.method));
        assert.deepEqual(step.requires, node(graph, step.method).requires);
        for (const id of step.requires) assert.ok(reached.has(id), `Dependency ${id} precedes ${step.id}`);
        reached.add(step.id);
    }
    for (const id of graph.roots) assert.ok(reached.has(id));
    const selected = estimate(graph, choicesOf(result.witness));
    assert.equal(selected.cyclic, false);
    assert.equal(selected.nodeCount, result.witness.nodeIds.length);
}

test("expansion makes OR functions, AND methods and declared terminal primitives", () => {
    const graph = expandTarget(pack, home, "soap");
    assert.deepEqual(graph.roots, ["soap"]);
    assert.equal(node(graph, "soap").operator, "OR");
    assert.deepEqual(node(graph, "soap").alternatives, ["soap.fat", "soap.plant"]);
    assert.equal(node(graph, "soap.fat").operator, "AND");
    assert.deepEqual(node(graph, "soap.fat").requires, ["alkali", "fat", "heat", "soap-knowledge"]);
    assert.deepEqual(node(graph, "alkali").alternatives, ["alkali.ash", "alkali.trade"]);
    assert.equal(node(graph, "water").kind, "primitive");
    assert.equal(node(graph, "water").available, true);
    assert.equal(node(graph, "cleansing-plant").available, false);
    for (const value of graph.nodes) for (const child of value.requires ?? value.alternatives ?? []) assert.ok(node(graph, child));
});

test("functional descriptor selects the same authored target as its ID", () => {
    assert.deepEqual(expandTarget(pack, home, {function: "light", magnitude: "room", form: "portable"}),
        expandTarget(pack, home, "lamp"));
    assert.throws(() => expandTarget(pack, home, "absent"), /Unknown target/);
    assert.throws(() => expandTarget(pack, home, {function: "light"}), /function, magnitude and form/);
    assert.throws(() => expandTarget(pack, home, {function: "light", magnitude: "nation", form: "portable"}), /matches 0/);
    const ambiguous = structuredClone(pack);
    ambiguous.functions.push({...ambiguous.functions.find(value => value.id === "lamp"), id: "other-lamp"});
    assert.throws(() => expandTarget(ambiguous, home, {function: "light", magnitude: "room", form: "portable"}), /matches 2/);
});

test("world flags prune a home method and add a magic method with its own primitives", () => {
    const graph = expandTarget(pack, magicWorld, "lamp");
    assert.deepEqual(node(graph, "lamp").alternatives, ["lamp.magic"]);
    assert.equal(node(graph, "lamp.oil"), undefined);
    assert.equal(node(graph, "glasswork"), undefined);
    assert.deepEqual(graph.pruned, [{id: "lamp.oil", product: "lamp", reason: "World rule combustion does not permit this method"}]);
    assertWitness(graph, magicWorld, checkFeasibility(graph, magicWorld));
});

test("named world method and tag prohibitions prune only their branches", () => {
    const world = {...home, rules: {blockedMethods: {"alkali.ash": "No ash source here"},
        blockedTags: {"ordinary-soap": "This world's rules forbid this route"}}};
    const graph = expandTarget(pack, world, "soap");
    assert.deepEqual(node(graph, "soap").alternatives, ["soap.plant"]);
    assert.equal(node(graph, "alkali"), undefined);
    assert.deepEqual(graph.pruned, [{id: "soap.fat", product: "soap", reason: "This world's rules forbid this route"}]);
    const justMethod = expandTarget(pack, {...home, rules: {blockedMethods: {"alkali.ash": "No ash source here"}}}, "soap");
    assert.deepEqual(node(justMethod, "alkali").alternatives, ["alkali.trade"]);
    assert.equal(justMethod.pruned[0].reason, "No ash source here");
});

test("feasibility gives a complete dependency-first witness and ignores missing unused alternatives", () => {
    for (const target of ["soap", "lamp", "thermometer"]) {
        const graph = expandTarget(pack, home, target), result = checkFeasibility(graph, home);
        assertWitness(graph, home, result);
        assert.deepEqual(result.missingPrimitives, []);
        assert.deepEqual(result.cycles, []);
    }
    const result = checkFeasibility(expandTarget(pack, home, "soap"), home);
    assert.ok(result.witness.nodeIds.includes("alkali.ash"));
    assert.ok(!result.witness.nodeIds.includes("soap.plant"));
});

test("missing primitive diagnostics name shortages and preserve authored or world reasons", () => {
    const world = structuredClone(home);
    world.available.water = {available: false, reason: "The well is inaccessible."};
    const graph = expandTarget(pack, world, "soap"), result = checkFeasibility(graph, world);
    assert.equal(result.solvable, false);
    assert.equal(result.witness, null);
    assert.deepEqual(result.missingPrimitives, [
        {id: "cleansing-plant", label: "Cleansing plant", reason: "No cleansing plant has been found here."},
        {id: "traded-alkali", label: "Traded alkali", reason: "No traded alkali source is available."},
        {id: "water", label: "Water", reason: "The well is inaccessible."},
    ]);
});

test("availability is explicit and feasibility reads the supplied world's current primitive stock", () => {
    const graph = expandTarget(pack, home, "lamp");
    assert.equal(checkFeasibility(graph, home).solvable, true);
    const world = {...home, available: {...home.available, oil: 1}};
    const result = checkFeasibility(graph, world);
    assert.equal(result.solvable, false);
    assert.deepEqual(result.missingPrimitives, [{id: "oil", label: "Lamp oil", reason: "No lamp oil available in this world."}]);
    assert.equal(checkFeasibility(graph, {available: {}}).solvable, false);
});

test("a fully pruned goal reports a named dead end even without missing primitives", () => {
    const graph = expandTarget(pack, {...home, rules: {flags: {combustion: false}}}, "lamp");
    const result = checkFeasibility(graph, home);
    assert.equal(result.solvable, false);
    assert.deepEqual(result.missingPrimitives, []);
    assert.deepEqual(result.deadEnds, [{id: "lamp", label: "Lamp upgrade", reason: "No permitted method for lamp upgrade."}]);
});

test("a product required to make itself cannot bootstrap and reports its cycle", () => {
    const graph = expandTarget(loopPack(), {available: {}}, "a");
    const result = checkFeasibility(graph, {available: {}});
    assert.equal(result.solvable, false);
    assert.equal(result.witness, null);
    assert.deepEqual(result.cycles, [{nodeIds: ["a", "a.loop", "b", "b.loop"], blocking: true}]);
    assert.deepEqual(result.missingPrimitives, []);
    assert.equal(estimate(graph).depth, null);
});

test("a cyclic graph with an independent route solves and its witness avoids the loop", () => {
    const world = {available: {seed: true}}, graph = expandTarget(loopPack(true), world, "a");
    const result = checkFeasibility(graph, world);
    assertWitness(graph, world, result);
    assert.deepEqual(result.cycles, [{nodeIds: ["a", "a.loop", "b", "b.loop"], blocking: false}]);
    assert.ok(!result.witness.nodeIds.includes("b.loop"));
});

test("a missing independent seed remains a shortage alongside the unresolved cycle", () => {
    const world = {available: {}}, graph = expandTarget(loopPack(true), world, "a");
    const result = checkFeasibility(graph, world);
    assert.equal(result.solvable, false);
    assert.equal(result.cycles[0].blocking, true);
    assert.deepEqual(result.missingPrimitives, [{id: "seed", label: "Seed", reason: "No seed available in this world."}]);
});

test("an escape for one goal does not hide another unresolved loop inside its SCC", () => {
    const fixture = loopPack(true);
    fixture.functions.push({id: "c", label: "Product C"});
    fixture.methods.find(value => value.id === "a.loop").requires.push("c");
    fixture.methods.find(value => value.id === "b.loop").requires.push("c");
    fixture.methods.push({id: "c.loop", label: "Build C from A", produces: "c", requires: ["a"]});
    const world = {available: {seed: true}}, graph = expandTarget(fixture, world, "a");
    const result = checkFeasibility(graph, world);
    assert.equal(result.solvable, false); // B escapes; A and C still require each other.
    assert.equal(result.cycles.length, 1);
    assert.equal(result.cycles[0].blocking, true);
});

test("zero-input independent methods can break a self cycle", () => {
    const fixture = {functions: [{id: "a", label: "A"}], primitives: [], methods: [
        {id: "a.loop", label: "Loop", produces: "a", requires: ["a"]},
        {id: "a.free", label: "Independent gift", produces: "a", requires: []},
    ]};
    const graph = expandTarget(fixture, {}, "a");
    assertWitness(graph, {}, checkFeasibility(graph, {}));
});

test("unknown root and rumor are redacted slots without truth IDs or descendants", () => {
    const graph = expandTarget(pack, home, "soap");
    for (const fidelity of [0, 1]) {
        const view = roadmapView(graph, {soap: fidelity});
        assert.deepEqual(view.roots, ["$slot:1"]);
        assert.deepEqual(view.nodes, [{id: "$slot:1", kind: "slot", label: "Unknown requirement", fidelity}]);
        assert.equal(view.nextMissing.reason, "Something is needed here; you don't know what.");
        assert.doesNotMatch(JSON.stringify(view), /soap|alkali|cleansing|available|scale|pruned/);
    }
});

test("unaware alternatives stay hidden even when their descendants are known", () => {
    const graph = expandTarget(pack, home, "soap");
    const view = roadmapView(graph, {soap: 5, "soap.fat": 5, fat: 5, heat: 5, "soap-knowledge": 5,
        "cleansing-plant": 5, "plant-knowledge": 5, water: 5});
    assert.deepEqual(node(view, "soap").alternatives, ["soap.fat"]);
    assert.equal(node(view, "soap.plant"), undefined);
    assert.doesNotMatch(JSON.stringify(view), /soap.plant|cleansing-plant|plant-knowledge|alkali|No cleansing/);
    assert.equal(view.nextMissing.reason, "Something is needed here; you don't know what.");
});

test("a rumored method is an unknown slot and reveals no requirements", () => {
    const graph = expandTarget(pack, home, "soap");
    const view = roadmapView(graph, {soap: 5, "soap.fat": 1, alkali: 5});
    assert.deepEqual(node(view, "soap").alternatives, ["$slot:1"]);
    assert.doesNotMatch(JSON.stringify(view), /soap.fat|alkali|fat|heat/);
});

test("knowledge gaps give plain nextMissing reasons, mastery removes gaps", () => {
    const graph = expandTarget(pack, home, "thermometer");
    assert.equal(roadmapView(graph, {thermometer: 2}).nextMissing.reason, "No method known for thermometer.");
    const knowledge = knowledgeOf(graph);
    knowledge.reference = 3;
    assert.deepEqual(roadmapView(graph, knowledge).nextMissing,
        {id: "reference", reason: "Learn a usable method for calibration reference."});
    assert.equal(roadmapView(graph, knowledgeOf(graph)).nextMissing, null);
});

test("wrong knowledge is displayed as belief with its remembered label, never corrected by truth", () => {
    const graph = expandTarget(pack, home, "lamp"), knowledge = knowledgeOf(graph);
    knowledge.oil = {wrong: true, label: "Remembered lamp fuel"};
    const view = roadmapView(graph, knowledge), belief = node(view, "oil");
    assert.deepEqual(belief, {id: "oil", kind: "primitive", label: "Remembered lamp fuel", fidelity: 2, state: "believed"});
    assert.equal(view.nextMissing, null);
    assert.doesNotMatch(JSON.stringify(view), /wrong|available|missingReason|No lamp oil/);
    knowledge["lamp.oil"] = {wrong: true};
    assert.equal(node(roadmapView(graph, knowledge), "lamp.oil").state, "believed");
});

test("actor view cannot leak stock, world prohibitions or feasibility", () => {
    const graph = expandTarget(pack, home, "soap"), knowledge = knowledgeOf(graph);
    const otherTruth = structuredClone(graph);
    for (const value of otherTruth.nodes) {
        if (value.kind === "primitive") { value.available = !value.available; value.missingReason = "HIDDEN_WORLD_REASON"; }
    }
    otherTruth.pruned.push({id: "HIDDEN_METHOD", product: "soap", reason: "HIDDEN_RULE"});
    assert.deepEqual(roadmapView(graph, knowledge), roadmapView(otherTruth, knowledge));
});

test("knowledge projection terminates and preserves known cyclic edges", () => {
    const graph = expandTarget(loopPack(), {}, "a"), view = roadmapView(graph, knowledgeOf(graph));
    assert.equal(view.nodes.length, 4);
    assert.deepEqual(node(view, "b.loop").requires, ["a"]);
});

test("knowledge fidelity range is validated for visible entries", () => {
    const graph = expandTarget(pack, home, "soap");
    for (const value of [-1, 6, 1.5, {fidelity: 7}]) assert.throws(() => roadmapView(graph, {soap: value}), /fidelity/);
});

test("estimates count unique nodes, dependency-edge depth and shortest-distance width", () => {
    const fixture = {functions: [{id: "goal", label: "Goal", scale: "workshop"}], methods: [
        {id: "method", label: "Method", produces: "goal", requires: ["x", "y"]},
    ], primitives: [{id: "x", label: "X"}, {id: "y", label: "Y"}]};
    assert.deepEqual(estimate(expandTarget(fixture, {}, "goal")), {
        depth: 2, width: 2, nodeCount: 4, byKind: {goal: 1, method: 1, primitive: 2},
        byScale: {person: 2, workshop: 2, town: 0, nation: 0, civilization: 0},
        scale: "workshop", layers: [1, 1, 2], cyclic: false,
    });
});

test("deep abstract target spans every scale band and lands in civilization", () => {
    const graph = expandTarget(pack, home, {function: "release energy", magnitude: "civilization", form: "abstract project"});
    const result = estimate(graph);
    assert.equal(result.scale, "civilization");
    assert.ok(result.depth >= 12);
    assert.ok(result.width >= 4);
    assert.ok(result.nodeCount >= 30);
    for (const band of ["person", "workshop", "town", "nation", "civilization"]) assert.ok(result.byScale[band] > 0);
    assert.equal(Object.values(result.byScale).reduce((a, b) => a + b), result.nodeCount);
    assert.equal(checkFeasibility(graph, home).solvable, false);
    // The deep path shares none of the everyday material/recipe primitives.
    for (const id of ["fat", "ash", "water", "heat", "oil", "sensor", "glass"]) assert.equal(node(graph, id), undefined);
});

test("selecting methods narrows estimates and invalid selections fail visibly", () => {
    const graph = expandTarget(pack, home, "soap"), all = estimate(graph);
    const selected = estimate(graph, {soap: "soap.plant"});
    assert.equal(selected.depth, 2);
    assert.equal(selected.nodeCount, 5);
    assert.ok(selected.nodeCount < all.nodeCount);
    assert.throws(() => estimate(graph, {soap: "lamp.oil"}), /Invalid method choice/);
    assert.throws(() => estimate(graph, {absent: "soap.fat"}), /Invalid method choice/);
});

test("composition merges roots with shared subprojects and primitives once", () => {
    const a = expandTarget(pack, home, "lamp"), b = expandTarget(pack, home, "thermometer");
    const merged = composeTargets(pack, home, "lamp", "thermometer");
    assert.deepEqual(merged.roots, ["lamp", "thermometer"]);
    assert.equal(merged.nodes.filter(value => value.id === "glasswork").length, 1);
    assert.equal(merged.nodes.filter(value => value.id === "glasswork.make").length, 1);
    assert.equal(merged.nodes.filter(value => value.id === "heat").length, 1);
    assert.equal(merged.nodes.length, new Set([...a.nodes, ...b.nodes].map(value => value.id)).size);
    assertWitness(merged, home, checkFeasibility(merged, home));
    assert.deepEqual(composeTargets(pack, home, "lamp", "lamp"), a);
    assert.deepEqual(composeTargets(pack, home, "thermometer", "lamp"), merged);
});

test("every composed root must be feasible", () => {
    const graph = composeTargets(pack, home, "lamp", "energy");
    const result = checkFeasibility(graph, home);
    assert.equal(result.solvable, false);
    assert.equal(result.witness, null);
    assert.ok(result.missingPrimitives.some(value => value.id === "project-mandate"));
});

test("composed shortages exclude missing optional routes under already solved roots", () => {
    const graph = composeTargets(pack, home, "soap", "energy"), result = checkFeasibility(graph, home);
    assert.equal(result.solvable, false);
    assert.ok(!result.missingPrimitives.some(value => ["cleansing-plant", "traded-alkali"].includes(value.id)));
    assert.ok(result.missingPrimitives.some(value => value.id === "project-mandate"));
});

test("deterministic output survives input catalog and requirements reordering", () => {
    const reordered = structuredClone(pack);
    for (const values of [reordered.functions, reordered.methods, reordered.primitives]) values.reverse();
    for (const method of reordered.methods) method.requires.reverse();
    const graph = expandTarget(pack, home, "soap");
    assert.deepEqual(expandTarget(reordered, home, "soap"), graph);
    for (let i = 0; i < 4; i++) {
        assert.deepEqual(expandTarget(pack, home, "soap"), graph);
        assert.deepEqual(checkFeasibility(graph, home), checkFeasibility(graph, home));
        assert.deepEqual(roadmapView(graph, knowledgeOf(graph)), roadmapView(graph, knowledgeOf(graph)));
        assert.deepEqual(estimate(graph), estimate(graph));
        assert.deepEqual(composeTargets(pack, home, "lamp", "thermometer"), composeTargets(pack, home, "lamp", "thermometer"));
    }
});

test("all APIs accept frozen inputs without mutation or returned aliases", () => {
    const inputs = freeze(structuredClone({pack, world: home, target: pack.functions[0].target}));
    const before = structuredClone(inputs);
    const graph = freeze(expandTarget(inputs.pack, inputs.world, inputs.target));
    const graphBefore = structuredClone(graph), knowledge = freeze(knowledgeOf(graph)), choice = freeze({soap: "soap.fat"});
    const result = checkFeasibility(graph, inputs.world), view = roadmapView(graph, knowledge), metrics = estimate(graph, choice);
    const merged = composeTargets(inputs.pack, inputs.world, "lamp", "thermometer");
    assert.deepEqual(inputs, before); assert.deepEqual(graph, graphBefore);
    result.witness.roots.push("new-root"); view.nodes[0].label = "Changed"; metrics.layers.push(100); merged.nodes[0].label = "Changed";
    assert.deepEqual(inputs, before); assert.deepEqual(graph, graphBefore);
    const unfrozen = expandTarget(inputs.pack, inputs.world, inputs.target);
    node(unfrozen, "soap").target.function = "Changed";
    assert.deepEqual(inputs, before);
    const magicalInputs = freeze(structuredClone({pack, world: magicWorld}));
    assertWitness(expandTarget(magicalInputs.pack, magicalInputs.world, "lamp"), magicalInputs.world,
        checkFeasibility(expandTarget(magicalInputs.pack, magicalInputs.world, "lamp"), magicalInputs.world));
});

test("invalid authored IDs, scales and dangling references are rejected", () => {
    const invalid = structuredClone(pack); invalid.primitives.push({id: "soap", label: "Collision"});
    assert.throws(() => expandTarget(invalid, home, "soap"), /Duplicate node ID/);
    const dangling = structuredClone(pack); dangling.methods[0].requires.push("undeclared");
    assert.throws(() => expandTarget(dangling, home, "soap"), /Unknown requirement/);
    const wrongProduct = structuredClone(pack); wrongProduct.methods[0].produces = "undeclared";
    assert.throws(() => expandTarget(wrongProduct, home, "soap"), /Unknown product/);
    const scale = structuredClone(pack); scale.functions[0].scale = "galaxy";
    assert.throws(() => expandTarget(scale, home, "soap"), /Unknown scale/);
    const reserved = structuredClone(pack); reserved.primitives[0].id = "$slot:1";
    assert.throws(() => expandTarget(reserved, home, "soap"), /reserved/);
});
