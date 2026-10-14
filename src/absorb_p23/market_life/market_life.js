// Original Village proposal inspired by customer favors and changing notices.
// No foreign code/assets. Pure plans only: P00 owns native custody and saving.
export const MARKET_LIFE = Object.freeze({schema:1, traderId:'village trader',
    unitsPerCoupon:5, couponCoins:5, breadSupplyPercent:5});
const natural = n => Number.isSafeInteger(n) && n >= 0;
const positive = n => natural(n) && n > 0;
const fail = message => { throw new Error(message); };
const keys = ['schema','tradeIndex','deliveryIndex','purchasedUnits','couponsIssued',
    'couponsUsed','supplyDay','supplyClock'];
export function normalizeMarketLife(raw) {
    if(raw === undefined) return {schema:1,tradeIndex:0,deliveryIndex:0,purchasedUnits:0,
        couponsIssued:0,couponsUsed:0,supplyDay:null,supplyClock:null};
    if(!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.schema !== 1 ||
        Object.keys(raw).some(k => !keys.includes(k))) fail('Unsupported market life record.');
    for(const k of keys.slice(1,6)) if(!natural(raw[k])) fail(`Invalid market life ${k}.`);
    if(raw.couponsIssued !== Math.floor(raw.purchasedUnits / MARKET_LIFE.unitsPerCoupon) ||
        raw.couponsUsed > raw.couponsIssued ||
        (raw.supplyDay !== null && !natural(raw.supplyDay)) ||
        (raw.supplyClock !== null && !natural(raw.supplyClock)) ||
        (raw.supplyDay === null) !== (raw.supplyClock === null) ||
        (raw.deliveryIndex === 0) !== (raw.supplyDay === null)) fail('Invalid market life accounts.');
    return Object.fromEntries(keys.map(k => [k,raw[k]]));
}
const local = c => c.worldId === 'base.frontier' && c.location === 'Village' &&
    c.alive === true && natural(c.clock) && natural(c.calendarMinute);
const day = c => Math.floor(c.calendarMinute / 1440);
const activeSupply = (s,c) => local(c) && s.supplyDay === day(c) && c.clock >= s.supplyClock;
function basket(b) {
    if(!b || !natural(b.buySubtotal) || !natural(b.breadSubtotal) ||
        b.breadSubtotal > b.buySubtotal || !natural(b.buyUnits) ||
        (b.buyUnits === 0) !== (b.buySubtotal === 0) ||
        typeof b.useCoupon !== 'boolean') fail('Invalid native market basket.');
}
// Native prices (including rounding, reputation, Haggling and accessories) are
// computed FIRST by the host. No adjustment to sell proceeds or stock draws.
export function quoteMarketPurchase(raw,c,b) {
    const s = normalizeMarketLife(raw); basket(b);
    const eligible = local(c) && c.traderId === MARKET_LIFE.traderId;
    const supplyDiscount = eligible && activeSupply(s,c)
        ? Math.floor(b.breadSubtotal / (100 / MARKET_LIFE.breadSupplyPercent)) : 0;
    const beforeCoupon = b.buySubtotal - supplyDiscount;
    const couponDiscount = eligible && b.useCoupon && s.couponsIssued > s.couponsUsed
        ? Math.min(MARKET_LIFE.couponCoins, Math.max(0,beforeCoupon - 1)) : 0;
    const total = beforeCoupon - couponDiscount;
    return {nativeSubtotal:b.buySubtotal,breadSubtotal:b.breadSubtotal,supplyDiscount,
        couponDiscount,total,useCoupon:couponDiscount > 0,
        supplyIndex:eligible && activeSupply(s,c) ? 0.95 : 1,
        explanation:`Native purchase ${b.buySubtotal} coins; mill relay supply service: `+
            `${eligible && activeSupply(s,c) ? '5% of bread subtotal, rounded down' : 'no active reduction'} `+
            `(-${supplyDiscount}); customer coupon (-${couponDiscount}); pay ${total} coins.`};
}
// index is the persistent, monotonic native trade receipt sequence, not a UI
// click or timer. Replays at/below the watermark publish no reward or debit.
export function planMarketTrade(raw,c,event) {
    const s = normalizeMarketLife(raw); basket(event);
    if(!positive(event.index)) fail('Invalid native trade occurrence.');
    const quote = quoteMarketPurchase(s,c,event);
    const unchanged = reason => ({state:s,ok:false,reason,quote:null,moneyDelta:0,earnedCoupons:0});
    if(!local(c) || c.traderId !== MARKET_LIFE.traderId) return unchanged('Not a Village market transaction.');
    if(event.index <= s.tradeIndex) return unchanged('Trade occurrence already settled.');
    const units = s.purchasedUnits + event.buyUnits;
    if(!natural(units)) fail('Market customer account overflow.');
    s.tradeIndex = event.index;
    const issued = Math.floor(units / MARKET_LIFE.unitsPerCoupon);
    const earnedCoupons = issued - s.couponsIssued;
    s.purchasedUnits = units; s.couponsIssued = issued;
    if(quote.useCoupon) s.couponsUsed++;
    // This is the adjustment relative to the native debit, NOT free money.
    return {state:s,ok:true,quote,moneyDelta:quote.supplyDiscount + quote.couponDiscount,earnedCoupons};
}
// Host calls only on a completed, custody-validated local parcel delivery from
// life-loops. Preview, acceptance, partial duty and load are not completion.
export function planMarketDelivery(raw,c,receipt) {
    const s = normalizeMarketLife(raw);
    if(!receipt || !positive(receipt.index) || receipt.kind !== 'parcel_delivery' ||
        receipt.completed !== true || receipt.clock !== c.clock) fail('Invalid completed supply receipt.');
    if(!local(c)) return {state:s,ok:false,reason:'Delivery is not local.'};
    if(receipt.index <= s.deliveryIndex) return {state:s,ok:false,reason:'Delivery occurrence already settled.'};
    s.deliveryIndex = receipt.index; s.supplyDay = day(c); s.supplyClock = c.clock;
    return {state:s,ok:true};
}
// Known-only projection. Effects-off suppresses optional cues, never economic
// rules, facts or explanations. Rendering does not mutate or generate events.
export function marketLifeView(raw,c) {
    const s = normalizeMarketLife(raw);
    if(!local(c) || c.marketKnown !== true) return {visible:false};
    const supplied = activeSupply(s,c);
    return {visible:true,title:'Village market notice',
        notice:s.supplyDay === null ? 'Local parcels still need carrying. Ask the Village mentor about the existing delivery route.'
            : supplied ? 'Your completed mill relay cleared local bread supply paperwork. Village market bread purchases cost 5% less today, rounded down.'
                : 'Your mill relay receipt was accepted. Today the bread supply price has returned to its native rate; another completed delivery can refresh it.',
        occurrence:s.deliveryIndex,supplyIndex:supplied ? 0.95 : 1,
        favor:`${s.purchasedUnits % 5}/5 purchased units toward the next 5-coin customer coupon. `+
            `${s.couponsIssued-s.couponsUsed} available. Redeem on a later purchase; minimum payment 1 coin.`,
        cue:c.effectsEnabled === true && s.couponsIssued > s.couponsUsed ? 'customer-favor' : null};
}
