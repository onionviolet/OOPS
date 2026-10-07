import {evaluateRule} from "./rules.js";

const check = (condition, message) => {if(!condition) throw new Error(message);};
export const SOURCE_KINDS = ["skill", "equipment", "knowledge", "trait", "bloodline", "technique", "condition", "world", "support"];
export const SOURCE_ORIGINS = ["unknown", "inherited", "trained", "acquired"];
const validId = value => typeof value === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !["__proto__", "constructor", "prototype"].includes(value);

export function validateCapabilityDefinitions(registry, validateRule) {
    for(const capability of registry.capabilities.values()) {
        check(typeof capability.label === "string" && ["max", "sum"].includes(capability.stacking), "Invalid capability definition.");
        check(Array.isArray(capability.providers), "Capability providers must be an array.");
        const ids = new Set();
        for(const provider of capability.providers) {
            check(validId(provider.id) && !ids.has(provider.id) && SOURCE_KINDS.includes(provider.kind) &&
                typeof provider.label === "string" && Number.isFinite(provider.amount) && provider.amount > 0 && provider.when,
            "Invalid capability provider.");
            ids.add(provider.id); validateRule(provider.when);
            check(!JSON.stringify(provider.when).includes('"capability.'), "Capability providers cannot depend on capabilities.");
        }
    }
    for(const source of registry.sources.values()) {
        check(source.origin == null || SOURCE_ORIGINS.includes(source.origin), "Invalid source origin.");
        check(typeof source.label === "string" && SOURCE_KINDS.includes(source.kind) &&
            Number.isSafeInteger(source.revision) && source.revision > 0 && Array.isArray(source.grants), "Invalid source definition.");
        const seen = new Set();
        for(const grant of source.grants) {
            check(registry.capabilities.has(grant.capability) && !seen.has(grant.capability) &&
                Number.isFinite(grant.amount) && grant.amount > 0, "Invalid source capability grant.");
            seen.add(grant.capability);
            if(grant.when) {
                validateRule(grant.when);
                check(!JSON.stringify(grant.when).includes('"capability.'), "Source grants cannot depend on capabilities.");
            }
        }
    }
}

// Queries are pure: no spending, random draw, activation or saved-state changes.
// Native providers and earned sources use the same value and provenance model.
export function queryCapabilities(state, registry, context, facts) {
    const active = state.actors[context.actorId].sources || {};
    const result = {};
    for(const definition of registry.capabilities.values()) {
        const contributions = [], missing = [];
        for(const provider of definition.providers) {
            const rule = evaluateRule(provider.when, facts);
            if(rule.met) contributions.push({sourceId: provider.id, kind: provider.kind, label: provider.label, amount: provider.amount});
            else missing.push(...rule.reasons);
        }
        for(const [sourceId, instance] of Object.entries(active)) {
            if(instance.expiresAt != null && instance.expiresAt <= state.clock) continue;
            const faculty = state.simulation?.faculties[context.actorId]?.[sourceId];
            if(faculty && (!faculty.awakened || !faculty.active || faculty.suppressed)) continue;
            const source = registry.sources.get(sourceId);
            check(source, `Unknown capability source ${sourceId}.`);
            for(const grant of source.grants.filter(g => g.capability === definition.id)) {
                if(!grant.when || evaluateRule(grant.when, facts).met) contributions.push({sourceId, kind: source.kind,
                    label: source.label, amount: grant.amount, receiptId: instance.receiptId});
            }
        }
        const value = definition.stacking === "max" ? Math.max(0, ...contributions.map(c => c.amount))
            : contributions.reduce((total, c) => total + c.amount, 0);
        check(Number.isFinite(value), "Capability overflow.");
        result[definition.id] = {id: definition.id, label: definition.label, value,
            stacking: definition.stacking, contributions, reasons: value ? [] : [...new Set(missing)]};
    }
    return result;
}
