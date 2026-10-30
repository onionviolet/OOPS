// Places variants (GALLERY_FORM_AUDIT_2026-10-30, "Round 2: places (R2-1)"): three blocky, abstract Luminous drafts each for gathering (GF30)
// and walks (GF22), from the same views the current fixtures read. Proposals (AD32): nothing here touches the live gathering or walk views.
// Block vocabulary shared with housing and people: filled glowing block = have or open, hairline block = possible or coming, dim hatched = locked or depleted.
// No drawn icons and no printed text form; the text form sits behind "read as text" (L1). Invented names only (CLR3). Colour and spacing are tokens in styles/places_variants.css.
import {figureText} from '../../figure.js';
import {gatheringModel, gatheringFigureSpec} from '../../../gathering_model.js';
import {GATHER_BLOOM_VIEW, GATHER_FALL_VIEW} from './gathering.js';
import {WALK_MAP_VIEW, WALK_MAP_FIXTURE} from './maps.js';

const h = (host, tag, cls, text, attrs = {}) => {
    const n = host.ownerDocument.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== '') n.textContent = text;
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    return n;
};
const cell = (host, state, tip, cls = 'pv-cell', text) => h(host, 'span', cls, text, {'data-state': state, title: tip, 'aria-label': tip});
function withText(host, root, text) {
    const more = h(host, 'details', 'rd-text');
    more.append(h(host, 'summary', '', 'read as text'), h(host, 'pre', 'fig-text', text));
    root.append(more);
    return root;
}

/** Gathering read as plain data. Yield states: lit = open now, soon = hour or tool gate, dim = out of season, veil = not gathered here yet. */
export function gatherData(view = GATHER_BLOOM_VIEW, id = 'gather-bloom') {
    const model = gatheringModel(view), season = model.season;
    const yieldState = (y, gathered) => !gathered ? 'veil' : y.openNow ? 'lit'
        : season && y.openSeasons && !y.openSeasons.includes(season.id) ? 'dim' : 'soon';
    const sites = model.sites.map(s => {
        const closed = s.gathered && s.yields.length > 0 && s.yields.every(y => y.openSeasons && season && !y.openSeasons.includes(season.id));
        const state = s.stock <= 0 ? 'dim' : closed ? 'dim' : !s.gathered ? 'veil' : 'lit';
        const missing = s.capacity - s.stock;
        return {id: s.id, name: s.name, stock: s.stock, capacity: s.capacity, fill: s.fill, state, closed, gathered: s.gathered,
            back: Math.min(missing, view.sites.find(v => v.id === s.id)?.regenPerDay ?? 0),
            tip: `${s.name}: ${s.stockWords}; ${s.regrow}; ${s.now}`,
            yields: s.gathered ? s.yields.map(y => ({label: y.label, state: yieldState(y, true), open: y.openSeasons,
                tip: `${y.label}: ${y.qty}${y.gates.length ? `; ${y.gates.join('; ')}` : '; open now'}`})) : [{label: s.name, state: 'veil', open: null, tip: `${s.name}: not gathered here yet, so unknown`}]};
    });
    return {place: model.place, season: season && {ids: season.list.map(x => x.id), list: season.list.map(x => x.label), index: season.index, progress: season.progress ?? 0, label: season.list[season.index].label},
        weather: model.weather, can: model.now?.can !== false, sites, text: figureText(gatheringFigureSpec(model, {id, title: 'Gathering'}))};
}

const seasonHead = (host, d) => h(host, 'p', 'pv-head', d.season ? `${d.place} · ${d.season.label}` : d.place);
const rainTag = (host, d) => d.weather ? h(host, 'span', 'pv-tag', 'rain', {title: d.weather}) : null;

// G1: site blocks with a stock fill. One tall block per site, filled from the bottom to its stock, with a hairline step above for what regrows by tomorrow; under it a row of mini blocks, one per thing it gives.
export function drawSiteBlocks(host, d = gatherData()) {
    const root = h(host, 'div', 'rd pv pv-g1');
    root.append(seasonHead(host, d));
    const row = h(host, 'div', 'pv-sites');
    for (const s of d.sites) {
        const site = h(host, 'div', 'pv-site');
        const tank = cell(host, s.state, s.tip, 'pv-tank');
        tank.append(h(host, 'i', 'pv-back', '', {style: `--pv-fill: ${Math.round(s.fill * 100)}%; --pv-back: ${Math.round(s.back / s.capacity * 100)}%`}), h(host, 'i', 'pv-fill', '', {style: `--pv-fill: ${Math.round(s.fill * 100)}%`}), h(host, 'b', 'pv-num', String(s.stock)));
        const gives = h(host, 'span', 'pv-minis');
        for (const y of s.yields) gives.append(cell(host, y.state, y.tip, 'pv-mini'));
        site.append(tank, gives, h(host, 'span', 'pv-word', s.name));
        row.append(site);
    }
    root.append(row);
    const rain = rainTag(host, d);
    if (rain) root.append(rain);
    host.replaceChildren(withText(host, root, d.text));
}

// G2: season strip. Four season columns; one row per thing a site gives; a filled span where it is open, a hairline span where it is gated now, a dim one where the season is shut.
export function drawSeasonStrip(host, d = gatherData()) {
    const root = h(host, 'div', 'rd pv pv-g2');
    root.append(h(host, 'p', 'pv-head', d.place));
    const n = d.season ? d.season.list.length : 1;
    const grid = h(host, 'div', 'pv-strip', '', {style: `--pv-cols: ${n}`});
    if (d.season) {
        grid.append(h(host, 'span', 'pv-gutter'));
        d.season.list.forEach((label, i) => {
            const head = h(host, 'span', 'pv-season', label, {'data-now': i === d.season.index});
            if (i === d.season.index) head.append(h(host, 'i', 'pv-now', '', {style: `--pv-at: ${Math.round(d.season.progress * 100)}%`, title: 'now'}));
            grid.append(head);
        });
    }
    for (const s of d.sites) {
        grid.append(h(host, 'span', 'pv-site-name', s.name, {'data-state': s.state, title: s.tip}));
        for (const y of s.yields) {
            if (y.state === 'veil') { grid.append(h(host, 'span', 'pv-gutter'), cell(host, 'veil', y.tip, 'pv-span pv-span--all', '?')); continue; }
            grid.append(h(host, 'span', 'pv-yield', y.label));
            for (let i = 0; i < n; i++) {
                const here = !y.open || y.open.includes(d.season.ids[i]);
                const isNow = d.season && i === d.season.index;
                grid.append(cell(host, !here ? 'dim' : isNow ? y.state : 'lit', y.tip, 'pv-span'));
            }
        }
    }
    root.append(grid);
    const rain = rainTag(host, d);
    if (rain) root.append(rain);
    host.replaceChildren(withText(host, root, d.text));
}

// G3 (unusual): a counted bed. Every unit of capacity is a cell: lit cells are what is left, hairline cells are what regrows by tomorrow, dim cells are gone for longer.
export function drawBed(host, d = gatherData()) {
    const root = h(host, 'div', 'rd pv pv-g3');
    root.append(seasonHead(host, d));
    for (const s of d.sites) {
        const row = h(host, 'div', 'pv-bed', '', {'data-state': s.state});
        row.append(h(host, 'span', 'pv-bedname', `${s.name}${s.gathered ? '' : ' ?'}`, {title: s.tip}), h(host, 'b', 'pv-num', String(s.stock)));
        const cells = h(host, 'span', 'pv-cells', '', {style: `--pv-cap: ${Math.min(10, s.capacity)}`, role: 'img', 'aria-label': s.tip});
        for (let i = 0; i < s.capacity; i++) {
            const state = i < s.stock ? (s.closed ? 'shut' : 'lit') : i < s.stock + s.back ? 'soon' : 'dim';
            cells.append(h(host, 'i', 'pv-cell', '', {'data-state': state}));
        }
        row.append(cells);
        root.append(row);
    }
    const rain = rainTag(host, d);
    if (rain) root.append(rain);
    host.replaceChildren(withText(host, root, d.text));
}

/** Walks read as plain data from the walk-map view: nearest first, blocked marked, who is usually where. */
export function walkData(view = WALK_MAP_VIEW, spec = WALK_MAP_FIXTURE) {
    const here = view.places.find(p => p.here);
    const legs = view.legs || [];
    const why = reasons => (reasons.join(' ').match(/dusk|dawn|night|noon|rain/i) || ['shut'])[0].toLowerCase();
    const folk = place => (view.people || []).filter(p => p.place === place).map(p => ({initial: p.label.charAt(0).toUpperCase(), tip: `${p.label}: usually here ${p.when}`}));
    const away = view.places.filter(p => !p.here).sort((a, b) => a.minutes - b.minutes || a.place.localeCompare(b.place)).map(p => {
        const leg = legs.find(l => l.to === p.place), blocked = !!leg && !leg.eligible;
        return {name: p.place, district: p.district, minutes: p.minutes, blocked, why: blocked ? why(leg.reasons) : '', folk: folk(p.place),
            tip: `${p.place}: ${p.minutes} min walk${blocked ? `; blocked now: ${leg.reasons.join(' ')}` : ''}`};
    });
    return {here: {name: here.place, district: here.district, folk: folk(here.place)}, away, max: Math.max(...away.map(p => p.minutes)), step: 5, text: figureText(spec)};
}
const pips = (host, folk) => folk.map(f => h(host, 'span', 'pv-pip', f.initial, {title: f.tip, 'aria-label': f.tip}));

// W1: departure board. Nearest first; each row is a run of five-minute blocks and one numeral. A blocked walk is hairline with the reason in one word.
export function drawBoard(host, d = walkData()) {
    const root = h(host, 'div', 'rd pv pv-w1');
    const head = h(host, 'p', 'pv-head');
    const hn = h(host, 'span', '', d.here.name); hn.append(...pips(host, d.here.folk));
    head.append(hn, h(host, 'span', 'pv-unit', 'min'));
    root.append(head);
    const board = h(host, 'div', 'pv-board');
    for (const p of d.away) {
        const row = h(host, 'div', 'pv-leg', '', {title: p.tip, 'data-state': p.blocked ? 'dim' : 'lit'});
        const run = h(host, 'span', 'pv-run');
        for (let i = 0; i < Math.ceil(p.minutes / d.step); i++) run.append(h(host, 'i', 'pv-cell', '', {'data-state': p.blocked ? 'soon' : 'lit'}));
        const place = h(host, 'span', 'pv-place', p.name); place.append(...pips(host, p.folk));
        row.append(place, run, h(host, 'b', 'pv-min', String(p.minutes)));
        if (p.blocked) row.append(h(host, 'span', 'pv-tag', p.why));
        board.append(row);
    }
    root.append(board);
    host.replaceChildren(withText(host, root, d.text));
}

// W2 (unusual): a road at true scale. One line, a tick block every five minutes; each place stands on the line at its walking time, so two places the same distance away stand side by side.
// Names sit on alternating stems so near places do not collide.
export function drawRoad(host, d = walkData()) {
    const root = h(host, 'div', 'rd pv pv-w2');
    const road = h(host, 'div', 'pv-road');
    const ticks = h(host, 'span', 'pv-ticks');
    for (let t = 0; t < d.max; t += d.step) ticks.append(h(host, 'i', 'pv-cell', '', {'data-state': 'lit'}));
    road.append(ticks);
    const lanes = [['above', 1], ['above', 2], ['below', 2], ['above', 1]];
    const stand = (name, at, state, lane, tip, tail, folk) => {
        const s = h(host, 'span', 'pv-stand', '', {'data-state': state, 'data-side': lane[0], 'data-reach': lane[1], style: `--pv-at: ${(at / d.max).toFixed(3)}`, title: tip, 'aria-label': tip, 'data-end': at / d.max > 0.8});
        s.append(h(host, 'i', 'pv-block'), h(host, 'span', 'pv-label', name + (tail ? ` · ${tail}` : '')), ...pips(host, folk));
        return s;
    };
    road.append(stand(d.here.name, 0, 'lit', ['below', 1], `${d.here.name}: you are here`, '', d.here.folk));
    d.away.forEach((p, i) => road.append(stand(p.name, p.minutes, p.blocked ? 'soon' : 'lit', lanes[i % lanes.length], p.tip, p.blocked ? p.why : String(p.minutes), p.folk)));
    root.append(road);
    host.replaceChildren(withText(host, root, d.text));
}

// W3: mass blocks by district. A place is a square whose side grows with its walking time, so the far ones are heavy. Districts group the squares.
export function drawMass(host, d = walkData()) {
    const root = h(host, 'div', 'rd pv pv-w3');
    root.append(h(host, 'p', 'pv-head', d.here.name));
    const groups = [...new Set(d.away.map(p => p.district))];
    const row = h(host, 'div', 'pv-groups');
    for (const g of groups) {
        const col = h(host, 'div', 'pv-group');
        const run = h(host, 'span', 'pv-masses');
        for (const p of d.away.filter(x => x.district === g)) {
            const m = h(host, 'span', 'pv-massbox');
            const b = cell(host, p.blocked ? 'soon' : 'lit', p.tip, 'pv-mass');
            b.style.setProperty('--pv-side', (p.minutes / d.max).toFixed(3));
            b.append(h(host, 'b', 'pv-min', String(p.minutes)), ...pips(host, p.folk));
            m.append(b, h(host, 'span', 'pv-word', p.name));
            if (p.blocked) m.append(h(host, 'span', 'pv-tag', p.why));
            run.append(m);
        }
        col.append(run, h(host, 'span', 'pv-rowname', g));
        row.append(col);
    }
    root.append(row);
    host.replaceChildren(withText(host, root, d.text));
}

export const PLACES_VARIANTS = {
    gathering: [
        {id: 'G1', title: 'Gathering variant G1: site blocks with a stock fill', draw: drawSiteBlocks},
        {id: 'G2', title: 'Gathering variant G2: season strip', draw: drawSeasonStrip},
        {id: 'G3', title: 'Gathering variant G3 (unusual): a counted bed', draw: drawBed},
    ],
    walks: [
        {id: 'W1', title: 'Walks variant W1: departure board', draw: drawBoard},
        {id: 'W2', title: 'Walks variant W2 (unusual): a road at true scale', draw: drawRoad},
        {id: 'W3', title: 'Walks variant W3: mass blocks by district', draw: drawMass},
    ],
};
export {GATHER_BLOOM_VIEW, GATHER_FALL_VIEW};
