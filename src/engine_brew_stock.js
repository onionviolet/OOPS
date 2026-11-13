// The engine owns physical stock. b.brew owns the staged batch and its receipts.
import {check} from './basics.js';
import {address, hash64} from './gen_kit.js';
import {quantityDef, resolveRef} from './world_substrate.js';

const dosePrefix = 'stock:brew-dose.';
const filmPrefix = 'stock:brew-film.';
const measure = 'stock:brew-measure';
const encoded = 'encoded.';
const fractionState = 'b.brew_fraction';
const storageState = 'b.brew_storage';
const lotStorageState = 'b.brew_lot_storage';
const originsState = 'b.brew_origins';

export const clearBrewFraction = holder => ({op: 'state', holder, pack: fractionState, value: null});
export const brewFractionOf = holder => holder?.state[fractionState];
export const setBrewFraction = (holder, value) => ({op: 'state', holder, pack: fractionState, value});
export const clearBrewStorage = holder => ({op: 'state', holder, pack: storageState, value: null});
export const brewStorageOf = holder => holder?.state[storageState];
export const setBrewStorage = (holder, value) => ({op: 'state', holder, pack: storageState, value});
export const brewLotStorageOf = holder => {
    const storage = holder?.state[lotStorageState];
    return storage && storage.compositionRevision === (holder.properties[brewLotRevision] ?? null) ? storage : undefined;
};
export const setBrewLotStorage = (holder, value) => ({op: 'state', holder, pack: lotStorageState, value});
export const clearBrewOrigins = holder => ({op: 'state', holder, pack: originsState, value: null});
export const setBrewOrigins = (holder, value) => ({op: 'state', holder, pack: originsState, value});
export const brewOriginsOf = holder => holder?.state[originsState];

function partKey(part) {
    if (/^[a-z0-9][a-z0-9_.-]*$/i.test(part) && !part.startsWith(encoded)) return part;
    return encoded + part.split('').map(char => char.charCodeAt(0).toString(16).padStart(4, '0')).join('');
}

function partName(key) {
    if (!key.startsWith(encoded)) return key;
    return key.slice(encoded.length).replace(/[0-9a-f]{4}/g, hex => String.fromCharCode(parseInt(hex, 16)));
}

const parts = (holder, prefix) => Object.entries(holder.quantities)
    .filter(([key, amount]) => key.startsWith(prefix) && amount > 0)
    .map(([key, amount]) => ({id: partName(key.slice(prefix.length)), amount}));

export const brewMeasureQuantity = measure;
// Composition-changing hosts stamp a new, unique label on the held lot
// when replacing its chemistry. Stock debits and ageing use separate data.
export const brewLotRevision = 'brew-lot-revision';
export const brewFilmQuantity = part => filmPrefix + partKey(part);
export const brewDoseQuantity = part => dosePrefix + partKey(part);
export const brewDoseContents = holder => Object.fromEntries(parts(holder, dosePrefix).map(({id, amount}) => [id, amount]));

// A custody check for saved assays, not a source of constituent estimates.
export function brewFlaskStamp(contents, fraction, origins, storage) {
    const {lo, hi} = hash64('brew-flask', address(contents, fraction ?? null, origins ?? null, storage ?? null));
    return hi.toString(16).padStart(8, '0') + lo.toString(16).padStart(8, '0');
}

// Apportion whole units of a homogeneous serving by largest remainder. Ties
// use constituent IDs, so a restored object order cannot change the dose.
export function measuredBrewShare(contents, amount, total) {
    if (amount === total) return contents;
    const rows = Object.entries(contents).map(([part, held]) => {
        const scaled = BigInt(held) * BigInt(amount);
        return {part, units: Number(scaled / BigInt(total)), remainder: scaled % BigInt(total)};
    }).sort((a, b) => a.remainder === b.remainder ? (a.part < b.part ? -1 : 1) : a.remainder > b.remainder ? -1 : 1);
    const spare = amount - rows.reduce((sum, row) => sum + row.units, 0);
    return Object.fromEntries(rows.map(({part, units}, i) => [part, units + Number(i < spare)]).filter(([, units]) => units > 0));
}

export function readBrewHolder(thing, holder) {
    if (!['lot', 'vessel', 'flask'].includes(thing.kind)) return thing;
    if (!thing.holder) return null;
    if (thing.kind === 'vessel') return {...thing, films: parts(thing, filmPrefix)};
    if (thing.kind === 'flask') {
        const brewContents = brewDoseContents(thing);
        const fraction = holder?.state[fractionState];
        const origins = brewOriginsOf(holder);
        return {...thing, brewContents, brewEmpty: !Object.keys(brewContents).length && !fraction?.volume,
            ...(fraction ? {brewFraction: fraction} : {}), ...(origins ? {brewOrigins: origins} : {})};
    }
    if (!Object.hasOwn(thing.quantities, measure) || typeof thing.material !== 'string') return null;
    return {...thing, amount: thing.quantities[measure], compositionRevision: holder?.properties[brewLotRevision] ?? null,
        properties: thing.properties.constituents ?? {}, lotStorage: brewLotStorageOf(holder)};
}

const change = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});

function deposit(rules, holder, contents, quantityOf) {
    return Object.entries(contents).flatMap(([part, amount]) => {
        const quantity = quantityOf(part);
        const current = holder.quantities[quantity];
        const def = quantityDef(rules, quantity);
        check(def && amount <= def.max - (current ?? 0), `Brew stock exceeds the account for ${part}.`);
        return [...(current === undefined ? [{op: 'carry', holder: holder.id, quantity}] : []),
            change(holder.id, quantity, amount)];
    });
}

export function brewStockOps(rules, world, effect) {
    if (effect.op === 'dissolve-brew-stock') {
        const holder = world.holders[effect.holder];
        return [
            ...brewStockOps(rules, world, {op: 'debit', holder: effect.lot, amount: effect.amount}),
            ...deposit(rules, holder, effect.added, brewDoseQuantity),
            ...(effect.fraction ? [setBrewFraction(holder.id, effect.fraction)] : []),
            ...(effect.storage ? [setBrewStorage(holder.id, effect.storage)] : []),
            setBrewOrigins(holder.id, Object.keys(effect.origins).length ? effect.origins : null),
        ];
    }
    if (effect.op === 'decant-brew') {
        const source = world.holders[effect.holder], receiver = world.holders[effect.receiver];
        const {stock, contents, partial, fraction, remainder} = effect;
        const storage = brewStorageOf(source);
        const origins = brewOriginsOf(source);
        const live = brewDoseContents(source);
        check(Object.keys(live).length === Object.keys(stock).length &&
            Object.entries(stock).every(([part, units]) => live[part] === units), 'Decant source changed before transfer.');
        check(!Object.keys(brewDoseContents(receiver)).length && !receiver.state[fractionState]?.volume,
            'Decant receiver changed before transfer.');
        const selectOrigins = keep => origins && Object.fromEntries(Object.entries(origins).filter(([part]) => keep(part)));
        const debits = partial ? [
            ...Object.entries(contents).map(([part, units]) => change(source.id, brewDoseQuantity(part), -units)),
            ...(remainder ? [setBrewFraction(source.id, remainder)] : []),
            ...(origins ? [setBrewOrigins(source.id, selectOrigins(part => stock[part] > (contents[part] ?? 0)))] : []),
        ] : brewStockOps(rules, world, {...effect, op: 'debit-brew-fraction'});
        return [
            ...debits,
            ...deposit(rules, receiver, contents, brewDoseQuantity),
            setBrewFraction(receiver.id, (partial ? fraction : source.state[fractionState]) ?? null),
            setBrewStorage(receiver.id, storage ?? null),
            setBrewOrigins(receiver.id, selectOrigins(part => Object.hasOwn(contents, part)) ?? null),
        ];
    }
    if (effect.op === 'debit-brew-fraction') {
        const holder = world.holders[effect.holder];
        const debits = Object.entries(effect.contents).map(([part, amount]) => {
            const quantity = brewDoseQuantity(part);
            const held = holder?.quantities[quantity];
            check(effect.partial ? held >= amount : held === amount, 'Brew fraction changed before debit.');
            return change(holder.id, quantity, -amount);
        });
        if (effect.partial) {
            check(Boolean(brewFractionOf(holder)) === Boolean(effect.remainder), 'A partial phase admission needs a remainder packet.');
            const origins = brewOriginsOf(holder);
            return [...debits, ...(effect.remainder ? [setBrewFraction(holder.id, effect.remainder)] : []),
                ...(origins ? [setBrewOrigins(holder.id, Object.fromEntries(Object.entries(origins)
                    .filter(([part]) => holder.quantities[brewDoseQuantity(part)] > (effect.contents[part] ?? 0))))] : [])];
        }
        return [...debits,
            ...(holder.state[fractionState] ? [clearBrewFraction(holder.id)] : []),
            ...(holder.state[originsState] ? [clearBrewOrigins(holder.id)] : []),
            ...(brewStorageOf(holder) ? [clearBrewStorage(holder.id)] : [])];
    }
    if (effect.op === 'debit') {
        const id = resolveRef(world, {kind: 'lot', id: effect.holder});
        check(id && world.holders[id].quantities[measure] >= effect.amount, 'Brew stock changed before debit.');
        return [change(id, measure, -effect.amount)];
    }
    if (effect.op === 'clear-films') {
        const id = resolveRef(world, {kind: 'vessel', id: effect.holder});
        const film = parts(world.holders[id], filmPrefix);
        check(film.reduce((sum, part) => sum + part.amount, 0) === effect.amount, 'Brew lining changed before transfer.');
        return film.map(part => change(id, brewFilmQuantity(part.id), -part.amount));
    }
    if (effect.op === 'pour-brew') return [
        ...deposit(rules, world.holders[effect.holder], effect.contents, brewDoseQuantity),
        ...deposit(rules, world.holders[effect.vessel], effect.film, brewFilmQuantity),
        ...(effect.fraction ? [setBrewFraction(effect.holder, effect.fraction)]
            : world.holders[effect.holder].state[fractionState] ? [clearBrewFraction(effect.holder)] : []),
        ...(effect.storage ? [setBrewStorage(effect.holder, effect.storage)]
            : brewStorageOf(world.holders[effect.holder]) ? [clearBrewStorage(effect.holder)] : []),
        ...(effect.origins ? [setBrewOrigins(effect.holder, effect.origins)]
            : world.holders[effect.holder].state[originsState] ? [clearBrewOrigins(effect.holder)] : []),
    ];
    return [effect];
}
