// Societies and markets v0, goods and scarcity on the world substrate (chat M, SMK1-SMK6).
// Contract: docs/MARKETS_CONTRACT.md. Pure leaf over the W v0 pack shape (docs/WORLD_SUBSTRATE_CONTRACT.md):
// imports only the existing price curve, never another domain.
//
// Stock is a quantity on a holder (a shelf, a storehouse, a household's larder), so a brew, a sheep or a clan
// steward reads and moves the same amount a price does (SMK1, PFP10). A shelf has a want (what its usual
// customers use a day, SMK2) and may have a supplier: a holder whose input quantity turns into stock at the
// delivery minute (SMK3). A price is a projection over stock and want and is never saved (SMK5). The curve is
// regional_prices.scarcityFactor, so the original stalls and every substrate shelf move by one rule (SMK6, R4).
// Every number is a default with a dial and an in-world reason.
import {scarcityFactor, DIALS as PRICE_DIALS} from './regional_prices.js';

export const MARKET_PACK = 'm.market';
export const MARKET_REVISION = 0;
export const DAY = 1440;

export const MARKET_DIALS = Object.freeze({
    coverDays: {value: 2, why: 'A keeper likes about two days of what the street uses on the shelf; that is the usual stock the price is measured against.'},
    deliveryMinute: {value: 360, why: 'Carts and bakers deliver around dawn, before the street wakes.'},
    useMinute: {value: 1080, why: 'Most households buy for the evening meal, so the shelf empties toward supper.'},
    memoryDays: {value: 20, why: 'A price seen three weeks ago is a guess now (economy_standing staleDays).'},
});

const fail = message => { throw new Error(`Markets: ${message}`); };
const check = (ok, message) => { if (!ok) fail(message); };
const idLike = x => typeof x === 'string' && /^[a-z][a-z0-9_]*$/.test(x);
const natural = n => Number.isSafeInteger(n) && n >= 0;

/** Quantity names. Goods and inputs are pack-local (WSC2): a second pack that reads them declares the same unit and bounds. */
export const stockOf = good => `stock.${good}`;
export const COIN = Object.freeze({id: 'coin', unit: 'coin', min: 0, max: Number.MAX_SAFE_INTEGER});
export const stockQuantity = good => { check(idLike(good), `good id ${good} is lowercase words.`); return Object.freeze({id: stockOf(good), unit: 'unit', min: 0, max: 1000000}); };
export const inputQuantity = name => { check(idLike(name), `input id ${name} is lowercase words.`); return Object.freeze({id: name, unit: 'unit', min: 0, max: 1000000}); };

/** A shelf's pack state: what it sells and how it is fed. Validated once, so a bad row fails at setup, not mid-run. */
export function shelfState({good, base, wantPerDay = 0, par = null, supply = null}) {
    check(idLike(good) && Number.isFinite(base) && base > 0 && natural(wantPerDay), 'a shelf needs a good, a base worth and a whole want per day.');
    check(par === null || (natural(par) && par > 0), 'par is a whole number of units.');
    check(par !== null || wantPerDay > 0, 'a shelf with no want needs a stated par.');
    if (supply) check(typeof supply.from === 'string' && idLike(supply.input) && natural(supply.perUnit) && supply.perUnit > 0 && natural(supply.perDay),
        'supply needs a supplier holder, an input, inputs per unit and units per day.');
    return {good, base, wantPerDay, par, supply, lastDelivery: -1, lastUse: -1, delivered: 0, used: 0};
}

export const parOf = (s, dials = MARKET_DIALS) => s.par ?? s.wantPerDay * dials.coverDays.value;

const nextEvent = (clock, minutes) => Math.min(...minutes.map(m => ((m - clock % DAY) + DAY) % DAY || DAY));

/** The W pack. `goods` and `inputs` name the quantities this world's shelves use. */
export function createMarketPack({goods, inputs = [], dials = MARKET_DIALS}) {
    check(Array.isArray(goods) && goods.length, 'a market pack names its goods.');
    const quantities = [COIN, ...goods.map(stockQuantity), ...inputs.map(inputQuantity)];
    const names = quantities.map(q => q.id);
    const at = {delivery: dials.deliveryMinute.value, use: dials.useMinute.value};
    const isShelf = h => h.kind !== 'place' && h.tags.includes('market.shelf');
    return {
        id: MARKET_PACK, revision: MARKET_REVISION, quantities, reads: names, writes: names,
        laws: [{
            id: 'shelf', appliesTo: isShelf,
            // Deliveries and the day's use are discrete, once a day; the horizon cuts a segment at each, so a
            // one-day jump and 1,440 single minutes meet the same two boundaries (WSC4, WSC5).
            horizon: view => nextEvent(view.clock, [at.delivery, at.use]),
            decide: (view, id) => {
                const s = view.state(id), day = Math.floor(view.clock / DAY), minute = view.clock % DAY, ops = [];
                let next = s;
                const q = stockOf(s.good);
                if (minute === at.delivery && s.lastDelivery !== day && s.supply) {
                    const sup = s.supply, have = view.has(sup.from, sup.input) ? view.amount(sup.from, sup.input) : 0;
                    const made = Math.min(sup.perDay, Math.floor(have / sup.perUnit));
                    if (made) ops.push({op: 'add', holder: sup.from, quantity: sup.input, amount: -made * sup.perUnit},
                        {op: 'add', holder: id, quantity: q, amount: made});
                    next = {...next, lastDelivery: day, delivered: made};
                }
                if (minute === at.use && s.lastUse !== day && s.wantPerDay) {
                    const used = Math.min(s.wantPerDay, view.amount(id, q));
                    if (used) ops.push({op: 'add', holder: id, quantity: q, amount: -used});
                    next = {...next, lastUse: day, used};
                }
                return next === s ? [] : [...ops, {op: 'state', holder: id, value: next}];
            },
        }],
    };
}

/**
 * Price of one unit. `factors` are the non-shelf multipliers a world supplies (place, season, a keyed local event),
 * each {id, factor, why}; the shelf factor is the one curve. Same rounding as regional_prices.unitPrice.
 * terms: standing multipliers from their owner (SMK7), applied after the market, never folded into stock.
 */
export function marketPrice({base, factors = [], stock, par, side, haggle = 1, terms = {buy: 1, sell: 1}}) {
    check(side === 'buy' || side === 'sell', 'side is buy or sell.');
    check(natural(stock) && natural(par) && par > 0, 'stock and par are whole units.');
    const shelf = scarcityFactor(stock, par);
    const worth = factors.reduce((w, f) => w * f.factor, base) * shelf;
    const margin = 1 + (PRICE_DIALS.stapleMargin.value - 1) * Math.min(1, Math.max(0, haggle));
    const raw = side === 'buy' ? worth * margin * terms.buy : worth * PRICE_DIALS.bidShare.value * terms.sell;
    return {price: Math.max(1, Math.ceil(raw - 1e-9)), worth, shelf,
        parts: [...factors, {id: 'shelf', factor: shelf, why: shelfWhy(stock, par)}]};
}
function shelfWhy(stock, par) {
    if (stock <= 0) return 'None left on the shelf.';
    if (stock < par * 0.5) return `Only ${stock} left, well under the usual ${par}.`;
    if (stock > par * 1.4) return `${stock} on the shelf, far more than the usual ${par}.`;
    return '';
}

/** Quote a substrate shelf as it stands in `world` (a projection, nothing saved). */
export function shelfQuote(world, shelfId, {side = 'buy', factors = [], terms, haggle, dials = MARKET_DIALS} = {}) {
    const h = world.holders[shelfId];
    const s = h?.state[MARKET_PACK];
    check(s, `${shelfId} is not a market shelf.`);
    const stock = h.quantities[stockOf(s.good)] ?? 0;
    return {shelf: shelfId, good: s.good, place: h.place, stock, par: parOf(s, dials),
        ...marketPrice({base: s.base, factors, stock, par: parOf(s, dials), side, haggle, terms})};
}
