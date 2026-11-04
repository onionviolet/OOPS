// Conserved-stock exchange ledger (MR29 conserved identity; FMA packet W22.W17 slice, native accounting).
// Rule: stock offered -> typed operation -> changed object, and a card or receipt never creates matter or a second
// custody. A quote is pure and never mutates; the caller's one rollback boundary commits it. The units are the game's
// own (one wood per rune), not an FMA price function: the packet states no universal one (native accounting, proposal).
// Not a resolver for runes (rune_grammar.js owns the pattern) and not chemistry (craft_resolver.js). Next consumer: craft engine.
const unit = n => Number.isSafeInteger(n) && n >= 0;
const fail = message => { throw new Error(message); };

// Units still held by a thing being dissolved: whole units only, rounded down, so release never exceeds what was spent.
export function releasedUnits(spent, left, total) {
    if(!unit(spent) || !unit(left) || !(Number.isSafeInteger(total) && total > 0) || left > total) fail('Invalid release.');
    return Math.floor(spent * left / total);
}
// need: units the new object costs. released: units held by the object it replaces (dissolved in the same commit).
// stock: units owned. Release covers at most `need`; the rest of the old object's units stay with it as residue (reported, never
// returned to stock, never minted into a new item).
export function quoteExchange({need, released = 0, stock}) {
    if(![need, released, stock].every(unit)) fail('Invalid exchange.');
    const credit = Math.min(need, released), debit = need - credit, residue = released - credit, short = Math.max(0, debit - stock);
    const q = {need, credit, debit, residue, stock, short, ok: short === 0,
        reason: short ? `Need ${debit} wood and carry ${stock}.` : '',
        balance: `${need} wood needed = ${credit} from the old strip + ${debit} from your stock${residue ? `; ${residue} left behind in the old strip` : ''}`};
    return Object.freeze(q);
}
// The conservation check both tests and the commit path rely on.
export function assertConserved(q, released = q.credit + q.residue) {
    if(q.credit + q.debit !== q.need || q.credit + q.residue !== released || q.debit > q.stock && q.ok) fail('Exchange does not balance.');
    return q;
}
