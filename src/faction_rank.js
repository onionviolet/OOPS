// G2 (Qud parity gap audit 2026-10-23), proposal content: names and thresholds are reversible dials.
// Rank is a named band over the signed per-region reputation integer (character.reputation, owned by
// reputation.js). It is derived on read and never stored, so saves need no migration. Display titles
// (titles.js), the rank, the number and achievements stay separate owners (AD30, AD38).
export const DEFAULT_LADDER = [
    {id: 'distrusted', at: -Infinity, name: 'Distrusted', feeling: 'People here watch their purses when you pass.'},
    {id: 'stranger', at: 0, name: 'Stranger', feeling: 'Nobody here knows what to make of you yet.'},
    {id: 'known_face', at: 10, name: 'Known Face', feeling: 'People nod when you pass.'},
    {id: 'neighbour', at: 50, name: 'Neighbour', feeling: 'You are counted among the people who live here.'},
    {id: 'trusted', at: 200, name: 'Trusted', feeling: 'People bring you their problems and keep their doors open.'},
    {id: 'honoured', at: 1000, name: 'Honoured', feeling: 'Your name is spoken with weight at the tables that matter.'},
];

// Per-region overrides. A region without an entry uses DEFAULT_LADDER (dial, not a rule).
export const REGION_LADDERS = {
    Village: DEFAULT_LADDER,
    Town: DEFAULT_LADDER.map(r => r.id === 'neighbour' ? {...r, at: 30, name: 'Regular'} : r),
    Slums: DEFAULT_LADDER.map(r => ({
        distrusted: {...r, feeling: 'Doors close as you approach.'},
        known_face: {...r, name: 'Known Hand'}, neighbour: {...r, name: 'Kin'},
        trusted: {...r, name: 'Trusted Kin'}, honoured: {...r, name: 'Backbone'},
    }[r.id] || r)),
};

export function ladderFor(region, ladders = REGION_LADDERS) {
    return ladders[region] || DEFAULT_LADDER;
}

/** {index, id, name, feeling, at, next} for a reputation value; next is the following rung or null. */
export function rankOf(region, reputation, ladders = REGION_LADDERS) {
    const ladder = ladderFor(region, ladders);
    const value = Number.isFinite(reputation) ? reputation : 0;
    let index = 0;
    ladder.forEach((rung, i) => { if(value >= rung.at) index = i; });
    return {...ladder[index], index, next: ladder[index + 1] || null, value};
}

/** Simulation facts so commands can gate on rank: rank.<Region> (index) and rank.<Region>.id. */
export function rankFacts(reputation, ladders = REGION_LADDERS) {
    const facts = {};
    for(const [region, value] of Object.entries(reputation || {})) {
        const rank = rankOf(region, value, ladders);
        facts[`rank.${region}`] = rank.index;
        facts[`rank.${region}.id`] = rank.id;
        facts[`rank.${region}.discount`] = LESSON_DISCOUNT[rank.id] || 0;
    }
    return facts;
}

/** Whether a rank-gated service is open; returns {ok, reason}. minRank is a rung id. */
export function rankAllows(region, reputation, minRank, ladders = REGION_LADDERS) {
    const ladder = ladderFor(region, ladders);
    const need = ladder.findIndex(r => r.id === minRank);
    if(need < 0) return {ok: false, reason: `Unknown rank "${minRank}".`};
    const have = rankOf(region, reputation, ladders);
    return have.index >= need ? {ok: true, reason: ''}
        : {ok: false, reason: `Needs ${ladder[need].name} standing in ${region} (${ladder[need].at} reputation); you are ${have.name}.`};
}

/**
 * Teaching price by standing: rank discounts the coin fee. Dial: discounts per rung id, never below 0.
 * quote rechecks affordability at call time so a stale preview cannot start a lesson.
 */
export const LESSON_DISCOUNT = {neighbour: 1, trusted: 1, honoured: 2};
export function lessonFee(base, region, reputation, ladders = REGION_LADDERS) {
    return Math.max(0, base - (LESSON_DISCOUNT[rankOf(region, reputation, ladders).id] || 0));
}
export function quoteStandingLesson({base, region, reputation, money, ladders = REGION_LADDERS}) {
    const fee = lessonFee(base, region, reputation, ladders);
    const rank = rankOf(region, reputation, ladders);
    return {fee, rank, affordable: money >= fee, reason: money >= fee ? '' : `Costs ${fee} coin${fee === 1 ? '' : 's'} at ${rank.name} standing; you hold ${money}.`};
}

/** Rows for the reputation panel, regions with a nonzero value only (matches the existing panel). */
export function rankRows(reputation, ladders = REGION_LADDERS) {
    return Object.entries(reputation || {}).filter(([, v]) => v !== 0).map(([region, value]) => {
        const r = rankOf(region, value, ladders);
        return {region, value, rank: r.name, feeling: r.feeling, next: r.next ? `${r.next.name} at ${r.next.at}` : 'Highest rank'};
    });
}

/** Log line when a reputation change crosses a rung; change is {from, to} from ReputationManager.add_reputation. */
export function promotionText(region, change) {
    const up = change.to.index > change.from.index;
    return `${up ? 'Standing rises' : 'Standing falls'} in ${region}: ${change.to.name}. ${change.to.feeling}`;
}

/** {from, to} rungs when a value change crosses a rung, else null. */
export function rankChange(region, beforeValue, afterValue, ladders = REGION_LADDERS) {
    const from = rankOf(region, beforeValue, ladders), to = rankOf(region, afterValue, ladders);
    return from.index === to.index ? null : {from, to};
}
