import {antNestCost, antNestMaterial, antBroodRations} from '../gu_army_ants.js';
import {keeperAntNest as id, keeperAntWorld, antBroodMinutes, antNiche} from '../gu_keeper_ant_nest.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const annex = kId('annex');
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason && {reason})});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const can = (op, reason) => eq(`${id}.can_${op}`, true, reason);
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const stock = name => JSON.stringify({id: `${id}.${name}`});
const dose = stock('dose'), substrate = stock('substrate'), ration = stock('ration');
const change = operation => ({type: 'guAntNest', actor: 'player', operation});
const move = location => ({type: 'relocate', actor: 'player', location});

function command(operation, label, description, {needs = [can(operation)], costs = [], effects, duration = 0, location = annex} = {}) {
    const support = all(ready, admitted, ...needs);
    return {id: `${id}.${operation}`, revision: 1, label, description, duration, group: 'structured_local',
        worldId: keeperAntWorld, location, actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: support, costs, effects: effects ?? [change(operation)],
        ...(duration && {completionRequires: all(ready, admitted, can(operation)), completionCoLocated: true,
            completionFailure: 'refund', cancellation: 'refund', reservationReturns: 1})};
}

const stone = kKey('stone');
export const guKeeperAntNest = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Start an army-ant colony with Ant Nest',
    description: 'A visiting immortal offers a supervised use of Ant Nest. Raise a colony in the steward’s tray and send soldiers against the beetles in the storeroom.',
    requires: ready,
    reason: 'Visit the steward at the Gu house.',
    locations: [{id: antNiche, label: 'Cleared storeroom niche', underRoof: true,
        description: 'The beetles have scattered. An old bundle of Moon Orchid petals is tucked on the shelf.'}],
    items: [
        {id: `${id}.dose`, label: 'Rank-eight immortal essence dose', value: 0, description: 'A stored dose provided for Ant Nest.'},
        {id: `${id}.substrate`, label: 'Immortal ant-brood material', value: 0, description: 'The visiting immortal’s prepared material for Ant Nest to use.'},
        {id: `${id}.ration`, label: 'Army-ant brood ration', value: 0, description: 'Prepared with unmoving rotten water for the growing colony.'},
    ],
    commands: [
        command('borrow', 'Borrow Ant Nest', 'The steward hands you the visiting immortal’s rank-eight Gu.'),
        command('return_loan', 'Return Ant Nest', 'The living army ants stay in their tray.'),
        command('buy_inputs', 'Buy Ant Nest materials and essence · 1 stone', 'Buy one rank-eight dose and one portion of prepared immortal material.', {
            needs: [ge(`item.${stone}`, 1)], costs: [item(stone, -1)], effects: [item(dose, 1), item(substrate, 1)],
        }),
        command('buy_rations', 'Buy two army-ant brood rations · 1 stone', 'Feed the queen’s next two broods.', {
            needs: [ge(`item.${stone}`, 1)], costs: [item(stone, -1)], effects: [item(ration, 2)],
        }),
        command('seed', 'Use Ant Nest to found the colony · 1 dose and 1 material', 'Produce a queen and two workers in the empty tray.', {
            needs: [can('seed'), ge(`item.${dose}`, antNestCost), ge(`item.${substrate}`, antNestMaterial)],
            costs: [item(dose, -antNestCost), item(substrate, -antNestMaterial)],
        }),
        command('brood', `Tend the queen’s brood · 1 ration, ${antBroodMinutes} min`,
            'The queen and her workers raise one new worker and one soldier. The tray needs room for both.', {
                needs: [can('brood'), ge(`item.${ration}`, antBroodRations)], costs: [item(ration, -antBroodRations)],
                duration: antBroodMinutes,
            }),
        command('clear', 'Send soldiers to drive the beetles out', 'Two soldiers can clear the storeroom niche. One will be lost in the fight.', {
            needs: [can('clear', 'Raise at least two soldier ants.')], effects: [change('clear'), move(antNiche)],
        }),
        command('enter', 'Enter the cleared storeroom niche', 'The soldier ants have cleared the way.', {effects: [move(antNiche)]}),
        command('salvage', 'Bring down the bundle of Moon Orchid petals', 'Take four petals from the shelf.', {
            location: antNiche, effects: [item(kKey('petals'), 4)],
        }),
        command('back', 'Return to the Gu house', 'Step out of the niche.', {location: antNiche, needs: [], effects: [move(annex)]}),
    ],
};

export async function registerGuKeeperAntNest(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperAntNest, base);
    }
}
