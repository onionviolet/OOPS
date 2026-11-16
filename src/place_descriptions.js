// A place's description that changes with what happened there (PS143, proposal under AD56). A world registers a line source for one
// place id; the native location's getDescription (models/location.js) appends what the sources say to its base text, read at render.
// No state is kept here: each source reads the live state through the getter the composition root passes in. A source that throws
// or returns nothing adds nothing. The box draws on arrival, a move or a load, and redraws on the registry's refresh when its text has
// changed since (refreshPlaceDescription).
import {registerDomain} from './domain_registry.js';

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
// The describer a place draws through. It remembers what it last drew, so a refresh can redraw the box when the line has changed since
// (a street's hour passes, a patrol is counted) instead of waiting for the next arrival or load.
let lastDrawn = null, redraw = null;
export const placeDescriber = (placeId, base, getState) => {
    const read = () => describePlace(placeId, base, getState?.());
    return () => { const text = read(); lastDrawn = {read, text}; return text; };
};
// The shell's port that redraws the current place (name and description). Set once by the composition side; null leaves boxes as drawn.
export const setPlaceRedraw = fn => { redraw = typeof fn === 'function' ? fn : null; };
export function refreshPlaceDescription() {
    if(!redraw || !lastDrawn) return false;
    let text; try { text = lastDrawn.read(); } catch { return false; }
    if(text === lastDrawn.text) return false;
    lastDrawn.text = text; // once per change, even when the place now shown draws no describer
    redraw(); return true;
}
registerDomain({id: 'place_descriptions', refresh: refreshPlaceDescription});
