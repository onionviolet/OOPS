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
