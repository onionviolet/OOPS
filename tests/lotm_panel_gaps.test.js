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
test('G18: whether the workroom is found is answered without building its view', async () => {
 const {knownWorkspaceModules}=await import('../src/workspace_layout.js');
 const {host}=hostOver(cc9()),view=host.view();
 assert.equal(host.discovered(),!!(view.enrolled||view.startable),'the cheap answer agrees with the view');
 const {observerForProfile}=await import('../src/observer_view.js'),probe=['lotm.local-task-entry','lotm.own-power-notes'];
 assert.deepEqual(probe.map(c=>host.observer().sees({capability:c})),probe.map(c=>observerForProfile(view.entryProfile).sees({capability:c})),'the seat filter\'s cheap observer agrees with the view');
 let reads=0;const home=document.createElement('div');document.body.append(home);
 createLotmPanel({read:()=>{reads++;return view;},discovered:()=>host.discovered(),act(){},cancel(){},move(){},enroll(){},home,readOwed:()=>({rows:[],live:{},labels:{}}),settle:()=>0});
 const before=reads;knownWorkspaceModules();knownWorkspaceModules();
 assert.equal(reads,before,'the navigation poll never reads the full workroom view');
});


test('long Wait click exposes progress and Stop before advancing the native clock',async()=>{
 const {createWaitUntil}=await import('../src/wait_until.js');
 const {host}=hostOver(cc9()),view={...host.view(),waits:[{id:'wait.until.360',at:360,label:'Wait until dawn · 360 min',eligible:true,reasons:[]}]};
 const home=document.createElement('div');document.body.append(home);let clock=0,legacyCalls=0;
 createLotmPanel({read:()=>view,act(){legacyCalls++;},beginWait:id=>createWaitUntil(id,{read:()=>({clock,place:'home'}),options:()=>view.waits,advance:n=>{clock+=n;}}),cancel(){},move(){},enroll(){},home,readOwed:()=>({rows:[],live:{},labels:{}})});
 home.querySelector('[data-lotm="wait.until.360"]').click();
 assert.equal(clock,0);assert.equal(legacyCalls,0);
 assert.match(home.querySelector('[data-lotm-wait-progress]').textContent,/0 min elapsed.*360 min remaining/);
 const stop=home.querySelector('[data-lotm="wait.stop"]');assert.ok(stop);assert.equal(stop.disabled,false);stop.click();
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(clock,0);assert.equal(home.querySelector('[data-lotm="wait.stop"]'),null);assert.match(home.textContent,/Wait interrupted after 0 min/);
});


test('waiting updates clock/progress in place without rereading on click or replacing focused Stop',async()=>{
 const {createWaitUntil}=await import('../src/wait_until.js');
 const {host}=hostOver(cc9());let clock=0,reads=0,ui,committed;
 const firstMinute=new Promise(resolve=>committed=resolve);
 const view={...host.view(),resident:true,at:'Fixture lodging',localClock:'Day1 · 00:00',objectActs:[],waits:[{id:'wait.until.10',at:10,label:'Wait until dawn · 10 min',eligible:true,reasons:[]}]};
 const home=document.createElement('div');document.body.append(home);
 let place=document.getElementById('location_actions_div');if(!place){place=document.createElement('div');place.id='location_actions_div';document.body.append(place);}
 ui=createLotmPanel({read:()=>{reads++;return view;},act(){},beginWait:id=>createWaitUntil(id,{read:()=>({clock,place:'home'}),options:()=>view.waits,advance:n=>{clock+=n;view.localClock='Day1 · minute'+clock;ui.render();committed();}}),cancel(){},move(){},enroll(){},home,readOwed:()=>({rows:[],live:{},labels:{}})});
 const wait=home.querySelector('[data-lotm="wait.until.10"]'),doorText=place.querySelector('[data-lotm-door] span'),doorNode=doorText?.firstChild,before=reads;
 assert.equal(home.querySelector('[data-lotm="wait.stop"]'),null);
 wait.click();assert.equal(reads,before,'start shows lightweight progress without re-reading the full host view');
 const stop=home.querySelector('[data-lotm="wait.stop"]');assert.equal(document.activeElement,stop);
 await firstMinute;
 assert.equal(home.querySelector('[data-lotm="wait.until.10"]'),wait,'minute-only change retains ordinary controls');
 assert.equal(home.querySelector('[data-lotm="wait.stop"]'),stop);assert.equal(document.activeElement,stop);
 assert.match(home.querySelector('[data-lotm-wait-progress]').textContent,/1 min elapsed/);
 if(doorText)assert.equal(doorText.firstChild,doorNode,'unchanged door caption does not emit a child-list write');
 stop.click();await new Promise(resolve=>setTimeout(resolve,0));assert.equal(clock,1);
});


test('object-action notice follows its exact job to receipt and retires after external cancellation',()=>{
 const {host}=hostOver(cc9()),view={...host.view(),jobs:[],records:[],objectActs:[],waits:[]};
 const key='fixture.purchase.seen',id='fixture.purchase';
 view.objectActs=[{id,knowledgeKey:key,label:'Buy mutton and vegetables',eligible:true,reasons:[]}];
 const home=document.createElement('div');document.body.append(home);let serial=0;
 const ui=createLotmPanel({read:()=>view,act(){view.jobs=[{id:'fixture.job.'+(++serial),commandId:id,label:'Buy mutton and vegetables',left:5,cancellable:true,cancellation:'refund'}];},
  cancel(){view.jobs=[];},move(){},enroll(){},home,readOwed:()=>({rows:[],live:{},labels:{}})});
 const notice=()=>home.querySelector('#lotm_panel > p[role="status"]').textContent;
 const start=()=>home.querySelector('[data-lotm="fixture.purchase"]').click();
 start();assert.match(notice(),/^Started:/);
 view.jobs=[];view.records=[{id:key,text:'You bought mutton and vegetables.',at:530}];ui.render();
 assert.equal(notice(),'Finished: You bought mutton and vegetables.');
 // A second action must wait for its own new receipt, not reuse the first.
 start();assert.match(notice(),/^Started:/);
 view.jobs=[];ui.render();
 assert.match(notice(),/no longer in progress/);assert.doesNotMatch(notice(),/Started:|Finished:/);
 // A later completed purchase supersedes the earlier receipt at its true date.
 start();view.jobs=[];view.records=[{id:key,text:'You bought another bundle.',at:550}];ui.render();
 assert.equal(notice(),'Finished: You bought another bundle.');
 start();home.querySelector('[data-lotm="cancel"]').click();
 assert.match(notice(),/You stopped/);ui.render();assert.match(notice(),/You stopped/);
});
