// List in the centre, the thing on the left (UI direction A, adopted by Weibao 2026-11-14; UIC152, UIC147, UIC170, UIC178).
// While a centre view that has a detail region is open, the left column becomes its inspector: the vitals stay as a thin
// strip at the top, the stat grid and the Condition box step aside for it, and the view's own detail node moves into the
// left box. The centre is then only the list. Leaving the view puts the node back where it came from.
//
// One authority (AR3): the inspector renders nothing of its own. It moves the view's detail node (like the game bar moves
// its controls), so the view keeps rendering it and its handlers, focus and selection survive.
// Which views take part: a detail node marked [data-inspector-detail], or one of the known detail regions below. A feature
// opts in by marking its detail node; no registration line is needed.
// Steady frame (UR144): the left column's box keeps its size; only what is inside it changes.
import {expandWorkspaceModule} from '../workspace_layout.js';

const KNOWN = ['.attribute-inspector-detail'];
const SELECTOR = ['[data-inspector-detail]', ...KNOWN].join(',');
const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };

// Open one item where the player inspects items (a crafting input's "Where to get it", a Next link). One authority: the
// inventory owns selection, so a held item is chosen through the inventory row's own click route, and Item details is
// opened as a centre view when a centre view hides it (the same route as a slot press, FBK3). An item not held has no row;
// Find opens with its name typed. Returns 'held', 'find' or null. A button can carry data-inspect-item="<item id>" (and
// data-inspect-name, or its text) instead of calling this.
export function inspectItem({id = '', name = ''} = {}) {
    const rows = [...document.querySelectorAll('#inventory_content_div > [data-character_item]')];
    const idOf = r => { try { return JSON.parse(r.dataset.character_item).id || ''; } catch { return ''; } };
    const words = String(name || '').trim().toLowerCase();
    const row = rows.find(r => id && idOf(r) === id) || rows.find(r => words && r.textContent.toLowerCase().includes(words));
    if (row) {
        row.click();
        requestAnimationFrame(() => { const d = document.querySelector('.workspace-module[data-module="shell-detail"]'); if (!d?.checkVisibility?.()) expandWorkspaceModule('shell-detail'); });
        return 'held';
    }
    if (words) { document.dispatchEvent(new CustomEvent('palette-find', {detail: {query: name.trim()}})); return 'find'; }
    return null;
}

export function mountInspector() {
    const root = () => document.getElementById('main_content');
    const box = el('section', 'shell-inspector'); box.id = 'shell_inspector'; box.setAttribute('aria-label', 'Selected');
    box.dataset.surfaceType = 'detail';
    let adopted = null, mark = null;
    const leftHome = () => root()?.querySelector('.workspace-module[data-module="vitals"]')?.parentElement || null;
    function release() {
        if (adopted && mark?.parentNode) mark.replaceWith(adopted); else adopted?.remove();
        adopted = null; mark = null; box.remove();
        if (root()) delete root().dataset.inspecting;
    }
    function tick() {
        const r = root(); if (!r) return;
        const centre = r.dataset.centerTask ? document.getElementById('center_mode_content') : null;
        // Still the same view: the placeholder sits in the open centre view, so keep the node where it is.
        // A view stacked over it (Crafting opened from Stats) hides the first view inside the same container, so the
        // placeholder's own parent has to be visible, not just the container.
        if (adopted && mark?.isConnected && centre?.contains(mark) && mark.parentElement?.checkVisibility()) {
            const home = leftHome(); if (home && box.parentElement !== home) home.append(box);
            return;
        }
        if (adopted) release();
        const detail = centre ? [...centre.querySelectorAll(SELECTOR)].find(n => n.checkVisibility()) : null, home = leftHome();
        if (!detail || !home) return;
        mark = document.createComment('inspector'); detail.before(mark);
        adopted = detail; box.replaceChildren(detail); home.append(box);
        r.dataset.inspecting = 'true';
    }
    const timer = setInterval(tick, 250);
    const onInspect = event => { const b = event.target.closest?.('[data-inspect-item]'); if (!b) return; event.preventDefault(); inspectItem({id: b.dataset.inspectItem, name: b.dataset.inspectName || b.textContent}); };
    document.addEventListener('click', onInspect);
    document.addEventListener('workspace-presentation-change', () => setTimeout(tick));
    tick();
    return {node: box, tick, destroy() { clearInterval(timer); document.removeEventListener('click', onInspect); release(); }};
}
