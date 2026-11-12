// The Village shepherd funds one bread order. The meadow owner publishes
// purse and stock deltas atomically with construct and parcel custody.
import {check, natural, sameStructural} from './basics.js';
import {applyLayer, defineLayer} from './creature_layers.js';
import {acquireCreature, restoreCreatureLifecycle, settleCohortStock, transferCreature} from './creature_lifecycle.js';
import {measureCreatureCapability, planCreatureMethod} from './creature_methods.js';

export const COURIER = Object.freeze({hire: 8, fee: 6, minutes: 8, loaves: 2});
const cloth = JSON.stringify({id: 'Wool cloth'});
const bread = JSON.stringify({id: 'Stale bread'});
const law = 'village.courier.v1';
const species = 'reed-construct';
const habitat = id => ({id, capacity: 1, supportedSpecies: [species]});
const bench = habitat('village.courier_bench');
const trail = habitat('village.courier_trail');
const gate = habitat('village.shepherd_gate');
const cargo = {kind: 'cargo', id: 'shepherd.bread', key: bread, count: COURIER.loaves, grams: 600};
const route = {kind: 'route', id: 'shepherd.gate', minutes: COURIER.minutes};
const frame = {carry: 300, capacity: {attachment: 1}};
const sling = defineLayer({id: 'cloth-sling', uses: {attachment: 1},
    changes: [{path: 'carry', op: 'add', value: 450}]});
const carry = {id: 'travel.carry', unit: 'grams', combine: 'sum'};

function capacity(installed) {
    const body = installed ? applyLayer(frame, sling) : frame;
    const sources = [{source: 'body.frame', unit: carry.unit, value: frame.carry}];
    if (installed) sources.push({source: 'layer.sling', unit: carry.unit, value: body.carry - frame.carry});
    return measureCreatureCapability(carry, sources);
}

const operations = {
    'fit-sling': {roles: {carrier: 'creature', fabric: 'material'}, resolve({bound, facts}) {
        if (facts.installed) return {ok: false, reason: 'The construct already has a sling.'};
        if (bound.fabric.count < 1) return {ok: false, reason: 'Bring one Wool cloth to make the sling.'};
        return {ok: true, facts: {installed: true},
            effects: [{key: bound.fabric.key, amount: -1}]};
    }},
    dispatch: {roles: {carrier: 'creature', parcel: 'cargo', route: 'route'}, resolve({bound, facts}) {
        if (bound.parcel.count < COURIER.loaves) return {ok: false, reason: 'Pack two Stale bread for the shepherd.'};
        if (bound.parcel.grams > capacity(facts.installed).value)
            return {ok: false, reason: 'The bread is too heavy for the bare frame. Fit a sling first.'};
        return {ok: true, facts: {minutes: bound.route.minutes},
            effects: [{key: bound.parcel.key, amount: -COURIER.loaves}]};
    }},
};

function enroll(clock) {
    const stock = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: species, species, habitat: bench, delta: 1});
    const result = acquireCreature(stock, {revision: stock.revision, cohortId: species,
        destination: bench, keeper: 'player', clock});
    return {id: result.id, lifecycle: result.state, sling: null, order: {status: 'open', fee: COURIER.fee}};
}

function move(state, habitat, clock) {
    return transferCreature(state.lifecycle, {revision: state.lifecycle.revision, id: state.id,
        fromKeeper: 'player', toKeeper: 'player', destination: habitat, clock});
}

export function validateMeadowCourier(state, clock) {
    const life = restoreCreatureLifecycle(state.lifecycle);
    const carrier = life.individuals[state.id];
    const order = state.order;
    check(carrier?.species === species && carrier.keeper === 'player' && carrier.health.lastAt <= clock &&
        Object.keys(life.individuals).length === 1 && (state.sling === null || state.sling === cloth) &&
        ['open', 'en_route', 'delivered'].includes(order?.status), 'Invalid meadow courier.');
    if (order.status === 'open') {
        check(carrier.habitat === bench.id && order.fee === COURIER.fee && order.parcel === undefined &&
            order.receipt === undefined && state.recipientStock === undefined && order.dueAt === undefined, 'Invalid open courier order.');
    } else {
        check(state.sling === cloth && natural(order.departedAt) && order.departedAt <= clock &&
            natural(order.dueAt) && order.dueAt === order.departedAt + COURIER.minutes, 'Invalid courier timing.');
        const parcel = {key: bread, count: COURIER.loaves};
        if (order.status === 'en_route') {
            check(carrier.habitat === trail.id && order.fee === COURIER.fee &&
                sameStructural(order.parcel, parcel) && order.receipt === undefined && state.recipientStock === undefined, 'Invalid courier parcel.');
        } else {
            check(carrier.habitat === gate.id && order.fee === 0 && order.parcel === undefined &&
                natural(order.receipt?.at) && order.receipt.at >= order.dueAt && order.receipt.at <= clock &&
                order.receipt.recipient === route.id && sameStructural(state.recipientStock, {[bread]: COURIER.loaves}),
            'Invalid courier receipt.');
        }
    }
    return state;
}

export function planMeadowCourier(state, action, {clock, inventory}) {
    if (action === 'hire_courier') {
        check(!state, 'You already have a reed construct.');
        return {state: enroll(clock), cost: COURIER.hire, items: []};
    }
    check(state, 'Hire the reed construct first.');
    const {order} = state;
    if (action === 'recall_courier') {
        check(order.status === 'en_route' && clock < order.dueAt, 'The construct is already at the gate.');
        return {state: {...state, lifecycle: move(state, bench, clock), order: {status: 'open', fee: order.fee}},
            cost: 0, items: [{key: order.parcel.key, amount: order.parcel.count}]};
    }
    if (action === 'receive_courier') {
        check(order.status === 'en_route' && clock >= order.dueAt, 'Wait for the construct to reach the shepherd’s gate.');
        return {state: {...state, lifecycle: move(state, gate, clock), order: {
            status: 'delivered', fee: 0, departedAt: order.departedAt, dueAt: order.dueAt,
            receipt: {at: clock, recipient: route.id},
        }, recipientStock: {[order.parcel.key]: order.parcel.count}}, cost: -order.fee, items: []};
    }

    check(order.status === 'open', 'Finish the delivery first.');
    const fitting = action === 'fit_courier';
    check(fitting || action === 'dispatch_courier', 'Unknown courier action.');
    const op = fitting ? 'fit-sling' : 'dispatch';
    const steps = [{op, bindings: fitting ? {carrier: 'carrier', fabric: 'cloth'} :
        {carrier: 'carrier', parcel: 'bread', route: 'route'}}];
    const result = planCreatureMethod({id: op, revision: 1, law, steps}, {law, operations,
        facts: {installed: state.sling !== null}, bindings: {
            carrier: {kind: 'creature', id: state.id},
            cloth: {kind: 'material', id: 'wool-cloth', key: cloth, count: inventory[cloth] ?? 0},
            bread: {...cargo, count: inventory[bread] ?? 0}, route,
        }});
    check(result.ok, result.reason);
    if (fitting) return {state: {...state, sling: cloth}, cost: 0, items: result.effects};

    const dueAt = clock + result.facts.minutes;
    check(natural(dueAt), 'The delivery time is out of range.');
    return {state: {...state, lifecycle: move(state, trail, clock), order: {
        status: 'en_route', fee: order.fee, departedAt: clock, dueAt, parcel: {key: bread, count: COURIER.loaves},
    }}, cost: 0, items: result.effects};
}
