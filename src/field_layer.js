// Physical field layer (G7 proposal, 2026-10-23). Design owner:
// docs/PHYSICAL_FIELD_LAYER_DESIGN_2026-10-23.md. Pure integer rules over stacked levels per place.
// Material is the mixture's own shape (restore/vigor/trace/matrix fractions over a mass), so no
// parallel material system exists. This module imports nothing and owns no clock (AR3).
export const LEVELS = Object.freeze(['floor', 'shelf', 'rafters']);
export const FRACTIONS = Object.freeze(['restore', 'vigor', 'trace', 'matrix']);
// Dials (AD22: per-world defaults, not laws). Heat is flammable load: vigor burns hot, restore poorly.
export const DIALS = Object.freeze({HEAT: Object.freeze({vigor: 10, restore: 4}), IGNITE_HEAT: 200, DAMP_RATIO: 2,
    BURN_RATE: 15, TRACE_RATE: 6, POUR_CAP: 12000, MAX_STEPS: 2880,
    COLLAPSE_AFTER: 10,   // minutes a shelf or rafters level burns before its support gives way
    SPREAD_AFTER: 8,      // minutes a floor burns before fire jumps to a connected place's floor
    OUTDOOR_VENT: 6});    // places at or above this ventilation are open air: rain puts fires out
// Ventilation by place: how fast gas leaves, 1 (closed) to 10 (open air). Unlisted places use `default`.
export const PLACE_VENT = Object.freeze({default: 2, Village: 6, Shack: 3, 'Cave depths': 1, 'Wild willow stand': 7,
    'Eastern mill': 4, 'Eastern storehouse': 2});
export const ventOf = place => PLACE_VENT[place] ?? PLACE_VENT.default;
const fail = m => { throw new Error(m); };
const solid0 = () => ({restore: 0, vigor: 0, trace: 0, matrix: 0});
const level0 = () => ({solid: solid0(), gas: {smoke: 0, fume: 0}, fire: false, burn: 0, fallen: false});
const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
export const heat = l => l.solid.vigor * DIALS.HEAT.vigor + l.solid.restore * DIALS.HEAT.restore;
export const damp = l => l.solid.matrix > DIALS.DAMP_RATIO * heat(l);
export const flammable = l => heat(l) >= DIALS.IGNITE_HEAT && !damp(l);
export const fresh = () => ({schema: 2, places: {}});
export const freshPlace = () => ({poured: 0, vented: 0, collapses: 0, doors: [], levels: LEVELS.map(level0), edges: LEVELS.slice(1).map(() => ({}))});
export const massOf = p => p.levels.reduce((n, l) => n + sum(l.solid) + sum(l.gas), 0);
const isInt = n => Number.isSafeInteger(n) && n >= 0;
export const blocked = (p, edge) => Object.keys(p.edges[edge]).length > 0;

// Saves from the first slice (schema 1) had no edges, burn clocks or fallen levels: fill the defaults.
export function upgradeFields(slice) {
    if (slice == null || slice.schema !== 1) return slice;
    const places = {};
    for (const [id, p] of Object.entries(slice.places ?? {})) places[id] = {...p, collapses: 0, doors: [], edges: LEVELS.slice(1).map(() => ({})),
        levels: (p.levels ?? []).map(l => ({...l, burn: l.fire ? 1 : 0, fallen: false}))};
    return {schema: 2, places};
}
export function validateFields(slice) {
    if (slice == null) return;
    if (slice.schema !== 2 || !slice.places || typeof slice.places !== 'object' || Array.isArray(slice.places) || Object.keys(slice).length !== 2) fail('Invalid field slice.');
    for (const [id, p] of Object.entries(slice.places)) {
        if (!id || !isInt(p?.poured) || !isInt(p.vented) || !isInt(p.collapses) || !Array.isArray(p.doors) || p.doors.some(d => typeof d !== 'string' || !d) || !Array.isArray(p.levels) || p.levels.length !== LEVELS.length
            || !Array.isArray(p.edges) || p.edges.length !== LEVELS.length - 1) fail('Invalid field place.');
        for (const e of p.edges) for (const [source, left] of Object.entries(e ?? {})) if (!source || !(left === null || isInt(left) && left > 0)) fail('Invalid field source.');
        p.levels.forEach((l, i) => {
            if (Object.keys(l.solid ?? {}).sort().join() !== 'matrix,restore,trace,vigor' || Object.keys(l.gas ?? {}).sort().join() !== 'fume,smoke'
                || Object.values(l.solid).some(v => !isInt(v)) || Object.values(l.gas).some(v => !isInt(v)) || typeof l.fire !== 'boolean'
                || !isInt(l.burn) || typeof l.fallen !== 'boolean') fail('Invalid field level.');
            if (l.fire && heat(l) === 0) fail('A burning level needs flammable stock.');
            if (l.fallen && (i === 0 || l.fire || sum(l.solid))) fail('A fallen level holds nothing.');
        });
        if (p.poured !== massOf(p) + p.vented) fail('Field mass is not conserved.');
        if (massOf(p) > DIALS.POUR_CAP) fail('Field place exceeds its capacity.');
    }
}

// One whole minute for one place. Order is fixed: sources age, fall, burn, collapse, spread, buoyancy,
// vent. No random input, so advance(a + b) equals advance(a) then advance(b). `rain` puts out fires
// that have no roof (open-air places).
export function stepPlace(place, vent, {rain = false} = {}) {
    const p = structuredClone(place), L = p.levels, E = p.edges;
    for (const e of E) for (const [s, left] of Object.entries(e)) if (left !== null) { if (left <= 1) delete e[s]; else e[s] = left - 1; }
    for (let i = L.length - 1; i > 0; i--) {
        if (blocked(p, i - 1)) continue;
        for (const k of FRACTIONS) {
            const move = L[i].fallen ? L[i].solid[k] : Math.ceil(L[i].solid[k] / 4);
            L[i].solid[k] -= move; L[i - 1].solid[k] += move;
        }
    }
    for (const l of L) if (l.fire) {
        if (rain && vent >= DIALS.OUTDOOR_VENT) { l.fire = false; l.burn = 0; continue; }
        if (damp(l) || heat(l) === 0) { l.fire = false; l.burn = 0; continue; }
        let burn = DIALS.BURN_RATE;
        for (const k of ['vigor', 'restore']) { const n = Math.min(burn, l.solid[k]); l.solid[k] -= n; burn -= n; l.gas.smoke += n; }
        const t = Math.min(DIALS.TRACE_RATE, l.solid.trace); l.solid.trace -= t; l.gas.fume += t;
        l.burn++;
        if (heat(l) === 0) { l.fire = false; l.burn = 0; }
    }
    // A support that has burned long enough gives way: what it held drops one level, and the level is gone.
    for (let i = 1; i < L.length; i++) if (L[i].fire && !L[i].fallen && L[i].burn >= DIALS.COLLAPSE_AFTER) {
        for (const k of FRACTIONS) { L[i - 1].solid[k] += L[i].solid[k]; L[i].solid[k] = 0; }
        for (const g of ['smoke', 'fume']) { L[i - 1].gas[g] += L[i].gas[g]; L[i].gas[g] = 0; }
        L[i].fire = false; L[i].burn = 0; L[i].fallen = true; p.collapses++;
        if (heat(L[i - 1]) > 0 && !damp(L[i - 1])) L[i - 1].fire = true;
    }
    const lit = L.map(l => l.fire);
    for (let i = 0; i < L.length; i++) if (lit[i]) for (const [j, edge] of [[i - 1, i - 1], [i + 1, i]]) {
        if (L[j] && !L[j].fallen && !L[j].fire && !blocked(p, edge) && flammable(L[j])) L[j].fire = true;
    }
    const smoke = L.map(l => Math.ceil(l.gas.smoke / 3)), fume = L.map(l => Math.ceil(l.gas.fume / 3));
    for (let i = 0; i < L.length - 1; i++) if (!blocked(p, i)) { L[i].gas.smoke -= smoke[i]; L[i + 1].gas.smoke += smoke[i]; }
    for (let i = 1; i < L.length; i++) if (!blocked(p, i - 1)) { L[i].gas.fume -= fume[i]; L[i - 1].gas.fume += fume[i]; }
    for (const l of L) for (const g of ['smoke', 'fume']) if (l.gas[g] > 0) {
        const out = Math.min(l.gas[g], Math.max(1, Math.ceil(l.gas[g] * vent / 10))); l.gas[g] -= out; p.vented += out;
    }
    return p;
}

// Steps whole minutes across all places, stopping at settle (nothing changed). `neighbors(id)` names
// places joined by a doorway (a place keeps the doorways recorded where stock was spilled; a door joins both ways): fire at a burning floor jumps to a neighbour's flammable floor after
// SPREAD_AFTER minutes. `watch` names the place where the player stands; its per-minute exposure comes
// back for the host to apply (the layer itself never touches a person). The MAX_STEPS bound is
// technical: a place at the pour cap settles well inside it (tested), so the bound drops no outcome.
export function advance(state, minutes, {ventFor = ventOf, neighbors = null, watch = null, rain = false} = {}) {
    if (!Number.isSafeInteger(minutes) || minutes < 0) fail('Invalid field minutes.');
    const exposure = {minutes: 0, burning: 0, smoke: 0, fume: 0, fell: 0};
    let places = state.places;
    const joined = id => neighbors ? neighbors(id) : [...new Set([...(places[id]?.doors ?? []), ...Object.keys(places).filter(o => places[o].doors.includes(id))])];
    for (let n = Math.min(minutes, DIALS.MAX_STEPS); n > 0; n--) {
        const next = {};
        for (const [id, p] of Object.entries(places)) next[id] = stepPlace(p, ventFor(id), {rain});
        for (const [id, p] of Object.entries(places)) if (p.levels[0].fire && p.levels[0].burn >= DIALS.SPREAD_AFTER) for (const other of joined(id))
            if (next[other] && !next[other].levels[0].fire && flammable(next[other].levels[0])) next[other].levels[0].fire = true;
        if (JSON.stringify(next) === JSON.stringify(places)) break;
        if (watch && next[watch]) {
            const w = next[watch];
            exposure.minutes++; exposure.burning += w.levels[0].fire ? 1 : 0; exposure.smoke += w.levels[0].gas.smoke; exposure.fume += w.levels[0].gas.fume;
            const was = places[watch].levels, now = w.levels; // a collapse lands on the floor when the level above it, or both, give way
            exposure.fell += (!was[1].fallen && now[1].fallen ? 1 : 0) + (!was[2].fallen && now[2].fallen && now[1].fallen ? 1 : 0);
        }
        places = next;
    }
    return {state: {...state, places}, exposure};
}

// Material in, in the mixture's shape: {fractions:{restore,vigor,trace,matrix}, mass}.
function addSolid(p, level, comp, times) {
    if (!LEVELS[level]) fail('Choose a level.');
    if (p.levels[level].fallen) fail('That level has fallen in.');
    if (FRACTIONS.some(k => !isInt(comp.fractions[k])) || sum(comp.fractions) !== comp.mass) fail('Material does not conserve mass.');
    const add = comp.mass * times;
    if (massOf(p) + add > DIALS.POUR_CAP) fail('There is no more room to spill stock here.');
    for (const k of FRACTIONS) p.levels[level].solid[k] += comp.fractions[k] * times;
    p.poured += add;
}
const put = (state, place, p) => ({...state, places: {...state.places, [place]: p}});
export function pour(state, place, level, comp, times = 1, doors = null) {
    const p = structuredClone(state.places[place] ?? freshPlace());
    addSolid(p, level, comp, times);
    if (doors) p.doors = [...new Set([...p.doors, ...doors.filter(d => d && d !== place)])];
    return put(state, place, p);
}
export function ignitable(state, place) {
    const p = state.places[place]; if (!p) return [];
    return p.levels.flatMap((l, i) => flammable(l) && !l.fire ? [i] : []);
}
export function ignite(state, place, level) {
    const p = structuredClone(state.places[place] ?? fail('Nothing is spilled here.'));
    if (!p.levels[level] || !flammable(p.levels[level])) fail('That stock will not catch.');
    p.levels[level].fire = true;
    return put(state, place, p);
}
// Douse puts out the flames on a level and adds inert, damp stock (a pack of Spring water); enough of it keeps the level from catching again.
export function douse(state, place, level, comp) {
    const p = structuredClone(state.places[place] ?? fail('Nothing is spilled here.'));
    addSolid(p, level, comp, 1);
    p.levels[level].fire = false; p.levels[level].burn = 0;
    return put(state, place, p);
}
// A field is a source that blocks passage across one edge between levels (fall, fire spread, gas).
// The edge stays blocked while ANY source remains; `remaining` is minutes, or null for a standing source
// (a barred hatch, a ward) that lasts until it is removed. Last-field removal opens the edge.
export function raiseField(state, place, edge, source, remaining = null) {
    const p = structuredClone(state.places[place] ?? freshPlace());
    if (!p.edges[edge]) fail('Choose an edge between two levels.');
    if (!source || !(remaining === null || isInt(remaining) && remaining > 0)) fail('Invalid field source.');
    p.edges[edge][source] = remaining;
    return put(state, place, p);
}
export function dropField(state, place, edge, source) {
    const p = structuredClone(state.places[place] ?? fail('Nothing is here.'));
    if (!p.edges[edge] || !(source in p.edges[edge])) fail('That field is not here.');
    delete p.edges[edge][source];
    return put(state, place, p);
}
// Sweep removes solid left on levels with no fire or gas; it counts as vented, so mass still balances.
export function sweep(state, place) {
    const p = structuredClone(state.places[place] ?? fail('Nothing is spilled here.'));
    if (p.levels.some(l => l.fire || sum(l.gas))) fail('Wait until the fire and smoke have cleared.');
    for (const l of p.levels) { p.vented += sum(l.solid); l.solid = solid0(); }
    const keep = p.edges.some(e => Object.keys(e).length) || p.levels.some(l => l.fallen);
    const places = {...state.places};
    if (keep) places[place] = p; else delete places[place];
    return {...state, places};
}
export function readPlace(place, id) {
    if (!place) return null;
    const lv = place.levels.map((l, i) => ({level: LEVELS[i], fire: l.fire, smoke: l.gas.smoke, fume: l.gas.fume, stock: sum(l.solid), fallen: l.fallen,
        flammable: flammable(l), damp: damp(l), ash: l.fire ? 0 : l.solid.matrix, burn: l.burn}));
    const edges = place.edges.map((e, i) => ({between: `${LEVELS[i]}/${LEVELS[i + 1]}`, sources: Object.keys(e), blocked: Object.keys(e).length > 0}));
    return {place: id, levels: lv, edges, burning: lv.some(l => l.fire), smoke: lv.reduce((n, l) => n + l.smoke, 0), fume: lv.reduce((n, l) => n + l.fume, 0)};
}
// What a person standing on the floor can read from the place, without changing anything.
export function floorReading(place) {
    if (!place) return {fire: false, smoke: 0, fume: 0, light: 0};
    const smoke = place.levels.reduce((n, l) => n + l.gas.smoke, 0), fire = place.levels.some(l => l.fire);
    return {fire, smoke, fume: place.levels[0].gas.fume, light: fire ? 30 : 0};
}
