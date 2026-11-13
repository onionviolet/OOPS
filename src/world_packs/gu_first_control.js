// PC52/PC95: first refinement of a living Moonlight Gu. The later consumer is
// Fang Yuan's academy route. These two attempts mirror the costs and durations
// in book_gu_lead_refinement.js and book_gu_lead_vital.js (Reverend Insanity,
// local English vol. 1 ch. 8–10 and 11–20 respectively).
// The fixture supplies the intervening support as an operator property.
import {defineWorkingLaw} from '../kernel_working.js';

export const GU_CONTROL_PROPERTIES = [
    {id: 'gu_kind', type: 'label'},
    {id: 'gu_keeper', type: 'label'},
    {id: 'gu_controller', type: 'label'},
    {id: 'aperture_open', type: 'flag'},
    {id: 'refinement_support', type: 'flag'},
];

const ordinaryInfusion = {minutes: 30, amount: 30};
const supportedInfusion = {minutes: 5, amount: 1};
const infusion = supported => supported ? supportedInfusion : ordinaryInfusion;

export const GU_FIRST_CONTROL_LAW = defineWorkingLaw({id: 'gu.first_control', revision: 1, operations: {
    infuse: {roles: {operator: 'operator', specimen: 'gu'}, settle({bound, options}) {
        const {operator, specimen} = bound;
        const {gu_keeper, gu_controller, alive} = specimen.properties;
        if (!operator.properties.alive || !operator.properties.aperture_open || !alive ||
            gu_keeper !== operator.id || specimen.place !== operator.place || gu_controller ||
            specimen.properties.gu_kind !== 'moonlight') {
            return {ok: false, reason: 'Refinement needs your living, unrefined Gu and an open aperture.'};
        }
        const supported = operator.properties.refinement_support === true;
        if (supported !== options.supported) return {ok: false, reason: 'The means for this infusion changed.'};
        const {amount} = infusion(supported);
        if ((operator.quantities.primeval_essence ?? 0) < amount) {
            return {ok: false, reason: 'There is not enough primeval essence to finish the infusion.'};
        }
        // This is the Moonlight Gu result under these conditions. An infusion
        // can finish and spend essence even while the specimen resists control.
        return {ok: true, costs: [{quantity: 'primeval_essence', amount, payer: operator.holder}],
            observed: {result: supported ? 'controlled' : 'resisted'},
            effects: supported ? [{op: 'property', holder: specimen.holder,
                property: 'gu_controller', value: operator.id}] : []};
    }},
}});

export const firstControlMethod = supported => ({
    id: supported ? 'gu.first_control.supported' : 'gu.first_control.ordinary',
    revision: 1,
    law: GU_FIRST_CONTROL_LAW.ref,
    roles: {operator: 'operator', specimen: 'gu'},
    steps: [{op: 'infuse', minutes: infusion(supported).minutes, bindings: {operator: 'operator', specimen: 'specimen'},
        options: {supported}}],
});
