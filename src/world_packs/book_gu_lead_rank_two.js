// Qing Mao, volume one chapters 87–92.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_YEAR_END} from './book_gu_lead_year_end.js';
import {GU_LEAD_EXAM_RESULT} from './book_gu_lead_exam_result.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_RANK_TWO = id('rank_two');
const local = name => `${GU_LEAD_RANK_TWO}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:03abcbafbfe8515b699e6e24f52f05a14a54113450a68115e4f67834065cd18a';
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
const whiteBoar = `${GU_LEAD_SECOND_GU}.white_boar`;
const jadeSkin = `${GU_LEAD_EXAM_RESULT}.jade_skin`;
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const prior = name => `${GU_LEAD_YEAR_END}.${name}`;
const priorFact = (name, value) => eq(`actor.${prior(name)}`, value);
const predecessor = all(eq(extensionFact(GU_LEAD_YEAR_END)), eq(`completed.${prior('hear_group_offer')}`),
    priorFact('aperture_stage', 'peak'), priorFact('reserve_grade', 'peak'), priorFact('result', 'first'),
    priorFact('hands', 'healed_still_weak'), priorFact('group_offer', 'open'), priorFact('gu_priority', 'offered'),
    priorFact('cave_custody', 'white_boar_and_jade_skin'));
const caveGuAbsent = all(eq(`item.${key(whiteBoar)}`, 0), eq(`item.${key(jadeSkin)}`, 0));
const admitted = eq(extensionFact(GU_LEAD_RANK_TWO));

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

export const guLeadRankTwo = {
    schema: 1, id: GU_LEAD_RANK_TWO, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan joins a group and reaches Rank Two',
    description: 'Answer the elders after the final match. Take a clan assignment and find somewhere you can cultivate without being interrupted.',
    requires: all(ready, predecessor, moonlight, liquor),
    reason: 'Finish the final examination and hear the clan head’s offer first.',
    status: [status('group', 'Your group'), status('mission', 'Your clan work'),
        status('claim', 'The family estate'), status('lodging', 'Where you sleep'),
        status('pressure', 'Your aperture'), status('return', 'The way back')],
    commands: [
        act('join_jiao_san', 'Accept Jiao San’s place in his group', 4, predecessor,
            'Leave the elders without choosing a side. Accept Jiao San when he asks you to join.',
            [set('group', 'jiao_san'), note('group', 'You leave without naming an elder’s group. Jiao San finds you and offers you a place. You take it.')], {needs: [caveGuAbsent]}),
        act('report_for_work', 'Run with the group to the frozen ground', 3 * day, done('join_jiao_san'),
            'Report three days after joining. Keep up with the group through the snow and find the ground Jiao San wants dug.',
            [set('mission', 'frozen_soil_active'), note('mission', 'You follow Jiao San out through the snow. The group has been sent to bring back decayed soil from under the frozen ground.')],
            {needs: [field('group', 'jiao_san')]}),
        act('bring_back_soil', 'Dig out the soil and take your share', 80, done('report_for_work'),
            'Work through the frozen layer and finish the assignment. Jiao San splits the six stones when you get back.',
            [set('first_mission', 'settled'), set('mission', 'none'), item(stone, 1),
                note('mission', 'The soil is delivered. Jiao San keeps two of the six stones. You get one.')],
            {needs: [field('mission', 'frozen_soil_active')]}),
        act('leave_lunch', 'Leave the group’s lunch', 15, done('bring_back_soil'),
            'Leave when the talk turns to your lodging. Take what you learned about the clan’s work rules with you.',
            [set('queue_rule', 'one_active_mission'), note('group', 'You walk out of lunch. You owe the clan a mission each month and can hold one at a time. A Rank One Gu Master cannot drop one. At Rank Two, you can drop one a year at a cost to your evaluation.')],
            {needs: [field('first_mission', 'settled')]}),
        act('check_the_queue', 'Check whether you can request the family estate', 12, done('leave_lunch'),
            'You turn sixteen after the New Year. Find out what work you still need to do to file for the estate.',
            [set('mission', 'leader_assignment_active'), set('claim', 'blocked_by_active_mission'),
                note('mission', 'Jiao San has taken another assignment for the group. It is still open under your name.'),
                note('claim', 'To claim the estate at sixteen, you need to complete the inheritance mission. You cannot request that mission while Jiao San’s assignment is on the roll.')],
            {needs: [field('mission', 'none'), field('queue_rule', 'one_active_mission')]}),
        act('rent_bamboo_room', 'Take the small bamboo room', 30, done('check_the_queue'),
            'Rent the cheap room you know about. The landlord charges by the day.',
            [set('lodging', 'bamboo_room'), set('rent', 'due'),
                note('lodging', 'You take a bamboo room on a daily rate. It gives you somewhere to close the door without owing your group a favor.')],
            {needs: [field('claim', 'blocked_by_active_mission')]}),
        act('rush_the_wall', 'Try to crack the white crystal wall', 30, done('rent_bamboo_room'),
            'Drive your black-green essence into the aperture wall. You can use up your reserve before the wall gives.',
            [set('attempt', 'cracks_closed'), note('pressure', 'Hairline cracks open. Your sea falls too low to keep pressing, and the cracks knit shut. You are still at Rank One peak stage.')],
            {needs: [field('lodging', 'bamboo_room')], parts: 38,
                reason: 'You need thirty-eight black-green parts for this attempt.'}),
        act('leave_decoy', 'Put up a cultivation notice and slip out', 120, done('rush_the_wall'),
            'Spend one stone on furnishings and fuel. Put up a notice about cultivating in seclusion, then go to Jiang He’s hamlet.',
            [set('lodging', 'jiang_he_hamlet'), set('room_notice', 'cultivation'),
                note('lodging', 'The notice stays on the bamboo room. Jiang He gives you a place to sit undisturbed in his hamlet.')],
            {needs: [field('lodging', 'bamboo_room'), field('attempt', 'cracks_closed')], costs: [item(stone, -1)]}),
        act('fill_the_sea', 'Replenish the sea before the next attempt', 120, done('leave_decoy'),
            'Get your sea back to forty-four parts before you start. You will need stones at hand to keep pressing once cracks open.',
            [recover(44), set('attempt', 'prepared'), note('pressure', 'The sea is full again. Once a crack opens, do not let the pressure lapse for a quarter hour.')],
            {needs: [field('lodging', 'jiang_he_hamlet')]}),
        act('break_through', 'Keep the cracks open through three nights', 3 * day, done('fill_the_sea'),
            'Set aside six stones to replenish your sea while you work. Keep pressing the white crystal wall; a lapse of more than a quarter hour lets it close.',
            [set('attempt', 'wall_broken'), set('aperture_stage', 'rank_two_initial'),
                set('reserve_grade', 'rank_two_mixed'), set('withdrawal', 'one_per_year_with_penalty'), note('pressure', 'On the fourth day the white crystal wall gives way. You reach Rank Two initial stage. About twenty parts remain, with new pale red steel essence mixing into the old black-green sea.')],
            {needs: [field('lodging', 'jiang_he_hamlet'), field('attempt', 'prepared')],
                atStart: [eq(`energy.${essence}.reserve`, 44)], parts: 24, costs: [item(stone, -6)],
                reason: 'Start with a full sea and six stones set aside. If you stop, the cracks close and you can begin again.'}),
        act('rest_and_set_out', 'Sleep, eat, and set out for the clan', 18 * 60, done('break_through'),
            'Set aside one stone for the bamboo room. Sleep at Jiang He’s place until the next afternoon, eat, then start back toward the clan.',
            [set('rent', 'paid'), set('lodging', 'returning_to_clan'), set('return', 'toward_clan'),
                note('return', 'You wake the next afternoon, eat, and leave the hamlet. You can now ask to drop a mission at Rank Two. Jiao San’s assignment is still open, and the family estate has not changed hands.')],
            {needs: [field('aperture_stage', 'rank_two_initial'), field('mission', 'leader_assignment_active'),
                field('claim', 'blocked_by_active_mission'), field('withdrawal', 'one_per_year_with_penalty')], costs: [item(stone, -1)],
                reason: 'Set aside one stone for the bamboo room rent before heading back.'})
    ]
};

let installed;
export async function registerGuLeadRankTwo(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_YEAR_END && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadRankTwo, base);
    return installed;
}

const longJobs = guLeadRankTwo.commands.filter(command => command.duration >= 120).map(command => command.id);
export function guLeadRankTwoClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_RANK_TWO);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
