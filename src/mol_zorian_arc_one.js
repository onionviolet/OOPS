// Selected Arc 1 steps use ordinary Cyoria work and the existing reset host.
import {MOL_IDS, MOL_LOCATIONS} from './book_world_mol_ids.js';
import {isZorianStart} from './book_world_mol_starts.js';
import {molScheduledMonthEnd} from './mol_zorian_study_months.js';

const prefix = 'book.mol.zorian.arc1.';
const study = 'book.mol.zorian.s2.';
const day = 1440;
export const MOL_APPRENTICE_MONTHS = Object.freeze(Array.from({length: 5}, (_, i) => prefix + 'apprentice_month_' + (i + 1)));
const ownNote = (state, key) => state.simulation?.knowledge.player?.[prefix + key];
const currentRun = state => state.motherOfLearning.runStartedAt ?? state.motherOfLearning.initializedAt;
const resumed = (state, key) => {
    const note = ownNote(state, key);
    return !!note && currentRun(state) >= note.at;
};

const meetingDue = state => (state.simulation?.knowledge.player?.[study + 'cloud_drill_result']?.at ?? Infinity) + 3 * day;
const reportDue = state => (ownNote(state, 'aranea_forecast')?.at ?? Infinity) + 3 * day;
const lessonDue = state => (ownNote(state, 'mind_lesson_invitation')?.at ?? Infinity) + day;
const partyDue = state => molScheduledMonthEnd(state) - 240;

const waits = Object.freeze({
    return_to_scout: [meetingDue, MOL_LOCATIONS.sewer, 'Stop waiting for the scout'],
    wait_to_report: [reportDue, MOL_LOCATIONS.sewer, 'Stop waiting to report your findings'],
    wait_for_mind_lesson: [lessonDue, MOL_LOCATIONS.sewer, 'Stop waiting for the lesson'],
    wait_for_festival_party: [partyDue, MOL_LOCATIONS.house, 'Stop waiting for the festival party'],
    wait_for_second_festival: [partyDue, MOL_LOCATIONS.house, 'Stop waiting for the festival'],
    let_the_month_reset: [molScheduledMonthEnd, MOL_LOCATIONS.house, 'Stop waiting out the month'],
    wait_for_next_apprentice_month: [molScheduledMonthEnd, MOL_LOCATIONS.house, 'Stop waiting for another month'],
});

export function molArcWait(state, id) {
    if (!id.startsWith(prefix) || !isZorianStart(state)) return null;
    const apprentice = [molScheduledMonthEnd, MOL_LOCATIONS.academy, 'Stop this month of apprenticeship'];
    const wait = waits[id.slice(prefix.length)] ?? (MOL_APPRENTICE_MONTHS.includes(id) ? apprentice : null);
    if (!wait) return null;
    const [due, location, stopLabel] = wait;
    const at = due(state);
    return {at: Number.isSafeInteger(at) ? at : null, location, stopLabel, span: day};
}

export function molArcFacts(state, {watch = 0, rod = 0, relay = 0, supplies = 0, revolver = 0} = {}) {
    if (!isZorianStart(state) || state.actors.player.worldId !== MOL_IDS.world) return {};
    const {completed} = state.actors.player;
    const done = key => completed[prefix + key] === 1;
    const unlocked = key => !!ownNote(state, key);
    const cloud = completed[study + 'track_marble_by_touch'] === 1;
    if (!cloud && !unlocked('garden_fall')) return {};
    const {clock} = state;
    const needs = (prev, next) => done(prev) && !done(next);
    const pursue = resumed(state, 'garden_fall');
    const apprenticeship = ownNote(state, 'ilsa_apprenticeship');
    const monthIndex = MOL_APPRENTICE_MONTHS.findIndex(id => !state.simulation?.knowledge.player?.[id]);
    const next = monthIndex < 0 ? 0 : monthIndex + 1;
    const prior = monthIndex > 0 ? state.simulation.knowledge.player[MOL_APPRENTICE_MONTHS[monthIndex - 1]] : apprenticeship;
    const end = molScheduledMonthEnd(state);
    const studyRun = !!prior && (next === 1 || currentRun(state) >= prior.at);
    const firstDay = clock < currentRun(state) + 18 * 60;
    const trained = resumed(state, 'apprentice_month_5');
    const nextAttack = resumed(state, 'fragmented_tunnel_map');
    return {
        'mol.arc.meeting': cloud && !done('trade_forecasts'),
        'mol.arc.meetingReady': clock >= meetingDue(state),
        'mol.arc.waitMeeting': cloud && !done('trade_forecasts') && clock < meetingDue(state),
        'mol.arc.visitTemple': needs('trade_forecasts', 'consult_temple'),
        'mol.arc.compareOracles': needs('consult_temple', 'compare_forecasters'),
        'mol.arc.report': needs('compare_forecasters', 'report_and_ask_about_training'),
        'mol.arc.reportReady': clock >= reportDue(state),
        'mol.arc.waitReport': needs('compare_forecasters', 'report_and_ask_about_training') && clock < reportDue(state),
        'mol.arc.lesson': needs('report_and_ask_about_training', 'practice_inward_sense'),
        'mol.arc.lessonReady': clock >= lessonDue(state),
        'mol.arc.waitLesson': needs('report_and_ask_about_training', 'practice_inward_sense') && clock < lessonDue(state),
        'mol.arc.prepareParty': needs('practice_inward_sense', 'discuss_firing_positions'),
        'mol.arc.waitParty': done('discuss_firing_positions') && clock < partyDue(state),
        'mol.arc.party': needs('discuss_firing_positions', 'watch_fireworks'),
        'mol.arc.partyReady': clock >= partyDue(state) && clock < molScheduledMonthEnd(state),
        'mol.arc.corridor': needs('watch_fireworks', 'inscribe_corridor_runes'),
        'mol.arc.crossGrounds': needs('inscribe_corridor_runes', 'cross_mansion_grounds'),
        'mol.arc.garden': needs('cross_mansion_grounds', 'carry_tinami_toward_zach'),
        'mol.arc.newRod': pursue && !done('make_missile_rod') && !unlocked('ward_reader_report'),
        'mol.arc.scout': needs('make_missile_rod', 'follow_a_mind_below'),
        'mol.arc.train': needs('follow_a_mind_below', 'drill_missiles_with_taiven'),
        'mol.arc.retrieve': needs('drill_missiles_with_taiven', 'receive_pocket_watch'),
        'mol.arc.identify': needs('receive_pocket_watch', 'identify_watch_purpose'),
        'mol.arc.openWatch': needs('identify_watch_purpose', 'feel_watch_casing'),
        'mol.arc.deliver': needs('feel_watch_casing', 'return_watch_to_client'),
        'mol.arc.reportWatch': needs('return_watch_to_client', 'bring_back_ward_reader_news'),
        'mol.arc.hasWatch': watch > 0,
        'mol.arc.hasRod': rod > 0,
        'mol.arc.knowsObjectAnalysis': !!state.simulation?.knowledge.player?.[study + 'object_analysis_method'],
        'mol.arc.knowsCloud': !!state.simulation?.knowledge.player?.[study + 'cloud_drill_result'],
        'mol.arc.earnsApprenticeship': unlocked('ward_reader_report') && !apprenticeship,
        'mol.arc.apprenticeNext': studyRun && clock < end ? next : 0,
        'mol.arc.apprenticeSettle': studyRun && clock === end ? next : 0,
        'mol.arc.monthEnd': clock === end,
        'mol.arc.apprenticeOnTime': firstDay,
        'mol.arc.apprenticeMissed': studyRun && clock < end && next > 0 && !firstDay,
        'mol.arc.makeRelays': trained && !done('make_stone_relays') && !unlocked('fragmented_tunnel_map'),
        'mol.arc.installRelays': needs('make_stone_relays', 'leave_relays_with_the_web'),
        'mol.arc.kaelPact': needs('leave_relays_with_the_web', 'ask_kael_in_confidence'),
        'mol.arc.trap': needs('ask_kael_in_confidence', 'prepare_capture_trap'),
        'mol.arc.silver': needs('prepare_capture_trap', 'prepare_silver_disc'),
        'mol.arc.secondWait': done('prepare_silver_disc') && clock < partyDue(state),
        'mol.arc.secondParty': needs('prepare_silver_disc', 'stop_the_attack_on_akoja'),
        'mol.arc.banish': needs('stop_the_attack_on_akoja', 'offer_the_silver_disc'),
        'mol.arc.monitor': needs('offer_the_silver_disc', 'watch_the_relay'),
        'mol.arc.search': needs('watch_the_relay', 'recover_fragmented_route'),
        'mol.arc.resetForReturn': done('recover_fragmented_route') && clock < end,
        'mol.arc.beacon': nextAttack && !done('jump_to_cyoria_beacon'),
        'mol.arc.equip': needs('jump_to_cyoria_beacon', 'buy_beacon_supplies'),
        'mol.arc.pack': needs('buy_beacon_supplies', 'prepare_pocket_charges'),
        'mol.arc.descendAgain': needs('prepare_pocket_charges', 'search_the_silent_settlement'),
        'mol.arc.conceal': needs('search_the_silent_settlement', 'buy_time_with_concealment'),
        'mol.arc.resist': needs('buy_time_with_concealment', 'break_the_mind_link'),
        'mol.arc.shoot': needs('break_the_mind_link', 'fire_and_pull_free'),
        'mol.arc.exit': needs('fire_and_pull_free', 'take_the_shaft_from_the_map'),
        'mol.arc.terminal': needs('take_the_shaft_from_the_map', 'detonate_before_impact'),
        'mol.arc.hasRelay': relay > 0,
        'mol.arc.hasSupplyKit': supplies > 0,
        'mol.arc.hasRevolver': revolver > 0,
        'mol.arc.knowsConcealment': unlocked('kael_soul_concealment'),
        'mol.arc.hasFragment': unlocked('fragmented_tunnel_map'),
    };
}

export function molArcRoute(state) {
    const facts = molArcFacts(state);
    const here = state.simulation?.people.player.location;
    const apprenticeNext = facts['mol.arc.apprenticeNext'];
    if (facts['mol.arc.apprenticeMissed'] && here !== MOL_LOCATIONS.house) {
        return {id: 'book.mol.move.house', label: 'Go home if you want to wait for another month'};
    }
    if (apprenticeNext && facts['mol.arc.apprenticeOnTime'] && here !== MOL_LOCATIONS.academy) {
        return {id: 'book.mol.move.academy', label: 'Go to Ilsa for this month of apprenticeship'};
    }
    const routes = [
        ['meeting', 'sewer', 'Return to the tunnel scout'],
        ['visitTemple', 'academy', 'Go to the temple quarter to ask about the forecasts'],
        ['compareOracles', 'library', 'Compare the accounts and ask about your classmates'],
        ['report', 'sewer', 'Take the diviners’ accounts back to the tunnels'],
        ['waitParty', 'house', 'Go home before the festival invitation'],
        ['party', 'mansion', 'Go to the Noveda mansion for the festival'],
        ['newRod', 'house', 'Prepare a spell rod in your room'],
        ['scout', 'sewer', 'Follow the scout route you remember'],
        ['train', 'court', 'Go to the court for Taiven’s drills'],
        ['retrieve', 'sewer', 'Meet the retrieval team at the hatch'],
        ['deliver', 'station', 'Bring the watch to the client'],
        ['reportWatch', 'sewer', 'Tell the matriarch what the watch was made for'],
        ['earnsApprenticeship', 'academy', 'Ask Ilsa to see your shaping and spell formulas'],
        ['makeRelays', 'house', 'Prepare the relay stones'],
        ['installRelays', 'sewer', 'Bring the relay stones below'],
        ['kaelPact', 'house', 'Speak to Kael in private'],
        ['trap', 'sewer', 'Lay the trap with the web'],
        ['silver', 'house', 'Collect Kael’s silver disc'],
        ['secondWait', 'house', 'Go home before the festival'],
        ['secondParty', 'festivalHall', 'Go to the festival dance hall'],
        ['search', 'sewer', 'Look for survivors and clues below'],
        ['resetForReturn', 'house', 'Return home for the end of the month'],
        ['beacon', 'house', 'Prepare to jump to the Cyoria beacon'],
        ['descendAgain', 'sewer', 'Go to the settlement entrance'], 
    ];
    for (const [gate, place, label] of routes) {
        if ((gate === 'party' || gate === 'secondParty') && !facts['mol.arc.partyReady']) continue;
        if (facts['mol.arc.' + gate] && here !== MOL_LOCATIONS[place]) {
            return {id: 'book.mol.move.' + place, label};
        }
    }
    return null;
}

export const molArcPassageDestination = id => id === prefix + 'jump_to_cyoria_beacon' ? MOL_LOCATIONS.station : null;

export function molMansionKnown(state) {
    return isZorianStart(state) && !!ownNote(state, 'noveda_invitation');
}

export function molFestivalHallKnown(state) {
    return isZorianStart(state) && !!ownNote(state, 'silver_disc_method');
}
