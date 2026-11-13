// PC95. One common claim site arbitrates this kind. Its field points to the
// specimen. The living holder, wherever it is, decides whether the claim stands.
import {defineWorkingLaw} from '../kernel_working.js';
import {beginGuRefinement, stepGuRefinement} from '../gu_refinement.js';
import {fixedImmortalTravel} from '../gu_fixed_immortal_travel.js';
import {livingBodyState} from '../world_substrate_packs/living_body.js';
import {stableId} from '../simulation_ids.js';

const material = 'stock:travel-refinement-material';
const recipe = {id: 'world-fixed-travel', revision: 1, kind: fixedImmortalTravel, rank: 6, uniqueKey: fixedImmortalTravel,
    stages: [{id: 'prepare', inputs: [{material, amount: 1}]}, {id: 'quench', inputs: [{material, amount: 1}]}]};
const forge = {operator: 'operator', seat: 'place'};
const control = {operator: 'operator', specimen: 'gu'};
const settle = 'gu.unique.settle';
const claimKind = 'gu.unique.fixed-travel';
const pack = 'g.unique-refinement';
const claimSeat = 'fixed-refinery';
const refusal = {ok: false, reason: 'The refiner or material is unavailable.'};
const hasSeat = ({operator, seat}) => operator.holder && operator.place && seat.holder === claimSeat;
const cost = operator => [{quantity: material, payer: operator.holder, amount: 1}];

const operations = {
    prepare: {roles: forge, minutes: 1, settle({bound, address}) {
        const {operator} = bound;
        if (!hasSeat(bound) || (operator.quantities[material] ?? 0) < 1) return refusal;
        const productId = address.split('/')[0] + '.gu';
        return {ok: true, costs: cost(operator), facts: {productId, workshop: operator.place}};
    }},
    quench: {roles: forge, minutes: 2, settle({bound, facts}) {
        const {operator, seat} = bound;
        if (!hasSeat(bound) || operator.place !== facts.workshop ||
            (operator.quantities[material] ?? 0) < 1 || !facts.productId) return refusal;
        return {ok: true, costs: cost(operator), effects: [{op: 'publish', kind: settle, place: seat.holder,
            by: operator.holder, detail: {productId: facts.productId, refiner: operator.id, workshop: facts.workshop}}]};
    }},
    control: {roles: control, minutes: 1, settle({bound: {operator, specimen}}) {
        const p = specimen.properties;
        if (!specimen.holder || specimen.place !== operator.place || p?.alive !== true ||
            p.gu_kind !== fixedImmortalTravel || p.gu_keeper !== operator.id || p.gu_controller) {
            return {ok: false, reason: 'The living specimen is unavailable for control.'};
        }
        return {ok: true, effects: [
            {op: 'property', holder: specimen.holder, property: 'gu_controller', value: operator.id},
            {op: 'property', holder: specimen.holder, property: 'gu_carried', value: true},
        ]};
    }},
};
export const GU_UNIQUE_REFINEMENT_LAW = defineWorkingLaw({id: 'gu.unique-refinement', revision: 1, operations});

export function uniqueRefinementWorking(action = 'forge') {
    if (!['forge', 'control'].includes(action)) throw Error('Unknown unique refinement action.');
    return {id: 'gu.unique-refinement.' + action, revision: 1, law: GU_UNIQUE_REFINEMENT_LAW.ref,
        roles: action === 'forge' ? forge : control,
        steps: (action === 'forge' ? ['prepare', 'quench'] : ['control']).map(op => ({
            op, bindings: Object.fromEntries(Object.keys(operations[op].roles).map(role => [role, role])),
        }))};
}

export const guUniqueRefinementPack = {
    id: pack, revision: 1, properties: [{id: 'gu_world_claim', type: 'label'}, {id: 'gu_refinement_steady', type: 'flag'}],
    reads: ['gu_world_claim', 'gu_refinement_steady', 'gu_kind', 'gu_rank', 'gu_keeper', 'alive'],
    publishes: [settle], hears: [settle], lifecycle: {acts: ['create']},
    reactors: [{
        id: 'fixed-travel-claim', on: [settle],
        appliesTo: holder => holder.kind === 'place' && holder.id === claimSeat,
        react(view, id, event) {
            const {productId, refiner, workshop} = event.detail ?? {};
            if (!stableId(productId) || !stableId(refiner) || !workshop ||
                view.placeOf(event.by) !== workshop || view.holder(workshop)?.kind !== 'place') return [];
            if (view.holder(productId) || view.lineage(productId).length) {
                return [{op: 'state', holder: event.by, value: {status: 'failed'}}];
            }
            const field = view.lawFields(id, claimKind).find(row => row.scope === id);
            const incumbent = field?.params.specimen;
            const gu = incumbent && view.property(incumbent, 'alive') === true &&
                view.property(incumbent, 'gu_world_claim') === fixedImmortalTravel ? [{
                    id: incumbent, kind: view.property(incumbent, 'gu_kind'), rank: view.property(incumbent, 'gu_rank'),
                    holder: view.property(incumbent, 'gu_keeper'), alive: true, uniqueKey: fixedImmortalTravel,
                }] : [];
            // The two materials already settled through the live cost owner.
            // The pure rule checks the recipe and the live incumbent in this projection.
            const snapshot = {gu, attempts: [], stocks: {[refiner]: {[material]: 2}}};
            const started = beginGuRefinement(snapshot, {id: productId, productId, refiner, recipe});
            const result = stepGuRefinement(stepGuRefinement(started, productId), productId,
                {controlFailed: view.property(event.by, 'gu_refinement_steady') !== true});
            const [job] = result.attempts;
            const response = {op: 'state', holder: event.by, value: {status: job.status,
                ...(job.product && {product: job.product})}};
            if (job.status !== 'complete') return [response];
            const product = result.gu.find(row => row.id === job.product);
            return [
                {op: 'lifecycle', act: 'create', value: {id: product.id, kind: 'body', as: ['gu'], tags: ['living.body'],
                    place: workshop, quantities: {satiety: 12},
                    state: {'l.living_body': livingBodyState({species: product.kind, rate: 1})},
                    properties: {gu_kind: product.kind, gu_rank: product.rank, gu_keeper: product.holder,
                        gu_world_claim: product.uniqueKey, alive: true}}},
                ...(field ? [{op: 'law_params', id: field.id, params: {specimen: product.id}}]
                    : [{op: 'law_add', field: {id: id + '.fixed-claim', kind: claimKind, scope: id, params: {specimen: product.id}}}]),
                response,
            ];
        },
    }],
};
