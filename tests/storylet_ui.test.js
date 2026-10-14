import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry} from '../src/expansion_engine.js';
import {createStoryletPanel} from '../src/storylet_ui.js';

test('Village entry is reversible and render never enrolls or draws; outside the world no effects run',()=>{
 const previous=globalThis.document;
 class Element {
  constructor(tag){this.tagName=tag;this.dataset={};this.children=[];this.listeners={};this.textContent='';}
  append(...nodes){this.children.push(...nodes);for(const n of nodes)n.parentElement=this;}
  addEventListener(type,fn){this.listeners[type]=fn;}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 }
 const host=new Element('div');const made=[];
 globalThis.document={createElement:tag=>{const n=new Element(tag);made.push(n);return n;},getElementById:id=>id==='location_actions_div'?host:null};
 try{
  const state=createExpansionState(12),before=structuredClone(state),commands=[];
  let location='Village';const registry=createContentRegistry({worlds:[{id:'base.frontier'}]});
  const panel=createStoryletPanel({registry,read:()=>({state,context:{actorId:'player',facts:{location}},enabled:true}),command:c=>commands.push(c)});
  panel.render();assert.deepEqual(state,before);assert.deepEqual(commands,[]);
  const begin=made.find(n=>n.dataset.storylet==='begin');assert.equal(begin.hidden,false);assert.equal(begin.disabled,false);
  begin.listeners.click();assert.deepEqual(commands,[{type:'storylet_begin'}]);assert.deepEqual(state,before);
  location='Elsewhere';panel.render();assert.equal(made[0].hidden,true);assert.equal(commands.length,1);
 }finally{globalThis.document=previous;}
});
