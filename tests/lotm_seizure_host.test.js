import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,hostOver} from './lotm_helpers.js';
import {applySeizure,planSeizure} from '../src/recurring_duties.js';
import {LOTM_RENT} from '../src/book_world_lotm_duties.js';
const keyOf=id=>JSON.stringify({id:id==='rag'?'Tingen ordinary comparator sample':id});
const item=key=>{key=JSON.parse(key).id;key=key==='Tingen ordinary comparator sample'?'rag':key;return ({tags:key==='quest'?{quest:true}:{},getValue:({quality})=>key==='rag'?30:100,getName:()=>key});};
function fixture(extra={}){
 const p=fresh();p.gameplay.player.inventory=Object.fromEntries(Object.entries({rag:20,worn:1,quest:1,borrowed:1}).map(([k,n])=>[keyOf(k),n]));p.state.simulation.equipment.player={hand:keyOf('worn')};p.state.simulation.custody.loan={holder:'player',key:keyOf('borrowed')};
 return hostOver(p,{item,...extra});
}
test('the LOTM seizure host reads real holdings and publishes the selected debit, excluding protected goods',()=>{
 const o=fixture(),goods=o.host.heldGoods();assert.equal(goods.find(g=>g.key===keyOf('worn')).equipped,true);assert.equal(goods.some(g=>g.key===keyOf('quest')||g.key===keyOf('borrowed')),false);
 const plan=planSeizure(LOTM_RENT[0],6,goods);assert.equal(plan.taken,360);o.host.seizeGoods(plan.picks);
 assert.equal(o.box.p.gameplay.player.inventory[keyOf('rag')],8);assert.equal(o.box.p.gameplay.player.inventory[keyOf('worn')],1);assert.equal(o.box.p.gameplay.player.inventory[keyOf('quest')],1);assert.equal(o.box.p.gameplay.player.inventory[keyOf('borrowed')],1);
 assert.equal(applySeizure({missed:{[LOTM_RENT[0].id]:6}},LOTM_RENT[0],plan,50).missed[LOTM_RENT[0].id],0);
});
test('a stale request or failed publication consumes nothing',()=>{
 const o=fixture();assert.throws(()=>o.host.seizeGoods([{key:keyOf('worn'),qty:1}]),/no longer available/);assert.throws(()=>o.host.seizeGoods([{key:keyOf('rag'),qty:21}]),/no longer available/);
 const bad=fixture({persist:()=>{throw Error('disk full');}});assert.throws(()=>bad.host.seizeGoods([{key:keyOf('rag'),qty:2}]),/disk full/);assert.equal(bad.box.p.gameplay.player.inventory[keyOf('rag')],20);
});
