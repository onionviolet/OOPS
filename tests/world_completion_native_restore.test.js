import test from 'node:test';
import assert from 'node:assert/strict';
import {worldCompletionStripKey} from '../src/world_completion_strip.js';
import {worldCompletionSavedNativeItem,preserveWorldCompletionNativeItem} from '../src/world_completion_native.js';

const stamp={sampleCause:'simulation:10',measuredCause:'simulation:12',productionCause:'simulation:20',makerId:'player'};
const getItemFromKey=key=>preserveWorldCompletionNativeItem(key,{id:'Measured drain strip',getInventoryKey(){return this.inventory_key;}});
test('the saved-item helper preserves the canonical key and datum instead of the template key',()=>{
 const key=worldCompletionStripKey(stamp),item=getItemFromKey(key);
 assert.deepEqual(worldCompletionSavedNativeItem(key,{count:1},getItemFromKey),{item_key:key,count:1});
 assert.equal(item.getInventoryKey(),key);
 assert.deepEqual(item.datum,{schema:1,...stamp});
});
test('plain legacy stock gains no stamp and malformed or duplicate stamped stock is rejected',()=>{
 assert.equal(worldCompletionSavedNativeItem(JSON.stringify({id:'Measured drain strip'}),{count:1},getItemFromKey),null);
 const key=worldCompletionStripKey(stamp);
 assert.throws(()=>worldCompletionSavedNativeItem(key,{count:2},getItemFromKey),/Invalid saved/);
 assert.throws(()=>worldCompletionSavedNativeItem(JSON.stringify({id:'Measured drain strip',datum:{schema:1}}),{count:1},getItemFromKey),/Unsupported measured/);
});
