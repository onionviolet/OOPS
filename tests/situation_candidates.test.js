import test from "node:test";
import assert from "node:assert/strict";
import {address} from "../src/gen_kit.js";
import {pressureSituationGenerator, situationCandidates} from "../src/situation_candidates.js";
import {directWindow} from "../src/story_director.js";
import {applySimulationEffects} from "../src/simulation_effects.js";
import {createSimulationRegistry, createSimulationState} from "../src/simulation_contracts.js";
import {validateSituations} from "../src/causal_situations.js";
import {buildEventBook, happenedOn} from "../src/world_events.js";

const context = {worldId: "harbor", instanceId: "harbor.main", continuityId: "harbor.branch", eraId: "steam", regionId: "east_dock"};
const eligibleActors = ["miller", "keeper", "bystander"].map(id => ({id, context}));
const director = {
    id: "harbor.director", categories: {scarcity: {weight: 1, hold: 0}},
    quiet: 0, tensionQuiet: 0, dry: {after: 2, relief: 0.5, floor: 0},
    cooldown: 0, attempts: 1,
};

function fixture() {
    const simulation = createSimulationState(73);
    simulation.people = Object.fromEntries(eligibleActors.map(({id}) => [id, {life: "alive"}]));
    const actors = Object.fromEntries(eligibleActors.map(({id}) => [id, {worldId: context.worldId}]));
    // The keeper's actual stock and the miller's current order supply the reading.
    actors.keeper.resources = {grain: 2};
    actors.miller.resources = {grainOrdered: 5};
    return {clock: 10, simulation, actors, worlds: {harbor: {}}};
}

function scarcity(state, overrides = {}) {
    return {
        context, sourceId: "grain.order", authorityId: "dock.market", episodeId: "order.47",
        category: "scarcity", participantIds: ["miller", "keeper"], clock: state.clock,
        magnitude: state.actors.miller.resources.grainOrdered - state.actors.keeper.resources.grain,
        responseWindow: 4, ...overrides,
    };
}

function surface(state, pool) {
    return directWindow(director, state.simulation.seed, state.clock, pool, {
        facts: {clock: state.clock, situations: state.simulation.situations},
    });
}

test("a measured grain shortage reaches the situation effect beside a fixed point in the event book", () => {
    const state = fixture();
    const book = buildEventBook([{
        id: "harbor.toll", key: "harbor.toll.notice", kind: "public_event",
        placement: "dated", scope: "public", evidence: "S", when: {day: 2},
    }]);
    const reading = scarcity(state);
    const before = structuredClone(state);
    const [candidate] = situationCandidates({readings: [reading], eligibleActors, budget: 1});
    assert.deepEqual(state, before);
    assert.equal(candidate.clock, 10);
    assert.equal(candidate.address, address("situation.pressure", 1, "harbor", "harbor.main", "harbor.branch", "steam", "east_dock", "dock.market", "grain.order", "order.47"));
    assert.equal(surface(state, []).surfaced, null);
    assert.equal(happenedOn(book, 2)[0].id, "harbor.toll");
    const {surfaced} = surface(state, [candidate]);
    assert.equal(surfaced, candidate);
    const simulationRegistry = createSimulationRegistry({situationGenerators: [pressureSituationGenerator]});
    const registry = {simulation: simulationRegistry};
    assert.throws(() => applySimulationEffects({state}, [surfaced.effect], {actorId: "keeper"},
        {simulation: createSimulationRegistry()}, surfaced.cause), /Unknown situation generator/);
    assert.deepEqual(state, before);
    applySimulationEffects({state}, [surfaced.effect], {actorId: "keeper"}, registry, surfaced.cause);

    const opened = state.simulation.situations[candidate.id];
    assert.equal(state.simulation.schema, 3);
    assert.equal(opened.revision, 1);
    assert.deepEqual(opened.context, context);
    assert.deepEqual(opened.participants, ["keeper", "miller"]);
    assert.deepEqual(opened.privateTruth, {
        authorityId: "dock.market", sourceId: "grain.order", episodeId: "order.47", magnitude: 3, readAt: 10,
    });
    assert.equal(opened.deadline, 14);
    assert.equal(opened.cause, candidate.cause);
    assert.deepEqual(opened.receipts, [{from: null, to: "open", at: 10, cause: candidate.cause}]);
    assert.deepEqual(happenedOn(book, 2).map(event => event.id), ["harbor.toll"]);

    const restored = JSON.parse(JSON.stringify(state));
    const validate = (candidateState, content) => validateSituations(candidateState.simulation, candidateState, content, id => {
        assert.ok(restored.simulation.people[id] && restored.actors[id]);
    });
    validate(restored, simulationRegistry);
    assert.throws(() => validate(restored, createSimulationRegistry()), /Unknown situation generator/);
    const altered = structuredClone(restored);
    altered.simulation.situations[candidate.id].privateTruth.episodeId = "unrelated.order";
    assert.throws(() => validate(altered, simulationRegistry), /cause disagrees/);
    assert.deepEqual(restored.simulation.situations, state.simulation.situations);
    const retry = surface(restored, [candidate]);
    assert.equal(retry.surfaced, null);
    assert.deepEqual(retry.receipt.rejected.map(row => row.id), [candidate.id]);

    restored.clock++;
    const [freshQuote] = situationCandidates({readings: [scarcity(restored)], eligibleActors, budget: 1});
    assert.equal(freshQuote.cause, candidate.cause);
    assert.equal(surface(restored, [freshQuote]).surfaced, null);
    assert.deepEqual(situationCandidates({
        readings: [scarcity(restored)], eligibleActors, situations: restored.simulation.situations, budget: 1,
    }), []);
    assert.deepEqual(restored.simulation.situations[candidate.id].receipts, opened.receipts);
});

test("missing pressure or participating actors cannot produce a candidate", () => {
    const state = fixture();
    const reading = scarcity(state);
    assert.deepEqual(situationCandidates({eligibleActors, budget: 1}), []);
    assert.deepEqual(situationCandidates({readings: [reading], budget: 1}), []);
    assert.deepEqual(situationCandidates({readings: [reading], eligibleActors: eligibleActors.slice(0, 1), budget: 1}), []);
    const otherBranch = {...context, continuityId: "harbor.other"};
    const displaced = [eligibleActors[0], {...eligibleActors[1], context: otherBranch}];
    assert.deepEqual(situationCandidates({readings: [reading], eligibleActors: displaced, budget: 1}), []);
    state.actors.keeper.resources.grain = 5;
    assert.deepEqual(situationCandidates({readings: [scarcity(state)], eligibleActors, budget: 1}), []);
});

test("the budget is deterministic and addresses separate distinct episodes and histories", () => {
    const state = fixture();
    const first = scarcity(state);
    const next = scarcity(state, {episodeId: "order.48"});
    const otherContext = {...context, continuityId: "harbor.other"};
    const other = scarcity(state, {context: otherContext});
    const refs = [...eligibleActors, ...eligibleActors.map(actor => ({...actor, context: otherContext}))];
    const readings = [first, next, other];
    const select = (budget, rows = readings, eligible = refs) => situationCandidates({readings: rows, eligibleActors: eligible, budget});
    assert.deepEqual(select(0), []);
    const all = select(3);
    assert.equal(new Set(all.map(c => c.cause)).size, 3);
    assert.equal(new Set(all.map(c => c.address)).size, 3);
    const payloads = candidates => candidates.map(({recheck, ...payload}) => payload);
    assert.deepEqual(payloads(select(2)), payloads(all.slice(0, 2)));
    assert.deepEqual(payloads(select(2, [...readings].reverse(), [...refs].reverse())), payloads(select(2)));
    const delayed = surface({...state, clock: state.clock + 1}, [all[0]]);
    assert.equal(delayed.surfaced, null);
    assert.equal(delayed.receipt.rejected[0].id, all[0].id);
});
