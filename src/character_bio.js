import {inspectCapabilities} from "./expansion_engine.js";
import {techniqueFacts} from "./techniques.js";
import {ageYears} from "./chronicle.js";
import {worldIdentityView} from "./world_knowledge.js";
import {SORE_HANDS, SCRAPED_HANDS, PALM_MARK} from "./body_progression.js";

export const BODY_STATS = {strength:"Strength", agility:"Agility", dexterity:"Dexterity", intuition:"Intuition",
    max_health:"Health", max_stamina:"Stamina", stamina_efficiency:"Stamina efficiency", cold_tolerance:"Cold tolerance"};

// Biography explains already earned effects. It never applies a bonus, invents
// a past life, reveals an unobserved technique or writes a second history owner.
export function characterBioView({state, registry, context, training = []}) {
    const actor = state.actors.player, capabilities = inspectCapabilities(state, registry, context);
    const currentConditions = state.simulation?.conditions.player || {};
    const activeCondition = id => {const c=currentConditions[id];return !!(c?.intensity > 0 && (c.expiresAt == null || c.expiresAt>state.clock));};
    const sources = Object.entries(actor.sources).flatMap(([id, instance]) => {
        const source = registry.sources.get(id), faculty = state.simulation?.faculties.player?.[id];
        if(!source || !["knowledge","trait","bloodline"].includes(source.kind) || instance.expiresAt != null || faculty && !faculty.awakened) return [];
        const grants = Object.values(capabilities).flatMap(capability => capability.contributions
            .filter(c => c.sourceId === id).map(c => `${capability.label} +${c.amount}`));
        const origin=instance.origin || "unknown";
        const cause = ({inherited:"Inherited body trait · ancestry uncertain",trained:"Acquired through training",acquired:"Acquired through experience"})[origin] ||
            (source.kind === "knowledge" ? "Learned knowledge" : source.kind === "bloodline" ? "Awakened bloodline · origin unknown" : "Discovered trait");
        const label=id === PALM_MARK ? activeCondition(SCRAPED_HANDS) ? "Palm scrape" : "Faint palm scar" : source.label;
        return [{id, label, detail:grants.join(" · ") || source.bioDetail || "Currently inactive", cause, origin}];
    });
    const heritage=sources.filter(row=>row.origin === "inherited"), learned=sources.filter(row=>row.origin !== "inherited");
    const conditions=Object.entries(currentConditions).flatMap(([id,c])=>{
        const definition=registry.simulation.conditions.get(id);
        if(!activeCondition(id) || !(definition?.bioVisible || id.startsWith("mood."))) return [];
        return [{id,label:definition.label,detail:definition.bioDetail || "Temporary condition",cause:c.expiresAt==null ? "Until resolved" : `${c.expiresAt-state.clock} game min remaining`}];
    });
    const facts = techniqueFacts(actor, registry, context);
    const techniques = Object.entries(actor.techniques).flatMap(([id, record]) => {
        const definition = registry.techniques.get(id);
        if(!definition || !record.observed) return [];
        const stage = record.owned ? "Internalized" : record.understood ? "Understood" : "Observed";
        return [{id, label:definition.label, detail:record.understood ? `${stage} · Practice ${record.proficiency}/${definition.maxProficiency}` : stage,
            cause:record.owned ? facts[`technique.${id}.executable`] ? "Ready to use" : "Execution requirements not yet met" : "Recorded from observed movement"}];
    });
    const influences = training.filter(skill => skill.visible && skill.level > 0).flatMap(skill => {
        const bonuses = Object.entries(skill.stats || {}).filter(([key]) => BODY_STATS[key]).map(([key, bonus]) =>
            `${BODY_STATS[key]} ${[bonus.flat ? `+${bonus.flat}` : "", bonus.multiplier && bonus.multiplier !== 1 ? `×${bonus.multiplier}` : ""].filter(Boolean).join(" ")}`);
        if(!bonuses.length && !skill.bodyEffect) return [];
        const current = skill.effectiveLevel ?? skill.level;
        return [{id:skill.id, label:skill.label, detail:bonuses.join(" · "),
            cause:`Trained level ${skill.level}${current !== skill.level ? ` · Current level ${current}` : ""}`, effect:skill.bodyEffect || ""}];
    });
    return {identity:worldIdentityView(state, registry).label,
        life:state.chronicle ? `Chronicle age: ${ageYears(state.chronicle, state.clock).toFixed(1)} years${state.chronicle.life.endedAt != null ? " · Life ended" : ""}` : "",
        learned, heritage, conditions, techniques, influences};
}
