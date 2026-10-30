// RPX14 walk map: the place panel's own view (places, walks, people elsewhere) as an MDL2 figure spec.
// Distance is walking time, not compass direction: rings step outward by the minutes a walk costs from
// where you stand, so no map geometry is invented (SR1, SR7). Only what the view already projects for
// this seat is drawn; a place or person the seat does not know never reaches the spec (SR9, LTU11).
// Name-free and pure apart from walkMapBlock, which builds the panel disclosure. Design: docs/representations/MAPS_AND_TRAVEL.md.
import {renderFigure} from './figure.js';

// view: {places:[{place, district?, here, minutes}], moves?:[{id, label, eligible, reasons}],
//        elsewhere?:[{id, label}], people?:[{id, label, place, when?}]}
// Returns {spec, controls} where controls maps a figure node id to the walk command that goes there.
export function walkMapSpec(view) {
    const places = Array.isArray(view?.places) ? view.places : [];
    const here = places.find(p => p.here) || null;
    const away = places.filter(p => !p.here && Number.isFinite(p.minutes));
    const moves = Array.isArray(view?.moves) ? view.moves : [];
    const moveFor = place => moves.find(m => typeof m.label === 'string' && m.label.startsWith(`Walk to ${place} · `)) || null;
    const known = new Set(places.map(p => p.place));
    const people = (Array.isArray(view?.people) ? view.people : []).filter(person => known.has(person.place));
    const controls = {};
    const bands = [...new Set(away.map(p => p.minutes))].sort((a, b) => a - b);
    const radius = i => bands.length === 1 ? .7 : Math.round((.42 + .58 * i / (bands.length - 1)) * 100) / 100;
    const rings = [], nodes = [], edges = [], notes = [];
    nodes.push({id: 'here', label: here ? here.place : 'Where you stand', at: 'center', state: 'current'});
    const r2 = n => Math.round(n * 100) / 100;
    // Headings in degrees, 0 = east, 90 = straight down. Below you is kept for your own label, above you for
    // people whose usual place is here; each ring then turns to the heading furthest from everything drawn.
    const hereFolk = people.filter(person => here && person.place === here.place);
    const used = [90, 70, 110, ...(hereFolk.length ? [-90] : [])];
    const gap = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return Math.min(d, 360 - d); };
    const turn = m => {
        let best = 0, bestScore = -1;
        for (let rotate = 0; rotate < 360; rotate += 5) {
            const score = Math.min(...Array.from({length: m}, (_, k) => Math.min(...used.map(u => gap(-90 + k * 360 / m + rotate, u)))));
            if (score > bestScore) { best = rotate; bestScore = score; }
        }
        return best;
    };
    bands.forEach((minutes, i) => {
        const ringId = `band-${i}`, members = away.filter(p => p.minutes === minutes), rotate = turn(members.length);
        rings.push({id: ringId, label: `${minutes} min walk`, radius: radius(i), count: members.length, rotate});
        members.forEach((place, slot) => {
            const index = places.indexOf(place), id = `place-${index}`, move = moveFor(place.place);
            const blockedHere = !!move && !move.eligible, deg = -90 + slot * 360 / members.length + rotate;
            used.push(deg);
            nodes.push({id, label: place.place, ring: ringId, index: slot, state: blockedHere ? 'strained' : undefined});
            if (move) controls[id] = move.id;
            edges.push({from: 'here', to: id, kind: 'walk', label: `${minutes} min`, state: blockedHere ? 'strained' : undefined});
            // A person's usual place: drawn just clockwise of that place, joined to it.
            people.filter(person => person.place === place.place).forEach((person, j) => {
                const personId = `person-${index}-${j}`, at = deg + 22 + j * 16, a = at * Math.PI / 180, r = Math.min(radius(i), .9);
                used.push(at);
                nodes.push({id: personId, label: person.label, glyph: '☺', at: [r2(Math.cos(a) * r), r2(Math.sin(a) * r)]});
                edges.push({from: personId, to: id, kind: 'usually here', label: person.when || 'usually'});
            });
        });
    });
    // People whose usual place is where you stand sit just above you.
    hereFolk.forEach((person, j, list) => {
        const id = `person-here-${j}`;
        nodes.push({id, label: person.label, glyph: '☺', at: [r2((j - (list.length - 1) / 2) * .3), -.5]});
        edges.push({from: id, to: 'here', kind: 'usually here', label: person.when || 'usually'});
    });
    const blocked =[...new Set(moves.filter(m => !m.eligible).flatMap(m => m.reasons))];
    if (!away.length) notes.push({text: 'You know no other places yet. Places join this map when you learn of them.'});
    if (blocked.length) notes.push({state: 'strained', text: `Some walks are blocked now: ${blocked.join(' ')}`});
    for (const person of Array.isArray(view?.elsewhere) ? view.elsewhere : []) notes.push({text: `Off this map: ${person.label}.`});
    const districts = [...new Set(places.map(p => p.district).filter(Boolean))];
    if (districts.length > 1) notes.push({text: `Districts: ${districts.map(d => `${d} (${places.filter(p => p.district === d).map(p => p.place).join(', ')})`).join('; ')}.`});
    return {controls, spec: {
        id: 'walk-map', size: 600,
        title: here ? `Walks from ${here.place}` : 'Walks',
        summary: 'Rings step outward by walking time from where you stand, not by compass direction. Only places you know are drawn.',
        rings, nodes, edges, notes,
        legend: [{state: 'current', label: 'you are here'}, {kind: 'walk', label: 'walk, minutes quoted'},
            ...(edges.some(e => e.state === 'strained') ? [{state: 'strained', label: 'walk blocked now'}] : []),
            ...(people.length ? [{kind: 'usually here', label: "someone's usual place"}] : [])],
    }};
}

// Alternative form for the gallery (round 2, item 18): the same walks as one straight ladder, nearest
// first, so rings and a line can be compared. Steps are evenly spaced; the minutes are in the words.
export function walkLadderSpec(view) {
    const places = Array.isArray(view?.places) ? view.places : [], here = places.find(p => p.here);
    const away = places.filter(p => !p.here && Number.isFinite(p.minutes)).sort((a, b) => a.minutes - b.minutes || a.place.localeCompare(b.place));
    return {id: 'walk-ladder', size: 720, title: here ? `Walks from ${here.place}, nearest first` : 'Walks, nearest first',
        tracks: [{id: 'ladder', label: 'Minutes from here', steps: [{label: here ? here.place : 'Here', state: 'current'}, ...away.map(p => ({label: `${p.place} · ${p.minutes} min`}))]}]};
}

// RPX14 / SUI15 route strip (gallery proposal, not yet fed by the game): one walk as a track, with
// the people you passed at your witness level. route: {from, to, minutes, passed:[{label, at, seen}]}
export function routeStripSpec(route) {
    const passed = Array.isArray(route?.passed) ? route.passed : [];
    const steps = [{label: route.from, state: 'done'}, ...passed.map(p => ({label: `${p.seen === false ? 'someone' : p.label} · ${p.at}`, state: p.seen === false ? 'unknown' : 'done'})), {label: route.to, state: 'current'}];
    return {id: 'route-strip', size: 640, title: `On the way to ${route.to} · ${route.minutes} min`,
        summary: 'The route is a place too: who you passed, as much as you noticed.',
        tracks: [{id: 'way', label: 'On the way', steps}]};
}

// The panel disclosure: figure, its text form, and a click on a place that focuses that place's walk button.
export function walkMapBlock(view, {open = true, ontoggle, onPick} = {}) {
    const {spec, controls} = walkMapSpec(view);
    const doc = globalThis.document, box = doc.createElement('details');
    box.dataset.walkMap = ''; box.open = open;
    if (ontoggle) box.addEventListener('toggle', () => ontoggle(box.open));
    const summary = doc.createElement('summary'); summary.textContent = 'Walking map · minutes from here';
    const figure = doc.createElement('div');
    const {text} = renderFigure(figure, spec, {idPrefix: 'walk-map'});
    if (onPick) figure.addEventListener('click', event => {
        const id = event.target.closest?.('[data-id]')?.dataset.id;
        if (controls[id]) onPick(controls[id]);
    });
    const words = doc.createElement('details'); words.dataset.walkMapText = '';
    const wordsSummary = doc.createElement('summary'); wordsSummary.textContent = 'The map in words';
    const pre = doc.createElement('pre'); pre.className = 'fig-text'; pre.textContent = text;
    words.append(wordsSummary, pre);
    box.append(summary, figure, words);
    return box;
}
