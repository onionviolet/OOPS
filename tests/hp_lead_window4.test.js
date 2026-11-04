import test from 'node:test';
import assert from 'node:assert/strict';
import {ladderBreakdown,ladderLabel,ladderAmount,validLadder} from '../src/coin_ladder.js';
import {validateHpLeadCast,withHpLeadCast} from '../src/book_world_hp_lead_pack.js';
import {hpLeadHoldingsReaders} from '../src/book_world_hp_lead_domain.js';
import {lifeHoldings,registerOwnHoldings,ownHoldingsView} from '../src/own_holdings.js';
import {configureUiPorts} from '../src/ui_ports.js';
import {hpLeadLife} from '../src/world_packs/book_hp_lead_life_data.js';
// Name-free checks for window 4: a coin ladder (G7), per-holder money (G7), a particular item (G6) and knowledge held by someone else (G8).
const P='book.hp.lead',LADDER=[{one:'gold',many:'golds',size:17*29},{one:'silver',many:'silvers',size:29},{one:'copper',many:'coppers',size:1}];
const act=(id,extra={})=>({id:`${P}.${id}`,place:`${P}.cupboard`,minutes:5,label:'a',description:'d',report:'r',knowledgeKey:`${P}.${id}.seen`,operation:'use',effects:[],...extra});
const pack=(acts,more={})=>({schema:'hp-cast/1',householdActs:{acts,sequences:[]},locations:[],people:[],...more});
test('G7: the ladder is exact (17 silver to a gold, 29 copper to a silver) and display only',()=>{
 assert.equal(validLadder(LADDER),true);
 assert.equal(ladderLabel(7*493,LADDER),'7 golds');
 assert.equal(ladderLabel(11*17*29+5*29+3,LADDER),'11 golds 5 silvers 3 coppers');
 assert.equal(ladderLabel(1,LADDER),'1 copper');assert.equal(ladderLabel(0,LADDER,'empty'),'empty');
 for(const n of [0,1,28,29,492,493,494,5423,14790])assert.equal(ladderAmount(Object.fromEntries(ladderBreakdown(n,LADDER).map(({coin,count})=>[coin.one,count])),LADDER),n);
 assert.throws(()=>ladderBreakdown(1.5,LADDER));assert.throws(()=>ladderBreakdown(-1,LADDER));
 assert.equal(validLadder([{one:'a',many:'as',size:5}]),false,'must end at the smallest coin');
 assert.equal(validLadder([...LADDER].reverse()),false,'largest first');
});
test('G8: another character\'s knowledge is written only for people in the act (a leak is rejected at load)',()=>{
 const know=actor=>({type:'knowledge',actor,key:`${P}.k`,stage:'seen',value:'v'});
 assert.deepEqual(validateHpLeadCast(pack([act('a',{participants:[`${P}.x`],effects:[know(`${P}.x`)]})])),[]);
 assert.deepEqual(validateHpLeadCast(pack([act('a',{participants:[`${P}.x`],effects:[know(`${P}.y`)]})])),['knowledge-holder'],'y is not in the act');
 assert.deepEqual(validateHpLeadCast(pack([act('a',{effects:[know(`${P}.y`)]})])),['knowledge-holder'],'no participants, no holders');
 assert.deepEqual(validateHpLeadCast(pack([act('a',{effects:[know('player')]})])),[],'the player\'s own knowledge is always allowed');
});
test('G7 and G6: currency and items are checked as data, and merge into the native life without touching the stub',()=>{
 const items=[{id:`${P}.thing`,label:'A particular thing'}];
 assert.deepEqual(validateHpLeadCast(pack([act('a')],{currency:{resource:`${P}.coin`,ladder:LADDER},items})),[]);
 assert.deepEqual(validateHpLeadCast(pack([act('a')],{currency:{resource:`${P}.coin`,ladder:[]}})),['currency']);
 assert.deepEqual(validateHpLeadCast(pack([act('a')],{items:[{id:'x.y',label:'z'}]})),['items']);
 const before=structuredClone(hpLeadLife),native=withHpLeadCast(hpLeadLife,pack([act('a',{place:`${P}.cupboard`})],{items}));
 assert.deepEqual(hpLeadLife,before,'the public stub is not mutated');
 assert.deepEqual(native.items.map(i=>i.id),[`${P}.thing`]);assert.equal(native.items[0].value,1);
 assert.deepEqual(hpLeadLife.items,[]);
});
test('G7: money is per holder; the purse shows only the player\'s own resource and falls back before any exists',()=>{
 const cast={currency:{resource:`${P}.coin`,ladder:LADDER},items:[{id:`${P}.thing`,label:'A particular thing'}]};
 const state=(player,vault)=>({actors:{player:{resources:player===null?{}:{[`${P}.coin`]:player}},[`${P}.vault`]:{resources:{[`${P}.coin`]:vault}}},simulation:{people:{player:{inventory:'native'}},owners:{}}});
 const readers=hpLeadHoldingsReaders(()=>cast);
 assert.equal(readers.purse(state(null,493000)),undefined,'the vault is not the purse: no purse resource yet falls back');
 assert.equal(readers.purse(state(30*493,970*493)),'30 golds');
 assert.equal(readers.purse(state(0,1)),'an empty purse');
 assert.equal(lifeHoldings(state(1,2),`${P}.vault`).resources[`${P}.coin`],2,'the vault is a separate holder');
 assert.equal(hpLeadHoldingsReaders(()=>null).purse(state(5,5)),undefined,'no pack, no reader text');
 configureUiPorts({character:()=>({getItems:()=>({[JSON.stringify({id:`${P}.thing`})]:{count:1},[JSON.stringify({id:'bread'})]:{count:3}})})});
 assert.deepEqual(readers.items(),['A particular thing'],'only the life\'s own declared items');
 const off=registerOwnHoldings('t.w4',{purse:'none',items:'nothing',body:'b'},readers);
 try{assert.equal(ownHoldingsView('t.w4',state(null,1)).purse,'none');assert.equal(ownHoldingsView('t.w4',state(493,1)).purse,'1 gold');}finally{off();}
});
