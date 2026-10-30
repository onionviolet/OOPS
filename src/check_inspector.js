// Author truth only. No UI, DOM, storage, secret projection or global log.
import {checkOdds} from './check_odds.js';
import {validateCheckProfile, integer} from './check_contract.js';

// Input is caller-owned chronological receipt history. Limit applies to the
// current profile revision; the caller supplies world/life-scoped history.
export function readCheckInspector({author = false, profile, check, receipts = [], limit = 20}) {
    if (author !== true) throw Error('Check inspector requires author access.');
    const admitted = validateCheckProfile(profile);
    if (!Array.isArray(receipts) || !integer(limit, 0, 100)) throw TypeError('Invalid inspector history/limit.');
    const ref = `${admitted.id}@${admitted.revision}`;
    return {authorOnly: true, profile: admitted, odds: checkOdds(admitted, check),
        receipts: limit === 0 ? [] : structuredClone(receipts.filter(r => r.engine === 'check@1' && r.profileRef === ref).slice(-limit))};
}

// Sensitivity of one check, exact (checkOdds), author-only and read-only. Nothing here rolls or writes.
//   contribution: success odds with the modifier minus without it ("what is this worth").
//   plusOne:      success odds with the modifier's value +1 minus now ("what would +1 of this stat do").
//   sweep:        odds as the modifier's value runs value-range..value+range. A flat sweep is `saturated`
//                 (extra points are wasted); saturated with zero contribution is `neverMatters`.
// statMap links a stat to a modifier by id ({Charm: {modifierId: 'charm', perPoint: 1}}) because
// modifiers carry no stat identity; one point of the stat moves that modifier by perPoint.
const ratio = r => Number(BigInt(r.numerator)) / Number(BigInt(r.denominator));
const successOf = (profile, check) => ratio(checkOdds(profile, check).success);
const numericKinds = ['bonus', 'target'];
const withModifiers = (check, fn) => ({...structuredClone(check), modifiers: fn(structuredClone(check.modifiers ?? []))});
export function readCheckSensitivity({author = false, profile, check, statMap = {}, range = 5}) {
    if (author !== true) throw Error('Check inspector requires author access.');
    const admitted = validateCheckProfile(profile);
    if (!integer(range, 0, 50)) throw TypeError('Invalid sensitivity range.');
    const base = successOf(admitted, check);
    const modifiers = (check.modifiers ?? []).map(m => {
        const without = successOf(admitted, withModifiers(check, ms => ms.filter(x => x.id !== m.id)));
        const row = {id: m.id, kind: m.kind, value: m.value ?? null, reason: m.reason, contribution: +(base - without).toFixed(6)};
        if (numericKinds.includes(m.kind)) {
            const at = delta => successOf(admitted, withModifiers(check, ms => ms.map(x => x.id === m.id ? {...x, value: x.value + delta} : x)));
            row.plusOne = +(at(1) - base).toFixed(6);
            row.sweep = Array.from({length: 2 * range + 1}, (_, i) => ({value: m.value - range + i, success: +at(i - range).toFixed(6)}));
            row.saturated = row.sweep.every(s => s.success === row.sweep[0].success); // more or less of it changes nothing
            row.neverMatters = row.saturated && row.contribution === 0;
        } else row.neverMatters = row.contribution === 0;
        return row;
    });
    const stats = Object.entries(statMap).map(([stat, {modifierId, perPoint = 1}]) => {
        const m = modifiers.find(x => x.id === modifierId);
        if (!m) throw TypeError(`statMap ${stat} names unknown modifier ${modifierId}.`);
        return {stat, modifierId, perPoint, plusOne: m.plusOne == null ? null : +(m.plusOne * perPoint).toFixed(6), neverMatters: m.neverMatters};
    });
    return {authorOnly: true, profileRef: `${admitted.id}@${admitted.revision}`, baseSuccess: +base.toFixed(6),
        modifiers, stats, neverMatter: [...modifiers.filter(m => m.neverMatters).map(m => m.id)]};
}
