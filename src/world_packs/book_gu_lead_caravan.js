// Fang Yuan's continuation from the caravan's purple-gold counter.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_CLAN_RESPONSE} from './book_gu_lead_clan_response.js';
import {GU_LEAD_CONFRONTATION} from './book_gu_lead_confrontation.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_CARAVAN = id('caravan');
const local = name => `${GU_LEAD_CARAVAN}.${name}`;
const key = itemId => JSON.stringify({id: itemId});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:a7ab5e604627bbb1063fafb64bad57c79d83d73afe58d65ea16d4a3188f379a9';
const world = id('world');
const academy = id('academy');
const stone = key(`${GU_LEAD_REFINEMENT}.primeval_stone`);
const rock = local('purple_gold_rock');
const toad = local('mudskin_toad');
const drawnStone = local('half_drawn_stone');
const sea = id('primeval');
const caravanAnchor = `${GU_LEAD_CLAN_RESPONSE}.caravan`;
const worm = key(`${GU_LEAD_VITAL}.refined_liquor_worm`);

const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const stock = (key, value) => ({fact: `item.${key}`, op: 'gte', value});
const spend = output => ({type: 'energy', actor: 'player', energyId: sea, operation: 'use', output, control: 1});
const recover = amount => ({type: 'energy', actor: 'player', energyId: sea, operation: 'recover', amount});
const parts = amount => field('condensed_parts', amount);
const crescent = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead');
const hasWorm = stock(worm, 1);
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});

const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_CLAN_RESPONSE)),
    eq(`completed.${GU_LEAD_CLAN_RESPONSE}.shortlist_stones`),
    eq(`actor.${GU_LEAD_CLAN_RESPONSE}.shortlisted`, 6),
    eq(`actor.${GU_LEAD_CLAN_RESPONSE}.price_each`, 10),
    eq(`actor.${GU_LEAD_CLAN_RESPONSE}.purse_floor`, 28));
const admitted = eq(extensionFact(GU_LEAD_CARAVAN));

function act(name, label, duration, previous, description, effects, {needs = [], reserve = [], costs = [], reason, ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...reserve), reason: reason || 'Finish the earlier step and stay near the academy.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1,
        costs, effects, ...extra
    };
}

export const guLeadCaravan = {
    schema: 1, id: GU_LEAD_CARAVAN, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan at the caravan',
    description: 'Open the purple-gold stones and decide what to do with the find.',
    requires: all(ready, predecessor),
    reason: 'Finish choosing stones at the purple-gold counter.',
    items: [
        {id: rock, label: 'Purple-gold rock', description: 'An unopened rock from the caravan. The shell hides whatever is inside.', value: 0},
        {id: toad, label: 'Live Mudskin Toad', description: 'A Rank Two Gu. It eats about half a kilogram of yellow soil per meal.', value: 0},
        {id: drawnStone, label: 'Half-drawn primeval stone', description: 'You drew about half its essence to refill your sea.', value: 0}
    ],
    status: [
        status('rocks', 'The purple-gold counter'), status('sale', 'The sale'), status('room', 'Back in your room'),
        status('wine', 'At the wine tent'), status('dispute', 'The caravan dispute'),
        status('offer', 'A buyer for the recording'), status('crevice', 'Inside the crevice'),
        status('wall_message', 'The changed recording')
    ],
    commands: [
        act('buy_six', 'Buy the six purple-gold rocks', 2, predecessor,
            'Pay ten whole primeval stones each for the six rocks you picked. Set them on the counter to open them yourself.',
            [item(key(rock), 6), note('rocks', 'The clerk takes sixty stones. The six unopened rocks are yours.')],
            {reserve: [stock(stone, 88)], costs: [item(stone, -60)], reason: 'You need sixty stones for the rocks and twenty-eight to keep back.'}),
        act('ready_light', 'Ready the Moonlight Gu at the counter', 15, done('buy_six'),
            'Decline the clerk’s offer to open them. Let twelve ordinary parts return to your sea before you feed the Liquor Worm.',
            [recover(12)], {needs: [crescent, hasWorm, eq(`actor.${GU_LEAD_CONFRONTATION}.condensed_parts`, 4)]}),
        act('open_first_four', 'Grind down the first four rocks', 12, done('ready_light'),
            'Use the Liquor Worm to condense twelve ordinary parts to six. Add the four you brought. Spend eight of those parts to shave down four rocks with the Moonlight Gu.',
            [set('condensed_parts', 2), note('rocks', 'The first three grind down to dust. There is a smaller stone inside the fourth. It is empty too.')],
            {needs: [crescent, hasWorm], costs: [item(key(rock), -4), spend(12)],
                reason: 'Bring four unopened rocks and twelve ordinary parts to the counter.'}),
        act('grind_fifth', 'Grind the fifth rock to the yellow core', 3, done('open_first_four'),
            'Use one stronger part of essence to grind the shell. Keep the sixth rock where it is.',
            [set('condensed_parts', 1), set('fifth', 'exposed'),
                note('rocks', 'A lump of yellow mud shows through. Jia Jin Sheng offers forty stones if you stop now and hand it over.')],
            {needs: [crescent, parts(2)], costs: [item(key(rock), -1)], reason: 'Bring the fifth rock and two stronger parts of essence.'}),
        act('refuse_forty', 'Refuse Jia’s forty stones', 2, done('grind_fifth'),
            'Keep the core in your hand. Say what the clan’s rules have to say about forcing a clansman to sell. Let the other Gu Masters hear you.',
            [note('rocks', 'The Gu Masters turn to look at Jia. He backs down and tells you to keep going.')],
            {needs: [field('fifth', 'exposed')]}),
        act('finish_fifth', 'Shave the last of the mud away', 3, done('refuse_forty'),
            'Hold the lump still and spend your last stronger part of essence. Work around the edges of what is taking shape.',
            [item(key(toad), 1), set('condensed_parts', 0), set('fifth', 'opened'),
                note('rocks', 'A living Mudskin Toad sits in your palm. The crowd leans in. One purple-gold rock is still unopened.')],
            {needs: [crescent, parts(1), field('fifth', 'exposed')]}),
        act('sell_toad', 'Take five hundred stones for the toad', 5, done('finish_fifth'),
            'Ask the market price and turn to the other buyers when Jia haggles. A Rank Two Gu needs feeding you would have trouble keeping up here. Trade it when he agrees to five hundred.',
            [item(stone, 500), note('sale', 'Jia counts out five bags of one hundred stones. He keeps the toad, and you take the bags and the sixth rock.')],
            {costs: [item(key(toad), -1)], reason: 'You need the living toad to make the sale.'}),
        act('store_bags', 'Take the bags back to your room', 30, done('sell_toad'),
            'Get out of the crowded market with the last rock. Put the five bags of stones under your bed and keep your smaller purse with you.',
            [set('room_stones', 500), note('room', 'The five bags are under your bed. You still have the sixth rock.')],
            {reserve: [stock(stone, 500)], costs: [item(stone, -500)], reason: 'Bring the five hundred stones back from the tent.'}),
        act('condense_in_room', 'Draw a stone and refill your sea', 45, done('store_bags'),
            'Work with the Liquor Worm in your room. Draw from one whole stone as the worm condenses the essence, then keep what remains of the stone.',
            [item(key(drawnStone), 1), set('condensed_parts', 44),
                note('room', 'Your sea is full of stronger essence. Your aperture wall is still at the initial stage. About half the stone remains.')],
            {needs: [hasWorm, parts(0)], reserve: [stock(stone, 1)], costs: [item(stone, -1)], reason: 'Bring the Liquor Worm and one whole stone.'}),
        act('open_last', 'Open the sixth rock in private', 4, done('condense_in_room'),
            'Spend two stronger parts of essence to grind down the last rock. See what it holds before anyone else can.',
            [set('condensed_parts', 42), note('room', 'The sixth rock is empty. If anyone asks where you got the Liquor Worm, you can say it came from a purple-gold rock. People already saw one live Gu come out of the stone.')],
            {needs: [crescent, parts(44)], costs: [item(key(rock), -1)], reason: 'Bring the last unopened rock and the stronger essence.'}),
        act('look_for_grass', 'Go back to the market at lunch', 18 * 60, done('open_last'),
            'Return on the second day’s lunch break and look for Intimate Grass. Leave the heavy bags in your room.',
            [note('wine', 'The Intimate Grass has sold out. A wine tent is still open.')],
            {durationSinceKnowledge: caravanAnchor}),
        act('show_worm', 'Buy a cup of monkey wine for the worm', 3, done('look_for_grass'),
            'Pay one stone for a cup. Let the Liquor Worm drink it where the server can see.',
            [set('worm_seen', true),
                note('wine', 'The worm drains the cup in a few breaths. The server recognizes it and asks if it is for sale. You take the worm back and leave.')],
            {needs: [hasWorm], reserve: [stock(stone, 1)], costs: [item(stone, -1)], reason: 'Bring one whole stone and your Liquor Worm.'}),
        act('hear_dispute', 'Return for the second evening’s market', 25 * 60, done('show_worm'),
            'Listen for talk of the Liquor Worm, then follow the crowd gathering around Jia’s stall.',
            [note('dispute', 'You hear no talk about the worm. At the stall, a clansman says he paid Jia two hundred and fifty stones for what he took to be a Black Boar Gu. He holds up a common fat worm.')],
            {durationSinceKnowledge: caravanAnchor}),
        act('watch_jia_fu', 'Hear Jia Fu settle the dispute', 4, done('hear_dispute'),
            'Stay with the crowd as the caravan leader hears both men. Watch where Jia Jin Sheng goes when it is over.',
            [note('dispute', 'Jia Fu apologizes and gives the buyer five hundred stones. He says a Black Boar Gu would have cost about six hundred. The crowd praises him. His brother stalks off toward the wine shop.')]),
        act('offer_wall', 'Ask Jia for two thousand stones', 10, done('watch_jia_fu'),
            'Find Jia drinking at the wine shop. Offer to show him something the neighboring clans might pay for. Say you can go to his brother if he passes.',
            [set('deal', 'inspection_only'),
                note('offer', 'Jia agrees to inspect the recording before he pays. Two thousand stones is your price. No money has changed hands.')],
            {needs: [done('open_last'), eq(`completed.${GU_LEAD_VITAL}.search_crevice`)]}),
        act('show_wall', 'Lead Jia through the mountain crack', 45, done('offer_wall'),
            'Take the route you found while following the Liquor Worm. Bring Jia through the crack to see the recording for himself.',
            [set('jia', 'at_wall'),
                note('crevice', 'Jia sees the old recording and asks about the rest of the Monk’s inheritance. He thinks a burrowing Gu might have made this cave. You can see no other way out.')],
            {needs: [field('deal', 'inspection_only')]}),
        act('watch_change', 'Watch as the recording changes', 1, done('show_wall'),
            'The repeated scene cuts short. Listen to the wounded man on the wall and keep Jia in view.',
            [set('wall', 'changed'),
                note('wall_message', 'The Flower Wine Monk says he left an inheritance for someone who would wipe out the Gu Yue clan.'),
                note('crevice', 'Jia goes quiet when the recording changes. He turns toward you with a smile.')],
            {needs: [field('jia', 'at_wall')]}),
        act('strike', 'Fire two Moonblades before Jia speaks', 1, done('watch_change'),
            'Spend twenty stronger parts of essence at this distance. Aim one blade at his neck before he can move.',
            [set('condensed_parts', 22), set('jia', 'dead'), set('deal', 'ended_unpaid'),
                note('offer', 'The bargain ends in the crevice. Jia never paid the two thousand stones.'),
                note('crevice', 'Jia falls. The wall has stopped showing the old fight. You turn back to it.')],
            {needs: [crescent, parts(42), field('jia', 'at_wall'), field('wall', 'changed')],
                reason: 'Keep your Moonlight Gu ready and enough stronger essence for both blades.'})
    ]
};

let installed;
export async function registerGuLeadCaravan(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_CLAN_RESPONSE && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadCaravan, base);
    return installed;
}

export function guLeadCaravanClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_CARAVAN);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command?.duration ? Math.min(120, remaining) : null;
}

const longJobs = ['look_for_grass', 'hear_dispute'].map(local);
