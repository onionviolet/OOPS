import {homeMarketActions} from './home_market_actions.js';
// W2c, LT10 for Harry (proposal under AD32, docs/CROSS_WORLD_SYSTEMS_TRANSFER.md): his guardians' house as a home, first through the
// world home port (read side) and, since W3a, as a home in the shared home engine (the second world on its write side after Klein's flat).
// Canon (book 1): Harry sleeps in the cupboard under the stairs in his aunt and uncle's house, with his cousin; he pays nothing and owns
// nothing kept there. Authored (not canon): the ids, the mattress row, the capacity.
// Default, dial and reason. Tenure: tied, owned by his guardians (TENURE_RIGHTS.tied: he may keep a few things, he may not change
// anything). Dial: a world or a later window can grant rights on the row. Reason: the cupboard is lent to him, not his.
// The dormitory is not a location in the lead life yet; it becomes a second home row (shared, a trunk and a bedside) when it is one.
import {worldHomeModel, homeModelLines} from './home_overview_model.js';
import {registerHomeWorld, homeRights, homeKey} from './home_content.js';

const P = 'book.hp.lead';
export const HP_HOUSE_PLACES = Object.freeze([`${P}.cupboard`, `${P}.kitchen`, `${P}.hall`]);
export const HP_HOUSE_RESIDENTS = Object.freeze([
    Object.freeze({id: `${P}.vernon`, name: 'Your uncle'}), Object.freeze({id: `${P}.petunia`, name: 'your aunt'}),
    Object.freeze({id: `${P}.dudley`, name: 'your cousin'})]);
export const HP_CUPBOARD_HOME = `${P}.world.home.cupboard`;
export const HP_DORM_HOME = `${P}.world.home.gryffindor_dormitory`;
const DORM_BED = `${P}.world.home.school_bed`, TRUNK = `${P}.world.home.school_trunk`;
const MATTRESS = `${P}.world.home.cupboard_mattress`;
export const HP_HOME_FURNITURE = Object.freeze({
    [DORM_BED]: {name: 'Four-poster bed', slot: 'bed', price: 0, forms: ['human'], effects: {}, description: 'A school bed behind red curtains.'},
    [TRUNK]: {name: 'School trunk', slot: 'box', price: 0, forms: ['human'], effects: {storage: 12}, description: 'Your trunk at the foot of the bed.'},
    [MATTRESS]: {name: 'Thin mattress', slot: 'bed', price: 0, forms: ['human'], effects: {}, description: 'A thin mattress on the cupboard floor, your guardians’.'}});
registerHomeWorld({worldId: `${P}.world`, furniture: HP_HOME_FURNITURE,
    places: {[HP_CUPBOARD_HOME]: {name: 'The cupboard under the stairs', location: `${P}.cupboard`, tenure: 'tied', owner: `${P}.guardians`, price: 0,
        forms: ['human'], capacity: 3, description: 'A narrow space under the stairs with a mattress, a spider or two, and no lock on your side.',
        startsHere: true, furnished: [MATTRESS]},
    [HP_DORM_HOME]: {name: 'Gryffindor first-year dormitory', location: `${P}.dormitory`, tenure: 'shared', owner: `${P}.school`, price: 0,
        forms: ['human'], capacity: 6, description: 'Your bed and trunk in the first-year boys’ dormitory.', startsHere: true, furnished: [DORM_BED, TRUNK]}}});

// Dormitory access follows the Sorting. These are travel commands on the same native ledger as lessons.
export const hpLeadHomeCommands = [
    ['go_dormitory', 'Go up to your dormitory', 'school_hall', 'dormitory'],
    ['leave_dormitory', 'Go down to the Great Hall', 'dormitory', 'school_hall'],
].map(([key, label, from, to]) => ({id: `${P}.${key}`, revision: 1, label, description: label, group: 'structured_local', worldId: `${P}.world`, actorId: 'player',
    location: `${P}.${from}`, audience: ['$actor'], costs: [], requires: {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, {fact: 'actor.hp.lead.house', op: 'eq', value: 'gryffindor'}]},
    effects: [{type: 'relocate', actor: 'player', location: `${P}.${to}`}]}));

export function hpLeadHomeView(state, {homes = null, quote = null} = {}) {
    const at = state?.simulation?.people?.player?.location, here = HP_HOUSE_PLACES.includes(at);
    const residents = HP_HOUSE_RESIDENTS.filter(r => state?.simulation?.people?.[r.id]);
    const atSchool = state?.actors?.player?.facts?.['hp.lead.atSchool'] === true;
    const residenceId = atSchool ? HP_DORM_HOME : HP_CUPBOARD_HOME;
    const model = worldHomeModel({homeId: residenceId, place: {id: `${P}.house`, name: 'Your guardians’ house'}, tenure: atSchool ? 'shared school room' : 'your guardians’', here: atSchool ? at === `${P}.dormitory` : here,
        ...(atSchool ? {place: {id: HP_DORM_HOME, name: 'Your school dormitory'}} : {}),
        residents: atSchool ? (state?.actors?.player?.facts?.['hp.lead.house'] === 'gryffindor' ? [{id: `${P}.ron`, name: 'Ron'}] : []) : residents, dues: [], stores: [], empty: atSchool ? 'Your bed and trunk are upstairs.' : 'Nothing of your own is kept here; your bed is in the cupboard under the stairs.'}, homes);
    const lines = [here ? 'You are at home.' : 'You are away from the house.', ...homeModelLines(model)];
    const cupboard = homes?.state?.properties?.[HP_CUPBOARD_HOME] || null, actions = [];
    if(cupboard) {
        const rights = homeRights(HP_CUPBOARD_HOME);
        const fitted = Object.values(cupboard.fixtures).map(r => HP_HOME_FURNITURE[JSON.parse(r.key).id]?.name).filter(Boolean);
        lines.push(`The cupboard is yours to sleep in: ${fitted.join(', ').toLowerCase() || 'nothing'} (your guardians’).`,
            `${rights.reason} You may keep up to ${3 - Object.values(cupboard.stock).reduce((a, b) => a + b, 0)} small things there.`);
    } else if(at === `${P}.cupboard` && typeof quote === 'function') {
        const request = {type: 'settle_world_home', home: HP_CUPBOARD_HOME}, q = quote(request);
        actions.push({id: 'settle', label: 'Claim the cupboard as your own corner', request, eligible: q.eligible, reason: q.eligible ? '' : q.reason});
    }
    if(at === `${P}.dormitory` && !homes?.state?.properties?.[HP_DORM_HOME] && typeof quote === 'function') {
        const request={type: 'settle_world_home', home: HP_DORM_HOME}, q=quote(request);
        actions.push({id: 'settle_dorm', label: 'Settle into your bed and trunk', request, eligible: q.eligible, reason: q.reason || ''});
    }
    return {model, lines, actions: [...actions,...homeMarketActions(state,homes,quote)], travel: hpLeadHomeCommands.filter(c => c.location === at && atSchool && state?.actors?.player?.facts?.['hp.lead.house'] === 'gryffindor').map(c => c.id), settled: !!cupboard};
}
export const hpCupboardMattressKey = homeKey(MATTRESS);
