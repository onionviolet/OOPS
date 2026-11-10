// Volume one, chapters 23–24. The prior inn deposit is an immutable event;
// retrieve_worm releases that same specimen. The dorm is part of the academy
// location for this command-only continuation, so earlier save pins still match.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_MOONBLADE} from './book_gu_lead_moonblade.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_DORM = id('dorm');
const dorm = name => `${GU_LEAD_DORM}.${name}`;
const key = id => JSON.stringify({id});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const moonbladeHash = 'sha256:96ea5a02b7c201fd6f706dec30e173bf7529d5a6d152438bb9c5c4cf61f987df';
const world = id('world');
const academy = id('academy');
const elder = id('academy_elder');
const essence = id('primeval');
const stone = key(`${GU_LEAD_REFINEMENT}.primeval_stone`);
const wine = key(`${GU_LEAD_VITAL}.bamboo_wine`);
const worm = key(`${GU_LEAD_VITAL}.refined_liquor_worm`);
const petals = key(dorm('petals'));
const classDay = 3 * 1440;
const petalsPerBag = 10;
const petalsPerMeal = 2;
const remainingMeals = 5;
const homework = `${GU_LEAD_MOONBLADE}.homework`;
const supervised = {targetId: elder, coLocated: true, participants: ['$target']};

const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const done = name => eq(`completed.${dorm(name)}`);
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const stock = (key, value, reason) => ({fact: `item.${key}`, op: 'gte', value, reason});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: dorm(name), stage: 'understood', value});
const admitted = eq(extensionFact(GU_LEAD_DORM));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`, true, 'You need to be able to move your primeval essence.'));
const predecessor = all(eq(extensionFact(GU_LEAD_MOONBLADE)), eq(`completed.${GU_LEAD_MOONBLADE}.hear_homework`));
const hasCrescent = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead', 'Keep your refined Moonlight Gu with you.');
const hasWorm = eq(`item.${worm}`, 1, 'Bring the Liquor Worm back from the inn first.');
const innDeposit = eq(`actor.${GU_LEAD_VITAL}.worm_custody`, 'inn_bed', 'You left the worm in your room at the inn.');
// Absent item facts read as zero in the simulation rule evaluator.
const noWormInBag = {fact: `item.${worm}`, op: 'lte', value: 0, reason: 'The Liquor Worm is already with you.'};
const stoneCost = amount => stock(stone, amount, `You need ${amount} primeval ${amount === 1 ? 'stone' : 'stones'}.`);
const petalCost = amount => stock(petals, amount, `You need ${amount} Moon Orchid petals for these meals.`);

function act(name, label, duration, previous, description, effects, {needs = [], reserve = [], costs = [], ...extra} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, eq('actor.location', academy), ...needs);
    return {
        id: dorm(name), revision: 1, label, description, group: 'structured_local',
        worldId: world, actorId: 'player', location: academy, audience: ['$actor'], once: true,
        duration, visibleWhen, requires: {...all(support, ...reserve), reason: reserve[0]?.reason || 'Finish the earlier step and stay at the academy.'},
        completionRequires: support,
        completionCoLocated: true, cancellation: 'refund', completionFailure: 'refund',
        reservationReturns: 1, costs, effects, ...extra
    };
}

export const guLeadDorm = {
    schema: 1, id: GU_LEAD_DORM, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan’s room at the academy',
    description: 'Move to the dormitory, feed your Gu, and return to class for the Moonblade assessment.',
    requires: all(ready, predecessor, hasCrescent, innDeposit, eq('actor.location', academy)),
    reason: 'Hear the elder set the Moonblade homework. Keep your Moonlight Gu with you and leave the Liquor Worm at the inn.',
    items: [{id: dorm('petals'), label: 'Moon Orchid petal',
        description: 'Two petals make a meal for your Moonlight Gu. They keep for five days without special storage.', value: 0}],
    status: [
        {id: dorm('room_status'), label: 'Your room', knowledgeKey: dorm('room')},
        {id: dorm('wine_status'), label: 'The inn’s green bamboo wine', knowledgeKey: dorm('wine_order')},
        {id: dorm('care_status'), label: 'Feeding your Gu', knowledgeKey: dorm('care')},
        {id: dorm('lesson_status'), label: 'Close-combat lesson', knowledgeKey: dorm('footwork')},
        {id: dorm('assessment_status'), label: 'Moonblade assessment', knowledgeKey: dorm('assessment')}
    ],
    commands: [
        act('buy_petals', 'Pass on the puppet and buy petals', 5, predecessor,
            'Jiang Ya offers the last grass puppet for three primeval stones. Keep your money for food. Pay one stone for a paper bag of ten Moon Orchid petals.',
            [item(petals, petalsPerBag)],
            {reserve: [stoneCost(1)], costs: [item(stone, -1)]}),
        act('retrieve_worm', 'Move from the inn to the academy dormitory', 20, done('buy_petals'),
            'Go back for your things. Take the Liquor Worm from the corner of the inn bed and bring it into your aperture before leaving for the dormitory.',
            [item(worm, 1), note('room', 'You have moved from the inn to the academy dormitory. The Liquor Worm is with you again.')],
            {needs: [innDeposit, noWormInBag]}),
        act('buy_wine_meal', 'Order supper and a jar of green bamboo wine', 30, done('retrieve_worm'),
            'Eat at the inn and take a sealed jar back with you. Hand over three primeval stones, including two for the wine, and leave the change against your bill.',
            [item(wine, 1), note('wine_order', 'The inn worker says the caravan will buy green bamboo wine when it comes. He expects little to be left on the shelves.')],
            {reserve: [stoneCost(3)], costs: [item(stone, -3)]}),
        act('stock_wine', 'Have five jars delivered to the dormitory', 20, done('buy_wine_meal'),
            'Pay ten primeval stones for five more jars before the caravan comes. The inn workers can carry them to your room.',
            [item(wine, 5), note('wine_order', 'The inn workers put five sealed jars under your bed. That brought the order to six jars, including the one you took back from supper.')],
            {reserve: [stoneCost(10)], costs: [item(stone, -10)]}),
        act('first_meal', 'Feed your Gu in the dormitory', 5, done('stock_wine'),
            'Give the Moonlight Gu two petals. Open one jar for the Liquor Worm and set that jar aside for its four days of feeding.',
            [note('care', 'Your Moonlight Gu has had its first meal here. The Liquor Worm has started on its four-day jar. The opened jar is set aside, and the sealed jars remain in stock.')],
            {needs: [hasCrescent, hasWorm], reserve: [petalCost(petalsPerMeal), stock(wine, 1, 'You need a sealed jar of green bamboo wine.')],
                costs: [item(petals, -petalsPerMeal), item(wine, -1)]}),
        act('top_up_petals', 'Buy a second bag of petals', 5, done('first_meal'),
            'Eight petals will cover four more meals. Buy ten fresh petals for one stone to cover the full stretch before the assessment.',
            [item(petals, petalsPerBag)],
            {reserve: [stoneCost(1)], costs: [item(stone, -1)]}),
        act('keep_meals', 'Keep up the meals until assessment day', classDay, done('first_meal'),
            'Set aside ten petals for five more meals, two each morning and evening. The Liquor Worm has enough wine in the jar you opened. Let your primeval sea refill. If you stop, time passed still counts and the set-aside petals return.',
            [{type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount: 44},
                note('care', 'You have kept the Moonlight Gu fed for the three days before the assessment. The opened jar has covered the Liquor Worm through the same stretch. Your primeval sea is full again.')],
            {needs: [hasCrescent, hasWorm], reserve: [petalCost(remainingMeals * petalsPerMeal)],
                costs: [item(petals, -remainingMeals * petalsPerMeal)], durationSinceKnowledge: homework}),
        act('watch_footwork', 'Watch the instructor’s footwork', 15, done('keep_meals'),
            'Stay with the lesson while the other pupils talk about Moonblades. Watch the instructor duck a swinging fist and topple a taller wooden puppet at the hips.',
            [note('footwork', 'Watch the shoulders for the first motion. Keep your feet under you, move out of reach, and take the other fighter off balance when you close in.')]),
        act('line_up', 'Line up for the Moonblade assessment', 10, done('watch_footwork'),
            'Join the line beside the bamboo wall. The elder calls five pupils at a time to throw three Moonblades each. Watch the groups ahead of you.',
            [note('assessment', 'Mo Bei and Chi Cheng both land three blades. The elder praises them both. In the next groups, Fang Zheng steps up to the practice line.')],
            supervised)
    ]
};

let installed;
export async function registerGuLeadDorm(register, base) {
    installed = null;
    if(!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_MOONBLADE && e.revision === 1 && e.contentHash === moonbladeHash)) return null;
    installed = await register.extension(guLeadDorm, base);
    return installed;
}

export function guLeadDormClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if(!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_DORM);
    if(!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId === dorm('keep_meals'));
    if(!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= classDay ? Math.min(120, remaining) : null;
}
