// W2c, LT10 read side for Harry (proposal under AD32, docs/CROSS_WORLD_SYSTEMS_TRANSFER.md): his guardians' house as a home view,
// through the same world port as Klein's flat (home_overview_model.worldHomeModel). Second world on the port (AR11).
// Canon (book 1): Harry sleeps in the cupboard under the stairs in his aunt and uncle's house, with his cousin; he pays nothing
// and owns nothing kept there. Default: no dues, nothing stored, and the house is "home" until a school bed is a place.
// Dial: a dormitory location adds a second home row with its own residents. Reason: the lead's home is who he lives with.
import {worldHomeModel, homeModelLines} from './home_overview_model.js';

const P = 'book.hp.lead';
export const HP_HOUSE_PLACES = Object.freeze([`${P}.cupboard`, `${P}.kitchen`, `${P}.hall`]);
export const HP_HOUSE_RESIDENTS = Object.freeze([
    Object.freeze({id: `${P}.vernon`, name: 'Your uncle'}), Object.freeze({id: `${P}.petunia`, name: 'your aunt'}),
    Object.freeze({id: `${P}.dudley`, name: 'your cousin'})]);

export function hpLeadHomeView(state) {
    const here = HP_HOUSE_PLACES.includes(state?.simulation?.people?.player?.location);
    const residents = HP_HOUSE_RESIDENTS.filter(r => state?.simulation?.people?.[r.id]);
    const model = worldHomeModel({place: {id: `${P}.house`, name: 'Your guardians’ house'}, tenure: 'your guardians’', here,
        residents, dues: [], stores: [], empty: 'Nothing of your own is kept here; your bed is in the cupboard under the stairs.'});
    return {model, lines: [here ? 'You are at home.' : 'You are away from the house.', ...homeModelLines(model)]};
}
