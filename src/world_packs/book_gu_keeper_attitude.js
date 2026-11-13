import {attitudeAbility} from '../gu_attitude.js';
import {keeperAttitude as id, keeperAttitudeWorld, attitudeMinutes, mentalEnergy} from '../gu_keeper_attitude.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const can = op => eq(`${id}.can_${op}`);
const energy = (operation, fields = {}) => ({type: 'energy', actor: 'player', energyId: mentalEnergy.id, operation, ...fields});
const mentalKnown = eq(`energy.${mentalEnergy.id}.known`);
const restored = energy('recover', {amount: mentalEnergy.capacity});

function command(operation, label, description, {needs = [can(operation)], costs = [], effects, duration = 0} = {}) {
    const support = all(ready, admitted, ...needs);
    return {id: `${id}.${operation}`, revision: 1, label, description, duration, group: 'structured_local',
        worldId: keeperAttitudeWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: support, costs,
        effects: effects ?? [{type: 'guAttitude', actor: 'player', operation}],
        ...(duration && {completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
            cancellation: 'refund', reservationReturns: 1})};
}

export const guKeeperAttitude = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Practice with Attitude Gu',
    description: 'A visiting immortal offers a supervised trial of the rank-eight mask. See how the steward responds when you ask for practice petals.',
    requires: ready,
    reason: 'Continue at the Gu house with a ready body.',
    energies: [mentalEnergy],
    commands: [
        command('borrow', 'Borrow Attitude Gu', 'Take the living mask from the steward for the supervised exercise.'),
        command('return_loan', 'Return Attitude Gu', 'Give the living mask back and end any effect it is producing.'),
        command('center', 'Learn to gather your thoughts', 'Prepare your attention for the exercise.', {
            effects: [energy('learn'), restored],
        }),
        command('recover', 'Rest your mind · 30 min', 'Recover the mental energy you spent on the mask.', {
            duration: 30, needs: [mentalKnown, {fact: `energy.${mentalEnergy.id}.reserve`, op: 'lte', value: mentalEnergy.capacity - 1}],
            effects: [restored],
        }),
        command('wear', `Wear Attitude Gu · ${attitudeAbility.cost} mental energy`,
            `The mask lends you a composed demeanor for ${attitudeMinutes} minutes.`, {
                needs: [can('wear'), mentalKnown, {fact: `energy.${mentalEnergy.id}.reserve`, op: 'gte', value: attitudeAbility.cost}],
                costs: [energy('use', {output: attitudeAbility.cost, control: 1})],
            }),
        command('remove', 'Take off Attitude Gu', 'Let the projected demeanor fade. The mental energy is already spent.'),
        command('ask', 'Ask the steward about practice petals', 'Listen to how the steward answers your request.'),
        command('collect', 'Collect the petals set aside for practice', 'Show the entry for your own Moonlight Gu in the clan ledger.', {
            needs: [can('collect'), eq(`claim.${kId('moon_title')}.owner`, 'player')],
            effects: [{type: 'item', actor: 'player', key: kKey('petals'), amount: 4}],
        }),
    ],
};

export async function registerGuKeeperAttitude(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperAttitude, base);
    }
}
