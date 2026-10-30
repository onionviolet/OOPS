import {registerDomain} from './domain_registry.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node, visibleRenderer} from './reference_kit.js';
import {expandWorkspaceModule} from './workspace_layout.js';
import {observerView} from './observer_view.js';
import {figureText} from './ui/figure.js';
import {mountFormSwitch} from './ui/figure_forms.js';
const boardForms = new Map(); // form chosen per board, kept across redraws (bk-forms)
import {knowledgeView, knowsLine, caseLine} from './knowledge_view.js';
import {whoKnowsFor, whoKnowsLine, askRows} from './who_knows_view.js';
import {relationshipWebPeople} from './relationship_web_view.js';
import {registerChangeCounter} from './change_badges.js';

// LTU4: the Journal's Knows tab. It sits beside Quests and Anthology in the existing Journal tab
// bar, so the native tab switcher and active-button styling apply unchanged. The list is the text
// form and the default view; the board (RPX12) draws the same rows and carries the same text.
// Everything comes from knowledge_view.js through the seat observer; nothing here is saved.
// People keep their own panel (UR74): this tab links there instead of copying it.

function mountKnowsTab() {
    const bar = document.getElementById('journal_control_div'), content = document.getElementById('journal_content_div');
    if (!bar || !content || document.getElementById('journal_show_knows')) return null;
    const tab = node('button', 'Knows', {id: 'journal_show_knows', type: 'button', class: 'journal_control_button', title: 'What you know, how you came to know it, and what is still open'});
    const box = node('section', null, {id: 'knows_box_div', class: 'knows-box', 'aria-label': 'What you know'});
    box.style.display = 'none';
    const views = node('div', null, {role: 'group', 'aria-label': 'Knows view', class: 'flex_wrap'});
    const casesButton = node('button', 'Cases', {type: 'button', class: 'journal_control_button active_selection_button', 'aria-pressed': 'true'});
    const listButton = node('button', 'List', {type: 'button', class: 'journal_control_button', 'aria-pressed': 'false'});
    const boardButton = node('button', 'Board', {type: 'button', class: 'journal_control_button', 'aria-pressed': 'false'});
    views.append(casesButton, listButton, boardButton);
    const status = node('p', '', {role: 'status', 'aria-live': 'polite', class: 'reference-empty'});
    const canAsk = node('section', null, {class: 'knows-ask', 'aria-label': 'Who you can ask'}), who = node('section', null, {class: 'knows-who', 'aria-label': 'Who else knows'}), cases = node('div', null, {class: 'knows-cases'}), list = node('div', null, {class: 'knows-list'}), board = node('div', null, {class: 'knows-board'});
    list.hidden = true; board.hidden = true;
    const people = node('button', 'Open People', {type: 'button', title: 'What you know about each person is kept in the People panel'});
    people.onclick = () => expandWorkspaceModule('known-people');
    box.append(node('h3', 'What you know'), node('p', 'What you know, how you came to know it, and what is still open.'), views, status, cases, canAsk, who, list, board, people);
    const notebook = document.getElementById('journal_show_notebook');
    bar.insertBefore(tab, notebook || null);
    content.append(box);

    let mode = 'cases';
    const setMode = next => {
        mode = next; cases.hidden = mode !== 'cases'; list.hidden = mode !== 'list'; board.hidden = mode !== 'board';
        for (const [button, id] of [[casesButton, 'cases'], [listButton, 'list'], [boardButton, 'board']]) { button.setAttribute('aria-pressed', String(mode === id)); button.classList.toggle('active_selection_button', mode === id); }
        render(true);
    };
    casesButton.onclick = () => setMode('cases'); listButton.onclick = () => setMode('list'); boardButton.onclick = () => setMode('board');
    tab.onclick = () => { for (const child of content.children) child.style.display = 'none'; box.style.display = 'block'; render(true); };

    const render = visibleRenderer(box, () => {
        const state = readPort('expansion');
        if (!state) return {mode, rows: [], groups: [], cases: [], glance: '', board: null};
        const observer = observerView(state), base = knowledgeView(observer, {clock: state.clock});
        let whoRows = [], askList = [];
        try { whoRows = whoKnowsFor(observer, state, base.rows, relationshipWebPeople(state, observer.facts())); askList = askRows(observer, state, relationshipWebPeople(state, observer.facts())); } catch { whoRows = []; askList = []; }
        return {mode, ...base, whoRows, askList};
    }, view => {
        status.textContent = view.rows.length ? `${view.glance}. Open lines are questions you asked that have no answer yet.` : 'Nothing learned yet. Look around, ask, read or think, and it is kept here.';
        canAsk.replaceChildren(); canAsk.hidden = !view.askList?.length;
        if (view.askList?.length) {
            const ul = node('ul');
            for (const a of view.askList) {
                const li = node('li', `${a.name}: ${a.topic} `), ask = node('button', 'Ask', {type: 'button', title: a.reason, 'data-ask': a.personId});
                ask.disabled = !a.canAsk; ask.onclick = () => globalThis.start_dialogue?.(a.personId);
                li.append(ask); ul.append(li);
            }
            canAsk.append(node('h4', 'Who you can ask'), ul);
        }
        who.replaceChildren(); who.hidden = !view.whoRows?.length;
        for (const entry of view.whoRows || []) {
            const section = node('div', null, {class: 'knows-who-row', 'data-who-key': entry.key}), ul = node('ul');
            for (const w of entry.who) {
                const li = node('li', whoKnowsLine(entry, w) + ' '), ask = node('button', 'Ask', {type: 'button', title: w.askReason, 'data-ask': w.id});
                ask.disabled = !w.canAsk; ask.onclick = () => globalThis.start_dialogue?.(w.id);
                li.append(ask); ul.append(li);
            }
            section.append(node('h4', `Who else knows: ${entry.text}`), ul); who.append(section);
        }
        cases.replaceChildren();
        for (const c of view.cases) {
            const section = node('section', null, {class: 'knows-case', 'data-case': c.id});
            section.style.marginBlock = 'var(--ui-space-2)';
            const ul = node('ul');
            for (const row of c.rows) {
                const li = node('li', caseLine(row));
                li.dataset.certainty = row.certainty;
                ul.append(li);
            }
            const h = node('h4', `${c.label} · `);
            h.append(node('span', c.status, {class: 'knows-case-status'}));
            section.append(h, ul);
            cases.append(section);
        }
        list.replaceChildren();
        for (const group of view.groups) {
            if (!group.rows.length) continue;
            const section = node('section', null, {'data-certainty': group.id});
            const ul = node('ul');
            for (const row of group.rows) {
                const li = node('li', knowsLine(row));
                li.dataset.certainty = row.certainty;
                ul.append(li);
            }
            section.append(node('h4', `${group.label} (${group.rows.length})`), ul);
            list.append(section);
        }
        if (view.mode === 'board' && view.board) {
            mountFormSwitch(board, view.board, {idPrefix: 'knows-board', text: true, memory: boardForms, forms: ['web', 'table', 'sentences']});
            board.dataset.text = figureText(view.board);
        } else board.replaceChildren();
    });
    whenPortsReady(() => render(true));
    return {render, tab, box};
}

let home = null;
registerDomain({id: 'knowledge-home', deps: [], initialState: () => null, refresh: () => home?.render(false), panels: [() => { home = mountKnowsTab(); }]});

// GU8: a count on the Knows route of lines learned since the tab was last on screen.
registerChangeCounter('records:knows', {read: () => { const state = readPort('expansion'); return state ? Object.keys(observerView(state).knowledge()) : null; },
    showing: () => !!home?.box.checkVisibility?.()});
