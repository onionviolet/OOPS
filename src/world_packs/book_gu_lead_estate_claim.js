// Qing Mao, volume one chapters 93–98 (first scene).
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_YEAR_END} from './book_gu_lead_year_end.js';
import {GU_LEAD_RANK_TWO} from './book_gu_lead_rank_two.js';
import {GU_LEAD_EXAM_RESULT} from './book_gu_lead_exam_result.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_ESTATE_CLAIM = id('estate_claim');
const local = name => `${GU_LEAD_ESTATE_CLAIM}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:7696f60f9bb27caf34168577c24dcaf58a639a55f08ab1004a772a75a9438663';
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
const whiteBoar = `${GU_LEAD_SECOND_GU}.white_boar`;
const jadeSkin = `${GU_LEAD_EXAM_RESULT}.jade_skin`;
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const prior = name => `${GU_LEAD_RANK_TWO}.${name}`;
const priorFact = (name, value) => eq(`actor.${prior(name)}`, value);
const predecessor = all(eq(extensionFact(GU_LEAD_RANK_TWO)), eq(`completed.${prior('rest_and_set_out')}`),
    priorFact('aperture_stage', 'rank_two_initial'), priorFact('reserve_grade', 'rank_two_mixed'),
    priorFact('mission', 'leader_assignment_active'), priorFact('claim', 'blocked_by_active_mission'),
    priorFact('withdrawal', 'one_per_year_with_penalty'), priorFact('return', 'toward_clan'),
    eq(`actor.${GU_LEAD_YEAR_END}.cave_custody`, 'white_boar_and_jade_skin'));
const caveGuAbsent = all(eq(`item.${key(whiteBoar)}`, 0), eq(`item.${key(jadeSkin)}`, 0));
const admitted = eq(extensionFact(GU_LEAD_ESTATE_CLAIM));

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

export const guLeadEstateClaim = {
    schema: 1, id: GU_LEAD_ESTATE_CLAIM, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan returns to the clan',
    description: 'Head back from the hamlet. Find your group, then see what the clan will ask of you for the family estate.',
    requires: all(ready, predecessor, moonlight),
    reason: 'Reach Rank Two and set out from Jiang He’s hamlet first.',
    status: [status('custody', 'Gu brought back'), status('tide', 'The winter beast tide'),
        status('roll', 'After the beast tide'), status('claim', 'The estate application'),
        status('plan', 'Preparing for the bees')],
    commands: [
        act('take_back_gu', 'Collect the two Gu you left behind', 30, predecessor,
            'Make a private stop for the White Boar and Jade Skin Gu. You may need both before the night is over.',
            [item(whiteBoar, 1), item(jadeSkin, 1), set('custody', 'carried'),
                note('custody', 'The White Boar and Jade Skin Gu are back in your keeping.')], {needs: [caveGuAbsent]}),
        act('follow_chi_shan', 'Follow Chi Shan down the mountain', 42, done('take_back_gu'),
            'Chi Cheng tells you the clan has called out its groups against a beast tide. Keep in the middle of Chi Shan’s group until you find yours.',
            [set('tide', 'found_group'),
                note('tide', 'The scout leads you past deer and turtleback apes. The group nets and kills a tiger without breaking stride. Ahead, Jiao San’s python is wrapped around a wild boar king.')]),
        act('let_go', 'Brace against the tusks, then let go', 2, done('follow_chi_shan'),
            'Jiao San needs time to heal his python. Hold the boar’s head while your teammate moves in. Spend two parts to harden your skin before you let the tusks swing.',
            [set('tide', 'tusks_swung'), note('tide', 'The tusks fling you into the trees and strike the Gu Master beside you. She does not get up. Your back hurts, but your Jade Skin Gu kept you whole.')],
            {needs: [field('tide', 'found_group'), stock(jadeSkin)], parts: 2,
                reason: 'Bring Jade Skin Gu and two parts of essence to brace for the fall.'}),
        act('cut_the_net', 'Send moonblades into the knife-scale net', 5, done('let_go'),
            'Kong Jing throws a bladed net over the boar. Spend three parts to cut its threads while the boar is still fighting.',
            [set('tide', 'wolves_closing'), note('tide', 'The boar tears free. Jiao San finally brings it down with poison. Before you can carry away anything, blue eyes appear beyond the carcass.')],
            {needs: [moonlight, field('tide', 'tusks_swung')], parts: 3,
                reason: 'You need Moonlight Gu and three parts of essence to cut the net.'}),
        act('wait_out_wolves', 'Hide inside the boar until help arrives', 10, done('cut_the_net'),
            'The others run. Without a Gu that can outrun the pack, take cover inside the carcass. Use one stone to replenish your sea while you wait.',
            [recover(12), set('tide', 'relief_arrived'),
                note('tide', 'You drag your teammate across the opening and listen to the wolves feeding. When the clan’s relief party arrives, you crawl out unhurt. She is dead. The healer has questions for you.')],
            {needs: [field('tide', 'wolves_closing')], costs: [item(stone, -1)],
                reason: 'Keep a stone in hand to replenish your sea while you wait.'}),
        act('cover_jiao_san', 'Kneel beside Jiao San', 4, done('wait_out_wolves'),
            'Kong Jing is dead. Jiao San’s hand still moves. Cover him with your blood-soaked shirt before the healers reach you.',
            [set('roll', 'sole_survivor'), note('roll', 'The healer lifts your shirt and finds no pulse. You are the only one from your group to walk back. The healer finds no Gu in his aperture.')],
            {needs: [field('tide', 'relief_arrived')]}),
        act('answer_elders', 'Give your account at the Internal Affairs Hall', 3 * day + 60, done('cover_jiao_san'),
            'Three days after the fight, tell the elders how you reached Rank Two and how you survived. They want to hear what happened at the net and inside the boar.',
            [set('roll', 'assignment_closed'), set('withdrawal', 'unused'),
                note('roll', 'The elders release you. Your group’s assignment is off your name. You still have your Rank Two withdrawal for the year.')],
            {needs: [field('roll', 'sole_survivor')]}),
        act('file_at_hall', 'File for the inheritance mission', 15, done('answer_elders'),
            'Ask the clerk for the estate mission now that you have no assignment on the roll. Leave the offers to join or lead another group unanswered.',
            [set('claim', 'filed_waiting'), note('claim', 'The clerk takes your application and tells you to come back in three days. The family estate has yet to change hands.')],
            {needs: [field('roll', 'assignment_closed')], reason: 'The hall must close the group’s assignment before it can take your application.'}),
        act('collect_assignment', 'Collect the estate assignment in three days', 3 * day, done('file_at_hall'),
            'Pass the others on their way to the memorial. Return when the clerk told you to and read what the hall wants brought back.',
            [set('claim', 'honey_wine_assignment'), note('claim', 'The hall asks for five liang of golden-bee honey wine. Look for a larger hive: the small ones have honey, but no wine.')],
            {needs: [field('claim', 'filed_waiting')]}),
        act('plan_white_jade', 'Choose White Jade Gu for the bee stings', 8, done('collect_assignment'),
            'Your Jade Skin Gu is too weak for this hive. Choose defense first: plan to fuse it with White Boar Gu before you go for the wine.',
            [set('plan', 'white_jade_before_hive'), note('plan', 'White Jade Gu needs your White Boar and Jade Skin Gu. You have both, and you have enough stones to attempt one fusion. You have not started refining them.')],
            {needs: [field('claim', 'honey_wine_assignment'), field('custody', 'carried'), stock(whiteBoar), stock(jadeSkin)],
                reason: 'Collect the honey-wine assignment and bring both Gu before planning the fusion.'})
    ]
};

let installed;
export async function registerGuLeadEstateClaim(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_RANK_TWO && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadEstateClaim, base);
    return installed;
}

const longJobs = guLeadEstateClaim.commands.filter(command => command.duration >= 120).map(command => command.id);
export function guLeadEstateClaimClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_ESTATE_CLAIM);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
