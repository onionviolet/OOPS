// Gallery sections for the redesign drafts: the current figure on the left, the draft on the right, both in the page's skin.
// Self-contained and synchronous so the skin pass in figure_gallery.js sees both cells (they carry data-theme-cell="luminous").
import {renderFigure} from '../figure.js';
import {renderVersusRow, versusText} from '../combat_versus.js';
import {applyCustomizationProfile, defaultCustomizationState} from '../../customization_profiles.js';
import {applySkin} from './skins/paper.js';
import {REDESIGNS} from './fixtures/redesigns.js';

export function mountRedesigns(main) {
    const doc = main.ownerDocument, state = defaultCustomizationState();
    const el = (tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    const anchor = main.querySelector('[data-fixture="style-guide"]');
    let after = anchor;
    for (const r of REDESIGNS) {
        const section = el('section', 'fig-gallery-section'); section.dataset.fixture = r.id;
        section.append(el('h2', '', r.title));
        const note = el('p', 'sg-note', `Proposal. Liberties: ${r.liberties.join(', ')}. Left is today; right is the draft. The text form is behind "read as text".`);
        const pair = el('div', 'fig-gallery-pair');
        const cell = (label, draw) => {
            const c = el('div', 'fig-gallery-cell'), host = el('div', 'theme-preview'), module = doc.createElement('div');
            module.dataset.themeCell = 'luminous';
            host.append(module); c.append(el('h3', '', label), host); pair.append(c);
            applyCustomizationProfile(state, {moduleNodes: {vitals: module}});
            if (doc.documentElement.dataset.skin === 'paper') applySkin(module, 'paper', state);
            draw(module);
            return c;
        };
        cell('Current', module => {
            if (r.current.kind === 'versus') for (const v of r.current.versus) { const row = el('div', 'fig-gallery-versus'); module.append(row); renderVersusRow(row, v); module.append(el('pre', 'fig-text', versusText(v))); }
            else renderFigure(module, r.current.spec, {idPrefix: `${r.id}-current`, text: true});
        });
        cell('Draft', module => r.draw(module));
        section.append(note, pair);
        if (after) { after.after(section); after = section; } else main.append(section);
    }
}
