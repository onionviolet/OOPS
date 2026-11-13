import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {GU_FORMATION_PLATE_PROPERTIES} from '../src/world_packs/gu_formation_plate.js';
import {guFormationSupplyPack, shelteredSupplyWorking} from '../src/world_packs/gu_formation_supply.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const fuel = 'energy:immortal.essence', stock = 'stock:provisions';
function setup(duration = 3) {
    const working = shelteredSupplyWorking(duration);
    const config = {ownPacks: [guFormationSupplyPack], packs: ['l.living_body', guFormationSupplyPack.id],
        host: {laws: [working.law]}, shared: {quantities: sharedQuantities(['energy', 'stock']),
            properties: [...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES, ...GU_FORMATION_PLATE_PROPERTIES]}};
    const engine = createEngineWorld({...config, holders: [
        {id: 'ford', kind: 'place', quantities: {[stock]: 0}}, {id: 'bank', kind: 'place'},
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'ford', quantities: {[fuel]: 3}},
        {id: 'wagon', kind: 'thing', as: ['supply'], place: 'ford', quantities: {[stock]: 2}},
        {...guBodyHolder({id: 'formation-plate', needs: 'gu'}, {id: 'plate', place: 'ford', satiety: 20}),
            properties: {alive: true, gu_kind: 'formation-plate', gu_keeper: 'keeper', gu_controller: 'keeper', gu_formation_layout: 'teleport'}},
    ]});
    const started = startEngineWorking(engine, {id: 'delivery', ...working, bindings: {
        operator: {kind: 'operator', id: 'keeper'}, plate: {kind: 'gu', id: 'plate'},
        site: {kind: 'place', id: 'ford'}, wagon: {kind: 'supply', id: 'wagon'},
    }});
    return {started, restore: value => restoreEngineWorld(serializeEngineWorld(value), config)};
}
const advance = (engine, to) => advanceEngineWorld(engine, to).engine;
const amount = (engine, id, quantity) => engine.world.holders[id].quantities[quantity];
const record = engine => engine.records.workings.delivery.record;

test('the nested installation creates the exact field its later supply step reads through restore', () => {
    const {started, restore} = setup();
    const installed = advance(started, 4);
    assert.deepEqual(record(installed).receipts.map(row => row.op), ['shelter/inscribe/inscribe', 'shelter/erect/erect']);
    assert.equal(installed.world.laws[0].id, record(installed).facts.formationField);
    assert.equal(amount(installed, 'keeper', fuel), 1);
    assert.equal(amount(installed, 'wagon', stock), 2);
    const result = advance(restore(installed), 6);
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(started, 6)));
    assert.equal(amount(result, 'wagon', stock), 1);
    assert.equal(amount(result, 'ford', stock), 1);
    assert.ok(result.world.chain.some(row => row.kind === 'gu.formation.unloaded'));
});

test('a removed, relocated or expired shelter cannot transfer stock and the installation stays paid', () => {
    const {started, restore} = setup();
    const installed = advance(started, 4);
    const broken = applyEngineOps(installed, [
        {op: 'law_remove', id: record(installed).facts.formationField},
        {op: 'law_add', field: {id: 'unrelated', kind: 'block', scope: 'ford', params: {verb: 'remove', object: 'vitality'}}},
    ], 'fixture:counter');
    const [shelter] = installed.world.laws;
    const relocated = applyEngineOps(installed, [{op: 'law_remove', id: shelter.id},
        {op: 'law_add', field: {...shelter, scope: 'bank'}}], 'fixture:relocated');
    for (const pending of [restore(broken), restore(relocated), setup(2).started]) {
        const result = advance(pending, 6);
        assert.equal(amount(result, 'keeper', fuel), 1);
        assert.equal(amount(result, 'wagon', stock), 2);
        assert.equal(amount(result, 'ford', stock), 0);
        assert.ok(result.world.chain.some(row => row.kind === 'gu.formation.unload-refused'));
    }
});
