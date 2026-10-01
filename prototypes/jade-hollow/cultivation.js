// Original, provisional rules. Pure state transitions keep balance and migration testable.
import {evaluateRule} from "../../src/rules.js";
export const REGION = "Jade Hollow";
export const CULTIVATION_ITEMS = ["Dewleaf", "Dewleaf tea", "Meridian pellet"];
export const LEGACIES = {
    breath: {name: "Remembered breath", description: "+25% qi from meditation."},
    craft: {name: "Steady hands", description: "+50% preparation from tea and pellets."},
};

export function freshCultivation() {
    return {schema: 1, qi: 0, body: 0, preparation: 0, realm: 0, seal: false,
        trial: null, rebirths: 0, legacy: null, discovered: false, loanClaimed: false,
        message: "A hidden valley above the village. Choose how to build your foundation."};
}

export function loadCultivation(saved) {
    if(saved == null) return freshCultivation(); // Upstream saves start a fresh journey.
    if(saved.schema !== 1) throw new Error("Unsupported cultivation save schema; original save has been left intact.");
    const result = freshCultivation();
    for(const key of ["qi", "body", "preparation"]) {
        result[key] = Number.isFinite(saved[key]) ? Math.max(0, Math.min(100, saved[key])) : 0;
    }
    result.realm = saved.realm === 1 ? 1 : 0;
    result.rebirths = Number.isSafeInteger(saved.rebirths) ? Math.max(0, saved.rebirths) : 0;
    result.legacy = Object.hasOwn(LEGACIES, saved.legacy) ? saved.legacy : null;
    for(const key of ["seal", "discovered", "loanClaimed"]) result[key] = saved[key] === true;
    if(saved.trial && ["martial", "artisan"].includes(saved.trial.route) && !result.realm && !result.seal) {
        result.trial = {route: saved.trial.route, progress: Math.max(0, Math.min(12, Number(saved.trial.progress) || 0))};
    }
    if(typeof saved.message === "string") result.message = saved.message.slice(0, 300);
    return result;
}

export function cultivationRates(state, levels = {}) {
    const realm = state.realm ? 1.5 : 1;
    return {
        qi: (2 + Math.min(30, levels.Meditation || 0) * 0.2) * realm * (state.legacy === "breath" ? 1.25 : 1),
        body: (1 + Math.min(60, levels.Weightlifting || 0) * 0.1 + Math.min(60, levels.Combat || 0) * 0.05) * realm,
        preparation: state.legacy === "craft" ? 1.5 : 1,
    };
}

export function trialRequirement(state, route) {
    if(state.realm) return "You already opened your meridians in this life.";
    if(state.seal) return "Trial seal earned. Prepare 60 qi for breakthrough.";
    if(state.trial) return "A trial is already in progress.";
    if(!["martial", "artisan"].includes(route)) return "Choose a valid trial route.";
    const requirements = [{fact: "qi", op: "gte", value: 60, reason: "Requires 60 qi; the trial spends 40 qi."},
        route === "martial"
            ? {fact: "body", op: "gte", value: 30, reason: "Endurance trial requires 30 body conditioning."}
            : {fact: "preparation", op: "gte", value: 30, reason: "Formation trial requires 30 preparation; spends 30."}];
    return evaluateRule({all: requirements}, state).reasons[0] || "";
}

export function beginTrial(state, route) {
    const error = trialRequirement(state, route);
    if(error) return error;
    state.qi -= 40;
    if(route === "artisan") state.preparation -= 30;
    state.trial = {route, progress: 0};
    state.message = route === "martial" ? "Hold your stance against the hollow's pressure for 12 ticks." : "Keep the meridian formation stable for 12 ticks.";
    return "";
}

export function tickCultivation(state, {inRegion, activity, levels = {}}) {
    if(!inRegion) return null;
    state.discovered = true;
    if(state.trial) {
        state.trial.progress += 1;
        if(state.trial.progress >= 12) {
            const route = state.trial.route;
            state.trial = null;
            state.seal = true;
            state.message = "Trial complete. Gather 60 qi, then open your meridians.";
            return {skill: route === "martial" ? "Combat" : "Alchemy", xp: 20};
        }
    } else {
        const rates = cultivationRates(state, levels);
        if(activity === "meditating") state.qi = Math.min(100, state.qi + rates.qi);
        if(activity === "weightlifting") state.body = Math.min(100, state.body + rates.body);
    }
    return null;
}

export function consumePreparation(state, item, levels = {}) {
    const rate = cultivationRates(state, levels).preparation;
    if(item === "Dewleaf tea") {
        state.qi = Math.min(100, state.qi + 20 + Math.min(20, levels.Cooking || 0));
        state.preparation = Math.min(100, state.preparation + 10 * rate);
    } else if(item === "Meridian pellet") {
        state.preparation = Math.min(100, state.preparation + (30 + Math.min(30, levels.Alchemy || 0)) * rate);
    } else return false;
    state.message = `${item} consumed. Ordinary Cooking and Alchemy mastery improve your preparation.`;
    return true;
}

export function breakthrough(state) {
    if(state.realm || !state.seal || state.qi < 60 || state.trial) return false;
    state.qi -= 60;
    state.realm = 1;
    state.message = "Meridians opened. Qi and body training are 50% faster. You may continue or choose a legacy and rebirth.";
    return true;
}

export function rebirth(state, legacy) {
    if(!state.realm || !Object.hasOwn(LEGACIES, legacy)) return null;
    return {...freshCultivation(), rebirths: state.rebirths + 1, legacy, discovered: true,
        loanClaimed: state.loanClaimed, message: `A new mortal foundation. ${LEGACIES[legacy].name} is your active legacy.`};
}
