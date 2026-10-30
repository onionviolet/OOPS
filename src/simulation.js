import {actionModifiers} from './harm_state.js';
import {hashStreamSeed as hash, xorshift32} from './hash_rng.js';
import {createWakeQueue} from './wake_queue.js';
import {AFTERMATH_ID,aftermathPersonPresent} from './story_aftermath.js';
import {recordStoryletOutcome} from './lore_history_state.js';
import {initializeStoryletDecks,nextStoryletBoundary,advanceStoryletDecks,validateStoryletState} from './storylet_deck.js';
import {admitFoundationInteraction,freezeFoundationInteractionActivation,advanceFoundationInteractions,nextFoundationInteractionBoundary} from './foundation_interaction_policy.js';
import {foundationInteractionProbeGuard} from './foundation_interaction_content.js';
import {guardSteamLambAdmission,stampSteamLambAcceptedJob,steamLambCompletionContext} from './steam_lamb_runtime.js';
import {guardSteamONIAdmission,stampSteamONIAcceptedJob,steamONICompletionContext} from './steam_oni_runtime.js';
import {guardSteamBOHAdmission,stampSteamBOHAcceptedJob,steamBOHCompletionContext} from './steam_boh_runtime.js';
import {stampNethackFieldcraftJob} from './nethack_fieldcraft_facts.js';
import {stampManagementJob} from './management/validation.js';
import {alloyTechniqueEffects} from "./alloy_equipment.js";
import {guardSteamDFAdmission,stampSteamDFAcceptedJob,steamDFCompletionContext} from './steam_df_runtime.js';
import {agreedDutyCompletionEffects,agreedDutyCancellationEffects,agreedDutyStoppedEffects,agreedDutyRefusalEffects} from './agreed_duty_host.js';
import {agreedDutySelectedCommand} from './agreed_duty_facts.js';
import {stampAgreedDutyContinuationJob} from './agreed_duty_continuation.js';
import {paradiseCampaignControllerAllowed} from './book_world_paradise_campaign_runtime.js';
import {paradiseCampaignExistingCommandGate} from './book_world_paradise_campaign_facts.js';
import {worldCompletionJobContext,stampWorldCompletionAcceptedJob,recordWorldCompletionJobCompletion,worldCompletionTimersSupported,reconcileWorldCompletionPlan} from './world_completion_runtime.js';
import {lorePracticeTimersSupported,lorePracticeAdmissionGuard,stampLorePracticeJob,completeLorePracticeJob,recordLorePracticeCancellation} from './lore_practice_runtime.js';
import {auditRemainderControllerAllowed} from './audit_remainder_state.js';
import {causalStorySimulationContexts, completeCausalStoryJob, recordCausalStoryJobCompletion,
    invalidateCausalStorySupport, advanceCausalStoryBoundary, causalStoryTravelReasons} from './causal_story_host.js';
import {causalStoryOccupiesActor} from './causal_story_core.js';
import {syncRemainderCombatFitCompletion} from './audit_remainder_combat_fit_hooks.js';
import {recordRemainderSupplyCommandCommit} from './audit_remainder_combat_objectives_state.js';
import {reconcileRemainderConsequences} from './audit_remainder_consequences_host.js';
import {remainderConsequencesExistingCommandGate} from './audit_remainder_consequences_facts.js';
import {advanceWorkPlansBoundary} from './feature_expansion_work_plan.js';
import {activePractice} from "./techniques.js";
import {assert, natural, copy, stableId, meets, createSimulationState, validateSimulationState} from "./simulation_contracts.js";
import {cloneData, person, participant, simulationFacts, applySimulationEffects, refundCosts, inventory, writeInventory, advanceNativeContainerClocks,resolveSimulationCostKeys} from "./simulation_effects.js";
import {previewPowerModel, resolveEffectAmount, fluencyDuration} from "./power_models.js";
import {prepareSimulationEffects, resolveOutcomeWeights} from "./simulation_resolution.js";
import {advanceConstructs,nextConstructBoundary} from './temporary_construct.js';
import {pursuitReservesActor,nextPursuitBoundary,advancePursuits} from "./pursuit.js";
export {createSimulationRegistry} from "./simulation_contracts.js";
export {simulationFacts} from "./simulation_effects.js";

const domain = () => ({facts: {}, resources: {}, completed: {}, sources: {}, techniques: {}});
// Base duration, shortened by the actor's repetitions of the command's method
// when the command declares a fluency curve. Read before this run is counted.
const commandDuration = (state, d, actorId) => fluencyDuration(d.duration || 0, d.fluency, state.simulation?.powers?.[actorId]?.[d.powerId]?.executions || 0);
const ruleReason = (rule, facts) => meets(rule, facts) ? [] : [rule?.reason || "The required knowledge, means or circumstances are missing."];
const log = (s, clock, text, cause) => {s.log.push({at: clock, text, cause}); s.log = s.log.slice(-100);};
function draw(check) {check.rng = xorshift32(check.rng); return check.rng / 0x100000000;}
// gameplayBefore is the caller's read-only input snapshot. Plans never write it,
// so it is shared instead of deep-copying the native inventory a second time.
function plan(state, context) {return {state: cloneData(state), external: cloneData(context.external || {}), gameplay: cloneData(context.gameplay || {}), vitals: cloneData(context.vitals || {}), equipment: cloneData(context.equipment || {}), acquisitions: [], unlocks: [], gameplayBefore: context.gameplay || {}};}
// A throwaway validation candidate: every mutable slice is copied, the read-only
// gameplayBefore snapshot is shared.
function trial(out) {
    const candidate = {};
    for(const key of Object.keys(out)) candidate[key] = key === "gameplayBefore" ? out[key] : cloneData(out[key]);
    return candidate;
}
function currentCausalStoryContexts(out, contexts) {
    if(!out.state.causalStories) return contexts;
    const current = Object.fromEntries(Object.entries(contexts).map(([id,c]) => [id,{...c,
        external: out.external, gameplay: out.gameplay, vitals: out.vitals?.[id] || c.vitals,
        vitalsByActor: out.vitals, equipment: out.equipment?.[id] || c.equipment}]));
    return causalStorySimulationContexts(out.state,current);
}
export function enrollSimulation(state, registry, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence && !state.simulation, "Living-world services are already enrolled or this command is stale.");
    assert(!context.busy && !state.pending.some(j => j.context.actorId === "player") && !activePractice(state.actors.player) && !state.chronicle?.session && state.chronicle?.life.endedAt == null, "Finish your current activity first.");
    const out = plan(state, context), s = out.state.simulation = createSimulationState(hash(state.rng, "world.services"));
    s.enrolledAt = state.clock;
    s.people.player = {life: "alive", inventory: "native", location: context.facts?.location || "Village", bornAt: state.clock};
    for(const d of registry.simulation.people.values()) {
        if(d.provision === false) continue;
        assert(registry.worlds.has(d.worldId), "Unknown person world.");
        out.state.actors[d.id] ||= {...domain(), worldId: d.worldId};
        s.people[d.id] = {life: "alive", inventory: d.inventory, location: d.location, bornAt: state.clock, definitionId:d.id, definitionRevision: d.revision};
        if(d.vitals) s.people[d.id].vitals = copy(d.vitals);
        if(d.body) s.people[d.id].body = copy(d.body);
        if(d.lifePolicy) s.people[d.id].lifePolicy = copy(d.lifePolicy);
        if(d.inventory === "simulation") s.owners[d.id] = {};
        Object.assign(out.state.actors[d.id].resources, copy(d.resources || {}));
    }
    for(const d of registry.simulation.sites.values()) {
        if(d.provision === false) continue;
        s.sites[d.id] = {capacity: d.capacity, reservations: {}};
    }
    for(const d of registry.simulation.events.values()) if(d.automatic && s.people[d.actorId || 'player']) s.checks[d.id] = {due: state.clock + d.interval, interval: d.interval, rng: hash(s.seed, d.id), count: 0};
    for(const d of registry.simulation.controllers.values()) if(s.people[d.actorId] && auditRemainderControllerAllowed(out.state,d) && paradiseCampaignControllerAllowed(out.state,d)) s.controllers[d.id] = {actorId: d.actorId, due: state.clock + d.interval, interval: d.interval};
    applySimulationEffects(out, registry.simulation.onEnroll, context, registry, `simulation:${state.sequence + 1}`);
    log(s, state.clock, "Local people and work now share the adventure's calendar. Only played game time advances them.", `simulation:${++out.state.sequence}`);
    validateSimulationState(s, out.state, registry.simulation); return out;
}

export function simulationOccupiesActor(state, actorId = "player", exceptPursuit = null) {
    if(actorId === "player" && state.actors.player.facts["p23.leisure.pendingRound"])return true;
    if(actorId === "player" && state.actors.player.facts["original_frontier.travel.remaining"] > 0) return true;
    if(causalStoryOccupiesActor(state,actorId)) return true;
    return !!state.simulation && (pursuitReservesActor(state,actorId,exceptPursuit) || Object.entries(state.simulation.sessions).some(([id,s]) => (s.participants || [id]).includes(actorId)) || state.simulation.jobs.some(j => (j.participants || [j.actorId]).includes(actorId)) || state.simulation.people[actorId]?.life !== "alive" && !!state.simulation.people[actorId]);
}
function commandParticipants(d, context, s) {
    return [...new Set([context.actorId, ...(d.participants || []).flatMap(id => id === "$party" ? s.party : [participant(id,context)])])];
}
export function waitingSimulationChoice(state) {return Object.values(state.simulation?.events || {}).find(e => e.actorId === "player" && e.mode === "decision" && e.nonBlocking !== true && e.status === "open" && e.discoveredBy.includes("player"));}

export function previewSimulationCommand(state, registry, commandId, context) {return previewCommand(state, registry, commandId, context, true);}
// startCommand repeats the same cost, claim and outcome trial on its own plan and
// throws on any failure, so its internal quote skips the counterfactual copy.
function previewCommand(state, registry, commandId, context, rehearse, knownFacts = null) {
    const d = registry.simulation.commands.get(commandId); assert(d, "Unknown living-world command.");
    if(d.group==='proto23' && context.proto23Host!==true)return {visible:false,eligible:false,reasons:['Use the current Proto23 visitor controls.']};
    const s=state.simulation, facts = knownFacts || simulationFacts(state, {...context,targetId:s?.people[context.targetId] ? context.targetId : null}, registry, [d.requires,d.visibleWhen]), p = person(state, context.actorId);
    // Integration proposal: the trusted host supplies the current full save and
    // this command's function class on BOTH preview and execution. Expansion
    // state alone lacks the body slice; do not read the module-global harm here.
    // Legacy/native conditions.js remains context-only and imports no domains.
    const harm = context.actorId === 'player' && context.harmSave && context.harmActionClass
        ? actionModifiers(context.harmSave,context.harmActionClass) : null;
    const reasons = [...ruleReason(d.requires, facts)];
    if (harm && !harm.allowed) reasons.push(harm.blockedBy.reason);
    // Expose axes to the existing numeric expression resolver. Commands opt in
    // through their own formulas; these are multipliers/offsets, not odds.
    // The host must rebind harmSave at execution and completion, rather than
    // trusting a UI quote or freezing a body snapshot in the accepted job.
    for (const modifier of harm?.modifiers ?? []) {
        facts[`harm.${modifier.axis}.mult`] = modifier.mult ?? 1;
        facts[`harm.${modifier.axis}.add`] = modifier.add ?? 0;
    }
    if(d.group === "original_frontier" && !facts["originalFrontier.clockSupported"]) reasons.push("This local work has no supported clock or contact while you are in another realm.");
    if(d.actorId && d.actorId !== context.actorId) reasons.push("This command belongs to another actor.");
    if(d.actorDefinitionId && d.actorDefinitionId !== p.definitionId) reasons.push("This command belongs to another actor role.");
    if(d.worldId && state.actors[context.actorId].worldId !== d.worldId) reasons.push("This command belongs to another world.");
    if(d.location && (context.facts?.location || p.location) !== d.location) reasons.push(`Return to ${d.location}.`);
    if(d.targetId && d.targetId !== context.targetId) reasons.push("Choose the declared participant.");
    if(d.targetDefinitionId && s.people[context.targetId]?.definitionId !== d.targetDefinitionId) reasons.push("Choose a participant with the declared role.");
    if(context.targetId) {
        const target = s.people[context.targetId];
        if(!target || state.actors[context.targetId]?.worldId !== state.actors[context.actorId].worldId || target.life !== "alive") reasons.push("That participant is unavailable.");
        if(target && d.coLocated && target.location !== (context.facts?.location || p.location)) reasons.push("Meet the participant at their location.");
    }
    if(context.busy || state.pending.some(j => j.context.actorId === context.actorId) || activePractice(state.actors[context.actorId]) || simulationOccupiesActor(state, context.actorId)) reasons.push("Finish your current activity first.");
    for(const id of commandParticipants(d,context,s).filter(id => id !== context.actorId)) {
        const p = s.people[id];
        if(!p || p.life !== "alive" || state.actors[id].worldId !== state.actors[context.actorId].worldId || simulationOccupiesActor(state,id,d.pursuitId) || state.pending.some(j=>j.context.actorId === id) || activePractice(state.actors[id])) reasons.push("A participating person is unavailable or already working.");
        if(d.participantsCoLocated===true&&p?.location!==(context.facts?.location||s.people[context.actorId]?.location))reasons.push('Meet all required participants at this location.');
    }
    if(context.actorId === "player" && (state.chronicle?.session || state.chronicle?.life.endedAt != null || waitingSimulationChoice(state))) reasons.push("Resolve the waiting encounter or life ending first.");
    if(d.once && state.actors[context.actorId].completed[d.id]) reasons.push("This action has already been completed.");
    if(d.claim && s.claims[d.claim]) reasons.push("This unique claim is already held or settled.");
    if(d.siteId && !s.sites[d.siteId]) reasons.push("Discover or commission this work site first.");
    else if(d.siteId && Object.keys(s.sites[d.siteId].reservations).length >= s.sites[d.siteId].capacity) reasons.push("The work site is at capacity.");
    const consequenceGate = remainderConsequencesExistingCommandGate(state,d.id);
    reasons.push(...consequenceGate,...paradiseCampaignExistingCommandGate(state,d.id));
    const visible = meets(d.visibleWhen, facts);
    // An already rejected action has no executable quote. Avoid cloning and
    // validating counterfactual output for every hidden/completed/busy control.
    // Eligible actions still reserve, freeze and validate all costs/outcomes.
    if(reasons.length || !visible) return {id:d.id,label:d.label,description:d.description || "",visible,eligible:false,reasons,
        costs:[],duration:commandDuration(state,d,context.actorId),effects:[],weights:null,revision:d.revision,model:null,...(harm?.modifiers.length?{harm:harm.modifiers}:{})};
    let model = null;
    if(d.powerId) {
        const power = registry.simulation.powers.get(d.powerId), owned = s.powers[context.actorId]?.[d.powerId];
        if(!owned?.owned) reasons.push("Learn this power first.");
        reasons.push(...ruleReason(power.execution, facts));
        if(owned?.readyAt > state.clock) reasons.push(`Power recovers in ${owned.readyAt - state.clock} game minutes.`);
        if(owned) {model = previewPowerModel(power, owned, d, {state, context, facts}); reasons.push(...model.reasons);}
        if(power.worlds && !power.worlds.includes(state.actors[context.actorId].worldId)) reasons.push("This world does not support the power's local rule or fuel.");
    }
    const test = rehearse ? plan(state, context) : null;
    const resolve = effects => (alloyTechniqueEffects(d, effects, facts, value => resolveEffectAmount(value, facts, model || {})) || []).map(e => e.amount != null ? {...e, amount: resolveEffectAmount(e.amount, facts, model || {})} : copy(e));
    let costs = [], effects = [], weights = null;
    try {
        costs = resolveSimulationCostKeys(test || {state, gameplay: context.gameplay || {}},resolve(d.costs),context); effects = resolve(d.effects); if(d.outcomes) weights = resolveOutcomeWeights(d.outcomes, facts, model || {});
        if(rehearse) {
        applySimulationEffects(test, costs, context, registry, "preview", {spending: true});
        if(d.claim && !s.claims[d.claim]) applySimulationEffects(test,[{type:"claim",operation:"acquire",key:d.claim}],context,registry,"preview");
        for(const [index,possible] of (d.outcomes || [{effects:[]}]).entries()) {
            if(weights && weights[index] === 0) continue;
            const candidate = trial(test);
            applySimulationEffects(candidate,prepareSimulationEffects([...effects,...(possible.effects || [])],facts,registry,"preview",model || {}),context,registry,"preview");
            validateSimulationState(candidate.state.simulation,candidate.state,registry.simulation);
        }
        }
    }
    catch(error) {reasons.push(error.message);}
    return {id: d.id, label: d.label, description: d.description || "", visible: meets(d.visibleWhen, facts), eligible: !reasons.length && meets(d.visibleWhen, facts),
        reasons, costs, duration: commandDuration(state, d, context.actorId), effects, weights, revision: d.revision, model, ...(harm?.modifiers.length ? {harm: harm.modifiers} : {})};
}

function startCommand(out, registry, commandId, context, immediatePreview, contexts = {}) {
    const state = out.state, s = state.simulation, d = registry.simulation.commands.get(commandId);
    guardSteamDFAdmission(state,d,context);
    guardSteamBOHAdmission(state,d,context);
    guardSteamONIAdmission(state,d,context);
    guardSteamLambAdmission(state,d,context);
    assert(d, 'Unknown living-world command.');
    if(d.group?.startsWith('world_completion_')&&context.actorId==='player')assert(context.worldCompletionHost===true,'Use the current connected-world controls and their physical quote.');
    if(d.group==='world_completion_lens')assert(context.worldCompletionLensHost===true&&context.worldCompletionLensCommandId===d.id&&context.worldCompletionLensPreview!==true,'Lens work needs its actual host quote, not a preview.');
    assert(!['status_care','field_care'].includes(d.group) || (d.group==='status_care'?context.statusCareHost:context.fieldCareHost) === true, 'Care requires its current native body, equipment and status quote.');
    assert(d.group !== 'causal_story' || context.actorId !== 'player' || context.causalStoryHost === true,
        'Original causal choices require their current trusted host quote; internal sever jobs are not public commands.');
    assert(d.group !== 'book_care' || context.actorId !== 'player' || context.bookCareHost === true, 'Book care requires its current source-world body, equipment and service quote.');
    assert(!['lore_work','lore_warning'].includes(d.group) || context.actorId !== 'player' || context.lorePracticeHost === true, 'Local commitments require their current situation and observation quote.');
    assert(d.id!=='lore.warning.exposure_job'||context.lorePracticeHost===true&&context.loreExposureHost===true&&context.loreExposureDescriptor, 'Only the actual entrusted-stave host admits the remaining rain reservation.');
    lorePracticeAdmissionGuard(state,d,context);
    // Scheduler callers just computed this preview synchronously on this same
    // plan. Reuse it only here, before any mutation; never cache a player quote.
    const preview = immediatePreview || previewCommand(state, registry, commandId, {...context, external: out.external, gameplay: out.gameplay}, false);
    assert(preview.eligible, preview.reasons.join(" ") || "This command is hidden.");
    foundationInteractionProbeGuard(state,d,context);
    admitFoundationInteraction(state,[...(d.effects||[]),...(d.outcomes||[]).flatMap(o=>o.effects||[])],context);
    const cause = `simulation:${++state.sequence}`;
    if(d.group === "pursuit")s.schema=Math.max(s.schema,2);
    if(context.actorId === "player" && context.facts?.location) s.people.player.location = context.facts.location;
    const frozenContext = {actorId: context.actorId, targetId: context.targetId || null, partyIds: copy(s.party)};
    // Frozen effects read facts only through formula amounts (preview effects are
    // already resolved). Build them here, before costs, only when one exists.
    const formula = [...preview.effects, ...(d.outcomes || []).flatMap(o => o.effects || [])].some(e => e?.amount != null && typeof e.amount !== "number");
    if(!formula && context.targetId) person(state, context.targetId);
    const facts = formula ? simulationFacts(state, context, registry) : {};
    applySimulationEffects(out, preview.costs, context, registry, cause, {spending: true});
    recordRemainderSupplyCommandCommit(state,d.id,context.actorId,cause);
    if(d.claim) applySimulationEffects(out, [{type: "claim", operation: "acquire", key: d.claim}], context, registry, cause);
    let chosen = [], roll = null, outcomeId = null;
    if(d.outcomes) {
        const check = {rng: s.seed};
        roll = draw(check); const total = preview.weights.reduce((n,w) => n + w, 0); let at = 0;
        let index = preview.weights.findIndex(w => (at += w / total) > roll);
        if(index < 0) index = preview.weights.findLastIndex(w => w > 0);
        chosen = d.outcomes[index].effects || []; outcomeId = d.outcomes[index].id; s.seed = check.rng;
    }
    const effects = freezeFoundationInteractionActivation(state,prepareSimulationEffects([...preview.effects, ...chosen], facts, registry, cause, preview.model || {}),context);
    if(d.group === "original_frontier") {
        s.schema = Math.max(s.schema, 4);
        const returns = new Map();
        for(const cost of preview.costs) if(cost.type === "item") {
            const key = JSON.stringify([participant(cost.actor,context),cost.key]); returns.set(key,(returns.get(key) || 0)-cost.amount);
        }
        for(const effect of effects) if(effect.type === "item" && effect.amount > 0) {
            const key = JSON.stringify([participant(effect.actor,context),effect.key]), count = returns.get(key) || 0;
            if(count >= effect.amount) {effect.reservationReturn = true; returns.set(key,count-effect.amount);}
        }
    }
    if(d.powerId) {
        const p = s.powers[context.actorId][d.powerId]; p.executions++; p.readyAt = state.clock + (registry.simulation.powers.get(d.powerId).cooldown || 0);
    }
    // Freeze all outcomes with positive weight from the same pre-cost facts.
    for(const [index, possible] of (d.outcomes || [{effects: []}]).entries()) {
        if(preview.weights && preview.weights[index] === 0) continue;
        const candidate = trial(out);
        applySimulationEffects(candidate, prepareSimulationEffects([...preview.effects, ...(possible.effects || [])], facts, registry, cause, preview.model || {}), context, registry, cause);
        validateSimulationState(candidate.state.simulation, candidate.state, registry.simulation);
    }
    const job = {id: cause, sequence: state.sequence, commandId: d.id, revision: d.revision, actorId: context.actorId, targetId: context.targetId || null,
        due: state.clock + preview.duration, effects, costs: copy(preview.costs), cancellation: d.cancellation || "none", siteId: d.siteId || null,
        claim: d.claim || null, label: d.label, roll, outcomeId, context: frozenContext, participants: commandParticipants(d,context,s)};
    if(d.reservationReturns === 1 || ["original_frontier","repositories","feature_objects","feature_society","tidemark","subtlety_relay","nested_campaign","nested_chains","nested_life","book_paradise","book_paradise_npc","book_mol","book_mol_npc","book_paradise_campaign","book_paradise_campaign_npc","reference_gameplay","nethack_fieldcraft","audit_fixture","audit_lesson","remainder_livelihood","remainder_home","remainder_offers","remainder_consequences","remainder_combat_fit","remainder_combat_objectives","causal_story","causal_story_npc","game_absorption_assay"].includes(d.group)) {s.schema=Math.max(s.schema,4);job.reservationReturns = 1;}
    if(d.completionRequires || d.completionCoLocated != null) {
        s.schema = Math.max(s.schema, 4);
        job.completionSupport = {schema: 1, requires: copy(d.completionRequires || null), coLocated: !!d.completionCoLocated,
            location: context.facts?.location || s.people[context.actorId].location, failure: d.completionFailure || "refund"};
    }
    if(d.audience) job.audience = d.audience.map(id => participant(id,context));
    stampSteamDFAcceptedJob(state,job,context);
    stampSteamBOHAcceptedJob(state,job,context);
    stampNethackFieldcraftJob(state,job);
    stampManagementJob(state,job);
    stampSteamONIAcceptedJob(state,job,context);
    stampSteamLambAcceptedJob(state,job,context);
    stampLorePracticeJob(state,job,context);
    stampWorldCompletionAcceptedJob(state,job,context);
    stampAgreedDutyContinuationJob(state,job);
    if(d.encounterId) {
        assert(!d.duration && !(d.effects || []).length, "Encounters start without overlapping jobs.");
        const encounter = registry.simulation.encounters.get(d.encounterId);
        s.sessions[context.actorId] = {id: cause, definitionId: encounter.id, revision: encounter.revision, targetId: context.targetId || null,
            commandId: d.id, claim: d.claim || null, turns: copy(encounter.turns), turn: 0, lethal: encounter.lethal, settlement: copy(encounter.settlement || []), answers: []};
        s.sessions[context.actorId].partyIds = copy(s.party);
        s.sessions[context.actorId].participants = job.participants;
        if(d.pursuitId) {const p=s.pursuits[d.pursuitId];p.status="encounter";p.due=null;s.sessions[context.actorId].pursuitId=d.pursuitId;}
    } else if(job.due > state.clock) {s.jobs.push(job); if(job.siteId) s.sites[job.siteId].reservations[job.id] = job.actorId;}
    else completeJob(out, job, registry, effects.some(e=>e.type==='container'||e.type==='relocate')?{[context.actorId]:context}:d.group?.startsWith('world_completion_')?{...contexts,[context.actorId]:context,player:contexts.player||context}:['causal_story','causal_story_npc'].includes(d.group) ?
        currentCausalStoryContexts(out,{...contexts,[context.actorId]:context}) : ['proto23','book_paradise_npc','book_mol','book_mol_npc','book_paradise_campaign','book_paradise_campaign_npc'].includes(d.group)?{[context.actorId]:context}:{});
    return job;
}
export function commitSimulationCommand(state, registry, command, context, expectedSequence = state.sequence) {
    assert(expectedSequence === state.sequence, "This living-world command is stale.");
    const definition=registry.simulation.commands.get(command.id);
    if(definition?.pursuitId) assert(command.requestId && command.requestId === state.simulation?.pursuits?.[definition.pursuitId]?.request?.id, "This interception request is stale.");
    const out = plan(state, context), job = startCommand(out, registry, command.id, context);
    if(job.due > state.clock) out.commitment = copy(job);
    initializeStoryletDecks(out.state);validateStoryletState(out.state);
    validateSimulationState(out.state.simulation, out.state, registry.simulation); return out;
}
function completeJob(out, job, registry, contexts = {}, beforeJob=null) {
    const state = out.state, s = state.simulation;
    if(completeLorePracticeJob(out,job,registry,contexts)) return;
    if(completeCausalStoryJob(out,job,registry,contexts)) return;
    const completionGroup=registry.simulation.commands.get(job.commandId)?.group;
    const wcContext=completionGroup?.startsWith("world_completion_")?worldCompletionJobContext(state,job,{...contexts[job.actorId],...job.context,external:out.external,gameplay:out.gameplay,vitals:out.vitals,equipment:out.equipment}):null;
    if(job.completionSupport) {
        const support = job.completionSupport, originalContext = {...contexts[job.actorId], ...job.context,...wcContext, frontierContribution:job.frontierContribution,
            ...(['book_mol','book_mol_npc'].includes(completionGroup)?{molAcceptedJob:job}:{}),
            ...(['book_paradise_campaign','book_paradise_campaign_npc'].includes(completionGroup)?{paradiseCampaignAcceptedJob:job}:{}),
            ...(registry.simulation.commands.get(job.commandId)?.group === 'audit_lesson' ? {auditWorkshopReservation: job} : {}),
            ...(job.commandId.startsWith('feature_society.duty.') ? {agreedDutyReservation:job} : {}),
            ...(registry.simulation.commands.get(job.commandId)?.group === 'game_absorption_assay' ? {gameAbsorptionReservation: job} : {}),
            ...(registry.simulation.commands.get(job.commandId)?.group === 'remainder_livelihood' ? {remainderLivelihoodReservation: job} : {}),
            ...(registry.simulation.commands.get(job.commandId)?.group === 'remainder_home' ? {auditRemainderHomeReservation: job} : {}),
            ...(completionGroup === 'home_furnishings' ? {homeFurnishingReservation: job} : {}),
            ...(completionGroup === 'proto23' ? {proto23AcceptedJob: job} : {}),
            external: out.external, gameplay: out.gameplay, vitals: out.vitals, equipment: out.equipment};
        const context=steamLambCompletionContext(state,job,steamONICompletionContext(state,job,steamBOHCompletionContext(state,job,steamDFCompletionContext(state,job,originalContext))));
        const location = context.facts?.location || s.people[job.actorId].location;
        const present = (job.participants || [job.actorId]).every(id => s.people[id]?.life === "alive" && state.actors[id]?.worldId === state.actors[job.actorId].worldId &&
            (!support.coLocated || (id === job.actorId ? location : id === "player" ? contexts.player?.facts?.location || s.people.player.location : s.people[id].location) === support.location));
        if(!present || !meets(support.requires, simulationFacts(state, context, registry, support.requires))) {
            const failureCause = `unsupported:${++state.sequence}`;
            if(support.failure === 'refund') applySimulationEffects(out, refundCosts(job.costs,job.reservationReturns === 1), wcContext||job.context, registry, failureCause);
            if(job.claim) delete s.claims[job.claim];
            if(job.siteId) delete s.sites[job.siteId].reservations[job.id];
            const program = s.programs[job.actorId];
            if(program?.commandId === job.commandId) {program.status = "paused"; program.reason = support.failure === 'refund' ? "Accepted work lost its required source, contact or consent; reserved inputs returned." : "Accepted work lost its required support; the disclosed paid effort remains spent."; if(support.failure === 'refund') program.remaining++;}
            if(["original_frontier.work_cave_protected","original_frontier.work_forest_protected"].includes(job.commandId)) state.actors.player.facts["original_frontier.control.encounterConsumed"] = false;
            applySimulationEffects(out,agreedDutyStoppedEffects(state,job),job.context,registry,failureCause);
            log(s, state.clock, `${job.label} stopped: required support was lost; ${support.failure === 'refund' ? 'reserved inputs returned' : 'disclosed paid costs remain spent'} and no result awarded.`, job.id);
            s.log.at(-1).audience = copy(job.audience || [job.actorId]);
            return;
        }
    }
    const containerContext=job.effects.some(e=>e.type==='container'||e.type==='relocate')?{...contexts[job.actorId],...job.context,external:out.external,gameplay:out.gameplay,vitals:out.vitals}:null;
    const effectContext=containerContext||wcContext||(['proto23','book_care_npc','book_paradise_npc','book_mol','book_mol_npc','book_paradise_campaign','book_paradise_campaign_npc','causal_story','causal_story_npc'].includes(completionGroup)?{...contexts[job.actorId],...job.context,...(['book_mol','book_mol_npc'].includes(completionGroup)?{molAcceptedJob:job}:{}),
            ...(['book_paradise_campaign','book_paradise_campaign_npc'].includes(completionGroup)?{paradiseCampaignAcceptedJob:job}:{}),external:out.external,gameplay:out.gameplay,vitals:out.vitals,vitalsByActor:out.vitals,equipment:out.equipment}:job.context);
    applySimulationEffects(out, job.effects, effectContext, registry, job.id);
    if(job.claim && s.claims[job.claim]?.status === "held") applySimulationEffects(out, [{type: "claim", operation: "settle", key: job.claim}], job.context, registry, job.id);
    const actor = state.actors[job.actorId]; actor.completed[job.commandId] = (actor.completed[job.commandId] || 0) + 1;
    recordCausalStoryJobCompletion(out,job,registry);
    recordWorldCompletionJobCompletion(beforeJob,out,job,registry,wcContext||{},applySimulationEffects);
    if(job.commandId === 'remainder_combat_fit.grip_practice') {const module = syncRemainderCombatFitCompletion(state); if(module != null) state.auditRemainder.modules.combat_fit = module;}
    if(job.siteId) delete s.sites[job.siteId].reservations[job.id];
    applySimulationEffects(out,agreedDutyCompletionEffects(state,job),job.context,registry,job.id);
    if(job.commandId==='feature_society.stop_future'&&!s.jobs.some(j=>j.commandId===agreedDutySelectedCommand(state)))applySimulationEffects(out,agreedDutyRefusalEffects(state),job.context,registry,job.id);
    log(s, state.clock, `${job.label} completed.`, job.id);
    if(job.audience) s.log.at(-1).audience = copy(job.audience);
    else if(["field","promise"].includes(registry.simulation.commands.get(job.commandId)?.group) && job.actorId !== "player") s.log.at(-1).audience = [job.actorId];
}
export function cancelSimulationJob(state, registry, jobId, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence, "This cancellation is stale.");
    const out = plan(state, context), s = out.state.simulation;
    const job = s.jobs.find(j => j.id === jobId && j.actorId === context.actorId);
    assert(job && job.cancellation !== "none", "This job cannot be cancelled.");
    if(job.cancellation === "refund") applySimulationEffects(out, refundCosts(job.costs,job.reservationReturns === 1), job.commandId.startsWith("world.completion.")?worldCompletionJobContext(out.state,job,{...context,...job.context,gameplay:out.gameplay,vitals:out.vitals,equipment:out.equipment}):job.context, registry, `cancel:${++out.state.sequence}`);
    else out.state.sequence++;
    if(job.siteId) delete s.sites[job.siteId].reservations[job.id];
    if(job.claim) {assert(s.claims[job.claim]?.status === "held", "Missing job claim."); delete s.claims[job.claim];}
    s.jobs = s.jobs.filter(j => j !== job);
    recordLorePracticeCancellation(out,job);
    applySimulationEffects(out,agreedDutyCancellationEffects(out.state,job),job.context,registry,`cancel:${out.state.sequence}`);
    // A settled routine stays settled when an unrelated job is cancelled.
    if(s.programs[context.actorId] && (s.programs[context.actorId].status !== "complete" || s.programs[context.actorId].commandId === job.commandId)) {
        const program=s.programs[context.actorId]; program.status = "paused";
        if(registry.simulation.commands.get(job.commandId)?.group === "original_frontier" && program.commandId === job.commandId)program.remaining++;
    }
    if(["original_frontier.work_cave_protected","original_frontier.work_forest_protected"].includes(job.commandId)) out.state.actors.player.facts["original_frontier.control.encounterConsumed"] = false;
    log(s, state.clock, `${job.label} cancelled; ${job.cancellation === "refund" ? "reserved inputs returned" : "spent inputs forfeited"}.`, `cancel:${out.state.sequence}`);
    validateSimulationState(s, out.state, registry.simulation); return out;
}

export function setSimulationProgram(state, registry, commandId, count, context, expectedSequence = state.sequence) {
    assert(!['status_care','field_care','book_care','book_care_npc','lore_work','lore_warning'].includes(registry.simulation.commands.get(commandId)?.group), 'Choose each care preparation deliberately; no care routine is registered.');
    assert(state.sequence === expectedSequence && natural(count) && count > 0 && count <= 10000, "Invalid or stale automation target.");
    const definition = registry.simulation.commands.get(commandId);
    if(definition?.group==='management')assert(context.managementHost===true&&count<=3&&definition.repeatable===true&&state.actors[context.actorId].completed[commandId]>0,'Learn this courtyard recipe and use its finite mandate controls.');
    assert(definition?.automatable && definition.duration > 0, "This command does not support automation.");
    const out = plan(state, context), s = out.state.simulation;
    assert(!s.programs[context.actorId] || s.programs[context.actorId].status !== "running", "Pause the existing routine first.");
    s.programs[context.actorId] = {commandId, remaining: count - 1, status: count === 1 ? "complete" : "running", targetId: context.targetId || null};
    out.commitment = copy(startCommand(out, registry, commandId, context)); validateSimulationState(s, out.state, registry.simulation); return out;
}
export function pauseSimulationProgram(state, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence, "Stale automation change."); const out = plan(state, context);
    const p = out.state.simulation?.programs[context.actorId]; assert(p, "No saved routine."); p.status = "paused"; out.state.sequence++; return out;
}
export function resumeSimulationProgram(state, registry, context, expectedSequence = state.sequence) {
    const saved = state.simulation?.programs[context.actorId];
    assert(saved?.status === "paused" && saved.remaining > 0, "No unfinished paused routine.");
    return setSimulationProgram(state, registry, saved.commandId, saved.remaining, {...context, targetId: saved.targetId}, expectedSequence);
}
export function advancePowerProgression(state, registry, advancementId, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence && !context.busy && !simulationOccupiesActor(state, context.actorId), "Stale or occupied advancement.");
    const d = registry.simulation.advancements.get(advancementId); assert(d, "Unknown advancement.");
    const facts = simulationFacts(state, context, registry); assert(meets(d.requires, facts), "Advancement prerequisites are missing.");
    const out = plan(state, context), tracks = out.state.simulation.progression[context.actorId] ||= {}, t = tracks[d.track] ||= {values: {}, branches: {}, receipts: {}};
    assert(!t.receipts[d.id] && (!d.exclusiveGroup || !Object.values(t.branches).some(b => b.group === d.exclusiveGroup)), "Advancement already received or incompatible branch selected.");
    for(const p of d.parents || []) assert(Object.values(tracks).some(t => t.receipts[p]), "Missing advancement parent.");
    const cause = `advance:${++out.state.sequence}`;
    applySimulationEffects(out, d.costs || [], context, registry, cause, {spending: true});
    applySimulationEffects(out, d.effects || [], context, registry, cause);
    t.branches[d.branch] = {group: d.exclusiveGroup || null, cause, at: state.clock}; t.receipts[d.id] = cause;
    validateSimulationState(out.state.simulation, out.state, registry.simulation); return out;
}

export function answerSimulationEncounter(state, registry, responseId, context, expectedSequence = state.sequence) {
    assert(!state.simulation?.sessions[context.actorId]?.nativeBattle, "Use the native duel controls for this encounter.");
    assert(state.sequence === expectedSequence, "This encounter response is stale.");
    const session = state.simulation?.sessions[context.actorId]; assert(session, "No active encounter.");
    const out = plan(state, context); answerEncounterInto(out, registry, responseId, context);
    validateSimulationState(out.state.simulation, out.state, registry.simulation); return out;
}
function answerEncounterInto(out, registry, responseId, context) {
    const state = out.state, session = state.simulation.sessions[context.actorId];
    assert(session, "No active encounter.");
    const next = session, frozen = next.turns[next.turn];
    const response = frozen.responses.find(r => r.id === responseId); assert(response, "Unknown encounter response.");
    const ctx = {...context, targetId: session.targetId, partyIds: session.partyIds || []}, facts = simulationFacts(state, ctx, registry); assert(meets(response.visibleWhen, facts) && meets(response.requires, facts), "Response requirements are missing.");
    foundationInteractionProbeGuard(state,registry.simulation.commands.get(session.commandId),ctx);
    admitFoundationInteraction(state,response.effects||[],ctx);
    const cause = `response:${++out.state.sequence}`;
    assert(next.lethal || !(response.effects || []).some(e => e.type === "life" && e.status === "dead"), "This encounter is nonlethal.");
    const costs = prepareSimulationEffects(response.costs, facts, registry, cause), effects = freezeFoundationInteractionActivation(state,prepareSimulationEffects(response.effects, facts, registry, cause),ctx);
    applySimulationEffects(out, costs, ctx, registry, cause, {spending: true});
    applySimulationEffects(out, effects, ctx, registry, cause);
    next.answers.push(responseId); next.turn++;
    if(next.turn === next.turns.length) {
        assert(next.lethal || !next.settlement.some(e => e.type === "life" && e.status === "dead"), "This encounter is nonlethal.");
        applySimulationEffects(out, next.settlement, ctx, registry, session.id);
        if(next.claim) applySimulationEffects(out, [{type:"claim",operation:"settle",key:next.claim}],ctx,registry,session.id);
        const id = session.commandId || session.definitionId, completed = out.state.actors[context.actorId].completed;
        completed[id] = (completed[id] || 0) + 1;
        delete out.state.simulation.sessions[context.actorId]; log(out.state.simulation, state.clock, "The encounter is resolved; its consequences remain.", session.id);
    }
}
export function withdrawSimulationEncounter(state, context, expectedSequence = state.sequence) {
    assert(!state.simulation?.sessions[context.actorId]?.nativeBattle, "Use the native duel withdrawal.");
    assert(state.sequence === expectedSequence && state.simulation?.sessions[context.actorId], "No current encounter or stale withdrawal.");
    const out = plan(state, context), session = out.state.simulation.sessions[context.actorId];
    if(session.pursuitId) {
        const p=out.state.simulation.pursuits[session.pursuitId];p.status="withdrawn";p.due=null;p.closedAt=out.state.clock;
    }
    if(session.claim) delete out.state.simulation.claims[session.claim];
    delete out.state.simulation.sessions[context.actorId]; out.state.sequence++; return out;
}

function occur(out, registry, d, check, roll) {
    const state = out.state, s = state.simulation, actorId = check.actorId || d.actorId || "player", targetId = check.targetId || d.targetId || null;
    const id = `occurrence:${++state.sequence}`, context = {actorId, targetId};
    const event = {id, definitionId: d.id, revision: d.revision, actorId, targetId, mode: d.mode, at: state.clock,
        expiresAt: d.lifetime ? state.clock + d.lifetime : null, status: d.mode === "ambient" ? "resolved" : "open", roll,
        label: d.label, responses: copy(d.responses || []), onExpire: copy(d.onExpire || []), discoveredBy: [], cause: check.cause || id};
    if(d.historyRef)event.historyRef=d.historyRef;
    if(d.storylet) {event.storylet={deck:d.storylet.deck,urgency:d.storylet.urgency,receipt:copy(check.receipt)};if(d.mode === "decision")event.nonBlocking=true;}
    applySimulationEffects(out, d.effects || [], context, registry, id);
    if(d.aware || d.public && actorId === "player") event.discoveredBy.push(actorId);
    if(d.public) {if(!event.discoveredBy.includes("player")) event.discoveredBy.push("player"); log(s, state.clock, d.label, id);}
    s.events[id] = event;
    // Terminal display instances can be pruned; permanent causes/claims survive.
    const terminals = Object.values(s.events).filter(e => e.status !== "open").sort((a,b) => a.at - b.at || a.id.localeCompare(b.id));
    while(terminals.length > 100) delete s.events[terminals.shift().id];
}
export function inspectSimulationEvents(state, observerId = "player") {
    return Object.values(state.simulation?.events || {}).filter(e => e.discoveredBy.includes(observerId)).map(copy);
}
export function discoverSimulationEvent(state, eventId, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence, "Stale event discovery."); const out = plan(state, context), e = out.state.simulation?.events[eventId];
    assert(e && state.actors[e.actorId].worldId === state.actors[context.actorId].worldId, "No discoverable local occurrence.");
    if(!e.discoveredBy.includes(context.actorId)) {e.discoveredBy.push(context.actorId); out.state.sequence++; log(out.state.simulation, state.clock, e.label, e.id);}
    return out;
}
export function respondSimulationEvent(state, registry, eventId, responseId, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence, "This event response is stale.");
    const out = plan(state, context); respondEventInto(out, registry, eventId, responseId, context);
    validateSimulationState(out.state.simulation, out.state, registry.simulation); return out;
}
function respondEventInto(out, registry, eventId, responseId, context) {
    const state = out.state, event = state.simulation?.events[eventId];
    assert(event?.status === "open" && event.discoveredBy.includes(context.actorId) && (event.expiresAt == null || event.expiresAt > state.clock), "Event is unavailable or unknown.");
    assert(context.actorId === event.actorId, "This response belongs to another actor.");
    const response = event.responses.find(r => r.id === responseId); assert(response, "Unknown event response.");
    assert(!context.busy, "Finish your current native activity before responding.");
    if(response.requiresIdle) assert(!simulationOccupiesActor(state,context.actorId) && !state.pending.some(j=>j.context.actorId === context.actorId) && !activePractice(state.actors[context.actorId]), "Finish your current activity before responding.");
    const ctx = {...context, targetId: event.targetId}, facts = simulationFacts(state, ctx, registry);
    if(event.definitionId===AFTERMATH_ID)assert(aftermathPersonPresent(state,event.historyRef,facts),'Wait for this traveler to return before comparing road signs.');
    assert(meets(response.requires, facts), "Response prerequisites are missing.");
    const before=structuredClone({external:out.external,gameplay:out.gameplay});
    const cause = `settle:${++state.sequence}`;
    const costs = prepareSimulationEffects(response.costs, facts, registry, cause), effects = prepareSimulationEffects(response.effects, facts, registry, cause);
    applySimulationEffects(out, costs, ctx, registry, cause, {spending: true});
    applySimulationEffects(out, effects, ctx, registry, cause);
    event.status = "resolved";
    event.response = {id:responseId,at:state.clock,cause};
    recordStoryletOutcome(out,event,{action:'storylet.response',result:responseId,cause,before});
    if(event.discoveredBy.includes("player")) log(state.simulation, state.clock, `${event.label}: ${response.label}.`, cause);
}

export function previewSimulationResponse(state, registry, choice, context) {
    const test = plan(state, context), reasons = [];
    try {
        if(choice.kind === "encounter") answerEncounterInto(test, registry, choice.responseId, context);
        else if(choice.kind === "event") respondEventInto(test, registry, choice.eventId, choice.responseId, context);
        else throw new Error("Unknown response kind.");
        validateSimulationState(test.state.simulation, test.state, registry.simulation);
    } catch(error) {reasons.push(error.message);}
    return {eligible: reasons.length === 0, reasons};
}

// One pass, no intermediate arrays. Math.min per value keeps the exact result of
// the former spread (NaN and -0 included) and the same filters.
const lorePendingJob = /^lore\.(?:work|warning)\./;
export function nextSimulationBoundary(state,{skipLoreJobs=false,skipCompletionJobs=false,skipCompletionCropChecks=false,controllerWakes=null}={}) {
    const s = state.simulation; if(!s) return Infinity;
    let at = Math.min(nextConstructBoundary(state),nextStoryletBoundary(state),nextFoundationInteractionBoundary(state),nextPursuitBoundary(state));
    for(const j of s.jobs) if((!skipLoreJobs||!lorePendingJob.test(j.commandId))&&(!skipCompletionJobs||!j.commandId.startsWith("world.completion."))) at = Math.min(at, j.due);
    for(const c of Object.values(s.checks)) if(!skipCompletionCropChecks||!["remainder_consequences.frost_warning","remainder_consequences.frost_settlement"].includes(c.definitionId)) at = Math.min(at, c.due);
    const queue=controllerWakes?createWakeQueue():null;
    for(const [id,c] of Object.entries(s.controllers)) if(s.people[c.actorId].life === "alive"&&(!skipCompletionJobs||c.definitionId!=="world.completion.learning.neri_controller")) {
        const due=controllerWakes?.get(id) ?? c.due;
        if(queue) {if(Number.isSafeInteger(due)) queue.register(id,due);}
        else at=Math.min(at,due);
    }
    if(queue) at=Math.min(at,queue.nextWake(state.clock)??Infinity);
    for(const e of Object.values(s.events)) if(e.status === "open" && e.expiresAt != null && (e.nonBlocking === true || e.mode !== "decision" || e.actorId !== "player" || !e.discoveredBy.includes("player"))) at = Math.min(at, e.expiresAt);
    for(const cs of Object.values(s.conditions)) for(const c of Object.values(cs)) at = Math.min(at, c.expiresAt != null && c.expiresAt > state.clock ? c.expiresAt : Infinity, c.nextTick ?? Infinity);
    for(const p of Object.values(s.people)) if(p.life === "alive" && p.lifePolicy) at = Math.min(at, p.bornAt + p.lifePolicy.lifespan);
    return at;
}
// The queue is disposable planning data, rebuilt after every kernel boundary.
// Stored actor facts with authored writers cannot change between boundaries.
// Derived facts (including unowned actor.* names) retain interval stepping.
const controllerFactKeys = new WeakMap();
function storedControllerFacts(registry) {
    let keys = controllerFactKeys.get(registry);
    if(!keys) {
        keys = new Set();
        for(const d of registry.simulation.commands.values()) for(const e of [...(d.costs || []), ...(d.effects || [])])
            if(e.type === 'fact' && e.scope === 'actor') keys.add(e.key);
        controllerFactKeys.set(registry, keys);
    }
    return keys;
}
function controllerGuard(rule, state, actorId, keys, context) {
    if(!rule) return null;
    if(rule.all || rule.any) {
        const children = (rule.all || rule.any).map(r => controllerGuard(r,state,actorId,keys,context));
        const deciding = children.filter(r => r && r.met === !rule.all);
        if(deciding.length) return {met:!rule.all, at:Math.min(...deciding.map(r => r.at))};
        if(children.some(r => !r)) return null;
        return {met:!!rule.all, at:Math.min(...children.map(r => r.at))};
    }
    if(rule.not) {
        // Unknown facts under negation have special semantics in evaluateRule.
        // Keep the ordinary scan rather than guessing that knownness.
        return null;
    }
    if(rule.fact === 'clock') {
        const value=rule.value, now=state.clock;
        if(!Number.isFinite(value)) return null;
        const met=meets(rule,{clock:now});
        const at=rule.op==='gte' ? (met?Infinity:Math.ceil(value))
            : rule.op==='lte' ? (met?Math.floor(value)+1:Infinity)
            : rule.op==='eq' ? (met?now+1:Number.isInteger(value)&&value>now?value:Infinity) : null;
        return at===null?null:{met,at};
    }
    if(!rule.fact?.startsWith('actor.')) return null;
    const key=rule.fact.slice(6);
    if(['life','world','location','busyOrder'].includes(key) || !keys.has(key)) return null;
    const facts=state.actors[actorId]?.facts;
    if(!Object.hasOwn(facts||{},key) && Object.hasOwn(context?.facts||{},rule.fact)) return null;
    return {met:meets(rule,Object.hasOwn(facts||{},key)?{[rule.fact]:facts[key]}:{}),at:Infinity};
}
export function controllerWakeTimes(state, registry, contexts = {}) {
    const wakes=new Map();
    if(!state.simulation) return wakes;
    // The first ordinary boundary also initializes existing lazy kernel state.
    // Preserve that boundary rather than introducing a second initializer here.
    if(!state.simulation.constructs) return wakes;
    // A running stock plan rechecks inventory, custody and native support at
    // existing boundaries. Those inputs can change outside actor-fact effects,
    // so retain the original controller polls while the plan has no job due.
    // An empty map restores existing due times; it creates no new timer when no
    // controller exists and accepted jobs retain their own completion boundary.
    if(Object.values(state.simulation.workPlans?.cursors || {}).some(c => c.status === 'running' && c.stockPolicy && !c.accepted)) return wakes;
    const keys=storedControllerFacts(registry);
    for(const [id,c] of Object.entries(state.simulation.controllers)) {
        if(c.interval!==1 || state.simulation.people[c.actorId]?.life!=='alive') continue;
        const d=registry.simulation.controllers.get(c.definitionId||id);
        if(!d) continue;
        let at=Infinity;
        for(const a of d.actions) {
            const guard=controllerGuard(a.when,state,c.actorId,keys,contexts[c.actorId]);
            if(!guard || guard.met) {at=c.due;break;}
            at=Math.min(at,guard.at);
        }
        // Keep the original polling phase, including overdue input handling.
        at=Math.max(c.due,at);
        wakes.set(id,at);
    }
    return wakes;
}
export function settleDeferredControllerWakes(state,wakes,at,inclusive=false) {
    for(const [id,wake] of wakes) {
        const c=state.simulation.controllers[id];
        if(wake<=c.due || c.due>at) continue;
        // No action was possible at the omitted polls. Preserve saved due bytes
        // and allow mutations earlier in this boundary to enable its due scan.
        c.due+=Math.max(0,Math.ceil((at-c.due+(inclusive?1:0))/c.interval))*c.interval;
    }
}
// previewCommand adds these reasons from state alone, so the quote is ineligible
// whatever the facts say. Controllers read only eligibility and skip the facts
// projection (the costly part of a quote) when one of them already applies.
function surelyIneligible(state, registry, commandId, context) {
    const d = registry.simulation.commands.get(commandId), s = state.simulation, p = s?.people[context.actorId], a = state.actors[context.actorId];
    if(!d || !p || !a) return false;
    if(d.actorId && d.actorId !== context.actorId || d.actorDefinitionId && d.actorDefinitionId !== p.definitionId) return true;
    if(d.worldId && a.worldId !== d.worldId || d.location && (context.facts?.location || p.location) !== d.location || d.targetId && d.targetId !== context.targetId) return true;
    if(context.busy || state.pending.some(j => j.context.actorId === context.actorId) || activePractice(a) || simulationOccupiesActor(state, context.actorId)) return true;
    if(d.once && a.completed[d.id] || d.claim && s.claims[d.claim]) return true;
    return !!d.siteId && (!s.sites[d.siteId] || Object.keys(s.sites[d.siteId].reservations).length >= s.sites[d.siteId].capacity);
}
// Registry controller definitions are deep-frozen, so their candidate order is
// computed once per definition instead of re-serializing ties every boundary.
const controllerOrders = new WeakMap();
function controllerOrder(d) {
    if(!Object.isFrozen(d) || !Object.isFrozen(d.actions)) return [...d.actions].sort((a,b) => b.priority - a.priority || JSON.stringify(a).localeCompare(JSON.stringify(b)));
    let order = controllerOrders.get(d);
    if(!order) controllerOrders.set(d, order = [...d.actions].sort((a,b) => b.priority - a.priority || JSON.stringify(a).localeCompare(JSON.stringify(b))));
    return order;
}
// Called by the existing common-clock scheduler. Jobs settle before expiring
// offers, event checks and actor decisions, then eligible routines reserve inputs.
export function advanceSimulationBoundary(out, registry, contexts = {}) {
    const state = out.state, s = state.simulation; if(!s) return 0;
    out.unlocks ||= []; out.acquisitions ||= [];
    advanceNativeContainerClocks(out,registry,contexts);
    contexts = currentCausalStoryContexts(out,contexts);
    invalidateCausalStorySupport(out,registry,contexts);
    let work = advanceFoundationInteractions(state);
    const loreSupported=lorePracticeTimersSupported(state,{...contexts,player:{...contexts.player,gameplay:out.gameplay,vitals:out.vitals,equipment:out.equipment}});
    const wcSupported=worldCompletionTimersSupported(state,{...contexts,player:{...contexts.player,gameplay:out.gameplay,vitals:out.vitals,equipment:out.equipment}});
    for(const j of s.jobs.filter(j => j.due <= state.clock && (loreSupported || !/^lore\.(?:work|warning)\./.test(j.commandId)) && (wcSupported || !j.commandId.startsWith("world.completion."))).sort((a,b) => a.due - b.due || a.sequence - b.sequence)) {
        const beforeJob=j.commandId.startsWith("world.completion.")?cloneData(state):null;
        s.jobs = s.jobs.filter(job => job.id !== j.id); completeJob(out, j, registry, contexts,beforeJob); work++;
    }
    reconcileRemainderConsequences(out,registry,contexts.player || {});
    reconcileWorldCompletionPlan(out,registry,contexts);
    work += advanceConstructs(out,registry,{readInventory:inventory,writeInventory});
    for(const [actorId,cs] of Object.entries(s.conditions)) for(const [id,c] of Object.entries(cs)) {
        if(c.expiresAt != null && c.expiresAt <= state.clock) delete cs[id];
        else if(c.nextTick != null && c.nextTick <= state.clock) {
            c.nextTick += c.interval;
            applySimulationEffects(out, c.onTick, {actorId}, registry, `condition:${++state.sequence}`); work++;
        }
    }
    for(const [actorId,p] of Object.entries(s.people)) if(p.life === "alive" && p.lifePolicy && p.bornAt + p.lifePolicy.lifespan <= state.clock) {
        const cause = `life:${++state.sequence}`; p.life = p.lifePolicy.ending; p.lifeCause = {at: state.clock, cause, reason: "Authored old-age ending"};
        if(p.lifePolicy.work !== "finish") for(const job of s.jobs.filter(j => j.actorId === actorId)) {
            if(p.lifePolicy.work === "refund") applySimulationEffects(out, refundCosts(job.costs), job.context, registry, cause);
            if(job.siteId) delete s.sites[job.siteId].reservations[job.id];
            if(job.claim) delete s.claims[job.claim];
            s.jobs = s.jobs.filter(j => j.id !== job.id);
        }
        if(s.programs[actorId]) s.programs[actorId].status = "paused";
        delete s.sessions[actorId]; log(s,state.clock,`${actorId}'s local life ended.`,cause); work++;
    }
    for(const e of Object.values(s.events).sort((a,b) => a.at - b.at || a.id.localeCompare(b.id))) if(e.status === "open" && (e.nonBlocking === true || e.mode !== "decision" || e.actorId !== "player" || !e.discoveredBy.includes("player")) && e.expiresAt != null && e.expiresAt <= state.clock) {
        applySimulationEffects(out, e.onExpire, {actorId: e.actorId, targetId: e.targetId}, registry, `expire:${++state.sequence}`); e.status = "expired"; work++;
    }
    for(const [id,c] of Object.entries(s.checks).sort(([a],[b]) => a.localeCompare(b))) if(c.due <= state.clock) {
        const d = registry.simulation.events.get(c.definitionId || id); assert(d, "Unsupported event director.");
        c.due += c.interval; c.count++;
        const actorId = c.actorId || d.actorId || "player", ctx = {...contexts[actorId], actorId, targetId: c.targetId || d.targetId || null, vitals: out.vitals};
        const facts = {...simulationFacts(state, ctx, registry, [d.requires]), "event.misses": c.misses || 0, "event.attempts": c.attempts || 0, "event.occurrences": c.occurrences || 0};
        if(s.people[actorId].life === "alive" && (d.maxOccurrences == null || (c.occurrences || 0) < d.maxOccurrences) && meets(d.requires, facts) && !Object.values(s.events).some(e => e.definitionId === d.id && e.actorId === actorId && e.status === "open")) {
            const chance = resolveEffectAmount(d.chance ?? 1, facts);
            assert(chance >= 0 && chance <= 1, "Event chance must be within zero and one.");
            const roll = draw(c), guaranteed = d.guaranteeAfter != null && (c.misses || 0) + 1 >= d.guaranteeAfter;
            c.attempts = (c.attempts || 0) + 1;
            if(guaranteed || roll < chance) {occur(out, registry, d, c, roll); c.occurrences = (c.occurrences || 0) + 1; c.misses = 0;}
            else c.misses = (c.misses || 0) + 1;
        }
        if(d.maxOccurrences != null && (c.occurrences || 0) >= d.maxOccurrences) delete s.checks[id]; work++;
    }
    work+=advanceStoryletDecks(state,registry,d=>simulationFacts(state,{...contexts.player,actorId:'player',targetId:d.targetId || null,external:out.external,gameplay:out.gameplay},registry),
        (d,receipt)=>occur(out,registry,d,{receipt},receipt.roll));
    work+=advancePursuits(out,contexts,(costs,ctx,cause)=>applySimulationEffects(out,costs,ctx,registry,cause,{spending:true}),(p,text)=>{
        applySimulationEffects(out,[{type:"knowledge",key:p.policy.noticeKey || "pursuit.notice",stage:"seen",value:text}],{actorId:p.targetId},registry,p.request?.id || p.id);
        log(s,state.clock,text,p.request?.id || p.id);s.log.at(-1).audience=[p.targetId];
    });
    contexts = currentCausalStoryContexts(out,contexts);
    advanceCausalStoryBoundary(out,registry,contexts);
    for(const [id,c] of Object.entries(s.controllers).sort(([a],[b]) => a.localeCompare(b))) if(s.people[c.actorId].life === "alive" && c.due <= state.clock) {
        const d = registry.simulation.controllers.get(c.definitionId || id); assert(d, "Unsupported actor controller."); c.due += c.interval; work++;
        if(s.people[c.actorId].life !== "alive") continue;
        // Nothing mutates state until a candidate acts (then the scan stops), so
        // facts for one target are built once and reused by later candidates.
        const scanFacts = new Map();
        const targetFacts = ctx => {
            const targetId = s.people[ctx.targetId] ? ctx.targetId : null;
            if(!scanFacts.has(targetId)) scanFacts.set(targetId, simulationFacts(state, {...ctx, targetId}, registry));
            return {...scanFacts.get(targetId)};
        };
        for(const candidate of controllerOrder(d)) {
            const kind = candidate.kind || "command";
            const ctx = {...contexts[c.actorId], actorId: c.actorId, targetId: candidate.targetId || null, gameplay: out.gameplay, external: out.external, vitals: out.vitals, equipment: out.equipment};
            if(candidate.when && !meets(candidate.when, ctx.targetId && !s.people[ctx.targetId] ? simulationFacts(state, ctx, registry) : targetFacts(ctx))) continue;
            if(kind === "command") {
                if(surelyIneligible(state, registry, candidate.commandId, ctx)) continue;
                const preview = previewCommand(state, registry, candidate.commandId, ctx, true, targetFacts(ctx));
                if(!preview.eligible) continue;
                startCommand(out, registry, candidate.commandId, ctx, preview, contexts);
            } else {
                if(kind === "encounter" && s.sessions[c.actorId]?.definitionId !== candidate.encounterId) continue;
                const event = kind === "event" ? Object.values(s.events).filter(e => e.actorId === c.actorId && e.definitionId === candidate.eventId && e.status === "open").sort((a,b) => a.at - b.at || a.id.localeCompare(b.id))[0] : null;
                if(kind === "event" && !event) continue;
                const choice = {...candidate, eventId: event?.id};
                if(!previewSimulationResponse(state, registry, choice, ctx).eligible) continue;
                if(kind === "encounter") answerEncounterInto(out, registry, candidate.responseId, ctx);
                else respondEventInto(out, registry, event.id, candidate.responseId, ctx);
            }
            c.lastAction = {at:state.clock, kind, subject: candidate.commandId || candidate.encounterId || candidate.eventId}; break;
        }
    }
    for(const [actorId,p] of Object.entries(s.programs).sort(([a],[b]) => a.localeCompare(b))) if(p.status === "running" && !simulationOccupiesActor(state, actorId) && !state.pending.some(j => j.context.actorId === actorId)) {
        const ctx = {...contexts[actorId], actorId, targetId: p.targetId, gameplay: out.gameplay, external: out.external, vitals: out.vitals};
        if(p.remaining === 0) p.status = "complete";
        else {
            const preview = previewSimulationCommand(state, registry, p.commandId, ctx);
            if(preview.eligible) {startCommand(out, registry, p.commandId, ctx, preview, contexts); p.remaining--; if(!p.remaining) p.status = "complete"; work++;}
            else {p.status = "paused"; p.reason = "Next reserved inputs, funding, capacity, support or access are unavailable."; log(s, state.clock, "Routine paused: its next inputs, capacity or access are unavailable.", `routine:${++state.sequence}`);}
        }
    }
    work += advanceWorkPlansBoundary(out,registry,contexts);
    reconcileRemainderConsequences(out,registry,contexts.player || {});
    return work;
}

export function previewCampaignTransition(state, registry, transitionId, context) {
    const d = registry.simulation.transitions.get(transitionId); assert(d, "Unknown campaign transition.");
    const facts = simulationFacts(state, context, registry), actorId = context.actorId, s = state.simulation;
    for(const id of [actorId,...(d.party === 'carry' ? s.party.filter(id => id !== actorId) : [])]) {
        const reasons = causalStoryTravelReasons(state,id); assert(!reasons.length,reasons.join(' '));
    }
    assert(!Object.values(s.pursuits || {}).some(p=>["investigating","moving","searching","waiting","sheltered","encounter"].includes(p.status)), "Close active pursuits before changing worlds or resetting this life.");
    assert(!context.busy && (!simulationOccupiesActor(state, actorId) || d.kind === "rebirth" && !s.sessions[actorId] && !s.jobs.some(j => j.actorId === actorId)) && !state.pending.length && !s.jobs.length && !Object.keys(s.sessions).length && !waitingSimulationChoice(state) && !state.chronicle?.session, "Transitions need a safe boundary.");
    assert(meets(d.requires, facts), "Transition prerequisites are missing.");
    assert(registry.worlds.has(d.worldId), "Destination world has no registered content.");
    return {id: transitionId, kind: d.kind, sequence: state.sequence, worldId: d.worldId, lost: copy(d.reset || []), retained: copy(d.retain || []), description: d.description || d.label};
}
export function commitCampaignTransition(state, registry, transitionId, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence, "Transition preview is stale."); const preview = previewCampaignTransition(state, registry, transitionId, context);
    const out = plan(state, context), d = registry.simulation.transitions.get(transitionId), s = out.state.simulation, actorId = context.actorId, cause = `transition:${++out.state.sequence}`;
    applySimulationEffects(out, d.costs || [], context, registry, cause, {spending: true});
    if(d.reset?.includes("journey")) out.state.journey = {facts: {}, resources: {}, completed: {}, id: `journey:${out.state.sequence}`};
    if(d.reset?.includes("world")) out.state.worlds[d.worldId] = {facts: {}, resources: {}, completed: {}};
    for(const key of d.reset || []) if(["knowledge", "powers", "progression", "relationships", "conditions", "equipment"].includes(key)) delete s[key][actorId];
    if(d.reset?.includes("resources")) out.state.actors[actorId].resources = copy(d.resources || {});
    if(d.reset?.includes("actorFacts")) out.state.actors[actorId].facts = {};
    if(d.reset?.includes("completions")) out.state.actors[actorId].completed = {};
    if(d.reset?.includes("sources")) {out.state.actors[actorId].sources = {}; delete s.faculties[actorId];}
    if(d.reset?.includes("techniques")) out.state.actors[actorId].techniques = {};
    if(d.reset?.includes("body")) {delete s.people[actorId].body; delete s.people[actorId].vitals;}
    if(d.reset?.includes("relationships")) for(const relations of Object.values(s.relationships)) delete relations[actorId];
    if(d.kind === "rebirth") {
        s.people[actorId].life = "alive"; s.people[actorId].bornAt = state.clock;
        if(out.state.chronicle) {assert(d.chroniclePolicy === "end", "Rebirth must declare its chronicle policy."); out.state.chronicle = null;}
    }
    out.state.worlds[d.worldId] ||= {facts: {}, resources: {}, completed: {}};
    const companions = s.party.filter(id => id !== actorId);
    if(d.party === "carry") for(const id of companions) {assert(s.people[id].life === "alive", "An unavailable companion cannot travel."); out.state.actors[id].worldId = d.worldId; s.people[id].location = d.location || s.people[id].location;}
    else s.party = s.party.filter(id => id === actorId);
    out.state.actors[actorId].worldId = d.worldId;
    if(d.location) s.people[actorId].location = d.location;
    for(const program of Object.values(s.programs)) program.status = "paused";
    // Campaign claims, RNG streams, causes and prior receipts deliberately stay.
    // Historical reversal of other domains requires an explicit isolated snapshot.
    if(d.nativePatch || d.reset?.includes("native")) {
        assert(context.nativeEnvelope && d.nativePatch, "This transition needs an authored native save projection.");
        out.replacementEnvelope = copy(context.nativeEnvelope);
        out.nativePatch = copy(d.nativePatch);
        for(const [path,value] of Object.entries(d.nativePatch)) {
            const parts = path.split("/"); assert(parts.length && parts.every(p => p && !["__proto__", "constructor", "prototype"].includes(p)) && !["expansion", "retired_content", "game version", "saved_at"].includes(parts[0]), "Invalid native transition path.");
            let target = out.replacementEnvelope;
            for(const key of parts.slice(0,-1)) {assert(target[key] != null && typeof target[key] === "object", "Missing native reset domain."); target = target[key];}
            target[parts.at(-1)] = copy(value);
        }
        out.reloadRequired = true;
    }
    applySimulationEffects(out, d.effects || [], context, registry, cause);
    s.transitions.push({...preview, at: state.clock, cause}); s.transitions = s.transitions.slice(-32);
    log(s, state.clock, d.label, cause); validateSimulationState(s, out.state, registry.simulation); return out;
}
export function chooseSimulationOrigin(state, registry, originId, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence && !state.simulation?.claims["origin.selected"], "Origin already selected or command stale.");
    const d = registry.simulation.origins.get(originId); assert(d && meets(d.requires, simulationFacts(state, context, registry)), "Unavailable origin.");
    const out = plan(state, context), cause = `origin:${++out.state.sequence}`;
    applySimulationEffects(out, [{type: "claim", key: "origin.selected", operation: "acquire"}, ...(d.effects || [])], context, registry, cause);
    out.state.simulation.claims["origin.selected"].status = "settled";
    validateSimulationState(out.state.simulation, out.state, registry.simulation); return out;
}

export function inspectActorChoices(state, registry, actorId, context = {}) {
    person(state, actorId);
    return {actorId, sequence: state.sequence, worldId: state.actors[actorId].worldId,
        knowledge: copy(state.simulation.knowledge[actorId] || {}),
        actions: [...registry.simulation.commands.values()].filter(d => !d.actorId || d.actorId === actorId)
            .map(d => previewSimulationCommand(state,registry,d.id,{...context,actorId,targetId:d.targetId || context.targetId || null}))
            .filter(p => p.visible).map(p => ({id:p.id,label:p.label,eligible:p.eligible,reasons:p.reasons}))};
}
// An optional external planner proposes a registered command, never effects or
// arbitrary executable text. Accepted commands use the same legal-action gate.
export function acceptActorProposal(state, registry, proposal, context) {
    assert(proposal && stableId(proposal.actorId) && stableId(proposal.commandId) && natural(proposal.sequence), "Invalid actor proposal.");
    assert(!proposal.effects && !proposal.costs && !proposal.sourceCode, "Actor proposals cannot prescribe authoritative effects.");
    return commitSimulationCommand(state,registry,{id:proposal.commandId},{...context,actorId:proposal.actorId,targetId:proposal.targetId || null},proposal.sequence);
}
