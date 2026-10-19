// Money seam leaf (ECX1, ECR16, 2026-10-19). No imports, so pure modules can use it.
// A save envelope's copy of the hero's purse is written here with a named source. That copy
// mirrors a live change which publishes after the durable write and records itself in the
// economy ledger (src/economy_domain.js), so these writers add no ledger row.
export function namedMoneySource(source) {
    if(typeof source !== 'string' || !source) throw Error('A money change needs a named source.');
    return source.slice(0, 120);
}
export function setSavedPurse(envelope, value, source) { namedMoneySource(source); envelope.character.money = value; }
export function addSavedPurse(envelope, amount, source) { namedMoneySource(source); envelope.character.money += amount; }
