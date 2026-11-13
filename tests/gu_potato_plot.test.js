import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {GU_POTATO_PLOT_LAW as law, GU_POTATO_PLOT_LEGACY_LAW, guPotatoPlotPack, potatoFruit, potatoPlotWorking} from '../src/world_packs/gu_potato_plot.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {linkDistance, readLineage, worldLinks} from '../src/world_substrate.js';

const silver = 'energy:primeval.rank3', copper = 'energy:primeval.rank1';
const stones = 'stock:primeval_stone';
const petals = 'stock:moon-orchid-petals';
const config = {ownPacks: [guPotatoPlotPack], packs: ['l.living_body', guPotatoPlotPack.id], host: {laws: [law, GU_POTATO_PLOT_LEGACY_LAW]},
    shared: {quantities: sharedQuantities(['energy', 'stock']), properties: [
        ...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES, {id: 'gu_rank', type: 'level', min: 1}, {id: 'injured', type: 'flag'},
    ]}};

function setup() {
    const kind = 'charred-thunder-potato-mother';
    return createEngineWorld({...config, drawRoot: 7, holders: [
        {id: 'pit', kind: 'place', quantities: {'stock:rubble': 1}, properties: {gu_fertile: true, gu_blocked_exit: 'recess-path'}},
        {id: 'recess', kind: 'place'},
        {id: 'borrower', kind: 'body', as: ['operator'], place: 'pit', properties: {alive: true},
            quantities: {[silver]: 4, [copper]: 1, [stones]: 2}},
        {id: 'owner', kind: 'body', as: ['operator'], place: 'pit', properties: {alive: true}, quantities: {[copper]: 2, [stones]: 0}},
        {...guBodyHolder({id: kind, needs: 'gu'}, {id: 'mother', place: 'pit', satiety: 20}),
            properties: {alive: true, gu_kind: kind, gu_rank: 3, gu_keeper: 'owner', gu_controller: 'borrower'}},
    ], links: [{id: 'recess-path', kind: 'path', from: 'pit', to: 'recess', state: 'closed'}]});
}

const restore = engine => restoreEngineWorld(serializeEngineWorld(engine), config);
const amount = (engine, id, name) => engine.world.holders[id].quantities[name];
const fruit = engine => potatoFruit(engine, 'mother');
const advance = (engine, to) => advanceEngineWorld(engine, to).engine;
function queue(engine, operator, options, id = options.action + '.' + engine.world.clock) {
    const method = potatoPlotWorking({...options, producer: 'mother'});
    return startEngineWorking(engine, {id, law, method,
        bindings: {operator: {kind: 'operator', id: operator}, plot: {kind: 'place', id: 'pit'},
            ...(options.action === 'produce' && {mother: {kind: 'gu', id: 'mother'}})}});
}
const act = (engine, operator, options) => advance(queue(engine, operator, options), engine.world.clock + 1);

test('a borrowed Mother produces fruit for its owner, who grows a distinct Gu that opens the recess', () => {
    const produced = act(setup(), 'borrower', {action: 'produce'});
    assert.equal(amount(produced, 'borrower', silver), 2);
    assert.equal(fruit(produced).length, 4);
    assert.ok(fruit(produced).every(row => row.holder === 'owner' && row.phase === 'unsorted' && !('sound' in row)));
    const sorted = act(produced, 'owner', {action: 'sort', batch: 1});
    const viable = fruit(sorted).find(row => row.phase === 'viable');
    assert.ok(viable);
    const orphaned = restore(applyEngineOps(sorted, [{op: 'lifecycle', act: 'end', holder: 'mother'}], 'fixture:mother-lost'));
    assert.equal(orphaned.world.holders.mother, undefined);
    assert.deepEqual(fruit(orphaned), fruit(sorted));
    const planted = act(orphaned, 'owner', {action: 'plant', fruit: viable.id, depth: 'deep'});
    assert.equal(amount(planted, 'owner', copper), 1);
    const id = 'mother.' + viable.id;
    assert.equal(planted.world.holders[id].properties.gu_controller, 'owner');
    assert.equal(fruit(planted).find(row => row.id === viable.id).producer, 'mother');
    assert.deepEqual(readLineage(planted.world, id).at(-1).parents, ['mother.potato-fruit']);
    assert.deepEqual(readLineage(planted.world, 'mother.potato-fruit').at(0).parents, ['mother']);
    assert.equal(advance(act(planted, 'owner', {action: 'disturb', vibration: 2}), 12).world.links[0].state, 'closed');
    const mature = advance(restore(advance(planted, 8)), 13);
    assert.deepEqual(serializeEngineWorld(mature), serializeEngineWorld(advance(planted, 13)));
    assert.equal(linkDistance(worldLinks(mature.world), 'pit', 'recess'), null);
    const light = act(mature, 'borrower', {action: 'disturb', vibration: 1});
    assert.equal(light.world.links[0].state, 'closed');
    const pending = queue(light, 'borrower', {action: 'disturb', vibration: 2});
    const hit = advance(restore(pending), 15);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(pending, 15)));
    assert.equal(hit.world.holders[id], undefined);
    assert.equal(hit.world.links[0].state, 'open');
    assert.deepEqual(linkDistance(worldLinks(hit.world), 'pit', 'recess').route, ['recess-path']);
    assert.equal(amount(hit, 'pit', 'stock:rubble'), 0);
    const repeated = act(hit, 'borrower', {action: 'disturb', vibration: 2});
    assert.equal(repeated.world.chain.filter(row => row.detail?.result === 'detonated').length, 1);
});

test('the borrower cannot sort the owner’s fruit and barren soil cannot charge the owner', () => {
    const produced = act(setup(), 'borrower', {action: 'produce'});
    const refused = act(produced, 'borrower', {action: 'sort', batch: 1});
    assert.deepEqual(fruit(refused), fruit(produced));
    const sorted = act(refused, 'owner', {action: 'sort', batch: 1});
    const viable = fruit(sorted).find(row => row.phase === 'viable');
    assert.ok(viable);
    const barren = applyEngineOps(sorted, [{op: 'property', holder: 'pit', property: 'gu_fertile', value: false}], 'fixture:barren');
    const result = act(barren, 'owner', {action: 'plant', fruit: viable.id, depth: 'deep'});
    assert.equal(amount(result, 'owner', copper), 2);
    assert.deepEqual(fruit(result), fruit(sorted));
});

test('a hungry Mother produces no fruit and spends no borrower essence', () => {
    const queued = queue(setup(), 'borrower', {action: 'produce'});
    const hungry = applyEngineOps(queued, [{op: 'set', holder: 'mother', quantity: 'satiety', amount: 1}], 'fixture:hunger');
    const result = advance(restore(hungry), 1);
    assert.equal(amount(result, 'borrower', silver), 4);
    assert.deepEqual(fruit(result), []);
    assert.ok(result.world.chain.some(row => row.kind === 'gu.potato.resolved' && row.detail.result === 'needs feeding'));
});

test('paid soil dressing shortens remaining growth once and lets the same fruit detonate early', () => {
    const initial = applyEngineOps(setup(), [
        {op: 'carry', holder: 'owner', quantity: petals}, {op: 'set', holder: 'owner', quantity: petals, amount: 2},
        {op: 'carry', holder: 'borrower', quantity: petals}, {op: 'set', holder: 'borrower', quantity: petals, amount: 1},
    ], 'fixture:dressing-stock');
    const produced = act(initial, 'borrower', {action: 'produce'});
    const sorted = act(produced, 'owner', {action: 'sort', batch: 1});
    const viable = fruit(sorted).find(row => row.phase === 'viable');
    const planted = act(sorted, 'owner', {action: 'plant', fruit: viable.id, depth: 'deep'});
    const plantedFruit = engine => fruit(engine).find(row => row.id === viable.id);
    assert.equal(plantedFruit(planted).readyAt, 13);

    const dress = {action: 'dress', fruit: viable.id};
    const refused = act(planted, 'borrower', dress);
    assert.equal(amount(refused, 'borrower', petals), 1);
    assert.equal(plantedFruit(refused).readyAt, 13);
    const pending = queue(queue(refused, 'owner', dress, 'dress-a'), 'owner', dress, 'dress-b');
    const unfunded = applyEngineOps(pending, [{op: 'set', holder: 'owner', quantity: petals, amount: 0}], 'fixture:petals-lost');
    assert.equal(plantedFruit(advance(restore(unfunded), 5)).readyAt, 13);
    const dressed = advance(restore(pending), 5);
    assert.deepEqual(serializeEngineWorld(dressed), serializeEngineWorld(advance(pending, 5)));
    assert.equal(plantedFruit(dressed).dressedAt, 5);
    assert.equal(plantedFruit(dressed).readyAt, 9);
    assert.equal(amount(dressed, 'owner', petals), 1);

    const disturbance = {action: 'disturb', vibration: 2};
    assert.equal(act(advance(dressed, 7), 'borrower', disturbance).world.links[0].state, 'closed');
    assert.equal(act(advance(planted, 8), 'borrower', disturbance).world.links[0].state, 'closed');
    const hit = act(advance(restore(dressed), 8), 'borrower', disturbance);
    assert.equal(plantedFruit(hit).phase, 'spent');
    assert.equal(hit.world.holders[`mother.${viable.id}`], undefined);
    assert.equal(hit.world.links[0].state, 'open');
});

test('the parent sets blast force and the soil sets when that same fruit can clear the route', () => {
    for (const force of [1, 2]) {
        for (const minutes of [5, 10]) {
            const initial = applyEngineOps(setup(), [
                {op: 'set', holder: 'pit', quantity: 'stock:rubble', amount: 2},
                {op: 'property', holder: 'mother', property: 'gu_potato_force', value: force},
                {op: 'property', holder: 'pit', property: 'gu_potato_development', value: minutes},
            ], 'fixture:parent-and-soil');
            const produced = act(initial, 'borrower', {action: 'produce'});
            assert.equal(amount(produced, 'borrower', silver), 2);
            const sorted = act(produced, 'owner', {action: 'sort', batch: 1});
            const viable = fruit(sorted).find(row => row.phase === 'viable');
            assert.equal(viable.force, force);
            const sold = advance(offer(sorted, 'sell-fruit', viable.id), 3);
            assert.equal(fruit(sold).find(row => row.id === viable.id).holder, 'borrower');
            const orphaned = applyEngineOps(sold, [{op: 'lifecycle', act: 'end', holder: 'mother'}], 'fixture:mother-lost');
            const planted = act(orphaned, 'borrower', {action: 'plant', fruit: viable.id, depth: 'deep'});
            const id = `mother.${viable.id}`;
            assert.equal(amount(planted, 'borrower', copper), 0);
            assert.equal(planted.world.holders[id].properties.gu_potato_force, force);
            const ready = 4 + minutes;
            assert.equal(fruit(planted).find(row => row.id === viable.id).readyAt, ready);

            const disturbance = {action: 'disturb', vibration: 2};
            const early = act(advance(planted, ready - 2), 'owner', disturbance);
            assert.ok(early.world.holders[id]);
            assert.equal(amount(early, 'pit', 'stock:rubble'), 2);
            const pending = queue(early, 'owner', disturbance);
            const hit = advance(restore(pending), ready);
            assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(pending, ready)));
            assert.equal(hit.world.holders[id], undefined);
            assert.equal(amount(hit, 'pit', 'stock:rubble'), 2 - force);
            assert.equal(linkDistance(worldLinks(hit.world), 'pit', 'recess') !== null, force === 2);
        }
    }
});

test('siblings inherit blast force and vibration sensitivity separately across restore', () => {
    const initial = applyEngineOps(setup(), [
        {op: 'set', holder: 'pit', quantity: 'stock:rubble', amount: 3},
        {op: 'property', holder: 'mother', property: 'gu_potato_force', value: 2},
        {op: 'property', holder: 'mother', property: 'gu_potato_force_spread', value: 1},
        {op: 'property', holder: 'mother', property: 'gu_potato_trigger', value: 3},
        {op: 'property', holder: 'mother', property: 'gu_potato_trigger_spread', value: 2},
    ], 'fixture.variable-parent');
    const pending = queue(initial, 'borrower', {action: 'produce'});
    const produced = advance(restore(pending), 1);
    assert.deepEqual(serializeEngineWorld(produced), serializeEngineWorld(advance(pending, 1)));
    assert.equal(amount(produced, 'borrower', silver), 2);
    assert.ok(fruit(produced).every(row => !Object.hasOwn(row, 'force') && !Object.hasOwn(row, 'trigger')));
    const sorted = act(restore(produced), 'owner', {action: 'sort', batch: 1});
    const siblings = fruit(sorted).filter(row => row.phase === 'viable');
    assert.deepEqual(siblings.map(row => row.force).sort(), [2, 3]);
    assert.deepEqual(siblings.map(row => [row.force, row.trigger]), [[3, 2], [2, 4]]);
    const invalid = applyEngineOps(initial, [
        {op: 'property', holder: 'mother', property: 'gu_potato_trigger', value: null},
    ], 'fixture:spread-without-base');
    const refused = act(invalid, 'borrower', {action: 'produce'});
    assert.equal(amount(refused, 'borrower', silver), 4);
    assert.equal(fruit(refused).length, 0);
    assert.equal(refused.world.chain.at(-1).detail.reason, 'Invalid inherited trigger range.');
    const orphaned = applyEngineOps(sorted, [{op: 'lifecycle', act: 'end', holder: 'mother'}], 'fixture.mother-lost');
    for (const sibling of siblings) {
        const planted = act(restore(orphaned), 'owner', {action: 'plant', fruit: sibling.id, depth: 'deep'});
        assert.equal(amount(planted, 'owner', copper), 1);
        const ready = fruit(planted).find(row => row.id === sibling.id).readyAt;
        const early = act(advance(restore(planted), ready - 2), 'owner', {action: 'disturb', vibration: sibling.trigger + 1});
        const weak = act(early, 'owner', {action: 'disturb', vibration: sibling.trigger});
        assert.equal(amount(weak, 'pit', 'stock:rubble'), 3);
        assert.equal(fruit(weak).find(row => row.id === sibling.id).phase, 'planted');
        const queued = queue(weak, 'owner', {action: 'disturb', vibration: sibling.trigger + 1});
        const hit = advance(restore(queued), ready + 1);
        assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(queued, ready + 1)));
        assert.equal(amount(hit, 'pit', 'stock:rubble'), 3 - sibling.force);
        assert.equal(hit.world.links[0].state, sibling.force === 3 ? 'open' : 'closed');
    }
});

test('a saved legacy sort moves its Mother-held batch into independent storage once', () => {
    const produced = act(setup(), 'borrower', {action: 'produce'});
    const pack = guPotatoPlotPack.id;
    const store = 'mother.potato-fruit';
    const old = applyEngineOps(setup(), [{op: 'state', holder: 'mother', pack,
        value: produced.world.holders[store].state[pack]}], 'fixture:old-save');
    const roles = {operator: 'operator', mother: 'gu', plot: 'place'};
    const bindings = {operator: {kind: 'operator', id: 'owner'}, mother: {kind: 'gu', id: 'mother'}, plot: {kind: 'place', id: 'pit'}};
    const pending = startEngineWorking(old, {id: 'legacy-sort', law: GU_POTATO_PLOT_LEGACY_LAW, bindings,
        method: {id: 'gu.potato.sort', revision: 1, law: GU_POTATO_PLOT_LEGACY_LAW.ref, roles, steps: [{
            op: 'cultivate', bindings: {operator: 'operator', mother: 'mother', plot: 'plot'}, options: {action: 'sort', batch: 1},
        }]}});
    const sorted = advance(restore(pending), 1);
    assert.equal(sorted.world.holders.mother.state[pack], undefined);
    assert.ok(sorted.world.holders[store].state[pack].fruits.some(row => row.phase === 'viable'));
    assert.deepEqual(fruit(restore(sorted)), fruit(sorted));
});

function offer(engine, id, fruitId, price = 1) {
    return startEngineWorking(engine, {id, law,
        method: potatoPlotWorking({action: 'trade', producer: 'mother', fruit: fruitId, price}),
        bindings: {operator: {kind: 'operator', id: 'owner'}, buyer: {kind: 'operator', id: 'borrower'},
            plot: {kind: 'place', id: 'pit'}}});
}

test('two offers for the same fruit settle one transfer, and the buyer plants that exact fruit', () => {
    const sorted = act(act(setup(), 'borrower', {action: 'produce'}), 'owner', {action: 'sort', batch: 1});
    const viable = fruit(sorted).find(row => row.phase === 'viable');
    const orphaned = applyEngineOps(sorted, [{op: 'lifecycle', act: 'end', holder: 'mother'}], 'fixture:mother-lost');
    const pending = offer(offer(orphaned, 'first', viable.id), 'second', viable.id);
    const sold = advance(restore(pending), 3);

    assert.deepEqual(serializeEngineWorld(sold), serializeEngineWorld(advance(pending, 3)));
    assert.deepEqual(fruit(sold).find(row => row.id === viable.id), {...viable, holder: 'borrower'});
    assert.equal(amount(sold, 'borrower', stones), 1);
    assert.equal(amount(sold, 'owner', stones), 1);
    assert.equal(sold.world.chain.filter(row => row.detail?.result === 'traded').length, 1);
    assert.ok(sold.world.chain.some(row => row.detail?.action === 'trade' && row.detail.result === 'refused'));

    const refused = act(sold, 'owner', {action: 'plant', fruit: viable.id, depth: 'deep'});
    assert.equal(amount(refused, 'owner', copper), 2);
    const planted = act(refused, 'borrower', {action: 'plant', fruit: viable.id, depth: 'deep'});
    assert.equal(amount(planted, 'borrower', copper), 0);
    assert.equal(planted.world.holders['mother.' + viable.id].properties.gu_controller, 'borrower');
    const blasted = act(advance(restore(planted), 15), 'owner', {action: 'disturb', vibration: 2});
    assert.deepEqual(linkDistance(worldLinks(blasted.world), 'pit', 'recess').route, ['recess-path']);
});

test('lost funds or a departing buyer leave the fruit and seller’s purse intact', () => {
    const sorted = act(act(setup(), 'borrower', {action: 'produce'}), 'owner', {action: 'sort', batch: 1});
    const viable = fruit(sorted).find(row => row.phase === 'viable');
    const pending = offer(sorted, 'sale', viable.id);
    for (const change of [{op: 'set', holder: 'borrower', quantity: stones, amount: 0},
        {op: 'move', holder: 'borrower', to: 'recess'}]) {
        const disrupted = applyEngineOps(pending, [change], 'fixture:lost-means');
        const result = advance(restore(disrupted), 3);
        assert.deepEqual(fruit(result), fruit(sorted));
        assert.equal(amount(result, 'owner', stones), 0);
        assert.equal(amount(result, 'borrower', stones), amount(disrupted, 'borrower', stones));
        if (change.op === 'set') assert.ok(result.world.chain.some(row => row.detail?.result === 'trade-unfunded'));
        else assert.equal(result.records.workings.sale.record.status, 'interrupted');
    }
});
