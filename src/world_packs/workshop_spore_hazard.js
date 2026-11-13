// PC95 / ENF22. Arrival exposes a body to spores. The affliction track owns
// the saved timing, and this workshop maps a bout of sickness to lost stamina.
import {CELLAR_SPORES} from '../affliction_catalogue.js';
import {advance} from '../affliction_track.js';
import {indexFromU32} from '../gen_kit.js';
import {startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {readArrivalGearExposure} from './fire_resistant_lining.js';

const SPORES = 'workshop.spore_cloud';
export const SPORE_INTERVAL = 'workshop.spore_interval';
export const SPORE_DOSE = 'workshop.spore_dose';
export const SPORE_THRESHOLD = 'workshop.spore_threshold';
export const SPORE_CLEARANCE = 'workshop.spore_clearance_interval';
export const FILTER_CAPACITY = 'workshop.spore_filter_capacity';
const FORTITUDE = 'workshop.fortitude';
export const PURGE_CHARGE = 'stock:workshop_purge_charge';
export const PURGE_SALTS = 'stock:workshop_purge_salts';
const WORN_CHARM = 'workshop.worn_purge_charm';
const PURGE_PATTERN = 'workshop.purge_pattern';
const FILTER_PATTERN = 'workshop.spore_filter';
const FILTER_FRAME = 'workshop.spore_filter_frame';
export const FITTED_CARTRIDGE = 'workshop.spore_filter_cartridge';
const SEATED_IN = 'workshop.spore_cartridge_seated_in';
const FILTER_LENDER = 'workshop.spore_filter_lender';
const CARTRIDGE_KIND = 'workshop_spore_cartridge';
const HELD_BY = 'workshop.held_by';
const treatment = {kind: 'spore-purge', bonus: 45};
const id = 'workshop.spore_hazard';
const def = CELLAR_SPORES;
const affected = holder => holder.kind === 'body' && 'stamina' in holder.quantities;
const save = (view, wearer, phase, at) => {
    const natural = 1 + indexFromU32(view.draw([wearer, def.id, phase, at]), 20);
    return {natural, total: natural + (view.property(wearer, FORTITUDE) ?? 0)};
};

function settlePoison(view, wearer, track, state, ongoing = false) {
    const charm = view.property(wearer, WORN_CHARM);
    const carrier = charm && view.holder(charm);
    const purging = ongoing && !track.onsetPending && carrier?.as.includes('workshop_purge_charm') &&
        carrier.place === view.holder(wearer).place && view.property(charm, HELD_BY) === wearer && view.property(charm, PURGE_PATTERN) &&
        view.has(charm, PURGE_CHARGE) && view.amount(charm, PURGE_CHARGE) > 0;
    const result = advance(def, track, {at: view.clock,
        draw: current => save(view, wearer, 'stage', current.nextAt),
        treatment: purging ? treatment : null});
    const loss = result.events.flatMap(event => event.effects ?? [])
        .filter(effect => effect.condition === 'sickened').reduce((sum, effect) => sum + effect.value * 5, 0);
    return [{op: 'state', holder: wearer, value: {...state, track: result.track}},
        ...(purging ? [{op: 'add', holder: charm, quantity: PURGE_CHARGE, amount: -1}] : []),
        ...(loss ? [{op: 'add', holder: wearer, quantity: 'stamina', amount: -loss}] : [])];
}

function filterChargeHolder(view, wearer, place) {
    const charm = view.property(wearer, WORN_CHARM);
    const carrier = charm && view.holder(charm);
    if (!carrier?.as.includes('workshop_purge_charm') || carrier.place !== place ||
        view.property(charm, HELD_BY) !== wearer || !view.property(charm, FILTER_PATTERN)) return null;
    if (!view.property(charm, FILTER_FRAME)) return view.has(charm, PURGE_CHARGE) ? charm : null;
    const cartridge = view.property(charm, FITTED_CARTRIDGE);
    const part = cartridge && view.holder(cartridge);
    return part?.as.includes(CARTRIDGE_KIND) && part.place === place &&
        view.property(cartridge, HELD_BY) === wearer && view.property(cartridge, SEATED_IN) === charm &&
        view.has(cartridge, PURGE_CHARGE) ? cartridge : null;
}

function inhale(view, wearer, state) {
    const place = view.holder(wearer).place;
    const dose = view.property(place, SPORE_DOSE) ?? 1;
    const chargeHolder = filterChargeHolder(view, wearer, place);
    const absorbed = chargeHolder ? Math.min(dose, view.amount(chargeHolder, PURGE_CHARGE)) : 0;
    const remaining = dose - absorbed;
    const threshold = view.property(place, SPORE_THRESHOLD);
    const accumulated = (state.cloud === place || view.property(wearer, SPORE_CLEARANCE) ? state.dose ?? 0 : 0) + remaining;
    const reachesThreshold = remaining > 0 && (!threshold || accumulated >= threshold);
    const intake = threshold ? accumulated : remaining;
    const roll = save(view, wearer, 'exposure', view.clock);
    const [exposure] = readArrivalGearExposure(view, wearer, {via: 'inhaled', carries: ['spore cloud'],
        catalogue: [def], natural: roll.natural, total: roll.total - Math.max(0, intake - 1)});
    const saved = state.nextExposure ? [{op: 'state', holder: wearer, value: state}] : [];
    if (!exposure) return saved;
    if (threshold && remaining) state = {...state, cloud: place, dose: reachesThreshold ? 0 : accumulated};
    const settled = reachesThreshold && exposure.track ? settlePoison(view, wearer, exposure.track, state)
        : threshold && remaining ? [{op: 'state', holder: wearer, value: state}] : saved;
    return absorbed ? [...settled, {op: 'add', holder: chargeHolder, quantity: PURGE_CHARGE, amount: -absorbed}] : settled;
}

const roles = {wearer: 'body', charm: 'workshop_purge_charm'};
const refillRoles = {wearer: roles.wearer, cartridge: CARTRIDGE_KIND};
const fitRoles = {...roles, cartridge: CARTRIDGE_KIND};
const transferRoles = {...roles, recipient: 'body'};
const held = (wearer, charm) => wearer.place === charm.place && charm.properties[HELD_BY] === wearer.holder;
const property = (holder, name, value) => ({op: 'property', holder: holder.holder, property: name, value});
const inscribe = (pattern, frame = false) => ({roles, settle({bound: {wearer, charm}}) {
    if (!held(wearer, charm) || charm.properties[PURGE_PATTERN] || charm.properties[FILTER_PATTERN] ||
        charm.quantities[PURGE_CHARGE] !== 0 || !(wearer.quantities[PURGE_SALTS] >= 1))
        return {ok: false, reason: 'Bring a blank charm and salts.'};
    return {ok: true, costs: [{payer: wearer.holder, quantity: PURGE_SALTS, amount: 1}], effects: [
        property(charm, pattern, true),
        frame ? property(charm, FILTER_FRAME, true) : {
            op: 'add', holder: charm.holder, quantity: PURGE_CHARGE,
            amount: pattern === FILTER_PATTERN ? charm.properties[FILTER_CAPACITY] ?? 1 : 1},
    ]};
}});

function refit({bound: {wearer, charm, cartridge, previous}}) {
    if (charm.properties[FILTER_LENDER])
        return {ok: false, reason: 'Return the borrowed filter before changing its cartridge.'};
    if (!held(wearer, charm) || !charm.properties[FILTER_FRAME] ||
        (charm.properties[FITTED_CARTRIDGE] ?? null) !== (previous?.holder ?? null))
        return {ok: false, reason: 'Bring the filter frame with the expected cartridge.'};
    if (previous && (!held(wearer, previous) || previous.properties[SEATED_IN] !== charm.holder))
        return {ok: false, reason: 'The fitted cartridge has moved.'};
    if (cartridge && (!held(wearer, cartridge) || cartridge.properties[SEATED_IN] ||
        !Object.hasOwn(cartridge.quantities, PURGE_CHARGE)))
        return {ok: false, reason: 'Bring a loose cartridge.'};
    return {ok: true, effects: [
        property(charm, FITTED_CARTRIDGE, cartridge?.holder ?? null),
        ...(previous ? [property(previous, SEATED_IN, null)] : []),
        ...(cartridge ? [property(cartridge, SEATED_IN, charm.holder)] : []),
    ]};
}

function handoff({bound: {wearer, charm, recipient, cartridge}, options: {mode = 'gift'} = {}}) {
    if (!wearer.place || recipient.place !== wearer.place || wearer.holder === recipient.holder ||
        !held(wearer, charm) || (charm.properties[FITTED_CARTRIDGE] ?? null) !== (cartridge?.holder ?? null) ||
        (cartridge && (cartridge.holder === charm.holder || !charm.properties[FILTER_FRAME] ||
            !held(wearer, cartridge) || cartridge.properties[SEATED_IN] !== charm.holder)))
        return {ok: false, reason: 'Meet the recipient with the charm and its exact fitted cartridge.'};
    const lender = charm.properties[FILTER_LENDER];
    const allowed = mode === 'return' ? cartridge && lender === recipient.holder :
        !lender && (mode === 'gift' || (mode === 'loan' && cartridge));
    if (!allowed) return {ok: false, reason: 'Return the fitted filter to its lender.'};
    const effects = [property(charm, HELD_BY, recipient.holder),
        property(charm, FILTER_LENDER, mode === 'loan' ? wearer.holder : null)];
    if (cartridge) effects.push(property(cartridge, HELD_BY, recipient.holder));
    if (wearer.properties[WORN_CHARM] === charm.holder) effects.push(property(wearer, WORN_CHARM, null));
    return {ok: true, effects};
}

export const SPORE_CHARM_LAW = defineWorkingLaw({id: 'workshop.fit_purge_charm', revision: 1, operations: {
    inscribe: inscribe(PURGE_PATTERN),
    'inscribe-filter': inscribe(FILTER_PATTERN),
    'inscribe-frame': inscribe(FILTER_PATTERN, true),
    'fit-cartridge': {roles: fitRoles, settle: refit},
    'swap-cartridge': {roles: {...fitRoles, previous: CARTRIDGE_KIND}, settle: refit},
    'detach-cartridge': {roles: {...roles, previous: CARTRIDGE_KIND}, settle: refit},
    'give-charm': {roles: transferRoles, settle: handoff},
    'give-fitted-filter': {roles: {...transferRoles, cartridge: CARTRIDGE_KIND}, settle: handoff},
    'refill-cartridge': {roles: refillRoles, settle({bound: {wearer, cartridge}}) {
        if (!held(wearer, cartridge) || cartridge.properties[SEATED_IN] || cartridge.quantities[PURGE_CHARGE] !== 0 ||
            !(wearer.quantities[PURGE_SALTS] >= 1))
            return {ok: false, reason: 'Bring a loose empty cartridge and purge salts.'};
        return {ok: true, costs: [{payer: wearer.holder, quantity: PURGE_SALTS, amount: 1}],
            effects: [{op: 'add', holder: cartridge.holder, quantity: PURGE_CHARGE,
                amount: cartridge.properties[FILTER_CAPACITY] ?? 1}]};
    }},
    wear: {roles, settle({bound: {wearer, charm}}) {
        if (!held(wearer, charm) || !Object.hasOwn(charm.quantities, PURGE_CHARGE))
            return {ok: false, reason: 'Bring the charm you hold to fit it.'};
        return {ok: true, effects: [{op: 'property', holder: wearer.holder, property: WORN_CHARM, value: charm.holder}]};
    }},
    remove: {roles, settle({bound: {wearer, charm}}) {
        if (wearer.properties[WORN_CHARM] !== charm.holder)
            return {ok: false, reason: 'You are no longer wearing that charm.'};
        return {ok: true, effects: [{op: 'property', holder: wearer.holder, property: WORN_CHARM, value: null}]};
    }},
    recharge: {roles, settle({bound: {wearer, charm}}) {
        if (!held(wearer, charm) || charm.properties[FILTER_FRAME] ||
            !(charm.properties[PURGE_PATTERN] || charm.properties[FILTER_PATTERN]) || charm.quantities[PURGE_CHARGE] !== 0 ||
            !(wearer.quantities[PURGE_SALTS] >= 1))
            return {ok: false, reason: 'Bring an empty charm and purge salts.'};
        return {ok: true, costs: [{payer: wearer.holder, quantity: PURGE_SALTS, amount: 1}],
            effects: [{op: 'add', holder: charm.holder, quantity: PURGE_CHARGE,
                amount: charm.properties[FILTER_PATTERN] ? charm.properties[FILTER_CAPACITY] ?? 1 : 1}]};
    }},
}});

export function startSporeCharmWork(engine, {id, action, mode, ...holders}) {
    const operationRoles = SPORE_CHARM_LAW.operations[action]?.roles ?? roles;
    const entries = Object.entries(operationRoles);
    return startEngineWorking(engine, {id, law: SPORE_CHARM_LAW,
        method: {id: SPORE_CHARM_LAW.id, law: SPORE_CHARM_LAW.ref, revision: 1, roles: operationRoles,
            steps: [{op: action, minutes: 3, bindings: Object.fromEntries(entries.map(([role]) => [role, role])),
                ...(mode === undefined ? {} : {options: {mode}})}]},
        bindings: Object.fromEntries(entries.map(([role, kind]) => [role, {kind, id: holders[role]}]))});
}

export const workshopSporePack = {
    id, revision: 1,
    properties: [{id: SPORES, type: 'flag'}, {id: SPORE_INTERVAL, type: 'level', min: 1, max: 1000},
        {id: SPORE_DOSE, type: 'level', min: 1, max: 100}, {id: FILTER_CAPACITY, type: 'level', min: 1, max: 100},
        {id: SPORE_THRESHOLD, type: 'level', min: 1, max: 1000}, {id: SPORE_CLEARANCE, type: 'level', min: 1, max: 1000},
        {id: FORTITUDE, type: 'level', min: -20, max: 20},
        {id: WORN_CHARM, type: 'label'}, {id: PURGE_PATTERN, type: 'flag'}, {id: FILTER_PATTERN, type: 'flag'},
        {id: FILTER_FRAME, type: 'flag'}, {id: FITTED_CARTRIDGE, type: 'label'}, {id: SEATED_IN, type: 'label'},
        {id: FILTER_LENDER, type: 'label'}],
    writes: ['stamina', PURGE_CHARGE],
    reactors: [{id: 'inhale', on: ['arrived'], appliesTo: affected,
        react(view, wearer, event) {
            if (event.by !== wearer || event.place !== view.holder(wearer).place) return [];
            const prior = view.state(wearer);
            const spores = view.property(event.place, SPORES);
            const interval = spores && view.property(event.place, SPORE_INTERVAL);
            const clearance = view.property(wearer, SPORE_CLEARANCE);
            if (!spores && !prior?.nextExposure && !prior?.cloud) return [];
            if (spores && !interval && prior?.track && !prior.nextExposure && !prior.nextClearance) return [];
            const state = {track: prior?.track ?? null,
                ...(interval ? {nextExposure: view.clock + interval} : {}),
                ...(prior?.dose > 0 && (clearance || (spores && prior.cloud === event.place))
                    ? {cloud: prior.cloud, dose: prior.dose} : {})};
            if (clearance && state.dose && !spores)
                state.nextClearance = prior.nextClearance ?? view.clock + clearance;
            if (spores && !state.track) {
                const ops = inhale(view, wearer, state);
                if (ops.length || (!prior?.nextExposure && !prior?.cloud)) return ops;
            }
            return [{op: 'state', holder: wearer, value: state}];
        },
    }],
    laws: [{id: 'poison', appliesTo: holder => affected(holder) &&
            !!(holder.state[id]?.track || holder.state[id]?.nextExposure || holder.state[id]?.nextClearance),
        horizon(view, wearer) {
            const {track, nextExposure, nextClearance} = view.state(wearer);
            return Math.max(1, Math.min(track?.nextAt ?? Infinity, nextExposure ?? Infinity, nextClearance ?? Infinity) - view.clock);
        },
        decide(view, wearer) {
            const {track, nextExposure, nextClearance} = view.state(wearer);
            const state = {...view.state(wearer)};
            const place = view.holder(wearer).place;
            const spores = view.property(place, SPORES);
            const clearance = view.property(wearer, SPORE_CLEARANCE);
            if (nextClearance && nextClearance <= view.clock) {
                delete state.nextClearance;
                if (!spores && clearance && state.dose > 0) {
                    state.dose -= 1;
                    if (state.dose) state.nextClearance = view.clock + clearance;
                    else delete state.cloud;
                }
            }
            if (nextExposure && nextExposure <= view.clock) {
                const interval = spores && view.property(place, SPORE_INTERVAL);
                if (interval) state.nextExposure = view.clock + interval;
                else {
                    delete state.nextExposure;
                    if (!clearance) {
                        delete state.cloud;
                        delete state.dose;
                    } else if (!spores && state.dose && !state.nextClearance) state.nextClearance = view.clock + clearance;
                }
                if (interval && !track) return inhale(view, wearer, state);
            }
            if (track?.nextAt <= view.clock) return settlePoison(view, wearer, track, state, true);
            return state.nextExposure === nextExposure && state.nextClearance === nextClearance
                ? [] : [{op: 'state', holder: wearer, value: state}];
        },
    }],
};
