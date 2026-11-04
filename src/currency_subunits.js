// Sub-unit amounts and exact change (R2, ECC25, ECR16, 2026-11-03). Pure leaf: no state, no imports.
// The purse stays one number in pence (character.money); a halfpenny is 0.5 of it, so a saved game
// with whole-number money loads unchanged and no second money authority exists. A world's grain is the
// smallest coin as a count per pence (Tingen: 2, the halfpenny; default for worlds without sub-units: 1).
// Rounding is a dial: `fee` rounds up to the next grain so a nonzero fee never reads as free, `tender`
// rounds to nearest, `floor` is for credits. Amounts are exact in binary for grains 1, 2, 4, 8.
export const TINGEN_GRAIN = 2;
export const ROUNDING = Object.freeze({fee: 'up', credit: 'down', nearest: 'nearest'});
const MODES = new Set(['up', 'down', 'nearest']);
const grainOk = g => Number.isInteger(g) && g >= 1 && g <= 8 && (g & (g - 1)) === 0;
const toUnits = (pence, grain) => Math.round(pence * grain);
export function isGrained(pence, grain = 1) {
    return grainOk(grain) && Number.isFinite(pence) && Math.abs(pence * grain - Math.round(pence * grain)) < 1e-9;
}
// Round a raw pence figure to the grain; returns pence. A positive raw figure rounded 'up' or 'nearest'
// never returns 0 when `keepNonzero` (default for fees).
export function roundToGrain(pence, grain, mode = 'nearest', {keepNonzero = false} = {}) {
    if(!grainOk(grain) || !MODES.has(mode) || !Number.isFinite(pence)) throw Error('Invalid grain, mode or amount.');
    const x = pence * grain, eps = 1e-9;
    let u = mode === 'up' ? Math.ceil(x - eps) : mode === 'down' ? Math.floor(x + eps) : Math.round(x);
    if(keepNonzero && x > eps && u === 0) u = 1;
    return u === 0 ? 0 : u / grain;
}
// A fee of `rate` (0.005 = 0.5%) on a sum, in grained pence. Charged once on the sum, never per coin.
export function feeOn(sum, rate, grain = 1, mode = 'up') {
    if(!(rate >= 0) || !(sum >= 0)) throw Error('Fee needs a non-negative rate and sum.');
    return roundToGrain(sum * rate, grain, mode, {keepNonzero: rate > 0 && sum > 0});
}
// Exact change: tender minus price, both on the grain. Throws rather than create or lose a grain.
export function changeFor(tender, price, grain = 1) {
    if(!isGrained(tender, grain) || !isGrained(price, grain) || price < 0 || tender < price) throw Error('Tender must cover a grained price.');
    return (toUnits(tender, grain) - toUnits(price, grain)) / grain;
}
// Pence amount -> coins, largest first: pound 240, soli 12, penny 1, halfpenny 0.5 (when grain 2).
export function coinBreakdown(pence, grain = 1, {pound = 240, soli = 12} = {}) {
    if(!isGrained(pence, grain) || pence < 0) throw Error('Amount is not on the grain.');
    let u = toUnits(pence, grain);
    const out = {}, take = (name, size) => { const q = Math.floor(u / (size * grain)); if(q) { out[name] = q; u -= q * size * grain; } };
    take('pound', pound); take('soli', soli); take('penny', 1);
    if(u) out.halfpenny = u;
    return out;
}
// Display: "3 pence", "1 penny", "3½ pence", "½ penny", "2 soli 1½ pence" is left to the caller's coin lines.
export function penceLabel(pence) {
    const neg = pence < 0, a = Math.abs(pence), whole = Math.floor(a + 1e-9), frac = a - whole;
    if(frac > 1e-9 && Math.abs(frac - 0.5) > 1e-9) throw Error('Only halfpence are shown.');
    const half = frac > 0.25;
    const num = half ? (whole ? `${whole}½` : '½') : `${whole}`;
    return `${neg ? '-' : ''}${num} ${whole === 0 && half || a === 1 ? 'penny' : 'pence'}`;
}
