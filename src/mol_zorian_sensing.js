// Chapter 14 places the appointment on Friday. The slot within that day and
// the two 15-minute phases are authored dials for the local calendar.
import {MOL_IDS, MOL_LOCATIONS} from './book_world_mol_ids.js';
import {isZorianStart} from './book_world_mol_starts.js';
import {WORLD_CALENDAR_PROFILES} from './world_calendar_content.js';
import {MOL_DIVINATION_WAIT, MOL_KAEL_WAIT, molDivinationAppointmentAt, molKaelResearchAt} from './mol_zorian_divination.js';
import {MOL_CLOUD_PRACTICE, molStudyMonthWait} from './mol_zorian_study_months.js';
import {molArcWait} from './mol_zorian_arc_one.js';

const prefix = 'book.mol.zorian.s2.';
export const MOL_SENSING_WAIT = prefix + 'wait_for_xvim';
export const MOL_CLOUD_WAIT = prefix + 'wait_for_xvim_cloud_drill';
const start = prefix + 'start_sensing';
const recall = 'book.mol.zorian.s1.skip_class_drill';
const answers = [prefix + 'report_uncertainty', prefix + 'guess_left'];
const profile = WORLD_CALENDAR_PROFILES[MOL_IDS.world];
const dayMinutes = profile.units.minutesPerHour * profile.units.hoursPerDay;
const firstFriday = (profile.week.indexOf('Fri') - profile.anchor.day_count % profile.week.length + profile.week.length) % profile.week.length;
const slotStart = firstFriday * dayMinutes + (15 - profile.anchor.hour) * profile.units.minutesPerHour - profile.anchor.minute;
const slotMinutes = 120;
const phaseMinutes = 15;

export function molSensingAppointmentAt(state) {
    if (!isZorianStart(state) || state.actors.player.worldId !== MOL_IDS.world) return null;
    const run = state.motherOfLearning;
    return (run.runStartedAt ?? run.initializedAt) + slotStart;
}

export function molSensingFacts(state) {
    const at = molSensingAppointmentAt(state);
    if (at === null) return {};
    const {clock} = state;
    const completed = state.actors.player.completed;
    const opened = completed[start] === 1;
    const finished = answers.some(id => completed[id] === 1);
    const end = at + slotMinutes;
    return {
        'mol.sensing.introduced': completed[recall] > 0,
        'mol.sensing.before': clock < at,
        'mol.sensing.beginOnTime': clock >= at && clock + 2 * phaseMinutes <= end,
        'mol.sensing.answerOnTime': clock >= at && clock + phaseMinutes <= end,
        'mol.sensing.inSession': clock >= at && clock <= end,
        'mol.sensing.opened': opened,
        'mol.sensing.finished': finished,
    };
}

function molCloudAppointmentAt(state) {
    const first = molSensingAppointmentAt(state);
    const practiced = state.simulation?.knowledge.player?.[MOL_CLOUD_PRACTICE];
    if (first === null || state.actors.player.completed[MOL_CLOUD_PRACTICE] !== 1 || !practiced) return null;
    const weekMinutes = profile.week.length * dayMinutes;
    return first + Math.max(0, Math.ceil((practiced.at - first) / weekMinutes)) * weekMinutes;
}

export function molCloudSensingFacts(state) {
    const at = molCloudAppointmentAt(state);
    if (at === null) return {};
    const end = at + slotMinutes;
    const unfinished = !state.actors.player.completed[prefix + 'track_marble_by_touch'];
    return {
        'mol.sensing.showCloudWait': unfinished && state.clock < at,
        'mol.sensing.showCloudDrill': unfinished && state.clock >= at,
        'mol.sensing.cloudOnTime': state.clock >= at && state.clock + phaseMinutes <= end,
        'mol.sensing.cloudInSession': state.clock >= at && state.clock <= end,
    };
}

// The declarative job reserves the learner through the ordinary simulation.
// Its one-minute placeholder becomes the exact live appointment on admission.
export function bindMolSchoolWait(plan, due) {
    const job = plan.state.simulation.jobs.find(j => j.id === plan.commitment.id);
    job.due = due;
    plan.commitment.due = due;
}

// The same ordinary wait job contract supplies Cyoria's timed appointments.
export function molSchoolWait(state, commandId) {
    if (commandId === MOL_SENSING_WAIT) {
        return {at: molSensingAppointmentAt(state), location: MOL_LOCATIONS.court, stopLabel: 'Stop waiting for Xvim'};
    }
    if (commandId === MOL_DIVINATION_WAIT) {
        return {at: molDivinationAppointmentAt(state), location: MOL_LOCATIONS.house, stopLabel: 'Stop waiting for Haslush'};
    }
    if (commandId === MOL_KAEL_WAIT) {
        return {at: molKaelResearchAt(state), location: MOL_LOCATIONS.house, stopLabel: 'Stop waiting for Kael'};
    }
    if (commandId === MOL_CLOUD_WAIT) {
        return {at: molCloudAppointmentAt(state), location: MOL_LOCATIONS.court, stopLabel: 'Stop waiting for the marble drill'};
    }
    return molStudyMonthWait(state, commandId) ?? molArcWait(state, commandId);
}

export function molSchoolPassageClockRequest(state) {
    const job = state.simulation?.jobs.find(j => j.actorId === 'player');
    const appointment = job && molSchoolWait(state, job.commandId);
    if (!appointment || appointment.at === null || state.clock >= appointment.at ||
        state.simulation.people.player?.location !== appointment.location || job.revision !== 1 ||
        job.due !== appointment.at || job.completionSupport?.location !== appointment.location) return null;
    return Math.min(appointment.span ?? 120, appointment.at - state.clock);
}
