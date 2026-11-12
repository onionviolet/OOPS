import {keeperSeven as id, sevenConversion, sevenMinutes} from '../gu_keeper_seven.js';
import {keeperFourFlavors, keeperTrailWine, keeperWildWorld} from '../gu_keeper_wild.js';
import {keeperRedSteel} from '../gu_keeper_red_steel.js';
import {hostedWolf, hostedWolfGlade} from '../gu_hosted_wolf.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = fact => ({fact, op: 'eq', value: true});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all({fact: 'actor.life', op: 'eq', value: 'alive'}, eq('native.ready'), eq('native.alive'),
    ...['body.ownerId', 'body.controllerId'].map(fact => ({fact, op: 'eq', value: 'player'})));
const stock = (key, value = 1) => ({fact: `item.${key}`, op: 'gte', value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const spices = kKey('seven_fragrances.spices');
const silver = kKey('seven_fragrances.middle_silver');
const stone = kKey('stone');

function command(operation, label, description, {needs = [], costs = [], effects = [], location = kId('annex')} = {}) {
    return {id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperWildWorld, location, actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, ...needs), costs, effects};
}
function act(operation, label, description, {needs = [], ...options} = {}) {
    return command(operation, label, description, {...options, needs: [eq(`${id}.can_${operation}`), ...needs],
        effects: [{type: 'guWild', actor: 'player', operation}]});
}
export const guKeeperSeven = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperFourFlavors, keeperRedSteel, hostedWolf],
    label: 'Refine the Seven Fragrances Liquor Worm',
    description: 'Use your Four Flavors Worm and a second one from the steward. Seven distinct spices prepare the next fusion.',
    requires: ready, reason: 'Take up Four Flavors, red-steel refinement and the lightning wolf trail.',
    items: [
        {id: `${id}.spices`, label: 'Seven-spice tray', value: 0, description: 'Seven distinct spices for one fusion.'},
        {id: `${id}.middle_silver`, label: 'Middle-stage white-silver essence', value: 0, description: 'Stored rank-three essence.'},
    ],
    commands: [
        command('buy_spices', 'Buy a seven-spice tray · 2 stones', 'The tray holds seven different spices.', {
            needs: [stock(stone, 2)], costs: [item(stone, -2)], effects: [item(spices, 1)],
        }),
        act('prepare_seven', 'Prepare Seven Fragrances with both Worms', `Spend the spices and bind the Worms for ${sevenMinutes} minutes.`, {
            needs: [stock(spices)], costs: [item(spices, -1)],
        }),
        act('finish_seven', 'Finish the Seven Fragrances fusion', 'The two bound Worms become one rank-three Gu.'),
        act('cancel_seven', 'Stop the Seven Fragrances fusion', 'Both Worms survive. The prepared spices have been used.'),
        act('feed_seven', 'Feed Seven Fragrances a jar of wine', 'Feed the Worm before concentrating essence.', {
            needs: [stock(keeperTrailWine)], costs: [item(keeperTrailWine, -1)],
        }),
        command('buy_silver', 'Buy four middle-stage white-silver measures · 1 stone', 'Prepare a batch for Seven Fragrances.', {
            needs: [stock(stone)], costs: [item(stone, -1)], effects: [item(silver, sevenConversion.cost)],
        }),
        act('concentrate_silver', 'Concentrate white-silver essence with Seven Fragrances', 'Convert four middle-stage measures into two upper-stage measures.', {
            needs: [stock(silver, sevenConversion.cost)], costs: [item(silver, -sevenConversion.cost)],
        }),
        act('cast_seven', 'Strike with Thunderclap · 2 upper white silver', 'Use the stored essence with the Thunderclap from the wolf.', {
            location: hostedWolfGlade,
        }),
    ],
};
export async function registerGuKeeperSeven(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) await register.bundledInstantExtension(guKeeperSeven, base);
}
