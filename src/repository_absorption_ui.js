import {repositoryAbsorptionPresentation} from './repository_absorption_host.js';

const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
};
const textOf = value => typeof value === 'string' ? value : value?.known === false ? '' : value?.text || '';
const linesOf = values => (Array.isArray(values) ? values : [values]).map(textOf).filter(Boolean);
const joined = values => linesOf(values).join(' ');
const cancellationText = value => value === 'refund' ? 'Cancellation returns reserved inputs.'
    : value === 'forfeit' ? 'Cancellation forfeits spent inputs.'
    : value === 'none' ? 'Accepted work cannot be cancelled.' : textOf(value);
const basisText = value => {
    if(typeof value === 'string') return value;
    if(!value || value.known === false) return '';
    const label = value.text || value.label || ({testimony: 'Reported account', instruction: 'Taught method',
        observation: 'Observed', witnessed: 'Observed', direct: 'Observed'})[value.kind] || '';
    return [label, value.sourceLabel].filter(Boolean).join(' · ');
};
const termsOf = action => {
    const preview = linesOf(action.preview);
    if(preview.length) return preview.join(' ');
    const duration = Number.isFinite(action.duration) ? `${Math.max(0, action.duration)} played minutes.` : '';
    return [joined(action.costs), duration, cancellationText(action.cancellation)].filter(Boolean).join(' ');
};

// Only the host projection supplies known rows, contract terms and eligibility.
// Opening or rendering this panel never enrolls people or starts their work.
export function createRepositoryAbsorptionPanel({registry, read, command}) {
    const element = node('details', '', 'expedition_panel');
    element.id = 'repository_absorption_panel';
    const summary = node('summary', 'Lantern & floodline work');
    summary.tabIndex = 0;
    const intro = node('p', 'Ask about the wet lantern to hear the offer. Work uses the materials, payment and cancellation terms shown below.');
    const beginRow = node('section', '', 'expedition_card');
    const status = node('p', '', 'expedition_notice');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    const work = node('section', '', 'expedition_card'), workText = node('p'), workTerms = node('p', '', 'expedition_preview');
    const actions = node('div');
    const itinerary = node('section', '', 'expedition_card'), itineraryHeading = node('h4'), itineraryText = node('p'), itineraryList = node('ul');
    itinerary.append(itineraryHeading, itineraryText, itineraryList);
    const stock = node('section', '', 'expedition_card'), stockHeading = node('h4'), stockText = node('p'), stockList = node('ul');
    stock.append(stockHeading, stockText, stockList);
    const chain = node('section', '', 'expedition_card'), chainHeading = node('h4'), chainText = node('p'), chainList = node('ul');
    chain.append(chainHeading,chainText,chainList);
    const records = node('details', '', 'notebook_preparation'), recordList = node('ul', '', 'expedition_history');
    records.append(node('summary', 'Your recorded findings'), recordList);
    element.append(summary, intro, status, beginRow, work, itinerary, stock, chain, actions, records);

    let notice = '', nextRow = 0, displayedSequence = null, displayedView = null;
    const actionRows = new Map(), recordRows = new Map(), itineraryRows = new Map(), stockRows = new Map(), chainRows = new Map();
    const focusSummary = () => summary.focus();
    const hide = (entry, hidden) => {
        if(hidden && !entry.hidden && entry.contains(document.activeElement)) {
            if(entry === element) {
                const tab = document.getElementById('adventure_notebook')?.querySelector('[role="tab"][aria-selected="true"]:not([hidden])');
                (tab || document.getElementById('journal_show_notebook'))?.focus();
            } else focusSummary();
        }
        entry.hidden = hidden;
    };
    const remove = entry => {
        if(entry.contains(document.activeElement)) focusSummary();
        entry.remove();
    };
    const disable = (control, disabled) => {
        if(disabled && !control.disabled && document.activeElement === control) focusSummary();
        control.disabled = disabled;
    };
    const run = resolve => {
        try {
            if(!displayedView || displayedSequence==null)throw new Error('Refresh the displayed offer before choosing work.');
            // Keep the exact shown step/target/sequence. A fresh read at click
            // could turn a single-kit itinerary offer into a paired recipe.
            const request = typeof resolve === 'function' ? resolve(displayedView) : resolve;
            command({...request, sequence: displayedSequence});
            notice = request.type === 'cancel' ? 'Cancellation saved.' : 'Progress saved.';
        } catch(error) {notice = error?.message || String(error);}
        render();
    };
    const button = (label, resolve) => {
        const control = node('button', label);
        control.type = 'button';
        control.addEventListener('click', () => run(resolve));
        return control;
    };
    const begin = button('Ask about the wet lantern', {type: 'begin'});
    beginRow.append(begin);
    const cancel = button('Cancel accepted work', view => {
        if(!view.work) throw new Error('That accepted work is no longer available.');
        return {type: 'cancel', id: view.work.id};
    });
    work.append(workText, workTerms, cancel);

    function actionRow(action) {
        const row = node('section', '', 'expedition_card'), description = node('p');
        const terms = node('p', '', 'expedition_preview'), reason = node('p', '', 'expedition_requirements');
        const entry = {row, description, terms, reason, action};
        const prefix = `repository_absorption_action_${++nextRow}`;
        description.id = `${prefix}_description`; terms.id = `${prefix}_terms`; reason.id = `${prefix}_reason`;
        entry.control = button(action.label, view => {
            const current = (view.actions || []).find(candidate => candidate.id === entry.action.id);
            if(!current) throw new Error('That action is no longer available.');
            if(current.type==='projection')return {type:'projection',projectionKind:current.projectionKind,request:current.request};
            return {type: 'command', id: current.id, ...(current.targetId ? {targetId: current.targetId} : {})};
        });
        entry.control.setAttribute('aria-describedby', `${description.id} ${terms.id} ${reason.id}`);
        row.append(entry.control, description, terms, reason);
        actions.append(row);
        return entry;
    }

    function renderNotes(value, section, heading, description, list, rows, fallbackLabel) {
        // Structured notes contain only authored display text. In particular,
        // never stringify an owner/stock object or expose registry identifiers.
        const known = value?.known !== false;
        const label = known && typeof value !== 'string' ? value?.label || '' : '';
        const text = known ? textOf(value) : '';
        const suppliedRows = known && typeof value === 'object' ? value?.rows || value?.steps : null;
        const notes = Array.isArray(suppliedRows) ? suppliedRows : [];
        const shown = new Set();
        for(const note of notes) {
            if(note?.known === false || !note?.id || (!textOf(note) && !note.label)) continue;
            shown.add(note.id);
            let entry = rows.get(note.id);
            if(!entry) {entry = node('li'); rows.set(note.id, entry); list.append(entry);}
            entry.textContent = [note.label, textOf(note)].filter(Boolean).join(': ');
        }
        for(const [id, entry] of rows) if(!shown.has(id)) {remove(entry); rows.delete(id);}
        heading.textContent = label || fallbackLabel;
        description.textContent = text;
        description.hidden = !text;
        list.hidden = !shown.size;
        hide(section, !text && !shown.size);
    }

    function render() {
        const snapshot = read();
        const view = repositoryAbsorptionPresentation(snapshot.state, registry, snapshot.context);
        displayedSequence=snapshot.state.sequence;displayedView=view;
        const writable = snapshot.enabled ?? snapshot.canWrite ?? false;
        const blocked = !writable || !!snapshot.error;
        const interactionBlocked = blocked || !!snapshot.inDialogue || !!snapshot.inCombat;
        const busyReason = snapshot.inCombat ? 'Finish combat before starting work.'
            : snapshot.inDialogue ? 'Finish your conversation before starting work.'
            : !writable ? 'Saving must be available before this action.' : '';
        hide(element, !view.visible && !view.work);
        hide(beginRow, !view.canBegin);
        disable(begin, interactionBlocked);
        intro.hidden = !view.canBegin;

        hide(work, !view.work);
        workText.textContent = view.work ? `${view.work.label} · ${Math.max(0, view.work.remainingMinutes)} played minutes remaining.` : '';
        workTerms.textContent = view.work ? joined(view.work.preview) || cancellationText(view.work.cancellation) : '';
        workTerms.hidden = !workTerms.textContent;
        hide(cancel, !view.work || !view.work.cancellation || view.work.cancellation === 'none');
        disable(cancel, interactionBlocked);
        cancel.textContent = view.work?.cancellation === 'refund' ? 'Cancel · return reserved inputs' : 'Cancel · forfeit spent inputs';

        const shownActions = new Set((view.actions || []).map(action => action.id));
        for(const [id, entry] of actionRows) if(!shownActions.has(id)) {remove(entry.row); actionRows.delete(id);}
        for(const action of view.actions || []) {
            let entry = actionRows.get(action.id);
            if(!entry) {entry = actionRow(action); actionRows.set(action.id, entry);}
            entry.action = action;
            entry.control.textContent = action.label;
            disable(entry.control, interactionBlocked || !action.eligible);
            entry.description.textContent = textOf(action.description);
            entry.description.hidden = !entry.description.textContent;
            entry.terms.textContent = termsOf(action);
            entry.terms.hidden = !entry.terms.textContent;
            const reasons = [textOf(snapshot.error), joined(action.reasons), entry.control.disabled ? busyReason : ''].filter(Boolean);
            entry.reason.textContent = [...new Set(reasons)].join(' ');
            entry.reason.hidden = !entry.reason.textContent;
        }

        renderNotes(view.itinerary, itinerary, itineraryHeading, itineraryText, itineraryList, itineraryRows, 'Known work plan');
        renderNotes(view.stock, stock, stockHeading, stockText, stockList, stockRows, 'Disclosed supplies');
        renderNotes(view.methodChain, chain, chainHeading, chainText, chainList, chainRows, 'Recorded method & consequences');
        const shownRecords = new Set();
        for(const record of view.records || []) {
            if(record.known === false || !record.id || !textOf(record)) continue;
            shownRecords.add(record.id);
            let entry = recordRows.get(record.id);
            if(!entry) {entry = node('li'); recordList.append(entry); recordRows.set(record.id, entry);}
            const at = Number.isFinite(record.at) ? `Recorded at played minute ${record.at}.` : '';
            entry.textContent = [textOf(record), basisText(record.basis), at].filter(Boolean).join(' · ');
        }
        for(const [id, entry] of recordRows) if(!shownRecords.has(id)) {remove(entry); recordRows.delete(id);}
        hide(records, !shownRecords.size);
        const message = textOf(snapshot.error) || notice || (interactionBlocked ? busyReason : '');
        if(status.textContent !== message) status.textContent = message;
        status.hidden = !message;
    }

    document.getElementById('location_actions_div')?.append(element);
    render();
    return {element, render};
}
