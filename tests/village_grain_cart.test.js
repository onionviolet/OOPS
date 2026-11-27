import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAIN_APPLE_ACTION,GRAIN_CART_METHODS} from '../src/village_grain_cart.js';
import {prepareV06Save} from '../src/save_migration.js';
import {loadNative} from './helpers/native_loader.mjs';
const {locations}=await loadNative('export {locations} from "./src/data/locations.js";');

test('supplied native grain method requires actual food both before work and at settlement',()=>{
 const action=locations.Village.actions[GRAIN_APPLE_ACTION],availability=action.getAvailabilityComponent();
 availability.setStatus({is_unlocked:true});let count=1;
 const context={character:{getFullStats:()=>({}),getItems:()=>({[JSON.stringify({id:'Apple'})]:{count}})}};
 assert.equal(!!availability.canBeStarted(context),false);
 assert.equal(availability.get_conditions_status(context),0);
 count=2;assert.equal(!!availability.canBeStarted(context),true);assert.equal(availability.get_conditions_status(context),1);
 count=0;assert.equal(availability.get_conditions_status(context),0,'eating or losing the apples before completion cannot deliver the cart');
 assert.equal(availability.start_conditions[0].items_by_id.Apple.remove,undefined,'starting reserves no food to refund or double-debit');
 assert.equal(availability.success_conditions[0].items_by_id.Apple.remove,true);
 assert.deepEqual(action.success_chances,[1]);
});

test('every cart solution closes the alternatives and supplies the same downstream mill receipt',()=>{
 const added=locations.Village.actions[GRAIN_APPLE_ACTION];
 assert.equal(added.attempt_duration,30);
 assert.deepEqual(added.rewards.move_to,locations.Village.actions['convince horse'].rewards.move_to);
 assert.deepEqual(added.rewards.textlines,locations.Village.actions['convince horse'].rewards.textlines);
 for(const id of [...GRAIN_CART_METHODS,GRAIN_APPLE_ACTION]){
  const action=locations.Village.actions[id];
  for(const other of [...GRAIN_CART_METHODS,GRAIN_APPLE_ACTION].filter(x=>x!==id))assert.ok(action.rewards.locks.actions.some(r=>r.location==='Village'&&r.action===other),`${id} closes ${other}`);
 }
 assert.ok(locations.Village.actions['search for delivery'].rewards.actions.some(r=>r.action===GRAIN_APPLE_ACTION));
});

test('existing open carts gain the supplied method without reopening delivered carts or changing explicit flags',()=>{
 for(const old of GRAIN_CART_METHODS){
  const input={'game version':'v0.6',availabilities:{action:{[old]:1}}},before=structuredClone(input);
  const migrated=prepareV06Save(input);
  assert.equal(migrated.availabilities.action[GRAIN_APPLE_ACTION],1);assert.deepEqual(input,before);
  assert.deepEqual(prepareV06Save(migrated),migrated);
  input.availabilities.action[old]=3;
  assert.equal(prepareV06Save(input).availabilities.action[GRAIN_APPLE_ACTION],3,'delivered work stays closed');
 }
 for(const flag of [0,1,3,4,5,7]){
  const input={'game version':'v0.6',availabilities:{action:{'carry grain':1,[GRAIN_APPLE_ACTION]:flag}}};
  assert.deepEqual(prepareV06Save(input),input,'explicit current choice status is authoritative');
 }
 for(const action of [{},{'search for delivery':3},{'carry grain':0},{'carry grain':5}]){
  const input={'game version':'v0.6',availabilities:{action}};
  assert.deepEqual(prepareV06Save(input),input,'no cart discovery is manufactured');
 }
});

test('legacy location action flags migrate through the same native availability owner',()=>{
 for(const [status,wanted] of [[{is_unlocked:true},1],[{is_unlocked:true,is_finished:true},3]]){
  const input={'game version':'v0.5.5.30',locations:{Village:{actions:{'convince horse':status}}}};
  const migrated=prepareV06Save(input);
  assert.equal(migrated.availabilities.action[GRAIN_APPLE_ACTION],wanted);
  assert.deepEqual(prepareV06Save(migrated),migrated);
 }
});
