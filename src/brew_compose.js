// Brewing composition layer (chat B, grammar layer GL3; nested step parts as in
// P's backlog PGB2). Given a recipe's parts without their order, compose a
// brew method the kernel can run (brew_law.js). The order comes from the parts'
// properties and the world's dials, never from a per-recipe script, so a held-
// out canon recipe can be rebuilt from its parts (PFP17). Names no world.
//
// Ordering rules, each default, dial and reason (proposals under AD56):
// - CR1 · Long preparations start first. A part with its own preparation is a
//   nested step before it is admitted, longest first. Reason: a stew of days
//   cannot start after the cauldron is already simmering.
// - CR2 · World admission order. Dial `order`: 'listed' (as given) or
//   'aux-then-main' (auxiliaries, then main materials). Reason: worlds differ;
//   the LOTM Seer formula adds the supplements before the two crucial ones.
// - CR3 · Heat-reactive parts wait until the vessel is off the heat. A part
//   tagged `function.heat_reactive` is held back, the vessel cools, then it goes
//   in. Reason: the Cure for Boils failure (quills on the fire) is the hazard
//   this avoids; a world can dial it off for a brew that wants the reaction.
// - CR4 · Identity parts bind at delivery. A part with role `identity` is not
//   admitted to the batch; it is returned for the delivery step. Reason: a
//   Polyjuice sample goes into the glass, not the cauldron.
import {check} from './basics.js';
import {BREW_LAW} from './brew_law.js';

export const COMPOSE_RULES = Object.freeze(['CR1', 'CR2', 'CR3', 'CR4']);

/** parts: [{slot, role, tags?, prepare?: {how, minutes}}]; process: {react?, heat?,
 * finish?}; dials: {order, heatReactiveWaits}. Returns {method, sequence,
 * atDelivery, trace}: `sequence` is the step tokens ("prepare:slot",
 * "admit:slot", "react", "heat", "cool", "divide") for comparison with canon. */
export function composeBrew({id, parts, process = {}, dials = {}}) {
    check(Array.isArray(parts) && parts.length, 'A brew needs parts.');
    const {order = 'listed', heatReactiveWaits = true} = dials;
    check(['listed', 'aux-then-main'].includes(order), 'Unknown admission order dial.');
    const trace = [];
    const steps = [], sequence = [];
    const push = (token, step) => { steps.push(step); sequence.push(token); };
    const roles = {vessel: 'vessel'};
    for (const p of parts) roles[p.slot] = 'lot';

    // CR1: nested preparations, longest first (stable for ties).
    const prepared = parts.filter(p => p.prepare).map((p, i) => ({p, i})).sort((a, b) => (b.p.prepare.minutes ?? 0) - (a.p.prepare.minutes ?? 0) || a.i - b.i);
    for (const {p} of prepared) {
        push(`prepare:${p.slot}`, {op: 'prepare', bindings: {vessel: 'vessel', lot: p.slot}, minutes: p.prepare.minutes ?? 0, options: {how: p.prepare.how}});
        trace.push({rule: 'CR1', slot: p.slot, why: `${p.prepare.how} before it goes in`});
    }
    // CR4: identity parts wait for delivery.
    const atDelivery = parts.filter(p => p.role === 'identity').map(p => p.slot);
    for (const slot of atDelivery) trace.push({rule: 'CR4', slot, why: 'binds at delivery, not in the batch'});
    const batchParts = parts.filter(p => p.role !== 'identity');
    // CR2: world admission order.
    const ordered = order === 'aux-then-main'
        ? [...batchParts.filter(p => p.role !== 'main'), ...batchParts.filter(p => p.role === 'main')] : batchParts;
    if (order !== 'listed') trace.push({rule: 'CR2', why: order});
    // CR3: heat-reactive parts wait for the vessel to leave the heat.
    const reactive = p => heatReactiveWaits && process.heat && (p.tags ?? []).includes('function.heat_reactive');
    const admit = p => push(`admit:${p.slot}`, {op: 'admit', bindings: {vessel: 'vessel', lot: p.slot}, minutes: 0});
    for (const p of ordered.filter(p => !reactive(p))) admit(p);
    if (process.react) push('react', {op: 'react', bindings: {vessel: 'vessel'}, minutes: process.react.minutes ?? 0, options: process.react.options ?? {}});
    if (process.heat) push('heat', {op: 'heat', bindings: {vessel: 'vessel'}, minutes: process.heat.minutes ?? 0, options: process.heat.options ?? {}});
    const held = ordered.filter(reactive);
    if (held.length) {
        push('cool', {op: 'cool', bindings: {vessel: 'vessel'}, minutes: process.cool?.minutes ?? 0});
        for (const p of held) { admit(p); trace.push({rule: 'CR3', slot: p.slot, why: 'heat-reactive, added off the fire'}); }
    }
    for (const f of process.finish ?? []) push(f.op, {op: f.op, bindings: {vessel: 'vessel'}, minutes: f.minutes ?? 0, options: f.options ?? {}});
    return {method: {id, revision: 1, law: BREW_LAW.ref, roles, steps}, sequence, atDelivery, trace};
}

/** Share of canon precedence pairs [before, after] that a composed sequence keeps.
 * A token missing from the sequence fails its pair; `last` checks delivery. */
export function precedenceKept(sequence, {pairs = [], atDelivery = []}, composed) {
    const pos = token => sequence.indexOf(token);
    const results = pairs.map(([a, b]) => ({pair: `${a} < ${b}`, ok: pos(a) >= 0 && pos(b) >= 0 && pos(a) < pos(b)}));
    for (const slot of atDelivery) results.push({pair: `${slot} at delivery`, ok: composed.atDelivery.includes(slot)});
    return {kept: results.filter(r => r.ok).length, total: results.length, results};
}
