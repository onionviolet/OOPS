import {validateItemKey} from "./gameplay_transactions.js";
import {stableId, record} from "./simulation_contracts.js";
export function readNativeEquipment(actors) {
    return Object.fromEntries(Object.entries(actors).map(([id,actor]) => [id, Object.fromEntries(Object.entries(actor.getEquipment()).filter(([,item]) => item).map(([slot,item]) => [slot,item.getInventoryKey()]))]));
}
export function prepareNativeEquipment(equipment, {actors, getItem}) {
    const stages = [];
    for(const [id,slots] of Object.entries(equipment || {})) {
        const actor = actors[id]; if(!stableId(id) || !Object.hasOwn(actors,id) || !actor || !record(slots)) throw new Error(`No native equipment owner ${id}.`);
        const next = {};
        for(const [slot,key] of Object.entries(slots)) {
            if(!stableId(slot)) throw new Error("Invalid native equipment slot.");
            validateItemKey(key); const item = getItem(key);
            if(!item || item.equip_slot !== slot) throw new Error(`Item does not fit native slot ${slot}.`);
            next[slot] = item;
        }
        stages.push({id, actor, next, slots});
    }
    return {
        write(envelope) {for(const s of stages) {
            // Match create_save's JSON boundary; live Items contain functions.
            if(s.id === "player") envelope.character.equipment = JSON.parse(JSON.stringify(s.next));
            else {envelope.npc_equipment ||= {}; envelope.npc_equipment[s.id] = structuredClone(s.slots);}
        }},
        publish() {for(const s of stages) {
            const live = s.actor.getEquipment(); for(const slot of Object.keys(live)) delete live[slot]; Object.assign(live,s.next);
            s.actor._equipItem(null); // Recompute native equipment/stat containers without replaying inventory movement.
        }}
    };
}
