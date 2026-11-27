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
let anchor = null, innSleepBodyId = null;
const keeping = state => {
    if(innSleepBodyId&&state.actors?.player?.worldId===WORLD
        &&state.simulation?.people?.player?.body?.id===innSleepBodyId)return true;
    const known=state.simulation?.knowledge?.player||{};
    if(Object.keys(known).some(k=>k.startsWith(`${RI_LEAD_DAY}.`)))return true;
    if(['started','departed','stone_recovered','stone_started'].some(n=>known[`book.ri.lead.first_night_choice.${n}`]))return true;
    const start=known['book.ri.lead.early_recovery.started'],end=known['book.ri.lead.early_recovery.ready'];
    return !!start&&!known['book.ri.lead.refinement.recovery']&&(!end||end.at===state.clock);
};
// Called by native paid-room Sleep after its access/work guards. Older earned
// rooms need no household knowledge note; their elapsed recovery starts here.
export function beginRiInnSleepRecovery(state) {
    const body=state?.simulation?.people?.player?.body;
    if(state?.actors?.player?.worldId!==WORLD||!body?.id||body.ownerId!=='player'
        ||body.controllerId!=='player'||!Number.isSafeInteger(state.clock)||state.clock<0
        ||!state.simulation.energies?.player?.[ESSENCE])return false;
    const active=keeping(state);
    innSleepBodyId=body.id;
    if(!active||anchor==null||anchor>state.clock)anchor=state.clock;
    return true;
}
// Pure settlement, exported for tests: {reserve, anchor} after `now`, for a pool of `capacity` parts that gains one part each `per` minutes.
export function settleSea({reserve, capacity, anchor: from, now, per}) {
    if(from == null || from > now || reserve >= capacity) return {reserve, anchor: now};
    const parts = Math.floor((now - from) / per), add = Math.min(parts, capacity - reserve);
    return {reserve: reserve + add, anchor: reserve + add >= capacity ? now : from + parts * per};
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
    save: () => anchor == null ? undefined : {schema: 1, at: anchor,
        ...(innSleepBodyId?{innSleepBodyId}:{})},
    load: slice => {anchor = valid(slice) ? slice.at : null;
        innSleepBodyId=valid(slice)&&typeof slice.innSleepBodyId==='string'&&slice.innSleepBodyId
            ?slice.innSleepBodyId:null;},
    stage: stageSea});
