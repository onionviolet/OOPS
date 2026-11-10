// Qing Mao, volume two chapters 159–161.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_ELDER_HALL} from './book_gu_lead_elder_hall.js';
import {GU_LEAD_SECRET_ROOM} from './book_gu_lead_secret_room.js';

export const GU_LEAD_TUSITA_FLOWER = id('tusita_flower');
const local = name => `${GU_LEAD_TUSITA_FLOWER}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:11a79708781cdfa559ab9fa7d52e25836e800925532785aa77d4d232557c2220';
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
const moonglowId = `${GU_LEAD_MOONGLOW}.moonglow_gu`;
const cleansingId = `${GU_LEAD_ELDER_HALL}.cleansing_water_gu`;
const wingsId = `${GU_LEAD_ELDER_HALL}.thunderwings_gu`;
const tokenId = `${GU_LEAD_SECRET_ROOM}.prize_token`;
const bloodEssence = local('blood_essence_gu');
const bloodMoon = local('blood_moon_gu');
const tusita = local('tusita_flower');
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const sea = id('primeval');
const reserve = value => ({fact: `energy.${sea}.reserve`, op: 'gte', value,
    reason: `Prepare ${value} parts of essence first.`});
const spend = output => ({type: 'energy', actor: 'player', energyId: sea, operation: 'use', output, control: 1});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_SECRET_ROOM)),
    eq(`completed.${GU_LEAD_SECRET_ROOM}.visit_uncle_and_aunt`),
    eq(`actor.${GU_LEAD_SECRET_ROOM}.recipes`, 'blood_moon_memorised'));
const admitted = eq(extensionFact(GU_LEAD_TUSITA_FLOWER));

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

// Authored dials (private receipt): two Blood Essence Gu extorted (one lost in the failed first try), 500 stones
// thrown into each Blood Moon try, 480 minutes per try, essence for the flight and wolf fights (14 and 12 parts),
// about 9,800 stones from the banquet ("almost ten thousand"), and the Prize Token being spent on the choice. The
// 2% aptitude loss is a recorded fact only because no effect changes the sea's capacity. The tusita flower holds the
// stones as a recorded fact; stone counts are not moved.
export const guLeadTusitaFlower = {
    schema: 1, id: GU_LEAD_TUSITA_FLOWER, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan finds a storage Gu',
    description: 'Fight the wolf tide as an elder, wash your sea, refine Blood Moon Gu and choose a storage Gu from the cave.',
    requires: all(ready, predecessor, stock(moonglowId), stock(cleansingId), stock(wingsId), stock(tokenId), stoneCost(1000)),
    reason: 'Keep Moonglow Gu, Thunderwings Gu, the Cleansing Water Gu, the Prize Token and about a thousand stones.',
    items: [
        {id: bloodEssence, label: 'Blood Essence Gu · extorted from Chi Lian', description: 'Refills a Gu Master’s blood. The base for Blood Moon Gu.', value: 0},
        {id: bloodMoon, label: 'Blood Moon Gu', description: 'Rank Three. A blood red moonblade that leaves bleeding wounds. It oozes for some days each month and drops to a third of its power. Feed it fresh blood.', value: 0},
        {id: tusita, label: 'Tusita flower', description: 'Rank Three storage Gu, a red lantern on a tongue tattoo. It stores primeval stones and other things, at most thirty thousand stones, about fifteen thousand with other goods.', value: 0}
    ],
    status: [status('tide', 'The wolf tide'), status('gu', 'Your Gu'), status('sea', 'Your sea'), status('cave', 'The underground cave'),
        status('banquet', 'The classmates’ banquet'), status('plan', 'Your six Gu')],
    commands: [
        act('read_the_injury_report', 'Read the medicine hall’s injury report on the west side', 15, predecessor,
            'You lead the Gu Masters holding the western ground. The report is for elders only. Burn it after you read it.',
            [set('tide', 'report_read_and_burned'), event('clan', 'afraid_and_unsettled_as_the_tide_hits_again'),
                note('tide', 'The wolf tide has hit the village more than ten times. The dead and wounded are far above normal. You remember this tide as one of the worst. You burn the report so the village does not panic.')],
            {needs: [stock(moonglowId)]}),
        act('extort_blood_essence_from_chi_lian', 'Take Blood Essence Gu from Chi Lian', 30, done('read_the_injury_report'),
            'Take two, since the first fusion can fail. He cannot say no to you now.',
            [item(bloodEssence, 2), set('gu', 'blood_essence_taken'), event('chi_lian', 'paid_again_unwillingly'),
                note('gu', 'Chi Lian hands over two Blood Essence Gu and says nothing.')],
            {needs: [field('tide', 'report_read_and_burned')]}),
        act('fuse_blood_moon_first_try', 'Try to fuse Blood Moon Gu and fail', 480, done('extort_blood_essence_from_chi_lian'),
            'Feed stones into the light while Moonglow Gu and Blood Essence Gu fuse. The first try fails.',
            [item(bloodEssence, -1), pay(500), set('gu', 'first_blood_moon_failed'),
                note('gu', 'The first fusion fails and a Blood Essence Gu is lost. Moonglow Gu survives.')],
            {needs: [field('gu', 'blood_essence_taken'), stock(bloodEssence), stock(moonglowId)], atStart: [stoneCost(500)]}),
        act('fuse_blood_moon_gu', 'Fuse Moonglow Gu and Blood Essence Gu again', 480, done('fuse_blood_moon_first_try'),
            'Use what you memorised in the secret room. The moonblade should glow blood red.',
            [item(moonglowId, -1), item(bloodEssence, -1), pay(500), item(bloodMoon, 1), set('gu', 'blood_moon_refined'),
                note('gu', 'Blood Moon Gu is yours. It lives in your right palm as a red crescent mark.')],
            {needs: [field('gu', 'first_blood_moon_failed'), stock(bloodEssence), stock(moonglowId)], atStart: [stoneCost(500)]}),
        act('wash_the_black_red_from_your_sea', 'Use the Cleansing Water Gu on your sea', 30, done('fuse_blood_moon_gu'),
            'The black red trace from the Life Burial Gu has stayed. Wash it out before it spoils your aptitude further.',
            [item(cleansingId, -1), set('reserve_grade', 'rank_three_pure'), set('aptitude', 'down_two_percent_to_forty_two'),
                note('sea', 'Your sea is clean white silver again. The Life Burial Gu cost you two points of aptitude, so a full sea now holds forty-two of what it held at forty-four. Leaving the trace in longer would have cost more. Your Spring Autumn Cicada is recovering faster than your aperture can hold. You may have to raise it outside your body.')],
            {needs: [field('gu', 'blood_moon_refined'), stock(cleansingId)]}),
        act('fly_to_the_east_gate', 'Fly to the east gate on Thunderwings', 20, done('wash_the_black_red_from_your_sea'),
            'A frenzy wolf is at the east gate. Three elders hold it. Spend fourteen parts on the flight and a few moonblades. Carry a Rank One Gu Master out from under its tail.',
            [set('tide', 'frenzy_wolf_fought_at_the_east_gate'), event('classmate', 'rescued_and_no_longer_hostile'), event('clan_head', 'calls_off_the_hidden_hall_search_for_now'),
                note('tide', 'You land a young woman out of the tail’s path and tell her to get back. She is a classmate whose name you do not remember. Thunderwings burns essence faster than anything else you hold, so you run the rest.')],
            {needs: [field('aptitude', 'down_two_percent_to_forty_two'), stock(wingsId), stock(bloodMoon)], parts: 14}),
        act('finish_the_frenzy_wolf_with_the_elders', 'Wear the frenzy wolf down with Blood Moon blades', 40, done('fly_to_the_east_gate'),
            'Spend twelve parts. The bleeding blades do not heal while the elders press it. Refuse the medicine hall’s check afterwards.',
            [set('tide', 'frenzy_wolf_killed_with_the_elders'), event('elders', 'liking_and_fearing_fang_yuan'),
                note('tide', 'The elders say the Blood Moon blades made the kill. You thank them and say you still have much to learn. You turn down Li Chen’s check. You are unhurt. You cannot go to the rock crack cave while the tide lasts.')],
            {needs: [field('tide', 'frenzy_wolf_fought_at_the_east_gate'), stock(bloodMoon)], parts: 12}),
        act('choose_the_tusita_flower', 'Spend the Prize Token in the underground cave', 20, done('finish_the_frenzy_wolf_with_the_elders'),
            'A few dozen Gu rest here, Rank Two to Four. You find none to heal with. You find a storage Gu.',
            [item(tokenId, -1), item(tusita, 1), set('cave', 'tusita_flower_chosen'),
                note('cave', 'You pick the tusita flower. You also see Cave Declaration Grass, Air Return Cicada, Dried Bone Dragonfly, Phoenix Wing Butterfly and a Love Separation Gu that once belonged to Wang Er. There is no Rank Five Gu here. You think those are kept elsewhere.')],
            {needs: [field('tide', 'frenzy_wolf_killed_with_the_elders'), stock(tokenId)]}),
        act('go_to_dings_banquet', 'Go to Ding Zong’s banquet', 90, done('choose_the_tusita_flower'),
            'Classmates you once extorted want to be seen with you. Drink a little, say your old ways were foolish, and let them give you what they give.',
            [pay(-9800), set('banquet', 'gifts_taken_about_ten_thousand_stones'), event('classmates', 'bribing_the_new_elder_willingly'),
                note('banquet', 'Nobody has to be asked. Tens of bags come across the table, a little under ten thousand stones. You tell them your old ways were foolish and they cheer. You see how the clan takes from the people at the bottom and they thank it.')],
            {needs: [field('cave', 'tusita_flower_chosen')]}),
        act('store_the_stones_in_the_tusita_flower', 'Take the stones to your new bamboo house and store them', 10, done('go_to_dings_banquet'),
            'The clan gave you a house with a study and a closed-door cultivation room. You have no servants. Put the stones in the tusita flower.',
            [set('storage', 'stones_in_the_tusita_flower'), set('gu', 'tusita_flower_in_use'),
                note('gu', 'The red light draws every stone into the flower. It holds thirty thousand at most. With your other goods you would only trust it with about fifteen thousand.')],
            {needs: [field('banquet', 'gifts_taken_about_ten_thousand_stones'), stock(tusita)]}),
        act('count_your_six_gu', 'Count the six Gu again', 10, done('store_the_stones_in_the_tusita_flower'),
            'Attack, defence, movement, storage and scouting are filled. Healing is not.',
            [set('plan', 'healing_gu_missing'),
                note('plan', 'Endless Vitality, Undying Grass and Self-reliance would all do. The clan cave and the exchange board have none. Your only hope is the Flower Wine Monk’s inheritance, and you expect it to be nearly empty. You still have to finish it and subdue the Chainsaw Golden Centipede, which would cover Blood Moon’s bad days.')],
            {needs: [field('storage', 'stones_in_the_tusita_flower')]})
    ]
};

let installed;
export async function registerGuLeadTusitaFlower(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_SECRET_ROOM && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadTusitaFlower, base);
    return installed;
}

const longJobs = new Set(guLeadTusitaFlower.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadTusitaFlowerClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_TUSITA_FLOWER);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
