import {canonicalDurabilityKey} from './absorb_e2/durability.js';
import {backlogNativeActionReasons,assertBacklogItemDisposition} from './backlog_expansion_host.js';
import {readGameplayActor} from "./gameplay_publication.js";
import {readNativeEquipment} from "./native_equipment_transaction.js";
import {activePractice} from "./techniques.js";
import {simulationOccupiesActor, waitingSimulationChoice} from "./simulation.js";

// Native registries remain the owners. This bridge reads them, never enrolls actors.
export function createNativeGameplayAdapter({player, getPerson, skills, getContext, bindings}) {
    const actors = state => {
        const result = {player};
        for(const [id,p] of Object.entries(state.simulation?.people || {})) {
            if(id !== "player" && p.inventory === "native") result[id] = getPerson(id);
        }
        return result;
    };
    return {
        actors,
        snapshot(state) {
            return Object.fromEntries(Object.entries(actors(state)).map(([id,actor]) => {
                if(id !== "player") bindings[id] ||= {category:"person",id};
                return [id,readGameplayActor(actor,skills,getContext())];
            }));
        },
        contexts(state, busy = false) {
            const live = actors(state), equipment = readNativeEquipment(live);
            return Object.fromEntries(Object.entries(live).map(([id,actor]) => {
                const s = actor.getFullStats();
                return [id,{equipment:equipment[id],...(id === "player" ? {busy} : {}),
                    vitals:{health:s.health,max_health:s.max_health,stamina:s.stamina,max_stamina:s.max_stamina}}];
            }));
        }
    };
}

export function publishNativeVitals(native, player) {
    if(!native) return;
    const s = player.getFullStats();
    for(const [key,offset] of [["stamina","staminaToFull"],["health","hpToFull"]]) {
        if(native[offset] == null) continue;
        if(!Number.isFinite(native[offset]) || native[offset] < 0) throw new Error("Invalid native vital offset.");
        s[key] = Math.max(0,Math.min(s[`max_${key}`],s[`max_${key}`]-native[offset]));
    }
}

export function nativeActionReasons(state, actorId = "player") {
    const reasons = backlogNativeActionReasons(state,"activity");
    if(state.chronicle?.life.endedAt != null) reasons.push("This life has ended.");
    if(state.chronicle?.session || simulationOccupiesActor(state,actorId) || waitingSimulationChoice(state)) reasons.push("Finish your current encounter, work or decision first.");
    if(state.pending.some(j => j.context.actorId === actorId) || activePractice(state.actors[actorId])) reasons.push("Finish or cancel your expedition or practice first.");
    return reasons;
}

export function assertNativeItemDisposition(state, key, actorId = "player") {
    const keys=[key];const canonical=canonicalDurabilityKey(key);if(canonical!==key)keys.push(canonical);
    for(const candidate of keys){
        if(actorId==="player")assertBacklogItemDisposition(state,candidate);
        if(Object.values(state.simulation?.custody||{}).some(c=>c.holder===actorId&&c.key===candidate))
            throw new Error("Return borrowed goods before selling, consuming or crafting with them.");
    }
}
