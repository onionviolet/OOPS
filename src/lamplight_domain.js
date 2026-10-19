import {registerDomain} from './domain_registry.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {get_current_light_level} from './weather.js';
import {setReadingLightReader} from './reveal_chain.js';
// Lamplight (M4, PF52 proposal, 2026-10-19). One cause, three readers: a lit oil lamp held in the
// pack adds light to the hero's place. Combat in the dark reads it through the hero light sources,
// reading pace reads it through reveal_chain, and lamplit inspection reads it here. The domain owns
// only lit state, the oil left in the lamp and what lamplight has shown; items stay native.
export const LAMP = 'Oil lamp', OIL = 'Lamp oil';
// Proposal dials: how much light, how long a flask burns, and what a dark place shows by lamplight.
export const LAMP_LIGHT = 40, FLASK_MINUTES = 240;
export const LAMPLIGHT_DETAILS = Object.freeze({
    'Cave depths': Object.freeze({light: 50, minutes: 20, reveals: 'Suspicious wall',
        text: 'By lamplight you make out pale dust and loose mortar along one wall of the depths, with cold air seeping through the cracks. Something lies behind it.'}),
});
let state = null, ports = null;
const fresh = () => ({schema: 1, lit: false, oil: 0, noticed: {}});
export function lamplightState() { return state; }
export function setLamplightState(value) { state = value ?? fresh(); }

export function validateLamplight(slice) {
    if (slice == null) return;
    if (slice.schema !== 1 || typeof slice.lit !== 'boolean' || !Number.isFinite(slice.oil) || slice.oil < 0 || slice.oil > FLASK_MINUTES
        || typeof slice.noticed !== 'object' || slice.noticed === null || Array.isArray(slice.noticed)) throw Error('Invalid lamplight slice.');
    if (slice.lit && slice.oil <= 0) throw Error('A lit lamp needs oil.');
    for (const [place, minutes] of Object.entries(slice.noticed))
        if (!LAMPLIGHT_DETAILS[place] || !Number.isFinite(minutes) || minutes < 0 || minutes > LAMPLIGHT_DETAILS[place].minutes) throw Error('Invalid lamplight notice.');
}

const held = () => ports.count(LAMP) > 0;
const shining = () => !!state?.lit && !!ports && held();
const duration = minutes => { const m = Math.max(0, Math.round(minutes)); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; };
// Light at the hero's place from every source (lamp, living gear). The hero owns the sum.
function placeLight() {
    const ambient = get_current_light_level(), bonus = ports.actor?.()?.nativeLightBonus?.() ?? 0;
    return {ambient, bonus, light: Math.min(100, ambient + bonus)};
}

export function configureLamplight(operations) {
    ports = operations;
    // Test stubs of the tools ports may carry no hero; the game's hero always has light sources.
    ports.actor?.()?.setNativeLightSource?.('lamplight', () => shining() ? LAMP_LIGHT : 0);
    setReadingLightReader(placeLight);
}

// MR4/AR7: a quote reads only.
export function quoteLamp() {
    const out = {eligible: false, reason: '', action: null, spend: 0, oil: state.oil};
    if (!held()) return {...out, reason: 'You need an oil lamp in your pack.'};
    if (!ports.writable()) return {...out, reason: 'Saving is paused, so the lamp cannot change now.'};
    if (state.lit) return {...out, eligible: true, action: 'out'};
    if (state.oil > 0) return {...out, eligible: true, action: 'light'};
    if (ports.count(OIL) < 1) return {...out, reason: 'Your lamp is dry and you have no lamp oil.'};
    return {...out, eligible: true, action: 'light', spend: 1};
}

// One native rollback boundary and one durable save write, as the tools domain does.
function commit(mutate) {
    const transaction = beginNativeCraftTransaction({owners: ports.itemOwners(), bindings: [{get: () => state, set: setLamplightState}]});
    try { mutate(); ports.persist(() => transaction.markDurable()); }
    catch (error) { if (transaction.status === 'pending') transaction.rollback(); throw error; }
    finally { ports.refresh(); }
}
export function executeLamp(quoted) {
    const q = quoteLamp();
    if (!q.eligible) throw Error(q.reason);
    if (q.action !== quoted.action || q.spend !== quoted.spend || q.oil !== quoted.oil) throw Error('The lamp changed since you chose. Try again.');
    if (q.spend) ports.assertSpend(OIL);
    commit(() => {
        if (q.spend) ports.removeItem(OIL, q.spend);
        state = {...state, lit: q.action === 'light', oil: q.spend ? FLASK_MINUTES : state.oil};
    });
    ports.logMessage(q.action === 'out' ? `You put out your oil lamp, with ${duration(state.oil)} of oil left in it.`
        : `You ${q.spend ? 'fill and ' : ''}light your oil lamp: about ${duration(state.oil)} of light.`);
    return q;
}

function notice(minutes) {
    const place = ports.location(), detail = LAMPLIGHT_DETAILS[place];
    if (!detail || ports.locationRevealed(detail.reveals)) return;
    const seen = state.noticed[place] ?? 0;
    if (seen >= detail.minutes || placeLight().light < detail.light) return;
    const next = Math.min(detail.minutes, seen + minutes);
    state = {...state, noticed: {...state.noticed, [place]: next}};
    if (next < detail.minutes) return;
    ports.logMessage(detail.text);
    ports.revealLocation(detail.reveals);
}
function tick(minutes) {
    if (!state || !ports?.writable() || !(minutes > 0)) return;
    if (state.lit && !held()) {
        state = {...state, lit: false};
        ports.logMessage('Without the oil lamp in your pack, its light is gone.');
        ports.refresh();
    }
    // Any light counts for inspection, whatever its source; a lamp only lights the minutes it burns.
    const burned = state.lit ? Math.min(minutes, state.oil) : 0;
    notice(state.lit ? burned : minutes);
    if (!state.lit) return;
    state = {...state, oil: state.oil - burned};
    if (state.oil <= 0) {
        state = {...state, lit: false, oil: 0};
        ports.logMessage('Your oil lamp gutters out. It needs lamp oil to burn again.');
        ports.refresh();
    }
}

function project() {
    const light = ports ? placeLight() : null;
    return {lit: !!state?.lit, shining: shining(), oil: state?.oil ?? 0, held: !!ports && held(), noticed: {...state?.noticed}, light};
}

const useItem = {accepts: key => { try { return JSON.parse(key).id === LAMP; } catch { return false; } }, quote: () => quoteLamp(), execute: executeLamp};
registerDomain({id: 'lamplight', deps: [], initialState: () => null,
    save: () => state && (state.lit || state.oil > 0 || Object.keys(state.noticed).length) ? structuredClone(state) : undefined,
    validate: slice => validateLamplight(slice),
    // Old saves have no slice: an unlit, empty lamp and nothing noticed. No invented history.
    migrate: slice => slice == null ? fresh() : structuredClone(slice),
    load: setLamplightState, tick,
    commands: {quote: quoteLamp, execute: executeLamp, useItem},
    projection: project,
});
