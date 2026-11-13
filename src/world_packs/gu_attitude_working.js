// PC95. Ch. 974/1083 supply the mental fuel. The bounded steward encounter
// follows the existing Keeper split between demeanor, evidence and title.
import {defineWorkingLaw} from '../kernel_working.js';
import {assessGuDemeanor, useAttitudeGu} from '../gu_attitude.js';

const mental = 'energy:mental';
const roles = {operator: 'operator', specimen: 'gu'};
const request = {operator: 'operator', office: 'place'};
const audience = 'gu.attitude.audience';

export const GU_ATTITUDE_WORLD_LAW = defineWorkingLaw({id: 'gu.attitude-world', revision: 1, operations: {
    wear: {roles, settle({bound, at, address}) {
        const {operator, specimen} = bound;
        const p = specimen.properties;
        if (!operator.holder || !specimen.holder || specimen.place !== operator.place || p?.gu_keeper !== operator.id ||
            p.gu_controller !== operator.id || p.gu_installed_in ||
            (p.gu_furnace_job && p.gu_furnace_until >= at)) return {ok: false, reason: 'The mask is unavailable.'};
        const use = useAttitudeGu({operator: operator.id, now: at, mental: operator.quantities[mental] ?? 0,
            gu: {id: specimen.id, kind: p.gu_kind, alive: p.alive === true, injured: p.injured,
                holder: operator.id, fedThrough: specimen.quantities.satiety > 0 ? at : at - 1}});
        if (!use) return {ok: false, reason: 'The mask or mental reserve is unready.'};
        return {ok: true, costs: [{quantity: mental, payer: operator.holder, amount: use.activations[0].cost}],
            effects: [{op: 'law_add', field: {id: 'demeanor.' + address.replaceAll('/', '.'), scope: operator.holder,
                kind: 'gu.demeanor', params: {impression: use.effects[0].magnitude, specimen: specimen.holder,
                    operator: operator.id}, until: at + 5}}],
            observed: {specimen: specimen.id}};
    }},
    ask: {roles: request, settle({bound}) {
        const {operator, office} = bound;
        if (!office.holder || operator.place !== office.holder) return {ok: false, reason: 'The visitor is not at the office.'};
        return {ok: true, effects: [{op: 'publish', kind: audience, place: office.holder, by: operator.holder}]};
    }},
}});

export function attitudeWorking(operation) {
    const slots = GU_ATTITUDE_WORLD_LAW.operations[operation]?.roles;
    if (!slots) throw Error('Unknown Attitude Gu action.');
    return {id: 'gu.attitude.' + operation, revision: 1, law: GU_ATTITUDE_WORLD_LAW.ref, roles: slots,
        steps: [{op: operation, minutes: 1, bindings: Object.fromEntries(Object.keys(slots).map(role => [role, role]))}]};
}

export const guAttitudeEncounterPack = {
    id: 'g.attitude-encounter', revision: 1, publishes: [audience], hears: [audience],
    properties: [
        {id: 'gu_suspicion', type: 'level', min: 0},
        {id: 'gu_evidence_against', type: 'set'},
        {id: 'gu_supply_title', type: 'flag'},
    ],
    reads: ['gu_suspicion', 'gu_evidence_against', 'gu_supply_title', 'stock', 'alive', 'gu_keeper', 'gu_controller', 'satiety'],
    writes: ['stock'],
    reactors: [{
        id: 'steward', on: [audience], appliesTo: holder => holder.kind === 'body' && 'gu_suspicion' in holder.properties,
        react(view, id, event) {
            const visitor = event.by;
            if (visitor === id || view.placeOf(visitor) !== event.place) return [];
            const suspicion = view.property(id, 'gu_suspicion');
            const objections = view.property(id, 'gu_evidence_against') ?? [];
            const impression = Math.max(0, ...view.lawFields(visitor, 'gu.demeanor')
                .filter(field => field.scope === visitor)
                .filter(({params: {specimen, operator}}) => view.placeOf(specimen) === event.place &&
                    view.property(specimen, 'alive') === true && view.has(specimen, 'satiety') &&
                    view.amount(specimen, 'satiety') > 0 && view.property(specimen, 'gu_keeper') === operator &&
                    view.property(specimen, 'gu_controller') === operator)
                .map(field => field.params.impression));
            const judgment = assessGuDemeanor({suspicion: suspicion + Number(objections.includes(visitor)), impression});
            const supply = 'stock:orchid-petals';
            const fulfilled = judgment === 'reassured' && view.property(visitor, 'gu_supply_title') === true &&
                view.has(visitor, supply) && view.has(id, supply) && view.amount(id, supply) >= 1;
            const response = {op: 'state', holder: id, value: {visitor, judgment, fulfilled}};
            return fulfilled ? [response, {op: 'add', holder: id, quantity: supply, amount: -1},
                {op: 'add', holder: visitor, quantity: supply, amount: 1}] : [response];
        },
    }],
};
