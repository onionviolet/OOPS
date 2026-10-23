import {inspectCapabilities} from "./expansion_engine.js";
import {techniqueFacts} from "./techniques.js";
import {ageYears} from "./chronicle.js";
import {worldIdentityView} from "./world_knowledge.js";
import {SORE_HANDS, SCRAPED_HANDS, PALM_MARK} from "./body_progression.js";

export const BODY_STATS = {strength:"Strength", agility:"Agility", dexterity:"Dexterity", intuition:"Intuition",
    max_health:"Health", max_stamina:"Stamina", stamina_efficiency:"Stamina efficiency", cold_tolerance:"Cold tolerance"};

const SLOT_LABELS={build:"Build",bearing:"Bearing",hands:"Hands",marks:"Marks",skin:"Skin"}, SLOT_ORDER=Object.keys(SLOT_LABELS);
// Biography explains already earned effects. It never applies a bonus, invents
// a past life, reveals an unobserved technique or writes a second history owner.
// reveal: ids of sources or conditions an observer could actually see; a look marked concealed shows only then.
export function characterBioView({state, registry, context, training = [], reveal = []}) {
    const actor = state.actors.player, capabilities = inspectCapabilities(state, registry, context);
    const currentConditions = state.simulation?.conditions.player || {};
    const activeCondition = id => {const c=currentConditions[id];return !!(c?.intensity > 0 && (c.expiresAt == null || c.expiresAt>state.clock));};
    const sources = Object.entries(actor.sources).flatMap(([id, instance]) => {
        const source = registry.sources.get(id), faculty = state.simulation?.faculties.player?.[id];
        if(!source || !["knowledge","trait","bloodline"].includes(source.kind) || instance.expiresAt != null || faculty && !faculty.awakened) return [];
        const grants = Object.values(capabilities).flatMap(capability => capability.contributions
            .filter(c => c.sourceId === id).map(c => `${capability.label} +${c.amount}`));
        const origin=instance.origin || "unknown";
        const cause = source.bioCause || ({inherited:"Inherited body trait · ancestry uncertain",trained:"Acquired through training",acquired:"Acquired through experience"})[origin] ||
            (source.kind === "knowledge" ? "Learned knowledge" : source.kind === "bloodline" ? "Awakened bloodline · origin unknown" : "Discovered trait");
        const label=id === PALM_MARK ? activeCondition(SCRAPED_HANDS) ? "Palm scrape" : "Faint palm scar" : source.label;
        const row={id, label, detail:grants.join(" · ") || source.bioDetail || "Currently inactive", cause, origin};
        // A trait replaced by a held successor fades: kept as a record with its reason, no longer shaping the description.
        const successor=source.supersededBy && actor.sources[source.supersededBy] ? registry.sources.get(source.supersededBy) : null;
        return [successor ? {...row, detail:source.fadedDetail || "No longer shapes you.", cause:`Faded: replaced by ${successor.label}`, origin:"faded"} : row];
    });
    const faded=sources.filter(row=>row.origin === "faded");
    const live=sources.filter(row=>row.origin !== "faded"), heritage=live.filter(row=>row.origin === "inherited"), learned=live.filter(row=>row.origin !== "inherited");
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
    // Self-description: one line per slot, read only from the rows already filtered above, so sealed or
    // unawakened sources never appear and nothing is stored. The highest rank in a slot wins.
    const slots=new Map(), consider=(id,definition,kind)=>{
        const look=definition?.look; if(!look || look.concealed && !reveal.includes(id)) return;
        const rank=look.rank ?? 1, held=slots.get(look.slot);
        if(!held || rank>held.rank) slots.set(look.slot,{rank,row:{id:`look.${look.slot}`,label:SLOT_LABELS[look.slot] || look.slot,detail:look.text,cause:`From ${kind}: ${definition.label}`}});
    };
    for(const row of live) consider(row.id,registry.sources.get(row.id),"your body");
    for(const row of conditions) consider(row.id,registry.simulation.conditions.get(row.id),"your condition");
    const description=SLOT_ORDER.flatMap(slot=>slots.has(slot) ? [slots.get(slot).row] : []);
    return {identity:worldIdentityView(state, registry).label,
        life:state.chronicle ? `Chronicle age: ${ageYears(state.chronicle, state.clock).toFixed(1)} years${state.chronicle.life.endedAt != null ? " · Life ended" : ""}` : "",
        description, faded, learned, heritage, conditions, techniques, influences};
}
