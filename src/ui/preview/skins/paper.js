// Paper and ink skin (COV13): a second look for the figure gallery only. It rides the same component-theme mechanism as
// Luminous Gothic: a node carries data-component-theme, and styles/ui_tokens.css supplies the --theme-* roles the figures read.
// "paper" is deliberately not in COMPONENT_THEMES, so Appearance does not list it. To expose it later, add one entry there
// (label, background, text, accent, radius, heading) and drop the inline-token strip below; nothing else changes.
import {applyCustomizationProfile, defaultCustomizationState, neutralPresentationSettings} from '../../../customization_profiles.js';

export const SKINS = {luminous: {label: 'Luminous Gothic'}, paper: {label: 'Paper and ink'}};

/** The profile validators only know listed themes, so paper rides on Neutral for validation and then takes its own tokens from CSS. */
export function paperCustomizationState() {
    const state = defaultCustomizationState();
    state.profiles.Default.settings = {...neutralPresentationSettings(), typography: {font: 'serif', size: 14}, effects: 'reduced'};
    delete state.profiles.Default.modules.messages;
    return state;
}

/** Puts a gallery node in the named skin. 'luminous' is the shipped default profile; 'paper' strips the inline theme tokens so the CSS tokens apply. */
export function applySkin(node, skin, luminousState = defaultCustomizationState()) {
    if (skin !== 'paper') { applyCustomizationProfile(luminousState, {moduleNodes: {vitals: node}}); return; }
    applyCustomizationProfile(paperCustomizationState(), {moduleNodes: {vitals: node}});
    for (const name of [...node.style]) if (name.startsWith('--theme-') || name.startsWith('--custom-')) node.style.removeProperty(name);
    node.dataset.componentTheme = 'paper';
}
