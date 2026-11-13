// PC95 / ENF18. A worn reservoir catches one declared part of a hit.
// Stored workings own the saved charge and the effect host lands the pulse.
import {applyEngineOps, fireEngineStored, startEngineWorking, storeEngineWorking} from '../engine_world.js';
import {normalizeMix, typedHit} from '../damage_types.js';
import {resolveGuDefense} from '../gu_defense.js';
import {chargeAt, rechargeStored, renewStored} from '../stored_working.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {quantityDef} from '../world_substrate.js';
import {forecastHeatedCrossing, nextHeatExposure, stepHeatedCrossing, wornBreastplateProfile} from './fire_resistant_lining.js';
import {KNOWLEDGE_KINDS, recordsOf} from '../knowledge_record.js';
import {fitJoin} from '../craft_assembly.js';
import {landEffect} from '../effect_host.js';

const RELEASE = 'release';
const SLOT = 'workshop.worn_ward';
const ATTUNED = 'workshop.ward_attuned_to';
const PRIMED = 'workshop.ward_primed';
export const WARD_SOCKET = 'workshop.ward_socket';
const SOCKET = WARD_SOCKET;
const INSERT = 'workshop.ward_insert';
const SEATED_IN = 'workshop.ward_seated_in';
const ASSEMBLY_LENDER = 'workshop.ward_assembly_lender';
const ASSEMBLY_PASSAGE = 'workshop.ward_assembly_passage';
export const wardPassageTerms = part => ({lender: part.properties[ASSEMBLY_LENDER], connection: part.properties[ASSEMBLY_PASSAGE]});
export const wardMountIsLoose = properties => !properties[INSERT] && !properties[SEATED_IN] && !properties[ASSEMBLY_LENDER];
export const WARD_MOUNT_STRENGTH = 'workshop.ward_mount_strength';
export const WARD_MOUNT_REMAINING = 'workshop.ward_mount_remaining';
export const BALANCE_THRESHOLD = 'workshop.balance_threshold';
export const WARD_REPAIR_STOCK = 'stock:ward_rivets';
export const WARD_BINDING_STOCK = 'stock:ward_wire';
export const gearWardShared = {quantities: [WORLD_QUANTITIES.noise, WORLD_QUANTITIES.energy, WORLD_QUANTITIES.stock], properties: [
    {id: SLOT, type: 'label'}, {id: ATTUNED, type: 'label'}, {id: 'holder', type: 'label'},
    {id: 'broken', type: 'flag'}, {id: 'lost', type: 'flag'}, {id: PRIMED, type: 'flag'},
    {id: BALANCE_THRESHOLD, type: 'level', min: 1},
    {id: SOCKET, type: 'label'}, {id: INSERT, type: 'label'}, {id: SEATED_IN, type: 'label'},
    {id: ASSEMBLY_LENDER, type: 'label'}, {id: ASSEMBLY_PASSAGE, type: 'label'},
    {id: WARD_MOUNT_STRENGTH, type: 'level', min: 1},
    {id: WARD_MOUNT_REMAINING, type: 'level', min: 0},
]};

function heldCarrier(engine, carrier, bearer) {
    const item = engine.world.holders[carrier], actor = engine.world.holders[bearer];
    return item?.kind === 'thing' && actor?.kind === 'body' && item.place === actor.place && item.properties.holder === bearer;
}

export function carriesMountedWard(bearer, mount, insert) {
    return mount.holder !== insert.holder && bearer.properties[SLOT] === mount.holder &&
        mount.properties[INSERT] === insert.holder && insert.properties[SEATED_IN] === mount.holder &&
        mount.properties[ASSEMBLY_LENDER] === insert.properties[ASSEMBLY_LENDER] &&
        [mount, insert].every(part => part.place === bearer.place && part.properties.holder === bearer.holder && !part.properties.lost);
}

function wornWardCarrier(engine, wearer) {
    const mount = engine.world.holders[engine.world.holders[wearer]?.properties[SLOT]];
    if (!mount || !heldCarrier(engine, mount.id, wearer) || mount.properties.broken || mount.properties.lost ||
        mount.properties[SEATED_IN] || mount.properties[SOCKET] === 'ward-tongue') return null;
    const insert = mount.properties[INSERT];
    if (!insert) return mount.id;
    return engine.world.holders[insert]?.properties[SEATED_IN] === mount.id && heldCarrier(engine, insert, wearer) ? insert : null;
}

export function stepWardedHeatedCrossing(engine, crossing) {
    return stepHeatedCrossing(engine, crossing, {
        intercept(current, wearer, amount) {
            const carrier = wornWardCarrier(current, wearer);
            const phase = 'exposure', type = 'fire';
            const ward = carrier && Object.values(current.records.stored).find(record =>
                record.carrier === carrier && record.status === 'armed' && record.ward?.type === type && record.ward.phase === phase);
            if (!ward) return {engine: current, amount};
            const caught = catchGearHit(current, {id: ward.id, wearer, packets: [{type, phase, amount}]});
            return {engine: caught.engine, amount: caught.remainder[0].amount};
        },
        carriedGear(current, wearer) {
            const mount = current.world.holders[current.world.holders[wearer].properties[SLOT]];
            if (!mount || !heldCarrier(current, mount.id, wearer) || mount.properties.lost) return [];
            const insert = current.world.holders[mount.properties[INSERT]];
            return insert?.properties[SEATED_IN] === mount.id && heldCarrier(current, insert.id, wearer) && !insert.properties.lost
                ? [mount.id, insert.id] : [mount.id];
        },
    });
}

const socketRoles = {mount: 'thing', insert: 'thing', bearer: 'body'};
const swapRoles = {...socketRoles, replacement: 'thing'};
const wearRoles = {mount: 'thing', bearer: 'body'};
const assemblyHandoffRoles = {mount: 'thing', insert: 'thing', from: 'body', to: 'body'};
const wardJoin = {id: 'ward socket', needs: {mount: ['ward-recess'], insert: ['ward-tongue']}};
const wardFits = (mount, insert) => fitJoin(wardJoin, {
    mount: {id: mount.holder, interfaces: [mount.properties[SOCKET]]},
    insert: {id: insert.holder, interfaces: [insert.properties[SOCKET]]},
}).ok;
const socketProperty = (holder, property, value) => ({op: 'property', holder, property, value});
export const WARD_SOCKET_LAW = defineWorkingLaw({id: 'workshop.socket_ward', revision: 1, operations: {
    wear: {roles: wearRoles, settle({bound: {mount, bearer}, options: {previous}}) {
        if ((bearer.properties[SLOT] ?? null) !== previous || mount.place !== bearer.place ||
            mount.properties.holder !== bearer.holder || mount.properties.lost || mount.properties.broken ||
            mount.properties[SOCKET] === 'ward-tongue' || mount.properties[SEATED_IN])
            return {ok: false, reason: 'Bring the ward carrier and keep your current gear in place while fitting it.'};
        return {ok: true, effects: [socketProperty(bearer.holder, SLOT, mount.holder)]};
    }},
    unwear: {roles: wearRoles, settle({bound: {mount, bearer}}) {
        if (bearer.properties[SLOT] !== mount.holder || mount.place !== bearer.place || mount.properties.holder !== bearer.holder)
            return {ok: false, reason: 'You are no longer wearing that ward.'};
        return {ok: true, effects: [socketProperty(bearer.holder, SLOT, null)]};
    }},
    install: {roles: socketRoles, settle({bound: {mount, insert, bearer}}) {
        if (new Set([mount.holder, insert.holder, bearer.holder]).size !== 3 ||
            ![mount, insert].every(item => item.place === bearer.place && item.properties.holder === bearer.holder &&
                !item.properties.broken && !item.properties.lost) ||
            [mount, insert].some(item => item.properties[INSERT] || item.properties[SEATED_IN] || item.properties[ASSEMBLY_LENDER]))
            return {ok: false, reason: 'Bring an empty mount and a loose ward insert you hold.'};
        if (!wardFits(mount, insert)) return {ok: false, reason: 'The insert does not fit this socket.'};
        return {ok: true, effects: [socketProperty(mount.holder, INSERT, insert.holder),
            socketProperty(insert.holder, SEATED_IN, mount.holder)]};
    }},
    detach: {roles: socketRoles, settle({bound: {mount, insert, bearer}}) {
        if (![mount, insert].every(item => item.place === bearer.place && item.properties.holder === bearer.holder) ||
            mount.properties[INSERT] !== insert.holder || insert.properties[SEATED_IN] !== mount.holder ||
            mount.properties[ASSEMBLY_LENDER] || insert.properties[ASSEMBLY_LENDER])
            return {ok: false, reason: 'Bring your own mount with that exact insert fitted.'};
        return {ok: true, effects: [socketProperty(mount.holder, INSERT, null),
            socketProperty(insert.holder, SEATED_IN, null)]};
    }},
    swap: {roles: swapRoles, settle({bound: {mount, insert, replacement, bearer}}) {
        const parts = [mount, insert, replacement];
        if (new Set(parts.map(item => item.holder)).size !== parts.length ||
            parts.some(item => item.place !== bearer.place || item.properties.holder !== bearer.holder ||
                item.properties.lost || item.properties[ASSEMBLY_LENDER]) ||
            mount.properties.broken || replacement.properties.broken ||
            mount.properties[INSERT] !== insert.holder || insert.properties[SEATED_IN] !== mount.holder ||
            !wardMountIsLoose(replacement.properties))
            return {ok: false, reason: 'Bring your mount, its fitted insert, and a sound loose replacement.'};
        if (!wardFits(mount, replacement)) return {ok: false, reason: 'The replacement does not fit this socket.'};
        return {ok: true, observed: {mount: mount.holder, removed: insert.holder, fitted: replacement.holder}, effects: [
            socketProperty(insert.holder, SEATED_IN, null),
            socketProperty(mount.holder, INSERT, replacement.holder),
            socketProperty(replacement.holder, SEATED_IN, mount.holder),
        ]};
    }},
    giveAssembly: {roles: assemblyHandoffRoles, settle({bound: {mount, insert, from, to}, options: {mode = 'gift', connection = null}}) {
        const lender = mount.properties[ASSEMBLY_LENDER];
        const allowed = mode === 'return' ? lender === to.holder : !lender && (mode === 'gift' || mode === 'loan');
        if (!allowed || insert.properties[ASSEMBLY_LENDER] !== lender ||
            from.holder === to.holder || !from.place || to.place !== from.place ||
            mount.holder === insert.holder || mount.properties[INSERT] !== insert.holder ||
            insert.properties[SEATED_IN] !== mount.holder ||
            ![mount, insert].every(item => item.place === from.place &&
                item.properties.holder === from.holder && !item.properties.lost))
            return {ok: false, reason: 'Meet the recipient with the mount and its fitted insert.'};
        const effects = [mount, insert].flatMap(item => [
            socketProperty(item.holder, 'holder', to.holder),
            socketProperty(item.holder, ASSEMBLY_LENDER, mode === 'loan' ? from.holder : null),
            socketProperty(item.holder, ASSEMBLY_PASSAGE, mode === 'loan' ? connection : null),
        ]);
        if (from.properties[SLOT] === mount.holder) effects.push(socketProperty(from.holder, SLOT, null));
        return {ok: true, observed: {mount: mount.holder, insert: insert.holder, recipient: to.holder, mode}, effects};
    }},
}});

export function startWardWearWork(engine, {id, mount, bearer, action}) {
    if (action !== 'wear' && action !== 'unwear') throw Error('Choose to put on or remove the ward.');
    const previous = engine.world.holders[bearer]?.properties[SLOT] ?? null;
    return startEngineWorking(engine, {id, law: WARD_SOCKET_LAW,
        method: {id: WARD_SOCKET_LAW.id, law: WARD_SOCKET_LAW.ref, revision: 1, roles: wearRoles,
            steps: [{op: action, minutes: 2, options: {previous}, bindings: {mount: 'mount', bearer: 'bearer'}}]},
        bindings: {mount: {kind: 'thing', id: mount}, bearer: {kind: 'body', id: bearer}}});
}

export function startWardSocketWork(engine, {id, mount, insert, bearer, action}) {
    if (action !== 'install' && action !== 'detach') throw Error('Choose to fit or remove a ward insert.');
    return startEngineWorking(engine, {id, law: WARD_SOCKET_LAW,
        method: {id: WARD_SOCKET_LAW.id, law: WARD_SOCKET_LAW.ref, revision: 1, roles: socketRoles,
            steps: [{op: action, minutes: 3, bindings: {mount: 'mount', insert: 'insert', bearer: 'bearer'}}]},
        bindings: {mount: {kind: 'thing', id: mount}, insert: {kind: 'thing', id: insert}, bearer: {kind: 'body', id: bearer}}});
}

export function startWardInsertSwap(engine, {id, mount, insert, replacement, bearer}) {
    const holders = {mount, insert, replacement, bearer};
    return startEngineWorking(engine, {id, law: WARD_SOCKET_LAW,
        method: {id: WARD_SOCKET_LAW.id, law: WARD_SOCKET_LAW.ref, revision: 1, roles: swapRoles,
            steps: [{op: 'swap', minutes: 3, bindings: {mount: 'mount', insert: 'insert', replacement: 'replacement', bearer: 'bearer'}}]},
        bindings: Object.fromEntries(Object.entries(swapRoles).map(([role, kind]) =>
            [role, {kind, id: holders[role]}]))});
}

export function startWardAssemblyHandoff(engine, {id, mount, insert, from, to, mode = 'gift', connection = null}) {
    const holders = {mount, insert, from, to};
    return startEngineWorking(engine, {id, law: WARD_SOCKET_LAW,
        method: {id: WARD_SOCKET_LAW.id, law: WARD_SOCKET_LAW.ref, revision: 1, roles: assemblyHandoffRoles,
            steps: [{op: 'giveAssembly', minutes: 3, options: {mode, connection}, bindings: {mount: 'mount', insert: 'insert', from: 'from', to: 'to'}}]},
        bindings: Object.fromEntries(Object.entries(assemblyHandoffRoles).map(([role, kind]) =>
            [role, {kind, id: holders[role]}]))});
}

const chargeAppraisalPrefix = id => `workshop.ward-charge.${id}:`;

export function appraiseWardCharge(engine, {id, observer}) {
    const record = engine.records.stored[id];
    const carrier = record && engine.world.holders[record.carrier];
    const body = engine.world.holders[observer];
    if (!record?.ward || !carrier?.place || body?.kind !== 'body' || body.place !== carrier.place)
        throw Error('Inspect a ward carrier within reach.');
    const {clock: at} = engine.world;
    const mount = engine.world.holders[carrier.properties[SEATED_IN]];
    const strength = mount?.properties[WARD_MOUNT_STRENGTH];
    const conversion = record.ward.conversion;
    const maximum = conversion && (record.ward.reservoirCapacity ?? quantityDef(engine.rules, conversion).max);
    const snapshot = {anchor: record.anchor,
        charge: {now: record.charge.now, per: record.charge.per}, decay: record.decay ?? null,
        status: record.status, type: record.ward.type, phase: record.ward.phase,
        exposure: {mount: mount?.id ?? null, strength: mount?.properties[WARD_MOUNT_REMAINING] ?? strength ?? null,
            room: conversion ? Math.max(0, maximum - carrier.quantities[conversion]) : null,
            eligible: !carrier.properties.broken && !carrier.properties.lost &&
                (!record.ward.attuned || carrier.properties[ATTUNED] === observer)}};
    return applyEngineOps(engine, [{op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: body.place, by: observer,
        detail: {owner: 'N', knowledge: {to: observer, record: {
            id: `${chargeAppraisalPrefix(id)}${engine.world.seq}`, subject: {kind: 'fact', id},
            true: {holder: carrier.id, property: 'workshop.ward_charge_observation'}, believed: {value: JSON.stringify(snapshot)},
            source: {kind: 'observation', by: observer, from: carrier.id, at},
        }}}}], 'workshop:appraise-ward-charge');
}

function observedWard(world, id, observer) {
    const prefix = chargeAppraisalPrefix(id);
    const appraisal = Object.values(recordsOf(world, observer))
        .filter(record => record.id.startsWith(prefix) && record.subject.id === id && record.source.kind === 'observation')
        .sort((a, b) => Number(b.id.slice(prefix.length)) - Number(a.id.slice(prefix.length)))[0];
    if (!appraisal) return null;
    let snapshot;
    try {
        snapshot = JSON.parse(appraisal.believed.value);
    } catch {
        return null;
    }
    if (!Number.isSafeInteger(snapshot?.anchor) || snapshot.anchor < 0 || snapshot.anchor > appraisal.source.at ||
        !Number.isSafeInteger(snapshot.charge?.now) || snapshot.charge.now < 0 ||
        !Number.isSafeInteger(snapshot.charge?.per) || snapshot.charge.per < 1 ||
        (snapshot.decay && (!Number.isSafeInteger(snapshot.decay.every) || snapshot.decay.every < 1 ||
            !Number.isSafeInteger(snapshot.decay.amount) || snapshot.decay.amount < 0))) return null;
    return {snapshot, observedAt: appraisal.source.at};
}

export function forecastWardCharge(world, {id, observer, at, type, phase}) {
    const observed = observedWard(world, id, observer);
    if (!observed || !Number.isSafeInteger(at) || at < world.clock || at < observed.observedAt) return {known: false};
    const {snapshot, observedAt} = observed;
    const remaining = chargeAt(snapshot, at);
    return {known: true, observedAt, remaining,
        canPay: snapshot.status === 'armed' && remaining >= snapshot.charge.per && type === snapshot.type && phase === snapshot.phase};
}

export function forecastWardedHeatedCrossing(engine, {wearer, link, id}) {
    const route = forecastHeatedCrossing(engine, {wearer, link, includeHeatRate: true});
    const observed = observedWard(engine.world, id, wearer);
    const carrier = engine.world.holders[wornWardCarrier(engine, wearer)];
    const mount = carrier?.properties[SEATED_IN] ?? null;
    const start = engine.world.clock;
    if (!route.known || route.minutes > 10_000 || !Number.isSafeInteger(start + route.minutes) ||
        !observed || observed.observedAt > start || !carrier ||
        engine.records.stored[id]?.carrier !== carrier.id || observed.snapshot.exposure?.mount !== mount)
        return {known: false};
    const {snapshot, observedAt} = observed;
    let {strength, room} = snapshot.exposure;
    if (![strength, room].every(value => value === null || (Number.isSafeInteger(value) && value >= 0))) return {known: false};
    const active = snapshot.exposure.eligible === true && snapshot.status === 'armed' &&
        snapshot.type === 'fire' && snapshot.phase === 'exposure';
    const vitality = engine.world.holders[wearer].quantities.vitality;
    if (!(vitality > 0)) return {known: false};
    let exposure = 0, damage = 0, spent = 0, elapsed = 0;
    for (; elapsed < route.minutes && damage < vitality; elapsed += 1) {
        const at = start + elapsed + 1;
        const {total, amount} = nextHeatExposure(exposure, route.heatPerMinute);
        exposure = total;
        let absorbed = 0;
        if (active && strength !== 0 && chargeAt(snapshot, at) - spent >= snapshot.charge.per) {
            absorbed = Math.min(amount, snapshot.charge.per, room ?? Infinity);
            if (absorbed) {
                spent += snapshot.charge.per;
                if (room !== null) room -= absorbed;
                if (strength !== null) strength = Math.max(0, strength - absorbed);
            }
        }
        damage = Math.min(vitality, damage + amount - absorbed);
    }
    const {heatPerMinute, ...forecast} = route;
    return {...forecast, damage, elapsed, chargeSpent: spent,
        remaining: Math.max(0, chargeAt(snapshot, start + elapsed) - spent), wardObservedAt: observedAt};
}

const repairRoles = {carrier: 'thing', bearer: 'body'};
function repairRivet(carrier, bearer, needsRepair = carrier.properties.broken) {
    if (!needsRepair || carrier.properties.lost || !bearer.place || carrier.place !== bearer.place ||
        carrier.properties.holder !== bearer.holder || !(bearer.quantities[WARD_REPAIR_STOCK] >= 1))
        return {ok: false, reason: 'Bring a damaged carrier in your custody and a replacement rivet.'};
    return {ok: true, costs: [{payer: bearer.holder, quantity: WARD_REPAIR_STOCK, amount: 1}],
        effects: [socketProperty(carrier.holder, 'broken', null)]};
}

export const WARD_REPAIR_LAW = defineWorkingLaw({id: 'workshop.repair_ward_carrier', revision: 1, operations: {
    repair: {roles: repairRoles, settle: ({bound: {carrier, bearer}}) => repairRivet(carrier, bearer)},
    repairMount: {roles: socketRoles, settle({bound: {mount, insert, bearer}}) {
        if (mount.properties[SOCKET] !== 'ward-recess' || insert.properties[SOCKET] !== 'ward-tongue' ||
            mount.properties[INSERT] !== insert.holder || insert.properties[SEATED_IN] !== mount.holder ||
            insert.place !== bearer.place || insert.properties.holder !== bearer.holder || insert.properties.lost)
            return {ok: false, reason: 'Bring the mount with its fitted ward insert to repair it.'};
        const strength = mount.properties[WARD_MOUNT_STRENGTH];
        const remaining = mount.properties[WARD_MOUNT_REMAINING] ?? strength;
        const repair = repairRivet(mount, bearer, mount.properties.broken || remaining < strength);
        if (repair.ok) repair.effects.push(socketProperty(mount.holder, WARD_MOUNT_REMAINING, null));
        return repair;
    }},
}});

export const WARD_PREPARATION_LAW = defineWorkingLaw({id: 'workshop.prepare_ward_carrier', revision: 1, operations: {
    prepare: {roles: repairRoles, settle({bound: {carrier, bearer}}) {
        if (carrier.place !== bearer.place || carrier.properties.holder !== bearer.holder || carrier.properties.broken ||
            carrier.properties.lost || carrier.properties[PRIMED] || !(bearer.quantities[WARD_BINDING_STOCK] >= 1))
            return {ok: false, reason: 'Bring an intact carrier in your custody and ward wire.'};
        return {ok: true, costs: [{payer: bearer.holder, quantity: WARD_BINDING_STOCK, amount: 1}],
            effects: [{op: 'property', holder: carrier.holder, property: PRIMED, value: true}]};
    }},
}});

export function startWardCarrierPreparation(engine, {id, carrier, bearer}) {
    if (!heldCarrier(engine, carrier, bearer)) throw Error('Hold the carrier to prepare it.');
    return startEngineWorking(engine, {id, law: WARD_PREPARATION_LAW,
        method: {id: WARD_PREPARATION_LAW.id, law: WARD_PREPARATION_LAW.ref, revision: 1, roles: repairRoles,
            steps: [{op: 'prepare', minutes: 3, bindings: {carrier: 'carrier', bearer: 'bearer'}}]},
        bindings: {carrier: {kind: 'thing', id: carrier}, bearer: {kind: 'body', id: bearer}}});
}

export function bindPreparedGearWard(engine, spec) {
    const {carrier, bearer} = spec;
    const item = engine.world.holders[carrier];
    if (!heldCarrier(engine, carrier, bearer) || !item.properties[PRIMED] || item.properties.broken || item.properties.lost)
        throw Error('Hold an intact, prepared carrier to bind its ward.');
    const bound = bindGearWard(engine, spec);
    if (bound.records.stored[spec.id].status !== 'armed') throw Error('The ward could not bind to the prepared carrier.');
    return applyEngineOps(bound, [{op: 'property', holder: carrier, property: PRIMED, value: null}], 'workshop:bind-prepared-ward');
}

export function startWardCarrierRepair(engine, {id, ward, bearer}) {
    const record = engine.records.stored[ward];
    if (!record?.ward || record.status !== 'broken' || !heldCarrier(engine, record.carrier, bearer))
        throw Error('Hold the broken ward carrier to repair it.');
    return startEngineWorking(engine, {id, law: WARD_REPAIR_LAW,
        method: {id: WARD_REPAIR_LAW.id, law: WARD_REPAIR_LAW.ref, revision: 1, roles: repairRoles,
            steps: [{op: 'repair', minutes: 3, bindings: {carrier: 'carrier', bearer: 'bearer'}}]},
        bindings: {carrier: {kind: 'thing', id: record.carrier}, bearer: {kind: 'body', id: bearer}}});
}

export function startWardMountRepair(engine, {id, mount, insert, bearer}) {
    return startEngineWorking(engine, {id, law: WARD_REPAIR_LAW,
        method: {id: WARD_REPAIR_LAW.id, law: WARD_REPAIR_LAW.ref, revision: 1, roles: socketRoles,
            steps: [{op: 'repairMount', minutes: 3, bindings: {mount: 'mount', insert: 'insert', bearer: 'bearer'}}]},
        bindings: {mount: {kind: 'thing', id: mount}, insert: {kind: 'thing', id: insert}, bearer: {kind: 'body', id: bearer}}});
}

export function breakWardCarrier(engine, {id, bearer}) {
    const record = engine.records.stored[id];
    if (!record?.ward || !heldCarrier(engine, record.carrier, bearer)) throw Error('The ward needs a carrier in reach.');
    const broken = applyEngineOps(engine, [{op: 'property', holder: record.carrier, property: 'broken', value: true}],
        'workshop:carrier-break');
    // A physical break reaches the stored working even when its ordinary trigger is a word.
    return record.status === 'broken' ? broken : fireEngineStored(broken, id, {stimulus: {kind: 'force', by: bearer}});
}

export function bindGearWard(engine, {id, carrier, bearer, type, phase, charge, per, decay, conversion, recharge, renew,
    attuned = false, reflectPercent = 0, reservoirCapacity}) {
    if (!heldCarrier(engine, carrier, bearer)) throw Error('Hold the carrier before binding its ward.');
    if (Object.values(engine.records.stored).some(record => record.carrier === carrier && record.ward &&
        !['spent', 'broken', 'lost'].includes(record.status))) throw Error('This carrier already holds a ward.');
    if (engine.world.holders[carrier].properties[ASSEMBLY_LENDER])
        throw Error('Return the borrowed ward before binding a new pattern.');
    if (!Number.isSafeInteger(per) || per <= 0 || !Number.isSafeInteger(charge) || charge < per)
        throw Error('The ward needs a finite reservoir and a positive pulse cost.');
    if (conversion && engine.world.holders[carrier].quantities[conversion] === undefined)
        throw Error('The carrier needs an account to hold intercepted force.');
    if (recharge?.fromCarrier && (!conversion || recharge.quantity !== conversion ||
        !Number.isSafeInteger(recharge.rate) || recharge.rate <= 0 || !Number.isSafeInteger(recharge.rate * charge)))
        throw Error('A ward fed by captured force needs a reserve and a positive recharge rate.');
    if (reservoirCapacity !== undefined && (!conversion || !Number.isSafeInteger(reservoirCapacity) || reservoirCapacity < 0 ||
        reservoirCapacity > quantityDef(engine.rules, conversion).max ||
        reservoirCapacity < engine.world.holders[carrier].quantities[conversion]))
        throw Error('Set a reservoir capacity that fits the carrier and its stored force.');
    if (!Number.isSafeInteger(reflectPercent) || reflectPercent < 0 || reflectPercent > 100)
        throw Error('Reflection needs a whole percentage of the intercepted hit.');
    resolveGuDefense([], [{type, phase, capacity: 1}]);
    // The release publishes an ordinary effect. The guard calculation uses the
    // amount it can catch, and conversion credits only this intercepted amount.
    const bound = storeEngineWorking(engine, {carrier, mode: 'repeating', pulse: 1, trigger: {kind: 'word', word: RELEASE},
        charge: {now: charge, max: charge, per}, decay, recharge, renew,
        ward: {type, phase, conversion, attuned, reflectPercent, reservoirCapacity},
        whenCarrierBreaks: 'quiet',
        effects: [{sentence: {verb: 'add', object: 'sound', time: 'instant', target: 'bound', carrier: 'pattern', cost: 'stored', limits: []},
            details: {target: {shape: 'holder', id: '$place'}, amount: 1}}],
    }, {id, by: bearer});
    return attuned ? attuneGearWard(bound, {id, bearer}) : bound;
}

export function attuneGearWard(engine, {id, bearer}) {
    const record = engine.records.stored[id];
    if (!record?.ward?.attuned || !heldCarrier(engine, record.carrier, bearer))
        throw Error('Hold a carrier with a personal binding to attune it.');
    if (engine.world.holders[record.carrier].properties[ASSEMBLY_LENDER])
        throw Error('Return the borrowed ward before changing its attunement.');
    return applyEngineOps(engine, [{op: 'property', holder: record.carrier, property: ATTUNED, value: bearer}], 'workshop:attune-ward');
}

export function maintainGearWard(engine, {id, bearer, amount, renew = false}) {
    const record = engine.records.stored[id];
    if (!record?.ward || !heldCarrier(engine, record.carrier, bearer)) throw Error('Hold the carrier to maintain its ward.');
    if (renew && Object.values(engine.records.stored).some(other => other.id !== id && other.carrier === record.carrier &&
        other.ward && ['armed', 'dormant'].includes(other.status))) throw Error('The carrier already holds a working ward.');
    const payer = !renew && record.recharge?.fromCarrier ? record.carrier : bearer;
    const maintain = renew ? renewStored : rechargeStored;
    const result = maintain({record, rules: engine.rules, world: engine.world, by: payer, at: engine.world.clock, amount});
    if (payer !== bearer) result.receipt.operator = bearer;
    if (record.status === 'broken' && result.record.status === 'armed') {
        result.record.watch.next = engine.world.clock + result.record.pulse;
        result.record.watch.seq = engine.world.seq;
    }
    return {...engine, world: result.world, records: {...engine.records,
        stored: {...engine.records.stored, [id]: result.record}}};
}

export function wearGearWard(engine, wearer, carrier = null) {
    if (engine.world.holders[wearer]?.kind !== 'body' || (carrier !== null && (!heldCarrier(engine, carrier, wearer) ||
        engine.world.holders[carrier].properties[SOCKET] === 'ward-tongue' || engine.world.holders[carrier].properties[SEATED_IN])))
        throw Error('Wear a ward carrier you have with you.');
    return applyEngineOps(engine, [{op: 'property', holder: wearer, property: SLOT, value: carrier}], 'workshop:wear-ward');
}

export function giveGearWard(engine, {id, from, to}) {
    const record = engine.records.stored[id];
    const giver = engine.world.holders[from], recipient = engine.world.holders[to];
    if (!record?.ward || from === to || !heldCarrier(engine, record.carrier, from) ||
        recipient?.kind !== 'body' || recipient.place !== giver.place || engine.world.holders[record.carrier].properties.lost)
        throw Error('Bring the ward carrier and both bearers together.');
    if (engine.world.holders[record.carrier].properties[SEATED_IN] || engine.world.holders[record.carrier].properties[INSERT] ||
        engine.world.holders[record.carrier].properties[ASSEMBLY_LENDER])
        throw Error('Separate the ward insert and mount before giving either away.');
    const ops = [{op: 'property', holder: record.carrier, property: 'holder', value: to}];
    if (giver.properties[SLOT] === record.carrier) ops.push({op: 'property', holder: from, property: SLOT, value: null});
    return applyEngineOps(engine, ops, 'workshop:give-ward');
}

export function catchGearHit(engine, {id, wearer, attacker, packets, reflection = false, settle = true}) {
    const record = engine.records.stored[id];
    const wornCarrier = wornWardCarrier(engine, wearer);
    const item = engine.world.holders[wornCarrier];
    const ward = record?.ward;
    if (!ward || record.carrier !== wornCarrier || !heldCarrier(engine, wornCarrier, wearer) ||
        item.properties.broken || item.properties.lost || record.status !== 'armed' ||
        (ward.attuned && item.properties[ATTUNED] !== wearer))
        return {engine, remainder: packets, absorbed: 0};
    const remaining = chargeAt(record, engine.world.clock);
    if (remaining < record.charge.per) return {engine, remainder: packets, absorbed: 0};
    const source = engine.world.holders[attacker];
    const canReflect = !reflection && source?.kind === 'body' && attacker !== wearer && source.place === item.place && source.quantities.vitality > 0;
    const percent = canReflect ? ward.reflectPercent ?? 0 : 0;
    const reflectLimit = percent ? source.quantities.vitality : 0;
    let capacity = record.charge.per;
    if (ward.conversion) {
        const maximum = ward.reservoirCapacity ?? quantityDef(engine.rules, ward.conversion).max;
        const room = Math.max(0, maximum - item.quantities[ward.conversion]);
        // Absorbed force must fit both destinations. Reflection rounds down, so
        // the reservoir must hold the rounded-up complement of the split.
        capacity = Math.min(capacity, room + reflectLimit);
        if (percent < 100) capacity = Math.min(capacity, Number(BigInt(room) * 100n / BigInt(100 - percent)));
    }
    if (!capacity) return {engine, remainder: packets, absorbed: 0};
    const {remainder, layers: [layer]} = resolveGuDefense(packets, [{id, ...ward, capacity}]);
    if (!layer.absorbed) return {engine, remainder, absorbed: 0};
    let next = fireEngineStored(engine, id, {stimulus: {kind: 'word', word: RELEASE, by: wearer}, settle});
    const receipt = next.records.stored[id].receipts.at(-1);
    if (receipt.status !== 'fired' && !receipt.cost) return {engine: next, remainder: packets, absorbed: 0};
    const mount = engine.world.holders[item.properties[SEATED_IN]];
    const strength = mount?.properties[WARD_MOUNT_STRENGTH];
    if (strength !== undefined) {
        const available = mount.properties[WARD_MOUNT_REMAINING] ?? strength;
        const left = Math.max(0, available - layer.absorbed);
        const effects = [socketProperty(mount.id, WARD_MOUNT_REMAINING, left)];
        if (left === 0) effects.push(socketProperty(mount.id, 'broken', true));
        next = applyEngineOps(next, effects, 'workshop:ward-mount-strain');
    }
    const redirected = Math.min(reflectLimit, Number(BigInt(layer.absorbed) * BigInt(percent) / 100n));
    const converted = layer.absorbed - redirected;
    if (ward.conversion && converted) next = applyEngineOps(next, [{op: 'add', holder: wornCarrier,
        quantity: ward.conversion, amount: converted}], 'workshop:redirected-impact');
    const returned = redirected ? settleReflection(next, {carrier: wornCarrier, target: attacker, ward, redirected, settle})
        : {engine: next, reflected: 0, returnAbsorbed: 0};
    return {...returned, remainder, absorbed: layer.absorbed, redirected};
}

function vitalityImpact(engine, target, amount, cause, by) {
    const effect = {sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'pattern'},
        details: {target: {shape: 'holder', id: target}, amount}};
    const options = {cause, by, keys: engine.host.effects.keys, read: engine.host.effects.read};
    const admitted = landEffect(engine.rules, engine.world, effect, {...options, previewVitality: true});
    return {effect, options, admitted: admitted.status === 'landed'};
}

function settleReflection(engine, {carrier, target, ward, redirected, settle}) {
    const source = engine.world.holders[carrier], recipient = engine.world.holders[target];
    const cause = 'workshop:redirected-impact', by = `workshop:reflected-by:${carrier}`;
    if (!source?.place || recipient?.place !== source.place || !(recipient.quantities.vitality > 0) ||
        !vitalityImpact(engine, target, redirected, cause, by).admitted)
        return {engine, reflected: 0, returnAbsorbed: 0};
    const {defenseTypes} = wornBreastplateProfile(engine.world, target);
    const {multiplier} = typedHit({[ward.type]: 1}, defenseTypes);
    const amount = Math.round(redirected * multiplier);
    const wornCarrier = wornWardCarrier(engine, target);
    const targetWard = wornCarrier && Object.values(engine.records.stored).find(record =>
        record.carrier === wornCarrier && record.ward && record.status === 'armed');
    const caught = targetWard && amount ? catchGearHit(engine, {id: targetWard.id, wearer: target, reflection: true, settle,
        packets: [{type: ward.type, phase: ward.phase, amount}]}) : null;
    const current = caught?.engine ?? engine;
    const remainder = caught?.remainder ?? [{type: ward.type, phase: ward.phase, amount}];
    const threshold = contactBalanceThreshold(current.world.holders[target], remainder);
    const result = settleBodyImpact(current, target, remainder, threshold, {cause, source: by});
    return {engine: result.engine, reflected: result.damage, returnAbsorbed: caught?.absorbed ?? 0};
}

function contactBalanceThreshold(body, packets) {
    if (body?.quantities.stamina !== undefined &&
        packets.some(packet => packet.type === 'bludgeoning' && packet.phase === 'contact'))
        return body.properties[BALANCE_THRESHOLD];
}

function settleBodyImpact(engine, wearer, packets, threshold, {cause, source}) {
    const {vitality, stamina} = engine.world.holders[wearer]?.quantities ?? {};
    if (vitality === undefined) return {engine, damage: 0};
    const damage = Math.min(vitality, packets.reduce((total, packet) => total + packet.amount, 0));
    const ops = damage ? [{op: 'add', holder: wearer, quantity: 'vitality', amount: -damage, source}] : [];
    let balance;
    if (threshold !== undefined && stamina !== undefined) {
        const impact = packets.filter(packet => packet.type === 'bludgeoning' && packet.phase === 'contact')
            .reduce((total, packet) => total + packet.amount, 0);
        const staggered = damage < vitality && impact >= threshold;
        const staminaLost = staggered ? Math.min(stamina, 3) : 0;
        balance = {impact, staggered, staminaLost};
        if (staminaLost) ops.push({op: 'add', holder: wearer, quantity: 'stamina', amount: -staminaLost, source});
    }
    return {damage, ...(balance ? {balance} : {}), engine: ops.length ? applyEngineOps(engine, ops, cause) : engine};
}

export function settleGearHit(engine, {id, wearer, attacker, packets, settle, balanceThreshold}) {
    const {vitality, stamina} = engine.world.holders[wearer]?.quantities ?? {};
    if (vitality === undefined || !Array.isArray(packets) || packets.some(p => !Number.isSafeInteger(p.amount) || p.amount < 0))
        throw Error('A ward hit needs a body and whole damage packets.');
    if (balanceThreshold !== undefined && (!Number.isSafeInteger(balanceThreshold) || balanceThreshold < 1 || stamina === undefined))
        throw Error('A balance check needs a positive impact threshold and a stamina account.');
    const hit = catchGearHit(engine, {id, wearer, attacker, packets, settle});
    return {...hit, ...settleBodyImpact(hit.engine, wearer, hit.remainder, balanceThreshold, {cause: 'workshop:ward-hit'})};
}

function protectSpellTarget(engine, {wearer, attacker, packets: incoming, amount}) {
    const body = engine.world.holders[wearer];
    if (body?.kind !== 'body' || !(body.quantities.vitality > 0)) return undefined;
    const {defenseTypes} = wornBreastplateProfile(engine.world, wearer);
    // Round each type and phase as a whole while preserving packet order for the ward.
    const totals = new Map();
    const packets = incoming.map(packet => {
        const key = `${packet.type}:${packet.phase}`;
        const previous = totals.get(key) ?? 0;
        const total = previous + packet.amount;
        totals.set(key, total);
        const {multiplier} = typedHit({[packet.type]: 1}, defenseTypes);
        return {...packet, amount: Math.round(total * multiplier) - Math.round(previous * multiplier)};
    });
    const carrier = wornWardCarrier(engine, wearer);
    const ward = carrier && Object.values(engine.records.stored).find(record =>
        record.carrier === carrier && record.ward && record.status === 'armed' &&
        packets.some(packet => packet.type === record.ward.type && packet.phase === record.ward.phase && packet.amount > 0));
    const balanceThreshold = contactBalanceThreshold(body, packets);
    if (!ward && packets.every((packet, index) => packet.amount === incoming[index].amount) && balanceThreshold === undefined)
        return undefined;
    const result = settleGearHit(engine, {id: ward?.id, wearer, attacker, settle: false, balanceThreshold,
        packets});
    if (result.damage === Math.min(body.quantities.vitality, amount) &&
        result.engine.records.stored === engine.records.stored && !result.balance?.staminaLost)
        return undefined;
    return result;
}

// The host previews vitality removal before damage. For an area hit, use its
// admitted recipients and recheck each on the world left by earlier impacts.
export function workshopSpellImpact({engine, effect, landed, cause, by}) {
    const {sentence, details} = effect;
    const {contact, target, damageType: type, damagePackets, amount} = details ?? {};
    const area = !contact && ['holders', 'present'].includes(target?.shape);
    if (landed.status !== 'landed' || contact?.held || (!area && !(contact && target?.shape === 'holder')) ||
        sentence?.verb !== 'remove' || sentence.object !== 'vitality' || sentence.time !== 'instant' ||
        !Number.isSafeInteger(amount) || amount < 1) return undefined;
    const packets = damagePackets === undefined ? [{type, amount, phase: 'contact'}] : damagePackets;
    if (!Array.isArray(packets) || !packets.length || packets.some(packet => !packet ||
        typeof packet.type !== 'string' || !normalizeMix({[packet.type]: 1}) ||
        typeof packet.phase !== 'string' || !packet.phase ||
        !Number.isSafeInteger(packet.amount) || packet.amount < 1) ||
        packets.reduce((sum, packet) => sum + packet.amount, 0) !== amount) return undefined;
    const targets = [...new Set(landed.outcomes.flatMap(outcome => outcome.applied)
        .filter(row => row.verb === 'remove' && row.object === 'vitality').map(row => row.target))];
    if (!area && targets.length !== 1) return undefined;
    let current = engine, damaged = false;
    for (const wearer of targets) {
        const direct = {...effect, details: {...details, target: {shape: 'holder', id: wearer}}};
        const options = {cause, by, keys: current.host.effects.keys, read: current.host.effects.read};
        if (area && landEffect(current.rules, current.world, direct, {...options, previewVitality: true}).status !== 'landed')
            continue;
        const result = protectSpellTarget(current, {wearer, attacker: by, packets, amount});
        if (result) {
            current = result.engine;
            damaged ||= result.damage > 0;
        } else if (area) {
            const ordinary = landEffect(current.rules, current.world, direct, options);
            current = {...current, world: ordinary.world};
            damaged ||= ordinary.status === 'landed';
        } else return undefined;
    }
    return {world: current.world, stored: current.records.stored, status: damaged ? 'landed' : 'idle',
        ...(damaged ? {} : {reason: 'The worn protection stopped the impact.'})};
}

export function releaseCapturedForce(engine, {id, wearer, target, amount}) {
    const record = engine.records.stored[id], ward = record?.ward;
    const carrier = record && engine.world.holders[record.carrier];
    const bearer = engine.world.holders[wearer], foe = engine.world.holders[target];
    const reserve = ward?.conversion && carrier?.quantities[ward.conversion];
    if (!ward || !carrier || wornWardCarrier(engine, wearer) !== record.carrier || !heldCarrier(engine, record.carrier, wearer) ||
        carrier.properties.broken || carrier.properties.lost || (ward.attuned && carrier.properties[ATTUNED] !== wearer) ||
        target === wearer || foe?.kind !== 'body' || foe.place !== bearer.place || !(foe.quantities.vitality > 0) ||
        !Number.isSafeInteger(amount) || amount <= 0 || !(reserve >= amount))
        throw Error('Release needs a ready carrier, stored force and a target in reach.');
    const cause = 'workshop:release-captured-force';
    const {effect, options, admitted} = vitalityImpact(engine, target, amount, cause, wearer);
    if (!admitted) return {damage: 0, engine};
    const spent = applyEngineOps(engine, [
        {op: 'add', holder: record.carrier, quantity: ward.conversion, amount: -amount},
    ], cause);
    const protectedHit = protectSpellTarget(spent, {wearer: target, attacker: wearer, amount,
        packets: [{type: ward.type, phase: 'contact', amount}]});
    if (protectedHit) return {damage: protectedHit.damage, engine: protectedHit.engine};
    const landed = landEffect(engine.rules, spent.world, effect, options);
    return {damage: foe.quantities.vitality - landed.world.holders[target].quantities.vitality,
        engine: {...spent, world: landed.world}};
}
