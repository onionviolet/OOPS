import {semanticInk} from './semantic_ink.js';
import {kitElement} from './kit.js';

// Shared presentation for a selected entry. Callers supply only the facts their observer can read.
export function fieldRecord(doc, {kind, name, nameRole, location, state, description, facts = [], links = []}) {
    const el = (tag, text) => kitElement(tag, null, text, doc);
    const card = el('article');
    card.className = 'field-record';
    if (location) {
        card.dataset.dwelling = '';
        const where = el('div', 'Location: ');
        where.className = 'field-record-location';
        where.append(semanticInk(el('span', location.name), 'place'));
        if (location.here) where.append(el('small', 'You are here'));
        card.append(where);
    }
    const header = el('header');
    header.append(el('small', kind), semanticInk(el('h3', name), nameRole));
    card.append(header);
    if (state) {
        const line = el('div');
        line.className = 'field-record-state';
        line.append(semanticInk(el('span', 'Current State: '), 'state-label'), semanticInk(el('span', state), 'state'));
        card.append(line);
    }
    if (description) card.append(semanticInk(el('p', description), location ? 'prose' : null));
    const table = el('dl');
    for (const [label, value, role] of facts) {
        if (value == null || value === '') continue;
        const term = el('dt', label);
        if (role === 'item') semanticInk(term, 'state-label');
        table.append(term, semanticInk(el('dd', value), role));
    }
    if (table.childElementCount) card.append(table);
    if (links.length) {
        const nav = el('nav');
        nav.setAttribute('aria-label', 'Related records');
        for (const link of links) {
            const b = el('button', link.label);
            b.type = 'button';
            b.onclick = link.open;
            nav.append(b);
        }
        card.append(nav);
    }
    return card;
}
