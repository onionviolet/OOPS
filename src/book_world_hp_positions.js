// HG2 (FD15 third world shape: enrolment plus a house): Harry's posts once he is at Hogwarts, read-only and derived. Nothing is saved.
// Facts read, both on state.actors.player.facts: 'hp.lead.atSchool' (book_world_hp_duties.js; the gate) and 'hp.lead.house' (a house id).
// Nothing writes either yet: the lead life has one household act and no arrival or Sorting command, so no route reaches this row
// today. Whoever authors arrival sets atSchool; the locked-option Sorting (G9) sets the house through the HP lead domain command path.
// Mapping (authored proposal): enrolment is an 'enrolled' term with no fixed end; the house is a 'member' row. House points are NOT
// derived here (no owner holds a count); palette note: a points total would be a Merit-shape tally with the Head of House as awarder.
import {registerPositionSource} from './positions.js';
import {HP_AT_SCHOOL_FACT} from './book_world_hp_duties.js';
const WORLD = 'book.hp.lead.world', SOURCE = 'book_world_hp_positions.js';
export const HP_HOUSE_FACT = 'hp.lead.house';
export const HP_HOUSES = Object.freeze({gryffindor: 'Gryffindor', hufflepuff: 'Hufflepuff', ravenclaw: 'Ravenclaw', slytherin: 'Slytherin'});

export function hpPositions(state) {
    const a = state?.actors?.player;
    if(a?.worldId !== WORLD || a.facts?.[HP_AT_SCHOOL_FACT] !== true) return [];
    const rows = [{id: 'hp.position.pupil', institution: 'Hogwarts', role: 'Pupil', rank: 'first year', term: {type: 'enrolled'},
        duties: ['hp.lead.class_slot'], exit: {kinds: [], cost: 'Not modelled yet.'}, source: SOURCE}];
    const house = HP_HOUSES[a.facts?.[HP_HOUSE_FACT]];
    if(house) rows.push({id: 'hp.position.house', institution: `${house} house`, role: 'House member', rank: 'first year', term: {type: 'member'},
        exit: {kinds: [], cost: 'Not modelled yet.'}, source: SOURCE});
    return rows;
}
// Plain words, for example "Pupil, Hogwarts (first year); Gryffindor house".
export function hpPositionLine(rows) {
    return rows.map(r => r.id === 'hp.position.house' ? r.institution : `${r.role}, ${r.institution}${r.rank ? ` (${r.rank})` : ''}`).join('; ');
}
registerPositionSource('hp', hpPositions);
