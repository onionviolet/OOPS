// Shared, world-neutral interaction for any figure drawn by figure.js (bk-forms, proposal under AD32, AD46).
// Two halves: a pure model over a figure spec (graph, neighbours, filter, compare, cards, arrow-key moves,
// change diff), which tests exercise without a DOM, and attachFigureInteract, a thin layer that wires it to the
// drawn SVG. It reads the spec and the markers' data-id and the edges' data-from/data-to; it draws no kind-specific
// shapes. Optional spec fields it shows when present: node.detail and node.why, edge.detail and edge.why.
// Nothing here is the only route to a fact: the text form and the native <title> words stay as figure.js draws
// them, and the cards repeat the same facts. Motion is a class that flashes a real change and is off under effects off.
import {FIGURE_STATES, validateFigureSpec} from './figure.js';

const word = state => state ? state.charAt(0).toUpperCase() + state.slice(1) : '';
const stateMark = state => state ? `${FIGURE_STATES[state]} ${word(state)}` : '';

/** Nodes, slots and edges as an undirected graph. Edge `i` is the edge's index in the spec. */
export function figureGraph(input) {
    const spec = validateFigureSpec(input);
    const nodes = new Map([...spec.nodes, ...spec.slots].map(m => [m.id, {id: m.id, label: m.label, state: m.state, ring: m.ring, detail: m.detail, why: m.why, kind: m.kind}]));
    const edges = spec.edges.map((e, i) => ({i, from: e.from, to: e.to, kind: e.kind, label: e.label, state: e.state, detail: e.detail, why: e.why}));
    const adj = new Map([...nodes.keys()].map(id => [id, []]));
    for (const e of edges) { adj.get(e.from).push({id: e.to, edge: e}); if (e.to !== e.from) adj.get(e.to).push({id: e.from, edge: e}); }
    return {title: spec.title, nodes, edges, adj, rings: new Map(spec.rings.map(r => [r.id, r.label]))};
}

/** Ids within `hops` steps of `id`, itself included. */
export function neighbourhood(graph, id, hops = 1) {
    if (!graph.nodes.has(id)) return new Set();
    const seen = new Set([id]);
    let frontier = [id];
    for (let h = 0; h < hops; h += 1) {
        const next = [];
        for (const from of frontier) for (const {id: to} of graph.adj.get(from)) if (!seen.has(to)) { seen.add(to); next.push(to); }
        frontier = next;
    }
    return seen;
}

/** Union of the neighbourhoods of several ids (focus plus context around a pinned set). */
export const focusSet = (graph, ids, hops = 1) => new Set([...ids].flatMap(id => [...neighbourhood(graph, id, hops)]));

/** The ids a filter keeps, or null when the filter is empty (everything shows). Text matches label and ring; states and kinds narrow. */
export function filterIds(graph, {text = '', states = [], kinds = []} = {}) {
    const q = text.trim().toLowerCase();
    if (!q && !states.length && !kinds.length) return null;
    const keep = new Set();
    for (const n of graph.nodes.values()) {
        const ring = n.ring === undefined ? '' : graph.rings.get(n.ring) || '';
        const textOk = !q || `${n.label} ${ring}`.toLowerCase().includes(q);
        const stateOk = !states.length || states.includes(n.state);
        const kindOk = !kinds.length || graph.adj.get(n.id).some(({edge}) => kinds.includes(edge.kind));
        if (textOk && stateOk && kindOk) keep.add(n.id);
    }
    return keep;
}

/** What two pinned nodes have in common: shared neighbours, links between them, what only each has. */
export function compareNodes(graph, a, b) {
    const side = id => new Map(graph.adj.get(id).filter(({id: other}) => other !== a && other !== b).map(({id: other, edge}) => [other, edge]));
    const A = side(a), B = side(b);
    const name = id => graph.nodes.get(id).label;
    return {
        a: graph.nodes.get(a), b: graph.nodes.get(b),
        direct: graph.edges.filter(e => (e.from === a && e.to === b) || (e.from === b && e.to === a)),
        shared: [...A.keys()].filter(id => B.has(id)).map(id => ({id, label: name(id), viaA: A.get(id).kind, viaB: B.get(id).kind})),
        onlyA: [...A.keys()].filter(id => !B.has(id)).map(id => ({id, label: name(id), via: A.get(id).kind})),
        onlyB: [...B.keys()].filter(id => !A.has(id)).map(id => ({id, label: name(id), via: B.get(id).kind})),
    };
}

/** A node's hover card as data: title, state words, optional detail and why, and its links (each link is itself hoverable). */
export function cardModel(graph, id) {
    const n = graph.nodes.get(id);
    if (!n) return null;
    const links = graph.adj.get(id).map(({id: other, edge}) => ({id: other, label: graph.nodes.get(other).label, kind: edge.kind, edgeLabel: edge.label, state: edge.state, detail: edge.detail, why: edge.why}));
    return {id, title: n.label, state: n.state, stateWords: stateMark(n.state), ring: n.ring === undefined ? undefined : graph.rings.get(n.ring), detail: n.detail, why: n.why, links};
}

/** Arrow-key move: the nearest point inside a 90 degree cone around `dir` ('left' 'right' 'up' 'down'); null when none. */
export function moveFocus(points, from, dir) {
    const origin = points.get(from);
    if (!origin) return null;
    const axis = {left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1]}[dir];
    if (!axis) return null;
    let best = null;
    for (const [id, p] of points) {
        if (id === from) continue;
        const dx = p.x - origin.x, dy = p.y - origin.y, along = dx * axis[0] + dy * axis[1], across = Math.abs(dx * axis[1] + dy * axis[0]);
        if (along <= 0 || across > along) continue;
        const cost = along + across * 1.5;
        if (!best || cost < best.cost) best = {id, cost};
    }
    return best ? best.id : null;
}

/** Ids whose state or label differ between two specs: the only things worth a flash of motion. */
export function changedIds(prev, next) {
    const old = new Map([...(prev.nodes || []), ...(prev.slots || [])].map(m => [m.id, m]));
    return [...(next.nodes || []), ...(next.slots || [])].filter(m => !old.has(m.id) || old.get(m.id).state !== m.state || old.get(m.id).label !== m.label).map(m => m.id);
}

const MAX_NEST = 2;

/**
 * Wire a drawn figure. `host` is the element renderFigure drew into. options:
 *   {filter: true, hops: 1, focusMode: false, onPin(ids), previous (the prior spec: flash what changed)}
 * Returns {pin, unpin, pinned(), setFilter(q), setFocusMode(bool), destroy()}.
 */
export function attachFigureInteract(host, spec, options = {}) {
    const doc = host.ownerDocument, graph = figureGraph(spec), hops = options.hops || 1;
    const svg = host.querySelector('svg.fig-svg');
    const markerEls = new Map([...host.querySelectorAll('.fig-marker')].map(el => [el.dataset.id, el]));
    const edgeEls = [...host.querySelectorAll('.fig-edge[data-from]')];
    const make = (tag, cls, text) => { const el = doc.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
    if (!svg || !markerEls.size) return {pin() {}, unpin() {}, pinned: () => [], setFilter() {}, setFocusMode() {}, destroy() {}};

    // The native tooltip would sit beside our card; its words move to aria-label while attached and return on destroy.
    const titles = [];
    for (const el of [...markerEls.values(), ...edgeEls]) {
        const t = [...el.children].find(c => c.localName === 'title');
        if (t) { titles.push([el, t]); el.setAttribute('aria-label', t.textContent); t.remove(); }
    }
    const order = [...markerEls.keys()];
    let pinned = [], hover = null, query = '', focusMode = !!options.focusMode, rove = order[0];
    const points = new Map(order.map(id => { const b = markerEls.get(id).querySelector('.fig-body'); return [id, {x: Number(b.getAttribute('cx')), y: Number(b.getAttribute('cy'))}]; }));
    for (const [id, el] of markerEls) { el.setAttribute('tabindex', id === rove ? '0' : '-1'); el.setAttribute('role', 'button'); el.setAttribute('aria-pressed', 'false'); el.classList.add('fig-interactive'); }
    host.classList.add('fig-interact');

    const bar = make('div', 'fig-interact-bar');
    const input = make('input', 'fig-filter'); input.type = 'search'; input.placeholder = 'Filter'; input.setAttribute('aria-label', `Filter ${graph.title}`);
    const count = make('span', 'fig-filter-count'); count.setAttribute('aria-live', 'polite');
    const focusBtn = make('button', 'fig-focus-toggle', 'Focus: off'); focusBtn.type = 'button'; focusBtn.setAttribute('aria-pressed', 'false');
    const clearBtn = make('button', 'fig-clear', 'Clear'); clearBtn.type = 'button';
    if (options.filter !== false) bar.append(input, count);
    bar.append(focusBtn, clearBtn);
    const hint = make('p', 'fig-interact-hint', 'Hover or focus a point to light its neighbours. Click or press Enter to pin; pin two to compare. Arrow keys move, Esc clears.');
    const cards = make('div', 'fig-cards');
    const comparePane = make('div', 'fig-compare'); comparePane.hidden = true;
    host.prepend(bar); host.append(hint, cards, comparePane);

    const list = (parent, rows) => { const ul = make('ul', 'fig-card-list'); for (const r of rows) ul.append(r); parent.append(ul); };
    const linkChip = (link, depth) => {
        const li = make('li'), b = make('button', 'fig-card-link', link.label); b.type = 'button'; b.dataset.id = link.id;
        const kind = make('span', 'fig-card-kind', ` ${link.edgeLabel || link.kind}${link.state ? ` ${FIGURE_STATES[link.state]}` : ''}`);
        li.append(b, kind);
        if (link.detail || link.why) li.append(make('small', 'fig-card-why', ` ${link.why ? `Why: ${link.why}` : link.detail}`));
        b.addEventListener('pointerenter', () => showCard(link.id, depth + 1, li));
        b.addEventListener('focus', () => showCard(link.id, depth + 1, li));
        b.addEventListener('click', () => { hover = link.id; setFocusTo(link.id); });
        return li;
    };
    function cardFor(id, depth) {
        const m = cardModel(graph, id), card = make('section', `fig-card${depth ? ' fig-card--nested' : ''}`);
        card.setAttribute('role', 'region'); card.setAttribute('aria-label', m.title); card.dataset.id = id;
        card.append(make('h4', 'fig-card-title', m.title), make('p', 'fig-card-state', [m.stateWords, m.ring].filter(Boolean).join(' · ')));
        if (m.detail) card.append(make('p', 'fig-card-detail', m.detail));
        if (m.why) card.append(make('p', 'fig-card-why', `Why: ${m.why}`));
        if (m.links.length) list(card, m.links.map(l => linkChip(l, depth)));
        else card.append(make('p', 'fig-card-none', 'No links drawn.'));
        return card;
    }
    function showCard(id, depth = 0, anchor) {
        if (depth > MAX_NEST) return;
        for (const old of [...cards.children]) if (Number(old.dataset.depth || 0) >= depth && !old.dataset.pinned) old.remove();
        const card = cardFor(id, depth); card.dataset.depth = depth;
        if (pinned.includes(id) && depth === 0) card.dataset.pinned = '1';
        cards.append(card);
        if (anchor) card.style.marginInlineStart = `${depth * 16}px`;
    }
    const clearCards = () => { for (const c of [...cards.children]) if (!c.dataset.pinned) c.remove(); };

    function repaint() {
        const near = hover ? neighbourhood(graph, hover, hops) : null;
        const pinSet = pinned.length ? focusSet(graph, pinned, hops) : null;
        const lit = near || pinSet;
        const keep = filterIds(graph, {text: query});
        for (const [id, el] of markerEls) {
            el.classList.toggle('fig-hl', !!lit && lit.has(id));
            el.classList.toggle('fig-dim', (!!lit && !lit.has(id)) || (!!keep && !keep.has(id)));
            el.classList.toggle('fig-pinned', pinned.includes(id));
            el.classList.toggle('fig-far', focusMode && !!pinSet && !pinSet.has(id));
            el.setAttribute('aria-pressed', pinned.includes(id) ? 'true' : 'false');
        }
        for (const el of edgeEls) {
            const f = el.dataset.from, t = el.dataset.to;
            el.classList.toggle('fig-hl', !!lit && (lit.has(f) && lit.has(t)) && (!near || f === hover || t === hover || (pinSet && (pinned.includes(f) || pinned.includes(t)))));
            el.classList.toggle('fig-dim', !!lit && !(lit.has(f) && lit.has(t)));
        }
        host.classList.toggle('fig-has-focus', !!lit);
        count.textContent = keep ? `${keep.size} of ${graph.nodes.size} match` : '';
        focusBtn.textContent = `Focus: ${focusMode ? 'on' : 'off'}`; focusBtn.setAttribute('aria-pressed', String(focusMode));
        renderCompare();
    }
    function renderCompare() {
        comparePane.replaceChildren();
        comparePane.hidden = pinned.length < 2;
        if (pinned.length < 2) return;
        const c = compareNodes(graph, pinned[0], pinned[1]);
        comparePane.append(make('h4', '', `${c.a.label} and ${c.b.label}`));
        const row = (label, items) => { const p = make('p', '', `${label}: ${items.length ? items.join('; ') : 'none drawn'}.`); comparePane.append(p); };
        row('Linked directly', c.direct.map(e => `${e.kind}${e.label ? `, ${e.label}` : ''}`));
        row('Both connect to', c.shared.map(s => `${s.label} (${s.viaA}, ${s.viaB})`));
        row(`Only ${c.a.label}`, c.onlyA.map(s => `${s.label} (${s.via})`));
        row(`Only ${c.b.label}`, c.onlyB.map(s => `${s.label} (${s.via})`));
    }
    function setPinned(next) {
        pinned = next.slice(-2); // two at most: a compare is a pair
        for (const c of [...cards.children]) if (c.dataset.pinned) c.remove();
        for (const id of pinned) { const card = cardFor(id, 0); card.dataset.pinned = '1'; card.dataset.depth = 0; cards.append(card); }
        if (options.onPin) options.onPin([...pinned]);
        repaint();
    }
    const togglePin = id => setPinned(pinned.includes(id) ? pinned.filter(p => p !== id) : [...pinned, id]);
    function setFocusTo(id) {
        rove = id;
        for (const [k, el] of markerEls) el.setAttribute('tabindex', k === id ? '0' : '-1');
        markerEls.get(id).focus();
    }
    const idOf = e => { const m = e.target.closest && e.target.closest('.fig-marker'); return m && host.contains(m) ? m.dataset.id : null; };

    const handlers = [
        ['pointerover', e => { const id = idOf(e); if (id && id !== hover) { hover = id; clearCards(); showCard(id); repaint(); } }],
        ['pointerout', e => { const id = idOf(e); if (id && (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest('.fig-marker'))) { hover = null; clearCards(); repaint(); } }],
        ['focusin', e => { const id = idOf(e); if (id) { hover = id; rove = id; clearCards(); showCard(id); repaint(); } }],
        ['focusout', e => { if (idOf(e)) { hover = null; clearCards(); repaint(); } }],
        ['click', e => { const id = idOf(e); if (id) togglePin(id); }],
        ['keydown', e => {
            const id = idOf(e);
            if (e.key === 'Escape') { hover = null; setPinned([]); clearCards(); return; }
            if (!id) return;
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePin(id); return; }
            if (e.key === 'f') { focusMode = !focusMode; repaint(); return; }
            const dir = {ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down'}[e.key];
            const target = dir ? moveFocus(points, id, dir) : e.key === 'Home' ? order[0] : e.key === 'End' ? order[order.length - 1] : null;
            if (target) { e.preventDefault(); setFocusTo(target); }
        }],
    ];
    for (const [type, fn] of handlers) host.addEventListener(type, fn);
    const onInput = () => { query = input.value; repaint(); };
    const onFocus = () => { focusMode = !focusMode; repaint(); };
    const onClear = () => { input.value = ''; query = ''; hover = null; focusMode = false; setPinned([]); clearCards(); };
    input.addEventListener('input', onInput); focusBtn.addEventListener('click', onFocus); clearBtn.addEventListener('click', onClear);

    if (options.previous) {
        const flash = changedIds(options.previous, spec);
        for (const id of flash) if (markerEls.has(id)) markerEls.get(id).classList.add('fig-changed', 'fig-fx--pulse'); // the shared pulse effect: classes only, off under effects off and reduced
    }
    repaint();
    return {
        pin: id => { if (graph.nodes.has(id)) setPinned([...pinned.filter(p => p !== id), id]); },
        unpin: () => setPinned([]),
        pinned: () => [...pinned],
        setFilter: q => { query = q; input.value = q; repaint(); },
        setFocusMode: on => { focusMode = !!on; repaint(); },
        destroy() {
            for (const [type, fn] of handlers) host.removeEventListener(type, fn);
            for (const [el, t] of titles) { el.removeAttribute('aria-label'); el.prepend(t); }
            for (const el of markerEls.values()) { for (const a of ['tabindex', 'role', 'aria-pressed']) el.removeAttribute(a); el.classList.remove('fig-interactive', 'fig-hl', 'fig-dim', 'fig-pinned', 'fig-far', 'fig-changed', 'fig-fx--pulse'); }
            for (const el of edgeEls) el.classList.remove('fig-hl', 'fig-dim');
            bar.remove(); hint.remove(); cards.remove(); comparePane.remove();
            host.classList.remove('fig-interact', 'fig-has-focus');
        },
    };
}
