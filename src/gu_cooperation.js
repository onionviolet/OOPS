import {resolveGuActivation} from './gu_activation.js';
import {reachableGuCapability} from './gu_projection.js';
import {stableId} from './simulation_ids.js';

// The host attests the earlier act of voluntary help. Preserve who received
// it and which Gu gave it so a later operator cannot swap the beneficiary.
export function recordGuAidMilestone({id, operator, at, gu, agreement, ability, reserve}) {
    if (!stableId(id) || !stableId(operator) || !Number.isSafeInteger(at) || at < 0 ||
        !(stableId(gu.id) || Number.isSafeInteger(gu.id) && gu.id > 0) || !stableId(gu.kind) ||
        !Number.isSafeInteger(gu.rank) || gu.rank < 1 || !stableId(agreement.actor) || !stableId(agreement.body) ||
        !stableId(ability.fuel) || !Number.isFinite(ability.cost) || ability.cost <= 0 ||
        !Number.isFinite(reserve) || reserve < ability.cost) throw Error('Mark an earlier act of willing Gu aid.');
    return structuredClone({id, operator, at, specimen: gu.id, reserves: {[ability.fuel]: reserve},
        capability: {kind: gu.kind, rank: gu.rank, ability, witness: {specimen: gu.id, agreement}}});
}

// A Gu supplies its own activation and names who may benefit from it.
// The host supplies the active agreement and the actual visitor identity.
export function requestGuAid({gu, visitor, agreement, ability, reserve, now}) {
    if (!agreement || agreement.actor !== visitor.actor || agreement.body !== visitor.body) return null;
    const result = resolveGuActivation({stages: [{gu, operator: gu.id, ability}],
        reserves: {[gu.id]: {[ability.fuel]: reserve}}, day: now});
    return result.outcome === 'complete' ? result : null;
}

export function requestProjectedGuAid({visitor, ...request}) {
    const {projection, now} = request;
    const {kind, rank, ability, witness} = reachableGuCapability(request);
    if (!witness) return null;
    const result = requestGuAid({gu: {id: witness.specimen, kind, rank, fedThrough: now},
        visitor, agreement: witness.agreement, ability, reserve: projection.reserves[ability.fuel], now});
    if (!result) return null;
    return {...result, projection: {...projection, reserves: result.remaining[witness.specimen]}};
}
