import {begin, commit, HP, settle} from './hp_brewing_state.js';
import {quantity} from './hp_potion_reactions.js';

export {brewWorkshopDraught, brewWorkshopAntidote} from './hp_potion_reactions.js';

export const potionWorkshopCases = Object.freeze({
    'draught': {method: 'draught', preparation: 'crush', strokes: 'LLLLLLLR'},
    'draught-variation': {method: 'draught', preparation: 'slice', strokes: 'LLLLLLLR'},
    'blended-antidote': {method: 'antidote', remedyA: 4, remedyB: 4, binder: 2},
    'catalysed-antidote': {method: 'antidote', binder: 2, cool: true, catalyst: true},
    'polyjuice-sourcing': {method: 'polyjuice', moon: 'Full', storeDose: true},
    'polyjuice-variation': {method: 'polyjuice', moon: 'New', storeDose: false},
});

export function brewWorkshopPolyjuice({moon = 'Full', fluxSource = 'harvest', stewDays = 21, horn = 'fine', storeDose = false} = {}) {
    const routes = new Map([
        ['harvest', 'book.hp.route.harvest'], ['cupboard', 'book.hp.route.student_store'], ['supplier', 'book.hp.route.trusted_supplier'],
    ]);
    if (!routes.has(fluxSource)) throw Error('Choose harvest, cupboard or supplier for fluxweed.');
    if (!['Full', 'New'].includes(moon)) throw Error('Choose a Full or New moon for this fixture.');
    if (!['fine', 'coarse', 'raw'].includes(horn)) throw Error('Choose fine, coarse or raw horn.');
    if (typeof storeDose !== 'boolean') throw Error('Store dose must be true or false.');
    quantity(stewDays, 'Stew days');
    const trace = [];
    let now = 0;
    let state = begin({seed: 11, now});
    const initialPurse = state.purse;
    const apply = request => {
        const result = commit(state, {now, moon}, request);
        state = result.state;
        trace.push({action: request.type, at: now, observation: result.summary});
    };
    const acquire = (name, route) => {
        const ingredient = `book.hp.ing.${name}`;
        apply({type: 'acquire', ingredient, route: routes.get(route)});
        return Object.values(state.lots).find(lot => lot.ingredient === ingredient).id;
    };
    const slots = {
        fluxweed: acquire('fluxweed', fluxSource),
        lacewing: acquire('lacewing_flies', 'cupboard'),
        leeches: acquire('leeches', 'cupboard'),
        knotgrass: acquire('knotgrass', 'cupboard'),
        bicorn: acquire('bicorn_horn', 'supplier'),
        boomslang: acquire('boomslang_skin', 'supplier'),
    };
    apply({type: 'stew', lotId: slots.lacewing});
    now += stewDays * 1440;
    settle(state, now);
    if (state.lots[slots.lacewing].stew) apply({type: 'removeStew', lotId: slots.lacewing});
    if (horn !== 'raw') apply({type: 'prepare', lotId: slots.bicorn, variant: `book.hp.prep.powder_${horn}`});
    apply({type: 'prepare', lotId: slots.boomslang, variant: 'book.hp.prep.shred_fine'});
    apply({type: 'brew', slots});
    now += HP.rules.brewMinutes;
    settle(state, now);
    const [batch] = Object.values(state.batches);
    if (storeDose) {
        apply({type: 'transferBatch', batchId: batch.id, custody: 'bench'});
        apply({type: 'transferBatch', batchId: batch.id, custody: 'carried'});
    }
    const finalBatch = state.batches[batch.id];
    return {
        method: 'polyjuice', fluxSource, moon, stewDays, horn, grade: finalBatch.grade,
        doses: finalBatch.dosesLeft, custody: finalBatch.custody, spent: {coins: initialPurse - state.purse, lots: Object.values(slots)},
        minutes: now, trace,
        basis: 'Book 2 pp432–433 and pp496–498 anchor the preparations and provenance. Lot sourcing, costs, storage custody and outcome grades follow YAIR’s existing Hogwarts brewing owner.',
    };
}
