// The wolf tide behind Fang Yuan's patrol (RWT1: ri_wolf_tide.js owns the wall's wolves, its phases and riEncounterWeights; the day lane
// owns the nightly yields). This publishes the patrol rows' weights as facts, so the report's seeded draw follows the tide's phase and the
// wolves left at the wall: a peak night brings more large packs, a thinned or ebbing wall more quiet watches. A life with no date keeps
// the static weights (riEncounterWeights' `off` phase is neutral). Its own module because ri_wolf_tide.js imports ri_lead_day_facts.js.
import {riEncounterWeights, riWolfTidePhase, riWolfTidePhaseLine, riWolfTideView, RI_WOLF_SPECIES, RI_TIDE_DIALS, RI_TIDE_PHASES} from './ri_wolf_tide.js';
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

// PS143 and D5 (SFC20): the clan academy, where his day is kept, reads how the wall stands while a tide is on: the phase and its day,
// about how many wolves are near the wall (the counted pool scaled by the phase's crowd, an estimate), and the tide's own words
// (ri_wolf_tide.js owns them). A wall the watch has hunted below half says so. Out of the tide, or with no date, the line is hidden.
export const RI_ACADEMY = 'book.ri.lead.academy';
const PHASE_WORDS = Object.freeze({early: 'early', peak: 'peak', ebb: 'ebb'});
export function riAcademyTideLine(state) {
    if(state?.actors?.player?.worldId !== 'book.ri.lead.world') return '';
    const phase = riWolfTidePhase(state);
    if(!phase.dated || !phase.active) return '';
    const days = RI_TIDE_DIALS.window.phases.find(([id]) => id === phase.id)?.[1];
    const row = riWolfTideView(state).rows.find(r => r.id === RI_WOLF_SPECIES.ordinary);
    const near = row?.present ? Math.max(1, Math.round(row.left * RI_TIDE_PHASES[phase.id].crowd / 1000)) : 0;
    const thinned = row && row.cap > 0 && row.left * 2 < row.cap;
    return [`Wolf tide, ${PHASE_WORDS[phase.id]}${days ? ` day ${phase.dayInPhase + 1} of ${days}` : ''}.`, riWolfTidePhaseLine(phase),
        near ? `About ${near} lightning wolves are near the wall.` : 'No lightning wolves are showing at the wall today.',
        thinned ? 'The watch has thinned this stretch; fewer come close.' : ''].filter(Boolean).join(' ');
}
registerPlaceDescription(RI_ACADEMY, riAcademyTideLine);
