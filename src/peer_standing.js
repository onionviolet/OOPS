// Trust tiers for gifts and a small peer ranking (gaps G52, G53). Kept small on
// purpose (AD33). A gift above its tier's comfortable size is allowed but costs
// trust as suspicion; the dial and the in-world reason sit in the rules. Pure.
// Save slice `social.trust@1`: {family, trust:{npcId:points}}. Not wired yet.
import {natural as nat, positive as pos} from './basics.js';
import {compareCodePoints} from './gen_kit.js';

export const TRUST_FAMILY = 'social.trust@1';
const fail = message => { throw new Error(message); };

// spec: {id, tiers:[{id, at, giftCeiling, reason}] ascending by at, suspicionPerExcess}
export function defineTrustRules(spec) {
    const tiers = spec.tiers ?? [];
    if(!tiers.length || tiers[0].at !== 0 || tiers.some((t, i) => !nat(t.at) || !pos(t.giftCeiling) || !t.reason || (i && t.at <= tiers[i - 1].at))) fail('Tiers need ascending thresholds from 0, a gift ceiling and a reason.');
    if(!pos(spec.suspicionPerExcess)) fail('suspicionPerExcess must be positive.');
    return Object.freeze({id: spec.id, tiers: Object.freeze(tiers.map(t => Object.freeze({...t}))), suspicionPerExcess: spec.suspicionPerExcess});
}
export const createTrustState = () => ({family: TRUST_FAMILY, trust: {}});
export const tierOf = (rules, points) => [...rules.tiers].reverse().find(t => points >= t.at);

// value: the gift's worth in coin-equivalents; gain is 1 trust per 10 worth up to the ceiling,
// and each unit past the ceiling costs suspicionPerExcess trust instead.
export function giveGift(rules, state, npc, value) {
    if(!pos(value)) fail('A gift has positive value.');
    const before = state.trust[npc] ?? 0, tier = tierOf(rules, before);
    const within = Math.min(value, tier.giftCeiling), excess = value - within;
    const change = Math.floor(within / 10) - excess * rules.suspicionPerExcess;
    const after = Math.max(0, before + change);
    return {state: {...state, trust: {...state.trust, [npc]: after}}, change, tier: tier.id, tooBig: excess > 0, reason: excess > 0 ? tier.reason : null, now: tierOf(rules, after).id};
}
// peers: [{id, score}] including the player; ties break by id so the order is stable.
export function rankPeers(peers, playerId) {
    const order = [...peers].sort((a, b) => b.score - a.score || compareCodePoints(a.id, b.id));
    const rank = order.findIndex(p => p.id === playerId) + 1;
    return {order: order.map((p, i) => ({...p, rank: i + 1})), rank: rank || fail('Player is not among the peers.'), of: order.length,
        next: rank > 1 ? {id: order[rank - 2].id, gap: order[rank - 2].score - order[rank - 1].score} : null};
}
export function validateTrustState(state) {
    if(state?.family !== TRUST_FAMILY) fail('Unsupported trust state.');
    for(const [id, n] of Object.entries(state.trust)) if(!id || !nat(n)) fail(`Invalid trust for ${id}.`);
    return state;
}
