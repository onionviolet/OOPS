import test from 'node:test';
import assert from 'node:assert/strict';
import {createCraftBatchGoal,craftBatchGoal} from '../src/craft_batch_goal.js';
import {domainRegistry} from '../src/domain_registry.js';
test('explicit finite goal retains actual failures and remainder until cancelled or loaded',()=>{
 const g=createCraftBatchGoal();g.start('recipe',10);g.settle('recipe',{attempted:3,successful:2,made:4});assert.deepEqual(g.read(),{key:'recipe',target:10,attempted:3,successful:2,made:4});
 assert.throws(()=>g.settle('other',{attempted:1,successful:1,made:1}));assert.throws(()=>g.settle('recipe',{attempted:8,successful:1,made:1}));
 g.settle('recipe',{attempted:7,successful:0,made:0});assert.equal(g.read().attempted,10);assert.equal(g.read().made,4);g.clear();assert.equal(g.read(),null);
 craftBatchGoal.start('native',5);domainRegistry.load({});assert.equal(craftBatchGoal.read(),null);
});
