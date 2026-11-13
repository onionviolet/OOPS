// PC95. The headless furnace binds living inputs and uses the same Moonlight
// branch discovery and refinement outcomes as the Keeper. The world owns the
// stock and the bodies. Working facts retain only the recipe and exact bindings.
import {defineWorkingLaw} from '../kernel_working.js';
import {beginGuRefinement, stepGuRefinement} from '../gu_refinement.js';
import {discoverMoonFusions, moonFusionAbility, moonFusionMaterials, moonFusionSupply} from '../gu_moon_fusions.js';
import {moonlightBlade} from '../gu_ability_profiles.js';
import {resolveGuActivation} from '../gu_activation.js';
import {livingBodyState} from '../world_substrate_packs/living_body.js';

const stones = 'stock:' + moonFusionMaterials;
const reject = reason => ({ok: false, reason});
const fusionRoles = {operator: 'operator', moon: 'gu', lightA: 'gu', lightB: 'gu'};
const castRoles = {operator: 'operator', specimen: 'gu', target: 'creature'};
const fusionMinutes = 2;

export const GU_MOON_FUSION_PROPERTIES = [
    {id: 'gu_rank', type: 'level', min: 1},
    {id: 'gu_blade_power', type: 'level', min: 0},
    {id: 'gu_blade_reach', type: 'level', min: 0},
    {id: 'gu_furnace_steady', type: 'flag'},
    {id: 'gu_furnace_job', type: 'label'},
    {id: 'gu_furnace_until', type: 'level', min: 0},
    {id: 'injured', type: 'flag'},
];

function specimenOf(holder, operator, at) {
    const p = holder.properties;
    return {id: holder.holder, kind: p.gu_kind, rank: p.gu_rank, injured: p.injured,
        alive: p.alive === true, fedThrough: holder.quantities.satiety > 0 ? at : at - 1,
        holder: holder.place === operator.place && p.gu_controller === operator.id ? p.gu_keeper : null};
}

const inputsOf = ({operator, moon, lightA, lightB}, at) =>
    [moon, lightA, lightB].map(holder => specimenOf(holder, operator, at));
const furnaceCommitted = (holder, at) => !!holder.properties.gu_furnace_job && holder.properties.gu_furnace_until >= at;
const committed = (holder, at) => !!holder.properties.gu_installed_in || furnaceCommitted(holder, at);
const jobOn = (holder, id, until) => [
    {op: 'property', holder, property: 'gu_furnace_job', value: id},
    {op: 'property', holder, property: 'gu_furnace_until', value: until},
];

function prepare({bound, address, at}) {
    const {operator} = bound;
    const gu = inputsOf(bound, at);
    if ([bound.moon, bound.lightA, bound.lightB].some(holder => committed(holder, at))) {
        return reject('An ingredient is already committed.');
    }
    const proposal = discoverMoonFusions(gu, operator.id).find(row => row.recipe.kind === 'moonglow');
    if (!proposal) return reject('The furnace needs one Moonlight and two distinct Little Light Gu under your control.');
    const productId = address.split('/')[0] + '.moonglow';
    const held = operator.quantities[stones] ?? 0;
    const price = proposal.recipe.stages[0].inputs[0].amount;
    if (held < price) return reject('The furnace needs a stone.');
    const refiner = operator.id;
    const snapshot = {gu, stocks: {[refiner]: {[moonFusionMaterials]: held}}, attempts: []};
    const started = beginGuRefinement(snapshot, {id: productId, productId, refiner, ...proposal});
    const prepared = stepGuRefinement(started, productId);
    return {ok: true, costs: [{quantity: stones, payer: operator.holder, amount: price}],
        facts: {attempt: prepared.attempts[0]}, observed: {prepared: proposal.ingredients},
        effects: gu.flatMap(input => jobOn(input.id, productId, at + fusionMinutes))};
}

function fuse({bound, facts, at}) {
    const {operator} = bound;
    const gu = inputsOf(bound, at);
    const attempt = facts.attempt;
    if (!attempt) return reject('Prepare the furnace before fusing.');
    if ([bound.moon, bound.lightA, bound.lightB].some(holder => holder.properties.gu_furnace_job !== attempt.id ||
        !furnaceCommitted(holder, at) || holder.properties.gu_installed_in)) return reject('The furnace has lost its binding.');
    const snapshot = {gu, stocks: {[operator.id]: {}}, attempts: [attempt]};
    const result = stepGuRefinement(snapshot, attempt.id, {controlFailed: operator.properties.gu_furnace_steady !== true});
    const [settled] = result.attempts;
    if (settled.cause === 'ingredient-unavailable') return reject('A prepared ingredient is no longer in your control.');
    if (settled.cause === 'control') {
        return {ok: true, observed: {fusion: 'failed-control'}, effects: result.gu.flatMap(input => {
            if (!input.alive) return [{op: 'lifecycle', act: 'end', holder: input.id}];
            return [...jobOn(input.id, null, null),
                ...(input.injured ? [{op: 'property', holder: input.id, property: 'injured', value: true}] : [])];
        })};
    }
    const product = result.gu.find(input => input.id === settled.product);
    const value = {id: product.id, place: operator.place,
        properties: {alive: true, gu_kind: product.kind, gu_rank: product.rank, gu_keeper: operator.id,
            gu_controller: operator.id, gu_blade_power: product.traits.power, gu_blade_reach: product.traits.reach},
        state: {'l.living_body': livingBodyState({species: product.kind, rate: 1})}};
    // Merge retires the inputs and records all three parents. On this opt-in
    // scale the new body inherits the remaining ration-minutes from the inputs.
    return {ok: true, observed: {fusion: 'complete', product: product.id},
        effects: [{op: 'lifecycle', act: 'merge', holders: gu.map(input => input.id), value}]};
}

function cast({bound, options, at}) {
    const {operator, specimen, target} = bound;
    const gu = specimenOf(specimen, operator, at);
    if (committed(specimen, at)) return reject('This Gu is already committed.');
    if (gu.holder !== operator.id || gu.kind !== options.kind || operator.place !== target.place ||
        target.holder === operator.holder) return reject('The bound Gu or target cannot be used here.');
    const moonglow = gu.kind === 'moonglow';
    const quantity = moonglow ? 'energy:primeval.rank2' : 'energy:primeval.rank1';
    const pool = moonglow ? moonFusionSupply.pool : moonlightBlade.fuel;
    const ability = moonglow
        ? moonFusionAbility({traits: {power: specimen.properties.gu_blade_power, reach: specimen.properties.gu_blade_reach}})
        : moonlightBlade;
    const result = resolveGuActivation({stages: [{gu, operator: operator.id, ability,
        ...(moonglow && {supply: moonFusionSupply})}], reserves: {[operator.id]: {[pool]: operator.quantities[quantity] ?? 0}}, day: at});
    if (result.outcome !== 'complete') return reject(result.reason);
    return {ok: true, costs: [{quantity, payer: operator.holder, amount: result.activations[0].cost}],
        observed: {specimen: gu.id, kind: gu.kind}, effects: [{
            sentence: {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
            details: {target: {shape: 'holder', id: target.holder}, amount: result.effects[0].magnitude},
        }]};
}

export const GU_MOON_FUSION_LAW = defineWorkingLaw({
    id: 'gu.moon-furnace', revision: 1, operations: {
        prepare: {roles: fusionRoles, settle: prepare},
        fuse: {roles: fusionRoles, settle: fuse},
        cast: {roles: castRoles, settle: cast},
    },
});

const slots = roles => Object.fromEntries(Object.keys(roles).map(role => [role, role]));

export const moonFusionWorking = {id: 'gu.moon-fusion', revision: 1, law: GU_MOON_FUSION_LAW.ref, roles: fusionRoles,
    steps: [{op: 'prepare', minutes: 1, bindings: slots(fusionRoles)}, {op: 'fuse', minutes: fusionMinutes, bindings: slots(fusionRoles)}]};

export function moonBladeWorking(kind) {
    if (!['moonlight', 'moonglow'].includes(kind)) throw Error('This working needs a Moonlight or Moonglow Gu.');
    return {id: 'gu.furnace-cast.' + kind, revision: 1, law: GU_MOON_FUSION_LAW.ref, roles: castRoles,
        steps: [{op: 'cast', minutes: 1, bindings: slots(castRoles), options: {kind}}]};
}
