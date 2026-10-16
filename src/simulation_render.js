// Coalesce state-derived display refreshes, never gameplay/stat calculation.
let batching = false;
const refreshes = new Map();
const validationMemos = new Map();
// One pass over an unchanged world: a publication's panel renders, or the renders a
// dev-stepping batch coalesced. Each named read builds once per pass, every caller
// gets its own copy, and reuse ends once the world key (expansion state) changes.
let frame = null;
// Only pure, immutable-input checks may use this per-advance cache.
export function simulationValidationMemo(check) {
    if(!batching) return null;
    if(!validationMemos.has(check)) validationMemos.set(check, new Map());
    return validationMemos.get(check);
}
export function deferSimulationRender(key, render) {
    if(!batching) return false;
    refreshes.set(key, render);
    return true;
}
export function withSimulationFrame(key, run) {
    const outer = frame; frame = {key, values: new Map()};
    try {return run();} finally {frame = outer;}
}
export function framedSimulationRead(key, name, build, copy) {
    if(!frame || frame.key !== key) return build();
    if(!frame.values.has(name)) frame.values.set(name, build());
    return copy(frame.values.get(name));
}
// simulationFacts reads only its arguments (state, registry and the context's own
// fields), so inside a frame over that same state a call whose context matches an
// earlier one field by field, two levels deep, gets a copy of that build. Callers
// spread fresh contexts, so identity is never the key. The sequence and clock check
// stops reuse if a render ever mutated the frame state in place.
const plain = v => v !== null && typeof v === 'object' && (Array.isArray(v) || Object.getPrototypeOf(v) === Object.prototype);
const snapshot = v => !plain(v) ? v : Array.isArray(v) ? [...v] : {...v};
function sameLevel(a, b, deeper) {
    if(a === b) return true;
    if(!deeper || !plain(a) || !plain(b) || Array.isArray(a) !== Array.isArray(b)) return false;
    const keys = Object.keys(a);
    if(keys.length !== Object.keys(b).length) return false;
    for(const k of keys) if(!Object.hasOwn(b, k) || !sameLevel(a[k], b[k], deeper - 1)) return false;
    return true;
}
export function framedSimulationFacts(state, context, registry, build) {
    if(!frame || frame.key !== state) return build();
    const rows = frame.facts ||= new Map(), id = `${context.actorId}\u0000${context.targetId ?? ''}`;
    let list = rows.get(id); if(!list) rows.set(id, list = []);
    for(const row of list) if(row.registry === registry && row.sequence === state.sequence && row.clock === state.clock && sameLevel(row.context, context, 2)) return {...row.value};
    const value = build();
    list.push({registry, sequence: state.sequence, clock: state.clock, value,
        context: Object.fromEntries(Object.entries(context).map(([k, v]) => [k, snapshot(v)]))});
    return {...value};
}
export function beginSimulationRenderBatch() {validationMemos.clear(); batching = true;}
export function endSimulationRenderBatch(frameKey) {
    batching = false;
    validationMemos.clear();
    const work = [...refreshes.values()]; refreshes.clear();
    withSimulationFrame(frameKey, () => {for(const render of work) render();});
}
// A hidden document keeps ticking, simulating and saving; only display refreshes wait.
// Each skipped refresh (latest per key) runs once in the visibilitychange task that
// reveals the document, before its first visible frame paints.
const hiddenRefreshes = new Map();
let revealBound = false;
export const documentHidden = () => typeof document !== 'undefined' && document.hidden === true;
export function deferWhileHidden(key, refresh) {
    if(!documentHidden()) return false;
    hiddenRefreshes.set(key, refresh);
    if(!revealBound) {revealBound = true; document.addEventListener('visibilitychange', revealHiddenRefreshes);}
    return true;
}
export function revealHiddenRefreshes() {
    if(documentHidden()) return;
    const work = [...hiddenRefreshes.values()]; hiddenRefreshes.clear();
    for(const refresh of work) {
        try {refresh();} catch(error) {console.error('A display could not refresh after the tab became visible.', error);}
    }
}
