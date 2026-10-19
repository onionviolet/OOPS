import {all, deepFreeze as freeze, eq} from './basics.js';
import {createWorldInstance, createWorldBindings, validateWorldEndpoint} from "./world_instances.js";

// Original exploration content. Importing this file grants no stock, source,
// residence or passage. The master must bind/register it explicitly.
const itemKey = id => JSON.stringify({id});
const item = (id, amount, actor) => ({type: "item", key: itemKey(id), amount, ...(actor ? {actor} : {})});
const vital = (amount, actor) => ({type: "vital", key: "stamina", amount, ...(actor ? {actor} : {})});
const transfer = (id, from, to) => ({type: "transfer", key: itemKey(id), from, to, count: 1});
const id = value => typeof value === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !["constructor", "prototype", "__proto__"].includes(value);
function optionsShape(options, fields) {
    if (!options || typeof options !== "object" || Array.isArray(options) ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(options)) ||
        Object.getOwnPropertySymbols(options).length || Object.getOwnPropertyNames(options).length !== Object.keys(options).length ||
        Object.entries(Object.getOwnPropertyDescriptors(options)).some(([key, descriptor]) => !fields.includes(key) ||
            !Object.hasOwn(descriptor, "value"))) throw new Error("Invalid Glasshouse options.");
    for (const key of fields.filter(key => key.endsWith("Id"))) if (Object.hasOwn(options, key) &&
        !(key === "parentInstanceId" && options[key] === null) && !id(options[key]))
        throw new Error(`Invalid Glasshouse ${key}.`);
}

export const FOLDED_GLASSHOUSE_IDS = freeze({
    worldId: "pocket.folded_glasshouse", definitionId: "pocket.folded_glasshouse",
    instanceId: "glasshouse.main", regionId: "glasshouse.room", layerId: "material",
    connectionId: "exchange.glasshouse.door", caretakerId: "glasshouse.main.caretaker"
});

export const FOLDED_GLASSHOUSE_DEFINITION = freeze({
    id: FOLDED_GLASSHOUSE_IDS.definitionId, worldId: FOLDED_GLASSHOUSE_IDS.worldId, revision: 1,
    label: "Folded Glasshouse", unidentifiedLabel: "An enclosed glass workshop",
    regions: [{id: FOLDED_GLASSHOUSE_IDS.regionId, layerIds: [FOLDED_GLASSHOUSE_IDS.layerId]}],
    sites: [
        {id: "glasshouse.frame", label: "Loose entrance frame", regionId: "glasshouse.room", layerId: "material", initialOpen: false},
        {id: "glasshouse.refuge", label: "Dry sitting corner", regionId: "glasshouse.room", layerId: "material", initialOpen: false},
        {id: "glasshouse.bench", label: "Folding workbench", regionId: "glasshouse.room", layerId: "material", initialOpen: false}
    ],
    initialFacts: {"repair.status": "unasked", "repair.route": "none", "research.complete": false,
        "bench.open": false, "caretaker.met": false, "caretaker.reportHeard": false},
    uniqueClaimIds: ["glasshouse.template_export"]
});

// This is for an explicit first creation, never a load/reentry initializer.
// Caretaker references attach only after the actual simulation actor exists.
export function createFoldedGlasshouseSeed(options) {
    optionsShape(options, ["instanceId", "continuityId", "eraId", "playedAt", "parentInstanceId"]);
    return createWorldInstance(FOLDED_GLASSHOUSE_DEFINITION, {
        id: options.instanceId ?? FOLDED_GLASSHOUSE_IDS.instanceId,
        continuityId: options.continuityId, eraId: options.eraId, playedAt: options.playedAt,
        parentInstanceId: options.parentInstanceId ?? null, actorIds: []
    });
}

// Every history receives its own author IDs. Current registry world effects
// still need the master's instance-fact adapter; no duplicate owner is installed.
export function createFoldedGlasshouseContent(options = {}) {
    optionsShape(options, ["instanceId", "caretakerId", "continuityId", "eraId", "connectionId", "fromEndpoint"]);
    const instanceId = options.instanceId ?? FOLDED_GLASSHOUSE_IDS.instanceId;
    const caretakerId = options.caretakerId ?? `${instanceId}.caretaker`;
    const worldId = FOLDED_GLASSHOUSE_IDS.worldId;
    const endpoint = {worldId, instanceId, regionId: FOLDED_GLASSHOUSE_IDS.regionId, layerId: FOLDED_GLASSHOUSE_IDS.layerId};
    const from = options.fromEndpoint ?? {worldId: "base.frontier", instanceId: "frontier.main",
        regionId: "frontier.village", layerId: "material"};
    validateWorldEndpoint(endpoint); validateWorldEndpoint(from);
    if (!id(caretakerId))
        throw new Error("Bind a stable Glasshouse caretaker ID.");
    const prefix = `${instanceId}.glasshouse`, situationId = `${prefix}.repair`;
    const bindingManifest = createWorldBindings(FOLDED_GLASSHOUSE_DEFINITION,
        {instanceId, worldFactPrefix: prefix});
    const commandId = name => `${prefix}.${name}`, localKey = key => `${prefix}.${key}`;
    const wf = (key, value) => ({type: "world", worldId, key: localKey(key), value});
    const worldFact = (key, value = true, reason) => eq(`world.${localKey(key)}`, value, reason);
    const phase = value => eq(`situation.${situationId}.phase`, value);
    const phases = (...values) => ({any: values.map(phase)});
    const shift = (fromPhase, toPhase) => ({type: "situation", situationId, operation: "advance",
        expected: [fromPhase], phase: toPhase, text: `Glasshouse repair: ${fromPhase} → ${toPhase}.`});
    const knowledge = (key, value, kind = "observation", actor = "player") => ({type: "knowledge", actor,
        key: localKey(key), stage: kind === "instruction" ? "understood" : "seen", value,
        basis: {kind, attributedTo: caretakerId, situationId}});
    const siteId = id => `${prefix}.${id}`;
    const siteOpen = id => ({type: "site", siteId: siteId(id), operation: "open"});
    // Missing native adapter, deliberately explicit. A truthy story label cannot
    // satisfy actual traveler position; this fact must be projected from visits.
    const present = eq("worldVisit.instanceId", instanceId, "Enter this actual Glasshouse instance first.");
    const hands = all(eq("glasshouse.handsUsable", true, "Your actual hands cannot do this work now."),
        {fact: "vital.health", op: "gte", value: 2}, {fact: "strength", op: "gte", value: 6});
    const willing = eq(`person.${caretakerId}.willing`, true, "The caretaker is not offering help now.");
    const work = {duration: 4, cancellation: "refund", siteId: siteId("frame"),
        participants: ["$target"], visibleWhen: all(present, phase("offered")),
        requires: all(present, phase("offered"), willing, hands)};
    const command = definition => ({revision: 1, worldId, actorId: "player", targetId: caretakerId,
        location: "Folded Glasshouse", coLocated: true, group: "glasshouse", costs: [], effects: [],
        ...definition});
    const npc = definition => command({actorId: caretakerId, targetId: caretakerId, coLocated: false,
        location: undefined, group: undefined, audience: ["$actor"], ...definition});
    const repaired = route => [wf("repair.status", "repaired"), wf("repair.route", route), wf("bench.open", true),
        siteOpen("bench"), shift("offered", "repaired"), knowledge("repair", route === "ordinary"
            ? "Your supplied brace and kit fixed the frame. The ordinary method spent more fittings and no drive."
            : "Your learned Step held the real frame while its brace set. Three drive units and strain were paid; no method was acquired here.")];

    const definitions = {
        people: [{id: caretakerId, revision: 1, label: "Joss, Glasshouse caretaker", worldId,
            location: "Folded Glasshouse", inventory: "simulation", provision: false,
            resources: {coins: 6}, body: {hands: 2}, vitals: {health: 20, max_health: 20, stamina: 10, max_stamina: 10}}],
        sites: ["frame", "refuge", "bench"].map(id => ({id: siteId(id), revision: 1,
            label: id === "frame" ? "Entrance-frame repair" : id === "refuge" ? "Dry sitting corner" : "Folding workbench", capacity: 1})),
        situations: [{id: situationId, revision: 1, label: "A frame worth keeping",
            context: {worldId, instanceId, continuityId: options.continuityId ?? "frontier.glasshouse.branch",
                eraId: options.eraId ?? "frontier.present", regionId: endpoint.regionId},
            privateTruth: {damageCause: "ordinary_settling", caretakerAim: "keep_a_useful_shared_workshop"},
            participants: ["player", caretakerId], initialPhase: "offered", responseWindow: 8,
            phases: ["offered", "repaired", "declined", "caretaker_repaired", "report_heard"]}],
        commands: [
            {id: commandId("lead"), revision: 1, label: "Ask Iona about the folded workshop frame", worldId: "base.frontier",
                actorId: "player", targetId: "exchangeClerk", location: "Village", coLocated: true, group: "exchange", once: true,
                requires: all(eq("knowledge.exchange.pattern.seen"), eq("exchange.clerkWilling")), costs: [],
                effects: [{type: "knowledge", actor: "player", key: localKey("lead"), stage: "seen",
                    value: "Iona knows a folded-glass doorway used by a caretaker and visiting artisans. A lead is not permission or passage.",
                    basis: {kind: "instruction", attributedTo: "exchangeClerk", situationId: "exchange.parcel"}}]},
            command({id: commandId("meet"), label: "Meet the caretaker · no repair promise", once: true,
                targetId: undefined, coLocated: false, visibleWhen: all(present, worldFact("caretaker.met", false)),
                requires: all(present, worldFact("caretaker.met", false)), effects: [
                    {type: "spawn", personId: caretakerId, definitionId: caretakerId},
                    {type: "fact", scope: "actor", actor: caretakerId, key: "glasshouse.willing", value: true},
                    {type: "situation", situationId, operation: "begin"},
                    item("Rough wood log", 6, caretakerId), item("Prepared survey kit", 3, caretakerId),
                    item("Sealing template", 1, caretakerId), wf("caretaker.met", true), wf("repair.status", "offered"),
                    siteOpen("frame"), siteOpen("refuge"),
                    knowledge("meeting", "Joss has six logs, three kits and one template. The dry corner is usable; the loose frame keeps the bench shut. You can help, decline or leave. Joss waits eight played minutes before using personal supplies.")]}),
            command({...work, id: commandId("repair_ordinary"), label: "Fit an ordinary frame brace · 2 logs + kit + 2 stamina · 4 min",
                costs: [item("Rough wood log", -2), item("Prepared survey kit", -1), vital(-2)], effects: repaired("ordinary")}),
            command({...work, id: commandId("repair_step"), label: "Brace with Load-bearing Step · log + 3 drive + 1 stamina · 2 min",
                duration: 2, cancellation: "forfeit", powerId: "field.load_step", output: 3,
                requires: all(work.requires, eq("actor.field.member", true), eq("power.field.load_step.owned", true),
                    {fact: "power.field.load_step.mastery", op: "gte", value: 2}),
                costs: [item("Rough wood log", -1), vital(-1),
                    {type: "energy", energyId: "field.drive", operation: "use", output: 3, control: 1}], effects: repaired("step")}),
            command({id: commandId("decline"), label: "Leave the repair to Joss · no debt", visibleWhen: all(present, phase("offered")),
                requires: all(present, phase("offered")), effects: [wf("repair.status", "declined"), shift("offered", "declined"),
                    knowledge("declined", "You declined the repair. Joss owns the remaining supplies and may spend them; no repair debt was accepted.")]}),
            npc({id: commandId("caretaker_repair"), label: "Joss funds a slower frame repair", duration: 5,
                cancellation: "refund", siteId: siteId("frame"),
                requires: all(willing, {any: [phase("declined"), all(phase("offered"),
                    eq(`situation.${situationId}.responseOpen`, false))]}, {fact: "body.hands", op: "gte", value: 2}),
                costs: [item("Rough wood log", -2), item("Prepared survey kit", -1), vital(-2),
                    {type: "resource", key: "coins", amount: -1}],
                effects: [wf("repair.status", "repaired"), wf("repair.route", "caretaker"), wf("bench.open", true), siteOpen("bench"),
                    {type: "situation", situationId, operation: "advance", expected: ["offered", "declined"], phase: "caretaker_repaired",
                        text: "Joss completed a repair from personal supplies."},
                    knowledge("own_repair", "I used two of my logs, a kit, two stamina and one coin to fix the frame.", "observation", caretakerId)]}),
            command({id: commandId("hear_repair"), label: "Ask how Joss fixed the frame", visibleWhen: all(present, phase("caretaker_repaired")),
                requires: all(present, phase("caretaker_repaired")), effects: [wf("caretaker.reportHeard", true),
                    shift("caretaker_repaired", "report_heard"), knowledge("repair", "Joss reports using personal stock and a coin. You did not supply the repair; the opened bench still offers paid study and work.")]}),
            command({id: commandId("study"), label: "Test dry packing with Joss · kit + 1 stamina each · 3 min", once: true,
                duration: 3, cancellation: "refund", siteId: siteId("bench"), participants: ["$target"],
                visibleWhen: all(present, phases("repaired", "report_heard"), worldFact("bench.open")),
                requires: all(present, phases("repaired", "report_heard"), willing, worldFact("bench.open"), hands),
                costs: [item("Prepared survey kit", -1), vital(-1), vital(-1, "$target")],
                effects: [wf("research.complete", true),
                    knowledge("packing", "Joss demonstrated a counted dry-packing pattern. Two logs and an owned reusable sealing template make two ordinary survey kits; the pattern is instruction, not a new power.", "instruction"),
                    knowledge("study", "We tested a kit and compared its seals together. The visitor paid materials and we each spent stamina.", "observation", caretakerId)]}),
            command({id: commandId("export_template"), label: "Receive Joss’s one template · unique gift", once: true,
                participants: ["$target"], claim: localKey("template_export"), visibleWhen: all(present, worldFact("research.complete")),
                requires: all(present, willing, worldFact("research.complete")), effects: [
                    transfer("Sealing template", caretakerId, "player"),
                    knowledge("export", "Joss transferred the one actual template. It is yours; reopening the door grants no second copy. Joss no longer holds that tool."),
                    knowledge("gift", "I gave the visitor my one template after our packing trial.", "observation", caretakerId)]}),
            command({id: commandId("pack_kits"), label: "Pack two dry survey kits · 2 logs + 2 stamina · 3 min", duration: 3,
                cancellation: "refund", targetId: undefined, coLocated: false, siteId: siteId("bench"),
                visibleWhen: all(present, worldFact("bench.open"), eq(`knowledge.${localKey("packing")}.seen`)),
                requires: all(present, worldFact("bench.open"), hands,
                    eq(`knowledge.${localKey("packing")}.basis`, "instruction"),
                    eq("glasshouse.templateAvailable", true, "Carry a real owned, unencumbered template.")),
                costs: [item("Rough wood log", -2), vital(-2)], effects: [item("Prepared survey kit", 2)]}),
            command({id: commandId("rest"), label: "Rest in the dry corner · 4 min · recover 2 stamina", duration: 4,
                cancellation: "forfeit", targetId: undefined, coLocated: false, siteId: siteId("refuge"),
                visibleWhen: present, requires: present, effects: [vital(2)]}),
            ...[["shut_bench", true, false], ["reopen_bench", false, true]].map(([name, before, after]) => command({
                id: commandId(name), label: after ? "Uncover the repaired bench" : "Cover the bench against dust",
                visibleWhen: all(present, worldFact("repair.status", "repaired"), worldFact("bench.open", before)),
                participants: ["$target"],
                requires: all(present, willing, worldFact("repair.status", "repaired"), worldFact("bench.open", before),
                    eq("glasshouse.benchIdle", true, "Finish or cancel the reserved bench work first.")),
                effects: [wf("bench.open", after), knowledge("bench", after
                    ? "The same bench is open again. Prior repairs, stock, study and the template gift remain."
                    : "The bench is covered. This does not destroy the interior or close its passage.")]})),
            command({id: commandId("return_greeting"), label: "Ask Joss about your earlier visit", visibleWhen: all(present,
                eq("worldVisit.returning", true)), requires: all(present, eq("worldVisit.returning", true), worldFact("caretaker.met")),
                effects: [knowledge("return", "Joss welcomes you back to the same room. Its repairs and supplies remain as you left them.")]})
        ],
        controllers: [{id: commandId("caretaker_plan"), revision: 1, label: "Joss’s finite repair plan",
            actorId: caretakerId, interval: 1, actions: [{commandId: commandId("caretaker_repair"), priority: 1,
                when: phases("offered", "declined")}]}]
    };
    // Optional fields are removed rather than serialized as undefined.
    for (const entry of definitions.commands) for (const key of Object.keys(entry))
        if (entry[key] === undefined) delete entry[key];

    return {
        provenance: {kind: "O", revision: 1, source: "Original Folded Glasshouse exploration seed", numbersAccepted: false},
        definition: FOLDED_GLASSHOUSE_DEFINITION, endpoint, caretakerId, situationId, simulation: definitions, bindingManifest,
        connectionProposal: {id: options.connectionId ?? (instanceId === FOLDED_GLASSHOUSE_IDS.instanceId
            ? FOLDED_GLASSHOUSE_IDS.connectionId : `${instanceId}.door`), from: {...from}, to: endpoint,
            kind: "passage", open: false, revision: 1, expiresAt: null,
            requirements: eq(`knowledge.${localKey("lead")}.seen`),
            cargoPolicy: {mode: "owner_references", retainActualBody: true, retainOwnedSources: true, loansRequirePermission: true,
                prototypeScope: "player_owned_unencumbered", loanSupport: "unimplemented_requires_live_custody_permission_binding"},
            observationPolicy: {mode: "doorway_view", grantsIdentity: false, grantsContact: false}},
        lifecycle: {absence: "freeze", closeRoute: "retain_interior_and_actual_occupants", reopenRoute: "same_endpoint_and_history",
            departure: "settle_or_cancel_reserved_local_work_before_exit_until_job_clock_binding_exists",
            failedAnchor: "unsupported_requires_authored_escape_or_repair", terminalLifePolicy: "unselected"},
        bindings: {
            worldFactPrefix: bindingManifest.worldFactPrefix,
            factKeys: bindingManifest.factKeys,
            sites: bindingManifest.sites,
            uniqueClaims: bindingManifest.uniqueClaims,
            requiredFacts: ["worldVisit.instanceId", "worldVisit.returning", "glasshouse.handsUsable",
                "glasshouse.templateAvailable", "glasshouse.benchIdle", `person.${caretakerId}.willing`],
            actorReferences: ["player", caretakerId, "exchangeClerk"],
            existingItemKeys: ["Rough wood log", "Prepared survey kit", "Sealing template"].map(itemKey),
            existingPowerIds: ["field.load_step"], existingEnergyIds: ["field.drive"],
            afterMeetAttachActorIds: [caretakerId],
            factOwnership: "Select a single durable instance-fact owner; map world effects instead of saving duplicate mirrors.",
            claimOwnership: "Bind each declared unique claim to one durable owner. The Glasshouse host uses its instance ledger and removes the translated simulation command claim; never create a second payout ledger."
        },
        growth: {near: "A dry corner and repaired bench support finite work and return visits.",
            middle: "Fund a calibrated lens shelf and real instrument trials; add components only with actual item bindings.",
            later: "Negotiate shared refuge access or a private research room with Joss and future actual tenants.",
            exportedUse: "The owned template and learned packing pattern can support paid kit work back in Frontier after native recipe binding."},
        integrationStatus: "detached_implemented_unverified"
    };
}
