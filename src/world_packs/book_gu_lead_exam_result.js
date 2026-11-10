// Qing Mao, volume one chapters 77–80, with observer-only continuity from 75–76.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_HUNT_FOLLOWTHROUGH} from './book_gu_lead_hunt_followthrough.js';
import {GU_LEAD_INHERITANCE} from './book_gu_lead_inheritance.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_EXAM_RESULT = id('exam_result');
const local = name => `${GU_LEAD_EXAM_RESULT}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:06c1c39500d9f9fbfef8e2cfa68bb6e161ff8e5a0ad43861bdaa39312c62ede4';
const world = id('world');
const academy = id('academy');
const essence = id('primeval');
const day = 1440;
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const key = id => JSON.stringify({id});
const stock = id => ({fact: `item.${key(id)}`, op: 'gte', value: 1});
const item = (id, amount) => ({type: 'item', actor: 'player', key: key(id), amount});
const recover = amount => ({type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount});
const spend = output => ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output, control: 1});
const moonlight = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead');
const liquor = stock(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const littleLight = stock(`${GU_LEAD_SECOND_GU}.little_light`);
const whiteBoar = stock(`${GU_LEAD_SECOND_GU}.white_boar`);
const map = stock(`${id('early_duel')}.beast_skin_map`);
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const hunt = name => `${GU_LEAD_HUNT_FOLLOWTHROUGH}.${name}`;
const examBag = hunt('exam_bag');
const jadeSkin = local('jade_skin');
const jadeEyes = local('jade_eyes');
const stage = `${GU_LEAD_INHERITANCE}.aperture_stage`;
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_HUNT_FOLLOWTHROUGH)),
    eq(`completed.${hunt('plan_escape')}`), eq(`actor.${hunt('route')}`, 'avoid_mapped_boar_grounds'),
    eq(`actor.${hunt('exam_boars')}`, 23), eq(`actor.${hunt('cache')}`, 'buried_by_stream'));
const admitted = eq(extensionFact(GU_LEAD_EXAM_RESULT));
const reserve = value => eq(`energy.${essence}.reserve`, value);

function act(name, label, duration, previous, description, effects, {needs = [], atStart = [], costs = [], parts = 0, reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    const reserve = {fact: `energy.${essence}.reserve`, op: 'gte', value: parts};
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...atStart, ...(parts ? [reserve] : [])), reason: reason || 'Finish the previous step and stay near the academy.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: parts ? [...costs, spend(parts)] : costs, effects
    };
}

export const guLeadExamResult = {
    schema: 1, id: GU_LEAD_EXAM_RESULT, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan returns from the midyear hunt',
    description: 'Reach the exam hill with the bag you carried out of the forest. Then return to the passage under the mountain.',
    requires: all(ready, predecessor, eq(`actor.${stage}`, 'middle'), stock(examBag), moonlight, liquor, littleLight, whiteBoar, map),
    reason: 'Choose a way out of the woods and keep the exam bag, your map and your Gu.',
    items: [
        {id: jadeSkin, label: 'Jade Skin Gu', description: 'Spreads a thin layer of jade light over the skin. Feed it two pieces of jade rock every ten days.', value: 0},
        {id: jadeEyes, label: 'Jade eye pearl', description: 'A heavy stone monkey eye that the Jade Skin Gu can eat.', value: 0}
    ],
    status: [status('route', 'The long way back'), status('report', 'Talk at the exam hill'),
        status('result', 'The midyear result'), status('reward', 'The clan head’s gift'), status('news', 'Jiang He’s news'),
        status('stage', 'Your aperture'), status('practice', 'White Boar practice'), status('boulder', 'The slope'),
        status('room', 'Beyond the boulder'), status('pillars', 'The stone forest'), status('feeding', 'Jade Skin Gu'),
        status('trail', 'The autumn hunt')],
    commands: [
        act('circle_cross', 'Circle the red cross downwind', 60, predecessor,
            'Skirt the boar king’s ground instead of taking a trail an ambusher would expect. Leave the stream cache behind.',
            [set('route', 'exam_hill'), note('route', 'Keeping downwind, you circle the mudpit. The boar king stays put. Mud cakes your feet by the time you reach the exam hill.')],
            {needs: [map, stock(examBag)]}),
        act('listen_at_hill', 'Listen to the students at the tent', 4, done('circle_cross'),
            'Keep hold of your bag. Find out why most of the elders have left before the results are called.',
            [note('report', 'The students say Fang Zheng was carried away after an attack. You wonder whether the man from the treehouse mistook him for you. You have no word of what happened to the attacker.')]),
        act('hand_over_bag', 'Pour out the teeth before the elder', 5, done('listen_at_hill'),
            'The exam ended an hour ago. Hand over the bag and tell the elder you found a hunter’s stash. Chi Cheng calls for four teeth to be taken off your result.',
            [set('result', 'first'), set('exam_bag_custody', 'academy'), set('buried_bag_custody', 'unreconciled'),
                note('result', 'The teeth fall in a pile. The elder asks where you got them, then awards you first place. He gives no final count.')],
            {costs: [item(examBag, -1)], reason: 'Bring the bag you carried from the woods.'}),
        act('take_gift', 'Accept the clan head’s thirty stones', 5, done('hand_over_bag'),
            'Hear the message passed on by the academy elder and take the stones sent in the clan head’s name.',
            [item(stone, 30), note('reward', 'The academy elder passes on thirty primeval stones from Gu Yue Bo. He tells you to keep at your practice.')],
            {needs: [field('result', 'first')]}),
        act('hear_jiang_he', 'Meet Jiang He after three days', 3 * day, done('take_gift'),
            'Give the village guard time to learn what happened. Listen to what he can tell you himself.',
            [set('shop_offer', 'jiang_ya_half_price'), note('news', 'Jiang He recognized the dead attacker as Wang Da. He says two of the hunters vanished and the third is dead. He offers you half price at Jiang Ya’s shop. The academy elder has been warmer toward you since the exam.')]),
        act('reach_upper', 'Keep cultivating until the aperture wall changes', 11 * day, done('hear_jiang_he'),
            'Spend a primeval stone over the course of your practice. Keep using the Liquor Worm as you work through upper-stage practice.',
            [set('aperture_stage', 'upper'), set('reserve_grade', 'peak'), recover(44),
                note('stage', 'Your aperture reaches upper stage around the same time as Chi Cheng’s. The Liquor Worm can refine the dark-green essence further. Your own aperture is still a stage below that black-green essence.')],
            {needs: [eq(`actor.${stage}`, 'middle'), liquor], costs: [item(stone, -1)],
                reason: 'Keep the Liquor Worm and a stone for the cultivation sessions.'}),
        act('train_for_slope', 'Feed the White Boar Gu and practice on the slope', 29 * day, done('reach_upper'),
            'Hunt to feed the Gu and work the boulder uphill in short attempts. Walk it back down whenever your legs give out.',
            [{type: 'xp', actor: 'player', skill: 'Weightlifting', amount: 180}, set('practice', 'one_boar_strength'),
                note('practice', 'For the last three days the White Boar Gu has given you no more strength. You can now push the boulder. Forty-five steps up the slope was as far as you could manage last week.')],
            {needs: [whiteBoar, map]}),
        act('clear_slope', 'Push past your forty-five-step mark', 15, done('train_for_slope'),
            'Brace the rock on the slope when you need to breathe. Keep enough strength to guide it back down if you have to retreat.',
            [set('boulder', 'resting_on_level_ground'),
                note('boulder', 'At the fiftieth step the pressure lifts. The boulder has rolled onto level stone. You push it clear and find another room.')],
            {needs: [field('practice', 'one_boar_strength')]}),
        act('dig_in_room', 'Dig where the soil is damp', 7, done('clear_slope'),
            'Open the flower beneath the damp patch and pass primeval essence into what you find inside.',
            [item(jadeSkin, 1), note('room', 'The flower holds a Jade Skin Gu. It takes your essence at once. You keep it in your aperture while you look for a way to feed it.')],
            {needs: [field('boulder', 'resting_on_level_ground')], parts: 1}),
        act('test_pillars', 'Open the stone door and draw one monkey out', 12, done('dig_in_room'),
            'Stay at the door. Send a moonblade into a hole, then keep firing until the monkey stops moving.',
            [item(jadeEyes, 2), set('pillars', 'colony_at_threshold'),
                note('pillars', 'The fourth moonblade brings the monkey down. Its body breaks into chips and leaves two heavy green eyes. More eyes open when you walk toward the pillar. They fade when you step back.')],
            {needs: [moonlight, stock(jadeSkin), field('practice', 'one_boar_strength')], parts: 5}),
        act('feed_jade', 'Feed the Jade Skin Gu the two eyes', 5, done('test_pillars'),
            'Try the two jade pearls as food before you go back to the pillars.',
            [set('feeding', 'jade_eyes_accepted'), note('feeding', 'The Jade Skin Gu takes both pearls. You can feed it from the forest if you can keep drawing the monkeys out one at a time.')],
            {needs: [stock(jadeSkin)], costs: [item(jadeEyes, -2)],
                reason: 'Bring the Jade Skin Gu and both eyes from the first stone monkey.'}),
        act('search_rim', 'Make short trips around the stone forest’s rim', 17 * day, done('feed_jade'),
            'Hunt for jade eyes, feed the Gu and check the walls a little at a time. Back off when more than one pillar stirs. Make time to cultivate between trips.',
            [recover(44), set('search', 'rim_checked'), note('pillars', 'You find no clue along the walls. Several times the monkeys drive you back and you need the Jade Skin Gu to get out. The next clue may be somewhere among the pillars.')],
            {needs: [liquor, moonlight, stock(jadeSkin), field('feeding', 'jade_eyes_accepted')]}),
        act('hunt_with_jade', 'Brace your shoulder and fist with jade light', 18, done('search_rim'),
            'Spend eight black-green parts on brief protection at each impact. Feed the boar to the White Boar Gu when it falls.',
            [set('trail', 'old_wolf_retreats'), note('trail', 'You bring down the boar with your shoulder and fist. The White Boar Gu eats while an old wolf watches from the brush. It backs away. You let it go.')],
            {atStart: [reserve(44)], needs: [whiteBoar, stock(jadeSkin), field('reserve_grade', 'peak'), field('practice', 'one_boar_strength')],
                parts: 8, reason: 'Start with your sea full and bring both the Jade Skin and White Boar Gu.'}),
        act('listen_in_brush', 'Hold still and listen past the brush', 1, done('hunt_with_jade'),
            'The wolf has gone. Listen before you make another move.',
            [set('trail', 'footsteps_approach'), note('trail', 'The wolf cries out once. Then twigs snap under slow steps coming toward you.')])
    ]
};

let installed;
export async function registerGuLeadExamResult(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_HUNT_FOLLOWTHROUGH && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadExamResult, base);
    return installed;
}

const longJobs = guLeadExamResult.commands.filter(command => command.duration >= 120).map(command => command.id);
export function guLeadExamResultClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_EXAM_RESULT);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
