// Crafting engine: product family registry (crafting palette AB1, CR6
// REGISTRY). One static table maps generated inventory keys to the owner that
// holds their truth, so a new family never adds a second key/use/save path.
// Entry one is the existing Village mixture key, byte-identical; entry two is
// the generic engine batch. Ordinary item keys return null and keep using the
// original decoder. Reserved fields on an unsupported key throw.
import {MIXTURE_ID, mixtureKey, productFromKey} from './mixture_state.js';
import {BATCH_FAMILY} from './craft_resolver.js';

const fail = message => { throw new Error(message); };

export const PRODUCT_FAMILIES = Object.freeze({
    'village.mixtures@1': Object.freeze({
        id: 'village.mixtures@1', owner: 'mixtures',
        accepts: k => k.id === MIXTURE_ID && 'mixture' in k,
        ref: k => k.mixture,
        encode: product => mixtureKey(product),
        resolve: (owners, key) => productFromKey(owners.mixtures ?? fail('Missing mixture owner.'), key),
    }),
    [BATCH_FAMILY]: Object.freeze({
        id: BATCH_FAMILY, owner: 'crafting',
        accepts: k => k.productFamily === BATCH_FAMILY,
        ref: k => k.productRef,
        encode: product => JSON.stringify({id: product.carrier, productFamily: BATCH_FAMILY, productRef: product.id}),
        resolve: (owners, key) => {
            const k = JSON.parse(key);
            const product = owners.crafting?.products?.[k.productRef] ?? fail('Missing crafted product reference.');
            if(PRODUCT_FAMILIES[BATCH_FAMILY].encode(product) !== key) fail('Noncanonical crafted product key.');
            return product;
        },
    }),
});
const RESERVED = ['productFamily', 'productRef', 'mixture'];

// -> {family, ref} for a generated key, null for an ordinary item key.
export function classifyProductKey(key) {
    let k;
    try { k = JSON.parse(key); } catch { return null; }
    if(!k || typeof k !== 'object' || Array.isArray(k)) return null;
    for(const family of Object.values(PRODUCT_FAMILIES)) if(family.accepts(k)) {
        const ref = family.ref(k);
        if(typeof ref !== 'string' || !ref) fail('Malformed generated product key.');
        return {family: family.id, ref};
    }
    if(RESERVED.some(field => field in k)) fail('Unsupported generated product family.');
    return null;
}
export function keyForProduct(familyId, product) {
    return (PRODUCT_FAMILIES[familyId] ?? fail(`Unknown product family ${familyId}.`)).encode(product);
}
// owners: {mixtures, crafting} as held by the save.
export function resolveProductKey(key, owners) {
    const hit = classifyProductKey(key);
    return hit ? {family: hit.family, product: PRODUCT_FAMILIES[hit.family].resolve(owners, key)} : null;
}
