// Qing Mao, volume one chapters 71–75. Continue the earned first White Boar practice.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EARLY_DUEL} from './book_gu_lead_early_duel.js';
import {GU_LEAD_INHERITANCE} from './book_gu_lead_inheritance.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_HUNT_FOLLOWTHROUGH = id('hunt_followthrough');
const local = name => `${GU_LEAD_HUNT_FOLLOWTHROUGH}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:3fea6362163561848dea3459687d176c9103c78f12889cb8faede6e20871fa14';
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
const map = stock(`${GU_LEAD_EARLY_DUEL}.beast_skin_map`);
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy),
    eq(`actor.${GU_LEAD_INHERITANCE}.aperture_stage`, 'middle'));
const predecessor = all(eq(extensionFact(GU_LEAD_EARLY_DUEL)), eq(`completed.${GU_LEAD_EARLY_DUEL}.cultivate_strength`),
    eq(`actor.${GU_LEAD_EARLY_DUEL}.body`, 'first_strength_session'),
    eq(`actor.${GU_LEAD_EARLY_DUEL}.reserve_grade`, 'upper'));
const admitted = eq(extensionFact(GU_LEAD_HUNT_FOLLOWTHROUGH));

function act(name, label, duration, previous, description, effects, {needs = [], costs = [], parts = 0, reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    const reserve = {fact: `energy.${essence}.reserve`, op: 'gte', value: parts};
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...(parts ? [reserve] : [])), reason: reason || 'Finish the previous step and stay near the academy.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: parts ? [...costs, spend(parts)] : costs, effects
    };
}

export const guLeadHuntFollowthrough = {
    schema: 1, id: GU_LEAD_HUNT_FOLLOWTHROUGH, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan prepares for the midyear hunt',
    description: 'Build strength with the White Boar Gu and learn the hunters’ map before the academy puts you in the woods.',
    requires: all(ready, predecessor, moonlight, liquor, littleLight, whiteBoar, map),
    reason: 'Finish your first White Boar practice and keep the original hunters’ map.',
    items: [
        {id: local('exam_bag'), label: 'Exam bag of boar teeth', description: 'Teeth collected on the academy hunt. The academy has yet to count them.', value: 0}
    ],
    status: [status('body', 'White Boar practice'), status('passage', 'The boulder'), status('map', 'The hunters’ map'),
        status('class', 'The academy hunt'), status('standing', 'After the allowance'), status('cache', 'The earlier teeth'),
        status('hunt', 'The exam trail'), status('shelter', 'The nearest circle'), status('evidence', 'Inside the shelter'),
        status('route', 'Your way out')],
    commands: [
        act('train_and_feed', 'Hunt and train through the next five days', 5 * day, predecessor,
            'Use the map to keep the White Boar Gu fed. Work in short sessions and stop when the tingling turns to pain.',
            [{type: 'xp', actor: 'player', skill: 'Weightlifting', amount: 120}, set('body', 'can_lift_weakened_boar'),
                note('body', 'You keep watch on the riverbank and get under the wounded boar as it slows. You manage to lift it and throw it against a rock. The Gu eats the meat. You take the teeth back to the cave, where a pile has grown.')],
            {needs: [map, moonlight, liquor, whiteBoar], parts: 12,
                reason: 'Bring the map, the White Boar Gu and twelve prepared parts for the round of practice.'}),
        act('test_boulder', 'Try shifting the boulder again', 12, done('train_and_feed'),
            'Go to the end of the passage. Put both hands on the boulder and push.',
            [set('passage', 'still_blocked'), note('passage', 'The boulder does not move. You could lift a wounded boar on the riverbank. You reckon this rock weighs as much as five or six.')],
            {needs: [field('body', 'can_lift_weakened_boar')]}),
        act('study_map', 'Compare the hide map with the paper sketch', 60, done('test_boulder'),
            'Trace the day and night paths. Use the sketch to work out the signs, then learn the routes so you can leave the tube in the cave.',
            [set('map', 'cross_and_circles'), note('map', 'You read the red cross as a warning, likely the boar king’s ground. The sketch leaves it out. You still cannot explain the three red circles.')],
            {needs: [map]}),
        act('keep_low', 'Keep to the hunt instead of racing for upper stage', 7 * day, done('study_map'),
            'Keep practicing and sleep when you can. Let the academy reward go to the first pupil to reach upper stage.',
            [recover(34), set('class', 'exam_announced'), set('map', 'memorized'),
                note('class', 'Fang Zheng takes the thirty stones for reaching upper stage first. The elder calls the midyear hunt for three days from now. Groups are allowed. Each tooth turned in is worth ten stones.')],
            {needs: [whiteBoar, liquor, field('map', 'cross_and_circles')], costs: [item(stone, -1)],
                reason: 'Keep the White Boar Gu, the Liquor Worm and a primeval stone for cultivation.'}),
        act('spare_rivals', 'Let the three rivals keep their stones', 10, done('keep_low'),
            'Fight Fang Zheng, Chi Cheng and Mo Bei as before. This time let them leave with their stones.',
            [set('standing', 'rivals_released_unpaid'), note('standing', 'The three walk away with their stones, including Fang Zheng’s reward. The academy guard saw you let them go.')]),
        act('bury_cache', 'Move the earlier teeth to the stream cache', 3 * day - 10, done('spare_rivals'),
            'Learn the approaches before exam day. The night before the hunt, take the teeth from the cave, bag them and bury the bag by the stream.',
            [set('cache', 'buried_by_stream'), note('cache', 'The earlier teeth are in a buried bag. Keep it separate from whatever you take on the exam trail.')],
            {needs: [field('map', 'memorized')]}),
        act('hunt_at_noon', 'Use the known trails and hunt the first eight', 240, done('bury_cache'),
            'Use the remembered boar ranges to keep moving between kills. Pair the crescent and the star to make each opening count.',
            [set('exam_boars', 8), note('hunt', 'By afternoon you have taken eight boars. The others are spread through the woods. Stay on known ground while you still have essence to spare.')],
            {needs: [moonlight, liquor, littleLight, field('map', 'memorized')], parts: 17,
                reason: 'Bring the Moonlight Gu, Little Light Gu and seventeen prepared parts. Use the route you learned from the map.'}),
        act('hunt_at_sunset', 'Hunt on until sunset and bag the new teeth', 180, done('hunt_at_noon'),
            'Spend another twenty-four prepared parts on the paired blades. Cut out the teeth as you go and keep the older bag buried.',
            [set('exam_boars', 23), item(local('exam_bag'), 1),
                note('hunt', 'The twenty-third boar falls as the light fades. You have the exam teeth in your bag. The buried bag is still fifteen minutes away down the stream.')],
            {needs: [moonlight, liquor, littleLight, field('exam_boars', 8)], parts: 24,
                reason: 'Bring both blade Gu and twenty-four prepared parts after the first eight kills.'}),
        act('approach_circle', 'Leave the stream and check the nearest red circle', 7, done('hunt_at_sunset'),
            'Put off retrieving the buried bag. The nearest circle is a short walk deeper into the woods.',
            [set('shelter', 'treehouse_found'), note('shelter', 'A treehouse sits above the brush. From the trail you would have walked past it.')],
            {needs: [stock(local('exam_bag')), field('map', 'memorized')]}),
        act('inspect_shelter', 'Climb up and read the room', 4, done('approach_circle'),
            'Look for signs that someone has used the shelter recently.',
            [set('evidence', 'portrait_and_wet_clothes'),
                note('evidence', 'The clothes on the line are still damp. A dagger pins a portrait to the wall. It could be your face or Fang Zheng’s.')],
            {needs: [field('shelter', 'treehouse_found')]}),
        act('weigh_clues', 'Put the map and the hunters’ stories together', 3, done('inspect_shelter'),
            'Think back to the missing son and the marks that Old Wang kept off the sketch. Ask what the occupant would gain by watching the hunt.',
            [set('threat', 'suspect_surviving_gu_master'),
                note('evidence', 'You suspect Wang Da survived and uses the circles as shelters. If he is a Gu Master, he may be stronger than you and able to move unseen. The portrait and the damp clothes tell you to move.')],
            {needs: [field('evidence', 'portrait_and_wet_clothes')]}),
        act('plan_escape', 'Choose a route away from the known boar grounds', 2, done('weigh_clues'),
            'Use the remembered map in reverse. Pick a path an ambusher looking for you at the boar grounds would be least likely to watch.',
            [set('route', 'avoid_mapped_boar_grounds'),
                note('route', 'The next stretch runs away from the obvious hunting ground. You keep the exam bag and leave the buried one where it is.')],
            {needs: [field('threat', 'suspect_surviving_gu_master'), field('map', 'memorized'),
                field('cache', 'buried_by_stream'), stock(local('exam_bag'))]})
    ]
};

let installed;
export async function registerGuLeadHuntFollowthrough(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_EARLY_DUEL && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadHuntFollowthrough, base);
    return installed;
}

const longJobs = guLeadHuntFollowthrough.commands.filter(command => command.duration >= 120).map(command => command.id);
export function guLeadHuntFollowthroughClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_HUNT_FOLLOWTHROUGH);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
