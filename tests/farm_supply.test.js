import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitManagement,managementContext} from '../src/management/host.js';
import {validateManagementState} from '../src/management/validation.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {configureFarmSupply,farmSupplyKeep,farmSupplyView} from '../src/management/farm_supply.js';
import {configureHiredHands} from '../src/hired_hands.js';
import {domainRegistry} from '../src/domain_registry.js';
import {I,K} from '../src/management/shared.js';
import {PLOT_JOB} from '../src/hired_hands_plot.js';
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const box={p:null,fail:false};let baseline;
const ctx=p=>managementContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},facts:{location:p.state.simulation?.people.player.location||'Village'},nativeBody:body,nativeAlive:true,nativeReady:true,managementPlayerLocation:'Village',managementPlayerAlive:true,managementHost:true});
const run=id=>{box.p={...box.p,...commitManagement(box.p.state,registry,{id},ctx(box.p))};return box.p;};
function advance(n){const p=box.p,c=ctx(p),others=Object.fromEntries(Object.keys(p.state.simulation.people).filter(id=>id!=='player').map(id=>[id,{...c,actorId:id,vitals:p.state.simulation.people[id].vitals,facts:{...c.facts,location:undefined}}]));
 box.p={...p,...advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player},...others})};domainRegistry.tick(n);return box.p;}
const job=(id,n)=>{run(id);return advance(n);};
const stock=()=>box.p.gameplay.player.inventory[K.grain]||0,pantry=()=>box.p.state.simulation.owners[I.mira][K.grain]||0;
function setup(){
 if(!baseline){box.p={state:initializeExpedition(createExpansionState(17)),external:{money:300},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};run(I.begin);run('mg.farm.rent_plot');run('mg.supply.seed');run('mg.event.book');baseline=structuredClone(box.p);}
 box.p=structuredClone(baseline);box.fail=false;domainRegistry.load({});
 configureFarmSupply({root:()=>box.p.state,plan:()=>structuredClone(box.p),context:p=>ctx(p),registry,commitCommand:commitSimulationCommand,previewCommand:previewSimulationCommand,writable:()=>true,idle:()=>!box.p.state.simulation.jobs.some(j=>j.actorId==='player'),commit:p=>{if(box.fail)throw Error('test writer rejection');validateManagementState(p.state,registry.simulation);box.p=p;}});
 configureHiredHands({plan:()=>structuredClone(box.p),commit:p=>{if(box.fail)throw Error('test writer rejection');validateManagementState(p.state,registry.simulation);box.p=p;},writable:()=>true,idle:()=>true,logMessage:()=>{}});
}
const order=keep=>domainRegistry.command('farmSupply','order')({keep}),clear=()=>domainRegistry.command('farmSupply','clear')();
const grow=()=>{job('mg.farm.plant_grain',3);job('mg.farm.tend_crop',1);job('mg.farm.grow_grain',6);return run('mg.farm.harvest_grain');};

test('order exists before food; manual harvest transfers one portion and retains acquisition receipts',()=>{
 setup();assert.equal(stock(),0);order(4);assert.equal(stock(),0);assert.equal(pantry(),0);assert.equal(box.p.state.actors.player.facts['mg.eventProgram'],'grain');
 const out=grow();assert.equal(stock(),4);assert.equal(pantry(),1);assert.equal(out.acquisitions.filter(r=>r.owner==='player'&&r.key===K.grain).reduce((n,r)=>n+r.count,0),5);
 assert.throws(()=>order(4));assert.throws(()=>run('mg.farm.harvest_grain'));assert.equal(pantry(),1);
 box.p.state=loadExpansionState(JSON.parse(JSON.stringify(box.p.state)),registry);assert.equal(pantry(),1);assert.equal(box.p.state.actors.player.completed['mg.farm_supply.receive'],1);
});
test('meal reservation refunds to Mira, needs her physical presence and settles its existing payment once',()=>{
 setup();order(4);grow();const money=box.p.external.money,budget=box.p.state.actors[I.bram].resources.coins;
 run('mg.farm_supply.host');assert.equal(pantry(),0);box.p.state=loadExpansionState(JSON.parse(JSON.stringify(box.p.state)),registry);
 const pending=box.p.state.simulation.jobs.find(j=>j.commandId==='mg.farm_supply.host');box.p={...box.p,...cancelSimulationJob(box.p.state,registry,pending.id,ctx(box.p))};assert.equal(pantry(),1);assert.equal(box.p.external.money,money);
 box.p.state.simulation.people[I.mira].location='Shack';assert.throws(()=>run('mg.farm_supply.host'));assert.equal(pantry(),1);
 box.p.state.simulation.people[I.mira].location='Village';run('mg.farm_supply.host');box.p.state.simulation.people[I.mira].location='Shack';advance(6);assert.equal(pantry(),1);assert.equal(box.p.external.money,money);
 box.p.state.simulation.people[I.mira].location='Village';job('mg.farm_supply.host',6);assert.equal(pantry(),0);assert.equal(stock(),4);assert.equal(box.p.external.money,money+5);assert.equal(box.p.state.actors[I.bram].resources.coins,budget-5);assert.throws(()=>run('mg.farm_supply.host'));assert.equal(farmSupplyKeep(box.p.state),4);
});
test('keep-at-yield holds all food; cancelling returns exact stock and does not silently clear holdback',()=>{
 setup();order(5);grow();assert.equal(stock(),5);assert.equal(pantry(),0);clear();run('mg.event.cancel_booking');
 setup();order(4);grow();const money=box.p.external.money;run('mg.event.cancel_booking');assert.equal(stock(),5);assert.equal(pantry(),0);assert.equal(box.p.external.money,money+2);assert.equal(farmSupplyView(box.p.state).phase,'released');assert.equal(farmSupplyKeep(box.p.state),4);clear();assert.equal(farmSupplyKeep(box.p.state),0);assert.equal(stock(),5);
});
test('hired harvest funds food before old market sales; explicit clear resumes the same sale order',()=>{
 setup();order(4);domainRegistry.command('hired_hands','hire')({jobId:PLOT_JOB,hand:I.sela,crop:'grain'});domainRegistry.command('hired_hands','order')({jobId:PLOT_JOB,sellAbove:0});
 advance(4320);assert.equal(stock(),4);assert.equal(pantry(),1);const rec=domainRegistry.project('hired_hands').hires.find(h=>h.jobId===PLOT_JOB);assert.equal(rec.sellAbove,0);
 const money=box.p.external.money;job('mg.farm_supply.host',6);assert.equal(stock(),4);assert.equal(box.p.external.money,money+5);clear();advance(1);assert.equal(stock(),0);assert.ok(box.p.external.money>money+5);assert.equal(domainRegistry.project('hired_hands').hires.find(h=>h.jobId===PLOT_JOB).sellAbove,0);
});
test('writer rejection leaves no order or duplicated transfer, and typed records reject corrupt saves',()=>{
 setup();box.fail=true;assert.throws(()=>order(4),/writer/);assert.equal(box.p.state.actors.player.facts['farmSupply.phase'],undefined);box.fail=false;order(4);assert.equal(box.p.state.actors.player.completed['mg.farm_supply.plan'],1);grow();
 box.fail=true;assert.throws(clear,/writer/);assert.equal(pantry(),1);box.fail=false;clear();assert.equal(pantry(),0);assert.equal(stock(),5);
 for(const [key,value]of [['keep',-1],['keep',1.5],['phase','unknown'],['booking',999]]){const bad=structuredClone(box.p.state);bad.actors.player.facts['farmSupply.'+key]=value;assert.throws(()=>loadExpansionState(bad,registry),/Farm supply/);}
 const missing=structuredClone(box.p.state);delete missing.actors.player.facts['farmSupply.phase'];assert.throws(()=>loadExpansionState(missing,registry),/Farm supply/);
});
