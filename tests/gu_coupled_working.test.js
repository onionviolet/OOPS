import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

import {compileGuCoupledBeat, GU_CHANNEL_RECHARGE_LAW, guChannelRechargeWorking, readGuCoupledRoute} from '../src/gu_coupled_working.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {asBoundGu, guMethods} from '../src/gu_working_law.js';
import {composeWorking, defineComposition} from '../src/kernel_compose.js';
import {beginQuotedWorking, beginWorking, quoteForActor, quoteWorking, restoreWorking, serializeWorking,
    settleWorking, defineWorkingLaw} from '../src/kernel_working.js';
import {icebladeStormBeat, icebladeStormRouteBeat, icebladeStormWorldBeat} from '../src/world_packs/gu_coupled_move_rows.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {GU_FORMATION_PLATE_LAW, GU_FORMATION_PLATE_PROPERTIES, guFormationPlateMethod} from '../src/world_packs/gu_formation_plate.js';
import {GU_USE_AGREEMENT_LAW, GU_USE_AGREEMENT_PROPERTIES, guUseAgreementWorking} from '../src/world_packs/gu_use_agreement.js';
import {GU_WARD_BREAK_LAW, guWardBreakWorking} from '../src/world_packs/gu_ward_break.js';

const operator = {id: 'keeper', kind: 'operator'};
const place = {id: 'trial-yard', kind: 'place'};
const specimen = (id, kind) => asBoundGu({id, kind, rank: 1, alive: true, fedThrough: 13, holder: operator.id});
const ref = ({id, kind}) => ({id, kind});
const charge = amount => ({quantity: 'essence.primeval', holder: operator.id, amount});
const reserve = amount => ({keeper: {primeval: amount}});

// A second, synthetic use of the same compiler. It has two roles and no
// spatial scope. Its earlier receipt lets us check shared reserves on refusal.
const screenBeat = {
    id: 'screen-test', revision: 1, minutes: 1,
    participants: [
        {id: 'first', kind: 'white-jade', fuel: 'primeval', cost: 1},
        {id: 'second', kind: 'moonlight', fuel: 'primeval', cost: 1},
    ],
    effect: {kind: 'screen-test'},
};

function composeStorm(stormRow = icebladeStormBeat) {
    const screen = compileGuCoupledBeat(screenBeat);
    const storm = compileGuCoupledBeat(stormRow);
    const roles = {...screen.method.roles, ...storm.method.roles};
    const slots = Object.entries({screen, storm}).map(([name, {method}]) => ({
        name, needs: method.roles, bindings: method.steps[0].bindings, facts: 'shared',
    }));
    return composeWorking(defineComposition({id: 'trial.coupled', revision: 1, roles, slots}), {screen, storm});
}

function fixture(amount = 10) {
    const things = {
        operator, place,
        blade: specimen('loan-ice', 'ice-blade'),
        swirl: specimen('loan-swirl', 'swirl'),
        wind: specimen('loan-wind', 'fierce-wind'),
        first: specimen('loan-jade', 'white-jade'),
        second: specimen('loan-moon', 'moonlight'),
    };
    const request = {
        id: 'trial.cast', at: 10, facts: {reserves: reserve(amount)},
        bindings: Object.fromEntries(Object.entries(things).map(([role, thing]) => [role, ref(thing)])),
        ports: {read: ref => Object.values(things).find(thing => thing.id === ref.id)},
    };
    return {things, request};
}

const screenIntent = {kind: 'screen-test'};
const stormIntent = {kind: 'iceblade-storm', attack: true, defense: true, freezesGround: true, moving: true,
    scope: {place: 'trial-yard', radius: 3}};

test('ch. 167 exact roles settle one combined, scoped intent at the quoted deadline', () => {
    const evidence = JSON.parse(readFileSync(new URL('../docs/research/gu-identity-evidence.json', import.meta.url), 'utf8'));
    const source = evidence.moves.find(row => row.id === 'iceblade-storm');
    assert.deepEqual(icebladeStormBeat.participants.map(({id, kind}) => ({id, kind})),
        source.roles.map(({id, kind}) => ({id, kind})));
    for (const {kind} of source.roles) assert.equal(guMethods(kind).activate, undefined);

    const {law, method} = composeStorm();
    const {request} = fixture();
    const quote = quoteWorking(law, method, request);
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.deadlines, [11, 13]);
    assert.deepEqual(quote.costs, [1, 1, 2, 1, 2].map(charge));
    assert.deepEqual(quote.effects, [screenIntent, stormIntent]);
    assert.deepEqual(request.facts.reserves, reserve(10));

    const {stale, record} = beginQuotedWorking(law, method, {...request, fingerprint: quote.fingerprint});
    assert.equal(stale, false);
    const mid = settleWorking(law, record, {now: 12, ports: request.ports});
    assert.equal(mid.record.status, 'running');
    assert.deepEqual(mid.record.facts.reserves, reserve(8));
    assert.deepEqual(mid.effects.map(row => row.effect), [screenIntent]);
    const done = settleWorking(law, mid.record, {now: 13, ports: request.ports});
    assert.equal(done.record.status, 'complete');
    assert.deepEqual(done.record.facts, quote.facts);
    assert.deepEqual(done.record.facts.reserves, reserve(3));
    assert.deepEqual(done.record.receipts[1].bindings,
        {operator: 'keeper', place: 'trial-yard', blade: 'loan-ice', swirl: 'loan-swirl', wind: 'loan-wind'});
    assert.deepEqual(done.record.receipts[1].truth.costs, [2, 1, 2].map(charge));
    assert.deepEqual(done.effects, [{working: 'trial.cast', step: 1, at: 13, effect: stormIntent}]);
});

test('the final participant cannot partially spend a short beat or undo the earlier paid beat', () => {
    const {law, method} = composeStorm();
    const {request} = fixture(6);
    const quote = quoteWorking(law, method, request);
    assert.equal(quote.ok, false);
    assert.equal(quote.failedStep, 1);
    assert.equal(quote.reason, 'needs more essence');
    assert.deepEqual(quote.costs, [charge(1), charge(1)]);
    assert.deepEqual(quote.facts.reserves, reserve(4));

    const run = settleWorking(law, beginWorking(law, method, request), {now: 13, ports: request.ports});
    assert.equal(run.record.status, 'interrupted');
    assert.equal(run.record.cursor, 1);
    assert.deepEqual(run.record.facts, quote.facts);
    assert.deepEqual(run.record.receipts[1].truth, {facts: {}, effects: []});
    assert.deepEqual(run.effects.map(row => row.effect), [screenIntent]);
});

test('live reads refuse missing, lent, substituted or unfed Gu and a missing place at the storm deadline', () => {
    const {law, method} = composeStorm();
    for (const [scenario, reason, role] of [
        ['missing-gu', 'role-unavailable', 'wind'],
        ['lent', 'gu-not-held', undefined],
        ['substituted', 'wrong-gu-kind', undefined],
        ['unfed', 'needs feeding', undefined],
        ['missing-place', 'role-unavailable', 'place'],
    ]) {
        const {request, things} = fixture();
        const quote = quoteWorking(law, method, request);
        assert.equal(quote.ok, true);
        const {record} = beginQuotedWorking(law, method, {...request, fingerprint: quote.fingerprint});
        const mid = settleWorking(law, record, {now: 11, ports: request.ports});
        const ports = {read(ref, at) {
            if (at === 13 && scenario === 'missing-place' && ref.id === place.id) return null;
            const thing = request.ports.read(ref, at);
            if (at !== 13 || ref.id !== things.wind.id) return thing;
            if (scenario === 'missing-gu') return null;
            if (scenario === 'lent') return {...thing, holder: 'other'};
            if (scenario === 'unfed') return {...thing, fedThrough: 12};
            return {...thing, guKind: 'swirl'};
        }};
        const run = settleWorking(law, mid.record, {now: 13, ports});
        const refusal = run.record.receipts.at(-1);
        assert.equal(run.record.status, 'interrupted', scenario);
        assert.equal(refusal.reason, reason, scenario);
        assert.equal(refusal.role, role, scenario);
        assert.deepEqual(refusal.truth, {facts: {}, effects: []}, scenario);
        assert.deepEqual(run.effects, [], scenario);
        assert.deepEqual(run.record.facts.reserves, reserve(8), scenario);
    }
});

test('one held specimen cannot fill two roles in a coupled beat', () => {
    const {law, method} = composeStorm();
    const {request} = fixture();
    const quote = quoteWorking(law, method, {...request, bindings: {...request.bindings, wind: request.bindings.swirl}});
    assert.equal(quote.ok, false);
    assert.equal(quote.reason, 'duplicate-gu');
    assert.deepEqual(quote.facts.reserves, reserve(8));
    assert.deepEqual(quote.effects, [screenIntent]);
});

test('K refuses stale funding and quotes an unknown constituent without reading live truth', () => {
    const {law, method} = composeStorm();
    const {request, things} = fixture();
    const quote = quoteWorking(law, method, request);
    const changed = beginQuotedWorking(law, method, {...request, facts: {reserves: reserve(6)}, fingerprint: quote.fingerprint});
    assert.equal(changed.stale, true);
    assert.equal(changed.record, undefined);
    const actorQuote = quoteForActor(law, method, {...request, actor: operator.id, knownFacts: request.facts,
        known: (ref, at) => ref.id === things.wind.id ? null : request.ports.read(ref, at)});
    assert.equal(actorQuote.eligible, false);
    assert.deepEqual(actorQuote.reasons, [{step: null, role: 'wind', cause: 'unknown', reason: 'role-unknown'}]);
    assert.deepEqual(actorQuote.effects, []);
    assert.deepEqual(actorQuote.costs, []);
});

test('mid-working JSON restore preserves the paid step, deadline and one combined output', () => {
    const {law, method} = composeStorm();
    const {request} = fixture();
    const quote = quoteWorking(law, method, request);
    const {record} = beginQuotedWorking(law, method, {...request, fingerprint: quote.fingerprint});
    const mid = settleWorking(law, record, {now: 12, ports: request.ports});
    const saved = serializeWorking(mid.record);
    const reloaded = composeStorm();
    const restored = restoreWorking(reloaded.law, saved);
    const resumed = settleWorking(reloaded.law, restored, {now: 30, ports: request.ports});
    const uninterrupted = settleWorking(law, record, {now: 30, ports: request.ports});
    assert.equal(resumed.record.status, 'complete');
    assert.deepEqual(resumed.effects.map(row => row.effect), [stormIntent]);
    assert.deepEqual(resumed.record, uninterrupted.record);
    assert.deepEqual([...mid.effects, ...resumed.effects], uninterrupted.effects);
    assert.equal(restored.fingerprint, quote.fingerprint);
    assert.deepEqual(settleWorking(reloaded.law, resumed.record, {now: 31, ports: request.ports}).effects, []);
    assert.throws(() => restoreWorking(composeStorm({...icebladeStormBeat, revision: 2}).law, saved), /different law/);
});

const stormWorld = compileGuCoupledBeat(icebladeStormWorldBeat);
const counterLaw = defineWorkingLaw({id: 'trial.storm-counter', revision: 1, operations: {
    strike: {roles: {actor: 'creature', target: 'creature', ground: 'place'}, settle({bound}) {
        if (bound.actor.place !== bound.ground.id || bound.target.place !== bound.ground.id) {
            return {ok: false, reason: 'target out of reach'};
        }
        const frost = bound.ground.quantities.temperature <= 0;
        return {ok: true, observed: {frost}, effects: [{
            sentence: {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant',
                carrier: 'body', cost: 'none', limits: []},
            details: {target: {shape: 'holder', id: bound.target.id}, amount: frost ? 2 : 4},
        }]};
    }},
}});
const counterMethod = {
    id: 'trial.counter', revision: 1, law: counterLaw.ref,
    roles: {actor: 'creature', target: 'creature', ground: 'place'},
    steps: [{op: 'strike', minutes: 3, bindings: {actor: 'actor', target: 'target', ground: 'ground'}}],
};
const stormConfig = {
    packs: ['l.living_body'],
    shared: {
        quantities: sharedQuantities(['energy', 'temperature', 'vitality']),
        properties: [...sharedProperties(['alive']),
            {id: 'gu_kind', type: 'label'}, {id: 'gu_keeper', type: 'label'},
            {id: 'gu_controller', type: 'label'}, ...GU_USE_AGREEMENT_PROPERTIES,
            {id: 'track_position', type: 'level', min: 0}],
    },
    host: {laws: [stormWorld.law, counterLaw]},
};
const energy = 'energy:primeval.rank1';
const stormBindings = {
    operator, origin: {id: 'bank', kind: 'place'}, place: {id: 'ford', kind: 'place'},
    target: {id: 'rival', kind: 'creature'},
    ...Object.fromEntries(icebladeStormBeat.participants.map(({id}) => [id, {id: 'live-' + id, kind: 'gu'}])),
};
function stormEngine({essence = 8, useUntil, cast = stormWorld, config = stormConfig, start = true, extra = []} = {}) {
    const holders = [
        {id: 'bank', kind: 'place', properties: {track_position: 0}, quantities: {temperature: 6}},
        {id: 'ford', kind: 'place', properties: {track_position: 3}, quantities: {temperature: 6}},
        {id: 'keeper', kind: 'body', as: ['operator', 'creature'], place: 'bank', quantities: {vitality: 12, [energy]: essence}},
        {id: 'rival', kind: 'body', as: ['creature'], place: 'ford', quantities: {vitality: 12}},
        {id: 'bystander', kind: 'body', as: ['creature'], place: 'bank', quantities: {vitality: 12}},
        ...icebladeStormBeat.participants.map(({id, kind}) => ({
            id: 'live-' + id, kind: 'body', as: ['gu'], tags: ['living.body'], place: 'bank',
            quantities: {satiety: 6}, state: {'l.living_body': livingBodyState({species: kind, rate: 1})},
            properties: {alive: true, gu_kind: kind, gu_keeper: 'keeper',
                ...(id === 'wind' && useUntil !== undefined
                    ? {gu_controller: 'rival', gu_use_grantee: 'keeper', gu_use_until: useUntil}
                    : {gu_controller: 'keeper'})},
        })),
    ];
    const engine = createEngineWorld({...config, holders: [...holders, ...extra]});
    return start ? startEngineWorking(engine, {...cast, id: 'storm', bindings: stormBindings, payer: 'keeper'}) : engine;
}

const worldCounter = (engine, id) => startEngineWorking(engine, {
    law: counterLaw, method: counterMethod, id, payer: 'rival',
    bindings: {actor: stormBindings.target, target: {id: 'keeper', kind: 'creature'}, ground: stormBindings.place},
});
function advance(engine, minute) {
    const result = advanceEngineWorld(engine, minute);
    assert.equal(result.pending, false);
    return result.engine;
}

test('the engine pays for the exact Iceblade Storm Gu and the rival reads frozen ground and timed protection', () => {
    const initial = worldCounter(stormEngine(), 'counter');
    const mid = advance(initial, 1);
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(mid))), stormConfig);
    const shielded = advance(restored, 3);
    assert.deepEqual(serializeEngineWorld(shielded), serializeEngineWorld(advance(initial, 3)));
    const {holders, laws} = shielded.world;
    const storm = shielded.records.workings.storm;
    assert.equal(storm.record.status, 'complete');
    assert.deepEqual(storm.record.receipts[0].bindings, {
        operator: 'keeper', origin: 'bank', place: 'ford', target: 'rival',
        blade: 'live-blade', swirl: 'live-swirl', wind: 'live-wind',
    });
    assert.deepEqual(storm.record.receipts[0].truth.paid.lines.map(row => [row.payer, row.quantity, row.amount]),
        [['keeper', energy, 2], ['keeper', energy, 1], ['keeper', energy, 2]]);
    assert.equal(holders.keeper.quantities[energy], 3);
    for (const id of ['keeper', 'live-blade', 'live-swirl', 'live-wind']) assert.equal(holders[id].place, 'ford');
    assert.deepEqual([holders.ford.quantities.temperature, holders.bank.quantities.temperature,
        holders.rival.quantities.vitality, holders.bystander.quantities.vitality], [-4, 6, 8, 12]);
    assert.ok(laws.some(field => field.scope === 'keeper' && field.kind === 'block' && field.until === 5));
    assert.deepEqual(shielded.records.workings.counter.record.receipts[0].observed, {frost: true});
    assert.equal(holders.keeper.quantities.vitality, 12, 'a timely guard leaves zero harm');
    const after = advance(worldCounter(shielded, 'second.counter'), 6);
    assert.equal(after.world.holders.keeper.quantities.vitality, 10, 'the cold ground still changes the hit after guard expiry');
    const thawed = applyEngineOps(shielded, [
        {op: 'set', holder: 'ford', quantity: 'temperature', amount: 6},
    ], 'fixture.thaw');
    const clearFooting = advance(worldCounter(thawed, 'second.counter'), 6);
    assert.equal(clearFooting.world.holders.keeper.quantities.vitality, 8, 'the same counter hits harder after thawing');
});

function routedStorm(row = icebladeStormRouteBeat) {
    const cast = compileGuCoupledBeat(row);
    const config = {...stormConfig, host: {laws: [cast.law, GU_CHANNEL_RECHARGE_LAW], ports: {readThing: readGuCoupledRoute}},
        shared: {...stormConfig.shared, properties: [...stormConfig.shared.properties, {id: 'contest_side', type: 'label'}]}};
    const fighter = (id, place, side) => ({id, kind: 'body', place, properties: {alive: true, contest_side: side},
        quantities: {vitality: 12}});
    const engine = stormEngine({config, start: false, extra: [
        {id: 'bend', kind: 'place', quantities: {temperature: 6}},
        fighter('arrival', 'bank', 'red'), fighter('departure', 'bend', 'red'),
        fighter('ally', 'bend', 'blue'), fighter('warded', 'bend', 'red'),
        ...(cast.method.roles.supporter ? [{...fighter('supporter', 'bank', 'blue'), as: ['operator'],
            quantities: {vitality: 12, [energy]: 3}}] : []),
    ]});
    const scene = applyEngineOps(engine, [
        {op: 'property', holder: 'keeper', property: 'contest_side', value: 'blue'},
        {op: 'property', holder: 'rival', property: 'contest_side', value: 'red'},
        {op: 'property', holder: 'rival', property: 'alive', value: true},
        {op: 'link_add', link: {id: 'first', kind: 'storm-track', from: 'bank', to: 'bend', cost: 1}},
        {op: 'link_add', link: {id: 'second', kind: 'storm-track', from: 'bend', to: 'ford', cost: 2}},
        {op: 'law_add', field: {id: 'ward', kind: 'block', scope: 'warded', params: {verb: 'remove', object: 'vitality'}}},
    ], 'fixture:storm-track');
    const {target: _target, ...bindings} = stormBindings;
    const pending = startEngineWorking(scene, {...cast, id: 'storm', bindings: {...bindings,
        corridor: {id: 'ford', kind: 'gu-coupled-route'},
        ...(cast.method.roles.supporter && {supporter: {id: 'supporter', kind: 'operator'}})}});
    return {pending, restore: state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config)};
}

test('a routed Iceblade Storm reads live foes and freezes the ground it crosses', () => {
    const {pending, restore} = routedStorm();
    const live = applyEngineOps(advance(pending, 1), [
        {op: 'move', holder: 'arrival', to: 'bend'},
        {op: 'move', holder: 'departure', to: 'bank'},
    ], 'fixture:crossing-foes');
    const result = advance(restore(live), 2);
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(live, 2)));
    const {holders} = result.world;
    assert.equal(holders.keeper.quantities[energy], 3);
    assert.equal(holders.keeper.place, 'ford');
    assert.deepEqual(['rival', 'arrival', 'departure', 'ally', 'warded', 'bystander'].map(id => holders[id].quantities.vitality),
        [8, 8, 12, 12, 12, 12]);
    assert.deepEqual(['bank', 'bend', 'ford'].map(id => holders[id].quantities.temperature), [6, -4, -4]);
    const closed = applyEngineOps(live, [{op: 'link_set', id: 'second', state: 'closed'}], 'fixture:closed-storm-track');
    const refused = advance(restore(closed), 2);
    assert.equal(refused.records.workings.storm.record.receipts[0].reason, 'storm route unavailable');
    assert.equal(refused.world.holders.keeper.quantities[energy], 8);
    assert.equal(refused.world.holders.bend.quantities.temperature, 6);
});

test('a staged Storm keeps its paid first crossing if an opponent cuts the second', () => {
    const row = {...icebladeStormRouteBeat, id: 'iceblade-storm-staged', world: {...icebladeStormRouteBeat.world,
        route: {...icebladeStormRouteBeat.world.route, crossings: ['first', 'second']}}};
    const {pending, restore} = routedStorm(row);
    const raised = advance(pending, 2);
    assert.equal(raised.world.holders.keeper.place, 'bank');
    assert.equal(raised.world.holders.keeper.quantities[energy], 3);
    assert.ok(raised.world.laws.some(field => field.scope === 'keeper' && field.until === 5));
    const first = advance(restore(raised), 3);
    assert.equal(first.world.holders.keeper.place, 'bend');
    assert.equal(first.world.holders.departure.quantities.vitality, 8);
    assert.equal(first.world.holders.bend.quantities.temperature, -4);
    assert.equal(first.world.holders.ford.quantities.temperature, 6);
    const finished = advance(restore(first), 4);
    assert.deepEqual(serializeEngineWorld(finished), serializeEngineWorld(advance(pending, 4)));
    assert.equal(finished.world.holders.keeper.place, 'ford');
    assert.equal(finished.world.holders.rival.quantities.vitality, 8);
    assert.equal(finished.world.holders.keeper.quantities[energy], 3);

    const cut = applyEngineOps(first, [{op: 'link_set', id: 'second', state: 'closed'}], 'fixture:cut-crossing');
    const interrupted = advance(restore(cut), 4);
    assert.deepEqual(serializeEngineWorld(interrupted), serializeEngineWorld(advance(cut, 4)));
    assert.equal(interrupted.records.workings.storm.record.receipts.at(-1).reason, 'storm crossing unavailable');
    for (const id of ['keeper', 'live-blade', 'live-swirl', 'live-wind'])
        assert.equal(interrupted.world.holders[id].place, 'bend');
    assert.equal(interrupted.world.holders.keeper.quantities[energy], 3);
    assert.equal(interrupted.world.holders.departure.quantities.vitality, 8);
    assert.equal(interrupted.world.holders.rival.quantities.vitality, 12);
    assert.equal(interrupted.world.holders.ford.quantities.temperature, 6);

    const hungry = applyEngineOps(first, [{op: 'set', holder: 'live-wind', quantity: 'satiety', amount: 0}],
        'fixture:wind-starved');
    const fizzled = advance(restore(hungry), 4);
    assert.equal(fizzled.records.workings.storm.record.receipts.at(-1).reason, 'storm constituent unavailable');
    assert.equal(fizzled.world.holders.keeper.place, 'bend');
    assert.equal(fizzled.world.holders.rival.quantities.vitality, 12);
    assert.equal(fizzled.world.holders.keeper.quantities[energy], 3);
});

test('crossing upkeep spends only for a funded leg and can use essence supplied after launch', () => {
    const row = {...icebladeStormRouteBeat, id: 'iceblade-storm-upkeep', world: {...icebladeStormRouteBeat.world,
        route: {...icebladeStormRouteBeat.world.route, crossings: ['first', 'second'], crossingFuel: {primeval: 2}}}};
    const {pending, restore} = routedStorm(row);
    const first = advance(pending, 3);
    assert.equal(first.world.holders.keeper.quantities[energy], 1);
    assert.deepEqual(first.records.workings.storm.record.receipts[1].truth.paid.lines
        .map(({payer, quantity, amount}) => [payer, quantity, amount]), [['keeper', energy, 2]]);
    const stopped = advance(restore(first), 4);
    assert.deepEqual(serializeEngineWorld(stopped), serializeEngineWorld(advance(pending, 4)));
    assert.equal(stopped.records.workings.storm.record.receipts.at(-1).reason, 'storm crossing essence unavailable');
    assert.equal(stopped.world.holders.keeper.quantities[energy], 1);
    assert.equal(stopped.world.holders.keeper.place, 'bend');
    assert.equal(stopped.world.holders.bend.quantities.temperature, -4);
    assert.equal(stopped.world.holders.rival.quantities.vitality, 12);

    const funded = applyEngineOps(first, [{op: 'add', holder: 'keeper', quantity: energy, amount: 1}], 'fixture:more-essence');
    const finished = advance(restore(funded), 4);
    assert.deepEqual(serializeEngineWorld(finished), serializeEngineWorld(advance(funded, 4)));
    assert.equal(finished.world.holders.keeper.quantities[energy], 0);
    assert.equal(finished.world.holders.keeper.place, 'ford');
    assert.equal(finished.world.holders.rival.quantities.vitality, 8);
    const cut = applyEngineOps(funded, [{op: 'link_set', id: 'second', state: 'closed'}], 'fixture:cut-crossing');
    const blocked = advance(restore(cut), 4);
    assert.equal(blocked.world.holders.keeper.quantities[energy], 2);
    assert.equal(blocked.records.workings.storm.record.receipts.at(-1).reason, 'storm crossing unavailable');
});

test('a staged Storm takes crossing costs from two live cultivators atomically', () => {
    const base = icebladeStormRouteBeat;
    const row = {...base, id: 'iceblade-storm-joint-upkeep', world: {...base.world,
        route: {...base.world.route, crossings: ['first', 'second'], crossingFuel: {primeval: 1}, supportFuel: {primeval: 2}},
        effects: [...base.world.effects, {verb: 'move', object: 'position', role: 'supporter', details: {}}]}};
    const {pending, restore} = routedStorm(row);
    const first = advance(pending, 3);
    const balance = (state, id) => state.world.holders[id].quantities[energy];
    assert.equal(balance(first, 'keeper'), 2);
    assert.equal(balance(first, 'supporter'), 1);
    assert.equal(first.world.holders.supporter.place, 'bend');
    assert.deepEqual(first.records.workings.storm.record.receipts[1].truth.paid.lines
        .map(({payer, amount}) => [payer, amount]), [['keeper', 1], ['supporter', 2]]);
    const stopped = advance(restore(first), 4);
    assert.deepEqual(serializeEngineWorld(stopped), serializeEngineWorld(advance(pending, 4)));
    assert.equal(stopped.records.workings.storm.record.receipts.at(-1).reason, 'storm crossing essence unavailable');
    assert.equal(balance(stopped, 'keeper'), 2);
    assert.equal(balance(stopped, 'supporter'), 1);
    assert.equal(stopped.world.holders.ford.quantities.temperature, 6);

    const funded = applyEngineOps(first, [{op: 'add', holder: 'supporter', quantity: energy, amount: 1}], 'fixture:support-funded');
    const finished = advance(restore(funded), 4);
    assert.deepEqual(serializeEngineWorld(finished), serializeEngineWorld(advance(funded, 4)));
    assert.equal(balance(finished, 'keeper'), 1);
    assert.equal(balance(finished, 'supporter'), 0);
    assert.equal(finished.world.holders.supporter.place, 'ford');
    assert.equal(finished.world.holders.rival.quantities.vitality, 8);

    const apart = applyEngineOps(funded, [{op: 'move', holder: 'supporter', to: 'bank'}], 'fixture:support-leaves');
    const interrupted = advance(restore(apart), 4);
    assert.equal(interrupted.records.workings.storm.record.receipts.at(-1).reason, 'storm crossing supporter unavailable');
    assert.equal(balance(interrupted, 'keeper'), 2);
    assert.equal(balance(interrupted, 'supporter'), 2);
});

test('an essence channel funds crossings remotely until its live reach is cut', () => {
    const base = icebladeStormRouteBeat;
    const row = {...base, id: 'iceblade-storm-remote-upkeep', world: {...base.world,
        route: {...base.world.route, crossings: ['first', 'second'], crossingFuel: {primeval: 1}, supportFuel: {primeval: 2},
            supportChannel: {kind: 'essence-channel', reach: 2}}}};
    const {pending, restore} = routedStorm(row);
    const prepared = applyEngineOps(pending, [
        {op: 'holder_add', value: {id: 'lookout', kind: 'place'}},
        {op: 'move', holder: 'supporter', to: 'lookout'},
        {op: 'set', holder: 'supporter', quantity: energy, amount: 4},
        {op: 'link_add', link: {id: 'to-bank', kind: 'essence-channel', from: 'lookout', to: 'bank', oneWay: true, cost: 1}},
        {op: 'link_add', link: {id: 'to-bend', kind: 'essence-channel', from: 'bank', to: 'bend', oneWay: true, cost: 1}},
    ], 'fixture:essence-channel');
    const first = advance(prepared, 3);
    assert.equal(first.world.holders.keeper.place, 'bend');
    assert.equal(first.world.holders.supporter.place, 'lookout');
    assert.equal(first.world.holders.supporter.quantities[energy], 2);
    const finished = advance(restore(first), 4);
    assert.deepEqual(serializeEngineWorld(finished), serializeEngineWorld(advance(prepared, 4)));
    assert.equal(finished.world.holders.keeper.place, 'ford');
    assert.equal(finished.world.holders.supporter.place, 'lookout');
    assert.equal(finished.world.holders.supporter.quantities[energy], 0);
    assert.equal(finished.world.holders.rival.quantities.vitality, 8);

    const reservoir = refillPerMinute => applyEngineOps(prepared, [{
        op: 'law_add', field: {id: 'lookout-reservoir', scope: 'world', kind: 'gu.essence-channel-capacity',
            params: {link: 'to-bank', capacity: 2, refillPerMinute}},
    }], 'fixture:channel-reservoir');
    const slow = reservoir(1);
    const depleted = advance(slow, 3);
    const stoppedByCapacity = advance(restore(depleted), 4);
    assert.deepEqual(serializeEngineWorld(stoppedByCapacity), serializeEngineWorld(advance(slow, 4)));
    assert.equal(stoppedByCapacity.records.workings.storm.record.receipts.at(-1).reason, 'storm support channel capacity unavailable');
    assert.equal(stoppedByCapacity.world.holders.keeper.place, 'bend');
    assert.equal(stoppedByCapacity.world.holders.keeper.quantities[energy], 2);
    assert.equal(stoppedByCapacity.world.holders.supporter.quantities[energy], 2);
    assert.deepEqual(stoppedByCapacity.world.laws.find(field => field.id === 'lookout-reservoir').params,
        {link: 'to-bank', capacity: 2, refillPerMinute: 1, at: 3, used: 2});
    const fast = reservoir(2);
    const refilled = advance(restore(advance(fast, 3)), 4);
    assert.deepEqual(serializeEngineWorld(refilled), serializeEngineWorld(advance(fast, 4)));
    assert.equal(refilled.world.holders.keeper.place, 'ford');
    assert.equal(refilled.world.holders.supporter.quantities[energy], 0);

    const service = applyEngineOps(depleted, [
        {op: 'holder_add', value: {id: 'technician', kind: 'body', as: ['operator'], place: 'lookout',
            properties: {alive: true}, quantities: {[energy]: 2}}},
        {op: 'law_params', id: 'lookout-reservoir', params: {keeper: 'technician', rechargeFuel: energy}},
    ], 'fixture:service-reservoir');
    const recharge = (engine, operator) => startEngineWorking(engine, {
        id: 'a-recharge', law: GU_CHANNEL_RECHARGE_LAW, method: guChannelRechargeWorking('lookout-reservoir'),
        bindings: {operator: {id: operator, kind: 'operator'}, corridor: {id: 'ford', kind: 'gu-coupled-route'}},
    });
    const queued = recharge(service, 'technician');
    const rescued = advance(restore(queued), 4);
    assert.deepEqual(serializeEngineWorld(rescued), serializeEngineWorld(advance(queued, 4)));
    assert.equal(rescued.world.holders.keeper.place, 'ford');
    assert.equal(rescued.world.holders.supporter.quantities[energy], 0);
    assert.equal(rescued.world.holders.technician.quantities[energy], 1);
    const unauthorized = advance(restore(recharge(service, 'supporter')), 4);
    assert.equal(unauthorized.records.workings['a-recharge'].record.receipts.at(-1).reason, 'channel recharge unavailable');
    assert.equal(unauthorized.world.holders.supporter.quantities[energy], 2);
    assert.equal(unauthorized.world.holders.keeper.place, 'bend');
    const late = advance(recharge(advance(service, 4), 'technician'), 5);
    assert.equal(late.records.workings['a-recharge'].record.receipts.at(-1).reason, 'channel reservoir is full');
    assert.equal(late.world.holders.technician.quantities[energy], 2);

    const livingService = applyEngineOps(service, [
        {op: 'holder_add', value: {id: 'channel-gu', kind: 'body', as: ['gu'], place: 'lookout',
            properties: {alive: true, gu_kind: 'channel-regulator', gu_keeper: 'technician', gu_controller: 'technician'},
            quantities: {satiety: 2}}},
        {op: 'law_params', id: 'lookout-reservoir', params: {rechargeGu: 'channel-gu'}},
    ], 'fixture:living-channel-regulator');
    const assisted = startEngineWorking(livingService, {
        id: 'a-assisted-recharge', law: GU_CHANNEL_RECHARGE_LAW, method: guChannelRechargeWorking('lookout-reservoir', {living: true}),
        bindings: {operator: {id: 'technician', kind: 'operator'}, corridor: {id: 'ford', kind: 'gu-coupled-route'},
            specimen: {id: 'channel-gu', kind: 'gu'}},
    });
    const fed = advance(restore(assisted), 4);
    assert.deepEqual(serializeEngineWorld(fed), serializeEngineWorld(advance(assisted, 4)));
    assert.equal(fed.world.holders.technician.quantities[energy], 1);
    assert.equal(fed.world.holders.keeper.place, 'ford');
    const bare = advance(restore(recharge(livingService, 'technician')), 4);
    assert.equal(bare.records.workings['a-recharge'].record.receipts.at(-1).reason, 'channel recharge Gu unavailable');
    for (const op of [
        {op: 'set', holder: 'channel-gu', quantity: 'satiety', amount: 0},
        {op: 'property', holder: 'channel-gu', property: 'gu_keeper', value: 'supporter'},
    ]) {
        const unavailable = advance(restore(applyEngineOps(assisted, [op], 'fixture:regulator-unavailable')), 4);
        assert.equal(unavailable.records.workings['a-assisted-recharge'].record.receipts.at(-1).reason, 'channel recharge Gu unavailable');
        assert.equal(unavailable.world.holders.technician.quantities[energy], 2);
        assert.equal(unavailable.world.holders.supporter.quantities[energy], 2);
        assert.equal(unavailable.world.holders.keeper.place, 'bend');
    }

    for (const changes of [{state: 'closed'}, {cost: 2}]) {
        const disrupted = applyEngineOps(first, [{op: 'link_set', id: 'to-bend', ...changes}], 'fixture:channel-disrupted');
        const stopped = advance(restore(disrupted), 4);
        assert.deepEqual(serializeEngineWorld(stopped), serializeEngineWorld(advance(disrupted, 4)));
        assert.equal(stopped.records.workings.storm.record.receipts.at(-1).reason, 'storm support channel unavailable');
        assert.equal(stopped.world.holders.keeper.quantities[energy], 2);
        assert.equal(stopped.world.holders.supporter.quantities[energy], 2);
        assert.equal(stopped.world.holders.keeper.place, 'bend');
        assert.equal(stopped.world.holders.bend.quantities.temperature, -4);
        assert.equal(stopped.world.holders.rival.quantities.vitality, 12);
    }
});

test('two simultaneous Storms contend for finite essence-channel capacity', () => {
    const base = icebladeStormRouteBeat;
    const row = {...base, id: 'iceblade-storm-finite-upkeep', world: {...base.world,
        route: {...base.world.route, crossings: ['first', 'second'], crossingFuel: {primeval: 1}, supportFuel: {primeval: 2},
            supportChannel: {kind: 'essence-channel', reach: 2}}}};
    const {pending, restore} = routedStorm(row);
    const cast = compileGuCoupledBeat(row);
    const prepared = applyEngineOps(pending, [
        {op: 'holder_add', value: {id: 'lookout', kind: 'place'}},
        {op: 'move', holder: 'supporter', to: 'lookout'},
        {op: 'set', holder: 'supporter', quantity: energy, amount: 8},
        {op: 'link_add', link: {id: 'to-bank', kind: 'essence-channel', from: 'lookout', to: 'bank', oneWay: true, cost: 1}},
        {op: 'link_add', link: {id: 'to-bend', kind: 'essence-channel', from: 'bank', to: 'bend', oneWay: true, cost: 1}},
        {op: 'law_add', field: {id: 'bank-capacity', scope: 'world', kind: 'gu.essence-channel-capacity',
            params: {link: 'to-bank', capacity: 2}}},
        {op: 'holder_add', value: {id: 'second-caster', kind: 'body', as: ['operator'], place: 'bank',
            properties: {alive: true, contest_side: 'blue'}, quantities: {[energy]: 8}}},
        ...icebladeStormBeat.participants.map(({id, kind}) => ({
            op: 'holder_add', value: {id: 'second-' + id, kind: 'body', as: ['gu'], place: 'bank', quantities: {satiety: 6},
                properties: {alive: true, gu_kind: kind, gu_keeper: 'second-caster', gu_controller: 'second-caster'}},
        })),
    ], 'fixture:finite-essence-channel');
    const original = prepared.records.workings.storm.record.bindings;
    const both = startEngineWorking(prepared, {...cast, id: 'z-second-storm', bindings: {...original,
        operator: {id: 'second-caster', kind: 'operator'},
        ...Object.fromEntries(icebladeStormBeat.participants.map(({id}) => [id, {id: 'second-' + id, kind: 'gu'}])),
    }});
    const launched = advance(both, 2);
    const crossed = advance(restore(launched), 3);
    assert.equal(crossed.world.holders.keeper.place, 'bend');
    assert.equal(crossed.world.holders['second-caster'].place, 'bank');
    assert.equal(crossed.world.holders['second-caster'].quantities[energy], 3);
    assert.equal(crossed.world.holders.supporter.quantities[energy], 6);
    assert.equal(crossed.records.workings['z-second-storm'].record.receipts.at(-1).reason, 'storm support channel capacity unavailable');
    const finished = advance(restore(crossed), 4);
    assert.deepEqual(serializeEngineWorld(finished), serializeEngineWorld(advance(both, 4)));
    assert.equal(finished.world.holders.keeper.place, 'ford');
    assert.equal(finished.world.holders.supporter.quantities[energy], 4);
    assert.deepEqual(finished.world.laws.find(field => field.id === 'bank-capacity').params,
        {link: 'to-bank', capacity: 2, at: 4, used: 2});

    const short = applyEngineOps(launched, [{op: 'set', holder: 'keeper', quantity: energy, amount: 0}], 'fixture:short-payer');
    const secondCrosses = advance(restore(short), 3);
    assert.equal(secondCrosses.records.workings.storm.record.receipts.at(-1).reason, 'storm crossing essence unavailable');
    assert.equal(secondCrosses.world.holders['second-caster'].place, 'bend');
    assert.equal(secondCrosses.world.holders.supporter.quantities[energy], 6);
});

test('a paid Gu counter ends the Storm guard before an independently queued strike', () => {
    const config = {...stormConfig, host: {laws: [...stormConfig.host.laws, GU_WARD_BREAK_LAW]}};
    const start = stormEngine({config, extra: [
        {id: 'disruptor', kind: 'body', as: ['operator'], place: 'ford', properties: {alive: true}, quantities: {[energy]: 3}},
        {id: 'cutter', kind: 'body', as: ['gu'], place: 'ford', quantities: {satiety: 6},
            properties: {alive: true, gu_kind: 'ward-cutter', gu_keeper: 'disruptor', gu_controller: 'disruptor'}},
    ]});
    const cast = (engine, field) => startEngineWorking(engine, {id: 'a-sever', law: GU_WARD_BREAK_LAW,
        method: guWardBreakWorking(field), bindings: {
            operator: {kind: 'operator', id: 'disruptor'}, specimen: {kind: 'gu', id: 'cutter'},
            target: {kind: 'creature', id: 'keeper'},
        }});
    const storm = advance(worldCounter(start, 'rival-strike'), 2);
    const guard = storm.world.laws.find(field => field.scope === 'keeper');
    const prepared = applyEngineOps(storm, [{op: 'law_add', field: {id: 'separate-ward', scope: 'keeper', kind: 'block',
        params: {verb: 'move', object: 'position'}}}], 'fixture:another-ward');
    const pending = cast(prepared, guard.id);
    const hit = advance(restoreEngineWorld(serializeEngineWorld(pending), config), 3);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(pending, 3)));
    assert.equal(hit.world.holders.disruptor.quantities[energy], 1);
    assert.equal(hit.world.holders.keeper.quantities[energy], 3);
    assert.equal(hit.world.holders.keeper.quantities.vitality, 10);
    assert.deepEqual(hit.world.laws.map(field => field.id), ['separate-ward']);
    assert.equal(hit.world.holders.ford.quantities.temperature, -4);

    const wrong = advance(cast(prepared, 'absent-field'), 3);
    assert.equal(wrong.world.holders.disruptor.quantities[energy], 1);
    assert.equal(wrong.world.holders.keeper.quantities.vitality, 12);
    assert.equal(wrong.records.workings['a-sever'].landed[0].status, 'idle');

    const anchored = applyEngineOps(pending, [{op: 'law_add', field: {id: 'anchor', scope: 'keeper', kind: 'block',
        params: {verb: 'end', object: '*'}}}], 'fixture:anchor');
    const resisted = advance(anchored, 3);
    assert.equal(resisted.world.holders.disruptor.quantities[energy], 1);
    assert.equal(resisted.world.holders.keeper.quantities.vitality, 12);
    assert.ok(resisted.world.laws.some(field => field.id === guard.id));

    const poor = applyEngineOps(pending, [{op: 'set', holder: 'disruptor', quantity: energy, amount: 1}], 'fixture:spent');
    const refused = advance(poor, 3);
    assert.equal(refused.records.workings['a-sever'].record.status, 'interrupted');
    assert.equal(refused.world.holders.disruptor.quantities[energy], 1);
    assert.equal(refused.world.holders.keeper.quantities.vitality, 12);
});

test('hunger, custody, live balance and reach are rechecked before any debit or world effect', () => {
    const pending = advance(stormEngine(), 1);
    const hungry = applyEngineOps(pending, [
        {op: 'set', holder: 'live-wind', quantity: 'satiety', amount: 1},
    ], 'fixture.meal-lapsed');
    const distant = applyEngineOps(pending, [
        {op: 'property', holder: 'ford', property: 'track_position', value: 4},
    ], 'fixture.stretched-path');
    const loaned = applyEngineOps(pending, [
        {op: 'property', holder: 'live-wind', property: 'gu_keeper', value: 'rival'},
    ], 'fixture.loan');
    const drained = applyEngineOps(pending, [
        {op: 'set', holder: 'keeper', quantity: energy, amount: 4},
    ], 'fixture.essence-spent');
    for (const [engine, remaining, reason] of [[hungry, 8, 'needs feeding'], [drained, 4, 'needs more essence'],
        [distant, 8, 'storm destination out of reach'], [loaned, 8, 'gu-not-held']]) {
        const settled = advance(engine, 3);
        const storm = settled.records.workings.storm;
        assert.equal(storm.record.status, 'interrupted');
        assert.equal(storm.record.receipts[0].reason, reason);
        assert.deepEqual(storm.landed, []);
        assert.equal(settled.world.holders.keeper.quantities[energy], remaining);
        assert.equal(settled.world.holders.keeper.place, 'bank');
        assert.equal(settled.world.holders.rival.quantities.vitality, 12);
        assert.equal(settled.world.holders.ford.quantities.temperature, 6);
    }
});

const prepareLaw = defineWorkingLaw({id: 'trial.storm-preparation', revision: 1, operations: {
    prepare: {roles: {operator: 'operator'}, settle({bound}) {
        return {ok: true, costs: [{quantity: energy, payer: bound.operator.id, amount: 1}]};
    }},
}});
const preparedStorm = composeWorking(defineComposition({id: 'trial.prepared-storm', revision: 1,
    roles: stormWorld.method.roles, slots: [
        {name: 'prepare', needs: {operator: 'operator'}, bindings: {operator: 'operator'}, facts: 'shared'},
        {name: 'storm', needs: stormWorld.method.roles, bindings: stormWorld.method.steps[0].bindings, facts: 'shared'},
    ]}), {prepare: {law: prepareLaw, method: {id: 'trial.prepare-storm', revision: 1, law: prepareLaw.ref,
        roles: {operator: 'operator'}, steps: [{op: 'prepare', minutes: 1, bindings: {operator: 'operator'}}]}}, storm: stormWorld});

test('a use grant can expire after a paid preparation while custody and satiety persist', () => {
    const config = {...stormConfig, host: {laws: [preparedStorm.law]}};
    const open = useUntil => stormEngine({useUntil, cast: preparedStorm, config});
    const pending = advance(open(3), 1);
    assert.equal(pending.world.holders.keeper.quantities[energy], 7);
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pending))), config);
    const denied = advance(restored, 3);
    assert.deepEqual(serializeEngineWorld(denied), serializeEngineWorld(advance(open(3), 3)));
    assert.equal(denied.records.workings.storm.record.receipts[1].reason, 'gu-use-grant-expired');
    assert.equal(denied.world.holders.keeper.quantities[energy], 7);
    const held = denied.world.holders['live-wind'];
    assert.equal(held.properties.gu_keeper, 'keeper');
    assert.equal(held.properties.gu_controller, 'rival');
    assert.equal(held.quantities.satiety, 3);
    assert.equal(denied.world.holders.ford.quantities.temperature, 6);

    const allowed = advance(open(4), 3);
    assert.equal(allowed.records.workings.storm.record.status, 'complete');
    assert.equal(allowed.world.holders.keeper.quantities[energy], 2);
    assert.equal(allowed.world.holders['live-wind'].properties.gu_controller, 'rival');
    assert.equal(allowed.world.holders['live-wind'].place, 'ford');
});

test('competing use grants settle once and return hands off the same fed Gu without transferring title', () => {
    const config = {...stormConfig, host: {laws: [GU_USE_AGREEMENT_LAW, preparedStorm.law]}};
    const body = id => ({id, kind: 'body', as: ['operator'], place: 'bank', quantities: {[energy]: 8}});
    const initial = stormEngine({config, start: false, extra: [body('lender'), body('claimant')]});
    const ready = applyEngineOps(initial, ['gu_title', 'gu_controller', 'gu_keeper'].map(property =>
        ({op: 'property', holder: 'live-wind', property, value: 'lender'})), 'fixture:title');
    const agreement = (engine, id, action, borrower, until) => startEngineWorking(engine, {
        id, law: GU_USE_AGREEMENT_LAW, method: guUseAgreementWorking(action, until), bindings: {
            lender: {kind: 'operator', id: 'lender'}, borrower: {kind: 'operator', id: borrower}, specimen: stormBindings.wind,
        },
    });
    const pending = agreement(agreement(ready, 'a-grant', 'grant', 'keeper', 4), 'b-grant', 'grant', 'claimant', 5);
    const granted = advance(restoreEngineWorld(serializeEngineWorld(pending), config), 1);
    assert.deepEqual(serializeEngineWorld(granted), serializeEngineWorld(advance(pending, 1)));
    assert.equal(granted.records.workings['a-grant'].record.status, 'complete');
    assert.match(granted.records.workings['b-grant'].record.receipts[0].reason, /already has a live/);
    const liveUse = advance(startEngineWorking(granted, {...stormWorld, id: 'live-use', bindings: stormBindings}), 3);
    assert.equal(liveUse.records.workings['live-use'].record.status, 'complete');
    assert.equal(liveUse.world.holders.keeper.quantities[energy], 3);
    assert.equal(liveUse.world.holders.ford.quantities.temperature, -4);
    const inFlight = startEngineWorking(granted, {...preparedStorm, id: 'storm', bindings: stormBindings});
    const earlyReturn = agreement(inFlight, 'return-early', 'return', 'keeper');
    const closed = advance(earlyReturn, 4);
    assert.equal(closed.records.workings['return-early'].record.receipts[0].observed.endedEarly, true);
    assert.equal(closed.records.workings.storm.record.status, 'interrupted');
    assert.equal(closed.world.holders.keeper.quantities[energy], 7);

    const expired = advance(restoreEngineWorld(serializeEngineWorld(advance(inFlight, 2)), config), 4);
    assert.equal(expired.records.workings.storm.record.receipts[1].reason, 'gu-use-grant-expired');
    const refused = advance(agreement(expired, 'too-soon', 'grant', 'claimant', 8), 5);
    assert.match(refused.records.workings['too-soon'].record.receipts[0].reason, /return the Gu first/);
    const afterReturn = advance(agreement(refused, 'return', 'return', 'keeper'), 6);
    assert.equal(afterReturn.world.holders['live-wind'].properties.gu_keeper, 'lender');
    const next = advance(agreement(afterReturn, 'new-grant', 'grant', 'claimant', 9), 7);
    assert.equal(next.records.workings['new-grant'].record.status, 'complete');
    assert.equal(next.world.holders['live-wind'].properties.gu_keeper, 'claimant');
    assert.equal(next.world.holders['live-wind'].properties.gu_title, 'lender');
    assert.equal(next.world.holders['live-wind'].properties.gu_controller, 'lender');
    assert.equal(next.world.holders['live-wind'].quantities.satiety, 0, 'return and reloan do not reset appetite');
});

test('a Formation Plate overwrite changes which field can be installed through restore', () => {
    const reserve = 'energy:immortal.essence';
    const config = {
        ...stormConfig, host: {laws: [GU_FORMATION_PLATE_LAW, counterLaw]},
        shared: {...stormConfig.shared, properties: [...stormConfig.shared.properties, ...GU_FORMATION_PLATE_PROPERTIES]},
    };
    const holders = [
        {id: 'ford', kind: 'place', quantities: {temperature: 6}},
        {id: 'keeper', kind: 'body', as: ['operator', 'creature'], place: 'ford', quantities: {vitality: 12, [reserve]: 3}},
        {id: 'rival', kind: 'body', as: ['creature'], place: 'ford', quantities: {vitality: 12}},
        {id: 'plate', kind: 'body', as: ['gu'], tags: ['living.body'], place: 'ford', quantities: {satiety: 20},
            state: {'l.living_body': livingBodyState({species: 'formation-plate', rate: 1})},
            properties: {alive: true, gu_kind: 'formation-plate', gu_keeper: 'keeper', gu_controller: 'keeper',
                gu_formation_layout: 'teleport'}},
    ];
    const start = (engine, id, options) => startEngineWorking(engine, {
        id, law: GU_FORMATION_PLATE_LAW, method: guFormationPlateMethod(options),
        bindings: {operator, plate: {id: 'plate', kind: 'gu'}, site: stormBindings.place},
    });
    const initial = createEngineWorld({...config, holders});
    const shelter = {operation: 'erect', layout: 'shelter', duration: 4};
    const refused = advance(start(initial, 'wrong-layout', shelter), 2);
    assert.equal(refused.records.workings['wrong-layout'].record.status, 'interrupted');
    assert.equal(refused.world.holders.keeper.quantities[reserve], 3);
    const pending = advance(start(initial, 'rewrite', {operation: 'inscribe', previous: 'teleport', layout: 'shelter'}), 1);
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pending))), config);
    const written = advance(restored, 2);
    assert.deepEqual(serializeEngineWorld(written), serializeEngineWorld(advance(pending, 2)));
    assert.equal(written.world.holders.plate.properties.gu_formation_layout, 'shelter');

    const erected = advance(start(written, 'erect', shelter), 4);
    assert.equal(erected.world.holders.keeper.quantities[reserve], 1);
    assert.ok(erected.world.laws.some(field => field.scope === 'ford' && field.until === 8));
    const defended = advance(worldCounter(erected, 'counter'), 7);
    assert.equal(defended.world.holders.keeper.quantities.vitality, 12);
    const after = advance(worldCounter(defended, 'second.counter'), 10);
    assert.equal(after.world.holders.keeper.quantities.vitality, 8);
});
