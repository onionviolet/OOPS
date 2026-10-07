import {validateContextualBalmState} from './contextual_balm_facts.js';
import {validateCoolingRefinement} from './cooling_refinement_facts.js';
import {validateAgreedDutyState} from './agreed_duty_facts.js';
import {validateGameAbsorptionAssay} from './game_absorption_assay_facts.js';
import {validateHomeFurnishings} from './home_furnishing_facts.js';
import {validateCrushSocial} from './crush_social_host.js';
import {validateProto23State,syncProto23Clock,nextProto23Boundary} from './proto23_world_state.js';
import {proto23SimulationContexts} from './proto23_world_host.js';
import {reconcileParadiseCampaignDepthRuntime,validateParadiseCampaignDepthControllers} from './book_world_paradise_campaign_runtime.js';
import {validateParadiseCampaignDepthState} from './book_world_paradise_campaign_facts.js';
import {worldCompletionCropClockSupported} from './world_completion_crop_clock.js';
import {validateWorldCompletionState,worldCompletionContext} from './world_completion_facts.js';
import {worldCompletionTimersSupported,retainWorldCompletionWindows,nextWorldCompletionBoundary,worldCompletionSimulationContexts,reconcileWorldCompletionPlan} from './world_completion_runtime.js';
import {validateLorePractice} from './lore_practice_facts.js';
import {retainLorePracticeWindows,nextLorePracticeBoundary,lorePracticeTimersSupported,lorePracticeSimulationContexts,reconcileLorePractice} from './lore_practice_runtime.js';
import {validateBookCareState} from './book_care_facts.js';
import {reconcileBookCareRuntime} from './book_care_runtime.js';
import {validateFieldCareState} from './field_care_facts.js';
import {validateStatusCareState} from './status_care_facts.js';
import {advanceAuditRemainder,retainAuditRemainderWindows,auditRemainderSimulationContexts} from './audit_remainder_runtime.js';
import {validateCausalStories} from './causal_story_core.js';
import {causalStorySimulationContexts, nextCausalStoryBoundary, reconcileCausalStoryPlan} from './causal_story_host.js';
import {validateAuditRemainderProjects} from './audit_remainder_facts.js';
import {AUDIT_REMAINDER_ENGINE_SCHEMA,validateAuditRemainder} from './audit_remainder_state.js';
import {BOOK_WORLD_ENGINE_SCHEMA,validateParadiseCampaignState,syncParadiseClock,nextParadiseBoundary} from './book_world_paradise_state.js';
import {paradiseSimulationContexts} from './book_world_paradise_host.js';
import {validateMolCampaignState,syncMolClock,nextMolBoundary} from './book_world_mol_state.js';
import {molSimulationContexts} from './book_world_mol_host.js';
import {validateBacklogState} from './backlog_expansion_host.js';
import {validateInkNarrative} from './ink_narrative.js';
import {retainRepositoryAbsorptionWindows} from './repository_absorption_facts.js';
import {validateNestedLife} from './feature_expansion_nested_life.js';
import {validateNestedCampaignState,syncNestedCampaignClock,nextNestedCampaignBoundary,nestedSimulationContexts} from './feature_expansion_nested_host.js';
import {validateNestedChains,nestedChainSimulationContexts} from './feature_expansion_nested_chains_host.js';
import {validateRelayState} from './feature_expansion_subtlety_host.js';
import {validateReferenceDeskState} from './feature_expansion_reference_desk.js';
import {validateTidemarkState,syncTidemarkClock,nextTidemarkBoundary,tidemarkSimulationContexts} from './feature_expansion_destination_host.js';
import {validateFeatureObjectState} from './feature_expansion_objects_host.js';
import {validateWorkPlans,workPlanNextBoundary} from './feature_expansion_work_plan.js';
import {validateAuditedWorkshop} from './audited_workshop_facts.js';
import {validateReferenceGameplay,REFERENCE_ENGINE_SCHEMA} from './reference_gameplay_state.js';
import {validateRealmState,syncRealmClock,realmSimulationContexts,nextRealmActivityBoundary,expireRealmObservation} from './realm_state.js';
import {retainOriginalFrontierWindow} from './original_frontier_facts.js';
import {validateTechniqueDefinitions, validateTechniqueEffect, validateTechniqueRecords, applyTechniqueEffect, techniqueFacts, activePractice} from "./techniques.js";
import {evaluateRule, chooseOutcome} from "./rules.js";
import {validateCapabilityDefinitions, queryCapabilities} from "./capabilities.js";
import {validateGameplaySnapshot, validateGameplayEffect, applyGameplayEffect} from "./gameplay_transactions.js";
import {validateChronicle, advanceChronicle, nextChronicleBoundary, recordArchiveDuty} from "./chronicle.js";
import {validateSchedule, recurringWindow} from "./world_rhythm.js";
import {validateSimulationState, createSimulationRegistry} from "./simulation_contracts.js";
import {nextSimulationBoundary, advanceSimulationBoundary, waitingSimulationChoice, simulationOccupiesActor} from "./simulation.js";

// Definitions are immutable content; only this JSON namespace is persisted.
export const ENGINE_SCHEMA = 5;
// Only opted-in wave namespaces need this newer reader. Unenrolled saves keep5.
export const FEATURE_ENGINE_SCHEMA = 6;
export const NESTED_ENGINE_SCHEMA = 7;
export const CONTINUED_LIFE_ENGINE_SCHEMA = 8;
const scopes = ["campaign", "journey", "world", "actor", "scenario", "external"];
const clone = value => structuredClone(value);
const object = value => value && typeof value === "object" && !Array.isArray(value);
const id = value => typeof value === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !["__proto__", "constructor", "prototype"].includes(value);
const integer = value => Number.isSafeInteger(value) && value >= 0;
const domain = () => ({facts: {}, resources: {}, completed: {}});
const check = (condition, message) => {if(!condition) throw new Error(message);};

export function createExpansionState(seed = 1) {
    check(integer(seed) && seed <= 0xffffffff, "Invalid random seed.");
    return {schema: ENGINE_SCHEMA, sequence: 0, clock: 0, rng: seed || 1,
        campaign: domain(), journey: {...domain(), id: "journey-1"},
        worlds: {"base.frontier": domain()},
        actors: {player: {...domain(), worldId: "base.frontier", sources: {}, techniques: {}}}, scenarios: {},
        pending: [], opportunities: {}, history: [], checkpoints: {}, chronicle: null, simulation: null};
}

function validateDomain(value) {
    check(object(value) && object(value.facts) && object(value.resources) && object(value.completed), "Invalid state domain.");
    for(const [key, fact] of Object.entries(value.facts)) {
        check(id(key) && ["boolean", "string", "number"].includes(typeof fact) &&
            (typeof fact !== "number" || Number.isFinite(fact)), "Invalid saved fact.");
        if(key.startsWith("cycle.")) check(integer(fact), "Invalid saved recurring service claim.");
    }
    for(const [key, amount] of Object.entries(value.resources)) {
        check(id(key) && Number.isFinite(amount) && amount >= 0 && amount <= Number.MAX_SAFE_INTEGER, "Invalid saved resource.");
    }
    for(const [key, count] of Object.entries(value.completed)) check(id(key) && integer(count), "Invalid completion count.");
}

function validateResource(ref, cost = false) {
    check(object(ref) && scopes.includes(ref.scope) && id(ref.key), "Invalid resource reference.");
    check(Number.isFinite(ref.amount) && Math.abs(ref.amount) <= Number.MAX_SAFE_INTEGER &&
        (!cost || ref.amount > 0), "Invalid resource amount.");
}

function validateEffects(effects, registry) {
    check(Array.isArray(effects), "Effects must be an array.");
    for(const effect of effects) {
        if(effect.type === "resource") validateResource(effect);
        else if(effect.type === "fact") {
            check(scopes.includes(effect.scope) && effect.scope !== "external" && id(effect.key) &&
                ["boolean", "string", "number"].includes(typeof effect.value) &&
                (typeof effect.value !== "number" || Number.isFinite(effect.value)), "Invalid fact effect.");
        } else if(effect.type === "opportunity") {
            check(id(effect.id) && integer(effect.delay) && integer(effect.lifetime) && effect.lifetime > 0 &&
                typeof effect.blocking === "boolean", "Invalid opportunity effect.");
            if(registry) check(registry.opportunities.has(effect.id), `Unknown opportunity: ${effect.id}`);
        } else if(effect.type === "chronicle") check(effect.operation === "archive-duty", "Unsupported chronicle effect.");
        else if(["item", "xp", "reputation"].includes(effect.type)) validateGameplayEffect(effect);
        else if(effect.type === "technique") validateTechniqueEffect(effect, registry);
        else if(effect.type === "source") {
            check(effect.origin == null || ["unknown", "inherited", "trained", "acquired"].includes(effect.origin), "Invalid source origin.");
            check(id(effect.sourceId) && ["grant", "remove"].includes(effect.operation) &&
                (effect.duration == null || integer(effect.duration) && effect.duration > 0), "Invalid capability source effect.");
            if(registry) check(registry.sources.has(effect.sourceId), `Unknown source: ${effect.sourceId}`);
        } else throw new Error(`Unsupported effect: ${effect.type}`);
    }
}

function validateContext(value) {
    check(object(value) && id(value.actorId) && id(value.worldId) &&
        (value.scenarioId == null || id(value.scenarioId)), "Invalid actor/world context.");
}

function validateBudget(value) {
    check(object(value), "External resources must be an object.");
    for(const [key, amount] of Object.entries(value)) check(id(key) && Number.isFinite(amount) && amount >= 0 &&
        amount <= Number.MAX_SAFE_INTEGER, "Invalid external resource budget.");
}

export function validateExpansionState(state, registry) {
    if([1, 2, 3, 4].includes(state?.schema)) return validateExpansionState(migrateExpansionState(state), registry);
    check(object(state) && [ENGINE_SCHEMA,FEATURE_ENGINE_SCHEMA,NESTED_ENGINE_SCHEMA,CONTINUED_LIFE_ENGINE_SCHEMA,REFERENCE_ENGINE_SCHEMA,BOOK_WORLD_ENGINE_SCHEMA,AUDIT_REMAINDER_ENGINE_SCHEMA].includes(state.schema), "This expansion save needs a compatible engine schema.");
    check(integer(state.sequence) && integer(state.clock) && integer(state.rng) && state.rng > 0 && state.rng <= 0xffffffff,
        "Invalid expansion clock or random state.");
    check(state.schema !== AUDIT_REMAINDER_ENGINE_SCHEMA || state.auditRemainder != null || state.causalStories != null || state.motherOfLearning?.schema === 1 || state.proto23Village?.schema === 1,
        'Expansion11 requires its actual optional audit, causal, Cyoria or Proto23 owner.');
    check([state.realmPrototype,state.featureDestination,state.nestedCampaign,state.bookWorldCampaign,state.motherOfLearning,state.proto23Village]
        .filter(owner=>owner?.activeVisitId!=null).length<=1,'One controlled native body requires one active retained-world visit.');
    validateAuditRemainderProjects(state,registry);
    validateChronicle(state.chronicle, state.clock);
    validateSimulationState(state.simulation, state, registry?.simulation);
    validateHomeFurnishings(state,registry);
    validateCrushSocial(state,registry);
    validateStatusCareState(state,registry);
    validateFieldCareState(state,registry);
    validateBookCareState(state,registry);
    validateLorePractice(state,registry);
    validateWorldCompletionState(state,registry);
    validateCausalStories(state,registry);
    const nativeTravel=state.actors?.player?.facts;
    if(nativeTravel?.["original_frontier.travel.remaining"] != null) {
        check(state.simulation?.schema >= 4 && nativeTravel["original_frontier.freight.introduced"] === true && integer(nativeTravel["original_frontier.travel.remaining"]) &&
            typeof nativeTravel["original_frontier.travel.from"] === "string" && typeof nativeTravel["original_frontier.travel.to"] === "string" &&
            integer(nativeTravel["original_frontier.travel.startedAt"]) && nativeTravel["original_frontier.travel.startedAt"] <= state.clock, "Unsupported saved native journey.");
    }
    validateRealmState(state);
    validateTidemarkState(state);
    check(state.nestedCampaign==null||[NESTED_ENGINE_SCHEMA,CONTINUED_LIFE_ENGINE_SCHEMA,REFERENCE_ENGINE_SCHEMA,BOOK_WORLD_ENGINE_SCHEMA,AUDIT_REMAINDER_ENGINE_SCHEMA].includes(state.schema),"Nested campaign owners require an admitted expansion7/8/9/10 reader.");
    validateNestedCampaignState(state);
    validateParadiseCampaignState(state);
    validateParadiseCampaignDepthState(state,registry);
    validateParadiseCampaignDepthControllers(state,registry);
    validateMolCampaignState(state);
    validateProto23State(state);
    validateNestedChains(state,registry);
    validateNestedLife(state,registry);
    validateRelayState(state,registry);
    validateReferenceDeskState(state);
    validateBacklogState(state);
    validateInkNarrative(state);
    validateFeatureObjectState(state);
    validateWorkPlans(state.simulation?.workPlans,state,registry?.simulation,registry?.workPlans);
    validateReferenceGameplay(state,registry);
    validateAuditedWorkshop(state,registry);
    validateGameAbsorptionAssay(state,registry);
    validateContextualBalmState(state,registry);
    validateCoolingRefinement(state,registry);
    validateAgreedDutyState(state);
    check(state.schema !== REFERENCE_ENGINE_SCHEMA || state.referenceGameplay?.schema === 1, 'Expansion9 requires its optional reference gameplay owner.');
    check(state.schema !== BOOK_WORLD_ENGINE_SCHEMA || state.bookWorldCampaign?.schema === 1, 'Expansion10 requires its explicit source-world campaign owner.');
    validateDomain(state.campaign); validateDomain(state.journey);
    check(id(state.journey.id), "Invalid journey ID.");
    for(const key of ["worlds", "actors", "scenarios"]) {
        check(object(state[key]), `Invalid ${key}.`);
        for(const [keyId, value] of Object.entries(state[key])) {check(id(keyId), "Invalid domain ID."); validateDomain(value);}
    }
    for(const actor of Object.values(state.actors)) {
        validateTechniqueRecords(actor.techniques, state.clock, registry);
        check(id(actor.worldId) && Object.hasOwn(state.worlds, actor.worldId), "Unknown actor world.");
        check(object(actor.sources || {}), "Invalid actor sources.");
        for(const [sourceId, source] of Object.entries(actor.sources || {})) {
            check(source.origin == null || ["unknown", "inherited", "trained", "acquired"].includes(source.origin), "Invalid saved source origin.");
            check(id(sourceId) && object(source) && integer(source.acquiredAt) && source.acquiredAt <= state.clock &&
                (source.expiresAt == null || integer(source.expiresAt) && source.expiresAt > source.acquiredAt) &&
                id(source.receiptId), "Invalid saved capability source.");
            if(source.worldId != null) check(id(source.worldId) && Object.hasOwn(state.worlds, source.worldId), "Unknown source acquisition world.");
            if(source.revision != null) check(integer(source.revision) && source.revision > 0, "Invalid acquired source revision.");
            if(registry) check(registry.sources.has(sourceId), `Unsupported saved source: ${sourceId}`);
        }
    }
    if(registry) for(const worldId of Object.keys(state.worlds)) check(registry.worlds.has(worldId), `Unsupported saved world: ${worldId}`);
    check(Array.isArray(state.pending) && object(state.opportunities) && Array.isArray(state.history) &&
        state.history.length <= 100 && object(state.checkpoints), "Invalid expansion ledgers.");
    const instances = new Set();
    const busyActors = new Set();
    for(const job of state.pending) {
        validateContext(job.context);
        check(id(job.id) && !instances.has(job.id) && integer(job.due) && job.due >= state.clock &&
            integer(job.sequence) && job.sequence <= state.sequence && id(job.actionId) && integer(job.revision) &&
            id(job.outcome) && Number.isFinite(job.draw) && job.draw >= 0 && job.draw < 1 &&
            ["actor", "scenario", "world", "journey", "campaign"].includes(job.completionScope), "Invalid pending commitment.");
        check(!busyActors.has(job.context.actorId), "An actor has overlapping assignments.");
        check(!activePractice(state.actors[job.context.actorId]), "An actor has overlapping practice and assignments.");
        busyActors.add(job.context.actorId); instances.add(job.id);
        getDomain(state, "actor", job.context); getDomain(state, "world", job.context);
        if(job.context.scenarioId) getDomain(state, "scenario", job.context);
        getDomain(state, job.completionScope, job.context);
        if(registry) check(registry.actions.has(job.actionId), `Unsupported saved action: ${job.actionId}`);
        validateEffects(job.effects, registry);
        check(job.effects.every(e => e.type !== "resource" || e.amount >= 0), "Outcome debits must be reserved as commitment costs.");
        validateRollReceipts(job.rolls || []);
        if(job.costs) job.costs.forEach(validateCost);
        check(job.cancellation == null || ["none", "refund", "forfeit"].includes(job.cancellation), "Invalid cancellation policy.");
    }
    for(const [key, opportunity] of Object.entries(state.opportunities)) {
        check(id(key) && id(opportunity.definitionId) && integer(opportunity.due) && integer(opportunity.expires) &&
            opportunity.expires > opportunity.due && typeof opportunity.blocking === "boolean" &&
            ["scheduled", "available", "claimed", "expired"].includes(opportunity.status), "Invalid saved opportunity.");
        validateContext(opportunity.context); getDomain(state, "actor", opportunity.context);
        getDomain(state, "world", opportunity.context);
        if(opportunity.context.scenarioId) getDomain(state, "scenario", opportunity.context);
        if(registry) check(registry.opportunities.has(opportunity.definitionId), "Unsupported saved opportunity.");
    }
    for(const receipt of state.history) {
        check(object(receipt) && id(receipt.id) && integer(receipt.sequence) && receipt.sequence <= state.sequence &&
            integer(receipt.at) && receipt.at <= state.clock && id(receipt.actionId) && id(receipt.outcome) &&
            Number.isFinite(receipt.draw) && receipt.draw >= 0 && receipt.draw < 1, "Invalid event receipt.");
        validateRollReceipts(receipt.rolls || []);
    }
    for(const [key, checkpoint] of Object.entries(state.checkpoints)) {
        check(id(key) && object(checkpoint) && id(checkpoint.scenarioId) &&
            Object.hasOwn(state.scenarios, checkpoint.scenarioId), "Invalid scenario checkpoint.");
        validateDomain(checkpoint.snapshot);
    }
    return state;
}

// Absent state and schemas1/2 migrate additively. Unsupported versions fail
// before the legacy loader mutates anything or autosave can replace the source.
function migrateExpansionState(saved) {
    const state = clone(saved);
    state.schema = ENGINE_SCHEMA;
    state.chronicle ??= null;
    state.simulation ??= null;
    for(const actor of Object.values(state.actors || {})) {actor.sources ??= {}; actor.techniques ??= {};}
    return state;
}

export function loadExpansionState(saved, registry, seed = 1) {
    return validateExpansionState(saved == null ? createExpansionState(seed)
        : [1, 2, 3, 4].includes(saved.schema) ? migrateExpansionState(saved) : clone(saved), registry);
}

function validateCost(cost) {
    if(cost.type === "item") validateGameplayEffect(cost, true);
    else {check(cost.type == null || cost.type === "resource", "Unsupported commitment cost."); validateResource(cost, true);}
}

function validateRollReceipts(rolls) {
    check(Array.isArray(rolls), "Invalid saved rolls.");
    const ids = new Set();
    for(const roll of rolls) {
        check(id(roll.id) && !ids.has(roll.id) && id(roll.tableId) && integer(roll.revision) && roll.revision > 0 &&
            id(roll.outcome) && Number.isFinite(roll.draw) && roll.draw >= 0 && roll.draw < 1, "Invalid saved roll receipt.");
        ids.add(roll.id);
    }
}

function validateRule(rule) {
    if(rule == null) return;
    check(object(rule), "Invalid requirement.");
    if(rule.all || rule.any) {
        check(!(rule.all && rule.any) && !rule.not && !rule.fact, "Ambiguous requirement.");
        check(Array.isArray(rule.all || rule.any), "Invalid requirement children.");
        (rule.all || rule.any).forEach(child => {check(object(child), "Invalid child requirement."); validateRule(child);});
    } else if(rule.not) {check(!rule.fact, "Ambiguous requirement."); validateRule(rule.not);}
    else {
        check(id(rule.fact) && ["eq", "gte", "lte"].includes(rule.op) &&
            (rule.op === "eq" ? ["string", "boolean", "number"].includes(typeof rule.value) : Number.isFinite(rule.value)),
        "Invalid requirement predicate.");
    }
}

export function createContentRegistry({worlds = [], actions = [], opportunities = [], capabilities = [], sources = [], rollTables = [], techniques = [], simulation = {}}) {
    const register = definitions => {
        const map = new Map();
        for(const definition of definitions) {
            check(id(definition.id) && !map.has(definition.id), "Content needs unique stable IDs.");
            const copy = clone(definition);
            const freeze = value => {if(object(value) || Array.isArray(value)) {Object.values(value).forEach(freeze); Object.freeze(value);}};
            freeze(copy); map.set(copy.id, copy);
        }
        return map;
    };
    const registry = {worlds: register(worlds), actions: register(actions), opportunities: register(opportunities),
        capabilities: register(capabilities), sources: register(sources), rollTables: register(rollTables), techniques: register(techniques), simulation: createSimulationRegistry(simulation)};
    validateCapabilityDefinitions(registry, validateRule);
    validateTechniqueDefinitions(registry);
    for(const table of registry.rollTables.values()) {
        check(integer(table.revision) && table.revision > 0 && typeof table.label === "string", "Invalid roll table.");
        distribution(table);
        for(const outcome of table.outcomes) {
            validateEffects(outcome.effects || [], registry);
            check((outcome.effects || []).every(e => e.type !== "resource" || e.amount >= 0), "Roll debits must be reserved as commitment costs.");
        }
        for(const modifier of table.modifiers || []) {validateRule(modifier.when); validateTransfers(modifier, table.outcomes);}
    }
    for(const action of registry.actions.values()) {
        check(registry.worlds.has(action.worldId) && integer(action.revision) && action.revision > 0 &&
            integer(action.duration) && typeof action.repeatable === "boolean" &&
            ["actor", "scenario", "world", "journey", "campaign"].includes(action.completionScope), "Invalid action definition.");
        validateRule(action.requires); validateRule(action.visibleWhen);
        if(action.schedule) {
            validateSchedule(action.schedule);
            check(action.repeatable, "Recurring services must be repeatable.");
        }
        check(Array.isArray(action.costs), "Costs must be an array.");
        action.costs.forEach(validateCost);
        check(action.cancellation == null || ["none", "refund", "forfeit"].includes(action.cancellation), "Invalid cancellation policy.");
        const rollIds = new Set();
        for(const roll of action.rolls || []) {
            check(id(roll.id) && !rollIds.has(roll.id) && registry.rollTables.has(roll.tableId), "Invalid action roll reference.");
            rollIds.add(roll.id);
        }
        chooseOutcome(action.outcomes, 0);
        validateEffects(action.effects || [], registry);
        action.outcomes.forEach(outcome => validateEffects(outcome.effects || [], registry));
        check([...(action.effects || []), ...action.outcomes.flatMap(o => o.effects || [])]
            .every(e => e.type !== "resource" || e.amount >= 0), "Outcome debits must be reserved as commitment costs.");
        for(const modifier of action.durationModifiers || []) {
            validateRule(modifier.when);
            check(integer(modifier.minutes) && typeof modifier.label === "string", "Invalid duration modifier.");
            check(modifier.operation == null || ["set", "add", "subtract"].includes(modifier.operation), "Invalid duration operation.");
        }
        for(const modifier of action.modifiers || []) {
            validateRule(modifier.when);
            validateTransfers(modifier, action.outcomes);
        }
        if(action.opportunityId) check(registry.opportunities.has(action.opportunityId), "Unknown required opportunity.");
    }
    // Maps stay private to content authoring callers; game state never stores them.
    return registry;
}

function validateTransfers(modifier, outcomes) {
    check(typeof modifier.label === "string" && Array.isArray(modifier.transfers), "Invalid odds modifier.");
    for(const transfer of modifier.transfers) check(transfer.from !== transfer.to &&
        outcomes.some(o => o.id === transfer.from) && outcomes.some(o => o.id === transfer.to) &&
        Number.isFinite(transfer.amount) && transfer.amount >= 0 && transfer.amount <= 1, "Invalid probability transfer.");
}

function distribution(table) {
    check(Array.isArray(table.outcomes) && table.outcomes.length > 0 &&
        table.outcomes.every(o => Number.isFinite(o.weight) && o.weight >= 0), "Invalid roll weights.");
    const total = table.outcomes.reduce((sum, o) => sum + o.weight, 0);
    check(Number.isFinite(total) && total > 0, "Roll table needs positive total weight.");
    const outcomes = table.outcomes.map(o => ({...clone(o), chance: o.weight / total}));
    chooseOutcome(outcomes, 0);
    return outcomes;
}

function modifyOdds(outcomes, modifiers, facts, contributors) {
    for(const modifier of modifiers || []) if(evaluateRule(modifier.when, facts).met) {
        for(const transfer of modifier.transfers) {
            const from = outcomes.find(o => o.id === transfer.from), to = outcomes.find(o => o.id === transfer.to);
            const amount = Math.min(from.chance, transfer.amount);
            from.chance -= amount; to.chance += amount;
        }
        contributors.push(modifier.label);
    }
    chooseOutcome(outcomes, 0);
}

function getDomain(state, scope, context) {
    const target = scope === "campaign" || scope === "journey" ? state[scope]
        : scope === "world" ? state.worlds[context.worldId]
        : scope === "actor" ? state.actors[context.actorId] : state.scenarios[context.scenarioId];
    check(object(target), `Missing ${scope} state.`);
    return target;
}

function factsFor(state, context) {
    const facts = {...context.facts};
    for(const scope of scopes.filter(scope => scope !== "external")) {
        if(scope === "scenario" && !context.scenarioId) continue;
        for(const [key, value] of Object.entries(getDomain(state, scope, context).facts)) facts[`${scope}.${key}`] = value;
    }
    return facts;
}

export function inspectCapabilities(state, registry, context) {
    return queryCapabilities(state, registry, context, {...factsFor(state, context), ...techniqueFacts(getDomain(state, "actor", context), registry, context)});
}

function resourcesFor(state, external, scope, context) {
    return scope === "external" ? external : getDomain(state, scope, context).resources;
}

const opportunityKey = (definitionId, context) => `${context.actorId}:${context.scenarioId || context.worldId}:${definitionId}`;

export function evaluateAction(state, registry, actionId, context) {
    validateContext(context);
    validateBudget(context.external || {});
    validateGameplaySnapshot(context.gameplay || {});
    const action = registry.actions.get(actionId);
    check(action, `Unknown action: ${actionId}`);
    const actor = getDomain(state, "actor", context);
    const facts = {...factsFor(state, context), ...techniqueFacts(getDomain(state, "actor", context), registry, context)};
    const capabilities = queryCapabilities(state, registry, context, facts);
    for(const [id, capability] of Object.entries(capabilities)) facts[`capability.${id}`] = capability.value;
    const visibility = action.visibleWhen ? evaluateRule(action.visibleWhen, facts) : {met: true};
    const requirements = action.requires ? evaluateRule(action.requires, facts) : {met: true, reasons: []};
    const reasons = [...requirements.reasons];
    if(action.worldId !== context.worldId || actor.worldId !== context.worldId) reasons.push("This expedition belongs to another world.");
    const owner = getDomain(state, action.completionScope, context);
    const schedule = action.schedule && recurringWindow(action.schedule, context.facts?.calendarMinute, owner.facts[`cycle.${action.id}`]);
    if(schedule && !schedule.open) reasons.push(schedule.reason);
    if(!action.repeatable && (owner.completed[action.id] || state.pending.some(job => job.actionId === action.id &&
        (action.completionScope === "campaign" || action.completionScope === "journey" ||
            action.completionScope === "world" && job.context.worldId === context.worldId ||
            action.completionScope === "scenario" && job.context.scenarioId === context.scenarioId ||
            action.completionScope === "actor" && job.context.actorId === context.actorId)))) reasons.push("Already committed or completed.");
    if(activePractice(actor)) reasons.push("Finish or cancel your active technique drill first.");
    if(simulationOccupiesActor(state, context.actorId)) reasons.push("Finish your living-world work or encounter first.");
    if(context.actorId === "player" && waitingSimulationChoice(state)) reasons.push("Resolve the waiting world decision first.");
    if(state.pending.some(job => job.context.actorId === context.actorId)) reasons.push("Finish your current expedition first.");
    const blocking = Object.values(state.opportunities).filter(o => o.status === "available" && o.blocking);
    if(context.actorId === "player" && state.chronicle?.session) reasons.push("Finish or withdraw from the elder encounter first.");
    if(context.actorId === "player" && state.chronicle?.life.endedAt != null) reasons.push("This mortal life has ended.");
    if(blocking.length && !blocking.some(o => o.definitionId === action.opportunityId &&
        o.context.actorId === context.actorId && o.context.worldId === context.worldId &&
        o.context.scenarioId === (context.scenarioId || null))) reasons.push("Resolve the waiting choice before starting other work.");
    if(action.opportunityId) {
        const opportunity = state.opportunities[opportunityKey(action.opportunityId, context)];
        if(!opportunity || opportunity.status !== "available") reasons.push("This opportunity is not available.");
    }
    const totals = new Map();
    for(const cost of action.costs) {
        const key = cost.type === "item" ? `item:${cost.key}` : `${cost.scope}:${cost.key}`;
        totals.set(key, {...cost, amount: (totals.get(key)?.amount || 0) + cost.amount});
    }
    const costs = [...totals.values()];
    for(const cost of costs) {
        const available = cost.type === "item" ? context.gameplay?.[context.actorId]?.inventory[cost.key] || 0
            : resourcesFor(state, context.external || {}, cost.scope, context)[cost.key] || 0;
        if(available < cost.amount) reasons.push(`Needs ${cost.amount} ${cost.label || cost.key}; you have ${available}.`);
    }
    const outcomes = clone(action.outcomes);
    const contributors = [];
    let duration = action.duration;
    for(const modifier of action.durationModifiers || []) if(evaluateRule(modifier.when, facts).met) {
        duration = modifier.operation === "add" ? duration + modifier.minutes : modifier.operation === "subtract" ? Math.max(0,duration-modifier.minutes) : modifier.minutes; contributors.push(modifier.label);
        check(integer(duration), "Invalid adjusted duration.");
    }
    if(Object.values(state.opportunities).some(o => o.blocking && o.status === "scheduled" &&
        o.context.actorId === context.actorId && o.due < state.clock + duration)) {
        reasons.push("This work would cross a waiting choice. Choose shorter work or wait for it first.");
    }
    modifyOdds(outcomes, action.modifiers, facts, contributors);
    const rolls = (action.rolls || []).map(ref => {
        const table = registry.rollTables.get(ref.tableId), odds = distribution(table), contributors = [];
        modifyOdds(odds, table.modifiers, facts, contributors);
        return {id: ref.id, tableId: table.id, revision: table.revision, label: table.label, outcomes: odds, contributors};
    });
    return {actionId, visible: visibility.met, eligible: visibility.met && reasons.length === 0,
        reasons, costs, duration, outcomes, contributors, capabilities, rolls, schedule};
}

function applyEffects(state, external, effects, context, registry, gameplay = {}, receiptId = "validation", draw = 0) {
    validateEffects(effects, registry);
    for(const effect of effects) {
        if(effect.type === "fact") getDomain(state, effect.scope, context).facts[effect.key] = effect.value;
        else if(effect.type === "resource") {
            const resources = resourcesFor(state, external, effect.scope, context);
            const next = (resources[effect.key] || 0) + effect.amount;
            check(Number.isFinite(next) && next >= 0 && next <= Number.MAX_SAFE_INTEGER, `Insufficient or invalid ${effect.key}.`);
            resources[effect.key] = next;
        } else if(effect.type === "chronicle") recordArchiveDuty(state.chronicle, state.clock, receiptId);
        else if(["item", "xp", "reputation"].includes(effect.type)) applyGameplayEffect(gameplay, effect, context.actorId);
        else if(effect.type === "technique") applyTechniqueEffect(getDomain(state, "actor", context), effect,
            {registry, clock: state.clock, worldId: context.worldId, receiptId, draw});
        else if(effect.type === "source") {
            const sources = getDomain(state, "actor", context).sources ??= {};
            if(effect.operation === "remove") delete sources[effect.sourceId];
            else if(!sources[effect.sourceId] || sources[effect.sourceId].expiresAt != null && sources[effect.sourceId].expiresAt <= state.clock) {
                sources[effect.sourceId] = {acquiredAt: state.clock, expiresAt: effect.duration == null ? null : state.clock + effect.duration,
                    receiptId, worldId: context.worldId, revision: registry.sources.get(effect.sourceId).revision, origin: effect.origin || "unknown"};
            }
        } else {
            const key = opportunityKey(effect.id, context);
            check(!Object.hasOwn(state.opportunities, key), "Opportunity already scheduled.");
            state.opportunities[key] = {definitionId: effect.id, context: clone(context), due: state.clock + effect.delay,
                expires: state.clock + effect.delay + effect.lifetime, blocking: effect.blocking, status: "scheduled"};
        }
    }
}

function draw(state) {
    let value = state.rng;
    value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
    state.rng = value >>> 0;
    return state.rng / 0x100000000;
}

function finish(state, external, job, registry, gameplay, acquisitions) {
    applyEffects(state, external, job.effects, job.context, registry, gameplay, job.id, job.draw);
    for(const effect of job.effects) if(effect.type === "item") acquisitions.push({owner: job.context.actorId, key: effect.key, count: effect.amount});
    const completed = getDomain(state, job.completionScope, job.context).completed;
    completed[job.actionId] = (completed[job.actionId] || 0) + 1;
    state.history.push({id: job.id, sequence: job.sequence, actionId: job.actionId, revision: job.revision,
        actorId: job.context.actorId, outcome: job.outcome, label: job.label, draw: job.draw, at: state.clock, rolls: clone(job.rolls || [])});
    state.history = state.history.slice(-100);
}

// Plans clone state and external budgets. The host persists both in ONE envelope
// before publishing them. No DOM callbacks or legacy mutation occurs here.
export function commitAction(state, registry, actionId, context, expectedSequence = state.sequence) {
    check(expectedSequence === state.sequence, "This command is stale; inspect the current state again.");
    const preview = evaluateAction(state, registry, actionId, context);
    check(preview.eligible, preview.reasons.join(" ") || "This action is hidden.");
    const action = registry.actions.get(actionId);
    const next = clone(state), external = clone(context.external || {}), gameplay = clone(context.gameplay || {});
    const savedContext = {actorId: context.actorId, worldId: context.worldId, scenarioId: context.scenarioId || null};
    const effects = [...(action.effects || [])];
    // Reserve the cycle at commitment, like spent inputs. Cancelling or reloading
    // cannot farm this occurrence, and frozen jobs never consult a later calendar.
    if(preview.schedule) getDomain(next, action.completionScope, savedContext).facts[`cycle.${action.id}`] = preview.schedule.cycle;
    if(context.scenarioId && Object.values(next.checkpoints).some(cp => cp.scenarioId === context.scenarioId)) {
        const safe = effect => effect.scope === "scenario" || effect.type === "fact" && effect.scope === "campaign";
        check(preview.costs.every(cost => cost.scope === "scenario") && effects.every(safe) &&
            preview.outcomes.every(outcome => (outcome.effects || []).every(safe)), "Checkpoint scenarios cannot export resources or unrelated consequences.");
    }
    for(const cost of preview.costs) {
        if(cost.type === "item") applyGameplayEffect(gameplay, cost, context.actorId, true);
        else applyEffects(next, external, [{...cost, type: "resource", amount: -cost.amount}], savedContext, registry);
    }
    if(action.opportunityId) next.opportunities[opportunityKey(action.opportunityId, context)].status = "claimed";
    const roll = draw(next), outcome = preview.outcomes.find(o => o.id === chooseOutcome(preview.outcomes, roll));
    const sequence = ++next.sequence;
    const job = {id: `event:${sequence}`, sequence, actionId, revision: action.revision, context: savedContext,
        completionScope: action.completionScope, due: next.clock + preview.duration, draw: roll, outcome: outcome.id,
        label: outcome.label || outcome.id, effects: [...effects, ...(outcome.effects || [])], costs: clone(preview.costs),
        cancellation: action.cancellation || "none", rolls: []};
    // Validate every possible result now. A missing domain or unknown effect must
    // not strand paid inputs in a pending job. The selected effects are frozen.
    for(const possible of preview.outcomes) {
        const candidate = clone(next), budgets = clone(external);
        applyEffects(candidate, budgets, [...effects, ...(possible.effects || [])], savedContext, registry, clone(gameplay));
    }
    for(const roll of preview.rolls) {
        for(const possible of roll.outcomes) {
            const candidate = clone(next);
            if(context.scenarioId && Object.values(next.checkpoints).some(cp => cp.scenarioId === context.scenarioId)) {
                check((possible.effects || []).every(e => e.scope === "scenario" || e.type === "fact" && e.scope === "campaign"), "Checkpoint scenarios cannot export roll rewards.");
            }
            applyEffects(candidate, clone(external), [...job.effects, ...(possible.effects || [])], savedContext, registry, clone(gameplay));
        }
        const drawValue = draw(next), chosen = roll.outcomes.find(o => o.id === chooseOutcome(roll.outcomes, drawValue));
        job.effects.push(...(chosen.effects || []));
        job.rolls.push({id: roll.id, tableId: roll.tableId, revision: roll.revision, outcome: chosen.id, label: chosen.label || chosen.id, draw: drawValue});
    }
    const acquisitions = [];
    if(preview.duration === 0) finish(next, external, job, registry, gameplay, acquisitions);
    else next.pending.push(job);
    validateExpansionState(next, registry);
    return {state: next, external, gameplay, acquisitions, gameplayBefore: clone(context.gameplay || {}), preview, commitment: clone(job)};
}

export function advanceSimulation(state, registry, minutes, external = {}, gameplay = {}, simulationContexts = {}) {
    check(integer(minutes) && Number.isSafeInteger(state.clock + minutes), "Invalid simulation duration.");
    validateBudget(external);
    validateGameplaySnapshot(gameplay);
    const next = clone(state), budgets = clone(external), owned = clone(gameplay);
    const acquisitions = [], unlocks = [];
    const simulationPlan = {state: next, external: budgets, gameplay: owned, acquisitions, unlocks,
        vitals: Object.fromEntries(Object.entries(simulationContexts).filter(([,c]) => c.vitals).map(([id,c]) => [id, clone(c.vitals)])),
        equipment: Object.fromEntries(Object.entries(simulationContexts).filter(([,c]) => c.equipment).map(([id,c]) => [id, clone(c.equipment)]))};
    const loreContexts=()=>({...simulationContexts,player:{...simulationContexts.player,external:budgets,gameplay:owned,vitals:simulationPlan.vitals,equipment:simulationPlan.equipment}});
    const target = next.clock + minutes;
    let stoppedAtChoice = false, boundaries = 0;
    while(true) {
        if(next.chronicle && next.chronicle.life.endedAt !== null) break;
        if(["dead", "departed"].includes(next.simulation?.people.player?.life)) break;
        if(Object.values(next.opportunities).some(o => o.status === "available" && o.blocking) || waitingSimulationChoice(next) || next.simulation?.sessions.player) {stoppedAtChoice = true; break;}
        const times = [...next.pending.map(job => job.due), ...Object.values(next.opportunities)
            .filter(o => o.status === "scheduled" || o.status === "available")
            .map(o => o.status === "scheduled" ? o.due : o.expires)];
        const boundary = Math.min(...times, nextChronicleBoundary(next.chronicle), nextSimulationBoundary(next,{skipLoreJobs:!lorePracticeTimersSupported(next,loreContexts()),skipCompletionJobs:!worldCompletionTimersSupported(next,loreContexts()),skipCompletionCropChecks:!worldCompletionCropClockSupported(next,loreContexts().player)}), nextLorePracticeBoundary(next,loreContexts()), nextWorldCompletionBoundary(next,loreContexts()), nextCausalStoryBoundary(next), nextRealmActivityBoundary(next), nextTidemarkBoundary(next), nextNestedCampaignBoundary(next), nextParadiseBoundary(next), nextMolBoundary(next),nextProto23Boundary(next), workPlanNextBoundary(next));
        const clockBoundary = Number.isFinite(boundary)?Math.max(next.clock,boundary):null;
        if(boundary > target) {retainOriginalFrontierWindow(next,next.clock,target);retainRepositoryAbsorptionWindows(next,next.clock,target);retainAuditRemainderWindows(next,next.clock,target);retainLorePracticeWindows(next,next.clock,target,loreContexts());retainWorldCompletionWindows(next,next.clock,target,loreContexts()); next.clock = target; syncRealmClock(next,clockBoundary); syncTidemarkClock(next); syncNestedCampaignClock(next); syncParadiseClock(next); syncMolClock(next);syncProto23Clock(next); expireRealmObservation(next); next.chronicle = advanceChronicle(next.chronicle, next.clock); break;}
        retainOriginalFrontierWindow(next,next.clock,Math.max(next.clock,boundary));retainRepositoryAbsorptionWindows(next,next.clock,Math.max(next.clock,boundary));retainAuditRemainderWindows(next,next.clock,Math.max(next.clock,boundary));retainLorePracticeWindows(next,next.clock,Math.max(next.clock,boundary),loreContexts());retainWorldCompletionWindows(next,next.clock,Math.max(next.clock,boundary),loreContexts());
        next.clock = Math.max(next.clock, boundary);
        syncRealmClock(next,clockBoundary); syncTidemarkClock(next); syncNestedCampaignClock(next); syncParadiseClock(next); syncMolClock(next);syncProto23Clock(next);
        expireRealmObservation(next);
        const due = next.pending.filter(job => job.due <= next.clock).sort((a, b) => a.due - b.due || a.sequence - b.sequence);
        for(const job of due) finish(next, budgets, job, registry, owned, acquisitions);
        next.pending = next.pending.filter(job => job.due > next.clock);
        for(const o of Object.values(next.opportunities)) {
            if(o.status === "scheduled" && o.due <= next.clock) o.status = "available";
            if(o.status === "available" && !o.blocking && o.expires <= next.clock) o.status = "expired";
        }
        next.chronicle = advanceChronicle(next.chronicle, next.clock);
        advanceSimulationBoundary(simulationPlan, registry,proto23SimulationContexts(next, worldCompletionSimulationContexts(next,lorePracticeSimulationContexts(next,causalStorySimulationContexts(next,auditRemainderSimulationContexts(next,molSimulationContexts(next,paradiseSimulationContexts(next,nestedChainSimulationContexts(next,nestedSimulationContexts(next,tidemarkSimulationContexts(next,realmSimulationContexts(next,simulationContexts))))))))))));
        advanceAuditRemainder(state,simulationPlan,registry,{...simulationContexts.player,actorId:"player",external:budgets,gameplay:owned,vitals:simulationPlan.vitals,equipment:simulationPlan.equipment});
        reconcileLorePractice(state,simulationPlan,registry,{...simulationContexts,player:{...simulationContexts.player,external:budgets,gameplay:owned,vitals:simulationPlan.vitals,equipment:simulationPlan.equipment}});
        if(++boundaries >= 512) break; // Return unspent time; never skip causal work.
    }
    advanceAuditRemainder(state,simulationPlan,registry,{...simulationContexts.player,actorId:"player",external:budgets,gameplay:owned,vitals:simulationPlan.vitals,equipment:simulationPlan.equipment});
    reconcileCausalStoryPlan(state,simulationPlan,registry,causalStorySimulationContexts(next,simulationContexts));
    reconcileLorePractice(state,simulationPlan,registry,{...simulationContexts,player:{...simulationContexts.player,external:budgets,gameplay:owned,vitals:simulationPlan.vitals,equipment:simulationPlan.equipment}});
    reconcileBookCareRuntime(state,simulationPlan,registry);
    reconcileParadiseCampaignDepthRuntime(state,simulationPlan,registry);
    reconcileWorldCompletionPlan(simulationPlan,registry,loreContexts());
    validateExpansionState(next, registry);
    return {state: next, external: budgets, gameplay: owned, acquisitions, unlocks, native: simulationPlan.native, equipment: simulationPlan.equipment,
        ...(next.causalStories ? {vitals: simulationPlan.vitals} : {}),
        gameplayBefore: clone(gameplay), stoppedAtChoice, remaining: target - next.clock, budgetExhausted: boundaries >= 512};
}

export function cancelAction(state, registry, jobId, context, expectedSequence = state.sequence) {
    validateContext(context); validateBudget(context.external || {}); validateGameplaySnapshot(context.gameplay || {});
    check(expectedSequence === state.sequence, "This cancellation is stale.");
    const job = state.pending.find(job => job.id === jobId && job.context.actorId === context.actorId);
    check(job && job.cancellation && job.cancellation !== "none", "This commitment cannot be cancelled.");
    const next = clone(state), external = clone(context.external || {}), gameplay = clone(context.gameplay || {});
    if(job.cancellation === "refund") for(const cost of job.costs) {
        if(cost.type === "item") applyGameplayEffect(gameplay, cost, context.actorId);
        else applyEffects(next, external, [{...cost, type: "resource"}], job.context, registry);
    }
    next.pending = next.pending.filter(p => p.id !== jobId);
    next.history.push({id: `cancel:${++next.sequence}`, sequence: next.sequence, actionId: job.actionId,
        outcome: "cancelled", label: `Cancelled: ${job.cancellation === "refund" ? "reserved inputs returned" : "spent inputs forfeited"}`,
        draw: job.draw, at: next.clock, actorId: context.actorId, rolls: clone(job.rolls || [])});
    next.history = next.history.slice(-100);
    validateExpansionState(next, registry);
    return {state: next, external, gameplay, gameplayBefore: clone(context.gameplay || {})};
}

export function checkpointScenario(state, scenarioId, checkpointId) {
    check(id(scenarioId) && id(checkpointId) && state.scenarios[scenarioId], "Unknown scenario.");
    check(!state.pending.some(job => job.context.scenarioId === scenarioId) &&
        !Object.values(state.opportunities).some(o => o.context.scenarioId === scenarioId), "Checkpoint needs an idle isolated scenario.");
    const next = clone(state);
    next.checkpoints[checkpointId] = {scenarioId, snapshot: clone(next.scenarios[scenarioId])};
    return next;
}

export function previewScenarioRewind(state, checkpointId) {
    const checkpoint = state.checkpoints[checkpointId];
    check(checkpoint, "Unknown checkpoint.");
    return {scenarioId: checkpoint.scenarioId, lost: clone(state.scenarios[checkpoint.scenarioId]),
        restored: clone(checkpoint.snapshot), retained: ["campaign", "journey", "actors", "worlds", "random stream", "receipts"]};
}

export function rewindScenario(state, checkpointId) {
    const preview = previewScenarioRewind(state, checkpointId);
    const next = clone(state);
    next.scenarios[preview.scenarioId] = preview.restored;
    next.pending = next.pending.filter(job => job.context.scenarioId !== preview.scenarioId);
    ++next.sequence; // Never restore the command sequence or random stream.
    return validateExpansionState(next);
}
