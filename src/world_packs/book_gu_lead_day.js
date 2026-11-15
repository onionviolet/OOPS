// Fang Yuan's ordinary day (lead core-flow audit, ordinary-day round, 2026-11-14; proposal under AD32, ACR1, LVR13, LVR18, LVR19).
// A command extension on his own life, so no pinned hash moves: an old save adopts it like any continuation. The day: feed each Gu
// when its meal comes due, buy its food with stones, draw a stone into the sea, hand in wolf eyes, exchange merit, and go out on a
// wolf-tide patrol and report what came out of the trees (a seeded draw: pack size, finds, a wild Gu, an injury, a wolf attack).
// A night yields wolf parts, not merit (Weibao 2026-11-14): eyes and watch tallies are paid in merit at the alliance board, the only
// merit writer (GU_LEAD_DAY_BOARD, PS3); hides and fresh meat sell for stones; meat spoils (RI_MEAT_NOTE).
// A hungry Moonglow will not cut, so a skipped meal blocks the patrol that pays for the next ones. His sea also refills on its own
// (ri_lead_sea_domain.js). Registered as a bundled continuation because the report is an instant with seeded outcomes.
// Meal timing is read from ri_lead_day_facts.js (the needs seam); diets, prices and yields live there with their basis.
import {extensionFact} from '../structured_pack_extensions.js';
import {formatDuration} from '../number_format.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_RANK_TWO} from './book_gu_lead_rank_two.js';
import {RI_LEAD_DAY as DAY_ID, RI_DAY_ITEMS as IT, RI_DAY_DIETS, RI_DAY_DIALS as K, RI_PATROL_ENCOUNTERS, RI_WOLF_AT_WALL as WOLF, RI_WOLF_PART_ITEMS, RI_MEAT_NOTE, riSeaMinutesPerPart} from '../ri_lead_day_facts.js';
import {riWolfParts} from '../ri_wolf_tide.js';

export const GU_LEAD_DAY = DAY_ID;
// The commands that write battle merit: the alliance board's hand-ins, nothing else (PS3; tests/ri_lead_day.test.js counts them).
export const GU_LEAD_DAY_BOARD = Object.freeze([`${DAY_ID}.hand_in_eye`, `${DAY_ID}.hand_in_tally`]);
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
// What a reported night brings back (PS2, RWT1): the dead wolves' parts from the one wolf table (ri_wolf_tide.js riWolfParts, by size),
// only the parts a carcass still has (`keep`), and no more than one man carries (RI_DAY_DIALS.carry). Exported for the one-source test.
export function patrolYield(row) {
    const got = {};
    for(let i = 0; i < (row.wolves || 0); i++) for(const [part, n] of Object.entries(riWolfParts({large: i < (row.large || 0)})))
        if(!row.keep || row.keep.includes(part)) got[part] = (got[part] || 0) + n;
    return Object.fromEntries(Object.entries(got).map(([part, n]) => [part, Math.min(n, K.carry[part] ?? n)]).filter(([, n]) => n > 0));
}
const words = {eye: n => `${n === 1 ? 'an eye' : `${n} eyes`}`, pelt: n => `${n === 1 ? 'a hide' : `${n} hides`}`, meat: n => `${n} jin of meat`};
const broughtBack = (got, tallies) => {
    const list = [...Object.entries(got).map(([part, n]) => words[part](n)), ...(tallies ? [tallies === 1 ? 'a watch tally' : `${tallies} watch tallies`] : [])];
    return list.length ? ` Brought back: ${list.join(', ')}.` : '';
};
const meatFresh = v => eq(local('meat_fresh'), v, v ? 'The meat has spoiled. Nobody will buy it; throw it out.' : 'The meat is still fresh. Sell it before it turns.');

export const guLeadDay = {
    schema: 1, id: GU_LEAD_DAY, revision: 3,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Keep your own day: feed your Gu, draw stones, trade wolf parts for merit',
    description: `Between the clan's errands, your Gu still eat on their own clocks and your sea still empties. Buy their food, keep them fed, refill your essence, and bring wolf parts back from the wolf tide to trade at the board and the stalls. ${seaPace}`,
    requires: all(ready, eq(extensionFact(GU_LEAD_RANK_TWO), true)),
    reason: 'Reach Rank Two first.',
    items: [{id: IT.jade, label: 'Jade rock · eight liang', description: 'One meal for a White Jade Gu, which eats eight liang every twenty days.', value: 0},
        {id: IT.wildGu, label: 'Wild Gu · unrefined', description: 'A small wild Gu found under the wall on patrol. It is not yours until refined.', value: 0},
        {id: IT.pelt, label: 'Lightning wolf hide', description: `A wolf's hide from the wall. ${K.peltSale.why}`, value: 0},
        {id: IT.meat, label: 'Wolf meat · jin', description: 'Meat from a wolf killed at the wall, by the jin. It keeps about three days, then nobody will buy it.', value: 0},
        {id: IT.tally, label: 'Watch tally', description: `A marked bamboo slip from the watch captain for a kill you shared. ${K.tallyMerit.why}`, value: 0}],
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
        act('hand_in_eye', `Hand a wolf eye in at the alliance board · +${K.eyeMerit.merit} merit`, 10, `${K.eyeMerit.why} An eye earns nothing until it is handed in; one you keep back stays yours to hide or refine with.`,
            [item(IT.merit, K.eyeMerit.merit), note(local('merit'), `The board credits you ${K.eyeMerit.merit} merit for a lightning wolf eye.`)],
            {needs: [has(IT.eye, 1, 'You have no wolf eye to hand in.')], costs: [item(IT.eye, -1)]}),
        act('hand_in_tally', `Hand a watch tally in at the alliance board · +${K.tallyMerit.merit} merit`, 5, K.tallyMerit.why,
            [item(IT.merit, K.tallyMerit.merit), note(local('merit'), `The board credits you ${K.tallyMerit.merit} merit for a watch tally.`)],
            {needs: [has(IT.tally, 1, 'You have no watch tally to hand in.')], costs: [item(IT.tally, -1)]}),
        act('sell_pelt', `Sell a wolf hide at the village stalls · ${K.peltSale.stones} stones`, 15, K.peltSale.why,
            [item(IT.stone, K.peltSale.stones), note(local('sold'), `The leather seller paid ${K.peltSale.stones} primeval stones for a lightning wolf hide.`)],
            {needs: [has(IT.pelt, 1, 'You have no wolf hide to sell.')], costs: [item(IT.pelt, -1)]}),
        act('sell_meat', `Sell ${K.meatSale.jin} jin of wolf meat to the village kitchens · ${K.meatSale.stones} stone`, 15, `${K.meatSale.why} Only fresh meat sells; it keeps about three days from the night you brought it back.`,
            [item(IT.stone, K.meatSale.stones), note(local('sold'), `The kitchens paid a primeval stone for ${K.meatSale.jin} jin of wolf meat.`)],
            {needs: [has(IT.meat, K.meatSale.jin, `You need ${K.meatSale.jin} jin of wolf meat.`), meatFresh(true)], costs: [item(IT.meat, -K.meatSale.jin)]}),
        act('throw_meat', `Throw out ${K.meatSale.jin} jin of spoiled wolf meat`, 5, 'The meat has turned. The village dogs get it.',
            [note(local('sold'), `You threw ${K.meatSale.jin} jin of spoiled wolf meat to the village dogs.`)],
            {needs: [has(IT.meat, K.meatSale.jin, `You hold less than ${K.meatSale.jin} jin of wolf meat.`), meatFresh(false)], costs: [item(IT.meat, -K.meatSale.jin)]}),
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
            outcomes: RI_PATROL_ENCOUNTERS.map(r => ({r, got: patrolYield(r)})).map(({r, got}) => ({id: local(`patrol.${r.id}`), weight: r.weight, effects: [
                fact('patrol_out', false), note(local('patrol'), `${r.line}${broughtBack(got, r.tallies)}`),
                ...Object.entries(got).map(([part, n]) => item(RI_WOLF_PART_ITEMS[part], n)), ...(r.tallies ? [item(IT.tally, r.tallies)] : []),
                ...(got.meat ? [note(RI_MEAT_NOTE, `You carried ${got.meat} jin of wolf meat back from the wall.`)] : []),
                ...(r.back ? [{type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount: r.back}] : []),
                ...(r.wildGu ? [item(IT.wildGu, r.wildGu)] : []),
                ...(r.injured ? [fact('injured', true)] : []), ...(r.fight ? [fact('last_fight', r.id), fact('wolf_at_wall', true)] : [])]}))},
        {id: local('drive_off'), revision: 1, label: 'Let the watch drive the wolf off · a watch tally, a bite', group: 'structured_local', worldId: world,
            actorId: 'player', location: academy, audience: ['$actor'], once: false, duration: 0, visibleWhen: admitted,
            description: 'Call the watch and drive the wolf back into the trees together instead of facing it yourself. A wolf that runs leaves no parts; the captain gives you a tally for standing in it, and it bites you on the way out.',
            requires: all(ready, admitted, at, eq(local('wolf_waiting'), true, 'No wolf is waiting at the wall.')),
            effects: [fact('wolf_at_wall', false), fact('injured', true), item(WOLF.tally, 1),
                note(local('patrol'), 'The watch drove the wolf back into the trees. It bit you on the way. The captain gave you a watch tally for the board.')]},
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
