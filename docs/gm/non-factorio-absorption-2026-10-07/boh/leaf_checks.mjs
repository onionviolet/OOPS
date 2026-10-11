import assert from 'node:assert/strict';
import {STEAM_BOH_IDS as I, STEAM_BOH_KEYS as K, steamBOHDefinitions as D} from '../../../../src/steam_boh_content.js';
import {steamBOHFacts, validateSteamBOHState} from '../../../../src/steam_boh_facts.js';
import {guardSteamBOHAdmission, stampSteamBOHAcceptedJob, steamBOHCompletionContext} from '../../../../src/steam_boh_runtime.js';
import {featureObjectDefinitions as O, featureObjectSources} from '../../../../src/feature_expansion_objects.js';
import {createSimulationRegistry, createSimulationState, validateSimulationState, meets} from '../../../../src/simulation_contracts.js';
import {applySimulationEffects, refundCosts} from '../../../../src/simulation_effects.js';
import {bodyConditions} from '../../../../src/body_progression.js';

const registry = {worlds: new Map([[I.world, {}]]), sources: new Map(featureObjectSources.map(d => [d.id, d])), simulation: createSimulationRegistry({
    commands: D.commands, conditions: [...D.conditions, ...bodyConditions], people: O.people, sites: O.sites, situations: O.situations, powers: O.powers})};
const definition = id => D.commands.find(d => d.id === id);
const domain = () => ({facts: {}, resources: {}, completed: {}, sources: {}, techniques: {}});
function fixture() {
    const state = {schema: 11, sequence: 1, clock: 0, pending: [], rng: 13, campaign: domain(), journey: domain(), actors: {player: {...domain(), worldId: I.world}}, worlds: {[I.world]: domain()}, simulation: createSimulationState(13)};
    state.simulation.schema = 5;
    state.simulation.enrolledAt = 0;
    state.simulation.people.player = {inventory: 'native', life: 'alive', location: 'Village', bornAt: 0};
    const context = {actorId: 'player', targetId: null, steamBOHHost: true, nativeAlive: true,
        nativeBody: {form: 'human', ownerId: 'player', controllerId: 'player', hands: 2, mobile: true},
        nativeCareFrame: {clock: 0, calendarMinute: 0, battleRunning: false}, facts: {location: 'Village'},
        gameplay: {player: {inventory: {[K.manual]: 1, [K.sound]: 3, [K.sap]: 1, [K.sharp]: 1, [K.fine]: 1, [K.paper]: 1, [K.ink]: 1}}},
        vitals: {player: {health: 20, max_health: 20, stamina: 20, max_stamina: 20}}, equipment: {player: {}}, external: {money: 20}};
    const out = {state, gameplay: context.gameplay, external: context.external, vitals: context.vitals, equipment: context.equipment, acquisitions: [], unlocks: []};
    applySimulationEffects(out, O.commands.find(d => d.id === 'feature_objects.begin').effects, context, registry, 'simulation:1');
    state.actors.player.completed['feature_objects.begin'] = 1;
    context.facts['actor.feature_objects.introduced'] = true;
    context.targetId = I.owner;
    guardSteamBOHAdmission(state, definition(I.begin), context);
    applySimulationEffects(out, definition(I.begin).effects, context, registry, 'simulation:2');
    state.sequence = 2; state.actors.player.completed[I.begin] = 1;
    validateSteamBOHState(state, registry); validateSimulationState(state.simulation, state, registry.simulation);
    out.acquisitions.length = 0; out.unlocks.length = 0;
    return {state, context, out};
}
function quote(f, commandId) {
    const d = definition(commandId), context = {...f.context, targetId: d.targetId || null};
    guardSteamBOHAdmission(f.state, d, context);
    assert.ok(meets(d.requires, {...context.facts, ...steamBOHFacts(f.state, context, registry)}), 'Actual clearance requirements must hold.');
    return {d, context};
}
function accept(f, commandId) {
    const {d, context} = quote(f, commandId), s = f.state.simulation, cause = `simulation:${++f.state.sequence}`;
    applySimulationEffects(f.out, d.costs, context, registry, cause, {spending: true});
    const job = {id: cause, sequence: f.state.sequence, commandId: d.id, revision: d.revision, actorId: 'player', targetId: d.targetId || null,
        due: f.state.clock + d.duration, effects: structuredClone(d.effects), costs: structuredClone(d.costs), cancellation: 'refund', reservationReturns: 1,
        siteId: d.siteId || null, claim: null, label: d.label, roll: null, outcomeId: null,
        context: {actorId: 'player', targetId: d.targetId || null, partyIds: []}, participants: d.targetId ? ['player', I.owner] : ['player'],
        completionSupport: {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: 'Village', failure: 'refund'}};
    stampSteamBOHAcceptedJob(f.state, job, context);
    s.jobs.push(job); if (job.siteId) s.sites[job.siteId].reservations[job.id] = 'player';
    validateSteamBOHState(f.state, registry); validateSimulationState(s, f.state, registry.simulation);
    return job;
}
function expire(f) {
    const conditions = f.state.simulation.conditions.player || {};
    for (const [id, c] of Object.entries(conditions)) if (c.expiresAt <= f.state.clock) delete conditions[id];
}
function finish(f, job) {
    f.state.clock = job.due; expire(f);
    const context = steamBOHCompletionContext(f.state, job, {...f.context, ...job.context});
    const supported = meets(job.completionSupport.requires, {...context.facts, ...steamBOHFacts(f.state, context, registry)});
    f.state.simulation.jobs = []; if (job.siteId) delete f.state.simulation.sites[job.siteId].reservations[job.id];
    if (supported) {
        applySimulationEffects(f.out, job.effects, context, registry, job.id);
        const a = f.state.actors.player; a.completed[job.commandId] = (a.completed[job.commandId] || 0) + 1;
    } else applySimulationEffects(f.out, refundCosts(job.costs, true), job.context, registry, `unsupported:${++f.state.sequence}`);
    validateSteamBOHState(f.state, registry); validateSimulationState(f.state.simulation, f.state, registry.simulation);
    return supported;
}
function cancel(f, job) {
    applySimulationEffects(f.out, refundCosts(job.costs, true), job.context, registry, `cancel:${++f.state.sequence}`);
    f.state.simulation.jobs = []; if (job.siteId) delete f.state.simulation.sites[job.siteId].reservations[job.id];
    validateSteamBOHState(f.state, registry); validateSimulationState(f.state.simulation, f.state, registry.simulation);
}
let checks = 0;
function test(name, fn) {fn(); console.log(`ok ${++checks}: ${name}`);}
test('old absence is inert and pure projection mutates nothing', () => {
    const old = {actors: {player: {facts: {}, completed: {}}}}, copy = structuredClone(old);
    validateSteamBOHState(old); steamBOHFacts(old); assert.deepEqual(old, copy);
    const f = fixture(), before = structuredClone(f); steamBOHFacts(f.state, f.context); validateSteamBOHState(f.state, registry); assert.deepEqual(f, before);
});
test('copy spends native paper/ink, worker effort, money and real time', () => {
    const f = fixture(), coins = f.state.actors[I.owner].resources.coins, effort = f.state.simulation.people[I.owner].vitals.stamina;
    const job = accept(f, I.copy); assert.equal(job.due, 3); assert.equal(f.out.gameplay.player.inventory[K.paper] || 0, 0);
    assert.equal(f.out.gameplay.player.inventory[K.ink] || 0, 0); assert.equal(f.out.external.money, 18);
    assert.equal(f.state.simulation.people[I.owner].vitals.stamina, effort - 1); assert.equal(f.out.gameplay.player.inventory[K.manual], 1);
    assert.equal(finish(f, job), true); assert.equal(f.out.gameplay.player.inventory[K.manual], 2); assert.equal(f.state.actors[I.owner].resources.coins, coins + 2);
});
test('trial holds and returns owned materials, spends effort, adds only topic failure and fatigue', () => {
    const f = fixture(), seed = f.state.simulation.seed, before = f.out.gameplay.player.inventory[K.sound];
    const job = accept(f, I.trial); assert.equal(f.out.gameplay.player.inventory[K.manual] || 0, 0); assert.equal(f.out.gameplay.player.inventory[K.sound], before - 1);
    assert.equal(f.out.vitals.player.stamina, 18); assert.equal(finish(f, job), true);
    assert.equal(f.out.gameplay.player.inventory[K.manual], 1); assert.equal(f.out.gameplay.player.inventory[K.sound], before);
    assert.equal(f.state.actors.player.facts[I.diagnostic], true); assert.equal(f.state.actors.player.facts[I.procedure], undefined);
    assert.equal(f.state.simulation.conditions.player[I.fatigue].expiresAt, 7); assert.equal(f.state.simulation.seed, seed);
    assert.match(f.state.simulation.knowledge.player[`${I.prefix}diagnostic`].value, /missing edge-clearance comparison/);
    assert.throws(() => quote(f, I.compare)); assert.throws(() => quote(f, I.guided)); assert.throws(() => quote(f, I.read));
    assert.equal(job.effects.some(e => ['xp', 'power'].includes(e.type)), false);
});
test('specific rest changes only fatigue; comparison consumes the diagnostic and returns materials', () => {
    const f = fixture(); finish(f, accept(f, I.trial));
    f.state.simulation.conditions.player['body.sore_hands'] = {intensity: 1, expiresAt: 40, cause: 'unrelated'};
    const stamina = f.out.vitals.player.stamina, job = accept(f, I.rest); assert.equal(job.siteId, null); assert.equal(finish(f, job), true);
    assert.equal(f.out.vitals.player.stamina, stamina); assert.ok(f.state.simulation.conditions.player['body.sore_hands']);
    assert.equal(f.state.simulation.conditions.player[I.fatigue], undefined); assert.equal(f.state.actors.player.facts[I.diagnostic], true);
    delete f.state.simulation.conditions.player['body.sore_hands'];
    finish(f, accept(f, I.compare)); assert.equal(f.state.actors.player.facts[I.diagnostic], false); assert.equal(f.state.actors.player.facts[I.prepared], 1);
    assert.equal(f.out.gameplay.player.inventory[K.manual], 1); assert.equal(f.out.gameplay.player.inventory[K.sound], 3);
    assert.ok(f.state.simulation.knowledge.player[`${I.prefix}diagnostic`]); assert.equal(f.state.actors.player.facts[I.procedure], undefined);
    assert.throws(() => quote(f, I.guided));
});
test('actual played expiry is an alternative to specific rest', () => {
    const f = fixture(); finish(f, accept(f, I.trial)); f.state.clock += 4; expire(f);
    finish(f, accept(f, I.compare)); assert.equal(f.state.actors.player.completed[I.rest], undefined);
    finish(f, accept(f, I.read)); assert.equal(steamBOHFacts(f.state, f.context)['steamBOH.learned'], true);
});
test('specific rest still completes after natural fatigue expires during it', () => {
    const f = fixture(); finish(f, accept(f, I.trial)); f.state.clock = 6;
    const job = accept(f, I.rest); assert.equal(job.due, 8);
    assert.equal(finish(f, job), true); assert.equal(f.state.simulation.conditions.player[I.fatigue], undefined);
    assert.equal(f.state.actors.player.completed[I.rest], 1); assert.equal(f.state.actors.player.facts[I.diagnostic], true);
    finish(f, accept(f, I.compare)); finish(f, accept(f, I.read));
    validateSteamBOHState(JSON.parse(JSON.stringify(f.state)), registry);
});
test('funded guidance prepares without failure, followed by separate real reading', () => {
    const f = fixture(), edaCoins = f.state.actors[I.owner].resources.coins, edaStamina = f.state.simulation.people[I.owner].vitals.stamina;
    const job = accept(f, I.guided); assert.equal(job.due, 3); assert.equal(f.out.external.money, 17);
    assert.equal(finish(f, job), true); assert.equal(f.state.actors[I.owner].resources.coins, edaCoins + 3);
    assert.equal(f.state.simulation.people[I.owner].vitals.stamina, edaStamina - 1);
    assert.equal(f.state.actors.player.completed[I.trial], undefined); assert.equal(f.state.actors.player.facts[I.procedure], undefined);
    const reading = accept(f, I.read); assert.equal(f.out.gameplay.player.inventory[K.manual] || 0, 0); assert.equal(f.out.vitals.player.stamina, 19);
    finish(f, reading); assert.equal(f.state.actors.player.facts[I.procedure], 1); assert.equal(f.out.gameplay.player.inventory[K.manual], 1);
    assert.equal(f.state.simulation.knowledge.player[`${I.prefix}procedure`].stage, 'understood');
});
test('learned route makes actual native kits and returns the same owned knife dulled', () => {
    for (const [variant, worn] of [['sharp', 'dull'], ['fine', 'fineDull']]) {
        const f = fixture(); finish(f, accept(f, I.guided)); finish(f, accept(f, I.read));
        const stamina = f.out.vitals.player.stamina, count = f.out.gameplay.player.inventory[K.sound], job = accept(f, `${I.prefix}kits_${variant}`);
        assert.equal(f.out.gameplay.player.inventory[K[variant]] || 0, 0); assert.equal(f.out.gameplay.player.inventory[K.manual] || 0, 0);
        assert.equal(job.due - f.state.clock, 3); assert.equal(f.out.vitals.player.stamina, stamina - 1);
        assert.equal(f.out.gameplay.player.inventory[K.sound], count - 2); assert.equal(f.out.gameplay.player.inventory[K.sap] || 0, 0);
        assert.equal(finish(f, job), true); assert.equal(f.out.gameplay.player.inventory[K.kit], 2);
        assert.equal(f.out.gameplay.player.inventory[K[worn]], 1); assert.equal(f.out.gameplay.player.inventory[K.manual], 1);
        assert.equal(f.out.acquisitions.filter(a => a.key === K.manual || a.key === K[worn]).length, 0);
    }
    assert.equal(O.commands.find(d => d.id === 'feature_objects.kit_sharp_own').duration, 4);
    assert.equal(O.commands.find(d => d.id === 'feature_objects.kit_sharp_own').costs.find(e => e.type === 'vital').amount, -2);
});
test('losing a copy preserves understanding and repeat paid copies restore the reference', () => {
    const f = fixture(); finish(f, accept(f, I.guided)); finish(f, accept(f, I.read));
    const procedure = structuredClone(f.state.simulation.knowledge.player[`${I.prefix}procedure`]);
    applySimulationEffects(f.out, [{type: 'item', actor: 'player', key: K.manual, amount: -1}], f.context, registry, 'test-loss', {spending: true});
    assert.equal(steamBOHFacts(f.state, f.context)['steamBOH.learned'], true);
    assert.throws(() => quote(f, `${I.prefix}kits_sharp`));
    finish(f, accept(f, I.copy)); assert.equal(f.out.gameplay.player.inventory[K.manual], 1);
    assert.deepEqual(f.state.simulation.knowledge.player[`${I.prefix}procedure`], procedure);
    applySimulationEffects(f.out, [K.paper, K.ink].map(key => ({type: 'item', actor: 'player', key, amount: 1})), f.context, registry, 'test-supplies');
    const wageBefore = f.state.actors[I.owner].resources.coins;
    finish(f, accept(f, I.copy)); assert.equal(f.out.gameplay.player.inventory[K.manual], 2);
    assert.equal(f.state.actors.player.completed[I.copy], 2); assert.equal(f.state.actors[I.owner].resources.coins, wageBefore + 2);
    assert.equal(quote(f, `${I.prefix}kits_sharp`).d.duration, 3);
    validateSteamBOHState(JSON.parse(JSON.stringify(f.state)), registry);
});
test('cancellation restores held objects, money and effort, producing no preparation or wage', () => {
    for (const id of [I.trial, I.guided, I.copy]) {
        const f = fixture(), before = structuredClone({stock: f.out.gameplay, money: f.out.external, vitals: f.out.vitals, coins: f.state.actors[I.owner].resources.coins, effort: f.state.simulation.people[I.owner].vitals.stamina});
        cancel(f, accept(f, id)); assert.deepEqual(f.out.gameplay, before.stock); assert.deepEqual(f.out.external, before.money); assert.deepEqual(f.out.vitals, before.vitals);
        assert.equal(f.state.actors[I.owner].resources.coins, before.coins); assert.equal(f.state.simulation.people[I.owner].vitals.stamina, before.effort);
        assert.equal(f.state.actors.player.facts[I.prepared], undefined); assert.equal(f.state.actors.player.facts[I.diagnostic], undefined); assert.equal(f.out.acquisitions.length, 0);
    }
});
test('canceled learned kit work returns its manual, sharp knife, materials and effort', () => {
    for (const variant of ['sharp', 'fine']) {
        const f = fixture(); finish(f, accept(f, I.guided)); finish(f, accept(f, I.read));
        const before = structuredClone({stock: f.out.gameplay, vitals: f.out.vitals, knowledge: f.state.simulation.knowledge.player, acquisitions: f.out.acquisitions});
        const job = accept(f, `${I.prefix}kits_${variant}`);
        validateSteamBOHState(JSON.parse(JSON.stringify(f.state)), registry);
        cancel(f, job);
        assert.deepEqual(f.out.gameplay, before.stock); assert.deepEqual(f.out.vitals, before.vitals);
        assert.deepEqual(f.state.simulation.knowledge.player, before.knowledge); assert.deepEqual(f.out.acquisitions, before.acquisitions);
        assert.equal(f.out.gameplay.player.inventory[K.kit], undefined);
        assert.equal(f.state.actors.player.completed[`${I.prefix}kits_${variant}`], undefined);
    }
});
test('lost consent or body/bench support refunds actual work without outcome', () => {
    for (const alter of [f => {f.state.actors[I.owner].facts['feature_objects.willing'] = false;}, f => {f.context.nativeAlive = false;}]) {
        const f = fixture(), before = structuredClone(f.out.gameplay), job = accept(f, I.guided); alter(f);
        assert.equal(finish(f, job), false); assert.deepEqual(f.out.gameplay, before); assert.equal(f.out.external.money, 20); assert.equal(f.state.actors.player.facts[I.prepared], undefined);
    }
    const f = fixture(), job = accept(f, I.trial); f.state.simulation.sites[I.site].capacity = 2;
    assert.equal(finish(f, job), false); assert.equal(f.state.actors.player.facts[I.diagnostic], undefined);
});
test('admission rejects missing, borrowed or equipped references/tools and untrusted context', () => {
    for (const alter of [f => {delete f.out.gameplay.player.inventory[K.manual];},
        f => {f.state.simulation.custody.borrowed = {holder: 'player', owner: I.owner, key: K.manual, count: 1};},
        f => {f.context.equipment.player.hand = K.manual;}, f => {f.context.steamBOHHost = false;},
        f => {f.context.nativeBody.hands = 1;}, f => {f.state.actors[I.owner].facts['feature_objects.willing'] = false;}]) {
        const f = fixture(); alter(f); assert.throws(() => quote(f, I.guided));
    }
    const f = fixture(); finish(f, accept(f, I.guided)); finish(f, accept(f, I.read));
    f.state.simulation.custody.borrowed = {holder: 'player', owner: I.owner, key: K.sharp, count: 1}; assert.throws(() => quote(f, `${I.prefix}kits_sharp`));
});
test('pending exact contracts survive JSON and reject amended costs/returns/time/participants/support', () => {
    for (const id of [I.copy, I.trial, I.guided]) {
        const f = fixture(); accept(f, id); validateSteamBOHState(JSON.parse(JSON.stringify(f.state)), registry);
        for (const alter of [j => {j.costs[0].amount = -9;}, j => {j.effects.shift();}, j => {j.due--;},
            j => {j.participants.push('oldCraftsman');}, j => {j.steamBOHWork.extra = true;}, j => {j.completionSupport.requires = null;}, j => {j.reservationReturns = 0;}]) {
            const bad = structuredClone(f.state); alter(bad.simulation.jobs[0]); assert.throws(() => validateSteamBOHState(bad, registry));
        }
    }
});
test('forged procedure, alien namespace, edited fatigue and history deletion are rejected', () => {
    const f = fixture(); finish(f, accept(f, I.trial));
    for (const alter of [s => {s.actors.player.facts[I.procedure] = 1;}, s => {s.simulation.conditions.player[I.fatigue].expiresAt++;},
        s => {delete s.simulation.conditions.player[I.fatigue];},
        s => {s.simulation.knowledge.player[`${I.prefix}diagnostic`].value = 'any old note';}, s => {s.actors[I.owner].facts[I.enrolled] = true;},
        s => {s.simulation.programs.player = {commandId: I.read};}, s => {delete s.simulation.knowledge.player[`${I.prefix}diagnostic`];}]) {
        const bad = structuredClone(f.state); alter(bad); assert.throws(() => validateSteamBOHState(bad, registry));
    }
    finish(f, accept(f, I.rest)); finish(f, accept(f, I.compare)); finish(f, accept(f, I.read)); validateSteamBOHState(JSON.parse(JSON.stringify(f.state)), registry);
    const bad = structuredClone(f.state); bad.simulation.knowledge.player[`${I.prefix}comparison`].at = 3; assert.throws(() => validateSteamBOHState(bad, registry));
});
console.log(`${checks} bounded BOH checks passed using the real shared effect/refund reducer. These do not execute the shared scheduler, native publication or browser save IO.`);
