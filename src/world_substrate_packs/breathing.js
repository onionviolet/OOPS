import {creatureForm} from '../creature_evolution.js';

// A body with a breath reserve spends it in a place with no breathable air.
// A local supply preserves the reserve. Ambient air restores it on surfacing.
export const BREATHING_PACK = {
    id: 'l.breathing', revision: 1,
    quantities: [{id: 'breath', unit: 'breath unit', min: 0, max: 3}],
    properties: [{id: 'submerged', type: 'flag'}],
    reads: ['breath', 'vitality', 'submerged'],
    writes: ['breath', 'vitality'],
    laws: [{
        id: 'breathe',
        appliesTo: holder => holder.kind === 'body' && Object.hasOwn(holder.quantities, 'breath') &&
            holder.quantities.vitality > 0,
        rates(view, id) {
            if (view.property(view.placeOf(id), 'submerged') !== true)
                return [{holder: id, quantity: 'breath', perMinute: 1}];
            if (view.lawFields(id, 'breathing-air').some(field => field.scope === id)) return [];
            return view.amount(id, 'breath') > 0
                ? [{holder: id, quantity: 'breath', perMinute: -1}]
                : [{holder: id, quantity: 'vitality', perMinute: -1}];
        },
    }],
};

// Callers that supply the creature form pack can opt into water breathing.
export const GILLED_BREATHING_PACK = {
    ...BREATHING_PACK,
    reads: [...BREATHING_PACK.reads, 'form', 'temporary-form', 'temporary-form-until', 'temporary-form-layers'],
    laws: BREATHING_PACK.laws.map(law => ({...law, rates(view, id) {
        if (view.property(view.placeOf(id), 'submerged') === true &&
            creatureForm({properties: view.properties(id)}, view.clock) === 'gilled') return [];
        return law.rates(view, id);
    }})),
};
