import {keeperFarm, keeperFarmWorld, keeperFireflyCare as id} from '../gu_keeper_colony.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const tend = eq(`${keeperFarm}.ready`);
const kept = eq(`${id}.kept`);
const essence = kId('primeval');
const result = `${id}.result`;

function command(operation, label, needs, note, costs = []) {
    return {
        id: `${id}.${operation}`, revision: 1, label, duration: 0, group: 'structured_local',
        worldId: keeperFarmWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, tend, ...needs), costs,
        effects: [{type: 'guColony', actor: 'player', operation},
            {type: 'knowledge', actor: 'player', key: result, stage: 'understood', value: note}],
    };
}

export const guKeeperFireflyCare = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Keep a Starlight Firefly Gu',
    description: 'The steward offers a small shaded enclosure for one Gu from the colony.',
    requires: all(ready, eq(extensionFact(keeperFarm)), eq(`${keeperFarm}.active`)),
    reason: 'Set up your firefly bed first.',
    status: [{id: `${id}.result_status`, label: 'Enclosure', knowledgeKey: result}],
    commands: [
        command('keep', 'Move one firefly Gu to the enclosure', [eq(`${id}.kept`, false), ge(`${keeperFarm}.emerged`, 1)],
            'You settle one Gu in the shaded enclosure.'),
        command('shine', 'Draw starlight from the firefly Gu · 1 essence', [kept, eq(`${id}.tired`, false),
            eq(`${id}.resting`, false), eq(`faculty.${kId('aperture')}.active`), ge(`energy.${essence}.reserve`, 1)],
            'Starlight glows across the annex. The firefly Gu dims and needs rest.',
            [{type: 'energy', actor: 'player', energyId: essence, operation: 'use', output: 1, control: 1}]),
        command('care', 'Let the firefly rest in the shade', [kept, eq(`${id}.tired`), eq(`${id}.resting`, false)],
            'The Gu settles into the shade. Give it half an hour to rest.'),
    ],
};

export async function registerGuKeeperFireflyCare(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperFireflyCare, base);
    }
}
