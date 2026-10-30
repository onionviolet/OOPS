// Alternate forms for a figure spec (bk-forms, proposal under AD32 and AD46). The same spec that figure.js draws as a
// ring, web or track can be read as a sortable table with a pinned inspector, an adjacency matrix, or plain sentences.
// Models are pure (tests need no DOM); the renderers draw with the node's own document and carry the same facts as
// figureText, so no form holds a fact the others lack. mountFormSwitch keeps the drawn figure as one choice (AD45).
import {FIGURE_STATES, renderFigure, validateFigureSpec} from './figure.js';
import {attachFigureInteract, figureGraph} from './figure_interact.js';

export const FIGURE_FORMS = {web: 'Figure', table: 'Table', matrix: 'Matrix', sentences: 'Sentences'};
const word = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const stateWords = s => s ? `${FIGURE_STATES[s]} ${word(s)}` : '';

/** Table rows: one per node or slot with its ring, state, link count and the links in words. */
export function tableModel(input) {
    const graph = figureGraph(input);
    const rows = [...graph.nodes.values()].map(n => {
        const links = graph.adj.get(n.id).map(({id, edge}) => ({id, label: graph.nodes.get(id).label, kind: edge.kind, edgeLabel: edge.label, state: edge.state}));
        return {id: n.id, label: n.label, state: n.state, stateWords: stateWords(n.state), ring: n.ring === undefined ? '' : graph.rings.get(n.ring), degree: links.length, links, detail: n.detail, why: n.why};
    });
    return {title: graph.title, columns: ['label', 'ring', 'state', 'degree'], rows};
}

/** Sort rows by a column; text columns A to Z, degree high to low. Stable, never mutates. */
export function sortRows(rows, column, descending = false) {
    const key = r => column === 'degree' ? r.degree : String(r[column] || '').toLowerCase();
    const sign = (column === 'degree' ? -1 : 1) * (descending ? -1 : 1);
    return rows.map((r, i) => [r, i]).sort((x, y) => (key(x[0]) < key(y[0]) ? -1 : key(x[0]) > key(y[0]) ? 1 : 0) * sign || x[1] - y[1]).map(p => p[0]);
}

/** Matrix: rows and columns are nodes, a cell lists the edge kinds between the pair (both ways). */
export function matrixModel(input) {
    const graph = figureGraph(input), ids = [...graph.nodes.keys()];
    const cell = new Map();
    for (const e of graph.edges) for (const key of [`${e.from}|${e.to}`, `${e.to}|${e.from}`]) cell.set(key, [...(cell.get(key) || []), e]);
    return {title: graph.title, ids, labels: ids.map(id => graph.nodes.get(id).label), cell: (a, b) => cell.get(`${a}|${b}`) || []};
}

/** One sentence per node, built from the same graph: "Brenna (filled) is linked to X by kind." */
export function sentenceModel(input) {
    const t = tableModel(input);
    return t.rows.map(r => `${r.label}${r.stateWords ? ` (${r.state})` : ''}${r.ring ? `, on ${r.ring}` : ''}: ${r.links.length ? r.links.map(l => `${l.edgeLabel || l.kind} ${l.label}`).join('; ') : 'no links drawn'}.`);
}

const el = (doc, tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

/** Sortable table with an inspector beside it. Click or Enter on a row pins it; the inspector lists its links as buttons that jump to the linked row. */
export function renderTableForm(host, spec) {
    const doc = host.ownerDocument, model = tableModel(spec);
    const wrap = el(doc, 'div', 'fig-form fig-form--table'), table = el(doc, 'table', 'fig-table'), inspector = el(doc, 'aside', 'fig-inspector');
    inspector.setAttribute('aria-live', 'polite');
    let sortBy = 'label', desc = false, selected = null;
    const showInspector = row => {
        inspector.replaceChildren();
        if (!row) { inspector.append(el(doc, 'p', 'fig-inspector-empty', 'Select a row to see what it links to.')); return; }
        inspector.append(el(doc, 'h4', '', row.label), el(doc, 'p', '', [row.stateWords, row.ring].filter(Boolean).join(' · ')));
        if (row.detail) inspector.append(el(doc, 'p', '', row.detail));
        if (row.why) inspector.append(el(doc, 'p', '', `Why: ${row.why}`));
        const ul = el(doc, 'ul', 'fig-card-list');
        for (const l of row.links) {
            const li = el(doc, 'li'), b = el(doc, 'button', 'fig-card-link', l.label); b.type = 'button';
            b.addEventListener('click', () => { selected = l.id; draw(); });
            li.append(b, el(doc, 'span', 'fig-card-kind', ` ${l.edgeLabel || l.kind}${l.state ? ` ${FIGURE_STATES[l.state]}` : ''}`)); ul.append(li);
        }
        inspector.append(ul.children.length ? ul : el(doc, 'p', 'fig-card-none', 'No links drawn.'));
    };
    function draw() {
        table.replaceChildren();
        const head = el(doc, 'tr');
        for (const c of model.columns) {
            const th = el(doc, 'th'), b = el(doc, 'button', 'fig-sort', `${word(c)}${sortBy === c ? (desc ? ' ▾' : ' ▴') : ''}`); b.type = 'button';
            th.setAttribute('aria-sort', sortBy === c ? (desc ? 'descending' : 'ascending') : 'none');
            b.addEventListener('click', () => { desc = sortBy === c ? !desc : false; sortBy = c; draw(); });
            th.append(b); head.append(th);
        }
        table.append(el(doc, 'thead')); table.firstChild.append(head);
        const body = el(doc, 'tbody');
        for (const r of sortRows(model.rows, sortBy, desc)) {
            const tr = el(doc, 'tr', r.id === selected ? 'fig-row-selected' : ''); tr.dataset.id = r.id; tr.setAttribute('tabindex', '0');
            tr.setAttribute('aria-selected', String(r.id === selected));
            for (const text of [r.label, r.ring, r.stateWords, String(r.degree)]) tr.append(el(doc, 'td', '', text));
            const pick = () => { selected = r.id; draw(); };
            tr.addEventListener('click', pick);
            tr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
            body.append(tr);
        }
        table.append(body);
        showInspector(model.rows.find(r => r.id === selected));
    }
    draw();
    wrap.append(table, inspector); host.replaceChildren(wrap);
    return {select: id => { selected = id; draw(); }, model};
}

/** Adjacency matrix: a mark in a cell means a link; hover or focus a cell names the pair and kinds in words. */
export function renderMatrixForm(host, spec) {
    const doc = host.ownerDocument, m = matrixModel(spec), table = el(doc, 'table', 'fig-matrix'), wrap = el(doc, 'div', 'fig-form fig-form--matrix');
    const note = el(doc, 'p', 'fig-matrix-note', 'Select a marked cell to read the link in words.'); note.setAttribute('aria-live', 'polite');
    const head = el(doc, 'tr'); head.append(el(doc, 'th'));
    for (const label of m.labels) { const th = el(doc, 'th', 'fig-matrix-col'); th.append(el(doc, 'span', '', label)); head.append(th); }
    table.append(el(doc, 'thead')); table.firstChild.append(head);
    const body = el(doc, 'tbody');
    m.ids.forEach((a, i) => {
        const tr = el(doc, 'tr'); tr.dataset.id = a; tr.append(el(doc, 'th', 'fig-matrix-row', m.labels[i]));
        m.ids.forEach((b, j) => {
            const links = a === b ? [] : m.cell(a, b), td = el(doc, 'td', links.length ? 'fig-matrix-on' : '');
            if (links.length) {
                const words = `${m.labels[i]} and ${m.labels[j]}: ${links.map(e => `${e.kind}${e.label ? `, ${e.label}` : ''}`).join('; ')}`;
                const b2 = el(doc, 'button', 'fig-matrix-mark', links.length > 1 ? String(links.length) : '●'); b2.type = 'button'; b2.setAttribute('aria-label', words);
                for (const type of ['click', 'focus', 'pointerenter']) b2.addEventListener(type, () => { note.textContent = words; });
                td.append(b2);
            }
            tr.append(td);
        });
        body.append(tr);
    });
    table.append(body); wrap.append(table, note); host.replaceChildren(wrap);
    return {model: m};
}

export function renderSentenceForm(host, spec) {
    const doc = host.ownerDocument, wrap = el(doc, 'div', 'fig-form fig-form--sentences'), ul = el(doc, 'ul', 'fig-sentences');
    for (const line of sentenceModel(spec)) ul.append(el(doc, 'li', '', line));
    wrap.append(ul); host.replaceChildren(wrap);
}

/**
 * A form switch around one figure. `forms` lists the choices (default first unless options.initial). The figure
 * stays one of them (AD45); the choice is remembered per figure id in options.memory (a Map) when given.
 * Returns {show(form), form()}.
 */
export function mountFormSwitch(root, spec, options = {}) {
    const doc = root.ownerDocument, forms = (options.forms || ['web', 'table', 'matrix']).filter(f => FIGURE_FORMS[f]);
    const valid = validateFigureSpec(spec), interact = options.interact !== false;
    const bar = el(doc, 'div', 'fig-form-switch'), stage = el(doc, 'div', 'fig-form-stage');
    bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', `Show ${valid.title} as`);
    root.classList.add('fig'); // the figure tokens must reach the switch and the non-figure forms, not only a drawn figure
    root.replaceChildren(bar, stage);
    let current = (options.memory && options.memory.get(valid.id)) || options.initial || forms[0], detach = null;
    const buttons = new Map(forms.map(f => { const b = el(doc, 'button', 'fig-form-choice', FIGURE_FORMS[f]); b.type = 'button'; b.dataset.form = f; bar.append(b); b.addEventListener('click', () => show(f)); return [f, b]; }));
    function show(form) {
        if (!forms.includes(form)) return;
        if (detach) { detach(); detach = null; }
        current = form; if (options.memory) options.memory.set(valid.id, form);
        for (const [f, b] of buttons) b.setAttribute('aria-pressed', String(f === form));
        stage.dataset.form = form;
        if (form === 'web') {
            renderFigure(stage, spec, {idPrefix: options.idPrefix, text: options.text, legend: options.legend});
            if (interact) { const a = attachFigureInteract(stage, spec, options.interactOptions || {}); detach = () => a.destroy(); }
        } else if (form === 'table') renderTableForm(stage, spec);
        else if (form === 'matrix') renderMatrixForm(stage, spec);
        else renderSentenceForm(stage, spec);
    }
    show(current);
    return {show, form: () => current};
}
