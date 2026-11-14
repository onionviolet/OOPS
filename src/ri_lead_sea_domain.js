// Fang Yuan's sea refills on its own (coordinator follow-up to the ordinary-day build, 2026-11-14; Weibao asked whether stones are the
// only way). A Gu master's primeval sea recovers at the pace his aptitude sets (gu_aperture.js: C grade 4 points of the aperture an
// hour, stated, ch10); stones are the fast route. His lead life compiles no regeneration event and its base hash is pinned, so the
// recovery is settled here, in the domain stage hook every expansion write passes through, before the save is built (AR1, AR3).
// Exact over any split: whole parts are added and the anchor moves by whole parts, so one long write (banked or away time spent through
// the same plans, TMR4) gives what many short ones give. A full sea banks nothing: the anchor moves to now.
// Default: on from his first act of the ordinary day (any `book.ri.lead.day.*` note), so verified story replays keep their numbers.
// Dial: the aptitude's grade row in APERTURE_LAW. Save slice `ri_lead_sea` = {schema: 1, at} (the last settled minute); absent loads fresh
// and gains nothing for time before it (no retroactive essence).
import {registerDomain} from './domain_registry.js';
import {RI_LEAD_DAY, riSeaMinutesPerPart} from './ri_lead_day_facts.js';

const WORLD = 'book.ri.lead.world', ESSENCE = 'book.ri.lead.primeval';
let anchor = null;
const keeping = state => Object.keys(state.simulation?.knowledge?.player || {}).some(k => k.startsWith(`${RI_LEAD_DAY}.`));
// Pure settlement, exported for tests: {reserve, anchor} after `now`, for a pool of `capacity` parts that gains one part each `per` minutes.
export function settleSea({reserve, capacity, anchor: from, now, per}) {
    if(from == null || from > now || reserve >= capacity) return {reserve, anchor: now};
    const parts = Math.floor((now - from) / per), add = Math.min(parts, capacity - reserve);
    return {reserve: reserve + add, anchor: add < parts ? now : from + parts * per};
}
export function stageSea(plan) {
    const state = plan?.state, e = state?.simulation?.energies?.player?.[ESSENCE];
    if(state?.actors?.player?.worldId !== WORLD || !e || !keeping(state)) {anchor = null; return;}
    const capacity = e.policy?.capacity;
    if(!Number.isSafeInteger(capacity) || capacity <= 0 || capacity > 100) return;
    const next = settleSea({reserve: e.reserve, capacity, anchor, now: state.clock, per: riSeaMinutesPerPart(capacity)});
    e.reserve = next.reserve; anchor = next.anchor;
}
const valid = slice => slice?.schema === 1 && Number.isSafeInteger(slice.at) && slice.at >= 0;
registerDomain({id: 'ri_lead_sea', initialState: () => null,
    save: () => anchor == null ? undefined : {schema: 1, at: anchor},
    load: slice => {anchor = valid(slice) ? slice.at : null;},
    stage: stageSea});
