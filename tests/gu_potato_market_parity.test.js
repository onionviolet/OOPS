import assert from 'node:assert/strict';
import test from 'node:test';
import {
    detonatePotatoBuyer, keeperPotatoMarket, potatoBuyer, potatoBuyerPlot, potatoMarketEffects,
    potatoMarketOptions, potatoMarketView, settlePotatoMarket, validatePotatoMarket,
} from '../src/gu_keeper_potato_market.js';
import {
    advancePotatoMarketCase, disturbPotatoMarketCase, openPotatoMarketCase, readPotatoMarketCase,
    settlePotatoMarketCase,
} from '../src/world_packs/gu_potato_market_case.js';

const annex = 'book.ri.keeper.annex';
const stone = JSON.stringify({id: 'book.ri.keeper.stone'});
const fruitKey = JSON.stringify({id: 'book.ri.keeper.thunder_potato.fruit'});
const fruit = {id: 'gu-fruit:1:1', kind: 'charred-thunder-potato', rank: 2, producer: 'mother',
    operator: 'player', holder: 'player', batch: 1, sound: true, phase: 'viable'};
const crested = {...fruit, id: 'gu-fruit:1:2', producer: 'crested-mother', force: 2};
const sold = (f = fruit) => ({...f, holder: potatoBuyer});
const planted = (f = fruit, extra = {}) => ({...sold(f), phase: 'planted', plot: potatoBuyerPlot.id,
    depth: 'deep', readyAt: 20, ...extra});
const defaults = {clock: 10, fruits: [fruit, crested], wallet: 1, playerWallet: 0, allowance: 1};
const act = (op, status = 'complete') => ({op, status});
const at = clock => ({clock});
const hit = (vibration, spent = null) => ({vibration, spent});

const cases = [
    ['usual sale, exact buyback, and resale', {}, [act('sell_usual'), act('buy_back'), act('sell_usual')]],
    ['crested sale, plant, one minute early, exactly ready, and repeat', {},
        [act('sell_crested'), act('plant_sale'), at(19), act('test_sale', 'refused'), at(20),
            act('test_sale'), act('test_sale', 'refused')]],
    ['usual fruit detonates without clearing, with implicit force', {},
        [act('sell_usual'), act('plant_sale'), at(21), act('test_sale')]],
    ['usual blast preserves earlier clearance', {fruits: [planted()], cleared: true,
        last: {id: crested.id, producer: crested.producer, force: 2}}, [at(20), act('test_sale')]],
    ['no buyer funds', {wallet: 0}, [act('sell_usual', 'refused')]],
    ['buyer away', {buyerPlace: 'elsewhere'}, [act('sell_crested', 'refused')]],
    ['buyer dead in annex', {alive: false}, [act('sell_usual', 'refused')]],
    ['no viable offer at requested force', {fruits: [fruit, {...crested, phase: 'refined'}]}, [act('sell_crested', 'refused')]],
    ['empty stock', {fruits: []}, [act('sell_usual', 'refused'), act('plant_sale', 'refused'), hit(2)]],
    ['occupied buyer, and unfunded buyback', {fruits: [fruit, sold(crested)], wallet: 1},
        [act('sell_usual', 'refused'), act('buy_back', 'unfunded')]],
    ['planted fruit cannot trade or plant twice', {fruits: [planted()]},
        [act('buy_back', 'refused'), act('plant_sale', 'refused')]],
    ['deep fruit needs maturity and force two even when the steward is away',
        {fruits: [planted(crested)], buyerPlace: 'elsewhere'},
        [at(19), hit(2), at(20), hit(1), hit(2, crested.id), hit(2)]],
    ['shallow fruit fires at force one', {fruits: [planted(fruit, {depth: 'shallow'})]},
        [at(20), hit(0), hit(1, fruit.id)]],
    ['ready fruit in a different plot cannot answer the bed test',
        {fruits: [planted(fruit, {plot: 'other-bed'})]}, [at(20), act('test_sale', 'failed')]],
    ['wrong material refuses planting atomically', {fruits: [sold({...fruit, kind: 'other'})]},
        [act('plant_sale', 'refused')]],
    ['occupied bed refuses planting atomically', {fruits: [sold(), {...planted(crested), holder: 'player'}]},
        [act('plant_sale', 'refused')]],
];

function oldWorld(input) {
    const {clock, fruits, buyerPlace = annex, alive = true, last, cleared} = input;
    const purse = (actor, balance) => ({[stone]: balance,
        [fruitKey]: fruits.filter(f => f.holder === actor && f.phase === 'viable').length});
    return {
        row: {fruits, nextBatch: 2, ...(last === undefined ? {} : {buyerResult: last}),
            ...(cleared === undefined ? {} : {buyerCleared: cleared})},
        allowance: input.allowance,
        state: {clock, actors: {player: {completed: {}}}, simulation: {
            people: {player: {location: annex}, [potatoBuyer]: {location: buyerPlace, life: alive ? 'alive' : 'dead'}},
            owners: {player: purse('player', input.playerWallet), [potatoBuyer]: purse(potatoBuyer, input.wallet)},
        }},
    };
}

function oldAct(old, op) {
    // The authored native command quotes buyback funds before invoking the adapter.
    const {state} = old;
    if (op === 'buy_back' && potatoMarketOptions(state, old.row).buy_back && !state.simulation.owners.player[stone])
        return 'unfunded';
    let next;
    try {
        next = settlePotatoMarket(state, old.row, op);
    } catch (error) {
        assert.match(error.message, /cannot make|did not detonate|Refine a viable fruit|fertile, empty plot/);
        return /did not detonate/.test(error.message) ? 'failed' : 'refused';
    }
    old.row = next;
    // Replay the stock intents returned by the legacy module. Its planting
    // allowance is supplied and consumed inside the adapter for each planting.
    for (const effect of potatoMarketEffects(op)) {
        const owners = state.simulation.owners;
        if (effect.type === 'transfer') {
            owners[effect.from][effect.key] -= effect.count;
            owners[effect.to][effect.key] += effect.count;
        } else {
            assert.equal(effect.type, 'item');
            owners[effect.actor][effect.key] += effect.amount;
        }
    }
    if (op === 'plant_sale') old.allowance -= 1;
    const key = `${keeperPotatoMarket}.${op}`;
    state.actors.player.completed[key] = (state.actors.player.completed[key] ?? 0) + 1;
    return 'complete';
}

function oldRead({row, state, allowance}) {
    const buyer = state.simulation.owners[potatoBuyer];
    const player = state.simulation.owners.player;
    return {row, view: potatoMarketView(row, state.clock),
        options: potatoMarketOptions(state, row),
        accounts: {wallet: buyer[stone], playerWallet: player[stone], stock: buyer[fruitKey],
            playerStock: player[fruitKey], allowance}};
}

for (const [name, overrides, steps] of cases) test(`Keeper potato market parity: ${name}`, () => {
    const input = {...defaults, ...overrides};
    const old = oldWorld(input);
    let engine = openPotatoMarketCase({...input, extra: {nextBatch: 2}});
    assert.deepEqual(readPotatoMarketCase(engine), oldRead(old));
    for (const step of steps) {
        const previous = engine;
        if ('clock' in step) {
            old.state.clock = step.clock;
            engine = advancePotatoMarketCase(engine, step.clock);
        } else if ('op' in step) {
            const result = settlePotatoMarketCase(engine, step.op);
            assert.equal(oldAct(old, step.op), step.status);
            assert.equal(result.status, step.status);
            engine = result.engine;
            if (step.status !== 'complete') assert.equal(engine, previous);
        } else {
            const result = disturbPotatoMarketCase(engine, step.vibration);
            const legacy = detonatePotatoBuyer(old.row, old.state.clock, step.vibration);
            assert.equal(legacy.spent, step.spent);
            assert.equal(result.spent, step.spent);
            old.row = legacy.row;
            engine = result.engine;
            if (!step.spent) assert.equal(engine, previous);
        }
        assert.equal(engine.world.clock, old.state.clock);
        assert.deepEqual(readPotatoMarketCase(engine), oldRead(old));
        const newRows = engine.world.chain.filter(row => row.seq > previous.world.seq);
        const traded = newRows.filter(row => row.kind === 'fruit.traded');
        const intents = step.status === 'complete' && potatoMarketEffects(step.op);
        const transfer = intents && intents.find(effect => effect.type === 'transfer' && effect.key === fruitKey);
        if (transfer) {
            const cash = intents.find(effect => effect.key === stone);
            assert.equal(traded.length, 1);
            const {fruit: id, from, to, paid} = traded[0].detail;
            assert.deepEqual({from, to, paid}, {from: transfer.from, to: transfer.to, paid: cash.count});
            assert.equal(old.row.fruits.find(f => f.id === id)?.holder, to);
            assert.equal(readPotatoMarketCase(previous).row.fruits.find(f => f.id === id)?.holder, from);
        } else assert.equal(traded.length, 0);

        const detonated = !!step.spent || (step.op === 'test_sale' && step.status === 'complete');
        assert.equal(newRows.filter(row => row.kind === 'fruit.detonated').length, Number(detonated));
        const blasts = engine.world.chain.filter(e => e.kind === 'fruit.detonated');
        if (blasts.length) {
            assert.deepEqual(blasts.at(-1).detail, old.row.buyerResult);
            assert.equal(blasts.at(-1).place, potatoBuyerPlot.id);
        }
        // Journeys from fresh, valid native state must continue to satisfy the
        // old receipt validator after every step, even when a command refuses.
        if (!Object.hasOwn(overrides, 'fruits'))
            validatePotatoMarket(old.state, {extensions: [{id: keeperPotatoMarket}]}, old.row,
                producer => producer === crested.producer ? 2 : 1);
    }
});

test('Keeper potato market divergence: a stronger blast can clear the same stone (AD38)', () => {
    const stronger = {...crested, force: 3};
    const input = {...defaults, clock: 20, fruits: [planted(stronger)]};
    const old = oldWorld(input);
    const legacy = detonatePotatoBuyer(old.row, 20, 2);
    const engine = openPotatoMarketCase({...input, extra: {nextBatch: 2}});
    const actual = disturbPotatoMarketCase(engine, 2);
    assert.equal(actual.spent, legacy.spent);
    const {buyerCleared, ...row} = readPotatoMarketCase(actual.engine).row;
    const {buyerCleared: legacyCleared, ...legacyRow} = legacy.row;
    assert.deepEqual(row, legacyRow);
    assert.equal(legacyCleared, false);
    assert.equal(buyerCleared, true);
    assert.equal(potatoMarketOptions(old.state, legacy.row).enter, false);
    assert.equal(readPotatoMarketCase(actual.engine).options.enter, true);
});
