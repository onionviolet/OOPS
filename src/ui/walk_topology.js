// Give each adjacent step its own column. Prefer the parent branch's order when
// assigning rows, so routes read from the current place towards their neighbors.
export function walkTopology(places, neighbors) {
    const known = new Set(places.map(place => place.id));
    const edges = new Map(), near = new Map(places.map(place => [place.id, []]));
    for (const {id} of places) {
        for (const to of neighbors(id)) {
            if (to === id || !known.has(to)) continue;
            const key = JSON.stringify([id, to].sort());
            if (edges.has(key)) {
                if (edges.get(key).from !== id) edges.get(key).both = true;
                continue;
            }
            edges.set(key, {from:id, to});
            near.get(id).push(to);
            near.get(to).push(id);
        }
    }
    const start = places.find(place => place.here)?.id;
    const depth = new Map([[start, 0]]);
    const queue = [start];
    for (const id of queue) {
        for (const to of near.get(id) || []) {
            if (depth.has(to)) continue;
            depth.set(to, depth.get(id) + 1);
            queue.push(to);
        }
    }
    const layers = [];
    for (const id of queue) (layers[depth.get(id)] ??= []).push(id);
    const outside = places.map(place => place.id).filter(id => !depth.has(id));
    if (outside.length) layers.push(outside);
    return {layers, edges:[...edges.values()], outside};
}
