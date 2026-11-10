// Qing Mao, volume one chapters 98 (second scene)–100.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_ESTATE_CLAIM} from './book_gu_lead_estate_claim.js';
import {GU_LEAD_RANK_TWO} from './book_gu_lead_rank_two.js';
import {GU_LEAD_EXAM_RESULT} from './book_gu_lead_exam_result.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_WHITE_JADE = id('white_jade');
const local = name => `${GU_LEAD_WHITE_JADE}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:4b80c3bf9ccd881694f7388d4b8ed5cd70d430786d2c4bc5d9dcf03df0cf9217';
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
const stock = (id, value = 1) => ({fact: `item.${key(id)}`, op: 'gte', value});
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
const prior = name => `${GU_LEAD_ESTATE_CLAIM}.${name}`;
const priorFact = (name, value) => eq(`actor.${prior(name)}`, value);
const predecessor = all(eq(extensionFact(GU_LEAD_ESTATE_CLAIM)), eq(`completed.${prior('plan_white_jade')}`),
    priorFact('roll', 'assignment_closed'), priorFact('withdrawal', 'unused'),
    priorFact('claim', 'honey_wine_assignment'), priorFact('plan', 'white_jade_before_hive'),
    eq(`actor.${GU_LEAD_RANK_TWO}.aperture_stage`, 'rank_two_initial'));
const admitted = eq(extensionFact(GU_LEAD_WHITE_JADE));
const tusk = local('boar_king_tusk');
const whiteJade = local('white_jade_gu');
const wine = local('golden_bee_wine');
const stonesForFusion = 144;
const wineForHall = 5;

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

export const guLeadWhiteJade = {
    schema: 1, id: GU_LEAD_WHITE_JADE, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan refines White Jade Gu',
    description: 'Put your share of the boar kill into the fusion, then try your new defense against the bees and stone monkeys.',
    requires: all(ready, predecessor, moonlight, stock(whiteBoar), stock(jadeSkin)),
    reason: 'Accept the honey-wine assignment and prepare both Gu before you attempt the fusion.',
    items: [
        {id: tusk, label: 'Boar king’s tusk', description: 'Your share of the hunt. It can steady the light during fusion.', value: 0},
        {id: whiteJade, label: 'White Jade Gu', description: 'A Rank Two Gu that draws essence to shield the skin. It eats eight liang of jade rock every twenty days.', value: 0},
        {id: wine, label: 'Golden-bee honey wine · one liang', description: 'Wine from the larger hive. The hall asks for five liang.', value: 0}
    ],
    status: [status('fusion', 'White Jade Gu'), status('wine', 'The hall’s wine'), status('pillars', 'The stone forest'),
        status('return', 'Back in the village')],
    commands: [
        act('collect_tusk', 'Bring your share of the hunt to your room', 45, predecessor,
            'The clan owes you one of the boar king’s tusks. Pick it up and let your sea fill on its own while you lay out the two Gu and count your stones.',
            [item(tusk, 1), recover(44), set('reserve_grade', 'rank_two_initial'), set('fusion', 'prepared'),
                note('fusion', 'You set the snow-white tusk next to the money bags. You have enough for one attempt. You remember when to put the tusk into the light.')]),
        act('fuse_white_jade', 'Fuse White Boar and Jade Skin', 60, done('collect_tusk'),
            'Keep both Gu circling in the same light. Feed it 144 stones, then add the tusk once the light is as broad as a grindstone.',
            [item(whiteJade, 1), set('fusion', 'white_jade_refined'),
                note('fusion', 'The light softens when the tusk goes in. It contracts around a single, smooth white Gu. The other two are gone, but the strength you built with White Boar stays with you.')],
            {needs: [field('fusion', 'prepared')], atStart: [stock(whiteBoar), stock(jadeSkin), stock(tusk), stock(stone, stonesForFusion)],
                costs: [item(whiteBoar, -1), item(jadeSkin, -1), item(tusk, -1), item(stone, -stonesForFusion)],
                reason: 'You need both Gu, the boar king’s tusk and 144 stones to attempt the fusion.'}),
        act('draw_honey_wine', 'Gather the honey wine under White Jade', 7 * day, done('fuse_white_jade'),
            'Over the next week, find a larger hive. Spend six parts to keep White Jade over your skin while you draw five liang into your water sack.',
            [item(wine, wineForHall), set('wine', 'carried'),
                note('wine', 'You brought back five liang of golden-bee honey wine. Keep it in the water sack until you reach the Internal Affairs Hall.')],
            {needs: [stock(whiteJade)], parts: 6, reason: 'Bring White Jade Gu and six parts of essence for the stings.'}),
        act('clear_pillar_path', 'Draw the stone monkeys away from the pillar', 3 * day, done('draw_honey_wine'),
            'Work toward the central pillar in short trips. Let the larger group chase you until most turn back. Spend thirty-four parts on White Jade and moonblades against the ones that follow.',
            [set('pillars', 'central_path_unfinished'),
                note('pillars', 'You can hold off several dozen at once in White Jade. A hundred is too many. You add today’s jade eyes to the cache in the second room and stop with the central pillar still out of reach.')],
            {needs: [stock(whiteJade), moonlight], parts: 34,
                reason: 'Bring White Jade and Moonlight Gu and start with thirty-four parts for the rounds among the pillars.'}),
        act('return_with_wine', 'Take the long way back to the village', 20, done('clear_pillar_path'),
            'Carry the water sack home at sunset. Take a few turns off the path so nobody can trace you to the cave. In the street, a child’s spinning top rolls to your feet.',
            [set('return', 'uncle_at_rented_house'),
                note('return', 'You reassure the child’s father and walk on. Your uncle stands outside your rented house. You still have the wine, and the hall has yet to see it.')],
            {needs: [field('wine', 'carried'), stock(wine, wineForHall)], reason: 'Keep all five liang of the hall’s wine in the water sack.'})
    ]
};

let installed;
export async function registerGuLeadWhiteJade(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_ESTATE_CLAIM && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadWhiteJade, base);
    return installed;
}

const longJobs = guLeadWhiteJade.commands.filter(command => command.duration >= 120).map(command => command.id);
export function guLeadWhiteJadeClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_WHITE_JADE);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
