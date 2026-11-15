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

// RWT24 (TMR1, TMR2, TMR8, TMR13): Fang Yuan's calendar. Each `basis` names where a value comes from: `beat` ids point at the lead-run
// scene files (lead-run/1.3, private; ids only, no prose) and `authored` marks a dial the source does not state. The source names
// months in a Western-style count ("March", "July", "October 24"), so months carry the usual names and lengths (authored: no leap days).
const RI_MONTHS = [['January', 31], ['February', 28], ['March', 31], ['April', 30], ['May', 31], ['June', 30], ['July', 31], ['August', 31],
    ['September', 30], ['October', 31], ['November', 30], ['December', 31]].map(([label, days], i) => ({id: String(i + 1), label, days}));
export const RI_CALENDAR_DIALS = {
    start: {year: 1, month: 3, day: 12, hour: 6, basis: 'authored',
        why: 'His life starts at the Awakening Ceremony, in spring (beats 00401, 00405; March is named for spring at 210704). The day is authored: mid-March, hour 6, morning of the ceremony.'},
    seasons: {basis: 'authored with source signs',
        why: 'The source gives signs, not boundaries: rain in spring (03603), a scorching sun at the mid-year exam (07204), cool autumn wind (211907), snow from early winter (08003, 212202), the first wolf tide in summer, mid-to-late July (213101, 213701), "end of summer" after the banquet (216103). One beat calls July "the start of autumn" (211607) and is set aside here (dial: move autumn to August).'},
    year: {days: 365, basis: 'authored', why: 'No year length is stated; the source counts months by name, so a 365-day year of named months.'},
    weekday: {basis: 'authored', why: 'The source names no weekday, so none is shown.'},
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
    'book.ri.lead.world': {revision: 1, algorithmId: 'fixed_months', algorithmRevision: 1, id: 'calendar.ri.lead', label: 'Gu Yue', format: 'named',
        units: {minutesPerHour: 60, hoursPerDay: 24}, months: RI_MONTHS, precision: 'day',
        evidence: 'lead-run beats 00401, 00405, 03603, 07204, 08003, 211607, 213101, 216103 (spring start, summer tide); month lengths and start day authored',
        seasons: [
            {id: 'Winter', from: {month: 12, day: 1}, signs: ['08003', '08004', '09205', '212202']},
            {id: 'Spring', from: {month: 2, day: 1}, signs: ['00405', '03603', '210701']},
            {id: 'Summer', from: {month: 5, day: 1}, signs: ['06401', '07204', '213701', '216103']},
            {id: 'Autumn', from: {month: 9, day: 1}, signs: ['07609', '211907']},
        ],
        anchor: {year: RI_CALENDAR_DIALS.start.year, month: RI_CALENDAR_DIALS.start.month, day: RI_CALENDAR_DIALS.start.day,
            hour: RI_CALENDAR_DIALS.start.hour, minute: 0, day_count: 0}},
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
