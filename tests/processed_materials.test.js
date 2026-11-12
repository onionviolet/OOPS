import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative} from './helpers/native_loader.mjs';
import {drawSpecimen,finishHarvest,createHarvest,observeCarcass,addCarcass,validateHarvest} from '../src/harvest.js';
import {FORGE_OFFCUT,IRON_SLAG,allocateComponentLots,componentCraftEntries,componentInputLots,forgeAxeHeadOutputs,gatheredIronKey,smeltIronOutputs,recipeMaterialOutput,allocatedRecipeInputs,lineagePresentation} from '../src/processed_materials.js';
import {readMaterialLineage} from '../src/material_lineage.js';
import {validateMaterialLineageEnvelope} from '../src/material_lineage_domain.js';
let native;
const n=async()=>native ||= await loadNative(`export {getItemFromKey,item_templates} from './src/items.js';export {default as Inventory} from './src/components/inventory_component.js';`,{logLevel:'error'});
function source(id,born,at){const state=createHarvest(),specimen=drawSpecimen({species:'Wolf rat',key:id,clock:born},()=>.5);addCarcass(state,specimen,{clock:at});observeCarcass(state,'Wolf rat',id,{clock:at,skill:0});observeCarcass(state,'Wolf rat',id,{clock:at,skill:50});const out=finishHarvest(state,specimen,'whole',{clock:at,skill:50,tool:1});validateHarvest(state,at);return {state,out};}

test('native material factory and actual two-holder split/merge keep independent cohort ages and source observations',async()=>{
 const a=source('old',10,50),b=source('fresh',45,50),native=await n();
 const keyA=a.out.outputs.find(r=>r.part==='fang').item_key,keyB=b.out.outputs.find(r=>r.part==='fang').item_key;
 assert.notEqual(keyA,keyB);const bag=new native.Inventory(),chest=new native.Inventory();bag.addToInventory([{item_key:keyA,count:2},{item_key:keyB,count:2}]);
 const item=bag.getItems()[keyA].item;assert.equal(item.getInventoryKey(),keyA);assert.equal(item.quality,95);assert.match(item.description,/age 0 to 100/);
 bag.removeFromInventory([{item_key:keyA,item_count:1}]);chest.addToInventory([{item_key:keyA,count:1}]);
 assert.equal(bag.getItems()[keyA].count,1);assert.equal(chest.getItems()[keyA].count,1);
 chest.removeFromInventory([{item_key:keyA,item_count:1}]);bag.addToInventory([{item_key:keyA,count:1}]);
 assert.equal(bag.getItems()[keyA].count,2);assert.equal(bag.getItems()[keyB].count,2);
 assert.equal(readMaterialLineage(keyA).facts.born,10);assert.equal(readMaterialLineage(keyB).facts.born,45);
 assert.equal(lineagePresentation(keyA,80).observations.length,2);
 const envelope={inventories:{person:{player:Object.fromEntries(Object.entries(bag.getItems()).map(([k,r])=>[k,{count:r.count}]))}}};
 validateMaterialLineageEnvelope(JSON.parse(JSON.stringify(envelope)));
 const restored=new native.Inventory();restored.addToInventory(Object.entries(JSON.parse(JSON.stringify(envelope)).inventories.person.player).map(([item_key,r])=>({item_key,count:r.count})));
 assert.deepEqual(Object.keys(restored.getItems()),[keyA,keyB]);
});

test('actual recipe allocation partially consumes exact cohorts; new product retains all consumed histories without rewriting remaining stock',async()=>{
 const native=await n(),a=source('one',0,60).out.outputs[0],b=source('two',50,60).out.outputs[0];
 const bag=new native.Inventory();bag.addToInventory([{item_key:a.item_key,count:4},{item_key:b.item_key,count:4}]);
 const groups=[{count:8,items:[bag.getItems()[a.item_key],bag.getItems()[b.item_key]]}],allocations=allocatedRecipeInputs(groups,[{count:6}],1);
 assert.deepEqual(allocations,[{item_key:a.item_key,count:4},{item_key:b.item_key,count:2}]);
 const output=recipeMaterialOutput({resultId:'Piece of wolf rat leather',count:1,quality:90,allocations,recipeId:'butchering.materials.rat-leather',clock:70,world:'base.frontier'});
 for(const r of allocations)bag.removeFromInventory([{item_key:r.item_key,item_count:r.count}]);bag.addToInventory([{item_key:output,count:1}]);
 assert.equal(bag.getItems()[a.item_key],undefined);assert.equal(bag.getItems()[b.item_key].count,2);
 const result=readMaterialLineage(output);assert.equal(result.facts.born,0);assert.equal(result.facts.quality,90);
 assert.deepEqual(result.history[0].inputs.map(r=>r.item_key),[a.item_key,b.item_key]);assert.equal(lineagePresentation(output,70).observations.length,4);
 assert.equal(bag.getItems()[output].item.getInventoryKey(),output);assert.equal(bag.getItems()[output].item.quality,90);
 assert.equal(recipeMaterialOutput({resultId:'Piece of wolf rat leather',count:1,allocations:[{item_key:'{"id":"Rat pelt"}',count:6}],recipeId:'legacy',clock:70,world:'base.frontier'}),null,'legacy stock is not assigned a fabricated birth');
});

test('lineage rejects future processes and altered source observations through the saved-envelope validator',()=>{
 const {out}=source('known',1,10),k=out.outputs[0].item_key,record=JSON.parse(k);record.lineage.history[0].inputs[0].facts.evidence.specimen.observations[0].ageEstimate.max=4;
 const bad=JSON.stringify(record);assert.throws(()=>validateMaterialLineageEnvelope({inventories:{person:{player:{[bad]:{count:1}}}}}),/harvest/);
});

// E3: one process-derived lot fact, two later recipe readers, a skill-gated route.
import {quoteHideTreatment,treatedRecipeQuality,treatmentOf,HIDE_BATCH,samePreparationQuote} from '../src/material_treatment.js';
test('hide treatments split one pelt stock into different routes that two recipes read differently',async()=>{
 const native=await n(),pelt=source('hide',0,60).out.outputs.find(r=>r.part==='pelt');assert.ok(pelt,'harvest yields a pelt');
 const inv={[pelt.item_key]:6,'{"id":"Rough wood log"}':1,'{"id":"Lamp oil"}':1},at={inventory:inv,clock:70,world:'base.frontier'};
 assert.match(quoteHideTreatment({...at,treatmentId:'oiled',skillLevel:4}).reason,/Crafting to level 5/);
 const smoked=quoteHideTreatment({...at,treatmentId:'smoked',skillLevel:0}),oiled=quoteHideTreatment({...at,treatmentId:'oiled',skillLevel:5});
 assert.ok(smoked.eligible&&oiled.eligible);assert.notEqual(smoked.receive[0].key,oiled.receive[0].key);
 assert.equal(treatmentOf(smoked.receive[0].key),'smoked');assert.equal(treatmentOf(pelt.item_key),null);
 assert.deepEqual(smoked.spend,[{key:pelt.item_key,count:HIDE_BATCH},{key:'{"id":"Rough wood log"}',count:1}]);
 const bag=new native.Inventory();bag.addToInventory([{item_key:smoked.receive[0].key,count:3}]);
 assert.equal(bag.getItems()[smoked.receive[0].key].item.getInventoryKey(),smoked.receive[0].key,'native item round-trips the treated key');
 validateMaterialLineageEnvelope({inventories:{person:{player:{[smoked.receive[0].key]:{count:3},[oiled.receive[0].key]:{count:3}}}}});
 const rows=k=>[{item_key:k,count:6}];
 assert.equal(treatedRecipeQuality(80,'Processed rat pelt',rows(smoked.receive[0].key)),90);
 assert.equal(treatedRecipeQuality(80,'Piece of wolf rat leather',rows(smoked.receive[0].key)),75);
 assert.equal(treatedRecipeQuality(80,'Piece of wolf rat leather',rows(oiled.receive[0].key)),90);
 assert.equal(treatedRecipeQuality(80,'Processed rat pelt',rows(oiled.receive[0].key)),70);
 assert.equal(treatedRecipeQuality(80,'Piece of wolf rat leather',[{item_key:smoked.receive[0].key,count:3},{item_key:pelt.item_key,count:3}]),80,'mixed batches weigh untreated pelts');
 assert.equal(treatedRecipeQuality(null,'Processed rat pelt',rows(smoked.receive[0].key)),null);
 assert.equal(quoteHideTreatment({...at,inventory:{[smoked.receive[0].key]:6,'{"id":"Rough wood log"}':1},treatmentId:'smoked',skillLevel:0}).eligible,false,'treated pelts are not re-treated');
});

test('preparation receipt carries exact spent support; stale or changed support cannot reuse reviewed terms', () => {
 const pelt='{"id":"Rat pelt"}',oilA='{"id":"Lamp oil","quality":80}',oilB='{"id":"Lamp oil","quality":90}';
 const input={treatmentId:'oiled',inventory:{[pelt]:6,[oilA]:1},skillLevel:5,clock:70,world:'base.frontier'};
 const q=quoteHideTreatment(input),before=structuredClone(input);
 assert.equal(q.eligible,true);
 const event=readMaterialLineage(q.receive[0].key).history[0];
 assert.equal(event.revision,2);
 assert.deepEqual(event.inputs[1],{item_key:oilA,count:1,facts:{quality:80},role:'support',disposition:'consumed'});
 assert.deepEqual(q.spend,event.inputs.map(r=>({key:r.item_key,count:r.count})));
 assert.deepEqual(input,before,'preview changes no stock/time/evidence');
 assert.equal(quoteHideTreatment({...input,inventory:{[pelt]:6}}).eligible,false);
 const changed=quoteHideTreatment({...input,inventory:{[pelt]:6,[oilB]:1}});
 assert.equal(samePreparationQuote(q,changed),false);
 assert.equal(samePreparationQuote(q,quoteHideTreatment({...input,clock:75})),true);
});

test('shared recipe requirements aggregate exact stock once and reject a stale partial allocation', () => {
 const key='{"id":"Rat pelt"}',item={getInventoryKey:()=>key};
 const group=count=>({items:[{item,count}]});
 assert.deepEqual(allocatedRecipeInputs([group(5),group(5)],[{count:2},{count:2}],1),[{item_key:key,count:4}]);
 assert.throws(()=>allocatedRecipeInputs([group(3),group(3)],[{count:2},{count:2}],1),/stock changed/);
});

test('two prepared portions of one source retain both parents but display each source observation once', () => {
 const pelt=source('shared-source',0,60).out.outputs.find(r=>r.part==='pelt').item_key;
 const inventory={[pelt]:6,'{"id":"Lamp oil"}':1,'{"id":"Rough wood log"}':1};
 const make=treatmentId=>quoteHideTreatment({treatmentId,inventory,skillLevel:5,clock:70,world:'base.frontier'}).receive[0].key;
 const a=make('smoked'),b=make('oiled');
 const product=recipeMaterialOutput({resultId:'Processed rat pelt',count:1,quality:80,
  allocations:[{item_key:a,count:3},{item_key:b,count:3}],recipeId:'butchering.materials.rat-pelt',clock:80,world:'base.frontier'});
 assert.equal(readMaterialLineage(product).history[0].inputs.length,2);
 const before=product;
 assert.equal(lineagePresentation(product,90).observations.length,2,'same source readings are not repeated through each treatment branch');
 assert.equal(product,before);
 validateMaterialLineageEnvelope({inventories:{person:{player:{[product]:{count:1}}}}});
});

test('Village forge output carries exact ingot ancestry into an equippable axe and reclaimable offcuts', async () => {
 const native = await n();
 const ingot = '{"id":"Iron ingot"}', handle = '{"id":"Wooden medium handle","quality":95}';
 const request = {resultId:'Iron axe head',allocations:[{item_key:ingot,count:8}],stock:{[ingot]:8},
  crafted:{90:1,105:1},clock:75,world:'base.frontier'};
 const [head, betterHead, offcuts] = forgeAxeHeadOutputs(request);
 assert.equal(offcuts.count,2);
 assert.equal(JSON.parse(offcuts.item_key).id,FORGE_OFFCUT);
 assert.equal(native.getItemFromKey(offcuts.item_key).getInventoryKey(),offcuts.item_key);
 assert.equal(native.getItemFromKey(head.item_key).getInventoryKey(),head.item_key);
 assert.equal(native.getItemFromKey(betterHead.item_key).quality,105);
 assert.throws(()=>forgeAxeHeadOutputs({...request,stock:{[ingot]:7}}),/stale or insufficient/);
 assert.throws(()=>forgeAxeHeadOutputs({...request,allocations:[{item_key:ingot,count:7}]}),/every input unit/);
 const axeKey = recipeMaterialOutput({resultId:'Iron chopping axe',count:1,
  allocations:[{item_key:head.item_key,count:1},{item_key:handle,count:1}],
  recipeId:'forging.iron_axe',clock:79,world:request.world});
 const axe = native.getItemFromKey(axeKey);
 assert.equal(axe.getInventoryKey(),axeKey);
 assert.equal(axe.equip_slot,'axe');
 const parents = readMaterialLineage(axeKey).history[0].inputs;
 assert.deepEqual(parents.map(row=>row.item_key),[head.item_key,handle]);
 assert.equal(readMaterialLineage(parents[0].item_key).history[0].inputs[0].item_key,ingot);
 validateMaterialLineageEnvelope({inventories:{person:{player:{[axeKey]:{count:1},[offcuts.item_key]:{count:2}}}}});
});

test('smelting joins mined lots and spent fuel, and leaves a durable outcome on failure', async () => {
 const native = await n();
 const ore = gatheredIronKey({id:'Iron ore',count:3,world:'base.frontier',location:'Nearby cave',activity:'mining2',clock:20});
 assert.equal(native.getItemFromKey(ore).getInventoryKey(),ore);
 assert.deepEqual(readMaterialLineage(ore).history[0].parameters,{location:'Nearby cave',activity:'mining2'});
 const otherOre = gatheredIronKey({id:'Iron ore',count:2,world:'base.frontier',location:'Nearby cave',activity:'mining2',clock:24});
 const fuel = '{"id":"Charcoal"}';
 const request = {resultId:'Iron ingot',recipeId:'Iron ingot',attempts:1,allocations:[
  {item_key:ore,count:3},{item_key:otherOre,count:2},{item_key:fuel,count:1}
 ],world:'base.frontier',clock:35};
 const [ingot, slag] = smeltIronOutputs({...request,count:1});
 assert.equal(native.getItemFromKey(ingot.item_key).getInventoryKey(),ingot.item_key);
 const event = readMaterialLineage(ingot.item_key).history[0];
 assert.deepEqual(event.inputs.map(row=>row.item_key),[ore,otherOre,fuel]);
 assert.equal(event.inputs[2].disposition,'consumed');
 assert.equal(JSON.parse(slag.item_key).id,IRON_SLAG);
 const failed = smeltIronOutputs({...request,count:0});
 assert.equal(failed.length,1);
 assert.equal(native.getItemFromKey(failed[0].item_key).id,IRON_SLAG);
 assert.equal(readMaterialLineage(failed[0].item_key).history[0].parameters.lostMetalUnits,100);
 validateMaterialLineageEnvelope({inventories:{person:{player:{[ingot.item_key]:{count:1},[failed[0].item_key]:{count:1}}}}});
 assert.throws(()=>smeltIronOutputs({...request,count:1,allocations:request.allocations.slice(1)}),/every input unit/);
 assert.equal(gatheredIronKey({id:'Rough wood log',world:'base.frontier'}),null);
});

test('axe-head forging fills a selected grade across spendable lots in stable order', () => {
 const iron = 'Iron ingot', row = (id, count) => ({item:{id}, count});
 const inventory = {b:row(iron,2), a:row(iron,2), reserved:row(iron,5), steel:row('Steel ingot',8)};
 const available = key => key !== 'reserved';
 const lots = componentInputLots(inventory, 'b', 'Iron axe head', 'base.frontier', available);
 assert.deepEqual(allocateComponentLots(lots,3),[{item_key:'b',count:2},{item_key:'a',count:1}]);
 assert.throws(()=>allocateComponentLots(lots,5),/no longer sufficient/);
 assert.deepEqual(componentInputLots(inventory,'reserved','Iron axe head','base.frontier',available),[]);
 assert.deepEqual(componentInputLots(inventory,'b','Iron short blade','base.frontier',available),[{item_key:'b',count:2}]);
});

test('a worked medium handle retains its log through native assembly', async () => {
 const native = await n();
 const log = '{"id":"Wood log"}';
 const prepared = recipeMaterialOutput({resultId:'Processed wood',recipeId:'Processed wood',clock:30,world:'base.frontier',
  count:3,allocations:[{item_key:log,count:1}]});
 assert.equal(native.getItemFromKey(prepared).getInventoryKey(),prepared);
 const [handle] = componentCraftEntries({parsedKey:{id:'Wooden medium handle'},clock:40,world:'base.frontier',
  crafted:{95:1},allocations:[{item_key:prepared,count:2}]});
 assert.equal(native.getItemFromKey(handle.item_key).quality,95);
 const head = '{"id":"Iron axe head","quality":90}';
 const axe = recipeMaterialOutput({resultId:'Iron chopping axe',recipeId:'Iron chopping axe',clock:50,world:'base.frontier',
  count:1,allocations:[{item_key:head,count:1},{item_key:handle.item_key,count:1}]});
 const source = readMaterialLineage(axe).history[0].inputs[1].item_key;
 const preparedKey = readMaterialLineage(source).history[0].inputs[0].item_key;
 assert.equal(readMaterialLineage(preparedKey).history[0].inputs[0].item_key,log);
 assert.throws(()=>componentCraftEntries({parsedKey:{id:'Ash wood medium handle'},clock:40,world:'base.frontier',
  crafted:{95:1},allocations:[{item_key:prepared,count:2}]}),/selected wood grade/);
 validateMaterialLineageEnvelope({inventories:{person:{player:{[axe]:{count:1}}}}});
});
