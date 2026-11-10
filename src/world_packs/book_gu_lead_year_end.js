// Qing Mao, volume one chapters 81–86.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EXAM_RESULT} from './book_gu_lead_exam_result.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_YEAR_END = id('year_end');
const local = name => `${GU_LEAD_YEAR_END}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:9437bfb2dad1113dc791cf748e29b9a34b42b63bd3009349b5a7feef2ad0a378';
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
const whiteBoar = `${GU_LEAD_SECOND_GU}.white_boar`;
const jadeSkin = `${GU_LEAD_EXAM_RESULT}.jade_skin`;
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const exam = name => `${GU_LEAD_EXAM_RESULT}.${name}`;
const examFact = (name, value) => eq(`actor.${exam(name)}`, value);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_EXAM_RESULT)), eq(`completed.${exam('listen_in_brush')}`),
    examFact('trail', 'footsteps_approach'), examFact('aperture_stage', 'upper'), examFact('reserve_grade', 'peak'),
    examFact('practice', 'one_boar_strength'));
const admitted = eq(extensionFact(GU_LEAD_YEAR_END));

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

export const guLeadYearEnd = {
    schema: 1, id: GU_LEAD_YEAR_END, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan’s final academy examination',
    description: 'Find out who is on the autumn trail. Then prepare for your last winter at the academy and take your place in the arena.',
    requires: all(ready, predecessor, stock(whiteBoar), stock(jadeSkin), moonlight, liquor, littleLight),
    reason: 'Finish the autumn hunt and keep the Gu you brought back.',
    status: [status('trail', 'The autumn trail'), status('stage', 'Your aperture'), status('check', 'The last roll call'),
        status('preparation', 'Your two Gu'), status('draw', 'The year-end draw'), status('measure', 'Fang Zheng’s reach'),
        status('final', 'The final bout'), status('hands', 'Your hands'), status('result', 'The year-end result'),
        status('offer', 'The clan head’s offer')],
    commands: [
        act('watch_hunter', 'Watch the hunter pass', 2, predecessor,
            'Stay clear of the trail. See who took the wolf before you head back.',
            [set('trail', 'chi_shan_passed'), note('trail', 'Chi Shan walks past with the wolf at his belt. He made it out of this academy with a B grade and strength people still talk about. Come winter, you will have to leave the dorm too.')]),
        act('cultivate_for_winter', 'Cultivate through the first snow', 30 * day, done('watch_hunter'),
            'Use six stones over the last weeks of term to replenish your sea. Keep using the Liquor Worm and tending your Gu. A room and Gu food will cost you once the academy stops paying an allowance.',
            [set('aperture_stage', 'peak'), set('reserve_grade', 'peak'), recover(44),
                note('stage', 'The walls of your aperture turn to white crystal. You have reached Rank one peak stage. Your black-green sea still holds forty-four parts.')],
            {needs: [liquor, stock(whiteBoar), stock(jadeSkin)], costs: [item(stone, -6)],
                reason: 'Keep your Gu and set aside six stones for practice and upkeep.'}),
        act('take_final_check', 'Present your aperture at the last roll call', 8, done('cultivate_for_winter'),
            'Go up when the examiner calls. The elder says tomorrow’s winner gets a hundred and fifty stones and first pick of the Gu.',
            [set('announced_stones', 150), set('fang_zheng_rank', 'rank_two_initial'),
                note('check', 'The examiner calls out your peak stage. Then she checks Fang Zheng. Rank two, initial stage. The elders turn in their seats.')],
            {needs: [field('aperture_stage', 'peak')]}),
        act('leave_gu', 'Leave the White Boar and Jade Skin Gu in the cave', 24, done('take_final_check'),
            'Put both Gu in the second cave before going to the arena. Keep your trained strength, but leave no hidden Gu for an examiner to find on you.',
            [set('cave_custody', 'white_boar_and_jade_skin'),
                note('preparation', 'The White Boar Gu and Jade Skin Gu stay in the second cave. The strength you earned from feeding and training stays with you.')],
            {costs: [item(whiteBoar, -1), item(jadeSkin, -1)], reason: 'Bring both Gu to the cave. Stopping returns them to your bag.'}),
        act('enter_draw', 'Fight through the early rounds', 420, done('leave_gu'),
            'The elders and team leaders are watching three stages at once. Use your footing and Moonlight Gu to get through the draw.',
            [set('draw', 'late_rounds'), note('draw', 'By evening, most students are out. You are still in the draw. Gu Masters on the sidelines are making offers to students who fit the needs of their groups.')],
            {needs: [moonlight, field('cave_custody', 'white_boar_and_jade_skin')], parts: 3}),
        act('watch_fang_zheng', 'Watch how Fang Zheng closes on Mo Bei and Chi Cheng', 30, done('enter_draw'),
            'Watch where he stops advancing and how he uses his deeper sea against someone who can jump out of reach.',
            [set('measure', 'six_meters'),
                note('measure', 'Fang Zheng gets within six meters of Mo Bei and never lets him settle. When Chi Cheng jumps away, Fang Zheng makes him worry about how long he can keep it up. The announcer calls you up for the final.')]),
        act('close_inside_range', 'Step inside his six-meter range', 1, done('watch_fang_zheng'),
            'Watch his wrist and shoulder. Move in when he starts to send the blade, and keep closing before he can reset.',
            [set('tempo', 'inside_reach'), note('final', 'Fang Zheng gives ground. You slip past the next blades by watching his wrist before each release. His six meters are gone.')],
            {needs: [field('measure', 'six_meters')]}),
        act('circle_and_pin', 'Circle his return shot and pin him', 1, done('close_inside_range'),
            'Do not follow straight when he falls. Circle past the blade he sends backward, then strike and hold him down.',
            [set('tempo', 'pinned'), note('final', 'You go around the blade instead of following him into it. A blow to the ear drops him again. He cannot get up under your foot, but moonlight gathers in his palm.')],
            {needs: [field('tempo', 'inside_reach')]}),
        act('cut_palm', 'Cut off the moonblade at his palm', 1, done('circle_and_pin'),
            'Spend one black-green part to strike before he can release the shot.',
            [set('tempo', 'jade_defense'), note('final', 'Your moonblade hits his hand. The crowd starts calling for him to stand. Jade light spreads over his skin, and you take your foot away as he rises.')],
            {needs: [moonlight, field('tempo', 'pinned')], parts: 1}),
        act('break_jade_light', 'Break the jade light with both fists', 1, done('cut_palm'),
            'Use the strength you earned from White Boar practice. Without your own Jade Skin Gu, the blows will hurt your hands.',
            [set('hands', 'injured'), set('tempo', 'fang_zheng_down'),
                note('hands', 'Fang Zheng falls. The jade light breaks under your fists, but the skin splits and the bones crack. The arena goes quiet.')],
            {needs: [examFact('practice', 'one_boar_strength'), field('tempo', 'jade_defense'),
                field('cave_custody', 'white_boar_and_jade_skin'),
                eq(`item.${key(whiteBoar)}`, 0), eq(`item.${key(jadeSkin)}`, 0)]}),
        act('accept_treatment', 'Hold out your hands to the academy elder', 6, done('break_jade_light'),
            'Let the elder treat the cracks. He can examine your aperture and the Gu you carried while he works.',
            [set('hands', 'healed_still_weak'), set('result', 'first'),
                note('hands', 'The pain gives way to itching as the bones knit. Your grip is weak. You expect it to take seven or eight days to feel normal again. The elder gives no sign that he found the Gu you left behind.'),
                note('result', 'The academy elder declares you first. A few people say you must have been born strong, like Chi Shan.')],
            {needs: [field('hands', 'injured'), liquor, moonlight, littleLight, field('cave_custody', 'white_boar_and_jade_skin')]}),
        act('hear_group_offer', 'Hear the clan head’s offer', 4, done('accept_treatment'),
            'Listen before you name a group. The amount he announces now differs from what the academy elder promised before the fight.',
            [set('group_offer', 'open'), set('offered_stones', 100), set('gu_priority', 'offered'),
                note('offer', 'Gu Yue Bo names a hundred stones and first pick of the Gu. Then he says you can join any group you name. The other elders say nothing. You have not answered or taken any stones.')],
            {needs: [field('result', 'first')]})
    ]
};

let installed;
export async function registerGuLeadYearEnd(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_EXAM_RESULT && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadYearEnd, base);
    return installed;
}

const longJobs = guLeadYearEnd.commands.filter(command => command.duration >= 120).map(command => command.id);
export function guLeadYearEndClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_YEAR_END);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
