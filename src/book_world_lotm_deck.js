// Tingen daily deck (FD16 layer 3) and two calendar events (layer 1), original small cards for the quiet hours of an early-Tingen life.
// Read-only and save-free: the draw is derived from the game seed and the lead's clock (storylet_deck2.js), so the same seed and day give the
// same cards on every read. Nothing here reveals a sealed truth; every card is ordinary city texture, flavour only in this slice.
// Not wired yet (no host edit allowed this slice): effects through the knowledge, mood or purse ports, and choices through a LOTM act.
// Reads: state.lotm.initializedAt (day 1 = arrival, the same epoch as lotmDay/lotmLight), the heat and positions projections.
// Place is NOT a weight input here: a past slot's place cannot be rebuilt from a derived deck, so a place weight needs a saved draw record
// (see the returned save note). Heat and position are slow facts read as of now and, for a stable history, applied to every slot alike.
import {LOTM_IDS} from './book_world_lotm_ids.js';
import {worldLight, TINGEN_LIGHT} from './world_light.js';
import {positionsOf} from './positions.js';
import {domainRegistry} from './domain_registry.js';
import {runDeck2, validateDeck2} from './storylet_deck2.js';

const DAY = 1440, SLOT = 360, SLOTS_PER_DAY = DAY / SLOT;
// Dials (default, reason):
//   weekday phase: day 1 is the arrival day. The market is on day 3 of 7, the service on day 7, the landlord's week turns on day 5. Reason: the
//   source weekday of arrival is not pinned for this slice; a world calendar row can replace these three numbers later.
export const TINGEN_WEEK = Object.freeze({market: 3, service: 7, rent: 5});
// How many past days of lines the Events list may carry (the list keeps only 8 rows overall, and ambient lines should not crowd real news).
export const SHOW_DAYS = 2, SHOW_CARDS = 3;
const m = (...v) => v;
const NIGHT = m(0, 3), MORN = m(1), AFT = m(2), EVE = m(3);
// slotOfDay: 0 = 00-06, 1 = 06-12, 2 = 12-18, 3 = 18-24 (lead-relative clock, as lotmLight reads it).
const card = (id, text, o = {}) => ({id: `tingen.${id}`, text, ...o});
export const TINGEN_CARDS = Object.freeze([
    card('coal_smoke_fog', 'Fog off the river thickens with coal smoke. The gas lamps become soft yellow smudges and every footstep seems to come from somewhere else.',
        {needs: {fog: true}, weight: 3, plus: [{when: {slotOfDay: 3}, add: 1}]}),
    card('lamplighter', 'A lamplighter works his way down the street with his long pole, one small flame at a time, and does not look up.',
        {needs: {slotOfDay: m(3, 0)}, weight: 2}),
    card('cab_in_the_dark', 'A cab goes by too fast for the fog. You hear the horse and the wheels long before the lamps show you anything.',
        {needs: {fog: true, slotOfDay: NIGHT}, weight: 2}),
    card('constable_lantern', 'A constable\'s lantern lingers on you a moment longer than it needs to, then moves on.',
        {needs: {night: true}, weight: .5, plus: [{when: {heat: m(1, 2, 3)}, mult: 6}]}),
    card('headline_coal', 'The news-stand headline is about the price of coal and the temper of the dockers. A clerk beside you reads it twice and sighs.',
        {needs: {slotOfDay: m(1, 2)}, weight: 2.5}),
    card('headline_shipping', 'Someone has left yesterday\'s paper on the bench, folded open at the shipping notices and a long column of arrivals.',
        {needs: {slotOfDay: m(1, 2)}, weight: 1.5, plus: [{when: {market: true}, add: 1}]}),
    card('chestnut_seller', 'A woman with a brazier sells hot chestnuts at the corner, calling the price in a voice the fog does not muffle.',
        {needs: {slotOfDay: m(2, 3)}, weight: 2, plus: [{when: {market: true}, add: 2}, {when: {fog: true}, add: 1}]}),
    card('market_noise', 'The market street is loud with carts, bargaining and a boy shouting the day\'s cabbage price over everyone else.',
        {needs: {market: true, slotOfDay: m(1, 2)}, weight: 5}),
    card('street_singer', 'A street singer works the market crowd with a cracked, cheerful song about a sailor who never came home to pay his debts.',
        {needs: {market: true, slotOfDay: m(2, 3)}, weight: 3}),
    card('church_bell', 'A church bell tolls across the rooftops, and the people on the street drift in the same direction without anyone saying why.',
        {needs: {slotOfDay: m(1, 2)}, weight: .5, plus: [{when: {service: true}, add: 6}]}),
    card('service_hats', 'Families in their good coats pass by on the way to the service, children walking carefully so as not to scuff their boots.',
        {needs: {service: true, slotOfDay: MORN}, weight: 4}),
    card('neighbour_stairs', 'Your neighbour is on the stairs again, talking to nobody in particular about draughts, bills and the state of the landing.',
        {needs: {slotOfDay: m(0, 1, 3)}, weight: 1.5, cooldown: 16}),
    card('landlord_step', 'The landlord\'s heavy step crosses the hall below. Every door on the stair stays shut a little longer than usual.',
        {needs: {rentWeek: true, slotOfDay: m(1, 3)}, weight: 3, plus: [{when: {slotOfDay: 1}, add: 1}]}),
    card('clerks_hurry', 'Clerks hurry past with their collars up, each one carrying the same thin expression of a man afraid of being late.',
        {needs: {slotOfDay: MORN, weekdayWork: true}, weight: 2, plus: [{when: {position: 'Civil staff'}, add: 2}]}),
    card('ferry_horn', 'A ferry horn sounds from the river, low and long, and somewhere a dog answers it.',
        {needs: {slotOfDay: m(0, 1)}, weight: 1.5, plus: [{when: {fog: true}, add: 1.5}]}),
]);
export const TINGEN_DECK = validateDeck2({id: 'tingen.daily', slotMinutes: SLOT, quiet: 3, cooldown: 12, dry: {after: 3, relief: .5, floor: .15}, cards: TINGEN_CARDS});
const text = (id, e) => `${id}:${e}`;

const gated = state => state?.actors?.player?.worldId === LOTM_IDS.world && Number.isFinite(state.lotm?.initializedAt) && Number.isFinite(state.clock);
export const tingenDeckSeed = state => state.simulation?.seed ?? state.streams?.root ?? 1;

// Slow facts: read once as of now and applied to every slot, so a past slot's draw does not change as the player walks around.
export function slowFacts(state, {heat = () => domainRegistry.project('heat'), positions = positionsOf} = {}) {
    let level = 0, roles = [];
    try { level = Math.max(0, ...((heat()?.heat) || []).map(h => h.level || 0)); } catch { /* heat not registered */ }
    try { roles = positions(state).filter(r => !r.ended).map(r => r.role); } catch { /* no positions source */ }
    return {heat: level, position: roles};
}
export function slotFacts(slot, slow = {heat: 0, position: []}) {
    const slotOfDay = slot % SLOTS_PER_DAY, day = Math.floor(slot / SLOTS_PER_DAY) + 1, dow = (day - 1) % 7 + 1;
    const light = worldLight(((slot * SLOT + SLOT / 2) % DAY) / DAY, TINGEN_LIGHT);
    return {slotOfDay, day, dow, night: light.night, fog: !!light.fog, market: dow === TINGEN_WEEK.market, service: dow === TINGEN_WEEK.service,
        rentWeek: dow === TINGEN_WEEK.rent, weekdayWork: dow !== TINGEN_WEEK.service, ...slow};
}
export const tingenSlot = state => Math.max(0, Math.floor((state.clock - state.lotm.initializedAt) / SLOT));
// Layer 1: scheduled from the clock, never weighted or rerolled. Returns the calendar events that have begun on day `day`.
export const calendarEventsOn = day => {
    const dow = (day - 1) % 7 + 1, out = [];
    if(dow === TINGEN_WEEK.market) out.push({id: 'market', hour: 8, text: 'Market day: the stalls are up along the main street and the carts are in early.'});
    if(dow === TINGEN_WEEK.service) out.push({id: 'service', hour: 7, text: 'Service day: the church bells start early and most shops stay shut until the afternoon.'});
    return out;
};
// Every draw so far (for tests and a future "why this" hover).
export function tingenDraws(state, readers) {
    if(!gated(state)) return [];
    const slow = slowFacts(state, readers), upto = tingenSlot(state);
    return runDeck2(TINGEN_DECK, tingenDeckSeed(state), upto, s => slotFacts(s, slow), JSON.stringify(slow));
}
// The feed adapter: news rows {id, at, text}. Empty outside a Tingen life.
export function tingenDeckNews(state, readers) {
    if(!gated(state)) return [];
    const epoch = state.lotm.initializedAt, upto = tingenSlot(state), out = [], byId = new Map(TINGEN_CARDS.map(c => [c.id, c]));
    const draws = tingenDraws(state, readers);
    for(let s = upto, n = 0; s >= 0 && n < SHOW_CARDS && s > upto - SHOW_DAYS * SLOTS_PER_DAY - 1; s--) {
        const d = draws[s];
        if(d?.cardId) { n++; out.push({id: text('tingen:deck', `${d.cardId}@${s}`), at: epoch + s * SLOT, text: byId.get(d.cardId).text}); }
    }
    const today = Math.floor((state.clock - epoch) / DAY) + 1;
    for(let day = Math.max(1, today - SHOW_DAYS + 1); day <= today; day++) for(const e of calendarEventsOn(day)) {
        const at = epoch + (day - 1) * DAY + e.hour * 60;
        if(state.clock >= at) out.push({id: text('tingen:cal', `${e.id}@d${day}`), at, text: e.text});
    }
    return out;
}
