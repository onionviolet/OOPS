import assert from 'node:assert/strict';
import {STEAM_LAMB_IDS as I, STEAM_LAMB_KEYS as K, steamLambDefinitions as D} from '../../../../src/steam_lamb_content.js';
import {steamLambFacts, validateSteamLambState} from '../../../../src/steam_lamb_facts.js';
import {guardSteamLambAdmission, stampSteamLambAcceptedJob, steamLambCompletionContext, steamLambQualified} from '../../../../src/steam_lamb_runtime.js';
import {commitSteamLambCommand, steamLambContext, steamLambPresentation} from '../../../../src/steam_lamb_host.js';
import {featureObjectDefinitions as O, featureObjectSources, FEATURE_OBJECT_KEYS as OK} from '../../../../src/feature_expansion_objects.js';
import {createSimulationRegistry, createSimulationState, validateSimulationState, meets} from '../../../../src/simulation_contracts.js';
import {applySimulationEffects, refundCosts} from '../../../../src/simulation_effects.js';
import {previewSimulationCommand} from '../../../../src/simulation.js';
import {bodyConditions} from '../../../../src/body_progression.js';

const registry = {worlds: new Map([[I.world, {}]]), sources: new Map(featureObjectSources.map(d => [d.id, d])), techniques: new Map(),
    simulation: createSimulationRegistry({commands: [...O.commands, ...D.commands], people: O.people, sites: O.sites, situations: O.situations, powers: O.powers, conditions: bodyConditions})};
const definition = id => D.commands.find(d => d.id === id);
const domain = () => ({facts: {}, resources: {}, completed: {}, sources: {}, techniques: {}});
function fixture(variant = 'fineDull') {
    const state = {schema: 11, sequence: 1, clock: 0, pending: [], rng: 13, campaign: domain(), journey: domain(),
        actors: {player: {...domain(), worldId: I.world}}, worlds: {[I.world]: domain()}, simulation: createSimulationState(13)};
    state.simulation.schema = 5; state.simulation.enrolledAt = 0;
    state.simulation.people.player = {inventory: 'native', life: 'alive', location: 'Village', bornAt: 0};
    const context = {actorId: 'player', targetId: null, steamLambHost: true, nativeAlive: true, busy: false,
        nativeBody: {form: 'human', ownerId: 'player', controllerId: 'player', hands: 2, mobile: true},
        nativeCareFrame: {clock: 0, calendarMinute: 0, battleRunning: false}, facts: {location: 'Village'},
        gameplay: {player: {inventory: {[OK.sap]: 2}, skills: {}, reputation: {}}},
        vitals: {player: {health: 20, max_health: 20, stamina: 20, max_stamina: 20}}, equipment: {player: {}}, external: {money: 20}};
    const out = {state, gameplay: context.gameplay, external: context.external, vitals: context.vitals, equipment: context.equipment, acquisitions: [], unlocks: []};
    const f = {state, context, out};
    // Generated fixture executes the existing opening, demonstration, lesson and
    // actual sale effects. It does not assert those unrelated scheduler paths.
    applySimulationEffects(out, O.commands.find(d => d.id === 'feature_objects.begin').effects, context, registry, 'simulation:1');
    state.actors.player.completed['feature_objects.begin'] = 1;
    context.targetId = I.owner;
    const prior = id => {
        const d = O.commands.find(d => d.id === id), cause = `simulation:${++state.sequence}`;
        applySimulationEffects(out, d.costs, context, registry, cause, {spending: true}); state.clock += d.duration || 0;
        applySimulationEffects(out, d.effects, context, registry, cause); state.actors.player.completed[id] = 1;
    };
    prior(I.observe); prior(I.learn); prior('feature_objects.buy_matched');
    if (variant === 'fine') {prior('feature_objects.borrow_fine'); prior('feature_objects.return_fine');}
    out.acquisitions.length = 0; out.unlocks.length = 0;
    validateSteamLambState(state, registry); validateSimulationState(state.simulation, state, registry.simulation);
    assert.equal(steamLambQualified(state), true);
    return f;
}
function quote(f, commandId) {
    const d = definition(commandId), context = steamLambContext(f.state, registry, {...f.context, targetId: d.targetId || null});
    validateSteamLambState(f.state, registry); guardSteamLambAdmission(f.state, d, context);
    const preview = previewSimulationCommand(f.state, registry, commandId, context);
    assert.equal(preview.eligible, true, preview.reasons.join('; '));
    return {d, context};
}
function accept(f, commandId) {
    const {d, context} = quote(f, commandId), cause = `simulation:${++f.state.sequence}`;
    applySimulationEffects(f.out, d.costs, context, registry, cause, {spending: true});
    const job = {id: cause, sequence: f.state.sequence, commandId: d.id, revision: d.revision, actorId: 'player', targetId: I.owner,
        due: f.state.clock + d.duration, effects: structuredClone(d.effects), costs: structuredClone(d.costs), cancellation: 'refund', reservationReturns: 1,
        siteId: I.site, claim: null, label: d.label, roll: null, outcomeId: null, context: {actorId: 'player', targetId: I.owner, partyIds: []},
        participants: ['player', I.owner], completionSupport: {schema: 1, requires: d.completionRequires, coLocated: true, location: 'Village', failure: 'refund'}};
    stampSteamLambAcceptedJob(f.state, job, context);
    f.state.simulation.jobs.push(job); f.state.simulation.sites[I.site].reservations[job.id] = 'player';
    validateSteamLambState(f.state, registry); validateSimulationState(f.state.simulation, f.state, registry.simulation);
    return job;
}
function finish(f, job) {
    f.state.clock = job.due;
    f.state.simulation.jobs = f.state.simulation.jobs.filter(j => j.id !== job.id); // Shared scheduler removes this job before support projection.
    const context = steamLambCompletionContext(f.state, job, {...f.context, ...job.context});
    const supported = meets(job.completionSupport.requires, {...context.facts, ...steamLambFacts(f.state, context, registry)});
    if (supported) {
        applySimulationEffects(f.out, job.effects, context, registry, job.id); f.state.actors.player.completed[job.commandId] = 1;
    } else applySimulationEffects(f.out, refundCosts(job.costs, true), job.context, registry, `unsupported:${++f.state.sequence}`);
    delete f.state.simulation.sites[I.site].reservations[job.id];
    validateSteamLambState(f.state, registry); validateSimulationState(f.state.simulation, f.state, registry.simulation);
    return supported;
}
function adopt(f, out) {
    f.out = out; f.state = out.state;
    f.context = {...f.context, external: out.external, gameplay: out.gameplay, vitals: out.vitals, equipment: out.equipment};
}
function cancel(f, job) {
    adopt(f, commitSteamLambCommand(f.state, registry, {type: I.group, action: 'cancel', id: job.id, sequence: f.state.sequence}, f.context));
}
function end(f) {adopt(f, commitSteamLambCommand(f.state, registry, {type: I.group, id: I.end, sequence: f.state.sequence}, f.context));}
const appoint = f => {assert.equal(finish(f, accept(f, I.appoint)), true);};
const inspect = (f, variant = 'fineDull') => {assert.equal(finish(f, accept(f, variant === 'fine' ? I.inspectFine : I.inspectFineDull)), true);};
const means = f => structuredClone({gameplay: f.out.gameplay, vitals: f.out.vitals, external: f.out.external,
    coins: f.state.actors[I.owner].resources.coins, ownerStock: f.state.simulation.owners[I.owner], ownerVitals: f.state.simulation.people[I.owner].vitals});
const competence = f => structuredClone({sources: f.state.actors[I.owner].sources, faculty: f.state.simulation.faculties[I.owner],
    power: f.state.simulation.powers[I.owner], demonstration: f.state.simulation.knowledge[I.owner]['feature_objects.demonstration']});
let checks = 0;
function test(name, fn) {fn(); console.log(`ok ${++checks}: ${name}`);}

test('old absence and pure local views are inert', () => {
    const old = {actors: {player: {facts: {}, completed: {}}}}, before = structuredClone(old);
    validateSteamLambState(old); steamLambFacts(old); assert.deepEqual(old, before);
    const f = fixture(), copy = structuredClone(f); steamLambFacts(f.state, f.context); steamLambPresentation(f.state, registry, f.context);
    assert.deepEqual(f, copy); assert.equal(f.state.actors[I.owner].facts[I.office], undefined);
});
test('actual observed/practiced competence alone gives no office, approval or service', () => {
    const f = fixture(); assert.throws(() => quote(f, I.inspectFineDull)); assert.throws(() => quote(f, I.deliver));
    const own = competence(f), before = means(f), job = accept(f, I.appoint);
    assert.equal(job.due - f.state.clock, 1); assert.equal(f.state.actors[I.owner].facts[I.office], undefined);
    assert.equal(finish(f, job), true); assert.deepEqual(means(f), before); assert.deepEqual(competence(f), own);
    assert.equal(f.state.actors[I.owner].facts[I.office], true); assert.equal(f.state.actors.player.facts[I.office], undefined);
    assert.equal(f.state.actors.player.facts[I.approval], undefined); assert.throws(() => quote(f, I.appoint));
});
test('appointment needs actual completions and matching Eda demonstration, not remembered words', () => {
    for (const alter of [f => {delete f.state.actors.player.completed[I.observe];}, f => {delete f.state.actors.player.completed[I.learn];},
        f => {delete f.state.simulation.knowledge[I.owner]['feature_objects.demonstration'];},
        f => {f.state.simulation.knowledge.player['feature_objects.method'].stage = 'seen';},
        f => {f.state.simulation.knowledge[I.owner]['feature_objects.demonstration'].cause = 'simulation:999';},
        f => {f.state.simulation.knowledge.player['feature_objects.method'].at = 2;}]) {
        const f = fixture(); alter(f); assert.equal(steamLambQualified(f.state), false); assert.throws(() => quote(f, I.appoint));
    }
});
test('appointment cancellation and source-loss support refund leave no office or history', () => {
    for (const stopped of ['cancel', 'source']) {
        const f = fixture(), before = means(f), job = accept(f, I.appoint);
        if (stopped === 'cancel') cancel(f, job);
        else {f.state.simulation.faculties[I.owner][I.method].active = false; assert.equal(finish(f, job), false);}
        assert.deepEqual(means(f), before); assert.equal(f.state.actors[I.owner].facts[I.office], undefined);
        assert.equal(f.state.actors.player.completed[I.appoint], undefined); assert.equal(f.state.simulation.knowledge.player[`${I.prefix}appointment`], undefined);
    }
});
test('inspection holds the only real stave and fineDull guide and completes without available duplicates', () => {
    const f = fixture(); appoint(f); const before = means(f), job = accept(f, I.inspectFineDull);
    assert.equal(f.out.external.money, before.external.money - 1); assert.equal(f.state.simulation.people[I.owner].vitals.stamina, before.ownerVitals.stamina - 1);
    assert.equal(f.out.gameplay.player.inventory[K.matched] || 0, 0); assert.equal(f.state.simulation.owners[I.owner][K.fineDull] || 0, 0);
    assert.equal(f.state.actors[I.owner].resources.coins, before.coins); assert.equal(f.state.actors.player.facts[I.approval], undefined);
    assert.equal(finish(f, job), true); assert.equal(f.out.gameplay.player.inventory[K.matched], 1);
    assert.equal(f.state.simulation.owners[I.owner][K.fineDull], 1); assert.equal(f.state.actors[I.owner].resources.coins, before.coins + 1);
    assert.equal(f.state.actors.player.facts[I.approval], true); assert.equal(f.out.acquisitions.length, 0);
});
test('sharp fine guide follows its own unchanged return and distinct receipt, sharing the one approval exclusion', () => {
    const f = fixture('fine'); appoint(f); const guide = f.state.simulation.owners[I.owner][K.fine]; inspect(f, 'fine');
    assert.equal(f.state.simulation.owners[I.owner][K.fine], guide); assert.equal(f.state.simulation.owners[I.owner][K.fineDull] || 0, 0);
    assert.ok(f.state.simulation.knowledge.player[`${I.prefix}inspection_fine`]); assert.equal(f.state.simulation.knowledge.player[`${I.prefix}inspection_fineDull`], undefined);
    assert.throws(() => quote(f, I.inspectFineDull)); assert.throws(() => quote(f, I.inspectFine));
});
test('inspection admission rejects absent or borrowed/equipped part and missing/loaned/equipped guide', () => {
    for (const alter of [f => {delete f.out.gameplay.player.inventory[K.matched];},
        f => {f.state.simulation.custody.borrowed = {holder: 'player', key: K.matched};},
        f => {f.context.equipment.player.hand = K.matched;}, f => {delete f.state.simulation.owners[I.owner][K.fineDull];},
        f => {f.state.simulation.custody.guide = {owner: I.owner, holder: 'player', key: K.fineDull};},
        f => {f.state.simulation.custody.guide = {owner: 'other', holder: I.owner, key: K.fineDull};},
        f => {f.state.simulation.equipment[I.owner] = {hand: K.fineDull};}]) {
        const f = fixture(); appoint(f); alter(f); const before = means(f); assert.throws(() => quote(f, I.inspectFineDull)); assert.deepEqual(means(f), before);
    }
});
test('native fee and Eda effort must actually be available', () => {
    for (const alter of [f => {f.out.external.money = 0;}, f => {f.state.simulation.people[I.owner].vitals.stamina = 0;}]) {
        const f = fixture(); appoint(f); alter(f); const before = means(f); assert.throws(() => quote(f, I.inspectFineDull)); assert.deepEqual(means(f), before);
    }
});
test('inspection cancellation refunds the exact fee, Eda effort, stave and unchanged guide', () => {
    for (const variant of ['fine', 'fineDull']) {
        const f = fixture(variant); appoint(f); const before = means(f), job = accept(f, variant === 'fine' ? I.inspectFine : I.inspectFineDull); cancel(f, job);
        assert.deepEqual(means(f), before); assert.equal(f.state.actors.player.facts[I.approval], undefined);
        assert.equal(f.out.acquisitions.length, 0); assert.equal(f.state.simulation.jobs.length, 0);
        assert.throws(() => cancel(f, job));
    }
});
test('lost consent, source, body, hands, location or native battle refunds inspection without approval or wage', () => {
    for (const alter of [f => {f.state.actors[I.owner].facts['feature_objects.willing'] = false;},
        f => {f.state.simulation.faculties[I.owner][I.method].active = false;},
        f => {f.state.actors[I.owner].sources[I.method].origin = 'unknown';},
        f => {f.state.simulation.people[I.owner].body.hands = 1;}, f => {f.context.nativeBody.hands = 1;},
        f => {f.context.facts.location = 'Shack';}, f => {f.context.nativeCareFrame.battleRunning = true;}]) {
        const f = fixture(); appoint(f); const before = means(f), job = accept(f, I.inspectFineDull); alter(f);
        assert.equal(finish(f, job), false); assert.deepEqual(means(f), before); assert.equal(f.state.actors.player.facts[I.approval], undefined);
        assert.equal(f.state.actors[I.owner].facts[I.office], true); assert.equal(f.out.acquisitions.length, 0);
    }
});
test('the finite order holds one native stave and three actual Eda coins, paying only at completion', () => {
    const f = fixture(); appoint(f); inspect(f); f.state.actors[I.owner].resources.coins = 3;
    const before = means(f), job = accept(f, I.deliver);
    assert.equal(f.state.actors[I.owner].resources.coins, 0); assert.equal(f.out.gameplay.player.inventory[K.matched] || 0, 0);
    assert.equal(f.out.external.money, before.external.money); assert.equal(f.state.actors.player.facts[I.approval], true);
    assert.equal(finish(f, job), true); assert.equal(f.out.external.money, before.external.money + 3);
    assert.equal(f.state.actors[I.owner].resources.coins, 0); assert.equal(f.state.simulation.owners[I.owner][K.matched], (before.ownerStock[K.matched] || 0) + 1);
    assert.equal(f.state.actors.player.facts[I.approval], false); assert.equal(f.state.actors.player.completed[I.deliver], 1);
    assert.throws(() => quote(f, I.deliver)); assert.throws(() => quote(f, I.inspectFine)); assert.throws(() => quote(f, I.inspectFineDull));
    assert.deepEqual(f.out.acquisitions, [{owner: I.owner, key: K.matched, count: 1}]);
});
test('missing part, insufficient actual purse and inactive current source reject the order without spending', () => {
    for (const alter of [f => {delete f.out.gameplay.player.inventory[K.matched];}, f => {f.state.actors[I.owner].resources.coins = 2;},
        f => {f.state.simulation.faculties[I.owner][I.method].active = false;}]) {
        const f = fixture(); appoint(f); inspect(f); alter(f); const before = means(f); assert.throws(() => quote(f, I.deliver)); assert.deepEqual(means(f), before);
    }
});
test('delivery cancellation and lost source return stave and purse exactly, keeping approval unconsumed', () => {
    for (const stopped of ['cancel', 'source']) {
        const f = fixture(); appoint(f); inspect(f); f.state.actors[I.owner].resources.coins = 3;
        const before = means(f), job = accept(f, I.deliver);
        if (stopped === 'cancel') cancel(f, job);
        else {f.state.simulation.faculties[I.owner][I.method].active = false; assert.equal(finish(f, job), false);}
        assert.deepEqual(means(f), before); assert.equal(f.state.actors.player.facts[I.approval], true);
        assert.equal(f.state.actors.player.completed[I.deliver], undefined); assert.equal(f.out.acquisitions.length, 0);
    }
});
test('ending with an inactive source retains earned competence and every receipt, blocking future service', () => {
    const f = fixture(); appoint(f); inspect(f); f.state.simulation.faculties[I.owner][I.method].active = false;
    const prior = competence(f), history = structuredClone(f.state.simulation.knowledge.player), before = means(f); end(f);
    assert.equal(f.state.actors[I.owner].facts[I.office], false); assert.equal(f.state.actors.player.facts[I.approval], true);
    assert.deepEqual(competence(f), prior); assert.deepEqual(means(f), before);
    for (const [key, value] of Object.entries(history)) assert.deepEqual(f.state.simulation.knowledge.player[key], value);
    assert.throws(() => quote(f, I.inspectFineDull)); assert.throws(() => quote(f, I.deliver)); assert.throws(() => end(f));
});
test('ending after settlement preserves the native transfer, payment and consumed approval', () => {
    const f = fixture(); appoint(f); inspect(f); finish(f, accept(f, I.deliver)); const before = means(f), own = competence(f); end(f);
    assert.deepEqual(means(f), before); assert.deepEqual(competence(f), own); assert.equal(f.state.actors.player.facts[I.approval], false);
    assert.equal(f.state.actors.player.completed[I.deliver], 1); validateSteamLambState(JSON.parse(JSON.stringify(f.state)), registry);
});
test('actual source removal disables service without preventing ending or erasing appointment history', () => {
    const f = fixture(); appoint(f);
    applySimulationEffects(f.out, [{type: 'source', actor: I.owner, sourceId: I.method, operation: 'remove'}], f.context, registry, 'test-source-loss');
    assert.equal(f.state.actors[I.owner].sources[I.method], undefined); assert.equal(f.state.simulation.faculties[I.owner][I.method], undefined);
    assert.throws(() => quote(f, I.inspectFineDull)); const prior = competence(f); end(f);
    assert.deepEqual(competence(f), prior); assert.equal(f.state.actors[I.owner].facts[I.office], false);
    assert.equal(f.state.actors.player.completed[I.appoint], 1); assert.equal(f.state.actors.player.completed[I.end], 1);
});
test('actual scheduler preview protects player, Eda and bench attention; stale host requests reject', () => {
    const f = fixture(); appoint(f); accept(f, I.inspectFineDull);
    const d = definition(I.end), ctx = steamLambContext(f.state, registry, {...f.context, targetId: null});
    assert.equal(previewSimulationCommand(f.state, registry, d.id, ctx).eligible, false);
    assert.throws(() => commitSteamLambCommand(f.state, registry, {type: I.group, id: I.end, sequence: f.state.sequence - 1}, f.context));
    const g = fixture(); g.state.simulation.sites[I.site].reservations.someOtherJob = 'player'; assert.throws(() => quote(g, I.appoint));
});
test('all pending static routes survive JSON; changed held costs, guide, time, returns or support reject', () => {
    for (const id of [I.appoint, I.inspectFine, I.inspectFineDull, I.deliver]) {
        const f = fixture(id === I.inspectFine ? 'fine' : 'fineDull');
        if (id !== I.appoint) appoint(f); if (id === I.deliver) inspect(f);
        accept(f, id); validateSteamLambState(JSON.parse(JSON.stringify(f.state)), registry);
        for (const alter of [j => {j.effects.pop();}, j => {j.costs.push({type: 'resource', actor: 'player', native: true, key: 'money', amount: -9});},
            j => {j.due--;}, j => {j.steamLambWork.guideVariant = 'invented';}, j => {j.steamLambWork.agreementVersion = 2;},
            j => {j.participants.push('oldCraftsman');}, j => {j.completionSupport.requires = null;}, j => {j.reservationReturns = 0;},
            j => {j.context.partyIds.push('oldCraftsman');}, j => {j.extra = true;}]) {
            const bad = structuredClone(f.state); alter(bad.simulation.jobs[0]); assert.throws(() => validateSteamLambState(bad, registry));
        }
        const lostBench = structuredClone(f.state); delete lostBench.simulation.sites[I.site].reservations[lostBench.simulation.jobs[0].id];
        assert.throws(() => validateSteamLambState(lostBench, registry));
    }
});
test('orphan office, approval, history, replayed completion and foreign namespaces reject', () => {
    const f = fixture(); appoint(f); inspect(f); finish(f, accept(f, I.deliver)); end(f);
    for (const alter of [s => {delete s.actors[I.owner].facts[I.office];}, s => {s.actors[I.owner].facts[I.office] = true;},
        s => {s.actors.player.facts[I.office] = true;}, s => {s.actors.player.facts[I.approval] = true;},
        s => {s.actors.player.completed[I.deliver] = 2;}, s => {s.actors.player.completed[I.inspectFine] = 1;},
        s => {delete s.simulation.knowledge.player[`${I.prefix}appointment`];},
        s => {s.simulation.knowledge.player[`${I.prefix}delivery`].basis.attributedTo = 'other';},
        s => {s.simulation.knowledge.player[`${I.prefix}ending`].at = 0;},
        s => {s.simulation.programs.player = {commandId: I.deliver};},
        s => {s.actors[I.owner].resources[`${I.prefix}money`] = 3;},
        s => {s.worlds[I.world].facts[I.office] = true;}, s => {s.steamLamb = {};}, s => {s.simulation.steam_lamb = {};},
        s => {s.simulation.titles.player = {[I.office]: true};}, s => {s.simulation.knowledge[I.owner][`${I.prefix}delivery`] = {};},
        s => {s.actors.player.completed[I.learn] = 0;}]) {
        const bad = structuredClone(f.state); alter(bad); assert.throws(() => validateSteamLambState(bad, registry));
    }
    const old = fixture(); old.state.actors[I.owner].facts[I.office] = true; assert.throws(() => validateSteamLambState(old.state, registry));
});
test('admission requires current native body, Eda consent/method and bench, but title never supplies them', () => {
    for (const alter of [f => {f.context.nativeAlive = false;}, f => {f.context.nativeBody.controllerId = 'other';},
        f => {f.context.nativeCareFrame.battleRunning = true;}, f => {f.out.vitals.player.health = 1;},
        f => {f.state.realmPrototype = {activeVisitId: 'visit'};}, f => {f.state.chronicle = {session: {}};},
        f => {f.state.simulation.people[I.owner].life = 'dead';}, f => {f.state.simulation.people[I.owner].location = 'Shack';},
        f => {f.state.actors[I.owner].facts['feature_objects.willing'] = false;},
        f => {f.state.actors[I.owner].sources[I.method].expiresAt = f.state.clock;},
        f => {f.state.simulation.faculties[I.owner][I.method].suppressed = true;}, f => {f.context.steamLambHost = false;}]) {
        const f = fixture(); alter(f); assert.throws(() => guardSteamLambAdmission(f.state, definition(I.appoint), f.context));
    }
});
test('schema11/simulation5 and unrelated ordinary work histories remain unchanged', () => {
    const f = fixture(); f.state.actors.player.facts.unrelated = 'earlier day'; f.state.simulation.knowledge.player.old_note = {stage: 'seen', value: 'Earlier day', at: 0, cause: 'test'};
    const previous = structuredClone({old: f.state.simulation.knowledge.player.old_note, situation: f.state.simulation.situations[I.situation], kitOrders: f.state.actors[I.owner].resources.kitOrders});
    appoint(f); inspect(f); finish(f, accept(f, I.deliver)); end(f);
    assert.equal(f.state.schema, 11); assert.equal(f.state.simulation.schema, 5); assert.equal(f.state.actors.player.facts.unrelated, 'earlier day');
    assert.deepEqual({old: f.state.simulation.knowledge.player.old_note, situation: f.state.simulation.situations[I.situation], kitOrders: f.state.actors[I.owner].resources.kitOrders}, previous);
    validateSteamLambState(JSON.parse(JSON.stringify(f.state)), registry);
});
console.log(`${checks} bounded Lamb checks passed. Work checks use real shared effect/refund reducers and scheduler previews; cancellation and ending use the real host. Timed shared scheduler hooks, native publication, browser and save/import IO remain root gates.`);
