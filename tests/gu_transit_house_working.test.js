import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {defineWorkingLaw} from '../src/kernel_working.js';
import {fixedTravelFuel, fixedTravelWorking, GU_FIXED_TRAVEL_LAW, guTravelCarryPack} from '../src/world_packs/gu_fixed_travel_working.js';
import {GU_TRANSIT_HOUSE_LAW, guTransitHousePack, transitHouseWorking} from '../src/world_packs/gu_transit_house_working.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';

const ref = (kind, id) => ({kind, id});
const deliveryRoles = {cargo: 'cargo', site: 'place'};
const deliveryLaw = defineWorkingLaw({id: 'trial.house-delivery', revision: 1, operations: {
    deliver: {roles: deliveryRoles, settle({bound}) {
        if (bound.cargo.place !== bound.site.holder) return {ok: false, reason: 'Cargo has not arrived.'};
        return {ok: true, effects: [{op: 'add', holder: bound.site.holder, quantity: 'stock:provisions', amount: 1}]};
    }},
}});
const config = {
    ownPacks: [guTravelCarryPack, guTransitHousePack], packs: ['l.living_body', guTravelCarryPack.id, guTransitHousePack.id],
    shared: {quantities: sharedQuantities(['stock', 'energy']), properties: [...sharedProperties(['alive']),
        ...['gu_kind', 'gu_keeper', 'gu_controller', 'gu_world_claim'].map(id => ({id, type: 'label'})),
        {id: 'gu_rank', type: 'level', min: 1}]},
    host: {laws: [GU_TRANSIT_HOUSE_LAW, GU_FIXED_TRAVEL_LAW, deliveryLaw]},
};
function start() {
    const gu = (id, kind, extra = {}) => ({id, kind: 'body', as: ['gu'], tags: ['living.body'], place: 'dock',
        quantities: {satiety: 100}, state: {'l.living_body': livingBodyState({species: kind, rate: 1})},
        properties: {alive: true, gu_kind: kind, gu_keeper: 'keeper', gu_controller: 'keeper', gu_rank: 6, ...extra}});
    return createEngineWorld({...config, holders: [
        {id: 'dock', kind: 'place', properties: {gu_travel_scene: 'dock-gate'}},
        {id: 'hill', kind: 'place', properties: {gu_travel_scene: 'hill-gate'}, quantities: {'stock:provisions': 0}},
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'dock', quantities: {[fixedTravelFuel]: 3}},
        {id: 'frame', kind: 'thing', as: ['gu-house'], place: 'dock', properties: {gu_house_operator: 'keeper'}},
        {id: 'crate', kind: 'thing', as: ['cargo'], place: 'dock', properties: {gu_installed_in: 'frame'}},
        {id: 'notes', kind: 'thing', as: ['impression'], place: 'dock',
            properties: {gu_impression_owner: 'keeper', gu_impression_site: 'hill', gu_travel_scene: 'hill-gate'}},
        gu('core', 'fixed-immortal-travel', {gu_world_claim: 'fixed-travel', gu_carried: true}),
        gu('glide', 'glide'), gu('anchor', 'anchor'),
    ]});
}
const bindings = {operator: ref('operator', 'keeper'), frame: ref('gu-house', 'frame'), core: ref('gu', 'core'),
    destination: ref('place', 'hill'), impression: ref('impression', 'notes'), cargo: ref('cargo', 'crate')};
function house(engine, operation, support, {rush = false, id = operation} = {}) {
    const method = transitHouseWorking(operation, {rush});
    const offered = {...bindings, support: ref('gu', support)};
    return startEngineWorking(engine, {id, law: GU_TRANSIT_HOUSE_LAW, method, payer: 'keeper',
        bindings: Object.fromEntries(Object.keys(method.roles).map(role => [role, offered[role]]))});
}
const advance = (engine, at) => {
    const run = advanceEngineWorld(engine, at);
    assert.equal(run.pending, false);
    return run.engine;
};
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const place = (engine, id) => engine.world.holders[id].place;
const remaining = engine => engine.world.holders.keeper.quantities[fixedTravelFuel];
const action = (engine, op, support, {rush = false, id = op} = {}) =>
    advance(house(engine, op, support, {rush, id}), engine.world.clock + transitHouseWorking(op, {rush}).steps[0].minutes);
const delivery = engine => startEngineWorking(engine, {id: 'delivery', law: deliveryLaw,
    method: {id: 'trial.unload', revision: 1, law: deliveryLaw.ref, roles: deliveryRoles,
        steps: [{op: 'deliver', minutes: 2, bindings: {cargo: 'cargo', site: 'site'}}]},
    bindings: {cargo: bindings.cargo, site: bindings.destination}});

test('refitting the same House core changes the priced cargo crossing and enables delivery', () => {
    const gliding = action(action(start(), 'refit', 'glide'), 'finish', 'glide');
    const denied = action(gliding, 'freight', 'glide');
    assert.equal(denied.records.workings.freight.record.status, 'interrupted');
    assert.equal(remaining(denied), 3);

    const light = action(gliding, 'cross', 'glide');
    assert.equal(remaining(light), 2);
    for (const id of ['keeper', 'frame', 'core', 'glide']) assert.equal(place(light, id), 'hill');
    assert.equal(place(light, 'crate'), 'dock');

    const open = action(denied, 'unseat', 'glide');
    const fitted = action(open, 'refit', 'anchor', {id: 'refit-heavy'});
    const running = house(fitted, 'finish', 'anchor', {id: 'finish-heavy'});
    const halfway = advance(running, fitted.world.clock + 7);
    const loaded = advance(restore(halfway), fitted.world.clock + 15);
    assert.deepEqual(serializeEngineWorld(loaded), serializeEngineWorld(advance(running, fitted.world.clock + 15)));
    const outbound = delivery(house(loaded, 'freight', 'anchor', {id: 'loaded-trip'}));
    const delivered = advance(outbound, loaded.world.clock + 2);
    assert.equal(remaining(delivered), 1);
    for (const id of ['keeper', 'frame', 'core', 'anchor', 'crate']) assert.equal(place(delivered, id), 'hill');
    assert.equal(place(delivered, 'glide'), 'dock');
    assert.equal(delivered.world.holders.core.properties.gu_world_claim, 'fixed-travel');
    assert.equal(delivered.world.holders.hill.quantities['stock:provisions'], 1);
    assert.deepEqual(delivered.records.workings['loaded-trip'].record.receipts[0].observed,
        {core: 'core', support: 'anchor', cargo: 'crate'});
});

test('a rushed fit destroys its support, and a new brace can repair the same frame', () => {
    const setting = action(start(), 'refit', 'glide');
    const broken = action(setting, 'finish', 'glide', {rush: true});
    assert.equal(broken.world.holders.glide, undefined);
    assert.equal(broken.world.holders.frame.properties.gu_house_phase, 'damaged');
    assert.equal(broken.world.holders.core.properties.gu_world_claim, 'fixed-travel');
    const repaired = action(action(restore(broken), 'refit', 'anchor', {id: 'repair'}), 'finish', 'anchor', {id: 'settle-repair'});
    assert.equal(repaired.world.holders.frame.properties.gu_house_phase, 'ready');
    const installed = advance(startEngineWorking(repaired, {id: 'bare-cast', law: GU_FIXED_TRAVEL_LAW,
        method: fixedTravelWorking(), bindings: {operator: bindings.operator, destination: bindings.destination,
            impression: bindings.impression, specimen: bindings.core}}), repaired.world.clock + 2);
    assert.equal(installed.records.workings['bare-cast'].record.receipts[0].reason, 'unavailable');
    assert.equal(remaining(installed), 3);
});

test('a ward intercepts the paid frame crossing and its cargo does not arrive', () => {
    const ready = action(action(start(), 'refit', 'anchor'), 'finish', 'anchor');
    const warded = applyEngineOps(ready, [{op: 'law_add', field: {id: 'house-ward', kind: 'block', scope: 'dock',
        params: {verb: 'move', object: 'position'}}}], 'fixture.block');
    const intercepted = advance(delivery(house(warded, 'freight', 'anchor')), ready.world.clock + 2);
    assert.equal(remaining(intercepted), 1);
    for (const id of ['keeper', 'frame', 'core', 'anchor', 'crate']) assert.equal(place(intercepted, id), 'dock');
    assert.equal(intercepted.world.holders.hill.quantities['stock:provisions'], 0);
    assert.equal(intercepted.records.workings.delivery.record.receipts[0].reason, 'Cargo has not arrived.');
});

test('a hungry support can strand the House until the keeper feeds the mounted Gu', () => {
    const ready = action(action(start(), 'refit', 'anchor'), 'finish', 'anchor');
    const hungry = applyEngineOps(ready, [{op: 'set', holder: 'anchor', quantity: 'satiety', amount: 1}], 'fixture.last-meal');
    const denied = action(hungry, 'freight', 'anchor');
    assert.equal(denied.records.workings.freight.record.status, 'interrupted');
    assert.equal(remaining(denied), 3);
    const supplied = applyEngineOps(denied, [{op: 'holder_add', value: {id: 'rations', kind: 'thing', as: ['supply'],
        place: 'dock', quantities: {'stock:anchor-ration': 1}}}], 'fixture:house-ration');
    const feed = startEngineWorking(supplied, {id: 'feed-anchor', law: GU_TRANSIT_HOUSE_LAW, method: transitHouseWorking('feed'),
        bindings: {operator: bindings.operator, frame: bindings.frame, component: ref('gu', 'anchor'), supply: ref('supply', 'rations')}});
    const fed = advance(restore(feed), supplied.world.clock + 1);
    assert.deepEqual(serializeEngineWorld(fed), serializeEngineWorld(advance(feed, supplied.world.clock + 1)));
    assert.equal(fed.world.holders.rations.quantities['stock:anchor-ration'], 0);
    assert.equal(fed.world.holders.anchor.quantities.satiety, 30);
    const delivered = advance(delivery(house(fed, 'freight', 'anchor', {id: 'retry-trip'})), fed.world.clock + 2);
    assert.equal(place(delivered, 'crate'), 'hill');
    assert.equal(place(delivered, 'anchor'), 'hill');
    assert.equal(delivered.world.holders.anchor.properties.gu_installed_in, 'frame');
    assert.equal(delivered.world.holders.hill.quantities['stock:provisions'], 1);
    assert.equal(remaining(delivered), 1);
    const absent = applyEngineOps(feed, [{op: 'move', holder: 'rations', to: 'hill'}], 'fixture:late-rations');
    const missed = advance(restore(absent), supplied.world.clock + 1);
    assert.equal(missed.records.workings['feed-anchor'].record.status, 'interrupted');
    assert.equal(missed.world.holders.rations.quantities['stock:anchor-ration'], 1);

    const open = action(action(denied, 'unseat', 'anchor'), 'unseat-core', 'anchor');
    const cast = startEngineWorking(open, {id: 'free-cast', law: GU_FIXED_TRAVEL_LAW, method: fixedTravelWorking(),
        bindings: {operator: bindings.operator, destination: bindings.destination, impression: bindings.impression, specimen: bindings.core}});
    const arrived = advance(cast, open.world.clock + 2);
    assert.equal(remaining(arrived), 2);
    assert.equal(place(arrived, 'keeper'), 'hill');
    assert.equal(place(arrived, 'core'), 'hill');
    assert.equal(place(arrived, 'frame'), 'dock');
});
