import {validateItemKey} from "./gameplay_transactions.js";

const check = (ok, message) => {if(!ok) throw new Error(message);};
const object = value => value && typeof value === "object" && !Array.isArray(value);
export const readInventoryOwner = items => Object.fromEntries(Object.entries(items).map(([key, value]) => [key, value.count]));

// Inventories belong to owners. A trader or chest needs no invented skill actor.
export function validateOwnership(owners) {
    check(object(owners), "Invalid inventory owners.");
    for(const inventory of Object.values(owners)) {
        check(object(inventory), "Invalid owned inventory.");
        for(const [key, count] of Object.entries(inventory)) {
            validateItemKey(key);
            check(Number.isSafeInteger(count) && count > 0, "Invalid owned quantity.");
        }
    }
}

export function recordAcquisitions(itemLog, entries, getItem) {
    const next = structuredClone(itemLog);
    for(const {key, count} of entries) {
        validateItemKey(key);
        check(Number.isSafeInteger(count) && count > 0, "Invalid acquired quantity.");
        const item = getItem(key);
        check(item && typeof item.id === "string", "Unknown acquired item.");
        const quality = item.quality || 0;
        const previous = next[item.id];
        const total = (previous?.number || 0) + count;
        check(Number.isSafeInteger(total) && total > 0, "Acquisition count overflow.");
        next[item.id] = {id: item.id, number: total,
            quality_highest: Math.max(previous?.quality_highest || 0, quality),
            quality_lowest: Math.min(previous?.quality_lowest ?? quality, quality)};
    }
    return next;
}

// Validate every debit against initial ownership before granting anything.
// Selling an item cannot manufacture stock for a buy in the same command.
export function stageAcquisition(owners, {transfers = [], consumes = [], grants = []}) {
    validateOwnership(owners);
    const next = structuredClone(owners), debits = {};
    const debit = (owner, key, count) => {
        validateItemKey(key);
        check(Object.hasOwn(owners, owner) && Number.isSafeInteger(count) && count > 0, "Invalid ownership debit.");
        debits[owner] ||= {};
        debits[owner][key] = (debits[owner][key] || 0) + count;
        check(Number.isSafeInteger(debits[owner][key]) && debits[owner][key] <= (owners[owner][key] || 0), "Insufficient, stale or unavailable item quantity. Refresh the trade.");
    };
    for(const entry of transfers) {
        check(entry.from !== entry.to && Object.hasOwn(owners, entry.to), "Invalid transfer owner.");
        debit(entry.from, entry.key, entry.count);
    }
    for(const entry of consumes) debit(entry.owner, entry.key, entry.count);
    for(const [owner, inventory] of Object.entries(debits)) for(const [key, count] of Object.entries(inventory)) {
        next[owner][key] -= count;
        if(!next[owner][key]) delete next[owner][key];
    }
    for(const entry of [...transfers.map(t => ({owner: t.to, key: t.key, count: t.count})), ...grants]) {
        validateItemKey(entry.key);
        check(Object.hasOwn(next, entry.owner) && Number.isSafeInteger(entry.count) && entry.count > 0, "Invalid ownership grant.");
        const total = (next[entry.owner][entry.key] || 0) + entry.count;
        check(Number.isSafeInteger(total), "Owned quantity overflow.");
        next[entry.owner][entry.key] = total;
    }
    return next;
}

export function prepareOwnershipPublication(owners, {itemsByOwner, getItem}) {
    validateOwnership(owners);
    const staged = Object.entries(owners).map(([owner, inventory]) => {
        const live = itemsByOwner[owner];
        check(live, `Missing inventory binding: ${owner}`);
        const next = Object.fromEntries(Object.entries(inventory).map(([key, count]) => {
            const item = live[key]?.item || getItem(key);
            check(item, "Unknown owned item.");
            return [key, {item, count}];
        }));
        return {live, next};
    });
    return {publish() {
        for(const {live, next} of staged) {
            for(const key of Object.keys(live)) delete live[key];
            Object.assign(live, next);
        }
    }};
}

export function writeOwnershipToEnvelope(envelope, owners, bindings) {
    validateOwnership(owners);
    for(const [owner, inventory] of Object.entries(owners)) {
        const binding = bindings[owner];
        check(binding && envelope.inventories?.[binding.category]?.[binding.id], "Missing saved inventory owner.");
        envelope.inventories[binding.category][binding.id] = Object.fromEntries(Object.entries(inventory).map(([key, count]) => [key, {count}]));
    }
}
