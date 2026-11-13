// A world authors the routes. The kernel binds current holders and settles a
// form change on the existing body, including stock and byproducts.
import {check, deepFreeze, natural, object, positive} from './basics.js';
import {defineWorkingLaw} from './kernel_working.js';

const key = value => typeof value === 'string' && /^[a-z][a-z0-9_.:-]*$/.test(value);
const fields = ['properties', 'quantities'];
const triggers = ['growth', 'item', 'trade', 'battle', 'event'];
const temporaryForm = 'temporary-form';
const temporaryUntil = 'temporary-form-until';
const layersProperty = 'temporary-form-layers';
const clearTemporary = holder => [temporaryForm, temporaryUntil].map(property =>
    ({op: 'property', holder, property, value: null}));

// The substrate's typed set persists the independent form, priority and expiry
// as labels. A form without a deadline leaves the last field empty.
function formLayers(properties) {
    return (properties[layersProperty] ?? []).map(entry => {
        const [form, priority, until, extra] = entry.split('|');
        check(extra === undefined && key(form) && positive(Number(priority)) && String(Number(priority)) === priority &&
            (until === '' || natural(Number(until)) && String(Number(until)) === until),
            'Invalid temporary form layer.');
        return {entry, form, priority: Number(priority), until: until === '' ? Infinity : Number(until)};
    });
}

function activeTemporary(properties, at) {
    const layers = formLayers(properties).filter(layer => at < layer.until);
    const form = properties[temporaryForm], until = properties[temporaryUntil] ?? Infinity;
    if (form && at < until) layers.push({form, until, priority: 0});
    return layers.sort((a, b) => b.priority - a.priority || (a.form < b.form ? -1 : Number(a.form > b.form)));
}

export function creatureForm(body, at) {
    const properties = body.properties ?? {};
    return activeTemporary(properties, at)[0]?.form ?? properties.form;
}

export function hasTemporaryCreatureForm(body, at, form) {
    return activeTemporary(body.properties ?? {}, at).some(layer => layer.form === form);
}

function writeLayers(holder, entries) {
    return {op: 'property', holder, property: layersProperty, value: entries.length ? entries : null};
}

export function releaseCreatureForm(body, at, form) {
    const properties = body.properties ?? {};
    const selected = activeTemporary(properties, at).find(layer => form === undefined || layer.form === form);
    if (!selected || !body.holder) return [];
    if (!selected.entry) return clearTemporary(body.holder);
    return [writeLayers(body.holder, properties[layersProperty].filter(entry => entry !== selected.entry))];
}

export const CREATURE_FORM_PACK = deepFreeze({
    id: 'l.creature_form', revision: 1,
    properties: [{id: temporaryForm, type: 'label'},
        {id: temporaryUntil, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER},
        {id: layersProperty, type: 'set'}],
    reads: [temporaryForm, temporaryUntil, layersProperty], writes: [temporaryForm, temporaryUntil, layersProperty],
    laws: [{
        id: 'revert',
        appliesTo: holder => holder.kind === 'body' &&
            (holder.properties[temporaryUntil] !== undefined || holder.properties[layersProperty] !== undefined),
        horizon(view, id) {
            const properties = view.properties(id);
            const next = Math.min(properties[temporaryUntil] ?? Infinity, ...formLayers(properties).map(layer => layer.until));
            return Math.max(1, next - view.clock);
        },
        decide(view, id) {
            const properties = view.properties(id);
            const effects = view.clock >= properties[temporaryUntil] ? clearTemporary(id) : [];
            const layers = formLayers(properties);
            const remaining = layers.filter(layer => view.clock < layer.until);
            if (remaining.length !== layers.length) effects.push(writeLayers(id, remaining.map(layer => layer.entry)));
            return effects;
        },
    }],
});
const comparisons = {
    is: (a, b) => a === b,
    isNot: (a, b) => a !== b,
    atLeast: (a, b) => typeof a === 'number' && a >= b,
    greater: (a, b) => typeof a === 'number' && typeof b === 'number' && a > b,
    less: (a, b) => typeof a === 'number' && typeof b === 'number' && a < b,
    has: (a, b) => Array.isArray(a) && a.includes(b),
};
const read = (bound, ref, at) => ref.clock === true ? at : bound[ref.role]?.[ref.field]?.[ref.key];
const reference = (ref, roles) => ref && (ref.clock === true ||
    Object.hasOwn(roles, ref.role) && fields.includes(ref.field) && key(ref.key));
const amountRow = (row, roles) => row && Object.hasOwn(roles, row.role) && key(row.quantity) &&
    positive(row.amount) && natural(row.max) && row.max >= row.amount;

/** A route may combine any typed facts supplied by the current world owners.
 * An event producer offers the matching route after its own event settles.
 * Quantity limits are local account limits supplied with the route. */
export function defineCreatureEvolution({id, revision, routes}) {
    check(Array.isArray(routes) && routes.length > 0, 'Evolution needs routes.');
    const operations = Object.create(null), methods = Object.create(null);
    const byTrigger = Object.fromEntries(triggers.map(trigger => [trigger, []]));
    for (const raw of routes) {
        const route = deepFreeze(structuredClone(raw));
        const {from, to, roles, needs = [], alternatives = [], spends = [], outputs = [], temporary,
            preserveTemporary = false} = route;
        check(key(route.id) && !Object.hasOwn(operations, route.id) && triggers.includes(route.trigger) && key(from) && key(to) &&
            from !== to && roles?.animal === 'body' && natural(route.minutes ?? 0), 'Invalid evolution route.');
        const validNeeds = group => Array.isArray(group) && group.every(need => reference(need, roles) &&
            Object.hasOwn(comparisons, need.op) &&
            (need.other === undefined ? Object.hasOwn(need, 'value') : reference(need.other, roles)));
        check(validNeeds(needs) && Array.isArray(alternatives) && alternatives.every(group =>
            validNeeds(group) && group.length > 0), 'Invalid evolution condition.');
        check(Array.isArray(spends) && Array.isArray(outputs) &&
            [...spends, ...outputs].every(row => amountRow(row, roles)), 'Invalid evolution stock.');
        check(temporary === undefined || object(temporary) &&
            Object.keys(temporary).every(key => ['duration', 'priority'].includes(key)) &&
            (temporary.duration === undefined || positive(temporary.duration)) &&
            (temporary.priority === undefined || positive(temporary.priority)), 'Invalid temporary form settings.');
        check(typeof preserveTemporary === 'boolean' && (!preserveTemporary || temporary === undefined),
            'Only a permanent route may opt into preserving active temporary forms.');
        operations[route.id] = {roles, minutes: route.minutes ?? 0, settle({bound, at}) {
            const {animal} = bound;
            if (!animal.holder || animal.properties?.form !== from)
                return {ok: false, reason: 'evolution-form-changed'};
            const active = activeTemporary(animal.properties, at);
            const blockedByForm = temporary?.priority === undefined
                ? active.length > 0 && !preserveTemporary
                : active.some(layer => layer.form === to);
            if (blockedByForm)
                return {ok: false, reason: 'evolution-temporary-form-active'};
            if (Object.values(bound).some(holder => !holder.holder || holder.holder !== animal.place && holder.place !== animal.place))
                return {ok: false, reason: 'evolution-input-out-of-reach'};
            const met = group => group.every(need =>
                comparisons[need.op](read(bound, need, at), need.other ? read(bound, need.other, at) : need.value));
            if (!met(needs) || alternatives.length && !alternatives.some(met))
                return {ok: false, reason: 'evolution-condition-changed'};
            const until = temporary?.duration === undefined ? null : at + temporary.duration;
            if (until !== null && !positive(until)) return {ok: false, reason: 'evolution-clock-exhausted'};
            const formEffects = temporary?.priority !== undefined ? [
                writeLayers(animal.holder, [
                    ...active.flatMap(layer => layer.entry ? [layer.entry] : []),
                    [to, temporary.priority, until ?? ''].join('|'),
                ]),
            ] : temporary ? [
                {op: 'property', holder: animal.holder, property: temporaryForm, value: to},
                {op: 'property', holder: animal.holder, property: temporaryUntil, value: until},
            ] : [{op: 'property', holder: animal.holder, property: 'form', value: to}];
            // Check all debits before credits. Aggregate by resolved holder so
            // aliases cannot double-spend or bypass a destination's room.
            const stock = new Map();
            for (const [rows, direction] of [[spends, -1], [outputs, 1]]) for (const row of rows) {
                const holder = bound[row.role], address = JSON.stringify([holder.holder, row.quantity]);
                const entry = stock.get(address) ?? {holder: holder.holder, quantity: row.quantity,
                    balance: holder.quantities?.[row.quantity], delta: 0};
                entry.balance += direction * row.amount;
                entry.delta += direction * row.amount;
                if (!natural(entry.balance) || entry.balance > row.max)
                    return {ok: false, reason: direction < 0 ? 'evolution-stock-short' : 'evolution-output-full'};
                stock.set(address, entry);
            }
            return {ok: true, effects: [
                ...[...stock.values()].filter(row => row.delta).map(({holder, quantity, delta}) =>
                    ({op: 'add', holder, quantity, amount: delta})),
                ...formEffects,
            ], observed: {from, to, ...(until === null ? {} : {until})}};
        }};
        methods[route.id] = {id: route.id, revision, law: `${id}@${revision}`, roles,
            steps: [{op: route.id, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}]};
        byTrigger[route.trigger].push(route.id);
    }
    if (routes.some(route => route.temporary)) {
        const roles = {animal: 'body'};
        check(!Object.hasOwn(operations, 'revert-form'), 'Revert is reserved for temporary forms.');
        operations['revert-form'] = {roles, settle({bound, at}) {
            const {animal} = bound;
            const effects = releaseCreatureForm(animal, at);
            if (!effects.length)
                return {ok: false, reason: 'evolution-no-temporary-form'};
            return {ok: true, effects};
        }};
        methods['revert-form'] = {id: 'revert-form', revision, law: `${id}@${revision}`, roles,
            steps: [{op: 'revert-form', bindings: {animal: 'animal'}}]};
    }
    return {law: defineWorkingLaw({id, revision, operations}), methods: deepFreeze(methods), byTrigger: deepFreeze(byTrigger)};
}
