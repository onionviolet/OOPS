import {activityMarks} from '/map-marks.js';

// Diagram positions, independent of travel time. The registry still supplies every
// place and route. The grid leaves the lower left open for additions.
const rows = [
    ['Mysterious gate', 'Mysterious depths', null, 'Gentle mountain slope', null, 'Fort courtyard', 'Fort dungeon', 'Forest den traversal', 'Forest den', 'Forest ant nest', 'Red ant nest 1', 'Red ant nest 2', 'Red ant nest 3'],
    ['Writhing tunnel', 'Pitch black tunnel', null, 'Mountain camp', null, 'Fort approach', 'Waypost Fort yard', "Bears' den", 'Deep forest', 'Forest clearing', null, 'Town farms', 'Gang hideout'],
    ['Hidden tunnel', 'Cave depths', 'Mountain path', 'Small flat area in mountains', 'Fight the angry mountain goat', 'Waypost Fort', 'Waypost Fort cellar', null, 'Forest', 'Carya Canyon', 'Precarious tree bridge', 'Slums', 'Fight off the assailant'],
    ['Cave room', 'Suspicious wall', null, 'Nearby cave', 'Shack', 'Infested field', 'Infested woods', null, 'Forest road', null, 'Town outskirts', 'Town square', 'Cat cafe'],
    ['Arlmere family manor', 'Hearthside cottage', 'Riverside rented room', 'frontier.drainage.0', 'Sparring with the village guard (heavy)', null, 'Sparring with the village guard (quick)', null, 'Forest lake', 'Frogs', 'Motherwood', 'Antique store', 'Nekomimi cafe'],
    ['Family longhouse room', 'Willow clearing shelter', 'Wild willow stand', null, null, 'Village', null, 'Eastern mill', 'Eastern storehouse', 'Bramble path', 'Primeval forest', "Adventurer's guild", 'Mages guild'],
    [null, 'Willow burrow', 'Canopy nest', null, null, 'Downstream from the village', null, 'Riverbank', 'Riverbank shore'],
    [null, null, null, null, 'Fight the giant crab', null, 'Further downstream', null, 'Lake beach', 'Waterfall basin', 'Crab spawning grounds'],
    [null, null, null, null, null, null, 'Fight the giant crab again', null, null, 'Swampland fields', 'The swamplands', 'Swampland tribe', 'Longhouse'],
];
const slots = new Map(rows.flatMap((row, y) => row.flatMap((id, x) => id ? [[id, [x, y]]] : [])));
// Shift two tight clusters into the neighbouring open space.
for (const [id, xy] of [
    ['Sparring with the village guard (heavy)', [4, 3.85]],
    ['Sparring with the village guard (quick)', [6, 3.85]],
    ['Nearby cave', [2.7, 3]],
    ['Waypost Fort', [5.5, 2.05]],
    ['Waypost Fort cellar', [6.55, 2.05]],
]) slots.set(id, xy);

const residents = {key: 'people', icon: 'group', label: 'Residents'};
const otherActivity = {key: 'activity', icon: 'explore', label: 'Other activities'};
const services = new Set(['rest', 'trader', 'craft']);

export const placeMarks = [
    ...activityMarks, residents, otherActivity,
    {key: 'combat', symbol: '▲', label: 'Combat · enemy rank'},
    {key: 'challenge', symbol: '◆', label: 'Challenge · enemy rank'},
    {key: 'route', label: 'Travel direction'},
    {key: 'current', label: 'You are here'},
    {key: 'selected', label: 'Selected'},
];

export function villageDiagram(places) {
    let extra = 0;
    const nodes = places.map(place => {
        const [col, row] = slots.get(place.id) || [extra % 13, rows.length + Math.floor(extra++ / 13)];
        const marks = [...place.marks];
        if (place.people.length && !marks.some(mark => mark.key === 'trader')) marks.push(residents);
        if (place.activities.length && marks.every(mark => services.has(mark.key) || mark.key === 'people')) {
            marks.push(otherActivity);
        }
        return {...place, x: col * 120, y: row * 62, w: 106, h: 39, marks};
    });
    const shown = new Set(places.map(place => place.id));
    const edges = new Map();
    for (const {id: from, routes} of places) {
        for (const {id: to} of routes) {
            if (!shown.has(to)) continue;
            const key = JSON.stringify([from, to].sort());
            if (edges.has(key)) {
                const edge = edges.get(key);
                if (edge.from !== from) edge.both = true;
            } else {
                const southwest = from === 'Village' && slots.get(to)?.[0] < 4 && slots.get(to)?.[1] >= 4;
                edges.set(key, {from, to, corridor: southwest ? 5 * 62 + 26 : undefined});
            }
        }
    }
    return {nodes, edges: [...edges.values()]};
}
