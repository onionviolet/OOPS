import {keeperFarm as id, keeperFarmWorld} from '../gu_keeper_colony.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const admitted = eq(extensionFact(id));
const canTend = eq(`${id}.ready`);
const stones = `item.${kKey('stone')}`;

function command(operation, label, needs, cost = 0) {
    return {
        id: `${id}.${operation}`, revision: 1, label, duration: 0, group: 'structured_local',
        worldId: keeperFarmWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, ...needs, ...(cost ? [ge(stones, cost)] : [])),
        costs: cost ? [{type: 'item', actor: 'player', key: kKey('stone'), amount: -cost}] : [],
        effects: [{type: 'guColony', actor: 'player', operation}],
    };
}

export const guKeeperFireflyFarm = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Raise starlight fireflies',
    description: 'Set a cloud-soil bed under the annex awning. Star fragment grass feeds the ordinary fireflies, and a thriving colony can produce Gu.',
    requires: ready,
    reason: 'Speak to the steward at the Gu house.',
    items: [{id: `${id}.starlight_firefly`, label: 'Starlight Firefly Gu',
        description: 'A Gu collected from the ordinary starlight firefly colony.', value: 0}],
    commands: [
        command('start', 'Set up the firefly bed · 2 stones', [eq(`${id}.active`, false)], 2),
        command('expose', 'Open the shade over the firefly bed', [canTend, eq(`${id}.light`, 'shaded')]),
        command('shade', 'Shade the firefly bed', [canTend, eq(`${id}.light`, 'exposed')]),
        command('plant', 'Plant more star fragment grass · 1 stone', [canTend], 1),
        command('collect', 'Collect a Starlight Firefly Gu', [canTend, ge(`${id}.emerged`, 1)]),
        command('advance', 'Check the overdue firefly bed', [eq(`${id}.pending`)]),
    ],
};

export async function registerGuKeeperFireflyFarm(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperFireflyFarm, base);
    }
}
