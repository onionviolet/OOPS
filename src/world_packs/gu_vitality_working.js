// PC95. Reuse the Keeper's growth and detachment rules. The world owns
// water, essence, leaf stock, appetite and the patient's treatment interval.
import {defineWorkingLaw} from '../kernel_working.js';
import {detachVitalityLeaf, growVitalityLeaf, vitalityGrass, vitalityLeaf} from '../gu_vitality_grass.js';

const stem = 'gu_rooted_leaves';
const leaves = 'stock:vitality-leaf';
const water = 'stock:water';
const essence = 'energy:primeval.rank2';
const upkeep = 'satiety';
const treatmentUntil = 'gu_leaf_treatment_until';
const shadeStress = 'gu_shade_stress';
const maxShadeStress = 20;
const shadeDamageAt = 10;
const reject = reason => ({ok: false, reason});
const price = (quantity, payer, amount) => ({quantity, payer, amount});
const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const garden = {operator: 'operator', producer: 'gu', plot: 'place', cistern: 'supply'};
const harvest = {operator: 'operator', producer: 'gu'};
const treatment = {operator: 'operator', patient: 'creature'};
const guTreatment = {operator: 'operator', patient: 'gu'};

export const GU_VITALITY_WORLD_QUANTITIES = [{id: stem, unit: 'leaf', min: 0, max: vitalityGrass.capacity}];
export const GU_VITALITY_WORLD_PROPERTIES = [
    {id: treatmentUntil, type: 'level', min: 0},
    {id: 'gu_vitality_limit', type: 'level', min: 1},
];

// Sites that track daylight can leave a living plant stressed after a spell
// in shade. Existing plants can opt in by carrying the stress quantity.
export const guVitalityHabitatPack = {
    id: 'g.vitality-habitat', revision: 1,
    quantities: [{id: shadeStress, unit: 'shade-minute', min: 0, max: maxShadeStress}],
    reads: ['alive', 'gu_kind', 'daylight', shadeStress, 'vitality'], writes: [shadeStress, 'vitality'],
    lifecycle: {acts: ['end']},
    laws: [{
        id: 'shade-exposure', appliesTo: holder => holder.as.includes('gu') && shadeStress in holder.quantities,
        rates(view, id) {
            const place = view.placeOf(id);
            if (view.property(id, 'alive') !== true || view.property(id, 'gu_kind') !== 'vitality-grass' ||
                !place || !view.has(place, 'daylight')) return [];
            const sunny = view.amount(place, 'daylight') === 1;
            const stress = view.amount(id, shadeStress);
            const rates = [];
            if (sunny ? stress > 0 : stress < maxShadeStress)
                rates.push({holder: id, quantity: shadeStress, perMinute: sunny ? -1 : 1});
            if (!sunny && stress >= shadeDamageAt && view.has(id, 'vitality'))
                rates.push({holder: id, quantity: 'vitality', perMinute: -1});
            return rates;
        },
        watches: (_, id) => [
            {holder: id, quantity: shadeStress, op: 'lte', value: 0},
            {holder: id, quantity: shadeStress, op: 'gte', value: shadeDamageAt},
            {holder: id, quantity: shadeStress, op: 'gte', value: maxShadeStress},
            {holder: id, quantity: 'vitality', op: 'lte', value: 0},
        ],
        decide(view, id) {
            return view.property(id, 'alive') === true && view.property(id, 'gu_kind') === 'vitality-grass' &&
                view.has(id, 'vitality') && view.amount(id, 'vitality') === 0
                ? [{op: 'lifecycle', act: 'end', holder: id}] : [];
        },
    }],
};

function plantOf(producer, operator, at) {
    const p = producer.properties;
    return {id: producer.holder, kind: p?.gu_kind, alive: p?.alive === true, injured: p?.injured,
        holder: producer.place === operator.place && p?.gu_controller === operator.id &&
            !p?.gu_installed_in && !(p?.gu_furnace_job && p.gu_furnace_until >= at) ? p?.gu_keeper : null,
        leaves: producer.quantities?.[stem]};
}

const atPlot = ({operator, producer, plot, cistern}) =>
    operator.holder && producer.holder && cistern.holder && operator.place === plot.holder &&
    producer.place === plot.holder && cistern.place === plot.holder;

function treatPatient(roles) {
    return {roles, minutes: 1, settle({bound: {operator, patient}, at}) {
        if (!operator.holder || !patient.holder || operator.place !== patient.place || patient.properties.alive !== true ||
            (roles === guTreatment && !(patient.quantities.vitality > 0))) {
            return reject('The patient is unavailable.');
        }
        if ((patient.properties[treatmentUntil] ?? 0) > at) return reject('The last leaf is still working.');
        if (!(operator.quantities[leaves] > 0)) return reject('No detached leaf is available.');
        const room = patient.properties.gu_vitality_limit - patient.quantities.vitality;
        if (!(room > 0)) return reject('The patient has no injury this leaf can treat.');
        return {ok: true, costs: [price(leaves, operator.holder, 1)], effects: [
            {sentence: {verb: 'add', object: 'vitality', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
                details: {target: {shape: 'holder', id: patient.holder}, amount: Math.min(vitalityLeaf.health, room)}},
            {op: 'property', holder: patient.holder, property: treatmentUntil, value: at + vitalityLeaf.restMinutes},
        ]};
    }};
}

const operations = {
    tend: {roles: garden, minutes: 1, settle({bound, at}) {
        const {operator, producer, plot, cistern} = bound;
        const plant = plantOf(producer, operator, at);
        if (!atPlot(bound) || plant.kind !== 'vitality-grass' || !plant.alive || plant.holder !== operator.id ||
            plot.quantities?.daylight !== 1 || (cistern.quantities[water] ?? 0) < 1 || !(upkeep in producer.quantities)) {
            return reject('The plant needs accessible water and daylight.');
        }
        const refill = 15 - producer.quantities[upkeep];
        if (refill <= 0) return reject('The plant has enough water.');
        return {ok: true, costs: [price(water, cistern.holder, 1)], effects: [add(plant.id, upkeep, refill)]};
    }},
    grow: {roles: garden, minutes: 3, settle({bound, at}) {
        const {operator, producer, plot, cistern} = bound;
        if (!atPlot(bound) || !(producer.quantities[upkeep] > 0)) return reject('The plant needs tending.');
        if (producer.quantities[shadeStress] > 0) return reject('The plant is still recovering from shade.');
        const plant = plantOf(producer, operator, at);
        let result;
        try {
            result = growVitalityLeaf(plant, {operator: operator.id, daylight: plot.quantities?.daylight === 1,
                water: cistern.quantities[water] ?? 0, essence: operator.quantities[essence] ?? 0, clock: at});
        } catch (error) {
            return reject(error.message);
        }
        return {ok: true, costs: [price(water, cistern.holder, result.waterSpent),
            price(essence, operator.holder, result.essenceSpent)],
        effects: [add(plant.id, stem, result.plant.leaves - plant.leaves)]};
    }},
    pluck: {roles: harvest, minutes: 1, settle({bound: {operator, producer}, at}) {
        const plant = plantOf(producer, operator, at);
        let after;
        try {
            after = detachVitalityLeaf(plant, operator.id);
        } catch (error) {
            return reject(error.message);
        }
        return {ok: true, effects: [add(plant.id, stem, after.leaves - plant.leaves),
            ...(leaves in operator.quantities ? [] : [{op: 'carry', holder: operator.holder, quantity: leaves}]),
            add(operator.holder, leaves, 1)]};
    }},
    treat: treatPatient(treatment),
    'treat-gu': treatPatient(guTreatment),
};

export const GU_VITALITY_WORLD_LAW = defineWorkingLaw({id: 'gu.vitality-world', revision: 1, operations});
export function guVitalityWorking(operation) {
    if (!Object.hasOwn(operations, operation)) throw Error('Unknown Vitality Grass action.');
    const {roles, minutes} = operations[operation];
    return {id: 'gu.vitality-world.' + operation, revision: 1, law: GU_VITALITY_WORLD_LAW.ref, roles,
        steps: [{op: operation, minutes, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}]};
}
