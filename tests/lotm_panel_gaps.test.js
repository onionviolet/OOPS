// W11-D: the Tingen panel's own-power notes, "What I owe" block and used-skills list; holder only, hidden when empty.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
const dom=createDom();dom.loadHTML('<html><body><div id="home"></div></body></html>');
for(const k of ['document','window','Node','HTMLElement','MutationObserver','Event','CustomEvent'])if(dom.window?.[k]&&!globalThis[k])try{globalThis[k]=dom.window[k];}catch{}
globalThis.document=dom.document;globalThis.MutationObserver??=class{observe(){}disconnect(){}};globalThis.IntersectionObserver??=class{observe(){}disconnect(){}};
const {fresh,run,wait,hostOver}=await import('./lotm_helpers.js');
const {createLotmPanel}=await import('../src/book_world_lotm_ui.js');
import {BE_PROFILE_ID} from '../src/seat_profiles.js';
const OBSERVER='lotm.early_tingen.canon_beside@1';
const cc9=()=>{let p=run(fresh(),'report_in');p=run(p,'accept_allocation_cc');return run(p,'ingest_cc');};
function mount(view,owed){
 const home=document.createElement('div');document.body.append(home);
 let settled=[],rows=owed.rows;
 const ui=createLotmPanel({read:()=>view,act(){},cancel(){},move(){},enroll(){},home,readOwed:()=>({rows,live:owed.live,labels:{}}),settle:q=>{settled.push(q);rows=[];return 2;}});
 return {ui,home,settled,panel:home.querySelector('#lotm_panel')||home.firstChild};
}
const rentRow={id:'duty:rent',kind:'coin',debtor:'player',creditor:'landlord',amount:2,why:'Rent',source:'duties',carries:false};
const owed={rows:[rentRow],live:{'duty:rent':{amount:2,quote:{label:'Pay rent (2 coins)',domain:'economy_standing',command:'x'}}}};
test('an ability row shows its kind of power to its holder and nothing to an observer view',()=>{
 const {host}=hostOver(cc9()),view={...host.view(),entryProfile:BE_PROFILE_ID};
 const row=view.actions.find(a=>a.id==='book.lotm.ab.cold_ward');assert.ok(row,'held ability is offered');
 const own=mount(view,{rows:[]});own.ui.render();
 assert.match(own.panel.querySelector('[data-lotm-power="book.lotm.ab.cold_ward"]')?.textContent??'',/Kind of power/);
 const other=mount({...view,entryProfile:OBSERVER},{rows:[]});other.ui.render();
 assert.equal(other.panel.querySelector('[data-lotm-power]'),null);
});
test('What I owe lists the ledger rows with the settle action, and hides when empty',()=>{
 const {host}=hostOver(cc9()),view={...host.view(),entryProfile:BE_PROFILE_ID},m=mount(view,owed);m.ui.render();
 const block=m.panel.querySelector('[data-lotm-owed]');assert.ok(block);assert.match(block.textContent,/What I owe/);
 assert.match(block.querySelector('[data-lotm-owed-row="duty:rent"]').textContent,/Rent|landlord|2 coins/i);
 const btn=block.querySelector('button');assert.match(btn.textContent,/Pay rent/);btn.click();
 assert.equal(m.settled.length,1);assert.equal(m.panel.querySelector('[data-lotm-owed]'),null,'cleared once settled');
 const seen=mount({...view,entryProfile:OBSERVER},owed);seen.ui.render();assert.equal(seen.panel.querySelector('[data-lotm-owed]'),null,'another seat does not see the lead\'s ledger');
 const none=mount(view,{rows:[]});none.ui.render();assert.equal(none.panel.querySelector('[data-lotm-owed]'),null);
});
test('used skills carry their channel line in the Path tab; unspent and untagged ones are left out',()=>{
 const {host,box}=hostOver(cc9());
 box.p.gameplay.player.skills={Medicine:{xp:5},Perception:{xp:0},Whittling:{xp:9}};
 const view={...host.view(),entryProfile:BE_PROFILE_ID};assert.deepEqual(view.skills.map(s=>s.id),['Medicine']);
 const m=mount(view,{rows:[]});m.ui.render();
 assert.match(m.panel.querySelector('[data-lotm-skill="Medicine"]').textContent,/Kind of power: Heal/);
 const other=mount({...view,entryProfile:OBSERVER},{rows:[]});other.ui.render();assert.equal(other.panel.querySelector('[data-lotm-skills]'),null);
});
