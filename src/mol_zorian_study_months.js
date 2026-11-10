// The chapter 18 montage has six actual calendar ends. Completion notes survive
// those restarts through the seat's existing recollection carry.
import {MOL_IDS, MOL_LOCATIONS} from './book_world_mol_ids.js';
import {isZorianStart} from './book_world_mol_starts.js';
import {WORLD_CALENDAR_PROFILES, WORLD_DAY_EVENTS} from './world_calendar_content.js';
import {projectCalendar, dayEventsDue} from './world_calendar.js';

const prefix = 'book.mol.zorian.s2.';
const profile = WORLD_CALENDAR_PROFILES[MOL_IDS.world];
const calendar = WORLD_DAY_EVENTS[MOL_IDS.world];
const monthMinutes = profile.months[profile.anchor.month - 1].days * profile.units.minutesPerHour * profile.units.hoursPerDay;
const studySpan = profile.units.minutesPerHour * profile.units.hoursPerDay;
const firstNight = studySpan - profile.anchor.hour * profile.units.minutesPerHour - profile.anchor.minute;
const endView = projectCalendar(profile, {elapsed: monthMinutes, instanceId: profile.definitionId});
const endEvent = dayEventsDue(profile, endView, calendar).find(event => event.id === 'mol.month_end');
export const MOL_DEPARTURE_WAIT = prefix + 'take_festival_train';
export const MOL_MISSED_STUDY_WAIT = prefix + 'let_missed_study_month_end';
export const MOL_CLOUD_PRACTICE = prefix + 'shape_a_small_mana_cloud';
export const MOL_STUDY_IDS = Object.freeze(Array.from({length: 6}, (_, i) => prefix + 'quiet_study_month_' + (i + 1)));

export function molScheduledMonthEnd(state) {
    if (!endEvent || !isZorianStart(state) || state.actors.player.worldId !== MOL_IDS.world) return null;
    const run = state.motherOfLearning;
    return (run.runStartedAt ?? run.initializedAt) + monthMinutes - endEvent.ageMinutes;
}

export function molStudyMonthFacts(state) {
    const end = molScheduledMonthEnd(state);
    if (end === null) return {};
    const {completed} = state.actors.player;
    const done = key => completed[prefix + key] === 1;
    const notes = state.simulation?.knowledge.player ?? {};
    const start = state.motherOfLearning.runStartedAt ?? state.motherOfLearning.initializedAt;
    const departure = notes[prefix + 'festival_train_departure'];
    const packetChoice = done('accept_memory_packet') || done('decline_memory_packet');
    if (!departure && !packetChoice) return {};
    const finished = MOL_STUDY_IDS.filter(id => notes[id]);
    const last = notes[finished.at(-1)] ?? departure;
    const nextStudy = finished.length < MOL_STUDY_IDS.length ? finished.length + 1 : 0;
    const beforeEnd = state.clock < end;
    const studyOnTime = state.clock < start + firstNight;
    const askedIlsa = done('ask_ilsa_for_combat_instruction');
    const metTaiven = done('meet_taiven_for_tunnels');
    const spokeBelow = done('ask_the_matriarch_to_check_the_packet') || done('ask_the_matriarch_to_check_the_packet_without_it');
    const agreed = done('agree_to_practice_with_taiven');
    const sparred = done('trade_practice_casts_with_taiven');
    const heardMethod = done('ask_taiven_how_she_located_the_cast');
    return {
        'mol.studyMonths.showGoodbye': packetChoice && !done('plan_festival_departure'),
        'mol.studyMonths.showTrain': done('plan_festival_departure') && !departure && beforeEnd,
        'mol.studyMonths.atEnd': state.clock === end,
        'mol.studyMonths.hasDeparturePlan': done('plan_festival_departure'),
        'mol.studyMonths.next': departure && start >= last.at && beforeEnd ? nextStudy : 0,
        'mol.studyMonths.nextAtEnd': departure && start >= last.at && state.clock === end ? nextStudy : 0,
        'mol.studyMonths.studyOnTime': studyOnTime,
        'mol.studyMonths.missedStudy': !!departure && start >= last.at && beforeEnd && nextStudy > 0 && !studyOnTime,
        'mol.studyMonths.showIlsa': finished.length === MOL_STUDY_IDS.length && start >= last.at && !askedIlsa,
        'mol.studyMonths.showTaiven': askedIlsa && !metTaiven,
        'mol.studyMonths.showPacketCheck': metTaiven && !spokeBelow,
        'mol.studyMonths.showAgreement': spokeBelow && !agreed,
        'mol.studyMonths.showSpar': agreed && !sparred,
        'mol.studyMonths.showMethod': sparred && !heardMethod,
        'mol.studyMonths.showPractice': heardMethod && completed[MOL_CLOUD_PRACTICE] !== 1,
        'mol.studyMonths.hasPacket': !!notes[prefix + 'aranea_memory_packet'],
    };
}

export function molStudyMonthRoute(state) {
    const facts = molStudyMonthFacts(state);
    const here = state.simulation?.people.player.location;
    if (facts['mol.studyMonths.showGoodbye'] && here !== MOL_LOCATIONS.house)
        return {id: 'book.mol.move.house', label: 'Go home to plan for the festival'};
    if (facts['mol.studyMonths.showTrain'] && here !== MOL_LOCATIONS.station)
        return {id: 'book.mol.move.station', label: 'Go to the station for the festival train'};
    if (facts['mol.studyMonths.missedStudy'])
        return here === MOL_LOCATIONS.house ? null : {id: 'book.mol.move.house', label: 'Go home if you want to wait out the month'};
    const month = facts['mol.studyMonths.next'];
    const studyPlace = month % 2 ? MOL_LOCATIONS.divinationTavern : MOL_LOCATIONS.workshop;
    if (month && here !== studyPlace)
        return month % 2
            ? {id: 'book.mol.move.divinationTavern', label: 'Go to Haslush for this month’s lessons'}
            : {id: 'book.mol.move.workshop', label: 'Go to Nora’s workshop for this month’s lessons'};
    if (facts['mol.studyMonths.showIlsa'] && here !== MOL_LOCATIONS.academy)
        return {id: 'book.mol.move.academy', label: 'Ask Ilsa about further combat instruction'};
    if (facts['mol.studyMonths.showTaiven'] && here !== MOL_LOCATIONS.sewer)
        return {id: 'book.mol.move.sewer', label: 'Meet Taiven at the sewer hatch'};
    if (facts['mol.studyMonths.showSpar'] && here !== MOL_LOCATIONS.court)
        return {id: 'book.mol.move.court', label: 'Meet Taiven for practice at the court'};
    return null;
}

export function molStudyMonthWait(state, commandId) {
    if (commandId === MOL_DEPARTURE_WAIT)
        return {at: molScheduledMonthEnd(state), location: MOL_LOCATIONS.station, stopLabel: 'Cancel the festival train plan', span: studySpan};
    if (commandId === MOL_MISSED_STUDY_WAIT)
        return {at: molScheduledMonthEnd(state), location: MOL_LOCATIONS.house, stopLabel: 'Stop waiting out the month', span: studySpan};
    const index = MOL_STUDY_IDS.indexOf(commandId);
    if (index === -1) return null;
    return {at: molScheduledMonthEnd(state), location: index % 2 ? MOL_LOCATIONS.workshop : MOL_LOCATIONS.divinationTavern,
        stopLabel: 'Stop this month’s study', span: studySpan};
}
