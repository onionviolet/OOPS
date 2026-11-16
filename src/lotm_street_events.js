// Klein's streets (lead core-flow audit, PS143 for Tingen; proposal under AD32, AD56). Ordinary happenings at named Tingen places,
// as records in the Tingen event book (world_events.js, merged by lotmEventBook), so a street and a closure read one owner. Each
// record carries `place` (a cast place id), a `lineKey` into LOTM_STREET_LINES and `hours` (the hours of the Tingen day it shows).
// The place hook (place_descriptions.js) adds the line to that place's description while the record's window and hours hold.
// Pure data: authored rows, none from the book's prose and none deciding a case. Dials (default, reason) sit beside each row.
const SITE = {market: 'lotm.place.cast-a0b199ce62ad1541a261', ironCross: 'lotm.place.cast-eb59d1e8bae776ddbcdf', office: 'lotm.place.cast-0785d86b800a41be64ed'};
const street = (id, place, recur, hours, why) => Object.freeze({id: `lotm.street.${id}`, key: `lotm.street.${id}`, lineKey: `street.${id}`, kind: 'public_event',
    placement: 'recurring', scope: 'public', evidence: 'U', place, recur, hours: Object.freeze(hours), why});
export const LOTM_STREET_EVENTS = Object.freeze([
    street('market_day', SITE.market, {every: {days: 7}, fromDay: 1, durationDays: 1}, {from: 6, until: 14},
        'A weekly market day on the street market, mornings to early afternoon. The weekday and hours are authored.'),
    street('soup_kettle', SITE.ironCross, {every: {days: 5}, fromDay: 3, durationDays: 1}, {from: 11, until: 15},
        'A parish charity kettle in the poor quarter, every few days at midday. Frequency and hours are authored.'),
    street('coal_cart', SITE.office, {every: {days: 3}, fromDay: 2, durationDays: 1}, {from: 8, until: 12},
        'A coal delivery next to the office, a morning errand every few days. Frequency and hours are authored.')
].map(Object.freeze));
export const LOTM_STREET_LINES = Object.freeze({
    'street.market_day': 'Market day. Barrows run the length of the street, and the costermongers call their prices for cabbage, eels and secondhand boots. Mind your purse in the crush.',
    'street.soup_kettle': 'A parish charity has set up a soup kettle at the corner. The line of dockers\' wives and children runs past the pawnshop.',
    'street.coal_cart': 'A coal cart is unloading at the house next door, and black dust settles on the company\'s brass plate.'
});
export const LOTM_STREET_PLACES = Object.freeze([...new Set(LOTM_STREET_EVENTS.map(e => e.place))]);
