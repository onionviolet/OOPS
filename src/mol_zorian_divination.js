// Chapter 15 introduces Haslush and names Monday. Chapter 16 gives the first
// coached exercise. The afternoon window and minutes within it are scene dials.
import {MOL_IDS, MOL_LOCATIONS} from './book_world_mol_ids.js';
import {isZorianStart} from './book_world_mol_starts.js';
import {WORLD_CALENDAR_PROFILES} from './world_calendar_content.js';

const prefix = 'book.mol.zorian.s2.';
export const MOL_DIVINATION_WAIT = prefix + 'wait_for_haslush';
export const MOL_DIVINATION_METHOD = prefix + 'object_analysis_method';
export const MOL_KAEL_WAIT = prefix + 'wait_for_kael_research';
const disclosureId = prefix + 'confide_in_kael_and_kirielle';
const profile = WORLD_CALENDAR_PROFILES[MOL_IDS.world];
const {minutesPerHour, hoursPerDay} = profile.units;
const firstFriday = (profile.week.indexOf('Fri') - profile.anchor.day_count % profile.week.length + profile.week.length) % profile.week.length;
const monday = firstFriday + (profile.week.indexOf('Mon') - profile.week.indexOf('Fri') + profile.week.length) % profile.week.length;
const start = monday * hoursPerDay * minutesPerHour + (15 - profile.anchor.hour) * minutesPerHour - profile.anchor.minute;
const slotMinutes = 120;

export function molKaelResearchAt(state) {
    const disclosure = state.simulation?.knowledge.player?.[prefix + 'household_confidence'];
    if (!isZorianStart(state) || state.actors.player.worldId !== MOL_IDS.world ||
        state.actors.player.completed[disclosureId] !== 1 || !disclosure ||
        state.actors[MOL_IDS.kael]?.facts[prefix + 'heard_zorian_loop'] !== true) return null;
    return disclosure.at + 3 * hoursPerDay * minutesPerHour;
}

export function molDivinationAppointmentAt(state) {
    if (!isZorianStart(state) || state.actors.player.worldId !== MOL_IDS.world) return null;
    const run = state.motherOfLearning;
    return (run.runStartedAt ?? run.initializedAt) + start;
}

export function molDivinationFacts(state, {compass}) {
    const at = molDivinationAppointmentAt(state);
    if (at === null) return {};
    const {clock} = state;
    const completed = state.actors.player.completed;
    const xvimFinished = completed[prefix + 'report_uncertainty'] === 1 || completed[prefix + 'guess_left'] === 1;
    const met = completed[prefix + 'meet_haslush'] === 1;
    const notice = completed[prefix + 'tell_imaya_about_lesson'] === 1;
    const entered = completed[prefix + 'check_tavern'] === 1;
    const found = completed[prefix + 'trace_haslush'] === 1 || completed[prefix + 'ask_after_haslush'] === 1;
    const taught = completed[prefix + 'study_object_analysis'] === 1 &&
        state.simulation?.knowledge.player?.[MOL_DIVINATION_METHOD]?.basis?.kind === 'recollection';
    const finished = completed[prefix + 'read_practice_envelope'] === 1;
    const tipSettled = completed[prefix + 'warn_haslush_privately'] === 1 || completed[prefix + 'keep_festival_warning_private'] === 1;
    const shaped = completed[prefix + 'steady_the_snail'] === 1;
    const tutored = completed[prefix + 'tutor_kael'] === 1;
    const readPaper = completed[prefix + 'read_taivens_paper'] === 1;
    const researchAt = molKaelResearchAt(state);
    const heardTheory = completed[prefix + 'hear_kaels_theory'] === 1;
    const examSettled = completed[prefix + 'accept_kaels_examination'] === 1 ||
        completed[prefix + 'defer_kaels_examination'] === 1;
    const end = at + slotMinutes;
    return {
        'mol.divination.showIntro': xvimFinished && !met && !finished,
        'mol.divination.introOnTime': clock + 10 <= at,
        'mol.divination.showNotice': met && !notice && !finished,
        'mol.divination.noticeOnTime': clock + 5 <= at,
        'mol.divination.noticeGiven': notice,
        'mol.divination.before': clock < at,
        'mol.divination.showEntry': notice && !entered,
        'mol.divination.showSearch': entered && !found,
        'mol.divination.showStudy': found && !taught,
        'mol.divination.showPractice': taught && !finished,
        'mol.divination.entryOnTime': clock >= at && clock + 45 <= end,
        'mol.divination.traceOnTime': clock >= at && clock + 35 <= end,
        'mol.divination.askOnTime': clock >= at && clock + 40 <= end,
        'mol.divination.studyOnTime': clock >= at && clock + 30 <= end,
        'mol.divination.practiceOnTime': clock >= at && clock + 10 <= end,
        'mol.divination.teacherAtTavern': clock >= at && clock <= end,
        'mol.divination.hasCompass': compass > 0,
        'mol.divination.showTip': finished && !tipSettled,
        'mol.divination.tipOnTime': clock >= at && clock + 10 <= end,
        'mol.divination.showShaping': finished && tipSettled && !shaped && !tutored,
        'mol.divination.showTutoring': finished && tipSettled && !tutored,
        'mol.divination.showPaper': tutored && !readPaper,
        'mol.divination.showDisclosure': readPaper && researchAt === null,
        'mol.divination.showResearchWait': researchAt !== null && clock < researchAt,
        'mol.divination.showTheory': researchAt !== null && clock >= researchAt && !heardTheory,
        'mol.divination.showExam': heardTheory && !examSettled,
    };
}

export function molDivinationTavernKnown(state) {
    return isZorianStart(state) && state.actors.player.completed[prefix + 'tell_imaya_about_lesson'] === 1;
}

export function molDivinationRoute(state) {
    const facts = molDivinationFacts(state, {compass: 0});
    if (facts['mol.divination.showIntro'] && facts['mol.divination.introOnTime']) {
        return {id: 'book.mol.move.library', label: 'Walk to the library to meet Ilsa’s tutor'};
    }
    if (facts['mol.divination.showNotice'] && facts['mol.divination.noticeOnTime']) {
        return {id: 'book.mol.move.house', label: 'Go home and tell Imaya about Monday'};
    }
    if (facts['mol.divination.showEntry'] && facts['mol.divination.entryOnTime']) {
        return {id: 'book.mol.move.divinationTavern', label: 'Walk to the tavern for Haslush’s lesson'};
    }
    if (facts['mol.divination.showTutoring'] && state.simulation?.people.player.location !== MOL_LOCATIONS.house) {
        return {id: 'book.mol.move.house', label: 'Go home to help Kael catch up'};
    }
    return null;
}

