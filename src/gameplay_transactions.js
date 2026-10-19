import {check} from './basics.js';
import {stageAcquisition} from "./acquisition.js";
// Plain snapshots of owned v0.6 state. No component, DOM or storage mutation.
const object = value => value && typeof value === "object" && !Array.isArray(value);
const safeKey = value => typeof value === "string" && value.length > 0 &&
    !["__proto__", "constructor", "prototype"].includes(value);
const amount = value => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;

export function validateGameplaySnapshot(snapshot = {}) {
    check(object(snapshot), "Invalid gameplay snapshot.");
    for(const [actorId, actor] of Object.entries(snapshot)) {
        check(safeKey(actorId) && object(actor) && object(actor.inventory) && object(actor.skills) && object(actor.reputation), "Invalid gameplay owner.");
        for(const [key, count] of Object.entries(actor.inventory)) {
            validateItemKey(key);
            check(Number.isSafeInteger(count) && count > 0, "Invalid inventory count.");
        }
        for(const [key, skill] of Object.entries(actor.skills)) {
            check(safeKey(key) && object(skill) && amount(skill.xp) && typeof skill.enabled === "boolean" &&
                (skill.parent == null || safeKey(skill.parent)), "Invalid skill snapshot.");
        }
        for(const [key, value] of Object.entries(actor.reputation)) check(safeKey(key) && Number.isFinite(value) &&
            Math.abs(value) <= Number.MAX_SAFE_INTEGER, "Invalid reputation snapshot.");
    }
    return snapshot;
}

export function validateItemKey(key) {
    check(typeof key === "string", "An item needs its complete inventory key.");
    let value;
    try {value = JSON.parse(key);} catch {throw new Error("Invalid inventory key.");}
    check(object(value) && (safeKey(value.id) || object(value.components)), "Invalid inventory key.");
    if(value.quality != null) check(amount(value.quality), "Invalid item quality.");
}

export function validateGameplayEffect(effect, cost = false) {
    if(effect.type === "item") {
        validateItemKey(effect.key);
        check(Number.isSafeInteger(effect.amount) && effect.amount > 0, "Item rewards and costs must be positive counts.");
    } else if(effect.type === "xp") {
        check(!cost && safeKey(effect.skill) && amount(effect.amount) && effect.amount > 0 &&
            Math.round(effect.amount * 100) / 100 === effect.amount, "Skill XP must be positive hundredths.");
    } else if(effect.type === "reputation") {
        check(!cost && safeKey(effect.region) && Number.isFinite(effect.amount) &&
            Math.abs(effect.amount) <= Number.MAX_SAFE_INTEGER, "Invalid reputation effect.");
    } else throw new Error(`Unsupported gameplay effect: ${effect.type}`);
}

export function applyGameplayEffect(snapshot, effect, actorId, spending = false) {
    validateGameplayEffect(effect, spending);
    const actor = snapshot[actorId];
    check(actor, `No gameplay adapter for actor ${actorId}.`);
    if(effect.type === "item") {
        actor.inventory = stageAcquisition({owner: actor.inventory}, spending
            ? {consumes: [{owner: "owner", key: effect.key, count: effect.amount}]}
            : {grants: [{owner: "owner", key: effect.key, count: effect.amount}]}).owner;
    } else if(effect.type === "xp") {
        const seen = new Set();
        const grant = (key, delta) => {
            check(!seen.has(key), "Cyclic skill parent relationship."); seen.add(key);
            const skill = actor.skills[key];
            check(skill?.enabled, `Skill ${key} cannot receive expedition XP.`);
            skill.xp = Math.round((skill.xp + delta) * 100) / 100;
            check(amount(skill.xp), "Skill XP overflow.");
            if(skill.parent) {
                const parent = actor.skills[skill.parent];
                check(parent, `Unknown parent skill ${skill.parent}.`);
                const inherited = Math.round(Math.min(delta, Math.max(0, skill.xp - parent.xp)) * 100) / 100;
                if(inherited) grant(skill.parent, inherited);
            }
        };
        grant(effect.skill, effect.amount);
    } else {
        check(Object.hasOwn(actor.reputation, effect.region), `Unknown reputation region ${effect.region}.`);
        const next = actor.reputation[effect.region] + effect.amount;
        check(Number.isFinite(next) && Math.abs(next) <= Number.MAX_SAFE_INTEGER, "Reputation overflow.");
        actor.reputation[effect.region] = next;
    }
}

// Patch only explicitly bound domains. Preserve equipment, other inventories,
// quests, retired data and all other fields from the existing save envelope.
export function writeGameplayToEnvelope(envelope, snapshot, bindings = {}) {
    validateGameplaySnapshot(snapshot);
    for(const [actorId, actor] of Object.entries(snapshot)) {
        const binding = bindings[actorId];
        check(binding, `No persistence binding for actor ${actorId}.`);
        const inventory = envelope.inventories?.[binding.category]?.[binding.id];
        const level = envelope.levels?.[binding.category]?.[binding.id];
        check(inventory && level, "Missing bound inventory or level record.");
        envelope.inventories[binding.category][binding.id] = Object.fromEntries(
            Object.entries(actor.inventory).map(([key, count]) => [key, {count}]));
        level.skill_xp = Object.fromEntries(Object.entries(actor.skills).filter(([, skill]) => skill.xp > 0 || skill.present)
            .map(([id, skill]) => [id, skill.xp]));
        if(binding.id === "main_character") envelope.character.reputation = {...actor.reputation};
    }
    return envelope;
}
