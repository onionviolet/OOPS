// One host can release multiple independently timed and recoverable specimens.
// Site and method rules belong to the encounter that supplies these routes.
export function startGuFlight({host, clock, routes}) {
    return {host, at: clock, gu: Object.fromEntries(Object.entries(routes).map(([kind, route]) =>
        [kind, {id: `${host}.${kind}`, site: route.site, until: clock + route.minutes,
            custody: 'wild', resistedAt: null, capturedAt: null}]))};
}

export function fleeingGu(flight, kind, {site, clock}) {
    const gu = flight?.gu[kind];
    return gu?.custody === 'wild' && gu.site === site && clock < gu.until ? gu : null;
}

export function guFlightStatus(gu, clock) {
    if (gu.custody !== 'wild') return gu.custody;
    return clock >= gu.until ? 'lost' : gu.resistedAt === null ? 'fleeing' : 'resisted';
}

export function captureFleeingGu(flight, kind, contact) {
    const gu = fleeingGu(flight, kind, contact);
    if (!gu) throw Error('The Gu is no longer within reach.');
    gu.custody = 'captured';
    gu.capturedAt = contact.clock;
}
