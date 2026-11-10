// Qing Mao, volume two chapters 167–171.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EAR_GRASS} from './book_gu_lead_ear_grass.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_ELDER_HALL} from './book_gu_lead_elder_hall.js';
import {GU_LEAD_TUSITA_FLOWER} from './book_gu_lead_tusita_flower.js';
import {GU_LEAD_THUNDER_CROWN} from './book_gu_lead_thunder_crown.js';

export const GU_LEAD_LYCAN = id('lightning_lycan');
const local = name => `${GU_LEAD_LYCAN}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:8ceff2e38cac858cc8ec59cc5a448a21d1d5b129d224937ec095abf1336f4dd9';
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
const health = loss => ({type: 'vital', actor: 'player', key: 'health', amount: -loss});
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const earId = `${GU_LEAD_EAR_GRASS}.earth_ear_grass`;
const wingsId = `${GU_LEAD_ELDER_HALL}.thunderwings_gu`;
const canopyId = `${GU_LEAD_ELDER_HALL}.sky_canopy_gu`;
const tusitaId = `${GU_LEAD_TUSITA_FLOWER}.tusita_flower`;
const centipedeId = `${GU_LEAD_THUNDER_CROWN}.chainsaw_golden_centipede`;
const shield = local('thunder_shield_gu');
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
const predecessor = all(eq(extensionFact(GU_LEAD_THUNDER_CROWN)),
    eq(`completed.${GU_LEAD_THUNDER_CROWN}.send_the_centipede_underground`),
    eq(`actor.${GU_LEAD_THUNDER_CROWN}.duel`, 'centipede_hidden_underground_fight_unresolved'));
const admitted = eq(extensionFact(GU_LEAD_LYCAN));

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

// Authored dials (private receipt): essence per step (3, 1, 26, 14, 1, 2), 40 stones for the nine-minute refill, 10
// health lost to the lightning, minutes per step, and the Thunderwings and Sky Canopy conditions as recorded facts.
// Sourced: the storm chasing Fang Yuan, the Thunder Shield Gu taken with the Cicada's aura, the refill in eight or nine
// minutes, five elders dead, the lycan and its Wolf Smoke, the bolt that kills the shield and cripples the wings, a thousand
// wolves cut, the truce with Bai Ning Bing, the brief clash, Tie Xue Leng and Ruo Nan, and the banquet.
// Chi Lian's death and the leaders' fates are other people's scenes and stay world facts.
export const guLeadLycan = {
    schema: 1, id: GU_LEAD_LYCAN, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan runs from the wolf in the smoke',
    description: 'Take a wild Gu, outrun the ice storm, survive the lightning lycan, make a truce with Bai Ning Bing and meet the Divine Investigator.',
    requires: all(ready, predecessor, stock(centipedeId), stock(wingsId), stock(canopyId), stock(earId), stock(tusitaId), stoneCost(100)),
    reason: 'Keep your centipede, Thunderwings, Sky Canopy, Ear Grass, tusita flower and stones.',
    items: [
        {id: shield, label: 'Thunder Shield Gu · taken from the wolf’s body', description: 'A glass blue Gu with turtle markings. It makes a half-round lightning shield.', value: 0}
    ],
    status: [status('storm', 'The ice storm'), status('valley', 'The valley'), status('smoke', 'The black smoke'),
        status('bai', 'Bai Ning Bing'), status('road', 'The road to the village'), status('banquet', 'The banquet')],
    commands: [
        act('outfly_the_ice_storm', 'Fly away from the ice storm and into the valley', 15, predecessor,
            'Bai Ning Bing has loosed Swirl Gu and Fierce Wind Gu with his iceblades. Thunderwings is faster than the storm. Spend three parts.',
            [set('storm', 'outflown_and_driven_into_the_wolf'), event('thunder_crown', 'minced_by_the_ice_storm'),
                note('storm', 'Thunderwings outruns the storm. You charge a Bai Gu Master and he runs. At the last second you rise over the dying wolf. The storm hits it and takes it apart. The loot is ruined and its Gu flee into the air.')],
            {needs: [stock(wingsId), stock(centipedeId)], parts: 3}),
        act('take_the_thunder_shield_gu', 'Take a wild Gu fleeing from the wolf’s body', 10, done('outfly_the_ice_storm'),
            'The Gu choose for themselves. One is blue and bites with lightning. The next is a Thunder Shield Gu. Show it the Spring Autumn Cicada. Spend one part.',
            [item(shield, 1), set('storm', 'thunder_shield_gu_taken'),
                note('storm', 'The Thunder Shield Gu goes still as if it were dead. You take it and refine it. You were hoping for a healing Gu and had no luck.')],
            {needs: [field('storm', 'outflown_and_driven_into_the_wolf'), stock(centipedeId)], parts: 1}),
        act('hide_and_refill_from_the_tusita_flower', 'Hide in the forest and draw stones from the tusita flower', 9,
            done('take_the_thunder_shield_gu'),
            'Bai Ning Bing is looking for you with Lightning Eye Gu, which sees no further than the leaves. You are almost empty. At Rank Three a refill takes more stones and more time. Draw forty.',
            [recover(44), set('smoke', 'refilled_in_hiding'),
                note('smoke', 'The stones shrink and your sea rises over eight or nine minutes. Bai Ning Bing finds nothing.')],
            {needs: [field('storm', 'thunder_shield_gu_taken'), stock(tusitaId)], atStart: [stoneCost(40)], costs: [pay(40)]}),
        act('count_the_dead_in_the_valley', 'Come out and see what the two clans have left', 10, done('hide_and_refill_from_the_tusita_flower'),
            'Five elders are dead, three of Gu Yue and two of Bai. The leaders fight on, and three wild Gu are still caught between the two clans.',
            [set('valley', 'fourth_wolf_king_arriving'), event('valley', 'five_elders_dead_and_two_clans_at_war_over_the_loot'),
                note('valley', 'A Bai water cage closes on a Gu. A Gu Yue moonblade bursts it, and the Gu escapes. Then you hear a wolf howl like a horn. A fourth thunder crown wolf comes at the head of a new tide.')],
            {needs: [field('smoke', 'refilled_in_hiding')]}),
        act('flee_the_lightning_lycan', 'Fly from the lightning lycan’s black smoke', 10, done('count_the_dead_in_the_valley'),
            'It spits a Wolf Smoke Gu, then a bolt of lightning across a hundred li. Spend twenty-six parts on the flight and on both shields. It will cost you more than essence.',
            [item(shield, -1), set('smoke', 'lightning_took_shield_and_wings'), set('thunderwings', 'barely_alive_and_unusable'), set('sky_canopy', 'heavily_injured'),
                event('lycan', 'a_myriad_beast_king_with_human_cunning'),
                note('smoke', 'The shield lasts a second. The bolt drops you and your eyes will not clear. Thunder Shield Gu is dead. Thunderwings is barely alive and you cannot use it. Sky Canopy is badly hurt. You are in the dark smoke and cannot tell where you are.')],
            {needs: [field('valley', 'fourth_wolf_king_arriving'), stock(canopyId), stock(wingsId), stock(shield)], parts: 26, costs: [health(10)]}),
        act('cut_through_the_wolves', 'Cut your way through the pack with the centipede', 30, done('flee_the_lightning_lycan'),
            'Use Ear Grass to choose the quiet side. Avoid every frenzy wolf. Cut up to a thousand wolves with the saw. Spend fourteen parts.',
            [set('smoke', 'a_thousand_wolves_cut_and_essence_nearly_gone'), set('centipede', 'razors_badly_worn'), event('elders', 'dying_in_the_smoke'),
                note('smoke', 'The wolves come in order from behind you. The saw kills a thousand and ruins its own razors. Some wolves wear a defensive Gu. You stop using Sky Canopy because you have no essence left. You hear elders die in the dark.')],
            {needs: [field('smoke', 'lightning_took_shield_and_wings'), stock(centipedeId), stock(earId)], parts: 14}),
        act('make_a_truce_with_bai_ning_bing', 'Offer Bai Ning Bing a harder bargain than he expected', 20, done('cut_through_the_wolves'),
            'He wants you to die beside him. Do not offer to cooperate. Say you do not fear death, and let him think of his own.',
            [set('bai', 'truce_until_the_smoke_clears'),
                note('bai', 'He asks what a path is. You will not tell him yours. He says it is your choice whether to trust him, and suggests you cover each other. You know he is afraid of dying and that he takes kindness as weakness. That is your reading of him, not something he said.')],
            {needs: [field('smoke', 'a_thousand_wolves_cut_and_essence_nearly_gone')]}),
        act('escape_through_the_southeast_gap', 'Break out of the smoke with Lightning Eye Gu and Ear Grass', 30, done('make_a_truce_with_bai_ning_bing'),
            'His Gu sees thirty steps through the smoke. Your Ear Grass hears two hundred. Keep five steps apart and go for the opening before it fills. Spend one part.',
            [set('smoke', 'out_of_the_smoke_with_bai'), note('smoke', 'You go around the south side. The southeast gap is open. You step out into light and look back at a black pot of smoke on the mountain. The two clan leaders are still fighting the wolf inside it.')],
            {needs: [field('bai', 'truce_until_the_smoke_clears'), stock(earId)], parts: 1}),
        act('part_from_bai_ning_bing', 'Trade one clash with Bai Ning Bing and part', 5, done('escape_through_the_southeast_gap'),
            'It was pleasant working with you. The truce ends with the smoke. Spend two parts.',
            [set('bai', 'parted_wanting_a_later_duel'), event('bai_ning_bing', 'found_his_path_witnessing_brilliance'),
                note('bai', 'Both blades break on each other. He says he has found his path and wants a duel another day, and he hopes your death will bring light into his life. You expect to be gone by then.')],
            {needs: [field('bai', 'truce_until_the_smoke_clears'), stock(centipedeId)], parts: 2}),
        act('decide_to_leave_the_mountain', 'Decide it is time to go', 10, done('part_from_bai_ning_bing'),
            'The lycan is more cunning than the thunder crown wolf. Whoever lives, you will be investigated. Take the lotus, a healing Gu from the clan store and leave. Thunderwings cannot be used, so you run.',
            [set('leave', 'take_lotus_and_a_healing_gu_then_go'),
                note('leave', 'If you take the lotus and the clan store while the village is in disorder, no outcome of this fight can hurt you more. If you wait, a clan that has just lost its elders will start looking at you.')],
            {needs: [field('bai', 'parted_wanting_a_later_duel')]}),
        act('meet_tie_xue_leng_on_the_road', 'Meet two strangers on the road to the village', 15, done('decide_to_leave_the_mountain'),
            'An old man in a copper mask with a silver plate marked five on his belt, and a young woman with a plate marked three. You know him.',
            [set('road', 'met_the_divine_investigator_and_his_daughter'), event('tie_xue_leng', 'is_at_gu_yue_village_for_the_jia_case'),
                note('road', 'It is Tie Xue Leng, Rank Five, the Divine Investigator. You pretend to be a frightened young elder looking for reinforcements. He says not to bother and goes to the clan leaders.')],
            {needs: [field('leave', 'take_lotus_and_a_healing_gu_then_go')]}),
        act('see_the_lycan_driven_off', 'Reach the valley and see the iron hand', 15, done('meet_tie_xue_leng_on_the_road'),
            'You and the daughter arrive as a black iron hand tears the sky and breaks on the lycan. He coughs blood that burns the grass.',
            [set('road', 'lycan_driven_off_by_tie_xue_leng'), event('clan_leaders', 'alive_and_thanking_the_investigator'), event('chi_lian', 'killed_in_the_smoke'),
                note('road', 'The lycan leaves with almost every bone broken. Tie Xue Leng spits dark green blood and says he is ill. His daughter Ruo Nan will lead the case on the murder you were part of.')],
            {needs: [field('road', 'met_the_divine_investigator_and_his_daughter')]}),
        act('sit_through_the_banquet_for_the_investigator', 'Sit through the banquet in the clan hall', 60, done('see_the_lycan_driven_off'),
            'Fewer than ten elders sit at one table. Chi Lian’s place is empty. Yao Ji demands to know where you hid. Tell her.',
            [set('banquet', 'admitted_fear_and_stayed'), set('road', 'leaving_blocked_by_the_investigator'), event('tie_xue_leng', 'distrusts_fang_yuan_after_his_answer'),
                event('yao_ji', 'broke_her_own_arm_to_avoid_the_battle'),
                note('banquet', 'The elders glare at you for hiding. You answer Yao Ji that she broke her own arm to stay out of the fight, as she did in your last life. When the clan leader asks, you say you were afraid and hid. Tie Xue Leng watches you. Leaving now would look like a thief running, and taking the lotus would send him after you. You stay and watch.')],
            {needs: [field('road', 'lycan_driven_off_by_tie_xue_leng')]})
    ]
};

export async function registerGuLeadLycan(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_THUNDER_CROWN && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadLycan, base);
}
