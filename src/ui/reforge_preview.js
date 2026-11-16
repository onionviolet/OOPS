// PS249: reforging shows the gamble before you pay, then the old and new marks side by side. One renderer for the Gear
// workshop and the item sheet; both draw the workshop quote's `preview` (gear_work.js), which owns the odds. Nothing here
// rolls, quotes or writes. Rows draw through the kit (src/ui/kit.js); the old-beside-new pair is the one view the kit lacks. `known` is the sheet's appraisal: without it the landing spans read "?" (as far as you can tell).
import {getAffix} from '../gear_affixes.js';
import {affixWords} from '../item_card_model.js';
import {kitRow} from './kit.js';

const el = (doc, tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const mark = (id, v) => { const a = getAffix(id); return a ? `${a.name} ${affixWords(a, v)}` : String(id); };
const pct = n => `${Math.round(n * 100)}%`;

/** The before-you-pay view, in kit rows (PS292): what stays, what is rerolled into what, the odds' causes and the cost. */
export function renderReforgePreview(doc, preview, {known = true, cost = []} = {}) {
    const root = el(doc, 'section', 'reforge-preview');
    root.dataset.reforgePreview = '';
    root.append(el(doc, 'h4', null, 'Before you pay'));
    const group = (title, rows, cls) => { const g = el(doc, 'div', cls); g.append(el(doc, 'strong', null, title), ...rows); return g; };

    const works = `${preview.history} ${preview.history === 1 ? 'work' : 'works'}`;
    const stays = group('Stays', [...preview.stays.map(a => kitRow({label: mark(a.id, a.v), fact: 'unchanged', data: {affix: a.id}})),
        kitRow({label: `Quality ${preview.quality}%`, fact: `with its parts and history (${works})`})], 'reforge-preview__stays');

    const pool = preview.pool.map(p => {
        const a = getAffix(p.id), span = known && a ? `${affixWords(a, p.lo)}–${affixWords(a, p.hi)}` : '?';
        return kitRow({label: p.name, fact: `${pct(p.chance)} chance · lands ${span}`, from: known && a ? `of ${affixWords(a, p.min)}–${affixWords(a, p.max)}` : '', data: {affix: p.id}});
    });
    const rolled = group(`Rerolled: ${mark(preview.target.id, preview.target.v)}`,
        [el(doc, 'p', null, `The new mark is one of these, landing between ${pct(preview.band[0])} and ${pct(preview.band[1])} of its range.`), ...pool], 'reforge-preview__rolled');

    const odds = group('What sets the odds', preview.factors.map(f => kitRow({label: f.label, fact: f.effect, data: {factor: f.id}})), 'reforge-preview__odds');
    root.append(stays, rolled, odds);
    if (cost.length) root.append(kitRow({label: `Costs ${cost.map(c => `${c.count} ${c.name}`).join(' and ')}`, fact: 'paid whatever lands', className: 'reforge-preview__cost'}));
    return root;
}

/** After the work: the old and new marks side by side, with Keep and, while the mark is soft, Hammer back. */
export function renderReforgeResult(doc, {from, to, onKeep, onRevert, revertReason = '', revertCost = ''}) {
    const root = el(doc, 'section', 'reforge-result');
    root.dataset.reforgeResult = '';
    const pair = el(doc, 'div', 'reforge-result__pair');
    for (const [label, a, role] of [['Before', from, 'before'], ['Now', to, 'after']]) {
        const col = el(doc, 'div', 'reforge-result__side');
        col.dataset.side = role;
        col.append(el(doc, 'span', 'reforge-result__label', label), el(doc, 'strong', null, mark(a.id, a.v)));
        pair.append(col);
    }
    const actions = el(doc, 'div', 'reforge-result__actions');
    actions.append(kitRow({label: 'Keep the new mark', action: {run: onKeep}, fact: 'the old mark is gone', data: {reforgeKeep: ''}}),
        kitRow({label: 'Hammer back', action: {run: onRevert, disabled: !!revertReason, title: revertReason || 'Restore the old mark while this one is soft'},
            fact: revertReason || `while the mark is soft${revertCost ? `; costs ${revertCost}` : ''}`, data: {reforgeRevert: ''}}));
    root.append(pair, actions);
    return root;
}
