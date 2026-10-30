// Home overview view (HB1-HB6). Draws homeOverviewModel() as plain DOM with the node's own document
// (pop-out safe, MDL13): a home switcher, a glance line, the room strip (shared figure primitive),
// upkeep meters with words, storage, weather, household, construction and next steps. Every fact is in
// words; marks and meters only repeat them (UR37). It performs no action: "Open Homes" hands off to
// the existing Homes panel, which owns every quote and commit (UIV4).
import {renderFigure} from './figure.js';
import {homeFigureSpec} from '../home_overview_model.js';

/** renderHomeView(node, model, {onSelect, onOpenHomes, idPrefix}). A null model empties the node. */
export function renderHomeView(node, model, {onSelect = null, onOpenHomes = null, idPrefix = 'home_view'} = {}) {
    const doc = node.ownerDocument;
    node.replaceChildren();
    if (!model) return;
    node.classList.add('home-view');
    const el = (tag, cls, text, attrs = {}) => {
        const e = doc.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined && text !== null) e.textContent = text;
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        return e;
    };
    if (model.empty) { node.append(el('p', 'home-view-empty', model.empty)); return; }

    if (model.homes.length > 1) {
        const bar = el('div', 'home-view-switch', undefined, {role: 'group', 'aria-label': 'Choose a home'});
        for (const h of model.homes) {
            const b = el('button', 'home-view-home', `${h.name}${h.here ? ' · here' : ''}${h.main ? ' · main' : ''}`, {type: 'button', 'data-home-id': h.id, 'aria-pressed': String(h.id === model.id)});
            b.addEventListener('click', () => { if (onSelect) onSelect(h.id); });
            bar.append(b);
        }
        node.append(bar);
    }

    const head = model.header;
    node.append(el('h3', 'home-view-name', head.name),
        el('p', 'home-view-glance', `${head.tenure} · ${head.comfort.label} · ${head.where}${head.usable ? '' : ' Services are unavailable to this body right now.'}`, {'data-home-glance': ''}));

    if (model.next.length) {
        const list = el('ul', 'home-view-next', undefined, {'aria-label': 'What to do next'});
        for (const n of model.next) list.append(el('li', 'home-view-chip', n.text, {'data-next': n.id}));
        node.append(list);
    }

    const spec = homeFigureSpec(model);
    const strip = el('div', 'home-view-strip', undefined, {'data-home-strip': ''});
    node.append(strip);
    renderFigure(strip, spec, {idPrefix: `${idPrefix}_${model.id}`});

    const section = (title, attr) => { const s = el('section', 'home-view-section', undefined, {'data-home-section': attr}); s.append(el('h4', 'home-view-heading', title)); node.append(s); return s; };
    const meterRow = (parent, row, extra = {}) => {
        const line = el('div', `home-view-meter-row${row.warn ? ' home-view-warn' : ''}`, undefined, {'data-meter': row.id});
        line.append(el('span', 'home-view-meter-label', row.label));
        const m = el('meter', 'home-view-meter', undefined, {min: 0, max: row.max, value: row.value, 'aria-label': `${row.label}: ${row.words}`, ...extra});
        line.append(m, el('span', 'home-view-meter-words', `${row.warn ? '! ' : ''}${row.words}`));
        parent.append(line);
    };

    const upkeep = section('Upkeep and space', 'upkeep');
    if (model.upkeep.length) for (const r of model.upkeep) meterRow(upkeep, r);
    else upkeep.append(el('p', 'home-view-note', 'This home keeps no structural wear of its own.'));
    meterRow(upkeep, {id: 'storage', label: 'Storage', value: model.storage.used, max: model.storage.cap, words: model.storage.words, warn: model.storage.warn});
    upkeep.append(el('p', 'home-view-note', model.weather.words, {'data-weather': model.weather.raining ? 'rain' : 'dry'}));

    if (model.construction.length || model.sites.length) {
        const work = section('Construction', 'construction');
        for (const c of model.construction) meterRow(work, {id: c.id, label: c.kind === 'build' ? 'Build' : c.kind === 'repair' ? 'Repair' : 'Weatherproof', value: c.value, max: c.max, words: c.words});
        for (const s of model.sites) work.append(el('p', 'home-view-note', s));
    }

    const who = section('Household', 'household');
    if (model.household.length) for (const r of model.household) who.append(el('p', 'home-view-line', r.text, {'data-household': r.id}));
    else who.append(el('p', 'home-view-note', 'Nobody else lives or works here.'));

    const foot = el('p', 'home-view-foot');
    const open = el('button', 'home-view-open', 'Open Homes to change anything', {type: 'button', 'data-open-homes': ''});
    open.addEventListener('click', () => { if (onOpenHomes) onOpenHomes(); });
    foot.append(open);
    node.append(foot);
}
