// The wolf tide behind Fang Yuan's patrol (RWT1: ri_wolf_tide.js owns the wall's wolves, its phases and riEncounterWeights; the day lane
// owns the nightly yields). This publishes the patrol rows' weights as facts, so the report's seeded draw follows the tide's phase and the
// wolves left at the wall: a peak night brings more large packs, a thinned or ebbing wall more quiet watches. A life with no date keeps
// the static weights (riEncounterWeights' `off` phase is neutral). Its own module because ri_wolf_tide.js imports ri_lead_day_facts.js.
import {riEncounterWeights, riWolfTidePhase, riWolfTidePhaseLine, riWolfTideView, RI_WOLF_SPECIES} from './ri_wolf_tide.js';
import {registerPlaceDescription} from './place_descriptions.js';
import {RI_LEAD_DAY, RI_PATROL_ENCOUNTERS} from './ri_lead_day_facts.js';

export const riPatrolWeightFact = id => `${RI_LEAD_DAY}.weight.${id}`;
// The tide's phase for any rule that gates on it ('off', 'early', 'peak' or 'ebb'; asked for by the Gu-world time session).
export const RI_TIDE_PHASE_FACT = 'book.ri.lead.wolf_tide.phase';
export function riLeadDayTideFacts(state) {
    if(state?.actors?.player?.worldId !== 'book.ri.lead.world') return {};
    let w = null;
    try { w = riEncounterWeights(state); } catch { w = null; } // an unreadable wall falls back to the table's own weights
    let phase = 'off';
    try { phase = riWolfTidePhase(state).id; } catch { phase = 'off'; }
    return {[RI_TIDE_PHASE_FACT]: phase, ...Object.fromEntries(RI_PATROL_ENCOUNTERS.map(r => [riPatrolWeightFact(r.id), Number.isFinite(w?.[r.id]) ? w[r.id] : r.weight]))};
}

// PS143: the clan academy, where his day is kept, reads how the wall stands. The tide's words are ri_wolf_tide.js's own (one owner);
// a dateless life says nothing, since "the packs have gone back" would not be true there. A wall hunted below half its wolves says so.
export const RI_ACADEMY = 'book.ri.lead.academy';
export function riAcademyTideLine(state) {
    if(state?.actors?.player?.worldId !== 'book.ri.lead.world') return '';
    const phase = riWolfTidePhase(state);
    if(!phase.dated) return '';
    const row = riWolfTideView(state).rows.find(r => r.id === RI_WOLF_SPECIES.ordinary);
    const thinned = phase.active && row && row.cap > 0 && row.left * 2 < row.cap;
    return `${riWolfTidePhaseLine(phase)}${thinned ? ' The watch has thinned this stretch of the wall; fewer wolves come close.' : ''}`;
}
registerPlaceDescription(RI_ACADEMY, riAcademyTideLine);
