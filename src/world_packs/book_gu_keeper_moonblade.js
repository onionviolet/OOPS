import {resolveGuActivation} from '../gu_activation.js';
import {moonlightBlade} from '../gu_ability_profiles.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper.js';

const id = kId('moonblade');
const key = name => `${id}.${name}`;
const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const moon = kId('moon');
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const ownsGu = eq(`claim.${kId('moon_title')}.owner`, 'player');
const admitted = eq(extensionFact(id));
const targetReady = eq(`actor.${key('target_ready')}`);
const targetState = value => ({type: 'fact', scope: 'actor', actor: 'player', key: key('target_ready'), value});
const effectNote = (value) => ({type: 'knowledge', actor: 'player', key: key('practice'), stage: 'understood', value});
const essenceId = kId('primeval');
const quote = resolveGuActivation({
    stages: [{gu: {id: moon, kind: 'moonlight', fedThrough: 0}, operator: 'player', ability: moonlightBlade}],
    reserves: {player: {primeval: moonlightBlade.cost}}, day: 0,
});
const cost = quote.activations[0].cost;

function practiceCommand(name, label, duration, support, extra) {
    return {
        id: key(name), revision: 1, label, duration, group: 'structured_local',
        worldId: kId('world'), location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: support, completionRequires: support, completionCoLocated: true,
        cancellation: 'refund', completionFailure: 'refund', reservationReturns: 1, costs: [], ...extra,
    };
}

const castSupport = all(ready, admitted, ownsGu, targetReady, eq('target.life', 'alive'),
    eq('target.body.controllerId', 'player'), ge('target.vital.health', 3), eq(`faculty.${kId('aperture')}.active`));

export const guKeeperMoonblade = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Moonblade practice',
    description: 'The steward lends you a stand for a straw target. Try cutting it with your Moonlight Gu.',
    requires: all(ready, ownsGu),
    reason: 'Take in the Moonlight Gu before beginning practice.',
    status: [{id: key('practice_status'), label: 'Straw target', knowledgeKey: key('practice')}],
    commands: [
        practiceCommand('set_target', 'Set up a straw target', 1, all(ready, admitted), {
            effects: [targetState(true), effectNote('A fresh straw target stands ready.')],
        }),
        practiceCommand('cut_target', `Throw a Moonblade · ${cost} essence`, 5, castSupport, {
            targetId: moon, coLocated: true, participants: ['$target'],
            requires: {...all(castSupport, ge(`energy.${essenceId}.reserve`, cost)),
                reason: 'Set up a target, bring your Moonlight Gu in good health, and gather enough essence.'},
            // The Keeper aperture releases one unit per draw.
            costs: Array.from({length: cost}, () => ({
                type: 'energy', actor: 'player', energyId: essenceId, operation: 'use', output: 1, control: 1,
            })),
            effects: [targetState(false), effectNote('The Moonblade cut the straw target in two.')],
        }),
    ],
};

export async function registerGuKeeperMoonblade(register, base) {
    if (register.extension && base.contentHash === baseHash) await register.extension(guKeeperMoonblade, base);
}
