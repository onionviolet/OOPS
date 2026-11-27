import test from 'node:test';
import assert from 'node:assert/strict';
import {registerWorkAttention,readWorkAttention} from '../src/work_attention.js';
import {createDom} from '../scripts/headless/dom.mjs';
import {mountStatusLine,registerWorkTarget,setStatusText} from '../src/ui/status_line.js';
test('current work and waiting responses outrank paused duty without reading it',()=>{
 let reads=0,opens=0;const dispose=registerWorkAttention({worldId:'test.copy',read:()=>{reads++;return {text:'Reference needs an answer',label:'Review reference'};},open:()=>{opens++;return true;}});
 try{
  assert.equal(readWorkAttention({world:'test.copy',work:['Copying'],waiting:false}),null);
  assert.equal(readWorkAttention({world:'test.copy',work:[],waiting:true}),null);assert.equal(reads,0,'priority owners are checked before invoking domain reader');
  assert.equal(readWorkAttention({world:'elsewhere',work:[],waiting:false}),null);assert.equal(reads,0,'world lookup does not inspect another life');
  const attention=readWorkAttention({world:'test.copy',work:[],waiting:false});assert.equal(attention.label,'Review reference');assert.equal(attention.open(),true);assert.equal(opens,1);
 }finally{dispose();}
 assert.equal(readWorkAttention({world:'test.copy',work:[],waiting:false}),null);
});
test('header work chip reaches paused Klein copying through the same registry',()=>{
 const dom=createDom();dom.loadHTML('<html><body><header id="bar"></header></body></html>');
 const before={document:globalThis.document,CustomEvent:globalThis.CustomEvent};globalThis.document=dom.document;globalThis.CustomEvent=dom.classes.CustomEvent;
 let opened=0;const status=mountStatusLine({bar:dom.document.getElementById('bar')});
 const dispose=registerWorkAttention({worldId:'test.copy',read:()=>({text:'Reference needs your answer',label:'Review reference'}),open:()=>{opened++;return true;}});
 const release=registerWorkTarget(()=>readWorkAttention({world:'test.copy',work:[],waiting:false})?.open);
 try{
  setStatusText('work','Copying paused: the reference needs your answer.',{idle:false,title:'Review the copying reference'});
  const chip=dom.document.querySelector('[data-status-slot="work"]');assert.match(chip.textContent,/reference needs your answer/);assert.equal(chip.dataset.idle,'false');
  chip.dispatchEvent(new dom.classes.Event('click',{bubbles:true}));assert.equal(opened,1);
 }finally{release();dispose();status.destroy();globalThis.document=before.document;globalThis.CustomEvent=before.CustomEvent;}
});

test('Village work falls through an unavailable owner to the native status, then Current work when native work ends',()=>{
 const dom=createDom();dom.loadHTML('<html><body><header id="bar"></header><p id="action_status_div">Patrolling</p><section id="workspace_current_work">Current work</section></body></html>');
 const before={document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame};
 Object.assign(globalThis,{document:dom.document,requestAnimationFrame:run=>run()});
 const status=mountStatusLine({bar:dom.document.getElementById('bar')});
 const release=registerWorkTarget(()=>()=>false);
 try{
  const chip=dom.document.querySelector('[data-status-slot="work"]');
  const native=dom.document.getElementById('action_status_div');
  chip.click();
  assert.equal(dom.document.activeElement,native);
  native.remove();
  chip.click();
  assert.equal(dom.document.activeElement,dom.document.getElementById('workspace_current_work'));
 }finally{release();status.destroy();Object.assign(globalThis,before);}
});
