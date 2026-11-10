// Qing Mao, volume two chapters 146–149.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_WOOD_CHARM} from './book_gu_lead_wood_charm.js';

export const GU_LEAD_WALL_NIGHT = id('wall_night');
const local = name => `${GU_LEAD_WALL_NIGHT}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:863f2d0ca5dc12cf9cd986e7bf2b8a73a50a83b402e0cf2177e48eadeb93ece1';
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
const moonglow = stock(`${GU_LEAD_MOONGLOW}.moonglow_gu`);
const grass = stock(`${GU_LEAD_MOONGLOW}.vitality_grass`);
const shield = stock(`${GU_LEAD_WOOD_CHARM}.water_shield_gu`);
const bear = local('bear_enslavement_gu');
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const sea = id('primeval');
const reserve = value => ({fact: `energy.${sea}.reserve`, op: 'gte', value,
    reason: `Prepare ${value} parts of essence first.`});
const spend = output => ({type: 'energy', actor: 'player', energyId: sea, operation: 'use', output, control: 1});
const recover = amount => ({type: 'energy', actor: 'player', energyId: sea, operation: 'recover', amount});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_WOOD_CHARM)),
    eq(`completed.${GU_LEAD_WOOD_CHARM}.refuse_more_leaf_sales`),
    eq(`actor.${GU_LEAD_WOOD_CHARM}.aperture_stage`, 'rank_two_upper'),
    eq(`actor.${GU_LEAD_WOOD_CHARM}.leaves`, 'extra_sales_refused'));
const admitted = eq(extensionFact(GU_LEAD_WALL_NIGHT));

function act(name, label, duration, previous, description, effects, {needs = [], atStart = [], costs = [], parts = 0, reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...atStart, ...(parts ? [reserve(parts)] : [])), reason: reason || 'Finish the previous step and stay in the village.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: parts ? [...costs, spend(parts)] : costs, effects
    };
}

// Authored dials, each labelled in the private receipt: the essence spent refining the Bear Gu (8 parts), the wall
// exchange (24 parts, over half of the 36 on hand), the stones drawn to recover (6 for 22 parts), the rotation's
// total (20 parts), the minutes each step takes, and the 700 stones arriving with the refined Gu.
export const guLeadWallNight = {
    schema: 1, id: GU_LEAD_WALL_NIGHT, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan spends the night on the wall',
    description: 'Leaf prices, a rescue on your terms, a clan notice and the first night of the wolf tide.',
    requires: all(ready, predecessor, grass, moonglow, shield, stoneCost(6)),
    reason: 'Finish your cultivation and keep your vitality grass, Moonglow Gu, Water Shield Gu and stones.',
    items: [
        {id: bear, label: 'Bear Enslavement Gu · refined with Xiong Jiao Man', description: 'Her hold on it is gone. A bear that takes it can be commanded.', value: 0}
    ],
    status: [status('leaves', 'The leaf orders'), status('valley', 'The valley'), status('notice', 'The clan notice'),
        status('plan', 'Your plan for Rank Three'), status('wall', 'The wall')],
    commands: [
        act('quote_the_leaves_to_ye', 'Raise your price for Gu Yue Ye’s five leaves', 20, predecessor,
            'Ye wants five vitality leaves during the shortage. Name a higher price while he haggles, and let him pay Jiang Ya.',
            [set('leaves', 'ye_five_at_seventy_two_due_in_three_days'), event('ye_order', 'paid_to_jiang_ya_leaves_due'),
                note('leaves', 'Ye agrees to seventy-two stones a leaf and pays Jiang Ya in several bags. The five leaves are still yours to hand over in three days.')],
            {needs: [grass]}),
        act('set_terms_with_jiang_ya', 'Tell Jiang Ya what to charge and where to send complaints', 8, done('quote_the_leaves_to_ye'),
            'Later sales go for seventy stones a leaf. Complaints come to you. Jiang Ya is not to approach you outside the times you set.',
            [set('terms', 'seventy_each_complaints_to_fang_yuan'), event('jiang_ya', 'keeps_selling_while_useful'),
                note('leaves', 'Jiang Ya worries the price will look like profiteering in a crisis. You accept the blame. He keeps selling while he is useful to you.')],
            {needs: [field('leaves', 'ye_five_at_seventy_two_due_in_three_days')]}),
        act('wait_above_the_valley', 'Wait above the valley where the wolf packs were drawn', 25, done('set_terms_with_jiang_ya'),
            'You led four packs of bold lightning wolves here to let them die and to gather Gu and merit. A group of seven is retreating into the same valley.',
            [set('valley', 'seven_survivors_waiting_for_rescue'), event('wolf_lure', 'four_packs_drawn_to_valley'),
                event('xiong_yuan_zhen', 'died_of_blood_loss'), event('xiong_bear', 'black_bear_lost_to_exhaustion'),
                note('valley', 'Their signal has drawn others toward the valley. Your plan is spoiled. Seven survivors wait for help and Xiong Jiao Man has lost her bear. You step out above them.')],
            {needs: [field('terms', 'seventy_each_complaints_to_fang_yuan')]}),
        act('offer_the_vine_route', 'Offer a vine route out for a Gu and seven hundred stones', 10, done('wait_above_the_valley'),
            'Rescue the seven on your terms, before the other groups arrive. You want a Bear Enslavement Gu and seven hundred primeval stones.',
            [set('valley', 'rescue_terms_accepted'), note('valley', 'Xiong Jiao Man accepts. The Bear Enslavement Gu and the stones are yours once she gives up her hold.')],
            {needs: [field('valley', 'seven_survivors_waiting_for_rescue')]}),
        act('refine_the_bear_gu_together', 'Refine the Bear Enslavement Gu with Xiong Jiao Man', 35, done('offer_the_vine_route'),
            'Spend eight parts while she withdraws her mind from it. After this she cannot take it back.',
            [item(bear, 1), pay(-700), set('valley', 'gu_refined_no_reversal'),
                event('xiong_group', 'saved_and_knows_the_terms'), event('responders', 'three_groups_arrive_including_chi_shan'),
                event('public_opinion', 'condemning_fang_yuan_after_survivors_talk'),
                note('valley', 'The Gu is yours and the seven hundred stones are in your hands. Three groups of Gu Masters reach the valley soon after, Chi Shan’s among them. The survivors will tell their story in the medicine hall.')],
            {needs: [field('valley', 'rescue_terms_accepted')], parts: 8}),
        act('read_the_requisition', 'Read the medicine hall’s notice on vitality grass', 10, done('refine_the_bear_gu_together'),
            'The hall orders every holder to hand over the grass for clan production. Others have turned theirs in. Yours is still with you.',
            [set('notice', 'named_as_not_handed_over'), event('requisition', 'unified_production_ordered'),
                note('notice', 'Your name stands out among the holders who gave theirs up. Quiet delay will cost you more than a public answer. The order is aimed at your trade.')],
            {needs: [field('valley', 'gu_refined_no_reversal'), grass]}),
        act('plan_the_rank_three_push', 'Settle on a Rank Three push with the Man-beast Life Burial Gu', 15, done('read_the_requisition'),
            'An elder’s seat would give you a place among the people who decide. You remember a recipe that could force a Rank Two Gu Master through the barrier.',
            [set('plan', 'life_burial_recipe_pending_right_moment'),
                note('plan', 'The materials are not rare. You have enough stones and Gu worms. You are waiting for the right moment. Nothing is refined yet and your stage has not changed.')],
            {needs: [field('notice', 'named_as_not_handed_over')], atStart: [stoneCost(100)]}),
        act('answer_the_sirens', 'Climb to the wall when the sirens sound', 20, done('plan_the_rank_three_push'),
            'Xiong Jiao Man’s group is turned back by a wolf tide. The village calls every Gu Master to the walls.',
            [set('wall', 'tide_counted'), event('wolf_tide', 'thousands_with_three_frenzy_wolves'),
                note('wall', 'You count thousands of lightning wolves, at least thirty bold ones and three frenzy wolves behind them. There is no lightning crown wolf. The village looks safe for now. You keep in mind that your return may have changed the timing.')],
            {needs: [field('plan', 'life_burial_recipe_pending_right_moment')]}),
        act('hold_the_wall_against_a_bold_wolf', 'Hold the ladder with Water Shield and three Moonblades', 15, done('answer_the_sirens'),
            'Spend twenty-four parts in one exchange. The shield takes the wolf’s lightning, the blades wound it and the defenders finish it.',
            [set('wall', 'essence_below_half_after_first_exchange'), event('bold_wolf', 'killed_at_the_ladder'),
                note('wall', 'The Water Shield takes the lightning. Three Moonblades wound the wolf and the defenders kill it. You are below half your essence and step down.')],
            {needs: [field('wall', 'tide_counted'), moonglow, shield], parts: 24}),
        act('recover_off_the_ladder', 'Leave the ladder and draw from stones', 60, done('hold_the_wall_against_a_bold_wolf'),
            'Pay six stones to refill part of your sea while the rotation covers your place.',
            [recover(22), set('wall', 'recovering_off_the_ladder'), note('wall', 'You recover twenty-two parts. The tide keeps arriving.')],
            {atStart: [stoneCost(6)], costs: [pay(6)]}),
        act('rotate_back_until_ten', 'Take the rotation back to the wall until ten', 100, done('recover_off_the_ladder'),
            'Enter the fight again, four more times. The fight is not over by ten. No one counts your injuries.',
            [set('wall', 'five_entries_by_ten_battle_continues'), event('battle', 'continues_at_ten_at_night'),
                event('casualties', 'unusually_heavy'), event('yao_le', 'leading_the_east_door_healing_team'),
                event('yao_ji', 'seeing_political_use_in_yao_le_at_the_front'),
                note('wall', 'You have gone into the fight five times by ten. Wolves are still arriving after dark. The casualty reports are heavier than you expected.')],
            {needs: [field('wall', 'recovering_off_the_ladder'), moonglow], parts: 20})
    ]
};

export async function registerGuLeadWallNight(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_WOOD_CHARM && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadWallNight, base);
}
