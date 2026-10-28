import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';

const native = () => loadNative(`
export {TraderComponent} from './src/components/trader_component.js';
export {default as templates} from './src/data/inventory_templates.js';
export {bindGameStreams,createStreams,gameKeyedRandom,STREAMS} from './src/seeded_streams.js';`, {stubs: STANCE_LOCATION_STUBS});

const snap = t => JSON.stringify(Object.entries(t.getTradeInventory()).map(([k, v]) => [k, v.count]).sort());
const setup = async () => {
    const m = await native(), state = {streams: m.createStreams(72), actors: {player: {worldId: 'base.frontier'}}};
    m.bindGameStreams(() => state);
    m.templates.keyed = [{canBeStarted: () => true, items: ['Stale bread', 'Wolf leather armor', 'Steel chainmail armor'].map(n =>
        ({canBeStarted: () => true, item_name: n, chance: 1, count: [2, 9], ...(n.includes('armor') ? {quality: [100, 170]} : {})}))}];
    return {m, mk: () => new m.TraderComponent({name: 'keyed test', inventory_template: 'keyed'})};
};

test('non-opt-in fill is unchanged and ignores any seed argument absence', async () => {
    const {m, mk} = await setup();
    const t = mk(); t.fillInventoryFromTemplate({});
    const old = snap(t);
    t.emptyInventory(); t.fillInventoryFromTemplate({}, undefined);
    assert.equal(snap(t), old);
    assert.ok(Object.keys(t.getTradeInventory()).length > 0);
});

test('opt-in: same seed and day repeat exactly; unrelated draws change nothing; seed matters', async () => {
    const {m, mk} = await setup(), t = mk();
    t.fillInventoryFromTemplate({}, 4242); const a = snap(t);
    m.gameKeyedRandom(m.STREAMS.market, 'unrelated'); m.gameKeyedRandom(m.STREAMS.market, 'unrelated2');
    t.emptyInventory(); t.fillInventoryFromTemplate({}, 4242);
    assert.equal(snap(t), a);
    t.emptyInventory(); t.fillInventoryFromTemplate({}, 99);
    assert.notEqual(snap(t), a);
});
