import {setCraftsmanPractice} from '../gear_native_content.js';
"use strict";

import { availabilities, talkables } from "./component_references.js";
import { dialogue_owners } from "../components/dialogue_component.js";
import { equipments } from "../components/equipment_component.js";
import { inventories } from "../components/inventory_component.js";
import NPC from "../models/npc.js";
import { levels } from "./component_references.js";
//import { bios } from "../models/person.js";
import { dialogues } from "./dialogues.js";
import { traders } from "./traders.js";

availabilities["person"] = {};
availabilities["dialogue"] = {};
availabilities["textline"] = {};
//availabilities["action"] = {}; //handled in game_action.js
availabilities["trader"] = {};
inventories["trader"] = {};

class NPCRegistryC {
    #npcs = {};

    add(npc_id, npc) {
        this.#npcs[npc_id] = npc;

        const dialogue = npc.getDialogueComponent();

        inventories["person"][npc_id] = npc.getInventoryComponent();
        equipments["person"][npc_id] = npc.getEquipmentComponent();
        levels["person"][npc_id] = npc.getLevelableComponent();
        talkables["person"][npc_id] = dialogue;
        //bios[npc_id] = npc.getBioComponent(); //skipped, there is no need to save NPC bio

        availabilities["person"][npc_id] = npc.getAvailabilityComponent();
        availabilities["dialogue"][npc_id] = dialogue.getAvailabilityComponent();

        Object.keys(dialogue.textlines).forEach(textline_key => {
            availabilities["textline"][npc_id+":"+textline_key] = dialogue.textlines[textline_key].getAvailabilityComponent();
        });

        dialogue_owners[dialogue.name] = npc_id;

        if(npc.tags.trader) {
            npc.getTraderComponent().stockOwnerId=npc_id;
            inventories["trader"][npc_id] = npc.getTraderComponent().getInventoryComponent();
            availabilities["trader"][npc_id] = npc.getTraderComponent().getAvailabilityComponent();
        }
    }

    get(npc_id) {
        if(!this.#npcs[npc_id]) {
            throw new Error(`No npc with id of "${npc_id}" was found!`);
        }
        return this.#npcs[npc_id];
    }

    getAll() {
        return this.#npcs;
    }
}

const NPCRegistry = new NPCRegistryC();

NPCRegistry.add("villageElder", new NPC({name: "village elder", displayName: "Old Hesk, the village elder", dialogue: dialogues["village elder"]})); // names: allow internal key; players read displayName
NPCRegistry.add("villageGuard", new NPC({name: "village guard", displayName: "Harl, the village guard", dialogue: dialogues["village guard"]})); // names: allow internal key; players read displayName
NPCRegistry.add("oldCraftsman", new NPC({name: "old craftsman", displayName: "Wend, the old craftsman", dialogue: dialogues["old craftsman"]})); // names: allow internal key; players read displayName
setCraftsmanPractice(NPCRegistry.get("oldCraftsman"));
NPCRegistry.add("villageMillers", new NPC({name: "village millers", displayName: "the Pennick family, the village millers", dialogue: dialogues["village millers"]})); // names: allow internal key; players read displayName

NPCRegistry.add("suspiciousMan", new NPC({name: "suspicious man", displayName: "Skerrit, the hooded man", dialogue: dialogues["suspicious man"]})); // names: allow internal key; players read displayName
NPCRegistry.add("oldWomanOfTheSlums", new NPC({name: "old woman of the slums", displayName: "Granny Moth, the old woman of the slums", dialogue: dialogues["old woman of the slums"]})); // names: allow internal key; players read displayName

NPCRegistry.add("gateGuard", new NPC({name: "gate guard", displayName: "Corwin Slate, the gate guard", dialogue: dialogues["gate guard"]})); // names: allow internal key; players read displayName
NPCRegistry.add("farmSupervisor", new NPC({name: "farm supervisor", displayName: "Hesper Ayles, the farm supervisor", dialogue: dialogues["farm supervisor"]})); // names: allow internal key; players read displayName
NPCRegistry.add("nekomimiProprietress", new NPC({name: "nekomimi proprietress",displayName: "Madam Kohaku, the nekomimi proprietress", dialogue: dialogues["nekomimi proprietress"]})); // names: allow internal key; players read displayName

NPCRegistry.add("swamplandChief", new NPC({name: "swampland chief", displayName: "Murrow, the swampland chief", dialogue: dialogues["swampland chief"]})); // names: allow internal key; players read displayName
NPCRegistry.add("swamplandCook", new NPC({name: "swampland cook", displayName: "Ludd, the swampland cook", dialogue: dialogues["swampland cook"]})); // names: allow internal key; players read displayName
NPCRegistry.add("swamplandTailor", new NPC({name: "swampland tailor", displayName: "Sorrel, the swampland tailor", dialogue: dialogues["swampland tailor"]})); // names: allow internal key; players read displayName
NPCRegistry.add("swamplandTanner", new NPC({name: "swampland tanner", displayName: "Grist, the swampland tanner", dialogue: dialogues["swampland tanner"]})); // names: allow internal key; players read displayName
NPCRegistry.add("swamplandScout", new NPC({name: "swampland scout", displayName: "Rook, the swampland scout", dialogue: dialogues["swampland scout"]})); // names: allow internal key; players read displayName

NPCRegistry.add("villageTrader", new NPC({name: "village trader", displayName: "Dunstan, the village trader", trader: traders["village trader"]})); // names: allow internal key; players read displayName
NPCRegistry.add("suspiciousTrader", new NPC({name: "suspicious trader", displayName: "Quill, the back-alley trader", trader: traders["suspicious trader"]})); // names: allow internal key; players read displayName
NPCRegistry.add("swamplandTrader", new NPC({name: "swampland trader", displayName: "Mulgrave, the swampland trader", trader: traders["swampland trader"]})); // names: allow internal key; players read displayName
NPCRegistry.add("nekomimiTrader", new NPC({name: "nekomimi trader", displayName: "Tama, the nekomimi trader", trader: traders["nekomimi trader"]})); // names: allow internal key; players read displayName
NPCRegistry.add("catCafeTrader", new NPC({name: "cat cafe trader", displayName: "Nori, the Whisker Corner trader", trader: traders["cat cafe trader"]})); // names: allow internal key; players read displayName

export default NPCRegistry;
