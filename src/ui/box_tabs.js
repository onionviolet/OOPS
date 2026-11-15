// Box tabs (round 14 slice 4, PS122; Weibao liked the YAIR columns mock 2026-11-15). A world's power joins the Skills box as
// a tab beside YAIR's Skills, Stances and Magic (Gu, Spells, Beyonder), and a page can join the Journal box beside Quests
// and Data the same way. The tab uses YAIR's own tab row: one page shows and the rest hide (index.html changeTab), and
// the row's click handler marks the chosen tab. The owner keeps its node and its content (AR3); this module only puts
// the node in the box and shows the tab while `when()` holds.
export const BOX_TAB_HOMES = Object.freeze({
    skills: Object.freeze({module: 'skills', bar: 'skill_and_stance_control_div', pages: 'skills_and_stances_content_div', className: 'skill_stance_control_button'}),
    journal: Object.freeze({module: 'records', bar: 'journal_control_div', pages: 'journal_content_div', className: 'journal_control_button'}),
});

const tabs = new Map();
/** Pure: the tabs of one box that show now, in registration order. */
export const shownTabs = (box, list = [...tabs.values()]) => list.filter(t => t.box === box && (() => { try { return t.when(); } catch { return false; } })());

function show(tab) {
    const pages = tab.node.parentElement; if (!pages) return;
    for (const page of pages.children) page.style.display = 'none';
    tab.node.style.display = 'block';
}

/** Add a tab to a box: {box: 'skills'|'journal', id, label, node, when?}. Returns a release function. */
export function registerBoxTab({box, id, label, node, when = () => true}) {
    const home = BOX_TAB_HOMES[box];
    if (!home || !id || !label || !node) throw Error('A box tab needs a known box, an id, a label and a node.');
    const tab = {box, id, label, node, when, button: null};
    tabs.set(`${box}:${id}`, tab);
    sync();
    return () => { tabs.delete(`${box}:${id}`); const open = tab.node.style.display !== 'none'; tab.button?.remove(); tab.node.remove(); if (open) document.getElementById(home.bar)?.querySelector('button:not([hidden])')?.click(); };
}

// Place each tab's button and page, and hide a tab whose `when` stopped holding (its page falls back to the box's first).
export function sync() {
    if (typeof document === 'undefined') return;
    for (const tab of tabs.values()) {
        const home = BOX_TAB_HOMES[tab.box], bar = document.getElementById(home.bar), pages = document.getElementById(home.pages);
        if (!bar || !pages) continue;
        if (!tab.button) {
            const b = document.createElement('button'); b.type = 'button'; b.className = `ui-native-control ${home.className}`; b.textContent = tab.label;
            b.dataset.boxTab = tab.id; b.addEventListener('click', () => show(tab)); tab.button = b;
        }
        if (tab.button.parentElement !== bar) bar.append(tab.button);
        if (tab.node.parentElement !== pages) { tab.node.style.display = 'none'; tab.node.dataset.boxTabPage = tab.id; pages.append(tab.node); }
        const on = shownTabs(tab.box, [tab]).length > 0;
        tab.button.hidden = !on;
        if (!on && tab.node.style.display !== 'none') { tab.node.style.display = 'none'; bar.querySelector('button:not([hidden])')?.click(); }
    }
}

// A box with a tab showing counts as found, so a page a life opens (Klein's pay ledger) is reachable before the box's own
// first find (feature-ui, 2026-11-15). Keyed by the workspace module the box lives in.
export function moduleHasShownTab(moduleId) {
    const box = Object.entries(BOX_TAB_HOMES).find(([, h]) => h.module === moduleId)?.[0];
    return !!box && shownTabs(box).length > 0;
}

let timer = 0;
export function mountBoxTabs() { if (!timer && typeof setInterval === 'function') timer = setInterval(sync, 1000); sync(); return {sync, destroy() { clearInterval(timer); timer = 0; }}; }
