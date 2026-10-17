import {createControlBox} from './ui/control_box.js';

// R21 one bar (MB2). In the parity shell the top navigation row and the bottom bar become one bar
// at the top: panel navigation on the left; save state, Save, Export and Import on the right; the
// rarely used items (settings, version, help, Authoring, Layout, density, attribution links and the
// hit counter) in a Menu (UR50). The existing nodes move in with placeholders and move back outside
// the parity shell (GU5), so every handler and guard stays the native one (UR55).
// Save state mirrors the current-work panel's ownership line: one authority (AR3).

const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const RIGHT = ['save_button', 'save_to_file_button', 'load_from_file_button', 'saved_file_input'];
const MENU = ['options_button', 'changelog_button', 'help_button', 'hits_counter', 'repo_link', 'ko_fi_link'];

// Which route buttons fold into the overflow list: the last ones that do not fit. `widths` are the
// visible route buttons' widths in order, `room` the space they may use.
export function overflowFrom(widths, room) {
    let used = 0;
    for (let i = 0; i < widths.length; i++) { used += widths[i]; if (used > room) return i; }
    return widths.length;
}

export function mountGameBar({nav}) {
    const root = () => document.getElementById('main_content');
    const bar = make('header', 'game-bar'); bar.id = 'game_bar'; bar.setAttribute('aria-label', 'Game bar');
    const left = make('div', 'game-bar-left'), right = make('div', 'game-bar-right');
    const state = make('span', 'game-bar-save-state'); state.setAttribute('role', 'status'); state.setAttribute('aria-live', 'polite');
    const more = createControlBox({id: 'game-bar-more', title: 'More panels', placement: 'below'});
    more.node.classList.add('game-bar-overflow'); more.setLabel('More', 'More panels');
    const menu = createControlBox({id: 'game-bar-menu', title: 'Menu', placement: 'below', panelHome: root});
    menu.node.classList.add('game-bar-menu'); menu.setLabel('Menu', 'Settings, help, layout and links');
    const menuLinks = make('div', 'game-bar-menu-links');
    // A command in the Menu (Authoring, Edit layout, density) closes it once it runs; disclosures,
    // selects and fields inside it keep it open.
    menu.body.addEventListener('click', event => { const hit = event.target.closest('button,a'); if (hit && !hit.closest('summary') && !event.target.closest('select,input,textarea')) setTimeout(() => menu.close({restore: false})); });
    left.append(more.node); right.append(state, menu.node); bar.append(left, right);
    const homes = new Map();
    const move = (node, host) => { if (!node || node.parentNode === host) return; if (!homes.has(node)) { const mark = document.createComment(`game-bar:${node.id || node.className}`); node.before(mark); homes.set(node, mark); } host.append(node); };
    const restoreAll = () => { for (const [node, mark] of homes) if (mark.parentNode && node.previousSibling !== mark) mark.after(node); };
    let active = null, lastWidth = 0, signature = '';
    const parity = () => root()?.dataset.parity === 'r3' && document.documentElement.dataset.startScreen !== 'open';
    // Fold the navigation at stable moments only: bar width, text size, a route appearing (UR52).
    function fold() {
        const buttons = [...nav.querySelectorAll(':scope > button[data-panel-path]')];
        for (const b of buttons) delete b.dataset.barOverflow;
        const shown = buttons.filter(b => !b.hidden && getComputedStyle(b).display !== 'none');
        const fixed = [...nav.children].filter(n => !shown.includes(n) && n.tagName !== 'DIALOG' && getComputedStyle(n).display !== 'none').reduce((w, n) => w + n.getBoundingClientRect().width, 0);
        const room = left.clientWidth - fixed - more.node.getBoundingClientRect().width - 8;
        const from = overflowFrom(shown.map(b => b.getBoundingClientRect().width), room);
        const folded = shown.slice(from);
        for (const b of folded) b.dataset.barOverflow = 'true';
        more.node.hidden = !folded.length;
        more.body.replaceChildren(...folded.map(b => { const p = make('button', 'game-bar-overflow-item', b.textContent); p.type = 'button'; p.dataset.overflowPath = b.dataset.panelPath; if (b.dataset.panelTab) p.dataset.overflowTab = b.dataset.panelTab; p.title = b.title; p.disabled = b.disabled; p.addEventListener('click', () => { more.close({restore: false}); b.click(); }); return p; }));
        more.setLabel(`More ${folded.length}`, `${folded.length} more panels: ${folded.map(b => b.textContent).join(', ')}`);
    }
    const syncState = () => {
        const line = document.querySelector('#workspace_current_work > p:nth-of-type(2)');
        const text = line?.textContent.trim() || 'Save state unknown';
        if (state.textContent !== text) state.textContent = text;
        const warn = !line || line.classList.contains('workspace-warning');
        if (state.dataset.warning !== String(warn)) state.dataset.warning = String(warn);
    };
    function apply() {
        const on = parity();
        if (on !== active) {
            active = on;
            if (on) {
                document.body.prepend(bar); left.prepend(nav);
                for (const id of RIGHT) move(document.getElementById(id), right);
                right.append(state, menu.node);
                state.after(...RIGHT.map(id => document.getElementById(id)).filter(Boolean));
                const toolbar = root()?.querySelector(':scope > .workspace-toolbar');
                menu.attach();
                if (toolbar) move(toolbar, menu.body);
                if (menuLinks.parentNode !== menu.body) menu.body.append(menuLinks);
                for (const id of MENU) move(document.getElementById(id), menuLinks);
                document.documentElement.dataset.oneBar = 'true';
                lastWidth = 0;
            } else {
                menu.close({restore: false}); more.close({restore: false});
                restoreAll(); bar.remove(); delete document.documentElement.dataset.oneBar;
                for (const b of nav.querySelectorAll('[data-bar-overflow]')) delete b.dataset.barOverflow;
                // The native navigation keeps its own fixed top row outside the shell.
                document.getElementById('main_content')?.before(nav);
            }
        }
        if (!on) return;
        const hits = document.getElementById('hits_counter'); if (hits && hits.parentNode !== menuLinks) move(hits, menuLinks);
        syncState();
        const width = Math.round(bar.clientWidth), font = getComputedStyle(nav).fontSize;
        const visible = [...nav.querySelectorAll(':scope > button[data-panel-path]')].filter(b => !b.hidden).map(b => b.dataset.panelPath + b.dataset.panelTab).join();
        const next = `${width}:${font}:${visible}`;
        if (next !== signature) { signature = next; fold(); }
        document.documentElement.style.setProperty('--game-bar-height', `${Math.ceil(bar.getBoundingClientRect().height)}px`);
        document.documentElement.style.setProperty('--workspace-nav-height', `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    }
    const observer = new ResizeObserver(() => { signature = ''; apply(); }); observer.observe(bar);
    // A route appearing or leaving (discovery, a fight) refolds at once, not on the next pass.
    const routes = new MutationObserver(() => { if (active) apply(); }); routes.observe(nav, {attributes: true, attributeFilter: ['hidden'], subtree: true, childList: true});
    document.addEventListener('workspace-presentation-change', () => setTimeout(apply));
    const timer = setInterval(apply, 500); apply();
    return {apply, bar, destroy() { clearInterval(timer); observer.disconnect(); routes.disconnect(); active = true; restoreAll(); bar.remove(); menu.destroy(); more.destroy(); }};
}
