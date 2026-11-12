// PC95, AR12, WSC19. Local trade terms and fruit response on substrate holders.
// The steward offers one stone per fruit and tends one bed. More beds or a
// different steward's terms are world data. Deeper burial needs a heavier blow.
import {advanceEngineWorld, applyEngineOps, createEngineWorld} from '../engine_world.js';
import {beginWorking, settleWorking} from '../kernel_working.js';
import {TRADE_LAW, marketPorts, tradeDeal} from '../market_trade.js';
import {COIN, MARKET_PACK, stockOf} from '../market_substrate.js';
import {evaluateRule} from '../rules.js';
import {applyEffect} from '../world_effects.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../world_quantities.js';
import {thunderPotatoPropagation} from '../gu_propagation.js';

const prefix = 'book.ri.keeper';
const market = `${prefix}.thunder_potato_market`;
const steward = `${prefix}.steward`;
const annex = `${prefix}.annex`;
const bed = `${market}.bed`;
const seller = 'player';
const good = 'thunder_potato_fruit';
const stock = stockOf(good);
const coin = COIN.id;
const essence = 'energy:primeval.rank1';
const ripeField = id => `ripening:${id}`;
const receiptKind = 'fruit.detonated';
const tradeKind = 'fruit.traded';
const clearingForce = 2;
const price = 1;
const planting = {depth: 'deep', minutes: thunderPotatoPropagation.developmentMinutes,
    cost: thunderPotatoPropagation.plantingCost};
const impulse = {shallow: 1, deep: 2};
const property = (id, type = 'label') => ({id, type});
const fruitProperties = [
    property('custodian'), property('phase'), property('depth'), property('producer'),
    property('force', 'level'), property('ready_at', 'level'),
];
const atLeast = (fact, value) => ({fact, op: 'gte', value});
const eq = (fact, value) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const present = eq('present', true);
const viable = eq('phase', 'viable');
const canSell = force => all(present, eq('occupied', false), atLeast('wallet', price), eq('offer', force));
const deal = tradeDeal({good, count: 1, unitPrice: price});
const trade = (from, to) => ({seller: {kind: 'trader', id: from}, buyer: {kind: 'trader', id: to}});
const actions = {
    sell_usual: {requires: canSell(1), offer: 1, trade: trade(seller, steward)},
    sell_crested: {requires: canSell(2), offer: 2, trade: trade(seller, steward)},
    buy_back: {requires: all(present, viable), trade: trade(steward, seller)},
    plant_sale: {requires: all(present, viable), plant: planting},
    test_sale: {requires: all(present, eq('phase', 'planted'), eq('mature', true)), vibration: impulse.deep},
};
const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const set = (holder, name, value) => ({op: 'property', holder, property: name, value});
const plantField = (id, until) => ({id: ripeField(id), scope: id, kind: 'block',
    params: {verb: 'transform', object: 'property:phase'}, until});

export function openPotatoMarketCase({clock, fruits, wallet, playerWallet, allowance = planting.cost,
    buyerPlace = annex, alive = true, last, cleared, extra = {}}) {
    const accounts = (id, balance, place, living, quantities = {}) => ({
        id, kind: 'body', place, properties: {alive: living},
        quantities: {[coin]: balance, [stock]: fruits.filter(f => f.holder === id && f.phase === 'viable').length,
            ...quantities},
    });
    const places = [...new Set([annex, bed, buyerPlace, ...fruits.map(f => f.plot).filter(Boolean)])];
    const holders = [
        ...places.map(id => ({id, kind: 'place'})),
        accounts(seller, playerWallet, annex, true),
        accounts(steward, wallet, buyerPlace, alive, {[essence]: allowance}),
        ...fruits.map(({id, holder, phase, producer, force, plot, depth, readyAt, ...identity}) => ({
            id, kind: 'thing', as: ['gu'], place: plot ?? annex, tags: ['market.fruit'],
            properties: {custodian: holder, phase, producer, ...(force === undefined ? {} : {force}),
                ...(depth === undefined ? {} : {depth}), ...(readyAt === undefined ? {} : {ready_at: readyAt})},
            state: {[market]: identity},
        })),
        {id: market, kind: 'thing', place: annex, state: {[market]: {...extra,
            ...(last === undefined ? {} : {buyerResult: last}), ...(cleared === undefined ? {} : {buyerCleared: cleared})}}},
    ];
    return createEngineWorld({clock, holders, packs: [MARKET_PACK],
        settings: {[MARKET_PACK]: {goods: [good]}},
        shared: {properties: [WORLD_PROPERTIES.alive, ...fruitProperties], quantities: [WORLD_QUANTITIES.energy],
            effectKinds: [receiptKind, tradeKind]},
        lawFields: fruits.filter(f => f.phase === 'planted' && f.readyAt > clock).map(f => plantField(f.id, f.readyAt)),
    });
}

const fruitsIn = engine => Object.values(engine.world.holders).filter(h => h.tags.includes('market.fruit'));
const inCustody = (fruits, id) => fruits.filter(f => f.properties.custodian === id);
const forceOf = fruit => fruit.properties.force ?? 1;
const saleOffer = (fruits, force) => inCustody(fruits, seller).find(f =>
    f.properties.phase === 'viable' && forceOf(f) === force);
const mature = (engine, fruit) => !!fruit && !engine.world.laws.some(law => law.id === ripeField(fruit.id));

export function readPotatoMarketCase(engine) {
    const fruits = fruitsIn(engine);
    const fruit = inCustody(fruits, steward)[0];
    const buyer = engine.world.holders[steward];
    const state = engine.world.holders[market].state[market];
    const cleared = state.buyerCleared === true;
    const facts = {
        present: buyer.properties.alive && buyer.place === annex,
        occupied: !!fruit, wallet: buyer.quantities[coin], phase: fruit?.properties.phase,
        mature: mature(engine, fruit),
    };
    const options = Object.fromEntries(Object.entries(actions).map(([name, row]) => [name,
        evaluateRule(row.requires, {...facts, offer: saleOffer(fruits, row.offer) ? row.offer : null}).met]));
    options.enter = cleared;
    const view = {
        fruit: fruit && {id: fruit.id, force: forceOf(fruit), planted: facts.phase === 'planted',
            remaining: Math.max(0, (fruit.properties.ready_at ?? engine.world.clock) - engine.world.clock)},
        last: state.buyerResult, cleared,
    };
    const row = {...state, fruits: fruits.map(h => {
        const {custodian, phase, producer, force, depth, ready_at} = h.properties;
        return {...h.state[market], id: h.id, holder: custodian, phase, producer,
            ...(force === undefined ? {} : {force}), ...(depth === undefined ? {} : {plot: h.place, depth}),
            ...(ready_at === undefined ? {} : {readyAt: ready_at})};
    })};
    const accounts = {
        wallet: buyer.quantities[coin], playerWallet: engine.world.holders[seller].quantities[coin],
        stock: buyer.quantities[stock], playerStock: engine.world.holders[seller].quantities[stock],
        allowance: buyer.quantities[essence],
    };
    return {options, view, row, accounts};
}

export function disturbPotatoMarketCase(engine, vibration) {
    const fruit = fruitsIn(engine).find(h => h.place === bed && h.properties.phase === 'planted');
    if (!fruit || !evaluateRule(atLeast('vibration', impulse[fruit.properties.depth] ?? impulse.shallow), {vibration}).met)
        return {engine, spent: null};
    // Ripening is a timed field on the exact specimen. A physical impulse
    // below the bed's threshold never reaches this effect.
    const result = applyEffect(engine.rules, engine.world, {
        verb: 'transform', object: 'property:phase', value: 'spent',
        target: {shape: 'holder', id: fruit.id},
    }, receiptKind);
    if (!result.outcome.applied.length) return {engine, spent: null};
    const site = result.world.holders[market];
    const buyerResult = {id: fruit.id, producer: fruit.properties.producer, force: forceOf(fruit)};
    // AD38: a stronger blast can move the same stone. The old authored
    // roster supplied two force grades and hard-coded equality to grade two.
    const buyerCleared = !!site.state[market].buyerCleared || forceOf(fruit) >= clearingForce;
    const next = applyEngineOps({...engine, world: result.world}, [
        {op: 'holder_remove', holder: fruit.id},
        {op: 'state', holder: market, pack: market, value: {...site.state[market], buyerResult, buyerCleared}},
        {op: 'publish', kind: receiptKind, place: bed, detail: buyerResult},
    ], market);
    return {engine: next, spent: fruit.id};
}

export function settlePotatoMarketCase(engine, operation) {
    const action = Object.hasOwn(actions, operation) && actions[operation];
    if (!action || !readPotatoMarketCase(engine).options[operation]) return {engine, status: 'refused'};
    const fruits = fruitsIn(engine);
    const fruit = action.offer === undefined ? inCustody(fruits, steward)[0] : saleOffer(fruits, action.offer);
    let ops;
    if (action.trade) {
        const at = engine.world.clock;
        const working = beginWorking(TRADE_LAW, deal, {
            id: `${market}.${operation}`, bindings: action.trade, at,
        });
        const {record, effects} = settleWorking(TRADE_LAW, working, {now: at, ports: marketPorts(engine.world)});
        if (record.status !== 'complete') return {engine, status: 'unfunded'};
        const {buyer, seller: from} = action.trade;
        ops = [...effects.map(row => row.effect), set(fruit.id, 'custodian', buyer.id),
            {op: 'publish', kind: tradeKind, place: annex,
                detail: {fruit: fruit.id, from: from.id, to: buyer.id, paid: record.facts.paid}}];
    } else if (action.plant) {
        const {cost, depth, minutes} = action.plant;
        const until = engine.world.clock + minutes;
        if (engine.world.holders[steward].quantities[essence] < cost ||
            fruits.some(h => h.place === bed && h.properties.phase === 'planted') || fruit.state[market].kind !== thunderPotatoPropagation.id)
            return {engine, status: 'refused'};
        ops = [add(steward, stock, -1), add(steward, essence, -cost),
            {op: 'move', holder: fruit.id, to: bed}, set(fruit.id, 'phase', 'planted'),
            set(fruit.id, 'depth', depth), set(fruit.id, 'ready_at', until),
            {op: 'law_add', field: plantField(fruit.id, until)}];
    } else {
        const result = disturbPotatoMarketCase(engine, action.vibration);
        return {engine: result.engine, status: result.spent ? 'complete' : 'failed'};
    }
    return {engine: applyEngineOps(engine, ops, `${market}.${operation}`), status: 'complete'};
}

export function advancePotatoMarketCase(engine, clock) {
    return advanceEngineWorld(engine, clock).engine;
}
