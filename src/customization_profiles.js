import {COMPONENT_THEMES, componentThemeTokens} from './component_themes.js';
// Presentation data only. Never advances clocks or changes character rules.
const seasons = ['spring', 'summer', 'autumn', 'winter'];
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const record = value => value && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const fail = message => { throw new Error(`Presentation profile: ${message}`); };
const choice = (value, choices, label) => choices.includes(value) ? value : fail(`invalid ${label}`);
const number = (value, min, max, label) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max ? value : fail(`invalid ${label}`);
const color = value => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value) ? value : fail('colors require #RRGGBB');
const keys = (value, allowed) => { if (!record(value) || Object.keys(value).some(key => !allowed.includes(key))) fail('unknown or malformed fields'); };
export const CUSTOMIZATION_MODULES = ['ledger', 'crafting', 'local-actions', 'vitals', 'preparation', 'belongings', 'records', 'time', 'location', 'skills', 'messages', 'notebook', 'customization', 'status-window'];
export const EFFECT_MODULES = ['ledger', 'crafting', 'skills'];
export function defaultPresentationSettings() {
    return {componentTheme: 'neutral', typography: {font: 'system', size: 14}, palette: {background: '#1c243b', text: '#f1f2f5', accent: '#9bb4ae'}, spacing: 8, effects: 'reduced', sound: false, presentation: 'inline', effectDefinition: {motif: 'receipt', duration: 1800, color: '#b8d8cf', background: '#162127', static: false, plain: false}};
}
export function defaultCustomizationState() {
    return {schema: 1, active: 'Default', theme: {mode: 'off', season: 'spring'}, profiles: {Default: {settings: defaultPresentationSettings(), modules: {}}}};
}
export function validatePresentationSettings(input, partial = false) {
    const allowed = ['componentTheme', 'typography', 'palette', 'spacing', 'effects', 'sound', 'presentation', 'effectDefinition'];
    keys(input, allowed);
    if (!partial && allowed.filter(key => key !== 'componentTheme').some(key => !own(input, key))) fail('missing settings');
    const result = partial ? {} : {componentTheme: 'neutral'};
    for (const [key, value] of Object.entries(input)) {
        if (key === 'componentTheme') result[key] = choice(value, Object.keys(COMPONENT_THEMES), 'component theme');
        if (key === 'typography') {
            keys(value, ['font', 'size']);
            if (!partial && (!own(value,'font') || !own(value,'size'))) fail('incomplete typography');
            result[key] = {};
            if (own(value,'font')) result[key].font = choice(value.font, ['system','serif','mono'], 'font');
            if (own(value,'size')) result[key].size = number(value.size, 10, 28, 'font size');
        }
        if (key === 'palette') {
            keys(value, ['background','text','accent']); result[key] = {};
            for (const field of ['background','text','accent']) {
                if (own(value,field)) result[key][field] = color(value[field]);
                else if (!partial) fail('incomplete palette');
            }
        }
        if (key === 'spacing') result[key] = number(value, 0, 32, 'spacing');
        if (key === 'effects') result[key] = choice(value, ['off','reduced','full'], 'effects');
        if (key === 'sound') { if (typeof value !== 'boolean') fail('invalid sound'); result[key] = value; }
        if (key === 'presentation') result[key] = choice(value, ['inline','margin'], 'presentation');
        if (key === 'effectDefinition') {
            const fields = ['motif','duration','color','background','static','plain']; keys(value, fields); result[key] = {};
            for (const field of fields) {
                if (!own(value,field)) { if (!partial) fail('incomplete effect definition'); continue; }
                if (field === 'motif') result[key][field] = choice(value[field], ['receipt','seal','guidance','closing'], 'motif');
                else if (field === 'duration') result[key][field] = number(value[field], 200, 10000, 'effect duration');
                else if (field === 'color' || field === 'background') result[key][field] = color(value[field]);
                else { if (typeof value[field] !== 'boolean') fail('invalid effect modes'); result[key][field] = value[field]; }
            }
        }
    }
    return result;
}
export function validateCustomizationState(input) {
    if (input == null) return defaultCustomizationState();
    keys(input, ['schema','active','theme','profiles']);
    if (input.schema !== 1) fail('unsupported schema');
    keys(input.theme, ['mode','season']);
    const theme = {mode: choice(input.theme.mode, ['off','automatic','manual'], 'theme mode'), season: choice(input.theme.season, seasons, 'season')};
    if (!record(input.profiles) || Object.keys(input.profiles).length < 1 || Object.keys(input.profiles).length > 20) fail('requires 1–20 named profiles');
    const profiles = {};
    for (const [name, profile] of Object.entries(input.profiles)) {
        if (!/^[\w -]{1,40}$/.test(name) || ['__proto__','constructor','prototype'].includes(name)) fail('invalid profile name');
        keys(profile, ['settings','modules']);
        if (!record(profile.modules) || Object.keys(profile.modules).length > 50) fail('invalid module overrides');
        const modules = {};
        for (const [id, settings] of Object.entries(profile.modules)) {
            if (!CUSTOMIZATION_MODULES.includes(id)) fail('unsupported native module id');
            if(!EFFECT_MODULES.includes(id)&&Object.keys(settings).some(key=>!['componentTheme','typography','palette','spacing'].includes(key)))fail('this module supports typography, palette and spacing only');
            modules[id] = validatePresentationSettings(settings, true);
        }
        profiles[name] = {settings: validatePresentationSettings(profile.settings), modules};
    }
    if (typeof input.active !== 'string' || !own(profiles, input.active)) fail('active profile is missing');
    return {schema: 1, active: input.active, theme, profiles};
}
export function resolveCustomizationSeason(theme, nativeSeason) {
    if (theme.mode === 'off') return null;
    if (theme.mode === 'manual') return theme.season;
    const season = String(nativeSeason ?? '').toLowerCase();
    return seasons.includes(season) ? season : null;
}
const seasonal = {spring: '#afd3a6', summer: '#edca80', autumn: '#dca176', winter: '#a3c7df'};
const seasonalBackground = {spring:'#20322b',summer:'#302b24',autumn:'#352820',winter:'#182b3b'};
export function mergePresentationSettings(base, override = {}) {
    return {...base, ...override,
        typography: {...base.typography, ...override.typography},
        palette: {...base.palette, ...override.palette},
        effectDefinition: {...base.effectDefinition, ...override.effectDefinition}};
}
export function getCustomizationSettings(state, moduleId, {season} = {}) {
    const valid = validateCustomizationState(state), profile = valid.profiles[valid.active];
    const settings = mergePresentationSettings(profile.settings, profile.modules[moduleId]);
    const resolvedSeason = resolveCustomizationSeason(valid.theme, season);
    // Explicit module palettes remain exact even when the profile uses a season.
    return {...settings, palette: {...settings.palette, ...(resolvedSeason && !own(profile.modules[moduleId]?.palette || {}, 'accent') ? {accent: seasonal[resolvedSeason]} : {}), ...(resolvedSeason && !own(profile.modules[moduleId]?.palette || {}, 'background') ? {background:seasonalBackground[resolvedSeason]} : {})}, resolvedSeason};
}
const keyboardTabBars = new WeakSet();
function qualifyNativeTabs(node) {
    const bars = [node, ...node.querySelectorAll?.('.activable_buttons') || []].filter(bar => bar.classList?.contains?.('activable_buttons'));
    for (const bar of bars) {
        for (const control of bar.children) {
            if (control.tagName !== 'DIV' || !control.hasAttribute?.('onclick')) continue;
            control.setAttribute('role','button'); control.tabIndex = 0;
            control.setAttribute('aria-pressed',String(control.classList.contains('active_selection_button')));
        }
        if (!keyboardTabBars.has(bar)) {
            keyboardTabBars.add(bar);
            bar.addEventListener('click', () => { for (const control of bar.children) if (control.getAttribute('role') === 'button') control.setAttribute('aria-pressed',String(control.classList.contains('active_selection_button'))); });
            bar.addEventListener('keydown', event => {
                const control = event.target;
                if (control.parentElement !== bar || control.tagName !== 'DIV' || !['Enter',' '].includes(event.key)) return;
                event.preventDefault(); if (control.getAttribute('aria-disabled') !== 'true') control.click();
            });
        }
    }
}
export function applyCustomizationProfile(state, {season, moduleNodes = {}} = {}) {
    const valid = validateCustomizationState(state);
    const entries = moduleNodes instanceof Map ? moduleNodes.entries() : Object.entries(moduleNodes);
    for (const [id, nodes] of entries) for (const node of (Array.isArray(nodes) ? nodes : [nodes])) {
        if (!node?.style) continue;
        const settings = getCustomizationSettings(valid, id, {season});
        node.classList.add('customization-module');
        qualifyNativeTabs(node);
        node.dataset.componentTheme = settings.componentTheme || 'neutral';
        node.dataset.customizationSeason = settings.resolvedSeason || 'off';
        const vars = {'--custom-font': {system: 'var(--ui-font)', serif: 'Georgia, serif', mono: 'monospace'}[settings.typography.font], '--custom-size': `${settings.typography.size}px`, '--custom-spacing': `${settings.spacing}px`, '--custom-background': settings.palette.background, '--custom-text': settings.palette.text, '--custom-accent': settings.palette.accent};
        Object.assign(vars, componentThemeTokens(settings));
        node.dataset.contrastRecovered = vars['--theme-contrast-recovered'];
        // A player-chosen or seasonal palette stays authoritative over display schemes such as Vivid.
        const base = defaultPresentationSettings().palette;
        node.dataset.customPalette = String(['background','text','accent'].some(key => settings.palette[key] !== base[key]));
        for (const [name, value] of Object.entries(vars)) node.style.setProperty(name, value);
    }
    return valid;
}
