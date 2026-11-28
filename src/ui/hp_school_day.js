import {HP_LEAD_DAY} from '../book_world_hp_day.js';
import {HP_LIBRARY_ACTIONS} from '../hp_library_work.js';
import {renderHpLibraryWork} from './hp_library_work.js';
import {HP_FEATHER_CAST} from '../hp_lead_spells.js';
import {formatDuration} from '../number_format.js';
import {tidyReasons} from '../player_reasons.js';
import {kitControl, kitElement, kitRow} from './kit.js';

const attendPrefix = `${HP_LEAD_DAY}.attend_`;
const homeworkPrefix = `${HP_LEAD_DAY}.homework_`;

export function renderHpSchoolDay(view, campaign, {run, study, studyRun, historyOpen, revealHistory}) {
    const {agenda, recent, feather} = view.schoolDay;
    const actions = new Map((campaign.actions || []).map(action => [action.id, action]));
    const jobs = new Map((campaign.jobs || []).map(job => [job.commandId, job]));
    const originalLessons = new Map(view.lessons?.lessons.map(lesson => [lesson.id, lesson.commandId]));
    const day = kitElement('section', 'ui-panel-section');
    day.dataset.hpSchoolDay = '';
    day.append(kitElement('h3', '', 'School day'));

    const group = (heading, name) => {
        const section = kitElement('div');
        section.dataset.hpSchoolGroup = name;
        section.append(kitElement('h4', '', heading));
        day.append(section);
        return section;
    };

    function control(action, detail, {lesson, cast = false, library = false} = {}) {
        const job = jobs.get(action.id);
        const reason = !campaign.canWrite ? campaign.pauseReason || 'Saving is paused.' :
            !job && !action.eligible ? tidyReasons(action.reasons || []) : '';
        const enabled = campaign.canWrite && (job ? job.cancellable : action.eligible);
        const fact = job ? `${job.label.split(' · ')[0]} · ${formatDuration(job.remaining)} left` : detail || '';
        const quote = [fact, reason].filter(Boolean).join(' · ');
        const request = job ? {type: 'cancel', jobId: job.id} : {type: 'action', id: action.id};
        const invoke = !job || job.cancellable ? {disabled: !enabled, title: quote, run: () => run(request, !job && !!lesson)} : null;
        const label = job?.cancellable ? 'Stop work' : action.label;
        const row = kitRow({label, action: invoke, fact, from: library ? '' : reason,
            state: job ? 'running' : enabled ? 'ready' : 'near', data: {hpDayAction: action.id}});
        if (invoke && !library) kitControl(row.firstChild, action.id);
        if (invoke && lesson) row.firstChild.dataset.hpLesson = lesson;
        if (invoke && cast) row.firstChild.dataset.hpCast = action.id;
        if (invoke && !enabled && reason) row.firstChild.dataset.disabledReason = reason;
        return row;
    }

    const lessons = group('Lessons', 'classes');
    lessons.dataset.hpLessons = '';
    const ongoing = [...jobs.keys()].filter(id => id.startsWith(attendPrefix) || [...originalLessons.values()].includes(id));
    const upcoming = agenda.find(row => row.wait > 0);
    for (const id of ongoing) if (actions.has(id)) lessons.append(control(actions.get(id)));
    for (const next of agenda) {
        const id = next.originalLesson ? originalLessons.get(next.id) : `${attendPrefix}${next.id}`;
        const action = actions.get(id);
        if (next.wait <= 0 && ongoing.includes(id)) continue;
        const detail = next.wait <= 0 ? `Enter by ${next.entryUntil} · ${next.room}` :
            `${next.day} at ${next.at} · ${next.room}${next === upcoming ? ` · in ${formatDuration(next.wait)}` : ''}`;
        if (next.wait <= 0 && action) lessons.append(control(action, detail, {lesson: next.originalLesson ? next.id : undefined}));
        else lessons.append(kitRow({label: next.label, fact: detail, state: next.wait <= 0 ? 'near' : ''}));
    }
    if (!agenda.length && !ongoing.length) lessons.append(kitElement('p', '', 'No classes on the timetable this week. Check again next week.'));

    const homework = group('Homework', 'homework');
    const assignments = [...actions.values()].filter(action => action.id.startsWith(homeworkPrefix) &&
        (action.eligible || action.runs > 0 || jobs.has(action.id)));
    const referenceHomework = actions.get(HP_LIBRARY_ACTIONS.homework);
    const referenceRunning = jobs.has(HP_LIBRARY_ACTIONS.homework);
    const extension = (campaign.extensions || []).find(option => option.id === HP_LEAD_DAY);
    if (view.atCharmsBench && extension) {
        const request = {type: 'adopt-extension', id: extension.id, revision: extension.revision, contentHash: extension.contentHash};
        const disabled = !campaign.canWrite || !extension.eligible;
        const fact = disabled ? tidyReasons(extension.reasons || []) || campaign.pauseReason || 'Saving is paused.' : 'Classwork and homework count towards exams.';
        homework.append(kitRow({label: 'Open your school timetable', action: {disabled, title: fact, run: () => run(request)}, fact}));
    } else if (!assignments.length && !referenceRunning && view.atCharmsBench) homework.append(kitElement('p', '', 'No homework waiting. Attend a class to get the next assignment.'));
    for (const assignment of assignments) homework.append(control(assignment, assignment.runs > 1 ? `${assignment.runs} pieces waiting` : ''));
    if (referenceHomework && (referenceHomework.runs > 0 || referenceRunning)) homework.append(control(referenceHomework, [...(referenceHomework.costs || []), 'Your reference notes stay with you.'].join(' · ')));

    const practice = group('Spell practice', 'practice');
    const cast = actions.get(HP_FEATHER_CAST);
    if (cast && feather) {
        const quote = [...(cast.costs || []), `about ${feather.chance}% to lift`, `${feather.tries} ${feather.tries === 1 ? 'try' : 'tries'}`].join(' · ');
        practice.append(control(cast, quote, {cast: true}));
    } else if (!feather) practice.append(kitElement('p', '', 'Learn the Levitation Charm in Charms first.'));
    const reading = study?.rows?.().find(row => row.topic === 'charms');
    if (reading) {
        const reason = !campaign.canWrite ? campaign.pauseReason || 'Saving is paused.' : reading.reason;
        const fact = reading.done ? 'You understand the motion. Your Levitation casts are steadier.' :
            'Three library hours and a lesson with two tries help you understand the motion. Each session takes an hour; it improves Levitation without spending stamina.';
        const row = kitRow({label: reading.done ? 'Levitation reading understood' : reading.label,
            action: reading.done ? null : {disabled: !campaign.canWrite || !reading.eligible, title: reason || fact, run: () => studyRun(reading.id)},
            fact: [fact, !reading.done && reading.progress, !reading.done && reason].filter(Boolean).join(' '), state: reading.done ? 'done' : reading.eligible && campaign.canWrite ? 'ready' : 'near'});
        if (!reading.done) row.firstChild.dataset.hpStudy = reading.id;
        if (reading.lead) row.append(kitElement('p', '', reading.lead));
        if (reading.canNote) {
            const note = kitRow({label: 'Write it up as a note', action: {disabled: !campaign.canWrite, run: () => studyRun(reading.id, true)},
                fact: 'Keep a copy of what you worked out.'});
            note.firstChild.dataset.hpStudyNote = reading.id;
            row.append(note);
        }
        practice.append(row);
    }
    if (!view.atCharmsBench) day.insertBefore(kitElement('p', 'hp-school-day__place', 'Return to the Great Hall for lessons, homework and practice.'), lessons);

    renderHpLibraryWork(view, campaign, {group, control: (action, detail) => control(action, detail, {library: true}), run, actions});
    if (recent.length) {
        const results = group('Latest result', 'recap');
        results.append(kitElement('p', '', recent[0]));
        if (recent.length > 1) {
            const history = kitElement('details');
            history.open = historyOpen;
            history.ontoggle = () => revealHistory(history.open);
            history.append(kitElement('summary', '', 'Earlier results'), ...recent.slice(1).map(line => kitElement('p', '', line)));
            results.append(history);
        }
    }
    return day;
}
