import {quoteKeeperStargate} from '../gu_stargate.js';
import {fireflyItem, keeperFarm, keeperFarmWorld} from '../gu_keeper_colony.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper.js';

const id = kId('stargate');
const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const annex = kId('annex');
const observatory = `${id}.observatory`;
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const move = location => ({type: 'relocate', actor: 'player', location});
function command(name, label, location, extra) {
    return {
        id: `${id}.${name}`, revision: 1, label, duration: 0, group: 'structured_local',
        worldId: keeperFarmWorld, location, actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, costs: [], ...extra,
    };
}

function cross(name, label, from) {
    const {destination, spent} = quoteKeeperStargate(from, 'firefly');
    return command(name, label, from, {
        description: 'The supplied starlight opens the paired gate. The Gu providing it is spent in the crossing.',
        requires: {...all(ready, admitted, {fact: `item.${fireflyItem}`, op: 'gte', value: spent}),
            reason: 'Collect a Starlight Firefly Gu before using this gate.'},
        costs: [{type: 'item', actor: 'player', key: fireflyItem, amount: -spent}],
        effects: [move(destination)],
    });
}

export const guKeeperStargate = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Try the paired Stargates',
    description: 'The steward lends you a pair of rank-five Stargate Gu. One opens from the annex, and the other stands at the hill observatory. The steward keeps both ready. You supply the starlight for each crossing.',
    requires: all(ready, eq(extensionFact(keeperFarm)), eq(`${keeperFarm}.active`)),
    reason: 'Set up the firefly bed first.',
    locations: [{id: observatory, label: 'Hill observatory', underRoof: false,
        description: 'A Stargate stands on the stone terrace. A footpath leads down to the Gu house.'}],
    commands: [
        cross('cross_out', 'Cross to the hill observatory · 1 firefly Gu', annex),
        cross('cross_back', 'Cross back to the Gu house · 1 firefly Gu', observatory),
        command('walk_back', 'Walk back to the Gu house · 60 min', observatory, {
            duration: 60, requires: all(ready, admitted), completionRequires: all(ready, admitted),
            cancellation: 'refund', completionFailure: 'refund', completionCoLocated: true, reservationReturns: 1,
            effects: [move(annex)],
        }),
    ],
};

export async function registerGuKeeperStargate(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperStargate, base);
    }
}
