// PC95 / ENF18. A charged weapon inscription answers a landed contest blow
// at the next stored-working pulse. The event journal carries the target.
import {applyEngineOps, fireEngineStored, startEngineWorking, storeEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {rechargeStored, renewStored} from '../stored_working.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {wearFromUse} from '../craft_assembly.js';
import {quantityDef} from '../world_substrate.js';
import {settleCosts} from '../cost_owner.js';

const SLOT = 'workshop.strike_weapon';
const EQUIPPED_AFTER = 'workshop.strike_equipped_after';
const CUSTODIAN = 'workshop.held_by';
const ATTUNED = 'workshop.strike_attuned_to';
const RETUNED = 'workshop.strike_retuned';
export const STRIKE_REPAIR_STOCK = 'stock:workshop_strike_repair';
export const STRIKE_ATTUNEMENT_STOCK = 'stock:workshop_strike_attunement';
export const STRIKE_FUEL = 'stock:workshop_strike_fuel';
export const STRIKE_WEAR = 'workshop.strike_wear';
export const STRIKE_REFERENCE_LOAD = 'workshop.strike_reference_load';
export const STRIKE_REPAIR_MATERIAL = 'workshop.strike_repair_material';
export const STRIKE_SERVICE_YIELD = 'workshop.strike_service_yield';
export const STRIKE_SERVICE_LINEAGE = 'workshop.strike_service_lineage';
export const STRIKE_EDGE_INK = 'stock:workshop_strike_edge_ink';
const EDGE_POWER = 'workshop.strike_edge_power';

export const strikeEnchantmentShared = {properties: [
    {id: SLOT, type: 'label'},
    {id: ATTUNED, type: 'label'},
    {id: STRIKE_REPAIR_MATERIAL, type: 'label'},
    {id: STRIKE_SERVICE_YIELD, type: 'level', min: 1, max: 100},
    {id: STRIKE_SERVICE_LINEAGE, type: 'label'},
    {id: EDGE_POWER, type: 'level', min: 1, max: 100},
    {id: EQUIPPED_AFTER, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER},
    {id: 'broken', type: 'flag'}, {id: 'lost', type: 'flag'},
]};

function heldWeapon(world, weapon, bearer) {
    const item = world.holders[weapon], body = world.holders[bearer];
    return body?.kind === 'body' && item?.kind === 'thing' && item.as.includes('weapon') &&
        item.place === body.place && item.properties[CUSTODIAN] === bearer;
}

export function wornStrikeEdgePower(world, bearer) {
    const weapon = world.holders[bearer]?.properties[SLOT];
    if (!heldWeapon(world, weapon, bearer)) return 0;
    const blade = world.holders[weapon];
    if (blade.properties.broken || blade.properties.lost) return 0;
    return Math.floor((blade.properties[EDGE_POWER] ?? 0) * (blade.quantities.condition ?? 100) / 100);
}

const landedLoad = landed => (landed ?? []).reduce((load, part) =>
    load + (part.object === 'vitality' && part.verb === 'remove' && part.amount > 0 ? part.amount : 0), 0);
const bladePath = {geometry: 'direct', paths: {impact: ['blade']}};

// The workshop uses body IDs as contest entrant IDs. Wear settles with the
// physical blow, before a stored inscription can answer on its next pulse.
export const strikeWeaponWearPack = {
    id: 'workshop.strike_weapon_wear', revision: 1,
    publishes: [RETUNED],
    quantities: [WORLD_QUANTITIES.condition],
    properties: [{id: STRIKE_WEAR, type: 'level', min: 1, max: 100},
        {id: STRIKE_REFERENCE_LOAD, type: 'level', min: 1}],
    writes: ['condition', 'broken'],
    reactors: [{id: 'blade_wear', on: ['contest.blow'],
        appliesTo: weapon => weapon.kind === 'thing' && weapon.as.includes('weapon') &&
            'condition' in weapon.quantities && STRIKE_WEAR in weapon.properties,
        react(view, weapon, {detail, seq}) {
            const actor = detail?.actor;
            const body = actor && view.holder(actor);
            const condition = view.amount(weapon, 'condition');
            const load = landedLoad(detail?.landed);
            if (body?.kind !== 'body' || body.place !== view.holder(weapon).place ||
                view.property(weapon, CUSTODIAN) !== actor || view.property(actor, SLOT) !== weapon ||
                seq <= view.property(actor, EQUIPPED_AFTER) || !load ||
                !condition || view.property(weapon, 'broken') || view.property(weapon, 'lost')) return [];
            const rate = view.property(weapon, STRIKE_WEAR);
            const reference = view.property(weapon, STRIKE_REFERENCE_LOAD);
            const fatigue = reference === null ? rate :
                wearFromUse(bladePath, {blade: {capacity: reference}}, {load}, {wearPerFullLoad: rate}).blade;
            const wear = Math.min(condition, Math.ceil(fatigue));
            return [{op: 'add', holder: weapon, quantity: 'condition', amount: -wear},
                ...(wear === condition ? [{op: 'property', holder: weapon, property: 'broken', value: true}] : [])];
        }}],
};

// The workshop bout uses body holder IDs as entrant IDs. Validate both bodies
// and the weapon at release before routing the contact to the effect host.
export const strikeEnchantmentPorts = {events(world, record) {
    if (!record.strikeEnchantment) return world.chain;
    const weapon = world.holders[record.carrier];
    const bearer = weapon?.properties[CUSTODIAN], body = world.holders[bearer];
    if (!heldWeapon(world, record.carrier, bearer) || body.properties[SLOT] !== record.carrier) return [];
    if (record.attuned && weapon.properties[ATTUNED] !== bearer) return [];
    const equippedAfter = body.properties[EQUIPPED_AFTER];
    const retunedAfter = record.attuned ? world.chain.findLast(event =>
        event.kind === RETUNED && event.detail?.weapon === record.carrier)?.seq ?? 0 : 0;
    const lastDeparture = new Map();
    for (const event of world.chain) {
        if (event.kind === 'departed') lastDeparture.set(event.by, event.seq);
    }
    return world.chain.filter(event => {
        const {actor, target, landed} = event.detail ?? {};
        const foe = world.holders[target];
        return event.kind === 'contest.blow' && event.seq > equippedAfter && event.seq > retunedAfter &&
            actor === bearer && target !== bearer &&
            event.seq > (lastDeparture.get(bearer) ?? 0) && event.seq > (lastDeparture.get(target) ?? 0) &&
            event.place === weapon.place && foe?.kind === 'body' && foe.place === event.place && foe.quantities.vitality > 0 &&
            landedLoad(landed) > 0;
    }).map(event => ({...event, by: event.detail.target}));
}};

export function wearStrikeWeapon(engine, {weapon = null, bearer}) {
    if (engine.world.holders[bearer]?.kind !== 'body' || (weapon !== null && !heldWeapon(engine.world, weapon, bearer)))
        throw Error('Wear a weapon you hold.');
    return applyEngineOps(engine, [
        {op: 'property', holder: bearer, property: SLOT, value: weapon},
        {op: 'property', holder: bearer, property: EQUIPPED_AFTER, value: weapon === null ? null : engine.world.seq},
    ], 'workshop:wear-strike-weapon');
}

export function giveStrikeWeapon(engine, {weapon, from, to}) {
    const {world} = engine;
    const giver = world.holders[from], recipient = world.holders[to];
    if (from === to || !heldWeapon(world, weapon, from) || recipient?.kind !== 'body' || recipient.place !== giver.place)
        throw Error('Bring the weapon and both bearers together.');
    const ops = [{op: 'property', holder: weapon, property: CUSTODIAN, value: to}];
    if (giver.properties[SLOT] === weapon) {
        ops.push({op: 'property', holder: from, property: SLOT, value: null},
            {op: 'property', holder: from, property: EQUIPPED_AFTER, value: null});
    }
    return applyEngineOps(engine, ops, 'workshop:give-strike-weapon');
}

export function rechargeStrikeEnchantment(engine, {id, bearer, amount, renew = false}) {
    const record = engine.records.stored[id];
    if (!record?.strikeEnchantment || !heldWeapon(engine.world, record.carrier, bearer))
        throw Error('Hold the weapon to recharge its inscription.');
    if (record.draw) throw Error('Load fuel into this blade to feed its inscription.');
    if (record.status !== 'broken' && engine.world.holders[record.carrier].properties.broken)
        throw Error('Repair the broken blade before restoring its inscription.');
    if (renew && hasWorkingInscription(engine, record.carrier, id)) throw Error('This weapon already holds a strike inscription.');
    const maintain = renew ? renewStored : rechargeStored;
    const result = maintain({record, rules: engine.rules, world: engine.world, at: engine.world.clock, by: bearer, amount});
    if (record.status === 'broken' && result.record.status === 'armed') {
        result.record.watch.next = engine.world.clock + result.record.pulse;
        result.record.watch.seq = engine.world.seq;
    }
    return {...engine, world: result.world, records: {...engine.records,
        stored: {...engine.records.stored, [id]: result.record}}};
}

const hasWorkingInscription = (engine, weapon, except) => Object.values(engine.records.stored).some(record =>
    record.id !== except && record.carrier === weapon && record.strikeEnchantment && ['armed', 'dormant'].includes(record.status));

export function bindStrikeEnchantment(engine, {id, weapon, bearer, charge, per = 1, power, recharge, renew,
    bypassMarks = [], attuned = false, requiresFullPulse = false, fuelRate, reink}) {
    const item = engine.world.holders[weapon];
    if (!heldWeapon(engine.world, weapon, bearer) || item.properties.broken || item.properties.lost)
        throw Error('Hold a sound weapon to bind its inscription.');
    if (![per, power].every(value => Number.isSafeInteger(value) && value > 0))
        throw Error('The inscription needs a positive pulse and power.');
    if (fuelRate === undefined) {
        if (!Number.isSafeInteger(charge) || charge < per) throw Error('Store enough charge for a pulse.');
    } else if (!Number.isSafeInteger(fuelRate) || fuelRate < 1 || !Number.isSafeInteger(fuelRate * per) ||
        charge !== undefined || recharge !== undefined || renew !== undefined ||
        !Object.hasOwn(item.quantities, STRIKE_FUEL)) {
        throw Error('Fit a fuel reservoir and set a positive fuel rate for the pulse.');
    }
    if (!Array.isArray(bypassMarks) || bypassMarks.some(mark => typeof mark !== 'string' || !mark.trim()))
        throw Error('Use named marks to exempt a target from the inscription.');
    if (reink !== undefined && (fuelRate === undefined || !Number.isSafeInteger(reink?.price) ||
        reink.price < 1 || typeof reink.quantity !== 'string' || !quantityDef(engine.rules, reink.quantity)))
        throw Error('Set a material price for re-inking the fuel-fed pattern.');
    if (hasWorkingInscription(engine, weapon)) throw Error('This weapon already holds a strike inscription.');
    const bound = storeEngineWorking(engine, {
        carrier: weapon, strikeEnchantment: true, mode: requiresFullPulse ? 'held' : 'repeating', pulse: 1,
        trigger: {kind: 'event', event: 'contest.blow'}, watch: {seq: engine.world.seq},
        ...(fuelRate === undefined ? {charge: {now: charge, max: charge, per}, recharge, renew}
            : {draw: {from: '$carrier', quantity: STRIKE_FUEL, per, rate: fuelRate}}),
        whenCarrierBreaks: 'quiet',
        ...(bypassMarks.length ? {keys: [...new Set(bypassMarks)]} : {}),
        ...(attuned ? {attuned: true} : {}),
        ...(reink ? {reink: {price: reink.price, quantity: reink.quantity}} : {}),
        effects: [{sentence: {verb: 'remove', object: 'vitality', time: 'instant', target: 'bound', carrier: 'pattern',
            cost: 'stored', limits: []}, details: {target: {shape: 'holder', id: '$trigger'}, amount: power}}],
    }, {id, by: bearer});
    return attuned ? applyEngineOps(bound, [{op: 'property', holder: weapon, property: ATTUNED, value: bearer}],
        'workshop:bind-personal-strike-mark') : bound;
}

export function reinkFuelStrikeEnchantment(engine, {id, previous, bearer}) {
    const record = engine.records.stored[previous];
    const weapon = record?.carrier, blade = engine.world.holders[weapon];
    if (!record?.strikeEnchantment || !record.draw || !record.reink || record.status !== 'broken' ||
        !heldWeapon(engine.world, weapon, bearer) || blade.properties.broken || blade.properties.lost ||
        hasWorkingInscription(engine, weapon))
        throw Error('Bring the repaired blade with its broken fuel-fed pattern.');
    const {quantity, price} = record.reink;
    const def = quantityDef(engine.rules, quantity);
    if (!def || !((engine.world.holders[bearer].quantities[quantity] ?? def.min) - def.min >= price))
        throw Error('Bring enough material to re-ink the pattern.');
    const {draw, trigger, mode, pulse, effects, whenCarrierBreaks, reink, keys, attuned} = record;
    const bound = storeEngineWorking(engine, {carrier: weapon, strikeEnchantment: true, draw, trigger, mode, pulse,
        effects, whenCarrierBreaks, reink, keys, attuned, relaidFrom: previous, watch: {seq: engine.world.seq}}, {id, by: bearer});
    if (bound.records.stored[id].status !== 'armed') throw Error('The pattern could not take hold.');
    const paid = settleCosts({rules: engine.rules, world: bound.world, payer: bearer,
        costs: [{quantity, amount: price}], cause: `workshop:reink-strike:${id}`});
    if (paid.lines[0].status !== 'paid') throw Error('The material price could not be paid.');
    return {...bound, world: paid.world};
}

export function breakStrikeWeapon(engine, {id, bearer}) {
    const record = engine.records.stored[id];
    if (!record?.strikeEnchantment || !heldWeapon(engine.world, record.carrier, bearer))
        throw Error('Hold the weapon to work on its blade.');
    const broken = applyEngineOps(engine, [{op: 'property', holder: record.carrier, property: 'broken', value: true}],
        'workshop:break-strike-weapon');
    return record.status === 'broken' ? broken : fireEngineStored(broken, id, {stimulus: {kind: 'force', by: bearer}});
}

const repairRoles = {weapon: 'weapon', bearer: 'body'};
const materialServiceRoles = {...repairRoles, supply: 'workshop_blade_service_lot'};

function serviceBlade({bound: {weapon, bearer, supply}, options: {lot} = {}}) {
    const condition = weapon.quantities.condition;
    const payer = supply ?? bearer;
    const material = weapon.properties[STRIKE_REPAIR_MATERIAL];
    const yieldPerUnit = supply ? supply.properties[STRIKE_SERVICE_YIELD] : 100;
    const lineage = supply?.properties[STRIKE_SERVICE_LINEAGE];
    if (lot !== undefined && ((lineage ?? null) !== lot.lineage ||
        (supply?.properties[STRIKE_REPAIR_MATERIAL] ?? null) !== lot.material || (yieldPerUnit ?? null) !== lot.yield))
        return {ok: false, reason: 'The selected repair lot has changed.'};
    if (!(condition > 0 && condition < 100) || weapon.properties.broken || weapon.properties.lost ||
        !bearer.place || weapon.place !== bearer.place || weapon.properties[CUSTODIAN] !== bearer.holder ||
        !(payer.quantities[STRIKE_REPAIR_STOCK] >= 1) || (!supply && material) ||
        (supply && (new Set([weapon.holder, bearer.holder, supply.holder]).size !== 3 ||
            supply.place !== bearer.place || supply.properties[CUSTODIAN] !== bearer.holder ||
            !material || supply.properties[STRIKE_REPAIR_MATERIAL] !== material || !yieldPerUnit)))
        return {ok: false, reason: 'Bring a worn blade and suitable repair supplies in your custody.'};
    const restored = Math.min(100 - condition, yieldPerUnit);
    const effects = [{op: 'add', holder: weapon.holder, quantity: 'condition', amount: restored}];
    if (lineage && supply.quantities[STRIKE_REPAIR_STOCK] === 1)
        for (const property of [STRIKE_SERVICE_LINEAGE, STRIKE_REPAIR_MATERIAL, STRIKE_SERVICE_YIELD])
            effects.push({op: 'property', holder: supply.holder, property, value: null});
    return {ok: true, costs: [{payer: payer.holder, quantity: STRIKE_REPAIR_STOCK, amount: 1}],
        observed: {conditionBefore: condition, conditionAfter: condition + restored,
            ...(supply ? {supply: supply.holder} : {}), ...(lineage ? {lineage} : {})},
        effects};
}

export const STRIKE_REPAIR_LAW = defineWorkingLaw({id: 'workshop.repair_strike_weapon', revision: 1, operations: {
    repair: {roles: repairRoles, settle({bound: {weapon, bearer}}) {
        if (!weapon.properties.broken || weapon.properties.lost || !bearer.place || weapon.place !== bearer.place ||
            weapon.properties[CUSTODIAN] !== bearer.holder || !(bearer.quantities[STRIKE_REPAIR_STOCK] >= 1))
            return {ok: false, reason: 'Bring the broken blade and a repair supply.'};
        const condition = weapon.quantities.condition;
        return {ok: true, costs: [{payer: bearer.holder, quantity: STRIKE_REPAIR_STOCK, amount: 1}],
            effects: [{op: 'property', holder: weapon.holder, property: 'broken', value: null},
                ...(condition === undefined || condition === 100 ? [] : [
                    {op: 'add', holder: weapon.holder, quantity: 'condition', amount: 100 - condition},
                ])]};
    }},
    service: {roles: repairRoles, settle: serviceBlade},
    serviceWithMaterial: {roles: materialServiceRoles, settle: serviceBlade},
    inscribeEdge: {roles: repairRoles, settle({bound: {weapon, bearer}}) {
        if (weapon.properties[EDGE_POWER] || weapon.properties.broken || weapon.properties.lost ||
            weapon.quantities.condition === 0 || !bearer.place || weapon.place !== bearer.place ||
            weapon.properties[CUSTODIAN] !== bearer.holder || !(bearer.quantities[STRIKE_EDGE_INK] >= 1))
            return {ok: false, reason: 'Bring a sound blade in your custody and ink for the cutting mark.'};
        return {ok: true, costs: [{payer: bearer.holder, quantity: STRIKE_EDGE_INK, amount: 1}],
            effects: [{op: 'property', holder: weapon.holder, property: EDGE_POWER, value: 8}]};
    }},
    retune: {roles: repairRoles, settle({bound: {weapon, bearer}, options: {previous}}) {
        if (!previous || previous === bearer.holder || weapon.properties[ATTUNED] !== previous ||
            weapon.properties.broken || weapon.properties.lost || !bearer.place || weapon.place !== bearer.place ||
            weapon.properties[CUSTODIAN] !== bearer.holder || !(bearer.quantities[STRIKE_ATTUNEMENT_STOCK] >= 1))
            return {ok: false, reason: 'Bring the sound blade in your custody and ink to retune it.'};
        return {ok: true, costs: [{payer: bearer.holder, quantity: STRIKE_ATTUNEMENT_STOCK, amount: 1}],
            effects: [{op: 'property', holder: weapon.holder, property: ATTUNED, value: bearer.holder},
                {op: 'publish', kind: RETUNED, place: bearer.place, detail: {weapon: weapon.holder}}]};
    }},
    loadFuel: {roles: repairRoles, settle({bound: {weapon, bearer}, options: {amount, limit}}) {
        const existing = weapon.quantities[STRIKE_FUEL];
        if (weapon.properties.broken || weapon.properties.lost || !bearer.place || weapon.place !== bearer.place ||
            weapon.properties[CUSTODIAN] !== bearer.holder || !Number.isSafeInteger(amount) || amount < 1 ||
            !(amount <= limit - existing) || !(bearer.quantities[STRIKE_FUEL] >= amount))
            return {ok: false, reason: 'Bring the blade and enough fuel to fill its reservoir.'};
        return {ok: true, costs: [{payer: bearer.holder, quantity: STRIKE_FUEL, amount}],
            effects: [{op: 'add', holder: weapon.holder, quantity: STRIKE_FUEL, amount}]};
    }},
}});

export function startStrikeWeaponRepair(engine, {id, weapon, bearer}) {
    return startBladeWork(engine, {id, weapon, bearer, op: 'repair'});
}

export function startStrikeEdgeInscription(engine, {id, weapon, bearer}) {
    return startBladeWork(engine, {id, weapon, bearer, op: 'inscribeEdge'});
}

export function startStrikeWeaponService(engine, {id, weapon, bearer, supply}) {
    if (supply === undefined) return startBladeWork(engine, {id, weapon, bearer, op: 'service'});
    const properties = engine.world.holders[supply]?.properties;
    const lot = {
        lineage: properties?.[STRIKE_SERVICE_LINEAGE] ?? null,
        material: properties?.[STRIKE_REPAIR_MATERIAL] ?? null,
        yield: properties?.[STRIKE_SERVICE_YIELD] ?? null,
    };
    return startBladeWork(engine, {id, weapon, bearer, supply, op: 'serviceWithMaterial', options: {lot}});
}

export function startStrikeAttunement(engine, {id, inscription, bearer}) {
    const record = engine.records.stored[inscription];
    if (!record?.strikeEnchantment || !record.attuned || !['armed', 'dormant'].includes(record.status))
        throw Error('Retune a working personal inscription.');
    const weapon = record.carrier;
    const previous = engine.world.holders[weapon]?.properties[ATTUNED] ?? null;
    return startBladeWork(engine, {id, weapon, bearer, op: 'retune', options: {previous}});
}

export function startStrikeFuelLoading(engine, {id, inscription, bearer, amount}) {
    const record = engine.records.stored[inscription];
    if (!record?.strikeEnchantment || !record.draw || !['armed', 'dormant'].includes(record.status))
        throw Error('Load fuel into a working fuel-fed inscription.');
    return startBladeWork(engine, {id, weapon: record.carrier, bearer, op: 'loadFuel',
        options: {amount, limit: quantityDef(engine.rules, STRIKE_FUEL).max}});
}

function startBladeWork(engine, {id, weapon, bearer, supply, op, options}) {
    const roles = STRIKE_REPAIR_LAW.operations[op].roles;
    const holders = {weapon, bearer, supply};
    const entries = Object.entries(roles);
    return startEngineWorking(engine, {id, law: STRIKE_REPAIR_LAW,
        method: {id: STRIKE_REPAIR_LAW.id, law: STRIKE_REPAIR_LAW.ref, revision: 1, roles,
            steps: [{op, minutes: 3, bindings: Object.fromEntries(entries.map(([role]) => [role, role])),
                ...(options ? {options} : {})}]},
        bindings: Object.fromEntries(entries.map(([role, kind]) => [role, {kind, id: holders[role]}]))});
}
