import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../scripts/headless/runner.mjs';
import {createHarvest,drawSpecimen,addCarcass} from '../src/harvest.js';
import {calendarMinutes} from '../src/world_rhythm.js';

test('native session notes compare a real departure/return and clear across load',async t=>{
    const g=await boot(null,{seed:19,heroName:null});t.after(()=>g.close());const n=g.internals; // Controlled location fixture; travel duration is outside this observer regression.
    assert.ok(g.$('#palette_feedback_panel'),'observer domain mounts in the native registry');
    await g.call('change_location',{location_id:'Village',skip_travel_time:true});
    n.locations.Shack.setUnlocked();
    await g.call('change_location',{location_id:'Shack',skip_travel_time:true});
    assert.equal(n.current_location.id,'Shack');
    n.character.addToInventory([{item_id:'Stale bread',count:1}]);
    await g.step(1);
    await g.call('change_location',{location_id:'Village',skip_travel_time:true});
    const notes=g.text('#palette_feedback_panel');
    assert.match(notes,/Stale bread/);
    assert.match(notes,/previous visit snapshot|Previous visit snapshot/);
    await g.save();await g.reload();
    assert.doesNotMatch(g.text('#palette_feedback_panel'),/previously|more changes in Details/);
    assert.deepEqual(g.errors,[]);
});

test('native finite craft goal survives stock interruption and navigation; continue rechecks and never repeats paid attempts',async t=>{
 const g=await boot(null,{seed:19}),n=g.internals;t.after(()=>g.close());
 n.global_flags.is_crafting_unlocked=true;n.current_location.crafting={isUnlocked:()=>true,tiers:{butchering:1}};
 const meats=Object.values(n.item_templates).filter(i=>i.material_type==='raw meat').sort((a,b)=>a.getBaseValue()-b.getBaseValue()||a.getInventoryKey().localeCompare(b.getInventoryKey())).slice(0,3);
 n.character.addToInventory(meats.map((i,index)=>({item_id:i.id,count:[1,5,4][index]})));
 await g.call('openCraftingWindow');await g.call('switchCraftingRecipesPage','butchering');await g.call('switchCraftingRecipesSubpage','items');
 await g.click('[data-crafting_category="butchering"][data-crafting_subcategory="items"] [data-recipe_id="Sinew"]');
 await g.click('#crafting_detail [data-craft-amount="5"]');assert.match(g.text('[data-craft-goal]'),/3 of 5 attempts/);
 await g.call('switchCraftingRecipesPage','crafting');await g.call('switchCraftingRecipesPage','butchering');await g.call('switchCraftingRecipesSubpage','items');
 assert.match(g.text('[data-craft-goal]'),/3 of 5 attempts/);await g.click('[data-craft-continue]');assert.match(g.text('[data-craft-goal]'),/5 of 5 attempts/);assert.match(g.text('[data-craft-goal]'),/Goal finished/);
 assert.equal(n.character.getItems()[meats[2].getInventoryKey()],undefined);await g.click('[data-craft-cancel-goal]');assert.equal(g.$('[data-craft-goal]'),null);assert.deepEqual(g.errors,[]);
});


test('finite routine native write rejection restores intent and stock; known native learning drives the Body response',async t=>{
 const g=await boot(null,{seed:19});t.after(()=>g.close());const seed=await g.save(),clock=calendarMinutes(seed['current time']);
 seed.harvest=createHarvest();seed.availabilities.skill.Butchering=1;seed.levels.person.main_character.skill_xp.Butchering=99;
 for(let i=0;i<2;i++)addCarcass(seed.harvest,drawSpecimen({species:'Wolf rat',key:`native:goal:${i}`,clock},()=>.5),{clock,skill:0,tool:0});
 await g.load(seed);g.$('#harvest_panel').open=true;const before=structuredClone(globalThis.simulationTestHooks.project('harvest').state),durable=g.storage.getItem('save data'),inventory=JSON.stringify(g.internals.character.getItems()),write=g.storage.setItem;
 g.storage.setItem=function(k,v){if(k==='save data')throw Error('Synthetic rejected routine write');return write.call(this,k,v);};
 g.$('[data-harvest-target]').value='2';g.$('[data-harvest="routine"]').click();await g.settle();g.storage.setItem=write;
 assert.deepEqual(globalThis.simulationTestHooks.project('harvest').state,before);assert.equal(JSON.stringify(g.internals.character.getItems()),inventory);assert.equal(g.storage.getItem('save data'),durable);
 await g.reload();g.$('#harvest_panel').open=true;g.$('[data-harvest-target]').value='1';g.$('[data-harvest="routine"]').click();await g.step(1);const remaining=globalThis.simulationTestHooks.project('harvest').state.job.remaining;await g.step(remaining);
 assert.equal(globalThis.simulationTestHooks.project('harvest').state.routine.status,'complete');assert.match(g.text('.body-expression-detail'),/Butchering improves to 2/);assert.equal(g.$('.body-expression .palette-body-pose').dataset.pose,'steady-hands');
 await g.save();await g.reload();assert.equal(g.$('.body-expression').hidden,true,'a load clears prior response rather than replaying it');assert.deepEqual(g.errors,[]);
});
