// Bridge: pursuit routes + what the seat knows -> a range track on the chase spec (combat_situation.js chaseSituation output).
// Pure. Range is route-minutes between the pursuer's last-seen place and the seat's place, by the cheapest chain of the pursuit policy's routes.
// The pursuer's true position is private: the caller passes `pursuerSeenAt` only when the seat has seen or sensed it (a lead), else the track says
// "unknown" instead of guessing. Routes are {from, to, minutes}; place labels come from the caller, an unlabelled place shows as "somewhere".
function shortest(routes, from, to) {
    if(from === to) return {minutes: 0, path: [from]};
    const best = new Map([[from, {minutes: 0, path: [from]}]]), todo = new Set([from]);
    while(todo.size) {
        const at = [...todo].sort((a, b) => best.get(a).minutes - best.get(b).minutes || a.localeCompare(b))[0];
        todo.delete(at);
        for(const r of routes.filter(r => r.from === at)) {
            const minutes = best.get(at).minutes + r.minutes;
            if(!best.has(r.to) || minutes < best.get(r.to).minutes) {best.set(r.to, {minutes, path: [...best.get(at).path, r.to]}); todo.add(r.to);}
        }
    }
    return best.get(to) ?? null;
}
const minutesText = m => m <= 0 ? 'here' : m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`;

/** spec: chaseSituation() result (or null). opts: routes, here (seat's place id), pursuerSeenAt (place id or null), labelOf(placeId) -> string | null. */
export function withPursuitRange(spec, {routes = [], here, pursuerSeenAt = null, labelOf = () => null} = {}) {
    if(!spec) return null;
    const notes = spec.notes.filter(n => !/^Distance:/.test(n.text));
    const route = pursuerSeenAt && here ? shortest(routes, pursuerSeenAt, here) : null;
    if(!route) return {...spec, notes: [{state: 'unknown', text: pursuerSeenAt ? 'Range: no way for them to reach you that you know of.' : 'Range: you have not seen where they are.'}, ...notes]};
    const name = p => labelOf(p) ?? 'somewhere';
    const steps = route.path.map((p, i) => ({label: i === 0 ? `${name(p)} (last seen)` : i === route.path.length - 1 ? `${name(p)} (you)` : name(p),
        state: i === 0 ? 'current' : i === route.path.length - 1 ? 'done' : 'pending'}));
    return {...spec, tracks: [...spec.tracks, {id: 'range', label: `Range: ${minutesText(route.minutes)} by the usual routes`, steps}],
        notes: [{text: route.minutes <= 0 ? 'Last seen right where you are. That may have changed.' : `Last seen ${minutesText(route.minutes)} away by the usual routes. That may have changed.`}, ...notes]};
}
