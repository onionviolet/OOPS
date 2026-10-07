import {originalFrontierPresentation} from './original_frontier_campaign_host.js';
import {createActionLegibilityList} from './action_legibility_ui.js';

const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
};
const textOf = value => typeof value === 'string' ? value : value?.known === false ? '' : value?.text || '';
const reasonsOf = values => (values || []).map(textOf).filter(Boolean).join(' ');
const cancellationText = cancellation => cancellation === 'refund'
    ? 'Cancellation returns reserved inputs.'
    : cancellation === 'forfeit' ? 'Cancelling forfeits spent inputs.'
    : cancellation === 'none' || !cancellation ? 'This accepted work cannot be cancelled.'
    : `Cancellation: ${cancellation}.`;

// The host owns discovery, eligibility and all state changes. Render only its
// player-known projection; do not construct dormant controls from the registry.
export function createOriginalFrontierPanel({registry, read, command}) {
    const element = node('details', '', 'expedition_panel');
    element.id = 'original_frontier_panel';
    const summary = node('summary', 'Local work & findings');
    summary.tabIndex = 0;
    const intro = node('p', 'Local work follows the people, supplies and routes you have actually reached.');
    const status = node('p', '', 'expedition_notice');
    status.setAttribute('role', 'status');
    const quest = node('section', '', 'expedition_card'), questLabel = node('h4'), questStage = node('p'), questDetails = node('p');
    quest.append(questLabel, questStage, questDetails);
    const work = node('section', '', 'expedition_card'), workText = node('p'), workTerms = node('p', '', 'expedition_preview');
    const routine = node('section', '', 'expedition_card'), routineText = node('p'), routineReason = node('p', '', 'expedition_requirements');
    const contest = node('section', '', 'expedition_card'), cue = node('p'), responses = node('div');
    const actions = node('div');
    const records = node('details', '', 'notebook_preparation'), recordList = node('div', '', 'expedition_history');
    records.append(node('summary', 'Your recorded findings'), recordList);
    const recovery = node('p', 'Use native Rest or Sleep for your own recovery.');
    element.append(summary, intro, status, quest, work, routine, contest, actions, records, recovery);

    let notice = '', currentWork = null, currentProgram = null;
    const actionRows = new Map(), responseRows = new Map();
    const focus = () => {element.open = true; summary.focus();};
    const remove = entry => {
        if(entry.contains(document.activeElement)) focus();
        entry.remove();
    };
    const hide = (entry, hidden) => {
        if(hidden && !entry.hidden && entry.contains(document.activeElement)) focus();
        entry.hidden = hidden;
    };
    const run = action => {
        try {command(typeof action === 'function' ? action() : action); notice = 'Progress saved.';}
        catch(error) {notice = error?.message || String(error);}
        render();
    };
    const button = (label, action) => {
        const control = node('button', label);
        control.type = 'button';
        control.addEventListener('click', () => run(action));
        return control;
    };
    const begin = button('Ask about local parcel work', {type: 'begin'});
    element.insertBefore(begin, quest);
    const cancel = button('Cancel accepted work', () => ({type: 'cancel', id: currentWork.id}));
    work.append(workText, workTerms, cancel);
    const acceptedWorkList = createActionLegibilityList({parent:work,idPrefix:'frontier-accepted',focusFallback:summary,
        onCancel:row=>run({type:'cancel',id:row.id})});
    const retainedAccountList = createActionLegibilityList({parent:recordList,idPrefix:'frontier-accounts',focusFallback:summary});
    const pause = button('Pause after current work', {type: 'pause'});
    const resume = button('Resume remaining target', {type: 'resume'});
    routine.append(routineText, routineReason, pause, resume);
    const withdraw = button('Withdraw · spent inputs stay spent', {type: 'withdraw'});
    contest.append(cue, responses, withdraw);

    function createActionRow(action) {
        const row = node('section', '', 'expedition_card'), description = node('p'), terms = node('p', '', 'expedition_preview');
        const reason = node('p', '', 'expedition_requirements');
        const entry = {row, description, terms, reason, action, routine: null};
        entry.button = button(action.label, () => ({type: 'command', id: entry.action.id, targetId: entry.action.targetId}));
        row.append(entry.button, description, terms, reason);
        entry.legibility=createActionLegibilityList({parent:row,idPrefix:`frontier-${action.id}`,focusFallback:summary,
            onAction:()=>run(()=>({type:'command',id:entry.action.id,targetId:entry.action.targetId}))});
        actions.append(row);
        return entry;
    }

    function createRoutineControl(entry) {
        const row = node('div'), label = node('label', 'Routine target: '), count = node('input');
        const validation = node('p', '', 'expedition_requirements');
        count.type = 'number'; count.min = '1'; count.max = '20'; count.step = '1'; count.value = '3';
        count.required = true;
        count.setAttribute('aria-label', `Routine repetitions for ${entry.action.label}`);
        label.append(count);
        const start = button('Start finite routine', () => ({type: 'program', id: entry.action.id, targetId: entry.action.targetId, count: count.valueAsNumber}));
        row.append(label, start, validation);
        entry.row.append(row);
        const control = {row, count, start, validation, canStart: false};
        const validate = () => {
            const valid = count.checkValidity() && Number.isInteger(count.valueAsNumber);
            start.disabled = !control.canStart || !valid;
            count.setAttribute('aria-invalid', String(!valid));
            validation.textContent = valid ? '' : 'Choose a whole target from 1 to 20.';
            validation.hidden = valid;
        };
        count.addEventListener('input', validate);
        control.validate = validate;
        return control;
    }

    function render() {
        const snapshot = read();
        const view = originalFrontierPresentation(snapshot.state, registry, snapshot.context);
        currentWork = view.work || null;
        currentProgram = view.program || null;
        const hasContest = !!view.contest;
        const blocked = !snapshot.enabled || !!snapshot.error;
        const occupied = !!currentWork || hasContest || !!snapshot.inDialogue || !!snapshot.inCombat;
        const committingBlocked = blocked || occupied;
        const busyReason = snapshot.inCombat ? 'Finish combat before starting new work.'
            : snapshot.inDialogue ? 'Finish your conversation before starting new work.'
            : hasContest ? 'Finish or withdraw from the accepted exercise first.'
            : currentWork ? 'Finish or cancel your accepted work first.'
            : !snapshot.enabled ? 'Current activity or save access does not allow new work.' : '';
        hide(element, !view.visible && !currentWork && !currentProgram && !hasContest);
        hide(begin, !view.canBegin);
        begin.disabled = committingBlocked;
        intro.hidden = !view.visible;
        const message = snapshot.error || busyReason || notice;
        if(status.textContent !== message) status.textContent = message;
        status.hidden = !message;

        hide(quest, !view.quest);
        questLabel.textContent = view.quest?.label || '';
        questStage.textContent = view.quest?.stage ? `Current stage: ${view.quest.stage}.` : '';
        questStage.hidden = !questStage.textContent;
        questDetails.textContent = Array.isArray(view.quest?.details) ? reasonsOf(view.quest.details) : textOf(view.quest?.details);
        questDetails.hidden = !questDetails.textContent;

        hide(work, !currentWork);
        workText.textContent = currentWork ? `${currentWork.label} · ${Math.max(0, currentWork.remainingMinutes)} played minutes remaining.` : '';
        workTerms.textContent = currentWork ? cancellationText(currentWork.cancellation) : '';
        hide(cancel, !currentWork || !currentWork.cancellation || currentWork.cancellation === 'none');
        cancel.disabled = blocked;
        cancel.textContent = currentWork?.cancellation === 'refund' ? 'Cancel · return reserved inputs' : 'Cancel · forfeit spent inputs';
        acceptedWorkList.render({work:view.workLegibility?[view.workLegibility]:[],enabled:!blocked});
        workText.hidden = !!view.workLegibility;
        workTerms.hidden = !!view.workLegibility;
        if(view.workLegibility) hide(cancel,true);

        hide(routine, !currentProgram);
        routineText.textContent = currentProgram ? `Routine ${currentProgram.status} · ${currentProgram.remaining} repetitions remaining.` : '';
        routineReason.textContent = currentProgram ? textOf(currentProgram.reason) : '';
        routineReason.hidden = !routineReason.textContent;
        hide(pause, currentProgram?.status !== 'running');
        hide(resume, currentProgram?.status !== 'paused' || !currentProgram.remaining);
        pause.disabled = blocked;
        resume.disabled = committingBlocked;

        const shown = new Set((view.actions || []).map(action => action.id));
        for(const [id, entry] of actionRows) if(!shown.has(id)) {remove(entry.row); actionRows.delete(id);}
        for(const action of view.actions || []) {
            let entry = actionRows.get(action.id);
            if(!entry) {entry = createActionRow(action); actionRows.set(action.id, entry);}
            entry.action = action;
            entry.button.textContent = action.label;
            entry.button.disabled = committingBlocked || !action.eligible;
            entry.button.hidden = !!action.legibility;
            entry.legibility.render({actions:action.legibility?[action.legibility]:[],enabled:!committingBlocked,notice:snapshot.error||busyReason});
            entry.description.textContent = action.description || '';
            entry.description.hidden = !!action.legibility || !entry.description.textContent;
            entry.terms.textContent = `${Math.max(0, action.duration || 0)} played minutes. ${cancellationText(action.cancellation)}`;
            entry.reason.textContent = snapshot.error || reasonsOf(action.reasons) || (entry.button.disabled ? busyReason : '');
            entry.reason.hidden = !!action.legibility || !entry.reason.textContent;
            entry.terms.hidden = !!action.legibility;
            if(action.automatable) {
                if(!entry.routine) entry.routine = createRoutineControl(entry);
                entry.routine.canStart = !committingBlocked && !!action.eligible && currentProgram?.status !== 'running' && currentProgram?.status !== 'paused';
                entry.routine.count.disabled = !entry.routine.canStart;
                entry.routine.count.setAttribute('aria-label', `Routine repetitions for ${action.label}`);
                entry.routine.validate();
            } else if(entry.routine) {remove(entry.routine.row); entry.routine = null;}
        }

        hide(contest, !hasContest);
        cue.textContent = view.contest?.cue || '';
        const shownResponses = new Set((view.contest?.responses || []).map(response => response.id));
        for(const [id, entry] of responseRows) if(!shownResponses.has(id)) {remove(entry.row); responseRows.delete(id);}
        for(const response of view.contest?.responses || []) {
            let entry = responseRows.get(response.id);
            if(!entry) {
                const row = node('div'), control = button(response.label, {type: 'response', responseId: response.id}), reason = node('p', '', 'expedition_requirements');
                row.append(control, reason); responses.append(row); entry = {row, control, reason}; responseRows.set(response.id, entry);
            }
            entry.control.textContent = response.label;
            entry.control.disabled = blocked || !!snapshot.inDialogue || !!snapshot.inCombat || !response.eligible;
            entry.reason.textContent = reasonsOf(response.reasons);
            entry.reason.hidden = !entry.reason.textContent;
        }
        withdraw.disabled = blocked || !!snapshot.inDialogue || !!snapshot.inCombat;

        retainedAccountList.render({aftermath:view.aftermath || [],enabled:!blocked});
        hide(records, !view.aftermath?.length);
        recovery.hidden = !view.visible && !currentWork && !currentProgram && !hasContest;
    }

    document.getElementById('location_actions_div')?.append(element);
    render();
    return {element, panel: element, render, focus};
}
