// Qing Mao, volume two chapters 114–118.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_RELIC_MARKET} from './book_gu_lead_relic_market.js';
import {GU_LEAD_WHITE_JADE} from './book_gu_lead_white_jade.js';
import {GU_LEAD_RANK_TWO} from './book_gu_lead_rank_two.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';

export const GU_LEAD_STONE_FOREST = id('stone_forest');
const local = name => `${GU_LEAD_STONE_FOREST}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:1302a0a9d34a3916b74f0a5c8789f1086b3142e420ab2fc7cd23786bb79b69fa';
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
const relic = `${GU_LEAD_RELIC_MARKET}.red_steel_relic`;
const boar = `${GU_LEAD_RELIC_MARKET}.black_boar_gu`;
const whiteJade = stock(`${GU_LEAD_WHITE_JADE}.white_jade_gu`);
const moon = stock(`${GU_LEAD_MOONGLOW}.moonglow_gu`);
const stealth = local('stealth_rock_gu');
const sea = id('primeval');
const reserve = value => ({fact: `energy.${sea}.reserve`, op: 'gte', value,
    reason: `Prepare ${value} parts of essence first.`});
const spend = output => ({type: 'energy', actor: 'player', energyId: sea, operation: 'use', output, control: 1});
const recover = {type: 'energy', actor: 'player', energyId: sea, operation: 'recover', amount: 44};
const health = loss => ({type: 'vital', actor: 'player', key: 'health', amount: -loss});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const nominate = {type: 'fact', actor: 'player', scope: 'world', key: local('toad_nominee'), value: 'fang_yuan'};
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_RELIC_MARKET)),
    eq(`completed.${GU_LEAD_RELIC_MARKET}.leave_with_the_relic`),
    eq(`actor.${GU_LEAD_RELIC_MARKET}.relic`, 'won_unspent'),
    eq(`actor.${GU_LEAD_RANK_TWO}.aperture_stage`, 'rank_two_initial'));
const admitted = eq(extensionFact(GU_LEAD_STONE_FOREST));

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
export const guLeadStoneForest = {
    schema: 1, id: GU_LEAD_STONE_FOREST, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan returns to the stone forest',
    description: 'Bring White Jade and Moonglow to the cave. Test your timing before you spend the Relic Gu.',
    requires: all(ready, predecessor, stock(relic), whiteJade, moon),
    reason: 'Bring the Relic Gu and both fighting Gu after the caravan.',
    items: [{id: stealth, label: 'Stealth Rock Gu', description: 'The stone monkey king’s concealment Gu. Its cover did not hide the blood it left behind.', value: 0}],
    status: [status('practice', 'Training in the stone forest'), status('cultivation', 'Rank Two cultivation'),
        status('king', 'The stone monkey king'), status('path', 'The central pillar'),
        status('wine', 'The bitter wine lead'), status('toad', 'The sleeping river toad')],
    commands: [
        act('fill_for_practice', 'Draw four stones and return to the stone forest', 30, predecessor,
            'Fill your sea before you work on your timing. Bring White Jade to take the force of any hits you let through.',
            [recover, set('practice', 'ready'), note('practice', 'The sea is full. Draw out small groups while there is still an open way back.')],
            {needs: [moon, whiteJade], atStart: [stoneCost(4)], costs: [pay(4)], reason: 'Bring both Gu and four stones to prepare.'}),
        act('train_under_impact', 'Cut a path and take a protected headbutt', 75, done('fill_for_practice'),
            'Fire three ten-part Moonglow blades. Let a monkey hit your White Jade guard and practice steadying yourself through the blow.',
            [set('practice', 'dizzy_but_standing'), note('practice', 'White Jade keeps the blow from breaking you. The force still sends you reeling. Your three blades leave fourteen parts in the sea.')],
            {needs: [moon, whiteJade], parts: 30, costs: [health(4)], reason: 'Start with White Jade, Moonglow and thirty parts of essence.'}),
        act('use_the_relic', 'Use the red steel Relic Gu', 15, done('train_under_impact'),
            'Let the Relic Gu work on the wall of your aperture. It will be spent when the wall changes.',
            [set('aperture_stage', 'rank_two_middle'), set('reserve_grade', 'rank_two_middle'),
                note('cultivation', 'The wall changes and the Relic Gu is gone. You have reached Rank Two middle stage. Replenish your sea before returning to the central pillar.')],
            {needs: [field('practice', 'dizzy_but_standing')], atStart: [stock(relic)], costs: [item(relic, -1)],
                reason: 'You need the unused red steel Relic Gu.'}),
        act('refill_with_scarlet_essence', 'Fill the sea with scarlet essence', 30, done('use_the_relic'),
            'Spend six stones and let your essence settle for half an hour. Return to the forest when all forty-four parts are ready.',
            [recover, set('path', 'pillar_approach'), note('cultivation', 'The sea holds forty-four parts of scarlet essence. White Jade can take more blows on a full sea than it could before.')],
            {needs: [field('aperture_stage', 'rank_two_middle')], atStart: [stoneCost(6)], costs: [pay(6)], reason: 'Bring six stones for the refill.'}),
        act('hold_white_jade', 'Keep White Jade up through the ambush', 15, done('refill_with_scarlet_essence'),
            'Something hits from empty air. Spend twenty parts absorbing a series of blows and try to find where the attacks begin.',
            [set('king', 'concealed'), note('king', 'You feel danger before you see anything. White Jade takes the strikes, five parts at a time. You suspect the king is hiding itself with a Gu.')],
            {needs: [whiteJade, field('path', 'pillar_approach')], parts: 20}),
        act('turn_the_groups_against_each_other', 'Draw the monkey groups into a brawl', 12, done('hold_white_jade'),
            'Retreat across their territories. Spend thirteen more parts on defense and attacks as the monkeys turn on one another.',
            [set('king', 'isolated'), note('king', 'The groups are fighting each other. The hidden king still follows you. With eleven parts left, you cannot keep retreating under White Jade.')],
            {needs: [whiteJade, moon, field('king', 'concealed')], parts: 13}),
        act('bait_with_your_shirt', 'Drop the guard and catch the next strike in your shirt', 1, done('turn_the_groups_against_each_other'),
            'Hold your shirt loose and wait for the king to close. Raise White Jade at the last instant. The blow can still put you off balance.',
            [set('king', 'shirt_caught'), note('king', 'The last-second guard costs five parts. The king catches the shirt. You let it go and watch it move across the stone.')],
            {needs: [whiteJade, field('king', 'isolated')], parts: 5, costs: [health(6)]}),
        act('cut_the_moving_shirt', 'Fire at the moving shirt', 1, done('bait_with_your_shirt'),
            'Spend five parts on a Moonglow blade. Aim at where the shirt moves rather than where you last felt the strike.',
            [set('king', 'wounded_blood_visible'), note('king', 'The blade opens a deep wound. The king vanishes again, but its blood shows where it went. You have one part left in your sea.')],
            {needs: [moon, field('king', 'shirt_caught')], parts: 5}),
        act('recover_behind_the_door', 'Withdraw behind the rock door and replenish', 30, done('cut_the_moving_shirt'),
            'Spend six stones to refill while the king is still bleeding. Come back before the scattered monkeys block the route.',
            [recover, set('path', 'regrouping'), note('path', 'You close the door and fill your sea. The king has little time to recover. The old path is already starting to close.')],
            {needs: [field('king', 'wounded_blood_visible')], atStart: [stoneCost(6)], costs: [pay(6)], reason: 'Bring six stones for the return to the pillar.'}),
        act('follow_the_blood', 'Follow the blood back to the pillar', 15, done('recover_behind_the_door'),
            'Spend twenty parts forcing a way through the regrouping monkeys. Follow the blood as far as it leads.',
            [set('king', 'found_dead'), note('king', 'You find the old king already dead. A new king is on the body. Something like a rough grey stone rises from the corpse toward it.')],
            {needs: [moon, whiteJade, field('path', 'regrouping')], parts: 20}),
        act('take_stealth_rock', 'Drive off the new king and refine the Gu', 5, done('follow_the_blood'),
            'Spend eleven parts on two blades and refinement. Catch the Gu before the new king can take it.',
            [item(stealth, 1), set('king', 'stealth_rock_refined'),
                note('king', 'The rough stone is Stealth Rock Gu. It yields when you bring it into your aperture. The replacement king and its followers scatter.')],
            {needs: [moon, field('king', 'found_dead')], parts: 11}),
        act('leave_the_stairs_unexplored', 'Mark the stairs and retreat before the path closes', 20, done('take_stealth_rock'),
            'The stairs run into darkness. Spend eight parts getting out while the scattered monkeys return to their pillars. Come back another time.',
            [set('path', 'stairs_seen_route_reset'), note('path', 'You leave the stairs unexplored. The monkeys are taking up new territory. You will have to clear a route again before you go down.')],
            {needs: [stock(stealth), whiteJade, field('king', 'stealth_rock_refined')], parts: 8}),
        act('listen_for_wine', 'Hear where the former shopkeeper found bitter wine', 20, done('leave_the_stairs_unexplored'),
            'Word has spread about your cultivation and the Black Boar Gu. Meet the former shopkeeper where people can see you and hear what he found.',
            [set('wine', 'bai_bitter_shell_lead'), note('wine', 'He says Bai village makes bitter shell wine. It is closer than the other lead, but Bai patrols may kill a trespasser. You have no wine from them yet.')],
            {needs: [stock(boar)]}),
        act('turn_away_the_shopkeeper', 'Refuse to take back the tavern', 5, done('listen_for_wine'),
            'Tell him the contract stands. When he keeps pleading, strike him with the wine jar and warn him to go.',
            [set('shopkeeper', 'struck_left_wounded'), note('wine', 'He leaves wounded. The people at the other tables go back to their conversations. You still need a way to get bitter shell wine.')],
            {needs: [field('wine', 'bai_bitter_shell_lead')]}),
        act('hear_the_river_news', 'Wait for news from the river and the hall', 40, done('turn_away_the_shopkeeper'),
            'A sleeping Rank Five River Swallowing Toad has appeared downstream. Villagers are gathering at the gate. Wait for word of what the clan will try after Chi Shan fails to move it.',
            [set('toad', 'sleeping_response_pending'), nominate,
                note('toad', 'Chi Shan could not move it. The clan fears a flood. There is talk that one person might move it with bodily strength alone, but nobody here has proved that yet. The toad is still at the river.')],
            {needs: [field('path', 'stairs_seen_route_reset')]})
    ]
};

export async function registerGuLeadStoneForest(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_RELIC_MARKET && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadStoneForest, base);
}
