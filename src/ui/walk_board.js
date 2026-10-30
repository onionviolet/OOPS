// RPX14 walk board: a departures list of where you can walk from here, nearest first. It replaces a
// scattered list of places plus walk buttons. Same view as walk_map.js; only places the seat already
// knows are listed, and a person whose usual place is not among them is never shown (SR9, LTU11).
// The walk button keeps data-lotm so existing browser scripts still find it.

// view: {places:[{place, district?, team?, here, minutes}], moves:[{id, label, eligible, reasons}],
//        people?:[{id, label, place, when?}], elsewhere?:[{id, label}]}
export function walkBoard(view, {move, onToggleMap, mapShown = false} = {}) {
    const doc = globalThis.document;
    const el = (tag, text, attrs = {}) => {
        const node = doc.createElement(tag);
        if (text !== undefined) node.textContent = text;
        for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
        return node;
    };
    const places = Array.isArray(view?.places) ? view.places : [];
    const moves = Array.isArray(view?.moves) ? view.moves : [];
    const known = new Set(places.map(p => p.place));
    const people = (Array.isArray(view?.people) ? view.people : []).filter(person => known.has(person.place));
    // Legs [{to, minutes, moveId, eligible, reasons, window?}] name the move for each place; no label is parsed here.
    const legs = Array.isArray(view?.legs) ? view.legs : [];
    const moveFor = place => { const leg = legs.find(l => l.to === place && l.moveId); return leg ? {id: leg.moveId, eligible: leg.eligible, reasons: leg.reasons, window: leg.window} : null; };
    const here = places.find(p => p.here) || null;
    const away = places.filter(p => !p.here && Number.isFinite(p.minutes))
        .sort((a, b) => a.minutes - b.minutes || (a.place < b.place ? -1 : a.place > b.place ? 1 : 0));
    const farthest = Math.max(0, ...away.map(p => p.minutes));

    const board = el('section', undefined, {'data-walk-board': ''});
    board.append(el('h3', 'Places and walks'));
    if (here) board.append(el('p', `You are at ${here.place}${here.district ? `, ${here.district}` : ''}`, {'data-walk-here': ''}));
    const hereFolk = here ? people.filter(person => person.place === here.place) : [];
    if (hereFolk.length) board.append(el('p', `Usually here: ${hereFolk.map(person => person.when ? `${person.label} · ${person.when}` : person.label).join(', ')}`, {'data-walk-here-people': ''}));

    if (!away.length) board.append(el('p', 'You know no other places yet. Places join this list when you learn of them.', {'data-walk-empty': ''}));
    else {
        const list = el('ol', undefined, {'data-walk-rows': ''});
        for (const place of away) {
            const row = el('li', undefined, {'data-walk-place': place.place});
            const meter = el('span', undefined, {class: 'walk-board-meter', 'aria-hidden': 'true'});
            const fill = el('span', undefined, {class: 'walk-board-fill'});
            fill.style.setProperty('--walk-share', String(farthest > 0 ? place.minutes / farthest : 0));
            meter.append(fill);
            row.append(el('span', place.place, {class: 'walk-board-name'}), meter, el('span', `${place.minutes} min`, {class: 'walk-board-minutes'}));
            const chips = el('span', undefined, {class: 'walk-board-chips'});
            if (place.district) chips.append(el('span', `${place.district}${place.team ? ` · ${place.team}` : ''}`, {class: 'walk-board-chip'}));
            for (const person of people.filter(p => p.place === place.place)) {
                chips.append(el('span', `☺ ${person.label}${person.when ? ` · ${person.when}` : ''}`, {class: 'walk-board-chip walk-board-person'}));
            }
            row.append(chips);
            const walk = moveFor(place.place);
            if (walk) {
                const button = el('button', `Walk · ${place.minutes} min`, {type: 'button', 'data-lotm': walk.id});
                const reasons = Array.isArray(walk.reasons) ? walk.reasons.join(' ') : '';
                if (!walk.eligible) { button.disabled = true; button.title = reasons; }
                button.addEventListener('click', () => { if (move && !button.disabled) move(walk.id); });
                row.append(button);
                if (!walk.eligible) row.append(el('small', reasons, {class: 'walk-board-reason'}));
                if (walk.window?.text) row.append(el('small', `Open ${walk.window.text}${walk.window.waitMinutes > 0 ? ` · wait ${walk.window.waitMinutes} min` : ''}`, {class: 'walk-board-window'}));
            }
            list.append(row);
        }
        board.append(list);
    }
    for (const person of Array.isArray(view?.elsewhere) ? view.elsewhere : []) board.append(el('p', person.label, {'data-walk-elsewhere': ''}));
    if (onToggleMap) {
        const toggle = el('button', mapShown ? 'Hide the walking map' : 'Show the walking map', {type: 'button', 'data-walk-map-toggle': ''});
        toggle.addEventListener('click', () => onToggleMap());
        board.append(toggle);
    }
    return board;
}
