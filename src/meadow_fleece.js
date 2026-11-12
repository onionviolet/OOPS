import {measureCreatureCapability, planCreatureMethod} from './creature_methods.js';

export const FINE_WOOL_KEY = JSON.stringify({id: 'Fine wool'});
const law = 'village.fleece.v1';
const fineness = {id: 'fleece.fineness', unit: 'grade', combine: 'max'};
const method = {id: 'shear', revision: 1, law, steps: [{op: 'shear', bindings: {animal: 'subject'}}]};
const operations = {
    shear: {roles: {animal: 'creature'}, resolve({bound, facts}) {
        const fine = bound.animal.traits.fleece === 'fine';
        const measured = measureCreatureCapability(fineness, [
            {source: 'lineage.fleece', unit: fineness.unit, value: fine ? 65 : 40},
        ]);
        return {ok: true, facts: {fineness: measured}, effects: [{
            key: measured.value >= 65 ? FINE_WOOL_KEY : JSON.stringify({id: 'Wool'}), amount: facts.yield,
        }]};
    }},
};

export function planMeadowFleece(id, sheep, amount) {
    return planCreatureMethod(method, {law, operations, facts: {yield: amount},
        bindings: {subject: {kind: 'creature', id, traits: sheep.traits}}});
}
