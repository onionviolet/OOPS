// The first derived rule that reads the pin store (PSA29, PWC92): gu.rank.precursor. Its rule is "one rank above the
// highest-ranked input"; where canon breaks it, the miss is a named exception pinned at the gu.rank address with its
// reason, and the rule stays simple. Manifest source: docs/coverage/gu_rank_exceptions.json (fold-5 misses of two ranks or more).
import exceptions from '../docs/coverage/gu_rank_exceptions.json' with {type: 'json'};
import {pinAddress, registerManifest} from './pin_store.js';

export const GU_RANK_SPACE = 'gu.rank';
export const guRankAddress = id => pinAddress(GU_RANK_SPACE, id);

export const GU_RANK_MANIFEST = 'gu.rank.exceptions';
registerManifest(GU_RANK_MANIFEST, exceptions.exceptions.map(e => ({
    address: guRankAddress(e.id), value: e.canon, kind: 'exception',
    reason: `${e.state}: ${e.reason}`, reasonStatus: /needs a chapter read/.test(e.reason) ? 'class-only' : 'read',
    source: {file: 'docs/coverage/gu_rank_exceptions.json', rule: e.rule, derived: e.derived, firstChapter: e.firstChapter}})));

// read(address) returns a pin or null (pin_store_domain's readPinNow in the game, readPin(state, ...) in a test).
export function deriveGuRankPrecursor({id, inputRanks}, read) {
    const pin = read(guRankAddress(id));
    const known = (inputRanks ?? []).filter(Number.isSafeInteger);
    const derived = known.length ? Math.max(...known) + 1 : null;
    if (pin) return {rank: pin.value, basis: `pinned:${pin.kind}`, reason: pin.reason, reasonStatus: pin.reasonStatus, derived};
    return {rank: derived, basis: derived === null ? 'abstain' : 'derived:precursor', reason: null, reasonStatus: null, derived};
}
