import test from 'node:test';
import assert from 'node:assert/strict';
import InventoryComponent,{inventories,configureInventoryItems} from '../src/components/inventory_component.js';
import {inventories as shared} from '../src/data/component_references.js';

test('inventory imports without the catalog, then uses the catalog operations for keyed and template items',()=>{
 assert.strictEqual(inventories,shared);
 const inv=new InventoryComponent(),calls=[];
 assert.throws(()=>inv.addToInventory([{item_id:'Sword'}]),/not configured/);
 configureInventoryItems({fromKey:key=>{calls.push(key);return {key};},keyFromTemplate:(id,quality)=>JSON.stringify({id,...(quality?{quality}:{})})});
 const sword=JSON.stringify({id:'Sword',quality:112}),wood=JSON.stringify({id:'Wood'});
 inv.addToInventory([{item_id:'Sword',quality:112,count:2},{item_key:wood,count:3}]);
 inv.addToInventory([{item_key:sword}]);
 assert.equal(inv.getItems()[sword].count,3);assert.equal(inv.getItems()[wood].count,3);
 assert.deepEqual(calls,[sword,wood]);
 inv.removeFromInventory([{item_key:sword,item_count:2}]);assert.equal(inv.getItems()[sword].count,1);
 assert.throws(()=>inv.removeFromInventory([{item_key:'missing'}]),/not present/);
 inv.emptyInventory();assert.deepEqual(inv.getItems(),{});
});
