import test from 'node:test';
import assert from 'node:assert/strict';
import {inventoryRowKind,matchesInventoryFilter} from '../src/inventory_filters.js';
import {compareWornEquipment} from '../src/worn_equipment_comparison.js';
import {projectStructuredEquipment} from '../src/structured_equipment_runtime.js';
test('native kind and quality facets distinguish books/components and absent quality without changing keys',()=>{
 assert.equal(inventoryRowKind(['character_item_book','character_item_usable']),'book');
 assert.equal(inventoryRowKind(['character_item_component','character_item_other']),'component');
 const row={name:'Pants of the same name',kind:'equipment',quality:125};
 assert(matchesInventoryFilter(row,{kind:'equipment',quality:'125',query:' SAME '}));
 assert(!matchesInventoryFilter(row,{quality:'150'}));assert(!matchesInventoryFilter(row,{kind:'book'}));
 assert(matchesInventoryFilter({...row,quality:null},{quality:'none'}));assert(!matchesInventoryFilter({...row,quality:null},{quality:'50'}));
});
test('worn comparison uses actual structured projection with body, fit, upkeep, wear and native baseline',()=>{
 const key=JSON.stringify({id:'coat'}),old=JSON.stringify({id:'pants'});
 const context={definitions:[{id:'coat',label:'Known coat',equipment:{slot:'torso',baseDefense:20,weight:6,layer:1,coverage:{chest:1},forms:['human'],fitFlag:'fit',unfitMultiplier:.5}}],equipment:{torso:old},state:{},body:{form:'human',ownerId:'player',controllerId:'player'},facts:{fit:false},wearByKey:{[key]:.5}};
 const items={[key]:{equip_slot:'torso',tags:{structuredEquipment:true},getDefense:()=>0,getName:()=>'Known coat'},[old]:{equip_slot:'torso',tags:{},getDefense:()=>3,getName:()=>'Old coat'}};
 const before=structuredClone(context),model=compareWornEquipment(context,key,k=>items[k]),def=model.rows.find(r=>r.label==='Equipment defense');
 assert.deepEqual([def.current,def.worn,def.delta],[3,5,2]);
 assert.equal(def.worn,projectStructuredEquipment({...context,equipment:{torso:key}}).defenseByKey[key]);assert.deepEqual(context,before);
 context.body.form='other';assert.equal(compareWornEquipment(context,key,k=>items[k]).rows[0].worn,0);
 assert(!JSON.stringify(model).includes('fitFlag'));assert(!JSON.stringify(model).includes('ownerId'));
});
