import {keeperVitality as id, keeperVitalityLeaf, leafGrowthMinutes} from './book_gu_keeper_gardens.js';
import {vitalityGrass, vitalityLeaf} from '../gu_vitality_grass.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const health = amount => ({type: 'vital', actor: 'player', key: 'health', amount});
const stock = (key, amount = 1) => ge(`item.${key}`, amount);
const water = kKey('vitality_garden.water');
const fuel = kKey('vitality_garden.red_steel');
const stone = kKey('stone');
const plot = eq(`completed.${id}.clear_briars`);
const leaf = keeperVitalityLeaf;

function command(operation, label, description, {needs = [], costs = [], effects = [], once} = {}) {
    return {id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: kId('world'), location: kId('annex'), actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, ...needs), costs, effects, ...(once && {once})};
}

function garden(operation, label, description, {needs = [], costs = [], effects = []} = {}) {
    return command(operation, label, description, {
        needs: [eq(`${id}.can_${operation}`), ...needs], costs,
        effects: [{type: 'guPropagate', actor: 'player', operation}, ...effects],
    });
}

export const guKeeperVitality = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Grow Nine Leaf Vitality Grass',
    description: 'Borrow the clan’s rank-two plant. Nurture leaves in daylight, then pluck them to use or sell.',
    requires: ready, reason: 'Visit the Gu house.',
    items: [
        {id: `${id}.water`, label: 'Cistern water', value: 0, description: 'One measure of clean water for the grass.'},
        {id: `${id}.red_steel`, label: 'Stored red-steel essence', value: 0, description: 'Measured rank-two essence for the grass.'},
        {id: `${id}.leaf`, label: 'Vitality leaf', value: 0, description: 'A detached rank-one healing Gu. It is spent on use.'},
    ],
    commands: [
        garden('borrow_grass', 'Borrow the clan’s Nine Leaf Vitality Grass', 'Take the same living plant into your care.'),
        garden('return_grass', 'Return the vitality grass', 'Leaves on the stem stay with the plant. Plucked leaves stay in your bag.'),
        command('clear_briars', 'Clear briars from the cistern path · 6 health',
            'Push through the thorns to open the path. Their scratches cost six health.', {
                once: true, needs: [ge('vital.health', 7)], costs: [health(-6)],
            }),
        command('draw_water', 'Draw water from the cistern', 'Fill a jar for the next growth.', {
            needs: [plot], effects: [item(water, 1)],
        }),
        command('draw_briar_water', 'Reach through the briars for water · 6 health',
            'Draw from the upper cistern without clearing its thorny bank.', {
                needs: [ge('vital.health', 7)], costs: [health(-6)], effects: [item(water, 1)],
            }),
        command('buy_red_steel', 'Buy four measures of red-steel essence · 1 stone',
            'The steward sells enough stored essence to grow two leaves.', {
                needs: [stock(stone)], costs: [item(stone, -1)], effects: [item(fuel, 4)],
            }),
        garden('grow_leaf', 'Nurture a vitality leaf · 1 water, 2 red steel',
            `Grow one leaf during daylight, between 06:00 and 18:00. Let the stem settle for ${leafGrowthMinutes} minutes before growing another.`, {
                needs: [stock(water, vitalityGrass.waterCost), stock(fuel, vitalityGrass.essenceCost)],
                costs: [item(water, -vitalityGrass.waterCost), item(fuel, -vitalityGrass.essenceCost)],
            }),
        garden('harvest_leaf', 'Pluck a leaf from the stem', 'The detached healing Gu goes into your bag.'),
        command('sell_leaf', 'Sell a vitality leaf · receive 2 stones', 'The steward pays for one plucked leaf.', {
            needs: [stock(leaf)], costs: [item(leaf, -1)], effects: [item(stone, 2)],
        }),
        garden('treat_leaf', 'Treat your wound with a vitality leaf',
            `Spend one leaf to restore ${vitalityLeaf.health} health. Wait an hour before using another.`, {
                needs: [stock(leaf)], costs: [item(leaf, -1)], effects: [health(vitalityLeaf.health)],
            }),
    ],
};

export async function registerGuKeeperVitality(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperVitality, base);
    }
}
