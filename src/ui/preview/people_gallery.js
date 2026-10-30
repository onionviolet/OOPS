// Gallery sections for the people variants: for each aspect the current figures, then three Luminous variants (the paper skin is parked).
import {renderFigure} from '../figure.js';
import {applyCustomizationProfile, defaultCustomizationState} from '../../customization_profiles.js';
import {PEOPLE_ASPECTS} from './fixtures/people_variants.js';

export function mountPeopleVariants(main) {
    const doc = main.ownerDocument, state = defaultCustomizationState();
    const el = (tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    for (const aspect of PEOPLE_ASPECTS) {
        const section = el('section', 'fig-gallery-section'); section.dataset.fixture = aspect.id;
        section.append(el('h2', '', aspect.title), el('p', 'sg-note', `Proposal. ${aspect.note} Blocks only; the text form is behind "read as text". Hover a block for its fact.`));
        const row = el('div', 'ppl-compare');
        const cell = (label, draw) => {
            const c = el('div', 'fig-gallery-cell'), host = el('div', 'theme-preview'), module = doc.createElement('div');
            module.dataset.themeCell = 'luminous';
            host.append(module); c.append(el('h3', '', label), host); row.append(c);
            applyCustomizationProfile(state, {moduleNodes: {vitals: module}});
            draw(module);
        };
        cell('Current', module => {
            const stack = el('div', 'ppl-current');
            module.append(stack);
            aspect.current.forEach((spec, i) => { const part = el('div'); stack.append(part); renderFigure(part, spec, {idPrefix: `${aspect.id}-cur-${i}`, text: true}); });
        });
        for (const v of aspect.variants) cell(v.title, module => v.draw(module));
        section.append(row);
        main.append(section);
    }
}
