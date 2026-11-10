// Qing Mao, volume two chapters 104–105.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_ESTATE_HANDOVER} from './book_gu_lead_estate_handover.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_QING_SHU_MEETING = id('qing_shu_meeting');
const local = name => `${GU_LEAD_QING_SHU_MEETING}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:e13f2cffeac5a3520647d27d8054872908f5a9219d0058fd95cf0c662cac801a';
const world = id('world');
const academy = id('academy');
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const stock = item => ({fact: `item.${JSON.stringify({id: item})}`, op: 'gte', value: 1});
const worm = stock(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const deeds = stock(`${GU_LEAD_ESTATE_HANDOVER}.estate_deeds`);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_ESTATE_HANDOVER)),
    eq(`completed.${GU_LEAD_ESTATE_HANDOVER}.inspect_the_houses`),
    eq(`actor.${GU_LEAD_ESTATE_HANDOVER}.return`, 'fang_zheng_below'),
    eq(`actor.${GU_LEAD_ESTATE_HANDOVER}.estate`, 'conveyed'));
const admitted = eq(extensionFact(GU_LEAD_QING_SHU_MEETING));

function act(name, label, duration, previous, description, effects, needs = []) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, deeds, worm, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...support, reason: 'Stay in the village and keep your deeds and Liquor Worm with you.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: [], effects
    };
}

export const guLeadQingShuMeeting = {
    schema: 1, id: GU_LEAD_QING_SHU_MEETING, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan answers his brother’s challenge',
    description: 'Go down to speak with Fang Zheng. Keep the deeds and your Liquor Worm close.',
    requires: all(ready, predecessor, deeds, worm),
    reason: 'Check the bamboo houses and meet Fang Zheng below the railing.',
    status: [status('household', 'Fang Zheng’s account'), status('challenge', 'The estate challenge'),
        status('offer', 'Qing Shu’s terms'), status('fusion', 'Your Liquor Worm'), status('mediation', 'Qing Shu’s promise')],
    commands: [
        act('hear_the_challenge', 'Hear Fang Zheng out below the railing', 10, predecessor,
            'Fang Zheng asks for part of the inheritance. Hear what he wants to settle with a Gu bout, and look at the Rank Two Gu he shows you.',
            [set('challenge', 'proposed'), note('household', 'Fang Zheng says your uncle and aunt cannot afford to keep half their servants. You suspect they are putting on a show of poverty. The books you checked do not tell you what they can afford.'),
                note('challenge', 'Fang Zheng proposes a bout without killing, with part of the estate at stake. The Rank Two Gu he shows you can turn aside the attacks you have let him see.')]),
        act('send_him_to_qing_shu', 'Send Fang Zheng to his team leader', 5, done('hear_the_challenge'),
            'Tell him to ask Qing Shu first. His team may have a mission. Give him the tavern by the north gate as a meeting place without agreeing to a fight.',
            [set('challenge', 'awaiting_team_leader'), note('challenge', 'You agree on a place to talk, without accepting the bout. A team mission could take precedence.')],
            [field('challenge', 'proposed')]),
        act('meet_at_the_north_gate', 'Set two cups out at the north gate tavern', 30, done('send_him_to_qing_shu'),
            'Wait for both of them to arrive. Qing Shu asks Fang Zheng to leave the table, then asks how much you want for your Liquor Worm.',
            [set('offer', 'price_requested'), note('offer', 'Qing Shu has come with business of his own. He wants to know your price before talking about the bout.')]),
        act('hear_the_terms', 'Ask what the clan is offering', 10, done('meet_at_the_north_gate'),
            'Hear the terms for a sale or a clan refinement. Ask how the deal bears on Fang Zheng’s challenge.',
            [set('offer', 'sale_or_clan_refinement'), note('offer', 'Qing Shu says younger students could use the worm. If the clan refines it, he offers you five years’ use on success or compensation on failure. He gives no sale price.'),
                note('challenge', 'Qing Shu says the elders can arbitrate a reasonable challenge and the clan expects you to accept it. A sale would get his help with the challenge over these deeds, but leaves other grounds open.')]),
        act('keep_the_worm', 'Keep the Liquor Worm for your own refinement', 5, done('hear_the_terms'),
            'Decline the sale and the clan’s refinement. Consider what you would need to refine the worm yourself before you answer about the estate.',
            [set('offer', 'declined'), set('fusion', 'ingredients_missing'),
                note('offer', 'You keep the worm and make no deal for it.'),
                note('fusion', 'You still need a second Liquor Worm and four wines: sour, sweet, bitter and spicy. Bitter wine will be the hard one to find.')],
            [field('offer', 'sale_or_clan_refinement')]),
        act('answer_with_the_estate', 'Tell Qing Shu what a victory would cost Fang Zheng', 10, done('keep_the_worm'),
            'Say you would hand over the whole estate if you lost and let the village see you destitute. Ask how that would look for a boy expected to lead the clan.',
            [set('challenge', 'awaiting_mediation'), set('mediation', 'qing_shu_promised'),
                note('challenge', 'No bout has been set. Qing Shu is going to speak with Fang Zheng about the challenge over the inheritance.'),
                note('mediation', 'Qing Shu drops the idea of buying the worm and promises to talk Fang Zheng out of challenging you over the inheritance. Fang Zheng has yet to answer. You keep the estate and the worm.')],
            [field('offer', 'declined')])
    ]
};

export async function registerGuLeadQingShuMeeting(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_ESTATE_HANDOVER && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadQingShuMeeting, base);
}
