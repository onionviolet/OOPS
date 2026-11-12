import {keeperFourFlavors as id, keeperWildWorld, keeperWormEssence} from '../gu_keeper_wild.js';
import {fourFlavorsWines} from '../gu_liquor_worm.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const learned = eq(extensionFact(keeperWormEssence));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const wineId = flavor => `${id}.${flavor}_wine`;
const wineKey = flavor => JSON.stringify({id: wineId(flavor)});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});

function command(name, label, needs, costs, effects, description = '') {
    return {
        id: `${id}.${name}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperWildWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, learned, ...needs), costs, effects,
    };
}

export const guKeeperFourFlavors = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperWormEssence],
    label: 'Refine the Four Flavors Liquor Worm',
    description: 'A visiting refiner supplies the stones for the fusion. Bring two ready Liquor Worms and one jar of each of the four wines.',
    requires: all(ready, learned),
    reason: 'Learn to feed and work with the wild Liquor Worm first.',
    items: fourFlavorsWines.map(({flavor, label}) => ({id: wineId(flavor), label, value: 0,
        description: `A jar of ${flavor} wine for the Four Flavors fusion.`})),
    commands: [
        ...fourFlavorsWines.map(({flavor, label}) => command(`buy_${flavor}`, `Buy ${label} · 1 stone`,
            [ge(`item.${kKey('stone')}`, 1)], [item(kKey('stone'), -1)], [item(wineKey(flavor), 1)])),
        command('fuse_four', 'Fuse the two Liquor Worms with four wines',
            [eq(`${id}.can_fuse_four`), ge(`item.${kKey('worm_gu')}`, 1),
                ...fourFlavorsWines.map(({flavor}) => ge(`item.${wineKey(flavor)}`, 1))],
            [item(kKey('worm_gu'), -1), ...fourFlavorsWines.map(({flavor}) => item(wineKey(flavor), -1))],
            [{type: 'guWild', actor: 'player', operation: 'fuse_four'}],
            'The refiner runs the sour, sweet, bitter and spicy stages in order. Success uses up both original Gu and all four jars.'),
    ],
};

export async function registerGuKeeperFourFlavors(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperFourFlavors, base);
    }
}
