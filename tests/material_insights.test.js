import test from 'node:test';
import assert from 'node:assert/strict';
import {materialInsights,acquiredMaterialIds,inventoryGains} from '../src/material_insights.js';
import {createAcquisitionLesson,stageRevealKnowledge} from '../src/reveal_chain.js';
const key=id=>JSON.stringify({id});
function fixture(){
 const learned=new Set(['Weak healing powder']),seen=new Set(),facts={};
 const recipe={id:'Healing powder',name:'Healing powder',isUnlocked:()=>learned.has('Healing powder'),recipe_skill:'Alchemy',recipe_level:[5,15],materials:[{material_id:'Golmoon leaf',count:3},{material_id:'Silver thistle',count:3}]};
 const context={facts,worldId:'base.frontier',recipes:{alchemy:{items:{'Weak healing powder':{id:'Weak healing powder',isUnlocked:()=>learned.has('Weak healing powder')},'Healing powder':recipe}}},known:id=>seen.has(id),level:()=>5};
 return {context,seen,learned};
}
for(const order of [['Golmoon leaf','Silver thistle'],['Silver thistle','Golmoon leaf']])test(`insight follows either encounter order, keeps knowledge without stock: ${order.join(', ')}`,()=>{
 const {context,seen,learned}=fixture(),messages=[],stock={};let refresh=0,grants=0;
 const acquire=createAcquisitionLesson({canWrite:()=>true,read:()=>context,unlock:rows=>{grants++;for(const r of rows)learned.add(r.recipe_id);},notify:x=>messages.push(x),refresh:()=>refresh++});
 for(const id of order){seen.add(id);stock[id]={item:{id},count:1};acquire(stock,[{item_key:key(id),count:1}]);delete stock[id];}
 assert.equal(grants,1);assert.equal(messages.length,1);assert.equal(refresh,1);assert.ok(learned.has('Healing powder'));assert.deepEqual(stock,{});
 assert.match(messages[0],/Crafting still needs its full materials/);
 acquire({},[{item_id:order[0],count:1}]);assert.equal(grants,1);
});
test('reading a potential insight cannot learn, consume or succeed; native means remain required',()=>{
 const {context,seen,learned}=fixture();seen.add('Golmoon leaf');seen.add('Silver thistle');const gained=new Set(['Silver thistle']);
 assert.equal(materialInsights(context,gained).length,1);assert.deepEqual([...learned],['Weak healing powder']);
 for(const changed of [{worldId:'elsewhere'},{level:()=>4},{known:id=>id==='Golmoon leaf'}])assert.deepEqual(materialInsights({...context,...changed},gained),[]);
 learned.clear();assert.deepEqual(materialInsights(context,gained),[]);learned.add('Weak healing powder');
 assert.deepEqual(materialInsights(context,new Set(['unrelated'])),[]);
 assert.deepEqual([...acquiredMaterialIds([{item_id:'Golmoon leaf',count:0},{item_id:'Silver thistle',count:-1},{item_key:key('Coal'),count:1}])],['Coal']);
 assert.deepEqual([...inventoryGains({[key('Golmoon leaf')]:2},{[key('Golmoon leaf')]:1})],[]);
});
test('transaction infers once from staged gain plus remembered material without mutating live knowledge or prior stock',()=>{
 const {context,seen,learned}=fixture();seen.add('Golmoon leaf');const previous={};
 const plan={state:{actors:{player:{worldId:'base.frontier',facts:{}}}},gameplay:{player:{inventory:{[key('Silver thistle')]:1}}},external:{money:1}};
 stageRevealKnowledge(plan,previous,1,context);assert.deepEqual(plan.unlocks,[{kind:'recipe',id:'Healing powder'}]);assert.equal(plan.materialInsights.length,1);
 stageRevealKnowledge(plan,previous,1,context);assert.equal(plan.unlocks.length,1);assert.equal(plan.materialInsights.length,1);
 assert.deepEqual(previous,{});assert.equal(learned.has('Healing powder'),false);assert.equal(seen.has('Silver thistle'),false);
 const unchanged={state:structuredClone(plan.state),gameplay:structuredClone(plan.gameplay),external:{money:1}};
 stageRevealKnowledge(unchanged,unchanged.gameplay.player.inventory,1,context);assert.equal(unchanged.unlocks,undefined);
});
test('restore and unavailable writer cannot settle acquisition lessons',()=>{
 const {context,seen,learned}=fixture();seen.add('Golmoon leaf');seen.add('Silver thistle');
 const acquire=createAcquisitionLesson({canWrite:()=>false,read:()=>{throw Error('must not read');},unlock:()=>assert.fail(),notify:()=>assert.fail(),refresh:()=>assert.fail()});
 acquire({},[{item_id:'Silver thistle',count:1}]);assert.equal(learned.has('Healing powder'),false);
});

test('native catalog binds every final item recipe id to its own persistent unlock component',async()=>{
 const {loadNative,STANCE_LOCATION_STUBS}=await import('./helpers/native_loader.mjs');
 const native=await loadNative(`export {recipes} from './src/crafting_recipes.js';export {availabilities} from './src/data/component_references.js';`,{stubs:STANCE_LOCATION_STUBS,prefix:'insight-bindings-'});
 for(const pages of Object.values(native.recipes))for(const [id,recipe]of Object.entries(pages.items || {}))assert.equal(native.availabilities.recipe[id],recipe.getAvailabilityComponent(),id);
 const recipe=native.recipes.alchemy.items['Healing powder'];assert.equal(recipe.getAvailabilityComponent().is_unlocked,false);
 assert.equal(native.availabilities.recipe.undefined,undefined);
 const {prepareNativeUnlocks}=await import('../src/native_unlock_transaction.js');
 const before={availabilities:{recipe:{'Healing powder':0}}};
 const plan=prepareNativeUnlocks([{kind:'recipe',id:recipe.id}],{availabilities:native.availabilities,flags:{}});
 plan.write(before);assert.equal(before.availabilities.recipe['Healing powder'],1);assert.equal(recipe.getAvailabilityComponent().is_unlocked,false);
 plan.publish();assert.equal(recipe.getAvailabilityComponent().is_unlocked,true);
});
