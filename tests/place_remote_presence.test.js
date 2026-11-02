import test from 'node:test';
import assert from 'node:assert/strict';
import {remotePresenceFacts,remotePresenceView} from '../src/place_remote_presence.js';
import {definePlaceActs} from '../src/place_acts.js';
import {placeActSequenceView} from '../src/place_act_sequence.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {commitSimulationCommand,previewSimulationCommand} from '../src/simulation.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {registerDomain} from '../src/domain_registry.js';
const room='fixture.remote.room',realm='fixture.remote.realm',guest='fixture.remote.guest',origin='fixture.remote.origin';
const data={remoteSessions:[{id:'fixture.session',worldId:I.world,host:'player',anchor:room,anchorLabel:'Room',location:realm,activeFact:'fixture.session.active',title:'Remote meeting',seats:[{id:guest,origin,controller:origin,label:'Unknown guest',aliasFact:'fixture.guest.alias'}]}],acts:[{id:'fixture.remote.talk',place:room,operation:'inspect',minutes:2,label:'Hear the offer',description:'Hear the connected guest.',report:'An offer, not delivery.',knowledgeKey:'fixture.offer',remoteSession:'fixture.session',targetId:guest,effects:[{type:'fact',scope:'world',key:'fixture.agreement.pending',value:true}]}]};
registerDomain({id:'lotm',projection:(kind,state)=>kind==='facts'?remotePresenceFacts(state,data):null});
const commands=definePlaceActs(data,{worldId:I.world,group:'book_lotm',situationId:I.situation});
for(const [id,d] of createSimulationRegistry({commands,people:[guest,origin].map(id=>({id,revision:1,label:'Fixture',worldId:I.world,inventory:'simulation',location:realm}))}).commands)registry.simulation.commands.set(id,d);
for(const id of [guest,origin])registry.simulation.people.set(id,{id,revision:1,label:'Fixture',worldId:I.world,inventory:'simulation',location:realm});
function setup(){const p=fresh();applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location=room;p.state.worlds[I.world].facts['fixture.session.active']=true;
 for(const id of [guest,origin]){p.state.actors[id]={worldId:I.world,facts:{},resources:{},completed:{},sources:{},techniques:{}};p.state.simulation.people[id]={life:'alive',inventory:'simulation',bornAt:p.state.clock,location:id===guest?realm:'fixture.distant.home',definitionId:id,body:{ownerId:origin,controllerId:origin}};p.state.simulation.owners[id]={};}
 return p;}
const start=p=>({...p,...commitSimulationCommand(p.state,registry,{id:commands[0].id},ctx(p,guest))});
test('a remote conversation reserves the actual presence while originals and their possessions stay elsewhere',()=>{
 let p=setup();p.state.actors[origin].resources.coin=9;
 assert.equal(previewSimulationCommand(p.state,registry,commands[0].id,ctx(p,guest)).eligible,true);
 p=start(p);assert.ok(p.state.simulation.jobs[0].participants.includes(guest));p=JSON.parse(JSON.stringify(p));validateSimulationState(p.state.simulation,p.state,registry.simulation);p=wait(p,2);
 assert.equal(p.state.simulation.people.player.location,room);assert.equal(p.state.simulation.people[origin].location,'fixture.distant.home');assert.equal(p.state.actors[origin].resources.coin,9);
 assert.equal(p.state.worlds[I.world].facts['fixture.agreement.pending'],true);assert.equal(p.state.simulation.knowledge.player['fixture.offer'].value,'An offer, not delivery.');
 assert.equal(p.state.actors.player.resources.coin,undefined);
});
test('lost channel, remote presence or original support prevents settlement and knowledge grants',()=>{
 for(const change of [p=>p.state.worlds[I.world].facts['fixture.session.active']=false,p=>p.state.simulation.people[guest].location='fixture.away',p=>p.state.simulation.people[origin].life='dead',p=>p.state.simulation.people[guest].body.controllerId='fixture.impostor',p=>p.state.simulation.people.player.location='fixture.away']){
  let p=start(setup());change(p);p=wait(p,2);assert.equal(p.state.simulation.knowledge.player?.['fixture.offer'],undefined);assert.equal(p.state.worlds[I.world].facts['fixture.agreement.pending'],undefined);assert.equal(p.state.simulation.jobs.length,0);
 }
});
test('remote UI exposes configured observer labels, not original identities or offscreen facts',()=>{
 const p=setup();p.state.actors[origin].facts.secret='private';assert.equal(remotePresenceView(p.state,data)[0].seats[0].label,'Unknown guest');p.state.worlds[I.world].facts['fixture.guest.alias']='Chosen name';assert.equal(remotePresenceView(p.state,data)[0].seats[0].label,'Chosen name');assert.equal(JSON.stringify(remotePresenceView(p.state,data)).includes('private'),false);
});
test('contiguous arcs retain native completion while selecting the next arc; partial legacy evidence is not full completion',()=>{
 const rows={acts:[{id:'fixture.first',place:room,knowledgeKey:'fixture.first.seen'},{id:'fixture.second',place:realm,knowledgeKey:'fixture.second.seen'}],sequences:[{id:'first',title:'First',stages:[{commandId:'fixture.first',label:'First'}]},{id:'second',title:'Second',stages:[{commandId:'fixture.second',label:'Second'}]}]};
 const p=setup();p.state.actors.player.completed['fixture.first']={at:p.state.clock};assert.equal(placeActSequenceView(p.state,rows).id,'second');assert.equal(placeActSequenceView(p.state,rows).next.place,realm);assert.equal(placeActSequenceView(p.state,rows).done,false);
});

test('timed purchase reserves actual seller stock and purse, refunds lost support, then settles once',()=>{
 const row={id:'fixture.purchase',place:room,operation:'pay',minutes:2,label:'Buy supplies',description:'Pay for supplies from this seller.',report:'Supplies delivered.',knowledgeKey:'fixture.purchase.seen',targetId:origin,
 costs:[{type:'resource',actor:'player',key:'money',native:true,amount:-9},{type:'resource',actor:origin,key:'loaves',amount:-16}],effects:[{type:'resource',actor:'player',key:'loaves',amount:16},{type:'resource',actor:origin,key:'money',amount:9}]};
 const purchaseData={acts:[row],sequence:{id:'fixture.shopping',title:'Shopping',stages:[{commandId:row.id,label:'Buy'}]}};
 const def=definePlaceActs(purchaseData,{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];registry.simulation.commands.set(def.id,def);
 let p=setup();p.external.money=9;p.state.actors[origin].resources.loaves=16;p.state.simulation.people[origin].location=room;
 const buy=p=>({...p,...commitSimulationCommand(p.state,registry,{id:def.id},ctx(p,origin))});
 p=buy(p);assert.equal(p.external.money,0);assert.equal(p.state.actors[origin].resources.loaves,0);assert.equal(p.state.actors.player.resources.loaves,undefined);
 p.state.simulation.people[origin].location='fixture.away';p=wait(p,2);assert.equal(p.external.money,9);assert.equal(p.state.actors[origin].resources.loaves,16);assert.equal(p.state.simulation.knowledge.player?.[row.knowledgeKey],undefined);
 p.state.simulation.people[origin].location=room;p=buy(p);p=wait(p,2);assert.equal(p.external.money,0);assert.equal(p.state.actors.player.resources.loaves,16);assert.equal(p.state.actors[origin].resources.money,9);assert.throws(()=>buy(p));
});

test('observer stock disclosure reads the actual owner and does not recreate missing stock',async()=>{
 const {placeStockViews}=await import('../src/place_acts.js');const p=setup(),views={stockViews:[{knowledge:'fixture.purchase.seen',title:'Supplies',rows:[{actor:'player',key:'loaves',label:'Carried loaves'}]}]};
 assert.deepEqual(placeStockViews(p.state,views),[]);(p.state.simulation.knowledge.player||={})['fixture.purchase.seen']={stage:'seen'};p.state.actors.player.resources.loaves=12;assert.equal(placeStockViews(p.state,views)[0].rows[0].amount,12);p.state.actors.player.resources.loaves=0;assert.equal(placeStockViews(p.state,views)[0].rows[0].amount,0);
});

test('preview does not draw randomness and restored native work replays the same committed result',()=>{
 const initial=setup(),before=JSON.stringify(initial);
 for(let i=0;i<5;i++)previewSimulationCommand(initial.state,registry,commands[0].id,ctx(initial,guest));
 assert.equal(JSON.stringify(initial),before);
 const accepted=start(initial),restored=JSON.parse(JSON.stringify(accepted));
 const a=wait(accepted,2),b=wait(restored,2);
 assert.deepEqual(b.state.actors.player.completed,a.state.actors.player.completed);
 assert.deepEqual(b.state.simulation.knowledge.player,a.state.simulation.knowledge.player);
 assert.equal(b.state.rng,a.state.rng);assert.deepEqual(b.state.streams,a.state.streams);
});
