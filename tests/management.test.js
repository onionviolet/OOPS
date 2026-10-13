import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitManagement,managementPresentation} from '../src/management/host.js';
import {I,K} from '../src/management/shared.js';

// SOURCE tests for the MG01-MG10 courtyard families. Fixture money and
// vitals are test values, not native acquisition evidence.
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
 facts:{location:'Village'},nativeBody:body,nativeAlive:true,nativeReady:true,managementPlayerLocation:'Village',managementPlayerAlive:true,managementHost:true,...extra});
const keep=(p,out)=>({...out,vitals:out.vitals||p.vitals});
const act=(p,command,extra={})=>keep(p,commitManagement(p.state,registry,command,ctx(p,extra),p.state.sequence));
const run=(p,id,extra)=>act(p,{id},extra);
const advance=(p,n,extra={})=>{const c=ctx(p,extra);
 const others=Object.fromEntries(Object.keys(p.state.simulation?.people||{}).filter(id=>id!=='player').map(id=>[id,{...c,actorId:id,vitals:p.state.simulation.people[id].vitals,facts:{...c.facts,location:undefined}}]));
 const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player},...others});return {...out,vitals:out.vitals||c.vitals};};
const stock=(p,k)=>p.gameplay.player.inventory[k]||0;
const npc=(p,id,k)=>p.state.simulation.owners[id][k]||0;
const coins=(p,id)=>p.state.actors[id].resources.coins;
const fact=(p,k)=>p.state.actors.player.facts[`mg.${k}`];
const playerJobs=p=>p.state.simulation.jobs.filter(j=>j.actorId==='player');
const reload=p=>({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
function base(money=102){return {state:initializeExpedition(createExpansionState(17)),external:{money},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};}
const opened=(money=102)=>run(base(money),I.begin);
const buy=(p,name,n=1)=>{for(let i=0;i<n;i++)p=run(p,`mg.supply.${name}`);return p;};
const job=(p,id,minutes)=>advance(run(p,id),minutes);
const cancelCurrent=p=>act(p,{type:'cancel',id:playerJobs(p)[0].id});
const actionIds=p=>managementPresentation(p.state,registry,ctx(p)).sections.flatMap(s=>s.actions.map(a=>a.id));

test('SOURCE charter: visible before opening, opens residents and finite stock without granting money',()=>{
 const before=base();
 assert.deepEqual(actionIds({...before,state:before.state}),[I.begin]);
 const p=opened();
 assert.equal(p.external.money,102);
 assert.equal(coins(p,I.mira),100);assert.equal(npc(p,I.mira,K.log),20);assert.equal(npc(p,I.orin,K.log),6);
 assert.equal(fact(p,'opened'),true);
 assert.throws(()=>run(p,I.begin));
 assert.ok(actionIds(p).includes('mg.orin.inspect'));
 // Away from Village the panel and charter are unavailable.
 assert.throws(()=>run(base(),I.begin,{facts:{location:'Shack'}}));
});

test('SOURCE supplies: actual Mira stock and purse; insufficient money rejected',()=>{
 let p=buy(opened(),'log',2);
 assert.equal(stock(p,K.log),2);assert.equal(npc(p,I.mira,K.log),18);assert.equal(coins(p,I.mira),104);assert.equal(p.external.money,98);
 const poor=opened(1);assert.throws(()=>run(poor,'mg.supply.log'));assert.equal(poor.external.money,1);
});

test('SOURCE MG01 share: inspect, share, batch, sale to Orin, single settlement',()=>{
 let p=run(opened(),'mg.orin.inspect');
 assert.throws(()=>run(opened(),'mg.orin.share'),/./,'share needs inspection');
 p=run(p,'mg.orin.share');
 assert.equal(p.external.money,99);assert.equal(stock(p,K.log),2);assert.equal(coins(p,I.orin),33);
 assert.throws(()=>run(p,'mg.orin.advance'),/./,'one agreement branch');
 p=job(p,'mg.orin.make_batch',4);assert.equal(stock(p,K.crate),1);assert.equal(stock(p,K.log),0);
 p=run(p,'mg.orin.sell_batch');assert.equal(stock(p,K.crate),0);assert.equal(npc(p,I.bram,K.crate),1);assert.equal(coins(p,I.orin),39);assert.equal(coins(p,I.bram),194);
 p=run(reload(p),'mg.orin.settle_share');assert.equal(p.external.money,103);assert.equal(coins(p,I.orin),35);
 assert.throws(()=>run(p,'mg.orin.settle_share'),/./,'double settlement');
});

test('SOURCE MG01 advance, pass and cancelled batch refund',()=>{
 let p=run(run(opened(),'mg.orin.inspect'),'mg.orin.advance');
 assert.equal(p.external.money,102);assert.equal(stock(p,K.log),2);
 const started=run(p,'mg.orin.make_batch');assert.equal(stock(started,K.log),0);
 const cancelled=cancelCurrent(started);assert.equal(stock(cancelled,K.log),2);assert.equal(stock(advance(cancelled,5),K.crate),0);
 p=job(p,'mg.orin.make_batch',4);p=run(p,'mg.orin.sell_advance_batch');assert.equal(p.external.money,108);
 p=run(p,'mg.orin.repay_advance');assert.equal(p.external.money,105);assert.equal(coins(p,I.orin),33);
 assert.throws(()=>run(p,'mg.orin.repay_advance'));
 const passed=run(run(opened(),'mg.orin.inspect'),'mg.orin.pass');
 assert.equal(passed.external.money,102);assert.equal(stock(passed,K.log),0);assert.throws(()=>run(passed,'mg.orin.share'));
});

test('SOURCE MG02 room: buy, repair, personal rest, rental, request, answer or end',()=>{
 assert.throws(()=>run(opened(4),'mg.mira.buy_room'),/./,'unaffordable room');
 let p=buy(run(opened(),'mg.mira.buy_room'),'log',2);
 assert.equal(fact(p,'roomOwned'),true);assert.equal(coins(p,I.mira),109);
 const repairing=run(p,'mg.mira.repair_room');assert.equal(stock(repairing,K.log),1);
 const stopped=cancelCurrent(repairing);assert.equal(stock(stopped,K.log),2);assert.equal(fact(stopped,'roomRepaired'),false);
 p=advance(repairing,4);assert.equal(fact(p,'roomRepaired'),true);
 const personal=run(p,'mg.room.use_personal');const rested=job(personal,'mg.room.personal_rest',3);
 assert.equal(personal.vitals.player.stamina,98);assert.equal(rested.native.staminaToFull,0,'private rest restores the two spent stamina');
 p=run(p,'mg.room.use_rental');
 const staying=run(p,'mg.room.sela_stay');
 assert.throws(()=>run(staying,'mg.room.use_workshop'),/./,'use change during committed stay');
 p=advance(staying,5);assert.equal(p.external.money,95);assert.equal(coins(p,I.sela),38);
 p=run(p,'mg.room.sela_request');assert.equal(fact(p,'roomTenantRequest'),true);
 const ended=run(p,'mg.room.end_sela_rental');assert.equal(fact(ended,'roomUse'),'unselected');assert.equal(ended.external.money,p.external.money);
 p=job(p,'mg.room.answer_sela_repair',3);assert.equal(stock(p,K.log),0);assert.equal(fact(p,'roomTenantRequest'),false);
 assert.throws(()=>run(p,'mg.room.answer_sela_repair'));
});

function workshopRoom(money=102){let p=buy(run(opened(money),'mg.mira.buy_room'),'log',5);p=job(p,'mg.mira.repair_room',4);return run(p,'mg.room.use_workshop');}

test('SOURCE MG07 learned room recipe: finite 1-3 mandate, pause, resume, shortage stop and cancel refund',()=>{
 let p=workshopRoom();
 assert.throws(()=>act(p,{type:'repeat',id:'mg.room.workshop_batch',count:3}),/manually/);
 p=job(p,'mg.room.workshop_batch',4);assert.equal(stock(p,K.crate),1);assert.equal(stock(p,K.log),3);
 assert.throws(()=>act(p,{type:'repeat',id:'mg.room.workshop_batch',count:4}),/one to three/);
 p=act(p,{type:'repeat',id:'mg.room.workshop_batch',count:3});
 assert.equal(p.state.simulation.programs.player.remaining,2,'first repetition starts at once');
 assert.equal(playerJobs(p).length,1);assert.equal(stock(p,K.log),2);
 p=act(p,{type:'pause'});assert.equal(p.state.simulation.programs.player.status,'paused');
 p=advance(reload(p),4);assert.equal(stock(p,K.crate),2);assert.equal(playerJobs(p).length,0,'paused mandate starts no new job');
 p=act(p,{type:'resume'});p=advance(p,1);assert.equal(playerJobs(p).length,1);
 const cancelled=cancelCurrent(p);assert.equal(stock(cancelled,K.log),stock(p,K.log)+1);
 p=advance(p,12);assert.equal(stock(p,K.log),0);assert.equal(stock(p,K.crate),4);assert.equal(playerJobs(p).length,0,'shortage stops the mandate');
});

test('SOURCE MG03 shop and inn: full vs friendly, one demand per buyer, missing stock and inn meal',()=>{
 let p=job(workshopRoom(),'mg.room.workshop_batch',4);p=run(p,'mg.shop.inspect');
 const friendly=run(p,'mg.shop.sell_mira_crate_friendly');assert.equal(friendly.external.money,p.external.money+5);
 p=run(p,'mg.shop.sell_mira_crate_full');assert.equal(stock(p,K.crate),0);assert.equal(npc(p,I.mira,K.crate),1);
 assert.throws(()=>run(p,'mg.shop.sell_mira_crate_friendly'),/./,'demand closed');
 assert.throws(()=>run(p,'mg.shop.sell_sela_greens_full'),/./,'no greens owned');
 p.gameplay.player.inventory[K.greens]=1;p=run(p,'mg.room.use_inn');
 const serving=run(p,'mg.inn.sela_greens');assert.equal(stock(serving,K.greens),0);
 assert.equal(stock(cancelCurrent(serving),K.greens),1);
 p=advance(serving,4);assert.equal(fact(p,'inn_sela_served'),true);assert.equal(coins(p,I.sela),37);
});

function wonLot(){let p=run(opened(),'mg.auction.inspect');return run(p,'mg.auction.bid_high');}

test('SOURCE MG04 auction: low ceiling loses without spending, high wins at clearing price, single resolution',()=>{
 assert.throws(()=>run(opened(),'mg.auction.bid_high'),/./,'inspection first');
 const low=run(run(opened(),'mg.auction.inspect'),'mg.auction.bid_low');assert.equal(low.external.money,102);assert.equal(stock(low,K.damaged),0);
 assert.throws(()=>run(low,'mg.auction.bid_high'));
 const p=wonLot();assert.equal(p.external.money,94);assert.equal(stock(p,K.damaged),1);assert.equal(coins(p,I.mira),108);
 assert.throws(()=>run(p,'mg.auction.bid_high'));assert.throws(()=>run(opened(7),'mg.auction.bid_high'));
});

test('SOURCE MG05 shipping: local delivery pays once; escorted fee/stamina to Orin; cancel returns cargo and fee',()=>{
 let p=job(workshopRoom(),'mg.room.workshop_batch',4);
 assert.throws(()=>run(p,'mg.ship.crate.local'),/./,'needs Bram order');
 p=run(p,'mg.ship.hear_order');
 const escorted=run(p,'mg.ship.crate.escorted');
 assert.equal(stock(escorted,K.crate),0);assert.equal(escorted.external.money,p.external.money-2);assert.equal(escorted.state.simulation.people[I.orin].vitals.stamina,18);
 const back=cancelCurrent(escorted);assert.equal(stock(back,K.crate),1);assert.equal(back.external.money,p.external.money);assert.equal(back.state.simulation.people[I.orin].vitals.stamina,20);
 const paid=advance(escorted,6);assert.equal(paid.external.money,p.external.money+10);assert.equal(coins(paid,I.orin),32);assert.equal(npc(paid,I.bram,K.crate),1);
 p=job(p,'mg.ship.crate.local',3);assert.equal(p.external.money,escorted.external.money+2+8);
 assert.throws(()=>run(p,'mg.ship.crate.local'),/./,'order settled');
 // Leaving Village before arrival refunds the manifest.
 const left=advance(run(job(workshopRoom(),'mg.room.workshop_batch',4),'mg.ship.hear_order'),0);
 const moving=run(left,'mg.ship.crate.local');const lost=advance(moving,3,{facts:{location:'Shack'},managementPlayerLocation:'Shack'});
 assert.equal(stock(lost,K.crate),1);assert.equal(lost.external.money,moving.external.money);
});

test('SOURCE MG06 farming: rent, plant, tend, grow, harvest once; empty and occupied plots rejected',()=>{
 let p=buy(run(opened(),'mg.farm.rent_plot'),'seed',2);assert.equal(p.external.money,94);
 assert.throws(()=>run(p,'mg.farm.harvest_greens'),/./,'empty plot');
 const planting=run(p,'mg.farm.plant_greens');assert.equal(stock(cancelCurrent(planting),K.seed),2);
 p=advance(planting,2);assert.equal(fact(p,'cropStage'),'planted');
 assert.throws(()=>run(p,'mg.farm.plant_grain'),/./,'occupied plot');
 p=job(p,'mg.farm.tend_crop',1);p=job(reload(p),'mg.farm.grow_greens',3);
 p=run(p,'mg.farm.harvest_greens');assert.equal(stock(p,K.greens),3);
 assert.throws(()=>run(p,'mg.farm.harvest_greens'),/./,'second harvest');
 p=job(p,'mg.farm.plant_grain',3);p=job(p,'mg.farm.tend_crop',1);p=job(p,'mg.farm.grow_grain',6);p=run(p,'mg.farm.harvest_grain');
 assert.equal(stock(p,K.grain),5);assert.equal(stock(p,K.seed),0);
});

test('SOURCE MG07 commissions and Orin foreman: delivery pays once; foreman order, retrieval and execution',()=>{
 let p=buy(opened(),'log',5);
 const careful=run(p,'mg.workshop.bram_careful');assert.equal(stock(careful,K.log),2);assert.equal(stock(cancelCurrent(careful),K.log),5);
 p=job(p,'mg.workshop.bram_ordinary',4);assert.throws(()=>run(p,'mg.workshop.bram_careful'),/./,'one order');
 p=run(p,'mg.workshop.deliver_bram_ordinary');assert.equal(stock(p,K.crate),0);
 assert.throws(()=>run(p,'mg.workshop.deliver_bram_ordinary'));
 // Foreman: commission, stop before execution and collect logs; fee stays with Orin.
 let f=run(p,'mg.foreman.commission');assert.equal(stock(f,K.log),1);assert.equal(coins(f,I.orin),32);assert.equal(npc(f,I.orin,K.log),8);
 assert.throws(()=>run(f,'mg.foreman.commission'),/./,'one outstanding order');
 const retrieved=run(f,'mg.foreman.retrieve_inputs');assert.equal(stock(retrieved,K.log),3);assert.equal(coins(retrieved,I.orin),32);
 f=run(f,'mg.foreman.execute');assert.equal(f.state.simulation.jobs.some(j=>j.actorId===I.orin),true);
 assert.throws(()=>run(f,'mg.foreman.retrieve_inputs'),/./,'running job must be stopped first');
 const stopped=act(f,{type:'delegate_cancel',id:f.state.simulation.jobs.find(j=>j.actorId===I.orin).id});
 assert.equal(npc(stopped,I.orin,K.log),8);assert.equal(stopped.state.simulation.people[I.orin].vitals.stamina,20);
 f=advance(f,4);assert.equal(stock(f,K.crate),1);assert.equal(npc(f,I.orin,K.log),6);assert.equal(f.state.actors[I.orin].facts['mg.foremanReady'],false);
});

test('SOURCE MG08 aid: loan collected once after paid work; gift and refusal never collectible; extension adds nothing',()=>{
 let p=buy(run(opened(),'mg.aid.sela_request'),'log',2);
 assert.throws(()=>run(p,'mg.aid.repay_sela_loan'));
 const gift=run(p,'mg.aid.gift_sela');assert.equal(gift.external.money,p.external.money-8);
 const refused=run(p,'mg.aid.refuse_sela');assert.equal(refused.external.money,p.external.money);
 p=run(p,'mg.aid.lend_sela');assert.equal(coins(p,I.sela),48);
 p=run(p,'mg.aid.extend_sela_loan');assert.equal(coins(p,I.sela),48);assert.throws(()=>run(p,'mg.aid.extend_sela_loan'));
 assert.throws(()=>run(p,'mg.aid.repay_sela_loan'),/./,'no repayment before paid work');
 p=job(p,'mg.aid.mira_funded_work',5);p=run(p,'mg.aid.deliver_mira_work');assert.equal(coins(p,I.sela),58);
 const money=p.external.money;p=run(reload(p),'mg.aid.repay_sela_loan');assert.equal(p.external.money,money+8);assert.equal(coins(p,I.sela),50);
 assert.throws(()=>run(p,'mg.aid.repay_sela_loan'));
 for(const q of [gift,refused]){let r=buy(q,'log',0);r=buy(r,'log',2);r=job(r,'mg.aid.mira_funded_work',5);r=run(r,'mg.aid.deliver_mira_work');assert.throws(()=>run(r,'mg.aid.repay_sela_loan'));}
});

test('SOURCE MG10 restoration and MG09 exhibition: conserve, display, exhibition, withdraw; sale-grade sale',()=>{
 let p=run(wonLot(),'mg.restoration.inspect');p=buy(buy(p,'cloth'),'log');
 const conserving=run(p,'mg.restoration.conserve');assert.equal(stock(conserving,K.damaged),0);
 const undone=cancelCurrent(conserving);assert.equal(stock(undone,K.damaged),1);assert.equal(stock(undone,K.cloth),1);
 let sale=job(p,'mg.restoration.sale_grade',6);assert.equal(stock(sale,K.restored),1);assert.equal(stock(sale,K.cloth),1);
 sale=run(sale,'mg.restoration.sell_restored');assert.equal(coins(sale,I.bram),186);assert.throws(()=>run(sale,'mg.restoration.sell_restored'));
 p=job(p,'mg.restoration.conserve',5);assert.equal(stock(p,K.conserved),1);
 p=run(p,'mg.restoration.display_conserved');assert.equal(npc(p,I.mira,K.conserved),1);assert.equal(fact(p,'displayedKind'),'conserved');
 assert.throws(()=>run(p,'mg.restoration.display_conserved'));
 p=run(p,'mg.event.book');p=run(p,'mg.event.prepare_exhibition_conserved');
 const hosting=run(p,'mg.event.host_exhibition_conserved');const before=hosting.external.money;
 p=advance(reload(hosting),7);assert.equal(p.external.money,before+8);assert.equal(fact(p,'eventBooked'),false);assert.equal(npc(p,I.mira,K.conserved),1);
 p=run(p,'mg.restoration.withdraw_conserved');assert.equal(stock(p,K.conserved),1);assert.equal(fact(p,'displayedKind'),false);
});

test('SOURCE MG09 meal gathering: needs real food; cancel active host refunds; cancel booking refunds fee',()=>{
 let p=run(opened(),'mg.event.book');assert.equal(p.external.money,100);
 assert.throws(()=>run(p,'mg.event.prepare_meal_greens'),/./,'no greens');
 const refund=run(p,'mg.event.cancel_booking');assert.equal(refund.external.money,102);assert.equal(fact(refund,'eventBooked'),false);
 p.gameplay.player.inventory[K.greens]=1;p=run(p,'mg.event.prepare_meal_greens');
 const hosting=run(p,'mg.event.host_greens');assert.equal(stock(hosting,K.greens),0);
 const stopped=cancelCurrent(hosting);assert.equal(stock(stopped,K.greens),1);assert.equal(fact(stopped,'eventProgram'),'greens');
 p=advance(hosting,5);assert.equal(p.external.money,103);assert.equal(coins(p,I.sela),37);assert.throws(()=>run(p,'mg.event.host_greens'));
});

test('SOURCE persistence: courtyard state survives expansion save/load with a held job; edited balances, stock and partial charter are rejected',()=>{
 let p=job(workshopRoom(),'mg.room.workshop_batch',4);p=run(p,'mg.farm.rent_plot');p=run(run(p,'mg.ship.hear_order'),'mg.ship.crate.local');
 const saved=JSON.parse(JSON.stringify(p.state));
 const state=loadExpansionState(saved,registry);
 assert.deepEqual(state,p.state);
 assert.equal(playerJobs({state}).length,1);assert.equal(fact({state},'plotRight'),true);
 const resumed=advance({...p,state},3);assert.equal(resumed.external.money,p.external.money+8);
 const forged=structuredClone(p.state);forged.actors[I.bram].resources.coins+=5;assert.throws(()=>loadExpansionState(forged,registry),/Courtyard/);
 const dupe=structuredClone(p.state);dupe.simulation.owners[I.mira][K.log]+=1;assert.throws(()=>loadExpansionState(dupe,registry),/Courtyard/);
 const partial=structuredClone(p.state);delete partial.actors.player.facts['mg.opened'];assert.throws(()=>loadExpansionState(partial,registry),/Courtyard/);
});

test('SOURCE old saves without courtyard state load unchanged and gain no courtyard records',()=>{
 const old=initializeExpedition(createExpansionState(17));
 const loaded=loadExpansionState(JSON.parse(JSON.stringify(old)),registry);
 assert.deepEqual(loaded,loadExpansionState(JSON.parse(JSON.stringify(old)),registry));
 assert.equal(Object.keys(loaded.actors).some(id=>id.startsWith('mg.')),false);
 assert.equal(loaded.actors.player.facts['mg.opened'],undefined);
});

test('SOURCE courtyard items register with the native id that acquisition logging reads',async()=>{
 const {registerManagementItems,itemSpecifications}=await import('../src/management/foundation.js');
 const templates={};registerManagementItems({itemTemplates:templates,OtherItem:class{constructor(o){Object.assign(this,o);}}});
 for(const s of itemSpecifications){assert.equal(templates[s.id].id,s.id);assert.ok(Object.values(K).includes(JSON.stringify({id:s.id}))||['Courtyard seed packet'].includes(s.id));}
 assert.throws(()=>registerManagementItems({itemTemplates:templates,OtherItem:Object}),/Duplicate/);
});
