/** YAIR's map prototype spaces connected places by the square root of travel time
 * and rotates unplaced exits around their origin. Store that layout on the places
 * once, so the developer graph and the known-place map share coordinates. */
export function placeMapPositions(places, anchors = {}) {
    const taken = new Set();
    const queue = Object.values(places).filter(location => location.mapPosition);
    for (const {mapPosition: {x, y}} of queue) taken.add(x + ',' + y);
    function place(location, x, y) {
        if (location.mapPosition) return;
        x = Math.round(x);
        y = Math.round(y);
        while (taken.has(x + ',' + y)) y++;
        taken.add(x + ',' + y);
        location.mapPosition = Object.freeze({x, y});
        queue.push(location);
    }
    for (const [id, [x, y]] of Object.entries(anchors)) {
        if (places[id]) place(places[id], x, y);
    }
    let island = 0;
    for (const origin of Object.values(places)) {
        if (!origin.mapPosition) place(origin, island++, 0);
        while (queue.length) {
            const here = queue.shift();
            const exits = here.connected_locations || [];
            exits.forEach(({location, azimuth, travel_time}, i) => {
                const angle = ((azimuth ?? (i * 360 / exits.length)) - 90) * Math.PI / 180;
                const distance = 1 + Math.sqrt(Math.max(0, travel_time || 0)) / 5;
                place(location, here.mapPosition.x + Math.cos(angle) * distance,
                    here.mapPosition.y + Math.sin(angle) * distance);
            });
        }
    }
}

// Direction from coordinate differences, after GauTech/experimental-idle-rpg, src/display.js.
export function exitArrow(from, to) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    return ['→','↘','↓','↙','←','↖','↑','↗'][(Math.round(angle / (Math.PI / 4)) + 8) % 8];
}
