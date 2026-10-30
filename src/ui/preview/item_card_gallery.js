// Item card gallery: every fixture in Luminous and Neutral beside its text form. No game startup, no storage.
import {renderItemCard} from '../item_card.js';
import {itemCardModel} from '../../item_card_model.js';
import {applyCustomizationProfile, defaultCustomizationState, neutralPresentationSettings} from '../../customization_profiles.js';
import {ITEM_CARD_FIXTURES} from './item_card_fixtures.js';

const el = (tag, attrs = {}, text = '') => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text) n.textContent = text; return n; };
const states = {luminous: defaultCustomizationState(), neutral: defaultCustomizationState()};
states.neutral.profiles.Default.settings = neutralPresentationSettings();
delete states.neutral.profiles.Default.modules.messages;
const effects = ['full', 'reduced', 'off'].includes(new URLSearchParams(location.search).get('effects')) ? new URLSearchParams(location.search).get('effects') : 'full';
document.documentElement.dataset.effects = effects;
document.body.classList.add('fig-gallery-page');
const main = el('main', {id: 'item_gallery'});
document.body.append(el('nav', {class: 'fig-gallery-bar'}, 'Item card gallery'), main);
for (const fx of ITEM_CARD_FIXTURES) {
    const section = el('section', {class: 'fig-gallery-section', 'data-fixture': fx.id});
    section.append(el('h2', {}, fx.title));
    const pair = el('div', {class: 'fig-gallery-pair'});
    for (const theme of ['luminous', 'neutral']) {
        const cell = el('div', {class: 'fig-gallery-cell'}), host = el('div', {class: 'theme-preview'}), module = el('div', {'data-theme-cell': theme});
        host.append(module); cell.append(el('h3', {}, theme === 'luminous' ? 'Luminous Gothic' : 'Neutral'), host); pair.append(cell);
        applyCustomizationProfile(states[theme], {moduleNodes: {vitals: module}});
        renderItemCard(module, itemCardModel(fx.item, fx.worn, fx.info));
    }
    section.append(pair); main.append(section);
}
