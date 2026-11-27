import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
const dom=createDom();dom.loadHTML('<html><body></body></html>');
for(const k of ['document','window','Node','HTMLElement','MutationObserver','Event','CustomEvent'])if(dom.window?.[k])globalThis[k]=dom.window[k];
globalThis.document=dom.document;
globalThis.MutationObserver??=class{observe(){}disconnect(){}};
globalThis.IntersectionObserver??=class{observe(){}disconnect(){}};
const {createLotmPanel}=await import('../src/book_world_lotm_ui.js');
const base={enrolled:true,resident:true,entryProfile:'lotm.early_tingen.canon_beside@1',at:'Bakery',atId:'bakery',localClock:'Day 2',actions:[],objectActs:[],jobs:[],records:[],places:[],moves:[]};
const places=n=>[{place:'Bakery',here:true,minutes:0},...Array.from({length:n},(_,i)=>({place:'Place '+i,here:false,minutes:i+1}))];
function mount(n){let view={...base,places:places(n)};view.moves=view.places.slice(1).map((p,i)=>({id:'fixture.walk.'+i,to:p.place,label:'Walk to '+p.place+' · '+p.minutes+' min',minutes:p.minutes,eligible:true,reasons:[]}));const home=document.createElement('div');document.body.append(home);const moves=[];const ui=createLotmPanel({read:()=>view,observer:()=>({sees:()=>true}),discovered:()=>true,act(){},cancel(){},move:id=>moves.push(id),enroll(){},home,readOwed:()=>null});return {ui,home,moves,view,change:patch=>{view={...view,...patch};ui.render();}};}
const ids=m=>[...m.home.querySelectorAll('[data-lotm]')].map(n=>n.dataset.lotm).sort();

test('dense map is not built until requested; walks stay accessible and choices survive rerender/navigation',()=>{
 const m=mount(9),before=ids(m),toggle=()=>m.home.querySelector('[data-walk-map-toggle]');
 assert.equal(m.home.querySelector('[data-walk-map]'),null);assert.match(toggle().textContent,/Show/);
 assert.equal(m.home.querySelectorAll('[data-walk-place] button').length,9);
 const walk=m.home.querySelector('[data-lotm="fixture.walk.4"]');walk.focus();assert.equal(document.activeElement,walk);
 walk.click();assert.deepEqual(m.moves,['fixture.walk.4']);
 toggle().focus();toggle().click();assert.ok(m.home.querySelector('[data-walk-map] svg'));assert.deepEqual(ids(m),before);
 assert.equal(toggle().tagName,'BUTTON');assert.equal(toggle().type,'button');
 m.home.querySelector('[data-walk-map] [data-id="place-5"]').click();const selectedWalk=document.activeElement.querySelector('[data-lotm="fixture.walk.4"]');assert.ok(selectedWalk,'map selection focuses the quote row for the existing walk');assert.deepEqual(m.moves,['fixture.walk.4'],'map selection does not execute travel');selectedWalk.focus();
 m.change({at:'Next stop',localClock:'Day 2 · later'});assert.ok(m.home.querySelector('[data-walk-map]'));assert.equal(document.activeElement.dataset.lotm,'fixture.walk.4','selected walk focus survives refresh');
 toggle().click();m.change({places:places(2)});assert.equal(m.home.querySelector('[data-walk-map]'),null,'explicit closed choice survives smaller navigation');
});

test('up to eight walkable destinations retain immediate map; unchosen default follows density',()=>{
 const m=mount(8);assert.ok(m.home.querySelector('[data-walk-map] svg'));assert.match(m.home.querySelector('[data-walk-map-toggle]').textContent,/Hide/);
 m.change({places:places(9)});assert.equal(m.home.querySelector('[data-walk-map]'),null);
 m.change({places:places(2)});assert.ok(m.home.querySelector('[data-walk-map]'));
});
