import {keeperGoal as id, keeperGoalWorld, keeperGoalBay, keeperGoalAttempts} from '../gu_keeper_goal.js';
import {keeperMoveTrial} from '../gu_keeper_move_trial.js';
import {keeperProcedure} from '../gu_keeper_procedure.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const annex = kId('annex');
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const aperture = eq(`faculty.${kId('aperture')}.active`);
const can = op => eq(`${id}.can_${op}`);
const move = location => ({type: 'relocate', actor: 'player', location});

function command(operation, label, description, needs, effects, location = annex) {
    return {id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperGoalWorld, location, actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, ...needs), costs: [], effects};
}

const exercise = (operation, label, description) => command(operation, label, description, [can(operation), aperture],
    [{type: 'guGoal', actor: 'player', operation}]);

export const guKeeperGoal = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperMoveTrial, keeperProcedure],
    label: 'Find a way to open the jammed screen',
    description: 'Compare what your Gu can do to a jammed storeroom screen. You can cut its cord or work the counterweight.',
    requires: ready,
    reason: 'Take up Moonblade research and the beam rehearsal first.',
    locations: [{id: keeperGoalBay, label: 'Storeroom behind the screen', underRoof: true,
        description: 'The open screen reveals a small shelf of supplies.'}],
    commands: [
        exercise('research', 'Research ways to open the screen', 'Compare the methods you can support with the Gu and essence you have now.'),
        ...keeperGoalAttempts.map((operation, index) => exercise(operation, `Try written screen method ${index + 1}`,
            'Use the specific Gu named in the notes. Earlier activations still cost essence if the move stops.')),
        command('enter', 'Go through the open screen', 'Enter by the route you opened.', [can('enter')], [move(keeperGoalBay)]),
        command('salvage', 'Take the petals from the shelf', 'Collect four Moon Orchid petals.', [can('salvage')],
            [{type: 'item', actor: 'player', key: kKey('petals'), amount: 4}], keeperGoalBay),
        command('back', 'Return to the Gu house', 'Step out from behind the screen.', [], [move(annex)], keeperGoalBay),
    ],
};

export async function registerGuKeeperGoal(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperGoal, base);
    }
}
