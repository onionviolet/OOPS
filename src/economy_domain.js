import {registerDomain} from './domain_registry.js';
import {current_game_time} from './game_time.js';
import {calendarMinutes} from './world_rhythm.js';
import {namedMoneySource as named} from './money.js';
export {setSavedPurse, addSavedPurse} from './money.js';
// One money seam (ECX1, ECR16) and a faucet/sink ledger (ECL2, ECR15), 2026-10-19.
// Every write to the hero's coin purse (`character.money`) goes through setPurse/addPurse with a
// named source, and each nonzero change becomes one ledger row. A save copy that mirrors a live
// change before the durable write goes through setSavedPurse/addSavedPurse (src/money.js): same
// arithmetic, no row, because the live publication after that write records it. Staged plan values
// (`plan.external.money`, `plan.money`, `p.native.money`) are not the purse; a plan's net change
// is recorded once when it commits. The seam keeps today's arithmetic exactly (no rounding or
// range rule yet), so behavior is unchanged.
//
// The ledger is debug and read-only: memory only, never saved, the last LIMIT rows. Baseline rows
// (load, new game, start layers) set the purse without being a faucet or sink.
const LIMIT = 500;
let rows = [], next = 1;
function clock() { try { return calendarMinutes(current_game_time); } catch { return null; } }
function record(holder, before, source, {baseline = false, detail = null} = {}) {
    const delta = holder.money - before;
    if(delta === 0 && !baseline) return;
    const row = {n: next++, at: clock(), source, delta, balance: holder.money};
    if(baseline) row.baseline = true;
    if(typeof detail === 'string' && detail) row.detail = detail.slice(0, 200);
    rows.push(row);
    if(rows.length > LIMIT) rows = rows.slice(-LIMIT);
}

// The live purse. `detail` is optional display text (a trade label, a plan message).
export function setPurse(holder, value, source, options) {
    source = named(source); const before = holder.money; holder.money = value; record(holder, before, source, options);
}
export function addPurse(holder, amount, source, options) {
    source = named(source); const before = holder.money; holder.money += amount; record(holder, before, source, options);
}

// Names a committed expansion plan's money change by the events it appended (their action ids);
// `plan.moneySource` wins when a stager sets one. The last new event's label is the detail.
export function planMoneySource(plan, fromSequence) {
    const events = (plan.state?.history ?? []).filter(h => h?.sequence > fromSequence && typeof h.actionId === 'string');
    const ids = [...new Set(events.map(h => h.actionId))];
    return {source: plan.moneySource ?? (ids.length ? ids.join('+').slice(0, 120) : 'native.plan'), detail: events.at(-1)?.label ?? null};
}
export function commitPlanMoney(holder, plan, fromSequence) {
    const {source, detail} = planMoneySource(plan, fromSequence);
    setPurse(holder, plan.external.money, source, {detail});
}

// Native transactions bind this, so a rolled-back batch also drops the rows it wrote. The mark is
// a number: rows past it are removed (rows trimmed by LIMIT during that batch stay trimmed).
export const moneyLedgerBinding = Object.freeze({get: () => next, set: mark => { rows = rows.filter(r => r.n < mark); next = mark; }});

// Rows whose game minute falls in [since, until), plus totals by source. Faucets add coin, sinks
// remove it; baseline rows are listed but not totalled.
export function moneyLedger({since = -Infinity, until = Infinity} = {}) {
    const window = rows.filter(r => r.at === null || (r.at >= since && r.at < until));
    const faucets = {}, sinks = {};
    for(const r of window) if(!r.baseline) { const side = r.delta > 0 ? faucets : sinks; side[r.source] = (side[r.source] ?? 0) + r.delta; }
    const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
    return {rows: structuredClone(window), faucets, sinks, net: sum(faucets) + sum(sinks), kept: LIMIT};
}
export function resetMoneyLedger() { rows = []; next = 1; }

// No save slice: the ledger is a debug view of this session (ECL2 asks for read-only).
registerDomain({id: 'economy', deps: [], projection: range => moneyLedger(range)});
