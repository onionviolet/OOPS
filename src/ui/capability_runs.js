import {centerModes} from '../center_modes.js';
import {definePanel} from '../panel_kit.js';

const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
};
const button = label => Object.assign(element('button', label, 'action_button'), {type: 'button'});
const mode = 'capability-runs';

export function createCapabilityRunsPanel({runs, read, commit}) {
    const home = element('section');
    const launch = button('Open capability runs');
    launch.id = 'capability_runs_open';
    home.append(launch);
    definePanel({id: 'capability-runs', title: 'Capability runs', role: 'actions', node: home,
        home: document.getElementById('location_actions_div'), defaultDock: 'center', after: 'beginning',
        discovered: () => true, eligible: () => true});

    const root = element('section', '', 'center-mode-hidden');
    root.id = 'capability_runs_view';
    const heading = element('h2', 'Capability runs', 'expanded-panel-heading');
    heading.tabIndex = -1;
    const nav = element('nav', '', 'activable_buttons flex_wrap');
    nav.setAttribute('aria-label', 'Protagonists');
    const intro = element('p');
    const notice = element('p');
    notice.setAttribute('role', 'status');
    const body = element('div', '', 'action-legibility');
    root.append(heading, nav, intro, notice, body);
    const center = centerModes();
    center.registerView(mode, root, 'Capability runs');
    let selected = Object.keys(runs)[0];
    const tabs = new Map(Object.entries(runs).map(([id, run]) => {
        const control = button(run.title);
        control.dataset.capabilityRun = id;
        control.onclick = () => { selected = id; notice.textContent = ''; render(); };
        nav.append(control);
        return [id, control];
    }));
    launch.onclick = () => { render(); center.open(mode); };

    function render() {
        const view = read(selected);
        for (const [id, tab] of tabs) tab.setAttribute('aria-pressed', String(id === selected));
        intro.textContent = view.introduction;
        const focusedAction = document.activeElement?.dataset?.capabilityAction;
        body.replaceChildren();
        const actions = view.active ? view.actions : [{id: 'begin', label: 'Begin this run',
            detail: 'Start from the scene described above. Each run keeps its own progress in your save.'}];
        if (view.active) {
            const facts = element('dl', '', 'ui-panel-section');
            for (const [label, value] of view.facts) facts.append(element('dt', label), element('dd', String(value)));
            body.append(facts);
            if (view.result) body.append(element('p', view.result, 'action-legibility__notice'));
        }
        const controls = element('section', '', 'action-legibility__group');
        controls.setAttribute('aria-label', 'Available actions');
        for (const action of actions) {
            const row = element('div', '', 'action-legibility__card');
            const control = button(action.label);
            control.dataset.capabilityAction = action.id;
            const why = element('p', view.writable ? action.reason : 'Continue in the writable game tab.', 'action-legibility__status');
            why.id = `capability-reason-${controls.childElementCount}`;
            control.disabled = !view.writable || !!action.reason;
            if (control.disabled) control.setAttribute('aria-describedby', why.id);
            row.append(control, element('p', action.detail));
            if (control.disabled) row.append(why);
            control.onclick = () => {
                try { commit(selected, action.id); notice.textContent = `${action.label} · saved.`; }
                catch (error) { notice.textContent = error.message; }
                render();
            };
            controls.append(row);
        }
        body.append(controls);
        if (view.comparison) {
            const table = element('table', '', 'ui-panel-section');
            const caption = element('caption', view.comparison.title);
            const head = element('thead'), header = element('tr');
            for (const column of view.comparison.columns) {
                const cell = element('th', column);
                cell.scope = 'col';
                header.append(cell);
            }
            head.append(header);
            const rows = element('tbody');
            for (const values of view.comparison.rows) {
                const row = element('tr');
                for (const value of values) row.append(element('td', String(value)));
                rows.append(row);
            }
            table.append(caption, head, rows);
            body.append(table);
        }
        if (view.history?.length) {
            const history = element('section', '', 'ui-panel-section');
            const list = element('ol');
            for (const line of view.history) list.append(element('li', line));
            history.append(element('h3', 'What happened'), list);
            body.append(history);
        }
        if (focusedAction) {
            const available = [...controls.querySelectorAll('button')].filter(control => !control.disabled);
            (available.find(control => control.dataset.capabilityAction === focusedAction) ?? available[0] ?? tabs.get(selected))?.focus();
        }
    }
    return {render};
}
