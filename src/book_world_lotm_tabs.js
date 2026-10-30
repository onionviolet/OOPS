// In-panel tabs for the Tingen workroom: groups the panel's blocks so each tab shows a few at a time.
// Presentation only. Visibility uses data-tab-off, never `hidden` (a seat filter owns `hidden` on these nodes).
import {node, createTabs} from './reference_kit.js';

export const WORKROOM_TABS = Object.freeze([
    {id: 'here', label: 'Here', blocks: ['actions', 'walks']},
    {id: 'path', label: 'Path', blocks: ['path']},
    {id: 'work', label: 'Work & merit', blocks: ['work', 'bench']},
    {id: 'notebook', label: 'Notebook', blocks: ['notebook']},
]);

const BADGES = {
    work: v => v.jobs?.length ? `${v.jobs.length} running` : '',
    path: v => v.path?.ready && !v.path?.capped ? 'ready' : '',
    notebook: v => v.records?.length ? String(v.records.length) : '',
};

export function workroomTabModel(v) {
    return {show: !!v?.enrolled, tabs: WORKROOM_TABS.map(({id, label}) => {
        const badge = v ? BADGES[id]?.(v) || '' : '';
        return {id, label, badge, text: badge ? `${label} · ${badge}` : label};
    })};
}

export function mountWorkroomTabs({panel, after, blocks, initial = 'here'}) {
    const wrapper = node('div', null, {class: 'workroom-tabs'}); wrapper.dataset.workroomTabs = '';
    const buttons = new Map(); let tabs;
    const empty = t => t.blocks.every(k => !blocks[k]?.children.length);
    function apply() {
        const on = tabs.active();
        for (const t of WORKROOM_TABS) for (const k of t.blocks) {
            const b = blocks[k]; if (!b) continue;
            if (t.id === on) delete b.dataset.tabOff; else b.dataset.tabOff = '';
        }
    }
    tabs = createTabs({label: 'Workroom sections', tabs: WORKROOM_TABS, initial, onSelect: apply});
    for (const b of tabs.bar.children) buttons.set(b.dataset.tab, b);
    const moved = node('p', 'Your path, clearance, merit and the brewing bench now sit under their own tabs. ', {class: 'workroom-moved'});
    moved.dataset.workroomMoved = '';
    const got = node('button', 'Got it', {type: 'button'});
    // Dismissal is remembered per browser so the hint does not return on every load.
    const MOVED_KEY = 'yairpg.workroomMovedSeen';
    got.onclick = () => { moved.remove(); try { localStorage.setItem(MOVED_KEY, '1'); } catch { /* storage may be unavailable */ } };
    got.setAttribute('aria-label', 'Got it: hide the note about the workroom tabs'); got.title = 'Hide the note about the workroom tabs';
    moved.append(got);
    let seen = false; try { seen = localStorage.getItem(MOVED_KEY) === '1'; } catch { /* storage may be unavailable */ }
    wrapper.append(tabs.bar); if (!seen) wrapper.append(moved);
    panel.insertBefore(wrapper, after.nextSibling);
    function update(v) {
        const model = workroomTabModel(v);
        wrapper.hidden = !model.show;
        if (!model.show) { for (const k of Object.keys(blocks)) delete blocks[k]?.dataset.tabOff; return; }
        for (const t of model.tabs) buttons.get(t.id).textContent = t.text;
        for (const t of WORKROOM_TABS) buttons.get(t.id).hidden = empty(t);
        // An empty active tab falls back to the first tab that has content.
        const cur = WORKROOM_TABS.find(t => t.id === tabs.active());
        if (cur && empty(cur)) { const first = WORKROOM_TABS.find(t => !empty(t)); if (first) tabs.select(first.id); }
        apply();
    }
    return {wrapper, update, select: id => tabs.select(id), active: () => tabs.active()};
}
