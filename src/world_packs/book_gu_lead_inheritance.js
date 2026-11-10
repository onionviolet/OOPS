// The earned crevice encounter through Fang Yuan's first aperture breakthrough.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_CARAVAN} from './book_gu_lead_caravan.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_INHERITANCE = id('inheritance');
const local = name => `${GU_LEAD_INHERITANCE}.${name}`;
const caravan = name => `${GU_LEAD_CARAVAN}.${name}`;
const key = id => JSON.stringify({id});
const stone = key(`${GU_LEAD_REFINEMENT}.primeval_stone`);
const worm = key(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:cdd9fca93b8a499e8fe55a73bb163686eb388a4a761b8518070bee27183ca29a';
const world = id('world');
const academy = id('academy');

const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (key, value) => ({type: 'fact', actor: 'player', scope: 'actor', key, value});
const broughtEssence = eq(`actor.${caravan('condensed_parts')}`, 22);
const parts = amount => field('condensed_parts', amount);
const essence = amount => set(local('condensed_parts'), amount);
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const stock = (key, value) => ({fact: `item.${key}`, op: 'gte', value});
const useStone = {type: 'item', actor: 'player', key: stone, amount: -1};
const hasWorm = stock(worm, 1);
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});

const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_CARAVAN)), eq(`completed.${caravan('strike')}`),
    eq(`actor.${caravan('deal')}`, 'ended_unpaid'), eq(`actor.${caravan('jia')}`, 'dead'),
    eq(`actor.${caravan('wall')}`, 'changed'));
const admitted = eq(extensionFact(GU_LEAD_INHERITANCE));

function act(name, label, duration, previous, description, effects, {needs = [], reserve = [], costs = [], reason, ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...reserve), reason: reason || 'Finish the earlier step and stay near the academy.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs, effects, ...extra
    };
}

export const guLeadInheritance = {
    schema: 1, id: GU_LEAD_INHERITANCE, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan after the caravan',
    description: 'Finish the night in the crevice, then return to the village.',
    requires: all(ready, predecessor, broughtEssence),
    reason: 'Finish the encounter by the image wall first.',
    status: [status('wall', 'The stone wall'), status('departure', 'The caravan road'),
        status('aperture', 'Your aperture'), status('sparring', 'Practice bouts')],
    commands: [
        act('clear_crevice', 'Read the wall and clear the crevice', 300, predecessor,
            'Look back at the wall before you clean up. Stay through the night to remove what traces you can.',
            [essence(22), set(local('body_custody'), 'removed_from_scene'),
                note('wall', 'A line of writing tells you to break the wall and follow the passage. The writing fades. You clear the scene through the night. The air in the crack still smells of blood.')],
            {needs: [broughtEssence]}),
        act('watch_departure', 'Watch the caravan leave in the rain', 20, done('clear_crevice'),
            'Watch from the hillside as the wagons take the mountain road. Leave the crevice alone for now.',
            [note('departure', 'Water runs down the crack. It may dilute the smell, but it will not keep the merchants from looking for Jia once they miss him. You head back to the village and put off your plans for the Liquor Worm.')]),
        act('nurture_in_rain', 'Nurture your aperture through the rain', 4 * 24 * 60, done('watch_departure'),
            'Stay in the village for four rainy days. Spend one carried stone and work the twenty-two stronger parts you brought back against your aperture wall. Leave the five bags in your room.',
            [essence(0), set(local('wall_condition'), 'nurtured'),
                note('aperture', 'Your aperture still has a light wall. The stronger essence has worked into it over four days. Your five bags are still under the bed.')],
            {needs: [hasWorm, parts(22)], reserve: [stock(stone, 1)], costs: [useStone],
                durationSinceKnowledge: local('departure'),
                reason: 'Bring the Liquor Worm, your twenty-two stronger parts and one carried stone.'}),
        act('spar', 'Hold the ring through thirty-three bouts', 80, done('nurture_in_rain'),
            'Fight barehanded. Use the footwork you learned to stay inside the line, and keep your Gu in reserve.',
            [set(local('ring'), 'exhausted'), set(local('wins'), 33),
                note('sparring', 'Mo Bei staggers across the line and coughs blood. The healers lead him out. Your legs are shaking, but no one else steps forward.')],
            {needs: [eq(`knowledge.${id('dorm')}.footwork.understood`)]}),
        act('leave_ring', 'Answer the instructor and step out', 5, done('spar'),
            'When the instructor threatens to take away the prize, ask why he put twenty stones up for the bout. Walk out while you can still keep your feet.',
            [set(local('ring'), 'withdrawn_unpaid'),
                note('sparring', 'You leave the twenty-stone prize behind. Pupils close around the clan favorites as the matches resume. The elder watches from the academy window.')],
            {needs: [field('ring', 'exhausted')]}),
        act('prepare_sea', 'Fill your sea before the night’s practice', 300, done('leave_ring'),
            'Rest after the bouts. At night, close your room and draw on a carried stone as the Liquor Worm condenses your own essence.',
            [essence(44), set(local('wall_condition'), 'near_breakthrough'),
                note('aperture', 'Your light wall is close to giving way. Forty-four parts of pale green essence fill the sea.')],
            {needs: [hasWorm, parts(0), field('wall_condition', 'nurtured')], reserve: [stock(stone, 1)],
                costs: [useStone], reason: 'Bring the Liquor Worm and one carried stone after resting.'}),
        act('breakthrough', 'Work the aperture wall until dawn', 6 * 60, done('prepare_sea'),
            'Stay awake and send repeated waves against the light wall. Keep going when it begins to shine. The effort will use twenty-four parts of your stronger essence.',
            [essence(20), set(local('wall_condition'), 'water'), set(local('aperture_stage'), 'middle'),
                note('aperture', 'At dawn the light wall is gone. A thicker water wall ripples in its place. You have reached Rank One middle stage, with twenty parts of essence left.')],
            {needs: [parts(44), field('wall_condition', 'near_breakthrough')],
                reason: 'Begin with a full sea of stronger essence and a light wall ready to change.'})
    ]
};

let installed;
export async function registerGuLeadInheritance(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_CARAVAN && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadInheritance, base);
    return installed;
}

const longJobs = ['clear_crevice', 'nurture_in_rain', 'prepare_sea', 'breakthrough'].map(local);
export function guLeadInheritanceClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_INHERITANCE);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command?.duration ? Math.min(120, remaining) : null;
}
