import {moonlightProspect as id, moonlightTrial, moonlightTrialWorld,
    prospectWindowMinutes, prospectWorkMinutes} from '../gu_keeper_moonlight_trial.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const available = op => eq(`${id}.can_${op}`);
const energyId = kId('primeval');

function command(operation, label, description, {needs = [], costs = []} = {}) {
    return {id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: moonlightTrialWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, available(operation), ...needs), costs,
        effects: [{type: 'guMoonlightTrial', actor: 'player', operation}]};
}

export const guKeeperMoonlightProspect = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [moonlightTrial],
    label: 'Try a Moonblade from a possible future',
    description: 'The steward can lend you a Time Path seal while you prepare the borrowed Gu’s focus refinement.',
    requires: all(ready, available('prepare')),
    reason: 'Borrow the steward’s Moonlight Gu before refining its focus.',
    commands: [
        command('prepare', 'Prepare the focus refinement · 1 stone, 1 essence',
            `The stone and essence are used to prepare this Gu. It takes ${prospectWorkMinutes} minutes before you can finish.`, {
                needs: [eq(`faculty.${kId('aperture')}.active`), ge(`energy.${energyId}.reserve`, 1), ge(`item.${kKey('stone')}`, 1)],
                costs: [{type: 'energy', actor: 'player', energyId, operation: 'use', output: 1, control: 1},
                    {type: 'item', actor: 'player', key: kKey('stone'), amount: -1}],
            }),
        command('open', 'Open the seal on the prepared refinement',
            `The seal draws one cast from the possible result for ${prospectWindowMinutes} minutes. Returning the Gu breaks the connection.`),
        command('cast_future', 'Cut a fresh stack with the future Moonblade',
            'The seal supplies this cast’s essence. The living Gu still has its present focus.'),
        command('finish', 'Finish the borrowed Gu’s focus refinement',
            'Set the focus into the living Gu. The seal closes when the work ends.'),
        command('cancel', 'Stop the prepared focus refinement',
            'The seal closes and the Gu keeps its current focus. The preparation has already used the stone and essence.'),
    ],
};

export async function registerGuKeeperMoonlightProspect(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperMoonlightProspect, base);
    }
}
