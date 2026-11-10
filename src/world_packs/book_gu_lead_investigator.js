// Qing Mao, volume two chapters 172–176.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_LYCAN} from './book_gu_lead_lightning_lycan.js';

export const GU_LEAD_INVESTIGATOR = id('investigator');
const local = name => `${GU_LEAD_INVESTIGATOR}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:e60a590e0ee601ae2216857336779494cc5a1994c7a6578ff12de8c007f8ae6e';
const world = id('world');
const academy = id('academy');
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const key = itemId => JSON.stringify({id: itemId});
const stock = (itemId, value = 1) => ({fact: `item.${key(itemId)}`, op: 'gte', value});
const item = (itemId, amount) => ({type: 'item', actor: 'player', key: key(itemId), amount});
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const sea = id('primeval');
const recover = amount => ({type: 'energy', actor: 'player', energyId: sea, operation: 'recover', amount});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_LYCAN)),
    eq(`completed.${GU_LEAD_LYCAN}.sit_through_the_banquet_for_the_investigator`),
    eq(`actor.${GU_LEAD_LYCAN}.banquet`, 'admitted_fear_and_stayed'));
const admitted = eq(extensionFact(GU_LEAD_INVESTIGATOR));

function act(name, label, duration, previous, description, effects, {needs = [], atStart = [], costs = [], reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...atStart), reason: reason || 'Finish the previous step and stay in the village.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs, effects
    };
}

// Authored dials (private receipt): 40 stones to refill the sea after the banquet, minutes per step, and the
// Mo faction's price as the figures Fang Yuan states (100,000 stones and ten Rank Three Gu, then thirty percent off with
// 40,000 stones in advance, a Pig Iron Gu and an Afterlife Grass Gu). No stones or Gu change hands here: Mo Chen has
// not paid. Sourced: the banquet's aftermath, Mo Chen's cover story, the tour, the Xiong envoy, the charge over old
// Wang's family and the order to stay. Bai Ning Bing and the white snake, Ruo Nan's examination, her letter and
// Mo Yan's consent are other people's scenes and stay world facts.
export const guLeadInvestigator = {
    schema: 1, id: GU_LEAD_INVESTIGATOR, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan is watched by the Divine Investigator',
    description: 'A cover story, a marriage price, a tour for the investigators and a charge in the clan hall.',
    requires: all(ready, predecessor, stoneCost(100)),
    reason: 'Finish the banquet and keep your stones.',
    status: [status('status', 'Your elder’s seat'), status('mo', 'The Mo faction'), status('tie', 'The investigators'),
        status('politics', 'The factions'), status('hall', 'The clan hall'), status('leaving', 'Leaving the village')],
    commands: [
        act('let_mo_chen_cover_for_you', 'Say nothing while Mo Chen explains your absence', 30, predecessor,
            'The clan leader says running from the fight costs an elder his seat, subject to a discussion. Mo Chen stands and says he kept you in his estate and knocked you out because his granddaughter loves you.',
            [set('status', 'punishment_pending_after_discussion'), set('mo', 'mo_chen_claims_he_kept_you_from_the_battle'),
                event('elders', 'seeing_fang_yuan_as_no_longer_a_rival'), event('mo_chen', 'spent_his_own_name_for_fang_yuan'),
                note('status', 'The hall thinks admitting fear has ended your career. You do not mind losing the seat. Then Mo Chen speaks for you and you hide your surprise. The clan leader says the punishment will wait until the guest has gone.')],
            {}),
        act('draw_stones_after_the_banquet', 'Refill your sea from stones after the banquet', 20, done('let_mo_chen_cover_for_you'),
            'You are nearly empty. Draw forty stones from the tusita flower.',
            [recover(44), note('status', 'You refill your sea. You are hours from the next test.')],
            {atStart: [stoneCost(40)], costs: [pay(40)]}),
        act('name_your_price_in_the_pavilion', 'Take tea with Mo Chen and name your price', 40, done('draw_stones_after_the_banquet'),
            'The Mo faction has no male heir, and Mo Chen has fallen to Rank Two and hides it. He wants a son-in-law to hold the faction. Ask for a hundred thousand stones and ten Rank Three Gu.',
            [set('mo', 'demand_hundred_thousand_stones_and_ten_rank_three_gu'), event('mo_chen', 'furious_and_hiding_his_fall_to_rank_two'),
                note('mo', 'He has to ask you what you think of the Mo faction. You ask for a hundred thousand stones and ten Rank Three Gu in exchange for marrying Mo Yan. He chases you out. You know he will come back.')],
            {needs: [field('mo', 'mo_chen_claims_he_kept_you_from_the_battle')]}),
        act('guide_the_investigators_round_the_village', 'Show Tie Xue Leng and his daughter around the village', 60, done('name_your_price_in_the_pavilion'),
            'They ask. Tell them what is true and leave out what you feel. Tell them the clan’s cave is closed to outsiders.',
            [set('tie', 'toured_with_only_clean_facts'), event('tie_xue_leng', 'finds_the_tour_too_clean_and_names_it_a_demonic_nature'),
                event('tie_ruo_nan', 'feels_he_is_covered_in_shadows'),
                note('tie', 'Tie Xue Leng hears every fact in order. He will say nothing to you. You think a man of his sort wants time and you have little.')],
            {needs: [field('mo', 'demand_hundred_thousand_stones_and_ten_rank_three_gu')]}),
        act('weigh_the_factions_and_the_clock', 'Work out who gains and who falls', 20, done('guide_the_investigators_round_the_village'),
            'Chi Lian is dead but his faction stands on Chi Cheng and Chi Zhong. The Mo faction has no heir. The medicine faction lost little and will try to swallow both.',
            [set('politics', 'medicine_faction_rising_chi_and_mo_weak'), event('bai_ning_bing', 'a_new_arm_and_an_approved_inheritance'),
                event('wang_er', 'identified_as_a_local_hunter_by_ruo_nan'),
                note('politics', 'You want out of the politics, and Mo Chen has dragged you back in. Your next move must outrun an investigator who solves cases for a living.')],
            {needs: [field('tie', 'toured_with_only_clean_facts')]}),
        act('volunteer_as_envoy_to_the_xiong_clan', 'Offer to go to the Xiong clan as the envoy', 30, done('weigh_the_factions_and_the_clock'),
            'The next day the Xiong clan sends an envoy and the village learns its survivors hid behind an ancestor’s Gu. The elders will not leave the table, so volunteer.',
            [set('leaving', 'volunteered_as_envoy'), event('xiong_clan', 'survivors_hidden_by_an_ancestor_gu'),
                note('leaving', 'Yao Ji nominates Mo Chen and Mo Chen nominates Yao Ji. You stand and offer. The elders think you are foolish to leave while the spoils are split. You see a chance to break the three clans apart, or to leave.')],
            {needs: [field('politics', 'medicine_faction_rising_chi_and_mo_weak')]}),
        act('hear_the_charge_in_the_hall', 'Hear Tie Ruo Nan charge you in the clan hall', 30, done('volunteer_as_envoy_to_the_xiong_clan'),
            'She brings in Fang Zheng and Jiang He. She says Wang Er wanted you for killing his family and took your brother for you. Jiang He kneels and confirms he buried the report.',
            [set('hall', 'old_wang_killing_exposed_by_jiang_he'), event('jiang_he', 'confessed_to_hiding_the_report'),
                note('hall', 'Fang Zheng stands white with rage. The elders murmur. You do not look at him. You look at the investigators and see how fast they found it.')],
            {needs: [field('leaving', 'volunteered_as_envoy')]}),
        act('admit_the_killing_and_stay', 'Admit the killing and refuse to explain', 20, done('hear_the_charge_in_the_hall'),
            'The clan leader asks. A Gu Master killing mortals is no crime here. Tie Xue Leng asks you to stay in the village and the clan leader agrees.',
            [set('hall', 'old_wang_killing_admitted'), set('leaving', 'barred_until_cleared_by_the_investigators'), event('fang_zheng', 'shaken_and_claims_he_can_reach_rank_three'),
                event('ruo_nan', 'found_a_problem_in_jia_fu_s_letter'),
                note('hall', 'You say it is true and that you did not know Wang Er was a demonic Gu Master. Fang Zheng asks you to say something. You tell him he is too soft. The clan leader sends him out. Tie Xue Leng asks you to stay in the village and the clan leader says the same. You answer yes and go.')],
            {needs: [field('hall', 'old_wang_killing_exposed_by_jiang_he')]}),
        act('bargain_again_with_mo_chen', 'Bargain with Mo Chen a second time', 45, done('admit_the_killing_and_stay'),
            'He has called you back. Come down thirty percent. Ask forty thousand stones in advance, a Pig Iron Gu and an Afterlife Grass Gu. Say you will not pledge anything until he has paid.',
            [set('mo', 'terms_thirty_percent_off_forty_thousand_advance_pig_iron_and_afterlife_grass'), event('mo_yan', 'agrees_to_marry_him_and_hates_the_idea'),
                note('mo', 'Mo Chen says he will hand over the Pig Iron Gu, has no Afterlife Grass Gu, and can only pay the stones in instalments. You tell him you will not talk about marriage until he has paid and that you cannot promise your side before. Nothing has been paid yet.')],
            {needs: [field('leaving', 'barred_until_cleared_by_the_investigators')]})
    ]
};

export async function registerGuLeadInvestigator(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_LYCAN && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadInvestigator, base);
}
