import {molCommands,molControllers,molPowers,molSources,molConditions,molSituations,molEncounters} from './book_world_mol_actions.js';
import {packNative} from './world_pack_registry.js';
export {MOL_IDS,MOL_LOCATIONS,MOL_KEYS,MOL_FOOTPRINTS,MOL_FRONTIER,MOL_SOURCE_HASH,MOL_SOURCE_SNAPSHOT,MOL_NATIVE_DOMAIN,MOL_BASELINE} from './book_world_mol_ids.js';
export {molSources};
// WAC8: people, items, stock and world facts install from the book.mol world pack
// (src/world_packs/book_mol_pack.js). This module is the adapter that keeps the
// established export names; it holds no definitions of its own (WA17, AR3).
const installed=packNative('book.mol');
export const molWorlds=installed.worlds;
export const MOL_INITIAL_FACTS=installed.initialFacts;
export const MOL_NATIVE_PEOPLE=installed.nativePeople;
export const MOL_NATIVE_STOCK=installed.nativeStock;
export const molDefinitions={people:installed.definitions.people,sites:installed.definitions.sites,powers:molPowers,conditions:molConditions,encounters:molEncounters,situations:molSituations,commands:molCommands,controllers:molControllers};
export const MOL_ITEM_SPECIFICATIONS=installed.items;
export function registerMolItems({itemTemplates,OtherItem}){for(const spec of MOL_ITEM_SPECIFICATIONS){if(itemTemplates[spec.id])throw Error(`Duplicate Mother of Learning item ${spec.id}.`);itemTemplates[spec.id]=new OtherItem(spec);}}
