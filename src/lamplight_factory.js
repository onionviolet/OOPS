import {beginNativeCraftTransaction} from './native_craft_transaction.js';
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
const fresh = () => ({schema: 1, lit: false, oil: 0, noticed: {}});
export function validateLamplight(slice) {
    if (slice == null) return;
    if (slice.schema !== 1 || typeof slice.lit !== 'boolean' || !Number.isFinite(slice.oil) || slice.oil < 0 || slice.oil > FLASK_MINUTES
        || typeof slice.noticed !== 'object' || slice.noticed === null || Array.isArray(slice.noticed)) throw Error('Invalid lamplight slice.');
    if (slice.lit && slice.oil <= 0) throw Error('A lit lamp needs oil.');
    for (const [place, minutes] of Object.entries(slice.noticed))
        if (!LAMPLIGHT_DETAILS[place] || !Number.isFinite(minutes) || minutes < 0 || minutes > LAMPLIGHT_DETAILS[place].minutes) throw Error('Invalid lamplight notice.');
}

// No registration, native clocks or shared readers are installed by importing/constructing
// this factory. The supplied host owns every operation and callback destination.
export function createLamplightDomain(operations) {
    let state = fresh(), ports = null, readingInterval = null, disposed = false;
    const releases = [];
    function lamplightState() { return state; }
    function setLamplightState(value) { state = value ?? fresh(); readingInterval = null; }
    const held = () => ports.count(LAMP) > 0;
    const shining = () => !!state?.lit && !!ports && held();
    const duration = minutes => { const m = Math.max(0, Math.round(minutes)); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; };
    // Light at the hero's place from every source (lamp, living gear). The hero owns the sum.
    function placeLight() {
        const ambient = ports.ambientLight(), bonus = ports.actor?.()?.nativeLightBonus?.() ?? 0;
        return {ambient, bonus, light: Math.min(100, ambient + bonus)};
    }
    const clockPosition = () => ports.clockPosition();
    function readingLight(minutes) {
        const light = placeLight(), interval = readingInterval;
        // A transient record of this clock publication, not banked study or saved light. Load,
        // commands, custody/place changes and the next native minute cannot reuse it.
        if (!interval || minutes !== interval.minutes || interval.state !== state || interval.at !== clockPosition()
            || interval.place !== ports.location() || interval.held !== held()) return light;
        return {...light, intervals: interval.parts};
    }

    // Installers belong to the supplied native/test host and return scoped disposers.
    function detach() {
        for (const release of releases.splice(0).reverse()) release();
        readingInterval = null;
    }
    function configure(operations) {
        if (disposed) throw Error('This lamplight domain is disposed.');
        detach();
        ports = operations;
        try {
            for (const [name, reader] of [['bindLightSource', () => shining() ? LAMP_LIGHT : 0], ['bindReadingLightReader', readingLight]]) {
                const release = ports[name](reader);
                if (typeof release !== 'function') throw Error(`Lamplight ${name} needs a disposer.`);
                releases.push(release);
            }
        } catch (error) { detach(); ports = null; throw error; }
    }
    function dispose() {
        if (disposed) return;
        detach(); ports = null; disposed = true;
    }

    // MR4/AR7: a quote reads only.
    function quoteLamp() {
        const out = {eligible: false, reason: '', action: null, spend: 0, oil: state?.oil ?? 0};
        if (disposed || !ports) return {...out, reason: 'This lamplight domain is inactive.'};
        if (!held()) return {...out, reason: 'You need an oil lamp in your pack.'};
        if (!ports.writable()) return {...out, reason: 'The game cannot take changes right now (it may be saving, loading or paused). Try the lamp again in a moment.'};
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
        finally { ports.refresh(); ports.refreshPanel?.(); }
    }
    function executeLamp(quoted) {
        const q = quoteLamp();
        if (!q.eligible) throw Error(q.reason);
        if (q.action !== quoted.action || q.spend !== quoted.spend || q.oil !== quoted.oil) throw Error('The lamp changed since you chose. Try again.');
        if (q.spend) ports.assertSpend(OIL);
        commit(() => {
            readingInterval = null;
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
        readingInterval = null;
        if (!state || !ports?.writable() || !(minutes > 0)) return;
        if (state.lit && !held()) {
            state = {...state, lit: false};
            ports.logMessage('Without the oil lamp in your pack, its light is gone.');
            ports.refresh(); ports.refreshPanel?.();
        }
        // Any light counts for inspection, whatever its source; a lamp only lights the minutes it burns.
        const burned = state.lit ? Math.min(minutes, state.oil) : 0;
        const before = placeLight();
        notice(state.lit ? burned : minutes);
        if (!state.lit) { ports.refreshPanel?.(); return; }
        state = {...state, oil: state.oil - burned};
        if (state.oil <= 0) {
            state = {...state, lit: false, oil: 0};
            ports.logMessage('Your oil lamp gutters out. It needs lamp oil to burn again.');
            ports.refresh();
        }
        const after = placeLight();
        // An independent source can still support inspection after this lamp expires.
        if (minutes > burned) notice(minutes - burned);
        readingInterval = {at: clockPosition(), place: ports.location(), held: held(), state, minutes,
            parts: [{...before, minutes: burned}, {...after, minutes: minutes - burned}]};
        ports.refreshPanel?.();
    }

    function project() {
        const light = ports ? placeLight() : null;
        return {lit: !!state?.lit, shining: shining(), oil: state?.oil ?? 0, held: !!ports && held(), noticed: {...state?.noticed}, light};
    }
    // Read-only panel seam. Reuses the domain projection and exposes no new state or commands.
    function lamplightPresentation() { return project(); }

    const useItem = {accepts: key => { try { return JSON.parse(key).id === LAMP; } catch { return false; } }, quote: () => quoteLamp(), execute: executeLamp};
    const domain = Object.freeze({id: 'lamplight', deps: [], initialState: () => null,
        save: () => state && (state.lit || state.oil > 0 || Object.keys(state.noticed).length) ? structuredClone(state) : undefined,
        validate: slice => validateLamplight(slice),
        // Old saves have no slice: an unlit, empty lamp and nothing noticed. No invented history.
        migrate: slice => slice == null ? fresh() : structuredClone(slice),
        load: setLamplightState, tick,
        commands: {quote: quoteLamp, execute: executeLamp, useItem},
        projection: project,
        configure, dispose, getState: lamplightState, setState: setLamplightState,
    });
    if (operations) configure(operations);
    return domain;
}
