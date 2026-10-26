import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative} from './helpers/native_loader.mjs';
import {drawSpecimen,finishHarvest,createHarvest,observeCarcass,addCarcass,validateHarvest} from '../src/harvest.js';
import {recipeMaterialOutput,allocatedRecipeInputs,lineagePresentation} from '../src/processed_materials.js';
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
