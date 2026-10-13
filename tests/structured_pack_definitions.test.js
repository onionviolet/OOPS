import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentRegistry} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack, stageStructuredNativeObjects} from '../src/structured_pack_definitions.js';

const fixture = () => ({
    schema: 2, id: 'workshop', revision: 1,
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'},
    capabilities: ['native-stock', 'custody', 'jobs', 'recipient-care'],
    world: {id: 'workshop.world', label: 'Workshop'},
    locations: [{id: 'workshop.room', label: 'Workroom', description: 'An original synthetic workshop.'}],
    items: [{id: 'workshop.parcel', label: 'Sealed parcel', description: 'One counted workshop parcel.'}],
    simulation: {
        people: [{id: 'workshop.receiver', revision: 1, label: 'Workshop receiver', worldId: 'workshop.world', location: 'workshop.room', inventory: 'simulation', provision: false}],
        commands: [{id: 'workshop.report', revision: 1, label: 'Report delivered stock', worldId: 'workshop.world', actorId: 'player', targetId: 'workshop.receiver', audience: ['$actor'], effects: [{type: 'knowledge', key: 'workshop.report', stage: 'seen', value: 'The receiver acknowledged the stock.'}]}],
        conditions: [{id: 'workshop.tired', revision: 1, label: 'Tired hands'}]
    },
    presentation: {people: {'workshop.receiver': {introductionKnowledgeKey: 'workshop.receiver.met'}}, status: [{id: 'workshop.delivery', label: 'Acknowledged delivery', knowledgeKey: 'workshop.report'}]}
});
const base = () => createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
const snapshot = registry => Object.fromEntries(Object.entries(registry).map(([family, map]) => [family, map instanceof Map ? [...map] : Object.fromEntries(Object.entries(map).map(([key, value]) => [key, value instanceof Map ? [...value] : value]))]));

test('structured compilation creates immutable definitions without registering or provisioning', () => {
    const raw = fixture(), registry = base(), before = snapshot(registry);
    const compiled = compileStructuredPack(raw, registry);
    assert.deepEqual(snapshot(registry), before);
    assert.equal(compiled.registry.simulation.people.get('workshop.receiver').provision, false);
    assert.deepEqual(compiled.registry.simulation.onEnroll, []);
    assert.equal(compiled.definition.items[0].id, 'workshop.parcel');
    raw.simulation.commands[0].effects[0].value = 'Changed input';
    assert.equal(compiled.definition.simulation.commands[0].effects[0].value, 'The receiver acknowledged the stock.');
    assert.throws(() => {compiled.definition.items[0].label = 'Changed output';}, TypeError);
    assert.throws(() => {compiled.registry.simulation.commands.get('workshop.report').effects.push({});}, TypeError);
    mergeStructuredPack(compiled, registry);
    assert(registry.worlds.has('workshop.world'));
    assert(registry.simulation.conditions.has('workshop.tired'));
    assert(!Object.hasOwn(compiled, 'state'));
});

test('collision in a late simulation family leaves every live family unchanged', () => {
    const registry = base(), compiled = compileStructuredPack(fixture());
    const sentinel = {id: 'workshop.tired', revision: 99, label: 'Existing condition'};
    registry.simulation.conditions.set(sentinel.id, sentinel);
    const before = snapshot(registry);
    assert.throws(() => mergeStructuredPack(compiled, registry), /collision/);
    assert.deepEqual(snapshot(registry), before);
    assert.strictEqual(registry.simulation.conditions.get(sentinel.id), sentinel);
});

test('unknown and unimplemented capabilities reject admission', () => {
    for(const capability of ['unknown', 'source-function', 'origin']) {
        const raw = fixture(); raw.capabilities.push(capability);
        assert.throws(() => compileStructuredPack(raw), /capability/);
    }
});

test('cross references use combined existing definitions without changing them', () => {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}], sources: [{id: 'base.balance', label: 'Balance', revision: 1, kind: 'trait', grants: []}]});
    const raw = fixture(); raw.simulation.commands[0].effects.push({type: 'source', sourceId: 'base.balance', operation: 'grant'});
    const before = snapshot(registry);
    assert(compileStructuredPack(raw, registry).registry.simulation.commands.has('workshop.report'));
    assert.deepEqual(snapshot(registry), before);
    assert.throws(() => compileStructuredPack(raw), /sourceId/);
});

test('unknown person, condition, source, native item and command power refuse', () => {
    const mutations = [
        raw => {raw.simulation.commands[0].targetId = 'workshop.missing';},
        raw => {raw.simulation.commands[0].audience = ['workshop.missing'];},
        raw => {raw.simulation.commands[0].effects.push({type: 'condition', id: 'workshop.missing', operation: 'remove'});},
        raw => {raw.simulation.commands[0].effects.push({type: 'faculty', sourceId: 'workshop.missing', operation: 'activate'});},
        raw => {raw.simulation.commands[0].effects.push({type: 'item', key: '{"id":"workshop.missing"}', amount: 1});},
        raw => {raw.simulation.commands[0].powerId = 'workshop.missing';}
    ];
    for(const mutate of mutations) {const raw = fixture(); mutate(raw); assert.throws(() => compileStructuredPack(raw), /Unknown/);}
});

test('schema1 scalar data cannot become structured historical objects', () => {
    const scalar = {schema: 1, id: 'legacy', initial: {stock: 2}, activities: []};
    const before = structuredClone(scalar);
    assert.throws(() => compileStructuredPack(scalar), /header/);
    assert.deepEqual(scalar, before);
    const raw = fixture(); raw.compatibility.legacy = 'invent-units';
    assert.throws(() => compileStructuredPack(raw), /compatibility/);
    const disguised = fixture(); disguised.initial = {stock: 2};
    assert.throws(() => compileStructuredPack(disguised), /Scalar/);
});

test('observer declarations and pack ownership are required before registration', () => {
    const mutations = [
        raw => {delete raw.presentation;},
        raw => {delete raw.presentation.people['workshop.receiver'];},
        raw => {delete raw.presentation.status[0].knowledgeKey;},
        raw => {delete raw.simulation.commands[0].audience;},
        raw => {raw.locations[0].id = 'base.room';},
        raw => {raw.items[0].id = 'base.parcel';},
        raw => {raw.simulation.people[0].id = 'base.receiver';},
        raw => {raw.simulation.onEnroll = [{type: 'item', key: '{"id":"workshop.parcel"}', amount: 1}];}
    ];
    for(const mutate of mutations) {const raw = fixture(); mutate(raw); assert.throws(() => compileStructuredPack(raw));}
});

test('non-JSON executable content and unknown simulation families reject', () => {
    const raw = fixture(); raw.evaluate = () => true;
    assert.throws(() => compileStructuredPack(raw), /JSON/);
    const unsupported = fixture(); unsupported.simulation.customTimers = [];
    assert.throws(() => compileStructuredPack(unsupported), /family/);
});

test('refused native construction rolls back earlier availability side effects',()=>{
    const location={old:{unlocked:true}},item={old:{unlocked:false}},availabilities={location,item};
    const before={location:{...location},item:{...item}};
    const raw=fixture();raw.items.push({id:'workshop.refused',label:'Refused',description:'Synthetic refusal'});
    assert.throws(()=>stageStructuredNativeObjects(raw,{availabilities,
        makeLocation(row){location[row.id]={unlocked:true};return {};},
        makeItem(row){if(row.id==='workshop.refused')throw Error('constructor refusal');item[row.id]={unlocked:true};return {};},
        makeInventory(){return {};}}),/constructor refusal/);
    assert.deepEqual(availabilities,before);assert.equal(availabilities.location,location);assert.equal(availabilities.item,item);
});
