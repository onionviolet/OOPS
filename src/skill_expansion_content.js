// Original reversible Frontier prototypes. Native XP, method mastery, stock,
// knowledge, jobs and publication remain owned by the existing shared services.
export const SKILL_IDS = Object.freeze({
    brace: "frontier.brace_control",
    trail: "frontier.trail_reading",
    timber: "frontier.timber_judgment",
    inquiry: "frontier.shared_inquiry"
});
const WORLD = "base.frontier", LIO = "partyPartner", TEACHER = "oldCraftsman";
const LOG = JSON.stringify({id: "Rough wood log"});
const KIT = JSON.stringify({id: "Prepared survey kit"});
const eq = (fact, value = true, reason) => ({fact, op: "eq", value, ...(reason ? {reason} : {})});
const atLeast = (fact, value, reason) => ({fact, op: "gte", value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const any = (...rules) => ({any: rules});
const seen = id => eq(`knowledge.${id}.seen`);
const owned = id => eq(`power.${id}.owned`);
const mastery = (id, amount) => atLeast(`power.${id}.mastery`, amount, `Practice this method to mastery ${amount}.`);
// Existing knowledge attribution requires an actual causal-situation instance.
// These ordinary lessons instead retain their command/target and source cause.
const knowledge = (id, stage, value, teacher) => ({type: "knowledge", key: id, stage,
    value: teacher ? `${value} Instruction/report source: ${teacher === LIO ? "Lio" : "the old craftsman"}.` : value});
const af = (key, value = true) => ({type: "fact", scope: "actor", key, value});
const money = amount => ({type: "resource", native: true, key: "money", amount});
const stamina = (amount, actor) => ({type: "vital", key: "stamina", amount, ...(actor ? {actor} : {})});
const item = (key, amount) => ({type: "item", key, amount});
const xp = (skill, amount) => ({type: "xp", skill, amount});
const refine = (id, amount = 1) => ({type: "power", powerId: id, operation: "refine", amount});
const learn = (id, teacher) => [
    {type: "power", powerId: id, operation: "learn"},
    {type: "source", sourceId: id, operation: "grant", origin: "trained", awakened: true, active: true},
    {type: "unlock", kind: "skill", id: SKILL_CATALOGUE.find(s => s.id === id).xpSkill},
    knowledge(`${id}.method`, "understood", "A completed lesson taught the method. Practice develops control; seeing the demonstration alone did not teach it.", teacher)
];
const command = d => ({revision: 1, worldId: WORLD, group: "skills", actorId: "player", location: "Village", costs: [], effects: [], ...d});
const living = eq("actor.life", "alive", "Recover before doing this work.");
const hands = eq("body.handsTender", false, "Rest your hands before this work.");
const evidence = eq("campaign.anchor", true, "Inspect the crossing to obtain real ground evidence.");
const teacherReady = all(eq("village.craftsmanMet"), eq("village.craftsmanPresent"),
    eq("village.teacherHours", true, "He teaches between 08:00 and 18:00."),
    eq("village.craftsmanBusy", false, "Wait for his accepted bench work to finish."),
    eq("village.craftsmanIrritated", false, "Let the earlier exchange settle first."));
const fee = amount => [money(-amount)];
const costTerms = costs => costs.map(c => c.type === "item" ? `${-c.amount} Rough wood log` : c.native ? `${-c.amount} wooden coin${c.amount < -1 ? "s" : ""}`
    : c.key === "focus" ? `${-c.amount} craftsman attention` : `${-c.amount} ${c.actor === "$target" ? "Lio " : "player "}${c.key}`).join(", ");

export const SKILL_CATALOGUE = Object.freeze([
    {id: SKILL_IDS.brace, label: "Brace control", description: "Turn a consenting partner's press through a trained frame instead of absorbing it.",
        knowledgeKey: SKILL_IDS.brace, powerId: SKILL_IDS.brace, xpSkill: "Equilibrium", discoverCommandId: "skills.brace.observe",
        learnCommandId: "skills.brace.learn", practiceCommandIds: ["skills.brace.practice"], useCommandIds: ["skills.brace.contest"],
        recoveryIds: ["party.rest"],
        milestones: [{at: 2, label: "Controlled brace: avoid the press's health loss"}, {at: 4, label: "Counterpressure: use one less stamina and tire the partner"}]},
    {id: SKILL_IDS.trail, label: "Trail reading", description: "Compare drainage cuts and ground traces with your inspected crossing.",
        knowledgeKey: SKILL_IDS.trail, powerId: SKILL_IDS.trail, xpSkill: "Perception", discoverCommandId: "skills.trail.observe",
        learnCommandId: "skills.trail.learn", practiceCommandIds: ["skills.trail.practice"], useCommandIds: ["skills.trail.route"],
        recoveryIds: [],
        milestones: [{at: 2, label: "Trace the dry bank: enable the existing kit-free route and route-board procedure"}]},
    {id: SKILL_IDS.timber, label: "Timber judgment", description: "Read grain and distribute sound cuts across usable marker stock.",
        knowledgeKey: SKILL_IDS.timber, powerId: SKILL_IDS.timber, xpSkill: "Woodworking", discoverCommandId: "skills.timber.observe",
        learnCommandId: "skills.timber.learn", practiceCommandIds: ["skills.timber.practice", "skills.timber.coached_practice"], useCommandIds: ["skills.timber.pack", "skills.timber.precise_pack"],
        recoveryIds: ["skills.inquiry.recover_attention"],
        milestones: [{at: 2, label: "Matched cuts: make two real kits from the two-log batch"}]},
    {id: SKILL_IDS.inquiry, label: "Shared inquiry", description: "Combine your field evidence with another person's agreed and paid attention.",
        knowledgeKey: SKILL_IDS.inquiry, powerId: SKILL_IDS.inquiry, xpSkill: "Perception", discoverCommandId: "skills.inquiry.observe",
        learnCommandId: "skills.inquiry.learn", practiceCommandIds: ["skills.inquiry.practice"], useCommandIds: ["skills.inquiry.compare", "skills.inquiry.road_report"],
        recoveryIds: ["skills.inquiry.recover_attention"],
        milestones: [{at: 1, label: "Joint comparison: learn the drainage procedure"}, {at: 2, label: "Agreed report: obtain current workshop and road observations"}]}
]);
// The Engine's actual discovery host consumes this earlier metadata name for
// recovery IDs. It aliases the same catalogue instead of creating another list.
export const skillFamilyDefinitions = SKILL_CATALOGUE;

export const skillSources = SKILL_CATALOGUE.map(s => ({id: s.id, revision: 1, label: s.label,
    kind: "knowledge", grants: [], bioDetail: "An earned learned method; it supplies no donor anatomy, energy pool, tools or authority."}));

const discoveryCommands = [
    command({id: "skills.brace.observe", skillId: SKILL_IDS.brace, label: "Watch Lio's offered frame demonstration · 1 min", once: true,
        targetId: LIO, coLocated: true, participants: ["$target"], duration: 1, cancellation: "forfeit",
        visibleWhen: all(eq("actor.party.met"), eq(`knowledge.${SKILL_IDS.brace}.seen`, false)),
        requires: all(living, eq("skills.lioSupported", true, "Lio needs his willing, present body, trained control and owned harness.")),
        description: "Lio agrees to spend one of his stamina on this one-minute demonstration. You pay no fee and learn no executable method yet.",
        costs: [stamina(-1, "$target")], effects: [knowledge(SKILL_IDS.brace, "seen", "Lio demonstrates how a braced frame receives a controlled press. He offers a lesson; watching grants no method.", LIO)]}),
    command({id: "skills.trail.observe", skillId: SKILL_IDS.trail, label: "Compare the ground traces beside the crossing · 2 min", once: true,
        duration: 2, cancellation: "forfeit", visibleWhen: all(evidence, eq(`knowledge.${SKILL_IDS.trail}.seen`, false)),
        requires: living, costs: [stamina(-1)],
        description: "Two played minutes and one player stamina compare the inspected ground. Completion reveals the offered method, not a hidden person's position.",
        effects: [knowledge(SKILL_IDS.trail, "seen", "Repeated drainage cuts remain while surface footprints wash out. They are evidence for this crossing, not a view of anyone's hidden position.")]}),
    command({id: "skills.timber.observe", skillId: SKILL_IDS.timber, label: "Show the craftsman a log's grain · 1 min", once: true,
        targetId: TEACHER, coLocated: true, participants: ["$target"], duration: 1, cancellation: "forfeit",
        visibleWhen: all(eq("village.craftsmanMet"), eq(`knowledge.${SKILL_IDS.timber}.seen`, false)),
        requires: all(living, teacherReady, atLeast(`item.${LOG}`, 1, "Carry an actual Rough wood log to inspect; this step consumes none.")),
        description: "Carry one Rough wood log for a one-minute inspection with the craftsman. It consumes no log or coin and grants no learned cutting method.",
        effects: [knowledge(SKILL_IDS.timber, "seen", "The craftsman points out grain and knots in the log you supplied for inspection. Instruction and practice can improve a real kit batch.", TEACHER)]}),
    command({id: "skills.inquiry.observe", skillId: SKILL_IDS.inquiry, label: "Ask how field evidence can be compared together · 1 min", once: true,
        targetId: TEACHER, coLocated: true, participants: ["$target"], duration: 1, cancellation: "forfeit",
        visibleWhen: all(eq("village.craftsmanMet"), evidence, eq(`knowledge.${SKILL_IDS.inquiry}.seen`, false)),
        requires: all(living, teacherReady),
        effects: [knowledge(SKILL_IDS.inquiry, "seen", "The craftsman offers a method for comparing your crossing observations with his survey practice. Each real joint task needs his free attention and agreed payment.", TEACHER)]})
];
const lesson = (kind, id, teacher, costs, requirements, duration = 3) => command({id: `skills.${kind}.learn`, skillId: id,
    label: `Learn ${SKILL_CATALOGUE.find(s => s.id === id).label} · ${duration} min`, once: true, duration, cancellation: "refund",
    ...(teacher ? {targetId: teacher, coLocated: true, participants: ["$target"]} : {}),
    ...(kind === "timber" ? {siteId: "village.workbench"} : {}),
    visibleWhen: all(seen(id), eq(`power.${id}.owned`, false)), requires: all(living, ...requirements), costs,
    description: `Costs: ${costTerms(costs)}. Reserve the actual participant for ${duration} played minutes. Cancellation refunds the costs and teaches nothing; elapsed time remains spent. Completion retains the learned method/source and unlocks its native competence before later XP work.`,
    effects: learn(id, teacher)});
const lessons = [
    lesson("brace", SKILL_IDS.brace, LIO, [...fee(2), stamina(-1, "$target")],
        [eq("skills.lioSupported"), hands, atLeast("strength", 8, "This human-frame lesson needs Strength 8.")]),
    lesson("trail", SKILL_IDS.trail, null, [stamina(-2)], [evidence], 4),
    lesson("timber", SKILL_IDS.timber, TEACHER, [...fee(1), item(LOG, -1), {type: "resource", actor: "$target", key: "focus", amount: -1}], [teacherReady, hands, eq("world.workbench.wet", false, "Use a dry bench for the cutting lesson.")]),
    lesson("inquiry", SKILL_IDS.inquiry, TEACHER, [...fee(2), {type: "resource", actor: "$target", key: "focus", amount: -1}], [teacherReady, evidence])
];
const practice = (kind, id, xpSkill, extraCosts = [], requirements = []) => command({id: `skills.${kind}.practice`, skillId: id,
    label: `Practice ${SKILL_CATALOGUE.find(s => s.id === id).label} slowly · 4 min`, powerId: id, duration: 4,
    cancellation: "forfeit", automatable: true, visibleWhen: owned(id),
    ...(kind === "timber" ? {siteId: "village.workbench"} : {}),
    requires: all(living, {fact: `power.${id}.mastery`, op: "lte", value: 3, reason: "This prototype drill is complete at mastery four."}, ...requirements),
    costs: [stamina(-2), ...extraCosts], effects: [refine(id), xp(xpSkill, 8)],
    description: `Costs: ${costTerms([stamina(-2), ...extraCosts])}. Four played minutes earn one method mastery and eight native competence XP on completion. Cancel with spent inputs retained and no reward. Automation stops at the drill limit or missing means.`});
// Feedback is a means (SLR6, SLC7): the teacher's attention during practice
// makes the same drill teach more. It does not raise the drill limit or grant
// mastery without the practice (SLR14).
const coached = (kind, id, xpSkill, teacher, extraCosts = [], requirements = []) => {
    const costs = [stamina(-2), ...fee(1), {type: "resource", actor: "$target", key: "focus", amount: -1}, ...extraCosts];
    return command({id: `skills.${kind}.coached_practice`, skillId: id,
        label: `Practice ${SKILL_CATALOGUE.find(s => s.id === id).label} with his corrections · 4 min`, powerId: id, duration: 4,
        targetId: teacher, coLocated: true, participants: ["$target"], cancellation: "refund", automatable: true, visibleWhen: owned(id),
        ...(kind === "timber" ? {siteId: "village.workbench"} : {}),
        requires: all(living, teacherReady, {fact: `power.${id}.mastery`, op: "lte", value: 2, reason: "Coached corrections fit this drill while mastery is two or below; slow practice finishes it at four."}, ...requirements),
        costs, effects: [refine(id, 2), xp(xpSkill, 8)],
        description: `Costs: ${costTerms(costs)}. The craftsman watches and corrects each cut, so four played minutes earn two method mastery instead of one, plus eight native competence XP. Cancellation refunds the costs and teaches nothing. Automation stops when his attention, the drill limit or other means run out.`});
};
const practices = [
    practice("brace", SKILL_IDS.brace, "Equilibrium", [], [hands, atLeast("strength", 8)]),
    practice("trail", SKILL_IDS.trail, "Perception", [], [evidence]),
    practice("timber", SKILL_IDS.timber, "Woodworking", [item(LOG, -1)], [hands, eq("world.workbench.wet", false, "Use a dry bench for material practice.")]),
    practice("inquiry", SKILL_IDS.inquiry, "Perception", [], [evidence]),
    coached("timber", SKILL_IDS.timber, "Woodworking", TEACHER, [item(LOG, -1)], [hands, eq("world.workbench.wet", false, "Use a dry bench for material practice.")])
];

// SLL11: repetition of the method (drills, coached drills and real cuts all
// count through the power's executions) shortens cutting from 3 toward 1 min.
const CUTTING_FLUENCY = Object.freeze({floor: 1, halfAt: 20});
const pressSupported = all(living, eq("actor.world", WORLD), eq("location", "Village"),
    eq("skills.lioSupported", true, "Lio's consent, body, trained control and owned harness must still support this press."));
const braceResponses = [
    {id: "yield", label: "Yield and end the press safely", effects: [af("skills.brace.result", "yielded")]},
    {id: "hold", label: "Absorb the press · 4 stamina + 1 HP", requires: all(pressSupported, atLeast("vital.health", 2, "Recover first; this press stops above zero HP.")),
        costs: [stamina(-4), {type: "vital", key: "health", amount: -1}], effects: [af("skills.brace.result", "absorbed"), xp("Equilibrium", 4)]},
    {id: "brace", label: "Turn the press through the learned frame · 2 stamina", requires: all(pressSupported, owned(SKILL_IDS.brace), mastery(SKILL_IDS.brace, 2),
        eq(`faculty.${SKILL_IDS.brace}.active`), hands, atLeast("strength", 8)),
        costs: [stamina(-2)], effects: [af("skills.brace.result", "controlled"), xp("Equilibrium", 8)]},
    {id: "counterpressure", label: "Redirect the press · 1 stamina; Lio spends 1 more", requires: all(pressSupported, owned(SKILL_IDS.brace), mastery(SKILL_IDS.brace, 4),
        eq(`faculty.${SKILL_IDS.brace}.active`), hands, atLeast("strength", 8)),
        costs: [stamina(-1), stamina(-1, "$target")], effects: [af("skills.brace.result", "redirected"), xp("Equilibrium", 8)]}
];

export const skillDefinitions = {
    powers: SKILL_CATALOGUE.map(s => ({id: s.id, revision: 1, label: s.label, model: "practice", capacity: 1,
        worlds: [WORLD], execution: all(living, eq(`faculty.${s.id}.active`, true, "Restore this acquired learned source before using it."))})),
    encounters: [{id: "skills.brace.press", revision: 1, label: "Lio's agreed frame press", lethal: false,
        turns: [{cue: "Lio presses the agreed frame once. Yield, absorb it, or use your earned control. This is a consenting demonstration, not a victory over an unwilling fighter.", responses: braceResponses}],
        settlement: [knowledge("skills.brace.last_exchange", "seen", "The agreed press ended. Actual fatigue, health and chosen control remain recorded; no coins, items or powers were awarded.", LIO)]}],
    commands: [...discoveryCommands, ...lessons, ...practices,
        command({id: "skills.brace.contest", skillId: SKILL_IDS.brace, label: "Arrange Lio's nonlethal frame press", targetId: LIO,
            coLocated: true, participants: ["$target"], encounterId: "skills.brace.press", visibleWhen: seen(SKILL_IDS.brace),
            requires: all(living, eq("skills.lioSupported"), atLeast("vital.health", 2, "Recover before the press.")), costs: [stamina(-2, "$target")],
            description: "Lio spends two of his own stamina to start. Yield remains free. Mastery two enables a brace that avoids health loss; mastery four redirects pressure with less player fatigue. Withdrawal retains spent inputs."}),
        command({id: "skills.trail.route", skillId: SKILL_IDS.trail, label: "Trace the usable dry-bank route · 3 min", powerId: SKILL_IDS.trail,
            duration: 3, cancellation: "forfeit", visibleWhen: owned(SKILL_IDS.trail),
            requires: all(evidence, mastery(SKILL_IDS.trail, 2), eq("skills.routeKnown", false, "You already understand this drainage route.")),
            costs: [stamina(-2)], effects: [af("village.routeKnown"), af("village.routeOrigin", "field"), xp("Perception", 6),
                knowledge("skills.trail.route", "understood", "Your inspected drainage cuts identify the dry-bank procedure. Use the existing dry-bank survey to guide the crossing; the ground itself remains unrepaired.")],
            description: "Costs two player stamina and three played minutes. Use real inspected ground to learn the drainage procedure. The existing dry-bank survey and route-board craft use it after ordinary waypost discovery; their survey reward and departure remain theirs."}),
        command({id: "skills.timber.pack", skillId: SKILL_IDS.timber, label: "Cut a cautious marker batch · 2 logs + 1 coin", powerId: SKILL_IDS.timber,
            siteId: "village.workbench", duration: 3, fluency: CUTTING_FLUENCY, cancellation: "refund", automatable: true, visibleWhen: owned(SKILL_IDS.timber),
            requires: all(hands, eq("world.workbench.wet", false, "Use the established dry bench and cutting tools.")),
            costs: [item(LOG, -2), money(-1)], effects: [item(KIT, 1), xp("Woodworking", 6)],
            description: "The ordinary learned cut makes one real Prepared survey kit. Every use of the method makes cutting faster, from three played minutes toward one. Cancelling refunds both logs and the coin; preview and cancellation produce no output or XP."}),
        command({id: "skills.timber.precise_pack", skillId: SKILL_IDS.timber, label: "Match sound cuts · 2 logs + 1 coin → 2 kits", powerId: SKILL_IDS.timber,
            siteId: "village.workbench", duration: 3, fluency: CUTTING_FLUENCY, cancellation: "refund", automatable: true, visibleWhen: all(owned(SKILL_IDS.timber), mastery(SKILL_IDS.timber, 2)),
            requires: all(hands, eq("world.workbench.wet", false, "Use the established dry bench and cutting tools.")),
            costs: [item(LOG, -2), money(-1)], effects: [item(KIT, 2), xp("Woodworking", 8)],
            description: "Earned material judgment assigns the useful cuts across two kits. Practiced cutting gets faster with every use of the method. Both are actual native stock for road preparation, supplied work, Lio's rest or delivery. No arbitrary quality roll or new material currency."}),
        command({id: "skills.inquiry.compare", skillId: SKILL_IDS.inquiry, label: "Compare the crossing together · 1 coin + 3 min", powerId: SKILL_IDS.inquiry,
            targetId: TEACHER, coLocated: true, participants: ["$target"], duration: 3, cancellation: "refund", visibleWhen: owned(SKILL_IDS.inquiry),
            requires: all(teacherReady, evidence, mastery(SKILL_IDS.inquiry, 1), eq("skills.routeKnown", false, "You already understand this drainage route.")),
            costs: [...fee(1), {type: "resource", actor: "$target", key: "focus", amount: -1}],
            description: "One wooden coin, one unit of the craftsman's agreed attention and three reserved played minutes combine your inspected crossing with his survey practice. Completion learns the native drainage procedure; cancellation refunds costs and grants no procedure or XP.",
            effects: [af("village.routeKnown"), af("village.routeOrigin", "teacher"), xp("Perception", 6),
                {type: "relationship", target: "$target", axis: "respect", amount: 1, text: "Completed a paid comparison using both real field evidence and agreed attention."},
                knowledge("skills.inquiry.comparison", "understood", "Your crossing observations and the craftsman's survey practice identify the drainage procedure. The native dry-bank survey and route-board craft can use it.", TEACHER)]}),
        command({id: "skills.inquiry.road_report", skillId: SKILL_IDS.inquiry, label: "Request the agreed workshop comparison · 1 coin + 2 min", powerId: SKILL_IDS.inquiry,
            targetId: TEACHER, coLocated: true, participants: ["$target"], duration: 2, cancellation: "refund", visibleWhen: all(owned(SKILL_IDS.inquiry), eq("world.project.field.workshop.started")),
            requires: all(teacherReady, mastery(SKILL_IDS.inquiry, 2)),
            costs: [...fee(1), {type: "resource", actor: "$target", key: "focus", amount: -1}],
            effects: [...["parts", "survey", "assembly"].map(phase => ({type: "observation", scope: "world", key: `project.field.workshop.${phase}`, as: `field.project.${phase}`})),
                {type: "observation", scope: "world", key: "situation.field.road.stage", as: "field.roadKnown"}, xp("Perception", 4)],
            description: "Spend one wooden coin and one unit of the craftsman's actual attention, reserving two played minutes. On completion he reports current workshop contributions and road stage for their existing controls. No private build, position or future outcome is exposed."}),
        command({id: "skills.inquiry.recover_attention", skillId: SKILL_IDS.inquiry, label: "Supply the craftsman's quiet bench break · 1 log + 3 min",
            targetId: TEACHER, coLocated: true, participants: ["$target"], duration: 3, cancellation: "refund",
            visibleWhen: any(seen(SKILL_IDS.inquiry), seen(SKILL_IDS.timber)),
            requires: all(living, teacherReady, eq("skills.teacherNeedsRest", true, "His agreed attention is already restored.")), costs: [item(LOG, -1)],
            effects: [{type: "resource", actor: "$target", key: "focus", amount: 1, capacity: 3}],
            description: "Supplied material and reserved rest restore one unit of actual attention, up to the craftsman's existing three-unit capacity. It grants no player mastery or discovery."})
    ]
};

// Projection only. Missing records remain absent in saves. Engine supplies this
// through its existing context owner before preview, commit and paid job start.
export function skillExpansionFacts(state, context = {}) {
    const actorId = context.actorId || "player", s = state.simulation, a = state.actors?.[actorId];
    const facts = {};
    for(const id of Object.values(SKILL_IDS)) {
        const power = s?.powers?.[actorId]?.[id], source = a?.sources?.[id], faculty = s?.faculties?.[actorId]?.[id];
        const present = !!source && (source.expiresAt == null || source.expiresAt > state.clock);
        facts[`knowledge.${id}.seen`] = !!s?.knowledge?.[actorId]?.[id];
        facts[`power.${id}.owned`] = power?.owned === true;
        facts[`power.${id}.mastery`] = power?.mastery || 0;
        facts[`faculty.${id}.active`] = present && faculty?.active === true && faculty.awakened === true && faculty.suppressed !== true;
    }
    const lio = s?.people?.[LIO], holder = state.actors?.[LIO], support = holder?.sources?.["party.guard_control"];
    const faculty = s?.faculties?.[LIO]?.["party.guard_control"];
    facts["skills.lioSupported"] = !!a?.facts?.["party.met"] && holder?.facts?.["party.willing"] === true &&
        lio?.life === "alive" && lio.location === "Village" && holder.worldId === a.worldId && lio.body?.can_brace === true && lio.vitals?.health > 1 &&
        !!support && (support.expiresAt == null || support.expiresAt > state.clock) && faculty?.active === true && faculty.awakened === true && !faculty.suppressed &&
        (s.owners[LIO]?.[KIT] || 0) > 0 && !Object.values(s.custody).some(c => c.holder === LIO && c.key === KIT);
    facts["skills.routeKnown"] = a?.facts?.["village.routeKnown"] === true || context.facts?.["village.notesRead"] === true;
    const teacherFocus = state.actors?.[TEACHER]?.resources?.focus;
    facts["skills.teacherNeedsRest"] = Number.isFinite(teacherFocus) && teacherFocus >= 0 && teacherFocus < 3;
    return facts;
}
