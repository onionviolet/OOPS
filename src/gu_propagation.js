import {resolveGuActivation} from './gu_activation.js';
import {address, drawFraction} from './gen_kit.js';

export const thunderPotatoPropagation = Object.freeze({
    id: 'charred-thunder-potato', producer: 'charred-thunder-potato-mother',
    producerRank: 3, productRank: 2, batchSize: 4, viability: 0.35,
    productionCost: 2, plantingCost: 1, developmentMinutes: 10,
});

const requireThat = (ok, message) => { if (!ok) throw Error(message); };

function inheritedLevel(base, spread, label) {
    requireThat(Number.isSafeInteger(spread) && spread >= 0 && (base === undefined ? spread === 0 :
        Number.isSafeInteger(base) && base >= 1 && Number.isSafeInteger(base + spread) &&
        Number.isSafeInteger(2 * spread + 1)), `Invalid inherited ${label} range.`);
    return (seed, key) => spread
        ? Math.max(1, base - spread + Math.floor(drawFraction(seed, key) * (2 * spread + 1))) : base;
}

export function produceGuFruit(state, {rule, producer, operator, supply, reserves, clock, seed}) {
    requireThat(producer.kind === rule.producer && producer.rank === rule.producerRank && producer.holder === operator && supply,
        'The operator must hold the living producer Gu.');
    const result = resolveGuActivation({
        stages: [{gu: producer, operator, supply, ability: {fuel: 'primeval', cost: rule.productionCost}}],
        reserves, day: clock,
    });
    if (result.outcome !== 'complete') return {state, reserves, result};
    const batch = state.nextBatch;
    requireThat(Number.isSafeInteger(batch) && batch > 0 && Number.isSafeInteger(batch + 1), 'Invalid production batch.');
    const forceAt = inheritedLevel(producer.offspringForce, producer.offspringForceSpread ?? 0, 'force');
    const triggerAt = inheritedLevel(producer.offspringTrigger, producer.offspringTriggerSpread ?? 0, 'trigger');
    const fruits = Array.from({length: rule.batchSize}, (_, index) => {
        const id = `gu-fruit:${batch}:${index + 1}`;
        const sound = drawFraction(seed, address(rule.id, 'fruit', producer.id, batch, index)) < rule.viability;
        const force = forceAt(seed, address(rule.id, 'fruit-force', producer.id, batch, index));
        const trigger = triggerAt(seed, address(rule.id, 'fruit-trigger', producer.id, batch, index));
        return {id, kind: rule.id, rank: rule.productRank, producer: producer.id, operator, holder: operator, batch, sound,
            phase: 'unsorted', ...(force === undefined ? {} : {force}), ...(trigger === undefined ? {} : {trigger})};
    });
    return {state: {...state, nextBatch: batch + 1, fruits: [...state.fruits, ...fruits]},
        reserves: result.remaining, result};
}

export function transferGuFruitBatch(state, batch, from, to) {
    const rows = state.fruits.filter(row => row.batch === batch);
    requireThat(rows.length && rows.every(row => row.holder === from && row.phase === 'unsorted'),
        'Choose an unsorted batch in your custody.');
    return {...state, fruits: state.fruits.map(row => row.batch === batch ? {...row, holder: to} : row)};
}

export function transferGuFruit(state, id, from, to) {
    const fruit = state.fruits.find(row => row.id === id);
    requireThat(fruit?.phase === 'viable' && fruit.holder === from && from !== to && typeof to === 'string' && to.length,
        'Trade a viable unrefined fruit in your custody.');
    return {...state, fruits: state.fruits.map(row => row.id === id ? {...row, holder: to} : row)};
}

export function sortGuFruit(state, batch, operator) {
    const rows = state.fruits.filter(fruit => fruit.batch === batch);
    requireThat(rows.length && rows.every(row => row.holder === operator && row.phase === 'unsorted'),
        'Choose your unsorted production batch.');
    return {...state, fruits: state.fruits.map(fruit => fruit.batch !== batch ? fruit :
        {...fruit, phase: fruit.sound ? 'viable' : 'discarded'})};
}

export function refineGuFruit(state, id, operator) {
    const fruit = state.fruits.find(row => row.id === id);
    requireThat(fruit?.phase === 'viable' && fruit.holder === operator, 'Choose a viable fruit in your care.');
    return {...state, fruits: state.fruits.map(row => row.id === id ? {...row, phase: 'refined'} : row)};
}

export function plantGuFruit(state, {rule, id, operator, plot, depth, reserves, clock}) {
    const fruit = state.fruits.find(row => row.id === id);
    requireThat(fruit?.phase === 'refined' && fruit.kind === rule.id && fruit.holder === operator,
        'Refine a viable fruit before planting it.');
    const minutes = plot.developmentMinutes ?? rule.developmentMinutes;
    requireThat(plot.fertile && ['shallow', 'deep'].includes(depth) && Number.isSafeInteger(minutes) && minutes >= 0 &&
        Number.isSafeInteger(clock + minutes) &&
        !state.fruits.some(row => row.phase === 'planted' && row.plot === plot.id), 'Choose a fertile, empty plot.');
    // Ch. 213 shows rank-one green copper used for planting the rank-two fruit.
    // This operation uses a planting allowance, separate from the producer charge.
    const available = reserves[operator]?.primeval ?? 0;
    requireThat(available >= rule.plantingCost, 'Gather essence for planting.');
    const next = {...fruit, phase: 'planted', plot: plot.id, depth, readyAt: clock + minutes};
    return {state: {...state, fruits: state.fruits.map(row => row.id === id ? next : row)},
        reserves: {...reserves, [operator]: {...reserves[operator], primeval: available - rule.plantingCost}}};
}

export function disturbGuPlot(state, {plot, clock, vibration}) {
    const fruit = state.fruits.find(row => row.phase === 'planted' && row.plot === plot);
    const contact = vibration - (fruit?.depth === 'deep' ? 1 : 0);
    if (!fruit || fruit.readyAt > clock || contact < (fruit.trigger ?? 1)) return {state, spent: null};
    return {state: {...state, fruits: state.fruits.map(row => row.id === fruit.id ? {...row, phase: 'spent'} : row)},
        spent: fruit.id};
}

export function dressGuFruitSoil(state, {id, operator, plot, clock}) {
    const fruit = state.fruits.find(row => row.id === id);
    requireThat(fruit?.phase === 'planted' && fruit.holder === operator && fruit.plot === plot,
        'Choose a planted fruit in your care.');
    const remaining = fruit.readyAt - clock;
    requireThat(fruit.dressedAt === undefined && remaining > 1, 'This fruit cannot benefit from a dressing now.');
    const next = {...fruit, dressedAt: clock, readyAt: clock + Math.ceil(remaining / 2)};
    return {...state, fruits: state.fruits.map(row => row.id === id ? next : row)};
}

export function observeGuFruit(state) {
    return state.fruits.map(({sound, force, trigger, ...visible}) => visible.phase === 'unsorted' ? visible : {...visible,
        ...(force === undefined ? {} : {force}), ...(trigger === undefined ? {} : {trigger})});
}
