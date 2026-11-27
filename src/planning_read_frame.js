// One unchanged synchronous planning phase, never an engine-tick cache.
// Read-only consumers share a snapshot. Consumers that amend actor frames must
// request a copy. Invalidation also drops nested builder snapshots.
// Native actor frames also carry borrowed query capabilities (for example, a
// presence reader evaluated at settlement time). Keep those functions by
// identity while detaching the plain mutable frame data. This copy is transient;
// persisted state still uses the ordinary structured-clone validation boundary.
function mutableSnapshot(value, seen = new Map()) {
    if (typeof value !== 'object' || value === null) return value;
    if (seen.has(value)) return seen.get(value);
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== Array.prototype) {
        const copy = structuredClone(value); seen.set(value, copy); return copy;
    }
    const copy = Array.isArray(value) ? new Array(value.length) : {};
    seen.set(value, copy);
    for (const key of Object.keys(value)) Object.defineProperty(copy, key,
        {value: mutableSnapshot(value[key], seen), writable: true, enumerable: true, configurable: true});
    return copy;
}
export function createPlanningReadFrame() {
    const values = new Map();
    return {
        read(key, build, {mutable = false} = {}) {
            if(!values.has(key)) values.set(key, build());
            return mutable ? mutableSnapshot(values.get(key)) : values.get(key);
        },
        invalidate() {values.clear();}
    };
}
