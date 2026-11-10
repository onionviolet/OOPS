// Qing Mao, volume two chapters 106–108.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_ESTATE_HANDOVER} from './book_gu_lead_estate_handover.js';
import {GU_LEAD_QING_SHU_MEETING} from './book_gu_lead_qing_shu_meeting.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_MOONGLOW = id('moonglow');
const local = name => `${GU_LEAD_MOONGLOW}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:2699a9ff15d65fe562e1622141ca7ac5ebbfc4043b34fb92ba125fc645d50950';
const world = id('world');
const academy = id('academy');
const essence = id('primeval');
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const key = item => JSON.stringify({id: item});
const count = (item, op, value, reason) => ({fact: `item.${key(item)}`, op, value, ...(reason ? {reason} : {})});
const stock = (item, value = 1, reason) => count(item, 'gte', value, reason);
const item = (item, amount) => ({type: 'item', actor: 'player', key: key(item), amount});
const reserve = (op, value) => ({fact: `energy.${essence}.reserve`, op, value,
    reason: op === 'gte' ? `Prepare ${value} parts of essence first.` : 'Use more of the essence you already have first.'});
const spend = output => ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output, control: 1});
const recover = amount => ({type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount});
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const littleLight = `${GU_LEAD_SECOND_GU}.little_light`;
const unrefined = `${GU_LEAD_ESTATE_HANDOVER}.unrefined_vitality_grass`;
const grass = local('vitality_grass');
const rooted = local('rooted_leaf');
const leaf = local('vitality_leaf');
const moonglow = local('moonglow_gu');
const academyMoonlight = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead');
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_QING_SHU_MEETING)),
    eq(`completed.${GU_LEAD_QING_SHU_MEETING}.answer_with_the_estate`),
    eq(`actor.${GU_LEAD_QING_SHU_MEETING}.mediation`, 'qing_shu_promised'));
const admitted = eq(extensionFact(GU_LEAD_MOONGLOW));
const firstPrice = 50;
const batchPrice = 9 * firstPrice;
const lightPrice = 50;
const fusionPrice = 50;
const refillPrice = 12;
const rootedCount = (op, value) => count(rooted, op, value, 'Check the leaves still on the stem.');
const buy = (amount, why) => stock(stone, amount, why);
const fusionSupply = [academyMoonlight, stock(littleLight, 2, 'Prepare two Little Light Gu.')];

function act(name, label, duration, previous, description, effects,
    {needs = [], atStart = [], costs = [], parts = 0, repeat = false, reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: !repeat, duration, visibleWhen,
        requires: {...all(support, ...atStart, ...(parts ? [reserve('gte', parts)] : [])),
            reason: reason || 'Finish the previous step and stay in the village.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: parts ? [...costs, spend(parts)] : costs, effects
    };
}

export const guLeadMoonglow = {
    schema: 1, id: GU_LEAD_MOONGLOW, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan puts the estate to work',
    description: 'Prepare the healing grass and finance a stronger Gu. Keep enough essence for the work that follows.',
    requires: all(ready, predecessor, academyMoonlight, stock(unrefined), stock(littleLight)),
    reason: 'Finish speaking with Qing Shu and bring the grass from the estate.',
    items: [
        {id: grass, label: 'Nine Leaf Vitality Grass', description: 'The refined grass on your palm. It grows up to nine leaves, each at a cost in essence.', value: 0},
        {id: rooted, label: 'Vitality leaf · on the stem', description: 'A leaf still growing on the grass. Pick it before trying to sell it.', value: 0},
        {id: leaf, label: 'Vitality leaf', description: 'A plucked healing Gu. Jiang Ya will pay fifty primeval stones for each leaf in a lot of nine.', value: 0},
        {id: moonglow, label: 'Moonglow Gu', description: 'The Rank Two crescent made from Moonlight and two Little Light Gu. It strikes much harder than Moonlight.', value: 0}
    ],
    status: [status('grass', 'Nine Leaf Vitality Grass'), status('trade', 'Jiang Ya’s purchase'),
        status('fusion', 'The Moonglow fusion'), status('plans', 'Your next Gu'),
        status('warning', 'Trouble at the properties'), status('fight', 'The tavern hall')],
    commands: [
        act('prepare_the_grass', 'Refine the grass and pluck its nine leaves', 120, predecessor,
            'Take the grass to your rented room. Refine it, then set the nine leaves aside. Let your sea replenish while you work.',
            [item(grass, 1), item(leaf, 9), recover(44), set('grass', 'bare_stem'),
                note('grass', 'The grass answers from your palm. You have nine plucked leaves and a bare stem. Jiang Ya can find buyers for the leaves.')],
            {atStart: [stock(unrefined)], costs: [item(unrefined, -1)]}),
        act('fund_the_fusion', 'Sell the first nine leaves to pay for the fusion', 25, done('prepare_the_grass'),
            'Have Jiang Ya take nine leaves for fifty stones each. Use the proceeds to pay for the Gu and stones you still need.',
            [item(stone, batchPrice), set('trade', 'first_lot_paid'),
                note('trade', 'Jiang Ya takes the leaves and pays you 450 stones. You can now afford another Little Light Gu and the stones for the fusion.')],
            {atStart: [stock(leaf, 9)], costs: [item(leaf, -9)]}),
        act('buy_second_light', 'Buy and refine a second Little Light Gu', 45, done('fund_the_fusion'),
            'Spend fifty stones at the shop, then prepare the new Gu with one part of essence.',
            [item(littleLight, 1), note('fusion', 'Both stars are ready to circle the crescent.')],
            {atStart: [buy(lightPrice, 'Bring fifty stones for the shop.')], costs: [item(stone, -lightPrice)], parts: 1}),
        act('attempt_moonglow', 'Try fusing Moonlight with both Little Light Gu', 65, done('buy_second_light'),
            'Feed fifty stones into the light as it contracts. Even with a sound recipe, the Gu may be hurt or lost.',
            [item(littleLight, -1), set('fusion', 'gu_injured'), set('grass', 'regrowing_after_failure'), set('reserve_grade', 'rank_two_initial'),
                note('fusion', 'The light bursts. One Little Light Gu dissolves. Your Moonlight Gu and the surviving star return to your hand, both dim. Give them at least three days before another attempt.'),
                note('grass', 'Grow each leaf with twenty parts of essence. There is room in your sea for two leaves at a time. Your stem has no leaves on it yet.')],
            {needs: fusionSupply, atStart: [buy(fusionPrice, 'Set aside fifty stones for the fusion.')], costs: [item(stone, -fusionPrice)]}),
        act('draw_from_stones', 'Draw essence from twelve stones', 1,
            all(done('attempt_moonglow'), field('grass', 'regrowing_after_failure'), rootedCount('lte', 8)),
            'Use twelve stones to replenish your sea between growths. Start when you have fewer than forty parts.',
            [recover(44)],
            {needs: [stock(grass)], atStart: [reserve('lte', 39), buy(refillPrice, 'Bring twelve stones to refill your sea.')],
                costs: [item(stone, -refillPrice)], repeat: true}),
        act('grow_two_leaves', 'Grow two leaves on the stem', 144,
            all(done('attempt_moonglow'), field('grass', 'regrowing_after_failure'), rootedCount('lte', 6)),
            'Spend forty parts of essence to nurture two leaves. Leave them on the grass as they mature.',
            [item(rooted, 2), note('grass', 'Two more leaves have matured on the stem. Leave them there; after eight have grown, raise the last one.')],
            {needs: [stock(grass)], parts: 40, repeat: true}),
        act('grow_last_leaf', 'Nurture the ninth leaf', 144,
            all(done('grow_two_leaves'), field('grass', 'regrowing_after_failure'), rootedCount('eq', 8)),
            'Spend twenty parts of essence on the last leaf. Fold the grass back into your palm when all nine leaves have grown.',
            [item(rooted, 1), set('grass', 'nine_leaves_restored'),
                note('grass', 'The grass is whole again. Nine leaves are on the stem. Keep them there until it is time to sell another lot.')],
            {needs: [stock(grass)], parts: 20}),
        act('rest_the_gu', 'Give the injured Gu three days to recover', 3 * 1440, done('grow_last_leaf'),
            'Keep the damaged Gu in your care. Wait until the crescent and star are bright again before you attempt the fusion.',
            [set('fusion', 'recovered'), recover(44), note('fusion', 'The surviving star and crescent have recovered. Replace the lost star before you try again.')],
            {needs: [field('fusion', 'gu_injured'), stock(littleLight)]}),
        act('replace_the_lost_light', 'Buy a replacement Little Light Gu', 45, done('rest_the_gu'),
            'Spend fifty stones for a replacement and one part of essence to prepare it.',
            [item(littleLight, 1)], {needs: [field('fusion', 'recovered')], atStart: [buy(lightPrice, 'Bring fifty stones for the shop.')],
                costs: [item(stone, -lightPrice)], parts: 1}),
        act('complete_moonglow', 'Try the Moonglow fusion again', 65, done('replace_the_lost_light'),
            'Use the recovered crescent, both stars and fifty stones. Keep the light steady until you can see what remains.',
            [item(moonglow, 1), set('fusion', 'moonglow_refined'),
                note('fusion', 'The two stars and the old crescent are gone. A larger blue crescent floats above your palm. You can use Moonglow Gu in place of Moonlight.')],
            {needs: [field('fusion', 'recovered'), academyMoonlight], atStart: [stock(littleLight, 2), buy(fusionPrice, 'Set aside fifty stones for the fusion.')],
                costs: [item(littleLight, -2), item(stone, -fusionPrice)]}),
        act('pluck_sale_lot', 'Pick nine mature leaves for Jiang Ya', 10, done('complete_moonglow'),
            'Pluck the leaves you grew and put them in a small cloth bag.',
            [item(leaf, 9), set('grass', 'bare_stem'), note('grass', 'The stem is bare. Nine plucked leaves go into the cloth bag.')],
            {needs: [stock(grass)], atStart: [rootedCount('eq', 9)], costs: [item(rooted, -9)]}),
        act('settle_the_sale', 'Weigh Jiang Ya’s four money bags', 20, done('pluck_sale_lot'),
            'Check the stones by weight. Hand over the cloth bag once you are satisfied. Decline to make more than nine leaves a day.',
            [item(stone, batchPrice), set('trade', 'nine_paid'), note('trade', 'He counts nine leaves three times. You take 450 stones. He says the clan charges fifty-five for a leaf and buyers are lining up at your price. Making more would take too much time from cultivation.'),
                note('plans', 'A second Liquor Worm and four wines could improve your cultivation. Bitter wine is still missing. White Jade covers defense; Moonglow covers attack. You still want a Gu for movement and one for finding what lies ahead.')],
            {atStart: [stock(leaf, 9)], costs: [item(leaf, -9)]}),
        act('hear_the_warning', 'Listen when the clerk calls for help', 5, done('settle_the_sale'),
            'Jiang Ya tells you someone has been causing trouble at the properties. When the clerk runs in, ask who is making a scene out front.',
            [set('fight', 'man_shi_in_hall'),
                note('warning', 'You privately put the trouble down to your uncle after Qing Shu’s warning and your own inquiries. Jiang Ya names the man in the hall: Man Shi. He warns you to be careful.'),
                note('fight', 'Man Shi has broken a pot of wine. The shopkeeper cannot calm him, and several patrons cannot get past him. He demands five hundred stones.')],
            {needs: [stock(moonglow)]}),
        act('cut_before_the_armor_forms', 'Fire before Man Shi’s armor can close', 1, done('hear_the_warning'),
            'Leave Jiang Ya at the table. Man Shi demands a public apology as you enter. Spend six parts of essence on a Moonglow blade while he is still talking.',
            [set('fight', 'chest_cut'), note('fight', 'The blade strikes his chest before the stone spreads over it. He clambers onto a table and shouts at you.')],
            {needs: [field('fight', 'man_shi_in_hall'), stock(moonglow)], parts: 6}),
        act('cut_through_his_guard', 'Keep him from settling into his guard', 3, done('cut_before_the_armor_forms'),
            'Spend twelve more parts on a pair of blades. Cut through the rock on his arms and close while he is reeling.',
            [set('fight', 'pinned_wounded'), note('fight', 'The blades chip the rock and cut his arms and leg. You have him pinned. People in the room are waiting to see whether you will kill him.')],
            {needs: [field('fight', 'chest_cut'), stock(moonglow)], parts: 12}),
        act('let_man_shi_leave', 'Threaten to cripple him, then let him leave', 5, done('cut_through_his_guard'),
            'Tell him what the next blade would cost him. Stop when he breaks and leave him a way out. Pay him nothing.',
            [set('fight', 'man_shi_left_wounded'), note('fight', 'Man Shi leaves wounded. Jiang Ya and the people in the hall fall quiet. Nobody takes five hundred stones from you, and no elder has ruled on the fight.')],
            {needs: [field('fight', 'pinned_wounded'), stock(moonglow)]})
    ]
};

let installed;
export async function registerGuLeadMoonglow(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_QING_SHU_MEETING && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadMoonglow, base);
    return installed;
}

const longJobs = new Set(guLeadMoonglow.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadMoonglowClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_MOONGLOW);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
