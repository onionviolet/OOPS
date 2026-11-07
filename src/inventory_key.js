import {check} from "./basics.js";
// Shared inventory-key contract: ownership and gameplay transactions use one validator.
const object = value => value && typeof value === "object" && !Array.isArray(value);
const safeKey = value => typeof value === "string" && value.length > 0 &&
    !["__proto__", "constructor", "prototype"].includes(value);
const amount = value => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;

const deepFreeze = value => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
        Object.freeze(value);
        for (const child of Object.values(value)) deepFreeze(child);
    }
    return value;
};
const PARSED = new Map(), PARSED_MAX = 20000, BAD = Symbol("bad key");
// Parsed inventory keys, cached: crowded saves read the same keys tens of
// thousands of times a second from many modules. The result is deep-frozen
// and shared, so read it, never change it. Returns null for a key that is not
// JSON (plain ids such as "Stick" included).
export function readItemKey(key) {
    if (typeof key !== "string") return null;
    let value = PARSED.get(key);
    if (value === undefined) {
        try {value = deepFreeze(JSON.parse(key));} catch {value = BAD;}
        if (PARSED.size >= PARSED_MAX) PARSED.clear();
        PARSED.set(key, value);
    }
    return value === BAD ? null : value;
}

export function validateItemKey(key) {
    check(typeof key === "string", "An item needs its complete inventory key.");
    const value = readItemKey(key);
    check(object(value) && (safeKey(value.id) || object(value.components)), "Invalid inventory key.");
    if(value.quality != null) check(amount(value.quality), "Invalid item quality.");
}
