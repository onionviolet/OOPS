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
    const reason = !running && target && !target.eligible ? [...new Set(target.reasons || [])].join(' ') : '';
    const flavour = action?.eligible && !running ? action.flavour || '' : '';
    return {
        title: arc.title,
        state: running ? 'Work under way' : target && !target.eligible ? 'Not ready yet' : walk ? 'Walk first' : target ? 'Ready' : next ? 'Next task' : 'Situation complete',
        next: running ? `In progress: ${running.label}` : next ? `Next: ${next.label}` : 'This arc is complete.',
        terms: running ? `${running.left} min` : target ? shortActionLabel(target.label).chip : '',
        termsLabel: running ? 'Time left' : walk ? 'Walk first' : 'Before you begin',
        targetId: running ? null : target?.id || null,
        workId: running?.id || null,
        context: !running ? action?.description || '' : '',
        waitId: !running && action && !action.eligible && next?.readyAt ? view.waits?.find(w=>w.at===next.readyAt)?.id || null : null,
        link: running ? 'Show current work' : walk ? 'Show the walk to this task' : 'Show current action',
        reason,
        route: walk ? `Travel next: ${shortActionLabel(walk.label).text}` : '',
        // Local narrator texture, not character speech or a promise about the outcome.
        flavour,
        aftermath: arc.aftermath || '',
        conclusion: arc.done ? arc.conclusion || '' : '',
    };
}

export function renderLotmTaskSummary(view, {findControl, findWork, renderAction}) {
    const model = lotmTaskSummary(view);
    if (!model) return null;
    const action = model.targetId && view.objectActs?.find(a=>a.id===model.targetId);
    const direct = action && renderAction ? renderAction(action) : null;
    const el = (tag, text) => {const n = document.createElement(tag); if (text) n.textContent = text; return n;};
    const section = el('section'); section.dataset.lotmArc = view.arc.id;
    section.className = 'ui-panel-section';
    section.setAttribute('aria-labelledby', 'lotm-current-task-title');
    if (view.arc.next) {section.dataset.nextCommand = view.arc.next.id; section.dataset.nextPlace = view.arc.next.place;}
    const heading = el('h3', model.title); heading.id = 'lotm-current-task-title'; heading.tabIndex = -1;
    const state = el('p', model.state); state.dataset.lotmTaskState = '';
    section.append(heading, state, el('p', model.next));
    if (model.context) {const context = el('p', model.context); context.dataset.lotmTaskContext = ''; section.append(context);}
    if (model.flavour) {const aside = el('p'); aside.dataset.lotmTaskFlavour = ''; aside.append(el('i', model.flavour)); section.append(aside);}
    if (model.route) section.append(el('p', model.route));
    if (model.terms && !direct) {const terms = el('p', `${model.termsLabel}: ${model.terms}`); terms.dataset.lotmTaskTerms = ''; section.append(terms);}
    if (model.reason) {const line=el('p','Known blocker: '),reason=el('span',model.reason);reason.id='lotm-current-task-blocker';line.append(reason);section.append(line);}
    if (direct) {if(model.reason)(direct.querySelector('[data-lotm]')||direct).setAttribute('aria-describedby','lotm-current-task-blocker'); const home=el('div'); home.className='lotm-task-action'; home.dataset.lotmTaskAction=''; home.append(direct); section.append(home);}
    else if (model.targetId) {
        const link = el('button', model.link); link.type = 'button'; link.dataset.lotmTaskLink = model.targetId;
        link.title = 'Find the existing control. This does not spend anything or begin work.';
        link.onclick = () => findControl(model.targetId, {focusAction: true}); section.append(link);
    }
    if (model.workId) {
        const link = el('button', 'Show current work'); link.type = 'button'; link.dataset.lotmTaskWorkLink = model.workId;
        link.title = 'Inspect this work without stopping it or advancing time.';
        link.onclick = () => findWork(model.workId); section.append(link);
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
