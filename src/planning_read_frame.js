// One unchanged synchronous planning phase, never an engine-tick cache.
// Read-only consumers share a snapshot. Consumers that amend actor frames must
// request a copy. Invalidation also drops nested builder snapshots.
export function createPlanningReadFrame() {
    const values = new Map();
    return {
        read(key, build, {mutable = false} = {}) {
            if(!values.has(key)) values.set(key, build());
            return mutable ? structuredClone(values.get(key)) : values.get(key);
        },
        invalidate() {values.clear();}
    };
}
