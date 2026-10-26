import {intentEffects} from './cultivation_intents.js';
import {syncTrialBody} from './trial_bodies.js';
import {configureTrialRoutine,quoteTrialRoutine} from './trial_routine.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
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
    state=syncTrialBody(state,chargeBinding());
    const sets = P.buckets(state, clock()), signature = JSON.stringify(sets);
    if(signature === applied) return;
    const stats = actor.getLevelableComponent().stats, full = actor.getFullStats(), vitals = {health: full.health, stamina: full.stamina};
    for(const name of P.BUCKET_NAMES) stats.multiplier[name] = sets[name] ?? {};
    actor.updateStatsAndDisplay();
    const next = actor.getFullStats();
    next.health = Math.max(0, Math.min(next.max_health, vitals.health)); next.stamina = Math.max(0, Math.min(next.max_stamina, vitals.stamina));
    applied = signature;
}
const skills = () => ({intent:intentEffects(ports?.root?.()),fieldLearning:ports?.root?.()?.actors.player.resources['cultivation.fieldFailures']||0,channels:domainRegistry.command('crafting','bodyChannels')?.()||0,weapon:ports?.actor?.()?.getEquipment?.()?.weapon?.weapon_type,combat: ports?.skillLevel?.('Combat') ?? 0, equilibrium: ports?.skillLevel?.('Equilibrium') ?? 0, persistence: ports?.skillLevel?.('Persistence') ?? 0});
const need = () => { if(!ports) throw Error('Pledges are not ready yet.'); const reason=ports.blocked?.();if(reason)throw Error(reason);if(!ports.idle()) throw Error('Finish what you are doing first.'); };
// One native rollback boundary: the slice and any item debit publish together or not at all.
function transact(next, itemId = null, count = 0) {
    if(count) { if(ports.count(itemId) < count) throw Error(`You need ${count} ${itemId.toLowerCase()}.`); ports.assertSpend(itemId); }
    const tx = beginNativeCraftTransaction({owners: [...ports.itemOwners()], bindings: [{get: () => state, set: v => { state = v; }}]});
    try {
        state = syncTrialBody(next,chargeBinding());
        if(count) ports.removeItem(itemId, count);
        ports.persist(() => tx.markDurable());
    } catch(error) { if(tx.status === 'pending') tx.rollback(); throw error; }
    finally { applied = ''; try { apply(); } catch { /* retried on refresh */ } ports?.refresh?.();domainRegistry.refresh();render(); }
}
const chargeBinding=()=>{const b=ports?.root?.()?.simulation?.people?.player?.body;return JSON.stringify([b?.id??'native.player.body',b?.instanceId??null,b?.form??ports?.actor?.()?.getRace?.()??'human']);};
export const commands = {
    milestoneCounters:()=>{const h=state.trial.history||[];if(!h.length)return {};const failed=h.findIndex(x=>!x.passed);return {earned_trial_quality:h.filter(x=>x.passed).reduce((n,h)=>n+h.grade,0),trial_routes:new Set(h.filter(x=>x.passed).map(x=>x.kind)).size,recovered_trial:failed>=0&&h.slice(failed+1).some(x=>x.passed)?1:0};},
    combatBindings:()=>[{get:()=>state,set:v=>{state=v;applied='';}}],
    resolvedCharge({fighter,target,damage}){const outgoing=!!fighter?.tags?.main_character,incoming=!!target?.tags?.main_character;if(!outgoing&&!incoming)return {multiplier:1,heal:0};const hero=ports?.actor?.();if(!hero||!hero.is_alive)return {multiplier:1,heal:0};const full=hero.getFullStats(),r=P.useCharged(state,{direction:outgoing?'outgoing':'incoming',binding:chargeBinding(),health:full.health,maxHealth:full.max_health,damage});state=r.state;if(r.heal){full.health+=r.heal;domainRegistry.command('combatReview','recovered')?.({key:`charged:${state.charged.mode}:${state.charged.serial||0}:${state.charged.at}:${state.charged.uses}`,amount:r.heal});}return r;},
    resolvedSiphon(args){if(state.charged?.mode==='siphon'&&args.fighter?.tags?.main_character)return commands.resolvedCharge(args);},
    carveCharged(runes,mode){need();transact(P.carveCharged(state,runes,mode,clock(),chargeBinding()),CARVING_WOOD,runes.length*runeGrammar.perRuneCost);},
    routine(options){if(options.enabled)need();else if(ports?.writable?.()===false)throw Error('Use the writable game tab.');transact(configureTrialRoutine(state,options));},
    guarded(){need();transact(P.guardedTempering(state,skills(),clock()),RATION,5);},
    actionReason: action => P.actionReason(state, action),
    beginOrdeal(kind, units=0,load=0) { need(); transact(P.beginOrdeal(state,{kind,units,load,skills:skills(),at:clock()}),RATION,units); },
    stepOrdeal(choice) { need(); transact(P.stepOrdeal(state,choice,skills(),clock())); },
    settleOrdeal() { need(); const result=P.settleOrdeal(state,clock());transact(result.state);return result; },
    abandonOrdeal() { need();transact(P.abandonOrdeal(state,clock())); },
    takeVow(id) { need(); transact(P.vowTake(state, id, clock())); ports.logMessage(`You swear the vow of the ${id.replace('-', ' ')}.`, 'notification'); },
    breakVow(id) { need(); transact(P.vowBreak(state, id, clock())); ports.logMessage('You break your vow. It leaves a scar that makes the next tempering harder.', 'notification'); },
    temper(units) {
        need();
        const n = Math.max(0, Math.min(trialRules.pay.maxUnits, Math.floor(units) || 0));
        const key = `pledges:temper:${state.trial.attempts}:${clock()}`;
        const roll = Math.min(999, Math.floor(ports.random(key) * 1000));
        const r = P.attempt(state, {roll, units: n, skills: skills(), at:clock()});
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
        trial: P.trialView(state, skills()),sharedLearning:(state.trial.learning||0)+(skills().fieldLearning||0), ordeal:P.ordealView(state,skills()),ordealKinds:P.ordealKinds(skills()),routine:state.routine?quoteTrialRoutine(state,P.trialView(state,skills()),ports?.count?.(RATION)||0,{world:ports?.world?.(),location:ports?.location?.(),blocked:ports?.blocked?.()}):null, maxKept: vowRules.maxKept, keptCount: Object.keys(state.vows.kept).length,
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
        if(ports.sleeping?.() && state.vows.kept['long-watch'] && currentHour()===6) {
            transact(P.vowBreak(state,'long-watch',clock()));
            ports.logMessage('You slept through the dawn watch. The long-watch vow breaks and leaves its disclosed scar.','notification');
        }
        if(state.routine?.enabled){
            const q=quoteTrialRoutine(state,P.trialView(state,skills()),ports.count(RATION),{world:ports.world?.(),location:ports.location?.(),blocked:ports.blocked?.()||(!ports.idle()?'Finish the current work or decision, then resume the routine.':'')});
            if(!q.eligible)transact({...state,routine:{...state.routine,enabled:false,last:{at:clock(),reason:q.reason}}});
            else {const result=q.guarded?{state:P.guardedTempering(state,skills(),clock()),passed:true}:P.attempt(state,{roll:Math.min(999,Math.floor(ports.random(`pledges:routine:${state.trial.attempts}:${clock()}`)*1000)),units:q.units,skills:skills(),at:clock()});
                const reason=result.passed?'The quoted stage holds; review readiness before another attempt.':'Attempt failed. Fear and failure learning are recorded. Calm fear or revise the limits before resuming.';
                transact({...result.state,routine:{...state.routine,enabled:false,last:{at:clock(),reason}}},RATION,q.cost);ports.logMessage(reason,'notification');}
        }
        const next = P.expire(state, clock());
        if(next !== state) { state = next; ports.logMessage('The talisman ink fades and goes dull.', 'notification'); }
        try { apply(); } catch { /* retried on refresh */ }
        render();
    },
    refresh: () => { if(!ports) return; try { apply(); } catch { /* retried next refresh */ } render(); },
    projection:()=>{const v=view();delete v.runes.knownPair;return v;},
    commands: {...commands,useItem:{
        accepts: key=>{let id;try{id=JSON.parse(key).id;}catch{return false;}return !!P.actionReason(state,{kind:'consume',id,food:!!ports?.templates?.[id]?.tags?.food});},
        quote:key=>{const id=JSON.parse(key).id;return {eligible:false,reason:P.actionReason(state,{kind:'consume',id,food:!!ports?.templates?.[id]?.tags?.food})};},
        execute:()=>{throw Error('Break the self-imposed vow before taking this route.');}
    }},
    panels: [() => { panels = [createPledgesPanel({read: view, commands}), createRuneBenchPanel({read: view, commands})]; }]});
// Native clock projection; no second timer or wall-clock inference.
const currentHour=()=>Math.floor(clock()/60)%24;
