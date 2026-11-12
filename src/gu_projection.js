import {resolveGuActivation} from './gu_activation.js';
import {stableId} from './simulation_ids.js';

// The host authorizes the time-path method and supplies the resolved state
// of the River of Time. A projection carries capabilities and borrowed fuel.
// It never adds a specimen to the world's living Gu collection.
export function beginGuProjection({anchor, operator, now, duration, rankLimit, profile}) {
    if (!stableId(anchor) || !stableId(operator) || !Number.isSafeInteger(now) || now < 0 ||
        !Number.isSafeInteger(duration) || duration < 1 || !Number.isSafeInteger(now + duration) ||
        !Number.isSafeInteger(rankLimit) || !Number.isSafeInteger(profile.rank) ||
        profile.rank < 1 || profile.rank > rankLimit) {
        throw Error('This state is outside the time-path move’s reach.');
    }
    const seen = new Set();
    for (const {kind, rank} of profile.capabilities) {
        if (!stableId(kind) || seen.has(kind) || !Number.isSafeInteger(rank) || rank < 1 || rank > rankLimit) {
            throw Error('Invalid projected Gu capability.');
        }
        seen.add(kind);
    }
    return structuredClone({
        anchor, operator, startsAt: now, expiresAt: now + duration,
        rank: profile.rank, capabilities: profile.capabilities, reserves: profile.reserves,
    });
}

// Capture one witnessed state. The host supplies the authentic specimen and
// operator reserve when the milestone happens, using its own custody records.
export function recordGuMilestone({id, operator, at, gu, ability, reserves}) {
    if (!stableId(id) || !stableId(operator) || !Number.isSafeInteger(at) || at < 0 ||
        !(stableId(gu?.id) || Number.isSafeInteger(gu?.id) && gu.id > 0) || !gu.alive || gu.holder !== operator ||
        !stableId(gu.kind) || !Number.isSafeInteger(gu.rank) || gu.rank < 1 || gu.wildWill ||
        !Number.isSafeInteger(gu.fedThrough) || gu.fedThrough < at || gu.injured ||
        !stableId(ability?.fuel) || !Number.isFinite(ability.cost) || ability.cost <= 0 ||
        !Number.isFinite(reserves?.[ability.fuel]) || reserves[ability.fuel] < 0) {
        throw Error('Witness a ready Gu under your control to mark its state.');
    }
    const capability = {kind: gu.kind, rank: gu.rank, ability, ...(gu.traits && {traits: gu.traits})};
    return structuredClone({id, operator, at, specimen: gu.id, capability,
        reserves: {[ability.fuel]: reserves[ability.fuel]}});
}

export function borrowGuMilestone({milestone, ...request}) {
    if (!milestone || milestone.operator !== request.operator || !Number.isSafeInteger(milestone.at) || milestone.at >= request.now) {
        throw Error('Reach an earlier witnessed state of your Gu.');
    }
    const projection = beginGuProjection({...request, profile: {
        rank: milestone.capability.rank, capabilities: [milestone.capability], reserves: milestone.reserves,
    }});
    return {...projection, milestone: {id: milestone.id, at: milestone.at, specimen: milestone.specimen}};
}

export function reachableGuCapability({projection, anchor, operator, now, kind}) {
    if (!projection || projection.anchor !== anchor || projection.operator !== operator || !Number.isSafeInteger(now) ||
        now < projection.startsAt || now >= projection.expiresAt) {
        throw Error('The borrowed state is no longer reachable.');
    }
    const capability = projection.capabilities.find(row => row.kind === kind);
    if (!capability) throw Error('The borrowed state has no such capability.');
    return capability;
}

export function invokeProjectedGu(request) {
    const {projection, operator, now, kind} = request;
    const capability = reachableGuCapability(request);
    if (capability.witness) throw Error('The projected Gu must choose to help.');
    const result = resolveGuActivation({
        stages: [{
            gu: {id: `projection:${kind}`, kind, rank: capability.rank, fedThrough: now, traits: capability.traits},
            operator, ability: capability.ability, supply: capability.supply,
        }],
        reserves: {[operator]: projection.reserves},
        day: now,
    });
    return {...result, projection: {...projection, reserves: result.remaining[operator]}};
}
