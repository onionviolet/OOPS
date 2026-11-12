import {stableId} from './simulation_ids.js';

// Supply belongs to the operator. Earlier transfer or condensation settles
// its losses before casting, and the pool retains its grade and provenance.
export function quoteGuFuel(ability, gu, supply) {
    if (supply === undefined) return {pool: ability.fuel, factor: 1};
    const {pool, family, rank, source, stage} = supply;
    if (!stableId(pool) || family !== ability.fuel || !Number.isSafeInteger(rank) || rank < 1 ||
        !['aperture', 'stored', 'condensed', 'transferred'].includes(source) ||
        !Number.isSafeInteger(gu.rank) || gu.rank < 1 ||
        stage !== undefined && !['initial', 'middle', 'upper', 'peak'].includes(stage)) {
        throw Error('This Gu needs a compatible source of essence with a recorded grade.');
    }
    const gap = Math.max(0, gu.rank - rank);
    // Workshop curve. The novel gives no universal formula for the gap.
    const factor = 2 ** gap;
    if (!Number.isSafeInteger(factor)) throw Error('The grade gap is outside the supported curve.');
    const grade = stage && rank === gu.rank && ability.stageFuel?.[stage];
    return {pool, factor: factor * (grade?.costFactor ?? 1), ...(grade && {magnitudeFactor: grade.magnitudeFactor}),
        funding: {source, family, rank, requiredRank: gu.rank, gap, ...(stage && {stage}),
            controlRisk: Math.min(1, gap * 0.25)}};
}
