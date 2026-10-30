// The pathway card as DOM (pathway_card.js builds the model). Presentation only; the card's text form sits behind a disclosure so no
// fact lives in the drawing alone (UR37). The viewer's own document draws it, so it works in pop-outs. Art and emblem images load only
// when the model carries a src, which a private build supplies; otherwise a generated glyph fills the same slot.
import {FAMILY_WORD} from '../pathway_requirements.js';

export function renderPathwayCard(host, card, {onRoute} = {}) {
    const doc = host.ownerDocument;
    const el = (tag, cls, text, attrs = {}) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; };
    const slot = (cls, slotData, label) => {
        const box = el('div', cls, null, {'data-slot': label});
        if (slotData.src) { const img = el('img', 'pwc-img', null, {src: slotData.src, alt: slotData.alt ?? '', loading: 'lazy'}); img.addEventListener('error', () => { img.remove(); box.append(el('span', 'pwc-glyph', card.emblem.glyph, {'aria-hidden': 'true'})); }); box.append(img); }
        else box.append(el('span', 'pwc-glyph', card.emblem.glyph, {'aria-hidden': 'true'}));
        return box;
    };
    const root = el('article', 'pwc', null, {'data-pathway-card': '', 'aria-label': `${card.name}, pathway card`});
    const head = el('header', 'pwc-head');
    head.append(slot('pwc-emblem', card.emblem, 'emblem'));
    const title = el('div', 'pwc-title');
    if (card.group) title.append(el('p', 'pwc-group', card.group));
    title.append(el('h3', 'pwc-name', card.name));
    if (card.summary) title.append(el('p', 'pwc-summary', card.summary));
    title.append(el('p', 'pwc-note', card.note));
    head.append(title, slot('pwc-art', {...card.art, src: card.art.src}, 'art'));
    root.append(head);

    const ladder = el('ol', 'pwc-ladder', null, {'aria-label': 'Rungs, highest first'});
    for (const r of card.rungs) {
        const li = el('li', `pwc-rung pwc-rung-${r.state}`, null, {'data-rung': r.id, 'data-rung-state': r.state});
        const top = el('div', 'pwc-rung-head');
        top.append(el('span', 'pwc-pip', r.state === 'held' ? '▶' : r.state === 'crossed' ? '✓' : r.state === 'next' ? '◆' : '·', {'aria-hidden': 'true'}), el('strong', 'pwc-rung-name', r.label), el('span', 'pwc-rung-state', r.stateWord));
        if (r.ready) top.append(el('span', 'pwc-chip pwc-chip-ready', 'ready'));
        if (r.blocked) top.append(el('span', 'pwc-chip pwc-chip-blocked', `blocked: ${r.blocked}`));
        li.append(top);
        if (r.grants.length && r.state !== 'crossed') li.append(el('p', 'pwc-gives', `Gives: ${r.grants.join('; ')}`));
        if (r.lines.length) {
            const ul = el('ul', 'pwc-lines');
            for (const l of r.lines) {
                const item = el('li', `pwc-line pwc-line-${l.state}`, null, {'data-req': l.id, 'data-req-state': l.state, 'data-family': l.family});
                const row = el('div', 'pwc-line-row');
                row.append(el('span', 'pwc-mark', l.text.slice(0, 1), {'aria-hidden': 'true'}), el('span', 'pwc-family', l.state === 'unknown' ? 'Locked' : FAMILY_WORD[l.family]), el('span', 'pwc-line-label', l.label));
                if (l.knownness === 'known' && typeof l.need === 'number') row.append(el('span', 'pwc-amount', `${l.have} of ${l.need}`));
                if (l.state === 'partial') row.append(el('span', 'pwc-chip', 'partly known'));
                if (l.irreversible) row.append(el('span', 'pwc-chip', 'irreversible'));
                if (l.state !== 'unknown') row.append(el('span', `pwc-chip pwc-prov pwc-prov-${l.provenance}`, l.provenance));
                item.append(row);
                if (l.knownness === 'known' && !l.met) {
                    if (l.routes.length) {
                        const ways = el('ul', 'pwc-routes');
                        for (const rt of l.routes) {
                            const w = el('li', 'pwc-route');
                            w.append(el('span', 'pwc-route-label', rt.label), el('span', 'pwc-route-state', rt.available ? (rt.minutes != null ? `${rt.minutes} min` : 'available now') : rt.reason ?? 'not available now'));
                            if (onRoute) { const b = el('button', 'pwc-route-go', 'Find it', {type: 'button', 'data-route': rt.action, title: 'Move focus to the existing control. This spends nothing.'}); b.addEventListener('click', () => onRoute(rt.action)); w.append(b); }
                            ways.append(w);
                        }
                        item.append(ways);
                    } else item.append(el('p', 'pwc-noway', 'No way to meet this is known yet.'));
                    if (l.ifShort) item.append(el('p', 'pwc-short', `If short: ${l.ifShort.signs}. ${l.ifShort.outcome}.`));
                }
                ul.append(item);
            }
            li.append(ul);
        }
        if (r.ifShort) li.append(el('p', 'pwc-risk', `Risk: ${r.ifShort.signs}. ${r.ifShort.outcome}.`));
        ladder.append(li);
    }
    root.append(ladder);
    if (card.nextSteps.length) {
        const steps = el('section', 'pwc-steps', null, {'data-next-steps': ''});
        steps.append(el('h4', 'pwc-steps-title', 'Next steps, in the order they block'));
        const ol = el('ol');
        for (const s of card.nextSteps) ol.append(el('li', null, `${s.text}${s.quote ? ` · ${s.quote.minutes} min` : ''}`));
        steps.append(ol, el('p', 'pwc-note', 'Advice only: the order and the cheaper way are yours to change.'));
        root.append(steps);
    }
    const words = el('details', 'pwc-text'); words.append(el('summary', null, 'Read the card as text'), el('pre', 'fig-text', card.text));
    root.append(words);
    host.replaceChildren(root);
    return root;
}
