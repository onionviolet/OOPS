const cue = (id, label, response) => ({id, label, response});
const crouch = cue("crouch", "The rat crouches, keeping its weight back: a feint.", "hold");
const lunge = cue("lunge", "The rat commits its weight to a forward lunge.", "sidestep");
const recover = cue("recover", "The rat plants its forepaws to regain balance.", "advance");
export const RAT_STEP = "frontier.rat_step";
export const RAT_ENEMY = "Starving wolf rat";
export const techniqueDefinitions = [{id: RAT_STEP, revision: 1, label: "Rat-step", worldId: "base.frontier",
    enemyId: RAT_ENEMY, readyAt: 6, maxProficiency: 12, minAgility: 8,
    provenance: "Original observation exercise using Miktaew's Starving wolf rat; no direct book adaptation",
    patterns: {feint_first: [crouch, lunge, recover], recovery_first: [recover, crouch, lunge]}}];
const village = {fact: "location", op: "eq", value: "Village", reason: "Return to Village to practice."};
const progress = (key, op, value, reason) => ({fact: `technique.${RAT_STEP}.${key}`, op, value, reason});
const observed = progress("observed", "eq", true, "Observe a wolf rat or defeat one in ordinary combat first.");
const understood = progress("understood", "eq", true, "Study your observation notes first.");
const unmastered = progress("proficiency", "lte", 11, "Rat-step practice is complete at 12 proficiency.");
const effect = (operation, extra = {}) => ({type: "technique", techniqueId: RAT_STEP, operation, revision: 1, ...extra});
const action = values => ({worldId: "base.frontier", revision: 1, group: "technique", completionScope: "actor", costs: [], ...values});
export const techniqueActions = [
    action({id: "frontier.rat_step.observe", label: "Observe a wolf rat at the field edge", duration: 3, repeatable: false,
        description: "Watch a Starving wolf rat: observe its feint, lunge and recovery from cover. Record evidence and 4 Perception XP. This teaches by observation; the enemy loses nothing.",
        visibleWhen: progress("observed", "eq", false), requires: village,
        outcomes: [{id: "observed", label: "Wolf rat footwork observed", chance: 1, effects: [
            effect("observe", {enemyId: RAT_ENEMY, route: "field-observation"}), {type: "xp", skill: "Perception", amount: 4}]}]}),
    action({id: "frontier.rat_step.study", label: "Study the Rat-step pattern", duration: 3, repeatable: false,
        description: "Pay 2 wooden coins for a guide's analysis. Learn why you hold through a feint, step aside from a committed lunge and advance during recovery. Understanding opens practice, not execution.",
        visibleWhen: {all: [observed, progress("understood", "eq", false)]}, requires: {all: [village, observed]},
        cancellation: "forfeit", costs: [{scope: "external", key: "money", amount: 2, label: "wooden coins"}],
        outcomes: [{id: "understood", label: "Rat-step understood; practice available", chance: 1, effects: [effect("understand")]}]}),
    action({id: "frontier.rat_step.internalize", label: "Internalize Rat-step", duration: 2, repeatable: false,
        description: "At 2 proficiency, make the understood movement your own permanent learned technique. Execution still requires 6 proficiency and Agility 8.",
        visibleWhen: {all: [understood, progress("owned", "eq", false)]}, requires: {all: [village, understood,
            progress("proficiency", "gte", 2, "Practice to reach 2 proficiency before internalizing.")]},
        outcomes: [{id: "owned", label: "Rat-step internalized and owned", chance: 1, effects: [effect("own")]}]}),
    action({id: "frontier.rat_step.idle", label: "Practice Rat-step slowly", duration: 6, repeatable: true,
        description: "Idle fallback: 6 game minutes, no fee, up to +2 proficiency and 20 Equilibrium XP. Exactly the same technique as active practice. Cancel any time; no practice reward on cancellation.",
        visibleWhen: {all: [understood, unmastered]}, requires: {all: [village, understood, unmastered]}, cancellation: "forfeit",
        outcomes: [{id: "practiced", label: "Slow Rat-step drill: +2 proficiency", chance: 1, effects: [
            effect("practice", {amount: 2, cap: 12}), {type: "xp", skill: "Equilibrium", amount: 20}]}]}),
    action({id: "frontier.rat_step.active", label: "Practice Rat-step decisions", duration: 0, repeatable: true,
        description: "Optional untimed drill: pay 1 wooden coin, then choose three responses. +1 to +3 proficiency and 10 Equilibrium XP per earned point. Each response is saved; mistakes still teach. Cancelling forfeits the fee.",
        visibleWhen: {all: [understood, unmastered]}, requires: {all: [village, understood, unmastered]},
        costs: [{scope: "external", key: "money", amount: 1, label: "wooden coin"}],
        outcomes: [{id: "feint_first", label: "Decision drill saved: feint pattern", chance: 0.5,
            effects: [effect("beginPractice", {patternId: "feint_first"})]},
        {id: "recovery_first", label: "Decision drill saved: recovery pattern", chance: 0.5,
            effects: [effect("beginPractice", {patternId: "recovery_first"})]}]}),
];
export const ratStepRoute = {id: "frontier.rat_step.route", worldId: "base.frontier", revision: 1,
    label: "Guide the crossing with Rat-step", completionScope: "actor", duration: 3, repeatable: false, costs: [],
    description: "Execute Rat-step over the narrow footholds. No kit or Strength requirement: 3 minutes, 85% ready guide, 20 Climbing XP. At 12 proficiency, the guide stays ready guaranteed. Leaves the crossing unrepaired.",
    visibleWhen: observed, requires: {all: [village,
        {fact: "campaign.anchor", op: "eq", value: true, reason: "Inspect the crossing first."},
        {fact: "actor.surveyed", op: "eq", value: false, reason: "You already surveyed this route."},
        progress("executable", "eq", true, "Needs owned Rat-step, 6 proficiency and Agility 8.")]},
    effects: [effect("execute", {readyAt: 6}), {type: "fact", scope: "actor", key: "surveyed", value: true},
        {type: "fact", scope: "world", key: "crossing", value: "unrepaired"}, {type: "xp", skill: "Climbing", amount: 20},
        {type: "opportunity", id: "frontier.departure", delay: 12, lifetime: 120, blocking: false}],
    outcomes: [{id: "ready", label: "Rat-step footholds mapped; guide ready", chance: 0.85, effects: [
        {type: "fact", scope: "world", key: "guide.condition", value: "ready"}, {type: "resource", scope: "external", key: "money", amount: 12}]},
    {id: "strained", label: "Footholds mapped; guide needs rest", chance: 0.15, effects: [
        {type: "fact", scope: "world", key: "guide.condition", value: "tired"}, {type: "resource", scope: "external", key: "money", amount: 6}]}],
    modifiers: [{when: progress("proficiency", "gte", 12), label: "Mastered Rat-step: the guide stays ready",
        transfers: [{from: "strained", to: "ready", amount: 0.15}]}]};
