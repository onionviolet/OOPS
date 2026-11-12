// The fabrication packs this build loads, registered once with the shared
// law. A new world adds its pack here; the law itself names no world.
import {registerFabricationPack} from './craft_assembly.js';
import {VILLAGE_FABRICATION} from './craft_assembly_village.js';
import {TINGEN_FABRICATION} from './lotm_amulet_crafting.js';
import {MISTGLASS_ARTIFACT} from './artifact_refining.js';

registerFabricationPack(VILLAGE_FABRICATION);
registerFabricationPack(TINGEN_FABRICATION);
registerFabricationPack({id: 'f.mistglass', revision: 1, world: 'p23.mistglass',
    families: {[MISTGLASS_ARTIFACT]: 'refined-artifact'}});
