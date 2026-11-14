// Fang Yuan's ordinary day (lead core-flow audit, ordinary-day round, 2026-11-14; proposal under AD32, ACR1, LVR13, LVR18, LVR19).
// A command extension on his own life, so no pinned hash moves: an old save adopts it like any continuation. The day: feed each Gu
// when its meal comes due, buy its food with stones, draw a stone into the sea, hand in wolf eyes, exchange merit, and go out on a
// wolf-tide patrol and report what came out of the trees (a seeded draw: pack size, finds, a wild Gu, an injury, a wolf attack).
// A hungry Moonglow will not cut, so a skipped meal blocks the patrol that pays for the next ones. His sea also refills on its own
// (ri_lead_sea_domain.js). Registered as a bundled continuation because the report is an instant with seeded outcomes.
// Meal timing is read from ri_lead_day_facts.js (the needs seam); diets, prices and yields live there with their basis.
import {extensionFact} from '../structured_pack_extensions.js';
import {formatDuration} from '../number_format.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_RANK_TWO} from './book_gu_lead_rank_two.js';
import {RI_LEAD_DAY as DAY_ID, RI_DAY_ITEMS as IT, RI_DAY_DIETS, RI_DAY_DIALS as K, RI_PATROL_ENCOUNTERS, RI_WOLF_AT_WALL as WOLF, riSeaMinutesPerPart} from '../ri_lead_day_facts.js';

export const GU_LEAD_DAY = DAY_ID;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const world = id('world');
const academy = id('academy');
const essence = id('primeval');
const local = name => `${GU_LEAD_DAY}.${name}`;
const all = (...rules) => ({all: rules});
const eq = (fact, value, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const key = item => JSON.stringify({id: item});
const has = (item, value, reason) => ({fact: `item.${key(item)}`, op: 'gte', value, reason});
const item = (it, amount) => ({type: 'item', actor: 'player', key: key(it), amount});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: name, stage: 'understood', value});
const spend = output => ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output, control: 1});
const ready = all(eq('actor.life', 'alive'), eq('native.ready', true), eq('native.alive', true),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile', true));
const admitted = eq(extensionFact(GU_LEAD_DAY), true);
const at = eq('actor.location', academy, 'Go back to the clan academy; the dormitory and the village stalls are there.');
const fact = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const out = eq(local('on_watch'), true), notOut = eq(local('on_watch'), false, 'Report to the board first; your last watch is not counted yet.');
const unhurt = eq(local('hurt'), false, 'Your wound needs binding and rest before another watch.');
const noWolf = eq(local('wolf_waiting'), false, 'A wolf is still at the wall from your last watch. Face it or let the watch drive it off first.');
const seaPace = `Your sea also refills on its own, one part every ${formatDuration(riSeaMinutesPerPart(44))} at your C grade (ch10).`;

function act(name, label, duration, description, effects, {needs = [], costs = [], parts = 0} = {}) {
    const support = all(ready, admitted, at);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: false, duration, visibleWhen: admitted,
        requires: all(support, ...needs, ...(parts ? [{fact: `energy.${essence}.reserve`, op: 'gte', value: parts, reason: `You need ${parts} parts of essence in your sea.`}] : [])),
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: parts ? [...costs, spend(parts)] : costs, effects
    };
}
const stones = n => has(IT.stone, n, `You need ${n} primeval stone${n === 1 ? '' : 's'}.`);
const payStones = n => item(IT.stone, -n);
const feed = d => act(`feed_${d.slot}`, `Feed the ${d.label} · ${d.perMeal === 1 ? 'one' : d.perMeal} ${d.foodLabel}`, 5,
    `${d.basis} Feeding early is refused: it eats when its meal comes due, and a missed meal leaves it hungry until you feed it.`,
    [note(d.fed, `The ${d.label} has eaten. ${d.slot === 'moonglow' ? 'It will want petals again this evening or tomorrow morning.' : d.slot === 'worm' ? 'The jar will last it four days.' : 'That parcel lasts it twenty days.'}`)],
    {needs: [has(d.gu, 1, `You do not hold the ${d.label}.`), eq(`${GU_LEAD_DAY}.${d.slot}.due`, true, `The ${d.label} ate recently and will not take more yet.`),
        has(d.food, d.perMeal, `You need ${d.perMeal === 1 ? 'one' : d.perMeal} ${d.foodLabel}.`)], costs: [item(d.food, -d.perMeal)]});
const moonglow = RI_DAY_DIETS.find(d => d.slot === 'moonglow');

export const guLeadDay = {
    schema: 1, id: GU_LEAD_DAY, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Keep your own day: feed your Gu, draw stones, earn merit',
    description: `Between the clan's errands, your Gu still eat on their own clocks and your sea still empties. Buy their food, keep them fed, refill your essence and earn battle merit on the wolf tide. ${seaPace}`,
    requires: all(ready, eq(extensionFact(GU_LEAD_RANK_TWO), true)),
    reason: 'Reach Rank Two first.',
    items: [{id: IT.jade, label: 'Jade rock · eight liang', description: 'One meal for a White Jade Gu, which eats eight liang every twenty days.', value: 0},
        {id: IT.wildGu, label: 'Wild Gu · unrefined', description: 'A small wild Gu found under the wall on patrol. It is not yours until refined.', value: 0}],
    status: [...RI_DAY_DIETS.map(d => ({id: local(`${d.slot}_status`), label: d.label, knowledgeKey: d.fed})), {id: local('patrol_status'), label: 'Last watch', knowledgeKey: local('patrol')}],
    commands: [
        ...RI_DAY_DIETS.map(feed),
        act('buy_petals', `Buy a bag of Moon Orchid petals · ${K.petalBag.count} for ${K.petalBag.stones} stone`, 20,
            `Walk to the village stalls. ${K.petalBag.why} Petals keep about five days.`,
            [item(IT.petals, K.petalBag.count), note(local('bought'), `You bought ${K.petalBag.count} Moon Orchid petals for ${K.petalBag.stones} stone.`)],
            {needs: [stones(K.petalBag.stones)], costs: [payStones(K.petalBag.stones)]}),
        act('buy_wine', `Buy a jar of green bamboo wine · ${K.wineJar.stones} stones`, 20, `Buy a sealed jar at the tavern. ${K.wineJar.why}`,
            [item(IT.wine, 1), note(local('bought'), `You bought a jar of green bamboo wine for ${K.wineJar.stones} stones.`)],
            {needs: [stones(K.wineJar.stones)], costs: [payStones(K.wineJar.stones)]}),
        act('buy_jade', `Buy eight liang of jade rock · ${K.jadeParcel.stones} stones`, 30, `Buy a parcel from the stone dealer. ${K.jadeParcel.why}`,
            [item(IT.jade, 1), note(local('bought'), `You bought eight liang of jade rock for ${K.jadeParcel.stones} stones.`)],
            {needs: [stones(K.jadeParcel.stones)], costs: [payStones(K.jadeParcel.stones)]}),
        act('draw_stone', `Draw a whole primeval stone into your sea · 1 stone, up to ${K.stoneParts.parts} parts`, K.stoneParts.minutes,
            `Hold a stone and draw its essence into the empty part of your sea. ${K.stoneParts.why} Essence your sea cannot hold stays lost with the spent stone. ${seaPace}`,
            [{type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount: K.stoneParts.parts},
                note(local('drawn'), 'You drew a primeval stone dry and your sea rose.')],
            {needs: [stones(1)], costs: [payStones(1)]}),
        act('hand_in_eye', `Put a hidden wolf eye on the alliance board · +${K.eyeMerit.merit} merit`, 10, `${K.eyeMerit.why} A hidden eye earns nothing until it is handed in.`,
            [item(IT.merit, K.eyeMerit.merit), note(local('merit'), `The board credits you ${K.eyeMerit.merit} merit for a lightning wolf eye.`)],
            {needs: [has(IT.eye, 1, 'You have no hidden wolf eye left.')], costs: [item(IT.eye, -1)]}),
        act('exchange_merit', `Exchange ${K.meritPerStone.merit} battle merit for a primeval stone`, 10, K.meritPerStone.why,
            [item(IT.stone, 1), note(local('merit'), `You traded ${K.meritPerStone.merit} merit for a primeval stone.`)],
            {needs: [has(IT.merit, K.meritPerStone.merit, `You need ${K.meritPerStone.merit} battle merit.`)], costs: [item(IT.merit, -K.meritPerStone.merit)]}),
        act('patrol', `Go out on a wolf-tide patrol · ${K.patrol.minutes / 60} h, up to ${K.patrol.parts} parts`, K.patrol.minutes,
            `Walk the outer wall with the clan's patrol and cut down what comes out of the trees. ${K.patrol.why} The Moonglow does the cutting, so it has to be fed. Report to the board afterwards to have the night counted.`,
            [fact('patrol_out', true), note(local('patrol'), 'You walked the wall until the wolves drew back. Report to the board to have the night counted.')],
            {needs: [has(moonglow.gu, 1, 'You need the Moonglow Gu to cut with.'), eq(`${GU_LEAD_DAY}.moonglow.hungry`, false, 'Your Moonglow Gu is hungry and will not cut. Feed it first.'), notOut, unhurt, noWolf],
                parts: K.patrol.parts}),
        {id: local('report'), revision: 1, label: 'Report the watch to the alliance board', group: 'structured_local', worldId: world, actorId: 'player', location: academy,
            audience: ['$actor'], once: false, duration: 0, visibleWhen: admitted,
            description: 'The board clerk counts what the night brought. What came out of the trees is settled now, from the watch you walked.',
            requires: all(ready, admitted, at, {...out, reason: 'Walk a patrol first.'}),
            outcomes: RI_PATROL_ENCOUNTERS.map(r => ({id: local(`patrol.${r.id}`), weight: r.weight, effects: [
                fact('patrol_out', false), ...(r.merit ? [item(IT.merit, r.merit)] : []), note(local('patrol'), r.line),
                ...(r.back ? [{type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount: r.back}] : []),
                ...(r.eyes ? [item(IT.eye, r.eyes)] : []), ...(r.wildGu ? [item(IT.wildGu, r.wildGu)] : []),
                ...(r.injured ? [fact('injured', true)] : []), ...(r.fight ? [fact('last_fight', r.id), fact('wolf_at_wall', true)] : [])]}))},
        {id: local('drive_off'), revision: 1, label: `Let the watch drive the wolf off · +${WOLF.driveOffMerit} merit, a bite`, group: 'structured_local', worldId: world,
            actorId: 'player', location: academy, audience: ['$actor'], once: false, duration: 0, visibleWhen: admitted,
            description: 'Call the watch and drive the wolf back into the trees together instead of facing it yourself. The credit is shared, and it bites you on the way out.',
            requires: all(ready, admitted, at, eq(local('wolf_waiting'), true, 'No wolf is waiting at the wall.')),
            effects: [fact('wolf_at_wall', false), fact('injured', true), item(IT.merit, WOLF.driveOffMerit),
                note(local('patrol'), `The watch drove the wolf back into the trees. It bit you on the way. ${WOLF.driveOffMerit} merit on the board, shared.`)]},
        act('rest_wound', `Bind your wound and rest · ${K.patrol.restMinutes / 60} h`, K.patrol.restMinutes,
            'Clean the cut, bind it and keep off the wall until it closes.',
            [fact('injured', false), note(local('patrol'), 'The cut has closed. You can take a watch again.')],
            {needs: [eq(local('hurt'), true, 'You are not hurt.')]})
    ]
};

export async function registerGuLeadDay(register, base) {
    if(!register.bundledInstantExtension || base.contentHash !== baseHash) return null;
    return register.bundledInstantExtension(guLeadDay, base);
}
