// Qing Mao, volume two chapters 162–166.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EAR_GRASS} from './book_gu_lead_ear_grass.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_ELDER_HALL} from './book_gu_lead_elder_hall.js';
import {GU_LEAD_TUSITA_FLOWER} from './book_gu_lead_tusita_flower.js';

export const GU_LEAD_THUNDER_CROWN = id('thunder_crown');
const local = name => `${GU_LEAD_THUNDER_CROWN}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:8bedc8d309a1db22a4facacf1a8525dbfacd1776d200548fb53f47c6521e394e';
const world = id('world');
const academy = id('academy');
const day = 1440;
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
const earId = `${GU_LEAD_EAR_GRASS}.earth_ear_grass`;
const scalesId = `${GU_LEAD_EAR_GRASS}.stealth_scales_gu`;
const wingsId = `${GU_LEAD_ELDER_HALL}.thunderwings_gu`;
const canopyId = `${GU_LEAD_ELDER_HALL}.sky_canopy_gu`;
const bloodMoonId = `${GU_LEAD_TUSITA_FLOWER}.blood_moon_gu`;
const tusitaId = `${GU_LEAD_TUSITA_FLOWER}.tusita_flower`;
const centipede = local('chainsaw_golden_centipede');
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
const predecessor = all(eq(extensionFact(GU_LEAD_TUSITA_FLOWER)),
    eq(`completed.${GU_LEAD_TUSITA_FLOWER}.count_your_six_gu`),
    eq(`actor.${GU_LEAD_TUSITA_FLOWER}.plan`, 'healing_gu_missing'));
const admitted = eq(extensionFact(GU_LEAD_THUNDER_CROWN));

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

// Authored dials (private receipt): ten days of wolf-tide duty (14,400 minutes) refilling the sea for 8 stones, essence
// per step (6, 12, 2, 8, 10, 2), minutes for the walk and the watching, and 520 stones as "over five hundred" thrown at
// the spring. Sourced: six hours clearing the monkeys, twelve hours in the tunnel, the Chainsaw Golden Centipede taken
// with the Cicada's aura, the lotus needing over fifty thousand stones at once, the wolf tide's end by the Blood
// Guillotine, the Bai clan's ambush, a Bai elder killed and Bai Ning Bing pressed back, the fight unresolved.
// The lotus truth and the ancestor's Gu are discovered in play and stay out of chat and summaries.
export const guLeadThunderCrown = {
    schema: 1, id: GU_LEAD_THUNDER_CROWN, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan goes back to the rock crack',
    description: 'Take the centipede below, find what the tunnel leads to, then watch the wolf king come and fight the Bai clan.',
    requires: all(ready, predecessor, stock(bloodMoonId), stock(wingsId), stock(canopyId), stock(earId), stock(scalesId), stock(tusitaId), stoneCost(2000)),
    reason: 'Keep your Blood Moon, Thunderwings, Sky Canopy, Ear Grass, Stealth Scales and tusita flower, and your stones.',
    items: [
        {id: centipede, label: 'Chainsaw Golden Centipede', description: 'Rank Three. A metre of gold shell with sawtooth blades down both sides. It can swallow your forearm and be swung like a blade, and it can stretch and shrink.', value: 0}
    ],
    status: [status('cave', 'The rock crack cave'), status('spring', 'The spring'), status('tide', 'The wolf tide'),
        status('pursuit', 'The valley'), status('duel', 'Bai Ning Bing')],
    commands: [
        act('hold_the_western_line_for_ten_days', 'Hold the western line while the wolf tide drags on', 10 * day, predecessor,
            'You cannot slip away. Many are watching an elder. When you do find a night, it is more than ten days later. Draw eight stones to refill your sea.',
            [recover(26), set('cave', 'ten_days_of_the_tide_passed'), event('thunder_crown', 'has_not_come_when_remembered'),
                note('cave', 'Ten days of battles pass. Gu Yue village is patched and scorched. The thunder crown wolf you remember has not come yet, and its timing has changed since your return.')],
            {atStart: [stoneCost(8)], costs: [pay(8)]}),
        act('clear_the_rock_forest', 'Cut a way through the jade eye stone monkeys', 6 * 60, done('hold_the_western_line_for_ten_days'),
            'Check the ash at the cave mouth for tracks first. Then spend six hours and six parts clearing almost ten groups of monkeys with Blood Moon.',
            [set('cave', 'rock_forest_path_cleared'), note('cave', 'No one has been to the cave. The monkeys have refilled the path you cut. Six hours with Blood Moon reopens it, and you reach the third room.')],
            {needs: [field('cave', 'ten_days_of_the_tide_passed'), stock(bloodMoonId)], parts: 6}),
        act('take_the_chainsaw_golden_centipede', 'Take the Chainsaw Golden Centipede', 40, done('clear_the_rock_forest'),
            'Walk in with a torch and Sky Canopy armour. Leak a trace of white silver essence so it comes for you. When it coils round your waist and wears the armour down, show it the Spring Autumn Cicada. Spend twelve parts.',
            [item(centipede, 1), set('cave', 'centipede_refined'),
                note('cave', 'The centipede surrenders to the Cicada’s aura, and you take its wild will. The rest of the swarm leaves. You do not kill them. Your sea is only forty-two parts of light silver and the armour drank much of it.')],
            {needs: [field('cave', 'rock_forest_path_cleared'), stock(canopyId)], parts: 12}),
        act('follow_the_tunnel_to_the_spring', 'Follow the Monk’s tunnel through twelve hours of centipedes', 12 * 60, done('take_the_chainsaw_golden_centipede'),
            'Ear Grass rules out the middle road and the right road ends. The centipede keeps its swarm back. Twelve hours and about three li take you down to water.',
            [set('spring', 'natural_essence_spring_and_lotus_bud_found'),
                note('spring', 'A crystal wall. Behind it an ash-grey river spirals like a small storm. In the water a blue and white bud floats, and you name it: the Heavenly Essence Treasure Lotus.')],
            {needs: [field('cave', 'centipede_refined'), stock(earId), stock(centipede)]}),
        act('test_the_lotus_with_stones', 'Throw stones through the crystal wall and count', 60, done('follow_the_tunnel_to_the_spring'),
            'Your hand goes through the wall as if it were not there. Do not touch the water. Throw in stones, a few at a time, and watch the damaged leaf.',
            [pay(520), set('spring', 'lotus_needs_over_fifty_thousand_stones_at_once'),
                note('spring', 'It eats a stone in a moment. After over five hundred, the damaged leaf grows a little. You would need over fifty thousand thrown in together, and you have just over ten thousand. Taking the lotus would end the spring, and the clan would look hard at you. You decide to wait for the right moment.')],
            {needs: [field('spring', 'natural_essence_spring_and_lotus_bud_found'), stock(tusitaId)], atStart: [stoneCost(520)]}),
        act('climb_the_hill_and_see_the_wolf_king', 'Leave the cave and climb the hill at dawn', 20, done('test_the_lotus_with_stones'),
            'The wolf cries outside have turned into a roar. The first light shows the whole wolf tide pouring at the village.',
            [set('tide', 'thunder_crown_wolf_arrives'), event('tide', 'myriad_beast_king_at_the_rear'),
                note('tide', 'The thunder crown wolf crouches at the back of the tide like a small hill. Gu Yue Bo and about ten elders cut out of the village toward it.')],
            {needs: [field('spring', 'lotus_needs_over_fifty_thousand_stones_at_once')]}),
        act('watch_the_elders_trap_the_wolf', 'Watch the elders fight the thunder crown wolf', 30, done('climb_the_hill_and_see_the_wolf_king'),
            'You stay on the slope. A purple moonblade, a healing light, a Rank Four berserk and a net of iron chain snakes.',
            [set('tide', 'elders_lose_six_and_pull_back'), event('elders', 'six_dead_and_the_clan_head_retreating'),
                note('tide', 'The elders wound it badly. It heals, then goes berserk and kills several of them. Gu Yue Bo traps it with iron chain snakes, leaves two elders to hold the chains and pulls everyone back into the village.')],
            {needs: [field('tide', 'thunder_crown_wolf_arrives')]}),
        act('watch_the_blood_guillotine', 'Watch what the clan calls down from the sky', 20, done('watch_the_elders_trap_the_wolf'),
            'A red cloud of Gu worms settles on the village square. It drinks from the Gu Masters seated there. You have seen this Gu before, in your last life.',
            [set('tide', 'blood_guillotine_broke_the_wolf_tide'), event('tribute', 'wounded_gu_masters_fed_to_the_ancestor_gu'),
                note('tide', 'The worms grow tens of thousands strong and sweep through the pack. The thunder crown wolf loses half its blood and flees at a tenth of its speed. The wolf tide is broken. The worms circle once and vanish into the clouds. You wanted this Gu once. You could not have it.')],
            {needs: [field('tide', 'elders_lose_six_and_pull_back')]}),
        act('follow_the_clan_leader_in_stealth', 'Follow the clan leader in stealth', 35, done('watch_the_blood_guillotine'),
            'Thunderwings cannot be hidden by Stealth Scales, so you walk. Keep your distance. You were not in the battle and cannot explain where you were.',
            [set('pursuit', 'watching_both_clans_over_the_dying_wolf'), event('bai_clan', 'at_the_valley_with_its_leader'),
                note('pursuit', 'In a valley the thunder crown wolf lies dying. Gu Yue Bo and the Bai clan leader are glaring at each other over it. You count three myriad beast kings in the wolf den, each with its own pack, and none of them working together.')],
            {needs: [field('tide', 'blood_guillotine_broke_the_wolf_tide'), stock(scalesId)], parts: 2}),
        act('kill_the_bai_elder', 'Meet the Bai elder with the Chainsaw Golden Centipede', 5, done('follow_the_clan_leader_in_stealth'),
            'Bai Ning Bing finds you and strikes. A Bai elder rushes in to protect him. Swallow your fist in the centipede, stretch Thunderwings and cut him down.',
            [event('bai_elder', 'killed_by_fang_yuan'), set('duel', 'bai_elder_killed'),
                note('duel', 'The centipede is a hiltless saw. Thunderwings beats the elder’s armour into shape. He is dead before it forms. Both clans stop fighting and look at you.')],
            {needs: [field('pursuit', 'watching_both_clans_over_the_dying_wolf'), stock(centipede), stock(wingsId)], parts: 8}),
        act('beat_bai_ning_bing_back', 'Fight Bai Ning Bing with the saw and Blood Moon', 20, done('kill_the_bai_elder'),
            'He has one arm and wants you dead. Shatter his ice blades, stretch the centipede to reach him and keep Blood Moon in your left hand.',
            [set('duel', 'bai_ning_bing_pressed_back'), event('gu_yue_clan', 'did_not_help_fang_yuan'),
                note('duel', 'He cannot win up close, so he turns to Blue Bird Ice Coffin and Icicle Gu. You take the birds with Blood Moon and let Sky Canopy take the rest. Gu Yue Bo orders his people to seize the wolf’s materials first. No one comes to help you.')],
            {needs: [field('duel', 'bai_elder_killed'), stock(bloodMoonId), stock(canopyId)], parts: 10}),
        act('send_the_centipede_underground', 'Send the centipede into the ground', 5, done('beat_bai_ning_bing_back'),
            'Let go of it. He will not see it coming.',
            [set('duel', 'centipede_hidden_underground_fight_unresolved'),
                note('duel', 'The centipede burrows away. Bai Ning Bing sees it go and steps back, cursing. The fight is not over.')],
            {needs: [field('duel', 'bai_ning_bing_pressed_back'), stock(centipede)], parts: 2})
    ]
};

let installed;
export async function registerGuLeadThunderCrown(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_TUSITA_FLOWER && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadThunderCrown, base);
    return installed;
}

const longJobs = new Set(guLeadThunderCrown.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadThunderCrownClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_THUNDER_CROWN);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
