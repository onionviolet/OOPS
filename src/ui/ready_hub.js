// Here, ready now (UI direction D, adopted by Weibao 2026-11-14; play surface PS57). The top of Here's action list lists
// what every feature says can be done now, across features: ready rows first (urgent ones on top), then near rows with
// the gap named, then a count of what is further off. Rows come from ready_rows.js; this view decides nothing.
//
// Steady frame (UR52, UR144): while the pointer or keyboard focus is in the block it does not reorder; it catches up once
// they leave. Default caps: five ready and three near rows shown, the rest one press away (dial: READY_SHOWN, NEAR_SHOWN).
// Pure view; nothing is saved.
import {collectReady, readyCounts} from '../ready_rows.js';
import {shownVerbs, unmarkedRows} from './verb_marks.js';
import {kitRow, registerKitFeature} from './kit.js';

const READY_SHOWN = 5, NEAR_SHOWN = 3;
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

// Pure: which rows show and the head line, for a sorted row list.
export function hubModel(rows, {expanded = false} = {}) {
    const counts = readyCounts(rows), ready = rows.filter(r => r.state === 'ready'), near = rows.filter(r => r.state === 'near');
    const shown = expanded ? [...ready, ...near] : [...ready.slice(0, READY_SHOWN), ...near.slice(0, NEAR_SHOWN)];
    const hidden = ready.length + near.length - shown.length;
    // Further-off rows are counted in `counts` but not named in the head: a long list of far recipes is not news (D).
    const head = ['Ready now', counts.ready ? `${counts.ready} ready` : 'nothing ready', counts.near ? `${counts.near} close` : ''].filter(Boolean).join(' · ');
    return {shown, hidden, counts, head, empty: !ready.length && !near.length};
}

// Where the panel goes (PS97, stacked panels picked 2026-11-15): first in the centre column, above This place (the Around
// you region of the parity shell). Without that region (another presentation), just above Here's action list.
const defaultSpot = () => {
    const region = document.querySelector('#main_content.workspace-active[data-parity="r3"] .workspace-board > [data-region="focus"]');
    if (region) return {parent: region, before: region.firstElementChild};
    const list = document.getElementById('location_actions_div');
    return list ? {parent: list.parentElement, before: list} : null;
};

export function mountReadyHub({spot = defaultSpot} = {}) {
    const root = el('section', 'ready-hub'); root.id = 'ready_hub'; root.dataset.readyHub = ''; root.setAttribute('aria-label', 'Ready now');
    const head = el('p', 'ready-hub__head'), list = el('ul', 'ready-hub__rows'), more = el('button', 'ready-hub__more'), note = el('p', 'ready-hub__note');
    more.type = 'button'; note.setAttribute('role', 'status'); note.hidden = true;
    root.append(head, list, more, note);
    // PS99: in the stacked centre column the panel shows every row and scrolls inside its own bounds, and the frame gives it
    // the height (src/shell_composition.js centreRow), so spare height goes to rows, not to an empty frame below. Elsewhere
    // the default caps hold (READY_SHOWN, NEAR_SHOWN). Either way the player can fold or unfold it.
    let expanded = null, signature = '', shownBefore = false, rowsBefore = -1;
    const isExpanded = () => expanded ?? !!root.parentElement?.matches?.('[data-region="focus"]');
    more.onclick = () => { expanded = !isExpanded(); signature = ''; render(true); changedShape(); };
    const held = () => root.matches(':hover') || root.contains(document.activeElement);
    // Folding or unfolding is the player's own act on the panel: the frame refits to it.
    const changedShape = () => document.dispatchEvent(new CustomEvent('shell-content-change', {detail: {part: 'ready-now'}}));
    // PS243: the hub declares its row and the kit draws it; the hub's own class names stay for its styles.
    function rowNode(r) {
        const does = r.state === 'ready' && r.act ? 'act' : r.open ? 'open' : null;
        const run = () => { try { if (does === 'act') r.act(); else r.open?.(); } catch (e) { note.hidden = false; note.textContent = e?.message || 'That did not work.'; } signature = ''; setTimeout(() => render(true), 0); };
        return kitRow({tag: 'li', state: r.state, label: r.label, className: `ready-hub__row ready-hub__row--${r.state}`, labelClass: 'ready-hub__go',
            action: {run, disabled: !does, title: does === 'act' ? `${r.label}. Does it now.` : does === 'open' ? `${r.label}. Opens where it is done.` : `${r.label}. ${r.gap || 'Not ready yet.'}`},
            fact: r.state === 'near' ? r.gap || '' : r.detail || '', factClass: r.state === 'near' ? 'ready-hub__gap' : 'ready-hub__detail',
            from: r.sourceLabel || '', fromClass: 'ready-hub__from', data: {readyKey: r.key, urgent: r.urgent ? 'true' : null}});
    }
    function render(force = false) {
        const place = spot();
        if (!place?.parent) return;
        if (!force && held()) return;
        // PS120: a source whose verb is in the action list shows as that verb's mark, not as rows here.
        const rows = unmarkedRows(collectReady(), shownVerbs()), model = hubModel(rows, {expanded: isExpanded()});
        // The panel arriving or leaving changes the centre column's first region, a stable moment for the frame (the split).
        const changed = () => document.dispatchEvent(new CustomEvent('shell-content-change', {detail: {part: 'ready-now'}}));
        if (model.empty) { if (root.isConnected) { root.remove(); changed(); } signature = ''; return; } // further-off rows alone are not worth a block
        const arriving = !root.isConnected;
        // Its own node, never inside the native list: that list rebuilds its children, and a block inside it was taken out and
        // put back on every rebuild, so a pointer could never settle on a row (UR52).
        // Placed once; the region's own layout may re-append its modules, and the stylesheet keeps this panel first there.
        if (root.parentElement !== place.parent) place.parent.insertBefore(root, place.before);
        // Showing again (a centre view closed, a fight ended) is the same moment for the frame as arriving.
        const visible = root.checkVisibility?.() ?? true;
        if (arriving || visible !== shownBefore) { shownBefore = visible; changed(); }
        // So is the panel growing or shrinking by rows (a life's day loading its acts); a changed label alone is not.
        if (model.shown.length + (model.hidden ? 1 : 0) !== rowsBefore) { const first = rowsBefore < 0; rowsBefore = model.shown.length + (model.hidden ? 1 : 0); if (!first) changed(); }
        const sig = JSON.stringify([model.head, model.shown.map(r => [r.key, r.label, r.state, r.gap, r.detail, r.urgent]), model.hidden, isExpanded()]);
        if (sig === signature) return;
        signature = sig;
        head.textContent = model.head;
        list.replaceChildren(...model.shown.map(rowNode));
        more.hidden = !(model.hidden > 0 || (isExpanded() && model.shown.length > 5));
        more.textContent = isExpanded() ? 'Show fewer' : `Show ${model.hidden} more`;
    }
    const timer = setInterval(() => render(), 1000);
    root.addEventListener('pointerleave', () => render());
    root.addEventListener('focusout', () => setTimeout(() => render(), 0));
    render();
    return {node: root, render, destroy() { clearInterval(timer); root.remove(); }};
}

// PS246: Ready now's row on the kit page, in each state it can show.
registerKitFeature({id: 'ready-now', label: 'Ready now', samples: {
    empty: {form: 'row', label: 'Nothing ready now', fact: 'Rows appear as things come within reach.'},
    near: {form: 'row', state: 'near', label: 'Make Sinew string', action: {disabled: true}, fact: 'needs 2 sinew; you have 0', from: 'Crafting'},
    ready: {form: 'row', state: 'ready', label: 'Feed the Moonglow Gu', action: {}, fact: 'missed a meal', from: 'Your Gu'},
    running: {form: 'row', state: 'ready', label: 'Brewing', fact: 'about 1 day left', from: 'Mixing'},
    unknown: {form: 'row', label: 'Something stirs', fact: '?', from: 'Your day'},
    crowded: [{form: 'row', state: 'ready', label: 'Buy a bag of Moon Orchid petals · 10 for 1 stone', action: {}, fact: '20 min · uses 1 × Primeval stone', from: 'Your day'}, {form: 'chip', label: 'Show more', count: 12}],
}});
