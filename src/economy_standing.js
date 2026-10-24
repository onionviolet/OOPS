// Standing, credit, insurance, market memory and rumour trust (G41, G42; ECR17-ECR23, AD38).
// Pure rules over plain rows. Every number is a dial with an in-world reason: a default, never a
// law of every world (ECR20: institutions are world data, and a world may have none). The domain
// that owns the state, the clock and the save slice is economy_standing_domain.js.
import {createObligations, writeObligation, obligation} from './obligations_ledger.js';

export const DAY = 1440;
export const STANDING_SCHEMA = 1;
export const LIMITS = Object.freeze({deeds: 20, rumours: 12, memoryPerRegion: 60, traffic: 200, claims: 12});

// Institutions are world data. Each names a rival; a shift moves the rival the other way by
// `backlash` of the amount (Silver Way: 0.6), because friends of one side are read by the other.
export const FACTIONS = Object.freeze({
    market_circle: {label: 'Market Circle', region: 'Village', rival: 'gutter_crews', creditScale: 0.5, interestScale: 1,
        why: 'The Village stall-holders lend small sums against a neighbour\'s word, and talk about who pays.'},
    gutter_crews: {label: 'Gutter Crews', region: 'Slums', rival: 'market_circle', creditScale: 0.3, interestScale: 1.5,
        why: 'Slum crews lend fast and short, and collect with friends.'},
    counting_house: {label: 'Counting-House', region: 'Town', rival: 'gutter_crews', creditScale: 1, interestScale: 1,
        why: 'The Town counting-house keeps dated paper and prices a borrower by their record.'},
});
export const FACTION_BY_REGION = Object.freeze({Village: 'market_circle', Slums: 'gutter_crews', Town: 'counting_house'});
// A vendor may belong to a different house than its region suggests.
export const FACTION_BY_VENDOR = Object.freeze({suspiciousTrader: 'gutter_crews'});

export const DIALS = Object.freeze({
    backlash: {value: 0.6, why: 'A rival house hears of every kindness shown to the other and takes it as a slight, a little less than the kindness itself.'},
    tierCuts: {value: [-60, -20, 20, 60], why: 'Five bands: open dislike, coolness, a stranger, a regular, a name people vouch for.'},
    regionRep: {value: 0.004, cap: 0.06, why: 'Whole-district reputation (hero.reputation) colours prices a little everywhere in that district.'},
    termDays: {value: 28, why: 'A season-month of grace is how long small lenders here wait before they ask twice.'},
    graceDays: {value: 3, why: 'Lenders send word before they act; ECR21 asks for forgiving defaults, never a hidden fail state.'},
    ratchet: {value: 0.02, why: 'A missed term raises that lender\'s rate for the rest of the run (Debt Ledger), the lever nobody can avoid.'},
    overdueSell: {value: 0.94, buy: 1.05, why: 'While you are late, the house marks down what you sell it and marks up what it sells you.'},
    staleDays: {value: 20, why: 'A price you saw three weeks ago is a guess now (Silver Way agents mark entries stale after 20 days).'},
    lieRate: {value: 0.25, why: 'Talk on the road is partly true; about one rumour in four is invented or garbled.'},
    appraisal: {value: 0.65, why: 'An ordinary trader reads a rumour\'s sureness right about two times in three. Appraisal and experience raise it (ECR23).'},
    rumourEvery: {value: 0.5, why: 'Half the days someone repeats a price they heard.'},
    verifyBand: {value: 0.15, why: 'A claimed price within a seventh of what you then see counts as having held up.'},
    roadDanger: {value: {Village: 0.05, Slums: 0.35, Town: 0.1}, other: 0.15, mishap: 0.5, share: 0.1,
        why: 'Arriving somewhere new carries a pickpocket or a dropped load; the Slums bite hardest. Chance per arrival is half the district\'s danger; a mishap costs a tenth of the purse, a little more where it is dangerous.'},
    deductible: {value: 2, why: 'The broker keeps the first coins of any claim so small slips are not worth filing.'},
    claimDays: {value: 3, why: 'Brokers pay on paper: a claim is owed to you now and settled a few days later (ECR21 dated terms).'},
    insuranceRate: {value: 0.05, danger: 8, payout: 0.75, why: 'Premium is 5% of cargo value times (1 + 8 x route danger); a claim pays three quarters (Silver Way).'},
});

// Each tier is one row of multipliers on concrete costs (E2-a).
export const TIERS = Object.freeze([
    {id: 'hostile', label: 'Hostile', sell: 0.88, buy: 1.12, credit: 0, interest: 0.30, why: 'They sell dear and buy cheap, and lend to no one they dislike.'},
    {id: 'cold', label: 'Cold', sell: 0.94, buy: 1.06, credit: 0, interest: 0.24, why: 'Polite, mean, no credit.'},
    {id: 'neutral', label: 'Neutral', sell: 1, buy: 1, credit: 20, interest: 0.16, why: 'A stranger gets a small sum at a plain rate.'},
    {id: 'friendly', label: 'Friendly', sell: 1.04, buy: 0.96, credit: 60, interest: 0.10, why: 'Regulars get a better price and a longer rope.'},
    {id: 'honoured', label: 'Honoured', sell: 1.08, buy: 0.92, credit: 150, interest: 0.05, why: 'Vouched for: best prices, most credit, lowest rate.'},
]);

// Deeds move named factions; one act can pay two (E2-b). `scale` multiplies the amount given.
export const DEEDS = Object.freeze({
    trade: {why: 'Trading with a house\'s merchants builds standing, about one point plus one per 100 coins, up to three.'},
    paid_debt: {amount: 3, why: 'Paying what was owed on time is the best word a borrower can have.'},
    defaulted: {amount: -6, why: 'A missed term is talked about.'},
});

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
export const fresh = () => ({schema: STANDING_SCHEMA, standing: {}, loans: {}, ledger: createObligations(), memory: {},
    rumours: [], insurance: null, claims: [], traffic: {}, deeds: [], rumourDay: -1});

export const tierIndex = score => DIALS.tierCuts.value.filter(cut => score >= cut).length;
export const tierOf = score => TIERS[tierIndex(score)];
export const scoreOf = (state, id) => state.standing[id] ?? 0;
export const factionFor = (region, vendorId) => FACTION_BY_VENDOR[vendorId] ?? FACTION_BY_REGION[region] ?? null;

// Deterministic roll in [0,1) (same hash as household fortunes).
export function roll(seed, id, day) {
    let h = 2166136261;
    for(const ch of `${seed}|${id}|${day}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
    return (h >>> 0) / 4294967296;
}

// ---- standing (G41) ----------------------------------------------------------------------------
export function shiftStanding(state, factionId, amount, deed, now) {
    const faction = FACTIONS[factionId];
    if(!faction || !Number.isFinite(amount) || amount === 0) return state;
    const standing = {...state.standing};
    const moves = [{id: factionId, amount}];
    standing[factionId] = clamp((standing[factionId] ?? 0) + amount, -100, 100);
    if(faction.rival && FACTIONS[faction.rival]) {
        const back = -amount * DIALS.backlash.value;
        standing[faction.rival] = clamp((standing[faction.rival] ?? 0) + back, -100, 100);
        moves.push({id: faction.rival, amount: Math.round(back * 100) / 100, backlash: true});
    }
    for(const k of Object.keys(standing)) standing[k] = Math.round(standing[k] * 100) / 100;
    const deeds = [...state.deeds, {at: now, deed, moves}].slice(-LIMITS.deeds);
    return {...state, standing, deeds};
}

// The price terms for one vendor in one region, as named parts so the player sees why (UR rules:
// visible breakdown). `reputation` is the hero's existing regional reputation map.
export function standingTerms(state, {region, vendorId, reputation = {}, now = 0}) {
    const id = factionFor(region, vendorId), parts = [];
    let sell = 1, buy = 1;
    if(id) {
        const tier = tierOf(scoreOf(state, id)), name = FACTIONS[id].label;
        sell *= tier.sell; buy *= tier.buy;
        parts.push({id: 'tier', label: `${name} · ${tier.label} (${scoreOf(state, id)})`, sell: tier.sell, buy: tier.buy, why: tier.why});
        const loan = state.loans[id];
        if(loan && loanStatus(loan, now).overdue) {
            sell *= DIALS.overdueSell.value; buy *= DIALS.overdueSell.buy;
            parts.push({id: 'overdue', label: `Overdue to ${name}`, sell: DIALS.overdueSell.value, buy: DIALS.overdueSell.buy, why: DIALS.overdueSell.why});
        }
    }
    const rep = reputation[region] ?? 0;
    if(rep) {
        const d = clamp(rep * DIALS.regionRep.value, -DIALS.regionRep.cap, DIALS.regionRep.cap);
        sell *= 1 + d; buy *= 1 - d;
        parts.push({id: 'region', label: `${region} reputation (${rep})`, sell: round4(1 + d), buy: round4(1 - d), why: DIALS.regionRep.why});
    }
    return {factionId: id, parts, sell: round4(sell), buy: round4(buy)};
}
const round4 = n => Math.round(n * 10000) / 10000;

// A completed trade is a deed toward the house whose merchant it was.
export function tradeDeed(state, {region, vendorId, sellValue = 0, buyValue = 0}, now) {
    const id = factionFor(region, vendorId);
    if(!id || sellValue + buyValue <= 0) return state;
    return shiftStanding(state, id, Math.min(3, 1 + Math.floor((sellValue + buyValue) / 100)), 'trade', now);
}

// ---- credit (G42) ------------------------------------------------------------------------------
const termDays = () => DIALS.termDays.value;
export function owedNow(loan, now) {
    const days = Math.max(0, (now - loan.accruedFrom) / DAY);
    return Math.ceil(loan.principal * (1 + loan.rate * days / termDays()));
}
export function loanStatus(loan, now) {
    const daysLeft = Math.ceil((loan.due - now) / DAY);
    return {owed: owedNow(loan, now), daysLeft, overdue: now > loan.due + DIALS.graceDays.value * DAY || loan.missed};
}
export function creditTerms(state, factionId, now) {
    const f = FACTIONS[factionId];
    if(!f) return {eligible: false, reason: 'No such house.'};
    const tier = tierOf(scoreOf(state, factionId));
    const limit = Math.floor(tier.credit * f.creditScale);
    const loan = state.loans[factionId];
    const owed = loan ? owedNow(loan, now) : 0;
    const rate = round4(loan ? loan.rate : tier.interest * f.interestScale);
    const available = Math.max(0, limit - owed);
    return {factionId, label: f.label, tier: tier.label, limit, owed, available, rate, termDays: termDays(),
        eligible: available > 0,
        reason: limit === 0 ? `${f.label} lend nothing to someone they hold ${tier.label.toLowerCase()}.` : available === 0 ? 'Your credit there is used up.' : ''};
}
export function takeLoan(state, factionId, amount, now) {
    const t = creditTerms(state, factionId, now);
    if(!Number.isInteger(amount) || amount < 1) throw Error('Borrow a whole number of coins.');
    if(!t.eligible || amount > t.available) throw Error(t.reason || `${t.label} will lend at most ${t.available} more.`);
    const old = state.loans[factionId];
    // A second loan folds into the first, at the existing (possibly ratcheted) rate and the later due date.
    const principal = (old ? owedNow(old, now) : 0) + amount;
    const loan = {principal, rate: t.rate, takenAt: old?.takenAt ?? now, accruedFrom: now, due: now + termDays() * DAY, missed: false};
    return syncLedger({...state, loans: {...state.loans, [factionId]: loan}}, now);
}
export function repayLoan(state, factionId, amount, now) {
    const loan = state.loans[factionId];
    if(!loan) throw Error('You owe nothing there.');
    const owed = owedNow(loan, now);
    if(!Number.isInteger(amount) || amount < 1) throw Error('Repay a whole number of coins.');
    const pay = Math.min(amount, owed), left = owed - pay;
    const loans = {...state.loans};
    let next;
    if(left === 0) {
        delete loans[factionId];
        next = shiftStanding({...state, loans}, factionId, loan.missed ? 1 : DEEDS.paid_debt.amount, 'paid_debt', now);
    } else {
        loans[factionId] = {...loan, principal: left, accruedFrom: now};
        next = {...state, loans};
    }
    return {state: syncLedger(next, now), paid: pay};
}
// The obligations ledger holds the balance (IM32); loan rows keep only terms. Writes use its API.
export function syncLedger(state, now) {
    let ledger = state.ledger;
    for(const id of Object.keys(FACTIONS)) {
        const loan = state.loans[id];
        ledger = writeObligation(ledger, obligation({id: `credit:${id}`, kind: 'coin', debtor: 'player', creditor: id,
            amount: loan ? owedNow(loan, now) : 0, why: `Borrowed from the ${FACTIONS[id].label}`, source: 'economy_standing',
            since: loan?.takenAt ?? 0, eases: 0, carries: true}));
    }
    for(const r of ledger.rows) if(r.id.startsWith('claim:') && !(state.claims ?? []).some(c => c.id === r.id)) ledger = writeObligation(ledger, {...r, amount: 0});
    for(const c of state.claims ?? []) ledger = writeObligation(ledger, obligation({id: c.id, kind: 'coin', debtor: 'insurer', creditor: 'player',
        amount: c.amount, why: c.why, source: 'economy_standing', since: c.at, eases: 0, carries: false}));
    return {...state, ledger};
}
// Dated consequence (E1-c, ECR21): once past grace, the rate ratchets and standing drops, once.
export function settleDue(state, now) {
    let next = state;
    for(const [id, loan] of Object.entries(state.loans)) {
        if(!loan.missed && now > loan.due + DIALS.graceDays.value * DAY) {
            next = shiftStanding({...next, loans: {...next.loans, [id]: {...loan, missed: true, rate: round4(loan.rate + DIALS.ratchet.value)}}},
                id, DEEDS.defaulted.amount, 'defaulted', now);
        }
    }
    return next === state ? state : syncLedger(next, now);
}

// ---- insurance (G42) ---------------------------------------------------------------------------
export function quoteInsurance(value, danger) {
    const d = DIALS.insuranceRate;
    if(!(value > 0)) return {eligible: false, reason: 'Nothing to insure.'};
    const dg = clamp(danger ?? 0, 0, 1);
    return {eligible: true, value, danger: dg, premium: Math.ceil(value * d.value * (1 + d.danger * dg)), payout: Math.floor(value * d.payout)};
}
export function buyInsurance(state, quote, now, label = 'cargo') {
    if(!quote.eligible) throw Error(quote.reason);
    if(state.insurance) throw Error('One policy at a time.');
    return {...state, insurance: {label, value: quote.value, premium: quote.premium, payout: quote.payout, at: now}};
}

// A road mishap is the loss event a policy pays on (ECR18: theft needs an agent, so it lands where
// agents are). Deterministic from the arrival minute, so a reload cannot reroll it.
export const roadDanger = region => DIALS.roadDanger.value[region] ?? DIALS.roadDanger.other;
export function rollMishap({region, purse, now, seed = 'mishap'}) {
    const danger = roadDanger(region);
    if(!(purse >= 10) || roll(seed, region, now) >= danger * DIALS.roadDanger.mishap) return null;
    const loss = Math.max(1, Math.floor(purse * DIALS.roadDanger.share * (1 + danger)));
    const why = danger >= 0.3 ? `A crew in the ${region} lightened your purse by ${loss}.` : `You lost ${loss} coins on the road into ${region}.`;
    return {loss, region, why};
}
// File a claim for a loss the policy covers: the broker then owes the player (a ledger row) until due.
export function fileClaim(state, loss, now) {
    const p = state.insurance;
    if(!p) return {state, claim: null};
    const covered = Math.min(loss, p.value);
    const amount = Math.max(0, Math.floor(covered * DIALS.insuranceRate.payout) - DIALS.deductible.value);
    const next = {...state, insurance: null};
    if(amount <= 0) return {state: next, claim: null, note: 'The loss was under the deductible.'};
    const claim = {id: `claim:${now}`, amount, at: now, due: now + DIALS.claimDays.value * DAY, why: `Insurance claim for ${p.label}`};
    return {state: syncLedger({...next, claims: [...state.claims, claim].slice(-LIMITS.claims)}, now), claim};
}
// Pays claims whose date has come; returns the coins to hand over.
export function settleClaims(state, now) {
    const due = state.claims.filter(c => c.due <= now);
    if(!due.length) return {state, paid: 0};
    const next = syncLedger({...state, claims: state.claims.filter(c => c.due > now)}, now);
    return {state: next, paid: due.reduce((n, c) => n + c.amount, 0)};
}

// ---- market memory and rumours (G42) -----------------------------------------------------------
// What you know is a record of where you stood (ECR17): a price, the day you saw it, and how.
export function observePrice(state, region, key, price, now, {label = key, via = 'seen'} = {}) {
    if(!region || !(price >= 0)) return state;
    const entries = {...(state.memory[region] ?? {})};
    entries[key] = {price, at: now, via, label};
    const keys = Object.keys(entries);
    if(keys.length > LIMITS.memoryPerRegion) {
        keys.sort((a, b) => entries[a].at - entries[b].at);
        for(const k of keys.slice(0, keys.length - LIMITS.memoryPerRegion)) delete entries[k];
    }
    let next = {...state, memory: {...state.memory, [region]: entries}};
    // A fresh sighting settles any open rumour about the same thing.
    next = {...next, rumours: next.rumours.map(r => r.region === region && r.key === key && r.verdict == null
        ? {...r, verdict: Math.abs(price - r.claim) <= r.claim * DIALS.verifyBand.value ? 'held' : 'false', checkedAt: now} : r)};
    return next;
}
export function memoryRows(state, now) {
    const rows = [];
    for(const [region, entries] of Object.entries(state.memory)) for(const [key, e] of Object.entries(entries))
        rows.push({region, key, label: e.label, price: e.price, via: e.via, ageDays: Math.floor((now - e.at) / DAY),
            stale: now - e.at > DIALS.staleDays.value * DAY});
    return rows.sort((a, b) => a.ageDays - b.ageDays || (a.key < b.key ? -1 : 1));
}
// At most one new rumour per day, drawn from something you have actually seen. The save holds the
// truth; the player-facing view (rumourView) shows only how sure it sounds, read through appraisal.
export function drawRumour(state, now, seed = 'rumour') {
    const day = Math.floor(now / DAY);
    if(day === state.rumourDay) return state;
    let next = {...state, rumourDay: day};
    const rows = memoryRows(state, now);
    if(!rows.length || roll(seed, 'gate', day) >= DIALS.rumourEvery.value) return next;
    const pick = rows[Math.floor(roll(seed, 'pick', day) * rows.length)];
    const honest = roll(seed, 'lie', day) >= DIALS.lieRate.value;
    const claim = honest ? pick.price : Math.max(1, Math.round(pick.price * (roll(seed, 'skew', day) < 0.5 ? 0.6 : 1.4)));
    const reads = roll(seed, 'read', day) < DIALS.appraisal.value;
    const sounds = (honest === reads) ? 'sure' : 'shaky';
    const row = {id: `r${day}`, region: pick.region, key: pick.key, label: pick.label, claim, honest, sounds, at: now, verdict: null};
    next.rumours = [...next.rumours, row].slice(-LIMITS.rumours);
    return next;
}
export const rumourView = (state) => state.rumours.map(({honest, ...shown}) => ({...shown,
    text: `${shown.label} fetches about ${shown.claim} in ${shown.region}`}));

// ---- validation --------------------------------------------------------------------------------
export function validateStanding(slice) {
    if(slice == null) return slice;
    const bad = m => { throw Error(`Standing: ${m}`); };
    if(slice.schema !== STANDING_SCHEMA) bad('unknown schema.');
    for(const [id, n] of Object.entries(slice.standing ?? {})) if(!FACTIONS[id] || !Number.isFinite(n) || n < -100 || n > 100) bad('bad standing row.');
    for(const [id, l] of Object.entries(slice.loans ?? {})) {
        if(!FACTIONS[id]) bad('unknown lender.');
        for(const k of ['principal', 'rate', 'takenAt', 'accruedFrom', 'due']) if(!Number.isFinite(l[k]) || l[k] < 0) bad('bad loan.');
    }
    if(!slice.ledger || slice.ledger.family !== 'obligations@1') bad('bad ledger.');
    if(!Array.isArray(slice.rumours) || slice.rumours.length > LIMITS.rumours) bad('too many rumours.');
    if(!Array.isArray(slice.claims ?? []) || (slice.claims ?? []).length > LIMITS.claims) bad('too many claims.');
    if(!Array.isArray(slice.deeds) || slice.deeds.length > LIMITS.deeds) bad('too many deeds.');
    for(const entries of Object.values(slice.memory ?? {})) if(Object.keys(entries).length > LIMITS.memoryPerRegion) bad('memory too large.');
    if(Object.keys(slice.traffic ?? {}).length > LIMITS.traffic) bad('traffic too large.');
    return slice;
}
export function migrateStanding(slice) {
    if(slice == null) return fresh();
    return {...fresh(), ...structuredClone(slice), schema: STANDING_SCHEMA};
}
