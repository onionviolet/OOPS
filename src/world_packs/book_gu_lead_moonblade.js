// Volume one, chapters 21–22. The first-place prize, the class demonstration,
// and the first throw are separate events. No Gu is retrieved during the lesson.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_MOONBLADE = id('moonblade');
const moon = name => `${GU_LEAD_MOONBLADE}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const vitalHash = 'sha256:89c5e2f92e0baa4a354350c0d904962dc6b8e96911ac3e5770404767acb3b441';
const world = id('world');
const academy = id('academy');
const elder = id('academy_elder');
const essence = id('primeval');
const stone = JSON.stringify({id: `${GU_LEAD_REFINEMENT}.primeval_stone`});
const daysUntilLesson = 10 * 1440;
const throwCost = 10;
const prize = 20;

const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const done = name => eq(`completed.${moon(name)}`);
const fact = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: moon(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: moon(name), stage: 'understood', value});
const admitted = eq(extensionFact(GU_LEAD_MOONBLADE));
const supervised = {targetId: elder, coLocated: true, participants: ['$target']};
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`faculty.${id('aperture')}.active`, true, 'You need to be able to move your primeval essence.'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'));
const firstPlace = all(eq(extensionFact(GU_LEAD_VITAL)), eq(`completed.${GU_LEAD_VITAL}.show_elder`),
    eq(`actor.${GU_LEAD_VITAL}.assessment`, 'first'));
const hasCrescent = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead', 'Bring your refined Moonlight Gu to the lesson.');
const puppetReady = eq(`actor.${moon('left_puppet')}`, 'standing', 'Wait until the elder sets out the practice puppets.');
const canAffordThrow = {fact: `energy.${essence}.reserve`, op: 'gte', value: throwCost,
    reason: 'You need ten parts of essence to throw a Moonblade.'};

function act(name, label, duration, previous, description, effects, {needs = [], reserve = [], ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, eq('actor.location', academy), ...needs);
    return {
        id: moon(name), revision: 1, label, description, group: 'structured_local',
        worldId: world, actorId: 'player', location: academy, audience: ['$actor'], once: true,
        duration, visibleWhen, requires: all(support, ...reserve), completionRequires: support,
        completionCoLocated: true, cancellation: 'refund', completionFailure: 'refund',
        reservationReturns: 1, costs: [], effects, ...extra
    };
}

export const guLeadMoonblade = {
    schema: 1, id: GU_LEAD_MOONBLADE, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan’s first Moonblade lesson',
    description: 'Collect the academy’s refinement prize, then join the class at the practice field.',
    requires: all(ready, firstPlace, eq('actor.location', academy)),
    reason: 'Show the elder your refined Moonlight Gu and let him confirm first place.',
    status: [
        {id: moon('prize_status'), label: 'Refinement prize', knowledgeKey: moon('prize_received')},
        {id: moon('lesson_status'), label: 'Moonblade lesson', knowledgeKey: moon('demonstration')},
        {id: moon('throw_status'), label: 'Your first Moonblade throw', knowledgeKey: moon('first_throw')},
        {id: moon('homework_status'), label: 'Moonblade homework', knowledgeKey: moon('homework')}
    ],
    commands: [
        act('collect_prize', 'Collect the twenty-stone prize', 2, firstPlace,
            'Take the prize the elder promised to the first pupil to refine a Gu.',
            [{type: 'item', actor: 'player', key: stone, amount: prize},
                note('prize_received', 'The academy paid you twenty primeval stones for refining your Gu first.')],
            supervised),
        act('wait_for_lesson', 'Pass the days before the Moonblade lesson', daysUntilLesson, done('collect_prize'),
            'The Moonblade lesson is ten days after your first-place result. Keep your place in class and let your primeval sea refill over those days. Time already passed still counts if you stop.',
            [{type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount: 44}],
            {durationSinceKnowledge: `${GU_LEAD_VITAL}.academy_result`}),
        act('watch_elder', 'Watch the elder throw a Moonblade', 5, done('wait_for_lesson'),
            'Join the half circle in the academy’s bamboo-walled practice field. Watch where the elder moves the crescent and how he cuts the air with his hand.',
            [fact('left_puppet', 'standing'),
                note('demonstration', 'The elder moves the crescent to his palm, feeds it essence and cuts his hand forward. The blade takes the head off a grass puppet ten metres away. The elder sets out puppets for the pupils with refined Moonlight Gu.')],
            supervised),
        act('throw_left', 'Throw at the puppet to your left', 5, done('watch_elder'),
            'Spend ten parts of green-copper essence. Move the crescent to your palm and wait until other blades fill the field. Then aim left, so the cut does not point back to you.',
            [fact('left_puppet', 'regrown'),
                note('first_throw', 'Your Moonblade cuts deep into the puppet’s neck. The grass knits together again. The elder looks to the pupil in front of that puppet, and the pupil nods. You bring your Gu back to your brow.')],
            {needs: [hasCrescent, puppetReady], reserve: [canAffordThrow],
                costs: [{type: 'energy', actor: 'player', energyId: essence, operation: 'use', output: throwCost, control: 1}]}),
        act('hear_homework', 'Hear the elder set the homework', 1, done('throw_left'),
            'Listen as the elder calls across the practice field. He gives the whole class a date to show what they can do.',
            [note('homework', 'The elder will check the class’s Moonblade practice in three days. He promises ten primeval stones to the pupil who does best.')],
            supervised)
    ]
};

let installed;
export async function registerGuLeadMoonblade(register, base) {
    installed = null;
    if(!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_VITAL && e.revision === 1 && e.contentHash === vitalHash)) return null;
    installed = await register.extension(guLeadMoonblade, base);
    return installed;
}

export function guLeadMoonbladeClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if(!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_MOONBLADE);
    if(!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId === moon('wait_for_lesson'));
    if(!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= daysUntilLesson ? Math.min(120, remaining) : null;
}
