// An inventory key remains the same physical copy. Auxiliary owners move only
// that key's facts. No whole equipment/recipe/body owner is copied across lives.
import {check} from './basics.js';
import {readMaterialLineage} from './material_lineage.js';
export function baggageIdentity(key){try{const v=JSON.parse(key),id=v.e2_instance;return typeof id==='string'&&/^e2\.[1-9]\d*$/.test(id)&&Number.isSafeInteger(Number(id.slice(3)))?id:null;}catch{return null;}}
export function portableEquipmentKey(key){try{const v=JSON.parse(key);if(key.length>25000||v.productRef!==undefined)return false;return !!baggageIdentity(key)&&(typeof v.id==='string'||v.components&&typeof v.components==='object')||!!readMaterialLineage(key);}catch{return false;}}
export function equipmentBagReason(save,key){
 if(save.tools?.job?.key===key)return 'Finish or cancel this actual tool repair before moving the tool.';
 const id=baggageIdentity(key);if(id){const row=save.inventories?.person?.main_character?.[key],n=typeof row==='number'?row:row?.count;if(n!==1)return 'Carry this individually tracked copy loose, exactly once.';
  if(Object.values(save.character.equipment||{}).some(v=>v&&(typeof v==='string'?baggageIdentity(v)===id:v.inventory_key?baggageIdentity(v.inventory_key)===id:v.e2_instance===id)))return 'Unequip this actual copy before packing it.';
 }
 return '';
}
export function equipmentBagPreflight(source,target,key){
 const reason=equipmentBagReason(source,key);check(!reason,reason);const id=baggageIdentity(key);if(!id)return;
 const keys=[...Object.keys(target.inventories?.person?.main_character||{}),...Object.values(target.character.equipment||{}).filter(Boolean).map(v=>typeof v==='string'?v:v.inventory_key||JSON.stringify(v))];
 check(!keys.some(k=>baggageIdentity(k)===id)&&!target.naming?.named?.[id]&&![...Object.keys(target.equipment_durability?.condition||{}),...Object.keys(target.tools?.instances||{}),...Object.keys(target.p23_living_gear?.copies||{})].some(k=>baggageIdentity(k)===id),'This beginning already has a different equipment copy with that local identity. Keep this bag held and choose a compatible opening.');
}
export function transferEquipmentFacts(source,target,key){
 const id=baggageIdentity(key);if(!id)return;
 const wear=source.equipment_durability;if(wear){target.equipment_durability ||= {schema:1,enabled:false,nextId:1,condition:{}};const to=target.equipment_durability;to.nextId=Math.max(to.nextId,Number(id.slice(3))+1);for(const family of ['condition','uses'])if(Object.hasOwn(wear[family]||{},key)){to[family] ||= {};to[family][key]=structuredClone(wear[family][key]);delete wear[family][key];}}
 if(source.tools?.instances?.[key]){target.tools ||= {schema:1,instances:{},job:null};target.tools.instances[key]=structuredClone(source.tools.instances[key]);delete source.tools.instances[key];}
 if(source.naming?.named?.[id]){target.naming ||= {schema:1,used:0,named:{}};target.naming.named[id]=structuredClone(source.naming.named[id]);delete source.naming.named[id];}
 if(source.p23_living_gear?.copies?.[key]){target.p23_living_gear ||= {schema:1,lastKill:0,copies:{}};target.p23_living_gear.copies[key]=structuredClone(source.p23_living_gear.copies[key]);delete source.p23_living_gear.copies[key];}
}

// The selected physical bag leaves one history. Earlier return points lose that
// same exported copy, including older rekeys and an earlier worn/chest position.
export function stripExportedEquipmentCopy(save,id){
 const matches=key=>baggageIdentity(key)===id,strip=map=>{for(const key of Object.keys(map||{}))if(matches(key))delete map[key];};
 for(const family of Object.values(save.inventories||{}))for(const stock of Object.values(family||{}))strip(stock);
 for(const stock of Object.values(save.expansion?.simulation?.owners||{}))strip(stock);
 const equipment=slots=>{for(const [slot,value]of Object.entries(slots||{})){const key=typeof value==='string'?value:value?.inventory_key||JSON.stringify(value);if(matches(key))delete slots[slot];}};
 equipment(save.character?.equipment);for(const slots of Object.values(save.npc_equipment||{}))equipment(slots);for(const slots of Object.values(save.expansion?.simulation?.equipment||{}))equipment(slots);
 save.equipment_durability||={schema:1,enabled:false,nextId:1,condition:{}};const wear=save.equipment_durability;check(Number.isSafeInteger(wear.nextId)&&wear.nextId>0,'This return point has an invalid equipment allocator.');wear.nextId=Math.max(wear.nextId,Number(id.slice(3))+1);strip(wear.condition);strip(wear.uses);strip(save.tools?.instances);strip(save.p23_living_gear?.copies);if(save.naming?.named)delete save.naming.named[id];
}
export function snapshotReservesCopy(save,id){
 const refers=value=>{if(typeof value==='string'){if(baggageIdentity(value)===id)return true;try{const parsed=JSON.parse(value);return parsed&&typeof parsed==='object'?refers(parsed):false;}catch{return false;}}if(value&&typeof value==='object')return Object.entries(value).some(([key,v])=>baggageIdentity(key)===id||refers(v));return false;};
 return [save.tools?.job,save.expansion?.pending,save.expansion?.simulation?.jobs,save.expansion?.simulation?.sessions].some(refers);
}
