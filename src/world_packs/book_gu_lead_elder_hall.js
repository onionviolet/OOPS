// Qing Mao, volume two chapters 153–155.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EAR_GRASS} from './book_gu_lead_ear_grass.js';
import {GU_LEAD_WHITE_JADE} from './book_gu_lead_white_jade.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_WOOD_CHARM} from './book_gu_lead_wood_charm.js';
import {GU_LEAD_BURIAL_GU} from './book_gu_lead_burial_gu.js';

export const GU_LEAD_ELDER_HALL = id('elder_hall');
const local = name => `${GU_LEAD_ELDER_HALL}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:f8d1c824fbf2d102405073bd52c27613224a9bbabeb98c963400828c0b126089';
const world = id('world');
const academy = id('academy');
const day = 1440;
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const key = itemId => JSON.stringify({id: itemId});
const stock = (itemId, value = 1) => ({fact: `item.${key(itemId)}`, op: 'gte', value});
const item = (itemId, amount) => ({type: 'item', actor: 'player', key: key(itemId), amount});
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const merit = `${GU_LEAD_EAR_GRASS}.merit`;
const jadeId = `${GU_LEAD_WHITE_JADE}.white_jade_gu`;
const shieldId = `${GU_LEAD_WOOD_CHARM}.water_shield_gu`;
const cleansing = local('cleansing_water_gu');
const wings = local('thunderwings_gu');
const canopy = local('sky_canopy_gu');
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_BURIAL_GU)),
    eq(`completed.${GU_LEAD_BURIAL_GU}.form_white_silver_essence`),
    eq(`actor.${GU_LEAD_BURIAL_GU}.rank`, 'rank_three_white_silver_with_trace'));
const admitted = eq(extensionFact(GU_LEAD_ELDER_HALL));

function act(name, label, duration, previous, description, effects, {needs = [], atStart = [], costs = [], reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...atStart), reason: reason || 'Finish the previous step and stay in the village.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs, effects
    };
}

// Authored dials (private receipt): minutes per step, 400 stones lost in each of the two fusion tries, 500 merit for the
// aqua defense Gu, the Thunderwings choice taking half an hour, and the two loan receipts being held by Chi Lian.
// Sourced: three thousand stones and the Cleansing Water Gu borrowed against two receipts, the clan's free Rank Three Gu,
// the failed first fusion that kills Water Shield, and the second that makes Sky Canopy Gu from White Jade.
export const guLeadElderHall = {
    schema: 1, id: GU_LEAD_ELDER_HALL, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan takes his seat as an elder',
    description: 'Show your rank to the clan hall, turn the room against Yao Ji, borrow from Chi Lian and refine a new defence.',
    requires: all(ready, predecessor, stock(jadeId), stock(shieldId)),
    reason: 'Keep your White Jade Gu and Water Shield Gu.',
    items: [
        {id: cleansing, label: 'Cleansing Water Gu · borrowed from Chi Lian', description: 'It washes impurities out of an aperture. Chi Lian had set it aside for his grandson.', value: 0},
        {id: wings, label: 'Thunderwings Gu', description: 'Rank Three. A pair of thunder wings carries you through the air for a short time.', value: 0},
        {id: canopy, label: 'Sky Canopy Gu', description: 'Rank Three defence, fused from White Jade Gu and a water defence Gu. A milky white shell the size of a fist.', value: 0}
    ],
    status: [status('alibi', 'Your three days'), status('hall', 'The clan hall'), status('yao_ji', 'Yao Ji'),
        status('chi', 'The Chi manor'), status('gu', 'Your Rank Three Gu')],
    commands: [
        act('meet_chi_lian_in_secret', 'Visit Chi Lian at night and make him vouch for you', 30, predecessor,
            'Use a secret about his grandson that only he and the boy share. Let him offer you a closed-door room in his manor as your three days.',
            [set('alibi', 'chi_lian_will_vouch'), event('chi_lian', 'threatened_and_cooperating'),
                note('alibi', 'Chi Lian wants to kill you and does not dare. He agrees to say you spent the three days in a secret room in his manor.')]),
        act('show_your_rank_to_the_elders', 'Stand in the clan hall and let the elders check your rank', 15, done('meet_chi_lian_in_secret'),
            'White silver essence and a Rank Three aura cannot be faked. Elders know you took two Relic Gu from Bai and expected you to be slower.',
            [set('hall', 'rank_shown'), event('elders', 'wary_and_watching'),
                note('hall', 'The elders confirm your white silver essence and your Rank Three aura. Some say the Relic Gu explains it. Others do not think so.')],
            {needs: [field('alibi', 'chi_lian_will_vouch')]}),
        act('refuse_yao_ji_s_inspection', 'Refuse to let Yao Ji inspect your aperture', 10, done('show_your_rank_to_the_elders'),
            'Yao Ji demands it as the medicine hall elder. You are her equal now. Name the grudges: the Liquor Worm she wanted, the vitality grass she wanted to plunder, the Three Step Fragrant Grass Gu she blocked.',
            [set('yao_ji', 'inspection_refused'), event('elders', 'staying_out_of_a_quarrel_between_elders'),
                note('yao_ji', 'You call her by name. The other elders say nothing. Many of them dealt with her over the grass. Nobody comes to her side yet.')],
            {needs: [field('hall', 'rank_shown')]}),
        act('account_for_three_days', 'Say where you were for three days', 10, done('refuse_yao_ji_s_inspection'),
            'She asks. Tell the hall you were in closed-door cultivation in Chi Lian’s manor and let him confirm it.',
            [set('alibi', 'chi_lian_confirmed_in_the_hall'), event('elders', 'suspecting_chi_faction_backing'),
                note('alibi', 'Chi Lian says through his teeth that it is so. The hall goes loud. Many elders conclude the Chi faction has been behind you all along.')],
            {needs: [field('alibi', 'chi_lian_will_vouch')]}),
        act('turn_the_search_against_yao_ji', 'Tell the hall she sent healers to search for her own granddaughter', 20, done('account_for_three_days'),
            'Call for her title to be suspended and her work assessed. Say Chi Lian agrees. Do not tell him first.',
            [set('yao_ji', 'fainted_and_carried_out'), set('elder', 'confirmed_by_clan_head'),
                event('medicine_hall', 'chi_zhong_acting_elder'), event('chi_lian', 'dragged_into_the_quarrel_and_angry'),
                note('yao_ji', 'Yao Ji faints in the hall. The clan head puts Chi Zhong over the medicine hall for now. He confirms you as an elder and sends word for the village to celebrate.')],
            {needs: [field('yao_ji', 'inspection_refused'), field('alibi', 'chi_lian_confirmed_in_the_hall')]}),
        act('accept_the_elders_congratulations', 'Meet the elders as a humble, grateful young man', 25, done('turn_the_search_against_yao_ji'),
            'Thank the academy elder for his teaching. Be modest to everyone. Refuse a few invitations and leave with Chi Lian.',
            [set('hall', 'seen_as_gentle_and_modest'), event('academy_elder', 'surprised_and_proud'),
                note('hall', 'The elders see a courteous and humble man where they remembered a rebel. You leave the pavilion smiling with Chi Lian.')],
            {needs: [field('elder', 'confirmed_by_clan_head')]}),
        act('borrow_from_chi_lian', 'Borrow three thousand stones and the Cleansing Water Gu', 65, done('accept_the_elders_congratulations'),
            'You will draw a hundred stones a week from the clan, three hundred in the wolf tide, a free Rank Three Gu and the clan recipes. You still ask for more. Sign two receipts.',
            [pay(-3000), item(cleansing, 1), set('chi', 'two_receipts_signed_chi_holds_them'), event('debt', 'three_thousand_stones_and_a_cleansing_water_gu_owed'),
                note('chi', 'After an hour Chi Lian gives you three thousand stones and the Cleansing Water Gu, and keeps your two receipts. You do not plan to pay him back.')],
            {needs: [field('hall', 'seen_as_gentle_and_modest')]}),
        act('choose_the_clans_rank_three_gu', 'Take a Thunderwings Gu from the clan', 30, done('borrow_from_chi_lian'),
            'Elders took it from a frenzy wolf. It gives you wings for a short time. Pick it from the Rank Three Gu the clan owes a new elder.',
            [item(wings, 1), set('gu', 'thunderwings_taken'),
                note('gu', 'The Thunderwings Gu is yours. Your last weakness in a fight was movement, and this fixes it.')],
            {needs: [field('chi', 'two_receipts_signed_chi_holds_them')]}),
        act('fuse_water_shield_and_white_jade', 'Spend a day trying to fuse Water Shield and White Jade', day, done('choose_the_clans_rank_three_gu'),
            'Feed stones into the light while it holds. The fusion fails. Water Shield Gu dies.',
            [item(shieldId, -1), pay(400), set('gu', 'first_fusion_failed'),
                note('gu', 'The fusion fails and the Water Shield Gu dies. White Jade Gu survives. You will try again with another water defence Gu.')],
            {needs: [field('gu', 'thunderwings_taken'), stock(shieldId), stock(jadeId)], atStart: [stoneCost(400)]}),
        act('fuse_the_sky_canopy_gu', 'Fuse White Jade with a merit-bought water defence Gu', 2 * day, done('fuse_water_shield_and_white_jade'),
            'Exchange merit for a new aqua defense Gu and throw stones into the light until it shrinks.',
            [item(jadeId, -1), item(merit, -500), pay(400), item(canopy, 1), set('gu', 'sky_canopy_refined'),
                note('gu', 'The light fades and a Sky Canopy Gu flies to your hand, a milky shell the size of a fist. Your Cleansing Water Gu is still unused.')],
            {needs: [field('gu', 'first_fusion_failed'), stock(jadeId)], atStart: [stoneCost(400), stock(merit, 500)]})
    ]
};

let installed;
export async function registerGuLeadElderHall(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_BURIAL_GU && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadElderHall, base);
    return installed;
}

const longJobs = new Set(guLeadElderHall.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadElderHallClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_ELDER_HALL);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
