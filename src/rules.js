// Small pure rules for new content. Contexts contain explicit, caller-owned facts.
// Evaluation never spends resources, rolls randomness or changes saved state.
export function evaluateRule(rule, facts) {
    if(rule.all || rule.any) {
        if(rule.all && rule.any) throw new Error("Choose all or any, not both.");
        const children = rule.all || rule.any;
        if(!Array.isArray(children)) throw new Error("Rule children must be an array.");
        const results = children.map(child => evaluateRule(child, facts));
        const met = rule.all ? results.every(r => r.met) : results.some(r => r.met);
        return {met, known: rule.all
            ? results.every(r => r.known) || results.some(r => r.known && !r.met)
            : met || results.every(r => r.known),
            reasons: met ? [] : results.flatMap(r => r.reasons)};
    }
    if(rule.not) {
        const result = evaluateRule(rule.not, facts);
        const met = result.known && !result.met;
        return {met, known: result.known, reasons: met ? [] : [rule.reason || "This condition must not hold."]};
    }
    if(typeof rule.fact !== "string" || !["eq", "gte", "lte"].includes(rule.op)) {
        throw new Error("A fact rule needs eq, gte or lte.");
    }
    if(rule.op !== "eq" && !Number.isFinite(rule.value)) throw new Error("Numeric threshold must be finite.");
    const value = facts[rule.fact];
    const known = Object.hasOwn(facts, rule.fact) && value !== undefined &&
        (rule.op === "eq" || Number.isFinite(value));
    const met = known && (rule.op === "eq" ? value === rule.value
        : rule.op === "gte" ? value >= rule.value : value <= rule.value);
    return {met, known, reasons: met ? [] : [rule.reason || requirementText(rule)]};
}

// Plain-language fallback so raw fact ids and operators never reach players (UR70).
function requirementText(rule) {
    const parts = rule.fact.split(".");
    const words = text => text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ");
    const name = parts[0] === "skill" && parts[1] ? `${words(parts.slice(1).join(" "))} skill`
        : words(parts[parts.length - 1]).toLowerCase();
    if(rule.op === "gte") return `Needs ${name} of at least ${rule.value}.`;
    if(rule.op === "lte") return `Needs ${name} of at most ${rule.value}.`;
    return rule.value === true ? `Needs ${name}.` : rule.value === false ? `Needs no ${name}.` : `Needs ${name} to be ${rule.value}.`;
}

// Caller supplies a draw, allowing tests and future persisted event randomness.
export function chooseOutcome(outcomes, draw) {
    if(!Array.isArray(outcomes) || !outcomes.length) throw new Error("Outcomes cannot be empty.");
    const ids = new Set();
    let total = 0;
    for(const outcome of outcomes) {
        if(typeof outcome.id !== "string" || !outcome.id || ids.has(outcome.id) ||
            !Number.isFinite(outcome.chance) || outcome.chance < 0 || outcome.chance > 1) {
            throw new Error("Outcomes need unique IDs and probabilities in [0, 1].");
        }
        ids.add(outcome.id);
        total += outcome.chance;
    }
    if(Math.abs(total - 1) > 1e-12) throw new Error("Outcome probabilities must sum to 1.");
    if(!Number.isFinite(draw) || draw < 0 || draw >= 1) throw new Error("Draw must be in [0, 1).");
    let cumulative = 0;
    for(const outcome of outcomes) {
        cumulative += outcome.chance;
        if(draw < cumulative) return outcome.id;
    }
    // Absorb floating-point rounding only into the last positive interval.
    return outcomes.findLast(outcome => outcome.chance > 0).id;
}

// A JSON-safe resolution receipt, not a reward transaction or save subsystem.
// Persist the returned receipt with costs/rewards when a future event is wired in.
export function resolveOnce(receipt, outcomes, draw) {
    if(typeof receipt.id !== "string" || !receipt.id) throw new Error("Receipt needs an event instance ID.");
    if(Object.hasOwn(receipt, "outcome")) return receipt;
    return {...receipt, outcome: chooseOutcome(outcomes, draw), draw};
}
