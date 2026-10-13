import {validateFoundationInteractionEffect,validateFoundationDelivery,validateFoundationInteractionState} from './foundation_interaction_policy.js';
import {validateContainerDefinition,validateContainerEffect,validateContainerState} from './structured_container_runtime.js';
import {validateSituationDefinition, validateSituationEffect, validateSituations, validateKnowledgeBasis} from "./causal_situations.js";
import {evaluateRule} from "./rules.js";
import {validateItemKey, validateGameplaySnapshot} from "./gameplay_transactions.js";
import {validateEnergyPolicy, validateEnergyEffect, validateEnergyState} from "./energy_resources.js";
import {validatePursuitDefinition, validatePursuitEffect, validatePursuits} from "./pursuit.js";
import {validateNativeBattle} from "./native_battle_contracts.js";
import {validateCausalStoryJob} from './world_completion_causal_job_validation.js';
import {causalStoryDefinitions} from './causal_story_content.js';

export function assert(ok, message) {if(!ok) throw new Error(message);}
export function record(v) {return v != null && typeof v === "object" && !Array.isArray(v);}
export function stableId(v) {return typeof v === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !["__proto__", "constructor", "prototype"].includes(v);}
export function natural(v) {return Number.isSafeInteger(v) && v >= 0;}
export function finite(v) {return Number.isFinite(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER;}
export function copy(v) {return structuredClone(v);}
export function jsonData(value, depth = 0) {
    assert(depth < 32, "Simulation data is too deeply nested.");
    if(value === null || typeof value === "boolean" || typeof value === "string") return;
    if(typeof value === "number") {assert(finite(value), "Nonfinite simulation value."); return;}
    assert(Array.isArray(value) || record(value), "Simulation data must be JSON.");
    for(const [key, child] of Object.entries(value)) {
        assert(!["__proto__", "constructor", "prototype"].includes(key), "Unsafe simulation key.");
        jsonData(child, depth + 1);
    }
}
export function validatePredicate(rule) {
    if(rule == null) return;
    assert(record(rule), "Invalid simulation requirement.");
    if(rule.all || rule.any) {
        assert(!(rule.all && rule.any) && !rule.not && !rule.fact && Array.isArray(rule.all || rule.any), "Ambiguous requirement.");
        (rule.all || rule.any).forEach(validatePredicate);
    } else if(rule.not) {assert(!rule.fact, "Ambiguous negation."); validatePredicate(rule.not);}
    else assert(typeof rule.fact === "string" && ["eq", "gte", "lte"].includes(rule.op) &&
        (rule.op === "eq" ? ["boolean", "number", "string"].includes(typeof rule.value) : finite(rule.value)), "Invalid predicate.");
}
export function meets(rule, facts) {return !rule || evaluateRule(rule, facts).met;}
function selector(v) {return ["$actor", "$target", "$party"].includes(v) || typeof v === "string" && v.startsWith("$spawn.") && stableId(v.slice(7)) || stableId(v);}
export function numeric(v) {return finite(v) || record(v) && typeof v.fact === "string" && ["scale", "add", "min", "max"].every(k => v[k] == null || finite(v[k])) && (v.min == null || v.max == null || v.min <= v.max);}
// Lazy and hoisted so declarative project compilation can validate through the
// existing native-registry import cycle without weakening any effect checks.
var operations;
function simulationOperations() {return operations ||= new Set(["spawn", "relocate", "fact", "resource", "vital", "body", "item", "transfer", "xp", "reputation", "knowledge", "relationship", "claim", "condition", "life", "source", "faculty", "power", "progress", "title", "equipment", "custody", "unlock", "event", "world", "party", "energy", "observation", "site", "pursuit", "situation", "container", "foundationInteraction"]);}


export function validateSimulationEffect(e) {
    assert(record(e) && simulationOperations().has(e.type), `Unsupported simulation effect: ${e?.type}`);
    if(e.actor != null) assert(selector(e.actor), "Invalid effect actor.");
    if(e.origin != null) assert(["source", "faculty"].includes(e.type) && ["unknown", "inherited", "trained", "acquired"].includes(e.origin), "Invalid acquisition origin.");
    if(e.type === "spawn") {
        assert((stableId(e.personId) || stableId(e.instanceKey)) && stableId(e.definitionId), "Invalid new actor identity.");
        if(e.template) {validatePersonDefinition(e.template); assert(e.template.id === e.definitionId && e.template.inventory === "simulation", "Invalid frozen actor template.");}
    }
    if(e.type === "relocate") assert(typeof e.location === "string" && e.location.length > 0, "Invalid actor destination.");
    if(e.target != null) assert(selector(e.target), "Invalid effect target.");
    if(e.type === "fact") assert(["actor", "world", "campaign", "journey"].includes(e.scope) && stableId(e.key) && ["boolean", "number", "string"].includes(typeof e.value), "Invalid fact effect.");
    if(e.type === "resource") assert(stableId(e.key) && numeric(e.amount), "Invalid resource effect.");
    if(e.type === "vital") assert(["health", "stamina"].includes(e.key) && numeric(e.amount), "Invalid vital effect.");
    if(e.type === "body") assert(stableId(e.key) && ["boolean", "number", "string"].includes(typeof e.value), "Invalid body property.");
    if(e.type === "item") {validateItemKey(e.key); assert(Number.isSafeInteger(e.amount) && e.amount !== 0, "Invalid item amount.");}
    if(e.reservationReturn != null) assert(e.reservationReturn === true && (e.type === "item" && e.amount > 0 || e.type === "transfer"), "Invalid reservation return.");
    if(e.type === "transfer" || e.type === "custody") {validateItemKey(e.key); assert(selector(e.from) && selector(e.to) && e.from !== e.to && natural(e.count) && e.count > 0, "Invalid transfer.");}
    if(e.type === "xp") assert(typeof e.skill === "string" && finite(e.amount) && e.amount > 0, "Invalid native XP.");
    if(e.type === "reputation") assert(typeof e.region === "string" && finite(e.amount), "Invalid native reputation.");
    if(e.type === "knowledge") assert(stableId(e.key) && ["seen", "interpreted", "understood"].includes(e.stage) && typeof e.value === "string", "Invalid knowledge.");
    if(e.type === "relationship") assert(selector(e.target) && stableId(e.axis) && finite(e.amount), "Invalid directed relationship.");
    if(e.type === "claim") assert(stableId(e.key) && ["acquire", "release", "transfer", "settle"].includes(e.operation), "Invalid claim operation.");
    if(e.type === "condition") assert(stableId(e.id) && ["apply", "remove"].includes(e.operation) && (e.duration == null || natural(e.duration) && e.duration > 0), "Invalid condition.");
    if(e.type === "life") assert(["alive", "incapacitated", "dead", "departed"].includes(e.status) && typeof e.reason === "string", "Invalid story-life effect.");
    if(e.type === "source" || e.type === "faculty") assert(stableId(e.sourceId) && ["grant", "remove", "awaken", "activate", "suppress", "develop"].includes(e.operation), "Invalid faculty effect.");
    if(e.type === "power") assert(stableId(e.powerId) && ["learn", "copy", "transfer", "remove", "fragment", "refine"].includes(e.operation), "Invalid power acquisition.");
    if(e.type === "progress") assert(stableId(e.track) && stableId(e.field) && finite(e.amount), "Invalid progress effect.");
    if(e.type === "title") assert(stableId(e.id) && ["grant", "remove"].includes(e.operation), "Invalid title.");
    if(e.type === "equipment") {assert(stableId(e.slot), "Invalid equipment slot."); if(e.key != null) validateItemKey(e.key);}
    if(e.type === "unlock") assert(["skill", "recipe", "availability", "flag", "quest"].includes(e.kind) && typeof e.id === "string", "Invalid native unlock.");
    if(e.type === "event") assert(stableId(e.eventId) && natural(e.delay || 0), "Invalid authored event.");
    if(e.type === "world") assert(stableId(e.worldId) && stableId(e.key) && ["boolean", "number", "string"].includes(typeof e.value), "Invalid world state.");
    if(e.type === "party") assert(selector(e.target) && ["join", "leave"].includes(e.operation), "Invalid party membership.");
    if(e.type === "energy") {assert(stableId(e.energyId), "Invalid energy identity."); validateEnergyEffect(e);}
    if(e.type === "observation") assert(e.scope === "world" && stableId(e.key) && stableId(e.as), "Invalid explicit observation.");
    if(e.type === "site") assert(stableId(e.siteId) && e.operation === "open", "Invalid site access effect.");
    if(e.type === "pursuit") validatePursuitEffect(e);
    if(e.type === "situation") validateSituationEffect(e);
    if(e.type === "knowledge") validateKnowledgeBasis(e.basis);
    if(e.type === "container") validateContainerEffect(e);
    if(e.type==='foundationInteraction')validateFoundationInteractionEffect(e);
    if(e.delivery){
        assert(e.type==='vital','Scoped delivery requires an actual vital recipient.');
        validateFoundationDelivery(e.delivery);
    }
    jsonData(e);
}

const families = ["people", "commands", "powers", "advancements", "sites", "events", "controllers", "transitions", "origins", "conditions", "encounters", "energies", "pursuits", "situations", "containers"];
function validatePersonDefinition(d) {
    assert(stableId(d.id) && natural(d.revision) && d.revision > 0 && typeof d.label === "string" && stableId(d.worldId) && typeof d.location === "string" && ["native", "simulation"].includes(d.inventory), "Invalid person binding.");
    if(d.lifePolicy) assert(natural(d.lifePolicy.lifespan) && d.lifePolicy.lifespan > 0 && ["dead", "departed"].includes(d.lifePolicy.ending) && ["refund", "forfeit", "finish"].includes(d.lifePolicy.work), "Invalid authored lifespan/work policy.");
}
function freeze(v) {if(record(v) || Array.isArray(v)) {Object.values(v).forEach(freeze); Object.freeze(v);} return v;}
export function createSimulationRegistry(definitions = {}) {
    const registry = {};
    registry.onEnroll = freeze(copy(definitions.onEnroll || [])); registry.onEnroll.forEach(validateSimulationEffect);
    for(const family of families) {
        registry[family] = new Map();
        for(const d of definitions[family] || []) {
            assert(record(d) && stableId(d.id) && natural(d.revision) && d.revision > 0 && typeof d.label === "string" && !registry[family].has(d.id), `Invalid or duplicate ${family} definition.`);
            jsonData(d); validatePredicate(d.requires); validatePredicate(d.visibleWhen);
            if(d.audience) assert(family === "commands" && Array.isArray(d.audience) && d.audience.length > 0 && new Set(d.audience).size === d.audience.length && d.audience.every(id => ["$actor","$target"].includes(id) || stableId(id)), "Invalid command audience.");
            for(const key of ["costs", "effects", "onExpire", "onComplete"]) (d[key] || []).forEach(validateSimulationEffect);
            for(const cost of d.costs || []) assert(["item", "resource", "vital", "transfer", "custody", "energy"].includes(cost.type) && (cost.type !== "energy" || cost.operation === "use") &&
                (!["item", "resource", "vital"].includes(cost.type) || typeof cost.amount === "object" || cost.amount < 0), "Costs must reserve existing means.");
            registry[family].set(d.id, freeze(copy(d)));
        }
    }
    for(const d of registry.situations.values()) validateSituationDefinition(d);
    for(const d of registry.people.values()) validatePersonDefinition(d);
    for(const d of registry.energies.values()) validateEnergyPolicy(d);
    for(const d of registry.containers.values()) {validateContainerDefinition(d); assert(registry.energies.has(d.energyId), "Unknown container energy.");}
    for(const d of registry.pursuits.values()) {
        validatePursuitDefinition(d);
        const c=registry.commands.get(d.encounterCommand);
        assert(registry.people.has(d.actorId) && c?.encounterId && c.pursuitId === d.id && c.actorId === d.targetId && c.targetId === d.actorId && c.participants?.includes("$target"), "Invalid pursuit encounter binding.");
    }
    for(const d of registry.commands.values()) {
        if(d.participantsCoLocated!=null)assert(typeof d.participantsCoLocated==='boolean', 'Invalid participant contact policy.');
        assert(natural(d.duration || 0) && ["none", "refund", "forfeit"].includes(d.cancellation || "none"), "Invalid command timing.");
        assert(d.reservationReturns === undefined || d.reservationReturns === 1, 'Unsupported authored reservation return accounting.');
        if(d.completionRequires || d.completionCoLocated != null) {
            validatePredicate(d.completionRequires);
            const paidForfeit = d.group?.startsWith('remainder_') && d.completionFailure === 'forfeit' && d.cancellation === 'forfeit';
            assert(d.duration > 0 && (d.completionFailure === "refund" && d.cancellation === "refund" || paidForfeit) && (d.completionCoLocated == null || typeof d.completionCoLocated === "boolean"), "Invalid selected completion support.");
        }
        if(d.siteId) assert(registry.sites.has(d.siteId), "Unknown work site.");
        if(d.powerId) assert(registry.powers.has(d.powerId), "Unknown command power.");
        if(d.encounterId) assert(registry.encounters.has(d.encounterId), "Unknown encounter.");
        if(d.encounterId) assert(!d.siteId && !d.duration && !(d.effects || []).length && !d.outcomes, "An encounter cannot overlap a site job or command outcome.");
        if(d.targetDefinitionId) assert(registry.people.has(d.targetDefinitionId), "Unknown target role.");
        if(d.pursuitId) assert(registry.pursuits.get(d.pursuitId)?.encounterCommand === d.id, "Unsupported pursuit entry command.");
        if(d.participants) assert(Array.isArray(d.participants) && d.participants.length > 0 && new Set(d.participants).size === d.participants.length && d.participants.every(id => ["$actor", "$target", "$party"].includes(id) || stableId(id)), "Invalid participating actors.");
        for(const o of d.outcomes || []) {assert(stableId(o.id) && numeric(o.weight) && (typeof o.weight !== "number" || o.weight >= 0), "Invalid weighted command outcome."); (o.effects || []).forEach(validateSimulationEffect);}
        if(d.outcomes) assert(d.outcomes.length > 0 && (d.outcomes.some(o => typeof o.weight === "object") || d.outcomes.reduce((n,o) => n + o.weight, 0) > 0), "Empty command distribution.");
    }
    for(const d of registry.sites.values()) assert(natural(d.capacity) && d.capacity > 0 &&
        (d.provision == null || typeof d.provision === 'boolean'), "Invalid site capacity or provisioning policy.");
    for(const d of registry.events.values()) {
        assert(natural(d.interval) && d.interval > 0 && natural(d.lifetime || 0) && ["ambient", "offer", "decision"].includes(d.mode), "Invalid event timing.");
        assert(numeric(d.chance ?? 1) && (typeof d.chance !== "number" || d.chance >= 0 && d.chance <= 1), "Invalid event chance.");
        if(d.guaranteeAfter != null) assert(natural(d.guaranteeAfter) && d.guaranteeAfter > 0, "Invalid event guarantee.");
        if(d.maxOccurrences != null) assert(natural(d.maxOccurrences) && d.maxOccurrences > 0, "Invalid event occurrence limit.");
        for(const r of d.responses || []) {
            assert(stableId(r.id) && typeof r.label === "string", "Invalid event response."); validatePredicate(r.requires);
            if(r.requiresIdle != null)assert(typeof r.requiresIdle === "boolean", "Invalid response interruption policy.");
            [...(r.costs || []), ...(r.effects || [])].forEach(validateSimulationEffect);
        }
    }
    for(const d of registry.controllers.values()) {
        assert(registry.people.has(d.actorId) && natural(d.interval) && d.interval > 0 && Array.isArray(d.actions), "Invalid actor controller.");
        for(const a of d.actions) {
            assert(finite(a.priority), "Invalid controller priority."); validatePredicate(a.when);
            const kind = a.kind || "command";
            assert(kind === "command" && registry.commands.has(a.commandId) || kind === "encounter" && registry.encounters.has(a.encounterId) && stableId(a.responseId) || kind === "event" && registry.events.has(a.eventId) && stableId(a.responseId), "Invalid controller action.");
        }
    }
    for(const d of registry.powers.values()) {
        assert(["practice", "design", "investment", "authority", "hybrid"].includes(d.model), "Unsupported power model.");
        validatePredicate(d.execution); assert(finite(d.capacity ?? 1) && (d.capacity ?? 1) >= 0, "Invalid power capacity.");
        for(const c of d.constituents || []) assert(registry.powers.has(c), "Unknown power constituent.");
        for(const b of d.masteryBands || []) assert(finite(b.at) && b.at >= 0 && (b.costScale == null || finite(b.costScale) && b.costScale > 0) && (b.capacity == null || finite(b.capacity) && b.capacity >= 0), "Invalid mastery band.");
        for(const f of Object.values(d.functions || {})) assert(finite(f.capacity) && f.capacity >= 0, "Invalid designed function capacity.");
    }
    for(const d of registry.conditions.values()) {
        if(d.absence!=null)assert(d.absence==='zero', 'Invalid condition absence policy.');
        validatePredicate(d.immunity);
        if(d.interval != null) assert(natural(d.interval) && d.interval > 0, "Invalid condition tick interval.");
        (d.onTick || []).forEach(validateSimulationEffect);
    }
    for(const d of registry.advancements.values()) {
        assert(stableId(d.track) && stableId(d.branch), "Invalid advancement track.");
        for(const p of d.parents || []) assert(registry.advancements.has(p), "Unknown advancement parent.");
    }
    for(const d of registry.encounters.values()) {
        assert(Array.isArray(d.turns) && d.turns.length > 0 && typeof d.lethal === "boolean", "Invalid encounter.");
        (d.settlement || []).forEach(validateSimulationEffect);
        for(const t of d.turns) {
            assert(typeof t.cue === "string" && Array.isArray(t.responses) && t.responses.length > 0, "Invalid encounter turn.");
            for(const r of t.responses) {assert(stableId(r.id), "Invalid encounter response."); validatePredicate(r.requires); validatePredicate(r.visibleWhen); [...(r.costs || []), ...(r.effects || [])].forEach(validateSimulationEffect);}
        }
    }
    for(const d of registry.transitions.values()) {
        assert(["travel", "return", "ascend", "rebirth", "replay"].includes(d.kind), "Invalid campaign transition.");
        assert(stableId(d.worldId), "Invalid destination world.");
        assert(Array.isArray(d.reset || []) && (d.reset || []).every(k => ["journey", "world", "actorFacts", "completions", "sources", "techniques", "body", "resources", "knowledge", "powers", "progression", "relationships", "conditions", "equipment", "native"].includes(k)), "Invalid reset policy.");
    }
    // Validate references in nested responses and outcomes as well as commands.
    for(const family of families) for(const d of registry[family].values()) {
        const inspect = value => {
            if(Array.isArray(value)) {value.forEach(inspect); return;}
            if(!record(value)) return;
            if(value.type === "container") assert(registry.containers.has(value.containerId), "Unknown authored container.");
            if(value.type === "energy") assert(registry.energies.has(value.energyId), "Unknown authored energy.");
            if(value.type === "event") assert(registry.events.has(value.eventId), "Unknown authored caused event.");
            if(value.type === "site") assert(registry.sites.has(value.siteId), "Unknown authored site.");
            if(value.type === "situation") assert(registry.situations.has(value.situationId), "Unknown authored situation.");
            if(value.type === "pursuit") assert(registry.pursuits.has(value.pursuitId), "Unknown authored pursuit.");
            Object.values(value).forEach(inspect);
        }; inspect(d);
    }
    // Cycle detection makes hybrid/fusion/advancement authoring fail before play.
    for(const [family, key] of [["powers", "constituents"], ["advancements", "parents"]]) {
        const visit = (id, path) => {assert(!path.has(id), `Cyclic ${family} lineage.`); const next = new Set(path).add(id); (registry[family].get(id)[key] || []).forEach(child => visit(child, next));};
        for(const id of registry[family].keys()) visit(id, new Set());
    }
    return Object.freeze(registry);
}

export function createSimulationState(seed = 1) {
    return {schema: 1, seed, enrolledAt: null, people: {}, owners: {}, equipment: {}, custody: {}, knowledge: {}, relationships: {}, claims: {}, faculties: {}, powers: {}, progression: {}, titles: {}, conditions: {}, sites: {}, jobs: [], events: {}, checks: {}, controllers: {}, programs: {}, sessions: {}, party: [], causes: {}, transitions: [], log: []};
}

export function validateSimulationState(s, state, registry) {
    if(s == null) return;
    assert(record(s) && [1,2,3,4,5,6].includes(s.schema) && natural(s.seed) && s.seed > 0 && s.seed <= 0xffffffff && natural(s.enrolledAt) && s.enrolledAt <= state.clock, "Invalid simulation schema/anchor.");
    // Schema 3 is the caused-situation upgrade. Later versions can be
    // entered independently for reservation/learning support before any situation.
    assert(s.schema !== 3 || record(s.situations) && Object.keys(s.situations).length > 0, "Simulation schema3 needs a caused situation.");
    assert(s.pursuits == null || s.schema >= 2, "Pursuits need simulation schema2.");
    validateFoundationInteractionState(state);
    jsonData(s);
    for(const key of ["people", "owners", "equipment", "custody", "knowledge", "relationships", "claims", "faculties", "powers", "progression", "titles", "conditions", "sites", "events", "checks", "controllers", "programs", "sessions", "causes"]) assert(record(s[key]), `Invalid simulation ${key}.`);
    for(const key of ["jobs", "party", "transitions", "log"]) assert(Array.isArray(s[key]), `Invalid simulation ${key}.`);
    const person = id => assert(stableId(id) && s.people[id] && state.actors[id], `Unknown persistent actor ${id}.`);
    validateContainerState(s,state,registry,person);
    validateSituations(s, state, registry, person);
    for(const knowledge of Object.values(s.knowledge)) for(const k of Object.values(knowledge)) validateKnowledgeBasis(k.basis, person, s.situations || {});
    if(s.energies != null) validateEnergyState(s.energies, person, registry);
    for(const [id, p] of Object.entries(s.people)) {
        person(id); assert(["alive", "incapacitated", "dead", "departed"].includes(p.life) && ["native", "simulation"].includes(p.inventory) && typeof p.location === "string" && natural(p.bornAt), "Invalid persistent life/binding.");
        if(registry && id !== "player") assert(registry.people.has(p.definitionId || id), "Unsupported persistent person.");
        for(const [key,v] of Object.entries(p.vitals || {})) assert(["health", "stamina", "max_health", "max_stamina"].includes(key) && finite(v) && v >= 0, "Invalid saved body vitals.");
        if(p.lifePolicy) assert(natural(p.lifePolicy.lifespan) && p.lifePolicy.lifespan > 0 && ["dead", "departed"].includes(p.lifePolicy.ending) && ["refund", "forfeit", "finish"].includes(p.lifePolicy.work), "Invalid saved life policy.");
    }
    for(const [id, inventory] of Object.entries(s.owners)) {
        person(id); assert(s.people[id].inventory === "simulation", "Native inventory cannot have a second owner.");
        validateGameplaySnapshot({[id]: {inventory, skills: {}, reputation: {}}});
    }
    for(const [actor, slots] of Object.entries(s.equipment)) {person(actor); for(const [slot, key] of Object.entries(slots)) {assert(stableId(slot), "Invalid equipment slot."); validateItemKey(key);}}
    for(const [key,c] of Object.entries(s.custody)) {assert(stableId(key) && natural(c.count) && c.count > 0 && natural(c.at) && c.at <= state.clock, "Invalid custody."); person(c.owner); person(c.holder); validateItemKey(c.key);}
    for(const [actor, knowledge] of Object.entries(s.knowledge)) {person(actor); for(const [key, k] of Object.entries(knowledge)) assert(stableId(key) && ["seen", "interpreted", "understood"].includes(k.stage) && typeof k.value === "string" && natural(k.at) && k.at <= state.clock && stableId(k.cause), "Invalid observed knowledge.");}
    for(const [actor, relations] of Object.entries(s.relationships)) {person(actor); for(const [target,r] of Object.entries(relations)) {person(target); assert(record(r.axes) && Array.isArray(r.memories) && r.memories.length <= 32, "Invalid directed memory."); for(const [axis,v] of Object.entries(r.axes)) assert(stableId(axis) && finite(v), "Invalid relationship axis.");}}
    for(const [id,c] of Object.entries(s.claims)) {assert(stableId(id) && ["held", "settled"].includes(c.status) && stableId(c.cause), "Invalid unique claim."); person(c.owner);}
    for(const [actor, records] of Object.entries(s.conditions)) {person(actor); for(const [id,c] of Object.entries(records)) {assert(stableId(id) && (c.expiresAt == null || natural(c.expiresAt)) && finite(c.intensity) && c.intensity >= 0, "Invalid actor condition."); if(c.nextTick != null) {assert(natural(c.nextTick) && c.nextTick >= state.clock && natural(c.interval) && c.interval > 0, "Invalid condition boundary."); c.onTick.forEach(validateSimulationEffect);} if(registry) assert(registry.conditions.has(id), "Unsupported condition.");}}
    for(const [actor, records] of Object.entries(s.faculties)) {person(actor); for(const [id,f] of Object.entries(records)) assert(stableId(id) && state.actors[actor].sources[id] && typeof f.awakened === "boolean" && typeof f.active === "boolean" && typeof f.suppressed === "boolean" && finite(f.development) && f.development >= 0, "Invalid faculty lifecycle.");}
    for(const [actor, powers] of Object.entries(s.powers)) {person(actor); for(const [id,p] of Object.entries(powers)) {assert(stableId(id) && natural(p.revision) && p.revision > 0 && finite(p.mastery) && p.mastery >= 0 && typeof p.owned === "boolean" && Array.isArray(p.fragments) && natural(p.executions), "Invalid power record."); if(registry) assert(registry.powers.has(id), "Unsupported saved power.");}}
    for(const [actor, tracks] of Object.entries(s.progression)) {person(actor); for(const t of Object.values(tracks)) {assert(record(t.values) && record(t.branches) && record(t.receipts), "Invalid progression track."); for(const v of Object.values(t.values)) assert(finite(v) && v >= 0, "Invalid progress value.");}}
    const busy = new Set();
    for(const j of s.jobs) {
        person(j.actorId); assert(stableId(j.id) && !busy.has(j.actorId) && natural(j.due) && j.due >= state.clock && natural(j.sequence) && j.sequence <= state.sequence && stableId(j.commandId) && natural(j.revision) && j.revision > 0 && ["none", "refund", "forfeit"].includes(j.cancellation), "Invalid saved simulation job.");
        if(j.audience) {assert(Array.isArray(j.audience) && j.audience.length > 0 && new Set(j.audience).size === j.audience.length, "Invalid saved job audience.");j.audience.forEach(person);}
        const participants = j.participants || [j.actorId];
        assert(Array.isArray(participants) && participants.includes(j.actorId) && new Set(participants).size === participants.length, "Invalid reserved participants.");
        for(const id of participants) {person(id); assert(!busy.has(id) && !state.pending.some(p => p.context.actorId === id) && !Object.values(state.actors[id].techniques).some(t => t.practice), "Overlapping participant work."); busy.add(id);}
        [...j.costs, ...j.effects].forEach(validateSimulationEffect);
        if(j.reservationReturns != null) assert(s.schema >= 4 && j.reservationReturns === 1, "Unsupported saved reservation return accounting.");
        if(j.causalStory != null) {
            validateCausalStoryJob(j,state,registry);
            const d = registry ? registry.commands.get(j.commandId) : causalStoryDefinitions.commands.find(d => d.id === j.commandId),
                accepted = state.causalStories?.receipts?.find(r =>
                r.kind === 'accepted_work' && r.actorId === 'player' && r.result?.jobId === j.id);
            assert(d?.group === 'causal_story' && d.duration === 3 && j.id === `simulation:${j.sequence}` &&
                j.context?.actorId === 'player' && j.context.targetId === d.targetId &&
                JSON.stringify(j.participants) === JSON.stringify(['player',d.targetId,'causal.story.nell']) &&
                j.claim === (d.claim || null) && j.siteId === d.siteId &&
                accepted?.cause === j.id && accepted.sequence === j.sequence && natural(accepted.at) && accepted.at <= state.clock &&
                j.due === accepted.at + d.duration && accepted.result.commandId === d.id && accepted.result.duration === d.duration &&
                accepted.result.cancellation === d.cancellation && s.sites[j.siteId]?.reservations[j.id] === 'player',
                'A timed causal counter requires its exact authored participants, actual accepted-work cause and live reservation.');
        }
        if(j.frontierContribution) {
            const contribution=j.frontierContribution, f=state.actors.player.facts;
            const expected=j.commandId==='original_frontier.work_cave_protected'?['Cave room','Nearby cave']:j.commandId==='original_frontier.work_forest_protected'?['Forest','Forest road']:null;
            assert(s.schema>=4&&j.actorId==='player'&&expected&&contribution.schema===1&&contribution.zone===expected[0]&&contribution.parent===expected[1]&&
                natural(contribution.baseline)&&natural(contribution.count)&&contribution.count>contribution.baseline&&natural(contribution.at)&&contribution.at<=state.clock&&
                f['original_frontier.control.encounterReady']===true&&f['original_frontier.control.encounterConsumed']===true&&
                contribution.zone===f['original_frontier.control.encounterZone']&&contribution.parent===f['original_frontier.control.encounterParent']&&
                contribution.baseline===f['original_frontier.control.encounterBaseline']&&contribution.count===f['original_frontier.control.encounterCount']&&contribution.at===f['original_frontier.control.encounterAt'], 'Invalid reserved native encounter contribution.');
        }
        if(j.completionSupport) {
            const support = j.completionSupport;
            const paidForfeit = support.failure === 'forfeit' && j.cancellation === 'forfeit' && state.schema === 11 && state.auditRemainder?.schema === 1 && registry?.commands.get(j.commandId)?.group?.startsWith('remainder_');
            assert(s.schema >= 4 && support.schema === 1 && (support.failure === "refund" || paidForfeit) && typeof support.coLocated === "boolean" && typeof support.location === "string", "Unsupported saved completion support.");
            validatePredicate(support.requires);
        }
        if(registry) assert(registry.commands.has(j.commandId), "Unsupported saved job.");
        if(j.siteId) assert(s.sites[j.siteId]?.reservations[j.id] === j.actorId, "Lost site reservation.");
    }
    for(const [id, site] of Object.entries(s.sites)) {assert(stableId(id) && natural(site.capacity) && site.capacity > 0 && record(site.reservations) && Object.keys(site.reservations).length <= site.capacity, "Invalid site capacity/reservation."); if(site.owner)person(site.owner);for(const job of Object.keys(site.reservations)) assert(s.jobs.some(j => j.id === job && j.siteId === id), "Orphan site reservation.");}
    for(const [id, e] of Object.entries(s.events)) {
        assert(stableId(id) && stableId(e.definitionId) && natural(e.at) && e.at <= state.clock && (e.expiresAt == null || natural(e.expiresAt)) && ["open", "resolved", "expired"].includes(e.status) && ["ambient", "offer", "decision"].includes(e.mode), "Invalid occurrence.");
        if(registry) assert(registry.events.has(e.definitionId), "Unsupported occurrence.");
        person(e.actorId); if(e.targetId) person(e.targetId);
        for(const r of e.responses) {validatePredicate(r.requires);if(r.requiresIdle != null)assert(typeof r.requiresIdle === "boolean", "Invalid saved response interruption policy.");[...(r.costs || []), ...(r.effects || [])].forEach(validateSimulationEffect);}
        e.onExpire.forEach(validateSimulationEffect);
    }
    for(const [id,c] of Object.entries(s.checks)) {
        assert(stableId(id) && natural(c.due) && c.due >= state.clock && natural(c.rng) && c.rng > 0 && c.rng <= 0xffffffff && natural(c.count) && natural(c.interval) && c.interval > 0 && (c.attempts == null || natural(c.attempts)) && (c.misses == null || natural(c.misses)) && (c.occurrences == null || natural(c.occurrences)), "Invalid saved event check.");
        if(c.actorId) person(c.actorId); if(c.targetId) person(c.targetId);
        if(registry) assert(registry.events.has(c.definitionId || id), "Unsupported event check.");
    }
    for(const [id,c] of Object.entries(s.controllers)) {person(c.actorId); assert(stableId(id) && natural(c.due) && (c.due >= state.clock || s.people[c.actorId].life !== "alive") && natural(c.interval) && c.interval > 0, "Invalid controller boundary."); if(registry) assert(registry.controllers.has(c.definitionId || id), "Unsupported controller.");}
    for(const [actor,p] of Object.entries(s.programs)) {person(actor); assert(stableId(p.commandId) && natural(p.remaining) && p.remaining <= 10000 && ["running", "paused", "complete"].includes(p.status), "Invalid bounded automation."); if(registry) assert(registry.commands.has(p.commandId), "Unsupported automation command.");}
    for(const [actor,session] of Object.entries(s.sessions)) {person(actor); assert(Array.isArray(session.turns) && natural(session.turn) && session.turn < session.turns.length && typeof session.lethal === "boolean", "Invalid resumable encounter.");
        if(session.nativeBattle) {
            validateNativeBattle(session.nativeBattle,session,state);
        }
        const participants = session.participants || [actor]; assert(Array.isArray(participants) && participants.includes(actor) && new Set(participants).size === participants.length, "Invalid encounter participants.");
        for(const id of participants) {person(id); assert(!busy.has(id) && !state.pending.some(j => j.context.actorId === id) && !Object.values(state.actors[id].techniques).some(t => t.practice), "Overlapping encounter participants."); busy.add(id);}
        for(const turn of session.turns) for(const r of turn.responses) [...(r.costs || []), ...(r.effects || [])].forEach(validateSimulationEffect); session.settlement.forEach(validateSimulationEffect);}
    if(s.pursuits != null) validatePursuits(s.pursuits,state,registry,person,busy);
    for(const actor of s.party) person(actor);
    assert(new Set(s.party).size === s.party.length && s.log.length <= 100 && s.transitions.length <= 32, "Invalid bounded simulation history.");
}
