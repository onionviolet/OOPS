import {projectActionLegibility} from './action_legibility.js';
import {createActionLegibilityList} from './action_legibility_ui.js';

const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
};
const textOf = value => typeof value === 'string' ? value : '';
const statusLabels = {
    inactive: 'Conversation not started.',
    active: 'Conversation in progress.',
    paused: 'Conversation paused.',
    complete: 'Conversation finished.',
    incompatible: 'Saved conversation needs recovery.'
};
const choiceBlockers = {
    inactive: 'Start the conversation before choosing.',
    paused: 'Resume the conversation before choosing.',
    complete: 'This conversation is complete.',
    incompatible: 'Recover the saved conversation before choosing.'
};
const entriesOf = values => {
    const ids = new Set();
    return (Array.isArray(values) ? values : []).filter(entry => {
        if(!entry || !textOf(entry.id) || !textOf(entry.label) || ids.has(entry.id)) return false;
        ids.add(entry.id);
        return true;
    });
};
const errorText = () => 'The conversation action could not be accepted. Review the current conversation and try again.';

let panelOrdinal = 0;

// This panel renders only the host's observer-safe projection. The host owns
// eligibility, cursor advancement and the durable acceptance of consequences.
export function createInkNarrativeUI(host) {
    if(!host || ['read', 'act', 'choose'].some(name => typeof host[name] !== 'function')) {
        throw new TypeError('Ink narrative UI requires read, act and choose callbacks.');
    }
    const element = node('details', '', 'expedition_panel');
    const ordinal = ++panelOrdinal;
    const panelId = /^ink_[a-z0-9_-]+$/i.test(host.panelId || '') ? host.panelId : ordinal === 1 ? 'ink_narrative_panel' : `ink_narrative_panel_${ordinal}`;
    element.id = panelId;
    element.open = true;
    const summary = node('summary', 'Conversation');
    summary.id = `${panelId}_summary`;
    summary.tabIndex = 0;
    const state = node('p', '', 'expedition_state');
    const recovery = node('p', '', 'expedition_requirements');
    const notice = node('p', '', 'expedition_notice');
    notice.setAttribute('role', 'status');
    const paragraphs = node('div');
    paragraphs.setAttribute('aria-label', 'Conversation');
    const choices = node('section'), choiceRows = node('div');
    choices.setAttribute('aria-label', 'Conversation choices');
    choices.append(node('h4', 'Your response'), choiceRows);
    const actions = node('section'), actionRows = node('div');
    actions.setAttribute('aria-label', 'Conversation controls');
    actions.append(node('h4', 'Conversation controls'), actionRows);
    element.append(summary, state, recovery, notice, paragraphs, choices, actions);

    let lastView = null, message = '', pending = false;
    const setText = (target, value) => {
        if(target.textContent !== value) target.textContent = value;
    };
    // Each projected row retains the token that produced its displayed quote.
    // Do not replace it with a newly read sequence when its button is clicked.
    const run = async (kind, entry) => {
        if(pending || element.hidden || !entry.control?.enabled) return;
        pending = true;
        message = '';
        render();
        try {
            await (kind === 'choice' ? host.choose(entry.inkId, entry.token) : host.act(entry.inkId, entry.token));
        } catch(error) {message = errorText(error);}
        finally {pending = false; render();}
    };
    const choiceList = createActionLegibilityList({parent:choiceRows,idPrefix:'ink-choices',focusFallback:summary,
        onAction:entry=>run('choice',entry)});
    const actionList = createActionLegibilityList({parent:actionRows,idPrefix:'ink-controls',focusFallback:summary,
        onAction:entry=>run('action',entry)});
    function projected(kind, items, status, token) {
        return items.map(item => {
            const statusBlocker = kind === 'choice' && status !== 'active' ? choiceBlockers[status] : '';
            const eligible = item.eligible === true && !statusBlocker;
            // Cost/consequence prose comes from the admitted observer-safe host
            // bridge. Raw evaluator reasons are not blanket public disclosure.
            const row = projectActionLegibility({id:`ink.${kind}.${item.id}`,label:item.label,discovered:true,
                preview:{visible:item.visible !== false,eligible,reasons:item.reasons || []},
                disclosure:{costs:textOf(item.costText)?[{known:true,text:item.costText}]:[],
                    completion:textOf(item.consequenceText)?[{known:true,text:item.consequenceText}]:[],
                    blockers:statusBlocker?[{known:true,text:statusBlocker}]:[]}});
            return row && {...row,inkId:item.id,token:token?{...token}:null};
        }).filter(Boolean);
    }

    function render() {
        const focused = document.activeElement, ownedFocus = element.contains(focused);
        let view;
        try {view = host.read() || {}; lastView = view;}
        catch(error) {
            view = {...(lastView || {}), status: 'incompatible', choices: [], actions: [], recoveryText: errorText(error)};
        }
        const status = Object.hasOwn(statusLabels, view.status) ? view.status : 'incompatible';
        element.hidden = view.visible !== true;
        setText(summary, textOf(view.title) || 'Conversation');
        setText(state, statusLabels[status]);
        setText(recovery, textOf(view.recoveryText));
        recovery.hidden = !recovery.textContent;
        setText(notice, pending ? 'Waiting for the conversation action to be accepted.' : message);
        notice.hidden = !notice.textContent;
        const lines = Array.isArray(view.paragraphs) ? view.paragraphs.map(textOf).filter(Boolean) : [];
        lines.forEach((line, index) => {
            if(!paragraphs.children[index]) paragraphs.append(node('p'));
            setText(paragraphs.children[index], line);
        });
        while(paragraphs.children.length > lines.length) paragraphs.lastElementChild.remove();
        paragraphs.hidden = !lines.length;
        const choiceItems = entriesOf(view.choices), actionItems = entriesOf(view.actions);
        choiceList.render({actions:projected('choice',choiceItems,status,view.token),enabled:!pending});
        actionList.render({actions:projected('action',actionItems,status,view.token),enabled:!pending});
        choices.hidden = !choiceItems.length;
        actions.hidden = !actionItems.length;
        element.setAttribute('aria-busy', String(pending));

        if(ownedFocus) {
            if(element.hidden) {
                const tabId = element.closest('[role="tabpanel"]')?.getAttribute('aria-labelledby');
                const tab = tabId && document.getElementById(tabId);
                if(tab && !tab.disabled && !tab.hidden) tab.focus({preventScroll: true});
                else focused.blur();
            } else if(!element.contains(focused) || focused.disabled || focused.getAttribute?.('aria-disabled') === 'true') summary.focus({preventScroll: true});
            else if(document.activeElement !== focused) focused.focus({preventScroll: true});
        }
    }

    render();
    return {element, render};
}
