// The academy's public selection and the separate return to the image wall.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_HEARING} from './book_gu_lead_hearing.js';
import {GU_LEAD_INHERITANCE} from './book_gu_lead_inheritance.js';
import {GU_LEAD_MOONVEIL} from './book_gu_lead_moonveil.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_SECOND_GU = id('second_gu');
const local = name => `${GU_LEAD_SECOND_GU}.${name}`;
const itemKey = name => JSON.stringify({id: local(name)});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:40fdf56f81f1d7d908c963be52c18cfea3d5449898fe112e9d93adb1a08fc1a1';
const world = id('world');
const academy = id('academy');
const essence = id('primeval');
const day = 24 * 60;
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const give = (name, amount) => ({type: 'item', actor: 'player', key: itemKey(name), amount});
const has = (name, count = 1) => eq(`item.${itemKey(name)}`, count);
const recover = amount => ({type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount});
const spend = output => ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output, control: 1});
const reserve = amount => ({fact: `energy.${essence}.reserve`, op: 'gte', value: amount});
const moonlight = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead');
const bond = eq(`actor.${GU_LEAD_VITAL}.vital_bond`, 'spring_autumn_cicada');
const priority = eq(`actor.${GU_LEAD_MOONVEIL}.second_gu_priority`);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_HEARING)), eq(`completed.${GU_LEAD_HEARING}.leave_hall`),
    eq(`actor.${GU_LEAD_HEARING}.hearing_state`, 'dismissed'), eq(`actor.${GU_LEAD_HEARING}.inquiry`, 'unresolved'));
const admitted = eq(extensionFact(GU_LEAD_SECOND_GU));

function act(name, label, duration, previous, description, effects, {needs = [], funds = [], costs = [], reason, ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...funds), reason: reason || 'Finish the previous step and stay near the academy.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs, effects, ...extra
    };
}

export const guLeadSecondGu = {
    schema: 1, id: GU_LEAD_SECOND_GU, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan after the hearing',
    description: 'Watch Jia Fu leave. Return to the old wall when the village stops watching, and use your place at the head of the academy queue.',
    requires: all(ready, predecessor, priority, moonlight),
    reason: 'Leave the clan hearing with your first choice of Gu still due.',
    items: [
        {id: local('little_light_unrefined'), label: 'Little Light Gu · unrefined', description: 'The small star-shaped Gu you chose at the academy.', value: 0},
        {id: local('little_light'), label: 'Little Light Gu', description: 'Pairs with the Moonlight Gu to strengthen a moonblade.', value: 0},
        {id: local('sleeping_gu'), label: 'White Boar Gu · unrefined', description: 'The Gu you took from the petals at the end of the passage.', value: 0},
        {id: local('white_boar'), label: 'White Boar Gu', description: 'Builds the body’s strength over time. It needs pork.', value: 0}
    ],
    status: [status('departure', 'The mountain road'), status('wall', 'The image wall'), status('passage', 'The passage'),
        status('selection', 'The academy Gu room'), status('discovery', 'At the boulder'), status('provisions', 'Feeding your Gu')],
    commands: [
        act('watch_road', 'Watch Jia Fu from the hillside', 15, predecessor,
            'Watch the road until the trees hide the Treasure Brass Toad. Give the village time to lose interest before you go back to the wall.',
            [note('departure', 'The toad carries Jia Fu out of sight. He can still call for an investigator. For now, you head back to the village.')]),
        act('return_to_wall', 'Keep to the village until the inquiries ease', 10 * day, done('watch_road'),
            'Spend ten days keeping to familiar paths. Then go back to the rock crack after dark and let fourteen ordinary parts of essence collect. Leave your stronger essence and stones alone.',
            [recover(14), note('wall', 'Ten days pass. The elder’s inquiries have gone quiet. You slip into the crack after dark, where the writing has faded into bare stone.')],
            {needs: [eq(`completed.${GU_LEAD_INHERITANCE}.clear_crevice`)], durationSinceKnowledge: local('departure')}),
        act('shave_wall', 'Shave the image wall with moonlight', 5 * day + 15, done('return_to_wall'),
            'Work across six nights rather than hammering rock where someone might hear. Let ordinary essence return between visits. Set aside twelve ordinary parts for the final cut. You keep the time already spent if you stop.',
            [set('wall', 'pierced'), note('wall', 'Red powder piles up below the wall. On the sixth night a hole opens under your palm. Stale air comes through, and you step outside to let it clear.')],
            {needs: [moonlight], funds: [reserve(12)], costs: [spend(12)], durationSinceKnowledge: local('wall'),
                reason: 'Bring your refined Moonlight Gu and twelve ordinary parts of essence.'}),
        act('test_opening', 'Widen the opening and roll a stone through', 30, done('shave_wall'),
            'Let the air clear, then widen the hole by hand. Roll a loose stone through and dust the entrances before you leave for the night.',
            [set('passage', 'marked'), note('passage', 'The stone rolls out of sight. Nothing follows it. You leave a thin layer of red powder across the entrances so you can tell if something comes through.')],
            {needs: [field('wall', 'pierced')]}),
        act('sound_passage', 'Send a rabbit down the passage', 60, done('test_opening'),
            'Check the powder. Weave dead vines into a line and tie it to a rabbit with a bell. Let the rabbit run, then draw it back.',
            [set('passage', 'sounded'), note('passage', 'The powder is undisturbed. The bell recedes until the line stops running. You draw the rabbit back unharmed. You kill it and set it aside. It was too small to test everything in the passage.')]),
        act('reach_boulder', 'Follow the passage on foot', 120, done('sound_passage'),
            'Search the passage as you go. The rabbit was too small to test every place your feet will go.',
            [set('passage', 'blocked'), note('passage', 'You reach a smooth boulder that fills the passage. At the pace you shaved the wall, you could work here for a year. A pick would be faster, but someone might hear.')],
            {needs: [field('passage', 'sounded')]}),
        act('inspect_shelves', 'Take first place in the Gu room queue', 8, done('reach_boulder'),
            'Return to the academy at sunrise. Use the first choice you earned at middle stage to see the shelves before the rest of the class.',
            [set('selection', 'shelves_seen'),
                note('selection', 'The guard lets you in first. There are Skin Gu, several beetles and rows of common Boar Gu. There is no Jade Skin Gu. At the last wall you find five Little Light Gu that could strengthen a moonblade.')],
            {needs: [priority], reason: 'The elder must have granted you first choice for your breakthrough.'}),
        act('take_little_light', 'Choose a Little Light Gu', 4, done('inspect_shelves'),
            'Take one of the five Little Light Gu to pair with your Moonlight Gu. Your academy choice costs no stones. The other pupils are still waiting outside.',
            [set('selection', 'first_choice_used'), give('little_light_unrefined', 1),
                note('selection', 'You leave with a small, pale star in your hand. The guard admits the next pupil. Your place at the head of this queue has been used.')],
            {needs: [priority, field('selection', 'shelves_seen'), has('little_light_unrefined', 0), has('little_light', 0)]}),
        act('refine_little_light', 'Refine the Little Light Gu in your room', 20, done('take_little_light'),
            'Keep the door shut and let the Cicada quiet the star’s will. Spend one ordinary part of essence to refine the Gu you brought back.',
            [give('little_light_unrefined', -1), give('little_light', 1),
                note('selection', 'The star takes your essence and stays with you. While you wait for dark, you remember how smooth the boulder was. Go back and look around it before bringing tools.')],
            {needs: [bond, has('little_light_unrefined'), has('little_light', 0)], funds: [reserve(1)], costs: [spend(1)],
                reason: 'Bring your unrefined star, your bond and one ordinary part of essence.'}),
        act('check_boulder', 'Search the ground around the boulder', 40, done('refine_little_light'),
            'Go back without a pick. Feel along the ground where the red soil looks darker.',
            [set('discovery', 'flower_exposed'),
                note('discovery', 'The soil is damp and loose. You dig with your fingers until a gold bud shows through. You recognize an Earth Treasury Flower Gu.')],
            {needs: [has('little_light'), field('passage', 'blocked')]}),
        act('open_bud', 'Peel back the petals', 20, done('check_boulder'),
            'Open the bud by hand. Slow down when the petals thin so you can see what is inside before you spill the liquid.',
            [give('sleeping_gu', 1), set('discovery', 'flower_opened'),
                note('discovery', 'Gold liquid runs over your fingers. You lift a pale, round Gu from the collapsing petals. It is a White Boar Gu, still unrefined.')],
            {needs: [field('discovery', 'flower_exposed'), has('sleeping_gu', 0), has('white_boar', 0)]}),
        act('refine_find', 'Refine what you brought back', 20, done('open_bud'),
            'Keep your find to yourself. Spend one ordinary part of essence to refine it before you start looking for what it eats.',
            [give('sleeping_gu', -1), give('white_boar', 1), set('discovery', 'kept'),
                note('discovery', 'The pale Gu circles over your sea. It can build your strength a little at a time. The boulder is still where you left it.')],
            {needs: [has('sleeping_gu'), has('white_boar', 0), bond, field('discovery', 'flower_opened')],
                funds: [reserve(1)], costs: [spend(1)], reason: 'Bring the Gu from the petals and one ordinary part of essence.'}),
        act('plan_provisions', 'Ask about wine and reckon up the feed', 45, done('refine_find'),
            'At the inn, ask about ordering green bamboo wine for later. Leave the price unsettled while you work out what the new Gu will eat.',
            [set('provision_plan', 'scout_for_pork'),
                note('provisions', 'The server can ask about a new batch of wine. You leave the order unpaid. The pale Gu can eat a pig’s worth of pork in five days. You decide to look for wild boar before the academy break ends.')],
            {needs: [has('white_boar'), has('little_light'), field('discovery', 'kept')]})
    ]
};

let installed;
export async function registerGuLeadSecondGu(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_HEARING && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadSecondGu, base);
    return installed;
}

const longJobs = ['return_to_wall', 'shave_wall', 'sound_passage', 'reach_boulder'].map(local);
export function guLeadSecondGuClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_SECOND_GU);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
