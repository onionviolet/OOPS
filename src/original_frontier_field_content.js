// Original, reversible INC-P1 field proposals. Definitions alone do not enroll,
// move, teach, clear native zones or publish rewards. Shared owners execute them.
import {all, any, eq, not} from './basics.js';
const WORLD = "base.frontier", MIRA = "original_frontier.mira", WEN = "original_frontier.wen";
const NEA = "original_frontier.nea", IVER = "original_frontier.iver";
const LOG = JSON.stringify({id: "Rough wood log"}), KIT = JSON.stringify({id: "Prepared survey kit"}), ROPE = JSON.stringify({id: "Survey rope"});
const RAT = "frontier.rat_step", STEP = "field.load_step", FOCUS = "field.focus", DRIVE = "field.drive";
const BRACE = "frontier.brace_control", TRAIL = "frontier.trail_reading", INQUIRY = "frontier.shared_inquiry";
const gte = (fact, value, reason) => ({fact, op: "gte", value, ...(reason ? {reason} : {})});
const lte = (fact, value, reason) => ({fact, op: "lte", value, ...(reason ? {reason} : {})});
const af = (key, value = true, actor) => ({type: "fact", scope: "actor", key: `original_frontier.${key}`, value, ...(actor ? {actor} : {})});
const wf = (key, value = true) => ({type: "world", worldId: WORLD, key: `original_frontier.${key}`, value});
const actor = (key, value = true, reason) => eq(`actor.original_frontier.${key}`, value, reason);
const absent = key => not(actor(key));
const item = (key, amount, holder) => ({type: "item", key, amount, ...(holder ? {actor: holder} : {})});
const stamina = (amount, holder) => ({type: "vital", key: "stamina", amount, ...(holder ? {actor: holder} : {})});
const coins = (amount, holder) => ({type: "resource", key: "coins", amount, actor: holder});
const money = amount => ({type: "resource", key: "money", native: true, amount});
const attention = (amount, holder) => ({type: "resource", key: "fieldAttention", amount, actor: holder});
const energy = (energyId, output, control) => ({type: "energy", energyId, operation: "use", output, control});
const xp = (skill, amount) => ({type: "xp", skill, amount});
const know = (key, value, attributedTo = "player", stage = "seen", holder) => ({type: "knowledge", key: `original_frontier.${key}`, stage, value,
    basis: {kind: attributedTo === "player" ? stage === "understood" ? "inference" : "observation" : "observation", attributedTo, situationId: "original_frontier.short_measure"},
    ...(holder ? {actor: holder} : {})});
const remember = (target, text) => ({type: "relationship", target, axis: "trust", amount: 0, text});
const command = d => {const out = {revision: 1, worldId: WORLD, group: "original_frontier", actorId: "player", location: "Village", costs: [], effects: [], ...d};
    if(out.location == null) delete out.location; return out;};
const introduced = actor("freight.introduced"), question = actor("explore.question");
const living = eq("actor.life", "alive", "Recover before field work."), healthy = gte("vital.health", 2, "Recover above one HP before this trial.");
const hands = eq("originalFrontier.playerHandsUsable", true, "This task needs two usable hands. Rest tender hands first.");
// This is the declared cargo limit, not a new universal weight simulation.
const light = eq("originalFrontier.unloadedBody", true, "Leave Rough wood logs and Prepared survey kits in storage before personal footing. Ordinary gear and a rope can remain carried.");
const rat = all(eq(`technique.${RAT}.observed`), eq(`technique.${RAT}.understood`), eq(`technique.${RAT}.owned`),
    gte(`technique.${RAT}.proficiency`, 6), gte("agility", 8), eq(`technique.${RAT}.executable`, true, "Owned Rat-step needs proficiency six and Agility eight."));
const masteredRat = all(rat, gte(`technique.${RAT}.proficiency`, 12, "Reach the existing Rat-step cap of twelve through its own practice."));
const step = all(eq(`power.${STEP}.owned`), eq(`faculty.${STEP}.active`, true, "Restore the actual learned Load-bearing Step source."), hands);
const driveStep = all(step, gte(`power.${STEP}.mastery`, 2, "Practice the existing loaded application to mastery two."));
const ropeSkill = all(hands, gte("native.skill.Climbing.level", 2, "The inspected rope route needs native Climbing level two."));
const guarded = (requires, coLocated = false) => ({completionRequires: requires, completionCoLocated: coLocated, completionFailure: "refund"});
const dossier = actor("explore.dossier"), feat = actor("mastery.feat"), inquiry = all(eq(`power.${INQUIRY}.owned`), gte(`power.${INQUIRY}.mastery`, 2), eq(`faculty.${INQUIRY}.active`));
const homeConsent = eq("originalFrontier.homeParticipantSupported", true, "Mira must still consent, be present and have her own usable body for this trial.");
const fieldSupport = eq("originalFrontier.fieldParticipantSupported", true, "The selected observer needs present consent, a living usable body and their own real rope.");
const frameKit = eq("originalFrontier.frameKitAvailable", true, "The selected observer needs an owned, unborrowed Prepared survey kit for the frame.");
const fieldSite = "original_frontier.field_crossing", homeSite = "original_frontier.home_trial";
const places = [
    {key: "forest", location: "Forest road", worker: NEA, name: "Nea", zone: "Forest", site: "original_frontier.forest_stage", access: "native.zone.Forest road.accessible",
        margin: "The safe road keeps a clear staging strip beside the wooded turn. Your observation stops before the wolf path; it says nothing about Deep forest or a cleared Forest."},
    {key: "cave", location: "Nearby cave", worker: IVER, name: "Iver", zone: "Cave room", site: "original_frontier.cave_stage", access: "native.zone.Nearby cave.accessible",
        margin: "The daylight entrance has a narrow stopping ledge. Your observation stops before Cave room's grouped rats and says nothing about dark Cave depths or cleared rooms."}
];

export const originalFrontierFieldSources = [
    {id: "original_frontier.unloaded_retreat", revision: 1, label: "Bounded footing retreat", kind: "knowledge", origin: "trained", grants: [],
        bioDetail: "A performed footing feat and a safe loaded limitation test taught where to stop and leave the cargo."},
    {id: "original_frontier.frame_planning", revision: 1, label: "Divided frame procedure", kind: "knowledge", origin: "trained", grants: [],
        bioDetail: "A performed loaded feat and an actual safe limitation test taught when a second ordinary supporter is necessary."}
];

const questions = [
    command({id: "original_frontier.question_village", label: "Ask why a copied mark differs from the crossing", once: true, claim: "original_frontier.explore.question",
        targetId: MIRA, coLocated: true, visibleWhen: introduced,
        requires: all(introduced, any(eq("campaign.anchor"), eq("skills.routeKnown"), actor("freight.villageRevisited"), eq("actor.town.returned"))),
        description: "Mira asks whether a copied dry-bank mark also supports a loaded observation frame. Your existing inspected crossing or learned route provides the question; this teaches no drainage route and repeats no native reward.",
        effects: [af("explore.question"), af("explore.questionSource", "Mira"), af("control.workday", false), af("control.retryDone", false),
            {type: "site", siteId: fieldSite, operation: "open"}, {type: "site", siteId: homeSite, operation: "open"},
            know("explore.question", "Mira's present question: a copied mark names a dry bank, but a personal foothold and a loaded observation frame need different ground. Compare the Village crossing with the actual Forest road or accessible cave margin, then name a safe stopping point.", MIRA)]}),
    command({id: "original_frontier.question_town", label: "Ask Wen about the notice's unsupported margin", location: "Town square", once: true, claim: "original_frontier.explore.question",
        targetId: WEN, coLocated: true, visibleWhen: actor("freight.townMet"), requires: all(introduced, actor("freight.townMet")),
        description: "Wen offers a new field question after your actual receiving report. The old town survey or timber contribution remains its own result; no six-coin settlement is awarded again.",
        effects: [af("explore.question"), af("explore.questionSource", "Wen"), af("control.workday", false), af("control.retryDone", false),
            {type: "site", siteId: fieldSite, operation: "open"}, {type: "site", siteId: homeSite, operation: "open"},
            know("explore.question", "Wen reports that the notice copied a personal dry-bank mark as if it also supported a loaded frame. Check the Village crossing and one actually reached margin. His notice is reported evidence, not your firsthand visit.", WEN)]}),
    command({id: "original_frontier.inspect_crossing", label: "Measure the crossing's stopping point · 5 min + 2 stamina", once: true, duration: 5, cancellation: "refund", siteId: fieldSite,
        visibleWhen: question, requires: all(question, living, healthy), ...guarded(all(living, healthy)), costs: [stamina(-2)],
        effects: [af("explore.crossing"), know("explore.crossing", "Firsthand Village crossing comparison: the marked footholds support one careful body. A level patch before the narrow part can stage a loaded frame. Five played minutes measured this local stopping point; the crossing remains unrepaired.")],
        description: "Measure a new task boundary even if the old crossing survey is finished. Cancellation refunds reserved stamina. This records no old survey completion, money, route repair or zone clear."}),
    command({id: "original_frontier.consult_notice", label: "Consult Wen's offered road report", location: "Town square", targetId: WEN, coLocated: true, once: true,
        visibleWhen: question, requires: all(question, actor("freight.townMet")),
        effects: [af("explore.reportHeard"), know("explore.reported_margin", "Wen's offered report describes a safe road strip beside the wooded turn. You heard his report at Town square; you have not thereby seen the road, cave, rats or wolves yourself.", WEN)],
        description: "Free reported evidence with its source retained. A later dossier still requires your own Village and margin comparisons."})
];
const preparation = [
    ["safe", "Plan a smaller safe-parent observation", 1, [], all(living), "safe", "Use only the level safe-parent staging patch. No rope, method or combat is promised; the resulting map will leave the off-path reach untested."],
    ["rope", "Inspect a personal rope plan · 2 min + 1 stamina", 2, [stamina(-1), item(ROPE, -1)], all(living, healthy, ropeSkill, light), "light_rope", "Inspect your actual rope for a personal footing comparison. Your logs and kits stay in storage; the rope returns after this preparation."],
    ["rat", "Prepare earned Rat-step footing · 2 min + 1 stamina", 2, [stamina(-1)], all(living, healthy, rat, hands, light), "light_rat", "Use your actual owned, executable Rat-step for a personal footing comparison. This carries no observation frame or cargo."],
    ["loaded", "Inspect an ordinary loaded plan · 4 min + 2 stamina", 4, [stamina(-2), item(KIT, -1)], all(living, healthy, hands), "loaded_ordinary", "Inspect one actual kit for the slower loaded-frame approach. This reserves and returns the kit; no load capacity or power is learned."],
    ["step", "Prepare a precise loaded plan · 2 min + 1 stamina", 2, [stamina(-1), item(KIT, -1)], all(living, healthy, step, eq(`energy.${FOCUS}.known`)), "loaded_step", "Use Load-bearing Step with measured focus for one output and two control. The actual kit returns; fuel is spent on the later field use."],
    ["trail", "Select the taught trace comparison · 2 min + 1 stamina", 2, [stamina(-1)], all(living, healthy, eq(`power.${TRAIL}.owned`), gte(`power.${TRAIL}.mastery`, 2), eq(`faculty.${TRAIL}.active`)), "trail", "Use earned Trail reading to compare stable drainage cuts rather than transient footprints. This improves the new local comparison and grants no unseen person's position."]
].map(([id, label, duration, costs, requires, plan, text]) => command({id: `original_frontier.prepare_${id}`, label, duration, cancellation: "refund",
    visibleWhen: all(question, ...(id === "rat" ? [eq(`technique.${RAT}.observed`)] : id === "step" ? [eq(`power.${STEP}.owned`), eq(`energy.${FOCUS}.known`)] : id === "trail" ? [eq(`power.${TRAIL}.owned`)] : [])),
    requires: all(question, requires), ...guarded(requires), costs,
    ...(id === "step" ? {powerId: STEP, output: 1} : id === "trail" ? {powerId: TRAIL} : {}),
    effects: [af("explore.plan", plan), ...costs.filter(c => c.type === "item").map(c => ({...c, amount: -c.amount})), know(`explore.preparation_${id}`, text, "player", "understood")],
    description: `${text} You still travel by native connections. Changing the plan accepts no resident job and produces no kit or reward.`}));

const comparisons = places.flatMap(p => [
    ["safe", 5, [stamina(-2)], all(actor("explore.plan", "safe"), living, healthy), [], "safe_parent", "A measured walk compares the level stopping patch; the off-path reach remains deliberately untested."],
    ["rope", 5, [stamina(-2), item(ROPE, -1)], all(actor("explore.plan", "light_rope"), living, healthy, ropeSkill, light), [item(ROPE, 1)], "personal_rope", "Your inspected rope supports the personal footing check. It returns intact; it provides no cargo capacity."],
    ["rat", 5, [stamina(-2)], all(actor("explore.plan", "light_rat"), living, healthy, rat, hands, light), [], "personal_rat", "Owned Rat-step performs the personal footing check without a rope. The body and native Agility gate matter; it moves no frame or cargo."],
    ["loaded", 8, [stamina(-3), item(KIT, -1)], all(actor("explore.plan", "loaded_ordinary"), living, healthy, hands), [item(KIT, 1)], "loaded_ordinary", "Ordinary handling takes longer and more stamina to set an actual kit-frame on the level staging patch. The narrow foothold is excluded."],
    ["step", 5, [stamina(-1), item(KIT, -1), energy(FOCUS, 1, 2)], all(actor("explore.plan", "loaded_step"), living, healthy, step), [item(KIT, 1)], "loaded_focus", "One output and two control steady the actual kit-frame on the staging patch. Measured focus spends two units and gains one strain; no arbitrary cargo capacity is granted."],
    ["trail", 4, [stamina(-2)], all(actor("explore.plan", "trail"), living, healthy, eq(`power.${TRAIL}.owned`), gte(`power.${TRAIL}.mastery`, 2), eq(`faculty.${TRAIL}.active`)), [], "trace", "Earned Trail reading selects the lasting drainage cut for the new comparison one minute faster. Transient prints reveal no private position."]
].map(([id, duration, costs, requires, returns, kind, text]) => command({id: `original_frontier.compare_${p.key}_${id}`, label: `Compare the ${p.key === "forest" ? "road" : "cave"} margin with ${id === "safe" ? "a measured walk" : id === "rat" ? "Rat-step" : id === "step" ? "measured focus" : id === "trail" ? "Trail reading" : id === "loaded" ? "ordinary loaded handling" : "your rope"} · ${duration} min`,
    location: p.location, duration, cancellation: "refund", once: true, claim: `original_frontier.explore.margin_${p.key}`,
    visibleWhen: all(question, actor("explore.crossing"), ...(id === "rat" ? [eq(`technique.${RAT}.observed`)] : id === "step" ? [eq(`power.${STEP}.owned`), eq(`energy.${FOCUS}.known`)] : id === "trail" ? [eq(`power.${TRAIL}.owned`)] : [])),
    requires: all(question, actor("explore.crossing"), eq(p.access, true, "Earn and reach this native safe parent first."), requires),
    ...guarded(requires), ...(id === "step" ? {powerId: STEP, output: 1} : id === "trail" ? {powerId: TRAIL} : {}), costs,
    effects: [...returns, af(`explore.${p.key}Compared`), af(`explore.${p.key}Approach`, kind), af("explore.outward"),
        know(`explore.${p.key}_margin`, `Firsthand ${p.location} comparison. ${p.margin} ${text}`)],
    description: `${text} ${p.margin} Native travel happened before this local task. Cancellation returns reserved means and creates no observation; previous evidence remains.`})));

const returns = [
    command({id: "original_frontier.compile_dossier", label: "Return and compare the actual field notes · 2 min", once: true, duration: 2, cancellation: "refund", visibleWhen: question,
        requires: all(question, actor("explore.crossing"), any(actor("explore.forestCompared"), actor("explore.caveCompared"))),
        effects: [af("explore.dossier"), know("explore.dossier", "Returned dossier: the firsthand Village stopping patch and reached margin support a safe staging choice. Personal footing does not establish loaded reach; neither margin report proves a native zone cleared. Separate place records retain the performed preparation, completion time, source and limit.", "player", "understood")],
        description: "Returning to Village is an actual native journey. Combine your two personally performed comparisons; retain Wen's report separately and leave any unvisited place unknown."}),
    command({id: "original_frontier.offer_dossier_trial", label: "Offer Mira a funded local trial · 2 coins", once: true, claim: "original_frontier.explore.return", targetId: MIRA, coLocated: true,
        visibleWhen: dossier, requires: all(dossier, actor("freight.villageRevisited"), eq("target.life", "alive")), costs: [money(-2)],
        effects: [af("explore.trialOrdered"), af("fieldTrialWilling", true, MIRA), af("fieldTrialOrdered", true, MIRA),
            know("explore.trial_terms", "Mira accepted a two-coin local trial budget, a declared service sink. She will use her own retained real log and two stamina at the Village stopping patch. No player log, native quest reward or instant result was supplied.", MIRA),
            remember(MIRA, "Accepted one paid, bounded Village trial of the returned dossier; no continuing obligation was assumed.")],
        description: "Mira consents to one local trial after her real return. Two coins fund this service as a declared sink; no paired recipient income is claimed. Her actual retained log is reserved by her later job and returns intact."}),
    command({id: "original_frontier.resident_dossier_trial", actorId: MIRA, audience: ["$actor"], label: "Mira tests the returned staging recommendation", duration: 4, cancellation: "refund", siteId: homeSite,
        requires: all(actor("fieldTrialOrdered"), actor("fieldTrialWilling"), living, healthy, gte("body.hands", 2)),
        ...guarded(all(actor("fieldTrialWilling"), living, healthy, gte("body.hands", 2))), costs: [stamina(-2), item(LOG, -1)],
        effects: [item(LOG, 1), af("fieldTrialOrdered", false), af("fieldTrialDone"), wf("explore.trialResult", "The level Village stopping patch held my one-log trial. I stopped before the narrow crossing; the distant off-path reach remains untested."),
            know("explore.resident_trial", "I spent my own two stamina to test the staging patch with my retained actual log, which remains mine. The tested recommendation supports this one-log local operation, not arbitrary freight.", MIRA, "seen", MIRA)],
        description: "An autonomous, privately recorded job spends Mira's own real means once. It starts only in Village and waits while she or the staging slot is occupied. Only a later offered report discloses its result."}),
    command({id: "original_frontier.dossier_trial_report", label: "Hear Mira's later firsthand trial report", targetId: MIRA, coLocated: true, once: true,
        visibleWhen: actor("explore.trialOrdered"), requires: all(actor("explore.trialOrdered"), eq("world.original_frontier.explore.trialResult", "The level Village stopping patch held my one-log trial. I stopped before the narrow crossing; the distant off-path reach remains untested.")),
        effects: [af("explore.return"), af("explore.returnChoice", "resident_trial"), {type: "observation", scope: "world", key: "original_frontier.explore.trialResult", as: "original_frontier.explore.trialReport"},
            know("explore.return", "Mira offers her completed firsthand one-log trial: the Village staging patch was usable and she stopped before the narrow crossing. Her actual log returned to her stock; your native survey and earlier claims remain unchanged.", MIRA),
            remember(MIRA, "Returned a firsthand, limited result after performing the funded trial with my own means.")]}),
    ...[["keep_dossier", "Keep the dossier for home preparation", "kept", "You retained the tested staging and preparation notes for personal use. Nobody was paid or promised a trial."],
        ["withdraw_recommendation", "Withdraw the unsupported off-path recommendation", "withdrawn", "You withdrew the stronger off-path recommendation. The firsthand margin evidence remains, qualified by a new correction: only the safe-parent staging patch was tested."]]
        .map(([id, label, choice, text]) => command({id: `original_frontier.${id}`, label, once: true, claim: "original_frontier.explore.return", visibleWhen: dossier, requires: dossier,
            effects: [af("explore.return"), af("explore.returnChoice", choice), know(`explore.return_${choice}`, text, "player", "understood")],
            description: "A finite useful return without a resident commission. A correction adds a retained record; it does not erase old observations or rewrite native quest history."})),
    command({id: "original_frontier.practice_local_comparison", label: "Practice the known local comparison · 5 min + 2 stamina", duration: 5, cancellation: "refund", automatable: true,
        visibleWhen: dossier, requires: all(dossier, living, healthy, lte("native.skill.Perception.level", 5, "This known local practice stops at native Perception six.")),
        costs: [stamina(-2)], effects: [xp("Perception", 4)], description: "Personal practice earns four native Perception XP. It grants no new discovery, title, insight or payment and stops at the declared native competence target."})
];

const workQuestions = places.map(p => command({id: `original_frontier.hear_${p.key}_work`, label: `Hear ${p.name}'s local observation request`, location: p.location, once: true,
    visibleWhen: question, requires: all(question, eq(p.access, true, "Reach the actually accessible safe parent first.")),
    effects: [{type: "spawn", personId: p.worker, definitionId: p.worker}, item(KIT, 1, p.worker), item(ROPE, 1, p.worker),
        {type: "site", siteId: p.site, operation: "open"}, af("control.willing", true, p.worker), af("control.question"), af(`control.${p.key}Met`),
        know(`control.${p.key}_question`, `${p.name} personally offers a bounded observation from ${p.location}. Their own four-coin purse funds one two-coin workday and a separately budgeted two-coin retry; they own one kit, one rope, two attention allowances and eight stamina. They remain at this safe parent and may leave the frame. A narrower safe-parent survey needs no fight.`, p.worker),
        know("control.request", "I consent to one bounded observation workday and a separately funded retry, using my own kit, rope, attention and wages. I remain at my native safe parent; no universal safety or perpetual service was promised.", p.worker, "seen", p.worker)],
    description: "This actual local meeting opts in one resident with explicit finite stock and means. No zone is cleared, native access unlocked or combat technique learned by listening."}));

const encounterAcceptance = places.map(p => command({id: `original_frontier.accept_${p.key}`, label: `Accept one new ${p.zone} encounter contribution`, location: p.location,
    visibleWhen: all(actor(`control.${p.key}Met`), eq(`native.zone.${p.zone}.accessible`)),
    requires: all(actor("control.question"), actor(`control.${p.key}Met`), living, healthy,
        eq(`native.zone.${p.zone}.accessible`, true, "Earn this exact native combat zone first."), eq("originalFrontier.nativeEncounterAvailable", true, "Finish or withdraw the previous accepted attempt first.")),
    effects: [af("control.encounterAccepted"), af("control.encounterReady", false), af("control.encounterZone", p.zone),
        know(`control.accepted_${p.key}`, `You voluntarily accepted one new native ${p.zone} victory after this agreement. ${p.name} stays at ${p.location}. Return and recover there before their separate workday; one victory proves no general zone clearance.`)],
    description: `The native host freezes this exact zone and present victory count in the same staged plan. Enter through ordinary native travel, fight through native combat and return to ${p.location}. Old victories, loot, kill XP and zone rewards remain with their owners. Listening or accepting grants none.`}));

const workdayResult = (p, plan, retry = false) => [item(KIT, 1, "$target"), money(2), af("control.workday"), af("control.plan", plan),
    ...(retry ? [af("control.retryDone")] : []), af(`control.${p.key}Worked`),
    know(`control.${p.key}_${retry ? "retry" : plan}`, `${p.name} and you completed an actual bounded observation at ${p.location}. ${plan === "protected" ? "Your newly accepted native victory supported this supervised edge check; the observer stayed at the safe parent and no spawn or zone-clear rule was suppressed." : plan === "controlled" ? "Your actual held frame supported the observation; control of a local frame is not a monster-binding or player guard power." : plan === "shared" ? "Your actual dossier and the observer's performed contribution were combined through earned Shared inquiry. The bounded safe-parent comparison took six minutes instead of eight; no report was counted as a personal visit." : "The smaller safe-parent reach remained useful without combat."} Their paid kit returned to their inventory; their two-coin wage, one attention and two stamina were spent, and you received the agreed two coins.`),
    know(`control.${retry ? "retry" : "workday"}`, `I performed the ${plan} local observation with my own two stamina and one attention, retained my real kit and paid two agreed coins. I can stop future work; my four-coin starting purse is finite.`, p.worker, "seen", p.worker),
    remember(p.worker, `Completed the agreed ${plan} observation with actual stock, spent effort and paid terms.`)];
const workdays = places.flatMap(p => ["safe", "protected", "controlled", "shared"].map(plan => {
    const support = all(living, healthy, hands, fieldSupport,
        ...(plan === "protected" ? [actor("control.encounterReady"), eq("originalFrontier.nativeEncounterReady", true, "A fresh accepted victory and return to its exact safe parent are required.")]
            : plan === "controlled" ? [actor("control.frameHeld")] : plan === "shared" ? [inquiry, dossier, actor(`explore.${p.key}Compared`)] : []));
    const duration = plan === "shared" ? 6 : 8;
    return command({id: `original_frontier.work_${p.key}_${plan}`, label: `${plan === "safe" ? "Take the smaller safe-parent survey" : plan === "protected" ? "Complete the supervised edge workday" : plan === "shared" ? "Combine the paid observation through Shared inquiry" : "Use the held frame for the observation"} · ${duration} min · earn 2 coins`,
        location: p.location, targetId: p.worker, coLocated: true, participants: ["$target"], siteId: p.site, duration, cancellation: "refund", claim: "original_frontier.control.workday",
        visibleWhen: all(actor(`control.${p.key}Met`), absent("control.workday"), ...(plan === "shared" ? [eq(`power.${INQUIRY}.owned`)] : [])), requires: all(actor(`control.${p.key}Met`), support),
        // A consumed native receipt is checked at admission, not completion.
        // Root restores it only when this job refunds without producing output.
        ...guarded(all(living, healthy, hands, fieldSupport, ...(plan === "shared" ? [inquiry] : [])), true), ...(plan === "shared" ? {powerId: INQUIRY} : {}),
        costs: [stamina(-1), stamina(-2, "$target"), attention(-1, "$target"), coins(-2, "$target"), item(KIT, -1, "$target")],
        effects: workdayResult(p, plan),
        description: `Reserve ${p.name}, one staging slot, their actual kit, one attention, two stamina and two coins. Player spends one stamina. The kit is held and returned intact; cancellation/failed support returns reserved inputs and pays nothing. ${plan === "protected" ? "The host consumes the one native contribution receipt at admission and restores it only if this work refunds without output." : "The actual bounded local work leaves native combat rewards and zone access with their existing owners."}`});
}));
const recovery = places.flatMap(p => [
    command({id: `original_frontier.reschedule_${p.key}`, label: "Keep the observation offer for a later day", location: p.location, targetId: p.worker, coLocated: true, once: true,
        visibleWhen: all(actor(`control.${p.key}Met`), absent("control.workday")), requires: actor(`control.${p.key}Met`),
        effects: [af(`control.${p.key}Rescheduled`), know(`control.${p.key}_rescheduled`, `${p.name} agreed to keep the finite funded offer open. No goods or effort were spent; recover with ordinary native controls, choose a smaller survey or return prepared.`, p.worker)],
        description: "A lawful pause without a deadline, source loss, debt or off-screen injury."}),
    command({id: `original_frontier.rest_${p.key}_observer`, label: `Pause with ${p.name} to recover their effort · 3 min`, location: p.location, targetId: p.worker, coLocated: true,
        participants: ["$target"], duration: 3, cancellation: "refund", visibleWhen: actor(`control.${p.key}Met`), requires: fieldSupport, ...guarded(fieldSupport, true),
        effects: [stamina(8, "$target")], description: "Reserve a played local rest with the willing observer. Their stamina recovers to its own eight-point maximum. Kit, attention, purse, demand, health and learned methods receive no replenishment."}),
    command({id: `original_frontier.retry_${p.key}_safe`, label: "Funded second safe-parent job · 8 min · earn 2 coins", location: p.location, targetId: p.worker, coLocated: true, participants: ["$target"], siteId: p.site,
        duration: 8, cancellation: "refund", claim: "original_frontier.control.retry", visibleWhen: all(actor("control.workday"), actor(`control.${p.key}Met`), absent("control.retryDone")),
        requires: all(actor("control.workday"), living, healthy, hands, fieldSupport), ...guarded(all(living, healthy, hands, fieldSupport), true),
        costs: [stamina(-1), stamina(-2, "$target"), attention(-1, "$target"), coins(-2, "$target"), item(KIT, -1, "$target")], effects: workdayResult(p, "safe", true),
        description: "The observer's separately budgeted second two-coin job uses their last attention and wages. It remains ordinary and safe. No controller replenishes demand, funds, kit or stamina."}),
    command({id: `original_frontier.close_${p.key}_protection`, label: "Close future protection while keeping the result", location: p.location, targetId: p.worker, coLocated: true, once: true,
        visibleWhen: actor(`control.${p.key}Met`), requires: actor(`control.${p.key}Met`), effects: [af("control.willing", false, "$target"), af("control.encounterAccepted", false), af("control.encounterReady", false),
            af("control.closed"), know(`control.${p.key}_closed`, `${p.name} accepted closing future protection. Completed work remains known; unused kit, rope, attention and coins remain theirs. Native combat and recovery remain available.`, p.worker)],
        description: "The current reserved task must finish or be cancelled first. This closes only this resident's future agreement and clears any outstanding contribution attempt without healing or refunding native combat."})
]);

const frameResponses = [
    {id: "release", label: "Release the frame safely", effects: [af("control.frameReleased"), af("control.frameResult", "released"),
        know("control.frame_release", "You deliberately released the agreed frame before its stopping marker. No workday, demonstrated hold or native victory was fabricated.")]},
    {id: "ordinary", label: "Set an ordinary stance · 3 stamina", requires: all(living, healthy, hands, fieldSupport, frameKit), costs: [stamina(-3)],
        effects: [af("control.frameHeld"), af("control.frameResult", "ordinary"), xp("Equilibrium", 4)]},
    {id: "focus", label: "Read the shove · 2 focus units", visibleWhen: all(eq(`power.${STEP}.owned`), eq(`energy.${FOCUS}.known`)), requires: all(living, healthy, step, fieldSupport, frameKit), costs: [energy(FOCUS, 1, 2)],
        effects: [af("control.frameHeld"), af("control.frameResult", "focus"), xp("Equilibrium", 4)]},
    {id: "drive", label: "Brace through the shove · 3 drive units", visibleWhen: all(eq(`power.${STEP}.owned`), eq(`energy.${DRIVE}.known`)), requires: all(living, healthy, driveStep, fieldSupport, frameKit), costs: [energy(DRIVE, 3, 1)],
        effects: [af("control.frameHeld"), af("control.frameResult", "drive"), xp("Equilibrium", 4)]},
    {id: "brace", label: "Turn the trained brace · 2 stamina", visibleWhen: eq(`power.${BRACE}.owned`), requires: all(living, healthy, hands, fieldSupport, frameKit, eq(`power.${BRACE}.owned`),
        gte(`power.${BRACE}.mastery`, 2), eq(`faculty.${BRACE}.active`), gte("strength", 8)), costs: [stamina(-2)],
        effects: [af("control.frameHeld"), af("control.frameResult", "brace"), xp("Equilibrium", 4)]}
];
const assessments = places.map(p => command({id: `original_frontier.assess_${p.key}_frame`, label: "Try this observation frame's consented shove", location: p.location,
    targetId: p.worker, coLocated: true, participants: ["$target"], encounterId: "original_frontier.observation_frame",
    visibleWhen: actor(`control.${p.key}Met`), requires: all(living, healthy, fieldSupport, frameKit), costs: [stamina(-1, "$target")],
    description: `${p.name} reserves their body and spends one actual stamina on the controlled shove. Their real kit stays owned and available throughout the reserved encounter. Hold with an ordinary stance or a compatible actually learned method; free release and withdrawal remain available. This new assessment teaches no method.`}));

const masteryIntroduction = [
    command({id: "original_frontier.ask_mastery_trial", label: "Ask Mira for a new footing or frame trial", targetId: MIRA, coLocated: true, once: true,
        visibleWhen: introduced, requires: all(introduced, actor("freight.villageRevisited")),
        effects: [af("mastery.question"), af("masteryTrialWilling", true, MIRA), {type: "site", siteId: fieldSite, operation: "open"}, {type: "site", siteId: homeSite, operation: "open"},
            know("mastery.question", "Mira offers a new personal footing course and an actual loaded-frame trial for travelers who already finished their old crossing or loose-bank work. Ordinary slower methods remain possible. The new feats carry new receipts; old mastery alone completes neither.", MIRA)],
        description: "An actual willing contact opens the new trials. Listening offers a question; instruction, training and performed feats remain separate actions."}),
    ...[["rat", all(eq(`technique.${RAT}.observed`), eq(`technique.${RAT}.understood`)), "Rat-step", "Your own Rat-step record retains its original observation route. Understanding differs from ownership at proficiency two and execution at six with Agility eight; slow and active practice keep that same owner."],
        ["step", step, "Load-bearing Step", "Your existing Load-bearing Step retains its teaching or demonstrated-imprint origin. Its paid lesson and one-stamina application remain the only existing route from mastery one to two; focus and drive remain separately learned fuel." ]]
        .map(([id, requires, label, text]) => command({id: `original_frontier.review_${id}_source`, label: `Review the actual ${label} learning source`, once: true,
            visibleWhen: all(actor("mastery.question"), id === "rat" ? eq(`technique.${RAT}.observed`) : eq(`power.${STEP}.owned`)), requires: all(actor("mastery.question"), requires), effects: [af(`mastery.${id}SourceReviewed`), know(`mastery.${id}_source`, text, "player", "understood")],
            description: "Record what the real existing source supports. This review grants no method, ownership, proficiency, mastery, inheritance or duplicate training reward."})),
    command({id: "original_frontier.learn_ordinary_stance", label: "Learn the ordinary frame stance · 1 coin + 3 min", targetId: MIRA, coLocated: true, participants: ["$target"], once: true,
        duration: 3, cancellation: "refund", visibleWhen: actor("mastery.question"), requires: all(actor("mastery.question"), living, healthy, hands, homeConsent),
        ...guarded(all(living, healthy, hands, homeConsent), true), costs: [money(-1), stamina(-1, "$target")],
        effects: [af("mastery.ordinaryLearned"), {type: "unlock", kind: "skill", id: "Equilibrium"},
            know("mastery.ordinary_source", "Mira's performed ordinary stance lesson taught where to place a supported frame and when to release it. Its ordinary body and tool requirements remain part of the learned instruction.", MIRA, "understood")],
        description: "One-coin instruction is a declared service sink; Mira spends her own stamina and reserved time. Unlock native Equilibrium before later practice awards its native XP. Cancellation teaches nothing."}),
    command({id: "original_frontier.practice_ordinary_stance", label: "Practice the taught stance · 4 min + 2 stamina", duration: 4, cancellation: "refund", automatable: true,
        visibleWhen: actor("mastery.ordinaryLearned"), requires: all(actor("mastery.ordinaryLearned"), living, healthy, hands, lte("native.skill.Equilibrium.level", 1, "This ordinary introduction stops at native Equilibrium two.")),
        costs: [stamina(-2)], effects: [xp("Equilibrium", 8)], description: "Train the existing native competence to the stated stop target. No simulation mastery bar, power, cargo output or source copy is created."}),
    ...[["rat", all(actor("mastery.ratSourceReviewed"), rat, hands, light)], ["step", all(actor("mastery.stepSourceReviewed"), driveStep)],
        ["ordinary", all(actor("mastery.ordinaryLearned"), hands, gte("native.skill.Equilibrium.level", 2))]]
        .map(([id, requires]) => command({id: `original_frontier.check_${id}_readiness`, label: `Check the existing ${id === "rat" ? "Rat-step execution" : id === "step" ? "mastered loaded application" : "ordinary stance training"}`, once: true,
            visibleWhen: all(actor("mastery.question"), id === "rat" ? eq(`technique.${RAT}.observed`) : id === "step" ? eq(`power.${STEP}.owned`) : actor("mastery.ordinaryLearned")), requires: all(living, healthy, requires),
            effects: [af(`mastery.${id}Ready`), know(`mastery.${id}_readiness`, "The actual existing body, learned instruction and execution gates support this declared trial now. This readiness check grants no training or new feat; temporary tool, source, fuel or body loss still blocks later execution.", "player", "understood")]}))
];

const footingTrials = [
    ["rat", 6, [stamina(-2)], all(actor("mastery.ratReady"), rat, hands, light), [], "Your owned Rat-step moved your unloaded body over the new offset footing course. The carried-log/kit boundary and actual Agility mattered; no cargo or another person was moved."],
    ["rope", 8, [stamina(-3), item(ROPE, -1)], all(actor("mastery.ordinaryReady"), ropeSkill, light), [item(ROPE, 1)], "Your actual rope and slower ordinary footing worked over the new offset course. The rope returned intact; the body moved without logs or kits."]
].map(([id, duration, costs, requires, returned, text]) => command({id: `original_frontier.footing_${id}`, label: `Try the new offset footing with ${id === "rat" ? "Rat-step" : "ordinary rope work"} · ${duration} min`, duration, cancellation: "refund", siteId: fieldSite,
    once: true, claim: "original_frontier.mastery.footing", visibleWhen: all(actor("mastery.question"), ...(id === "rat" ? [eq(`technique.${RAT}.observed`)] : [])), requires: all(living, healthy, requires), ...guarded(all(living, healthy, requires)), costs,
    effects: [...returned, af("mastery.footingApplied"), af("mastery.footingMethod", id), af("mastery.application"), know("mastery.footing_application", text)],
    description: `${text} This is a new performed application, without the old crossing payout, survey flag or technique proficiency reward.`}));
const frameTrials = [
    ["ordinary", 6, [stamina(-3), stamina(-2, "$target")], all(actor("mastery.ordinaryReady"), hands), [], "The two actual supporters used a slower ordinary stance for one real log in the kit-frame."],
    ["focus", 4, [stamina(-1), stamina(-1, "$target"), energy(FOCUS, 1, 2)], all(actor("mastery.stepReady"), step), [{powerId: STEP, output: 1}], "Your learned Step supplied one output with two control from actual measured focus while Mira remained the willing stopping supporter."]
].map(([id, duration, costs, requires, extra, text]) => command({id: `original_frontier.frame_${id}`, label: `Try the actual one-log frame with ${id === "focus" ? "precise focus" : "ordinary supporters"} · ${duration} min`,
    targetId: MIRA, coLocated: true, participants: ["$target"], siteId: homeSite, duration, cancellation: "refund", once: true, claim: "original_frontier.mastery.frame",
    visibleWhen: all(actor("mastery.question"), ...(id === "focus" ? [eq(`power.${STEP}.owned`), eq(`energy.${FOCUS}.known`)] : [])), requires: all(living, healthy, homeConsent, requires), ...guarded(all(living, healthy, homeConsent, requires), true), ...(extra[0] || {}),
    costs: [...costs, item(LOG, -1), item(KIT, -1)], effects: [item(LOG, 1), item(KIT, 1), af("mastery.frameApplied"), af("mastery.frameMethod", id), af("mastery.application"),
        know("mastery.frame_application", `${text} The log and kit were held actual stock and returned intact. This new task repeats no loose-bank, road or native quest reward.`)],
    description: "Reserve the actual participant, body effort, kit and log. Cancellation or failed continuing support refunds reserved means; no source, fuel or frame output is supplied from memory."}));

const feats = [
    command({id: "original_frontier.feat_mastered_footing", label: "Perform reliable mastered footing · 3 min + 1 stamina", once: true, claim: "original_frontier.mastery.feat", siteId: fieldSite, duration: 3, cancellation: "refund",
        visibleWhen: all(actor("mastery.footingApplied"), eq(`technique.${RAT}.observed`)), requires: all(actor("mastery.footingApplied"), living, healthy, masteredRat, hands, light),
        ...guarded(all(living, healthy, masteredRat, hands, light)), costs: [stamina(-1)], effects: [af("mastery.feat"), af("mastery.featKind", "footing"), af("mastery.featMethod", "mastered_rat"),
            know("mastery.feat", "Performed new mature footing: Rat-step twelve, owned execution and actual Agility made the unloaded offset course reliable in three minutes for one stamina. Its boundary remains your body without the declared logs/kit cargo; old readiness alone did not perform this feat.", "player", "understood")],
        description: "Existing Rat-step twelve removes this declared footing bottleneck. No random rare-source gate, old guide payout, mirrored mastery or general combat immunity is awarded."}),
    command({id: "original_frontier.feat_ordinary_footing", label: "Perform a reliable ordinary rope course · 8 min + 3 stamina", once: true, claim: "original_frontier.mastery.feat", siteId: fieldSite, duration: 8, cancellation: "refund",
        visibleWhen: actor("mastery.footingApplied"), requires: all(actor("mastery.footingApplied"), actor("mastery.ordinaryReady"), living, healthy, ropeSkill, light),
        ...guarded(all(living, healthy, ropeSkill, light)), costs: [stamina(-3), item(ROPE, -1)], effects: [item(ROPE, 1), af("mastery.feat"), af("mastery.featKind", "footing"), af("mastery.featMethod", "ordinary_rope"),
            know("mastery.feat", "Performed reliable ordinary footing with the real rope and native Climbing. The slower eight-minute, three-stamina method retains its actual tool/body cost; it grants no Rat-step ownership or proficiency.", "player", "understood")]}),
    ...[["drive", 4, [stamina(-1), stamina(-1, "$target"), energy(DRIVE, 3, 1)], driveStep, {powerId: STEP, output: 3}, "Mastered Load-bearing Step supplied three actual drive output with one control. Mira remained the willing release supporter; precision-only focus could not supply this declared three-log output."],
        ["ordinary", 8, [stamina(-3), stamina(-3, "$target")], all(actor("mastery.ordinaryReady"), hands), {}, "Two real ordinary supporters divided the three-log load. This slower plan spent both bodies' stamina and needed no extraordinary method or invented output."]]
        .map(([id, duration, costs, requires, extra, text]) => command({id: `original_frontier.feat_${id}_frame`, label: `Perform the three-log frame feat with ${id === "drive" ? "drive" : "ordinary supporters"} · ${duration} min`,
            targetId: MIRA, coLocated: true, participants: ["$target"], siteId: homeSite, duration, cancellation: "refund", once: true, claim: "original_frontier.mastery.feat",
            visibleWhen: all(actor("mastery.frameApplied"), ...(id === "drive" ? [eq(`power.${STEP}.owned`), eq(`energy.${DRIVE}.known`)] : [])), requires: all(actor("mastery.frameApplied"), living, healthy, homeConsent, requires), ...guarded(all(living, healthy, homeConsent, requires), true), ...extra,
            costs: [...costs, item(LOG, -3), item(KIT, -1)], effects: [item(LOG, 3), item(KIT, 1), af("mastery.feat"), af("mastery.featKind", "frame"), af("mastery.featMethod", id),
                know("mastery.feat", `${text} The three real logs and kit were held and returned. Performing this harder task, rather than reviewing an old loose-bank response, earned the new mature receipt.`, "player", "understood")],
            description: "One new compatible feat opens its actual limitation test and later useful practice. All held stock returns intact; failed support/cancellation returns means without awarding the feat."}))
];

const insightEffects = (kind, text) => [af("mastery.limitation"), af("mastery.insight"), af("mastery.insightKind", kind),
    {type: "source", sourceId: kind === "footing" ? "original_frontier.unloaded_retreat" : "original_frontier.frame_planning", operation: "grant", origin: "trained", awakened: true, active: true},
    know("mastery.limitation", text), know("mastery.insight", kind === "footing" ? "The performed personal success and loaded abort support a bounded retreat practice: leave the declared cargo, cross as one body, and stop before moving a frame. This improves only the new compatible local practice."
        : "The performed frame success and safe limitation test support a divided-frame practice: force and precision solve different demands, and a second ordinary supporter can supply the missing body contribution. No new power, fuel, copied NPC method or universal cargo capacity was learned.", "player", "understood")];
const insights = [
    command({id: "original_frontier.test_loaded_limit", label: "Test the carried-frame limit and abort safely · 2 min + 1 stamina", once: true, claim: "original_frontier.mastery.insight", duration: 2, cancellation: "refund", siteId: fieldSite,
        visibleWhen: all(feat, actor("mastery.featKind", "footing")), requires: all(feat, actor("mastery.featKind", "footing"), living, healthy, hands), ...guarded(all(living, healthy, hands)),
        costs: [stamina(-1), item(LOG, -1), item(KIT, -1)], effects: [item(LOG, 1), item(KIT, 1), ...insightEffects("footing", "Actual loaded limitation test: you set a real log in the real kit-frame, measured the mismatch with the personal course, and stopped before stepping. The stock stayed held and returned intact. The earlier unloaded success remains true; the personal movement method and rope acquired no cargo capacity.")],
        description: "Safely observe the incompatible condition instead of executing a forbidden loaded Rat-step. No fainting, native defeat or destroyed cargo is required. Insight depends on your earlier actual feat."}),
    command({id: "original_frontier.test_precision_limit", label: "Test precision against the force demand · 2 min + 2 focus units", targetId: MIRA, coLocated: true, participants: ["$target"], once: true,
        claim: "original_frontier.mastery.insight", duration: 2, cancellation: "refund", siteId: homeSite,
        visibleWhen: all(feat, actor("mastery.featKind", "frame"), eq(`power.${STEP}.owned`), eq(`energy.${FOCUS}.known`)), requires: all(feat, actor("mastery.featKind", "frame"), living, healthy, step, homeConsent),
        ...guarded(all(living, healthy, step, homeConsent), true), costs: [energy(FOCUS, 1, 2), stamina(-1, "$target"), item(LOG, -3), item(KIT, -1)],
        effects: [item(LOG, 3), item(KIT, 1), ...insightEffects("frame", "Actual precision limitation test: one-output/two-control measured focus steadied the real three-log frame but could not lift its declared three-output load. Mira supported the safe release; actual fuel and her stamina were spent, and the held stock returned. More control did not manufacture force.")],
        description: "Spend actual measured focus on a safe one-output test, then release the stopped frame. This teaches a specific limit without awarding drive mastery or pretending that precision met the three-output demand."}),
    command({id: "original_frontier.test_single_support_limit", label: "Measure the missing supporter and release · 3 min", targetId: MIRA, coLocated: true, participants: ["$target"], once: true,
        claim: "original_frontier.mastery.insight", duration: 3, cancellation: "refund", siteId: homeSite,
        visibleWhen: all(feat, actor("mastery.featKind", "frame")), requires: all(feat, actor("mastery.featKind", "frame"), living, healthy, hands, homeConsent),
        ...guarded(all(living, healthy, hands, homeConsent), true), costs: [stamina(-1), stamina(-1, "$target"), item(LOG, -3), item(KIT, -1)],
        effects: [item(LOG, 3), item(KIT, 1), ...insightEffects("frame", "Actual ordinary limitation test: with the real three-log frame stopped, you measured the unsupported side before asking Mira to take it. You both safely released it and retained the stock. The earlier two-person success supports a divided-load procedure; one unsupported body was never claimed to lift the frame.")],
        description: "The ordinary limitation route uses real bodies and stock without demanding a rare power or energy pool. It awards no extraordinary ownership or mirrored mastery."}),
    command({id: "original_frontier.keep_mastery_practice", label: "Keep the bounded personal practice and close teaching", once: true, visibleWhen: actor("mastery.insight"), requires: actor("mastery.insight"),
        effects: [af("mastery.teachingClosed"), know("mastery.personal_choice", "You kept the bounded personal practice. No resident was taught an executable method, no source was copied and no ongoing teaching duty was accepted.")],
        description: "A mature personal result remains valid. A later separately agreed ordinary teaching job may use this known insight; this choice teaches nobody automatically."}),
    command({id: "original_frontier.practice_bounded_retreat", label: "Use the bounded retreat practice · 4 min + 1 stamina", duration: 4, cancellation: "refund", automatable: true, siteId: fieldSite,
        visibleWhen: all(actor("mastery.insight"), actor("mastery.insightKind", "footing")), requires: all(living, healthy, hands, light, eq("faculty.original_frontier.unloaded_retreat.active"),
            any(all(masteredRat, actor("mastery.featMethod", "mastered_rat")), all(ropeSkill, actor("mastery.featMethod", "ordinary_rope"), gte(`item.${ROPE}`, 1))),
            lte("native.skill.Climbing.level", 5, "This bounded personal practice stops at native Climbing six.")),
        ...guarded(all(living, healthy, hands, light, eq("faculty.original_frontier.unloaded_retreat.active"),
            any(all(masteredRat, actor("mastery.featMethod", "mastered_rat")), all(ropeSkill, actor("mastery.featMethod", "ordinary_rope"), gte(`item.${ROPE}`, 1))))), costs: [stamina(-1)], effects: [xp("Climbing", 4)],
        description: "The performed insight unlocks a cheaper, stopped personal course: four minutes, one stamina and four native Climbing XP. The ordinary method still requires its real rope; neither method carries the declared logs or kit cargo."}),
    command({id: "original_frontier.practice_divided_frame", label: "Use the divided-frame procedure · 5 min", targetId: MIRA, coLocated: true, participants: ["$target"], siteId: homeSite,
        duration: 5, cancellation: "refund", automatable: true, visibleWhen: all(actor("mastery.insight"), actor("mastery.insightKind", "frame")),
        requires: all(living, healthy, hands, homeConsent, eq("faculty.original_frontier.frame_planning.active"), lte("native.skill.Equilibrium.level", 5, "This known frame practice stops at native Equilibrium six.")),
        ...guarded(all(living, healthy, hands, homeConsent, eq("faculty.original_frontier.frame_planning.active")), true),
        costs: [stamina(-2), stamina(-2, "$target"), item(LOG, -3), item(KIT, -1)], effects: [item(LOG, 3), item(KIT, 1), xp("Equilibrium", 6)],
        description: "Known divided staging reduces the earlier ordinary eight-minute/three-stamina-per-person plan to five minutes/two stamina per person. It still reserves Mira and actual three-log/kit stock. Six native Equilibrium XP train the existing skill; no wage, feat or insight repeats."})
];

export const originalFrontierFieldDefinitions = {
    people: places.map(p => ({id: p.worker, revision: 1, label: `${p.name}, ${p.key === "forest" ? "road" : "entrance"} observer`, worldId: WORLD, location: p.location,
        inventory: "simulation", provision: false, resources: {coins: 4, fieldAttention: 2}, body: {hands: 2}, vitals: {health: 16, max_health: 16, stamina: 8, max_stamina: 8}})),
    sites: [{id: fieldSite, revision: 1, label: "Village stopped-footing course", capacity: 1}, {id: homeSite, revision: 1, label: "Village bounded frame trial", capacity: 1},
        ...places.map(p => ({id: p.site, revision: 1, label: `${p.location} observation staging patch`, capacity: 1}))],
    // Existing methods keep their exact source/power/native XP owners.
    powers: [],
    encounters: [{id: "original_frontier.observation_frame", revision: 1, label: "Consented observation-frame shove", lethal: false,
        turns: [{cue: "The observer gives the actual kit-frame one agreed shove, beside its stopping marker. Keep it with your available body and learned means, or release it safely.", responses: frameResponses}],
        settlement: [know("control.frame_end", "The local frame assessment ended. Its chosen hold/release and spent means remain; a paid observation workday still requires a separate funded agreement.")]}],
    commands: [...questions, ...preparation, ...comparisons, ...returns, ...workQuestions, ...encounterAcceptance, ...workdays, ...recovery, ...assessments,
        command({id: "original_frontier.withdraw_encounter", label: "Withdraw this accepted encounter contribution", location: undefined,
            visibleWhen: actor("control.encounterAccepted"), requires: actor("control.encounterAccepted"),
            effects: [af("control.encounterAccepted", false), af("control.encounterReady", false), know("control.encounter_withdrawn", "You withdrew this contribution attempt. Native wounds, spent stamina, loot and earlier victories keep their native owners; the smaller safe-parent offer remains possible.")],
            description: "Cancel the agreement after leaving active native combat through its own controls. The host retires its current baseline/receipt; it heals nobody and refunds no native fight."}),
        ...masteryIntroduction, ...footingTrials, ...frameTrials, ...feats, ...insights],
    controllers: [{id: "original_frontier.dossier_trial_controller", revision: 1, label: "Mira's one funded dossier trial", actorId: MIRA, interval: 1,
        actions: [{commandId: "original_frontier.resident_dossier_trial", priority: 1}]}]
};
