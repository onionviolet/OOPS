// Derived, world-neutral wake times. The caller owns time and actor state;
// rebuild registrations from that state after load (AR3, LSD138, LSD143).
const minute = value => {
    if (!Number.isSafeInteger(value) || value < 0) throw new TypeError('Wake time must be a nonnegative safe integer.');
};
const before = (a, b) => a.at < b.at || a.at === b.at && a.id < b.id;

export function createWakeQueue() {
    const heap = [], positions = new Map();
    function swap(a, b) {
        [heap[a], heap[b]] = [heap[b], heap[a]];
        positions.set(heap[a].id, a); positions.set(heap[b].id, b);
    }
    function up(index) {
        while (index > 0) {
            const parent = (index - 1) >> 1;
            if (!before(heap[index], heap[parent])) break;
            swap(index, parent); index = parent;
        }
        return index;
    }
    function down(index) {
        for (;;) {
            let child = index * 2 + 1;
            if (child >= heap.length) return;
            if (child + 1 < heap.length && before(heap[child + 1], heap[child])) child++;
            if (!before(heap[child], heap[index])) return;
            swap(index, child); index = child;
        }
    }
    function cancel(id) {
        const index = positions.get(id);
        if (index === undefined) return false;
        const last = heap.pop(); positions.delete(id);
        if (index < heap.length) {
            heap[index] = last; positions.set(last.id, index);
            down(up(index));
        }
        return true;
    }
    return {
        get size() { return heap.length; },
        register(id, at) {
            if (typeof id !== 'string' || !id.length) throw new TypeError('A wake needs an actor id.');
            minute(at);
            cancel(id);
            positions.set(id, heap.length); heap.push({id, at}); up(heap.length - 1);
        },
        cancel,
        // An overdue actor wakes now. Reading does not consume registrations.
        nextWake(now) { minute(now); return heap.length ? Math.max(now, heap[0].at) : null; },
        // Drain due actors before invoking them, so a callback can register its
        // next wake without being consumed again in this batch. Stable code-unit
        // id ordering avoids locale and registration-order dependence (LSD139).
        due(now) {
            minute(now);
            const result = [];
            while (heap.length && heap[0].at <= now) {
                const entry = heap[0]; cancel(entry.id); result.push({...entry});
            }
            return result;
        },
    };
}
