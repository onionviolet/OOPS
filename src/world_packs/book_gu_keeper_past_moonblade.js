import {keeperEchoMinutes, keeperTime as id, keeperTimeWorld} from '../gu_keeper_time.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = fact => ({fact, op: 'eq', value: true});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const practice = eq(extensionFact(kId('moonblade')));
const ready = all({fact: 'actor.life', op: 'eq', value: 'alive'}, eq('native.ready'), eq('native.alive'),
    ...['body.ownerId', 'body.controllerId'].map(fact => ({fact, op: 'eq', value: 'player'})));
const status = `${id}.seal`;

function command(operation, label, needs, reason, value) {
    return {
        id: `${id}.${operation}`, revision: 1, label, duration: 0, once: true, group: 'structured_local',
        worldId: keeperTimeWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: {...all(ready, admitted, practice, ...needs), reason}, costs: [],
        effects: [{type: 'guTime', actor: 'player', operation},
            {type: 'knowledge', actor: 'player', key: status, stage: 'understood', value}],
    };
}

export const guKeeperPastMoonblade = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Learn to borrow a past Moonblade',
    description: 'The steward lends you a seal that can borrow one of your earlier Moonblades.',
    requires: all(ready, practice),
    reason: 'Begin Moonblade practice first.',
    status: [{id: `${id}.seal_status`, label: 'Moonblade seal', knowledgeKey: status}],
    commands: [
        command('open', 'Open the Moonblade seal', [eq(`${id}.witnessed`)],
            'Cut a straw target with your Moonlight Gu, then wait a minute before opening the seal.',
            `The seal caught an earlier Moonblade. Use it within ${keeperEchoMinutes} minutes.`),
        command('cast', 'Cut the straw with the borrowed Moonblade', [eq(`${id}.ready`), eq(`actor.${kId('moonblade.target_ready')}`)],
            'Open the seal and set up a fresh target before it fades.',
            'Your earlier Moonblade cuts through the straw. The seal goes quiet.'),
    ],
};

export async function registerGuKeeperPastMoonblade(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperPastMoonblade, base);
    }
}
