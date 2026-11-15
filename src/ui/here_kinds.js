// Here's panels by kind (play surface PS107, PS108, PS110; Weibao 2026-11-15 asked whether the folded rows under Actions
// belong there). A crossing, a setting, gear care, a project ledger, two activity groups and a home feature shared one pile.
// Each now goes to the home of its kind:
//   act      a thing to do here. A plain action row stays in Actions; an activity group (Local life, Village practice)
//            becomes a chip at the top of Actions that opens that group, one at a time, like Crafting's skill row.
//   place    a way somewhere else. It joins This place's Ways out in Around you (the crossing to another world).
//   setting  a switch on how the life runs (Optional pacing, combat options). It goes to Options.
//   feature  something with its own screen (Equipment condition, Furniture and home). It gets its own Here tab.
//   project  a long piece of work with a ledger (Iona's workshop ledger, PS111). It gets the Workshop tab.
// The frame places them; owners keep their nodes. Every owner re-appends its panel to #location_actions_div on render, so
// nothing is moved: the frame tags each child in place (data-here-kind, data-here-tab) and CSS shows the child in its tab
// only. An owner that can adopt `placeHerePanel(panel, kind, home)` declares its own kind; the map below speaks for the
// ones that have not yet (main.js's panels cannot change, AR1). An untagged child counts as act, so nothing vanishes
// before its owner opts in. New modules do not append under Here directly; tests/ui_contract.test.js keeps the list.
// Per world (PS110): a kind may depend on the panel's own state (gear condition is a setting while durability is off and
// gear care once it is on), and a panel its owner hides in a world stays hidden; its tab and chip hide with it.
import {registerWayOut} from '../nearby_context_view.js';

export const HERE_KINDS = Object.freeze(['act', 'place', 'setting', 'feature', 'project']);
// The tabs a feature or project can open on. Order is the tab order after Actions.
export const HERE_HOMES = Object.freeze([['equipment', 'Equipment'], ['home', 'Home'], ['workshop', 'Workshop']]);
const HOME_IDS = new Set(HERE_HOMES.map(([id]) => id));

// Panels whose owners have not declared a kind. Selector, then the kind and home (or a reader of the node's own state).
const durabilityOn = () => !!document.querySelector('[data-durability-option]')?.checked;
export const HERE_KIND_MAP = Object.freeze([
    ['#pacing_status_panel', {kind: 'setting'}],
    ['#p23_combat_options_panel', {kind: 'setting'}],
    ['#durability_panel', () => durabilityOn() ? {kind: 'feature', home: 'equipment'} : {kind: 'setting'}],
    ['#p23_living_gear_panel', {kind: 'feature', home: 'equipment'}],
    ['#furniture_panel', {kind: 'feature', home: 'home'}],
    ['#p23_household_panel', {kind: 'feature', home: 'home'}],
    ['#systems_workshop_panel', {kind: 'project', home: 'workshop'}],
    // The Tingen door is a place while it leads away and a plain act once the life lives there ("Nearby: ...").
    ['[data-lotm-door]', node => node.dataset.lotmLocalEntry === 'true' ? {kind: 'act'} : {kind: 'place'}],
]);

// Pure: which tab a kind shows in. A place shows in no tab of the action list; Around you lists it.
export function hereTab(kind, home = '') {
    if (kind === 'setting') return 'options';
    if (kind === 'feature' || kind === 'project') return HOME_IDS.has(home) ? home : (kind === 'project' ? 'workshop' : 'equipment');
    if (kind === 'place') return 'none';
    return 'actions';
}

// Owners: declare a panel's kind and let the frame place it. Returns the host it was placed in.
export function placeHerePanel(panel, kind, home = '') {
    const host = document.getElementById('location_actions_div');
    if (!panel || !host) return host || null;
    if (!HERE_KINDS.includes(kind)) throw Error(`Unknown Here kind "${kind}". Use one of ${HERE_KINDS.join(', ')}.`);
    panel.dataset.hereOwnKind = kind; if (home) panel.dataset.hereOwnHome = home; else delete panel.dataset.hereOwnHome;
    tag(panel, {kind, home});
    if (panel.parentElement !== host) host.append(panel);
    return host;
}

const set = (node, key, value) => { if (node.dataset[key] !== value) node.dataset[key] = value; };
function tag(node, {kind, home = ''}) { set(node, 'hereKind', kind); set(node, 'hereTab', hereTab(kind, home)); }
function declared(node) {
    if (node.dataset.hereOwnKind) return {kind: node.dataset.hereOwnKind, home: node.dataset.hereOwnHome || ''};
    for (const [selector, entry] of HERE_KIND_MAP) if (node.matches(selector)) return typeof entry === 'function' ? entry(node) : entry;
    return {kind: 'act'};
}
// What the owner itself hides (its own hidden flag or class), not what a tab hides.
export const ownerHidden = node => node.hidden || node.style.display === 'none' || node.classList.contains('none_display');

// Tag every child of Here's action list and report which tabs have something to show.
export function classifyHere(list = document.getElementById('location_actions_div')) {
    const tabs = {actions: 0, options: 0, ...Object.fromEntries(HERE_HOMES.map(([id]) => [id, 0]))};
    if (!list) return {tabs, groups: [], places: []};
    const groups = [], places = [];
    for (const child of list.children) {
        const {kind, home} = declared(child); tag(child, {kind, home});
        if (ownerHidden(child) || !(child.textContent || '').trim()) continue;
        const tab = child.dataset.hereTab;
        if (tab in tabs) tabs[tab]++;
        if (kind === 'act' && child.tagName === 'DETAILS') groups.push(child);
        if (kind === 'place') places.push(child);
    }
    return {tabs, groups, places};
}

// PS109: what a group's own line asks. "3 of 6 ready" asks something; everything ready or nothing ready does not.
export function groupStatus(details) {
    const summary = details.querySelector(':scope > summary');
    const own = summary ? [...summary.childNodes].filter(n => !(n.dataset && 'groupStatus' in n.dataset)).map(n => n.textContent).join('').trim() : '';
    const status = summary?.querySelector('[data-group-status]');
    return {title: own || details.id, status: status && !status.hidden ? status.textContent.trim() : '', idle: details.dataset.groupIdle === 'true'};
}

// The chip row at the top of Actions: one chip per activity group; a chip opens its group under the row.
export function mountHereChips() {
    const nav = document.createElement('nav'); nav.id = 'here_chips'; nav.className = 'here-chips'; nav.setAttribute('aria-label', 'Things to do here, by kind');
    const chips = new Map();
    function open(details, chip) {
        const was = details.dataset.hereChipOpen === 'true';
        for (const d of chips.keys()) { if (d.dataset.hereChipOpen) { delete d.dataset.hereChipOpen; d.open = false; } }
        if (!was) { details.dataset.hereChipOpen = 'true'; details.open = true; requestAnimationFrame(() => nav.scrollIntoView?.({block: 'nearest'})); }
        render(); chip.focus();
        document.dispatchEvent(new CustomEvent('shell-content-change', {detail: {part: 'here-chips'}}));
    }
    function render(groups = classifyHere().groups) {
        const list = document.getElementById('location_actions_div'); if (!list) return;
        if (nav.parentElement !== list.parentElement || nav.nextElementSibling !== list) list.before(nav);
        for (const [d, chip] of chips) if (!groups.includes(d)) { chip.remove(); chips.delete(d); }
        for (const [i, d] of groups.entries()) {
            let chip = chips.get(d);
            if (!chip) { chip = document.createElement('button'); chip.type = 'button'; chip.className = 'here-chip'; chip.onclick = () => open(d, chip); chips.set(d, chip);
                // Closing the group from its own heading also lowers its chip.
                d.addEventListener('toggle', () => { if (!d.open && d.dataset.hereChipOpen) { delete d.dataset.hereChipOpen; render(); } }); }
            if (nav.children[i] !== chip) nav.insertBefore(chip, nav.children[i] || null);
            const {title, status, idle} = groupStatus(d), words = status ? `${title} · ${status}` : title;
            if (chip.textContent !== words) chip.textContent = words;
            set(chip, 'idle', String(idle)); chip.setAttribute('aria-pressed', String(d.dataset.hereChipOpen === 'true'));
            const say = idle ? `${title}: nothing to do here yet. Opens the group to see what it needs.` : `${title}. Opens the group here.`;
            if (chip.title !== say) chip.title = say;
        }
        nav.hidden = !groups.length;
    }
    return {node: nav, render};
}

// The crossing joins Ways out (PS107). Around you reads the owner's door; pressing the way out presses that door (AR3).
let wayOutReleased = null;
export function mountHereWayOuts() {
    wayOutReleased?.();
    wayOutReleased = registerWayOut({id: 'here-places', rows: () => {
        const list = document.getElementById('location_actions_div'); if (!list) return [];
        return [...list.children].filter(c => declared(c).kind === 'place' && !ownerHidden(c) && (c.textContent || '').trim()).map((c, i) => {
            // The words, without the icon font's ligature name.
            const words = [...c.childNodes].filter(n => !n.classList?.contains('material-icons')).map(n => n.textContent).join('').trim();
            const to = words.replace(/^Cross to another world:\s*/i, '').trim();
            return {id: `place:${c.id || (c.dataset.lotmDoor !== undefined ? 'lotm-door' : String(i))}`, name: to || words, role: /another world/i.test(words) ? 'Another world · a new life there' : '',
                act: words, run: () => c.click()};
        });
    }});
    return wayOutReleased;
}
