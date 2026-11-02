import {shortActionLabel} from './action_label.js';

// Presentation of the admitted current task. No future stages, new quote or mutation.
export function lotmTaskSummary(view) {
    const arc = view.arc;
    if (!arc) return null;
    const next = arc.next;
    const running = next && view.jobs?.find(j => j.commandId === next.id);
    const action = next && view.objectActs?.find(a => a.id === next.id);
    const walk = !action && next && view.moves?.find(m => m.to === next.place);
    const target = action || walk;
    return {
        title: arc.title,
        next: running ? `In progress: ${running.label}` : next ? `Next: ${next.label}` : 'This arc is complete.',
        terms: running ? `${running.left} min remaining` : target ? shortActionLabel(target.label).chip : '',
        targetId: running ? running.cancellable ? 'cancel' : null : target?.id || null,
        waitId: !running && action && !action.eligible && next?.readyAt ? view.waits?.find(w=>w.at===next.readyAt)?.id || null : null,
        link: running ? 'Show current work' : walk ? 'Show the walk to this task' : 'Show current action',
        reason: !running && target && !target.eligible ? [...new Set(target.reasons || [])].join(' ') : '',
        route: walk ? `Travel next: ${walk.label}` : '',
        aftermath: arc.aftermath || '',
        conclusion: arc.done ? arc.conclusion || '' : '',
    };
}

export function renderLotmTaskSummary(view, {findControl}) {
    const model = lotmTaskSummary(view);
    if (!model) return null;
    const el = (tag, text) => {const n = document.createElement(tag); if (text) n.textContent = text; return n;};
    const section = el('section'); section.dataset.lotmArc = view.arc.id;
    section.className = 'ui-panel-section';
    if (view.arc.next) {section.dataset.nextCommand = view.arc.next.id; section.dataset.nextPlace = view.arc.next.place;}
    section.append(el('h3', model.title), el('p', model.next));
    if (model.route) section.append(el('p', model.route));
    if (model.terms) {const terms = el('p', `Current terms: ${model.terms}`); terms.dataset.lotmTaskTerms = ''; section.append(terms);}
    if (model.reason) section.append(el('p', model.reason));
    if (model.targetId) {
        const link = el('button', model.link); link.type = 'button'; link.dataset.lotmTaskLink = model.targetId;
        link.title = 'Find the existing control. This does not spend anything or begin work.';
        link.onclick = () => findControl(model.targetId, {focusAction: true}); section.append(link);
    }
    if (model.waitId) {
        const link = el('button', 'Show wait for this task'); link.type = 'button'; link.dataset.lotmTaskWaitLink = model.waitId;
        link.title = 'Find the already offered wait target. This does not advance time.';
        link.onclick = () => findControl(model.waitId, {focusAction: true}); section.append(link);
    }
    if (model.aftermath) {const result = el('p', `Last result: ${model.aftermath}`); result.dataset.lotmLastResult = ''; section.append(result);}
    if (model.conclusion) section.append(el('p', model.conclusion));
    return section;
}
