// PS164 (round 16, proposal; Discord F17): a travel map for the native frontier, scoped to places with known walking
// times. Pure adapter: the host passes fast travel's own shortest-path minutes (`paths.find_shortest_paths`), the
// direct exits, and which places the character knows; this returns the view `walkMapSpec` (src/ui/walk_map.js) draws.
// Only known places reach the view (SR9). Owners with adjacency can supply a route diagram.
//
// Default: every known place within `maxMinutes` (dial, default 8 hours) shows; a direct exit is a move ("go"), a
// further known place is a fast-travel move ("travel"), each with its minutes. Generated maps come later (F17).

/**
 * hereId: current location id. distances: {placeId: minutes} from fast travel's pathfinder. exits: [{id, minutes}].
 * known(id): the character knows the place (unlocked, not locked). label(id): its shown name. Returns {places, legs}.
 */
export function nativeWalkView({hereId, distances = {}, exits = [], known = () => true, label = id => id, describe, neighbors, maxMinutes = 480}) {
    const direct = new Map(exits.filter(e => known(e.id)).map(e => [e.id, e.minutes]));
    const away = Object.entries(distances)
        .filter(([id, minutes]) => id !== hereId && known(id) && Number.isFinite(minutes) && minutes > 0 && minutes <= maxMinutes)
        .map(([id, minutes]) => ({id, minutes: direct.get(id) ?? Math.round(minutes)}))
        .sort((a, b) => a.minutes - b.minutes || label(a.id).localeCompare(label(b.id)));
    for(const [id, minutes] of direct) if(!away.some(p => p.id === id)) away.push({id, minutes});
    const places = [{place: label(hereId), here: true, minutes: 0}, ...away.map(p => ({place: label(p.id), here: false, minutes: p.minutes}))];
    const legs = away.map(p => ({to: label(p.id), minutes: p.minutes, moveId: `${direct.has(p.id) ? 'go' : 'travel'}:${p.id}`, eligible: true, reasons: []}));
    if (!neighbors) return {places, legs};
    const ids = [hereId, ...away.map(p => p.id)];
    const graph = places.map((place, i) => ({...place, id:ids[i], ...(describe?.(ids[i]) || {}), moveId:legs[i - 1]?.moveId}));
    return {places, legs, graph, neighbors};
}

/** The host's command for a picked map place: {kind: 'go'|'travel', id}. */
export function readWalkMove(moveId) {
    const m = /^(go|travel):(.+)$/.exec(String(moveId || ''));
    return m ? {kind: m[1], id: m[2]} : null;
}
