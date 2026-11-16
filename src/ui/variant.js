// Look options and variants (round 22, PS232; Weibao 2026-11-15 on ps217: "Implement both and have the player choose, can
// leave border as default, lots of features can be like that"). A look option is a player's display choice between
// stylesheets: Display › Row style is Bordered (default) or Spacing. It is a browser display preference, like the other
// Display options: it never touches the save, carries across lives and switches at once. `?variant=<code>` still loads
// styles/variants/<code>.css on a test origin, so a mock can be compared in the real game before it becomes a choice.
import {registerPanelSettings, getDisplaySetting, subscribeDisplaySettings} from '../display_settings.js';

// Each entry: id, label, choices [[value, label]], default, and the stylesheet per choice ('' loads none). A later look
// choice registers here the same way.
export const LOOK_OPTIONS = Object.freeze([
    Object.freeze({id: 'rows', label: 'Row style', default: 'bordered',
        choices: Object.freeze([['bordered', 'Bordered'], ['spacing', 'Spacing']]),
        sheets: Object.freeze({bordered: '', spacing: 'styles/variants/ps217.css'}),
        description: 'Bordered draws a frame around each row. Spacing separates rows with space and a thin line, and shows each skill on one line.'}),
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
