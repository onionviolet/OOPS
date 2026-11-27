// Qualified held English MTL ch3 p33–51; no new primary-language claim.
// Durations, lowering away early and returning are authored choices.
import {extensionFact} from '../structured_pack_extensions.js';
import {PARADISE_LEAD, paradiseLeadId as baseId} from './book_paradise_lead_life.js';
export const PARADISE_ROOF = baseId('roof');
export const paradiseRoofId = n => `${PARADISE_ROOF}.${n}`;
const id = paradiseRoofId;
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'));
const begun = all(ready, eq(`knowledge.${baseId('trial')}.seen`), eq(`knowledge.${baseId('personal')}.seen`));
const admitted = eq(extensionFact(PARADISE_ROOF));
const active = eq(`situation.${baseId('trial_time')}.responseOpen`, true, 'The stated trial time has run out.');
const done = name => eq(`completed.${id(name)}`);
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: id(name), stage: 'seen', value});
const move = location => ({type: 'relocate', actor: 'player', location});
function act(name, label, location, duration, needs, description, effects, once = false) {
    const requires = all(begun, admitted, active, ...needs);
    return {id: id(name), revision: 1, label, description, group: 'structured_local', worldId: baseId('world'),
        actorId: 'player', location, audience: ['$actor'], duration, once, costs: [],
        requires, cancellation: 'refund', reservationReturns: 1, effects,
        ...(duration ? {completionRequires: requires, completionCoLocated: true, completionFailure: 'refund'} : {}),
        source: {kind: 'source-paraphrase', locator: 'MTL ch3 p33–51',
            timing: 'One-minute climb, two-minute first listen and three-minute further wait are authored. No fixed source minute is supplied.'}};
}
export const paradiseLeadRoof = {
    schema: 1, id: PARADISE_ROOF, revision: 1,
    base: {id: PARADISE_LEAD, revision: 1, contentHash: 'sha256:09232a2c6d9c05dda6965ed1eb70c7689954e40eaff23b23324ca62d6f5bbb02'},
    label: 'the roof opening',
    description: 'The door and windows are blocked. You can reach the broken roof, keep low, and listen before choosing what to do.',
    requires: begun,
    reason: 'Read the trial and your personal information before checking the roof.',
    locations: [{id: id('opening'), label: 'At the broken roof opening', underRoof: false,
        description: 'You hold yourself low at the broken roof. The floor of the ruined house is below you. The opening is not a promise of safe passage.'}],
    status: [
        {id: id('position_status'), label: 'At the opening', knowledgeKey: id('position')},
        {id: id('heard_status'), label: 'What you overheard', knowledgeKey: id('heard')},
        {id: id('withdraw_status'), label: 'Below the opening', knowledgeKey: id('withdrawn')},
        {id: id('interruption_status'), label: 'Interrupted by movement below', knowledgeKey: id('interruption')}
    ],
    commands: [
        act('climb', 'Climb to the roof opening', baseId('house'), 1, [],
            'Spend one minute reaching the roof edge. Keep your body low rather than stepping out.',
            [move(id('opening')), note('position', 'You reached the broken roof and kept your body low rather than stepping outside.')]),
        act('listen', 'Listen to the voices outside', id('opening'), 2, [],
            'Spend two minutes listening. You can stop listening and lower yourself before you have made out what they say.',
            [note('heard', 'You saw two armed groups exchanging shots. When the firing eased, one man called the other Toby and claimed this ground for his own group. The reply boasted of having more guns and leaving to become pirates. These are their claims; you have not checked who controls the ground.')], true),
        act('withdraw', 'Lower yourself back into the house', id('opening'), 0, [],
            'Return to the floor without stepping outside. If you are listening, stop that work first. You can climb back while the situation remains unchanged.',
            [move(baseId('house')), note('withdrawn', 'You lowered yourself from the roof edge to the floor of the ruined house without crossing the ground outside. That did not establish a safe way through it.')]),
        act('listen_further', 'Keep low and wait a little longer', id('opening'), 3, [done('listen')],
            'Spend three more minutes watching for the groups to disperse. Waiting does not mean the way will become clear.',
            [note('interruption', 'Before you saw the groups disperse, a quick-moving figure dropped into the house below you. Your watch was interrupted. You have not learned who the newcomer is or whether they mean you harm.'),
                {type: 'fact', scope: 'world', key: id('arrival_observed'), value: true}], true)
    ]
};
export async function registerParadiseLeadRoof(register, base) {
    if (!register.bundledInstantExtension || base.contentHash !== paradiseLeadRoof.base.contentHash) return null;
    return register.bundledInstantExtension(paradiseLeadRoof, base);
}
