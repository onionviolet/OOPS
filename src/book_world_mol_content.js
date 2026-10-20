import {MOL_IDS as I,MOL_LOCATIONS as L,MOL_KEYS as K} from './book_world_mol_ids.js';
import {molCommands,molControllers,molConditions,molSituations,molEncounters} from './book_world_mol_actions.js';
import {installWorldPack,packDefinitions} from './world_pack_runtime.js';
import molPack from './packs/mol_cyoria.pack.js';
export {MOL_IDS,MOL_LOCATIONS,MOL_KEYS,MOL_FOOTPRINTS,MOL_FRONTIER,MOL_SOURCE_HASH,MOL_SOURCE_SNAPSHOT,MOL_NATIVE_DOMAIN,MOL_BASELINE} from './book_world_mol_ids.js';
// WAC8/WA17: people, items, techniques and powers install from the Cyoria pack, the one authority for them.
const PACK=molPack.id,freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
installWorldPack(molPack);
export const molSources=freeze(packDefinitions(PACK,'technique')),molPowers=freeze(packDefinitions(PACK,'power'));
export const MOL_PACK_ID=PACK;
export const molWorlds=[{id:I.world,label:'Cyoria · academy visitor campaign',publicName:'Cyoria',continuityLabel:'Original independent retained-body branch',provenance:'nobody103, Mother of Learning; qualified supplied WebToEpub snapshot e53f95695730. Cyoria/academy/cast/magic distinctions source-grounded; entry, grants, budgets and local service outcomes authored.'}];
export const MOL_INITIAL_FACTS={[I.world]:{'book.mol.arrivalMet':false,'book.mol.arcClosed':false,'book.mol.retrieval':'unoffered','book.mol.hazard':'undisturbed','book.mol.forecast':'unknown','book.mol.aftermath':'unresolved','book.mol.researchDeposited':false}};
export const MOL_NATIVE_PEOPLE={
 [I.imaya]:{inventory:{[K.meal]:4,[K.oil]:2},skills:{},reputation:{}},
 [I.ilsa]:{inventory:{[K.badge]:1},skills:{},reputation:{}},
 [I.ibery]:{inventory:{[K.paper]:4,[K.ink]:2},skills:{},reputation:{}},
 [I.nora]:{inventory:{[K.cube]:2,[K.ink]:2},skills:{},reputation:{}},
 [I.xvim]:{inventory:{},skills:{},reputation:{}},
 [I.taiven]:{inventory:{[K.rod]:1,[K.rope]:2,[K.meal]:2},skills:{},reputation:{}},
 [I.kael]:{inventory:{[K.salve]:3,[K.paper]:2},skills:{},reputation:{}},
 [I.zorian]:{inventory:{[K.paper]:1},skills:{},reputation:{}},
 [I.opponent]:{inventory:{[K.hook]:1,[K.meal]:1,[K.oil]:1},skills:{},reputation:{}}};
export const MOL_NATIVE_STOCK={[I.stock]:{[K.watch]:1},[I.shop]:{[K.paper]:6,[K.ink]:4,[K.cube]:3,[K.oil]:3,[K.meal]:4,[K.rope]:3}};
const people=packDefinitions(PACK,'person');
export const molDefinitions={people,sites:[{id:I.site,revision:1,label:'Cyoria supervised workshop bench',capacity:1}],powers:molPowers,conditions:molConditions,encounters:molEncounters,situations:molSituations,commands:molCommands,controllers:molControllers};
export const MOL_ITEM_SPECIFICATIONS=packDefinitions(PACK,'item');
export function registerMolItems({itemTemplates,OtherItem}){for(const spec of MOL_ITEM_SPECIFICATIONS){if(itemTemplates[spec.id])throw Error(`Duplicate Mother of Learning item ${spec.id}.`);itemTemplates[spec.id]=new OtherItem(spec);}}
