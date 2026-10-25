import {check} from "./basics.js";
// Shared inventory-key contract: ownership and gameplay transactions use one validator.
const object = value => value && typeof value === "object" && !Array.isArray(value);
const safeKey = value => typeof value === "string" && value.length > 0 &&
    !["__proto__", "constructor", "prototype"].includes(value);
const amount = value => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;

export function validateItemKey(key) {
    check(typeof key === "string", "An item needs its complete inventory key.");
    let value;
    try {value = JSON.parse(key);} catch {throw new Error("Invalid inventory key.");}
    check(object(value) && (safeKey(value.id) || object(value.components)), "Invalid inventory key.");
    if(value.quality != null) check(amount(value.quality), "Invalid item quality.");
}
