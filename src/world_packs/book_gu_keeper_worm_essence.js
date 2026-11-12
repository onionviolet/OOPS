import {keeperTrailWine, keeperWild, keeperWildWorld, keeperWormEssence as id} from '../gu_keeper_wild.js';
import {liquorWormConversion} from '../gu_liquor_worm.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = fact => ({fact, op: 'eq', value: true});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const trail = eq(extensionFact(keeperWild));
const ready = all({fact: 'actor.life', op: 'eq', value: 'alive'}, eq('native.ready'), eq('native.alive'),
    ...['body.ownerId', 'body.controllerId'].map(fact => ({fact, op: 'eq', value: 'player'})));
const aperture = eq(`faculty.${kId('aperture')}.active`);
const energyId = kId('primeval');
const cost = liquorWormConversion.cost;

function command(operation, label, description, reason, needs = [], costs = []) {
    return {
        id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperWildWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: {...all(ready, admitted, trail, eq(`${id}.can_${operation}`), ...needs), reason},
        costs, effects: [{type: 'guWild', actor: 'player', operation}],
    };
}

export const guKeeperWormEssence = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperWild],
    label: 'Refine essence with the wild Liquor Worm',
    description: 'Feed the captured Worm wine, refine its control, then use it to concentrate your green-copper essence.',
    requires: all(ready, trail),
    reason: 'Take up the Liquor Worm trail first.',
    commands: [
        command('feed', 'Feed the Liquor Worm · 1 wine', 'One portion keeps the Worm fed for a day.',
            'Hold the Worm, bring wine and wait until its next meal.',
            [ge(`item.${keeperTrailWine}`, 1)], [{type: 'item', actor: 'player', key: keeperTrailWine, amount: -1}]),
        command('convert', `Concentrate green-copper essence · ${cost} essence`, 'Make one middle-stage measure. It stays at rank one.',
            'Feed the Worm, refine its control and gather enough essence.',
            [aperture, ge(`energy.${energyId}.reserve`, cost)],
            Array.from({length: cost}, () => ({type: 'energy', actor: 'player', energyId, operation: 'use', output: 1, control: 1}))),
        command('cast_middle', 'Test a Moonblade with middle-stage essence · 1 measure',
            'Use the stronger green-copper essence on a fresh paper target.',
            'Bring a ready Moonlight Gu and a middle-stage measure.', [aperture]),
    ],
};

export async function registerGuKeeperWormEssence(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperWormEssence, base);
    }
}
