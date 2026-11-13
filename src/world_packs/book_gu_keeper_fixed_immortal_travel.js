import {keeperFixedTravel as id, keeperFixedTravelWorld, fixedTravelDose, fixedTravelCost,
    fixedTravelAnnex, fixedTravelHill, fixedTravelMemory, fixedTravelScene} from '../gu_keeper_immortal_travel.js';
import {keeperGate} from '../gu_stargate.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const handleGu = operation => ({type: 'guFixedTravel', actor: 'player', operation});
const can = operation => eq(`${id}.can_${operation}`);

function command(operation, label, location, description, needs, effects, costs = []) {
    return {id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperFixedTravelWorld, location, actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, ...needs), costs, effects};
}

function remember(operation, label, location) {
    return command(operation, label, location, 'Take in the layout so you can picture this landing clearly.', [],
        [{type: 'knowledge', actor: 'player', key: fixedTravelMemory(location), stage: 'understood', value: fixedTravelScene(location)}]);
}

function travel(operation, label, from, to) {
    return command(operation, label, from, 'Picture the landing and supply the borrowed Gu with stored immortal essence.',
        [can(operation), ge(`item.${fixedTravelDose}`, fixedTravelCost)],
        [handleGu(operation), {type: 'relocate', actor: 'player', location: to}], [item(fixedTravelDose, -fixedTravelCost)]);
}

export const guKeeperFixedImmortalTravel = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperGate],
    label: 'Borrow Fixed Immortal Travel',
    description: 'A visiting immortal has left a living rank-six Gu with the steward. Take in each landing in person and buy green grape immortal essence for the trip.',
    requires: all(ready, eq(extensionFact(keeperGate))),
    reason: 'Open the observatory route with the paired Stargates first.',
    items: [{id: `${id}.green_grape`, label: 'Green grape immortal essence', value: 0,
        description: 'A stored dose of rank-six immortal essence for the visiting immortal’s Gu.'}],
    commands: [
        command('borrow', 'Take the Fixed Immortal Travel loan', fixedTravelAnnex,
            'The steward hands you the visiting immortal’s living Gu.', [can('borrow')], [handleGu('borrow')]),
        command('return_loan', 'Return Fixed Immortal Travel to the steward', fixedTravelAnnex,
            'Put the same living Gu back in the steward’s care.', [can('return_loan')], [handleGu('return_loan')]),
        command('buy_dose', 'Buy green grape immortal essence · 1 stone', fixedTravelAnnex,
            'Buy one stored dose from the steward.', [ge(`item.${kKey('stone')}`, 1)], [item(fixedTravelDose, 1)], [item(kKey('stone'), -1)]),
        remember('remember_annex', 'Study the Gu house landing', fixedTravelAnnex),
        remember('remember_hill', 'Study the hill landing', fixedTravelHill),
        travel('travel_out', 'Use Fixed Immortal Travel to the hill · 1 dose', fixedTravelAnnex, fixedTravelHill),
        travel('travel_back', 'Use Fixed Immortal Travel to the Gu house · 1 dose', fixedTravelHill, fixedTravelAnnex),
    ],
};

export async function registerGuKeeperFixedImmortalTravel(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperFixedImmortalTravel, base);
    }
}
