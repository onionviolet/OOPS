// Volume one, ch36–40. Earlier encounter and sea entries stay historical.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_CONFRONTATION} from './book_gu_lead_confrontation.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_CLAN_RESPONSE = id('clan_response');
const local = name => `${GU_LEAD_CLAN_RESPONSE}.${name}`;
const key = itemId => JSON.stringify({id: itemId});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const dawnHash = 'sha256:4888b43624160750a2cd8a546c74310f8cf58f4722f81b6f25b00fea1182a620';
const world = id('world');
const academy = id('academy');
const elder = id('academy_elder');
const stone = key(`${GU_LEAD_REFINEMENT}.primeval_stone`);
const sabre = key(`${GU_LEAD_CONFRONTATION}.guard_sabre`);
const worm = key(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const box = local('wooden_box');
const day = 1440;
const supervised = {targetId: elder, coLocated: true, participants: ['$target']};

const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const stoneCost = amount => ({fact: `item.${stone}`, op: 'gte', value: amount, reason: `You need ${amount} whole primeval stones.`});

const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const dawn = all(eq(extensionFact(GU_LEAD_CONFRONTATION)), eq(`completed.${GU_LEAD_CONFRONTATION}.take_sabre`),
    eq(`actor.${GU_LEAD_CONFRONTATION}.encounter`, 'body_in_your_custody'),
    eq(`actor.${GU_LEAD_CONFRONTATION}.condensed_parts`, 4), eq(`item.${sabre}`, 1));
const refinedGu = all(eq(`item.${worm}`, 1), eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead'));
const admitted = eq(extensionFact(GU_LEAD_CLAN_RESPONSE));

function act(name, label, duration, previous, description, effects, {needs = [], payment = 0, costs = [], reason, ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...(payment ? all(support, stoneCost(payment)) : support),
            reason: reason || (payment ? stoneCost(payment).reason : 'Finish the earlier step and stay at the academy.')},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1,
        costs: payment ? [item(stone, -payment), ...costs] : costs, effects, ...extra
    };
}

const cultivationWeek = (name, previous, ordinal, anchor, report) => act(
    name, `Keep the ${ordinal} academy week`, 7 * day, done(previous),
    'Set aside twenty-one stones to work on the aperture and eight for meals, wine and Gu food. At the next allowance, take three stones from the elder and collect one each from the pupils who come through the gate.',
    [item(stone, 3), item(stone, 36), note('fortnight', report)],
    {payment: 29, needs: [refinedGu], durationSinceKnowledge: local(anchor)}
);

export const guLeadClanResponse = {
    schema: 1, id: GU_LEAD_CLAN_RESPONSE, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan after the fight',
    description: 'Return the body, answer the academy elder and keep up with your training until the merchants arrive.',
    requires: all(ready, dawn, refinedGu),
    reason: 'Continue from the dormitory at dawn with the guard’s sabre and your refined Gu.',
    items: [{id: box, label: 'Closed wooden box', description: 'A small box meant for the Mo household’s back door.', value: 0}],
    status: [
        {id: local('custody_status'), label: 'After dawn', knowledgeKey: local('custody')},
        {id: local('academy_status'), label: 'The academy’s ruling', knowledgeKey: local('academy')},
        {id: local('household_status'), label: 'The Mo household’s answer', knowledgeKey: local('household')},
        {id: local('ren_zu_status'), label: 'At the inn', knowledgeKey: local('ren_zu')},
        {id: local('fortnight_status'), label: 'The weeks before the caravan', knowledgeKey: local('fortnight')},
        {id: local('caravan_status'), label: 'The caravan’s first night', knowledgeKey: local('caravan')}
    ],
    commands: [
        act('pack_box', 'Prepare a box for the Mo household', 20, dawn,
            'Use the guard’s sabre to put some of Gao Wan’s remains in a small wooden box. Keep it shut when you take it out.',
            [item(key(box), 1), set('custody', 'packed'),
                note('custody', 'You have the closed box. It is too small to have held the whole body.')]),
        act('return_box', 'Leave the box at the back door', 12, done('pack_box'),
            'Take the side lane to the Mo household. Leave the box where their own people will see it first, then head back to the academy.',
            [set('custody', 'delivered'), note('custody', 'You left the box at the Mo household’s back door. The dormitory guards can say what they saw in the yard.')],
            {needs: [field('custody', 'packed')], costs: [item(key(box), -1)], reason: 'Bring the closed box to the Mo household.'}),
        act('answer_elder', 'Answer for the Moonblades', 10, done('return_box'),
            'The guards have reported the fight. Tell the elder why you drew the Moonlight Gu and where you left the box.',
            [set('fine', 'announced'), note('academy', 'You name the thirty-stone penalty for using Gu on academy grounds and tell him Gao Wan attacked first. The elder dismisses you. He will send word about the punishment.')],
            {...supervised, needs: [field('custody', 'delivered')]}),
        act('listen_at_inn', 'Listen to the grandfather at the inn', 20, done('answer_elder'),
            'Wait out the rain by the window. A boy at the next table asks his grandfather for a story about Ren Zu.',
            [note('ren_zu', 'In the story, Ren Zu stumbles in the dark until he can name Rules and Regulations. You think about the elder and Mo Yan. If her family steps in for Mo Bei, the other elders will take that as leave to do the same.')]),
        act('pay_fine', 'Pay the academy thirty stones', 5, done('answer_elder'),
            'Settle the first-offense fine for using the Moonlight Gu on academy grounds.',
            [set('fine', 'paid'), note('academy', 'The elder takes thirty whole stones for the breach of academy rules.')],
            {...supervised, needs: [field('fine', 'announced')], payment: 30}),
        act('receive_compensation', 'Take the Mo household’s payment', 5, done('pay_fine'),
            'A payment comes from the Mo household for Gao Wan’s conduct. Take the thirty whole stones.',
            [item(stone, 30), set('response', 'paid'), note('household', 'Thirty whole stones come back into your purse. Mo Yan does not come looking for you again.')]),
        cultivationWeek('train_first_week', 'receive_compensation', 'first', 'household',
            'Seven days pass. Twenty-one stones went into cultivation, and eight paid for upkeep. You collect the three-stone allowance and thirty-six stones at the gate. Few pupils try to fight you now.'),
        cultivationWeek('train_second_week', 'train_first_week', 'second', 'fortnight',
            'Another seven days pass. You spend twenty-nine stones and take in thirty-nine. The pupils leave the gate without a fight.'),
        act('wait_for_caravan', 'Finish the fortnight as the caravan arrives', day, done('train_second_week'),
            'Set aside three stones for the day’s cultivation and seventeen to settle the remaining food and wine bills. By dusk the caravan has set up tents around the village.',
            [note('fortnight', 'Fifteen days of cultivation and upkeep are paid for. Your aptitude and aperture stage are as before.'),
                note('caravan', 'Lanterns go up around the caravan tents. A vendor calls two stones a catty for Intimate Grass. There is already a crowd at his cart.')],
            {payment: 20, needs: [refinedGu], durationSinceKnowledge: local('fortnight')}),
        act('go_to_rock_tent', 'Pass the grass stall and find the grey tent', 12, done('wait_for_caravan'),
            'Leave the grass for later and make for the tent you remember from another life. Find the counter with purple-gold stone.',
            [note('caravan', 'The grey tent has three counters. The clerk asks five stones on the right, ten on the left and twenty in the middle. You remember a purple-gold stone bought on the first night.')]),
        act('shortlist_stones', 'Choose six stones to consider', 15, done('go_to_rock_tent'),
            'Check the purple-gold stones by size, shape and surface. Set aside a purse for your own food and the Gu before you decide how much you can risk.',
            [set('shortlisted', 6), set('price_each', 10), set('purse_floor', 28),
                note('caravan', 'Six stones on the ten-stone counter look right. You remember the kind of find, but cannot tell which stone held it. Keeping twenty-eight stones back leaves seventy to wager from a purse of ninety-eight. The clerk has taken no payment.')])
    ]
};

let installed;
export async function registerGuLeadClanResponse(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_CONFRONTATION && e.revision === 1 && e.contentHash === dawnHash)) return null;
    installed = await register.extension(guLeadClanResponse, base);
    return installed;
}

const longJobs = ['train_first_week', 'train_second_week', 'wait_for_caravan'].map(local);
export function guLeadClanResponseClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_CLAN_RESPONSE);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command?.duration ? Math.min(120, remaining) : null;
}
