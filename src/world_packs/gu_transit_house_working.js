// PC95. The Keeper's original Transit House on common holders and costs.
// The frame owns its fittings. A landed departure carries its mounted bodies
// and booked cargo through the ordinary world movement event.
import {defineWorkingLaw} from '../kernel_working.js';
import {fitGuHouse, quoteGuHouse, settleGuHouse, transitHouseBlueprint as blueprint} from '../gu_house_assembly.js';
import {fixedTravelRoute} from '../gu_fixed_immortal_travel.js';
import {SATIETY} from '../world_substrate_packs/living_body.js';
import {boundTravelRoute, fixedTravelFuel, fixedTravelMovement} from './gu_fixed_travel_working.js';

const fittings = {operator: 'operator', frame: 'gu-house', core: 'gu', support: 'gu'};
const crossing = {...fittings, destination: 'place', impression: 'impression'};
const freight = {...crossing, cargo: 'cargo'};
const feeding = {operator: 'operator', frame: 'gu-house', component: 'gu', supply: 'supply'};
const anchorRation = {quantity: 'stock:anchor-ration', minutes: 30};
const reject = reason => ({ok: false, reason});
const set = (holder, property, value) => ({op: 'property', holder, property, value});
const mounted = (body, frame) => body.properties.gu_installed_in === frame.holder;
const ready = (body, operator) => body.place === operator.place &&
    body.properties.gu_keeper === operator.id && body.properties.gu_controller === operator.id;
const freeForFrame = (body, frame, at) => (!body.properties.gu_installed_in || mounted(body, frame)) &&
    !(body.properties.gu_furnace_job && body.properties.gu_furnace_until >= at);
const live = body => body.properties.alive === true && body.quantities.satiety > 0;

function specimen(body) {
    const p = body.properties;
    return {id: body.holder, kind: p.gu_kind, rank: p.gu_rank, holder: p.gu_keeper, alive: live(body), injured: p.injured};
}

function frameHere(operator, frame) {
    return frame.holder && frame.place === operator.place && frame.properties.gu_house_operator === operator.id;
}

function refit({bound, at}) {
    const {operator, frame, core, support} = bound;
    const p = frame.properties;
    if (!frameHere(operator, frame) || !ready(core, operator) || !ready(support, operator) ||
        !freeForFrame(core, frame, at) || !freeForFrame(support, frame, at) || support.properties.gu_installed_in ||
        (p.gu_house_core && p.gu_house_core !== core.holder) || p.gu_house_phase === 'setting') {
        return reject('The frame or an ingredient is unavailable.');
    }
    if (p.gu_house_support && p.gu_house_phase !== 'damaged') return reject('Unseat the current support first.');
    let assembly;
    try {
        assembly = fitGuHouse(blueprint, specimen(core), specimen(support), at);
    } catch (error) {
        return reject(error.message);
    }
    return {ok: true, effects: [
        set(frame.holder, 'gu_house_core', assembly.core), set(frame.holder, 'gu_house_support', assembly.support),
        set(frame.holder, 'gu_house_fitted', at), set(frame.holder, 'gu_house_phase', assembly.phase),
        set(core.holder, 'gu_installed_in', frame.holder), set(support.holder, 'gu_installed_in', frame.holder),
    ]};
}

function assemblyOf(frame) {
    const p = frame.properties;
    return {core: p.gu_house_core, support: p.gu_house_support, fittedAt: p.gu_house_fitted, phase: p.gu_house_phase};
}

function finish({bound, at, options}) {
    const {operator, frame, core, support} = bound;
    if (!frameHere(operator, frame) || !ready(core, operator) || !ready(support, operator) ||
        !mounted(core, frame) || !mounted(support, frame)) return reject('The installed components are unavailable.');
    let result;
    try {
        result = settleGuHouse(blueprint, assemblyOf(frame), specimen(core), specimen(support), at, options.rush);
    } catch (error) {
        return reject(error.message);
    }
    return {ok: true, effects: [set(frame.holder, 'gu_house_phase', result.assembly.phase),
        ...(!result.support.alive ? [{op: 'lifecycle', act: 'end', holder: support.holder}] : [])]};
}

function unseat({bound}) {
    const {operator, frame, support, core} = bound;
    const body = support ?? core;
    const role = support ? 'support' : 'core';
    const assembly = assemblyOf(frame);
    if (!frameHere(operator, frame) || assembly[role] !== body.holder || !mounted(body, frame) ||
        (core && assembly.support && assembly.phase !== 'damaged')) {
        return reject('That component cannot be unseated.');
    }
    return {ok: true, effects: [set(body.holder, 'gu_installed_in', null),
        set(frame.holder, 'gu_house_' + role, null), set(frame.holder, 'gu_house_phase', 'empty'),
        ...(core ? [set(frame.holder, 'gu_house_support', null)] : [])]};
}

function cross({bound, at}) {
    const {operator, frame, core, support, cargo} = bound;
    if (!frameHere(operator, frame) || !ready(core, operator) || !ready(support, operator) ||
        !mounted(core, frame) || !mounted(support, frame)) return reject('The installed components are unavailable.');
    if (cargo && (cargo.place !== frame.place || !mounted(cargo, frame))) return reject('Cargo is not loaded.');
    const route = fixedTravelRoute(boundTravelRoute(bound));
    if (route.reason) return reject(route.reason);
    const quote = quoteGuHouse(blueprint, assemblyOf(frame), {core: specimen(core), support: specimen(support),
        operator: operator.id, clock: at, reserve: operator.quantities[fixedTravelFuel] ?? 0, loaded: !!cargo});
    if (!quote) return reject('The fitted House cannot fund or carry this crossing.');
    return {ok: true, costs: quote.activations.filter(row => row.cost > 0)
        .map(row => ({quantity: fixedTravelFuel, payer: operator.holder, amount: row.cost})),
        effects: [set(frame.holder, 'gu_house_trip_at', at), set(frame.holder, 'gu_house_trip_to', route.destination),
            set(frame.holder, 'gu_house_rider', operator.holder),
            set(frame.holder, 'gu_house_cargo', cargo?.holder ?? null),
            fixedTravelMovement(frame.holder, route.destination)],
        observed: {core: core.holder, support: support.holder, ...(cargo && {cargo: cargo.holder})}};
}

function feed({bound: {operator, frame, component, supply}}) {
    if (!frameHere(operator, frame) || !ready(component, operator) || !mounted(component, frame) ||
        frame.properties.gu_house_support !== component.holder || supply.place !== frame.place ||
        component.properties.alive !== true || component.properties.gu_kind !== 'anchor') {
        return reject('The mounted Anchor Gu and its ration need to be within reach.');
    }
    const {quantity, minutes} = anchorRation;
    if (!(supply.quantities[quantity] >= 1)) return reject('No Anchor Gu ration is available.');
    const refill = Math.min(minutes, SATIETY.max - component.quantities.satiety);
    if (!(refill > 0)) return reject('The Anchor Gu cannot take another ration.');
    return {ok: true, costs: [{payer: supply.holder, quantity, amount: 1}],
        effects: [{op: 'add', holder: component.holder, quantity: 'satiety', amount: refill}]};
}

export const GU_TRANSIT_HOUSE_LAW = defineWorkingLaw({id: 'gu.transit-house', revision: 1, operations: {
    refit: {roles: fittings, settle: refit},
    finish: {roles: fittings, settle: finish},
    unseat: {roles: {operator: 'operator', frame: 'gu-house', support: 'gu'}, settle: unseat},
    'unseat-core': {roles: {operator: 'operator', frame: 'gu-house', core: 'gu'}, settle: unseat},
    cross: {roles: crossing, settle: cross},
    freight: {roles: freight, settle: cross},
    feed: {roles: feeding, settle: feed},
}});

export function transitHouseWorking(operation, {rush = false} = {}) {
    const roles = GU_TRANSIT_HOUSE_LAW.operations[operation]?.roles;
    if (!roles) throw Error('Unknown Transit House action.');
    const minutes = operation === 'finish' && !rush ? blueprint.minutes : 1;
    return {id: 'gu.transit-house.' + operation, revision: 1, law: GU_TRANSIT_HOUSE_LAW.ref, roles,
        steps: [{op: operation, minutes, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role])),
            ...(operation === 'finish' && {options: {rush}})}]};
}

export const guTransitHousePack = {
    id: 'g.transit-house', revision: 1,
    properties: [...['operator', 'core', 'support', 'phase', 'rider', 'cargo'].map(role => ({
        id: 'gu_house_' + role, type: 'label',
    })), {id: 'gu_house_fitted', type: 'level', min: 0}, {id: 'gu_house_trip_at', type: 'level', min: 0},
    {id: 'gu_house_trip_to', type: 'label'}],
    writes: ['gu_house_rider', 'gu_house_cargo', 'gu_house_trip_at', 'gu_house_trip_to'],
    reactors: [{
        id: 'house-passengers', on: ['arrived'], appliesTo: holder => holder.as.includes('gu-house'),
        react(view, id, event) {
            if (event.by !== id) return [];
            const trip = view.property(id, 'gu_house_trip_at') === view.clock && view.property(id, 'gu_house_trip_to') === event.place;
            const roles = trip ? ['core', 'support', 'rider', 'cargo'] : ['core', 'support'];
            const occupants = roles.map(role => ({role, holder: view.property(id, 'gu_house_' + role)}));
            const travelling = occupants.filter(({role, holder}) => holder && view.placeOf(holder) === event.detail.from &&
                (role === 'rider' || view.property(holder, 'gu_installed_in') === id)).map(({holder}) => holder);
            return [...new Set(travelling)]
                .map(holder => ({op: 'move', holder, to: event.place}))
                .concat(set(id, 'gu_house_rider', null), set(id, 'gu_house_cargo', null),
                    set(id, 'gu_house_trip_at', null), set(id, 'gu_house_trip_to', null));
        },
    }],
};
