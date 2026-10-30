// Character sheet renderer: draws a characterSheetView (src/character_sheet.js) into the node it is
// given, through that node's document, so pop-out windows work (MDL13). It never sees the truth.
// Layout dial: 'wide' lays sections out as a grid of cards (the 1920×1080 inspector and expanded
// You view); 'narrow' stacks them as disclosures for a docked side panel.
// compose = {'body-figure': (node, section) => bool, 'ability-ladder': ...}: sibling owners draw their
// figure into the slot; when none answers, the rows are the text form and nothing is redrawn here.
import {SHEET_STATES, SHEET_STATE_WORDS, characterSheetText} from '../character_sheet.js';

export function renderCharacterSheet(host, view, options = {}) {
    const doc = host.ownerDocument || globalThis.document;
    const make = (tag, className, text) => { const n = doc.createElement(tag); if (className) n.className = className; if (text) n.textContent = text; return n; };
    const layout = options.layout === 'narrow' ? 'narrow' : 'wide';
    const root = make('section', 'cs-sheet');
    root.dataset.layout = layout;
    root.dataset.subject = view.id;
    root.setAttribute('aria-label', `Character sheet: ${view.title}`);

    const head = make('header', 'cs-head');
    const title = make('h3', 'cs-title', view.title);
    head.append(title);
    const level = !view.level ? '' : /^\d/.test(view.level) ? `Level ${view.level}` : `Overall: ${view.level}`;
    const meta = [view.kind, level].filter(Boolean).join(' · ');
    if (meta) head.append(make('p', 'cs-meta', meta));
    const reads = make('p', 'cs-reads');
    reads.append(make('span', 'cs-reads-label', 'How you know: '));
    for (const read of view.reads) {
        const chip = make('span', 'cs-chip', read.label);
        if (read.guess) chip.dataset.guess = '';
        reads.append(chip);
    }
    head.append(reads);
    root.append(head);

    // Sections with nothing read fold into one line, so a stranger's sheet is not a wall of empty boxes.
    const unread = view.sections.filter(s => s.rows.length === 1 && s.rows[0].id === 'unread');
    if (unread.length) {
        const line = make('p', 'cs-unread');
        line.dataset.state = 'unknown';
        const mark = make('span', 'cs-mark', SHEET_STATES.unknown); mark.setAttribute('aria-hidden', 'true');
        line.append(mark, make('span', 'cs-text', `Not read yet: ${unread.map(s => s.label).join(', ')}.`), make('span', 'cs-state', SHEET_STATE_WORDS.unknown),
            make('span', 'cs-hint', 'A closer look or another means could tell more.'));
        root.append(line);
    }
    const grid = make('div', 'cs-grid');
    for (const section of view.sections) {
        if (unread.includes(section)) continue;
        const box = make(layout === 'narrow' ? 'details' : 'section', 'cs-section');
        box.dataset.section = section.id;
        if (layout === 'narrow') box.open = section.rows.some(r => r.state !== 'unknown');
        box.append(make(layout === 'narrow' ? 'summary' : 'h4', 'cs-section-title', section.label));
        if (section.slot) {
            const slot = make('div', 'cs-slot');
            slot.dataset.compose = section.slot;
            const drawn = options.compose?.[section.slot]?.(slot, section);
            if (drawn) box.append(slot);
        }
        const rows = make('dl', 'cs-rows');
        // A row names its source only when it differs from the section's usual one (UR73).
        const counts = {};
        for (const row of section.rows) if (row.basis) counts[row.basis] = (counts[row.basis] || 0) + 1;
        const usual = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
        for (const row of section.rows) {
            const basis = row.basis !== usual ? row.basis : '';
            const item = make('div', 'cs-row');
            item.dataset.state = row.state;
            if (row.id !== 'unread') item.dataset.row = row.id;
            else item.dataset.unread = '';
            const label = make('dt', 'cs-label', row.id === 'unread' ? '' : row.label);
            const value = make('dd', 'cs-value');
            if (row.state !== 'known') {
                const mark = make('span', 'cs-mark', SHEET_STATES[row.state]);
                mark.setAttribute('aria-hidden', 'true');
                value.append(mark);
            }
            if (row.text) value.append(make('span', 'cs-text', row.text));
            if (row.state !== 'known') value.append(make('span', 'cs-state', SHEET_STATE_WORDS[row.state]));
            item.append(label, value);
            if (row.id === 'unread') label.hidden = true;
            if (row.desc || basis) {
                const more = make('dd', 'cs-more');
                if (row.desc) more.append(make('span', 'cs-desc', row.desc));
                if (basis) more.append(make('span', 'cs-basis', basis));
                item.append(more);
            }
            rows.append(item);
        }
        box.append(rows);
        if (usual && view.reads.length > 1) box.append(make('p', 'cs-source', `Mostly from: ${usual}`));
        grid.append(box);
    }
    root.append(grid);
    if (options.text) {
        const text = make('details', 'cs-text-form');
        text.append(make('summary', '', 'Text form'), make('pre', '', characterSheetText(view)));
        root.append(text);
    }
    host.replaceChildren(root);
    return root;
}
