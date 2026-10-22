import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteCrafting,stageCrafting,validateCraftingEnvelope,projectCrafting,validateCraftedExposure,craftedExposure,bindingExposure,shortenPoison,BIND_ID,materialKey,catalogue,materialFromKey} from '../src/crafting_frontier_runtime.js';
const context={blocked:'',world:'base.frontier',location:'Village',clock:51000000,root:123};
function apply(inventory,plan){const next={...inventory};for(const i of plan.items){next[i.key]=(next[i.key]||0)+i.amount;if(!next[i.key])delete next[i.key];}return next;}
function gather(){const p=stageCrafting(null,{},quoteCrafting(null,{},{type:'harvest'},context),context);return {owner:p.state,inventory:apply({},p)};}
test('native crafting preserves exact stock and knowledge across source, batch and oral use',()=>{
 let {owner,inventory}=gather();const material=Object.keys(inventory)[0],before=structuredClone(owner);
 const q=quoteCrafting(owner,inventory,{type:'craft',inputs:[{key:material,qty:1}]},context);
 assert.deepEqual(owner,before);const p=stageCrafting(owner,inventory,q,context);owner=p.state;inventory=apply(inventory,p);
 const key=p.items.find(i=>i.amount>0).key;
 assert.equal(projectCrafting(owner,inventory).products[0].identified,false);
 const used=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,{type:'use',key},context),context);
 assert.ok(used.effect.effects.stats.health_regeneration_flat.flat>0);
 assert.equal(apply(inventory,used)[key],undefined);assert.ok(used.state.knowledge.player);
 validateCraftedExposure(used.effect,owner.products[used.effect.craftExposure.product]);
});
test('stale quotes, reserved/absent materials and unsupported or dangling references fail without mutation',()=>{
 const {owner,inventory}=gather(),copy=structuredClone(owner),key=Object.keys(inventory)[0];
 const q=quoteCrafting(owner,inventory,{type:'craft',inputs:[{key,qty:1}]},context);
 assert.throws(()=>stageCrafting(owner,inventory,q,{...context,clock:context.clock+1}),/quote changed/);
 assert.equal(quoteCrafting(owner,{},q.request,context).eligible,false);
 const held=quoteCrafting(owner,inventory,q.request,{...context,blocked:'Restore writable saving.'});
 assert.equal(held.eligible,false);assert.equal(held.reason,'Restore writable saving.');
 assert.throws(()=>validateCraftingEnvelope(null,{inventories:{player:inventory}}),/reference/);
 const bad=structuredClone(owner);bad.schema=99;assert.throws(()=>validateCraftingEnvelope(bad,{}));assert.deepEqual(owner,copy);
});
test('generated source determinism, capacity and freeze survive JSON roundtrip across three roots',()=>{
 for(const root of [1,7,123]){const c={...context,root};let owner=null,inventory={};
  for(let i=0;i<12;i++){
   const q=quoteCrafting(owner,inventory,{type:'harvest'},c);if(!q.eligible)break;
   const a=stageCrafting(owner,inventory,q,c),b=stageCrafting(owner?JSON.parse(JSON.stringify(owner)):null,{...inventory},q,c);assert.deepEqual(a,b);
   owner=a.state;inventory=apply(inventory,a);validateCraftingEnvelope(owner,{inventories:{player:inventory}});
  }
  assert.equal(quoteCrafting(owner,inventory,{type:'harvest'},c).eligible,false);
 }
});
test('saved exposures reject altered dose, duration and product even if the product remains owned',()=>{
 const {owner,inventory}=gather(),p=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,{type:'craft',inputs:[{key:Object.keys(inventory)[0],qty:1}]},context),context);
 const product=Object.values(p.state.products)[0],effect=craftedExposure(product,context.clock);
 for(const alter of [e=>e.effects.stats.health_regeneration_flat.flat++,e=>e.duration=13,e=>e.craftExposure.product='missing',e=>e.tags.buff=true]){
  const bad=structuredClone(effect);alter(bad);assert.throws(()=>validateCraftedExposure(bad,product));
 }
});

function gatherSalt(){
 for(let root=1;root<200;root++){const c={...context,root},p=stageCrafting(null,{},quoteCrafting(null,{},{type:'harvest'},c),c);
  if(p.items.some(i=>materialFromKey(i.key,p.state).material.family==='riversalt'))return {owner:p.state,inventory:apply({},p),ctx:c};}
 throw Error('no salt harvest in 200 roots');
}
test('binder journey: harvest salt, brew, drink; poison conditions shorten and the saved mark validates',()=>{
 let {owner,inventory,ctx}=gatherSalt();const key=Object.keys(inventory).find(k=>materialFromKey(k,owner).material.family==='riversalt');
 const made=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,{type:'craft',inputs:[{key,qty:1}]},ctx),ctx);
 owner=made.state;inventory=apply(inventory,made);const product=Object.values(owner.products)[0];
 assert.ok(product.outputs.oral.bind>0);assert.equal(product.outputs.oral.health,undefined);
 const used=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,{type:'use',key:made.items.find(i=>i.amount>0).key},ctx),ctx);
 assert.equal(used.effect,null,'a pure binder leaves the tonic effect alone');
 const strength=product.outputs.oral.bind;assert.equal(used.binding.strength,strength);
 const saved=JSON.parse(JSON.stringify(used.binding.effect));
 validateCraftedExposure(saved,product,BIND_ID);validateCraftingEnvelope(used.state,{active_effects:{[BIND_ID]:saved}});
 for(const alter of [e=>e.craftExposure.binds++,e=>e.duration=61,e=>e.craftExposure.product='missing',e=>e.effects.stats.strength={flat:5},e=>e.description='x'])
  {const bad=structuredClone(saved);alter(bad);assert.throws(()=>validateCraftedExposure(bad,product,BIND_ID));}
 assert.throws(()=>validateCraftedExposure(saved,product,'Other'));
 const poisons={Venom:{tags:{poison:true},duration:strength+10},Brief:{tags:{poison:true},duration:strength},Chill:{tags:{debuff:true},duration:99}};
 assert.deepEqual(shortenPoison(poisons,strength),[{id:'Venom',duration:10},{id:'Brief',duration:null}]);
 assert.equal(bindingExposure(product,ctx.clock).craftExposure.binds,strength);
});
test('an herbal tonic with no ash binds nothing and keeps its own effect',()=>{
 const {owner,inventory}=gather(),ctx=context,p=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,{type:'craft',inputs:[{key:Object.keys(inventory)[0],qty:1}]},ctx),ctx);
 const used=stageCrafting(p.state,apply(inventory,p),quoteCrafting(p.state,apply(inventory,p),{type:'use',key:p.items.find(i=>i.amount>0).key},ctx),ctx);
 assert.equal(used.binding,null);assert.ok(used.effect);
});
