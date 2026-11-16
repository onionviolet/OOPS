// Look options and variants (round 22, PS232; Weibao 2026-11-15 on ps217: "Implement both and have the player choose, can
// leave border as default, lots of features can be like that"). A look option is a player's display choice between
// stylesheets: Display › Row style is Bordered (default) or Spacing. It is a browser display preference, like the other
// Display options: it never touches the save, carries across lives and switches at once. `?variant=<code>` still loads
// styles/variants/<code>.css on a test origin, so a mock can be compared in the real game before it becomes a choice.
import {registerPanelSettings, getDisplaySetting, subscribeDisplaySettings} from '../display_settings.js';

// Each entry: id, label, choices [[value, label]], default, and the stylesheet per choice ('' loads none). A later look
// choice registers here the same way.
export const LOOK_OPTIONS = Object.freeze([
    // PS266 presets (src/ui/look_presets.js applies them; changing any one choice reads as Custom).
    Object.freeze({id: 'preset', label: 'Preset', default: 'classic',
        choices: Object.freeze([['classic', 'Classic'], ['calm', 'Calm'], ['dense', 'Dense'], ['custom', 'Custom']]),
        sheets: Object.freeze({classic: '', calm: '', dense: '', custom: ''}),
        description: 'Classic is the original look. Calm uses spacing between rows, a still ready edge and dimmer light. Dense fits more rows with small text. Custom appears once you change any single choice.'}),
    // PS278: accessibility rides the same registry.
    Object.freeze({id: 'text', label: 'Text size', default: 'normal',
        choices: Object.freeze([['normal', 'Normal'], ['large', 'Large']]),
        sheets: Object.freeze({normal: '', large: 'styles/variants/text-large.css'}),
        description: 'Large uses the next crisp size of the letters everywhere, in place of the Appearance size.'}),
    Object.freeze({id: 'motion', label: 'Motion', default: 'full',
        choices: Object.freeze([['full', 'Explaining motion'], ['reduce', 'Reduce motion']]),
        sheets: Object.freeze({full: '', reduce: ''}),
        description: 'Bars ease, gains tick up and ready rows pulse once. Reduce stops all of it; your system\'s reduce-motion setting and Effects off also stop it.'}),
    Object.freeze({id: 'density', label: 'Density', default: 'comfortable',
        choices: Object.freeze([['comfortable', 'Comfortable'], ['dense', 'Dense']]),
        sheets: Object.freeze({comfortable: '', dense: 'styles/variants/dense.css'}),
        description: 'Dense tightens rows and gaps and uses small text, so more fits on screen.'}),
    Object.freeze({id: 'rows', label: 'Row style', default: 'bordered',
        choices: Object.freeze([['bordered', 'Bordered'], ['spacing', 'Spacing']]),
        sheets: Object.freeze({bordered: '', spacing: 'styles/variants/ps217.css'}),
        description: 'Bordered draws a frame around each row. Spacing separates rows with space and a thin line, and shows each skill on one line.'}),
    // PS206, PS222, PS289 (combat lane): where the fight tells what just happened. Reports (classic, default) carries every line;
    // the box can also keep its last six lines, or each card its own latest line with the whole fight folded in the box.
    // PS289 (Weibao 2026-11-16: "the old combat UI was better and more coherent"): Reports is the classic default.
    Object.freeze({id: 'fightLog', label: 'Fight log', default: 'reports',
        choices: Object.freeze([['reports', 'In Reports (classic)'], ['box', 'In the fight box'], ['cards', 'On each card']]),
        sheets: Object.freeze({reports: '', box: '', cards: ''}),
        description: 'Where a fight tells what just happened: in Reports under Combat, as the original game does; also the last six lines under the moves; or also each fighter\'s own latest line under its card.'}),
]);

/** Pure: the variant code from a query string, or '' when absent or not a plain code. */
export function variantFrom(search = '') {
    const code = new URLSearchParams(search).get('variant') || '';
    return /^[a-z0-9-]{1,32}$/.test(code) ? code : '';
}

/** Pure: the stylesheet a look option's choice loads ('' for none or an unknown choice). */
export const lookSheet = (option, choice) => option.sheets[choice] ?? '';

function sheetLink(doc, id, href) {
    let link = doc.getElementById(id);
    if (!href) { link?.remove(); return; }
    if (!link) { link = doc.createElement('link'); link.id = id; link.rel = 'stylesheet'; doc.head.append(link); }
    if (link.getAttribute('href') !== href) link.setAttribute('href', href);
}

let registered = false;
export function mountVariant({doc = globalThis.document, search = globalThis.location?.search || ''} = {}) {
    if (!doc) return '';
    if (!registered) {
        registered = true;
        registerPanelSettings({id: 'look', title: 'Look', settings: LOOK_OPTIONS.map(o => ({key: o.id, label: o.label, options: o.choices, default: o.default, description: o.description}))});
    }
    const apply = () => {
        for (const o of LOOK_OPTIONS) {
            const choice = getDisplaySetting(`panel.look.${o.id}`) ?? o.default;
            doc.documentElement.dataset[`look${o.id[0].toUpperCase()}${o.id.slice(1)}`] = choice;
            sheetLink(doc, `look_${o.id}_stylesheet`, lookSheet(o, choice));
        }
    };
    apply(); subscribeDisplaySettings(apply);
    const code = variantFrom(search);
    if (code) { sheetLink(doc, 'variant_stylesheet', `styles/variants/${code}.css`); doc.documentElement.dataset.variant = code; }
    return code;
}
