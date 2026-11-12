import {stableId} from './simulation_ids.js';

export function livingGuClaim(world, key) {
    return world.gu.find(gu => gu.alive && gu.uniqueKey === key);
}

export function validateGuClaims(world) {
    if (!world || !Array.isArray(world.gu) || !Array.isArray(world.attempts) || !world.stocks ||
        new Set(world.gu.map(gu => gu.id)).size !== world.gu.length) throw Error('Invalid Gu world ledger.');
    const live = new Set();
    for (const gu of world.gu) {
        if (!stableId(gu.id) || !stableId(gu.kind) || !stableId(gu.holder) || !Number.isSafeInteger(gu.rank) ||
            gu.rank < 1 || typeof gu.alive !== 'boolean' || gu.uniqueKey !== undefined && !stableId(gu.uniqueKey) ||
            gu.vitalMaster !== undefined && !stableId(gu.vitalMaster) ||
            gu.alive && gu.uniqueKey && live.has(gu.uniqueKey)) throw Error('Invalid living Gu claim.');
        if (gu.alive && gu.uniqueKey) live.add(gu.uniqueKey);
    }
    return world;
}

function ownedClaim(world, key, holder) {
    const gu = livingGuClaim(world, key);
    if (gu?.holder !== holder) throw Error('You do not hold the living Gu claim.');
    return gu;
}

export function transferGuClaim(world, {key, from, to}) {
    const gu = ownedClaim(world, key, from);
    if (!stableId(to) || to === from) throw Error('Choose a different keeper for the living Gu.');
    return {...world, gu: world.gu.map(row => row.id === gu.id ? {...row, holder: to} : row)};
}

export function destroyGuClaim(world, {key, holder}) {
    const gu = ownedClaim(world, key, holder);
    return {...world, gu: world.gu.map(row => row.id === gu.id ? {...row, alive: false, fate: 'destroyed'} : row)};
}
