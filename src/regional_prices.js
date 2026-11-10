// Regional prices for staples (XWR17, ECR3-ECR5, ECR9, ECR15; OD11 local economies, NV-D4 shape).
// Price is one function of place, good, season, a keyed local event and the ACTUAL stock on the keeper's shelf.
// Stock is conserved: what you buy leaves the shelf, what you sell lands on it, and a restock is a stated delivery
// (supply per cycle, set by the place and the event), never a reset. A price moving is not a stock moving: the shelf
// number is the only thing that moves stock, and the price reads it. Pure leaf, no imports. The caller supplies the
// day, the season and a keyed `draw(key) -> [0,1)`, so a quote is a projection of (seed, place, good, day, stock)
// and nothing about it is saved. Every number is a default with a dial and an in-world reason, never a law.

// ---- the dials ---------------------------------------------------------------------------------------------
export const DIALS = Object.freeze({
    stapleMargin: {value: 1.3, why: 'Staples turn over fast, so a keeper asks about a third over what a thing is worth here, not the four or six times a stall asks for a sword (ECR3).'},
    bidShare: {value: 0.75, why: 'A keeper pays about three quarters of what the thing is worth here: he has to sell it on and live (ECR8, buying and selling stay asymmetric).'},
    scarcity: {slope: 0.6, floor: 0.7, ceiling: 1.6, why: 'An empty shelf lifts the price by up to three fifths; a shelf piled to twice its usual stock drops it by up to three tenths. The shelf count is the one cause of both.'},
    eventChance: {value: 0.2, epochDays: 28, why: 'About one month in five, a place has something that moves one kind of good: a failed harvest, a cold snap, a glut.'},
    maxCycles: {value: 12, why: 'A shop left for a long time has had a dozen deliveries at most; further back the shelf has settled.'},
    memoryDays: {value: 20, why: 'A price you saw three weeks ago is a guess now (the standing slice\'s staleDays).'},
});

// The place function: what a kind of good is worth in a place, against its base value.
// Village sits by the farms and far from the coal; the Slums sit by the walls, short of bread and near the town's coal.
export const KINDS = Object.freeze({
    fuel: {label: 'fuel', season: {Spring: 1, Summer: 0.9, Autumn: 1, Winter: 1.25},
        seasonWhy: {Winter: 'it is winter and everyone is burning more', Summer: 'nobody needs a fire in summer'}},
    grain: {label: 'bread', season: {Spring: 1.12, Summer: 1, Autumn: 0.85, Winter: 1.05},
        seasonWhy: {Spring: 'the old grain is running out before the new', Autumn: 'the harvest is in'}},
});
export const PLACES = Object.freeze({
    Village: {worth: {fuel: 1.2, grain: 0.8},
        worthWhy: {fuel: 'The village is far from any coal, so it comes dear.', grain: 'The farms are close, so bread is cheap here.'}},
    Slums: {worth: {fuel: 0.85, grain: 1.4},
        worthWhy: {fuel: 'Coal comes through the town gate and is cheap in the slums.', grain: 'There is little grain inside the walls, so bread is dear here.'}},
});

// What each keeper stocks as a staple: usual shelf (`par`, the template's middle), delivery per cycle (`supply`) and
// what local people use of any surplus per cycle (`use`). The cycle is the stall's own restock interval.
export const STAPLES = Object.freeze({
    villageTrader: {place: 'Village', goods: {
        'Coal': {kind: 'fuel', par: 12, supply: 6, use: 3, cart: 'the charcoal-burners\' cart'},
        'Stale bread': {kind: 'grain', par: 10, supply: 6, use: 4, cart: 'the baker\'s cart'},
        'Fresh bread': {kind: 'grain', par: 5, supply: 3, use: 2, cart: 'the baker\'s cart'}}},
    suspiciousTrader: {place: 'Slums', goods: {
        'Coal': {kind: 'fuel', par: 35, supply: 18, use: 8, cart: 'the gate carters'},
        'Stale bread': {kind: 'grain', par: 7, supply: 3, use: 3, cart: 'the back-door baker'},
        'Fresh bread': {kind: 'grain', par: 3, supply: 1, use: 1, cart: 'the back-door baker'}}},
});

// Keyed local events. `say` is what the keeper tells you; it is a real cause in the projection, not decoration.
export const EVENTS = Object.freeze({
    grain: [
        {id: 'harvest_failed', price: 1.3, supply: 0.3, label: 'Failed harvest', say: 'the harvest failed this year, so little grain is coming in'},
        {id: 'good_harvest', price: 0.85, supply: 1.6, label: 'Full granaries', say: 'a good harvest has the granaries full'}],
    fuel: [
        {id: 'cold_snap', price: 1.25, supply: 0.6, label: 'Cold snap', say: 'a cold snap has everyone burning more than the colliers can bring'},
        {id: 'seam_opened', price: 0.85, supply: 1.5, label: 'New seam', say: 'a new seam has opened and the colliers are glad of buyers'}],
});

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const round4 = n => Math.round(n * 10000) / 10000;

export const stapleOf = (vendorId, goodId) => STAPLES[vendorId]?.goods[goodId] ?? null;
export const isStaple = (vendorId, goodId) => stapleOf(vendorId, goodId) !== null;
export const stapleIds = vendorId => Object.keys(STAPLES[vendorId]?.goods ?? {});

// A keyed event for one place, one kind, one month-epoch. Same inputs, same answer; nothing is stored.
export function eventFor(place, kind, day, draw) {
    const rows = EVENTS[kind];
    if(!rows) return null;
    const e = Math.floor(day / DIALS.eventChance.epochDays), key = k => draw(JSON.stringify(['regional-event', place, kind, e, k]));
    if(key('happens') >= DIALS.eventChance.value) return null;
    return {...rows[Math.min(rows.length - 1, Math.floor(key('which') * rows.length))], place, kind, epoch: e};
}

// ---- stock (conserved) -------------------------------------------------------------------------------------
// One delivery cycle. Below the usual shelf, the cart brings `supply` (scaled by the event), up to the usual shelf.
// Above it (only after somebody sold the place more than it needed), people use `use` of the surplus, never below
// the usual shelf. Both are named flows with a cause (ECR15): the cart and the household.
export function stepStock(stock, staple, supplyMult = 1) {
    if(stock < staple.par) return Math.min(staple.par, stock + Math.round(staple.supply * supplyMult));
    return Math.max(staple.par, stock - staple.use);
}
/** Stock after `cycles` deliveries starting `fromDay`, each cycle under its own keyed event. */
export function projectStock({vendorId, goodId, stock, fromDay, cycleDays, cycles, draw}) {
    const staple = stapleOf(vendorId, goodId), place = STAPLES[vendorId].place;
    let now = stock;
    for(let i = 0; i < Math.min(cycles, DIALS.maxCycles.value); i++) {
        const ev = eventFor(place, staple.kind, fromDay + i * cycleDays, draw);
        now = stepStock(now, staple, ev?.supply ?? 1);
    }
    return now;
}

// ---- the quote ---------------------------------------------------------------------------------------------
export const scarcityFactor = (stock, par) => round4(clamp(1 + DIALS.scarcity.slope * (par - stock) / par, DIALS.scarcity.floor, DIALS.scarcity.ceiling));

/**
 * Worth of one unit here and now, before the keeper's margin: base x place x season x event x shelf.
 * `parts` name each input so the quote can say why (ECR5); `cause` is the biggest mover as the keeper would tell it.
 */
export function worthHere({vendorId, goodId, base, stock, day, season, draw}) {
    const staple = stapleOf(vendorId, goodId);
    if(!staple) return null;
    const place = STAPLES[vendorId].place, kind = KINDS[staple.kind], placeRow = PLACES[place];
    const placeF = placeRow.worth[staple.kind], seasonF = kind.season[season] ?? 1, ev = eventFor(place, staple.kind, day, draw);
    const shelfF = scarcityFactor(stock, staple.par);
    const parts = [
        {id: 'place', factor: placeF, why: placeRow.worthWhy[staple.kind]},
        {id: 'season', factor: seasonF, why: seasonF === 1 ? '' : (kind.seasonWhy[season] ? `${cap(kind.seasonWhy[season])}.` : `${season} moves ${kind.label}.`)},
        {id: 'event', factor: ev?.price ?? 1, why: ev ? `${cap(ev.say)}.` : '', event: ev?.id ?? null},
        {id: 'shelf', factor: shelfF, why: shelfWhy(stock, staple, ev)}];
    return {worth: base * placeF * seasonF * (ev?.price ?? 1) * shelfF, parts, event: ev, staple, shelf: shelfF};
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
function shelfWhy(stock, staple, ev) {
    const brings = Math.round(staple.supply * (ev?.supply ?? 1));
    if(stock <= 0) return `None on the shelf; ${staple.cart} brings about ${brings}.`;
    if(stock < staple.par * 0.5) return `Only ${stock} left, well under the usual ${staple.par}; ${staple.cart} brings about ${brings}.`;
    if(stock < staple.par) return `${stock} on the shelf, a little under the usual ${staple.par}.`;
    if(stock > staple.par * 1.4) return `${stock} on the shelf, far more than the usual ${staple.par}; people will use it up slowly.`;
    return '';
}

/**
 * Price of ONE unit. side 'buy' = what you pay the keeper, 'sell' = what the keeper pays you.
 * haggle: 0..1, how much of the keeper's margin your skill and name leave (1 = none of it removed).
 * terms: the standing terms' buy/sell multipliers WITHOUT the shortage cause, because the shelf already says that (one cause).
 */
export function unitPrice({vendorId, goodId, side, base, stock, day, season, draw, haggle = 1, terms = {buy: 1, sell: 1}}) {
    const w = worthHere({vendorId, goodId, base, stock, day, season, draw});
    if(!w) return null;
    const margin = 1 + (DIALS.stapleMargin.value - 1) * clamp(haggle, 0, 1);
    const raw = side === 'buy' ? w.worth * margin * terms.buy : w.worth * DIALS.bidShare.value * terms.sell;
    return {price: Math.max(1, Math.ceil(raw - 1e-9)), worth: w.worth, parts: w.parts, event: w.event, staple: w.staple};
}

/**
 * Total for `count` units: each unit is priced at the shelf it meets. Buying walks the shelf down (the next unit costs
 * more); selling walks it up (the keeper needs the next one less). Returns the total and the first and last unit price.
 */
export function lineValue({vendorId, goodId, side, count, ...ctx}) {
    let total = 0, stock = ctx.stock, first = null, last = null;
    for(let i = 0; i < count; i++) {
        const q = unitPrice({vendorId, goodId, side, ...ctx, stock});
        total += q.price; first ??= q.price; last = q.price;
        stock += side === 'buy' ? -1 : 1;
    }
    return {total, first, last};
}

/**
 * The quote's why, from what a keeper standing at the stall could tell you (ECR9, AD6): his shelf, his cart, the season
 * and what is going on locally. Returns a headline plus the contributing sentences, biggest mover first.
 */
export function explainQuote({vendorId, goodId, stock, day, season, draw}) {
    const w = worthHere({vendorId, goodId, base: 1, stock, day, season, draw});
    if(!w) return null;
    const moves = w.parts.filter(p => p.why && Math.abs(Math.log(p.factor)) > 0.02 || p.id === 'shelf' && p.why)
        .sort((a, b) => Math.abs(Math.log(b.factor)) - Math.abs(Math.log(a.factor)));
    const shelfOnly = w.parts.find(p => p.id === 'shelf');
    const ordered = moves.length ? moves : [shelfOnly].filter(p => p?.why);
    const total = round4(w.parts.reduce((n, p) => n * p.factor, 1));
    const mood = total >= 1.08 ? 'dear' : total <= 0.92 ? 'cheap' : 'steady';
    return {goodId, mood, factor: total, shelf: w.shelf, stock, par: w.staple.par, event: w.event?.id ?? null,
        reasons: ordered.map(p => p.why).filter(Boolean),
        nextCart: Math.round(w.staple.supply * (w.event?.supply ?? 1))};
}

// ---- what you remember of a price somewhere else (ECR17, FLR4 consumer) -----------------------------------
/** A remembered price is only a guess once it is old; the caller passes minutes since it was seen. */
export function memoryNote({place, goodId, price, ageDays}) {
    if(!Number.isFinite(price)) return null;
    const when = ageDays <= 0 ? 'today' : ageDays === 1 ? 'yesterday' : `${ageDays} days ago`;
    const stale = ageDays > DIALS.memoryDays.value;
    return `${goodId} in the ${place}: ${price} coins when you last saw it, ${when}${stale ? '; that is a guess by now' : ''}.`;
}
