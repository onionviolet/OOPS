// FBK3/FBK4: the short reason a trade press gives when it adds nothing. Text only; the caller owns the node.
// The NPC's display name may carry a role ("Dunstan, the village trader"); the sentence uses the name before the comma.
const shortName = full => String(full || '').split(',')[0].trim() || 'The trader';

/** `state` is a vendor row state: 'sold-out' or 'in-basket'. */
export function vendorRefusal({state, traderName, itemName}) {
    const who = shortName(traderName), what = String(itemName || 'that').toLowerCase();
    return state === 'sold-out' ? `${who} has no more ${what}.` : `Your basket already holds all ${who} has of ${what}.`;
}
