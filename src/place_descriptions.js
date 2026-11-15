// A place's description that changes with what happened there (PS143, proposal under AD56). A world registers a line source for one
// place id; the native location's getDescription (models/location.js) appends what the sources say to its base text, read at render.
// No state is kept here: each source reads the live state through the getter the composition root passes in. A source that throws
// or returns nothing adds nothing. The box redraws when the place is drawn (arrival, a move, a load), not on every tick.
const sources = new Map();
export function registerPlaceDescription(placeId, line) {
    if(typeof placeId !== 'string' || typeof line !== 'function') throw Error('A place description source needs a place id and a function.');
    sources.set(placeId, [...(sources.get(placeId) || []), line]);
    return () => sources.set(placeId, (sources.get(placeId) || []).filter(f => f !== line));
}
export function describePlace(placeId, base, state) {
    const extra = [];
    for(const line of sources.get(placeId) || []) { try { const t = line(state); if(typeof t === 'string' && t.trim()) extra.push(t.trim()); } catch { /* a broken source adds nothing */ } }
    return [String(base || '').trim(), ...extra].filter(Boolean).join(' ');
}
export const placeDescriber = (placeId, base, getState) => () => describePlace(placeId, base, getState?.());
