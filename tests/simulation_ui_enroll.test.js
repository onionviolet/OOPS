import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry} from '../src/expansion_engine.js';
import {createSimulationPanel} from '../src/simulation_ui.js';

// Minimal tree: enough parent tracking to ask "can the player see and click this button".
class Element {
 constructor(tag){this.tagName=tag;this.dataset={};this.children=[];this.parentNode=null;this.hidden=false;this.textContent='';this.id='';this.className='';this.listeners={};}
 append(...nodes){for(const n of nodes){n.parentNode?.children.splice(n.parentNode.children.indexOf(n),1);n.parentNode=this;this.children.push(n);}}
 addEventListener(type,fn){this.listeners[type]=fn;}
 setAttribute(){} focus(){} remove(){this.parentNode?.children.splice(this.parentNode.children.indexOf(this),1);this.parentNode=null;}
 querySelector(sel){return sel==='summary'?this.children.find(c=>c.tagName==='summary')||null:null;}
 replaceChildren(){this.children=[];}
 querySelectorAll(){return [];}
 reachable(){for(let n=this;n;n=n.parentNode)if(n.hidden)return false;return true;}
 find(pred,out=[]){if(pred(this))out.push(this);for(const c of this.children)c.find(pred,out);return out;}
}

test('an unenrolled hero can see and click "Follow local people and work" in the workshop panel',()=>{
 const previous=globalThis.document;
 const host=new Element('div');
 globalThis.document={createElement:tag=>new Element(tag),activeElement:null,getElementById:()=>host};
 try {
  const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
  const state=createExpansionState(12);
  assert.ok(!state.simulation,'fixture is not enrolled');
  const sent=[];
  const read=()=>({state,context:{facts:{location:'Village','village.craftsmanMet':true}},enabled:true});
  const ui=createSimulationPanel({registry,read,command:c=>sent.push(c)});
  ui.render();
  const [panel]=host.children,[enroll]=panel.find(n=>n.dataset.simulation==='enroll');
  assert.ok(enroll,'the enroll step exists');
  assert.ok(!panel.hidden,'the panel is shown once the craftsman is known');
  assert.ok(!enroll.hidden);
  assert.equal(enroll.reachable(),true,'no hidden ancestor (the Work here section is hidden before enrolment)');
  enroll.listeners.click();
  assert.deepEqual(sent,[{type:'enroll'}]);
 }finally{globalThis.document=previous;}
});
