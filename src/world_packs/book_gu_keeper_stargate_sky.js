import {keeperGate, keeperGateSky as id, quoteKeeperStargate} from '../gu_stargate.js';
import {keeperFarmWorld} from '../gu_keeper_colony.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const gates = eq(extensionFact(keeperGate));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));

function crossing(name, label, from) {
    const {destination} = quoteKeeperStargate(from, 'sky');
    return {
        id: `${id}.${name}`, revision: 1, label,
        description: 'Light from the night sky opens both gates. Keep the firefly Gu you are carrying.',
        duration: 0, group: 'structured_local', worldId: keeperFarmWorld, location: from,
        actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: {...all(ready, admitted, gates, eq(`${id}.ready`)),
            reason: 'Both gates need a clear view of the stars. Try between 21:00 and 04:00 on a clear night.'},
        costs: [], effects: [{type: 'relocate', actor: 'player', location: destination}],
    };
}

export const guKeeperStargateSky = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperGate],
    label: 'Open the Stargates with natural starlight',
    description: 'The steward shows you how to gather light from the open sky at each gate. The annex has a narrower view than the hill.',
    requires: all(ready, gates),
    reason: 'Try the paired Stargates first.',
    commands: [
        crossing('cross_out', 'Cross to the hill by natural starlight', kId('annex')),
        crossing('cross_back', 'Cross to the Gu house by natural starlight', `${keeperGate}.observatory`),
    ],
};

export async function registerGuKeeperStargateSky(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperStargateSky, base);
    }
}
