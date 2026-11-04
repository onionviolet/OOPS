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

// G6: day-indexed events per calendar profile, keyed by day of month with an optional hour.
// dateBasis: stated and inferred rows need a source locator; fixture rows are test scaffolding, not
// source dates; unknown rows are placeholders with no day and never surface. Dates are not guessed.
export const WORLD_DAY_EVENTS = freeze({
    'book.mol.cyoria': {profileId: 'calendar.mol.visitor.legacy', events: [
        {id: 'mol.restart_lights', month: 1, day: 1, hour: 6, dateBasis: 'fixture', locator: null,
            label: 'Restart-day lights', text: 'The morning lights come on over the first day, as they have before.'},
        {id: 'mol.school_dance', month: 1, day: 15, hour: 19, dateBasis: 'fixture', locator: null,
            label: 'The school dance', text: 'The hall fills for the evening dance.'},
        {id: 'mol.month_end', month: 1, day: 30, hour: 23, dateBasis: 'fixture', locator: null,
            label: "The month's end", text: 'The last night of the month closes.'},
        {id: 'mol.unplaced_event', month: 1, day: null, hour: null, dateBasis: 'unknown', locator: null,
            label: 'An event the text leaves undated', text: 'Placeholder: the source gives no day.'},
    ]},
});
