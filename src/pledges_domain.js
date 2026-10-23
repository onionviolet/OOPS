import {registerDomain} from './domain_registry.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {createPledgesPanel, createRuneBenchPanel} from './pledges_ui.js';
import * as P from './pledges.js';
import {vowRules, trialRules, runeGrammar, RATION, CARVING_WOOD, STAGE_NAMES, EFFECT_TEXT, TALISMAN_MINUTES} from './pledges_content.js';
import {readPair, totalPairs} from './rune_grammar.js';
// Pledges domain: vows, the tempering trial (breakthrough with a heart-demon cost) and the rune bench. It owns the
// namespaced `pledges` slice. The hero keeps the stats: this domain publishes four named multiplier buckets
// (vow_oath, tempering, heart_demon, talisman) that the stat tooltip lists as parts, the way aging_contact does.
let state = P.fresh(), ports = null, applied = '', panels = [];
const clock = () => ports?.clock?.() ?? 0;
const render = () => panels.forEach(p => p.render());
function apply() {
    if(!ports?.actor) return;
    const actor = ports.actor();
    if(!actor?.getLevelableComponent) return;
    const sets = P.buckets(state, clock()), signature = JSON.stringify(sets);
    if(signature === applied) return;
    const stats = actor.getLevelableComponent().stats, full = actor.getFullStats(), vitals = {health: full.health, stamina: full.stamina};
    for(const name of P.BUCKET_NAMES) stats.multiplier[name] = sets[name] ?? {};
    actor.updateStatsAndDisplay();
    const next = actor.getFullStats();
    next.health = Math.max(0, Math.min(next.max_health, vitals.health)); next.stamina = Math.max(0, Math.min(next.max_stamina, vitals.stamina));
    applied = signature;
}
const skills = () => ({combat: ports?.skillLevel?.('Combat') ?? 0, equilibrium: ports?.skillLevel?.('Equilibrium') ?? 0, persistence: ports?.skillLevel?.('Persistence') ?? 0});
const need = () => { if(!ports) throw Error('Pledges are not ready yet.'); if(!ports.idle()) throw Error('Finish what you are doing first.'); };
// One native rollback boundary: the slice and any item debit publish together or not at all.
function transact(next, itemId = null, count = 0) {
    if(count) { if(ports.count(itemId) < count) throw Error(`You need ${count} ${itemId.toLowerCase()}.`); ports.assertSpend(itemId); }
    const tx = beginNativeCraftTransaction({owners: [...ports.itemOwners()], bindings: [{get: () => state, set: v => { state = v; }}]});
    try {
        state = next;
        if(count) ports.removeItem(itemId, count);
        ports.persist(() => tx.markDurable());
    } catch(error) { if(tx.status === 'pending') tx.rollback(); throw error; }
    finally { applied = ''; try { apply(); } catch { /* retried on refresh */ } ports?.refresh?.(); render(); }
}
export const commands = {
    takeVow(id) { need(); transact(P.vowTake(state, id, clock())); ports.logMessage(`You swear the vow of the ${id.replace('-', ' ')}.`, 'notification'); },
    breakVow(id) { need(); transact(P.vowBreak(state, id, clock())); ports.logMessage('You break your vow. It leaves a scar that makes the next tempering harder.', 'notification'); },
    temper(units) {
        need();
        const n = Math.max(0, Math.min(trialRules.pay.maxUnits, Math.floor(units) || 0));
        const key = `pledges:temper:${state.trial.attempts}:${clock()}`;
        const roll = Math.min(999, Math.floor(ports.random(key) * 1000));
        const r = P.attempt(state, {roll, units: n, skills: skills()});
        transact(r.state, RATION, n);
        ports.logMessage(r.passed ? `The tempering holds. You are now ${STAGE_NAMES[r.state.trial.stage].toLowerCase()}.` : `The tempering fails and the heart demon stirs (pressure +${r.pressureGain}).`, 'notification');
        return r;
    },
    calm() { need(); transact(P.calm(state), RATION, 1); ports.logMessage('You sit with the fear until it eases a little.', 'notification'); },
    carve(runes) {
        need();
        const r = P.carve(state, runes, clock());
        transact(r.state, CARVING_WOOD, runes.length * runeGrammar.perRuneCost);
        ports.logMessage(`You carve ${runes.join(', ')} and wear the talisman for ${TALISMAN_MINUTES / 60} hours.`, 'notification');
        return r.read;
    },
};
export const pledgesState = () => structuredClone(state);
export const configurePledges = operations => { ports = operations; applied = ''; };
const view = () => {
    const t = clock(), known = new Set(state.runes.pairs.map(p => `${p.a}>${p.b}`));
    return {state, now: t, rations: ports?.count?.(RATION) ?? 0, wood: ports?.count?.(CARVING_WOOD) ?? 0, ready: !!ports,
        vows: Object.values(vowRules.vows).map(v => ({...v, kept: !!state.vows.kept[v.id], broken: state.vows.broken[v.id] ?? null})),
        trial: P.trialView(state, skills()), maxKept: vowRules.maxKept, keptCount: Object.keys(state.vows.kept).length,
        runes: {...P.runeView(state), total: totalPairs(runeGrammar), minutesLeft: state.talisman ? Math.max(0, state.talisman.until - t) : 0,
            effectText: EFFECT_TEXT, knownPair: (a, b) => known.has(`${a}>${b}`) || known.has(`${b}>${a}`) ? readPair(runeGrammar, a, b).effect : null}};
};
registerDomain({id: 'pledges', deps: [], initialState: () => null,
    save: () => P.isFresh(state) ? undefined : structuredClone(P.validate(state)),
    validate: slice => { if(slice != null) P.validate(slice); },
    migrate: slice => P.migrate(slice),
    load: slice => { state = slice ?? P.fresh(); applied = ''; if(ports) try { apply(); } catch { /* stats may not be loaded yet; refresh retries */ } },
    tick: minutes => {
        if(!ports || !(minutes > 0)) return;
        const next = P.expire(state, clock());
        if(next !== state) { state = next; ports.logMessage('The talisman ink fades and goes dull.', 'notification'); }
        try { apply(); } catch { /* retried on refresh */ }
        render();
    },
    refresh: () => { if(!ports) return; try { apply(); } catch { /* retried next refresh */ } render(); },
    projection: view,
    commands,
    panels: [() => { panels = [createPledgesPanel({read: view, commands}), createRuneBenchPanel({read: view, commands})]; }]});
