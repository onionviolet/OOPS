import {isMoonlightTrialEffect, moonlightTrial as id, moonlightTrialWorld} from '../gu_keeper_moonlight_trial.js';
import {moonlightBlade} from '../gu_ability_profiles.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const ownsClanGu = eq(`claim.${kId('moon_title')}.owner`, 'player');
const essence = kId('primeval');
const charge = output => ({
    costs: Array.from({length: output}, () => ({
        type: 'energy', actor: 'player', energyId: essence, operation: 'use', output: 1, control: 1,
    })),
    needs: [eq(`faculty.${kId('aperture')}.active`), ge(`energy.${essence}.reserve`, output)],
});

function command(operation, label, description, {costs = [], needs = []} = {}) {
    const effect = {type: 'guMoonlightTrial', actor: 'player', operation};
    if (!isMoonlightTrialEffect(effect)) throw Error('Unknown Moonlight Gu trial operation.');
    return {
        id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: moonlightTrialWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, eq(`${id}.can_${operation}`), ...needs),
        costs, effects: [effect],
    };
}

const castCharge = charge(moonlightBlade.cost);
const tuning = charge(1);
export const guKeeperMoonlightTrial = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Compare two Moonlight Gu',
    description: 'The steward will lend you another rank-one Moonlight Gu and set up matching stacks of paper for the two blades. The steward feeds the loan Gu during the trial.',
    requires: all(ready, ownsClanGu),
    reason: 'Take in the clan Moonlight Gu first.',
    commands: [
        command('borrow', 'Borrow the steward’s Moonlight Gu', 'The steward lends you the same specimen each time.'),
        command('return_loan', 'Return the steward’s Moonlight Gu', 'Give the living Gu back to the steward.'),
        command('cast_clan', `Test your clan Moonblade · ${moonlightBlade.cost} essence`,
            'Use a fresh stack of paper. Your Moonlight Gu needs to be in full health.', castCharge),
        command('cast_loan', `Test the borrowed Moonblade · ${moonlightBlade.cost} essence`,
            'Use a fresh stack of the same paper at the same distance.', castCharge),
        command('tune', 'Refine the borrowed Gu’s focus · 1 stone, 1 essence',
            'The steward guides you through a refinement that tightens the blade of this Gu. Its rank stays the same.', {
                needs: [...tuning.needs, ge(`item.${kKey('stone')}`, 1)],
                costs: [...tuning.costs, {type: 'item', actor: 'player', key: kKey('stone'), amount: -1}],
            }),
    ],
};

export async function registerGuKeeperMoonlightTrial(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperMoonlightTrial, base);
    }
}
