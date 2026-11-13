// PC95. Ch. 2285 motivates a recovering defense that investigation can drain.
// The full recipe is unknown. This opt-in row calibrates one protected channel.
import {defineWorkingLaw} from '../kernel_working.js';
import {detectGuApproach} from '../gu_senses.js';
import {resolveGuActivation} from '../gu_activation.js';
import {GU_WARD_EVIDENCE, rememberWards} from './gu_ward_break.js';
import {stableId} from '../simulation_ids.js';

const layer = 'gu_secret_layer';
const active = 'gu_secret_active';
const capacity = 6;
const reknit = 'gu_secret_reknit';
const reknitCharge = 3;
const concealedChannel = 'spirit';
const probe = 'gu.secret.probe';
const reorder = 'gu.secret.reorder';
const reordered = 'gu.secret.reordered';
const replenish = 'gu.secret.replenish';
const suppress = 'gu.secret.suppress';
const pressure = 'gu.secret.pressure';
const pressureMinutes = 4;
const reserve = 'energy:immortal';
const attention = 'energy:mental';
const presence = 'effect.sense.information';
const veilRoles = {operator: 'operator', specimen: 'gu'};
const probeRoles = {observer: 'operator', subject: 'creature'};
const reorderRoles = {keeper: 'operator', subject: 'creature'};
const reject = reason => ({ok: false, reason});
const positiveForce = force => Number.isSafeInteger(force) && force > 0;
const screenId = id => 'gu-secret.' + id;
const screenAddress = (id, field) => field === screenId(id) ||
    (typeof field === 'string' && field.startsWith(screenId(id) + ':') && /^\d+$/.test(field.slice(screenId(id).length + 1)));
const screen = (id, at) => ({op: 'law_add', field: {id: at === undefined ? screenId(id) : screenId(id) + ':' + at,
    scope: id, kind: 'conceal', params: {channel: concealedChannel}}});
const isScreen = (id, field) => field.scope === id && screenAddress(id, field.id);
const wardOrder = field => Number.isSafeInteger(field.params.wardOrder) ? field.params.wardOrder : 0;
function approachOrder(field, entry) {
    const order = entry && field.params.wardApproaches?.[entry];
    return Number.isSafeInteger(order) ? order : wardOrder(field);
}
const sightlines = {kinds: ['sightline']};

function probeApproach(view, origin, place, maxCost, route) {
    if (route === undefined) return view.distance(origin, place, {...sightlines, maxCost});
    if (!Array.isArray(route) || !route.length) return null;
    let here = origin;
    let cost = 0;
    const visited = new Set([here]);
    for (const id of route) {
        const exit = view.exits(here, sightlines).find(row => row.link === id);
        if (!exit || visited.has(exit.to) || exit.cost > maxCost - cost || here === place) return null;
        here = exit.to;
        visited.add(here);
        cost += exit.cost;
    }
    return here === place ? {route, cost} : null;
}
const pressureId = (target, source) => `gu-secret-pressure.${target}:${source}`;
const pressuresAt = (view, id) => view.lawFields(id, pressure).filter(field => field.scope === id);
const canPress = (view, id, source, routed = false) => view.property(source, 'alive') === true &&
    (routed || view.placeOf(source) === view.placeOf(id)) && view.property(source, 'senses')?.includes(concealedChannel);
const outerWards = (id, channel, fields) =>
    fields.filter(field => !isScreen(id, field) && [channel, '*'].includes(field.params.channel));

function pressureAtScreen(view, id, fields, reserves, {source, force = 1, throughSightlines, route}) {
    const origin = view.placeOf(source), place = view.placeOf(id);
    if (!positiveForce(force) || !origin || !place || view.property(id, 'concealed')?.includes(concealedChannel)) return 0;
    const needsRoute = origin !== place || route !== undefined;
    const approach = needsRoute && throughSightlines && probeApproach(view, origin, place, force - 1, route);
    if (needsRoute && !approach) return 0;
    let remaining = force - (approach?.cost ?? 0);
    const entry = approach?.route?.at(-1);
    const wards = outerWards(id, concealedChannel, fields)
        .sort((left, right) => approachOrder(right, entry) - approachOrder(left, entry));
    for (const field of wards) {
        const {probeLoss} = field.params;
        const reserve = reserves.get(field.id);
        if (reserve === undefined && !positiveForce(probeLoss)) return 0;
        const absorbed = Math.min(remaining, positiveForce(probeLoss) ? probeLoss : remaining, reserve ?? Infinity);
        if (reserve !== undefined) reserves.set(field.id, reserve - absorbed);
        remaining -= absorbed;
        if (!remaining) return 0;
    }
    return remaining;
}

function activePressure(view, id, fields, sources) {
    const reserves = new Map(fields.filter(field => field.scope === id && !isScreen(id, field) &&
        positiveForce(field.params.pressureReserve)).map(field => [field.id, field.params.pressureReserve]));
    let drain = 0;
    let holdsGap = false;
    for (const {params} of sources) {
        if (!canPress(view, id, params.source, params.throughSightlines)) continue;
        if (params.drain === true) {
            drain = Math.min(capacity, drain + pressureAtScreen(view, id, fields, reserves, params));
        }
        else holdsGap = true;
    }
    const wear = fields.flatMap(field => {
        const remaining = reserves.get(field.id);
        if (remaining === undefined || remaining === field.params.pressureReserve) return [];
        return [remaining === 0 ? {op: 'law_remove', id: field.id}
            : {op: 'law_params', id: field.id, params: {pressureReserve: remaining}}];
    });
    return {drain, suppresses: holdsGap || drain > 0, wear};
}

const pressurePlan = (view, id) => activePressure(view, id, view.lawFields(id, 'conceal'), pressuresAt(view, id));

function raise({bound: {operator, specimen}, at}) {
    const p = specimen.properties;
    if (!operator.holder || !specimen.holder || p?.gu_kind !== 'heavenly-secret' || p.gu_rank !== 9 ||
        p.gu_keeper !== operator.id || p.gu_controller !== operator.id || specimen.place !== operator.place ||
        p.gu_installed_in || (p.gu_furnace_job && p.gu_furnace_until >= at)) return reject('The core is unavailable.');
    if (operator.properties[active]) return reject('The layer is already active.');
    const gu = {id: specimen.id, kind: p.gu_kind, rank: p.gu_rank, alive: p.alive === true, injured: p.injured,
        fedThrough: specimen.quantities.satiety > 0 ? at : at - 1};
    const result = resolveGuActivation({stages: [{gu, operator: operator.id, ability: {fuel: 'immortal', cost: 3}}],
        reserves: {[operator.id]: {immortal: operator.quantities[reserve] ?? 0}}, day: at});
    if (result.outcome !== 'complete') return reject(result.reason);
    return {ok: true, costs: [{quantity: reserve, payer: operator.holder, amount: result.activations[0].cost}],
        effects: [
            {op: layer in operator.quantities ? 'set' : 'carry', holder: operator.holder, quantity: layer, amount: capacity},
            {op: 'property', holder: operator.holder, property: active, value: true},
            screen(operator.holder),
        ], observed: {specimen: specimen.id}};
}

const methods = {
    raise: {roles: veilRoles, minutes: 3, settle: raise},
    replenish: {roles: reorderRoles, minutes: 1, settle({bound: {keeper, subject}, options: {field}}) {
        if (!keeper.holder || !subject.holder || !keeper.place || keeper.place !== subject.place ||
            keeper.properties.alive !== true || !stableId(field) || !(keeper.quantities[reserve] >= 1)) {
            return reject('Replenishing needs a local keeper, a ward and immortal essence.');
        }
        return {ok: true, effects: [{op: 'publish', kind: replenish, place: subject.place, by: keeper.holder,
            detail: {target: subject.holder, field}}]};
    }},
    reorder: {roles: reorderRoles, minutes: 1, settle({bound: {keeper, subject}, options: {first, second}}) {
        if (!keeper.holder || !subject.holder || !keeper.place || keeper.place !== subject.place ||
            keeper.properties.alive !== true || !stableId(first) || !stableId(second) || first === second ||
            !(keeper.quantities[attention] >= 1)) return reject('Reordering needs a local keeper, two wards and mental energy.');
        return {ok: true, effects: [{op: 'publish', kind: reorder, place: subject.place, by: keeper.holder,
            detail: {target: subject.holder, first, second}}]};
    }},
    suppress: {roles: probeRoles, minutes: 1, settle({bound: {observer, subject}, options}) {
        const drain = options.drain === true;
        const {force = 1, throughSightlines = false, route} = options;
        const routed = drain && throughSightlines === true;
        if (drain && (!positiveForce(force) || !Number.isSafeInteger(force + 2) ||
            (route !== undefined && (!routed || observer.place === subject.place ||
                !Array.isArray(route) || !route.length || !route.every(stableId))))) {
            return reject('Sustained pressure needs positive force and a valid sightline route.');
        }
        const cost = drain ? 2 + force : 2;
        if (!observer.holder || !subject.holder || observer.holder === subject.holder || !observer.place ||
            !subject.place || (!routed && observer.place !== subject.place) ||
            observer.properties.alive !== true || !subject.properties[active] ||
            (!drain && !subject.properties[reknit]) ||
            !observer.properties.senses?.includes(concealedChannel) || !(observer.quantities[attention] >= cost)) {
            return reject(routed ? 'Routed pressure needs a spirit investigator and mental energy.'
                : 'Holding the gap needs a local spirit investigator and mental energy.');
        }
        return {ok: true, costs: [{quantity: attention, payer: observer.holder, amount: cost}],
            effects: [{op: 'publish', kind: suppress, place: subject.place, by: observer.holder,
                detail: {target: subject.holder, ...(drain && {drain, force}),
                    ...(routed && {throughSightlines: true}), ...(routed && route !== undefined && {route})}}]};
    }},
    probe: {roles: probeRoles, minutes: 1, settle({bound: {observer, subject}, options}) {
        const {channel, force, route, throughSightlines = false} = options;
        if (!observer.holder || !subject.holder || observer.holder === subject.holder || !observer.place || !subject.place ||
            (observer.place !== subject.place && (!throughSightlines || channel !== concealedChannel)) ||
            !observer.properties.senses?.includes(channel)) return reject('That channel cannot investigate here.');
        if (!positiveForce(force)) return reject('The probe needs positive force.');
        if (route !== undefined && (!throughSightlines || channel !== concealedChannel || observer.place === subject.place ||
            !Array.isArray(route) || !route.length || !route.every(stableId))) return reject('The probe needs a valid sightline route.');
        if ((observer.quantities[attention] ?? 0) < force) return reject('needs more mental energy');
        return {ok: true, costs: [{quantity: attention, payer: observer.holder, amount: force}],
            effects: [{op: 'publish', kind: probe, place: subject.place, by: observer.holder,
                detail: {target: subject.holder, channel, force, ...(throughSightlines && {throughSightlines: true}),
                    ...(route !== undefined && {route})}}]};
    }},
};
export const GU_SECRET_LAW = defineWorkingLaw({id: 'gu.obscured-secret', revision: 1, operations: methods});

export function guSecretWorking(operation, options = {}) {
    if (!Object.hasOwn(methods, operation)) throw Error('Unknown Heavenly Secret action.');
    const {roles, minutes} = methods[operation];
    return {id: 'gu.obscured-secret.' + operation, revision: 1, law: GU_SECRET_LAW.ref, roles,
        steps: [{op: operation, minutes, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role])), options}]};
}

export const guSecretPack = {
    id: 'g.obscured-secret', revision: 1,
    properties: [{id: active, type: 'flag'}, {id: reknit, type: 'flag'}, ...GU_WARD_EVIDENCE],
    quantities: [{id: layer, unit: 'concealment', min: 0, max: capacity}],
    reads: [layer, active, reknit, 'alive', 'concealed', 'senses'],
    writes: [layer, reknit, attention, reserve, ...GU_WARD_EVIDENCE.map(row => row.id)],
    publishes: [probe, presence, suppress, reorder, reordered, replenish],
    hears: [probe, suppress, reorder, replenish, 'effect.end'],
    laws: [{
        id: 'recover', appliesTo: holder => holder.properties[active] === true && layer in holder.quantities,
        rates(view, id) {
            const charge = view.amount(id, layer);
            const {drain, suppresses} = pressurePlan(view, id);
            const perMinute = suppresses ? (charge > 0 ? -drain : 0) : (charge < capacity ? 1 : 0);
            return perMinute ? [{holder: id, quantity: layer, perMinute}] : [];
        },
        horizon: (view, id) => pressurePlan(view, id).wear.length ? 1 : Infinity,
        advance: (view, id) => pressurePlan(view, id).wear,
        watches: (view, id) => [
            {holder: id, quantity: layer, op: 'gte', value: view.property(id, reknit) ? reknitCharge : 1},
            {holder: id, quantity: layer, op: 'lte', value: 0},
            {holder: id, quantity: layer, op: 'gte', value: capacity},
        ],
        decide(view, id) {
            const pressures = pressuresAt(view, id);
            const dropped = pressures.filter(({params}) => !canPress(view, id, params.source, params.throughSightlines));
            const ended = dropped.map(field => ({op: 'law_remove', id: field.id}));
            const fields = view.lawFields(id, 'conceal');
            const screenField = fields.find(field => isScreen(id, field));
            if (screenField && view.amount(id, layer) === 0) {
                return [...ended, {op: 'law_remove', id: screenField.id},
                    {op: 'property', holder: id, property: reknit, value: true}];
            }
            if (ended.length) return ended;
            if (activePressure(view, id, fields, pressures).suppresses) return [];
            const rebuilding = view.property(id, reknit);
            if (view.amount(id, layer) < (rebuilding ? reknitCharge : 1) ||
                screenField) return [];
            return [screen(id, view.clock), ...(rebuilding ? [{op: 'property', holder: id, property: reknit, value: null}] : [])];
        },
    }],
    reactors: [{
        id: 'replenish-ward', on: [replenish], appliesTo: holder => holder.kind === 'body',
        react(view, id, {by, place, detail}) {
            if (detail?.target !== id || view.placeOf(id) !== place || view.placeOf(by) !== place ||
                view.property(by, 'alive') !== true || !view.has(by, reserve) || view.amount(by, reserve) < 1) return [];
            const ward = outerWards(id, concealedChannel, view.lawFields(id, 'conceal'))
                .find(field => field.scope === id && field.id === detail.field && field.params.wardKeeper === by);
            const {pressureReserve, pressureCapacity} = ward?.params ?? {};
            if (!positiveForce(pressureReserve) || !positiveForce(pressureCapacity) || pressureReserve >= pressureCapacity) return [];
            const restored = pressureReserve + Math.min(2, pressureCapacity - pressureReserve);
            return [{op: 'add', holder: by, quantity: reserve, amount: -1},
                {op: 'law_params', id: ward.id, params: {pressureReserve: restored}}];
        },
    }, {
        id: 'reorder-wards', on: [reorder], appliesTo: holder => holder.kind === 'body',
        react(view, id, {by, place, detail}) {
            if (detail?.target !== id || view.placeOf(id) !== place || view.placeOf(by) !== place ||
                view.property(by, 'alive') !== true || !view.has(by, attention) || view.amount(by, attention) < 1) return [];
            const fields = view.lawFields(id, 'conceal').filter(field => field.scope === id && !isScreen(id, field) &&
                field.params.wardKeeper === by && stableId(field.params.wardLayer));
            const first = fields.find(field => field.id === detail.first);
            const second = fields.find(field => field.id === detail.second);
            if (!first || !second || first.params.channel !== second.params.channel || wardOrder(first) === wardOrder(second)) return [];
            return [{op: 'add', holder: by, quantity: attention, amount: -1},
                {op: 'law_params', id: first.id, params: {...first.params, wardOrder: wardOrder(second)}},
                {op: 'law_params', id: second.id, params: {...second.params, wardOrder: wardOrder(first)}},
                {op: 'publish', kind: reordered, place, by, detail}];
        },
    }, {
        id: 'hold-the-gap', on: [suppress], appliesTo: holder => holder.properties[active] === true && layer in holder.quantities,
        react(view, id, {by, detail}) {
            if (detail?.target !== id || (detail.drain !== true && view.property(id, reknit) !== true) ||
                !canPress(view, id, by, detail.throughSightlines)) return [];
            const field = pressureId(id, by);
            return [...(pressuresAt(view, id).some(row => row.id === field) ? [{op: 'law_remove', id: field}] : []),
                {op: 'law_add', field: {id: field, scope: id, kind: pressure,
                    params: {source: by, ...(detail.drain === true && {drain: true, force: detail.force}),
                        ...(detail.throughSightlines === true && {throughSightlines: true}),
                        ...(detail.route !== undefined && {route: detail.route})}, until: view.clock + pressureMinutes}}];
        },
    }, {
        id: 'severed-screen', on: ['effect.end'], appliesTo: holder => holder.properties[active] === true && layer in holder.quantities,
        react(view, id, {detail}) {
            if (detail?.target !== id || !screenAddress(id, detail.ended)) return [];
            return [{op: 'set', holder: id, quantity: layer, amount: 0}, {op: 'property', holder: id, property: reknit, value: true}];
        },
    }, {
        id: 'investigation', on: [probe], appliesTo: holder => holder.kind === 'body',
        react(view, id, {by, place, detail}) {
            if (detail?.target !== id || view.placeOf(id) !== place) return [];
            const {channel, force} = detail;
            const origin = view.placeOf(by);
            if (!positiveForce(force) || !origin || by === id ||
                !view.property(by, 'senses')?.includes(channel)) return [];
            if (origin === place && detail.route !== undefined) return [];
            const approach = origin === place ? null : detail.throughSightlines && channel === concealedChannel &&
                probeApproach(view, origin, place, force - 1, detail.route);
            if (origin !== place && !approach) return [];
            const entry = approach?.route.at(-1);
            const fields = view.lawFields(id, 'conceal');
            if ((view.property(id, 'concealed') ?? []).includes(channel)) return [];
            const outer = outerWards(id, channel, fields)
                .sort((left, right) => approachOrder(right, entry) - approachOrder(left, entry));
            const observations = [];
            let remaining = force - (approach?.cost ?? 0);
            for (const field of outer) {
                const {wardLayer, probeLoss} = field.params;
                if (field.scope === id && stableId(wardLayer)) observations.push({field: field.id, layer: wardLayer});
                if (!positiveForce(probeLoss) || remaining <= probeLoss) return rememberWards(by, view.properties(by), id, observations);
                remaining -= probeLoss;
            }
            const ownScreen = fields.find(field => isScreen(id, field));
            const charge = channel === concealedChannel && ownScreen && view.property(id, active) && view.has(id, layer) ? view.amount(id, layer) : 0;
            const detected = detectGuApproach({senses: {[channel]: {reach: remaining}},
                concealment: [{channel, magnitude: charge}]});
            if (charge && remaining < charge) observations.push({field: ownScreen.id});
            return [
                ...rememberWards(by, view.properties(by), id, observations),
                ...(charge ? [{op: 'add', holder: id, quantity: layer, amount: -Math.min(charge, remaining)}] : []),
                ...(charge && remaining >= charge
                    ? [{op: 'law_remove', id: ownScreen.id}] : []),
                ...(detected ? [{op: 'publish', kind: presence, place, by, detail: {target: id, channel, presence: true}}] : []),
            ];
        },
    }],
};
