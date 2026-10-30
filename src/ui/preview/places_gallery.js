// Gallery section for the places variants (R2-1): the current form, then three Luminous variants, for gathering (Bloom and Fall) and walks.
// The paper skin is parked, so every cell is Luminous.
import {renderFigure} from '../figure.js';
import {applyCustomizationProfile, defaultCustomizationState} from '../../customization_profiles.js';
import {gatheringFigureSpec, gatheringModel} from '../../gathering_model.js';
import {PLACES_VARIANTS, GATHER_BLOOM_VIEW, GATHER_FALL_VIEW, gatherData} from './fixtures/places_variants.js';
import {WALK_MAP_FIXTURE} from './fixtures/maps.js';

export function mountPlacesVariants(main) {
    const doc = main.ownerDocument, state = defaultCustomizationState();
    const el = (tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    const cell = (row, label, draw, id) => {
        const c = el('div', 'fig-gallery-cell'), host = el('div', 'theme-preview'), module = doc.createElement('div');
        module.dataset.themeCell = 'luminous'; if (id) c.dataset.variant = id;
        host.append(module); c.append(el('h3', '', label), host); row.append(c);
        applyCustomizationProfile(state, {moduleNodes: {vitals: module}});
        draw(module);
    };
    const part = (fixture, title, note, rows) => {
        const section = el('section', 'fig-gallery-section'); section.dataset.fixture = fixture;
        section.append(el('h2', '', title), el('p', 'sg-note', note));
        for (const [key, row] of rows) { const r = el('div', 'pv-compare'); r.dataset.row = key; row(r); section.append(r); }
        main.append(section);
    };
    const gatherRow = (view, id, name) => r => {
        cell(r, `Current gathering (${name})`, m => renderFigure(m, gatheringFigureSpec(gatheringModel(view), {id: `${id}-cur`, title: 'Gathering'}), {idPrefix: `${id}-cur`}), 'current');
        for (const v of PLACES_VARIANTS.gathering) cell(r, v.title, m => v.draw(m, gatherData(view, id)), v.id);
    };
    part('places-gathering', 'Gathering variants G1, G2, G3 (Luminous)',
        'Proposal. Same Willow bank data as the current figure. Filled block = open or in stock, hairline = gated or coming back, dim = out of season or gone. The text form is behind "read as text".',
        [['bloom', gatherRow(GATHER_BLOOM_VIEW, 'pv-bloom', 'Bloom')], ['fall', gatherRow(GATHER_FALL_VIEW, 'pv-fall', 'Fall, depleted')]]);
    part('places-walks', 'Walks variants W1, W2, W3 (Luminous)',
        'Proposal. Same walks from Lamplighters\' hall as the current map. Filled block = walk open, hairline = blocked now. The text form is behind "read as text".',
        [['walks', r => {
            cell(r, 'Current walk map', m => renderFigure(m, WALK_MAP_FIXTURE, {idPrefix: 'pv-walk-cur'}), 'current');
            for (const v of PLACES_VARIANTS.walks) cell(r, v.title, m => v.draw(m), v.id);
        }]]);
}
