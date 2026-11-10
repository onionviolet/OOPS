// Qing Mao foothills, volume one chapters 65–70. The earned school save is the entry.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_INHERITANCE} from './book_gu_lead_inheritance.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_EARLY_DUEL = id('early_duel');
const local = name => `${GU_LEAD_EARLY_DUEL}.${name}`;
const key = id => JSON.stringify({id});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:76d123bed9f40315bc0bbee95fb0707373b9bc7035d8227dace6d57b13a87730';
const world = id('world');
const academy = id('academy');
const essence = id('primeval');
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const stock = (id, value = 1) => eq(`item.${key(id)}`, value);
const has = (name, value) => stock(local(name), value);
const item = (name, amount) => ({type: 'item', actor: 'player', key: key(local(name)), amount});
const recover = amount => ({type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount});
const spend = output => ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output, control: 1});
const reserve = value => ({fact: `energy.${essence}.reserve`, op: 'gte', value});
const moonlight = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead');
const liquor = stock(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const littleLight = stock(`${GU_LEAD_SECOND_GU}.little_light`);
const whiteBoar = stock(`${GU_LEAD_SECOND_GU}.white_boar`);
const middle = eq(`actor.${GU_LEAD_INHERITANCE}.aperture_stage`, 'middle');
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy), middle);
const predecessor = all(eq(extensionFact(GU_LEAD_SECOND_GU)), eq(`completed.${GU_LEAD_SECOND_GU}.plan_provisions`),
    eq(`actor.${GU_LEAD_SECOND_GU}.provision_plan`, 'scout_for_pork'));
const admitted = eq(extensionFact(GU_LEAD_EARLY_DUEL));
const part = (value, ...needs) => ({amount: value, needs: [moonlight, liquor, ...needs],
    reason: `Bring your Moonlight Gu, Liquor Worm and ${value} parts of prepared essence.`});

function act(name, label, duration, previous, description, effects, {needs = [], amount = 0, reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...(amount ? [reserve(amount)] : [])), reason: reason || 'Finish the previous step and stay near the academy.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: amount ? [spend(amount)] : [], effects
    };
}

export const guLeadEarlyDuel = {
    schema: 1, id: GU_LEAD_EARLY_DUEL, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan hunts for pork',
    description: 'Follow boar signs down to the foothills. The hunters know where the traps are.',
    requires: all(ready, predecessor, moonlight, liquor, littleLight, whiteBoar),
    reason: 'Finish the academy selection and make a plan to feed your White Boar Gu.',
    items: [
        {id: local('beast_skin_map'), label: 'Beast-skin map', description: 'The Wang family’s map of terrain, pitfalls and beast ranges.', value: 0},
        {id: local('fresh_pork'), label: 'Fresh boar meat', description: 'Enough to feed the White Boar Gu.', value: 0}
    ],
    status: [status('trail', 'The foothill trail'), status('fight', 'At the pit'), status('house', 'The Wang household'),
        status('map', 'The hunters’ map'), status('ward', 'The village guard'), status('hunt', 'The night hunt'),
        status('feed', 'Feeding the White Boar Gu'), status('body', 'Working the White Boar Gu')],
    commands: [
        act('scout', 'Scout the clan’s hunting grounds', 120, predecessor,
            'Stay within the ground the clan patrols. Take the Liquor Worm and prepare essence while you look for fresh signs.',
            [recover(44), set('reserve_grade', 'upper'), note('trail', 'There is little sign near the village. Without a scouting Gu, you could spend the whole break here. Go down toward the river settlements.')],
            {needs: [liquor, whiteBoar]}),
        act('track', 'Follow the boar sign past the hive', 45, done('scout'),
            'Go down to the river settlement. Follow the boar tracks past the deer and give the hive a wide berth.',
            [set('trail', 'pit_found'), note('trail', 'You find a boar still moving in a pit. A sharpened length of bamboo has gone through it. There could be other traps nearby.')]),
        act('finish_trapped_boar', 'Put a moonblade into the pit', 1, done('track'),
            'Spend four prepared parts to finish the trapped boar before climbing down.',
            [set('trapped_boar', 'dead'), note('fight', 'The boar goes still. Four hunters come out of the trees. The others call the man with the bow Wang Er. He tells you to get away from his pit.')],
            part(4, field('trail', 'pit_found'))),
        act('close_gap', 'Fire and close the gap', 1, done('finish_trapped_boar'),
            'Spend four prepared parts to make the hunters scatter. Run before Wang Er can use the full reach of his bow.',
            [set('fight', 'closing'), note('fight', 'The blade catches one hunter in the arm. Two drop to their knees. Wang Er sets an arrow to his bow and tells you to stop.')], part(4)),
        act('duck_arrow', 'Throw again and duck his arrow', 1, done('close_gap'),
            'Spend four prepared parts. Duck when Wang Er shoots and keep moving toward him.',
            [set('fight', 'bow_dropped'), note('fight', 'Wang Er steps aside. His arrow misses as you duck. He throws the bow down and comes at you with his fists.')], part(4)),
        act('use_sun', 'Turn him into the sun', 1, done('duck_arrow'),
            'Spend four prepared parts on the last blade. Move around his fist and use the glare to hide your throw.',
            [set('fight', 'wang_er_dead'), note('fight', 'You land hard on your shoulder. Wang Er does not get up. Two hunters are still kneeling. You have them bring his body to his father.')],
            part(4, field('fight', 'bow_dropped'))),
        act('demand_map', 'Take Wang Er to his father and ask for a map', 35, done('use_sun'),
            'Have the two hunters carry the body. Ask Old Wang to mark the traps and beast ranges. Have the hunters fetch his brush and paper.',
            [set('map', 'sketch'), note('house', 'Old Wang stops his daughter from rushing at you and tells the hunters exactly where the brush is. He draws the map on bamboo paper. You offer the hunters a stone for each mistake they find.')]),
        act('check_sketch', 'Have the hunters check the sheets', 15, done('demand_map'),
            'Let both hunters compare the sheets with the places they know. Pay them for a mistake if they find one.',
            [set('map', 'locally_checked'), note('house', 'The hunters say the traps they know are marked. Neither names a mistake. You keep your stones. They cannot vouch for ground they have never hunted.')],
            {needs: [field('map', 'sketch')]}),
        act('press_for_original', 'Use two moonblades and order a search', 5, done('check_sketch'),
            'Spend eight prepared parts on Old Wang and his daughter. Send the two remaining hunters inside for the family’s old map.',
            [set('house', 'wang_household_dead'), note('house', 'Old Wang and his daughter fall. The hunters turn over the rooms and come back empty-handed. You go inside yourself.')],
            part(8, field('map', 'locally_checked'))),
        act('search_hearth', 'Search the cold hearth', 5, done('press_for_original'),
            'Look where the hunters did not. Turn the charcoal with the shovel and check anything too heavy to be wood.',
            [set('map', 'original'), item('beast_skin_map', 1),
                note('map', 'A bamboo tube falls out of the lump. Its beast-skin map shows five boar grounds. A red cross marks the largest herd, though nothing on the paper sketch warned you about it.')],
            {needs: [has('beast_skin_map', 0)]}),
        act('answer_guard', 'Show the crescent and give Jiang He your name', 8, done('search_hearth'),
            'Ask who else lived in the house, then tell the witnesses they can go. When the clan guard steps down from the trees, show him your crescent and tell him what happened.',
            [set('ward', 'leave_after_warning'),
                note('ward', 'The hunters tell you Wang Da disappeared three years ago. Jiang He asks what he should tell the clan. You give your name and tell him to write what happened. He recognizes you from Jiang Ya’s shop and says he’ll see to it. He tells you to stay out of his district.')],
            {needs: [has('beast_skin_map'), moonlight]}),
        act('find_boar', 'Use the map to choose a night trail', 120, done('answer_guard'),
            'Prepare your essence with the Liquor Worm. Read the inherited map to skirt the pits and the marked herd. Close on a lone boar.',
            [recover(23), set('hunt', 'boar_alert'),
                note('hunt', 'You find a boar rooting under the moon. It catches your scent and turns to face you. There is a thin tree behind you and room to step sideways.')],
            {needs: [has('beast_skin_map'), field('map', 'original'), liquor, field('ward', 'leave_after_warning')]}),
        act('wear_down', 'Cut the boar and roll off its line', 3, done('find_boar'),
            'Spend fifteen prepared parts over several passes. Cut it as it charges and roll sideways before the tusks reach you.',
            [set('hunt', 'boar_weakened'),
                note('hunt', 'The boar splits a tree on its first charge. Its wounds open each time it runs past you. After several passes it slows, but your ordinary moonblades have not cut through its bones.')],
            part(15, field('hunt', 'boar_alert'))),
        act('pair_gu', 'Pair the star with the crescent', 1, done('wear_down'),
            'Spend five prepared parts to feed both Gu. Aim the wider blade at the weakened boar’s neck.',
            [set('hunt', 'boar_killed'), item('fresh_pork', 1),
                note('hunt', 'The star’s light joins the crescent. The blade reaches twice as far and cuts through the boar’s neck. Keep watch. The smell could draw other beasts.')],
            {amount: 5, needs: [moonlight, liquor, littleLight, field('hunt', 'boar_weakened'), has('fresh_pork', 0)],
                reason: 'Bring both refined Gu, five prepared parts and a boar weakened by the earlier cuts.'}),
        act('feed_boar_gu', 'Feed the White Boar Gu and take the tusks', 12, done('pair_gu'),
            'Let the White Boar Gu eat the fresh meat while you stand watch. Take the tusks and put them in the rock crack before returning to your room.',
            [item('fresh_pork', -1), set('tusks', 'rock_crack'), set('feed', 'fed'),
                note('feed', 'The Gu returns clean. The meat is gone and the hide is cut to ribbons. You leave both tusks in the crack. The Gu will need another meal in five days.')],
            {needs: [whiteBoar, has('fresh_pork'), field('hunt', 'boar_killed')]}),
        act('cultivate_strength', 'Work the White Boar Gu until the tingling turns', 15, done('feed_boar_gu'),
            'Spend one prepared part on the fed Gu. Sit in your room and stop as soon as the tingling turns to pain.',
            [{type: 'xp', actor: 'player', skill: 'Weightlifting', amount: 60}, set('body', 'first_strength_session'),
                note('body', 'White light soaks into your muscles. The prickling turns sharp and you cut off the essence. A little strength stays in your body. You are still Rank One, middle stage.')],
            {amount: 1, needs: [whiteBoar, field('feed', 'fed'), field('tusks', 'rock_crack')],
                reason: 'Feed your White Boar Gu and keep one prepared part for practice.'})
    ]
};

let installed;
export async function registerGuLeadEarlyDuel(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_SECOND_GU && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadEarlyDuel, base);
    return installed;
}

const longJobs = ['scout', 'find_boar'].map(local);
export function guLeadEarlyDuelClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_EARLY_DUEL);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
