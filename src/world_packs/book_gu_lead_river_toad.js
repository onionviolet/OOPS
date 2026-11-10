// Qing Mao, volume two chapters 119–121.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_RELIC_MARKET} from './book_gu_lead_relic_market.js';
import {GU_LEAD_STONE_FOREST} from './book_gu_lead_stone_forest.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';

export const GU_LEAD_RIVER_TOAD = id('river_toad');
const local = name => `${GU_LEAD_RIVER_TOAD}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:cc4b180efcd7fedc1fcc4021e64f0f8bae94ebf089bb07da8a126b270f0e2a0a';
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
const boar = `${GU_LEAD_RELIC_MARKET}.black_boar_gu`;
const refinedBoar = local('refined_black_boar_gu');
const firstWorm = `${GU_LEAD_VITAL}.refined_liquor_worm`;
const secondWorm = `${GU_LEAD_RELIC_MARKET}.second_liquor_worm`;
const bitter = local('bitter_shell_wine');
const wholeShell = local('whole_bitter_shell');
const brokenShell = local('broken_bitter_shell');
const worm = local('four_flavours_liquor_worm');
const recipe = [firstWorm, secondWorm, `${GU_LEAD_RELIC_MARKET}.sour_wine`, `${GU_LEAD_RELIC_MARKET}.sweet_wine`,
    bitter, `${GU_LEAD_RELIC_MARKET}.spicy_wine`];
const sea = id('primeval');
const reserve = value => ({fact: `energy.${sea}.reserve`, op: 'gte', value,
    reason: `Prepare ${value} parts of essence first.`});
const spend = output => ({type: 'energy', actor: 'player', energyId: sea, operation: 'use', output, control: 1});
const stamina = loss => ({type: 'vital', actor: 'player', key: 'stamina', amount: -loss});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_STONE_FOREST)),
    eq(`completed.${GU_LEAD_STONE_FOREST}.hear_the_river_news`),
    eq(`world.${GU_LEAD_STONE_FOREST}.toad_nominee`, 'fang_yuan'),
    eq(`actor.${GU_LEAD_STONE_FOREST}.aperture_stage`, 'rank_two_middle'));
const admitted = eq(extensionFact(GU_LEAD_RIVER_TOAD));

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

export const guLeadRiverToad = {
    schema: 1, id: GU_LEAD_RIVER_TOAD, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan answers the call from the river',
    description: 'Put Black Boar Gu to use before you report. Chi Shan has already tried to move the sleeping toad.',
    requires: all(ready, predecessor, stock(boar)),
    reason: 'Hear the news from the river and bring your Black Boar Gu.',
    items: [
        {id: refinedBoar, label: 'Black Boar Gu', description: 'The refined Gu that added to your bodily strength.', value: 0},
        {id: wholeShell, label: 'Hundred-year bitter shell · intact', description: 'A small shell uncovered after the toad drank from the river.', value: 0},
        {id: brokenShell, label: 'Hundred-year bitter shell · broken', description: 'One of the two damaged shells you gathered from the riverbed.', value: 0},
        {id: bitter, label: 'Bitter shell wine', description: 'The bitter fourth wine needed for the Liquor Worm fusion.', value: 0},
        {id: worm, label: 'Four Flavours Liquor Worm', description: 'Use it to refine Rank Two essence one stage higher. It takes more primeval stones to keep up the work.', value: 0}
    ],
    status: [status('strength', 'Black Boar training'), status('orders', 'The clan’s order'), status('river', 'At the river'),
        status('shells', 'Bitter shell wine'), status('reward', 'The clan’s reward'), status('fusion', 'Four Flavours Liquor Worm'),
        status('plans', 'Your next refinement')],
    commands: [
        act('train_with_black_boar', 'Refine Black Boar and work it into your body', 90, predecessor,
            'Spend six stones and four parts of essence to prepare the Gu and train with it. The strength stays in your muscles after you put the Gu away.',
            [item(refinedBoar, 1), {type: 'xp', actor: 'player', skill: 'Weightlifting', amount: 60},
                set('strength', 'white_and_black_boar'), note('strength', 'Black Boar adds to what White Boar gave you. The increase is in your body now.')],
            {atStart: [stock(boar), stoneCost(6)], costs: [item(boar, -1), pay(6)], parts: 4}),
        act('report_for_the_order', 'Report to the hall and take the compulsory order', 15, done('train_with_black_boar'),
            'You have no team and your monthly missions have been recorded as failures. The clan leader orders you to the river. Ask Chi Shan’s group to keep back while you try.',
            [set('orders', 'compulsory_accepted'), note('orders', 'The hall gives you a compulsory assignment. You will approach the toad alone and keep your Gu quiet in your aperture.')],
            {needs: [field('strength', 'white_and_black_boar')]}),
        act('test_the_weight', 'Try moving the toad with your own strength', 5, done('report_for_the_order'),
            'Push against the slippery skin without drawing on any Gu. Watch how the river moves around the bed.',
            [set('river', 'bare_push_failed'), note('river', 'You cannot shift it by strength alone. A tide is coming. The channel widens downstream and the waves are pushing in that direction.')],
            {needs: [field('orders', 'compulsory_accepted')], costs: [stamina(3)]}),
        act('push_with_the_tide', 'Wait for the tide and push downstream', 25, done('test_the_weight'),
            'Set your feet where the current can help you. Keep your Gu in your aperture and push when the waves come against the toad.',
            [set('river', 'toad_left_downstream'), event('river', 'toad_left_downstream'),
                note('river', 'The current helps move it roughly three hundred meters. The toad wakes, looks at you, swallows river water and fish, then heads downstream. You see things left bare in the bed.')],
            {needs: [field('river', 'bare_push_failed')], costs: [stamina(8)]}),
        act('collect_bitter_shells', 'Search the exposed riverbed for bitter shells', 20, done('push_with_the_tide'),
            'Follow the wine smell before you go back to the village. Gather the little shells and collect enough bitter wine for one jar.',
            [item(wholeShell, 4), item(brokenShell, 2), item(bitter, 1), set('shells', 'wine_collected'),
                note('shells', 'You gather four whole shells and two broken ones. The wine from the exposed shells gives you the fourth flavour you need.')],
            {needs: [field('river', 'toad_left_downstream')]}),
        act('collect_the_hall_reward', 'Collect the hall’s reward and receive your new rank', 20, done('collect_bitter_shells'),
            'The village has heard the river report. Collect five hundred stones and hear the clan leader name you a team leader by exception.',
            [item(stone, 500), set('leadership', 'team_leader'), event('tavern_staff', 'killed_by_gu_masters'),
                note('reward', 'The hall pays five hundred stones and names you a team leader. People are calling you a hero. You still have to decide what to do with the money.')],
            {needs: [field('orders', 'compulsory_accepted'), field('river', 'toad_left_downstream')]}),
        act('fuse_the_four_flavours', 'Fuse both Liquor Worms through the four wines', 85, done('collect_the_hall_reward'),
            'Work in the second room. Feed the light 460 stones as you pour in sour, sweet, bitter and spicy wine in that order. A failed fusion could damage a worm or cost you the wine.',
            [item(worm, 1), set('fusion', 'four_flavours_refined'),
                note('fusion', 'The four wines are spent and both old worms are gone. A single worm comes out of the light. It can refine your scarlet essence a stage higher.')],
            {atStart: [...recipe.map(ingredient => stock(ingredient)), stoneCost(460)], costs: [...recipe.map(ingredient => item(ingredient, -1)), pay(460)],
                reason: 'You need both Liquor Worms, all four wines and 460 stones.'}),
        act('prepare_stronger_essence', 'Draw stones and prepare upper-stage essence', 30, done('fuse_the_four_flavours'),
            'Spend twenty stones to build your supply. Put some of it through the Four Flavours Liquor Worm. Keep two stronger parts for nourishing your aperture.',
            [{type: 'energy', actor: 'player', energyId: sea, operation: 'recover', amount: 12},
                set('condensed_parts', 2), set('reserve_grade', 'rank_two_condensed'), set('cultivation', 'middle_with_upper_essence'),
                note('fusion', 'Some of your essence is now a stage stronger than your aperture. You can nourish it faster, but this work uses stones quickly. The leaf money will not cover everything.')],
            {needs: [stock(worm), field('fusion', 'four_flavours_refined')], atStart: [stoneCost(20)], costs: [pay(20)]}),
        act('ask_about_stealth_scales', 'Nourish your aperture and ask Jiang Ya about materials', 15, done('prepare_stronger_essence'),
            'Spend one stronger part on your aperture. Keep Stealth Rock for now, and ask Jiang Ya to look for what you would need for a Gu that could hide your clothes as well as your body.',
            [set('condensed_parts', 1), set('nourishment', 'upper_essence_applied'), set('stealth_plan', 'materials_requested'), event('xiong_notice', 'chi_shan_named_fang_yuan'),
                note('plans', 'You still need the materials for Stealth Scales. Stealth Rock alone would leave your clothes visible.')],
            {needs: [stock(`${GU_LEAD_STONE_FOREST}.stealth_rock_gu`), field('cultivation', 'middle_with_upper_essence'), field('condensed_parts', 2)]})
    ]
};

export async function registerGuLeadRiverToad(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_STONE_FOREST && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadRiverToad, base);
}
