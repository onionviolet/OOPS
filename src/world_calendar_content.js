// W36 content revision 1. These bindings preserve the existing authored dates.
// Source-qualified starts and canon calendars require separate adoption.
import {deepFreeze as freeze} from './basics.js';
const legacy = {
    revision: 1, algorithmId: 'fixed_months', algorithmRevision: 1,
    units: {minutesPerHour: 60, hoursPerDay: 24},
    months: Array.from({length: 12}, (_, i) => ({id: String(i + 1), days: 30})),
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    precision: 'day', evidence: 'authored legacy projection',
};
export const WORLD_CALENDAR_PROFILES = freeze({
    'base.frontier': {...legacy, id: 'calendar.frontier.legacy', label: 'Home', format: 'numeric', seasons: true,
        anchor: {year: 999, month: 4, day: 1, hour: 8, minute: 0, day_count: 1}},
    'book.mol.cyoria': {...legacy, id: 'calendar.mol.visitor.legacy', label: 'Cyoria visitor', format: 'numeric', seasons: false,
        definitionId: 'book.mol.cyoria.definition', definitionRevision: 1,
        anchor: {year: 1, month: 1, day: 1, hour: 6, minute: 0, day_count: 1}},
    'book.paradise.hub': {...legacy, id: 'calendar.paradise.hub.legacy', label: 'Paradise hub', format: 'elapsed', seasons: false,
        definitionId: 'book.paradise.hub.definition', definitionRevision: 1,
        anchor: {year: 1, month: 1, day: 1, hour: 6, minute: 0, day_count: 1}},
    'book.paradise.goa': {...legacy, id: 'calendar.paradise.goa.legacy', label: 'Goa', format: 'numeric', seasons: false,
        definitionId: 'book.paradise.goa.definition', definitionRevision: 1,
        anchor: {year: 1, month: 1, day: 1, hour: 6, minute: 0, day_count: 1}},
});
