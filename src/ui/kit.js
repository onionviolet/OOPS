// The kit renderer (round 23, PS243-PS246; proposals). Features declare content and one renderer draws it: rows, verbs,
// numbers, chips and tooltip records, in the kit's shared forms (the round 14 kit page, PS171). A feature writes its
// own DOM only for a view the kit cannot express; when a second feature needs that view it becomes a kit form.
// The forms take only the fixed vocabulary (KIT_VOCABULARY; the kit block at the end of styles/ui_tokens.css), so features look like one game.
import {knownNumberNode} from './known_number.js';

/** PS244: the few values everything shares. CSS custom properties, defined in styles/ui_tokens.css (the kit block at its end). */
export const KIT_VOCABULARY = Object.freeze({
    space: Object.freeze(['--kit-gap-1', '--kit-gap-2', '--kit-gap-3', '--kit-gap-4', '--kit-gap-5']), // 4, 8, 12, 16, 24 at body size
    type: Object.freeze(['--ui-type-small', '--ui-type-body', '--ui-type-title', '--ui-type-heading']),
    border: '--kit-border',
    colour: Object.freeze(['--ui-text', '--ui-muted', '--ui-accent', '--ui-state-ready', '--ui-state-near', '--ui-state-far', '--ui-state-blocked']),
    states: Object.freeze(['empty', 'near', 'ready', 'running', 'unknown', 'crowded']),
});

let kitDoc = null;
/** Draw into another document (a card rendered into host.ownerDocument, MDL13). Pass null to return to the global one. */
export function useKitDocument(doc) { kitDoc = doc || null; }
export const kitElement = (tag, cls, text, doc) => el(tag, cls, text, doc);
const el = (tag, cls, text, doc = kitDoc || globalThis.document) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const tag = (node, data = {}) => { for (const [k, v] of Object.entries(data)) if (v != null) node.dataset[k] = String(v); return node; };

/** Give a native button the shared press response. Keep its key stable across a redraw. */
export function kitControl(button, key = button.textContent) {
    button.dataset.kitControl = key;
    return button;
}

/**
 * A row: an action (or a plain label), a fact and where it comes from.
 * {tag, state, label, action: {title, disabled, run}, fact, factClass, from, className, labelClass, factClassName, fromClass, data}
 */
export function kitRow({tag: t = 'div', state = '', label, action, fact = '', from = '', className = '', labelClass = '', factClass = '', fromClass = '', data = {}} = {}) {
    const row = tag(el(t, `kit-row${state ? ` kit-row--${state}` : ''}${className ? ` ${className}` : ''}`), {...data, kitState: state || null});
    const head = action ? el('button', `kit-row__label${labelClass ? ` ${labelClass}` : ''}`, label) : el('span', `kit-row__label${labelClass ? ` ${labelClass}` : ''}`, label);
    if (action) { kitControl(head, label); head.type = 'button'; head.title = action.title || label; head.disabled = !!action.disabled; if (action.run) head.addEventListener('click', action.run); }
    row.append(head, el('small', `kit-row__fact${factClass ? ` ${factClass}` : ''}`, fact), el('small', `kit-row__from${fromClass ? ` ${fromClass}` : ''}`, from));
    return row;
}

/** A verb: icon, label and an optional Ready mark ("2 ready · 1 close"). */
export function kitVerb({label, icon = '', mark = '', markState = '', run, className = ''} = {}) {
    const verb = el('button', `kit-verb${className ? ` ${className}` : ''}`); verb.type = 'button';
    if (icon) { const i = el('i', 'material-icons kit-verb__icon', icon); i.setAttribute('aria-hidden', 'true'); verb.append(i); }
    verb.append(el('span', 'kit-verb__label', label));
    if (mark) tag(verb, {readyMark: mark, readyMarkState: markState || null});
    if (run) verb.addEventListener('click', run);
    return kitControl(verb, label);
}

/** A number as the life knows it (PS130): plain, ~estimate, low–high or "?", naming its field. */
export function kitNumber(value, how = {}, {field = ''} = {}) { const n = knownNumberNode(value, how, {field}); n.classList.add('kit-number'); return n; }

/** A chip: a short label with an optional count; a pressed chip is a filter that is on. */
export function kitChip({label, count, pressed, run, className = ''} = {}) {
    const chip = el(run ? 'button' : 'span', `kit-chip${className ? ` ${className}` : ''}`, count != null ? `${label} · ${count}` : label);
    if (run) { kitControl(chip, label); chip.type = 'button'; chip.addEventListener('click', run); }
    if (pressed != null) chip.setAttribute('aria-pressed', String(!!pressed));
    return chip;
}

/** A tooltip record: a title, label/value lines and a closing note, drawn the same way everywhere. */
export function kitTooltip({title = '', lines = [], note = ''} = {}) {
    const tip = el('div', 'kit-tooltip'); tip.setAttribute('role', 'tooltip');
    if (title) tip.append(el('strong', 'kit-tooltip__title', title));
    if (lines.length) { const dl = el('dl', 'kit-tooltip__lines'); for (const {label, value} of lines) dl.append(el('dt', '', label), el('dd', '', value)); tip.append(dl); }
    if (note) tip.append(el('p', 'kit-tooltip__note', note));
    return tip;
}

// PS246: a kit page row per feature. A feature registers sample content for each state it can be in; the kit page
// (prototypes/ui-kit-2026-11-15/features.html) draws every feature through these same forms, side by side.
const features = new Map();
export function registerKitFeature({id, label, samples}) { if (!id || !label || !samples) throw Error('A kit feature needs an id, a label and samples by state.'); features.set(id, {id, label, samples}); }
export const kitFeatures = () => [...features.values()];

/** Draw each registered feature's states in one row per feature. A sample is {form, ...args} for one kit form. */
export function renderKitPage(host) {
    const forms = {row: kitRow, verb: kitVerb, chip: kitChip, tooltip: kitTooltip, number: s => kitNumber(s.value, s.how, s)};
    for (const f of kitFeatures()) {
        const line = el('section', 'kit-page__feature'); line.dataset.kitFeature = f.id; line.append(el('h3', 'kit-page__name', f.label));
        for (const state of KIT_VOCABULARY.states) {
            const cell = el('div', 'kit-page__cell'); cell.dataset.kitState = state; cell.append(el('small', 'kit-page__state', state));
            for (const s of [].concat(f.samples[state] || [])) cell.append(forms[s.form]?.(s) || el('span', '', '?'));
            line.append(cell);
        }
        host.append(line);
    }
    return host;
}
