import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {COPY_FILE as C} from '../src/lotm_copy_routine.js';
const dom=createDom();dom.loadHTML('<html><body></body></html>');globalThis.document=dom.document;
globalThis.MutationObserver??=class{observe(){}disconnect(){}};globalThis.IntersectionObserver??=class{observe(){}disconnect(){}};
const {createLotmPanel}=await import('../src/book_world_lotm_ui.js');
const {fresh,run,wait,hostOver}=await import('./lotm_helpers.js');
await import('../src/book_world_lotm_domain.js');
let pausedBaseline;
function paused(){if(!pausedBaseline){let p=run(run(fresh(500,'probationer'),'report_in'),'merit_case_file_copy');p=wait(p,30);const h=hostOver(p);h.host.act(C.entrust);pausedBaseline=wait(h.box.p,10);}return hostOver(structuredClone(pausedBaseline));}
test('paused-duty opener selects Work & merit and focuses the actual reference choice without acting',()=>{
 const h=paused(),view=h.host.view();
 let acts=0;const home=document.createElement('div');document.body.append(home);const before=JSON.stringify(view);
 const panel=createLotmPanel({read:()=>view,observer:()=>({sees:()=>true}),discovered:()=>true,act:()=>acts++,cancel(){},move(){},enroll(){},home,readOwed:()=>null});
 assert.equal(panel.openCopyQuestion(),true);assert.equal(document.activeElement?.dataset.lotm,C.ask);
 const workTab=home.querySelector('[data-tab="work"]');assert.equal(workTab.getAttribute('aria-selected'),'true');
 assert.equal(home.querySelector('[data-lotm-copy-file]').closest('[data-tab-off]'),null,'reference controls are on the shown tab');assert.equal(acts,0);assert.equal(JSON.stringify(view),before);
});
function livePanel({fail=false}={}){
 const h=paused(),home=document.createElement('div');document.body.append(home);
 const ui=createLotmPanel({read:()=>h.host.view(),observer:()=>({sees:()=>true}),discovered:()=>true,act:id=>{if(fail)throw Error('Reference is no longer waiting.');h.host.act(id);},cancel(){},move(){},enroll(){},home,readOwed:()=>null});
 ui.openCopyQuestion();return {h,home,ui};
}
test('keyboard marking hands focus to Resume without scrolling or starting the next sheet',()=>{
 const {h,home}=livePanel(),flag=home.querySelector(`[data-lotm="${C.flag}"]`);flag.focus();home.scrollTop=137;
 const prototype=dom.classes.Element.prototype,original=prototype.focus,focuses=[];
 prototype.focus=function(options){focuses.push({id:this.dataset.lotm,options});return original.call(this,options);};
 try{flag.dispatchEvent(new dom.classes.MouseEvent('click',{bubbles:true,detail:0}));}finally{prototype.focus=original;}
 assert.equal(document.activeElement?.dataset.lotm,C.resume);assert.deepEqual(focuses.findLast(f=>f.id===C.resume)?.options,{preventScroll:true});assert.equal(home.scrollTop,137);
 assert.equal(h.box.p.state.simulation.jobs.length,0,'handoff does not resume gameplay');assert.equal(h.box.p.state.actors.player.resources[C.sheets],1);assert.equal(h.box.p.state.clock,40);
});
test('pointer marking and background redraw do not take focus to Resume',()=>{
 let x=livePanel(),flag=x.home.querySelector(`[data-lotm="${C.flag}"]`);flag.focus();flag.dispatchEvent(new dom.classes.MouseEvent('click',{bubbles:true,detail:1}));assert.notEqual(document.activeElement?.dataset.lotm,C.resume);
 x=livePanel();const reading=document.createElement('button');reading.textContent='Unrelated reading control';document.body.append(reading);reading.focus();
 x.h.host.act(C.flag);x.ui.render();assert.equal(document.activeElement,reading,'completion elsewhere preserves a live reading control');
});
test('a failed keyboard choice keeps its question rather than moving to a different task',()=>{
 const {home}=livePanel({fail:true}),flag=home.querySelector(`[data-lotm="${C.flag}"]`);flag.focus();flag.dispatchEvent(new dom.classes.MouseEvent('click',{bubbles:true,detail:0}));
 assert.equal(home.querySelector(`[data-lotm="${C.resume}"]`),null);assert.equal(document.activeElement?.dataset.lotm,C.flag);assert.match(home.textContent,/Reference is no longer waiting/);
});
