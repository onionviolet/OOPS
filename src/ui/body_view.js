// Body-by-part health view. Renders a bodyViewModel (src/body_figure.js) as plain DOM: a glance strip,
// a table of parts (what you feel, what others see) and training milestones drawn with the figure
// primitive. Every fact is in words; the ! and ● marks only repeat them (UR37). Draws with the node's
// own document so it works in pop-outs and headless tests.
import {renderFigure} from './figure.js';

/**
 * renderBodyView(node, model, {onCure, cureState, idPrefix})
 * model: bodyViewModel(); onCure(cureId) runs on a cure click; cureState(cureId) -> {disabled, reason}.
 * A null model empties the node.
 */
export function renderBodyView(node, model, {onCure = null, cureState = () => ({disabled: false, reason: ''}), idPrefix = 'body_view'} = {}) {
    const doc = node.ownerDocument;
    node.replaceChildren();
    if (!model) return;
    node.classList.add('body-view');
    const el = (tag, cls, text, attrs = {}) => {
        const e = doc.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined && text !== null) e.textContent = text;
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        return e;
    };

    if (model.glance.length) {
        const strip = el('ul', 'body-view-glance', undefined, {'aria-label': 'Conditions now'});
        for (const c of model.glance) strip.append(el('li', 'body-chip', `! ${c.label} · ${c.time}${c.level ? ` · level ${c.level}` : ''}`, {'data-condition': c.id}));
        node.append(strip);
    }

    if (model.empty) node.append(el('p', 'body-view-empty', model.empty));
    else {
        const table = el('table', 'body-view-parts');
        table.append(el('caption', 'body-view-caption', 'By body part'));
        const head = el('tr');
        for (const h of ['Part', 'Now', 'Others see']) head.append(el('th', null, h, {scope: 'col'}));
        const thead = el('thead'), body = el('tbody');
        thead.append(head); table.append(thead, body);
        for (const part of model.parts) {
            const row = el('tr', null, undefined, {'data-part': part.slot}), now = el('td', 'body-view-now'), seen = el('td', 'body-view-seen');
            row.append(el('th', 'body-view-part', part.label, {scope: 'row'}), now, seen); body.append(row);
            for (const c of part.now) {
                const block = el('div', 'body-view-cond'); now.append(block);
                block.append(el('p', 'body-view-line body-view-warn', `! ${c.label}${c.level ? ` · level ${c.level}` : ''} · ${c.time}`));
                if (c.recovered) {
                    const meter = el('meter', 'body-view-meter', undefined, {min: 0, max: c.recovered.of, value: c.recovered.done});
                    meter.setAttribute('aria-label', `${c.label} recovery`);
                    block.append(meter, el('span', 'body-view-recovered', `${c.recovered.done} of ${c.recovered.of} min recovered`));
                }
                if (c.felt) block.append(el('p', 'body-view-felt', c.felt));
                for (const cure of c.cures) {
                    const st = cureState(cure.id) || {};
                    const btn = el('button', 'body-view-cure', cure.label, {type: 'button', 'data-body-cure': cure.id});
                    if (st.disabled) { btn.disabled = true; btn.setAttribute('disabled', ''); }
                    if (st.reason) btn.title = st.reason;
                    btn.addEventListener('click', () => { if (onCure) onCure(cure.id); });
                    block.append(btn);
                    if (st.disabled && st.reason) block.append(el('span', 'body-view-reason', st.reason));
                }
                if (c.waits) block.append(el('p', 'body-view-wait', 'Or wait: it fades with time.'));
            }
            for (const l of part.lasting) {
                const block = el('div', 'body-view-cond body-view-lasting'); now.append(block);
                block.append(el('p', 'body-view-line', `● ${l.label} (${l.origin})`));
                if (l.felt) block.append(el('p', 'body-view-felt', l.felt));
            }
            const texts = [...part.now, ...part.lasting].map(i => i.seen).filter(Boolean);
            if (texts.length) for (const t of texts) seen.append(el('p', null, t));
            else seen.append(el('p', 'body-view-none', 'Nothing visible.'));
        }
        node.append(table);
    }

    if (model.milestones && model.milestones.length) {
        node.append(el('h3', 'body-view-heading', 'Next for this body'));
        const holder = el('div', 'body-view-milestones'); node.append(holder);
        renderFigure(holder, {id: `${idPrefix}-m`, title: 'Training milestones', size: 520,
            tracks: model.milestones.map(m => ({id: m.id, label: m.label, steps: [
                ...Array.from({length: m.need}, (_, i) => ({label: `${m.step} ${i + 1}`, state: i < m.done ? 'done' : i === m.done ? 'current' : 'pending'})),
                {label: m.keep, state: m.done >= m.need ? 'current' : 'pending'}]}))},
        {idPrefix: `${idPrefix}-m`, legend: false});
    }
}
