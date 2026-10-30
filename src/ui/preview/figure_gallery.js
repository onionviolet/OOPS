// Figure gallery (MDL7): every figure fixture in Luminous and Neutral, side by side with its text form.
// Same renderer and same path for every fixture; no game startup, no storage.
import {renderFigure} from '../figure.js';
import {applyCustomizationProfile, defaultCustomizationState, neutralPresentationSettings} from '../../customization_profiles.js';
import {FIGURE_FIXTURES} from './figure_fixtures.js';
import './fixtures/abilities.js'; // RPX5 advancement ladders register into FIGURE_FIXTURES
import './fixtures/rituals.js'; // registers RPX1/RPX2 fixtures
import {FAMILY_FIXTURES} from './fixtures/family_tree.js';
import './fixtures/combat.js';
import {MAP_FIXTURES} from './fixtures/maps.js';
import {mountCharacterSheetGallery} from './character_sheet_gallery.js'; queueMicrotask(() => mountCharacterSheetGallery(document.getElementById('fig_gallery')));
import {BODY_FIXTURES} from './fixtures/body.js'; FIGURE_FIXTURES.push(...BODY_FIXTURES);
import './fixtures/knowledge.js';

const el = (tag, attrs = {}, text = '') => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text) n.textContent = text; return n; };
const states = {luminous: defaultCustomizationState(), neutral: defaultCustomizationState()};
states.neutral.profiles.Default.settings = neutralPresentationSettings();
delete states.neutral.profiles.Default.modules.messages;

const params = new URLSearchParams(location.search);
const effects = ['full', 'reduced', 'off'].includes(params.get('effects')) ? params.get('effects') : 'full';
document.documentElement.dataset.effects = effects;
document.body.classList.add('fig-gallery-page');

const bar = el('nav', {class: 'fig-gallery-bar', 'aria-label': 'Gallery controls'});
const select = el('select', {id: 'fig_effects', 'aria-label': 'Effects'});
for (const value of ['full', 'reduced', 'off']) { const o = el('option', {value}, `Effects: ${value}`); if (value === effects) o.selected = true; select.append(o); }
select.addEventListener('change', () => { document.documentElement.dataset.effects = select.value; });
bar.append(el('strong', {}, 'Figure gallery'), select);
const main = el('main', {id: 'fig_gallery'});
document.body.append(bar, main);

for (const spec of [...FIGURE_FIXTURES, ...FAMILY_FIXTURES]) {
for (const spec of [...FIGURE_FIXTURES, ...MAP_FIXTURES]) {
    const section = el('section', {class: 'fig-gallery-section', 'data-fixture': spec.id});
    section.append(el('h2', {}, spec.title));
    const pair = el('div', {class: 'fig-gallery-pair'});
    for (const theme of ['luminous', 'neutral']) {
        const cell = el('div', {class: 'fig-gallery-cell'});
        const host = el('div', {class: 'theme-preview'}), module = el('div', {'data-theme-cell': theme});
        host.append(module); cell.append(el('h3', {}, theme === 'luminous' ? 'Luminous Gothic' : 'Neutral'), host);
        pair.append(cell);
        applyCustomizationProfile(states[theme], {moduleNodes: {vitals: module}});
        renderFigure(module, spec, {idPrefix: `${spec.id}-${theme}`, text: true});
    }
    section.append(pair);
    main.append(section);
}
