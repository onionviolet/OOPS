import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {createDomainRegistry} from '../src/domain_registry.js';
import {beginSimulationRenderBatch,endSimulationRenderBatch} from '../src/simulation_render.js';
import {quoteCrafting} from '../src/crafting_frontier_runtime.js';
// UIE13/UIE14: a domain panel drawn while saving was still restoring must not keep a stale disabled Gather
// once native readiness changes with zero ticks advanced, and it names the gate that holds.
test('registry refresh redraws a paused crafting home after readiness changes, batched and without ticks',async()=>{
 const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="main_content"></div></body></html>');globalThis.document=dom.document;
 try{
  const {createCraftingHome}=await import('../src/crafting_home.js');
  const native={blocked:'Wait for the save to finish restoring.',world:'base.frontier',location:'Village',clock:51000000,root:7,inventory:{}};
  const read=()=>({materials:[],products:[],blocked:native.blocked,world:native.world,location:native.location,discovered:true});
  const quote=request=>quoteCrafting(null,native.inventory,request,native);
  const registry=createDomainRegistry();let panel,ticks=0;
  registry.registerDomain({id:'crafting',tick:()=>ticks++,refresh:()=>panel.render(),panels:[()=>{panel=createCraftingHome({read,quote,execute:()=>{}});}]});
  registry.mountPanels();
  const gather=()=>dom.document.getElementById('crafting_gather');
  assert.equal(gather().disabled,true);assert.equal(gather().title,'Wait for the save to finish restoring.');
  native.blocked='';
  beginSimulationRenderBatch();registry.refresh();assert.equal(gather().disabled,true,'refresh waits for the existing render batch');
  endSimulationRenderBatch(null);assert.equal(gather().disabled,false);assert.equal(gather().title,'');
  native.blocked='This tab is read-only. Close the other game tab and reload to save progress.';registry.refresh();
  assert.equal(gather().disabled,true);assert.equal(gather().title,native.blocked);assert.equal(ticks,0);
 }finally{globalThis.document=previous;}
});

// DRC9: an observed preparation's drink action names what was seen; an unknown one keeps "Drink one".
test('DRC9: Drink one names observed effects and stays plain when nothing is known',async()=>{
 const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="main_content"></div></body></html>');globalThis.document=dom.document;
 try{
  const {createCraftingHome}=await import('../src/crafting_home.js');
  const products=[{key:'known',count:1,name:'Steep (health)',effects:[{route:'oral',effect:'health',value:3},{route:'oral',effect:'poison',value:1}]},{key:'unknown',count:2,name:'Unidentified steep',effects:[]}];
  const read=()=>({materials:[],products,blocked:'',world:'base.frontier',location:'Village',discovered:true});
  const panel=createCraftingHome({read,quote:()=>({eligible:true,reason:''}),execute:()=>{}});panel.render();
  const label=key=>dom.document.querySelector(`[data-crafted-use="${key}"]`).textContent;
  assert.equal(label('known'),'Drink one · observed health 3, poison 1');
  assert.equal(label('unknown'),'Drink one');
 }finally{globalThis.document=previous;}
});
