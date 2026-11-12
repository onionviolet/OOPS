// Societies and markets v0, a trade as a kernel working between any two holders (chat M, SMK7, SMK8; R1).
// Contract: docs/MARKETS_CONTRACT.md. The kernel (src/kernel_working.js, KW1-KW14) quotes and settles; the
// substrate (src/world_substrate.js) holds the stock and coin. A player, an NPC household, a clan steward or a
// rival refiner trades by the same law and the same quote (PFP11). The settlement returns substrate ops as
// effect intents; the host applies them with applyWorldOps (KW11). Nothing here writes a save or a purse.
import {defineWorkingLaw} from './kernel_working.js';
import {MARKET_PACK, stockOf, shelfQuote} from './market_substrate.js';

const natural = n => Number.isSafeInteger(n) && n >= 0;

// Price hold, default and dial: 'agreed' keeps the quoted price through settlement (a handshake); 'current'
// refuses when the shelf price moved between quote and settle (the existing native trade's fingerprint rule).
export const TRADE_HOLDS = Object.freeze(['agreed', 'current']);

export const TRADE_LAW = defineWorkingLaw({id: 'm.trade', revision: 0, operations: {
    trade: {roles: {buyer: 'trader', seller: 'trader'}, minutes: 0, settle({bound, options}) {
        const {buyer, seller} = bound, {good, count, unitPrice, hold = 'agreed'} = options;
        if (!natural(count) || count < 1 || !natural(unitPrice)) return {ok: false, reason: 'The terms are not whole numbers.'};
        if (buyer.id === seller.id) return {ok: false, reason: 'Nobody trades with themselves.'};
        const asking = seller.asks?.[good];
        if (hold === 'current' && asking !== unitPrice)
            return {ok: false, reason: 'The price moved.', observed: {asking: asking ?? null}};
        if ((seller.stock?.[good] ?? 0) < count) return {ok: false, reason: 'Not enough left to sell.', observed: {left: seller.stock?.[good] ?? 0}};
        const total = unitPrice * count;
        if ((buyer.coin ?? 0) < total) return {ok: false, reason: 'Not enough coin.', observed: {short: total - (buyer.coin ?? 0)}};
        const q = stockOf(good);
        return {ok: true, facts: {paid: total, good, count},
            observed: {paid: total, unitPrice, count},
            effects: [
                ...(buyer.carries.includes(q) ? [] : [{op: 'carry', holder: buyer.id, quantity: q, amount: 0}]),
                {op: 'add', holder: seller.id, quantity: q, amount: -count},
                {op: 'add', holder: buyer.id, quantity: q, amount: count},
                {op: 'add', holder: buyer.id, quantity: 'coin', amount: -total},
                {op: 'add', holder: seller.id, quantity: 'coin', amount: total}]};
    }},
}});

/** A one-step trade method. A longer method (inspect, haggle, pay, carry home) is more steps on the same law. */
export const tradeMethod = Object.freeze({id: 'm.trade.buy', revision: 0, law: TRADE_LAW.ref,
    roles: {buyer: 'trader', seller: 'trader'}, steps: [{op: 'trade', bindings: {buyer: 'buyer', seller: 'seller'}}]});

/** The method for one deal; options are the terms both sides agreed in the quote. */
export const tradeDeal = ({good, count, unitPrice, hold = 'agreed'}) => ({...tradeMethod,
    steps: [{...tradeMethod.steps[0], options: {good, count, unitPrice, hold}}]});

/**
 * Kernel ports over one substrate world at the step's time (KW3, KW6). A trader is any holder carrying coin; a
 * shelf also shows its asks. `terms(holderId)` supplies standing multipliers from their owner (SMK7).
 */
export function marketPorts(world, {terms = () => undefined, factors = () => []} = {}) {
    return {read(ref) {
        const h = world.holders[ref.id];
        if (ref.kind !== 'trader' || !h || !('coin' in h.quantities)) return null;
        const stock = {}, asks = {};
        for (const [k, v] of Object.entries(h.quantities)) if (k.startsWith('stock.')) stock[k.slice(6)] = v;
        const s = h.state[MARKET_PACK];
        if (s) asks[s.good] = shelfQuote(world, h.id, {side: 'buy', terms: terms(h.id), factors: factors(h.id)}).price;
        return {kind: 'trader', id: h.id, coin: h.quantities.coin, stock, asks, carries: Object.keys(h.quantities), place: h.place};
    }};
}
