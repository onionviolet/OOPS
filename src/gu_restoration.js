import {destroyGuClaim} from './gu_world_claims.js';

export function markedGu(world) {
    return world?.gu.find(gu => gu.id === world.destructionMark?.specimen);
}

export function armGuDestruction(world, {specimen, now, delay}) {
    const gu = world.gu.find(row => row.id === specimen);
    if (world.destructionMark || !gu?.alive || !gu.uniqueKey ||
        !Number.isSafeInteger(now) || now < 0 || !Number.isSafeInteger(delay) || delay < 1 ||
        !Number.isSafeInteger(now + delay)) throw Error('The destructive mark needs a living Immortal Gu and a valid time.');
    return {...world, gu: world.gu.map(row => row.id === specimen ? {...row, injured: true} : row),
        destructionMark: {specimen, armedAt: now, dueAt: now + delay, status: 'pending'}};
}

export function settleGuDestruction(world, now) {
    const mark = world?.destructionMark;
    if (mark?.status !== 'pending' || now < mark.armedAt) return world;
    const gu = markedGu(world);
    if (!gu?.alive) {
        return {...world, destructionMark: {...mark, status: 'lost', endedAt: now}};
    }
    if (now < mark.dueAt) return world;
    const next = destroyGuClaim(world, {key: gu.uniqueKey, holder: gu.holder});
    return {...next, destructionMark: {...mark, status: 'detonated', endedAt: mark.dueAt}};
}

export function stabilizeGuDestruction(world, {specimen, now}) {
    const mark = world?.destructionMark;
    if (mark?.status !== 'pending' || mark.specimen !== specimen || !markedGu(world)?.alive ||
        !Number.isSafeInteger(now) || now < mark.armedAt || now >= mark.dueAt) throw Error('The marked Gu is no longer within reach.');
    return {...world, destructionMark: {...mark, status: 'stabilized', endedAt: now}};
}
