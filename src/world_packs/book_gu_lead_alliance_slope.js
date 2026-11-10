// Qing Mao, volume two chapters 124–125.
import {extensionFact} from '../structured_pack_extensions.js';
import {all, eq, heldBodyReady, windowKit} from '../window_chain.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_WOLF_FRONT} from './book_gu_lead_wolf_front.js';
import {GU_LEAD_RIVER_TOAD} from './book_gu_lead_river_toad.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';

export const GU_LEAD_ALLIANCE_SLOPE = id('alliance_slope');
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:b50fb0bcc47bc5b80ac293f1bf7b0993e248b83dc30aaae130555e8f6eee3a95';
const world = id('world');
const academy = id('academy');
const kit = windowKit({prefix: GU_LEAD_ALLIANCE_SLOPE});
const {local, done, field, set, event, note, status, stock} = kit;
const grass = stock(`${GU_LEAD_MOONGLOW}.vitality_grass`);
const worm = stock(`${GU_LEAD_RIVER_TOAD}.four_flavours_liquor_worm`);
const stamina = loss => kit.vital('stamina', -loss);
const ready = heldBodyReady({claim: id('academy_roll'), faculty: id('aperture'), place: academy});
const predecessor = all(eq(extensionFact(GU_LEAD_WOLF_FRONT)),
    eq(`completed.${GU_LEAD_WOLF_FRONT}.hear_the_medicine_offer`),
    eq(`actor.${GU_LEAD_WOLF_FRONT}.offer`, 'medicine_offer_awaiting_reply'),
    eq(`actor.${GU_LEAD_WOLF_FRONT}.contest`, 'ordered_to_abstain_compensated'));
const admitted = eq(extensionFact(GU_LEAD_ALLIANCE_SLOPE));

const act = kit.chain({worldId: world, location: academy, admitted, ready, flatRequires: true,
    defaultReason: 'Finish the previous step and stay in the village.'});

export const guLeadAllianceSlope = kit.window({
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan attends the three-clan gathering',
    description: 'Answer Qing Shu before you join the clans at Alliance Slope.',
    requires: all(ready, predecessor, grass, worm),
    reason: 'Hear the medicine offer and keep the grass and refined worm.',
    status: [status('medicine', 'The medicine offer'), status('leaf_price', 'Vitality leaf terms'),
        status('alliance', 'Alliance Slope'), status('demonstration', 'The sparring match'), status('challenge', 'Xiong Li’s challenge')],
    commands: [
        act('refuse_the_purchase', 'Turn down the offer for the Liquor Worm', 5, predecessor,
            'Qing Shu and Fang Zheng press you to reconsider. Refuse again. Keep what you did with the worm to yourself.',
            [set('medicine', 'declined'), note('medicine', 'You refuse the sale and the medicine offer. Qing Shu warns that Yao Ji may keep pressing. You have yet to see what she will do.')],
            {needs: [worm]}),
        act('quote_the_leaf_price', 'Ask sixty-five stones for each future leaf', 10, done('refuse_the_purchase'),
            'The clan price is sixty. Set your price five stones higher because you expect demand to rise.',
            [set('leaf_price', 65), set('sale', 'price_declined'),
                note('leaf_price', 'Qing Shu declines for now. He pays you nothing. You expect the price to climb as more people need the leaves, but the next buyer has yet to name a price.')],
            {needs: [grass]}),
        act('attend_alliance_slope', 'Go to Alliance Slope for the three-clan gathering', 90, done('quote_the_leaf_price'),
            'Winter wolves have killed people at a hamlet, and the Gu Masters there have pulled back. Join the gathering where the clans are to agree on how to face the wolf tide.',
            [event('alliance', 'formed'), set('alliance', 'tournament_open'),
                note('alliance', 'The three clans have formed an alliance. The leaders open a sparring tournament. They tell the competitors to stop before anyone dies.')],
            {costs: [stamina(3)]}),
        act('watch_the_three_attack_match', 'Watch Xiong Jiang give Bai Bing Yi three attacks', 15, done('attend_alliance_slope'),
            'Watch Roaming Zombie take the Water Drill. Look for the reason Bai Bing Yi is hurt even as he is the one attacking.',
            [set('demonstration', 'shadow_bond_seen'),
                note('demonstration', 'The shadow connects them at close range. Bai Bing Yi takes a share of the injury he deals and admits defeat. Xiong Jiang says the Gu could not do the same at a distance.')],
            {needs: [field('alliance', 'tournament_open')]}),
        act('admit_defeat_without_sparring', 'Admit defeat when Xiong Li calls you out', 1, done('watch_the_three_attack_match'),
            'He names the river feat in front of all three clans. Accept the loss of face and give your answer without drawing a Gu.',
            [set('challenge', 'conceded_before_sparring'),
                note('challenge', 'You tell him you admit defeat. The crowd hears your answer. You have given him no contest.')],
            {needs: [field('demonstration', 'shadow_bond_seen')]})
    ]
});

export async function registerGuLeadAllianceSlope(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_WOLF_FRONT && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadAllianceSlope, base);
}
