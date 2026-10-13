import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry} from '../src/expansion_engine.js';
import {createSimulationPanel} from '../src/simulation_ui.js';

test('hidden workshop never evaluates registered commands outside its actual scene',()=>{
 const previous=globalThis.document;
 class Element {constructor(tag){this.tagName=tag;this.dataset={};this.children=[];}append(...nodes){this.children.push(...nodes);}addEventListener(){}}
 globalThis.document={createElement:tag=>new Element(tag)};
 try {
  const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
  registry.simulation.commands.set('original.probe',{id:'original.probe',actorId:'player',label:'Synthetic probe',group:'workshop',effects:[]});
  registry.simulation.commands.get=()=>{throw Error('Hidden command was evaluated.');};
  let reads=0;
  const panel=createSimulationPanel({registry,read:()=>{reads++;return{state:createExpansionState(12),context:{facts:{location:'original.other'}},enabled:true};},command:()=>{throw Error('Render executed a command.');}});
  panel.render();assert.equal(reads,2);
 }finally{globalThis.document=previous;}
});
