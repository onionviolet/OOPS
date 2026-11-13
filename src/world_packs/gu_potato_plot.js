// PC95. The propagation law owns fruit stages. The world owns paid essence,
// the planted body, and the stone obstruction that its blast can clear.
import {defineWorkingLaw} from '../kernel_working.js';
import {stableId} from '../simulation_ids.js';
import {disturbGuPlot, dressGuFruitSoil, observeGuFruit, plantGuFruit, produceGuFruit, refineGuFruit, sortGuFruit, transferGuFruit, transferGuFruitBatch,
    thunderPotatoPropagation as rule} from '../gu_propagation.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {clearGuRubble, GU_RUBBLE as rubble, GU_RUBBLE_EXIT} from '../gu_rubble.js';

const pack = 'g.potato-plot';
const growth = 'gu.potato.cultivate';
const resolved = 'gu.potato.resolved';
const silver = 'energy:primeval.rank3';
const copper = 'energy:primeval.rank1';
const stones = 'stock:primeval_stone';
const petals = 'stock:moon-orchid-petals';
const blastForce = 'gu_potato_force';
const forceSpread = 'gu_potato_force_spread';
const trigger = 'gu_potato_trigger';
const triggerSpread = 'gu_potato_trigger_spread';
const development = 'gu_potato_development';
const actions = ['produce', 'sort', 'plant', 'dress', 'disturb'];
const plotRoles = {operator: 'operator', plot: 'place'};
const roles = {...plotRoles, mother: 'gu'};
const tradeRoles = {...plotRoles, buyer: 'operator'};
const fruitStore = mother => mother + '.potato-fruit';
const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const local = (view, id, place) => view.placeOf(id) === place;
const available = (view, id, quantity) => view.has(id, quantity) ? view.amount(id, quantity) : 0;

function operation(needs, production) {
    return {roles: needs, minutes: 1, settle({bound: {operator, mother, plot}, options}) {
        const producer = mother?.holder ?? options.producer;
        if (!actions.includes(options.action) || (production !== null && production !== (options.action === 'produce')) || !stableId(producer) ||
            operator.place !== plot.holder || operator.properties.alive !== true) {
            return {ok: false, reason: 'Cultivation needs a living operator at the plot.'};
        }
        return {ok: true, effects: [{op: 'publish', kind: growth, place: plot.holder, by: operator.holder,
            detail: {...options, mother: producer}}]};
    }};
}

export const GU_POTATO_PLOT_LAW = defineWorkingLaw({id: pack, revision: 2, operations: {
    produce: operation(roles, true),
    cultivate: operation(plotRoles, false),
    trade: {roles: tradeRoles, minutes: 1, settle({bound: {operator, buyer, plot}, options: {producer, fruit, price}}) {
        if (!stableId(producer) || !stableId(fruit) || !Number.isSafeInteger(price) || price < 1 ||
            operator.holder === buyer.holder || operator.place !== plot.holder || buyer.place !== plot.holder ||
            operator.properties.alive !== true || buyer.properties.alive !== true) {
            return {ok: false, reason: 'Trade needs two living growers at the plot and agreed terms.'};
        }
        return {ok: true, effects: [{op: 'publish', kind: growth, place: plot.holder, by: operator.holder,
            detail: {action: 'trade', mother: producer, fruit, buyer: buyer.holder, price}}]};
    }},
}});

// The headless host can restore workings queued before the store was split out.
export const GU_POTATO_PLOT_LEGACY_LAW = defineWorkingLaw({id: pack, revision: 1, operations: {
    cultivate: operation(roles, null),
}});

export function potatoPlotWorking(options) {
    const op = ['produce', 'trade'].includes(options.action) ? options.action : 'cultivate';
    const needs = op === 'produce' ? roles : op === 'trade' ? tradeRoles : plotRoles;
    return {id: 'gu.potato.' + options.action, revision: 2, law: GU_POTATO_PLOT_LAW.ref, roles: needs,
        steps: [{op,
            bindings: Object.fromEntries(Object.keys(needs).map(role => [role, role])), options}]};
}

function cultivate(view, plot, event) {
    const {action, mother, fruit: fruitId, batch, depth, vibration, buyer, price} = event.detail;
    const operator = event.by;
    const owner = view.property(mother, 'gu_keeper');
    const storage = fruitStore(mother);
    const saved = view.state(storage);
    const legacy = view.state(mother);
    const state = saved ?? legacy ?? {nextBatch: 1, fruits: []};
    const report = (result, detail = {}) => ({op: 'publish', kind: resolved, place: plot, by: operator,
        detail: {action, result, ...detail}});
    const save = next => saved ? [{op: 'state', holder: storage, value: next}] : [
        {op: 'lifecycle', act: 'create', parents: [mother], value: {id: storage, kind: 'thing', place: plot, state: {[pack]: next}}},
        ...(legacy ? [{op: 'state', holder: mother, value: null}] : []),
    ];
    if (!local(view, operator, plot) || view.property(operator, 'alive') !== true) return [];
    if (!saved && (view.holder(storage) || view.lineage(storage).length)) return [report('fruit-storage-unavailable')];

    if (action === 'produce') {
        if (!owner || !local(view, mother, plot) || view.property(mother, 'gu_controller') !== operator) return [report('no-control')];
        const producer = {id: mother, kind: view.property(mother, 'gu_kind'), rank: view.property(mother, 'gu_rank'),
            holder: operator, alive: view.property(mother, 'alive') === true, injured: view.property(mother, 'injured'),
            offspringForce: view.property(mother, blastForce) ?? undefined,
            offspringForceSpread: view.property(mother, forceSpread) ?? undefined,
            offspringTrigger: view.property(mother, trigger) ?? undefined,
            offspringTriggerSpread: view.property(mother, triggerSpread) ?? undefined,
            fedThrough: available(view, mother, 'satiety') > 0 ? view.clock : view.clock - 1};
        const reserve = available(view, operator, silver);
        const result = produceGuFruit(state, {rule, producer, operator,
            supply: {pool: 'primeval', family: 'primeval', rank: 3, source: 'stored'},
            reserves: {[operator]: {primeval: reserve}}, clock: view.clock, seed: view.draw(['potato', mother])});
        if (result.result.outcome !== 'complete') return [report(result.result.reason)];
        const next = owner === operator ? result.state : transferGuFruitBatch(result.state, state.nextBatch, operator, owner);
        return [add(operator, silver, result.reserves[operator].primeval - reserve), ...save(next), report('produced', {batch: state.nextBatch})];
    }
    if (!saved && !legacy) return [report('fruit-storage-unavailable')];
    if (action === 'sort') return [...save(sortGuFruit(state, batch, operator)), report('sorted', {batch})];
    if (action === 'trade') {
        if (!local(view, buyer, plot) || view.property(buyer, 'alive') !== true ||
            !Number.isSafeInteger(price) || price < 1 || available(view, buyer, stones) < price ||
            !view.has(operator, stones) || price > WORLD_QUANTITIES.stock.max - view.amount(operator, stones)) {
            return [report('trade-unfunded', {fruit: fruitId, buyer})];
        }
        const next = transferGuFruit(state, fruitId, operator, buyer);
        return [add(buyer, stones, -price), add(operator, stones, price), ...save(next),
            report('traded', {fruit: fruitId, buyer, price})];
    }
    if (action === 'plant') {
        const id = `${mother}.${fruitId}`;
        if (view.holder(id) || view.lineage(id).length) return [report('fruit-already-planted')];
        if (view.present(plot).some(holder => view.property(holder, 'gu_kind') === rule.id &&
            view.property(holder, 'alive') === true)) return [report('plot-occupied')];
        const reserve = available(view, operator, copper);
        const refined = refineGuFruit(state, fruitId, operator);
        const next = plantGuFruit(refined, {rule, id: fruitId, operator, depth, clock: view.clock,
            plot: {id: plot, fertile: view.property(plot, 'gu_fertile') === true,
                developmentMinutes: view.property(plot, development)}, reserves: {[operator]: {primeval: reserve}}});
        const force = next.state.fruits.find(fruit => fruit.id === fruitId).force;
        return [add(operator, copper, next.reserves[operator].primeval - reserve), ...save(next.state),
            {op: 'lifecycle', act: 'create', parents: [storage], note: 'Producer: ' + mother, value: {id, kind: 'body', as: ['gu'], place: plot,
                properties: {alive: true, gu_kind: rule.id, gu_rank: rule.productRank, gu_keeper: operator, gu_controller: operator,
                    ...(force !== undefined && {[blastForce]: force})}}},
            report('planted', {id})];
    }
    if (action === 'dress') {
        const id = `${mother}.${fruitId}`;
        if (!local(view, id, plot) || view.property(id, 'alive') !== true) return [report('specimen-unavailable')];
        if (view.property(plot, 'gu_fertile') !== true || available(view, operator, petals) < 1) return [report('soil-dressing-unavailable')];
        const next = dressGuFruitSoil(state, {id: fruitId, operator, plot, clock: view.clock});
        const {readyAt} = next.fruits.find(fruit => fruit.id === fruitId);
        return [add(operator, petals, -1), ...save(next), report('dressed', {id, readyAt})];
    }
    if (action !== 'disturb' || !Number.isSafeInteger(vibration) || vibration < 0) return [];
    const result = disturbGuPlot(state, {plot, clock: view.clock, vibration});
    if (!result.spent) return [report('quiet')];
    const id = `${mother}.${result.spent}`;
    if (!local(view, id, plot) || view.property(id, 'alive') !== true) return [report('specimen-unavailable')];
    const obstruction = available(view, plot, rubble);
    const force = view.property(id, blastForce) ?? 1;
    const {cleared, effects} = clearGuRubble({place: plot, amount: obstruction, force,
        exitId: view.property(plot, GU_RUBBLE_EXIT), links: view.links()});
    return [...save(result.state), {op: 'lifecycle', act: 'end', holder: id},
        ...effects, report('detonated', {id, force, cleared})];
}

export const guPotatoPlotPack = {
    id: pack, revision: 1, properties: [{id: 'gu_fertile', type: 'flag'}, {id: GU_RUBBLE_EXIT, type: 'label'},
        {id: blastForce, type: 'level', min: 1}, {id: forceSpread, type: 'level', min: 0}, {id: development, type: 'level', min: 1},
        {id: trigger, type: 'level', min: 1}, {id: triggerSpread, type: 'level', min: 0}],
    reads: [silver, copper, rubble, stones, petals, 'satiety', 'alive', 'injured', 'gu_kind', 'gu_rank', 'gu_keeper', 'gu_controller',
        'gu_fertile', GU_RUBBLE_EXIT, blastForce, forceSpread, development, trigger, triggerSpread],
    writes: [silver, copper, rubble, stones, petals], lifecycle: {acts: ['create', 'end']},
    publishes: [growth, resolved], hears: [growth], reactors: [{
        id: 'cultivate', on: [growth], appliesTo: holder => holder.kind === 'place',
        react(view, id, event) {
            if (event.place !== id || !stableId(event.detail?.mother)) return [];
            try {
                return cultivate(view, id, event);
            } catch (error) {
                return [{op: 'publish', kind: resolved, place: id, by: event.by,
                    detail: {action: event.detail.action, result: 'refused', reason: error.message}}];
            }
        },
    }],
};

export const potatoFruit = (engine, mother) => observeGuFruit(engine.world.holders[fruitStore(mother)]?.state[pack] ??
    engine.world.holders[mother]?.state[pack] ?? {fruits: []});
