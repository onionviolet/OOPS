import {keeperCooperation as id, keeperCooperationWorld, keeperFutureMoth as futureId, keeperWitnessedMoth as pastId, mothClue, mothMeal,
    mothLightMinutes, mothLessonMinutes, mothSealMinutes} from '../gu_keeper_cooperation.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const petals = kKey('petals');
const item = amount => ({type: 'item', actor: 'player', key: petals, amount});

function command(operation, label, description, {needs = [], costs = [], effects, duration = 0, pack = id} = {}) {
    const permission = pack === id ? admitted : eq(extensionFact(pack));
    const support = all(ready, permission, eq(`${pack}.can_${operation}`), ...needs);
    return {id: `${pack}.${operation}`, revision: 1, label, description, duration, group: 'structured_local',
        worldId: keeperCooperationWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: permission, requires: support, costs,
        effects: effects ?? [{type: 'guCooperation', actor: 'player', operation}],
        ...(duration > 0 && {cancellation: 'refund', reservationReturns: 1, completionRequires: support,
            completionCoLocated: true, completionFailure: 'refund'})};
}

export const guKeeperInsightMoth = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Make a quiet place for an Insight Moth',
    description: 'An unrefined Gu has been visiting the annex. The steward suggests clearing a sheltered spot on your desk.',
    requires: all(ready, eq(`${id}.can_meet`)),
    reason: 'Speak to the steward at the Gu house.',
    status: [{id: `${id}.field_note`, label: 'Orchid grove', knowledgeKey: mothClue}],
    commands: [
        command('meet', 'Clear a sheltered spot for the Insight Moth',
            'Let the moth settle beside you. It pauses when you open your field notes.'),
        command('leave', 'Leave the moth with the steward', 'Move its shelter to the steward’s desk.'),
        command('recall', 'Bring the moth back to your desk', 'Move its shelter back to your desk.'),
        command('feed', `Set out ${mothMeal} Moon Orchid petals`,
            'Give the petals to whoever is caring for the moth. A meal sustains one glow.', {
                needs: [{fact: `item.${petals}`, op: 'gte', value: mothMeal}], costs: [item(-mothMeal)],
            }),
        command('ask', 'Open your notes beside the moth', `If it chooses to glow, its light lasts ${mothLightMinutes} minutes.`),
        command('steward_asks', 'Ask the steward to show the moth his notes', 'Watch how it responds to its new keeper.'),
        command('study', 'Read the old route notes by the glow', 'Trace the faded path to a sheltered orchid grove.', {
            effects: [{type: 'knowledge', actor: 'player', key: mothClue, stage: 'understood',
                value: 'The old path turns behind the spring and reaches a sheltered grove of Moon Orchids.'}],
        }),
        command('gather', 'Follow the path and gather Moon Orchid petals', 'Bring back four fresh petals from the grove.', {
            duration: 20, needs: [eq(`knowledge.${mothClue}.understood`)], effects: [item(4)],
        }),
    ],
};

const futureCommand = (operation, label, description, options) => command(operation, label, description, {...options, pack: futureId});
export const guKeeperFutureMoth = {
    schema: 1, id: futureId, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [id], label: 'Try the steward’s future lesson',
    description: 'Prepare a lesson and reach ahead to see whether the moth will light the steward’s notes.',
    requires: all(ready, eq(`${futureId}.can_pledge`)), reason: 'First let the moth settle at the steward’s desk.',
    commands: [
        futureCommand('pledge', `Prepare the lesson · ${mothMeal} petals`,
            `Set the petals aside for the steward. He can give the lesson in ${mothLessonMinutes} minutes.`, {
                needs: [{fact: `item.${petals}`, op: 'gte', value: mothMeal}], costs: [item(-mothMeal)],
            }),
        futureCommand('reach', 'Reach the moth after the lesson',
            `Let the future moth answer the steward. Its glow lasts up to ${mothSealMinutes} minutes.`),
        futureCommand('cancel', 'Call off the steward’s lesson', 'Any borrowed glow fades. The prepared petals are spent.'),
        futureCommand('teach', 'Let the steward show the moth his notes', 'Keep the lesson and let the moth learn his notes in person.'),
    ],
};

const pastCommand = (operation, label, description, options) => command(operation, label, description, {...options, pack: pastId});
const guKeeperWitnessedMoth = {
    schema: 1, id: pastId, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [id], label: 'Mark an earlier glow',
    description: 'Keep a trace of a glow the moth offered you in person. A seal can later reach that earlier visit.',
    requires: ready, reason: 'First make a quiet place for the Insight Moth.',
    commands: [
        pastCommand('mark_aid', 'Mark the glow the moth gave you', 'Mark the visit while its light still falls on your notes.'),
        pastCommand('open_aid', `Open the earlier visit · ${mothMeal} petals`,
            `The seal holds the visit open for ${mothSealMinutes} minutes. Ask for the glow before it closes.`, {
                needs: [{fact: `item.${petals}`, op: 'gte', value: mothMeal}], costs: [item(-mothMeal)],
            }),
        pastCommand('steward_witnessed', 'Let the steward ask the earlier moth', 'See who the moth from that visit recognizes.'),
        pastCommand('ask_witnessed', 'Ask the earlier moth for its glow', 'Show it your notes from this side of the seal. Its earlier meal can sustain one glow.'),
    ],
};

export async function registerGuKeeperInsightMoth(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperInsightMoth, base);
        await register.bundledInstantExtension(guKeeperFutureMoth, base);
        await register.bundledInstantExtension(guKeeperWitnessedMoth, base);
    }
}
