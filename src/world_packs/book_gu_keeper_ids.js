// Keeper id helpers in a leaf module, so packs that only need ids do not import the whole keeper pack (AR1 cycles).
export const KEEPER_PREFIX = 'book.ri.keeper';
export const kId = n => `${KEEPER_PREFIX}.${n}`;
export const kKey = n => JSON.stringify({id: kId(n)});
