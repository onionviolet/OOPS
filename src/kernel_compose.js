// Composed workings (SC6, NV2; docs/KERNEL_WORKING_CONTRACT.md KW18-KW21).
// A composition is a working whose parts are other workings. It declares
// slots by interface: the roles and kinds a filler must bind. Fillers are
// chosen when the working is bound, not when the composition is written, so a
// killer move or a combined spell can be assembled from parts no book paired.
// composeWorking builds one ordinary law and method from the chosen fillers,
// so quote, settle, partition, receipts and saves are the kernel's own.
// Names no domain or world; imports only the kernel.
import {check, natural, object} from './basics.js';
import {defineWorkingLaw, validateWorkingMethod} from './kernel_working.js';

const id = value => typeof value === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !['__proto__', 'constructor', 'prototype'].includes(value);
const sameKinds = (a, b) => Object.keys(a).length === Object.keys(b).length &&
    Object.entries(a).every(([role, kind]) => b[role] === kind);

// KW18. roles: the composite's own roles. slots: [{name, needs: {fillerRole:
// kind}, bindings: {fillerRole: compositeRole}, facts: 'shared' | 'own',
// minutes?}]. `facts` is an explicit choice: shared slots read and write one
// fact table (Gu essence reserves), own slots keep theirs under part:<name>.
// `minutes` overrides every filler step's duration (a dial, e.g. one minute per
// cast). A filler is one part and stays one part: its steps are not split.
export function defineComposition({id: compId, revision, roles, slots, grammar}) {
    check(id(compId) && natural(revision) && object(roles) && Array.isArray(slots) && slots.length > 0,
        'A composition needs an id, a revision, roles and slots.');
    for (const [role, kind] of Object.entries(roles)) check(id(role) && id(kind), 'The composition has an invalid role.');
    const names = new Set();
    for (const slot of slots) {
        check(object(slot) && id(slot.name) && !names.has(slot.name), 'Each slot needs its own name.');
        names.add(slot.name);
        check(object(slot.needs) && object(slot.bindings) && Object.entries(slot.needs).every(([role, kind]) => id(role) && id(kind)),
            `Slot ${slot.name} needs an interface.`);
        check(['shared', 'own'].includes(slot.facts), `Slot ${slot.name} must say whether its facts are shared or its own.`);
        check(slot.minutes === undefined || natural(slot.minutes), `Slot ${slot.name} has an invalid duration.`);
        check(Object.keys(slot.bindings).length === Object.keys(slot.needs).length, `Slot ${slot.name} must map every role it needs.`);
        for (const [role, kind] of Object.entries(slot.needs)) {
            check(roles[slot.bindings[role]] === kind, `Slot ${slot.name} maps ${role} to a role of another kind.`);
        }
    }
    check(grammar === undefined || (typeof grammar === 'string' && grammar.length > 0), 'A composition\'s grammar ref is a string.');
    return Object.freeze({id: compId, revision, roles: {...roles}, slots: structuredClone(slots), ...(grammar ? {grammar} : {})});
}

// Does this method fit the slot? Exact roles and kinds, so a filler's steps
// can be bound without guessing.
export function fillsSlot(slot, filler) {
    return object(filler?.law) && object(filler?.method) && filler.method.law === filler.law.ref &&
        sameKinds(slot.needs, filler.method.roles);
}

const partKey = name => `part:${name}`;

function wrap(slot, operation) {
    if (slot.facts === 'shared') return operation;
    return {...operation, settle(context) {
        const own = context.facts[partKey(slot.name)] ?? {};
        const outcome = operation.settle({...context, facts: structuredClone(own)});
        if (!outcome?.ok) return outcome;
        return {...outcome, facts: {[partKey(slot.name)]: {...own, ...(outcome.facts ?? {})}}};
    }};
}

// KW19 and KW20. One law and one method from the chosen fillers. Operations
// are named <slot>/<op>; the law ref names every filler's law ref, so a saved
// working restores only against the same fillers at the same revisions.
export function composeWorking(composition, fillers) {
    check(object(fillers), 'Choose a filler for every slot.');
    const operations = {};
    const steps = [];
    const refs = [];
    for (const slot of composition.slots) {
        const filler = fillers[slot.name];
        check(fillsSlot(slot, filler), `The filler for ${slot.name} does not bind the roles that slot needs.`);
        validateWorkingMethod(filler.law, filler.method);
        refs.push(`${slot.name}=${filler.law.ref}:${filler.method.id}@${filler.method.revision}${filler.method.grammar ? `#${filler.method.grammar}` : ''}`);
        for (const [op, operation] of Object.entries(filler.law.operations)) operations[`${slot.name}/${op}`] = wrap(slot, operation);
        for (const step of filler.method.steps) {
            const bindings = Object.fromEntries(Object.entries(step.bindings ?? {})
                .map(([opSlot, fillerRole]) => [opSlot, slot.bindings[fillerRole]]));
            const minutes = slot.minutes ?? step.minutes ?? filler.law.operations[step.op].minutes;
            steps.push({op: `${slot.name}/${step.op}`, bindings, ...(minutes !== undefined ? {minutes} : {}),
                ...(step.options !== undefined ? {options: structuredClone(step.options)} : {})});
        }
    }
    const law = defineWorkingLaw({id: composition.id, revision: composition.revision, operations});
    const ref = `${law.ref}[${refs.join(',')}]`;
    const composed = Object.freeze({...law, ref});
    const method = {id: composition.id, revision: composition.revision, law: ref, roles: {...composition.roles}, steps,
        ...(composition.grammar ? {grammar: composition.grammar} : {})};
    validateWorkingMethod(composed, method);
    return {law: composed, method};
}

// Which slot a receipt's step came from (KW21): the part before the slash.
export const composedPart = op => op.split('/')[0];
