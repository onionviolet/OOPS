import {registerDomain} from './domain_registry.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node, visibleRenderer, plural} from './reference_kit.js';
import {expandWorkspaceModule} from './workspace_layout.js';
import {observerView} from './observer_view.js';
import {renderFigure, figureText} from './ui/figure.js';
import {knowledgeView, knowsLine} from './knowledge_view.js';

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
    const listButton = node('button', 'List', {type: 'button', class: 'journal_control_button active_selection_button', 'aria-pressed': 'true'});
    const boardButton = node('button', 'Board', {type: 'button', class: 'journal_control_button', 'aria-pressed': 'false'});
    views.append(listButton, boardButton);
    const status = node('p', '', {role: 'status', 'aria-live': 'polite', class: 'reference-empty'});
    const list = node('div', null, {class: 'knows-list'}), board = node('div', null, {class: 'knows-board'});
    board.hidden = true;
    const people = node('button', 'Open People', {type: 'button', title: 'What you know about each person is kept in the People panel'});
    people.onclick = () => expandWorkspaceModule('known-people');
    box.append(node('h3', 'What you know'), views, status, list, board, people);
    const notebook = document.getElementById('journal_show_notebook');
    bar.insertBefore(tab, notebook || null);
    content.append(box);

    let mode = 'list';
    const setMode = next => {
        mode = next; list.hidden = mode !== 'list'; board.hidden = mode !== 'board';
        for (const [button, id] of [[listButton, 'list'], [boardButton, 'board']]) { button.setAttribute('aria-pressed', String(mode === id)); button.classList.toggle('active_selection_button', mode === id); }
        render(true);
    };
    listButton.onclick = () => setMode('list'); boardButton.onclick = () => setMode('board');
    tab.onclick = () => { for (const child of content.children) child.style.display = 'none'; box.style.display = 'block'; render(true); };

    const render = visibleRenderer(box, () => {
        const state = readPort('expansion');
        if (!state) return {mode, rows: [], groups: [], board: null};
        return {mode, ...knowledgeView(observerView(state), {clock: state.clock})};
    }, view => {
        status.textContent = view.rows.length ? `${plural(view.rows.length, 'thing')} you hold. Open lines are questions you asked that have no answer yet.` : 'Nothing learned yet. Look around, ask, read or think, and it is kept here.';
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
            renderFigure(board, view.board, {idPrefix: 'knows-board', text: true});
            board.dataset.text = figureText(view.board);
        } else board.replaceChildren();
    });
    whenPortsReady(() => render(true));
    return {render, tab, box};
}

let home = null;
registerDomain({id: 'knowledge-home', deps: [], initialState: () => null, refresh: () => home?.render(false), panels: [() => { home = mountKnowsTab(); }]});
