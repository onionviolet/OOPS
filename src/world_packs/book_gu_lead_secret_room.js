// Qing Mao, volume two chapters 156–158.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_ELDER_HALL} from './book_gu_lead_elder_hall.js';

export const GU_LEAD_SECRET_ROOM = id('secret_room');
const local = name => `${GU_LEAD_SECRET_ROOM}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:0cfa51db509a51c6d882bf9f55887ea6d73d5ae0e40fd1bc4092d5fa5684bf69';
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
const grassId = `${GU_LEAD_MOONGLOW}.vitality_grass`;
const token = local('prize_token');
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const pay = amount => item(stone, -amount);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_ELDER_HALL)),
    eq(`completed.${GU_LEAD_ELDER_HALL}.fuse_the_sky_canopy_gu`),
    eq(`actor.${GU_LEAD_ELDER_HALL}.gu`, 'sky_canopy_refined'));
const admitted = eq(extensionFact(GU_LEAD_SECRET_ROOM));

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

// Authored dials (private receipt): minutes per step, the return being the next day (1,440 minutes), no tracked
// essence cost for lighting a Digital Shade Gu, and the elder's three hundred stones being handed on in full.
// Sourced: the fifteen-minute daily limit, the recipes seen, the six-role plan, Chi Zhong's three hundred stones,
// the Prize Token for the Nine Leaf Vitality Grass, and the visit to Uncle and Aunt.
export const guLeadSecretRoom = {
    schema: 1, id: GU_LEAD_SECRET_ROOM, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan reads the clan’s recipes',
    description: 'Browse the secret room, trade the vitality grass for a token and visit your uncle with Chi Zhong.',
    requires: all(ready, predecessor, stock(grassId)),
    reason: 'Keep your Nine Leaf Vitality Grass and finish your fusions.',
    items: [
        {id: token, label: 'Prize Token', description: 'Awarded for great service to the clan. In the underground Gu cave it lets you choose any Gu, Rank Three or Four. Chi Zhong says an exchange can be undone quietly later.', value: 0}
    ],
    status: [status('recipes', 'The secret room'), status('plan', 'Your six Gu'), status('grass', 'The vitality grass'),
        status('family', 'Your uncle and aunt')],
    commands: [
        act('browse_the_recipes', 'Spend fifteen minutes among the Digital Shade Gu', 15, predecessor,
            'An old Gu Master leads you through the dark tunnel. As a Rank Three elder you may read the recipes up to Rank Three, for fifteen minutes a day, watched throughout.',
            [set('recipes', 'moonscar_and_rank_three_recipes_read'), event('secret_room', 'rank_three_recipes_open_to_fang_yuan'),
                note('recipes', 'You read the Moonscar recipe, then the Rank Three ones built on Moonglow Gu: Golden Moon, Frost Moon and Illusory Moon. All three eat Moon Orchid petals that spoil in days. Illusory Moon leads to Moonshadow Gu, which locks up a Rank Three Gu Master’s essence. The Spring Autumn Cicada would take it from you.')],
            {needs: [stock(grassId)]}),
        act('wonder_about_the_flower_wine_monk', 'Think about the Flower Wine Monk’s wounds', 10, done('browse_the_recipes'),
            'Moonshadow Gu only suppresses essence. It does not explain how the Monk came to be covered in blood.',
            [set('mystery', 'moonshadow_does_not_explain_the_wounds'),
                note('recipes', 'Moonshadow Gu cannot be what hurt the Monk. What did? The inheritance is a mystery again.')],
            {needs: [field('recipes', 'moonscar_and_rank_three_recipes_read')]}),
        act('return_for_blood_moon', 'Return the next day and memorise the Blood Moon recipe', day, done('wonder_about_the_flower_wine_monk'),
            'Moonglow Gu and Blood Essence Gu make a Rank Three attack that bleeds. It needs fresh blood, not petals, but its attack weakens for some days each month. You do not hold a Blood Essence Gu.',
            [set('recipes', 'blood_moon_memorised'), note('recipes', 'You learn the Blood Moon recipe by heart and check it three times. Few Gu Masters ever chose it, so its notes are thin beside the classics. It eats blood, which the Southern Border has everywhere. You do not have a Blood Essence Gu.')],
            {needs: [field('mystery', 'moonshadow_does_not_explain_the_wounds')]}),
        act('plan_your_six_gu', 'Count the six Gu you need before you leave', 10, done('return_for_blood_moon'),
            'Attack, defence, healing, storage, scouting and movement.',
            [set('plan', 'storage_gu_missing'),
                note('plan', 'Sky Canopy Gu defends, Thunderwings Gu carries you, Ear Grass scouts, Blood Moon would attack. The Nine Leaf Vitality Grass heals poorly and will not sell where you are going. You have no storage Gu, and you will not leave without one.')],
            {needs: [field('recipes', 'blood_moon_memorised')]}),
        act('collect_the_allowance_from_chi_zhong', 'Take the week’s three hundred stones from Chi Zhong', 10, done('plan_your_six_gu'),
            'He waits at the tunnel mouth. He is the acting medicine hall elder. He collected it for you.',
            [item(stone, 300), set('allowance', 'weekly_three_hundred_received'),
                note('grass', 'Chi Zhong hands you the three hundred stones all elders draw this week and asks about the vitality grass.')],
            {needs: [field('plan', 'storage_gu_missing')]}),
        act('trade_the_grass_for_the_prize_token', 'Hand over the Nine Leaf Vitality Grass for a Prize Token', 20, done('collect_the_allowance_from_chi_zhong'),
            'You are an elder, so this is a trade and not an order. A Gu Master should not hold on to the same Gu for ever.',
            [item(grassId, -1), item(token, 1), set('grass', 'handed_to_chi_zhong'), event('requisition', 'settled_with_chi_zhong'),
                event('chi_zhong', 'using_the_grass_to_show_he_can_settle_the_old_quarrel'),
                note('grass', 'You hand over the grass and Chi Zhong refines it. In return you have a Prize Token. You may choose a Gu in the underground cave, and an exchange can be undone quietly later.')],
            {needs: [field('allowance', 'weekly_three_hundred_received'), stock(grassId)]}),
        act('visit_uncle_and_aunt', 'Take Chi Zhong to your uncle and aunt’s house', 30, done('trade_the_grass_for_the_prize_token'),
            'Sit in the main seat. Give your uncle the three hundred stones as a thank-you for raising you.',
            [pay(300), set('family', 'stones_given_to_uncle_with_chi_zhong_present'), event('shen_cui', 'regrets_her_choice_and_stays_with_fang_zheng'),
                note('family', 'They are afraid of you. Your uncle weeps and says the tavern is closed and they are close to starving. You suspect he has savings. You leave your three hundred stones with him, and Chi Zhong tells him to take it.')],
            {needs: [field('grass', 'handed_to_chi_zhong')], atStart: [stock(stone, 300)]})
    ]
};

let installed;
export async function registerGuLeadSecretRoom(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_ELDER_HALL && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadSecretRoom, base);
    return installed;
}

const longJobs = new Set(guLeadSecretRoom.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadSecretRoomClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_SECRET_ROOM);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
