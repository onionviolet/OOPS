// Original, detached scene/content entries. Importing creates no actor, stock,
// registry, DOM, timer or save. The engine master binds and commits every action.
import {createRealmConnection, realmConnectionBinding} from "./realm_connections.js";
import {validateRealmBoundaryRule, validateRealmEndpoint} from "./realm_boundary_rules.js";
const copy = value => JSON.parse(JSON.stringify(value));
const freeze = value => {
    if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
};
const stable = value => typeof value === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !["__proto__", "constructor", "prototype"].includes(value);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const eq = (fact, value = true, reason) => ({fact, op: "eq", value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const itemKey = id => JSON.stringify({id});
const item = (id, amount, actor) => ({type: "item", key: itemKey(id), amount, ...(actor ? {actor} : {})});
const stamina = (amount, actor) => ({type: "vital", key: "stamina", amount, ...(actor ? {actor} : {})});

export const POCKET_SCENE_REVISION = 1;
export const POCKET_SCENE_DEFAULT_BINDINGS = freeze({worldId: "pocket.folded_glasshouse",
    instanceId: "glasshouse.main", regionId: "glasshouse.room", layerId: "material",
    caretakerId: "glasshouse.main.caretaker", connectionId: "exchange.glasshouse.door",
    observationConnectionId: "exchange.glasshouse.view"});
export const POCKET_SCENE_OBSERVER_ENDPOINT = freeze({worldId: "base.frontier", instanceId: "frontier.main",
    regionId: "frontier.village", layerId: "material"});

// Mirrors the inspected World seed IDs without importing a moving sibling.
// Overrides must match that seed's actual actor/instance, not create counterparts.
export function createPocketRealmScenes(options = {}) {
    const endpoint = Object.fromEntries(["worldId", "instanceId", "regionId", "layerId"]
        .map(key => [key, options[key] ?? POCKET_SCENE_DEFAULT_BINDINGS[key]]));
    Object.values(endpoint).forEach(id => assert(stable(id), "Scenes need stable actual endpoint IDs."));
    const caretakerId = options.caretakerId ?? `${endpoint.instanceId}.caretaker`;
    const connectionId = options.connectionId ?? POCKET_SCENE_DEFAULT_BINDINGS.connectionId;
    const observerEndpoint = copy(options.observerEndpoint ?? POCKET_SCENE_OBSERVER_ENDPOINT);
    const observerLocation = options.observerLocation ?? "Village";
    const observationConnectionId = options.observationConnectionId ?? POCKET_SCENE_DEFAULT_BINDINGS.observationConnectionId;
    validateRealmEndpoint(observerEndpoint);
    assert(stable(observationConnectionId), "Bind the actual observation edge ID.");
    assert(typeof observerLocation === "string" && observerLocation.length > 0, "Bind the actual observer location.");
    assert(stable(caretakerId) && stable(connectionId), "Bind actual caretaker and route IDs.");
    const base = `${endpoint.instanceId}.glasshouse`, prefix = `${base}.scenes`;
    const situationId = `${base}.repair`, id = name => `${prefix}.${name}`;
    const baseId = name => `${base}.${name}`;
    const local = (key, value) => ({type: "world", worldId: endpoint.worldId, key: id(key), value});
    const localFact = (key, value = true) => eq(`world.${id(key)}`, value);
    const instance = eq("worldVisit.instanceId", endpoint.instanceId, "Enter this actual Glasshouse instance.");
    const willing = eq(`person.${caretakerId}.willing`, true, "Joss is not offering this work now.");
    const bench = eq(`world.${base}.bench.open`, true, "The repaired bench must be uncovered.");
    const hands = all(eq("glasshouse.handsUsable", true, "This work needs supported hands."),
        {fact: "vital.health", op: "gte", value: 2}, {fact: "strength", op: "gte", value: 6});
    const known = key => eq(`knowledge.${id(key)}.seen`);
    const know = (key, text, actor = "player", kind = "observation", attributedTo = caretakerId) =>
        ({type: "knowledge", actor, key: id(key), stage: kind === "instruction" ? "understood" : "seen",
            value: text, basis: {kind, attributedTo, situationId}});
    const memory = (text, amount = 1) => ({type: "relationship", actor: caretakerId,
        target: "player", axis: "familiarity", amount, text});
    const common = {revision: POCKET_SCENE_REVISION, worldId: endpoint.worldId, actorId: "player",
        targetId: caretakerId, location: "Folded Glasshouse", coLocated: true, group: "glasshouse"};
    const command = entry => ({...common, costs: [], effects: [], visibleWhen: instance,
        requires: all(instance, willing), ...entry});
    const work = entry => command({duration: 3, cancellation: "refund", siteId: `${base}.bench`,
        participants: ["$target"], visibleWhen: all(instance, bench), requires: all(instance, willing, bench, hands), ...entry});
    const npc = entry => ({...common, actorId: caretakerId, targetId: undefined, location: undefined,
        coLocated: false, group: undefined, audience: [caretakerId], costs: [], effects: [],
        requires: eq("glasshouse.instanceClockActive", true), ...entry});
    const listenerSourceId = id("frame_listener");
    const listenerAcquisition = [{type: "body", actor: caretakerId, key: "frameSense", value: true},
        {type: "source", actor: caretakerId, sourceId: listenerSourceId, operation: "grant", origin: "trained", awakened: true, active: true}];
    const contact = all(known("notice"), eq("glasshouse.scene.recipientWilling", true),
        eq("glasshouse.scene.noticeReceivedThisSampling", true), eq("glasshouse.scene.returnPathAvailable", true,
        "A current supported return channel is required; remembered speech is not contact."));

    const commands = [
        command({id: id("welcome"), once: true, label: "Ask Joss what staying here involves",
            requires: all(instance, eq(`knowledge.${base}.meeting.seen`)), effects: [
                know("welcome", "Joss offers the dry corner and paid bench work after the frame is repaired. Asking accepts no tenancy, repair or debt. A funded job uses a real bench slot; you may leave between commitments."),
                know("saying", "Joss said: 'A chair is somewhere to sit. A commission is something you agreed to do.'", "player", "recollection")]}),
        work({id: id("paid_work"), label: "Make Joss a kit · log + 1 stamina · 4 min · wages 2 coins",
            duration: 4, requires: all(instance, willing, bench, hands,
                eq("glasshouse.scene.caretakerTemplateAvailable", true, "Joss must supply the actual working template for supervised production.")),
            costs: [item("Rough wood log", -1), stamina(-1),
                {type: "resource", actor: caretakerId, key: "coins", amount: -2}],
            effects: [item("Prepared survey kit", 1, caretakerId),
                {type: "resource", native: true, key: "money", amount: 2},
                know("work", "You made one real kit for Joss and received two coins from the agreed reserved wages. Joss holds the kit; the wages are payment for this job."),
                know("work", "The visitor supplied wood and labor for my kit. I paid the agreed two coins.", caretakerId),
                memory("Paid for an actual kit-making shift; the worker kept the terms.")]}),
        work({id: id("damp_trial"), once: true, label: "Test a damp blank · blank + 1 stamina · 2 min · expected failure",
            duration: 2, cancellation: "forfeit", costs: [item("Wet seal blank", -1), stamina(-1)],
            effects: [know("failed_trial", "The damp blank warped in the clamp. The declared trial consumed it and one stamina; no sound fitting was produced. Force was not the missing preparation. An earlier validated fitting remains valid."),
                know("failed_trial", "I watched the visitor's damp sample warp. The paid result does not establish every possible material failure.", caretakerId)]}),
        work({id: id("sound_trial"), once: true, label: "Fit a sound calibration seal · blank + 1 stamina · 3 min",
            requires: all(instance, willing, bench, hands, eq(`knowledge.${base}.packing.basis`, "instruction"),
                eq("glasshouse.templateAvailable", true, "Use your actual unencumbered template.")),
            costs: [item("Sound seal blank", -1), stamina(-1)], effects: [item("Fitted parcel seal", 1),
                local("preparation", "validated"),
                know("sound_trial", "A sound blank and the taught pattern produced one fitted seal. The paid craft result uses the actual tool; recalling the instruction alone cannot supply it."),
                know("sound_trial", "I witnessed the visitor fit a sound specimen with the taught pattern.", caretakerId)]}),
        work({id: id("cooperative_trial"), once: true, label: "Ask for a joint packing trial · kit each + 1 stamina each · 3 min",
            requires: all(instance, willing, bench, hands, known("work"),
                eq(`glasshouse.scene.${caretakerId}.workRemembered`, true,
                    "Joss must actually remember and agree to the shared work; your own recollection is insufficient.")),
            costs: [item("Prepared survey kit", -1), item("Prepared survey kit", -1, caretakerId),
                stamina(-1), stamina(-1, caretakerId)], effects: [local("preparation", "validated"),
                know("joint_trial", "You and Joss each supplied a real kit and stamina for a controlled packing comparison. It validates this preparation, not a source or universal permission."),
                know("joint_trial", "I agreed to use my own kit and stamina after our actual paid work.", caretakerId),
                memory("Agreed to and funded one joint comparison after a remembered shift.")]}),
        work({id: id("shelf"), once: true, label: "Build a calibration shelf · fitted seal + 2 logs + 2 coins · 5 min",
            duration: 5, requires: all(instance, willing, bench, hands, localFact("preparation", "validated")),
            costs: [item("Fitted parcel seal", -1), item("Rough wood log", -2),
                {type: "resource", native: true, key: "money", amount: -2}], effects: [local("shelfBuilt", true),
                know("shelf", "The funded shelf holds ordinary calibration stock. It is useful research furniture, not a lens, a detector or a passage. Later instruments need their actual components and support."),
                know("shelf", "The visitor funded a fitted shelf. I can choose to use my own stock for a later bench trial.", caretakerId)]}),
        npc({id: id("private_research"), once: true, label: "Joss tests a private packing hypothesis",
            duration: 4, cancellation: "forfeit", siteId: `${base}.bench`,
            requires: all(eq("glasshouse.instanceClockActive", true), bench,
                eq("actor.glasshouse.willing", true), {fact: "body.hands", op: "gte", value: 2}),
            costs: [item("Prepared survey kit", -1), stamina(-1), {type: "resource", key: "coins", amount: -1}],
            effects: [know("private_research", "My paid kit test held a fold under load. I have a result I may choose to report; the visitor has not heard it.", caretakerId)]}),
        npc({id: id("offer_research"), once: true, label: "Joss offers to discuss a bench result",
            targetId: "player", coLocated: true, location: "Folded Glasshouse", audience: [caretakerId, "player"],
            requires: all(eq("glasshouse.instanceClockActive", true), known("private_research"),
                eq("actor.glasshouse.willing", true)), effects: [
                know("research_offer", "Joss says he has a bench result he is willing to discuss. You have heard the offer, not the result of his private trial."),
                know("research_offer", "I offered to discuss my completed bench trial with the visitor here.", caretakerId)]}),
        command({id: id("hear_research"), once: true, label: "Ask what bench work Joss wants to share",
            visibleWhen: all(instance, known("welcome")),
            requires: all(instance, willing, eq("glasshouse.scene.researchReportOffered", true,
                "Joss has not offered a result to share yet.")), effects: [
                know("research_report", "Joss reports a separately funded kit trial. This is a report from its operator, not your witnessed experiment or a gift of the remaining stock.")]}),
        command({id: id("supply_listener"), label: "Give Joss one spare kit · his stock may fund research or frame work",
            participants: ["$target"], visibleWhen: all(instance, known("welcome")),
            requires: all(instance, willing, eq("glasshouse.scene.listenerSetupSupported", true)), effects: [
                {type: "transfer", key: itemKey("Prepared survey kit"), from: "player", to: caretakerId, count: 1},
                know("listener_supply", "You gave Joss one actual spare kit as his own stock. He may use it for research or frame preparation. Every further gift supplies another real kit; no faculty, wage or future debt was exchanged."),
                know("listener_supply", "The visitor gave me one real spare kit as my own stock, available for research or frame preparation.", caretakerId)]}),
        npc({id: id("listener_setup"), once: true, label: "Joss prepares the paired frame · his kit + 1 stamina · 4 min",
            targetId: "player", coLocated: true, location: "Folded Glasshouse", audience: [caretakerId, "player"],
            duration: 4, cancellation: "refund", siteId: `${base}.bench`, participants: ["$target"],
            requires: all(eq("glasshouse.instanceClockActive", true), bench, eq("actor.glasshouse.willing", true),
                eq("glasshouse.scene.listenerSetupSupported", true), {fact: "body.hands", op: "gte", value: 2},
                {fact: "vital.health", op: "gte", value: 2}),
            costs: [item("Prepared survey kit", -1), stamina(-1)], effects: [...copy(listenerAcquisition),
                know("listener_setup", "Joss aligned the paired frame with his own kit and effort. The opaque outer screen permits a frame view without a reverse picture. A returned notice still needs his actual support and consent; you received no faculty."),
                know("listener_setup", "I prepared this frame from my own supplies and agreed to use my trained listener for one demonstration.", caretakerId)]}),
        npc({id: id("notice_sample"), once: true, label: "Joss detects a live trace at the frame",
            requires: all(eq("glasshouse.scene.reactiveSampleAuthorized", true), eq(`faculty.${listenerSourceId}.active`, true),
                eq("body.frameSense", true), eq("glasshouse.scene.anchorAvailable", true),
                eq("glasshouse.scene.liveSampleReceived", true)), effects: [
                know("detected", "A current trace reached the frame anchor through an operating channel. I can notice this contact; I did not learn its sender's identity, thoughts, body or inventory.", caretakerId)]}),
        npc({id: id("send_notice"), once: true, label: "Joss replies through the live return path",
            requires: all(eq("glasshouse.scene.reactiveSampleAuthorized", true), known("detected"),
                eq("glasshouse.scene.traceDetectedThisSampling", true), eq("actor.glasshouse.willing", true),
                eq(`faculty.${listenerSourceId}.active`, true), eq("body.frameSense", true),
                eq("glasshouse.scene.anchorAvailable", true), eq("glasshouse.scene.returnPathAvailable", true)),
            effects: [know("notice", "A line arrives through the operating return path: 'I can hear someone at the frame. You need not give a name.' This proves a reply, not the listener's full reach."),
                know("notice_sent", "I sent one anonymous notice through the supported return path. I have no identity evidence.", caretakerId)]}),
        command({id: id("cooperate"), once: true, label: "Introduce as a visiting artisan · 1 coin · disclose this claim",
            worldId: observerEndpoint.worldId, location: observerLocation, targetId: undefined, coLocated: false,
            visibleWhen: known("notice"),
            requires: contact, costs: [{type: "resource", native: true, key: "money", amount: -1}],
            effects: [{type: "resource", actor: caretakerId, key: "coins", amount: 1},
                know("introduction", "The visitor claimed to be a visiting artisan and authorized the one-coin service settlement for this agreed calibration exchange. This is a claimed role, not proof of past identity.", caretakerId),
                know("cooperation", "You sent the agreed role claim and paid the one-coin service fee. Joss explained the current trace versus a stored impression; no listener source was transferred.", "player", "instruction"),
                memory("Received an explicit role claim and payment through the supported current channel.")]}),
        command({id: id("replay"), label: "Read the remembered line · no live sampling",
            worldId: undefined, location: undefined, targetId: undefined, coLocated: false, readOnly: true,
            visibleWhen: known("notice"), requires: known("notice"), effects: []}),
        command({id: id("return"), label: "Compare this visit with the earlier work",
            requires: all(instance, willing, eq("worldVisit.returning", true), known("welcome")),
            effects: [know("return", "You compare your earlier heard work records with Joss and the same room. A declined repair is not your contribution; a covered bench is not a destroyed interior. No wages, consumed sample, first gift or source are restored by this conversation.")]}),
        command({id: id("refuse"), label: "Decline new residence work · no debt",
            effects: [know("refusal", "You declined the offered new work. No tenancy, wage, project payment or further obligation was accepted. Joss may continue only independently funded work.")]}),
        command({id: id("leave_terms"), label: "Ask about leaving or closing the route · no commitment",
            effects: [know("leave_terms", "Joss explains that departure needs the actual route and settled or cancelled work. Closing the route preserves the room, its occupants, cargo and earlier work; destroying its anchor would be a different authored event.")]}),
    ];
    // Remove absent optional fields before handing definitions to a JSON registry.
    for (const definition of commands) for (const key of Object.keys(definition))
        if (definition[key] === undefined) delete definition[key];

    const choice = (name, label, commandId, extra = {}) => ({id: id(name), label, commandId, ...extra});
    const families = [
        {id: id("residence"), revision: 1, participants: ["player", caretakerId],
            opening: "Joss moves a tin away from a leak. 'The dry chair is free. My workbench has a queue.'",
            goals: {caretaker: "Keep a useful shared room and buy real work from finite means.", visitor: "Choose shelter, work, craft or onward travel."},
            evidence: ["Actual arrival", "Joss's introduction and disclosed offer", "Visible frame and bench"],
            choices: [choice("welcome_choice", "Ask about staying", id("welcome")),
                choice("ordinary_repair_choice", "Supply the ordinary frame repair", baseId("repair_ordinary")),
                choice("step_repair_choice", "Use the actually learned, fueled Step", baseId("repair_step")),
                choice("work_choice", "Accept one paid bench shift", id("paid_work")),
                choice("refuse_choice", "Decline new work", id("refuse"))],
            interruption: "Unaccepted talk ends freely. Accepted work retains its explicit refund/forfeit and participant reservation.",
            returnRule: "Actual work/repair records select later speech; the same chair is not a new reward.",
            afterWork: "Joss: 'The kit is mine; the wages were yours. We managed to keep those straight.'"},
        {id: id("preparation"), revision: 1, participants: ["player", caretakerId],
            opening: "Joss places a bowed blank beside the clamp. 'More pressure will not make this dry.'",
            evidence: ["Inspected material", "Actual template custody", "Heard instruction", "A paid trial result"],
            choices: [choice("damp_choice", "Fund the declared damp failure", id("damp_trial")),
                choice("sound_choice", "Use sound stock and your taught tool method", id("sound_trial")),
                choice("joint_choice", "Request a genuinely remembered, funded collaboration", id("cooperative_trial")),
                choice("shelf_choice", "Build the calibration shelf", id("shelf")),
                choice("report_choice", "Ask for an offered research report", id("hear_research")),
                choice("listener_supply_choice", "Offer a real spare kit for the paired frame", id("supply_listener")),
                choice("listener_setup_choice", "Ask Joss to prepare the paired frame", id("listener_setup"),
                    {actorId: caretakerId, nativeWrapperRequired: true})],
            interruption: "Forfeit the consumed damp test; refundable reservations return only through the real cancellation owner.",
            failure: "Joss: 'The sample failed. That is a result. It is not a finished fitting.'",
            privateBoundary: "Joss's separate project and remaining purse stay private until a chosen supported report.",
            returnRule: "Old failed evidence remains; a new sound trial pays new stock and leaves a distinct fitting."},
        {id: id("listener"), revision: 1, participants: ["player", caretakerId],
            openingRequiresKnowledge: id("notice"),
            opening: "A reply reaches the frame: 'I notice the live trace, not the story you tell about yourself.'",
            evidence: ["Current incoming trace", "Qualified listener body/source and anchor", "Actual return path"],
            choices: [choice("cooperate_choice", "Pay and disclose the offered role claim", id("cooperate")),
                choice("replay_choice", "Read only the remembered reply", id("replay")),
                {id: id("shutter_choice"), label: "Shut the live observation connection; keep the room",
                    commandId: null, draftBindingId: id("close_observation"),
                    planner: "planRealmClosure", operation: "close", connectionRole: "live_observation", costs: [],
                    requires: ["Actual actor can reach the shutter", "Correct observation edge, revision and authority"],
                    result: "Close only that live view; retain interior, route-independent work, items and memories."}],
            interruption: "Loss of actual channel/source/anchor stops further detection/replies; stored text does not restart contact.",
            privateBoundary: "Notice never reveals sender identity, hidden capacities or future outcomes. Genuine supported counters or superior means work under the actual boundary rule.",
            returnRule: "A role claim supports recognition only for its recipients. Silence/refusal makes no introduction or payment."},
        {id: id("return_and_leave"), revision: 1, participants: ["player", caretakerId],
            opening: "Joss: 'The room kept the work. Tell me which part you are asking about.'",
            choices: [choice("return_choice", "Compare the same instance's heard history", id("return")),
                choice("leave_terms_choice", "Ask about departure terms", id("leave_terms")),
                {id: id("depart_choice"), label: "Leave through the actual supported route", commandId: null,
                    draftBindingId: id("depart"), planner: "previewRealmPassage", operation: "passage",
                    requires: ["Real open return route", "Allowed cargo and actual body", "Settled/cancelled reserved work"],
                    result: "End this visit under planWorldDeparture; do not recreate the instance or refund prior work."}],
            returnRule: "Speaker recalls only own witnessed deeds or disclosures, never a parallel counterpart's friendship.",
            interruption: "A shut route can block passage without destroying the workshop. Failed-anchor escape is a separate unselected binding."}
    ];

    return {
        id: prefix, revision: POCKET_SCENE_REVISION, endpoint, observerEndpoint, observerLocation, caretakerId, situationId, connectionId,
        provenance: {kind: "O", numbersAccepted: false, status: "detached_content_implemented_unverified"},
        simulation: {commands, controllers: [{id: id("caretaker_controller"), revision: 1,
            label: "Joss's own finite research and trace response", actorId: caretakerId, interval: 1,
            actions: [{commandId: id("notice_sample"), priority: 4},
                {commandId: id("send_notice"), priority: 3}, {commandId: id("offer_research"), targetId: "player", priority: 2},
                {commandId: id("private_research"), priority: 1}]}]},
        families,
        definitionPatch: {initialFacts: {"scenes.preparation": "unvalidated", "scenes.shelfBuilt": false},
            factKeys: {[id("preparation")]: "scenes.preparation", [id("shelfBuilt")]: "scenes.shelfBuilt"}},
        listenerProposal: {source: {id: listenerSourceId, revision: 1, label: "Frame listener", kind: "trait", grants: []},
            ownerId: caretakerId, grantRequiresMasterSelection: true,
            acquisitionEffects: copy(listenerAcquisition), setupCommandId: id("listener_setup"),
            bodyProfile: {form: "human", initializeOnlyWhenMissing: true,
                initializationEffect: {type: "body", actor: caretakerId, key: "form", value: "human"},
                policy: "Select this original NPC profile explicitly in staged local setup; preserve any different existing form."},
            scope: {sense: "A current trace that actually reaches this instance's frame anchor.",
                identify: "Only an explicit received claim; not verified past identity.",
                reach: "Only the operating return path.", affect: "Only one notice, no physical attack or remote inventory access."},
            fuelCost: 0, zeroFuelIsOriginalScopeChoice: true,
            observationEpisode: "One actual configured sample per instance; no second opening to reuse old detection/notice records.",
            serviceSettlement: {kind: "O_scoped_service_settlement", amount: 1, fromNativeResource: "money",
                toActorId: caretakerId, toActorResource: "coins", selectionAndAssentRequired: true,
                scope: "Existing scalar balances settle this one agreed service through qualified contact; no physical cash or item passage is declared."}},
        bindingsRequired: {
            baseCommands: ["meet", "repair_ordinary", "repair_step", "decline", "rest", "study", "export_template", "pack_kits"].map(baseId),
            nonObservationCommandIds: ["welcome", "paid_work", "damp_trial", "sound_trial", "cooperative_trial",
                "shelf", "private_research", "offer_research", "hear_research", "return", "refuse", "leave_terms"].map(id),
            observationCommandIds: ["supply_listener", "listener_setup", "notice_sample", "send_notice", "cooperate", "replay"].map(id),
            reactiveCommandIds: ["notice_sample", "send_notice"].map(id),
            replayCommandId: id("replay"), replayUsesDurableDispatcher: false,
            registerCommandsExplicitly: true, mapGroupToNativeNotebook: "glasshouse",
            missingFacts: ["glasshouse.instanceClockActive", "glasshouse.scene.caretakerTemplateAvailable", `glasshouse.scene.${caretakerId}.workRemembered`,
                "glasshouse.scene.researchReportOffered", "glasshouse.scene.anchorAvailable",
                "glasshouse.scene.liveSampleReceived", "glasshouse.scene.returnPathAvailable",
                "glasshouse.scene.listenerSetupSupported", "glasshouse.scene.reactiveSampleAuthorized",
                "glasshouse.scene.traceDetectedThisSampling", "glasshouse.scene.noticeReceivedThisSampling",
                "glasshouse.scene.recipientWilling"],
            factMeaning: {instanceClockActive: "Actual same-instance played clock under selected absence policy; no wall-time work.",
                caretakerTemplateAvailable: "Actual caretaker-owned unencumbered template available for the reserved supervised job, not a registry label.",
                workRemembered: "Caretaker-to-player knowledge/memory from actual work, not player-only recall.",
                researchReportOffered: "The player's actual heard research_offer record from Joss's co-located disclosure command, not private completion.",
                liveSampleReceived: "Current qualified trace and actor-owned means, never replay/menu inspection.",
                returnPathAvailable: "Actual evaluateRealmBoundary/previewRealmPassage contact support for the notice."},
            instanceFactOwner: "Merge/map the patch to the single actual world-instance owner; do not save duplicate mirrors.",
            observationConnectionId,
            closeAndDepart: "Bind declared planner results plus real costs/effects through the one durable publisher; null command IDs are unavailable drafts.",
            grants: "Register/select the NPC listener proposal explicitly after the existing actor is created; no automatic enrollment.",
            observationEvent: "Stage only the two reactive NPC commands for a current qualified sample; keep ordinary NPC controllers and the absence work clock paused.",
            observationReceipts: "Bind current sample/detection/notice causes and real live recipients to the same current edge/revision; remembered text supplies no current support.",
            ownedItemKeys: ["Rough wood log", "Prepared survey kit", "Wet seal blank", "Sound seal blank", "Fitted parcel seal", "Sealing template"].map(itemKey)
        }
    };
}

// Project this native prototype's ordinary predicates from their real owners.
// The host merges these into player previews AND NPC scheduler contexts. This
// does not select a listener, evaluate a boundary or invent any live channel.
export function pocketRealmSceneFacts(content, state, actorId = "player") {
    assert(content && stable(content.id) && content.endpoint && stable(content.caretakerId), "Bind the actual scene pack.");
    assert(state && typeof state === "object" && stable(actorId), "Supply the actual state and observer ID.");
    const {caretakerId, endpoint} = content, realm = state.realmPrototype;
    const instance = realm?.instances?.[endpoint.instanceId];
    const visit = realm?.visits?.find(v => v.id === realm.activeVisitId && v.status === "active" &&
        v.instanceId === endpoint.instanceId && v.endpoint?.worldId === endpoint.worldId);
    const clockActive = !!instance && instance.clock?.absence === "freeze" && !!visit &&
        state.actors?.[visit.actorId]?.worldId === endpoint.worldId &&
        state.simulation?.people?.[visit.actorId]?.life === "alive";
    const localActor = state.actors?.[actorId]?.worldId === endpoint.worldId &&
        (visit?.actorId === actorId || instance?.actorIds?.includes(actorId));
    const template = itemKey("Sealing template"), custody = Object.values(state.simulation?.custody ?? {});
    const ownedTemplate = (state.simulation?.owners?.[caretakerId]?.[template] ?? 0) >= 1 &&
        !custody.some(c => c.holder === caretakerId && c.key === template);
    const knowledge = state.simulation?.knowledge ?? {};
    const caretakerBody = state.simulation?.people?.[caretakerId]?.body ?? {};
    const listenerSource = content.listenerProposal?.source?.id;
    const setupSupported = !!localActor && state.simulation?.people?.[caretakerId]?.life === "alive" &&
        caretakerBody.hands >= 2 && (caretakerBody.form == null || caretakerBody.form === "human") &&
        !state.actors?.[caretakerId]?.sources?.[listenerSource] &&
        !state.actors?.[caretakerId]?.completed?.[`${content.id}.listener_setup`];
    const heard = (ownerId, suffix) => {
        const record = knowledge[ownerId]?.[`${content.id}.${suffix}`];
        return !!record && typeof record.value === "string" && stable(record.cause) &&
            record.basis?.attributedTo === caretakerId && record.basis?.situationId === content.situationId;
    };
    return {
        "glasshouse.instanceClockActive": clockActive && !!localActor,
        "glasshouse.scene.caretakerTemplateAvailable": !!localActor && ownedTemplate,
        [`glasshouse.scene.${caretakerId}.workRemembered`]: !!localActor && heard(caretakerId, "work"),
        "glasshouse.scene.researchReportOffered": !!localActor && heard("player", "research_offer"),
        "glasshouse.scene.listenerSetupSupported": setupSupported
    };
}

// Pure authored records for the native adapter. This opens/registers nothing.
// Reverse sense/contact are admitted separately by the real connection API;
// reverse visual viewing stays blocked by bidirectional:false.
export function createPocketRealmObservationRules(content) {
    assert(content && stable(content.id) && stable(content.caretakerId), "Bind the actual scene pack.");
    const anchorId = `${content.id.replace(/\.scenes$/, "")}.frame`;
    const connection = createRealmConnection({id: content.bindingsRequired.observationConnectionId,
        revision: 1, from: copy(content.observerEndpoint), to: copy(content.endpoint), kind: "view",
        controllerId: "player", bidirectional: false, duration: 0, lifetime: null, costs: [], openingCosts: [],
        requirements: {id: `${content.id}.frame_view`, revision: 1, operations: ["view", "sense", "contact"],
            bodyForms: ["human"], anchorId, costs: []},
        chronology: {mode: "present"}, layerPolicy: {passage: false, manifestation: false, contact: false},
        cargoPolicy: {allowed: false, maxUnits: 0, allowEquipped: false, classes: []},
        observationPolicy: {sense: true, identify: false, reach: false, contact: true, identification: "none"},
        flows: ["light", "sound"]});
    const listenerBoundary = {id: `${content.id}.listener_boundary`, revision: 1,
        operations: ["sense", "contact"], bodyForms: ["human"], sourceId: content.listenerProposal.source.id,
        anchorId, costs: []};
    validateRealmBoundaryRule(listenerBoundary);
    return {connection, binding: realmConnectionBinding(connection), listenerBoundary, anchorId,
        scope: {singleSample: true, bodyMovement: false, cargoMovement: false,
            reactiveActionsAdvanceClock: false, replayWritesState: false},
        publicationRequired: "Compose actual view/sense/contact/closure plans and simulation effects under the one native publisher; realm.* plan data are not simulation effects."};
}

// Read only this observer's supplied knowledge. Never scan NPC records, world
// truth, pending outcomes or controller state; displaying these lines pays nothing.
export function pocketRealmSceneView(content, observerKnowledge = {}) {
    assert(content && typeof content.id === "string" && stable(content.id), "Bind a scene pack first.");
    assert(observerKnowledge && typeof observerKnowledge === "object" && !Array.isArray(observerKnowledge), "Supply only the observer's known records.");
    return {readOnly: true, records: Object.entries(observerKnowledge)
        .filter(([key, record]) => key.startsWith(`${content.id}.`) && record && typeof record.value === "string")
        .map(([key, record]) => ({key, text: record.value, kind: record.basis?.kind ?? "unspecified", at: record.at ?? null}))};
}
