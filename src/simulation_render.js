// Coalesce state-derived display refreshes, never gameplay/stat calculation.
let batching = false;
const refreshes = new Map();
const validationMemos = new Map();
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
export function beginSimulationRenderBatch() {validationMemos.clear(); batching = true;}
export function endSimulationRenderBatch() {
    batching = false;
    validationMemos.clear();
    const work = [...refreshes.values()]; refreshes.clear();
    for(const render of work) render();
}
