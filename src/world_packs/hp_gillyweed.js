// HPPE056. A raw edible plant can change the body without a brewing step.
import {defineWorkingLaw} from '../kernel_working.js';
import {brewMeasureQuantity} from '../engine_brew_stock.js';

const roles = {plant: 'thing', eater: 'body'};
const law = defineWorkingLaw({id: 'hp.gillyweed', revision: 1, operations: {
    eat: {roles, minutes: 1, settle({bound: {plant, eater}, at}) {
        if (!plant.holder || !eater.holder || !eater.place || plant.place !== eater.place)
            return {ok: false, reason: 'gillyweed-out-of-reach'};
        if (plant.properties.material !== 'gillyweed' || !(plant.quantities[brewMeasureQuantity] >= 1))
            return {ok: false, reason: 'gillyweed-serving-unavailable'};
        if (eater.properties.mind_awake !== true) return {ok: false, reason: 'eater-not-awake'};
        return {ok: true, effects: [
            {op: 'add', holder: plant.holder, quantity: brewMeasureQuantity, amount: -1},
            {op: 'property', holder: eater.holder, property: 'temporary-form-layers',
                value: [...new Set([...(eater.properties['temporary-form-layers'] ?? []), `gilled|2|${at + 8}`])]},
        ]};
    }},
}});

export function gillyweedWorking(bindings) {
    return {law, bindings, method: {id: 'hp.eat-gillyweed', revision: 1, law: law.ref, roles,
        steps: [{op: 'eat', bindings: {plant: 'plant', eater: 'eater'}}]}};
}
