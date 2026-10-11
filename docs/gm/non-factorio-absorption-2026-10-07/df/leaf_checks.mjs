import assert from 'node:assert/strict';
import {STEAM_DF_IDS as I, steamDFDefinitions as D, steamDFLegacyKnowledge} from '../../../../src/steam_df_content.js';
import {steamDFFacts, validateSteamDFState} from '../../../../src/steam_df_facts.js';
import {guardSteamDFAdmission, stampSteamDFAcceptedJob, steamDFCompletionContext, recordSteamDFStockMutation,
    steamDFCurrentReport, steamDFStockWitness, steamDFReportFromSample, steamDFReportEffects, legacySteamDFReportText} from '../../../../src/steam_df_runtime.js';

const definition = id => D.commands.find(d => d.id === id);
const opening = definition(I.begin).effects.find(e => e.type === 'knowledge');
function fixture() {
    const state = {schema: 11, sequence: 2, clock: 0, pending: [], actors: {
        player: {worldId: I.world, facts: {'feature_objects.introduced': true, [I.enrolled]: true}, completed: {[I.begin]: 1}, resources: {}, sources: {}, techniques: {}},
        [I.owner]: {worldId: I.world, facts: {'feature_objects.willing': true}, completed: {}, resources: {coins: 12}, sources: {}, techniques: {}}},
    worlds: {[I.world]: {facts: {}}}, simulation: {schema: 5,
        people: {player: {inventory: 'native', life: 'alive', location: 'Village'}, [I.owner]: {definitionId: I.owner, inventory: 'simulation', life: 'alive', location: 'Village', body: {hands: 2}, vitals: {health: 18, max_health: 18, stamina: 10, max_stamina: 12}}},
        owners: {[I.owner]: {[I.item]: 2}}, jobs: [], sites: {[I.site]: {owner: I.owner, capacity: 1, reservations: {}}},
        situations: {[I.situation]: {revision: 1}}, knowledge: {player: {'steam.df.opening': {stage: opening.stage, value: opening.value, at: 0, cause: 'simulation:1', basis: opening.basis}}}}};
    const context = {actorId: 'player', targetId: I.owner, steamDFHost: true, nativeAlive: true,
        nativeBody: {form: 'human', ownerId: 'player', controllerId: 'player', hands: 2, mobile: true},
        nativeCareFrame: {clock: 0, calendarMinute: 0, battleRunning: false}, facts: {location: 'Village'},
        gameplay: {player: {inventory: {}}}, vitals: {player: {health: 20, max_health: 20, stamina: 10, max_stamina: 10}}};
    return {state, context};
}
function accept(f, commandId = I.count) {
    const {state, context} = f, d = definition(commandId);
    guardSteamDFAdmission(state, d, context);
    const job = {id: 'simulation:2', sequence: 2, commandId: d.id, revision: d.revision, actorId: 'player', targetId: I.owner,
        due: d.duration, effects: structuredClone(d.effects), costs: structuredClone(d.costs), cancellation: 'refund', reservationReturns: 1,
        siteId: I.site, claim: null, label: d.label, roll: null, outcomeId: null,
        context: {actorId: 'player', targetId: I.owner, partyIds: []}, participants: ['player', I.owner],
        completionSupport: {schema: 1, requires: d.completionRequires, coLocated: true, location: 'Village', failure: 'refund'}};
    stampSteamDFAcceptedJob(state, job, context);
    state.simulation.jobs.push(job); state.simulation.sites[I.site].reservations[job.id] = 'player';
    validateSteamDFState(state);
    return job;
}
function issue(f, job) {
    f.state.clock = job.due;
    assert.equal(steamDFFacts(f.state, steamDFCompletionContext(f.state, job, f.context))['steamDF.sampleCurrent'], true);
    f.state.simulation.jobs = []; delete f.state.simulation.sites[I.site].reservations[job.id];
    for (const e of job.effects) {
        if (e.type === 'fact') f.state.actors.player.facts[e.key] = e.value;
        if (e.type === 'knowledge') f.state.simulation.knowledge.player[e.key] = {stage: e.stage, value: e.value, basis: e.basis, at: f.state.clock, cause: job.id};
    }
    f.state.actors.player.completed[job.commandId] = 1;
    validateSteamDFState(f.state);
}
let checks = 0;
function test(name, fn) {fn(); checks++; console.log(`ok ${checks}: ${name}`);}
test('old optional absence stays inert', () => {
    const state = {actors: {player: {facts: {}, completed: {}}}}, before = structuredClone(state);
    validateSteamDFState(state); assert.deepEqual(state, before);
});
test('native coin, worker effort, timed bench contracts use existing owners', () => {
    assert.deepEqual(definition(I.count).costs, [{type: 'resource', actor: 'player', native: true, key: 'money', amount: -2}, {type: 'vital', actor: I.owner, key: 'stamina', amount: -2}]);
    assert.equal(definition(I.count).duration, 3); assert.equal(definition(I.estimate).duration, 1);
    assert.equal(definition(I.buy).costs[1].count, 2); assert.equal(definition(I.buy).costs[1].from, I.owner); assert.equal(definition(I.buy).costs[1].key, I.item);
});
test('admission rejects untrusted, unwilling, absent, damaged hands and lost bench', () => {
    for (const alter of [f => {f.context.steamDFHost = false;}, f => {f.state.actors[I.owner].facts['feature_objects.willing'] = false;},
        f => {f.state.simulation.people[I.owner].location = 'Shack';}, f => {f.context.nativeBody.hands = 1;}, f => {delete f.state.simulation.sites[I.site];}]) {
        const f = fixture(); alter(f); assert.throws(() => guardSteamDFAdmission(f.state, definition(I.count), f.context));
    }
});
test('accepted full sample and exact job survive JSON serialization', () => {
    const f = fixture(), job = accept(f);
    assert.equal(job.steamDFSample.amount, 2); assert.equal(job.steamDFSample.sampledAt, 0);
    validateSteamDFState(JSON.parse(JSON.stringify(f.state)));
    for (const alter of [j => {j.costs[0].amount = -1;}, j => {j.effects[0].amount = 9;}, j => {j.participants.pop();},
        j => {j.steamDFSample.extra = true;}, j => {j.due++;}, j => {j.completionSupport.requires = null;}]) {
        const bad = structuredClone(f.state); alter(bad.simulation.jobs[0]); assert.throws(() => validateSteamDFState(bad));
    }
});
test('estimate discloses a bracket without hidden accepted amount', () => {
    const f = fixture(), job = accept(f, I.estimate); issue(f, job);
    const r = JSON.parse(f.state.actors.player.facts[I.report]);
    assert.equal(r.amount, undefined); assert.equal(r.lower, 0); assert.equal(r.upper, 2);
    assert.equal(f.state.simulation.knowledge.player[I.report].at, 1);
    assert.throws(() => guardSteamDFAdmission(f.state, definition(I.buy), f.context));
});
test('current exact report supports an actual pair and retains issue time', () => {
    const f = fixture(), job = accept(f); issue(f, job);
    assert.equal(steamDFCurrentReport(f.state).currentPair, true);
    assert.equal(f.state.simulation.knowledge.player[I.report].at, 3);
    assert.equal(JSON.parse(f.state.actors.player.facts[I.report]).sampledAt, 0);
    guardSteamDFAdmission(f.state, definition(I.buy), f.context);
    validateSteamDFState(JSON.parse(JSON.stringify(f.state)));
});
test('remove and return to same amount never resurrects the old report', () => {
    const f = fixture(), job = accept(f); issue(f, job);
    f.state.sequence = 3; f.state.simulation.owners[I.owner][I.item] = 1;
    assert.equal(recordSteamDFStockMutation(f.state, 2, 'simulation:3'), true);
    f.state.sequence = 4; f.state.simulation.owners[I.owner][I.item] = 2;
    recordSteamDFStockMutation(f.state, 1, 'simulation:4');
    assert.equal(steamDFStockWitness(f.state).revision, 2); assert.equal(steamDFCurrentReport(f.state).current, false);
    assert.throws(() => guardSteamDFAdmission(f.state, definition(I.buy), f.context)); validateSteamDFState(f.state);
});
test('mutation during work loses accepted sample support without changing frozen evidence', () => {
    const f = fixture(), job = accept(f), frozen = structuredClone(job);
    f.state.simulation.owners[I.owner][I.item] = 1; recordSteamDFStockMutation(f.state, 2, 'simulation:3');
    assert.equal(steamDFFacts(f.state, steamDFCompletionContext(f.state, job, f.context))['steamDF.sampleCurrent'], false);
    assert.deepEqual(job, frozen); validateSteamDFState(f.state);
});
test('report tampering and foreign namespaces are rejected', () => {
    const f = fixture(), job = accept(f); issue(f, job);
    for (const alter of [s => {s.simulation.knowledge.player[I.report].at = 2;}, s => {delete s.simulation.knowledge.player[I.report];},
        s => {s.actors.player.facts['steam.df.secret'] = 2;}, s => {s.actors[I.owner].facts[I.report] = s.actors.player.facts[I.report];},
        s => {s.actors.player.facts[I.report] = JSON.stringify({...JSON.parse(s.actors.player.facts[I.report]), extra: true});},
        s => {s.simulation.programs = {player: {commandId: I.count}};}]) {
        const bad = structuredClone(f.state); alter(bad); assert.throws(() => validateSteamDFState(bad));
    }
});
test('existing stock witness alone does not force optional enrollment', () => {
    const f = fixture(); delete f.state.actors.player.facts[I.enrolled]; delete f.state.actors.player.completed[I.begin]; f.state.simulation.knowledge.player = {};
    f.state.simulation.owners[I.owner][I.item] = 1; recordSteamDFStockMutation(f.state, 2, 'simulation:2'); validateSteamDFState(f.state);
});
test('unchanged effect is inert and maximal safe count estimate remains valid', () => {
    const f = fixture(), before = structuredClone(f.state); assert.equal(recordSteamDFStockMutation(f.state, 2, 'simulation:2'), false); assert.deepEqual(f.state, before);
    const r = steamDFReportFromSample({amount: Number.MAX_SAFE_INTEGER, sampledAt: 0, witness: steamDFStockWitness(f.state)}, 'estimate', 'simulation:2');
    assert.ok(Number.isSafeInteger(r.upper)); assert.ok(r.upper >= r.lower);
});
test('older wording preserves pending reservations and issued report authority', () => {
    const f = fixture(), job = accept(f);
    f.state.simulation.knowledge.player['steam.df.opening'].value = steamDFLegacyKnowledge['steam.df.opening'];
    job.effects = steamDFReportEffects(job.steamDFSample, definition(I.count), job.id, {legacy: true});
    validateSteamDFState(JSON.parse(JSON.stringify(f.state)));
    issue(f, job);
    assert.equal(steamDFCurrentReport(f.state).currentPair, true);
    const r = JSON.parse(f.state.actors.player.facts[I.report]);
    assert.equal(f.state.simulation.knowledge.player[I.report].value, legacySteamDFReportText(r));
    const bad = structuredClone(f.state); bad.simulation.knowledge.player[I.report].value += ' invented';
    assert.throws(() => validateSteamDFState(bad));
});
console.log(`${checks} bounded DF leaf checks passed. These do not execute shared scheduler/native publication or browser save IO.`);
