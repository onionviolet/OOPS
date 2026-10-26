// ORIGINAL book.hp hand-preparation service. The existing HP state/transaction
// owns lots, purse and clock; this pure plan never spends or teaches anything.
import {packNative} from './world_pack_registry.js';

export const HP_PREPARATION_REVISION = 1;
const LAW = 'book.hp.hand-preparation@1';
const PACK = packNative('book.hp');
const FEES = Object.freeze({
    'book.hp.prep.powder_coarse': 1,
    'book.hp.prep.powder_fine': 2,
    'book.hp.prep.shred_fine': 1,
    'book.hp.prep.shred_ragged': 1,
});
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const natural = v => Number.isSafeInteger(v) && v >= 0;
const text = v => typeof v === 'string' && v.length > 0;
const need = (ok, why) => { if(!ok) throw Error(why); };
const shape = (v, keys) => object(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));

export function hpPreparationTerms(variantId) {
    const variant = PACK.variants.find(v => v.id === variantId);
    need(variant && Object.hasOwn(FEES, variantId), 'Choose a supported hand preparation.');
    return {law: LAW, revision: HP_PREPARATION_REVISION, status: 'ORIGINAL', variantId,
        label: variant.label, form: variant.makes, coins: FEES[variantId], fuel: 0,
        unit: 'recipe-portion', input: 1, yield: 1, waste: 0};
}

// All receipt fields are witnessed service terms. Hidden source truth remains
// on the existing lot and is not copied into public method evidence.
export function validateHpPreparationReceipt(receipt, lot = null, at = Number.MAX_SAFE_INTEGER) {
    need(shape(receipt, ['law', 'revision', 'status', 'at', 'lotId', 'ingredient', 'before', 'after', 'accounting', 'means']), 'Malformed HP preparation receipt.');
    need(receipt.law === LAW && receipt.revision === HP_PREPARATION_REVISION && receipt.status === 'ORIGINAL', 'Unsupported HP preparation revision.');
    need(natural(receipt.at) && natural(at) && receipt.at <= at && text(receipt.lotId), 'Malformed HP preparation identity or time.');
    need(shape(receipt.before, ['form', 'variant']) && receipt.before.form === 'raw' && receipt.before.variant === null, 'Unsupported HP preparation input.');
    need(shape(receipt.after, ['form', 'variant']), 'Malformed HP preparation output.');
    const terms = hpPreparationTerms(receipt.after.variant);
    const ingredient = PACK.ingredients.find(i => i.id === receipt.ingredient);
    need(ingredient?.forms.includes(terms.form) && receipt.after.form === terms.form, 'Preparation does not fit this ingredient.');
    const a = receipt.accounting, m = receipt.means;
    need(shape(a, ['unit', 'input', 'yield', 'waste']) && a.unit === terms.unit && a.input === 1 && a.yield === 1 && a.waste === 0, 'HP preparation portions do not conserve.');
    need(shape(m, ['apparatus', 'laborCoins', 'fuel']) && m.apparatus === 'hand-preparation-service' && m.laborCoins === terms.coins && m.fuel === 0, 'Unsupported HP preparation cost or means.');
    if(lot !== null) need(object(lot) && lot.id === receipt.lotId && lot.ingredient === receipt.ingredient &&
        lot.form === receipt.after.form && lot.variant === receipt.after.variant && natural(lot.acquiredAt) &&
        lot.acquiredAt <= receipt.at && !lot.stew, 'Prepared lot differs from its receipt.');
    return receipt;
}

export function planHpPreparation({lot, variantId, now, purse, apparatusAvailable}) {
    const terms = hpPreparationTerms(variantId);
    need(object(lot) && text(lot.id), 'Choose a lot you hold.');
    need(lot.form === 'raw' && !lot.stew && lot.variant == null, 'Only a raw lot can be prepared.');
    need(natural(now) && natural(lot.acquiredAt) && lot.acquiredAt <= now, 'Preparation needs the played clock after acquisition.');
    need(PACK.ingredients.find(i => i.id === lot.ingredient)?.forms.includes(terms.form), 'This ingredient cannot receive that preparation.');
    need(apparatusAvailable === true, 'The hand-preparation service is unavailable here.');
    need(natural(purse), 'Preparation needs the current coin balance.');
    need(purse >= terms.coins, `This preparation costs ${terms.coins} coins; you hold ${purse}.`);
    const receipt = {law: terms.law, revision: terms.revision, status: terms.status, at: now, lotId: lot.id, ingredient: lot.ingredient,
        before: {form: 'raw', variant: null}, after: {form: terms.form, variant: variantId},
        accounting: {unit: terms.unit, input: terms.input, yield: terms.yield, waste: terms.waste},
        means: {apparatus: 'hand-preparation-service', laborCoins: terms.coins, fuel: terms.fuel}};
    // Comminution changes form, not custody, age, origin or contamination.
    // A later world's reader decides which of those facts matter to its use.
    const prepared = {...structuredClone(lot), form: terms.form, variant: variantId, preparation: receipt};
    validateHpPreparationReceipt(receipt, prepared);
    return {lot: prepared, cost: {coins: terms.coins, fuel: terms.fuel}, receipt: structuredClone(receipt),
        summary: `${terms.label}: one recipe portion prepared for ${terms.coins} coins of paid labor; no fuel or separate portion waste (ORIGINAL).`};
}

export function projectHpPreparation(receipt) {
    return structuredClone(validateHpPreparationReceipt(receipt));
}
