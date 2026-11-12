// Fabrication law (foundation F, docs/gm/dispatch/foundation-f-2026-11-12).
// Domain-free and world-free: every id, unit and number comes from a pack
// row (PFP1, PFP3). It covers the grammar FBG1-FBG8 with rules FBC1-FBC8:
// partition processes that conserve a world's unit, joins that fit before
// they carry, load paths whose first limiting element fails, wear on the
// element that carried the demand, salvage as a partition, and making from a
// practiced working (SC8). Operations also run as one K working law
// (docs/KERNEL_WORKING_CONTRACT.md) so a making quotes and settles like any
// other working. Nothing here writes inventory, clocks or saves (AR3).
import {check, natural, object, positive} from './basics.js';
import {defineWorkingLaw} from './kernel_working.js';
import {planMaterialPartition} from './material_lineage.js';

const freezeDeep = value => {
    if (value && typeof value === 'object') { Object.values(value).forEach(freezeDeep); Object.freeze(value); }
    return value;
};
const idOf = key => JSON.parse(key).id;

// ---- Packs ---------------------------------------------------------------
// A pack is one world's fabrication rows: families (FBG2), partition
// processes (FBG3, FBG8), parts, joins and arrangements (FBG4-FBG6) and
// salvage rows. Packs are data; this module checks their shape once.
export function defineFabricationPack(pack) {
    check(object(pack) && typeof pack.id === 'string' && natural(pack.revision) && typeof pack.world === 'string',
        'A fabrication pack needs an id, a revision and a world.');
    const processes = pack.processes ?? [];
    for (const row of processes) {
        check(typeof row.id === 'string' && natural(row.revision) && typeof row.unit === 'string', 'A process needs an id, revision and unit.');
        check(object(row.yields) && Object.keys(row.yields).length > 0, `Process ${row.id} needs input to output yields.`);
        check(positive(row.unitsPerInput) && positive(row.product?.unitsPerItem), `Process ${row.id} needs measured units.`);
        check(['component', 'recipe', 'attempts'].includes(row.route), `Process ${row.id} needs a route.`);
    }
    const ids = new Set(processes.map(row => row.id));
    check(ids.size === processes.length, 'Process ids must be unique within a pack.');
    const joins = Object.fromEntries(Object.entries(pack.joins ?? {}).map(([id, join]) => [id, {id, ...join}]));
    return freezeDeep(structuredClone({families: {}, parts: {}, arrangements: {}, salvage: [], ...pack, joins, processes}));
}

const registry = new Map();
export function registerFabricationPack(pack) {
    const defined = pack.processes && Object.isFrozen(pack) ? pack : defineFabricationPack(pack);
    registry.set(defined.world, defined);
    return defined;
}
export const fabricationPack = world => registry.get(world) ?? null;
export const fabricationFamily = (world, id) => fabricationPack(world)?.families[id] ?? null;
export const knownFabricationFamily = id => {
    for (const pack of registry.values()) if (Object.hasOwn(pack.families, id)) return pack.families[id];
    return null;
};

// Which process makes `resultId` by `route` in this world, if any.
export function findProcess(world, route, resultId) {
    const pack = fabricationPack(world);
    if (!pack) return null;
    return pack.processes.find(row => row.route === route && Object.values(row.yields).includes(resultId)) ?? null;
}
// A process that makes resultId from an input of this id (grade lock).
export const processYield = (row, inputId) => Object.hasOwn(row.yields, inputId) ? row.yields[inputId] : null;

// ---- FBC1 and FBC8: partition processes -----------------------------------
// One row conserves a world's unit across product, remainders and loss.
// The loss is what the balance leaves, under the row's named reason.
// Parameters are named measures from the attempt (count, attempts, loss,
// batches) or constants, so the saved process history is data too.
function measures({count, attempts, batches, loss}) {
    return {count, attempts, batches, loss};
}
function parametersFor(row, values) {
    if (!row.parameters) return undefined;
    return Object.fromEntries(Object.entries(row.parameters).map(([name, source]) =>
        [name, typeof source === 'number' ? source : values[source]]));
}

export function planPartitionProcess(row, {resultId, allocations, stock, crafted, count, attempts, clock, world, families = {}}) {
    check(object(row), 'Choose a fabrication process.');
    const inputs = [], supportInputs = [];
    for (const allocation of allocations) {
        const made = processYield(row, idOf(allocation.item_key));
        if (made === resultId) inputs.push(allocation);
        else if (row.supports === 'consumed') supportInputs.push({...allocation, disposition: 'consumed'});
        else throw Error(row.mismatch || `${row.id} stock must share the selected grade.`);
    }
    check(inputs.length > 0, row.mismatch || `${row.id} needs its own input stock.`);
    const productRows = crafted
        ? Object.entries(crafted).map(([quality, n]) => ({quality: Number(quality), count: n}))
        : (count ? [{count}] : []);
    const made = productRows.reduce((sum, r) => sum + r.count, 0);
    const batches = made;
    attempts = attempts ?? made;
    if (row.route === 'attempts' && !(natural(count) && natural(attempts) && count <= attempts)) {
        throw Error(row.invalid || `Invalid ${row.id} yield.`);
    }
    const family = families[resultId] ?? row.product.family;
    const outputs = productRows.map(r => ({output: {id: resultId, family, ...(r.quality != null ? {quality: r.quality} : {}), count: r.count},
        unitsPerItem: row.product.unitsPerItem}));
    for (const rem of row.remainders ?? []) {
        const n = rem.per === 'attempts' ? attempts : batches;
        if (n > 0) outputs.push({output: {id: rem.id, family: rem.family, count: n}, unitsPerItem: rem.unitsPerItem});
    }
    // The loss is declared per batch or per failed attempt, or is whatever
    // the balance leaves. A declared loss that does not balance is refused by
    // the partition planner, so stale or overallocated stock cannot pass.
    const yieldCount = row.route === 'attempts' ? count : made;
    let loss = 0;
    if (row.loss?.per === 'batches') loss = row.loss.amount * batches;
    else if (row.loss?.per === 'failed') loss = row.loss.amount * (attempts - count);
    else if (row.loss?.per === 'balance') {
        const incoming = inputs.reduce((sum, r) => sum + r.count * row.unitsPerInput, 0);
        loss = incoming - outputs.reduce((sum, r) => sum + r.output.count * r.unitsPerItem, 0);
        check(loss >= 0, `${row.id} cannot make more than its inputs hold.`);
    }
    const parameters = parametersFor(row, measures({count: yieldCount, attempts, batches, loss}));
    const balanceStock = stock ?? Object.fromEntries(allocations.map(r => [r.item_key, r.count]));
    return planMaterialPartition({
        stock: balanceStock, inputs, ...(supportInputs.length ? {supportInputs} : {}),
        unit: row.unit, unitsPerInput: () => row.unitsPerInput, outputs,
        losses: loss > 0 ? [{reason: row.loss.reason, amount: loss}] : [],
        process: {id: row.id, revision: row.revision, at: clock, world_id: world, ...(parameters ? {parameters} : {})}
    });
}

// ---- FBC4 and FBC5: joins and load paths ----------------------------------
// A part offers interface tags; a join names the tags each side needs. A
// misfit stops before any capacity is read (FBC4).
export function fitJoin(join, parts) {
    for (const [side, needed] of Object.entries(join.needs)) {
        const part = parts[side];
        if (!part) return {ok: false, at: join.id, reason: `${join.id} is missing its ${side}.`};
        const offered = new Set(part.interfaces ?? []);
        const missing = needed.filter(tag => !offered.has(tag));
        if (missing.length) return {ok: false, at: join.id, reason: `${part.id} does not fit ${join.id} (${missing.join(', ')}).`};
    }
    return {ok: true};
}

// Share of a demand each path carries. A beam on two supports splits a load
// by moments (FG4-A); a direct path carries all of it. Shares are exact
// fractions {num, den} so limits stay whole-number arithmetic.
function pathShares(arrangement, demand) {
    if (arrangement.geometry === 'beam') {
        const {span} = arrangement;
        const x = demand.position;
        check(positive(span) && natural(x) && x <= span, 'The load must sit on the span.');
        return {left: {num: span - x, den: span}, right: {num: x, den: span}};
    }
    return Object.fromEntries(Object.keys(arrangement.paths).map(path => [path, {num: 1, den: 1}]));
}

// Every element on every path carries share times load. The first to reach
// its capacity, as load rises, is where the arrangement fails (FBC5). The
// capacity of a path is never the sum or the best of its elements (FBC3).
export function loadLimit(arrangement, elements, demand) {
    const shares = pathShares(arrangement, demand);
    let first = null;
    for (const [path, members] of Object.entries(arrangement.paths)) {
        const share = shares[path];
        if (!share.num) continue;
        for (const id of members) {
            const capacity = elements[id]?.capacity;
            check(Number.isFinite(capacity) && capacity > 0, `${id} needs a measured capacity.`);
            // total load at which this element reaches capacity: capacity / share
            const limit = {num: capacity * share.den, den: share.num};
            if (!first || limit.num * first.limit.den < first.limit.num * limit.den) first = {element: id, path, limit};
        }
    }
    return first && {...first, total: first.limit.num / first.limit.den};
}

export function carryLoad(arrangement, elements, demand) {
    const shares = pathShares(arrangement, demand);
    const carried = {};
    for (const [path, members] of Object.entries(arrangement.paths)) {
        const share = shares[path];
        for (const id of members) carried[id] = demand.load * share.num / share.den;
    }
    const failed = Object.entries(carried).filter(([id, amount]) => amount > elements[id].capacity)
        .sort(([a, x], [b, y]) => x / elements[a].capacity === y / elements[b].capacity ? a.localeCompare(b)
            : y / elements[b].capacity - x / elements[a].capacity);
    return {carried, ok: failed.length === 0, ...(failed.length ? {failedAt: failed[0][0]} : {})};
}

// ---- FBC6: wear lands on what carried the demand --------------------------
// Each element loses condition in proportion to the share of its capacity
// it carried, scaled by its own material wear scale.
export function wearFromUse(arrangement, elements, demand, {wearPerFullLoad}) {
    const {carried} = carryLoad(arrangement, elements, demand);
    return Object.fromEntries(Object.entries(carried).map(([id, amount]) =>
        [id, wearPerFullLoad * (amount / elements[id].capacity) * (elements[id].wearScale ?? 1)]));
}

// ---- FBC7: salvage partitions owned material --------------------------------
// A salvage row splits a worn piece's owned units by condition: reusable,
// scrap and cutting loss. Borrowed parts never enter the ledger.
export function planSalvage(row, {units, condition, owned = true}) {
    check(owned, 'Return borrowed parts to their owner; salvage only what is owned.');
    check(positive(units) && natural(condition) && condition <= 100, 'Salvage needs measured units and condition.');
    const loss = Math.ceil(units * row.cutLoss.num / row.cutLoss.den);
    const reusable = Math.min(units - loss, Math.floor(units * condition / 100));
    return {reusable, scrap: units - loss - reusable, loss};
}

// ---- SC8: making from a practiced working ----------------------------------
// A making may take a working as input (a practiced move refined into a
// thing). The row declares how practice is read, because worlds keep it
// differently: by default as the number of completed performances of the
// method (`{from: 'runs'}`, each a kernel working record), or as a fact a
// performance writes (`{from: 'fact', name}`). Dial: minPractice.
export function practicedWorkingFits(row, bound) {
    const records = (Array.isArray(bound) ? bound : [bound]).filter(object);
    const matching = records.filter(r => r.status === 'complete' && (!row.method || r.method?.id === row.method));
    if (!matching.length) return {ok: false, reason: row.method && records.some(r => r.method?.id !== row.method)
        ? `${row.id} needs ${row.method}.` : 'The method has not been carried through.'};
    const practice = row.practice ?? {from: 'runs'};
    const runs = practice.from === 'fact'
        ? Math.max(...matching.map(r => r.facts?.[practice.name] ?? 0))
        : matching.length;
    if (runs < (row.minPractice ?? 1)) return {ok: false, reason: `The method needs more practice (${runs} of ${row.minPractice}).`};
    return {ok: true, runs};
}

// ---- One K working law for fabrication ----------------------------------
// Operations read their pack row from step options so one law serves every
// world; numbers stay in the packs (KW1). Things are bound by reference and
// reread at each step (KW3); results are facts and effect intents (KW11).
export const FABRICATION_LAW = defineWorkingLaw({id: 'f.fabrication', revision: 1, operations: {
    partition: {roles: {stock: 'lot'}, settle({bound, options, at}) {
        const row = fabricationPack(options.world)?.processes.find(p => p.id === options.process);
        if (!row) return {ok: false, reason: 'This world has no such process.'};
        try {
            const plan = planPartitionProcess(row, {...options.request, allocations: bound.stock.allocations, clock: at,
                world: options.world, families: fabricationPack(options.world).families});
            return {ok: true, facts: {[`made.${options.process}`]: plan.outputs.map(r => r.item_key)},
                effects: [{kind: 'fabrication.partition', inputs: plan.inputs, outputs: plan.outputs, losses: plan.losses}],
                observed: {made: plan.outputs.length, lost: plan.balance.loss}};
        } catch (error) { return {ok: false, reason: error.message, observed: {stopped: options.process}}; }
    }},
    join: {roles: {a: 'part', b: 'part'}, settle({bound, options}) {
        const fit = fitJoin(options.join, {[options.sides[0]]: bound.a, [options.sides[1]]: bound.b});
        return fit.ok ? {ok: true, facts: {[`joined.${options.join.id}`]: true}, observed: {fits: true}}
            : {ok: false, reason: fit.reason, observed: {fits: false, at: fit.at}};
    }},
    load: {roles: {piece: 'assembly'}, settle({bound, options}) {
        const result = carryLoad(bound.piece.arrangement, bound.piece.elements, options.demand);
        return result.ok ? {ok: true, facts: {carried: result.carried}, observed: {held: true}}
            : {ok: false, reason: `${result.failedAt} gave way.`, observed: {held: false, at: result.failedAt}};
    }},
    refine: {roles: {method: 'working'}, settle({bound, options}) {
        const fit = practicedWorkingFits(options.row, bound.method.records ?? bound.method.record);
        return fit.ok ? {ok: true, facts: {[`refined.${options.row.id}`]: options.row.product},
            effects: [{kind: 'fabrication.refined', product: options.row.product, from: bound.method.id}],
            observed: {refined: options.row.product}}
            : {ok: false, reason: fit.reason, observed: {refined: null}};
    }}
}});
