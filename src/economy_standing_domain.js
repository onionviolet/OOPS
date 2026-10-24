import {registerDomain} from './domain_registry.js';
import {current_game_time} from './game_time.js';
import {calendarMinutes} from './world_rhythm.js';
import {routeSpeedGain} from './known_routes.js';
import {current_location, travel_times, pathWear} from './runtime_state.js';
import {createEconomyStandingPanel} from './economy_standing_ui.js';
import * as rules from './economy_standing.js';
import {chargeGrudge, grudgeNow} from './craft_grudge.js';
// Owner of the economy-standing save slice (G40-G42). State lives here; trade.js and the Known
// Routes panel call in, and the host binds coin movement (the purse stays with economy_domain).
let state = rules.fresh(), ports = {}, panel;
export const bindStandingHost = operations => { ports = {...ports, ...operations}; };
const now = () => { try { return calendarMinutes(current_game_time); } catch { return 0; } };
const set = next => { state = next; panel?.render(); };

export const standingState = () => structuredClone(state);
// Crafting's spoiled steeps write their grudge row into this slice's obligations ledger (IM32).
export function chargeCraftGrudge() { set({...state, ledger: chargeGrudge(state.ledger, now())}); }
export const craftGrudge = () => grudgeNow(state.ledger, now());
export const setStandingState = slice => { state = rules.migrateStanding(slice); lastPlace = null; for(const k of Object.keys(travel_times)) delete travel_times[k]; panel?.render(); };
export const termsFor = (region, vendorId, reputation) => rules.standingTerms(state, {region, vendorId, reputation, now: now()});

// After a committed trade: a deed toward the vendor's house, and what the prices looked like.
export function recordTrade({region, vendorId, sellValue, buyValue, seen = []}) {
    let next = rules.tradeDeed(state, {region, vendorId, sellValue, buyValue}, now());
    for(const s of seen) next = rules.observePrice(next, region, s.key, s.price, now(), {label: s.label, via: 'traded'});
    set(next);
}
export const creditView = () => Object.keys(rules.FACTIONS).map(id => rules.creditTerms(state, id, now()));
export function borrow(factionId, amount) {
    const next = rules.takeLoan(state, factionId, amount, now());
    if(!ports.addCoins) throw Error('Coin purse is not bound.');
    ports.addCoins(amount, `credit:${factionId}`);
    set(next);
}
export function repay(factionId, amount) {
    if((ports.coins?.() ?? 0) < 1) throw Error('You have no coins to repay with.');
    const loan = state.loans[factionId];
    const want = Math.min(amount, ports.coins(), loan ? rules.owedNow(loan, now()) : 0);
    const {state: next, paid} = rules.repayLoan(state, factionId, want, now());
    ports.addCoins(-paid, `repay:${factionId}`);
    set(next);
    return paid;
}
export function insure(value, danger, label) {
    const quote = rules.quoteInsurance(value, danger);
    const next = rules.buyInsurance(state, quote, now(), label);
    if((ports.coins?.() ?? 0) < quote.premium) throw Error(`The premium is ${quote.premium} coins.`);
    ports.addCoins(-quote.premium, 'insurance premium');
    set(next);
}
// G40: every journey leg you make builds its path. The path finder reads the factor, so travel
// minutes, the shown times and the Region view all shorten together; cached times are dropped when a
// leg's gain changes so the next lookup is recomputed.
const legKey = (from, to) => `path:${from}>${to}`;
const worn = (from, to) => 1 - routeSpeedGain(state.traffic[legKey(from, to)] ?? 0);
pathWear.factor = worn;
let lastPlace = null;
function arrived(to, from) {
    const key = legKey(from, to), before = routeSpeedGain(state.traffic[key] ?? 0);
    if(!(key in state.traffic) && Object.keys(state.traffic).length >= rules.LIMITS.traffic) return;
    state = {...state, traffic: {...state.traffic, [key]: (state.traffic[key] ?? 0) + 1}};
    if(routeSpeedGain(state.traffic[key]) !== before) for(const k of Object.keys(travel_times)) delete travel_times[k];
}
// The loss event a policy pays on: a road mishap on arrival (see rules.rollMishap). Everyone can
// suffer it; only an insured traveller files a claim, which the broker owes through the ledger.
function mishap(region, t) {
    const hit = rules.rollMishap({region, purse: ports.coins?.() ?? 0, now: t});
    if(!hit) return;
    ports.addCoins(-hit.loss, 'road mishap');
    let next = state, note = '';
    if(state.insurance) {
        const {state: filed, claim, note: n} = rules.fileClaim(state, hit.loss, t);
        next = filed; note = claim ? ` Your policy files a claim: ${claim.amount} coins owed in ${Math.round((claim.due - t) / rules.DAY)} days.` : ` ${n || ''}`;
    }
    state = next; ports.log?.(hit.why + note);
}
export const routeWearRows = () => Object.entries(state.traffic).filter(([k]) => k.startsWith('path:'))
    .map(([k, count]) => ({leg: k.slice(5).replace('>', ' to '), count, gain: routeSpeedGain(count)})).sort((a, b) => b.count - a.count);

// G40: Known Routes calls this when a route command is sent.
export function recordRouteTraffic(routeId) {
    if(typeof routeId !== 'string' || !routeId) return;
    const traffic = {...state.traffic};
    if(!(routeId in traffic) && Object.keys(traffic).length >= rules.LIMITS.traffic) return;
    traffic[routeId] = (traffic[routeId] ?? 0) + 1;
    set({...state, traffic});
}
export const routeTraffic = routeId => {
    const count = state.traffic[routeId] ?? 0;
    return {count, gain: routeSpeedGain(count)};
};

export function tickStanding() {
    const t = now(), here = current_location?.id ?? null;
    if(here && lastPlace && here !== lastPlace) { arrived(here, lastPlace); if(typeof current_location.market_region === 'string' && current_location.market_region) mishap(current_location.market_region, t); }
    lastPlace = here;
    const {state: paidState, paid} = rules.settleClaims(state, t);
    if(paid) { state = paidState; ports.addCoins(paid, 'insurance claim'); ports.log?.(`The broker pays your claim: ${paid} coins.`); }
    let next = rules.settleDue(state, t);
    next = rules.drawRumour(next, t);
    if(next !== state) set(next);
}
const view = () => {
    const t = now();
    return {state, now: t,
        factions: Object.entries(rules.FACTIONS).map(([id, f]) => ({id, ...f, score: rules.scoreOf(state, id), tier: rules.tierOf(rules.scoreOf(state, id)),
            rivalLabel: rules.FACTIONS[f.rival]?.label, loan: state.loans[id] ? rules.loanStatus(state.loans[id], t) : null})),
        credit: creditView(), ledger: state.ledger.rows, memory: rules.memoryRows(state, t), rumours: rules.rumourView(state),
        insurance: state.insurance, claims: state.claims, wear: routeWearRows(), deeds: state.deeds.slice(-5), coins: ports.coins?.() ?? 0};
};

registerDomain({id: 'economy_standing', deps: [], initialState: () => null,
    // Old saves have no slice: start fresh. Only write once something exists.
    save: () => rules.validateStanding(state) && (Object.keys(state.standing).length || Object.keys(state.loans).length ||
        Object.keys(state.memory).length || state.ledger.rows.length || state.rumours.length || state.insurance || state.claims.length || Object.keys(state.traffic).length) ? structuredClone(state) : undefined,
    validate: slice => rules.validateStanding(slice),
    migrate: slice => rules.migrateStanding(slice),
    load: slice => setStandingState(slice),
    tick: tickStanding, refresh: () => panel?.render(), projection: view,
    panels: [() => { panel = createEconomyStandingPanel({read: view, borrow, repay, insure}); }]});
