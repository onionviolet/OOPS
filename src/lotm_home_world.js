// Klein's flat in the shared home engine (W3a-S3, proposal under AD32, docs/CROSS_WORLD_SYSTEMS_TRANSFER.md#the-comprehensive-check-2026-11-08).
// LOTM registers its home, the landlord's furniture and a few pieces sold at the Tingen markets; the home engine plans, saves and
// validates them like any home. Money is the native `money` resource read as pence (book_world_lotm_ids.js), so prices are pence.
// Canon (volume 1): the Moretti siblings rent a flat; Klein, Benson and Melissa share it and count every coin. Authored (not canon): the
// landlord's id, the pieces, their prices and capacities, and where they are sold.
// Default, dial and reason. Tenure: rented, owned by the landlord. Default: a renter may bring and fit movable furniture, and the engine's
// own tenure rule refuses structural work in a home he does not own. Dial: a world may let a tied or owning tenant improve. Reason: the
// landlord's flat is not Klein's to rebuild. Rent stays the LOTM rent duty (no lodging period here), so one authority owns what is owed.
// Expansion: moving to a better home (the house the siblings later take) is a registered home with its own tenure, added when its window is read.
import {registerHomeWorld} from './home_content.js';

export const LOTM_HOME_WORLD = 'book.lotm.tingen';
const H = `${LOTM_HOME_WORLD}.home`;
export const LOTM_FLAT_PLACE = 'lotm.place.cast-266d12fc010442f95bac'; // the cast pack's Moretti flat (the be-life's start place)
export const LOTM_STREET_MARKET = 'lotm.place.cast-a0b199ce62ad1541a261'; // the cast pack's Tingen street market
export const LOTM_MEAT_MARKET = 'lotm.place.cast-67769506e76820d498cc'; // the cast pack's Lettuce and Meat market, a walk from the flat
export const LOTM_FLAT_HOME = `${H}.moretti_flat`;
export const LOTM_LANDLORD = `${LOTM_HOME_WORLD}.landlord`;

const piece = (name, slot, price, effects, description, extra = {}) => ({name, slot, price, effects, description, forms: ['human'], ...extra});
const sold = {soldAt: [LOTM_STREET_MARKET, LOTM_MEAT_MARKET]};
export const LOTM_HOME_FURNITURE = Object.freeze({
    [`${H}.landlord_bed`]: piece('Narrow iron bed', 'bed', 0, {rest: 1.02}, 'The landlord’s bed, let with the flat. It squeaks but it holds.'),
    [`${H}.wool_blanket`]: piece('Wool blanket', 'blanket', 30, {rest: 1.02}, 'A heavy secondhand wool blanket for the cold Tingen nights.', sold),
    [`${H}.tea_crate`]: piece('Lidded tea crate', 'box', 6, {storage: 6}, 'An emptied tea crate with a lid; six more things fit under the bed.', sold),
    [`${H}.book_shelf`]: piece('Small book shelf', 'shelf', 48, {}, 'A plain pine shelf for the history books and notes.', sold),
});
export const LOTM_HOME_ROOMS = Object.freeze({
    [`${H}.privacy_curtain`]: {name: 'Fit a removable privacy curtain', minutes: 15, coins: 0, capacity: 0, structural: false, homes: [LOTM_FLAT_HOME], materials: {[JSON.stringify({id: `${H}.wool_blanket`})]: 1}},
});
export const LOTM_HOMES = Object.freeze({
    [LOTM_FLAT_HOME]: {name: 'The Moretti flat', location: LOTM_FLAT_PLACE, tenure: 'rented', owner: LOTM_LANDLORD, price: 0, forms: ['human'], capacity: 10,
        description: 'The rented flat you share with your brother and sister. The landlord owns the walls and the bed.', startsHere: true,
        furnished: [`${H}.landlord_bed`]},
});
registerHomeWorld({worldId: LOTM_HOME_WORLD, furniture: LOTM_HOME_FURNITURE, places: LOTM_HOMES, rooms: LOTM_HOME_ROOMS, money: 'pence'});
