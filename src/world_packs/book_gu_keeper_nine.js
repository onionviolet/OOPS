import {keeperNine as id, nineConversion, nineFarBank, nineSettleMinutes, nineHoldMinutes, crashCost, crashCut} from './book_gu_keeper_lines.js';
import {keeperSeven} from './book_gu_keeper_lines.js';
import {keeperTrailWine, keeperWildWorld} from '../gu_keeper_wild.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = fact => ({fact, op: 'eq', value: true});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all({fact: 'actor.life', op: 'eq', value: 'alive'}, eq('native.ready'), eq('native.alive'),
    ...['body.ownerId', 'body.controllerId'].map(fact => ({fact, op: 'eq', value: 'player'})));
const stock = (key, value = 1) => ({fact: `item.${key}`, op: 'gte', value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const move = location => ({type: 'relocate', actor: 'player', location});
const annex = kId('annex');
const stone = kKey('stone');
const gold = kKey('nine_eyes.initial_gold');
const lots = [
    {id: 'ridge', label: 'Ridge hunters’ eyes', description: 'Three eyes from a ridge boar, crag ram and iron bear king.'},
    {id: 'marsh', label: 'Marsh traders’ eyes', description: 'Three eyes from a river crocodile, fen tortoise and reed serpent king.'},
    {id: 'forest', label: 'Forest hunters’ eyes', description: 'Three eyes from an ash ape, dusk leopard and stone jackal king.'},
];
const lotKey = lot => kKey(`nine_eyes.${lot.id}`);
const can = operation => eq(`${id}.can_${operation}`);

function command(operation, label, description, {needs = [], costs = [], effects = [], location = annex} = {}) {
    return {id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperWildWorld, location, actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, ...needs), costs, effects};
}
function act(operation, label, description, {needs = [], after = [], ...options} = {}) {
    return command(operation, label, description, {...options, needs: [can(operation), ...needs],
        effects: [{type: 'guWild', actor: 'player', operation}, ...after]});
}

export const guKeeperNine = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash}, dependsOn: [keeperSeven],
    label: 'Refine the Nine Eyes Liquor Worm',
    description: 'The steward can buy a second Seven Fragrances Worm and order eyes from three suppliers.',
    requires: all(ready, can('buy_second')), reason: 'First raise a Seven Fragrances Liquor Worm.',
    locations: [{id: nineFarBank, label: 'Far bank of the practice cut', underRoof: false,
        description: 'The steward’s supply crate stands where the cut narrows into a footpath.'}],
    items: [...lots.map(lot => ({...lot, id: `${id}.${lot.id}`, value: 0})),
        {id: `${id}.initial_gold`, label: 'Initial-stage yellow-gold essence', value: 0, description: 'Stored rank-four essence.'}],
    commands: [
        command('buy_second', 'Buy the second Seven Fragrances Worm · 2 stones', 'The market Worm stays in your care for the fusion.', {
            needs: [can('buy_second'), stock(stone, 2)], costs: [item(stone, -2)],
        }),
        ...lots.map(lot => command(`buy_${lot.id}`, `Buy ${lot.label.toLowerCase()} · 1 stone`, lot.description, {
            needs: [stock(stone)], costs: [item(stone, -1)], effects: [item(lotKey(lot), 1)],
        })),
        act('prepare_nine', 'Prepare Nine Eyes with both Worms', `Use all nine eyes. Tend the fusion after ${nineSettleMinutes} minutes and before ${nineHoldMinutes}.`, {
            needs: lots.map(lot => stock(lotKey(lot))), costs: lots.map(lot => item(lotKey(lot), -1)),
        }),
        act('settle_nine', 'Tend the Nine Eyes fusion', 'Join the Worms while the prepared eyes still hold their warmth.'),
        act('cancel_nine', 'Call off the Nine Eyes fusion', 'The Worms survive. The prepared eyes are spent.'),
        act('feed_nine', 'Feed Nine Eyes a jar of wine', 'Feed the Worm before improving the yellow-gold essence.', {
            needs: [stock(keeperTrailWine)], costs: [item(keeperTrailWine, -1)],
        }),
        command('buy_gold', 'Buy four initial yellow-gold measures · 1 stone', 'Store a batch of rank-four essence.', {
            needs: [stock(stone)], costs: [item(stone, -1)], effects: [item(gold, nineConversion.cost)],
        }),
        act('concentrate_gold', 'Improve yellow-gold essence with Nine Eyes', 'Four initial measures become two middle-stage measures.', {
            needs: [stock(gold, nineConversion.cost)], costs: [item(gold, -nineConversion.cost)],
        }),
        act('test_initial', `Try Charging Crash uphill · ${crashCost} initial gold`, 'Borrow the steward’s Gu and measure its reach on the approach.', {
            needs: [stock(gold, crashCost)], costs: [item(gold, -crashCost)],
        }),
        act('cross_cut', `Cross with Charging Crash · ${crashCost} middle gold`,
            `Borrow the steward’s Gu and cover the ${crashCut} paces to the far bank.`, {after: [move(nineFarBank)]}),
        command('collect', 'Recover the steward’s supply crate', 'Bring it back to the path and claim the three-stone reward.', {
            location: nineFarBank, needs: [can('collect')], effects: [item(stone, 3)],
        }),
        command('return', 'Walk back to the Gu house', 'Follow the longer footpath.', {location: nineFarBank, effects: [move(annex)]}),
    ],
};

export async function registerGuKeeperNine(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) await register.bundledInstantExtension(guKeeperNine, base);
}
