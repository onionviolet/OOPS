// Coalesce state-derived display refreshes, never gameplay/stat calculation.
let batching = false;
const refreshes = new Map();
export function deferSimulationRender(key, render) {
    if(!batching) return false;
    refreshes.set(key, render);
    return true;
}
export function beginSimulationRenderBatch() {batching = true;}
export function endSimulationRenderBatch() {
    batching = false;
    const work = [...refreshes.values()]; refreshes.clear();
    for(const render of work) render();
}
