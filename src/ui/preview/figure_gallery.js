// Figure gallery (MDL7): every figure fixture in Luminous and Neutral, side by side with its text form.
// Same renderer and same path for every fixture; no game startup, no storage.
import {renderFigure} from '../figure.js';
import {applyCustomizationProfile, defaultCustomizationState, neutralPresentationSettings} from '../../customization_profiles.js';
import {FIGURE_FIXTURES} from './figure_fixtures.js';
import {FIXTURE_MANIFEST} from './fixtures/manifest.js';
import {mountStyleGuide} from './style_guide.js';
import {SKINS, applySkin} from './skins/paper.js';
import {mountCharacterSheetGallery} from './character_sheet_gallery.js'; queueMicrotask(() => mountCharacterSheetGallery(document.getElementById('fig_gallery')));
import {mountSkillsTabGallery} from './skills_tab_gallery.js'; queueMicrotask(() => mountSkillsTabGallery(document.getElementById('fig_gallery')));
import {mountLadderGroupsGallery} from './ladder_groups_gallery.js'; queueMicrotask(() => mountLadderGroupsGallery(document.getElementById('fig_gallery')));
import {mountRedesigns} from './redesign_gallery.js'; queueMicrotask(() => mountRedesigns(document.getElementById('fig_gallery')));
import {mountPeopleVariants} from './people_gallery.js'; queueMicrotask(() => mountPeopleVariants(document.getElementById('fig_gallery')));
import {mountPlacesVariants} from './places_gallery.js'; queueMicrotask(() => mountPlacesVariants(document.getElementById('fig_gallery')));

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
// Skin switch (COV13): the first column of every section and the style guide re-skin together; Neutral stays as the control. Luminous Gothic is the default.
const skin = params.get('skin') === 'paper' ? 'paper' : 'luminous';
document.documentElement.dataset.skin = skin;
const skinSelect = el('select', {id: 'fig_skin', 'aria-label': 'Skin'});
for (const [value, {label}] of Object.entries(SKINS)) { const o = el('option', {value}, `Skin: ${label}`); if (value === skin) o.selected = true; skinSelect.append(o); }
const skinCells = [];
skinSelect.addEventListener('change', () => {
    document.documentElement.dataset.skin = skinSelect.value;
    for (const {module, title} of skinCells) { applySkin(module, skinSelect.value, states.luminous); if (title) title.textContent = SKINS[skinSelect.value].label; }
});
bar.append(el('strong', {}, 'Figure gallery'), select, skinSelect);
const main = el('main', {id: 'fig_gallery'});
document.body.append(bar, main);
const guideSection = mountStyleGuide(main);
skinCells.push({module: guideSection.querySelector('[data-theme-cell]')}); applySkin(skinCells[0].module, skin, states.luminous);

// Fixtures register by import (FIGURE_FIXTURES) or export their own list; fixtures/manifest.js names each module; one id appears once.
const listed = [];
for (const [load, name] of FIXTURE_MANIFEST) { const mod = await load(); if (name) listed.push(...mod[name]); }
const GALLERY = [...new Map([...FIGURE_FIXTURES, ...listed].map(spec => [spec.id, spec])).values()];
for (const spec of GALLERY) {
    const section = el('section', {class: 'fig-gallery-section', 'data-fixture': spec.id});
    section.append(el('h2', {}, spec.title));
    const pair = el('div', {class: 'fig-gallery-pair'});
    for (const theme of ['luminous', 'neutral']) {
        const cell = el('div', {class: 'fig-gallery-cell'});
        const host = el('div', {class: 'theme-preview'}), module = el('div', {'data-theme-cell': theme});
        const title = el('h3', {}, theme === 'luminous' ? SKINS[skin].label : 'Neutral');
        host.append(module); cell.append(title, host);
        pair.append(cell);
        if (theme === 'luminous') { skinCells.push({module, title}); applySkin(module, skin, states.luminous); } else applyCustomizationProfile(states[theme], {moduleNodes: {vitals: module}});
        renderFigure(module, spec, {idPrefix: `${spec.id}-${theme}`, text: true});
    }
    section.append(pair);
    main.append(section);
}
// The character sheet, skills and ladder galleries mount their own Luminous cells; the skin switch covers them too.
await new Promise(resolve => setTimeout(resolve, 0));
for (const module of main.querySelectorAll('[data-theme-cell="luminous"]')) {
    if (skinCells.some(c => c.module === module)) continue;
    const title = module.closest('.fig-gallery-cell')?.querySelector(':scope > h3');
    skinCells.push({module, title: title && title.textContent === 'Luminous Gothic' ? title : null});
    if (skin === 'paper') applySkin(module, skin, states.luminous);
}
if (skin === 'paper') for (const {title} of skinCells) if (title) title.textContent = SKINS.paper.label;
