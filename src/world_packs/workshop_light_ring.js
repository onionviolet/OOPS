// ENF3. A stored working lights a worksite by word or by an ambient-light check.
import {applyEngineOps, fireEngineStored, startEngineWorking, storeEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {rechargeStored, renewStored} from '../stored_working.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {linkDistance, quantityDef, resolveRef, worldLinks} from '../world_substrate.js';

export const WORKSHOP_LIGHT = 'light:workshop';
export const RING_REPAIR_STOCK = 'stock:workshop_ring_repair';
export const RING_RECALL_INK = 'stock:workshop_ring_recall_ink';
const word = 'glow';
const glowKind = 'workshop.ring_glow';
const lender = 'workshop.light_ring_lender';
const loanTerm = 'workshop.light_ring_loan';
const recallTerm = 'workshop.light_ring_recall';
export const lightRingShared = {properties: [
    {id: lender, type: 'label'}, {id: loanTerm, type: 'label'}, {id: recallTerm, type: 'label'},
]};
export const lightRingWorkingPorts = {readThing(ref, _at, world) {
    if (ref.kind === 'light_ring' && resolveRef(world, ref))
        return {links: worldLinks(world)};
    return null;
}};
const heldRing = (world, ring, bearer) => {
    const item = world.holders[ring], body = world.holders[bearer];
    return item?.kind === 'thing' && item.as.includes('light_ring') && body?.kind === 'body' &&
        item.properties['workshop.held_by'] === bearer && item.place === body.place;
};
const workingRing = (engine, ring, except) => Object.values(engine.records.stored).some(record =>
    record.id !== except && record.lightRing && record.carrier === ring && ['armed', 'dormant'].includes(record.status));

// The stored owner calls this on each word pulse, using the world left by
// earlier workings at the same minute.
export const lightRingStoredPorts = {stimuli: lightRingStimuli};

function lightRingStimuli(world, record) {
    const watch = record.lightRing && record.effectiveLightWatch;
    if (!watch) return [];
    const bearer = world.holders[record.carrier]?.properties['workshop.held_by'];
    const {field, minutes} = record.effects[0].details;
    const light = workshopLightAt(world, watch.destination);
    if (!heldRing(world, record.carrier, bearer) || light === undefined || light > watch.darkAt ||
        world.laws.some(law => law.id === field) || !Number.isSafeInteger(world.clock + minutes)) return [];
    return [{kind: 'word', word: record.trigger.word, by: bearer}];
}

export function bindLightRing(engine, {id, ring, bearer, charge, grade, minutes, portable = false,
    command = word, destination, linkRange = 1, distanceCharge = 0, recharge, renew, darkAt, watchEffectiveLight = false}) {
    if (!heldRing(engine.world, ring, bearer) || !Number.isSafeInteger(charge) || charge < 1 ||
        !Number.isSafeInteger(grade) || grade < 1 || grade > WORLD_QUANTITIES.light.max)
        throw Error('Bind a held ring with a light grade and stored charge.');
    const item = engine.world.holders[ring];
    if (item.properties.broken || item.properties.lost) throw Error('Bind a sound ring.');
    if (minutes !== undefined && (!Number.isSafeInteger(minutes) || minutes < 1))
        throw Error('A timed glow needs a positive number of minutes.');
    if (portable && minutes === undefined) throw Error('A portable glow needs a duration.');
    if (recharge !== undefined && (typeof recharge?.quantity !== 'string' ||
        !quantityDef(engine.rules, recharge.quantity) || !Number.isSafeInteger(recharge.rate) ||
        recharge.rate < 1 || !Number.isSafeInteger(charge * recharge.rate)))
        throw Error('Set a material price per charge.');
    if (renew !== undefined && (typeof renew?.quantity !== 'string' || !quantityDef(engine.rules, renew.quantity) ||
        !Number.isSafeInteger(renew.price) || renew.price < 1))
        throw Error('Set a material price for renewing the ring.');
    if (typeof command !== 'string' || !command.trim()) throw Error('Give the ring a spoken command.');
    if (destination !== undefined && (portable || engine.world.holders[destination]?.kind !== 'place' ||
        !Number.isSafeInteger(linkRange) || linkRange < 1 || !Number.isSafeInteger(distanceCharge) ||
        distanceCharge < 0 || distanceCharge === Number.MAX_SAFE_INTEGER))
        throw Error('Set a fixed bench, a passage range and its charge cost.');
    if (darkAt !== undefined && (!Number.isSafeInteger(darkAt) || darkAt < 0 || darkAt >= WORLD_QUANTITIES.light.max ||
        minutes === undefined || destination === undefined ||
        !Object.hasOwn(engine.world.holders[destination].quantities, WORKSHOP_LIGHT) ||
        !Number.isSafeInteger(engine.world.clock + minutes)))
        throw Error('Bind a timed glow to a bench with a measured light account.');
    if (watchEffectiveLight && (darkAt === undefined || !engine.host.ports.stored?.stimuli))
        throw Error('An effective light watch needs a threshold and a bench light reader.');
    if (workingRing(engine, ring)) throw Error('This ring already holds a light working.');
    const target = {shape: 'holder', id: destination ?? (portable ? '$carrier' : '$place')};
    const effect = minutes === undefined
        ? {sentence: {verb: 'add', object: 'light', time: 'instant'}, details: {key: 'workshop', target, amount: grade}}
        : {sentence: {verb: 'alter', object: 'law', time: 'sustained'}, details: {
            target, field: `${glowKind}.${ring}`, kind: glowKind, params: {grade}, minutes,
        }};
    // A full glow period between readings lets the previous field expire
    // before the next automatic pulse tries to write that same field.
    const trigger = darkAt === undefined || watchEffectiveLight ? {kind: 'word', word: command} :
        {kind: 'quantity', holder: destination, quantity: WORKSHOP_LIGHT, op: '<=', value: darkAt, again: 'pulse'};
    return storeEngineWorking(engine, {carrier: ring, lightRing: true, mode: destination === undefined ? 'repeating' : 'held',
        pulse: darkAt === undefined ? 1 : minutes, trigger, charge: {now: charge, max: charge, per: 1}, whenCarrierBreaks: 'quiet',
        ...(watchEffectiveLight ? {effectiveLightWatch: {destination, darkAt}} : {}),
        ...(recharge ? {recharge: {quantity: recharge.quantity, rate: recharge.rate}} : {}),
        ...(renew ? {renew: {quantity: renew.quantity, price: renew.price}} : {}),
        ...(destination === undefined ? {} : {reach: {links: {within: linkRange}, extra: distanceCharge}}),
        effects: [{...effect, sentence: {...effect.sentence, target: 'bound', carrier: 'pattern', cost: 'stored', limits: []}}],
    }, {id, by: bearer});
}

export function rechargeLightRing(engine, {id, bearer, amount, renew = false}) {
    const record = engine.records.stored[id];
    if (!record?.lightRing || !heldRing(engine.world, record.carrier, bearer))
        throw Error('Hold the ring to recharge it.');
    if (!(renew ? record.renew : record.recharge)) throw Error('This ring has no recipe for that work.');
    if (engine.world.holders[record.carrier].properties.broken)
        throw Error('Repair the ring before recharging it.');
    if (renew && workingRing(engine, record.carrier, id)) throw Error('This ring already holds a light working.');
    const maintain = renew ? renewStored : rechargeStored;
    const result = maintain({record, rules: engine.rules, world: engine.world,
        at: engine.world.clock, by: bearer, amount});
    if (record.status === 'broken' && result.record.status === 'armed') {
        result.record.watch.next = engine.world.clock + record.pulse;
        result.record.watch.seq = engine.world.seq;
    }
    return {...engine, world: result.world, records: {...engine.records,
        stored: {...engine.records.stored, [id]: result.record}}};
}

export function breakLightRing(engine, {id, bearer}) {
    const record = engine.records.stored[id];
    if (!record?.lightRing || !heldRing(engine.world, record.carrier, bearer) ||
        engine.world.holders[record.carrier].properties.lost) throw Error('Bring the ring in reach.');
    const field = record.effects[0].details.field;
    const ops = [{op: 'property', holder: record.carrier, property: 'broken', value: true}];
    if (field && engine.world.laws.some(law => law.id === field && law.kind === glowKind))
        ops.push({op: 'law_remove', id: field});
    const broken = applyEngineOps(engine, ops, 'workshop:break-light-ring');
    return record.status === 'broken' ? broken : fireEngineStored(broken, id, {stimulus: {kind: 'force', by: bearer}});
}

const repairRoles = {ring: 'light_ring', bearer: 'body'};
const handoffRoles = {ring: 'light_ring', from: 'body', to: 'body'};
const ringRoute = (links, from, to) => linkDistance(links, from, to, {kinds: ['heated-path'], maxCost: 10});
function ringCustody(ring, bearer, lenderId, term, recall) {
    return [
        {op: 'property', holder: ring.holder, property: 'workshop.held_by', value: bearer},
        {op: 'property', holder: ring.holder, property: lender, value: lenderId},
        {op: 'property', holder: ring.holder, property: loanTerm, value: term},
        {op: 'property', holder: ring.holder, property: recallTerm, value: recall ? term : null},
    ];
}

export const LIGHT_RING_HANDOFF_LAW = defineWorkingLaw({id: 'workshop.handoff_light_ring', revision: 1, operations: {
    handoff: {roles: handoffRoles, settle({bound: {ring, from, to}, options: {mode = 'gift', term, recall} = {}}) {
        if (!from.place || from.place !== to.place || from.holder === to.holder || ring.place !== from.place ||
            ring.properties['workshop.held_by'] !== from.holder || ring.properties.lost)
            return {ok: false, reason: 'Meet the recipient with the ring in your custody.'};
        const currentLender = ring.properties[lender];
        const currentTerm = ring.properties[loanTerm];
        const allowed = mode === 'return' ? currentLender === to.holder && !!term && term === currentTerm :
            !currentLender && (mode === 'gift' || mode === 'loan' && !!term);
        if (!allowed) return {ok: false, reason: 'Return the ring under its current loan terms.'};
        const effects = mode === 'gift' ? [{op: 'property', holder: ring.holder, property: 'workshop.held_by', value: to.holder}]
            : ringCustody(ring, to.holder, mode === 'loan' ? from.holder : null, mode === 'loan' ? term : null, recall);
        return {ok: true, effects};
    }},
    recall: {roles: handoffRoles, settle({bound: {ring, from, to}, options: {term, origin, destination, quoted}}) {
        const route = ringRoute(ring.links ?? [], from.place, to.place);
        if (!term || ring.properties[loanTerm] !== term || ring.properties[recallTerm] !== term ||
            ring.properties[lender] !== to.holder || ring.properties['workshop.held_by'] !== from.holder ||
            ring.properties.lost || ring.place !== origin || from.place !== origin || to.place !== destination ||
            !route || route.cost !== quoted.cost || JSON.stringify(route.route) !== JSON.stringify(quoted.route) ||
            !(to.quantities[RING_RECALL_INK] >= 1))
            return {ok: false, reason: 'The recall needs its agreed loan, ink, and an open return path.'};
        return {ok: true, observed: {path: route.route}, costs: [{payer: to.holder, quantity: RING_RECALL_INK, amount: 1}],
            effects: [{op: 'move', holder: ring.holder, to: destination}, ...ringCustody(ring, to.holder, null, null, false)]};
    }},
}});

export function startLightRingHandoff(engine, {id, ring, from, to, mode = 'gift', recall = false}) {
    const carrier = resolveRef(engine.world, {kind: handoffRoles.ring, id: ring});
    const term = mode === 'loan' ? id : engine.world.holders[carrier]?.properties[loanTerm] ?? null;
    return startRingTransfer(engine, {id, ring, from, to, op: 'handoff', minutes: 3,
        options: {mode, term, recall: mode === 'loan' && recall}});
}

export function startLightRingRecall(engine, {id, ring, from, to}) {
    const {world} = engine;
    const origin = world.holders[resolveRef(world, {kind: handoffRoles.from, id: from})]?.place;
    const destination = world.holders[resolveRef(world, {kind: handoffRoles.to, id: to})]?.place;
    const quoted = origin && destination && origin !== destination && ringRoute(worldLinks(world), origin, destination);
    if (!quoted) throw Error('Choose an open return path within ten minutes.');
    const carrier = resolveRef(world, {kind: handoffRoles.ring, id: ring});
    const term = world.holders[carrier]?.properties[loanTerm] ?? null;
    return startRingTransfer(engine, {id, ring, from, to, op: 'recall', minutes: 1 + quoted.cost,
        options: {term, origin, destination, quoted}});
}

function startRingTransfer(engine, {id, ring, from, to, op, minutes, options}) {
    return startEngineWorking(engine, {id, law: LIGHT_RING_HANDOFF_LAW,
        method: {id: LIGHT_RING_HANDOFF_LAW.id, law: LIGHT_RING_HANDOFF_LAW.ref, revision: 1, roles: handoffRoles,
            steps: [{op, minutes, options, bindings: {ring: 'ring', from: 'from', to: 'to'}}]},
        bindings: {ring: {kind: 'light_ring', id: ring}, from: {kind: 'body', id: from}, to: {kind: 'body', id: to}}});
}

export const LIGHT_RING_REPAIR_LAW = defineWorkingLaw({id: 'workshop.repair_light_ring', revision: 1, operations: {
    repair: {roles: repairRoles, settle({bound: {ring, bearer}}) {
        if (!ring.properties.broken || ring.properties.lost || !bearer.place || ring.place !== bearer.place ||
            ring.properties['workshop.held_by'] !== bearer.holder || !(bearer.quantities[RING_REPAIR_STOCK] >= 1))
            return {ok: false, reason: 'Bring a broken ring in your custody and a repair supply.'};
        return {ok: true, costs: [{payer: bearer.holder, quantity: RING_REPAIR_STOCK, amount: 1}],
            effects: [{op: 'property', holder: ring.holder, property: 'broken', value: null}]};
    }},
}});

export function startLightRingRepair(engine, {id, ring, bearer}) {
    return startEngineWorking(engine, {id, law: LIGHT_RING_REPAIR_LAW,
        method: {id: LIGHT_RING_REPAIR_LAW.id, law: LIGHT_RING_REPAIR_LAW.ref, revision: 1, roles: repairRoles,
            steps: [{op: 'repair', minutes: 3, bindings: {ring: 'ring', bearer: 'bearer'}}]},
        bindings: {ring: {kind: 'light_ring', id: ring}, bearer: {kind: 'body', id: bearer}}});
}

export function invokeLightRing(engine, {id, bearer, spoken = word}) {
    const record = engine.records.stored[id];
    if (!record?.lightRing || !heldRing(engine.world, record.carrier, bearer)) throw Error('Hold the ring to invoke its light.');
    if (record.trigger.kind !== 'word' || record.effectiveLightWatch) throw Error('This ring answers the light at its bench.');
    const {field, minutes, target} = record.effects[0].details;
    const local = target.id === '$carrier' || target.id === '$place';
    const site = engine.world.holders[local ? engine.world.holders[bearer].place : target.id];
    if (site?.quantities[WORKSHOP_LIGHT] === undefined) throw Error('The worksite needs a light account.');
    if (field && engine.world.laws.some(law => law.id === field)) throw Error('The ring’s previous glow is still active.');
    if (minutes !== undefined && !Number.isSafeInteger(engine.world.clock + minutes)) throw Error('The glow exceeds the world clock.');
    return fireEngineStored(engine, id, {stimulus: {kind: 'word', word: spoken, by: bearer}});
}

export function workshopLightAt(world, place) {
    const base = world.holders[place]?.quantities[WORKSHOP_LIGHT];
    if (base === undefined) return undefined;
    const extra = world.laws.filter(law => {
        if (law.kind !== glowKind || law.until <= world.clock) return false;
        const source = world.holders[law.scope];
        if (source?.kind === 'place') return source.id === place;
        return source?.place === place && !source.properties.broken && !source.properties.lost;
    })
        .reduce((sum, law) => sum + law.params.grade, 0);
    return Math.min(WORLD_QUANTITIES.light.max, base + extra);
}
