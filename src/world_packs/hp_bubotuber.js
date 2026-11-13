// HPPE050–052. Squeezing moves a measured portion into a flask.
import {defineWorkingLaw} from '../kernel_working.js';
import {brewDoseContents, brewDoseQuantity, brewMeasureQuantity, clearBrewFraction, clearBrewOrigins, clearBrewStorage} from '../engine_brew_stock.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

const roles = {plant: 'thing', flask: 'flask', collector: 'body'};
const pus = brewDoseQuantity('bubotuber-pus');
const law = defineWorkingLaw({id: 'hp.bubotuber', revision: 1, operations: {
    squeeze: {roles, minutes: 2, settle({bound: {plant, flask, collector}}) {
        if (!collector.holder || !collector.place || !plant.holder || !flask.holder ||
            collector.place !== plant.place || collector.place !== flask.place || plant.holder === flask.holder)
            return {ok: false, reason: 'bubotuber-out-of-reach'};
        if (plant.properties.material !== 'bubotuber' || !(plant.quantities[brewMeasureQuantity] >= 4))
            return {ok: false, reason: 'bubotuber-stock-short'};
        if (Object.keys(brewDoseContents(flask)).length || flask.brewFraction?.volume)
            return {ok: false, reason: 'bubotuber-needs-empty-flask'};
        const held = flask.quantities[pus], contacted = collector.quantities[pus];
        const amount = collector.properties['protective-gloves'] === true ? 4 : 3;
        if (amount < 4 && contacted === WORLD_QUANTITIES.stock.max)
            return {ok: false, reason: 'bubotuber-contact-account-full'};
        const effects = [
            {op: 'add', holder: plant.holder, quantity: brewMeasureQuantity, amount: -4},
            {op: held === undefined ? 'carry' : 'add', holder: flask.holder, quantity: pus, amount},
            clearBrewFraction(flask.holder), clearBrewOrigins(flask.holder), clearBrewStorage(flask.holder),
        ];
        if (amount < 4) effects.push({op: contacted === undefined ? 'carry' : 'add', holder: collector.holder,
            quantity: pus, amount: 1},
        {op: 'publish', kind: 'living.harm', place: collector.place, by: plant.holder,
            detail: {target: collector.holder, kind: 'undiluted-pus', amount: 1}});
        return {ok: true, effects, observed: {collected: amount, contacted: 4 - amount}};
    }},
}});

export function bubotuberWorking(bindings) {
    return {law, bindings, method: {id: 'hp.squeeze-bubotuber', revision: 1, law: law.ref, roles,
        steps: [{op: 'squeeze', bindings: {plant: 'plant', flask: 'flask', collector: 'collector'}}]}};
}
