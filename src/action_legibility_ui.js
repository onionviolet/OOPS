const textNode = (tag, text = '', className = '') => {
    const element = document.createElement(tag);
    element.textContent = text == null ? '' : String(text);
    if (className) element.className = className;
    return element;
};

const rows = (values) => Array.isArray(values) ? values : [];
const labelOf = (value) => value?.text ?? value?.label ?? '';
const setText = (node, value) => {
    const next = value == null ? '' : String(value);
    if (node.textContent !== next) node.textContent = next;
};

function reconcile(container, cache, values, keyOf, create, update, remove) {
    const live = new Set();
    const ordered = [];
    for (const value of values) {
        if (!value) continue;
        const rawKey = keyOf(value);
        if (rawKey == null || String(rawKey) === '') continue;
        const key = String(rawKey);
        if (live.has(key)) continue;
        live.add(key);
        let entry = cache.get(key);
        if (!entry) {
            entry = create(value, key);
            cache.set(key, entry);
        }
        update(entry, value, key);
        ordered.push(entry.element || entry);
    }
    for (const [key, entry] of cache) {
        if (!live.has(key)) {
            remove?.(entry, key);
            (entry.element || entry).remove();
            cache.delete(key);
        }
    }
    const focused = document.activeElement;
    for (let index = 0; index < ordered.length; index += 1) {
        const element = ordered[index];
        if (container.children[index] !== element) {
            container.insertBefore(element, container.children[index] || null);
        }
    }
    if (focused?.isConnected && container.contains(focused) && document.activeElement !== focused && !focused.closest('[hidden]')) {
        focused.focus({preventScroll: true});
    }
}

function itemList(className) {
    const list = textNode('ul', '', className);
    const cache = new Map();
    return {
        element: list,
        render(values, keyOf = (item) => item.id, renderText = labelOf) {
            reconcile(list, cache, rows(values), keyOf,
                () => textNode('li'),
                (item, value) => setText(item, renderText(value)));
        },
    };
}

function section(label, className) {
    const root = textNode('section', '', `action-legibility__section ${className}`);
    const heading = textNode('h4', label);
    const list = itemList('action-legibility__items');
    root.append(heading, list.element);
    return { element: root, heading, list };
}

function makeActionCard(id) {
    const element = textNode('article', '', 'action-legibility__card');
    element.dataset.actionLegibilityKey = `action:${id}`;
    const heading = textNode('h3');
    const description = textNode('p', '', 'action-legibility__description');
    const status = textNode('p', '', 'action-legibility__status');
    const req = section('Known requirements', 'action-legibility__requirements');
    const blockers = section('Why this is unavailable', 'action-legibility__blockers');
    const costs = section('Costs', 'action-legibility__costs');
    const duration = textNode('p', '', 'action-legibility__duration');
    const cancellation = textNode('p', '', 'action-legibility__cancellation');
    const reservations = section('Reserved', 'action-legibility__reservations');
    const preparation = section('Preparation', 'action-legibility__preparation');
    const completion = section('Completion terms', 'action-legibility__completion');
    const controls = textNode('div', '', 'action-legibility__controls');
    const actionButton = textNode('button', '', 'action-legibility__button');
    actionButton.type = 'button';
    const alternatives = textNode('div', '', 'action-legibility__alternatives');
    const alternativeCache = new Map();
    controls.append(actionButton, alternatives);
    element.append(heading, description, status, req.element, blockers.element,
        costs.element, duration, cancellation, reservations.element, preparation.element,
        completion.element, controls);
    return { element, heading, description, status, req, blockers, costs,
        duration, cancellation, reservations, preparation, completion, controls, actionButton,
        alternatives, alternativeCache, row: null };
}

function makeWorkCard(id) {
    const element = textNode('article', '', 'action-legibility__card action-legibility__work');
    element.dataset.actionLegibilityKey = `work:${id}`;
    const heading = textNode('h3');
    const status = textNode('p', '', 'action-legibility__status');
    const remaining = textNode('p', '', 'action-legibility__remaining');
    const costs = section('Costs', 'action-legibility__costs');
    const reservations = section('Reserved', 'action-legibility__reservations');
    const completion = section('Completion terms', 'action-legibility__completion');
    const controls = textNode('div', '', 'action-legibility__controls');
    const cancelButton = textNode('button', '', 'action-legibility__button action-legibility__cancel');
    cancelButton.type = 'button';
    const cancelNote = textNode('p', '', 'action-legibility__cancel-note');
    controls.append(cancelButton);
    element.append(heading, status, remaining, costs.element, reservations.element,
        completion.element, cancelNote, controls);
    return { element, heading, status, remaining, costs, reservations,
        completion, controls, cancelButton, cancelNote, row: null };
}

function makeAftermathCard(id) {
    const element = textNode('article', '', 'action-legibility__card action-legibility__aftermath');
    element.dataset.actionLegibilityKey = `aftermath:${id}`;
    const body = textNode('p', '', 'action-legibility__aftermath-text');
    const qualifiers = textNode('p', '', 'action-legibility__qualifiers');
    const causes = section('What this followed', 'action-legibility__causes');
    element.append(body, qualifiers, causes.element);
    return { element, body, qualifiers, causes };
}

/** Render observer-qualified action, accepted-work, and retained-aftermath rows. */
export function createActionLegibilityList({
    parent,
    onAction = () => {},
    onAlternative = () => {},
    onCancel = () => {},
    onError,
    focusFallback,
    idPrefix = 'action-legibility',
} = {}) {
    if (!parent?.append) throw new TypeError('A parent DOM element is required.');
    const element = textNode('div', '', 'action-legibility');
    element.dataset.actionLegibility = String(idPrefix);
    element.tabIndex = -1;
    const notice = textNode('p', '', 'action-legibility__notice');
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.tabIndex = -1;
    const actionsHeading = textNode('h2', 'Known actions');
    const actions = textNode('div', '', 'action-legibility__group action-legibility__actions');
    const workHeading = textNode('h2', 'In progress');
    const work = textNode('div', '', 'action-legibility__group action-legibility__work-list');
    const aftermathHeading = textNode('h2', 'Afterward');
    const aftermath = textNode('div', '', 'action-legibility__group action-legibility__aftermath-list');
    element.append(notice, actionsHeading, actions, workHeading, work,
        aftermathHeading, aftermath);
    parent.append(element);

    const actionCache = new Map(), workCache = new Map(), aftermathCache = new Map();
    const listId = String(idPrefix).replace(/[^a-zA-Z0-9_-]/g, '-');
    let globalEnabled = true;
    let pending = null;
    let latestEnabled = true;
    let destroyed = false;
    let hostNotice = '';
    let localNotice = '';

    const updateNotice = () => {
        if (destroyed) return;
        const value = pending ? 'Working…' : hostNotice || localNotice;
        setText(notice, value);
        notice.hidden = !value;
    };

    const moveFocusIfNeeded = (entry) => {
        if (!entry?.element?.contains(document.activeElement)) return;
        const fallback = typeof focusFallback === 'function' ? focusFallback() : focusFallback;
        (fallback?.focus ? fallback : element).focus();
    };
    const invoke = async (kind, row, alternative) => {
        if (destroyed || pending || !globalEnabled) return;
        if (kind === 'action' && (!row.control?.visible || !row.control?.enabled)) return;
        if (kind === 'alternative' && !alternative?.enabled) return;
        if (kind === 'cancel' && (!row.cancellation?.canCancel || !latestEnabled)) return;
        pending = { kind, id: String(row.id) };
        if (kind === 'alternative') pending.alternativeId = String(alternative.id);
        element.setAttribute('aria-busy', 'true');
        updateNotice();
        renderControls();
        try {
            const callback = kind === 'cancel' ? onCancel : kind === 'alternative' ? onAlternative : onAction;
            await callback(row, ...(kind === 'alternative' ? [alternative] : []));
            if (!destroyed) localNotice = 'Request sent. The updated state will appear when available.';
        } catch (error) {
            let safeMessage = 'This action could not be completed. Review the current requirements and try again.';
            if (typeof onError === 'function') {
                try {
                    const supplied = onError(error);
                    if (typeof supplied === 'string' && supplied.trim()) safeMessage = supplied;
                } catch { /* Keep the generic player-facing message. */ }
            }
            if (!destroyed) localNotice = safeMessage;
        } finally {
            pending = null;
            if (!destroyed) {
                element.removeAttribute('aria-busy');
                updateNotice();
                renderControls();
            }
        }
    };
    const describedBy = (id, row) => {
        const refs = [];
        if (rows(row.blockers).length) refs.push(`${id}-blockers`);
        if (rows(row.costs).length) refs.push(`${id}-costs`);
        if (row.duration?.text) refs.push(`${id}-duration`);
        if (row.cancellation?.text) refs.push(`${id}-cancellation`);
        return refs.join(' ') || null;
    };
    const setAriaAction = (button, allowed, description) => {
        button.setAttribute('aria-disabled', String(!allowed));
        if (description) button.setAttribute('aria-describedby', description);
        else button.removeAttribute('aria-describedby');
    };
    const renderControls = () => {
        if (destroyed) return;
        for (const entry of actionCache.values()) {
            const row = entry.row;
            const isPending = pending?.id === String(row.id) && pending.kind !== 'cancel';
            const visible = row.control?.visible !== false;
            const hasAlternatives = entry.alternativeCache.size > 0;
            if (!visible && entry.actionButton.contains(document.activeElement)) moveFocusIfNeeded(entry);
            entry.actionButton.hidden = !visible;
            entry.controls.hidden = !visible && !hasAlternatives;
            setText(entry.actionButton, isPending ? `Working: ${row.label}` : row.status === 'blocked'
                ? `Unavailable: ${row.label}` : `Do this: ${row.label}`);
            const allowed = globalEnabled && !pending && row.control?.enabled === true;
            setAriaAction(entry.actionButton, allowed, describedBy(`al-${listId}-${encodeURIComponent(String(row.id))}`, row));
            for (const alternativeEntry of entry.alternativeCache.values()) {
                const altPending = pending?.id === String(row.id) && pending.kind === 'alternative'
                    && pending.alternativeId === alternativeEntry.id;
                const permitted = globalEnabled && !pending && alternativeEntry.value.enabled === true;
                setText(alternativeEntry.button, altPending ? 'Working…' : alternativeEntry.value.label);
                setAriaAction(alternativeEntry.button, permitted, describedBy(`al-${listId}-${encodeURIComponent(String(row.id))}`, row));
            }
        }
        for (const entry of workCache.values()) {
            const row = entry.row;
            const canCancel = globalEnabled && !pending && row.cancellation?.canCancel === true;
            const visible = row.control?.visible !== false && row.cancellation?.canCancel === true;
            if (!visible && entry.cancelButton.contains(document.activeElement)) moveFocusIfNeeded(entry);
            entry.controls.hidden = !visible;
            entry.cancelButton.hidden = !visible;
            setText(entry.cancelButton, pending?.id === String(row.id) && pending.kind === 'cancel' ? 'Working…' : 'Cancel work');
            setAriaAction(entry.cancelButton, canCancel, entry.cancelNote.textContent ? entry.cancelNote.id : null);
        }
    };

    const render = (view = {}) => {
        if (destroyed) return;
        const { actions: actionRows = [], work: workRows = [], aftermath: aftermathRows = [], enabled = true } = view;
        if (Object.prototype.hasOwnProperty.call(view, 'notice')) {
            hostNotice = view.notice || '';
            localNotice = '';
        } else hostNotice = '';
        latestEnabled = enabled !== false;
        globalEnabled = latestEnabled;
        updateNotice();
        actionsHeading.hidden = !actionRows.length;
        workHeading.hidden = !workRows.length;
        aftermathHeading.hidden = !aftermathRows.length;
        reconcile(actions, actionCache, actionRows, (row) => row.id,
            (_row, id) => makeActionCard(id), (entry, row) => {
                entry.row = row;
                setText(entry.heading, row.label);
                setText(entry.description, row.description);
                entry.description.hidden = !row.description;
                setText(entry.status, row.status === 'blocked' ? 'Unavailable' : row.status === 'discovered' ? 'Discovered' : 'Available');
                entry.status.dataset.status = row.status;
                entry.req.element.hidden = !rows(row.requirements).length;
                entry.req.list.render(row.requirements, (x) => x.id, (x) => `${x.text}${x.met === true ? ' (met)' : x.met === false ? ' (not met)' : ''}`);
                entry.blockers.element.hidden = !rows(row.blockers).length;
                entry.blockers.element.id = `al-${listId}-${encodeURIComponent(String(row.id))}-blockers`;
                entry.blockers.list.render(row.blockers);
                entry.costs.element.hidden = !rows(row.costs).length;
                setText(entry.costs.heading, row.costKind === 'quote' ? 'Quoted costs'
                    : row.costKind === 'terms' ? 'Stated costs' : 'Costs');
                entry.costs.element.id = `al-${listId}-${encodeURIComponent(String(row.id))}-costs`;
                entry.costs.list.render(row.costs);
                entry.duration.hidden = !row.duration?.text;
                entry.duration.id = `al-${listId}-${encodeURIComponent(String(row.id))}-duration`;
                const durationLabel = row.duration?.kind === 'quote' ? 'Time quote' : 'Time terms';
                setText(entry.duration, row.duration?.text ? `${durationLabel}: ${row.duration.text}` : '');
                entry.cancellation.hidden = !row.cancellation?.text;
                entry.cancellation.id = `al-${listId}-${encodeURIComponent(String(row.id))}-cancellation`;
                setText(entry.cancellation, row.cancellation?.text ? `Cancellation: ${row.cancellation.text}` : '');
                entry.reservations.element.hidden = !rows(row.reservations).length;
                entry.reservations.list.render(row.reservations);
                entry.preparation.element.hidden = !rows(row.preparation).length;
                entry.preparation.list.render(row.preparation);
                entry.completion.element.hidden = !rows(row.completion).length;
                entry.completion.list.render(row.completion);
                entry.actionButton.onclick = () => { void invoke('action', entry.row); };
                reconcile(entry.alternatives, entry.alternativeCache, rows(row.alternatives), (alt) => alt.id,
                    (alt, key) => {
                        const button = textNode('button', alt.label, 'action-legibility__button action-legibility__alternative');
                        button.type = 'button';
                        button.dataset.alternativeKey = key;
                        const description = textNode('span', '', 'action-legibility__alternative-description');
                        const wrapper = textNode('div', '', 'action-legibility__alternative-row');
                        wrapper.append(button, description);
                        button.onclick = () => { void invoke('alternative', entry.row, entry.alternativeCache.get(key)?.value); };
                        return { element: wrapper, button, description, value: alt, id: key };
                    }, (alternativeEntry, alt, key) => {
                        alternativeEntry.value = alt;
                        alternativeEntry.id = key;
                        setText(alternativeEntry.button, alt.label);
                        setText(alternativeEntry.description, alt.description);
                        alternativeEntry.description.hidden = !alt.description;
                    }, (alternativeEntry) => moveFocusIfNeeded(alternativeEntry));
            }, (entry) => moveFocusIfNeeded(entry));
        reconcile(work, workCache, workRows, (row) => row.id,
            (_row, id) => makeWorkCard(id), (entry, row) => {
                entry.row = row;
                setText(entry.heading, row.label);
                setText(entry.status, row.status === 'accepted' ? 'Accepted' : row.status || 'In progress');
                setText(entry.remaining, row.remainingText || (Number.isFinite(row.remainingMinutes) ? `${row.remainingMinutes} minutes remaining` : 'Remaining time unavailable'));
                entry.costs.element.hidden = !rows(row.costs).length;
                entry.costs.list.render(row.costs);
                entry.reservations.element.hidden = !rows(row.reservations).length;
                entry.reservations.list.render(row.reservations);
                entry.completion.element.hidden = !rows(row.completion).length;
                entry.completion.list.render(row.completion);
                setText(entry.cancelNote, row.cancellation?.text);
                entry.cancelNote.id = `al-${listId}-work-${encodeURIComponent(String(row.id))}-cancellation`;
                entry.cancelNote.hidden = !row.cancellation?.text;
                entry.cancelButton.onclick = () => { void invoke('cancel', entry.row); };
            }, (entry) => moveFocusIfNeeded(entry));
        reconcile(aftermath, aftermathCache, aftermathRows, (row) => row.id,
            (_row, id) => makeAftermathCard(id), (entry, row) => {
                setText(entry.body, row.text);
                const qualifiers = [row.timeText, row.basisLabel, row.sourceLabel].filter(Boolean);
                setText(entry.qualifiers, qualifiers.join(' · '));
                entry.qualifiers.hidden = !qualifiers.length;
                entry.causes.element.hidden = !rows(row.causes).length;
                entry.causes.list.render(row.causes);
            }, (entry) => moveFocusIfNeeded(entry));
        renderControls();
    };

    return { element, render, destroy() {
        destroyed = true;
        pending = null;
        if (element.contains(document.activeElement)) {
            const fallback = typeof focusFallback === 'function' ? focusFallback() : focusFallback;
            fallback?.focus?.();
        }
        element.remove();
        actionCache.clear(); workCache.clear(); aftermathCache.clear();
    } };
}

/** Wrap the list in a keyboard-native details panel. `read` may provide the first view. */
export function createActionLegibilityPanel(options = {}) {
    const panel = textNode('details', '', 'expedition_panel action-legibility-panel');
    const summary = textNode('summary', options.label || 'Actions and outcomes');
    panel.append(summary);
    const list = createActionLegibilityList({
        ...options,
        parent: panel,
        focusFallback: options.focusFallback || summary,
    });
    const render = (view = typeof options.read === 'function' ? options.read() : undefined) => {
        list.render(view || {});
    };
    if (typeof options.read === 'function') render();
    return { panel, render, destroy() { list.destroy(); panel.remove(); } };
}
