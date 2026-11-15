// The wolf tide behind Fang Yuan's patrol (RWT1: ri_wolf_tide.js owns the wall's wolves, its phases and riEncounterWeights; the day lane
// owns the nightly yields). This publishes the patrol rows' weights as facts, so the report's seeded draw follows the tide's phase and the
// wolves left at the wall: a peak night brings more large packs, a thinned or ebbing wall more quiet watches. A life with no date keeps
// the static weights (riEncounterWeights' `off` phase is neutral). Its own module because ri_wolf_tide.js imports ri_lead_day_facts.js.
import {riEncounterWeights} from './ri_wolf_tide.js';
import {RI_LEAD_DAY, RI_PATROL_ENCOUNTERS} from './ri_lead_day_facts.js';

export const riPatrolWeightFact = id => `${RI_LEAD_DAY}.weight.${id}`;
export function riLeadDayTideFacts(state) {
    if(state?.actors?.player?.worldId !== 'book.ri.lead.world') return {};
    let w = null;
    try { w = riEncounterWeights(state); } catch { w = null; } // an unreadable wall falls back to the table's own weights
    return Object.fromEntries(RI_PATROL_ENCOUNTERS.map(r => [riPatrolWeightFact(r.id), Number.isFinite(w?.[r.id]) ? w[r.id] : r.weight]));
}
