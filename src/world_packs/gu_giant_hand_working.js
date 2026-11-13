// PC95. Two timed beats from the revised Giant Hand procedure. The host owns
// the paid reserves and decides whether the hand can move the slab.
import {resolveGuActivation} from '../gu_activation.js';
import {resolveGuDefense} from '../gu_defense.js';
import {applyEngineOps} from '../engine_world.js';
import {landEffect} from '../effect_host.js';
import {gatherStrengthAbility, giantHandPractice, handFrom, preparedPhantomAbility, revisedPhantomAbility,
    steadyPhantomAbility} from '../gu_giant_hand.js';
import {guWorldUseReason} from '../gu_world_use.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {linkExits, worldLinks} from '../world_substrate.js';
import {clearGuRubble, GU_RUBBLE as rubble, GU_RUBBLE_EXIT} from '../gu_rubble.js';

const redDate = 'energy:immortal.red-date';
const primeval = 'energy:primeval.rank1';
const first = {operator: 'operator', core: 'gu'};
const steady = {operator: 'operator', support: 'gu'};
const supports = {operator: 'operator', left: 'gu', right: 'gu'};
const second = {...supports, slab: 'thing', rest: 'place'};
const strikeRoles = {...supports, target: 'creature'};
const impactRoles = {target: 'creature'};
const flightReach = 2;
const sweepRoles = {...supports, corridor: 'hand-corridor'};
const sweepImpactRoles = {corridor: 'hand-corridor'};
const braceRoles = {operator: 'operator', guard: 'gu'};
const handGuard = 'gu.giant-hand.brace';
const sweepForce = 'gu.giant-hand.sweep-force';
const deny = reason => ({ok: false, reason});
const phantomForce = 'gu_held_phantom_force', phantomExpiry = 'gu_held_phantom_expiry', phantomOrigin = 'gu_held_phantom_origin';
export const GIANT_HAND_PROPERTIES = [...['gu_gather_force', 'gu_gather_cost', 'gu_slab_load', phantomForce, phantomExpiry]
    .map(id => ({id, type: 'level', min: 1})), {id: phantomOrigin, type: 'label'}, {id: GU_RUBBLE_EXIT, type: 'label'}];

function usable(held, operator, kind, rank, at) {
    return held.properties.gu_kind === kind && held.properties.gu_rank === rank &&
        !guWorldUseReason(held, operator.id, operator.place, at);
}

function stage(operator, held, ability, at, supply) {
    const p = held.properties;
    return {operator: operator.id, ability, supply, gu: {id: held.holder, kind: p.gu_kind, rank: p.gu_rank,
        alive: p.alive === true, injured: p.injured, fedThrough: held.quantities.satiety > 0 ? at : at - 1}};
}

function summon({bound: {operator, core}, at}, kind, ability) {
    if (operator.properties.alive !== true || !usable(core, operator, kind, 7, at)) {
        return deny('The hand needs its living core under control.');
    }
    const supply = {pool: 'immortal', family: 'immortal', rank: 7, source: 'stored'};
    const result = resolveGuActivation({stages: [stage(operator, core, ability, at, supply)], day: at,
        reserves: {[operator.id]: {immortal: operator.quantities[redDate] ?? 0}}});
    if (result.outcome !== 'complete') return deny(result.reason);
    return {ok: true, facts: {phantoms: result.effects[0], origin: operator.place},
        costs: [{quantity: redDate, payer: operator.holder, amount: result.activations[0].cost}]};
}

function formHand({bound: {operator, left, right}, facts, at}) {
    if (!facts.phantoms || operator.properties.alive !== true || operator.place !== facts.origin || left.holder === right.holder ||
        ![left, right].every(gu => usable(gu, operator, 'group-strength', 1, at))) {
        return deny('The hand needs two distinct supports and its phantoms within reach.');
    }
    const stages = [left, right].map(gu => stage(operator, gu,
        gatherStrengthAbility(gu.properties.gu_gather_cost, gu.properties.gu_gather_force), at));
    const result = resolveGuActivation({beats: [{stages}], day: at,
        reserves: {[operator.id]: {primeval: operator.quantities[primeval] ?? 0}}});
    if (result.outcome !== 'complete') return deny(result.reason);
    const force = handFrom([facts.phantoms, ...result.effects]).magnitude;
    const costs = result.activations.map(row => ({quantity: primeval, payer: operator.holder, amount: row.cost}));
    return {ok: true, costs, observed: {force}};
}

function gather(context) {
    const {operator, slab, rest} = context.bound;
    if (operator.place !== slab.place || slab.place === rest.holder || !slab.properties.gu_slab_load) {
        return deny('The slab must be within reach of the hand.');
    }
    const hand = formHand(context);
    if (!hand.ok) return hand;
    const {force} = hand.observed;
    const enough = force >= slab.properties.gu_slab_load;
    return {...hand, observed: {force, enough}, effects: enough ? [{
        sentence: {verb: 'move', object: 'position', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
        details: {target: {shape: 'holder', id: slab.holder}, to: rest.holder},
    }] : []};
}

const phantomProperties = (operator, values) => [phantomForce, phantomExpiry, phantomOrigin].map((property, index) =>
    ({op: 'property', holder: operator.holder, property, value: values[index] ?? null}));

function handImpact(target, force, contact, forceField) {
    return {
        sentence: {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
        details: {target: {shape: 'holder', id: target.holder}, amount: force, damageType: 'bludgeoning', guImpact: 'giant-hand',
            ...(contact && {contact}), ...(forceField && {forceField})},
    };
}

const canStrike = (operator, target) => operator.holder !== target.holder && !!operator.place && !!target.place &&
    target.properties.alive === true && target.quantities.vitality > 0;

export function readGiantHandCorridor(ref, _at, world) {
    if (ref.kind !== 'hand-corridor' || world.holders[ref.id]?.kind !== 'place') return null;
    const occupants = Object.values(world.holders).filter(holder => holder.as.includes('creature') &&
        holder.properties.alive === true && holder.quantities.vitality > 0);
    const debris = Object.fromEntries(Object.values(world.holders).filter(holder => holder.kind === 'place' && holder.quantities[rubble] > 0)
        .map(holder => [holder.id, {amount: holder.quantities[rubble], exitId: holder.properties[GU_RUBBLE_EXIT] ?? null}]));
    return {destination: ref.id, links: worldLinks(world), debris,
        forceFields: world.laws.filter(field => field.kind === sweepForce && field.scope === ref.id),
        occupants: occupants.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
        .map(({id, place}) => ({holder: id, place}))};
}

function sweepPath(links, origin, route) {
    const places = [];
    const visited = new Set([origin]);
    let here = origin;
    let remaining = flightReach;
    for (const id of route) {
        const exit = linkExits(links, here, {kinds: ['sightline']}).find(row => row.link === id);
        if (!exit || exit.cost > remaining || visited.has(exit.to)) break;
        here = exit.to;
        visited.add(here);
        places.push(here);
        remaining -= exit.cost;
    }
    return places;
}

function sweepContacts(corridor, place, caster, seen = []) {
    return corridor.occupants.filter(target => target.place === place && target.holder !== caster && !seen.includes(target.holder));
}

export function landGiantHandImpact({engine, effect, landed, cause, by}) {
    if (effect.details?.guImpact !== 'giant-hand') return undefined;
    const target = landed.outcomes[0]?.applied[0]?.target;
    const fields = engine.world.laws.filter(field => field.kind === handGuard && field.scope === target &&
        Number.isSafeInteger(field.params.capacity) && field.params.capacity > 0);
    const forceField = effect.details.forceField && engine.world.laws.find(field =>
        field.id === effect.details.forceField && field.kind === sweepForce);
    if (!fields.length && !forceField) return undefined;
    const incoming = forceField?.params.amount ?? effect.details.amount;
    if (incoming === 0) return {...landed, world: engine.world, status: 'idle', changed: false, outcomes: [], reason: 'The sweep has spent its force.'};
    const type = 'bludgeoning';
    const {remainder, layers} = resolveGuDefense([{type, amount: incoming}], fields.map(field =>
        ({id: field.id, type, capacity: field.params.capacity, breaks: true})));
    const ops = layers.filter(layer => layer.absorbed > 0).map(layer => layer.broken
        ? {op: 'law_remove', id: layer.id}
        : {op: 'law_params', id: layer.id, params: {capacity: fields.find(field => field.id === layer.id).params.capacity - layer.absorbed}});
    const amount = remainder[0].amount;
    if (forceField && amount !== incoming) ops.push({op: 'law_params', id: forceField.id, params: {amount}});
    const {world} = applyEngineOps(engine, ops, cause);
    if (!amount) return {...landed, world, reason: 'The brace absorbed the hit.'};
    return landEffect(engine.rules, world, {...effect, details: {...effect.details, amount}},
        {cause, by, keys: engine.host.effects.keys, read: engine.host.effects.read});
}

export const GU_GIANT_HAND_LAW = defineWorkingLaw({id: 'gu.revised-giant-hand', revision: 1, operations: {
    summon: {roles: first, minutes: 1, settle: context => summon(context, 'myriad-self', revisedPhantomAbility)},
    gather: {roles: second, minutes: 1, settle: gather},
    brace: {roles: braceRoles, minutes: 1, settle({bound: {operator, guard}, at, address}) {
        if (operator.properties.alive !== true || !usable(guard, operator, 'white-jade', 1, at)) {
            return deny('Bracing needs a controlled White Jade Gu.');
        }
        const result = resolveGuActivation({stages: [stage(operator, guard, {fuel: 'primeval', cost: 1}, at)], day: at,
            reserves: {[operator.id]: {primeval: operator.quantities[primeval] ?? 0}}});
        if (result.outcome !== 'complete') return deny(result.reason);
        return {ok: true, costs: [{quantity: primeval, payer: operator.holder, amount: result.activations[0].cost}],
            effects: [{op: 'law_add', field: {id: address.replaceAll('/', '.'), kind: handGuard, scope: operator.holder,
                params: {capacity: 3}, until: at + 2}}]};
    }},
    strike: {roles: strikeRoles, minutes: 1, settle(context) {
        const {operator, target} = context.bound;
        if (!canStrike(operator, target) || target.place !== operator.place) return deny('The hand needs a living opponent within reach.');
        const hand = formHand(context);
        if (!hand.ok) return hand;
        return {...hand, effects: [handImpact(target, hand.observed.force)]};
    }},
    launch: {roles: strikeRoles, minutes: 1, settle(context) {
        const {operator, target} = context.bound;
        if (!canStrike(operator, target)) return deny('The hand needs a living opponent to aim at.');
        const hand = formHand(context);
        if (!hand.ok) return hand;
        return {...hand, facts: {flight: {from: operator.place, aim: target.place, force: hand.observed.force}}};
    }},
    impact: {roles: impactRoles, minutes: 1, settle({bound: {target}, facts: {flight}}) {
        if (!flight) return deny('There is no released hand.');
        if (target.place !== flight.aim || target.properties.alive !== true || !(target.quantities.vitality > 0)) {
            return {ok: true, observed: {contact: 'evaded'}};
        }
        return {ok: true, effects: [handImpact(target, flight.force,
            {from: flight.from, kinds: ['sightline'], links: flightReach, cost: flightReach})]};
    }},
    launchSweep: {roles: sweepRoles, minutes: 1, settle(context) {
        const {bound: {operator, corridor}, options: {route, dissipating}, address, at} = context;
        if (!operator.place || !Array.isArray(route) || !route.length) return deny('The hand needs a sweep route.');
        const path = sweepPath(corridor.links, operator.place, route);
        if (path.length !== route.length || path.at(-1) !== corridor.destination) return deny('The sweep route is out of reach.');
        const hand = formHand(context);
        if (!hand.ok) return hand;
        const force = hand.observed.force;
        const forceField = dissipating ? `gu.sweep.${address.replace(/[:/]/g, ch => ch === ':' ? ':c' : ':s')}` : null;
        return {...hand, facts: {sweep: {from: operator.place, caster: operator.holder, route, force, places: path, forceField}},
            ...(forceField && {effects: [{op: 'law_add', field: {id: forceField, kind: sweepForce, scope: corridor.destination,
                params: {amount: force}, until: at + route.length + 1}}]})};
    }},
    sweep: {roles: sweepImpactRoles, minutes: 1, settle({bound: {corridor}, facts: {sweep}}) {
        if (!sweep) return deny('There is no released sweep.');
        const places = sweepPath(corridor.links, sweep.from, sweep.route);
        const effects = places.flatMap(place => sweepContacts(corridor, place, sweep.caster)
            .map(target => handImpact(target, sweep.force)));
        return {ok: true, effects, observed: {places}};
    }},
    sweepLink: {roles: sweepImpactRoles, minutes: 1, settle({bound: {corridor}, facts: {sweep}}) {
        if (!sweep) return deny('There is no released sweep.');
        const {cursor = 0, from, route, caster, force, places, remaining = flightReach, seen = []} = sweep;
        const availableForce = sweep.forceField ? corridor.forceFields.find(field => field.id === sweep.forceField)?.params.amount : force;
        if (!(availableForce > 0)) return deny('The sweep has spent its force.');
        const here = cursor === 0 ? from : places[cursor - 1];
        const exit = linkExits(corridor.links, here, {kinds: ['sightline']}).find(row => row.link === route[cursor]);
        if (!exit || exit.to !== places[cursor] || exit.cost > remaining) return deny('The sweep cannot pass the next link.');
        const {amount = 0, exitId} = corridor.debris?.[exit.to] ?? {};
        const {cleared, effects: terrain} = clearGuRubble({place: exit.to, amount, exitId, links: corridor.links,
            force: sweep.forceField ? availableForce : 0});
        const contactForce = availableForce - cleared;
        const targets = contactForce > 0 ? sweepContacts(corridor, exit.to, caster, seen) : [];
        return {ok: true, facts: {sweep: {...sweep, cursor: cursor + 1, remaining: remaining - exit.cost,
            seen: [...seen, ...targets.map(target => target.holder)]}},
        observed: {place: exit.to, ...(sweep.forceField && {force: contactForce}), ...(cleared > 0 && {cleared})},
        effects: [
            ...terrain,
            ...(cleared > 0 ? [{op: 'law_params', id: sweep.forceField, params: {amount: contactForce}}] : []),
            ...targets.map(target => handImpact(target, contactForce, undefined, sweep.forceField)),
        ]};
    }},
    steady: {roles: steady, minutes: 1, settle({bound: {operator, support}, at}) {
        if (operator.properties.alive !== true || !usable(support, operator, 'older-strength-supports', 1, at) ||
            operator.properties[phantomExpiry] > at) return deny('Preparation needs its living support and room for phantoms.');
        const result = resolveGuActivation({stages: [stage(operator, support, steadyPhantomAbility, at)], day: at,
            reserves: {[operator.id]: {primeval: operator.quantities[primeval] ?? 0}}});
        if (result.outcome !== 'complete') return deny(result.reason);
        return {ok: true, facts: {preparationSite: operator.place},
            costs: [{quantity: primeval, payer: operator.holder, amount: result.activations[0].cost}]};
    }},
    prepare: {roles: first, minutes: giantHandPractice.preparation - 1, settle(context) {
        const {bound: {operator}, at, facts} = context;
        if (operator.place !== facts.preparationSite || operator.properties[phantomExpiry] > at) {
            return deny('Preparation has lost its place or room for phantoms.');
        }
        const result = summon(context, 'self-strength', preparedPhantomAbility);
        if (!result.ok) return result;
        return {ok: true, costs: result.costs,
            effects: phantomProperties(operator, [result.facts.phantoms.magnitude, at + giantHandPractice.phantomLife, operator.place])};
    }},
    release: {roles: second, minutes: 1, settle(context) {
        const {bound: {operator}, at} = context;
        const p = operator.properties;
        if (!(p[phantomExpiry] > at) || !p[phantomForce]) return deny('No prepared phantoms remain.');
        const result = gather({...context, facts: {origin: p[phantomOrigin],
            phantoms: {kind: 'strength-phantoms', magnitude: p[phantomForce]}}});
        return result.ok ? {...result, effects: [...phantomProperties(operator, []), ...result.effects]} : result;
    }},
}});

function method(id, operations) {
    return {id, revision: 1, law: GU_GIANT_HAND_LAW.ref, roles: Object.assign({}, ...operations.map(([, roles]) => roles)),
        steps: operations.map(([op, roles]) => ({op, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}))};
}
export const revisedGiantHandWorking = method('gu.revised-giant-hand.cast', [['summon', first], ['gather', second]]);
export const revisedGiantHandStrike = method('gu.revised-giant-hand.strike', [['summon', first], ['strike', strikeRoles]]);
export const revisedGiantHandFlight = method('gu.revised-giant-hand.flight', [['summon', first], ['launch', strikeRoles], ['impact', impactRoles]]);
export function revisedGiantHandSweep(route, {dissipating = false, staged = dissipating} = {}) {
    if (dissipating && !staged) throw Error('A dissipating sweep needs staged contact.');
    if (staged && (!Array.isArray(route) || !route.length)) throw Error('A staged sweep needs a route.');
    const impacts = staged ? route.map(() => ['sweepLink', sweepImpactRoles]) : [['sweep', sweepImpactRoles]];
    const id = staged ? 'gu.revised-giant-hand.staged-sweep' : 'gu.revised-giant-hand.sweep';
    const sweep = method(id, [['summon', first], ['launchSweep', sweepRoles], ...impacts]);
    sweep.steps[1].options = {route: Array.isArray(route) ? [...route] : route, ...(dissipating && {dissipating})};
    return sweep;
}
export const giantHandBrace = method('gu.revised-giant-hand.brace', [['brace', braceRoles]]);
export const prepareGiantHandWorking = method('gu.giant-hand.prepare', [['steady', steady], ['prepare', first]]);
export const releaseGiantHandWorking = method('gu.giant-hand.release', [['release', second]]);
