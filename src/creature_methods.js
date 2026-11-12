// CE2–CE3, AD38 and AD51. A world supplies units and a resolver for each
// operation. Hosts bind present entities and publish their own transactions.
import {check, object, positive} from './basics.js';

const id = value => typeof value === 'string' && /^[a-z][a-z0-9_.:-]*$/.test(value) &&
    !['constructor', 'prototype'].includes(value);
const own = (table, key) => Object.hasOwn(table, key) ? table[key] : undefined;
const MAX_STEPS = 12;

export function measureCreatureCapability(definition, contributions) {
    check(object(definition) && id(definition.id) && id(definition.unit) &&
        ['sum', 'max'].includes(definition.combine), 'Invalid creature capability.');
    check(Array.isArray(contributions), 'Creature capability needs sources.');
    const sources = new Set();
    let value = 0;
    for (const contribution of contributions) {
        check(object(contribution) && id(contribution.source) && !sources.has(contribution.source) &&
            contribution.unit === definition.unit && Number.isFinite(contribution.value) &&
            contribution.value >= 0, 'Invalid or duplicate creature capability source.');
        sources.add(contribution.source);
        value = definition.combine === 'sum' ? value + contribution.value : Math.max(value, contribution.value);
    }
    check(Number.isFinite(value), 'Creature capability exceeds its numeric range.');
    return {id: definition.id, unit: definition.unit, value, contributions: structuredClone(contributions)};
}

// Resolvers receive disposable data and can pass new facts to later steps.
// Effect intents stay with the host until the complete plan is publishable.
export function planCreatureMethod(method, {law, operations, bindings, facts}) {
    check(object(method) && id(method.id) && positive(method.revision) && id(law) && method.law === law &&
        Array.isArray(method.steps) && method.steps.length > 0 && method.steps.length <= MAX_STEPS,
    'Invalid creature method or local law.');
    check(object(operations) && object(bindings) && object(facts), 'Creature method needs current bindings.');

    let current = structuredClone(facts);
    const evidence = [];
    const effects = [];
    for (const step of method.steps) {
        check(object(step) && id(step.op) && object(step.bindings), 'Invalid creature method step.');
        const operation = own(operations, step.op);
        check(object(operation) && object(operation.roles) && typeof operation.resolve === 'function',
            'Creature operation is unavailable here.');
        const roles = Object.keys(operation.roles);
        check(Object.keys(step.bindings).length === roles.length, 'Creature operation has unexpected bindings.');
        const bound = {};
        for (const role of roles) {
            const ref = own(step.bindings, role);
            const entity = id(ref) && own(bindings, ref);
            check(id(role) && object(entity) && entity.kind === operation.roles[role] && id(entity.id),
                `Missing or incompatible ${role} for ${step.op}.`);
            bound[role] = structuredClone(entity);
        }
        const used = Object.fromEntries(roles.map(role => [role, bound[role].id]));
        const result = operation.resolve({bound, facts: structuredClone(current),
            options: structuredClone(step.options ?? {})});
        check(object(result) && typeof result.ok === 'boolean', 'Invalid creature operation outcome.');
        if (!result.ok) {
            check(typeof result.reason === 'string' && result.reason.length, 'Creature operation needs a reason.');
            return {ok: false, operation: step.op, reason: result.reason};
        }
        check(object(result.facts) && Array.isArray(result.effects), 'Creature operation needs facts and effects.');
        current = {...current, ...structuredClone(result.facts)};
        effects.push(...structuredClone(result.effects));
        evidence.push({operation: step.op, bindings: used});
    }
    return {ok: true, method: {id: method.id, revision: method.revision, law}, facts: current, effects, evidence};
}
