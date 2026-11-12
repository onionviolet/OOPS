import {HP_ABRASIVE_PROCESS, planNativeHpMaterials} from './hp_ingredient_substitution.js';
import {begin, commit, settle} from './hp_brewing_state.js';

const bonemealKey = JSON.stringify({id: 'Bonemeal'});
const horn = 'book.hp.ing.bicorn_horn';

export function runAbrasionWorkshop({hornPreparation = null, bonemeal = 0} = {}) {
    if (![null, 'fine', 'coarse'].includes(hornPreparation)) throw Error('Choose fine or coarse horn, or leave the horn out.');
    if (!Number.isSafeInteger(bonemeal) || bonemeal < 0 || bonemeal > 3) throw Error('Supply zero to three portions of Bonemeal.');
    let state = begin({seed: 11, now: 0});
    state.cauldron.condition = 850;
    const trace = [];
    const apply = (request, context = {}) => {
        const result = commit(state, {now: 0, moon: 'Full', ...context}, request);
        state = result.state;
        trace.push({action: request.type, observation: result.summary});
    };
    const startingPurse = state.purse;
    const slots = {};
    if (hornPreparation) {
        apply({type: 'acquire', route: 'book.hp.route.trusted_supplier', ingredient: horn});
        slots.bicorn = Object.values(state.lots).find(lot => lot.ingredient === horn).id;
        apply({type: 'prepare', lotId: slots.bicorn, variant: `book.hp.prep.powder_${hornPreparation}`});
    }
    const materialInputs = bonemeal ? [{key: bonemealKey, qty: bonemeal}] : [];
    const externalMaterials = planNativeHpMaterials({
        inputs: materialInputs, inventory: {[bonemealKey]: {count: bonemeal}}, world: 'book.hp.school.world',
    });
    apply({type: 'brew', method: HP_ABRASIVE_PROCESS.ref, slots, materialInputs}, {externalMaterials});
    const pending = state.cauldron.brew;
    settle(state, pending.readyAt);
    const [prepared] = Object.values(state.batches);
    const beforeTreatment = state.cauldron.condition;
    apply({type: 'treatCauldron', batchId: prepared.id}, {now: pending.readyAt});
    const batch = state.batches[prepared.id];
    return {
        method: 'abrasion', beforeTreatment, afterTreatment: state.cauldron.condition,
        strength: batch.history.abrasivePlan.strength, dosesLeft: batch.dosesLeft,
        spent: {coins: startingPurse - state.purse, bonemeal, horn: hornPreparation ? 1 : 0, doses: 1},
        minutes: pending.readyAt, trace,
        basis: 'Original YAIR cauldron suspension and treatment rules. The workshop starts with a deliberately fouled cauldron.',
    };
}

const perimeter = ['north', 'east', 'south', 'west'];

export function runEnclosureWorkshop({route = 'dagger', segments = perimeter, petition = true} = {}) {
    if (!['dagger', 'powder'].includes(route)) throw Error('Choose the dagger or powder route.');
    if (!Array.isArray(segments) || segments.length > 16 || segments.some(segment => !perimeter.includes(segment))) {
        throw Error('Use north, east, south and west perimeter segments.');
    }
    if (typeof petition !== 'boolean') throw Error('Petition must be true or false.');
    const contiguous = segments.every((segment, index) => index === 0
        || perimeter[(perimeter.indexOf(segments[index - 1]) + 1) % perimeter.length] === segment);
    const enclosed = contiguous && new Set(segments).size === perimeter.length;
    const paid = segments.length > 0;
    return {
        method: 'enclosure', route, enclosed, petitionPerformed: petition && enclosed,
        spent: {powder: route === 'powder' && paid ? 1 : 0, spirituality: route === 'dagger' ? segments.length : paid ? 2 : 0},
        retained: {dagger: route === 'dagger', powderTrace: route === 'powder' ? [...segments] : []},
        trace: [
            {action: route === 'dagger' ? 'trace with sanctified dagger' : 'scatter charged powder', segments},
            {action: 'check perimeter', observation: enclosed ? 'The workspace is enclosed.' : 'The perimeter did not close.'},
            ...(petition ? [{action: 'petition', observation: enclosed ? 'Petition performed. The response is unresolved.' : 'The petition needs an enclosed workspace.'}] : []),
        ],
        basis: 'Lord of Mysteries chapter 51 describes both barrier means. Segment order, resource units and petition dependency are original workshop rules.',
    };
}

export const substitutionWorkshopCases = Object.freeze({
    'substitution-reference': {method: 'abrasion', hornPreparation: 'fine'},
    'substitution-equivalent': {method: 'abrasion', bonemeal: 2},
    'substitution-tradeoff': {method: 'abrasion', hornPreparation: 'coarse'},
    'substitution-blend': {method: 'abrasion', hornPreparation: 'coarse', bonemeal: 1},
    'enclosure-dagger': {method: 'enclosure', route: 'dagger'},
    'enclosure-powder': {method: 'enclosure', route: 'powder'},
});
