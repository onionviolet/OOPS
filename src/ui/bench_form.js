// PS250/PS251: one bench form for every world's enchanting (runes in the Village first; a Gu refinement, a charm or a
// ritual later). The same five parts sit in the same place on every bench, so the form is learnt once: what goes in,
// how much more it can hold (a bar and a reason), what clashes, the chance as known, and what you will have after.
// Draws only; a bench's own model supplies the rows. Rows go through the kit (src/ui/kit.js), drawn into `doc`.
import {kitElement, kitRow, useKitDocument} from './kit.js';

const el = (doc, tag, cls, text) => kitElement(tag, cls, text); // drawn while useKitDocument(doc) holds

/**
 * form: {inputs:[row], capacity:{used, max, unit, reason}, clashes:[row], chance:[row], after:[row], cost?: string, next?:[nextRow]}
 * row: {label, fact, from?, state?, data?} (kitRow fields). An empty part says so instead of vanishing (PS251).
 * nextRow (MKC5, src/making_next.js): a row with run, or disabled with its reason in `from`. A form without `next` draws five parts.
 */
export function renderBenchForm(doc, form) {
    useKitDocument(doc);
    try { return draw(doc, form); } finally { useKitDocument(null); }
}

function part(doc, id, title, rows, empty) {
    const sec = el(doc, 'section', 'bench-form__part');
    sec.dataset.benchPart = id;
    sec.append(el(doc, 'strong', null, title));
    if (rows.length) sec.append(...rows.map(r => kitRow(r)));
    else sec.append(el(doc, 'p', 'bench-form__empty', empty));
    return sec;
}

/** MKC5: the Next part on its own, for a bench that keeps its own layout (the gear workshop) but shares the loop's last step. */
export function renderBenchNext(doc, rows, empty = 'Make something to see where it can go.') {
    useKitDocument(doc);
    try { return nextPart(doc, rows, empty); } finally { useKitDocument(null); }
}

function nextPart(doc, rows, empty) {
    return part(doc, 'next', 'Next', rows.map(({run, disabled, title, ...row}) =>
        ({...row, action: {run, disabled: !!disabled, title: title || row.from || row.label}})), empty);
}

function draw(doc, form) {
    const root = el(doc, 'div', 'bench-form');
    root.dataset.benchForm = '';
    root.append(part(doc, 'inputs', 'Goes in', form.inputs, 'Nothing chosen yet.'));

    const cap = form.capacity, holds = el(doc, 'section', 'bench-form__part');
    holds.dataset.benchPart = 'capacity';
    holds.append(el(doc, 'strong', null, 'Room'));
    const bar = el(doc, 'meter', 'bench-form__bar');
    bar.min = 0; bar.max = cap.max; bar.value = Math.min(cap.used, cap.max); bar.high = cap.max; bar.optimum = 0;
    bar.setAttribute('aria-label', `${cap.used} of ${cap.max} ${cap.unit} used`);
    holds.append(bar, kitRow({label: `${cap.used} of ${cap.max} ${cap.unit}`, fact: cap.max - cap.used > 0 ? `room for ${cap.max - cap.used} more` : 'full', from: cap.reason,
        state: cap.used >= cap.max ? 'crowded' : ''}));
    root.append(holds);

    root.append(part(doc, 'clashes', 'Clashes', form.clashes, 'Nothing here pulls against anything else.'));
    root.append(part(doc, 'chance', 'How sure', form.chance, 'Choose what goes in to see how sure the result is.'));
    root.append(part(doc, 'after', 'After', form.after, 'Nothing changes yet.'));
    if (form.next) root.append(nextPart(doc, form.next, 'Carve or make something to see where it can go.'));
    if (form.cost) root.append(kitRow({label: form.cost, fact: 'paid whatever comes of it', className: 'bench-form__cost'}));
    return root;
}
