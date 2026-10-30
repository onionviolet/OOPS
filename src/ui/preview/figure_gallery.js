// Figure gallery (MDL7): every figure fixture in Luminous and Neutral, side by side with its text form.
// Same renderer and same path for every fixture; no game startup, no storage.
import {renderFigure} from '../figure.js';
import {applyCustomizationProfile, defaultCustomizationState, neutralPresentationSettings} from '../../customization_profiles.js';
import {FIGURE_FIXTURES} from './figure_fixtures.js';
import {FIXTURE_MANIFEST} from './fixtures/manifest.js';
import {mountFormSwitch} from '../figure_forms.js';
import {mountStyleGuide} from './style_guide.js';
import {mountCharacterSheetGallery} from './character_sheet_gallery.js'; queueMicrotask(() => mountCharacterSheetGallery(document.getElementById('fig_gallery')));
import {mountSkillsTabGallery} from './skills_tab_gallery.js'; queueMicrotask(() => mountSkillsTabGallery(document.getElementById('fig_gallery')));
import {mountLadderGroupsGallery} from './ladder_groups_gallery.js'; queueMicrotask(() => mountLadderGroupsGallery(document.getElementById('fig_gallery')));

const el = (tag, attrs = {}, text = '') => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text) n.textContent = text; return n; };
const states = {luminous: defaultCustomizationState(), neutral: defaultCustomizationState()};
states.neutral.profiles.Default.settings = neutralPresentationSettings();
delete states.neutral.profiles.Default.modules.messages;

const params = new URLSearchParams(location.search);
{ const textSize = Number(params.get('size')); if ([14, 17.5, 21].includes(textSize)) for (const state of Object.values(states)) state.profiles.Default.settings.typography.size = textSize; } // evidence at 14 and 21 px text
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
mountStyleGuide(main);

// Fixtures register by import (FIGURE_FIXTURES) or export their own list; fixtures/manifest.js names each module; one id appears once.
const listed = [];
for (const [load, name] of FIXTURE_MANIFEST) { const mod = await load(); if (name) listed.push(...mod[name]); }
const GALLERY = [...new Map([...FIGURE_FIXTURES, ...listed].map(spec => [spec.id, spec])).values()];
// ?only=<fixture id> draws one fixture; ?form=web|table|matrix|sentences wraps each figure in the form switch with the interaction layer (bk-forms).
const only = params.get('only'), formParam = params.get('form');
for (const spec of GALLERY.filter(item => !only || item.id === only)) {
    const section = el('section', {class: 'fig-gallery-section', 'data-fixture': spec.id});
    section.append(el('h2', {}, spec.title));
    const pair = el('div', {class: 'fig-gallery-pair'});
    for (const theme of ['luminous', 'neutral']) {
        const cell = el('div', {class: 'fig-gallery-cell'});
        const host = el('div', {class: 'theme-preview'}), module = el('div', {'data-theme-cell': theme});
        host.append(module); cell.append(el('h3', {}, theme === 'luminous' ? 'Luminous Gothic' : 'Neutral'), host);
        pair.append(cell);
        applyCustomizationProfile(states[theme], {moduleNodes: {vitals: module}});
        if (formParam === 'webplain') renderFigure(module, spec, {idPrefix: `${spec.id}-${theme}`}); // the figure alone, no switch, no interaction layer
        else if (formParam) mountFormSwitch(module, spec, {idPrefix: `${spec.id}-${theme}`, initial: formParam, forms: ['web', 'table', 'matrix', 'sentences']});
        else renderFigure(module, spec, {idPrefix: `${spec.id}-${theme}`, text: true});
    }
    section.append(pair);
    main.append(section);
}
