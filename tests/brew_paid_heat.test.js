import assert from 'node:assert/strict';
import test from 'node:test';
import {BREW_LAW, BREW_PUBLISHES, brewBalance} from '../src/brew_law.js';
import {brewDoseContents, brewMeasureQuantity} from '../src/engine_brew_stock.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {draughtOfPeaceMethod} from '../src/world_packs/hp_brew_pack.js';

const fuel = 'stock:burner-fuel';
const ref = (kind, id = kind) => ({kind, id});
const advance = (engine, at) => advanceEngineWorld(engine, at).engine;

function trial(stock) {
    const ingredients = [['base', 'peace-base', 60], ['moonstone', 'powdered-moonstone', 6], ['syrup', 'hellebore-syrup', 2]];
    const config = {packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock], effectKinds: BREW_PUBLISHES}, host: {
        laws: [BREW_LAW], things: {'vessel:pot': {closure: 'open', fuelAccount: fuel,
            thermal: {capacity: 10, surfaceArea: 2, heatTransfer: 1, thermalMass: 1}},
        ...Object.fromEntries(ingredients.map(([id, part]) => [`lot:${id}`, {material: id, properties: {constituents: {[part]: 1000}}}]))},
    }};
    const place = 'bench';
    const holder = (id, as, quantities = {}) => ({id, kind: 'thing', as: [as], place, quantities});
    const world = createEngineWorld({...config, holders: [{id: place, kind: 'place'},
        holder('pot', 'vessel', {[fuel]: stock}), holder('flask', 'flask'),
        ...ingredients.map(([id, , amount]) => holder(id, 'lot', {[brewMeasureQuantity]: amount})),
    ]});
    const method = draughtOfPeaceMethod({moonstone: 6, syrupDrops: 2});
    const pending = startEngineWorking(world, {id: 'brew', law: BREW_LAW, method, bindings: {vessel: ref('vessel', 'pot'), flask: ref('flask'),
        ...Object.fromEntries(ingredients.map(([id]) => [id, ref('lot', id)]))}});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    return {pending, reload};
}

test('a paid simmer debits real fuel and a short account weakens the bottled result across restore', () => {
    for (const [stock, paid, active] of [[120, 105, 6], [5, 5, 3], [0, 0, 0]]) {
        const {pending, reload} = trial(stock);
        const restored = reload(advance(reload(advance(pending, 4)), 9));
        assert.deepEqual(serializeEngineWorld(restored), serializeEngineWorld(advance(pending, 9)));
        const {record} = restored.records.workings.brew;
        assert.equal(record.status, 'complete');
        assert.equal(record.receipts.find(row => row.op === 'heat').observed.fuelPaid, paid);
        assert.equal(restored.world.holders.pot.quantities[fuel], stock - paid);
        assert.equal(brewDoseContents(restored.world.holders.flask)['peace-active'] ?? 0, active);
        assert.deepEqual(brewBalance(record.facts), {admitted: 68, held: 0, released: 68, balanced: true});
    }
});

test('the paid simmer reads fuel at settlement and spends no fuel already taken by another action', () => {
    const {pending, reload} = trial(120);
    const mid = advance(pending, 4);
    const removed = applyEngineOps(mid, [{op: 'add', holder: 'pot', quantity: fuel, amount: -120}], 'take-fuel');
    const result = advance(reload(removed), 9);
    assert.equal(result.records.workings.brew.record.receipts.find(row => row.op === 'heat').observed.fuelPaid, 0);
    assert.equal(result.world.holders.pot.quantities[fuel], 0);
    assert.equal(brewDoseContents(result.world.holders.flask)['peace-active'], undefined);
});
