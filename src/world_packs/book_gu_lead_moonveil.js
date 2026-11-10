// Fang Yuan's public aperture inspection and the academy gate.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_INHERITANCE} from './book_gu_lead_inheritance.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_MOONVEIL = id('moonveil');
const local = name => `${GU_LEAD_MOONVEIL}.${name}`;
const inheritance = name => `${GU_LEAD_INHERITANCE}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:1955359f9ce55473ccab302dec48e888a9fd8ff8a6db978de1d6968f9fc38720';
const world = id('world');
const academy = id('academy');
const item = id => JSON.stringify({id});
const worm = item(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const sabre = item(id('confrontation.guard_sabre'));
const stone = item(`${GU_LEAD_REFINEMENT}.primeval_stone`);

const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const holding = (key, count) => eq(`item.${key}`, count);
const give = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});

const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_INHERITANCE)), eq(`completed.${inheritance('breakthrough')}`),
    eq(`actor.${inheritance('aperture_stage')}`, 'middle'), eq(`actor.${inheritance('wall_condition')}`, 'water'));
const admitted = eq(extensionFact(GU_LEAD_MOONVEIL));

function act(name, label, duration, previous, description, effects, {needs = [], reason, ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...support, reason: reason || 'Finish the earlier step and stay near the academy.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: [], effects, ...extra
    };
}

export const guLeadMoonveil = {
    schema: 1, id: GU_LEAD_MOONVEIL, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan at the academy gate',
    description: 'Show the academy elder your new aperture, then answer his offer.',
    requires: all(ready, predecessor, holding(worm, 1), holding(sabre, 1)),
    reason: 'Reach middle stage and bring your Liquor Worm and sabre back to the academy.',
    status: [status('worm', 'Liquor Worm'), status('inspection', 'The academy elder'),
        status('chair', 'Class chairman'), status('gate', 'The academy gate')],
    commands: [
        act('hide_worm', 'Leave the Liquor Worm in the wine', 3, predecessor,
            'The elder’s lesson has begun. Leave the worm in the wine jars in your room before you go to the academy.',
            [give(worm, -1), set('worm_custody', 'dorm_wine'),
                note('worm', 'The worm disappears beneath the surface of the wine. The jars and the five bags of stones stay in your room.')],
            {needs: [holding(worm, 1)], reason: 'Bring the refined Liquor Worm back to your room.'}),
        act('face_guards', 'Meet the guards at the dormitory', 6, done('hide_worm'),
            'Two guards come to take you to the elder. Use the sabre to fight them off, then bring one of them to the classroom alive.',
            [set('guards', 'injured_alive'),
                note('inspection', 'Blood drips from your sleeve as you bring the injured guard to the classroom. The elder demands an explanation.')],
            {needs: [holding(sabre, 1), field('worm_custody', 'dorm_wine')],
                reason: 'Leave the worm in the wine and bring the sabre.'}),
        act('show_water_wall', 'Let the elder inspect your aperture', 4, done('face_guards'),
            'Tell him the guards came while you were breaking through. Let him see the water wall for himself.',
            [set('middle_attested', true), set('guards', 'treated_dismissed'),
                note('inspection', 'The elder confirms your middle stage in front of the class. He sends a healer to both guards and dismisses them from duty. He lets you go, but the room is still waiting to hear how you did it.')],
            {needs: [predecessor, field('guards', 'injured_alive'), field('worm_custody', 'dorm_wine'), holding(worm, 0)],
                reason: 'Your water wall must be ready to show, and the worm must stay in your room.'}),
        act('recover_worm', 'Take the Liquor Worm back from the wine', 3, done('show_water_wall'),
            'Return to your room after the inspection. Take your worm from the jars.',
            [give(worm, 1), set('worm_custody', 'carried'),
                note('worm', 'You have your Liquor Worm with you again. The academy elder saw the water wall, and the worm was here in the wine.')],
            {needs: [field('worm_custody', 'dorm_wine'), holding(worm, 0)]}),
        act('collect_prize', 'Count the elder’s thirty stones', 4 * 24 * 60, done('recover_worm'),
            'Wait for the fifth day’s subsidies. Count the thirty stones for breaking through first and hear when you may choose your second Gu.',
            [give(stone, 30), set('second_gu_priority', true), set('chair_offer', 'offered'),
                note('chair', 'There are thirty stones in the bag. The elder grants you first choice of a second Gu and offers you the chairman’s seat. The seat pays ten stones at each distribution and comes with duties to the class.')],
            {needs: [field('middle_attested', true)], durationSinceKnowledge: local('inspection')}),
        act('decline_chair', 'Decline the chairman’s seat', 4, done('collect_prize'),
            'Give up the chairman’s allowance and duties. Keep the breakthrough prize and your first choice of a second Gu.',
            [set('chair_offer', 'declined'), set('chairman', 'mo_bei'),
                note('chair', 'The elder gives the seat to Mo Bei. Fang Zheng and Chi Cheng become his deputies. Your thirty stones and first choice are already settled.')],
            {needs: [field('chair_offer', 'offered'), field('second_gu_priority', true)]}),
        act('hold_gate', 'Stand at the gate after class', 18, done('decline_chair'),
            'Hold the gate barehanded. Demand one stone from each pupil, three from each deputy and eight from the chairman.',
            [give(stone, 68), set('gate_take', 68),
                note('gate', 'Mo Bei goes down first. Fang Zheng and Chi Cheng give way too. The guards stay at their posts and look away. You count sixty-eight stones after the pupils have gone.')],
            {needs: [field('chair_offer', 'declined'), eq(`knowledge.${id('dorm')}.footwork.understood`)],
                reason: 'Decline the seat and bring the footwork you learned in practice.'})
    ]
};

let installed;
export async function registerGuLeadMoonveil(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_INHERITANCE && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadMoonveil, base);
    return installed;
}

export function guLeadMoonveilClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_MOONVEIL);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const command = extension.commands.find(c => c.id === local('collect_prize'));
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId === command.id);
    if (!job || job.revision !== command.revision || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
