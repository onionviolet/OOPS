// Reverend Insanity setting, original adult clan-sponsored Gu keeper, first year (books 1-4 economy rows).
// Every number below is an authored dial for a first-rank life, not a canon table: aptitude cap, regeneration,
// stipend, prices, meals and the refinement odds. Ranks above the first need unread blocks and are not modelled.
// Upkeep rows come from the living_upkeep seam; the pack adds ownership, prices, the stipend and one refinement.
import {compileUpkeepEvents, compileStandingOrder} from '../living_upkeep.js';
import {guWorkRows} from '../companion_work_gu.js';
import {keeperMoveSet} from '../gu_keeper_moves.js';
import {KEEPER_DAY, KEEPER_PREFIX, kId, kKey} from './book_gu_keeper_ids.js';
import {declareRegistrationAdditions} from '../content_packs.js';
export {KEEPER_DAY, KEEPER_PREFIX, kId, kKey};
const id = kId, key = kKey, steward = id('steward');
// Dials. The sea is 24 units at a full aperture; aptitude 50% caps it at 12; regeneration is one unit an hour.
export const KEEPER_DIALS = Object.freeze({fullSea: 24, aptitudePercent: 50, capacity: 12, regenPerHour: 1, startStones: 3, startEssence: 8,
    hungerKills: false, workWeakInjuryOdds: {fine: 2, hurt: 1}, stipendStones: 6, stipendDays: 7, stipendWeeks: 52, choreMinutes: 120, choreStones: 1, fuseOdds: {success: 3, failure: 2}, fuseInjury: 2,
    apertureRank: 1, vialGrade: 2, vialPrice: 3});
// species: [slot, label, food slot, food label, perMeal, intervalDays, stone price, refined meal]
export const KEEPER_GU = [
    {slot: 'moon', label: 'Moonlight Gu', food: 'petals', foodLabel: 'Moon Orchid petals', perMeal: 4, days: 1, price: 0, refinedMeal: 3, bundle: 8, bundlePrice: 1, yield: 1,
        alt: {food: 'dried', foodLabel: 'dried petals', perMeal: 6, bundle: 12, bundlePrice: 1},
        use: {fn: 'cut', path: 'moon', rank: 1, essence: 1, base: {magnitude: 1, range: 1, duration: 0, targets: 1}, line: 'Throws a palm-sized moonblade.', locator: 'Reverend Insanity ch70'}},
    {slot: 'worm', label: 'Liquor Worm Gu', food: 'lees', foodLabel: 'jars of spirit lees', perMeal: 1, days: 2, price: 4, bundle: 4, bundlePrice: 1, yield: 1,
        use: {fn: 'condense', path: null, rank: 1, essence: 1, line: 'Refines essence in the aperture; no move in this house calls for it yet.'}},
    {slot: 'jade', label: 'White Jade Gu', food: 'jade', foodLabel: 'raw jade shards', perMeal: 1, days: 3, price: 6, bundle: 1, bundlePrice: 1, yield: 2,
        use: {fn: 'guard', path: null, rank: 1, essence: 1, augment: {kind: 'guard', add: {magnitude: 1}}, line: 'Covers you in jade skin, so you can step in and finish what you cut.'}},
    // GKM5 calibration (ch62: the clan store keeps Little Light Gu as the Moonlight Gu's common assistant; ch106 "easy to replenish").
    // Its food and price are keeper dials: the text names neither.
    {slot: 'light', label: 'Little Light Gu', food: 'moss', foodLabel: 'tufts of lamp moss', perMeal: 1, days: 1, price: 2, bundle: 4, bundlePrice: 1, yield: 1,
        use: {fn: 'brighten', path: 'light', rank: 1, essence: 1, augment: {kind: 'brighten', scale: {magnitude: 2, range: 2}, stacks: false}, line: 'Feeds its glow into a moonblade: twice the size and reach. A second one adds nothing.', locator: 'Reverend Insanity ch70, ch106'}},
    // GKM13: a rank-two Gu a first-rank keeper can still drive, at a cost (ch106: a Moonglow Gu's moonblade is three times a
    // Moonlight Gu's). It eats the same petals; meal size and price are keeper dials.
    {slot: 'glow', label: 'Moonglow Gu', food: 'petals', foodLabel: 'Moon Orchid petals', perMeal: 6, days: 1, price: 12, bundle: 8, bundlePrice: 1, yield: 2,
        use: {fn: 'cut', path: 'moon', rank: 2, essence: 1, base: {magnitude: 3, range: 1, duration: 0, targets: 1}, line: 'Throws a face-sized moonblade, three times a Moonlight Gu’s.', locator: 'Reverend Insanity ch106, ch108, ch114'}}
];
export const keeperDiets = KEEPER_GU.map(g => ({holder: id(g.slot), label: g.label, food: key(g.food), foodLabel: g.foodLabel, perMeal: g.perMeal, interval: g.days * KEEPER_DAY, maxCondition: 4,
    flag: id(`${g.slot}_kept`), lethal: KEEPER_DIALS.hungerKills, resetFlags: [id(`${g.slot}_kept.worked`)], ...(g.alt ? {alt: {food: key(g.alt.food), foodLabel: g.alt.foodLabel, perMeal: g.alt.perMeal}} : {}), ...(g.refinedMeal ? {refinedFlag: id(`${g.slot}_refined`), refinedPerMeal: g.refinedMeal} : {})}));

const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const ge = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});
const le = (fact, value) => ({fact, op: 'lte', value});
const all = (...rules) => ({all: rules});
const because = (rule, reason) => ({...rule, reason});
const note = (n, value) => ({type: 'knowledge', actor: 'player', key: id(n), stage: 'understood', value});
const item = (n, amount, actor) => ({type: 'item', key: key(n), amount, ...(actor ? {actor} : {})});
const flag = (n, value, actor) => ({type: 'fact', scope: 'actor', key: id(n), value, ...(actor ? {actor} : {})});
const essence = output => ({type: 'energy', energyId: id('primeval'), operation: 'use', output, control: 1});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'), eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const faculty = eq(`faculty.${id('aperture')}.active`, true, 'Your opened aperture must be available.');
const cmd = (n, label, extra = {}) => ({id: id(n), revision: 1, label, group: 'structured_local', worldId: id('world'), actorId: 'player', location: id('annex'), audience: ['$actor'], requires: ready, costs: [], effects: [], ...extra});
const gu = g => id(g.slot);
const owned = g => all(ready, faculty, eq(`claim.${id(g.slot + '_title')}.owner`, 'player'), eq('target.life', 'alive'), eq('target.body.controllerId', 'player'));

// Items added after the first saved registrations (2026-11-12/13 Gu batches). Naming them lets an older save's registration
// update in place; a later item added to this pack goes on this list too, or older saves stop loading. Declared beside the
// definition, not in it: every keeper continuation pins this definition's content hash.
export const KEEPER_ITEM_ADDITIONS = Object.freeze([id('moss'), id('vial'), id('light_gu'), id('glow_gu')]);
declareRegistrationAdditions(KEEPER_PREFIX, {itemIds: [...KEEPER_ITEM_ADDITIONS]});
export const guKeeperLife = {
    schema: 2, id: KEEPER_PREFIX, revision: 1, title: 'Reverend Insanity · Gu keeper, first year',
    description: 'Keep Gu on a clan stipend: feed each on its own schedule, buy more only when you can afford them, and risk one refinement.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['native-stock', 'jobs'],
    world: {id: id('world'), label: 'Reverend Insanity · original keeper life'},
    locations: [{id: id('annex'), label: 'Clan Gu house', underRoof: true, description: 'An original clan Gu house for an adult sponsored novice. Your opened Rank-one aperture is a starting grant; this is not Fang Yuan’s life or an earned awakening.'}],
    sources: [{id: id('aperture'), revision: 1, label: 'Opened Rank-one aperture', kind: 'trait', origin: 'acquired', grants: [], bioDetail: `Declared starting means. Aptitude ${KEEPER_DIALS.aptitudePercent}% caps the primeval sea at ${KEEPER_DIALS.capacity} of ${KEEPER_DIALS.fullSea} units; it regenerates ${KEEPER_DIALS.regenPerHour} unit an hour. Authored dials, not a canon grade table.`}],
    items: [
        ['stone', 'Primeval stone', 'Money and fuel in one: the clan pays your stipend in stones and sells food and Gu for them.'],
        ['petals', 'Moon Orchid petal', 'Food for a Moonlight Gu.'], ['dried', 'Dried petal', 'Poorer food for a Moonlight Gu: it ends hunger but does not heal.'], ['lees', 'Jar of spirit lees', 'Food for a Liquor Worm Gu.'], ['jade', 'Raw jade shard', 'Food for a White Jade Gu.'], ['moss', 'Tuft of lamp moss', 'Food for a Little Light Gu (a keeper’s dial: the text does not say what it eats).'],
        ['vial', 'Sealed vial of red steel essence', 'Stored rank-two primeval essence, enough to drive a rank-two Gu once without the gap your own first-rank essence would pay.'],
        ...KEEPER_GU.map(g => [g.slot + '_gu', g.label + ' · carrier', `The titled carrier of one living ${g.label}. Its body is separate and can starve.`])
    ].map(([n, label, description]) => ({id: id(n), label, description, value: 1})),
    units: KEEPER_GU.map(g => ({id: id(g.slot + '_unit'), titleOwner: steward, titleRecipients: ['player'], titleClaimId: id(g.slot + '_title'), keys: [key(g.slot + '_gu')]})),
    starts: [{id: id('start'), locationId: id('annex'), description: `You are an adult clan-sponsored novice with an opened Rank-one aperture, ${KEEPER_DIALS.startStones} primeval stones and a weekly stipend. The clan Gu house holds a Moonlight Gu issued free, a Liquor Worm Gu and a White Jade Gu for sale.`,
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult', hands: 2, mobile: true},
        effects: [{type: 'source', sourceId: id('aperture'), operation: 'grant', origin: 'acquired', awakened: true, active: true},
            {type: 'energy', energyId: id('primeval'), operation: 'learn'}, {type: 'energy', energyId: id('primeval'), operation: 'recover', amount: KEEPER_DIALS.startEssence},
            item('stone', KEEPER_DIALS.startStones), item('petals', 8),
            ...KEEPER_GU.flatMap(g => [item(g.slot + '_gu', 1, steward), {type: 'claim', actor: steward, key: id(g.slot + '_title'), operation: 'acquire'}, flag(g.slot + '_kept', false, gu(g)), flag(g.slot + '_refined', false, gu(g)), ...(g.refinedMeal ? [flag(g.slot + '_resents', false, gu(g))] : []), flag(g.slot + '_kept.fed', false, gu(g)), flag(g.slot + '_kept.worked', false, gu(g)), flag('auto_' + g.slot, false), flag('order_' + g.slot, 'none')]),
            note('stipend_known', `The clan pays ${KEEPER_DIALS.stipendStones} primeval stones every ${KEEPER_DIALS.stipendDays} days for ${KEEPER_DIALS.stipendWeeks} weeks. Stones are both money and fuel; this is an authored first-year agreement.`),
            note('gu_known', 'Gu are living. Each has its own food and meal schedule; a missed meal costs one point of condition and a Gu at condition 1 is starved out: it cannot work until fed again, but a keeper’s Gu does not die of hunger (a dial: the clan’s unheld Gu and other people’s still can). Taking in more Gu than you can feed is allowed.')]
    }],
    simulation: {
        people: [
            {id: steward, revision: 1, label: 'Clan steward', worldId: id('world'), location: id('annex'), inventory: 'simulation', provision: false,
                body: {id: id('steward_body'), ownerId: steward, controllerId: steward, form: 'human', hands: 2, mobile: true}, vitals: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}},
            ...KEEPER_GU.map(g => ({id: gu(g), revision: 1, label: g.label, worldId: id('world'), location: id('annex'), inventory: 'simulation', provision: false,
                body: {id: id(g.slot + '_body'), ownerId: gu(g), controllerId: gu(g), form: 'gu', mobile: true}, vitals: {health: 4, max_health: 4, stamina: 1, max_stamina: 1}}))
        ],
        energies: [{id: id('primeval'), revision: 1, label: 'Rank-one primeval essence', capacity: KEEPER_DIALS.capacity, output: 1, control: 1, efficiencyNumerator: 1, efficiencyDenominator: 1, strainLimit: 0, strainPerUse: 0}],
        powers: [], conditions: [], commands: [], events: []
    },
    abilities: [],
    presentation: {people: {[steward]: {introductionKnowledgeKey: id('stipend_known')}, ...Object.fromEntries(KEEPER_GU.map(g => [id(g.slot), {introductionKnowledgeKey: id('gu_known')}]))}, status: ['stipend_known', 'gu_known', 'purchase', 'fusion', 'chore', 'work', 'km_last'].map(n => ({id: id(n + '_status'), label: {stipend_known: 'Stipend', gu_known: 'Gu care', purchase: 'Latest purchase', fusion: 'Latest refinement', chore: 'Latest chore', work: 'Latest Gu work', km_last: 'Latest move'}[n], knowledgeKey: id(n)}))}
};
const S = guKeeperLife.simulation;
for(const g of KEEPER_GU) {
    const titleOwner = all(eq(`claim.${id(g.slot + '_title')}.held`), eq(`claim.${id(g.slot + '_title')}.owner`, steward, 'You already took this Gu in.'), eq('target.body.controllerId', gu(g)));
    S.commands.push(cmd('take_' + g.slot, `Take in a ${g.label}${g.price ? ` · ${g.price} stones` : ' · issued free'}, 1 essence`, {targetId: gu(g), coLocated: true, participants: ['$target', steward], once: true,
        requires: because(all(ready, faculty, titleOwner, ...(g.price ? [ge(`item.${key('stone')}`, g.price)] : []), ge(`energy.${id('primeval')}.reserve`, 1)), `You need ${g.price ? g.price + ' primeval stones, ' : ''}1 essence and a Gu the clan still holds; the clan does not lend against the stipend.`), description: `Refine the clan's ${g.label} to your control: it eats ${g.perMeal} ${g.foodLabel} every ${g.days} day${g.days > 1 ? 's' : ''} for as long as it lives, and holding it does not wait on whether you can feed it.`,
        costs: [essence(1), ...(g.price ? [{type: 'transfer', from: 'player', to: steward, key: key('stone'), count: g.price}] : [])],
        effects: [{type: 'transfer', from: steward, to: 'player', key: key(g.slot + '_gu'), count: 1}, {type: 'claim', actor: steward, key: id(g.slot + '_title'), operation: 'transfer', target: 'player'},
            {type: 'body', actor: gu(g), key: 'controllerId', value: 'player'}, flag(g.slot + '_kept', true, gu(g)), note('purchase', `${g.label} is now in your care.`)]}));
    const feedBatch = g.perMeal * 2;
    S.commands.push(cmd('feed_' + g.slot, `Feed the ${g.label}: ${feedBatch} ${g.foodLabel}`, {targetId: gu(g), coLocated: true, participants: ['$target'], requires: because(all(owned(g), ge(`item.${key(g.food)}`, feedBatch)), `You need this Gu in your care and ${feedBatch} ${g.foodLabel} in your bag; buy some from the steward.`),
        description: `Move ${feedBatch} ${g.foodLabel} into its larder, enough for two meals. It eats at its own boundary; this spends no essence.`,
        costs: [{type: 'transfer', from: 'player', to: gu(g), key: key(g.food), count: feedBatch}],
        // CPR10 tie consumer: a refined (tied) Gu that was pushed hungry holds it against you until you feed it.
        ...(g.refinedMeal ? {effects: [flag(g.slot + '_resents', false, gu(g))]} : {})}));
    if(!S.commands.some(c => c.id === id('buy_' + g.food))) S.commands.push(cmd('buy_' + g.food, `Buy ${g.bundle} ${g.foodLabel} · ${g.bundlePrice} stone`, {targetId: steward, coLocated: true, participants: ['$target'], requires: because(all(ready, ge(`item.${key('stone')}`, g.bundlePrice)), `You need ${g.bundlePrice} primeval stone for this.`),
        description: `The steward sells ${g.bundle} ${g.foodLabel} for ${g.bundlePrice} primeval stone.`, costs: [{type: 'transfer', from: 'player', to: steward, key: key('stone'), count: g.bundlePrice}],
        effects: [item(g.food, g.bundle), note('purchase', `You bought ${g.bundle} ${g.foodLabel}.`)]}));
    // Slice: what a Gu is for. One working per meal window; condition sets how well it goes (4-3 sound, 2 works through at risk, 1 starved out).
    // One gate for the hand verb and the standing work order (CPR15): care (condition), the tie (a resentful bound Gu refuses), the window and essence.
    const workGate = condition => all(owned(g), condition, eq(`target.actor.${id(g.slot + '_kept.worked')}`, false), ge(`energy.${id('primeval')}.reserve`, 1), ...(g.refinedMeal ? [eq(`target.actor.${id(g.slot + '_resents')}`, false)] : []));
    const workBase = (suffix, label, condition, extra) => cmd(`work_${g.slot}${suffix}`, label, {targetId: gu(g), coLocated: true, participants: ['$target'],
        requires: because(workGate(condition),
            `You need this Gu in your care at the right condition, not yet worked this meal window, and 1 essence. A starved-out Gu (condition 1) must eat first.${g.refinedMeal ? ' A refined Gu that was pushed hungry will not work for you until you feed it.' : ''}`),
        costs: [essence(1)], ...extra});
    S.commands.push(workBase('', `Put the ${g.label} to work · 1 essence, ${g.yield} stone${g.yield > 1 ? 's' : ''}`, ge('target.vital.health', 3), {description: `A sound Gu does its clan work once per meal window: ${g.yield} primeval stone${g.yield > 1 ? 's' : ''} for 1 essence.`,
        effects: [item('stone', g.yield), flag(g.slot + '_kept.worked', true, gu(g)), note('work', `The ${g.label} did its work: ${g.yield} stone${g.yield > 1 ? 's' : ''}.`)]}));
    // A refined Gu is a tied being (CPR10): working it hungry is something it remembers, so it takes a separate command that sets
    // `_resents` (cleared by feeding it). An unrefined Gu is held, has no mind to resent, and keeps the plain command.
    for(const bound of g.refinedMeal ? [false, true] : [false]) {
        const sfx = bound ? '_bound' : '', mark = bound ? [flag(g.slot + '_resents', true, gu(g))] : [];
        const gate = g.refinedMeal ? [eq(`target.actor.${id(g.slot + '_refined')}`, bound)] : [];
        S.commands.push(workBase('_weak' + sfx, `Work the hungry ${g.label} anyway · 1 essence, ${g.yield} stone${g.yield > 1 ? 's' : ''}, ${bound ? 'it will resent it' : 'risk of harm'}`, all(ge('target.vital.health', 2), {fact: 'target.vital.health', op: 'lte', value: 2}, ...gate),
            {description: `At condition 2 the Gu works through hunger: the same pay, but it may be hurt for one point. It cannot be hurt below condition 1; feed it instead if you can.${bound ? ' A refined Gu holds it against you: it will not work again until you feed it.' : ''}`,
            outcomes: [{id: id(`work_${g.slot}_fine${sfx}`), weight: KEEPER_DIALS.workWeakInjuryOdds.fine, effects: [item('stone', g.yield), flag(g.slot + '_kept.worked', true, gu(g)), ...mark, note('work', `The hungry ${g.label} got through its work.`)]},
                {id: id(`work_${g.slot}_hurt${sfx}`), weight: KEEPER_DIALS.workWeakInjuryOdds.hurt, effects: [item('stone', g.yield), flag(g.slot + '_kept.worked', true, gu(g)), ...mark, {type: 'vital', actor: gu(g), key: 'health', amount: -1}, note('work', `The hungry ${g.label} finished its work and was hurt; it is starved out until it eats.`)]}]}));
    }
    // Standing work order (CPR15, FRC55): the same gate at the sound floor, on the Gu's own window after it eats; plus give back and take back (CPR18).
    const work = guWorkRows(g, {ids: id, keys: key, worldId: id('world'), location: id('annex'), interval: g.days * KEEPER_DAY, energy: id('primeval'), note: t => note('work', t), steward, ready, faculty, flag,
        gate: workGate(ge('target.vital.health', 3)), assignGate: all(ready, eq(`claim.${id(g.slot + '_title')}.owner`, 'player'), eq('target.life', 'alive'))});
    S.commands.push(...work.commands); S.events.push(...work.events);
    // Standing feed order: your bag tops up the larder one meal at each boundary while you have the food.
    S.commands.push(cmd(`order_${g.slot}_on`, `Set a standing feed order for the ${g.label}`, {requires: because(all(ready, eq(`claim.${id(g.slot + '_title')}.owner`, 'player'), eq(`actor.${id('auto_' + g.slot)}`, false)), 'Take this Gu in first, and it must not already have an order.'),
        description: `At each meal boundary one meal of ${g.foodLabel} moves from your bag to its larder if you hold it. When your bag runs out the order does nothing and the Gu goes hungry on its normal schedule.`, effects: [flag('auto_' + g.slot, true)]}));
    S.commands.push(cmd(`order_${g.slot}_off`, `Cancel the standing feed order for the ${g.label}`, {requires: because(all(ready, eq(`actor.${id('auto_' + g.slot)}`, true)), 'There is no standing order to cancel.'), effects: [flag('auto_' + g.slot, false)]}));
    S.events.push(compileStandingOrder(keeperDiets.find(d => d.holder === gu(g)), {worldId: id('world'), actorId: 'player', orderFlag: id('auto_' + g.slot), ids: id}));
    if(g.alt) S.commands.push(cmd('buy_' + g.alt.food, `Buy ${g.alt.bundle} ${g.alt.foodLabel} · ${g.alt.bundlePrice} stone`, {targetId: steward, coLocated: true, participants: ['$target'], requires: because(all(ready, ge(`item.${key('stone')}`, g.alt.bundlePrice)), `You need ${g.alt.bundlePrice} primeval stone for this.`),
        description: `Poorer food: the ${g.label} eats ${g.alt.perMeal} ${g.alt.foodLabel} when its main food is short. It stops it getting hungrier but does not heal it.`, costs: [{type: 'transfer', from: 'player', to: steward, key: key('stone'), count: g.alt.bundlePrice}],
        effects: [item(g.alt.food, g.alt.bundle), note('purchase', `You bought ${g.alt.bundle} ${g.alt.foodLabel}.`)]}));
    if(g.alt) S.commands.push(cmd('feed_' + g.alt.food, `Feed the ${g.label} poorer food: ${g.alt.perMeal * 2} ${g.alt.foodLabel}`, {targetId: gu(g), coLocated: true, participants: ['$target'], requires: because(all(owned(g), ge(`item.${key(g.alt.food)}`, g.alt.perMeal * 2)), `You need this Gu in your care and ${g.alt.perMeal * 2} ${g.alt.foodLabel} in your bag.`),
        description: 'Fill the larder with the poorer food for two meals.', costs: [{type: 'transfer', from: 'player', to: gu(g), key: key(g.alt.food), count: g.alt.perMeal * 2}]}));
    for(const row of compileUpkeepEvents(keeperDiets.find(d => d.holder === gu(g)), {worldId: id('world'), ids: id, note: (text) => note('care_notice', text)})) S.events.push(row);
}
// Work for stones, a stipend event, the aperture's passive regeneration.
const timed = (duration, support) => ({duration, cancellation: 'refund', reservationReturns: 1, completionRequires: support, completionCoLocated: true, completionFailure: 'refund'});
S.commands.push(cmd('chores', `Do clan Gu house chores · ${KEEPER_DIALS.choreMinutes} min, ${KEEPER_DIALS.choreStones} stone`, {...timed(KEEPER_DIALS.choreMinutes, ready),
    description: `Sweep and haul for the steward for ${KEEPER_DIALS.choreMinutes} played minutes and earn ${KEEPER_DIALS.choreStones} primeval stone. Cancelling pays nothing.`,
    effects: [item('stone', KEEPER_DIALS.choreStones), note('chore', `The steward paid ${KEEPER_DIALS.choreStones} stone for the chores.`)]}));
S.commands.push(cmd('rest', 'Sit and gather essence · 60 min, up to 3 units', {requires: all(ready, faculty, le(`energy.${id('primeval')}.reserve`, KEEPER_DIALS.capacity - 1)), ...timed(60, all(ready, faculty)),
    description: 'Deliberate recovery on top of the aperture’s passive regeneration. The cap is your aptitude; resting cannot lift it.', effects: [{type: 'energy', energyId: id('primeval'), operation: 'recover', amount: 3}]}));
S.events.push({id: id('stipend'), revision: 1, label: 'Clan stipend', worldId: id('world'), actorId: steward, interval: KEEPER_DIALS.stipendDays * KEEPER_DAY, maxOccurrences: KEEPER_DIALS.stipendWeeks, automatic: true, mode: 'ambient', chance: 1, public: true,
    requires: null, effects: [item('stone', KEEPER_DIALS.stipendStones, 'player'), note('stipend_paid', `The clan paid your ${KEEPER_DIALS.stipendStones}-stone stipend.`)]});
S.events.push({id: id('regen'), revision: 1, label: 'Aperture regeneration', worldId: id('world'), actorId: 'player', interval: 60, automatic: true, mode: 'ambient', chance: 1, public: false,
    // Automatic checks are seeded for every enrolled player, so this must name the keeper's own aperture: another world's player has no primeval energy to recover.
    requires: faculty, effects: [{type: 'energy', energyId: id('primeval'), operation: 'recover', amount: KEEPER_DIALS.regenPerHour}]});
// Slice 3: a fusion whose failure injures the Gu. Requires condition 3+ and injures by 2, so it can never kill.
const moon = KEEPER_GU[0];
S.commands.push(cmd('fuse', 'Steep the Moonlight Gu in spirit lees · 2 jars, 1 essence', {targetId: gu(moon), coLocated: true, participants: ['$target'],
    requires: because(all(owned(moon), ge('target.vital.health', 3), eq(`target.actor.${id('moon_refined')}`, false)), 'You need the Moonlight Gu in your care at condition 3 or better, not yet refined, 2 jars of lees and 1 essence.'),
    description: `A deliberate refinement. Success hardens the Gu so it eats ${moon.refinedMeal} petals a meal instead of ${moon.perMeal}. Failure injures it by ${KEEPER_DIALS.fuseInjury} condition; it never kills, because you cannot start below condition 3. The lees are used up either way.`,
    costs: [essence(1), item('lees', -2)],
    outcomes: [{id: id('fuse_ok'), weight: KEEPER_DIALS.fuseOdds.success, effects: [flag('moon_refined', true, gu(moon)), note('fusion', 'The Moonlight Gu took the refinement: it is hardier and eats less.')]},
        {id: id('fuse_bad'), weight: KEEPER_DIALS.fuseOdds.failure, effects: [{type: 'vital', actor: gu(moon), key: 'health', amount: -KEEPER_DIALS.fuseInjury}, note('fusion', `The refinement failed. The Moonlight Gu is injured, not dead; feed it to recover.`)]}]}));
// GKM14 stored route: the steward sells sealed vials of rank-two essence (price a keeper dial).
S.commands.push(cmd('buy_vial', `Buy a sealed vial of red steel essence · ${KEEPER_DIALS.vialPrice} stones`, {targetId: steward, coLocated: true, participants: ['$target'],
    requires: because(all(ready, ge(`item.${key('stone')}`, KEEPER_DIALS.vialPrice)), `You need ${KEEPER_DIALS.vialPrice} primeval stones for this.`),
    description: 'Stored rank-two essence, drawn off by a rank-two master for the clan. One vial drives a rank-two Gu once at its own grade.',
    costs: [{type: 'transfer', from: 'player', to: steward, key: key('stone'), count: KEEPER_DIALS.vialPrice}], effects: [item('vial', 1), note('purchase', 'You bought a sealed vial of red steel essence.')]}));
// GKM1/GKM5: Gu abilities and killer moves, composed from the uses above (gu_keeper_moves.js).
export const KEEPER_MOVES = keeperMoveSet({gu: KEEPER_GU, id, key, worldId: id('world'), location: id('annex'), ready, faculty, userGrade: KEEPER_DIALS.apertureRank, vialGrade: KEEPER_DIALS.vialGrade});
S.commands.push(...KEEPER_MOVES.commands);
