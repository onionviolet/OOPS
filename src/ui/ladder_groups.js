// Several ladders and the path picker as DOM (ability_ladders.js builds the models). Presentation only; every figure keeps its text form.
import {renderFigure} from './figure.js';
import {pathPickerText} from '../ability_ladders.js';

export function renderLadderGroups(host, groups) {
    const doc = host.ownerDocument, el = (tag, text, attrs = {}) => { const n = doc.createElement(tag); if (text != null) n.textContent = text; for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; };
    host.replaceChildren();
    for (const group of groups) {
        const section = el('section', null, {class: 'ladder-group', 'data-ladder-system': group.system});
        section.append(el('h3', group.system));
        for (const l of group.ladders) {
            const box = el('div', null, {class: 'ladder-entry', 'data-ladder-source': l.source}), fig = el('div');
            box.append(el('h4', l.sourceWord), fig); section.append(box);
            renderFigure(fig, l.spec, {idPrefix: `lg-${l.spec.id}`});
        }
        host.append(section);
    }
}

export function renderPathPicker(host, rows) {
    const doc = host.ownerDocument; host.replaceChildren();
    const pre = doc.createElement('pre'); pre.className = 'fig-text'; pre.textContent = pathPickerText(rows); host.append(pre);
}
