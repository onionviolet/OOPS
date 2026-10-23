import {registerDomain} from './domain_registry.js';
import {current_game_time} from './game_time.js';
import {calendarMinutes} from './world_rhythm.js';
import {routeSpeedGain} from './known_routes.js';
import {createEconomyStandingPanel} from './economy_standing_ui.js';
import * as rules from './economy_standing.js';
// Owner of the economy-standing save slice (G40-G42). State lives here; trade.js and the Known
// Routes panel call in, and the host binds coin movement (the purse stays with economy_domain).
let state = rules.fresh(), ports = {}, panel;
export const bindStandingHost = operations => { ports = {...ports, ...operations}; };
const now = () => { try { return calendarMinutes(current_game_time); } catch { return 0; } };
const set = next => { state = next; panel?.render(); };

export const standingState = () => structuredClone(state);
export const setStandingState = slice => { state = rules.migrateStanding(slice); panel?.render(); };
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
export function claim(lostValue) {
    const {state: next, payout} = rules.claimInsurance(state, lostValue);
    if(payout) ports.addCoins?.(payout, 'insurance payout');
    set(next);
    return payout;
}

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
    const t = now();
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
        insurance: state.insurance, deeds: state.deeds.slice(-5), coins: ports.coins?.() ?? 0};
};

registerDomain({id: 'economy_standing', deps: [], initialState: () => null,
    // Old saves have no slice: start fresh. Only write once something exists.
    save: () => rules.validateStanding(state) && (Object.keys(state.standing).length || Object.keys(state.loans).length ||
        Object.keys(state.memory).length || state.rumours.length || state.insurance || Object.keys(state.traffic).length) ? structuredClone(state) : undefined,
    validate: slice => rules.validateStanding(slice),
    migrate: slice => rules.migrateStanding(slice),
    load: slice => setStandingState(slice),
    tick: tickStanding, refresh: () => panel?.render(), projection: view,
    panels: [() => { panel = createEconomyStandingPanel({read: view, borrow, repay, insure}); }]});
