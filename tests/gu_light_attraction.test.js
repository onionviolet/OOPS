import assert from 'node:assert/strict';
import test from 'node:test';
import {chooseWorking, defineAgent} from '../src/agency.js';
import {guColonyView, openGuColony, restoreGuColony, settleGuColonyAction, starFireflyFarm} from '../src/gu_colony.js';
import {asBoundGu, guMethods, guRef, guWorkingLaw} from '../src/gu_working_law.js';
import {beginQuotedWorking, quoteForActor, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {createSimulationState} from '../src/simulation_contracts.js';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {applyEffect} from '../src/world_effects.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES, effectKind} from '../src/world_quantities.js';
import {
    advanceWorld, applyWorldOps, createWorld, composeSubstrate, readProvenance, readQuantity, restoreWorld, serializeWorld,
} from '../src/world_substrate.js';
import {FORAGE_ATTRACTION, createForageAttractionPack} from '../src/world_substrate_packs/forage_attraction.js';

const day = 1440;
// Authored fixture calibration. The catalogue supports Gu giving light. It
// does not set a grade per Gu, a detectable threshold or a movement cadence.
const hillProfile = {light: 'light:star', gradePerEmerged: 12, minimum: 8, interval: 10};
const given = effectKind('light_given');
const colonyId = 'hill-colony';
const guId = 'wild-light-feeder';
const keeper = 'rival-keeper';
const witness = 'hill-witness';
const blade = 'rival-moonlight';
const essencePool = 'energy:primeval.rank1';
const json = value => JSON.parse(JSON.stringify(value));

function fixture({exposed = false, open = true, conceal = false, essence, keeperPlace = 'hill'} = {}) {
    const {light} = hillProfile;
    const rules = composeSubstrate({
        packs: [createForageAttractionPack({
            profiles: [hillProfile], maxNeighbors: 2,
            connections: [{from: 'ridge', to: 'hill', open}, {from: 'ridge', to: 'lantern', open: true}],
        })],
        properties: [WORLD_PROPERTIES.senses, WORLD_PROPERTIES.concealed],
        quantities: [WORLD_QUANTITIES.energy, WORLD_QUANTITIES.vitality],
        effectKinds: [given],
    });
    const place = (id, star, extra = {}) => ({id, kind: 'place', detail: 'far', quantities: {[light]: star, ...extra}});
    const body = (id, place, properties) => ({id, place, kind: 'body', properties});
    const world = createWorld(rules, {holders: [
        place('ridge', 0), place('hill', 0), place('lantern', 0, {'light:lamp': 70}), place('unlinked', 100),
        {id: colonyId, kind: 'thing', place: 'hill'},
        {...body(guId, 'ridge', {alive: true, forage_light: light, ...(conceal ? {concealed: ['sight']} : {})}),
            quantities: {vitality: 3}},
        body('other-diet', 'ridge', {alive: true, forage_light: 'light:moon'}),
        body('dead-feeder', 'ridge', {alive: false, forage_light: light}),
        {...body(keeper, keeperPlace, {alive: true, senses: ['sight']}),
            quantities: essence === undefined ? {} : {[essencePool]: essence}},
        body('distant-keeper', 'ridge', {alive: true, senses: ['sight']}),
        ...(essence === undefined ? [] : [
            body(witness, 'hill', {alive: true, senses: ['sight']}),
            {...body(blade, keeperPlace, {alive: true}), as: ['gu'],
                state: {specimen: {id: blade, kind: 'moonlight', holder: keeper, rank: 1, fedThrough: 1}}},
        ]),
    ]});
    let colony = openGuColony(starFireflyFarm, {clock: 0, interval: 15, site: colonyId});
    if (exposed) colony = settleGuColonyAction(colony, starFireflyFarm, 0, {kind: 'light', light: 'exposed'}).colony;
    return {rules, world, colony, segments: 0};
}

function tick(run, to) {
    const advanced = advanceWorld(run.rules, run.world, to);
    assert.equal(advanced.pending, false);
    return {...run, world: advanced.world, segments: run.segments + advanced.segments};
}

// The fixture supplies a host schedule. G owns population and its calendar,
// while W owns the light account. Publish only the change in this source's
// contribution, even when caller partitions land between habitat windows.
function advance(run, to) {
    let current = run;
    let prior = guColonyView(current.colony, starFireflyFarm);
    while (prior.nextCheck <= to) {
        current = tick(current, prior.nextCheck);
        const settled = settleGuColonyAction(current.colony, starFireflyFarm, prior.nextCheck, {kind: 'advance'});
        assert.equal(settled.pending, false);
        const next = guColonyView(settled.colony, starFireflyFarm);
        const amount = (next.emerged - prior.emerged) * hillProfile.gradePerEmerged;
        const world = amount === 0 ? current.world : applyWorldOps(current.rules, current.world, [{
            op: 'publish', kind: given, place: 'hill', quantity: hillProfile.light, amount, by: colonyId,
        }], `colony.window:${colonyId}:${prior.nextCheck}`);
        current = {...current, world, colony: settled.colony};
        prior = next;
    }
    return tick(current, to);
}

function reload(run) {
    return {...run, world: restoreWorld(run.rules, json(serializeWorld(run.world))),
        colony: restoreGuColony(json(run.colony), starFireflyFarm)};
}

function look(run, by) {
    return applyEffect(run.rules, run.world, {
        verb: 'sense', channel: 'sight', by, target: {shape: 'present', place: run.world.holders[by].place},
    }, 'keeper.look').outcome.observed.map(reading => reading.target);
}

test('the colony emergence lights the hill before a living light feeder crosses the declared edge', () => {
    const dark = advance(fixture(), 14);
    assert.equal(guColonyView(dark.colony, starFireflyFarm).emerged, 0);
    assert.equal(readQuantity(dark.world, 'hill', hillProfile.light), 0);
    assert.equal(dark.world.holders[guId].place, 'ridge');
    assert.ok(!look(dark, keeper).includes(guId));

    const lit = advance(dark, 15);
    assert.equal(guColonyView(lit.colony, starFireflyFarm).emerged, 1);
    assert.equal(readQuantity(lit.world, 'hill', hillProfile.light), 12);
    assert.deepEqual(readProvenance(lit.world, 'hill', hillProfile.light), {[`effect:${given}:${colonyId}`]: 12});
    assert.deepEqual(lit.world.chain.map(({kind, by, at, cause, landed}) => ({kind, by, at, cause, landed})), [
        {kind: given, by: colonyId, at: 15, cause: `colony.window:${colonyId}:15`, landed: 12},
    ]);
    assert.equal(advance(lit, 19).world.holders[guId].place, 'ridge');

    const arrived = advance(reload(lit), 20);
    assert.equal(arrived.world.holders[guId].place, 'hill');
    assert.equal(arrived.world.holders['other-diet'].place, 'ridge');
    assert.equal(arrived.world.holders['dead-feeder'].place, 'ridge');
    assert.deepEqual(arrived.world.holders[guId].state[FORAGE_ATTRACTION].lastMove,
        {at: 20, from: 'ridge', to: 'hill', light: hillProfile.light, here: 0, there: 12, minimum: 8});
    assert.deepEqual(arrived.world.chain.slice(1).map(({kind, at, place, by, cause}) => ({kind, at, place, by, cause})), [
        {kind: 'departed', at: 20, place: 'ridge', by: guId, cause: `${FORAGE_ATTRACTION}:follow-light`},
        {kind: 'arrived', at: 20, place: 'hill', by: guId, cause: `${FORAGE_ATTRACTION}:follow-light`},
    ]);
    assert.ok(look(arrived, keeper).includes(guId));
    assert.ok(!look(arrived, 'distant-keeper').includes(guId));
    assert.ok(!look(advance(fixture({conceal: true}), 20), keeper).includes(guId));
});

const sighting = 'fixture.light-feeder.sighting';
const rival = defineAgent({id: keeper, revision: 0, label: 'The rival keeper', wants: {hunt: {weight: 1}}, thrift: 0.1});
const moonlight = guMethods('moonlight').activate;
const cast = {
    id: 'moonlight', label: 'casts Moonlight', law: guWorkingLaw,
    // G activates the held Gu. The host supplies the intended target as a
    // reference in the fingerprint and checks it at K's authority port.
    method: {...moonlight, roles: {...moonlight.roles, target: 'body'},
        steps: moonlight.steps.map(step => ({...step, minutes: 1,
            options: {pool: essencePool, source: 'aperture', rank: 1, stage: 'initial'}}))},
    bindings: {gu: guRef(blade), operator: {id: keeper, kind: 'operator'}, target: {id: guId, kind: 'body'}},
    serves: quote => ({hunt: quote.effects.some(effect => effect.kind === 'damage') ? 1 : 0}),
    cost: quote => quote.facts.startingEssence - quote.facts.reserves[keeper][essencePool],
    costWhy: () => 'it spends primeval essence',
};

function knowledgePlan() {
    const participants = [keeper, witness];
    const actors = Object.fromEntries(participants.map(id => [id, {}]));
    const simulation = createSimulationState();
    simulation.people = Object.fromEntries(participants.map(id => [id, {life: 'alive'}]));
    return {state: {clock: 0, actors, simulation}, gameplay: {}};
}

// The fixture schedules a local W sight sweep and translates a positive
// reading into a native N write. W's generic sense primitive takes a scope
// from its caller, so the sweep is anchored to the observer's current place.
function observeFeeder(run, plan, observer) {
    const {clock} = run.world;
    const {place} = run.world.holders[observer];
    const cause = `fixture.sight:${observer}:${clock}`;
    const {world, outcome} = applyEffect(run.rules, run.world, {
        verb: 'sense', channel: 'sight', by: observer, target: {shape: 'present', place},
        reads: ['property:alive', 'vitality'],
    }, cause);
    const seen = outcome.observed.some(row => row.target === guId && row['property:alive'] && row.vitality > 0);
    plan.state.clock = clock;
    if (seen) applySimulationEffects(plan, [{type: 'knowledge', key: sighting, stage: 'seen', value: place}],
        {actorId: observer}, {}, cause);
    return {...run, world};
}

function ownMeans(world, ref) {
    const operator = world.holders[keeper];
    if (!operator.properties.alive) return undefined;
    if (ref.kind === 'operator' && ref.id === keeper) return ref;
    const held = world.holders[ref.id];
    const specimen = held?.state.specimen;
    if (ref.kind === 'gu' && specimen?.holder === keeper && held.place === operator.place) {
        return asBoundGu({...specimen, alive: held.properties.alive});
    }
}

function rivalQuote(run, plan) {
    const at = run.world.clock;
    const entry = plan.state.simulation.knowledge[keeper]?.[sighting];
    const observedHere = entry?.at === at && entry.value === run.world.holders[keeper].place;
    const funds = readQuantity(run.world, keeper, essencePool);
    const facts = {day: Math.floor(at / day), startingEssence: funds, reserves: {[keeper]: {[essencePool]: funds}}};
    const needs = {hunt: {urgency: 1, why: 'it wants to hunt the wild feeder it saw here'}};
    const knows = ref => ref.kind === 'body' ? (observedHere && ref.id === guId ? ref : undefined) : ownMeans(run.world, ref);
    const authority = ({bindings}) => knows(bindings.target) ? {ok: true} : {ok: false, reason: 'no current local sighting'};
    const choice = chooseWorking({agent: rival, needs, candidates: [cast], at, knows, authority, facts});
    return {choice, facts, knows, authority};
}

function settleCast(run, record) {
    const {world, rules} = run;
    const reserve = readQuantity(world, keeper, essencePool);
    const starting = record.facts.startingEssence;
    const settled = settleWorking(guWorkingLaw, record, {now: world.clock, ports: {
        read: ref => ownMeans(world, ref),
        authority: ({bindings}) => {
            const target = world.holders[bindings.target.id];
            // This fixture has place-level geometry. A cast can hit within
            // the same place. Other places require a separate range model.
            if (target?.place !== world.holders[keeper].place || !target.properties.alive ||
                readQuantity(world, target.id, 'vitality') <= 0) return {ok: false, reason: 'target unavailable here'};
            return reserve === starting ? {ok: true} : {ok: false, reason: 'essence changed since quote'};
        },
    }});
    if (!settled.effects.length) return {...run, record: settled.record};
    const [{effect, working}] = settled.effects;
    assert.equal(settled.effects.length, 1);
    assert.equal(effect.kind, 'damage');
    const target = record.bindings.target.id;
    const paid = settled.record.facts.reserves[keeper][essencePool];
    const debited = applyWorldOps(rules, world, [{op: 'set', holder: keeper, quantity: essencePool, amount: paid}], working);
    const hit = applyEffect(rules, debited, {verb: 'remove', object: 'vitality', amount: effect.magnitude,
        by: keeper, target: {shape: 'holder', id: target}}, working);
    assert.equal(hit.outcome.applied.length, 1);
    return {...run, world: hit.world, record: settled.record};
}

test('after the wild arrival, a rival quotes and settles Moonlight from its own current sighting', () => {
    const plan = knowledgePlan();
    const before = observeFeeder(advance(fixture({essence: 6}), 19), plan, keeper);
    assert.equal(rivalQuote(before, plan).choice.choice, null);

    const arrived = advance(before, 20);
    assert.equal(arrived.world.holders[guId].place, 'hill');
    const witnessed = observeFeeder(arrived, plan, witness);
    assert.equal(plan.state.simulation.knowledge[witness][sighting].value, 'hill');
    assert.equal(rivalQuote(witnessed, plan).choice.choice, null);

    const seen = observeFeeder(witnessed, plan, keeper);
    const savedPlan = json(plan);
    const sight = {stage: 'seen', value: 'hill', at: 20, cause: `fixture.sight:${keeper}:20`};
    assert.deepEqual(savedPlan.state.simulation.knowledge[keeper][sighting], sight);
    assert.ok(seen.world.chain.some(row => row.cause === sight.cause && row.kind === 'effect.sense' &&
        row.by === keeper && row.place === sight.value && row.at === sight.at));
    const {choice, facts, knows, authority} = rivalQuote(reload(seen), savedPlan);
    assert.deepEqual(choice, rivalQuote(seen, plan).choice);
    assert.equal(choice.choice, cast.id);
    assert.deepEqual(choice.cause.terms.map(({want, value}) => [want, value]), [['hunt', 1], ['cost', -0.4]]);
    assert.equal(choice.quote.facts.reserves[keeper][essencePool], 2);
    assert.deepEqual(choice.quote.effects, [{kind: 'damage', magnitude: 1, range: 1, source: blade}]);
    assert.equal(readQuantity(seen.world, keeper, essencePool), 6);
    assert.equal(readQuantity(seen.world, guId, 'vitality'), 3);

    const id = `${keeper}/${cast.id}/20`;
    const otherActorQuote = quoteForActor(cast.law, cast.method, {id, actor: 'player', bindings: cast.bindings,
        at: 20, known: knows, believedAuthority: authority, knownFacts: facts});
    assert.equal(otherActorQuote.eligible, true);
    assert.equal(otherActorQuote.fingerprint, choice.quote.fingerprint);
    const start = beginQuotedWorking(cast.law, cast.method, {id, bindings: cast.bindings, facts, at: 20,
        ports: {read: knows, authority}, fingerprint: choice.quote.fingerprint});
    assert.equal(start.stale, false);
    assert.equal(settleCast(seen, start.record).record.status, 'running');
    const due = advance(seen, 21);
    const finished = settleCast(due, start.record);
    const restored = restoreWorking(cast.law, serializeWorking(start.record));
    assert.deepEqual(settleCast(reload(due), restored), finished);
    assert.equal(finished.record.status, 'complete');
    assert.equal(finished.record.receipts[0].observed.cost, 4);
    assert.equal(readQuantity(finished.world, keeper, essencePool), 2);
    assert.equal(readQuantity(finished.world, guId, 'vitality'), 2);
    assert.equal(finished.world.chain.filter(row => row.cause === id && row.kind === 'effect.remove').length, 1);
    const saved = restoreWorking(cast.law, serializeWorking(finished.record));
    assert.deepEqual(settleCast(reload(finished), saved), finished);

    const left = {...due, world: applyWorldOps(due.rules, due.world, [{op: 'move', holder: guId, to: 'ridge'}], 'feeder.left')};
    const interrupted = settleCast(left, restored);
    assert.equal(interrupted.record.status, 'interrupted');
    assert.equal(interrupted.record.receipts[0].reason, 'target unavailable here');
    assert.deepEqual(interrupted.world, left.world);

    const spent = {...due, world: applyWorldOps(due.rules, due.world, [
        {op: 'set', holder: keeper, quantity: essencePool, amount: 3},
    ], 'keeper.spent')};
    const unfunded = settleCast(spent, restored);
    assert.equal(unfunded.record.status, 'interrupted');
    assert.equal(unfunded.record.receipts[0].reason, 'essence changed since quote');
    assert.deepEqual(unfunded.world, spent.world);
});

test('hidden, out-of-range, unfunded and missing-means cases cannot choose the working', () => {
    const cases = [
        {options: {conceal: true}, reason: 'no current local sighting'},
        {options: {keeperPlace: 'ridge'}, reason: 'no current local sighting', priorSighting: true},
        {options: {essence: 3}, reason: 'needs more essence', currentSighting: true},
        {options: {}, reason: 'role-unavailable', currentSighting: true, moveBlade: true},
    ];
    for (const {options, reason, priorSighting, currentSighting, moveBlade} of cases) {
        const plan = knowledgePlan();
        let run = advance(fixture({essence: 6, ...options}), 19);
        if (priorSighting) run = observeFeeder(run, plan, keeper);
        run = advance(run, 20);
        assert.equal(run.world.holders[guId].place, 'hill');
        if (moveBlade) run.world = applyWorldOps(run.rules, run.world, [{op: 'move', holder: blade, to: 'ridge'}], 'blade.left');
        run = observeFeeder(run, plan, keeper);
        assert.equal(plan.state.simulation.knowledge[keeper]?.[sighting]?.at, currentSighting ? 20 : priorSighting ? 19 : undefined);
        const {choice} = rivalQuote(run, plan);
        assert.equal(choice.choice, null);
        assert.equal(choice.quote, null);
        assert.equal(choice.cause, null);
        assert.deepEqual(choice.passed, [{id: cast.id, reason}]);
        assert.equal(readQuantity(run.world, keeper, essencePool), options.essence ?? 6);
        assert.equal(readQuantity(run.world, guId, 'vitality'), 3);
    }
});

test('exposure suppresses emergence and a closed connection keeps the feeder out even when the hill lights', () => {
    for (const [options, emerged, light] of [[{exposed: true}, 0, 0], [{open: false}, 3, 36]]) {
        const run = advance(fixture(options), 45);
        assert.equal(guColonyView(run.colony, starFireflyFarm).emerged, emerged);
        assert.equal(readQuantity(run.world, 'hill', hillProfile.light), light);
        assert.equal(run.world.holders[guId].place, 'ridge');
        assert.ok(!run.world.chain.some(row => row.kind === 'arrived'));
        assert.ok(!look(run, keeper).includes(guId));
    }
});

test('a far day agrees across host-window jumps, minute steps and JSON reloads with the causal receipts intact', t => {
    const initial = fixture();
    const start = performance.now();
    const jump = advance(initial, day);
    const elapsed = performance.now() - start;
    t.diagnostic(`far day: ${jump.segments} segments, ${elapsed.toFixed(1)} ms`);
    assert.ok(elapsed < 2000, 'far fixture must settle a day within the MC16 time budget');
    assert.ok(jump.segments < 800, `far day took ${jump.segments} segments`);
    let minutes = initial;
    for (let at = 1; at <= day; at++) minutes = advance(minutes, at);
    let split = initial;
    for (const at of [14, 15, 19, 20, 21, 73, day]) split = reload(advance(split, at));

    for (const run of [minutes, split]) {
        assert.deepEqual(run.world, jump.world);
        assert.deepEqual(run.colony, jump.colony);
    }
    assert.deepEqual(jump.world.chain.map(({kind, at, landed}) => [kind, at, landed]), [
        [given, 15, 12], ['departed', 20, 0], ['arrived', 20, 0], [given, 30, 12], [given, 45, 12],
    ]);
    assert.equal(readQuantity(jump.world, 'hill', hillProfile.light), 36);
    assert.equal(jump.world.holders[guId].place, 'hill');
});

test('another diet uses its own key and cadence, taking one improving hop at a time', () => {
    const light = 'light:moon';
    const connections = [
        {from: 'start', to: 'bank-b', open: true},
        {from: 'start', to: 'bank-a', open: true},
        {from: 'bank-a', to: 'crest', open: true},
        {from: 'crest', to: 'bank-b', open: true},
        {from: 'peak', to: 'crest', open: true},
    ];
    const options = {profiles: [{light, minimum: 10, interval: 5}], connections, maxNeighbors: 2};
    assert.throws(() => createForageAttractionPack({...options, maxNeighbors: 1}), /neighbor budget exceeded/);
    const rules = composeSubstrate({packs: [createForageAttractionPack(options)]});
    const places = [['start', 2], ['bank-a', 12], ['bank-b', 12], ['crest', 18], ['peak', 100]];
    const body = (id, place) => ({id, kind: 'body', place, properties: {alive: true, forage_light: light}});
    const initial = createWorld(rules, {holders: [
        ...places.map(([id, grade]) => ({id, kind: 'place', quantities: {[light]: grade}})),
        body('seeker', 'start'), body('crest-dweller', 'crest'),
    ]});
    const dim = applyWorldOps(rules, initial, ['bank-a', 'bank-b'].map(holder =>
        ({op: 'set', holder, quantity: light, amount: 9})), 'moon.dims');
    assert.equal(advanceWorld(rules, dim, 5).world.holders.seeker.place, 'start');
    assert.equal(advanceWorld(rules, initial, 5).world.holders.seeker.place, 'bank-a');
    const later = advanceWorld(rules, initial, 20).world;
    assert.equal(later.holders.seeker.place, 'crest');
    assert.equal(later.holders['crest-dweller'].place, 'crest');
    assert.deepEqual(later.chain.filter(row => row.kind === 'arrived').map(row => [row.at, row.place]),
        [[5, 'bank-a'], [10, 'crest']]);
});
