// Qing Mao, volume two chapters 122–123.
import {extensionFact} from '../structured_pack_extensions.js';
import {all, eq, heldBodyReady, windowKit} from '../window_chain.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_STONE_FOREST} from './book_gu_lead_stone_forest.js';
import {GU_LEAD_RIVER_TOAD} from './book_gu_lead_river_toad.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';

export const GU_LEAD_WOLF_FRONT = id('wolf_front');
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:75899733757befd000717ca267633160d7cf8c4588b39077b9c998d5e8ee8130';
const world = id('world');
const academy = id('academy');
const kit = windowKit({prefix: GU_LEAD_WOLF_FRONT, energyId: id('primeval'),
    reserveReason: value => `Prepare ${value} parts of essence first.`});
const {local, done, field, set, note, status, stock, item, recover} = kit;
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const grass = `${GU_LEAD_MOONGLOW}.vitality_grass`;
const leaf = `${GU_LEAD_MOONGLOW}.vitality_leaf`;
const moonglow = `${GU_LEAD_MOONGLOW}.moonglow_gu`;
const stealth = `${GU_LEAD_STONE_FOREST}.stealth_rock_gu`;
const boar = `${GU_LEAD_RIVER_TOAD}.refined_black_boar_gu`;
const worm = `${GU_LEAD_RIVER_TOAD}.four_flavours_liquor_worm`;
const salvage = local('wolf_salvage');
const health = loss => kit.vital('health', -loss);
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const ready = heldBodyReady({claim: id('academy_roll'), faculty: id('aperture'), place: academy});
const predecessor = all(eq(extensionFact(GU_LEAD_RIVER_TOAD)),
    eq(`completed.${GU_LEAD_RIVER_TOAD}.ask_about_stealth_scales`),
    eq(`actor.${GU_LEAD_RIVER_TOAD}.cultivation`, 'middle_with_upper_essence'),
    eq(`actor.${GU_LEAD_RIVER_TOAD}.condensed_parts`, 1));
const admitted = eq(extensionFact(GU_LEAD_WOLF_FRONT));

const act = kit.chain({worldId: world, location: academy, admitted, ready,
    defaultReason: 'Finish the previous step and stay in the village.'});

export const guLeadWolfFront = kit.window({
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan prepares for the wolf tide',
    description: 'Use stronger essence to clear a way through the pillars before the winter patrols close in.',
    requires: all(ready, predecessor, stock(moonglow), stock(worm), stock(grass)),
    reason: 'Finish the first Four Flavours work and bring Moonglow and the grass.',
    items: [{id: salvage, label: 'Lightning wolf skins and teeth', description: 'A bundle of useful parts taken after the pack retreated.', value: 0}],
    status: [status('path', 'The stone forest'), status('wolves', 'The winter wolves'),
        status('survival', 'Scouting and movement'), status('contest', 'The alliance contest'),
        status('trade', 'Jiang Ya’s account'), status('exchange', 'Your Black Boar terms'), status('offer', 'The medicine offer')],
    commands: [
        act('clear_three_pillars', 'Clear three pillars over two days', 2880, predecessor,
            'Use the stronger essence with Moonglow, and spend twelve more parts clearing the monkeys from the pillars.',
            [set('condensed_parts', 0), set('reserve_grade', 'rank_two_condensed'), set('pillars_cleared', 3),
                set('path', 'three_pillars_cleared'),
                note('path', 'Three pillars stand clear. At that pace you reckon it might take half a month to reach the middle again. You still do not know what is below the stairs.')],
            {needs: [stock(moonglow), stock(worm)], parts: 12}),
        act('work_around_the_patrols', 'Put off the cave visits and prepare for winter', 90, done('clear_three_pillars'),
            'Wolf packs and scattered beasts are bringing more patrols near the crack. Leave the cave alone for now. Draw twelve stones to refill before your next trip.',
            [recover(30), set('path', 'patrols_slowed_access'),
                note('path', 'Your early pace has fallen away as winter sets in. Patrols come too near the crack. The old estimate for reaching the stairs no longer looks safe.')],
            {needs: [field('path', 'three_pillars_cleared')], atStart: [stoneCost(12)], costs: [pay(12)]}),
        act('fight_the_crippled_pack', 'Cut at the pack while moving out of its reach', 10, done('work_around_the_patrols'),
            'About twenty crippled lightning wolves close in. Spend twenty parts on blades while you keep moving. Expect some of the pack to get close enough to hurt you.',
            [set('wolves', 'pack_retreated'), note('wolves', 'The wolves keep working together until too many fall. The survivors howl and pull away. A healthy pack this size would be a different fight.')],
            {needs: [stock(moonglow), field('path', 'patrols_slowed_access')], parts: 20, costs: [health(6)]}),
        act('salvage_the_wolves', 'Finish the wounded wolves and gather what you can sell', 25, done('fight_the_crippled_pack'),
            'Wait until the pack is gone, then take skins and teeth. Consider what you would need to hunt alone once the wolf tide reaches the village.',
            [item(salvage, 1), set('wolves', 'salvaged'),
                note('survival', 'A scouting Gu could warn you before a pack closes. A movement Gu could get you out. You have neither. If the cave offers nothing, you hope the alliance will trade Fish Scale Gu for merit.')],
            {needs: [field('wolves', 'pack_retreated')]}),
        act('take_the_compensation', 'Keep out of the strength contest and take the 200 stones', 15, done('salvage_the_wolves'),
            'Chi Shan brings the clan’s order to stay out. Hear how the contest affects the clans’ share of the alliance, then weigh the bag he offers from his own purse.',
            [item(stone, 200), set('contest', 'ordered_to_abstain_compensated'),
                note('contest', 'You take Chi Shan’s two hundred stones and stay out of the contest. You had no wish to fight for a name. Some people in the village call your river feat luck.')],
            {needs: [field('wolves', 'salvaged')]}),
        act('grow_the_next_lot', 'Raise another nine leaves for Jiang Ya', 720, done('take_the_compensation'),
            'Spend half a day tending the grass. Use ten parts to start and draw from fifty stones between growths. Pick the leaves when the batch is ready.',
            [item(leaf, 9), set('trade', 'nine_leaves_ready'), note('trade', 'You have another nine plucked leaves for Jiang Ya.')],
            {needs: [stock(grass)], atStart: [stoneCost(50)], costs: [pay(50)], parts: 10}),
        act('settle_with_jiang_ya', 'Weigh Jiang Ya’s bags and ask about Fish Scale Gu', 20, done('grow_the_next_lot'),
            'Check the five bags from his sales and hand him the next nine leaves. Ask whether he found the Gu you wanted.',
            [item(stone, 480), set('trade', 'paid_fish_scale_missing'),
                note('trade', 'You receive 480 stones from the sales. Demand for leaves has risen. Jiang Ya says the clan is holding its stock close. He could not get Fish Scale Gu.')],
            {needs: [stock(stealth)], atStart: [stock(leaf, 9)], costs: [item(leaf, -9)]}),
        act('set_terms_for_black_boar', 'Keep the worm and grass and name your price for Black Boar', 15, done('settle_with_jiang_ya'),
            'Qing Shu and Fang Zheng have come to buy. Keep the worm and the grass. Ask for Fish Scale Gu and the difference in stones if they want Black Boar.',
            [set('exchange', 'black_boar_terms_named'),
                note('exchange', 'You name your terms. Qing Shu thinks you want Scale Armor Gu. You keep your own plans to yourself. The Gu and grass are still in your hands.')],
            {needs: [stock(boar), stock(worm), stock(grass)]}),
        act('hear_the_medicine_offer', 'Hear what Qing Shu brings from the medicine hall', 10, done('set_terms_for_black_boar'),
            'Yao Ji wants a Liquor Worm for her granddaughter. Listen to the price and what the medicine hall might do for you if you are hurt in the wolf tide.',
            [set('offer', 'medicine_offer_awaiting_reply'),
                note('offer', 'Qing Shu relays an offer of a high price and extra attention from the medicine hall if you are wounded. You have given no answer.')],
            {needs: [field('exchange', 'black_boar_terms_named')]})
    ]
});

let installed;
export async function registerGuLeadWolfFront(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_RIVER_TOAD && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadWolfFront, base);
    return installed;
}

const longJobs = new Set(guLeadWolfFront.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadWolfFrontClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_WOLF_FRONT);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
