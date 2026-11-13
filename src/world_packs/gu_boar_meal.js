// Reverend Insanity, vol. 1 ch. 65–70. Fresh boar meat feeds White Boar Gu;
// paid practice leaves strength on the cultivator. Account sizes are local.
import {defineWorkingLaw} from '../kernel_working.js';
import {guWorldUseReason} from '../gu_world_use.js';
import {SATIETY} from '../world_substrate_packs/living_body.js';
import {applyEffect} from '../world_effects.js';
import {linkExits, worldLinks} from '../world_substrate.js';
import {natural} from '../basics.js';

export const BOAR_MEAT = 'stock:fresh-boar-meat';
export const BOAR_STRENGTH = {id: 'boar-strength', unit: 'strength-point', min: 0, max: Number.MAX_SAFE_INTEGER};
const exertion = 'boar-practice-exertion';
const tolerance = 'boar-practice-tolerance';
const exertionPerPulse = 2;
const cutAt = 'boar-meat-at';
const fuel = 'energy:primeval.rank1.middle';
const roles = {keeper: 'body', gu: 'gu'};
const feeding = {...roles, carcass: 'thing'};
const refuse = reason => ({ok: false, reason});

export function boarMealRemains({id, clock}) {
    return {id: `${id}.remains`, retain: [BOAR_MEAT], properties: {[cutAt]: clock}};
}

export const BOAR_MEAL_PROPERTY = {id: cutAt, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER};
export const CARRY_LOAD_PROPERTY = {id: 'carry-load', type: 'level', min: 1, max: Number.MAX_SAFE_INTEGER};

// Bodies opt in by carrying exertion and declaring their pain threshold.
export const WHITE_BOAR_PRACTICE_PACK = {
    id: 'g.white_boar_practice', revision: 1,
    quantities: [{id: exertion, unit: 'exertion-point', min: 0, max: Number.MAX_SAFE_INTEGER}],
    properties: [{id: tolerance, type: 'level', min: exertionPerPulse, max: Number.MAX_SAFE_INTEGER}],
    reads: [exertion], writes: [exertion],
    laws: [{
        id: 'recover',
        appliesTo: body => body.kind === 'body' && Object.hasOwn(body.quantities, exertion),
        rates: (view, id) => view.amount(id, exertion) > 0 ? [{holder: id, quantity: exertion, perMinute: -1}] : [],
        watches: (_view, id) => [{holder: id, quantity: exertion, op: 'lte', value: 0}],
    }],
};

export const WHITE_BOAR_LAW = defineWorkingLaw({id: 'gu.white-boar-meal', revision: 1, operations: {
    feed: {roles: feeding, minutes: 1, settle({bound: {keeper, gu, carcass}, at, options: {meal, freshFor}}) {
        if (!keeper.properties.alive || !gu.properties.alive || gu.properties.gu_kind !== 'white-boar' ||
            gu.properties.gu_keeper !== keeper.id || gu.place !== keeper.place)
            return refuse('Bring the living White Boar Gu you are tending.');
        const age = at - carcass.properties[cutAt];
        if (carcass.place !== keeper.place || !(age >= 0 && age < freshFor) || !(carcass.quantities[BOAR_MEAT] >= 1))
            return refuse('Bring fresh boar meat.');
        const gained = Math.min(meal, SATIETY.max - gu.quantities.satiety);
        if (!Number.isSafeInteger(gained) || gained <= 0) return refuse('The Gu has no room for another meal.');
        return {ok: true, costs: [{quantity: BOAR_MEAT, payer: carcass.holder, amount: 1}],
            effects: [{op: 'add', holder: gu.holder, quantity: 'satiety', amount: gained}]};
    }},
    strengthen: {roles, minutes: 1, settle({bound: {keeper, gu}, at}) {
        if (!keeper.properties.alive || !gu.properties.alive || gu.properties.injured || gu.properties.gu_kind !== 'white-boar')
            return refuse('Bring a healthy White Boar Gu.');
        const reason = guWorldUseReason(gu, keeper.id, keeper.place, at);
        if (reason) return refuse(reason);
        if (!(gu.quantities.satiety > 0)) return refuse('The White Boar Gu needs food.');
        if (!(keeper.quantities[fuel] >= 1)) return refuse('Prepare one part of middle-stage essence.');
        if (!(keeper.quantities[BOAR_STRENGTH.id] < BOAR_STRENGTH.max)) return refuse('This practice can add no more strength.');
        const strain = keeper.quantities[exertion], threshold = keeper.properties[tolerance];
        if (threshold !== undefined && !(strain <= threshold - exertionPerPulse))
            return refuse('Your muscles still hurt. Rest before practicing again.');
        return {ok: true, costs: [{quantity: fuel, payer: keeper.holder, amount: 1}],
            effects: [{op: 'add', holder: keeper.holder, quantity: BOAR_STRENGTH.id, amount: 1},
                ...(threshold === undefined ? [] : [{op: 'add', holder: keeper.holder, quantity: exertion, amount: exertionPerPulse}])]};
    }},
}});

export function whiteBoarFeed({meal, freshFor}) {
    if (![meal, freshFor].every(value => Number.isSafeInteger(value) && value > 0)) throw Error('Set a whole meal and freshness window.');
    return {id: 'gu.white-boar-feed', revision: 1, law: WHITE_BOAR_LAW.ref, roles: feeding,
        steps: [{op: 'feed', bindings: {keeper: 'keeper', gu: 'gu', carcass: 'carcass'}, options: {meal, freshFor}}]};
}

export const WHITE_BOAR_PRACTICE = {id: 'gu.white-boar-practice', revision: 1, law: WHITE_BOAR_LAW.ref, roles,
    steps: [{op: 'strengthen', bindings: {keeper: 'keeper', gu: 'gu'}}]};

// A local push reads the cultivator's current body and the actual
// load. Strength is capacity. The shared movement effect still checks wards.
export function pushBoarLoad(engine, {keeper, load, link, baseCapacity}) {
    const {world, rules} = engine;
    const bearer = world.holders[keeper], item = world.holders[load];
    const failed = reason => ({ok: false, reason, engine});
    if (!natural(baseCapacity)) throw Error('Pushing needs a whole base capacity.');
    if (bearer?.kind !== 'body' || !bearer.properties.alive || item?.kind !== 'thing' || item.place !== bearer.place)
        return failed('load-out-of-reach');
    const exit = linkExits(worldLinks(world), bearer.place, {kinds: ['path']}).find(way => way.link === link);
    if (!exit) return failed('path-closed');
    const burden = item.properties[CARRY_LOAD_PROPERTY.id];
    if (burden === undefined || burden - baseCapacity > (bearer.quantities[BOAR_STRENGTH.id] ?? 0))
        return failed('load-too-heavy');
    const moved = applyEffect(rules, world, {verb: 'move', object: 'position', target: {shape: 'holder', id: load},
        to: exit.to, by: keeper}, `boar-push:${keeper}`);
    const next = {...engine, world: moved.world};
    return next.world.holders[load]?.place === exit.to ? {ok: true, engine: next} :
        {ok: false, reason: 'load-blocked', engine: next};
}
