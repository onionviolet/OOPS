// Frontier source for the groups projection (lane F step 1): the Market courtyard as a household business. Read-only; it reads
// the same facts organization_source.js reads (simulation people, mg.opened) and writes nothing. Authored proposal, not canon.
import {I} from './shared.js';
import {people} from './foundation.js';
import {registerGroupSource} from '../organizations.js';

const SOURCE = 'management/organization_source.js';
const LABELS = new Map(people.map(d => [d.id, d.label]));
const named = label => { const i = String(label).indexOf(', '); return i < 0 ? {name: String(label), role: ''} : {name: label.slice(0, i), role: label.slice(i + 2)}; };

export function courtyardGroups(state) {
    const s = state?.simulation, facts = state?.actors?.player?.facts;
    if (!s || facts?.['mg.opened'] !== true) return [];
    const members = [I.mira, I.orin, I.sela, I.bram].filter(id => s.people?.[id]).map(id => {
        const p = s.people[id], {name, role} = named(p.label || LABELS.get(id) || id);
        return {actor: id, name, ...(role ? {rank: role} : {}), status: p.life === 'alive' ? 'active' : 'inactive'};
    });
    return [{id: `${I.world}.group.courtyard`, world: I.world, kind: 'household_business', name: 'Market courtyard', status: 'active', authored: true, revision: 1,
        members,
        premises: [{id: I.bench, label: 'Shared workbench'}, {id: I.room, label: 'Concession room', heldByPlayer: facts['mg.roomOwned'] === true}, {id: I.plot, label: 'Planting plot'}],
        standing: {owner: 'faction_rank', region: 'Village'},
        sources: [{module: SOURCE, locator: 'courtyardOrganization'}]}];
}
registerGroupSource(I.world, courtyardGroups);
