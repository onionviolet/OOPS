import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {CIRCUS_HANDBILL} from '../src/lotm_circus_notice.js';
const dom=createDom();dom.loadHTML('<html><body></body></html>');globalThis.document=dom.document;
globalThis.MutationObserver??=class{observe(){}disconnect(){}};globalThis.IntersectionObserver??=class{observe(){}disconnect(){}};
const {createLotmPanel}=await import('../src/book_world_lotm_ui.js');
const base={enrolled:true,resident:true,entryProfile:'lotm.early_tingen.canon_beside@1',at:'Bakery',atId:'bakery',localClock:'Day 2',actions:[],objectActs:[],records:[],places:[],moves:[]};

test('native disclosure is plain text, focusable and side-effect free during a pending job',()=>{
 const job={id:'fixture.pending',commandId:'fixture.post',label:'A normal job',left:3,cancellable:true,cancellation:'refund'};
 let view={...base,jobs:[job],tentIncident:{title:'At Sline Bakery',status:'By the window.',paper:{...CIRCUS_HANDBILL,copy:'carried',caption:'A spare notice from your flyer round.'}}};
 let acts=0,cancels=0,waits=0;const home=document.createElement('div');document.body.append(home);
 const ui=createLotmPanel({read:()=>view,observer:()=>({sees:()=>true}),discovered:()=>true,act:()=>acts++,cancel:()=>cancels++,beginWait:()=>waits++,move(){},enroll(){},home,readOwed:()=>null});
 const paper=()=>home.querySelector('[data-lotm-handbill]'),summary=()=>home.querySelector('[data-lotm-handbill-summary]');
 assert.equal(paper().tagName,'DETAILS');assert.equal(summary().tagName,'SUMMARY');assert.equal(paper().open,false);
 assert.equal(paper().querySelectorAll('article').length,1);assert.equal(paper().querySelectorAll('img,canvas,svg').length,0);
 for(const text of [CIRCUS_HANDBILL.title,...CIRCUS_HANDBILL.lines])assert.ok(paper().textContent.includes(text));
 const before=JSON.stringify(view);summary().focus();assert.equal(document.activeElement,summary());summary().click();assert.equal(paper().open,true);assert.equal(JSON.stringify(view),before);assert.deepEqual([acts,cancels,waits],[0,0,0]);
 view={...view,jobs:[{...job,left:2}]};ui.render();assert.equal(paper().open,true);assert.equal(document.activeElement,summary(),'reading focus survives normal job refresh');assert.match(home.querySelector('[data-lotm-job]').textContent,/2 min left/);
 summary().click();assert.equal(paper().open,false);view={...view,jobs:[{...job,left:1}]};ui.render();assert.equal(paper().open,false);assert.deepEqual([acts,cancels,waits],[0,0,0]);
 view={...view,tentIncident:{...view.tentIncident,paper:null}};ui.render();assert.equal(paper(),null);assert.equal(home.querySelectorAll('[data-lotm-job]').length,1);assert.deepEqual([acts,cancels,waits],[0,0,0]);
});
