// Gallery section for the housing variants: the current home strip, then H1, H2 and H3, all Luminous (the paper skin is parked).
import {renderFigure} from '../figure.js';
import {applyCustomizationProfile, defaultCustomizationState} from '../../customization_profiles.js';
import {HOME_FIXTURES} from './fixtures/homes.js';
import {HOUSING_VARIANTS} from './fixtures/housing_variants.js';

export function mountHousingVariants(main) {
    const doc = main.ownerDocument, state = defaultCustomizationState();
    const el = (tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    const section = el('section', 'fig-gallery-section'); section.dataset.fixture = 'housing-variants';
    section.append(el('h2', '', 'Housing variants H1, H2, H3 (Luminous)'),
        el('p', 'sg-note', 'Proposal. Same home data as the strip on the left. Blocks only, no drawn furniture; the text form is behind "read as text". Hover a block for its reason.'));
    const row = el('div', 'hv-compare');
    const cell = (label, draw) => {
        const c = el('div', 'fig-gallery-cell'), host = el('div', 'theme-preview'), module = doc.createElement('div');
        module.dataset.themeCell = 'luminous';
        host.append(module); c.append(el('h3', '', label), host); row.append(c);
        applyCustomizationProfile(state, {moduleNodes: {vitals: module}});
        draw(module);
    };
    cell('Current home strip', module => renderFigure(module, HOME_FIXTURES[0], {idPrefix: 'housing-current'}));
    for (const v of HOUSING_VARIANTS) cell(v.title, module => v.draw(module));
    section.append(row);
    const anchor = main.querySelector('[data-fixture="redesign-home"]');
    if (anchor) anchor.after(section); else main.append(section);
}
