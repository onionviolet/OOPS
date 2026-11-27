// Held supplied English MTL ch3 p51–74. The source response is abstracted.
// Distance dialogue, wait/release options, minutes and condition/relationship
// values are authored calibration, not a new primary-language claim.
import {extensionFact} from '../structured_pack_extensions.js';
import {SU_INTRUDER as E, SU_VISITOR as VISITOR} from '../paradise_intruder.js';
import {PARADISE_LEAD, paradiseLeadId as baseId} from './book_paradise_lead_life.js';
import {PARADISE_ROOF, paradiseRoofId as roofId} from './book_paradise_lead_roof.js';
export {SU_INTRUDER, SU_VISITOR} from '../paradise_intruder.js';
const id = n => `${E}.${n}`, HOUSE = baseId('house'), ROOF = roofId('opening'), WORLD = baseId('world');
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`situation.${baseId('trial_time')}.responseOpen`));
const arrival = eq(`world.${roofId('arrival_observed')}`);
const admitted = eq(extensionFact(E));
const phase = value => eq(`actor.${id('phase')}`, value);
const set = value => ({type: 'fact', actor: 'player', scope: 'actor', key: id('phase'), value});
const note = (name, value, actor = 'player', attributed = false) => ({type: 'knowledge', actor, key: id(name), stage: 'seen', value,
    ...(attributed ? {basis: {kind: 'observation', attributedTo: VISITOR, situationId: baseId('trial_time')}} : {})});
const response = [note('identity', 'The newcomer gives her name as Mia.'),
    note('claim', 'Mia says she came to find shelter and agrees to stay quiet. You have not checked her account.', 'player', true)];
const condition = (name, operation, duration) => ({type: 'condition', actor: VISITOR, id: id(name), operation,
    ...(operation === 'apply' ? {intensity: 1, duration} : {})});
function act(name, label, location, duration, needs, description, effects, extra = {}) {
    const requires = all(ready, arrival, admitted, ...needs);
    return {id: id(name), revision: 1, label, description, group: 'structured_local', worldId: WORLD, actorId: 'player',
        location, audience: ['$actor'], once: true, duration, costs: [], requires, visibleWhen: all(arrival, admitted, ...needs),
        cancellation: 'refund', reservationReturns: 1, effects,
        ...(duration ? {completionRequires: requires, completionCoLocated: true, completionFailure: 'refund'} : {}),
        source: {kind: 'source-paraphrase', locator: 'Supplied English MTL ch3 p51–74',
            timing: 'One-minute responses/waits and RPG condition durations are authored.'}, ...extra};
}
export const paradiseLeadIntruder = {
    schema: 1, id: E, revision: 1,
    base: {id: PARADISE_LEAD, revision: 1, contentHash: 'sha256:09232a2c6d9c05dda6965ed1eb70c7689954e40eaff23b23324ca62d6f5bbb02'},
    dependsOn: [PARADISE_ROOF], label: 'the newcomer in the house',
    description: 'Someone has entered the ruined house below the opening. You have not learned who they are.',
    requires: all(ready, arrival), reason: 'Observe the newcomer entering the house before responding.',
    roles: [{id: VISITOR, revision: 1, label: 'Mia', worldId: WORLD, location: HOUSE, inventory: 'simulation', provision: false,
        introductionKnowledgeKey: id('identity'), body: {id: id('visitor_body'), ownerId: VISITOR, controllerId: VISITOR,
            form: 'human', lifeStage: 'child', hands: 2, mobile: true}, vitals: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}}],
    conditions: ['held', 'winded', 'shaken'].map((name, index) => ({id: id(name), revision: 1,
        label: ['Restrained', 'Winded', 'Shaken'][index], stacking: 'max', absence: 'zero'})),
    status: [{id: id('presence_status'), label: 'The newcomer', knowledgeKey: id('presence')},
        {id: id('response_status'), label: 'Your response', knowledgeKey: id('response')},
        {id: id('claim_status'), label: 'What she said', knowledgeKey: id('claim')}],
    commands: [
        act('face', 'Look at the newcomer below', ROOF, 0, [], 'Turn toward the person who entered the house. You remain at the roof opening.',
            [{type: 'spawn', definitionId: VISITOR, personId: VISITOR}, set('above'),
                note('presence', 'A stranger is on the floor below. You can speak from here or go down to confront them.')]),
        act('pause', 'Wait and watch from above', ROOF, 1, [phase('above')], 'Spend one minute watching while the trial countdown continues.',
            [note('pause', 'You watched from the opening for a minute. The newcomer remained in the house below.')], {once: false}),
        act('drop', 'Drop into the house', ROOF, 0, [phase('above')], 'Go down to confront the newcomer at close range. This does not yet restrain or injure them.',
            [{type: 'relocate', actor: 'player', location: HOUSE}, set('close'), note('approach', 'You came down into the house. The stranger stops speaking and watches you.')]),
        act('speak_above', 'Speak to the newcomer from above', ROOF, 1, [phase('above'), eq('target.life', 'alive'), eq('target.location', HOUSE)],
            'Keep your distance and ask who they are and why they entered. This is a quiet exchange, not a promise of safety.',
            [...response, set('answered'), note('response', 'You stayed above and asked her to keep her voice down. She gave her name and said she wanted shelter. She remains free to move.'),
                note('su_response', 'The man stayed at the opening and asked my name and why I came here.', VISITOR)],
            {targetId: VISITOR, coLocated: false, completionCoLocated: false, participants: ['$target']}),
        act('subdue_question', 'Subdue and question the newcomer', HOUSE, 1,
            [phase('close'), eq('target.life', 'alive'), eq('target.location', HOUSE)],
            'Restrain the newcomer in a brief struggle, then ask their identity and purpose. They may be hurt and frightened.',
            [condition('held', 'apply', 1), condition('winded', 'apply', 5), condition('shaken', 'apply', 10),
                {type: 'relationship', actor: VISITOR, target: 'player', axis: 'tie.trust', amount: -1},
                ...response, set('answered'), note('response', 'You subdued the newcomer before questioning her. Mia was winded and frightened; she asked you not to hurt her and agreed to stay quiet.'),
                note('su_response', 'The man subdued me before I could explain. I told him my name and asked him not to hurt me.', VISITOR)],
            {targetId: VISITOR, coLocated: true, participants: ['$target']}),
        act('ease_hold', 'Ease your hold', HOUSE, 0,
            [phase('answered'), {fact: `target.condition.${id('held')}`, op: 'gte', value: 1}],
            'Let Mia move freely again. This does not erase the fright or make her trust you.',
            [condition('held', 'remove'), note('released', 'You let Mia go. She remains in the house; that does not settle whether the ground outside is safe.')],
            {targetId: VISITOR, coLocated: true, participants: ['$target']}),
    ],
};
export async function registerParadiseLeadIntruder(register, base) {
    if (!register.bundledInstantExtension || base.contentHash !== paradiseLeadIntruder.base.contentHash) return null;
    return register.bundledInstantExtension(paradiseLeadIntruder, base);
}
