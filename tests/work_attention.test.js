import test from 'node:test';
import assert from 'node:assert/strict';
import {registerWorkAttention,readWorkAttention} from '../src/work_attention.js';
import {createDom} from '../scripts/headless/dom.mjs';
import {mountStatusLine,setStatusText,setWorkStatusJump} from '../src/ui/status_line.js';
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
test('header work chip invokes registered paused-duty jump instead of its running-work fallback',()=>{
 const dom=createDom();dom.loadHTML('<html><body><header id="bar"></header></body></html>');
 const before={document:globalThis.document,CustomEvent:globalThis.CustomEvent};globalThis.document=dom.document;globalThis.CustomEvent=dom.classes.CustomEvent;
 let opened=0;const status=mountStatusLine({bar:dom.document.getElementById('bar')});
 try{
  setWorkStatusJump(()=>{opened++;return true;});setStatusText('work','Copying paused: the reference needs your answer.',{idle:false,title:'Review the copying reference'});
  const chip=dom.document.querySelector('[data-status-slot="work"]');assert.match(chip.textContent,/reference needs your answer/);assert.equal(chip.dataset.idle,'false');
  chip.dispatchEvent(new dom.classes.Event('click',{bubbles:true}));assert.equal(opened,1);
 }finally{setWorkStatusJump(null);status.destroy();globalThis.document=before.document;globalThis.CustomEvent=before.CustomEvent;}
});
