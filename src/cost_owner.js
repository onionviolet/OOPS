// Cost owners (E1, proposal AD32; PC94, PC95, PC99, PFP3, AD38). A working
// publishes cost rows; this settles them in the engine world in the same call
// that settles the working. Each row is taken from the payer's account in the
// quantity the world names for that cost, through ordinary substrate `add` ops
// whose ledger source names the pack that declared the quantity (its owner).
// Nothing here refuses: a payer who is short pays what they can, then by the
// ways around the world's data gives (a substitute at a worse rate, someone
// paying for them at a price), and what is still short settles as a fault
// whose price is data. Names no world; every rate and price is the caller's.
//
// cost row:  {kind | quantity, amount, payer?, as?}
// accounts:  {[kind]: {quantity, per?, as?: 'debit' | 'burden', order?,
//             substitutes?: [{quantity, num, den, as?}],
//             fault?: {id, cause, owed?: [{quantity, num, den, holder?}],
//                      effects?: [{sentence, details, per?: {num, den}}]}}}
// backers:   [{for, by, kinds?, quantity?, num?, den?, owed?: {quantity, num, den}}]
// A `burden` is a cost counted upward (a strain, a sum owed): it is added, not taken.
import {applyWorldOps, quantityDef} from './world_substrate.js';
import {landEffect} from './effect_host.js';

const natural = n => Number.isSafeInteger(n) && n >= 0;
const positive = n => Number.isSafeInteger(n) && n > 0;
const check = (ok, why) => { if (!ok) throw Error(`Cost owner: ${why}`); };
const rate = (row, what) => { check(positive(row.num ?? 1) && positive(row.den ?? 1), `${what} needs a positive whole rate.`); return [row.num ?? 1, row.den ?? 1]; };
const ORDER = Object.freeze(['own', 'substitute', 'backer']);
const withPayer = (value, payer) => Array.isArray(value) ? value.map(v => withPayer(v, payer))
    : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withPayer(v, payer)]))
        : value === '$payer' ? payer : value;

// How much of `quantity` this holder can still give (debit) or take on (burden).
function room(rules, world, holder, quantity, as) {
    const def = quantityDef(rules, quantity), h = world.holders[holder];
    if (!def || !h) return 0;
    const now = h.quantities[quantity];
    return as === 'burden' ? def.max - (now ?? Math.max(def.min, 0)) : now == null ? 0 : now - def.min;
}

// One substrate act, credited in the ledger to the quantity's owner.
function move(rules, world, holder, quantity, amount, cause) {
    const def = quantityDef(rules, quantity), carried = quantity in world.holders[holder].quantities;
    return applyWorldOps(rules, world, [...(carried ? [] : [{op: 'carry', holder, quantity}]),
        {op: 'add', holder, quantity, amount, source: `${def.owner}:cost:${cause}`}], cause);
}

/** Costs a kernel working's receipts published from step `since` on, in order. */
export const receiptCosts = (record, since = 0) => record.receipts.slice(since).flatMap(row => row.truth?.costs ?? []);

/**
 * Settle published costs now. Returns {world, status, lines, faults, paidPermille}.
 * status: none (nothing published), paid, fault (something stayed short; the
 * fault's price landed), unowned (a row names no declared quantity, so no owner
 * could debit it; the line says which). A fault with no price data is reported
 * with `priced: false`, so the gap in the world's data is visible.
 */
export function settleCosts({rules, world, costs = [], payer, cause, accounts = {}, backers = [], fault: defaultFault = null, keys, read}) {
    check(typeof cause === 'string' && cause.length > 0 && Array.isArray(costs), 'settle needs cost rows and a cause.');
    const lines = [], faults = [];
    let due = 0, covered = 0;
    for (const cost of costs) {
        const key = cost?.kind ?? cost?.quantity, account = accounts[key] ?? {}, who = cost?.payer ?? payer;
        const quantity = account.quantity ?? cost?.quantity, as = cost?.as ?? account.as ?? 'debit';
        const line = {kind: key ?? null, amount: cost?.amount ?? null, payer: who ?? null, quantity: quantity ?? null,
            owner: quantityDef(rules, quantity ?? '')?.owner ?? null, paid: [], short: 0, status: 'paid'};
        lines.push(line);
        if (!natural(cost?.amount) || !world.holders[who] || !line.owner) {
            line.status = 'unowned';
            line.reason = !natural(cost?.amount) ? 'no whole amount' : !world.holders[who] ? 'no payer in this world' : 'no declared quantity for this cost';
            continue;
        }
        let need = cost.amount;
        due += need;
        const pay = (way, holder, q, [num, den], how, extra = {}) => {
            if (!need || !quantityDef(rules, q) || !world.holders[holder]) return 0;
            const units = Math.min(need, Math.floor(room(rules, world, holder, q, how) * den / num));
            if (!units) return 0;
            const taken = Math.ceil(units * num / den);
            world = move(rules, world, holder, q, how === 'burden' ? taken : -taken, cause);
            need -= units;
            line.paid.push({way, holder, quantity: q, owner: quantityDef(rules, q).owner, units, taken, ...extra});
            return units;
        };
        const ways = {
            own: () => pay('own', who, quantity, rate({num: account.per}, 'account'), as),
            substitute: () => { for (const s of account.substitutes ?? []) pay('substitute', who, s.quantity, rate(s, 'substitute'), s.as ?? 'debit'); },
            backer: () => {
                for (const b of backers) {
                    if (b.for !== who || (b.kinds && !b.kinds.includes(key))) continue;
                    const units = pay('backer', b.by, b.quantity ?? quantity, rate({num: b.num ?? account.per, den: b.den}, 'backer'), as);
                    if (!units || !b.owed) continue;
                    const [num, den] = rate(b.owed, 'backer price'), owed = Math.ceil(units * num / den);
                    world = move(rules, world, who, b.owed.quantity, owed, cause);
                    line.paid.at(-1).owed = {holder: who, quantity: b.owed.quantity, amount: owed};
                }
            },
        };
        for (const way of account.order ?? ORDER) { check(ways[way], `unknown way ${way}.`); ways[way](); }
        covered += cost.amount - need;
        if (!need) continue;
        line.short = need; line.status = 'fault';
        const data = account.fault ?? defaultFault;
        const fault = {id: data?.id ?? null, kind: key, payer: who, short: need, of: cost.amount, cause: data?.cause ?? null, priced: !!data, owed: [], effects: []};
        for (const o of data?.owed ?? []) {
            const holder = o.holder === undefined || o.holder === '$payer' ? who : o.holder, [num, den] = rate(o, 'fault price');
            check(world.holders[holder] && quantityDef(rules, o.quantity), 'a fault price names a holder and a declared quantity.');
            const amount = Math.ceil(need * num / den), before = world.holders[holder].quantities[o.quantity] ?? 0;
            world = move(rules, world, holder, o.quantity, amount, `${cause}:fault`);
            fault.owed.push({holder, quantity: o.quantity, owner: quantityDef(rules, o.quantity).owner, amount, landed: world.holders[holder].quantities[o.quantity] - before});
        }
        for (const e of data?.effects ?? []) {
            const effect = withPayer({sentence: e.sentence, details: e.details ?? {}}, who);
            if (e.per) { const [num, den] = rate(e.per, 'fault effect'); effect.details.amount = Math.ceil(need * num / den); }
            const landed = landEffect(rules, world, effect, {cause: `${cause}:fault`, by: who, keys, read});
            world = landed.world;
            fault.effects.push({status: landed.status, reason: landed.reason, amount: effect.details.amount ?? null});
        }
        line.fault = fault; faults.push(fault);
    }
    const status = faults.length ? 'fault' : lines.some(l => l.status === 'unowned') ? 'unowned' : lines.length ? 'paid' : 'none';
    return {world, status, lines, faults, paidPermille: due ? Math.floor(covered * 1000 / due) : 1000};
}
