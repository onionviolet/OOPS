import test from 'node:test';
import assert from 'node:assert/strict';
import {personalEarmarkEffects,personalShoppingView,COMMISSION_EARMARK} from '../src/lotm_personal_earmark.js';
const command={id:'purchase',costs:[{type:'resource',key:'money',native:true,amount:-96}]},offer={eligible:true,reasons:[],label:'Buy supplies'};
const state=amount=>({actors:{player:{facts:{[COMMISSION_EARMARK]:amount}}}});
test('legacy saves have no intended reserve and previews are read-only',()=>{
 const s={actors:{player:{facts:{}}}},before=JSON.stringify(s),view=personalShoppingView(s,1000,command,offer);
 assert.equal(view.earmark,0);assert.equal(view.available,1000);assert.equal(JSON.stringify(s),before);
});
test('intent can exceed the purse, while the actual purchase remains eligible and quotes the shortfall',()=>{
 const view=personalShoppingView(state(960),1000,command,offer);
 assert.equal(view.available,40);assert.equal(view.quote.afterTotal,904);assert.equal(view.quote.afterAvailable,0);assert.equal(view.quote.afterShortfall,56);assert.equal(view.quote.eligible,true);
 assert.equal(personalShoppingView(state(960),900,command,offer).shortfall,60);
 assert.equal(personalShoppingView(state(800),904,command,offer).available,104);
});
test('revision changes one scalar intention and cannot mint, transfer or hold native money',()=>{
 for(const amount of [0,960,800,1000.5])assert.deepEqual(personalEarmarkEffects(amount),[{type:'fact',scope:'actor',actor:'player',key:COMMISSION_EARMARK,value:amount}]);
 for(const amount of [-1,NaN,Infinity,0.1,'960'])assert.throws(()=>personalEarmarkEffects(amount));
 assert.equal(personalShoppingView(state(960),1000,command,null).quote,null);
});
