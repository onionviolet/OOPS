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

test('hidden experiments skip quotes and reveal current readiness before paint, including return to Village',async()=>{
 const previous={document:globalThis.document,MutationObserver:globalThis.MutationObserver},dom=createDom();dom.loadHTML('<html><body><div id="main_content"></div></body></html>');globalThis.document=dom.document;
 try{
  const {createCraftingHome}=await import('../src/crafting_home.js');
  let location='Village',blocked='',quotes=0,shown=false,wake;
  const home=createCraftingHome({read:()=>({materials:[],products:[],blocked,world:'base.frontier',location,discovered:true}),quote:()=>{quotes++;return {eligible:!blocked,reason:blocked};},execute:()=>{}});
  const panel=document.getElementById('crafting_engine_home'),gather=document.getElementById('crafting_gather');
  panel.checkVisibility=()=>shown;
  globalThis.MutationObserver=class{constructor(callback){wake=callback;}observe(){}disconnect(){}};
  const before=quotes;blocked='Read only';home.render();home.render();assert.equal(quotes,before);assert.equal(gather.disabled,false);
  shown=true;wake();assert.ok(quotes>before);assert.equal(gather.disabled,true);assert.equal(gather.title,'Read only');
  location='Town';home.render();assert.equal(panel.hidden,true);
  location='Village';blocked='';home.render();assert.equal(panel.hidden,false);assert.equal(gather.disabled,false);assert.equal(gather.title,'');
 }finally{Object.assign(globalThis,previous);}
});

test('experiment visibility observer avoids repeated geometry checks and refreshes when shown',async()=>{
 const previous={document:globalThis.document,IntersectionObserver:globalThis.IntersectionObserver},dom=createDom();dom.loadHTML('<html><body><div id="main_content"></div></body></html>');globalThis.document=dom.document;
 try{
  let observe,quotes=0,blocked='';
  globalThis.IntersectionObserver=class{constructor(callback){observe=callback;}observe(){}};
  const {createCraftingHome}=await import('../src/crafting_home.js');
  const home=createCraftingHome({read:()=>({materials:[],products:[],blocked,world:'base.frontier',location:'Village',discovered:true}),quote:()=>{quotes++;return {eligible:!blocked,reason:blocked};},execute:()=>{}});
  const panel=document.getElementById('crafting_engine_home');
  observe([{isIntersecting:false}]);const before=quotes;
  panel.checkVisibility=()=>{throw new Error('Hidden publication must not force a style pass');};
  blocked='Read only';home.render();home.render();assert.equal(quotes,before);
  observe([{isIntersecting:true}]);assert.ok(quotes>before);assert.equal(document.getElementById('crafting_gather').title,'Read only');
 }finally{Object.assign(globalThis,previous);}
});

test('clock-only refreshes retain material input, typed quantity, focus and method options while re-quoting',async()=>{
 const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="main_content"></div></body></html>');globalThis.document=dom.document;
 try{
  const {createCraftingHome}=await import('../src/crafting_home.js');let clock=1,quotes=0,count=3,executedAt=null;
  const home=createCraftingHome({read:()=>({clock,materials:[{key:'herb',name:'Herb',count}],products:[],blocked:'',world:'base.frontier',location:'Village',discovered:true}),quote:()=>{quotes++;return {eligible:true,reason:'',token:clock,request:{type:'craft'}};},execute:q=>{executedAt=q.token;return {outcome:{text:'Done'}};}});
  const check=document.querySelector('[data-craft-material]'),qty=document.querySelector('.crafting-trial-quantity'),option=document.querySelector('#crafting_method option');
  const commit=document.querySelector('[data-craft-commit]');qty.focus();qty.value='2';const before=quotes;clock++;home.render();
  assert.equal(document.querySelector('[data-craft-material]'),check);assert.equal(document.querySelector('.crafting-trial-quantity'),qty);assert.equal(qty.value,'2');assert.equal(document.activeElement,qty);assert.equal(document.querySelector('#crafting_method option'),option);assert.ok(quotes>before);assert.equal(document.querySelector('[data-craft-commit]'),commit);commit.click();assert.equal(executedAt,clock,'retained action uses the refreshed quote');
  count=1;clock++;home.render();assert.notEqual(document.querySelector('[data-craft-material]'),check);assert.equal(document.querySelector('.crafting-trial-quantity').max,'1');
 }finally{globalThis.document=previous;}
});
