// Gathering view (GS1-GS6). Draws gatheringModel() as plain DOM with the node's own document (pop-out safe, MDL13):
// a glance line, then one shared figure of non-node forms (site table, season band, chips, bars). It performs no
// action: the hand-off opens the panel that owns gathering and its quote, so one source decides every cost (UIV4).
import {renderFigure} from './figure.js';
import {gatheringFigureSpec} from '../gathering_model.js';

/** renderGatheringView(node, model, {onOpen, openLabel, idPrefix}). A null model empties the node. */
export function renderGatheringView(node, model, {onOpen = null, openLabel = 'Open the workshop to gather', idPrefix = 'gathering_view'} = {}) {
    const doc = node.ownerDocument;
    node.replaceChildren();
    if (!model) return;
    node.classList.add('gathering-view');
    const el = (tag, cls, text, attrs = {}) => {
        const e = doc.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined && text !== null) e.textContent = text;
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        return e;
    };
    if (model.empty) { node.append(el('p', 'gathering-view-empty', model.empty)); return; }
    node.append(el('h3', 'gathering-view-name', model.place || 'Gathering here'), el('p', 'gathering-view-glance', model.glance, {'data-gather-glance': ''}));
    const figure = el('div', 'gathering-view-figure', undefined, {'data-gather-figure': ''});
    node.append(figure);
    renderFigure(figure, gatheringFigureSpec(model, {id: `${idPrefix}_fig`}), {idPrefix});
    if (onOpen) {
        const foot = el('p', 'gathering-view-foot');
        const open = el('button', 'gathering-view-open', openLabel, {type: 'button', 'data-open-gathering': ''});
        open.addEventListener('click', () => onOpen());
        foot.append(open);
        node.append(foot);
    }
}
