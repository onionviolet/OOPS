import {fightCharge} from '../gu_fighting_spirit.js';
import {keeperSpirit as id, keeperSpiritWorld, spiritHealth} from '../gu_keeper_spirit.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const can = op => eq(`${id}.can_${op}`);
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const stone = kKey('stone');
const bead = JSON.stringify({id: `${id}.red_date`});
const use = operation => ({type: 'guSpirit', actor: 'player', operation});
const energy = (policy, operation) => ({type: 'energy', actor: 'player', energyId: policy.id, operation,
    ...(operation === 'recover' && {amount: policy.capacity})});

function command(operation, label, description, {needs = [can(operation)], costs = [], effects, duration = 0} = {}) {
    const support = all(ready, admitted, ...needs);
    return {id: `${id}.${operation}`, revision: 1, label, description, duration, group: 'structured_local',
        worldId: keeperSpiritWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: support, costs, effects: effects ?? [use(operation)],
        ...(duration && {completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
            cancellation: 'refund', reservationReturns: 1})};
}

function attempt(operation, label, description) {
    const full = operation !== 'abort';
    return command(operation, label, description, {needs: [can('attempt'), eq(`faculty.${kId('aperture')}.active`),
        ...(full ? [ge(`item.${bead}`, fightCharge)] : [])], costs: full ? [item(bead, -fightCharge)] : []});
}

export const guKeeperSpirit = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Rehearse Soaring Fighting Spirit',
    description: 'Try the order of a visiting immortal’s move with the steward. You can stop after the mortal supports or see what happens when the core outruns them.',
    requires: ready,
    reason: 'Visit the steward at the Gu house.',
    energies: Object.values(spiritHealth),
    items: [{id: `${id}.red_date`, label: 'Red date immortal essence', value: 0, description: 'A bead of stored rank-seven essence.'}],
    commands: [
        command('borrow', 'Borrow Fight Immortal Gu', 'The visitor lets you use the same living rank-seven Gu during rehearsal.'),
        command('return_loan', 'Return Fight Immortal Gu', 'Place the living core back with the steward.'),
        command('prepare', 'Learn the mind and soul exercises', 'The visiting immortal shows you how to steady your thoughts and soul.', {
            effects: Object.values(spiritHealth).flatMap(policy => [energy(policy, 'learn'), energy(policy, 'recover')]),
        }),
        command('buy_supports', 'Buy a pair of mortal support Gu · 1 stone', 'Buy the two living supports used in the rehearsal.', {
            needs: [can('buy_supports'), ge(`item.${stone}`, 1)], costs: [item(stone, -1)],
        }),
        command('buy_beads', 'Buy three red date beads · 1 stone', 'Set aside the Immortal essence needed by Fight Gu.', {
            needs: [ge(`item.${stone}`, 1)], costs: [item(stone, -1)], effects: [item(bead, fightCharge)],
        }),
        attempt('abort', 'Stop after the two mortal supports', 'Spend two primeval essence and stop before charging Fight Gu.'),
        attempt('rush', 'Rush Fight Gu after the supports', 'Spend two primeval essence and three red date beads. The backlash destroys both supports and injures your mind and soul.'),
        attempt('steady', 'Complete a steady Fighting Spirit rehearsal', 'Spend two primeval essence and three red date beads. Let the steward feel the completed effect.'),
        ...Object.entries(spiritHealth).map(([aspect, policy]) =>
            command(`recover_${aspect}`, aspect === 'mind' ? 'Settle your thoughts · 30 min' : 'Steady your soul · 60 min',
                'Use the visiting immortal’s supervised recovery exercise.', {
                    needs: [{fact: `energy.${policy.id}.reserve`, op: 'lte', value: policy.capacity - 1}],
                    effects: [energy(policy, 'recover')], duration: aspect === 'mind' ? 30 : 60,
                })),
        command('supplies', 'Collect the steward’s practice supplies', 'Take four petals after the steward resumes practice.', {
            effects: [item(kKey('petals'), 4)],
        }),
    ],
};

export async function registerGuKeeperSpirit(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperSpirit, base);
    }
}
