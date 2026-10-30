// RPX14 walk map fixtures (invented names, CLR3). Built by the real adapter from a place-panel view,
// so the gallery exercises the same path as the game.
import {walkMapSpec, routeStripSpec} from '../../walk_map.js';

export const WALK_MAP_VIEW = {
    places: [
        {place: 'Lamplighters\' hall', district: 'Hill quarter', here: true, minutes: 0},
        {place: 'Rented attic', district: 'Hill quarter', here: false, minutes: 2},
        {place: 'Saltgate wharf', district: 'Riverside', here: false, minutes: 20},
        {place: 'Glassworks yard', district: 'Riverside', here: false, minutes: 20},
        {place: 'Old college', district: 'College rise', here: false, minutes: 35},
    ],
    moves: [
        {id: 'walk_attic', label: 'Walk to Rented attic · 2 min · Hill quarter: nearby', eligible: true, reasons: []},
        {id: 'walk_wharf', label: 'Walk to Saltgate wharf · 20 min · Riverside: nearby', eligible: true, reasons: []},
        {id: 'walk_glass', label: 'Walk to Glassworks yard · 20 min · Riverside: nearby', eligible: true, reasons: []},
        {id: 'walk_college', label: 'Walk to Old college · 35 min · College rise: nearby', eligible: false, reasons: ['The college gate shuts at dusk.']},
    ],
    people: [
        {id: 'p1', label: 'Mott the tally clerk', place: 'Saltgate wharf', when: 'mornings'},
        {id: 'p2', label: 'Widow Pell', place: 'Lamplighters\' hall', when: 'evenings'},
        {id: 'p3', label: 'A stranger you never met', place: 'Hidden cellar', when: 'nights'},
    ],
    elsewhere: [{id: 'p4', label: 'Your cousin lives in another city'}],
};
export const WALK_MAP_FIXTURE = walkMapSpec(WALK_MAP_VIEW).spec;
export const WALK_MAP_ALONE_FIXTURE = {...walkMapSpec({places: [{place: 'Roadside inn', here: true, minutes: 0}]}).spec, id: 'walk-map-alone'};
export const ROUTE_STRIP_FIXTURE = routeStripSpec({from: 'Lamplighters\' hall', to: 'Saltgate wharf', minutes: 20,
    passed: [{label: 'Mott the tally clerk', at: 'bridge, 6 min'}, {label: 'a hooded figure', at: 'fish market, 14 min', seen: false}]});
export const MAP_FIXTURES = [WALK_MAP_FIXTURE, WALK_MAP_ALONE_FIXTURE, ROUTE_STRIP_FIXTURE];
