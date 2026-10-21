import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../scripts/headless/runner.mjs';

// Synthetic fixture reaches native late crafting consumers. It does not stand in
// for the ordinary acquisition/browser journey recorded by the coordinator.
test('IS1–IS4 native consumers: inspect, cross-category return, exact craft, assembly durability, learning and stale stock',async()=>{
 const g=await boot(null,{seed:19}),n=g.internals;
 n.global_flags.is_crafting_unlocked=true;
 n.current_location.crafting={isUnlocked:()=>true,tiers:{crafting:1,forging:1,smelting:1,woodworking:1,cooking:1,alchemy:1,butchering:1}};
 n.character.addToInventory([{item_id:'Iron ingot',count:5}]);
 await g.call('openCraftingWindow');await g.call('switchCraftingRecipesPage','forging');await g.call('switchCraftingRecipesSubpage','components');
 await g.click('[data-crafting_category="forging"][data-crafting_subcategory="components"] [data-recipe_id="Short blade"] .recipe_name');
 let material=g.$('.selected_recipe .selectable_material');const key=material.dataset.item_key,before=n.character.getItems()[key].count;
 const stream=structuredClone(n.expansionState.streams);
 await g.click(material.querySelector('.recipe_comp_name'));assert.equal(n.character.getItems()[key].count,before);
 assert.deepEqual(n.expansionState.streams,stream,'inspection does not roll');
 const route=g.$('[data-crafting_category="forging"][data-crafting_subcategory="components"] [data-recipe-connections]');
 const follow=[...route.querySelectorAll('button')].find(b=>b.textContent.includes('Produces an input')&&b.textContent.includes('smelting'));
 assert.ok(follow,'cross-category producer exists');route.querySelector('summary').click();
 // Fixture's direct click skips only layout visibility; it still traverses the
 // ordinary connected button handler, unlike calling the navigation function.
 follow.click();await g.settle();
 assert.match(g.text('#crafting_detail'),/Back to Short blade/);
 g.$('#crafting_detail [data-craft-back]').click();await g.settle();
 material=g.$('[data-crafting_category="forging"][data-crafting_subcategory="components"] .selected_recipe .selected_material');
 assert.equal(material.dataset.item_key,key,'exact selected variant returns');
 assert.deepEqual(n.expansionState.streams,stream,'navigation and return do not roll');
 await g.click(material.querySelector('[data-material-craft="1"]'));assert.equal(n.character.getItems()[key].count,before-2);
 assert.ok(n.character.getLevelableComponent().recent_learning.some(r=>r.skillId==='Forging'&&r.amount>0),'native award recorded');
 // Equipment assembly uses the same durable craft boundary, not a render-only path.
 const handle=Object.values(n.item_templates).find(i=>i.component_type==='short handle');
 n.character.addToInventory([{item_id:handle.id,count:1}]);
 await g.call('switchCraftingRecipesPage','crafting');await g.call('switchCraftingRecipesSubpage','equipment');
 await g.click('[data-crafting_category="crafting"][data-crafting_subcategory="equipment"] [data-recipe_id="Dagger"] .recipe_name');
 const assembly=g.$('[data-crafting_category="crafting"][data-crafting_subcategory="equipment"] [data-recipe_id="Dagger"]');
 for(const list of assembly.children[1].children){list.querySelector('.crafting_selection').click();list.querySelector('.selectable_component').click();}
 const inputs=[...assembly.querySelectorAll('.selected_component')].map(e=>e.dataset.item_key);
 const commit=assembly.querySelector('.recipe_creation_button');
 const originalWrite=g.storage.setItem,stockBefore=JSON.stringify(n.character.getItems()),xpBefore=structuredClone(n.character.getLevelableComponent().skill_progress),learningBefore=structuredClone(n.character.getLevelableComponent().recent_learning),streamsBefore=structuredClone(n.expansionState.streams);
 g.storage.setItem=function(k,v){if(k==='save data')throw Error('Synthetic rejected assembly write');return originalWrite.call(this,k,v);};
 commit.click();await g.settle();g.storage.setItem=originalWrite;
 assert.equal(JSON.stringify(n.character.getItems()),stockBefore,'rejected assembly restores exact stock');
 assert.deepEqual(structuredClone(n.character.getLevelableComponent().skill_progress),xpBefore);assert.deepEqual(n.character.getLevelableComponent().recent_learning,learningBefore);assert.deepEqual(n.expansionState.streams,streamsBefore,'rejected assembly restores RNG');
 commit.click();await g.settle();
 assert.ok(inputs.every(k=>!n.character.getItems()[k]),'one exact component of each role consumed');
 const made=Object.values(n.character.getItems()).filter(e=>e.item.components?.head&&e.item.weapon_type==='dagger');
 assert.equal(made.reduce((c,e)=>c+e.count,0),1);
 const saved=JSON.parse(g.storage.getItem('save data'));
 assert.ok(Object.keys(saved.inventories.person.main_character).some(k=>JSON.parse(k).components?.head),'assembly durably saved');
 // Stale component choice rechecks real stock rather than selecting another key.
 await g.call('switchCraftingRecipesPage','forging');await g.call('switchCraftingRecipesSubpage','components');
 await g.click('[data-crafting_category="forging"][data-crafting_subcategory="components"] [data-recipe_id="Short blade"] .recipe_name');
 material=g.$('.selected_recipe .selectable_material');const action=material.querySelector('[data-material-craft="1"]');n.character.removeFromInventory([{item_key:key,item_count:n.character.getItems()[key].count}]);
 const counts=JSON.stringify(n.character.getItems()),rng=structuredClone(n.expansionState.streams);action.click();await g.settle();
 assert.equal(JSON.stringify(n.character.getItems()),counts);assert.deepEqual(n.expansionState.streams,rng,'stale stock does not roll');
 // Three actual matching meat stacks: a short cheap remainder pulls in one
 // complete later stack. All consumes just that group; a renewed command reaches
 // the remaining stack. This checks the native policy the detail explains.
 const meats=Object.values(n.item_templates).filter(i=>i.material_type==='raw meat').sort((a,b)=>a.getBaseValue()-b.getBaseValue()||a.getInventoryKey().localeCompare(b.getInventoryKey())).slice(0,3);
 assert.equal(meats.length,3);
 n.character.addToInventory(meats.map((i,index)=>({item_id:i.id,count:[1,5,4][index]})));
 await g.call('switchCraftingRecipesPage','butchering');await g.call('switchCraftingRecipesSubpage','items');
 await g.click('[data-crafting_category="butchering"][data-crafting_subcategory="items"] [data-recipe_id="Sinew"]');
 const groups=n.recipes.butchering.items.Sinew.get_availability();assert.equal(groups.available_ammount,3);assert.equal(groups.materials[0].items.length,2);
 await g.click('#crafting_detail [data-craft-amount="Infinity"]');
 assert.equal(n.character.getItems()[meats[0].getInventoryKey()],undefined);assert.equal(n.character.getItems()[meats[1].getInventoryKey()],undefined);assert.equal(n.character.getItems()[meats[2].getInventoryKey()].count,4);
 await g.click('#crafting_detail [data-craft-amount="Infinity"]');
 assert.equal(n.character.getItems()[meats[2].getInventoryKey()],undefined);
 assert.match(g.text('#crafting_detail'),/Can't craft yet/);
 // The new trade→known-use route can inspect recipes while trade remains open.
 // Eligibility must agree with the existing settlement owner's busy boundary.
 n.character.addToInventory([{item_id:'Iron ingot',count:2}]);
 n.traders['village trader'].setUnlocked();await g.call('start_trade','villageTrader');
 assert.equal(n.is_in_trade(),true);
 await g.call('openCraftingWindow');await g.call('switchCraftingRecipesPage','forging');await g.call('switchCraftingRecipesSubpage','components');
 await g.click('[data-crafting_category="forging"][data-crafting_subcategory="components"] [data-recipe_id="Short blade"] .recipe_name');
 material=g.$('.selected_recipe .selectable_material');assert.equal(material.querySelector('[data-material-craft="1"]').disabled,true);
 const busyStock=JSON.stringify(n.character.getItems()),busyRng=structuredClone(n.expansionState.streams);
 await g.call('useRecipe',material.parentNode,1);
 assert.equal(JSON.stringify(n.character.getItems()),busyStock);assert.deepEqual(n.expansionState.streams,busyRng);
});
