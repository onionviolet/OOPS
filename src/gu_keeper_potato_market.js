import {disturbGuPlot, plantGuFruit, refineGuFruit, transferGuFruit, thunderPotatoPropagation as rule} from './gu_propagation.js';

const prefix = 'book.ri.keeper';
export const keeperPotatoMarket = `${prefix}.thunder_potato_market`;
export const potatoBuyer = `${prefix}.steward`;
export const potatoBuyerPlot = {id: `${keeperPotatoMarket}.bed`, fertile: true};
export const potatoMarketStore = `${keeperPotatoMarket}.store`;
const fruitKey = JSON.stringify({id: `${prefix}.thunder_potato.fruit`});
const stone = JSON.stringify({id: `${prefix}.stone`});
const transfer = (from, to, key) => ({type: 'transfer', from, to, key, count: 1});
const sale = [transfer(potatoBuyer, 'player', stone), transfer('player', potatoBuyer, fruitKey)];
const buyback = [transfer('player', potatoBuyer, stone), transfer(potatoBuyer, 'player', fruitKey)];
const plant = [{type: 'item', actor: potatoBuyer, key: fruitKey, amount: -1}];
const effects = {sell_usual: sale, sell_crested: sale, buy_back: buyback, plant_sale: plant, test_sale: []};
export const potatoMarketOperations = Object.keys(effects);
export const potatoMarketEffects = operation => effects[operation];
export const potatoMarketPin = record => record?.extensions?.some(pin => pin.id === keeperPotatoMarket);
const done = (state, operation) => state.actors.player.completed[`${keeperPotatoMarket}.${operation}`] ?? 0;
const buyerFruit = row => row.fruits.find(fruit => fruit.holder === potatoBuyer);
const offer = (row, force) => row.fruits.find(fruit => fruit.holder === 'player' && fruit.phase === 'viable' && (fruit.force ?? 1) === force);

export function potatoMarketOptions(state, row) {
    const buyer = state.simulation.people[potatoBuyer];
    const here = buyer?.life === 'alive' && buyer.location === `${prefix}.annex`;
    const wallet = state.simulation.owners[potatoBuyer]?.[stone] ?? 0;
    const fruit = buyerFruit(row);
    const available = here && !fruit && wallet >= 1;
    return {sell_usual: available && !!offer(row, 1), sell_crested: available && !!offer(row, 2),
        buy_back: here && fruit?.phase === 'viable', plant_sale: here && fruit?.phase === 'viable',
        test_sale: here && fruit?.phase === 'planted' && fruit.readyAt <= state.clock, enter: row.buyerCleared === true};
}

export function potatoMarketView(row, clock) {
    const fruit = buyerFruit(row);
    return {fruit: fruit && {id: fruit.id, force: fruit.force ?? 1, planted: fruit.phase === 'planted',
        remaining: Math.max(0, (fruit.readyAt ?? clock) - clock)}, last: row.buyerResult, cleared: row.buyerCleared === true};
}

export function validatePotatoMarket(state, record, row, forceFromProducer) {
    const fruits = row?.fruits.filter(fruit => fruit.holder === potatoBuyer) ?? [];
    const held = fruits.filter(fruit => fruit.phase === 'viable').length;
    const sold = done(state, 'sell_usual') + done(state, 'sell_crested');
    const planted = done(state, 'plant_sale');
    const tests = done(state, 'test_sale') + (row?.rollTests ?? 0);
    const result = row?.buyerResult;
    if (fruits.length > 1 || held !== sold - done(state, 'buy_back') - planted ||
        fruits.length - held !== planted - tests || held !== (state.simulation.owners[potatoBuyer]?.[fruitKey] ?? 0) ||
        !!result !== (tests > 0) || sold && !potatoMarketPin(record) ||
        row?.buyerCleared !== undefined && (typeof row.buyerCleared !== 'boolean' || !result) ||
        result && (!/^gu-fruit:\d+:[1-4]$/.test(result.id) || row.fruits.some(fruit => fruit.id === result.id) ||
            result.force !== forceFromProducer(result.producer) || ![1, 2].includes(result.force) ||
            (result.force === 2 && !row.buyerCleared)) ||
        state.simulation.people.player.location === potatoMarketStore && !row?.buyerCleared) {
        throw Error('The steward’s trade and fruit custody disagree.');
    }
}

export function settlePotatoMarket(state, row, operation) {
    if (!potatoMarketOptions(state, row)[operation]) throw Error('The steward cannot make that trade or test now.');
    if (operation.startsWith('sell_')) {
        return transferGuFruit(row, offer(row, operation === 'sell_usual' ? 1 : 2).id, 'player', potatoBuyer);
    }
    const fruit = buyerFruit(row);
    if (operation === 'buy_back') return transferGuFruit(row, fruit.id, potatoBuyer, 'player');
    if (operation === 'plant_sale') {
        const refined = refineGuFruit(row, fruit.id, potatoBuyer);
        return plantGuFruit(refined, {rule, id: fruit.id, operator: potatoBuyer, plot: potatoBuyerPlot,
            depth: 'deep', clock: state.clock, reserves: {[potatoBuyer]: {primeval: rule.plantingCost}}}).state;
    }
    const blast = detonatePotatoBuyer(row, state.clock, 2);
    if (!blast.spent) throw Error('The steward’s fruit did not detonate.');
    return blast.row;
}

export function detonatePotatoBuyer(row, clock, vibration) {
    const {state, spent} = disturbGuPlot(row, {plot: potatoBuyerPlot.id, clock, vibration});
    if (!spent) return {row, spent};
    const fruit = state.fruits.find(candidate => candidate.id === spent);
    return {spent, row: {...state, fruits: state.fruits.filter(candidate => candidate.id !== spent),
        buyerCleared: !!row.buyerCleared || fruit.force === 2,
        buyerResult: {id: spent, producer: fruit.producer, force: fruit.force ?? 1}}};
}
