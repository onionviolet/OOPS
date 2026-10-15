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
export function beginSimulationRenderBatch() {validationMemos.clear(); batching = true;}
export function endSimulationRenderBatch(frameKey) {
    batching = false;
    validationMemos.clear();
    const work = [...refreshes.values()]; refreshes.clear();
    withSimulationFrame(frameKey, () => {for(const render of work) render();});
}
