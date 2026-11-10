// Qing Mao, volume two chapters 109–113.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_ESTATE_HANDOVER} from './book_gu_lead_estate_handover.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';

export const GU_LEAD_RELIC_MARKET = id('relic_market');
const local = name => `${GU_LEAD_RELIC_MARKET}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:e4cc43839823ce0731680f7b04d411d578c7bc27c16d59993ec80ef31068d3c4';
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
const deeds = `${GU_LEAD_ESTATE_HANDOVER}.estate_deeds`;
const grass = `${GU_LEAD_MOONGLOW}.vitality_grass`;
const worm = local('second_liquor_worm');
const relic = local('red_steel_relic');
const boar = local('black_boar_gu');
const token = local('jia_token');
const sweet = local('sweet_wine');
const sour = local('sour_wine');
const spicy = local('spicy_wine');
const receipts = 600;
const wormBid = 640;
const winePrice = 30;
const boarBid = 420;
const estatePrice = 6600;
const relicBid = 6500;
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_MOONGLOW)),
    eq(`completed.${GU_LEAD_MOONGLOW}.let_man_shi_leave`),
    eq(`actor.${GU_LEAD_MOONGLOW}.fight`, 'man_shi_left_wounded'));
const admitted = eq(extensionFact(GU_LEAD_RELIC_MARKET));

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
const price = amount => item(stone, -amount);
const funds = amount => stock(stone, amount);

export const guLeadRelicMarket = {
    schema: 1, id: GU_LEAD_RELIC_MARKET, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan bids at the spring caravan',
    description: 'Count the estate’s takings before you visit the treehouse. The prices on display are only where the bidding starts.',
    requires: all(ready, predecessor, stock(deeds), stock(grass)),
    reason: 'Settle the disturbance and keep the deeds and grass with you.',
    items: [
        {id: worm, label: 'Second Liquor Worm · unrefined', description: 'The worm you won at the treehouse. Keep it for a future fusion.', value: 0},
        {id: sweet, label: 'Sweet wine', description: 'One of four wines you need for the Liquor Worm fusion.', value: 0},
        {id: sour, label: 'Sour wine', description: 'One of four wines you need for the Liquor Worm fusion.', value: 0},
        {id: spicy, label: 'Spicy wine', description: 'One of four wines you need for the Liquor Worm fusion.', value: 0},
        {id: boar, label: 'Black Boar Gu · unrefined', description: 'It can build strength on top of what White Boar gave you, once you put it to use.', value: 0},
        {id: relic, label: 'Red steel Relic Gu', description: 'A Gu that could raise a Rank Two Gu Master by one stage when used.', value: 0},
        {id: token, label: 'Jia Fu’s token', description: 'Keep it in case you want to take up Jia Fu’s invitation in the future.', value: 0}
    ],
    status: [status('estate', 'The tavern and rents'), status('caravan', 'The spring caravan'),
        status('worm', 'Your Liquor Worm bid'), status('wines', 'Wines for the fusion'),
        status('other_gu', 'Other Gu on offer'), status('relic', 'The Relic Gu'), status('invitation', 'Jia Fu’s invitation')],
    commands: [
        act('settle_the_estate_books', 'Collect the tavern’s takings and the rents', 240, predecessor,
            'Word about Man Shi spreads among the Rank Two Gu Masters. Trade picks up again. Check the amounts due and collect them while the properties are still yours.',
            [item(stone, receipts), set('estate', 'takings_collected'),
                note('estate', 'Man Shi’s injuries keep him from leading his group, and the hired disturbances stop. The tavern’s takings and the rents bring in six hundred stones.')],
            {needs: [stock(deeds), stock(grass)]}),
        act('visit_the_treehouse', 'Find the Liquor Worm inside the treehouse', 30, done('settle_the_estate_books'),
            'Jia Fu’s spring caravan is bigger and earlier than you remember. Go inside the living tree and learn how to bid without showing what the worm is worth to you.',
            [set('worm', 'listed'), note('caravan', 'The worm is marked at five hundred stones. That is the starting price. The clerk keeps buyers’ names and final bids private. A Rank One listing closes half a day after the first bid.')]),
        act('submit_the_worm_bid', 'Put 640 stones behind a sealed bid', 1, done('visit_the_treehouse'),
            'Use your estimate of what the worm is worth to the other bidder. Fold the paper before you drop it through the slot. Set aside 640 stones.',
            [set('worm', 'bid_filed'), note('worm', 'The paper is in the slot and the stones are set aside. The clerk has yet to close the bids.')],
            {needs: [field('worm', 'listed')], atStart: [funds(wormBid)], costs: [price(wormBid)],
                reason: 'You need 640 stones to back the bid.'}),
        act('collect_the_worm', 'Return when the bids for the worm close', 720, done('submit_the_worm_bid'),
            'Come back after the half-day listing. Let the clerk tell you the result away from the other bidders.',
            [item(worm, 1), set('worm', 'won'),
                note('worm', 'The clerk hands over the worm for the 640 stones you set aside. Your bid was enough. The other papers stay with the clerk.')],
            {needs: [field('worm', 'bid_filed')]}),
        act('search_the_wine_stalls', 'Search the caravan stalls for all four wines', 240, done('collect_the_worm'),
            'Spend thirty stones on sweet, sour and spicy wine. Ask the sellers about the bitter kind as you work through the rest of the stalls.',
            [item(sweet, 1), item(sour, 1), item(spicy, 1), set('fusion', 'bitter_wine_missing'),
                note('wines', 'After several hours, you have sweet, sour and spicy wine. None of the stalls has bitter wine. You still cannot start the fusion.')],
            {needs: [stock(worm)], atStart: [funds(winePrice)], costs: [price(winePrice)],
                reason: 'Set aside thirty stones for the wines.'}),
        act('save_the_purse', 'Pass on Cleansing Water and watch the market until the third day', 1920, done('search_the_wine_stalls'),
            'Keep your stones for Gu you will use. The movement and scouting Gu on the stalls would not do what you need. Watch the treehouse prices without drawing attention to what you are after.',
            [set('other_gu', 'passed'), note('other_gu', 'You leave the Cleansing Water Gu to its bidders. You still want a movement Gu and a scouting Gu, but none you have seen is right for the job.')]),
        act('submit_the_boar_bid', 'Bid 420 stones for Black Boar Gu', 1, done('save_the_purse'),
            'On the third day of the caravan, a Black Boar Gu goes up for sale. Its strength could add to what White Boar gave you. Back your bid with 420 stones.',
            [set('other_gu', 'boar_bid_filed'), note('other_gu', 'Your bid is in. You will have to come back for the result.')],
            {atStart: [funds(boarBid)], costs: [price(boarBid)], reason: 'Set aside 420 stones for the Black Boar Gu bid.'}),
        act('collect_the_boar', 'Collect the Black Boar Gu when its listing closes', 720, done('submit_the_boar_bid'),
            'Return to the desk after the listing closes. Keep the Gu for later refinement.',
            [item(boar, 1), set('other_gu', 'boar_won'), note('other_gu', 'The clerk takes the stones you set aside. The Black Boar Gu is yours and remains unrefined.')],
            {needs: [field('other_gu', 'boar_bid_filed')]}),
        act('read_the_relic_listing', 'Read the one-day listing for the red steel Relic Gu', 10, done('collect_the_boar'),
            'The first bid can be three thousand stones. You expect the final price to go much higher. Check your purse before you decide whether to part with the estate.',
            [set('relic', 'listed'), note('relic', 'The Relic Gu could raise your cultivation by one stage. You expect it to cost five to eight thousand stones. The treehouse is closing bids after one day.')]),
        act('sign_over_the_estate', 'Sell the property and keep the healing grass', 120, done('read_the_relic_listing'),
            'Spend two hours negotiating with your uncle. Sign over the tavern, houses, land and eight servants for 6,600 stones. Keep Nine Leaf Vitality Grass and the leaves it can produce.',
            [item(stone, estatePrice), set('estate', 'sold_grass_retained'),
                note('estate', 'Your uncle takes the deeds for the tavern, houses and land, and takes back the eight servants. Three of them carry the payment to the treehouse. Keep the grass. The property takings now go to him.')],
            {needs: [stock(grass)], atStart: [stock(deeds)], costs: [item(deeds, -1)], reason: 'Bring the property deeds and keep the grass in your care.'}),
        act('submit_the_relic_bid', 'Put 6,500 stones behind your Relic Gu bid', 1, done('sign_over_the_estate'),
            'Take the payment to the treehouse and seal the bid. Remember the other prices you judged closely without winning those lots.',
            [set('relic', 'bid_filed'), note('relic', 'The papers and stones are with the clerk. The Relic Gu is still on display. You have no result yet.')],
            {needs: [field('estate', 'sold_grass_retained')], atStart: [funds(relicBid)], costs: [price(relicBid)],
                reason: 'You need 6,500 stones for the sealed bid.'}),
        act('hear_jia_fu', 'Hear Jia Fu’s offer while the bids close', 1319, done('submit_the_relic_bid'),
            'Jia Fu has noticed how close your losing bids came. Hear him out, decline the caravan job and ask about the inquiry into his brother’s death.',
            [item(token, 1), set('invitation', 'declined_token_kept'),
                note('invitation', 'Jia Fu gives you a token in case you reconsider. He is still pursuing the inquiry and says Tie Xue Leng may take roughly two years to arrive. For now you stay with the clan.')],
            {needs: [field('relic', 'bid_filed')]}),
        act('leave_with_the_relic', 'Collect the Relic Gu and leave quietly', 5, done('hear_jia_fu'),
            'Take the winning lot without announcing it. Keep both the Relic Gu and Jia Fu’s token for later.',
            [item(relic, 1), set('relic', 'won_unspent'),
                note('relic', 'The clerk settles your sealed bid. People outside are still guessing who won. The Relic Gu is in your keeping and your cultivation has yet to change.')],
            {needs: [field('relic', 'bid_filed'), stock(token)]})
    ]
};

let installed;
export async function registerGuLeadRelicMarket(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_MOONGLOW && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadRelicMarket, base);
    return installed;
}

const longJobs = new Set(guLeadRelicMarket.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadRelicMarketClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_RELIC_MARKET);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
