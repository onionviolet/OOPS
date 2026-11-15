// Here, ready now (UI direction D, adopted by Weibao 2026-11-14; play surface PS57). The top of Here's action list lists
// what every feature says can be done now, across features: ready rows first (urgent ones on top), then near rows with
// the gap named, then a count of what is further off. Rows come from ready_rows.js; this view decides nothing.
//
// Steady frame (UR52, UR144): while the pointer or keyboard focus is in the block it does not reorder; it catches up once
// they leave. Default caps: five ready and three near rows shown, the rest one press away (dial: READY_SHOWN, NEAR_SHOWN).
// Pure view; nothing is saved.
import {collectReady, readyCounts} from '../ready_rows.js';

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

export function mountReadyHub({host = () => document.getElementById('location_actions_div')} = {}) {
    const root = el('section', 'ready-hub'); root.id = 'ready_hub'; root.dataset.readyHub = ''; root.setAttribute('aria-label', 'Ready now');
    const head = el('p', 'ready-hub__head'), list = el('ul', 'ready-hub__rows'), more = el('button', 'ready-hub__more'), note = el('p', 'ready-hub__note');
    more.type = 'button'; note.setAttribute('role', 'status'); note.hidden = true;
    root.append(head, list, more, note);
    let expanded = false, signature = '';
    more.onclick = () => { expanded = !expanded; signature = ''; render(true); };
    const held = () => root.matches(':hover') || root.contains(document.activeElement);
    function rowNode(r) {
        const li = el('li', `ready-hub__row ready-hub__row--${r.state}`); li.dataset.readyKey = r.key; if (r.urgent) li.dataset.urgent = 'true';
        const go = el('button', 'ready-hub__go', r.label); go.type = 'button';
        const does = r.state === 'ready' && r.act ? 'act' : r.open ? 'open' : null;
        go.title = does === 'act' ? `${r.label}. Does it now.` : does === 'open' ? `${r.label}. Opens where it is done.` : r.label;
        if (!does) { go.disabled = true; go.title = `${r.label}. ${r.gap || 'Not ready yet.'}`; }
        go.onclick = () => { try { if (does === 'act') r.act(); else r.open?.(); } catch (e) { note.hidden = false; note.textContent = e?.message || 'That did not work.'; } signature = ''; setTimeout(() => render(true), 0); };
        const fact = el('small', r.state === 'near' ? 'ready-hub__gap' : 'ready-hub__detail', r.state === 'near' ? r.gap || '' : r.detail || '');
        const from = el('small', 'ready-hub__from', r.sourceLabel || '');
        li.append(go, fact, from);
        return li;
    }
    function render(force = false) {
        const parent = host();
        if (!parent) return;
        if (!force && held()) return;
        const rows = collectReady(), model = hubModel(rows, {expanded});
        if (model.empty) { if (root.isConnected) root.remove(); signature = ''; return; } // further-off rows alone are not worth a block
        // Just above Here's action list, as its own sibling: the native list rebuilds its children, and a block inside it was
        // taken out and put back on every rebuild, so a pointer could never settle on a row (UR52).
        if (root.parentElement !== parent.parentElement || root.nextElementSibling !== parent) parent.before(root);
        const sig = JSON.stringify([model.head, model.shown.map(r => [r.key, r.label, r.state, r.gap, r.detail, r.urgent]), model.hidden, expanded]);
        if (sig === signature) return;
        signature = sig;
        head.textContent = model.head;
        list.replaceChildren(...model.shown.map(rowNode));
        more.hidden = !(model.hidden > 0 || expanded);
        more.textContent = expanded ? 'Show fewer' : `Show ${model.hidden} more`;
    }
    const timer = setInterval(() => render(), 1000);
    root.addEventListener('pointerleave', () => render());
    root.addEventListener('focusout', () => setTimeout(() => render(), 0));
    render();
    return {node: root, render, destroy() { clearInterval(timer); root.remove(); }};
}
