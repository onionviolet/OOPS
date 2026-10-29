import test from 'node:test';
import assert from 'node:assert/strict';
import {defineCards,dueCards,quoteCards,renderCardLine,pendingCardReports,settleCardReports} from '../src/cast_card_runtime.js';

const row=(overrides={})=>({schema:'event-card/1',id:'card:fixture.scene#1',stepId:'fixture.scene#1',scene:'fixture.scene',threadId:'fixture.thread',verb:'opens',object:'the box',kind:'act',actor:'lead',place:'fixture.room',packPlaceId:'fixture.room',present:[],time:{date:{offsetDays:2},timeOfDay:null,precision:'day'},order:{sceneOrder:1,step:1,steps:2},inputs:[],outputs:[],gains:[],requires:[],effects:[{type:'fact',key:'fixture.box.open',value:true,class:'state'},{type:'knowledge',fact:'fixture.box.open',change:'I saw the box open.',from:'witness',locator:'fixture.locator'}],choices:[],lockedOptions:['leave it closed'],evidence:[],source:'script',...overrides});
const binding={worldId:'fixture.world',actorId:'fixture.other',group:'fixture.cast',situationId:'fixture.situation'};
const cards=()=>defineCards({cards:[row()]},binding);
const state=()=>({clock:10,worlds:{'fixture.world':{facts:{}}}});

test('validates and binds generic event-card rows to any actor',()=>{
 const [card]=cards();
 assert.equal(card.actorId,'fixture.other');
 assert.equal(card.effects[0].actor,'fixture.other');
 assert.equal(card.effects[0].provenance,'canon');
 assert.deepEqual(card.effects[1].basis,{kind:'observation',attributedTo:'fixture.other',situationId:'fixture.situation',provenance:'canon',fact:'fixture.box.open',from:'witness',locator:'fixture.locator'});
 assert.throws(()=>defineCards({cards:[row({unexpected:true})]},binding),/Unsupported card field/);
 assert.throws(()=>defineCards({cards:[row(),row()]},binding),/Invalid event card/);
});

test('waits for its scene window, then orders within the scene and reports locked choices',()=>{
 const [card]=cards(),s=state();
 assert.deepEqual(dueCards(s,[card],{day:1}),[]);
 assert.deepEqual(quoteCards(dueCards(s,[card],{scene:card.scene}))[0].lockedOptions,['leave it closed']);
 assert.equal(renderCardLine(card),'fixture.thread: opens the box · Not how it happened: leave it closed');
 const reports=settleCardReports(s,[card],{window:{scene:card.scene},attemptedOptions:{[card.id]:'leave it closed'}});
 assert.equal(reports[0].text,'fixture.thread: opens the box · Not how it happened: leave it closed');
 assert.deepEqual(reports[0].effects,[]);
 assert.equal(pendingCardReports(s,[card]),false);
 assert.deepEqual(dueCards(s,[card],{scene:card.scene}),[]);
});

test('settles due cards once and leaves effects available to the native effect owner',()=>{
 const [card]=cards(),s=state();
 assert.equal(pendingCardReports(s,[card]),false);
 const reports=settleCardReports(s,[card],{window:{day:2},decide:()=>({allowed:true})});
 assert.equal(reports.length,1);
 assert.equal(reports[0].actor,'fixture.other');
 assert.equal(reports[0].effects.length,2);
 assert.equal(s.worlds[binding.worldId].facts[`lotm.cast.card.${card.id.replace(/[^a-z0-9_.:-]/gi,'_')}.settled`],true);
 assert.equal(s.worlds[binding.worldId].facts[`lotm.cast.card.${card.id.replace(/[^a-z0-9_.:-]/gi,'_')}.applied`],true);
 assert.deepEqual(settleCardReports(s,[card],{window:{day:2}}),[]);
});

test('a refused canon contradiction reports its reason and writes no effects',()=>{
 const [card]=cards(),s=state();
 const [report]=settleCardReports(s,[card],{window:{scene:card.scene},decide:()=>({allowed:false,reason:'A canon fact is contradicted.'})});
 assert.match(report.text,/fixture\.thread: opens the box · Not how it happened: leave it closed · A canon fact is contradicted/);
 assert.deepEqual(report.effects,[]);
});
