import test from 'node:test';
import assert from 'node:assert/strict';
import {createFieldFixture,joinField,fieldCommand,fieldReload,wood,kit} from '../scripts/field_fixtures.mjs';
import {stageCompanionStockTransfer} from '../src/native_storage_transaction.js';
import {stockOwnerView} from '../src/stock_view.js';

const setup=()=>{const p=fieldCommand(joinField(createFieldFixture()),'party.meet');p.gameplay.player.inventory[wood]=5;return p;};
const ask=(p,extra={})=>({direction:'entrust',companionId:'partyPartner',sequence:p.state.sequence,items:[{item_key:wood,count:2,expectedCount:5}],...extra});
const stage=(p,req,more={})=>stageCompanionStockTransfer({state:p.state,gameplay:p.gameplay,money:p.external.money,equipment:{player:{}},favorites:{},request:req,...more});
const apply=(p,out)=>({...p,state:out.state,gameplay:out.gameplay});

test('O4 hand-over records a loan, moves stock once, and take-back returns the whole loan',()=>{
 const p=setup(),before=structuredClone(p),out=stage(p,ask(p));
 assert.deepEqual(p,before);
 assert.equal(out.gameplay.player.inventory[wood],3);assert.equal(out.state.simulation.owners.partyPartner[wood],2);
 const [[loanId,loan]]=Object.entries(out.state.simulation.custody);
 assert.deepEqual([loan.owner,loan.holder,loan.key,loan.count],['player','partyPartner',wood,2]);
 const q=fieldReload(apply(p,out)),view=stockOwnerView({state:q.state,carried:q.gameplay.player.inventory});
 assert.equal(view.holders.find(h=>h.kind==='companion').rows.find(r=>r.key===wood).borrowedFrom[0].owner,'player');
 assert.deepEqual(view.holders[0].rows.find(r=>r.key===wood).lentTo.map(l=>l.count),[2]);
 const back=stage(q,{direction:'retrieve',companionId:'partyPartner',sequence:q.state.sequence,items:[{item_key:wood,loanId,expectedCount:2}]});
 assert.equal(back.gameplay.player.inventory[wood],5);assert.equal(back.state.simulation.owners.partyPartner[wood],undefined);assert.deepEqual(back.state.simulation.custody,{});
 assert.throws(()=>stage(apply(q,back),{direction:'retrieve',companionId:'partyPartner',sequence:back.state.sequence,items:[{item_key:wood,loanId,expectedCount:2}]}),/changed/);
});

test('O4 stale, favorite, equipped, quantity and holder protections reject without partial stock',()=>{
 const p=setup(),before=structuredClone(p);
 for(const [req,more,re] of [[ask(p,{sequence:-1}),{},/stale/],[ask(p,{items:[{item_key:wood,count:2,expectedCount:4}]}),{},/stale or unavailable/],
  [ask(p,{items:[{item_key:wood,count:6,expectedCount:5}]}),{},/exact quantity/],[ask(p),{favorites:{[wood]:true}},/Favorite/],
  [ask(p,{companionId:'player'}),{},/Unsupported/],[ask(p,{companionId:'nobody'}),{},/no stock/],[ask(p,{direction:'gift'}),{},/Unsupported/],
  [ask(p,{items:[{item_key:wood,count:1,expectedCount:5},{item_key:wood,count:1,expectedCount:5}]}),{},/twice/]])
  assert.throws(()=>stage(p,req,more),re);
 const gear={...p,gameplay:{...p.gameplay,player:{...p.gameplay.player,inventory:{}}}};
 assert.throws(()=>stage(gear,ask(p),{equipment:{player:{weapon:wood}}}),/Unequip/);
 assert.deepEqual(p,before);
});

test('O4 goods the carrier holds on loan cannot be handed on, and a consumed loan blocks take-back',()=>{
 const p=setup();
 p.state.simulation.custody['loan.test']={owner:'partyPartner',holder:'player',key:wood,count:1,at:0,cause:'fixture'};
 assert.throws(()=>stage(p,ask(p)),/borrowed/i);
 const q=setup(),out=apply(q,stage(q,ask(q))),[loanId]=Object.keys(out.state.simulation.custody);
 delete out.state.simulation.owners.partyPartner[wood];
 assert.throws(()=>stage(out,{direction:'retrieve',companionId:'partyPartner',sequence:out.state.sequence,items:[{item_key:wood,loanId,expectedCount:2}]}),/no longer/);
});

test('O4 view is hidden until the companion is met and never writes',()=>{
 const p=joinField(createFieldFixture());
 assert.equal(stockOwnerView({state:p.state,carried:{[wood]:1}}).holders.length,1);
 const m=setup(),snap=structuredClone(m.state);stockOwnerView({state:m.state,carried:m.gameplay.player.inventory,chest:{[wood]:3}});
 assert.deepEqual(m.state,snap);
 assert.deepEqual(stockOwnerView({state:m.state,carried:{[wood]:1},chest:{[wood]:3}}).holders.map(h=>h.kind),['carried','chest','companion']);
 assert.equal(m.state.simulation.owners.partyPartner[kit],1);
});
