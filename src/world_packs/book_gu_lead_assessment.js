// Volume one, chapters 25–29. Assessment, weekly allowance, and the gate
// collection each settle separately against the earned purse.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_DORM} from './book_gu_lead_dorm.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_ASSESSMENT = id('assessment');
const assessment = name => `${GU_LEAD_ASSESSMENT}.${name}`;
const key = id => JSON.stringify({id});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const dormHash = 'sha256:eb1d629907e6dd0a2ed249668bcc04957f11bca150b1659cd1e653797915d6ac';
const world = id('world');
const academy = id('academy');
const elder = id('academy_elder');
const essence = id('primeval');
const stone = key(`${GU_LEAD_REFINEMENT}.primeval_stone`);
const wine = key(`${GU_LEAD_VITAL}.bamboo_wine`);
const worm = key(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const partlyDrawn = assessment('partly_drawn_stone');
const supervised = {targetId: elder, coLocated: true, participants: ['$target']};

const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const done = name => eq(`completed.${assessment(name)}`);
const fact = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: assessment(name), value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: assessment(name), stage: 'understood', value});
const stock = (key, value, reason) => ({fact: `item.${key}`, op: 'gte', value, reason});
const stoneCost = amount => stock(stone, amount, `You need ${amount} primeval ${amount === 1 ? 'stone' : 'stones'}.`);
const sea = `energy.${essence}.reserve`;
const reserveCost = amount => ({fact: sea, op: 'gte', value: amount, reason: `You need ${amount} parts of green-copper essence.`});
const spend = output => ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output, control: 1});
const recover = amount => ({type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount});
const admitted = eq(extensionFact(GU_LEAD_ASSESSMENT));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`, true, 'You need to be able to move your primeval essence.'));
const predecessor = all(eq(extensionFact(GU_LEAD_DORM)), eq(`completed.${GU_LEAD_DORM}.line_up`));
const hasCrescent = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead', 'Bring your refined Moonlight Gu.');
const hasWorm = eq(`item.${worm}`, 1, 'You need your refined Liquor Worm with you.');
const condensedParts = assessment('condensed_parts');
const condensed = eq(`actor.${condensedParts}`, 5, 'Condense five parts with the Liquor Worm first.');

function act(name, label, duration, previous, description, effects, {needs = [], reserve = [], costs = [], ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, eq('actor.location', academy), ...needs);
    return {
        id: assessment(name), revision: 1, label, description, group: 'structured_local',
        worldId: world, actorId: 'player', location: academy, audience: ['$actor'], once: true,
        duration, visibleWhen, requires: {...all(support, ...reserve), reason: reserve[0]?.reason || 'Finish the earlier step and stay at the academy.'},
        completionRequires: support, completionCoLocated: true, cancellation: 'refund', completionFailure: 'refund',
        reservationReturns: 1, costs, effects, ...extra
    };
}

export const guLeadAssessment = {
    schema: 1, id: GU_LEAD_ASSESSMENT, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan’s assessment and the academy gate',
    description: 'Finish the Moonblade assessment. Take your place at the gate after the elder hands out the allowance.',
    requires: all(ready, predecessor, hasCrescent, hasWorm, eq('actor.location', academy)),
    reason: 'Line up for the Moonblade assessment with your refined Moonlight Gu and the Liquor Worm you brought to the dormitory.',
    items: [{id: partlyDrawn, label: 'Primeval stone · fifteen parts drawn',
        description: 'You drew fifteen parts of essence into your sea and kept the rest of this stone.', value: 0}],
    status: [
        {id: assessment('turn_status'), label: 'Fang Zheng’s turn', knowledgeKey: assessment('brother_turn')},
        {id: assessment('target_status'), label: 'Your assessment', knowledgeKey: assessment('target_result')},
        {id: assessment('purses_status'), label: 'The elder’s two purses', knowledgeKey: assessment('purses')},
        {id: assessment('challenge_status'), label: 'The middle-stage challenge', knowledgeKey: assessment('challenge')},
        {id: assessment('gate_status'), label: 'At the academy gate', knowledgeKey: assessment('gate_result')},
        {id: assessment('supply_status'), label: 'Wine for the Liquor Worm', knowledgeKey: assessment('wine_stock')},
        {id: assessment('essence_status'), label: 'Your primeval sea', knowledgeKey: assessment('mixed_sea')}
    ],
    commands: [
        act('watch_brother', 'Watch Fang Zheng’s three throws', 3, predecessor,
            'Watch his hand on the first throw. He has two more chances after it.',
            [fact('puppet', 'standing'),
                note('brother_turn', 'Fang Zheng clips the neck by accident. He takes a breath and lands the other two blades on the chest. Your group is called last.')],
            supervised),
        act('throw_high', 'Send the first blade over the wall', 1, done('watch_brother'),
            'Spend ten parts of essence. Send the first blade high and let the spectators think you missed by accident.',
            [note('target_result', 'The first blade sails above the bamboo wall. Some pupils laugh. The puppet is untouched, and you have two throws left.')],
            {needs: [hasCrescent], reserve: [reserveCost(10)], costs: [spend(10)], ...supervised}),
        act('pair_at_neck', 'Send both remaining blades at the neck', 1, done('throw_high'),
            'Spend twenty parts of essence. Release the second blade an instant after the first, before the puppet’s grass has time to knit.',
            [fact('puppet', 'head_severed'),
                note('target_result', 'Both blades catch the same spot. The puppet’s head drops and rolls across the field. The laughter stops. The elder looks at the cut.')],
            {needs: [hasCrescent, eq(`actor.${assessment('puppet')}`, 'standing')], reserve: [reserveCost(20)], costs: [spend(20)], ...supervised}),
        act('receive_purses', 'Take your allowance and assessment prize', 2, done('pair_at_neck'),
            'Answer your name at the end of class. The elder has three primeval stones for your weekly allowance and ten for first place.',
            [item(stone, 3), item(stone, 10), note('purses', 'The elder hands you three stones for the week and ten for winning the Moonblade assessment.')],
            {needs: [eq(`actor.${assessment('puppet')}`, 'head_severed')], ...supervised}),
        act('hear_challenge', 'Hear the elder announce the next challenge', 4, done('receive_purses'),
            'Stay long enough to hear what the academy will pay for the first pupil to reach Rank One middle stage.',
            [note('challenge', 'The first pupil to reach middle stage within three months gets thirty stones and first choice of a second Gu. The academy will choose a monitor and two deputies after those three months.')],
            supervised),
        act('block_gate', 'Demand one stone from each pupil at the gate', 3, done('hear_challenge'),
            'Get to the gate before the others. Stand across the way and tell the first group what it will cost them to pass.',
            [note('gate_result', 'The first group hears your demand. One pupil tells you to get out of the way, and the others start forward.')]),
        act('hold_gate', 'Hold the gate with open hands', 5, done('block_gate'),
            'Use footwork and controlled strikes against the pupils who rush you. Some raise their Moonlight Gu. Remind them that fighting with Gu inside the academy means expulsion.',
            [fact('gate_resistance', 'stopped'),
                note('gate_result', 'Mo Bei and the other pupils who rush you go down. Blue light fades from the pupils’ palms when you mention expulsion. The guards stay back.')],
            {needs: [eq(`knowledge.${GU_LEAD_DORM}.footwork.understood`, true)]}),
        act('collect_gate', 'Take one stone from each classmate', 5, done('hold_gate'),
            'Take one stone even when a pupil offers you more. Give Fang Zheng and the last group the same terms. Have them bring one stone each from the pupils on the ground.',
            [item(stone, 56), note('gate_result', 'You leave with fifty-six stones, one from each classmate. The guards hurry over and call for a treatment Gu Master.')],
            {needs: [eq(`actor.${assessment('gate_resistance')}`, 'stopped')]}),
        act('buy_cellar', 'Buy twenty jars of green bamboo wine', 30, done('collect_gate'),
            'Pay forty stones at the inn. Go back to your room and have the workers put the jars under your bed.',
            [item(wine, 20), note('wine_stock', 'The inn workers set twenty more sealed jars under your bed. They cost forty stones.')],
            {reserve: [stoneCost(40)], costs: [item(stone, -40)]}),
        act('settle_at_night', 'Settle in for the night', 30, done('buy_cellar'),
            'Close the dormitory door when the workers leave. Wait for your sea to refill, then sit down with the Liquor Worm in your aperture.',
            [recover(44)], {needs: [hasWorm]}),
        act('condense_essence', 'Condense essence with the Liquor Worm', 5, done('settle_at_night'),
            'Send ten parts of essence into the worm to make the wine mist. Pass ten more through the mist. Those ten shrink to five parts of stronger essence.',
            [fact('condensed_parts', 5),
                note('mixed_sea', 'Five parts of stronger, pale green essence now sit alongside twenty-four parts of your original essence. Your aperture is still at Rank One initial stage.')],
            {needs: [hasWorm], reserve: [reserveCost(20)], costs: [spend(20)]}),
        act('draw_after_conversion', 'Draw essence from a stone to refill the sea', 15, done('condense_essence'),
            'Hold one whole primeval stone in your hand and draw fifteen parts into the space left in your sea. Keep the stone with the rest of its essence.',
            [recover(15), item(key(partlyDrawn), 1),
                note('mixed_sea', 'Your sea is full again. You have thirty-nine parts of your original essence and five stronger parts condensed by the Liquor Worm.')],
            {needs: [condensed, eq(sea, 24)], reserve: [stoneCost(1)], costs: [item(stone, -1)]})
    ]
};

export async function registerGuLeadAssessment(register, base) {
    if(!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_DORM && e.revision === 1 && e.contentHash === dormHash)) return null;
    return register.extension(guLeadAssessment, base);
}
