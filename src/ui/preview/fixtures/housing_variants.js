// Housing variants H1-H3 (GALLERY_FORM_AUDIT_2026-10-30, "Round 2: housing"). Three blocky, abstract Luminous drafts of the
// same home data the current home strip draws (HOME_FIXTURES[0], read through homeOverviewModel). Proposals (AD32): nothing here
// touches home_view.js. No furniture icons and no printed text form; the text form sits behind "read as text" (L1).
// One illustrative overlay: the fixture has no locked room, so the guest room is marked locked here to show the third state.
// Invented names only (CLR3). Colour and spacing come from tokens in styles/redesign_drafts.css.
import {figureText} from '../../figure.js';
import {homeOverviewModel} from '../../../home_overview_model.js';
import {HOME_COTTAGE_VIEW, HOME_FIXTURES} from './homes.js';

const h = (host, tag, cls, text, attrs = {}) => {
    const n = host.ownerDocument.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== '') n.textContent = text;
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    return n;
};
const cap = text => text.charAt(0).toUpperCase() + text.slice(1);
const LOCKED = {'Fit a guest room': 'Needs the quiet study first.'};
const COMFORT_BANDS = ['Unfurnished', 'Simple shelter', 'Settled', 'Lived-in'];

/** One short word per block: the last word of the label once the verb and "room" are gone. */
export const shortWord = label => cap(label.replace(/^(Fit a |Restore )/, '').replace(/ room$/, '').split(' ').filter(Boolean).slice(-1)[0] || label);
const stateOf = (item, locked) => locked ? 'locked' : item.state === 'done' ? 'built' : item.state === 'empty' ? 'open' : item.state;

/** The home read as plain data for the three variants: same source as the current strip, so no fact moves. */
export function housingData(spec = HOME_FIXTURES[0], view = HOME_COTTAGE_VIEW) {
    const model = homeOverviewModel(view);
    const slot = (item, kind) => {
        const lock = LOCKED[item.label] || '';
        return {label: item.label, word: kind === 'fitting' ? shortWord(item.label.split(' ')[0]) : shortWord(item.label), state: stateOf(item, !!lock), kind,
            tip: lock ? `${item.label}: locked. ${lock}` : `${item.label}: ${item.note}`};
    };
    const fittings = spec.chips.find(c => c.id === 'fittings').items.map(i => slot(i, 'fitting'));
    const rooms = spec.chips.find(c => c.id === 'rooms').items.map(i => slot(i, 'room'));
    const up = id => model.upkeep.find(r => r.id === id);
    const comfortStep = Math.max(1, COMFORT_BANDS.indexOf(model.header.comfort.label) + 1);
    return {
        name: model.header.name, tenure: model.header.tenure.split(' · ')[0], comfort: model.header.comfort.label.toLowerCase(), fittings, rooms,
        meters: [
            {id: 'comfort', label: 'Comfort', big: String(model.header.comfort.score), word: model.header.comfort.label.toLowerCase(), lit: comfortStep, of: COMFORT_BANDS.length, tip: `Comfort ${model.header.comfort.score}: ${model.header.comfort.label}`},
            {id: 'upkeep', label: 'Upkeep', big: String(up('soundness').value), word: up('soundness').words.split(' · ')[1], lit: Math.round(up('soundness').value / 10), of: 10, tip: `Structure ${up('soundness').words}; dampness ${up('dampness').words}`},
            {id: 'storage', label: 'Storage', big: String(model.storage.used), word: `of ${model.storage.cap}`, lit: Math.ceil(model.storage.used / model.storage.cap * 10), of: 10, tip: model.storage.words},
        ],
        text: figureText(spec),
    };
}

/** L1: the text form is one click away. */
function withText(host, root, text) {
    const more = h(host, 'details', 'rd-text');
    more.append(h(host, 'summary', '', 'read as text'), h(host, 'pre', 'fig-text', text));
    root.append(more);
    return root;
}
const block = (host, item, cls = 'hv-block') => {
    const b = h(host, 'span', cls, '', {'data-state': item.state, title: item.tip, 'aria-label': item.tip});
    if (item.state === 'locked') b.tabIndex = 0;
    return b;
};
const headline = (host, d, rest = true) => {
    const p = h(host, 'p', 'hv-head');
    p.append(h(host, 'b', '', d.name));
    if (rest) p.append(`${d.tenure} · ${d.comfort}`);
    return p;
};

// H1: slot grid. Two rows of equal square blocks, a short word under each.
export function drawSlotGrid(host, d = housingData()) {
    const root = h(host, 'div', 'rd hv hv-h1');
    root.append(headline(host, d));
    for (const [title, items] of [['Rooms', d.rooms], ['Fittings', d.fittings]]) {
        const row = h(host, 'div', 'hv-row');
        row.append(h(host, 'h4', 'hv-rowname', title));
        const grid = h(host, 'div', 'hv-slots');
        for (const item of items) {
            const cell = h(host, 'div', 'hv-slot');
            cell.append(block(host, item), h(host, 'span', 'hv-word', item.word));
            grid.append(cell);
        }
        row.append(grid);
        root.append(row);
    }
    host.replaceChildren(withText(host, root, d.text));
}

// H2: block skyline. The built main house and side room are solid masses; unbuilt rooms stand as ghost blocks at the silhouette's edge.
// Fittings are pips inside the room block that holds them (study fitting inside the study).
export function drawSkyline(host, d = housingData()) {
    const root = h(host, 'div', 'rd hv hv-h2');
    root.append(headline(host, d));
    const sky = h(host, 'div', 'hv-sky');
    const pips = (items, cls) => { const g = h(host, 'span', cls); for (const f of items) g.append(block(host, f, 'hv-pip')); return g; };
    const room = word => d.rooms.find(r => r.word === word);
    const mass = (item, tall) => {
        const b = block(host, item, `hv-mass${tall ? ' hv-mass--tall' : ''}`);
        b.append(h(host, 'span', 'hv-word', item.word));
        return b;
    };
    const house = h(host, 'div', 'hv-col hv-col--house');
    const main = h(host, 'span', 'hv-mass hv-mass--house', '', {'data-state': 'built', title: `${d.name}: main house`});
    main.append(pips(d.fittings.filter(f => f.word !== 'Study'), 'hv-pips'));
    house.append(h(host, 'span', 'hv-roof', '', {'data-state': 'built'}), main);
    const side = h(host, 'div', 'hv-col');
    side.append(mass(room('Guest')), mass(room('Side')));
    const study = h(host, 'div', 'hv-col');
    const studyBlock = mass(room('Study'));
    studyBlock.append(pips(d.fittings.filter(f => f.word === 'Study'), 'hv-pips hv-pips--one'));
    study.append(mass(room('Cat')), studyBlock);
    sky.append(house, side, study);
    root.append(sky);
    host.replaceChildren(withText(host, root, d.text));
}

// H3: stat-first card. Comfort, upkeep and storage as three big segmented meters, then a thin strip of small blocks.
export function drawStatCard(host, d = housingData()) {
    const root = h(host, 'div', 'rd hv hv-h3');
    root.append(headline(host, d, false));
    const meters = h(host, 'div', 'hv-meters');
    for (const m of d.meters) {
        const row = h(host, 'div', 'hv-meter', '', {title: m.tip});
        const segs = h(host, 'span', 'hv-segs', '', {role: 'img', 'aria-label': m.tip});
        for (let i = 0; i < m.of; i++) segs.append(h(host, 'i', 'hv-seg', '', {'data-on': i < m.lit}));
        row.append(h(host, 'span', 'hv-label', m.label), h(host, 'b', 'hv-big', m.big), h(host, 'span', 'hv-say', m.word), segs);
        meters.append(row);
    }
    const strip = h(host, 'div', 'hv-strip');
    for (const [title, items] of [['Rooms', d.rooms], ['Fittings', d.fittings]]) {
        const group = h(host, 'div', 'hv-group');
        group.append(h(host, 'h4', 'hv-rowname', title));
        const run = h(host, 'span', 'hv-run');
        for (const item of items) run.append(block(host, item, 'hv-mini'));
        group.append(run);
        strip.append(group);
    }
    root.append(meters, strip);
    host.replaceChildren(withText(host, root, d.text));
}

export const HOUSING_VARIANTS = [
    {id: 'H1', title: 'Housing variant H1: slot grid', draw: drawSlotGrid},
    {id: 'H2', title: 'Housing variant H2: block skyline', draw: drawSkyline},
    {id: 'H3', title: 'Housing variant H3: stat-first card', draw: drawStatCard},
];
