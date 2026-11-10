// Qing Mao, volume two chapters 141–145.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EAR_GRASS} from './book_gu_lead_ear_grass.js';
import {GU_LEAD_ICE_CRYSTAL} from './book_gu_lead_ice_crystal.js';
import {GU_LEAD_RIVER_TOAD} from './book_gu_lead_river_toad.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_WHITE_JADE} from './book_gu_lead_white_jade.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';

export const GU_LEAD_WOOD_CHARM = id('wood_charm');
const local = name => `${GU_LEAD_WOOD_CHARM}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:7931d9a921641606c1bf0bc39ccbeadc4864d1c37501755f0a0571f3ef21e451';
const world = id('world');
const academy = id('academy');
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
const moonglow = stock(`${GU_LEAD_MOONGLOW}.moonglow_gu`);
const jade = stock(`${GU_LEAD_WHITE_JADE}.white_jade_gu`);
const scales = stock(`${GU_LEAD_EAR_GRASS}.stealth_scales_gu`);
const plunder = stock(`${GU_LEAD_ICE_CRYSTAL}.plunder_gu`);
const ear = stock(`${GU_LEAD_EAR_GRASS}.earth_ear_grass`);
const merit = `${GU_LEAD_EAR_GRASS}.merit`;
const liquor = stock(`${GU_LEAD_RIVER_TOAD}.four_flavours_liquor_worm`);
const grass = stock(`${GU_LEAD_MOONGLOW}.vitality_grass`);
const recovered = local('recovered_gu_bundle');
const relic = local('red_steel_relic');
const aperture = local('stone_aperture_gu');
const shield = local('water_shield_gu');
const health = loss => ({type: 'vital', actor: 'player', key: 'health', amount: -loss});
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const sea = id('primeval');
const reserve = value => ({fact: `energy.${sea}.reserve`, op: 'gte', value,
    reason: `Prepare ${value} parts of essence first.`});
const spend = output => ({type: 'energy', actor: 'player', energyId: sea, operation: 'use', output, control: 1});
const recover = amount => ({type: 'energy', actor: 'player', energyId: sea, operation: 'recover', amount});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_ICE_CRYSTAL)),
    eq(`completed.${GU_LEAD_ICE_CRYSTAL}.leave_the_frozen_path`),
    eq(`actor.${GU_LEAD_ICE_CRYSTAL}.ice`, 'fang_yuan_withdrew'),
    eq(`world.${GU_LEAD_ICE_CRYSTAL}.qing_shu`, 'wood_charm_activated'));
const admitted = eq(extensionFact(GU_LEAD_WOOD_CHARM));

function act(name, label, duration, previous, description, effects, {needs = [], atStart = [], costs = [], parts = 0, reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...atStart, ...(parts ? [reserve(parts)] : [])), reason: reason || 'Finish the previous step and stay in the village.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: parts ? [...costs, spend(parts)] : costs, effects
    };
}


export const guLeadWoodCharm = {
    schema: 1, id: GU_LEAD_WOOD_CHARM, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan returns when the fighting quiets',
    description: 'Stay out of the fight while you look for a way back to the mountain path.',
    requires: all(ready, predecessor, plunder, ear, scales, liquor),
    reason: 'Withdraw from the frozen path with your concealment, scouting and Plunder Gu.',
    items: [
        {id: recovered, label: 'Recovered Gu from Man Shi’s group', description: 'Gu recovered from the dead. The alliance board takes these for merit.', value: 0},
        {id: relic, label: 'Red steel Relic Gu · taken from Bai Ning Bing', description: 'Kept unused. At Rank Two it can raise the aperture by one stage.', value: 0},
        {id: aperture, label: 'Stone Aperture Gu', description: 'It can force a Rank Two aperture to peak, at the cost of future advancement and natural essence recovery.', value: 0},
        {id: shield, label: 'Water Shield Gu', description: 'Turns aside force if it has room to form. It can complement White Jade Gu.', value: 0}
    ],
    status: [status('perimeter', 'Around the mountain path'), status('cage', 'The quiet after the fight'),
        status('plunder', 'Gu taken from Bai Ning Bing'), status('aftermath', 'The clan response'),
        status('cultivation', 'Your cultivation'), status('leaves', 'The requests for leaves')],
    commands: [
        act('recover_in_cover', 'Draw from twelve stones while the fight carries on', 20, predecessor,
            'Hide away from the mountain path. The sounds of battle draw wolves and Gu Masters. Fill your sea before you risk going back.',
            [recover(44), set('perimeter', 'ready'), note('perimeter', 'You refill in cover. The fight is still drawing people toward the path.')],
            {needs: [scales], atStart: [stoneCost(12)], costs: [pay(12)]}),
        act('gather_from_the_fallen', 'Circle under concealment and recover the fallen group’s Gu', 35, done('recover_in_cover'),
            'Spend thirteen parts on cover and attacks. Draw wolves across the approaches where you can. Search Man Shi’s fallen group before you go back to the path.',
            [item(recovered, 1), set('perimeter', 'fallen_gu_recovered'),
                note('perimeter', 'You recover Gu from Man Shi’s group. The Xiong bodies are gone. You find no Brown Bear Gu. Keep the bundle for the board.')],
            {needs: [scales, moonglow, jade], parts: 13, costs: [health(4)]}),
        act('listen_and_approach_the_cage', 'Listen for the two groups and approach the quiet path', 15, done('gather_from_the_fallen'),
            'Use four parts listening through the rock. Footsteps approach from both villages. Go in before them and see what remains of the cage.',
            [event('duel', 'both_fighters_at_limit'), event('wood_charm_cost', 'local_essence_spent_body_transformed'), set('cage', 'needle_guard'),
                note('cage', 'Bai Ning Bing is still alive in the vines. Pin needles turn you back. Qing Shu no longer seems to tell friend from foe. A finishing blow would bring you through his guard with both clans closing in.')],
            {needs: [ear, field('perimeter', 'fallen_gu_recovered')], parts: 4}),
        act('take_the_relic_from_bai', 'Use Plunder to take the red steel Relic Gu', 4, done('listen_and_approach_the_cage'),
            'Stay outside the needles and spend eight parts on the first pull. Take the Gu in your hand and refine it without using it on your aperture.',
            [item(relic, 1), set('plunder', 'relic_taken'), note('plunder', 'The Relic Gu comes free. The Bai Gu Masters see it in your hand. Their path is still blocked.')],
            {needs: [plunder, field('cage', 'needle_guard')], parts: 8}),
        act('take_stone_aperture', 'Use Plunder again and take Stone Aperture Gu', 4, done('take_the_relic_from_bai'),
            'Spend nine parts on the next pull. A failed pull can hurt you. Keep this Gu for inspection.',
            [item(aperture, 1), set('plunder', 'stone_aperture_taken'), note('plunder', 'You take Stone Aperture Gu and leave it unused.')],
            {needs: [plunder, field('plunder', 'relic_taken')], parts: 9}),
        act('take_water_shield', 'Spend your last ten parts taking Water Shield Gu', 4, done('take_stone_aperture'),
            'The two sides are still separated. Use the opening before the reinforcements can reach you.',
            [item(shield, 1), set('plunder', 'water_shield_taken'),
                note('plunder', 'You have Water Shield, Stone Aperture and the unused Relic Gu. Your sea is empty.')],
            {needs: [plunder, field('plunder', 'stone_aperture_taken')], parts: 10}),
        act('withdraw_and_report_the_bundle', 'Withdraw with the clan and turn in the recovered Gu', 45, done('take_water_shield'),
            'Both clans draw back. Return to the village and turn in the Gu from the fallen group at the merit board. Keep the Gu you took from Bai Ning Bing.',
            [item(merit, 4000), event('qing_shu', 'body_returned_to_gu_yue'), event('bai', 'carried_away_alive'),
                event('fang_zheng', 'received_letter_and_chose_to_protect'), set('aftermath', 'withdrawal_and_recovery_reported'),
                note('aftermath', 'The clans leave rather than start another fight in the middle of the wolf tide. Qing Shu’s body comes home. You turn in the recovered bundle and receive four thousand merit.')],
            {needs: [field('plunder', 'water_shield_taken')], atStart: [stock(recovered)], costs: [item(recovered, -1)]}),
        act('nourish_to_upper_stage', 'Spend days nourishing the aperture with Four Flavours', 7200, done('withdraw_and_report_the_bundle'),
            'Set aside a hundred stones and keep cultivating while the clan faces the frenzy packs. Leave both the Relic and Stone Aperture Gu unused.',
            [recover(44), set('aperture_stage', 'rank_two_upper'), set('reserve_grade', 'rank_two_peak_essence'),
                note('cultivation', 'The aperture reaches Rank Two upper stage through steady nourishment. Four Flavours gives the sea dark red essence a stage higher. You still hold the Relic Gu. Stone Aperture would end your natural recovery and further advancement.')],
            {needs: [liquor, stock(relic), stock(aperture), stock(shield)], atStart: [stoneCost(100)], costs: [pay(100)]}),
        act('refuse_more_leaf_sales', 'Refuse Jiang Ya and Ye’s requests for more leaves', 10, done('nourish_to_upper_stage'),
            'Demand for leaves is rising, and the clan has called retired Gu Masters back. Keep your time for cultivation when the two men ask you to produce more.',
            [set('leaves', 'extra_sales_refused'),
                note('leaves', 'You turn them away without making another sale. There is no payment or new promise. The wolf tide is still pushing families from the villages.')],
            {needs: [grass, field('aperture_stage', 'rank_two_upper')]})
    ]
};

let installed;
export async function registerGuLeadWoodCharm(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_ICE_CRYSTAL && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadWoodCharm, base);
    return installed;
}

const longJobs = new Set(guLeadWoodCharm.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadWoodCharmClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_WOOD_CHARM);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
