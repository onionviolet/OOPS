import {createTemperamentPort} from './person_temperament.js';
import {derivedBond} from './person_memory_effects.js';
import {readFactsFrame,invalidateFactsInput,withFactsMutation} from './facts_frame.js';
import {domainRegistry} from './domain_registry.js';
import {hpFacts} from './book_world_hp_facts.js';
import {generatedPeoplePresenceFacts} from './story_aftermath.js';
import {leverFacts} from './lever_lesson.js';
import {fieldWorksFacts} from './field_works_facts.js';
import {partnerFacts} from './party_partner_facts.js';
import {systemsWorkshopFacts} from './systems_workshop_runtime.js';
import {applyFoundationInteractionEffect,resolveFoundationDelivery,recordFoundationDelivery} from './foundation_interaction_policy.js';
import {addInventoryRequirementFacts} from './inventory_requirement_facts.js';
import {foundationInteractionProbeFacts} from './foundation_interaction_content.js';
import {applyContainerEffect,containerFacts,advanceContainerClocks} from './structured_container_runtime.js';
import {managementFacts} from './management/facts.js';
import {alloyEquipmentFacts} from "./alloy_equipment.js";
import {steamAbsorptionFacts} from './steam_absorption_facts.js';
import {steamDFStockCount,recordSteamDFStockMutation} from './steam_df_runtime.js';
import {contextualBalmFacts} from './contextual_balm_facts.js';
import {coolingRefinementFacts} from './cooling_refinement_facts.js';
import {agreedDutyFacts} from './agreed_duty_facts.js';
import {gameAbsorptionAssayFacts} from './game_absorption_assay_facts.js';
import {homeFurnishingFacts} from './home_furnishing_facts.js';
import {factorioRetortFacts} from './factorio_retort_facts.js';
import {proto23Facts} from './proto23_world_actions.js';
import {crushSocialFacts} from './crush_social_facts.js';
import {paradiseCampaignControllerAllowed} from './book_world_paradise_campaign_runtime.js';
import {paradiseCampaignFacts} from './book_world_paradise_campaign_facts.js';
import {worldCompletionFacts} from './world_completion_facts.js';
import {worldCompletionLensCustodyUseAllowed,worldCompletionLensCustodyReturnAllowed} from './world_completion_lens_facts.js';
import {lorePracticeFacts} from './lore_practice_facts.js';
import {bookCareFacts} from './book_care_facts.js';
import {fieldCareFacts} from './field_care_facts.js';
import {statusCareFacts} from './status_care_facts.js';
import {auditRemainderControllerAllowed} from './audit_remainder_state.js';
import {causalStoryFacts} from './causal_story_content.js';
import {causalStoryOccupiesActor} from './causal_story_core.js';
import {auditRemainderCombinedFacts} from './audit_remainder_facts.js';
import {auditRemainderFacts} from './audit_remainder_state.js';
import {nethackFieldcraftFacts} from './nethack_fieldcraft_facts.js';
import {auditedWorkshopFacts} from './audited_workshop_facts.js';
import {paradiseFacts} from './book_world_paradise_actions.js';
import {molFacts} from './book_world_mol_actions.js';
import {MOL_FOOTPRINTS} from './book_world_mol_ids.js';
import {PARADISE_FOOTPRINTS,PARADISE_IDS} from './book_world_paradise_ids.js';
import {nestedLifeFacts} from './feature_expansion_nested_life.js';
import {relayFacts} from './feature_expansion_subtlety_host.js';
import {referenceDeskFacts} from './feature_expansion_reference_desk.js';
import {nestedFacts} from './feature_expansion_nested_host.js';
import {nestedChainFacts} from './feature_expansion_nested_chains.js';
import {repositoryAbsorptionFacts} from './repository_absorption_facts.js';
import {societyFacts} from './feature_expansion_society.js';
import {featureObjectFacts} from './feature_expansion_objects_host.js';
import {referenceGameplayFacts} from './reference_gameplay_host.js';
import {featurePowerFacts} from './feature_expansion_powers.js';
import {featureBattleFacts} from './feature_battle_facts.js';
import {tidemarkContext} from './feature_expansion_destination_host.js';
import {realmFacts,applyRealmWorldEffect,applyRealmSiteEffect} from './realm_state.js';
import {originalFrontierFacts} from './original_frontier_facts.js';
import {applySituationEffect} from "./causal_situations.js";
import {assert, stableId, finite, copy, meets, validateSimulationEffect} from "./simulation_contracts.js";
import {stageAcquisition} from "./acquisition.js";
import {applyGameplayEffect} from "./gameplay_transactions.js";
import {prepareSimulationEffects, deriveSimulationSeed} from "./simulation_resolution.js";
import {applyEnergyEffect} from "./energy_resources.js";
import {canonicalDurabilityKey} from './absorb_e2/durability.js';
import {applyPursuitEffect,pursuitContact} from "./pursuit.js";
import {framedSimulationFacts} from './simulation_render.js';
import {grantSource,removeSource} from './source_suppliers.js';
import {applyConstructEffect} from './temporary_construct.js';
import {syncEquipSources} from './implant_service.js';

// structuredClone-equivalent deep copy for the JSON-shaped plan data (state,
// gameplay, budgets), about twice as fast on large saves. Shared references and
// cycles map to one copy, as structuredClone does. Anything that is not a plain
// object or plain array (Map, Date, null prototype, class instance, function)
// goes through structuredClone itself, so its result and errors are unchanged.
const plainObject = Object.prototype, plainArray = Array.prototype;
export function cloneData(value) {
    if(typeof value !== "object" || value === null) return typeof value === "function" ? structuredClone(value) : value;
    const seen = new Map();
    const visit = v => {
        if(typeof v !== "object" || v === null) return typeof v === "function" ? structuredClone(v) : v;
        let c = seen.get(v);
        if(c !== undefined) return c;
        const proto = Object.getPrototypeOf(v);
        if(proto === plainArray) {
            const n = v.length; c = new Array(n); seen.set(v, c);
            for(let i = 0; i < n; i++) if(i in v) c[i] = visit(v[i]);
            if(Object.keys(v).length !== n) {c = structuredClone(v); seen.set(v, c);}
            return c;
        }
        if(proto !== plainObject) {c = structuredClone(v); seen.set(v, c); return c;}
        c = {}; seen.set(v, c);
        for(const k of Object.keys(v)) {
            if(k === "__proto__") Object.defineProperty(c, k, {value: visit(v[k]), writable: true, enumerable: true, configurable: true});
            else c[k] = visit(v[k]);
        }
        return c;
    };
    return visit(value);
}
export const participant = (value, context) => value === "$target" ? context.targetId : value === "$actor" || value == null ? context.actorId : value;
export function person(state, id) {assert(state.simulation?.people[id] && state.actors[id], `Unknown simulation participant ${id}.`); return state.simulation.people[id];}
export function inventory(plan, id) {
    const p = person(plan.state, id);
    const owned = p.inventory === "native" ? plan.gameplay[id]?.inventory : plan.state.simulation.owners[id];
    assert(owned, `No inventory binding for ${id}.`); return owned;
}
export function writeInventory(plan, id, value) {
    invalidateFactsInput(plan.state); invalidateFactsInput(plan.gameplay);
    if(person(plan.state, id).inventory === "native") plan.gameplay[id].inventory = value;
    else plan.state.simulation.owners[id] = value;
}
// Preserve the actual identified native copy when authored unit keys name its
// canonical item. An ambiguous collection needs an exact selected copy.
export function resolveSimulationInventoryKey(rows,key) {
    if(rows?.[key])return key;
    const matches=Object.keys(rows||{}).filter(actual=>canonicalDurabilityKey(actual)===key);
    assert(matches.length<=1,'Choose the exact identified item copy.');
    return matches[0]||key;
}
export function resolveSimulationCostKeys(plan,costs,context) {
    return costs.map(effect=>{
        const e=effectContext(effect,context);
        if(e.type==='item'&&e.amount<0)return {...effect,key:resolveSimulationInventoryKey(inventory(plan,e.actor),e.key)};
        if(['transfer','custody'].includes(e.type))return {...effect,key:resolveSimulationInventoryKey(inventory(plan,e.from),e.key)};
        return effect;
    });
}
export function simulationFacts(state, context, registry, predicates = null) {
    // The expensive projection is independent of the selected predicate. Absent
    // inventory requirements are added to a caller-owned copy after reuse, so a
    // zero requested by one command cannot leak into another command's facts.
    const build = () => buildSimulationFacts(state, context, registry);
    const facts = readFactsFrame(state, context, registry, build, () => predicates
        ? build() : framedSimulationFacts(state, context, registry, build));
    const people = state.simulation.people, target = people[context.targetId];
    return addInventoryRequirementFacts(facts, predicates, {
        'item.': people[context.actorId]?.inventory === 'native' ? context.gameplay?.[context.actorId]?.inventory : state.simulation.owners[context.actorId],
        'target.item.': target?.inventory === 'native' ? context.gameplay?.[context.targetId]?.inventory : target ? state.simulation.owners[context.targetId] : null,
    });
}
function buildSimulationFacts(state, context, registry) {
    const s = state.simulation, actor = context.actorId, a = state.actors[actor];
    assert(s && a, "Enroll the living-world services first.");
    const referenceFacts = referenceGameplayFacts(state, context, registry);
    const facts = {...context.facts,...managementFacts(state,context),...gameAbsorptionAssayFacts(state,context,registry),...worldCompletionFacts(state,context),...statusCareFacts(state,context),...fieldCareFacts(state,context),...bookCareFacts(state,context),...lorePracticeFacts(state,context),...causalStoryFacts(state,context),...auditRemainderFacts(state),...relayFacts(state,context),...referenceDeskFacts(state,context),...nestedFacts(state,context,context.nestedNative),...nestedChainFacts(state,context),...nestedLifeFacts(state,context),...paradiseFacts(state,context),...paradiseCampaignFacts(state,context),...featureObjectFacts(state,context,registry), ...referenceFacts, ...auditRemainderCombinedFacts(state,{...context,facts:{...context.facts,...referenceFacts,...auditRemainderFacts(state)}},registry), ...auditedWorkshopFacts(state,{...context,facts:{...context.facts,...referenceFacts}},registry), ...nethackFieldcraftFacts(state,context,registry), ...societyFacts(state,context), ...repositoryAbsorptionFacts(state,context), ...featurePowerFacts(state,context), ...featureBattleFacts(state,context), ...tidemarkContext(state,context).facts, ...originalFrontierFacts(state,context,registry), ...realmFacts(state,actor), ...molFacts(state,context), clock: state.clock, "actor.life": s.people[actor]?.life, "native.alive": actor==='player'?context.nativeAlive===true:s.people[actor]?.life==='alive', "native.ready":context.nativeReady!==false, "actor.world": a.worldId, "actor.location": context.facts?.location || s.people[actor]?.location};
    // Native clock callers may supply only expedition facts. Re-read current LOTM role/body
    // support through its existing domain projection at the actual commit boundary.
    if(state.lotm) Object.assign(facts,domainRegistry.project('lotm','facts',state,context)||{});
    Object.assign(facts,hpFacts(state,context));
    Object.assign(facts,leverFacts(state,context),generatedPeoplePresenceFacts(state,context));
    Object.assign(facts,fieldWorksFacts(state,context));
    Object.assign(facts,partnerFacts(state),systemsWorkshopFacts(state),foundationInteractionProbeFacts(state,context));
    Object.assign(facts,containerFacts(state,context,registry));
    Object.assign(facts, alloyEquipmentFacts(state, context));
    const owned = s.people[actor]?.inventory === "native" ? context.gameplay?.[actor]?.inventory : s.owners[actor];
    Object.assign(facts,homeFurnishingFacts(state,context),crushSocialFacts(state,context),factorioRetortFacts(state,context,registry),proto23Facts(state,context));
    Object.assign(facts,contextualBalmFacts(state,context),coolingRefinementFacts(state,context),agreedDutyFacts(state,context));
    Object.assign(facts,steamAbsorptionFacts(state,context,registry));
    for(const [key,count] of Object.entries(owned || {})) facts[`item.${key}`] = count;
    for(const [key,count] of Object.entries(owned||{})) {
        const canonical=canonicalDurabilityKey(key);
        if(canonical!==key)facts[`item.${canonical}`]=(facts[`item.${canonical}`]||0)+count;
    }
    facts["actor.busyOrder"] = !!a.facts["work.order"];
    for(const [k,v] of Object.entries(a.facts)) facts[`actor.${k}`] = v;
    for(const [k,v] of Object.entries(a.resources)) facts[`resource.${k}`] = v;
    for(const [id,e] of Object.entries(s.energies?.[actor] || {})) {facts[`energy.${id}.known`] = true; facts[`energy.${id}.reserve`] = e.reserve; facts[`energy.${id}.strain`] = e.strain;}
    for(const [k,v] of Object.entries(s.people[actor]?.body || {})) facts[`body.${k}`] = v;
    for(const [k,v] of Object.entries(context.vitals?.[actor] || s.people[actor]?.vitals || {})) facts[`vital.${k}`] = v;
    for(const [id,c] of Object.entries(s.custody)) {facts[`custody.${id}.owner`] = c.owner; facts[`custody.${id}.holder`] = c.holder;}
    for(const scope of ["world", "campaign", "journey"]) for(const [k,v] of Object.entries((scope === "world" ? state.worlds[a.worldId] : state[scope]).facts)) facts[`${scope}.${k}`] = v;
    for(const [id,d] of Object.entries(s.knowledge[actor] || {})) {
        facts[`knowledge.${id}.seen`] = true; facts[`knowledge.${id}.understood`] = d.stage === "understood";
        facts[`knowledge.${id}.value`] = d.value;
        if(d.basis) {facts[`knowledge.${id}.basis`] = d.basis.kind; facts[`knowledge.${id}.attributedTo`] = d.basis.attributedTo;}
    }
    for(const [id,p] of Object.entries(s.powers[actor] || {})) {facts[`power.${id}.owned`] = p.owned; facts[`power.${id}.mastery`] = p.mastery; facts[`power.${id}.fragments`] = p.fragments.length;}
    for(const [id,f] of Object.entries(s.faculties[actor] || {})) {
        const source = a.sources[id], present = source && (source.expiresAt == null || source.expiresAt > state.clock);
        facts[`faculty.${id}.awakened`] = !!present && f.awakened;
        facts[`faculty.${id}.active`] = !!present && f.active && f.awakened && !f.suppressed;
        facts[`faculty.${id}.development`] = f.development;
    }
    for(const [id,definition] of registry?.simulation?.conditions||[])if(definition.absence==='zero')facts[`condition.${id}`]=0;
    for(const [id,c] of Object.entries(s.conditions[actor] || {})) facts[`condition.${id}`] = c.expiresAt == null || c.expiresAt > state.clock ? c.intensity : 0;
    for(const [track,t] of Object.entries(s.progression[actor] || {})) {
        for(const [k,v] of Object.entries(t.values)) facts[`progress.${track}.${k}`] = v;
        for(const k of Object.keys(t.branches)) facts[`branch.${track}.${k}`] = true;
    }
    for(const [id,c] of Object.entries(s.claims)) {facts[`claim.${id}.held`] = c.status === "held"; facts[`claim.${id}.owner`] = c.owner;}
    for(const id of Object.keys(s.titles[actor] || {})) facts[`title.${id}`] = true;
    for(const [id,r] of Object.entries(s.situations || {})) {facts[`situation.${id}.phase`] = r.phase; facts[`situation.${id}.deadline`] = r.deadline; facts[`situation.${id}.responseOpen`] = r.deadline == null || state.clock < r.deadline;}
    if(context.targetId) {
        const target = person(state, context.targetId); facts["target.life"] = target.life;
        facts["target.world"] = state.actors[context.targetId].worldId;
        facts["target.location"] = target.location;
        for(const [key,value]of Object.entries(state.actors[context.targetId]?.facts||{}))facts[`target.actor.${key}`]=value;
        for(const [key,value] of Object.entries(target.body||{}))facts[`target.body.${key}`]=value;
        for(const [id,energy] of Object.entries(s.energies?.[context.targetId]||{})) {
            facts[`target.energy.${id}.known`]=true;
            facts[`target.energy.${id}.reserve`]=energy.reserve;
            facts[`target.energy.${id}.strain`]=energy.strain;
        }
        for(const [id,faculty] of Object.entries(s.faculties[context.targetId]||{})) {
            const source=state.actors[context.targetId].sources[id],present=source&&(source.expiresAt==null||source.expiresAt>state.clock);
            facts[`target.faculty.${id}.active`]=!!present&&faculty.awakened&&faculty.active&&!faculty.suppressed;
        }
        // Execution predicates resolve the actual target. These internal facts
        // do not introduce a person or disclose their condition to an observer.
        for(const id of registry?.simulation?.conditions?.keys()||[])facts[`target.condition.${id}`]=0;
        for(const [id,c]of Object.entries(s.conditions[context.targetId]||{}))facts[`target.condition.${id}`]=c.expiresAt==null||c.expiresAt>state.clock?c.intensity:0;
        for(const [key,v]of Object.entries(context.vitals?.[context.targetId]||target.vitals||{}))facts[`target.vital.${key}`]=v;
        for(const [key,count]of Object.entries(target.inventory==='native'?context.gameplay?.[context.targetId]?.inventory||{}:s.owners[context.targetId]||{}))facts[`target.item.${key}`]=count;
        for(const [key,count]of Object.entries(state.actors[context.targetId]?.resources||{}))facts[`target.resource.${key}`]=count;
        for(const [id,knowledge] of Object.entries(s.knowledge[context.targetId] || {})) {
            facts[`target.knowledge.${id}.seen`] = true;
            facts[`target.knowledge.${id}.understood`] = knowledge.stage === 'understood';
        }
        for(const [k,v] of Object.entries(s.relationships[actor]?.[context.targetId]?.axes || {})) facts[`relationship.${k}`] = Number.isSafeInteger(context.facts?.calendarMinute) ? derivedBond({memory:domainRegistry.command('memory','read')?.(),holder:actor,subject:context.targetId,axis:k,baseline:v,temperamentOf:createTemperamentPort(id=>registry?.simulation?.people.get(s.people[id]?.definitionId || id)),day:Math.floor(context.facts.calendarMinute/1440)}) : v;
        // Only observations are exposed here. Actual hidden builds remain private.
        for(const [k,v] of Object.entries(s.knowledge[actor] || {}).filter(([k]) => k.startsWith(`person.${context.targetId}.`))) facts[k] = v.value;
    }
    for(const [id,p] of Object.entries(s.pursuits || {})) if(actor === p.targetId) {
        facts[`pursuit.${id}.known`]=true;
        facts[`pursuit.${id}.active`]=["investigating","moving","searching","waiting","sheltered"].includes(p.status);
        facts[`pursuit.${id}.contact`]=p.status === "waiting" && (p.request.expiresAt == null || p.request.expiresAt > state.clock) && pursuitContact(state,p,context);
        facts[`pursuit.${id}.declared`]=true;
    }
    return facts;
}
export function effectContext(e, context) {
    const out = copy(e);
    for(const key of ["actor", "target", "from", "to"]) if(out[key] != null) out[key] = participant(out[key], context);
    out.actor ??= context.actorId;
    return out;
}
// Effect preparation reads facts only for formula amounts. Literal amounts (most
// job settlements) skip the full facts projection; its own guards still run.
function effectFacts(plan, effects, context, registry) {
    const state = plan.state;
    if((effects || []).some(e => e?.amount != null && typeof e.amount !== "number")) return simulationFacts(state, {...context, vitals: plan.vitals}, registry);
    assert(state.simulation && state.actors[context.actorId], "Enroll the living-world services first.");
    if(context.targetId) person(state, context.targetId);
    return {};
}
export function applySimulationEffects(plan, effects, context, registry, cause, options = {}) {
    return withFactsMutation([plan.state,plan.gameplay], () => applyEffects(plan,effects,context,registry,cause,options));
}
function applyEffects(plan, effects, context, registry, cause, {spending = false} = {}) {
    assert(stableId(cause), "Effects need a durable cause.");
    const state = plan.state, s = state.simulation;
    const expanded = [];
    for(const e of prepareSimulationEffects(effects, effectFacts(plan, effects, context, registry), registry, cause)) {
        const roster = context.partyIds || s.party;
        const actors = e.actor === "$party" ? roster : [e.actor];
        const targets = e.target === "$party" ? roster : [e.target];
        if(e.actor === "$party" || e.target === "$party") {
            assert(roster.length > 0 && new Set(roster).size === roster.length, "No valid participating party.");
            if(e.maxTargets != null) assert(roster.length <= e.maxTargets, "Effect target scope exceeds declared capacity.");
            for(const id of roster) assert(person(state,id).life === "alive" && state.actors[id].worldId === state.actors[context.actorId].worldId, "A party participant is unavailable here.");
        }
        for(const actor of actors) for(const target of targets) expanded.push({...e,...(actor != null ? {actor} : {}),...(target != null ? {target} : {})});
    }
    assert(expanded.length <= 256, "Effect activation budget exceeded.");
    for(const original of expanded) {
        const steamDFBefore=steamDFStockCount(state);
        validateSimulationEffect(original);
        const e = effectContext(original, context), actor = e.actor, p = person(state, actor), a = state.actors[actor];
        if(e.delivery){const result=resolveFoundationDelivery(state,e,context);recordFoundationDelivery(state,e,context,cause,result);if(!result.allowed)continue;}
        if(e.type==='foundationInteraction'){applyFoundationInteractionEffect(state,e,context,cause);continue;}
        if(e.type==='item'&&e.amount<0||e.type==='equipment'&&e.key!=null)e.key=resolveSimulationInventoryKey(inventory(plan,actor),e.key);
        if(['transfer','custody'].includes(e.type))e.key=resolveSimulationInventoryKey(inventory(plan,e.from),e.key);
        if(spending) assert(["resource", "vital", "item", "transfer", "custody", "energy"].includes(e.type) && (e.type !== "energy" || e.operation === "use") &&
            (!["resource", "vital", "item"].includes(e.type) || e.amount < 0), "Reservations must spend existing means.");
        if(e.type === "spawn") {
            const d = e.template || registry.simulation.people.get(e.definitionId);
            assert(d && d.inventory === "simulation" && !state.actors[e.personId], "Unknown, native-bound or duplicate new actor.");
            assert(state.worlds[d.worldId], "New actor's world must exist first.");
            state.actors[e.personId] = {facts:{}, resources:copy(d.resources || {}),completed:{},sources:{},techniques:{},worldId:d.worldId};
            s.people[e.personId] = {life:"alive",inventory:"simulation",location:d.location,bornAt:state.clock,definitionId:d.id,definitionRevision:d.revision};
            s.people[e.personId].createdBy = actor;
            for(const key of ["vitals","body","lifePolicy"]) if(d[key]) s.people[e.personId][key] = copy(d[key]);
            s.owners[e.personId] = {};
            for(const controller of registry.simulation.controllers.values()) if(controller.actorId === d.id && auditRemainderControllerAllowed(state,controller) && paradiseCampaignControllerAllowed(state,controller)) s.controllers[`${e.personId}:${controller.id}`] = {definitionId:controller.id,actorId:e.personId,due:state.clock+controller.interval,interval:controller.interval};
        } else if(e.type === "relocate") {
            assert(!causalStoryOccupiesActor(state,actor), 'This actual body remains restrained. Release it before travel.');
            const sourceMove=p.inventory==='native'&&state.bookWorldCampaign&&actor!=='player'&&actor.startsWith('book.paradise.')&&PARADISE_FOOTPRINTS.some(f=>f.worldId===a.worldId&&f.native.locations.includes(e.location));
            const molMove=p.inventory==='native'&&state.motherOfLearning&&actor!=='player'&&actor.startsWith('book.mol.')&&MOL_FOOTPRINTS.some(f=>f.worldId===a.worldId&&f.native.locations.includes(e.location));
            const structuredMove=p.inventory==='native'&&actor==='player'&&context.structuredNative?.bound===true&&context.structuredNative.worldId===a.worldId&&context.structuredNative.locationIds?.includes(e.location)&&context.structuredNative.bodyId===p.body?.id&&p.body?.ownerId==='player'&&p.body?.controllerId==='player'&&p.body?.mobile!==false&&p.life==='alive'&&context.nativeAlive===true;
            assert(p.inventory === "simulation" || sourceMove || molMove || structuredMove, "Native travel requires the exact source-world location adapter.");
            if(molMove)assert(context.molNative?.bound===true&&context.molNative.revision===state.motherOfLearning.nativeRevision&&p.body?.id===`native.person.${actor}.body`&&p.body.ownerId===actor&&p.body.controllerId===actor&&p.body.mobile!==false&&p.life==='alive','Cyoria movement requires its current actual native body and owners.');
            if(sourceMove)assert(context.paradiseNative?.bound===true&&context.paradiseNative.revision===state.bookWorldCampaign.nativeRevision&&p.body?.id===`native.person.${actor}.body`&&p.body.ownerId===actor&&p.body.controllerId===actor&&p.body.mobile!==false&&p.life==='alive','Source cast movement requires its current actual native body and owners.');
            assert(!state.pending.some(j => j.context.actorId === actor) && !s.jobs.some(j => j.actorId === actor), "Finish reserved work before relocating.");
            p.location = e.location;
            if(structuredMove){plan.nativeLocation=e.location;plan.nativePatch={...plan.nativePatch,'current location':e.location};}
        } else if(e.type === "situation") applySituationEffect(state,e,registry.simulation,cause);
        else if(e.type === "site") {
            const d = registry.simulation.sites.get(e.siteId); assert(d, "Unsupported site.");
            const site = s.sites[e.siteId] ||= {capacity:d.capacity,reservations:{}};
            assert(!site.owner || site.owner === actor, "This site belongs to another owner."); site.owner = actor; applyRealmSiteEffect(state,e.siteId);
        } else if(e.type === "pursuit") applyPursuitEffect(plan,e,context,registry,cause,(costs,ctx,c)=>applySimulationEffects(plan,costs,ctx,registry,c,{spending:true}));
        else if(e.type === "energy") applyEnergyEffect(state, actor, e, registry.simulation);
        else if(e.type === "observation") {
            const facts = state.worlds[a.worldId].facts;
            assert(Object.hasOwn(facts,e.key), "No supported observation is available.");
            a.facts[e.as] = facts[e.key]; a.facts[`${e.as}.observedAt`] = state.clock;
        } else if(e.type === "body") (p.body ||= {})[e.key] = e.value;
        else if(e.type === "vital") {
            // Previously noncombat simulation people acquire a depleted vital
            // ledger only through an actual supported-capacity procedure.
            if(p.inventory!=="native"&&!p.vitals&&e.minimumCapacity!==undefined)p.vitals={health:1,max_health:1,stamina:0,max_stamina:0};
            const vitals = p.inventory === "native" ? plan.vitals?.[actor] : p.vitals;
            assert(vitals && finite(vitals[e.key]) && finite(vitals[`max_${e.key}`]), "Vital effect needs an actual actor adapter.");
            if(e.minimumCapacity!==undefined){
                // A bodily capacity is supported by this real simulation person.
                // Raising it never fills current health/stamina or lowers a stronger body.
                assert(p.inventory!=="native", "Native capacity changes need their actual native stat adapter.");
                vitals[`max_${e.key}`]=Math.max(vitals[`max_${e.key}`],e.minimumCapacity);
            }
            const next = vitals[e.key] + e.amount;
            assert(finite(next) && (!spending || next >= 0), `Insufficient ${e.key}.`);
            vitals[e.key] = Math.min(vitals[`max_${e.key}`], Math.max(0, next));
            if(p.inventory === "native") {
                if(actor === "player") plan.native = {staminaToFull: vitals.max_stamina - vitals.stamina, hpToFull: vitals.max_health - vitals.health};
                else p.vitals = copy(vitals); // Persistent NPC body; native stats are its live projection.
            }
        } else if(e.type === "fact") {
            const d = e.scope === "actor" ? a : e.scope === "world" ? state.worlds[a.worldId] : state[e.scope]; d.facts[e.key] = e.value;
        } else if(e.type === "container") applyContainerEffect(plan,e,context,registry,{readInventory:inventory,writeInventory});
        else if(e.type === "world") {assert(state.worlds[e.worldId], "Unknown effect world."); if(!applyRealmWorldEffect(state,e))state.worlds[e.worldId].facts[e.key] = e.value;}
        else if(e.type === "resource") {
            const resources = e.native ? plan.external : a.resources;
            if(e.native) assert(actor === "player" && e.key === "money", "Unsupported native resource.");
            const next = (resources[e.key] || 0) + e.amount;
            assert(finite(next) && next >= 0, `Insufficient ${e.key}.`);
            if(e.capacity != null) assert(next <= e.capacity, `Capacity exceeded for ${e.key}.`);
            resources[e.key] = next;
        } else if(e.type === "item") {
            const amount = e.amount;
            const custodySafe=e.custodyUse!=null&&worldCompletionLensCustodyUseAllowed(state,e,context);
            if(e.custodyUse!=null)assert(custodySafe,"Use only the exact declared non-consuming lens reservation or restore.");
            if(amount < 0 && !e.breakCustody && !custodySafe) assert(!Object.values(s.custody).some(c => c.holder === actor && canonicalDurabilityKey(c.key) === canonicalDurabilityKey(e.key)), "Borrowed goods cannot be consumed without an explicit custody policy.");
            const next = stageAcquisition({owner: inventory(plan, actor)}, amount < 0
                ? {consumes: [{owner: "owner", key: e.key, count: -amount}]}
                : {grants: [{owner: "owner", key: e.key, count: amount}]}).owner;
            if(amount < 0) assert(!Object.values(s.equipment[actor] || {}).includes(e.key), "Unequip the item before consuming it.");
            writeInventory(plan, actor, next);
            if(amount > 0 && !e.reservationReturn) plan.acquisitions.push({owner: actor, key: e.key, count: amount});
        } else if(e.type === "transfer" || e.type === "custody") {
            assert(e.from !== e.to, "Transfer requires distinct owners.");
            assert(state.actors[e.from].worldId === state.actors[e.to].worldId, "Transfer participants are in different worlds.");
            assert(!Object.values(s.equipment[e.from] || {}).includes(e.key), "Unequip the item before transfer.");
            if(!e.returning && !e.breakCustody) assert(!Object.values(s.custody).some(c => c.holder === e.from && canonicalDurabilityKey(c.key) === canonicalDurabilityKey(e.key)), "Borrowed goods cannot be transferred to another claimant.");
            const owners = stageAcquisition({from: inventory(plan, e.from), to: inventory(plan, e.to)}, {transfers: [{from: "from", to: "to", key: e.key, count: e.count}]});
            writeInventory(plan, e.from, owners.from); writeInventory(plan, e.to, owners.to);
            if(!e.reservationReturn) plan.acquisitions.push({owner: e.to, key: e.key, count: e.count});
            if(e.type === "custody") {
                if(e.loanId==="lore.instrument.amber"&&e.returning)assert(worldCompletionLensCustodyReturnAllowed(state,e,context),"Return the actual free lens under its exact conserved loan cause.");
                assert(stableId(e.loanId), "Custody needs a loan ID.");
                const prior = s.custody[e.loanId];
                if(e.returning) {assert(prior && prior.owner === e.to && prior.holder === e.from && canonicalDurabilityKey(prior.key) === canonicalDurabilityKey(e.key) && prior.count === e.count, "Invalid loan return."); delete s.custody[e.loanId];}
                else {assert(!prior, "Loan already exists."); s.custody[e.loanId] = {owner: e.from, holder: e.to, key: e.key, count: e.count, at: state.clock, cause};}
            }
        } else if(e.type === "xp" || e.type === "reputation") applyGameplayEffect(plan.gameplay, e, actor);
        else if(e.type === "knowledge") {
            const known = s.knowledge[actor] ||= {}, previous = known[e.key];
            const ranks = ["seen", "interpreted", "understood"];
            if(!previous || ranks.indexOf(e.stage) >= ranks.indexOf(previous.stage)) known[e.key] = {stage: e.stage, value: e.value, at: state.clock, cause, ...(e.basis ? {basis:copy(e.basis)} : {})};
        } else if(e.type === "relationship") {
            person(state, e.target);
            const relations = s.relationships[actor] ||= {}, r = relations[e.target] ||= {axes: {}, memories: []};
            // A repeated delivery of a cause cannot farm favorability.
            const receipt = `${cause}:${actor}:${e.target}:${e.axis}`;
            if(!Object.hasOwn(s.causes, receipt)) {
                const next = (r.axes[e.axis] || 0) + e.amount; assert(finite(next), "Relationship overflow."); r.axes[e.axis] = next;
                if(e.amount) (plan.memoryEffects ||= []).push({holder:actor, subject:e.target, cause, axis:e.axis, amount:e.amount, text:e.text, clock:state.clock});
                r.memories.push({cause, at: state.clock, text: e.text || e.axis}); r.memories = r.memories.slice(-32); s.causes[receipt] = state.clock;
            }
        } else if(e.type === "claim") {
            const claim = s.claims[e.key];
            if(e.operation === "acquire") {assert(!claim, "This unique claim is already held or settled."); s.claims[e.key] = {owner: actor, status: "held", cause, at: state.clock};}
            else {assert(claim?.status === "held" && claim.owner === actor, "Actor does not hold this claim.");
                if(e.operation === "transfer") {person(state, e.target); claim.owner = e.target; claim.cause = cause;}
                else if(e.operation === "settle") {claim.status = "settled"; claim.cause = cause;}
                else {assert(e.renewable === true, "Permanent claims cannot be released for farming."); delete s.claims[e.key];}
            }
        } else if(e.type === "condition") {
            const definition = registry.simulation.conditions.get(e.id); assert(definition, "Unknown condition.");
            const conditions = s.conditions[actor] ||= {};
            if(e.operation === "remove") delete conditions[e.id];
            else {
                const old = conditions[e.id], intensity = e.intensity ?? 1;
                assert(finite(intensity) && intensity >= 0, "Invalid exposure intensity.");
                if(!definition.immunity || !meets(definition.immunity, simulationFacts(state,
                    {...context,actorId:actor,external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals,equipment:plan.equipment},registry))) {
                    conditions[e.id] = {intensity: definition.stacking === "sum" ? (old?.intensity || 0) + intensity : Math.max(old?.intensity || 0, intensity),
                        expiresAt: e.duration == null ? null : state.clock + e.duration, cause};
                    if(definition.interval) Object.assign(conditions[e.id], {interval: definition.interval, nextTick: state.clock + definition.interval, onTick: copy(definition.onTick || [])});
                }
            }
        } else if(e.type === "life") {
            assert(p.life !== "dead" || e.status === "dead" || e.resurrection === true, "Story death needs an explicit resurrection policy.");
            if(e.status === "dead") assert(e.lethal === true, "Lethal effects require explicit authored permission.");
            if(p.life !== "alive" && e.status === "alive") for(const c of Object.values(s.controllers)) if(c.actorId === actor) c.due = state.clock + c.interval;
            p.life = e.status; p.lifeCause = {cause, reason: e.reason, at: state.clock};
        } else if(e.type === "source" || e.type === "faculty") {
            const definition = registry.sources.get(e.sourceId); assert(definition, "Unknown capability source.");
            const faculties = s.faculties[actor] ||= {};
            if(e.operation === "grant") grantSource(state, actor, definition, {supplier: e.supplier, duration: e.duration, origin: e.origin || "unknown", receiptId: cause, awakened: e.awakened ?? false, active: e.active ?? false, shifts: e.shifts});
            else if(e.operation === "remove") removeSource(state, actor, e.sourceId, {supplier: e.supplier});
            else {
                const f = faculties[e.sourceId]; assert(f && a.sources[e.sourceId], "Faculty must be acquired first.");
                if(e.operation === "awaken") f.awakened = true;
                else if(e.operation === "activate") {assert(f.awakened && !f.suppressed, "Faculty is dormant or suppressed."); f.active = e.active ?? true;}
                else if(e.operation === "suppress") f.suppressed = e.suppressed ?? true;
                else {assert(finite(e.amount) && e.amount > 0, "Invalid source development."); f.development += e.amount;}
            }
        } else if(e.type === "construct") {applyConstructEffect(plan,e,actor,cause,registry,{readInventory:inventory,writeInventory});
        } else if(e.type === "power") {
            const definition = registry.simulation.powers.get(e.powerId); assert(definition, "Unknown executable power.");
            const powers = s.powers[actor] ||= {}, existing = powers[e.powerId];
            const fresh = () => ({revision: definition.revision, owned: false, mastery: 0, fragments: [], executions: 0, cause, lineage: copy(definition.constituents || [])});
            if(e.operation === "remove") {assert(existing?.owned, "Power is not owned."); existing.owned = false;}
            else if(e.operation === "copy" || e.operation === "transfer") {
                const donor = s.powers[e.target]?.[e.powerId]; assert(donor?.owned, "Donor does not own this power.");
                assert(!existing?.owned, "Power already owned.");
                powers[e.powerId] = {...fresh(), owned: true, mastery: e.copyMastery ? donor.mastery : 0, donor: e.target};
                if(e.operation === "transfer") donor.owned = false;
            } else {
                const entry = powers[e.powerId] ||= fresh();
                if(e.operation === "learn") {
                    assert(!entry.owned, "Power already owned.");
                    for(const c of definition.constituents || []) assert(powers[c]?.owned, "Missing combination constituent.");
                    entry.owned = true;
                    // A holder's own form (W15.S10): the chosen functions are frozen at acquisition and
                    // checked against the definition's slots and capacity. Without them the command's authored list stands.
                    if(e.functions) {
                        assert(definition.model === "design", "Only a designed power takes a chosen design.");
                        const used = e.functions.reduce((sum, f) => sum + (definition.functions?.[f]?.capacity ?? Infinity), 0);
                        assert(e.functions.every(f => definition.functions?.[f]) && used <= (definition.capacity ?? 1) && (definition.slots == null || e.functions.length <= definition.slots), "That design exceeds this source's functions, slots or capacity.");
                        entry.design = {functions: [...e.functions]};
                    }
                    if(definition.combination === "fusion") for(const c of definition.constituents) powers[c].owned = false;
                } else if(e.operation === "fragment") {assert(stableId(e.fragment), "Invalid fragment identity."); if(!entry.fragments.includes(e.fragment)) entry.fragments.push(e.fragment);}
                else {assert(entry.owned && finite(e.amount) && e.amount > 0, "Invalid mastery gain."); entry.mastery += e.amount;}
            }
        } else if(e.type === "progress") {
            const tracks = s.progression[actor] ||= {}, t = tracks[e.track] ||= {values: {}, branches: {}, receipts: {}};
            const next = (t.values[e.field] || 0) + e.amount; assert(finite(next) && next >= 0, "Invalid progress settlement."); t.values[e.field] = next;
        } else if(e.type === "title") {
            const titles = s.titles[actor] ||= {};
            if(e.operation === "remove") delete titles[e.id]; else {assert(!titles[e.id], "Title already granted."); titles[e.id] = {issuer: e.issuer || actor, worldId: a.worldId, cause, at: state.clock};}
        } else if(e.type === "equipment") {
            const slots = p.inventory === "native" ? plan.equipment?.[actor] : s.equipment[actor] ||= {};
            assert(slots, "Equipment needs an actual owner binding.");
            if(p.inventory === "native") {
                const old = slots[e.slot]; if(old === e.key) continue;
                const next = stageAcquisition({owner: inventory(plan,actor)}, {consumes: e.key ? [{owner:"owner",key:e.key,count:1}] : [], grants: old ? [{owner:"owner",key:old,count:1}] : []}).owner;
                writeInventory(plan,actor,next);
                if(e.key == null) delete slots[e.slot]; else slots[e.slot] = e.key;
                syncEquipSources(state, actor, registry, old, e.key ?? null, cause);
                continue;
            }
            const previousKey = slots[e.slot] ?? null;
            if(e.key == null) delete slots[e.slot];
            else {assert(inventory(plan, actor)[e.key] > 0, "Actor does not own this equipment."); assert(!Object.values(slots).includes(e.key) || slots[e.slot] === e.key, "Item is already equipped."); slots[e.slot] = e.key;}
            syncEquipSources(state, actor, registry, previousKey, e.key ?? null, cause);
        } else if(e.type === "unlock") {
            assert(actor === "player", "Native content unlocks belong to the hero."); plan.unlocks.push(e);
        } else if(e.type === "event") {
            assert(registry.simulation.events.has(e.eventId), "Unknown caused event.");
            const id = `event:${cause}:${e.eventId}:${actor}`;
            s.checks[id] ||= {definitionId:e.eventId, actorId:actor, targetId:e.target || null, due: state.clock + Math.max(1, e.delay || 1), interval: registry.simulation.events.get(e.eventId).interval, rng: deriveSimulationSeed(s.seed,id), count: 0, cause};
        } else if(e.type === "party") {
            person(state, e.target);
            if(e.operation === "join") {assert(state.actors[e.target].worldId === a.worldId && s.people[e.target].life === "alive", "Companion cannot join here."); if(!s.party.includes(e.target)) s.party.push(e.target);}
            else s.party = s.party.filter(id => id !== e.target);
        }
        if(spending) assert(["resource", "vital", "item", "transfer", "custody", "energy"].includes(e.type), "Unsupported reservation cost.");
        recordSteamDFStockMutation(state,steamDFBefore,cause);
    }
}

export function refundCosts(costs, reservationReturn = false) {
    return costs.map(e => e.type === "energy" ? {...e,operation:"refund"} : ["resource", "vital", "item"].includes(e.type) ? {...e, amount: -e.amount, ...(reservationReturn && e.type === "item" ? {reservationReturn:true} : {})}
        : e.type === "transfer" ? {...e, from: e.to, to: e.from, ...(reservationReturn ? {reservationReturn:true} : {})} : {...e, from: e.to, to: e.from, returning: true});
}

export function advanceNativeContainerClocks(plan,registry,contexts) {return advanceContainerClocks(plan,registry,contexts,{readInventory:inventory,writeInventory});}
