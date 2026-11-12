import {disturbGuPlot, plantGuFruit, produceGuFruit, refineGuFruit, sortGuFruit, thunderPotatoPropagation as rule} from './gu_propagation.js';
import {applyKeeperVitalityEffect, keeperVitality, keeperVitalityFacts, validateKeeperVitality,
    vitalityOperations} from './world_packs/book_gu_keeper_gardens.js';
import {keeperPotatoMarket, potatoBuyer, potatoBuyerPlot, potatoMarketOperations, potatoMarketOptions,
    potatoMarketPin, potatoMarketView, settlePotatoMarket, validatePotatoMarket} from './gu_keeper_potato_market.js';
import {applyDrainOperation, drainOperations, drainOptions, drainPin, drainWake, drainWearPin, keeperDrain, keeperDrainWear,
    settleDrainArrival, validateKeeperDrain, wearOperations} from './gu_keeper_drain.js';

export const keeperPropagation = 'book.ri.keeper.thunder_potato';
export const keeperPotatoTrial = `${keeperPropagation}_trial`;
export const keeperPropagationWorld = 'book.ri.keeper.world';
export const keeperPropagationPit = `${keeperPropagation}.pit`;
export const keeperPotatoFruit = JSON.stringify({id: `${keeperPropagation}.fruit`});
const producer = `${keeperPropagation}.mother`;
const crest = `${keeperPotatoTrial}.mother`;
const fedKey = `${keeperPotatoTrial}.fed_through`;
const recordKey = `${keeperPropagation}.bed`;
const wakeKey = `${keeperDrain}.arrives`;
const annex = 'book.ri.keeper.annex';
const operations = ['produce', 'sort', 'refine', 'plant_shallow', 'plant_deep', 'tap', 'strike'];
const trialOperations = ['feed_crest', 'produce_crest', 'refine_crest', 'plant_dressed', 'test_brace'];
const plot = {id: keeperPropagationPit, fertile: true};
const dressedPlot = {...plot, developmentMinutes: 5};
const phases = ['unsorted', 'viable', 'refined', 'planted'];
const empty = () => ({nextBatch: 1, fruits: [], sorted: null, last: null, cleared: false});
const loaned = state => state.actors.player.facts[`${keeperPropagation}.loaned`] === true;
const pin = record => record?.extensions?.some(row => row.id === keeperPropagation);
const trialPin = record => record?.extensions?.some(row => row.id === keeperPotatoTrial);
const crestLoaned = state => state.actors.player.facts[`${keeperPotatoTrial}.loaned`] === true;
const fedThrough = state => state.worlds[keeperPropagationWorld]?.facts?.[fedKey];
const playerFruit = (fruit, phase) => fruit.holder === 'player' && fruit.phase === phase;
const carried = row => row.fruits.filter(fruit => playerFruit(fruit, 'viable') || playerFruit(fruit, 'refined')).length;
const forceFromProducer = id => id === crest ? 2 : id === producer ? 1 : null;

function read(state) {
    const raw = state.worlds[keeperPropagationWorld]?.facts?.[recordKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 65536) throw Error('Invalid Thunder Potato plot record.');
    const row = JSON.parse(raw);
    const ids = new Set();
    if (!Number.isSafeInteger(row.nextBatch) || row.nextBatch < 2 || !Array.isArray(row.fruits) ||
        row.fruits.some(fruit => {
            if (ids.has(fruit.id)) return true;
            ids.add(fruit.id);
            return !Number.isSafeInteger(fruit.batch) || fruit.batch < 1 || fruit.batch >= row.nextBatch ||
                !new RegExp(`^gu-fruit:${fruit.batch}:[1-${rule.batchSize}]$`).test(fruit.id) ||
                fruit.kind !== rule.id || fruit.rank !== rule.productRank ||
                !(fruit.producer === producer && fruit.force === undefined || fruit.producer === crest && fruit.force === 2) ||
                (fruit.holder !== 'player' && (fruit.holder !== potatoBuyer || !['viable', 'planted'].includes(fruit.phase))) ||
                fruit.operator !== 'player' || typeof fruit.sound !== 'boolean' ||
                !phases.includes(fruit.phase) || (!fruit.sound && fruit.phase !== 'unsorted') ||
                (fruit.phase === 'planted' && (fruit.plot !== (fruit.holder === 'player' ? plot.id : potatoBuyerPlot.id) ||
                    !['shallow', 'deep'].includes(fruit.depth) || !Number.isSafeInteger(fruit.readyAt) ||
                    fruit.readyAt < dressedPlot.developmentMinutes || fruit.readyAt > state.clock + rule.developmentMinutes));
        }) || row.fruits.filter(fruit => playerFruit(fruit, 'planted')).length > 1 ||
        typeof row.cleared !== 'boolean' || ![null, 'quiet', 'blast'].includes(row.last) ||
        (row.last === 'blast' && !row.cleared) || ![undefined, 'held', 'opened'].includes(row.brace) || (row.sorted !== null &&
            (!Number.isSafeInteger(row.sorted) || row.sorted < 0 || row.sorted > rule.batchSize))) {
        throw Error('The Thunder Potato batch and planted Gu disagree.');
    }
    return row;
}

export function validateKeeperPropagation(state, record, inventory) {
    validateKeeperVitality(state, record, inventory);
    const row = read(state);
    validateKeeperDrain(state, record, row);
    validatePotatoMarket(state, record, row, forceFromProducer);
    const wake = state.worlds[keeperPropagationWorld]?.facts?.[wakeKey];
    if (wake !== drainWake(row)) {
        throw Error('The rolling log needs its scheduled arrival.');
    }
    const completed = state.actors.player.completed;
    const trialMade = completed[`${keeperPotatoTrial}.produce_crest`] ?? 0;
    const made = (completed[`${keeperPropagation}.produce`] ?? 0) + trialMade;
    const fed = fedThrough(state);
    const item = inventory?.[keeperPotatoFruit];
    if (!!row !== (made > 0) || (row && (!pin(record) || made !== row.nextBatch - 1)) ||
        (item?.count ?? item ?? 0) !== (row ? carried(row) : 0) ||
        (!!completed[`${keeperPotatoTrial}.feed_crest`] !== (fed !== undefined)) ||
        (fed !== undefined && (!trialPin(record) || !Number.isSafeInteger(fed) || fed < 45 || fed > state.clock + 45)) ||
        ((crestLoaned(state) || trialMade || row?.brace !== undefined) && !trialPin(record)) ||
        (row?.brace !== undefined && !completed[`${keeperPotatoTrial}.test_brace`])) {
        throw Error('The Thunder Potato fruit, production and carried stock disagree.');
    }
}

function readiness(row, clock) {
    const planted = row.fruits.find(fruit => playerFruit(fruit, 'planted'));
    const unsorted = row.fruits.some(fruit => fruit.phase === 'unsorted');
    const canPlant = !planted && row.fruits.some(fruit => playerFruit(fruit, 'refined'));
    return {produce: !unsorted, sort: unsorted, refine: row.fruits.some(fruit => playerFruit(fruit, 'viable')),
        plant_shallow: canPlant, plant_deep: canPlant, tap: !!planted,
        strike: !!planted && planted.readyAt <= clock};
}

export function keeperPropagationFacts(state, actor, context) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperPropagationWorld) return {};
    const row = read(state) ?? empty();
    const flags = readiness(row, state.clock);
    const fed = (fedThrough(state) ?? -1) >= state.clock;
    const market = potatoMarketPin(context.structuredNative) ? potatoMarketOptions(state, row) : {};
    const drain = drainPin(context.structuredNative) ? drainOptions(state, row.nextBatch > 1 ? row : null) : {};
    return {...keeperVitalityFacts(state, context), [`${keeperPropagation}.loaned`]: loaned(state), [`${keeperPropagation}.cleared`]: row.cleared,
        [`${keeperPotatoTrial}.loaned`]: crestLoaned(state), [`${keeperPotatoTrial}.fed`]: fed,
        [`${keeperPotatoTrial}.can_feed_crest`]: crestLoaned(state),
        [`${keeperPotatoTrial}.can_produce_crest`]: flags.produce && crestLoaned(state) && fed,
        [`${keeperPotatoTrial}.can_refine_crest`]: row.fruits.some(fruit => playerFruit(fruit, 'viable') && fruit.producer === crest),
        [`${keeperPotatoTrial}.can_plant_dressed`]: flags.plant_deep,
        [`${keeperPotatoTrial}.can_test_brace`]: flags.strike && row.brace !== 'opened',
        [`${keeperPotatoTrial}.opened`]: row.brace === 'opened',
        [`${keeperPotatoTrial}.can_recover`]: row.brace === 'opened' && !state.actors.player.completed[`${keeperPotatoTrial}.recover_cache`],
        ...Object.fromEntries(Object.entries(flags).map(([key, value]) => [`${keeperPropagation}.can_${key}`, value])),
        ...Object.fromEntries(Object.entries(market).map(([key, value]) => [`${keeperPotatoMarket}.can_${key}`, value])),
        ...Object.fromEntries(Object.entries(drain).filter(([op]) => !wearOperations.includes(op) || drainWearPin(context.structuredNative))
            .map(([op, value]) => [`${wearOperations.includes(op) ? keeperDrainWear : keeperDrain}.can_${op}`, value]))};
}

export function keeperPropagationView(state, record) {
    if (!pin(record)) return null;
    const row = read(state);
    if (!row && !trialPin(record)) return null;
    const bed = row ?? empty();
    const planted = bed.fruits.find(fruit => playerFruit(fruit, 'planted'));
    const nextFruit = bed.fruits.find(fruit => playerFruit(fruit, 'refined')) ?? bed.fruits.find(fruit => playerFruit(fruit, 'viable'));
    return {unsorted: bed.fruits.filter(fruit => fruit.phase === 'unsorted').length, sorted: bed.sorted,
        carried: carried(bed), last: bed.last, planted: planted && {depth: planted.depth,
            remaining: Math.max(0, planted.readyAt - state.clock)},
        ...(trialPin(record) ? {trial: {brace: bed.brace, fed: (fedThrough(state) ?? -1) >= state.clock,
            loaned: crestLoaned(state), nextForce: nextFruit && (nextFruit.force ?? 1),
            plantedForce: planted && (planted.force ?? 1)}} : {}),
        ...(potatoMarketPin(record) ? {market: potatoMarketView(bed, state.clock)} : {}),
        ...(drainPin(record) ? {rig: bed.rig, millRuns: state.actors.player.completed[`${keeperDrain}.mill`] ?? 0} : {})};
}

export function isKeeperPropagationEffect(effect) {
    return effect.type === 'guPropagate' && effect.actor === 'player' && keeperPropagationEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

export function keeperPropagationEffectPack(operation) {
    if (operations.includes(operation)) return keeperPropagation;
    if (trialOperations.includes(operation)) return keeperPotatoTrial;
    if (potatoMarketOperations.includes(operation)) return keeperPotatoMarket;
    if (drainOperations.includes(operation)) return keeperDrain;
    if (wearOperations.includes(operation)) return keeperDrainWear;
    return vitalityOperations.includes(operation) ? keeperVitality : null;
}

export function applyKeeperPropagationEffect(state, effect, context, registry) {
    const {operation} = effect;
    if (isKeeperPropagationEffect(effect) && keeperPropagationEffectPack(operation) === keeperVitality) {
        return applyKeeperVitalityEffect(state, effect, context);
    }
    const market = potatoMarketOperations.includes(operation);
    const wear = wearOperations.includes(operation);
    const drain = wear || drainOperations.includes(operation);
    const atAnnex = drain || market || ['produce', 'sort', 'refine', 'feed_crest', 'produce_crest', 'refine_crest'].includes(operation);
    const trial = trialOperations.includes(operation);
    if (!isKeeperPropagationEffect(effect) || context.actorId !== 'player' || !pin(context.structuredNative) ||
        (trial && !trialPin(context.structuredNative)) ||
        (market && !potatoMarketPin(context.structuredNative)) ||
        (drain && !drainPin(context.structuredNative)) ||
        (wear && !drainWearPin(context.structuredNative)) ||
        state.actors.player?.worldId !== keeperPropagationWorld ||
        state.simulation.people.player.location !== (atAnnex ? annex : keeperPropagationPit)) {
        throw Error('Work with the Thunder Potato Gu at its workbench or pit.');
    }
    const clock = state.clock;
    if (drain) {
        const next = applyDrainOperation(state, read(state), operation, registry);
        writeDrain(state, next);
        return null;
    }
    if (operation === 'feed_crest') {
        if (!crestLoaned(state)) throw Error('Borrow the crested Mother Gu first.');
        state.worlds[keeperPropagationWorld].facts[fedKey] = clock + 45;
        return null;
    }
    let row = read(state) ?? empty();
    if (market) {
        state.worlds[keeperPropagationWorld].facts[recordKey] = JSON.stringify(settlePotatoMarket(state, row, operation));
        return null;
    }
    const readinessKey = {produce_crest: 'produce', refine_crest: 'refine', plant_dressed: 'plant_deep', test_brace: 'strike'}[operation] ?? operation;
    if (!readiness(row, clock)[readinessKey] || (operation === 'test_brace' && row.brace === 'opened')) {
        throw Error('The fruit or plot is no longer ready.');
    }
    let grant = 0;
    if (readinessKey === 'produce') {
        const crested = operation === 'produce_crest';
        if (crested ? !crestLoaned(state) || (fedThrough(state) ?? -1) < clock : !loaned(state)) {
            throw Error('Borrow a ready Mother Gu first.');
        }
        const result = produceGuFruit(row, {rule, producer: {id: crested ? crest : producer,
            kind: rule.producer, rank: rule.producerRank, holder: 'player', fedThrough: crested ? fedThrough(state) : clock,
            ...(crested ? {offspringForce: 2} : {})}, operator: 'player', supply: {pool: 'white-silver', family: 'primeval',
            rank: 3, source: 'stored'}, reserves: {player: {'white-silver': rule.productionCost}},
            clock, seed: state.simulation.seed});
        if (result.result.outcome !== 'complete') throw Error('The Mother Gu produced no batch.');
        row = result.state;
    } else if (operation === 'sort') {
        const before = carried(row);
        row = sortGuFruit(row, row.nextBatch - 1, 'player');
        grant = carried(row) - before;
        row = {...row, sorted: grant, fruits: row.fruits.filter(fruit => fruit.phase !== 'discarded')};
    } else if (readinessKey === 'refine') {
        const fruit = row.fruits.find(fruit => playerFruit(fruit, 'viable') && (operation !== 'refine_crest' || fruit.producer === crest));
        if (!fruit) throw Error('Choose a viable crested fruit.');
        row = refineGuFruit(row, fruit.id, 'player');
    } else if (operation === 'plant_shallow' || readinessKey === 'plant_deep') {
        const fruit = row.fruits.find(fruit => playerFruit(fruit, 'refined'));
        row = plantGuFruit(row, {rule, id: fruit.id, operator: 'player', plot: operation === 'plant_dressed' ? dressedPlot : plot, clock,
            depth: readinessKey === 'plant_deep' ? 'deep' : 'shallow',
            reserves: {player: {primeval: rule.plantingCost}}}).state;
        row.last = null;
    } else {
        const result = disturbGuPlot(row, {plot: plot.id, clock, vibration: operation === 'tap' ? 1 : 2});
        if (operation === 'test_brace') {
            const fruit = row.fruits.find(candidate => candidate.id === result.spent);
            if (!fruit) throw Error('The fruit did not detonate.');
            row = {...result.state, last: null, brace: (fruit.force ?? 1) >= 2 ? 'opened' : 'held'};
        } else {
            row = {...result.state, last: result.spent ? 'blast' : 'quiet', cleared: row.cleared || !!result.spent};
        }
        if (result.spent) row.fruits = row.fruits.filter(fruit => fruit.phase !== 'spent');
    }
    state.worlds[keeperPropagationWorld].facts[recordKey] = JSON.stringify(row);
    return grant ? {key: keeperPotatoFruit, count: grant} : null;
}

export function nextKeeperDrainBoundary(state) {
    return state.worlds[keeperPropagationWorld]?.facts?.[wakeKey] ?? Infinity;
}

function writeDrain(state, row) {
    const facts = state.worlds[keeperPropagationWorld].facts;
    facts[recordKey] = JSON.stringify(row);
    const wake = drainWake(row);
    if (wake === undefined) delete facts[wakeKey];
    else facts[wakeKey] = wake;
}

export function advanceKeeperDrain(state) {
    if (nextKeeperDrainBoundary(state) > state.clock) return 0;
    const next = settleDrainArrival(read(state), state.clock);
    if (!next) throw Error('The scheduled log did not arrive.');
    writeDrain(state, next);
    return 1;
}
