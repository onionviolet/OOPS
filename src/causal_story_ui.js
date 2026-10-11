import {causalStoryPresentation} from './causal_story_host.js';
import {CAUSAL_STORY_LIMITS} from './causal_story_ids.js';

const rowsOf = value => Array.isArray(value) ? value : [];
const textOf = value => typeof value === 'string' ? value
    : value?.known === false ? '' : typeof value?.text === 'string' ? value.text
    : typeof value?.label === 'string' ? value.label : '';
const linesOf = value => (Array.isArray(value) ? value : [value]).map(textOf).filter(Boolean);
const minutes = value => Number.isFinite(value) && value >= 0 ? String(Number(value.toFixed(2))) : '';
const cancellationText = value => {
    if(value === 'refund') return 'Cancellation returns reserved inputs.';
    if(value === 'forfeit') return 'Cancellation forfeits spent inputs.';
    if(value === 'none') return 'Accepted work cannot be cancelled.';
    return linesOf(value).join(' ');
};
const durationText = value => {
    const authored = textOf(value);
    if(authored) return authored;
    const time = minutes(value);
    return time ? `${time} played minutes.` : '';
};
const remainingText = value => {
    const authored = textOf(value);
    if(authored) return authored;
    const time = minutes(value);
    return time ? `${time} played minutes remaining.` : 'Remaining time is unavailable.';
};
const hostErrorText = value => textOf(value) || (value
    ? 'The current story state is unavailable. Refresh the actions to try again.' : '');
const commandPresent = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const canCancel = row => commandPresent(row.command) && row.eligible !== false
    && row.cancellation !== 'none' && row.cancellation?.canCancel !== false;

// This serialization is used only for freshness comparison, never as UI text.
// The host's current sequence/token are opaque quote fields. Every other command
// field, including its actual target and jobId, must still match the shown offer.
function comparable(value, depth = 0) {
    if(depth > 24) throw new TypeError('Unsupported story quote.');
    if(value === null || typeof value === 'string' || typeof value === 'boolean') return value;
    if(typeof value === 'number' && Number.isFinite(value)) return value;
    if(Array.isArray(value)) return value.map(child => comparable(child, depth + 1));
    if(value && typeof value === 'object' && [Object.prototype, null].includes(Object.getPrototypeOf(value))) {
        return Object.fromEntries(Object.keys(value).sort().map(key => [key, comparable(value[key], depth + 1)]));
    }
    throw new TypeError('Unsupported story quote.');
}

function offerSignature(row, kind) {
    if(!commandPresent(row.command)) return null;
    const request = Object.fromEntries(Object.entries(row.command).filter(([key]) => key !== 'sequence' && key !== 'token'));
    const terms = {command: request, label: textOf(row.label)};
    if(kind === 'action') {
        terms.costs = row.costs ?? null;
        terms.duration = row.duration ?? null;
    }
    terms.cancellation = row.cancellation ?? null;
    return JSON.stringify(comparable(terms));
}

/** Observer-safe controls for the original optional Village causal cases. */
export function createCausalStoryUI({read, registry, command, container} = {}) {
    if(typeof read !== 'function' || typeof command !== 'function') {
        throw new TypeError('Causal story read and command callbacks are required.');
    }
    const parent = container || document.getElementById('location_actions_div');
    if(!parent?.append) throw new TypeError('A Causal story action container is required.');
    const owner = parent.ownerDocument || document;
    const node = (tag, text = '', className = '') => {
        const result = owner.createElement(tag);
        result.textContent = text;
        if(className) result.className = className;
        return result;
    };
    const setText = (target, value) => {
        if(target.textContent !== value) target.textContent = value;
    };

    const element = node('details', '', 'expedition_panel');
    element.id = 'causal_story_panel';
    const summary = node('summary', 'Village crossroads');
    summary.tabIndex = 0;
    const source = node('p', 'Three couriers, one keeper, and work that can carry on without you.');
    const terms = node('p', `Joining is optional. Each begun case has a ${CAUSAL_STORY_LIMITS.clockWindow}-played-minute window. Time advances during supported play; closing the browser does not advance these cases.`, 'expedition_preview');
    const status = node('p', '', 'expedition_notice');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    status.tabIndex = -1;
    const refresh = node('button', 'Refresh actions');
    refresh.type = 'button';
    refresh.hidden = true;
    const sections = node('div');
    element.append(summary, source, terms, status, refresh, sections);
    parent.append(element);

    const sectionRows = new Map();
    let nextRow = 0, notice = '', busy = false, destroyed = false, projectionFailed = false;

    const focusSummary = () => summary.focus({preventScroll: true});
    const focusOutside = () => {
        const fallback = [...parent.querySelectorAll('button, summary, [tabindex]')]
            .find(candidate => !element.contains(candidate) && !candidate.disabled && !candidate.closest('[hidden]'));
        fallback?.focus({preventScroll: true});
    };
    const hide = (target, hidden) => {
        if(hidden && !target.hidden && target.contains(owner.activeElement)) {
            if(target === element) focusOutside();
            else focusSummary();
        }
        target.hidden = hidden;
    };
    const remove = target => {
        if(target.contains(owner.activeElement)) focusSummary();
        target.remove();
    };
    const disable = (control, disabled) => {
        if(disabled && !control.disabled && owner.activeElement === control) focusSummary();
        control.disabled = disabled;
    };

    function reconcile(target, cache, values, create, update) {
        const shown = new Set(), ordered = [];
        for(const value of rowsOf(values)) {
            if(value?.known === false || typeof value?.id !== 'string' || !value.id || shown.has(value.id)) continue;
            shown.add(value.id);
            let entry = cache.get(value.id);
            if(!entry) {entry = create(value); cache.set(value.id, entry);}
            update(entry, value);
            ordered.push(entry.element);
        }
        for(const [id, entry] of cache) if(!shown.has(id)) {
            remove(entry.element);
            cache.delete(id);
        }
        const focused = owner.activeElement;
        for(let index = 0; index < ordered.length; index += 1) {
            if(target.children[index] !== ordered[index]) target.insertBefore(ordered[index], target.children[index] || null);
        }
        if(focused?.isConnected && target.contains(focused) && owner.activeElement !== focused && !focused.closest('[hidden]')) {
            focused.focus({preventScroll: true});
        }
    }

    function project() {
        const snapshot = read();
        if(!snapshot?.state) throw new TypeError('Current story state is unavailable.');
        const view = causalStoryPresentation(snapshot.state, registry, snapshot.context || {});
        if(!view || !Array.isArray(view.sections)) throw new TypeError('Current story presentation is unavailable.');
        return {snapshot, view, error: hostErrorText(snapshot.error) || hostErrorText(view.error)};
    }

    function currentRow(view, sectionId, kind, id) {
        const matchingSections = view.sections.filter(section => section?.id === sectionId && section.known !== false);
        if(matchingSections.length !== 1) return null;
        const matches = rowsOf(matchingSections[0][kind === 'work' ? 'work' : 'actions'])
            .filter(row => row?.id === id && row.known !== false);
        return matches.length === 1 ? matches[0] : null;
    }

    async function invoke(sectionId, kind, shown) {
        if(destroyed || busy || !shown || !commandPresent(shown.command)) return;
        if(kind === 'action' ? shown.eligible !== true : !canCancel(shown)) return;
        let fresh;
        try {
            const projected = project();
            fresh = currentRow(projected.view, sectionId, kind, shown.id);
            const allowed = kind === 'action' ? fresh?.eligible === true : fresh && canCancel(fresh);
            if(projected.error || projected.snapshot.enabled === false || projected.snapshot.canWrite === false
                || projected.view.visible !== true || !allowed
                || offerSignature(shown, kind) !== offerSignature(fresh, kind)) {
                notice = projected.error || 'That offer changed. Review the refreshed actions and terms before choosing again.';
                renderProjected(projected);
                return;
            }
            busy = true;
            notice = kind === 'work' ? 'Requesting cancellation…' : 'Applying your choice…';
            renderProjected(projected);
            // No new request, target, cost, sequence, token or jobId is invented.
            // The current host quote is forwarded intact to its durable owner.
            const result = await command(fresh.command);
            if(!destroyed) notice = result === false
                ? 'The choice could not be completed. Review the current actions and try again.'
                : 'Current story actions refreshed.';
        } catch {
            if(!destroyed) notice = 'The choice could not be completed. Refresh the actions and try again.';
        } finally {
            busy = false;
            if(!destroyed) render();
        }
    }

    function makeAction(sectionId) {
        const card = node('section', '', 'expedition_card');
        const control = node('button');
        control.type = 'button';
        const costs = node('p', '', 'expedition_preview');
        const duration = node('p', '', 'expedition_preview');
        const cancellation = node('p', '', 'expedition_preview');
        const reasons = node('p', '', 'expedition_requirements');
        const key = `causal_story_action_${++nextRow}`;
        costs.id = `${key}_costs`; duration.id = `${key}_duration`;
        cancellation.id = `${key}_cancellation`; reasons.id = `${key}_reasons`;
        const entry = {element: card, control, costs, duration, cancellation, reasons, row: null};
        control.addEventListener('click', () => {void invoke(sectionId, 'action', entry.row);});
        card.append(control, costs, duration, cancellation, reasons);
        return entry;
    }

    function makeWork(sectionId) {
        const card = node('section', '', 'expedition_card');
        const label = node('h5'), remaining = node('p'), cancellation = node('p', '', 'expedition_preview');
        const control = node('button', 'Cancel accepted work');
        control.type = 'button';
        cancellation.id = `causal_story_work_${++nextRow}_cancellation`;
        control.setAttribute('aria-describedby', cancellation.id);
        const entry = {element: card, label, remaining, cancellation, control, row: null};
        control.addEventListener('click', () => {void invoke(sectionId, 'work', entry.row);});
        card.append(label, remaining, cancellation, control);
        return entry;
    }

    function makeSection() {
        const section = node('section', '', 'expedition_card');
        const heading = node('h4'), description = node('p');
        const phase = node('p', '', 'expedition_state'), clock = node('p', '', 'expedition_preview');
        clock.setAttribute('role', 'timer');
        clock.setAttribute('aria-live', 'off');
        const paragraphs = node('div'), approaches = node('div');
        const latest = node('section'), latestText = node('p');
        latest.append(node('h5', 'Latest received account'), latestText);
        const work = node('div'), workHeading = node('h5', 'Accepted work');
        const records = node('details', '', 'notebook_preparation'), recordList = node('ul', '', 'expedition_history');
        records.append(node('summary', 'Earlier observed and received accounts'), recordList);
        section.append(heading, phase, description, paragraphs, clock, workHeading, work, latest, approaches, records);
        return {element: section, heading, description, phase, clock, paragraphs, paragraphRows:new Map(),
            approaches, approachRows:new Map(), latest, latestText, workHeading,
            work, workRows: new Map(), records, recordList, recordRows: new Map()};
    }

    function makeApproach(group) {
        const element = node('details', '', 'notebook_preparation');
        element.open = group.id === 'help' || group.id === 'afterward' || group.id === 'all';
        const heading = node('summary'), description = node('p', '', 'expedition_preview'), actions = node('div');
        element.append(heading, description, actions);
        return {element, heading, description, actions, actionRows:new Map()};
    }

    function renderAction(actionEntry, row, blocked) {
        actionEntry.row = row;
        setText(actionEntry.control, textOf(row.label));
        disable(actionEntry.control, blocked || row.eligible !== true || !commandPresent(row.command));
        setText(actionEntry.costs, linesOf(row.costs).join(' '));
        setText(actionEntry.duration, durationText(row.duration));
        setText(actionEntry.cancellation, cancellationText(row.cancellation));
        setText(actionEntry.reasons, [...new Set(linesOf(row.reasons))].join(' '));
        const descriptions = [actionEntry.costs, actionEntry.duration, actionEntry.cancellation, actionEntry.reasons];
        for(const description of descriptions) hide(description, !description.textContent);
        const ids = descriptions.filter(description => !description.hidden).map(description => description.id);
        if(ids.length) actionEntry.control.setAttribute('aria-describedby', ids.join(' '));
        else actionEntry.control.removeAttribute('aria-describedby');
    }

    function renderProjected(projected) {
        const {snapshot, view, error} = projected;
        projectionFailed = false;
        const blocked = busy || !!error;
        const writeBlocked = snapshot.enabled === false || snapshot.canWrite === false;
        element.setAttribute('aria-busy', String(busy));
        hide(element, view.visible !== true && !error);
        setText(status, error || (writeBlocked ? 'Saving must be available before this choice.' : '') || notice);
        hide(status, !status.textContent);
        hide(refresh, !error);
        disable(refresh, busy);
        // Both optional status flags may be supplied by the native host. Their
        // absence does not create another saving/interaction policy in this UI.
        reconcile(sections, sectionRows, view.sections, makeSection, (entry, section) => {
            const scene=section.scene;
            setText(entry.heading, textOf(scene?.title) || textOf(section.label));
            setText(entry.phase, textOf(scene?.phaseLabel));
            hide(entry.phase, !entry.phase.textContent);
            setText(entry.description, textOf(section.description));
            hide(entry.description, !entry.description.textContent);
            reconcile(entry.paragraphs, entry.paragraphRows, linesOf(scene?.paragraphs).map((text,index)=>({id:String(index),text})),
                () => ({element:node('p')}), (paragraph,row) => setText(paragraph.element,row.text));
            setText(entry.clock, textOf(scene?.clockText));
            hide(entry.clock, !entry.clock.textContent);
            setText(entry.latestText, textOf(scene?.latestAccount?.text));
            hide(entry.latest, !entry.latestText.textContent);
            const groups=Array.isArray(scene?.groups)?scene.groups:[{id:'all',label:'Your response',actions:section.actions}];
            reconcile(entry.approaches, entry.approachRows, groups.filter(group=>rowsOf(group.actions).length), makeApproach, (approach,group) => {
                setText(approach.heading, textOf(group.label));
                setText(approach.description, textOf(group.description));
                hide(approach.description, !approach.description.textContent);
                reconcile(approach.actions, approach.actionRows, group.actions, () => makeAction(section.id),
                    (actionEntry,row) => renderAction(actionEntry,row,blocked || writeBlocked));
            });
            reconcile(entry.work, entry.workRows, section.work, () => makeWork(section.id), (workEntry, row) => {
                workEntry.row = row;
                setText(workEntry.label, textOf(row.label));
                setText(workEntry.remaining, remainingText(row.remaining));
                setText(workEntry.cancellation, cancellationText(row.cancellation));
                hide(workEntry.cancellation, !workEntry.cancellation.textContent);
                hide(workEntry.control, !canCancel(row));
                disable(workEntry.control, blocked || writeBlocked || !canCancel(row));
            });
            hide(entry.workHeading, !entry.workRows.size);
            reconcile(entry.recordList, entry.recordRows, rowsOf(section.records).filter(record => textOf(record.text)),
                () => ({element: node('li')}), (recordEntry, record) => {
                    const at = minutes(record.at);
                    setText(recordEntry.element, [textOf(record.text), at ? `Recorded at played minute ${at}.` : ''].filter(Boolean).join(' '));
                });
            hide(entry.records, !entry.recordRows.size);
        });
    }

    function render() {
        if(destroyed) return;
        try {renderProjected(project());}
        catch {
            projectionFailed = true;
            hide(element, false);
            setText(status, 'The current story state is unavailable. Refresh the actions to try again.');
            hide(status, false);
            hide(refresh, false);
            disable(refresh, busy);
            for(const section of sectionRows.values()) {
                for(const group of section.approachRows.values())
                    for(const action of group.actionRows.values()) disable(action.control, true);
                for(const work of section.workRows.values()) disable(work.control, true);
            }
        }
    }
    refresh.addEventListener('click', () => {
        if(destroyed || busy) return;
        notice = '';
        render();
        if(!projectionFailed && !refresh.hidden) status.focus({preventScroll: true});
    });
    // The initial render can precede hero creation or the save lease. Opening
    // the panel must quote the current body and ownership, not that old frame.
    element.addEventListener('toggle', () => {
        if(element.open && !destroyed && !busy) render();
    });
    render();
    return {element, render, destroy() {
        if(destroyed) return;
        destroyed = true;
        if(element.contains(owner.activeElement)) focusOutside();
        element.remove();
        sectionRows.clear();
    }};
}
