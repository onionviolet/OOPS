// Volume one, ch29–35. The assessment's mixed-sea entry stays historical.
// From the second allowance onward, this extension owns the condensed reserve.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_ASSESSMENT} from './book_gu_lead_assessment.js';
import {GU_LEAD_DORM} from './book_gu_lead_dorm.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_CONFRONTATION = id('confrontation');
const local = name => `${GU_LEAD_CONFRONTATION}.${name}`;
const key = id => JSON.stringify({id});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const assessmentHash = 'sha256:e10cd6a92d9ef90f177017278a146eb85175097d7caa1b432648b7f3e427b023';
const world = id('world');
const academy = id('academy');
const elder = id('academy_elder');
const essence = id('primeval');
const stone = key(`${GU_LEAD_REFINEMENT}.primeval_stone`);
const worm = key(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const sabre = local('guard_sabre');
const allowanceDay = 7 * 1440;
const originalAllowance = `${GU_LEAD_ASSESSMENT}.purses`;
const supervised = {targetId: elder, coLocated: true, participants: ['$target']};

const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const done = name => eq(`completed.${local(name)}`);
const fact = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const stoneCost = amount => ({fact: `item.${stone}`, op: 'gte', value: amount, reason: `You need ${amount} whole primeval ${amount === 1 ? 'stone' : 'stones'}.`});
const ordinary = `energy.${essence}.reserve`;
const useOrdinary = output => ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output, control: 1});
const recover = amount => ({type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount});
const admitted = eq(extensionFact(GU_LEAD_CONFRONTATION));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`, true, 'You need to be able to move your primeval essence.'));
const predecessor = all(eq(extensionFact(GU_LEAD_ASSESSMENT)), eq(`completed.${GU_LEAD_ASSESSMENT}.draw_after_conversion`),
    eq(`actor.${GU_LEAD_ASSESSMENT}.condensed_parts`, 5));
const hasCrescent = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead', 'Bring your refined Moonlight Gu.');
const hasWorm = eq(`item.${worm}`, 1, 'You need your refined Liquor Worm with you.');
const condensed = (parts, reason) => eq(`actor.${local('condensed_parts')}`, parts, reason);
const phase = state => eq(`actor.${local('encounter')}`, state);
const footwork = eq(`knowledge.${GU_LEAD_DORM}.footwork.understood`);
const sea = (parts, text) => [fact('condensed_parts', parts), note('sea', text)];

function act(name, label, duration, previous, description, effects, {needs = [], reserve = [], costs = [], reason, ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, eq('actor.location', academy), ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local',
        worldId: world, actorId: 'player', location: academy, audience: ['$actor'], once: true,
        duration, visibleWhen, requires: {...all(support, ...reserve), reason: reason || reserve[0]?.reason || 'Finish the earlier step and stay at the academy.'},
        completionRequires: support, completionCoLocated: true, cancellation: 'refund', completionFailure: 'refund',
        reservationReturns: 1, costs, effects, ...extra
    };
}

export const guLeadConfrontation = {
    schema: 1, id: GU_LEAD_CONFRONTATION, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan and the Mo household',
    description: 'Stay through the next allowance, return to the gate and deal with the visitors who come looking for you.',
    requires: all(ready, predecessor, eq(ordinary, 39), hasWorm, hasCrescent, eq('actor.location', academy)),
    reason: 'Refill your mixed primeval sea after the first gate collection. Keep your refined Gu with you.',
    items: [{id: sabre, label: 'Dormitory guard’s sabre', description: 'A guard handed this over at dawn outside the academy dormitory.', value: 0}],
    status: [
        {id: local('school_status'), label: 'The week after the gate', knowledgeKey: local('school')},
        {id: local('gate_status'), label: 'The next allowance day', knowledgeKey: local('gate')},
        {id: local('visitor_status'), label: 'The Mo household', knowledgeKey: local('visitor')},
        {id: local('sea_status'), label: 'Your sea after the next allowance', knowledgeKey: local('sea')},
        {id: local('fight_status'), label: 'Outside the dormitory', knowledgeKey: local('fight')}
    ],
    commands: [
        act('keep_school_week', 'Stay in class until the next allowance', allowanceDay, predecessor,
            'Meet the pupils who challenge you and keep attending class. Between lessons, let your essence recover and use the Liquor Worm to build up thirty-two stronger parts. The week still passes if you stop.',
            [...sea(32, 'Over the week you build up thirty-two stronger parts, leaving twelve ordinary parts in your sea.'),
                note('school', 'A few pupils challenge you in the first three days. They go down, and now the class listens to the footwork instructor. Your classmates hardly speak to you.')],
            {needs: [hasWorm, footwork], costs: [useOrdinary(27)],
                reserve: [eq(ordinary, 39, 'Begin with thirty-nine ordinary parts and the five already condensed.')], durationSinceKnowledge: originalAllowance}),
        act('receive_allowance', 'Take the next three-stone allowance', 2, done('keep_school_week'),
            'Answer your name one week after the last distribution. The elder hands you the usual three primeval stones.',
            [item(stone, 3), note('gate', 'The elder has paid your three-stone allowance for the week.')], supervised),
        act('hold_gate_again', 'Stand at the gate again', 15, done('receive_allowance'),
            'Ask for one stone per classmate. Face Mo Bei and Chi Cheng when they come forward one at a time.',
            [item(stone, 56), note('gate', 'Mo Bei falls first. Chi Cheng follows. You leave with one stone per classmate, and the guards move in once you are clear of the gate.')],
            {needs: [footwork]}),
        act('meet_at_supper', 'Finish supper while the servant waits', 15, done('hold_gate_again'),
            'A man with scarred forearms tells you that you struck the Mo household’s young master. Keep your seat and listen.',
            [note('visitor', 'The servant says the young miss is coming to settle the score for Mo Bei. A woman in a red belt steps into the inn. The servant bows and calls her Young Miss.')]),
        act('lead_to_room', 'Lead Mo Yan to your room', 10, done('meet_at_supper'),
            'Ask who told her you were Fang Yuan. Let her draw her own conclusion and offer to take her to the dormitory.',
            [fact('encounter', 'threshold'), note('visitor', 'The guards let Mo Yan take one servant inside. Gao Wan comes with her. She follows you to an empty room, then realizes you brought her to Fang Yuan after all.')]),
        act('hold_threshold', 'Stand inside and leave the door open', 10, done('lead_to_room'),
            'Stay on your side of the threshold. Remind Mo Yan the academy will ask about any pupil taken from a room. Leave the door open as you turn to your bed.',
            [fact('encounter', 'watch'), note('visitor', 'Mo Yan reaches toward you, then stops at the threshold. She calls for you to come out. When you stay inside, she leaves Gao Wan to watch the door.')],
            {needs: [phase('threshold')]}),
        act('nurture_wall', 'Work stronger essence against the aperture wall', 60, done('hold_threshold'),
            'Spend thirty-two stronger parts against the light barrier. Gao Wan is still outside. You can cultivate from the bed with the door open.',
            [...sea(0, 'Twelve ordinary parts remain. Your aperture still has a light barrier. You have begun to strengthen it.'), fact('wall', 'nurtured')],
            {needs: [phase('watch'), condensed(32)], reason: 'You need thirty-two stronger parts and a place to work undisturbed.'}),
        act('draw_at_night', 'Draw one stone in the cold room', 30, done('nurture_wall'),
            'Hold a whole primeval stone and draw thirty-two ordinary parts into your sea. Keep working while Gao Wan calls from the doorway.',
            [recover(32), note('sea', 'Your sea holds forty-four ordinary parts. The Liquor Worm can take over from here.')],
            {needs: [phase('watch'), eq(ordinary, 12)], reserve: [stoneCost(1)], costs: [item(stone, -1)]}),
        act('condense_night', 'Spend two more stones to condense the whole sea', 180, done('draw_at_night'),
            'Use the Liquor Worm and draw from two more whole stones as the mist takes your ordinary essence. Finish with forty-four stronger parts in the same aperture.',
            [...sea(44, 'All forty-four parts in your sea are stronger essence. Your aperture still has its light barrier. The night cost three stones altogether.'),
                note('fight', 'The door has grown damp and your legs are stiff. Gao Wan is still crouched outside.')],
            {needs: [phase('watch'), hasWorm, condensed(0)], reserve: [stoneCost(2), eq(ordinary, 44)],
                costs: [item(stone, -2), useOrdinary(44)]}),
        act('step_out', 'Warm your legs and step outside', 5, done('condense_night'),
            'Work the stiffness out of your legs before leaving the room. Gao Wan wakes when he hears your feet. He orders you to go back with him and apologize.',
            [fact('encounter', 'grapple'), note('fight', 'Gao Wan stands between you and the way out. He raises his fist as you step toward him.')],
            {needs: [phase('watch')]}),
        act('trade_blows', 'Slip his punch and make room', 3, done('step_out'),
            'Use the instructor’s footwork. Step past his fist and try for the waist. If he closes the distance again, force him to guard and step back.',
            [fact('encounter', 'range'), note('fight', 'Your fingers hit his forearm and go numb. You force him to cover his weak spots, but he has the reach and stamina to keep coming. You back out of reach.')],
            {needs: [phase('grapple'), footwork]}),
        act('cut_guard', 'Throw a Moonblade through his guard', 1, done('trade_blows'),
            'Spend ten stronger parts. Gao Wan says the academy forbids fighting with Gu here. Send a blade as he raises his arms and rushes.',
            [...sea(34, 'Thirty-four stronger parts remain.'), fact('encounter', 'flight'),
                note('fight', 'The blade cuts through Gao Wan’s guard. The wound is much deeper than he expected. He turns and runs.')],
            {needs: [phase('range'), hasCrescent, condensed(44)], reason: 'Make room for the Moonblade and have at least ten stronger parts ready.'}),
        act('pursue', 'Follow before he gets clear', 1, done('cut_guard'),
            'Spend ten stronger parts to keep Gao Wan running. His shout carries to the dormitory guards.',
            [...sea(24, 'Twenty-four stronger parts remain.'), fact('encounter', 'caught'),
                note('fight', 'The guards gather as Gao Wan calls for help. They watch from the side. He slows enough for you to catch up.')],
            {needs: [phase('flight'), hasCrescent, condensed(34)], reason: 'You need the Moonlight Gu and ten stronger parts for the chase.'}),
        act('finish_fight', 'Send two Moonblades after Gao Wan', 1, done('pursue'),
            'Spend twenty stronger parts. Aim both blades at his neck. The dormitory guards are watching and will see the cut.',
            [...sea(4, 'Four stronger parts remain after the fight.'), fact('encounter', 'dead'),
                note('fight', 'Gao Wan falls dead. The guards cry out. The depth of the wounds could tell someone what kind of essence you used.')],
            {needs: [phase('caught'), hasCrescent, condensed(24)], reason: 'Catch up to Gao Wan and keep twenty stronger parts ready.'}),
        act('take_sabre', 'Ask a guard for his sabre', 2, done('finish_fight'),
            'The guards offer to take the body. Ask the nearest one for his sabre and take charge of the body yourself.',
            [item(key(sabre), 1), fact('encounter', 'body_in_your_custody'),
                note('fight', 'The guard hands over his sabre. You drag Gao Wan’s body away as daylight reaches the dormitory.')],
            {needs: [phase('dead')]})
    ]
};

let installed;
export async function registerGuLeadConfrontation(register, base) {
    installed = null;
    if(!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_ASSESSMENT && e.revision === 1 && e.contentHash === assessmentHash)) return null;
    installed = await register.extension(guLeadConfrontation, base);
    return installed;
}

export function guLeadConfrontationClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if(!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_CONFRONTATION);
    if(!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && [local('keep_school_week'), local('condense_night')].includes(j.commandId));
    const command = extension.commands.find(c => c.id === job?.commandId);
    if(!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
