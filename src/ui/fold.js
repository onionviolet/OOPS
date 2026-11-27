// The Fold (design grammar primitive 4, docs/DESIGN_GRAMMAR.md; proposal under AD32). A thing has an inner life: it
// unfolds in place, nested, as `+` and `-` rows of live state, and the folded row says what is inside (UR26).
// The cat inspector in the atlas reference is the model: creature_record.js drew it for one creature; this is the
// shared form every kind uses (a Gu's body, a potion's risk, a person's thoughts, a place's who and what).
// The caller supplies the facts the OBSERVER may read (UR72, DSG10); the Fold never reads game state. A fold the
// observer cannot read yet says so in words ("unknown"), and a sealed fold names its reason and does not open.
// Open state is kept by path, so a live update() redraws values without closing what the player opened or moving
// focus (UR52). Drawn through the kit (kitElement, and the kit-number form of knownNumberNode in the fold's own document); styles/fold.css uses tokens only.
import {kitElement} from './kit.js';
import {knownNumberNode} from './known_number.js';

export const FOLD_STATES = Object.freeze(['known', 'estimated', 'unknown', 'empty', 'sealed']);

/**
 * spec: {key, label, summary?, state?, open?, lines?, folds?, unknownText?, emptyText?, reason?}
 *   line: a string, or {label, value, how?, field?, note?}; a number value draws through kitNumber (known, ~estimated, "?")
 *   state unknown: the body is unknownText; empty: the body is emptyText (says how to fill it, UR32);
 *   sealed: no body, a disabled head and `reason` (DSG10).
 * Returns {node, update(spec), isOpen(path)}.
 */
export function createFold(doc, initial) {
    const el = (tag, cls, text) => kitElement(tag, cls, text, doc);
    const opened = new Map();
    let root = null;

    const numberNode = item => { const n = knownNumberNode(item.value, item.how || {}, {field: item.field || item.label || '', doc}); n.classList.add('kit-number'); return n; };
    const line = item => {
        if (typeof item === 'string') return el('p', 'fold__line', item);
        const row = el('p', 'fold__line');
        if (item.label) row.append(el('span', 'fold__label-text', item.label + ' '));
        row.append(typeof item.value === 'number' || item.how ? numberNode(item) : el('span', 'fold__value', String(item.value ?? '')));
        if (item.note) row.append(el('small', 'fold__note', ' ' + item.note));
        return row;
    };

    function draw(spec, path) {
        const state = FOLD_STATES.includes(spec.state) ? spec.state : 'known';
        if (state === 'sealed') {
            const sealed = el('div', 'fold fold--sealed'); sealed.dataset.foldState = 'sealed'; sealed.dataset.foldPath = path;
            const head = el('button', 'fold__head', spec.label); head.type = 'button'; head.setAttribute('aria-disabled', 'true'); head.dataset.disabledReason = spec.reason || '';
            const lock = el('span', 'fold__mark'); lock.setAttribute('aria-hidden', 'true'); head.prepend(lock);
            sealed.append(head, el('small', 'fold__reason', spec.reason || 'Not yet.'));
            return sealed;
        }
        const node = el('details', 'fold'); node.dataset.foldState = state; node.dataset.foldPath = path;
        node.open = opened.has(path) ? opened.get(path) : !!spec.open;
        node.addEventListener('toggle', () => { opened.set(path, node.open); });
        const head = el('summary', 'fold__head');
        const mark = el('span', 'fold__mark'); mark.setAttribute('aria-hidden', 'true'); // not summary::before: #main_content summary::before is the touch-target pad (ui_tokens.css)
        head.append(mark, el('span', 'fold__title', spec.label));
        const glance = state === 'unknown' ? '?' : spec.summary;
        if (glance) head.append(el('small', 'fold__summary', glance));
        node.append(head);
        const body = el('div', 'fold__body');
        if (state === 'unknown') body.append(el('p', 'fold__line fold__line--unknown', spec.unknownText || 'Not known yet.'));
        else if (state === 'empty') body.append(el('p', 'fold__line fold__line--empty', spec.emptyText || 'Nothing here yet.'));
        else {
            for (const item of spec.lines || []) body.append(line(item));
            for (const child of spec.folds || []) body.append(draw(child, `${path}/${child.key ?? child.label}`));
        }
        node.append(body);
        return node;
    }

    function update(spec) {
        const active = doc.activeElement?.closest?.('[data-fold-path]')?.dataset.foldPath;
        const next = draw(spec, spec.key ?? spec.label);
        if (root?.parentNode) root.replaceWith(next);
        root = next;
        if (active) root.querySelector?.(`[data-fold-path="${active}"] > .fold__head`)?.focus?.();
        return root;
    }
    update(initial);
    return {get node() { return root; }, update, isOpen: path => opened.get(path) ?? false};
}
