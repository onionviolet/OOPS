// Unique named objects (G3, 2026-10-23, proposal). The inventory key is the persistent id: a canonical
// lineage-bearing JSON key with a stack count of exactly one. Leaf module, no state.
import {readMaterialLineage} from './material_lineage.js';
export function heirloomKey({uid,name,born}) {
 return JSON.stringify({id:`heirloom:${uid}`,name,lineage:{schema:'oops.processed-material',revision:1,family:'heirloom',facts:{born,origin_world:'base.frontier'},history:[{process_id:'heirloom.origin',revision:1,at:born,world_id:'base.frontier',parameters:{uid,name},inputs:[{item_key:'heirloom:origin',count:1}]}]}});
}
// Returns {uid,name,born} only for a key that this module would have produced; otherwise null.
export function parseHeirloomKey(key) {
 if(typeof key!=='string'||!key.startsWith('{"id":"heirloom:'))return null;
 let v;try{v=JSON.parse(key);}catch{return null;}
 const uid=v?.id?.slice('heirloom:'.length),name=v?.name,born=v?.lineage?.facts?.born;
 if(typeof uid!=='string'||typeof name!=='string'||!Number.isSafeInteger(born)||heirloomKey({uid,name,born})!==key||!readMaterialLineage(key))return null;
 return {uid,name,born};
}
