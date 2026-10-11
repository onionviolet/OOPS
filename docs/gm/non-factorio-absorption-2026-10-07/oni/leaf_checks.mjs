import assert from 'node:assert/strict';
import {STEAM_ONI_IDS as I, STEAM_ONI_KEYS as K, steamONIDefinitions as D} from '../../../../src/steam_oni_content.js';
import {steamONIFacts, validateSteamONIState} from '../../../../src/steam_oni_facts.js';
import {guardSteamONIAdmission, stampSteamONIAcceptedJob, steamONICompletionContext} from '../../../../src/steam_oni_runtime.js';
import {commitSteamONICommand, steamONIPresentation} from '../../../../src/steam_oni_host.js';
import {createSimulationRegistry, validateSimulationState, meets} from '../../../../src/simulation_contracts.js';
import {applySimulationEffects, refundCosts} from '../../../../src/simulation_effects.js';
import {bodyConditions} from '../../../../src/body_progression.js';

const registry = {worlds: new Map([[I.world, {}]]), sources: new Map(), techniques: new Map(), simulation: createSimulationRegistry({...D, conditions: bodyConditions})};
const definition = id => D.commands.find(d => d.id === id);
const domain = () => ({facts: {}, resources: {}, completed: {}, sources: {}, techniques: {}});
function coldFixture() {
    const state = {schema: 11, sequence: 1, clock: 0, pending: [], rng: 13, campaign: domain(), journey: domain(),
        actors: {player: {...domain(), worldId: I.world}}, worlds: {[I.world]: domain()}};
    const context = {actorId: 'player', targetId: null, steamONIHost: true, nativeAlive: true, busy: false,
        nativeBody: {form: 'human', ownerId: 'player', controllerId: 'player', hands: 2, mobile: true},
        nativeCareFrame: {clock: 0, calendarMinute: 0, underRoof: true, battleRunning: false}, facts: {location: 'Shack', 'village.shackUnlocked': true},
        gameplay: {player: {inventory: {[K.log]: 4, [K.herbs]: 3, [K.sap]: 3}, skills: {}, reputation: {}}},
        vitals: {player: {health: 20, max_health: 20, stamina: 20, max_stamina: 20}}, equipment: {player: {}}, external: {money: 20}};
    return {state, context};
}
function fixture() {
    const f = coldFixture();
    const out = commitSteamONICommand(f.state, registry, {type: I.group, id: I.begin, sequence: 1}, f.context);
    const context = {...f.context, gameplay: out.gameplay, external: out.external, vitals: out.vitals, equipment: out.equipment};
    validateSteamONIState(out.state, registry); validateSimulationState(out.state.simulation, out.state, registry.simulation);
    return {state: out.state, context, out};
}
function quote(f, commandId) {
    const d = definition(commandId);
    guardSteamONIAdmission(f.state, d, f.context);
    assert.ok(meets(d.requires, {...f.context.facts, ...steamONIFacts(f.state, f.context)}), 'Current nursery requirements must hold.');
    return d;
}
function accept(f, commandId) {
    const d = quote(f, commandId), s = f.state.simulation, cause = `simulation:${++f.state.sequence}`;
    s.schema = Math.max(s.schema, 4); // Existing reservationReturns/completionSupport scheduler contract.
    applySimulationEffects(f.out, d.costs, f.context, registry, cause, {spending: true});
    const job = {id: cause, sequence: f.state.sequence, commandId: d.id, revision: d.revision, actorId: 'player', targetId: null,
        due: f.state.clock + d.duration, effects: structuredClone(d.effects), costs: structuredClone(d.costs), cancellation: 'refund', reservationReturns: 1,
        siteId: d.siteId || null, claim: null, label: d.label, roll: null, outcomeId: null,
        context: {actorId: 'player', targetId: null, partyIds: []}, participants: ['player'],
        completionSupport: {schema: 1, requires: d.completionRequires, coLocated: false, location: 'Shack', failure: 'refund'}};
    stampSteamONIAcceptedJob(f.state, job, f.context);
    s.jobs.push(job); if (job.siteId) s.sites[job.siteId].reservations[job.id] = 'player';
    validateSteamONIState(f.state, registry); validateSimulationState(s, f.state, registry.simulation);
    return job;
}
function finish(f, job) {
    f.state.clock = job.due;
    const context = steamONICompletionContext(f.state, job, {...f.context, ...job.context});
    const supported = meets(job.completionSupport.requires, {...context.facts, ...steamONIFacts(f.state, context)});
    f.state.simulation.jobs = []; if (job.siteId) delete f.state.simulation.sites[job.siteId].reservations[job.id];
    if (supported) {
        applySimulationEffects(f.out, job.effects, context, registry, job.id);
        const a = f.state.actors.player; a.completed[job.commandId] = (a.completed[job.commandId] || 0) + 1;
    } else applySimulationEffects(f.out, refundCosts(job.costs, true), job.context, registry, `unsupported:${++f.state.sequence}`);
    validateSteamONIState(f.state, registry); validateSimulationState(f.state.simulation, f.state, registry.simulation);
    return supported;
}
function cancel(f, job) {
    applySimulationEffects(f.out, refundCosts(job.costs, true), job.context, registry, `cancel:${++f.state.sequence}`);
    f.state.simulation.jobs = []; if (job.siteId) delete f.state.simulation.sites[job.siteId].reservations[job.id];
    validateSteamONIState(f.state, registry); validateSimulationState(f.state.simulation, f.state, registry.simulation);
}
const means = f => structuredClone({gameplay: f.out.gameplay, vitals: f.out.vitals, external: f.out.external});
let checks = 0;
function test(name, fn) {fn(); console.log(`ok ${++checks}: ${name}`);}
test('old absence and cold UI projection are inert; explicit opening enrolls without Eda', () => {
    const f = coldFixture(), before = structuredClone(f);
    validateSteamONIState(f.state); steamONIFacts(f.state, f.context);
    const view = steamONIPresentation(f.state, registry, f.context);
    assert.equal(view.sections[0].actions[0].eligible, true); assert.deepEqual(f, before);
    const opened = fixture(); assert.equal(opened.state.simulation.people.player.location, 'Shack');
    assert.deepEqual(Object.keys(opened.state.actors), ['player']); assert.equal(opened.state.simulation.sites[I.site], undefined);
    assert.equal(opened.state.schema, 11); assert.equal(opened.state.simulation.schema, 3);
    assert.equal(opened.state.simulation.situations[I.situation].cause, opened.state.simulation.knowledge.player[`${I.prefix}plan`].cause);
    assert.equal(opened.out.acquisitions.length, 0);
    assert.throws(() => commitSteamONICommand(opened.state, registry, {type: I.group, id: I.begin}, opened.context));
});
test('only completed paid four-minute construction creates the empty owned tray', () => {
    const f = fixture(), job = accept(f, I.build);
    assert.equal(job.siteId, null); assert.equal(job.due, 4); assert.equal(f.out.external.money, 18);
    assert.equal(f.out.gameplay.player.inventory[K.log], 2); assert.equal(f.out.vitals.player.stamina, 19);
    assert.equal(f.state.simulation.sites[I.site], undefined); assert.equal(f.out.gameplay.player.inventory[K.herbs], 3);
    assert.equal(finish(f, job), true);
    assert.deepEqual(f.state.simulation.sites[I.site], {capacity: 1, reservations: {}, owner: 'player'});
    assert.equal(f.out.acquisitions.length, 0); assert.throws(() => quote(f, I.build));
});
test('two explicit rounds spend both new inputs and create counted native Cooking herbs', () => {
    const f = fixture(); finish(f, accept(f, I.build));
    for (let round = 1; round <= 2; round++) {
        const before = f.out.gameplay.player.inventory[K.herbs], sap = f.out.gameplay.player.inventory[K.sap], effort = f.out.vitals.player.stamina;
        const job = accept(f, I.cycle); assert.equal(job.due - f.state.clock, 5);
        assert.equal(f.out.gameplay.player.inventory[K.herbs], before - 1); assert.equal(f.out.gameplay.player.inventory[K.sap], sap - 1);
        assert.equal(f.out.vitals.player.stamina, effort - 1); assert.equal(finish(f, job), true);
        assert.equal(f.out.gameplay.player.inventory[K.herbs], before + 1); assert.equal(f.state.actors.player.completed[I.cycle], round);
    }
    assert.deepEqual(f.out.acquisitions, [{owner: 'player', key: K.herbs, count: 2}, {owner: 'player', key: K.herbs, count: 2}]);
    assert.equal(f.state.clock, 14); validateSteamONIState(JSON.parse(JSON.stringify(f.state)), registry);
});
test('a completed tray gives no free renewal; either missing input blocks the next round', () => {
    for (const key of [K.herbs, K.sap]) {
        const f = fixture(); finish(f, accept(f, I.build)); delete f.out.gameplay.player.inventory[key];
        const before = means(f); assert.throws(() => quote(f, I.cycle)); assert.deepEqual(means(f), before);
    }
    const f = fixture(); assert.throws(() => quote(f, I.cycle));
});
test('admission rejects unsupported roof, body, hands, health, battles and session frames', () => {
    for (const alter of [f => {f.context.nativeCareFrame.underRoof = false;}, f => {f.context.facts['village.shackUnlocked'] = false;},
        f => {f.context.facts.location = 'Village';}, f => {f.context.nativeAlive = false;}, f => {f.context.nativeBody.hands = 1;},
        f => {f.context.nativeBody.controllerId = 'another';}, f => {f.out.vitals.player.health = 1;},
        f => {f.context.nativeCareFrame.battleRunning = true;}, f => {f.state.realmPrototype = {activeVisitId: 'visit'};},
        f => {f.state.chronicle = {session: {}};}, f => {f.state.simulation.conditions.player = {'body.sore_hands': {intensity: 1, expiresAt: 20, cause: 'test'}};},
        f => {f.context.steamONIHost = false;}]) {
        const f = fixture(); alter(f); assert.throws(() => quote(f, I.build));
    }
});
test('borrowed or equipped inputs cannot become nursery stock', () => {
    for (const alter of [f => {f.state.simulation.custody.borrowed = {holder: 'player', key: K.log};},
        f => {f.context.equipment.player.hand = K.log;}]) {
        const f = fixture(); alter(f); assert.throws(() => quote(f, I.build));
    }
    for (const key of [K.herbs, K.sap]) {
        const f = fixture(); finish(f, accept(f, I.build)); f.state.simulation.custody.borrowed = {holder: 'player', key};
        assert.throws(() => quote(f, I.cycle));
    }
});
test('canceled construction refunds exact logs, coins and stamina, creating no site', () => {
    const f = fixture(), before = means(f), job = accept(f, I.build); cancel(f, job);
    assert.deepEqual(means(f), before); assert.equal(f.state.simulation.sites[I.site], undefined);
    assert.equal(f.state.actors.player.completed[I.build], undefined); assert.equal(f.out.acquisitions.length, 0);
});
test('canceled round refunds both inputs and stamina once; completed tray persists empty', () => {
    const f = fixture(); finish(f, accept(f, I.build)); const before = means(f), job = accept(f, I.cycle);
    cancel(f, job); assert.deepEqual(means(f), before);
    assert.deepEqual(f.state.simulation.sites[I.site], {capacity: 1, reservations: {}, owner: 'player'});
    assert.equal(f.state.actors.player.completed[I.cycle], undefined); assert.equal(f.out.acquisitions.length, 0);
});
test('lost roof, location, hands or living support refunds build without a tray', () => {
    for (const alter of [f => {f.context.nativeCareFrame.underRoof = false;}, f => {f.context.facts.location = 'Village';},
        f => {f.context.nativeBody.hands = 1;}, f => {f.context.nativeAlive = false;}]) {
        const f = fixture(), before = means(f), job = accept(f, I.build); alter(f);
        assert.equal(finish(f, job), false); assert.deepEqual(means(f), before); assert.equal(f.state.simulation.sites[I.site], undefined);
    }
});
test('lost sheltered round support refunds its inputs, yields no harvest and keeps the tray', () => {
    const f = fixture(); finish(f, accept(f, I.build)); const before = means(f), job = accept(f, I.cycle);
    f.context.nativeCareFrame.underRoof = false; assert.equal(finish(f, job), false); assert.deepEqual(means(f), before);
    assert.equal(f.state.actors.player.completed[I.cycle], undefined); assert.equal(f.out.acquisitions.length, 0);
    assert.deepEqual(f.state.simulation.sites[I.site], {capacity: 1, reservations: {}, owner: 'player'});
});
test('pending exact contracts survive JSON; cost, output, duration and support tampering fail', () => {
    for (const id of [I.build, I.cycle]) {
        const f = fixture(); if (id === I.cycle) finish(f, accept(f, I.build)); accept(f, id);
        validateSteamONIState(JSON.parse(JSON.stringify(f.state)), registry);
        for (const alter of [j => {j.costs[0].amount = -9;}, j => {j.effects.pop();}, j => {j.due--;},
            j => {j.participants.push('oldCraftsman');}, j => {j.steamONIWork.extra = true;},
            j => {j.completionSupport.requires = null;}, j => {j.reservationReturns = 0;}]) {
            const bad = structuredClone(f.state); alter(bad.simulation.jobs[0]); assert.throws(() => validateSteamONIState(bad, registry));
        }
    }
});
test('orphan sites, forged completion/history, foreign ownership and automation are rejected', () => {
    const f = fixture(); finish(f, accept(f, I.build)); finish(f, accept(f, I.cycle));
    for (const alter of [s => {delete s.actors.player.completed[I.build];}, s => {s.actors.player.completed[I.build] = 2;},
        s => {s.actors.player.completed[I.cycle] = 2;}, s => {s.simulation.knowledge.player[`${I.prefix}harvest`].value = 'free herbs';},
        s => {delete s.simulation.knowledge.player[`${I.prefix}plan`];}, s => {s.simulation.sites[I.site].owner = 'someone_else';},
        s => {s.simulation.sites[I.site].capacity = 2;}, s => {s.simulation.programs.player = {commandId: I.cycle};},
        s => {s.simulation.situations[I.situation].receipts[0].cause = 'simulation:999';},
        s => {s.simulation.situations[I.situation].privateTruth.renewalPolicy = 'free_stock';},
        s => {s.simulation.situations[I.situation].participants.push('oldCraftsman');},
        s => {s.worlds[I.world].facts[I.built] = true;}]) {
        const bad = structuredClone(f.state); alter(bad); assert.throws(() => validateSteamONIState(bad, registry));
    }
    const old = coldFixture().state; old.simulation = {sites: {[I.site]: {capacity: 1, reservations: {}, owner: 'player'}}};
    assert.throws(() => validateSteamONIState(old));
});
test('current simulation5 envelopes keep their schema through a new paid round', () => {
    const f = fixture(); f.state.simulation.schema = 5; finish(f, accept(f, I.build)); finish(f, accept(f, I.cycle));
    assert.equal(f.state.schema, 11); assert.equal(f.state.simulation.schema, 5);
    validateSteamONIState(JSON.parse(JSON.stringify(f.state)), registry);
});
test('Nell finite plot data and unrelated retained history stay untouched', () => {
    const f = fixture();
    f.state.actors.player.facts['remainder_consequences.plot.finished'] = true;
    f.state.simulation.knowledge.player.other_note = {stage: 'seen', value: 'Earlier day', at: 0, cause: 'test'};
    const prior = structuredClone({finished: f.state.actors.player.facts['remainder_consequences.plot.finished'], known: f.state.simulation.knowledge.player.other_note});
    finish(f, accept(f, I.build)); finish(f, accept(f, I.cycle));
    assert.deepEqual({finished: f.state.actors.player.facts['remainder_consequences.plot.finished'], known: f.state.simulation.knowledge.player.other_note}, prior);
    assert.ok(D.commands.every(d => d.effects.every(e => !String(e.key || e.situationId || '').includes('remainder_consequences'))));
});
console.log(`${checks} bounded ONI checks passed. Cold opening uses the real enrollment/command host; work checks use the real shared effect/refund reducer. Shared scheduled ticking, native publication and browser/save IO remain root gates.`);
