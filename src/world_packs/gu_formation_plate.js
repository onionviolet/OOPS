// Ch. 1089 supplies the installed route and ch. 1415 the proposed overwrite.
// Shelter and its field timing are authored here.
import {defineWorkingLaw, MAX_WORKING_STEPS} from '../kernel_working.js';
import {GU_OCCUPANCY_PROPERTIES, guWorldUseReason} from '../gu_world_use.js';
import {fixedTravelMovement} from './gu_fixed_travel_working.js';

const boundPlate = bound => {
    const {operator, plate, site} = bound;
    return operator.place === site.id && plate.place === site.id && plate.properties.gu_kind === 'formation-plate' &&
        plate.properties.alive && plate.properties.gu_keeper === operator.id && plate.properties.gu_controller === operator.id &&
        plate.quantities.satiety > 0 && operator.quantities['energy:immortal.essence'] >= 1;
};
const plateFuel = 'energy:immortal.essence';
const price = operator => [{quantity: plateFuel, payer: operator.holder, amount: 1}];
const roles = {operator: 'operator', plate: 'gu', site: 'place'};
const endpoints = {site: 'place', array: 'formation', terminus: 'formation', anchor: 'thing'};
const setupRoles = {...roles, ...endpoints};
const travelRoles = {...endpoints, operator: 'operator', key: 'gu'};
const cleanseRoles = {operator: 'operator', site: 'place'};
const restraintRoles = {operator: 'operator', specimen: 'gu', subject: 'body'};
const releaseRoles = {operator: 'operator', specimen: 'gu'};
const layouts = {
    shelter: {verb: 'block', object: 'vitality', target: 'bound', time: 'sustained', carrier: 'gu', cost: 'none', limits: []},
};
export const GU_FORMATION_PLATE_PROPERTIES = [{id: 'gu_formation_layout', type: 'label'}];
export const GU_TELEPORT_ARRAY_PROPERTIES = [
    ...['gu_array_terminus', 'gu_array_anchor', 'gu_array_origin', 'gu_array_destination', 'gu_array_key_for']
        .map(id => ({id, type: 'label'})),
    {id: 'gu_array_intact', type: 'flag'},
    {id: 'gu_anchor_water_marks', type: 'level', min: 0},
];

const reject = reason => ({ok: false, reason});
const set = (holder, property, value) => ({op: 'property', holder, property, value});
const holdThread = (holder, working, until, operator) => [
    set(holder, 'gu_use_working', working),
    set(holder, 'gu_use_working_until', until),
    set(holder, 'gu_thread_holder', operator),
    set(holder, 'gu_thread_working', working),
];
const cleansingField = 'gu.self-cleansing';
const cleansingPulse = 'gu.self-cleansing.pulse';
const restraintPulse = 'gu.restraint.pulse';
const threadStopped = 'gu.restraint.upkeep-stopped';
const focusLost = 'mind.focus-lost';
const lostFocus = p => p.mind_awake === false || p.mind_confusion > 0;
const threadProperties = [...GU_OCCUPANCY_PROPERTIES,
    ...['gu_thread_holder', 'gu_thread_working'].map(id => ({id, type: 'label'}))];
const threadState = (holder, value) => ({op: 'state', holder, pack: cleansingField, value});
const threadPulse = (place, operator, subject, specimen, field) => ({
    op: 'publish', kind: restraintPulse, place, by: operator, detail: {subject, specimen, field},
});
function stopThread(view, id, reason) {
    const {operator, working} = view.state(id);
    if (view.property(id, 'gu_use_working') !== working) return [threadState(id, null)];
    return [threadState(id, null), ...holdThread(id, null, null, null),
        {op: 'publish', kind: threadStopped, place: view.placeOf(id), by: operator, detail: {working, specimen: id, reason}}];
}
function renewThread(view, id) {
    const {operator, subject, working, interval} = view.state(id);
    const properties = view.properties(id);
    if (properties.gu_use_working !== working) return [threadState(id, null)];
    const due = properties.gu_use_working_until;
    if (view.clock < due) return [];
    const place = view.placeOf(operator);
    const next = due + interval;
    if (lostFocus(view.properties(operator))) return stopThread(view, id, 'focus-lost');
    if (view.clock !== due || !Number.isSafeInteger(next) || !place || view.placeOf(subject) !== place ||
        view.property(operator, 'alive') !== true || view.property(subject, 'alive') !== true ||
        properties.alive !== true || properties.gu_kind !== 'binding-thread' ||
        !view.has(id, 'satiety') || view.amount(id, 'satiety') <= 0 ||
        guWorldUseReason({place: view.placeOf(id), properties}, operator, place, due, {working})) {
        return stopThread(view, id, 'thread-unavailable');
    }
    if (!view.has(operator, plateFuel) || view.amount(operator, plateFuel) < 1)
        return stopThread(view, id, 'essence-unavailable');
    return [{op: 'add', holder: operator, quantity: plateFuel, amount: -1},
        ...holdThread(id, working, next, operator),
        threadPulse(place, operator, subject, id, 'restraint.' + working.replaceAll('/', '.') + '.renew.' + due)];
}

const restraintStrength = field => field.params.guRestraintStrength ?? 1;
const plateLayout = layout => layout === 'self-cleansing' || Object.hasOwn(layouts, layout);
function grounded({site, array, anchor, terminus}) {
    return array.place === site.id && array.properties.gu_array_intact === true &&
        anchor.place === site.id && anchor.properties.gu_anchor_water_marks > 0 &&
        terminus.place && terminus.place !== site.id && terminus.properties.gu_array_intact === true;
}

export const GU_FORMATION_PLATE_LAW = defineWorkingLaw({
    id: 'gu.formation-plate', revision: 1, operations: {
        inscribe: {roles, settle({bound, options}) {
            if (!boundPlate(bound)) return {ok: false, reason: 'formation plate unavailable'};
            if (!plateLayout(options.layout)) return {ok: false, reason: 'layout unavailable'};
            if (bound.plate.properties.gu_formation_layout !== options.previous) return {ok: false, reason: 'stored layout changed'};
            return {ok: true, costs: price(bound.operator),
                effects: [{op: 'property', holder: bound.plate.holder, property: 'gu_formation_layout', value: options.layout}],
                observed: {stored: options.layout}};
        }},
        'install-cleansing': {roles, settle({bound, options, address, at}) {
            const {operator, site, plate} = bound;
            if (!boundPlate(bound) || guWorldUseReason(plate, operator.id, site.id, at) ||
                plate.properties.gu_formation_layout !== 'self-cleansing' ||
                !Number.isSafeInteger(options.duration) || options.duration <= 0 ||
                !Number.isSafeInteger(at + options.duration)) return reject('compatible cleansing layout unavailable');
            const id = 'formation.' + address.replaceAll('/', '.');
            return {ok: true, costs: price(operator), effects: [
                {op: 'law_add', field: {id, scope: site.holder, kind: cleansingField, until: at + options.duration}},
            ]};
        }},
        cleanse: {roles: cleanseRoles, settle({bound: {operator, site}}) {
            if (operator.place !== site.id || operator.properties.alive !== true) return reject('operator must be at the array');
            return {ok: true, costs: price(operator), effects: [
                {op: 'publish', kind: cleansingPulse, place: site.holder, by: operator.holder},
            ]};
        }},
        restrain: {roles: restraintRoles, settle({bound: {operator, specimen, subject}, at, address, options}) {
            const p = specimen.properties;
            if (options.sustain && lostFocus(operator.properties)) return reject('caster cannot sustain binding thread');
            if (!operator.place || operator.place !== subject.place || operator.properties.alive !== true ||
                subject.properties.alive !== true || p.gu_kind !== 'binding-thread' ||
                p.alive !== true || !(specimen.quantities.satiety > 0)) return reject('local binding thread unavailable');
            const working = address.slice(0, address.lastIndexOf('/'));
            const reason = guWorldUseReason(specimen, operator.id, operator.place, at, {working});
            if (reason) return reject(reason);
            if (options.renewal && (p.gu_use_working !== working || p.gu_use_working_until !== at)) {
                return reject('held binding thread unavailable');
            }
            const next = options.nextInterval === undefined ? null : at + options.nextInterval;
            if (next !== null && (!Number.isSafeInteger(next) || next <= at)) return reject('invalid renewal deadline');
            const hold = next !== null || options.renewal
                ? holdThread(specimen.holder, next === null ? null : working, next, next === null ? null : operator.id) : [];
            return {ok: true, costs: price(operator), effects: [
                ...hold,
                ...(options.sustain && next !== null ? [threadState(specimen.holder, {
                    operator: operator.holder, subject: subject.holder, working, interval: options.nextInterval,
                })] : []),
                threadPulse(operator.place, operator.holder, subject.holder, specimen.holder, 'restraint.' + address.replaceAll('/', '.')),
            ]};
        }},
        'release-thread': {roles: releaseRoles, settle({bound: {operator, specimen}, at, options}) {
            const p = specimen.properties;
            if (operator.properties.alive !== true || p.gu_thread_holder !== operator.id ||
                typeof options.working !== 'string' || p.gu_thread_working !== options.working ||
                p.gu_use_working !== options.working ||
                !(p.gu_use_working_until >= at)) return reject('no matching binding thread hold');
            return {ok: true, effects: [...holdThread(specimen.holder, null, null, null), threadState(specimen.holder, null)]};
        }},
        erect: {roles, settle({bound, options, address}) {
            if (!boundPlate(bound)) return {ok: false, reason: 'formation plate unavailable'};
            if (!Object.hasOwn(layouts, options.layout) || bound.plate.properties.gu_formation_layout !== options.layout ||
                !Number.isSafeInteger(options.duration) || options.duration <= 0) {
                return {ok: false, reason: 'compatible shelter layout unavailable'};
            }
            const field = 'formation.' + address.replaceAll('/', '.');
            return {ok: true, costs: price(bound.operator), facts: {formationField: field}, effects: [{
                sentence: layouts[options.layout],
                details: {target: {shape: 'holder', id: bound.site.holder}, minutes: options.duration,
                    field},
            }]};
        }},
        'install-teleport': {roles: setupRoles, settle({bound, at}) {
            const {operator, plate, site, array, anchor, terminus} = bound;
            if (!boundPlate(bound) || guWorldUseReason(plate, operator.id, site.id, at) ||
                plate.properties.gu_formation_layout !== 'teleport') {
                return reject('teleportation layout unavailable');
            }
            if (!grounded(bound) || array.properties.gu_array_terminus) return reject('array cannot be installed here');
            return {ok: true, costs: price(operator), effects: [
                set(array.holder, 'gu_array_terminus', terminus.holder),
                set(array.holder, 'gu_array_anchor', anchor.holder),
                set(array.holder, 'gu_array_origin', site.id),
                set(array.holder, 'gu_array_destination', terminus.place),
            ]};
        }},
        'cross-teleport': {roles: travelRoles, settle({bound, at, options}) {
            const {operator, site, array, terminus, anchor, key} = bound;
            const p = array.properties;
            if (!grounded(bound) || p.gu_array_terminus !== terminus.holder || p.gu_array_anchor !== anchor.holder ||
                p.gu_array_origin !== site.id || p.gu_array_destination !== terminus.place) {
                return reject('installed route unavailable');
            }
            const from = options.returning ? terminus.place : site.id;
            const to = options.returning ? site.id : terminus.place;
            if (operator.place !== from || key.properties.gu_array_key_for !== terminus.holder ||
                !key.properties.alive || !(key.quantities.satiety > 0) || guWorldUseReason(key, operator.id, from, at)) {
                return reject('local travel key unavailable');
            }
            return {ok: true, costs: price(operator), effects: [fixedTravelMovement(operator.holder, to)]};
        }},
    },
});

export function guFormationPlateMethod({operation, layout, previous, duration, renewals = 0, interval = 1, working, sustain = false}) {
    const needs = GU_FORMATION_PLATE_LAW.operations[operation].roles;
    if (operation === 'restrain') {
        if (!Number.isSafeInteger(renewals) || renewals < 0 || renewals >= MAX_WORKING_STEPS ||
            !Number.isSafeInteger(interval) || interval < 1 ||
            !Number.isSafeInteger(1 + renewals * interval) || (sustain && renewals !== 0)) throw Error('Invalid Binding Thread upkeep schedule.');
        const bindings = Object.fromEntries(Object.keys(needs).map(role => [role, role]));
        return {id: 'gu.formation-plate.restrain', revision: 1, law: GU_FORMATION_PLATE_LAW.ref, roles: needs,
            steps: Array.from({length: renewals + 1}, (_, index) =>
                ({op: 'restrain', minutes: index === 0 ? 1 : interval, bindings,
                    options: {...(index > 0 && {renewal: true}), ...((index < renewals || sustain) && {nextInterval: interval}),
                        ...(sustain && {sustain: true})}}))};
    }
    return {id: 'gu.formation-plate.' + operation, revision: 1, law: GU_FORMATION_PLATE_LAW.ref, roles: needs,
        steps: [{op: operation, minutes: operation === 'release-thread' ? 0 : 2,
            bindings: Object.fromEntries(Object.keys(needs).map(role => [role, role])),
            options: {layout, ...(previous !== undefined && {previous}), ...(duration !== undefined && {duration}),
                ...(working !== undefined && {working})}}]};
}

// An authored layout: each pulse wears down one compatible personal restraint.
export const guCleansingArrayPack = {
    id: cleansingField, revision: 1, publishes: [cleansingPulse, restraintPulse, threadStopped], hears: [focusLost],
    properties: threadProperties,
    reads: ['alive', 'satiety', 'gu_kind', 'gu_keeper', 'gu_controller'],
    writes: [plateFuel, ...threadProperties.map(({id}) => id)],
    laws: [{
        id: 'renew-thread', appliesTo: holder => !!holder.state[cleansingField]?.working,
        horizon: (view, id) => Math.max(1, view.property(id, 'gu_use_working_until') - view.clock),
        decide: renewThread,
    }],
    reactors: [{
        id: 'break-thread-focus', on: [focusLost], appliesTo: holder => !!holder.state[cleansingField]?.working,
        react(view, id, event) {
            return view.state(id).operator === event.by && lostFocus(view.properties(event.by))
                ? stopThread(view, id, 'focus-lost') : [];
        },
    }, {
        id: 'personal-cleansing', on: [cleansingPulse], appliesTo: holder => holder.kind === 'body',
        react(view, id, event) {
            if (id !== event.by || !view.lawFields(event.place, cleansingField).some(field => field.scope === event.place)) {
                return [];
            }
            const restraint = view.lawFields(id, 'block').find(field => {
                const strength = restraintStrength(field);
                return field.scope === id && field.params.guCleansable === true &&
                    Number.isSafeInteger(strength) && strength > 0;
            });
            if (!restraint) return [];
            const strength = restraintStrength(restraint);
            return strength === 1 ? [{op: 'law_remove', id: restraint.id}]
                : [{op: 'law_params', id: restraint.id, params: {guRestraintStrength: strength - 1}}];
        },
    }, {
        id: 'binding-thread', on: [restraintPulse], appliesTo: holder => holder.kind === 'body',
        react(view, id, event) {
            const {subject, specimen, field} = event.detail;
            if (id !== subject || view.placeOf(id) !== event.place) return [];
            const prior = view.lawFields(id, 'block').find(row => row.scope === id &&
                row.params.guRestraintSpecimen === specimen && row.params.guRestraintCaster === event.by);
            if (prior) return restraintStrength(prior) < 2
                ? [{op: 'law_params', id: prior.id, params: {guRestraintStrength: 2}}] : [];
            return [{op: 'law_add', field: {id: field, scope: id, kind: 'block', until: view.clock + 20,
                params: {verb: 'move', object: 'position', guCleansable: true, guRestraintStrength: 2,
                    guRestraintSpecimen: specimen, guRestraintCaster: event.by}}}];
        },
    }],
};

// The chapter gives a six-hour installation. The separate key's identity,
// activation time and essence prices are local authoring values.
export function guTeleportArrayMethod({install = false, returning = false} = {}) {
    const op = install ? 'install-teleport' : 'cross-teleport';
    const bindings = install ? setupRoles : travelRoles;
    return {id: 'gu.formation-plate.' + op, revision: 1, law: GU_FORMATION_PLATE_LAW.ref, roles: bindings,
        steps: [{op, minutes: install ? 360 : 5, bindings: Object.fromEntries(Object.keys(bindings).map(role => [role, role])),
            ...(!install && {options: {returning}})}]};
}
